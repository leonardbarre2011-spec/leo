/**
 * A tiny synthesis kit. Every sound in the film is generated here from noise
 * and sine waves — no sample library, nothing downloaded. Each generator
 * returns a mono Float32Array that the mixer places on the timeline.
 */

const SR = 44100;
export const SAMPLE_RATE = SR;

// deterministic noise so two builds produce byte-identical audio
let seed = 0x2f6e2b1;
const rnd = () => {
  seed ^= seed << 13; seed >>>= 0;
  seed ^= seed >> 17;
  seed ^= seed << 5; seed >>>= 0;
  return (seed / 0xffffffff) * 2 - 1;
};

const buf = (dur) => new Float32Array(Math.max(1, Math.ceil(dur * SR)));

/** exponential decay envelope with a short attack to kill clicks */
const env = (n, i, { attack = 0.002, decay = 0.2, curve = 4 }) => {
  const t = i / SR;
  const a = t < attack ? t / attack : 1;
  return a * Math.exp((-curve * t) / decay);
};

/** state-variable band-pass — cheap, stable, good enough for percussion */
function svf(input, freqAt, q = 2) {
  const out = new Float32Array(input.length);
  let low = 0, band = 0;
  for (let i = 0; i < input.length; i++) {
    const f = 2 * Math.sin((Math.PI * Math.min(freqAt(i / input.length), SR * 0.45)) / SR);
    const high = input[i] - low - q * band;
    band += f * high;
    low += f * band;
    out[i] = band;
  }
  return out;
}

function lowpass(input, freqAt) {
  const out = new Float32Array(input.length);
  let z = 0;
  for (let i = 0; i < input.length; i++) {
    const f = Math.min(freqAt(i / input.length), SR * 0.45);
    const a = 1 - Math.exp((-2 * Math.PI * f) / SR);
    z += a * (input[i] - z);
    out[i] = z;
  }
  return out;
}

function highpass(input, freq) {
  const out = new Float32Array(input.length);
  const a = Math.exp((-2 * Math.PI * freq) / SR);
  let px = 0, py = 0;
  for (let i = 0; i < input.length; i++) {
    py = a * (py + input[i] - px);
    px = input[i];
    out[i] = py;
  }
  return out;
}

const noise = (dur) => {
  const b = buf(dur);
  for (let i = 0; i < b.length; i++) b[i] = rnd();
  return b;
};

const sine = (dur, freqAt, phase = 0) => {
  const b = buf(dur);
  let ph = phase;
  for (let i = 0; i < b.length; i++) {
    ph += (2 * Math.PI * freqAt(i / b.length)) / SR;
    b[i] = Math.sin(ph);
  }
  return b;
};

const mix = (...layers) => {
  const len = Math.max(...layers.map((l) => l.length));
  const out = buf(len / SR);
  for (const l of layers) for (let i = 0; i < l.length; i++) out[i] += l[i];
  return out;
};

const shape = (b, fn) => {
  const out = new Float32Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b[i] * fn(i, b.length);
  return out;
};

const gain = (b, g) => shape(b, () => g);

/* ------------------------------------------------------------------ *
 * The kit
 * ------------------------------------------------------------------ */

/** A ball meeting hardwood: sub thump + the leather slap on top. */
export function bounce({ pitch = 1, decay = 0.26, tone = 1 } = {}) {
  const d = decay + 0.1;
  const body = shape(
    sine(d, (p) => 132 * pitch * Math.exp(-2.4 * p) + 42 * pitch),
    (i) => env(0, i, { attack: 0.0016, decay, curve: 5 })
  );
  const slap = shape(
    svf(noise(0.09), () => 1500 * tone, 1.1),
    (i) => env(0, i, { attack: 0.0006, decay: 0.045, curve: 7 })
  );
  const air = shape(
    highpass(noise(0.05), 5200),
    (i) => env(0, i, { attack: 0.0004, decay: 0.02, curve: 8 })
  );
  return mix(gain(body, 0.85), gain(slap, 0.5), gain(air, 0.16));
}

/** Tighter, drier — a dribble in a quiet gym. */
export const dribble = (p = 1) => gain(bounce({ pitch: 1.5 * p, decay: 0.12, tone: 1.5 }), 0.72);

/** Interface tick. Short enough to feel mechanical, not beepy. */
export function click({ freq = 2600, decay = 0.012, level = 1 } = {}) {
  const b = shape(svf(noise(decay * 4), () => freq, 1.4), (i) =>
    env(0, i, { attack: 0.0004, decay, curve: 6 })
  );
  return gain(b, level);
}

/** Two-stage click — something locking into place. */
export const latch = () =>
  mix(click({ freq: 1900, decay: 0.015, level: 0.9 }), delay(click({ freq: 3400, decay: 0.008, level: 0.5 }), 0.026));

/** Paper: granular high noise, like a page being turned. */
export function paper(dur = 0.5, level = 1) {
  const b = buf(dur);
  let grain = 0;
  for (let i = 0; i < b.length; i++) {
    if (i >= grain) {
      grain = i + Math.floor((0.004 + Math.abs(rnd()) * 0.02) * SR);
      b[i] = rnd() * 1.6;
    } else b[i] = rnd() * 0.35;
  }
  const filt = highpass(svf(b, () => 4200, 0.9), 1800);
  return gain(
    shape(filt, (i, n) => Math.sin((Math.PI * i) / n) ** 1.4),
    0.5 * level
  );
}

