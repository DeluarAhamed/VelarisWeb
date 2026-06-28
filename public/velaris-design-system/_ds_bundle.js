/* @ds-bundle: {"format":3,"namespace":"VelarisWebDesignSystem_2aace9","components":[],"sourceHashes":{"assets/icons.js":"8bfcfdb08f64","ui_kits/web-app/app.jsx":"bbc726e21d92","ui_kits/web-app/blog-data.js":"20ad0f3bf1aa","ui_kits/web-app/chrome.jsx":"1a03034d3603","ui_kits/web-app/data.js":"1765a8521242","ui_kits/web-app/extras.jsx":"0fdc0239e0b3","ui_kits/web-app/home-data.js":"106a95e00351","ui_kits/web-app/home-figma.js":"fdc1439084c2","ui_kits/web-app/pages.js":"6280fea39ac2","ui_kits/web-app/primitives.jsx":"00188117af56","ui_kits/web-app/screens.jsx":"cf37896a789c","ui_kits/web-app/service-data.js":"f8f1468deb3e","ui_kits/web-app/site.js":"56ddec6f3313"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VelarisWebDesignSystem_2aace9 = window.VelarisWebDesignSystem_2aace9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/icons.js
try { (() => {
/* Velaris icon hydrator — inlines Ant Outlined SVGs so they recolor via
   `currentColor`. Usage: <span class="vi" data-icon="search"></span>
   Set window.ICON_BASE (default "assets/icons") before this script loads. */
(function () {
  var cache = {};
  function get(u) {
    return cache[u] || (cache[u] = fetch(u).then(function (r) {
      return r.text();
    }));
  }
  async function hydrate(root) {
    root = root || document;
    var base = window.ICON_BASE || 'assets/icons';
    var els = root.querySelectorAll('[data-icon]:not([data-icon-done])');
    await Promise.all([].slice.call(els).map(async function (el) {
      var n = el.getAttribute('data-icon');
      try {
        var txt = await get(base + '/' + n + '.svg');
        el.innerHTML = txt;
        var s = el.querySelector('svg');
        if (s) {
          s.removeAttribute('width');
          s.removeAttribute('height');
          s.setAttribute('fill', 'currentColor');
          s.style.width = '100%';
          s.style.height = '100%';
          s.style.display = 'block';
        }
        el.setAttribute('data-icon-done', '');
      } catch (e) {/* ignore */}
    }));
  }
  window.hydrateIcons = hydrate;
  if (document.readyState !== 'loading') hydrate();else document.addEventListener('DOMContentLoaded', function () {
    hydrate();
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/icons.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/app.jsx
try { (() => {
// Velaris Web UI Kit — root app

const TITLES = {
  dashboard: {
    t: 'Dashboard',
    s: 'Overview of your workspace'
  },
  projects: {
    t: 'Projects',
    s: 'Every site in your workspace'
  },
  analytics: {
    t: 'Analytics',
    s: 'Traffic across all projects'
  },
  team: {
    t: 'Team',
    s: 'Manage who can access Velaris'
  },
  settings: {
    t: 'Settings',
    s: 'Profile and workspace preferences'
  },
  help: {
    t: 'Help & docs',
    s: 'Guides, references and support'
  }
};
function Toast({
  msg
}) {
  if (!msg) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "toast"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 16,
    style: {
      color: 'var(--color-success)'
    }
  }), msg);
}
function App() {
  const [authed, setAuthed] = React.useState(() => localStorage.getItem('velaris_authed') === '1');
  const [nav, setNav] = React.useState(() => localStorage.getItem('velaris_nav') || 'dashboard');
  const [detail, setDetail] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [toast, setToast] = React.useState('');
  React.useEffect(() => {
    localStorage.setItem('velaris_authed', authed ? '1' : '0');
  }, [authed]);
  React.useEffect(() => {
    localStorage.setItem('velaris_nav', nav);
  }, [nav]);
  const flash = m => {
    setToast(m);
    clearTimeout(window.__t);
    window.__t = setTimeout(() => setToast(''), 2600);
  };
  if (!authed) return /*#__PURE__*/React.createElement(Login, {
    onLogin: () => {
      setAuthed(true);
      flash('Signed in to Velaris');
    }
  });
  const go = k => {
    setNav(k);
    setDetail(null);
  };
  const meta = TITLES[nav];
  let body;
  if (detail) body = /*#__PURE__*/React.createElement(ProjectDetail, {
    p: detail,
    onBack: () => setDetail(null)
  });else if (nav === 'dashboard') body = /*#__PURE__*/React.createElement(Dashboard, {
    onOpen: setDetail
  });else if (nav === 'projects') body = /*#__PURE__*/React.createElement(Projects, {
    query: search,
    onOpen: setDetail,
    onNew: () => setModal('new')
  });else if (nav === 'analytics') body = /*#__PURE__*/React.createElement(Analytics, null);else if (nav === 'team') body = /*#__PURE__*/React.createElement(Team, {
    onInvite: () => setModal('invite')
  });else if (nav === 'settings') body = /*#__PURE__*/React.createElement(Settings, null);else body = /*#__PURE__*/React.createElement(EmptyHelp, null);
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: nav,
    onNav: go,
    user: VELARIS_USER
  }), /*#__PURE__*/React.createElement("div", {
    className: "app-main"
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: detail ? detail.name : meta.t,
    subtitle: detail ? detail.domain : meta.s,
    search: search,
    setSearch: setSearch,
    onNew: (nav === 'projects' || nav === 'dashboard') && !detail ? () => setModal('new') : null,
    onLogout: () => {
      setAuthed(false);
      setNav('dashboard');
      setDetail(null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "app-content scrollarea"
  }, body)), modal === 'new' && /*#__PURE__*/React.createElement(NewProjectModal, {
    onClose: () => setModal(null),
    onCreate: n => {
      setModal(null);
      flash('Project “' + n + '” is deploying');
      setNav('projects');
    }
  }), modal === 'invite' && /*#__PURE__*/React.createElement(InviteModal, {
    onClose: () => {
      setModal(null);
      flash('Invite sent');
    }
  }), /*#__PURE__*/React.createElement(Toast, {
    msg: toast
  }));
}
function EmptyHelp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "fadeup",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '60px 0',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 16,
      background: 'var(--teal-1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "question-circle",
    size: 30,
    style: {
      color: 'var(--teal-7)'
    }
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 600
    }
  }, "How can we help?"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      margin: 0,
      maxWidth: 380
    }
  }, "Search the docs, browse guides, or reach out to support \u2014 we usually reply within a few hours."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "message"
  }, "Contact support"));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/blog-data.js
