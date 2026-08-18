# Viral basketball TikTok — Remotion source

1080x1920, 30 fps, 28.8 s. `out/viral-basketball.mp4` is the rendered deliverable.

## Running it

```bash
npm install
npm run dev      # Remotion Studio
npm run render   # -> out/viral-basketball.mp4
```

`remotion.config.ts` points Chromium at the copy already installed in this
environment, because the sandbox blocks Remotion's own headless-shell download.

## How the edit is structured

The voice-over is the source of truth. It was transcribed to word-level
timestamps (`src/data/words.json`, 75 words); every cut, text slam and sound
effect is keyed off a named word in `src/data/vo.ts`, so nothing is on a
rhythm grid that would drift away from the narration.

The composition is nudged 0.2 s later than the voice (`VO_OFFSET`) so frame 0
can land a purely visual punch before the first syllable.

| Scene | Voice | Job |
|---|---|---|
| `Hook` | 0.0–3.7 s | States the thesis on frame 0, before the narrator does |
| `RandomReps` | 3.7–7.2 s | Animated diagram of 100 stand-still reps, then the verdict |
| `NeverSame` | 7.2–10.1 s | Three different game shots cut hard against each other |
| `OpenLoop` | 10.1–10.6 s | Half a second of black on an unanswered question |
| `TheFix` | 10.6–13.7 s | Pressure / movement / decisions, checklist reveal |
| `TheDrill` | 13.7–17.7 s | Coach's diagram with a camera move — the practical value |
| `GameSpeed` | 17.7–20.0 s | Slow-motion rise, released to full speed on "game" |
| `Transformation` | 20.0–24.8 s | Before/after as a hard wipe, peaking on "impossible to guard" |
| `CTA` | 24.8–28.8 s | The ask, then a match cut back to the opening frame |

### Loop

The CTA holds on the same frame the video opens with, warm-graded and pulling
back to exactly the scale the hook starts from. The last 12 frames re-grade it
red and re-stamp "STOP TRAINING LIKE THIS", so the final frame and frame 0 are
the same image and a replay is seamless.

### B-roll

Four clips were supplied; three are used. `clip3` (a player on the sideline in
a hoodie, no basketball action) is deliberately unused — a weak clip costs more
retention than it adds. Source clips are 1080x2334, taller than the canvas, and
that headroom is used as an editing tool: `Broll` takes `zoom`, `panX/panY` and
`focusY` so the same clip can be re-framed as a pattern interrupt.

## Audio

Priority is voice ≫ effects ≫ music, and it is enforced rather than assumed:

- `scripts/master-vo.py` high-passes, adds presence, compresses 4:1 and limits
  the narration to about **-17 dBFS RMS** with a -1.5 dBFS ceiling.
- Every effect in `src/components/Sfx.tsx` has a hard ceiling, and
  `speechDuck()` pulls all of them down a further 7.5 dB whenever a word is
  being spoken.
- Music (`scripts/make-sfx.mjs` synthesises a loopable bed) sits at 0.05.

`scripts/check-mix.py` measures the finished file against a voice-activity mask
derived from the isolated narration. Current output:

```
peak            -1.5 dBFS   clipped samples: 0
voice RMS       -16.5 dBFS
sfx+music RMS   -27.6 dBFS
voice advantage 11.1 dB
loudest effects-only 100 ms: 14.1 dB under the voice
```

Re-run it after any change to levels:

```bash
npx remotion ffmpeg -y -i out/viral-basketball.mp4 -vn -ar 48000 -ac 1 \
  -c:a pcm_s16le /tmp/mix.wav
python3 scripts/check-mix.py /tmp/mix.wav public/audio/vo-master.wav 0.2
```

## Review tooling

`scripts/sheet.sh 0,30,60 name` pulls those frames out of the rendered MP4 and
tiles them into `out/stills/name.jpg`, which is how the timing and layout of
every section was checked. The `FrameCheck` composition does the same for
candidate B-roll crops before they are committed to a scene.

## Generated assets

- `public/sfx/*.wav` — synthesised by `node scripts/make-sfx.mjs` (impacts,
  whooshes, riser, ticks, swish, glitch, music bed). No third-party audio.
- `public/fonts/*.woff2` — Anton, Archivo Black, Barlow Condensed, Inter,
  vendored locally so a headless render never depends on the network.
- `public/broll/clip*.mp4` — the supplied .mov files transcoded to H.264.
