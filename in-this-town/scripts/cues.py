# Align each script line (pause markers skipped) to its first word in the whisper captions.
# usage: cues.py script.txt captions.json out.json voice_end
import json, re, sys
src, caps, out, end = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
lines = [l.strip() for l in open(src) if l.strip() and not re.fullmatch(r"\[[\d.]+\]", l.strip())]
words = [(norm(c["text"]), c["startMs"] / 1000) for c in json.load(open(caps))]
words = [w for w in words if w[0]]
starts, i = [], 0
for line in lines:
    toks = [norm(t) for t in line.split() if norm(t)][:3]
    best = None
    for j in range(i, min(len(words), i + 40)):
        if all(j + k < len(words) and (words[j + k][0] == toks[k] or words[j + k][0].startswith(toks[k][:4])) for k in range(min(2, len(toks)))):
            best = j; break
    if best is None:
        best = i
    starts.append(round(words[best][1], 2))
    i = best + len(line.split()) - 2 if len(line.split()) > 2 else best + 1
starts[0] = 0
json.dump({"lines": starts, "end": end}, open(out, "w"))
for s, l in zip(starts, lines): print(f"{s:6.2f}  {l[:60]}")
