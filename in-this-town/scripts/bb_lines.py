# Black-box crew lines with Chatterbox, each crew member cloned from a different synthetic Kokoro voice.
import sys, json, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
torch.set_num_threads(4); torch.manual_seed(11)
sc = sys.argv[1]
m = ChatterboxTTS.from_pretrained(device="cpu")
lines = [
  ("pip", "Guys... the keys are moving!", 0.75),
  ("turbo", "What was that?!", 0.9),
  ("ace", "It's in the vents! It's in the vents!", 0.95),
  ("ray", "Get the gun! Get the gun!", 0.85),
  ("mike", "I got a gun!", 0.9),
  ("turbo", "Hold the door! I'll hold the door!", 0.95),
  ("ace", "Mayday, mayday, this is Odyssey J X eleven!", 0.85),
  ("mike", "Reloading!", 0.9),
  ("ray", "It's open.", 0.3),
  ("pip", "Keys. Keys. Keys.", 0.6),
]
for i, (who, text, ex) in enumerate(lines):
    w = m.generate(text, audio_prompt_path=f"{sc}/bb/{who}.wav", exaggeration=ex, cfg_weight=0.4, temperature=0.75)
    ta.save(f"{sc}/bb/line{i:02d}_{who}.wav", w, m.sr)
    print(i, who, round(w.shape[-1] / m.sr, 2), flush=True)
