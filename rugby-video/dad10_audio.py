"""'My Dad's Number 10' — narration (Piper TTS), music, SFX and timeline.json for the animation.
Run from rugby-video/:  python3 dad10_audio.py   -> out/dad10_audio.wav + timeline.json
"""
import json, os, wave, io
import numpy as np
from piper import PiperVoice, SynthesisConfig

SR = 44100
rng = np.random.default_rng(3)

VOICES = {  # speaker -> (model, length_scale, gain, pan)
    'N':    ('voices/en_US-ryan-high.onnx', 1.08, 1.0, 0.0),
    'DAD':  ('voices/en_US-norman-medium.onnx', 1.15, 1.0, -0.05),
    'DADECHO': ('voices/en_US-norman-medium.onnx', 1.25, 0.75, 0.0),
    'KYLE': ('voices/en_US-bryce-medium.onnx', 1.0, 1.0, 0.1),
    'ANN':  ('voices/en_US-joe-medium.onnx', 0.92, 0.9, 0.0),
}

SPEC = [
 ('hook', [('pause', .5), ('N', "My dad gave me his old jersey..."), ('pause', .25), ('N', "and asked me for one last thing."), ('pause', .7)]),
 ('yard', [('pause', .3), ('N', "My dad was the best rugby player our town ever had."), ('pause', .25),
           ('N', "Every Sunday, he trained me in the backyard."), ('mark', 'pass'), ('pause', .2),
           ('N', "And every Sunday... I dropped the ball."), ('pause', .5),
           ('mark', 'help'), ('DAD', "Hey. Look at me."), ('pause', .3),
           ('DAD', "A real rugby player isn't the one who never falls."), ('pause', .2), ('mark', 'rise'),
           ('DAD', "It's the one who gets back up."), ('pause', .8)]),
 ('sick', [('pause', .5), ('N', "Last winter, Dad got sick. Really sick."), ('pause', .4),
           ('N', "The doctors stopped smiling when they talked to us."), ('pause', .5)]),
 ('promise', [('pause', .2), ('mark', 'give'), ('DAD', "Saturday is the final, buddy."), ('pause', .35),
              ('DAD', "Wear my number ten... and play it for me."), ('pause', .5),
              ('N', "I promised him."), ('pause', .3), ('N', "But we both knew he wouldn't be there to watch."), ('pause', .7)]),
 ('locker', [('pause', .5), ('mark', 'wear'), ('N', "On Saturday, I put on his jersey."), ('pause', .2), ('N', "It was way too big for me."), ('pause', .6)]),
 ('warmup', [('pause', .3), ('KYLE', "Nice pajamas, kid! Did you steal them from your daddy?"), ('mark', 'laugh'), ('pause', 1.0),
             ('N', "Kyle. Captain of the other team."), ('pause', .3),
             ('N', "Everyone laughed. I almost took the jersey off."), ('pause', .6)]),
 ('tackles', [('pause', .2), ('ANN', "Two minutes left, and the Reds lead by three!"), ('pause', .3),
              ('mark', 't1'), ('pause', 1.1), ('N', "They hit me hard."), ('pause', .3),
              ('mark', 't2'), ('pause', 1.1), ('N', "Again."), ('pause', .3),
              ('mark', 't3'), ('pause', 1.2), ('N', "And again."), ('pause', .6),
              ('N', "Every time I hit the ground... I heard his voice."), ('pause', .4),
              ('DADECHO', "It's the one who gets back up."), ('mark', 'up'), ('pause', 2.0)]),
 ('lastplay', [('pause', .2), ('ANN', "Last play of the game! The Blues have the ball!"), ('mark', 'catch'), ('pause', .3),
               ('N', "Then the ball came to me."), ('pause', .2), ('N', "Kyle was right in front of me."), ('mark', 'step'),
               ('N', "Just like Dad taught me... left... then right."), ('mark', 'dive'), ('pause', 1.0),
               ('mark', 'try'), ('ANN', "Try! Number ten scores! The Blues win the final!"), ('pause', 1.0)]),
 ('twist', [('N', "Then I looked up at the stands."), ('pause', .6), ('mark', 'reveal'),
            ('N', "He was there. In a wheelchair."), ('pause', .4), ('N', "The doctors said no. He came anyway."), ('pause', .4),
            ('mark', 'boy'), ('DAD', "That's my boy."), ('pause', .8)]),
 ('hug', [('mark', 'run'), ('pause', 2.2), ('mark', 'hugstart'), ('pause', 3.4)]),
 ('end', [('pause', 1.0), ('mark', 'l1'), ('N', "He passed away three days later."), ('pause', .8), ('mark', 'l2'),
          ('N', "But he saw me score."), ('pause', 2.2), ('mark', 'card'), ('pause', 3.6)]),
]