try { (() => {
/* Velaris Web — CMS-ready blog dataset (103 SEO-targeted articles).
   Each entry maps to a CMS item: title, category (cat), target keyword (kw), excerpt, slug, date, read time, body (rich text).
   Swap this array for a live CMS feed (Webflow CMS / Framer CMS / headless) — fields are 1:1. */
window.VELARIS_POSTS = [{
  "title": "The 2026 Local SEO Checklist for Service Businesses",
  "cat": "Local SEO",
  "kw": "local seo checklist 2026",
  "excerpt": "Rank in your service area with a step-by-step local SEO checklist built for founders and small teams.",
  "slug": "the-2026-local-seo-checklist-for-service-businesses",
  "date": "May 01, 2026",
  "read": 4,
  "body": "<p>If you run a service business, <strong>the 2026 local seo checklist for service businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting local seo checklist 2026 right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, local seo checklist 2026 becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Rank in the Google Map Pack (Local 3-Pack)",
  "cat": "Local SEO",
  "kw": "google map pack ranking",
  "excerpt": "The exact signals Google uses to choose the local 3-pack — and how to win one of those three spots.",
  "slug": "how-to-rank-in-the-google-map-pack-local-3-pack",
  "date": "May 08, 2026",
  "read": 5,
  "body": "<p>If you run a service business, <strong>how to rank in the google map pack (local 3-pack)</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting google map pack ranking right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, google map pack ranking becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Google Business Profile Optimization: A Complete Guide",
  "cat": "Local SEO",
  "kw": "google business profile optimization",
  "excerpt": "Turn your Google Business Profile into a lead engine with categories, posts, reviews and photos that convert.",
  "slug": "google-business-profile-optimization-a-complete-guide",
  "date": "Apr 15, 2026",
  "read": 6,
  "body": "<p>If you run a service business, <strong>google business profile optimization: a complete guide</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting google business profile optimization right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, google business profile optimization becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Local Citations: Do They Still Matter in 2026?",
  "cat": "Local SEO",
  "kw": "local citations seo",
  "excerpt": "What citations actually move the needle now, which directories to ignore, and how to keep NAP consistent.",
  "slug": "local-citations-do-they-still-matter-in-2026",
  "date": "Apr 22, 2026",
  "read": 7,
  "body": "<p>If you run a service business, <strong>local citations: do they still matter in 2026?</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting local citations seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, local citations seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Get More Google Reviews (Without Begging)",
  "cat": "Local SEO",
  "kw": "get more google reviews",
  "excerpt": "A simple, ethical review-generation system that builds trust and lifts local rankings on autopilot.",
  "slug": "how-to-get-more-google-reviews-without-begging",
  "date": "Mar 02, 2026",
  "read": 8,
  "body": "<p>If you run a service business, <strong>how to get more google reviews (without begging)</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting get more google reviews right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, get more google reviews becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Service Area Pages That Actually Rank",
  "cat": "Local SEO",
  "kw": "service area pages seo",
  "excerpt": "Build location pages that rank without thin or duplicate content — with a repeatable page template.",
  "slug": "service-area-pages-that-actually-rank",
  "date": "Mar 09, 2026",
  "read": 9,
  "body": "<p>If you run a service business, <strong>service area pages that actually rank</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting service area pages seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, service area pages seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Local Link Building for Small Businesses",
  "cat": "Local SEO",
  "kw": "local link building",
  "excerpt": "Where local backlinks really come from and how to earn them without an agency-sized budget.",
  "slug": "local-link-building-for-small-businesses",
  "date": "Feb 16, 2026",
  "read": 10,
  "body": "<p>If you run a service business, <strong>local link building for small businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting local link building right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, local link building becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Why Your Business Isn't Showing Up on Google Maps",
  "cat": "Local SEO",
  "kw": "not showing on google maps",
  "excerpt": "The most common reasons local businesses stay invisible on Maps — and the fastest fixes.",
  "slug": "why-your-business-isn-t-showing-up-on-google-maps",
  "date": "Feb 23, 2026",
  "read": 4,
  "body": "<p>If you run a service business, <strong>why your business isn't showing up on google maps</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting not showing on google maps right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, not showing on google maps becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Local Keyword Research for Founders",
  "cat": "Local SEO",
  "kw": "local keyword research",
  "excerpt": "Find the high-intent local searches your future customers actually type — using free tools.",
  "slug": "local-keyword-research-for-founders",
  "date": "Jan 03, 2026",
  "read": 5,
  "body": "<p>If you run a service business, <strong>local keyword research for founders</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting local keyword research right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, local keyword research becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "NAP Consistency: The Silent Local Ranking Factor",
  "cat": "Local SEO",
  "kw": "nap consistency local seo",
  "excerpt": "How inconsistent name, address and phone data quietly tanks rankings, and how to audit it.",
  "slug": "nap-consistency-the-silent-local-ranking-factor",
  "date": "Jan 10, 2026",
  "read": 6,
  "body": "<p>If you run a service business, <strong>nap consistency: the silent local ranking factor</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting nap consistency local seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, nap consistency local seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Local SEO for Multi-Location Businesses",
  "cat": "Local SEO",
  "kw": "multi location local seo",
  "excerpt": "Scale local rankings across many locations without cannibalizing your own pages.",
  "slug": "local-seo-for-multi-location-businesses",
  "date": "Dec 17, 2025",
  "read": 7,
  "body": "<p>If you run a service business, <strong>local seo for multi-location businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting multi location local seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, multi location local seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Outrank Bigger Competitors Locally",
  "cat": "Local SEO",
  "kw": "outrank competitors local seo",
  "excerpt": "Punch above your weight in local search with relevance and proximity plays the big brands miss.",
  "slug": "how-to-outrank-bigger-competitors-locally",
  "date": "Dec 24, 2025",
  "read": 8,
  "body": "<p>If you run a service business, <strong>how to outrank bigger competitors locally</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting outrank competitors local seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, outrank competitors local seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Why Your Beautiful Website Isn't Generating Leads",
  "cat": "Web Design",
  "kw": "website not generating leads",
  "excerpt": "The five conversion gaps that quietly cost service businesses their best enquiries every month.",
  "slug": "why-your-beautiful-website-isn-t-generating-leads",
  "date": "Nov 04, 2025",
  "read": 9,
  "body": "<p>If you run a service business, <strong>why your beautiful website isn't generating leads</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website not generating leads right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, website not generating leads becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Web Design Trends That Actually Convert in 2026",
  "cat": "Web Design",
  "kw": "web design trends 2026",
  "excerpt": "Skip the gimmicks — these are the design patterns proven to lift conversions this year.",
  "slug": "web-design-trends-that-actually-convert-in-2026",
  "date": "Nov 11, 2025",
  "read": 10,
  "body": "<p>If you run a service business, <strong>web design trends that actually convert in 2026</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting web design trends 2026 right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, web design trends 2026 becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "The Anatomy of a High-Converting Homepage",
  "cat": "Web Design",
  "kw": "high converting homepage",
  "excerpt": "A section-by-section breakdown of a homepage engineered to turn visitors into booked calls.",
  "slug": "the-anatomy-of-a-high-converting-homepage",
  "date": "Oct 18, 2025",
  "read": 4,
  "body": "<p>If you run a service business, <strong>the anatomy of a high-converting homepage</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting high converting homepage right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, high converting homepage becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Above the Fold: What Your Hero Section Must Say",
  "cat": "Web Design",
  "kw": "hero section best practices",
  "excerpt": "Nail the first five seconds with a hero that communicates value, trust and a clear next step.",
  "slug": "above-the-fold-what-your-hero-section-must-say",
  "date": "Oct 25, 2025",
  "read": 5,
  "body": "<p>If you run a service business, <strong>above the fold: what your hero section must say</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting hero section best practices right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, hero section best practices becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Website Redesign Checklist for Service Businesses",
  "cat": "Web Design",
  "kw": "website redesign checklist",
  "excerpt": "Everything to plan before a redesign so you gain leads instead of losing your rankings.",
  "slug": "website-redesign-checklist-for-service-businesses",
  "date": "Sep 05, 2025",
  "read": 6,
  "body": "<p>If you run a service business, <strong>website redesign checklist for service businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website redesign checklist right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, website redesign checklist becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How Fast Should Your Website Load in 2026?",
  "cat": "Web Design",
  "kw": "website load speed 2026",
  "excerpt": "Core Web Vitals benchmarks that affect rankings and conversions, plus how to hit them.",
  "slug": "how-fast-should-your-website-load-in-2026",
  "date": "Sep 12, 2025",
  "read": 7,
  "body": "<p>If you run a service business, <strong>how fast should your website load in 2026?</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website load speed 2026 right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, website load speed 2026 becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Mobile-First Design: Why It's Non-Negotiable",
  "cat": "Web Design",
  "kw": "mobile first web design",
  "excerpt": "Most of your traffic is on a phone — design for it first or lose the lead before they read.",
  "slug": "mobile-first-design-why-it-s-non-negotiable",
  "date": "Aug 19, 2025",
  "read": 8,
  "body": "<p>If you run a service business, <strong>mobile-first design: why it's non-negotiable</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting mobile first web design right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, mobile first web design becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Whitespace, Hierarchy and Trust in Web Design",
  "cat": "Web Design",
  "kw": "visual hierarchy web design",
  "excerpt": "Use space and hierarchy to guide the eye and make your business feel premium and credible.",
  "slug": "whitespace-hierarchy-and-trust-in-web-design",
  "date": "Aug 26, 2025",
  "read": 9,
  "body": "<p>If you run a service business, <strong>whitespace, hierarchy and trust in web design</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting visual hierarchy web design right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, visual hierarchy web design becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Choosing the Right Images for Your Website",
  "cat": "Web Design",
  "kw": "website images best practices",
  "excerpt": "Why stock photos kill trust and what to use instead to feel authentic and convert.",
  "slug": "choosing-the-right-images-for-your-website",
  "date": "Jul 06, 2025",
  "read": 10,
  "body": "<p>If you run a service business, <strong>choosing the right images for your website</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website images best practices right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, website images best practices becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Accessibility Is Good for Business (and SEO)",
  "cat": "Web Design",
  "kw": "website accessibility seo",
  "excerpt": "How accessible design widens your market, reduces risk and quietly improves rankings.",
  "slug": "accessibility-is-good-for-business-and-seo",
  "date": "Jul 13, 2025",
  "read": 4,
  "body": "<p>If you run a service business, <strong>accessibility is good for business (and seo)</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website accessibility seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, website accessibility seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Call-to-Action Copy That Gets Clicks",
  "cat": "Conversion",
  "kw": "cta copywriting",
  "excerpt": "Write CTAs that feel like the obvious next step — with formulas and real examples.",
  "slug": "call-to-action-copy-that-gets-clicks",
  "date": "Jun 20, 2025",
  "read": 5,
  "body": "<p>If you run a service business, <strong>call-to-action copy that gets clicks</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting cta copywriting right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, cta copywriting becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "The Psychology of Trust on a Website",
  "cat": "Conversion",
  "kw": "website trust signals",
  "excerpt": "The trust signals that make first-time visitors comfortable enough to contact you.",
  "slug": "the-psychology-of-trust-on-a-website",
  "date": "Jun 27, 2025",
  "read": 6,
  "body": "<p>If you run a service business, <strong>the psychology of trust on a website</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website trust signals right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, website trust signals becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Use Social Proof to Win More Clients",
  "cat": "Conversion",
  "kw": "social proof conversion",
  "excerpt": "Reviews, logos, case studies and numbers — placed where they actually change minds.",
  "slug": "how-to-use-social-proof-to-win-more-clients",
  "date": "May 07, 2025",
  "read": 7,
  "body": "<p>If you run a service business, <strong>how to use social proof to win more clients</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting social proof conversion right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, social proof conversion becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Reducing Form Friction to Capture More Leads",
  "cat": "Conversion",
  "kw": "reduce form friction",
  "excerpt": "Every extra field costs you leads. How to ask for less and convert more.",
  "slug": "reducing-form-friction-to-capture-more-leads",
  "date": "May 14, 2025",
  "read": 8,
  "body": "<p>If you run a service business, <strong>reducing form friction to capture more leads</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting reduce form friction right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, reduce form friction becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Landing Page Optimization for Service Businesses",
  "cat": "Conversion",
  "kw": "landing page optimization",
  "excerpt": "Build campaign landing pages that turn ad clicks into booked calls, not bounces.",
  "slug": "landing-page-optimization-for-service-businesses",
  "date": "Apr 21, 2025",
  "read": 9,
  "body": "<p>If you run a service business, <strong>landing page optimization for service businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting landing page optimization right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, landing page optimization becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "A/B Testing for Small Businesses",
  "cat": "Conversion",
  "kw": "ab testing small business",
  "excerpt": "Run meaningful tests without enterprise traffic — what to test first and how to read results.",
  "slug": "a-b-testing-for-small-businesses",
  "date": "Apr 01, 2025",
  "read": 10,
  "body": "<p>If you run a service business, <strong>a/b testing for small businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ab testing small business right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, ab testing small business becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "The Lead Magnet Playbook",
  "cat": "Conversion",
  "kw": "lead magnet ideas",
  "excerpt": "Design an e-book or tool people actually want to trade their email for.",
  "slug": "the-lead-magnet-playbook",
  "date": "Mar 08, 2025",
  "read": 4,
  "body": "<p>If you run a service business, <strong>the lead magnet playbook</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting lead magnet ideas right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, lead magnet ideas becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Heatmaps: What Your Visitors Aren't Telling You",
  "cat": "Conversion",
  "kw": "website heatmaps",
  "excerpt": "Use heatmaps and session recordings to find the leaks in your conversion path.",
  "slug": "heatmaps-what-your-visitors-aren-t-telling-you",
  "date": "Mar 15, 2025",
  "read": 5,
  "body": "<p>If you run a service business, <strong>heatmaps: what your visitors aren't telling you</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website heatmaps right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, website heatmaps becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Conversion Rate Benchmarks by Industry",
  "cat": "Conversion",
  "kw": "conversion rate benchmarks",
  "excerpt": "What a 'good' conversion rate looks like for service businesses — and how to beat it.",
  "slug": "conversion-rate-benchmarks-by-industry",
  "date": "Feb 22, 2025",
  "read": 6,
  "body": "<p>If you run a service business, <strong>conversion rate benchmarks by industry</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting conversion rate benchmarks right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, conversion rate benchmarks becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Microcopy That Removes Doubt",
  "cat": "Conversion",
  "kw": "microcopy ux",
  "excerpt": "The tiny words near buttons and forms that quietly close the deal.",
  "slug": "microcopy-that-removes-doubt",
  "date": "Feb 02, 2025",
  "read": 7,
  "body": "<p>If you run a service business, <strong>microcopy that removes doubt</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting microcopy ux right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, microcopy ux becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Generate 10+ Qualified Leads a Month",
  "cat": "Lead Generation",
  "kw": "generate qualified leads",
  "excerpt": "The repeatable system we use to deliver consistent, qualified leads for service businesses.",
  "slug": "how-to-generate-10-qualified-leads-a-month",
  "date": "Jan 09, 2025",
  "read": 8,
  "body": "<p>If you run a service business, <strong>how to generate 10+ qualified leads a month</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting generate qualified leads right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, generate qualified leads becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Inbound vs Outbound: What Works for Founders",
  "cat": "Lead Generation",
  "kw": "inbound vs outbound leads",
  "excerpt": "Where to spend your first marketing hours for predictable pipeline as a small team.",
  "slug": "inbound-vs-outbound-what-works-for-founders",
  "date": "Jan 16, 2025",
  "read": 9,
  "body": "<p>If you run a service business, <strong>inbound vs outbound: what works for founders</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting inbound vs outbound leads right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, inbound vs outbound leads becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Building a Lead Generation Funnel from Scratch",
  "cat": "Lead Generation",
  "kw": "lead generation funnel",
  "excerpt": "Map the journey from stranger to booked call and plug every leak along the way.",
  "slug": "building-a-lead-generation-funnel-from-scratch",
  "date": "Dec 23, 2024",
  "read": 10,
  "body": "<p>If you run a service business, <strong>building a lead generation funnel from scratch</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting lead generation funnel right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, lead generation funnel becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Qualifying Leads So You Stop Wasting Calls",
  "cat": "Lead Generation",
  "kw": "lead qualification",
  "excerpt": "Filter out tyre-kickers before the call with smart forms and pre-qualification.",
  "slug": "qualifying-leads-so-you-stop-wasting-calls",
  "date": "Dec 03, 2024",
  "read": 4,
  "body": "<p>If you run a service business, <strong>qualifying leads so you stop wasting calls</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting lead qualification right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, lead qualification becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Lead Nurturing Sequences That Book Calls",
  "cat": "Lead Generation",
  "kw": "lead nurturing sequence",
  "excerpt": "Turn 'not right now' into 'let's talk' with a simple nurture sequence.",
  "slug": "lead-nurturing-sequences-that-book-calls",
  "date": "Nov 10, 2024",
  "read": 5,
  "body": "<p>If you run a service business, <strong>lead nurturing sequences that book calls</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting lead nurturing sequence right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, lead nurturing sequence becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How Much Should a Lead Cost Your Business?",
  "cat": "Lead Generation",
  "kw": "cost per lead",
  "excerpt": "Work out your target cost per lead and what to do when acquisition gets expensive.",
  "slug": "how-much-should-a-lead-cost-your-business",
  "date": "Nov 17, 2024",
  "read": 6,
  "body": "<p>If you run a service business, <strong>how much should a lead cost your business?</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting cost per lead right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, cost per lead becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Turning Website Visitors Into Booked Calls",
  "cat": "Lead Generation",
  "kw": "website visitors to calls",
  "excerpt": "Bridge the gap between traffic and revenue with the right on-page conversion plays.",
  "slug": "turning-website-visitors-into-booked-calls",
  "date": "Oct 24, 2024",
  "read": 7,
  "body": "<p>If you run a service business, <strong>turning website visitors into booked calls</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website visitors to calls right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, website visitors to calls becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "The Founder's Guide to a Predictable Pipeline",
  "cat": "Lead Generation",
  "kw": "predictable sales pipeline",
  "excerpt": "Stop riding the feast-or-famine rollercoaster with a system that compounds.",
  "slug": "the-founder-s-guide-to-a-predictable-pipeline",
  "date": "Oct 04, 2024",
  "read": 8,
  "body": "<p>If you run a service business, <strong>the founder's guide to a predictable pipeline</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting predictable sales pipeline right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, predictable sales pipeline becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Webflow vs WordPress for Service Businesses",
  "cat": "Webflow",
  "kw": "webflow vs wordpress",
  "excerpt": "An honest comparison on speed, SEO, maintenance and cost for lead-focused sites.",
  "slug": "webflow-vs-wordpress-for-service-businesses",
  "date": "Sep 11, 2024",
  "read": 9,
  "body": "<p>If you run a service business, <strong>webflow vs wordpress for service businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting webflow vs wordpress right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, webflow vs wordpress becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Is Webflow Good for SEO in 2026?",
  "cat": "Webflow",
  "kw": "webflow seo",
  "excerpt": "What Webflow gets right for SEO, its limits, and how to squeeze maximum rankings out of it.",
  "slug": "is-webflow-good-for-seo-in-2026",
  "date": "Sep 18, 2024",
  "read": 10,
  "body": "<p>If you run a service business, <strong>is webflow good for seo in 2026?</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting webflow seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, webflow seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Build a Fast Webflow Site",
  "cat": "Webflow",
  "kw": "fast webflow site",
  "excerpt": "Performance tactics for Webflow — images, fonts, interactions and Core Web Vitals.",
  "slug": "how-to-build-a-fast-webflow-site",
  "date": "Aug 25, 2024",
  "read": 4,
  "body": "<p>If you run a service business, <strong>how to build a fast webflow site</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting fast webflow site right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, fast webflow site becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Webflow CMS for Blogs That Rank",
  "cat": "Webflow",
  "kw": "webflow cms blog",
  "excerpt": "Structure a Webflow CMS so your content scales and ranks without developer help.",
  "slug": "webflow-cms-for-blogs-that-rank",
  "date": "Aug 05, 2024",
  "read": 5,
  "body": "<p>If you run a service business, <strong>webflow cms for blogs that rank</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting webflow cms blog right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, webflow cms blog becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Migrating From WordPress to Webflow",
  "cat": "Webflow",
  "kw": "wordpress to webflow migration",
  "excerpt": "A safe migration plan that protects your rankings and traffic.",
  "slug": "migrating-from-wordpress-to-webflow",
  "date": "Jul 12, 2024",
  "read": 6,
  "body": "<p>If you run a service business, <strong>migrating from wordpress to webflow</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting wordpress to webflow migration right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, wordpress to webflow migration becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Webflow Maintenance: What to Expect",
  "cat": "Webflow",
  "kw": "webflow maintenance",
  "excerpt": "The real ongoing cost and effort of running a Webflow site as a business owner.",
  "slug": "webflow-maintenance-what-to-expect",
  "date": "Jul 19, 2024",
  "read": 7,
  "body": "<p>If you run a service business, <strong>webflow maintenance: what to expect</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting webflow maintenance right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, webflow maintenance becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Framer vs Webflow: Which Should You Choose?",
  "cat": "Framer",
  "kw": "framer vs webflow",
  "excerpt": "Two great no-code platforms compared for speed, design freedom and SEO.",
  "slug": "framer-vs-webflow-which-should-you-choose",
  "date": "Jun 26, 2024",
  "read": 8,
  "body": "<p>If you run a service business, <strong>framer vs webflow: which should you choose?</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting framer vs webflow right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating framer as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good framer delivers.</blockquote><h2>The bottom line</h2><p>Done well, framer vs webflow becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Building Animated Sites in Framer",
  "cat": "Framer",
  "kw": "framer animations",
  "excerpt": "Use motion to guide attention and feel premium without hurting performance.",
  "slug": "building-animated-sites-in-framer",
  "date": "Jun 06, 2024",
  "read": 9,
  "body": "<p>If you run a service business, <strong>building animated sites in framer</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting framer animations right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating framer as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good framer delivers.</blockquote><h2>The bottom line</h2><p>Done well, framer animations becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Is Framer SEO-Ready for Business Sites?",
  "cat": "Framer",
  "kw": "framer seo",
  "excerpt": "What you need to know about Framer's SEO capabilities before you commit.",
  "slug": "is-framer-seo-ready-for-business-sites",
  "date": "May 13, 2024",
  "read": 10,
  "body": "<p>If you run a service business, <strong>is framer seo-ready for business sites?</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting framer seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating framer as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good framer delivers.</blockquote><h2>The bottom line</h2><p>Done well, framer seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Framer for Landing Pages and Launches",
  "cat": "Framer",
  "kw": "framer landing pages",
  "excerpt": "Why Framer is a strong pick for fast, beautiful campaign and launch pages.",
  "slug": "framer-for-landing-pages-and-launches",
  "date": "May 20, 2024",
  "read": 4,
  "body": "<p>If you run a service business, <strong>framer for landing pages and launches</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting framer landing pages right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating framer as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good framer delivers.</blockquote><h2>The bottom line</h2><p>Done well, framer landing pages becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How We Use Claude AI to Build Better Websites",
  "cat": "AI Web Development",
  "kw": "claude ai web development",
  "excerpt": "Inside our AI-assisted build process that ships faster without cutting quality.",
  "slug": "how-we-use-claude-ai-to-build-better-websites",
  "date": "Apr 27, 2024",
  "read": 5,
  "body": "<p>If you run a service business, <strong>how we use claude ai to build better websites</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting claude ai web development right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, claude ai web development becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "AI in Web Design: Hype vs Reality in 2026",
  "cat": "AI Web Development",
  "kw": "ai web design 2026",
  "excerpt": "Where AI genuinely speeds up web projects and where human craft still wins.",
  "slug": "ai-in-web-design-hype-vs-reality-in-2026",
  "date": "Apr 07, 2024",
  "read": 6,
  "body": "<p>If you run a service business, <strong>ai in web design: hype vs reality in 2026</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ai web design 2026 right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, ai web design 2026 becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Custom-Coded vs No-Code: When to Choose Each",
  "cat": "AI Web Development",
  "kw": "custom coded vs no code",
  "excerpt": "A practical framework for deciding between custom development and no-code tools.",
  "slug": "custom-coded-vs-no-code-when-to-choose-each",
  "date": "Mar 14, 2024",
  "read": 7,
  "body": "<p>If you run a service business, <strong>custom-coded vs no-code: when to choose each</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting custom coded vs no code right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, custom coded vs no code becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Building AI Chat Assistants Into Your Website",
  "cat": "AI Web Development",
  "kw": "website ai chat assistant",
  "excerpt": "Add an AI assistant that qualifies leads and answers questions around the clock.",
  "slug": "building-ai-chat-assistants-into-your-website",
  "date": "Mar 21, 2024",
  "read": 8,
  "body": "<p>If you run a service business, <strong>building ai chat assistants into your website</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website ai chat assistant right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, website ai chat assistant becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Automating Lead Follow-Up With AI",
  "cat": "AI Web Development",
  "kw": "ai lead follow up",
  "excerpt": "Use AI to respond instantly, qualify and route leads while you sleep.",
  "slug": "automating-lead-follow-up-with-ai",
  "date": "Feb 01, 2024",
  "read": 9,
  "body": "<p>If you run a service business, <strong>automating lead follow-up with ai</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ai lead follow up right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, ai lead follow up becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Personalizing Websites With AI",
  "cat": "AI Web Development",
  "kw": "ai website personalization",
  "excerpt": "Show the right message to the right visitor to lift conversions with AI.",
  "slug": "personalizing-websites-with-ai",
  "date": "Feb 08, 2024",
  "read": 10,
  "body": "<p>If you run a service business, <strong>personalizing websites with ai</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ai website personalization right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, ai website personalization becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Cold Email That Books Meetings (Not Spam)",
  "cat": "Email Marketing",
  "kw": "cold email strategy",
  "excerpt": "A deliverability-first cold email system that starts real conversations with founders.",
  "slug": "cold-email-that-books-meetings-not-spam",
  "date": "Jan 15, 2024",
  "read": 4,
  "body": "<p>If you run a service business, <strong>cold email that books meetings (not spam)</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting cold email strategy right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, cold email strategy becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Email Marketing for Service Businesses",
  "cat": "Email Marketing",
  "kw": "email marketing service business",
  "excerpt": "Turn your list into your most profitable, predictable lead channel.",
  "slug": "email-marketing-for-service-businesses",
  "date": "Jan 22, 2024",
  "read": 5,
  "body": "<p>If you run a service business, <strong>email marketing for service businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting email marketing service business right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, email marketing service business becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Writing Cold Emails That Get Replies",
  "cat": "Email Marketing",
  "kw": "cold email copywriting",
  "excerpt": "Subject lines, openers and offers that earn replies instead of unsubscribes.",
  "slug": "writing-cold-emails-that-get-replies",
  "date": "Dec 02, 2023",
  "read": 6,
  "body": "<p>If you run a service business, <strong>writing cold emails that get replies</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting cold email copywriting right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, cold email copywriting becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Email Deliverability: Land in the Inbox",
  "cat": "Email Marketing",
  "kw": "email deliverability",
  "excerpt": "Domain warm-up, SPF/DKIM/DMARC and the habits that keep you out of spam.",
  "slug": "email-deliverability-land-in-the-inbox",
  "date": "Dec 09, 2023",
  "read": 7,
  "body": "<p>If you run a service business, <strong>email deliverability: land in the inbox</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting email deliverability right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, email deliverability becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Building an Email List From Your Website",
  "cat": "Email Marketing",
  "kw": "build email list website",
  "excerpt": "Capture more of your traffic with lead magnets and well-placed opt-ins.",
  "slug": "building-an-email-list-from-your-website",
  "date": "Nov 16, 2023",
  "read": 8,
  "body": "<p>If you run a service business, <strong>building an email list from your website</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting build email list website right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, build email list website becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Welcome Sequences That Convert Subscribers",
  "cat": "Email Marketing",
  "kw": "welcome email sequence",
  "excerpt": "Make a strong first impression and move new subscribers toward a call.",
  "slug": "welcome-sequences-that-convert-subscribers",
  "date": "Nov 23, 2023",
  "read": 9,
  "body": "<p>If you run a service business, <strong>welcome sequences that convert subscribers</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting welcome email sequence right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, welcome email sequence becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Cold Email vs LinkedIn Outreach",
  "cat": "Email Marketing",
  "kw": "cold email vs linkedin",
  "excerpt": "Which outbound channel delivers better-qualified leads for your offer?",
  "slug": "cold-email-vs-linkedin-outreach",
  "date": "Oct 03, 2023",
  "read": 10,
  "body": "<p>If you run a service business, <strong>cold email vs linkedin outreach</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting cold email vs linkedin right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, cold email vs linkedin becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Why a Strong Brand Wins More Clients",
  "cat": "Branding",
  "kw": "strong brand more clients",
  "excerpt": "How clear branding lets you charge more and close faster as a service business.",
  "slug": "why-a-strong-brand-wins-more-clients",
  "date": "Oct 10, 2023",
  "read": 4,
  "body": "<p>If you run a service business, <strong>why a strong brand wins more clients</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting strong brand more clients right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating branding as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good branding delivers.</blockquote><h2>The bottom line</h2><p>Done well, strong brand more clients becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Logo Design Basics for Founders",
  "cat": "Branding",
  "kw": "logo design basics",
  "excerpt": "What makes a logo work, what to avoid, and how to brief a designer well.",
  "slug": "logo-design-basics-for-founders",
  "date": "Sep 17, 2023",
  "read": 5,
  "body": "<p>If you run a service business, <strong>logo design basics for founders</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting logo design basics right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating branding as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good branding delivers.</blockquote><h2>The bottom line</h2><p>Done well, logo design basics becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Building a Brand Kit That Scales",
  "cat": "Branding",
  "kw": "brand kit guide",
  "excerpt": "Colors, type and components that keep every page and asset consistent.",
  "slug": "building-a-brand-kit-that-scales",
  "date": "Sep 24, 2023",
  "read": 6,
  "body": "<p>If you run a service business, <strong>building a brand kit that scales</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting brand kit guide right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating branding as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good branding delivers.</blockquote><h2>The bottom line</h2><p>Done well, brand kit guide becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Positioning: How to Become the Obvious Choice",
  "cat": "Branding",
  "kw": "brand positioning",
  "excerpt": "Sharpen your message so the right clients instantly self-select you.",
  "slug": "positioning-how-to-become-the-obvious-choice",
  "date": "Aug 04, 2023",
  "read": 7,
  "body": "<p>If you run a service business, <strong>positioning: how to become the obvious choice</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting brand positioning right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating branding as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good branding delivers.</blockquote><h2>The bottom line</h2><p>Done well, brand positioning becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Brand Voice: Sounding Like a Premium Business",
  "cat": "Branding",
  "kw": "brand voice guide",
  "excerpt": "Develop a voice that builds trust and matches the price you want to charge.",
  "slug": "brand-voice-sounding-like-a-premium-business",
  "date": "Aug 11, 2023",
  "read": 8,
  "body": "<p>If you run a service business, <strong>brand voice: sounding like a premium business</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting brand voice guide right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating branding as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good branding delivers.</blockquote><h2>The bottom line</h2><p>Done well, brand voice guide becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "The Only 5 Website Metrics Founders Need",
  "cat": "Analytics",
  "kw": "website metrics founders",
  "excerpt": "Cut through vanity metrics and track the numbers that predict revenue.",
  "slug": "the-only-5-website-metrics-founders-need",
  "date": "Jul 18, 2023",
  "read": 9,
  "body": "<p>If you run a service business, <strong>the only 5 website metrics founders need</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website metrics founders right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating analytics as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good analytics delivers.</blockquote><h2>The bottom line</h2><p>Done well, website metrics founders becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Setting Up GA4 Without the Headache",
  "cat": "Analytics",
  "kw": "ga4 setup guide",
  "excerpt": "A no-jargon GA4 setup that finally tells you where your leads come from.",
  "slug": "setting-up-ga4-without-the-headache",
  "date": "Jul 25, 2023",
  "read": 10,
  "body": "<p>If you run a service business, <strong>setting up ga4 without the headache</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ga4 setup guide right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating analytics as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good analytics delivers.</blockquote><h2>The bottom line</h2><p>Done well, ga4 setup guide becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Tracking Conversions That Actually Matter",
  "cat": "Analytics",
  "kw": "conversion tracking setup",
  "excerpt": "Define and track real conversions so you can double down on what works.",
  "slug": "tracking-conversions-that-actually-matter",
  "date": "Jun 05, 2023",
  "read": 4,
  "body": "<p>If you run a service business, <strong>tracking conversions that actually matter</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting conversion tracking setup right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating analytics as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good analytics delivers.</blockquote><h2>The bottom line</h2><p>Done well, conversion tracking setup becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Understanding Your Website Traffic Sources",
  "cat": "Analytics",
  "kw": "website traffic sources",
  "excerpt": "Know which channels send buyers versus browsers and reallocate budget.",
  "slug": "understanding-your-website-traffic-sources",
  "date": "Jun 12, 2023",
  "read": 5,
  "body": "<p>If you run a service business, <strong>understanding your website traffic sources</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting website traffic sources right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating analytics as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good analytics delivers.</blockquote><h2>The bottom line</h2><p>Done well, website traffic sources becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Core Web Vitals Explained for Business Owners",
  "cat": "Analytics",
  "kw": "core web vitals explained",
  "excerpt": "What LCP, INP and CLS mean for your rankings — in plain English.",
  "slug": "core-web-vitals-explained-for-business-owners",
  "date": "May 19, 2023",
  "read": 6,
  "body": "<p>If you run a service business, <strong>core web vitals explained for business owners</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting core web vitals explained right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating analytics as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good analytics delivers.</blockquote><h2>The bottom line</h2><p>Done well, core web vitals explained becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Set Up Google Search Console",
  "cat": "Local SEO",
  "kw": "google search console setup",
  "excerpt": "A founder-friendly Search Console setup to find ranking and indexing wins.",
  "slug": "how-to-set-up-google-search-console",
  "date": "May 26, 2023",
  "read": 7,
  "body": "<p>If you run a service business, <strong>how to set up google search console</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting google search console setup right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, google search console setup becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Footer Design: The Most Underrated Conversion Tool",
  "cat": "Web Design",
  "kw": "footer design conversion",
  "excerpt": "Use your footer to capture leads, build trust and aid navigation.",
  "slug": "footer-design-the-most-underrated-conversion-tool",
  "date": "Apr 06, 2023",
  "read": 8,
  "body": "<p>If you run a service business, <strong>footer design: the most underrated conversion tool</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting footer design conversion right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, footer design conversion becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Pricing Pages That Don't Scare People Away",
  "cat": "Conversion",
  "kw": "pricing page design",
  "excerpt": "Present pricing so prospects feel confident enough to take the next step.",
  "slug": "pricing-pages-that-don-t-scare-people-away",
  "date": "Apr 13, 2023",
  "read": 9,
  "body": "<p>If you run a service business, <strong>pricing pages that don't scare people away</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting pricing page design right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, pricing page design becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Referral Systems That Run Themselves",
  "cat": "Lead Generation",
  "kw": "referral system",
  "excerpt": "Turn happy clients into a steady source of warm, qualified referrals.",
  "slug": "referral-systems-that-run-themselves",
  "date": "Mar 20, 2023",
  "read": 10,
  "body": "<p>If you run a service business, <strong>referral systems that run themselves</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting referral system right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, referral system becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Webflow Interactions Without Killing Speed",
  "cat": "Webflow",
  "kw": "webflow interactions performance",
  "excerpt": "Add delightful motion in Webflow while protecting Core Web Vitals.",
  "slug": "webflow-interactions-without-killing-speed",
  "date": "Mar 27, 2023",
  "read": 4,
  "body": "<p>If you run a service business, <strong>webflow interactions without killing speed</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting webflow interactions performance right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, webflow interactions performance becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Using AI to Write SEO Content That Ranks",
  "cat": "AI Web Development",
  "kw": "ai seo content",
  "excerpt": "A workflow for AI-assisted content that's helpful, original and rank-worthy.",
  "slug": "using-ai-to-write-seo-content-that-ranks",
  "date": "Feb 07, 2023",
  "read": 5,
  "body": "<p>If you run a service business, <strong>using ai to write seo content that ranks</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ai seo content right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, ai seo content becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Re-Engaging a Cold Email List",
  "cat": "Email Marketing",
  "kw": "reengage email list",
  "excerpt": "Win back dormant subscribers without torching your sender reputation.",
  "slug": "re-engaging-a-cold-email-list",
  "date": "Feb 14, 2023",
  "read": 6,
  "body": "<p>If you run a service business, <strong>re-engaging a cold email list</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting reengage email list right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, reengage email list becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Attribution for Small Service Businesses",
  "cat": "Analytics",
  "kw": "marketing attribution small business",
  "excerpt": "A simple attribution model that tells you which marketing pays for itself.",
  "slug": "attribution-for-small-service-businesses",
  "date": "Jan 21, 2023",
  "read": 7,
  "body": "<p>If you run a service business, <strong>attribution for small service businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting marketing attribution small business right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating analytics as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good analytics delivers.</blockquote><h2>The bottom line</h2><p>Done well, marketing attribution small business becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Rebranding Without Losing Your Customers",
  "cat": "Branding",
  "kw": "rebranding guide",
  "excerpt": "Refresh your brand and website while protecting trust and search rankings.",
  "slug": "rebranding-without-losing-your-customers",
  "date": "Jan 01, 2023",
  "read": 8,
  "body": "<p>If you run a service business, <strong>rebranding without losing your customers</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting rebranding guide right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating branding as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good branding delivers.</blockquote><h2>The bottom line</h2><p>Done well, rebranding guide becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Designing Trust for High-Ticket Services",
  "cat": "Web Design",
  "kw": "high ticket web design",
  "excerpt": "Visual and content choices that justify premium pricing and reduce buyer risk.",
  "slug": "designing-trust-for-high-ticket-services",
  "date": "Dec 08, 2022",
  "read": 9,
  "body": "<p>If you run a service business, <strong>designing trust for high-ticket services</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting high ticket web design right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, high ticket web design becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "How to Handle Negative Reviews the Right Way",
  "cat": "Local SEO",
  "kw": "handle negative reviews",
  "excerpt": "Respond to bad reviews in a way that builds trust and protects your rankings.",
  "slug": "how-to-handle-negative-reviews-the-right-way",
  "date": "Aug 07, 2026",
  "read": 10,
  "body": "<p>If you run a service business, <strong>how to handle negative reviews the right way</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting handle negative reviews right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, handle negative reviews becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Schema Markup for Local Businesses",
  "cat": "Local SEO",
  "kw": "local business schema",
  "excerpt": "Add structured data so Google understands and rewards your local pages.",
  "slug": "schema-markup-for-local-businesses",
  "date": "Jun 13, 2026",
  "read": 5,
  "body": "<p>If you run a service business, <strong>schema markup for local businesses</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting local business schema right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, local business schema becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Voice Search and Local SEO in 2026",
  "cat": "Local SEO",
  "kw": "voice search local seo",
  "excerpt": "Optimize for 'near me' and voice queries that drive ready-to-buy traffic.",
  "slug": "voice-search-and-local-seo-in-2026",
  "date": "Apr 19, 2026",
  "read": 7,
  "body": "<p>If you run a service business, <strong>voice search and local seo in 2026</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting voice search local seo right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating local seo as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good local seo delivers.</blockquote><h2>The bottom line</h2><p>Done well, voice search local seo becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Dark Mode Websites: Worth It for Business?",
  "cat": "Web Design",
  "kw": "dark mode website",
  "excerpt": "When a dark UI helps conversions and when it quietly hurts readability.",
  "slug": "dark-mode-websites-worth-it-for-business",
  "date": "Feb 25, 2026",
  "read": 9,
  "body": "<p>If you run a service business, <strong>dark mode websites: worth it for business?</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting dark mode website right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, dark mode website becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Designing a Services Page That Sells",
  "cat": "Web Design",
  "kw": "services page design",
  "excerpt": "Structure a services page that answers objections and drives enquiries.",
  "slug": "designing-a-services-page-that-sells",
  "date": "Dec 04, 2026",
  "read": 4,
  "body": "<p>If you run a service business, <strong>designing a services page that sells</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting services page design right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, services page design becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "About Pages That Build Instant Trust",
  "cat": "Web Design",
  "kw": "about page design",
  "excerpt": "Turn your about page into a credibility and conversion asset.",
  "slug": "about-pages-that-build-instant-trust",
  "date": "Oct 10, 2026",
  "read": 6,
  "body": "<p>If you run a service business, <strong>about pages that build instant trust</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting about page design right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating web design as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good web design delivers.</blockquote><h2>The bottom line</h2><p>Done well, about page design becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Exit-Intent Offers Without Being Annoying",
  "cat": "Conversion",
  "kw": "exit intent popup",
  "excerpt": "Recover leaving visitors with offers that help instead of interrupt.",
  "slug": "exit-intent-offers-without-being-annoying",
  "date": "Aug 16, 2026",
  "read": 8,
  "body": "<p>If you run a service business, <strong>exit-intent offers without being annoying</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting exit intent popup right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, exit intent popup becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Sticky CTAs and Mobile Conversion",
  "cat": "Conversion",
  "kw": "sticky cta mobile",
  "excerpt": "Keep the next step in reach on mobile without hurting the experience.",
  "slug": "sticky-ctas-and-mobile-conversion",
  "date": "Jun 22, 2026",
  "read": 10,
  "body": "<p>If you run a service business, <strong>sticky ctas and mobile conversion</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting sticky cta mobile right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, sticky cta mobile becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "SEO vs Paid Ads for Lead Generation",
  "cat": "Lead Generation",
  "kw": "seo vs paid ads",
  "excerpt": "Where founders should invest first for durable, profitable lead flow.",
  "slug": "seo-vs-paid-ads-for-lead-generation",
  "date": "Apr 01, 2026",
  "read": 5,
  "body": "<p>If you run a service business, <strong>seo vs paid ads for lead generation</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting seo vs paid ads right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, seo vs paid ads becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Booking Systems That Reduce No-Shows",
  "cat": "Lead Generation",
  "kw": "reduce no shows booking",
  "excerpt": "Calendar and reminder setups that protect your time and close rate.",
  "slug": "booking-systems-that-reduce-no-shows",
  "date": "Feb 07, 2026",
  "read": 7,
  "body": "<p>If you run a service business, <strong>booking systems that reduce no-shows</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting reduce no shows booking right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, reduce no shows booking becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Webflow Localization for Growing Brands",
  "cat": "Webflow",
  "kw": "webflow localization",
  "excerpt": "Reach new markets with localized Webflow pages that still rank.",
  "slug": "webflow-localization-for-growing-brands",
  "date": "Dec 13, 2026",
  "read": 9,
  "body": "<p>If you run a service business, <strong>webflow localization for growing brands</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting webflow localization right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating webflow as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good webflow delivers.</blockquote><h2>The bottom line</h2><p>Done well, webflow localization becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Framer CMS for Scalable Blogs",
  "cat": "Framer",
  "kw": "framer cms blog",
  "excerpt": "Build a content engine in Framer that grows your organic traffic.",
  "slug": "framer-cms-for-scalable-blogs",
  "date": "Oct 19, 2026",
  "read": 4,
  "body": "<p>If you run a service business, <strong>framer cms for scalable blogs</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting framer cms blog right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating framer as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good framer delivers.</blockquote><h2>The bottom line</h2><p>Done well, framer cms blog becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Shipping Websites 2x Faster With AI",
  "cat": "AI Web Development",
  "kw": "ship websites faster ai",
  "excerpt": "Our AI-assisted workflow that compresses timelines without cutting corners.",
  "slug": "shipping-websites-2x-faster-with-ai",
  "date": "Aug 25, 2026",
  "read": 6,
  "body": "<p>If you run a service business, <strong>shipping websites 2x faster with ai</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ship websites faster ai right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, ship websites faster ai becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "AI-Powered SEO Audits",
  "cat": "AI Web Development",
  "kw": "ai seo audit",
  "excerpt": "Use AI to surface technical and content issues before they cost rankings.",
  "slug": "ai-powered-seo-audits",
  "date": "Jun 04, 2026",
  "read": 8,
  "body": "<p>If you run a service business, <strong>ai-powered seo audits</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting ai seo audit right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating ai web development as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good ai web development delivers.</blockquote><h2>The bottom line</h2><p>Done well, ai seo audit becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Segmenting Your List for Higher Conversions",
  "cat": "Email Marketing",
  "kw": "email list segmentation",
  "excerpt": "Send the right message to the right people and watch replies climb.",
  "slug": "segmenting-your-list-for-higher-conversions",
  "date": "Apr 10, 2026",
  "read": 10,
  "body": "<p>If you run a service business, <strong>segmenting your list for higher conversions</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting email list segmentation right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, email list segmentation becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "The Best Time to Send Cold Emails",
  "cat": "Email Marketing",
  "kw": "best time cold email",
  "excerpt": "Data-backed timing that lifts open and reply rates for outbound.",
  "slug": "the-best-time-to-send-cold-emails",
  "date": "Feb 16, 2026",
  "read": 5,
  "body": "<p>If you run a service business, <strong>the best time to send cold emails</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting best time cold email right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating email marketing as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good email marketing delivers.</blockquote><h2>The bottom line</h2><p>Done well, best time cold email becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Color Psychology for Service Brands",
  "cat": "Branding",
  "kw": "color psychology branding",
  "excerpt": "Choose colors that signal trust and match the price you want to charge.",
  "slug": "color-psychology-for-service-brands",
  "date": "Dec 22, 2026",
  "read": 7,
  "body": "<p>If you run a service business, <strong>color psychology for service brands</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting color psychology branding right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating branding as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good branding delivers.</blockquote><h2>The bottom line</h2><p>Done well, color psychology branding becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Reading a Funnel Report Like a Pro",
  "cat": "Analytics",
  "kw": "funnel report analysis",
  "excerpt": "Find exactly where prospects drop off and what to fix first.",
  "slug": "reading-a-funnel-report-like-a-pro",
  "date": "Oct 01, 2026",
  "read": 9,
  "body": "<p>If you run a service business, <strong>reading a funnel report like a pro</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting funnel report analysis right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating analytics as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good analytics delivers.</blockquote><h2>The bottom line</h2><p>Done well, funnel report analysis becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Trust Badges: Which Ones Actually Help",
  "cat": "Conversion",
  "kw": "trust badges conversion",
  "excerpt": "The credibility markers that move conversions and the ones that don't.",
  "slug": "trust-badges-which-ones-actually-help",
  "date": "Aug 07, 2026",
  "read": 4,
  "body": "<p>If you run a service business, <strong>trust badges: which ones actually help</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting trust badges conversion right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating conversion as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good conversion delivers.</blockquote><h2>The bottom line</h2><p>Done well, trust badges conversion becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}, {
  "title": "Content Offers That Attract Buyers, Not Browsers",
  "cat": "Lead Generation",
  "kw": "content offers buyers",
  "excerpt": "Create lead magnets that pull in people ready to spend, not just learn.",
  "slug": "content-offers-that-attract-buyers-not-browsers",
  "date": "Jun 13, 2026",
  "read": 6,
  "body": "<p>If you run a service business, <strong>content offers that attract buyers, not browsers</strong> isn't a nice-to-have — it's the difference between a website that quietly sits there and one that brings you qualified leads every month. In this guide we break down exactly what matters in 2026, why it works, and how to put it into practice without a huge budget or a full marketing team.</p><h2>Why this matters in 2026</h2><p>Search behaviour and buyer expectations have shifted. People research longer, compare more, and trust businesses that show up consistently with clear answers. Getting content offers buyers right means meeting those buyers at the moment of intent — and giving them an obvious reason to choose you over the competitor one click away.</p><h2>How to do it right</h2><h3>1. Start with intent, not tactics</h3><p>Before touching anything, map what your ideal customer is actually trying to do. The best results come from aligning every page, post and message to a real question your buyer is asking — then answering it better than anyone else on the first page of Google.</p><h3>2. Build the foundation properly</h3><p>Speed, mobile experience, clean structure and clear calls-to-action are non-negotiable. A fast, well-organised site is easier for both customers and search engines to understand, and it quietly lifts everything else you do.</p><h3>3. Create genuinely useful content</h3><p>Thin, generic content doesn't rank or convert. Depth, specificity and real expertise do. Write for the person, optimise for the algorithm second, and every piece earns its place by helping someone make a decision.</p><h3>4. Measure, then double down</h3><p>Track the handful of metrics that predict revenue — qualified enquiries, booked calls, rankings for high-intent terms — and pour more effort into whatever is already working. Iteration beats reinvention.</p><h2>Mistakes to avoid</h2><p>The most common mistake we see is treating lead generation as a one-off project instead of a system. The businesses that win treat it as an ongoing engine: small, consistent improvements compound into a steady flow of leads. The second mistake is chasing vanity metrics — traffic and followers feel good but don't pay the bills. Focus relentlessly on qualified leads and booked calls.</p><blockquote>The goal was never a prettier website. It was a predictable system that turns strangers into booked calls — and that's what good lead generation delivers.</blockquote><h2>The bottom line</h2><p>Done well, content offers buyers becomes one of the most reliable, profitable channels your business has — working around the clock to bring you customers who are ready to buy. If you'd like a team to build and run this system for you, that's exactly what we do at Velaris Web.</p>"
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/blog-data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/chrome.jsx
try { (() => {
// Velaris Web UI Kit — app chrome (Sidebar, TopBar)

function Sidebar({
  active,
  onNav,
  user
}) {
  const nav = [{
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard'
  }, {
    key: 'projects',
    label: 'Projects',
    icon: 'appstore'
  }, {
    key: 'analytics',
    label: 'Analytics',
    icon: 'bar-chart'
  }, {
    key: 'team',
    label: 'Team',
    icon: 'team'
  }];
  const sub = [{
    key: 'settings',
    label: 'Settings',
    icon: 'setting'
  }, {
    key: 'help',
    label: 'Help & docs',
    icon: 'question-circle'
  }];
  const item = n => /*#__PURE__*/React.createElement("button", {
    key: n.key,
    className: 'side-item' + (active === n.key ? ' active' : ''),
    onClick: () => onNav(n.key)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon,
    size: 17
  }), /*#__PURE__*/React.createElement("span", null, n.label));
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-brand"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    className: "side-section-label"
  }, "Workspace"), /*#__PURE__*/React.createElement("nav", {
    className: "side-nav"
  }, nav.map(item)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("nav", {
    className: "side-nav"
  }, sub.map(item)), /*#__PURE__*/React.createElement("div", {
    className: "side-user"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: user.name,
    color: "var(--teal-7)",
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-user-name"
  }, user.name), /*#__PURE__*/React.createElement("div", {
    className: "side-user-plan"
  }, user.plan)), /*#__PURE__*/React.createElement(Icon, {
    name: "up",
    size: 12,
    style: {
      color: 'var(--text-tertiary)',
      marginLeft: 'auto',
      transform: 'rotate(180deg)'
    }
  })));
}
function TopBar({
  title,
  subtitle,
  onNew,
  search,
  setSearch,
  onLogout
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "topbar-title"
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    className: "topbar-sub"
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "topbar-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar-search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    style: {
      color: 'var(--text-tertiary)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search projects, domains\u2026",
    value: search,
    onChange: e => setSearch(e.target.value)
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2318K")), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    title: "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    className: "ping"
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    title: "Sign out",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 18
  })), onNew && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus",
    onClick: onNew
  }, "New project")));
}
Object.assign(window, {
  Sidebar,
  TopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/data.js
try { (() => {
// Velaris Web UI Kit — mock data

const VELARIS_USER = {
  name: 'Maya Okonkwo',
  email: 'maya@velaris.io',
  plan: 'Pro plan',
  initials: 'MO'
};
const PROJECTS = [{
  id: 1,
  name: 'velaris-marketing',
  domain: 'velaris.io',
  status: 'live',
  framework: 'Next.js',
  visitors: '128k',
  deploy: '6m ago',
  branch: 'main'
}, {
  id: 2,
  name: 'docs-portal',
  domain: 'docs.velaris.io',
  status: 'live',
  framework: 'Astro',
  visitors: '41k',
  deploy: '2h ago',
  branch: 'main'
}, {
  id: 3,
  name: 'app-dashboard',
  domain: 'app.velaris.io',
  status: 'building',
  framework: 'React',
  visitors: '88k',
  deploy: 'now',
  branch: 'feat/billing'
}, {
  id: 4,
  name: 'blog-engine',
  domain: 'blog.velaris.io',
  status: 'live',
  framework: 'SvelteKit',
  visitors: '19k',
  deploy: '1d ago',
  branch: 'main'
}, {
  id: 5,
  name: 'status-page',
  domain: 'status.velaris.io',
  status: 'error',
  framework: 'Vue',
  visitors: '7.2k',
  deploy: '3h ago',
  branch: 'main'
}, {
  id: 6,
  name: 'partner-portal',
  domain: 'partners.velaris.io',
  status: 'live',
  framework: 'Next.js',
  visitors: '12k',
  deploy: '4d ago',
  branch: 'main'
}];
const ACTIVITY = [{
  who: 'Maya Okonkwo',
  action: 'deployed',
  target: 'velaris-marketing',
  meta: 'production · main',
  time: '6m',
  icon: 'rocket',
  tone: 'teal'
}, {
  who: 'CI Pipeline',
  action: 'started build',
  target: 'app-dashboard',
  meta: 'feat/billing',
  time: '9m',
  icon: 'sync',
  tone: 'teal'
}, {
  who: 'Diego Alvarez',
  action: 'failed deploy',
  target: 'status-page',
  meta: 'exit code 1',
  time: '3h',
  icon: 'close-circle',
  tone: 'error'
}, {
  who: 'Priya Nair',
  action: 'connected domain',
  target: 'docs.velaris.io',
  meta: 'DNS verified',
  time: '5h',
  icon: 'global',
  tone: 'success'
}, {
  who: 'Maya Okonkwo',
  action: 'invited',
  target: 'sam@velaris.io',
  meta: 'Developer role',
  time: '1d',
  icon: 'user',
  tone: 'neutral'
}];
const TEAM = [{
  name: 'Maya Okonkwo',
  email: 'maya@velaris.io',
  role: 'Owner',
  status: 'online'
}, {
  name: 'Diego Alvarez',
  email: 'diego@velaris.io',
  role: 'Admin',
  status: 'online'
}, {
  name: 'Priya Nair',
  email: 'priya@velaris.io',
  role: 'Developer',
  status: 'away'
}, {
  name: 'Sam Whitfield',
  email: 'sam@velaris.io',
  role: 'Developer',
  status: 'offline'
}, {
  name: 'Lena Fischer',
  email: 'lena@velaris.io',
  role: 'Viewer',
  status: 'offline'
}];
const STATUS_MAP = {
  live: {
    tone: 'success',
    label: 'Live',
    dot: '#52C41A'
  },
  building: {
    tone: 'teal',
    label: 'Building',
    dot: '#2A8F94'
  },
  error: {
    tone: 'error',
    label: 'Error',
    dot: '#FF4D4F'
  }
};
Object.assign(window, {
  VELARIS_USER,
  PROJECTS,
  ACTIVITY,
  TEAM,
  STATUS_MAP
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/extras.jsx
try { (() => {
// Velaris Web UI Kit — login, project detail, modals

function Login({
  onLogin
}) {
  const [pw, setPw] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState('maya@velaris.io');
  return /*#__PURE__*/React.createElement("div", {
    className: "login"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-form-side"
  }, /*#__PURE__*/React.createElement("form", {
    className: "login-form fadeup",
    onSubmit: e => {
      e.preventDefault();
      onLogin();
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 34
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 600,
      margin: '30px 0 6px'
    }
  }, "Sign in to Velaris"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      margin: '0 0 26px',
      fontSize: 14
    }
  }, "Welcome back. Deploy with clarity."), /*#__PURE__*/React.createElement("div", {
    className: "oauth"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    block: true,
    icon: "global"
  }, "Google"), /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    block: true,
    icon: "link"
  }, "GitHub")), /*#__PURE__*/React.createElement("div", {
    className: "divider-text"
  }, "or continue with email"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Email"
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "mail",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@company.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Password"
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "lock",
    type: show ? 'text' : 'password',
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    suffix: /*#__PURE__*/React.createElement("span", {
      className: "input-pw-toggle vicon",
      onClick: () => setShow(!show),
      style: {
        width: 16,
        height: 16
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: show ? 'eye' : 'eye-invisible',
      size: 16
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '16px 0 20px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      color: 'var(--text-secondary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: true,
    style: {
      accentColor: 'var(--teal-6)',
      width: 15,
      height: 15
    }
  }), " Remember me"), /*#__PURE__*/React.createElement("a", {
    className: "v-link",
    style: {
      fontSize: 13
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    type: "submit",
    iconRight: "arrow-right"
  }, "Sign in"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      textAlign: 'center',
      fontSize: 13,
      marginTop: 22
    }
  }, "New to Velaris? ", /*#__PURE__*/React.createElement("a", {
    className: "v-link"
  }, "Create an account")))), /*#__PURE__*/React.createElement("div", {
    className: "login-brand-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glow",
    style: {
      width: 320,
      height: 320,
      background: 'rgba(120,220,225,.35)',
      top: -80,
      right: -60
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "glow",
    style: {
      width: 260,
      height: 260,
      background: 'rgba(26,41,64,.5)',
      bottom: -40,
      left: -40
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "login-quote"
  }, "Build, ship & ", /*#__PURE__*/React.createElement("em", null, "scale"), /*#__PURE__*/React.createElement("br", null), "your web presence."), /*#__PURE__*/React.createElement("div", {
    className: "login-sub"
  }, "Velaris is the platform for teams who ship to the web \u2014 instant deploys, real-time analytics, and uptime you can trust."), /*#__PURE__*/React.createElement("div", {
    className: "login-stats"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "99.98%"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Platform uptime")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "42s"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Avg build time")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "12k+"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Teams shipping")))));
}
function ProjectDetail({
  p,
  onBack
}) {
  const s = STATUS_MAP[p.status];
  const builds = [{
    id: 'a1f3',
    status: p.status,
    branch: p.branch,
    time: p.deploy,
    dur: '38s',
    who: 'Maya Okonkwo'
  }, {
    id: 'b8e2',
    status: 'live',
    branch: 'main',
    time: '2h ago',
    dur: '41s',
    who: 'Diego Alvarez'
  }, {
    id: 'c4d9',
    status: 'live',
    branch: 'main',
    time: '5h ago',
    dur: '36s',
    who: 'CI Pipeline'
  }, {
    id: 'd0a7',
    status: 'error',
    branch: 'fix/cache',
    time: '1d ago',
    dur: '12s',
    who: 'Priya Nair'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fadeup",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-text",
    style: {
      alignSelf: 'flex-start',
      paddingLeft: 6
    },
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "left",
    size: 13
  }), " Projects"), /*#__PURE__*/React.createElement("div", {
    className: "detail-head"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 12,
      background: 'var(--teal-1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "global",
    size: 26,
    style: {
      color: 'var(--teal-7)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      margin: 0
    }
  }, p.name), /*#__PURE__*/React.createElement(StatusTag, {
    status: p.status
  })), /*#__PURE__*/React.createElement("a", {
    className: "url-pill",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 13
  }), p.domain, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 12
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    icon: "sync"
  }, "Redeploy"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "rocket"
  }, "Deploy")), /*#__PURE__*/React.createElement("div", {
    className: "grid-stats"
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "user",
    label: "Visitors (30d)",
    value: p.visitors,
    delta: "6.8%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "thunderbolt",
    label: "Last build",
    value: p.deploy === 'now' ? 'building' : '38s',
    delta: "3%",
    dir: "down"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "line-chart",
    label: "Framework",
    value: p.framework,
    delta: ""
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "safety",
    label: "SSL",
    value: "Active",
    delta: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title",
    style: {
      padding: '16px 20px 0',
      margin: 0
    }
  }, "Deployments"), /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Build"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Branch"), /*#__PURE__*/React.createElement("th", null, "Duration"), /*#__PURE__*/React.createElement("th", null, "Author"), /*#__PURE__*/React.createElement("th", null, "When"))), /*#__PURE__*/React.createElement("tbody", null, builds.map((b, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono row-main"
  }, "#", b.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusTag, {
    status: b.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "mono muted"
  }, b.branch), /*#__PURE__*/React.createElement("td", {
    className: "mono muted"
  }, b.dur), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, b.who), /*#__PURE__*/React.createElement("td", {
    className: "row-sub"
  }, b.time)))))));
}
function Modal({
  title,
  onClose,
  children,
  footer
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, children), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, footer)));
}
function NewProjectModal({
  onClose,
  onCreate
}) {
  const [name, setName] = React.useState('');
  const [fw, setFw] = React.useState('Next.js');
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Create a new project",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: "rocket",
      onClick: () => onCreate(name || 'new-project')
    }, "Create & deploy"))
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Import from"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oauth"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    block: true,
    icon: "link"
  }, "GitHub repo"), /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    block: true,
    icon: "upload"
  }, "Upload"))), /*#__PURE__*/React.createElement(Field, {
    label: "Project name"
  }, /*#__PURE__*/React.createElement(Input, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "my-web-app",
    icon: "appstore"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Framework preset"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['Next.js', 'Astro', 'SvelteKit', 'Vue', 'Static'].map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFw(f),
    className: "btn",
    style: {
      borderColor: fw === f ? 'var(--teal-6)' : 'var(--border)',
      background: fw === f ? 'var(--teal-1)' : '#fff',
      color: fw === f ? 'var(--teal-7)' : 'var(--text-primary)'
    }
  }, f)))));
}
function InviteModal({
  onClose
}) {
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Invite a member",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: "mail",
      onClick: onClose
    }, "Send invite"))
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Email address"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "teammate@velaris.io",
    icon: "mail"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Role"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, ['Admin', 'Developer', 'Viewer'].map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r,
    className: "btn",
    style: {
      flex: 1,
      borderColor: i === 1 ? 'var(--teal-6)' : 'var(--border)',
      background: i === 1 ? 'var(--teal-1)' : '#fff',
      color: i === 1 ? 'var(--teal-7)' : 'var(--text-primary)'
    }
  }, r)))));
}
Object.assign(window, {
  Login,
  ProjectDetail,
  Modal,
  NewProjectModal,
  InviteModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/extras.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/home-data.js
try { (() => {
/* ============================================================================
   VELARIS WEB — Site CMS content (home + all detail pages).
   Every array maps 1:1 to a CMS collection. Detail pages (service.html?s=,
   case.html?c=) render straight from these objects. Blog posts: blog-data.js.
   ========================================================================== */

/* ---- HERO CASE-STUDY SLIDER (image on top, headline below — clickable) ---- */
window.VELARIS_HERO_SLIDES = [{
  client: "Coastal Crest Lettings",
  tag: "B2C · Property",
  img: "home-img/dev-coastal.png",
  headline: "Lettings Made Simple, Transparent & Stress-Free",
  blurb: "A fresh, modern lettings website built exactly to brief — bringing a 20-year, family-run property business online with clarity and trust.",
  href: "case.html?c=coastal"
}, {
  client: "Hazelwood Hearcare",
  tag: "B2C · Local Healthcare",
  img: "home-img/dev-hazelwood.jpg",
  headline: "How Hazelwood Generated 60+ Qualified Leads in 30 Days",
  blurb: "We redesigned their digital experience with a conversion-focused website, SEO optimization and a trust-driven structure — helping generate 300+ Google reviews and over £30K in revenue.",
  href: "case.html?c=hazelwood"
}, {
  client: "Bellavista Investments",
  tag: "B2B · Private Equity",
  img: "home-img/dev-bellavista.jpg",
  headline: "An Institutional-Grade Website for a Capital Firm",
  blurb: "A disciplined, credible presence that matches the calibre of their deals — built to win the trust of investors, founders and business owners.",
  href: "case.html?c=bellavista"
}, {
  client: "Core Mechanical Design",
  tag: "B2B · Engineering",
  img: "home-img/dev-core.jpg",
  headline: "From Concept to Product — A Premium Engineering Presence",
  blurb: "A confident, editorial website showcasing deep technical work and positioning the consultancy as the obvious premium choice for serious product teams.",
  href: "case.html?c=core"
}, {
  client: "Menstruacion",
  tag: "B2C · Femtech",
  img: "home-img/dev-menstruation.jpg",
  headline: "A Warm, Trusted Health Resource for Parents & Teens",
  blurb: "A reassuring, expert-led experience that parents actually feel comfortable using — pairing sensitive design with a research-backed content hub.",
  href: "case.html?c=menstruation"
}, {
  client: "Navasana",
  tag: "B2B · AI Cyber Insurance",
  img: "home-img/dev-navasana.jpg",
  headline: "Clarity & Credibility for a Complex AI Cyber Platform",
  blurb: "We translated a complex, technical product into a clear, credible brand experience that turns enterprise visitors into qualified demo requests.",
  href: "case.html?c=navasana"
}];

/* ---- CLIENT LOGOS (marquee) ---- */
window.VELARIS_LOGOS = [{
  name: "Hazelwood Hearcare",
  src: "home-img/logo-hazelwood.png"
}, {
  name: "Navasana",
  src: "home-img/logo-navasana.png"
}, {
  name: "Core Mechanical Design",
  src: "home-img/logo-core.png"
}, {
  name: "Coastal Crest Lettings",
  src: "home-img/logo-coastal.png"
}, {
  name: "Bellavista Investments",
  src: "home-img/logo-bellavistra.png"
}, {
  name: "Menstruacion",
  src: "home-img/logo-menstruation.png"
}];

/* ---- CASE STUDIES (full CMS — drives home cards AND case.html?c=) ---- */
window.VELARIS_TESTIMONIALS = [{
  quote: "I highly recommend Deluar. I just had my logo updated and couldn't be happier with the result. The work was clean, professional, and delivered exactly what I was looking for. Communication was clear throughout, turnaround was fast, and the final product hit the mark on the first pass.",
  stars: 5,
  author: "David Scarborough",
  role: "Founder, Strategic Marketing (USA)",
  avatar: "home-img/david.jpg",
  url: ""
}, {
  quote: "Imagine a website that's not performing, only one poorly visible CTA and poorly designed! Well Ahamed is the man for the job — he completely transformed my patient booking system with seamless integration, using advanced design software for each landing page to improve the user experience. Drop him a message for your business!",
  stars: 5,
  author: "Rizwan Makda",
  role: "Founder, Hazelwood Hearcare (UK)",
  avatar: "home-img/rizwan.png",
  url: "https://www.hazelwoodhearcare.co.uk"
}, {
  quote: "Ahamed was great to work with. From start to finish during the project he was patient and helpful, ensuring that the finished website was exactly what I wanted. He is an exciting designer with fresh ideas and I would highly recommend him and would be keen to work with him again.",
  stars: 5,
  author: "Rupert",
  role: "Business Owner (UK)",
  avatar: "home-img/icon-coastal.png",
  url: "https://www.coastalcrestlettings.co.uk/"
}, {
  quote: "I trusted Ahamed Deluar with my website and he didn't disappoint me — in fact he did a really good job with my website creativibes.co and I'm glad I gave him the job.",
  stars: 5,
  author: "Charaf Zaoudi",
  role: "CEO &amp; Founder, CREATIVIBE",
  avatar: "home-img/client-2.png",
  url: "https://creativibes.co"
}, {
  quote: "I highly recommend Ahamed for any role involving UI/UX design, web development or mobile app creation. His ability to blend user-centered design with smart technical execution is outstanding — he has a sharp eye for detail and consistently delivers designs that are both beautiful and functional. A proactive problem-solver, great communicator and a true team player.",
  stars: 5,
  author: "Shafi Uddin",
  role: "Senior Software QA Engineer (USA)",
  avatar: "home-img/shafi.jpg",
  url: ""
}];
window.VELARIS_CASES = [{
  slug: "hazelwood",
  n: "01",
  client: "Hazelwood Hearcare",
  sector: "B2C · Local Healthcare",
  logo: "home-img/logo-hazelwood.png",
  logoInvert: false,
  dark: false,
  featured: true,
  title: ["From ", "invisible", " to fully ", "booked"],
  headline: "How Hazelwood Generated 60+ Qualified Leads in 30 Days",
  summary: "A complete rebuild — new positioning, conversion-focused UX and local SEO — took Hazelwood from zero inbound to a booked calendar in under 30 days.",
  img: "home-img/dev-hazelwood.jpg",
  gallery: ["home-img/dev-hazelwood.jpg", "home-img/hazelwood-before-after.png", "home-img/portfolio-hazelwood.png"],
  live: "https://hazelwoodhearcare.co.uk",
  services: ["Custom-Coded Development", "SEO Optimization", "Conversion UI/UX Design"],
  stats: [["60+", "Bookings in 30 days"], ["300+", "Google reviews"], ["£30K", "Revenue in 6 months"]],
  challenge: "Hazelwood's old site was barely visible on Google, had a single poorly-placed call-to-action and a confusing booking flow — so qualified enquiries simply weren't coming in.",
  approach: "We rebuilt the experience around the patient journey: clear positioning, a frictionless 'Book an appointment' path on every screen, trust signals (reviews, accreditations) up front, and local SEO targeting high-intent 'near me' searches across their service areas.",
  outcome: "Within the first 30 days the new site generated more enquiries than the old one had in a year, backed by 300+ Google reviews and a fully booked calendar.",
  quote: "Ahamed completely transformed my patient booking system with seamless integration, using advanced design for each landing page to improve the user experience. Drop him a message for your business!",
  author: "Rizwan Makda",
  role: "Founder, Hazelwood Hearcare",
  avatar: "home-img/rizwan.png"
}, {
  slug: "navasana",
  n: "02",
  client: "Navasana",
  sector: "B2B · AI Cyber Insurance",
  logo: "home-img/logo-navasana.png",
  logoInvert: true,
  dark: true,
  featured: true,
  title: ["A modern experience for an ", "AI cyber insurance", " platform"],
  headline: "Clarity & Credibility for a Complex AI Cyber Platform",
  summary: "We translated a complex, technical product into a clear, credible brand experience that turns enterprise visitors into qualified demo requests.",
  img: "home-img/dev-navasana.jpg",
  gallery: ["home-img/dev-navasana.jpg"],
  live: "https://navasana.com",
  services: ["Custom-Coded Development", "Claude AI Web Development", "Conversion UI/UX Design"],
  stats: [["Clear", "Product narrative"], ["Demo-ready", "Conversion paths"], ["Enterprise", "-grade credibility"]],
  challenge: "Navasana's AI cyber-insurance product is genuinely complex. The previous site buried the value proposition in jargon, so technical buyers bounced before requesting a demo.",
  approach: "We built a clear narrative — problem, product, proof — with technical-yet-human copy, a credible visual system, and demo CTAs placed at each decision point. Performance and on-page SEO were engineered in from the first line of code.",
  outcome: "The redesign turned a jargon-heavy product into a clear, credible narrative — giving enterprise buyers an obvious path to request a demo at each decision point.",
  quote: "",
  author: "",
  role: "",
  avatar: ""
}, {
  slug: "core",
  n: "03",
  client: "Core Mechanical Design",
  sector: "B2B · Engineering",
  logo: "home-img/logo-core.png",
  logoInvert: false,
  dark: false,
  featured: true,
  title: ["Unified design &amp; engineering, ", "concept to product"],
  headline: "From Concept to Product — A Premium Engineering Presence",
  summary: "A confident, editorial site that showcases deep technical work and positions the consultancy as the obvious premium choice for serious product teams.",
  img: "home-img/dev-core.jpg",
  gallery: ["home-img/dev-core.jpg", "home-img/core-alt.png"],
  live: "",
  services: ["Custom-Coded Development", "Conversion UI/UX Design", "Brand &amp; Identity"],
  stats: [["Premium", "Market positioning"], ["Editorial", "Project-led design"], ["Concept→Product", "Clear story"]],
  challenge: "Core's engineering work is world-class, but their old website made them look like a generic supplier — underselling the depth of their concept-to-product capability.",
  approach: "We created an editorial, project-led site that leads with real engineering work, a clear process narrative, and confident typography — positioning Core as the premium partner for ambitious product teams.",
  outcome: "A confident, editorial site that leads with real engineering work — positioning Core as the premium, concept-to-product partner, supported by a brand system that scales across every page.",
  quote: "",
  author: "",
  role: "",
  avatar: ""
}, {
  slug: "bellavista",
  n: "04",
  client: "Bellavista Investments",
  sector: "B2B · Private Equity",
  logo: "home-img/logo-bellavistra.png",
  logoInvert: false,
  dark: false,
  featured: false,
  title: ["An ", "institutional-grade", " presence for a capital firm"],
  headline: "An Institutional-Grade Website for a Capital Firm",
  summary: "A disciplined, credible digital presence that finally matches the calibre of Bellavista's deals and investor relationships.",
  img: "home-img/dev-bellavista.jpg",
  gallery: ["home-img/dev-bellavista.jpg"],
  live: "",
  services: ["Custom-Coded Development", "Conversion UI/UX Design", "Brand &amp; Identity"],
  stats: [["Investor", "-grade design"], ["Faster", "Partner enquiries"], ["Clear", "Service narrative"]],
  challenge: "Bellavista deploys serious capital across real estate, private equity and M&A, but their website didn't convey institutional credibility to founders and investors.",
  approach: "We designed a restrained, confident experience — disciplined typography, a clear services architecture and 'Partner with us' paths — that signals trust and long-term value at every step.",
  outcome: "Bellavista now has a presence that matches the calibre of their deals, making it easier for the right partners to take them seriously and reach out.",
  quote: "Velaris gave our firm an institutional-grade presence that finally matches the calibre of our deals.",
  author: "Junior Aguaze",
  role: "Principal, Bellavista Investments",
  avatar: "home-img/client-2.png"
}, {
  slug: "coastal",
  n: "05",
  client: "Coastal Crest Lettings",
  sector: "B2C · Property",
  logo: "home-img/logo-coastal.png",
  logoInvert: false,
  dark: false,
  featured: false,
  title: ["A fresh, trustworthy site for a ", "lettings", " business"],
  headline: "A Fresh, Trustworthy Website for a Lettings Business",
  summary: "A clean, modern lettings website built exactly to brief — patient collaboration, fresh ideas and a finish the client was thrilled with.",
  img: "home-img/dev-coastal.png",
  gallery: ["home-img/dev-coastal.png"],
  live: "https://www.coastalcrestlettings.co.uk/",
  services: ["Custom-Coded Development", "Conversion UI/UX Design", "SEO Optimization"],
  stats: [["20+ yrs", "Brought online"], ["Exactly", "On brief"], ["5.0★", "Client rating"]],
  challenge: "Coastal Crest needed a website that felt modern and trustworthy to landlords and tenants, without losing the personal, approachable feel of the business.",
  approach: "We worked closely and patiently through every stage, bringing fresh design ideas while making sure the finished site was exactly what the client wanted.",
  outcome: "A finished website the client was delighted with — and a relationship they'd happily return to.",
  quote: "Ahamed was great to work with. From start to finish he was patient and helpful, ensuring the finished website was exactly what I wanted. He's an exciting designer with fresh ideas — I'd highly recommend him and would be keen to work with him again.",
  author: "Rupert",
  role: "Director, Coastal Crest Lettings",
  avatar: "home-img/client-1.png"
}, {
  slug: "menstruation",
  n: "06",
  client: "Menstruacion",
  sector: "B2C · Femtech",
  logo: "home-img/logo-menstruation.png",
  logoInvert: false,
  dark: false,
  featured: false,
  title: ["Real support for ", "real moments"],
  headline: "A Warm, Trusted Health Resource for Parents & Teens",
  summary: "A reassuring, expert-led experience pairing sensitive design with a research-backed content hub parents actually feel comfortable using.",
  img: "home-img/dev-menstruation.jpg",
  gallery: ["home-img/dev-menstruation.jpg"],
  live: "https://menstruacion.com/",
  services: ["Custom-Coded Development", "Conversion UI/UX Design", "SEO Optimization"],
  stats: [["Warm", "Trusted tone"], ["Expert", "Content hub"], ["Parent", "-friendly UX"]],
  challenge: "Menstruacion needed to discuss a sensitive topic in a way that felt safe and trustworthy for both parents and teens — without feeling clinical or awkward.",
  approach: "We built a warm, approachable experience with an expert articles and research hub at its heart, designed to give families reliable information with confidence.",
  outcome: "A trustworthy resource with exactly the tone the brand needed to support parents and teens through real moments.",
  quote: "",
  author: "",
  role: "",
  avatar: ""
}];

/* ---- SERVICES (full CMS — drives home grid AND service.html?s=) ----
   Order: brand → web/UX design → build (custom/Webflow/Framer/AI) → SEO → cold email. */
window.VELARIS_SERVICES = [{
  slug: "brand-identity",
  tag: "01",
  name: "Logo &amp; Brand Design",
  icon: "brand",
  feat: false,
  short: "A distinctive identity, logo and brand kit that makes your business look credible and recognisable.",
  feats: ["Logo &amp; brand system", "Guidelines that scale"],
  tagline: "A brand that looks as good as your work.",
  intro: "Your brand decides whether people trust you in the first three seconds. We craft a distinctive identity and brand kit that makes your business look credible, premium and recognisable — the foundation every great website is built on.",
  includes: ["Logo &amp; visual identity", "Colour &amp; typography system", "Brand voice &amp; messaging", "Brand guidelines", "Social &amp; marketing templates", "Asset handover kit"],
  outcome: "A cohesive brand that builds instant credibility and lets you charge what you're worth.",
  highlights: [["3s", "To earn trust"], ["1", "Cohesive system"], ["∞", "Scales with you"]],
  bestfor: "Founders launching or rebranding who need a credible, premium identity.",
  deliverable: "Logo suite, brand guidelines and a ready-to-use asset kit."
}, {
  slug: "conversion-uiux",
  tag: "02",
  name: "Web &amp; UX Design",
  icon: "ux",
  feat: false,
  short: "Conversion-focused web design built around your customer's journey to maximise trust and bookings.",
  feats: ["Wireframe → high-fidelity", "Conversion-tested layouts"],
  tagline: "Design that turns clicks into booked calls.",
  intro: "Great design isn't decoration — it's persuasion. We design every page, headline and interaction around your customer's journey, using proven UX principles to build trust and guide visitors to act.",
  includes: ["UX strategy &amp; user journeys", "Wireframes to high-fidelity design", "Conversion-focused copywriting", "Trust &amp; social-proof placement", "Design system &amp; components", "Usability &amp; conversion testing"],
  outcome: "A site that feels effortless to use and consistently converts visitors into leads.",
  highlights: [["+38%", "Avg. conversion lift"], ["UX", "Law-led design"], ["100%", "Mobile-first"]],
  bestfor: "Businesses whose site looks fine but isn't converting visitors into enquiries.",
  deliverable: "A complete, conversion-tested design system ready to build."
}, {
  slug: "custom-development",
  tag: "03",
  name: "Custom-Coded Development",
  icon: "code",
  feat: false,
  short: "Hand-built, lightning-fast websites with zero template bloat — engineered for speed, SEO and longevity.",
  feats: ["Core Web Vitals optimized", "Scalable, secure architecture"],
  tagline: "Websites built by hand, engineered to perform.",
  intro: "Templates and page builders leave you with bloated, slow, hard-to-rank websites. We write clean, custom code so your site loads instantly, ranks well and scales with your business for years.",
  includes: ["Custom front-end build (no template bloat)", "Core Web Vitals &amp; performance tuning", "Responsive across every device", "Technical SEO foundations", "CMS-ready content structure", "Analytics &amp; conversion tracking"],
  outcome: "A fast, future-proof website that search engines and customers both love.",
  highlights: [["<1s", "Load times"], ["100", "Lighthouse target"], ["0", "Template bloat"]],
  bestfor: "Brands that want maximum speed, control and a site that's truly theirs.",
  deliverable: "A hand-coded, SEO-ready website you fully own."
}, {
  slug: "webflow-development",
  tag: "04",
  name: "Webflow Development",
  icon: "webflow",
  feat: false,
  short: "Powerful, CMS-driven Webflow sites you can edit yourself — fast to launch, easy to scale.",
  feats: ["Visual CMS you control", "Fast, no-dev updates"],
  tagline: "Beautiful, editable websites — without the dev queue.",
  intro: "Webflow gives you a fast, designer-grade website with a visual CMS your team can update without touching code. We design and build it properly so it stays fast, ranks well and grows with you.",
  includes: ["Custom Webflow design &amp; build", "CMS collections (blog, cases, services)", "Responsive interactions &amp; animation", "On-page &amp; technical SEO setup", "Editor training &amp; handover", "Hosting &amp; launch support"],
  outcome: "A polished website your team can confidently manage in-house.",
  highlights: [["DIY", "Easy edits"], ["CMS", "Blog &amp; cases"], ["Fast", "To launch"]],
  bestfor: "Teams that want to publish and edit content without a developer.",
  deliverable: "A live Webflow site plus editor training for your team."
}, {
  slug: "framer-development",
  tag: "05",
  name: "Framer Development",
  icon: "framer",
  feat: false,
  short: "Stunning, animated Framer sites that launch fast and feel premium — ideal for launches and landing pages.",
  feats: ["Rich motion &amp; interactions", "Rapid launch-ready builds"],
  tagline: "High-impact, animated sites — shipped fast.",
  intro: "Framer is our go-to for beautiful, motion-rich websites and landing pages that need to launch quickly without sacrificing polish. We craft fast, responsive Framer builds that feel genuinely premium.",
  includes: ["Custom Framer design &amp; build", "Advanced animation &amp; interactions", "CMS for blog &amp; case studies", "Responsive across devices", "SEO &amp; performance setup", "Editor training &amp; handover"],
  outcome: "A striking, fast-to-launch site that makes the right first impression.",
  highlights: [["Motion", "Built-in"], ["Days", "Not months"], ["Premium", "Feel"]],
  bestfor: "Launches, campaigns and brands that want standout motion design.",
  deliverable: "A live, animated Framer site ready to edit and grow."
}, {
  slug: "ai-web-development",
  tag: "06",
  name: "Claude AI Web Development",
  icon: "spark",
  feat: true,
  short: "AI-assisted builds and on-site assistants that qualify leads and answer questions around the clock.",
  feats: ["Ship up to 2× faster", "AI lead qualification 24/7"],
  tagline: "AI-accelerated builds and round-the-clock lead assistants.",
  intro: "We use Claude AI across our build process to ship faster without cutting quality — and we can add an on-site AI assistant that qualifies leads and answers customer questions 24/7.",
  includes: ["AI-accelerated design &amp; build", "On-site AI chat assistant (optional)", "Automated lead qualification &amp; routing", "AI-assisted SEO content", "Faster turnaround times", "Human-reviewed quality at every step"],
  outcome: "A modern website that works for you around the clock — and gets to market faster.",
  highlights: [["2×", "Faster builds"], ["24/7", "AI assistant"], ["Smart", "Lead routing"]],
  bestfor: "Forward-thinking founders who want an edge and faster delivery.",
  deliverable: "An AI-accelerated website with an optional lead-qualifying assistant."
}, {
  slug: "seo-optimization",
  tag: "07",
  name: "SEO Optimization",
  icon: "search",
  feat: false,
  short: "Local and technical SEO that puts you in front of high-intent customers searching for you right now.",
  feats: ["Local map-pack rankings", "Content engineered to rank"],
  tagline: "Get found by customers searching right now.",
  intro: "A beautiful website is useless if nobody finds it. We combine local, technical and content SEO to put you in front of high-intent customers at the exact moment they're searching for what you offer.",
  includes: ["Local SEO &amp; Google Business Profile", "Technical SEO &amp; site health", "Keyword research &amp; mapping", "On-page optimization", "Content that ranks", "Monthly reporting &amp; iteration"],
  outcome: "First-page rankings that send you a steady stream of free, high-intent traffic.",
  highlights: [["300+", "Keywords ranked"], ["Map", "Pack rankings"], ["Free", "High-intent traffic"]],
  bestfor: "Local and service businesses that want to be found on Google.",
  deliverable: "A ranking website with a clear monthly SEO growth report."
}, {
  slug: "cold-email-marketing",
  tag: "08",
  name: "Cold Email &amp; Marketing",
  icon: "mail",
  feat: false,
  short: "Deliverability-first outreach and email marketing that starts real conversations and books meetings.",
  feats: ["Inbox-safe cold email", "Nurture that converts"],
  tagline: "Outbound that books meetings — not spam.",
  intro: "We run deliverability-first cold email and email marketing that lands in the inbox, starts genuine conversations and books qualified meetings directly on your calendar.",
  includes: ["Domain warm-up &amp; deliverability setup", "Targeted prospect lists", "High-reply cold email copy", "Nurture &amp; follow-up sequences", "List segmentation", "Reply handling &amp; reporting"],
  outcome: "A predictable outbound channel that fills your pipeline with qualified conversations.",
  highlights: [["Inbox", "Not spam"], ["Booked", "Meetings"], ["Predictable", "Pipeline"]],
  bestfor: "Founders who want proactive, predictable lead flow alongside inbound.",
  deliverable: "A running cold-email system booking qualified calls for you."
}];

/* ---- PROCESS (used on Pricing page) ---- */
window.VELARIS_PROCESS = [{
  n: "01",
  title: "Strategy &amp; Positioning",
  desc: "We dig into your market, customers and goals to define a message that makes you the obvious choice.",
  out: "Positioning &amp; sitemap",
  tags: ["Discovery", "Messaging"]
}, {
  n: "02",
  title: "Conversion-Focused Design",
  desc: "Every layout, headline, CTA and interaction is designed to build trust and guide visitors to act.",
  out: "High-fidelity design",
  tags: ["UX", "UI", "Copy"]
}, {
  n: "03",
  title: "Development &amp; Build",
  desc: "Fast, responsive, SEO-ready builds — custom-coded, Webflow or Framer — that are easy to manage.",
  out: "Live, tested website",
  tags: ["Custom code", "SEO"]
}, {
  n: "04",
  title: "Launch &amp; Optimization",
  desc: "We launch, measure and keep refining so your site generates more qualified leads month after month.",
  out: "Monthly growth report",
  tags: ["Analytics", "Growth"]
}];

/* ---- PRICING ---- */
window.VELARIS_PRICING = [{
  name: "Starter",
  price: "£2,500",
  per: "project",
  tagline: "A complete brand + website to launch with credibility.",
  feats: ["Logo &amp; brand essentials", "Up to 7 pages, custom designed", "Webflow, Framer or custom build", "On-page SEO + keyword research", "Mobile responsive &amp; fast", "CMS-ready content", "1–2 weeks delivery"],
  cta: "Start with Starter",
  feat: false
}, {
  name: "Growth",
  price: "£5,500",
  per: "project",
  tagline: "Our most popular — the full lead-generation system.",
  feats: ["Everything in Starter", "Full brand &amp; identity system", "Up to 16 pages + UI/UX design", "Local &amp; technical SEO", "Lead-gen &amp; booking flows", "Blog / case-study CMS", "Analytics &amp; conversion tracking", "2–4 weeks delivery"],
  cta: "Choose Growth",
  feat: true
}, {
  name: "Scale",
  price: "From £9,000",
  per: "project",
  tagline: "Everything, done-for-you — brand to outreach.",
  feats: ["Everything in Growth", "Claude AI web development", "Cold email &amp; outreach setup", "Advanced SEO &amp; content engine", "Ongoing optimization &amp; support", "Priority delivery", "Custom timeline"],
  cta: "Talk to us",
  feat: false
}];

/* ---- INDIVIDUAL SERVICE PRICING (à la carte) ---- */
window.VELARIS_SERVICE_PRICING = [{
  name: "Logo &amp; Brand Design",
  icon: "brand",
  price: "From £600",
  note: "Logo, colour, type &amp; brand kit",
  slug: "brand-identity"
}, {
  name: "Web &amp; UX Design",
  icon: "ux",
  price: "From £1,200",
  note: "Conversion-focused design, per project",
  slug: "conversion-uiux"
}, {
  name: "Custom-Coded Development",
  icon: "code",
  price: "From £1,800",
  note: "Hand-built, performance-tuned",
  slug: "custom-development"
}, {
  name: "Webflow Development",
  icon: "webflow",
  price: "From £1,500",
  note: "CMS-driven, editable build",
  slug: "webflow-development"
}, {
  name: "Framer Development",
  icon: "framer",
  price: "From £1,400",
  note: "Animated, launch-ready build",
  slug: "framer-development"
}, {
  name: "Claude AI Web Development",
  icon: "spark",
  price: "From £2,200",
  note: "AI-accelerated build + assistant",
  slug: "ai-web-development"
}, {
  name: "SEO Optimization",
  icon: "search",
  price: "From £300/mo",
  note: "Keyword research + on-page + local",
  slug: "seo-optimization"
}, {
  name: "Cold Email &amp; Marketing",
  icon: "mail",
  price: "From £600/mo",
  note: "Deliverability, copy &amp; sequences",
  slug: "cold-email-marketing"
}];

/* ---- RESOURCES (ebooks, PDFs, digital products, guides) ---- */
window.VELARIS_RESOURCES = [{
  type: "E-Book",
  price: "Free",
  title: "The 2026 Lead Generation Playbook",
  cat: "Lead Generation",
  desc: "Our complete system for generating 10+ qualified leads a month for service businesses — the exact framework we use with clients.",
  cta: "Download free",
  featured: true,
  img: "unsplash:photo-1551288049-bebda4e38f71"
}, {
  type: "Checklist",
  price: "Free",
  title: "The Local SEO Checklist for Service Businesses",
  cat: "Local SEO",
  desc: "A step-by-step checklist to rank in the Google Map Pack and get found by high-intent local customers.",
  cta: "Get the checklist",
  featured: false,
  img: "unsplash:photo-1432888622747-4eb9a8efeb07"
}, {
  type: "Template",
  price: "Free",
  title: "High-Converting Homepage Wireframe Kit",
  cat: "Conversion",
  desc: "The section-by-section homepage structure we use to turn visitors into booked calls — ready to copy.",
  cta: "Download kit",
  featured: false,
  img: "unsplash:photo-1559028012-481c04fa702d"
}, {
  type: "Guide",
  price: "£29",
  title: "Cold Email That Books Meetings",
  cat: "Email Marketing",
  desc: "A deliverability-first cold email system with templates, sequences and the exact copy that gets replies.",
  cta: "Buy now",
  featured: false,
  img: "unsplash:photo-1596526131083-e8c633c948d2"
}, {
  type: "Mini-Course",
  price: "£49",
  title: "Website SEO Foundations",
  cat: "SEO",
  desc: "Everything a founder needs to make their website rank — technical SEO, content and local SEO, made simple.",
  cta: "Enrol now",
  featured: false,
  img: "unsplash:photo-1460925895917-afdab827c52f"
}, {
  type: "Notion Kit",
  price: "£19",
  title: "The Service Business Content Calendar",
  cat: "Content",
  desc: "A plug-and-play content system to plan, write and publish blog posts that rank and bring in leads.",
  cta: "Get the kit",
  featured: false,
  img: "unsplash:photo-1484480974693-6ca0a78fb36b"
}];

/* ---- FAQ (buyer-intent, search-optimized) ---- */
window.VELARIS_FAQS = [{
  q: "How long does it take to build a website?",
  a: "Most projects run from 1 week for a focused landing page up to 3–6 weeks for a full website, depending on scope. You'll get a clear timeline with milestones at kickoff and updates at every stage."
}, {
  q: "How much does a new website cost?",
  a: "Our projects start at £1,500 for a focused launch site and scale with the work involved. Most lead-generation websites land in the £3,500 range. Book a free call for a clear, no-obligation quote."
}, {
  q: "Do you only build websites, or handle SEO and leads too?",
  a: "Both. Every build includes technical and local SEO, and we offer cold email, email marketing and ongoing optimization so your site actually generates qualified leads — not just looks good."
}, {
  q: "Will my website actually rank on Google?",
  a: "Yes — ranking is built in, not bolted on. We engineer technical SEO, local SEO and content that targets the high-intent terms your customers search, then keep optimizing after launch."
}, {
  q: "What platforms do you build on — Webflow, Framer or custom code?",
  a: "All three. We build custom-coded sites as well as Webflow and Framer, choosing the right tool for your goals, budget and how hands-on you want to be editing content."
}, {
  q: "Will I be able to edit the website myself?",
  a: "Yes. We build on CMS-ready foundations and hand over a simple, documented setup so you or your team can update pages, blogs and case studies without touching code."
}, {
  q: "How do you actually generate 10+ leads a month?",
  a: "Through a system — conversion-focused design, local and technical SEO, content that ranks, and optional cold email. We track what works and double down on the channels driving booked calls."
}, {
  q: "Do you work with businesses outside the UK?",
  a: "Absolutely. We work with B2B and B2C founders across the UK and internationally — everything is handled remotely with clear communication and regular check-ins."
}, {
  q: "What happens after my website launches?",
  a: "We don't disappear at launch. We monitor performance, fix issues, and offer ongoing optimization and growth plans so your site keeps improving and generating leads month after month."
}, {
  q: "Can you redesign my existing website without losing my Google rankings?",
  a: "Yes. We migrate carefully — preserving URLs, redirects and on-page SEO — so a redesign protects your existing rankings and traffic while improving conversions."
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/home-data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/home-figma.js
try { (() => {
/* Velaris Web — home page interactions (data-driven). Nav/footer = site.js */
(function () {
  'use strict';

  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = 'cubic-bezier(.22,.61,.36,1)';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>';
  var revObs = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revObs.unobserve(en.target);
      }
    });
  }, {
    threshold: .12
  });
  function revObserve(els) {
    els.forEach(function (el) {
      revObs.observe(el);
    });
  }

  /* category + real imagery helper (shared visual language for blog) */
  function uns(id, w) {
    return 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + (w || 600) + '&q=80';
  }
  var PIMG = {
    "Local SEO": "photo-1524661135-423995f22d0b",
    "Web Design": "photo-1467232004584-a241de8bcf5d",
    "Conversion": "photo-1460925895917-afdab827c52f",
    "Lead Generation": "photo-1551288049-bebda4e38f71",
    "Webflow": "photo-1547658719-da2b51169166",
    "Framer": "photo-1517077304055-6e89abbf09b0",
    "AI Web Development": "photo-1620712943543-bcc4688e7485",
    "Email Marketing": "photo-1596526131083-e8c633c948d2",
    "Branding": "photo-1626785774573-4b799315345d",
    "Analytics": "photo-1551288049-bebda4e38f71"
  };
  function thumb(p) {
    var id = PIMG[p.cat] || "photo-1467232004584-a241de8bcf5d";
    return 'linear-gradient(180deg,rgba(2,16,31,.12),rgba(2,16,31,.6)),url(' + uns(id) + ') center/cover';
  }

  /* ---- B2B / B2C : slide up from bottom ---- */
  (function () {
    var swap = document.querySelector('[data-swap]');
    if (!swap) return;
    var words = ['B2B', 'B2C'],
      i = 0;
    var el = document.createElement('span');
    el.className = 'word';
    el.textContent = words[0];
    swap.appendChild(el);
    if (rm) return;
    setInterval(function () {
      i = (i + 1) % words.length;
      el.style.transition = 'transform .42s ' + ease + ', opacity .42s';
      el.style.transform = 'translateY(-110%)';
      el.style.opacity = '0';
      setTimeout(function () {
        el.style.transition = 'none';
        el.style.transform = 'translateY(110%)';
        el.textContent = words[i];
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.transition = 'transform .5s ' + ease + ', opacity .5s';
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
          });
        });
      }, 420);
    }, 2800);
  })();

  /* ---- HERO case-study slider: image on top, caption below ---- */
  (function () {
    var track = document.getElementById('hsTrack');
    if (!track || !window.VELARIS_HERO_SLIDES) return;
    var S = window.VELARIS_HERO_SLIDES;
    track.innerHTML = S.map(function (s) {
      return '<a class="hs-slide" href="' + s.href + '" aria-label="' + s.client + ' case study"><img src="' + s.img + '" alt="' + s.client + ' website"></a>';
    }).join('');
    var caps = document.getElementById('hsCaps');
    caps.innerHTML = S.map(function (s, i) {
      return '<a class="hs-capitem' + (i === 0 ? ' on' : '') + '" href="' + s.href + '"><h3>' + s.headline + '</h3><p>' + s.blurb + '</p></a>';
    }).join('');
    var capEls = [].slice.call(caps.children);
    var slides = S.length,
      idx = 0,
      timer;
    var dotsWrap = document.getElementById('hsDots');
    var dots = [];
    for (var k = 0; k < slides; k++) {
      (function (n) {
        var b = document.createElement('button');
        if (n === 0) b.className = 'on';
        b.setAttribute('aria-label', 'Slide ' + (n + 1));
        b.addEventListener('click', function () {
          go(n);
          reset();
        });
        dotsWrap.appendChild(b);
        dots.push(b);
      })(k);
    }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach(function (d, j) {
        d.classList.toggle('on', j === idx);
      });
      capEls.forEach(function (c, j) {
        c.classList.toggle('on', j === idx);
      });
    }
    function reset() {
      if (rm) return;
      clearInterval(timer);
      timer = setInterval(function () {
        go(idx + 1);
      }, 5000);
    }
    var prev = document.getElementById('hsPrev'),
      next = document.getElementById('hsNext');
    if (prev) prev.addEventListener('click', function () {
      go(idx - 1);
      reset();
    });
    if (next) next.addEventListener('click', function () {
      go(idx + 1);
      reset();
    });
    reset();
  })();

  /* ---- marquee logos ---- */
  (function () {
    var track = document.getElementById('logoTrack');
    if (!track || !window.VELARIS_LOGOS) return;
    var L = window.VELARIS_LOGOS;
    function cells() {
      return L.map(function (l) {
        return '<div class="cell"><img src="' + l.src + '" alt="' + l.name + '"></div>';
      }).join('');
    }
    track.innerHTML = cells() + cells();
  })();

  /* ---- testimonials two-row marquee ---- */
  (function () {
    var r1 = document.getElementById('testiRow1'),
      r2 = document.getElementById('testiRow2');
    if (!r1 || !window.VELARIS_TESTIMONIALS) return;
    var VER = '<span class="verified" title="Verified review"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    var STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>';
    function starRow(n) {
      var s = '';
      for (var i = 0; i < 5; i++) s += STAR;
      return '<div class="tc-stars">' + s + '</div>';
    }
    var T = window.VELARIS_TESTIMONIALS;
    function card(t) {
      return '<figure class="tcard">' + '<div class="tc-top">' + starRow(t.stars || 5) + '<span class="tc-qm">&#8220;</span></div>' + '<blockquote class="tc-quote">' + t.quote + '</blockquote>' + '<figcaption class="tc-author"><span class="av" style="background-image:url(' + t.avatar + ')"></span>' + '<span class="tc-meta"><b>' + t.author + VER + '</b><span>' + t.role + '</span></span></figcaption></figure>';
    }
    // each row uses all testimonials (row 2 reversed); duplicate once for seamless -50% loop
    var rowA = T.slice();
    var rowB = T.slice().reverse();
    function fill(el, arr) {
      var html = arr.map(card).join('');
      el.innerHTML = html + html;
    }
    fill(r1, rowA);
    fill(r2, rowB);
  })();

  /* ---- count-up stats ---- */
  function animateNum(el) {
    var target = parseFloat(el.getAttribute('data-to')),
      dec = el.getAttribute('data-dec') | 0,
      pre = el.getAttribute('data-pre') || '',
      dur = 1500,
      t0 = null;
    function fmt(v) {
      return pre + v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1),
        e = 1 - Math.pow(1 - p, 3);
      el.firstChild.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(step);
    }
    if (rm) {
      el.firstChild.textContent = fmt(target);
      return;
    }
    requestAnimationFrame(step);
  }
  var statObs = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) {
        animateNum(en.target);
        statObs.unobserve(en.target);
      }
    });
  }, {
    threshold: .5
  });
  document.querySelectorAll('[data-to]').forEach(function (el) {
    statObs.observe(el);
  });

  /* ---- CASE STUDIES (featured stack) ---- */
  (function () {
    var stack = document.getElementById('caseStack');
    if (!stack || !window.VELARIS_CASES) return;
    var feat = window.VELARIS_CASES.filter(function (c) {
      return c.featured;
    });
    stack.innerHTML = feat.map(function (c) {
      var title = c.title.map(function (seg, i) {
        return i % 2 ? '<span class="serif">' + seg + '</span>' : seg;
      }).join('');
      var stats = c.stats.map(function (s) {
        return '<div><b>' + s[0] + '</b><small>' + s[1] + '</small></div>';
      }).join('');
      var foot;
      if (c.quote) {
        foot = '<div class="sc-quote"><span class="av" style="background-image:url(' + c.avatar + ')"></span>' + '<div><p class="qt">"' + c.quote + '"</p><span class="nm">' + c.author + ' <span class="rl">— ' + c.role + '</span></span></div></div>';
      } else {
        foot = '<div class="sc-outcome"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.4"/></svg></span>' + '<p><b>The outcome</b>' + c.outcome + '</p></div>';
      }
      return '<a class="stack-card' + (c.dark ? ' dark' : '') + '" id="case-' + c.slug + '" href="case.html?c=' + c.slug + '">' + '<div class="sc-text">' + '<div class="sc-top"><span class="sc-num">CASE ' + c.n + '</span><span class="sc-sector">' + c.sector + '</span></div>' + '<img class="sc-logo" src="' + c.logo + '" alt="' + c.client + '"' + (c.logoInvert ? ' style="filter:brightness(0) invert(1)"' : '') + '>' + '<h3>' + title + '</h3><p class="sum">' + c.summary + '</p>' + '<div class="sc-stats">' + stats + '</div>' + foot + '<span class="sc-read">Read full case study ' + ARROW + '</span>' + '</div>' + '<div class="sc-visual"><img src="' + c.img + '" alt="' + c.client + ' website"></div></a>';
    }).join('');
    if (!rm) {
      var cards = [].slice.call(stack.querySelectorAll('.stack-card'));
      function upd() {
        cards.forEach(function (card, n) {
          if (n === cards.length - 1) return;
          var r = card.getBoundingClientRect(),
            prog = Math.min(Math.max((104 - r.top) / r.height, 0), 1);
          card.style.transform = 'scale(' + (1 - prog * 0.05) + ')';
          card.style.opacity = 1 - prog * 0.35;
        });
      }
      window.addEventListener('scroll', upd, {
        passive: true
      });
      upd();
    }
  })();

  /* ---- MORE CASES grid ---- */
  (function () {
    var grid = document.getElementById('moreCases');
    if (!grid || !window.VELARIS_CASES) return;
    var more = window.VELARIS_CASES.filter(function (c) {
      return !c.featured;
    });
    grid.innerHTML = more.map(function (c) {
      var foot = c.quote ? '<p class="mc-quote">"' + c.quote + '"</p><div class="mc-author"><span class="av" style="background-image:url(' + c.avatar + ')"></span><span><b>' + c.author + '</b><span>' + c.role + '</span></span></div>' : '<p class="mc-quote">' + c.summary + '</p><div class="mc-author"><span class="av" style="background:var(--cream);display:flex;align-items:center;justify-content:center"><img src="' + c.logo + '" alt="" style="width:22px;height:auto"></span><span><b>' + c.client + '</b><span>' + c.sector + '</span></span></div>';
      return '<a class="mc" id="case-' + c.slug + '" href="case.html?c=' + c.slug + '">' + '<div class="mc-img"><img src="' + c.img + '" alt="' + c.client + ' website"></div>' + '<div class="mc-body"><span class="mc-sector">' + c.sector + '</span>' + foot + '</div></a>';
    }).join('');
  })();

  /* ---- SERVICES (horizontal scroll + arrows) ---- */
  (function () {
    var scroll = document.getElementById('svcScroll');
    if (!scroll || !window.VELARIS_SERVICES) return;
    var ic = {
      code: '<path d="M8 7l-4 5 4 5M16 7l4 5-4 5M13 4l-2 16"/>',
      spark: '<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.3 1-5.5-4-3.9L10.5 8z"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
      mail: '<path d="M3 6l9 7 9-7M3 6v12h18V6"/>',
      ux: '<path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.5"/>',
      brand: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',
      webflow: '<path d="M3 8l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 16l9 4 9-4"/>',
      framer: '<path d="M6 3h12v6H12zM6 9h6l6 6h-6v6z"/>'
    };
    scroll.innerHTML = window.VELARIS_SERVICES.map(function (s) {
      var feats = s.feats.map(function (f) {
        return '<li>' + CHECK + f + '</li>';
      }).join('');
      return '<div class="svc' + (s.feat ? ' feat' : '') + '">' + '<div class="svc-top"><div class="svc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + ic[s.icon] + '</svg></div><span class="svc-n">' + s.tag + '</span></div>' + '<h3>' + s.name + '</h3><p>' + s.short + '</p><ul class="feats">' + feats + '</ul>' + '<a class="svc-link" href="service.html?s=' + s.slug + '">Learn more ' + ARROW + '</a></div>';
    }).join('');
    var prev = document.getElementById('svcPrev'),
      next = document.getElementById('svcNext');
    function by() {
      var c = scroll.querySelector('.svc');
      return c ? c.getBoundingClientRect().width + 20 : 360;
    }
    if (prev) prev.addEventListener('click', function () {
      scroll.scrollBy({
        left: -by(),
        behavior: 'smooth'
      });
    });
    if (next) next.addEventListener('click', function () {
      scroll.scrollBy({
        left: by(),
        behavior: 'smooth'
      });
    });
  })();

  /* ---- PROCESS (home — optional) ---- */
  (function () {
    var rail = document.getElementById('procRail');
    if (!rail || !window.VELARIS_PROCESS) return;
    rail.innerHTML = window.VELARIS_PROCESS.map(function (p) {
      var tags = p.tags.map(function (t) {
        return '<span>' + t + '</span>';
      }).join('');
      return '<div class="proc-row reveal"><div class="proc-n">' + p.n + '</div>' + '<div class="proc-mid"><h3>' + p.title + '</h3><p>' + p.desc + '</p><div class="tags">' + tags + '</div></div>' + '<div class="proc-out"><small>Output</small>' + p.out + '</div></div>';
    }).join('');
    revObserve(rail.querySelectorAll('.reveal'));
  })();

  /* ---- FAQ ---- */
  (function () {
    var list = document.getElementById('faqList');
    if (!list || !window.VELARIS_FAQS) return;
    list.innerHTML = window.VELARIS_FAQS.map(function (f) {
      return '<div class="faq-item"><button class="faq-q">' + f.q + '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg></span></button>' + '<div class="faq-a"><p>' + f.a + '</p></div></div>';
    }).join('');
    list.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q'),
        a = item.querySelector('.faq-a');
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        list.querySelectorAll('.faq-item.open').forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = '0';
        });
        if (!open) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  })();

  /* ---- WHY scroll highlight ---- */
  (function () {
    var box = document.getElementById('whyText');
    if (!box) return;
    var s = "We help service businesses, founders and consultants grow online with strategic website design, local SEO, conversion-focused UX and modern development. Every site we build is engineered to rank on Google, increase trust, and turn more visitors into paying customers.";
    var accent = ["leads", "Google", "trust", "grow", "qualified", "SEO", "ranks", "ranking,", "customers."];
    box.innerHTML = s.split(' ').map(function (w) {
      var clean = w.replace(/[^A-Za-z.]/g, '');
      var acc = accent.indexOf(clean) > -1 ? ' acc' : '';
      return '<span class="w' + acc + '">' + w + '</span>';
    }).join(' ');
    var words = [].slice.call(box.querySelectorAll('.w'));
    function upd() {
      var r = box.getBoundingClientRect(),
        vh = window.innerHeight;
      var start = vh * 0.8,
        end = vh * 0.3,
        prog = (start - r.top) / (start - end + r.height * 0.6);
      prog = Math.min(Math.max(prog, 0), 1);
      var lit = Math.floor(prog * words.length);
      words.forEach(function (w, k) {
        w.classList.toggle('lit', k < lit);
      });
    }
    window.addEventListener('scroll', upd, {
      passive: true
    });
    window.addEventListener('resize', upd);
    upd();
  })();

  /* ---- ARTICLES slider ---- */
  (function () {
    var track = document.getElementById('artTrack');
    if (!track || !window.VELARIS_POSTS) return;
    var posts = window.VELARIS_POSTS.slice(0, 8);
    track.innerHTML = posts.map(function (p, i) {
      return '<a class="art-card" href="post.html?slug=' + p.slug + '"><div class="art-thumb"><div class="ph" style="background:' + thumb(p) + '"></div><span class="art-topic">' + p.cat + '</span></div>' + '<div class="art-body"><div class="art-tags"><span class="cat">' + p.cat + '</span><span>' + p.read + ' min read</span></div>' + '<h3>' + p.title + '</h3><p>' + p.excerpt + '</p>' + '<span class="art-read">Read more ' + ARROW + '</span></div></a>';
    }).join('');
    var idx = 0;
    var prev = document.getElementById('artPrev'),
      next = document.getElementById('artNext');
    var dotsWrap = document.getElementById('artDots');
    function per() {
      return window.innerWidth <= 680 ? 1 : window.innerWidth <= 1040 ? 2 : 3;
    }
    function maxIdx() {
      return Math.max(0, posts.length - per());
    }
    function cardW() {
      var c = track.querySelector('.art-card');
      return c ? c.getBoundingClientRect().width + 24 : 384;
    }
    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var k = 0; k <= maxIdx(); k++) {
        (function (n) {
          var b = document.createElement('button');
          if (n === 0) b.className = 'on';
          b.addEventListener('click', function () {
            idx = n;
            render();
          });
          dotsWrap.appendChild(b);
        })(k);
      }
    }
    function render() {
      idx = Math.min(idx, maxIdx());
      track.style.transform = 'translateX(-' + idx * cardW() + 'px)';
      if (prev) prev.disabled = idx <= 0;
      if (next) next.disabled = idx >= maxIdx();
      [].slice.call(dotsWrap.children).forEach(function (d, j) {
        d.classList.toggle('on', j === idx);
      });
    }
    if (prev) prev.addEventListener('click', function () {
      idx--;
      render();
    });
    if (next) next.addEventListener('click', function () {
      idx++;
      render();
    });
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        buildDots();
        render();
      }, 150);
    });
    buildDots();
    render();
  })();
  revObserve(document.querySelectorAll('.reveal'));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/home-figma.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/pages.js
