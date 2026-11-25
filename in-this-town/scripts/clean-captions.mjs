// Merge whisper sub-tokens and punctuation into whole words; strip quotes.
import fs from "fs";
const raw = JSON.parse(fs.readFileSync(process.env.IN ?? "public/captions.raw.json", "utf8"));
const out = [];
let spaceNext = false;
for (const c of raw) {
  const contraction = /^'(s|t|d|ll|re|ve|m)$/i.test(c.text);
  let t = contraction ? c.text : c.text.replace(/["']/g, "");
  if (!t.trim()) { if (t.startsWith(" ")) spaceNext = true; continue; }
  if (spaceNext && !t.startsWith(" ")) t = " " + t;
  spaceNext = false;
  const prev = out[out.length - 1];
  const glue = prev && (!t.startsWith(" ") || /^[.,!?;:]+$/.test(t.trim()));
  if (glue) { prev.text += t.trim(); prev.endMs = c.endMs; continue; }
  out.push({text: " " + t.trim(), startMs: c.startMs, endMs: c.endMs, timestampMs: c.timestampMs, confidence: c.confidence});
}
out[0].text = out[0].text.trimStart();
for (const w of out) if (/[.!?]$/.test(w.text)) w.pageBreakAfter = true;
fs.writeFileSync(process.env.OUT ?? "public/captions.json", JSON.stringify(out, null, 1));
console.log(out.map(c => `${(c.startMs/1000).toFixed(2)} ${c.text}${c.pageBreakAfter ? " |" : ""}`).join("\n"));
