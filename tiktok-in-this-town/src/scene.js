// "In this town, the sun is controlled by one old man" — blocky 3D TikTok story.
// Deterministic: window.renderAt(t) draws the frame at time t (seconds) into #out.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const W = 1080, H = 1920;
const params = new URLSearchParams(location.search);
const SCALE = parseFloat(params.get('scale') || '1');

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W * SCALE, H * SCALE, false);
renderer.domElement.id = 'gl';
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const out = document.getElementById('out');
out.width = W * SCALE; out.height = H * SCALE;
const ctx = out.getContext('2d');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 2000);

// ---------------------------------------------------------------- helpers
const rb = (w, h, d, r = 0.12, s = 3) => new RoundedBoxGeometry(w, h, d, s, Math.min(r, w / 2, h / 2, d / 2));
const matCache = {};
function M(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.0, ...opts });
  return matCache[key];
}
function mesh(geo, mat, x = 0, y = 0, z = 0, parent) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = u => (u = clamp(u), u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
const easeOut = u => 1 - Math.pow(1 - clamp(u), 3);
const mix = (a, b, u) => a + (b - a) * u;
const mix3 = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
function rand(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  t.userData = { c, g };
  return t;
}

// ---------------------------------------------------------------- faces
const faceTexCache = {};
function faceTex(type) {
  if (faceTexCache[type]) return faceTexCache[type];
  const t = canvasTex(256, 256, (g) => {
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.fillStyle = '#1b1b1b'; g.strokeStyle = '#1b1b1b'; g.lineWidth = 12;
    const eye = (x, y, rx = 13, ry = 22) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x - 4, y - 8, 4.5, 6, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#1b1b1b'; };
    const closed = (x, y) => { g.beginPath(); g.moveTo(x - 18, y); g.quadraticCurveTo(x, y + 10, x + 18, y); g.stroke(); };
    const happyEye = (x, y) => { g.beginPath(); g.moveTo(x - 18, y + 6); g.quadraticCurveTo(x, y - 18, x + 18, y + 6); g.stroke(); };
    const smile = (w = 46, d = 26, y = 158) => { g.beginPath(); g.moveTo(128 - w, y); g.quadraticCurveTo(128, y + d * 2, 128 + w, y); g.stroke(); };
    const openMouth = (w = 34, h = 30, y = 165, tongue = true) => {
      g.fillStyle = '#5a1018'; g.beginPath(); g.moveTo(128 - w, y - 8); g.quadraticCurveTo(128, y + h * 2.2, 128 + w, y - 8); g.closePath(); g.fill();
      if (tongue) { g.fillStyle = '#e8566a'; g.beginPath(); g.ellipse(128, y + h * 0.75, w * 0.55, h * 0.35, 0, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#1b1b1b';
    };
    const bags = (x, y) => { g.strokeStyle = 'rgba(90,60,120,0.55)'; g.lineWidth = 6; g.beginPath(); g.arc(x, y + 14, 16, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); g.beginPath(); g.arc(x, y + 24, 14, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke(); g.strokeStyle = '#1b1b1b'; g.lineWidth = 12; };
    switch (type) {
      case 'smile': eye(88, 100); eye(168, 100); smile(); break;
      case 'grin': happyEye(88, 104); happyEye(168, 104); openMouth(44, 30, 158); break;
      case 'open': eye(88, 98); eye(168, 98); openMouth(30, 22, 170, false); break;
      case 'shock': eye(88, 96, 16, 28); eye(168, 96, 16, 28); g.beginPath(); g.ellipse(128, 182, 20, 26, 0, 0, Math.PI * 2); g.fillStyle = '#5a1018'; g.fill(); break;
      case 'sleep': closed(88, 108); closed(168, 108); g.lineWidth = 8; g.beginPath(); g.ellipse(128, 172, 12, 9, 0, 0, Math.PI * 2); g.stroke(); break;
      case 'tired': // wide, bloodshot, bags
        g.fillStyle = '#fff'; g.beginPath(); g.arc(88, 100, 26, 0, Math.PI * 2); g.arc(168, 100, 26, 0, Math.PI * 2); g.fill();
        g.strokeStyle = '#d33'; g.lineWidth = 2; for (const ex of [88, 168]) for (let i = 0; i < 5; i++) { const a = i * 1.3; g.beginPath(); g.moveTo(ex + Math.cos(a) * 25, 100 + Math.sin(a) * 25); g.lineTo(ex + Math.cos(a + 0.3) * 14, 100 + Math.sin(a + 0.3) * 14); g.stroke(); }
        g.fillStyle = '#1b1b1b'; g.beginPath(); g.arc(90, 100, 7, 0, Math.PI * 2); g.arc(166, 100, 7, 0, Math.PI * 2); g.fill();
        g.strokeStyle = '#1b1b1b'; g.lineWidth = 12; bags(88, 112); bags(168, 112);
        g.beginPath(); g.moveTo(100, 184); g.lineTo(118, 176); g.lineTo(138, 186); g.lineTo(156, 176); g.stroke(); break;
      case 'frown': eye(88, 104); eye(168, 104); g.lineWidth = 10; g.beginPath(); g.moveTo(62, 70); g.lineTo(108, 82); g.moveTo(194, 70); g.lineTo(148, 82); g.stroke(); g.lineWidth = 12; g.beginPath(); g.moveTo(92, 186); g.quadraticCurveTo(128, 154, 164, 186); g.stroke(); break;
      case 'sad': eye(88, 104); eye(168, 104); g.beginPath(); g.moveTo(96, 184); g.quadraticCurveTo(128, 160, 160, 184); g.stroke(); g.fillStyle = '#6cc6ff'; g.beginPath(); g.ellipse(70, 140, 7, 12, 0, 0, Math.PI * 2); g.fill(); break;
      case 'wink': eye(88, 100); happyEye(168, 104); smile(42, 24); break;
    }
  });
  faceTexCache[type] = t; return t;
}

// ---------------------------------------------------------------- characters
const faceGeo = new THREE.PlaneGeometry(1.08, 1.08);
const headGeo = rb(1.25, 1.25, 1.25, 0.34, 4);
const torsoGeo = rb(2, 2, 1, 0.14);
const limbGeo = rb(0.98, 2, 0.98, 0.14);
function makeChar(o) {
  const c = {
    root: new THREE.Group(), body: new THREE.Group(), o,
    face: o.face || 'smile',
  };
  const skin = M(o.skin || '#f4c99a');
  c.root.add(c.body);
  c.torso = mesh(torsoGeo, M(o.shirt || '#3a7bd5'), 0, 3, 0, c.body);
  c.legL = new THREE.Group(); c.legL.position.set(-0.5, 2, 0); c.body.add(c.legL);
  c.legR = new THREE.Group(); c.legR.position.set(0.5, 2, 0); c.body.add(c.legR);
  mesh(limbGeo, M(o.pants || '#2c3e66'), 0, -1, 0, c.legL);
  mesh(limbGeo, M(o.pants || '#2c3e66'), 0, -1, 0, c.legR);
  if (o.shoes) { mesh(rb(1, 0.4, 1.12, 0.12), M(o.shoes), 0, -1.82, 0.06, c.legL); mesh(rb(1, 0.4, 1.12, 0.12), M(o.shoes), 0, -1.82, 0.06, c.legR); }
  c.armL = new THREE.Group(); c.armL.position.set(-1.5, 3.85, 0); c.body.add(c.armL);
  c.armR = new THREE.Group(); c.armR.position.set(1.5, 3.85, 0); c.body.add(c.armR);
  const sleeve = M(o.sleeves || o.shirt || '#3a7bd5');
  mesh(limbGeo, o.bareArms ? skin : sleeve, 0, -0.85, 0, c.armL);
  mesh(limbGeo, o.bareArms ? skin : sleeve, 0, -0.85, 0, c.armR);
  if (!o.bareArms) { mesh(rb(0.9, 0.5, 0.9, 0.12), skin, 0, -1.72, 0, c.armL); mesh(rb(0.9, 0.5, 0.9, 0.12), skin, 0, -1.72, 0, c.armR); }
  c.head = new THREE.Group(); c.head.position.set(0, 4, 0); c.body.add(c.head);
  mesh(headGeo, skin, 0, 0.66, 0, c.head);
  c.faceMat = new THREE.MeshStandardMaterial({ map: faceTex(c.face), transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 });
  c.faceMesh = new THREE.Mesh(faceGeo, c.faceMat); c.faceMesh.position.set(0, 0.62, 0.632); c.head.add(c.faceMesh);
  // accessories
  const h = c.head;
  if (o.hair) { mesh(rb(1.35, 0.42, 1.35, 0.18), M(o.hair), 0, 1.33, -0.02, h); mesh(rb(1.35, 1.0, 0.3, 0.12), M(o.hair), 0, 0.95, -0.56, h); }
  if (o.bun) { mesh(new THREE.SphereGeometry(0.42, 16, 12), M(o.bun), 0, 1.55, -0.35, h); }
  if (o.cap) { mesh(rb(1.38, 0.55, 1.38, 0.22), M(o.cap), 0, 1.42, 0, h); mesh(rb(1.3, 0.12, 0.8, 0.05), M(o.cap), 0, 1.2, 0.9, h); }
  if (o.beanie) { mesh(rb(1.42, 0.75, 1.42, 0.3), M(o.beanie), 0, 1.45, 0, h); mesh(rb(1.48, 0.25, 1.48, 0.1), M(o.beanieRim || o.beanie), 0, 1.12, 0, h); }
  if (o.tophat) { c.hat = new THREE.Group(); c.hat.position.set(0, 1.32, 0); h.add(c.hat); mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 24), M('#151515'), 0, 0, 0, c.hat); c.hatTop = new THREE.Group(); c.hat.add(c.hatTop); mesh(new THREE.CylinderGeometry(0.58, 0.6, 1.1, 24), M('#151515'), 0, 0.58, 0, c.hatTop); mesh(new THREE.CylinderGeometry(0.61, 0.61, 0.2, 24), M('#c0392b'), 0, 0.13, 0, c.hatTop); }
  if (o.bald) { mesh(rb(1.3, 0.35, 0.4, 0.12), M(o.bald), 0, 0.95, -0.5, h); mesh(rb(0.25, 0.5, 0.7, 0.1), M(o.bald), -0.66, 0.85, -0.1, h); mesh(rb(0.25, 0.5, 0.7, 0.1), M(o.bald), 0.66, 0.85, -0.1, h); }
  if (o.beard) { mesh(rb(1.1, 0.7, 0.4, 0.18), M(o.beard), 0, -0.12, 0.5, h); }
  if (o.glasses) { const gm = M('#222'); mesh(new THREE.TorusGeometry(0.17, 0.035, 8, 20), gm, -0.27, 0.78, 0.66, h); mesh(new THREE.TorusGeometry(0.17, 0.035, 8, 20), gm, 0.27, 0.78, 0.66, h); mesh(rb(0.2, 0.04, 0.04, 0.01), gm, 0, 0.8, 0.66, h); }
  if (o.sunglasses) { const gm = M('#111', { roughness: 0.15, metalness: 0.3 }); c.sun = new THREE.Group(); h.add(c.sun); mesh(rb(0.48, 0.3, 0.08, 0.06), gm, -0.27, 0.76, 0.67, c.sun); mesh(rb(0.48, 0.3, 0.08, 0.06), gm, 0.27, 0.76, 0.67, c.sun); mesh(rb(1.3, 0.06, 0.06, 0.02), gm, 0, 0.84, 0.66, c.sun); }
  if (o.masks) { c.masks = []; const cols = ['#ff7eb6', '#7e8cff', '#2a2a2a']; for (let i = 0; i < 3; i++) { const g = mesh(rb(1.36, 0.3, 1.36, 0.1), M(cols[i]), 0, 0.68 + i * 0.32, 0, h); c.masks.push(g); } }
  if (o.sash) { const s = mesh(rb(0.3, 2.6, 1.06, 0.05), M('#e8c547'), 0, 3, 0, c.body); s.rotation.z = 0.75; }
  if (o.tie) { mesh(rb(0.3, 1.2, 0.1, 0.05), M(o.tie), 0, 3.25, 0.52, c.body); }
  if (o.cardigan) { mesh(rb(0.5, 2, 0.1, 0.04), M(o.cardigan), -0.75, 3, 0.52, c.body); mesh(rb(0.5, 2, 0.1, 0.04), M(o.cardigan), 0.75, 3, 0.52, c.body); }
  if (o.cane) { c.cane = mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), M('#6b3f1d'), 0, -2.6, 0.4, c.armR); }
  c.setFace = (f) => { if (f !== c.face) { c.face = f; c.faceMat.map = faceTex(f); c.faceMat.needsUpdate = true; } };
  scene.add(c.root);
  return c;
}
function pose(c, p = {}) {
  // reset
  c.root.position.set(...(p.pos || [0, 0, 0]));
  c.root.rotation.set(p.pitch || 0, p.rot || 0, p.roll || 0);
  c.body.position.set(0, p.bob || 0, 0);
  c.body.rotation.set(p.lean || 0, 0, 0);
  for (const k of ['legL', 'legR', 'armL', 'armR', 'head']) c[k].rotation.set(0, 0, 0);
  c.root.visible = p.visible !== false;
  if (c.hatTop) c.hatTop.scale.set(1, p.hatScale || 1, 1);
  if (p.face) c.setFace(p.face);
  const t = p.t || 0;
  if (p.walk) {
    const s = Math.sin(t * p.walk * 2 * Math.PI) * 0.7;
    c.legL.rotation.x = s; c.legR.rotation.x = -s; c.armL.rotation.x = -s * 0.9; c.armR.rotation.x = s * 0.9;
    c.body.position.y = Math.abs(Math.cos(t * p.walk * 2 * Math.PI)) * 0.18;
  }
  if (p.sit) { c.legL.rotation.x = -Math.PI / 2; c.legR.rotation.x = -Math.PI / 2; c.armL.rotation.x = -0.5; c.armR.rotation.x = -0.5; }
  if (p.wave) { c.armR.rotation.z = 2.6 + Math.sin(t * 14) * 0.35; }
  if (p.cheer) { const b = Math.abs(Math.sin(t * (p.cheer) * Math.PI)); c.armL.rotation.z = -2.7 - b * 0.3; c.armR.rotation.z = 2.7 + b * 0.3; c.root.position.y += b * 1.4; }
  if (p.armsUp != null) { c.armL.rotation.x = -p.armsUp; c.armR.rotation.x = -p.armsUp; }
  if (p.shade) { c.armR.rotation.x = -2.5; c.armR.rotation.z = 0.5; }
  if (p.point) { c.armR.rotation.x = -1.5; }
  if (p.push) { c.armL.rotation.x = -1.3; c.armR.rotation.x = -1.3; }
  if (p.flail) { c.armL.rotation.z = -1.6 - Math.sin(t * 18) * 0.8; c.armR.rotation.z = 1.6 + Math.sin(t * 18 + 1) * 0.8; }
  if (p.headTilt) c.head.rotation.z = p.headTilt;
  if (p.headPitch) c.head.rotation.x = p.headPitch;
  if (p.headYaw) c.head.rotation.y = p.headYaw;
  if (p.scale) c.root.scale.setScalar(p.scale); else c.root.scale.setScalar(1);
}

