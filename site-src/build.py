#!/usr/bin/env python3
"""Builds the AIStudyTools static site (Learning Lab · Indigo & Sunshine) into ./out"""
import os, html, re, glob
import markdown

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
V = "20"  # cache-buster for css/js

def svg(paths, extra=""):
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"{extra}>{paths}</svg>'

I = {
 "cap": svg('<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 10.5V15c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5"/>'),
 "pulse": svg('<path d="M3 12h4l2-5 4 10 2-5h6"/>'),
 "bars": svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
 "bot": svg('<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M2 13v2M22 13v2"/>'),
 "play": svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/>'),
 "chat": svg('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>'),
 "mic": svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
 "puzzle": svg('<path d="M10 4h4v3a2 2 0 1 0 4 0V4h2v6h-3a2 2 0 1 0 0 4h3v6h-6v-3a2 2 0 1 0-4 0v3H4v-6h3a2 2 0 1 0 0-4H4V4z"/>'),
 "map": svg('<circle cx="12" cy="12" r="3"/><circle cx="4.5" cy="5" r="2"/><circle cx="19.5" cy="5" r="2"/><circle cx="4.5" cy="19" r="2"/><circle cx="19.5" cy="19" r="2"/><path d="M6 6.5l3.8 3.4M18 6.5l-3.8 3.4M6 17.5l3.8-3.4M18 17.5l-3.8-3.4"/>'),
 "pencil": svg('<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>'),
 "spark": svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>'),
 "student": svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
 "flask": svg('<path d="M9 3h6M10 3v6L4.5 19A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-2L14 9V3"/><path d="M7.5 14h9"/>'),
 "teacher": svg('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 9h6"/>'),
 "school": svg('<path d="M3 10l9-6 9 6"/><path d="M5 10v9h14v-9M9 19v-5h6v5"/>'),
 "doc": svg('<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>'),
 "steth": svg('<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>'),
 "pill": svg('<rect x="3" y="9" width="18" height="7" rx="3.5" transform="rotate(-35 12 12.5)"/><path d="M9 9.5l5 5"/>'),
 "clip": svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>'),
 "leaf": svg('<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/>'),
 "users": svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .7 3.2 2.6 3.7 5.5"/>'),
 "crown": svg('<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>'),
 "trend": svg('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
 "headset": svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2.5" y="14" width="4" height="6" rx="1.5"/><rect x="17.5" y="14" width="4" height="6" rx="1.5"/><path d="M19.5 20c0 1-1.5 2-4 2h-2"/>'),
 "brief": svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>'),
 "shield": svg('<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
 "target": svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
 "lock": svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
 "layers": svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
 "building": svg('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>'),
 "gov": svg('<path d="M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18"/>'),
 "search": svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
 "mail": svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
 "phone": svg('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>'),
 "calendar": svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
 "globe": svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
 "arrow": svg('<path d="M5 12h14M13 6l6 6-6 6"/>', ' width="18" height="18"'),
}

NAV = [("/", "Home", "home"), ("/learnx/", "Transform content", "learnx"), ("/tools/", "Faculty Tools", "tools"),
       ("/practice/", "Student Practice", "practice"), ("/courses/", "Courses", "courses"), ("/webinars/", "Webinars", "webinars"),
       ("/newsletter/", "Newsletter", "newsletter"), ("/contact/", "Contact", "contact")]

def head(title, desc, path):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="https://www.aistudytools.com{path}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#4F46E5">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/static/site.css?v={V}">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
'''

def header(active):
    ON = ' class="on" aria-current="page"'
    links = "".join(f'<a href="{h}"{ON if k == active else ""}>{t}</a>' for h, t, k in NAV)
    demo_btn = '<a class="btn btn-accent btn-sm" href="#demo">Get a free demo</a>' if active == "learnx" else ""
    return f'''<header class="hdr">
  <div class="wrap">
    <a class="logo" href="/" aria-label="AIStudyTools home"><span class="logo-mark"></span><span><b>AIStudyTools</b><small>AI for teaching &amp; learning</small></span></a>
    <nav class="nav" aria-label="Main">{links}</nav>
    <div class="hdr-cta">
      {demo_btn}
      <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
  </div>
</header>
<main id="main">
'''

FOOT = f'''</main>
<footer class="ftr">
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="logo" href="/"><span class="logo-mark"></span><span><b>AIStudyTools</b></span></a>
        <p style="margin-top:14px;max-width:340px">AI tools and courses for teaching and learning. A platform of Intellique Research School Pvt Ltd.</p>
      </div>
      <div><h4>Explore</h4><a href="/learnx/">Transform content</a><a href="/tools/">Faculty Tools</a><a href="/practice/">Student Practice</a><a href="/courses/">Courses</a><a href="/webinars/">Webinars</a><a href="/journals/">Journal Finder</a><a href="/newsletter/">Newsletter</a></div>
      <div><h4>Contact</h4><a href="mailto:intelliqueresearchschool@gmail.com">intelliqueresearchschool@gmail.com</a><a href="https://wa.me/917303559258" target="_blank" rel="noopener">WhatsApp +91 73035 59258</a><a href="tel:+917303559258">Call +91 73035 59258</a></div>
      <div><h4>Sister sites</h4><a href="https://www.theresearchschool.com/">The Research School</a><a href="https://aijuggernauts.com/">AIjuggernauts</a><a href="https://intelliqueresearchschool.com/">Intellique Research School</a></div>
    </div>
    <div class="copy"><span>© <span id="yr">2026</span> AIStudyTools. All rights reserved.</span><span>Made for teachers, learners and institutions.</span></div>
  </div>
</footer>
<script src="/static/site.js?v={V}" defer></script>
</body>
</html>
'''

def mindmap(center, chips, label):
    # positions (left%, top%) around the centre
    pos = [(2, 12), (63, 12), (0, 56), (66, 58), (30, 86)]
    colors = ["c-indigo", "c-sun", "c-sky", "c-pink", "c-mint"]
    lines = "".join(f'<path d="M50 50 C {50 + (x + 12 - 50) * .4} {50 + (y + 4 - 50) * .4}, {x + 12} {y + 4}, {x + 12} {y + 4}"/>' for x, y in pos[:len(chips)])
    def place(x, y):
        return f"right:{max(0, 100 - x - 34)}%;top:{y}%" if x > 50 else f"left:{x}%;top:{y}%"
    cs = "".join(f'<span class="chip {colors[i]}" style="{place(x, y)}">{html.escape(c)}</span>' for i, ((x, y), c) in enumerate(zip(pos, chips)))
    return f'''<div class="mindmap" role="img" aria-label="{html.escape(label)}">
  <svg aria-hidden="true"><g stroke="#C9CCF7" stroke-width="3" fill="none" stroke-linecap="round"></g></svg>
  {cs}
  <div class="center">{html.escape(center)}</div>
</div>'''

def hero(tag, h1, lead, btns, mm, tagcls=""):
    b = "".join(f'<button class="btn {c}" type="button" data-video="{h[6:]}">{t}</button>' if h.startswith("video:") else f'<a class="btn {c}" href="{h}">{t}</a>' for t, h, c in btns)
    tg = f'<span class="tag {tagcls}">{tag}</span>' if tag else ""
    return f'''<section class="hero">
  <div class="wrap">
    <div class="hero-copy">
      {tg}
      <h1>{h1}</h1>
      <p class="lead">{lead}</p>
      <div class="hero-btns">{b}</div>
    </div>
    {mm}
  </div>
</section>
'''

def cards(items, cols="g4", color="i-indigo"):
    palette = ["i-indigo", "i-sun", "i-sky", "i-pink", "i-mint"]
    out = []
    for n, (ic, t, d) in enumerate(items):
        c = palette[n % 5] if color == "rotate" else color
        out.append(f'<div class="card rv"><div class="ico {c}">{I[ic]}</div><h3>{t}</h3><p>{d}</p></div>')
    return f'<div class="grid {cols}">{"".join(out)}</div>'

def stats(items):
    return '<div class="stats">' + "".join(f'<div class="stat rv"><b>{a}</b><span>{b}</span></div>' for a, b in items) + "</div>"

def sec_head(title, sub="", tag=""):
    t = f'<span class="tag indigo">{tag}</span>' if tag else ""
    s = f"<p>{sub}</p>" if sub else ""
    h = f"<h2>{title}</h2>" if title else ""
    return f'<div class="sec-head rv">{t}{h}{s}</div>'

def cta(title, text, btn, href):
    return f'''<section><div class="wrap"><div class="cta rv"><div><h2>{title}</h2><p>{text}</p></div><a class="btn btn-sun" href="{href}">{btn} {I["arrow"]}</a></div></div></section>
'''

def hook(title, name, label, tag="40-second watch", ver="1"):
    return f'''<section id="hook" class="hook">
  <div class="wrap">
    <div class="hook-head"><span class="tag">{tag}</span>{f"<h2>{title}</h2>" if title else ""}</div>
    <div class="hook-video">
      <video id="hook-video" src="/videos/{name}.mp4?v={ver}" poster="/videos/{name}-poster.jpg?v={ver}" autoplay muted loop playsinline preload="metadata" aria-label="{html.escape(label)}"></video>
      <button type="button" class="hook-sound" id="hook-sound">&#128266; Tap for sound</button>
    </div>
  </div>
</section>
'''

def checks(items):
    return '<ul class="checks">' + "".join(f"<li>{x}</li>" for x in items) + "</ul>"

def write(path, content):
    p = os.path.join(OUT, path.strip("/"), "index.html") if not path.endswith(".html") else os.path.join(OUT, path.strip("/"))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(content)

# ---------------- HOME ----------------
home = head("AIStudyTools | AI Tools and Courses for Teaching and Learning",
            "Free AI tools that turn lessons into simulations, cases and games, LearnX for institutions, and courses on using AI well in teaching and learning.", "/") + header("home")
home += hero("",
             'AI tools and courses for <span class="hl">teaching</span> and learning.',
             "Free tools that turn your lessons into simulations, cases and games. LearnX for institutions. Courses that show faculty and students how to use AI well.",
             [("Try the faculty tools", "/tools/", "btn-ink"), ("Watch how LearnX works", "video:/videos/aistudytools-explainer.mp4?v=1", "btn-soft")],
             mindmap("Your lesson", ["Simulation", "Quick case", "Quiz game", "Slide deck", "AI evaluation"], "A lesson becomes a simulation, quick case, quiz game, slide deck and AI evaluation"))
home += f'''<section id="products" class="white">
  <div class="wrap">
    {sec_head("", "For faculty who want livelier classes, students who want to practise, and institutions that want it at scale.", "What we offer")}
    <div class="grid g2">
      <a class="prod p-skill rv" href="/tools/"><span class="kicker">Free for faculty</span><div class="ico i-sun" style="background:#fff">{I["teacher"]}</div><h3>Faculty Tools</h3><p>Turn a concept or chapter into something students do, not just read.</p><ul><li>Simulation Creator</li><li>Quick Case Generator</li><li>Interactive Game Creator</li><li>AI Presentation Creator</li></ul><span class="go">Open the tools {I["arrow"]}</span></a>
      <a class="prod p-health rv" href="/practice/"><span class="kicker">Free for students</span><div class="ico i-sky" style="background:#fff">{I["student"]}</div><h3>Student Practice</h3><p>Make decisions, see consequences, get feedback and try again.</p><ul><li>Branching simulations</li><li>Learning games</li><li>Course comparison</li></ul><span class="go">Start practising {I["arrow"]}</span></a>
      <a class="prod p-learn rv" href="/learnx/"><span class="kicker">For institutions</span><div class="ico i-indigo" style="background:#fff">{I["cap"]}</div><h3>LearnX</h3><p>Your lectures and PDFs become games, mind maps, AI video chat and AI-assisted evaluation, on your own system.</p><ul><li>AI tutor</li><li>Question generator</li><li>Mind maps</li><li>Games &amp; simulations</li><li>AI-assisted evaluation</li></ul><span class="go">Explore LearnX {I["arrow"]}</span></a>
      <a class="prod p-course rv" href="/courses/"><span class="kicker">Learn with us</span><div class="ico i-pink" style="background:#fff">{I["calendar"]}</div><h3>Courses</h3><p>Short, practical courses on using AI in teaching, research and study.</p><ul><li>For faculty</li><li>For students</li><li>Live online</li></ul><span class="go">See courses {I["arrow"]}</span></a>
    </div>
  </div>
</section>
<section id="gamification" class="tint">
  <div class="wrap">
    {sec_head("Why gamification works", "Games are not just fun. When game elements serve the learning goal, students learn more, stay motivated and keep coming back.", "The science")}
    <div class="grid g3">
      <div class="stat rv"><b>Learning ↑</b><span>Better knowledge and understanding<br><small style="color:var(--faint)">effect size g = 0.49</small></span></div>
      <div class="stat rv"><b>Motivation ↑</b><span>More interest and engagement<br><small style="color:var(--faint)">effect size g = 0.36</small></span></div>
      <div class="stat rv"><b>Participation ↑</b><span>More active learning behaviour<br><small style="color:var(--faint)">effect size g = 0.25</small></span></div>
    </div>
    <p class="rv" style="text-align:center;color:var(--muted);font-size:15px;margin-top:14px">Source: Sailer &amp; Homner (2020), <i>The gamification of learning: a meta-analysis</i>, Educational Psychology Review. Positive effects were found on all three types of outcome. <a href="https://link.springer.com/article/10.1007/s10648-019-09498-w" target="_blank" rel="noopener">Read the study</a></p>
    <div style="margin-top:36px">{cards([("chat", "Instant feedback", "Students know straight away what they got right and what to fix, while the idea is still fresh."), ("spark", "Recall, not re-reading", "Quizzes and challenges make students pull ideas from memory, which strengthens long-term learning."), ("trend", "Visible progress", "Points, levels and progress bars turn a long syllabus into small, achievable goals."), ("users", "Story and teamwork", "A game story and team challenges that mix competition with collaboration keep learners involved.")], "g4", "rotate")}</div>
    <div class="note rv" style="margin-top:22px;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:#fff;color:var(--ink);border:2px solid var(--border)">
      <span><b style="color:var(--ink)">How we use it:</b> our Faculty Tools and LearnX turn your lessons into simulations, quiz games and quick cases, with instant feedback built in.</span>
      <a class="btn btn-ink btn-sm" href="/tools/">Try the faculty tools {I["arrow"]}</a>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("Why AIStudyTools?", "", "Why us")}
    {cards([("puzzle", "Practice over memory", "Students apply concepts to realistic decisions and see the consequences."), ("teacher", "Built by educators", "Designed by faculty who use these tools in their own classrooms."), ("target", "Ready in minutes", "Paste a topic or upload a chapter and get something you can use in class today."), ("lock", "Private by design", "Free tools keep your API key in your own browser. LearnX can run on your own system.")])}
    <div style="margin-top:28px">{stats([("100K+", "Learning interactions"), ("50K+", "Research queries"), ("10K+", "AI simulations"), ("500+", "Subjects covered")])}</div>
  </div>
</section>
'''
home += cta("See your own lesson come alive", "Send us one topic and see it turned into a video, mind map and game. Free, with no obligation.", "Talk to us", "/contact/")
home += FOOT
write("/", home)

# ---------------- LEARNX ----------------
lx = head("LearnX | AI-Powered Learning, Education & Research | AIStudyTools",
          "LearnX turns your lectures and PDFs into simulation games, mind maps and AI video chat, with AI-assisted evaluation for tests.", "/learnx/") + header("learnx")
lx += hero("Brain-science based learning", 'Turn dull content into <span class="hl">dynamic learning</span>.',
           "Upload a lecture or PDF. Learners get games, mind maps, notes and an AI they can chat with, in their own language. Learn smarter, research faster, achieve more.",
           [("Discover how it works", "video:/videos/aistudytools-explainer.mp4?v=1", "btn-ink"), ("See AI evaluation", "#evaluate", "btn-soft")],
           mindmap("Your lecture", ["Simulation game", "Mind map", "AI video chat", "Quiz + scoreboard", "AI evaluation"], "A lecture becomes a simulation game, mind map, AI video chat, quiz and AI evaluation"))
lx += f'''<section class="white"><div class="wrap">{stats([("100K+", "Learning sessions"), ("25K+", "Research queries"), ("500+", "Subjects covered"), ("24/7", "AI learning support")])}</div></section>
<section>
  <div class="wrap">
    {sec_head("LearnX solutions", "Helping learners, educators and researchers achieve more with intelligent AI support.", "What you get")}
    {cards([("bot", "AI tutor &amp; study companion", "Personalised explanations, examples and guidance across subjects, available any time."), ("play", "Interactive learning", "AI-supported animated videos with interactive learning experiences."), ("puzzle", "Simulations", "Develop critical thinking using realistic, game-based simulations."), ("mic", "Audio questionnaire", "Create qualitative surveys with audio inputs and improve assignments and writing.")], "g4", "rotate")}
  </div>
</section>
<section id="studio" class="white">
  <div class="wrap">
    {sec_head("LearnX Studio: turn existing content into interactive learning", "For schools, universities and training teams. Students often don't ask questions in class, lose focus or forget. LearnX Studio repurposes the videos and PDFs you already have into multimodal, interactive learning.", "For institutions")}
    {cards([("chat", "Chat with the video", "Learners ask questions and get instant text or voice answers, in their own language."), ("puzzle", "Gamified quizzes", "Drag-and-drop games with scoreboards, plus board games and immersive games."), ("map", "Mind maps", "From a template, from scratch or generated from a structured file. Editable, with images."), ("doc", "Summaries &amp; notes", "Short summaries plus notes learners can add to. Save as image, PDF or editable file."),
            ("search", "Search inside videos", "Jump to the exact moment with timestamp search."), ("globe", "Localisation", "Multi-language content, checked by a human for accuracy."), ("layers", "3D &amp; immersive", "Bring 2D engineering drawings to life, or explore interior and architecture models."), ("trend", "Adaptive feedback", "See how each learner engages and suggest practice for weak areas.")], "g4", "rotate")}
    <div class="grid g3" style="margin-top:20px">
      <div class="card rv"><div class="ico i-indigo">{I["lock"]}</div><h3>Private by design</h3><p>Runs on your own system: on-premise, cloud or hybrid. Answers come only from your content, with no exposure to public GPTs.</p></div>
      <div class="card rv"><div class="ico i-sky">{I["brief"]}</div><h3>Pricing</h3><p>Custom, based on the type and amount of content, users, features needed and deployment. Annual maintenance: 15% of total billing.</p></div>
      <div class="card rv" style="background:var(--sun);border-color:var(--sun)"><div class="ico" style="background:#fff;color:var(--sun-fg)">{I["spark"]}</div><h3>This month</h3><p style="color:var(--sun-fg)">Free mind map with every video.</p></div>
    </div>
  </div>
</section>
<section id="evaluate">
  <div class="wrap split">
    <div class="rv" style="display:flex;flex-direction:column;gap:18px">
      <span class="tag">AI-assisted assessment</span>
      <h2>LearnX Evaluate</h2>
      <p class="lead">Assess faster. Grade fairly. Give feedback that teaches.</p>
      <ol class="steps">
        <li><div><b>Create</b><span>Set up a test from a PDF, with passing criteria, accuracy threshold and number of attempts.</span></div></li>
        <li><div><b>Attempt</b><span>Students answer multiple choice, written, match-the-pairs and image-based questions.</span></div></li>
        <li><div><b>AI evaluates</b><span>Every answer gets an accuracy score and specific, written feedback.</span></div></li>
        <li><div><b>Teacher decides</b><span>Review, override the score, add suggestions and publish the report card.</span></div></li>
      </ol>
      <div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-ink" type="button" data-video="/videos/evaluate-highlight.mp4" id="demo-btn">Watch the 75-sec demo</button></div>
    </div>
    <div class="rv">
      <div class="card" style="gap:14px;padding:26px">
        <div style="display:flex;justify-content:space-between;align-items:center"><b>Q3 · What are the characteristics of preference stock?</b><span class="tag sky">Long answer</span></div>
        <div style="background:var(--bg);border-radius:14px;padding:14px;color:var(--muted);font-size:15px">Student's answer: preference stock carries dividend priority, fixed dividends and priority in asset distribution…</div>
        <div style="background:var(--ink);color:#fff;border-radius:16px;padding:18px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>AI response</b><span class="chip c-sun" style="padding:6px 12px">Accuracy 80</span></div><p style="color:#D6D5F0;font-size:15px">Covers dividend priority and asset preference well. To complete the answer, add non-voting rights and callable or convertible features.</p></div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span style="color:var(--muted);font-size:15px">Teacher can accept or override the score</span><span class="chip c-mint" style="padding:6px 12px">Teacher score: 8 / 10</span></div>
      </div>
      <p style="text-align:center;color:var(--faint);font-size:14px;margin-top:10px">Illustration of the evaluation screen</p>
    </div>
  </div>
</section>
<section class="white">
  <div class="wrap">
    {sec_head("Who uses LearnX?", "", "Audience")}
    {cards([("student", "Students", "Improve learning outcomes, exam performance and academic confidence."), ("flask", "Researchers", "Accelerate research activities and improve academic productivity."), ("teacher", "Faculty members", "Enhance teaching effectiveness and research output."), ("school", "Universities", "Provide scalable AI-powered learning support to students and faculty.")], "g4", "rotate")}
  </div>
</section>
'''
lx += cta("The future of learning is intelligent", "Learning is no longer limited by time, location or access to resources. LearnX combines AI, education and research support to help learners achieve more.", "Get a free demo", "#demo:LearnX%20Studio")
lx += '''<script>
fetch("/videos/evaluate-highlight.mp4", { method: "HEAD" }).then(function (r) { if (!r.ok) document.getElementById("demo-btn").remove(); }).catch(function () { var b = document.getElementById("demo-btn"); if (b) b.remove(); });
</script>
''' + FOOT
write("/learnx/", lx)

# ---------------- MOVED: HEALTHX / SKILLX (now on aijuggernauts.com) ----------------
def moved(path, name, dest, blurb):
    pg = head(f"{name} has moved to AIjuggernauts", f"{name} now lives on aijuggernauts.com.", path).replace(
        f'<link rel="canonical" href="https://www.aistudytools.com{path}">',
        f'<link rel="canonical" href="{dest}">\n<meta http-equiv="refresh" content="3;url={dest}">') + header("")
    pg += f'''<section class="hero"><div class="wrap" style="display:block;text-align:center;max-width:680px">
  <span class="tag">Moved</span><h1 style="margin-top:16px">{name} has a new home.</h1>
  <p class="lead" style="margin-top:16px">{blurb} It now lives on AIjuggernauts, our AI products and consulting site. Taking you there now.</p>
  <div class="hero-btns" style="justify-content:center;margin-top:24px"><a class="btn btn-ink" href="{dest}">Go to {name} {I["arrow"]}</a><a class="btn btn-soft" href="/">AIStudyTools home</a></div>
</div></section>
''' + FOOT
    write(path, pg)

moved("/healthx/", "HealthX", "https://aijuggernauts.com/healthx/", "HealthX helps people understand medical reports, symptoms and medicines.")
moved("/skillx/", "SkillX", "https://aijuggernauts.com/skillx/", "SkillX builds workplace skills through AI simulations and role plays.")

# ---------------- WEBINARS ----------------
wb = head("Live Expert-Led Webinars | AIStudyTools",
          "Learn directly from international experts in live webinars on research, doctoral studies and career growth.", "/webinars/") + header("webinars")
wb += hero("Live webinars", 'Live, <span class="hl">expert-led</span> webinars.',
           "Learn directly from international experts. Join upcoming sessions on research, doctoral studies and career growth.",
           [("Get notified", "#demo:Webinars", "btn-ink"), ("Ask on WhatsApp", "https://wa.me/917303559258?text=" + "Hi%2C%20please%20share%20upcoming%20AIStudyTools%20webinars.", "btn-soft")],
           mindmap("Live webinar", ["Research methods", "Doctoral studies", "Publishing", "Career growth", "AI in research"], "Webinar topics: research methods, doctoral studies, publishing, career growth and AI in research"))
wb += f'''<section class="white">
  <div class="wrap">
    {sec_head("Upcoming webinars", "New sessions are announced regularly. Tell us what you're interested in and we'll let you know when registration opens.", "Schedule")}
    <div class="card rv" style="max-width:720px;margin:0 auto;align-items:center;text-align:center;padding:40px">
      <div class="ico i-sun">{I["calendar"]}</div>
      <h3>The next sessions are being scheduled</h3>
      <p>Be the first to hear about dates, speakers and registration.</p>
      <a class="btn btn-accent" href="#demo:Webinars">Notify me</a>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("What we cover", "", "Topics")}
    {cards([("flask", "Research", "Methods, analysis and the tools researchers use today, including AI."), ("cap", "Doctoral studies", "Guidance for PhD and DBA journeys, from proposal to defence."), ("trend", "Career growth", "Publishing, teaching and professional development for academics and professionals.")], "g3", "rotate")}
  </div>
