// 3D world with an animated character. Deterministic: every frame is a pure function of t.
// Places: "room" (night, phone addiction) -> "path" (dawn trail) -> "summit" (sunrise above the clouds)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const rng = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const clamp01 = x => Math.max(0, Math.min(1, x));
const easeOutBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const ROOM = V(-400, 0, 0), SUMMIT = V(400, 40, 0);
const LOOP = new Set(['Idle', 'Walking', 'Running', 'Dance']);
const HOLD = new Set(['Sitting', 'Death']);
const MOVE = { Walking: 1.45, Running: 4.2 };
const CHAR_H = 1.8;

let job, hue, renderer, composer, scene, camera, mixer, actions = {}, robot, sun, hemi, amb, sky, skyU, phoneLight, phone,
  bubbles = [], segObjs = [], pathS = [], lamp, font, palm;

// ---------- terrain helpers
const pathX = z => 4 * Math.sin(z / 30) + 1.5 * Math.sin(z / 11);
const hills = (x, z) => 3.2 * Math.sin(x * 0.045) * Math.cos(z * 0.037) + 1.4 * Math.sin(x * 0.12 + z * 0.07) + 0.6 * Math.cos(x * 0.31 - z * 0.23);
const groundY = (x, z) => hills(x, z) * smooth(3.5, 14, Math.abs(x - pathX(z)));

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const emojiTex = ch => canvasTex(256, 256, (g) => { g.font = '200px "Noto Color Emoji"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 128, 140); });

function buildSky() {
  skyU = { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() }, sunDir: { value: V(0, 0.1, -1) }, sunCol: { value: new THREE.Color() } };
  const mat = new THREE.ShaderMaterial({ uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; varying vec3 vP;
      void main(){ float h = clamp(vP.y*1.6+0.15,0.0,1.0); vec3 c = mix(bottom, top, pow(h,0.7));
        float s = max(dot(normalize(vP), normalize(sunDir)),0.0); c += sunCol*(pow(s,600.0)*4.0 + pow(s,12.0)*0.35);
        gl_FragColor = vec4(c,1.0); }` });
  sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), mat); scene.add(sky);
}

function buildPath(R) {
  // ground
  const g = new THREE.PlaneGeometry(260, 520, 130, 260); g.rotateX(-Math.PI / 2); g.translate(0, 0, -230);
  const p = g.attributes.position, col = [];
  const cA = new THREE.Color('#3f7d3a'), cB = new THREE.Color('#6a9a3c'), cP = new THREE.Color('#c9a774');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i); p.setY(i, groundY(x, z));
    const d = Math.abs(x - pathX(z));
    const c = cA.clone().lerp(cB, 0.5 + 0.5 * Math.sin(x * 0.2 + z * 0.13)); if (d < 1.4) c.copy(cP); else if (d < 2) c.lerp(cP, 0.5);
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  const ground = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
  ground.receiveShadow = true; scene.add(ground);
  // trees (instanced)
  const N = 520, trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.18, 1.2, 6), new THREE.MeshStandardMaterial({ color: '#5b3b24', flatShading: true }), N);
  const leaves = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 2.6, 7), new THREE.MeshStandardMaterial({ color: '#2f6b35', flatShading: true, roughness: 0.8 }), N);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), cl = new THREE.Color();
  let k = 0;
  while (k < N) {
    const z = 15 - R() * 470, x = pathX(z) + (R() < 0.5 ? -1 : 1) * (4 + R() * 60);
    const s = 0.7 + R() * 1.3, y = groundY(x, z);
    m.compose(V(x, y + 0.6 * s, z), q, V(s, s, s)); trunk.setMatrixAt(k, m);
    m.compose(V(x, y + (1.2 + 1.3) * s, z), q, V(s, s * (0.9 + R() * 0.5), s)); leaves.setMatrixAt(k, m);
    leaves.setColorAt(k, cl.setHSL(0.27 + R() * 0.08, 0.45, 0.22 + R() * 0.12)); k++;
  }
  trunk.castShadow = leaves.castShadow = true; scene.add(trunk, leaves);
  // rocks
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.5, 0), new THREE.MeshStandardMaterial({ color: '#8d8a84', flatShading: true }), 160);
  for (let i = 0; i < 160; i++) { const z = 10 - R() * 460, x = pathX(z) + (R() < 0.5 ? -1 : 1) * (2.2 + R() * 25), s = 0.3 + R() * 1.1;
    m.compose(V(x, groundY(x, z) + 0.15 * s, z), q.setFromEuler(new THREE.Euler(R() * 3, R() * 3, 0)), V(s, s * 0.7, s)); rocks.setMatrixAt(i, m); }
  rocks.castShadow = true; scene.add(rocks); q.identity();
  // distant mountains
  const mm = new THREE.MeshStandardMaterial({ color: '#5d6f8a', flatShading: true, roughness: 1 });
  for (let i = 0; i < 14; i++) { const h = 60 + R() * 90, c = new THREE.Mesh(new THREE.ConeGeometry(h * 0.9, h, 6), mm);
    c.position.set((R() - 0.5) * 700, h / 2 - 8, -480 - R() * 150); c.rotation.y = R() * 3; scene.add(c); }
  // lanterns along the path, in the video's accent colour
  const lm = new THREE.MeshStandardMaterial({ color: hue, emissive: hue, emissiveIntensity: 2.2 });
  for (let z = 0; z > -440; z -= 9) { const x = pathX(z) + 1.8, post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.08), new THREE.MeshStandardMaterial({ color: '#2a2a2a' }));
    post.position.set(x, 0.55, z); const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), lm); b.position.set(x, 1.15, z); scene.add(post, b); }
}

function buildRoom() {
  const o = ROOM;
  const wood = new THREE.MeshStandardMaterial({ color: '#3a2a22', roughness: 0.6 });
  const wall = new THREE.MeshStandardMaterial({ color: '#1d2233', roughness: 0.9 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), wood); floor.rotation.x = -Math.PI / 2; floor.position.copy(o); floor.receiveShadow = true; scene.add(floor);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), wall); back.position.set(o.x, 3.5, o.z - 4); scene.add(back);
  for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), wall); w.rotation.y = -sx * Math.PI / 2; w.position.set(o.x + sx * 6, 3.5, o.z); scene.add(w); }
  // window with night city
  const city = canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#060b1c'; g.fillRect(0, 0, w, h); const R = rng(9);
    for (let i = 0; i < 40; i++) { const bw = 12 + R() * 30, bh = 40 + R() * 180, bx = R() * w; g.fillStyle = '#0c1226'; g.fillRect(bx, h - bh, bw, bh);
      for (let y = h - bh + 6; y < h; y += 9) for (let x = bx + 3; x < bx + bw - 3; x += 7) if (R() < 0.3) { g.fillStyle = R() < 0.7 ? '#ffcf6b' : '#7fb6ff'; g.fillRect(x, y, 3, 4); } }
    g.fillStyle = '#e8eefc'; g.beginPath(); g.arc(420, 50, 18, 0, 7); g.fill(); });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.3), new THREE.MeshBasicMaterial({ map: city, toneMapped: false }));
  win.position.set(o.x + 1.2, 3.2, o.z - 3.98); scene.add(win);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.5, 0.05), new THREE.MeshStandardMaterial({ color: '#111' })); frame.position.set(o.x + 1.2, 3.2, o.z - 4.02); scene.add(frame);
  // couch
  const fab = new THREE.MeshStandardMaterial({ color: '#4a3f6b', roughness: 0.9 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 1.1), fab); seat.position.set(o.x, 0.25, o.z - 0.75);
  const backr = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.1, 0.35), fab); backr.position.set(o.x, 0.8, o.z - 1.35);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 1.1), fab); armL.position.set(o.x - 1.6, 0.4, o.z - 0.75);
  const armR = armL.clone(); armR.position.x = o.x + 1.6;
  for (const b of [seat, backr, armL, armR]) { b.castShadow = b.receiveShadow = true; scene.add(b); }
  // mess on the floor: snacks / cans
  const can = new THREE.MeshStandardMaterial({ color: '#d33', metalness: 0.7, roughness: 0.3 });
  for (const [x, z] of [[1.4, 0.9], [1.7, 0.6], [-1.9, 1.1]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 10), can); c.position.set(o.x + x, 0.11, o.z + z); scene.add(c); }
  lamp = new THREE.PointLight('#ffb36b', 6, 10, 2); lamp.position.set(o.x - 2.6, 2.4, o.z - 1); scene.add(lamp);
  phoneLight = new THREE.PointLight('#6fb3ff', 0, 4, 2); scene.add(phoneLight);
  phone = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.17, 0.012), [0, 0, 0, 0, new THREE.MeshBasicMaterial({ color: '#9cd0ff', toneMapped: false }), new THREE.MeshStandardMaterial({ color: '#111' })]
    .map(x => x || new THREE.MeshStandardMaterial({ color: '#111' })));
  scene.add(phone);
  for (const ch of ['❤️', '🔔', '💬', '📱', '👍', '🔥']) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTex(ch), transparent: true, depthWrite: false, toneMapped: false }));
    s.scale.setScalar(0.42); scene.add(s); bubbles.push(s);
  }
}

function buildSummit(R) {
  const o = SUMMIT;
  const rock = new THREE.MeshStandardMaterial({ color: '#7b6a5c', flatShading: true, roughness: 1 });
  const mtn = new THREE.Mesh(new THREE.CylinderGeometry(5, 60, 46, 9, 4), rock); mtn.position.set(o.x, o.y - 23, o.z); mtn.receiveShadow = true; scene.add(mtn);
  const p = mtn.geometry.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < 22) { p.setX(i, p.getX(i) * (0.9 + R() * 0.25)); p.setZ(i, p.getZ(i) * (0.9 + R() * 0.25)); }
  mtn.geometry.computeVertexNormals();
  // sea of clouds
  const cm = new THREE.MeshStandardMaterial({ color: '#fff4ea', roughness: 1, flatShading: true });
  const cg = new THREE.IcosahedronGeometry(1, 1);
  const cl = new THREE.InstancedMesh(cg, cm, 420), m = new THREE.Matrix4(), q = new THREE.Quaternion();
  for (let i = 0; i < 420; i++) { const a = R() * 6.283, r = 14 + R() * 240, s = 4 + R() * 12;
    m.compose(V(o.x + Math.cos(a) * r, o.y - 13 - R() * 6, o.z + Math.sin(a) * r), q, V(s * 1.6, s * 0.45, s)); cl.setMatrixAt(i, m); }
  scene.add(cl);
  // flag in the accent colour
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8), new THREE.MeshStandardMaterial({ color: '#ddd', metalness: 0.8, roughness: 0.3 }));
  pole.position.set(o.x - 1.8, o.y + 1.6, o.z - 1.2); pole.castShadow = true; scene.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8, 10, 4), new THREE.MeshStandardMaterial({ color: hue, side: THREE.DoubleSide, emissive: hue, emissiveIntensity: 0.25 }));
  flag.position.set(o.x - 1.8 + 0.66, o.y + 2.8, o.z - 1.2); flag.userData.flag = true; scene.add(flag); segObjs.flag = flag;
}

window.init = async (j) => {
  job = j;
  const R = rng(j.seed || 5);
  hue = new THREE.Color(j.hue[0] / 255, j.hue[1] / 255, j.hue[2] / 255);
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(j.w, j.h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#000', 30, 260);
  camera = new THREE.PerspectiveCamera(50, j.w / j.h, 0.05, 2000); scene.add(camera);
  amb = new THREE.AmbientLight('#ffffff', 0.2); scene.add(amb);
  hemi = new THREE.HemisphereLight('#bcd7ff', '#3b2b1a', 0.6); scene.add(hemi);
  sun = new THREE.DirectionalLight('#ffd6a0', 2.5); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 80 });
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03; scene.add(sun, sun.target);
  buildSky(); buildPath(R); buildRoom(); buildSummit(R);

  const gltf = await new Promise((res, rej) => new GLTFLoader().load('./assets/RobotExpressive.glb', res, undefined, rej));
  robot = gltf.scene;
  const bb = new THREE.Box3().setFromObject(robot); const sc = CHAR_H / (bb.max.y - bb.min.y); robot.scale.setScalar(sc);
  robot.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  palm = robot.getObjectByName('Palm2R') || robot.getObjectByName('Palm2.R');
  scene.add(robot);
  mixer = new THREE.AnimationMixer(robot);
  for (const clip of gltf.animations) { const a = mixer.clipAction(clip); a.play(); a.setEffectiveWeight(0); actions[clip.name] = a; }

  font = await new Promise(res => new FontLoader().load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', res));
  await document.fonts.load('200px "Noto Color Emoji"', '🔥');
  const halo = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.3)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const labelMat = new THREE.MeshStandardMaterial({ color: hue, emissive: hue, emissiveIntensity: 0.35, metalness: 0.6, roughness: 0.25 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.2 });

  // pre-integrate distance along the path (deterministic)
  let s = 0; const dt = 1 / 120;
  for (let t = 0; t <= j.dur + 1; t += dt) { const si = segAt(t); const sg = j.segs[si];
    if ((sg.place || 'path') === 'path') s += (MOVE[sg.anim] || 0) * dt; pathS.push(s); }

  for (const sg of j.segs) {
    const o = { seg: sg };
    if (sg.emoji) { const grp = new THREE.Group();
      const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, color: hue, transparent: true, depthWrite: false, opacity: 0.5, toneMapped: false })); h.scale.setScalar(1.3);
      const e = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTex(sg.emoji), transparent: true, depthWrite: false, toneMapped: false })); e.scale.setScalar(0.75);
      grp.add(h, e); grp.visible = false; scene.add(grp); o.emoji = grp; }
    if (sg.label) {
      const geo = new TextGeometry(sg.label, { font, size: sg.label.length <= 2 ? 0.95 : 0.62, depth: 0.22, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 3 });
      geo.computeBoundingBox(); const b = geo.boundingBox; geo.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -0.11);
      const mesh = new THREE.Mesh(geo, [labelMat, edgeMat]); mesh.castShadow = true; mesh.visible = false; scene.add(mesh); o.label = mesh;
    }
    segObjs.push(o);
  }
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(j.w / 2, j.h / 2), 0.35, 0.4, 0.85));
  composer.addPass(new OutputPass());
  return true;
};

function segAt(t) { let si = 0; for (let i = 0; i < job.segs.length; i++) if (t >= job.segs[i].start - 0.12) si = i; return si; }

function clipState(anim, since) {
  const a = actions[anim] || actions.Idle, d = a.getClip().duration;
  if (LOOP.has(anim)) return [anim, since % d];
  if (HOLD.has(anim)) return [anim, Math.min(since, d - 0.001)];
  // one-shot emote, then back to Idle (emotes that are short get repeated once)
  const reps = d < 1.2 ? 2 : 1;
  if (since < d * reps) return [anim, since % d];
  return ['Idle', (since - d * reps) % actions.Idle.getClip().duration];
}

function setPose(t) {
  const si = segAt(t), sg = job.segs[si], since = t - (sg.start - 0.12);
  for (const a of Object.values(actions)) a.setEffectiveWeight(0);
  const [nA, tA] = clipState(sg.anim || 'Idle', since);
  // blend from previous state inside the same place (no blend across a place change = clean cut)
  let w = 1;
  if (si > 0 && (job.segs[si - 1].place || 'path') === (sg.place || 'path') && since < 0.3) {
    const pg = job.segs[si - 1], pSince = (sg.start - pg.start);
    const [nB, tB] = clipState(pg.anim || 'Idle', pSince + since);
    w = clamp01(since / 0.3);
    if (nB !== nA) { actions[nB].time = tB; actions[nB].setEffectiveWeight(1 - w); } else w = 1;
  }
  actions[nA].time = tA; actions[nA].setEffectiveWeight(nB_same(w));
  mixer.update(0);
  return { si, sg, since };
}
const nB_same = w => w;

function charTransform(t, sg) {
  const place = sg.place || 'path';
  if (place === 'room') return { p: ROOM.clone().add(V(0, 0.02, -0.55)), yaw: 0 };
  if (place === 'summit') return { p: SUMMIT.clone(), yaw: 0.25 };
  const s = pathS[Math.min(pathS.length - 1, Math.floor(t * 120))], z = 4 - s;
  const x = pathX(z), x2 = pathX(z - 0.3);
  return { p: V(x, 0, z), yaw: Math.atan2(x2 - x, -0.3) };
}

window.renderAt = (t) => {
  const { si, sg, since } = setPose(t);
  const place = sg.place || 'path';
  const { p, yaw } = charTransform(t, sg);
  robot.position.copy(p); robot.rotation.y = yaw;
  // in the room the robot sits on the couch: lift it onto the seat when sitting
  if (place === 'room' && (sg.anim === 'Sitting')) robot.position.y += 0.0;
  const fwd = V(Math.sin(yaw), 0, Math.cos(yaw)), right = V(Math.cos(yaw), 0, -Math.sin(yaw)), up = V(0, 1, 0);

  // ----- environment per place
  const prog = clamp01(t / job.dur);
  if (place === 'room') {
    skyU.top.value.set('#020409'); skyU.bottom.value.set('#060a18'); skyU.sunCol.value.set('#000');
    scene.fog.color.set('#05070d'); scene.fog.near = 20; scene.fog.far = 60;
    amb.intensity = 0.3; hemi.intensity = 0.35; sun.intensity = 0.35; lamp.intensity = 14;
    phoneLight.intensity = 1.4 + 0.5 * Math.sin(t * 9) * Math.sin(t * 3.1);
  } else {
    const dawn = place === 'summit' ? 1 : smooth(0, 1, prog * 1.3);
    const top = new THREE.Color('#1f3566').lerp(new THREE.Color('#4f86c9'), dawn);
    const bot = new THREE.Color('#ff7a4a').lerp(new THREE.Color('#ffd39a'), dawn);
    skyU.top.value.copy(top); skyU.bottom.value.copy(bot); skyU.sunCol.value.set('#ffd9a8');
    const sunDir = V(-0.35, 0.05 + 0.18 * dawn, -1).normalize(); skyU.sunDir.value.copy(sunDir);
    scene.fog.color.copy(bot).lerp(top, 0.25); scene.fog.near = 25; scene.fog.far = place === 'summit' ? 700 : 230;
    amb.intensity = 0.25; hemi.intensity = 0.7 + 0.3 * dawn; sun.intensity = 2.2 + 1.2 * dawn; sun.color.set('#ffc890').lerp(new THREE.Color('#fff0d8'), dawn);
    sun.position.copy(p).addScaledVector(sunDir, 40).add(V(0, 12, 0)); lamp.intensity = 0; phoneLight.intensity = 0;
  }
  sky.position.copy(p);
  sun.target.position.copy(p); if (place === 'room') { sun.position.copy(p).add(V(3, 10, 6)); sun.color.set('#8fa8ff'); }

  // phone in hand + notification bubbles (room only)
  const inRoom = place === 'room';
  phone.visible = inRoom && sg.anim === 'Sitting';
  robot.updateMatrixWorld(true);
  if (palm && phone.visible) { palm.getWorldPosition(phone.position); phone.position.addScaledVector(fwd, 0.05); phone.lookAt(camera.position); }
  phoneLight.position.copy(p).add(V(0, 0.75, 0)).addScaledVector(fwd, 0.7);
  bubbles.forEach((b, i) => { b.visible = inRoom && sg.anim === 'Sitting';
    const a = t * 0.9 + i * 1.047; b.position.copy(p).add(V(Math.cos(a) * 1.25, 1.55 + 0.35 * Math.sin(t * 1.7 + i), Math.sin(a) * 1.25));
    b.scale.setScalar(0.38 + 0.06 * Math.sin(t * 4 + i)); });
  if (segObjs.flag) { const f = segObjs.flag.geometry.attributes.position;
    if (!segObjs.flag.userData.base) segObjs.flag.userData.base = f.array.slice();
    const bs = segObjs.flag.userData.base; for (let i = 0; i < f.count; i++) { const x = bs[i * 3] + 0.65; f.setZ(i, 0.12 * x * Math.sin(x * 5 - t * 6)); } f.needsUpdate = true; }

  // ----- camera
  const cam = sg.cam || 'front';
  const head = p.clone().add(V(0, CHAR_H * 0.95, 0));
  // when sitting, the whole framing drops so the character stays in the lower half
  const sit = (sg.anim === 'Sitting') ? -0.7 : 0;
  const L = (y) => V(0, y + sit, 0), LK = 0.35;
  let cpos, look, fov = 50;
  const wob = V(0.05 * Math.sin(t * 1.3), 0.04 * Math.sin(t * 1.7), 0);
  if (cam === 'close') {
    const d = 3.6 - 0.6 * clamp01(since / 4);
    cpos = p.clone().addScaledVector(fwd, d).addScaledVector(right, 0.45).add(L(1.6)); look = p.clone().add(L(1.75 + LK));
  } else if (cam === 'side') {
    cpos = p.clone().addScaledVector(right, inRoom ? 3.6 : 5.6).addScaledVector(fwd, inRoom ? 2.2 : 1.6).add(L(1.6)); look = p.clone().addScaledVector(fwd, 0.5).add(L(1.85 + LK));
  } else if (cam === 'back') {
    cpos = p.clone().addScaledVector(fwd, -5.6).addScaledVector(right, 1.0).add(L(2.6)); look = p.clone().addScaledVector(fwd, 3).add(L(1.9 + LK));
  } else if (cam === 'orbit') {
    const a = yaw + 0.6 + since * 0.35, r = inRoom ? 4.2 : 5.8;
    cpos = p.clone().add(V(Math.sin(a) * r, 1.8 + sit, Math.cos(a) * r)); look = p.clone().add(L(1.85 + LK));
  } else if (cam === 'drone') {
    const k = clamp01(since / 5), a = yaw + 0.3 + since * 0.12, r = 10 + 8 * k;
    cpos = p.clone().add(V(Math.sin(a) * r, 4 + 7 * k, Math.cos(a) * r)); look = p.clone().add(V(0, 1.4 + 3.2 * k, 0)); fov = 55;
  } else { // front: camera moves backwards in front of the character
    const d = 6.2 - 0.8 * clamp01(since / 5);
    cpos = p.clone().addScaledVector(fwd, d).addScaledVector(right, -0.6).add(L(1.7)); look = p.clone().add(L(1.9 + LK));
  }
  if (inRoom) { cpos.x = Math.max(ROOM.x - 5.6, Math.min(ROOM.x + 5.6, cpos.x)); cpos.z = Math.min(cpos.z, ROOM.z + 6.5); cpos.y = Math.min(cpos.y, 6.5); }
  else if (place === 'path') cpos.y = Math.max(cpos.y, groundY(cpos.x, cpos.z) + 0.6);
  camera.position.copy(cpos.add(wob)); camera.lookAt(look);
  camera.fov = fov + 6 * Math.exp(-since * 6) * (si > 0 ? 1 : 0); camera.updateProjectionMatrix();

  // ----- emoji above the head, 3D number beside the character
  segObjs.forEach((o, i) => {
    const vis = i === si, st = since;
    const top = head.clone().add(V(0, 0.85 + sit + 0.06 * Math.sin(t * 2.4), 0));
    if (o.label) { o.label.visible = vis;
      if (vis) { o.label.scale.setScalar(Math.max(0.01, easeOutBack(clamp01(st / 0.45))));
        o.label.position.copy(top).add(V(0, 0.15, 0));
        o.label.lookAt(camera.position); o.label.rotateY(0.2 * Math.sin(st * 1.6) + (1 - clamp01(st / 0.5)) * 2.5); } }
    if (o.emoji) { o.emoji.visible = vis;
      if (vis) { o.emoji.scale.setScalar(Math.max(0.01, easeOutBack(clamp01(st / 0.35))) * (o.label ? 0.7 : 1));
        o.emoji.position.copy(top);
        if (o.label) { const cr = V(1, 0, 0).applyQuaternion(camera.quaternion); o.emoji.position.addScaledVector(cr, 1.35).add(V(0, 0.55, 0)); } } }
  });
  composer.render();
  return true;
};
window.ready = true;
