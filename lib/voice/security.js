const buckets = new Map();

// Vercel sets x-real-ip / x-vercel-forwarded-for itself, so prefer them over the client-controllable x-forwarded-for chain.
function clientIp(req) {
  const h = req.headers || {};
  return String(h['x-real-ip'] || h['x-vercel-forwarded-for'] || h['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

// In-memory first line of defence (per serverless instance). Endpoints that matter also use the shared
// Redis counters in lib/admin/store.js. scope keeps separate counters per endpoint.
function rateLimit(req, limit = 30, windowMs = 10 * 60 * 1000, scope = 'default') {
  const key = `${scope}:${clientIp(req)}`;
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max) : '';
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

module.exports = { rateLimit, clientIp, clean, validEmail, json };
