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
    const data = runSiteData(await res.text());
    if (!data.VELARIS_CMS_LOADED) throw new Error(String(data.VELARIS_CMS_ERROR || 'bridge did not load'));
    return { data, fallback, source: 'Sanity' };
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

function renderPost(template, posts, post) {
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
  const related = relatedPosts(posts, post).map((p) =>
    `<a class="pcard" href="${postPath(p.slug)}"><div class="thumb"><span class="topic">${escapeHtml(p.cat)}</span></div>` +
    `<div class="pb"><div class="tags"><span class="cat">${escapeHtml(p.cat)}</span><span>${escapeHtml(p.read)} min</span></div>` +
    `<h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.excerpt)}</p><span class="more">Read more</span></div></a>`
  ).join('');

  let html = template;
  html = replaceRequired(html, 'Blog Article | Velaris Web', escapeHtml(title), true);
  html = replaceRequired(html, 'Read a Velaris Web article on web design, SEO, conversion strategy, lead generation and online growth.', escapeHtml(metaDescription(post)), true);
  html = replaceRequired(html, '<meta property="og:type" content="website">', '<meta property="og:type" content="article">');
  html = replaceRequired(html, '<meta name="robots" content="index, follow">', `<meta name="robots" content="index, follow">\n${head}`);
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

async function main() {
  const { data, fallback, source } = await loadSiteData();
  const seen = new Set();
  const posts = (data.VELARIS_POSTS || []).filter((post) => {
    if (!post.slug || !/^[a-z0-9-]+$/i.test(post.slug) || seen.has(post.slug)) {
      console.warn(`WARNING: skipping post with missing, unsafe or duplicate slug: ${JSON.stringify(post.slug)}`);
      return false;
    }
    seen.add(post.slug);
    return true;
  });

  const staticPaths = ['/', '/services', '/case-studies', '/pricing', '/resources', '/blog', '/about', '/playbook'];
  // Service and case-study landing pages (prerendered into dist/ when it exists).
  const landing = await buildLandingPages({
    distDir: fs.existsSync(distDir) ? distDir : null,
    fallbackCases: fallback.VELARIS_CASES,
  });
  const servicePaths = landing.services;
  const casePaths = landing.cases;
  const postPaths = posts.map((post) => postPath(post.slug));
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
  for (const post of posts) {
    fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), renderPost(template, posts, post));
  }
  console.log(`Prerendered ${posts.length} blog posts to dist/blog/ from ${source}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
