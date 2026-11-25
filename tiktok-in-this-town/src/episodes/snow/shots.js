// Episode: "it only snows on one house. Mine."
import { lib } from '../common.js';

export default function (A) {
  const { THREE, S, tw, pose, mix, mix3, ease, easeOut, clamp, hero, mayor, gary, grandma, crowd, houses, sweat, mesh, rb, M, scene, prop, rand } = A;
  const L = lib(A);
  for (const c of A.town.children) if (c.isGroup && Math.abs(c.position.x - 12.5) < 0.01 && Math.abs(c.position.z - 16) < 0.01) c.visible = false;

  // --- snow dressing for a house (roof slabs, yard, snowman) -------------------------
  function snowCover(house) {
    const h = house.children[0].geometry.parameters.height;
    const g = prop(new THREE.Group()); house.add(g);
    const white = M('#f6f9ff', { roughness: 0.9 });
    for (const sx of [-1, 1]) { const sl = mesh(new THREE.BoxGeometry(7.2, 0.4, 10.4), white, sx * 2.95, h + 2.05, 0, g); sl.rotation.z = -sx * 0.572; }
    mesh(new THREE.BoxGeometry(9, 0.25, 16), white, 0, 0.13, 9, g).rotation.y = 0;  // yard in front (local +z)
    return g;
  }
  const heroSnow = snowCover(houses['R8']);
  const garySnow = snowCover(houses['R-8']);
  const pile = prop(mesh(rb(3, 1.4, 3, 0.7), M('#f6f9ff', { roughness: 0.9 }), 9.5, 0.4, 3)); scene.add(pile);
  const snowman = prop(new THREE.Group()); scene.add(snowman); snowman.position.set(13, 0, 3.2);
  { const w = M('#ffffff', { roughness: 0.9 }); mesh(new THREE.SphereGeometry(1.4, 20, 14), w, 0, 1.3, 0, snowman); mesh(new THREE.SphereGeometry(1.0, 20, 14), w, 0, 3.2, 0, snowman); mesh(new THREE.SphereGeometry(0.72, 20, 14), w, 0, 4.6, 0, snowman);
    const n = mesh(new THREE.ConeGeometry(0.14, 0.8, 10), M('#ff7f11'), 0, 4.6, 0.95, snowman); n.rotation.x = Math.PI / 2;
    for (const ex of [-0.25, 0.25]) mesh(new THREE.SphereGeometry(0.09, 8, 6), M('#111'), ex, 4.85, 0.62, snowman);
    for (const sx of [-1, 1]) { const a = mesh(new THREE.BoxGeometry(1.8, 0.12, 0.12), M('#6b4226'), sx * 1.6, 3.4, 0, snowman); a.rotation.z = sx * 0.5; }
    mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16), M('#222'), 0, 5.25, 0, snowman); }
  snowman.rotation.y = -Math.PI / 2;
  const snow = L.snow(20, 8, 22, 20, 24, 900);
  const cloud = L.cloud(true);
  const shovel = prop(new THREE.Group()); hero.armR.add(shovel); shovel.position.set(0, -2.0, 0.2);
  mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), M('#8a5a2b'), 0, -0.6, 0.6, shovel).rotation.x = 1.1;
  mesh(new THREE.BoxGeometry(1.2, 0.08, 1.0), M('#e63946'), 0, -1.4, 2.0, shovel);
  const heroScarves = [L.scarf(hero, '#e63946', 0), L.scarf(hero, '#2a9d8f', 1), L.scarf(hero, '#f4a261', 2)];
  heroScarves.forEach((s, i) => s.position.y = 0.05 + i * 0.22);
  const garyScarf = L.scarf(gary, '#457b9d', 0); garyScarf.position.y = 0.05;
  const knit = prop(new THREE.Group()); grandma.body.add(knit); knit.position.set(0, 2.6, 1.3);
  for (const sx of [-0.3, 0.3]) { const n = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 6), M('#bbb'), sx, 0.4, 0, knit); n.rotation.z = sx * 1.6; }
  const knitScarf = mesh(rb(0.9, 1, 0.15, 0.05), M('#2a9d8f'), 0, 0, 0, knit);

  const pool = L.pool(-12, 8, 5, 9);
  const veg = prop(new THREE.Group()); scene.add(veg);
  { const r = rand(3); for (let i = 0; i < 18; i++) mesh(rb(0.5, 0.35, 0.5, 0.1), M(i % 3 ? '#ff8c1a' : '#6ab04c'), -12 + (r() - 0.5) * 4, 0.5, 8 + (r() - 0.5) * 8, veg); }
  const thermo = L.thermo();
  const truck = L.truck('#9be7ff');
  const stand = prop(new THREE.Group()); scene.add(stand); stand.position.set(11, 0, 15.5);
  mesh(rb(1.8, 2.4, 4.6, 0.15), M('#4cc9f0'), 0, 1.2, 0, stand);
  mesh(rb(2.1, 0.25, 5.0, 0.1), M('#ffffff'), 0, 2.5, 0, stand);
  for (const z of [-2.2, 2.2]) mesh(new THREE.BoxGeometry(0.2, 3.4, 0.2), M('#ffffff'), 0.6, 4.1, z, stand);
  const standSign = L.sign(5.2, 1.6, 'SNOW CONES $1', '#ffffff', '#e63946', 82);
  const money = L.money();
  const cones = [0, 1, 2, 3].map(i => { const c = L.cone(['#ff4d6d', '#4cc9f0', '#ffd166', '#06d6a0'][i]); scene.add(c); return c; });
  const handCone = (c, char, arm, i) => { const k = cones[i]; k.visible = true; char[arm].add(k); k.position.set(0, -2.05, 0.45); k.rotation.set(-0.6, 0, 0); };

  const queue = crowd.map((c, i) => [14.0 - i * 1.9, 0.3, 8 + (i % 2) * 0.3]);
  const SNOWY = (t, x = 20, z = 8) => { cloud.visible = true; cloud.position.set(x, 21 + Math.sin(t * 0.8) * 0.4, z); snow.update(t, x, z); };
  const dressed = (k = 1) => { heroSnow.visible = true; pile.visible = true; snowman.visible = true; heroScarves[0].visible = true; };
  const swt = (t, c, yoff = 6.4) => sweat.forEach((s, i) => { const k = ((t * 1.3 + i / 2) % 1); s.visible = true; const p = c.root.position; s.position.set(p.x + (i ? 0.85 : -0.85), p.y + yoff - k * 1.2, p.z + 0.6); s.material.opacity = 1 - k * 0.6; });

  // L0 — one snowy house
  S(0, { light: 'hot', center: [10, 0, 6], span: 70, set(lt, u, t) { SNOWY(t); dressed(); pool.visible = true; },
    cam: u => ({ p: mix3([-8, 30, 38], [-4, 26, 30], ease(u)), l: [18, 6, 8], fov: 52 }) });
  S(tw(0, 9), { light: 'hot', center: [12, 0, 8], span: 30, set(lt, u, t) {
      SNOWY(t); dressed();
      pose(hero, { pos: [11.5, 0.3, 9.5], rot: -Math.PI / 2 - 0.4, wave: true, t, face: 'grin' });
    }, cam: u => ({ p: mix3([3, 4.5, 12], [5, 4.3, 11], easeOut(u)), l: [11.5, 4.2, 9.5], fov: 45 }) });
  // L1 — July, everyone at the pool
  const poolParty = (t, face = 'grin', soup = false) => {
    pool.visible = true; pool.water.material.color.set(soup ? '#d1771e' : '#29b6f6'); pool.water.material.emissive.set(soup ? '#5a2a00' : '#0a5f8a'); veg.visible = soup;
    crowd.slice(0, 5).forEach((c, i) => pose(c, { pos: [-13.5 + (i % 3) * 1.6, -1.6 + Math.sin(t * 2 + i) * 0.15, 5 + i * 1.6], rot: Math.PI / 2 + (i - 2) * 0.2, face, cheer: soup ? 0 : 0, t }));
    crowd.slice(0, 5).forEach((c, i) => { if (!soup) { c.armL.rotation.z = -2.6 - Math.sin(t * 5 + i) * 0.2; c.armR.rotation.z = 2.6 + Math.sin(t * 5 + i) * 0.2; } });
  };
  S(tw(1), { light: 'hot', center: [0, 0, 8], span: 40, set(lt, u, t) {
      SNOWY(t); dressed(); poolParty(t);
      pose(hero, { pos: [11, 0.3, 8], rot: -Math.PI / 2, face: 'sad', t });
    }, cam: u => ({ p: mix3([13.5, 8, 13], [13, 7.5, 12], u), l: [-10, 1, 7], fov: 50 }) });
  // L2 — shoveling
  S(tw(2), { light: 'hot', center: [12, 0, 6], span: 30, set(lt, u, t) {
      SNOWY(t); dressed(); shovel.visible = true;
      const sw = Math.sin(t * 6);
      pose(hero, { pos: [10.5, 0.3, 4.5], rot: -Math.PI / 2 - 0.3, face: 'sad', lean: 0.3 + sw * 0.1 });
      hero.armR.rotation.x = -0.6 + sw * 0.5; hero.armL.rotation.x = -0.9 + sw * 0.4;
    }, cam: u => ({ p: mix3([1.5, 4.6, -1.5], [2.5, 4.4, -0.5], u), l: [10.5, 3, 4.5], fov: 45 }) });
  // L3 — tiny cloud above my roof
  S(tw(3), { light: 'hot', center: [20, 0, 8], span: 40, set(lt, u, t) { SNOWY(t); dressed(); },
    cam: u => ({ p: mix3([6, 2, 2], [6.5, 2.2, 4], u), l: mix3([18, 10, 8], [20, 19, 8], ease(u)), fov: 55 }) });
  // L4 — follows my house
  S(tw(4), { light: 'hot', center: [10, 0, 6], span: 60, set(lt, u, t) { SNOWY(t); dressed(); },
    cam: u => { const a = mix(-0.6, 0.4, ease(u)); return { p: [20 + Math.sin(a) * 40, 32, 8 + Math.cos(a) * 40], l: [20, 10, 8], fov: 50 }; } });
  // L5 — neighbors laughed
  S(tw(5), { light: 'hot', center: [-12, 0, 8], span: 30, set(lt, u, t) {
      poolParty(t, 'grin');
      crowd.slice(0, 5).forEach((c, i) => { c.armR.rotation.z = 0; c.armR.rotation.x = -1.5; c.armL.rotation.z = 0; c.armL.rotation.x = Math.sin(t * 9 + i) * 0.3; c.body.rotation.x = Math.sin(t * 9 + i) * 0.08; c.setFace(Math.floor(t * 6 + i) % 2 ? 'grin' : 'wink'); });
    }, cam: u => ({ p: mix3([-1, 3, 9], [-2.5, 3, 8.6], u), l: [-12.5, 2.2, 8], fov: 50 }) });
  // L6 — grandma knits me a new scarf every week
  S(tw(6), { light: 'hot', center: [12, 0, 6], span: 30, set(lt, u, t) {
      SNOWY(t); dressed(); knit.visible = true; heroScarves.forEach((s, i) => s.visible = i <= Math.floor(lt * 1.6));
      knitScarf.scale.y = 1 + lt * 1.2; knitScarf.position.y = -knitScarf.scale.y / 2 + 0.3;
      knit.rotation.x = Math.sin(t * 12) * 0.08;
      pose(grandma, { pos: [12.5, 0.3, 4.5], rot: -Math.PI / 2 - 0.6, face: 'grin', armsUp: 1.2 });
      pose(hero, { pos: [10.5, 0.3, 8], rot: -Math.PI / 2 + 0.5, face: 'smile' });
    }, cam: u => ({ p: mix3([2.5, 4.8, 6.2], [3.5, 4.6, 6.2], u), l: [11.5, 4, 6.2], fov: 50 }) });
  // L7 — the heatwave
  S(tw(7), { light: 'heat', center: [0, 0, 0], span: 80, set(lt, u, t) { SNOWY(t); dressed(); },
    cam: u => ({ p: [0, 2, 20], l: mix3([0, 30, -60], [0, 200, -700], ease(u * 0.9)), fov: 55 }), sunPunch: true, tint: 'rgba(255,110,0,0.14)' });
  // L8 — 110 degrees / soup
  S(tw(8), { light: 'heat', center: [-9, 0, -2], span: 30, set(lt, u) { thermo.position.set(-10, 0, -2); thermo.rotation.y = Math.PI / 2; thermo.set(easeOut(clamp(u * 1.3))); },
    cam: u => ({ p: mix3([4, 5, 0], [3, 7, -1], ease(u)), l: [-10, 8.2, -2], fov: 54 }), tint: 'rgba(255,110,0,0.12)', shake: 0.08 });
  S(tw(8, 5), { light: 'heat', center: [-12, 0, 8], span: 30, set(lt, u, t) {
      poolParty(t, 'tired', true); veg.children.forEach((v, i) => { v.position.y = 0.5 + Math.sin(t * 3 + i) * 0.1; v.rotation.y = t + i; });
    }, cam: u => ({ p: mix3([-4, 6, 13], [-6, 5.5, 12], u), l: [-12.5, 1, 7.5], fov: 50 }), tint: 'rgba(255,110,0,0.12)' });
  // L9 — the ice cream truck melted
  S(tw(9), { light: 'heat', center: [3, 0, -20], span: 30, set(lt, u) {
      truck.visible = true; const k = easeOut(clamp((u - 0.2) * 1.1)) * 0.7; truck.position.set(3.5, 0, -22); truck.rotation.y = 0.5;
      truck.scale.set(1 + k * 0.45, 1 - k * 0.72, 1 + k * 0.3);
    }, cam: u => ({ p: mix3([-6, 6, -8], [-5, 5.5, -9], u), l: [3.5, 2.5, -22], fov: 50 }), tint: 'rgba(255,110,0,0.12)' });
  // L10 — the mayor's hat was sweating
  S(tw(10), { light: 'heat', center: [-4, 0, -10], span: 25, set(lt, u, t) {
      pose(mayor, { pos: [-4, 0.1, -10], rot: 0.3, face: 'tired' }); mayor.masks.forEach(m => m.visible = false);
      swt(t, mayor, 7.4);
    }, cam: u => ({ p: mix3([-2, 6, -1], [-2.6, 6, -3], ease(u)), l: [-4, 5.4, -10], fov: 44 }), tint: 'rgba(255,110,0,0.12)' });
  // L11 — one by one, they knocked on my door
  S(tw(11), { light: 'heat', center: [12, 0, 8], span: 30, set(lt, u, t) {
      SNOWY(t); dressed();
      crowd.forEach((c, i) => { const arrive = clamp((lt - i * 0.18) / 0.35); const [x, y, z] = queue[i]; pose(c, { pos: [mix(x - 8, x, easeOut(arrive)), y, z], rot: Math.PI / 2, walk: arrive < 1 ? 2.5 : 0, t: t + i, face: 'tired' }); });
      crowd[0].armR.rotation.x = -1.6 + Math.abs(Math.sin(lt * 10)) * 0.5;
    }, cam: u => ({ p: mix3([2, 6.5, 22], [4, 6, 20], ease(u)), l: [10, 3, 8], fov: 50 }), tint: 'rgba(255,110,0,0.06)' });
  // L12 — can we come in?
  S(tw(12), { light: 'heat', center: [10, 0, 8], span: 30, set(lt, u, t) {
      SNOWY(t); dressed();
      crowd.slice(0, 5).forEach((c, i) => pose(c, { pos: [7.6 - Math.floor(i / 3) * 2.4, 0.3, 6.8 + (i % 3) * 1.3 - Math.floor(i / 3) * 0.6], rot: -Math.PI / 2 + ((i % 3) - 1) * 0.25 + Math.PI, face: i % 2 ? 'sad' : 'open', push: true }));
    }, cam: u => ({ p: mix3([15.4, 4.4, 8], [15.0, 4.3, 8], u), l: [8, 4.2, 8], fov: 58 }) });
  // L13 — snow cone stand
  const standOn = (t) => { stand.visible = true; standSign.visible = true; standSign.position.set(11, 6.2, 15.5); standSign.rotation.y = -Math.PI / 2; };
  S(tw(13), { light: 'hot', center: [10, 0, 10], span: 30, set(lt, u, t) {
      SNOWY(t); dressed(); standOn(t);
      pose(hero, { pos: [12.8, 0.3, 15.5], rot: -Math.PI / 2, face: 'grin', wave: true, t });
      crowd.slice(0, 3).forEach((c, i) => pose(c, { pos: [7.2 - i * 1.6, 0.3, 14.5 + i * 1.2], rot: Math.PI / 2, face: 'open' }));
    }, cam: u => ({ p: mix3([0, 5.5, 23], [2, 5, 22], ease(u)), l: [10.5, 3.8, 15.5], fov: 50 }) });
  // L14 — one dollar per cone
  S(tw(14), { light: 'hot', center: [10, 0, 10], span: 30, set(lt, u, t) {
      SNOWY(t); dressed(); standOn(t);
      pose(hero, { pos: [12.8, 0.3, 15.5], rot: -Math.PI / 2, face: 'grin', point: true }); handCone(0, hero, 'armR', 0);
      pose(crowd[1], { pos: [8.6, 0.3, 15.1], rot: Math.PI / 2, face: 'grin', point: true });
    }, cam: u => ({ p: mix3([7, 4.6, 22], [7.6, 4.5, 21], u), l: [10.8, 3.8, 15.3], fov: 45 }) });
  // L15 — richest kid in town
  S(tw(15), { light: 'hot', center: [10, 0, 10], span: 30, set(lt, u, t) {
      SNOWY(t); dressed(); standOn(t);
      money.position.set(11, 2.65, 15.5); money.grow(easeOut(clamp(u * 1.2)));
      pose(hero, { pos: [12.8, 0.3 + Math.abs(Math.sin(t * 6)) * 0.4, 15.5], rot: -Math.PI / 2, face: 'grin', cheer: 2, t });
    }, cam: u => ({ p: mix3([3.5, 5, 21], [4.5, 4.8, 20.5], u), l: [11.8, 3.8, 15.5], fov: 45 }) });
  // L16 — Gary best customer
  S(tw(16), { light: 'hot', center: [8, 0, 10], span: 30, set(lt, u, t) {
      SNOWY(t); dressed(); standOn(t);
      pose(gary, { pos: [7.4, 0.3, 14.5], rot: -2.0, face: Math.floor(t * 5) % 2 ? 'grin' : 'open', armsUp: 1.4 });
      handCone(0, gary, 'armR', 1); handCone(0, gary, 'armL', 2);
      gary.armR.rotation.x = -1.4 + Math.sin(t * 8) * 0.3;
    }, cam: u => ({ p: mix3([0, 4.6, 9.5], [1, 4.5, 10.2], u), l: [7.4, 4.2, 14.5], fov: 45 }) });
  // L17 — the cloud finally moved
  S(tw(17), { light: 'hot', center: [14, 0, 0], span: 50, set(lt, u, t) {
      const z = mix(8, -8, ease(clamp(u * 1.1))); SNOWY(t, 20, z); dressed(); garySnow.visible = u > 0.6;
    }, cam: u => ({ p: [-8, 22, 0], l: [18, 12, 0], fov: 50 }) });
  // L18 — to Gary's house
  S(tw(18), { light: 'hot', center: [12, 0, -8], span: 30, set(lt, u, t) {
      SNOWY(t, 20, -8); garySnow.visible = true; garyScarf.visible = false;
      pose(gary, { pos: [11, 0.3, -6.5], rot: -Math.PI / 2 - 0.3, face: 'shock', t });
      gary.body.position.x = Math.sin(t * 50) * 0.06; gary.armL.rotation.z = 0.8; gary.armR.rotation.z = -0.8; gary.armL.rotation.x = -1.2; gary.armR.rotation.x = -1.2;
    }, cam: u => ({ p: mix3([2.5, 5, -11], [4, 4.8, -10], ease(u)), l: [11.5, 4.5, -6.5], fov: 45 }) });
  // L19 — now he wants a refund
  S(tw(19), { light: 'hot', center: [10, 0, 10], span: 30, set(lt, u, t) {
      standOn(t); heroSnow.visible = false; garySnow.visible = true; snow.update(t, 20, -8); cloud.visible = true; cloud.position.set(20, 21, -8);
      money.position.set(11, 2.65, 15.5); money.grow(1);
      pose(hero, { pos: [12.8, 0.3, 15.5], rot: -Math.PI / 2, face: 'grin' });
      pose(gary, { pos: [8.2, 0.3, 15], rot: Math.PI / 2, face: 'frown', point: true }); handCone(0, gary, 'armR', 1); garyScarf.visible = true;
      gary.armR.rotation.x = -1.5 + Math.abs(Math.sin(t * 7)) * 0.3;
    }, cam: u => ({ p: mix3([2, 5, 22], [3, 4.8, 21], ease(u)), l: [10.5, 3.8, 15.2], fov: 46 }) });

  return { emph: ['snows', 'one', 'mine', 'july', 'pool', 'cloud', 'scarf', 'heatwave', 'hundred', 'ten', 'degrees', 'soup', 'melted', 'sweating', 'snow', 'cone', 'dollar', 'richest', 'gary', 'refund', 'moved'] };
}