</section>
'''
wb += cta("Want a webinar for your institution?", "We run custom sessions for universities, faculty teams and organisations.", "Talk to us", "#demo:Webinars")
wb += FOOT
write("/webinars/", wb)

# ---------------- CONTACT ----------------
ct = head("Contact Us | AIStudyTools",
          "Book a LearnX demo, ask about courses or the faculty tools, or contact AIStudyTools by email or WhatsApp.", "/contact/") + header("contact")
ct += f'''<section class="hero" style="padding-bottom:24px">
  <div class="wrap" style="display:block;text-align:center;max-width:760px">
    <span class="tag">Let's talk</span>
    <h1 style="margin-top:16px">Contact <span class="hl" style="color:var(--accent)">us</span>.</h1>
    <p class="lead" style="margin-top:16px">Leave your number and our team will call you back within one business day.</p>
  </div>
</section>
<section style="padding-top:24px">
  <div class="wrap" style="max-width:880px;display:grid;grid-template-columns:minmax(0,1fr);gap:20px">
    <div class="grid g2">
      <a class="ccard rv" href="mailto:intelliqueresearchschool@gmail.com"><span class="ico i-indigo">{I["mail"]}</span><span><b>Email</b><small>We reply within one business day.</small><span class="v">intelliqueresearchschool@gmail.com</span></span></a>
      <a class="ccard rv" href="https://wa.me/917303559258?text=Hi%20AIStudyTools%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener"><span class="ico i-mint">{I["phone"]}</span><span><b>Call / WhatsApp</b><small>Send a quick message.</small><span class="v">+91 73035 59258</span></span></a>
    </div>
    <form class="form rv" id="contact-form" novalidate>
      <h2 id="form-title" style="font-size:28px">We'll call you back</h2>
      <div class="row2">
        <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="row2">
        <div class="field"><label for="f-phone">Phone / WhatsApp</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required></div>
        <div class="field"><label for="f-org">Organisation</label><input id="f-org" name="org" autocomplete="organization"></div>
      </div>
      <div class="field"><label for="f-product">Interested in</label><select id="f-product" name="product"><option>LearnX — Learning &amp; Research</option><option>Faculty tools — Help or training</option><option>Courses — Joining or hosting one</option><option>Webinars</option><option>Something else</option></select></div>
      <div class="field"><label for="f-msg">How can we help?</label><textarea id="f-msg" name="message"></textarea></div>
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><button class="btn btn-accent" type="submit">Request a call back</button><p class="status" role="status" aria-live="polite"></p></div>
    </form>
  </div>
