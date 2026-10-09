/* Velaris owner dashboard. Data: /api/admin/* (session-cookie protected). All lead fields are escaped before display. */
(function(){
  'use strict';
  var state = { leads: [], statuses: [], stats: null, days: 30, setup: {}, view: 'overview', filter: 'all', q: '' };
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var esc = function(v){ return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var money = function(n){ return '$' + Math.round(n || 0).toLocaleString('en-US'); };
  var num = function(n){ return Math.round(n || 0).toLocaleString('en-US'); };
  var DAY = 864e5;
  var TITLES = {
    overview: ['Overview', 'Leads, pipeline and website insights'],
    leads: ['Leads', 'Every enquiry from your website, forms and Ava'],
    analytics: ['Analytics', 'Anonymous website traffic and conversions'],
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
  function sourceLabel(s){ return ({website_plan_modal: 'Plan pop-up', website_inquiry: 'Inquiry form', website_contact: 'Contact form', velaris_voice_agent: 'Ava assistant'})[s] || esc(s || 'Website'); }

  /* ---------- charts (hand-rolled SVG bars) ---------- */
  function bars(daily, series, opts){
    opts = opts || {};
    var n = daily.length, H = opts.height || 220, padB = 26, padT = 22, W = Math.max(n * 30, 600);
    var groupW = W / n, gap = groupW * 0.28, bw = (groupW - gap) / series.length;
    var max = Math.max(1, Math.max.apply(null, daily.map(function(d){ return Math.max.apply(null, series.map(function(s){ return d[s.key] || 0; })); })));
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.label || 'chart') + '">';
    svg += '<line x1="0" y1="' + (H - padB) + '" x2="' + W + '" y2="' + (H - padB) + '" stroke="#E5EAF2"/>';
    var tickEvery = Math.ceil(n / 8);
    daily.forEach(function(d, i){
      series.forEach(function(s, j){
        var v = d[s.key] || 0, h = (H - padB - padT) * v / max, x = i * groupW + gap / 2 + j * bw, y = H - padB - h;
        svg += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(bw - 2, 2).toFixed(1) + '" height="' + Math.max(h, v ? 2 : 0).toFixed(1) + '" rx="3" fill="' + s.color + '"><title>' + esc(dateLabel(d.date)) + ': ' + v + ' ' + esc(s.label) + '</title></rect>';
        if(series.length === 1 && v && n <= 45) svg += '<text x="' + (x + bw / 2 - 1).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#4A5565">' + v + '</text>';
      });
      if(i % tickEvery === 0) svg += '<text x="' + (i * groupW + groupW / 2).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle" font-size="11" fill="#8590A0">' + esc(dateLabel(d.date)) + '</text>';
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
    return '' +
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
        '<div class="card metric"><b>' + num(won.length) + '</b><span>Won</span><em class="' + (won.length ? 'up' : '') + '">' + (L.length ? Math.round(won.length / L.length * 100) : 0) + '% win rate</em></div>' +
      '</div>' +
      '<div class="sec-title">Website traffic <span class="pill">last ' + d + ' days</span></div>' +
      '<div class="grid g4">' +
        '<div class="card metric"><b>' + num(vis) + '</b><span>Visitors</span></div>' +
        '<div class="card metric"><b>' + num(pv) + '</b><span>Page views</span><em>' + (vis ? (pv / vis).toFixed(1) : '0') + ' pages per visit</em></div>' +
        '<div class="card metric"><b>' + num(fresh) + '</b><span>New visitors</span></div>' +
        '<div class="card metric"><b>' + conv.toFixed(1) + '%</b><span>Visitor &rarr; lead rate</span></div>' +
      '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Visitors over time</h2><small>for the selected period</small></div>' +
        (S.length ? bars(S, [{key: 'vis', color: '#127AFE', label: 'visitors'}], {label: 'Visitors per day'}) : '<div class="empty">No traffic data yet.</div>') + '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Recent leads</h2><a class="btn btn-ghost" href="#leads">View all</a></div>' + leadTable(recent, true) + '</div>';
  }

  function leadTable(rows, compact){
    if(!rows.length) return '<div class="empty">No leads yet. They appear here as soon as someone submits a form or chats with Ava.</div>';
    return '<div class="table-wrap"><table><thead><tr><th>Received</th><th>Lead</th>' + (compact ? '' : '<th>Contact</th>') + '<th>Plan</th><th>Value</th><th>Source</th><th>Status</th></tr></thead><tbody>' +
      rows.map(function(l){
        return '<tr data-id="' + esc(l.id) + '"><td><b>' + esc(dateLabel(l.createdAt)) + '</b><br><small>' + esc(ago(l.createdAt)) + '</small></td>' +
          '<td class="who"><b>' + esc(l.name) + '</b><small>' + esc(String(l.company || l.problem || '').slice(0, 70)) + '</small></td>' +
          (compact ? '' : '<td><small>' + esc(l.email) + (l.phone ? '<br>' + esc(l.phone) : '') + '</small></td>') +
          '<td>' + esc(planOf(l)) + '</td><td>' + (l.monthlyValue ? money(l.monthlyValue) + '/mo' : '&ndash;') + '</td>' +
          '<td><small>' + sourceLabel(l.source) + '</small></td><td>' + statusTag(l.status) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function leadsView(){
    var counts = {all: state.leads.length};
    state.statuses.forEach(function(s){ counts[s] = state.leads.filter(function(l){ return l.status === s; }).length; });
    var q = state.q.toLowerCase();
    var rows = state.leads.filter(function(l){
      if(state.filter !== 'all' && l.status !== state.filter) return false;
      return !q || [l.name, l.email, l.phone, l.company, l.problem, l.budget].join(' ').toLowerCase().indexOf(q) >= 0;
    });
    return '<div class="card"><div class="toolbar"><div class="chips">' +
      ['all'].concat(state.statuses).map(function(s){ return '<button class="chip' + (state.filter === s ? ' on' : '') + '" data-filter="' + s + '">' + s + '<span>' + (counts[s] || 0) + '</span></button>'; }).join('') +
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><input class="search" id="q" type="search" placeholder="Search name, email, project&hellip;" value="' + esc(state.q) + '"><a class="btn btn-ghost" href="/api/admin/export">Export CSV</a></div></div>' +
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
        bars(S, [{key: 'vis', color: '#127AFE', label: 'Visitors'}, {key: 'pv', color: '#B9D6FF', label: 'Page views'}], {label: 'Traffic per day'}) + '</div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Conversions</h2><small>WhatsApp clicks and form submissions per day</small></div>' +
        bars(S, [{key: 'wa', color: '#25D366', label: 'WhatsApp clicks'}, {key: 'form', color: '#0B1B33', label: 'Form submissions'}], {label: 'Conversions per day', height: 180}) + '</div>' +
      '<div class="grid g3" style="margin-top:16px;grid-template-columns:1fr 1fr">' +
        '<div class="card list-card"><h3>Top pages</h3>' + list(tops, 'No page views yet.') + '</div>' +
        '<div class="card list-card"><h3>Top referrers</h3>' + list(refs, 'No referral traffic yet (direct and search visits without a referrer are not listed).') + '</div>' +
      '</div>' +
      '<p class="note">Counts are anonymous and cookie-free: a visitor is counted once per day per browser. Bots are filtered out. For Google search queries and rankings, use Search Console.</p>';
  }

  function contentView(){
    var link = function(href, t, s){ return '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><b>' + t + '</b><small>' + s + '</small></a>'; };
    return '<div class="sec-title">Edit your website</div><div class="links">' +
      link('https://velaris-web.sanity.studio/', 'Sanity Studio', 'Services, case studies, blog, FAQs, pricing') +
      link('https://velaris-web.sanity.studio/structure/services', 'Service pages', 'Headlines, sections, FAQs and SEO') +
      link('https://velaris-web.sanity.studio/structure/post', 'Blog posts', 'Write and edit articles') +
      '</div><div class="sec-title">Your site</div><div class="links">' +
      link('/', 'Homepage', 'velarisweb.com') + link('/pricing', 'Pricing', 'Plans from $199/month') + link('/services', 'Services', 'All service pages') +
      '</div><div class="sec-title">Tools</div><div class="links">' +
      link('https://search.google.com/search-console', 'Google Search Console', 'Rankings, queries, indexing') +
      link('https://vercel.com/dashboard', 'Vercel', 'Deployments, domains, settings') +
      link('https://calendly.com/app/scheduled_events/user/me', 'Calendly', 'Booked calls') +
      '</div><p class="note">Changes in Sanity show on the next deploy for service, case study and blog pages.</p>';
  }

  function setupView(){
    var s = state.setup;
    var row = function(ok, title, body){ return '<div class="check"><span class="dot ' + (ok ? 'ok' : 'todo') + '">' + (ok ? '&#10003;' : '!') + '</span><div><b>' + title + '</b><p>' + body + '</p></div></div>'; };
    return '<div class="card">' +
      row(s.password, 'Admin password', s.password ? 'Set. Change it any time with the <code>ADMIN_PASSWORD</code> environment variable in Vercel.' : 'Add <code>ADMIN_PASSWORD</code> (8+ characters) in Vercel &rarr; Settings &rarr; Environment Variables, then redeploy.') +
      row(s.storage, 'Private lead & analytics storage', s.storage ? (s.devMemory ? 'Running on temporary in-memory storage (local test only).' : 'Connected. Leads and traffic counters are stored privately in Redis.') : 'In Vercel &rarr; Storage &rarr; Create Database &rarr; <b>Upstash for Redis</b> (free) &rarr; connect it to the velarisweb project, then redeploy. Until then, forms fall back to WhatsApp and traffic is not counted.') +
      row(true, 'WhatsApp click & form tracking', 'Built into every page. Anonymous and cookie-free.') +
      row(false, 'Google Search Console', 'Verify velarisweb.com and submit <code>https://velarisweb.com/sitemap.xml</code> to see search queries and rankings.') +
      row(false, 'Redirect www to velarisweb.com', 'Vercel &rarr; Settings &rarr; Domains: set www.velarisweb.com to redirect to velarisweb.com.') +
      '</div>';
  }

  function drawer(lead){
    var p = $('#drawerPanel');
    var phone = String(lead.phone || '').replace(/[^\d]/g, '');
    p.innerHTML = '<button class="x" data-close aria-label="Close">&times;</button>' + statusTag(lead.status) +
      '<h2>' + esc(lead.name) + '</h2><div style="color:var(--ink-3);font-size:14px">' + esc(dateLabel(lead.createdAt)) + ' &middot; ' + sourceLabel(lead.source) + '</div>' +
      '<div class="actions" style="margin-top:16px">' +
        (lead.email ? '<a class="btn btn-ghost" href="mailto:' + esc(lead.email) + '">Email</a>' : '') +
        (phone ? '<a class="btn btn-wa" href="https://wa.me/' + phone + '" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-ghost" href="tel:+' + phone + '">Call</a>' : '') +
      '</div>' +
      '<dl class="dl"><dt>Email</dt><dd>' + esc(lead.email) + '</dd><dt>Phone</dt><dd>' + esc(lead.phone || '&ndash;') + '</dd>' +
        (lead.company ? '<dt>Company</dt><dd>' + esc(lead.company) + '</dd>' : '') +
        '<dt>Plan</dt><dd>' + esc(lead.budget || 'Not specified') + '</dd>' +
        (lead.serviceInterest ? '<dt>Interest</dt><dd>' + esc(lead.serviceInterest) + '</dd>' : '') +
        (lead.problem ? '<dt>Project</dt><dd>' + esc(lead.problem) + '</dd>' : '') +
        (lead.goal ? '<dt>Goal</dt><dd>' + esc(lead.goal) + '</dd>' : '') +
        (lead.conversationSummary ? '<dt>Ava summary</dt><dd>' + esc(lead.conversationSummary) + '</dd>' : '') +
        (lead.score != null ? '<dt>Lead score</dt><dd>' + esc(lead.score) + ' &middot; ' + esc(lead.classification || '') + '</dd>' : '') +
      '</dl>' +
      '<form id="leadForm" class="grid" style="gap:14px">' +
        '<label class="field"><span>Status</span><select name="status">' + state.statuses.map(function(s){ return '<option value="' + s + '"' + (s === lead.status ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field"><span>Monthly value ($)</span><input name="monthlyValue" type="number" min="0" step="1" value="' + esc(lead.monthlyValue || 0) + '"></label>' +
        '<label class="field"><span>Notes</span><textarea name="notes" rows="5" placeholder="Call notes, next step&hellip;">' + esc(lead.notes || '') + '</textarea></label>' +
        '<div><button class="btn btn-primary" type="submit">Save changes</button><span class="saved" id="saved">Saved</span></div>' +
      '</form>';
    $('#drawer').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false');
    $('#leadForm').addEventListener('submit', function(e){
      e.preventDefault();
      var f = e.target, btn = f.querySelector('button'); btn.disabled = true;
      api('leads', {method: 'PATCH', body: JSON.stringify({id: lead.id, status: f.status.value, notes: f.notes.value, monthlyValue: Number(f.monthlyValue.value)})})
        .then(function(r){
          var i = state.leads.findIndex(function(l){ return l.id === lead.id; }); if(i >= 0) state.leads[i] = r.lead;
          $('#saved').classList.add('show'); setTimeout(function(){ $('#saved').classList.remove('show'); }, 1600);
          render(); drawer(r.lead);
        }).catch(function(err){ alert(err.message); }).then(function(){ btn.disabled = false; });
    });
  }
  function closeDrawer(){ $('#drawer').classList.remove('on'); $('#drawer').setAttribute('aria-hidden', 'true'); }

  /* ---------- render & routing ---------- */
  function render(){
    var v = state.view, views = {overview: overview, leads: leadsView, analytics: analyticsView, content: contentView, setup: setupView};
    document.querySelectorAll('.nav a[data-view]').forEach(function(a){ a.classList.toggle('on', a.getAttribute('data-view') === v); });
    $('#viewTitle').textContent = TITLES[v][0]; $('#viewSub').textContent = TITLES[v][1];
    $('#range').style.visibility = (v === 'overview' || v === 'analytics') ? 'visible' : 'hidden';
    var fresh = state.leads.filter(function(l){ return l.status === 'new'; }).length, nc = $('#newCount');
    nc.hidden = !fresh; nc.textContent = fresh;
    $('#view').innerHTML = (views[v] || overview)();
    var q = $('#q');
    if(q){ q.addEventListener('input', function(){ state.q = q.value; var pos = q.selectionStart; render(); var nq = $('#q'); nq.focus(); nq.setSelectionRange(pos, pos); }); }
  }
  function route(){ state.view = (location.hash || '#overview').slice(1); if(!TITLES[state.view]) state.view = 'overview'; render(); $('#side').classList.remove('open'); }

  function load(){
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
    var r = e.target.closest('#range button');
    if(r){ state.days = Number(r.getAttribute('data-days')); document.querySelectorAll('#range button').forEach(function(b){ b.classList.toggle('on', b === r); });
      api('stats?days=' + state.days).then(function(s){ state.stats = s; render(); }).catch(function(){}); }
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
