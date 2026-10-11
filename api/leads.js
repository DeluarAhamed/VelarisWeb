// Website lead capture.
//   GET  /api/leads  -> { token, turnstileSiteKey }  (the form fetches this when a visitor starts filling it in)
//   POST /api/leads  -> validates, filters spam and saves the lead to the private store (+ optional CRM webhook)
const crypto = require('crypto');
const { rateLimit, clientIp, clean, json } = require('../lib/voice/security');
const store = require('../lib/admin/store');
const guard = require('../lib/leads/guard');
const { notifyNewLead } = require('../lib/admin/notify');

const SOURCES = ['website_plan_modal', 'website_inquiry', 'website_contact', 'velaris_voice_agent'];

function scoreLead(lead) {
  let score = 5;
  if (lead.problem) score += 10;
  if (lead.goal) score += 10;
  if (/website.*seo|seo.*website|linkedin.*website|connected/i.test(lead.serviceInterest)) score += 15;
  else if (lead.serviceInterest) score += 10;
  if (/30 days|asap|urgent/i.test(lead.timeline)) score += 15;
  else if (/1.?3 months|month/i.test(lead.timeline)) score += 10;
  if (/scale|one-off|699/i.test(lead.budget)) score += 20;
  else if (/growth|399/i.test(lead.budget)) score += 15;
  else if (/starter|199/i.test(lead.budget)) score += 10;
  if (lead.wantsCall) score += 20;
  return { score, classification: score >= 60 ? 'HOT' : score >= 30 ? 'WARM' : 'EARLY-STAGE' };
}

// Bots get the same response as a real submission, so they can't tell they were filtered.
const fakeOk = (res) => json(res, 201, { ok: true, status: 'new' });

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    if (rateLimit(req, 60, 10 * 60 * 1000, 'lead-token')) return json(res, 429, { error: 'Too many requests.' });
    return json(res, 200, { token: guard.issueToken(), turnstileSiteKey: guard.turnstileOn() ? process.env.TURNSTILE_SITE_KEY : null });
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  // Same-site requests only (blocks forms posted from other websites).
  const origin = req.headers.origin;
  if (origin && !/^https:\/\/(www\.)?velarisweb\.com$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return json(res, 403, { error: 'Forbidden' });

  const ip = clientIp(req);
  if (rateLimit(req, 8, 10 * 60 * 1000, 'leads')) return json(res, 429, { error: 'Please wait a few minutes before submitting again.' });
  if (store.configured()) {
    try {
      if (await store.overLimit(`leads:${ip}`, 8, 60 * 60) || await store.overLimit('leads:all', 60, 60 * 60)) {
        return json(res, 429, { error: 'Please wait a little before submitting again, or message us on WhatsApp.' });
      }
    } catch (err) { console.error('lead_ratelimit_failed', err.message); }
  }

  const input = req.body && typeof req.body === 'object' ? req.body : {};
  // 1. Honeypot: a hidden field real visitors never see or fill in.
  if (clean(input.hp_field, 200)) return fakeOk(res);
  // 2. Signed form token: the page must have been loaded, and the form can't be filled in under 3 seconds.
  const tokenProblem = guard.checkToken(input.formToken);
  if (tokenProblem === 'missing' || tokenProblem === 'invalid' || tokenProblem === 'too_fast') return fakeOk(res);
  if (tokenProblem === 'expired') return json(res, 400, { error: 'This form expired. Please refresh the page and try again.' });
  // 3. Cloudflare Turnstile, when configured.
  if (!(await guard.checkTurnstile(input.turnstileToken, ip))) return json(res, 400, { error: 'Please complete the security check and try again.' });

  const lead = {
    createdAt: new Date().toISOString(),
    source: SOURCES.includes(input.source) ? input.source : 'velaris_voice_agent',
    name: clean(input.name, 120), email: clean(input.email, 180).toLowerCase(), phone: clean(input.phone, 50),
    company: clean(input.company, 160), website: clean(input.website, 240), industry: clean(input.industry, 160),
    country: clean(input.country, 100), timezone: clean(input.timezone, 80), serviceInterest: clean(input.serviceInterest, 200),
    problem: clean(input.problem, 700), goal: clean(input.goal, 700), budget: clean(input.budget, 80),
    timeline: clean(input.timeline, 100), conversationSummary: clean(input.conversationSummary, 1600),
    page: clean(input.page, 160), landingPage: clean(input.landingPage, 160), referrer: clean(input.referrer, 80), utm: clean(input.utm, 160),
    wantsCall: Boolean(input.wantsCall), meetingBooked: false,
  };

  // 4. Required, real-looking contact details.
  if (lead.name.length < 2) return json(res, 400, { error: 'Please enter your full name.' });
  if (!guard.validEmailFormat(lead.email)) return json(res, 400, { error: 'Please enter a valid email address.' });
  const domain = lead.email.split('@')[1];
  if (guard.DISPOSABLE.has(domain)) return json(res, 400, { error: 'Please use your business or personal email, not a temporary address.' });
  if (!(await guard.domainAcceptsMail(domain))) return json(res, 400, { error: 'That email domain can\'t receive email. Please check the address.' });
  const phone = guard.normalizePhone(lead.phone);
  if (!phone) return json(res, 400, { error: 'Please enter a valid phone or WhatsApp number, including the country code.' });
  lead.phone = phone;

  // 5. Content checks: likely spam is kept for review (status "spam"), with no alert sent.
  const spam = guard.spamSignals(lead);
  Object.assign(lead, scoreLead(lead));
  lead.status = spam.spam ? 'spam' : (lead.wantsCall ? 'qualified' : 'new');
  if (spam.reasons.length) lead.spamReasons = spam.reasons;

  // 6. Duplicates: the same email or phone within 10 minutes is treated as one enquiry.
  if (store.configured()) {
    try {
      const fp = crypto.createHash('sha256').update(`${lead.email}|${lead.phone}`).digest('hex').slice(0, 32);
      if (!(await store.firstSeen(`dupe:${fp}`, 10 * 60))) return json(res, 201, { ok: true, status: lead.status === 'spam' ? 'new' : lead.status });
    } catch (err) { console.error('lead_dedupe_failed', err.message); }
  }

  // Save to the private dashboard store and/or the optional CRM webhook; succeed if either works.
  let saved = false;
  if (store.configured()) {
    try {
      await store.saveLead(lead);
      if (!spam.spam) await store.track({ type: 'lead' });
      saved = true;
    } catch (error) {
      console.error('lead_store_failed', error.message);
    }
  }
  if (process.env.CRM_WEBHOOK_URL && !spam.spam) {
    try {
      const response = await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(process.env.CRM_WEBHOOK_SECRET ? { 'X-Velaris-Signature': process.env.CRM_WEBHOOK_SECRET } : {}) },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`CRM returned ${response.status}`);
      saved = true;
    } catch (error) {
      console.error('lead_webhook_failed', error.message);
    }
  }
  if (saved) {
    if (!spam.spam) await notifyNewLead(lead);
    return json(res, 201, { ok: true, status: spam.spam ? 'new' : lead.status });
  }
  if (!store.configured() && !process.env.CRM_WEBHOOK_URL) return json(res, 503, { error: 'Lead storage is not configured. Please message us on WhatsApp.' });
  return json(res, 502, { error: "I couldn't save those details. Please message us on WhatsApp or use the booking page." });
};
