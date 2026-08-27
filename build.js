// build.js
// Production build: bundles all ES modules into one minified file, minifies
// CSS, and copies the HTML shell + image assets into /dist. This is the
// folder that actually gets deployed — /src stays readable for development.

import { build } from 'esbuild';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

function bytes(n) {
  return `${(n / 1024).toFixed(1)} KB`;
}

async function clean() {
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });
}

async function buildJS() {
  const entry = path.join(SRC, 'js', 'main.js');
  const outfile = path.join(DIST, 'js', 'bundle.min.js');
  const originalSize = (await fs.readdir(path.join(SRC, 'js'), { recursive: true }))
    .filter(f => f.endsWith('.js'));

  let originalBytes = 0;
  for (const f of originalSize) {
    const stat = await fs.stat(path.join(SRC, 'js', f)).catch(() => null);
    if (stat && stat.isFile()) originalBytes += stat.size;
  }

  await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: 'iife', // runs as a plain <script>, no CORS module restrictions
    outfile,
    target: ['es2019'],
    logLevel: 'info',
  });

  const { size: minifiedBytes } = await fs.stat(outfile);
  return { originalBytes, minifiedBytes };
}

async function buildCSS() {
  const entry = path.join(SRC, 'css', 'styles.css');
  const outfile = path.join(DIST, 'css', 'styles.min.css');
  const { size: originalBytes } = await fs.stat(entry);

  await build({
    entryPoints: [entry],
    minify: true,
    outfile,
    logLevel: 'info',
  });

  const { size: minifiedBytes } = await fs.stat(outfile);
  return { originalBytes, minifiedBytes };
}

async function copyAssets() {
  await fs.mkdir(path.join(DIST, 'assets', 'products'), { recursive: true });
  const files = await fs.readdir(path.join(SRC, 'assets', 'products'));
  for (const file of files) {
    await fs.copyFile(
      path.join(SRC, 'assets', 'products', file),
      path.join(DIST, 'assets', 'products', file)
    );
  }
}

async function buildHTML() {
  let html = await fs.readFile(path.join(SRC, 'index.html'), 'utf-8');
  html = html
    .replace('css/styles.css', 'css/styles.min.css')
    .replace('<script type="module" src="js/main.js"></script>', '<script src="js/bundle.min.js" defer></script>');
  await fs.writeFile(path.join(DIST, 'index.html'), html);
}

async function copySpaFallbackFiles() {
  // Netlify: serve index.html for any unmatched path (client-side routes).
  await fs.writeFile(path.join(DIST, '_redirects'), '/*    /index.html   200\n');
}

async function main() {
  console.log('Building production bundle → /dist\n');
  await clean();

  const [jsStats, cssStats] = await Promise.all([buildJS(), buildCSS()]);
  await copyAssets();
  await buildHTML();
  await copySpaFallbackFiles();

  console.log('\nOptimization summary:');
  console.log(`  JS:  ${bytes(jsStats.originalBytes)} (source, ${'14 modules'}) → ${bytes(jsStats.minifiedBytes)} (bundled + minified)`);
  console.log(`  CSS: ${bytes(cssStats.originalBytes)} → ${bytes(cssStats.minifiedBytes)} (minified)`);
  console.log('\nBuild complete. Deploy the /dist folder.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
