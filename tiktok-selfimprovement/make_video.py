"""
100% free, 100% local TikTok generator (faceless self-improvement style).
  - Voice: Kokoro TTS (open-source, Apache 2.0) -> runs on CPU, no account, no API key
  - Word timings: faster-whisper (open-source) -> word-by-word animated captions
  - Music + SFX: synthesized with numpy -> zero copyright risk
  - Visuals: rendered with Pillow, encoded with ffmpeg

Usage:  python make_video.py [video_key ...]     (default: all videos in scripts.py)
"""
import math, os, random, shutil, subprocess, sys, json
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

from scripts import VIDEOS

HERE = os.path.dirname(os.path.abspath(__file__))
MODELS = os.environ.get("KOKORO_DIR", os.path.join(HERE, "models"))
OUT = os.path.join(HERE, "output")
W, H, FPS = 1080, 1920, 30
SR = 24000
VOICE = os.environ.get("VOICE", "am_michael")
SPEED = float(os.environ.get("SPEED", "1.05"))
MODE = os.environ.get("MODE", "3d")  # "3d" = Three.js environment, "2d" = flat animated background
FONT_BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FONT_BOLD = "/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf"
FONT_EMOJI = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"


# ----------------------------------------------------------------------------- audio
def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(0.02 * SR))
    b = min(len(x), idx[-1] + int(0.06 * SR))
    return x[a:b]


def norm(w):
    return "".join(c for c in w.lower() if c.isalnum())


def align(script_words, heard, dur, t0):
    """Display the exact script words, timed with whisper's word timestamps.
    Unmatched words are interpolated between their matched neighbours."""
    import difflib
    a = [norm(w) for w in script_words]
    b = [norm(w.word) for w in heard]
    times = [None] * len(a)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            hw = heard[blk.b + k]
            times[blk.a + k] = (hw.start, hw.end)
    # interpolate gaps
    n = len(a)
    i = 0
    while i < n:
        if times[i] is None:
            j = i
            while j < n and times[j] is None:
                j += 1
            lo = times[i - 1][1] if i > 0 else 0.0
            hi = times[j][0] if j < n else dur
            if hi <= lo:
                hi = lo + 0.25 * (j - i)
            weights = [max(1, len(a[k])) for k in range(i, j)]
            tot, acc = sum(weights), lo
            for k, wgt in zip(range(i, j), weights):
                step = (hi - lo) * wgt / tot
                times[k] = (acc, acc + step); acc += step
            i = j
        else:
            i += 1
    return [{"w": w, "s": t0 + s, "e": t0 + e} for w, (s, e) in zip(script_words, times)]


def build_voice(cfg):
    from kokoro_onnx import Kokoro
    from faster_whisper import WhisperModel

    tts = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    asr = WhisperModel("base.en", device="cpu", compute_type="int8")
    pieces, segs, t = [], [], 0.25  # small lead-in so the first word lands on frame ~8
    pieces.append(np.zeros(int(0.25 * SR), np.float32))
    for i, seg_def in enumerate(cfg["segments"]):
        text, label, emoji = seg_def[:3]
        direction = seg_def[3] if len(seg_def) > 3 else {}
        audio, sr = tts.create(text, voice=VOICE, speed=SPEED, lang="en-us")
        assert sr == SR
        audio = trim(audio.astype(np.float32))
        # word timestamps on this segment (whisper wants 16 kHz)
        n16 = int(len(audio) * 16000 / SR)
        a16 = np.interp(np.linspace(0, len(audio) - 1, n16), np.arange(len(audio)), audio).astype(np.float32)
        result, _ = asr.transcribe(a16, word_timestamps=True, language="en", condition_on_previous_text=False)
        heard = [w for s in result for w in s.words]
        dur = len(audio) / SR
        words = align(text.split(), heard, dur, t)
        segs.append({"start": t, "end": t + dur, "label": label, "emoji": emoji, "words": words, "text": text, **direction})
        pieces.append(audio)
        gap = 0.22 if i < len(cfg["segments"]) - 1 else 0.6
        pieces.append(np.zeros(int(gap * SR), np.float32))
        t += dur + gap
    voice = np.concatenate(pieces)
    return voice, segs


def soft_saw(freq, t, n=8):
    return sum(np.sin(2 * np.pi * freq * k * t) / k ** 1.6 for k in range(1, n + 1))


