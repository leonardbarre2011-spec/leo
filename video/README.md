# SAME PLAYER — 9:16 motion piece

A 52.85 s vertical film for a position-specific basketball training program,
built in Remotion. 1080×1920, 30 fps, 1586 frames.

**Render:** `render/same-player.mp4`

```bash
npm install
npm run audio    # trims the voice-over + bakes the sound-design stem
npm start        # Remotion Studio
npm run render   # → render/same-player.mp4
```

---

## The idea

Three concepts were drafted; this is the one that got made.

> **THE LOOP.** The film opens on a rep counter sprinting past 47,000 next to a
> skill delta frozen at **+0.0%** — a year of work with nothing to show. Every
> scene after that is the same loop viewed from a different instrument: a
> calendar of identical days, a handle that fractures at the same coordinate
> however much you polish it, five positions wired to one generic program, a
> half-second read a guard has to make that a big never practises. At "that's
> why nothing changes" the flat line snaps and unrolls into twelve weeks, and
> the product arrives as the shape the problem was already making.

Two rejected: *The Blueprint Table* (top-down architect's desk — too tasteful,
no tension) and *X-Ray of a Possession* (one annotated possession — beautiful,
but it had nothing to say about the 364 days around it).

### Open loops

| Planted | Paid off |
| --- | --- |
| `WK 01 / 12` marker appears unexplained at 4.6 s | docks into week one of the map at 38.4 s |
| `FAILURE POINT` pin and its dotted lead run off-frame at 13.2 s | the lead arrives at week one — it *is* the diagnostic — at 38.1 s |
| The ball's closed orbit in the cold open | the ghost ball still bouncing in place at 46 s, under "better cardio" |

### Why the product doesn't feel bolted on

The whole film is drawn in the program's own interface language — its palette
(`#0B0E14` / `#FF5B2E` / `#D3A24C`), its condensed-plus-mono type pairing, its
card and rule system. By the time the document appears at 39.7 s the viewer has
been reading that interface for forty seconds, so it lands as the thing that was
always underneath rather than as an ad. Only features the program actually has
are shown: video evaluation → personalised plan, individualised in-app program,
regular video feedback, tracked progression, monthly challenges + community,
quarterly reviews, cohorts with limited spots.

---

## Audio

### Voice-over trim

`assets/vo-source.mp3` is the untouched ElevenLabs read: 57.57 s with a lot of
dead air. `scripts/vo-data.mjs` holds one entry per kept slice, plus the
word-level timings produced by forced-aligning the transcript against the source
(CMU pocketsphinx aligner). `npm run audio` cuts the slices with 12 ms edge
ramps, replaces each gap with a hand-picked breath, and concatenates:

**57.57 s → 51.25 s of voice. 7.37 s of dead air removed**, with the rhetorical
pauses deliberately kept — the beat before "reps make you more of what you
already are" still lands, the one between "different job" and "same drills"
still stings.

A 1.05 s silent runway is prepended so the visual hook plays before the first
word, and 1.6 s of tail is added for the end card.

### Sound design

There is no sample library. `scripts/dsp.mjs` is a small synthesis kit — noise,
sines, a state-variable filter, envelopes — that generates every sound:

`bounce` · `dribble` · `click` · `latch` · `paper` · `whoosh` · `swish` ·
`squeak` · `sub` · `riser` · `blip` · `stamp` · `drone`

`scripts/cues.mjs` places 197 of them against the same trimmed clock the
animation reads, and the whole thing is mixed offline into one stem. That means
perfect sync by construction, and only two `<Audio>` tags at render time instead
of two hundred.

---

## Structure

```
scripts/
  vo-data.mjs       kept slices + forced-aligned word timings
  scenes.mjs        the cut — 19 scene windows
  timeline-core.mjs collapses vo-data into the trimmed timeline
  cues.mjs          the sound-design sheet
  dsp.mjs           synthesis kit + mixer
  build-audio.mjs   → public/vo.mp3, public/sfx.mp3, src/generated/timeline.ts
src/
  Film.tsx          the shot list; one clock, hard cuts on impacts
  theme.ts          palette and type, borrowed from the product
  elements/
    Ball.tsx        seams as real curves on a sphere, rotated in 3D
    Court.tsx       FIBA half court in centimetres, laid down in perspective
    Trace.tsx       the handle as an instrument reads it
    Captions.tsx    word-synced, one line at a time
    Ui.tsx          tags, rules, panels, meters, pins, odometer
  scenes/Act1–4.tsx
```

`src/generated/timeline.ts` is written by `npm run audio` and committed, so the
project renders without re-running the audio build.

### The ball

Not an image and not clip-art. The four seams of an 8-panel ball are
parametrised as curves on a unit sphere, rotated by yaw/pitch/roll each frame,
projected orthographically and clipped to the visible hemisphere — so the seams
sweep round the limb correctly as it spins. It recurs as the hook's orbiting
object, the dot on the flat line, the rider on the twelve-week path, the ghost
still bouncing in place at the end, and the mark on the program document.

### Performance

Scenes mount only inside their own window. No SVG filters anywhere — shadows
and glows are CSS gradients. The grain is a fixed noise field offset per frame
rather than a regenerated one. Audio is two stems, not a stack of cues. Full
1080×1920 render of all 1586 frames takes about 3½ minutes at concurrency 4.

---

## Fonts

Barlow Condensed, Inter and JetBrains Mono are vendored as latin-subset woff2 in
`public/fonts` and loaded through the FontFace API behind `delayRender`, so a
render never waits on — or fails because of — a font CDN.
