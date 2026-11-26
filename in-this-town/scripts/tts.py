# Kokoro TTS narrator: blend of am_liam (60%) + am_santa (40%), lines joined with pauses.
import sys, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
model_dir, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
k = Kokoro(f"{model_dir}/kokoro-v1.0.onnx", f"{model_dir}/voices-v1.0.bin")
style = k.get_voice_style("am_liam") * 0.6 + k.get_voice_style("am_santa") * 0.4
sr = 24000
chunks = []
for line in open(src).read().splitlines():
    line = line.strip()
    if not line:
        continue
    m = re.fullmatch(r"\[(\d*\.?\d+)\]", line)
    if m:
        chunks.append(np.zeros(int(float(m.group(1)) * sr), dtype=np.float32)); continue
    s, sr = k.create(line, voice=style, speed=0.95, lang="en-us")
    chunks.append(s.astype(np.float32))
    pause = 0.45 if line.endswith("...") else 0.3
    chunks.append(np.zeros(int(pause * sr), dtype=np.float32))
sf.write(out, np.concatenate(chunks), sr)
