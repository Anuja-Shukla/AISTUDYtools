/* AIStudyTools SSC CGL course app. Original material; not affiliated with the Staff Selection Commission. */
(function () {
  "use strict";
  var D = window.SSC, TOP = window.SSC_TOPICS || {};
  var app = document.getElementById("app");
  var cleanup = null;
  var KEY = "aistudytools-ssc-cgl-v1";

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(sel, root) { return (root || app).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || app).querySelectorAll(sel)); }
  function r2(x) { return Math.round(x * 100) / 100; }
  function fmtN(x) { return isFinite(x) ? r2(x).toLocaleString("en-IN") : "—"; }
  function shuffle(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
  function mmss(s) { s = Math.max(0, Math.round(s)); return (s / 60 | 0) + ":" + ("0" + s % 60).slice(-2); }
  function track(name, p) { try { if (window.gtag) gtag("event", name, p || {}); } catch (e) {} }

  var store = (function () {
    var mem = {};
    function load() { try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : {}; } catch (e) { return mem; } }
    function save(d) { mem = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
    return {
      get: function (tid) { var d = load(); return (d.t && d.t[tid]) || {}; },
      set: function (tid, k, v) { var d = load(); d.t = d.t || {}; d.t[tid] = d.t[tid] || {}; d.t[tid][k] = v; save(d); },
      all: function () { return load(); },
      reset: function () { save({}); }
    };
  })();

  function subjectOf(id) { for (var i = 0; i < D.subjects.length; i++) if (D.subjects[i].id === id) return D.subjects[i]; return null; }
  function topicDone(tid) { var p = store.get(tid); var n = 0; ["watch", "slides", "try", "practice", "test"].forEach(function (k) { if (p[k]) n++; }); return n; }

  /* ---------- router ---------- */
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    var h = (location.hash || "#/").slice(1).split("/").filter(Boolean);
    $$(".tnav a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-r") === (h[0] === "t" ? "s" : (h[0] || "home"))); });
    if (!h.length) home();
    else if (h[0] === "s") subject(h[1] || "quant");
    else if (h[0] === "t" && TOP[h[1]]) topic(TOP[h[1]], h[2] || "watch");
    else if (h[0] === "mocks") mocks();
    else if (h[0] === "progress") progress();
    else home();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ---------- home: syllabus ---------- */
  function home() {
    var units = 0, live = 0;
    D.subjects.forEach(function (s) { s.units.forEach(function (u) { units++; if (u[2] === "live") live++; }); });
    var h = '<section class="hero"><div><span class="tag indigo">Free interactive course · updated ' + esc(D.updated) + '</span>' +
      '<h1 style="margin-top:12px">SSC CGL: learn it, try it, test it</h1>' +
      '<p class="lead">The full Tier 1 and Tier 2 syllabus, one topic at a time. Each topic has a teaching video, self-paced slides, hands-on tools, practice questions and a timed test with negative marking.</p>' +
      '<div class="row" style="margin-top:18px"><a class="btn btn-accent" href="#/t/percentages">Start with Percentages</a><a class="btn btn-soft" href="#syllabus">See the syllabus</a></div></div>' +
      '<div class="stats"><div class="stat"><b>5</b><span>subjects</span></div><div class="stat"><b>' + units + '</b><span>topics</span></div><div class="stat"><b>' + live + '</b><span>topic' + (live === 1 ? "" : "s") + ' live</span></div><div class="stat"><b>200</b><span>Tier 1 marks</span></div></div></section>';

    h += '<section class="card"><h3>How every topic works</h3><div class="grid g4" style="margin-top:12px">' +
      [["1 · Watch", "a 2–3 minute animated teaching video"], ["2 · Slides", "self-paced cards with “your turn” questions"], ["3 · Try it", "sliders and tools to see the idea work"], ["4 · Test", "practice set, then a timed mini-test"]].map(function (x) {
        return '<div class="stack" style="gap:2px"><b>' + x[0] + '</b><span class="small muted">' + x[1] + '</span></div>';
      }).join("") + '</div></section>';

    h += '<div class="sec" id="syllabus"><h2>Exam pattern</h2><p>As per the SSC CGL 2026 notice. Always check the latest notice at ssc.gov.in.</p></div>';
    h += '<div class="grid g2"><div class="card stack"><h3>Tier 1 (computer-based)</h3><div class="tscroll"><table><tr><th>Subject</th><th class="n">Qs</th><th class="n">Marks</th></tr>' +
      D.tier1.rows.map(function (r) { return "<tr><td>" + r[0] + '</td><td class="n">' + r[1] + '</td><td class="n">' + r[2] + "</td></tr>"; }).join("") +
      '<tr><th>Total</th><th class="n">100</th><th class="n">200</th></tr></table></div><p class="small muted"><b>Time:</b> ' + D.tier1.time + '<br><b>Negative marking:</b> ' + D.tier1.neg + '</p></div>' +
      '<div class="card stack"><h3>Tier 2 (computer-based)</h3><div class="tscroll"><table><tr><th>Paper</th><th>Subjects (questions)</th><th class="n">Marks</th><th>Time</th></tr>' +
      D.tier2.rows.map(function (r) { return "<tr><td><b>" + r[0] + "</b></td><td>" + r[1] + '</td><td class="n">' + r[3] + "</td><td>" + r[4] + "</td></tr>"; }).join("") +
      '</table></div><p class="small muted"><b>Negative marking:</b> ' + D.tier2.neg + '</p></div></div>';

    h += '<div class="sec"><h2>Syllabus and course map</h2><p>Green topics are ready. The rest are being built in this order, followed by sectional and full mock tests.</p></div><div class="grid g3">';
    D.subjects.forEach(function (s) { h += subjectCard(s); });
    h += mockCard() + '</div>';
    app.innerHTML = h;
  }
  function unitList(s) {
    return '<ul class="units">' + s.units.map(function (u, i) {
      var num = '<span><span class="num">' + (i + 1) + '</span>' + esc(u[1]) + '</span>';
      if (u[2] === "live" && TOP[u[0]]) {
        var d = topicDone(u[0]);
        return '<li><a href="#/t/' + u[0] + '">' + num + '<span class="tag live">' + (d ? d + "/5 done" : "Start") + '</span></a></li>';
      }
      return '<li><span class="u">' + num + '<span class="tag soon">Soon</span></span></li>';
    }).join("") + '</ul>';
  }
  function subjectCard(s) {
    return '<div class="card subj" style="--c:' + s.color + ';--s:' + s.soft + '"><h3>' + esc(s.name) + '</h3><p class="small muted">' + esc(s.blurb) + '</p>' +
      '<div class="row small"><span class="tag indigo">Tier 1: ' + (s.t1 ? s.t1 + " Qs" : "—") + '</span><span class="tag indigo">Tier 2: ' + s.t2 + ' Qs</span></div>' + unitList(s) + '</div>';
  }
  function mockCard() {
    return '<div class="card subj" style="--c:#1E1B4B;--s:#EEF0FF"><h3>Mock tests</h3><p class="small muted">Real exam screen: question palette, mark for review, section timer and negative marking.</p><ul class="units">' +
      D.mocks.map(function (m) { return '<li><span class="u"><span><b style="color:var(--ink)">' + esc(m[0]) + '</b><br><span class="small">' + esc(m[1]) + '</span></span><span class="tag ' + m[2] + '">' + (m[2] === "live" ? "Live" : "Soon") + '</span></span></li>'; }).join("") + '</ul><a class="btn btn-ink btn-sm" href="#/mocks">Open mock tests</a></div>';
  }

  /* ---------- subject ---------- */
  function subject(id) {
    var s = subjectOf(id) || D.subjects[0];
    var h = '<div class="pill-tabs">' + D.subjects.map(function (x) { return '<a href="#/s/' + x.id + '"' + (x.id === s.id ? ' class="on"' : "") + '>' + esc(x.short) + '</a>'; }).join("") + '</div>';
    h += '<div class="grid g2" style="align-items:start"><div class="stack"><h1 style="color:' + s.color + '">' + esc(s.name) + '</h1><p class="lead muted">' + esc(s.blurb) + '</p>' +
      '<div class="row"><span class="tag indigo">Tier 1: ' + (s.t1 ? s.t1 + " questions" : "not in Tier 1") + '</span><span class="tag indigo">Tier 2: ' + s.t2 + ' questions</span></div></div>' +
      '<div class="card subj" style="--c:' + s.color + ';--s:' + s.soft + '"><h3>Topics</h3>' + unitList(s) + '</div></div>';
    app.innerHTML = h;
  }

  /* ---------- topic ---------- */
  var TABS = [["watch", "Watch"], ["slides", "Slides"], ["try", "Try it"], ["practice", "Practice"], ["test", "Mini-test"], ["formulas", "Formula sheet"]];
  function topic(T, tab) {
    var s = subjectOf(T.subject), p = store.get(T.id);
    var h = '<div class="crumb"><a href="#/">SSC CGL</a> › <a href="#/s/' + s.id + '">' + esc(s.name) + '</a> › Topic ' + T.num + '</div>' +
      '<div class="row" style="justify-content:space-between;align-items:flex-end"><div><h1>' + esc(T.title) + '</h1><p class="muted" style="margin-top:6px">' + esc(T.why) + '</p></div>' +
      '<span class="tag indigo">' + topicDone(T.id) + ' of 5 steps done · about ' + T.minutes + ' min</span></div>' +
      '<div class="pill-tabs" style="margin-top:18px">' + TABS.map(function (t) {
        return '<a href="#/t/' + T.id + '/' + t[0] + '"' + (t[0] === tab ? ' class="on"' : "") + '>' + t[1] + (p[t[0]] ? '<span class="ok">✓</span>' : "") + '</a>';
      }).join("") + '</div><div id="pane"></div>';
    app.innerHTML = h;
    var pane = $("#pane");
    ({ watch: watch, slides: slides, "try": tryIt, practice: practice, test: miniTest, formulas: formulas }[tab] || watch)(T, pane);
  }
  function nextBtn(T, tab, label) { return '<a class="btn btn-accent" href="#/t/' + T.id + '/' + tab + '">' + label + ' →</a>'; }
  function done(T, k, v) { store.set(T.id, k, v === undefined ? 1 : v); track("ssc_step", { topic: T.id, step: k }); }

  function watch(T, pane) {
    pane.innerHTML = '<div class="video"><video controls preload="metadata" playsinline poster="' + esc(T.video.replace(".mp4", "-poster.jpg")) + '" src="' + esc(T.video) + '"></video></div>' +
      '<div class="row" style="margin-top:14px;justify-content:space-between"><span class="small muted">Watch it once fully. Pause and try the question in the video before the answer appears.</span>' +
      '<div class="row"><button class="btn btn-line btn-sm" id="mk">Mark as watched</button>' + nextBtn(T, "slides", "Go to slides") + '</div></div>';
    var v = $("video", pane);
    v.addEventListener("timeupdate", function () { if (v.duration && v.currentTime / v.duration > 0.85 && !store.get(T.id).watch) done(T, "watch"); });
    $("#mk", pane).onclick = function () { done(T, "watch"); this.textContent = "Watched ✓"; };
  }

  function viz(x) {
    if (!x) return "";
    if (x.type === "grid") { var g = '<div class="g100" data-n="' + x.n + '">'; for (var i = 0; i < 100; i++) g += "<i></i>"; return g + '</div><input type="range" min="0" max="100" value="' + x.n + '" aria-label="Per cent" class="gr" style="max-width:260px"><p class="small muted gl"></p>'; }
    if (x.type === "fractions") return '<div class="ftab">' + FR.slice(0, 15).map(function (f) { return "<div>" + f[0] + "<small>" + f[1] + "</small></div>"; }).join("") + '</div>';
    return "";
  }
  function slides(T, pane) {
    var i = 0, seen = {};
    function draw() {
      var S = T.slides[i]; seen[i] = 1;
      pane.innerHTML = '<div class="deck"><div class="row" style="justify-content:space-between"><span class="count">Slide ' + (i + 1) + ' of ' + T.slides.length + '</span><span class="small faint noprint">Use ← → keys</span></div>' +
        '<h2>' + esc(S.h) + '</h2><div class="body">' + S.body + viz(S.viz) + '</div>' +
        (S.ask ? '<div class="ask"><b>Your turn</b><div>' + esc(S.ask.q) + '</div><button class="btn btn-soft btn-sm" id="rev" style="justify-self:start">Show answer</button><div class="ans" id="ans" hidden>' + esc(S.ask.a) + '</div></div>' : "") +
        '<div class="row" style="justify-content:space-between;margin-top:auto"><button class="btn btn-line" id="prev"' + (i ? "" : " disabled") + '>← Back</button>' +
        '<div class="dots">' + T.slides.map(function (_, k) { return '<button aria-label="Slide ' + (k + 1) + '" data-k="' + k + '" class="' + (k === i ? "on" : seen[k] ? "seen" : "") + '"></button>'; }).join("") + '</div>' +
        (i < T.slides.length - 1 ? '<button class="btn btn-accent" id="next">Next →</button>' : nextBtn(T, "try", "Try it")) + '</div></div>';
      if ($("#rev", pane)) $("#rev", pane).onclick = function () { $("#ans", pane).hidden = false; this.remove(); };
      $("#prev", pane).onclick = function () { if (i) { i--; draw(); } };
      if ($("#next", pane)) $("#next", pane).onclick = function () { i++; draw(); };
      $$(".dots button", pane).forEach(function (b) { b.onclick = function () { i = +b.getAttribute("data-k"); draw(); }; });
      var gr = $(".gr", pane);
      if (gr) { var paint = function () { var n = +gr.value; $$(".g100 i", pane).forEach(function (c, k) { c.classList.toggle("on", k < n); }); $(".gl", pane).textContent = n + "% = " + n + "/100 = " + (n / 100) + " · drag the slider"; }; gr.oninput = paint; paint(); }
      if (i === T.slides.length - 1) done(T, "slides");
    }
    function key(e) { if (e.target.tagName === "INPUT") return; if (e.key === "ArrowRight" && i < T.slides.length - 1) { i++; draw(); } if (e.key === "ArrowLeft" && i) { i--; draw(); } }
    document.addEventListener("keydown", key);
    cleanup = function () { document.removeEventListener("keydown", key); };
    draw();
  }

  /* ---------- try-it tools ---------- */
  var FR = [["1/2", "50%", 50], ["1/3", "33⅓%", 100 / 3], ["2/3", "66⅔%", 200 / 3], ["1/4", "25%", 25], ["3/4", "75%", 75], ["1/5", "20%", 20], ["1/6", "16⅔%", 100 / 6], ["5/6", "83⅓%", 500 / 6], ["1/7", "14 2/7%", 100 / 7], ["1/8", "12½%", 12.5], ["3/8", "37½%", 37.5], ["5/8", "62½%", 62.5], ["7/8", "87½%", 87.5], ["1/9", "11 1/9%", 100 / 9], ["1/10", "10%", 10], ["1/11", "9 1/11%", 100 / 11], ["1/12", "8⅓%", 100 / 12], ["1/16", "6¼%", 6.25], ["1/20", "5%", 5], ["1/25", "4%", 4]];
  var TOOLS = {
    pctOf: {
      title: "x% of y, visually", html: '<div class="grid g2"><div class="stack"><div class="field"><label for="px">Per cent: <b id="pxv">35</b>%</label><input type="range" id="px" min="0" max="100" value="35"></div><div class="field"><label for="py">Number (y)</label><input type="number" id="py" value="240"></div></div><div class="g100" id="pg"></div></div><div class="out" id="po"></div>',
      init: function (el) {
        var cells = ""; for (var i = 0; i < 100; i++) cells += "<i></i>"; $("#pg", el).innerHTML = cells;
        function up() {
          var x = +$("#px", el).value, y = parseFloat($("#py", el).value); $("#pxv", el).textContent = x;
          $$("#pg i", el).forEach(function (c, k) { c.classList.toggle("on", k < x); });
          if (!isFinite(y)) { $("#po", el).innerHTML = "Enter a number for y"; return; }
          var tens = Math.floor(x / 10) * 10, rest = x - tens, f = FR.filter(function (q) { return Math.abs(q[2] - x) < 0.01; })[0];
          $("#po", el).innerHTML = x + "% of " + fmtN(y) + " = " + fmtN(x * y / 100) + "<small>Split: " + tens + "% = " + fmtN(tens * y / 100) + (rest ? " and " + rest + "% = " + fmtN(rest * y / 100) : "") + (f ? " · or " + f[0] + " of " + fmtN(y) : "") + "</small>";
        }
        $("#px", el).oninput = up; $("#py", el).oninput = up; up();
      }
    },
    change: {
      title: "Percentage change and the base trap", html: '<div class="grid g2"><div class="field"><label for="co">Old value</label><input type="number" id="co" value="80"></div><div class="field"><label for="cn">New value</label><input type="number" id="cn" value="100"></div></div><div class="bars"><div class="b"><b>Old</b><span class="bar" id="cbo"></span><span id="cvo"></span></div><div class="b"><b>New</b><span class="bar n" id="cbn"></span><span id="cvn"></span></div></div><div class="out" id="cout"></div>',
      init: function (el) {
        function up() {
          var o = parseFloat($("#co", el).value), n = parseFloat($("#cn", el).value);
          if (!(o > 0) || !(n >= 0)) { $("#cout", el).textContent = "Enter positive values"; return; }
          var m = Math.max(o, n); $("#cbo", el).style.width = (o / m * 100) + "%"; $("#cbn", el).style.width = (n / m * 100) + "%";
          $("#cvo", el).textContent = fmtN(o); $("#cvn", el).textContent = fmtN(n);
          var c = (n - o) / o * 100, back = (o - n) / n * 100;
          $("#cout", el).innerHTML = (c >= 0 ? "Increase of " : "Decrease of ") + fmtN(Math.abs(c)) + "%<small>(" + fmtN(n) + " − " + fmtN(o) + ") ÷ " + fmtN(o) + " × 100. To go back from " + fmtN(n) + " to " + fmtN(o) + " you need a " + (back >= 0 ? "rise" : "fall") + " of " + fmtN(Math.abs(back)) + "%, because the base is now " + fmtN(n) + ".</small>";
        }
        $("#co", el).oninput = up; $("#cn", el).oninput = up; up();
      }
    },
    successive: {
      title: "Successive change machine", html: '<p class="small muted">Start at 100 and apply changes one after another. Compare the real result with simply adding the percentages.</p><div class="row"><div class="field" style="width:130px"><label for="sp">Change %</label><input type="number" id="sp" value="20"></div><button class="btn btn-sm btn-soft" id="sup">+ Increase</button><button class="btn btn-sm btn-soft" id="sdn">− Decrease</button><button class="btn btn-sm btn-line" id="sre">Reset</button></div><div class="row small"><span class="muted">Presets:</span><button class="btn btn-sm btn-line" data-p="20,-20">+20 then −20</button><button class="btn btn-sm btn-line" data-p="-20,-10">discounts 20, 10</button><button class="btn btn-sm btn-line" data-p="10,10">+10 twice</button></div><div class="chain" id="sch"></div><div class="out" id="sout"></div>',
      init: function (el) {
        var steps = [];
        function up() {
          var v = 100, h = '<span class="v">100</span>';
          steps.forEach(function (s) { v = v * (1 + s / 100); h += '<span class="op ' + (s >= 0 ? "up" : "dn") + '">' + (s >= 0 ? "+" : "−") + Math.abs(s) + '%</span><span class="v">' + fmtN(v) + "</span>"; });
          $("#sch", el).innerHTML = h;
          var sum = steps.reduce(function (a, b) { return a + b; }, 0), net = v - 100;
          var two = steps.length === 2 ? " · Formula: " + steps[0] + " + (" + steps[1] + ") + (" + steps[0] + " × " + steps[1] + ")/100 = " + fmtN(steps[0] + steps[1] + steps[0] * steps[1] / 100) + "%" : "";
          $("#sout", el).innerHTML = steps.length ? "Net change: " + (net >= 0 ? "+" : "−") + fmtN(Math.abs(net)) + "%<small>Simply adding gives " + fmtN(sum) + "%, which is wrong" + (Math.abs(sum - net) < 1e-9 ? " here only by luck" : "") + "." + two + "</small>" : "Add a change to begin";
        }
        function add(sign) { var p = Math.abs(parseFloat($("#sp", el).value)); if (!isFinite(p) || p === 0) return; if (sign < 0 && p >= 100) return; if (steps.length < 6) steps.push(sign * p); up(); }
        $("#sup", el).onclick = function () { add(1); }; $("#sdn", el).onclick = function () { add(-1); };
        $("#sre", el).onclick = function () { steps = []; up(); };
        $$("[data-p]", el).forEach(function (b) { b.onclick = function () { steps = b.getAttribute("data-p").split(",").map(Number); up(); }; });
        up();
      }
    },
    flash: {
      title: "60-second fraction sprint", html: '<div class="flash"><p class="small muted">Match each fraction to its per cent (or the reverse) as fast as you can.</p><div class="big" id="fq">Ready?</div><div class="opts" id="fo" style="max-width:420px;margin:0 auto;width:100%"></div><div class="row" style="justify-content:center"><span class="tag indigo">Score: <b id="fs">0</b></span><span class="tag">Time: <b id="ft">60</b>s</span><span class="tag live">Best: <b id="fb">0</b></span></div><button class="btn btn-accent" id="fgo" style="justify-self:center">Start sprint</button></div>',
      init: function (el, T) {
        var timer = null, score = 0, left = 60;
        $("#fb", el).textContent = store.get(T.id).flash || 0;
        function ask() {
          var q = FR[Math.floor(Math.random() * FR.length)], rev = Math.random() < 0.5, pool = [q], tries = 0;
          while (pool.length < 4 && tries++ < 50) { var c = FR[Math.floor(Math.random() * FR.length)]; if (pool.indexOf(c) < 0) pool.push(c); }
          var ord = shuffle(pool.length);
          $("#fq", el).textContent = rev ? q[1] : q[0];
          $("#fo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (pool[k] === q ? 1 : 0) + '">' + (rev ? pool[k][0] : pool[k][1]) + "</button>"; }).join("");
          $$("#fo .opt", el).forEach(function (b) { b.onclick = function () { if (!timer) return; if (b.getAttribute("data-ok") === "1") { score++; $("#fs", el).textContent = score; ask(); } else { b.classList.add("wrong"); score = Math.max(0, score - 1); $("#fs", el).textContent = score; } }; });
        }
        function stop() {
          clearInterval(timer); timer = null; $("#fo", el).innerHTML = "";
          var best = store.get(T.id).flash || 0; if (score > best) { store.set(T.id, "flash", score); $("#fb", el).textContent = score; }
          $("#fq", el).textContent = score + " correct!"; $("#fgo", el).hidden = false; $("#fgo", el).textContent = "Play again";
        }
        $("#fgo", el).onclick = function () { score = 0; left = 60; $("#fs", el).textContent = 0; $("#ft", el).textContent = 60; this.hidden = true; ask(); timer = setInterval(function () { left--; $("#ft", el).textContent = left; if (left <= 0) stop(); }, 1000); };
        var prev = cleanup; cleanup = function () { if (timer) clearInterval(timer); if (prev) prev(); };
      }
    }    ,
    divis: {
      title: "Divisibility tester", html: '<p class="small muted">Type any whole number. Each rule is checked the exam way, without dividing.</p><div class="field"><label for="dn">Number</label><input type="text" id="dn" inputmode="numeric" value="918082"></div><div class="chk" id="dl"></div>',
      init: function (el) {
        function up() {
          var s = $("#dn", el).value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");
          if (!s) { $("#dl", el).innerHTML = '<p class="small muted">Enter a number</p>'; return; }
          if (s.length > 18) s = s.slice(0, 18);
          var d = s.split("").map(Number), sum = d.reduce(function (a, b) { return a + b; }, 0), last = d[d.length - 1];
          var l2 = +s.slice(-2), l3 = +s.slice(-3), odd = 0, even = 0;
          d.slice().reverse().forEach(function (x, i) { if (i % 2) even += x; else odd += x; });
          var diff = odd - even;
          var R = [
            [2, last % 2 === 0, "last digit " + last + (last % 2 ? " is odd" : " is even")],
            [3, sum % 3 === 0, "digit sum " + sum + (sum % 3 ? " is not" : " is") + " a multiple of 3"],
            [4, l2 % 4 === 0, "last two digits " + ("0" + l2).slice(-2) + (l2 % 4 ? " not" : "") + " divisible by 4"],
            [5, last === 0 || last === 5, "last digit " + last],
            [6, last % 2 === 0 && sum % 3 === 0, "needs both 2 and 3"],
            [8, l3 % 8 === 0, "last three digits " + ("00" + l3).slice(-3) + (l3 % 8 ? " not" : "") + " divisible by 8"],
            [9, sum % 9 === 0, "digit sum " + sum + (sum % 9 ? " is not" : " is") + " a multiple of 9"],
            [10, last === 0, "last digit " + last],
            [11, diff % 11 === 0, "odd places " + odd + " − even places " + even + " = " + diff + (diff % 11 ? " (not 0 or a multiple of 11)" : "")]
          ];
          $("#dl", el).innerHTML = R.map(function (r) { return '<div class="' + (r[1] ? "y" : "n") + '"><b>÷ ' + r[0] + '</b><span>' + (r[1] ? "Yes" : "No") + '</span><small>' + esc(r[2]) + '</small></div>'; }).join("");
        }
        $("#dn", el).oninput = up; up();
      }
    },
    factors: {
      title: "Prime factors and factor count", html: '<div class="field"><label for="fn">Number (2 to 1,00,00,000)</label><input type="number" id="fn" value="360" min="2"></div><div class="chain" id="fpf"></div><div class="out" id="fout"></div><div class="fl" id="flist"></div>',
      init: function (el) {
        function up() {
          var n = Math.floor(+$("#fn", el).value);
          if (!(n >= 2 && n <= 1e8)) { $("#fout", el).textContent = "Enter a number from 2 to 1,00,00,000"; $("#fpf", el).innerHTML = $("#flist", el).innerHTML = ""; return; }
          var m = n, pf = [];
          for (var p = 2; p * p <= m; p++) { var e = 0; while (m % p === 0) { m /= p; e++; } if (e) pf.push([p, e]); }
          if (m > 1) pf.push([m, 1]);
          var cnt = pf.reduce(function (a, x) { return a * (x[1] + 1); }, 1);
          var sum = pf.reduce(function (a, x) { return a * (Math.pow(x[0], x[1] + 1) - 1) / (x[0] - 1); }, 1);
          $("#fpf", el).innerHTML = '<span class="v">' + fmtN(n) + '</span><span class="op up">=</span>' + pf.map(function (x) { return '<span class="v">' + x[0] + (x[1] > 1 ? "<sup>" + x[1] + "</sup>" : "") + "</span>"; }).join('<span class="op">×</span>');
          $("#fout", el).innerHTML = cnt + " factors" + (cnt === 2 ? " (a prime number)" : "") + "<small>" + pf.map(function (x) { return "(" + x[1] + " + 1)"; }).join(" × ") + " = " + cnt + " · sum of factors = " + fmtN(sum) + "</small>";
          if (cnt <= 48) { var f = []; for (var d = 1; d * d <= n; d++) if (n % d === 0) { f.push(d); if (d * d !== n) f.push(n / d); } f.sort(function (a, b) { return a - b; }); $("#flist", el).innerHTML = f.map(function (x) { return "<span>" + fmtN(x) + "</span>"; }).join(""); }
          else $("#flist", el).innerHTML = '<p class="small muted">Too many factors to list.</p>';
        }
        $("#fn", el).oninput = up; up();
      }
    },
    hcflcm: {
      title: "HCF and LCM from prime powers", html: '<div class="grid g3"><div class="field"><label for="ha">First</label><input type="number" id="ha" value="12"></div><div class="field"><label for="hb">Second</label><input type="number" id="hb" value="18"></div><div class="field"><label for="hc">Third (optional)</label><input type="number" id="hc" value=""></div></div><div class="tscroll"><table class="pt" id="ht"></table></div><div class="out" id="hout"></div>',
      init: function (el) {
        function pfm(n) { var o = {}; for (var p = 2; p * p <= n; p++) while (n % p === 0) { o[p] = (o[p] || 0) + 1; n /= p; } if (n > 1) o[n] = (o[n] || 0) + 1; return o; }
        function up() {
          var ns = ["#ha", "#hb", "#hc"].map(function (s) { return Math.floor(+$(s, el).value); }).filter(function (x) { return x >= 1 && x <= 1e7; });
          if (ns.length < 2) { $("#ht", el).innerHTML = ""; $("#hout", el).textContent = "Enter at least two numbers (1 to 1,00,00,000)"; return; }
          var F = ns.map(pfm), primes = {};
          F.forEach(function (f) { Object.keys(f).forEach(function (p) { primes[p] = 1; }); });
          var P = Object.keys(primes).map(Number).sort(function (a, b) { return a - b; }), h = 1, l = 1;
          var rows = '<tr><th>Prime</th>' + ns.map(function (x) { return "<th>" + fmtN(x) + "</th>"; }).join("") + "<th>HCF (lowest)</th><th>LCM (highest)</th></tr>";
          P.forEach(function (p) {
            var e = F.map(function (f) { return f[p] || 0; }), lo = Math.min.apply(null, e), hi = Math.max.apply(null, e);
            h *= Math.pow(p, lo); l *= Math.pow(p, hi);
            rows += "<tr><td><b>" + p + "</b></td>" + e.map(function (x) { return "<td>" + (x ? p + "<sup>" + x + "</sup>" : "—") + "</td>"; }).join("") + '<td class="lo">' + (lo ? p + "<sup>" + lo + "</sup>" : "—") + '</td><td class="hi">' + p + "<sup>" + hi + "</sup></td></tr>";
          });
          $("#ht", el).innerHTML = rows || "<tr><td>All numbers are 1</td></tr>";
          $("#hout", el).innerHTML = "HCF = " + fmtN(h) + " · LCM = " + fmtN(l) + "<small>" + (ns.length === 2 ? "Check: HCF × LCM = " + fmtN(h * l) + " = " + fmtN(ns[0]) + " × " + fmtN(ns[1]) + ". " : "") + (h === 1 ? "The numbers are co-prime." : "") + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    unitd: {
      title: "Power cycles: unit digit and remainder", html: '<div class="grid g3"><div class="field"><label for="ub">Base</label><input type="number" id="ub" value="7" min="0"></div><div class="field"><label for="up">Power</label><input type="number" id="up" value="35" min="1"></div><div class="field"><label for="un">Divide by</label><input type="number" id="un" value="10" min="2"></div></div><p class="small muted">Divide by 10 gives the unit digit. Try base 2, divide by 7.</p><div class="chain" id="uc"></div><div class="out" id="uout"></div>',
      init: function (el) {
        function up() {
          var b = Math.floor(+$("#ub", el).value), p = Math.floor(+$("#up", el).value), n = Math.floor(+$("#un", el).value);
          if (!(b >= 0 && b <= 1e6 && p >= 1 && p <= 1e9 && n >= 2 && n <= 1000)) { $("#uc", el).innerHTML = ""; $("#uout", el).textContent = "Base 0–10,00,000, power 1–10⁹, divide by 2–1,000"; return; }
          var seq = [], seen = {}, r = b % n, k = 1, start = -1;
          while (k <= 60) { if (seen[r] !== undefined) { start = seen[r]; break; } seen[r] = seq.length; seq.push(r); r = (r * b) % n; k++; }
          var pre = start < 0 ? seq.length : start, cyc = start < 0 ? [] : seq.slice(start), ans, pos;
          if (p <= seq.length || !cyc.length) { pos = Math.min(p, seq.length) - 1; ans = seq[pos]; }
          else { var j = (p - 1 - pre) % cyc.length; pos = pre + j; ans = cyc[j]; }
          $("#uc", el).innerHTML = seq.map(function (x, i) { return '<span class="v' + (i === pos ? " hit" : "") + '" title="' + b + "^" + (i + 1) + '">' + x + "</span>" + (i === pre - 1 && cyc.length ? '<span class="op up">cycle →</span>' : ""); }).join("") + (cyc.length ? '<span class="op">repeats</span>' : "");
          var how = cyc.length ? "The remainders repeat every " + cyc.length + (pre ? " after the first " + pre : "") + ". " + (p > pre ? (pre ? "(" + p + " − " + pre + ")" : p) + " ÷ " + cyc.length + " leaves " + ((p - pre) % cyc.length) + (((p - pre) % cyc.length) === 0 ? ", so take the last term of the cycle." : ", so take term " + ((p - pre) % cyc.length) + " of the cycle.") : "") : "";
          $("#uout", el).innerHTML = (n === 10 ? "Unit digit of " : "Remainder of ") + b + "<sup>" + p + "</sup>" + (n === 10 ? "" : " ÷ " + n) + " = " + ans + "<small>" + how + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    }
  };
  function tryIt(T, pane) {
    pane.innerHTML = '<div class="grid g2">' + T.tools.map(function (k, i) { return '<div class="card tool" id="tool' + i + '"><h3>' + esc(TOOLS[k].title) + '</h3>' + TOOLS[k].html + '</div>'; }).join("") + '</div><div class="row" style="margin-top:16px;justify-content:flex-end">' + nextBtn(T, "practice", "Practice questions") + '</div>';
    T.tools.forEach(function (k, i) { TOOLS[k].init($("#tool" + i, pane), T); });
    done(T, "try");
  }

  /* ---------- practice ---------- */
  function practice(T, pane) {
    var Q = T.practice, i = 0, right = 0, answered = false, ord;
    function draw() {
      if (i >= Q.length) {
        var best = Math.max(store.get(T.id).practiceBest || 0, right); store.set(T.id, "practiceBest", best); done(T, "practice");
        pane.innerHTML = '<div class="card stack" style="text-align:center"><h2>' + right + ' / ' + Q.length + '</h2><p class="muted">' + (right >= 8 ? "Excellent. You are ready for the timed mini-test." : right >= 5 ? "Good start. Revisit the slides for the ones you missed, then take the mini-test." : "Go back through the slides and Try it tools, then practise again.") + '</p><div class="row" style="justify-content:center"><button class="btn btn-line" id="again">Practise again</button>' + nextBtn(T, "test", "Take the mini-test") + '</div></div>';
        $("#again", pane).onclick = function () { i = 0; right = 0; draw(); };
        return;
      }
      var q = Q[i]; ord = shuffle(q.o.length); answered = false;
      pane.innerHTML = '<div class="card qcard"><div class="row" style="justify-content:space-between"><span class="tag indigo">Question ' + (i + 1) + ' of ' + Q.length + '</span><span class="small muted">Score: ' + right + '</span></div><div class="progress"><i style="width:' + (i / Q.length * 100) + '%"></i></div>' +
        '<p class="qtext">' + esc(q.q) + '</p><div class="opts">' + ord.map(function (k, j) { return '<button class="opt" data-k="' + k + '"><span class="k">' + "ABCD"[j] + "</span>" + esc(q.o[k]) + "</button>"; }).join("") + '</div>' +
        '<div id="fb"></div><div class="row" style="justify-content:space-between">' + (q.hint ? '<button class="btn btn-line btn-sm" id="hint">Need a hint?</button>' : "<span></span>") + '<button class="btn btn-accent" id="nx" hidden style="margin-left:auto">' + (i < Q.length - 1 ? "Next question →" : "See my score →") + '</button></div></div>';
      $$(".opt", pane).forEach(function (b) {
        b.onclick = function () {
          if (answered) return; answered = true; var k = +b.getAttribute("data-k"), ok = k === 0; if (ok) right++;
          $$(".opt", pane).forEach(function (x) { if (+x.getAttribute("data-k") === 0) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          $("#fb", pane).innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct! " : "Not quite. ") + "</b>" + esc(q.why) + "</div>";
          $("#nx", pane).hidden = false; if ($("#hint", pane)) $("#hint", pane).remove();
        };
      });
      if ($("#hint", pane)) $("#hint", pane).onclick = function () { $("#fb", pane).innerHTML = '<div class="hint"><b>Hint:</b> ' + esc(q.hint) + "</div>"; this.remove(); };
      $("#nx", pane).onclick = function () { i++; draw(); };
    }
    draw();
  }

  /* ---------- exam engine (mini-tests now, mocks later) ---------- */
  function runTest(pane, cfg, onDone) {
    var Q = cfg.items, n = Q.length, cur = 0, t0 = Date.now(), total = cfg.minutes * 60, timer;
    var st = Q.map(function (q) { return { ord: shuffle(q.o.length), ans: -1, seen: false, mark: false, time: 0 }; });
    var qStart = Date.now();
    function cls(s) { if (s.mark) return s.ans >= 0 ? "ma" : "mr"; if (s.ans >= 0) return "an"; return s.seen ? "na" : "nv"; }
    function log() { st[cur].time += (Date.now() - qStart) / 1000; qStart = Date.now(); }
    function shell() {
      pane.innerHTML = '<div class="exambar"><b>' + esc(cfg.title) + '</b><span class="row"><span class="small">Time left</span><span class="timer" id="tm"></span></span></div>' +
        '<div class="exam"><div class="card qcard" id="qa"></div><div class="card stack"><b>Question palette</b><div class="palette" id="pal"></div>' +
        '<div class="legend"><span><i style="background:#86EFAC"></i>Answered</span><span><i style="background:#FCA5A5"></i>Not answered</span><span><i style="background:#fff"></i>Not visited</span><span><i style="background:#C4B5FD;border-radius:50%"></i>Marked for review</span></div>' +
        '<p class="small muted">+' + cfg.right + ' for a right answer, −' + cfg.wrong + ' for a wrong one, 0 if left blank.</p><div id="sub"><button class="btn btn-ink" id="sb" style="width:100%">Submit test</button></div></div></div>';
      $("#sb", pane).onclick = confirmSub;
    }
    function draw() {
      var q = Q[cur], s = st[cur]; s.seen = true;
      $("#qa", pane).innerHTML = '<div class="row" style="justify-content:space-between"><span class="tag indigo">Question ' + (cur + 1) + ' of ' + n + '</span>' + (s.mark ? '<span class="tag" style="background:#EDE9FE;color:#5B21B6">Marked for review</span>' : "") + '</div><p class="qtext">' + esc(q.q) + '</p>' +
        '<div class="opts">' + s.ord.map(function (k, j) { return '<button class="opt' + (s.ans === k ? " sel" : "") + '" data-k="' + k + '"><span class="k">' + "ABCD"[j] + "</span>" + esc(q.o[k]) + "</button>"; }).join("") + '</div>' +
        '<div class="row" style="justify-content:space-between;margin-top:6px"><div class="row"><button class="btn btn-line btn-sm" id="mk">Mark for review &amp; next</button><button class="btn btn-line btn-sm" id="cl">Clear response</button></div><div class="row"><button class="btn btn-soft btn-sm" id="pv"' + (cur ? "" : " disabled") + '>← Previous</button><button class="btn btn-accent btn-sm" id="nx">Save &amp; next →</button></div></div>';
      $$("#qa .opt", pane).forEach(function (b) { b.onclick = function () { s.ans = +b.getAttribute("data-k"); $$("#qa .opt", pane).forEach(function (x) { x.classList.toggle("sel", x === b); }); pal(); }; });
      $("#mk", pane).onclick = function () { s.mark = true; go(cur + 1); };
      $("#cl", pane).onclick = function () { s.ans = -1; draw(); };
      $("#pv", pane).onclick = function () { go(cur - 1); };
      $("#nx", pane).onclick = function () { if (s.mark && s.ans >= 0) s.mark = false; go(cur + 1); };
      pal();
    }
    function pal() { $("#pal", pane).innerHTML = st.map(function (s, k) { return '<button class="' + cls(s) + (k === cur ? " cur" : "") + '" data-k="' + k + '" aria-label="Question ' + (k + 1) + '">' + (k + 1) + "</button>"; }).join(""); $$("#pal button", pane).forEach(function (b) { b.onclick = function () { go(+b.getAttribute("data-k")); }; }); }
    function go(k) { log(); cur = Math.max(0, Math.min(n - 1, k)); draw(); }
    function confirmSub() {
      var un = st.filter(function (s) { return s.ans < 0; }).length;
      $("#sub", pane).innerHTML = '<p class="small"><b>Submit now?</b> ' + (un ? un + " question" + (un > 1 ? "s are" : " is") + " unanswered." : "All questions answered.") + '</p><div class="row"><button class="btn btn-ink btn-sm" id="yes">Yes, submit</button><button class="btn btn-line btn-sm" id="no">Back</button></div>';
      $("#yes", pane).onclick = finish; $("#no", pane).onclick = function () { $("#sub", pane).innerHTML = '<button class="btn btn-ink" id="sb" style="width:100%">Submit test</button>'; $("#sb", pane).onclick = confirmSub; };
    }
    function tick() { var left = total - (Date.now() - t0) / 1000; var el = $("#tm", pane); if (!el) return; el.textContent = mmss(left); el.classList.toggle("low", left < 60); if (left <= 0) finish(); }
    function finish() {
      clearInterval(timer); log();
      var c = 0, w = 0; st.forEach(function (s) { if (s.ans === 0) c++; else if (s.ans >= 0) w++; });
      var score = c * cfg.right - w * cfg.wrong, used = Math.min(total, (Date.now() - t0) / 1000);
      var res = { score: r2(score), max: n * cfg.right, c: c, w: w, skip: n - c - w, time: Math.round(used), when: Date.now() };
      track("ssc_test_submit", { test: cfg.id, score: res.score });
      onDone && onDone(res);
      var acc = c + w ? Math.round(c / (c + w) * 100) : 0;
      pane.innerHTML = '<div class="card stack"><h2>Your result</h2><div class="score">' +
        [[res.score + " / " + res.max, "score"], [c + " right · " + w + " wrong", res.skip + " left blank"], [acc + "%", "accuracy"], [mmss(used), "time used"]].map(function (x) { return '<div class="stat"><b style="font-size:22px">' + x[0] + "</b><span>" + x[1] + "</span></div>"; }).join("") + '</div>' +
        '<p class="muted">' + (w * cfg.wrong >= cfg.right ? "Wrong answers cost you " + r2(w * cfg.wrong) + " marks. In the real exam, skip a question when you cannot narrow it down to two options." : "Good control of negative marking.") + '</p>' +
        '<div class="row"><button class="btn btn-accent" id="again">Retake the test</button><button class="btn btn-line" id="rv">Review answers ↓</button></div></div>' +
        '<div class="review" id="review" style="margin-top:16px">' + Q.map(function (q, k) {
          var s = st[k], ok = s.ans === 0, skip = s.ans < 0;
          return '<div class="item ' + (ok ? "r" : skip ? "" : "w") + '"><p><b>Q' + (k + 1) + '.</b> ' + esc(q.q) + '</p><p class="small" style="margin-top:6px">Your answer: <b>' + (skip ? "not answered" : esc(q.o[s.ans])) + '</b> ' + (ok ? "✓" : skip ? "" : "✗") + ' · Correct: <b>' + esc(q.o[0]) + '</b> · ' + Math.round(s.time) + 's</p><p class="small muted" style="margin-top:4px">' + esc(q.why) + "</p></div>";
        }).join("") + '</div>';
      $("#again", pane).onclick = function () { runTest(pane, cfg, onDone); };
      $("#rv", pane).onclick = function () { $("#review", pane).scrollIntoView({ behavior: "smooth" }); };
    }
    shell(); draw(); tick(); timer = setInterval(tick, 500);
    var prev = cleanup; cleanup = function () { clearInterval(timer); if (prev) prev(); };
  }

  function miniTest(T, pane) {
    var p = store.get(T.id), t = T.test;
    pane.innerHTML = '<div class="card stack"><h2>Mini-test: ' + esc(T.title) + '</h2><p class="muted">' + t.items.length + ' questions · ' + t.minutes + ' minutes · +' + t.right + ' for right, −' + t.wrong + ' for wrong. This screen works like the real SSC exam: use the palette, mark questions for review and submit when you are done.</p>' +
      (p.test ? '<p><span class="tag live">Best score: ' + p.test.best + ' / ' + p.test.max + '</span> <span class="tag soon">Last: ' + p.test.last + '</span></p>' : "") +
      '<button class="btn btn-accent" id="go" style="justify-self:start">Start the test</button></div>';
    $("#go", pane).onclick = function () {
      runTest(pane, { id: T.id, title: T.title + " · mini-test", items: t.items, minutes: t.minutes, right: t.right, wrong: t.wrong }, function (res) {
        var old = store.get(T.id).test || {}; store.set(T.id, "test", { best: Math.max(old.best === undefined ? -999 : old.best, res.score), last: res.score, max: res.max });
      });
    };
  }

  function formulas(T, pane) {
    pane.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:12px"><h2>Formula sheet</h2><button class="btn btn-line btn-sm noprint" id="pr">Print or save as PDF</button></div><div class="formula-list">' +
      T.formulas.map(function (f) { return "<div><b>" + esc(f[0]) + "</b><span>" + esc(f[1]) + "</span></div>"; }).join("") + '</div>';
    $("#pr", pane).onclick = function () { window.print(); };
  }

  /* ---------- mocks & progress ---------- */
  function mocks() {
    var h = '<h1>Mock tests</h1><p class="muted" style="margin:8px 0 18px">Every test uses the real exam screen: a question palette, mark for review, a timer and negative marking.</p><div class="grid g2">';
    D.mocks.forEach(function (m) { h += '<div class="card stack"><div class="row" style="justify-content:space-between"><h3>' + esc(m[0]) + '</h3><span class="tag ' + m[2] + '">' + (m[2] === "live" ? "Live" : "Coming soon") + '</span></div><p class="muted small">' + esc(m[1]) + '</p></div>'; });
    h += '</div><div class="sec"><h2>Topic mini-tests available now</h2></div><div class="grid g3">';
    Object.keys(TOP).forEach(function (k) { var T = TOP[k], p = store.get(k); h += '<a class="card stack" style="text-decoration:none;color:inherit" href="#/t/' + k + '/test"><b>' + esc(T.title) + '</b><span class="small muted">' + T.test.items.length + ' Qs · ' + T.test.minutes + ' min</span>' + (p.test ? '<span class="tag live">Best ' + p.test.best + '/' + p.test.max + '</span>' : '<span class="tag indigo">Not attempted</span>') + '</a>'; });
    app.innerHTML = h + '</div>';
  }
  function progress() {
    var h = '<h1>My progress</h1><p class="muted" style="margin:8px 0 18px">Saved in this browser only.</p><div class="grid g2">';
    Object.keys(TOP).forEach(function (k) {
      var T = TOP[k], p = store.get(k), d = topicDone(k);
      h += '<div class="card stack"><div class="row" style="justify-content:space-between"><h3>' + esc(T.title) + '</h3><a class="btn btn-soft btn-sm" href="#/t/' + k + '">Open</a></div><div class="progress"><i style="width:' + d * 20 + '%"></i></div><p class="small muted">' + d + ' of 5 steps · practice best ' + (p.practiceBest || 0) + '/' + T.practice.length + ' · test best ' + (p.test ? p.test.best + '/' + p.test.max : "—") + (T.tools.indexOf("flash") >= 0 ? ' · fraction sprint best ' + (p.flash || 0) : '') + '</p></div>';
    });
    h += '</div><div style="margin-top:20px" id="rs"><button class="btn btn-line btn-sm" id="reset">Reset my progress</button></div>';
    app.innerHTML = h;
    $("#reset").onclick = function () { $("#rs").innerHTML = '<span class="small">Clear all progress? </span><button class="btn btn-ink btn-sm" id="y">Yes, clear</button> <button class="btn btn-line btn-sm" id="n">Cancel</button>'; $("#y").onclick = function () { store.reset(); progress(); }; $("#n").onclick = progress; };
  }

  route();
})();
