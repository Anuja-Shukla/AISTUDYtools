/* Product Management course: app (hash router, views, quiz, toolkit, PPTX export) */
(function () {
  "use strict";
  var M = PM.modules, app = document.getElementById("app");
  var KEY = "pm_course_v1", RKEY = "pm_rice_v1";
  var PPTX_URLS = ["https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js", "https://unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"];

  /* ---------- state ---------- */
  var st;
  function load() { try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { st = {}; } st.done = st.done || {}; st.kc = st.kc || {}; st.quiz = st.quiz || null; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  load();

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function list(a) { return '<ul class="clean">' + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
  function mod(n) { return M[n - 1]; }
  function doneCount() { return M.filter(function (m) { return st.done[m.n]; }).length; }
  function progressPct() { return Math.round((doneCount() + (st.quiz ? 1 : 0)) / (M.length + 1) * 100); }
  function slugTerm(t) { return encodeURIComponent(t); }
  function tplById(id) { for (var i = 0; i < PM.templates.length; i++) if (PM.templates[i].id === id) return PM.templates[i]; return null; }
  var TOOL_NAMES = { rice: "RICE calculator" };
  function toolName(id) { return TOOL_NAMES[id] || (tplById(id) ? tplById(id).t : id); }

  /* ---------- HOME ---------- */
  var chIdx = 0;
  function viewHome() {
    var p = progressPct();
    var h = '<section class="hero"><div><span class="tag" style="background:rgba(20,184,166,.18);color:#5EEAD4">Free course for MBA/PGDM students</span>' +
      '<h1 style="margin-top:12px">Product Management</h1><p class="lead">Discover, Build, and Grow Products Customers Love</p>' +
      '<p class="body">Product managers decide what to build, for whom and why, and then make sure it works for customers and the business. From UPI payment apps and quick-commerce to SaaS tools sold worldwide, Indian and global companies rely on PMs to turn customer insight into products that grow. This course takes you from the foundations of the role to discovery, strategy, delivery and growth, with tools you can use straight away.</p>' +
      '<div class="row" style="margin-top:20px"><a class="btn btn-teal" href="#/module/' + nextModule() + '">' + (doneCount() ? "Continue: Module " + nextModule() : "Start Module 1") + '</a><a class="btn btn-soft" href="#/syllabus">View syllabus</a></div></div>' +
      '<div style="text-align:center"><div class="ring" style="--p:' + p + '%"><span>' + p + '%<small>course progress</small></span></div><p class="small" style="color:#C9D6EA;margin-top:10px">' + doneCount() + " of 5 modules complete · practice quiz " + (st.quiz ? "taken (best " + st.quiz.best + "%)" : "not yet taken") + "</p></div></section>";
    h += '<div class="grid g3 quick" style="margin-top:18px">' + [["▶", "Presentations", "#/presentations"], ["⚙", "Product Toolkit", "#/toolkit"], ["✎", "Practice Quiz", "#/quiz"], ["A", "Glossary", "#/glossary"], ["◆", "Case Studies", "#/cases"], ["☰", "Course Syllabus", "#/syllabus"]].map(function (q) { return '<a href="' + q[2] + '"><b>' + q[0] + "</b>" + q[1] + "</a>"; }).join("") + "</div>";
    h += '<div class="sec"><h2>The five modules</h2><div class="grid g3">' + M.map(moduleCard).join("") + "</div></div>";
    var c = PM.challenges[chIdx % PM.challenges.length];
    h += '<div class="sec card" id="challenge"><div class="row between"><span class="tag amber">Product Challenge</span><button class="btn btn-line btn-sm" id="chNext">Another challenge</button></div>' +
      '<h3 style="margin-top:10px">' + c.q + '</h3><p class="muted small" style="margin-top:6px">Think about your answer first, then reveal a suggested approach.</p>' +
      '<button class="btn btn-teal btn-sm" id="chShow" style="margin-top:12px" aria-expanded="false">Reveal suggested approach</button><div id="chAns" class="info" style="margin-top:12px;display:none">' + c.a + "</div></div>";
    return { html: h, after: function () {
      document.getElementById("chShow").onclick = function () { var a = document.getElementById("chAns"), o = a.style.display === "none"; a.style.display = o ? "" : "none"; this.textContent = o ? "Hide suggested approach" : "Reveal suggested approach"; this.setAttribute("aria-expanded", o); };
      document.getElementById("chNext").onclick = function () { chIdx++; render(); document.getElementById("challenge").scrollIntoView(); };
    } };
  }
  function nextModule() { for (var i = 0; i < M.length; i++) if (!st.done[M[i].n]) return M[i].n; return 1; }
  function moduleCard(m) {
    return '<div class="card mcard" style="--c:' + m.color + '"><span class="num">Module ' + m.n + "</span><h3>" + m.title + '</h3><p class="small muted">' + m.short + "</p>" +
      "<ul>" + m.outcomes.slice(0, 3).map(function (o) { return "<li>" + o + "</li>"; }).join("") + "</ul>" +
      '<div class="row between"><a class="btn btn-navy btn-sm" href="#/module/' + m.n + '">Open module</a>' + (st.done[m.n] ? '<span class="done-badge">✓ Completed</span>' : "") + "</div></div>";
  }

  /* ---------- SYLLABUS ---------- */
  function viewSyllabus() {
    var h = '<span class="tag">Course syllabus</span><h1 style="margin-top:10px">Product Management: syllabus</h1>' +
      '<p class="muted" style="margin-top:10px;max-width:820px">Five modules for MBA/PGDM students, covering digital (software and app) products and physical or service products. Each module combines concepts, Indian and global product examples, a classroom activity and a knowledge check.</p>' +
      '<div class="card sec"><h3>Suggested assessment plan</h3><div class="tscroll" style="margin-top:10px"><table><tr><th>Component</th><th>Linked to</th><th>Suggested weight</th></tr>' +
      "<tr><td>Module activities (teardown, interview sprint, roadmap, PRD, launch plan)</td><td>Modules 1–5</td><td>40%</td></tr>" +
      "<tr><td>Case discussions and class participation</td><td>Case studies</td><td>20%</td></tr>" +
      "<tr><td>End-term product project (discovery to launch plan for one product)</td><td>All modules</td><td>40%</td></tr></table></div>" +
      '<p class="small muted" style="margin-top:8px">Weights are a suggestion for instructors and can be adapted. The practice quiz in this portal is for self-assessment.</p></div>';
    M.forEach(function (m) {
      h += '<div class="card sec" style="border-left:6px solid ' + m.color + '"><div class="row between"><h2 style="font-size:24px">Module ' + m.n + ": " + m.title + '</h2><a class="btn btn-soft btn-sm" href="#/module/' + m.n + '">Open module</a></div>' +
        '<p class="muted" style="margin-top:8px">' + m.short + "</p>" +
        '<div class="grid g2" style="margin-top:14px"><div><h4>Topics and subtopics</h4><ul class="clean small" style="margin-top:6px">' + m.topics.map(function (t) { return "<li><b>" + t.t + "</b>: " + t.s.join("; ") + "</li>"; }).join("") + "</ul></div>" +
        "<div><h4>Learning outcomes</h4>" + '<div class="small" style="margin-top:6px">' + list(m.outcomes) + "</div>" +
        '<h4 style="margin-top:12px">Practical application</h4><p class="small" style="margin-top:4px">' + m.practical + "</p>" +
        '<h4 style="margin-top:12px">Suggested assessment</h4><p class="small" style="margin-top:4px">' + m.assessment + "</p></div></div></div>";
    });
    return h;
  }

  /* ---------- MODULES LIST ---------- */
  function viewModules() {
    return '<span class="tag">Learning modules</span><h1 style="margin-top:10px">Learning modules</h1><p class="muted" style="margin:10px 0 20px">Work through the modules in order or jump to the one you need. Each has lecture notes, examples, an activity, a PowerPoint and a knowledge check.</p>' +
      '<div class="bar" style="max-width:420px"><i style="width:' + (doneCount() / 5 * 100) + '%"></i></div><p class="small muted" style="margin:6px 0 20px">' + doneCount() + " of 5 modules completed</p>" +
      '<div class="grid g3">' + M.map(moduleCard).join("") + "</div>";
  }

  /* ---------- MODULE PAGE ---------- */
  function viewModule(n) {
    var m = mod(n); if (!m) return viewNotFound();
    var h = '<div class="crumb"><a href="#/modules">Modules</a> › Module ' + m.n + "</div>" +
      '<section class="mhead" style="--c:' + m.color + '"><span class="tag" style="background:rgba(255,255,255,.12);color:#fff">Module ' + m.n + " of 5</span><h1 style=\"margin-top:10px\">" + m.title + "</h1><p>" + m.overview + "</p>" +
      '<div class="toc">' + [["outcomes", "Learning outcomes"], ["syllabus", "Syllabus"], ["notes", "Lecture notes"], ["examples", "Examples"], ["activity", "Activity"], ["ppt", "PowerPoint"], ["check", "Knowledge check"], ["links", "Glossary and tools"]].map(function (t) { return '<a href="#m' + m.n + "-" + t[0] + '" data-jump="m' + m.n + "-" + t[0] + '">' + t[1] + "</a>"; }).join("") + "</div></section>";
    h += '<div class="grid g2 sec"><div class="card" id="m' + m.n + '-outcomes"><h3>Learning outcomes</h3><p class="small muted" style="margin:4px 0 8px">By the end of this module you should be able to:</p>' + list(m.outcomes) + "</div>" +
      '<div class="card" id="m' + m.n + '-syllabus"><h3>Syllabus and key concepts</h3><ul class="clean small" style="margin-top:8px">' + m.topics.map(function (t) { return "<li><b>" + t.t + "</b>: " + t.s.join("; ") + "</li>"; }).join("") + "</ul></div></div>";
    h += '<div class="sec" id="m' + m.n + '-notes"><div class="row between" style="margin-bottom:12px"><h2>Lecture notes</h2><button class="btn btn-line btn-sm" id="expandAll">Expand all</button></div>' +
      m.notes.map(function (x, i) { return '<details class="acc"' + (i === 0 ? " open" : "") + "><summary>" + (i + 1) + ". " + x.h + '</summary><div class="in">' + x.p + "</div></details>"; }).join("") + "</div>";
    h += '<div class="sec" id="m' + m.n + '-examples"><h2>Product examples and mini-cases</h2><div class="grid g' + (m.examples.length > 2 ? 3 : 2) + '">' + m.examples.map(function (e) { return '<div class="card"><h4>' + e.t + '</h4><p class="small" style="margin-top:6px">' + e.p + "</p></div>"; }).join("") + '</div><p class="tiny muted" style="margin-top:8px">Examples marked "illustrative" are teaching scenarios, not reported company data.</p></div>';
    h += '<div class="sec card" id="m' + m.n + '-activity" style="border-left:6px solid ' + m.color + '"><span class="tag amber">Classroom activity</span><h3 style="margin-top:8px">' + m.activity.t + '</h3><ol style="margin:10px 0 0;padding-left:20px">' + m.activity.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + '</ol><p class="small" style="margin-top:10px"><b>Deliverable:</b> ' + m.activity.deliverable + "</p></div>";
    h += '<div class="sec card" id="m' + m.n + '-ppt"><div class="row between"><div><h3>Module ' + m.n + ' PowerPoint</h3><p class="small muted" style="margin-top:4px">' + PM.decks[m.n].length + " editable slides with speaker notes, generated in your browser.</p></div>" +
      '<div class="row"><a class="btn btn-line btn-sm" href="#/presentations">Preview slide outline</a><button class="btn btn-teal" data-ppt="' + m.n + '">Download PowerPoint</button></div></div><p class="small" data-pptmsg="' + m.n + '" style="margin-top:8px" aria-live="polite"></p></div>';
    h += '<div class="sec" id="m' + m.n + '-check"><h2>Knowledge check</h2><p class="muted small" style="margin:4px 0 12px">Answer all three questions. You will see an explanation after each answer.</p><div class="stack" id="kc">' + kcBlock(m) + "</div></div>";
    h += '<div class="sec grid g2" id="m' + m.n + '-links"><div class="card"><h3>Glossary terms</h3><div class="chips" style="margin-top:10px">' + m.glossary.map(function (t) { return '<a class="chip" href="#/glossary/' + slugTerm(t) + '">' + t + "</a>"; }).join("") + "</div></div>" +
      '<div class="card"><h3>Product Toolkit</h3><div class="chips" style="margin-top:10px">' + m.tools.map(function (t) { return '<a class="chip" href="#/toolkit/' + t + '">' + toolName(t) + "</a>"; }).join("") + "</div></div></div>";
    h += '<div class="sec card" id="donebox"></div>';
    var prev = mod(n - 1), next = mod(n + 1);
    h += '<div class="row between sec">' + (prev ? '<a class="btn btn-line" href="#/module/' + prev.n + '">← Module ' + prev.n + "</a>" : "<span></span>") + (next ? '<a class="btn btn-navy" href="#/module/' + next.n + '">Module ' + next.n + " →</a>" : '<a class="btn btn-navy" href="#/quiz">Practice quiz →</a>') + "</div>";
    return { html: h, after: function () {
      wirePpt();
      document.getElementById("expandAll").onclick = function () { var ds = document.querySelectorAll("details.acc"), open = this.textContent === "Expand all"; ds.forEach(function (d) { d.open = open; }); this.textContent = open ? "Collapse all" : "Expand all"; };
      document.getElementById("kc").addEventListener("click", function (e) {
        var b = e.target.closest(".opt"); if (!b || b.disabled) return;
        var qi = +b.closest(".q").getAttribute("data-q"); st.kc[m.n + ":" + qi] = +b.getAttribute("data-o"); save();
        document.getElementById("kc").innerHTML = kcBlock(m); doneBox(m);
      });
      doneBox(m);
    } };
  }
  /* fixed (seeded) option order so the correct answer is not always first */
  function fixedPerm(seed) { var a = [0, 1, 2, 3], x = seed * 9301 + 49297; for (var i = 3; i > 0; i--) { x = (x * 9301 + 49297) % 233280; var j = Math.floor(x / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function kcBlock(m) {
    return m.check.map(function (q, qi) {
      var ans = st.kc[m.n + ":" + qi];
      return '<div class="q" data-q="' + qi + '"><b>' + (qi + 1) + ". " + q.q + '</b><div class="opts">' + fixedPerm(m.n * 7 + qi * 3 + 1).map(function (oi, pos) {
        var cls = ans === undefined ? "" : (oi === q.a ? "ok" : (oi === ans ? "bad" : ""));
        return '<button class="opt ' + cls + '" data-o="' + oi + '"' + (ans !== undefined ? " disabled" : "") + '><span class="k">' + "ABCD"[pos] + ".</span><span>" + q.o[oi] + "</span></button>";
      }).join("") + "</div>" + (ans !== undefined ? '<div class="expl">' + (ans === q.a ? "✅ Correct. " : "Not quite. ") + q.e + "</div>" : "") + "</div>";
    }).join("");
  }
  function doneBox(m) {
    var box = document.getElementById("donebox"); if (!box) return;
    var answered = m.check.filter(function (q, qi) { return st.kc[m.n + ":" + qi] !== undefined; }).length;
    var correct = m.check.filter(function (q, qi) { return st.kc[m.n + ":" + qi] === q.a; }).length;
    if (st.done[m.n]) { box.innerHTML = '<div class="row between"><div><span class="done-badge">✓ Module completed</span> <span class="small muted">Knowledge check: ' + correct + " of 3 correct.</span></div>" + '<button class="btn btn-line btn-sm" id="redoKc">Retry knowledge check</button></div>';
      document.getElementById("redoKc").onclick = function () { m.check.forEach(function (q, qi) { delete st.kc[m.n + ":" + qi]; }); save(); document.getElementById("kc").innerHTML = kcBlock(m); doneBox(m); document.getElementById("m" + m.n + "-check").scrollIntoView(); };
      return; }
    box.innerHTML = '<div class="row between"><div><h3>Finish this module</h3><p class="small muted" style="margin-top:4px">' + (answered < 3 ? "Answer the knowledge check (" + answered + " of 3 answered) to mark this module complete." : "You got " + correct + " of 3 right. Review the notes for any you missed, then mark the module complete.") + "</p></div>" +
      '<button class="btn btn-teal" id="markDone"' + (answered < 3 ? " disabled" : "") + ">Mark module complete</button></div>";
    var mk = document.getElementById("markDone"); if (mk) mk.onclick = function () { st.done[m.n] = true; save(); doneBox(m); };
  }

  /* ---------- PRESENTATIONS ---------- */
  var KIND = { title: "Title", bullets: "Concepts", two: "Comparison", diagram: "Framework", "case": "Product case", activity: "Activity", recap: "Recap and discussion" };
  function viewPresentations() {
    var h = '<span class="tag">Presentations</span><h1 style="margin-top:10px">Module presentations</h1><p class="muted" style="margin:10px 0 6px;max-width:820px">Five classroom-ready PowerPoint decks, one per module, with editable text and shapes, framework diagrams and speaker notes. Each file is generated in your browser when you click Download, so it always matches the course content.</p>' +
      '<p class="small note" style="margin:12px 0 20px">Examples marked "illustrative" in the decks are teaching scenarios. If the download does not start (for example on a restricted network), use the slide outline below or print this page.</p><div class="stack">';
    M.forEach(function (m) {
      var d = PM.decks[m.n];
      h += '<div class="card" style="border-left:6px solid ' + m.color + '"><div class="row between"><div><span class="num tiny" style="font-weight:800;color:' + m.color + '">MODULE ' + m.n + "</span><h3>" + m.title + '</h3><p class="small muted">' + d.length + ' slides · speaker notes included</p></div><div class="row"><button class="btn btn-line btn-sm" data-outline="' + m.n + '" aria-expanded="false">Show slide outline</button><button class="btn btn-teal" data-ppt="' + m.n + '">Download PowerPoint</button></div></div>' +
        '<p class="small" data-pptmsg="' + m.n + '" style="margin-top:8px" aria-live="polite"></p><div class="slides" id="ol' + m.n + '" hidden>' + d.map(function (s, i) {
          var items = s.k === "two" ? [s.l[0] + ": " + s.l.slice(1).join("; "), s.r[0] + ": " + s.r.slice(1).join("; ")] : (s.k === "diagram" && s.d === "rice" ? s.b.map(function (r) { return r.split("|")[0]; }) : (s.b || (s.s ? [s.s] : [])));
          return '<div class="slide"><span class="kind">' + (KIND[s.k] || "") + "</span><b>" + (i + 1) + ". " + s.t + "</b>" + (items.length ? '<ul class="clean" style="margin-top:4px">' + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") + (s.n ? '<p class="tiny muted" style="margin-top:4px"><i>Notes:</i> ' + esc(s.n) + "</p>" : "") + "</div>";
        }).join("") + "</div></div>";
    });
    h += "</div>";
    return { html: h, after: function () {
      wirePpt();
      document.querySelectorAll("[data-outline]").forEach(function (b) { b.onclick = function () { var el = document.getElementById("ol" + b.getAttribute("data-outline")); el.hidden = !el.hidden; b.textContent = el.hidden ? "Show slide outline" : "Hide slide outline"; b.setAttribute("aria-expanded", !el.hidden); }; });
    } };
  }

  /* ---------- PPTX generation ---------- */
  var pptxLoading = null;
  function loadPptx() {
    if (window.PptxGenJS) return Promise.resolve();
    if (pptxLoading) return pptxLoading;
    pptxLoading = new Promise(function (res, rej) {
      var k = 0;
      (function next() {
        if (k >= PPTX_URLS.length) { pptxLoading = null; rej(new Error("blocked")); return; }
        var s = document.createElement("script"); s.src = PPTX_URLS[k++]; s.async = true;
        s.onload = function () { if (window.PptxGenJS) res(); else next(); };
        s.onerror = next;
        document.head.appendChild(s);
      })();
    });
    return pptxLoading;
  }
  function wirePpt() {
    document.querySelectorAll("[data-ppt]").forEach(function (b) {
      b.onclick = function () {
        var n = +b.getAttribute("data-ppt"), msg = document.querySelector('[data-pptmsg="' + n + '"]');
        b.disabled = true; var old = b.textContent; b.textContent = "Preparing…"; if (msg) { msg.className = "small"; msg.textContent = ""; }
        loadPptx().then(function () { return buildDeck(n); }).then(function (fn) {
          if (msg) { msg.className = "small copied"; msg.textContent = "Downloaded " + fn + ". Check your downloads folder."; }
        }).catch(function () {
          if (msg) { msg.className = "small note"; msg.textContent = "The PowerPoint tool could not load on this network, so no file was created. Use 'Show slide outline' on the Presentations page and print it, or try again on another connection."; }
        }).then(function () { b.disabled = false; b.textContent = old; });
      };
    });
  }
  var C = { navy: "0B1F3A", navy2: "15315A", teal: "0F766E", teal2: "14B8A6", soft: "E6F6F4", ink: "0F1E33", muted: "4A5873", line: "CBD5E1", amber: "FEF3C7", white: "FFFFFF" };
  var FONT = "Calibri";
  function buildDeck(n) {
    var m = mod(n), deck = PM.decks[n], pptx = new window.PptxGenJS();
    pptx.layout = "LAYOUT_WIDE"; pptx.author = "AIStudyTools"; pptx.company = "AIStudyTools"; pptx.title = "Module " + n + ": " + m.title;
    var accent = m.color.replace("#", "");
    deck.forEach(function (s, i) {
      var sl = pptx.addSlide();
      if (s.k === "title") {
        sl.background = { color: C.navy };
        sl.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: accent }, line: { color: accent } });
        sl.addText("MODULE " + n, { x: 0.9, y: 1.6, w: 11, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: C.teal2, charSpacing: 4 });
        sl.addText(s.t, { x: 0.9, y: 2.15, w: 11.5, h: 1.8, fontFace: FONT, fontSize: 44, bold: true, color: C.white, valign: "top" });
        sl.addText(s.s, { x: 0.9, y: 4.2, w: 11, h: 0.6, fontFace: FONT, fontSize: 20, color: "C9D6EA" });
        sl.addText("Product Management · Discover, Build, and Grow Products Customers Love", { x: 0.9, y: 6.5, w: 11.5, h: 0.4, fontFace: FONT, fontSize: 12, color: "A9B8D0" });
      } else {
        sl.background = { color: C.white };
        sl.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.12, fill: { color: accent }, line: { color: accent } });
        sl.addText(s.t, { x: 0.6, y: 0.35, w: 12.1, h: 0.85, fontFace: FONT, fontSize: 30, bold: true, color: C.navy, valign: "middle" });
        sl.addShape(pptx.ShapeType.line, { x: 0.6, y: 1.25, w: 1.4, h: 0, line: { color: C.teal2, width: 3 } });
        sl.addText("Product Management · Module " + n + "  |  " + (i + 1), { x: 0.6, y: 7.0, w: 12.1, h: 0.3, fontFace: FONT, fontSize: 10, color: "8A97AD", align: "right" });
        if (s.k === "bullets" || s.k === "recap") bulletsSlide(sl, s);
        else if (s.k === "two") twoSlide(pptx, sl, s, accent);
        else if (s.k === "case" || s.k === "activity") boxSlide(pptx, sl, s, accent);
        else if (s.k === "diagram") diagramSlide(pptx, sl, s, accent);
      }
      if (s.n) sl.addNotes(s.n);
    });
    var fn = "PM-Module-" + n + "-" + m.slug + ".pptx";
    return pptx.writeFile({ fileName: fn }).then(function () { return fn; });
  }
  function bullets(arr) { return arr.map(function (b) { return { text: b, options: { bullet: { code: "25A0" }, paraSpaceAfter: 10 } }; }); }
  function bulletsSlide(sl, s) {
    sl.addText(bullets(s.b), { x: 0.8, y: 1.55, w: 11.7, h: 5.2, fontFace: FONT, fontSize: 22, color: C.ink, valign: "top" });
  }
  function twoSlide(pptx, sl, s, accent) {
    [s.l, s.r].forEach(function (col, j) {
      var x = 0.6 + j * 6.2;
      sl.addShape(pptx.ShapeType.roundRect, { x: x, y: 1.6, w: 5.9, h: 5.1, fill: { color: j ? C.soft : "F1F5FA" }, line: { color: j ? C.teal2 : C.line, width: 1 }, rectRadius: 0.12 });
      sl.addText(col[0], { x: x + 0.3, y: 1.8, w: 5.3, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: j ? C.teal : C.navy });
      sl.addText(bullets(col.slice(1)), { x: x + 0.3, y: 2.5, w: 5.3, h: 4.0, fontFace: FONT, fontSize: 19, color: C.ink, valign: "top" });
    });
  }
  function boxSlide(pptx, sl, s, accent) {
    var lab = s.k === "case" ? "PRODUCT CASE" : "CLASS ACTIVITY";
    sl.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 1.55, w: 12.1, h: 5.2, fill: { color: s.k === "case" ? "F1F5FA" : C.amber }, line: { color: s.k === "case" ? C.line : "F59E0B", width: 1 }, rectRadius: 0.12 });
    sl.addText(lab, { x: 0.95, y: 1.75, w: 6, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: s.k === "case" ? C.teal : "92400E", charSpacing: 3 });
    var items = s.k === "activity" ? s.b.map(function (b, i) { return { text: (i + 1) + ".  " + b, options: { paraSpaceAfter: 10, breakLine: true } }; }) : bullets(s.b);
    sl.addText(items, { x: 0.95, y: 2.25, w: 11.4, h: 4.3, fontFace: FONT, fontSize: 21, color: C.ink, valign: "top" });
  }
  function box(pptx, sl, x, y, w, h, text, fill, color, size, bold) {
    sl.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: w, h: h, fill: { color: fill }, line: { color: fill === C.white ? C.line : fill, width: 1 }, rectRadius: 0.1 });
    sl.addText(text, { x: x + 0.08, y: y, w: w - 0.16, h: h, fontFace: FONT, fontSize: size || 16, bold: !!bold, color: color || C.ink, align: "center", valign: "middle" });
  }
  function line(pptx, sl, x1, y1, x2, y2, color, width) {
    var opts = { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001, line: { color: color || C.line, width: width || 1.5 } };
    if ((x2 < x1) !== (y2 < y1)) opts.flipH = true;
    sl.addShape(pptx.ShapeType.line, opts);
  }
  function diagramSlide(pptx, sl, s, accent) {
    var d = s.d, b = s.b;
    if (d === "venn") {
      var cs = [[4.0, 1.6, "1D4ED8"], [6.1, 1.6, C.teal], [5.05, 3.3, "DB2777"]];
      cs.forEach(function (c, i) { sl.addShape(pptx.ShapeType.ellipse, { x: c[0], y: c[1], w: 3.3, h: 3.3, fill: { color: c[2], transparency: 72 }, line: { color: c[2], width: 1.5 } }); });
      sl.addText(b[0], { x: 3.5, y: 2.2, w: 2.6, h: 0.6, fontFace: FONT, fontSize: 20, bold: true, color: "1D4ED8", align: "center" });
      sl.addText(b[1], { x: 7.2, y: 2.2, w: 2.6, h: 0.6, fontFace: FONT, fontSize: 20, bold: true, color: C.teal, align: "center" });
      sl.addText(b[2], { x: 4.9, y: 5.6, w: 3.6, h: 0.6, fontFace: FONT, fontSize: 20, bold: true, color: "DB2777", align: "center" });
      sl.addText("PM", { x: 6.0, y: 3.45, w: 1.4, h: 0.6, fontFace: FONT, fontSize: 24, bold: true, color: C.navy, align: "center" });
    } else if (d === "trio") {
      box(pptx, sl, 4.9, 3.0, 3.5, 1.3, "Customer problem and outcome", C.navy, C.white, 18, true);
      var pos = [[1.0, 1.7], [9.0, 1.7], [5.0, 5.3]];
      b.forEach(function (t, i) { box(pptx, sl, pos[i][0], pos[i][1], 3.3, 1.2, t, i === 0 ? C.soft : (i === 1 ? "EDE9FE" : C.amber), C.ink, 16, true); });
      line(pptx, sl, 4.3, 2.3, 4.9, 3.3, C.teal2, 2); line(pptx, sl, 9.0, 2.3, 8.4, 3.3, C.teal2, 2); line(pptx, sl, 6.65, 4.3, 6.65, 5.3, C.teal2, 2);
      sl.addText("Wider partners: marketing, sales, support, finance, leadership", { x: 0.6, y: 6.55, w: 12.1, h: 0.4, fontFace: FONT, fontSize: 14, italic: true, color: C.muted, align: "center" });
    } else if (d === "diamond") {
      [[1.4, "Problem space"], [7.0, "Solution space"]].forEach(function (dm, j) {
        sl.addShape(pptx.ShapeType.diamond, { x: dm[0], y: 1.8, w: 4.9, h: 3.6, fill: { color: j ? C.soft : "E0E7FF" }, line: { color: j ? C.teal2 : "6366F1", width: 1.5 } });
        sl.addText(dm[1], { x: dm[0], y: 3.25, w: 4.9, h: 0.6, fontFace: FONT, fontSize: 18, bold: true, color: C.navy, align: "center" });
        sl.addText(b[j * 2], { x: dm[0], y: 5.55, w: 2.45, h: 0.5, fontFace: FONT, fontSize: 17, bold: true, color: j ? C.teal : "4338CA", align: "center" });
        sl.addText(b[j * 2 + 1], { x: dm[0] + 2.45, y: 5.55, w: 2.45, h: 0.5, fontFace: FONT, fontSize: 17, bold: true, color: j ? C.teal : "4338CA", align: "center" });
      });
      sl.addText("Diverge → converge on the right problem, then diverge → converge on the right solution", { x: 0.6, y: 6.25, w: 12.1, h: 0.45, fontFace: FONT, fontSize: 15, italic: true, color: C.muted, align: "center" });
    } else if (d === "ost") {
      box(pptx, sl, 4.4, 1.5, 4.5, 0.85, b[0], C.navy, C.white, 16, true);
      box(pptx, sl, 1.2, 2.95, 4.6, 0.85, b[1], C.soft, C.ink, 15, true);
      box(pptx, sl, 7.5, 2.95, 4.6, 0.85, b[2], C.soft, C.ink, 15, true);
      box(pptx, sl, 0.6, 4.4, 3.0, 0.85, b[3], C.amber, C.ink, 14);
      box(pptx, sl, 3.8, 4.4, 3.0, 0.85, b[4], C.amber, C.ink, 14);
      box(pptx, sl, 0.6, 5.8, 3.0, 0.85, b[5], "EDE9FE", C.ink, 13);
      line(pptx, sl, 6.65, 2.35, 3.5, 2.95); line(pptx, sl, 6.65, 2.35, 9.8, 2.95);
      line(pptx, sl, 3.5, 3.8, 2.1, 4.4); line(pptx, sl, 3.5, 3.8, 5.3, 4.4); line(pptx, sl, 2.1, 5.25, 2.1, 5.8);
      [["Outcome", 1.65], ["Solutions", 4.55], ["Experiments", 5.95]].forEach(function (l) { sl.addText(l[0], { x: 9.9, y: l[1], w: 2.8, h: 0.5, fontFace: FONT, fontSize: 13, bold: true, color: C.muted, align: "right" }); });
      sl.addText("Opportunities", { x: 7.5, y: 3.85, w: 4.6, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: C.muted, align: "right" });
    } else if (d === "rice") {
      var rows = [[{ text: "Feature", options: { bold: true, color: C.white, fill: { color: C.navy } } }].concat(["Reach", "Impact", "Confidence", "Effort", "RICE score"].map(function (t) { return { text: t, options: { bold: true, color: C.white, fill: { color: C.navy }, align: "center" } }; }))];
      b.map(function (r) { var p = r.split("|"), sc = (+p[1]) * (+p[2]) * (+p[3] / 100) / (+p[4]); return { p: p, sc: sc }; }).sort(function (a, c) { return c.sc - a.sc; }).forEach(function (r, i) {
        var f = i === 0 ? { color: "ECFDF5" } : { color: C.white };
        rows.push([{ text: r.p[0], options: { fill: f } }, { text: Number(r.p[1]).toLocaleString("en-IN"), options: { align: "center", fill: f } }, { text: r.p[2], options: { align: "center", fill: f } }, { text: r.p[3] + "%", options: { align: "center", fill: f } }, { text: r.p[4], options: { align: "center", fill: f } }, { text: String(Math.round(r.sc)), options: { align: "center", bold: true, fill: f, color: C.teal } }]);
      });
      sl.addTable(rows, { x: 0.6, y: 1.6, w: 12.1, colW: [4.3, 1.6, 1.4, 1.7, 1.4, 1.7], fontFace: FONT, fontSize: 16, color: C.ink, border: { type: "solid", color: C.line, pt: 1 }, rowH: 0.6 });
      sl.addText("RICE = (Reach × Impact × Confidence) ÷ Effort    ·    Impact: 0.25 minimal, 0.5 low, 1 medium, 2 high, 3 massive    ·    Illustrative figures", { x: 0.6, y: 5.0, w: 12.1, h: 0.8, fontFace: FONT, fontSize: 14, color: C.muted });
    } else if (d === "kano") {
      var ox = 1.4, oy = 1.55, w = 7.6, h = 5.1, cx = ox + w / 2, cy = oy + h / 2;
      line(pptx, sl, ox, cy, ox + w, cy, C.muted, 1.5); line(pptx, sl, cx, oy, cx, oy + h, C.muted, 1.5);
      sl.addText("Customer satisfaction ↑", { x: cx - 3.0, y: oy - 0.15, w: 2.9, h: 0.4, fontFace: FONT, fontSize: 12, color: C.muted, align: "right" });
      sl.addText("Feature fully delivered →", { x: ox + w - 3.0, y: cy + 0.05, w: 3.0, h: 0.4, fontFace: FONT, fontSize: 12, color: C.muted, align: "right" });
      line(pptx, sl, ox + 0.3, oy + h - 0.3, ox + w - 0.3, oy + 0.3, "2563EB", 3);
      line(pptx, sl, ox + 0.3, oy + h - 0.2, cx - 0.4, cy + 0.9, "DC2626", 3); line(pptx, sl, cx - 0.4, cy + 0.9, ox + w - 0.3, cy + 0.6, "DC2626", 3);
      line(pptx, sl, ox + 0.3, cy - 0.05, cx + 0.6, cy - 0.5, "16A34A", 3); line(pptx, sl, cx + 0.6, cy - 0.5, ox + w - 0.3, oy + 0.15, "16A34A", 3);
      var leg = [["DC2626", b[0], "Expected; absence causes dissatisfaction, presence goes unnoticed"], ["2563EB", b[1], "Satisfaction rises with how well it is delivered"], ["16A34A", b[2], "Unexpected; creates delight, not missed if absent"]];
      leg.forEach(function (l, i) { sl.addShape(pptx.ShapeType.rect, { x: 9.5, y: 1.9 + i * 1.5, w: 0.3, h: 0.3, fill: { color: l[0] }, line: { color: l[0] } }); sl.addText(l[1], { x: 9.9, y: 1.78 + i * 1.5, w: 3.1, h: 0.5, fontFace: FONT, fontSize: 16, bold: true, color: C.navy }); sl.addText(l[2], { x: 9.9, y: 2.25 + i * 1.5, w: 3.1, h: 0.9, fontFace: FONT, fontSize: 12.5, color: C.muted, valign: "top" }); });
    } else if (d === "roadmap") {
      var cols = [["NOW", "Committed · high confidence", C.teal], ["NEXT", "Likely · being explored", "2563EB"], ["LATER", "Directional · low confidence", "7C3AED"]];
      cols.forEach(function (c, i) {
        var x = 0.6 + i * 4.1;
        sl.addShape(pptx.ShapeType.roundRect, { x: x, y: 1.6, w: 3.85, h: 5.1, fill: { color: "F8FAFC" }, line: { color: C.line }, rectRadius: 0.1 });
        sl.addShape(pptx.ShapeType.rect, { x: x, y: 1.6, w: 3.85, h: 0.75, fill: { color: c[2] }, line: { color: c[2] } });
        sl.addText(c[0], { x: x, y: 1.6, w: 3.85, h: 0.75, fontFace: FONT, fontSize: 20, bold: true, color: C.white, align: "center", valign: "middle" });
        sl.addText(c[1], { x: x, y: 2.45, w: 3.85, h: 0.4, fontFace: FONT, fontSize: 12.5, italic: true, color: C.muted, align: "center" });
        var items = (b[i] || "").split(":").slice(1).join(":").split(";");
        items.forEach(function (it, k) { if (it.trim()) box(pptx, sl, x + 0.3, 3.05 + k * 1.05, 3.25, 0.85, it.trim(), C.white, C.ink, 15); });
      });
    } else if (d === "funnel") {
      var colors = ["1D4ED8", "0F766E", "7C3AED", "DB2777", "EA580C"], desc = ["Users arrive", "First 'aha' moment", "They come back", "They bring others", "They pay"];
      b.forEach(function (t, i) {
        var w2 = 8.6 - i * 1.3, x = 0.9 + (8.6 - w2) / 2;
        sl.addShape(pptx.ShapeType.rect, { x: x, y: 1.6 + i * 1.0, w: w2, h: 0.85, fill: { color: colors[i] }, line: { color: colors[i] } });
        sl.addText(t, { x: x, y: 1.6 + i * 1.0, w: w2, h: 0.85, fontFace: FONT, fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle" });
        sl.addText(desc[i], { x: 9.9, y: 1.6 + i * 1.0, w: 3.0, h: 0.85, fontFace: FONT, fontSize: 15, color: C.muted, valign: "middle" });
      });
    } else if (d === "retention") {
      var labels = ["Day 0", "Day 1", "Day 7", "Day 14", "Day 30", "Day 60", "Day 90"];
      sl.addChart(pptx.ChartType.line, [{ name: "Flattening (healthy)", labels: labels, values: [100, 55, 38, 33, 30, 29, 28] }, { name: "Declining to zero (weak fit)", labels: labels, values: [100, 40, 18, 10, 5, 2, 1] }],
        { x: 0.6, y: 1.5, w: 8.2, h: 5.2, chartColors: [C.teal, "DC2626"], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 7, showLegend: true, legendPos: "b", legendFontSize: 13, valAxisMaxVal: 100, valAxisMinVal: 0, valAxisLabelFontSize: 12, catAxisLabelFontSize: 12, valAxisTitle: "% of cohort active", showValAxisTitle: true, valAxisTitleFontSize: 12 });
      sl.addText(bullets(b.concat(["Illustrative curves, not real data"])), { x: 9.1, y: 1.8, w: 3.7, h: 4.5, fontFace: FONT, fontSize: 16, color: C.ink, valign: "top" });
    } else if (d === "lifecycle") {
      var lab2 = ["", "", "", "", "", "", "", "", "", ""];
      sl.addChart(pptx.ChartType.line, [{ name: "Sales (illustrative)", labels: lab2, values: [3, 6, 14, 30, 52, 68, 74, 72, 60, 42] }],
        { x: 0.6, y: 1.5, w: 12.1, h: 4.4, chartColors: [accent], lineSize: 4, lineSmooth: true, lineDataSymbol: "none", showLegend: false, valAxisHidden: true, catAxisHidden: true, valGridLine: { style: "none" } });
      b.forEach(function (t, i) { sl.addText(t, { x: 0.9 + i * 2.95, y: 6.0, w: 2.9, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: C.navy, align: "center" }); });
      sl.addText("Find fit  ·  Scale  ·  Optimise and retain  ·  Harvest or retire", { x: 0.6, y: 6.45, w: 12.1, h: 0.4, fontFace: FONT, fontSize: 13, italic: true, color: C.muted, align: "center" });
    }
  }

  /* ---------- TOOLKIT ---------- */
  var rice;
  function loadRice() { try { rice = JSON.parse(localStorage.getItem(RKEY)); } catch (e) { rice = null; } if (!Array.isArray(rice)) rice = PM.riceSample.map(function (r) { return Object.assign({}, r); }); }
  function saveRice() { try { localStorage.setItem(RKEY, JSON.stringify(rice)); } catch (e) {} }
  function riceScore(r) {
    var reach = Number(r.reach), imp = Number(r.impact), conf = Number(r.conf), eff = Number(r.effort);
    if (!isFinite(reach) || reach < 0) return { err: "Reach must be 0 or more" };
    if (!isFinite(conf) || conf < 0 || conf > 100) return { err: "Confidence must be 0–100%" };
    if (!isFinite(eff) || eff <= 0) return { err: "Effort must be greater than 0" };
    return { v: reach * imp * (conf / 100) / eff };
  }
  function viewToolkit(focus) {
    loadRice();
    var h = '<span class="tag">Product Toolkit</span><h1 style="margin-top:10px">Product Toolkit</h1><p class="muted" style="margin:10px 0 16px;max-width:820px">Working tools for your product decisions. Everything runs in your browser; your RICE table is saved on this device.</p>' +
      '<div class="chips noprint" style="margin-bottom:22px"><a class="chip" href="#/toolkit/rice">RICE calculator</a>' + PM.templates.map(function (t) { return '<a class="chip" href="#/toolkit/' + t.id + '">' + t.t + "</a>"; }).join("") + "</div>";
    h += '<section class="card" id="tool-rice"><div class="row between"><div><span class="tag navy">Interactive</span><h2 style="margin-top:8px;font-size:26px">RICE prioritisation calculator</h2></div><div class="row noprint"><button class="btn btn-soft btn-sm" id="rSample">Load sample backlog</button><button class="btn btn-line btn-sm" id="rReset">Reset (clear all)</button></div></div>' +
      '<div class="grid g2" style="margin-top:12px"><div class="small"><b>Score = (Reach × Impact × Confidence) ÷ Effort</b><ul class="clean" style="margin-top:6px"><li><b>Reach:</b> how many users or events it affects in a set period (for example per quarter).</li><li><b>Impact:</b> effect on each user: 0.25 minimal, 0.5 low, 1 medium, 2 high, 3 massive.</li><li><b>Confidence:</b> how sure you are about the estimates (%), based on evidence.</li><li><b>Effort:</b> total person-months across product, design and engineering.</li></ul></div>' +
      '<div class="note small">Scores support judgement; they do not replace it. Check strategy fit, dependencies, deadlines (cost of delay) and risks before deciding. The sample backlog is an illustrative grocery delivery app.</div></div>' +
      '<div class="tscroll" style="margin-top:14px"><table class="rice"><thead><tr><th>Feature</th><th>Reach</th><th>Impact</th><th>Confidence %</th><th>Effort (p-m)</th><th>Score</th><th class="noprint"><span class="sr">Delete</span></th></tr></thead><tbody id="rBody"></tbody></table></div>' +
      '<div class="row noprint" style="margin-top:10px"><button class="btn btn-teal btn-sm" id="rAdd">+ Add feature</button><span class="small muted" id="rCount"></span></div>' +
      '<h3 style="margin-top:22px">Ranked by RICE score</h3><p class="small muted">Top three highlighted.</p><div class="tscroll" style="margin-top:8px"><table><thead><tr><th>#</th><th>Feature</th><th>Score</th></tr></thead><tbody id="rRank"></tbody></table></div></section>';
    h += '<div class="sec"><h2>Fill-in templates</h2><p class="muted small" style="margin:4px 0 14px">Each template has a short guide, a blank version to copy and a worked example.</p><div class="stack">' + PM.templates.map(function (t) {
      return '<section class="card tpl" id="tool-' + t.id + '"><div class="row between"><div><span class="tag">Module ' + t.m + "</span><h3 style=\"margin-top:6px\">" + t.t + '</h3></div><div class="row noprint"><button class="btn btn-teal btn-sm" data-copy="' + t.id + '">Copy template</button><button class="btn btn-line btn-sm" data-copyex="' + t.id + '">Copy example</button><button class="btn btn-line btn-sm" data-print="' + t.id + '">Print</button><span class="copied" data-cmsg="' + t.id + '" aria-live="polite"></span></div></div>' +
        '<p class="small" style="margin-top:8px"><b>How to use:</b> ' + t.how + '</p><div class="grid g2" style="margin-top:6px"><div><h4 class="small">Template</h4><pre>' + esc(t.tpl) + '</pre></div><div><h4 class="small">Worked example (illustrative)</h4><pre>' + esc(t.ex) + "</pre></div></div></section>";
    }).join("") + "</div></div>";
    return { html: h, after: function () {
      drawRice();
      document.getElementById("rAdd").onclick = function () { rice.push({ name: "New feature", reach: 1000, impact: 1, conf: 80, effort: 1 }); saveRice(); drawRice(); var ins = document.querySelectorAll("#rBody input.nm"); if (ins.length) { ins[ins.length - 1].focus(); ins[ins.length - 1].select(); } };
      document.getElementById("rSample").onclick = function () { rice = PM.riceSample.map(function (r) { return Object.assign({}, r); }); saveRice(); drawRice(); };
      document.getElementById("rReset").onclick = function () { rice = []; saveRice(); drawRice(); };
      var body = document.getElementById("rBody");
      body.addEventListener("input", function (e) { var el = e.target, i = +el.getAttribute("data-i"), f = el.getAttribute("data-f"); if (isNaN(i) || !f) return; rice[i][f] = f === "name" ? el.value : (el.value === "" ? "" : Number(el.value)); saveRice(); updateScores(); });
      body.addEventListener("change", function (e) { var el = e.target; if (el.tagName === "SELECT") { rice[+el.getAttribute("data-i")].impact = Number(el.value); saveRice(); updateScores(); } });
      body.addEventListener("click", function (e) { var b = e.target.closest("[data-del]"); if (!b) return; rice.splice(+b.getAttribute("data-del"), 1); saveRice(); drawRice(); });
      document.querySelectorAll("[data-copy],[data-copyex]").forEach(function (b) { b.onclick = function () { var id = b.getAttribute("data-copy") || b.getAttribute("data-copyex"), t = tplById(id); copyText(b.hasAttribute("data-copy") ? t.t + "\n\n" + t.tpl : t.t + " (example)\n\n" + t.ex, document.querySelector('[data-cmsg="' + id + '"]')); }; });
      document.querySelectorAll("[data-print]").forEach(function (b) { b.onclick = function () { printTemplate(tplById(b.getAttribute("data-print"))); }; });
      if (focus) { var el = document.getElementById("tool-" + focus); if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 30); }
    } };
  }
  function drawRice() {
    var body = document.getElementById("rBody");
    body.innerHTML = rice.length ? rice.map(function (r, i) {
      return '<tr><td><input class="nm" aria-label="Feature name" data-i="' + i + '" data-f="name" value="' + esc(r.name) + '"></td>' +
        '<td><input type="number" min="0" step="1" aria-label="Reach" data-i="' + i + '" data-f="reach" value="' + esc(r.reach) + '"></td>' +
        '<td><select aria-label="Impact" data-i="' + i + '">' + [0.25, 0.5, 1, 2, 3].map(function (v) { return '<option value="' + v + '"' + (Number(r.impact) === v ? " selected" : "") + ">" + v + "</option>"; }).join("") + "</select></td>" +
        '<td><input type="number" min="0" max="100" step="5" aria-label="Confidence percent" data-i="' + i + '" data-f="conf" value="' + esc(r.conf) + '"></td>' +
        '<td><input type="number" min="0.1" step="0.5" aria-label="Effort in person-months" data-i="' + i + '" data-f="effort" value="' + esc(r.effort) + '"></td>' +
        '<td data-score="' + i + '" style="font-weight:800;color:var(--teal);white-space:nowrap"></td><td class="noprint"><button class="btn btn-line btn-sm" data-del="' + i + '" aria-label="Delete ' + esc(r.name) + '">Delete</button></td></tr>';
    }).join("") : '<tr><td colspan="7" class="muted small">No features yet. Add a feature or load the sample backlog.</td></tr>';
    updateScores();
  }
  function updateScores() {
    var ranked = [];
    rice.forEach(function (r, i) { var s = riceScore(r), cell = document.querySelector('[data-score="' + i + '"]'); if (cell) cell.innerHTML = s.err ? '<span style="color:var(--red-fg);font-weight:600;font-size:13px">' + s.err + "</span>" : Math.round(s.v).toLocaleString("en-IN"); if (!s.err) ranked.push({ n: r.name || "(unnamed)", v: s.v }); });
    ranked.sort(function (a, b) { return b.v - a.v; });
    var rk = document.getElementById("rRank");
    rk.innerHTML = ranked.length ? ranked.map(function (r, i) { return '<tr class="' + (i < 3 ? "top3" : "") + '"><td><span class="rank">' + (i + 1) + "</span></td><td>" + esc(r.n) + (i < 3 ? ' <span class="tag green">Top ' + (i + 1) + "</span>" : "") + '</td><td style="font-weight:800">' + Math.round(r.v).toLocaleString("en-IN") + "</td></tr>"; }).join("") : '<tr><td colspan="3" class="muted small">Scores appear here once features have valid inputs.</td></tr>';
    var c = document.getElementById("rCount"); if (c) c.textContent = rice.length + " feature" + (rice.length === 1 ? "" : "s") + " · saved on this device";
  }
  function copyText(text, msgEl) {
    function ok() { if (msgEl) { msgEl.textContent = "Copied ✓"; setTimeout(function () { msgEl.textContent = ""; }, 2200); } }
    function fallback() { var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); var good = false; try { good = document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); if (good) ok(); else if (msgEl) msgEl.textContent = "Copy not available: select the text and press Ctrl+C."; }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  }
  function printTemplate(t) {
    var f = document.createElement("iframe"); f.style.position = "fixed"; f.style.right = "0"; f.style.bottom = "0"; f.style.width = "0"; f.style.height = "0"; f.style.border = "0"; document.body.appendChild(f);
    var d = f.contentWindow.document;
    d.open(); d.write('<!doctype html><html><head><meta charset="utf-8"><title>' + esc(t.t) + '</title><style>body{font-family:Arial,sans-serif;color:#0F1E33;margin:32px}h1{font-size:22px;color:#0B1F3A}h2{font-size:15px;margin-top:22px;color:#0F766E}pre{white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;border:1px solid #CBD5E1;border-radius:8px;padding:14px}p{font-size:13px}</style></head><body><h1>' + esc(t.t) + "</h1><p>" + esc(t.how) + "</p><h2>Template</h2><pre>" + esc(t.tpl) + "</pre><h2>Worked example (illustrative)</h2><pre>" + esc(t.ex) + '</pre><p style="color:#6B7891">Product Management · AIStudyTools · aistudytools.com</p></body></html>'); d.close();
    setTimeout(function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { window.print(); } setTimeout(function () { document.body.removeChild(f); }, 1500); }, 250);
  }

  /* ---------- GLOSSARY ---------- */
  var gState = { q: "", m: "", letter: "", sort: "az" };
  function viewGlossary(term) {
    if (term) { gState.q = decodeURIComponent(term); gState.m = ""; gState.letter = ""; }
    var letters = {}; PM.glossary.forEach(function (g) { letters[g[0].charAt(0).toUpperCase()] = true; });
    var h = '<span class="tag">Glossary</span><h1 style="margin-top:10px">Product Management glossary</h1><p class="muted" style="margin:10px 0 16px">' + PM.glossary.length + " key terms with simple definitions and practical examples, linked to the modules.</p>" +
      '<div class="card"><div class="row"><input id="gq" type="search" placeholder="Search terms or definitions" aria-label="Search glossary" value="' + esc(gState.q) + '" style="flex:1;min-width:220px"><select id="gm" aria-label="Filter by module"><option value="">All modules</option>' + M.map(function (m) { return '<option value="' + m.n + '"' + (String(gState.m) === String(m.n) ? " selected" : "") + ">Module " + m.n + ": " + m.title + "</option>"; }).join("") + '</select><select id="gs" aria-label="Sort"><option value="az"' + (gState.sort === "az" ? " selected" : "") + '>A → Z</option><option value="za"' + (gState.sort === "za" ? " selected" : "") + '>Z → A</option><option value="mod"' + (gState.sort === "mod" ? " selected" : "") + ">By module</option></select></div>" +
      '<div class="az" style="margin-top:12px" role="group" aria-label="Jump to letter"><button data-l="" class="' + (gState.letter ? "" : "on") + '">All</button>' + "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (l) { return '<button data-l="' + l + '"' + (letters[l] ? "" : " disabled") + ' class="' + (gState.letter === l ? "on" : "") + '">' + l + "</button>"; }).join("") + "</div></div>" +
      '<p class="small muted" id="gcount" style="margin:14px 0 8px" aria-live="polite"></p><div class="grid g2" id="gl"></div>';
    return { html: h, after: function () {
      var q = document.getElementById("gq"), mm = document.getElementById("gm"), so = document.getElementById("gs");
      q.oninput = function () { gState.q = q.value; drawGloss(); }; mm.onchange = function () { gState.m = mm.value; drawGloss(); }; so.onchange = function () { gState.sort = so.value; drawGloss(); };
      document.querySelectorAll(".az button").forEach(function (b) { b.onclick = function () { gState.letter = b.getAttribute("data-l"); document.querySelectorAll(".az button").forEach(function (x) { x.classList.toggle("on", x === b); }); drawGloss(); }; });
      drawGloss();
    } };
  }
  function drawGloss() {
    var t = gState.q.trim().toLowerCase();
    var items = PM.glossary.filter(function (g) { return (!gState.m || String(g[3]) === String(gState.m)) && (!gState.letter || g[0].charAt(0).toUpperCase() === gState.letter) && (!t || (g[0] + " " + g[1] + " " + g[2]).toLowerCase().indexOf(t) >= 0); });
    items.sort(function (a, b) { if (gState.sort === "mod") return a[3] - b[3] || a[0].localeCompare(b[0]); return gState.sort === "za" ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]); });
    document.getElementById("gcount").textContent = items.length + " of " + PM.glossary.length + " terms";
    document.getElementById("gl").innerHTML = items.length ? items.map(function (g) {
      var m = mod(g[3]);
      return '<div class="gl"><b>' + esc(g[0]) + '</b><p class="small" style="margin-top:4px">' + esc(g[1]) + '</p><p class="small muted" style="margin-top:6px"><i>Example:</i> ' + esc(g[2]) + '</p><p class="tiny" style="margin-top:8px"><a href="#/module/' + m.n + '">Module ' + m.n + ": " + m.title + "</a></p></div>";
    }).join("") : '<div class="card muted">No terms match your search. Try a shorter word, clear the letter filter, or choose "All modules". <button class="btn btn-line btn-sm" id="gclear" style="margin-left:8px">Clear filters</button></div>';
    var c = document.getElementById("gclear"); if (c) c.onclick = function () { gState = { q: "", m: "", letter: "", sort: gState.sort }; if (location.hash.indexOf("#/glossary/") === 0) location.hash = "#/glossary"; else render(); };
  }

  /* ---------- QUIZ ---------- */
  var Q = null;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newQuiz() {
    var qs = PM.quiz.map(function (q) { var perm = shuffle([0, 1, 2, 3]); return { m: q.m, q: q.q, e: q.e, o: perm.map(function (p) { return q.o[p]; }), a: perm.indexOf(q.a) }; });
    Q = { qs: qs, ans: {}, cur: 0, done: false };
  }
  function viewQuiz() {
    if (!Q) {
      return '<div class="card" style="max-width:760px;margin:0 auto"><span class="tag">Practice quiz</span><h1 style="margin-top:10px;font-size:clamp(28px,4vw,40px)">Product Management practice quiz</h1>' +
        '<ul class="clean" style="margin:14px 0 18px"><li>25 questions: 5 per module, in module order</li><li>Scenarios, decisions and a few short calculations</li><li>Answers are revealed only after you submit</li><li>You get a score, module-wise results and a full review; retake any time</li></ul>' +
        (st.quiz ? '<p class="small muted" style="margin-bottom:14px">Previous best: ' + st.quiz.best + "% · last: " + st.quiz.last + "% · attempts: " + st.quiz.attempts + "</p>" : "") +
        '<button class="btn btn-teal" id="qStart">Start the quiz</button></div>';
    }
    if (Q.done) return quizResults();
    var q = Q.qs[Q.cur], n = Q.qs.length, answered = Object.keys(Q.ans).length;
    return '<div style="max-width:820px;margin:0 auto"><div class="row between"><span class="tag navy">Question ' + (Q.cur + 1) + " of " + n + " · Module " + q.m + '</span><span class="small muted">' + answered + " of " + n + " answered</span></div>" +
      '<div class="bar" style="margin:12px 0 14px"><i style="width:' + (answered / n * 100) + '%"></i></div>' +
      '<div class="dots" style="margin-bottom:14px" aria-label="Jump to question">' + Q.qs.map(function (x, i) { return '<button data-go="' + i + '" class="' + (Q.ans[i] !== undefined ? "ans " : "") + (i === Q.cur ? "cur" : "") + '" aria-label="Question ' + (i + 1) + '">' + (i + 1) + "</button>"; }).join("") + "</div>" +
      '<div class="q"><b style="font-size:18px">' + q.q + '</b><div class="opts" id="qOpts" role="radiogroup">' + q.o.map(function (o, oi) { return '<button class="opt ' + (Q.ans[Q.cur] === oi ? "sel" : "") + '" data-o="' + oi + '" role="radio" aria-checked="' + (Q.ans[Q.cur] === oi) + '"><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + "</span></button>"; }).join("") + "</div></div>" +
      '<div class="row between" style="margin-top:16px"><button class="btn btn-line" id="qPrev"' + (Q.cur === 0 ? " disabled" : "") + '>← Previous</button>' +
      (Q.cur < n - 1 ? '<button class="btn btn-navy" id="qNext">Next →</button>' : '<button class="btn btn-teal" id="qSubmit">Submit quiz</button>') + "</div>" +
      '<p id="qErr" class="small" style="color:var(--red-fg);margin-top:10px;font-weight:600"></p></div>';
  }
  function quizResults() {
    var c = 0, mc = {}, mt = {};
    Q.qs.forEach(function (q, i) { mt[q.m] = (mt[q.m] || 0) + 1; mc[q.m] = mc[q.m] || 0; if (Q.ans[i] === q.a) { c++; mc[q.m]++; } });
    var pct = Math.round(c / Q.qs.length * 100);
    var fb = pct >= 85 ? "Excellent. You can reason through product decisions with confidence." : pct >= 70 ? "Good work. Review the modules where you dropped marks." : pct >= 50 ? "A fair start. Revisit the lecture notes and knowledge checks for your weaker modules." : "Keep going. Work through the module notes and try again.";
    var weak = M.filter(function (m) { return mt[m.n] && mc[m.n] / mt[m.n] < 0.6; });
    var h = '<div style="max-width:880px;margin:0 auto"><div class="card" style="text-align:center"><span class="tag">Your result</span><p style="font-size:44px;font-weight:800;color:var(--navy);margin-top:6px">' + c + " / " + Q.qs.length + '</p><p style="font-size:20px;font-weight:700;color:var(--teal)">' + pct + '%</p><p class="muted" style="margin-top:8px">' + fb + "</p>" +
      '<div class="grid g5" style="margin-top:16px;text-align:left">' + M.map(function (m) { var r = mc[m.n] || 0, t = mt[m.n] || 0; return '<div class="card" style="padding:12px;border-top:4px solid ' + m.color + '"><div class="tiny muted" style="font-weight:700">MODULE ' + m.n + '</div><div style="font-weight:800;font-size:20px;color:var(--navy)">' + r + " / " + t + '</div><div class="bar" style="margin-top:6px"><i style="width:' + (t ? r / t * 100 : 0) + '%;background:' + m.color + '"></i></div></div>'; }).join("") + "</div>" +
      (weak.length ? '<p class="small" style="margin-top:14px">Suggested review: ' + weak.map(function (m) { return '<a href="#/module/' + m.n + '">Module ' + m.n + "</a>"; }).join(", ") + "</p>" : "") +
      '<div class="row" style="justify-content:center;margin-top:16px"><button class="btn btn-teal" id="qRetake">Retake the quiz</button><a class="btn btn-line" href="#/modules">Back to modules</a></div></div>' +
      '<h2 style="margin:28px 0 12px">Review your answers</h2><div class="stack">' + Q.qs.map(function (q, i) {
        return '<div class="q"><b>' + (i + 1) + ". " + q.q + ' <span class="tag navy" style="margin-left:6px">Module ' + q.m + '</span></b><div class="opts">' + q.o.map(function (o, oi) { var cls = oi === q.a ? "ok" : (Q.ans[i] === oi ? "bad" : ""); return '<div class="opt ' + cls + '"><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + (oi === q.a ? " ✓" : (Q.ans[i] === oi ? " (your answer)" : "")) + "</span></div>"; }).join("") + '</div><div class="expl">' + (Q.ans[i] === q.a ? "✅ Correct. " : "") + q.e + "</div></div>";
      }).join("") + "</div></div>";
    return h;
  }
  function quizWire() {
    var s = document.getElementById("qStart"); if (s) s.onclick = function () { newQuiz(); render(); };
    var r = document.getElementById("qRetake"); if (r) r.onclick = function () { newQuiz(); render(); window.scrollTo(0, 0); };
    var o = document.getElementById("qOpts"); if (o) o.onclick = function (e) { var b = e.target.closest(".opt"); if (!b) return; Q.ans[Q.cur] = +b.getAttribute("data-o"); render(); };
    var p = document.getElementById("qPrev"); if (p) p.onclick = function () { Q.cur--; render(); };
    var n = document.getElementById("qNext"); if (n) n.onclick = function () { Q.cur++; render(); };
    document.querySelectorAll("[data-go]").forEach(function (b) { b.onclick = function () { Q.cur = +b.getAttribute("data-go"); render(); }; });
    var sb = document.getElementById("qSubmit");
    if (sb) sb.onclick = function () {
      var miss = []; Q.qs.forEach(function (q, i) { if (Q.ans[i] === undefined) miss.push(i + 1); });
      if (miss.length) { document.getElementById("qErr").textContent = "Please answer question" + (miss.length > 1 ? "s " : " ") + miss.join(", ") + " before submitting. Use the numbered buttons above to jump to them."; return; }
      Q.done = true;
      var c = Q.qs.filter(function (q, i) { return Q.ans[i] === q.a; }).length, pct = Math.round(c / Q.qs.length * 100);
      var prev = st.quiz || { best: 0, attempts: 0 };
      st.quiz = { best: Math.max(prev.best, pct), last: pct, attempts: prev.attempts + 1 }; save();
      render(); window.scrollTo(0, 0);
    };
  }

  /* ---------- CASES ---------- */
  function viewCases() {
    return '<span class="tag">Case studies</span><h1 style="margin-top:10px">Product case studies</h1><p class="muted" style="margin:10px 0 12px;max-width:820px">Short, classroom-ready cases. Each gives the context, the decision, scenario data, discussion questions and a suggested framework.</p>' +
      '<p class="small note" style="margin-bottom:18px">All scenario data in these cases is illustrative and created for teaching. It does not describe the performance of any real company. Regulatory references are to public Indian rules; check the latest versions before relying on them.</p><div class="stack">' +
      PM.cases.map(function (c, i) {
        return '<section class="card case" id="case-' + c.id + '"><div class="row between"><span class="tag navy">Case ' + (i + 1) + " · " + c.area + '</span><span class="tag">Framework: ' + c.fw + "</span></div>" +
          '<h3 style="margin-top:10px;font-size:22px">' + c.t + '</h3><div class="grid g2" style="margin-top:10px"><div><h4>Context</h4><p class="small" style="margin-top:4px">' + c.ctx + '</p><h4 style="margin-top:12px">The decision</h4><p class="small" style="margin-top:4px">' + c.prob + "</p></div>" +
          '<div><h4>Scenario information</h4><div class="small" style="margin-top:4px">' + list(c.data) + '</div></div></div><div class="info" style="margin-top:12px"><b>Discussion questions</b><ol style="margin:6px 0 0;padding-left:20px">' + c.qs.map(function (q) { return "<li>" + q + "</li>"; }).join("") + "</ol></div>" +
          (c.id === "backlog" ? '<p style="margin-top:12px"><a class="btn btn-teal btn-sm" href="#/toolkit/rice">Open the RICE calculator</a></p>' : "") + "</section>";
      }).join("") + "</div>";
  }

  function viewNotFound() { return '<div class="card" style="text-align:center;max-width:600px;margin:30px auto"><h2>Page not found</h2><p class="muted" style="margin-top:8px">That page doesn\'t exist in this course.</p><p style="margin-top:14px"><a class="btn btn-teal" href="#/">Go to the dashboard</a></p></div>'; }

  /* ---------- ROUTER ---------- */
  var TITLES = { home: "Dashboard", syllabus: "Course syllabus", modules: "Learning modules", module: "Module", presentations: "Presentations", toolkit: "Product Toolkit", glossary: "Glossary", quiz: "Practice quiz", cases: "Case studies" };
  function render() {
    var hsh = location.hash.replace(/^#\/?/, ""), parts = hsh.split("/"), r = parts[0] || "home", out, after = null;
    if (r === "home") out = viewHome();
    else if (r === "syllabus") out = viewSyllabus();
    else if (r === "modules") out = viewModules();
    else if (r === "module") out = viewModule(+parts[1]);
    else if (r === "presentations") out = viewPresentations();
    else if (r === "toolkit") out = viewToolkit(parts[1]);
    else if (r === "glossary") out = viewGlossary(parts.slice(1).join("/"));
    else if (r === "quiz") { out = viewQuiz(); after = quizWire; }
    else if (r === "cases") out = viewCases();
    else out = viewNotFound();
    if (out && typeof out === "object") { after = out.after; out = out.html; }
    app.innerHTML = out;
    if (after) after();
    var navKey = r === "module" ? "modules" : r;
    document.querySelectorAll(".nav a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-r") === navKey); if (a.getAttribute("data-r") === navKey) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.title = (r === "module" && mod(+parts[1]) ? "Module " + parts[1] + ": " + mod(+parts[1]).title : (TITLES[r] || "Page not found")) + " | Product Management | AIStudyTools";
  }
  app.addEventListener("click", function (e) {
    var j = e.target.closest("[data-jump]"); if (!j) return;
    e.preventDefault(); var el = document.getElementById(j.getAttribute("data-jump")); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  var menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
  menuBtn.onclick = function () { var o = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); };
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });
  var last = location.hash;
  window.addEventListener("hashchange", function () {
    var h = location.hash;
    if (h.indexOf("#/quiz") !== 0 && Q && Q.done) Q = null;
    var sameToolkit = h.indexOf("#/toolkit") === 0 && last.indexOf("#/toolkit") === 0;
    render(); if (!sameToolkit) window.scrollTo(0, 0);
    last = h; app.focus({ preventScroll: true });
  });
  render();
})();
