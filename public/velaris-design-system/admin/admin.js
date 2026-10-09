/* Velaris owner dashboard. Data: /api/admin/* (session-cookie protected). All lead fields are escaped before display. */
(function(){
  'use strict';
  var state = { leads: [], statuses: [], stats: null, search: null, searchErr: '', days: 30, setup: {}, view: 'overview', filter: 'all', q: '' };
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var esc = function(v){ return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var money = function(n){ return '$' + Math.round(n || 0).toLocaleString('en-US'); };
  var num = function(n){ return Math.round(n || 0).toLocaleString('en-US'); };
  var DAY = 864e5;
  var TITLES = {
    overview: ['Overview', 'Leads, pipeline and website insights'],
    leads: ['Leads', 'Every enquiry from your website, forms and Ava'],
    analytics: ['Analytics', 'Anonymous website traffic and conversions'],
    search: ['Search', 'Google clicks, queries and rankings from Search Console'],
    content: ['Content', 'Edit your website content and tools'],
    setup: ['Setup', 'Connections your dashboard needs']
  };

  function api(path, opts){
    return fetch('/api/admin/' + path, Object.assign({credentials: 'same-origin', headers: {'Content-Type': 'application/json'}}, opts || {}))
      .then(function(r){
        if(r.status === 401){ location.replace('/admin'); throw new Error('auth'); }
        return r.json().then(function(b){ if(!r.ok) throw Object.assign(new Error(b.error || 'Request failed'), {code: b.code}); return b; });
      });
  }

  /* ---------- helpers ---------- */
  function within(lead, days){ return Date.now() - Date.parse(lead.createdAt) <= days * DAY; }
  function planOf(lead){
    var t = String(lead.budget || lead.serviceInterest || '').toLowerCase();
    if(/starter/.test(t)) return 'Starter'; if(/growth/.test(t)) return 'Growth'; if(/scale/.test(t)) return 'Scale';
    if(/one-off/.test(t)) return 'One-off project'; return 'Not specified';
  }
  function dateLabel(iso){ var d = new Date(iso); return d.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}); }
  function ago(iso){
    var m = Math.round((Date.now() - Date.parse(iso)) / 6e4);
    if(m < 60) return m + 'm ago'; var h = Math.round(m / 60); if(h < 24) return h + 'h ago'; var d = Math.round(h / 24); return d + 'd ago';
  }
  var sum = function(arr, k){ return arr.reduce(function(s, x){ return s + (Number(x[k]) || 0); }, 0); };
  function statusTag(s){ return '<span class="status s-' + esc(s) + '">' + esc(s) + '</span>'; }
  function sourceLabel(s, lead){
    if(s === 'manual') return 'Added manually' + (lead && lead.channel ? ' &middot; ' + esc(lead.channel) : '');
    return ({website_plan_modal: 'Plan pop-up', website_inquiry: 'Inquiry form', website_contact: 'Contact form', velaris_voice_agent: 'Ava assistant'})[s] || esc(s || 'Website');
  }

  var today = function(){ var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  function isOpen(l){ return l.status !== 'won' && l.status !== 'lost'; }
  function due(l){ return isOpen(l) && l.followUp && l.followUp <= today(); }
  function followLabel(l){
    if(!l.followUp || !isOpen(l)) return '&ndash;';
    var t = today(), d = new Date(l.followUp + 'T00:00:00');
    var txt = l.followUp === t ? 'Today' : d.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
    return '<span class="fu' + (l.followUp < t ? ' late' : l.followUp === t ? ' today' : '') + '">' + txt + '</span>';
  }
  function sourceKey(l){ return l.source === 'manual' ? esc(l.channel || 'Added manually') : sourceLabel(l.source); }

  var COUNTRIES = {US: 'United States', GB: 'United Kingdom', BD: 'Bangladesh', CA: 'Canada', AU: 'Australia', IN: 'India', IE: 'Ireland', DE: 'Germany', FR: 'France', AE: 'United Arab Emirates', NL: 'Netherlands', ES: 'Spain', IT: 'Italy', PK: 'Pakistan', NG: 'Nigeria', ZA: 'South Africa', NZ: 'New Zealand', SG: 'Singapore'};
  function countryName(c){ return COUNTRIES[c] || c || 'Unknown'; }

  /* ---------- charts (hand-rolled SVG bars, drawn at the container's real width so text stays 11px) ---------- */
  function bars(daily, series, opts){
    opts = opts || {};
    var max0 = Math.max.apply(null, [0].concat(daily.map(function(d){ return Math.max.apply(null, series.map(function(s){ return d[s.key] || 0; })); })));
    if(!daily.length || !max0) return '<div class="empty">' + esc(opts.empty || 'No data for this period yet.') + '</div>';
    var n = daily.length, H = opts.height || 220, padB = 26, padT = 22;
    var W = Math.max(320, Math.min(1400, (($('#view') && $('#view').clientWidth) || 900) - 50));
    var groupW = W / n, gap = groupW * 0.28, bw = (groupW - gap) / series.length;
    var max = Math.max(1, max0);
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.label || 'chart') + '">';
    svg += '<line x1="0" y1="' + (H - padB) + '" x2="' + W + '" y2="' + (H - padB) + '" stroke="#E5EAF2"/>';
    var tickEvery = Math.ceil(n / Math.max(3, Math.floor(W / 110)));
    daily.forEach(function(d, i){
      series.forEach(function(s, j){
        var v = d[s.key] || 0, h = (H - padB - padT) * v / max, x = i * groupW + gap / 2 + j * bw, y = H - padB - h;
        svg += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(bw - 2, 2).toFixed(1) + '" height="' + Math.max(h, v ? 2 : 0).toFixed(1) + '" rx="3" fill="' + s.color + '"><title>' + esc(dateLabel(d.date)) + ': ' + v + ' ' + esc(s.label) + '</title></rect>';
        if(series.length === 1 && v && n <= 45) svg += '<text x="' + (x + bw / 2 - 1).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#4A5565">' + v + '</text>';
      });
      if(i % tickEvery === 0){
        var tx = i * groupW + groupW / 2, anchor = i === 0 ? 'start' : (tx > W - 30 ? 'end' : 'middle');
        if(i === 0) tx = 2;
        svg += '<text x="' + tx.toFixed(1) + '" y="' + (H - 7) + '" text-anchor="' + anchor + '" font-size="11" fill="#8590A0">' + esc(dateLabel(d.date)) + '</text>';
      }
    });
    svg += '</svg>';
    var legend = series.length > 1 ? '<div class="legend">' + series.map(function(s){ return '<span><i style="background:' + s.color + '"></i>' + esc(s.label) + '</span>'; }).join('') + '</div>' : '';
    return '<div class="chart">' + svg + legend + '</div>';
  }

  /* ---------- views ---------- */
  function overview(){
    var d = state.days, L = state.leads, S = (state.stats && state.stats.daily) || [];
    var inRange = L.filter(function(l){ return within(l, d); });
    var open = L.filter(function(l){ return l.status !== 'won' && l.status !== 'lost'; });
    var won = L.filter(function(l){ return l.status === 'won'; });
    var pipeline = sum(open, 'monthlyValue'), wonMrr = sum(won, 'monthlyValue');
    var month = L.filter(function(l){ var c = new Date(l.createdAt), n = new Date(); return c.getMonth() === n.getMonth() && c.getFullYear() === n.getFullYear(); }).length;
    var byPlan = {};
    inRange.forEach(function(l){ var p = planOf(l); byPlan[p] = byPlan[p] || {n: 0, v: 0}; byPlan[p].n++; byPlan[p].v += Number(l.monthlyValue) || 0; });
    var vis = sum(S, 'vis'), pv = sum(S, 'pv'), wa = sum(S, 'wa'), fresh = sum(S, 'new');
    var conv = vis ? (inRange.length / vis * 100) : 0;
    var planRows = Object.keys(byPlan).sort(function(a, b){ return byPlan[b].v - byPlan[a].v; }).map(function(p){
      return '<div class="kv"><span>' + esc(p) + ' &times; ' + byPlan[p].n + '</span><span class="val">' + (byPlan[p].v ? money(byPlan[p].v) + '/mo' : '&ndash;') + '</span></div>';
    }).join('') || '<div class="empty" style="padding:12px 0">No leads in this period yet.</div>';
    var recent = L.slice(0, 6);
    var dueList = L.filter(due).sort(function(a, b){ return a.followUp < b.followUp ? -1 : 1; });
    var bySrc = {};
    L.forEach(function(l){ var k = sourceKey(l); var r = bySrc[k] = bySrc[k] || {n: 0, won: 0, lost: 0, mrr: 0}; r.n++; if(l.status === 'won'){ r.won++; r.mrr += Number(l.monthlyValue) || 0; } if(l.status === 'lost') r.lost++; });
    var srcRows = Object.keys(bySrc).sort(function(a, b){ return bySrc[b].mrr - bySrc[a].mrr || bySrc[b].n - bySrc[a].n; }).map(function(k){
      var r = bySrc[k], closed = r.won + r.lost;
      return '<tr><td><b>' + k + '</b></td><td>' + r.n + '</td><td>' + r.won + '</td><td>' + (closed ? Math.round(r.won / closed * 100) + '%' : '&ndash;') + '</td><td>' + (r.mrr ? money(r.mrr) + '/mo' : '&ndash;') + '</td></tr>';
    }).join('');
    var closedAll = won.length + L.filter(function(l){ return l.status === 'lost'; }).length;
    return '' +
      (dueList.length ? '<div class="card due-card"><div class="card-head"><h2>Follow-ups due <span class="pill red">' + dueList.length + '</span></h2><a class="btn btn-ghost" href="#leads" data-goto-filter="due">See all</a></div>' + leadTable(dueList.slice(0, 5), true) + '</div>' : '') +
      '<div class="sec-title">Revenue</div>' +
      '<div class="grid g3">' +
        '<div class="card metric hero"><b>' + money(wonMrr) + '<small style="font-size:18px;font-weight:600">/mo</small></b><span>Recurring revenue from won clients</span><em>' + money(wonMrr * 12) + ' a year</em></div>' +
        '<div class="card metric"><b>' + num(won.length) + '</b><span>Clients won</span><em>' + (won.length ? money(wonMrr / won.length) + ' average/mo' : 'average/mo: &ndash;') + '</em></div>' +
        '<div class="card metric"><b>' + (closedAll ? Math.round(won.length / closedAll * 100) + '%' : '&ndash;') + '</b><span>Win rate</span><em>of ' + closedAll + ' closed (won or lost)</em></div>' +
      '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Win rate by source</h2><small>all time</small></div>' +
        (srcRows ? '<div class="table-wrap"><table class="static"><thead><tr><th>Source</th><th>Leads</th><th>Won</th><th>Win rate</th><th>Revenue</th></tr></thead><tbody>' + srcRows + '</tbody></table></div>' : '<div class="empty">No leads yet.</div>') + '</div>' +
      '<div class="sec-title">Value from your website <span class="pill">last ' + d + ' days</span></div>' +
      '<div class="grid g3">' +
        '<div class="card metric hero"><b>' + money(pipeline) + '<small style="font-size:18px;font-weight:600">/mo</small></b><span>Open pipeline (monthly value of open leads)</span><em>' + money(pipeline * 12) + ' a year if all close</em></div>' +
        '<div class="card metric"><b>' + num(wa) + '</b><span>WhatsApp clicks</span><em>' + num(sum(S, 'form')) + ' form submissions</em></div>' +
        '<div class="card list-card"><h3>Leads by plan</h3>' + planRows + '</div>' +
      '</div>' +
      '<p class="note">A conservative estimate: each open lead is valued at the monthly price of the plan they chose. It shows potential recurring revenue from website enquiries, not confirmed sales. Won clients currently add <b>' + money(wonMrr) + '/mo</b>.</p>' +
      '<div class="sec-title">Leads <span class="pill blue">live</span></div>' +
      '<div class="grid g4">' +
        '<div class="card metric"><b>' + num(L.length) + '</b><span>Total leads</span></div>' +
        '<div class="card metric"><b>' + num(month) + '</b><span>This month</span></div>' +
        '<div class="card metric"><b>' + num(L.filter(function(l){ return within(l, 7); }).length) + '</b><span>Last 7 days</span></div>' +
        '<div class="card metric"><b>' + num(L.filter(due).length) + '</b><span>Follow-ups due</span><em class="' + (L.filter(due).length ? 'down' : '') + '">' + L.filter(function(l){ return isOpen(l) && !l.followUp; }).length + ' open leads without a date</em></div>' +
      '</div>' +
      '<div class="sec-title">Website traffic <span class="pill">last ' + d + ' days</span></div>' +
      '<div class="grid g4">' +
        '<div class="card metric"><b>' + num(vis) + '</b><span>Visitors</span></div>' +
        '<div class="card metric"><b>' + num(pv) + '</b><span>Page views</span><em>' + (vis ? (pv / vis).toFixed(1) + ' pages per visit' : 'per visit: &ndash;') + '</em></div>' +
        '<div class="card metric"><b>' + num(fresh) + '</b><span>New visitors</span></div>' +
        '<div class="card metric"><b>' + conv.toFixed(1) + '%</b><span>Visitor &rarr; lead rate</span></div>' +
      '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Visitors over time</h2><small>for the selected period</small></div>' +
        (S.length ? bars(S, [{key: 'vis', color: '#127AFE', label: 'visitors'}], {label: 'Visitors per day', empty: 'No visitors recorded in this period yet. Counting started when storage was connected.'}) : '<div class="empty">No traffic data yet.</div>') + '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Recent leads</h2><a class="btn btn-ghost" href="#leads">View all</a></div>' + leadTable(recent, true) + '</div>';
  }

  function leadTable(rows, compact){
    if(!rows.length) return '<div class="empty">No leads yet. They appear here as soon as someone submits a form or chats with Ava.</div>';
    return '<div class="table-wrap"><table><thead><tr><th>Received</th><th>Lead</th>' + (compact ? '' : '<th>Contact</th>') + '<th>Plan</th><th>Value</th><th>Follow up</th><th>Source</th><th>Status</th></tr></thead><tbody>' +
      rows.map(function(l){
        return '<tr data-id="' + esc(l.id) + '"><td><b>' + esc(dateLabel(l.createdAt)) + '</b><br><small>' + esc(ago(l.createdAt)) + '</small></td>' +
          '<td class="who"><b>' + esc(l.name) + '</b><small>' + esc(String(l.company || l.problem || '').slice(0, 70)) + '</small></td>' +
          (compact ? '' : '<td><small>' + esc(l.email) + (l.phone ? '<br>' + esc(l.phone) : '') + '</small></td>') +
          '<td>' + esc(planOf(l)) + '</td><td>' + (l.monthlyValue ? money(l.monthlyValue) + '/mo' : '&ndash;') + '</td><td>' + followLabel(l) + '</td>' +
          '<td><small>' + sourceLabel(l.source, l) + '</small></td><td>' + statusTag(l.status) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function leadsView(){
    var counts = {all: state.leads.length, due: state.leads.filter(due).length};
    state.statuses.forEach(function(s){ counts[s] = state.leads.filter(function(l){ return l.status === s; }).length; });
    var q = state.q.toLowerCase();
    var rows = state.leads.filter(function(l){
      if(state.filter === 'due'){ if(!due(l)) return false; }
      else if(state.filter !== 'all' && l.status !== state.filter) return false;
      return !q || [l.name, l.email, l.phone, l.company, l.problem, l.budget].join(' ').toLowerCase().indexOf(q) >= 0;
    });
    return '<div class="card"><div class="toolbar"><div class="chips">' +
      ['all', 'due'].concat(state.statuses).map(function(s){ return '<button class="chip' + (s === 'due' ? ' due' : '') + (state.filter === s ? ' on' : '') + '" data-filter="' + s + '">' + (s === 'due' ? 'follow-up due' : s) + '<span>' + (counts[s] || 0) + '</span></button>'; }).join('') +
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><input class="search" id="q" type="search" placeholder="Search name, email, project&hellip;" value="' + esc(state.q) + '"><button class="btn btn-primary" type="button" id="addLead">+ Add lead</button><a class="btn btn-ghost" href="/api/admin/export">Export CSV</a></div></div>' +
      leadTable(rows, false) + '</div>';
  }

  function analyticsView(){
    var S = (state.stats && state.stats.daily) || [];
    var vis = sum(S, 'vis'), leads = state.leads.filter(function(l){ return within(l, state.days); }).length;
    var tops = (state.stats && state.stats.topPages) || [], refs = (state.stats && state.stats.topReferrers) || [];
    var list = function(items, empty){ return items.length ? items.map(function(t){ return '<div class="kv"><span>' + esc(t.key) + '</span><b>' + num(t.count) + '</b></div>'; }).join('') : '<div class="empty" style="padding:12px 0">' + empty + '</div>'; };
    return '<div class="grid g4">' +
        '<div class="card metric"><b>' + num(vis) + '</b><span>Visitors</span></div>' +
        '<div class="card metric"><b>' + num(sum(S, 'pv')) + '</b><span>Page views</span></div>' +
        '<div class="card metric"><b>' + num(sum(S, 'wa')) + '</b><span>WhatsApp clicks</span></div>' +
        '<div class="card metric"><b>' + num(leads) + '</b><span>Leads</span><em>' + (vis ? (leads / vis * 100).toFixed(1) : '0.0') + '% of visitors</em></div>' +
      '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Traffic</h2><small>visitors and page views per day</small></div>' +
        bars(S, [{key: 'vis', color: '#127AFE', label: 'Visitors'}, {key: 'pv', color: '#B9D6FF', label: 'Page views'}], {label: 'Traffic per day', empty: 'No traffic recorded in this period yet.'}) + '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Conversions</h2><small>WhatsApp clicks and form submissions per day</small></div>' +
        bars(S, [{key: 'wa', color: '#25D366', label: 'WhatsApp clicks'}, {key: 'form', color: '#0B1B33', label: 'Form submissions'}], {label: 'Conversions per day', height: 180, empty: 'No WhatsApp clicks or form submissions in this period yet.'}) + '</div>' +
      '<div class="grid g3" style="margin-top:16px;grid-template-columns:1fr 1fr">' +
        '<div class="card list-card"><h3>Top pages</h3>' + list(tops, 'No page views yet.') + '</div>' +
        '<div class="card list-card"><h3>Top referrers</h3>' + list(refs, 'No referral traffic yet (direct and search visits without a referrer are not listed).') + '</div>' +
        '<div class="card list-card"><h3>Devices</h3>' + list(((state.stats && state.stats.devices) || []).map(function(t){ return {key: t.key.charAt(0).toUpperCase() + t.key.slice(1), count: t.count}; }), 'No visitor data yet.') + '</div>' +
        '<div class="card list-card"><h3>Countries</h3>' + list(((state.stats && state.stats.countries) || []).map(function(t){ return {key: countryName(t.key), count: t.count}; }), 'No visitor data yet.') + '</div>' +
      '</div>' +
      '<p class="note">Counts are anonymous and cookie-free: a visitor is counted once per day per browser. Bots are filtered out. For Google search queries and rankings, use Search Console.</p>';
  }

  function searchView(){
    if(!state.setup.searchConsole) return '<div class="card"><div class="empty" style="text-align:left;padding:8px 0"><b>Search Console is not connected yet.</b><br>See <a href="#setup">Setup</a> for the three steps. Until then, use <a href="https://search.google.com/search-console?resource_id=sc-domain%3Avelarisweb.com" target="_blank" rel="noopener">Search Console</a> directly.</div></div>';
    if(state.searchErr) return '<div class="card"><div class="empty">' + esc(state.searchErr) + '</div></div>';
    var g = state.search;
    if(!g) return '<div class="empty">Loading Search Console data&hellip;</div>';
    var t = g.totals;
    var tbl = function(rows, label){
      if(!rows.length) return '<div class="empty">No data for this period.</div>';
      return '<div class="table-wrap"><table class="static"><thead><tr><th>' + label + '</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Position</th></tr></thead><tbody>' +
        rows.map(function(r){ return '<tr><td class="who"><b>' + esc(r.key) + '</b></td><td>' + num(r.clicks) + '</td><td>' + num(r.impressions) + '</td><td>' + r.ctr + '%</td><td>' + r.position + '</td></tr>'; }).join('') + '</tbody></table></div>';
    };
    return '<div class="grid g4">' +
        '<div class="card metric"><b>' + num(t.clicks) + '</b><span>Clicks from Google</span></div>' +
        '<div class="card metric"><b>' + num(t.impressions) + '</b><span>Impressions</span></div>' +
        '<div class="card metric"><b>' + t.ctr + '%</b><span>Click-through rate</span></div>' +
        '<div class="card metric"><b>' + (t.position || '&ndash;') + '</b><span>Average position</span><em>lower is better</em></div>' +
      '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Search performance</h2><small>' + esc(g.startDate) + ' to ' + esc(g.endDate) + '</small></div>' +
        bars(g.daily, [{key: 'impressions', color: '#B9D6FF', label: 'Impressions'}, {key: 'clicks', color: '#127AFE', label: 'Clicks'}], {label: 'Search clicks and impressions per day', empty: 'No search data for this period yet.'}) + '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Top search queries</h2><small>what people typed into Google</small></div>' + tbl(g.queries, 'Query') + '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Top pages in Google</h2></div>' + tbl(g.pages, 'Page') + '</div>' +
      '<p class="note">Google reports search data with a 2 to 3 day delay. Queries searched by very few people are hidden by Google for privacy.</p>';
  }
  function loadSearch(){
    if(!state.setup.searchConsole) return Promise.resolve();
    state.search = null; state.searchErr = '';
    var days = Math.min(90, Math.max(7, state.days === 30 ? 28 : state.days));
    return api('search?days=' + days).then(function(r){ state.search = r; }).catch(function(err){ state.searchErr = err.message; });
  }

  function contentView(){
    var link = function(href, t, s){ return '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><b>' + t + '</b><small>' + s + '</small></a>'; };
    return '<div class="sec-title">Edit your website</div><div class="links">' +
      link('https://velaris-web.sanity.studio/', 'Sanity Studio', 'Services, case studies, blog, FAQs, pricing') +
      link('https://velaris-web.sanity.studio/structure/services', 'Service pages', 'Headlines, sections, FAQs and SEO') +
      link('https://velaris-web.sanity.studio/structure/industry', 'Industry pages', 'Clinics, salons, trades and more') +
      link('https://velaris-web.sanity.studio/structure/post', 'Blog posts', 'Write and edit articles') +
      '</div><div class="sec-title">Your site</div><div class="links">' +
      link('/', 'Homepage', 'velarisweb.com') + link('/pricing', 'Pricing', 'Plans from $199/month') + link('/services', 'Services', 'All service pages') + link('/solutions', 'Industries', 'Industry landing pages') +
      '</div><div class="sec-title">Tools</div><div class="links">' +
      link('https://search.google.com/search-console', 'Google Search Console', 'Rankings, queries, indexing') +
      link('https://vercel.com/dashboard', 'Vercel', 'Deployments, domains, settings') +
      link('https://calendly.com/app/scheduled_events/user/me', 'Calendly', 'Booked calls') +
      '</div><p class="note">Changes in Sanity show on the next deploy for service, case study and blog pages.</p>';
  }

  function setupView(){
    var s = state.setup, n = s.notify || {};
    var row = function(ok, title, body){ return '<div class="check"><span class="dot ' + (ok ? 'ok' : 'todo') + '">' + (ok ? '&#10003;' : '!') + '</span><div><b>' + title + '</b><p>' + body + '</p></div></div>'; };
    return '<div class="card">' +
      row(s.password, 'Admin password', s.password ? 'Set. Change it any time with the <code>ADMIN_PASSWORD</code> environment variable in Vercel.' : 'Add <code>ADMIN_PASSWORD</code> (8+ characters) in Vercel &rarr; Settings &rarr; Environment Variables, then redeploy.') +
      row(s.storage, 'Private lead & analytics storage', s.storage ? (s.devMemory ? 'Running on temporary in-memory storage (local test only).' : 'Connected. Leads and traffic counters are stored privately in Redis.') : 'In Vercel &rarr; Storage &rarr; Create Database &rarr; <b>Upstash for Redis</b> (free) &rarr; connect it to the velarisweb project, then redeploy. Until then, forms fall back to WhatsApp and traffic is not counted.') +
      row(true, 'WhatsApp click & form tracking', 'Built into every page. Anonymous and cookie-free.') +
      row(n.email || n.whatsapp || n.telegram, 'New-lead alerts', (n.email || n.whatsapp || n.telegram ? 'On: ' + [n.email && 'email', n.whatsapp && 'WhatsApp', n.telegram && 'Telegram'].filter(Boolean).join(', ') + '. ' : 'Off. ') +
        'Add any of these in Vercel &rarr; Settings &rarr; Environment Variables, then redeploy:<br>' +
        '&bull; <b>Email</b>: create a free key at resend.com &rarr; <code>RESEND_API_KEY</code> and <code>NOTIFY_EMAIL</code> (the email you signed up with).<br>' +
        '&bull; <b>WhatsApp</b>: message the CallMeBot WhatsApp bot to get a key &rarr; <code>CALLMEBOT_PHONE</code> (e.g. +8801989570693) and <code>CALLMEBOT_APIKEY</code>.<br>' +
        '&bull; <b>Telegram</b>: create a bot with @BotFather &rarr; <code>TELEGRAM_BOT_TOKEN</code> and <code>TELEGRAM_CHAT_ID</code>.<br>' +
        'Message alerts include only the lead\'s name, plan and source; contact details stay in this dashboard.') +
      row(s.searchConsole, 'Google Search Console in the dashboard', s.searchConsole ? 'Connected. See the Search tab.' :
        '1. Google Cloud &rarr; create a service account and enable the <b>Google Search Console API</b>.<br>2. Create a JSON key, then add <code>GSC_CLIENT_EMAIL</code> and <code>GSC_PRIVATE_KEY</code> from it in Vercel.<br>3. Search Console &rarr; Settings &rarr; Users &rarr; add that service account email (Restricted).') +
      row(true, 'Sitemap', 'Submitted to Search Console: <code>https://velarisweb.com/sitemap.xml</code>.') +
      '</div>';
  }

  function drawer(lead){
    var p = $('#drawerPanel');
    var phone = String(lead.phone || '').replace(/[^\d]/g, '');
    p.innerHTML = '<button class="x" data-close aria-label="Close">&times;</button>' + statusTag(lead.status) +
      '<h2>' + esc(lead.name) + '</h2><div style="color:var(--ink-3);font-size:14px">' + esc(dateLabel(lead.createdAt)) + ' &middot; ' + sourceLabel(lead.source, lead) + '</div>' +
      '<div class="actions" style="margin-top:16px">' +
        (lead.email ? '<a class="btn btn-ghost" href="mailto:' + esc(lead.email) + '">Email</a>' : '') +
        (phone ? '<a class="btn btn-wa" href="https://wa.me/' + phone + '" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-ghost" href="tel:+' + phone + '">Call</a>' : '') +
      '</div>' +
      '<dl class="dl"><dt>Email</dt><dd>' + (lead.email ? esc(lead.email) : '&ndash;') + '</dd><dt>Phone</dt><dd>' + (lead.phone ? esc(lead.phone) : '&ndash;') + '</dd>' +
        (lead.company ? '<dt>Company</dt><dd>' + esc(lead.company) + '</dd>' : '') +
        '<dt>Plan</dt><dd>' + esc(lead.budget || 'Not specified') + '</dd>' +
        (lead.serviceInterest ? '<dt>Interest</dt><dd>' + esc(lead.serviceInterest) + '</dd>' : '') +
        (lead.problem ? '<dt>Project</dt><dd>' + esc(lead.problem) + '</dd>' : '') +
        (lead.goal ? '<dt>Goal</dt><dd>' + esc(lead.goal) + '</dd>' : '') +
        (lead.conversationSummary ? '<dt>Ava summary</dt><dd>' + esc(lead.conversationSummary) + '</dd>' : '') +
        (lead.landingPage || lead.referrer || lead.utm ? '<dt>Came from</dt><dd>' + esc([lead.referrer, lead.utm].filter(Boolean).join(' · ') || 'direct') + '</dd><dt>Landing page</dt><dd>' + (lead.landingPage ? esc(lead.landingPage) : '&ndash;') + '</dd>' : '') +
        (lead.page ? '<dt>Form on page</dt><dd>' + esc(lead.page) + '</dd>' : '') +
        (lead.score != null ? '<dt>Lead score</dt><dd>' + esc(lead.score) + ' &middot; ' + esc(lead.classification || '') + '</dd>' : '') +
      '</dl>' +
      '<form id="leadForm" class="grid" style="gap:14px">' +
        '<label class="field"><span>Status</span><select name="status">' + state.statuses.map(function(s){ return '<option value="' + s + '"' + (s === lead.status ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field"><span>Follow up on</span><span class="fu-row"><input name="followUp" type="date" value="' + esc(lead.followUp || '') + '"><button type="button" class="btn btn-ghost" data-fu="1">+1d</button><button type="button" class="btn btn-ghost" data-fu="3">+3d</button><button type="button" class="btn btn-ghost" data-fu="7">+1w</button><button type="button" class="btn btn-ghost" data-fu="0">Clear</button></span></label>' +
        '<label class="field"><span>Monthly value ($)</span><input name="monthlyValue" type="number" min="0" step="1" value="' + esc(lead.monthlyValue || 0) + '"></label>' +
        '<label class="field"><span>Notes</span><textarea name="notes" rows="5" placeholder="Call notes, next step&hellip;">' + esc(lead.notes || '') + '</textarea></label>' +
        '<div><button class="btn btn-primary" type="submit">Save changes</button><span class="saved" id="saved">Saved</span></div>' +
      '</form>';
    $('#drawer').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false');
    $('#leadForm').addEventListener('click', function(e){
      var b = e.target.closest('[data-fu]'); if(!b) return;
      var n = Number(b.getAttribute('data-fu')), inp = $('#leadForm').followUp;
      if(!n){ inp.value = ''; return; }
      var d = new Date(Date.now() + n * DAY); inp.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    });
    $('#leadForm').addEventListener('submit', function(e){
      e.preventDefault();
      var f = e.target, btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
      api('leads', {method: 'PATCH', body: JSON.stringify({id: lead.id, status: f.status.value, notes: f.notes.value, followUp: f.followUp.value, monthlyValue: Number(f.monthlyValue.value)})})
        .then(function(r){
          var i = state.leads.findIndex(function(l){ return l.id === lead.id; }); if(i >= 0) state.leads[i] = r.lead;
          $('#saved').classList.add('show'); setTimeout(function(){ $('#saved').classList.remove('show'); }, 1600);
          render(); drawer(r.lead);
        }).catch(function(err){ alert(err.message); }).then(function(){ btn.disabled = false; });
    });
  }
  function addLeadForm(){
    var p = $('#drawerPanel');
    var opt = function(list, sel){ return list.map(function(o){ return '<option' + (o === sel ? ' selected' : '') + '>' + o + '</option>'; }).join(''); };
    p.innerHTML = '<button class="x" data-close aria-label="Close">&times;</button><h2>Add a lead</h2>' +
      '<div style="color:var(--ink-3);font-size:14px">For enquiries that came in on WhatsApp, by phone or by referral.</div>' +
      '<form id="newLead" class="grid" style="gap:14px;margin-top:20px">' +
        '<label class="field"><span>Name *</span><input name="name" required maxlength="120"></label>' +
        '<label class="field"><span>Phone / WhatsApp</span><input name="phone" maxlength="50"></label>' +
        '<label class="field"><span>Email</span><input name="email" type="email" maxlength="180"></label>' +
        '<label class="field"><span>Company</span><input name="company" maxlength="160"></label>' +
        '<label class="field"><span>Came in via</span><select name="channel">' + opt(['WhatsApp', 'Phone call', 'Referral', 'LinkedIn', 'Email', 'Other'], 'WhatsApp') + '</select></label>' +
        '<label class="field"><span>Plan</span><select name="budget">' + opt(['Not sure yet', 'Starter ($199/month)', 'Growth ($399/month)', 'Scale (from $699/month)', 'One-off project'], 'Not sure yet') + '</select></label>' +
        '<label class="field"><span>Status</span><select name="status">' + state.statuses.map(function(st){ return '<option value="' + st + '">' + st.charAt(0).toUpperCase() + st.slice(1) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field"><span>Follow up on</span><input name="followUp" type="date"></label>' +
        '<label class="field"><span>What they need</span><textarea name="problem" rows="3"></textarea></label>' +
        '<label class="field"><span>Notes</span><textarea name="notes" rows="3"></textarea></label>' +
        '<div><button class="btn btn-primary" type="submit">Save lead</button></div>' +
      '</form>';
    $('#drawer').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false');
    $('#newLead').addEventListener('submit', function(e){
      e.preventDefault();
      var f = e.target, btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
      var data = {}; ['name', 'phone', 'email', 'company', 'channel', 'budget', 'status', 'problem', 'notes'].forEach(function(k){ data[k] = f[k].value; });
      api('leads', {method: 'POST', body: JSON.stringify(data)})
        .then(function(r){ return f.followUp.value ? api('leads', {method: 'PATCH', body: JSON.stringify({id: r.lead.id, followUp: f.followUp.value})}) : r; })
        .then(function(r){ state.leads.unshift(r.lead); render(); drawer(r.lead); })
        .catch(function(err){ alert(err.message); btn.disabled = false; });
    });
  }
  function closeDrawer(){ $('#drawer').classList.remove('on'); $('#drawer').setAttribute('aria-hidden', 'true'); }

  /* ---------- render & routing ---------- */
  function render(){
    var v = state.view, views = {overview: overview, leads: leadsView, analytics: analyticsView, search: searchView, content: contentView, setup: setupView};
    document.querySelectorAll('.nav a[data-view]').forEach(function(a){ a.classList.toggle('on', a.getAttribute('data-view') === v); });
    $('#viewTitle').textContent = TITLES[v][0]; $('#viewSub').textContent = TITLES[v][1];
    $('#range').style.visibility = (v === 'overview' || v === 'analytics' || v === 'search') ? 'visible' : 'hidden';
    var fresh = state.leads.filter(function(l){ return l.status === 'new'; }).length + state.leads.filter(due).length, nc = $('#newCount');
    nc.hidden = !fresh; nc.textContent = fresh; nc.title = 'New leads + follow-ups due';
    $('#view').innerHTML = (views[v] || overview)();
    var q = $('#q');
    if(q){ q.addEventListener('input', function(){ state.q = q.value; var pos = q.selectionStart; render(); var nq = $('#q'); nq.focus(); nq.setSelectionRange(pos, pos); }); }
  }
  function route(){
    state.view = (location.hash || '#overview').slice(1); if(!TITLES[state.view]) state.view = 'overview'; render(); $('#side').classList.remove('open');
    if(state.view === 'search' && !state.search && !state.searchErr) loadSearch().then(render);
  }

  function load(){
    var stamp = $('#updated'); if(stamp) stamp.textContent = 'Updated ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return Promise.all([
      api('leads').then(function(r){ state.leads = r.leads; state.statuses = r.statuses; }),
      api('stats?days=' + state.days).then(function(r){ state.stats = r; })
    ]).catch(function(err){
      if(err.code === 'NO_STORAGE'){
        $('#banner').innerHTML = '<div class="banner"><span>Private storage is not connected yet, so leads and traffic can\'t be shown.</span><a href="#setup">See setup</a></div>';
        state.statuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
      } else if(err.message !== 'auth') $('#banner').innerHTML = '<div class="banner"><span>' + esc(err.message) + '</span></div>';
    });
  }

  document.addEventListener('click', function(e){
    var row = e.target.closest('tbody tr[data-id]');
    if(row){ var lead = state.leads.find(function(l){ return l.id === row.getAttribute('data-id'); }); if(lead) drawer(lead); return; }
    if(e.target.closest('[data-close]')){ closeDrawer(); return; }
    var chip = e.target.closest('[data-filter]');
    if(chip){ state.filter = chip.getAttribute('data-filter'); render(); return; }
    if(e.target.closest('#addLead')){ addLeadForm(); return; }
    var gf = e.target.closest('[data-goto-filter]'); if(gf){ state.filter = gf.getAttribute('data-goto-filter'); }
    if(e.target.closest('#refresh')){ load().then(function(){ return state.view === 'search' ? loadSearch() : null; }).then(render); return; }
    var r = e.target.closest('#range button');
    if(r){ state.days = Number(r.getAttribute('data-days')); document.querySelectorAll('#range button').forEach(function(b){ b.classList.toggle('on', b === r); });
      api('stats?days=' + state.days).then(function(s){ state.stats = s; render(); }).catch(function(){});
      if(state.setup.searchConsole){ state.search = null; if(state.view === 'search') loadSearch().then(render); } }
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeDrawer(); });
  $('#menuBtn').addEventListener('click', function(){ $('#side').classList.toggle('open'); });
  $('#signOut').addEventListener('click', function(e){ e.preventDefault(); api('logout', {method: 'POST'}).catch(function(){}).then(function(){ location.replace('/admin'); }); });
  window.addEventListener('hashchange', route);

  fetch('/api/admin/session', {credentials: 'same-origin'}).then(function(r){ return r.json(); }).then(function(s){
    if(!s.authed){ location.replace('/admin'); return; }
    state.setup = s.setup;
    load().then(route);
  }).catch(function(){ $('#view').innerHTML = '<div class="empty">Could not reach the dashboard API.</div>'; });
})();
