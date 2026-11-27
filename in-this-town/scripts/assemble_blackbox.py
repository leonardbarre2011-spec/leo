# Build the black-box soundtrack: radio-filtered crew lines on a timeline + the "keys" chant.
import glob, json, subprocess, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

SC = sys.argv[1]
OUT = "public/jupiter2"
SR = 48000
LINES = [
    ("MATEO", "Guys... the keys are moving!"),
    ("IShowSpeed", "What was that?!"),
    ("KreekCraft", "It's in the vents! It's in the vents!"),
    ("Joe Bartolozzi", "Get the gun! Get the gun!"),
    ("CaseOh", "I got a gun!"),
    ("IShowSpeed", "Hold the door! I'll hold the door!"),
    ("KreekCraft", "Mayday, mayday, this is Odyssey JX-11!"),
    ("CaseOh", "Reloading!"),
    ("Joe Bartolozzi", "It's open."),
    ("???", "KEYS. KEYS. KEYS."),
]
GAPS = [0.5, 0.35, 0.3, 0.3, 0.35, 0.3, 0.35, 0.6, 0.6, 0.4]
files = sorted(glob.glob(f"{SC}/bb/line*.wav"))
assert len(files) == len(LINES), files

def load(f):
    y, sr = sf.read(f)
    if y.ndim > 1: y = y.mean(1)
    return resample_poly(y, SR, sr)

def trim(y):
    idx = np.nonzero(np.abs(y) > 0.01)[0]
    return y[max(0, idx[0] - 1200): idx[-1] + 3000] if len(idx) else y

bp = butter(4, [350, 3400], btype="band", fs=SR, output="sos")
def radio(y):
    y = sosfilt(bp, y)
    y = np.tanh(y * 3.0) / np.tanh(3.0)
    rng = np.random.default_rng(1)
    return y + rng.normal(0, 0.012, len(y))

def chant(y):
    base = trim(y)
    layers = []
    for k, (up, down) in enumerate([(1, 1), (4, 5), (5, 4), (3, 4)]):
        z = resample_poly(base, up, down)
        layers.append(np.pad(z, (int(k * 0.03 * SR), 0)))
    n = max(len(z) for z in layers)
    mix = sum(np.pad(z, (0, n - len(z))) for z in layers) / 2.2
    return mix

t = 2.8
timeline = np.zeros(int(60 * SR))
meta = []
for i, (f, (who, text)) in enumerate(zip(files, LINES)):
    y = trim(load(f))
    if who == "???":
        y = chant(y)
        sf.write(f"{OUT}/keys_chant.wav", np.stack([y, y], 1) * 0.9, SR)
    y = radio(y)
    y = y / (np.max(np.abs(y)) + 1e-9) * 0.85
    s = int(t * SR)
    timeline[s:s + len(y)] += y
    meta.append({"who": who, "text": text, "start": round(t, 2), "dur": round(len(y) / SR, 2)})
    t += len(y) / SR + GAPS[i]
end = t + 1.6
timeline = timeline[: int((end + 0.5) * SR)]
sf.write(f"{SC}/bb_raw.wav", timeline, SR)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{SC}/bb_raw.wav", "-af", "loudnorm=I=-15:TP=-1.5:LRA=9", "-ar", "48000", "-b:a", "192k", f"{OUT}/voiceover.mp3"], check=True)
json.dump({"lines": meta, "end": round(end, 2)}, open(f"{OUT}/lines.json", "w"), indent=1)
for m in meta: print(m)
print("END", round(end, 2))
