// Prerenders CMS-driven landing pages into dist/:
//   /services/<slug>, /case-studies/<slug>, /solutions/<slug>, plus their index pages.
// Content comes from Sanity at build time; data/service-pages.json and home-data.js are fallbacks.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appDir = path.join(root, 'public', 'velaris-design-system', 'ui_kits', 'web-app');
const ORIGIN = 'https://velarisweb.com';
const V = '20261014-p2';
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
      faqs[]{question,answer},sectionsHeading,sections[]{heading,body},"relatedCases":relatedCases[]->slug.current,seo{metaTitle,metaDescription,keywords}}`);
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

async function loadIndustries() {
  try {
    const rows = await sanityQuery(`*[_type=="industry" && !(hidden==true) && defined(slug.current) && !(_id in path("drafts.**"))]|order(orderRank asc){
      name,"slug":slug.current,accent,audience,audienceSingular,heroHeadline,shortDescription,intro,example,recommendedPlan,
      painPoints[]{title,description},systems[]{title,description},faqs[]{question,answer},
      "relatedServices":relatedServices[]->slug.current,seo{metaTitle,metaDescription,keywords}}`);
    if (rows && rows.length) return { industries: rows, source: 'Sanity' };
    console.warn('WARNING: no industry pages in Sanity yet; using data/industry-pages.json');
  } catch (err) {
    console.warn(`WARNING: Sanity industries fetch failed (${err.message}); using data/industry-pages.json`);
  }
  return { industries: JSON.parse(fs.readFileSync(path.join(root, 'data', 'industry-pages.json'), 'utf8')), source: 'data/industry-pages.json' };
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
function shell({ title, description, canonical, page, ogType = 'website', jsonLd = [], head = '', body }) {
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
${head ? `${head}\n` : ''}<meta name="robots" content="index, follow">
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
// In-depth CMS copy: paragraphs split on blank lines, [text](/path) links to this site only.
const richText = (text) => String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  .map((p) => `<p>${e(p).replace(/\[([^\]]+)\]\((\/[a-z0-9/#-]*)\)/g, '<a href="$2">$1</a>')}</p>`).join('');
const sectionsBlock = (s) => (s.sections || []).length ? `
<section class="v-section">
  <div class="wrap">
    ${s.sectionsHeading ? `<div class="v-head"><span class="v-kicker">In depth</span><h2>${e(s.sectionsHeading)}</h2></div>` : ''}
    <div class="lp-story" style="margin:0 auto">${s.sections.map((x) => `<div class="lp-story-row"><h2>${e(x.heading)}</h2><div>${richText(x.body)}</div></div>`).join('')}</div>
  </div>
</section>` : '';
const caseCard = (c) => `<a class="v-case" href="/case-studies/${c.slug}"><div class="shot" role="img" aria-label="${e(c.client)} website" style="background-image:url('${e(img(c.hero))}')"></div><div class="meta"><div><b>${e(c.client)}</b><small>${e(c.sector)}</small></div><span class="go">${ARROW}</span></div></a>`;

/* ---------- service page ---------- */
// Keyword-led anchor text for links to industry pages (see the SEO keyword strategy).
const INDUSTRY_ANCHOR = {
  'cleaning-services': 'Cleaning company websites', 'car-detailing': 'Car detailing websites', 'salons-and-spas': 'Salon and spa websites',
  clinics: 'Clinic websites', 'home-services': 'Contractor websites', 'ai-receptionist-for-medical-practices': 'AI receptionist for medical practices', 'coaches-and-consultants': 'Coach and consultant websites',
};
const industryLinks = (industries, heading) => (industries || []).length ? `
<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Industries</span><h2>${heading}</h2></div>
    <div class="lp-links">${industries.map((d) => `<a class="lp-link" href="/solutions/${d.slug}"><b>${e(INDUSTRY_ANCHOR[d.slug] || d.name)}</b><span>${e(d.shortDescription)}</span><em>See how it works &rarr;</em></a>`).join('')}</div>
  </div>
</section>` : '';
function servicePage(s, cases, art, industries) {
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
${industryLinks(industries, `${e(s.name)} for <span class="serif">your industry</span>`)}
${related.length ? `
<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Our work</span><h2>Recent projects</h2></div>
    <div class="v-work">${related.map(caseCard).join('')}</div>
    <div class="v-more"><a class="btn btn-quiet" href="/case-studies">View all case studies</a></div>
  </div>
</section>` : ''}
${sectionsBlock(s)}
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

/* ---------- industry pages ---------- */
const PLAN_PRICE = { Starter: '$199/month', Growth: '$399/month', Scale: 'from $699/month' };
const X_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M6 6l12 12M18 6L6 18"/></svg>';

function industryPage(d, services) {
  const url = `${ORIGIN}/solutions/${d.slug}`;
  const title = (d.seo && d.seo.metaTitle) || `Websites & Software for ${d.name} | Velaris Web`;
  const description = (d.seo && d.seo.metaDescription) || d.shortDescription;
  const accent = d.accent || '#127AFE';
  const low = d.name.toLowerCase();
  // Who the page is for: "medical practices" reads better than "ai receptionist for medical practices businesses".
  const who = d.audience || `${low} businesses`;
  const whoOne = d.audienceSingular || `${low} business`;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Industries', href: '/solutions' }, { name: d.name, href: `/solutions/${d.slug}` }];
  const related = (d.relatedServices || []).map((slug) => services.find((s) => s.slug === slug)).filter(Boolean).slice(0, 4);
  const plan = PLAN_PRICE[d.recommendedPlan] ? d.recommendedPlan : 'Growth';
  const waMsg = `Hi Velaris, I run a ${whoOne} and I'd like to grow it.`;
  const tick = CHECK.replace('<svg', '<svg class="v-check"');
  const body = `
<section class="lp-hero" style="--accent:${e(accent)}">
  <div class="wrap lp-hero-grid">
    <div>
      ${crumbs(trail)}
      <span class="v-kicker">For ${e(d.audience || low)}</span>
      <h1>${e(d.heroHeadline || d.name)}</h1>
      <p class="lede">${e(d.intro)}</p>
      <div class="v-hero-cta">${waBtn(waMsg)}<a class="btn btn-quiet" href="/pricing">See plans from $199/mo</a></div>
      <ul class="v-ticks"><li>${tick}No upfront cost</li><li>${tick}Preview in 5 business days</li><li>${tick}Cancel anytime</li></ul>
    </div>
    ${d.example ? `<div class="lp-day"><small>How it works day to day</small><p>${e(d.example)}</p><div class="lp-day-plan"><span>Most ${e(who)} choose</span><b>${plan} &middot; ${PLAN_PRICE[plan]}</b></div></div>` : ''}
  </div>
</section>
${(d.painPoints || []).length ? `
<section class="v-section soft">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">The problem</span><h2>Where ${e(who)} <span class="serif">lose revenue</span></h2></div>
    <div class="lp-pains">${d.painPoints.map((p) => `<div class="lp-pain"><span class="x">${X_ICON}</span><h3>${e(p.title)}</h3><p>${e(p.description)}</p></div>`).join('')}</div>
  </div>
</section>` : ''}

<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">What we build</span><h2>The system that <span class="serif">fixes it</span></h2><p>Built around how ${e(who)} work, and run for you on one monthly plan.</p></div>
    <div class="lp-caps">${(d.systems || []).map((c, i) => `<div class="v-feat"><span class="ic lp-num" style="color:${e(accent)}">${String(i + 1).padStart(2, '0')}</span><h3>${e(c.title)}</h3><p>${e(c.description)}</p></div>`).join('')}</div>
  </div>
</section>
${related.length ? `
<section class="v-section soft">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Services</span><h2>What&rsquo;s included</h2></div>
    <div class="lp-links">${related.map((s) => `<a class="lp-link" href="/services/${s.slug}"><b>${e(s.name)}</b><span>${e(s.shortDescription)}</span><em>Learn more &rarr;</em></a>`).join('')}</div>
  </div>
</section>` : ''}
${(d.faqs || []).length ? faqBlock(d.faqs, `Questions from <span class="serif">${e(who)}</span>`, `Common questions we get. Can't find yours? Message us.`, `Hi Velaris, I have a question about a system for my ${low} business.`) : ''}
${ctaBlock('Get started', `Ready to grow your ${whoOne}?`, 'Message us on WhatsApp. If we are a fit, your preview is ready within 5 business days.', waMsg)}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Service', name: `Websites and software for ${d.name}`, serviceType: 'Website and business software',
      description, url, audience: { '@type': 'BusinessAudience', name: d.name },
      provider: { '@type': 'Organization', name: 'Velaris Web', url: `${ORIGIN}/`, logo: LOGO }, areaServed: 'Worldwide',
      offers: { '@type': 'AggregateOffer', lowPrice: '199', priceCurrency: 'USD', offerCount: 3, url: `${ORIGIN}/pricing` },
    },
    crumbLd(trail),
  ];
  if ((d.faqs || []).length) jsonLd.push(faqLd(d.faqs));
  return shell({ title, description, canonical: url, page: 'industries', jsonLd, body });
}

function industriesIndex(industries) {
  const trail = [{ name: 'Home', href: '/' }, { name: 'Industries', href: '/solutions' }];
  const body = `
<section class="v-phero">
  <div class="wrap">
    ${crumbs(trail)}
    <span class="v-pill"><b>Industries</b> Systems built for how you work</span>
    <h1>Web design for service businesses, <span class="serif">built for your industry</span></h1>
    <p>Websites, booking, rebooking and lead follow-up designed around how your type of business wins and keeps customers. One monthly plan from $199/month.</p>
    <div class="v-hero-cta"><a class="btn btn-blue" href="/pricing">See plans &amp; pricing ${ARROW}</a>${waBtn('Hi Velaris, what would you build for my business?')}</div>
  </div>
</section>
<section class="v-section" style="padding-top:64px">
  <div class="wrap lp-ind-grid">${industries.map((d) => `<a class="lp-ind" href="/solutions/${d.slug}" style="--accent:${e(d.accent || '#127AFE')}"><h2>${e(d.name)}</h2><p>${e(d.shortDescription)}</p><span class="more">See the system ${ARROW}</span></a>`).join('')}</div>
</section>

<section class="v-section soft">
  <div class="wrap lp-story">
    <div class="lp-story-row"><h2>Why industry-specific websites win more customers</h2><div><p>A cleaning company, a clinic and a roofing contractor all need a website, but they win customers in completely different ways. Cleaners grow on recurring contracts, so the website needs instant quotes and repeat bookings. Clinics lose money to no-shows, so it needs online booking, reminders and recalls. Contractors live and die by how fast they reply, so it needs a quote form and an instant response.</p><p>That is why we build web design for service businesses around the way each industry works. Every system starts with a fast, mobile-first website that ranks in local search, then adds the tools your type of business actually uses: booking, quote calculators, follow-up messages, review requests and a dashboard that shows the enquiries and revenue it brings in.</p><p>Everything runs on one monthly plan from $199/month, with no upfront build fee. You see a working preview within 5 business days, and we keep improving it every month based on what brings you customers.</p></div></div>
  </div>
</section>
${ctaBlock("Don't see your industry?", 'We build for most service businesses', 'Tell us how your business gets and keeps customers, and we will show you what we would build.', 'Hi Velaris, my industry is not listed. Can you help?')}`;
  return shell({
    title: 'Web Design for Service Businesses by Industry | Velaris Web',
    description: 'Websites, booking systems and follow-up built for cleaners, detailers, salons, clinics, trades and coaches. Monthly plans from $199.',
    canonical: `${ORIGIN}/solutions`, page: 'industries',
    jsonLd: [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: industries.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.name, url: `${ORIGIN}/solutions/${d.slug}` })) }],
    body,
  });
}

