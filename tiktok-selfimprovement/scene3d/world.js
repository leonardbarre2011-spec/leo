// Immersive 3D world with an animated character. Everything on screen is 3D (captions are added later).
// Deterministic: each frame is a pure function of t, so frames render in parallel.
// Places: "room" (night, phone addiction) -> "path" (dawn trail, cherry trees, lake, torii gates)
//         -> "summit" (sunrise above a sea of clouds, 3D call to action)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const rng = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const clamp01 = x => Math.max(0, Math.min(1, x));
const easeOutBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
const easeInOut = x => x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const C = c => new THREE.Color(c);

const ROOM = V(-400, 0, 0), SUMMIT = V(400, 40, 0);
const LOOP = new Set(['Idle', 'Walking', 'Running', 'Dance']);
const HOLD = new Set(['Sitting', 'Death']);
const MOVE = { Walking: 1.45, Running: 4.2 };
const CHAR_H = 1.8;
const LAKE = V(30, 0, -95);

let job, hue, renderer, composer, scene, camera, mixer, actions = {}, robot, palm, sun, sunBall, hemi, amb, sky, skyU,
  phone, phoneLight, lamp, ledLight, monitorLight, moonLight, font;
const anim = [];          // per-frame callbacks (t, place, p)
const segObjs = [];
const pathS = [];
let ctaText;

// ---------------------------------------------------------------- terrain
const pathX = z => 4 * Math.sin(z / 30) + 1.5 * Math.sin(z / 11);
const hills = (x, z) => 3.2 * Math.sin(x * 0.045) * Math.cos(z * 0.037) + 1.4 * Math.sin(x * 0.12 + z * 0.07) + 0.6 * Math.cos(x * 0.31 - z * 0.23) + 0.004 * (x - pathX(z)) ** 2;
const lakeDip = (x, z) => -3.2 * smooth(26, 12, Math.hypot(x - LAKE.x, z - LAKE.z));
const groundY = (x, z) => (hills(x, z) + lakeDip(x, z) * 1) * smooth(3.5, 14, Math.abs(x - pathX(z))) + (Math.abs(x - pathX(z)) < 3.5 ? 0 : 0);

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...o });
const glow = (color, k = 2) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: k });
function inst(geo, mat, list, colors) {
  const m = new THREE.InstancedMesh(geo, mat, list.length), M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  list.forEach((it, i) => { e.set(it.rx || 0, it.ry || 0, it.rz || 0); q.setFromEuler(e);
    M.compose(V(it.x, it.y, it.z), q, V(it.sx ?? it.s ?? 1, it.sy ?? it.s ?? 1, it.sz ?? it.s ?? 1)); m.setMatrixAt(i, M);
    if (colors) m.setColorAt(i, colors[i]); });
  m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
}
function add(mesh, x, y, z, o = {}) { mesh.position.set(x, y, z); if (o.ry) mesh.rotation.y = o.ry; if (o.rx) mesh.rotation.x = o.rx; if (o.rz) mesh.rotation.z = o.rz;
  mesh.castShadow = o.cast ?? true; mesh.receiveShadow = true; (o.parent || scene).add(mesh); return mesh; }
const box = (w, h, d, mat, r = 0) => new THREE.Mesh(r ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d), mat);

