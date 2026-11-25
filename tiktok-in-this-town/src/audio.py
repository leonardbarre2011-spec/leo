"""Synthesize royalty-free background music + SFX timed on the narration,
then mix with the voice. Output: build/mix.wav"""
import json, os, subprocess
import numpy as np
import wave

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "..", "build", "sun")
D = json.load(open(os.path.join(BUILD, "words.json")))
TOTAL = D["duration"] + 0.8
N = int(TOTAL * SR)
rng = np.random.default_rng(1)


def tw(line, wi=0):
    ws = [w for w in D["words"] if w["line"] == line]
    return ws[min(wi, len(ws) - 1)]["t0"]


def env(n, a=0.003, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def add(buf, sig, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def note(f, dur, kind="marimba"):
    n = int(dur * SR)
    t = np.arange(n) / SR
    if kind == "marimba":
        s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)
        return s * env(n, 0.002, 0.22)
    if kind == "bass":
        s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)
        return s * env(n, 0.005, 0.35)
    if kind == "pluck":
        s = np.sign(np.sin(2 * np.pi * f * t)) * 0.3 + np.sin(2 * np.pi * f * t)
        return s * env(n, 0.002, 0.08)


def mtof(m):
    return 440 * 2 ** ((m - 69) / 12)


# ------------------------------------------------------------------ music
music = np.zeros(N)
BPM = 124
beat = 60 / BPM
prog = [(60, [0, 4, 7]), (57, [0, 3, 7]), (53, [0, 4, 7]), (55, [0, 4, 7])]  # C Am F G
arp = [0, 1, 2, 1, 0, 2, 1, 2]
t = 0.0; bar = 0
kick = (np.sin(2 * np.pi * np.cumsum(np.linspace(120, 45, int(0.18 * SR))) / SR) * env(int(0.18 * SR), 0.001, 0.07))
hat = rng.standard_normal(int(0.04 * SR)) * env(int(0.04 * SR), 0.0005, 0.01)
hat = np.diff(hat, prepend=0)
while t < TOTAL:
    root, tri = prog[bar % 4]
    for k in range(8):
        tt = t + k * beat / 2
        m = root + 12 + tri[arp[k]] + (12 if (bar % 8 >= 4 and k in (3, 7)) else 0)
        add(music, note(mtof(m), 0.4), tt, 0.32)
        add(music, hat, tt + beat / 4, 0.10)
    for k in range(4):
        add(music, kick, t + k * beat, 0.55 if k % 2 == 0 else 0.35)
        add(music, note(mtof(root - 12), 0.45, "bass"), t + k * beat, 0.32)
    # little melody every other bar
    if bar % 2 == 1:
        for k, iv in enumerate([7, 9, 7, 4]):
            add(music, note(mtof(root + 24 + iv - (12 if iv > 8 else 0)), 0.3, "pluck"), t + k * beat, 0.12)
    t += 4 * beat; bar += 1

# dramatic drop at "Until last Tuesday" and short drop at "Midnight"
def duck(buf, t0, t1, g, fade=0.05):
    i0, i1 = int(t0 * SR), int(t1 * SR)
    f = int(fade * SR)
    e = np.ones(len(buf))
    e[i0:i1] = g
    e[max(0, i0 - f):i0] = np.linspace(1, g, min(f, i0))
    e[i1:i1 + f] = np.linspace(g, 1, len(e[i1:i1 + f]))
    buf *= e

duck(music, tw(5) - 0.05, tw(6), 0.0, 0.02)
duck(music, tw(14), tw(16), 0.35)          # sleeping old man: quieter
duck(music, D["duration"] + 0.1, TOTAL, 0.0, 0.5)

# ------------------------------------------------------------------ sfx
sfx = np.zeros(N)
def click(big=False):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    s = rng.standard_normal(n) * env(n, 0.0003, 0.004) * 1.0
    s += np.sin(2 * np.pi * 1800 * t) * env(n, 0.0003, 0.01) * 0.6
    s += np.sin(2 * np.pi * 90 * t) * env(n, 0.001, 0.06 if big else 0.03) * (1.2 if big else 0.5)
    return s

for line in (2, 3):
    add(sfx, click(), tw(line, 4), 0.9)
add(sfx, click(True), tw(17), 1.0)
# boom under the big click
n = int(1.2 * SR); tt = np.arange(n) / SR
boom = np.sin(2 * np.pi * np.cumsum(np.linspace(80, 30, n)) / SR) * env(n, 0.002, 0.35)
add(sfx, boom, tw(17), 0.9)
# fast flicker clicks during the 80-years montage (every 0.22s)
t = tw(4)
while t < tw(5) - 0.1:
    add(sfx, click(), t, 0.35); t += 0.22
