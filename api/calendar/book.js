const { json } = require('../../lib/voice/security');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  return json(res, 409, {
    error: 'Bookings must be confirmed through the live Calendly scheduler so availability can be rechecked securely.',
    bookingUrl: 'https://calendly.com/velarisweb/30min'
  });
};
