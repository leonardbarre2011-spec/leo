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

  return L;
}
