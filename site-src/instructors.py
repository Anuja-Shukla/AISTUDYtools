# Instructors: directory, application form and tutor requests. Run by build.py (exec), so it uses build.py's helpers.
# To publish an approved instructor, add an object to site-src/instructors.json (format in the project doc "instructors-status.md").
import json as _json

_HERE = os.path.dirname(os.path.abspath(__file__))
INS_JS = open(os.path.join(_HERE, "instructors.js"), encoding="utf-8").read()
INSTRUCTORS = [e for e in _json.load(open(os.path.join(_HERE, "instructors.json"), encoding="utf-8")) if e.get("approved")]
INSTRUCTORS.sort(key=lambda e: (e.get("approved", ""), e.get("id", "")))

# Courses on the platform: (slug, title). Built from the home-page course list plus paid courses.
INS_COURSES = [(h.strip("/").split("/")[-1], t) for (_ic, t, _d, h) in COURSES] + [(c["id"], c["title"]) for c in PAID_COURSES]
INS_TITLE = dict(INS_COURSES)
INS_MODES = ["Online", "In person", "Online and in person"]

INS_CSS = """<style>
.in-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:18px}
.in-card{background:#fff;border:2px solid var(--border);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:10px}
.in-top{display:flex;gap:14px;align-items:center}
.in-av{width:64px;height:64px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;font-size:22px;color:#fff;background:linear-gradient(135deg,#4F46E5,#14B8A6);overflow:hidden}
.in-av img{width:100%;height:100%;object-fit:cover}
.in-card h3{font-size:19px;line-height:1.25}
.in-meta{font-size:14.5px;color:var(--muted)}
.in-chips{display:flex;flex-wrap:wrap;gap:6px}
.in-chips a,.in-chips span{font-size:13px;font-weight:700;padding:4px 10px;border-radius:999px;background:var(--soft,#EEF0FF);color:var(--accent-dk,#3730A3);text-decoration:none}
.in-filters{display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px;margin-bottom:18px}
@media(max-width:760px){.in-filters{grid-template-columns:1fr}}
.in-filters input,.in-filters select{font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff;width:100%}
.in-form{background:#fff;border:2px solid var(--border);border-radius:22px;padding:24px;max-width:880px}
.in-form .two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:700px){.in-form .two{grid-template-columns:1fr}}
.in-form .field{margin-top:12px}
.in-courses{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px;margin-top:8px}
.in-courses label,.in-check{display:flex;gap:10px;align-items:flex-start;font-size:15px;font-weight:500}
.in-courses label{border:2px solid var(--border);border-radius:12px;padding:9px 12px;cursor:pointer}
.in-courses input,.in-check input{margin-top:4px;flex:none;width:auto;min-width:0}
.in-check{margin-top:10px}
.in-status{margin-top:12px;font-size:15.5px}
.in-status.err{color:#B91C1C}.in-status.ok{color:#15803D;font-weight:700}
.in-empty{text-align:center}
</style>"""

def _initials(n):
    p = [w for w in n.replace(".", " ").split() if w and w.lower() not in ("dr", "prof", "mr", "ms", "mrs")]
    return ((p[0][0] if p else "?") + (p[-1][0] if len(p) > 1 else "")).upper()

def _ins_card(e):
    courses = "".join(f'<a href="/courses/{html.escape(c)}/">{html.escape(INS_TITLE.get(c, c))}</a>' for c in e.get("courses", []) if c in INS_TITLE)
    other = f'<span>{html.escape(e["other_subjects"])}</span>' if e.get("other_subjects") else ""
    photo = f'<img src="{html.escape(e["photo"])}" alt="" loading="lazy">' if e.get("photo") else html.escape(_initials(e["name"]))
    filt = " ".join(e.get("courses", []))
    langs = ", ".join(e.get("languages", []))
    return (f'<div class="in-card" data-courses="{html.escape(filt)}" data-mode="{html.escape(e.get("mode", ""))}" data-text="{html.escape((e["name"] + " " + e.get("title", "") + " " + e.get("institution", "") + " " + e.get("city", "") + " " + langs + " " + e.get("other_subjects", "") + " " + e.get("bio", "")).lower())}">'
            f'<div class="in-top"><div class="in-av">{photo}</div><div><h3>{html.escape(e["name"])}</h3><div class="in-meta">{html.escape(", ".join(x for x in [e.get("title", ""), e.get("institution", "")] if x))}</div></div></div>'
            f'<div class="in-meta">📍 {html.escape(e.get("city", ""))} · {html.escape(e.get("mode", ""))}{" · 🗣 " + html.escape(langs) if langs else ""}{" · " + html.escape(e["experience"]) + " teaching" if e.get("experience") else ""}</div>'
            + (f'<div class="in-meta">🎓 {html.escape(e["qualifications"])}</div>' if e.get("qualifications") else "")
            + f'<p style="font-size:15.5px">{html.escape(e.get("bio", ""))}</p>'
            f'<div class="in-chips">{courses}{other}</div>'
            f'<div class="row" style="margin-top:auto;padding-top:6px;gap:8px;flex-wrap:wrap"><a class="btn btn-accent btn-sm" href="#request" data-tutor="{html.escape(e["id"])}" data-tutor-name="{html.escape(e["name"])}">Request this tutor</a>'
            + (f'<a class="btn btn-soft btn-sm" href="{html.escape(e["linkedin"])}" target="_blank" rel="noopener nofollow">Profile</a>' if e.get("linkedin") else "")
            + "</div></div>")

