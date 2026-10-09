// Private storage for leads and analytics counters.
// Production: Redis over REST (Upstash / Vercel KV); Vercel injects the env vars when the store is connected.
// Local dev only: VELARIS_DEV_MEMORY=1 keeps everything in memory.
const crypto = require('crypto');

const REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const MEMORY = !REST_URL && process.env.VELARIS_DEV_MEMORY === '1';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const STAT_TTL = 60 * 60 * 24 * 400; // keep daily counters ~13 months

function configured() {
  return Boolean((REST_URL && REST_TOKEN) || MEMORY);
}

/* ---------- tiny Redis REST client (+ in-memory stand-in for local dev) ---------- */
const mem = { hash: new Map(), zset: new Map() };
function memCommand([cmd, key, ...args]) {
  const h = () => { if (!mem.hash.has(key)) mem.hash.set(key, new Map()); return mem.hash.get(key); };
  const z = () => { if (!mem.zset.has(key)) mem.zset.set(key, new Map()); return mem.zset.get(key); };
  switch (cmd.toUpperCase()) {
    case 'HSET': { for (let i = 0; i < args.length; i += 2) h().set(String(args[i]), String(args[i + 1])); return 1; }
    case 'HGET': return mem.hash.get(key)?.get(String(args[0])) ?? null;
    case 'HMGET': return args.map((f) => mem.hash.get(key)?.get(String(f)) ?? null);
    case 'HGETALL': return [...(mem.hash.get(key) || new Map())].flat();
    case 'HINCRBY': { const m = h(); const v = Number(m.get(String(args[0])) || 0) + Number(args[1]); m.set(String(args[0]), String(v)); return v; }
    case 'ZADD': { z().set(String(args[1]), Number(args[0])); return 1; }
    case 'ZREVRANGE': { const all = [...(mem.zset.get(key) || new Map())].sort((a, b) => b[1] - a[1]).map(([m]) => m); return all.slice(Number(args[0]), Number(args[1]) + 1); }
    case 'ZCARD': return (mem.zset.get(key) || new Map()).size;
    case 'EXPIRE': return 1;
    default: throw new Error(`memory store: unsupported ${cmd}`);
  }
}
async function pipeline(commands) {
  if (MEMORY) return commands.map(memCommand);
  if (!configured()) throw Object.assign(new Error('Storage is not configured'), { code: 'NO_STORAGE' });
  const res = await fetch(`${REST_URL.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Storage returned ${res.status}`);
  const out = await res.json();
  return out.map((r) => { if (r.error) throw new Error(r.error); return r.result; });
}
const call = async (...cmd) => (await pipeline([cmd]))[0];

/* ---------- leads ---------- */
const PLAN_PRICES = { starter: 199, growth: 399, scale: 699 };
function planValue(text) {
  const t = String(text || '').toLowerCase();
  for (const [plan, price] of Object.entries(PLAN_PRICES)) if (t.includes(plan)) return price;
  const m = t.match(/\$\s?(\d{2,5})/);
  return m ? Number(m[1]) : 0;
}

async function saveLead(lead) {
  const id = `L${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
  const record = { id, status: 'new', notes: '', monthlyValue: planValue(lead.budget), ...lead, updatedAt: new Date().toISOString() };
  await pipeline([
    ['HSET', 'leads', id, JSON.stringify(record)],
    ['ZADD', 'leads:idx', Date.parse(record.createdAt) || Date.now(), id],
  ]);
  return record;
}

async function listLeads(limit = 500) {
  const ids = await call('ZREVRANGE', 'leads:idx', 0, limit - 1);
  if (!ids || !ids.length) return [];
  const rows = await call('HMGET', 'leads', ...ids);
  return rows.filter(Boolean).map((r) => JSON.parse(r));
}

async function updateLead(id, changes) {
  const raw = await call('HGET', 'leads', id);
  if (!raw) return null;
  const lead = JSON.parse(raw);
  if (changes.status !== undefined) {
    if (!STATUSES.includes(changes.status)) throw Object.assign(new Error('Invalid status'), { code: 'BAD_INPUT' });
    lead.status = changes.status;
  }
  if (changes.notes !== undefined) lead.notes = String(changes.notes).slice(0, 4000);
  if (changes.followUp !== undefined) {
    const f = String(changes.followUp || '');
    if (f && !/^\d{4}-\d{2}-\d{2}$/.test(f)) throw Object.assign(new Error('Invalid follow-up date'), { code: 'BAD_INPUT' });
    lead.followUp = f;
  }
  if (changes.monthlyValue !== undefined) lead.monthlyValue = Math.max(0, Math.min(100000, Number(changes.monthlyValue) || 0));
  lead.updatedAt = new Date().toISOString();
  await call('HSET', 'leads', id, JSON.stringify(lead));
  return lead;
}

/* ---------- analytics (daily counters, no personal data) ---------- */
const day = (d = new Date()) => d.toISOString().slice(0, 10);
async function track(event) {
  const key = `stat:${day()}`;
  const cmds = [];
  const inc = (field, by = 1) => cmds.push(['HINCRBY', key, field, by]);
  if (event.type === 'pv') {
    inc('pv');
    if (event.visit) inc('vis');
    if (event.firstEver) inc('new');
    if (event.path) inc(`page:${event.path}`);
    if (event.ref) inc(`ref:${event.ref}`);
    if (event.visit && event.device) inc(`dev:${event.device}`);
    if (event.visit && event.country) inc(`cty:${event.country}`);
  } else if (event.type === 'wa') inc('wa');
  else if (event.type === 'form') inc('form');
  else if (event.type === 'lead') inc('lead');
  else return;
  cmds.push(['EXPIRE', key, STAT_TTL]);
  await pipeline(cmds);
}

async function stats(days = 30) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) dates.push(day(new Date(Date.now() - i * 864e5)));
  const raw = await pipeline(dates.map((d) => ['HGETALL', `stat:${d}`]));
  const pages = {}; const refs = {}; const devices = {}; const countries = {};
  const daily = raw.map((arr, i) => {
    const o = {};
    for (let j = 0; j < (arr || []).length; j += 2) o[arr[j]] = Number(arr[j + 1]);
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('page:')) pages[k.slice(5)] = (pages[k.slice(5)] || 0) + v;
      if (k.startsWith('ref:')) refs[k.slice(4)] = (refs[k.slice(4)] || 0) + v;
      if (k.startsWith('dev:')) devices[k.slice(4)] = (devices[k.slice(4)] || 0) + v;
      if (k.startsWith('cty:')) countries[k.slice(4)] = (countries[k.slice(4)] || 0) + v;
    }
    return { date: dates[i], pv: o.pv || 0, vis: o.vis || 0, new: o.new || 0, wa: o.wa || 0, form: o.form || 0, lead: o.lead || 0 };
  });
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ key: k, count: v }));
  return { daily, topPages: top(pages, 10), topReferrers: top(refs, 8), devices: top(devices, 3), countries: top(countries, 10) };
}

module.exports = { configured, saveLead, listLeads, updateLead, track, stats, planValue, STATUSES, MEMORY };
