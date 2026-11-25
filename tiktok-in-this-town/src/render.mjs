// Usage:
//   node src/render.mjs preview 0.5 3.2 10   -> build/preview_<t>.jpg (one per time)
//   node src/render.mjs video [fps]           -> build/video_noaudio.mp4
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, 'build');
const [mode = 'preview', ...rest] = process.argv.slice(2);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.ttf': 'font/ttf', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.goto(`http://localhost:${port}/src/index.html?ep=${process.env.EP || 'sun'}`);
await page.waitForFunction(() => typeof window.init === 'function');
const EP = process.env.EP || 'sun';
const EPB = path.join(BUILD, EP);
const data = JSON.parse(fs.readFileSync(path.join(EPB, 'words.json'), 'utf8'));
const info = await page.evaluate(d => window.init(d), data);
console.log('init', info);

async function frame(t, q = 0.92) {
  const url = await page.evaluate(([t, q]) => { window.renderAt(t); return window.grab(q); }, [t, q]);
  return Buffer.from(url.split(',')[1], 'base64');
}

if (mode === 'preview') {
  for (const s of rest) {
    const t0 = Date.now();
    const buf = await frame(parseFloat(s), 0.85);
    fs.writeFileSync(path.join(EPB, `preview_${s}.jpg`), buf);
    console.log('t=', s, (Date.now() - t0) + 'ms');
  }
} else {
  const fps = parseInt(rest[0] || '30');
  const start = parseFloat(rest[1] || '0');
  const dur = parseFloat(rest[2] || String(data.duration + 0.8));
  const outFile = path.join(EPB, rest[3] || 'video_noaudio.mp4');
  const n = Math.round(dur * fps);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await frame(start + i / fps, 0.93);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`frame ${i}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', outFile, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
await browser.close();
server.close();