# record scratch-ish stop at "Until last Tuesday"
n = int(0.35 * SR); tt = np.arange(n) / SR
scr = np.sin(2 * np.pi * np.cumsum(np.linspace(900, 120, n)) / SR) * env(n, 0.002, 0.12)
scr += rng.standard_normal(n) * env(n, 0.001, 0.05) * 0.3
add(sfx, scr, tw(5) - 0.08, 0.5)
# clock ticks + chime
tick = click() * 0.6
for line in (6, 7, 8):
    for k in range(3):
        add(sfx, tick, tw(line) + k * 0.18, 0.5)
    n = int(1.2 * SR); tt = np.arange(n) / SR
    bell = (np.sin(2 * np.pi * 660 * tt) + 0.5 * np.sin(2 * np.pi * 1650 * tt) + 0.3 * np.sin(2 * np.pi * 2640 * tt)) * env(n, 0.002, 0.4)
    add(sfx, bell, tw(line) + 0.05, 0.22)
# roosters: chirpy FM squawks
for k in range(6):
    n = int(0.28 * SR); tt = np.arange(n) / SR
    f = np.linspace(700 + 150 * (k % 3), 1300, n) + 250 * np.sin(2 * np.pi * 35 * tt)
    sq = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * env(n, 0.01, 0.12)
    add(sfx, sq, tw(12) + k * 0.27, 0.09)
# crowd cheer: band noise swell
n = int(1.7 * SR); tt = np.arange(n) / SR
cr = rng.standard_normal(n)
cr = np.convolve(cr, np.ones(6) / 6, mode="same") - np.convolve(cr, np.ones(60) / 60, mode="same")
cr *= np.minimum(1, tt / 0.15) * np.exp(-np.maximum(0, tt - 0.8) / 0.4)
add(sfx, cr, tw(18), 0.55)
# alarm clocks
n = int(2.2 * SR); tt = np.arange(n) / SR
al = (np.sin(2 * np.pi * 2300 * tt) + np.sin(2 * np.pi * 2900 * tt)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * tt)))
al *= (np.sin(2 * np.pi * 2.2 * tt) > -0.3)
al *= np.minimum(1, tt / 0.02) * np.minimum(1, (2.2 - tt) / 0.2)
add(sfx, al, tw(22) + 0.1, 0.06)
# beach waves
n = int((TOTAL - tw(24)) * SR); tt = np.arange(n) / SR
wv = rng.standard_normal(n)
wv = np.convolve(wv, np.ones(40) / 40, mode="same") * (0.5 + 0.5 * np.sin(2 * np.pi * 0.35 * tt)) * np.minimum(1, tt / 0.3)
add(sfx, wv, tw(24), 0.5)
# whoosh into the beach
n = int(0.5 * SR); tt = np.arange(n) / SR
wh = rng.standard_normal(n); wh = np.convolve(wh, np.ones(12) / 12, mode="same") * np.sin(np.pi * tt / 0.5) ** 2
add(sfx, wh, tw(24) - 0.25, 0.45)


def write(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


music /= np.max(np.abs(music)) + 1e-9
sfx /= max(1.0, np.max(np.abs(sfx)))
write(os.path.join(BUILD, "music.wav"), music * 0.9)
write(os.path.join(BUILD, "sfx.wav"), sfx * 0.9)

# mix: voice on top, music ducked under the voice (sidechain), sfx
subprocess.run([
    "ffmpeg", "-loglevel", "error", "-y",
    "-i", os.path.join(BUILD, "voice.wav"), "-i", os.path.join(BUILD, "music.wav"), "-i", os.path.join(BUILD, "sfx.wav"),
    "-filter_complex",
    "[0:a]aresample=44100,apad,asplit=2[v][vsc];"
    "[1:a]volume=0.20[m];"
    "[m][vsc]sidechaincompress=threshold=0.04:ratio=4:attack=20:release=250[md];"
    "[2:a]volume=0.55[s];"
    "[v][md][s]amix=inputs=3:normalize=0:duration=shortest,atrim=0:" + f"{TOTAL:.3f}" + ",alimiter=limit=0.95,loudnorm=I=-14:TP=-1.0",
    "-ar", "44100", "-ac", "2", os.path.join(BUILD, "mix.wav")], check=True)
print("mix ok", TOTAL)