// ---------------------------------------------------------------- sky / lights
const skyUniforms = { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyUniforms,
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top; uniform vec3 bot; varying vec3 vP; void main(){ float h = clamp(vP.y*1.6+0.08,0.,1.); gl_FragColor = vec4(mix(bot, top, pow(h,0.8)),1.); }`,
}));
sky.renderOrder = -10; scene.add(sky);

const glowTex = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
function glow(color, size, opacity = 1) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity, fog: false })); s.scale.setScalar(size); return s; }

const sunGroup = new THREE.Group(); scene.add(sunGroup);
const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), new THREE.MeshBasicMaterial({ color: '#fff6c8', fog: false })); sunGroup.add(sunDisc);
const sunGlow = glow('#ffd76a', 420, 0.9); sunGroup.add(sunGlow);
const moonGroup = new THREE.Group(); scene.add(moonGroup);
moonGroup.add(new THREE.Mesh(new THREE.SphereGeometry(28, 32, 16), new THREE.MeshBasicMaterial({ color: '#f4f6ff', fog: false })));
moonGroup.add(glow('#9fb6ff', 260, 0.6));
const stars = (() => {
  const r = rand(7), n = 900, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = r() * 2 - 1, th = r() * Math.PI * 2, y = Math.abs(u) * 0.9 + 0.05, rr = Math.sqrt(1 - y * y); pos[i * 3] = Math.cos(th) * rr * 1300; pos[i * 3 + 1] = y * 1300; pos[i * 3 + 2] = Math.sin(th) * rr * 1300; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 3.2, sizeAttenuation: false, fog: false })); scene.add(p); return p;
})();

const hemi = new THREE.HemisphereLight('#cfe8ff', '#5d7f45', 1); scene.add(hemi);
const sunLight = new THREE.DirectionalLight('#fff3dc', 2.5); sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048); sunLight.shadow.bias = -0.0004; sunLight.shadow.normalBias = 0.04;
scene.add(sunLight); scene.add(sunLight.target);
scene.fog = new THREE.Fog('#cfe9ff', 150, 520);

const windowMat = new THREE.MeshStandardMaterial({ color: '#9fd3f5', roughness: 0.2, emissive: '#ffcf6b', emissiveIntensity: 0 });
const lampBulbMat = new THREE.MeshStandardMaterial({ color: '#fff2c4', emissive: '#ffd56b', emissiveIntensity: 0 });
const lampGlows = [];

const PRESETS = {
  day: { top: '#2f86e6', bot: '#bfe6ff', sun: '#fff1d6', sunI: 2.7, hs: '#d6ecff', hg: '#6c8f4d', hI: 1.15, fog: '#cfe9ff', elev: 0.85, az: 0.6, night: false, exp: 1.05 },
  heat: { top: '#e9a23b', bot: '#ffe0a0', sun: '#ffd9a0', sunI: 3.4, hs: '#ffe2b8', hg: '#9a7a40', hI: 1.3, fog: '#ffd89a', elev: 1.0, az: 0.3, night: false, exp: 1.12 },
  hot: { top: '#3d95f0', bot: '#fff1c9', sun: '#fff0c8', sunI: 3.2, hs: '#ffeccf', hg: '#7c8f4d', hI: 1.25, fog: '#fdf1d8', elev: 0.9, az: 0.4, night: false, exp: 1.12 },
  dawn: { top: '#33407e', bot: '#ff9f7a', sun: '#ffb27a', sunI: 1.6, hs: '#9aa3d8', hg: '#4a5a3d', hI: 0.75, fog: '#c88a8a', elev: 0.12, az: 1.3, night: false, exp: 1.05 },
  sunset: { top: '#3b3d8f', bot: '#ff8a4c', sun: '#ff9a55', sunI: 1.9, hs: '#b49ad8', hg: '#5a4a3a', hI: 0.75, fog: '#e08a6a', elev: 0.1, az: -1.0, night: false, exp: 1.05 },
  night: { top: '#070c26', bot: '#22336e', sun: '#a9bcff', sunI: 0.85, hs: '#5a70c0', hg: '#2a3346', hI: 0.95, fog: '#1b2752', elev: 0.9, az: -0.6, night: true, exp: 1.15 },
};
let curPreset = null;
function setLight(name, center = [0, 0, 0], span = 60) {
  const p = PRESETS[name];
  skyUniforms.top.value.set(p.top); skyUniforms.bot.value.set(p.bot);
  hemi.color.set(p.hs); hemi.groundColor.set(p.hg); hemi.intensity = p.hI;
  sunLight.color.set(p.sun); sunLight.intensity = p.sunI;
  const dir = new THREE.Vector3(Math.cos(p.elev) * Math.sin(p.az), Math.sin(p.elev), Math.cos(p.elev) * Math.cos(p.az)).normalize();
  sunLight.position.set(center[0] + dir.x * 150, center[1] + dir.y * 150, center[2] + dir.z * 150);
  sunLight.target.position.set(...center);
  const sc = sunLight.shadow.camera; sc.left = -span; sc.right = span; sc.top = span; sc.bottom = -span; sc.near = 1; sc.far = 400; sc.updateProjectionMatrix();
  scene.fog.color.set(p.fog);
  renderer.toneMappingExposure = p.exp;
  const sky3 = dir.clone().multiplyScalar(1100);
  sunGroup.visible = !p.night; moonGroup.visible = p.night; stars.visible = p.night;
  if (!p.night) sunGroup.position.copy(camera.position).add(sky3);
  else moonGroup.position.copy(camera.position).add(new THREE.Vector3(-0.35, 0.55, -0.75).normalize().multiplyScalar(1100));
  windowMat.emissiveIntensity = p.night ? 1.6 : 0; windowMat.color.set(p.night ? '#ffdf8a' : '#9fd3f5');
  lampBulbMat.emissiveIntensity = p.night ? 2.5 : 0;
  for (const g of lampGlows) g.visible = p.night;
  curPreset = p;
}

// ---------------------------------------------------------------- world: town
const town = new THREE.Group(); scene.add(town);
const groundMat = M('#5fb547');
const ground = mesh(new THREE.PlaneGeometry(1400, 1400), groundMat, 0, 0, 0, town); ground.rotation.x = -Math.PI / 2; ground.castShadow = false;
const road = mesh(new THREE.BoxGeometry(12, 0.1, 220), M('#3b3d44', { roughness: 0.9 }), 0, 0.05, -45, town); road.castShadow = false;
for (const sx of [-1, 1]) { const sw = mesh(new THREE.BoxGeometry(2.6, 0.3, 220), M('#c9c4bb'), sx * 7.3, 0.15, -45, town); sw.castShadow = false; }
for (let z = 60; z > -150; z -= 8) { const d = mesh(new THREE.BoxGeometry(0.4, 0.12, 3.6), M('#f2c230'), 0, 0.08, z, town); d.castShadow = false; }

const houseColors = ['#e8735a', '#f2c46d', '#7fb3d5', '#a3d39c', '#e5989b', '#c3a6e0', '#f4a259', '#90c2b8', '#f7d6a0', '#8fa9e8'];
const roofColors = ['#9b3d30', '#3d4a6b', '#5e3b2e', '#2f5d50', '#7a2f3a', '#46395e'];
function makeHouse(x, z, rot, i, parent = town) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  const wc = houseColors[i % houseColors.length], rcol = roofColors[i % roofColors.length];
  const h = 6.5 + (i % 3) * 0.8;
  mesh(new THREE.BoxGeometry(10, h, 9), M(wc), 0, h / 2, 0, g);
  const sh = new THREE.Shape(); sh.moveTo(-5.9, 0); sh.lineTo(5.9, 0); sh.lineTo(0, 3.8); sh.closePath();
  const rg = new THREE.ExtrudeGeometry(sh, { depth: 10, bevelEnabled: false }); rg.translate(0, 0, -5);
  mesh(rg, M(rcol), 0, h, 0, g);
  mesh(new THREE.BoxGeometry(1.0, 3, 1.0), M('#8a8a8a'), 2.8, h + 3, -1.5, g); // chimney
  mesh(new THREE.BoxGeometry(2.0, 3.4, 0.2), M('#6b4226'), 0, 1.7, 4.55, g); // door
  mesh(new THREE.SphereGeometry(0.12, 8, 6), M('#e8c547', { metalness: 0.6, roughness: 0.3 }), 0.7, 1.7, 4.7, g);
  for (const wx of [-3, 3]) { mesh(new THREE.BoxGeometry(2.1, 1.9, 0.16), windowMat, wx, 3.0, 4.55, g); mesh(new THREE.BoxGeometry(2.5, 0.25, 0.4), M('#ffffff'), wx, 1.95, 4.6, g); }
  if (h > 7) for (const wx of [-2.4, 2.4]) mesh(new THREE.BoxGeometry(1.8, 1.6, 0.16), windowMat, wx, h - 1.6, 4.55, g);
  mesh(new THREE.BoxGeometry(2.6, 0.3, 2.2), M('#bdb6ab'), 0, 0.15, 5.6, g); // step
  return g;
}
function makeTree(x, z, s = 1, parent = town) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
  mesh(new THREE.BoxGeometry(0.9, 3.2, 0.9), M('#7a4e2d'), 0, 1.6, 0, g);
  mesh(rb(4, 3.4, 4, 0.6), M('#3f9a3a'), 0, 4.6, 0, g);
  mesh(rb(2.8, 2.2, 2.8, 0.5), M('#4fb446'), 0.3, 6.6, 0.2, g);
  return g;
}
function makeLamp(x, z, parent = town) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
  mesh(new THREE.CylinderGeometry(0.16, 0.2, 7, 8), M('#2b2b2b'), 0, 3.5, 0, g);
  mesh(new THREE.BoxGeometry(1.6, 0.2, 0.3), M('#2b2b2b'), -0.7 * Math.sign(x), 7, 0, g);
  mesh(new THREE.BoxGeometry(0.9, 0.35, 0.9), lampBulbMat, -1.4 * Math.sign(x), 6.8, 0, g);
  const gl = glow('#ffcf7a', 7, 0.85); gl.position.set(-1.4 * Math.sign(x), 6.6, 0); g.add(gl); lampGlows.push(gl);
  return g;
}
const cars = [];
function makeCar(x, z, rot, col, parent = town) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  g.userData.home = g.position.clone(); g.userData.rot = rot; cars.push(g);
  mesh(rb(2.6, 1.2, 5, 0.3), M(col), 0, 1.0, 0, g);
  mesh(rb(2.3, 1.1, 2.8, 0.3), M(col), 0, 2.0, -0.3, g);
  mesh(new THREE.BoxGeometry(2.36, 0.8, 2.5), M('#bfe4f7', { roughness: 0.1 }), 0, 2.05, -0.3, g);
  for (const [wx, wz] of [[-1.3, 1.6], [1.3, 1.6], [-1.3, -1.6], [1.3, -1.6]]) { const w = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.4, 16), M('#1e1e1e'), wx, 0.55, wz, g); w.rotation.z = Math.PI / 2; }
  return g;
}

const SIDE_Z = [56, 40, 24, 8, -8, -24, -56, -72, -88, -104, -120];
let hi = 0; const houses = {};
for (const z of SIDE_Z) {
  houses['R' + z] = makeHouse(20, z, -Math.PI / 2, hi++);
  if (z !== -40) houses['L' + z] = makeHouse(-20, z, Math.PI / 2, hi++ + 3);
  makeTree(12.5, z - 8, 0.9 + (hi % 3) * 0.12);
  makeTree(-12.5, z + 8, 0.9 + ((hi + 1) % 3) * 0.12);
  makeLamp(8.9, z + 4); makeLamp(-8.9, z - 4);
  // fences
  for (const sx of [-1, 1]) for (let k = -3; k <= 3; k++) mesh(new THREE.BoxGeometry(0.25, 1.4, 0.25), M('#ffffff'), sx * 10, 0.7, z - 7.5 + k * 0.7 + 3.5, town);
}
makeHouse(-20, -40, Math.PI / 2, 1); // placeholder replaced by town hall below (hidden)
town.children[town.children.length - 1].visible = false;
const carCols = ['#e74c3c', '#2ecc71', '#f1c40f', '#3498db', '#ecf0f1', '#9b59b6'];
[[4.5, 30, 0], [-4.5, -12, Math.PI], [4.5, -60, 0], [-4.5, 46, Math.PI], [4.5, -98, 0]].forEach(([x, z, r], i) => makeCar(x, z, r, carCols[i]));

// background hills
for (const [x, z, r, sy] of [[-160, -300, 120, 0.35], [140, -320, 140, 0.3], [0, -420, 180, 0.28], [-260, -120, 120, 0.3], [260, -80, 130, 0.3], [-250, 160, 140, 0.3], [250, 180, 140, 0.3]]) {
  const hgeo = new THREE.SphereGeometry(r, 32, 16); const hm = mesh(hgeo, M('#4f9d3f'), x, -8, z, town); hm.scale.y = sy; hm.castShadow = false;
}
// clouds
const clouds = new THREE.Group(); scene.add(clouds);
{ const r = rand(3); for (let i = 0; i < 14; i++) { const g = new THREE.Group(); g.position.set((r() - 0.5) * 500, 90 + r() * 60, -60 - r() * 400); clouds.add(g); for (let k = 0; k < 4; k++) { const m = mesh(rb(18 + r() * 14, 7 + r() * 5, 12 + r() * 8, 3), M('#ffffff', { roughness: 1, emissive: '#ffffff', emissiveIntensity: 0.25 }), k * 10 - 15, r() * 3, r() * 4, g); m.castShadow = false; } } }

// ---------------------------------------------------------------- the hill + giant switch
const HILL = { x: 0, z: -185, r: 55, sy: 0.42, y0: -3 };
const hillY = (x, z) => { const d2 = (x - HILL.x) ** 2 + (z - HILL.z) ** 2; return HILL.y0 + HILL.sy * Math.sqrt(Math.max(0, HILL.r ** 2 - d2)); };
{ const hm = mesh(new THREE.SphereGeometry(HILL.r, 64, 32), M('#58b043'), HILL.x, HILL.y0, HILL.z, town); hm.scale.y = HILL.sy; }
const TOP = [0, hillY(0, -188), -188];
const LV = 8.5;
const switchG = new THREE.Group(); switchG.position.set(TOP[0], TOP[1], TOP[2]); town.add(switchG);
mesh(new THREE.BoxGeometry(11, 1.2, 4), M('#9aa3ad', { metalness: 0.2, roughness: 0.6 }), 0, 0.6, 0.4, switchG);
const plateTex = canvasTex(512, 768, (g) => {
  g.fillStyle = '#f7f4ee'; g.fillRect(0, 0, 512, 768);
  g.fillStyle = '#d8d2c6'; for (const y of [70, 698]) { g.beginPath(); g.arc(256, y, 22, 0, 7); g.fill(); g.strokeStyle = '#a69f92'; g.lineWidth = 6; g.beginPath(); g.moveTo(240, y); g.lineTo(272, y); g.stroke(); }
  g.font = 'bold 74px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#e0a400'; g.fillText('☀ ON', 256, 190); g.fillStyle = '#3b4a8f'; g.fillText('☾ OFF', 256, 640);
});
mesh(rb(9.5, 14, 1.2, 0.5), new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.4 }), 0, LV, 0, switchG);
mesh(rb(4.2, 6.6, 0.8, 0.3), M('#d9d3c7'), 0, LV, 0.7, switchG);
const lever = new THREE.Group(); lever.position.set(0, LV, 0.9); switchG.add(lever);
mesh(rb(2.6, 5.2, 1.6, 0.45), M('#ffffff', { roughness: 0.3 }), 0, 0, 0.6, lever);
const LEVER_UP = -0.42, LEVER_DOWN = 0.42;
// little things on the hilltop
const chair = new THREE.Group(); town.add(chair);
{ const wood = M('#8a5a2b'); mesh(rb(3, 0.4, 2.6, 0.1), wood, 0, 2.0, 0, chair); mesh(rb(3, 3.4, 0.4, 0.1), wood, 0, 3.6, -1.25, chair); for (const sx of [-1.3, 1.3]) { mesh(new THREE.BoxGeometry(0.3, 2, 0.3), wood, sx, 1, 1, chair); mesh(new THREE.BoxGeometry(0.3, 2, 0.3), wood, sx, 1, -1, chair); const rk = mesh(new THREE.TorusGeometry(3, 0.15, 6, 24, 0.9), wood, sx, 3.05, 0, chair); rk.rotation.y = Math.PI / 2; rk.rotation.z = -Math.PI / 2 - 0.45; } }
chair.position.set(8, hillY(8, -184), -184); chair.rotation.y = -0.5;
makeTree(-14, -182, 1.1); makeTree(16, -196, 1.0); makeTree(-6, -200, 1.2);
// mailbox-ish sign
{ const s = new THREE.Group(); s.position.set(-7, hillY(-7, -180), -180); town.add(s); mesh(new THREE.BoxGeometry(0.3, 3, 0.3), M('#6b4226'), 0, 1.5, 0, s); const st = canvasTex(256, 128, (g) => { g.fillStyle = '#f0dcb0'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#5a3a1a'; g.font = 'bold 40px sans-serif'; g.textAlign = 'center'; g.fillText('SUN SWITCH', 128, 60); g.font = '26px sans-serif'; g.fillText('do not touch', 128, 100); }); mesh(new THREE.BoxGeometry(3.6, 1.8, 0.2), new THREE.MeshStandardMaterial({ map: st }), 0, 3.4, 0, s).rotation.y = 0.4; }

// ---------------------------------------------------------------- town hall + clock
const hall = new THREE.Group(); hall.position.set(-24, 0, -40); town.add(hall);
mesh(new THREE.BoxGeometry(14, 10, 20), M('#efe6d2'), 0, 5, 0, hall);
mesh(new THREE.BoxGeometry(15, 1, 21), M('#c9bfa8'), 0, 10.5, 0, hall);
for (let k = -3; k <= 3; k++) mesh(new THREE.CylinderGeometry(0.45, 0.45, 8, 12), M('#ffffff'), 7.6, 4, k * 2.6, hall);
mesh(new THREE.BoxGeometry(0.4, 4.6, 3.4), M('#6b4226'), 7.1, 2.3, 0, hall);
mesh(new THREE.BoxGeometry(3, 1, 18), M('#d9d0bb'), 8.5, 0.5, 0, hall);
for (const k of [-6, 6]) mesh(new THREE.BoxGeometry(0.2, 2.5, 2.4), windowMat, 7.05, 6.2, k, hall);
mesh(new THREE.BoxGeometry(7, 14, 7), M('#e6dcc4'), 1, 17, 0, hall);
const pyr = mesh(new THREE.ConeGeometry(5.4, 6, 4), M('#3d4a6b'), 1, 27, 0, hall); pyr.rotation.y = Math.PI / 4;
mesh(new THREE.CylinderGeometry(0.15, 0.15, 3), M('#d4af37'), 1, 31, 0, hall);
const clockTex = canvasTex(512, 512, () => {});
function drawClock(hh, mm) {
  const { g } = clockTex.userData; g.clearRect(0, 0, 512, 512);
  g.fillStyle = '#c9a227'; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(256, 256, 226, 0, 7); g.fill();
  g.fillStyle = '#222'; g.font = 'bold 54px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; g.fillText(String(i), 256 + Math.cos(a) * 180, 256 + Math.sin(a) * 180); }
  g.lineCap = 'round';
  const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = mm / 60 * Math.PI * 2 - Math.PI / 2;
  g.strokeStyle = '#222'; g.lineWidth = 20; g.beginPath(); g.moveTo(256, 256); g.lineTo(256 + Math.cos(ha) * 110, 256 + Math.sin(ha) * 110); g.stroke();
  g.lineWidth = 12; g.beginPath(); g.moveTo(256, 256); g.lineTo(256 + Math.cos(ma) * 165, 256 + Math.sin(ma) * 165); g.stroke();
  g.fillStyle = '#c0392b'; g.beginPath(); g.arc(256, 256, 16, 0, 7); g.fill();
  clockTex.needsUpdate = true;
}
drawClock(7, 0);
const clockFace = mesh(new THREE.CircleGeometry(2.9, 48), new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.5, emissive: '#ffffff', emissiveMap: clockTex, emissiveIntensity: 0.15 }), 4.56, 18, 0, hall);
clockFace.rotation.y = Math.PI / 2; clockFace.castShadow = false;
const CLOCK_POS = [-24 + 4.56, 18, -40];

// ---------------------------------------------------------------- props in town
const letterTex = canvasTex(512, 384, (g) => {
  g.fillStyle = '#fffdf6'; g.fillRect(0, 0, 512, 384);
  g.strokeStyle = '#d8cfb8'; g.lineWidth = 8; g.strokeRect(10, 10, 492, 364);
  g.fillStyle = '#c0392b'; g.beginPath(); g.arc(256, 334, 26, 0, 7); g.fill();
  g.fillStyle = '#2b2b2b'; g.textAlign = 'center';
  g.font = 'bold 44px Fredoka, sans-serif'; g.fillText('CONGRATULATIONS!', 256, 80);
  g.font = '32px Fredoka, sans-serif'; g.fillText('You are the new', 256, 150);
  g.font = 'bold 58px Fredoka, sans-serif'; g.fillStyle = '#e0a400'; g.fillText('SWITCH KEEPER', 256, 220);
  g.fillStyle = '#555'; g.font = '26px Fredoka, sans-serif'; g.fillText('(it is forever)', 256, 270);
});
const heroHouse = houses['R8'];
const letter = mesh(new THREE.PlaneGeometry(1.5, 1.125), new THREE.MeshStandardMaterial({ map: letterTex, roughness: 0.8, side: THREE.DoubleSide }), 0, 2.5, 4.68, heroHouse);
letter.rotation.z = 0.06; letter.castShadow = false;

const mower = new THREE.Group(); town.add(mower);
mesh(rb(2.2, 1, 2.6, 0.25), M('#d63031'), 0, 0.8, 0, mower); mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.6, 12), M('#333'), 0, 1.5, 0, mower);
for (const [wx, wz] of [[-1.1, 0.9], [1.1, 0.9], [-1.1, -0.9], [1.1, -0.9]]) { const w = mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 12), M('#1e1e1e'), wx, 0.38, wz, mower); w.rotation.z = Math.PI / 2; }
{ const hb = mesh(new THREE.BoxGeometry(0.15, 0.15, 3.2), M('#555'), -0.8, 2.2, -2.2, mower); hb.rotation.x = -0.6; const hb2 = mesh(new THREE.BoxGeometry(0.15, 0.15, 3.2), M('#555'), 0.8, 2.2, -2.2, mower); hb2.rotation.x = -0.6; mesh(new THREE.BoxGeometry(1.75, 0.18, 0.18), M('#555'), 0, 3.1, -3.5, mower); }

function makeRooster(parent = town) {
  const r = { g: new THREE.Group() }; parent.add(r.g);
  r.body = new THREE.Group(); r.g.add(r.body);
  mesh(rb(1.3, 1.2, 1.9, 0.35), M('#fbfbf4'), 0, 1.6, 0, r.body);
  r.head = new THREE.Group(); r.head.position.set(0, 2.3, 0.8); r.body.add(r.head);
  mesh(rb(0.8, 0.95, 0.8, 0.25), M('#fbfbf4'), 0, 0.3, 0, r.head);
  mesh(rb(0.25, 0.55, 0.7, 0.1), M('#e02b2b'), 0, 0.9, 0, r.head);
  mesh(new THREE.ConeGeometry(0.2, 0.5, 4), M('#f5b700'), 0, 0.3, 0.6, r.head).rotation.x = Math.PI / 2;
  mesh(rb(0.25, 0.35, 0.2, 0.08), M('#e02b2b'), 0, 0.0, 0.42, r.head);
  for (const ex of [-0.41, 0.41]) mesh(new THREE.SphereGeometry(0.09, 8, 6), M('#111'), ex, 0.42, 0.18, r.head);
  mesh(rb(0.4, 1.4, 0.9, 0.15), M('#1d2b20'), 0, 2.4, -1.0, r.body).rotation.x = -0.4;
  r.wL = mesh(rb(0.2, 0.8, 1.2, 0.1), M('#e9e6d8'), -0.72, 1.7, 0, r.body);
  r.wR = mesh(rb(0.2, 0.8, 1.2, 0.1), M('#e9e6d8'), 0.72, 1.7, 0, r.body);
  for (const lx of [-0.3, 0.3]) mesh(new THREE.BoxGeometry(0.12, 1, 0.12), M('#f5b700'), lx, 0.5, 0, r.g);
  return r;
}
const roosters = [makeRooster(), makeRooster(), makeRooster()];
const fence = new THREE.Group(); town.add(fence);
for (let k = 0; k < 9; k++) mesh(new THREE.BoxGeometry(0.3, 2.4, 0.3), M('#a0703c'), k * 1.5 - 6, 1.2, 0, fence);
for (const y of [0.8, 1.9]) mesh(new THREE.BoxGeometry(13, 0.3, 0.2), M('#a0703c'), 0, y, 0.1, fence);
const barn = makeHouse(0, -8, 0, 0, fence); barn.scale.setScalar(0.9);
barn.children[0].material = M('#b8322f');

// confetti
const confetti = new THREE.InstancedMesh(new THREE.BoxGeometry(0.25, 0.25, 0.05), new THREE.MeshStandardMaterial({ roughness: 0.6 }), 400);
{ const cr = rand(11), cols = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585', '#ffffff']; for (let i = 0; i < 400; i++) confetti.setColorAt(i, new THREE.Color(cols[i % cols.length])); }
confetti.frustumCulled = false; scene.add(confetti);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
function updConfetti(lt, center, on) {
  confetti.visible = on; if (!on) return;
  const r = rand(5);
  for (let i = 0; i < 400; i++) {
    const x0 = (r() - 0.5) * 36, z0 = (r() - 0.5) * 30, sp = 3 + r() * 3, ph = r() * 20, spin = r() * 8;
    const y = 26 - ((lt * sp + ph) % 26);
    _v.set(center[0] + x0 + Math.sin(lt * 2 + i) * 0.8, y, center[2] + z0);
    _e.set(lt * spin + i, lt * spin * 0.7, i); _q.setFromEuler(_e);
    _m4.compose(_v, _q, _s); confetti.setMatrixAt(i, _m4);
  }
  confetti.instanceMatrix.needsUpdate = true;
}

// Zzz sprites
function textSprite(txt, color, size) {
  const t = canvasTex(256, 256, (g) => { g.font = 'bold 190px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 18; g.strokeStyle = '#1b1b1b'; g.strokeText(txt, 128, 136); g.fillStyle = color; g.fillText(txt, 128, 136); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: false })); s.scale.setScalar(size); scene.add(s); return s;
}
let zz = [], sweat = [];

// ---------------------------------------------------------------- bedroom set (far away)
const ROOM = new THREE.Group(); ROOM.position.set(400, 0, 0); scene.add(ROOM);
const roomBox = mesh(new THREE.BoxGeometry(18, 11, 16), new THREE.MeshStandardMaterial({ color: '#a9c7e8', side: THREE.BackSide, roughness: 0.9 }), 0, 5.5, 0, ROOM); roomBox.castShadow = false;
mesh(new THREE.BoxGeometry(17.9, 0.1, 15.9), M('#b07a4f'), 0, 0.05, 0, ROOM).castShadow = false;
const winSky = mesh(new THREE.PlaneGeometry(6, 4.4), new THREE.MeshBasicMaterial({ color: '#bfe6ff', fog: false }), -3, 6, -7.95, ROOM);
const winFrame = new THREE.Group(); ROOM.add(winFrame); winFrame.position.set(-3, 6, -7.85);
for (const [w, h, x, y] of [[6.4, 0.3, 0, 2.3], [6.4, 0.3, 0, -2.3], [0.3, 4.8, -3.1, 0], [0.3, 4.8, 3.1, 0], [0.2, 4.6, 0, 0], [6, 0.2, 0, 0]]) mesh(new THREE.BoxGeometry(w, h, 0.25), M('#ffffff'), x, y, 0, winFrame);
const sunbeam = mesh(new THREE.PlaneGeometry(6, 14), new THREE.MeshBasicMaterial({ color: '#fff3c0', transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }), -1.5, 3.5, -3, ROOM);
sunbeam.rotation.set(-1.0, 0, 0.0); sunbeam.castShadow = false;
const bed = new THREE.Group(); ROOM.add(bed); bed.position.set(1.5, 0, -3.2);
mesh(rb(5, 1.6, 9, 0.2), M('#7b4b2a'), 0, 0.8, 0, bed); mesh(rb(5, 4, 0.6, 0.2), M('#7b4b2a'), 0, 2.2, -4.5, bed);
mesh(rb(4.8, 0.7, 8.6, 0.3), M('#ffffff'), 0, 1.9, 0, bed); mesh(rb(3.4, 0.7, 1.6, 0.3), M('#f2f2f2'), 0, 2.5, -3.4, bed);
const blanket = mesh(rb(5.0, 1.5, 6.4, 0.5), M('#4f7cff'), 0, 2.95, 1.2, bed);
const stand = new THREE.Group(); ROOM.add(stand); stand.position.set(-2.6, 0, -5.2);
mesh(rb(2.6, 2.6, 2.6, 0.15), M('#8f5f37'), 0, 1.3, 0, stand);
const alarms = [];
function makeAlarm(x, z, col) {
  const g = new THREE.Group(); g.position.set(x, 2.6, z); stand.add(g);
  const b = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.45, 24), M(col), 0, 0.75, 0, g); b.rotation.x = Math.PI / 2;
  const f = mesh(new THREE.CircleGeometry(0.45, 24), new THREE.MeshStandardMaterial({ map: (() => { const t = canvasTex(128, 128, (gg) => { gg.fillStyle = '#fff'; gg.fillRect(0, 0, 128, 128); gg.strokeStyle = '#111'; gg.lineWidth = 8; gg.lineCap = 'round'; gg.beginPath(); gg.moveTo(64, 64); gg.lineTo(64, 28); gg.moveTo(64, 64); gg.lineTo(90, 64); gg.stroke(); }); return t; })() }), 0, 0.75, 0.235, g);
  f.castShadow = false;
  for (const sx of [-0.35, 0.35]) mesh(new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M('#d4af37', { metalness: 0.6, roughness: 0.3 }), sx, 1.2, 0, g);
  for (const sx of [-0.3, 0.3]) mesh(new THREE.BoxGeometry(0.1, 0.35, 0.1), M('#222'), sx, 0.38, 0, g);
  alarms.push(g); return g;
}
makeAlarm(-0.7, 0.4, '#e74c3c'); makeAlarm(0.6, 0.5, '#3498db'); makeAlarm(-0.2, -0.6, '#2ecc71'); makeAlarm(0.75, -0.55, '#f1c40f');
const lampN = new THREE.Group(); stand.add(lampN); lampN.position.set(0.9, 2.6, -0.9);
mesh(new THREE.CylinderGeometry(0.12, 0.25, 1.4, 12), M('#ddd'), 0, 0.7, 0, lampN);
mesh(new THREE.CylinderGeometry(0.4, 0.8, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#ffe6a8', emissive: '#ffcf6b', emissiveIntensity: 0 }), 0, 1.7, 0, lampN);
const lampGlowRoom = glow('#ffcf7a', 9, 0.8); lampGlowRoom.position.set(0.9, 4.3, -0.9); stand.add(lampGlowRoom);
// poster
mesh(new THREE.PlaneGeometry(3, 4), new THREE.MeshStandardMaterial({ map: canvasTex(192, 256, (g) => { g.fillStyle = '#ffcf33'; g.fillRect(0, 0, 192, 256); g.fillStyle = '#ff6b3d'; g.beginPath(); g.arc(96, 110, 60, 0, 7); g.fill(); g.fillStyle = '#222'; g.font = 'bold 34px sans-serif'; g.textAlign = 'center'; g.fillText('SLEEP', 96, 225); }) }), 6, 6, -7.94, ROOM).castShadow = false;

// ---------------------------------------------------------------- beach set
const BEACH = new THREE.Group(); BEACH.position.set(-400, 0, 0); scene.add(BEACH);
mesh(new THREE.PlaneGeometry(300, 300), M('#f3d9a0', { roughness: 1 }), 0, 0.02, 0, BEACH).rotation.x = -Math.PI / 2;
const water = mesh(new THREE.PlaneGeometry(600, 300), new THREE.MeshStandardMaterial({ color: '#25b6e6', roughness: 0.15, metalness: 0.1 }), 0, 0.12, -170, BEACH); water.rotation.x = -Math.PI / 2; water.castShadow = false;
const foam = mesh(new THREE.BoxGeometry(600, 0.1, 1.4), M('#ffffff'), 0, 0.14, -20, BEACH); foam.castShadow = false;
const umbrella = new THREE.Group(); BEACH.add(umbrella); umbrella.position.set(-3.5, 0, 0);
mesh(new THREE.CylinderGeometry(0.15, 0.15, 9), M('#eeeeee'), 0, 4.5, 0, umbrella);
{ const ug = new THREE.ConeGeometry(6, 2.2, 8, 1, true); const cols = []; const um = mesh(ug, new THREE.MeshStandardMaterial({ color: '#ff5d73', side: THREE.DoubleSide, roughness: 0.6 }), 0, 9, 0, umbrella); um.rotation.z = 0.1; const um2 = mesh(new THREE.ConeGeometry(6.05, 2.21, 8, 1, true, 0, Math.PI / 4), new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide }), 0, 9.01, 0, umbrella); um2.rotation.z = 0.1; }
const lounger = new THREE.Group(); BEACH.add(lounger); lounger.position.set(1.5, 0, 1);
mesh(rb(3.2, 0.3, 4.4, 0.1), M('#3fa7ff'), 0, 1.5, 0.6, lounger);
const back = mesh(rb(3.2, 0.3, 3.6, 0.1), M('#3fa7ff'), 0, 2.7, -2.4, lounger); back.rotation.x = -1.0;
for (const [x, z] of [[-1.4, 2.4], [1.4, 2.4], [-1.4, -1.4], [1.4, -1.4]]) mesh(new THREE.BoxGeometry(0.2, 1.5, 0.2), M('#ddd'), x, 0.75, z, lounger);
function makePalm(x, z, s) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); BEACH.add(g); for (let i = 0; i < 7; i++) { const seg = mesh(rb(1.1 - i * 0.05, 1.8, 1.1 - i * 0.05, 0.2), M(i % 2 ? '#a77b4a' : '#8d6438'), i * 0.25, 0.9 + i * 1.7, 0, g); seg.rotation.z = -0.06 * i; } for (let k = 0; k < 6; k++) { const l = new THREE.Group(); l.position.set(1.8, 12.4, 0); l.rotation.y = k * Math.PI / 3; g.add(l); const lf = mesh(rb(1.6, 0.25, 6, 0.1), M('#2f9e44'), 0, -0.8, 3, l); lf.rotation.x = 0.35; } return g; }
makePalm(-14, -6, 1.1); makePalm(12, -12, 0.95);
const ball = mesh(new THREE.SphereGeometry(0.9, 24, 16), new THREE.MeshStandardMaterial({ map: canvasTex(256, 128, (g) => { const c = ['#ff4d6d', '#ffffff', '#4cc9f0', '#ffffff', '#ffd166', '#ffffff']; c.forEach((cc, i) => { g.fillStyle = cc; g.fillRect(i * 43, 0, 43, 128); }); }) }), 6, 0.9, 4, BEACH);
const drink = new THREE.Group(); BEACH.add(drink); drink.position.set(-1.0, 0, 2.5);
mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.8, 16), M('#ffffff'), 0, 0.9, 0, drink);
mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.8, 12), M('#ff9f43', { transparent: true, opacity: 0.9 }), 0, 2.2, 0, drink);

// ---------------------------------------------------------------- cast
const oldMan = makeChar({ shirt: '#e9e2d0', sleeves: '#8a5a3b', cardigan: '#8a5a3b', pants: '#5b5f6b', skin: '#f1cfa8', bald: '#e8e8e8', beard: '#f4f4f4', glasses: true, cane: true, face: 'smile', shoes: '#3b2a1f' });
const beachMan = makeChar({ shirt: '#ff8fab', bareArms: true, pants: '#2ec4b6', skin: '#f1cfa8', bald: '#e8e8e8', beard: '#f4f4f4', sunglasses: true, face: 'frown' });
const hero = makeChar({ shirt: '#ff7a1a', pants: '#2d3a8c', cap: '#d62828', skin: '#ffd9b0', face: 'smile', shoes: '#ffffff' });
const mayor = makeChar({ shirt: '#22252b', pants: '#22252b', tie: '#c0392b', sash: true, tophat: true, skin: '#e8b48a', masks: true, face: 'tired', shoes: '#111' });
const gary = makeChar({ shirt: '#3aa655', pants: '#7a6a4f', skin: '#d9a273', hair: '#4a3020', face: 'tired', shoes: '#333' });
const crowdDefs = [['#e63946', '#1d3557', '#ffd9b0', '#3b2a1f'], ['#ffb703', '#023047', '#c68a5a', null], ['#8338ec', '#3a3a3a', '#f1c27d', '#111'], ['#06d6a0', '#264653', '#8d5524', null], ['#ff70a6', '#3d405b', '#ffdbac', '#a0522d'], ['#4cc9f0', '#2b2d42', '#e0ac69', null], ['#f4a261', '#1b263b', '#ffe0bd', '#222'], ['#90be6d', '#6d597a', '#c68642', null]];
const crowd = crowdDefs.map(([s, p, sk, hair], i) => makeChar({ shirt: s, pants: p, skin: sk, hair: hair || undefined, beanie: hair ? undefined : ['#ef476f', '#118ab2', '#ffd166', '#06d6a0'][i % 4], face: 'grin' }));
const grandma = makeChar({ shirt: '#f7a1c4', cardigan: '#c76b98', sleeves: '#c76b98', pants: '#8e7cc3', skin: '#f3d2b3', hair: '#dcdcdc', bun: '#dcdcdc', glasses: true, face: 'smile', shoes: '#6b4a3a' });
const allChars = [oldMan, beachMan, hero, mayor, gary, grandma, ...crowd];

// ---------------------------------------------------------------- data + shots
let DATA = null, SHOTS = [];
const tw = (line, wi = 0) => { const ws = DATA.words.filter(w => w.line === line); return ws[Math.min(wi, ws.length - 1)].t0 - 0.04; };
const hy = hillY;
const S = (start, def) => SHOTS.push({ start, ...def });

function hideAll() {
  for (const c of allChars) c.root.visible = false;
  for (const r of roosters) r.g.visible = false;
  mower.visible = false; letter.visible = false; fence.visible = false;
  for (const z of zz) z.visible = false; for (const s of sweat) s.visible = false;
  lampN.children[1].material.emissiveIntensity = 0; lampGlowRoom.visible = false;
  confetti.visible = false; sunbeam.visible = false;
  lever.rotation.x = LEVER_UP;
  for (const o of props) o.visible = false;
  for (const c of cars) { c.position.copy(c.userData.home); c.rotation.set(0, c.userData.rot, 0); }
}
const props = [];
function prop(o) { props.push(o); o.visible = false; return o; }
let flash = 0, shakeAmp = 0, punch = 0;


// ---------------------------------------------------------------- caption
let EMPH = new Set();
function drawCaption(t) {
  const ws = DATA.words; let cur = null;
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i], next = ws[i + 1];
    const end = next ? Math.min(next.t0, w.t1 + 0.35) : w.t1 + 0.4;
    if (t >= w.t0 - 0.02 && t < end) { cur = w; break; }
  }
  if (!cur) return;
  const txt = cur.w.replace(/[.,!?"]/g, '');
  const age = t - cur.t0;
  const s = 1 + 0.22 * Math.max(0, 1 - age / 0.09);
  const isE = EMPH.has(txt.toLowerCase());
  const fs = 96 * SCALE * s;
  ctx.save();
  ctx.translate(W * SCALE / 2, H * SCALE * 0.6);
  ctx.font = `700 ${fs}px Fredoka`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 7 * SCALE;
  ctx.lineWidth = 20 * SCALE * s; ctx.strokeStyle = '#000'; ctx.strokeText(txt, 0, 0);
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = isE ? '#ffe14d' : '#ffffff'; ctx.fillText(txt, 0, 0);
  ctx.restore();
}

// ---------------------------------------------------------------- render
const _l = new THREE.Vector3();
window.renderAt = function (t) {
  let si = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].start) si = i;
  const sh = SHOTS[si], next = SHOTS[si + 1];
  const end = next ? next.start : DATA.duration + 0.8;
  const lt = t - sh.start, u = clamp(lt / (end - sh.start));
  hideAll();
  chair.visible = true;
  oldMan.root.visible = false;
  sh.set.call(sh, lt, u, t);
  const c = sh.cam(u, lt);
  // handheld + punch-ins
  const hh = 0.06 + (sh.shake || 0) * Math.max(0.2, 1 - lt * 1.2);
  const n = (a, b) => Math.sin(t * a + b) + Math.sin(t * a * 1.7 + b * 2) * 0.5;
  camera.position.set(c.p[0] + n(1.3, 1) * hh * 3, c.p[1] + n(1.1, 2) * hh * 3, c.p[2] + n(0.9, 3) * hh * 2);
  _l.set(c.l[0] + (sh.shake ? n(37, 1) * sh.shake * Math.max(0.2, 1 - lt) : 0), c.l[1] + (sh.shake ? n(41, 5) * sh.shake * Math.max(0.2, 1 - lt) : 0), c.l[2]);
  let fov = c.fov || 50;
  if (sh.punch) fov *= 1 - 0.18 * easeOut(lt / 0.15);
  if (sh.dramatic) fov *= 1 - 0.12 * ease(u);
  camera.fov = fov; camera.updateProjectionMatrix();
  camera.lookAt(_l);
  setLight(sh.light, sh.center, sh.span);
  if (sh.sunPunch) { sunGroup.position.copy(camera.position).add(new THREE.Vector3(0, 0.55, -0.83).normalize().multiplyScalar(1100)); sunGroup.scale.setScalar(1 + ease(u) * 1.3); }
  else if (sh.sunPunchSmall) { sunGroup.position.copy(camera.position).add(new THREE.Vector3(0.25, 0.32, -0.9).normalize().multiplyScalar(1100)); sunGroup.scale.setScalar(1.6); }
  else sunGroup.scale.setScalar(1);
  sky.position.copy(camera.position); stars.position.copy(camera.position);
  clouds.visible = !curPreset.night && !sh.room;
  clouds.position.x = t * 2;
  // room / beach fog off
  scene.fog.far = sh.room ? 2000 : (sh.beach ? 900 : 520);
  renderer.render(scene, camera);
  // composite
  ctx.drawImage(renderer.domElement, 0, 0);
  // flash on clicks
  if (sh.flash && lt < 0.18) { ctx.fillStyle = `rgba(255,255,255,${0.75 * (1 - lt / 0.18)})`; ctx.fillRect(0, 0, out.width, out.height); }
  if (sh.tint) { ctx.fillStyle = sh.tint; ctx.fillRect(0, 0, out.width, out.height); }
  // vignette
  const vg = ctx.createRadialGradient(out.width / 2, out.height / 2, out.height * 0.35, out.width / 2, out.height / 2, out.height * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, out.width, out.height);
  // fade out at the very end
  if (t > DATA.duration + 0.3) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - DATA.duration - 0.3) / 0.5)})`; ctx.fillRect(0, 0, out.width, out.height); }
  drawCaption(t);
  return true;
};
window.grab = (q = 0.9) => out.toDataURL('image/jpeg', q);

