const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const homepage = path.join(
  root,
  'public',
  'velaris-design-system',
  'ui_kits',
  'web-app',
  'home-figma.html'
);
const output = path.join(root, 'dist', 'index.html');

if (!fs.existsSync(homepage) || !fs.existsSync(path.dirname(output))) {
  throw new Error('Cannot finalize the production homepage: source or dist directory is missing.');
}

fs.copyFileSync(homepage, output);
console.log('Published the canonical homepage at /index.html');
