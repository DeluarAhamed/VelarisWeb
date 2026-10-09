// Single-owner admin auth: password from the ADMIN_PASSWORD env var, then a signed HttpOnly session cookie.
const crypto = require('crypto');

const COOKIE = 'vw_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const base = process.env.ADMIN_SESSION_SECRET
    || `${process.env.ADMIN_PASSWORD || ''}:${process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || 'velaris'}`;
  return crypto.createHash('sha256').update(base).digest();
}
const sign = (value) => crypto.createHmac('sha256', secret()).update(value).digest('base64url');
const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

function passwordConfigured() {
  return String(process.env.ADMIN_PASSWORD || '').length >= 8;
}

function checkPassword(input) {
  if (!passwordConfigured()) return false;
  // Hash both sides so the comparison is constant-time regardless of length.
  const h = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
  return safeEqual(h(input), h(process.env.ADMIN_PASSWORD));
}

function readCookie(req) {
  const header = req.headers.cookie || '';
  const m = header.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  return m ? decodeURIComponent(m.slice(COOKIE.length + 1)) : '';
}

function isAuthed(req) {
  if (!passwordConfigured()) return false;
  const [exp, mac] = readCookie(req).split('.');
  if (!exp || !mac || Number(exp) < Date.now()) return false;
  return safeEqual(mac, sign(exp));
}

function setSession(res) {
  const exp = String(Date.now() + MAX_AGE * 1000);
  res.setHeader('Set-Cookie', `${COOKIE}=${exp}.${sign(exp)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`);
}

function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

module.exports = { passwordConfigured, checkPassword, isAuthed, setSession, clearSession };
