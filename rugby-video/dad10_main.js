// ===== "My Dad's Number 10" — story-specific scenes (appended after the shared engine) =====
const TLD = await (await fetch('timeline.json')).json();
const MK = TLD.marks; const SC = {}; TLD.scenes.forEach(s => SC[s.name] = s);
const LINE = pre => TLD.lines.find(l => l.text.startsWith(pre));
const ECHO = TLD.lines.find(l => l.spk === 'DADECHO');

// ---------- extra env groups ----------
G.hospital = new THREE.Group(); G.locker = new THREE.Group(); scene.add(G.hospital, G.locker);

// ===== HOSPITAL =====
const monCanvas = document.createElement('canvas'); monCanvas.width = 256; monCanvas.height = 160;
const monTex = new THREE.CanvasTexture(monCanvas); monTex.colorSpace = THREE.SRGBColorSpace;
function drawMonitor(t, bpm = 62) {
  const g = monCanvas.getContext('2d'); g.fillStyle = '#031208'; g.fillRect(0, 0, 256, 160);
  g.strokeStyle = 'rgba(40,120,60,.35)'; g.lineWidth = 1; for (let x = 0; x < 256; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 160); g.stroke(); }
  g.strokeStyle = '#3dff7a'; g.lineWidth = 3; g.beginPath();
  for (let x = 0; x < 200; x++) { const ph = ((x / 200) * 2 - t * bpm / 60) % 1; const p = (ph + 1) % 1; let y = 90;
    if (!bpm) y = 90; else if (p > .40 && p < .44) y = 90 - (p - .40) / .04 * 55; else if (p >= .44 && p < .48) y = 35 + (p - .44) / .04 * 80; else if (p >= .48 && p < .5) y = 115 - (p - .48) / .02 * 25; else if (p > .62 && p < .72) y = 90 - Math.sin((p - .62) / .1 * Math.PI) * 10;
    x ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.fillStyle = '#3dff7a'; g.font = '900 40px Inter'; g.fillText(bpm ? String(bpm) : '--', 205, 60); g.font = '700 16px Inter'; g.fillText('BPM', 210, 82);
  monTex.needsUpdate = true;
}
const lamp = new THREE.PointLight(0xffc98a, 0, 40, 1.4); lamp.position.set(4.2, 6.5, -3.4); G.hospital.add(lamp);
function makeFolded() {
  const top = new THREE.MeshStandardMaterial({ map: jerseyTex('#1d4ed8', '10', null, '#ffffff'), roughness: .85 }); const bl = M('#1d4ed8');
  const m = new THREE.Mesh(new THREE.BoxGeometry(2.2, .35, 1.9), [bl, bl, top, bl, bl, bl]); m.castShadow = true; return m;
}
const bedJersey = makeFolded(); const bedBall = makeBall(); bedBall.visible = false;
{ const gg = G.hospital;
  const ft = ctex(256, 256, (g, w, h) => { g.fillStyle = '#d9dde2'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b8bec6'; g.lineWidth = 3; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } });
  ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(10, 10);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ map: ft, roughness: .6 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; gg.add(fl);
  const wallM = M('#bcd6d2', { roughness: .95 });
  const bw = box(40, 22, 1, wallM, false); bw.position.set(0, 11, -8); gg.add(bw);
  const lw = box(1, 22, 40, wallM, false); lw.position.set(-12, 11, 6); gg.add(lw);
  const stripe = box(40, 1.2, 1.1, M('#7fa9a3'), false); stripe.position.set(0, 4, -7.9); gg.add(stripe);
  const winTex = ctex(256, 192, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0b1636'); gr.addColorStop(1, '#2b3f78'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,255,255,' + (.3 + rnd() * .7) + ')'; g.fillRect(rnd() * w, rnd() * h * .7, 2, 2); }
    g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(190, 50, 20, 0, 7); g.fill(); g.fillStyle = '#121a2e'; for (let i = 0; i < 9; i++) g.fillRect(i * 30, h - 30 - rnd() * 40, 26, 80); });
  const winDay = ctex(256, 192, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#8cc8ff'); gr.addColorStop(1, '#ffe6b8'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#9aa7b8'; for (let i = 0; i < 9; i++) g.fillRect(i * 30, h - 30 - rnd() * 40, 26, 80); });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(9, 6.5), new THREE.MeshBasicMaterial({ map: winTex })); win.position.set(4, 11, -7.45); gg.add(win); gg.userData.win = win; gg.userData.winNight = winTex; gg.userData.winDay = winDay;
  const fr = M('#f4f4f4'); [[4, 14.4, 9.6, .5], [4, 7.6, 9.6, .5]].forEach(([x, y, w, h]) => { const b = box(w, h, .4, fr, false); b.position.set(x, y, -7.4); gg.add(b); });
  [[-0.7], [8.7]].forEach(([x]) => { const b = box(.5, 7.3, .4, fr, false); b.position.set(x, 11, -7.4); gg.add(b); });
  // bed
  const bedM = M('#e8ecef'), matM = M('#ffffff'), metal = M('#9aa3ad', { metalness: .5, roughness: .4 });
  const frame = box(4.6, .5, 8.2, metal); frame.position.set(0, 2.3, 0); gg.add(frame);
  [[-2, -3.8], [2, -3.8], [-2, 3.8], [2, 3.8]].forEach(([x, z]) => { const l = box(.3, 2.2, .3, metal); l.position.set(x, 1.1, z); gg.add(l); });
  const head = box(4.6, 4, .4, bedM); head.position.set(0, 3.6, -4.1); gg.add(head);
  const mat = box(4.2, .8, 7.8, matM); mat.position.set(0, 2.95, 0); gg.add(mat);
  const pil = box(3, .7, 1.6, M('#f7f7ff')); pil.position.set(0, 3.7, -3.1); gg.add(pil);
  const blanket = box(4.4, .45, 4.8, M('#6d8fc7')); blanket.position.set(0, 4.45, 1.4); gg.add(blanket); gg.userData.blanket = blanket;
  // monitor + IV
  const pole = box(.25, 6, .25, metal); pole.position.set(-3.8, 3, -3.4); gg.add(pole);
  const mon = box(2.6, 1.9, .5, M('#2b2f36')); mon.position.set(-3.8, 6.6, -3.4); mon.rotation.y = .5; gg.add(mon);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.55), new THREE.MeshBasicMaterial({ map: monTex })); scr.position.set(-3.67, 6.6, -3.15); scr.rotation.y = .5; gg.add(scr);
  const iv = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 8.5, 8), metal); iv.position.set(-3.2, 4.25, 1); gg.add(iv);
  const bag = box(1, 1.4, .3, new THREE.MeshStandardMaterial({ color: 0xdff3ff, transparent: true, opacity: .75, roughness: .2 })); bag.position.set(-3.2, 7.8, 1); gg.add(bag);
  // chair
  const ch = M('#5b6b7a'); const seat = box(2.4, .35, 2.4, ch); seat.position.set(5.2, 1.45, .2); gg.add(seat);
  const back = box(.35, 3, 2.4, ch); back.position.set(6.3, 3, .2); gg.add(back);
  [[4.2, -.8], [6.2, -.8], [4.2, 1.2], [6.2, 1.2]].forEach(([x, z]) => { const l = box(.25, 1.3, .25, metal); l.position.set(x, .65, z); gg.add(l); });
  // bedside table + lamp
  const tb = box(2.2, 3, 2, M('#c9a77c')); tb.position.set(4.2, 1.5, -3.4); gg.add(tb);
  const lb = box(.6, 1.6, .6, M('#ddd')); lb.position.set(4.2, 3.8, -3.4); gg.add(lb);
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(.6, 1.1, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffc070, emissiveIntensity: .9 })); sh.position.set(4.2, 5.1, -3.4); gg.add(sh);
  const fl2 = box(.9, .9, .9, M('#ff6b8a'), false); fl2.position.set(3.6, 3.45, -3.0); gg.add(fl2);
  gg.add(bedJersey);
}
// ===== LOCKER ROOM =====
{ const gg = G.locker;
  const ft = ctex(256, 256, (g, w, h) => { g.fillStyle = '#4b5563'; g.fillRect(0, 0, w, h); g.strokeStyle = '#374151'; g.lineWidth = 4; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } });
  ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(12, 12);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ map: ft, roughness: .5 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; gg.add(fl);
  const wall = box(60, 24, 1, M('#e5e7eb'), false); wall.position.set(0, 12, -9); gg.add(wall);
  for (let i = 0; i < 12; i++) { const n = i + 1;
    const lt = ctex(128, 384, (g, w, h) => { g.fillStyle = '#1e40af'; g.fillRect(0, 0, w, h); g.strokeStyle = '#172f7a'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
      g.fillStyle = '#172f7a'; for (let k = 0; k < 6; k++) g.fillRect(24, 30 + k * 14, 80, 6); g.fillStyle = '#e5e7eb'; g.fillRect(30, 140, 68, 40); g.fillStyle = '#111'; g.font = '900 30px Inter'; g.textAlign = 'center'; g.fillText(String(n), 64, 170);
      g.fillStyle = '#9ca3af'; g.fillRect(96, 200, 12, 40); });
    const l = new THREE.Mesh(new THREE.BoxGeometry(3, 10, 2), [M('#1e40af'), M('#1e40af'), M('#1e40af'), M('#1e40af'), new THREE.MeshStandardMaterial({ map: lt }), M('#1e40af')]);
    l.position.set(-18 + i * 3.15, 5, -7.6); l.castShadow = true; l.receiveShadow = true; gg.add(l); }
  const bench = box(16, .6, 2.4, M('#b07a45')); bench.position.set(0, 1.45, -3.2); gg.add(bench);
  [[-7], [7]].forEach(([x]) => { const l = box(.5, 1.2, 2, M('#6b7280')); l.position.set(x, .6, -3.2); gg.add(l); });
  const towel = box(2, .3, 1.4, M('#f8fafc')); towel.position.set(-5, 1.9, -3.2); gg.add(towel);
  const bag = box(3, 1.6, 1.6, M('#111827')); bag.position.set(6, .8, -1.2); gg.add(bag);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.4), new THREE.MeshBasicMaterial({ map: ctex(512, 88, (g, w, h) => { g.fillStyle = '#c81e1e'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 54px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FINAL DAY', w / 2, h / 2 + 3); }) }));
  banner.position.set(0, 13.5, -8.4); gg.add(banner);
}
// ===== WHEELCHAIR + IV (stadium) =====
const chair = new THREE.Group(); { const met = M('#9aa3ad', { metalness: .6, roughness: .35 }), blk = M('#1f2937');
  const s = box(2.4, .3, 2.4, blk); s.position.y = 1.45; chair.add(s);
  const bk = box(2.4, 3, .3, blk); bk.position.set(0, 3, -1.2); chair.add(bk);
  [-1.45, 1.45].forEach(x => { const w = new THREE.Mesh(new THREE.TorusGeometry(1.35, .14, 8, 24), met); w.rotation.y = Math.PI / 2; w.position.set(x, 1.4, -.3); w.castShadow = true; chair.add(w);
    const fw = new THREE.Mesh(new THREE.TorusGeometry(.35, .1, 6, 12), blk); fw.rotation.y = Math.PI / 2; fw.position.set(x * .8, .35, 1.2); chair.add(fw);
    const h = box(.2, .2, .8, blk); h.position.set(x * .85, 4.4, -1.6); chair.add(h); });
  const lapBlanket = box(2.5, .5, 2.3, M('#c0392b')); lapBlanket.position.set(0, 2.15, .7); chair.add(lapBlanket);
  G.stadium.add(chair); }
const ivSt = new THREE.Group(); { const met = M('#9aa3ad', { metalness: .6, roughness: .35 });
  const p = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 8, 8), met); p.position.y = 4; ivSt.add(p);
  const b = box(1, 1.4, .3, new THREE.MeshStandardMaterial({ color: 0xdff3ff, transparent: true, opacity: .8 })); b.position.y = 7.4; ivSt.add(b);
  const base = box(1.6, .2, 1.6, met); base.position.y = .1; ivSt.add(base); G.stadium.add(ivSt); }
chair.visible = ivSt.visible = false;

// ---------- characters ----------
const noahBack = jerseyTex('#1d4ed8', '10', 'BRENNAN', '#ffffff');
const noahJ = makeAvatar({ shirt: '#1d4ed8', shorts: '#ffffff', socks: '#1d4ed8', hair: '#4a2c17', face: 'determined', frontTex: blueFront, backTex: noahBack, longSleeve: true });
noahJ.torso.children[0].scale.set(2.35, 2.3, 1.25); noahJ.torso.children[0].position.y = .9; // too-big jersey
noahJ.lArm.position.x = -1.68; noahJ.rArm.position.x = 1.68;
const noahH = makeAvatar({ shirt: '#6b7280', shorts: '#1f2937', socks: '#ffffff', hair: '#4a2c17', face: 'sad', longSleeve: true, trousers: true });
const kidN = makeAvatar({ shirt: '#22c55e', shorts: '#1f2937', socks: '#ffffff', hair: '#4a2c17', face: 'smile', scale: .66 });
const dadY = makeAvatar({ shirt: '#1d4ed8', shorts: '#334155', socks: '#1d4ed8', hair: '#3b2a1e', skin: '#f1c69e', face: 'dad', frontTex: blueFront, backTex: jerseyTex('#1d4ed8', '10', 'BRENNAN', '#ffffff'), trousers: true });
const dadS = makeAvatar({ shirt: '#a8c5e0', shorts: '#a8c5e0', socks: '#e5e7eb', hair: '#3b2a1e', bald: true, skin: '#efd9c6', face: 'tired', longSleeve: true, trousers: true });
const kyle = makeAvatar({ shirt: '#c81e1e', shorts: '#111827', socks: '#c81e1e', hair: '#e3b23c', face: 'mean', frontTex: jerseyTex('#c81e1e', undefined, undefined, '#111'), backTex: jerseyTex('#c81e1e', '7', 'KYLE', '#111'), scale: 1.1 });
const nurse = makeAvatar({ shirt: '#5fa8d3', shorts: '#5fa8d3', socks: '#e5e7eb', hair: '#2b1d12', skin: '#a56a43', face: 'smile', trousers: true });
[noahJ, noahH, kidN, dadY, dadS, kyle, nurse].forEach(a => scene.add(a.root));
// carried / handheld props
const carry = makeBall(); scene.remove(carry); noahJ.torso.add(carry); carry.position.set(.4, .7, 1.0); carry.rotation.y = Math.PI / 2; carry.scale.setScalar(1);
const dadJersey = makeFolded(); dadS.rArm.add(dadJersey); dadJersey.position.set(0, -2.1, .2); dadJersey.rotation.set(Math.PI / 2, 0, 0);
const lapJersey = makeFolded(); noahH.torso.add(lapJersey); lapJersey.position.set(0, -.1, 1.5);
const yardBall = makeBall();

// ---------- environments ----------
function env2(name) {
  for (const k in G) G[k].visible = false; fill.intensity = .35; lamp.intensity = 0; chair.visible = ivSt.visible = false;
  if (name === 'hospital' || name === 'hospitalDay') { G.hospital.visible = true; scene.fog = null; const day = name === 'hospitalDay';
    scene.background = new THREE.Color(day ? 0xdfe8ea : 0x0b0f18);
    G.hospital.userData.win.material.map = day ? G.hospital.userData.winDay : G.hospital.userData.winNight;
    hemi.color.set(day ? 0xffffff : 0x8ea2c8); hemi.groundColor.set(0x3a3f48); hemi.intensity = day ? 1.0 : .35; amb.intensity = day ? .3 : .12;
    sun.color.set(day ? 0xfff0d0 : 0x9fb5ff); sun.intensity = day ? 2.4 : .8; sun.position.set(6, 30, -20); lamp.intensity = day ? 0 : 90; fill.intensity = day ? .3 : .55; }
  else if (name === 'locker') { G.locker.visible = true; scene.fog = null; scene.background = new THREE.Color(0x111318);
    hemi.color.set(0xffffff); hemi.groundColor.set(0x444444); hemi.intensity = .95; amb.intensity = .25; sun.color.set(0xf4f8ff); sun.intensity = 1.6; sun.position.set(5, 40, 25); fill.intensity = .5; }
  else env(name);
}
function headW(av) { av.root.updateMatrixWorld(true); return av.head.localToWorld(V(0, .65, 0)); }
function shadowAt2(p, r = 45) { sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.updateProjectionMatrix(); shadowAt(p); }
function fall(av, k, dir = -1) { av.body.rotation.x = dir * Math.PI / 2 * k; av.body.position.y = .5 * k; }
function sit(av, seatTop = 1.6) { av.lLeg.rotation.x = av.rLeg.rotation.x = -Math.PI / 2; av.body.position.y = seatTop - 1.5; }
function kneel(av) { av.body.position.y = -1.25; av.lLeg.rotation.x = av.rLeg.rotation.x = 1.35; }
const W = V(30, 0, 70);

// ---------- overlay additions ----------
document.querySelector('#score .b').textContent = 'BLUES'; document.querySelector('#score .r').textContent = 'REDS';
$('fbtag').textContent = 'FLASHBACK';
const st2 = document.createElement('style'); st2.textContent = `
 #caption{top:250px;font-size:60px}
 #caption .w{display:inline-block;margin:0 .12em} #caption .cur{color:#ffd23f;transform:scale(1.08)}
 #caption.DAD{color:#ffe08a} #caption.DAD .cur{color:#fff}
 #caption.DADECHO{color:#ffe08a;font-style:italic} #caption.DADECHO .cur{color:#fff}
 #caption.KYLE{color:#ff6b6b} #caption.KYLE .cur{color:#fff}
 #caption.ANN{color:#7ee7ff} #caption.ANN .cur{color:#fff}
 #caption.endc{top:560px;font-size:58px}
 #spk{position:absolute;top:196px;left:0;right:0;text-align:center;font-family:Inter;font-weight:800;font-size:26px;letter-spacing:6px;color:#fff;opacity:0}
 #label{position:absolute;left:44px;top:960px;font-family:Inter;opacity:0}
 #label .n{font-weight:900;font-size:84px;color:#ff4d4d;-webkit-text-stroke:10px #000;paint-order:stroke fill;line-height:1}
 #label .d{display:inline-block;margin-top:10px;background:#c81e1e;color:#fff;font-weight:800;font-size:30px;padding:8px 16px;border-radius:8px}
 #forever{position:absolute;left:0;right:0;top:820px;text-align:center;font-family:Inter;font-weight:900;font-size:92px;color:#fff;-webkit-text-stroke:12px #000;paint-order:stroke fill;opacity:0}`;
document.head.appendChild(st2);
const stageEl = $('stage');
stageEl.insertAdjacentHTML('beforeend', `<div id="spk"></div><div id="label"><div class="n">KYLE</div><div class="d">Captain of the Reds</div></div><div id="forever">#10 FOREVER ${HEART}</div>`);
// keep end card / flash / black on top
['flash', 'black', 'end'].forEach(id => stageEl.appendChild($(id)));
$('end').innerHTML = `<div class="a">Who would YOU<br>play for?</div><div class="q">Tell me in the comments</div><div class="btn">FOLLOW FOR MORE</div>`;

function chunksOf(line) {
  if (line._ch) return line._ch;
  const words = line.text.split(' '); const out = []; let cur = [];
  words.forEach((w, i) => { cur.push(w); if (cur.length >= 5 || (/[.,!?]$/.test(w) && cur.length >= 2 && i < words.length - 1 && words.length - i > 2)) { out.push(cur); cur = []; } });
  if (cur.length) out.push(cur);
  const total = line.text.length; let acc = 0;
  line._ch = out.map(c => { const s = acc / total; const lens = c.map(w => w.length + 1); acc += lens.reduce((a, b) => a + b, 0); return { words: c, lens, s, e: Math.min(1, acc / total) }; });
  return line._ch;
}
const SPKNAME = { DAD: 'DAD', DADECHO: 'DAD', KYLE: 'KYLE', ANN: 'COMMENTATOR' };
function overlay2(t, name, u) {
  const cap = $('caption'); const ln = TLD.lines.find(l => t >= l.start - .05 && t < l.end + .25);
  if (ln) { const dur = ln.end - ln.start; const f = clamp((t - ln.start) / dur, 0, .999); const ch = chunksOf(ln); const c = ch.find(c => f >= c.s && f < c.e) || ch[ch.length - 1];
    const wf = (f - c.s) / (c.e - c.s); let acc = 0; const tot = c.lens.reduce((a, b) => a + b, 0); let wi = c.words.length - 1;
    for (let i = 0; i < c.words.length; i++) { acc += c.lens[i]; if (wf * tot < acc) { wi = i; break; } }
    const key = ln.start + ':' + c.s + ':' + wi;
    if (cap.dataset.k !== key) { cap.innerHTML = c.words.map((w, i) => `<span class="w${i === wi ? ' cur' : ''}">${w}</span>`).join(' '); cap.className = ln.spk + (name === 'end' ? ' endc' : ''); cap.dataset.k = key; }
    const k = t - (ln.start + c.s * dur); const pop = k < .12 ? .85 + .15 * eOut(k / .12) : 1; cap.style.opacity = t > ln.end ? clamp(1 - (t - ln.end) / .25) : 1; cap.style.transform = `scale(${pop})`;
    $('spk').textContent = SPKNAME[ln.spk] || ''; $('spk').style.opacity = SPKNAME[ln.spk] ? cap.style.opacity : 0;
    $('spk').style.top = name === 'end' ? '506px' : '196px';
  } else { cap.style.opacity = 0; $('spk').style.opacity = 0; }
  // looks
  const echo = ECHO && t >= ECHO.start - .1 && t < ECHO.end + .3;
  const fb = name === 'yard' || echo;
  const fbU = name === 'yard' ? u : clamp((t - ECHO.start + .1) / (ECHO.end - ECHO.start + .4));
  const fbAmt = fb ? clamp(Math.min(fbU / .04, (1 - fbU) / .04)) : 0;
  let filter = 'none';
  if (fb) filter = `sepia(${.55 * fbAmt}) saturate(${1 - .15 * fbAmt}) contrast(1.05)`;
  else if (['hook', 'sick', 'promise'].includes(name)) filter = 'saturate(.8) contrast(1.05)';
  else if (name === 'tackles' && t > MK.t3) filter = 'saturate(.6) contrast(1.1)';
  else if (name === 'lastplay' && t > MK.step && t < MK.try) filter = 'saturate(.75) contrast(1.12)';
  else if (name === 'end') filter = 'saturate(.85) brightness(.9)';
  canvas.style.filter = filter;
  $('barT').style.height = $('barB').style.height = (fb ? 110 * fbAmt : 0) + 'px';
  $('fbtag').style.opacity = fb ? .9 * fbAmt : 0; $('fbtag').style.top = '130px';
  $('grain').style.opacity = fb ? .8 * fbAmt : 0; $('grain').style.backgroundPosition = `0 ${(t * 900) % 3}px`;
  let vig = .45; if (name === 'tackles' && t > MK.t3) vig = .6 + .3 * Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * .6)), 10); if (fb) vig = .75; if (name === 'end') vig = .8;
  $('vignette').style.opacity = vig;
  const showScore = (name === 'tackles' || name === 'lastplay') && !echo;
  $('score').style.opacity = showScore ? 1 : 0; $('score').style.top = '70px';
  const won = t >= MK.try; $('sb').textContent = won ? '22' : '17'; $('sr').textContent = '20';
  const fl = won && t < MK.try + 2 && Math.floor(t * 6) % 2; $('sb').style.background = fl ? '#ffd23f' : '#111'; $('sb').style.color = fl ? '#000' : '#fff';
  const csec = Math.min(80 * 60, 78 * 60 + Math.max(0, t - SC.tackles.start) * 7); $('clk').textContent = `${Math.floor(csec / 60)}:${String(Math.floor(csec % 60)).padStart(2, '0')}`;
  $('clk').style.opacity = csec >= 4800 ? (Math.floor(t * 2) % 2 ? .35 : 1) : 1;
  // Kyle label
  const kl = LINE('Kyle. Captain'); const la = kl ? clamp(Math.min((t - kl.start + .1) / .2, (kl.end + .4 - t) / .2)) : 0; $('label').style.opacity = la; $('label').style.transform = `translateX(${(1 - eOut(la)) * -80}px)`;
  // flashes at hard cuts
  let f = 0; const cuts = [SC.yard.start, SC.sick.start, MK.wear, SC.warmup.start, MK.t1, MK.t2, MK.t3, MK.try, MK.reveal, ECHO.start - .1, ECHO.end + .3];
  for (const s of cuts) { const d = t - s; if (d >= 0 && d < .25) f = Math.max(f, (1 - d / .25) * (s === MK.try ? 1 : .55)); }
  $('flash').style.opacity = f;
  let bk = 0; if (t < .35) bk = 1 - t / .35; if (name === 'end') bk = Math.max(bk, .6 * clamp((t - SC.end.start) / .8)); if (t > TLD.duration - .8) bk = Math.max(bk, (t - (TLD.duration - .8)) / .8);
  $('black').style.opacity = clamp(bk);
  const l2 = LINE('But he saw'); const fv = clamp((t - l2.end - .3) / .4) * (1 - clamp((t - MK.card) / .3)); $('forever').style.opacity = fv; $('forever').style.transform = `scale(${.9 + .1 * eOut(fv)})`;
  const ec = clamp((t - MK.card) / .4); $('end').style.opacity = ec; $('end').style.transform = `scale(${.92 + .08 * eOut(ec)})`;
}

