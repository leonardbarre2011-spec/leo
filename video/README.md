# FIRST STEP — 25s basketball training short (Remotion)

`1080 × 1920 · 9:16 · 60 fps · H.264 · 25.0s` — built for TikTok, Reels and Shorts.

Final render: **`out/first-step-basketball.mp4`**

---

## The voiceover is the timeline

Nothing in this edit is placed by feel. The provided VO was analysed before a
line of React was written:

* **Phrase boundaries** — `silencedetect` at −33 dB gave the eleven spoken
  phrases and the pauses between them.
* **Word onsets** — a 10 ms RMS envelope of the VO, peak-picked at
  syllable scale, then aligned against the transcript's syllable counts.

Every one of those onsets lives in `src/timing.ts` as `VO.*`, and every cut,
freeze, slam and sound effect is derived from them. There is no guessed
timing anywhere in the composition.

The VO runs 23.616 s; the composition is 1500 frames (25.000 s), leaving the
CTA lock-up 1.4 s to land after the last word.

## Structure

| Time | Beat | What carries it |
|---|---|---|
| 0.0–1.2 | **Scroll stop** | Action on frame 1, red lock-on reticle already reading the stance |
| 1.2–2.3 | **Hook** | Hard freeze on the word *BEFORE* → punch to the hips/feet → *DRIBBLE* |
| 2.3–3.4 | **Diagnosis** | Pull-back, scan line, `STANCE / NO LOAD · NO ANGLE` |
| 3.4–5.5 | **The mistake** | Wide bad stance + hip guide line → punch to flat feet |
| 5.5–5.9 | **DEAD** | Freeze, red flash, strike-through |
| 5.9–6.5 | **Wrong → right** | Split wipe: frozen bad stance ✕ → loaded stance ✓ |
| 6.5–7.3 | **01 Drop your hips** | Ghost line marks the old hip height, live line travels down |
| 7.6–8.7 | **02 Load your outside foot** | Punch to the feet, load arc fills, force arrow |
| 8.7–9.2 | **Pay-off** | Speed ramp out of the load — `LOADED = FREE SPEED` |
| 9.2–10.3 | **03 Attack their top foot** | Red mark on the defender's front foot, volt attack path |
| 10.3–11.1 | **⭐ Run it back** | Three full-speed flashes of the same move — the replay trigger |
| 11.1–12.5 | **Do this / JAB** | Three chips set up, consumed one at a time |
| 12.5–13.8 | **EXPLODE** | 0.30× → 1.35× ramp, gate blows open, streaks, shake |
| 13.8–15.1 | **FINISH** | Slow release, cut to the ball dropping through |
| 15.3–17.2 | **Not more moves** | Grayscale "predictable", clutter paths, red strike |
| 17.2–18.2 | **Before → after** | Split wipe into full-speed proof |
| 18.2–19.6 | **FIRST MOVE** | Two-line slam over the blow-by |
| 19.6–19.9 | **IMPOSSIBLE TO STOP** | Lands on a freeze of the beaten contest |
| 19.9–20.4 | **Held breath** | The ball alone in the dark |
| 20.4–25.0 | **Follow conversion** | Identity, not "follow for more" |

## B-roll use

Four clips were supplied; all four earned a place, each for one reason:

* **c1** (Wizards warm-up, upright and passive) — the wrong stance, and the
  "predictable" player in the before/after.
* **c4** (LeBron catching, sinking, loading, rising) — the fix. It literally
  shows the hip drop and the loaded outside foot.
* **c3** (playoff drive → pull-up → make) — the drill and the proof.
* **c2** (low-angle hooded portrait) — the CTA identity.

No clip is repeated without a new framing, speed and grade. Where footage
could not say it — hip height, foot load, attack direction — Remotion draws it.

## Design system

* One accent, **volt `#D8FF3E`**, for every correction / action / CTA element.
* **Red `#FF2E2E`** only ever means wrong, warning or the defender.
* Anton for slams, Inter for UI. Both embedded as data URIs (`src/fonts.ts`)
  so a render can never stall on a font fetch or draw a fallback face.
* Captions sit inside mobile safe zones and never cover the ball, the feet
  under discussion, or a face when it can be avoided.

## Sound

`VOICE > MUSIC > SFX`, enforced and measured.

* Music and every effect are **synthesised from scratch** (`tools/music.mjs`,
  `tools/synth.mjs`) — an F-minor pad, sub pulses on narrative beats, hats only
  in the drill, risers into the two hero hits.
* The bed is ducked to 0.6× under every spoken phrase by a frame-accurate
  volume callback in `src/Main.tsx`.
* Master: **−14.4 LUFS, −0.96 dBTP**, applied with `linear=true` so the
  balance set in the composition is preserved exactly. Measured result:
  speech sits **5.1 dB** above the bed, zero clipped samples.

## Build

```bash
npm i
npm run dev                       # Remotion Studio
node tools/render.mjs out/first-step-basketball.mp4 16
```

Source media is pre-processed into `public/video` (`tools/` documents the
ffmpeg calls): letterbox cropped, motion-interpolated to 60 fps where the
source was 30, and normalised to 1080-wide proxies so the virtual camera in
`src/components/Media.tsx` can punch in without re-decoding 4K HEVC.

`tools/qc.mjs <frame>…` renders arbitrary stills for frame-by-frame review.

## Layout

```
src/
  timing.ts            every VO onset + frame-accurate shot boundaries
  theme.ts             colour, type, embedded fonts
  Main.tsx             scene assembly + the audio mix
  components/
    Media.tsx          virtual camera, grades, Clip, Freeze
    Type.tsx           Caption, Slam, Tag, StepBadge, ChipRow
    Graphics.tsx       HipLine, FootHighlight, DirectionArrow, Gate, …
    Effects.tsx        ImpactFlash, Shake, Streaks, WhipVeil, Grain, …
  scenes/              Hook · Mistake · Fix · Drill · Proof · Cta
```