/* ---------- index pages ---------- */
function servicesIndex(services, art) {
  const trail = [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }];
  const body = `
<section class="v-phero">
  <div class="wrap">
    ${crumbs(trail)}
    <span class="v-pill"><b>Services</b> Websites, software &amp; AI on one plan</span>
    <h1>Web design, software and AI services <span class="serif">for small businesses</span></h1>
    <p>Custom websites, booking systems, AI automation, local SEO and more, built to work together and run for you on one monthly plan from $199/month.</p>
    <div class="v-hero-cta"><a class="btn btn-blue" href="/pricing">See plans &amp; pricing ${ARROW}</a>${waBtn('Hi Velaris, I would like to know which service fits my business.')}</div>
  </div>
</section>
<section class="v-section" style="padding-top:64px">
  <div class="wrap lp-svc-grid">
    ${services.map((s) => `<a class="v-svc" href="/services/${s.slug}" style="--accent:${e(s.accent || '#127AFE')}"><h2 class="lp-svc-name">${e(s.name)}</h2><p>${e(s.shortDescription)}</p><span class="more" style="color:${e(s.accent || '#127AFE')}">Explore ${e(lc(s.name))} ${ARROW}</span><div class="art" aria-hidden="true">${art[s.slug] || ''}</div></a>`).join('\n    ')}
  </div>
</section>

<section class="v-section soft">
  <div class="wrap lp-story">
    <div class="lp-story-row"><h2>One team for your whole growth system</h2><div><p>Most small businesses end up with a website from one freelancer, a booking app from another company, an SEO contractor and a pile of logins. Nothing talks to anything else, and nobody is responsible for whether it brings in customers. We build and run all of it together, so every piece is aimed at the same result: more enquiries, more bookings and more repeat customers.</p><p>Start with <a href="/services/web-design">custom website design for small business</a>, then add a <a href="/services/custom-software">booking system or CRM</a>, an <a href="/services/ai-solutions">AI receptionist</a> that answers and books customers at any hour, <a href="/services/seo">local SEO</a> and <a href="/services/local-listings">Google Business Profile management</a> to get found, plus <a href="/services/ecommerce">ecommerce</a> and <a href="/services/business-email">business email</a> when you need them.</p><p>Every service is included in a monthly plan with no setup fee and no long contract. <a href="/pricing">Compare the plans</a> or message us and we will tell you honestly which pieces your business needs first.</p></div></div>
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
    <h1>Small business website examples <span class="serif">and case studies</span></h1>
    <p>Real small business website examples from healthcare, property, finance, engineering and tech, with what we built and the results each business saw after launch.</p>
  </div>
</section>
<section class="v-section" style="padding-top:64px">
  <div class="wrap"><div class="v-work">${cases.map(caseCard).join('')}</div></div>
</section>

<section class="v-section soft">
  <div class="wrap lp-story">
    <div class="lp-story-row"><h2>What these small business websites have in common</h2><div><p>Every project here started with the same question: what does this business need its website to do? For some it was more enquiries from local search, for others a booking flow that cut admin, or a site that finally matched the quality of their work so they could charge what they are worth.</p><p>Each case study shows the challenge, what we built and the results after launch. If you run a service business, look for the one closest to yours, then see what we build for your industry on our <a href="/solutions">industry pages</a> or compare <a href="/pricing">monthly plans</a>.</p></div></div>
  </div>
</section>
${ctaBlock('Your project next', 'Want a website like these?', 'Message us on WhatsApp. Your website preview is ready within 5 business days.', 'Hi Velaris, I saw your case studies and would like a website for my business.')}`;
  return shell({
    title: 'Small Business Website Examples & Case Studies | Velaris Web',
    description: 'Real small business website examples and case studies from Velaris Web, with the results each business saw after launch.',
    canonical: `${ORIGIN}/case-studies`, page: 'cases',
    jsonLd: [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: cases.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.client, url: `${ORIGIN}/case-studies/${c.slug}` })) }],
    body,
  });
}

