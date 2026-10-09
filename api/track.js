// Privacy-friendly analytics: anonymous daily counters only (no cookies, IPs or personal data stored).
// Sent by site.js with navigator.sendBeacon: {t:'pv'|'wa'|'form', p:path, v:firstViewToday, n:firstVisitEver, r:referrerHost}
const { rateLimit } = require('../lib/voice/security');
const store = require('../lib/admin/store');

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|vercel/i;

module.exports = async function handler(req, res) {
  res.statusCode = 204;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST' || !store.configured() || BOT.test(req.headers['user-agent'] || '') || rateLimit(req, 120, 10 * 60 * 1000, 'track')) return res.end();
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  const type = ['pv', 'wa', 'form'].includes(b.t) ? b.t : null;
  if (!type) return res.end();
  const path = String(b.p || '').split('?')[0].slice(0, 120).replace(/[^\w\-/.]/g, '') || '/';
  const ref = String(b.r || '').toLowerCase().replace(/^www\./, '').replace(/[^a-z0-9.\-]/g, '').slice(0, 60);
  try {
    await store.track({ type, path: type === 'pv' ? path : '', visit: Boolean(b.v), firstEver: Boolean(b.n), ref: ref && ref !== 'velarisweb.com' ? ref : '' });
  } catch (err) {
    console.error('track_failed', err.message);
  }
  return res.end();
};
