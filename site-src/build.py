#!/usr/bin/env python3
"""Builds the AIStudyTools static site (Learning Lab · Indigo & Sunshine) into ./out"""
import os, html

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
V = "4"  # cache-buster for css/js

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

NAV = [("/", "Home", "home"), ("/learnx/", "LearnX", "learnx"), ("/healthx/", "HealthX", "healthx"), ("/skillx/", "SkillX", "skillx"),
       ("/journals/", "Journal Finder", "journals"), ("/webinars/", "Webinars", "webinars"), ("/contact/", "Contact", "contact")]

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
    return f'''<header class="hdr">
  <div class="wrap">
    <a class="logo" href="/" aria-label="AIStudyTools home"><span class="logo-mark"></span><span><b>AIStudyTools</b><small>Accelerating Human Potential with AI</small></span></a>
    <nav class="nav" aria-label="Main">{links}</nav>
    <div class="hdr-cta">
      <a class="btn btn-accent btn-sm" href="/contact/">Book a consultation</a>
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
        <p style="margin-top:14px;max-width:340px">One intelligent platform for learning, healthcare insights and workforce development.</p>
      </div>
      <div><h4>Products</h4><a href="/learnx/">LearnX</a><a href="/healthx/">HealthX</a><a href="/skillx/">SkillX</a></div>
      <div><h4>Resources</h4><a href="/journals/">Journal Finder</a><a href="/webinars/">Webinars</a></div>
      <div><h4>Contact</h4><a href="mailto:intelliqueresearchschool@gmail.com">intelliqueresearchschool@gmail.com</a><a href="https://wa.me/917303559258" target="_blank" rel="noopener">WhatsApp +91 73035 59258</a><a href="tel:+917303559258">Call +91 73035 59258</a></div>
    </div>
    <div class="copy"><span>© <span id="yr">2026</span> AIStudyTools. All rights reserved.</span><span>Made for learners, researchers and teams.</span></div>
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
    b = "".join(f'<a class="btn {c}" href="{h}">{t}</a>' for t, h, c in btns)
    return f'''<section class="hero">
  <div class="wrap">
    <div class="hero-copy">
      <span class="tag {tagcls}">{tag}</span>
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
    return f'<div class="sec-head rv">{t}<h2>{title}</h2>{s}</div>'

def cta(title, text, btn, href):
    return f'''<section><div class="wrap"><div class="cta rv"><div><h2>{title}</h2><p>{text}</p></div><a class="btn btn-sun" href="{href}">{btn} {I["arrow"]}</a></div></div></section>
'''

