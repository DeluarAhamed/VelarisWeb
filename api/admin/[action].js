// Admin API for /dashboard (one function to stay within Vercel's function limit).
//   POST /api/admin/login {password}   POST /api/admin/logout   GET /api/admin/session
//   GET  /api/admin/leads   POST /api/admin/leads {name, ...}   PATCH /api/admin/leads {id, status?, notes?, monthlyValue?}
//   GET  /api/admin/stats?days=30      GET /api/admin/search?days=28 (Search Console)   GET /api/admin/export  (CSV)
const { rateLimit, json } = require('../../lib/voice/security');
const auth = require('../../lib/admin/auth');
const store = require('../../lib/admin/store');
const gsc = require('../../lib/admin/gsc');
const notify = require('../../lib/admin/notify');

function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

const csvCell = (v) => {
  const s = String(v == null ? '' : v);
  // Neutralise spreadsheet formulas and quote everything.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

module.exports = async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const action = String((req.query && req.query.action) || '').toLowerCase();

  try {
    if (action === 'login') {
      if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
      if (rateLimit(req, 8, 10 * 60 * 1000, 'admin-login')) return json(res, 429, { error: 'Too many attempts. Try again in 10 minutes.' });
      if (!auth.passwordConfigured()) return json(res, 503, { error: 'Admin password is not set up yet (ADMIN_PASSWORD in Vercel).' });
      if (!auth.checkPassword(body(req).password)) return json(res, 401, { error: 'Wrong password.' });
      auth.setSession(res);
      return json(res, 200, { ok: true });
    }
    if (action === 'logout') {
      auth.clearSession(res);
      return json(res, 200, { ok: true });
    }
    if (action === 'session') {
      return json(res, 200, {
        authed: auth.isAuthed(req),
        setup: { password: auth.passwordConfigured(), storage: store.configured(), devMemory: store.MEMORY, notify: notify.channels(), searchConsole: gsc.configured() },
      });
    }

    if (!auth.isAuthed(req)) return json(res, 401, { error: 'Please sign in.' });
    if (action === 'search') {
      if (!gsc.configured()) return json(res, 503, { error: 'Search Console is not connected yet.', code: 'NO_GSC' });
      const days = Math.max(7, Math.min(90, Number(req.query.days) || 28));
      try { return json(res, 200, await gsc.searchData(days)); } catch (err) { return json(res, 502, { error: err.message }); }
    }
    if (!store.configured()) return json(res, 503, { error: 'Storage is not connected yet.', code: 'NO_STORAGE' });

    if (action === 'leads') {
      if (req.method === 'GET') return json(res, 200, { leads: await store.listLeads(), statuses: store.STATUSES });
      if (req.method === 'POST') {
        // Manually added lead (e.g. an enquiry that arrived on WhatsApp or by phone).
        const b = body(req);
        const s = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
        if (!s(b.name, 120)) return json(res, 400, { error: 'Name is required.' });
        const status = store.STATUSES.includes(b.status) ? b.status : 'new';
        const lead = await store.saveLead({
          createdAt: new Date().toISOString(), source: 'manual', channel: s(b.channel, 40) || 'Other',
          name: s(b.name, 120), email: s(b.email, 180), phone: s(b.phone, 50), company: s(b.company, 160),
          budget: s(b.budget, 80), problem: s(b.problem, 700), notes: s(b.notes, 4000),
        });
        const saved = status === 'new' ? lead : await store.updateLead(lead.id, { status });
        return json(res, 201, { lead: saved });
      }
      if (req.method === 'PATCH') {
        const b = body(req);
        if (!b.id) return json(res, 400, { error: 'Missing lead id' });
        const lead = await store.updateLead(String(b.id), b);
        return lead ? json(res, 200, { lead }) : json(res, 404, { error: 'Lead not found' });
      }
      return json(res, 405, { error: 'Method not allowed' });
    }
    if (action === 'stats') {
      const days = Math.max(7, Math.min(365, Number(req.query.days) || 30));
      return json(res, 200, await store.stats(days));
    }
    if (action === 'export') {
      const leads = await store.listLeads(5000);
      const cols = ['createdAt', 'status', 'followUp', 'name', 'email', 'phone', 'company', 'budget', 'monthlyValue', 'serviceInterest', 'problem', 'source', 'notes'];
      const csv = [cols.join(','), ...leads.map((l) => cols.map((c) => csvCell(l[c])).join(','))].join('\n');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="velaris-leads-${new Date().toISOString().slice(0, 10)}.csv"`);
      res.setHeader('Cache-Control', 'no-store');
      return res.end(csv);
    }
    return json(res, 404, { error: 'Unknown action' });
  } catch (err) {
    if (err.code === 'BAD_INPUT') return json(res, 400, { error: err.message });
    if (err.code === 'NO_STORAGE') return json(res, 503, { error: err.message, code: 'NO_STORAGE' });
    console.error('admin_api_failed', action, err.message);
    return json(res, 500, { error: 'Something went wrong.' });
  }
};
