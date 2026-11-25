// Episode: "it rains cows every Friday" (fast cut, ~1 cut / 0.9 s)
import { lib } from '../common.js';

export default function (A) {
  const { THREE, S, tw, pose, mix, mix3, ease, easeOut, clamp, rand, hero, mayor, gary, grandma, crowd, cars, sweat, mesh, rb, M, scene, prop, mower, roosters, fence, updConfetti } = A;
  const L = lib(A);
  mayor.masks.forEach(m => (m.visible = false));
  const place = (c, pos, yaw = 0, pitch = 0, roll = 0) => { c.root.position.set(...pos); c.root.rotation.set(0, 0, 0); c.root.rotateY(yaw); c.root.rotateX(pitch); c.root.rotateZ(roll); };
  const cam = (a, b, l, fov = 50, e = ease) => (u => ({ p: mix3(a, b, e(u)), l: typeof l === 'function' ? l(u) : l, fov }));
  const rot = (o, yaw) => [o[0] * Math.cos(yaw) + o[2] * Math.sin(yaw), o[1], -o[0] * Math.sin(yaw) + o[2] * Math.cos(yaw)];

  // ---------------------------------------------------------------- props
  const cows = Array.from({ length: 11 }, () => L.cow());
  const boss = cows[0], rainCows = cows.slice(1);
  const bossInner = boss.body.children[0];
  const sash = prop(mesh(rb(2.75, 2.35, 0.55, 0.12), M('#e8c547', { metalness: 0.3 }), 0, 3.0, 0.9, bossInner));
  const bossHat = prop(new THREE.Group()); bossHat.position.set(0, 0.95, 0.35); boss.head.add(bossHat);
  mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 20), M('#151515'), 0, 0, 0, bossHat); mesh(new THREE.CylinderGeometry(0.58, 0.6, 1.2, 20), M('#151515'), 0, 0.62, 0, bossHat); mesh(new THREE.CylinderGeometry(0.61, 0.61, 0.2, 20), M('#c0392b'), 0, 0.15, 0, bossHat);

  const umbs = crowd.map(c => L.umbrella(c, 1));
  const gU = [L.umbrella(grandma, 1, '#c3a6e0'), L.umbrella(grandma, -1, '#ffb3c7')]; gU[0].rotation.z = -0.38; gU[1].rotation.z = 0.38;
  const cowUmbs = rainCows.slice(0, 5).map(c => { const d = { body: c.g, armR: new THREE.Object3D() }; const u = L.umbrella(d, 1); u.position.set(0, 2.0, 1.2); return u; });

  const concrete = prop(new THREE.Group()); concrete.position.set(0, 2.55, 0); mayor.head.add(concrete);
  mesh(rb(2.3, 2.7, 2.3, 0.12), M('#a3a3a0', { roughness: 0.95 }), 0, 0, 0, concrete);
  { const r = rand(5); for (let i = 0; i < 14; i++) mesh(new THREE.BoxGeometry(0.18, 0.18, 0.05), M('#7d7d7a'), (r() - 0.5) * 1.9, (r() - 0.5) * 2.3, 1.16, concrete); }
  mesh(new THREE.BoxGeometry(0.06, 1.2, 0.05), M('#555'), 0.4, 0.3, 1.17, concrete).rotation.z = 0.5;

  const mattresses = cars.map(c => { const m = prop(new THREE.Group()); c.add(m); m.position.set(0, 3.0, -0.2); mesh(rb(2.7, 0.75, 4.8, 0.3), M('#f2f4ff'), 0, 0, 0, m); for (const z of [-1.6, 0, 1.6]) mesh(new THREE.BoxGeometry(2.74, 0.79, 0.25), M('#7fb3ff'), 0, 0, z, m); return m; });

  const sparks = L.burst(40, '#ffe14d', 0.18, 9, 7, 18, 0.5, true);
  const dust = L.burst(70, '#e8dcc6', 0.6, 10, 3, 6, 1.0);
  const dust2 = L.burst(50, '#e8dcc6', 0.45, 7, 4, 10, 0.8);
  const cat = L.cat();

  // weather studio, far away at z=200
  const WX = [0, 0, 200];
  const drawCow = (g, x, y, s) => { g.fillStyle = '#fff'; g.fillRect(x, y, 60 * s, 34 * s); g.fillRect(x + 50 * s, y - 14 * s, 26 * s, 24 * s); g.fillStyle = '#222'; g.fillRect(x + 10 * s, y + 6 * s, 16 * s, 12 * s); g.fillRect(x + 34 * s, y + 16 * s, 12 * s, 10 * s); g.fillStyle = '#fff'; for (const lx of [4, 16, 38, 50]) g.fillRect(x + lx * s, y + 34 * s, 7 * s, 14 * s); g.fillStyle = '#f7a8b8'; g.fillRect(x + 66 * s, y - 2 * s, 12 * s, 10 * s); };
  const wboard = L.board(11, 7, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2f86e6'); gr.addColorStop(1, '#9fd5ff'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffffff'; g.font = '700 44px Fredoka'; g.textAlign = 'center'; g.fillText('FRIDAY FORECAST', w / 2, 52);
    g.fillStyle = '#e9eef5'; for (const [x, y, r] of [[200, 120, 44], [250, 104, 54], [306, 122, 44], [252, 136, 40]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    drawCow(g, 120, 190, 0.9); drawCow(g, 240, 220, 0.9); drawCow(g, 340, 180, 0.9);
    g.fillStyle = '#ffe14d'; g.strokeStyle = '#000'; g.lineWidth = 8; g.font = '700 40px Fredoka'; g.strokeText('CHANCE OF MOO: 100%', w / 2, 300); g.fillText('CHANCE OF MOO: 100%', w / 2, 300);
  });
  const fridaySign = L.board(5, 2.2, (g, w, h) => { g.fillStyle = '#e63946'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '700 66px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TODAY:', w / 2, 70); g.font = '700 110px Fredoka'; g.fillText('FRIDAY', w / 2, 160); });
  const signPole = prop(mesh(new THREE.CylinderGeometry(0.15, 0.15, 6, 8), M('#555'), 0, 0, 0)); scene.add(signPole);

  // milk stand
  const stand = prop(new THREE.Group()); stand.position.set(-11.5, 0.3, 20); stand.rotation.y = Math.PI / 2; scene.add(stand);
  mesh(rb(6, 2.4, 2, 0.15), M('#ffffff'), 0, 1.2, 0, stand); mesh(new THREE.BoxGeometry(6.05, 0.5, 2.05), M('#4c8dff'), 0, 1.6, 0, stand);
  for (const x of [-2.9, 2.9]) mesh(new THREE.BoxGeometry(0.2, 5, 0.2), M('#ddd'), x, 2.5, -0.9, stand);
  mesh(new THREE.BoxGeometry(6.6, 0.4, 3.2), L.label(256, 64, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#fff' : '#4c8dff'; g.fillRect(i * w / 8, 0, w / 8, h); } }), 0, 5.1, 0.3, stand);
  { const r = rand(9); for (let i = 0; i < 46; i++) { const c = new THREE.Group(); c.position.set((r() - 0.5) * 5.4, 2.6 + Math.floor(i / 12) * 0.95 + (r() - 0.5) * 0.1, (r() - 0.5) * 1.4 + (i % 2 ? 0.3 : -0.3)); c.rotation.y = (r() - 0.5) * 0.6; stand.add(c); mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), M('#ffffff'), 0, 0, 0, c); mesh(new THREE.BoxGeometry(0.62, 0.25, 0.62), M('#3d7bff'), 0, 0.2, 0, c); } }
  const milkSign = L.board(4.4, 2, (g, w, h) => { g.fillStyle = '#fff6d6'; g.fillRect(0, 0, w, h); g.fillStyle = '#1d4ed8'; g.font = '700 110px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MILK', w / 2, 80); g.fillStyle = '#e63946'; g.font = '700 70px Fredoka'; g.fillText('FREE (please)', w / 2, 180); });

  const votePoster = L.board(7, 9, (g, w, h) => { g.fillStyle = '#1d3557'; g.fillRect(0, 0, w, h); g.fillStyle = '#e63946'; g.fillRect(0, h - 130, w, 130); drawCow(g, 140, 230, 3.0); g.fillStyle = '#fff'; g.font = '700 120px Fredoka'; g.textAlign = 'center'; g.fillText('VOTE', w / 2, 140); g.font = '700 100px Fredoka'; g.fillText('MOO', w / 2, h - 35); });
  const podium = L.podium('MOO');
  const results = L.board(10, 6.4, (g, w, h) => {
    g.fillStyle = '#10172a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '700 46px Fredoka'; g.textAlign = 'left'; g.fillText('ELECTION RESULTS', 30, 60);
    g.font = '700 40px Fredoka'; g.fillText('COW', 30, 150); g.fillStyle = '#2ecc71'; g.fillRect(170, 112, 300, 52); g.fillStyle = '#fff'; g.fillText('99%', 380, 205);
    g.fillText('MAYOR', 30, 260); g.fillStyle = '#e63946'; g.fillRect(170, 228, 6, 44); g.fillStyle = '#fff'; g.fillText('1%', 190, 262);
  });
  const law = L.board(6, 7.6, (g, w, h) => {
    g.fillStyle = '#fffaf0'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b2b2b'; g.textAlign = 'center';
    g.font = '700 74px Fredoka'; g.fillText('LAW #1', w / 2, 100); g.font = '500 42px Fredoka'; g.fillText('Every Friday,', w / 2, 210); g.fillText('it rains', w / 2, 268);
    g.font = '700 84px Fredoka'; g.fillStyle = '#e63946'; g.fillText('PEOPLE', w / 2, 362); g.fillStyle = '#555'; g.font = '500 30px Fredoka'; g.fillText('(on the cow town next door)', w / 2, 420);
  });
  const hoof = L.board(2.2, 2.2, (g, w, h) => { g.fillStyle = '#fffaf0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(w / 2 + sx * 60, h / 2, 50, 110, sx * 0.15, 0, 7); g.fill(); } });
  const cowTown = L.board(9, 3.6, (g, w, h) => { g.fillStyle = '#2f9e44'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '700 70px Fredoka'; g.fillText('WELCOME TO', w / 2, 80); g.font = '700 110px Fredoka'; g.fillText('COW TOWN', w / 2, 180); });
  const posts = [0, 1].map(() => { const p = prop(mesh(new THREE.BoxGeometry(0.4, 5, 0.4), M('#6b4226'), 0, 0, 0)); scene.add(p); return p; });
  const catapult = L.catapult();
  const nextSign = L.board(4.6, 1.8, (g, w, h) => { g.fillStyle = '#fff6d6'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.font = '700 80px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('COW TOWN →', w / 2, h / 2 + 4); });

  // ---------------------------------------------------------------- helpers
  // ambient cow rain around c
  function rain(t, c, spanX = 50, spanZ = 50, H = 48, P = 1.6, n = 10) {
    rainCows.slice(0, n).forEach((cw, i) => {
      const ph = i * P / n + ((i * 0.37) % 0.3); const tt = (t + ph) / P; const cyc = Math.floor(tt), f = tt - cyc;
      const r = rand(i * 97 + cyc * 13 + 5); const x = c[0] + (r() - 0.5) * spanX, z = c[2] + (r() - 0.5) * spanZ;
      const y = f < 0.86 ? H * (1 - f / 0.86) : 0;
      const sc = f < 0.86 ? 1 : Math.max(0.01, 1 - (f - 0.86) / 0.14);
      cw.pose({ pos: [x, c[1] + y, z], yaw: r() * 6 + t * 0.6, pitch: (r() - 0.5) * 2 + t * (r() - 0.5) * 3, roll: t * (r() - 0.5) * 3, flail: f < 0.86, t: t + i, mouth: 0.7, scale: sc });
    });
  }
  // one cow falling onto `top` and bouncing away along dir
  function bounce(cw, lt, top, dir = [1, 0], t0 = 0.28, H = 22) {
    let x = top[0], y, z = top[2];
    if (lt < t0) y = mix(top[1] + H, top[1], (lt / t0) ** 2);
    else { const k = lt - t0; x += dir[0] * k * 11; z += dir[1] * k * 11; y = top[1] + 10 * k - 15 * k * k; }
    cw.pose({ pos: [x, y, z], yaw: 1 + lt * 2, pitch: 0.3 + (lt > t0 ? (lt - t0) * 6 : 0), roll: lt * 2.5, flail: true, t: lt, mouth: lt > t0 ? 1 : 0.3 });
  }
  const umbTop = (pos, yaw, side = 1) => { const o = rot([1.5 * side, 9.9, 1.45], yaw); return [pos[0] + o[0], pos[1] + o[1], pos[2] + o[2]]; };
  const SIDE = [[7.3, 0.3, 26], [7.6, 0.3, 19], [7.0, 0.3, 12], [-7.3, 0.3, 24], [-7.5, 0.3, 15], [-7.1, 0.3, 6], [7.4, 0.3, 4], [-7.2, 0.3, 32]];
  function walkers(t, umbrellasOn = true, faces = 'smile', speed = 1) {
    crowd.forEach((c, i) => {
      const [x, y, z] = SIDE[i]; const dz = (i % 2 ? 1 : -1) * ((t * 2.2 * speed) % 12);
      pose(c, { pos: [x, y, z + dz], rot: i % 2 ? 0 : Math.PI, walk: 1.6 * speed, t: t + i, face: faces });
      if (umbrellasOn) L.holdUmb(umbs[i]);
    });
  }
  const zoom = (lt) => {};
  const sweatOn = (c, lt) => sweat.forEach((s, i) => { const k = (lt * 1.4 + i * 0.5) % 1; s.visible = true; const p = new THREE.Vector3(); c.head.getWorldPosition(p); s.position.set(p.x + (i ? 0.75 : -0.75), p.y + 1.25 - k * 0.6, p.z + 0.55); s.material.opacity = 1 - k; });

  const HERO = [12.5, 0.1, 8];
  const BOSS_LAND = [7.2, 0.1, 8];
  const FARM = [-70, 0, 30];
  const CT = [-70, 0, -70]; // cow town next door

  // ================================================================= L0  it rains cows every Friday
  S(0, { light: 'day', center: [0, 0, 10], span: 70, set(lt, u, t) { rain(t + 0.9, [0, 0, 0], 34, 50); walkers(t); },
    cam: cam([2, 2.2, 42], [1.5, 3.5, 36], [0, 13, 0], 58) });
  S(tw(0, 5), { light: 'day', center: [0, 20, 0], span: 40, set(lt, u, t) {
      cows[1].pose({ pos: [0.5, mix(25, 15, lt / 0.4), 0], yaw: 0.4 + lt, pitch: 0.4, roll: lt * 1.5, flail: true, t, mouth: 1 });
      rain(t, [0, 0, -25], 40, 20, 50, 1.6, 6);
    }, cam: () => ({ p: [0, 20, 12], l: [0, 19, 0], fov: 50 }), shake: 0.2 });
  S(tw(0, 7), { light: 'day', center: [8, 0, 14], span: 40, set(lt, u, t) {
      fridaySign.visible = signPole.visible = true; fridaySign.position.set(8.2, 6.2, 14); fridaySign.rotation.y = -Math.PI / 2 + 0.25; signPole.position.set(8.4, 3, 14);
      rain(t, [24, 0, 12], 18, 30, 40, 1.4, 6); walkers(t);
    }, cam: cam([-2, 5.2, 19], [-0.5, 5.6, 17.5], [8.2, 6, 14], 42) });
  // ================================================================= L1  not cats and dogs. cows.
  S(tw(1), { light: 'day', center: [0, 20, 0], span: 40, set(lt, u, t) {
      cat.set([0, 22 - lt * 3.5, 0], 0.3 + lt * 0.8, false, Math.sin(lt * 5) * 0.3); cat.g.rotation.x = lt * 1.2;
    }, cam: u => ({ p: [0, 21 - u * 3, 11], l: [0, 22.5 - u * 3, 0], fov: 42 }), shake: 0.1 });
  S(tw(1, 4), { light: 'day', center: [0, 0, 0], span: 30, set(lt, u, t) {
      const k = clamp(lt / 0.16); const land = lt > 0.16;
      cows[2].pose({ pos: [0, mix(22, 0.05, k * k), -1], yaw: 0.25, pitch: land ? 0 : 0.5, flail: !land, t, mouth: land ? 1 : 0.4 });
      dust.update(lt - 0.16, [0, 0.4, -1]);
      walkers(t);
    }, cam: () => ({ p: [1.2, 1.4, 8.5], l: [0, 2.6, -1], fov: 52 }), shake: 0.7, flash: true });
  // ================================================================= L2  weatherman
  const weatherman = crowd[2];
  const studio = (lt, t, face = 'grin') => {
    wboard.visible = true; wboard.position.set(0, 6, WX[2]);
    pose(weatherman, { pos: [6.2, 0.1, WX[2] + 2.5], rot: -0.5, face, point: true, t }); weatherman.armR.rotation.z = 0.6; weatherman.armR.rotation.x = -1.3 + Math.sin(t * 5) * 0.15;
  };
  S(tw(2), { light: 'day', center: WX, span: 25, set(lt, u, t) { studio(lt, t); },
    cam: cam([5, 5.2, WX[2] + 18], [4, 5.4, WX[2] + 15], [3.6, 5.2, WX[2] + 1], 50) });
  S(tw(2, 5), { light: 'day', center: WX, span: 25, set(lt, u, t) { studio(lt, t, 'smile'); },
    cam: cam([-1.2, 7.4, WX[2] + 7], [-1.0, 7.2, WX[2] + 6], [-1.0, 7.2, WX[2]], 42) });
  S(tw(2, 8), { light: 'day', center: WX, span: 25, set(lt, u, t) { studio(lt, t, 'wink'); },
    cam: cam([0, 3.3, WX[2] + 8], [0, 3.4, WX[2] + 6.5], [0, 3.4, WX[2]], 42), flash: true });
  // ================================================================= L3  steel umbrellas
  S(tw(3), { light: 'day', center: [7, 0, 14], span: 40, set(lt, u, t) {
      walkers(t); const c = crowd[1]; const p = c.root.position.toArray(); bounce(cows[3], lt + 0.05, umbTop(p, 0), [-1, 0.3]);
      rain(t, [0, 0, -10], 30, 30, 48, 1.6, 5);
    }, cam: cam([-3.5, 4.5, 30], [-2.5, 5, 27], [6.5, 6.5, 16], 50) });
  S(tw(3, 3), { light: 'day', center: [7, 0, 19], span: 25, set(lt, u, t) {
      const p = [7.6, 0.3, 19]; pose(crowd[1], { pos: p, rot: 0, face: 'grin' }); L.holdUmb(umbs[1]);
      const top = umbTop(p, 0); bounce(cows[3], lt, top, [-0.8, 0.5], 0.2, 14); sparks.update(lt - 0.2, top);
    }, cam: () => ({ p: [4.5, 3.8, 25], l: [8.5, 9.5, 20], fov: 48 }), shake: 0.5, flash: false });
  // ================================================================= L4  grandma carries two
  const gma = (t, p) => { pose(grandma, { pos: p, rot: 0.2, face: 'grin', walk: 1.4, t }); L.holdUmb(gU[0]); L.holdUmb(gU[1]); };
  S(tw(4), { light: 'day', center: [7, 0, 14], span: 30, set(lt, u, t) {
      const p = [7.3, 0.3, 10 + lt * 2]; gma(t, p); rain(t, [0, 0, 0], 30, 30, 48, 1.6, 6);
    }, cam: cam([1.5, 3.6, 24], [2.5, 4, 22], u => [7.3, 5.5, 12 + u * 2], 45) });
  S(tw(4, 3), { light: 'day', center: [7, 0, 14], span: 30, set(lt, u, t) {
      const p = [7.3, 0.3, 12]; gma(t, p); grandma.setFace('wink');
      bounce(cows[4], lt, umbTop(p, 0.2, 1), [1, 0.2], 0.2, 14); bounce(cows[5], lt - 0.12, umbTop(p, 0.2, -1), [-1, 0.2], 0.2, 14);
    }, cam: () => ({ p: [5, 6.5, 22], l: [7.3, 7.5, 12], fov: 50 }), shake: 0.4 });
  // ================================================================= L5  mayor's concrete hat
  const myr = (t, p, face = 'tired', walk = 1.3) => { pose(mayor, { pos: p, rot: Math.PI / 2 + 0.3, face, walk, t }); concrete.visible = true; };
  S(tw(5), { light: 'day', center: [0, 0, 14], span: 30, set(lt, u, t) { myr(t, [-3 + lt * 1.5, 0.1, 14]); rain(t, [0, 0, -10], 30, 20, 48, 1.6, 5); },
    cam: cam([6, 2.5, 26], [5, 3, 24], u => [-2 + u, 6, 14], 45) });
  S(tw(5, 6), { light: 'day', center: [0, 0, 14], span: 30, set(lt, u, t) {
      const p = [-1, 0.1, 14]; myr(t, p, 'tired', 0);
      const top = [p[0], 9.6, p[2]]; const k = clamp(lt / 0.18);
      if (lt < 0.18) cows[6].pose({ pos: [top[0], mix(top[1] + 18, top[1], k * k), top[2]], yaw: 0.5, flail: true, t, mouth: 1 });
      else cows[6].pose({ pos: top, yaw: 0.5, t, mouth: 0.4, look: 0.3 });
      const sq = lt < 0.18 ? 1 : 1 - 0.18 * Math.exp(-(lt - 0.18) * 6) * Math.cos((lt - 0.18) * 30);
      mayor.root.scale.set(1, sq, 1); dust2.update(lt - 0.18, [top[0], top[1], top[2]]);
    }, cam: () => ({ p: [6, 7.5, 27], l: [-1, 9.5, 14], fov: 50 }), shake: 0.6 });
  // ================================================================= L6  mattresses on cars
  const carsOnRoad = (t) => cars.forEach((c, i) => { mattresses[i].visible = true; c.position.z = c.userData.home.z + (c.userData.rot ? -1 : 1) * ((t * 4) % 20); });
  S(tw(6), { light: 'day', center: [0, 0, 10], span: 60, set(lt, u, t) { carsOnRoad(t); rain(t, [0, 0, 0], 26, 60, 48, 1.4, 8); },
    cam: cam([-6, 9, 52], [-4, 11, 46], [0, 2, 20], 50) });
  S(tw(6, 4), { light: 'day', center: [4, 0, 30], span: 25, set(lt, u, t) {
      const car = cars[0]; mattresses[0].visible = true;
      const b = Math.abs(Math.sin(lt * 7)) * 5 * Math.exp(-lt * 0.4); const top = [4.5, 3.4 + b, 30];
      cows[7].pose({ pos: top, yaw: 0.6 + lt, pitch: Math.sin(lt * 7) * 0.2, flail: b > 0.5, t, mouth: 1 });
      car.position.y = -0.2 * Math.max(0, 1 - b);
    }, cam: cam([-3, 3.5, 40], [-2.5, 4, 38], [4.5, 5, 30], 46) });
  // ================================================================= L7  nobody buys milk
  const keeper = crowd[5];
  const milk = (t, face = 'sad') => { stand.visible = true; milkSign.visible = true; milkSign.position.set(-11.4, 7.0, 20); milkSign.rotation.y = Math.PI / 2; pose(keeper, { pos: [-11.3, 0.3, 24.4], rot: Math.PI / 2 - 0.3, face }); };
  S(tw(7), { light: 'day', center: [-11, 0, 20], span: 25, set(lt, u, t) { milk(t); },
    cam: cam([4, 4.5, 26], [2.5, 4.8, 24], [-11.5, 4.2, 20], 48) });
  S(tw(7, 2), { light: 'day', center: [-11, 0, 20], span: 25, set(lt, u, t) { milk(t); },
    cam: cam([-3.5, 7, 21.5], [-4.5, 7, 21], [-11.4, 7, 20], 40) });
  S(tw(7, 3), { light: 'day', center: [-11, 0, 20], span: 25, set(lt, u, t) { milk(t, 'sad'); keeper.head.rotation.z = Math.sin(t * 3) * 0.1; sweatOn(keeper, lt); },
    cam: cam([-6.2, 4.9, 26.4], [-6.9, 4.9, 26.1], [-11.3, 4.7, 24.4], 38) });
  // ================================================================= L8  forgot umbrella
  S(tw(8), { light: 'day', center: [12, 0, 8], span: 30, set(lt, u, t) {
      pose(hero, { pos: [mix(15, HERO[0], easeOut(u)), 0.1, 8], rot: -Math.PI / 2, walk: 1.6, t, face: 'smile' }); rain(t, [-10, 0, -10], 30, 30, 48, 1.6, 5);
    }, cam: cam([3, 3.5, 16], [4, 4, 14.5], [13, 4.5, 8], 45) });
  S(tw(8, 3), { light: 'day', center: [12, 0, 8], span: 30, set(lt, u, t) {
      pose(hero, { pos: HERO, rot: -Math.PI / 2 + 0.4, face: 'shock', headPitch: 0.35 }); hero.armR.rotation.x = -1.2; hero.armR.rotation.z = 0.3;
    }, cam: cam([7.6, 4.6, 10.8], [8.2, 4.6, 10.4], [12.3, 4.4, 8.3], 44) });
  // ================================================================= L9  looked up / a cow looked down
  S(tw(9), { light: 'day', center: [12, 0, 8], span: 30, set(lt, u, t) {
      pose(hero, { pos: HERO, rot: -Math.PI / 2 + 0.4, face: 'open', headPitch: -0.7 * easeOut(lt / 0.3) });
    }, cam: cam([7.5, 2.6, 11.5], [8, 2.4, 11], [12.3, 6, 8], 50) });
  const above = [HERO[0] - 1, 40, HERO[2]];
  S(tw(9, 3), { light: 'day', center: [12, 20, 8], span: 50, set(lt, u, t) {
      boss.pose({ pos: [above[0], above[1] - lt * 3, above[2]], pitch: Math.PI / 2 - 0.1, yaw: 0.2, t, flail: true });
      rain(t, [HERO[0], 0, HERO[2]], 50, 50, 70, 2.4, 6);
    }, cam: () => ({ p: [HERO[0], 5, HERO[2] + 0.5], l: [HERO[0] - 1, 60, HERO[2] - 1], fov: 55 }) });
  S(tw(9, 5), { light: 'day', center: [12, 20, 8], span: 50, set(lt, u, t) {
      boss.pose({ pos: [above[0], above[1] - 1.2 - lt * 0.5, above[2]], pitch: Math.PI / 2 - 0.05, yaw: 0.2, t, look: 0.2 });
    }, cam: () => ({ p: [above[0] + 0.2, above[1] - 13, above[2] + 4.5], l: [above[0], above[1] + 2, above[2] + 2], fov: 42 }), dramatic: true });
  // ================================================================= L10  eye contact
  S(tw(10), { light: 'day', center: [12, 0, 8], span: 30, set(lt, u, t) { pose(hero, { pos: HERO, rot: -Math.PI / 2, face: 'shock' }); },
    cam: cam([8.6, 4.75, 8], [9.1, 4.75, 8], [12.5, 4.7, 8], 26) , dramatic: true });
  S(tw(10, 3), { light: 'day', center: [12, 20, 8], span: 50, set(lt, u, t) { boss.pose({ pos: [above[0], above[1] - 2, above[2]], pitch: Math.PI / 2, yaw: 0.2 }); },
    cam: () => { const e = new THREE.Vector3(); boss.head.updateWorldMatrix(true, true); boss.head.localToWorld(e.set(0, 0.25, 1.3)); return { p: [e.x, e.y - 4.2, e.z + 0.4], l: [e.x, e.y, e.z], fov: 30 }; }, dramatic: true });
  S(tw(10, 3) + 0.6, { light: 'day', center: [12, 0, 8], span: 30, set(lt, u, t) { pose(hero, { pos: HERO, rot: -Math.PI / 2, face: 'tired' }); sweatOn(hero, lt); },
    cam: cam([8.0, 4.75, 8], [8.6, 4.75, 8], [12.5, 4.7, 8], 32), dramatic: true });
  // ================================================================= L11  landed right in front of me. BOOM
  S(tw(11), { light: 'day', center: [10, 0, 8], span: 40, set(lt, u, t) {
      pose(hero, { pos: HERO, rot: -Math.PI / 2, face: 'shock', headPitch: -0.5 });
      boss.pose({ pos: [BOSS_LAND[0], mix(34, 12, easeOut(u)), BOSS_LAND[2]], yaw: Math.PI / 2, pitch: 0.4, flail: true, t, mouth: 1 });
    }, cam: cam([3.5, 2, -7], [4, 2.4, -5.5], u => [9.5, mix(13, 8, u), 8], 55) });
  S(tw(11, 7), { light: 'day', center: [10, 0, 8], span: 40, set(lt, u, t) {
      const k = clamp(lt / 0.12); const land = lt > 0.12;
      boss.pose({ pos: [BOSS_LAND[0], mix(12, 0.05, k * k), BOSS_LAND[2]], yaw: Math.PI / 2, mouth: land ? 0.2 : 1 });
      dust.update(lt - 0.12, [BOSS_LAND[0], 0.4, BOSS_LAND[2]]);
      if (land) { pose(hero, { pos: [HERO[0] + 1.2, 0.1, HERO[2]], rot: -Math.PI / 2, face: 'shock', sit: true }); hero.root.rotation.x = -0.25; }
      else pose(hero, { pos: HERO, rot: -Math.PI / 2, face: 'shock', headPitch: -0.4 });
    }, cam: () => ({ p: [4, 2.5, 20], l: [9.5, 3, 8], fov: 52 }), shake: 0.9, flash: true });
  // ================================================================= L12  and it said... thank you
  const heroSit = () => { pose(hero, { pos: [HERO[0] + 1.2, 0.1, HERO[2]], rot: -Math.PI / 2, face: 'shock', sit: true }); hero.root.rotation.x = -0.25; };
  S(tw(12), { light: 'day', center: [10, 0, 8], span: 40, set(lt, u, t) {
      heroSit(); boss.pose({ pos: [BOSS_LAND[0], 0.05, BOSS_LAND[2]], yaw: Math.PI / 2, stand: easeOut(clamp((lt - 0.2) / 0.6)), t, look: -0.1 });
    }, cam: cam([16, 2.2, 13], [15.5, 2.4, 12], [8, 4.5, 8], 50) });
  S(tw(12, 3), { light: 'day', center: [10, 0, 8], span: 40, set(lt, u, t) {
      boss.pose({ pos: [BOSS_LAND[0], 0.05, BOSS_LAND[2]], yaw: Math.PI / 2, stand: 1, wave: true, t, mouth: Math.abs(Math.sin(lt * 14)) * 0.9 });
    }, cam: () => { const e = new THREE.Vector3(); boss.head.updateWorldMatrix(true, true); boss.head.localToWorld(e.set(0, 0, 0.8)); return { p: [e.x + 5.5, e.y - 0.4, e.z + 1.2], l: [e.x, e.y - 0.6, e.z], fov: 40 }; } });
  // ================================================================= L13  walked into the town hall
  const strut = (p, yaw, t) => boss.pose({ pos: p, yaw, stand: 1, t, walk: 1.6 });
  S(tw(13), { light: 'day', center: [0, 0, -10], span: 50, set(lt, u, t) {
      strut([mix(3, 1, u), 0.1, mix(4, -6, u)], Math.PI, t); boss.legs[2].rotation.x += Math.sin(t * 10) * 0.4; boss.legs[3].rotation.x -= Math.sin(t * 10) * 0.4;
      crowd.forEach((c, i) => { const [x, y, z] = SIDE[i]; pose(c, { pos: [x, y, z - 22], rot: x > 0 ? -Math.PI / 2 : Math.PI / 2, face: 'shock' }); L.holdUmb(umbs[i]); });
    }, cam: cam([6, 3.5, 12], [5, 3.8, 9], u => [mix(3, 1, u), 4.5, mix(2, -8, u)], 52) });
  S(tw(13, 6), { light: 'day', center: [-20, 0, -40], span: 40, set(lt, u, t) {
      strut([mix(-11, -15.5, u), 1.0, -40], -Math.PI / 2, t); boss.legs[2].rotation.x += Math.sin(t * 10) * 0.4; boss.legs[3].rotation.x -= Math.sin(t * 10) * 0.4;
    }, cam: cam([2, 4, -30], [0, 4.5, -32], [-14, 6, -40], 50) });
  // ================================================================= L14  ran for mayor
  const hallFront = (lt, t) => { votePoster.visible = true; votePoster.position.set(-15.7, 6.5, -48.5); votePoster.rotation.y = Math.PI / 2; podium.visible = true; podium.position.set(-12.5, 1.0, -40); podium.rotation.y = Math.PI / 2; };
  S(tw(14), { light: 'day', center: [-16, 0, -44], span: 30, set(lt, u, t) { hallFront(lt, t); boss.pose({ pos: [-14.8, 1.0, -40], yaw: Math.PI / 2, stand: 1, t, mouth: Math.abs(Math.sin(lt * 12)) * 0.6 }); sash.visible = true; },
    cam: cam([4, 5, -30], [2, 5.5, -32], [-14, 6.5, -44], 50) });
  S(tw(14, 3), { light: 'day', center: [-16, 0, -44], span: 30, set(lt, u, t) { hallFront(lt, t); boss.pose({ pos: [-14.8, 1.0, -40], yaw: Math.PI / 2, stand: 1, wave: true, t, mouth: 0.6 }); sash.visible = true; bossHat.visible = true; },
    cam: cam([-5, 7.5, -38], [-6.2, 7.5, -38.5], [-14.5, 7.2, -40], 45), flash: true });
  // ================================================================= L15  it won, by a lot
  S(tw(15), { light: 'day', center: [-16, 0, -40], span: 40, set(lt, u, t) {
      hallFront(lt, t); sash.visible = bossHat.visible = true;
      boss.pose({ pos: [-14.8, 1.0, -40], yaw: Math.PI / 2, stand: 1, wave: true, t, mouth: 0.8 }); boss.g.position.y += Math.abs(Math.sin(t * 6)) * 0.8;
      crowd.forEach((c, i) => pose(c, { pos: [-6 + (i % 4) * 2.2, 0.1, -46 + Math.floor(i / 4) * 6 + (i % 2) * 2], rot: -Math.PI / 2, cheer: 2.5, t: t + i * 0.3, face: 'grin' }));
      updConfetti(lt, [-12, 0, -40], true);
    }, cam: cam([3, 14, -27], [2, 14.5, -28], [-13, 6, -41], 55) });
  S(tw(15, 2), { light: 'day', center: [0, 0, 0], span: 30, set(lt, u, t) {
      results.visible = true; results.position.set(0, 5, 0); results.rotation.y = 0;
    }, cam: cam([0, 5, 9.5], [0, 5, 8], [0, 5, 0], 45), flash: true });
  // ================================================================= L16  old mayor on the farm
  const farm = (lt, t) => {
    fence.visible = true; fence.position.set(...FARM); fence.rotation.y = 0;
    roosters.forEach((r, i) => { r.g.visible = true; r.g.position.set(FARM[0] - 6 + i * 4.5, 0, FARM[2] + 7 + (i % 2) * 2); r.g.rotation.y = 0.5 * i - 0.3; r.body.rotation.x = Math.max(0, Math.sin(t * 6 + i * 2)) * 0.6; });
  };
  S(tw(16), { light: 'day', center: [FARM[0], 0, FARM[2] + 6], span: 30, set(lt, u, t) {
      farm(lt, t); const z = FARM[2] + 4 + lt * 2;
      mower.visible = true; mower.position.set(FARM[0] + 3, 0, z + 4.3); mower.rotation.y = 0;
      pose(mayor, { pos: [FARM[0] + 3, 0.1, z], rot: 0, face: 'tired', walk: 1.2, t }); mayor.armL.rotation.x = -1.1; mayor.armR.rotation.x = -1.1; concrete.visible = true;
    }, cam: cam([FARM[0] + 14, 5, FARM[2] + 20], [FARM[0] + 12, 5.5, FARM[2] + 18], [FARM[0] + 2, 5, FARM[2] + 6], 50) });
  S(tw(16, 4), { light: 'day', center: [FARM[0], 0, FARM[2] + 6], span: 30, set(lt, u, t) {
      farm(lt, t); const p = [FARM[0] + 3, 0.1, FARM[2] + 6];
      pose(mayor, { pos: p, rot: 0.3, face: 'tired' }); concrete.visible = true;
      const r = roosters[0]; r.g.position.set(p[0], 8.1 + 0.05, p[2]); r.g.rotation.y = 0.6; r.body.rotation.x = Math.max(0, Math.sin(t * 8)) * 0.5;
    }, cam: cam([FARM[0] + 7, 6.8, FARM[2] + 14], [FARM[0] + 6.5, 6.9, FARM[2] + 13], [FARM[0] + 3, 7.4, FARM[2] + 6], 46) });
  // ================================================================= L17  new mayor signed one law
  S(tw(17), { light: 'day', center: [-16, 0, -40], span: 30, set(lt, u, t) {
      hallFront(lt, t); votePoster.visible = false; sash.visible = bossHat.visible = true;
      boss.pose({ pos: [-14.8, 1.0, -40], yaw: Math.PI / 2, stand: 1, t, look: 0.4 });
    }, cam: cam([-7, 5.5, -35], [-8, 5.8, -36], [-13.5, 5.6, -40], 45) });
  S(tw(17, 3), { light: 'day', center: [0, 0, 0], span: 20, set(lt, u, t) {
      law.visible = true; law.position.set(0, 4, 0); law.rotation.set(0, 0, 0);
      const k = clamp((lt - 0.35) / 0.12); hoof.visible = lt > 0.35; hoof.position.set(1.6, 1.4, 0.2); hoof.rotation.z = 0.3; hoof.scale.setScalar(mix(2.2, 1, k));
    }, cam: cam([0, 4, 10], [0, 4, 8.6], [0, 4, 0], 45), shake: 0 });
  // ================================================================= L18  rains people on the cow town next door
  const people = [...crowd, gary];
  function peopleRain(t, c, span = 40, H = 46, P = 1.7) {
    people.forEach((p, i) => {
      const ph = i * P / people.length; const tt = (t + ph) / P; const cyc = Math.floor(tt), f = tt - cyc; const r = rand(i * 31 + cyc * 7);
      pose(p, { face: 'shock', flail: true, t: t + i }); place(p, [c[0] + (r() - 0.5) * span, c[1] + H * (1 - f) - 2, c[2] + (r() - 0.5) * span], r() * 6 + t, t * (r() - 0.5) * 4, t * (r() - 0.5) * 3);
    });
  }
  const cowTownSet = (t, look = true) => {
    cowTown.visible = true; cowTown.position.set(CT[0], 6.2, CT[2] + 14); cowTown.rotation.y = 0;
    posts.forEach((p, i) => { p.visible = true; p.position.set(CT[0] + (i ? 4 : -4), 2.5, CT[2] + 13.8); });
    rainCows.slice(0, 5).forEach((cw, i) => { cw.pose({ pos: [CT[0] - 12 + i * 6, 0.05, CT[2] + (i % 2) * 4], yaw: 0.2 * (i - 2), look: look ? -0.6 : 0, t: t + i }); cowUmbs[i].visible = true; });
  };
  S(tw(18), { light: 'day', center: CT, span: 60, set(lt, u, t) { cowTownSet(t); peopleRain(t, [CT[0], 0, CT[2]], 34, 46, 1.6); },
    cam: cam([CT[0] + 4, 2, CT[2] + 26], [CT[0] + 3, 2.5, CT[2] + 23], [CT[0], 16, CT[2] - 6], 60) });
  S(tw(18, 5), { light: 'day', center: [0, 20, 0], span: 40, set(lt, u, t) {
      const p = crowd[1]; pose(p, { face: 'shock', flail: true, t }); place(p, [0, 26 - lt * 9, 0], 0.4, 0.5, Math.sin(lt * 4) * 0.3);
    }, cam: () => ({ p: [0, 24.5, 13], l: [0, 25.5, 0], fov: 48 }), shake: 0.2 });
  S(tw(18, 6), { light: 'day', center: CT, span: 60, set(lt, u, t) {
      cowTownSet(t); peopleRain(t + 0.4, [CT[0], 0, CT[2]], 30, 46, 1.6);
      const c = crowd[3]; const top = [CT[0] - 6 + 1.4, 10.6, CT[2] + 4 + 1.2];
      const y = lt < 0.25 ? mix(top[1] + 15, top[1], (lt / 0.25) ** 2) : top[1] + 8 * (lt - 0.25) - 14 * (lt - 0.25) ** 2;
      pose(c, { face: 'shock', flail: true, t }); place(c, [top[0] + Math.max(0, lt - 0.25) * 8, y, top[2]], lt * 3, 0, lt * 2);
    }, cam: cam([CT[0] + 9, 6, CT[2] + 24], [CT[0] + 7, 7, CT[2] + 21], [CT[0] - 4, 7, CT[2] + 4], 52) });
  // ================================================================= L19  Gary leaves tomorrow
  const CP = [-40, 0, -110];
  let CUP = new THREE.Vector3();
  const garyCat = (lt, t, face = 'sad') => {
    catapult.visible = true; catapult.position.set(...CP); catapult.rotation.y = Math.PI * 0.85; catapult.arm.rotation.x = 0;
    nextSign.visible = true; nextSign.position.set(CP[0] + 6, 4.5, CP[2] + 2); nextSign.rotation.y = -0.4;
    const cupW = new THREE.Vector3(); catapult.updateWorldMatrix(true, true); catapult.cup.localToWorld(cupW.set(0, 0, 0));
    pose(gary, { pos: [cupW.x, cupW.y - 2.0, cupW.z], rot: catapult.rotation.y + Math.PI, face, sit: true, t });
    gary.armL.rotation.x = -1.4; gary.armR.rotation.x = -1.4; gary.head.rotation.z = Math.sin(t * 2) * 0.05;
    CUP = cupW; return cupW;
  };
  S(tw(19), { light: 'day', center: CP, span: 30, set(lt, u, t) { garyCat(lt, t); },
    cam: u => ({ p: [CUP.x + 9 - u, CUP.y + 4, CUP.z + 9 - u], l: [CUP.x - 1, CUP.y + 2, CUP.z], fov: 50 }) });
  S(tw(19, 2), { light: 'day', center: CP, span: 30, set(lt, u, t) { const c = garyCat(lt, t, 'sad'); sweatOn(gary, lt); },
    cam: () => { const e = new THREE.Vector3(); gary.head.updateWorldMatrix(true, true); gary.head.localToWorld(e.set(0, 0.6, 0)); const f = new THREE.Vector3(0, 0, 1).applyQuaternion(gary.root.quaternion); return { p: [e.x + f.x * 4.2 + 0.6, e.y + 0.2, e.z + f.z * 4.2], l: [e.x, e.y, e.z], fov: 38 }; }, dramatic: true });

  // ---------------------------------------------------------------- cut energy: zoom-in landing + side kick on every cut
  A.SHOTS.forEach((sh, i) => {
    const c = sh.cam, s = i % 2 ? 1 : -1;
    sh.cam = (u, lt) => { const r = c(u, lt); const k = 1 - easeOut(clamp(lt / 0.16)); r.fov = r.fov * (1 + 0.22 * k); r.p = [r.p[0] + s * 0.6 * k, r.p[1] + 0.3 * k, r.p[2]]; return r; };
  });

  return { emph: ['cows', 'friday', 'moo', 'steel', 'umbrella', 'grandma', 'two', 'concrete', 'mattress', 'milk', 'forgot', 'cow', 'eye', 'contact', 'boom', 'thank', 'mayor', 'won', 'lot', 'farm', 'law', 'people', 'gary', 'tomorrow', 'hall'] };
}
