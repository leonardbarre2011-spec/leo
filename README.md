# Reel upgrade — b-roll, captions & CTA (Remotion)

A conversion/retention pass over the 25.9s vertical basketball reel
(`source/original.mov`), built as a Remotion project so every element stays
editable and re-renderable.

**The rule this project follows: the original clips are never cut, trimmed,
reordered, or re-timed.** The upgraded reel is exactly the same 777 frames at
1080×1920/30fps, with the same voice-over audio in the same position. Everything
added is composited on top — most of it into the black letterbox bands the
original export wasted.

| | Original | Upgraded |
|---|---|---|
| Frame usage | 1080×1164 of footage, ~756px of pure black bars | full frame: blurred court backdrop, hook zone, big caption band |
| On-screen text | none | one opening hook + one- and two-word karaoke captions |
| B-roll | none | 9 graphic modules pinned to the voice-over, at half footprint |
| UI chrome | none | none — no pills, badges, sound-on prompts or icon bars |
| Audio | voice-over | same voice-over + subtle synthesised whooshes/impacts |

## How the voice-over was mapped

The audio was transcribed with Whisper (`small`, via sherpa-onnx) and segmented
with a Silero VAD pass; word timings come from distributing each word across the
cumulative speech energy of its segment. The result lives in
`src/data/captions.json` and drives both the captions and the b-roll windows.

Transcript, with the b-roll each line triggers:

| Time | Voice-over | B-roll module |
|---|---|---|
| 0.1–2.3 | "Since I started this account, I always wondered…" | `profile` — an account card built from real frames of this reel, "?" landing on *wondered* |
| 2.7–5.0 | "…help the young ballers out there that train alone…" | `alone` — team-mates fade off a half-court plan, one player left |
| 5.0–7.4 | "…with some TikTok workout?" | `tiktok` — a generic workout feed scrolling by, each clip crossed out |
| 7.7–10.5 | "So I imagined a solution, but only for the best of them." | `funnel` — a crowd of dots narrowing to a few |
| 11.1–13.9 | "A 12-week basketball program specific to your position" | `program` **(hero)** — 12 weeks filling in, then the five positions lighting up |
| 14.1–17.9 | "…with some specialized drills and advice." | `drills` — a play drawing itself on a half court + drill cards |
| 17.9–21.9 | "…sent them to beta testers and they loved it, so now I'm officially releasing them." | `proof` — messages landing, then an "OFFICIALLY OUT" stamp exactly on *officially* |
| 22.0–23.1 | "So if you want one…" | `you` — pointer beat handing over to the CTA |
| 23.3–25.9 | "…check the link in my bio." | `bio` **(hero)** — the bio link being tapped |

Two notes on the transcript: Whisper hears *"specific to your post"*; from context
this is clearly **"position"**, and that is what the captions say. And the CTA
copy deliberately mirrors what is actually said — no invented follower counts,
prices, testimonial quotes, ratings or scarcity claims appear anywhere. The
"beta testers" bubbles are redacted bars precisely so nothing is put in anyone's
mouth.

## What was changed, and why

1. **Dead space → working space.** The source is 16:9-ish footage letterboxed
   into 9:16. Those bands are now a blurred, drifting blow-up of the clip itself,
   plus a hook zone and a big caption band. The footage itself still renders 1:1
   at its native 1080×1164 — nothing is upscaled or cropped away.
2. **A hook on frame 1, then silence.** The spoken opener is a slow build, so the
   reel opens with *"IF YOU TRAIN ALONE, WATCH THIS."* before the first word
   lands — and that is the only line of copy that isn't the voice-over itself.
3. **Captions are the loudest thing on screen.** One or two words at a time (49
   cards over 26s), 96–128px, the active word in a filled orange block, and the
   words that carry the offer (*alone, TikTok, 12-week, position, loved,
   officially, bio*) coloured even before they are spoken. Most short-form views
   start muted, so this is where the pitch actually lands.
4. **B-roll that argues the offer, at half footprint.** Problem (training alone,
   random drills) → filter (only for the best) → product (12 weeks × your
   position) → contents (drills + advice) → proof (beta-tested, now out) →
   action (link in bio). Every module is drawn at 0.7 linear scale — about half
   the area — and pinned to the bottom edge of the footage card, so it sits over
   the floor and the basketball action stays visible behind it.
5. **No UI chrome.** No badges, kickers, sound-on prompts or CTA pills: the only
   persistent element is a hairline progress bar. The CTA is carried by the
   voice-over, the captions and the bio-link module.
6. **Punch-ins on the existing cuts.** Scene cuts were detected with ffmpeg;
   each new clip gets a 14-frame push-in and the loudest six get a light flash,
   so the edit has energy without any footage being replaced.
7. **Subtle sound design.** Whooshes/impacts/riser synthesised offline into
   `public/sfx` (no third-party audio), mixed at 0.13–0.22 so the voice-over
   stays dominant. Turn them off with the `sfx` prop.

## Compositions

| id | duration | use |
|---|---|---|
| `Upgraded` | 777f (25.9s) | **the deliverable** — same length as the original |
| `UpgradedWithEndCard` | 837f (27.9s) | A/B variant with a 2s closing card. Converts harder but costs completion rate — test it against the default |
| `Original` | 777f | the untouched source, for side-by-side comparison |

## Running it

```bash
npm install
npm run studio          # interactive editor
npm run render          # -> out/upgraded.mp4
npm run render:endcard  # -> out/upgraded-endcard.mp4
```

If the machine cannot reach Remotion's Chrome download CDN, point it at a local
Chromium instead:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render
```

## Project layout

```
public/          clip.mp4 (cropped source), bg-blur.mp4, audio.mp3, stills/, sfx/, fonts/
source/          original.mov — the untouched master
src/theme.ts     palette, type, and the vertical zoning of the 1080x1920 frame
src/data/        transcript timings + the beat/headline script
src/components/  backdrop, footage card, captions, headline, CTA chrome, sfx
src/broll/       the nine b-roll modules
```

`public/clip.mp4` and `public/bg-blur.mp4` are derived from `source/original.mov`:

```bash
ffmpeg -i source/original.mov -an -vf "crop=1080:1164:0:326" -c:v libx264 -crf 19 public/clip.mp4
ffmpeg -i public/clip.mp4 -an -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:2,eq=brightness=-0.14:saturation=1.25" -c:v libx264 -crf 27 public/bg-blur.mp4
ffmpeg -i source/original.mov -vn -c:a libmp3lame -b:a 192k public/audio.mp3
```

## Worth testing next

- The end-card variant vs. the default cut (completion rate vs. click-through).
- Swapping the opening hook line in `src/data/script.ts` — it is one string, and
  it is the single highest-leverage variable in the whole reel.
- `BROLL_SCALE` in `src/components/BrollStage.tsx` sets how much of the frame the
  b-roll is allowed to take (0.7 = half the area); each beat's `originX` in
  `src/data/script.ts` decides which corner it hugs.
- If a real screenshot of the bio/link page is available, dropping it into the
  `bio` module in place of the mock will lift click-through further.
