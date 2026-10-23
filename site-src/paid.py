# Paid courses and policy pages. Run by build.py (exec), so it uses build.py's helpers.
# PAY_API (set in build.py) is the payment server URL, e.g. "https://aistudytools-pay.<you>.workers.dev".
# Prices are set in the payment server (worker.js), not here; PRICE_LABEL is only the text shown on the page.

PAY_CSS = """<style>
.pay-grid{display:grid;grid-template-columns:1.25fr 1fr;gap:22px;align-items:start}
@media(max-width:900px){.pay-grid{grid-template-columns:1fr}}
.pay-card{background:#fff;border:2px solid var(--border);border-radius:22px;padding:24px}
.pay-card.main{border-color:var(--accent);box-shadow:0 10px 30px rgba(79,70,229,.12)}
.pay-price{display:flex;flex-direction:column;gap:2px}
.pay-price b{font-size:40px;line-height:1.1;color:var(--ink)}
.pay-price span{color:var(--muted);font-size:15px}
.pay-msg{margin-top:10px;font-size:15px;color:var(--red-fg, #B91C1C);min-height:1px}
.pay-msg.ok{color:var(--mint-fg, #15803D)}
.pay-msg:empty{display:none}
.pay-list{margin:12px 0 0;padding-left:20px}
.pay-list li{margin:6px 0}
.legal h2{font-size:22px;margin:26px 0 8px}
.legal p,.legal li{font-size:16.5px;line-height:1.65}
.legal ul{padding-left:20px}
</style>"""
PAY_JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "pay.js"), encoding="utf-8").read()

PAID_COURSES = [
    {
        "id": "agentic-ai",
        "title": "Agentic AI",
        "price_label": "₹499",
        "lead": "Go beyond single agents: design multi-agent systems, connect tools and data with MCP, and evaluate, secure and deploy agentic workflows.",
        "for": "Professionals, faculty and students who know the basics of AI agents (or have finished our free Building AI Agents course) and want to build more capable, reliable agentic systems.",
        "modules": [
            ("Module 1: Agentic systems", ["Agent architectures and when to use multiple agents", "Planning, memory and reflection", "Connecting tools and data with MCP"]),
            ("Module 2: Building and running agents responsibly", ["Evaluating agents with test sets and metrics", "Guardrails, security and human oversight", "Deployment, monitoring and cost control"]),
        ],
    },
]

def paid_page(c):
    p = head(f"{c['title']} Course ({c['price_label']}) | AIStudyTools Courses", c["lead"], f"/courses/{c['id']}/") + header("courses")
    p = p.replace("</head>", PAY_CSS + "</head>")
    mods = "".join(f'<h3 style="margin-top:16px;font-size:19px">{html.escape(m)}</h3><ul class="pay-list">' + "".join(f"<li>{html.escape(x)}</li>" for x in xs) + "</ul>" for m, xs in c["modules"])
    p += f'''<section class="white" style="padding-top:40px">
  <div class="wrap">
    <p class="small muted"><a href="/courses/">Courses</a> › {html.escape(c["title"])}</p>
    <span class="tag indigo" style="margin-top:10px">Paid course · {c["price_label"]} · Certificate</span>
    <h1 style="margin-top:12px;font-size:clamp(34px,5vw,52px)">{html.escape(c["title"])}</h1>
    <p class="lead" style="max-width:760px;margin-top:10px">{html.escape(c["lead"])}</p>
    <div class="pay-grid" style="margin-top:26px">
      <div class="pay-card">
        <h2 style="font-size:24px">What you will learn</h2>
        {mods}
        <h2 style="font-size:24px;margin-top:22px">Who it is for</h2>
        <p class="muted" style="margin-top:8px">{html.escape(c["for"])}</p>
        <h2 style="font-size:24px;margin-top:22px">What you get</h2>
        {checks(["Self-paced lessons with teaching videos or animated walkthroughs", "Interactive tools, quick checks and module recaps", "A final test and a certificate from AIStudyTools", "Lifetime access on any device with your email and payment ID"])}
        <p class="small muted" style="margin-top:14px">New to agents? Start with our free <a href="/courses/building-ai-agents/">Building AI Agents</a> course.</p>
      </div>
      <div>
        <div class="pay-card main" id="pay_box" data-api="{html.escape(PAY_API)}" data-course="{c["id"]}" aria-live="polite"><p class="muted">Loading enrolment…</p></div>
        <div class="pay-card" style="margin-top:18px">
          <h3 style="font-size:19px">Already paid? Restore access</h3>
          <p class="small muted" style="margin-top:6px">On a new device or browser, enter the email you paid with and your payment ID (it starts with pay_ and is in your Razorpay receipt).</p>
          <div class="field" style="margin-top:12px"><label for="rs_email">Email</label><input id="rs_email" type="email" autocomplete="email"></div>
          <div class="field" style="margin-top:10px"><label for="rs_pid">Payment ID</label><input id="rs_pid" placeholder="pay_XXXXXXXXXXXXXX" autocomplete="off"></div>
          <button class="btn btn-soft btn-sm" type="button" id="rs_go" style="margin-top:12px">Restore access</button>
          <p id="rs_msg" class="pay-msg" role="status"></p>
        </div>
        <p class="small muted" style="margin-top:14px">Questions about payment? Email <a href="mailto:intelliqueresearchschool@gmail.com">intelliqueresearchschool@gmail.com</a> or WhatsApp +91 73035 59258. See our <a href="/refund-policy/">Refund policy</a>.</p>
      </div>
    </div>
  </div>
</section>
'''
    return p + FOOT.replace("</body>", "<script>" + PAY_JS + "</script>\n</body>")

