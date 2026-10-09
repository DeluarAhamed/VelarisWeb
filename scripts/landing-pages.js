// Prerenders CMS-driven landing pages into dist/:
//   /services/<slug>, /case-studies/<slug>, plus the /services and /case-studies index pages.
// Content comes from Sanity at build time; data/service-pages.json and home-data.js are fallbacks.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appDir = path.join(root, 'public', 'velaris-design-system', 'ui_kits', 'web-app');
const ORIGIN = 'https://velarisweb.com';
const V = '20261010-v7';
const WA = 'https://wa.me/8801989570693';
const SHARE_IMAGE = `${ORIGIN}/velaris-design-system/assets/og-velaris.png`;
const LOGO = `${ORIGIN}/velaris-design-system/assets/velaris-icon.png`;

const e = (v) => String(v == null ? '' : v).replace(/&amp;/g, '&')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ld = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>';
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>';
const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2z"/><path d="M16.6 14.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.4-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';
// Lowercase a service name for use mid-sentence, keeping acronyms like SEO and AI.
const lc = (name) => String(name).split(' ').map((w) => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase())).join(' ');
const waBtn = (msg, cls = 'btn btn-wa') => `<a class="${cls}" href="${WA}" data-wa="${e(msg)}">${WA_ICON}WhatsApp us</a>`;

