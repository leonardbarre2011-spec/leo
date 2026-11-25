// Episode: "say banana and you turn into one" (fast cut, ~1 cut / 0.75 s)
import { lib } from '../common.js';

export default function (A) {
  const { THREE, S, tw, pose, mix, mix3, ease, easeOut, clamp, rand, hero, mayor, gary, grandma, crowd, sweat, mesh, rb, M, scene, prop, makeChar } = A;
  const L = lib(A);
  mayor.masks.forEach(m => (m.visible = false));
  A.ROOM.children.forEach(c => { if (c.isGroup && Math.abs(c.position.z) > 3) c.visible = false; }); // no bed / nightstand: this room is a TV room
  const cam = (a, b, l, fov = 50, e = ease) => (u => ({ p: mix3(a, b, e(u)), l: typeof l === 'function' ? l(u) : l, fov }));
  const headCam = (c, dist, dx = 0, dy = 0, fov = 38) => () => { const e = new THREE.Vector3(); c.head.updateWorldMatrix(true, true); c.head.localToWorld(e.set(0, 0.62, 0)); const f = new THREE.Vector3(0, 0, 1).applyQuaternion(c.root.quaternion); const r = new THREE.Vector3(1, 0, 0).applyQuaternion(c.root.quaternion); return { p: [e.x + f.x * dist + r.x * dx, e.y + dy, e.z + f.z * dist + r.z * dx], l: [e.x, e.y, e.z], fov }; };
  const banCam = (b, dist, dx = 0, dy = 0, fov = 40) => () => { const e = new THREE.Vector3(); b.g.updateWorldMatrix(true, true); b.inner.localToWorld(e.set(0.15, 0.35, 0.9)); const f = new THREE.Vector3(0, 0, 1).applyQuaternion(b.g.quaternion); const r = new THREE.Vector3(1, 0, 0).applyQuaternion(b.g.quaternion); return { p: [e.x + f.x * dist + r.x * dx, e.y + dy, e.z + f.z * dist + r.z * dx], l: [e.x, e.y - 0.2, e.z], fov }; };
  const sweatOn = (c, lt) => sweat.forEach((s, i) => { const k = (lt * 1.4 + i * 0.5) % 1; s.visible = true; const p = new THREE.Vector3(); (c.head || c.inner).getWorldPosition(p); s.position.set(p.x + (i ? 0.8 : -0.8), p.y + (c.head ? 1.25 : 0.9) - k * 0.6, p.z + 0.6); s.material.opacity = 1 - k; });

  // ---------------------------------------------------------------- props
  const B = {
    c1: L.banana({ cap: '#118ab2' }), c3: L.banana({ cap: '#06d6a0' }), gary: L.banana({ hair: '#4a3020' }), mom: L.banana({ hair: '#a0522d' }),
    rep: L.banana({ hair: '#222', mic: true }), c0: L.banana({ hair: '#3b2a1f' }), c2: L.banana({ hair: '#111' }), c5: L.banana({ cap: '#118ab2' }),
    mayor: L.banana({ tophat: true }), gma: L.banana({ bun: '#dcdcdc' }), c7: L.banana({ cap: '#06d6a0' }), x1: L.banana({}), x2: L.banana({ cap: '#e63946' }), x3: L.banana({ hair: '#f4d03f' }),
  };
  const yel = L.burst(60, '#ffe14d', 0.3, 9, 8, 16, 0.7, true);
  const wht = L.burst(30, '#ffffff', 0.25, 7, 6, 14, 0.5, true);
  const pop = (lt, tp, ch, b, pos, yaw, o = {}) => {
    if (lt < tp) { pose(ch, { pos, rot: yaw, face: o.face || 'open', ...(o.pose || {}) }); return false; }
    b.set(pos, yaw, lt - tp, lt, o.bface || 'shock'); yel.update(lt - tp, [pos[0], pos[1] + 3, pos[2]]); wht.update(lt - tp, [pos[0], pos[1] + 3.5, pos[2]]); return true;
  };
  const talk = (c, lt, a = 'open', b = 'smile', sp = 9) => c.setFace(Math.floor(lt * sp) % 2 ? a : b);

  // grocery stand
  const stand = prop(new THREE.Group()); stand.position.set(-11.5, 0.3, 20); stand.rotation.y = Math.PI / 2; scene.add(stand);
  mesh(rb(6, 2.4, 2, 0.15), M('#ffffff'), 0, 1.2, 0, stand); mesh(new THREE.BoxGeometry(6.05, 0.5, 2.05), M('#2f9e44'), 0, 1.6, 0, stand);
  for (const x of [-2.9, 2.9]) mesh(new THREE.BoxGeometry(0.2, 5, 0.2), M('#ddd'), x, 2.5, -0.9, stand);
  mesh(new THREE.BoxGeometry(6.6, 0.4, 3.2), L.label(256, 64, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#fff' : '#2f9e44'; g.fillRect(i * w / 8, 0, w / 8, h); } }), 0, 5.1, 0.3, stand);
  const pile = L.bananaPile(40); pile.scale.setScalar(1);
  const lyt = L.board(5.6, 2.6, (g, w, h) => { g.fillStyle = '#fff6d6'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b2b2b'; g.font = '700 74px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LONG YELLOW', w / 2, 70); g.fillText('THINGS', w / 2, 150); g.fillStyle = '#e63946'; g.font = '700 50px Fredoka'; g.fillText('$1 (don\'t say it)', w / 2, 212); });

  // speech
  const podium = L.podium('MAYOR');
  const POD = [-13.2, 0, -40], MAY = [-15.3, 1.0, -40];
  const bandana = prop(new THREE.Group()); mayor.armR.add(bandana); bandana.position.set(0, -2.1, 0.3);
  mesh(rb(1.8, 1.8, 0.1, 0.04), L.label(128, 128, (g, w, h) => { g.fillStyle = '#d62828'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2 === 0) { g.beginPath(); g.arc(12 + i * 21, 12 + j * 21, 5, 0, 7); g.fill(); } }), 0, -0.9, 0, bandana);
  const unicorn = prop(new THREE.Group()); gary.head.add(unicorn); unicorn.position.set(0, 1.0, 0.75); unicorn.rotation.x = 1.2;
  { const c = mesh(new THREE.ConeGeometry(0.35, 1.0, 12), M('#f2d18b'), 0, 0.5, 0, unicorn); mesh(new THREE.SphereGeometry(0.42, 12, 10), M('#ff9ff3'), 0, -0.05, 0, unicorn); }
  const AUD = crowd.map((c, i) => [-7 + Math.floor(i / 4) * 3.2, 0.1, -45 + (i % 4) * 3.2 + (i > 3 ? 1.5 : 0)]);
  const GARY_P = [-8.4, 0.1, -40.2];
  const audience = (t, face = 'smile', skip = []) => crowd.forEach((c, i) => { if (skip.includes(i)) return; pose(c, { pos: AUD[i], rot: -Math.PI / 2 + (i % 2 ? 0.1 : -0.1), face }); });
  const speech = (t, face = 'smile') => { podium.visible = true; podium.position.set(...POD); podium.rotation.y = Math.PI / 2; pose(mayor, { pos: MAY, rot: Math.PI / 2, face }); };

  // reporter + TV
  const live = L.board(3.4, 1.4, (g, w, h) => { g.fillStyle = '#e10600'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '700 110px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('● LIVE', w / 2, h / 2 + 6); });
  const mic = prop(new THREE.Group()); crowd[6].armR.add(mic); mic.position.set(0, -1.9, 0.4); mesh(new THREE.CylinderGeometry(0.12, 0.1, 1.2, 8), M('#222'), 0, 0, 0, mic); mesh(new THREE.SphereGeometry(0.3, 10, 8), M('#444'), 0, 0.7, 0, mic); mic.rotation.x = -0.6;
  const tvDraw = (g, w, h) => { g.fillStyle = '#5b8fd6'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffe14d'; g.fillRect(150, 40, 120, 170); g.fillStyle = '#d33'; g.fillRect(0, 210, w, 90); g.fillStyle = '#fff'; g.font = '700 40px Fredoka'; g.fillText('BREAKING NEWS', 16, 252); g.font = '500 26px Fredoka'; g.fillText('reporter says the B-word on air', 16, 288); g.fillStyle = '#e10600'; g.fillRect(380, 16, 116, 44); g.fillStyle = '#fff'; g.font = '700 30px Fredoka'; g.fillText('LIVE', 405, 49); };
  const tv = L.tv(tvDraw);
  const RT = [392.6, 3.6, -0.5];
  const WATCH = [[401.6, 0, -2.4], [401.9, 0, 0.2], [401.4, 0, 2.6]];
  const room = (t, skip = []) => { tv.visible = true; tv.position.set(...RT); tv.rotation.y = Math.PI / 2; [crowd[0], crowd[2], crowd[5]].forEach((c, i) => { if (skip.includes(i)) return; pose(c, { pos: WATCH[i], rot: -Math.PI / 2, sit: true, face: 'open' }); c.root.position.y = -0.2; }); };

  // monkey + moving boxes
  const monkey = makeChar({ shirt: '#8b5a2b', pants: '#8b5a2b', skin: '#8b5a2b', face: 'grin', shoes: '#5a3a1a' }); prop(monkey.root);
  mesh(rb(1.12, 1.0, 0.1, 0.2), M('#e8c9a0'), 0, 0.55, 0.56, monkey.head);
  for (const sx of [-1, 1]) mesh(new THREE.SphereGeometry(0.34, 12, 10), M('#e8c9a0'), sx * 0.78, 0.75, 0, monkey.head);
  { const tl = mesh(new THREE.TorusGeometry(0.8, 0.14, 8, 16, 4.2), M('#8b5a2b'), 0, 2.4, -0.9, monkey.body); tl.rotation.y = Math.PI / 2; }
  const boxes = L.boxes();
  const NEXT = [-14.2, 0.1, 8];

  // street
  const STREET = [[6.5, 0.3, 4], [7.6, 0.3, 9], [-6.8, 0.3, 6], [7.2, 0.3, 14], [-7.4, 0.3, 12], [-7.0, 0.3, 18], [6.9, 0.3, 19], [-7.6, 0.3, 1]];

  // ================================================================= L0  say banana -> turn into one
  S(0, { light: 'day', center: [0, 0, 8], span: 40, set(lt, u, t) {
      B.x1.set([0.5, 0.05, 6], 0.2, 9, t, 'grin');
      crowd.forEach((c, i) => { if (i === 1) return; const [x, y, z] = STREET[i]; pose(c, { pos: [x * 0.55, 0.1, z], rot: Math.atan2(0.5 - x * 0.55, 6 - z), face: 'shock' }); });
    }, cam: cam([2, 4.5, 26], [1.5, 4.2, 20], [0.5, 3.5, 6], 50) });
  const C1 = [3.5, 0.1, 10];
  S(tw(0, 5), { light: 'day', center: [3, 0, 10], span: 25, set(lt, u, t) { pose(crowd[1], { pos: C1, rot: -0.4, face: 'smile' }); talk(crowd[1], lt); },
    cam: headCam(crowd[1], 5, 0.6, 0.1, 40) });
  S(tw(0, 9), { light: 'day', center: [3, 0, 10], span: 25, set(lt, u, t) { pop(lt, 0.06, crowd[1], B.c1, C1, -0.4); pose(crowd[0], { pos: [-0.8, 0.1, 11.5], rot: 1.2, face: lt > 0.1 ? 'shock' : 'smile' }); },
    cam: () => ({ p: [1.5, 4.5, 20], l: [2.5, 3.6, 10], fov: 48 }), shake: 0.6, flash: true });
  S(tw(0, 12), { light: 'day', center: [3, 0, 10], span: 25, set(lt, u, t) { B.c1.set(C1, -0.4, 9, t, lt > 0.35 ? 'grin' : 'shock'); },
    cam: banCam(B.c1, 5, 0.4, 0.2, 40) });
  // ================================================================= L1  no warning, just pop
  const F1 = [6.6, 0.3, 19.8], F2 = [6.6, 0.3, 22.4];
  const friends = (lt) => { pose(crowd[3], { pos: F1, rot: 0, face: 'smile' }); pose(crowd[0], { pos: F2, rot: Math.PI, face: 'smile' }); talk(crowd[3], lt, 'open', 'grin'); };
  S(tw(1), { light: 'day', center: [7, 0, 16], span: 25, set(lt, u, t) { friends(lt); },
    cam: cam([-1, 4, 23.5], [0, 4.2, 22.5], [6.6, 4.3, 21.1], 46) });
  S(tw(1, 2), { light: 'day', center: [7, 0, 16], span: 25, set(lt, u, t) { friends(lt); }, cam: headCam(crowd[3], 4.2, -0.8, 0.1, 40) });
  S(tw(1, 3), { light: 'day', center: [7, 0, 16], span: 25, set(lt, u, t) {
      pop(lt, 0.05, crowd[3], B.c3, F1, 0); pose(crowd[0], { pos: F2, rot: Math.PI, face: lt > 0.1 ? 'shock' : 'smile' });
    }, cam: () => ({ p: [-0.5, 4.2, 21.1], l: [6.6, 3.8, 21.1], fov: 48 }), shake: 0.6, flash: true });
  // ================================================================= L2  grocery store
  const groc = () => { stand.visible = true; pile.visible = true; pile.position.set(-11.5, 2.75, 20); pile.rotation.y = Math.PI / 2; pile.scale.set(1.3, 1, 1.3); lyt.visible = true; lyt.position.set(-11.4, 7.2, 20); lyt.rotation.y = Math.PI / 2; pose(crowd[7], { pos: [-11.3, 0.3, 24.4], rot: Math.PI / 2 - 0.3, face: 'wink' }); };
  S(tw(2), { light: 'day', center: [-11, 0, 20], span: 25, set() { groc(); }, cam: cam([4, 4.5, 27], [2.5, 4.8, 25], [-11.5, 4.5, 20.5], 50) });
  S(tw(2, 5), { light: 'day', center: [-11, 0, 20], span: 25, set() { groc(); }, cam: cam([-6.5, 4.5, 21.5], [-7.5, 4.2, 21], [-11.5, 2.9, 20], 40) });
  S(tw(2, 7), { light: 'day', center: [-11, 0, 20], span: 25, set() { groc(); }, cam: cam([-3.5, 7.2, 21], [-4.6, 7.2, 20.6], [-11.4, 7.2, 20], 42), flash: true });
  // ================================================================= L3  mayor's speech
  S(tw(3), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t); audience(t); pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'grin' }); },
    cam: cam([10, 11, -28], [8, 10, -31], [-11, 4, -41], 55) });
  S(tw(3, 3), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t); talk(mayor, lt); },
    cam: cam([-6, 6, -37], [-7, 6, -37.5], [-15, 5.4, -40], 45) });
  // ================================================================= L4  "we need more ban—" froze
  S(tw(4), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t); talk(mayor, lt, 'open', 'grin'); }, cam: headCam(mayor, 6, 1.2, 0.2, 40) });
  S(tw(4, 2), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t); talk(mayor, lt, 'open', 'smile'); }, cam: headCam(mayor, 4.5, -0.6, 0, 38) });
  S(tw(4, 5), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t, 'shock'); }, cam: headCam(mayor, 3.2, 0, -0.1, 34), dramatic: true });
  S(tw(4, 7), { light: 'day', center: [-12, 0, -40], span: 40, set(lt, u, t) { speech(t, 'shock'); audience(t, 'shock'); pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'smile' }); },
    cam: () => ({ p: [9, 12, -24], l: [-9, 3.5, -41], fov: 50 }), tint: 'rgba(90,140,255,0.16)' });
  // ================================================================= L5  everybody screamed
  S(tw(5), { light: 'day', center: [-4, 0, -40], span: 40, set(lt, u, t) {
      crowd.forEach((c, i) => { const [x, , z] = AUD[i]; const d = i % 2 ? 1 : -1; pose(c, { pos: [x + lt * 5, 0.1, z + d * lt * 5], rot: Math.PI / 2 + d * 0.6, face: 'shock', flail: true, walk: 3, t: t + i }); });
    }, cam: cam([8, 4, -34], [7, 4.5, -36], [-3, 4, -41], 55), shake: 0.5 });
  S(tw(5, 1) + 0.4, { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t, 'tired'); sweatOn(mayor, lt); }, cam: headCam(mayor, 4, 0.5, 0.1, 38), dramatic: true });
  // ================================================================= L6  bandanas. phew.
  S(tw(6), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t, 'open'); bandana.visible = true; mayor.armR.rotation.x = -mix(0, 2.8, easeOut(lt / 0.4)); },
    cam: cam([-6, 6, -36], [-6.5, 6.2, -37], [-15, 6, -40], 48) });
  S(tw(6, 3), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t, 'grin'); bandana.visible = true; mayor.armR.rotation.x = -2.8 + Math.sin(t * 12) * 0.15; },
    cam: cam([-6.5, 6.5, -38.5], [-7.2, 6.6, -38.8], [-15, 6.6, -40], 50), flash: true });
  S(tw(6, 4), { light: 'day', center: [-8, 0, -40], span: 40, set(lt, u, t) { speech(t, 'smile'); audience(t, 'smile'); pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'grin' }); mayor.armL.rotation.x = -2.4; mayor.armL.rotation.z = -0.5; },
    cam: cam([4, 6, -26], [2, 6.5, -28], [-9, 4.5, -41], 55) });
  // ================================================================= L7  Gary in the front row
  S(tw(7), { light: 'day', center: [-8, 0, -40], span: 40, set(lt, u, t) { audience(t); pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'grin' }); },
    cam: cam([-15, 6, -44], [-13, 5.5, -42.5], [-8.4, 4.4, -40.2], 50) });
  S(tw(7, 5), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'grin', wave: true, t }); }, cam: headCam(gary, 4.5, 0.8, 0.2, 40) });
  // ================================================================= L8  never been smart
  S(tw(8), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { pose(gary, { pos: GARY_P, rot: -Math.PI / 2 + 0.3, face: 'grin', headTilt: 0.25 }); unicorn.visible = true; },
    cam: cam([-15.5, 5.2, -36], [-14.5, 5.2, -36.5], [-8.4, 4.8, -40.2], 46) });
  S(tw(8, 4), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { pose(gary, { pos: GARY_P, rot: -Math.PI / 2 + 0.3, face: 'grin', headTilt: 0.35 + Math.sin(t * 6) * 0.1 }); unicorn.visible = true; },
    cam: headCam(gary, 4.8, 0.6, 0, 40), flash: true });
  // ================================================================= L9  "wait, you mean banana?"
  S(tw(9), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { audience(t); pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'open' }); gary.armR.rotation.z = mix(0, 2.8, easeOut(lt / 0.3)); },
    cam: cam([-16, 5, -38], [-15, 5, -38.5], [-8.4, 5, -40.2], 48) });
  S(tw(9, 2), { light: 'day', center: [-6, 0, -40], span: 30, set(lt, u, t) {
      crowd.forEach((c, i) => { const [x, y, z] = AUD[i]; const want = Math.atan2(GARY_P[0] - x, GARY_P[2] - z); pose(c, { pos: [x, y, z], rot: mix(-Math.PI / 2, want, easeOut(lt / 0.2)), face: 'shock' }); });
      pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'open' }); gary.armR.rotation.z = 2.8;
    }, cam: () => ({ p: [2, 7, -33], l: [-6, 4, -41], fov: 55 }), shake: 0.15 });
  S(tw(9, 3), { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { speech(t, 'shock'); }, cam: headCam(mayor, 3.6, -0.5, 0, 36), dramatic: true });
  S(tw(9, 5), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { pose(gary, { pos: GARY_P, rot: -Math.PI / 2, face: 'open' }); gary.armR.rotation.z = 2.8; }, cam: headCam(gary, 3.0, 0, 0, 34), dramatic: true, tint: 'rgba(255,200,0,0.12)' });
  // ================================================================= L10  POP
  S(tw(10), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) {
      pop(lt, 0.05, gary, B.gary, GARY_P, -Math.PI / 2, { pose: { face: 'open' } }); audience(t, lt > 0.1 ? 'shock' : 'open');
    }, cam: () => ({ p: [-15.5, 6, -37.5], l: [-8.4, 3.6, -40.2], fov: 50 }), shake: 0.8, flash: true });
  // ================================================================= L11  Gary was a banana
  S(tw(11), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { B.gary.set(GARY_P, -Math.PI / 2, 9, t, 'smile'); audience(t, 'shock'); },
    cam: cam([-16, 6, -44], [-15, 5.6, -43.5], [-8.4, 3.6, -40.2], 50) });
  S(tw(11, 3), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { B.gary.set(GARY_P, -Math.PI / 2, 9, t, 'grin'); }, cam: banCam(B.gary, 4.6, 0.3, 0.2, 40) });
  // ================================================================= L12  his mom screamed
  const mom = crowd[4], MOM = [-8.2, 0.1, -36.4];
  S(tw(12), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) {
      B.gary.set(GARY_P, -Math.PI / 2, 9, t, 'smile'); pose(mom, { pos: [mix(-2, MOM[0], easeOut(lt / 0.5)), 0.1, MOM[2]], rot: -Math.PI / 2 - 0.4, face: 'shock', flail: true, walk: 3, t });
    }, cam: cam([-15, 5, -32], [-14.5, 5, -32.5], [-7, 4, -38], 50), shake: 0.3 });
  S(tw(12, 3), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) {
      B.gary.set(GARY_P, -Math.PI / 2, 9, t, 'grin'); pose(mom, { pos: MOM, rot: Math.PI, face: 'shock', armsUp: 2.8, t }); mom.armL.rotation.z = -0.4; mom.armR.rotation.z = 0.4;
    }, cam: cam([-17.5, 5.5, -38.5], [-17, 5.5, -38.7], [-8.3, 4.2, -39.2], 48) });
  S(tw(12, 7), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { pose(mom, { pos: MOM, rot: -Math.PI / 2, face: 'shock' }); talk(mom, lt, 'shock', 'open', 12); }, cam: headCam(mom, 3.4, 0, 0, 36) });
  // ================================================================= L13  POP
  S(tw(13), { light: 'day', center: [-8, 0, -40], span: 30, set(lt, u, t) { B.gary.set(GARY_P, -Math.PI / 2, 9, t, 'grin'); pop(lt, 0.05, mom, B.mom, MOM, -Math.PI / 2, { pose: { face: 'shock' } }); },
    cam: () => ({ p: [-17, 5, -37], l: [-8.3, 3.5, -38.4], fov: 50 }), shake: 0.8, flash: true });
  // ================================================================= L14  news reporter, live on TV
  const rep = crowd[6], REP = [-6, 0.1, -30];
  const report = (t, lt) => { live.visible = true; live.position.set(-3.4, 7.2, -30.2); live.rotation.y = -0.3; mic.visible = true; B.gary.set(GARY_P, -Math.PI / 2, 9, t, 'smile'); B.mom.set(MOM, -Math.PI / 2, 9, t, 'shock'); };
  S(tw(14), { light: 'day', center: [-6, 0, -34], span: 30, set(lt, u, t) { report(t, lt); pose(rep, { pos: REP, rot: 0.35, face: 'grin' }); rep.armR.rotation.x = -1.3; talk(rep, lt, 'open', 'grin'); },
    cam: cam([-2.5, 5, -18], [-3, 5, -20], [-6, 4.6, -31], 48) });
  S(tw(14, 5), { light: 'day', room: true, center: [396, 0, 0], span: 20, set(lt, u, t) { tv.visible = true; tv.position.set(...RT); tv.rotation.y = Math.PI / 2; },
    cam: cam([398.5, 3.8, -0.5], [397.5, 3.7, -0.5], [RT[0], RT[1], RT[2]], 46), flash: true });
  // ================================================================= L15  POP (reporter)
  S(tw(15), { light: 'day', center: [-6, 0, -34], span: 30, set(lt, u, t) { report(t, lt); if (!pop(lt, 0.05, rep, B.rep, REP, 0.35, { pose: { face: 'open' } })) rep.armR.rotation.x = -1.3; mic.visible = lt < 0.05; },
    cam: () => ({ p: [-3, 4.6, -20], l: [-6, 3.8, -31], fov: 46 }), shake: 0.8, flash: true });
  // ================================================================= L16  whole town was watching
  S(tw(16), { light: 'day', room: true, center: [396, 0, 0], span: 20, set(lt, u, t) { room(t); },
    cam: cam([408, 6.5, 5], [407, 6.2, 4.2], [394, 3.4, -0.5], 50) });
  S(tw(16, 5), { light: 'day', room: true, center: [396, 0, 0], span: 20, set(lt, u, t) { room(t); },
    cam: cam([393.3, 4.4, 0.3], [393.6, 4.4, 0.2], [401.5, 3.6, 0.2], 60) });
  // ================================================================= L17  pop pop pop pop pop
  const P0 = tw(17, 0), P1 = tw(17, 1), P2 = tw(17, 2), P3 = tw(17, 3), P4 = tw(17, 4);
  S(P0, { light: 'day', room: true, center: [396, 0, 0], span: 20, set(lt, u, t) { room(t, [0]); pop(lt, 0.04, crowd[0], B.c0, WATCH[0], -Math.PI / 2); },
    cam: () => ({ p: [395.5, 4.6, 0.5], l: [401.6, 3.4, -2.4], fov: 44 }), shake: 0.2, flash: true });
  S(P1, { light: 'day', room: true, center: [396, 0, 0], span: 20, set(lt, u, t) { room(t, [0, 1]); B.c0.set(WATCH[0], -Math.PI / 2, 9, t); pop(lt, 0.04, crowd[2], B.c2, WATCH[1], -Math.PI / 2); },
    cam: () => ({ p: [395.5, 4.6, -1.5], l: [401.9, 3.4, 0.2], fov: 44 }), shake: 0.2, flash: true });
  S(P2, { light: 'day', center: [-12, 0, -40], span: 30, set(lt, u, t) { podium.visible = true; podium.position.set(...POD); podium.rotation.y = Math.PI / 2; pop(lt, 0.04, mayor, B.mayor, MAY, Math.PI / 2, { pose: { face: 'shock' } }); },
    cam: () => ({ p: [-5.5, 5.6, -37], l: [-15, 5, -40], fov: 46 }), shake: 0.7, flash: true });
  S(P3, { light: 'day', center: [7, 0, 10], span: 30, set(lt, u, t) { pop(lt, 0.04, grandma, B.gma, [6.8, 0.3, 10], -0.6, { pose: { face: 'shock' } }); },
    cam: () => ({ p: [1.5, 4.2, 15], l: [6.8, 3.8, 10], fov: 50 }), shake: 0.7, flash: true });
  S(P4, { light: 'day', center: [-11, 0, 20], span: 30, set(lt, u, t) { groc(); pop(lt, 0.04, crowd[7], B.c7, [-11.3, 0.3, 24.4], Math.PI / 2 - 0.3, { pose: { face: 'shock' } }); },
    cam: () => ({ p: [-3, 4.5, 28], l: [-10.5, 3.6, 23.5], fov: 52 }), shake: 0.8, flash: true });
  // ================================================================= L18  only human left
  const banTown = (t, skip = []) => {
    const spots = [[3, 6], [-3, 9], [5, 14], [-5, 3], [1, 18], [-2, 22], [6, -2], [-6, 15], [2, 26], [-4, -4], [4, 30], [-1, 1], [6.5, 21], [-6.5, 27]];
    Object.values(B).forEach((b, i) => { if (skip.includes(i)) return; const [x, z] = spots[i % spots.length]; b.set([x, 0.05, z], Math.PI + (i % 3 - 1) * 0.5, 9, t + i, i % 3 ? 'smile' : 'grin'); });
  };
  const HP = [0, 0.1, 12];
  S(tw(18), { light: 'hot', center: [0, 0, 12], span: 40, set(lt, u, t) { banTown(t); pose(hero, { pos: HP, rot: Math.PI, face: 'open' }); },
    cam: u => ({ p: [mix(2, 4, u), mix(4, 22, ease(u)), mix(-6, -12, u)], l: [0, 2, 12], fov: 55 }) });
  S(tw(18, 5), { light: 'hot', center: [0, 0, 12], span: 40, set(lt, u, t) { banTown(t); pose(hero, { pos: HP, rot: Math.PI, face: 'sad' }); },
    cam: headCam(hero, 4.6, 0.4, 0.1, 40), dramatic: true });
  // ================================================================= L19  a monkey moved in next door
  const mk = (t, face = 'grin', o = {}) => { boxes.visible = true; boxes.position.set(-12.4, 0, 4.6); boxes.rotation.y = 0.3; pose(monkey, { pos: NEXT, rot: Math.PI / 2, face, t, ...o }); };
  S(tw(19), { light: 'hot', center: [-10, 0, 8], span: 30, set(lt, u, t) { mk(t, 'smile', { pos: [mix(-15.2, -12.5, u), 0.1, 8], walk: 1.6 }); monkey.armL.rotation.x = -1.2; monkey.armR.rotation.x = -1.2; },
    cam: cam([2, 4, 2], [0.5, 4, 3], [-12, 4.2, 7.5], 46) });
  S(tw(19, 2), { light: 'hot', center: [-10, 0, 8], span: 30, set(lt, u, t) { mk(t, 'grin', { pos: [-12.5, 0.1, 8] }); }, cam: headCam(monkey, 4.2, 0.4, 0.2, 38), flash: true });
  S(tw(19, 4), { light: 'hot', center: [-6, 0, 10], span: 40, set(lt, u, t) { banTown(t); mk(t, 'grin', { pos: [-12.5, 0.1, 8], wave: true }); monkey.head.rotation.y = 0.3; },
    cam: cam([-1, 9, 27], [-2, 8.5, 25], [-9, 3.2, 9], 52) });
  S(tw(19, 7) + 0.25, { light: 'hot', center: [0, 0, 6], span: 30, set(lt, u, t) { banTown(t); B.gary.set([0, 0.05, -8], Math.PI, 9, t, 'shock'); B.gary.setFace('shock'); sweatOn(B.gary, lt); },
    cam: () => ({ p: [-0.4, 4.2, -12.8], l: [0, 4, -8], fov: 40 }), dramatic: true });

  // ---------------------------------------------------------------- cut energy: zoom-in landing + side kick on every cut
  A.SHOTS.forEach((sh, i) => {
    const c = sh.cam, s = i % 2 ? 1 : -1;
    sh.cam = (u, lt) => { const r = c(u, lt); const k = 1 - easeOut(clamp(lt / 0.16)); r.fov = r.fov * (1 + 0.22 * k); r.p = [r.p[0] + s * 0.6 * k, r.p[1] + 0.3 * k, r.p[2]]; return r; };
  });

  return { emph: ['banana', 'pop', 'warning', 'long', 'yellow', 'things', 'mayor', 'speech', 'ban', 'froze', 'screamed', 'bandanas', 'phew', 'gary', 'smart', 'wait', 'mom', 'son', 'live', 'tv', 'watching', 'human', 'monkey', 'door'] };
}