// ---------- scenes ----------
function hideAll2() { avatars.forEach(a => a.root.visible = false); ball.visible = false; yardBall.visible = false; bedBall.visible = false; conf.visible = false; bird.visible = false; }
function hospitalBase(t, day = false) {
  env2(day ? 'hospitalDay' : 'hospital'); shadowAt2(V(0, 0, 0), 20); drawMonitor(t, day ? 0 : 62);
  if (!day) { dadS.root.visible = true; place(dadS, V(0, 3.75, 2.75), 0); dadS.body.rotation.x = -Math.PI / 2; dadS.setFace('tired');
    dadS.lArm.rotation.z = -.15; dadS.rArm.rotation.z = .15; }
}
function stadiumBase(t, mode = 'idle') {
  env2('night'); updateCrowd(t, mode); conf.visible = false; shadowAt2(V(15, 0, 40), 60);
}
function render2(t) {
  const sc0 = TLD.scenes.find(s => t >= s.start && t < s.end) || TLD.scenes[TLD.scenes.length - 1];
  const name = sc0.name; const u = (t - sc0.start) / (sc0.end - sc0.start); const lt = t - sc0.start;
  avatars.forEach(a => { a.reset(); a.body.rotation.set(0, 0, 0); a.root.visible = false; });
  hideAll2(); carry.visible = false; dadJersey.visible = false; lapJersey.visible = false; bedJersey.visible = false;
  const echo = ECHO && t >= ECHO.start - .1 && t < ECHO.end + .3;

  if (name === 'hook') {
    hospitalBase(t); bedJersey.visible = true; bedJersey.position.set(.6, 4.86, 2.6); bedJersey.rotation.set(0, .25, 0); dadS.head.rotation.y = .35;
    const e = ease(u); cam(vl(V(6.5, 11, 12), V(2.6, 7.4, 6.2), e), vl(V(0, 4.2, 0), V(.5, 4.8, 2.4), e), 42);
  }
  else if (name === 'yard' || echo) {
    env2('garden'); shadowAt2(V(0, 0, 0), 30);
    dadY.root.visible = true; kidN.root.visible = true; yardBall.visible = true; yardBall.scale.setScalar(.8);
    const dp0 = V(3, 0, 0), kp = V(-3.6, 0, .5);
    if (echo) { // flash memory: dad crouched offering his hand, close-up
      place(kidN, kp, Math.PI / 2); fall(kidN, 1, -1); kidN.setFace('sad');
      const dp = V(-.4, 0, .5); place(dadY, dp, -Math.PI / 2); dadY.setFace('dad'); dadY.body.position.y = -.9; dadY.lLeg.rotation.x = -1.1; dadY.rLeg.rotation.x = .4; dadY.torso.rotation.x = .45; dadY.rArm.rotation.x = -1.2; dadY.head.rotation.x = .1;
      yardBall.position.set(-9, .5, 3);
      const eu = clamp((t - ECHO.start) / (ECHO.end - ECHO.start)); const hp = headW(dadY); cam(vl(hp.clone().add(V(-4.6, -.2, .8)), hp.clone().add(V(-3.6, -.1, .6)), eu), hp, 40);
    } else {
      const tPass = MK.pass + .6, tHit = MK.pass + 1.2;
      // dad position: idle, then walks to kid after 'help'
      const walk = ease(seg(t, MK.help - .1, MK.help + 1.1)); const dp = vl(dp0, V(-.4, 0, .5), walk);
      place(dadY, dp, -Math.PI / 2); dadY.setFace('dad');
      if (walk > 0 && walk < 1) poseWalk(dadY, t * 9, 1);
      place(kidN, kp, Math.PI / 2); kidN.setFace('smile');
      if (t < LINE('Every Sunday, he').start) { // juggling intro
        const s = (t * 1.4) % 1; dadY.lArm.rotation.x = dadY.rArm.rotation.x = -1.2; yardBall.position.copy(dp).add(V(-1.4, 3.2 + Math.sin(Math.PI * s) * 3.5, 0)); yardBall.userData.m.rotation.x = t * 8;
        kidN.setFace('joy'); kidN.body.position.y = Math.abs(Math.sin(t * 6)) * .4;
      } else if (t < tPass) { dadY.lArm.rotation.x = dadY.rArm.rotation.x = -1.3; const sw = seg(t, tPass - .35, tPass); dadY.torso.rotation.y = .5 * Math.sin(sw * Math.PI);
        yardBall.position.copy(dp).add(V(-1.6, 3.0, 0)); yardBall.rotation.y = Math.PI / 2; kidN.lArm.rotation.x = kidN.rArm.rotation.x = -1.2; kidN.setFace('determined'); }
      else if (t < tHit) { const s = seg(t, tPass, tHit); const a = dp0.clone().add(V(-1.6, 3, 0)), b = kp.clone().add(V(.9, 2.2, 0)); const p = vl(a, b, s); p.y += Math.sin(Math.PI * s) * 1.2; yardBall.position.copy(p); yardBall.userData.m.rotation.z = s * 6; yardBall.rotation.y = Math.PI / 2; kidN.lArm.rotation.x = kidN.rArm.rotation.x = -1.2; kidN.setFace('shock'); }
      else { // dropped: ball bounces away, kid falls
        const s = t - tHit; const bx = kp.x + .9 - Math.min(s, 1.6) * 3; const by = .45 + Math.abs(Math.sin(s * 6)) * 1.6 * Math.exp(-s * 2.5); yardBall.position.set(bx, Math.max(.45, by + (s < .15 ? 1.7 - s * 8 : 0)), kp.z + Math.min(s, 1.6) * 1.5); yardBall.userData.m.rotation.x = s * 7;
        const rise = ease(seg(t, MK.rise + .2, MK.rise + 1.3)); fall(kidN, (1 - rise) * ease(seg(s, 0, .35)), -1); kidN.setFace(t > MK.rise + .9 ? 'joy' : 'sad');
        if (t > MK.help + 1.1) { dadY.body.position.y = -.9 * (1 - rise * .9); dadY.lLeg.rotation.x = -1.1 * (1 - rise); dadY.rLeg.rotation.x = .4 * (1 - rise); dadY.torso.rotation.x = .45 * (1 - rise * .6); dadY.rArm.rotation.x = -1.2;
          kidN.rArm.rotation.x = -1.4 * (1 - rise * .3); }
        if (t > MK.rise + 1.3) { dadY.setFace('smile'); kidN.root.position.y = Math.abs(Math.sin((t - MK.rise) * 6)) * .5 * (t < MK.rise + 2.6 ? 1 : 0); }
      }
      // cameras
      if (t < LINE('Every Sunday, he').start) { const e = ease(seg(t, SC.yard.start, LINE('Every Sunday, he').start)); cam(vl(V(18, 14, 30), V(12, 9, 22), e), V(0, 5, -6), 48); }
      else if (t < MK.help) { const e = ease(seg(t, LINE('Every Sunday, he').start, MK.help)); cam(vl(V(0, 6, 26), V(0, 5, 22), e), V(0, 2.4, .3), 44); }
      else if (t < LINE("A real rugby").start) { cam(V(-6.4, 3.1, 2.4), V(-.4, 4.2, .5), 38); } // kid POV-ish looking at dad
      else if (t < MK.rise) { const e = ease(seg(t, LINE("A real rugby").start, MK.rise)); cam(vl(V(-2, 6, 18), V(-2, 5.2, 15), e), V(-2, 2.4, .5), 44); }
      else { const e = ease(seg(t, MK.rise, SC.yard.end)); cam(vl(V(-2, 4.5, 11), V(-2, 5.5, 15), e), V(-2, 3, .5), 44); }
    }
  }
  else if (name === 'sick') {
    hospitalBase(t); noahH.root.visible = true; place(noahH, V(5.2, 0, .2), -Math.PI / 2); sit(noahH); noahH.setFace('sad'); noahH.head.rotation.x = .35; noahH.torso.rotation.x = .2;
    noahH.lArm.rotation.x = noahH.rArm.rotation.x = -1.0; dadS.head.rotation.y = .15;
    const half = LINE('The doctors stopped').start;
    if (t < half) { const e = ease(seg(t, SC.sick.start, half)); cam(vl(V(13, 11, 15), V(10.5, 9.5, 12), e), V(2, 3.5, 0), 46); }
    else { const e = ease(seg(t, half, SC.sick.end)); cam(vl(V(1.6, 3.9, 1.8), V(2.0, 3.9, 1.4), e), V(5.2, 4.4, .2), 46); }
  }
  else if (name === 'promise') {
    hospitalBase(t); noahH.root.visible = true; place(noahH, V(5.2, 0, .2), -Math.PI / 2); sit(noahH); noahH.setFace('sad');
    dadS.head.rotation.y = .7; dadS.setFace('tiredsmile');
    const g = ease(seg(t, MK.give + .2, MK.give + 1.6)); const take = LINE('Wear my number').end + .2;
    dadS.rArm.rotation.z = lerp(.15, 1.25, g); dadS.rArm.rotation.x = lerp(0, -.35, g);
    if (t < take) { dadJersey.visible = g > 0; noahH.lArm.rotation.x = noahH.rArm.rotation.x = lerp(-.9, -1.5, ease(seg(t, take - 1, take))); }
    else { lapJersey.visible = true; noahH.lArm.rotation.x = noahH.rArm.rotation.x = -1.0; dadS.rArm.rotation.z = lerp(1.25, .15, ease(seg(t, take, take + 1.2))); }
    if (t > LINE('I promised').start - .2) noahH.setFace('cry');
    if (t < take) { cam(V(6.6, 8.2, 3.6), V(.2, 4.2, -1.6), 34); } // over Noah's shoulder to dad
    else if (t < LINE('But we both').start) { const e = ease(seg(t, take, LINE('But we both').start)); cam(vl(V(1.8, 5.4, .4), V(2.2, 5.3, .3), e), V(5.2, 4.6, .2), 36); }
    else { const e = ease(seg(t, LINE('But we both').start, SC.promise.end)); cam(vl(V(4, 9, 9), V(4, 12, 13), e), V(2, 3.6, -.5), 46); }
  }
  else if (name === 'locker') {
    env2('locker'); shadowAt2(V(0, 0, 0), 25);
    if (t < MK.wear) { noahH.root.visible = true; place(noahH, V(0, 0, -3.2), 0); sit(noahH, 1.75); lapJersey.visible = true; noahH.head.rotation.x = .4; noahH.lArm.rotation.x = noahH.rArm.rotation.x = -.9; noahH.setFace('sad');
      cam(V(.5, 5, 6), V(0, 3, -3), 44); }
    else { noahJ.root.visible = true; place(noahJ, V(0, 0, -1.2), 0); noahJ.setFace('nervous');
      const look = seg(t, MK.wear, MK.wear + 1.2); noahJ.head.rotation.x = .45 * Math.sin(Math.PI * Math.min(1, look * 1.3)); noahJ.lArm.rotation.z = .45; noahJ.rArm.rotation.z = -.45; noahJ.lArm.rotation.x = noahJ.rArm.rotation.x = -.3;
      const big = LINE('It was way').start;
      if (t < big) cam(V(.6, 4.6, 8.5), V(0, 3.6, -1.2), 44);
      else { const e = ease(seg(t, big, SC.locker.end)); noahJ.root.rotation.y = Math.PI * e; cam(V(.4, 4.4, 9), V(0, 3.6, -1.2), 44); noahJ.setFace('sad'); }
    }
  }
  else if (name === 'warmup') {
    stadiumBase(t, 'idle');
    noahJ.root.visible = true; place(noahJ, W, Math.PI); noahJ.setFace('sad'); poseBreath(noahJ, t);
    kyle.root.visible = true; const kp = W.clone().add(V(0, 0, -4.6)); place(kyle, kp, 0); kyle.setFace('mean');
    const lau = t > MK.laugh - .4 ? 1 : 0;
    reds.forEach((r, i) => { r.root.visible = i < 3; if (i < 3) { const p = W.clone().add(V(-4 + i * 4, 0, -7.2 + (i === 1 ? -1.5 : 0))); place(r, p, 0); r.setFace(lau ? 'mean' : 'determined'); if (lau) { r.body.position.y = Math.abs(Math.sin(t * 9 + i)) * .35; r.torso.rotation.x = -.15; } } });
    mates.forEach((m, i) => { m.root.visible = i < 2; if (i < 2) { place(m, W.clone().add(V(-3.5 + i * 7, 0, 3.2)), Math.PI); m.setFace(lau ? 'joy' : 'smile'); if (lau) m.body.position.y = Math.abs(Math.sin(t * 9 + i * 2)) * .3; } });
    if (t < MK.laugh) kyle.rArm.rotation.x = -1.5; else { kyle.rArm.rotation.x = -1.5 * (1 - seg(t, MK.laugh + .8, MK.laugh + 1.2)); kyle.body.position.y = Math.abs(Math.sin(t * 9)) * .35; kyle.torso.rotation.x = -.2; }
    const kl = LINE('Kyle. Captain'), el = LINE('Everyone laughed');
    if (t > el.start) { const g = ease(seg(t, el.start + 1.0, el.end)); noahJ.lArm.rotation.x = noahJ.rArm.rotation.x = lerp(-.5, -1.3, g); noahJ.lArm.rotation.z = -.35; noahJ.rArm.rotation.z = .35; noahJ.head.rotation.x = .4; }
    else noahJ.head.rotation.x = .25;
    if (t < MK.laugh) cam(W.clone().add(V(1.9, 6.6, 4.4)), kp.clone().add(V(0, 4.7, 0)), 38);
    else if (t < kl.start) cam(W.clone().add(V(14, 6, -1.5)), W.clone().add(V(0, 3, -1.8)), 46);
    else if (t < el.start) { const e = ease(seg(t, kl.start, el.start)); cam(vl(kp.clone().add(V(2.8, 5.3, 3.2)), kp.clone().add(V(2.3, 5.2, 2.7)), e), kp.clone().add(V(0, 5.1, 0)), 40); }
    else { const e = ease(seg(t, el.start, SC.warmup.end)); cam(vl(W.clone().add(V(.5, 4.9, -4.2)), W.clone().add(V(.4, 4.8, -3.2)), e), W.clone().add(V(0, 4.4, 0)), 40); }
  }
  else if (name === 'tackles' && !echo) {
    stadiumBase(t, 'tense'); noahJ.root.visible = true; carry.visible = true;
    const segs = [{ k: 't1', C: V(30, 0, 60), side: -1 }, { k: 't2', C: V(12, 0, 46), side: 1 }, { k: 't3', C: V(-6, 0, 34), side: -1 }];
    let cur = -1; segs.forEach((s, i) => { if (t >= MK[s.k] - 1.0) cur = i; });
    reds.forEach(r => r.root.visible = false); mates.forEach(m => m.root.visible = false);
    if (cur < 0) { // establishing
      const p0 = segs[0].C.clone().add(V(0, 0, 9)); place(noahJ, p0, Math.PI); noahJ.setFace('determined'); poseBreath(noahJ, t);
      reds.forEach((r, i) => { r.root.visible = true; const p = V(10 + i * 5, 0, 52 - (i % 2) * 3); place(r, p, 0); poseBreath(r, t + i); });
      mates.forEach((m, i) => { m.root.visible = i < 4; place(m, V(36 + i * 4, 0, 72 + (i % 2) * 3), Math.PI); poseBreath(m, t + i); });
      const e = ease(seg(t, SC.tackles.start, MK.t1 - 1)); cam(vl(V(70, 34, 110), V(55, 18, 85), e), V(24, 2, 56), 46);
    } else {
      const S0 = segs[cur], tk = MK[S0.k]; const s = t - (tk - 1.0); const C = S0.C;
      const runStart = C.clone().add(V(0, 0, 8)); const tack = reds[cur]; tack.root.visible = true; tack.setFace('mean');
      const tStart = C.clone().add(V(S0.side * 8, 0, -3)); const tEnd = C.clone().add(V(S0.side * .9, 0, -.5));
      if (s < 1.0) { const p = vl(runStart, C, s); place(noahJ, p, Math.PI); poseRun(noahJ, s * 14, 1); noahJ.setFace('determined');
        const q = vl(tStart, tEnd, s); place(tack, q, faceDir(q, p)); poseRun(tack, s * 14 + 1, 1); }
      else { const k = ease(seg(s, 1.0, 1.45)); const p = C.clone().add(V(0, 0, -.8 * k)); place(noahJ, p, Math.PI + S0.side * .5 * k); fall(noahJ, k, -1);
        noahJ.lArm.rotation.z = -1.2 * k; noahJ.rArm.rotation.x = -.8 * k; noahJ.setFace('pain');
        const q = tEnd.clone().add(V(-S0.side * .6 * k, 0, -.3 * k)); place(tack, q, faceDir(tEnd, C) ); fall(tack, k * .95, 1); tack.lArm.rotation.x = tack.rArm.rotation.x = -1.5;
        if (cur === 2) { const up = ease(seg(t, MK.up, MK.up + 1.4)); if (up > 0) { fall(noahJ, k * (1 - up), -1); noahJ.setFace(up > .3 ? 'determined' : 'pain'); noahJ.lArm.rotation.z = -1.2 * (1 - up); } }
      }
      const cp = noahJ.root.position;
      if (cur === 0) cam(cp.clone().add(V(13, 3.8, 1)), cp.clone().add(V(0, 2.4, -1)), 40, s > 1 && s < 1.25 ? .2 : 0, t);
      else if (cur === 1) cam(s < 1 ? cp.clone().add(V(2, 3.4, 9.5)) : C.clone().add(V(2, 3.4, 7)), cp.clone().add(V(0, 2, -4)), 46, s > 1 && s < 1.25 ? .25 : 0, t);
      else { // t3: front low, then overhead on the ground, then get up
        if (t < MK.t3 + .9) cam(C.clone().add(V(1.6, 1.7, -9)), cp.clone().add(V(0, 2.6, 0)), 46, s > 1 && s < 1.25 ? .3 : 0, t);
        else if (t < MK.up) { const hp = headW(noahJ).add(V(0, 0, 0)); const a = (t - MK.t3) * .15; cam(hp.clone().add(V(Math.sin(a) * 1.5, lerp(10, 5.5, seg(t, MK.t3 + .9, MK.up)), Math.cos(a) * 1.5)), hp, 44); }
        else { const e = ease(seg(t, MK.up, SC.tackles.end)); cam(vl(C.clone().add(V(2.2, .9, -5)), C.clone().add(V(1.8, 1.4, -7.5)), e), noahJ.root.position.clone().add(V(0, 3.5 * seg(t, MK.up, MK.up + 1.4) + 1, 0)), 48); }
      }
    }
  }
  else if (name === 'lastplay') {
    stadiumBase(t, t > MK.try ? 'party' : 'tense'); noahJ.root.visible = true; kyle.root.visible = true;
    const tc = MK.catch, ts = MK.step, td = MK.dive;
    // Noah path
    let p, run = true;
    if (t < tc) p = vl(V(17, 0, 46), V(14, 0, 34), seg(t, SC.lastplay.start, tc));
    else if (t < ts) p = vl(V(14, 0, 34), V(14, 0, 16), seg(t, tc, ts));
    else if (t < td) { const k = seg(t, ts, td); const x = k < .5 ? 14 - 3.2 * Math.sin(k / .5 * Math.PI / 2) : 10.8 + 6 * ease((k - .5) / .5); p = V(x, 0, lerp(16, 4, k)); }
    else { const k = seg(t, td, td + .75); p = V(16.8, Math.sin(Math.PI * k) * 1.3, lerp(4, -2.5, k)); run = false; }
    place(noahJ, p, Math.PI); noahJ.setFace(t > MK.try + .3 ? 'joy' : 'determined');
    if (run) poseRun(noahJ, t * (t > ts && t < td ? 4 : 13), 1);
    else { const k = ease(seg(t, td, td + .6)); fall(noahJ, k, 1); noahJ.lArm.rotation.x = noahJ.rArm.rotation.x = -Math.PI * .9; noahJ.body.position.y = .5 * k; }
    carry.visible = t >= tc;
    // passer
    const mt = mates[0]; mt.root.visible = true; const mp = vl(V(26, 0, 50), V(22, 0, 38), seg(t, SC.lastplay.start, tc + .5)); place(mt, mp, Math.PI); poseRun(mt, t * 12, t < tc + .5 ? 1 : .2); mt.setFace(t > MK.try ? 'joy' : 'determined');
    if (t < tc - .6) { ball.visible = true; ball.position.copy(mp).add(V(-.6, 3, -1)); ball.rotation.y = Math.PI / 2; }
    else if (t < tc) { ball.visible = true; const s = seg(t, tc - .6, tc); const a = mp.clone().add(V(-.6, 3, -1)), b = p.clone().add(V(.4, 3, -1)); const q = vl(a, b, s); q.y += Math.sin(Math.PI * s) * .8; ball.position.copy(q); ball.rotation.y = Math.PI / 2; ball.userData.m.rotation.z = s * 4; }
    // Kyle
    let kp; if (t < ts) kp = vl(V(6, 0, 2), V(9, 0, 9), seg(t, tc, ts)); else kp = vl(V(9, 0, 9), V(10.6, 0, 12.5), seg(t, ts, ts + (td - ts) * .45));
    place(kyle, kp, faceDir(kp, p)); kyle.setFace('mean');
    if (t < ts + (td - ts) * .45) poseRun(kyle, t * (t > ts ? 4 : 12), 1);
    else { const k = ease(seg(t, ts + (td - ts) * .45, ts + (td - ts) * .8)); kyle.root.rotation.y = 0; fall(kyle, k, 1); kyle.lArm.rotation.x = kyle.rArm.rotation.x = -Math.PI * .85; kyle.root.position.z += 1.8 * k; kyle.setFace(k > .5 ? 'shock' : 'mean'); if (t > MK.try) kyle.setFace('down'); }
    // chasers
    [1, 2].forEach(i => { const r = reds[i]; r.root.visible = true; const q = vl(V(-8 + i * 4, 0, 44), V(-2 + i * 3, 0, 14), seg(t, SC.lastplay.start, td + .5)); place(r, q, Math.PI); poseRun(r, t * (t > ts && t < td ? 4 : 12) + i, 1); if (t > MK.try) { r.setFace('down'); } });
    if (t > MK.try) { updateConfetti(t - MK.try, V(16, 0, 0)); }
    // cameras
    if (t < tc - .6) cam(V(46, 16, 62), V(18, 2, 38), 44);
    else if (t < ts) cam(p.clone().add(V(3, 4.8, 11)), p.clone().add(V(-1, 2.5, -8)), 50);
    else if (t < td) cam(V(13.8, 2, -3.5), p.clone().add(V(0, 3, 0)), 52);
    else if (t < MK.try) { const e = seg(t, td, MK.try); cam(vl(V(31, 2.4, 1.5), V(29, 2.2, .5), e), V(16.5, 1.5, -2), 40, t > td + .7 && t < td + .9 ? .25 : 0, t); }
    else { const e = ease(seg(t, MK.try, SC.lastplay.end)); cam(vl(V(24, 4, 5), V(28, 15, 10), e), V(16.8, 1, -5), 46); }
  }
  else if (name === 'twist') {
    stadiumBase(t, 'party'); updateConfetti(t - MK.try, V(16, 0, 0)); chair.visible = ivSt.visible = true;
    const DP = V(100, 0, 24); chair.position.copy(DP); chair.rotation.y = -Math.PI / 2; ivSt.position.copy(DP).add(V(.5, 0, -3));
    dadS.root.visible = true; place(dadS, DP, -Math.PI / 2); sit(dadS, 1.6); dadS.setFace(t > MK.boy ? 'happycrydad' : 'tiredsmile'); dadS.torso.rotation.x = .1;
    nurse.root.visible = true; place(nurse, DP.clone().add(V(2.8, 0, 0)), -Math.PI / 2); nurse.lArm.rotation.x = nurse.rArm.rotation.x = -1.1; nurse.setFace('smile');
    if (t > MK.boy) { const r = ease(seg(t, MK.boy, MK.boy + .6)); dadS.rArm.rotation.x = -2.7 * r; }
    noahJ.root.visible = true; const NP = V(16.8, 0, -3); place(noahJ, NP, lerp(Math.PI, Math.PI / 2, ease(seg(t, SC.twist.start + .6, SC.twist.start + 1.8)))); noahJ.setFace(t < MK.reveal ? 'joy' : 'happycry');
    noahJ.head.rotation.x = -.25 * seg(t, SC.twist.start + 1.2, SC.twist.start + 2); carry.visible = true;
    mates.forEach((m, i) => { if (i < 4) { m.root.visible = true; const a = i / 4 * Math.PI * 2; const q = NP.clone().add(V(Math.cos(a) * 6, 0, Math.sin(a) * 6)); place(m, q, faceDir(q, NP)); m.setFace('joy'); m.body.position.y = Math.abs(Math.sin(t * 7 + i)) * 1; m.lArm.rotation.x = m.rArm.rotation.x = -Math.PI + .3; } });
    const hp = NP.clone().add(V(0, 4.8, 0));
    if (t < MK.reveal) { const e = ease(seg(t, SC.twist.start, MK.reveal)); cam(vl(hp.clone().add(V(3.6, -.4, -3)), hp.clone().add(V(3.6, -.3, -1.2)), e), hp, 40); }
    else if (t < MK.boy + 1.0) { const e = ease(seg(t, MK.reveal, MK.boy + 1)); cam(vl(V(84, 5, 26), V(94.5, 4.6, 24.6), e), DP.clone().add(V(0, 4.1, 0)), lerp(40, 34, e)); }
    else cam(hp.clone().add(V(4, -.3, .6)), hp, 38);
  }
  else if (name === 'hug') {
    stadiumBase(t, 'party'); chair.visible = ivSt.visible = true; fill.intensity = 1.6;
    const DP = V(100, 0, 24); chair.position.copy(DP); chair.rotation.y = -Math.PI / 2; ivSt.position.copy(DP).add(V(.5, 0, -3));
    dadS.root.visible = true; place(dadS, DP, -Math.PI / 2); sit(dadS, 1.6); dadS.setFace('happycrydad');
    nurse.root.visible = true; place(nurse, DP.clone().add(V(2.8, 0, 0)), -Math.PI / 2); nurse.setFace('happycry'); nurse.lArm.rotation.x = nurse.rArm.rotation.x = -1.1;
    noahJ.root.visible = true; noahJ.setFace('happycry');
    if (t < MK.hugstart) { const k = seg(t, MK.run, MK.hugstart); const p = vl(V(84, 0, 25), V(97.6, 0, 24), k); place(noahJ, p, Math.PI / 2); poseRun(noahJ, t * 12, 1 - seg(k, .85, 1) * .8);
      dadS.rArm.rotation.x = dadS.lArm.rotation.x = -1.3 * seg(k, .6, 1);
      cam(V(103.5, 6.2, 21.8), p.clone().add(V(0, 3.5, 0)), 42); }
    else { const k = ease(seg(t, MK.hugstart, MK.hugstart + .6)); place(noahJ, V(97.9, 0, 24), Math.PI / 2); kneel(noahJ); noahJ.body.position.y = lerp(0, -1.25, k); noahJ.lLeg.rotation.x = noahJ.rLeg.rotation.x = 1.35 * k;
      noahJ.lArm.rotation.x = noahJ.rArm.rotation.x = -1.45 * k; noahJ.lArm.rotation.z = .35 * k; noahJ.rArm.rotation.z = -.35 * k; noahJ.torso.rotation.x = .25 * k; noahJ.head.rotation.y = .3;
      dadS.torso.rotation.x = .4 * k; dadS.lArm.rotation.x = dadS.rArm.rotation.x = -1.35; dadS.lArm.rotation.z = .4 * k; dadS.rArm.rotation.z = -.4 * k; dadS.head.rotation.y = -.25 * k;
      const a = lerp(.35, 1.25, ease(seg(t, MK.hugstart, SC.hug.end))); const c = V(98.9, 3.6, 24); cam(c.clone().add(V(-Math.cos(a) * 8.5, 1.2, Math.sin(a) * 8.5)), c, 40); }
  }
  else if (name === 'end') {
    hospitalBase(t, true); bedJersey.visible = true; bedJersey.position.set(0, 3.55, .6); bedJersey.rotation.set(0, .1, 0);
    bedBall.visible = true; bedBall.position.set(-.2, 3.9, -2.4); bedBall.rotation.y = Math.PI / 2 + .3;
    G.hospital.userData.blanket.visible = false;
    const e = ease(seg(t, SC.end.start, TLD.duration)); cam(vl(V(8, 9, 12), V(4.5, 7.2, 7.5), e), V(0, 3.4, 0), 42);
  }
  if (name !== 'end') G.hospital.userData.blanket.visible = true;
  overlay2(t, name, u);
  renderer.render(scene, camera);
}
window.renderAt = render2; window.DUR = TLD.duration;
document.fonts.ready.then(() => { render2(0); window.READY = true; });
