// Spam and abuse protection for /api/leads.
// Layers, cheapest first: honeypot field -> signed form token (proves the page was loaded and the form
// took a human amount of time) -> optional Cloudflare Turnstile -> phone/email validation (incl. MX lookup)
// -> content heuristics. Obvious bots get a fake success so they learn nothing; borderline submissions are
// saved with status "spam" for the owner to review.
const crypto = require('crypto');
const dns = require('dns').promises;

const MIN_FILL_MS = 3000; // faster than any human can fill a form
const MAX_TOKEN_AGE_MS = 6 * 60 * 60 * 1000;

function secret() {
  const base = process.env.LEAD_FORM_SECRET || process.env.ADMIN_SESSION_SECRET
    || `leads:${process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''}:${process.env.ADMIN_PASSWORD || ''}`;
  return crypto.createHash('sha256').update(base).digest();
}
const mac = (v) => crypto.createHmac('sha256', secret()).update(v).digest('base64url');

function issueToken() {
  const ts = String(Date.now());
  const nonce = crypto.randomBytes(6).toString('base64url');
  return `${ts}.${nonce}.${mac(`${ts}.${nonce}`)}`;
}

function checkToken(token) {
  const [ts, nonce, sig] = String(token || '').split('.');
  if (!ts || !nonce || !sig) return 'missing';
  const expected = mac(`${ts}.${nonce}`);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return 'invalid';
  const age = Date.now() - Number(ts);
  if (!(age >= MIN_FILL_MS)) return 'too_fast';
  if (age > MAX_TOKEN_AGE_MS) return 'expired';
  return null;
}

/* ---------- Cloudflare Turnstile (on when TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY are set) ---------- */
const turnstileOn = () => Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
async function checkTurnstile(token, ip) {
  if (!turnstileOn()) return true;
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: String(token).slice(0, 2048), remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const body = await res.json();
    return Boolean(body.success);
  } catch (err) {
    console.error('turnstile_failed', err.message);
    return true; // Cloudflare outage: fall back to the other layers rather than lose real leads
  }
}

/* ---------- phone ---------- */
function normalizePhone(raw) {
  const s = String(raw || '').trim();
  if (!/^\+?[\d\s().-]{7,25}$/.test(s)) return null;
  const digits = s.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  if (/^(\d)\1+$/.test(digits)) return null; // 00000000, 11111111
  if ('01234567890123456789'.includes(digits) || '98765432109876543210'.includes(digits)) return null; // 12345678...
  return (s.startsWith('+') ? '+' : '') + digits;
}

/* ---------- email ---------- */
const DISPOSABLE = new Set(('mailinator.com guerrillamail.com guerrillamail.info sharklasers.com 10minutemail.com 10minutemail.net tempmail.com temp-mail.org '
  + 'tempmail.net throwawaymail.com yopmail.com yopmail.net getnada.com nada.email dispostable.com trashmail.com trashmail.de maildrop.cc '
  + 'mintemail.com fakeinbox.com mailnesia.com moakt.com emailondeck.com tempr.email discard.email spamgourmet.com mohmal.com '
  + 'burnermail.io inboxkitten.com mailcatch.com 33mail.com tempinbox.com spambox.us mytemp.email emailfake.com fakemail.net').split(/\s+/));

function validEmailFormat(email) {
  return /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/.test(email)
    && !email.includes('..');
}

const mxCache = new Map();
async function domainAcceptsMail(domain) {
  if (mxCache.has(domain)) return mxCache.get(domain);
  let ok = true;
  try {
    const mx = await Promise.race([dns.resolveMx(domain), new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), 2500))]);
    ok = Array.isArray(mx) && mx.some((r) => r.exchange && r.exchange !== '.');
  } catch (err) {
    // No MX: accept if the domain has an address record (RFC 5321 fallback); DNS trouble: don't block.
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
      ok = await dns.resolve4(domain).then((a) => a.length > 0, () => false);
    }
  }
  mxCache.set(domain, ok);
  return ok;
}

/* ---------- content heuristics ---------- */
// "aGTrvlIKzIDwNsgyBaxFvGx": many lower->upper switches inside one word is a strong bot signal.
function caseSwitches(word) { return (word.match(/[a-z][A-Z]/g) || []).length; }
const letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length;

function spamSignals(lead) {
  const reasons = [];
  let score = 0;
  const add = (n, why) => { score += n; reasons.push(why); };
  const name = String(lead.name || '');
  const words = name.split(/\s+/).filter(Boolean);
  if (!letters(name)) add(4, 'name has no letters');
  if (words.some((w) => caseSwitches(w) >= 2)) add(3, 'random-looking name');
  if (words.length === 1 && name.length >= 14) add(1, 'long single-word name');
  if (/https?:|www\.|\.(com|net|ru|xyz|top)\b/i.test(name)) add(4, 'link in name');
  const [local = '', domain = ''] = String(lead.email || '').toLowerCase().split('@');
  if ((local.match(/\./g) || []).length >= 3) add(2, 'dotted email (alias trick)');
  if (/^(gmail|googlemail)\.com$/.test(domain) && /\d{4,}/.test(local) && local.length > 16) add(1, 'machine-like email');
  const text = `${lead.problem || ''} ${lead.goal || ''}`.trim();
  if (text && letters(text) < 3) add(2, 'project details have no words');
  if ((text.match(/https?:\/\//g) || []).length >= 2) add(3, 'multiple links');
  if (/\b(seo backlinks?|crypto|casino|viagra|loan offer|guest post|web traffic for sale)\b/i.test(text)) add(3, 'spam keywords');
  if (lead.company && String(lead.company).split(/\s+/).some((w) => caseSwitches(w) >= 2)) add(1, 'random-looking company');
  return { score, reasons, spam: score >= 3 };
}

module.exports = { issueToken, checkToken, turnstileOn, checkTurnstile, normalizePhone, validEmailFormat, domainAcceptsMail, DISPOSABLE, spamSignals };
