const { rateLimit, clean, json } = require('../../lib/voice/security');
const knowledge = require('../../data/velaris-knowledge.json');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (rateLimit(req, 15)) return json(res, 429, { error: 'Please wait before checking again.' });
  const timezone = clean((req.body || {}).timezone, 80) || 'UTC';
  // Calendly remains the source of truth. We never synthesize slots in chat.
  return json(res, 200, {
    mode: 'calendly', timezone,
    bookingUrl: knowledge.booking.url,
    message: 'Open the live scheduler to see current availability in your timezone.'
  });
};
