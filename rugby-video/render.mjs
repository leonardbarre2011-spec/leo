// Usage: node render.mjs preview t1 t2 ...   -> PNG stills in out/
//        node render.mjs video [fps]         -> out/frames.mp4 (no audio)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.dirname(new URL(import.meta.url).pathname);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
}).listen(0);
const port = server.address().port;
fs.mkdirSync(path.join(root, 'out'), { recursive: true });

const [mode, ...rest] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
page.on('console', m => { if (m.type() === 'error') console.log('PAGE', m.text()); });
page.on('pageerror', e => console.log('PAGEERR', e.message));
await page.goto(`http://localhost:${port}/${process.env.SCENE || 'scene.html'}`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
const stage = await page.$('#stage');

if (mode === 'preview') {
  for (const t of rest) {
    await page.evaluate(t => window.renderAt(t), +t);
    await stage.screenshot({ path: path.join(root, 'out', `still_${t}.png`) });
    console.log('still', t);
  }
} else {
  const fps = +(rest[0] || 30);
  const dur = await page.evaluate(() => window.DUR);
  const n = Math.round(dur * fps);
  const from = +(rest[1] || 0), to = Math.min(n, +(rest[2] || n)); const outName = rest[3] || 'frames.mp4';
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-vf', 'scale=1080:1920',
    path.join(root, 'out', outName)], { stdio: ['pipe', 'ignore', 'inherit'] });
  const t0 = Date.now();
  for (let i = from; i < to; i++) {
    await page.evaluate(t => window.renderAt(t), i / fps);
    const buf = await stage.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`frame ${i}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
server.close();
