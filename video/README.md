# SAME PLAYER — 9:16 motion piece

A vertical film for a position-specific basketball training program, built in
Remotion. 1080×1920, 30 fps. Two cuts ship from one codebase:

| Composition | Length | Render | For |
| --- | --- | --- | --- |
| `SamePlayerShort` | **37.75 s** · 1133 frames | `render/same-player-short.mp4` | the feed |
| `SamePlayer` | 52.85 s · 1586 frames | `render/same-player.mp4` | the long version |

```bash
npm install
npm run audio        # trims both voice-over cuts + bakes both sound stems
npm start            # Remotion Studio
npm run render       # → render/same-player-short.mp4
npm run render:long  # → render/same-player.mp4
```

## What the short cut changes, and why

The long cut is the better film. The short cut is the one built to survive a
feed, and the differences are all retention mechanics rather than taste:

- **37.75 s instead of 52.85 s.** Completion rate is the signal that decides
  whether a post gets shown past its first test batch, and every second is a
  chance to lose it. Two threads came out — the redundant "you just wait for
  reps" line and the whole handle / two-hundred-dribbles / smoothing block —
  and the argument is sharper without them: it now runs straight from "reps
  make you more of what you already are" into "nobody trains you for your
  actual position".
- **The voice starts on frame 1.** v1 opened on a 1.05 s silent runway. That
  is the most expensive second in the video and it was spent on nothing.
- **Frame 1 is finished, not fading in.** The ball is already hitting the
  floor, the title already reads `365 DAYS OF WORK / 0.0% BETTER`, the counter
  already shows 41,260. Nothing about the first frame is mid-animation.
- **Captions are 118 px and centre-frame** instead of 86 px down in the strip
  the app covers with its own UI, with one accent word per line knocked out of
  a solid block. Most of the audience watches muted; the captions are the
  video for them.
- **It loops.** The last 0.4 s dissolves into the film's own first frame, which
  is pixel-matched — a replay is invisible and costs the viewer nothing.
- **A push-in on every scene**, so no frame is ever static, and the ask is
  on screen as a chip from the turn onward rather than only in the last
  three seconds.

A caveat worth stating plainly: none of this creates views. Distribution does.
A cut like this only changes what happens to the views you already get.

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
ramps, replaces each gap with a hand-picked breath, and concatenates.

| Cut | Speech kept | Breaths | Dropped from source |
| --- | --- | --- | --- |
| director's | 45.62 s | 4.58 s | 11.95 s |
| short | 33.67 s | 3.18 s | 23.90 s |

Both keep the rhetorical pauses on purpose — the beat before "reps make you
more of what you already are" still lands, the one between "different job" and
"same drills" still stings. The short cut additionally splits segment `O` so
the 0.75 s pause inside "twelve weeks … built around everything" comes down to
0.20 s without touching the delivery either side of it.

### Sound design

There is no sample library. `scripts/dsp.mjs` is a small synthesis kit — noise,
sines, a state-variable filter, envelopes — that generates every sound:

`bounce` · `dribble` · `click` · `latch` · `paper` · `whoosh` · `swish` ·
`squeak` · `sub` · `riser` · `blip` · `stamp` · `drone`

`scripts/cues.mjs` places them against the same trimmed clock the animation
reads — 197 cues for the long cut, 119 for the short one — and each is mixed
offline into a single stem. That means perfect sync by construction, and only
two `<Audio>` tags at render time instead of two hundred. The short cut's sheet
opens with a floor impact on frame 1, since with the runway gone the film has
to land a physical hit before the first word.

---

## Structure

```
scripts/
  vo-data.mjs       kept slices + forced-aligned word timings, for both cuts
  scenes.mjs        the shot lists — 19 windows long, 14 short
  timeline-core.mjs collapses a set of slices into a trimmed timeline
  cues.mjs          the sound-design sheets
  dsp.mjs           synthesis kit + mixer
  build-audio.mjs   → both vo/sfx pairs + both generated timelines
src/
  theme.ts          palette and type, borrowed from the product (C = long, V = short)
  elements/
    Ball.tsx        seams as real curves on a sphere, rotated in 3D
    Court.tsx       FIBA half court in centimetres, laid down in perspective
    Tactical.tsx    court camera constants, upright labels, ball-on-plane
    Trace.tsx       the handle as an instrument reads it
    Captions.tsx    word-synced, one line at a time
    Ui.tsx          tags, rules, panels, meters, pins, odometer
  Film.tsx          the long cut's shot list
  scenes/Act1–4.tsx
  viral/
    Film.tsx        the short cut's shot list
    Captions.tsx    the big centre-frame caption system
    scenes.tsx      the short cut's scenes
```

`src/generated/timeline.ts` and `timeline-viral.ts` are written by
`npm run audio` and committed, so the project renders without re-running the
audio build.

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
1080×1920 renders take about 2 minutes (short cut) and 3½ minutes (long cut)
at concurrency 4.

---

## Fonts

Barlow Condensed, Inter and JetBrains Mono are vendored as latin-subset woff2 in
`public/fonts` and loaded through the FontFace API behind `delayRender`, so a
render never waits on — or fails because of — a font CDN.
