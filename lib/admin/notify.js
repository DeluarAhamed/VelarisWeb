// New-lead alerts. Each channel switches on when its Vercel environment variables are set:
//   Email (Resend):        RESEND_API_KEY + NOTIFY_EMAIL  (optional NOTIFY_FROM, default Resend's onboarding sender)
//   WhatsApp (CallMeBot):  CALLMEBOT_PHONE + CALLMEBOT_APIKEY
//   Telegram:              TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
// Messaging alerts carry only name, plan and source; full contact details stay in the dashboard.
const DASHBOARD = 'https://velarisweb.com/dashboard#leads';
const SOURCES = {
  website_plan_modal: 'Plan pop-up', website_inquiry: 'Inquiry form', website_contact: 'Contact form', velaris_voice_agent: 'Ava assistant',
};

function channels() {
  const env = process.env;
  return {
    email: Boolean(env.RESEND_API_KEY && env.NOTIFY_EMAIL),
    whatsapp: Boolean(env.CALLMEBOT_PHONE && env.CALLMEBOT_APIKEY),
    telegram: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
  };
}

const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function summary(lead) {
  const plan = lead.budget || 'plan not chosen';
  const source = SOURCES[lead.source] || lead.source || 'website';
  return `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ''} - ${plan} - via ${source}${lead.classification ? ` - ${lead.classification}` : ''}`;
}

async function post(url, init) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`${new URL(url).host} returned ${res.status}`);
}

async function sendEmail(lead) {
  const rows = [
    ['Name', lead.name], ['Email', lead.email], ['Phone', lead.phone], ['Company', lead.company], ['Plan', lead.budget],
    ['Interest', lead.serviceInterest], ['Project', lead.problem], ['Goal', lead.goal], ['Timeline', lead.timeline],
    ['Source', SOURCES[lead.source] || lead.source], ['Landing page', lead.landingPage], ['Came from', [lead.referrer, lead.utm].filter(Boolean).join(' · ')],
    ['Score', lead.score != null ? `${lead.score} (${lead.classification})` : ''],
  ].filter(([, v]) => v);
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#0B1B33">
<h2 style="margin:0 0 12px">New lead: ${esc(lead.name)}</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#6B7686;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>
<p style="margin-top:18px"><a href="${DASHBOARD}" style="background:#127AFE;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Open in dashboard</a></p></div>`;
  await post('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || 'Velaris Leads <onboarding@resend.dev>',
      to: process.env.NOTIFY_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
      subject: summary(lead),
      html,
      ...(lead.email ? { reply_to: lead.email } : {}),
    }),
  });
}

async function sendWhatsApp(lead) {
  const q = new URLSearchParams({ phone: process.env.CALLMEBOT_PHONE, apikey: process.env.CALLMEBOT_APIKEY, text: `${summary(lead)}\n${DASHBOARD}` });
  await post(`https://api.callmebot.com/whatsapp.php?${q}`, { method: 'GET' });
}

async function sendTelegram(lead) {
  await post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: `${summary(lead)}\n${DASHBOARD}`, disable_web_page_preview: true }),
  });
}

// Never throws: a failed alert must not lose the lead.
async function notifyNewLead(lead) {
  const on = channels();
  const jobs = [];
  if (on.email) jobs.push(['email', sendEmail(lead)]);
  if (on.whatsapp) jobs.push(['whatsapp', sendWhatsApp(lead)]);
  if (on.telegram) jobs.push(['telegram', sendTelegram(lead)]);
  const results = await Promise.allSettled(jobs.map(([, p]) => p));
  results.forEach((r, i) => { if (r.status === 'rejected') console.error('lead_notify_failed', jobs[i][0], r.reason && r.reason.message); });
}

module.exports = { notifyNewLead, channels };