_course_opts = "".join(f'<option value="{html.escape(s)}">{html.escape(t)}</option>' for s, t in INS_COURSES)

# ---------------- /instructors/ ----------------
ins = head("Find an Instructor or Tutor | AIStudyTools",
           "Find a qualified tutor for AIStudyTools courses such as Statistics, CA Foundation, HR Analytics and AI. Request a tutor online or in person; we introduce you.",
           "/instructors/") + header("instructors")
ins = ins.replace("</head>", INS_CSS + "</head>")
ins += hero("Instructors · tutors for every course", 'Learn faster with <span class="hl">a tutor</span> by your side.',
            "Our courses are self-paced, but sometimes you want a person to explain, guide and keep you on track. Find an approved instructor for your course, online or in person, and request them. We will introduce you.",
            [("Find a tutor", "#directory", "btn-ink"), ("Teach with us", "/instructors/join/", "btn-soft")],
            mindmap("You", ["Course", "Find a tutor", "Request", "Introduction", "Learn"], "Choose a course, find a tutor, request them, get introduced and learn"))
_dir = ('<div class="in-grid" id="in_grid">' + "".join(_ins_card(e) for e in INSTRUCTORS) + '</div><p class="muted" id="in_none" style="display:none;margin-top:10px">No instructors match these filters yet. Clear a filter, or <a href="#request">ask us to match you</a>.</p>') if INSTRUCTORS else \
    '<div class="card in-empty"><h3>Our first instructors are joining now</h3><p class="muted" style="margin-top:6px">You can already request a tutor below: tell us your course and we will match you as soon as a suitable instructor is approved.</p><div class="row" style="justify-content:center;margin-top:14px;gap:10px;flex-wrap:wrap"><a class="btn btn-accent" href="#request">Request a tutor</a><a class="btn btn-soft" href="/instructors/join/">Join as an instructor</a></div></div>'