/** Air moving past the camera. `dir` 1 = opening up, -1 = closing down. */
export function whoosh(dur = 0.45, dir = 1, level = 1) {
  const n = noise(dur);
  const f = (p) => (dir > 0 ? 260 + 3600 * p * p : 3200 * (1 - p) ** 1.6 + 200);
  const b = svf(n, f, 1.5);
  return gain(
    shape(b, (i, len) => {
      const p = i / len;
      return Math.sin(Math.PI * p) ** 1.5;
    }),
    0.42 * level
  );
}

/** Net. Nylon, not a cymbal. */
export function swish(level = 1) {
  const b = svf(noise(0.34), (p) => 2400 - 900 * p, 0.7);
  return gain(shape(b, (i) => env(0, i, { attack: 0.004, decay: 0.13, curve: 5 })), 0.4 * level);
}

/** Sneaker on a clean floor. */
export function squeak(dur = 0.16, level = 1) {
  const b = sine(dur, (p) => 820 + 620 * p + 90 * Math.sin(p * 42));
  const sh = shape(b, (i, n) => {
    const p = i / n;
    return Math.sin(Math.PI * p) ** 2;
  });
  const drive = new Float32Array(sh.length);
  for (let i = 0; i < sh.length; i++) drive[i] = Math.tanh(sh[i] * 2.6) * 0.34;
  return gain(highpass(drive, 500), level);
}

/** Sub drop for a hard cut. */
export function sub({ from = 62, to = 30, decay = 0.5, level = 1 } = {}) {
  const b = sine(decay + 0.3, (p) => from * Math.exp(-2.2 * p) + to);
  return gain(shape(b, (i) => env(0, i, { attack: 0.004, decay, curve: 3.4 })), 0.9 * level);
}

/** Tension build. Used once, before the turn. */
export function riser(dur = 1.2, level = 1) {
  const n = svf(noise(dur), (p) => 300 + 2800 * p ** 2.2, 1.9);
  const tone = sine(dur, (p) => 180 + 360 * p ** 2.4);
  const m = mix(gain(n, 0.55), gain(tone, 0.16));
  return gain(shape(m, (i, len) => (i / len) ** 2.4 * (1 - Math.max(0, i / len - 0.94) / 0.06)), 0.5 * level);
}

/** Soft, low confirmation tone for the product beats. */
export function blip(freq = 660, level = 1) {
  const b = mix(
    sine(0.3, () => freq),
    gain(sine(0.3, () => freq * 2.002), 0.22)
  );
  return gain(shape(b, (i) => env(0, i, { attack: 0.006, decay: 0.11, curve: 5 })), 0.2 * level);
}

/** Stamp — a heavy label hitting the page. */
export const stamp = () => mix(gain(sub({ from: 90, to: 46, decay: 0.18 }), 0.7), gain(click({ freq: 900, decay: 0.03 }), 0.8), gain(paper(0.12), 0.7));

/** Wooden-floor room tone for the tactical scenes — very low. */
export function drone(dur, root = 55, level = 1) {
  const partials = [1, 1.5, 2, 3, 4.02];
  const amps = [1, 0.32, 0.2, 0.09, 0.05];
  let out = buf(dur);
  partials.forEach((p, k) => {
    const s = sine(dur, (x) => root * p * (1 + 0.0015 * Math.sin(x * 9)));
    for (let i = 0; i < out.length; i++) out[i] += s[i] * amps[k];
  });
  out = lowpass(out, () => 900);
  return gain(
    shape(out, (i, n) => {
      const p = i / n;
      const fade = Math.min(1, p / 0.08) * Math.min(1, (1 - p) / 0.12);
      return fade;
    }),
    0.06 * level
  );
}

export function delay(b, seconds) {
  const off = Math.floor(seconds * SR);
  const out = buf((b.length + off) / SR);
  for (let i = 0; i < b.length; i++) out[i + off] += b[i];
  return out;
}

/* ------------------------------------------------------------------ *
 * Mixer
 * ------------------------------------------------------------------ */

export function createMixer(duration) {
  const n = Math.ceil(duration * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  return {
    /** pan: -1 left … 1 right */
    place(sound, at, { level = 1, pan = 0 } = {}) {
      const start = Math.floor(at * SR);
      const gl = level * Math.cos(((pan + 1) * Math.PI) / 4);
      const gr = level * Math.sin(((pan + 1) * Math.PI) / 4);
      for (let i = 0; i < sound.length; i++) {
        const j = start + i;
        if (j < 0 || j >= n) continue;
        L[j] += sound[i] * gl * 1.414;
        R[j] += sound[i] * gr * 1.414;
      }
    },
    render() {
      // gentle soft-clip so stacked transients never crack
      const out = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        out[i * 2] = Math.tanh(L[i] * 0.9);
        out[i * 2 + 1] = Math.tanh(R[i] * 0.9);
      }
      return out;
    },
  };
}

export function encodeWav(interleaved, channels = 2) {
  const bytes = interleaved.length * 2;
  const b = Buffer.alloc(44 + bytes);
  b.write('RIFF', 0);
  b.writeUInt32LE(36 + bytes, 4);
  b.write('WAVE', 8);
  b.write('fmt ', 12);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(channels, 22);
  b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * channels * 2, 28);
  b.writeUInt16LE(channels * 2, 32);
  b.writeUInt16LE(16, 34);
  b.write('data', 36);
  b.writeUInt32LE(bytes, 40);
  for (let i = 0; i < interleaved.length; i++) {
    const v = Math.max(-1, Math.min(1, interleaved[i]));
    b.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  return b;
}
