# CA Foundation lesson videos

Source for the animated teaching videos of the CA Foundation: Quantitative Aptitude course
(same style as the Basics of Statistics micro-lectures: illustrated lip-synced instructor, captions, teal tags).

- `base.html` — shared template (layout, instructor avatar, captions, helpers).
- `make_ca_video.py` — renderer: Kokoro voice (af_heart) + Playwright frames + ffmpeg → 1920×1080 MP4.
- `l11/` etc. — one folder per lesson: `lines.txt` (one narration line per scene; "caption || spoken text") and `scenes.js`.

Rendered locally, not by a GitHub Action: `python make_ca_video.py l11 out.mp4` (needs the Kokoro model files and the
Outfit font in `package/files/`). Finished videos go in `courses/ca-foundation-quantitative-aptitude/videos/` and are set in `videos.js`.
