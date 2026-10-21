# Faculty Innovation Award. Run by build.py (exec), so it uses build.py's helpers.
# To publish an entry, add it to site-src/award-entries.json (see the note at the top of that file's README in the project docs).
import json as _json, re as _re

_HERE = os.path.dirname(os.path.abspath(__file__))
AWARD_ENTRIES = [e for e in _json.load(open(os.path.join(_HERE, "award-entries.json"), encoding="utf-8")) if e.get("published")]
AWARD_ENTRIES.sort(key=lambda e: (e.get("published", ""), e.get("id", "")), reverse=True)
AWARD_JS = open(os.path.join(_HERE, "award.js"), encoding="utf-8").read()

# Founder signature for certificates: reused from a course file already in the repo.
_SIG = ""
for _f in ["courses/coding-for-non-coders/course.js", "courses/building-ai-agents/course.js"]:
    try:
        _m = _re.search(r"var SIG_SVG = '(<svg.*?</svg>)';", open(os.path.join(_HERE, "..", _f), encoding="utf-8").read(), _re.S)
        if _m:
            _SIG = _m.group(1); break
    except OSError:
        pass

AWARD_TOOLS = ["Simulation Creator", "Quick Case Generator", "Interactive Game Creator", "AI Presentation Creator", "AI Evaluator", "LearnX (video, mind map or game)", "Other AIStudyTools tool"]

AWARD_CSS = """<style>
.aw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
.aw-card{background:#fff;border:2px solid var(--border);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:8px}
.aw-card.win{border-color:#F59E0B;box-shadow:0 8px 24px rgba(245,158,11,.18)}
.aw-card h3{font-size:19px;line-height:1.3}
.aw-meta{font-size:14.5px;color:var(--muted)}
.aw-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:8px}
.aw-form{background:#fff;border:2px solid var(--border);border-radius:22px;padding:24px;max-width:860px}
.aw-form .two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:700px){.aw-form .two{grid-template-columns:1fr}}
.aw-form .field{margin-top:12px}
.aw-check{display:flex;gap:10px;align-items:flex-start;margin-top:10px;font-size:15px}
.aw-check input{margin-top:4px;flex:none}
.aw-status{margin-top:12px;font-size:15.5px}
.aw-status.err{color:#B91C1C}.aw-status.ok{color:#15803D;font-weight:700}
.aw-cert{background:#FAFAFF;border:6px double #4F46E5;border-radius:6px;padding:34px 30px;text-align:center;max-width:900px;margin:0 auto}
.aw-cert .nm{font-size:clamp(26px,4vw,36px);font-weight:800;color:#3730A3;border-bottom:1px solid #C9CCF7;display:inline-block;padding:0 24px 6px;margin-top:8px}
.aw-cert h2{font-size:clamp(24px,3.6vw,34px)}
.aw-cert .ttl{font-size:clamp(19px,2.6vw,24px);font-weight:800;color:#3730A3;margin-top:6px}
.aw-cert .foot{display:flex;justify-content:space-between;gap:16px;margin-top:26px;text-align:left;flex-wrap:wrap}
@media print{.hdr,.ftr,.noprint,.wa-float,[class*=whatsapp]{display:none!important}.aw-cert{border-width:6px}}
</style>"""

def _aw_card(e):
    win = e.get("award")
    cert = f'/faculty-award/certificate/#{e["id"]}'
    return (f'<div class="aw-card{" win" if win else ""}">'
            + (f'<span class="tag" style="align-self:flex-start;background:#FEF3C7;color:#92400E">🏆 {html.escape(win)}</span>' if win else "")
            + f'<span class="tag indigo" style="align-self:flex-start;font-size:13px">{html.escape(e.get("tool", ""))}</span>'
            + f'<h3>{html.escape(e["title"])}</h3>'
            + f'<div class="aw-meta"><b>{html.escape(e["name"])}</b>{", " + html.escape(e["designation"]) if e.get("designation") else ""}<br>{html.escape(e.get("institution", ""))}{" · " + html.escape(e["subject"]) if e.get("subject") else ""}</div>'
            + f'<p style="font-size:15.5px">{html.escape(e.get("summary", ""))}</p>'
            + '<div class="aw-actions">'
            + (f'<a class="btn btn-accent btn-sm" href="{html.escape(e["link"])}" target="_blank" rel="noopener nofollow">Open the entry</a>' if e.get("link") else "")
            + f'<a class="btn btn-soft btn-sm" href="{cert}">Certificate</a></div></div>')

