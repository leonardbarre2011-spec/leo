"""SFX bed for an episode + mix with the voice (no music: the background track,
"Numbers" by TEMPOREX, is added inside TikTok from its sound library).
Usage: python3 src/sfx.py <episode>  ->  build/<ep>/mix.wav"""
import json, os, subprocess, sys, wave
import numpy as np

EP = sys.argv[1]
SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(HERE, "..", "build", EP)
D = json.load(open(os.path.join(B, "words.json")))
TOTAL = D["duration"] + 0.8
N = int(TOTAL * SR)
rng = np.random.default_rng(7)
out = np.zeros(N)


def tw(line, wi=0):
    ws = [w for w in D["words"] if w["line"] == line]
    return ws[min(wi, len(ws) - 1)]["t0"]


def T(n): return np.arange(int(n * SR)) / SR
def env(t, a=0.003, d=0.3): return np.minimum(1, t / a) * np.exp(-t / d)
def osc(freqs): return np.sin(2 * np.pi * np.cumsum(freqs) / SR)
def smooth(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
def noise(n): return rng.standard_normal(int(n * SR))


def add(sig, t, g=1.0):
    i = int(max(0, t) * SR); j = min(N, i + len(sig))
    if i < N: out[i:j] += sig[: j - i] * g


def click():
    t = T(0.2); return noise(0.2) * env(t, 0.0003, 0.004) + np.sin(2 * np.pi * 1800 * t) * env(t, 0.0003, 0.01) * 0.6
def boom():
    t = T(1.2); return osc(np.linspace(85, 28, len(t))) * env(t, 0.002, 0.4)
def whoosh(d=0.6, up=True):
    t = T(d); x = smooth(noise(d), 6) - smooth(noise(d), 40); return x * np.sin(np.pi * t / d) ** 2 * 1.2
def siren(d=1.6):
    t = T(d); f = 700 + 350 * np.sin(2 * np.pi * 1.6 * t); return (np.sign(osc(f)) * 0.3 + osc(f)) * np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.2) * 0.5
def tick(): return click() * 0.6
def bell(f=660, d=1.2):
    t = T(d); return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.5 * t) + 0.3 * np.sin(2 * np.pi * f * 4 * t)) * env(t, 0.002, 0.4)
def splash():
    t = T(0.9); x = smooth(noise(0.9), 3) * env(t, 0.005, 0.18); x += smooth(noise(0.9), 12) * env(t, 0.02, 0.35) * 0.8; return x
def trombone():
    s = np.zeros(0)
    for i, (f, d) in enumerate([(311, 0.32), (294, 0.32), (277, 0.32), (262, 0.9)]):
        t = T(d); vib = 1 + (0.012 * np.sin(2 * np.pi * 6 * t) if i == 3 else 0)
        w = osc(f * vib * np.ones(len(t))); w = np.tanh(2.5 * w) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.06)
        s = np.concatenate([s, w])
    return s * 0.45
def flap(d=1.2):
    t = T(d); return smooth(noise(d), 8) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * t))) * 0.5
def scrape():
    t = T(0.45); return (smooth(noise(0.45), 3) - smooth(noise(0.45), 25)) * np.sin(np.pi * t / 0.45) * 0.9
def bubbles(d=2.0):
    s = np.zeros(int(d * SR))
    for k in range(int(d * 9)):
        t = T(0.08); b = osc(np.linspace(300 + rng.random() * 500, 900 + rng.random() * 600, len(t))) * env(t, 0.002, 0.03)
        i = int(rng.random() * (len(s) - len(b))); s[i:i + len(b)] += b * 0.5
    return s
def slide(f0, f1, d=0.8):
    t = T(d); return osc(np.linspace(f0, f1, len(t))) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.08) * 0.5
def plink():
    t = T(0.6); return (np.sin(2 * np.pi * 2400 * t) + 0.6 * np.sin(2 * np.pi * 3600 * t)) * env(t, 0.001, 0.12) * 0.6
def knock():
    t = T(0.15); return (osc(np.linspace(180, 90, len(t))) + smooth(noise(0.15), 4) * 0.5) * env(t, 0.001, 0.03)
def kaching():
    s = np.zeros(int(1.0 * SR)); a = plink(); s[:len(a)] += a
    b = bell(1320, 0.8) * 0.5; i = int(0.12 * SR); s[i:i + len(b)] += b[: len(s) - i]
    return s
def jet(d=2.0):
    t = T(d); x = smooth(noise(d), 5) * (0.8 + 0.2 * np.sin(2 * np.pi * 13 * t)); return x * np.minimum(1, t / 0.1) * np.minimum(1, (d - t) / 0.3) * 0.7
def crickets(d=1.6):
    t = T(d); return np.sin(2 * np.pi * 4500 * t) * (np.sin(2 * np.pi * 30 * t) > 0.3) * (np.sin(2 * np.pi * 2.5 * t) > 0) * 0.12
def shimmer(d=1.4):
    s = np.zeros(int(d * SR))
    for k, m in enumerate([72, 76, 79, 84, 88, 91, 96]):
        b = bell(440 * 2 ** ((m - 69) / 12), 0.9) * 0.35; i = int(k * 0.1 * SR); s[i:i + len(b)] += b[: len(s) - i]
    return s
def cheer(d=1.8):
    t = T(d); x = smooth(noise(d), 6) - smooth(noise(d), 60); return x * np.minimum(1, t / 0.15) * np.exp(-np.maximum(0, t - 0.9) / 0.4) * 1.2
