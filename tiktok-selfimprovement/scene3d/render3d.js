// Renders the 3D background frames for a job with headless Chromium (WebGL via SwiftShader).
// Usage: node render3d.js job.json outDir [workers]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

const [jobPath, outDir, workersArg] = process.argv.slice(2);
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
const ROOT = __dirname;
const WORKERS = parseInt(workersArg || '4');
const N = Math.floor(job.dur * job.fps);
fs.mkdirSync(outDir, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };

async function worker(wi) {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: job.w, height: job.h } });
  page.on('pageerror', e => console.error('pageerror', e.message));
  await page.route('http://scene.local/**', route => {
    const p = path.join(ROOT, decodeURIComponent(new URL(route.request().url()).pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p)) return route.fulfill({ status: 404 });
    route.fulfill({ body: fs.readFileSync(p), contentType: MIME[path.extname(p)] || 'application/octet-stream' });
  });
  await page.goto('http://scene.local/' + (job.page || 'scene.html'));
  await page.waitForFunction(() => window.ready === true);
  await page.evaluate(j => window.init(j), job);
  const canvas = await page.$('canvas');
  for (let f = wi; f < N; f += WORKERS) {
    const file = path.join(outDir, String(f).padStart(5, '0') + '.jpg');
    if (fs.existsSync(file)) continue;
    await page.evaluate(t => window.renderAt(t), f / job.fps);
    await canvas.screenshot({ path: file, type: 'jpeg', quality: 93 });
    if (wi === 0 && f % 120 === 0) console.log(`  3d frame ${f}/${N}`);
  }
  await browser.close();
}

(async () => {
  await Promise.all([...Array(WORKERS).keys()].map(worker));
  console.log('3d done');
})();
