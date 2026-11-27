# High-quality narrator with Chatterbox TTS (default voice, no pitch processing).
import sys, re, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
torch.set_num_threads(4)
torch.manual_seed(7)
src, out = sys.argv[1], sys.argv[2]
m = ChatterboxTTS.from_pretrained(device="cpu")
chunks = []
for line in open(src).read().splitlines():
    line = line.strip()
    if not line:
        continue
    mm = re.fullmatch(r"\[(\d*\.?\d+)\]", line)
    if mm:
        chunks.append(torch.zeros(1, int(float(mm.group(1)) * m.sr))); continue
    w = m.generate(line, exaggeration=0.72, cfg_weight=0.4, temperature=0.7)
    # trim leading/trailing near-silence
    a = w.abs()[0]
    idx = (a > 0.01).nonzero()
    if len(idx):
        w = w[:, max(0, idx[0].item() - 800): idx[-1].item() + 2400]
    chunks.append(w)
    chunks.append(torch.zeros(1, int((0.2 if line.endswith("...") else 0.1) * m.sr)))
ta.save(out, torch.cat(chunks, dim=1), m.sr)