</section>
''' + FOOT
write("/contact/", ct)

# ---------------- FACULTY TOOLS (hub) ----------------
def tool_cards(items):
    out = []
    palette = ["i-indigo", "i-sun", "i-sky", "i-pink", "i-mint"]
    for n, (ic, t, d, href, note) in enumerate(items):
        badge = f'<span class="tag indigo" style="align-self:flex-start;font-size:13px;padding:5px 12px">{note}</span>' if note else ""
        out.append(f'<a class="card tool rv" href="{href}"><div class="ico {palette[n % 5]}">{I[ic]}</div><h3>{t}</h3><p>{d}</p>{badge}<span class="go">Open {I["arrow"]}</span></a>')
    return f'<div class="grid g3">{"".join(out)}</div>'

GATE = ' data-gate="1"'

tl = head("Free AI Tools for Faculty | AIStudyTools",
          "Free AI tools for faculty: simulation prompts, quick cases with teaching notes, drag-and-drop quiz games and ready-to-present slide decks.", "/tools/").replace("<body>", f"<body{GATE}>") + header("tools")
tl += hero("Free for faculty", 'Stop just teaching. Start <span class="hl">creating experiences</span>.',
           "Turn classroom concepts into practice your students can do: role-play simulations, quick cases, quiz games and slide decks, in minutes.",
           [("Create a simulation", "/tools/simulation-creator.html", "btn-ink"), ("Make a quiz game", "/tools/create-game.html", "btn-soft")],
           mindmap("Your concept", ["Create", "Engage", "Assess", "Guide"], "Faculty create, engage, assess and guide"))
tl += f'''<section class="white">
  <div class="wrap">
    {sec_head("Pick a tool", "Each tool runs in your browser. Some ask for a free Google Gemini API key, which stays on your device.", "Faculty tools")}
    {tool_cards([
        ("puzzle", "Simulation Creator", "Fill in a concept and scenario, get a role-play prompt your students paste into ChatGPT or Gemini to play a live simulation.", "/tools/simulation-creator.html", "No API key needed"),
        ("doc", "Quick Case Generator", "Turn today's news into a Harvard-style, classroom-ready quick case plus a separate faculty teaching note.", "/tools/quick-case-generator.html", "Needs a Gemini key"),
        ("spark", "Interactive Game Creator", "Upload your lesson and get drag-and-drop quiz games your students play from one link.", "/tools/create-game.html", "Needs a Gemini key"),
        ("search", "Journal Finder", "Search journals by name or ISSN and filter by ABDC rating, SJR quartile and Web of Science index, all in one place.", "/journals/", "No API key needed"),
        ("layers", "AI Presentation Creator", "Paste your content, pick a style and download a designed PowerPoint with real charts.", "/tools/ai-presentation-creator.html", "Needs a Gemini key"),
    ])}
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("How it works in class", "", "The loop")}
    <ol class="steps rv" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      <li><div><b>Create</b><span>Turn concepts, cases and classroom material into realistic practice scenarios.</span></div></li>
      <li><div><b>Engage</b><span>Students apply knowledge, make decisions and solve problems, not just memorise.</span></div></li>
      <li><div><b>Assess</b><span>Evaluate responses and spot strengths, gaps and areas to improve.</span></div></li>
      <li><div><b>Guide</b><span>Use the feedback to help students improve and build practical skills.</span></div></li>
    </ol>
  </div>
