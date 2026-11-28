"""Synthesised soundtrack for 'La dernière transformation' (48 s). Writes out/audio.wav."""
import numpy as np, wave, os

SR = 44100
DUR = 48.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
mix = np.zeros((N, 2))
t_all = np.arange(N) / SR

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * gain * l * 1.414
    mix[i:i + len(sig), 1] += sig * gain * r * 1.414

def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[na:na + nd] = np.linspace(1, s, nd)[: max(0, min(nd, n - na))]
    e[-nr:] *= np.linspace(1, 0, nr)
    return e

def mtof(m): return 440 * 2 ** ((m - 69) / 12)

def piano(m, dur=2.5, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = mtof(m)
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.6 + k * 0.9)) for k, a in [(1, 1), (2, .45), (3, .2), (4, .1)])
    s *= np.minimum(1, t / 0.004)
    return s * vel * 0.22

def pad(ms, dur, vol=0.05):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for m in ms:
        f = mtof(m)
        s += np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.003 * t) + 0.15 * np.sin(2 * np.pi * f * 0.5 * t)
    return s * env_adsr(n, dur * 0.35, 0.1, 1, dur * 0.35) * vol / len(ms)

def noise(dur): return rng.standard_normal(int(dur * SR))

def lowpass(x, a):  # one-pole
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y

def lp_fast(x, k):  # moving-average low-pass (vectorised)
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(k - 1)])

# ---------------- sad music 0 -> 35 s ----------------
prog = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])]  # Am F C G
beat = 0.5
t = 0.0; bar = 0
while t < 34.6:
    root, ch = prog[bar % 4]
    add(pad([root - 12] + ch, 4.4, 0.06), t, pan=0)
    add(piano(root - 12, 3.5, .8), t, pan=-.2)
    arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12, ch[2] + 12]
    for i, m in enumerate(arp):
        if t + i * beat < 34.8:
            add(piano(m, 2.2, .55 + .1 * (i == 0)), t + i * beat, pan=.25)
    t += 4.0; bar += 1
# melody accents in the flashbacks
mel = [(11.3, 76), (12.3, 74), (13.3, 72), (14.3, 71), (17.0, 72), (18.0, 71), (19.0, 69), (22.3, 76), (23.3, 77), (24.3, 76), (25.3, 74),
       (28.0, 72), (29.0, 74), (30.0, 76), (31.0, 79)]
for st, m in mel: add(piano(m, 3.0, .9), st, pan=.1)

# fade the music down at the hit -> silence
fade = np.ones(N)
i0, i1 = int(34.7 * SR), int(35.05 * SR)
fade[i0:i1] = np.linspace(1, 0, i1 - i0); fade[i1:] = 0
mix *= fade[:, None]

# ---------------- crowd ----------------
cr = lp_fast(noise(DUR), 18) * 0.9 + lp_fast(noise(DUR), 5) * 0.25
cr_env = np.interp(t_all, [0, 4, 8.5, 10, 32, 35, 37.4, 37.6, 39, 43, 46, 48], [.35, .35, .3, .05, .03, .02, 0, 1.6, 1.4, 1.0, .5, 0])
cr_env *= 1 + 0.15 * np.sin(2 * np.pi * 0.7 * t_all)
mix[:, 0] += cr * cr_env * 0.25; mix[:, 1] += np.roll(cr, 300) * cr_env * 0.25

# ---------------- heartbeat 8.5 -> 34.7 ----------------
def thump(f=55, dur=.18, g=1):
    n = int(dur * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tt * (1 - .3 * tt / dur)) * np.exp(-tt * 22) * g
t = 8.6
while t < 34.6:
    k = (t - 8.6) / 26
    add(thump(55, .2, .9), t); add(thump(50, .2, .6), t + .22)
    t += 60 / (68 + 50 * k)

# ---------------- whooshes at flashback cuts ----------------
def whoosh(d=.6):
    n = int(d * SR); x = noise(d); tt = np.arange(n) / SR
    return lp_fast(x, 6) * np.sin(np.pi * tt / d) ** 2 * .5
for s in [11.2, 16.5, 22.0, 27.5]: add(whoosh(.7), s - .35, .8)
for s in [15.5, 21.0, 26.5, 32.0]: add(whoosh(.5), s - .25, .6)

# rain in the cemetery
rain = lp_fast(noise(4.5), 3) * 0.12
add(rain * env_adsr(len(rain), .3, .1, 1, .3), 27.5, 1.0)

# ---------------- kick ----------------
def kick_thud():
    n = int(.35 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 90 * tt * (1 - tt)) * np.exp(-tt * 18) + lp_fast(noise(.35), 3) * np.exp(-tt * 60) * .6)
add(kick_thud(), 32.66, 1.0)
add(whoosh(.9), 32.7, .5)

# ---------------- post clang ----------------
n = int(2.4 * SR); tt = np.arange(n) / SR
clang = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, a, d in [(523, 1, 2.2), (1307, .6, 3), (2150, .4, 4), (3390, .25, 6), (240, .5, 5)])
clang += lp_fast(noise(2.4), 2) * np.exp(-tt * 40) * .8
add(clang * .45, 35.0)

# ---------------- whistle + roar + triumphant music ----------------
n = int(.9 * SR); tt = np.arange(n) / SR
whistle = np.sin(2 * np.pi * (2900 + 120 * np.sin(2 * np.pi * 28 * tt)) * tt) * env_adsr(n, .01, .05, .8, .1) * .18
add(whistle, 37.35)

prog2 = [(48, [60, 64, 67]), (55, [59, 62, 67]), (57, [60, 64, 69]), (53, [60, 65, 69])]  # C G Am F
t = 37.6; bar = 0
while t < 47.5:
    root, ch = prog2[bar % 4]
    d = 2.0
    add(pad([root - 12, root] + ch, d + .4, .09), t)
    for i in range(4):
        add(piano(ch[i % 3] + 12, 1.2, .7), t + i * .5, pan=.3)
        add(thump(70, .25, .9), t + i * .5)  # drum pulse
    add(piano(root - 12, 2, 1), t, pan=-.3)
    t += d; bar += 1
# soften the end
mix[int(43.3 * SR):] *= np.interp(t_all[int(43.3 * SR):], [43.3, 44, 47.5, 48], [1, .75, .6, 0])[:, None]

# ---------------- master ----------------
peak = np.max(np.abs(mix)); mix = np.tanh(mix / peak * 1.4) * 0.89
os.makedirs('out', exist_ok=True)
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', mix.shape)