// ---------------------------------------------------------------- sky
function buildSky() {
  skyU = { top: { value: C('#000') }, bottom: { value: C('#000') }, sunDir: { value: V(0, 0.1, -1) }, sunCol: { value: C('#000') }, stars: { value: 0 } };
  const mat = new THREE.ShaderMaterial({ uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; uniform float stars; varying vec3 vP;
      float h21(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
      void main(){ float h = clamp(vP.y*1.5+0.12,0.0,1.0); vec3 c = mix(bottom, top, pow(h,0.65));
        float s = max(dot(normalize(vP), normalize(sunDir)),0.0); c += sunCol*(pow(s,9.0)*0.45 + pow(s,90.0)*0.6);
        vec3 q = floor(vP*420.0); float st = step(0.9975, h21(q)) * stars * smoothstep(0.0,0.3,vP.y); c += vec3(st);
        gl_FragColor = vec4(c,1.0); }` });
  sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 48, 24), mat); scene.add(sky);
  sunBall = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: C('#fff1d6'), fog: false, toneMapped: false }));
  sunBall.material.color.multiplyScalar(2.2); scene.add(sunBall);
}

function cloudCluster(R, mat, n = 6) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const s = 2 + R() * 3.5; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), mat);
    m.scale.set(s * 1.3, s * 0.8, s); m.position.set((i - n / 2) * 2.6 + R() * 1.5, R() * 1.5, R() * 3); g.add(m); }
  return g;
}
function bird() {
  const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: '#2a2a35', side: THREE.DoubleSide });
  const wing = new THREE.BufferGeometry(); wing.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -0.25, 0, 0, 0.25, 1.1, 0, 0], 3)); wing.computeVertexNormals();
  const L = new THREE.Mesh(wing, mat), Rw = new THREE.Mesh(wing, mat); Rw.scale.x = -1;
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.7, 5), mat); body.rotation.x = Math.PI / 2;
  g.add(L, Rw, body); g.userData = { L, R: Rw }; return g;
}

// ---------------------------------------------------------------- ROOM (night, cosy but addictive)
function buildRoom(R) {
  const o = ROOM, X = x => o.x + x, Z = z => o.z + z;
  const planks = canvasTex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = ['#5a3d2b', '#634332', '#4f3526', '#6a4936'][i % 4]; g.fillRect(0, i * 64, w, 64);
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, i * 64, w, 2); for (let k = 0; k < 3; k++) g.fillRect((i * 173 + k * 211) % w, i * 64, 2, 64); } });
  planks.wrapS = planks.wrapT = THREE.RepeatWrapping; planks.repeat.set(4, 4);
  add(new THREE.Mesh(new THREE.PlaneGeometry(13, 12), std('#fff', { map: planks, roughness: 0.45 })), X(0), 0, Z(1), { rx: -Math.PI / 2, cast: false });
  const wallM = std('#2a2f45', { roughness: 0.95 });
  const H = 4.6, WIN = { x0: -1.1, x1: 3.5, y0: 1.9, y1: 4.1 };
  // back wall with a real window opening
  add(box(6 + WIN.x0, H, 0.2, wallM), X((-6 + WIN.x0) / 2), H / 2, Z(-4));
  add(box(6 - WIN.x1, H, 0.2, wallM), X((6 + WIN.x1) / 2), H / 2, Z(-4));
  add(box(WIN.x1 - WIN.x0, WIN.y0, 0.2, wallM), X((WIN.x0 + WIN.x1) / 2), WIN.y0 / 2, Z(-4));
  add(box(WIN.x1 - WIN.x0, H - WIN.y1, 0.2, wallM), X((WIN.x0 + WIN.x1) / 2), (H + WIN.y1) / 2, Z(-4));
  for (const sx of [-1, 1]) add(box(0.2, H, 12, wallM), X(sx * 6), H / 2, Z(2));
  add(box(12.2, H, 0.2, wallM), X(0), H / 2, Z(8));
  add(box(12.2, 0.2, 12.2, std('#23273a')), X(0), H, Z(2), { cast: false });
  // skirting + window frame + mullions
  const trim = std('#e8e2d6', { roughness: 0.5 });
  add(box(12, 0.14, 0.05, trim), X(0), 0.07, Z(-3.88));
  const wx = (WIN.x0 + WIN.x1) / 2, wy = (WIN.y0 + WIN.y1) / 2, ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0;
  for (const [w, h, x, y] of [[ww + 0.2, 0.1, wx, WIN.y0], [ww + 0.2, 0.1, wx, WIN.y1], [0.1, wh, WIN.x0, wy], [0.1, wh, WIN.x1, wy], [0.06, wh, wx, wy], [ww, 0.06, wx, wy]])
    add(box(w, h, 0.14, trim), X(x), y, Z(-3.92));
  add(box(ww + 0.5, 0.08, 0.35, trim), X(wx), WIN.y0 - 0.04, Z(-3.75));
  // curtains: wavy 3D cloth
  const curtM = std('#6b2d4a', { roughness: 1, side: THREE.DoubleSide });
  for (const sx of [WIN.x0 - 0.45, WIN.x1 + 0.45]) { const g = new THREE.PlaneGeometry(0.9, 3.3, 24, 1); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, 0.07 * Math.sin(p.getX(i) * 22)); g.computeVertexNormals();
    add(new THREE.Mesh(g, curtM), X(sx), 2.75, Z(-3.7)); }
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, ww + 2.2, 8), std('#222', { metalness: 0.8, roughness: 0.3 })), X(wx), 4.45, Z(-3.68), { rz: Math.PI / 2 });
  // city outside: real 3D buildings with lit windows + moon + stars (shader)
  const winTex = canvasTex(128, 256, (g, w, h) => { g.fillStyle = '#05060c'; g.fillRect(0, 0, w, h); const r = rng(4);
    for (let y = 6; y < h; y += 12) for (let x = 6; x < w; x += 12) if (r() < 0.32) { g.fillStyle = r() < 0.75 ? '#ffc86b' : '#8ec5ff'; g.fillRect(x, y, 6, 7); } });
  winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping;
  for (let i = 0; i < 70; i++) { const w = 6 + R() * 10, h = 12 + R() * 55, d = 6 + R() * 10, t = winTex.clone(); t.needsUpdate = true; t.repeat.set(w / 10, h / 20);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: '#0b0e1a', emissive: '#ffffff', emissiveMap: t, emissiveIntensity: 1.1, roughness: 0.9 }));
    m.position.set(X((R() - 0.4) * 220), h / 2 - 25, Z(-40 - R() * 160)); scene.add(m); }
  const moon = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 16), new THREE.MeshBasicMaterial({ color: '#f4f1ff', fog: false, toneMapped: false })); moon.position.set(X(40), 60, Z(-180)); scene.add(moon);
  // sofa (rounded), cushions, blanket
  const fab = std('#3e3a5c', { roughness: 0.95 }), fab2 = std('#58507e', { roughness: 0.95 });
  add(box(3.3, 0.45, 1.15, fab, 0.12), X(0), 0.36, Z(-0.75));
  add(box(3.3, 1.0, 0.38, fab, 0.15), X(0), 0.85, Z(-1.38));
  for (const sx of [-1.62, 1.62]) add(box(0.4, 0.75, 1.2, fab, 0.15), X(sx), 0.5, Z(-0.75));
  for (const x of [-0.75, 0.75]) add(box(1.45, 0.25, 1.0, fab2, 0.1), X(x), 0.68, Z(-0.68));
  add(box(0.55, 0.5, 0.18, std('#d4a24c'), 0.08), X(-1.15), 0.95, Z(-1.05), { rz: 0.25, ry: 0.2 });
  for (const sx of [-1.45, 1.45]) for (const sz of [-0.3, -1.25]) add(box(0.08, 0.14, 0.08, std('#222')), X(sx), 0.07, Z(sz));
  // rug
  add(new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.03, 48), std('#7a4b5c', { roughness: 1 })), X(0), 0.015, Z(1.1), { cast: false });
  add(new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.03, 6, 64), std('#d9b48a')), X(0), 0.035, Z(1.1), { rx: Math.PI / 2, cast: false });
  // side table + lamp with shade
  const wood = std('#8b5e3c', { roughness: 0.55 });
  add(box(0.7, 0.06, 0.7, wood, 0.02), X(2.35), 0.62, Z(-0.9)); add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 10), wood), X(2.35), 0.3, Z(-0.9));
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), std('#c9a26b', { metalness: 0.8, roughness: 0.3 })), X(2.35), 0.9, Z(-0.9));
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.36, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#ffe2b0', emissive: '#ffb057', emissiveIntensity: 0.9, side: THREE.DoubleSide })), X(2.35), 1.25, Z(-0.9));
  lamp = new THREE.PointLight('#ffb36b', 10, 9, 2); lamp.position.set(X(2.35), 1.2, Z(-0.9)); lamp.castShadow = true; lamp.shadow.mapSize.set(512, 512); scene.add(lamp);
  // snacks & cans on the floor, pizza box
  const can = std('#d63a3a', { metalness: 0.8, roughness: 0.25 });
  for (const [x, z, r] of [[1.2, 0.5, 0], [1.45, 0.3, 0], [-1.9, 0.9, 1.57]]) add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 14), can), X(x), r ? 0.06 : 0.1, Z(z), { rz: r });
  add(box(0.8, 0.07, 0.8, std('#c89b62')), X(-1.1), 0.035, Z(1.7), { ry: 0.4 });
  // bed (right side)
  add(box(2.2, 0.4, 3.2, wood, 0.05), X(4.6), 0.2, Z(-1.9)); add(box(2.1, 0.3, 3.0, std('#e9e6f2'), 0.12), X(4.6), 0.55, Z(-1.9));
  add(box(2.15, 0.12, 2.0, std('#4b6aa8', { roughness: 1 }), 0.06), X(4.6), 0.73, Z(-1.3));
  for (const x of [4.1, 5.1]) add(box(0.8, 0.22, 0.5, std('#f5f3fb'), 0.1), X(x), 0.8, Z(-3.15));
  add(box(2.3, 1.3, 0.12, wood, 0.04), X(4.6), 0.65, Z(-3.55));
  // desk + glowing monitor + keyboard + chair (left)
  add(box(2.0, 0.08, 0.8, wood, 0.02), X(-4.6), 0.95, Z(-3.2));
  for (const sx of [-0.9, 0.9]) add(box(0.06, 0.95, 0.7, std('#222')), X(-4.6 + sx), 0.47, Z(-3.2));
  const screen = canvasTex(256, 160, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1d2b6b'); gr.addColorStop(1, '#7b3fa0'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 9; i++) g.fillRect(20, 20 + i * 14, 40 + (i * 37) % 160, 6); });
  add(box(1.1, 0.65, 0.05, std('#111', { metalness: 0.5 })), X(-4.6), 1.5, Z(-3.45));
  add(new THREE.Mesh(new THREE.PlaneGeometry(1.02, 0.57), new THREE.MeshBasicMaterial({ map: screen, toneMapped: false })), X(-4.6), 1.5, Z(-3.42), { cast: false });
  add(box(0.06, 0.3, 0.06, std('#111')), X(-4.6), 1.12, Z(-3.45)); add(box(0.6, 0.03, 0.2, std('#333'), 0.01), X(-4.6), 1.0, Z(-3.0));
  monitorLight = new THREE.PointLight('#6f7dff', 3, 5, 2); monitorLight.position.set(X(-4.6), 1.5, Z(-2.9)); scene.add(monitorLight);
  add(box(0.6, 0.08, 0.6, std('#2c2c34'), 0.04), X(-4.6), 0.55, Z(-2.3)); add(box(0.6, 0.7, 0.08, std('#2c2c34'), 0.04), X(-4.6), 0.95, Z(-2.02));
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), std('#111')), X(-4.6), 0.27, Z(-2.3));
  // bookshelf with books (back wall, left)
  add(box(1.6, 2.6, 0.4, wood, 0.02), X(-2.5), 1.3, Z(-3.7));
  const bookList = [], bookCols = [];
  for (let sh = 0; sh < 4; sh++) { let x = -3.2; add(box(1.5, 0.04, 0.36, std('#6e4a2f')), X(-2.5), 0.2 + sh * 0.62, Z(-3.65));
    while (x < -1.85) { const w = 0.06 + R() * 0.07, h = 0.3 + R() * 0.2; bookList.push({ x: X(x + w / 2), y: 0.22 + sh * 0.62 + h / 2, z: Z(-3.62), sx: w, sy: h, sz: 0.26, rz: R() < 0.1 ? 0.2 : 0 });
      bookCols.push(C(['#c0392b', '#2e86c1', '#f1c40f', '#27ae60', '#8e44ad', '#ecf0f1', '#d35400'][Math.floor(R() * 7)])); x += w + 0.01; } }
  inst(new THREE.BoxGeometry(1, 1, 1), std('#fff', { roughness: 0.7 }), bookList, bookCols);
  // plant
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.5, 16), std('#d8cbb8')), X(-5.3), 0.25, Z(0.8));
  const leafM = std('#3f8f4a', { side: THREE.DoubleSide });
  for (let i = 0; i < 14; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), leafM); l.scale.set(0.35, 1.2, 0.08);
    const a = i * 2.4; l.position.set(X(-5.3) + Math.cos(a) * 0.15, 0.85 + (i % 3) * 0.12, Z(0.8) + Math.sin(a) * 0.15); l.rotation.set(Math.cos(a) * 0.6, a, Math.sin(a) * 0.6); scene.add(l); }
  // framed pictures (3D frames)
  for (const [x, y, w, h, c1, c2] of [[-4.8, 3.0, 1.1, 0.8, '#ff9a8b', '#6a5acd'], [3.8, 3.1, 0.9, 1.2, '#43cea2', '#185a9d'], [5.2, 3.1, 0.6, 0.6, '#f7971e', '#ffd200']]) {
    add(box(w + 0.1, h + 0.1, 0.05, std('#1b1b1b')), X(x), y, Z(-3.88));
    const art = canvasTex(128, 128, (g) => { const gr = g.createLinearGradient(0, 0, 128, 128); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(80, 50, 22, 0, 7); g.fill(); });
    add(new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: art, roughness: 0.6 })), X(x), y, Z(-3.85), { cast: false }); }
  // LED strip along the ceiling (accent colour) — gives the room its mood
  const led = glow(hue, 3);
  add(box(11.6, 0.04, 0.04, led), X(0), H - 0.12, Z(-3.82), { cast: false });
  for (const sx of [-1, 1]) add(box(0.04, 0.04, 11.6, led), X(sx * 5.82), H - 0.12, Z(2), { cast: false });
  ledLight = new THREE.PointLight(hue, 8, 12, 1.6); ledLight.position.set(X(0), H - 0.5, Z(-2.5)); scene.add(ledLight);
  // phone (3D) with a glowing screen
  phone = new THREE.Group();
  phone.add(box(0.09, 0.18, 0.012, std('#111', { metalness: 0.6, roughness: 0.3 }), 0.004));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.16), new THREE.MeshBasicMaterial({ color: '#bfe0ff', toneMapped: false })); scr.position.z = 0.007; phone.add(scr);
  scene.add(phone);
  phoneLight = new THREE.PointLight('#7fb8ff', 0, 3.5, 2); scene.add(phoneLight);
  moonLight = new THREE.DirectionalLight('#9fb4ff', 0); moonLight.position.set(X(4), 9, Z(-14)); moonLight.target.position.set(X(0), 0, Z(0)); scene.add(moonLight, moonLight.target);
  // dust motes floating in the lamp light
  const N = 400, pos = new Float32Array(N * 3), base = [];
  for (let i = 0; i < N; i++) base.push([X((R() - 0.5) * 11), R() * 4.2, Z(-3.5 + R() * 10), R() * 6.28]);
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: '#ffe8c2', size: 0.025, transparent: true, opacity: 0.7, depthWrite: false })); scene.add(dust);
  anim.push((t, place) => { dust.visible = place === 'room'; if (!dust.visible) return;
    base.forEach(([x, y, z, ph], i) => { pos[i * 3] = x + 0.2 * Math.sin(t * 0.3 + ph); pos[i * 3 + 1] = (y + t * 0.05) % 4.3; pos[i * 3 + 2] = z + 0.2 * Math.cos(t * 0.25 + ph); });
    dg.attributes.position.needsUpdate = true; });
}

// ---------------------------------------------------------------- PATH (dawn trail)
function buildPath(R) {
  const g = new THREE.PlaneGeometry(320, 560, 160, 280); g.rotateX(-Math.PI / 2); g.translate(0, 0, -250);
  const p = g.attributes.position, col = [];
  const cA = C('#4f8f3e'), cB = C('#8dbb4c'), cP = C('#d8bf8f'), cS = C('#c9b27a');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), y = groundY(x, z); p.setY(i, y);
    const d = Math.abs(x - pathX(z)); const c = cA.clone().lerp(cB, 0.5 + 0.5 * Math.sin(x * 0.15 + z * 0.11) * Math.cos(z * 0.05));
    if (d < 1.5) c.copy(cP); else if (d < 2.2) c.lerp(cP, 0.5);
    if (y < -0.9) c.lerp(cS, 0.8);
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })), 0, 0, 0, { cast: false });

  // lake with animated low-poly water
  const wg = new THREE.PlaneGeometry(56, 56, 36, 36); wg.rotateX(-Math.PI / 2);
  const water = add(new THREE.Mesh(wg, new THREE.MeshStandardMaterial({ color: '#3fa7c9', roughness: 0.08, metalness: 0.25, flatShading: true, transparent: true, opacity: 0.92 })), LAKE.x, -0.75, LAKE.z, { cast: false });
  const wbase = wg.attributes.position.array.slice();
  anim.push((t, place) => { if (place !== 'path') return; const a = wg.attributes.position;
    for (let i = 0; i < a.count; i++) { const x = wbase[i * 3], z = wbase[i * 3 + 2]; a.setY(i, 0.09 * Math.sin(x * 0.6 + t * 1.6) + 0.07 * Math.cos(z * 0.7 - t * 1.2)); }
    a.needsUpdate = true; wg.computeVertexNormals(); });
  // lily pads
  inst(new THREE.CylinderGeometry(0.5, 0.5, 0.03, 10), std('#3e8e3e'), Array.from({ length: 30 }, () => { const a = R() * 6.28, r = 4 + R() * 18; return { x: LAKE.x + Math.cos(a) * r, y: -0.62, z: LAKE.z + Math.sin(a) * r, s: 0.6 + R() * 0.7 }; }));

  const nearPath = (minD, maxD) => { for (;;) { const z = 15 - R() * 470, side = R() < 0.5 ? -1 : 1, x = pathX(z) + side * (minD + R() * (maxD - minD));
    if (Math.hypot(x - LAKE.x, z - LAKE.z) > 27) return [x, z]; } };
  // pines (two stacked cones)
  const pines = []; for (let i = 0; i < 420; i++) { const [x, z] = nearPath(9, 110); pines.push({ x, z, y: groundY(x, z), s: 0.8 + R() * 1.6 }); }
  inst(new THREE.CylinderGeometry(0.15, 0.22, 1.4, 6), std('#5b3b24', { flatShading: true }), pines.map(t => ({ ...t, y: t.y + 0.7 * t.s })));
  const pc = pines.map(() => C().setHSL(0.3 + R() * 0.06, 0.45, 0.2 + R() * 0.1));
  inst(new THREE.ConeGeometry(1.3, 2.6, 7), std('#fff', { flatShading: true }), pines.map(t => ({ ...t, y: t.y + 2.2 * t.s })), pc);
  inst(new THREE.ConeGeometry(0.95, 2.0, 7), std('#fff', { flatShading: true }), pines.map(t => ({ ...t, y: t.y + 3.3 * t.s })), pc);
  // cherry blossom trees close to the path
  const cherry = []; for (let i = 0; i < 120; i++) { const [x, z] = nearPath(7.5, 24); cherry.push({ x, z, y: groundY(x, z), s: 0.9 + R() * 0.7 }); }
  inst(new THREE.CylinderGeometry(0.13, 0.22, 2.2, 7), std('#4a2f26', { flatShading: true }), cherry.map(t => ({ ...t, y: t.y + 1.1 * t.s })));
  const blobs = [], bc = [];
  cherry.forEach(t => { for (let k = 0; k < 4; k++) { blobs.push({ x: t.x + (R() - 0.5) * 2 * t.s, y: t.y + (2.4 + R() * 1.2) * t.s, z: t.z + (R() - 0.5) * 2 * t.s, s: (0.9 + R() * 0.6) * t.s, ry: R() * 3 });
    bc.push(C().setHSL(0.93 + R() * 0.04, 0.7, 0.78 + R() * 0.1)); } });
  inst(new THREE.IcosahedronGeometry(1, 1), std('#fff', { flatShading: true, roughness: 0.9 }), blobs, bc);
  // falling petals
  const NP = 1400, pp = new Float32Array(NP * 3), pb = [];
  for (let i = 0; i < NP; i++) { const z = 10 - R() * 300; pb.push([pathX(z) + (R() - 0.5) * 26, R() * 9, z, R() * 6.28]); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const petals = new THREE.Points(pg, new THREE.PointsMaterial({ color: '#ffc3da', size: 0.09, transparent: true, opacity: 0.95, depthWrite: false })); scene.add(petals);
  anim.push((t, place) => { petals.visible = place === 'path'; if (!petals.visible) return;
    pb.forEach(([x, y, z, ph], i) => { pp[i * 3] = x + 0.6 * Math.sin(t * 0.8 + ph) + t * 0.25; pp[i * 3 + 1] = ((y - t * 0.55) % 9 + 9) % 9 + 0.05; pp[i * 3 + 2] = z + 0.4 * Math.cos(t * 0.6 + ph); });
    pg.attributes.position.needsUpdate = true; });
  // bushes, grass tufts, flowers
  inst(new THREE.IcosahedronGeometry(1, 0), std('#3f7f35', { flatShading: true }), Array.from({ length: 260 }, () => { const [x, z] = nearPath(2.6, 30); return { x, y: groundY(x, z) + 0.25, z, sx: 0.6 + R() * 0.7, sy: 0.45 + R() * 0.4, sz: 0.6 + R() * 0.7, ry: R() * 3 }; }));
  const tufts = [], tc = [];
  for (let i = 0; i < 9000; i++) { const z = 12 - R() * 320, x = pathX(z) + (R() < 0.5 ? -1 : 1) * (1.6 + R() ** 1.5 * 26);
    if (Math.hypot(x - LAKE.x, z - LAKE.z) < 25) continue; tufts.push({ x, y: groundY(x, z) + 0.16, z, s: 0.7 + R() * 0.8, rx: (R() - 0.5) * 0.4, rz: (R() - 0.5) * 0.4 });
    tc.push(C().setHSL(0.24 + R() * 0.08, 0.55, 0.32 + R() * 0.18)); }
  inst(new THREE.ConeGeometry(0.06, 0.38, 3), std('#fff', { flatShading: true }), tufts, tc).castShadow = false;
  const fl = [], fc = [];
  for (let i = 0; i < 1800; i++) { const z = 12 - R() * 320, x = pathX(z) + (R() < 0.5 ? -1 : 1) * (2.4 + R() ** 1.3 * 20);
    if (Math.hypot(x - LAKE.x, z - LAKE.z) < 25) continue; fl.push({ x, y: groundY(x, z) + 0.3, z, s: 0.06 + R() * 0.04 });
    fc.push(C(['#ffffff', '#ffe066', '#ff8fab', '#b197fc', '#ff922b'][Math.floor(R() * 5)])); }
  inst(new THREE.IcosahedronGeometry(1, 0), std('#fff', { emissive: '#222', flatShading: true }), fl, fc).castShadow = false;
  // stepping stones along the path
  const stones = []; for (let z = 8; z > -440; z -= 0.85) stones.push({ x: pathX(z) + (R() - 0.5) * 0.7, y: 0.03, z: z + (R() - 0.5) * 0.3, sx: 0.4 + R() * 0.2, sy: 1, sz: 0.3 + R() * 0.15, ry: R() * 3 });
  inst(new THREE.CylinderGeometry(1, 1, 0.08, 8), std('#a39e96', { flatShading: true }), stones);
  // rocks
  inst(new THREE.DodecahedronGeometry(0.5, 0), std('#8d8a84', { flatShading: true }), Array.from({ length: 180 }, () => { const [x, z] = nearPath(2.3, 40); const s = 0.3 + R() * 1.3; return { x, y: groundY(x, z) + 0.12 * s, z, sx: s, sy: s * 0.7, sz: s, rx: R() * 3, ry: R() * 3 }; }));
  // stone lanterns (warm glow)
  const stoneM = std('#9a958c', { flatShading: true }), warm = glow('#ffcf8a', 2.4);
  for (let z = -4, k = 0; z > -440; z -= 11, k++) { const x = pathX(z) + (k % 2 ? 2.1 : -2.1);
    add(box(0.5, 0.12, 0.5, stoneM), x, 0.06, z); add(box(0.22, 0.7, 0.22, stoneM), x, 0.45, z); add(box(0.42, 0.3, 0.42, warm), x, 0.95, z, { cast: false });
    add(new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.3, 4), stoneM), x, 1.25, z, { ry: Math.PI / 4 }); }
  // torii gates you walk through (accent colour)
  const toriiM = std(hue.clone().lerp(C('#d62828'), 0.55), { roughness: 0.5 }), blk = std('#1a1a1a');
  for (let z = -22; z > -430; z -= 52) { const x = pathX(z), g2 = new THREE.Group();
    for (const sx of [-2.3, 2.3]) { add(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 4.4, 14), toriiM), sx, 2.2, 0, { parent: g2 }); add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 14), blk), sx, 0.15, 0, { parent: g2 }); }
    add(box(6.4, 0.32, 0.45, toriiM, 0.06), 0, 4.45, 0, { parent: g2 }); add(box(6.9, 0.16, 0.55, blk, 0.04), 0, 4.68, 0, { parent: g2 });
    add(box(5.2, 0.2, 0.3, toriiM), 0, 3.65, 0, { parent: g2 }); add(box(0.2, 0.8, 0.25, toriiM), 0, 4.05, 0, { parent: g2 });
    g2.position.set(x, 0, z); g2.rotation.y = Math.atan2(pathX(z - 0.3) - x, -0.3) + Math.PI; scene.add(g2); }
  // distant mountains with snow caps (layered for depth)
  const mm = std('#6d7fa0', { flatShading: true, roughness: 1 }), snow = std('#f4f7ff', { flatShading: true, roughness: 0.9 });
  for (let i = 0; i < 22; i++) { const h = 70 + R() * 120, r = h * (0.7 + R() * 0.4), x = (R() - 0.5) * 900, z = -420 - R() * 260, ry = R() * 3;
    add(new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), mm), x, h / 2 - 12, z, { ry, cast: false });
    add(new THREE.Mesh(new THREE.ConeGeometry(r * 0.32, h * 0.32, 7), snow), x, h - 12 - h * 0.16 + 0.5, z, { ry, cast: false }); }
  // fireflies
  const NF = 260, fp = new Float32Array(NF * 3), fb = [];
  for (let i = 0; i < NF; i++) { const z = 8 - R() * 260; fb.push([pathX(z) + (R() - 0.5) * 16, 0.3 + R() * 2.2, z, R() * 6.28]); }
  const fgeo = new THREE.BufferGeometry(); fgeo.setAttribute('position', new THREE.BufferAttribute(fp, 3));
  const ff = new THREE.Points(fgeo, new THREE.PointsMaterial({ color: C('#fff3b0').multiplyScalar(3), size: 0.07, transparent: true, depthWrite: false, toneMapped: false })); scene.add(ff);
  anim.push((t, place) => { ff.visible = place === 'path'; if (!ff.visible) return;
    ff.material.opacity = 0.9 * (1 - smooth(0.3, 0.8, t / job.dur));
    fb.forEach(([x, y, z, ph], i) => { fp[i * 3] = x + 0.5 * Math.sin(t * 0.7 + ph); fp[i * 3 + 1] = y + 0.3 * Math.sin(t * 1.3 + ph * 2); fp[i * 3 + 2] = z + 0.5 * Math.cos(t * 0.5 + ph); });
    fgeo.attributes.position.needsUpdate = true; });
}

// ---------------------------------------------------------------- SUMMIT
function buildSummit(R) {
  const o = SUMMIT;
  const rock = std('#7d6c5f', { flatShading: true, roughness: 1 }), snow = std('#f6f8ff', { flatShading: true, roughness: 0.85 });
  const mg = new THREE.CylinderGeometry(6.5, 64, 50, 11, 6); const p = mg.attributes.position;
  for (let i = 0; i < p.count; i++) if (p.getY(i) < 24.9) { const k = 0.85 + R() * 0.3; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); p.setY(i, p.getY(i) + (R() - 0.5) * 2); }
  mg.computeVertexNormals(); add(new THREE.Mesh(mg, rock), o.x, o.y - 25, o.z, { cast: false });
  add(new THREE.Mesh(new THREE.CylinderGeometry(6.6, 6.7, 0.12, 24), std('#9b8b7c', { flatShading: true })), o.x, o.y + 0.0, o.z, { cast: false });
  // snow patches + boulders on the plateau
  inst(new THREE.SphereGeometry(1, 10, 6), snow, Array.from({ length: 16 }, () => { const a = R() * 6.28, r = 3 + R() * 3.3; return { x: o.x + Math.cos(a) * r, y: o.y, z: o.z + Math.sin(a) * r, sx: 0.6 + R(), sy: 0.18, sz: 0.5 + R() * 0.8 }; }));
  inst(new THREE.DodecahedronGeometry(1, 0), std('#6f6257', { flatShading: true }), Array.from({ length: 12 }, () => { const a = R() * 6.28, r = 4.5 + R() * 2; return { x: o.x + Math.cos(a) * r, y: o.y + 0.2, z: o.z + Math.sin(a) * r, s: 0.3 + R() * 0.6, rx: R() * 3, ry: R() * 3 }; }));
  // cairn
  [0.55, 0.45, 0.36, 0.28, 0.2].forEach((s, i) => add(new THREE.Mesh(new THREE.DodecahedronGeometry(s, 1), std('#8a8279', { flatShading: true })), o.x + 2.3, o.y + 0.25 + i * 0.42, o.z - 1.6, { ry: i }));
  // flag (waving cloth)
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.6, 10), std('#ddd', { metalness: 0.8, roughness: 0.3 })), o.x - 2.2, o.y + 1.8, o.z - 1.6);
  const fgeo = new THREE.PlaneGeometry(1.5, 0.9, 16, 6), flag = add(new THREE.Mesh(fgeo, std(hue, { side: THREE.DoubleSide, roughness: 0.7 })), o.x - 2.2 + 0.76, o.y + 3.1, o.z - 1.6);
  const fb = fgeo.attributes.position.array.slice();
  anim.push((t, place) => { if (place !== 'summit') return; const a = fgeo.attributes.position;
    for (let i = 0; i < a.count; i++) { const x = fb[i * 3] + 0.75; a.setZ(i, 0.14 * x * Math.sin(x * 5 - t * 7)); a.setY(i, fb[i * 3 + 1] - 0.05 * x * x); } a.needsUpdate = true; fgeo.computeVertexNormals(); });
  // floating crystals in the accent colour
  const crys = [];
  for (let i = 0; i < 7; i++) { const a = -0.6 + i * 0.9 + Math.PI, m = add(new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), new THREE.MeshStandardMaterial({ color: hue, emissive: hue, emissiveIntensity: 1.4, metalness: 0.3, roughness: 0.1, flatShading: true })), 0, 0, 0, { cast: false });
    m.scale.y = 1.8; crys.push([m, a, 5.6 + R() * 1.2, R() * 6.28]); }
  anim.push((t, place) => { crys.forEach(([m, a, r, ph]) => { m.visible = place === 'summit'; m.position.set(o.x + Math.cos(a + t * 0.05) * r, o.y + 1.6 + 0.35 * Math.sin(t * 1.4 + ph), o.z + Math.sin(a + t * 0.05) * r); m.rotation.y = t * 1.2 + ph; }); });
  // sea of clouds (slowly drifting)
  const cm = std('#fff6ee', { flatShading: true, roughness: 1 });
  const cl = [], NC = 520;
  for (let i = 0; i < NC; i++) { const a = R() * 6.283, r = 16 + R() * 280, s = 4 + R() * 13; cl.push([a, r, s, o.y - 14 - R() * 7, R()]); }
  const clouds = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), cm, NC); clouds.receiveShadow = true; scene.add(clouds);
  const M = new THREE.Matrix4(), q = new THREE.Quaternion();
  clouds.visible = false;
  anim.push((t, place) => { clouds.visible = place === 'summit'; if (place !== 'summit') return;
    cl.forEach(([a, r, s, y, ph], i) => { const aa = a + t * 0.012 * (60 / r); M.compose(V(o.x + Math.cos(aa) * r, y + 0.4 * Math.sin(t * 0.3 + ph * 6), o.z + Math.sin(aa) * r), q, V(s * 1.6, s * 0.42, s)); clouds.setMatrixAt(i, M); });
    clouds.instanceMatrix.needsUpdate = true; });
  // neighbouring peaks piercing the clouds
  const pm = std('#7a8bb0', { flatShading: true, roughness: 1 });
  for (let i = 0; i < 12; i++) { const a = Math.PI + (R() - 0.5) * 2.6, d = 140 + R() * 240, h = 26 + R() * 50, r = h * 0.8, ry = R() * 3, x = o.x + Math.cos(a) * d * 0.6 + (R() - 0.5) * 120, z = o.z - Math.abs(Math.sin(a) * d) - 40;
    add(new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), pm), x, o.y - 18 + h / 2, z, { ry, cast: false });
    add(new THREE.Mesh(new THREE.ConeGeometry(r * 0.35, h * 0.35, 7), snow), x, o.y - 18 + h - h * 0.175 + 0.3, z, { ry, cast: false }); }
}

// ---------------------------------------------------------------- init
window.init = async (j) => {
  job = j;
  const R = rng(j.seed || 5);
  hue = C(`rgb(${j.hue[0]},${j.hue[1]},${j.hue[2]})`);
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(j.w, j.h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene(); scene.fog = new THREE.Fog('#000', 30, 260);
  camera = new THREE.PerspectiveCamera(50, j.w / j.h, 0.05, 3000); scene.add(camera);
  amb = new THREE.AmbientLight('#ffffff', 0.2); hemi = new THREE.HemisphereLight('#bcd7ff', '#3b2b1a', 0.6);
  sun = new THREE.DirectionalLight('#ffd6a0', 2.5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 120 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  scene.add(amb, hemi, sun, sun.target);
  buildSky(); buildRoom(R); buildPath(R); buildSummit(R);
  // sky clouds + birds (shared by path & summit)
  const cmat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffe6d0', emissiveIntensity: 0.25, flatShading: true, roughness: 1, fog: false });
  const skyClouds = []; for (let i = 0; i < 26; i++) { const c = cloudCluster(R, cmat); c.userData = { a: R() * 6.28, r: 120 + R() * 220, y: 55 + R() * 60, s: 1.5 + R() * 2.5 }; c.scale.setScalar(c.userData.s); scene.add(c); skyClouds.push(c); }
  const birds = []; for (let i = 0; i < 7; i++) { const b = bird(); b.scale.setScalar(0.7); scene.add(b); birds.push(b); }
  anim.push((t, place, p) => { const out = place !== 'room';
    skyClouds.forEach(c => { c.visible = out; const a = c.userData.a + t * 0.004; c.position.set(p.x + Math.cos(a) * c.userData.r, p.y + c.userData.y, p.z - 60 + Math.sin(a) * c.userData.r * 0.6); });
    birds.forEach((b, i) => { b.visible = out; const row = Math.floor((i + 1) / 2), side = i % 2 ? 1 : -1, k = ((t * 3.2) % 120) - 60;
      b.position.set(p.x + k + row * -1.6, p.y + 16 + row * 0.5 + Math.sin(t + i) * 0.3, p.z - 34 + side * row * 1.6); b.rotation.y = -Math.PI / 2;
      const f = Math.sin(t * 9 + i) * 0.6; b.userData.L.rotation.z = f; b.userData.R.rotation.z = -f; }); });

  const gltf = await new Promise((res, rej) => new GLTFLoader().load('./assets/RobotExpressive.glb', res, undefined, rej));
  robot = gltf.scene;
  const bb = new THREE.Box3().setFromObject(robot); robot.scale.setScalar(CHAR_H / (bb.max.y - bb.min.y));
  robot.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  palm = robot.getObjectByName('Palm2R') || robot.getObjectByName('Palm2.R');
  scene.add(robot);
  mixer = new THREE.AnimationMixer(robot);
  for (const clip of gltf.animations) { const a = mixer.clipAction(clip); a.play(); a.setEffectiveWeight(0); actions[clip.name] = a; }

  font = await new Promise(res => new FontLoader().load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', res));
  const gold = new THREE.MeshStandardMaterial({ color: C('#ffe3a3').lerp(hue, 0.15), metalness: 0.7, roughness: 0.25, emissive: C('#ffc96b').lerp(hue, 0.25), emissiveIntensity: 0.45 });
  const goldSide = new THREE.MeshStandardMaterial({ color: '#7a5a22', metalness: 0.9, roughness: 0.35 });
  const text3d = (txt, size, depth) => { const geo = new TextGeometry(txt, { font, size, depth, curveSegments: 8, bevelEnabled: true, bevelThickness: depth * 0.12, bevelSize: size * 0.03, bevelSegments: 4 });
    geo.computeBoundingBox(); const b = geo.boundingBox; geo.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -depth / 2);
    const m = new THREE.Mesh(geo, [gold, goldSide]); m.castShadow = true; return m; };

  let s = 0; const dt = 1 / 120;
  for (let t = 0; t <= j.dur + 1; t += dt) { const sg = j.segs[segAt(t)]; if ((sg.place || 'path') === 'path') s += (MOVE[sg.anim] || 0) * dt; pathS.push(s); }
  for (const sg of j.segs) { const o = { seg: sg };
    if (sg.label) { o.label = text3d(sg.label, sg.label.length <= 2 ? 0.9 : 0.6, 0.25); o.label.visible = false; scene.add(o.label); }
    segObjs.push(o); }
  // call to action, carved in gold in the sky above the clouds
  ctaText = new THREE.Group();
  const l1 = text3d('FOLLOW', 1.45, 0.5), l2 = text3d('FOR MORE', 0.72, 0.3); l1.position.y = 0.7; l2.position.y = -0.85; ctaText.add(l1, l2);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.06, 12, 128), new THREE.MeshStandardMaterial({ color: hue, emissive: hue, emissiveIntensity: 2.5 })); ring.scale.y = 0.55; ctaText.add(ring);
  ctaText.visible = false; scene.add(ctaText);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(j.w / 2, j.h / 2), 0.45, 0.5, 0.82));
  composer.addPass(new OutputPass());
  return true;
};

function segAt(t) { let si = 0; for (let i = 0; i < job.segs.length; i++) if (t >= job.segs[i].start - 0.12) si = i; return si; }
function clipState(name, since) {
  const a = actions[name] || actions.Idle, d = a.getClip().duration;
  if (LOOP.has(name)) return [name, since % d];
  if (HOLD.has(name)) return [name, Math.min(since, d - 0.001)];
  const reps = d < 1.2 ? 2 : 1;
  if (since < d * reps) return [name, since % d];
  return ['Idle', (since - d * reps) % actions.Idle.getClip().duration];
}
function setPose(t) {
  const si = segAt(t), sg = job.segs[si], since = t - (sg.start - 0.12);
  for (const a of Object.values(actions)) a.setEffectiveWeight(0);
  const [nA, tA] = clipState(sg.anim || 'Idle', since);
  let w = 1;
  if (si > 0 && (job.segs[si - 1].place || 'path') === (sg.place || 'path') && since < 0.3) {
    const pg = job.segs[si - 1], [nB, tB] = clipState(pg.anim || 'Idle', sg.start - pg.start + since);
    if (nB !== nA) { w = clamp01(since / 0.3); actions[nB].time = tB; actions[nB].setEffectiveWeight(1 - w); }
  }
  actions[nA].time = tA; actions[nA].setEffectiveWeight(w); mixer.update(0);
  return { si, sg, since };
}
function charTransform(t, sg) {
  const place = sg.place || 'path';
  if (place === 'room') return { p: ROOM.clone().add(V(0, 0.1, -0.55)), yaw: 0 };
  if (place === 'summit') return { p: SUMMIT.clone().add(V(0, 0.06, 0)), yaw: 0.2 };
  const s = pathS[Math.min(pathS.length - 1, Math.floor(t * 120))], z = 4 - s, x = pathX(z), x2 = pathX(z - 0.3);
  return { p: V(x, 0.06, z), yaw: Math.atan2(x2 - x, -0.3) };
}

// ---------------------------------------------------------------- frame
window.renderAt = (t) => {
  const { si, sg, since } = setPose(t);
  const place = sg.place || 'path', inRoom = place === 'room';
  const { p, yaw } = charTransform(t, sg);
  robot.position.copy(p); robot.rotation.y = yaw;
  const fwd = V(Math.sin(yaw), 0, Math.cos(yaw)), right = V(Math.cos(yaw), 0, -Math.sin(yaw));
  const prog = clamp01(t / job.dur);

  if (inRoom) {
    skyU.top.value.set('#03050d'); skyU.bottom.value.set('#0b1230'); skyU.sunCol.value.set('#000'); skyU.stars.value = 1;
    scene.fog.color.set('#070a18'); scene.fog.near = 40; scene.fog.far = 320;
    amb.intensity = 0.22; hemi.intensity = 0.25; hemi.color.set('#8fa6ff'); sun.intensity = 0; sunBall.visible = false;
    lamp.intensity = 10; ledLight.intensity = 9; monitorLight.intensity = 3; moonLight.intensity = 0.9;
    phoneLight.intensity = 1.3 + 0.4 * Math.sin(t * 9) * Math.sin(t * 3.1);
  } else {
    const dawn = place === 'summit' ? 1 : smooth(0, 1, prog * 1.25);
    const top = C('#2a3f78').lerp(C('#5a92d6'), dawn), bot = C('#ff8a5c').lerp(C('#ffd8a8'), dawn);
    skyU.top.value.copy(top); skyU.bottom.value.copy(bot); skyU.sunCol.value.set('#ffd2a0'); skyU.stars.value = 0;
    const sunDir = V(-0.3, 0.04 + 0.12 * dawn, -1).normalize(); skyU.sunDir.value.copy(sunDir);
    sunBall.visible = true; sunBall.position.copy(p).addScaledVector(sunDir, 900);
    scene.fog.color.copy(bot).lerp(top, 0.3); scene.fog.near = 30; scene.fog.far = place === 'summit' ? 800 : 260;
    amb.intensity = 0.25; hemi.intensity = 0.75 + 0.35 * dawn; hemi.color.set('#cfe2ff');
    sun.intensity = 2.4 + 1.0 * dawn; sun.color.set('#ffbf80').lerp(C('#fff1dc'), dawn);
    sun.position.copy(p).addScaledVector(sunDir, 60).add(V(0, 20, 0));
    lamp.intensity = 0; ledLight.intensity = 0; monitorLight.intensity = 0; moonLight.intensity = 0; phoneLight.intensity = 0;
  }
  sky.position.copy(p); sun.target.position.copy(p);
  robot.updateMatrixWorld(true);
  phone.visible = inRoom && sg.anim === 'Sitting';
  if (palm && phone.visible) { palm.getWorldPosition(phone.position); phone.position.addScaledVector(fwd, 0.06); phone.lookAt(p.clone().add(V(0, 1.6, 0))); }
  phoneLight.position.copy(p).add(V(0, 0.8, 0)).addScaledVector(fwd, 0.6);
  for (const f of anim) f(t, place, p);

  // ----- camera
  const cam = sg.cam || 'front';
  const sit = (sg.anim === 'Sitting') ? -0.7 : 0, L = y => V(0, y + sit, 0);
  let cpos, look, fov = 50;
  const wob = V(0.04 * Math.sin(t * 1.3), 0.03 * Math.sin(t * 1.7), 0);
  if (cam === 'close') {
    const d = 3.4 - 0.6 * easeInOut(clamp01(since / 5));
    cpos = p.clone().addScaledVector(fwd, d).addScaledVector(right, 0.45).add(L(1.5)); look = p.clone().add(L(1.3));
  } else if (cam === 'side') {
    cpos = p.clone().addScaledVector(right, inRoom ? 3.6 : 4.6).addScaledVector(fwd, inRoom ? 2.2 : 1.6).add(L(1.5)); look = p.clone().addScaledVector(fwd, 0.5).add(L(1.25));
  } else if (cam === 'back') {
    cpos = p.clone().addScaledVector(fwd, -5.8).addScaledVector(right, 1.0).add(L(2.6)); look = p.clone().addScaledVector(fwd, 3).add(L(1.4));
  } else if (cam === 'orbit') {
    const a = yaw + 0.6 + since * 0.3, r = inRoom ? 4.2 : 6;
    cpos = p.clone().add(V(Math.sin(a) * r, 1.7 + sit, Math.cos(a) * r)); look = p.clone().add(L(1.2));
  } else if (cam === 'drone') {
    const k = easeInOut(clamp01(since / 6)), a = yaw + 0.3 + since * 0.1, r = 9 + 9 * k;
    cpos = p.clone().add(V(Math.sin(a) * r, 3.5 + 7 * k, Math.cos(a) * r)); look = p.clone().add(V(0, 1.0 + 1.5 * k, 0)); fov = 55;
  } else if (cam === 'cta') {
    const k = easeInOut(clamp01(since / 3.2));
    cpos = p.clone().addScaledVector(fwd, 4 + 9 * k).addScaledVector(right, 0.6 - 0.6 * k).add(V(0, 1.6 + 1.2 * k, 0)); look = p.clone().add(V(0, 1.3 + 4.2 * k, 0)); fov = 50 + 6 * k;
  } else {
    const d = 6.0 - 0.8 * easeInOut(clamp01(since / 5));
    cpos = p.clone().addScaledVector(fwd, d).addScaledVector(right, -0.6).add(L(1.6)); look = p.clone().add(L(1.35));
  }
  if (inRoom) { cpos.x = Math.max(ROOM.x - 5.5, Math.min(ROOM.x + 5.5, cpos.x)); cpos.z = Math.min(cpos.z, ROOM.z + 7.5); cpos.y = Math.min(cpos.y, 4.2); }
  else if (place === 'path') {
    // keep front/back/close cameras on the trail itself so nothing pops in front of the lens
    if (cam === 'front' || cam === 'back' || cam === 'close') { const off = Math.max(-0.8, Math.min(0.8, cpos.x - pathX(cpos.z))); cpos.x = pathX(cpos.z) + off; }
    cpos.y = Math.max(cpos.y, groundY(cpos.x, cpos.z) + 0.7); }
  camera.position.copy(cpos.add(wob)); camera.lookAt(look);
  camera.fov = fov + 4 * Math.exp(-since * 5) * (si > 0 ? 1 : 0); camera.updateProjectionMatrix();

  // ----- 3D numbers floating above the character
  segObjs.forEach((o, i) => { if (!o.label) return; const vis = i === si; o.label.visible = vis; if (!vis) return;
    o.label.scale.setScalar(Math.max(0.01, easeOutBack(clamp01(since / 0.5))));
    o.label.position.copy(p).add(V(0, CHAR_H + 1.0 + sit + 0.06 * Math.sin(t * 2), 0));
    o.label.lookAt(camera.position); o.label.rotateY(0.18 * Math.sin(since * 1.4) + (1 - clamp01(since / 0.6)) * Math.PI * 2); });
  // ----- call to action rising behind the character
  ctaText.visible = cam === 'cta';
  if (ctaText.visible) { const k = easeOutBack(clamp01((since - 0.4) / 1.1));
    ctaText.position.copy(p).addScaledVector(fwd, -9).add(V(0, 3.5 + 4.8 * k, 0)); ctaText.lookAt(camera.position);
    ctaText.scale.setScalar(Math.max(0.01, 0.4 + 0.6 * clamp01((since - 0.4) / 0.8))); ctaText.children[2].rotation.z = t * 0.6; }
  composer.render();
  return true;
};
window.ready = true;