</section>
<section class="white">
  <div class="wrap">
    {sec_head("Practice across business disciplines", "", "Subjects")}
    {cards([("trend", "Marketing", "STP · 4Ps · Consumer behaviour · Branding · Digital marketing"), ("target", "Strategy", "Five Forces · Blue Ocean · Competitive strategy · Growth"), ("spark", "Entrepreneurship", "Business models · Innovation · Startup strategy · Venture decisions"), ("bars", "Finance", "Investment decisions · Valuation · Risk · Financial strategy"),
            ("layers", "Operations", "Supply chain · Capacity · Process · Quality"), ("users", "Leadership &amp; HR", "Leadership · Change management · Conflict · Motivation"), ("bot", "AI &amp; Digital", "AI strategy · Digital transformation · AI adoption · AI ethics"), ("puzzle", "Product &amp; Innovation", "Product strategy · Product-market fit · Innovation · Pricing")], color="rotate")}
  </div>
</section>
'''
tl += cta("Want these tools for your whole department?", "LearnX brings simulations, games and AI-assisted evaluation to your institution, on your own system.", "Explore LearnX", "/learnx/")
tl += FOOT
write("/tools/", tl)

# ---------------- STUDENT PRACTICE (hub) ----------------
pr = head("Student Practice: Simulations and Learning Games | AIStudyTools",
          "Free practice for students: branching simulations, learning games and a course comparison helper.", "/practice/").replace("<body>", f"<body{GATE}>") + header("practice")
pr += hero("Free for students", 'Stop memorising. Start <span class="hl">practising</span>.',
           "Apply what you learn to realistic situations. Make decisions with incomplete information, see the consequences, get feedback and try again.",
           [("Play a simulation", "/practice/prompt-engineering-basics/", "btn-ink"), ("Play a game", "/tools/games.html", "btn-soft")],
           mindmap("You", ["Practise", "Decide", "Get feedback", "Build confidence"], "Students practise, decide, get feedback and build confidence"))
pr += f'''<section class="white">
  <div class="wrap">
    {sec_head("Start practising", "", "Practice")}
    {tool_cards([
        ("map", "Prompt Engineering Basics", "A branching simulation: choose how to prompt the AI and see how the result changes.", "/practice/prompt-engineering-basics/", "Simulation"),
        ("puzzle", "Learning games", "Memory match, AI trivia and quick games for a mental break between cases and simulations.", "/tools/games.html", "Games"),
        ("search", "Course Comparison", "Tell the AI what you want to learn and compare how major platforms teach it: format, duration, certificate and cost.", "/tools/course-comparison.html", "Needs a Gemini key"),
    ])}
    <p class="rv" style="text-align:center;color:var(--muted);margin-top:28px">Faculty: build your own role-play for your class with the <a href="/tools/simulation-creator.html">Simulation Creator</a>.</p>
  </div>
