// Episode: "gravity turns off every day at noon"
import { lib } from '../common.js';

export default function (A) {
  const { THREE, S, tw, pose, mix, mix3, ease, easeOut, clamp, CLOCK_POS, drawClock, hero, mayor, gary, grandma, crowd, cars, zz, mesh, rb, M, scene, prop } = A;
  const L = lib(A);
  const place = (c, pos, yaw = 0, pitch = 0, roll = 0) => { c.root.position.set(...pos); c.root.rotation.set(0, 0, 0); c.root.rotateY(yaw); c.root.rotateX(pitch); c.root.rotateZ(roll); };

  const siren = L.siren(7.4, -14);
  const mailbox = L.mailbox(10.2, 15, Math.PI / 2);
  const rope = L.rope();
  const sandwich = L.sandwich(); gary.body.add(sandwich); sandwich.position.set(0, 3.3, 1.0);
  const pool = L.pool(12, -8, 5, 8);
  const splash = L.burst(70, '#bfe9ff', 0.32, 6, 11, 20, 1.3);
  const dust = L.burst(60, '#e8dcc6', 0.55, 9, 2.5, 6, 1.0);
  const birds = [L.bird(), L.bird(), L.bird(), L.bird()];
  const cat = L.cat(); cat.g.scale.setScalar(1.35);
  const BTN = [-23.5, 11, -46.8];
  const btnG = prop(new THREE.Group()); btnG.position.set(...BTN); scene.add(btnG);
  mesh(new THREE.CylinderGeometry(2.8, 3.0, 0.6, 28), M('#7f8c8d'), 0, 0.3, 0, btnG);
  const btn = mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.9, 28), new THREE.MeshStandardMaterial({ color: '#e10600', roughness: 0.3, emissive: '#5a0000', emissiveIntensity: 0.4 }), 0, 0.9, 0, btnG);
  const btnSign = L.sign(4.2, 1.4, 'GRAVITY', '#fff6d6', '#c0392b', 130);
  const pillow = prop(mesh(rb(3.2, 0.9, 2.4, 0.4), M('#f7f3ff'), -28.3, BTN[1] + 0.45, -46.8)); scene.add(pillow);

  const crowdHome = crowd.map((c, i) => [-6 + (i % 4) * 4 + (i > 3 ? 2 : 0), 0.1, -18 - Math.floor(i / 4) * 5 - (i % 2) * 1.5]);
  // floating everybody, k = 0..1 how much they've risen
  function floatTown(t, k) {
    crowd.forEach((c, i) => {
      const [x, y, z] = crowdHome[i];
      pose(c, { face: i % 3 === 0 ? 'shock' : 'grin', flail: true, t: t + i });
      place(c, [x + Math.sin(t * 0.7 + i) * 0.6, y + k * (4 + (i % 3) * 2.5) + Math.sin(t * 1.4 + i) * 0.4 * k, z], i * 0.7 + t * 0.3 * k, Math.sin(t * 0.8 + i) * 0.6 * k, Math.cos(t * 0.6 + i) * 0.5 * k);
    });
    cars.forEach((c, i) => { c.position.y = k * (3 + (i % 3) * 2) + Math.sin(t * 1.1 + i) * 0.3 * k; c.rotation.x = Math.sin(t * 0.5 + i) * 0.4 * k; c.rotation.z = Math.cos(t * 0.4 + i) * 0.3 * k; });
  }
  function groundTown(t) { crowd.forEach((c, i) => pose(c, { pos: crowdHome[i], rot: Math.PI + (i - 3.5) * 0.1, face: 'smile' })); }

  const sw = (lt) => { siren.visible = true; siren.light.material.emissiveIntensity = (Math.floor(lt * 6) % 2) ? 2.5 : 0.2; siren.glow.visible = Math.floor(lt * 6) % 2 === 1; };

  // L0
  S(0, { light: 'day', center: [0, 0, -20], span: 90, set(lt, u, t) { floatTown(t, 0.3 + 0.7 * easeOut(lt / 1.5)); },
    cam: u => ({ p: mix3([18, 20, 16], [12, 24, 2], ease(u)), l: [0, 5, -24], fov: 55 }) });
  S(tw(0, 7), { light: 'day', center: [-20, 0, -40], span: 50, set() { drawClock(12, 0); },
    cam: u => ({ p: mix3([CLOCK_POS[0] + 20, CLOCK_POS[1] - 5, CLOCK_POS[2] + 7], [CLOCK_POS[0] + 13, CLOCK_POS[1] - 3, CLOCK_POS[2] + 4], easeOut(u)), l: CLOCK_POS, fov: 40 }) });
  S(tw(0, 10), { light: 'day', center: [0, 0, -20], span: 40, set(lt, u, t) { floatTown(t, 1); },
    cam: u => ({ p: mix3([0, 2.5, 2], [0, 3.5, -2], ease(u)), l: [0, 8, -22], fov: 55 }) });
  // L1 siren
  S(tw(1), { light: 'day', center: [7, 0, -14], span: 30, set(lt) { sw(lt); groundTown(lt); },
    cam: u => ({ p: mix3([0, 4, -2], [1, 5, -5], u), l: [7.4, 8.5, -14], fov: 50 }), shake: 0.15 });
  S(tw(1, 4), { light: 'day', center: [0, 0, -20], span: 40, set(lt, u, t) {
      crowd.forEach((c, i) => { const [x, y, z] = crowdHome[i]; const tx = x < 0 ? -8.9 : 8.9; pose(c, { pos: [mix(x, tx * 0.85, easeOut(lt / 0.8)), y, z], rot: x < 0 ? -Math.PI / 2 : Math.PI / 2, walk: 3, t: t + i, face: 'shock' }); });
    }, cam: u => ({ p: mix3([0, 5, -2], [0, 6, -6], u), l: [0, 2, -22], fov: 55 }) });
  // L2 mayor hugs lamp post (lamp at -8.9, -12)
  S(tw(2), { light: 'day', center: [-9, 0, -12], span: 25, set(lt, u, t) {
      const k = easeOut(lt / 0.6);
      pose(mayor, { face: 'shock', armsUp: 2.9 }); mayor.masks.forEach(m => m.visible = false);
      mayor.legL.rotation.x = Math.sin(t * 6) * 0.4; mayor.legR.rotation.x = -Math.sin(t * 6) * 0.4;
      place(mayor, [-8.9 + 5.4, 4.6 + Math.sin(t * 2) * 0.2, -12], -Math.PI / 2, mix(0.2, Math.PI / 2 - 0.15, k));
    }, cam: u => ({ p: mix3([-7, 5.5, 4], [-6.5, 5.8, 1], ease(u)), l: [-6.2, 5, -12], fov: 48 }) });
  // L3 grandma tied to the mailbox
  S(tw(3), { light: 'day', center: [10, 0, 15], span: 25, set(lt, u, t) {
      mailbox.visible = true;
      const p = [10.2 + Math.sin(t * 1.2) * 0.8, 6.5 + Math.sin(t * 1.7) * 0.4, 15 + Math.cos(t * 0.9) * 0.6];
      pose(grandma, { face: 'grin', wave: true, t }); place(grandma, p, -Math.PI / 2 + Math.sin(t) * 0.3, Math.sin(t * 0.8) * 0.25, 0.2);
      L.stretch(rope, [10.2, 3.3, 15], [p[0], p[1] + 2.2, p[2]]);
    }, cam: u => ({ p: mix3([-6, 5, 29], [-4, 5.5, 27], ease(u)), l: [10, 7.5, 15], fov: 52 }) });
  // L4 Gary + sandwich
  S(tw(4), { light: 'day', center: [12, 0, -8], span: 25, set(lt, u, t) {
      sandwich.visible = true;
      pose(gary, { face: 'grin', armsUp: 1.25 }); place(gary, [11, 4.5 + Math.sin(t * 1.5) * 0.3, -8], -1.06 + Math.sin(t) * 0.25, 0.15 * Math.sin(t), 0.2);
      gary.setFace(Math.floor(lt * 4) % 2 ? 'grin' : 'open');
    }, cam: u => ({ p: mix3([2, 6.5, -3], [4, 7, -4.5], u), l: [11, 7.2, -8], fov: 45 }) });
  // L5 whole town floats
  S(tw(5), { light: 'day', center: [0, 0, -20], span: 90, set(lt, u, t) { floatTown(t, 1); mayor.root.visible = false; },
    cam: u => ({ p: mix3([0, 6, 8], [0, 26, 22], ease(u)), l: mix3([0, 7, -20], [0, 4, -30], ease(u)), fov: 55 }) });
  // L6 yesterday, I forgot
  S(tw(6), { light: 'day', center: [9, 0, 2], span: 25, set(lt, u, t) {
      groundTown(t);
      pose(hero, { pos: [8.2, 0.3, 2], rot: -Math.PI / 2 + 0.5, face: lt > 0.7 ? 'shock' : 'smile' });
    }, cam: u => ({ p: mix3([2, 4, 8], [4, 4.5, 6], ease(u)), l: [8.2, 4, 2], fov: 45 }), punchAt: 0.75 });
  // L7 tying my shoes / and then / whoosh
  const crouch = (lt) => { pose(hero, { pos: [8.2, -0.5, 2], rot: -Math.PI / 2 + 0.5, face: 'smile', lean: 0.55 }); hero.legL.rotation.x = -1.4; hero.legR.rotation.x = 0.5; hero.armL.rotation.x = 0.4 + Math.sin(lt * 18) * 0.15; hero.armR.rotation.x = 0.4 - Math.sin(lt * 18) * 0.15; hero.head.rotation.x = 0.4; };
  S(tw(7), { light: 'day', center: [9, 0, 2], span: 25, set(lt) { crouch(lt); },
    cam: u => ({ p: mix3([0, 3, 9], [0.8, 2.8, 8.2], u), l: [8.2, 1.2, 2], fov: 42 }) });
  S(tw(7, 5), { light: 'day', center: [9, 0, 2], span: 25, set(lt) { crouch(lt); hero.setFace('open'); siren.visible = false; },
    cam: () => ({ p: [0.8, 2.8, 8.2], l: [8.2, 1.2, 2], fov: 42 }), dramatic: true });
  S(tw(7, 7), { light: 'day', center: [9, 0, 2], span: 40, set(lt, u, t) {
      const y = easeOut(lt / 0.7) * 16;
      pose(hero, { face: 'shock', flail: true, t }); place(hero, [8.2, -0.5 + y, 2], -Math.PI / 2 + 0.5 + lt * 2, 0, lt * 0.8);
    }, cam: u => ({ p: [2, 3, 10], l: [8.2, mix(2, 14, easeOut(u * 1.2)), 2], fov: 55 }), shake: 0.4 });
  // L8 past roofs / birds / clock tower
  S(tw(8), { light: 'day', center: [10, 0, -24], span: 40, set(lt, u, t) {
      pose(hero, { face: 'shock', flail: true, t }); place(hero, [12, 9 + lt * 2.5, -22], -Math.PI / 2 + t * 0.5, 0.3, 0.2);
    }, cam: u => ({ p: [3, 13 + u * 2, -14], l: [14, 11 + u * 2, -24], fov: 50 }) });
  S(tw(8, 4), { light: 'day', center: [10, 0, -24], span: 40, set(lt, u, t) {
      pose(hero, { face: 'open', flail: true, t }); place(hero, [8, 15 + lt * 1.5, -24], t * 0.6, 0.4, -0.3);
      birds.forEach((b, i) => { b.g.visible = true; b.flap(t + i); b.g.position.set(8 + Math.cos(t * 2 + i * 1.6) * 3.5, 17 + lt * 1.5 + Math.sin(t * 3 + i) * 1.2, -24 + Math.sin(t * 2 + i * 1.6) * 3.5); b.g.rotation.y = -t * 2 - i * 1.6; });
    }, cam: u => ({ p: [0, 18 + u, -15], l: [8, 17 + u, -24], fov: 50 }) });
  S(tw(8, 7), { light: 'day', center: [-20, 0, -40], span: 50, set(lt, u, t) {
      drawClock(12, 1);
      pose(hero, { face: 'shock', flail: true, t }); place(hero, [-15.5, 15.5 + lt * 2, -36.5], t * 0.5, 0.5, 0.3);
    }, cam: u => ({ p: [-2, 17 + u * 2, -30], l: [-18, 18 + u, -39], fov: 50 }) });
  // L9 from up there
  S(tw(9), { light: 'day', center: [0, 0, -40], span: 110, set(lt, u, t) {
      floatTown(t, 1);
      pose(hero, { face: 'open', flail: true, t: t * 0.3 }); place(hero, [-1, 49, -28], 0.6, Math.PI / 2 - 0.2, 0.2);
    }, cam: u => ({ p: mix3([-6, 56, -22], [-6, 54, -24], u), l: [-14, 8, -44], fov: 55 }) });
  // L10 the giant red button on the town hall
  const roofCam = (a, b, f = 45) => (u => ({ p: mix3(a, b, ease(u)), l: [BTN[0], BTN[1] + 1.2, BTN[2]], fov: f }));
  const showBtn = (press = 0) => { btnG.visible = true; btn.position.y = 0.9 - press * 0.45; btnSign.visible = true; btnSign.position.set(BTN[0] - 2.5, BTN[1] + 1.2, BTN[2] + 3.6); btnSign.rotation.y = 0.35; };
  S(tw(10), { light: 'day', center: [-26, 10, -44], span: 30, set(lt) { showBtn(0); drawClock(12, 0); },
    cam: roofCam([-10, 24, -64], [-15, 18, -58]) });
  // L11 cat sleeping on it
  const zzz = (lt, p) => zz.forEach((s, i) => { const k = ((lt * 0.8 + i / 3) % 1); s.visible = true; s.position.set(p[0] + k * 1.5, p[1] + 2.5 + k * 2.5, p[2] + 0.6); s.scale.setScalar(0.5 + k * 0.9); s.material.opacity = 1 - k; });
  S(tw(11), { light: 'day', center: [-26, 10, -44], span: 30, set(lt) {
      showBtn(1); cat.set([BTN[0], BTN[1] + 1.35, BTN[2]], Math.PI - 0.5, true); cat.body.scale.y = 1 + Math.sin(lt * 4) * 0.04; zzz(lt, [BTN[0], BTN[1] + 1, BTN[2]]);
    }, cam: roofCam([-21, 15.5, -54], [-22, 14.8, -52.5], 42) });
  S(tw(12), { light: 'day', center: [-26, 10, -44], span: 30, set(lt) {
      drawClock(12, 0); showBtn(1); cat.set([BTN[0], BTN[1] + 1.35, BTN[2]], Math.PI - 0.5, true); cat.body.scale.y = 1 + Math.sin(lt * 4) * 0.04; zzz(lt, [BTN[0], BTN[1] + 1, BTN[2]]);
    }, cam: u => ({ p: mix3([-6, 17, -56], [-8, 16, -54], u), l: [-21, 14, -44], fov: 50 }) });
  // L13 rolls over
  S(tw(13), { light: 'day', center: [-26, 10, -44], span: 30, set(lt, u) {
      const k = easeOut(clamp((u - 0.45) / 0.4));
      showBtn(1 - k); cat.set([BTN[0] + k * 3.4, BTN[1] + 1.35 - k * 0.7, BTN[2]], Math.PI - 0.5, k < 0.5, k * Math.PI / 2);
    }, cam: roofCam([-19, 15, -55], [-19.5, 14.5, -54], 45) });
  // L14 BOOM gravity's back
  S(tw(14), { light: 'day', center: [0, 0, -20], span: 40, set(lt, u, t) {
      const k = 1 - easeOut(clamp(lt / 0.22)); floatTown(t, k); dust.update(lt - 0.18, [0, 0.3, -20]);
    }, cam: u => ({ p: [0, 4, 0], l: [0, 3, -20], fov: 55 }), shake: 0.6 });
  // L15 into Gary's pool
  S(tw(15), { light: 'day', center: [12, 0, -8], span: 25, set(lt, u, t) {
      pool.visible = true;
      const fall = clamp(lt / 0.55); const y = mix(14, -0.6, fall * fall);
      pose(hero, { face: fall < 1 ? 'shock' : 'sad', flail: fall < 1, t }); place(hero, [12, y, -8], -Math.PI / 2 + 0.6, 0, fall < 1 ? lt * 3 : 0);
      splash.update(lt - 0.55, [12, 0.5, -8]);
    }, cam: u => ({ p: [3, 4.5, -2], l: [12, 3, -8], fov: 50 }), shake: 0.1 });
  // L16 nobody believed me
  S(tw(16), { light: 'day', center: [0, 0, -14], span: 30, set(lt, u, t) {
      pose(hero, { pos: [0, 0.1, -8], rot: Math.PI, face: 'open', point: true, t });
      crowd.slice(0, 5).forEach((c, i) => pose(c, { pos: [-5 + i * 2.5, 0.1, -14 - (i % 2)], rot: (i - 2) * 0.12, face: lt > 1 ? 'frown' : 'smile', push: true }));
      crowd.slice(0, 5).forEach(c => { c.armL.rotation.z = 0.9; c.armR.rotation.z = -0.9; });
    }, cam: u => ({ p: mix3([7, 3.5, -3], [6, 3.8, -4.5], u), l: [-1, 3.5, -12], fov: 50 }) });
  // L17 11:59 + pillow
  S(tw(17, 5), { light: 'day', center: [-20, 0, -40], span: 50, set() { drawClock(11, 59); },
    cam: u => ({ p: mix3([CLOCK_POS[0] + 20, CLOCK_POS[1] - 5, CLOCK_POS[2] + 7], [CLOCK_POS[0] + 14, CLOCK_POS[1] - 3, CLOCK_POS[2] + 4], easeOut(u)), l: CLOCK_POS, fov: 40 }) });
  S(tw(17, 8), { light: 'day', center: [-26, 10, -44], span: 30, set(lt, u) {
      showBtn(0); pillow.visible = true;
      const k = easeOut(clamp(u / 0.5));
      pose(hero, { pos: [-30.2, 11, -49], rot: Math.PI - 0.7, face: 'grin', push: true });
      pillow.position.set(-28.3, BTN[1] + 0.45 + (1 - k) * 2.5, -46.8);
      cat.set([-28.3, BTN[1] + 0.9, -47.1], Math.PI - 0.3, u > 0.6);
    }, cam: u => ({ p: mix3([-33, 17, -61], [-32, 16.5, -59], ease(u)), l: [-28.5, 12.8, -47.5], fov: 50 }) });
  // L18 hasn't floated since
  S(tw(18), { light: 'day', center: [0, 0, -30], span: 110, set(lt, u, t) { groundTown(t); },
    cam: u => ({ p: mix3([-24, 30, 30], [-18, 34, 20], u), l: [0, 4, -30], fov: 55 }) });
  // L19 Gary is very disappointed
  S(tw(19), { light: 'day', center: [12, 0, -8], span: 25, set(lt, u, t) {
      pool.visible = true; sandwich.visible = true;
      pose(gary, { pos: [9.5, 0.3, -2.5], rot: -Math.PI / 2 - 0.4, face: 'sad', armsUp: 1.0, headPitch: 0.25 });
    }, cam: u => ({ p: mix3([2.5, 5, -0.5], [4.5, 4.8, -1.4], ease(u)), l: [9.5, 4.6, -2.5], fov: 42 }) });

  // generic: punch-in at a fraction of a shot
  for (const sh of A.SHOTS) if (sh.punchAt) { const c = sh.cam; sh.cam = (u, lt) => { const r = c(u, lt); if (u > sh.punchAt) r.fov *= 0.82; return r; }; }

  return { emph: ['gravity', 'noon', 'sixty', 'siren', 'mayor', 'grandma', 'gary', 'sandwich', 'floats', 'forgot', 'whoosh', 'button', 'cat', 'boom', 'pool', 'pillow', 'eleven', 'fifty', 'nine', 'disappointed', 'red'] };
}
