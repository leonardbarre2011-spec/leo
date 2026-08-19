# Basketball training shorts (Remotion)

Two vertical shorts, both `1080 × 1920 · 9:16 · 60 fps · H.264`, mastered to
−14 LUFS for TikTok, Reels and Shorts.

| | Composition | Render | Length |
|---|---|---|---|
| **FIRST STEP** | `FirstStep` | `out/first-step-basketball.mp4` | 25.0s |
| **CROSSOVER** | `Crossover` | `out/crossover-tips.mp4` | 23.1s |
| **FOOTWORK** | `Footwork` | `out/footwork-separation.mp4` | 25.1s |

```bash
node tools/render.mjs out/first-step-basketball.mp4 16
COMP=Crossover node tools/render.mjs out/crossover-tips.mp4 16
COMP=Footwork  node tools/render.mjs out/footwork-separation.mp4 16
COMP=Footwork  node tools/qc.mjs 200 430 900   # stills for frame review
```

## One footage library, three films

All three were cut from the same four source clips. `docs/footage-ledger.md`
tracks which seconds of each clip every film has used, so a new edit can be
built from what is still untouched rather than from the same handful of
seconds. FOOTWORK was cut that way.

---

# 1 · FIRST STEP — 25s

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


---

# 2 · CROSSOVER — 23s

Final render: **`out/crossover-tips.mp4`** · source in `src/crossover/`

Same brand, deliberately **calmer**. The first film was cut at roughly a
shot per second; this one averages 2.3s per shot, because the note on it
was that it moved faster than it could be understood.

## What "less dynamic" meant in practice

| | FIRST STEP | CROSSOVER |
|---|---|---|
| shots | ~30 | 10 |
| avg shot | 0.8s | 2.3s |
| section changes | hard cuts + whip blurs | 8–12 frame cross-dissolves throughout |
| captions | word-by-word, a spring pop per word | whole lines, soft fade, then held |
| camera shake | 8 instances | none |
| impact flashes | 12 | none |
| speed ramps | 4 multi-stage | 1, at the moment it means something |
| SFX cues | 31 | 10 |

Nothing was slowed for its own sake — the pacing follows what a viewer
has to take in. The two ideas that need thinking about get four and
three seconds respectively, each on a single continuous visual.

## Clips built in Remotion

Half the runtime is footage; the two moments that carry the actual
teaching are drawn from scratch, because no B-roll can show what a
defender's *weight* is doing (`src/crossover/Court.tsx`, `Diagrams.tsx`).

**⬛ Board 1 — why it fails (2.7s → 7.2s).** A top-down half court, hoop
at the top, the way the read actually looks. You cross; the defender
mirrors you step for step; the path closes. The point lands because both
markers move on the same curve — and only one of them was ever
threatened.

**⬛ Board 2 — why it works (13.0s → 16.3s).** The identical opening
position. This time the attack goes hard at one foot first, the
defender's marker commits its weight (drawn as the shadow it steps off),
and the space he vacates lights up before the snap back into it.

Both are the same board with the same markers, so the second reads as a
correction of the first rather than a new diagram.

## Voiceover

This one arrived without a transcript, and the model hosts for the usual
speech recognisers are outside this environment's network policy. The
words were recovered with **PocketSphinx**, whose acoustic model ships
inside the package, and its word alignment was cross-checked against
phrase boundaries from `silencedetect` on the same file.

Recovered transcript:

> Your crossover isn't slow. It's predictable. The problem? You're
> changing direction without making the defender move first. Try this:
> attack hard, freeze for half a second, then snap the ball across your
> body and explode. Make them lean first, then take the space they give
> you. One move. One advantage. Follow if you want skills that actually
> work in games.

Two short lines are lower confidence — `THE PROBLEM?` and `TRY THIS` —
and are marked ⚠ in `src/crossover/timing.ts`. They live in a `COPY`
block: correcting a string there changes the caption and nothing else,
because no timing is derived from the words.

## B-roll

- **x1** (Kyrie: size-up → cross → drive → finish → walk-off) carries the
  hook, all three teaching steps and the payoff. One clip, six different
  jobs, each on a different part of it.
- **x2** (fan-POV, the arena erupting) is the CTA's evidence: the line is
  "work in games", so the picture is a real game.
- **c2** (the hooded portrait, reused from the first film) closes it.

## Sound

The bed is a slower Cm9 pad with nine long sub notes on section changes
and no percussion at all — the first film's hats would have fought this
edit. Master: **−14.5 LUFS, −0.88 dBTP**, no clipped samples; the voice
sits roughly 8 dB over the ducked bed while speaking.


---

# 3 · FOOTWORK FOR SEPARATION — 25s

Final render: **`out/footwork-separation.mp4`** · source in `src/footwork/`

CROSSOVER's tempo, kept as-is. What changed is where the pictures come
from.

## The constraint

The clips supplied for this film are byte-identical to the ones the first
two were cut from — the same four files. So rather than reach for the same
seconds again, this edit was built against a ledger of what had already
been used (`docs/footage-ledger.md`) and takes, wherever possible, only
what had not:

| Shot | Source | Status |
|---|---|---|
| hook — guarded, going nowhere | x2 `0–62` | **never used** — the seconds before the shot goes up |
| hands on the ball | c1, punched to the hands | **framing never used** — earlier cuts only ever went to the feet |
| one move, one advantage | x1 `236–330` | **never used** — the walk-off |
| against a defender | x1 `30–163` | seen before, but full frame, full speed, no graphics — the plainest shot in the film |
| CTA, part 1 | x2 `205–350` | **never used** — the arena still going |
| CTA, part 2 | x1 `296–348` | **never used** — closes on a player in uniform |

The hooded portrait that ended both earlier films is **not used at all**.

Everything else is drawn.

## Clips built in Remotion

A different board from CROSSOVER's: that film looked down on a half court,
this one works at floor level, close enough that a single plant reads
(`src/footwork/Floor.tsx`, `Diagrams.tsx`).

**⬛ What moves what (5.3s → 6.9s).** The script turns on one comparison,
so it gets one frame: the ball travels and the defender doesn't; the feet
travel and he has to.

**⬛ The floor (6.9s → 12.4s).** Four beats on one piece of hardwood — a
stride in, a foot into the floor, a half second in which the only thing
that moves is a weight bar sliding off his centre, and the way out. It
ends with the gap measured, because separation is the thing being taught.

**⬛ The drill is not the finish line (14.8s → 17.5s).** The cone is struck
out and a live defender takes its place, one beat before the film cuts to
real footage of exactly that.

The half-second freeze is deliberately *not* drawn the way CROSSOVER drew
it. There it was a timer bar; here it is the defender's weight leaving,
which is the reason the freeze works at all.

## Voiceover

Recovered offline the same way, and this one came back clean — no
low-confidence lines:

> If you can't create separation, this is probably why. You're trying to
> beat defenders with your hands instead of your feet. Watch this: attack
> hard, plant, freeze them for half a second, then explode the opposite
> way. One move, one advantage. When you train it, don't stop at the
> drill — use it against a defender. Follow now, because every video here
> is designed to make you harder to guard.

## Sound

Third film, third piece: D minor, and the moving part is a muted pluck
figure rather than a pad swell, so it is audibly a different track from
the other two while sitting in the same restrained place in the mix.
Master: **−14.3 LUFS, −0.94 dBTP**, no clipped samples.