_vcache = {}
def tts(spk, text):
    path, ls, gain, pan = VOICES[spk]
    if path not in _vcache: _vcache[path] = PiperVoice.load(path)
    v = _vcache[path]
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        v.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=ls, noise_scale=.6, noise_w_scale=.7))
    buf.seek(0)
    with wave.open(buf) as r:
        sr = r.getframerate(); x = np.frombuffer(r.readframes(r.getnframes()), np.int16).astype(np.float32) / 32768
    # resample to 44.1k
    n = int(len(x) * SR / sr); x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)
    # trim silence
    a = np.abs(x); idx = np.where(a > 0.01)[0]
    if len(idx): x = x[max(0, idx[0] - 400): idx[-1] + 2000]
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.8 * gain
    if spk == 'DADECHO':  # dreamy echo
        y = np.copy(x); y = np.concatenate([y, np.zeros(int(1.2 * SR))])
        for d, g in [(.18, .5), (.36, .3), (.6, .18), (.9, .1)]:
            k = int(d * SR); y[k:k + len(x)] += x * g
        x = y * 0.8
    return x

# ---------------- build timeline ----------------
t = 0.0
scenes, lines, marks, clips = [], [], {}, []
for name, items in SPEC:
    s0 = t
    for it in items:
        if it[0] == 'pause': t += it[1]
        elif it[0] == 'mark': marks[it[1]] = round(t, 3)
        else:
            spk, text = it
            x = tts(spk, text)
            dur = len(x) / SR
            if spk == 'DADECHO': dur -= 1.0
            lines.append({'start': round(t, 3), 'end': round(t + dur, 3), 'spk': spk, 'text': text})
            clips.append((t, x, VOICES[spk][3]))
            t += dur
    scenes.append({'name': name, 'start': round(s0, 3), 'end': round(t, 3)})
DUR = round(t, 3)
json.dump({'duration': DUR, 'scenes': scenes, 'lines': lines, 'marks': marks}, open('timeline.json', 'w'), indent=1)
print('duration', DUR); [print(f"{s['name']:9s} {s['start']:6.2f} -> {s['end']:6.2f}") for s in scenes]

# ---------------- audio mix ----------------
N = int((DUR + .2) * SR); tt = np.arange(N) / SR
music = np.zeros((N, 2)); sfx = np.zeros((N, 2)); voice = np.zeros((N, 2))
def put(buf, sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N or i < 0: return
    sig = sig[:N - i]; l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    buf[i:i + len(sig), 0] += sig * gain * l; buf[i:i + len(sig), 1] += sig * gain * r
for st, x, pan in clips: put(voice, x, st, 1.0, pan)

S = {s['name']: s for s in scenes}; Mk = marks
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def piano(m, dur=2.5, vel=1.0):
    n = int(dur * SR); t_ = np.arange(n) / SR; f = mtof(m)
    s = sum(a * np.sin(2 * np.pi * f * k * t_) * np.exp(-t_ * (1.4 + k * .9)) for k, a in [(1, 1), (2, .4), (3, .18), (4, .08)])
    return s * np.minimum(1, t_ / .004) * vel * .2
def pad(ms, dur, vol=.05):
    n = int(dur * SR); t_ = np.arange(n) / SR; s = np.zeros(n)
    for m in ms:
        f = mtof(m); s += np.sin(2 * np.pi * f * t_) + .3 * np.sin(2 * np.pi * f * 2.003 * t_) + .2 * np.sin(2 * np.pi * f * 1.498 * t_)
    e = np.minimum(1, np.minimum(t_ / (dur * .3), (dur - t_) / (dur * .3)))
    return s * e * vol / len(ms)
def lp(x, k):
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[k:] - c[:-k]) / k; return np.concatenate([y, np.zeros(k - 1)])
def noise(d): return rng.standard_normal(int(d * SR))
def thump(f=60, d=.25, g=1.0):
    n = int(d * SR); t_ = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t_ * (1 - .35 * t_ / d)) * np.exp(-t_ * 16) + lp(noise(d), 4) * np.exp(-t_ * 45) * .5) * g

