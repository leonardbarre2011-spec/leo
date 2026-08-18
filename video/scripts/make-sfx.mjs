import fs from 'fs';
const SR = 48000;

const wav = (name, ch) => {
  const n = ch.length, buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(ch[i] * 32767))), 44 + i * 2);
  fs.writeFileSync(`public/sfx/${name}.wav`, buf);
  console.log(name, (n / SR).toFixed(2) + 's');
};

const alloc = (sec) => new Float32Array(Math.round(sec * SR));
const norm = (a, peak = 0.92) => { let m = 0; for (const v of a) m = Math.max(m, Math.abs(v)); if (m > 0) for (let i = 0; i < a.length; i++) a[i] = a[i] / m * peak; return a; };

// one-pole low-pass / high-pass helpers
const lp = (a, cutoff) => { const dt = 1 / SR, rc = 1 / (2 * Math.PI * cutoff), al = dt / (rc + dt); let y = 0; const o = new Float32Array(a.length); for (let i = 0; i < a.length; i++) { y += al * (a[i] - y); o[i] = y; } return o; };
const hp = (a, cutoff) => { const dt = 1 / SR, rc = 1 / (2 * Math.PI * cutoff), al = rc / (rc + dt); let y = 0, px = 0; const o = new Float32Array(a.length); for (let i = 0; i < a.length; i++) { y = al * (y + a[i] - px); px = a[i]; o[i] = y; } return o; };
// sweeping resonant-ish band via cascaded time-varying one-poles
const sweepBP = (a, f0, f1, q = 2) => {
  const o = new Float32Array(a.length); let lo1 = 0, lo2 = 0, hi = 0, px = 0;
  for (let i = 0; i < a.length; i++) {
    const t = i / a.length, f = f0 * Math.pow(f1 / f0, t);
    const dt = 1 / SR, rcL = 1 / (2 * Math.PI * f * 1.6), aL = dt / (rcL + dt);
    const rcH = 1 / (2 * Math.PI * f * 0.6), aH = rcH / (rcH + dt);
    hi = aH * (hi + a[i] - px); px = a[i];
    lo1 += aL * (hi - lo1); lo2 += aL * (lo1 - lo2);
    o[i] = lo2 * q;
  }
  return o;
};
const noise = (sec) => { const a = alloc(sec); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; return a; };
const env = (a, atk, dec, curve = 2.2) => { const n = a.length, A = Math.round(atk * SR); for (let i = 0; i < n; i++) { const t = i / SR; const e = i < A ? i / Math.max(1, A) : Math.pow(Math.max(0, 1 - (t - atk) / dec), curve); a[i] *= e; } return a; };

/* ---------- IMPACT: sub drop + body + transient click ---------- */
const impact = (dur, f0, f1, bright) => {
  const a = alloc(dur); const n = a.length;
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = f1 + (f0 - f1) * Math.pow(1 - t, 3);
    ph += (2 * Math.PI * f) / SR;
    const e = Math.pow(1 - t, 2.4);
    a[i] = Math.sin(ph) * e * 0.9 + Math.sin(ph * 2) * e * 0.18;
  }
  const cl = env(noise(0.05), 0.0005, 0.045, 3);
  const clf = lp(hp(cl, 900), bright);
  for (let i = 0; i < clf.length; i++) a[i] += clf[i] * 0.55;
  return norm(a);
};
wav('impact', impact(0.75, 150, 42, 6500));
wav('impact-hard', impact(0.55, 240, 55, 11000));
wav('impact-soft', impact(0.45, 110, 46, 3200));

/* ---------- SUB DROP ---------- */
{
  const a = alloc(1.1); let ph = 0;
  for (let i = 0; i < a.length; i++) { const t = i / a.length; const f = 90 * Math.pow(0.33, t); ph += 2 * Math.PI * f / SR; a[i] = Math.sin(ph) * Math.pow(1 - t, 1.5); }
  wav('subdrop', norm(a));
}