def hook(title, name, label, tag="40-second watch"):
    return f'''<section id="hook" class="hook">
  <div class="wrap">
    <div class="hook-head"><span class="tag">{tag}</span><h2>{title}</h2></div>
    <div class="hook-video">
      <video id="hook-video" src="/videos/{name}.mp4" poster="/videos/{name}-poster.jpg" autoplay muted loop playsinline preload="metadata" aria-label="{html.escape(label)}"></video>
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
home = head("AIStudyTools | Accelerating Human Potential with AI",
            "One intelligent platform powering learning, healthcare insights and workforce development: LearnX, HealthX and SkillX.", "/") + header("home")
home += hero("One platform · Three intelligent products",
             'Accelerating human potential with <span class="hl">AI</span>.',
             "One intelligent platform powering learning, healthcare insights and workforce development through advanced artificial intelligence.",
             [("Explore products", "#products", "btn-ink"), ("Watch the 40-sec video", "/learnx/#hook", "btn-soft")],
             mindmap("AIStudyTools", ["LearnX", "HealthX", "SkillX", "Journal Finder", "AI evaluation"], "AIStudyTools connects LearnX, HealthX, SkillX, the Journal Finder and AI evaluation"))
home += f'''<section id="products" class="white">
  <div class="wrap">
    {sec_head("Our offerings", "Designed to empower individuals, institutions, healthcare providers and organisations.", "Products")}
    <div class="grid g3">
      <a class="prod p-learn rv" href="/learnx/"><span class="kicker">Unlock knowledge potential</span><div class="ico i-indigo" style="background:#fff">{I["cap"]}</div><h3>LearnX</h3><p>AI-powered learning, education and research for students, educators, researchers and institutions.</p><ul><li>AI tutor</li><li>Question generator</li><li>Mind maps</li><li>Games &amp; simulations</li><li>AI-assisted evaluation</li><li>Interactive learning</li></ul><span class="go">Explore LearnX {I["arrow"]}</span></a>
      <a class="prod p-health rv" href="/healthx/"><span class="kicker">Unlock health potential</span><div class="ico i-sky" style="background:#fff">{I["pulse"]}</div><h3>HealthX</h3><p>AI-assisted healthcare and wellness information to help people understand symptoms, reports and medical terms.</p><ul><li>Report interpretation</li><li>AI health chat</li><li>Symptom understanding</li><li>Medication insights</li><li>Doctor visit preparation</li><li>3D interaction</li></ul><span class="go">Explore HealthX {I["arrow"]}</span></a>
      <a class="prod p-skill rv" href="/skillx/"><span class="kicker">Unlock skill potential</span><div class="ico i-sun" style="background:#fff">{I["bars"]}</div><h3>SkillX</h3><p>AI-powered training and workforce development through simulations, role plays and experiential learning.</p><ul><li>AI simulations</li><li>Interactive videos</li><li>Leadership training</li><li>Sales practice</li><li>Customer service</li><li>AI assessment &amp; feedback</li></ul><span class="go">Explore SkillX {I["arrow"]}</span></a>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("Why choose AIStudyTools?", "", "Why us")}
    {cards([("bot", "AI-powered intelligence", "Purpose-built AI solutions on demand."), ("target", "Personalised experiences", "Adaptive recommendations tailored to each user's needs and goals."), ("lock", "Secure &amp; reliable", "Strong privacy and security, including on-premise options."), ("layers", "Scalable platform", "Built for people who want more than ordinary.")], "g4", "rotate")}
    <div style="margin-top:28px">{stats([("100K+", "Learning interactions"), ("50K+", "Research queries"), ("10K+", "AI simulations"), ("5K+", "Healthcare reports analysed")])}</div>
  </div>
</section>
<section class="white">
  <div class="wrap split">
    <div class="rv" style="display:flex;flex-direction:column;gap:18px;align-items:flex-start">
      <span class="tag">Free for researchers</span>
      <h2>Find the right journal in seconds</h2>
      <p class="lead">Search journals by name or ISSN and filter by ABDC rating, SJR quartile and Web of Science index, all in one place.</p>
      <a class="btn btn-ink" href="/journals/">Open Journal Finder {I["arrow"]}</a>
    </div>
    <div class="rv" style="display:grid;gap:12px">
      <div class="card" style="flex-direction:row;align-items:center;justify-content:space-between;padding:20px 24px"><b>Journal of Marketing</b><span style="display:flex;gap:8px"><span class="chip c-indigo" style="padding:6px 12px">A* ABDC</span><span class="chip c-mint" style="padding:6px 12px">Q1</span></span></div>
      <div class="card" style="flex-direction:row;align-items:center;justify-content:space-between;padding:20px 24px"><b>The Journal of Finance</b><span style="display:flex;gap:8px"><span class="chip c-indigo" style="padding:6px 12px">A* ABDC</span><span class="chip c-mint" style="padding:6px 12px">Q1</span></span></div>
      <div class="card" style="flex-direction:row;align-items:center;justify-content:space-between;padding:20px 24px"><b>Journal of Business Research</b><span style="display:flex;gap:8px"><span class="chip c-indigo" style="padding:6px 12px">A ABDC</span><span class="chip c-mint" style="padding:6px 12px">Q1</span></span></div>
    </div>
  </div>
