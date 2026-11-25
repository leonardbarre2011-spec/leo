import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import path from "path";
const out = process.argv[2];
const frames = process.argv.slice(3).map(Number);
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts")});
const composition = await selectComposition({serveUrl, id: "TheKnocking", chromiumOptions: {gl: "swangle"}});
for (const f of frames) {
  const t0 = Date.now();
  await renderStill({composition, serveUrl, frame: f, output: `${out}/f${String(f).padStart(4, "0")}.jpeg`, imageFormat: "jpeg", scale: 0.4, chromiumOptions: {gl: "swangle"}});
  console.log(f, Date.now() - t0, "ms");
}
