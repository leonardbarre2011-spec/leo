import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const COMP = process.env.COMP ?? "FirstStep";
const frames = process.argv.slice(2).map(Number);
if (!frames.length) { console.error("usage: node tools/qc.mjs <frame> ..."); process.exit(1); }

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const out = "probe/qc";
fs.mkdirSync(out, { recursive: true });
console.log("bundling…");
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  onProgress: () => {},
});
const comp = await selectComposition({ serveUrl, id: COMP, browserExecutable: BROWSER, chromiumOptions: { gl: "angle" } });
for (const f of frames) {
  const o = path.join(out, `${COMP === "FirstStep" ? "f" : "x"}${String(f).padStart(4, "0")}.png`);
  await renderStill({
    composition: comp,
    serveUrl,
    output: o,
    frame: f,
    browserExecutable: BROWSER,
    chromiumOptions: { gl: "angle" },
    timeoutInMilliseconds: 120000,
  });
  console.log("✓", f);
}
process.exit(0);