</section>
'''
home += cta("Empowering better decisions every day", "Send us one topic and see it turned into a video, mind map and game. Free, with no obligation.", "Get a free demo", "#demo")
home += FOOT
write("/", home)

# ---------------- LEARNX ----------------
lx = head("LearnX | AI-Powered Learning, Education & Research | AIStudyTools",
          "LearnX turns your lectures and PDFs into simulation games, mind maps and AI video chat, with AI-assisted evaluation for tests.", "/learnx/") + header("learnx")
lx += hook("Boring content? Watch what we do with it.", "aistudytools-explainer", "AIStudyTools explainer video: boring content turned into videos, mind maps, games and AI feedback")
lx += hero("Brain-science based learning", 'Your content, made <span class="hl">playful</span>.',
           "Upload a lecture or PDF. Learners get games, mind maps, notes and an AI they can chat with, in their own language. Learn smarter, research faster, achieve more.",
           [("Watch the 40-sec video", "#hook", "btn-ink"), ("See AI evaluation", "#evaluate", "btn-soft")],
           mindmap("Your lecture", ["Simulation game", "Mind map", "AI video chat", "Quiz + scoreboard", "AI evaluation"], "A lecture becomes a simulation game, mind map, AI video chat, quiz and AI evaluation"))
lx += f'''<section class="white"><div class="wrap">{stats([("100K+", "Learning sessions"), ("25K+", "Research queries"), ("500+", "Subjects covered"), ("24/7", "AI learning support")])}</div></section>
<section>
  <div class="wrap">
    {sec_head("LearnX solutions", "Helping learners, educators and researchers achieve more with intelligent AI support.", "What you get")}
    {cards([("bot", "AI tutor", "Personalised explanations, examples and concept guidance across subjects."), ("play", "Interactive learning", "AI-supported animated videos with interactive learning experiences."), ("chat", "Interactive bot", "Simulation and game-based learning with an AI chatbot for adaptive learning."), ("mic", "Audio questionnaire", "Create qualitative surveys with audio inputs and improve assignments and writing."),
            ("puzzle", "Simulations", "Develop critical thinking using realistic simulations."), ("map", "Mind maps", "Turn understanding into live mind maps you can edit, save and download."), ("pencil", "Exam preparation", "Auto-generate questions and get AI-assisted evaluation for mock tests."), ("spark", "AI study companion", "A personal learning assistant, available any time for questions and guidance.")], "g4", "rotate")}
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
      <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-ink" href="#demo:LearnX%20Evaluate">Get a free demo</a><button class="btn btn-soft" type="button" data-video="/videos/evaluate-highlight.mp4" id="demo-btn">Watch the 75-sec demo</button></div>
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

# ---------------- HEALTHX ----------------
hx = head("HealthX | AI-Powered Healthcare Insights | AIStudyTools",
          "HealthX helps people understand medical reports, symptoms and medicines, and prepare for doctor visits, with AI-powered health education.", "/healthx/") + header("healthx")
hx += hook("Medical reports, made easy to understand.", "healthx-explainer", "HealthX explainer video: a confusing medical report explained in plain language, with AI health chat and doctor visit preparation")
hx += hero("AI-powered health information", 'Understand your health with <span class="hl">confidence</span>.',
           "Upload medical reports, explore health insights, understand symptoms and prepare for more informed conversations with healthcare professionals.",
           [("Get a free demo", "#demo:HealthX", "btn-ink"), ("Watch the 40-sec video", "#hook", "btn-soft")],
           mindmap("Your report", ["Plain-language summary", "AI health chat", "Symptom insights", "Medication insights", "Visit preparation"], "A medical report becomes a plain-language summary, AI chat, symptom and medication insights and visit preparation"), "sky")