def pop():
    t = T(0.12); return osc(np.linspace(400, 1400, len(t))) * env(t, 0.001, 0.03)
def snore(d=1.4):
    t = T(d); return smooth(noise(d), 30) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.9 * t)) ** 2 * 1.5


C = {}
C["gravity"] = lambda: [
    (whoosh(1.2), 0.0, 0.5), (tick(), tw(0, 7), 0.5), (bell(), tw(0, 7) + 0.05, 0.25),
    (siren(2.0), tw(1), 0.35), (whoosh(0.5), tw(2) + 0.1, 0.4), (pop(), tw(3) + 0.3, 0.4),
    (scrape(), tw(7) + 0.2, 0.25), (whoosh(0.9), tw(7, 7), 0.8), (flap(1.3), tw(8, 4), 0.35),
    (tick(), tw(8, 7), 0.5), (bell(520), tw(10) + 0.4, 0.2), (snore(1.6), tw(11) + 0.3, 0.5),
    (snore(1.6), tw(12) + 0.3, 0.4), (whoosh(0.4), tw(13) + 1.0, 0.4),
    (boom(), tw(14), 1.0), (click(), tw(14), 0.8), (slide(1200, 300, 0.5), tw(15), 0.35), (splash(), tw(15) + 0.55, 0.9),
    (tick(), tw(17, 5), 0.5), (bell(), tw(17, 5) + 0.05, 0.2), (pop(), tw(17, 8) + 0.5, 0.35),
    (trombone(), tw(19) + 0.2, 0.55),
]
C["snow"] = lambda: [
    (shimmer(1.4), 0.0, 0.25), (whoosh(0.6), tw(0, 9) - 0.1, 0.3),
    (splash(), tw(1) + 0.3, 0.25), (scrape(), tw(2) + 0.1, 0.5), (scrape(), tw(2) + 0.6, 0.5), (scrape(), tw(2) + 1.1, 0.5),
    (whoosh(1.0), tw(4), 0.3), (cheer(1.4), tw(5), 0.35), (boom(), tw(7), 0.6), (whoosh(0.8), tw(7), 0.5),
    (slide(400, 1400, 0.8), tw(8), 0.25), (bubbles(2.4), tw(8, 5), 0.6), (slide(900, 150, 1.0), tw(9) + 0.2, 0.45),
    (plink(), tw(10) + 0.3, 0.4), (plink(), tw(10) + 0.8, 0.35),
    (knock(), tw(11) + 0.6, 0.9), (knock(), tw(11) + 0.8, 0.9), (knock(), tw(11) + 1.0, 0.9),
    (pop(), tw(13) + 0.2, 0.4), (kaching(), tw(14) + 0.3, 0.6), (kaching(), tw(15) + 0.5, 0.6), (kaching(), tw(15) + 1.2, 0.5),
    (whoosh(1.4), tw(17), 0.45), (trombone(), tw(18) + 0.1, 0.5), (kaching(), tw(19) + 0.6, 0.35),
]
C["wish"] = lambda: [
    (shimmer(1.4), 0.0, 0.3), (cheer(1.2), tw(0, 8), 0.3),
    (plink(), tw(1) + 0.85, 0.6), (splash(), tw(1) + 0.9, 0.45),
    (pop(), tw(2) + 0.1, 0.5), (splash(), tw(2, 5), 0.9), (slide(300, 1300, 0.8), tw(3) + 0.5, 0.4),
    (jet(2.0), tw(4), 0.4), (jet(1.6), tw(4, 5), 0.3), (whoosh(0.8), tw(5), 0.3),
    (plink(), tw(6) + 0.85, 0.6), (splash(), tw(6) + 0.9, 0.45), (crickets(1.6), tw(7), 0.9),
    (slide(900, 500, 0.3), tw(9), 0.3), (splash(), tw(10) + 0.7, 0.5), (plink(), tw(13, 6) + 0.2, 0.6),
    (shimmer(1.6), tw(14), 0.5), (bell(880, 1.5), tw(15) + 0.2, 0.3), (whoosh(1.4), tw(16), 0.3),
    (shimmer(1.6), tw(17) + 0.6, 0.6), (boom(), tw(17, 5), 0.5), (cheer(1.8), tw(17, 6), 0.5),
    (splash(), tw(18) + 0.3, 0.6), (splash(), tw(18) + 0.7, 0.5), (slide(200, 1600, 1.0), tw(19), 0.35),
    (jet(1.9), tw(20), 0.6), (jet(1.6), tw(20) + 0.2, 0.4), (jet(1.6), tw(21), 0.4), (splash(), tw(21) + 0.5, 0.4), (cheer(1.5), tw(21) + 0.3, 0.35),
]

for sig, t, g in C[EP]():
    add(np.asarray(sig, dtype=float), t, g)
out /= max(1.0, np.max(np.abs(out)))
with wave.open(os.path.join(B, "sfx.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 0.9 * 32767).astype(np.int16).tobytes())

subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", os.path.join(B, "voice.wav"), "-i", os.path.join(B, "sfx.wav"),
                "-filter_complex", "[0:a]aresample=44100,apad[v];[1:a]volume=0.5[s];[v][s]amix=inputs=2:normalize=0:duration=shortest,"
                f"atrim=0:{TOTAL:.3f},alimiter=limit=0.95,loudnorm=I=-14:TP=-1.0",
                "-ar", "44100", "-ac", "2", os.path.join(B, "mix.wav")], check=True)
print("mix ok", EP, round(TOTAL, 2))