ins += f'''<section class="white" id="directory" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Find an instructor", "Every instructor is reviewed by our team before they appear here. Contact details stay private: send a request and we introduce you.", f"{len(INSTRUCTORS)} approved" if INSTRUCTORS else "Directory")}
    {('<div class="in-filters"><input id="in_q" type="search" placeholder="Search by name, city, language or subject" aria-label="Search instructors"><select id="in_course" aria-label="Filter by course"><option value="">All courses</option>' + _course_opts + '</select><select id="in_mode" aria-label="Filter by mode"><option value="">Online or in person</option><option value="Online">Online</option><option value="In person">In person</option></select></div>') if INSTRUCTORS else ""}
    {_dir}
  </div>
</section>
<section id="request" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Request a tutor", "Tell us what you need. We share your request only with the instructor you choose (or a suitable one) and reply within 2 working days.", "Free to request")}
    <form class="in-form form" id="rq_form" novalidate>
      <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
      <input type="hidden" id="rq_tutor_id" value="">
      <div class="field"><label for="rq_tutor">Instructor</label><input id="rq_tutor" value="Any suitable instructor (please match me)" readonly style="background:#F6F6FA"></div>
      <div class="two">
        <div class="field"><label for="rq_name">Your name *</label><input id="rq_name" maxlength="80" autocomplete="name"></div>
        <div class="field"><label for="rq_email">Email *</label><input id="rq_email" type="email" maxlength="254" autocomplete="email"></div>
      </div>
      <div class="two">
        <div class="field"><label for="rq_phone">Mobile / WhatsApp</label><input id="rq_phone" type="tel" maxlength="20" autocomplete="tel"></div>
        <div class="field"><label for="rq_course">Course *</label><select id="rq_course"><option value="">Choose a course</option>{_course_opts}<option value="other">Another subject</option></select></div>
      </div>
      <div class="two">
        <div class="field"><label for="rq_mode">Preferred mode</label><select id="rq_mode"><option>Online</option><option>In person</option><option>Either</option></select></div>
        <div class="field"><label for="rq_city">City (for in-person tutoring)</label><input id="rq_city" maxlength="60" autocomplete="address-level2"></div>
      </div>
      <div class="field"><label for="rq_msg">What would you like help with? *</label><textarea id="rq_msg" maxlength="1500" style="min-height:110px" placeholder="e.g. I am preparing for CA Foundation (May attempt) and need help with Statistics, 2 sessions a week, evenings."></textarea></div>
      <label class="in-check"><input type="checkbox" id="rq_c1"> <span>I agree that AIStudyTools may share my request and contact details with the instructor, so they can reply to me. *</span></label>
      <button class="btn btn-ink" type="submit" style="margin-top:16px">Send my request</button>
      <p class="in-status" id="rq_status" role="status"></p>
    </form>
  </div>
</section>
<section class="white">
  <div class="wrap">
    {sec_head("How it works", "", "For learners")}
    <ol class="steps rv" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      <li><div><b>Pick a course</b><span>Start any course on AIStudyTools, free or paid, at your own pace.</span></div></li>
      <li><div><b>Choose a tutor</b><span>Filter instructors by course, mode and city, or ask us to match you.</span></div></li>
      <li><div><b>Send a request</b><span>Tell us what you need. It is free to request.</span></div></li>
      <li><div><b>Get introduced</b><span>We introduce you to the instructor, and you agree the schedule and fee directly with them.</span></div></li>
    </ol>
  </div>
</section>
'''
ins += cta("Are you a teacher?", "Teach the courses on AIStudyTools, or propose a new one. Listing is free, and every profile is reviewed before it goes live.", "Join as an instructor", "/instructors/join/")
ins = ins + FOOT.replace("</body>", "<script>" + INS_JS + "</script>\n</body>")
write("/instructors/", ins)

# ---------------- /instructors/join/ ----------------
_course_checks = "".join(f'<label><input type="checkbox" name="courses" value="{html.escape(s)}"> <span>{html.escape(t)}</span></label>' for s, t in INS_COURSES)
jn = head("Become an Instructor | Teach with AIStudyTools",
          "Teachers and subject experts: list yourself as an instructor for AIStudyTools courses or propose a new course. Free listing, reviewed profiles, learners introduced to you.",
          "/instructors/join/") + header("instructors")
jn = jn.replace("</head>", INS_CSS + "</head>")
jn += hero("Instructors · free listing", 'Teach what you know. <span class="hl">We bring the learners.</span>',
           "Thousands of learners study on AIStudyTools at their own pace. Many want a tutor to guide them. List yourself for the courses you can teach, or propose a new course. Our team reviews every profile; once approved, you appear on the Instructors page and on each course you teach.",
           [("Apply now", "#apply", "btn-ink"), ("See the Instructors page", "/instructors/", "btn-soft")],
           mindmap("You", ["Apply", "Review", "Go live", "Requests", "Teach"], "Apply, get reviewed, go live, receive learner requests and teach"))
