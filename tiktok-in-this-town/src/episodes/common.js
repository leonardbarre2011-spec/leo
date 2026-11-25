// Shared props for episodes. Every factory registers its object with A.prop(), so it
// is hidden by default and a shot shows it by setting .visible = true.
export function lib(A) {
  const { THREE, mesh, rb, M, canvasTex, glow, scene, prop, rand } = A;
  const L = {};

  L.label = (w, h, draw) => new THREE.MeshStandardMaterial({ map: canvasTex(w, h, draw), roughness: 0.7 });

  L.pool = (x, z, w = 6, d = 9) => {
    const g = prop(new THREE.Group()); g.position.set(x, 0, z); scene.add(g);
    const rim = M('#f2f2f2');
    mesh(new THREE.BoxGeometry(w + 1.2, 0.6, 0.6), rim, 0, 0.3, d / 2 + 0.3, g);
    mesh(new THREE.BoxGeometry(w + 1.2, 0.6, 0.6), rim, 0, 0.3, -d / 2 - 0.3, g);
    mesh(new THREE.BoxGeometry(0.6, 0.6, d), rim, w / 2 + 0.3, 0.3, 0, g);
    mesh(new THREE.BoxGeometry(0.6, 0.6, d), rim, -w / 2 - 0.3, 0.3, 0, g);
    g.water = mesh(new THREE.BoxGeometry(w, 0.3, d), new THREE.MeshStandardMaterial({ color: '#29b6f6', roughness: 0.1, emissive: '#0a5f8a', emissiveIntensity: 0.25 }), 0, 0.3, 0, g);
    g.water.castShadow = false;
    const ring = mesh(new THREE.TorusGeometry(0.9, 0.35, 10, 20), M('#ff5d73'), w / 4, 0.55, d / 5, g); ring.rotation.x = Math.PI / 2; g.ring = ring;
    return g;
  };

  L.cat = () => {
    const c = { g: prop(new THREE.Group()) }; scene.add(c.g);
    const fur = M('#f39c34'), stripe = M('#c96a12');
    c.body = new THREE.Group(); c.g.add(c.body);
    mesh(rb(1.7, 1.1, 2.6, 0.4), fur, 0, 0.75, 0, c.body);
    for (const z of [-0.6, 0.1, 0.8]) mesh(rb(1.75, 0.2, 0.3, 0.08), stripe, 0, 1.25, z, c.body);
    c.head = new THREE.Group(); c.head.position.set(0, 1.2, 1.4); c.body.add(c.head);
    mesh(rb(1.3, 1.1, 1.1, 0.35), fur, 0, 0, 0, c.head);
    for (const sx of [-0.4, 0.4]) { const e = mesh(new THREE.ConeGeometry(0.28, 0.5, 4), fur, sx, 0.7, 0, c.head); e.rotation.y = Math.PI / 4; }
    c.eyesOpen = new THREE.Group(); c.head.add(c.eyesOpen);
    for (const sx of [-0.28, 0.28]) mesh(rb(0.18, 0.3, 0.05, 0.05), M('#1b1b1b'), sx, 0.1, 0.56, c.eyesOpen);
    c.eyesShut = new THREE.Group(); c.head.add(c.eyesShut);
    for (const sx of [-0.28, 0.28]) mesh(rb(0.3, 0.06, 0.05, 0.02), M('#1b1b1b'), sx, 0.08, 0.56, c.eyesShut);
    mesh(rb(0.2, 0.14, 0.06, 0.04), M('#ff8fa3'), 0, -0.12, 0.57, c.head);
    c.tail = mesh(rb(0.3, 0.3, 1.8, 0.12), fur, 0.5, 0.9, -1.8, c.body); c.tail.rotation.y = -0.6;
    c.set = (pos, rot = 0, asleep = true, roll = 0) => {
      c.g.visible = true; c.g.position.set(...pos); c.g.rotation.set(0, rot, roll);
      c.eyesOpen.visible = !asleep; c.eyesShut.visible = asleep;
    };
    return c;
  };

  L.siren = (x, z) => {
    const g = prop(new THREE.Group()); g.position.set(x, 0, z); scene.add(g);
    mesh(new THREE.CylinderGeometry(0.25, 0.3, 9, 10), M('#555'), 0, 4.5, 0, g);
    const horn = mesh(new THREE.CylinderGeometry(0.4, 1.3, 1.8, 16, 1, true), M('#d9d9d9', { side: THREE.DoubleSide }), 0.9, 8.6, 0, g); horn.rotation.z = -Math.PI / 2;
    g.light = mesh(new THREE.SphereGeometry(0.55, 16, 10), new THREE.MeshStandardMaterial({ color: '#ff2d2d', emissive: '#ff0000', emissiveIntensity: 1 }), 0, 9.6, 0, g);
    g.glow = glow('#ff3030', 7, 0.9); g.glow.position.set(0, 9.6, 0); g.add(g.glow);
    return g;
  };

  L.mailbox = (x, z, rot = 0) => {
    const g = prop(new THREE.Group()); g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g);
    mesh(new THREE.BoxGeometry(0.3, 2.6, 0.3), M('#6b4226'), 0, 1.3, 0, g);
    mesh(rb(1.0, 1.0, 1.8, 0.4), M('#2f6fd6'), 0, 3.0, 0, g);
    const f = mesh(new THREE.BoxGeometry(0.08, 0.7, 0.25), M('#e63946'), 0.55, 3.3, -0.4, g);
    return g;
  };

  L.rope = () => { const r = prop(mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 6), M('#c9a36b'))); scene.add(r); return r; };
  const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
  L.stretch = (m, a, b) => {
    _a.set(...a); _b.set(...b); const d = _b.clone().sub(_a); m.visible = true;
    m.position.copy(_a).add(_b).multiplyScalar(0.5); m.scale.set(1, d.length(), 1);
    m.quaternion.setFromUnitVectors(_up, d.normalize());
  };

  L.sandwich = () => {
    const g = prop(new THREE.Group());
    mesh(rb(1.2, 0.25, 1.0, 0.08), M('#f2c879'), 0, 0, 0, g); mesh(rb(1.3, 0.12, 1.1, 0.04), M('#6fbf4a'), 0, 0.17, 0, g);
    mesh(rb(1.2, 0.15, 1.0, 0.04), M('#e74c3c'), 0, 0.3, 0, g); mesh(rb(1.2, 0.25, 1.0, 0.08), M('#f2c879'), 0, 0.47, 0, g);
    return g;
  };

  L.bird = () => {
    const b = { g: prop(new THREE.Group()) }; scene.add(b.g);
    mesh(rb(0.8, 0.7, 1.3, 0.25), M('#4aa3ff'), 0, 0, 0, b.g);
    mesh(new THREE.ConeGeometry(0.15, 0.4, 4), M('#ffb703'), 0, 0.05, 0.8, b.g).rotation.x = Math.PI / 2;
    b.wl = mesh(rb(1.2, 0.12, 0.6, 0.05), M('#2b7bd6'), -0.7, 0.1, 0, b.g); b.wr = mesh(rb(1.2, 0.12, 0.6, 0.05), M('#2b7bd6'), 0.7, 0.1, 0, b.g);
    b.flap = (t) => { b.wl.rotation.z = Math.sin(t * 25) * 0.7; b.wr.rotation.z = -Math.sin(t * 25) * 0.7; };
    return b;
  };

  // particle burst (splash, sparkles, dust). update(lt, origin)
  L.burst = (n, color, size = 0.35, speed = 7, up = 9, grav = 22, life = 1.2, emissive = false) => {
    const mat = emissive ? new THREE.MeshBasicMaterial({ color }) : new THREE.MeshStandardMaterial({ color, roughness: 0.2 });
    const im = new THREE.InstancedMesh(new THREE.SphereGeometry(size, 8, 6), mat, n);
    im.frustumCulled = false; prop(im); scene.add(im);
    const r = rand(n * 13 + 7), dirs = [];
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, s = 0.3 + r() * 0.7; dirs.push([Math.cos(a) * s * speed, up * (0.5 + r() * 0.7), Math.sin(a) * s * speed, 0.5 + r() * 0.8]); }
    const m4 = new THREE.Matrix4(), v = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
    im.update = (lt, o) => {
      im.visible = lt >= 0 && lt < life;
      if (!im.visible) return;
      for (let i = 0; i < n; i++) {
        const [vx, vy, vz, s] = dirs[i];
        v.set(o[0] + vx * lt, o[1] + vy * lt - 0.5 * grav * lt * lt, o[2] + vz * lt);
        const k = s * Math.max(0, 1 - lt / life); sc.set(k, k, k);
        if (v.y < o[1] - 0.5) sc.set(0, 0, 0);
        m4.compose(v, q, sc); im.setMatrixAt(i, m4);
      }
      im.instanceMatrix.needsUpdate = true;
    };
    return im;
  };

  // falling snow in a box volume
  L.snow = (cx, cz, w, d, h, n = 700) => {
    const pos = new Float32Array(n * 3), r = rand(99), base = [];
    for (let i = 0; i < n; i++) base.push([r() * w - w / 2, r() * h, r() * d - d / 2, r() * 6]);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const tex = canvasTex(32, 32, (g) => { const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); });
    const p = prop(new THREE.Points(geo, new THREE.PointsMaterial({ map: tex, size: 0.45, transparent: true, depthWrite: false, color: '#ffffff' })));
    p.frustumCulled = false; scene.add(p);
    p.update = (t, x = cx, z = cz) => {
      p.visible = true;
      for (let i = 0; i < n; i++) { const [bx, by, bz, ph] = base[i]; pos[i * 3] = x + bx + Math.sin(t * 1.3 + ph) * 0.4; pos[i * 3 + 1] = h - ((h - by + t * 3.2) % h); pos[i * 3 + 2] = z + bz + Math.cos(t + ph) * 0.4; }
      geo.attributes.position.needsUpdate = true;
    };
    return p;
  };

  L.cloud = (dark = true) => {
    const g = prop(new THREE.Group()); scene.add(g);
    const m = M(dark ? '#b8c2d0' : '#ffffff', { roughness: 1, emissive: dark ? '#7d8a9c' : '#ffffff', emissiveIntensity: dark ? 0.45 : 0.25 });
    for (const [x, y, z, s] of [[0, 0, 0, 7], [-5, -0.5, 1, 5.5], [5, -0.6, -0.5, 5.8], [1.5, 2.2, 0.5, 5], [-2.5, 1.5, -1.5, 4.5], [3, 0.5, 3, 4]]) mesh(rb(s, s * 0.75, s, 1.4), m, x, y, z, g);
    return g;
  };

  L.cone = (col = '#ff4d6d') => {
    const g = prop(new THREE.Group());
    const c = mesh(new THREE.ConeGeometry(0.4, 1.1, 12), M('#f2d18b'), 0, 0, 0, g); c.rotation.x = Math.PI;
    mesh(new THREE.SphereGeometry(0.5, 14, 10), M(col), 0, 0.6, 0, g);
    return g;
  };

  L.sign = (w, h, text, bg = '#fff6d6', fg = '#c0392b', font = 120) => {
    const mat = L.label(512, Math.round(512 * h / w), (g, cw, ch) => {
      g.fillStyle = bg; g.fillRect(0, 0, cw, ch); g.strokeStyle = '#5a3a1a'; g.lineWidth = 16; g.strokeRect(8, 8, cw - 16, ch - 16);
      g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
      const lines = text.split('\n'); lines.forEach((l, i) => { g.font = `700 ${font}px Fredoka`; g.fillText(l, cw / 2, ch / 2 + (i - (lines.length - 1) / 2) * font * 1.05); });
    });
    const m = prop(mesh(new THREE.BoxGeometry(w, h, 0.2), [M('#5a3a1a'), M('#5a3a1a'), M('#5a3a1a'), M('#5a3a1a'), mat, M('#5a3a1a')]));
    scene.add(m); return m;
  };

  L.partyHat = (char, col = '#ff4d6d') => {
    const h = prop(mesh(new THREE.ConeGeometry(0.5, 1.3, 16), M(col), 0, 1.95, 0, char.head));
    mesh(new THREE.SphereGeometry(0.18, 10, 8), M('#ffd166'), 0, 0.7, 0, h);
    return h;
  };

  L.jetpack = (char) => {
    const g = prop(new THREE.Group()); g.position.set(0, 3, -0.85); char.body.add(g);
    for (const sx of [-0.45, 0.45]) {
      mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 14), M('#b8c2cc', { metalness: 0.6, roughness: 0.3 }), sx, 0, 0, g);
      mesh(new THREE.ConeGeometry(0.4, 0.5, 14), M('#e63946'), sx, 1.15, 0, g);
      const fl = mesh(new THREE.ConeGeometry(0.32, 1.6, 10), new THREE.MeshBasicMaterial({ color: '#ffb703' }), sx, -1.7, 0, g); fl.rotation.x = Math.PI; fl.castShadow = false;
      const gl = glow('#ff7b00', 3.5, 0.9); gl.position.set(sx, -1.9, 0); g.add(gl);
    }
    return g;
  };

  L.coin = () => {
    const c = prop(mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 20), M('#f5c518', { metalness: 0.8, roughness: 0.25, emissive: '#7a5a00', emissiveIntensity: 0.3 })));
    scene.add(c); return c;
  };

  L.money = () => {
    const g = prop(new THREE.Group()); scene.add(g);
    const r = rand(4); g.bills = [];
    for (let i = 0; i < 40; i++) { const b = mesh(new THREE.BoxGeometry(1.4, 0.18, 0.7), M('#5cb85c'), (r() - 0.5) * 2.2, 0, (r() - 0.5) * 1.6, g); b.rotation.y = r() * 3; b.userData.h = 0.1 + Math.floor(i / 6) * 0.2 + r() * 0.05; g.bills.push(b); }
    g.grow = (k) => { g.visible = true; const n = Math.floor(k * g.bills.length); g.bills.forEach((b, i) => { b.visible = i < n; b.position.y = b.userData.h; }); };
    return g;
  };

  L.truck = (col = '#ffffff') => {
    const g = prop(new THREE.Group()); scene.add(g);
    mesh(rb(3.4, 3.6, 7, 0.4), M(col), 0, 2.3, -0.5, g);
    mesh(rb(3.2, 2.2, 2.4, 0.4), M('#ff8fab'), 0, 1.7, 3.6, g);
    mesh(new THREE.BoxGeometry(3.0, 1.0, 0.1), M('#bfe4f7', { roughness: 0.1 }), 0, 2.2, 4.82, g);
    mesh(new THREE.BoxGeometry(0.1, 1.6, 3.4), M('#6ec6ff'), 1.72, 2.6, -0.8, g);
    { const cc = mesh(new THREE.ConeGeometry(0.95, 2.6, 14), M('#f2d18b'), 0, 5.4, -0.5, g); cc.rotation.x = Math.PI; mesh(new THREE.SphereGeometry(1.2, 16, 12), M('#ff9ff3'), 0, 6.9, -0.5, g); }
    for (const [wx, wz] of [[-1.6, 3], [1.6, 3], [-1.6, -2.6], [1.6, -2.6]]) { const w = mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4, 14), M('#1e1e1e'), wx, 0.6, wz, g); w.rotation.z = Math.PI / 2; }
    return g;
  };

  L.thermo = () => {
    const g = prop(new THREE.Group()); scene.add(g);
    mesh(rb(3.2, 11, 0.6, 0.4), M('#ffffff'), 0, 6, 0, g);
    mesh(new THREE.CylinderGeometry(0.45, 0.45, 8.2, 14), M('#e9eef2'), 0, 6.8, 0.35, g);
    g.bulb = mesh(new THREE.SphereGeometry(1.0, 18, 12), new THREE.MeshStandardMaterial({ color: '#e63946', emissive: '#b00000', emissiveIntensity: 0.4 }), 0, 1.9, 0.4, g);
    g.fill = mesh(new THREE.CylinderGeometry(0.32, 0.32, 1, 14), new THREE.MeshStandardMaterial({ color: '#e63946', emissive: '#b00000', emissiveIntensity: 0.4 }), 0, 0, 0.45, g);
    g.set = (k) => { g.visible = true; const h = 0.5 + k * 8; g.fill.scale.y = h; g.fill.position.y = 2.6 + h / 2; };
    const lab = mesh(new THREE.PlaneGeometry(3, 1.4), L.label(256, 120, (c) => { c.fillStyle = '#fff'; c.fillRect(0, 0, 256, 120); c.fillStyle = '#e63946'; c.font = '700 84px Fredoka'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('110°', 128, 64); }), 0, 12.4, 0.31, g);
    lab.castShadow = false;
    return g;
  };

  L.scarf = (char, col = '#e63946', i = 0) => {
    const s = prop(mesh(rb(1.6, 0.35, 1.35, 0.15), M(col), 0, 0.12 + i * 0.3, 0, char.head));
    return s;
  };

  // ---------------------------------------------------------------- cow (blocky). pivot = back hips so it can stand up
  L.cow = () => {
    const c = { g: prop(new THREE.Group()) }; scene.add(c.g);
    const white = M('#f7f5f0'), black = M('#262626'), pink = M('#f7a8b8'), horn = M('#f3e6c4');
    c.body = new THREE.Group(); c.body.position.set(0, 2.0, -1.4); c.g.add(c.body);
    const inner = new THREE.Group(); inner.position.set(0, -2.0, 1.4); c.body.add(inner);
    mesh(rb(2.6, 2.2, 4.2, 0.45), white, 0, 3.0, 0, inner);
    for (const [x, y, z, w, h, d] of [[1.31, 3.3, 0.6, 0.06, 1.0, 1.3], [1.31, 2.6, -1.1, 0.06, 0.8, 0.9], [-1.31, 3.2, -0.4, 0.06, 1.1, 1.5], [-1.31, 2.4, 1.2, 0.06, 0.7, 0.8], [0.4, 4.11, -0.8, 1.0, 0.06, 1.2], [-0.5, 4.11, 1.0, 0.9, 0.06, 0.9], [0, 3.4, -2.11, 1.0, 0.8, 0.06]]) mesh(rb(w, h, d, 0.02), black, x, y, z, inner);
    c.head = new THREE.Group(); c.head.position.set(0, 3.8, 2.0); inner.add(c.head);
    mesh(rb(1.8, 1.65, 1.7, 0.45), white, 0, 0, 0.45, c.head);
    mesh(rb(1.7, 0.9, 0.7, 0.28), pink, 0, -0.42, 1.3, c.head);
    for (const sx of [-0.38, 0.38]) mesh(rb(0.2, 0.14, 0.05, 0.03), M('#7a3045'), sx, -0.3, 1.66, c.head);
    c.mouth = mesh(rb(0.8, 0.12, 0.05, 0.03), M('#5a1018'), 0, -0.68, 1.66, c.head);
    for (const sx of [-0.45, 0.45]) { mesh(rb(0.3, 0.42, 0.05, 0.1), black, sx, 0.25, 1.31, c.head); mesh(rb(0.1, 0.12, 0.05, 0.03), M('#ffffff'), sx - 0.06, 0.36, 1.34, c.head); }
    for (const sx of [-1, 1]) { const h = mesh(new THREE.ConeGeometry(0.17, 0.75, 8), horn, sx * 0.6, 1.05, 0.3, c.head); h.rotation.z = -sx * 0.55; const e = mesh(rb(0.75, 0.28, 0.45, 0.1), pink, sx * 1.1, 0.45, 0.25, c.head); e.rotation.z = -sx * 0.3; }
    mesh(rb(0.9, 0.5, 0.9, 0.2), pink, 0, 1.75, -0.6, inner);
    c.tail = mesh(rb(0.18, 1.6, 0.18, 0.06), white, 0, 3.0, -2.25, inner); c.tail.rotation.x = 0.25; mesh(rb(0.35, 0.45, 0.35, 0.12), black, 0, -0.9, 0, c.tail);
    c.legs = [];
    for (const [x, z] of [[-0.8, 1.4], [0.8, 1.4], [-0.8, -1.4], [0.8, -1.4]]) {
      const lg = new THREE.Group(); lg.position.set(x, 2.0, z); inner.add(lg); c.legs.push(lg);
      mesh(rb(0.72, 2.0, 0.72, 0.15), white, 0, -1.0, 0, lg); mesh(rb(0.78, 0.38, 0.78, 0.1), black, 0, -1.85, 0, lg);
    }
    // o: {pos, yaw, pitch, roll, t, walk, flail, stand, mouth, scale, look}
    c.pose = (o = {}) => {
      c.g.visible = true; c.g.position.set(...(o.pos || [0, 0, 0])); c.g.rotation.set(o.pitch || 0, o.yaw || 0, o.roll || 0, 'YXZ');
      c.g.scale.setScalar(o.scale || 1);
      c.body.rotation.set(0, 0, 0); c.head.rotation.set(o.look || 0, o.turn || 0, 0); c.legs.forEach(l => l.rotation.set(0, 0, 0));
      c.mouth.scale.y = 1 + (o.mouth || 0) * 4; c.mouth.position.y = -0.68 - (o.mouth || 0) * 0.12;
      const t = o.t || 0;
      if (o.walk) { const s = Math.sin(t * o.walk * 2 * Math.PI) * 0.6; c.legs[0].rotation.x = s; c.legs[3].rotation.x = s; c.legs[1].rotation.x = -s; c.legs[2].rotation.x = -s; }
      if (o.flail) c.legs.forEach((l, i) => { l.rotation.x = Math.sin(t * 16 + i * 1.7) * 0.9; l.rotation.z = Math.cos(t * 13 + i) * 0.4; });
      if (o.stand) {
        const k = o.stand; c.body.rotation.x = -1.5 * k; c.head.rotation.x += 1.35 * k;
        c.legs[2].rotation.x += 1.5 * k; c.legs[3].rotation.x += 1.5 * k;
        c.legs[0].rotation.x += 0.4 * k; c.legs[1].rotation.x += 0.4 * k;
        if (o.wave) c.legs[1].rotation.x += -1.6 + Math.sin(t * 12) * 0.4;
      }
      c.tail.rotation.z = Math.sin(t * 5) * 0.3;
    };
    return c;
  };

  // steel umbrella, parented to a character's body; holdUmb() raises the arm and shows it
  L.umbrella = (char, side = 1, col = '#a9b4bf') => {
    const g = prop(new THREE.Group()); char.body.add(g); g.position.set(1.5 * side, 2.9, 1.45);
    const steel = M(col, { metalness: 0.3, roughness: 0.3 });
    mesh(new THREE.CylinderGeometry(0.09, 0.09, 5.8, 8), M('#555', { metalness: 0.6, roughness: 0.4 }), 0, 2.9, 0, g);
    const can = mesh(new THREE.ConeGeometry(3.3, 1.4, 12, 1, true), new THREE.MeshStandardMaterial({ color: col, metalness: 0.3, roughness: 0.3, side: THREE.DoubleSide, emissive: col, emissiveIntensity: 0.12 }), 0, 6.1, 0, g);
    for (let k = 0; k < 12; k++) { const r = mesh(new THREE.BoxGeometry(0.08, 0.1, 3.5), M('#8a949e', { metalness: 0.3 }), Math.sin(k / 12 * Math.PI * 2) * 1.6, 6.05, Math.cos(k / 12 * Math.PI * 2) * 1.6, g); r.rotation.y = k / 12 * Math.PI * 2; r.rotation.x = 0.4; }
    mesh(new THREE.CylinderGeometry(0.12, 0.05, 0.7, 8), steel, 0, 7.1, 0, g);
    g.side = side; g.char = char;
    return g;
  };
  L.holdUmb = (u) => { u.visible = true; const a = u.side > 0 ? u.char.armR : u.char.armL; a.rotation.x = -1.0; a.rotation.z = 0; };

  // banana (character-sized, with a face). acc: { tophat, hair, cap }
  const banGeo = new THREE.TorusGeometry(3, 0.95, 12, 28, 2.1);
  const banMat = M('#ffd93b', { emissive: '#6b5200', emissiveIntensity: 0.12 });
  L.banana = (acc = {}) => {
    const b = { g: prop(new THREE.Group()) }; scene.add(b.g);
    b.inner = new THREE.Group(); b.inner.position.y = 3.6; b.g.add(b.inner);
    const m = mesh(banGeo, banMat, 0, 0, 0, b.inner); m.rotation.z = -1.05; m.position.x = -3;
    const tip = (a) => [3 * Math.cos(a) - 3, 3 * Math.sin(a)];
    const [tx, ty] = tip(1.05), [bx, by] = tip(-1.05);
    mesh(new THREE.SphereGeometry(0.95, 14, 10), banMat, tx, ty, 0, b.inner);
    mesh(new THREE.SphereGeometry(0.95, 14, 10), banMat, bx, by, 0, b.inner);
    const st = mesh(new THREE.CylinderGeometry(0.3, 0.42, 1.1, 10), M('#6b4a1f'), tx - 0.35, ty + 0.85, 0, b.inner); st.rotation.z = 0.5;
    mesh(new THREE.SphereGeometry(0.42, 10, 8), M('#3a2a14'), bx - 0.4, by - 0.55, 0, b.inner);
    b.faceMat = new THREE.MeshStandardMaterial({ map: A.faceTex('shock'), transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 });
    const f = mesh(new THREE.PlaneGeometry(1.5, 1.5), b.faceMat, 0.15, 0.35, 0.97, b.inner); f.castShadow = false;
    b.face = 'shock';
    b.setFace = (t) => { if (t !== b.face) { b.face = t; b.faceMat.map = A.faceTex(t); b.faceMat.needsUpdate = true; } };
    const hx = tx + 0.25, hy = ty + 0.3;
    if (acc.tophat) { const h = new THREE.Group(); h.position.set(hx + 0.4, hy - 0.4, 0); h.rotation.z = -0.4; b.inner.add(h); mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 20), M('#151515'), 0, 0, 0, h); mesh(new THREE.CylinderGeometry(0.58, 0.6, 1.1, 20), M('#151515'), 0, 0.58, 0, h); mesh(new THREE.CylinderGeometry(0.61, 0.61, 0.2, 20), M('#c0392b'), 0, 0.13, 0, h); }
    if (acc.hair) { const h = mesh(rb(1.6, 0.5, 1.6, 0.2), M(acc.hair), hx + 0.35, hy - 0.55, 0, b.inner); h.rotation.z = -0.5; }
    if (acc.cap) { const h = new THREE.Group(); h.position.set(hx + 0.35, hy - 0.5, 0); h.rotation.z = -0.5; b.inner.add(h); mesh(rb(1.6, 0.6, 1.6, 0.25), M(acc.cap), 0, 0, 0, h); mesh(rb(1.4, 0.12, 0.9, 0.05), M(acc.cap), 0, -0.2, 0.9, h); }
    if (acc.bun) { const h = mesh(new THREE.SphereGeometry(0.6, 12, 10), M(acc.bun), hx + 0.2, hy - 0.2, -0.3, b.inner); }
    if (acc.mic) { const mg = new THREE.Group(); mg.position.set(1.2, -0.3, 0.6); mg.rotation.z = 0.3; b.inner.add(mg); mesh(new THREE.CylinderGeometry(0.12, 0.1, 1.2, 8), M('#222'), 0, 0, 0, mg); mesh(new THREE.SphereGeometry(0.28, 10, 8), M('#444'), 0, 0.7, 0, mg); }
    // pop-in: k=time since pop
    b.set = (pos, yaw = 0, k = 9, t = 0, face) => {
      b.g.visible = true; b.g.position.set(...pos); b.g.rotation.set(0, yaw, Math.sin(t * 3 + pos[0]) * 0.06);
      const s = k < 0 ? 0 : 1 + Math.sin(Math.min(k, 0.5) * Math.PI * 4) * Math.exp(-k * 6) * 0.6;
      b.g.scale.setScalar(s * (b.scale || 1));
      if (face) b.setFace(face);
    };
    return b;
  };
  L.bananaPile = (n = 24) => {
    const g = prop(new THREE.Group()); scene.add(g); const r = rand(31);
    for (let i = 0; i < n; i++) { const m = mesh(banGeo, banMat, (r() - 0.5) * 3, 0.3 + (i % 4) * 0.35, (r() - 0.5) * 1.6, g); m.scale.setScalar(0.12); m.rotation.set(Math.PI / 2 + (r() - 0.5) * 0.3, 0, r() * 6); }
    return g;
  };

  // generic billboard panel with custom canvas drawing
  L.board = (w, h, draw, px = 512) => {
    const mat = L.label(px, Math.round(px * h / w), draw);
    const m = prop(mesh(new THREE.BoxGeometry(w, h, 0.25), [M('#333'), M('#333'), M('#333'), M('#333'), mat, M('#333')]));
    scene.add(m); return m;
  };

  L.podium = (text = 'MAYOR') => {
    const g = prop(new THREE.Group()); scene.add(g);
    mesh(rb(3.2, 3.6, 1.8, 0.2), M('#8a5a2b'), 0, 1.8, 0, g);
    const lab = mesh(new THREE.PlaneGeometry(2.6, 1.0), L.label(256, 100, (c) => { c.fillStyle = '#e8c547'; c.fillRect(0, 0, 256, 100); c.fillStyle = '#3b2412'; c.font = '700 64px Fredoka'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 128, 54); }), 0, 2.4, 0.91, g); lab.castShadow = false;
    const st = mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), M('#222'), 0, 4.2, 0.3, g); st.rotation.x = 0.5;
    mesh(new THREE.SphereGeometry(0.28, 10, 8), M('#333'), 0, 4.9, 0.72, g);
    return g;
  };

  L.tv = (draw) => {
    const g = prop(new THREE.Group()); scene.add(g);
    mesh(rb(6, 3.8, 0.8, 0.2), M('#1d1d1d'), 0, 0, 0, g);
    g.tex = canvasTex(512, 300, draw);
    const s = mesh(new THREE.PlaneGeometry(5.4, 3.2), new THREE.MeshBasicMaterial({ map: g.tex }), 0, 0, 0.41, g); s.castShadow = false;
    mesh(new THREE.BoxGeometry(0.4, 1.4, 0.4), M('#333'), 0, -2.5, 0, g); mesh(rb(2.4, 0.3, 1.2, 0.1), M('#333'), 0, -3.2, 0, g);
    return g;
  };

  L.boxes = () => {
    const g = prop(new THREE.Group()); scene.add(g); const r = rand(77);
    for (let i = 0; i < 7; i++) { const s = 1.2 + r() * 0.6; const b = mesh(rb(s, s * 0.8, s, 0.08), M('#c8955a'), (i % 4) * 1.6 - 2.4 + r() * 0.3, s * 0.4 + (i > 3 ? 1.3 : 0), (r() - 0.5) * 1.2, g); b.rotation.y = r() * 0.6; mesh(new THREE.BoxGeometry(s * 1.01, 0.12, 0.3), M('#d9c27a'), 0, s * 0.4, 0, b); }
    return g;
  };

  L.catapult = () => {
    const g = prop(new THREE.Group()); scene.add(g); const wood = M('#8a5a2b');
    mesh(rb(5, 1, 8, 0.2), wood, 0, 1.4, 0, g);
    for (const [x, z] of [[-2.7, 2.8], [2.7, 2.8], [-2.7, -2.8], [2.7, -2.8]]) { const w = mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.5, 16), M('#4a3020'), x, 1.1, z, g); w.rotation.z = Math.PI / 2; }
    for (const x of [-1.6, 1.6]) mesh(rb(0.6, 4.5, 0.6, 0.1), wood, x, 4, 1.5, g);
    mesh(rb(4, 0.6, 0.6, 0.1), wood, 0, 6, 1.5, g);
    g.arm = new THREE.Group(); g.arm.position.set(0, 2.2, 1.2); g.add(g.arm);
    const a = mesh(rb(0.7, 0.7, 10, 0.15), wood, 0, 0, -4.2, g.arm);
    g.cup = new THREE.Group(); g.cup.position.set(0, 0.4, -8.8); g.arm.add(g.cup);
    mesh(new THREE.CylinderGeometry(1.8, 1.2, 0.9, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#6b4226', side: THREE.DoubleSide }), 0, 0.3, 0, g.cup);
    mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 16), M('#6b4226'), 0, -0.1, 0, g.cup);
    return g;
  };

  return L;
}