for _c in PAID_COURSES:
    write(f"/courses/{_c['id']}/", paid_page(_c))

LEGAL_UPDATED = "18 October 2026"
LEGAL = {
    "/terms/": ("Terms of Use", "Terms of use for AIStudyTools courses, tools and paid enrolments.", [
        ("Who we are", ["AIStudyTools (www.aistudytools.com) is operated by Intellique Research School Private Limited (“we”, “us”). Contact: intelliqueresearchschool@gmail.com, +91 73035 59258."]),
        ("Using the site", ["You may use our free tools and courses for personal learning and teaching. Do not misuse the site, try to break its security, or copy and resell our course material.", "Content you paste into browser-based tools (such as the AI evaluator) is processed in your browser. Do not paste personal or confidential data you are not allowed to share."]),
        ("Paid courses", ["Prices are shown in Indian rupees (INR) on each course page and are charged once for the course named. Payments are processed by Razorpay; we do not see or store your card, UPI or bank details.", "A purchase gives one learner personal, non-transferable access to that course. Access is linked to the email address used at checkout. Please do not share your access.", "We may update lessons to keep them accurate. If a paid course is withdrawn, we will give enrolled learners continued access or a refund under our Refund policy."]),
        ("Certificates", ["Certificates are issued by AIStudyTools, a platform of Intellique Research School Private Limited, to learners who pass the course's final test. They record course completion and are not an accredited qualification."]),
        ("Liability", ["Course content is for education. We work to keep it accurate but do not guarantee specific results. To the extent the law allows, our total liability for a paid course is limited to the amount you paid for it."]),
        ("Changes and law", ["We may update these terms; the date below shows the latest version. These terms are governed by the laws of India."]),
    ]),
    "/privacy/": ("Privacy Policy", "How AIStudyTools collects and uses personal data for courses, enrolments and enquiries.", [
        ("What we collect", ["Enquiry and demo forms: the name, email, phone and message you send.", "Paid enrolment: your name, email and (optionally) mobile number, the payment ID and order ID. Razorpay processes the payment itself under its own privacy policy; we never receive your card, UPI or bank details.", "Course progress and certificates are saved in your own browser (local storage) and are not sent to us.", "Website usage: we use Google Analytics, which sets cookies to count visits and show us which pages are used, from which country and on which kind of device. It does not tell us who you are. You can block these cookies in your browser or with Google's opt-out add-on."]),
        ("How we use it", ["To reply to enquiries, give you access to courses you buy, restore access when you ask, issue receipts and handle refunds or support.", "We do not sell your personal data. We do not send marketing emails unless you ask for updates."]),
        ("Where it is stored", ["Enrolment records are stored with our payment service provider and our hosting provider (MilesWeb, India), and kept for as long as you have access to a course and as required by tax and accounting law."]),
        ("Your choices", ["You can ask us to see, correct or delete your personal data by emailing intelliqueresearchschool@gmail.com. Deleting enrolment data may end your access to a paid course."]),
        ("Contact", ["Intellique Research School Private Limited · intelliqueresearchschool@gmail.com · +91 73035 59258"]),
    ]),
    "/refund-policy/": ("Refund and Cancellation Policy", "Refund and cancellation policy for paid AIStudyTools courses.", [
        ("Refunds", ["If you are not satisfied with a paid course, email intelliqueresearchschool@gmail.com within 7 days of purchase with your payment ID, and we will give you a full refund, provided you have not yet received the course certificate.", "Approved refunds are made to the original payment method through Razorpay, usually within 5–7 working days. Your access to the course ends when the refund is issued."]),
        ("Duplicate or failed payments", ["If you were charged twice, or money was deducted but you did not get access, contact us with the payment ID and we will either give you access or refund the extra amount in full."]),
        ("Cancellation", ["Courses are digital and delivered immediately, so there is nothing to cancel after purchase; use the refund option above. If we cancel or withdraw a course you paid for before you can access it, we refund you in full."]),
        ("Delivery", ["Paid courses are delivered online on this website. Access starts right after a successful payment (or on the launch date shown on the course page). Nothing is shipped."]),
        ("Contact", ["Intellique Research School Private Limited · intelliqueresearchschool@gmail.com · +91 73035 59258"]),
    ]),
}
for _path, (_t, _d, _secs) in LEGAL.items():
    _p = head(f"{_t} | AIStudyTools", _d, _path) + header("")
    _p = _p.replace("</head>", PAY_CSS + "</head>")
    _body = "".join(f"<h2>{html.escape(h)}</h2>" + "".join(f"<p>{html.escape(x)}</p>" for x in xs) for h, xs in _secs)
    _p += f'<section class="white" style="padding-top:40px"><div class="wrap legal" style="max-width:820px"><h1 style="font-size:clamp(32px,4.5vw,46px)">{_t}</h1><p class="small muted" style="margin-top:6px">Last updated: {LEGAL_UPDATED}</p>{_body}</div></section>\n'
    write(_path, _p + FOOT)
