/**
 * Remotion muxes AAC without an edit list, so the encoder's priming samples
 * (2048 @ 48kHz ~= 42.7ms) push the whole audio track late against the picture.
 * This shifts the audio back by that amount and re-muxes - stream copy only, so
 * neither the video nor the voice-over is re-encoded.
 *
 *   node scripts/fix-audio-sync.mjs out/upgraded.mp4 [offsetSeconds]
 */
import {execFileSync} from 'node:child_process';
import {renameSync, existsSync} from 'node:fs';
import ffmpeg from 'ffmpeg-static';

const file = process.argv[2];
const offset = Number(process.argv[3] ?? 0.0427);

if (!file || !existsSync(file)) {
  console.error(`fix-audio-sync: no such file: ${file}`);
  process.exit(1);
}

const tmp = file.replace(/\.mp4$/, '.synced.mp4');
execFileSync(
  ffmpeg,
  ['-y', '-i', file, '-itsoffset', String(-offset), '-i', file,
   '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart',
   tmp, '-loglevel', 'error'],
  {stdio: 'inherit'}
);
renameSync(tmp, file);
console.log(`fix-audio-sync: pulled audio ${Math.round(offset * 1000)}ms earlier in ${file}`);