def build_music(total, seg_starts, seed=0):
    rng = np.random.default_rng(seed)
    n = int(total * SR)
    t = np.arange(n) / SR
    # dark, emotional progression (Am - F - C - G), 4 s per chord
    chords = [[57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62]]
    pad = np.zeros(n, np.float32)
    clen = int(4 * SR)
    for ci in range(int(np.ceil(n / clen)) + 1):
        notes = chords[ci % 4]
        a, b = ci * clen, min(n, ci * clen + clen + int(0.8 * SR))
        if a >= n:
            break
        tt = t[a:b] - t[a]
        env = np.minimum(1, tt / 0.9) * np.minimum(1, (tt[-1] - tt + 1e-3) / 0.8)
        sig = np.zeros(b - a)
        for m in notes + [notes[0] - 12]:
            f = 440 * 2 ** ((m - 69) / 12)
            sig += soft_saw(f, tt) + 0.6 * soft_saw(f * 1.004, tt)
        pad[a:b] += (sig * env).astype(np.float32)
    # gentle low-pass (one-pole), done in chunks via cumulative filter approximation
    k = 0.06
    out = np.empty_like(pad); acc = 0.0
    for i in range(0, n, 1):
        acc += k * (pad[i] - acc); out[i] = acc
    pad = out
    # heartbeat kick on every beat (80 bpm)
    beat = 60 / 80
    kick = np.zeros(n, np.float32)
    kl = int(0.35 * SR); kt = np.arange(kl) / SR
    kshape = np.sin(2 * np.pi * (45 * kt + 60 * (1 - np.exp(-kt * 25)) / 25)) * np.exp(-kt * 9)
    bt = 1.0
    while bt < total - 0.4:
        i = int(bt * SR); kick[i:i + kl] += kshape[: n - i]
        bt += beat
    # whoosh at every cut, impact at the start
    fx = np.zeros(n, np.float32)
    wl = int(0.45 * SR); wt = np.arange(wl) / SR
    for s in seg_starts[1:]:
        i = max(0, int((s - 0.18) * SR))
        noise = rng.standard_normal(wl)
        noise = np.convolve(noise, np.ones(12) / 12, mode="same")
        env = np.sin(np.pi * wt / wt[-1]) ** 2
        fx[i:i + wl] += (noise * env)[: n - i] * 0.6
    il = int(1.2 * SR); it = np.arange(il) / SR
    fx[:il] += (np.sin(2 * np.pi * 38 * it) * np.exp(-it * 3.5)) * 1.2
    pad /= np.max(np.abs(pad)) + 1e-9
    music = 0.10 * pad + 0.16 * kick + 0.10 * fx
    fade = int(0.8 * SR)
    music[-fade:] *= np.linspace(1, 0, fade)
    return music.astype(np.float32)


def write_wav(path, x):
    import soundfile as sf
    sf.write(path, x, SR)


# ----------------------------------------------------------------------------- visuals
G = {}  # per-worker globals


def font(path, size, cache={}):
    key = (path, size)
    if key not in cache:
        cache[key] = ImageFont.truetype(path, size)
    return cache[key]


def emoji_img(ch, size):
    f = ImageFont.truetype(FONT_EMOJI, 109)
    im = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((80, 80), ch, font=f, embedded_color=True, anchor="mm")
    bbox = im.getbbox() or (0, 0, 160, 160)
    im = im.crop(bbox)
    r = size / max(im.size)
    return im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)


def group_words(words, max_words=3, max_chars=15):
    groups, cur = [], []
    for w in words:
        cur.append(w)
        txt = " ".join(x["w"] for x in cur)
        if len(cur) >= max_words or len(txt) >= max_chars or w["w"][-1:] in ".,!?":
            groups.append(cur); cur = []
    if cur:
        groups.append(cur)
    return groups