/* ---------- WHOOSH (fast, air) ---------- */
{
  const a = sweepBP(noise(0.42), 380, 5200, 3.4);
  wav('whoosh', norm(env(a, 0.06, 0.34, 2.0)));
}
{
  const a = sweepBP(noise(0.5), 6000, 300, 3.4);
  wav('whoosh-down', norm(env(a, 0.05, 0.42, 1.6)));
}

/* ---------- RISER ---------- */
{
  const dur = 1.35, a = alloc(dur), nz = noise(dur);
  const sw = sweepBP(nz, 500, 9000, 3.0);
  let ph = 0;
  for (let i = 0; i < a.length; i++) {
    const t = i / a.length;
    const f = 220 * Math.pow(4.2, t);
    ph += 2 * Math.PI * f / SR;
    const trem = 0.75 + 0.25 * Math.sin(2 * Math.PI * (6 + 26 * t) * i / SR);
    a[i] = (sw[i] * 0.85 + Math.sin(ph) * 0.25 * trem) * Math.pow(t, 1.6);
  }
  wav('riser', norm(a));
}

/* ---------- TICK / CLICK ---------- */
{
  const a = env(noise(0.035), 0.0004, 0.03, 3.5);
  wav('tick', norm(hp(a, 2600)));
}
{
  const a = env(noise(0.06), 0.0006, 0.055, 3.0);
  wav('stamp', norm(lp(hp(a, 400), 5200)));
}

/* ---------- SWISH (net) ---------- */
{
  const dur = 0.34, nz = noise(dur);
  const b = sweepBP(nz, 3400, 1500, 3.2);
  wav('swish', norm(env(b, 0.004, 0.3, 2.4)));
}

/* ---------- GLITCH ---------- */
{
  const dur = 0.16, a = alloc(dur);
  for (let i = 0; i < a.length; i++) {
    const step = Math.floor(i / 90);
    a[i] = ((step * 2654435761) % 2048) / 1024 - 1;
  }
  wav('glitch', norm(env(lp(a, 7000), 0.001, 0.14, 2.0)));
}

/* ---------- AMBIENT BED (loopable ~9.6s): sub drone + soft pulse ---------- */
{
  const dur = 9.6, a = alloc(dur);
  const bpm = 100, beat = 60 / bpm;
  // drone: two detuned low sines + a fifth, slow filter movement
  let p1 = 0, p2 = 0, p3 = 0;
  for (let i = 0; i < a.length; i++) {
    const t = i / SR;
    p1 += 2 * Math.PI * 55 / SR; p2 += 2 * Math.PI * 55.35 / SR; p3 += 2 * Math.PI * 82.5 / SR;
    const swell = 0.72 + 0.28 * Math.sin(2 * Math.PI * t / dur);
    a[i] = (Math.sin(p1) * 0.5 + Math.sin(p2) * 0.34 + Math.sin(p3) * 0.13) * swell * 0.55;
  }
  // soft kick pulse every beat
  for (let b = 0; b * beat < dur; b++) {
    const st = Math.round(b * beat * SR);
    const accent = b % 4 === 0 ? 1 : 0.52;
    let ph = 0;
    for (let i = 0; i < Math.round(0.26 * SR) && st + i < a.length; i++) {
      const t = i / (0.26 * SR);
      const f = 46 + 74 * Math.pow(1 - t, 4);
      ph += 2 * Math.PI * f / SR;
      a[st + i] += Math.sin(ph) * Math.pow(1 - t, 2.6) * 0.42 * accent;
    }
  }
  // air layer
  const air = lp(hp(noise(dur), 4000), 12000);
  for (let i = 0; i < a.length; i++) a[i] += air[i] * 0.035;
  // equal-power crossfade tails for seamless loop
  const xf = Math.round(0.12 * SR);
  for (let i = 0; i < xf; i++) { const g = i / xf; a[i] *= g; a[a.length - 1 - i] *= g; }
  wav('bed', norm(a, 0.8));
}