window.init = async function (data) {
  DATA = data;
  const ff = new FontFace('Fredoka', 'url(/assets/Fredoka.ttf)', { weight: '300 700' });
  await ff.load(); document.fonts.add(ff);
  // redraw textures that use the font
  letterTex.userData.g.clearRect(0, 0, 512, 384);
  {
    const g = letterTex.userData.g;
    g.fillStyle = '#fffdf6'; g.fillRect(0, 0, 512, 384);
    g.strokeStyle = '#d8cfb8'; g.lineWidth = 8; g.strokeRect(10, 10, 492, 364);
    g.fillStyle = '#c0392b'; g.beginPath(); g.arc(256, 334, 26, 0, 7); g.fill();
    g.fillStyle = '#2b2b2b'; g.textAlign = 'center';
    g.font = '700 46px Fredoka'; g.fillText('CONGRATULATIONS!', 256, 80);
    g.font = '500 34px Fredoka'; g.fillText('You are the new', 256, 150);
    g.font = '700 60px Fredoka'; g.fillStyle = '#e0a400'; g.fillText('SWITCH KEEPER', 256, 222);
    g.fillStyle = '#666'; g.font = '500 26px Fredoka'; g.fillText('(it is forever)', 256, 272);
    letterTex.needsUpdate = true;
  }
  zz = [textSprite('Z', '#ffffff', 1), textSprite('z', '#ffffff', 1), textSprite('Z', '#ffffff', 1)];
  sweat = [0, 1].map(() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(64, 96, (g) => { g.fillStyle = '#7fd3ff'; g.strokeStyle = '#1b1b1b'; g.lineWidth = 5; g.beginPath(); g.moveTo(32, 6); g.quadraticCurveTo(60, 60, 32, 88); g.quadraticCurveTo(4, 60, 32, 6); g.fill(); g.stroke(); }), transparent: true, depthWrite: false })); s.scale.set(0.28, 0.42, 1); scene.add(s); return s; });
  const ep = params.get('ep') || 'sun';
  const mod = await import(`/src/episodes/${ep}/shots.js`);
  const A = { THREE, scene, town, ROOM, BEACH, S, tw, pose, mix, mix3, ease, easeOut, clamp, rand, hy, hillY, TOP, chair, lever, LEVER_UP, LEVER_DOWN, LV,
    CLOCK_POS, drawClock, oldMan, hero, mayor, gary, grandma, crowd, beachMan, mower, roosters, fence, zz, sweat, updConfetti, letter, lampN,
    lampGlowRoom, alarms, sunbeam, winSky, prop, mesh, rb, M, canvasTex, glow, textSprite, makeChar, makeHouse, makeTree, makeCar, houses, cars,
    hall, clockFace, camera, SHOTS, PRESETS, allChars, faceTex, renderer };
  const r = mod.default(A);
  EMPH = new Set(r.emph || []);
  return { shots: SHOTS.length, duration: DATA.duration };
};
