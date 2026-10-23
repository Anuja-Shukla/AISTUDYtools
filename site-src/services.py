# Services page + use cases moved into Faculty Corner and Student Corner. Run by build.py (exec) after the use-cases block.

SVC_CSS = """<style>
.svc{display:grid;grid-template-columns:1fr 1.15fr;gap:40px;align-items:center}
.svc.rev{grid-template-columns:1.15fr 1fr}
.svc.rev .svc-media{order:-1}
@media(max-width:900px){.svc,.svc.rev{grid-template-columns:1fr}.svc.rev .svc-media{order:0}}
.svc-media{background:#fff;border:2px solid var(--border);border-radius:24px;padding:10px;box-shadow:0 30px 60px -30px rgba(30,27,75,.35)}
.svc-media video{display:block;width:100%;height:auto;border-radius:16px;background:#1E1B4B;aspect-ratio:16/9}
.svc-list{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.svc-list li{display:flex;gap:12px;align-items:flex-start;font-size:17px}
.svc-list li b{flex:none;width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:var(--accent-soft, #EEF0FF);color:var(--accent-dk, #3730A3);font-size:15px}
</style>"""

def svc_video(name, label):
    return (f'<div class="svc-media rv"><video controls playsinline preload="metadata" poster="/videos/{name}-poster.jpg?v=1" aria-label="{html.escape(label)}">'
            f'<source src="/videos/{name}.mp4?v=1" type="video/mp4"></video></div>')

sv = head("Services: Transform Content and AI Evaluator | AIStudyTools",
          "AIStudyTools services for faculty and institutions: turn lectures and PDFs into animated videos, mind maps, quiz games and chat, and evaluate answers fairly with the AI evaluator.",
          "/services/") + header("services")
sv = sv.replace("</head>", SVC_CSS + "</head>")
sv += hero("Services for faculty and institutions", 'Engaging lessons. <span class="hl">Fair grading.</span>',
           "Two AI services from AIStudyTools: Transform content turns your lectures and PDFs into videos, mind maps and games, and the AI evaluator scores answers against a clear rubric with feedback that teaches.",
           [("Transform content", "#transform", "btn-ink"), ("AI evaluator", "#evaluator", "btn-soft")],
           mindmap("Services", ["Animated videos", "Mind maps", "Quiz games", "Rubric scoring", "Feedback"], "Transform content into videos, mind maps and quiz games; AI evaluator for rubric scoring and feedback"))
sv += f'''<section class="white" id="transform" style="scroll-margin-top:80px">
  <div class="wrap svc">
    <div class="rv" style="display:flex;flex-direction:column;gap:16px">
      <span class="tag" style="align-self:flex-start">1 · Transform content</span>
      <h2>Turn dull lectures into dynamic learning</h2>
      <p class="lead">Upload a PDF, slides or a lecture recording. We turn it into learning your students actually use.</p>
      <ul class="svc-list">
        <li><b>1</b><span><strong>Animated videos</strong> that explain each idea in a few minutes, with captions.</span></li>
        <li><b>2</b><span><strong>Mind maps</strong> that show how the concepts connect.</span></li>
        <li><b>3</b><span><strong>Quiz games and simulations</strong> with scoreboards, so revision feels like play.</span></li>
        <li><b>4</b><span><strong>Chat with your content</strong>, in English, Hindi or the learner's own language.</span></li>
        <li><b>5</b><span><strong>Private by design:</strong> on your own system, cloud or on-premise.</span></li>
      </ul>
      <div class="hero-btns" style="margin-top:6px"><a class="btn btn-ink" href="/learnx/">Explore Transform content {I["arrow"]}</a><a class="btn btn-soft" href="#demo:LearnX%20Studio">Book a free demo</a></div>
    </div>
    {svc_video("transform-content-service", "Video: how Transform content turns lectures into videos, mind maps, games and chat")}
  </div>
</section>
<section id="evaluator" style="scroll-margin-top:80px">
  <div class="wrap svc rev">
    <div class="rv" style="display:flex;flex-direction:column;gap:16px">
      <span class="tag" style="align-self:flex-start">2 · AI evaluator</span>
      <h2>Grade fairly. Give feedback that teaches.</h2>
      <p class="lead">Score student answers or AI-generated text against your rubric, in seconds. You stay in charge of every grade.</p>
      <ul class="svc-list">
        <li><b>1</b><span><strong>Your rubric:</strong> presets for essays, cases and AI output, or your own criteria and weights.</span></li>
        <li><b>2</b><span><strong>Key-point check:</strong> see which expected points are covered and which are missing.</span></li>
        <li><b>3</b><span><strong>Claims to verify:</strong> figures without a source and absolute claims are flagged.</span></li>
        <li><b>4</b><span><strong>Weighted score</strong> that updates when you change any level.</span></li>
        <li><b>5</b><span><strong>Feedback in one click</strong>, ready to share with the student.</span></li>
      </ul>
      <div class="hero-btns" style="margin-top:6px"><a class="btn btn-ink" href="/ai-evaluator/">Try the AI evaluator free {I["arrow"]}</a><a class="btn btn-soft" href="/learnx/#evaluate">For your institution</a></div>
    </div>
    {svc_video("ai-evaluator-service", "Video: how the AI evaluator scores answers against a rubric and writes feedback")}
  </div>
</section>
<section class="white">
  <div class="wrap">
    {sec_head("How we work with institutions", "", "Four steps")}
    <ol class="steps rv" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      <li><div><b>Share</b><span>Send one course, chapter or set of answer scripts.</span></div></li>
      <li><div><b>We build</b><span>Videos, mind maps, games, rubrics and AI evaluation set up on your content.</span></div></li>
      <li><div><b>Pilot</b><span>Try it with one class and see engagement and marking time change.</span></div></li>
      <li><div><b>Scale</b><span>Roll out across departments, with faculty training from our team.</span></div></li>
    </ol>
  </div>
</section>
<section id="institutions" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Use cases for institutions", "", "Use cases")}
    <div class="grid g2">{"".join(uc_card(c) for c in USE_CASES if c[0] == "institutions")}</div>
  </div>
</section>
'''
sv += cta("See your own lesson come alive", "Send us one topic and see it turned into a video, mind map and game. Free, with no obligation.", "Book a free demo", "#demo:LearnX%20Studio")
sv += FOOT
write("/services/", sv)

