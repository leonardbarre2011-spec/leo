"""Generate the narration: Edge neural TTS (AndrewNeural) per line, word timings,
then speed + pitch up (asetrate) like the reference creators do.
Outputs build/voice.wav and build/words.json (times in seconds, after speed-up)."""
import asyncio, json, os, subprocess, sys
import edge_tts

VOICE = "en-US-AndrewNeural"
EP = sys.argv[1] if len(sys.argv) > 1 else "sun"
GAP = 0.10        # silence between lines (before speed-up)
SR = 24000

HERE = os.path.dirname(os.path.abspath(__file__))
EPDIR = os.path.join(HERE, "episodes", EP)
CFG = json.load(open(os.path.join(EPDIR, "config.json")))
RATE = CFG["rate"]
K = CFG["K"]      # speed+pitch factor (asetrate)
BUILD = os.path.join(HERE, "..", "build", EP)
os.makedirs(BUILD, exist_ok=True)


async def tts_line(i, text):
    mp3 = os.path.join(BUILD, f"line{i:02d}.mp3")
    words = []
    c = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    with open(mp3, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"w": ch["text"], "t0": ch["offset"] / 1e7,
                              "t1": (ch["offset"] + ch["duration"]) / 1e7})
    return mp3, words


def dur(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                   "-of", "csv=p=0", path])
    return float(out)


async def main():
    lines = [l.strip() for l in open(os.path.join(EPDIR, "script.txt")) if l.strip()]
    allw, parts, t = [], [], 0.0
    for i, line in enumerate(lines):
        mp3, words = await tts_line(i, line)
        wav = mp3.replace(".mp3", ".wav")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", mp3, "-ar", str(SR), "-ac", "1", wav], check=True)
        d = dur(wav)
        for w in words:
            allw.append({"w": w["w"], "t0": t + w["t0"], "t1": t + w["t1"], "line": i})
        parts.append(wav)
        t += d + GAP
    # concat with gaps
    lst = os.path.join(BUILD, "concat.txt")
    sil = os.path.join(BUILD, "gap.wav")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i",
                    f"anullsrc=r={SR}:cl=mono", "-t", str(GAP), sil], check=True)
    with open(lst, "w") as f:
        for p in parts:
            f.write(f"file '{p}'\nfile '{sil}'\n")
    raw = os.path.join(BUILD, "voice_raw.wav")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, raw], check=True)
    # speed + pitch up, light compression / presence boost like TikTok voiceovers
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af",
                    f"asetrate={SR}*{K},aresample=44100,highpass=f=80,"
                    "equalizer=f=3500:t=q:w=1:g=3,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,"
                    "loudnorm=I=-14:TP=-1.5",
                    os.path.join(BUILD, "voice.wav")], check=True)
    for w in allw:
        w["t0"] /= K; w["t1"] /= K
    total = dur(os.path.join(BUILD, "voice.wav"))
    json.dump({"duration": total, "lines": lines, "words": allw},
              open(os.path.join(BUILD, "words.json"), "w"), indent=1)
    sp = allw[-1]["t1"] - allw[0]["t0"]
    print(f"duration {total:.1f}s, {len(allw)} words, {len(allw)/sp*60:.0f} wpm")


asyncio.run(main())
