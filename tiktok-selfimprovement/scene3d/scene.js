// Deterministic 3D environment: everything is a pure function of time t,
// so frames can be rendered out of order / in parallel.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const easeOutBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
const easeInOut = x => x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
const clamp01 = x => Math.max(0, Math.min(1, x));
const SPEED = 2.4;

let renderer, composer, scene, camera, job, hue, segObjs = [], keyLight, rings = [], dust;

function emojiTexture(ch) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.font = '200px "Noto Color Emoji"'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(ch, 128, 140);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}
function haloTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
}

window.init = async (j) => {
  job = j;
  const R = rng(j.seed || 7);
  hue = new THREE.Color(j.hue[0] / 255, j.hue[1] / 255, j.hue[2] / 255);
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(j.w, j.h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  const bg = hue.clone().multiplyScalar(0.035);
  scene.background = bg; scene.fog = new THREE.FogExp2(bg, 0.03);
  camera = new THREE.PerspectiveCamera(60, j.w / j.h, 0.1, 400);
  scene.add(camera);

  // floor (glossy) + glowing grid
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 700),
    new THREE.MeshStandardMaterial({ color: 0x07070b, roughness: 0.22, metalness: 0.85 }));
  floor.rotation.x = -Math.PI / 2; floor.position.z = -300; scene.add(floor);
  const grid = new THREE.GridHelper(700, 350, hue, hue);
  grid.material.transparent = true; grid.material.opacity = 0.13; grid.position.set(0, 0.01, -300); scene.add(grid);

  // corridor of monoliths with neon strips
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0d0d14, roughness: 0.45, metalness: 0.6 });
  const neon = new THREE.MeshStandardMaterial({ color: hue, emissive: hue, emissiveIntensity: 1.5 });
  const neonW = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9 });
  for (let i = 0; i < 70; i++) {
    for (const side of [-1, 1]) {
      const h = 5 + R() * 11, x = side * (5.2 + R() * 1.6), z = 4 - i * 6.5 - R() * 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, h, 1.4), darkMat);
      m.position.set(x, h / 2, z); scene.add(m);
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.07, h * (0.5 + R() * 0.5), 0.07), R() < 0.8 ? neon : neonW);
      s.position.set(x - side * 0.72, h / 2, z + 0.45); scene.add(s);
      if (R() < 0.35) { // floating cube above
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), neon);
        c.position.set(x * 0.8, h + 1.5 + R() * 3, z); c.userData.spin = R() * 2; scene.add(c); rings.push(c);
      }
    }
  }
  // rings to fly through
  for (let k = 0; k < 14; k++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.07, 12, 96), neon);
    r.position.set(0, 2.6, -14 - k * 24); r.userData.ring = true; scene.add(r); rings.push(r);
  }
  // dust
  const N = 3500, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (R() - 0.5) * 30; pos[i * 3 + 1] = R() * 14; pos[i * 3 + 2] = 10 - R() * 420; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: hue.clone().lerp(new THREE.Color(1, 1, 1), 0.5), size: 0.05, transparent: true, opacity: 0.6 }));
  scene.add(dust);

  scene.add(new THREE.AmbientLight(0xffffff, 0.12));
  scene.add(new THREE.HemisphereLight(hue, 0x000000, 0.35));
  keyLight = new THREE.PointLight(hue, 25, 40, 1.6); scene.add(keyLight);
  const fill = new THREE.PointLight(0xffffff, 3, 14, 2); fill.position.set(0, 1, 2); camera.add(fill);

  // per-segment objects: emoji sprite + 3D number, both attached to the camera
  const font = await new Promise(res => new FontLoader().load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', res));
  await document.fonts.load('200px "Noto Color Emoji"', '🔥');
  const halo = haloTexture();
  const labelMat = new THREE.MeshStandardMaterial({ depthTest: false, color: hue, emissive: hue, emissiveIntensity: 0.12, metalness: 0.5, roughness: 0.35 });
  const labelEdge = new THREE.MeshStandardMaterial({ depthTest: false, color: 0x222222, emissive: 0xffffff, emissiveIntensity: 0.25 });
  for (const s of j.segs) {
    const o = { seg: s };
    if (s.emoji) {
      const grp = new THREE.Group();
      const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, color: hue, transparent: true, depthWrite: false, opacity: 0.3, toneMapped: false }));
      h.scale.set(2.2, 2.2, 1); grp.add(h);
      const e = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTexture(s.emoji), transparent: true, depthWrite: false, toneMapped: false }));
      e.scale.set(1.15, 1.15, 1); grp.add(e);
      grp.visible = false; grp.renderOrder = 11; camera.add(grp); o.emoji = grp;
    }
    if (s.label) {
      const geo = new TextGeometry(s.label, { font, size: s.label.length <= 2 ? 2.4 : 1.6, depth: 0.7, curveSegments: 6,
        bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3 });
      geo.computeBoundingBox(); const bb = geo.boundingBox;
      geo.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -0.35);
      const m = new THREE.Mesh(geo, [labelMat, labelEdge]);
      m.visible = false; m.renderOrder = 10; camera.add(m); o.label = m;
    }
    segObjs.push(o);
  }
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(j.w / 2, j.h / 2), 0.55, 0.4, 0.55));
  composer.addPass(new OutputPass());
  return true;
};

