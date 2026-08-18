"""
Verifies the one rule the sound design must never break: the voice has to be
clearly louder than everything else. The speech mask is derived from the
mastered voice-over's own energy rather than from word timings, so the
"non-speech" measurement really is music and effects only.
"""
import wave, numpy as np, sys

def rd(p):
    w = wave.open(p)
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768, w.getframerate()

mix, sr = rd(sys.argv[1])
vo, vsr = rd(sys.argv[2])
offset = int(float(sys.argv[3]) * sr)

# voice activity: 20 ms RMS over the isolated voice track, 40 dB below its peak
win = int(0.02 * sr)
n = len(vo) // win
env = np.sqrt((vo[: n * win].reshape(n, win) ** 2).mean(axis=1))
gate = env.max() * 10 ** (-34 / 20)
active = np.repeat(env > gate, win)
# widen by 60 ms either side so transients and tails count as speech
pad = 3
active = np.convolve(active, np.ones(pad * 2 + 1), 'same') > 0

mask = np.zeros(len(mix), bool)
end = min(len(mix), offset + len(active))
mask[offset:end] = active[: end - offset]

db = lambda v: 20 * np.log10(max(float(v), 1e-9))
rms = lambda a: float(np.sqrt((a ** 2).mean())) if len(a) else 0.0

speech, other = mix[mask], mix[~mask]
print('peak            %.1f dBFS   clipped samples: %d' % (db(np.abs(mix).max()), int((np.abs(mix) > 0.999).sum())))
print('voice RMS       %.1f dBFS' % db(rms(speech)))
print('sfx+music RMS   %.1f dBFS' % db(rms(other)))
print('voice advantage %.1f dB' % (db(rms(speech)) - db(rms(other))))

w = int(0.1 * sr)
worst, wt = 0.0, 0.0
for i in range(0, len(mix) - w, w // 2):
    if mask[i:i + w].any():
        continue
    r = rms(mix[i:i + w])
    if r > worst:
        worst, wt = r, i / sr
print('loudest effects-only 100 ms: %.1f dBFS at %.2fs (%.1f dB under the voice)'
      % (db(worst), wt, db(rms(speech)) - db(worst)))