# ---- use cases inside the Faculty Corner and Student Corner ----
_fac = f'''<section class="white" id="use-cases" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Use cases for faculty", "Common teaching problems, the tool that solves each one, and what you will have at the end.", "Use cases")}
    <div class="grid g3">{"".join(uc_card(c) for c in USE_CASES if c[0] == "faculty")}</div>
  </div>
</section>
<section id="newsletter" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("From the newsletter", "Practical notes for educators on simulations, cases, gamification and teaching with AI.", "Newsletter")}
    <div style="display:grid;gap:14px;max-width:820px;margin:0 auto">
''' + "".join(f'''      <a class="card issue rv" href="/newsletter/{it["slug"]}/"><span class="date">{nice_date(it["date"])}</span><h3>{html.escape(it["title"])}</h3><p>{html.escape(it["description"])}</p></a>
''' for it in ISSUES[:3]) + f'''    </div>
    <p class="rv" style="text-align:center;margin-top:22px"><a class="btn btn-soft" href="/newsletter/">All newsletter issues {I["arrow"]}</a></p>
  </div>
</section>
'''
_stu = f'''<section id="use-cases" style="scroll-margin-top:80px">
  <div class="wrap">
    {sec_head("Use cases for students", "Common problems, the course or tool that helps, and what you will have at the end.", "Use cases")}
    <div class="grid g2">{"".join(uc_card(c) for c in USE_CASES if c[0] == "students")}</div>
    <div id="professionals" style="scroll-margin-top:90px;margin-top:40px">{sec_head("For working professionals", "", "Use cases")}<div class="grid g2">{"".join(uc_card(c) for c in USE_CASES if c[0] == "professionals")}</div></div>
  </div>
</section>
'''
assert "<!--FACULTY-USES-->" in tl and "<!--STUDENT-USES-->" in pr
write("/tools/", tl.replace("<!--FACULTY-USES-->", _fac))
write("/practice/", pr.replace("<!--STUDENT-USES-->", _stu))

# ---- old /use-cases/ link: send each audience to its new home ----
uc = head("Use cases have moved | AIStudyTools", "AIStudyTools use cases are now in the Faculty Corner, Student Corner and Services pages.", "/use-cases/").replace("<head>", '<head>\n<meta name="robots" content="noindex">') + header("tools")
uc += f'''<section class="white"><div class="wrap" style="max-width:820px;text-align:center">
  <h1 style="font-size:clamp(32px,4.5vw,46px)">Use cases have moved</h1>
  <p class="lead" style="margin-top:10px">Pick where you want to go:</p>
  <div class="hero-btns" style="justify-content:center;margin-top:20px"><a class="btn btn-ink" href="/tools/#use-cases">For faculty</a><a class="btn btn-soft" href="/practice/#use-cases">For students</a><a class="btn btn-soft" href="/practice/#professionals">For professionals</a><a class="btn btn-soft" href="/services/#institutions">For institutions</a></div>
</div></section>
<script>(function(){{var m={{"#faculty":"/tools/#use-cases","#students":"/practice/#use-cases","#professionals":"/practice/#professionals","#institutions":"/services/#institutions"}};if(m[location.hash])location.replace(m[location.hash]);}})();</script>
'''
write("/use-cases/", uc + FOOT)