// camera "pose" per segment: lateral offset, height, roll, yaw
function pose(i) {
  if (i < 0) return [0, 2.3, 0, 0];
  const P = [[0, 2.3, 0, 0], [-1.7, 1.6, 0.07, 0.12], [1.6, 3.2, -0.06, -0.1], [-0.9, 2.8, -0.04, 0.18],
             [1.8, 1.7, 0.08, -0.16], [0, 3.6, 0, 0], [-1.6, 2.1, -0.07, 0.1]];
  return P[i % P.length];
}

window.renderAt = (t) => {
  const segs = job.segs;
  let si = 0;
  for (let i = 0; i < segs.length; i++) if (t >= segs[i].start - 0.12) si = i;
  const since = t - (segs[si].start - 0.12);
  // swoop between poses at each cut
  const a = pose(si - 1), b = pose(si), k = easeInOut(clamp01(since / 0.55));
  const p = a.map((v, i) => v + (b[i] - v) * (si === 0 ? 1 : k));
  const z = 6 - t * SPEED - (si > 0 ? 1.2 * Math.exp(-since * 4) : 0);
  camera.position.set(p[0] + 0.25 * Math.sin(t * 0.7), p[1] + 0.12 * Math.sin(t * 1.1), z);
  camera.rotation.set(0.03 * Math.sin(t * 0.5) - 0.02, p[3] + 0.04 * Math.sin(t * 0.4), p[2]);
  camera.fov = 60 + 8 * Math.exp(-since * 6) * (si > 0 ? 1 : 0); camera.updateProjectionMatrix();
  keyLight.position.set(0, 4, z - 8);
  keyLight.intensity = 25 * (1 + 1.5 * Math.exp(-since * 5));
  for (const r of rings) {
    if (r.userData.ring) r.rotation.z = t * 0.3 + r.position.z;
    else { r.rotation.x = t * r.userData.spin; r.rotation.y = t * 0.7; }
  }
  dust.position.y = -((t * 0.25) % 2);

  for (let i = 0; i < segObjs.length; i++) {
    const o = segObjs[i], s = o.seg;
    const start = s.start - 0.12, end = (i + 1 < segs.length ? segs[i + 1].start - 0.12 : job.dur + 1);
    const vis = t >= start && t < end, st = t - start;
    if (o.emoji) {
      o.emoji.visible = vis;
      if (vis) {
        const sc = Math.max(0.01, easeOutBack(clamp01(st / 0.35)));
        o.emoji.scale.setScalar(sc);
        o.emoji.position.set(0.06 * Math.sin(t * 1.3), 0.95 + 0.07 * Math.sin(t * 2.2), -5.5);
      }
    }
    if (o.label) {
      o.label.visible = vis;
      if (vis) {
        const sc = Math.max(0.01, easeOutBack(clamp01(st / 0.4)));
        o.label.scale.setScalar(sc);
        o.label.position.set(0, -2.15, -9 + Math.min(st, 6) * 0.25);
        o.label.rotation.set(-0.15, 0.35 * Math.sin(st * 1.4) + (1 - clamp01(st / 0.5)) * 1.5, 0);
      }
    }
  }
  composer.render();
  return true;
};
window.ready = true;
