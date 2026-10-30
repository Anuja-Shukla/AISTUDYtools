"""Switch CA Foundation from free to paid (₹4,999, 1 year). Run ONLY after pay.aistudytools.com is live
(check.php all green, Razorpay keys in config.php, test payment done).

  python3 site-src/launch_paid_ca.py bundle OUT.zip   # 1. course files + videos for the server's private/ folder
  (upload OUT.zip to the server and extract it inside the folder that holds index.php, then test as admin)
  python3 site-src/launch_paid_ca.py apply             # 2. lock the public pages and remove the files from the repo
  then: commit and push.

Faculty registered in pay.aistudytools.com/admin keep free access; everyone else pays.
"""
import os, re, subprocess, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://pay.aistudytools.com"
SLUGS = {"ca-foundation-accounting": "CAFACC_VIDEOS", "ca-foundation-business-laws": "CAFLAW_VIDEOS",
         "ca-foundation-quantitative-aptitude": "CAQ_VIDEOS", "ca-foundation-business-economics": "CAFECO_VIDEOS"}
PAID_NOTE = "₹4,999 for all four papers · 1 year of access · Faculty access through the admin"


def bundle(out):
    with zipfile.ZipFile(out, "w", zipfile.ZIP_STORED) as z:
        for slug in SLUGS:
            d = os.path.join(ROOT, "courses", slug)
            z.write(os.path.join(d, "course.js"), f"private/content/{slug}.js")
            for f in sorted(os.listdir(os.path.join(d, "videos"))):
                if f.endswith(".mp4"):
                    z.write(os.path.join(d, "videos", f), f"private/videos/{slug}/{f}")
    print("wrote", out, round(os.path.getsize(out) / 1e6), "MB")


def apply():
    for slug, vg in SLUGS.items():
        p = os.path.join(ROOT, "courses", slug, "index.html")
        h = open(p, encoding="utf-8").read()
        if "gate.js" in h:
            print("already locked:", slug); continue
        h = h.replace('<script src="videos.js"></script>\n', "")
        h, n = re.subn(r'<script src="course\.js\?v=\d+"></script>',
                       f'<script src="/static/gate.js?v=1" data-api="{API}" data-course="{slug}" data-videos="{vg}" defer></script>', h)
        assert n == 1, slug
        h = h.replace("A free course by AIStudyTools · Your progress is saved in this browser.", "AIStudyTools · " + PAID_NOTE + ".")
        h = h.replace(" | Free | ", " | ")
        open(p, "w", encoding="utf-8").write(h)
        subprocess.run(["git", "rm", "-rq", f"courses/{slug}/course.js", f"courses/{slug}/videos.js", f"courses/{slug}/videos"], cwd=ROOT, check=True)
        print("locked:", slug)
    hub = os.path.join(ROOT, "courses", "ca-foundation", "index.html")
    h = open(hub, encoding="utf-8").read()
    h = h.replace("Free · New scheme · May 2027 onwards", "₹4,999 · 1 year · New scheme · May 2027 onwards")
    h = h.replace("Four free, self-paced courses", "Four self-paced courses")
    h = h.replace("CA Foundation courses · Free from AIStudyTools", "CA Foundation courses · AIStudyTools · " + PAID_NOTE)
    h = h.replace("CA Foundation Course | Free | AIStudyTools", "CA Foundation Course | AIStudyTools").replace('content="Free self-paced courses', 'content="Self-paced courses')
    h = h.replace("Your progress is saved in this browser.</p>", "Sign in with your e-mail to study; your progress is saved in your browser.</p>")
    open(hub, "w", encoding="utf-8").write(h)
    b = os.path.join(ROOT, "site-src", "build.py")
    s = open(b, encoding="utf-8").read().replace('"Free · 4 papers", "Open the course"', '"₹4,999 · 1 year", "See the course"')
    open(b, "w", encoding="utf-8").write(s)
    print("hub page and catalogue badge updated. Bump V in build.py, then commit and push.")


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "bundle": bundle(sys.argv[2])
    elif len(sys.argv) == 2 and sys.argv[1] == "apply": apply()
    else: print(__doc__)
