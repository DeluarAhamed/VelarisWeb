// Google Search Console data for the dashboard, via a read-only service account.
// Setup: GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY (from the service account's JSON key) in Vercel, and that
// email added as a user on the Search Console property. GSC_SITE defaults to the domain property.
const crypto = require('crypto');

const SITE = process.env.GSC_SITE || 'sc-domain:velarisweb.com';
let token = null;

function configured() {
  return Boolean(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY);
}

const b64url = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');

async function accessToken() {
  if (token && token.expires > Date.now() + 60000) return token.value;
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url({
    iss: process.env.GSC_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const key = process.env.GSC_PRIVATE_KEY.replace(/\\n/g, '\n');
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
    signal: AbortSignal.timeout(8000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Google sign-in failed: ${body.error_description || body.error || res.status}`);
  token = { value: body.access_token, expires: Date.now() + body.expires_in * 1000 };
  return token.value;
}

async function query(auth, startDate, endDate, dimensions, rowLimit) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit, dataState: 'all' }),
    signal: AbortSignal.timeout(10000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Search Console: ${(body.error && body.error.message) || res.status}`);
  return body.rows || [];
}

const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const row = (r) => ({ key: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: round(r.ctr * 100, 1), position: round(r.position, 1) });

async function searchData(days = 28) {
  const day = (offset) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);
  const startDate = day(days);
  const endDate = day(0);
  const auth = await accessToken();
  const [byDate, queries, pages] = await Promise.all([
    query(auth, startDate, endDate, ['date'], days + 5),
    query(auth, startDate, endDate, ['query'], 25),
    query(auth, startDate, endDate, ['page'], 10),
  ]);
  const daily = byDate.map((r) => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions }));
  const clicks = daily.reduce((s, d) => s + d.clicks, 0);
  const impressions = daily.reduce((s, d) => s + d.impressions, 0);
  const weighted = byDate.reduce((s, r) => s + r.position * r.impressions, 0);
  return {
    site: SITE, startDate, endDate,
    totals: { clicks, impressions, ctr: impressions ? round((clicks / impressions) * 100, 1) : 0, position: impressions ? round(weighted / impressions, 1) : 0 },
    daily,
    queries: queries.map(row),
    pages: pages.map((r) => ({ ...row(r), key: r.keys[0].replace(/^https?:\/\/(www\.)?velarisweb\.com/, '') || '/' })),
  };
}

module.exports = { configured, searchData, SITE };
