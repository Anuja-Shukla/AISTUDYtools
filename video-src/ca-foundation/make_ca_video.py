"""Renders a CA Foundation lesson video: Kokoro voiceover + HTML animation (base.html + lesson scenes.js) -> MP4.
Usage: python make_ca_video.py <lesson_dir> <out.mp4> [--stills t1,t2,...]
<lesson_dir> holds lines.txt (one narration line per scene; "caption || spoken text" when they differ) and scenes.js.
With --stills, only PNG frames at those times (seconds) are written next to out.mp4 (quick layout check)."""
import sys, os, re, json, asyncio, subprocess, shutil
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
VOICE = "/home/claude/voice"
FPS = 30
lesson, out = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
stills = None
if "--stills" in sys.argv:
    stills = [float(x) for x in sys.argv[sys.argv.index("--stills") + 1].split(",")]

work = os.path.join(lesson, "_work"); shutil.rmtree(work, ignore_errors=True); os.makedirs(os.path.join(work, "frames"))
for f in ("base.html", "lib.js"): shutil.copy(os.path.join(HERE, f), work)
shutil.copytree(os.path.join(HERE, "package"), os.path.join(work, "package"))
shutil.copy(os.path.join(lesson, "scenes.js"), work)

raw = [l.rstrip("\n") for l in open(os.path.join(lesson, "lines.txt"), encoding="utf-8") if l.strip() and not l.startswith("#")]
caps, spoken = [], []
for l in raw:
    if "||" in l: c, s = [x.strip() for x in l.split("||", 1)]
    else: c = s = l.strip()
    caps.append(c); spoken.append(s)

def chunks(text, maxc=118):
    parts = re.split(r"(?<=[a-z0-9%)₹”'][.?])\s+(?=[A-Z0-9₹“(])", text)
    outp = []
    for p in parts:
        while len(p) > maxc:
            cut = p.rfind(", ", 0, maxc)
            if cut < maxc * 0.35: cut = p.rfind(" ", 0, maxc)
            outp.append(p[:cut + 1].strip()); p = p[cut + 1:].strip()
        if p: outp.append(p)
    # merge very short pieces with the next one
    merged = []
    for p in outp:
        if merged and len(merged[-1]) + len(p) < 70: merged[-1] += " " + p
        else: merged.append(p)
    tot = sum(len(p) for p in merged); acc = 0; res = []
    for p in merged:
        res.append([p, acc / tot]); acc += len(p)
    return res

class LazyK:
    def __init__(self): self.k = None
    def create(self, *a, **kw):
        if self.k is None: self.k = Kokoro(os.path.join(VOICE, "kokoro.onnx"), os.path.join(VOICE, "voices.bin"))
        return self.k.create(*a, **kw)
k = LazyK()
auds, D = [], []
import hashlib
cache = os.path.join(lesson, "_tts"); os.makedirs(cache, exist_ok=True)
DRY = "--dry" in sys.argv
for i, s in enumerate(spoken):
    if DRY:
        sr = 24000; a = np.zeros(int(sr * (len(s.split()) / 2.55)), dtype=np.float32); auds.append(a)
        D.append(round(0.35 + len(a) / sr + 0.75, 3)); continue
    cf = os.path.join(cache, hashlib.sha1(s.encode()).hexdigest()[:16] + ".wav")
    if os.path.exists(cf): a, sr = sf.read(cf, dtype="float32")
    else:
        a, sr = k.create(s, voice="af_heart", speed=1.0, lang="en-us"); sf.write(cf, a, sr)
    sf.write(os.path.join(work, f"vo{i}.wav"), a, sr); auds.append(a)
    lead = 0.35
    D.append(round(lead + len(a) / sr + (1.6 if i == len(spoken) - 1 else 0.75), 3))
TOTAL = sum(D)
# mouth envelope at FPS from the full timeline
tl = np.zeros(int((TOTAL + 1) * sr), dtype=np.float32); start = 0.0
for i, a in enumerate(auds):
    o = int((start + 0.35) * sr); tl[o:o + len(a)] += a; start += D[i]
win = sr // FPS; nfr = int(TOTAL * FPS) + 2
rms = np.array([np.sqrt(np.mean(tl[j * win:(j + 1) * win] ** 2)) for j in range(nfr)])
ref = np.percentile(rms[rms > 1e-4], 92) if np.any(rms > 1e-4) else 1
m = np.clip(rms / ref, 0, 1) ** 0.7
m[rms < 0.06 * ref] = 0
m = np.convolve(m, [0.25, 0.5, 0.25], mode="same")
open(os.path.join(work, "data.js"), "w").write(
    "var LINES=" + json.dumps(caps) + ";var D=" + json.dumps(D) + ";var MOUTH=" + json.dumps([round(float(x), 3) for x in m]) +
    ";var CHUNKS=" + json.dumps([chunks(c) for c in caps]) + ";")

if "--sheet" in sys.argv:
    st0 = [sum(D[:i]) for i in range(len(D))]
    stills = [round(st0[i] + 0.9 * D[i], 2) for i in range(len(D))]

async def frames():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1.5)
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://" + os.path.join(work, "base.html"))
        await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(600)
        if errs: raise SystemExit("page error: " + errs[0])
        if stills is not None:
            for t in stills:
                await pg.evaluate(f"render({t})")
                await pg.screenshot(path=out.replace(".mp4", f"_t{int(t):03d}.png"))
            if "--sheet" in sys.argv:
                from PIL import Image
                ims = [Image.open(out.replace(".mp4", f"_t{int(t):03d}.png")).resize((640, 360)) for t in stills]
                cols = 3; rows = (len(ims) + cols - 1) // cols; g = Image.new("RGB", (640 * cols, 360 * rows), "white")
                for i, im in enumerate(ims): g.paste(im, ((i % cols) * 640, (i // cols) * 360))
                g.save(out.replace(".mp4", "_sheet.png"))
                for t in stills: os.remove(out.replace(".mp4", f"_t{int(t):03d}.png"))
        else:
            n = int(TOTAL * FPS)
            for i in range(n):
                await pg.evaluate(f"render({i / FPS})")
                await pg.screenshot(path=os.path.join(work, f"frames/f{i:05d}.jpg"), type="jpeg", quality=92)
        if errs: raise SystemExit("page error: " + errs[0])
        await b.close()

asyncio.run(frames())
starts = [sum(D[:i]) for i in range(len(D))]
print("lines", len(D), "total %.1fs" % TOTAL, "scene starts", [round(x, 1) for x in starts])
if stills is None:
    ins, f = [], []
    for i in range(len(spoken)):
        ins += ["-i", os.path.join(work, f"vo{i}.wav")]; ms = int((starts[i] + 0.35) * 1000)
        f.append(f"[{i+1}:a]adelay={ms}|{ms},aformat=channel_layouts=stereo[a{i}]")
    f.append("".join(f"[a{i}]" for i in range(len(spoken))) + f"amix=inputs={len(spoken)}:normalize=0,loudnorm=I=-16:TP=-1.5,apad=whole_dur={TOTAL:.2f}[a]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(work, "frames/f%05d.jpg")] + ins +
                   ["-filter_complex", ";".join(f), "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-pix_fmt", "yuv420p",
                    "-vf", "scale=1920:1080", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-t", f"{TOTAL - 0.04:.2f}", out], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "2", "-i", out, "-frames:v", "1", "-q:v", "3", out.replace(".mp4", "-poster.jpg")], check=True)
    shutil.rmtree(work)
    print("done", out)