hx += f'''<section class="white"><div class="wrap">{stats([("50K+", "Health queries"), ("15K+", "Reports analysed"), ("500+", "Medical topics"), ("24/7", "AI assistance")])}</div></section>
<section id="solutions">
  <div class="wrap">
    {sec_head("HealthX solutions", "Helping people better understand health information through AI-powered assistance.", "What you get")}
    {cards([("doc", "Medical report interpretation", "Upload blood tests, diagnostic reports and health documents for simplified explanations."), ("bot", "AI health assistant", "Ask questions about health, wellness, medical terminology and preventive care."), ("steth", "Symptom understanding", "Receive educational insights about symptoms and possible health considerations."),
            ("pill", "Medication insights", "Understand medicine usage, precautions and commonly reported effects."), ("clip", "Doctor visit preparation", "Prepare questions and organise information before medical appointments."), ("leaf", "Wellness &amp; prevention", "Information on nutrition, fitness, preventive healthcare and healthy living.")], "g3", "rotate")}
  </div>
</section>
<section class="white">
  <div class="wrap split">
    <div class="rv" style="display:flex;flex-direction:column;gap:18px"><span class="tag sky">Why HealthX</span><h2>Health information that makes sense</h2><p class="lead">Clear explanations help people ask better questions and get more from every consultation.</p></div>
    <div class="rv">{checks(["Simplified medical language", "Better health awareness", "Faster information access", "Improved consultation readiness", "Personalised health education", "Wellness guidance", "AI-powered explanations", "Accessible any time"])}</div>
  </div>
</section>
<section style="padding-top:0;padding-bottom:0" class="white"><div class="wrap"><div class="note rv"><b>Important medical disclaimer.</b> HealthX provides educational information only and is not a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified healthcare provider with questions about a medical condition.</div></div></section>
'''
hx += cta("Take charge of your health journey", "Get AI-powered insights that help you understand your health and prepare for conversations with medical professionals.", "Get a free demo", "#demo:HealthX")
hx += FOOT
write("/healthx/", hx)

# ---------------- SKILLX ----------------
sx = head("SkillX | AI-Powered Training & Simulations | AIStudyTools",
          "SkillX builds real-world skills with AI simulations, role plays, interview practice and leadership, sales and customer service training.", "/skillx/") + header("skillx")
sx += hook("Training people remember. Watch how.", "skillx-explainer", "SkillX explainer video: slide-based training turned into AI role plays, branching simulations and instant skills feedback")
sx += hero("AI-powered workforce development", 'Train for <span class="hl">real-world</span> success.',
           "Simulations, interactive learning, leadership journeys, interview practice and AI role plays that turn knowledge into performance.",
           [("Get a free demo", "#demo:SkillX", "btn-ink"), ("Watch the 40-sec video", "#hook", "btn-soft")],
           mindmap("Your team", ["AI role plays", "Simulations", "Interview practice", "Leadership journeys", "Sales &amp; service drills".replace("&amp;", "&")], "A team practises through AI role plays, simulations, interview practice, leadership journeys and sales and service drills"))
sx += f'''<section class="white"><div class="wrap">{stats([("10,000+", "Simulations generated"), ("500+", "Training programmes"), ("50+", "Industry use cases"), ("95%", "Learner satisfaction")])}</div></section>
<section id="solutions">
  <div class="wrap">
    {sec_head("AI-powered training solutions", "Experiential learning designed to build real-world skills, confidence and performance.", "What you get")}
    {cards([("puzzle", "AI simulations", "Realistic workplace scenarios to practise decision-making without risk."), ("play", "Interactive learning videos", "Turn static content into journeys with branching scenarios and assessments."), ("chat", "AI role plays", "Practise conversations with AI characters for sales, leadership, interviews and service."), ("crown", "Leadership development", "Build future leaders through strategic decision-making simulations and coaching."),
            ("trend", "Sales excellence", "Improve prospecting, negotiation, objection handling and customer engagement."), ("headset", "Customer service", "Build communication, empathy, problem-solving and complaint resolution."), ("users", "AI interview simulator", "Prepare for technical, HR and behavioural interviews with instant feedback."), ("shield", "Compliance &amp; ethics", "Engaging compliance education using realistic workplace scenarios.")], "g4", "rotate")}
  </div>
</section>
<section class="white">
  <div class="wrap split">
    <div class="rv" style="display:flex;flex-direction:column;gap:18px"><span class="tag">Why SkillX</span><h2>Why organisations choose SkillX</h2><p class="lead">Performance analytics, competency gap analysis, personalised learning paths and training effectiveness metrics, in one place.</p></div>
    <div class="rv">{checks(["Higher learner engagement", "Better knowledge retention", "Faster skill development", "Measurable learning outcomes", "Performance analytics", "Competency gap analysis", "Personalised learning paths", "Training effectiveness metrics"])}</div>
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("Industries we serve", "", "Who it's for")}
    {cards([("brief", "Corporate learning", "Upskill employees and accelerate workforce readiness."), ("school", "Universities &amp; colleges", "Prepare students for workplace success through experiential learning."), ("steth", "Healthcare training", "Train healthcare professionals using realistic simulations."),
            ("gov", "Government organisations", "Enhance workforce capability and compliance readiness."), ("building", "Consulting &amp; training firms", "Deliver scalable AI-powered learning experiences."), ("spark", "Professional development", "Develop future-ready skills through AI-guided practice.")], "g3", "rotate")}
  </div>
</section>
'''
sx += cta("Learn by doing. Grow by experiencing.", "Empower employees, students and future leaders through AI-powered simulations, interactive journeys and real-world practice.", "Get a free demo", "#demo:SkillX")
sx += FOOT
write("/skillx/", sx)