/* ---------- data ---------- */
function sanityConfig() {
  const src = fs.readFileSync(path.join(appDir, 'sanity-config.js'), 'utf8');
  const pick = (k, d) => (src.match(new RegExp(`${k}:\\s*"([^"]+)"`)) || [])[1] || d;
  return { projectId: pick('projectId'), dataset: pick('dataset', 'production'), apiVersion: pick('apiVersion', '2026-07-03') };
}
async function sanityQuery(groq) {
  const c = sanityConfig();
  const url = `https://${c.projectId}.api.sanity.io/v${c.apiVersion}/data/query/${c.dataset}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).result;
}

async function loadServices() {
  try {
    const rows = await sanityQuery(`*[_type=="service" && !(retired==true) && defined(heroHeadline) && !(_id in path("drafts.**"))]|order(orderRank asc){
      name,"slug":slug.current,orderRank,icon,accent,tagline,shortDescription,heroHeadline,intro,includes,
      capabilities[]{title,description},benefits[]{title,description},process[]{title,description},
      faqs[]{question,answer},"relatedCases":relatedCases[]->slug.current,seo{metaTitle,metaDescription,keywords}}`);
    if (rows && rows.length) return { services: rows, source: 'Sanity' };
    console.warn('WARNING: no landing-page services in Sanity yet; using data/service-pages.json');
  } catch (err) {
    console.warn(`WARNING: Sanity services fetch failed (${err.message}); using data/service-pages.json`);
  }
  return { services: JSON.parse(fs.readFileSync(path.join(root, 'data', 'service-pages.json'), 'utf8')), source: 'data/service-pages.json' };
}

async function loadCases(fallbackCases) {
  try {
    const rows = await sanityQuery(`*[_type=="caseStudy" && !(_id in path("drafts.**"))]|order(caseNumber asc){
      client,"slug":slug.current,caseNumber,sector,industry,headline,summary,challenge,approach,outcome,liveUrl,timeline,services,deliverables,
      results[]{value,label},quote,quoteAuthor,quoteRole,
      "avatar":coalesce(quoteAvatar.asset->url,quoteAvatarPath,quoteAvatar.legacyPath),
      "hero":coalesce(heroImage.asset->url,heroImagePath,heroImage.legacyPath),
      "shots":pageScreenshots[]{title,"src":coalesce(image.asset->url,legacyPath,image.legacyPath)},
      seo{metaTitle,metaDescription}}`);
    if (rows && rows.length) return { cases: rows, source: 'Sanity' };
  } catch (err) {
    console.warn(`WARNING: Sanity cases fetch failed (${err.message}); using home-data.js`);
  }
  return {
    source: 'home-data.js',
    cases: (fallbackCases || []).map((c) => ({
      client: c.client, slug: c.slug, caseNumber: c.n, sector: c.sector, headline: c.headline || c.title, summary: c.summary,
      challenge: c.challenge, approach: c.approach, outcome: c.outcome, liveUrl: c.live, timeline: c.timeline,
      services: c.services, deliverables: c.deliverables, results: (c.stats || []).map(([value, label]) => ({ value, label })),
      quote: c.quote, quoteAuthor: c.author, quoteRole: c.role, avatar: c.avatar, hero: c.img,
      shots: (c.pages || []).map((p) => ({ title: p.title, src: p.img })), seo: null,
    })),
  };
}

// Local legacy paths are relative to the web-app <base>; prefer the optimised .webp when it exists.
function img(src) {
  if (!src) return '';
  if (/^(https?:|data:|\/)/.test(src)) return src;
  const webp = src.replace(/\.(png|jpe?g)$/i, '.webp');
  return fs.existsSync(path.join(appDir, webp)) ? webp : src;
}

// Service illustrations live in the homepage bento; reuse them so there is one source.
function serviceArt() {
  const html = fs.readFileSync(path.join(appDir, 'home-figma.html'), 'utf8');
  const art = {};
  const re = /<a class="v-svc[^"]*" href="\/services\/([a-z0-9-]+)"[\s\S]*?<div class="art" aria-hidden="true">([\s\S]*?<\/svg>)<\/div>/g;
  let m;
  while ((m = re.exec(html))) art[m[1]] = m[2];
  return art;
}

/* ---------- shell ---------- */
function shell({ title, description, canonical, page, ogType = 'website', jsonLd = [], body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base href="/velaris-design-system/ui_kits/web-app/">
<title>${e(title)}</title>
<link rel="icon" type="image/png" sizes="32x32" href="../../assets/favicon-32.png">
<link rel="apple-touch-icon" href="../../assets/apple-touch-icon.png">
<meta name="description" content="${e(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(description)}">
<meta property="og:image" content="${SHARE_IMAGE}">
<meta property="og:site_name" content="Velaris Web">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(description)}">
<meta name="twitter:image" content="${SHARE_IMAGE}">
<link rel="stylesheet" href="../../colors_and_type.css?v=${V}">
<link rel="stylesheet" href="home-figma.css?v=${V}">
<link rel="stylesheet" href="v2.css?v=${V}">
${jsonLd.map(ld).join('\n')}
</head>
<body data-page="${page}" data-base="">
<div id="site-nav"></div>
<main>
${body}
</main>
<div id="site-footer"></div>
<script src="home-data.js?v=${V}"></script>
<script src="sanity-config.js?v=20260703-cms1"></script>
<script src="sanity-bridge.js?v=${V}"></script>
<script src="site.js?v=${V}"></script>
<script src="v2.js?v=${V}"></script>
</body>
</html>
`;
}

const crumbs = (items) => `<nav class="lp-crumb" aria-label="Breadcrumb">${items.map((it, i) =>
  (i < items.length - 1 ? `<a href="${it.href}">${e(it.name)}</a>${CHEV}` : `<span aria-current="page">${e(it.name)}</span>`)).join('')}</nav>`;
const crumbLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: ORIGIN + it.href })),
});
const faqLd = (faqs) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
});
const faqBlock = (faqs, heading, intro, waMsg) => `
<section class="v-section soft" id="faq">
  <div class="wrap v-faq-wrap">
    <div class="v-faq-intro">
      <span class="v-kicker">FAQ</span>
      <h2>${heading}</h2>
      <p>${e(intro)}</p>
      <div class="v-hero-cta">${waBtn(waMsg, 'btn btn-wa solid')}</div>
    </div>
    <div class="v-faq">
      ${faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${e(f.question)}</summary><p>${e(f.answer)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;
const ctaBlock = (kicker, heading, text, waMsg) => `
<section class="v-cta" style="padding-top:120px">
  <div class="wrap">
    <div class="v-cta-card">
      <span class="v-kicker">${e(kicker)}</span>
      <h2>${e(heading)}</h2>
      <p>${e(text)}</p>
      <div class="v-hero-cta">${waBtn(waMsg, 'btn btn-wa solid')}<a class="btn btn-white" href="/pricing">See plans &amp; pricing</a></div>
      <ul class="v-ticks"><li>${CHECK.replace('<svg', '<svg class="v-check"')}No upfront cost</li><li>${CHECK.replace('<svg', '<svg class="v-check"')}Preview in 5 business days</li><li>${CHECK.replace('<svg', '<svg class="v-check"')}Cancel anytime</li></ul>
    </div>
  </div>
