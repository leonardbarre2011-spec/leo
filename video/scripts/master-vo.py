"""
Masters the raw voice-over: high-pass, presence lift, soft-knee compression and
a limiter. The delivered narration peaks at -5.5 dBFS with a ~20 dB crest
factor, which is far too quiet and too dynamic to sit forward of music and
impacts on a phone speaker. Everything else in the mix is levelled against the
output of this script.
"""
import wave, numpy as np, sys

SR = 48000
src, dst = sys.argv[1], sys.argv[2]

w = wave.open(src)
assert w.getframerate() == SR and w.getnchannels() == 1
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0


def one_pole_hp(a, fc):
    dt, rc = 1.0 / SR, 1.0 / (2 * np.pi * fc)
    al = rc / (rc + dt)
    y = np.empty_like(a)
    prev_y = prev_x = 0.0
    for i, v in enumerate(a):
        prev_y = al * (prev_y + v - prev_x)
        prev_x = v
        y[i] = prev_y
    return y


def one_pole_lp(a, fc):
    dt, rc = 1.0 / SR, 1.0 / (2 * np.pi * fc)
    al = dt / (rc + dt)
    y = np.empty_like(a)
    prev = 0.0
    for i, v in enumerate(a):
        prev += al * (v - prev)
        y[i] = prev
    return y


# 1. clean the bottom, then add a little 2-5 kHz presence for consonant clarity
x = one_pole_hp(x, 95.0)
presence = x - one_pole_lp(x, 2200.0)
x = x + presence * 0.35

# 2. soft-knee compression, 3.5:1 above -24 dBFS
thr = 10 ** (-24 / 20)
ratio, knee = 4.0, 6.0
atk = np.exp(-1.0 / (0.004 * SR))
rel = np.exp(-1.0 / (0.140 * SR))

env = np.empty_like(x)
e = 0.0
for i, v in enumerate(np.abs(x)):
    e = (atk if v > e else rel) * e + (1 - (atk if v > e else rel)) * v
    env[i] = e

env_db = 20 * np.log10(np.maximum(env, 1e-9))
thr_db = 20 * np.log10(thr)
over = env_db - thr_db
gain_db = np.where(
    over <= -knee / 2,
    0.0,
    np.where(
        over >= knee / 2,
        (1 / ratio - 1) * over,
        (1 / ratio - 1) * (over + knee / 2) ** 2 / (2 * knee),
    ),
)
x = x * (10 ** (gain_db / 20))

# 3. make-up, then a look-ahead-free soft limiter to hold the ceiling
x *= 10 ** (14.0 / 20)
CEIL = 0.92
x = np.tanh(x / CEIL * 0.92) * CEIL

peak = np.abs(x).max()
rms = float(np.sqrt((x ** 2).mean()))
print("peak %.3f (%.1f dBFS)  rms %.4f (%.1f dBFS)" % (peak, 20 * np.log10(peak), rms, 20 * np.log10(rms)))

o = wave.open(dst, "w")
o.setnchannels(1)
o.setsampwidth(2)
o.setframerate(SR)
o.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
o.close()