# ---------------- WEBINARS ----------------
wb = head("Live Expert-Led Webinars | AIStudyTools",
          "Learn directly from international experts in live webinars on research, doctoral studies and career growth.", "/webinars/") + header("webinars")
wb += hero("LearnX webinars", 'Live, <span class="hl">expert-led</span> webinars.',
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
ct = head("Contact | Book a Consultation | AIStudyTools",
          "Book a demo of LearnX, HealthX or SkillX, or contact AIStudyTools by email or WhatsApp.", "/contact/") + header("contact")
ct += f'''<section class="hero" style="padding-bottom:24px">
  <div class="wrap" style="display:block;text-align:center;max-width:760px">
    <span class="tag">Let's talk</span>
    <h1 style="margin-top:16px">Book a consultation or ask us <span class="hl" style="color:var(--accent)">anything</span>.</h1>
    <p class="lead" style="margin-top:16px">Tell us about your goals and our team will get back to you within one business day.</p>
  </div>
</section>
<section style="padding-top:24px">
  <div class="wrap" style="max-width:880px;display:grid;grid-template-columns:minmax(0,1fr);gap:20px">
    <div class="grid g2">
      <a class="ccard rv" href="mailto:intelliqueresearchschool@gmail.com"><span class="ico i-indigo">{I["mail"]}</span><span><b>Email</b><small>We reply within one business day.</small><span class="v">intelliqueresearchschool@gmail.com</span></span></a>
      <a class="ccard rv" href="https://wa.me/917303559258?text=Hi%20AIStudyTools%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener"><span class="ico i-mint">{I["phone"]}</span><span><b>Call / WhatsApp</b><small>Send a quick message.</small><span class="v">+91 73035 59258</span></span></a>
    </div>
    <form class="form rv" id="contact-form" novalidate>
      <h2 id="form-title" style="font-size:28px">Send us a message</h2>
      <div class="row2">
        <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="row2">
        <div class="field"><label for="f-org">Organisation</label><input id="f-org" name="org" autocomplete="organization"></div>
        <div class="field"><label for="f-product">Interested in</label><select id="f-product" name="product"><option>LearnX — Learning &amp; Research</option><option>HealthX — Healthcare Insights</option><option>SkillX — Training &amp; Simulations</option><option>All of the above</option><option>Webinars</option></select></div>
      </div>
      <div class="field"><label for="f-msg">How can we help?</label><textarea id="f-msg" name="message"></textarea></div>
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><button class="btn btn-accent" type="submit">Book consultation</button><p class="status" role="status" aria-live="polite"></p></div>
    </form>
  </div>
</section>
''' + FOOT
write("/contact/", ct)

# ---------------- 404 ----------------
nf = head("Page not found | AIStudyTools", "The page you are looking for could not be found.", "/404.html") + header("")
nf += f'''<section class="hero"><div class="wrap" style="display:block;text-align:center;max-width:680px">
  <span class="tag">404</span><h1 style="margin-top:16px">This page wandered off.</h1>
  <p class="lead" style="margin-top:16px">The link may be old or mistyped. Try one of these instead.</p>
  <div class="hero-btns" style="justify-content:center;margin-top:24px"><a class="btn btn-ink" href="/">Go home</a><a class="btn btn-soft" href="/journals/">Journal Finder</a><a class="btn btn-soft" href="/contact/">Contact us</a></div>
</div></section>
''' + FOOT
write("/404.html", nf)
print("built", sorted(os.path.relpath(os.path.join(d, f), OUT) for d, _, fs in os.walk(OUT) for f in fs))