</section>`;
const caseCard = (c) => `<a class="v-case" href="/case-studies/${c.slug}"><div class="shot" role="img" aria-label="${e(c.client)} website" style="background-image:url('${e(img(c.hero))}')"></div><div class="meta"><div><b>${e(c.client)}</b><small>${e(c.sector)}</small></div><span class="go">${ARROW}</span></div></a>`;

/* ---------- service page ---------- */
function servicePage(s, cases, art) {
  const url = `${ORIGIN}/services/${s.slug}`;
  const title = (s.seo && s.seo.metaTitle) || `${s.name} | Velaris Web`;
  const description = (s.seo && s.seo.metaDescription) || s.shortDescription;
  const accent = s.accent || '#127AFE';
  const trail = [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: s.name, href: `/services/${s.slug}` }];
  const related = (s.relatedCases || []).map((slug) => cases.find((c) => c.slug === slug)).filter(Boolean).slice(0, 3);
  const waMsg = `Hi Velaris, I'm interested in ${s.name}.`;
  const body = `
<section class="lp-hero" style="--accent:${e(accent)}">
  <div class="wrap lp-hero-grid">
    <div>
      ${crumbs(trail)}
      <span class="v-kicker">${e(s.name)}</span>
      <h1>${e(s.heroHeadline || s.name)}</h1>
      <p class="lede">${e(s.intro)}</p>
      <div class="v-hero-cta">${waBtn(waMsg)}<a class="btn btn-quiet" href="/pricing">See plans from $199/mo</a></div>
      <ul class="v-ticks"><li>${CHECK.replace('<svg', '<svg class="v-check"')}No upfront cost</li><li>${CHECK.replace('<svg', '<svg class="v-check"')}Included in monthly plans</li><li>${CHECK.replace('<svg', '<svg class="v-check"')}Cancel anytime</li></ul>
    </div>
    <div class="lp-art" aria-hidden="true">${art[s.slug] || ''}</div>
  </div>
</section>

<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">What's included</span><h2>${e(s.name)} services, <span class="serif">done for you</span></h2><p>${e(s.tagline)}.</p></div>
    <div class="lp-caps">
      ${(s.capabilities || []).map((c, i) => `<div class="v-feat"><span class="ic lp-num" style="color:${e(accent)}">${String(i + 1).padStart(2, '0')}</span><h3>${e(c.title)}</h3><p>${e(c.description)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="v-section soft">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Why it matters</span><h2>What ${e(lc(s.name))} does <span class="serif">for your business</span></h2></div>
    <div class="lp-benefits">
      ${(s.benefits || []).map((b) => `<div class="lp-benefit"><span class="tick" style="background:${e(accent)}">${CHECK}</span><h3>${e(b.title)}</h3><p>${e(b.description)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">How it works</span><h2>Simple process, <span class="serif">clear timeline</span></h2></div>
    <div class="v-steps">
      ${(s.process || []).map((p) => `<div class="v-step"><h3>${e(p.title)}</h3><p>${e(p.description)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="v-section soft">
  <div class="wrap">
    <div class="lp-plan">
      <div>
        <span class="v-kicker">Pricing</span>
        <h2>${e(s.name)} is included in our monthly plans</h2>
        <p>One flat monthly fee covers your website, hosting, updates and ${e(lc(s.name))}. No setup fee, no long contract.</p>
        <div class="v-hero-cta"><a class="btn btn-blue" href="/pricing">Compare plans ${ARROW}</a>${waBtn(waMsg)}</div>
      </div>
      <ul>
        ${(s.includes || []).map((t) => `<li>${CHECK}${e(t)}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</section>
${related.length ? `
<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Our work</span><h2>Recent projects</h2></div>
    <div class="v-work">${related.map(caseCard).join('')}</div>
    <div class="v-more"><a class="btn btn-quiet" href="/case-studies">View all case studies</a></div>
  </div>
</section>` : ''}
${(s.faqs || []).length ? faqBlock(s.faqs, `${e(s.name)} <span class="serif">questions</span>`, `Common questions about ${lc(s.name)}. Can't find yours? Message us.`, `Hi Velaris, I have a question about ${s.name}.`) : ''}
${ctaBlock('Get started', `Ready to get started with ${lc(s.name)}?`, 'Message us on WhatsApp. If we are a fit, your preview is ready within 5 business days.', waMsg)}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: s.name, description,
      url, provider: { '@type': 'Organization', name: 'Velaris Web', url: `${ORIGIN}/`, logo: LOGO }, areaServed: 'Worldwide',
      offers: { '@type': 'AggregateOffer', lowPrice: '199', priceCurrency: 'USD', offerCount: 3, url: `${ORIGIN}/pricing` },
    },
    crumbLd(trail),
  ];
  if ((s.faqs || []).length) jsonLd.push(faqLd(s.faqs));
  return shell({ title, description, canonical: url, page: 'services', jsonLd, body });
}

/* ---------- case page ---------- */
function casePage(c, cases) {
  const url = `${ORIGIN}/case-studies/${c.slug}`;
  const title = (c.seo && c.seo.metaTitle) || `${c.client} Case Study | Velaris Web`;
  const description = (c.seo && c.seo.metaDescription) || c.summary || `${c.client} website case study by Velaris Web.`;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Case Studies', href: '/case-studies' }, { name: c.client, href: `/case-studies/${c.slug}` }];
  const i = cases.indexOf(c);
  const next = cases[(i + 1) % cases.length];
  const shots = (c.shots || []).filter((s) => s.src).slice(0, 3);
  const results = (c.results || []).filter((r) => r.value && r.label).slice(0, 4);
  const waMsg = `Hi Velaris, I saw the ${c.client} case study and I'd like something similar.`;
  const meta = [['Client', c.client], ['Industry', c.sector || c.industry], ['Timeline', c.timeline], ['Services', (c.services || []).slice(0, 3).join(', ')]].filter(([, v]) => v);
  const story = [['The challenge', c.challenge], ['Our approach', c.approach], ['The outcome', c.outcome]].filter(([, v]) => v);
  const body = `
<section class="lp-hero case">
  <div class="wrap">
    ${crumbs(trail)}
    <span class="v-kicker">${e(c.sector)}</span>
    <h1>${e(c.headline || c.client)}</h1>
    <p class="lede">${e(c.summary)}</p>
    <dl class="lp-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${e(v)}</dd></div>`).join('')}</dl>
    <div class="v-hero-cta">${c.liveUrl ? `<a class="btn btn-blue" href="${e(c.liveUrl)}" target="_blank" rel="noopener">Visit live site ${ARROW}</a>` : ''}${waBtn(waMsg)}</div>
  </div>
  ${c.hero ? `<div class="wrap"><figure class="lp-shot"><img src="${e(img(c.hero))}" alt="${e(c.client)} website on desktop and mobile" width="1600" height="1000" loading="eager"></figure></div>` : ''}
</section>
${results.length ? `
<section class="v-section tight">
  <div class="wrap"><div class="v-stats" aria-label="Results">${results.map((r) => `<div class="v-stat"><b>${e(r.value)}</b><span>${e(r.label)}</span></div>`).join('')}</div></div>
</section>` : ''}

<section class="v-section${results.length ? '' : ''}" style="padding-top:${results.length ? '40px' : '120px'}">
  <div class="wrap lp-story">
    ${story.map(([k, v]) => `<div class="lp-story-row"><h2>${k}</h2><p>${e(v)}</p></div>`).join('\n    ')}
    ${(c.deliverables || c.services || []).length ? `<div class="lp-story-row"><h2>What we delivered</h2><ul class="lp-chips">${[...new Set([...(c.services || []), ...(c.deliverables || [])])].slice(0, 10).map((d) => `<li>${e(d)}</li>`).join('')}</ul></div>` : ''}
  </div>
</section>
${c.quote ? `
<section class="v-section soft tight">
  <div class="wrap"><figure class="lp-quote"><blockquote>&ldquo;${e(c.quote)}&rdquo;</blockquote><figcaption>${c.avatar ? `<img src="${e(img(c.avatar))}" alt="" width="48" height="48" loading="lazy">` : ''}<span><b>${e(c.quoteAuthor)}</b>${e(c.quoteRole)}</span></figcaption></figure></div>
</section>` : ''}
${shots.length ? `
<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Selected pages</span><h2>Inside the ${e(c.client)} website</h2></div>
    <div class="lp-shots">${shots.map((s) => `<figure><div class="frame"><img src="${e(img(s.src))}" alt="${e(c.client)} ${e(s.title)} page" loading="lazy"></div><figcaption>${e(s.title)}</figcaption></figure>`).join('')}</div>
  </div>
</section>` : ''}

<section class="v-section soft tight">
  <div class="wrap lp-next">
    <a class="btn btn-quiet" href="/case-studies">&larr; All case studies</a>
    ${next && next !== c ? `<a class="lp-next-link" href="/case-studies/${next.slug}"><small>Next case study</small><b>${e(next.client)}</b>${ARROW}</a>` : ''}
  </div>
</section>
${ctaBlock('Your project next', 'Want results like these for your business?', 'Tell us about your business on WhatsApp. Your website preview is ready within 5 business days.', waMsg)}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'CreativeWork', name: `${c.client} website case study`, headline: c.headline || c.client,
      description, url, image: c.hero && /^https?:/.test(c.hero) ? c.hero : `${ORIGIN}/velaris-design-system/ui_kits/web-app/${img(c.hero)}`,
      creator: { '@type': 'Organization', name: 'Velaris Web', url: `${ORIGIN}/` }, about: c.sector,
    },
    crumbLd(trail),
  ];
  return shell({ title, description, canonical: url, page: 'cases', ogType: 'article', jsonLd, body });
}

