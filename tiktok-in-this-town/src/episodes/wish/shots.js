// Episode: "everyone gets one wish on their tenth birthday"
import { lib } from '../common.js';

export default function (A) {
  const { THREE, S, tw, pose, mix, mix3, ease, easeOut, clamp, CLOCK_POS, hero, mayor, gary, grandma, crowd, mesh, rb, M, scene, prop, glow, canvasTex, faceTex, updConfetti } = A;
  const L = lib(A);
  A.PRESETS.golden = { top: '#4a5bb0', bot: '#ffb070', sun: '#ffc27a', sunI: 2.4, hs: '#c8b0e0', hg: '#6a5a40', hI: 1.0, fog: '#e8a080', elev: 0.5, az: 0.9, night: false, exp: 1.1 };
  for (const c of A.town.children) if (c.isGroup && Math.abs(c.position.x - 12.5) < 0.01 && Math.abs(c.position.z) < 0.01) c.visible = false;
  const place = (c, pos, yaw = 0, pitch = 0, roll = 0) => { c.root.position.set(...pos); c.root.rotation.set(0, 0, 0); c.root.rotateY(yaw); c.root.rotateX(pitch); c.root.rotateZ(roll); };

  // ---------------- the fountain (end of main street) -----------------
  const F = [0, 0, -118];
  const fountain = prop(new THREE.Group()); fountain.position.set(...F); scene.add(fountain);
  const stone = M('#cfc6b4'), stoneD = M('#a89f8c');
  { const ring = new THREE.Shape(); ring.absarc(0, 0, 7, 0, Math.PI * 2); const hole = new THREE.Path(); hole.absarc(0, 0, 6.1, 0, Math.PI * 2, true); ring.holes.push(hole);
    const rg = new THREE.ExtrudeGeometry(ring, { depth: 1.6, bevelEnabled: false, curveSegments: 40 }); rg.rotateX(-Math.PI / 2); mesh(rg, stone, 0, 0, 0, fountain); }
  mesh(new THREE.CylinderGeometry(6.1, 6.1, 0.2, 40), M('#8aa6b5'), 0, 0.1, 0, fountain);
  const waterMat = new THREE.MeshStandardMaterial({ color: '#4fc3f7', roughness: 0.08, transparent: true, opacity: 0.7, emissive: '#1a6fa0', emissiveIntensity: 0.25 });
  const water = mesh(new THREE.CylinderGeometry(6.1, 6.1, 0.1, 40), waterMat, 0, 1.25, 0, fountain); water.castShadow = false; water.receiveShadow = false;
  mesh(new THREE.CylinderGeometry(1.0, 1.3, 4.2, 20), stoneD, 0, 2.1, 0, fountain);
  mesh(new THREE.CylinderGeometry(2.6, 1.2, 0.8, 24), stone, 0, 4.5, 0, fountain);
  // the pillar head has a face
  const headMat = new THREE.MeshStandardMaterial({ color: '#d8cfbd', roughness: 0.6 });
  const fHead = mesh(rb(2.2, 2.2, 2.2, 0.5), headMat, 0, 6.1, 0, fountain);
  const fFaceMat = new THREE.MeshStandardMaterial({ map: faceTex('sad'), transparent: true, polygonOffset: true, polygonOffsetFactor: -2 });
  const fFace = mesh(new THREE.PlaneGeometry(1.9, 1.9), fFaceMat, 0, 6.1, 1.115, fountain); fFace.castShadow = false;
  const setFFace = (f) => { fFaceMat.map = faceTex(f); fFaceMat.needsUpdate = true; };
  const spout = mesh(new THREE.CylinderGeometry(0.25, 0.6, 2.6, 12, 1, true), new THREE.MeshStandardMaterial({ color: '#bfe9ff', transparent: true, opacity: 0.75, emissive: '#5bc0eb', emissiveIntensity: 0.3 }), 0, 8.3, 0, fountain); spout.castShadow = false;
  const coins = new THREE.Group(); fountain.add(coins);
  for (let i = 0; i < 26; i++) { const a = i * 2.39, r = 2 + (i * 37 % 37) / 37 * 3.6; const c = mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 14), M('#f5c518', { metalness: 0.8, roughness: 0.3 }), Math.cos(a) * r, 0.24, Math.sin(a) * r, coins); c.rotation.z = (i % 5) * 0.1; c.castShadow = false; }
  const plaqueMat = new THREE.MeshStandardMaterial({ map: canvasTex(512, 384, (g) => {
    g.fillStyle = '#c9a227'; g.fillRect(0, 0, 512, 384); g.fillStyle = '#2b2b2b'; g.fillRect(14, 14, 484, 356);
    g.textAlign = 'center'; g.fillStyle = '#ffd34d'; g.font = '700 54px Fredoka'; g.fillText('WISHES LEFT', 256, 90);
    g.font = '700 150px Fredoka'; g.fillStyle = '#ff4d4d'; g.fillText('0', 256, 230);
    g.font = '600 40px Fredoka'; g.fillStyle = '#ffffff'; g.fillText('REFILL: 1 COIN', 256, 320); }), roughness: 0.5, metalness: 0.3 });
  const plaque = mesh(new THREE.BoxGeometry(3, 0.12, 2.25), [stoneD, stoneD, plaqueMat, stoneD, stoneD, stoneD], 2.6, 0.26, 3.2, fountain); plaque.rotation.y = -0.5;
  const slot = mesh(new THREE.BoxGeometry(0.9, 0.05, 0.16), M('#111'), 0, 0, 0, plaque); slot.position.set(0, 0.07, -0.85);
  const fGlow = glow('#ffd54a', 26, 0.0); fGlow.position.set(0, 4, 0); fountain.add(fGlow);
  const sparkles = L.burst(80, '#fff3b0', 0.14, 4, 9, 1.5, 3.5, true);
  const flash = L.burst(60, '#ffffff', 0.25, 14, 10, 6, 1.6, true);
  const splash = L.burst(70, '#bfe9ff', 0.32, 6, 11, 20, 1.3);
  const coin = L.coin();
  const glowState = (k) => { fountain.visible = true; fGlow.material.opacity = 0.9 * k; waterMat.emissive.set(k > 0 ? '#ffb300' : '#1a6fa0'); waterMat.emissiveIntensity = 0.25 + k * 1.2; waterMat.color.set(k > 0.3 ? '#ffe082' : '#4fc3f7'); };

  // ---------------- other props -----------------
  const pool1 = L.pool(12, -8, 5, 8);
  const pool2 = L.pool(12, 6, 5, 8);
  const hats = crowd.slice(0, 4).map((c, i) => L.partyHat(c, ['#ff4d6d', '#4cc9f0', '#ffd166', '#06d6a0'][i]));
  const heroHat = L.partyHat(hero, '#c77dff');
  const jet1 = L.jetpack(grandma);
  const jet2 = L.jetpack(grandma); jet2.position.set(0, 3, 0.9); jet2.rotation.y = Math.PI;
  const bag = prop(new THREE.Group()); grandma.armR.add(bag); bag.position.set(0, -2.3, 0.3);
  mesh(rb(1.1, 1.3, 0.8, 0.1), M('#d4a373'), 0, 0, 0, bag); mesh(new THREE.SphereGeometry(0.3, 10, 8), M('#e63946'), 0.2, 0.8, 0, bag); mesh(new THREE.BoxGeometry(0.2, 0.9, 0.2), M('#ffb703'), -0.25, 0.85, 0, bag);
  const heroCoin = L.coin(); hero.armR.add(heroCoin); heroCoin.position.set(0, -2.1, 0.5); heroCoin.rotation.x = Math.PI / 2;

  const flyGrandma = (t, p, yaw, two = false) => { pose(grandma, { face: 'grin', t }); place(grandma, p, yaw, 0.35, Math.sin(t * 3) * 0.15); jet1.visible = true; jet2.visible = two; grandma.armL.rotation.z = -0.4; grandma.armR.rotation.z = 0.4; };
  const queue = (t) => crowd.slice(0, 4).forEach((c, i) => { hats[i].visible = true; pose(c, { pos: [-3 + i * 2, 0.1, F[2] + 9 + (i % 2)], rot: Math.PI + (i - 1.5) * 0.15, face: 'grin', t }); });

  // L0 — one wish on your 10th birthday
  S(0, { light: 'day', center: [0, 0, -100], span: 60, set(lt, u, t) { glowState(0); queue(t); setFFace('smile'); },
    cam: u => ({ p: mix3([0, 30, -60], [0, 18, -82], ease(u)), l: [0, 3, -118], fov: 52 }) });
  S(tw(0, 8), { light: 'day', center: [0, 0, -110], span: 30, set(lt, u, t) { glowState(0); queue(t); setFFace('smile'); crowd.slice(0, 4).forEach((c, i) => { c.armL.rotation.z = -2.6; c.armR.rotation.z = 2.6 + Math.sin(t * 10 + i) * 0.3; }); },
    cam: u => ({ p: mix3([0, 4, -97], [0, 4.2, -100], u), l: [0, 3.5, -108], fov: 50 }) });
  // L1 — throw a coin
  const throwCoin = (lt, from, to, dur = 0.7) => { const k = clamp(lt / dur); coin.visible = k < 1; coin.position.set(mix(from[0], to[0], k), mix(from[1], to[1], k) + Math.sin(k * Math.PI) * 3.5, mix(from[2], to[2], k)); coin.rotation.set(lt * 14, lt * 6, 0); return k; };
  S(tw(1), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(0); setFFace('smile'); hats[0].visible = true;
      pose(crowd[0], { pos: [2, 0.1, F[2] + 9.5], rot: Math.PI, face: 'grin' }); crowd[0].armR.rotation.x = -2.6 + easeOut(clamp(lt / 0.25)) * 1.4;
      const k = throwCoin(lt - 0.15, [2.5, 4.5, F[2] + 9], [0.8, 1.3, F[2] + 2]); splash.update(lt - 0.85, [0.8, 1.3, F[2] + 2]);
    }, cam: u => ({ p: mix3([9, 5, -98], [8, 5.5, -100], u), l: [0.5, 2.5, -112], fov: 48 }) });
  // L2 — Gary's pool, splash
  S(tw(2), { light: 'day', center: [12, 0, -8], span: 25, set(lt, u, t) {
      const pop = easeOut(clamp(lt / 0.25)); pool1.visible = true; pool1.scale.setScalar(Math.max(0.01, pop));
      const jump = clamp((lt - 1.0) / 0.5);
      pose(gary, { face: jump > 0 ? 'grin' : 'shock', cheer: jump > 0 ? 0 : 2, t }); place(gary, [mix(8, 12, jump), jump > 0 ? Math.sin(jump * Math.PI) * 4 + mix(0.3, -1.6, jump) : 0.3, -8], -Math.PI / 2 + 0.4);
      splash.update(lt - 1.5, [12, 0.5, -8]);
    }, cam: u => ({ p: mix3([1, 6, 1], [2, 5.5, 0], u), l: [11, 2.2, -8], fov: 50 }) });
  // L3 — taller hat
  S(tw(3), { light: 'day', center: [-4, 0, -10], span: 25, set(lt, u, t) {
      const k = easeOut(clamp((u - 0.3) / 0.35));
      pose(mayor, { pos: [-4, 0.1, -10], rot: 0.3, face: k > 0.5 ? 'grin' : 'smile', hatScale: 1 + k * 3.5 }); mayor.masks.forEach(m => m.visible = false);
    }, cam: u => ({ p: mix3([-1.5, 6, -1], [-1.8, 7, -2], ease(u)), l: [-4, 7, -10], fov: 48 }) });
  // L4 — grandma's jetpack / she still uses it
  S(tw(4), { light: 'day', center: [0, 0, -10], span: 40, set(lt, u, t) {
      flyGrandma(t, [mix(-14, 10, u), 9 + Math.sin(t * 2) * 0.6, -10], Math.PI / 2);
    }, cam: u => ({ p: [0, 7, 12], l: [mix(-8, 6, u), 11, -10], fov: 52 }) });
  S(tw(4, 5), { light: 'day', center: [0, 0, -10], span: 40, set(lt, u, t) {
      bag.visible = true; flyGrandma(t, [mix(10, -6, u), 7 + Math.sin(t * 2) * 0.4, -4], -Math.PI / 2);
      grandma.armR.rotation.z = 0; grandma.armR.rotation.x = -0.3;
    }, cam: u => ({ p: [2, 4, 8], l: [mix(8, -4, u), 7.5, -4], fov: 50 }) });
  // L5 — I ran to the fountain
  S(tw(5), { light: 'day', center: [0, 0, -100], span: 40, set(lt, u, t) {
      glowState(0); heroHat.visible = true; setFFace('smile');
      const z = mix(-80, -103, u); pose(hero, { pos: [0, 0.1, z], rot: Math.PI, walk: 3, t, face: 'grin' });
    }, cam: u => { const z = mix(-80, -103, u); return { p: [3, 4, z + 9], l: [0, 3, z - 4], fov: 50 }; } });
  // L6 — I threw my coin
  S(tw(6), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(0); heroHat.visible = true; setFFace('smile');
      pose(hero, { pos: [1.5, 0.1, F[2] + 9.5], rot: Math.PI, face: 'grin' }); hero.armR.rotation.x = -2.6 + easeOut(clamp(lt / 0.25)) * 1.4;
      throwCoin(lt - 0.15, [2, 4.5, F[2] + 9], [-0.8, 1.3, F[2] + 2.5]); splash.update(lt - 0.85, [-0.8, 1.3, F[2] + 2.5]);
    }, cam: u => ({ p: mix3([5, 3.5, -101], [4.5, 3.6, -102], u), l: [0, 3.5, -112], fov: 50 }) });
  // L7 — nothing happened
  S(tw(7), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(0); heroHat.visible = true; setFFace('smile');
      pose(hero, { pos: [1.5, 0.1, F[2] + 9.5], rot: Math.PI, face: 'smile', headTilt: 0.2 });
    }, cam: () => ({ p: [-8, 3.5, -99], l: [0, 3, -116], fov: 45 }), dramatic: true });
  // L8 — a tiny voice: sorry, out of wishes
  S(tw(8), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) { glowState(0); setFFace(Math.floor(t * 6) % 2 ? 'sad' : 'open'); },
    cam: u => ({ p: mix3([0, 6.6, -106], [0, 6.4, -108.5], ease(u)), l: [0, 6.1, F[2]], fov: 42 }) });
  // L9 — out of wishes?! I was the last kid in line!
  S(tw(9), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(0); heroHat.visible = true; pose(hero, { pos: [1.5, 0.1, F[2] + 9.5], rot: Math.PI - 0.4, face: lt < 0.8 ? 'shock' : 'frown', flail: lt > 0.8, t });
    }, cam: u => ({ p: mix3([-1.5, 4.6, -114], [-1, 4.5, -113], u), l: [1.5, 4.3, F[2] + 9.5], fov: 45 }), punch: true });
  // L10 — climbed into the fountain
  S(tw(10), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(0); heroHat.visible = true; setFFace('sad');
      const k = clamp(lt / 0.8); pose(hero, { face: 'frown', walk: k < 1 ? 2 : 0, t, headPitch: k >= 1 ? 0.5 : 0 });
      place(hero, [2.5, k < 1 ? Math.sin(k * Math.PI) * 2.2 + mix(0.1, 0.3, k) : 0.3, mix(F[2] + 9, F[2] + 3.6, k)], Math.PI);
    }, cam: u => ({ p: mix3([10, 6, -105], [9, 6.5, -107], u), l: [2, 2, F[2] + 3], fov: 48 }) });
  // L11 — at the bottom I found a sign
  S(tw(11), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(0); heroHat.visible = true;
      pose(hero, { pos: [3.4, 0.3, F[2] + 5.4], rot: Math.PI + 0.5, face: 'open', lean: 0.5, headPitch: 0.6 });
    }, cam: u => ({ p: mix3([12, 10, F[2] + 14], [11, 9.5, F[2] + 13], ease(u)), l: [2.8, 1.5, F[2] + 3.6], fov: 52 }) });
  // L12 — the sign close up
  S(tw(12), { light: 'day', center: [0, 0, -115], span: 30, set() { glowState(0); },
    cam: u => ({ p: mix3([2.8, 4.4, F[2] + 3.9], [2.75, 3.6, F[2] + 3.6], u), l: [2.6, 0.2, F[2] + 3.2], fov: 42 }) });
  // L13 — one coin left, I put it in
  S(tw(13), { light: 'day', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(0); heroHat.visible = true;
      pose(hero, { pos: [3.4, 0.3, F[2] + 5.4], rot: Math.PI + 0.5, face: 'smile', headPitch: 0.4 });
      if (u < 0.5) { heroCoin.visible = true; hero.armR.rotation.x = -1.6; }
      else { const k = clamp((u - 0.5) / 0.3); coin.visible = k < 1; coin.position.set(2.75, mix(2.6, 0.35, k), F[2] + 3.9 - k * 0.3); coin.rotation.set(0, 0, Math.PI / 2); hero.armR.rotation.x = -0.9; }
    }, cam: u => ({ p: mix3([10, 6.5, F[2] + 13.5], [9.5, 6.2, F[2] + 13], u), l: [3, 1.8, F[2] + 4.4], fov: 52 }) });
  // L14 — the fountain started glowing
  S(tw(14), { light: 'golden', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(easeOut(clamp(u * 1.4))); setFFace('smile'); sparkles.update(lt % 1.5, [0, 1.4, F[2]]);
      heroHat.visible = true; pose(hero, { pos: [5.5, 0.3, F[2] + 7.5], rot: Math.PI + 0.6, face: 'shock' });
    }, cam: u => ({ p: mix3([-10, 5, -96], [-8, 6, -100], ease(u)), l: [0, 4.5, F[2]], fov: 50 }), shake: 0.1 });
  // L15 — you have one wish
  S(tw(15), { light: 'golden', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(1); setFFace(Math.floor(t * 6) % 2 ? 'grin' : 'smile'); sparkles.update(lt % 1.5, [0, 1.4, F[2]]);
    }, cam: u => ({ p: mix3([0, 6.4, -107], [0, 6.2, -109], ease(u)), l: [0, 6.1, F[2]], fov: 42 }) });
  // L16 — I thought about it for a long time (time-lapse)
  S(tw(16), { light: 'day', center: [0, 0, -110], span: 30, set(lt, u, t) {
      const ph = ['day', 'sunset', 'night', 'dawn', 'day', 'sunset'][Math.min(5, Math.floor(u * 6))]; this.light = ph;
      glowState(0.6); heroHat.visible = true;
      pose(hero, { pos: [2, 0.1, F[2] + 10], rot: 0.9, face: 'frown', headTilt: 0.15 }); hero.armR.rotation.x = -2.2; hero.armR.rotation.z = -0.5;
    }, cam: u => ({ p: [8, 4.6, F[2] + 16], l: [2, 4.2, F[2] + 10], fov: 45 }) });
  // L17 — I wished that everybody gets a second wish
  S(tw(17), { light: 'golden', center: [0, 0, -115], span: 30, set(lt, u, t) {
      glowState(1); setFFace('grin'); sparkles.update(lt % 1.5, [0, 1.4, F[2]]); flash.update(u > 0.7 ? lt - (0.7 * (this._d || 2)) : -1, [0, 5, F[2]]);
      heroHat.visible = true; pose(hero, { pos: [4.5, 0.1, F[2] + 10], rot: Math.PI - 0.3, face: 'grin', cheer: 2, t });
      updConfetti(lt, [0, 0, F[2] + 6], u > 0.6);
    }, cam: u => ({ p: mix3([-5, 3.5, F[2] + 21], [-4, 4, F[2] + 18], ease(u)), l: [1, 5, F[2] + 4], fov: 52 }), tint: null });
  // L18 — Gary has two pools
  S(tw(18), { light: 'day', center: [12, 0, -1], span: 30, set(lt, u, t) {
      pool1.visible = true; pool1.scale.setScalar(1); pool2.visible = true;
      pose(gary, { pos: [10, 0.3, -1], rot: -Math.PI / 2 - 0.2, face: 'grin', cheer: 2, t });
    }, cam: u => ({ p: mix3([-1, 7, 6], [0, 6.5, 4], ease(u)), l: [12, 1.5, -1], fov: 52 }) });
  // L19 — the mayor's hat is taller than the clock tower
  S(tw(19), { light: 'day', center: [-14, 0, -40], span: 40, set(lt, u, t) {
      pose(mayor, { pos: [-12, 0.1, -46], rot: Math.PI / 2 + 0.3, face: 'grin', hatScale: 34 }); mayor.masks.forEach(m => m.visible = false);
    }, cam: u => ({ p: [2, 8, -22], l: mix3([-12, 6, -46], [-12, 26, -46], ease(u)), fov: 62 }) });
  // L20 — grandma has two jetpacks
  S(tw(20), { light: 'day', center: [0, 0, -20], span: 50, set(lt, u, t) {
      flyGrandma(t * 2.2, [Math.sin(t * 3) * 10, 14 + Math.sin(t * 5) * 4, -20 + Math.cos(t * 3) * 6], t * 3 + Math.PI / 2, true);
    }, cam: (u, lt) => { const t = (tw(20) + lt) * 2.2; return { p: [0, 9, 10], l: [Math.sin(t * 3) * 10 * 0.6, 14 + Math.sin(t * 5) * 4 * 0.6, -20 + Math.cos(t * 3) * 6 * 0.6], fov: 55 }; }, shake: 0.2 });
  // L21 — it's a lot louder in town now
  S(tw(21), { light: 'day', center: [0, 0, -15], span: 60, set(lt, u, t) {
      pool1.visible = true; pool1.scale.setScalar(1); pool2.visible = true;
      flyGrandma(t * 2.2, [Math.sin(t * 2.5) * 12, 16 + Math.sin(t * 4) * 3, -18], t * 2.5, true);
      pose(mayor, { pos: [-12, 0.1, -30], rot: Math.PI / 2, face: 'grin', hatScale: 34 }); mayor.masks.forEach(m => m.visible = false);
      pose(gary, { pos: [12, -1.4, -8], rot: -Math.PI / 2, face: 'grin', cheer: 2, t });
      pose(hero, { pos: [0, 0.1, 4], rot: 0.2, face: 'frown' }); hero.armL.rotation.z = -2.3; hero.armR.rotation.z = 2.3; hero.armL.rotation.x = -0.3; hero.armR.rotation.x = -0.3;
    }, cam: u => ({ p: mix3([0, 4.5, 14], [0, 10, 24], ease(u)), l: mix3([0, 4.5, 4], [0, 8, -14], ease(u)), fov: 55 }) });

  for (let i = 0; i < A.SHOTS.length; i++) A.SHOTS[i]._d = (A.SHOTS[i + 1] ? A.SHOTS[i + 1].start : 99) - A.SHOTS[i].start;
  return { emph: ['wish', 'tenth', 'coin', 'fountain', 'pool', 'splash', 'taller', 'hat', 'jetpack', 'nothing', 'sorry', 'zero', 'sign', 'glowing', 'one', 'second', 'two', 'pools', 'jetpacks', 'louder', 'clock', 'tower'] };
}
