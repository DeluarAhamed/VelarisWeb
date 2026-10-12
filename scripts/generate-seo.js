const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { buildLandingPages } = require('./landing-pages');

const root = path.resolve(__dirname, '..');
const appDir = path.join(root, 'public', 'velaris-design-system', 'ui_kits', 'web-app');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');
const origin = 'https://velarisweb.com';

// Runs the same data files + Sanity bridge the browser runs, so prerendered
// pages match what visitors see. `sanityResponse` is the raw query response,
// or null to get the static fallback data (and the query URL to fetch).
function runSiteData(sanityResponse) {
  const context = {
    document: { body: { getAttribute: () => '' } },
    XMLHttpRequest: class {
      open(method, url) { context.sanityUrl = url; }
      send() {
        this.status = sanityResponse == null ? 0 : 200;
        this.responseText = sanityResponse || '';
      }
    },
  };
  context.window = context;
  for (const file of ['home-data.js', 'blog-data.js', 'sanity-config.js', 'sanity-bridge.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(appDir, file), 'utf8'), context, { filename: file });
  }
  return context;
}

async function loadSiteData() {
  const fallback = runSiteData(null);
  if (!fallback.sanityUrl) return { data: fallback, fallback, source: 'static files (Sanity not configured)' };
  try {
    const res = await fetch(fallback.sanityUrl, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();
    const data = runSiteData(raw);
    if (!data.VELARIS_CMS_LOADED) throw new Error(String(data.VELARIS_CMS_ERROR || 'bridge did not load'));
    return { data, fallback, source: 'Sanity', raw };
  } catch (error) {
    console.warn(`WARNING: Sanity fetch failed (${error.message}); using static blog-data.js`);
    return { data: fallback, fallback, source: 'static files (Sanity fetch failed)' };
  }
}

const decodeAmp = (value) => String(value == null ? '' : value).replace(/&amp;/g, '&');
const escapeHtml = (value) => decodeAmp(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const postPath = (slug) => `/blog/${slug}`;

function isoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Only posts rewritten around a target keyword are indexed; the templated rest get noindex and stay out of
// the sitemap and blog listing (see data/seo-targets.json and the SEO audit sheet).
const SEO_TARGETS = JSON.parse(fs.readFileSync(path.join(root, 'data', 'seo-targets.json'), 'utf8'));
const INDEXED_POSTS = new Set(SEO_TARGETS.indexedPosts || []);
const isIndexed = (post) => INDEXED_POSTS.has(post.slug);

const SHARE_IMAGE = 'https://velarisweb.com/velaris-design-system/assets/og-velaris.png';
const LOGO_IMAGE = 'https://velarisweb.com/velaris-design-system/assets/velaris-icon.png';

// Search results show ~155 characters; short CMS excerpts get topped up from the article's opening paragraph.
function metaDescription(post) {
  const clean = (value) => decodeAmp(value).replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  let text = clean(post.excerpt);
  if (text.length < 120) {
    const title = clean(post.title).toLowerCase();
    const para = [...String(post.body || '').matchAll(/<p>([\s\S]*?)<\/p>/gi)]
      .map((m) => clean(m[1]))
      .find((p) => p.length > 40 && !p.toLowerCase().startsWith(title));
    if (para) text = `${text.replace(/[.!?]?$/, '.')} ${para}`.trim();
  }
  if (text.length <= 158) return text;
  const cut = text.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '')}…`;
}

function replaceRequired(html, search, replacement, all = false) {
  if (!html.includes(search)) throw new Error(`post.html template no longer contains: ${search}`);
  return all ? html.split(search).join(replacement) : html.replace(search, () => replacement);
}

function relatedPosts(posts, post) {
  const related = posts.filter((p) => p.cat === post.cat && p.slug !== post.slug).slice(0, 3);
  for (const p of posts) {
    if (related.length >= 3) break;
    if (p.slug !== post.slug && !related.includes(p)) related.push(p);
  }
  return related;
}

function renderPost(template, posts, post, relatedPool) {
  const title = `${decodeAmp(post.title)} | Velaris Web`;
  const url = origin + postPath(post.slug);
  const published = isoDate(post.date);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: decodeAmp(post.title),
      description: decodeAmp(post.excerpt),
      ...(published && { datePublished: published }),
      articleSection: decodeAmp(post.cat),
      ...(post.kw && { keywords: decodeAmp(post.kw) }),
      mainEntityOfPage: url,
      url,
      image: SHARE_IMAGE,
      author: { '@type': 'Organization', name: 'Velaris Web', url: `${origin}/` },
      publisher: {
        '@type': 'Organization',
        name: 'Velaris Web',
        logo: { '@type': 'ImageObject', url: LOGO_IMAGE },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 3, name: decodeAmp(post.title), item: url },
      ],
    },
  ];
  const head = [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:url" content="${url}">`,
    published ? `<meta property="article:published_time" content="${published}">` : '',
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n');
  const related = relatedPosts(relatedPool && relatedPool.length > 1 ? relatedPool : posts, post).map((p) =>
    `<a class="pcard" href="${postPath(p.slug)}"><div class="thumb"><span class="topic">${escapeHtml(p.cat)}</span></div>` +
    `<div class="pb"><div class="tags"><span class="cat">${escapeHtml(p.cat)}</span><span>${escapeHtml(p.read)} min</span></div>` +
    `<h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.excerpt)}</p><span class="more">Read more</span></div></a>`
  ).join('');

  let html = template;
  html = replaceRequired(html, 'Blog Article | Velaris Web', escapeHtml(title), true);
  html = replaceRequired(html, 'Read a Velaris Web article on web design, SEO, conversion strategy, lead generation and online growth.', escapeHtml(metaDescription(post)), true);
  html = replaceRequired(html, '<meta property="og:type" content="website">', '<meta property="og:type" content="article">');
  html = replaceRequired(html, '<meta name="robots" content="index, follow">', `<meta name="robots" content="${isIndexed(post) ? 'index, follow' : 'noindex, follow'}">\n${head}`);
  html = replaceRequired(html, '<div id="postDetail">', '<div id="postDetail" data-prerendered>');
  html = replaceRequired(html, '<span data-crumb>Article</span>', `<span data-crumb>${escapeHtml(post.cat)}</span>`);
  html = replaceRequired(html, '<span class="cat" data-cat>Category</span>', `<span class="cat" data-cat>${escapeHtml(post.cat)}</span>`);
  html = replaceRequired(html, '<span data-date>—</span>', `<span data-date>${escapeHtml(post.date)}</span>`);
  html = replaceRequired(html, '<span data-read>—</span>', `<span data-read>${escapeHtml(post.read)} min read</span>`);
  html = replaceRequired(html, '<h1 data-title>Article title</h1>', `<h1 data-title>${escapeHtml(post.title)}</h1>`);
  html = replaceRequired(html, '<span class="topic" data-topic>Category</span>', `<span class="topic" data-topic>${escapeHtml(post.cat)}</span>`);
  html = replaceRequired(html, '<article class="prose" data-body></article>', `<article class="prose" data-body>${post.body || ''}</article>`);
  html = replaceRequired(html, '<div class="posts-grid" data-related></div>', `<div class="posts-grid" data-related>${related}</div>`);
  return html;
}

/* ---------- Speed: static CMS snapshot instead of a blocking request on every page view ---------- */
const appDist = () => path.join(distDir, 'velaris-design-system', 'ui_kits', 'web-app');
const BUILD = Date.now().toString(36);
function writeCmsSnapshot(raw) {
  if (!raw) { console.warn('WARNING: no Sanity response; pages fall back to the live CMS request'); return; }
  const json = JSON.parse(raw);
  const result = json.result || {};
  // Listing data only: prerendered pages already contain article bodies, and only indexed posts are listed.
  result.posts = (result.posts || []).filter((p) => p.slug && INDEXED_POSTS.has(p.slug.current))
    .map(({ body, legacyHtmlBody, ...rest }) => rest);
  const out = '/* Built from Sanity at deploy time; replaces the runtime CMS request. */\nwindow.VELARIS_CMS_SNAPSHOT=' + JSON.stringify(json).replace(/</g, '\\u003c') + ';\n';
  fs.writeFileSync(path.join(appDist(), 'cms-snapshot.js'), out);
  console.log(`Wrote cms-snapshot.js (${Math.round(out.length / 1024)} KB, ${result.posts.length} listed posts)`);
}

// Blog index: render the post list into the HTML so crawlers see real links (pages.js re-renders the same list).
function prerenderBlogList(list) {
  const file = path.join(appDist(), 'blog.html');
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const cards = list.map((p) => `<a class="pcard" href="${postPath(p.slug)}"><div class="thumb"><span class="topic">${escapeHtml(p.cat)}</span></div>` +
    `<div class="pb"><div class="tags"><span class="cat">${escapeHtml(p.cat)}</span><span>${escapeHtml(p.read)} min</span></div>` +
    `<h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.excerpt)}</p><span class="more">Read more</span></div></a>`).join('');
  html = html.replace('<div class="posts-grid" id="blogGrid"></div>', `<div class="posts-grid" id="blogGrid">${cards}</div>`);
  fs.writeFileSync(file, html);
  console.log(`Prerendered ${list.length} posts into /blog`);
}

// Every public page: CMS snapshot before the bridge, no 1.8 MB blog-data.js, fonts preloaded and loaded without blocking.
function optimiseHtml() {
  const files = [];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) { if (!/preview|scraps|admin|assets|fonts/.test(d.name)) walk(p); }
    else if (d.name.endsWith('.html')) files.push(p);
  });
  walk(distDir);
  const hasSnapshot = fs.existsSync(path.join(appDist(), 'cms-snapshot.js'));
  const fontHead = [
    '<link rel="preload" href="/velaris-design-system/fonts/CabinetGrotesk-Regular.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preload" href="/velaris-design-system/fonts/CabinetGrotesk-Bold.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" media="print" onload="this.media=\'all\'">',
  ].join('\n');
  let changed = 0;
  for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('sanity-bridge.js')) continue; // admin, dashboard and other non-site pages
    const before = html;
    if (hasSnapshot && !html.includes('cms-snapshot.js')) {
      html = html.replace(/(<script src="[^"]*sanity-bridge\.js[^"]*"><\/script>)/, `<script src="/velaris-design-system/ui_kits/web-app/cms-snapshot.js?v=${BUILD}"></script>\n$1`);
      html = html.replace(/<script src="[^"]*blog-data\.js[^"]*"><\/script>\n?/g, '');
    }
    if (!html.includes('CabinetGrotesk-Regular.woff2')) html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n${fontHead}`);
    if (html !== before) { fs.writeFileSync(file, html); changed++; }
  }
  console.log(`Optimised ${changed} HTML pages (CMS snapshot, fonts)`);
}

async function main() {
  const { data, fallback, source, raw } = await loadSiteData();
  const seen = new Set();
  const posts = (data.VELARIS_POSTS || []).filter((post) => {
    if (!post.slug || !/^[a-z0-9-]+$/i.test(post.slug) || seen.has(post.slug)) {
      console.warn(`WARNING: skipping post with missing, unsafe or duplicate slug: ${JSON.stringify(post.slug)}`);
      return false;
    }
    seen.add(post.slug);
    return true;
  });

  const staticPaths = ['/', '/services', '/case-studies', '/pricing', '/resources', '/blog', '/about', '/contact', '/privacy', '/terms'];
  // Service and case-study landing pages (prerendered into dist/ when it exists).
  const landing = await buildLandingPages({
    distDir: fs.existsSync(distDir) ? distDir : null,
    fallbackCases: fallback.VELARIS_CASES,
  });
  const servicePaths = landing.services;
  const casePaths = landing.cases;
  const postPaths = posts.filter(isIndexed).map((post) => postPath(post.slug));
  const paths = [...new Set([...staticPaths, ...servicePaths, ...(landing.industries || []), ...casePaths, ...postPaths])];

  // lastmod helps Google decide what to recrawl: articles use their publish date, generated pages the build date.
  const buildDate = new Date().toISOString().slice(0, 10);
  const lastmod = Object.fromEntries(posts.map((post) => [postPath(post.slug), [isoDate(post.date), buildDate].sort()[0]]));
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((urlPath) => `  <url><loc>${escapeXml(origin + urlPath)}</loc><lastmod>${lastmod[urlPath] || buildDate}</lastmod></url>`),
    '</urlset>',
    '',
  ].join('\n');
  const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /dashboard', 'Disallow: /api/', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n');

  const outDirs = [publicDir, ...(fs.existsSync(distDir) ? [distDir] : [])];
  for (const dir of outDirs) {
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap);
    fs.writeFileSync(path.join(dir, 'robots.txt'), robots);
  }
  console.log(`Generated sitemap.xml with ${paths.length} canonical URLs and robots.txt`);

  if (!fs.existsSync(distDir)) {
    console.log('No dist/ folder yet; skipped prerendering blog posts.');
    return;
  }
  const template = fs.readFileSync(path.join(appDir, 'post.html'), 'utf8');
  const blogDir = path.join(distDir, 'blog');
  fs.rmSync(blogDir, { recursive: true, force: true });
  fs.mkdirSync(blogDir, { recursive: true });
  const indexedPosts = posts.filter(isIndexed);
  for (const post of posts) {
    fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), renderPost(template, posts, post, indexedPosts));
  }
  console.log(`Prerendered ${posts.length} blog posts to dist/blog/ from ${source} (${indexedPosts.length} indexed, ${posts.length - indexedPosts.length} noindex)`);

  writeCmsSnapshot(raw);
  prerenderBlogList(indexedPosts);
  optimiseHtml();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