def sad_section(a, b, vol=1.0, prog=((57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62]))):
    t_ = a; bar = 0
    while t_ < b - .5:
        root, ch = prog[bar % 4]
        put(music, pad([root - 12] + ch, 4.4, .06 * vol), t_)
        put(music, piano(root - 12, 3.5, .8 * vol), t_, pan=-.2)
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12, ch[2] + 12]
        for i, m in enumerate(arp):
            if t_ + i * .5 < b - .3: put(music, piano(m, 2.2, .5 * vol), t_ + i * .5, pan=.25)
        t_ += 4; bar += 1

# music plan
sad_section(0, S['warmup']['end'] + .5, 1.0)
# tension: low drones + drum pulses during tackles and last play
a, b = S['tackles']['start'], S['lastplay']['end']
put(music, pad([45, 52, 57], b - a, .07), a)
t_ = a
while t_ < Mk['try'] - .2:
    put(music, thump(55, .3, .5), t_); t_ += .75 if t_ < Mk['up'] else .5
# hopeful swell from 'up'
put(music, pad([57, 60, 64, 69], Mk['catch'] - Mk['up'] + 1, .06), Mk['up'])
# triumphant after try
prog2 = [(48, [60, 64, 67]), (55, [59, 62, 67]), (57, [60, 64, 69]), (53, [60, 65, 69])]
t_ = Mk['try']; bar = 0
while t_ < S['twist']['start']:
    root, ch = prog2[bar % 4]; put(music, pad([root - 12, root] + ch, 2.4, .09), t_)
    for i in range(4): put(music, piano(ch[i % 3] + 12, 1.2, .6), t_ + i * .5, pan=.3); put(music, thump(70, .25, .6), t_ + i * .5)
    t_ += 2; bar += 1
# emotional reveal + hug: warm major, slower
prog3 = [(53, [57, 60, 65]), (48, [55, 60, 64]), (55, [55, 59, 62]), (57, [57, 60, 64])]  # F C G Am
t_ = S['twist']['start']; bar = 0
while t_ < S['hug']['end']:
    root, ch = prog3[bar % 4]; put(music, pad([root - 12, root] + ch, 3.4, .08), t_)
    put(music, piano(root - 12, 3, .8), t_, pan=-.2)
    for i, m in enumerate([ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]): put(music, piano(m, 2, .55), t_ + i * .75, pan=.2)
    t_ += 3; bar += 1
# ending: solo piano
t_ = S['end']['start'] + .3
for i, m in enumerate([76, 74, 72, 71, 69, 72, 71, 69, 67, 69]):
    put(music, piano(m, 3, .8), t_ + i * 1.0)
put(music, pad([45, 57, 60, 64], DUR - S['end']['start'], .05), S['end']['start'])

# ducking under voice
venv = lp(np.abs(voice[:, 0]) > .02, 4000) if False else None
speak = np.zeros(N)
for l in lines: speak[int(l['start'] * SR):int(l['end'] * SR)] = 1
speak = lp(speak.astype(float), int(.25 * SR))
music *= (1 - .45 * speak)[:, None]