/* ---------- subscription pages ---------- */
// /website-subscription (US/international) and /pay-monthly-website (UK). Static copy, written for each audience.
const tick = CHECK.replace('<svg', '<svg class="v-check"');
const PLANS = [
  { name: 'Starter', usd: '199', gbp: '150', for: 'Get online fast and start winning enquiries.', items: ['Custom website, up to 5 pages', 'Domain, hosting, SSL &amp; security', '10 content updates a month', 'SEO setup &amp; Google Maps listing', '1 business email'] },
  { name: 'Growth', usd: '399', gbp: '300', pop: true, for: 'More leads, repeat customers and clear numbers.', items: ['Premium custom design, up to 15 pages', 'Online booking with reminders', 'Unlimited content updates', 'On-page SEO &amp; 2 blog posts a month', 'Google Business Profile management'] },
  { name: 'Scale', usd: '699', gbp: '525', plus: true, for: 'Your own software and AI, built and run for you.', items: ['Everything in Growth', 'CRM, client portal or rebooking engine', 'AI chatbot or workflow automation', 'Integrations with your tools', 'Dedicated account manager'] },
];
function planCards(uk) {
  return `<div class="v-plans">${PLANS.map((p) => {
    const price = p.plus ? `from $${p.usd}/month` : `$${p.usd}/month`;
    const amt = uk
      ? `<div class="amt"><sup>£</sup><b>${p.gbp}</b><span>${p.plus ? '+' : ''}/month*</span></div><p class="setup">Billed as ${price} &middot; no setup fee</p>`
      : `<div class="amt"><sup>$</sup><b>${p.usd}</b><span>${p.plus ? '+' : ''}/month</span></div><p class="setup">No setup fee &middot; cancel anytime</p>`;
    return `<div class="v-plan${p.pop ? ' pop' : ''}">${p.pop ? '<span class="badge">MOST POPULAR</span>' : ''}<h3>${p.name}</h3><p class="for">${p.for}</p>${amt}<a class="btn ${p.pop ? 'btn-blue' : 'btn-quiet'}" href="${WA}" data-plan="${p.name}" data-price="${price}" data-wa="Hi Velaris, I'm interested in the ${p.name} plan (${price})${uk ? ' for my UK business' : ''}.">Get started</a><ul>${p.items.map((t) => `<li>${CHECK}${t}</li>`).join('')}</ul></div>`;
  }).join('')}</div>`;
}
const costTable = (cols, rows, caption) => `<div class="v-table-wrap"><table class="v-table"><thead><tr><th scope="col">&nbsp;</th>${cols.map((c, i) => `<th scope="col"${i === cols.length - 1 ? ' class="pop"' : ''}>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td>${r.slice(1).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const storyRows = (rows) => `<div class="wrap lp-story">${rows.map(([h, html]) => `<div class="lp-story-row"><h2>${h}</h2><div>${html}</div></div>`).join('')}</div>`;
const subscriptionLd = (url, name, description, faqs, trail) => [
  {
    '@context': 'https://schema.org', '@type': 'Service', name, serviceType: 'Website design, hosting and maintenance subscription', description, url,
    provider: { '@type': 'Organization', name: 'Velaris Web', url: `${ORIGIN}/`, logo: LOGO },
    offers: PLANS.map((p) => ({ '@type': 'Offer', name: p.name, price: p.usd, priceCurrency: 'USD', url: `${ORIGIN}/pricing`,
      priceSpecification: { '@type': 'UnitPriceSpecification', price: p.usd, priceCurrency: 'USD', unitText: 'MONTH' } })),
  },
  crumbLd(trail),
  faqLd(faqs),
];
const hreflang = `<link rel="alternate" hreflang="en" href="${ORIGIN}/website-subscription">
<link rel="alternate" hreflang="en-GB" href="${ORIGIN}/pay-monthly-website">
<link rel="alternate" hreflang="x-default" href="${ORIGIN}/website-subscription">`;
const casesStrip = (cases) => cases.length ? `
<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Examples</span><h2>Websites we build and run <span class="serif">every month</span></h2></div>
    <div class="v-work">${cases.slice(0, 3).map(caseCard).join('')}</div>
    <div class="v-more"><a class="btn btn-quiet" href="/case-studies">See all case studies</a></div>
  </div>
</section>` : '';

function websiteSubscriptionPage(cases) {
  const url = `${ORIGIN}/website-subscription`;
  const title = 'Web Design Subscription for Small Businesses | Velaris Web';
  const description = 'A web design subscription from $199/month: custom website, hosting, updates and support with no upfront cost. See what each plan includes.';
  const trail = [{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }, { name: 'Web design subscription', href: '/website-subscription' }];
  const waMsg = "Hi Velaris, I'd like to know more about your web design subscription.";
  const faqs = [
    { question: 'What is a web design subscription?', answer: 'A web design subscription replaces the big upfront cost of a website with one monthly fee. The fee covers the custom design and build, hosting, security, backups, content updates and support, so your website keeps improving instead of going out of date.' },
    { question: 'What is website as a service?', answer: 'Website as a service is another name for the same model: you pay monthly for a website that is built, hosted and maintained for you, rather than buying it once and looking after it yourself.' },
    { question: 'How much does a web design subscription cost?', answer: 'Our plans are $199, $399 and from $699 a month. Starter covers a custom website up to 5 pages; Growth adds booking, unlimited updates and SEO; Scale adds custom software and AI. There is no setup fee.' },
    { question: 'Who owns the website and domain?', answer: 'Your domain is registered in your name, and your business name, logo, content and data are always yours. What happens to the website itself if you cancel, including any option to transfer or buy it out, is agreed with you in writing before work starts.' },
    { question: 'Can I cancel my subscription?', answer: "Yes. Plans are month-to-month and you can cancel anytime with 30 days' notice by email or WhatsApp. There is no long contract." },
    { question: 'Is a subscription cheaper than a one-off website?', answer: 'In the first year, almost always: you pay nothing upfront. Over three years the total is similar to a mid-priced agency build plus hosting and maintenance, but the subscription includes updates, fixes and SEO work that a one-off build charges for separately.' },
    { question: 'How long does it take to launch?', answer: 'You see a working preview within 5 business days of our kick-off call. Most sites go live within two to three weeks, depending on how quickly content and feedback come back.' },
    { question: 'Can I change plans later?', answer: 'Yes. You can upgrade or downgrade at the start of any billing month. We add the new features to your existing site, with no rebuild and no downtime.' },
  ];
  const body = `
<section class="v-phero">
  <div class="wrap">
    ${crumbs(trail)}
    <span class="v-pill"><b>Website as a service</b> From $199/month &middot; no upfront cost</span>
    <h1>Web design subscription <span class="serif">for small businesses</span></h1>
    <p>Our web design subscription gives your small business a custom website, hosting, security, updates and support for one monthly fee, with no upfront cost and no long contract. We design and build the site, then keep running and improving it every month, so it keeps bringing in enquiries instead of going stale.</p>
    <div class="v-hero-cta"><a class="btn btn-blue" href="#plans">See subscription plans ${ARROW}</a>${waBtn(waMsg)}</div>
    <ul class="v-ticks"><li>${tick}No setup fee</li><li>${tick}Preview in 5 business days</li><li>${tick}Cancel with 30 days' notice</li></ul>
  </div>
</section>

<section class="v-section" style="padding-top:72px">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">How it works</span><h2>How our website subscription <span class="serif">works</span></h2></div>
    <div class="v-steps">
      <div class="v-step"><h3>Free call</h3><p>We learn how your business wins customers and recommend a plan. No obligation.</p></div>
      <div class="v-step"><h3>Preview in 5 days</h3><p>You see a working preview of your custom site within 5 business days, then we refine it with you.</p></div>
      <div class="v-step"><h3>Launch</h3><p>We connect your domain, set up hosting, email, analytics and Google listings, and go live.</p></div>
      <div class="v-step"><h3>Monthly care</h3><p>Send changes on WhatsApp or email. We make updates, fix issues and improve what brings in enquiries.</p></div>
    </div>
  </div>
</section>

<section class="v-section soft" id="plans">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Plans</span><h2>Monthly website packages, <span class="serif">everything included</span></h2><p>Every plan includes design, hosting, SSL, backups, security and support. <a href="/pricing#compare">Compare every feature</a>.</p></div>
    ${planCards(false)}
  </div>
</section>

<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">The numbers</span><h2>Three-year cost: subscription vs <span class="serif">a one-off build</span></h2><p>Typical ranges for a small business website, so you can compare honestly.</p></div>
    ${costTable(['One-off agency build', 'DIY website builder', 'Velaris subscription'], [
      ['Upfront cost', '$5,000&ndash;$15,000', '$0', '<b>$0</b>'],
      ['Monthly cost', '$50&ndash;$200 for hosting and maintenance', '$30&ndash;$60 plan', '<b>$199</b> (Starter) or <b>$399</b> (Growth)'],
      ['Content updates', 'Billed per change', 'You do them yourself', 'Included'],
      ['Security, fixes and backups', 'Often extra', 'Basic', 'Included'],
      ['SEO and Google listings', 'Extra', 'You do them yourself', 'Included'],
      ['Custom design', 'Yes', 'Template', 'Yes'],
      ['Typical 3-year total', '$6,800&ndash;$22,200', '$1,080&ndash;$2,160 plus your time', '<b>$7,164</b> (Starter) or <b>$14,364</b> (Growth)'],
    ], 'Three-year cost comparison of website options')}
  </div>
</section>

<section class="v-section soft">
  ${storyRows([
    ['Who owns the website?', "<p>Your domain is registered in your name, and your business name, logo, content and data always belong to you. What happens to the website itself if you leave, including any option to transfer or buy it out, is written into your proposal before work starts, so there are no surprises. If you would rather own everything outright from day one, we also build <a href=\"/pricing#custom\">one-off website projects</a>.</p>"],
    ['Cancelling', "<p>Every plan is month-to-month. You can cancel anytime with 30 days' notice by email or WhatsApp, with no exit fee. Most clients stay because the website keeps bringing in work, not because they are locked in.</p>"],
    ['Is a subscription right for you?', `<p>A web design subscription suits service businesses that want a professional website without a large upfront bill, and want someone to keep it fast, secure and up to date. If you only need a simple page you will never change, a DIY builder may be enough. Read <a href="/blog/website-cost-per-month-small-business">how much a website costs per month for a small business</a> and our honest comparison of a <a href="/blog/web-design-subscription-vs-one-time">web design subscription vs a one-time payment</a>, or see five <a href="/blog/website-as-a-service">website as a service examples</a>. If you are in the UK, see our <a href="/pay-monthly-website">pay monthly websites for UK small businesses</a>. Compare every plan on our <a href="/pricing">small business web design packages</a> page, or see which system fits <a href="/solutions">your industry</a>.</p>`],
  ])}
</section>
${casesStrip(cases)}
${faqBlock(faqs, 'Web design subscription <span class="serif">questions</span>', "Common questions about website subscriptions. Can't find yours? Message us.", waMsg)}
${ctaBlock('Get started', 'Start your web design subscription', 'Message us on WhatsApp. If we are a fit, your preview is ready within 5 business days.', waMsg)}`;
  return shell({ title, description, canonical: url, page: 'pricing', head: hreflang, jsonLd: subscriptionLd(url, 'Web design subscription', description, faqs, trail), body });
}

function payMonthlyPage(cases) {
  const url = `${ORIGIN}/pay-monthly-website`;
  const title = 'Pay Monthly Websites for Small Businesses (UK) | Velaris Web';
  const description = 'Pay monthly websites for UK small businesses: design, hosting and updates in one monthly fee, no upfront cost and no long contract. Guide prices in £.';
  const trail = [{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }, { name: 'Pay monthly websites (UK)', href: '/pay-monthly-website' }];
  const waMsg = "Hi Velaris, I run a UK business and I'm interested in a pay monthly website.";
  const faqs = [
    { question: 'How much is a pay monthly website in the UK?', answer: 'Our plans are billed at $199, $399 and from $699 a month, which is roughly £150, £300 and from £525 at current exchange rates. There is no setup fee, and hosting, security and updates are included.' },
    { question: 'Why are your prices in US dollars?', answer: 'We work with small businesses in the UK, US and Canada and bill every client in US dollars by card or bank transfer. The pound amount you pay moves slightly with the exchange rate, and your bank may add a small conversion fee.' },
    { question: 'Do your prices include VAT?', answer: 'No VAT is added to our invoices. If your business is VAT-registered, ask your accountant whether you need to account for VAT under the reverse charge.' },
    { question: 'Is there a minimum contract?', answer: "No. Plans are month-to-month and you can cancel anytime with 30 days' notice. There are no 12 or 24-month tie-ins." },
    { question: 'Who owns my domain and content?', answer: 'Your domain, whether .co.uk or .com, is registered in your name, and your logo, content and customer data are always yours. What happens to the website itself if you cancel, including transfer or buy-out options, is agreed in writing before we start.' },
    { question: 'Can you help my business show up on Google Maps?', answer: 'Yes. Every plan includes Google Maps and Apple Maps listings, and Growth includes ongoing Google Business Profile management to help you appear in local searches in your town.' },
    { question: 'Pay monthly or a one-off website: which is better?', answer: 'Pay monthly is better if you want no upfront cost and someone to keep the site updated and secure. A one-off build suits businesses that want to own everything outright and are happy to manage hosting and changes themselves. We offer both.' },
    { question: 'How quickly can my website go live?', answer: 'You see a working preview within 5 business days of our first call, and most sites launch within two to three weeks.' },
  ];
  const body = `
<section class="v-phero">
  <div class="wrap">
    ${crumbs(trail)}
    <span class="v-pill"><b>For UK businesses</b> No upfront cost &middot; no tie-in</span>
    <h1>Pay monthly websites <span class="serif">for UK small businesses</span></h1>
    <p>Our pay monthly websites give UK small businesses a professionally designed website, hosting, security and updates for one monthly fee, with nothing to pay upfront and no long contract. Ideal for tradespeople, salons, clinics, cleaners and consultants who want a site that wins enquiries without a £3,000 bill on day one.</p>
    <div class="v-hero-cta"><a class="btn btn-blue" href="#plans">See monthly prices ${ARROW}</a>${waBtn(waMsg)}</div>
    <ul class="v-ticks"><li>${tick}No setup fee</li><li>${tick}Preview in 5 working days</li><li>${tick}Cancel with 30 days' notice</li></ul>
  </div>
</section>

<section class="v-section" style="padding-top:72px">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">What's included</span><h2>Everything your website needs, <span class="serif">in one monthly fee</span></h2></div>
    <div class="v-grid">
      <div class="v-feat"><h3>Bespoke design</h3><p>Designed around your business and customers. No off-the-shelf templates.</p></div>
      <div class="v-feat"><h3>Hosting &amp; security</h3><p>Fast hosting, SSL certificate, daily backups and security monitoring.</p></div>
      <div class="v-feat"><h3>Your .co.uk domain</h3><p>Registered in your name and connected for you, with a business email address.</p></div>
      <div class="v-feat"><h3>Changes when you need them</h3><p>Send updates by WhatsApp or email. No invoice for every small change.</p></div>
      <div class="v-feat"><h3>Local SEO</h3><p>Set up to rank in your town, with Google Maps and Apple Maps listings.</p></div>
      <div class="v-feat"><h3>Enquiry capture</h3><p>Quote forms, WhatsApp and click-to-call on every page, so visitors get in touch.</p></div>
      <div class="v-feat"><h3>Online booking</h3><p>Bookings with automatic reminders on the Growth plan, so fewer no-shows.</p></div>
      <div class="v-feat"><h3>Plain-English reports</h3><p>See visitors, enquiries and what's working each month.</p></div>
    </div>
  </div>
</section>

<section class="v-section soft" id="plans">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Prices</span><h2>Pay monthly website packages <span class="serif">for the UK</span></h2><p>Guide prices in pounds. No setup fee on any plan.</p></div>
    ${planCards(true)}
    <p class="v-plans-foot">*Plans are billed in US dollars; pound amounts are approximate and move with the exchange rate. No VAT is added to our invoices. <a href="/pricing#compare">Compare every feature</a></p>
  </div>
</section>

<section class="v-section">
  <div class="wrap">
    <div class="v-head"><span class="v-kicker">Compare</span><h2>Pay monthly vs a one-off website <span class="serif">in the UK</span></h2></div>
    ${costTable(['One-off website from a UK agency', 'Velaris pay monthly'], [
      ['Upfront cost', 'Often £2,000&ndash;£10,000', '<b>£0</b>'],
      ['Hosting, SSL and backups', 'Usually billed yearly on top', 'Included'],
      ['Updates and changes', 'Charged per change or by the hour', 'Included (10 a month, or unlimited on Growth)'],
      ['Local SEO and Google listings', 'Usually a separate service', 'Included'],
      ['Contract', 'Paid in full', "Monthly, 30 days' notice"],
      ['Best for', 'Owning everything outright and managing it yourself', 'No upfront cost and a site that keeps improving'],
    ], 'Pay monthly versus one-off website comparison for UK businesses')}
  </div>
</section>

<section class="v-section soft">
  ${storyRows([
    ['Built for UK customers', '<p>We write your website in UK English, with pound prices, local phone numbers and the towns you cover, so it reads like a local business, because it is one. Service-area pages help you show up for searches like &ldquo;plumber in Leeds&rdquo; or &ldquo;cleaner near me&rdquo;, and your Google Business Profile is set up to match.</p>'],
    ['Ownership and leaving', "<p>Your domain is registered in your name and your content is always yours. Plans run month to month with 30 days' notice to cancel, and what happens to the website itself if you leave is agreed in writing before we start. If you prefer to buy a website outright, we build <a href=\"/pricing#custom\">one-off projects</a> too.</p>"],
    ['Not in the UK?', '<p>See our <a href="/website-subscription">web design subscription</a> page for US and Canadian businesses, compare <a href="/pricing">all plans and features</a>, or find the system built for <a href="/solutions">your industry</a>.</p><p>Still weighing it up? Read <a href="/blog/website-cost-per-month-small-business">how much a website costs per month</a> and <a href="/blog/web-design-subscription-vs-one-time">pay monthly vs a one-off payment</a>.</p>'],
  ])}
</section>
${casesStrip(cases)}
${faqBlock(faqs, 'Pay monthly website <span class="serif">questions</span>', "Common questions from UK businesses. Can't find yours? Message us.", waMsg)}
${ctaBlock('Get started', 'Get your pay monthly website', 'Message us on WhatsApp. Your preview is ready within 5 working days.', waMsg)}`;
  return shell({ title, description, canonical: url, page: 'pricing', head: hreflang, jsonLd: subscriptionLd(url, 'Pay monthly websites for UK small businesses', description, faqs, trail), body });
}

/* ---------- build ---------- */
async function buildLandingPages({ distDir, fallbackCases }) {
  const [{ services, source: svcSource }, { cases, source: caseSource }, { industries, source: indSource }] =
    await Promise.all([loadServices(), loadCases(fallbackCases), loadIndustries()]);
  const safe = (list) => list.filter((x) => x.slug && /^[a-z0-9-]+$/.test(x.slug));
  const svc = safe(services);
  const cs = safe(cases);
  const ind = safe(industries);
  const paths = { services: svc.map((s) => `/services/${s.slug}`), cases: cs.map((c) => `/case-studies/${c.slug}`), industries: ['/solutions', ...ind.map((d) => `/solutions/${d.slug}`)], pages: ['/website-subscription', '/pay-monthly-website'] };
  if (!distDir) return paths;

  const art = serviceArt();
  for (const [dir, list, render] of [['services', svc, (s) => servicePage(s, cs, art, ind)], ['case-studies', cs, (c) => casePage(c, cs)], ['solutions', ind, (d) => industryPage(d, svc)]]) {
    const out = path.join(distDir, dir);
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out, { recursive: true });
    for (const item of list) fs.writeFileSync(path.join(out, `${item.slug}.html`), render(item));
  }
  // The /services and /case-studies rewrites point at these files in the web-app folder.
  const distApp = path.join(distDir, 'velaris-design-system', 'ui_kits', 'web-app');
  fs.writeFileSync(path.join(distApp, 'services.html'), servicesIndex(svc, art));
  fs.writeFileSync(path.join(distApp, 'work.html'), casesIndex(cs));
  fs.writeFileSync(path.join(distApp, 'industries.html'), industriesIndex(ind));
  fs.writeFileSync(path.join(distDir, 'website-subscription.html'), websiteSubscriptionPage(cs));
  fs.writeFileSync(path.join(distDir, 'pay-monthly-website.html'), payMonthlyPage(cs));
  console.log(`Prerendered ${svc.length} service pages (${svcSource}), ${cs.length} case studies (${caseSource}) and ${ind.length} industry pages (${indSource})`);
  return paths;
}

module.exports = { buildLandingPages };