aw = head("Faculty Innovation Award: Share How You Teach with AI | AIStudyTools",
          "Faculty: create a simulation, case, game or rubric with AIStudyTools, submit it, and get it published with a certificate. Innovation of the Month is featured in our webinar.",
          "/faculty-award/") + header("tools")
aw = aw.replace("</head>", AWARD_CSS + "</head>")
aw += hero("Faculty Innovation Award · free to enter", 'Teach with AI. <span class="hl">Get published.</span>',
           "Create a simulation, case, quiz game, presentation or rubric with AIStudyTools and use it in your class. Submit it, and once our team approves it we publish it here with your name, and you get a certificate of publication. Every month, one entry wins Innovation of the Month and is featured in our webinar.",
           [("Submit your entry", "#submit", "btn-ink"), ("See published entries", "#gallery", "btn-soft")],
           mindmap("Your idea", ["Create", "Use in class", "Submit", "Published", "Certificate"], "Create with AIStudyTools, use it in class, submit it, get published and certified"))
aw += f'''<section class="white">
  <div class="wrap">
    {sec_head("How it works", "", "Four steps")}
    <ol class="steps rv" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      <li><div><b>Create</b><span>Build something with any <a href="/tools/">Faculty Corner</a> tool or LearnX: a simulation, quick case, quiz game, presentation or rubric.</span></div></li>
      <li><div><b>Use it</b><span>Try it with your students, or plan exactly how you will. Tell us what they learned.</span></div></li>
      <li><div><b>Submit</b><span>Fill in the form below with a link to your entry. It is free, and there is no limit on entries.</span></div></li>
      <li><div><b>Get published</b><span>We review entries within 7 working days. Approved entries appear in the gallery with a certificate of publication.</span></div></li>
    </ol>
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("Innovation of the Month", "Each month we choose one published entry as Innovation of the Month.", "Monthly award")}
    {cards([("crown", "Award certificate", "The winner receives an Innovation of the Month certificate in addition to the certificate of publication."),
            ("mic", "Webinar feature", "The winner presents their simulation or case in an AIStudyTools webinar, to faculty from many institutions."),
            ("target", "How we judge", "Learning value for students (40%), originality (25%), good use of AI (20%) and how easily other faculty can reuse it (15%).")], "g3")}
  </div>
</section>
<section class="white" id="gallery" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Published entries", "Simulations, cases and games created by faculty with AIStudyTools. Open any entry to use it in your own class.", "Gallery")}
    {('<div class="aw-grid">' + "".join(_aw_card(e) for e in AWARD_ENTRIES) + "</div>") if AWARD_ENTRIES else '<div class="card" style="text-align:center"><h3>The first entries will appear here soon</h3><p class="muted" style="margin-top:6px">Be one of the first faculty members to be published.</p><a class="btn btn-accent" href="#submit" style="margin-top:12px;align-self:center">Submit your entry</a></div>'}
  </div>
</section>
<section id="submit" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Submit your entry", "All fields marked * are required. Remove student names and personal data from anything you share.", "Free to enter")}
    <form class="aw-form form" id="aw_form" novalidate>
      <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
      <div class="two">
        <div class="field"><label for="aw_name">Full name * (as on the certificate)</label><input id="aw_name" name="name" maxlength="80" autocomplete="name" required></div>
        <div class="field"><label for="aw_desig">Designation *</label><input id="aw_desig" name="designation" maxlength="80" placeholder="e.g. Assistant Professor, Marketing" required></div>
      </div>
      <div class="two">
        <div class="field"><label for="aw_inst">Institution *</label><input id="aw_inst" name="institution" maxlength="120" autocomplete="organization" required></div>
        <div class="field"><label for="aw_subject">Subject or course *</label><input id="aw_subject" name="subject" maxlength="100" placeholder="e.g. Product Management (MBA)" required></div>
      </div>
      <div class="two">
        <div class="field"><label for="aw_email">Email *</label><input id="aw_email" name="email" type="email" maxlength="254" autocomplete="email" required></div>
        <div class="field"><label for="aw_phone">Mobile / WhatsApp</label><input id="aw_phone" name="phone" type="tel" maxlength="20" autocomplete="tel"></div>
      </div>
      <div class="two">
        <div class="field"><label for="aw_tool">AIStudyTools tool used *</label><select id="aw_tool" name="tool" required><option value="">Choose a tool</option>{"".join(f"<option>{html.escape(t)}</option>" for t in AWARD_TOOLS)}</select></div>
        <div class="field"><label for="aw_title">Title of your entry *</label><input id="aw_title" name="title" maxlength="120" placeholder="e.g. Pricing a new EV: a boardroom simulation" required></div>
      </div>
      <div class="field"><label for="aw_link">Link to your entry *</label><input id="aw_link" name="link" type="url" maxlength="500" placeholder="https://… (game link, or a Google Drive / Docs link set to “Anyone with the link can view”)" required></div>
      <div class="field"><label for="aw_summary">Short description for the gallery * (40–80 words)</label><textarea id="aw_summary" name="summary" maxlength="700" style="min-height:100px" placeholder="What students do, and what they learn." required></textarea></div>
      <div class="field"><label for="aw_use">How you used it in class, and what happened</label><textarea id="aw_use" name="classroom_use" maxlength="1500" style="min-height:100px" placeholder="Class, number of students, how long it took, student response, what you would change."></textarea></div>
      <label class="aw-check"><input type="checkbox" id="aw_c1"> <span>This is my own work, created with AIStudyTools, and it contains no student names or personal data. *</span></label>
      <label class="aw-check"><input type="checkbox" id="aw_c2"> <span>I agree that AIStudyTools may publish my entry with my name, designation and institution, and feature it in webinars and on social media. *</span></label>
      <button class="btn btn-ink" type="submit" style="margin-top:16px">Submit my entry</button>
      <p class="aw-status" id="aw_status" role="status"></p>
    </form>
  </div>
</section>
'''
aw += cta("New to the tools?", "Start with the Simulation Creator or the Quick Case Generator. Both are free and take a few minutes.", "Open Faculty Corner", "/tools/")
aw = aw + FOOT.replace("</body>", "<script>" + AWARD_JS + "</script>\n</body>")
write("/faculty-award/", aw)

# ---- certificate + verification page ----
_pub = [{k: e.get(k, "") for k in ("id", "name", "designation", "institution", "subject", "tool", "title", "published", "award", "award_date")} for e in AWARD_ENTRIES]
ac = head("Faculty Innovation Award Certificate | AIStudyTools", "Verify and download a Faculty Innovation Award certificate issued by AIStudyTools.", "/faculty-award/certificate/") + header("tools")
ac = ac.replace("</head>", AWARD_CSS + '<meta name="robots" content="noindex">\n</head>')
_pubjson = _json.dumps(_pub, ensure_ascii=False).replace("</", "<\\/")
ac += f'''<section class="white" style="padding-top:36px">
  <div class="wrap">
    <p class="small muted noprint"><a href="/faculty-award/">Faculty Innovation Award</a> › Certificate</p>
    <div id="aw_certapp" style="margin-top:14px"><p class="muted">Loading certificate…</p></div>
  </div>
</section>
<script type="application/json" id="aw_data">{_pubjson}</script>
<template id="aw_sig">{_SIG}</template>
'''
ac = ac + FOOT.replace("</body>", '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" defer></script>\n<script>' + AWARD_JS + "</script>\n</body>")
write("/faculty-award/certificate/", ac)