try { (() => {
/* Velaris Web — sub-page renderers (service / case / blog list / post detail) */
(function () {
  'use strict';

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>';
  var IC = {
    code: '<path d="M8 7l-4 5 4 5M16 7l4 5-4 5M13 4l-2 16"/>',
    spark: '<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.3 1-5.5-4-3.9L10.5 8z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
    mail: '<path d="M3 6l9 7 9-7M3 6v12h18V6"/>',
    ux: '<path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.5"/>',
    brand: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',
    webflow: '<path d="M3 8l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 16l9 4 9-4"/>',
    framer: '<path d="M6 3h12v6H12zM6 9h6l6 6h-6v6z"/>'
  };
  function qs(k) {
    return new URLSearchParams(location.search).get(k);
  }
  function uns(id, w) {
    id = (id || '').replace('unsplash:', '');
    return 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + (w || 800) + '&q=80';
  }
  var GRADS = {
    "Local SEO": 'linear-gradient(135deg,#0a5d5d,#1f8a5b,#0a3d3d)',
    "Web Design": 'linear-gradient(135deg,#1a1a2e,#3a2a4a,#0f3460)',
    "Conversion": 'linear-gradient(135deg,#ff9a56,#a259ff,#2d9bf0)',
    "Lead Generation": 'linear-gradient(135deg,#0f2027,#2F9B95,#203a43)',
    "Webflow": 'linear-gradient(135deg,#11212d,#2563eb,#0b1d2a)',
    "Framer": 'linear-gradient(135deg,#1a1a1a,#444,#0d0d0d)',
    "AI Web Development": 'linear-gradient(135deg,#2d1b4e,#7c3aed,#1e1b4b)',
    "Email Marketing": 'linear-gradient(135deg,#0b1d2a,#0ea5a0,#072e2c)',
    "Branding": 'linear-gradient(135deg,#2d1b4e,#c94b9c,#f4a261)',
    "Analytics": 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)'
  };
  /* category → Unsplash photo for custom-feel blog imagery */
  var PIMG = {
    "Local SEO": "photo-1524661135-423995f22d0b",
    "Web Design": "photo-1467232004584-a241de8bcf5d",
    "Conversion": "photo-1460925895917-afdab827c52f",
    "Lead Generation": "photo-1551288049-bebda4e38f71",
    "Webflow": "photo-1547658719-da2b51169166",
    "Framer": "photo-1517077304055-6e89abbf09b0",
    "AI Web Development": "photo-1620712943543-bcc4688e7485",
    "Email Marketing": "photo-1596526131083-e8c633c948d2",
    "Branding": "photo-1626785774573-4b799315345d",
    "Analytics": "photo-1551288049-bebda4e38f71"
  };
  function grad(p) {
    return GRADS[p.cat] || 'linear-gradient(135deg,#0a2236,#2F9B95,#02101f)';
  }
  function thumb(p, w) {
    var id = PIMG[p.cat];
    var g = grad(p);
    if (id) return 'background:linear-gradient(180deg,rgba(2,16,31,.12),rgba(2,16,31,.62)),url(' + uns(id, w || 600) + ') center/cover, ' + g;
    return 'background:' + g;
  }
  function svcIcon(s) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + (IC[s.icon] || '') + '</svg>';
  }

  /* ===== SERVICES LISTING ===== */
  var svcList = document.getElementById('svcListing');
  if (svcList && window.VELARIS_SERVICES) {
    svcList.innerHTML = window.VELARIS_SERVICES.map(function (s) {
      var feats = s.feats.map(function (f) {
        return '<li>' + CHECK + f + '</li>';
      }).join('');
      return '<a class="svc' + (s.feat ? ' feat' : '') + '" href="service.html?s=' + s.slug + '" style="text-decoration:none;color:inherit">' + '<div class="svc-top"><div class="svc-ic">' + svcIcon(s) + '</div><span class="svc-n">' + s.tag + '</span></div>' + '<h3>' + s.name + '</h3><p>' + s.short + '</p><ul class="feats">' + feats + '</ul>' + '<span class="svc-link">Learn more ' + ARROW + '</span></a>';
    }).join('');
  }

  /* ===== SERVICE DETAIL (musemind-structured, CMS-driven) ===== */
  var sd = document.getElementById('serviceDetail');
  if (sd && window.VELARIS_SERVICES) {
    var s = window.VELARIS_SERVICES.filter(function (x) {
      return x.slug === qs('s');
    })[0] || window.VELARIS_SERVICES[0];
    var plain = function (t) {
      return (t || '').replace(/&amp;/g, '&');
    };
    var nameShort = plain(s.name).replace('Claude AI Web Development', 'Claude AI development');
    var capIcons = ['ux', 'code', 'spark', 'search', 'brand', 'webflow'];
    var pathIcon = function (key) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + (IC[key] || IC.spark) + '</svg>';
    };
    var pick = function (map) {
      return map && (map[s.slug] || map._default) || [];
    };
    document.title = plain(s.name) + ' — Velaris Web';
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', plain(s.intro));

    // ---- hero ----
    sd.querySelector('[data-crumb]').innerHTML = s.name;
    sd.querySelector('[data-tagline]').textContent = plain(s.tagline);
    sd.querySelector('[data-name]').innerHTML = s.name;
    sd.querySelector('[data-intro]').textContent = plain(s.intro);
    var hl = sd.querySelector('[data-highlights]');
    if (hl && s.highlights) hl.innerHTML = s.highlights.map(function (h) {
      return '<div class="svh"><b>' + h[0] + '</b><small>' + h[1] + '</small></div>';
    }).join('');
    var hv = sd.querySelector('[data-hero-visual]');
    if (hv) {
      var hImg = window.VELARIS_SVC_MEDIA && (window.VELARIS_SVC_MEDIA[s.slug] || window.VELARIS_SVC_MEDIA._default) || 'photo-1467232004584-a241de8bcf5d';
      hv.innerHTML = '<img src="' + uns(hImg, 900) + '" alt="' + nameShort + '">' + '<span class="svc-hero-chip"><span class="dot"></span>Live client work</span>' + '<div class="svc-hero-badge"><span class="ic">' + svcIcon(s) + '</span><span><b>' + nameShort + '</b><small>Velaris Web</small></span></div>';
    }

    // ---- trusted-by logos ----
    var lg = sd.querySelector('[data-logos]');
    if (lg && window.VELARIS_CASES) {
      lg.innerHTML = window.VELARIS_CASES.slice(0, 6).map(function (c) {
        return '<img src="' + c.logo + '" alt="' + c.client + '"' + (c.logoInvert ? ' style="filter:grayscale(1) brightness(0)"' : '') + '>';
      }).join('');
    }

    // ---- process (per-service, with checklists) ----
    var ph = sd.querySelector('[data-proc-head]');
    if (ph) ph.innerHTML = 'Our ' + nameShort + ' <span class="serif">process</span>';
    var pr = sd.querySelector('[data-process]');
    if (pr) pr.innerHTML = pick(window.VELARIS_SVC_PROCESS).map(function (st, i) {
      var pts = (st.points || []).map(function (p) {
        return '<li>' + CHECK + '<span>' + p + '</span></li>';
      }).join('');
      return '<div class="proc-card"><span class="bgnum">0' + (i + 1) + '</span><span class="step">Step 0' + (i + 1) + '</span><h3>' + st.t + '</h3><p>' + st.d + '</p><ul class="proc-points">' + pts + '</ul></div>';
    }).join('');

    // ---- capabilities (what's included) ----
    var ih = sd.querySelector('[data-inc-head]');
    if (ih) ih.innerHTML = 'Everything in ' + nameShort.replace(/&/g, '&amp;') + ' <span class="serif">included</span>';
    var cp = sd.querySelector('[data-caps]');
    if (cp) {
      var caps = pick(window.VELARIS_SVC_CAPS);
      if (!caps.length && s.includes) caps = s.includes.map(function (f) {
        return [f, ''];
      });
      cp.innerHTML = caps.map(function (c, i) {
        var num = (i + 1 < 10 ? '0' : '') + (i + 1);
        return '<div class="cap2"><span class="cap-n">' + num + '</span><span class="cap-ic">' + pathIcon(capIcons[i % capIcons.length]) + '</span>' + '<h3>' + c[0] + '</h3>' + (c[1] ? '<p>' + c[1] + '</p>' : '') + '</div>';
      }).join('');
    }

    // ---- benefits (why it works) ----
    var bv = sd.querySelector('[data-ben-visual]');
    if (bv) {
      bv.innerHTML = '<img src="' + uns('photo-1522071820081-009f0129c71c', 800) + '" alt="The Velaris team at work">' + '<div class="ben-proof"><span class="stars">★★★★★</span><span><b>5.0 average</b><small>Trusted by founders</small></span></div>';
    }
    var bl = sd.querySelector('[data-benefits]');
    if (bl && window.VELARIS_SVC_BENEFITS) bl.innerHTML = window.VELARIS_SVC_BENEFITS.map(function (b) {
      var pts = (b.points || []).map(function (p) {
        return '<li>' + CHECK + '<span>' + p + '</span></li>';
      }).join('');
      return '<div class="ben-item"><h3>' + b.t + '</h3><p>' + b.d + '</p><ul class="ben-points">' + pts + '</ul></div>';
    }).join('');

    // ---- success story (related case with a testimonial) ----
    var sw = sd.querySelector('[data-story-wrap]');
    if (sw && window.VELARIS_CASES) {
      var firstWord = plain(s.name).split(' ')[0].toLowerCase();
      var story = window.VELARIS_CASES.filter(function (c) {
        return c.quote && c.services && c.services.join(' ').toLowerCase().indexOf(firstWord) > -1;
      })[0] || window.VELARIS_CASES.filter(function (c) {
        return c.quote;
      })[0];
      if (story) {
        sd.querySelector('[data-story-quote]').textContent = '“' + plain(story.quote) + '”';
        sd.querySelector('[data-story-who]').innerHTML = '<span class="av" style="background-image:url(' + story.avatar + ')"></span><span><b>' + story.author + '</b><span>' + story.role + '</span></span>';
        var sl = sd.querySelector('[data-story-link]');
        if (sl) sl.href = 'case.html?c=' + story.slug;
        sd.querySelector('[data-story-stats]').innerHTML = (story.stats || []).slice(0, 4).map(function (st) {
          return '<div class="ss"><b>' + st[0] + '</b><small>' + st[1] + '</small></div>';
        }).join('');
      } else {
        sw.style.display = 'none';
      }
    }

    // ---- industries (global) ----
    var ind = sd.querySelector('[data-industries]');
    if (ind && window.VELARIS_INDUSTRIES) ind.innerHTML = window.VELARIS_INDUSTRIES.map(function (x, i) {
      return '<div class="ind-card"><span class="ind-x">0' + (i + 1) + '</span><h3>' + x.name + '</h3><p>' + x.desc + '</p></div>';
    }).join('');

    // ---- why velaris (global) ----
    var wy = sd.querySelector('[data-whyus]');
    if (wy && window.VELARIS_WHYUS) wy.innerHTML = window.VELARIS_WHYUS.map(function (x, i) {
      return '<div class="why-card"><span class="wic">' + pathIcon(capIcons[i % capIcons.length]) + '</span><h3>' + x.t + '</h3><p>' + x.d + '</p></div>';
    }).join('');

    // ---- related work ----
    var rw = sd.querySelector('[data-related-work]');
    if (rw && window.VELARIS_CASES) {
      var rel = window.VELARIS_CASES.filter(function (c) {
        return c.services.join(' ').toLowerCase().indexOf(plain(s.name).split(' ')[0].toLowerCase()) > -1;
      });
      if (rel.length < 2) rel = window.VELARIS_CASES.slice(0, 3);
      rw.innerHTML = rel.slice(0, 3).map(function (c) {
        return '<a class="svw-card" href="case.html?c=' + c.slug + '"><div class="svw-img"><img src="' + c.img + '" alt="' + c.client + '"></div>' + '<div class="svw-b"><span>' + c.sector + '</span><b>' + c.client + '</b></div></a>';
      }).join('');
    }

    // ---- other services ----
    var others = window.VELARIS_SERVICES.filter(function (x) {
      return x.slug !== s.slug;
    }).slice(0, 3);
    var ow = document.getElementById('svcOther');
    if (ow) ow.innerHTML = others.map(function (o) {
      return '<a href="service.html?s=' + o.slug + '"><span class="ic">' + svcIcon(o) + '</span><span><b>' + o.name + '</b><span>' + o.tagline + '</span></span></a>';
    }).join('');
  }

  /* ===== WORK / PORTFOLIO LIST ===== */
  var wl = document.getElementById('workList');
  if (wl && window.VELARIS_CASES) {
    wl.innerHTML = window.VELARIS_CASES.map(function (c) {
      var title = c.title.map(function (seg, k) {
        return k % 2 ? '<span class="serif">' + seg + '</span>' : seg;
      }).join('');
      var stats = c.stats.map(function (s) {
        return '<div><b>' + s[0] + '</b><small>' + s[1] + '</small></div>';
      }).join('');
      var foot = c.quote ? '<div class="sc-quote"><span class="av" style="background-image:url(' + c.avatar + ')"></span><div><p class="qt">"' + c.quote.slice(0, 160) + (c.quote.length > 160 ? '…' : '') + '"</p><span class="nm">' + c.author + ' <span class="rl">— ' + c.role + '</span></span></div></div>' : '<div class="sc-outcome"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.4"/></svg></span><p><b>The outcome</b>' + c.outcome + '</p></div>';
      return '<a class="stack-card' + (c.dark ? ' dark' : '') + '" href="case.html?c=' + c.slug + '">' + '<div class="sc-text"><div class="sc-top"><span class="sc-num">CASE ' + c.n + '</span><span class="sc-sector">' + c.sector + '</span></div>' + '<img class="sc-logo" src="' + c.logo + '" alt="' + c.client + '"' + (c.logoInvert ? ' style="filter:brightness(0) invert(1)"' : '') + '>' + '<h3>' + title + '</h3><p class="sum">' + c.summary + '</p>' + '<div class="sc-stats">' + stats + '</div>' + foot + '<span class="sc-read">Read full case study <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>' + '<div class="sc-visual"><img src="' + c.img + '" alt="' + c.client + ' website"></div></a>';
    }).join('');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var wcards = [].slice.call(wl.querySelectorAll('.stack-card'));
      var wupd = function () {
        wcards.forEach(function (card, n) {
          if (n === wcards.length - 1) return;
          var r = card.getBoundingClientRect(),
            prog = Math.min(Math.max((104 - r.top) / r.height, 0), 1);
          card.style.transform = 'scale(' + (1 - prog * 0.05) + ')';
          card.style.opacity = 1 - prog * 0.35;
        });
      };
      window.addEventListener('scroll', wupd, {
        passive: true
      });
      wupd();
    }
  }
  var cd = document.getElementById('caseDetail');
  if (cd && window.VELARIS_CASES) {
    var list = window.VELARIS_CASES;
    var i = Math.max(0, list.map(function (x) {
      return x.slug;
    }).indexOf(qs('c')));
    var c = list[i];
    document.title = c.client + ' Case Study — Velaris Web';
    var md2 = document.querySelector('meta[name="description"]');
    if (md2) md2.setAttribute('content', c.summary);

    // per-case enrichment (palettes + requirement copy)
    var PAL = {
      hazelwood: ['#0E7C86', '#7FC6CD', '#0B2B3A', '#EAF4F5'],
      navasana: ['#3B2E7E', '#6C5CE7', '#0B1020', '#E9E7FB'],
      core: ['#26323F', '#3E5C76', '#0B1B2B', '#E6EAEE'],
      bellavista: ['#0B2B4A', '#C9A227', '#06182B', '#EFE7CF'],
      coastal: ['#15607A', '#6FB3C9', '#0A2D3A', '#EFE6D8'],
      menstruation: ['#7A2E4A', '#E08AA6', '#2A0F1A', '#FBE7EE']
    };
    var REQ = {
      hazelwood: "Hazelwood needed a website that made booking a hearing appointment effortless, ranked for high-intent local searches, and built immediate trust with an older, care-focused audience from the very first screen.",
      navasana: "Navasana needed to translate a sophisticated AI cyber-insurance product into a clear, credible experience that earned the confidence of technical, enterprise buyers and consistently drove qualified demo requests.",
      core: "Core needed a website that reflected the depth of their concept-to-product engineering, positioned them as a premium partner, and turned serious product teams into qualified enquiries.",
      bellavista: "Bellavista needed an institutional-grade digital presence that signalled credibility to investors and founders, with a clear architecture spanning real estate, private equity and M&amp;A.",
      coastal: "Coastal Crest needed a modern, trustworthy lettings website that felt approachable to landlords and tenants while bringing a 20-year, family-run business confidently online.",
      menstruation: "Menstruacion needed a warm, expert-led resource that discussed a sensitive topic with reassurance and clarity — comfortable and trustworthy for both parents and teens."
    };
    var KW = {
      hazelwood: ["hearing test near me", "hearing aids [city]", "ear wax removal near me", "audiologist near me", "book hearing appointment", "NHS hearing aid alternative", "tinnitus clinic", "hearing care clinic"],
      navasana: ["AI cyber insurance", "cyber insurance platform", "cyber risk assessment software", "cyber insurance for SaaS", "automated cyber underwriting", "cyber liability cover", "insurtech cyber platform"],
      core: ["mechanical design consultancy", "product design engineering", "concept to product", "CAD design services", "prototype to production", "product development partner", "engineering design firm"],
      bellavista: ["private equity firm [city]", "real estate investment firm", "M&amp;A advisory", "capital investment partners", "institutional investment", "property investment fund", "private capital advisory"],
      coastal: ["letting agents [city]", "property management near me", "landlord services", "rent my property", "residential lettings", "trusted letting agent", "tenant find service"],
      menstruation: ["first period guide", "talking to teens about periods", "period education for parents", "menstrual health resource", "period products guide", "puberty support for parents", "femtech health platform"]
    };
    var pal = c.palette || PAL[c.slug] || ['#2F9B95', '#49C9C0', '#02101F', '#F5F3EE'];
    var industry = (c.sector.split('·')[1] || c.sector).trim();
    var gal = c.gallery && c.gallery.length ? c.gallery : [c.img];
    cd.querySelector('[data-crumb]').textContent = c.client;
    cd.querySelector('[data-sector]').textContent = c.sector;
    cd.querySelector('[data-head]').innerHTML = c.headline;
    cd.querySelector('[data-summary]').textContent = c.summary;
    cd.querySelector('[data-client]').textContent = c.client;
    cd.querySelector('[data-services]').innerHTML = c.services.join(', ');
    cd.querySelector('[data-industry]').textContent = industry;
    cd.querySelector('[data-deliverables]').innerHTML = c.services.slice(0, 3).join(', ') + ', Launch &amp; SEO';
    cd.querySelector('[data-about]').textContent = c.summary;
    cd.querySelector('[data-requirement]').innerHTML = REQ[c.slug] || c.summary;
    cd.querySelector('[data-challenge]').textContent = c.challenge;
    cd.querySelector('[data-approach]').textContent = c.approach;
    cd.querySelector('[data-outcome]').textContent = c.outcome;

    // SEO keywords
    var kws = KW[c.slug] || ['web design', 'lead generation', 'local seo'];
    cd.querySelector('[data-keywords]').innerHTML = kws.map(function (k) {
      return '<span class="kw">' + k + '</span>';
    }).join('');

    // hero visual on a palette panel
    cd.querySelector('[data-hero]').style.background = 'linear-gradient(150deg,' + pal[0] + ',' + pal[2] + ')';
    cd.querySelector('[data-hero]').innerHTML = '<img src="' + c.img + '" alt="' + c.client + ' website">';

    // about 3-up gallery (reuse available images, pad with hero)
    var g3 = [gal[0], gal[1] || c.img, gal[2] || gal[0]];
    cd.querySelector('[data-gallery3]').innerHTML = g3.map(function (g, k) {
      return '<div class="g3" style="background:linear-gradient(150deg,' + pal[k % 2] + ',' + pal[2] + ')"><img src="' + g + '" alt="' + c.client + ' visual"></div>';
    }).join('');

    // solutions showcase (laptop on color)
    cd.querySelector('[data-showcase-a]').innerHTML = '<div class="sh-panel" style="background:' + pal[3] + '"><div class="sh-float lg" style="box-shadow:0 50px 90px -40px ' + pal[2] + '66"><img src="' + c.img + '" alt="' + c.client + ' desktop"></div></div>';

    // style guide: type specimen + palette
    cd.querySelector('[data-type]').innerHTML = '<div class="cs-type-card"><div class="ct-big serif">Aa</div><div class="ct-info"><b>Zodiak</b><span>Display · Italic accents</span><div class="ct-line serif">The quick brown fox</div></div></div>' + '<div class="cs-type-card"><div class="ct-big">Aa</div><div class="ct-info"><b>Cabinet Grotesk</b><span>Interface · Body &amp; headings</span><div class="ct-line">The quick brown fox</div></div></div>';
    cd.querySelector('[data-palette]').innerHTML = pal.map(function (hex) {
      return '<div class="sw"><span class="sw-c" style="background:' + hex + '"></span><small>' + hex.toUpperCase() + '</small></div>';
    }).join('');
    cd.querySelector('[data-showcase-b]').innerHTML = '<div class="sh-panel" style="background:linear-gradient(150deg,' + pal[0] + ',' + pal[2] + ')"><div class="sh-float tab"><img src="' + (gal[1] || c.img) + '" alt="' + c.client + ' tablet"></div></div>';

    // work in detail grid (mix of available shots)
    var det = [c.img, gal[1] || c.img, gal[2] || gal[0]];
    cd.querySelector('[data-detail]').innerHTML = '<div class="dt-tall"><img src="' + det[0] + '" alt="' + c.client + ' full page"></div>' + '<div class="dt-side">' + '<div class="dt-card" style="background:' + pal[3] + '"><img src="' + det[1] + '" alt="' + c.client + ' screen"></div>' + '<div class="dt-card" style="background:linear-gradient(150deg,' + pal[1] + ',' + pal[2] + ')"><img src="' + det[2] + '" alt="' + c.client + ' screen"></div>' + '</div>';

    // results stats
    cd.querySelector('[data-meta]').innerHTML = c.stats.map(function (st) {
      return '<div class="cm"><b>' + st[0] + '</b><small>' + st[1] + '</small></div>';
    }).join('');
    cd.querySelector('[data-showcase-c]').innerHTML = '<div class="sh-panel" style="background:linear-gradient(150deg,' + pal[1] + ',' + pal[0] + ')"><div class="sh-float lg"><img src="' + c.img + '" alt="' + c.client + ' result"></div></div>';

    // live links
    var lv = cd.querySelector('[data-live]');
    if (c.live) {
      if (lv) lv.href = c.live;
    } else if (lv) {
      lv.style.display = 'none';
    }

    // quote
    var qb = cd.querySelector('[data-quote]');
    if (c.quote) {
      qb.innerHTML = '<p>"' + c.quote + '"</p><div class="who"><span class="av" style="background-image:url(' + c.avatar + ')"></span><span><b>' + c.author + '</b><span>' + c.role + '</span></span></div>';
    } else {
      var qw = cd.querySelector('[data-quote-wrap]');
      if (qw) qw.style.display = 'none';
    }

    // prev/next
    var prev = list[(i - 1 + list.length) % list.length],
      next = list[(i + 1) % list.length];
    var cn = cd.querySelector('[data-casenav]');
    if (cn) cn.innerHTML = '<a href="case.html?c=' + prev.slug + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 6l-6 6 6 6"/></svg> ' + prev.client + '</a>' + '<a href="case.html?c=' + next.slug + '">' + next.client + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></a>';

    // scroll reveal for case sections
    var cobs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          cobs.unobserve(en.target);
        }
      });
    }, {
      threshold: .12
    });
    cd.querySelectorAll('.reveal').forEach(function (el) {
      cobs.observe(el);
    });
  }

  /* ===== RESOURCES ===== */
  var rg = document.getElementById('resGrid');
  if (rg && window.VELARIS_RESOURCES) {
    rg.innerHTML = window.VELARIS_RESOURCES.map(function (r) {
      var free = /free/i.test(r.price);
      return '<a class="res-card' + (r.featured ? ' feat' : '') + '" href="about.html#contact">' + '<div class="res-thumb" style="background:linear-gradient(180deg,rgba(2,16,31,.18),rgba(2,16,31,.66)),url(' + uns(r.img, 700) + ') center/cover">' + '<span class="res-type">' + r.type + '</span>' + '<span class="res-price' + (free ? ' free' : '') + '">' + r.price + '</span></div>' + '<div class="res-body"><span class="res-cat">' + r.cat + '</span>' + '<h3>' + r.title + '</h3><p>' + r.desc + '</p>' + '<span class="res-cta">' + r.cta + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div></a>';
    }).join('');
  }

  /* ===== BLOG LISTING ===== */
  var bl = document.getElementById('blogListing');
  if (bl && window.VELARIS_POSTS) {
    var posts = window.VELARIS_POSTS,
      PAGE = 9,
      shown = PAGE,
      filter = 'All';
    // featured (first two)
    var fw = document.getElementById('blogFeatured');
    if (fw) fw.innerHTML = posts.slice(0, 2).map(function (p) {
      return '<a class="feat-post" href="post.html?slug=' + p.slug + '"><div class="thumb" style="' + thumb(p, 900) + '"><span class="topic">' + p.cat + '</span></div>' + '<div class="fb"><div class="tags"><span class="cat">' + p.cat + '</span><span>' + p.date + '</span><span>' + p.read + ' min read</span></div>' + '<h3>' + p.title + '</h3><p>' + p.excerpt + '</p><span class="more">Read more ' + ARROW + '</span></div></a>';
    }).join('');
    var cats = ['All'].concat(Object.keys(posts.reduce(function (a, p) {
      a[p.cat] = 1;
      return a;
    }, {})));
    var fbar = document.getElementById('blogFilters');
    var grid = document.getElementById('blogGrid');
    var countEl = document.getElementById('blogCount');
    var moreBtn = document.getElementById('blogMore');
    cats.forEach(function (cat) {
      var b = document.createElement('button');
      b.className = 'chip' + (cat === 'All' ? ' on' : '');
      b.textContent = cat;
      b.addEventListener('click', function () {
        filter = cat;
        shown = PAGE;
        fbar.querySelectorAll('.chip').forEach(function (x) {
          x.classList.remove('on');
        });
        b.classList.add('on');
        render();
      });
      fbar.appendChild(b);
    });
    function listFor() {
      return filter === 'All' ? posts : posts.filter(function (p) {
        return p.cat === filter;
      });
    }
    function render() {
      var data = listFor(),
        slice = data.slice(0, shown);
      grid.innerHTML = slice.map(function (p) {
        return '<a class="pcard" href="post.html?slug=' + p.slug + '"><div class="thumb" style="' + thumb(p) + '"><span class="topic">' + p.cat + '</span></div>' + '<div class="pb"><div class="tags"><span class="cat">' + p.cat + '</span><span>' + p.read + ' min</span></div>' + '<h3>' + p.title + '</h3><p>' + p.excerpt + '</p><span class="more">Read more ' + ARROW + '</span></div></a>';
      }).join('');
      countEl.textContent = 'Showing ' + slice.length + ' of ' + data.length + ' articles (' + posts.length + ' in the CMS)';
      moreBtn.style.display = shown < data.length ? '' : 'none';
    }
    moreBtn.addEventListener('click', function () {
      shown += PAGE;
      render();
    });
    render();
  }

  /* ===== POST DETAIL ===== */
  var pd = document.getElementById('postDetail');
  if (pd && window.VELARIS_POSTS) {
    var P = window.VELARIS_POSTS,
      pi = Math.max(0, P.map(function (x) {
        return x.slug;
      }).indexOf(qs('slug'))),
      post = P[pi];
    document.title = post.title + ' — Velaris Web';
    var md3 = document.querySelector('meta[name="description"]');
    if (md3) md3.setAttribute('content', post.excerpt);
    pd.querySelector('[data-crumb]').textContent = post.cat;
    pd.querySelector('[data-cat]').textContent = post.cat;
    pd.querySelector('[data-date]').textContent = post.date;
    pd.querySelector('[data-read]').textContent = post.read + ' min read';
    pd.querySelector('[data-title]').textContent = post.title;
    pd.querySelector('[data-cover]').style.cssText = thumb(post, 1400);
    pd.querySelector('[data-topic]').textContent = post.cat;
    pd.querySelector('[data-body]').innerHTML = post.body;
    // related: same category
    var rel = P.filter(function (x) {
      return x.cat === post.cat && x.slug !== post.slug;
    }).slice(0, 3);
    if (rel.length < 3) rel = rel.concat(P.filter(function (x) {
      return x.slug !== post.slug && rel.indexOf(x) < 0;
    }).slice(0, 3 - rel.length));
    var rw = pd.querySelector('[data-related]');
    if (rw) rw.innerHTML = rel.map(function (p) {
      return '<a class="pcard" href="post.html?slug=' + p.slug + '"><div class="thumb" style="' + thumb(p) + '"><span class="topic">' + p.cat + '</span></div>' + '<div class="pb"><div class="tags"><span class="cat">' + p.cat + '</span><span>' + p.read + ' min</span></div>' + '<h3>' + p.title + '</h3><p>' + p.excerpt + '</p><span class="more">Read more ' + ARROW + '</span></div></a>';
    }).join('');
  }

  /* reveal */
  var revObs = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revObs.unobserve(en.target);
      }
    });
  }, {
    threshold: .1
  });
  document.querySelectorAll('.reveal').forEach(function (el) {
    revObs.observe(el);
  });

  /* FAQ accordion (pricing / service pages reuse) */
  document.querySelectorAll('[data-faq]').forEach(function (list) {
    if (!window.VELARIS_FAQS) return;
    list.innerHTML = window.VELARIS_FAQS.slice(0, +(list.getAttribute('data-faq') || 6)).map(function (f) {
      return '<div class="faq-item"><button class="faq-q">' + f.q + '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="faq-a"><p>' + f.a + '</p></div></div>';
    }).join('');
    list.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q'),
        a = item.querySelector('.faq-a');
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        list.querySelectorAll('.faq-item.open').forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = '0';
        });
        if (!open) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  });

  /* PRICING + PROCESS render */
  var pg = document.getElementById('priceGrid');
  if (pg && window.VELARIS_PRICING) {
    pg.innerHTML = window.VELARIS_PRICING.map(function (p) {
      var feats = p.feats.map(function (f) {
        return '<li>' + CHECK + f + '</li>';
      }).join('');
      return '<div class="price-card' + (p.feat ? ' feat' : '') + '">' + (p.feat ? '<span class="price-badge">Most popular</span>' : '') + '<span class="price-tag">' + p.name + '</span>' + '<div class="price-amt"><b>' + p.price + '</b><span>' + p.per + '</span></div>' + '<p class="tl">' + p.tagline + '</p>' + '<ul class="price-feats">' + feats + '</ul>' + '<a class="btn ' + (p.feat ? 'btn-teal' : 'btn-dark') + '" data-inquiry href="#start">' + p.cta + '</a></div>';
    }).join('');
  }
  /* individual service pricing */
  var spg = document.getElementById('servicePricing');
  if (spg && window.VELARIS_SERVICE_PRICING) {
    spg.innerHTML = window.VELARIS_SERVICE_PRICING.map(function (p) {
      return '<a class="sprice" href="service.html?s=' + p.slug + '">' + '<span class="sp-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + (IC[p.icon] || '') + '</svg></span>' + '<div class="sp-body"><b>' + p.name + '</b><span>' + p.note + '</span></div>' + '<div class="sp-price">' + p.price + '</div></a>';
    }).join('');
  }
  var pr = document.getElementById('procRail');
  if (pr && window.VELARIS_PROCESS) {
    pr.innerHTML = window.VELARIS_PROCESS.map(function (p) {
      var tags = p.tags.map(function (t) {
        return '<span>' + t + '</span>';
      }).join('');
      return '<div class="proc-row reveal"><div class="proc-n">' + p.n + '</div>' + '<div class="proc-mid"><h3>' + p.title + '</h3><p>' + p.desc + '</p><div class="tags">' + tags + '</div></div>' + '<div class="proc-out"><small>Output</small>' + p.out + '</div></div>';
    }).join('');
    pr.querySelectorAll('.reveal').forEach(function (el) {
      revObs.observe(el);
    });
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/pages.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Velaris Web UI Kit — shared primitives. Exposes components on window.
const ICON_BASE = '../../assets/icons';
const _iconCache = {};
function Icon({
  name,
  size = 16,
  color,
  style,
  className
}) {
  const [svg, setSvg] = React.useState(_iconCache[name] || null);
  React.useEffect(() => {
    let on = true;
    if (_iconCache[name]) {
      setSvg(_iconCache[name]);
      return;
    }
    fetch(ICON_BASE + '/' + name + '.svg').then(r => r.text()).then(t => {
      t = t.replace('<svg', '<svg fill="currentColor"').replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '');
      _iconCache[name] = t;
      if (on) setSvg(t);
    }).catch(() => {});
    return () => {
      on = false;
    };
  }, [name]);
  return /*#__PURE__*/React.createElement("span", {
    className: 'vicon' + (className ? ' ' + className : ''),
    style: {
      width: size,
      height: size,
      color,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: svg || ''
    }
  });
}
function Button({
  variant = 'default',
  size,
  block,
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}) {
  const cls = ['btn', 'btn-' + variant, size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '', block ? 'btn-block' : '', !children ? 'btn-icon' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size === 'lg' ? 16 : 14
  }), children, iconRight && /*#__PURE__*/React.createElement(Icon, {
    name: iconRight,
    size: 14
  }));
}
function Tag({
  tone = 'neutral',
  pill,
  dot,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: 'tag tag-' + tone + (pill ? ' tag-pill' : '')
  }, dot && /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: 'currentColor'
    }
  }), children);
}
function Avatar({
  name = '',
  src,
  size = 32,
  color
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: size,
      height: size,
      fontSize: size * 0.4,
      background: color
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "field"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "field-label"
  }, label), children);
}
function Input({
  icon,
  suffix,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "input"
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15
  }), /*#__PURE__*/React.createElement("input", rest), suffix);
}

