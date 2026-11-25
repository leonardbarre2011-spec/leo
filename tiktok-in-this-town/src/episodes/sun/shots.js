// Episode 1: "the sun is controlled by one old man"
export default function (A) {
  const { THREE, S, tw, pose, mix, mix3, ease, easeOut, clamp, hy, TOP, chair, lever, LEVER_UP, LEVER_DOWN, CLOCK_POS, drawClock,
    oldMan, hero, mayor, gary, crowd, beachMan, mower, roosters, fence, zz, sweat, updConfetti, letter, lampN, lampGlowRoom, alarms,
    sunbeam, winSky, prop, mesh, rb, M, town } = A;
  const crate = prop(mesh(rb(3, 2, 3, 0.2), M('#c58b4a'), 0, TOP[1] + 1, TOP[2] + 3.2, town));
  const sw = TOP;
  // L0 — aerial over the town toward the hill
  S(0, { light: 'day', center: [0, 0, -60], span: 140, set(lt, u) {
      pose(oldMan, { pos: [3, sw[1], sw[2] + 7], face: 'smile' }); oldMan.root.visible = true;
      crowd.slice(0, 4).forEach((c, i) => pose(c, { pos: [i % 2 ? 4 : -4, 0.3, 20 - i * 18 - lt * 6], rot: Math.PI, walk: 1.6, t: lt + i, face: 'smile' }));
    }, cam: u => ({ p: mix3([0, 46, 70], [0, 36, -30], ease(u)), l: mix3([0, 6, -60], [0, 14, -170], ease(u)), fov: 55 }) });
  S(tw(0, 8), { light: 'day', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      pose(oldMan, { pos: [3, sw[1], sw[2] + 7], rot: -0.25, wave: true, t: lt, face: 'grin' });
    }, cam: u => ({ p: mix3([9, sw[1] + 5.5, sw[2] + 22], [7.5, sw[1] + 5.2, sw[2] + 18], easeOut(u)), l: [3, sw[1] + 4.6, sw[2] + 7], fov: 40 }) });
  // L1 — hill + giant switch reveal
  S(tw(1), { light: 'day', center: [0, sw[1], sw[2]], span: 40, set(lt) {
      pose(oldMan, { pos: [3.5, sw[1], sw[2] + 7], rot: -0.3, face: 'smile' });
      chair.visible = true;
    }, cam: u => { const a = mix(0.55, -0.35, ease(u)); return { p: [Math.sin(a) * 40, sw[1] + mix(8, 18, ease(u)), sw[2] + Math.cos(a) * 40], l: [0, sw[1] + 7, sw[2]], fov: 45 }; } });
  // L2 — every morning at seven / click / day
  S(tw(2), { light: 'dawn', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      lever.rotation.x = LEVER_DOWN;
      pose(oldMan, { pos: [1.8, sw[1], sw[2] + 3.4], rot: Math.PI - 0.15, face: 'smile', headPitch: -0.3 });
    }, cam: u => ({ p: mix3([10, sw[1] + 5, sw[2] + 16], [8, sw[1] + 6, sw[2] + 13], u), l: [0, sw[1] + 8, sw[2]], fov: 50 }) });
  S(tw(2, 4), { light: 'dawn', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      lever.rotation.x = mix(LEVER_DOWN, LEVER_UP, easeOut(lt / 0.12));
      pose(oldMan, { pos: [1.6, sw[1], sw[2] + 3.2], rot: Math.PI - 0.1, armsUp: 2.4, face: 'smile' });
    }, cam: () => ({ p: [3.5, sw[1] + 7, sw[2] + 13], l: [0, sw[1] + 7.2, sw[2]], fov: 42 }), sfx: 'click', flash: true });
  S(tw(2, 5), { light: 'day', center: [0, 0, -40], span: 120, set() {},
    cam: u => ({ p: mix3([-30, 30, 30], [-22, 34, 22], u), l: [0, 4, -40], fov: 55 }) });
  // L3 — evening
  S(tw(3), { light: 'sunset', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      pose(oldMan, { pos: [1.8, sw[1], sw[2] + 3.4], rot: Math.PI - 0.15, face: 'smile', headPitch: -0.3 });
    }, cam: u => ({ p: mix3([-10, sw[1] + 5, sw[2] + 16], [-8, sw[1] + 6, sw[2] + 13], u), l: [0, sw[1] + 8, sw[2]], fov: 50 }) });
  S(tw(3, 4), { light: 'sunset', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      lever.rotation.x = mix(LEVER_UP, LEVER_DOWN, easeOut(lt / 0.12));
      pose(oldMan, { pos: [1.6, sw[1], sw[2] + 3.2], rot: Math.PI - 0.1, armsUp: 1.7, face: 'smile' });
    }, cam: () => ({ p: [-3.5, sw[1] + 7, sw[2] + 13], l: [0, sw[1] + 7.2, sw[2]], fov: 42 }), sfx: 'click', flash: true });
  S(tw(3, 5), { light: 'night', center: [0, 0, -40], span: 120, set() { lever.rotation.x = LEVER_DOWN; },
    cam: u => ({ p: mix3([30, 30, 30], [22, 34, 22], u), l: [0, 4, -40], fov: 55 }) });
  // L4 — 80 years montage: rapid day/night flicker
  S(tw(4), { light: 'day', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      const k = Math.floor(lt / 0.22) % 2; this.light = k ? 'night' : 'day';
      lever.rotation.x = k ? LEVER_DOWN : LEVER_UP;
      pose(oldMan, { pos: [1.6, sw[1], sw[2] + 3.2], rot: Math.PI - 0.1, armsUp: k ? 1.7 : 2.4, face: 'smile' });
    }, cam: u => ({ p: mix3([0, sw[1] + 9, sw[2] + 26], [0, sw[1] + 11, sw[2] + 18], ease(u)), l: [0, sw[1] + 7, sw[2]], fov: 50 }), lightDyn: true });
  // L5 — until last Tuesday
  S(tw(5), { light: 'day', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      pose(oldMan, { pos: [chair.position.x, chair.position.y, chair.position.z], rot: -0.5, sit: true, face: 'smile', headTilt: 0.1 });
    }, cam: u => ({ p: mix3([chair.position.x - 6, chair.position.y + 4, chair.position.z + 13], [chair.position.x - 3.5, chair.position.y + 4.2, chair.position.z + 8], ease(u)), l: [chair.position.x, chair.position.y + 4, chair.position.z], fov: 45 }), dramatic: true });
  // L6 — seven pm (clock) / no click
  const clockCam = (hh) => ({ set() { drawClock(hh, 0); }, cam: u => ({ p: mix3([CLOCK_POS[0] + 22, CLOCK_POS[1] - 6, CLOCK_POS[2] + 8], [CLOCK_POS[0] + 14, CLOCK_POS[1] - 3, CLOCK_POS[2] + 4], easeOut(u)), l: CLOCK_POS, fov: 40 }) });
  S(tw(6), { light: 'hot', center: [-20, 0, -40], span: 50, ...clockCam(7), sfx: 'tick' });
  S(tw(6, 2), { light: 'hot', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      lever.rotation.x = LEVER_UP;
      pose(oldMan, { pos: [chair.position.x, chair.position.y, chair.position.z], rot: -0.5, sit: true, face: 'sleep', headTilt: 0.35 });
    }, cam: u => ({ p: mix3([-6, sw[1] + 9, sw[2] + 16], [-4, sw[1] + 9, sw[2] + 12], u), l: [0, sw[1] + 8, sw[2]], fov: 45 }) });
  // L7 — eight pm / still sunny
  S(tw(7), { light: 'hot', center: [-20, 0, -40], span: 50, ...clockCam(8), sfx: 'tick' });
  S(tw(7, 2), { light: 'hot', center: [0, 0, 0], span: 40, set(lt) {
      crowd.slice(0, 5).forEach((c, i) => pose(c, { pos: [-4 + i * 2, 0.1, 2 - (i % 2) * 2], rot: (i - 2) * 0.15, shade: true, headPitch: -0.45, face: i % 2 ? 'shock' : 'open' }));
    }, cam: u => ({ p: mix3([0, 2.6, 15], [0, 2.2, 12], ease(u)), l: [0, 5.6, 0], fov: 50 }) });
  // L8 — midnight / sun still shining
  S(tw(8), { light: 'hot', center: [-20, 0, -40], span: 50, ...clockCam(12), sfx: 'tick' });
  S(tw(8, 1), { light: 'hot', center: [0, 0, -40], span: 100, set() {},
    cam: u => ({ p: [0, 2, 0], l: mix3([0, 30, -80], [0, 300, -800], ease(u * 0.9)), fov: 55 }), sunPunch: true });
  // L9 — nobody could sleep (bedroom, sunny)
  S(tw(9), { light: 'hot', center: [400, 0, 0], span: 20, room: true, set(lt) {
      sunbeam.visible = true; winSky.material.color.set('#fff1b0');
      pose(hero, { pos: [401.5, 2.8, -1.9], face: 'tired' }); hero.root.rotation.x = -Math.PI / 2;
    }, cam: u => ({ p: mix3([398, 6.2, -1.5], [398.8, 5.6, -3], ease(u)), l: [401.4, 3.0, -6.4], fov: 45 }) });
  // L10 — mayor with three sleeping masks
  S(tw(10), { light: 'hot', center: [-14, 0, -40], span: 30, set(lt) {
      pose(mayor, { pos: [-13, 0, -40], rot: Math.PI / 2, face: 'tired', headTilt: Math.sin(lt * 3) * 0.08 });
      mayor.masks.forEach((m, i) => m.visible = lt > (i * 0.35));
    }, cam: u => ({ p: mix3([4, 5.6, -38], [0, 5.4, -39], easeOut(u)), l: [-13, 4.4, -40], fov: 40 }) });
  // L11 — Gary mowing
  S(tw(11), { light: 'hot', center: [14, 0, -8], span: 30, set(lt) {
      const z = -6 - lt * 2.6;
      mower.visible = true; mower.position.set(11, 0.35, z); mower.rotation.y = Math.PI;
      pose(gary, { pos: [11, 0.35, z + 3.9], rot: Math.PI, walk: 1.8, t: lt, face: 'tired' });
      gary.armL.rotation.x = -1.0; gary.armR.rotation.x = -1.0;
    }, cam: u => ({ p: mix3([5, 4.5, -27], [6, 4.2, -24], u), l: [11, 3.2, -8], fov: 45 }) });
  // L12 — roosters losing their minds
  S(tw(12), { light: 'hot', center: [60, 0, 60], span: 30, set(lt) {
      fence.visible = true; fence.position.set(60, 0, 60);
      roosters.forEach((r, i) => { r.g.visible = true; const j = Math.abs(Math.sin(lt * 9 + i * 2)) * 2.2; r.g.position.set(58.2 + i * 1.8, 2.4 + j, 60.2 + (i % 2) * 0.8); r.g.rotation.y = Math.sin(lt * 5 + i) * 0.8; r.wL.rotation.z = -0.8 - Math.sin(lt * 30 + i) * 0.7; r.wR.rotation.z = 0.8 + Math.sin(lt * 30 + i) * 0.7; r.head.rotation.x = Math.sin(lt * 20 + i) * 0.5; });
    }, cam: u => ({ p: mix3([60, 4.2, 73], [60, 4.4, 70], u), l: [60, 4.2, 60], fov: 50 }), shake: 0.18, sfx: 'rooster' });
  // L13 — climbing the hill
  S(tw(13), { light: 'hot', center: [0, sw[1], -160], span: 40, set(lt) {
      const z = mix(-135, -150, lt / 1.6);
      pose(hero, { pos: [0, hy(0, z), z], rot: Math.PI, walk: 2, t: lt, face: 'frown', lean: 0.2 });
    }, cam: u => { const z = mix(-135, -150, u); return { p: [4, hy(0, z) + 4.5, z + 10], l: [0, hy(0, z) + 3.5, z - 3], fov: 50 }; } });
  // L14 — old man asleep
  S(tw(14), { light: 'hot', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      pose(oldMan, { pos: [chair.position.x, chair.position.y, chair.position.z], rot: -0.5, sit: true, face: 'sleep', headTilt: 0.35, headPitch: 0.25 });
      zz.forEach((s, i) => { const k = ((lt * 0.8 + i / 3) % 1); s.visible = true; s.position.set(chair.position.x - 0.4 + k * 2.5, chair.position.y + 6 + k * 3.2, chair.position.z + 1); s.scale.setScalar(0.6 + k * 1.1); s.material.opacity = 1 - k; });
    }, cam: u => ({ p: mix3([chair.position.x - 8, chair.position.y + 5, chair.position.z + 9], [chair.position.x - 6, chair.position.y + 5, chair.position.z + 7], u), l: [chair.position.x, chair.position.y + 4.5, chair.position.z], fov: 45 }) });
  S(tw(15), { light: 'hot', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      pose(oldMan, { pos: [chair.position.x, chair.position.y, chair.position.z], rot: -0.5, sit: true, face: 'sleep', headTilt: 0.35, headPitch: 0.25 });
      oldMan.head.rotation.x += Math.sin(lt * 3) * 0.05;
      zz.forEach((s, i) => { const k = ((lt * 0.8 + i / 3) % 1); s.visible = true; s.position.set(chair.position.x - 0.6 + k * 1.6, chair.position.y + 6 + k * 2.2, chair.position.z + 1.6); s.scale.setScalar(0.4 + k * 0.8); s.material.opacity = 1 - k; });
    }, cam: u => ({ p: mix3([chair.position.x - 3.8, chair.position.y + 5.2, chair.position.z + 3.6], [chair.position.x - 3.0, chair.position.y + 5.1, chair.position.z + 2.9], u), l: [chair.position.x - 0.3, chair.position.y + 4.8, chair.position.z + 0.4], fov: 42 }) });
  // L16 — grab the switch and pull
  S(tw(16), { light: 'hot', center: [0, sw[1], sw[2]], span: 30, set(lt, u) {
      const pull = easeOut((u - 0.55) / 0.45);
      lever.rotation.x = mix(LEVER_UP, LEVER_UP + 0.25, pull);
      const jump = Math.max(0, Math.sin(clamp(u / 0.5) * Math.PI)) * 4;
      pose(hero, { pos: [0, sw[1] + 2 + jump * 0.35, sw[2] + 3.2], rot: Math.PI, armsUp: 2.9, face: 'frown', t: lt });
      hero.legL.rotation.x = 0.4 + pull * 0.4; hero.legR.rotation.x = -0.2 - pull * 0.3; hero.body.position.y = -pull * 0.8;
      pose(oldMan, { pos: [chair.position.x, chair.position.y, chair.position.z], rot: -0.5, sit: true, face: 'sleep', headTilt: 0.35, headPitch: 0.25 });
    }, crate: true, cam: u => ({ p: mix3([5, sw[1] + 4, sw[2] + 16], [4, sw[1] + 5.5, sw[2] + 13], ease(u)), l: [0, sw[1] + 7, sw[2]], fov: 52 }), shake: 0.05 });
  // stand for hero: put a little ladder/crate under him
  // L17 — CLICK! NIGHT
  S(tw(17), { light: 'hot', center: [0, sw[1], sw[2]], span: 30, set(lt) {
      lever.rotation.x = mix(LEVER_UP + 0.25, LEVER_DOWN, easeOut(lt / 0.1));
      pose(hero, { pos: [0, sw[1] + 2, sw[2] + 3.2], rot: Math.PI, armsUp: 1.6, face: 'frown' });
    }, crate: true, cam: () => ({ p: [8, sw[1] + 6, sw[2] + 10], l: [0, sw[1] + 7.5, sw[2] + 1], fov: 45 }), sfx: 'bigclick', flash: true, shake: 0.35 });
  S(tw(17, 1), { light: 'night', center: [0, 0, -40], span: 120, set() { lever.rotation.x = LEVER_DOWN; },
    cam: u => ({ p: mix3([0, 30, 60], [0, 26, 40], ease(u)), l: [0, 8, -60], fov: 55 }) });
  // L18 — the whole town cheered
  S(tw(18), { light: 'night', center: [0, 0, 0], span: 40, set(lt) {
      crowd.forEach((c, i) => pose(c, { pos: [-6 + (i % 4) * 4, 0.1, -2 - Math.floor(i / 4) * 4], rot: (i - 3.5) * 0.08, cheer: 2.6 + (i % 3) * 0.4, t: lt + i * 0.21, face: 'grin' }));
      pose(mayor, { pos: [8, 0.3, -6], rot: -0.4, cheer: 2.2, t: lt, face: 'grin' }); mayor.masks.forEach(m => m.visible = false);
      updConfetti(lt, [0, 0, -4], true);
    }, cam: u => ({ p: mix3([0, 3.5, 16], [0, 4.5, 12], ease(u)), l: [0, 4, -4], fov: 55 }), sfx: 'cheer' });
  // L19 — next morning, letter on the door
  S(tw(19), { light: 'day', center: [14, 0, 8], span: 30, set(lt) {
      letter.visible = true;
      pose(hero, { pos: [11.5, 0.3, 11.5], rot: Math.PI / 2 + 0.5, face: 'open', headPitch: -0.05 });
    }, cam: u => ({ p: mix3([3, 4.6, 5], [7, 3.8, 6.5], ease(u)), l: [15, 3, 8.6], fov: 45 }) });
  // L20 — the letter close up
  S(tw(20), { light: 'day', center: [14, 0, 8], span: 30, set() { letter.visible = true; },
    cam: u => ({ p: mix3([9.9, 2.3, 7.8], [10.3, 2.25, 7.9], u), l: [15.32, 1.95, 8.0], fov: 34 }) });
  // L21 — forever (hero shocked, then alone at switch)
  S(tw(21), { light: 'day', center: [14, 0, 8], span: 30, set(lt) {
      letter.visible = false;
      pose(hero, { pos: [9.5, 0.3, 8], rot: -1.33, face: 'shock', headTilt: Math.sin(lt * 30) * 0.03 });
    }, cam: u => ({ p: mix3([3.5, 5.2, 9.5], [4.7, 5.0, 9.1], easeOut(u)), l: [9.5, 4.6, 8], fov: 40 }), punch: true });
  S(tw(21, 6), { light: 'sunset', center: [0, sw[1], sw[2]], span: 40, set(lt) {
      lever.rotation.x = LEVER_UP;
      pose(hero, { pos: [2.5, sw[1], sw[2] + 4.5], rot: 0.1, face: 'sad' });
      pose(oldMan, { visible: false });
    }, cam: u => ({ p: mix3([3.5, sw[1] + 4.5, sw[2] + 11], [6, sw[1] + 12, sw[2] + 34], ease(u)), l: [1, sw[1] + 7, sw[2]], fov: 45 }) });
  // L22 — four alarms
  S(tw(22), { light: 'night', center: [400, 0, 0], span: 20, room: true, set(lt) {
      winSky.material.color.set('#16204a');
      lampN.children[1].material.emissiveIntensity = 1.2; lampGlowRoom.visible = true;
      pose(hero, { pos: [401.5, 2.8, -1.9], face: 'tired' }); hero.root.rotation.x = -Math.PI / 2;
      alarms.forEach((a, i) => { const on = lt > 0.25 * i; a.rotation.z = on ? Math.sin(lt * 60 + i) * 0.18 : 0; a.position.y = 2.6 + (on ? Math.abs(Math.sin(lt * 45 + i)) * 0.12 : 0); });
    }, cam: u => ({ p: mix3([396.2, 6.2, 0.5], [396.8, 5.6, -1.5], ease(u)), l: [398.8, 3.2, -5.4], fov: 45 }), sfx: 'alarm' });
  // L23 — and the old man? (empty chair)
  S(tw(23), { light: 'day', center: [0, sw[1], sw[2]], span: 30, set() {},
    cam: u => ({ p: mix3([chair.position.x - 8, chair.position.y + 5, chair.position.z + 9], [chair.position.x - 5, chair.position.y + 4.5, chair.position.z + 6], ease(u)), l: [chair.position.x, chair.position.y + 3, chair.position.z], fov: 45 }) });
  // L24 — vacation at the beach
  S(tw(24), { light: 'hot', center: [-400, 0, 0], span: 30, beach: true, set(lt) {
      pose(beachMan, { pos: [-398.5, 0.15, 0.6], sit: true, lean: -0.45, face: 'smile' });
      beachMan.armL.rotation.z = -0.3; beachMan.armR.rotation.z = 0.3;
    }, cam: u => ({ p: mix3([-398.5, 9, 26], [-398.5, 6.5, 15], ease(u)), l: [-399, 3, 0], fov: 50 }), sfx: 'waves' });
  // L25 — complaining it's too sunny
  S(tw(25), { light: 'hot', center: [-400, 0, 0], span: 30, beach: true, set(lt) {
      pose(beachMan, { pos: [-398.5, 0.15, 0.6], sit: true, lean: -0.45, face: 'frown', headPitch: Math.sin(lt * 4) * 0.06 });
      beachMan.armR.rotation.x = -1.8 + Math.sin(lt * 10) * 0.4; beachMan.armR.rotation.z = 0.4;
      sweat.forEach((s, i) => { const k = ((lt * 1.3 + i / 2) % 1); s.visible = true; s.position.set(-398.5 + (i ? 0.85 : -0.85), 6.2 - k * 1.0, 1.4); s.material.opacity = 1 - k * 0.6; });
    }, cam: u => ({ p: mix3([-398.0, 6.8, 9.5], [-398.3, 6.4, 7.0], ease(u)), l: [-398.8, 5.2, 0.6], fov: 42 }), sunPunchSmall: true });
  // crate under the hero at the switch
  for (const sh of A.SHOTS) if (sh.crate) { const f = sh.set; sh.set = function (lt, u) { crate.visible = true; return f.call(this, lt, u); }; }
  return { emph: ['click', 'day', 'night', 'seven', 'eight', 'midnight', 'eighty', 'tuesday', 'switch', 'keeper', 'forever', 'sunny', 'three', 'four', 'congratulations', 'beach', 'old', 'sun'] };
}
