"""Renders the AIStudyTools videos: TTS voiceover + HTML animation -> MP4.
Usage: python make_video.py <voice_dir> <font_woff2> <out_dir>
Each video is re-rendered only when its HTML or script changes (tracked in <out_dir>/<name>.src-sha)."""
import sys, os, asyncio, subprocess, shutil, hashlib
import soundfile as sf
from kokoro_onnx import Kokoro
from playwright.async_api import async_playwright

VIDEOS = [  # (animation html, voiceover lines, output name)
    ("explainer.html", "lines.txt", "aistudytools-explainer"),
    ("healthx.html", "healthx-lines.txt", "healthx-explainer"),
    ("skillx.html", "skillx-lines.txt", "skillx-explainer"),
    ("overview.html", "overview-lines.txt", "aistudytools-overview"),
    ("manual.html", "manual-lines.txt", "skillx-manual-to-simulation"),
]
HERE = os.path.dirname(os.path.abspath(__file__))
voice_dir, font, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out_dir, exist_ok=True)
k = Kokoro(os.path.join(voice_dir, "kokoro.onnx"), os.path.join(voice_dir, "voices.bin"))

async def frames(work, html_name):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1.5)
        await pg.goto("file://" + os.path.join(work, html_name))
        await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(800)
        total = await pg.evaluate("TOTAL"); D = await pg.evaluate("D"); n = int(total * 30)
        for i in range(n):
            await pg.evaluate(f"render({i/30})")
            await pg.screenshot(path=os.path.join(work, f"frames/f{i:05d}.jpg"), type="jpeg", quality=92)
        await b.close(); return total, D

def render(html_name, lines_name, name):
    work = os.path.join(HERE, "_work_" + name)
    os.makedirs(os.path.join(work, "frames"), exist_ok=True)
    os.makedirs(os.path.join(work, "package/files"), exist_ok=True)
    shutil.copy(font, os.path.join(work, "package/files/outfit-latin-wght-normal.woff2"))
    shutil.copy(os.path.join(HERE, html_name), os.path.join(work, html_name))
    lines = [l.strip() for l in open(os.path.join(HERE, lines_name), encoding="utf-8") if l.strip()]
    for i, l in enumerate(lines):
        s, sr = k.create(l, voice="af_heart", speed=1.0, lang="en-us")
        sf.write(os.path.join(work, f"vo{i+1}.wav"), s, sr)
    total, D = asyncio.run(frames(work, html_name))
    S = [sum(D[:i]) for i in range(len(D))]
    ins, f = [], []
    for i in range(len(lines)):
        ins += ["-i", os.path.join(work, f"vo{i+1}.wav")]; ms = int((S[i] + 0.35) * 1000)
        f.append(f"[{i+1}:a]adelay={ms}|{ms},aformat=channel_layouts=stereo[a{i}]")
    f.append("".join(f"[a{i}]" for i in range(len(lines))) + f"amix=inputs={len(lines)}:normalize=0,loudnorm=I=-16:TP=-1.5,apad=whole_dur={total:.2f}[a]")
    mp4 = os.path.join(out_dir, name + ".mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", os.path.join(work, "frames/f%05d.jpg")] + ins +
                   ["-filter_complex", ";".join(f), "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-crf", "20", "-preset", "slow", "-pix_fmt", "yuv420p",
                    "-vf", "scale=1920:1080", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-t", f"{total - 0.04:.2f}", mp4], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{total - 1:.2f}", "-i", mp4, "-frames:v", "1", "-q:v", "3", os.path.join(out_dir, name + "-poster.jpg")], check=True)
    shutil.rmtree(work); print("video done", name, total)

for html_name, lines_name, name in VIDEOS:
    h = hashlib.sha256()
    for fn in (html_name, lines_name):
        h.update(open(os.path.join(HERE, fn), "rb").read())
    digest = h.hexdigest()
    marker = os.path.join(out_dir, name + ".src-sha")
    old = open(marker).read().strip() if os.path.exists(marker) else None
    if old == digest or (old is None and os.path.exists(os.path.join(out_dir, name + ".mp4"))):
        print("up to date", name)
    else:
        render(html_name, lines_name, name)
    open(marker, "w").write(digest + "\n")