jn += f'''<section class="white">
  <div class="wrap">
    {sec_head("Why teach with us", "", "For instructors")}
    {cards([("users", "Learners come to you", "Your profile appears on the Instructors page and on the course pages you choose, where learners are already studying."),
            ("lock", "Your details stay private", "Learners never see your phone or email. Requests come through us, and we introduce you."),
            ("spark", "Free to list", "There is no fee to apply or be listed. You agree your schedule and fee directly with each learner."),
            ("cap", "Propose new courses", "Teach something we don't offer yet? Tell us. Popular requests become new AIStudyTools courses.")], "g4")}
  </div>
</section>
<section id="apply" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Apply as an instructor", "Fields marked * are required. We review applications within 7 working days and email you the result.", "Free")}
    <form class="in-form form" id="jn_form" novalidate>
      <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
      <div class="two">
        <div class="field"><label for="jn_name">Full name *</label><input id="jn_name" maxlength="80" autocomplete="name"></div>
        <div class="field"><label for="jn_title">Designation *</label><input id="jn_title" maxlength="90" placeholder="e.g. Assistant Professor, Statistics / Chartered Accountant"></div>
      </div>
      <div class="two">
        <div class="field"><label for="jn_inst">Institution or organisation</label><input id="jn_inst" maxlength="120" autocomplete="organization"></div>
        <div class="field"><label for="jn_city">City *</label><input id="jn_city" maxlength="60" autocomplete="address-level2"></div>
      </div>
      <div class="two">
        <div class="field"><label for="jn_email">Email * (private)</label><input id="jn_email" type="email" maxlength="254" autocomplete="email"></div>
        <div class="field"><label for="jn_phone">Mobile / WhatsApp * (private)</label><input id="jn_phone" type="tel" maxlength="20" autocomplete="tel"></div>
      </div>
      <div class="two">
        <div class="field"><label for="jn_mode">How you teach *</label><select id="jn_mode"><option value="">Choose</option>{"".join(f"<option>{m}</option>" for m in INS_MODES)}</select></div>
        <div class="field"><label for="jn_lang">Languages you teach in *</label><input id="jn_lang" maxlength="80" placeholder="e.g. English, Hindi"></div>
      </div>
      <div class="two">
        <div class="field"><label for="jn_exp">Teaching experience *</label><input id="jn_exp" maxlength="40" placeholder="e.g. 8 years"></div>
        <div class="field"><label for="jn_qual">Highest qualification *</label><input id="jn_qual" maxlength="120" placeholder="e.g. PhD (Statistics), CA, MBA"></div>
      </div>
      <div class="field"><label>Courses on AIStudyTools you can teach</label><div class="in-courses">{_course_checks}</div></div>
      <div class="field"><label for="jn_new">A new course or subject you'd like to teach</label><input id="jn_new" maxlength="160" placeholder="e.g. CA Foundation Accounting, Python for Data Analysis, Research Methods"></div>
      <div class="field"><label for="jn_bio">Short profile for learners * (40–80 words)</label><textarea id="jn_bio" maxlength="700" style="min-height:110px" placeholder="Who you teach, how you teach, and what learners gain."></textarea></div>
      <div class="two">
        <div class="field"><label for="jn_link">LinkedIn or profile link</label><input id="jn_link" type="url" maxlength="300" placeholder="https://"></div>
        <div class="field"><label for="jn_photo">Photo link (optional)</label><input id="jn_photo" type="url" maxlength="300" placeholder="https:// (a public image link)"></div>
      </div>
      <div class="two">
        <div class="field"><label for="jn_avail">Availability</label><input id="jn_avail" maxlength="100" placeholder="e.g. Weekday evenings, weekends"></div>
        <div class="field"><label for="jn_fee">Indicative fee per hour (private, for our records)</label><input id="jn_fee" maxlength="40" placeholder="e.g. ₹800"></div>
      </div>
      <label class="in-check"><input type="checkbox" id="jn_c1"> <span>The information I have given is accurate, and I am qualified to teach the courses I selected. *</span></label>
      <label class="in-check"><input type="checkbox" id="jn_c2"> <span>If approved, AIStudyTools may publish my name, designation, institution, city, mode, languages, experience, qualification, courses, profile, photo and profile link. My email and phone stay private, and learner requests come through AIStudyTools. *</span></label>
      <button class="btn btn-ink" type="submit" style="margin-top:16px">Submit my application</button>
      <p class="in-status" id="jn_status" role="status"></p>
    </form>
  </div>
</section>
'''
jn += cta("Want to see the courses first?", "Browse the free courses that learners are taking right now.", "See all courses", "/courses/")
jn = jn + FOOT.replace("</body>", "<script>" + INS_JS + "</script>\n</body>")
write("/instructors/join/", jn)

# ---------------- public data for the course-page tutor boxes ----------------
_pub = [{k: e.get(k, "") for k in ("id", "name", "title", "institution", "city", "mode", "languages", "experience", "courses", "photo", "bio")} for e in INSTRUCTORS]
os.makedirs(os.path.join(OUT, "instructors"), exist_ok=True)
open(os.path.join(OUT, "instructors", "instructors.json"), "w", encoding="utf-8").write(_json.dumps({"courses": dict(INS_COURSES), "instructors": _pub}, ensure_ascii=False))
os.makedirs(os.path.join(OUT, "static"), exist_ok=True)
open(os.path.join(OUT, "static", "tutors.js"), "w", encoding="utf-8").write(open(os.path.join(_HERE, "tutors.js"), encoding="utf-8").read())