def init_worker(job):
    G.update(job)
    random.seed(1)
    G["particles"] = [(random.uniform(0, W), random.uniform(0, H), random.uniform(2, 6),
                       random.uniform(20, 70), random.uniform(0, 6.28)) for _ in range(70)]
    # background gradient
    y = np.linspace(0, 1, H)[:, None]
    base = np.zeros((H, W, 3), np.float32)
    top = np.array([6, 6, 10], np.float32); bot = np.array([16, 13, 22], np.float32)
    base = (top * (1 - y)[..., None] + bot * y[..., None]) * np.ones((1, W, 1), np.float32)
    G["base"] = base
    # glow sprite
    gs = 1500
    yy, xx = np.mgrid[0:gs, 0:gs]
    d = np.sqrt((xx - gs / 2) ** 2 + (yy - gs / 2) ** 2) / (gs / 2)
    G["glow"] = np.clip(np.exp(-d ** 2 * 4.0), 0, 1).astype(np.float32)
    # vignette
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    G["vig"] = np.clip(1 - 0.55 * np.clip(d - 0.45, 0, 1) ** 1.3, 0, 1).astype(np.float32)[..., None]
    rng = np.random.default_rng(3)
    G["grain"] = [rng.normal(0, 4, (H // 2, W // 2)).astype(np.float32) for _ in range(6)]
    G["emojis"] = [emoji_img(s["emoji"], 250) if s["emoji"] else None for s in G["segs"]]
    G["groups"] = []
    for s in G["segs"]:
        for g in (group_words(s["words"], max_words=7, max_chars=34) if G.get("bg3d") else group_words(s["words"])):
            G["groups"].append(g)
    for i, g in enumerate(G["groups"]):
        nxt = G["groups"][i + 1][0]["s"] if i + 1 < len(G["groups"]) else g[-1]["e"] + 0.8
        g_end = min(nxt, g[-1]["e"] + 0.7)
        for w in g:
            w["g_end"] = g_end


def ease_out_back(x):
    c1, c3 = 1.70158, 2.70158
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def render_caption(group, t, hue):
    words = [w["w"].upper() for w in group]
    size = 136
    f = font(FONT_BLACK, size)
    sp = size * 0.28
    widths = [f.getlength(w) for w in words]
    while sum(widths) + sp * (len(words) - 1) > 960 and size > 70:
        size -= 6; f = font(FONT_BLACK, size); sp = size * 0.28
        widths = [f.getlength(w) for w in words]
    total = sum(widths) + sp * (len(words) - 1)
    im = Image.new("RGBA", (int(total) + 60, size + 80), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = 30
    hi = tuple(int(c) for c in hue)
    for w, wd, gw in zip(words, widths, group):
        active = gw["s"] <= t < (gw["e"] + 0.05)
        spoken = t >= gw["s"]
        col = hi if active else ((255, 255, 255) if spoken else (255, 255, 255))
        d.text((x, 40), w, font=f, fill=col, stroke_width=11, stroke_fill=(0, 0, 0), anchor="lt")
        x += wd + sp
    return im


FONT_SOBER = "/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf"


def render_caption_sober(group):
    """Clean, minimal caption: sentence case, white, soft shadow, max 2 lines."""
    text = " ".join(w["w"] for w in group)
    f = font(FONT_SOBER, 60)
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if f.getlength(trial) > 880 and cur:
            lines.append(cur); cur = w
        else:
            cur = trial
    lines.append(cur)
    lh = 76
    pad = 40
    wmax = int(max(f.getlength(l) for l in lines)) + pad * 2
    hh = lh * len(lines) + pad * 2
    shadow = Image.new("RGBA", (wmax, hh), (0, 0, 0, 0))
    ds = ImageDraw.Draw(shadow)
    txt = Image.new("RGBA", (wmax, hh), (0, 0, 0, 0))
    dt = ImageDraw.Draw(txt)
    for i, l in enumerate(lines):
        y = pad + i * lh + lh / 2
        ds.text((wmax / 2, y + 3), l, font=f, fill=(0, 0, 0, 200), anchor="mm")
        dt.text((wmax / 2, y), l, font=f, fill=(255, 255, 255, 255), anchor="mm")
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    return Image.alpha_composite(shadow, txt)


def frame(fi):
    t = fi / FPS
    segs, hue = G["segs"], np.array(G["hue"], np.float32)
    si = 0
    for i, s in enumerate(segs):
        if t >= s["start"] - 0.12:
            si = i
    seg = segs[si]
    since = t - (seg["start"] - 0.12)

    if G.get("bg3d"):
        bg = Image.open(os.path.join(G["bg3d"], f"{fi:05d}.jpg")).convert("RGB").resize((W, H), Image.LANCZOS)
        pil = bg.convert("RGBA")
    else:
        pil = render_2d_background(fi, t, si, seg, since, hue)
    pil = draw_overlays(pil, fi, t, si, since, hue)
    return finish(pil, fi, since, si)


def render_2d_background(fi, t, si, seg, since, hue):
    img = G["base"].copy()
    # moving glow, alternating side per segment, punch on cut
    gl = G["glow"]
    side = -1 if si % 2 else 1
    cx = W / 2 + side * 260 + 120 * math.sin(t * 0.6)
    cy = H * 0.42 + 160 * math.cos(t * 0.45)
    punch = 1 + 0.6 * math.exp(-since * 5)
    col = hue * (0.42 * punch)
    gs = gl.shape[0]
    x0, y0 = int(cx - gs / 2), int(cy - gs / 2)
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + gs), min(H, y0 + gs)
    img[ya:yb, xa:xb] += gl[ya - y0:yb - y0, xa - x0:xb - x0, None] * col[None, None, :]
    # second faint glow at bottom
    x1, y1 = int(W / 2 - side * 300 - gs / 2), int(H * 0.85 - gs / 2)
    xa, ya, xb, yb = max(0, x1), max(0, y1), min(W, x1 + gs), min(H, y1 + gs)
    img[ya:yb, xa:xb] += gl[ya - y1:yb - y1, xa - x1:xb - x1, None] * (hue * 0.12)[None, None, :]

    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    # particles
    for (px, py, r, sp, ph) in G["particles"]:
        y = (py - t * sp) % H
        x = px + 18 * math.sin(t * 0.8 + ph)
        a = int(60 + 50 * math.sin(t * 2 + ph))
        d.ellipse((x - r, y - r, x + r, y + r), fill=(int(hue[0]), int(hue[1]), int(hue[2]), a))
    # huge background label (list number)
    if seg["label"]:
        lab = seg["label"]
        sc = 1 + 0.25 * math.exp(-since * 6)
        f = font(FONT_BLACK, int(560 * sc if len(lab) <= 2 else 380 * sc))
        a = int(min(1, since * 6) * 70)
        d.text((W / 2, 1420), lab, font=f, fill=(int(hue[0]), int(hue[1]), int(hue[2]), a), anchor="mm",
               stroke_width=4, stroke_fill=(255, 255, 255, int(a * 0.8)))
    pil = Image.alpha_composite(pil, ov)

    # emoji (bounce in, then float)
    em = G["emojis"][si]
    if em is not None:
        k = min(1, max(0, since) / 0.32)
        s = max(0.01, ease_out_back(k))
        e2 = em.resize((max(1, int(em.width * s)), max(1, int(em.height * s))), Image.BILINEAR) if s != 1 else em
        ey = 690 + 14 * math.sin(t * 2.2)
        pil.alpha_composite(e2, (int(W / 2 - e2.width / 2), int(ey - e2.height / 2)))
    return pil


def draw_overlays(pil, fi, t, si, since, hue):
    if G.get("bg3d"):  # 3D mode: only sober captions on top, everything else is in the 3D scene
        for g in G["groups"]:
            if g[0]["s"] - 0.05 <= t < g[-1]["g_end"]:
                key = id(g)
                cache = G.setdefault("capcache", {})
                if key not in cache:
                    cache.clear(); cache[key] = render_caption_sober(g)
                cap = cache[key]
                a = min(1, (t - g[0]["s"] + 0.05) / 0.12) * min(1, (g[-1]["g_end"] - t) / 0.1)
                if a < 1:
                    cap = cap.copy(); cap.putalpha(cap.getchannel("A").point(lambda v: int(v * a)))
                pil.alpha_composite(cap, (int(W / 2 - cap.width / 2), int(G.get("cap_y", 1060) - cap.height / 2)))
                break
        return pil
    # captions
    for g in G["groups"]:
        if g[0]["s"] - 0.04 <= t < g[-1]["g_end"]:
            cap = render_caption(g, t, G["accent"])
            k = min(1, (t - g[0]["s"] + 0.04) / 0.12)
            s = 0.82 + 0.18 * ease_out_back(k)
            if s != 1:
                cap = cap.resize((int(cap.width * s), int(cap.height * s)), Image.BILINEAR)
            pil.alpha_composite(cap, (int(W / 2 - cap.width / 2), int(G.get("cap_y", 1060) - cap.height / 2)))
            break

    # title pill + progress bar (top, below TikTok's UI)
    d2 = ImageDraw.Draw(pil)
    tf = font(FONT_BLACK, 50)
    tw = tf.getlength(G["title"])
    px0, py0 = W / 2 - tw / 2 - 36, 250
    d2.rounded_rectangle((px0, py0, px0 + tw + 72, py0 + 92), radius=46, fill=(0, 0, 0, 255),
                         outline=tuple(int(c) for c in hue), width=4)
    d2.text((W / 2, py0 + 47), G["title"], font=tf, fill=(255, 255, 255), anchor="mm")
    prog = min(1, t / G["dur"])
    d2.rectangle((0, 0, W, 12), fill=(30, 30, 36))
    d2.rectangle((0, 0, int(W * prog), 12), fill=tuple(int(c) for c in hue))
    return pil


def finish(pil, fi, since, si):
    arr = np.asarray(pil.convert("RGB")).astype(np.float32)
    if G.get("bg3d"):  # cinematic finish only: light vignette + fine grain
        arr *= (0.55 + 0.45 * G["vig"])
        arr += np.repeat(np.repeat(G["grain"][fi % 6] * 0.6, 2, 0), 2, 1)[..., None]
        return np.clip(arr, 0, 255).astype(np.uint8).tobytes()
    # zoom punch on cuts (the 3D camera already does its own FOV punch)
    z = 1 + (0.012 if G.get("bg3d") else 0.035) * math.exp(-max(0, since) * 7)
    if z > 1.002:
        im2 = Image.fromarray(arr.astype(np.uint8))
        cw, ch = int(W / z), int(H / z)
        im2 = im2.crop(((W - cw) // 2, (H - ch) // 2, (W - cw) // 2 + cw, (H - ch) // 2 + ch)).resize((W, H), Image.BILINEAR)
        arr = np.asarray(im2).astype(np.float32)
    # flash
    fl = 70 * math.exp(-max(0, since) * 14) if si > 0 else 0
    arr = arr + fl
    arr *= G["vig"]
    gr = G["grain"][fi % 6]
    arr += np.repeat(np.repeat(gr, 2, 0), 2, 1)[..., None]
    return np.clip(arr, 0, 255).astype(np.uint8).tobytes()


# ----------------------------------------------------------------------------- main
def make(key):
    cfg = VIDEOS[key]
    os.makedirs(OUT, exist_ok=True)
    print(f"[{key}] voice + timings...", flush=True)
    voice, segs = build_voice(cfg)
    total = len(voice) / SR + 0.2
    music = build_music(total, [s["start"] for s in segs], seed=hash(key) % 1000)
    voice = np.pad(voice, (0, len(music) - len(voice)))
    mix = voice / (np.max(np.abs(voice)) + 1e-9) * 0.9 + music
    mix /= np.max(np.abs(mix)) + 1e-9
    wav = os.path.join(OUT, f"{key}.wav")
    write_wav(wav, (mix * 0.95).astype(np.float32))

    hue = cfg["hue"]
    accent = tuple(min(255, int(c * 0.6 + 255 * 0.4)) for c in hue)
    job = {"segs": segs, "hue": hue, "accent": (255, 214, 64) if hue[2] > 150 or hue[0] > 200 and hue[1] < 120 else accent,
           "title": cfg["title"], "dur": total}
    nframes = int(total * FPS)
    mp4 = os.path.join(OUT, f"{key}.mp4")
    print(f"[{key}] rendering {nframes} frames ({total:.1f}s)...", flush=True)
    ff = subprocess.Popen([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", wav,
        "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
        "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-maxrate", "5M", "-bufsize", "10M", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", mp4,
    ], stdin=subprocess.PIPE)
    if MODE == "3d":
        frames_dir = os.path.join(OUT, f"_frames_{key}")
        shutil.rmtree(frames_dir, ignore_errors=True)
        job3d = {"page": "world.html", "segs": [{k: x.get(k) for k in ("start", "label", "place", "anim", "cam")} for x in segs],
                 "hue": list(hue), "dur": nframes / FPS, "fps": FPS, "w": 720, "h": 1280, "seed": sum(map(ord, key))}
        jp = os.path.join(OUT, f"_job_{key}.json")
        with open(jp, "w") as fh:
            json.dump(job3d, fh)
        print(f"[{key}] rendering 3D environment...", flush=True)
        subprocess.run(["node", os.path.join(HERE, "scene3d", "render3d.js"), jp, frames_dir, str(os.cpu_count())], check=True)
        job["bg3d"] = frames_dir
        job["cap_y"] = 1330
    with Pool(os.cpu_count(), initializer=init_worker, initargs=(job,)) as pool:
        for b in pool.imap(frame, range(nframes), chunksize=6):
            ff.stdin.write(b)
    ff.stdin.close(); ff.wait()
    with open(os.path.join(OUT, f"{key}.json"), "w") as fh:
        json.dump({"segments": segs, "caption": cfg["caption"]}, fh, indent=1)
    with open(os.path.join(OUT, f"{key}_caption.txt"), "w") as fh:
        fh.write(cfg["caption"] + "\n")
    os.remove(wav)
    if MODE == "3d":
        shutil.rmtree(frames_dir, ignore_errors=True); os.remove(jp)
    print(f"[{key}] done -> {mp4}", flush=True)


if __name__ == "__main__":
    keys = sys.argv[1:] or list(VIDEOS)
    for k in keys:
        make(k)
