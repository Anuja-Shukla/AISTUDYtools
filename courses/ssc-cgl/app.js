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
  function fmtN(x) { return isFinite(x) ? r2(x).toLocaleString("en-IN").replace("-", "−") : "—"; }
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

  var SHC = ["#4F46E5", "#F59E0B", "#10B981", "#EC4899", "#0EA5E9", "#8B5CF6"];
  function shareBar(r, S, labels) {
    var t = r.reduce(function (a, b) { return a + b; }, 0);
    return '<div class="sb">' + r.map(function (x, i) { return '<i style="flex:' + x + ';background:' + SHC[i % 6] + '"><b>' + (labels ? labels[i] : fmtN(x) + (x === 1 ? " part" : " parts")) + '</b><small>' + fmtN(S * x / t) + '</small></i>'; }).join("") + '</div>';
  }
  function viz(x) {
    if (!x) return "";
    if (x.type === "share") return shareBar(x.r, x.total);
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
    }    ,
    bodmas: {
      title: "BODMAS step-by-step solver", html: '<p class="small muted">Type an expression with + − × ÷ ( ) { } [ ] and “of”. You can use * and / too. Each step shows which rule is used.</p><div class="field"><label for="be">Expression</label><input type="text" id="be" value="20 - [12 - {8 - (6 - 3)}] + 3/4 of 8 ÷ 2"></div><div class="row small"><span class="muted">Try:</span><button class="btn btn-sm btn-line" data-x="18 ÷ 3 × 2 + 4 − 6">18 ÷ 3 × 2 + 4 − 6</button><button class="btn btn-sm btn-line" data-x="1001 ÷ 11 of 13">1001 ÷ 11 of 13</button><button class="btn btn-sm btn-line" data-x="1/2 + 1/3 ÷ 1/4 × 1/5">fractions</button></div><ol class="steps" id="bs"></ol><div class="out" id="bout"></div>',
      init: function (el) {
        function g(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
        function Fr(n, d) { if (d < 0) { n = -n; d = -d; } var k = g(n, d); return { n: n / k, d: d / k }; }
        function fromDec(s) { var p = s.split("."), dp = p[1] ? p[1].length : 0; return Fr(Math.round(parseFloat(s) * Math.pow(10, dp)), Math.pow(10, dp)); }
        function num(v) { if (v.indexOf("⁄") > 0) { var q = v.split("⁄"); if (+q[1] === 0) throw new Error("A fraction cannot have 0 below the line"); return Fr(+q[0], +q[1]); } return fromDec(v); }
        function op(a, o, b) { if (o === "+") return Fr(a.n * b.d + b.n * a.d, a.d * b.d); if (o === "−") return Fr(a.n * b.d - b.n * a.d, a.d * b.d); if (o === "×" || o === "of") return Fr(a.n * b.n, a.d * b.d); if (b.n === 0) throw new Error("Division by zero"); return Fr(a.n * b.d, a.d * b.n); }
        function show(f) { return f.d === 1 ? String(f.n).replace("-", "−") : (f.n < 0 ? "−" : "") + Math.abs(f.n) + "/" + f.d; }
        function txt(t) { return t.map(function (x) { return x.v !== undefined ? (x.v.n < 0 && x.v.d === 1 ? "(" + show(x.v) + ")" : show(x.v)) : x.o === "of" ? " of " : "([{".indexOf(x.o) >= 0 ? x.o : ")]}".indexOf(x.o) >= 0 ? x.o : " " + x.o + " "; }).join("").replace(/\s+/g, " ").trim(); }
        function lex(s) {
          s = s.replace(/(\d)\/(\d)/g, "$1⁄$2").replace(/\*/g, "×").replace(/[\/:]/g, "÷").replace(/-/g, "−").replace(/x(?=\s*[\d(\[{])/gi, "×");
          var t = [], m, re = /\s*(\d+⁄\d+|\d+(?:\.\d+)?|of|[+−×÷()\[\]{}])/gy, i = 0;
          while (i < s.length) { re.lastIndex = i; m = re.exec(s); if (!m) { if (/\s/.test(s.slice(i))) break; throw new Error("I can't read “" + s.slice(i, i + 6) + "”"); } i = re.lastIndex; var v = m[1];
            if (/^\d/.test(v)) { var prev = t[t.length - 1], prev2 = t[t.length - 2]; if (prev && prev.o === "−" && (!prev2 || (prev2.o && ")]}".indexOf(prev2.o) < 0))) { t.pop(); t.push({ v: op(Fr(0, 1), "−", num(v)) }); } else t.push({ v: num(v) }); }
            else t.push({ o: v }); }
          if (t.length > 60) throw new Error("Please keep it shorter");
          return t;
        }
        function step(t) {
          var open = -1, close = t.length;
          for (var i = 0; i < t.length; i++) { if (t[i].o && "([{".indexOf(t[i].o) >= 0) open = i; if (t[i].o && ")]}".indexOf(t[i].o) >= 0) { close = i; break; } }
          if (close < t.length && open < 0) throw new Error("A closing bracket has no opening bracket");
          if (open >= 0 && close === t.length) throw new Error("A bracket is not closed");
          var lo = open + 1, hi = close;
          if (hi - lo === 1 && open >= 0) { t.splice(close, 1); t.splice(open, 1); return "Remove the bracket around " + show(t[open].v); }
          var seg = t.slice(lo, hi);
          for (var k = 0; k < seg.length; k++) if ((k % 2 === 0) !== (seg[k].v !== undefined)) throw new Error("Check the expression near “" + txt(seg) + "”");
          var rules = [["of"], ["÷", "×"], ["+", "−"]], names = ["“Of” first", "÷ and × from left to right", "+ and − from left to right"];
          for (var r = 0; r < 3; r++) for (var j = lo + 1; j < hi; j += 2) if (rules[r].indexOf(t[j].o) >= 0) {
            var res = op(t[j - 1].v, t[j].o, t[j + 1].v), d = show(t[j - 1].v) + (t[j].o === "of" ? " of " : " " + t[j].o + " ") + show(t[j + 1].v) + " = " + show(res);
            t.splice(j - 1, 3, { v: res });
            return (open >= 0 ? "Inside " + t[open].o + " " + ")]}"["([{".indexOf(t[open].o)] + ": " : "") + names[r] + ": " + d;
          }
          throw new Error("Check the expression");
        }
        function up() {
          var s = $("#be", el).value, ol = $("#bs", el), out = $("#bout", el);
          try {
            var t = lex(s); if (!t.length) { ol.innerHTML = ""; out.textContent = "Type an expression"; return; }
            var h = "<li><b>Start</b> " + esc(txt(t)) + "</li>", n = 0;
            while (t.length > 1 && n++ < 40) { var why = step(t); h += "<li><span>" + esc(why) + "</span><b>→ " + esc(txt(t)) + "</b></li>"; }
            if (t.length !== 1 || t[0].v === undefined) throw new Error("Check the expression");
            ol.innerHTML = h; var f = t[0].v;
            out.innerHTML = "Answer: " + show(f) + (f.d !== 1 ? "<small>= " + fmtN(f.n / f.d) + " (decimal)</small>" : "");
          } catch (e) { ol.innerHTML = ""; out.textContent = e.message; }
        }
        $("#be", el).oninput = up;
        $$("[data-x]", el).forEach(function (b) { b.onclick = function () { $("#be", el).value = b.getAttribute("data-x"); up(); }; });
        up();
      }
    },
    recur: {
      title: "Recurring decimal to fraction", html: '<div class="grid g3"><div class="field"><label for="rw">Whole part</label><input type="text" id="rw" inputmode="numeric" value="0"></div><div class="field"><label for="rn">Digits that do not repeat</label><input type="text" id="rn" inputmode="numeric" value="1"></div><div class="field"><label for="rr">Digits that repeat</label><input type="text" id="rr" inputmode="numeric" value="6"></div></div><div class="big rd" id="rdec"></div><div class="out" id="rout"></div>',
      init: function (el) {
        function g(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
        function up() {
          var w = $("#rw", el).value.replace(/\D/g, "") || "0", nr = $("#rn", el).value.replace(/\D/g, "").slice(0, 5), rp = $("#rr", el).value.replace(/\D/g, "").slice(0, 5);
          if (!rp) { $("#rdec", el).textContent = ""; $("#rout", el).textContent = "Enter the digits that repeat"; return; }
          var all = +(nr + rp), head = nr ? +nr : 0, den = +(new Array(rp.length + 1).join("9") + new Array(nr.length + 1).join("0")), num = all - head, k = g(num, den) || 1;
          var W = +w, n2 = num / k, d2 = den / k;
          $("#rdec", el).innerHTML = w + "." + nr + '<span style="text-decoration:overline">' + rp + "</span> = " + w + "." + nr + rp + rp + rp + "…";
          $("#rout", el).innerHTML = (W ? W + " + " : "") + n2 + "/" + d2 + (W ? " = " + (W * d2 + n2) + "/" + d2 : "") + "<small>" + (nr ? "(" + nr + rp + " − " + nr + ")" : rp) + " ÷ " + den + " = " + num + "/" + den + (k > 1 ? " = " + n2 + "/" + d2 + " in lowest terms" : "") + ". One 9 for each repeating digit" + (nr ? ", one 0 for each digit that does not repeat" : "") + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    speedx: {
      title: "Speed multiplication coach", html: '<p class="small muted">Enter two whole numbers. The coach picks the fastest exam trick.</p><div class="grid g2"><div class="field"><label for="sa">First number</label><input type="number" id="sa" value="47"></div><div class="field"><label for="sb">Second number</label><input type="number" id="sb" value="53"></div></div><div class="row small"><span class="muted">Try:</span><button class="btn btn-sm btn-line" data-p="98,102">98 × 102</button><button class="btn btn-sm btn-line" data-p="104,107">104 × 107</button><button class="btn btn-sm btn-line" data-p="64,66">64 × 66</button><button class="btn btn-sm btn-line" data-p="48,25">48 × 25</button><button class="btn btn-sm btn-line" data-p="47,999">47 × 999</button></div><div class="out" id="sxo"></div>',
      init: function (el) {
        function N(x) { return x.toLocaleString("en-IN"); }
        function up() {
          var a = Math.floor(+$("#sa", el).value), b = Math.floor(+$("#sb", el).value), o = $("#sxo", el);
          if (!(a > 0 && b > 0 && a < 100000 && b < 100000)) { o.textContent = "Enter two whole numbers below 1,00,000"; return; }
          var p = a * b, t, nines = [9, 99, 999, 9999], x = Math.max(a, b), y = Math.min(a, b);
          if (a <= 12 && b <= 12) t = ["Times table", "Learn tables up to 20 × 20 by heart"];
          else if (nines.indexOf(b) >= 0 || nines.indexOf(a) >= 0) { var n9 = nines.indexOf(b) >= 0 ? b : a, other = n9 === b ? a : b; t = ["Multiply by " + (n9 + 1) + " and subtract once", N(other) + " × " + N(n9 + 1) + " − " + N(other) + " = " + N(other * (n9 + 1)) + " − " + N(other)]; }
          else if (a === 25 || b === 25) { var o25 = a === 25 ? b : a; t = ["× 25 = × 100 ÷ 4", N(o25) + " × 100 ÷ 4 = " + N(o25 * 100) + " ÷ 4"]; }
          else if (a === 125 || b === 125) { var o125 = a === 125 ? b : a; t = ["× 125 = × 1000 ÷ 8", N(o125) + " × 1000 ÷ 8 = " + N(o125 * 1000) + " ÷ 8"]; }
          else if ((a + b) % 2 === 0 && a !== b && ((a + b) / 2) % 5 === 0 && Math.abs(a - b) / 2 <= 12) { var m = (a + b) / 2, h = Math.abs(a - b) / 2; t = ["a² − b²: both are " + h + " away from " + m, m + "² − " + h + "² = " + N(m * m) + " − " + N(h * h)]; }
          else if (a >= 10 && b >= 10 && Math.floor(a / 10) === Math.floor(b / 10) && a % 10 + b % 10 === 10) { var tn = Math.floor(a / 10); t = ["Same tens, units add to 10", tn + " × " + (tn + 1) + " = " + N(tn * (tn + 1)) + ", then " + (a % 10) + " × " + (b % 10) + " = " + ("0" + (a % 10) * (b % 10)).slice(-2) + " → write them side by side"]; }
          else { var base = [10, 100, 1000, 10000].filter(function (B) { return Math.abs(a - B) <= B * 0.15 && Math.abs(b - B) <= B * 0.15; })[0];
            if (base) { var da = a - base, db = b - base; t = ["Base " + N(base) + ": deviations " + (da >= 0 ? "+" : "−") + Math.abs(da) + " and " + (db >= 0 ? "+" : "−") + Math.abs(db), "(" + N(a) + (db >= 0 ? " + " : " − ") + Math.abs(db) + ") × " + N(base) + (da * db >= 0 ? " + " : " − ") + N(Math.abs(da * db)) + " = " + N((a + db) * base) + (da * db >= 0 ? " + " : " − ") + N(Math.abs(da * db))]; }
            else { var r = Math.round(y / 10) * 10 || 10, dd = y - r; t = ["Split into an easy part", N(x) + " × " + r + (dd >= 0 ? " + " : " − ") + N(x) + " × " + Math.abs(dd) + " = " + N(x * r) + (dd >= 0 ? " + " : " − ") + N(x * Math.abs(dd))]; } }
          o.innerHTML = N(a) + " × " + N(b) + " = " + N(p) + "<small><b>" + esc(t[0]) + "</b><br>" + esc(t[1]) + " = " + N(p) + "</small>";
        }
        $("#sa", el).oninput = up; $("#sb", el).oninput = up;
        $$("[data-p]", el).forEach(function (b) { b.onclick = function () { var v = b.getAttribute("data-p").split(","); $("#sa", el).value = v[0]; $("#sb", el).value = v[1]; up(); }; });
        up();
      }
    },
    sqsprint: {
      title: "60-second squares, cubes and roots sprint", html: '<div class="flash"><p class="small muted">Squares to 30², cubes to 15³ and square roots. Answer as many as you can.</p><div class="big" id="qq">Ready?</div><div class="opts" id="qo" style="max-width:420px;margin:0 auto;width:100%"></div><div class="row" style="justify-content:center"><span class="tag indigo">Score: <b id="qs">0</b></span><span class="tag">Time: <b id="qt">60</b>s</span><span class="tag live">Best: <b id="qb">0</b></span></div><button class="btn btn-accent" id="qgo" style="justify-self:center">Start sprint</button></div>',
      init: function (el, T) {
        var timer = null, score = 0, left = 60;
        $("#qb", el).textContent = store.get(T.id).sprint || 0;
        function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
        function ask() {
          var kind = rnd(0, 2), n, q, ans, opts;
          if (kind === 0) { n = rnd(11, 30); q = n + "²"; ans = n * n; opts = [ans, (n + 1) * (n + 1), (n - 1) * (n - 1), ans + 10]; }
          else if (kind === 1) { n = rnd(2, 15); q = n + "³"; ans = n * n * n; opts = [ans, (n + 1) * (n + 1) * (n + 1), (n - 1) * (n - 1) * (n - 1), n * n * 3]; }
          else { n = rnd(11, 30); q = "√" + (n * n); ans = n; opts = [n, n + 1, n - 1, n + 2]; }
          opts = opts.filter(function (v, i) { return opts.indexOf(v) === i; });
          var ord = shuffle(opts.length);
          $("#qq", el).textContent = q;
          $("#qo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (opts[k] === ans ? 1 : 0) + '">' + opts[k].toLocaleString("en-IN") + "</button>"; }).join("");
          $$("#qo .opt", el).forEach(function (b) { b.onclick = function () { if (!timer) return; if (b.getAttribute("data-ok") === "1") { score++; $("#qs", el).textContent = score; ask(); } else { b.classList.add("wrong"); score = Math.max(0, score - 1); $("#qs", el).textContent = score; } }; });
        }
        function stop() {
          clearInterval(timer); timer = null; $("#qo", el).innerHTML = "";
          var best = store.get(T.id).sprint || 0; if (score > best) { store.set(T.id, "sprint", score); $("#qb", el).textContent = score; }
          $("#qq", el).textContent = score + " correct!"; $("#qgo", el).hidden = false; $("#qgo", el).textContent = "Play again";
        }
        $("#qgo", el).onclick = function () { score = 0; left = 60; $("#qs", el).textContent = 0; $("#qt", el).textContent = 60; this.hidden = true; ask(); timer = setInterval(function () { left--; $("#qt", el).textContent = left; if (left <= 0) stop(); }, 1000); };
        var prev = cleanup; cleanup = function () { if (timer) clearInterval(timer); if (prev) prev(); };
      }
    }    ,
    share: {
      title: "Share an amount in a ratio", html: '<div class="grid g2"><div class="field"><label for="ha2">Amount</label><input type="number" id="ha2" value="1800"></div><div class="field"><label for="hr2">Ratio (e.g. 2:3:4)</label><input type="text" id="hr2" value="2:3:4"></div></div><div class="sbar" id="hb2"></div><div class="out" id="ho2"></div>',
      init: function (el) {
        function up() {
          var S = parseFloat($("#ha2", el).value), r = $("#hr2", el).value.split(/[:,\s]+/).filter(Boolean).map(Number);
          if (!(S > 0) || r.length < 2 || r.length > 6 || r.some(function (x) { return !(x > 0); })) { $("#hb2", el).innerHTML = ""; $("#ho2", el).textContent = "Enter an amount and 2 to 6 positive ratio terms, like 2:3:4"; return; }
          $("#hb2", el).innerHTML = shareBar(r, S);
          var t = r.reduce(function (a, b) { return a + b; }, 0), one = S / t;
          $("#ho2", el).innerHTML = r.map(function (x) { return fmtN(one * x); }).join(" : ") + "<small>" + fmtN(t) + " parts in all, so 1 part = " + fmtN(S) + " ÷ " + fmtN(t) + " = " + fmtN(one) + ". Each share = its parts × " + fmtN(one) + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    chain: {
      title: "Join two ratios", html: '<p class="small muted">A : B and B : C → A : B : C, by making B the same.</p><div class="grid g2"><div class="field"><label>A : B</label><div class="row"><input type="number" id="ca" value="2" style="width:80px"><b>:</b><input type="number" id="cb" value="3" style="width:80px"></div></div><div class="field"><label>B : C</label><div class="row"><input type="number" id="cb2" value="4" style="width:80px"><b>:</b><input type="number" id="cc" value="5" style="width:80px"></div></div></div><div class="out" id="cho"></div>',
      init: function (el) {
        function g(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
        function up() {
          var a = Math.round(+$("#ca", el).value), b = Math.round(+$("#cb", el).value), b2 = Math.round(+$("#cb2", el).value), c = Math.round(+$("#cc", el).value);
          if (![a, b, b2, c].every(function (x) { return x > 0 && x < 10000; })) { $("#cho", el).textContent = "Enter four positive whole numbers"; return; }
          var L = b * b2 / g(b, b2), m1 = L / b, m2 = L / b2, A = a * m1, B = L, C = c * m2, k = g(g(A, B), C);
          A /= k; B /= k; C /= k; var k2 = g(A, C);
          $("#cho", el).innerHTML = "A : B : C = " + A + " : " + B + " : " + C + "<small>B is " + b + " and " + b2 + "; LCM = " + L + ". Multiply A : B by " + m1 + " → " + a * m1 + " : " + L + ", and B : C by " + m2 + " → " + L + " : " + c * m2 + (k > 1 ? ", then divide all by " + k : "") + ". So A : C = " + A / k2 + " : " + C / k2 + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    propn: {
      title: "Proportion finder", html: '<div class="field"><label for="pk">Find the…</label><select id="pk"><option value="4">Fourth proportional to a, b, c</option><option value="3">Third proportional to a, b</option><option value="m">Mean proportional of a, b</option><option value="t">Are a, b, c, d in proportion?</option></select></div><div class="grid g4"><div class="field"><label for="pa">a</label><input type="number" id="pa" value="4"></div><div class="field"><label for="pb">b</label><input type="number" id="pb" value="6"></div><div class="field"><label for="pc">c</label><input type="number" id="pc" value="10"></div><div class="field"><label for="pd">d</label><input type="number" id="pd" value="15"></div></div><div class="out" id="po2"></div>',
      init: function (el) {
        function up() {
          var k = $("#pk", el).value, a = parseFloat($("#pa", el).value), b = parseFloat($("#pb", el).value), c = parseFloat($("#pc", el).value), d = parseFloat($("#pd", el).value), o = $("#po2", el);
          $("#pc", el).parentNode.hidden = k === "3" || k === "m"; $("#pd", el).parentNode.hidden = k !== "t";
          if (!(a > 0 && b > 0) || ((k === "4" || k === "t") && !(c > 0)) || (k === "t" && !(d > 0))) { o.textContent = "Enter positive numbers"; return; }
          if (k === "4") o.innerHTML = "Fourth proportional = " + fmtN(b * c / a) + "<small>" + fmtN(a) + " : " + fmtN(b) + " :: " + fmtN(c) + " : x → x = " + fmtN(b) + " × " + fmtN(c) + " ÷ " + fmtN(a) + "</small>";
          else if (k === "3") o.innerHTML = "Third proportional = " + fmtN(b * b / a) + "<small>" + fmtN(a) + " : " + fmtN(b) + " :: " + fmtN(b) + " : x → x = " + fmtN(b) + "² ÷ " + fmtN(a) + "</small>";
          else if (k === "m") o.innerHTML = "Mean proportional = " + fmtN(Math.sqrt(a * b)) + "<small>" + fmtN(a) + " : x :: x : " + fmtN(b) + " → x = √(" + fmtN(a) + " × " + fmtN(b) + ") = √" + fmtN(a * b) + "</small>";
          else { var e = a * d, m = b * c; o.innerHTML = (Math.abs(e - m) < 1e-9 ? "Yes, they are in proportion" : "No, they are not in proportion") + "<small>Extremes: " + fmtN(a) + " × " + fmtN(d) + " = " + fmtN(e) + ". Means: " + fmtN(b) + " × " + fmtN(c) + " = " + fmtN(m) + ".</small>"; }
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    makeratio: {
      title: "Add or subtract to reach a ratio", html: '<p class="small muted">What number added to (or taken from) both a and b turns their ratio into p : q?</p><div class="grid g4"><div class="field"><label for="ma">a</label><input type="number" id="ma" value="7"></div><div class="field"><label for="mb">b</label><input type="number" id="mb" value="11"></div><div class="field"><label for="mp">p</label><input type="number" id="mp" value="3"></div><div class="field"><label for="mq">q</label><input type="number" id="mq" value="4"></div></div><div class="sbar" id="mbar"></div><div class="out" id="mo"></div>',
      init: function (el) {
        function up() {
          var a = parseFloat($("#ma", el).value), b = parseFloat($("#mb", el).value), p = parseFloat($("#mp", el).value), q = parseFloat($("#mq", el).value), o = $("#mo", el);
          if (![a, b, p, q].every(isFinite) || !(p > 0 && q > 0)) { o.textContent = "Enter four numbers"; $("#mbar", el).innerHTML = ""; return; }
          if (p === q) { o.textContent = "p and q must be different"; $("#mbar", el).innerHTML = ""; return; }
          if (Math.abs(a * q - b * p) < 1e-9) { o.innerHTML = "Already in the ratio " + p + " : " + q; $("#mbar", el).innerHTML = ""; return; }
          var x = (p * b - q * a) / (q - p), na = a + x, nb = b + x;
          $("#mbar", el).innerHTML = na > 0 && nb > 0 ? shareBar([na, nb], na + nb, ["a + x", "b + x"]) : "";
          o.innerHTML = (x >= 0 ? "Add " + fmtN(x) : "Subtract " + fmtN(-x)) + "<small>(" + fmtN(a) + " + x) ÷ (" + fmtN(b) + " + x) = " + p + " ÷ " + q + " → x = (" + p + " × " + fmtN(b) + " − " + q + " × " + fmtN(a) + ") ÷ (" + q + " − " + p + ") = " + fmtN(x) + ". Check: " + fmtN(na) + " : " + fmtN(nb) + (na > 0 && nb > 0 ? "" : " (not possible with positive numbers)") + ".</small>";
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
      h += '<div class="card stack"><div class="row" style="justify-content:space-between"><h3>' + esc(T.title) + '</h3><a class="btn btn-soft btn-sm" href="#/t/' + k + '">Open</a></div><div class="progress"><i style="width:' + d * 20 + '%"></i></div><p class="small muted">' + d + ' of 5 steps · practice best ' + (p.practiceBest || 0) + '/' + T.practice.length + ' · test best ' + (p.test ? p.test.best + '/' + p.test.max : "—") + (T.tools.indexOf("flash") >= 0 ? ' · fraction sprint best ' + (p.flash || 0) : '') + (T.tools.indexOf("sqsprint") >= 0 ? ' · squares sprint best ' + (p.sprint || 0) : '') + '</p></div>';
    });
    h += '</div><div style="margin-top:20px" id="rs"><button class="btn btn-line btn-sm" id="reset">Reset my progress</button></div>';
    app.innerHTML = h;
    $("#reset").onclick = function () { $("#rs").innerHTML = '<span class="small">Clear all progress? </span><button class="btn btn-ink btn-sm" id="y">Yes, clear</button> <button class="btn btn-line btn-sm" id="n">Cancel</button>'; $("#y").onclick = function () { store.reset(); progress(); }; $("#n").onclick = progress; };
  }

  route();
})();