/* ---------- index pages ---------- */
function servicesIndex(services, art) {
  const trail = [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }];
  const body = `
<section class="v-phero">
  <div class="wrap">
    ${crumbs(trail)}
    <span class="v-pill"><b>Services</b> Websites, software &amp; AI on one plan</span>
    <h1>The systems that <span class="serif">grow your business</span></h1>
    <p>Custom software, websites, AI automation, SEO and more, built to work together and run for you on one monthly plan from $199/month.</p>
    <div class="v-hero-cta"><a class="btn btn-blue" href="/pricing">See plans &amp; pricing ${ARROW}</a>${waBtn('Hi Velaris, I would like to know which service fits my business.')}</div>
  </div>
</section>
<section class="v-section" style="padding-top:64px">
  <div class="wrap lp-svc-grid">
    ${services.map((s) => `<a class="v-svc" href="/services/${s.slug}" style="--accent:${e(s.accent || '#127AFE')}"><h2 class="lp-svc-name">${e(s.name)}</h2><p>${e(s.shortDescription)}</p><span class="more" style="color:${e(s.accent || '#127AFE')}">Explore ${e(lc(s.name))} ${ARROW}</span><div class="art" aria-hidden="true">${art[s.slug] || ''}</div></a>`).join('\n    ')}
  </div>
</section>
${ctaBlock('Not sure where to start?', 'Tell us about your business and we will recommend the right plan', 'No sales pitch. Message us on WhatsApp and we will reply within a few hours.', 'Hi Velaris, can you recommend the right service for my business?')}`;
  return shell({
    title: 'Software, Web Design & AI Services | Velaris Web',
    description: 'Custom software, CRMs, websites, AI automation, SEO and e-commerce for small businesses, built and run for you on monthly plans from $199/month.',
    canonical: `${ORIGIN}/services`, page: 'services',
    jsonLd: [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: `${ORIGIN}/services/${s.slug}` })) }],
    body,
  });
}

