import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const out = process.argv[2] ?? "out/first-step.mp4";
const crf = Number(process.argv[3] ?? 17);

console.log("bundling…");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const composition = await selectComposition({
  serveUrl, id: "FirstStep", browserExecutable: BROWSER, chromiumOptions: { gl: "angle" },
});
console.log(`rendering ${composition.width}x${composition.height} @${composition.fps} · ${composition.durationInFrames}f`);
let last = -1;
await renderMedia({
  composition, serveUrl, codec: "h264", outputLocation: out,
  browserExecutable: BROWSER, chromiumOptions: { gl: "angle" },
  crf, jpegQuality: 96, concurrency: 3,
  x264Preset: "slow",
  colorSpace: "bt709",
  enforceAudioTrack: true,
  timeoutInMilliseconds: 120000,
  audioCodec: "aac", audioBitrate: "256k",
  onProgress: ({ progress }) => {
    const p = Math.floor(progress * 100);
    if (p !== last && p % 5 === 0) { last = p; console.log(`  ${p}%`); }
  },
});
console.log("done ->", out);
process.exit(0);
