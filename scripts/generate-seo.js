const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const appDir = path.join(root, 'public', 'velaris-design-system', 'ui_kits', 'web-app');
const publicDir = path.join(root, 'public');
const context = { window: {} };

for (const file of ['home-data.js', 'blog-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(appDir, file), 'utf8'), context);
}

const origin = 'https://velarisweb.com';
const staticPaths = ['/', '/services', '/work', '/pricing', '/resources', '/blog', '/about', '/playbook'];
const servicePaths = (context.window.VELARIS_SERVICES || []).map((item) => `/service?s=${item.slug}`);
const casePaths = (context.window.VELARIS_CASES || []).map((item) => `/case?c=${item.slug}`);
const postPaths = (context.window.VELARIS_POSTS || []).map((item) => `/post?slug=${item.slug}`);
const paths = [...new Set([...staticPaths, ...servicePaths, ...casePaths, ...postPaths])];

const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((urlPath) => `  <url><loc>${escapeXml(origin + urlPath)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n');

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
console.log(`Generated sitemap.xml with ${paths.length} canonical URLs and robots.txt`);
