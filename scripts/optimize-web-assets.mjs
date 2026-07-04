import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const appDir = path.join(root, 'public', 'velaris-design-system', 'ui_kits', 'web-app');
const imageDir = path.join(appDir, 'home-img');
const textExts = new Set(['.js', '.html', '.css']);
const imageExts = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

function slash(file) {
  return file.split(path.sep).join('/');
}

async function optimizeImage(file) {
  const ext = path.extname(file).toLowerCase();
  if (!imageExts.has(ext)) return null;
  const out = file.replace(/\.(jpe?g|png)$/i, '.webp');
  const meta = await sharp(file).metadata();
  const width = meta.width && meta.width > 1800 ? 1800 : undefined;
  const pipeline = sharp(file).rotate();
  if (width) pipeline.resize({ width, withoutEnlargement: true });
  await pipeline.webp({ quality: 78, effort: 5, smartSubsample: true }).toFile(out);
  return { from: slash(path.relative(appDir, file)), to: slash(path.relative(appDir, out)) };
}

async function replaceReferences(replacements) {
  const files = (await walk(appDir)).filter((file) => textExts.has(path.extname(file).toLowerCase()));
  for (const file of files) {
    let text = await fs.readFile(file, 'utf8');
    let next = text;
    for (const { from, to } of replacements) {
      next = next.split(from).join(to);
    }
    if (next !== text) await fs.writeFile(file, next);
  }
}

const imageFiles = await walk(imageDir);
const replacements = [];
let before = 0;
let after = 0;

for (const file of imageFiles) {
  const ext = path.extname(file).toLowerCase();
  if (!imageExts.has(ext)) continue;
  const stat = await fs.stat(file);
  const result = await optimizeImage(file);
  if (!result) continue;
  const outStat = await fs.stat(path.join(appDir, result.to));
  before += stat.size;
  after += outStat.size;
  replacements.push(result);
}

await replaceReferences(replacements);

console.log(JSON.stringify({
  optimized: replacements.length,
  beforeMB: +(before / 1024 / 1024).toFixed(2),
  afterMB: +(after / 1024 / 1024).toFixed(2),
  savedMB: +((before - after) / 1024 / 1024).toFixed(2)
}, null, 2));
