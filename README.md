# Playbook — viral vertical cut

Remotion project that builds a 40.5s vertical (1080×1920, 30fps) short from the
ElevenLabs voiceover and two clips of game footage.

## The edit rule

Every shot is between **1.0s and 1.4s** — 35 shots, no gaps, no overlaps. Cuts
land on word boundaries in the voiceover, so a change of plan never interrupts a
word. `src/Viral.tsx` holds the shot list; the invariant is checkable:

```bash
node -e "
const src=require('fs').readFileSync('src/Viral.tsx','utf8');
const body=src.slice(src.indexOf('export const SHOTS'), src.indexOf('/** Frames on which'));
const re=/at:\s*(\d+),\s*\n?\s*len:\s*(\d+)/g; let m, shots=[], prev=0, ok=true;
while((m=re.exec(body))) shots.push([+m[1],+m[2]]);
shots.forEach(([at,len],i)=>{ if(at!==prev||len<30||len>45){console.log('shot',i+1,'bad');ok=false;} prev=at+len; });
console.log(shots.length,'shots,',prev,'frames', ok?'OK':'BROKEN');
"
```

## Footage

The two `.mov` clips run 6.1s combined and carry five shots only — the try, the
level jump, the testers' result, and the close. Everything else is built in
Remotion, so the footage stays a punctuation mark rather than the spine.

## Captions

`src/data/words.json` holds word-level timings recovered from the voiceover with
a zipformer ASR pass, hand-corrected (`SKYROCKETED`, `BIO`, `DEFENSE`, `ETC.`).
`src/components/Captions.tsx` groups them into 2–3 word chunks that break on
pauses and on a 17-character budget so a chunk never overflows the frame.

`src/data/env.json` is a per-frame loudness envelope of the same voiceover; it
drives the handheld camera, the scale pulses and the accent washes, so the whole
film breathes with the read.

## Build

```bash
npm install
npm run studio          # preview
npm run render          # out/viral.mp4
```

Rendering needs a Chrome Headless Shell:

```bash
npx remotion render src/index.ts Viral out/viral.mp4 \
  --browser-executable=/path/to/headless_shell --concurrency=4
```

Regenerate the social encode (keeps it under upload limits):

```bash
ffmpeg -i out/viral.mp4 -c:v libx264 -preset slow -crf 22 -maxrate 9M \
  -bufsize 14M -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart \
  out/viral-social.mp4
```

## Assets

`public/` holds the voiceover, both clips transcoded to H.264 (Chrome cannot
decode the original HEVC), and the Anton / Inter faces the type is set in.