</section>
'''
pr += FOOT
write("/practice/", pr)

# ---------------- SIMULATION: PROMPT ENGINEERING BASICS ----------------
SIM_JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "simulations", "prompt-engineering-basics.js"), encoding="utf-8").read()
sm = head("Prompt Engineering Basics: A Branching Simulation | AIStudyTools",
          "Practise writing better AI prompts by making choices and seeing how the AI's response changes.", "/practice/prompt-engineering-basics/") + header("practice")
sm += f'''<section class="hero" style="padding-bottom:16px"><div class="wrap" style="display:block;max-width:820px">
  <span class="tag">Simulation</span>
  <h1 style="margin-top:16px;font-size:clamp(32px,5vw,52px)">Prompt Engineering Basics</h1>
  <p class="lead" style="margin-top:16px">Work through the scenario below. At each step, choose how you'd prompt the AI and see how the outcome changes.</p>
</div></section>
<section style="padding-top:8px"><div class="wrap" style="max-width:820px">
  <div id="sim-root" class="sim-box" aria-live="polite"></div>
  <p style="margin-top:24px;color:var(--muted)">Faculty: build your own role-play for class with the <a href="/tools/simulation-creator.html">Simulation Creator</a>.</p>
</div></section>
<script>
{SIM_JS}
</script>
''' + FOOT
write("/practice/prompt-engineering-basics/", sm)

# ---------------- COURSES ----------------
cs = head("AI Courses for Faculty and Students | AIStudyTools",
          "Short, practical courses on using AI in teaching, research and study, from AIStudyTools.", "/courses/") + header("courses")
cs += hero("Courses", 'Learn to use AI <span class="hl">well</span>.',
           "Short, practical courses on using AI in teaching, research and study. Live online, with hands-on work on your own material.",
           [("Notify me when enrolment opens", "#demo:Courses", "btn-ink"), ("Host a course for your institution", "#demo:Courses", "btn-soft")],
           mindmap("Courses", ["AI in teaching", "AI in research", "Prompting", "Assessment", "Responsible AI"], "Course topics: AI in teaching, AI in research, prompting, assessment and responsible AI"))
cs += f'''<section class="white" id="available">
  <div class="wrap">
    {sec_head("Available now", "Start today. Free, self-paced and open to everyone.", "Open for all")}
    <div class="card rv" style="display:flex;flex-direction:row;gap:22px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:2px solid var(--accent)">
      <div style="display:flex;gap:18px;align-items:flex-start;flex:1 1 420px"><div class="ico i-indigo" style="flex:none">{I["bars"]}</div><div><span class="tag indigo">Free · Self-paced · Certificate</span><h3 style="margin-top:8px">Basics of Statistics</h3><p>Two modules: Measures of Central Tendency (mean, median, mode) and Measures of Dispersion (IQR, standard deviation, mean deviation). Teaching videos, calculators, quick checks and a final test.</p></div></div>
      <a class="btn btn-accent" href="/courses/basics-of-statistics/" style="flex:none">Start the course {I["arrow"]}</a>
    </div>
    <div class="card rv" style="display:flex;flex-direction:row;gap:22px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:2px solid var(--accent);margin-top:18px">
      <div style="display:flex;gap:18px;align-items:flex-start;flex:1 1 420px"><div class="ico i-sky" style="flex:none">{I["target"]}</div><div><span class="tag indigo">Free · Self-paced · Certificate</span><h3 style="margin-top:8px">Product Management</h3><p>Two modules: Discovery and Strategy (the PM role, customer discovery and jobs to be done, market sizing) and Delivery and Growth (RICE prioritisation, MVPs and retention, funnels and A/B testing). Interactive tools, quick checks and a final test.</p></div></div>
      <a class="btn btn-accent" href="/courses/product-management/" style="flex:none">Start the course {I["arrow"]}</a>
    </div>
    <div class="card rv" style="display:flex;flex-direction:row;gap:22px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:2px solid var(--accent);margin-top:18px">
      <div style="display:flex;gap:18px;align-items:flex-start;flex:1 1 420px"><div class="ico i-pink" style="flex:none">{I["chat"]}</div><div><span class="tag indigo">Free · Self-paced · Certificate</span><h3 style="margin-top:8px">Prompt Engineering</h3><p>Two modules: Prompting Fundamentals (how AI assistants work, the anatomy of a good prompt, examples and reasoning) and Prompting in Practice (iterating and chaining, real-world tasks, responsible use). Interactive prompt tools, quick checks and a final test.</p></div></div>
      <a class="btn btn-accent" href="/courses/prompt-engineering/" style="flex:none">Start the course {I["arrow"]}</a>
    </div>
    <div class="card rv" style="display:flex;flex-direction:row;gap:22px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:2px solid var(--accent);margin-top:18px">
      <div style="display:flex;gap:18px;align-items:flex-start;flex:1 1 420px"><div class="ico i-sun" style="flex:none">{I["brief"]}</div><div><span class="tag indigo">Free · Self-paced · Certificate</span><h3 style="margin-top:8px">HR Analytics</h3><p>Two modules: Foundations of HR Analytics (strategic HR, LAMP and the HR value chain, descriptive to prescriptive analytics, HR metrics) and HR Data, Tools and Applications (data collection, Power BI dashboards, workforce planning, talent management). Interactive tools, quick checks and a final test.</p></div></div>
      <a class="btn btn-accent" href="/courses/hr-analytics/" style="flex:none">Start the course {I["arrow"]}</a>
    </div>
    <div class="card rv" style="display:flex;flex-direction:row;gap:22px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:2px solid var(--accent);margin-top:18px">
      <div style="display:flex;gap:18px;align-items:flex-start;flex:1 1 420px"><div class="ico i-sky" style="flex:none">{I["search"]}</div><div><span class="tag indigo">Free · Self-paced · Certificate</span><h3 style="margin-top:8px">SEO to GEO: Optimize Content for AI Search</h3><p>Two modules: How AI Search Works (SEO foundations, how Google AI Overviews, ChatGPT search and Perplexity find and cite content, what GEO is) and Optimizing Content for AI Search (answer-first writing, AI crawlers and structured data, measuring AI visibility). Interactive tools, quick checks and a final test.</p></div></div>
      <a class="btn btn-accent" href="/courses/seo-to-geo/" style="flex:none">Start the course {I["arrow"]}</a>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("Launching soon", "The first cohorts are being scheduled. Leave your details and we'll tell you when enrolment opens.", "Upcoming")}
    <div class="grid g4">
      <div class="card rv"><div class="ico i-indigo">{I["bot"]}</div><span class="tag sky" style="align-self:flex-start">New</span><h3>Agentic AI</h3><p>Understand AI agents and build simple ones that plan, use tools and finish multi-step tasks for you.</p><a class="btn btn-accent btn-sm" href="#demo:Courses" style="align-self:flex-start;margin-top:auto">Register interest</a></div>
      <div class="card rv"><div class="ico i-sun">{I["puzzle"]}</div><span class="tag" style="align-self:flex-start">No coding needed</span><h3>Coding for Non-Coders</h3><p>Build small apps, scripts and automations by describing what you want to AI, with no programming background.</p><a class="btn btn-accent btn-sm" href="#demo:Courses" style="align-self:flex-start;margin-top:auto">Register interest</a></div>
      <div class="card rv"><div class="ico i-mint">{I["bars"]}</div><span class="tag sky" style="align-self:flex-start">Data skills</span><h3>Data Analysis and Visualisation</h3><p>Clean data, find patterns and make clear charts and dashboards with AI and spreadsheet tools.</p><a class="btn btn-accent btn-sm" href="#demo:Courses" style="align-self:flex-start;margin-top:auto">Register interest</a></div>
      <div class="card rv"><div class="ico i-sky">{I["search"]}</div><span class="tag sky" style="align-self:flex-start">For researchers</span><h3>AI for Research and Literature Review</h3><p>Find, read and summarise papers faster, and use AI responsibly in writing and publishing.</p><a class="btn btn-accent btn-sm" href="#demo:Courses" style="align-self:flex-start;margin-top:auto">Register interest</a></div>
      <div class="card rv"><div class="ico i-indigo">{I["brief"]}</div><span class="tag" style="align-self:flex-start">For professionals</span><h3>Generative AI for Work and Productivity</h3><p>Use AI for emails, reports, presentations and meetings, and set up simple workflow automations.</p><a class="btn btn-accent btn-sm" href="#demo:Courses" style="align-self:flex-start;margin-top:auto">Register interest</a></div>
      <div class="card rv"><div class="ico i-sun">{I["teacher"]}</div><span class="tag sky" style="align-self:flex-start">For faculty</span><h3>AI in Teaching and Research</h3><p>Build simulations, quick cases and quiz games for your own course, and use AI responsibly in research and assessment.</p><a class="btn btn-accent btn-sm" href="#demo:Courses" style="align-self:flex-start;margin-top:auto">Register interest</a></div>
      <div class="card rv"><div class="ico i-mint">{I["student"]}</div><span class="tag" style="align-self:flex-start">For students</span><h3>Study and Practise with AI</h3><p>Use AI as a tutor and practice partner without letting it do the thinking for you.</p><a class="btn btn-accent btn-sm" href="#demo:Courses" style="align-self:flex-start;margin-top:auto">Register interest</a></div>
    </div>
  </div>
