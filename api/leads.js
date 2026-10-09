const { rateLimit, clean, validEmail, json } = require('../lib/voice/security');
const store = require('../lib/admin/store');

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (rateLimit(req, 10, 10 * 60 * 1000, 'leads')) return json(res, 429, { error: 'Please wait before submitting again.' });
  const input = req.body || {};
  const lead = {
    createdAt: new Date().toISOString(),
    source: ['website_plan_modal', 'website_inquiry', 'website_contact'].includes(input.source) ? input.source : 'velaris_voice_agent',
    name: clean(input.name, 120), email: clean(input.email, 180), phone: clean(input.phone, 50),
    company: clean(input.company, 160), website: clean(input.website, 240), industry: clean(input.industry, 160),
    country: clean(input.country, 100), timezone: clean(input.timezone, 80), serviceInterest: clean(input.serviceInterest, 200),
    problem: clean(input.problem, 700), goal: clean(input.goal, 700), budget: clean(input.budget, 80),
    timeline: clean(input.timeline, 100), conversationSummary: clean(input.conversationSummary, 1600),
    wantsCall: Boolean(input.wantsCall), meetingBooked: false, status: input.wantsCall ? 'qualified' : 'new'
  };
  if (!lead.email || !validEmail(lead.email)) return json(res, 400, { error: 'Please provide a valid email address.' });
  if (!lead.name) return json(res, 400, { error: 'Please provide your name.' });
  Object.assign(lead, scoreLead(lead));

  // Save to the private dashboard store and/or the optional CRM webhook; succeed if either works.
  let saved = false;
  if (store.configured()) {
    try {
      await store.saveLead(lead);
      await store.track({ type: 'lead' });
      saved = true;
    } catch (error) {
      console.error('lead_store_failed', error.message);
    }
  }
  if (process.env.CRM_WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(process.env.CRM_WEBHOOK_SECRET ? { 'X-Velaris-Signature': process.env.CRM_WEBHOOK_SECRET } : {}) },
        body: JSON.stringify(lead)
      });
      if (!response.ok) throw new Error(`CRM returned ${response.status}`);
      saved = true;
    } catch (error) {
      console.error('lead_webhook_failed', error.message);
    }
  }
  if (saved) return json(res, 201, { ok: true, status: lead.status });
  if (!store.configured() && !process.env.CRM_WEBHOOK_URL) return json(res, 503, { error: 'Lead storage is not configured. Please message us on WhatsApp.' });
  return json(res, 502, { error: "I couldn't save those details. Please message us on WhatsApp or use the booking page." });
};