# --- SFX ---
# hospital monitor beeps
for sc in ('hook', 'sick', 'promise'):
    t_ = S[sc]['start'] + .2
    while t_ < S[sc]['end']:
        n = int(.09 * SR); x = np.sin(2 * np.pi * 980 * np.arange(n) / SR) * np.minimum(1, (n - np.arange(n)) / 400)
        put(sfx, x * .05, t_, pan=-.4); t_ += .95
# birds in the yard
for i in range(6):
    st = S['yard']['start'] + 1 + i * 2.3; n = int(.25 * SR); x = np.arange(n) / SR
    put(sfx, np.sin(2 * np.pi * (3200 + 900 * np.sin(2 * np.pi * 18 * x)) * x) * np.exp(-x * 9) * .03, st, pan=.6)
# yard: ball drop
put(sfx, thump(110, .2, .5), Mk['pass'] + .1)
# locker room: zip/rustle
put(sfx, lp(noise(.8), 3) * .08, Mk['wear'])
# crowd
crowd = lp(noise(DUR + .2), 18) * .9 + lp(noise(DUR + .2), 5) * .2
lvl = np.zeros(N)
def ramp(a, b, v0, v1):
    i0, i1 = int(a * SR), min(N, int(b * SR)); lvl[i0:i1] = np.linspace(v0, v1, i1 - i0)
ramp(S['warmup']['start'], S['warmup']['end'], .25, .25)
ramp(S['tackles']['start'], Mk['try'], .35, .45)
ramp(Mk['try'], Mk['try'] + .3, .45, 1.5)
ramp(Mk['try'] + .3, S['twist']['start'], 1.5, 1.1)
ramp(S['twist']['start'], S['hug']['end'], .55, .4)
ramp(S['hug']['end'], S['hug']['end'] + .6, .4, 0)
sfx[:N, 0] += crowd[:N] * lvl * .25; sfx[:N, 1] += np.roll(crowd, 400)[:N] * lvl * .25
# laughing (pulsed noise) after Kyle
st = Mk['laugh']; n = int(1.6 * SR); x = np.arange(n) / SR
put(sfx, lp(noise(1.6), 6) * (np.maximum(0, np.sin(2 * np.pi * 6 * x)) ** 2) * np.exp(-x * 1.2) * .35, st)
# tackles: big hits + crowd ooh
for k in ('t1', 't2', 't3'):
    put(sfx, thump(70, .45, 1.2), Mk[k]); put(sfx, lp(noise(.25), 2) * np.exp(-np.arange(int(.25 * SR)) / SR * 20) * .5, Mk[k])
    n = int(1.2 * SR); x = np.arange(n) / SR
    put(sfx, lp(noise(1.2), 30) * np.sin(np.pi * x / 1.2) * 1.0, Mk[k] + .1)
# heartbeat while on the ground
t_ = Mk['t3'] + .8
while t_ < Mk['up'] + .5:
    put(sfx, thump(50, .2, .7), t_); put(sfx, thump(46, .2, .45), t_ + .22); t_ += .85
# pass whoosh + catch
n = int(.6 * SR); put(sfx, lp(noise(.6), 6) * np.sin(np.pi * np.arange(n) / n) ** 2 * .4, Mk['catch'] - .6)
# dive thud + whistle
put(sfx, thump(80, .4, 1.0), Mk['dive'] + .75)
n = int(.9 * SR); x = np.arange(n) / SR
put(sfx, np.sin(2 * np.pi * (2900 + 120 * np.sin(2 * np.pi * 28 * x)) * x) * np.minimum(1, np.minimum(x / .01, (.9 - x) / .1)) * .12, Mk['try'] - .3)

mix = music + sfx + voice * 1.25
mix[int(DUR * SR) - int(1.2 * SR):] *= np.linspace(1, 0, N - (int(DUR * SR) - int(1.2 * SR)))[:, None]
peak = np.max(np.abs(mix)); mix = np.tanh(mix / peak * 1.3) * .9
os.makedirs('out', exist_ok=True)
with wave.open('out/dad10_audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('audio ok')