</section>
<section class="white">
  <div class="wrap">
    {sec_head("How the courses run", "", "Format")}
    {cards([("calendar", "Live online", "Short live sessions you can fit around teaching or classes."), ("pencil", "Hands-on", "You build something with your own material in every session."), ("school", "For your institution", "Any course can run as a faculty development programme for your team.")], cols="g3", color="rotate")}
  </div>
</section>
'''
cs += cta("Want a course for your institution?", "We run courses and faculty development programmes for universities and training teams.", "Talk to us", "#demo:Courses")
cs += FOOT
write("/courses/", cs)

# ---------------- NEWSLETTER ----------------
def read_issue(path):
    raw = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    meta, body = {}, raw
    if m:
        body = m.group(2)
        for line in m.group(1).splitlines():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip().strip('"')
    slug = os.path.splitext(os.path.basename(path))[0]
    return {"slug": slug, "title": meta.get("title", slug), "date": meta.get("date", ""), "description": meta.get("description", ""), "body": body}

import datetime
def nice_date(d):
    try:
        return datetime.date.fromisoformat(d[:10]).strftime("%-d %B %Y")
    except Exception:
        return d

ISSUES = sorted((read_issue(p) for p in glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), "newsletter", "*.md"))),
                key=lambda x: x["date"], reverse=True)
for it in ISSUES:
    pg = head(f'{it["title"]} | AIStudyTools Newsletter', it["description"] or it["title"], f'/newsletter/{it["slug"]}/') + header("newsletter")
    pg += f'''<section class="hero" style="padding-bottom:12px"><div class="wrap" style="display:block;max-width:780px">
  <a href="/newsletter/" style="font-weight:700;text-decoration:none">← All issues</a>
  <h1 style="margin-top:18px;font-size:clamp(32px,4.6vw,48px)">{html.escape(it["title"])}</h1>
  <p style="margin-top:14px;color:var(--faint);font-weight:600">{nice_date(it["date"])}</p>