function casesIndex(cases) {
  const trail = [{ name: 'Home', href: '/' }, { name: 'Case Studies', href: '/case-studies' }];
  const body = `
<section class="v-phero">
  <div class="wrap">
    ${crumbs(trail)}
    <span class="v-pill"><b>Our work</b> Real websites, real businesses</span>
    <h1>Website case studies <span class="serif">from real businesses</span></h1>
    <p>Healthcare, property, finance, engineering and tech brands we've designed and built websites for, and the results they've seen.</p>
  </div>
</section>
<section class="v-section" style="padding-top:64px">
  <div class="wrap"><div class="v-work">${cases.map(caseCard).join('')}</div></div>
</section>
${ctaBlock('Your project next', 'Want a website like these?', 'Message us on WhatsApp. Your website preview is ready within 5 business days.', 'Hi Velaris, I saw your case studies and would like a website for my business.')}`;
  return shell({
    title: 'Website Case Studies & Portfolio | Velaris Web',
    description: 'Website design case studies from Velaris Web: healthcare, property, finance, engineering and tech businesses, with the results they achieved.',
    canonical: `${ORIGIN}/case-studies`, page: 'cases',
    jsonLd: [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: cases.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.client, url: `${ORIGIN}/case-studies/${c.slug}` })) }],
    body,
  });
}

/* ---------- build ---------- */
async function buildLandingPages({ distDir, fallbackCases }) {
  const [{ services, source: svcSource }, { cases, source: caseSource }] = await Promise.all([loadServices(), loadCases(fallbackCases)]);
  const safe = (list) => list.filter((x) => x.slug && /^[a-z0-9-]+$/.test(x.slug));
  const svc = safe(services);
  const cs = safe(cases);
  const paths = { services: svc.map((s) => `/services/${s.slug}`), cases: cs.map((c) => `/case-studies/${c.slug}`) };
  if (!distDir) return paths;

  const art = serviceArt();
  for (const [dir, list, render] of [['services', svc, (s) => servicePage(s, cs, art)], ['case-studies', cs, (c) => casePage(c, cs)]]) {
    const out = path.join(distDir, dir);
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out, { recursive: true });
    for (const item of list) fs.writeFileSync(path.join(out, `${item.slug}.html`), render(item));
  }
  // The /services and /case-studies rewrites point at these files in the web-app folder.
  const distApp = path.join(distDir, 'velaris-design-system', 'ui_kits', 'web-app');
  fs.writeFileSync(path.join(distApp, 'services.html'), servicesIndex(svc, art));
  fs.writeFileSync(path.join(distApp, 'work.html'), casesIndex(cs));
  console.log(`Prerendered ${svc.length} service pages (${svcSource}) and ${cs.length} case studies (${caseSource})`);
  return paths;
}

module.exports = { buildLandingPages };
