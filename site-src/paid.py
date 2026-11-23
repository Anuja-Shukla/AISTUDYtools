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
    p += f'<section id="tutor-box" data-course="{c["id"]}"></section>'
    return p + FOOT.replace("</body>", "<script>" + PAY_JS + '</script>\n<script src="/static/tutors.js?v=1" defer></script>\n</body>')

for _c in PAID_COURSES:
    write(f"/courses/{_c['id']}/", paid_page(_c))

LEGAL_UPDATED = "23 November 2026"
LEGAL = {
    "/terms/": ("Terms of Use", "Terms of use for AIStudyTools courses, tools and paid enrolments.", [
        ("Who we are", ["AIStudyTools (www.aistudytools.com) is operated by Intellique Research School Private Limited (“we”, “us”). Contact: intelliqueresearchschool@gmail.com, +91 73035 59258."]),
        ("Using the site", ["Courses and tools ask you to register once with your name and email. Please give true details: the name you register with is used on your certificates.", "You may use our tools and courses for personal learning and teaching. Do not misuse the site or try to break its security.", "Content you paste into browser-based tools (such as the AI evaluator) is processed in your browser. Do not paste personal or confidential data you are not allowed to share."]),
        ("Copyright and intellectual property", ["All tools, software code, course material, videos, designs and text on AIStudyTools are owned by Intellique Research School Private Limited and are protected under the Copyright Act, 1957, the Information Technology Act, 2000 and other laws of India. No tool or content may be copied, reproduced, cloned, republished or sold, in whole or in part, without our prior written permission.", "Full details of what is and is not allowed are in our Copyright and IP Policy at www.aistudytools.com/copyright/."]),
        ("Free and paid courses", ["Basics of Statistics, HR Analytics, Prompt Engineering, Building AI Agents, Product Management, Coding for Non-Coders and SEO to GEO are free. The CA Foundation Course (₹4,999), CSEET Course (₹2,999) and SSC CGL Course (₹1,999) are paid, with access for 1 year from the day you enrol; the first 2 lessons of each paper (2 topics of each subject for SSC CGL) are free to try.", "After payment you receive a personal access code. It is for one learner only and must not be shared or sold; shared codes may be cancelled without a refund.", "Prices are shown in Indian rupees (INR) on each course page and are charged once for the course named. Payments are processed by Razorpay; we do not see or store your card, UPI or bank details.", "A purchase gives one learner personal, non-transferable access to that course. Access is linked to the email address used at checkout. Please do not share your access.", "We may update lessons to keep them accurate. If a paid course is withdrawn, we will give enrolled learners continued access or a refund under our Refund policy."]),
        ("Certificates", ["Certificates are issued by AIStudyTools, a platform of Intellique Research School Private Limited, to learners who pass the course's final test. They record course completion and are not an accredited qualification."]),
        ("Liability", ["Course content is for education. We work to keep it accurate but do not guarantee specific results. To the extent the law allows, our total liability for a paid course is limited to the amount you paid for it."]),
        ("Changes and law", ["We may update these terms; the date below shows the latest version. These terms are governed by the laws of India."]),
    ]),
    "/copyright/": ("Copyright and IP Policy", "AIStudyTools tools, code and course content are protected by law. Copying, cloning or republishing them without written permission is prohibited.", [
        ("Summary", ["Every tool, course and page on AIStudyTools is protected by copyright and other laws of India. You may use them on this website for learning, teaching and research. You may not copy, clone, reproduce, republish or sell any of them, in whole or in part, without our prior written permission."]),
        ("Who owns the content", ["AIStudyTools (www.aistudytools.com) is a platform of Intellique Research School Private Limited. Unless stated otherwise, Intellique Research School Private Limited owns all rights in the following, and they are protected under the Copyright Act, 1957, the Information Technology Act, 2000, and international copyright treaties to which India is a party:", "• Tools and software: every interactive tool, calculator, generator, simulator, evaluator and builder on this site, including its source code (HTML, CSS and JavaScript), logic, prompts, structure, screens and design. Computer programmes are protected as literary works under the Copyright Act, 1957.", "• Course material: lesson notes, worked examples, questions, quizzes, final tests, glossaries, slides, teaching videos, animations, narration scripts and certificate designs.", "• Website content: text, graphics, page layouts, and the AIStudyTools name and logo."]),
        ("What you may do", ["• Use the tools and courses on this website for your own learning, teaching or research.", "• Share links to any page on this website.", "• Quote short extracts for teaching, review or criticism, with the credit “Source: AIStudyTools (www.aistudytools.com)”.", "• Keep and use what you create with our tools (for example, your own case study, reference list or quiz). The tool used to create it remains ours."]),
        ("What you must not do without written permission", ["• Copy, download, reproduce or republish any tool, page, source code, design or course material, in whole or in part.", "• Build, host, sell or distribute a tool, app, website or course that copies or closely imitates ours, including by rewriting our code or giving it to an AI to recreate.", "• Scrape or bulk-download the site, show our pages inside another website (framing), or reverse engineer our tools.", "• Upload our videos, notes, questions or tests to any other website, app, drive, group or course, whether free or paid.", "• Use our content or code to train or fine-tune AI models.", "• Remove or change any copyright notice, certificate ID or credit.", "• Use the AIStudyTools or Intellique Research School name or logo in a way that suggests we endorse you."]),
        ("Our public code repository", ["The code that runs this website is stored in a public repository so that the site can be published. Being able to see the code does not give you permission to use it. No open-source or other licence is granted: all rights are reserved."]),
        ("What happens if content is copied", ["Unauthorised copying is an infringement of copyright. We may take civil action for an injunction, damages and accounts of profits, and may file a criminal complaint under the Copyright Act, 1957 (including sections 51, 55, 63 and 63B). Copying or extracting data from our systems without permission may also lead to liability under the Information Technology Act, 2000 (including section 43). We will also ask hosting platforms, app stores and search engines to remove infringing copies."]),
        ("Permissions and reporting", ["To ask for permission (for example, to use a tool or course inside your institution, or to reuse material in a publication), or to report a copy of our work, email intelliqueresearchschool@gmail.com with the subject “Permission request” or “Copyright report”. Please include the page link and how you want to use it. Permission is valid only when given in writing."]),
        ("Third-party material", ["Names and study material of exam bodies (such as ICAI, ICSI and the Staff Selection Commission) belong to them; we only link to their official material and are not affiliated with or endorsed by them. Some tools use open-source libraries (such as pdf.js, mammoth and JSZip), which remain under their own licences; this policy does not restrict them."]),
        ("Contact", ["Intellique Research School Private Limited · intelliqueresearchschool@gmail.com · +91 73035 59258"]),
    ]),
    "/privacy/": ("Privacy Policy", "How AIStudyTools collects and uses personal data for courses, enrolments and enquiries.", [
        ("What we collect", ["Enquiry and demo forms: the name, email, phone and message you send.", "Registration: your name, email, optional mobile number and role, and the page you registered on. They are emailed to us so we can support you and send course updates, and remembered in your browser so you are not asked again.", "Enrolment requests and access codes: your registration details, the course you asked for, and when an access code is used.", "Paid enrolment: your name, email and (optionally) mobile number, the payment ID and order ID. Razorpay processes the payment itself under its own privacy policy; we never receive your card, UPI or bank details.", "Course progress and certificates are saved in your own browser (local storage) and are not sent to us.", "Instructor applications: the details you send in the form. If you are approved, we publish only the profile details you agreed to; your email, phone and fee stay private.", "Tutor requests: your name, email, optional phone and city, and your message. We share them only with the instructor you choose (or one we match you with), so they can reply.", "Website usage: we use Google Analytics, which sets cookies to count visits and show us which pages are used, from which country and on which kind of device. It does not tell us who you are. You can block these cookies in your browser or with Google's opt-out add-on."]),
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