</div></section>
<section style="padding-top:12px"><div class="wrap" style="max-width:780px"><article class="prose">{markdown.markdown(it["body"], extensions=["extra"])}</article></div></section>
''' + FOOT
    write(f'/newsletter/{it["slug"]}/', pg)

nl = head("AI Newsletter for Educators | AIStudyTools", "Practical AI updates for educators and trainers: simulations, cases, gamification and AI in the classroom.", "/newsletter/") + header("newsletter")
nl += f'''<section class="hero" style="padding-bottom:16px"><div class="wrap" style="display:block;max-width:820px">
  <span class="tag">Newsletter</span>
  <h1 style="margin-top:16px;font-size:clamp(34px,5vw,56px)">AI for the classroom, one issue at a time.</h1>
  <p class="lead" style="margin-top:16px">Practical notes for educators and trainers on simulations, cases, gamification and teaching with AI.</p>
</div></section>
<section style="padding-top:16px"><div class="wrap" style="max-width:820px;display:grid;gap:14px">
''' + "".join(f'''  <a class="card issue rv" href="/newsletter/{it["slug"]}/"><span class="date">{nice_date(it["date"])}</span><h3>{html.escape(it["title"])}</h3><p>{html.escape(it["description"])}</p></a>
''' for it in ISSUES) + '''</div></section>
''' + FOOT
write("/newsletter/", nl)

# ---------------- 404 ----------------
nf = head("Page not found | AIStudyTools", "The page you are looking for could not be found.", "/404.html") + header("")
nf += f'''<section class="hero"><div class="wrap" style="display:block;text-align:center;max-width:680px">
  <span class="tag">404</span><h1 style="margin-top:16px">This page wandered off.</h1>
  <p class="lead" style="margin-top:16px">The link may be old or mistyped. Try one of these instead.</p>
  <div class="hero-btns" style="justify-content:center;margin-top:24px"><a class="btn btn-ink" href="/">Go home</a><a class="btn btn-soft" href="/learnx/">Transform content</a><a class="btn btn-soft" href="/contact/">Contact us</a></div>
</div></section>
''' + FOOT
write("/404.html", nf)
print("built", sorted(os.path.relpath(os.path.join(d, f), OUT) for d, _, fs in os.walk(OUT) for f in fs))