// Velaris logo mark — the real app-icon tile (teal/navy gradient, V + star).
function VelarisMark({
  size = 32,
  radius
}) {
  const r = radius != null ? radius : Math.round(size * 0.26);
  return /*#__PURE__*/React.createElement("img", {
    src: "../../assets/velaris-app-icon.jpg",
    alt: "Velaris",
    width: size,
    height: size,
    style: {
      display: 'block',
      borderRadius: r,
      flex: 'none'
    }
  });
}
function Logo({
  size = 30,
  color = 'var(--text-primary)',
  word = 'Velaris'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(VelarisMark, {
    size: size
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: size * 0.6,
      letterSpacing: '0.01em',
      color,
      lineHeight: 1,
      whiteSpace: 'nowrap'
    }
  }, word));
}
Object.assign(window, {
  Icon,
  Button,
  Tag,
  Avatar,
  Field,
  Input,
  VelarisMark,
  Logo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/screens.jsx
try { (() => {
// Velaris Web UI Kit — screens

function StatCard({
  icon,
  label,
  value,
  delta,
  dir
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15,
    style: {
      color: 'var(--teal-6)'
    }
  }), label), /*#__PURE__*/React.createElement("div", {
    className: "stat-value"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: 'stat-delta ' + (dir === 'down' ? 'down' : 'up')
  }, dir === 'down' ? '▼' : '▲', " ", delta, " ", /*#__PURE__*/React.createElement("span", {
    className: "dim",
    style: {
      fontWeight: 400
    }
  }, "vs last week")));
}
function MiniBars({
  data,
  color = 'var(--teal-6)',
  soft = 'var(--teal-2)'
}) {
  const max = Math.max(...data);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 5,
      height: 64
    }
  }, data.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: v / max * 100 + '%',
      borderRadius: '3px 3px 0 0',
      background: i === data.length - 1 ? color : soft
    }
  })));
}
function StatusTag({
  status
}) {
  const s = STATUS_MAP[status];
  return /*#__PURE__*/React.createElement(Tag, {
    tone: s.tone,
    pill: true
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: s.dot
    }
  }), s.label);
}
function ProjectRow({
  p,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("tr", {
    onClick: () => onOpen && onOpen(p),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 8,
      background: 'var(--teal-1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "global",
    size: 17,
    style: {
      color: 'var(--teal-7)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, p.domain)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusTag, {
    status: p.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, p.framework), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      color: 'var(--text-primary)'
    }
  }, p.visitors), /*#__PURE__*/React.createElement("td", {
    className: "row-sub"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, p.branch), " \xB7 ", p.deploy), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ellipsis",
    size: 18,
    style: {
      color: 'var(--text-tertiary)'
    }
  })));
}
function Dashboard({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fadeup",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-stats"
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "global",
    label: "Visitors",
    value: "296k",
    delta: "12.4%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "rocket",
    label: "Deploys",
    value: "184",
    delta: "8.1%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "thunderbolt",
    label: "Avg build",
    value: "42s",
    delta: "5.0%",
    dir: "down"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "safety",
    label: "Uptime",
    value: "99.98%",
    delta: "0.02%"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      gridTemplateColumns: '1.6fr 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px 0'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title",
    style: {
      margin: 0
    }
  }, "Recent projects"), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 13,
      color: 'var(--teal-6)',
      cursor: 'pointer',
      fontWeight: 500
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Project"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Framework"), /*#__PURE__*/React.createElement("th", null, "Visitors"), /*#__PURE__*/React.createElement("th", null, "Last deploy"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, PROJECTS.slice(0, 4).map(p => /*#__PURE__*/React.createElement(ProjectRow, {
    key: p.id,
    p: p,
    onOpen: onOpen
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title"
  }, "Activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 11,
      padding: '9px 0',
      borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border-secondary)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: a.tone === 'error' ? 'var(--color-error-bg)' : a.tone === 'success' ? 'var(--color-success-bg)' : 'var(--teal-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 15,
    style: {
      color: a.tone === 'error' ? 'var(--color-error)' : a.tone === 'success' ? 'var(--color-success-active)' : 'var(--teal-7)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, a.who), " ", /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, a.action), " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--teal-7)'
    }
  }, a.target)), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, a.meta, " \xB7 ", a.time, " ago"))))))));
}
function Projects({
  onOpen,
  onNew,
  query
}) {
  const list = PROJECTS.filter(p => !query || (p.name + p.domain + p.framework).toLowerCase().includes(query.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "fadeup"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, list.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "card card-pad card-hoverable",
    onClick: () => onOpen(p)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: 'var(--teal-1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "global",
    size: 20,
    style: {
      color: 'var(--teal-7)'
    }
  })), /*#__PURE__*/React.createElement(StatusTag, {
    status: p.status
  })), /*#__PURE__*/React.createElement("div", {
    className: "row-main",
    style: {
      fontSize: 15,
      marginTop: 14
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, p.domain), /*#__PURE__*/React.createElement("hr", {
    className: "divider",
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, p.framework), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-primary)'
    }
  }, p.visitors), " visitors")), /*#__PURE__*/React.createElement("div", {
    className: "row-sub",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sync",
    size: 12,
    style: {
      verticalAlign: '-2px',
      color: 'var(--text-tertiary)'
    }
  }), " ", p.branch, " \xB7 ", p.deploy))), /*#__PURE__*/React.createElement("button", {
    className: "card card-pad new-tile",
    onClick: onNew
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 22,
    style: {
      color: 'var(--teal-6)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "New project"), /*#__PURE__*/React.createElement("span", {
    className: "row-sub",
    style: {
      fontWeight: 400
    }
  }, "Import a repo or start fresh"))));
}
function Analytics() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const traffic = [62, 48, 75, 90, 84, 40, 55];
  const max = Math.max(...traffic);
  return /*#__PURE__*/React.createElement("div", {
    className: "fadeup",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-stats"
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "global",
    label: "Page views",
    value: "1.24M",
    delta: "9.2%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "user",
    label: "Unique visitors",
    value: "296k",
    delta: "12.4%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "clock",
    label: "Avg session",
    value: "3m 12s",
    delta: "4.1%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "line-chart",
    label: "Bounce rate",
    value: "38.2%",
    delta: "2.3%",
    dir: "down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title",
    style: {
      margin: 0
    }
  }, "Traffic \u2014 last 7 days"), /*#__PURE__*/React.createElement("div", {
    className: "seg-inline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "on"
  }, "Week"), /*#__PURE__*/React.createElement("span", null, "Month"), /*#__PURE__*/React.createElement("span", null, "Year"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 18,
      height: 200,
      paddingTop: 10
    }
  }, traffic.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 9,
      height: '100%',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 54,
      height: v / max * 100 + '%',
      borderRadius: '6px 6px 0 0',
      background: i === 3 ? 'var(--brand-gradient)' : 'var(--teal-2)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "row-sub"
  }, days[i]))))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title"
  }, "Top pages"), [['/', '42%'], ['/pricing', '18%'], ['/docs', '15%'], ['/blog/launch', '11%'], ['/changelog', '7%']].map(([p, pct], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '9px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 13,
      width: 130,
      color: 'var(--text-primary)'
    }
  }, p), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      background: 'var(--fill-tertiary)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct,
      height: '100%',
      background: 'var(--teal-6)',
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "row-sub",
    style: {
      width: 38,
      textAlign: 'right'
    }
  }, pct)))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title"
  }, "Visitors by country"), [['United States', '58k', '#2A8F94'], ['Germany', '31k', '#41A8AC'], ['India', '27k', '#6AC1C4'], ['Brazil', '18k', '#9BD7D9'], ['Japan', '12k', '#C5E8E9']].map(([c, n, col], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '10px 0',
      borderBottom: i < 4 ? '1px solid var(--border-secondary)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: col
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14
    }
  }, c), /*#__PURE__*/React.createElement("span", {
    className: "mono row-sub",
    style: {
      color: 'var(--text-primary)'
    }
  }, n))))));
}
function Team({
  onInvite
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fadeup"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title",
    style: {
      margin: 0
    }
  }, "Members"), /*#__PURE__*/React.createElement("span", {
    className: "row-sub"
  }, TEAM.length, " people in this workspace")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "user",
    onClick: onInvite
  }, "Invite member")), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Member"), /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, TEAM.map((m, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: m.name,
    size: 34,
    color: ['var(--teal-7)', 'var(--teal-6)', 'var(--teal-8)', '#1A2940', 'var(--teal-5)'][i % 5]
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, m.email)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Tag, {
    tone: m.role === 'Owner' ? 'teal' : 'neutral'
  }, m.role)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 13,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 50,
      background: m.status === 'online' ? '#52C41A' : m.status === 'away' ? '#FAAD14' : 'var(--text-quaternary)'
    }
  }), m.status[0].toUpperCase() + m.status.slice(1))), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "text",
    size: "sm"
  }, "Manage"))))))));
}
function Settings() {
  return /*#__PURE__*/React.createElement("div", {
    className: "fadeup",
    style: {
      maxWidth: 640,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title"
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Maya Okonkwo",
    size: 56,
    color: "var(--teal-7)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    size: "sm",
    icon: "upload"
  }, "Change photo"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub",
    style: {
      marginTop: 6
    }
  }, "JPG or PNG, up to 2 MB"))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "Maya Okonkwo"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "maya@velaris.io",
    icon: "mail"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "page-section-title"
  }, "Workspace"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Workspace name"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "Velaris"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Primary domain"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "velaris.io",
    icon: "global"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 18,
      padding: '14px 0 0',
      borderTop: '1px solid var(--border-secondary)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row-main",
    style: {
      fontSize: 14
    }
  }, "Production deploy protection"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, "Require approval before deploying to production")), /*#__PURE__*/React.createElement(Toggle, {
    defaultOn: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "text"
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Save changes")));
}
function Toggle({
  defaultOn
}) {
  const [on, setOn] = React.useState(!!defaultOn);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => setOn(!on),
    className: "vtoggle",
    "data-on": on,
    style: {
      width: 44,
      height: 24,
      borderRadius: 999,
      border: 0,
      cursor: 'pointer',
      padding: 2,
      background: on ? 'var(--teal-6)' : 'var(--gray-5)',
      transition: 'background .2s',
      display: 'inline-flex',
      justifyContent: on ? 'flex-end' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 50,
      background: '#fff',
      display: 'block',
      boxShadow: '0 1px 2px rgba(0,0,0,.2)'
    }
  }));
}
Object.assign(window, {
  Dashboard,
  Projects,
  Analytics,
  Team,
  Settings,
  Toggle,
  StatusTag
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/service-data.js
try { (() => {
/* ============================================================================
   VELARIS WEB — SERVICE PAGE CMS DATA
   ----------------------------------------------------------------------------
   Drives the rich, musemind-structured service.html template. Everything here
   is content-only so the template scales: add/extend a service by editing data,
   never markup.

   PER-SERVICE (keyed by VELARIS_SERVICES slug):
     VELARIS_SVC_PROCESS  — 4 numbered steps, each with a checklist of points
     VELARIS_SVC_CAPS     — "what's included" capability cards [title, desc]
     VELARIS_SVC_MEDIA    — hero/visual Unsplash photo id

   GLOBAL (shared across every service page — edit once):
     VELARIS_SVC_BENEFITS — "why it works" benefit list
     VELARIS_INDUSTRIES   — industries we serve
     VELARIS_WHYUS        — why founders choose Velaris

   Any per-service map falls back to its `_default` entry, so a brand-new
   service renders a complete page even before bespoke content is written.
   ========================================================================== */

/* ---- PROCESS (per service · 4 steps, musemind-style with checklists) ---- */
window.VELARIS_SVC_PROCESS = {
  _default: [{
    t: "Discovery &amp; strategy",
    d: "We learn your business, audience and goals to define the strategy behind the work.",
    points: ["Goals &amp; success metrics", "Audience research", "Competitor benchmarking", "Scope &amp; milestones"]
  }, {
    t: "Design &amp; plan",
    d: "We shape the approach around your customer journey and agree the direction with you.",
    points: ["Structure &amp; direction", "Concepts for review", "Conversion focus", "Sign-off"]
  }, {
    t: "Build &amp; refine",
    d: "We craft and ship the work, keeping you updated and reviewing at every milestone.",
    points: ["Production build", "Responsive &amp; tested", "SEO foundations", "Quality review"]
  }, {
    t: "Launch &amp; grow",
    d: "We launch carefully, measure results and keep optimising month after month.",
    points: ["Safe launch", "Analytics &amp; tracking", "Iteration", "Ongoing support"]
  }],
  "brand-identity": [{
    t: "Discovery &amp; brand strategy",
    d: "We learn your business, audience and competitors to define a positioning that makes you the obvious choice.",
    points: ["Brand audit", "Audience &amp; market research", "Competitor benchmarking", "Positioning &amp; messaging"]
  }, {
    t: "Concept &amp; direction",
    d: "We explore distinct visual directions and agree the one that best fits your story.",
    points: ["Moodboards &amp; direction", "Logo concepts", "Type &amp; colour exploration", "Direction sign-off"]
  }, {
    t: "Identity design",
    d: "We craft the full identity system — logo, colour, type and the assets you'll use everywhere.",
    points: ["Logo suite", "Colour &amp; type system", "Brand voice", "Marketing templates"]
  }, {
    t: "Guidelines &amp; handover",
    d: "We package everything into clear guidelines so your brand stays consistent as you grow.",
    points: ["Brand guidelines", "Asset export kit", "Usage rules", "Handover walkthrough"]
  }],
  "conversion-uiux": [{
    t: "Discovery &amp; UX strategy",
    d: "We map your customer journey, goals and competitors to define the strategy behind every screen.",
    points: ["Goals &amp; KPIs", "User journeys", "Competitor teardown", "Conversion strategy"]
  }, {
    t: "Wireframes &amp; prototyping",
    d: "We structure each page around how people actually decide — tested before a pixel of polish.",
    points: ["Information architecture", "Low-fi wireframes", "Interactive prototype", "Usability review"]
  }, {
    t: "High-fidelity design",
    d: "We design conversion-focused, on-brand screens with copy that guides visitors to act.",
    points: ["Visual design", "Conversion copywriting", "Trust &amp; social proof", "Design system"]
  }, {
    t: "Test &amp; handover",
    d: "We validate the design, refine the weak points and hand over a build-ready system.",
    points: ["Usability testing", "A/B-ready variants", "Dev-ready handoff", "Iteration plan"]
  }],
  "custom-development": [{
    t: "Architecture &amp; planning",
    d: "We plan a clean, scalable architecture and choose the tech that fits your goals and budget.",
    points: ["Stack &amp; approach", "Content model", "Performance budget", "SEO foundations"]
  }, {
    t: "Build &amp; integrate",
    d: "We hand-write fast, semantic code and wire up the tools your business runs on.",
    points: ["Custom front-end", "CMS integration", "Forms &amp; analytics", "Third-party tools"]
  }, {
    t: "Optimise &amp; test",
    d: "We tune Core Web Vitals and test across every device until it's flawless.",
    points: ["Core Web Vitals", "Cross-device QA", "Accessibility checks", "Speed tuning"]
  }, {
    t: "Launch &amp; support",
    d: "We ship safely with redirects and monitoring, then keep the site healthy.",
    points: ["Safe launch &amp; redirects", "Monitoring", "Documentation", "Ongoing support"]
  }],
  "webflow-development": [{
    t: "Plan &amp; structure",
    d: "We map your CMS collections and page structure so the site is easy to manage and scale.",
    points: ["CMS planning", "Sitemap", "Collection schema", "SEO setup"]
  }, {
    t: "Design in Webflow",
    d: "We build a custom, designer-grade Webflow site — not a marketplace template.",
    points: ["Custom design build", "Responsive layouts", "Interactions &amp; motion", "Component classes"]
  }, {
    t: "CMS &amp; integrations",
    d: "We wire up blog, cases and services as editable collections plus your tools.",
    points: ["CMS collections", "Forms &amp; integrations", "Search &amp; filtering", "On-page SEO"]
  }, {
    t: "Train &amp; launch",
    d: "We launch, then train your team so you can publish without a developer.",
    points: ["Editor training", "Launch &amp; hosting", "Documentation", "Handover"]
  }],
  "framer-development": [{
    t: "Plan &amp; motion strategy",
    d: "We define the structure and the motion language that makes your launch feel premium.",
    points: ["Sitemap", "Motion direction", "Content model", "SEO plan"]
  }, {
    t: "Design &amp; animate",
    d: "We craft a striking, animated Framer site built to launch fast.",
    points: ["Custom design", "Advanced interactions", "Responsive build", "Component system"]
  }, {
    t: "CMS &amp; polish",
    d: "We add editable CMS content and refine every transition.",
    points: ["CMS collections", "Interaction polish", "Performance pass", "On-page SEO"]
  }, {
    t: "Launch &amp; handover",
    d: "We ship quickly and hand over an editable, animated site.",
    points: ["Launch &amp; hosting", "Editor training", "Documentation", "Handover"]
  }],
  "ai-web-development": [{
    t: "Discovery &amp; AI scoping",
    d: "We define where AI accelerates the build and where an on-site assistant adds value.",
    points: ["Goals &amp; use-cases", "Assistant scope", "Content model", "SEO plan"]
  }, {
    t: "AI-accelerated build",
    d: "We use Claude across design and build to ship faster, with human review at every step.",
    points: ["AI-assisted design", "Rapid front-end build", "Human QA", "Brand consistency"]
  }, {
    t: "Assistant &amp; automation",
    d: "We add an optional assistant that qualifies leads and answers questions 24/7.",
    points: ["On-site AI chat", "Lead qualification", "Routing &amp; handoff", "Guardrails &amp; tone"]
  }, {
    t: "Launch &amp; optimise",
    d: "We launch, monitor the assistant and keep improving its answers.",
    points: ["Safe launch", "Monitoring", "Answer tuning", "Ongoing support"]
  }],
  "seo-optimization": [{
    t: "Audit &amp; research",
    d: "We audit your site health and map the high-intent keywords your customers search.",
    points: ["Technical audit", "Keyword research", "Competitor analysis", "Local SEO audit"]
  }, {
    t: "On-page &amp; technical",
    d: "We fix the foundations and optimise every page to rank and convert.",
    points: ["Technical fixes", "On-page optimisation", "Structured data", "Site speed"]
  }, {
    t: "Content &amp; local",
    d: "We build content and local signals that target buyers ready to act.",
    points: ["Content that ranks", "Google Business Profile", "Local citations", "Internal linking"]
  }, {
    t: "Report &amp; iterate",
    d: "We track rankings and double down on what's driving traffic and leads.",
    points: ["Rank tracking", "Monthly reporting", "Iteration", "Growth roadmap"]
  }],
  "cold-email-marketing": [{
    t: "Setup &amp; deliverability",
    d: "We warm domains and configure infrastructure so your email lands in the inbox.",
    points: ["Domain warm-up", "SPF / DKIM / DMARC", "Inbox placement", "Sending limits"]
  }, {
    t: "Targeting &amp; lists",
    d: "We build accurate, targeted prospect lists that match your ideal customer.",
    points: ["ICP definition", "List building", "Verification", "Segmentation"]
  }, {
    t: "Copy &amp; sequences",
    d: "We write high-reply copy and multi-step sequences that start conversations.",
    points: ["Cold email copy", "Follow-up sequences", "A/B testing", "Personalisation"]
  }, {
    t: "Run &amp; report",
    d: "We manage sending, handle replies and report on booked meetings.",
    points: ["Campaign management", "Reply handling", "Reporting", "Optimisation"]
  }]
};

/* ---- CAPABILITIES (per service · "what's included" cards [title, desc]) ---- */
window.VELARIS_SVC_CAPS = {
  _default: [["Strategy &amp; planning", "A clear plan scoped to your goals before any work begins."], ["Design &amp; build", "Considered, on-brand execution at every step."], ["Conversion focus", "Every decision aimed at turning visitors into leads."], ["SEO foundations", "Built to be found by the customers you want."], ["Testing &amp; QA", "Refined and tested until it's right."], ["Handover &amp; support", "Documented, editable and supported after launch."]],
  "brand-identity": [["Logo &amp; visual identity", "A primary logo, variations and marks designed to work everywhere from favicon to billboard."], ["Colour &amp; typography system", "A flexible palette and type scale that keeps every touchpoint unmistakably you."], ["Brand voice &amp; messaging", "Clear positioning, tagline and tone so your words sound as considered as your visuals."], ["Brand guidelines", "A practical rulebook your team and partners can follow to stay on-brand."], ["Marketing templates", "Ready-to-use social, slide and document templates so launch day is effortless."], ["Asset handover kit", "Every file, format and export organised and ready for web, print and social."]],
  "conversion-uiux": [["UX strategy &amp; journeys", "Every page mapped to a real customer decision, not a template."], ["Wireframes to hi-fi", "From low-fidelity structure to pixel-perfect, on-brand screens."], ["Conversion copywriting", "Headlines and CTAs written to build trust and drive action."], ["Trust &amp; social proof", "Reviews, logos and proof placed exactly where doubt creeps in."], ["Design system &amp; components", "A reusable component library so the site stays consistent as it grows."], ["Usability &amp; conversion testing", "We test with real users and refine what isn't converting."]],
  "custom-development": [["Custom front-end build", "Hand-coded, semantic markup with zero template bloat slowing you down."], ["Core Web Vitals tuning", "Engineered to pass Google's performance metrics and load in under a second."], ["Fully responsive", "Pixel-tested across phones, tablets and desktops, not just resized."], ["Technical SEO foundations", "Clean markup, structured data and speed that search engines reward."], ["CMS-ready structure", "A content model your team can edit without breaking the design."], ["Analytics &amp; tracking", "Conversion and event tracking wired in from day one."]],
  "webflow-development": [["Custom Webflow build", "A bespoke design built properly in Webflow — fast, clean and yours."], ["CMS collections", "Blog, case studies and services as collections you edit yourself."], ["Interactions &amp; animation", "Tasteful motion that adds polish without hurting performance."], ["On-page &amp; technical SEO", "Meta, structured data and speed configured to rank from launch."], ["Editor training", "A walkthrough so your team can publish confidently, no code needed."], ["Hosting &amp; launch support", "We handle domains, hosting and a smooth go-live."]],
  "framer-development": [["Custom Framer build", "A beautiful, motion-rich site built fast without sacrificing polish."], ["Advanced interactions", "Scroll, hover and page transitions that feel genuinely premium."], ["CMS for blog &amp; cases", "Editable collections so content stays fresh after launch."], ["Responsive across devices", "Smooth and fast on every screen size, not just desktop."], ["SEO &amp; performance setup", "Configured to load quickly and rank from day one."], ["Editor training &amp; handover", "You leave able to edit and grow the site yourself."]],
  "ai-web-development": [["AI-accelerated build", "Claude across our process ships your site up to 2× faster, quality intact."], ["On-site AI assistant", "An optional chat assistant that answers questions around the clock."], ["Lead qualification &amp; routing", "The assistant qualifies enquiries and routes them to you instantly."], ["AI-assisted SEO content", "Drafts and outlines generated fast, then refined by humans to rank."], ["Faster turnaround", "Compressed timelines without the corner-cutting."], ["Human-reviewed quality", "Every AI output is checked by a designer before it ships."]],
  "seo-optimization": [["Local SEO &amp; GBP", "Map-pack rankings and an optimised Google Business Profile that wins clicks."], ["Technical SEO &amp; health", "A fast, crawlable, error-free site search engines trust."], ["Keyword research &amp; mapping", "The exact high-intent terms your customers search, mapped to pages."], ["On-page optimisation", "Titles, meta, headings and structure tuned to rank."], ["Content that ranks", "Articles engineered around real search intent, not filler."], ["Monthly reporting", "Clear reports on rankings, traffic and the leads they drive."]],
  "cold-email-marketing": [["Deliverability setup", "Domain warm-up and authentication so you land in the inbox, not spam."], ["Targeted prospect lists", "Accurate, verified lists matched to your ideal customer profile."], ["High-reply copy", "Cold email written to start genuine conversations, not get deleted."], ["Nurture sequences", "Multi-step follow-ups that turn interest into booked calls."], ["List segmentation", "The right message to the right segment at the right time."], ["Reply handling &amp; reporting", "We manage responses and report on meetings booked."]]
};

/* ---- HERO / VISUAL MEDIA (per service · Unsplash photo id) ---- */
window.VELARIS_SVC_MEDIA = {
  _default: "photo-1467232004584-a241de8bcf5d",
  "brand-identity": "photo-1626785774573-4b799315345d",
  "conversion-uiux": "photo-1467232004584-a241de8bcf5d",
  "custom-development": "photo-1461749280684-dccba630e2f6",
  "webflow-development": "photo-1547658719-da2b51169166",
  "framer-development": "photo-1517077304055-6e89abbf09b0",
  "ai-web-development": "photo-1620712943543-bcc4688e7485",
  "seo-optimization": "photo-1460925895917-afdab827c52f",
  "cold-email-marketing": "photo-1596526131083-e8c633c948d2"
};

/* ---- BENEFITS (global · "why it works") ---- */
window.VELARIS_SVC_BENEFITS = [{
  t: "Built to convert, not just look good",
  d: "Every decision is made to turn visitors into qualified leads — design with a commercial job to do.",
  points: ["Conversion-led design", "Trust signals built in", "Clear calls to action", "Measurable results"]
}, {
  t: "A partner across the whole funnel",
  d: "From brand and site to SEO and outreach, it's one team owning the path from stranger to booked call.",
  points: ["Brand to leads in-house", "Joined-up strategy", "One point of contact", "No finger-pointing"]
}, {
  t: "A founder-friendly process",
  d: "Clear milestones, plain English and regular updates — you always know exactly what's happening.",
  points: ["Clear timelines", "Regular check-ins", "No jargon", "You stay in control"]
}, {
  t: "Built to scale with you",
  d: "CMS-ready, well-documented work you can edit and grow long after launch day.",
  points: ["CMS-ready foundations", "Documented handover", "Easy to edit", "Ongoing support available"]
}];

/* ---- INDUSTRIES (global) ---- */
window.VELARIS_INDUSTRIES = [{
  name: "Healthcare &amp; clinics",
  desc: "Booking-focused sites that build trust and fill the calendar."
}, {
  name: "Property &amp; lettings",
  desc: "Modern, credible sites for agents, landlords and developers."
}, {
  name: "Professional services",
  desc: "Authority-building sites for firms that sell expertise."
}, {
  name: "B2B &amp; SaaS",
  desc: "Clear narratives that turn complex products into demos."
}, {
  name: "Finance &amp; investment",
  desc: "Institutional-grade presence that signals credibility."
}, {
  name: "Local &amp; service business",
  desc: "Local-SEO-led sites that get you found and booked."
}];

/* ---- WHY VELARIS (global) ---- */
window.VELARIS_WHYUS = [{
  t: "Conversion-obsessed",
  d: "We design for booked calls and qualified leads, not vanity metrics."
}, {
  t: "Full-funnel team",
  d: "Brand, design, build, SEO and outreach under one roof."
}, {
  t: "Built to rank",
  d: "Technical and local SEO engineered in from the first line."
}, {
  t: "Fast, premium builds",
  d: "Custom, Webflow or Framer — shipped quickly without cutting quality."
}, {
  t: "Truly yours",
  d: "CMS-ready, documented work you fully own and can edit."
}, {
  t: "Real partnership",
  d: "Clear communication and support that continues after launch."
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/service-data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/site.js
try { (() => {
/* ============================================================================
   VELARIS WEB — shared site chrome (nav + drawer + footer) for every page.
   Include AFTER home-data.js. Pages mark active item via <body data-page="…">.
   ========================================================================== */
(function () {
  'use strict';

  var base = document.body.getAttribute('data-base') || '';
  var page = document.body.getAttribute('data-page') || '';

  /* gradient logo mark (from brand SVG) */
  var MARK = '<svg class="mk" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">' + '<rect width="32" height="32" rx="4.57" fill="url(#vlg)"></rect>' + '<path d="M16.81 23.58c-.02.12-.05.23-.1.34-.45.96-.83 1.95-1.21 2.94-.03.07-.04.16-.13.18-.11.02-.14-.08-.18-.14-1.8-2.39-3.6-4.78-5.4-7.17-1.64-2.18-3.27-4.37-4.9-6.56l-1.91-2.57c-.02-.02-.04-.05-.06-.08-.03-.05-.09-.09-.05-.15.03-.05.1-.02.15-.01.47.07.95.13 1.42.22 1.04.2 2.06.5 3.05.88 1.36.54 2.39 1.43 3.16 2.68 1.04 1.69 2.14 3.33 3.23 4.99.94 1.42 1.88 2.83 2.82 4.25.05.07.1.13.11.21z" fill="white"></path>' + '<path d="M25.79 10.7c-.07.11-.1.12-.16.18-2.2 2.09-4.12 4.45-5.73 7.03-.84 1.35-1.62 2.74-2.34 4.16-.11.22-.14.22-.28.02-.65-.99-1.31-1.97-1.96-2.96-.2-.3-.19-.3.06-.57.92-.99 1.88-1.95 2.9-2.85 1.44-1.28 2.96-2.45 4.6-3.48.81-.52 1.66-.99 2.52-1.42.22-.11.27-.11.39-.12z" fill="white"></path>' + '<path d="M21.93 11.83c-.21.12-.37.22-.54.31-1.36.77-2.58 1.73-3.75 2.76-1.04.92-2.01 1.91-2.92 2.96-.13.15-.18.15-.3 0-.37-.5-.7-1.03-1.02-1.56-.09-.15-.06-.23.07-.33 1.88-1.4 3.92-2.51 6.08-3.4.68-.28 1.39-.54 2.1-.74.07-.02.15-.05.27 0z" fill="white"></path>' + '<path d="M27.36 7.36c-.02.06-.08.07-.13.08-.38.11-.75.23-1.14.31-.33.07-.53.25-.61.61-.1.43-.23.86-.34 1.29-.01.04-.01.11-.07.1-.05 0-.04-.06-.05-.1-.1-.42-.22-.84-.32-1.26-.08-.35-.26-.57-.6-.64-.4-.08-.79-.19-1.17-.32-.05-.02-.12-.01-.12-.08 0-.06.06-.05.11-.07.4-.12.81-.25 1.22-.35.32-.08.49-.28.56-.6.09-.4.18-.81.28-1.21.02-.07.01-.19.1-.19.09 0 .08.12.1.19.11.41.22.82.31 1.24.07.31.24.48.53.56.41.1.81.23 1.22.35.05.01.11 0 .12.08z" fill="white"></path>' + '<defs><linearGradient id="vlg" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#2B8B8D"></stop><stop offset=".89" stop-color="#1A283F"></stop></linearGradient></defs></svg>';
  var BRAND = '<a class="brand" href="' + base + 'home-figma.html" aria-label="Velaris Web home">' + MARK + '<span class="brand-name">Velaris<span>Web</span></span></a>';
  function svcMega() {
    var S = window.VELARIS_SERVICES || [];
    var ic = {
      code: '<path d="M8 7l-4 5 4 5M16 7l4 5-4 5M13 5l-2 14"/>',
      spark: '<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.3 1-5.5-4-3.9L10.5 8z"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
      mail: '<path d="M3 6l9 7 9-7M3 6v12h18V6"/>',
      ux: '<path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.4"/>',
      brand: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',
      webflow: '<path d="M3 8l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 16l9 4 9-4"/>',
      framer: '<path d="M6 3h12v6H12zM6 9h6l6 6h-6v6z"/>'
    };
    var links = S.map(function (s) {
      return '<a class="mega-link" href="' + base + 'service.html?s=' + s.slug + '"><span class="mega-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">' + ic[s.icon] + '</svg></span><span><b>' + s.name + '</b><span>' + s.tagline + '</span></span></a>';
    }).join('');
    return '<div class="mega wide"><div class="mega-inner"><div class="mega-grid">' + links + '</div>' + '<div class="mega-foot"><div><b>Not sure what you need?</b><p>Book a free 20-min call and we\'ll map it out.</p></div><a class="btn btn-teal" href="' + base + 'pricing.html">See pricing</a></div></div></div>';
  }
  function caseMega() {
    var C = (window.VELARIS_CASES || []).slice(0, 4);
    var icons = {
      hazelwood: 'icon-hazelwood.png',
      navasana: 'icon-navasana.png',
      core: 'icon-core.png',
      bellavista: 'icon-bellavista.png',
      coastal: 'icon-coastal.png'
    };
    var links = C.map(function (c) {
      var ic = icons[c.slug] ? base + 'home-img/' + icons[c.slug] : base + c.logo;
      return '<a class="mega-link" href="' + base + 'case.html?c=' + c.slug + '"><span class="mega-ic case-ic"><img src="' + ic + '" alt=""></span><span><b>' + c.client + '</b><span>' + c.sector + '</span></span></a>';
    }).join('');
    return '<div class="mega"><div class="mega-inner"><div class="mega-grid one">' + links + '</div>' + '<div class="mega-foot"><div><b>See every project</b><p>Browse the full Velaris portfolio.</p></div><a class="btn btn-teal" href="' + base + 'work.html">View all</a></div></div></div>';
  }

  /* mobile drawer accordion sections */
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>';
  function drawerAcc(label, inner, allHref, allLabel) {
    return '<div class="dacc">' + '<button class="dl dacc-trig" type="button" aria-expanded="false">' + label + CHEV + '</button>' + '<div class="dacc-body"><div class="dacc-inner">' + inner + '<a class="dsub dsub-all" href="' + allHref + '" data-close>' + allLabel + ' \u2192</a></div></div></div>';
  }
  function svcDrawerLinks() {
    return (window.VELARIS_SERVICES || []).map(function (s) {
      return '<a class="dsub" href="' + base + 'service.html?s=' + s.slug + '" data-close>' + s.name + '</a>';
    }).join('');
  }
  function caseDrawerLinks() {
    return (window.VELARIS_CASES || []).slice(0, 5).map(function (c) {
      return '<a class="dsub" href="' + base + 'case.html?c=' + c.slug + '" data-close>' + c.client + '</a>';
    }).join('');
  }
  var navHTML = '<div class="topbar"><div class="wrap"><span>New — The 2026 Lead Generation Playbook for B2B &amp; B2C founders.</span>' + '<a href="' + base + 'resources.html">Download Free Playbook <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="14" height="14"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg></a></div></div>' + '<header class="nav"><div class="wrap nav-inner">' + BRAND + '<nav class="nav-links" aria-label="Primary">' + '<div class="nav-item' + (page === 'home' ? ' active' : '') + '"><a href="' + base + 'home-figma.html">Home</a></div>' + '<div class="nav-item has-mega' + (page === 'services' ? ' active' : '') + '"><a href="' + base + 'services.html" aria-haspopup="true">Services <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></a>' + svcMega() + '</div>' + '<div class="nav-item has-mega' + (page === 'cases' ? ' active' : '') + '"><a href="' + base + 'work.html" aria-haspopup="true">Case Studies <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></a>' + caseMega() + '</div>' + '<div class="nav-item' + (page === 'pricing' ? ' active' : '') + '"><a href="' + base + 'pricing.html">Pricing</a></div>' + '<div class="nav-item' + (page === 'resources' ? ' active' : '') + '"><a href="' + base + 'resources.html">Resources</a></div>' + '<div class="nav-item' + (page === 'about' ? ' active' : '') + '"><a href="' + base + 'about.html">About</a></div>' + '<div class="nav-item' + (page === 'blog' ? ' active' : '') + '"><a href="' + base + 'blog.html">Blog</a></div>' + '</nav>' + '<div class="nav-right"><a class="ghost" data-booking href="https://calendly.com/velarisweb/30min">Book a Call</a>' + '<a class="btn btn-teal" data-inquiry href="#start">Start a Project</a>' + '<button class="nav-burger" id="burger" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>' + '</div></header>' + '<div class="drawer" id="drawer"><div class="drawer-bg" data-close></div><div class="drawer-panel">' + '<div class="drawer-head">' + BRAND + '<button class="drawer-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' + '<nav class="drawer-nav" aria-label="Mobile">' + '<a class="dl" href="' + base + 'home-figma.html" data-close>Home</a>' + drawerAcc('Services', svcDrawerLinks(), base + 'services.html', 'All services') + drawerAcc('Case Studies', caseDrawerLinks(), base + 'work.html', 'View all work') + '<a class="dl" href="' + base + 'pricing.html" data-close>Pricing</a>' + '<a class="dl" href="' + base + 'resources.html" data-close>Resources</a>' + '<a class="dl" href="' + base + 'about.html" data-close>About</a>' + '<a class="dl" href="' + base + 'blog.html" data-close>Blog</a>' + '</nav>' + '<div class="drawer-cta">' + '<a class="btn btn-line" data-booking data-close href="https://calendly.com/velarisweb/30min">Book a Call</a>' + '<a class="btn btn-teal" data-inquiry data-close href="#start">Start a Project</a>' + '</div>' + '</div></div>';
  var footHTML = '<footer class="site"><div class="wrap"><div class="foot-grid">' + '<div class="foot-brand">' + BRAND + '<p>We help B2B &amp; B2C founders grow online with strategic design, local SEO, custom development and outreach that actually performs.</p>' + '<div class="foot-social">' + '<a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-5 7H2l8-9L2 2h6l4 6z"/></svg></a>' + '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 110 4 2 2 0 010-4zM3 9h3v12H3zM9 9h3v2a3 3 0 013-2c3 0 4 2 4 5v8h-3v-7c0-2-1-3-2-3s-2 1-2 3v7H9z"/></svg></a>' + '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>' + '</div></div>' + '<div class="foot-col"><h5>Services</h5>' + '<a href="' + base + 'service.html?s=custom-development">Custom Development</a>' + '<a href="' + base + 'service.html?s=ai-web-development">Claude AI Web Dev</a>' + '<a href="' + base + 'service.html?s=seo-optimization">SEO Optimization</a>' + '<a href="' + base + 'service.html?s=cold-email-marketing">Cold Email</a>' + '<a href="' + base + 'service.html?s=conversion-uiux">UI/UX Design</a></div>' + '<div class="foot-col"><h5>Company</h5>' + '<a href="' + base + 'work.html">Case Studies</a>' + '<a href="' + base + 'pricing.html">Pricing</a>' + '<a href="' + base + 'resources.html">Resources</a>' + '<a href="' + base + 'about.html">About</a>' + '<a href="' + base + 'blog.html">Blog</a></div>' + '<div class="foot-col"><h5>Get started</h5>' + '<a data-inquiry href="#start">Start a Project</a>' + '<a data-booking href="https://calendly.com/velarisweb/30min">Book a Call</a>' + '<a href="' + base + 'resources.html">Free Playbook</a></div>' + '</div><div class="foot-bottom"><span>© <span id="yr">2026</span> Velaris Web. All rights reserved.</span>' + '<div class="links"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div></div></div></footer>';
  var navMount = document.getElementById('site-nav');
  var footMount = document.getElementById('site-footer');
  if (navMount) navMount.innerHTML = navHTML;
  if (footMount) footMount.innerHTML = footHTML;

  /* interactions */
  var nav = document.querySelector('header.nav');
  var lastY = window.pageYOffset || 0,
    ticking = false;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (nav) {
      nav.classList.toggle('solid', y > 14);
      if (y > 150 && y > lastY + 4) {
        nav.classList.add('hide');
        document.querySelectorAll('.nav-item.open').forEach(function (i) {
          i.classList.remove('open');
        });
      } else if (y < lastY - 4 || y < 120) {
        nav.classList.remove('hide');
      }
      lastY = y;
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, {
    passive: true
  });
  onScroll();
  function closeAll(except) {
    document.querySelectorAll('.nav-item.open').forEach(function (i) {
      if (i !== except) i.classList.remove('open');
    });
  }
  document.querySelectorAll('.nav-item.has-mega').forEach(function (item) {
    var link = item.querySelector('a'),
      t;
    item.addEventListener('mouseenter', function () {
      clearTimeout(t);
      closeAll(item);
      item.classList.add('open');
    });
    item.addEventListener('mouseleave', function () {
      t = setTimeout(function () {
        item.classList.remove('open');
      }, 120);
    });
    if (link) link.addEventListener('click', function (e) {
      if (window.innerWidth <= 680) return; // allow nav on mobile (drawer handles it)
      // let the link navigate, but on first tap of a touch device just open
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeAll();
  });
  var drawer = document.getElementById('drawer');
  var burger = document.getElementById('burger');
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('on');
    document.body.style.overflow = '';
    drawer.querySelectorAll('.dacc.open').forEach(function (a) {
      a.classList.remove('open');
      var b = a.querySelector('.dacc-body');
      if (b) b.style.maxHeight = '0';
      var t = a.querySelector('.dacc-trig');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  if (burger) burger.addEventListener('click', function () {
    drawer.classList.add('on');
    document.body.style.overflow = 'hidden';
  });
  if (drawer) drawer.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]') || e.target.classList.contains('drawer-bg')) {
      closeDrawer();
    }
  });

  /* drawer accordion (Services / Case Studies) */
  if (drawer) drawer.querySelectorAll('.dacc-trig').forEach(function (t) {
    t.addEventListener('click', function () {
      var acc = t.closest('.dacc'),
        body = acc.querySelector('.dacc-body'),
        open = acc.classList.contains('open');
      // close siblings for a tidy single-open accordion
      drawer.querySelectorAll('.dacc.open').forEach(function (o) {
        if (o !== acc) {
          o.classList.remove('open');
          var ob = o.querySelector('.dacc-body');
          if (ob) ob.style.maxHeight = '0';
          var ot = o.querySelector('.dacc-trig');
          if (ot) ot.setAttribute('aria-expanded', 'false');
        }
      });
      acc.classList.toggle('open', !open);
      t.setAttribute('aria-expanded', String(!open));
      body.style.maxHeight = open ? '0' : body.scrollHeight + 'px';
    });
  });
  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- INQUIRY MODAL (Start a Project) ---- */
  var SVC_OPTS = (window.VELARIS_SERVICES || []).map(function (s) {
    return s.name.replace(/&amp;/g, '&');
  });
  if (!SVC_OPTS.length) SVC_OPTS = ['Logo & Brand Design', 'Web & UX Design', 'Custom Development', 'SEO', 'Cold Email'];
  var modal = document.createElement('div');
  modal.className = 'imodal';
  modal.id = 'inquiryModal';
  modal.innerHTML = '<div class="imodal-bg" data-iclose></div>' + '<div class="imodal-panel" role="dialog" aria-modal="true" aria-label="Start a project">' + '<button class="imodal-x" data-iclose aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' + '<div class="imodal-grid">' + '<div class="imodal-left">' + '<h2>Have a project in mind? <span class="serif">Let\'s get started</span></h2>' + '<p>We\'ll schedule a call to discuss your idea. After a discovery session we\'ll send a proposal, and once approved we get to work.</p>' + '<div class="imodal-founder">' + '<span class="if-photo" style="background-image:url(' + base + 'home-img/founder.jpg)"></span>' + '<div class="if-meta"><b>Deluar Ahamed</b><span>Founder &amp; Lead Designer</span>' + '<a class="if-li" href="https://www.linkedin.com/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 110 4 2 2 0 010-4zM3 9h3v12H3zM9 9h3v2a3 3 0 013-2c3 0 4 2 4 5v8h-3v-7c0-2-1-3-2-3s-2 1-2 3v7H9z"/></svg> Connect on LinkedIn</a></div>' + '</div>' + '<ul class="imodal-trust">' + '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Free 20-minute strategy call</li>' + '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Clear proposal &amp; timeline</li>' + '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> No obligation, ever</li>' + '</ul>' + '</div>' + '<form class="imodal-form" id="inquiryForm">' + '<div class="ifield"><label>Full name</label><input type="text" name="name" placeholder="Jane Cooper" required></div>' + '<div class="ifield-row">' + '<div class="ifield"><label>Company name</label><input type="text" name="company" placeholder="Ex. Tesla Inc"></div>' + '<div class="ifield"><label>Email *</label><input type="email" name="email" placeholder="you@example.com" required></div>' + '</div>' + '<div class="ifield-row">' + '<div class="ifield"><label>Service required *</label><select name="service" required><option value="" disabled selected>Select your service</option>' + SVC_OPTS.map(function (o) {
    return '<option>' + o + '</option>';
  }).join('') + '<option>Not sure yet</option></select></div>' + '<div class="ifield"><label>Project budget *</label><select name="budget" required><option value="" disabled selected>Select your range</option><option>£1k – £3k</option><option>£3k – £6k</option><option>£6k – £12k</option><option>£12k+</option></select></div>' + '</div>' + '<div class="ifield"><label>Project details *</label><textarea name="details" placeholder="Tell us more about your idea" required></textarea></div>' + '<button class="btn btn-dark" type="submit" style="width:100%">Send inquiry <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' + '<p class="imodal-alt">Not ready to submit? <a data-booking href="https://calendly.com/velarisweb/30min">Book a call directly</a></p>' + '<div class="imodal-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Thanks! We\'ll be in touch within one business day.</div>' + '</form>' + '</div>' + '</div>';
  document.body.appendChild(modal);
  function openModal() {
    modal.classList.add('on');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('on');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var trig = e.target.closest('[data-inquiry]');
    if (trig) {
      e.preventDefault();
      openModal();
      return;
    }
    if (e.target.closest('[data-iclose]') || e.target.classList.contains('imodal-bg')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
  var iform = document.getElementById('inquiryForm');
  if (iform) iform.addEventListener('submit', function (e) {
    e.preventDefault();
    iform.querySelector('.imodal-ok').classList.add('show');
    setTimeout(closeModal, 1800);
  });

  /* ---- CALENDLY booking integration ---- */
  var CAL_URL = 'https://calendly.com/velarisweb/30min';
  (function loadCalendly() {
    if (!document.querySelector('link[href*="calendly"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(l);
    }
    if (!document.querySelector('script[src*="calendly"]')) {
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.head.appendChild(s);
    }
  })();
  function openCalendly() {
    if (window.Calendly && window.Calendly.initPopupWidget) {
      window.Calendly.initPopupWidget({
        url: CAL_URL
      });
    } else {
      window.open(CAL_URL, '_blank', 'noopener');
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-booking]');
    if (b) {
      e.preventDefault();
      closeModal();
      closeDrawer();
      openCalendly();
    }
  });

  /* auto-wire any existing "Book a call" CTAs across pages to Calendly */
  [].slice.call(document.querySelectorAll('a.btn, a.ghost, a.cs-live')).forEach(function (a) {
    if (a.hasAttribute('data-booking') || a.hasAttribute('data-inquiry')) return;
    var t = (a.textContent || '').trim().toLowerCase();
    if (/^book a (free )?call/.test(t) || t === 'book a call') {
      a.setAttribute('data-booking', '');
      a.setAttribute('href', CAL_URL);
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/site.js", error: String((e && e.message) || e) }); }

})();
