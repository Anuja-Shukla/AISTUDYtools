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
  function allig(c, d, m) {
    return '<div class="allig"><div class="ax c">' + fmtN(c) + '<small>cheaper</small></div><div class="ax d">' + fmtN(d) + '<small>dearer</small></div><div class="ax m">' + fmtN(m) + '<small>mean</small></div><div class="ax rc">' + fmtN(d - m) + '<small>parts of cheaper</small></div><div class="ax rd">' + fmtN(m - c) + '<small>parts of dearer</small></div><svg viewBox="0 0 300 150" preserveAspectRatio="none" aria-hidden="true"><path d="M70 30 L230 120 M230 30 L70 120" stroke="#C7C9F2" stroke-width="3" fill="none"/></svg></div>';
  }
  function gcd2(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function lcm(a, b) { return Math.abs(a * b) / gcd2(a, b); }
  function unitsViz(ds) {
    var L = ds.reduce(function (a, d) { return lcm(a, Math.abs(d)); }, 1);
    if (L > 400) return '<p class="small muted">Job = ' + L + " units (too many to draw).</p>";
    return '<div class="uviz"><div class="ul">Job = LCM = <b>' + L + " units</b></div>" + ds.map(function (d, i) { var r = L / Math.abs(d), cells = ""; for (var k = 0; k < Math.min(r, 60); k++) cells += "<i></i>"; return '<div class="ur"><b>' + "ABC"[i] + "</b><span class=\"" + (d < 0 ? "neg" : "") + '">' + cells + "</span><small>" + (d < 0 ? "−" : "") + fmtN(r) + " a day</small></div>"; }).join("") + "</div>";
  }
  function sqViz(a, b) {
    var s = a + b, pa = a / s * 100;
    return '<div class="sqv"><div style="grid-template-columns:' + pa + '% ' + (100 - pa) + '%;grid-template-rows:' + pa + '% ' + (100 - pa) + '%"><i class="aa">a² = ' + fmtN(a * a) + '</i><i class="ab">ab = ' + fmtN(a * b) + '</i><i class="ab">ab = ' + fmtN(a * b) + '</i><i class="bb">b² = ' + fmtN(b * b) + "</i></div><small>side a + b = " + fmtN(s) + "</small></div>";
  }
  function lineGraph(v, x, y) {
    var R = Math.max(6, Math.ceil(Math.max(Math.abs(x), Math.abs(y)) * 1.6)), W = 220, sc = function (u) { return (u + R) / (2 * R) * W; };
    function seg(a, b, c, col) {
      var pts = [];
      if (Math.abs(b) > 1e-12) { [-R, R].forEach(function (xx) { pts.push([xx, (c - a * xx) / b]); }); }
      else { [-R, R].forEach(function (yy) { pts.push([c / a, yy]); }); }
      return '<line x1="' + sc(pts[0][0]) + '" y1="' + (W - sc(pts[0][1])) + '" x2="' + sc(pts[1][0]) + '" y2="' + (W - sc(pts[1][1])) + '" stroke="' + col + '" stroke-width="3"/>';
    }
    return '<svg class="lg2" viewBox="0 0 ' + W + " " + W + '" role="img" aria-label="Two lines crossing"><rect width="' + W + '" height="' + W + '" fill="#FAFAFF"/><line x1="0" y1="' + W / 2 + '" x2="' + W + '" y2="' + W / 2 + '" stroke="#D6D7EE"/><line x1="' + W / 2 + '" y1="0" x2="' + W / 2 + '" y2="' + W + '" stroke="#D6D7EE"/>' + seg(v[0], v[1], v[2], "#4F46E5") + seg(v[3], v[4], v[5], "#F59E0B") + '<circle cx="' + sc(x) + '" cy="' + (W - sc(y)) + '" r="6" fill="#1E1B4B"/></svg>';
  }
  function triSvg(A, B, C) {
    var r = Math.PI / 180, bx = 0, by = 0, cx = 1, cy = 0, b = Math.sin(B * r) / Math.sin(A * r), ax = b * Math.cos(C * r), ay = b * Math.sin(C * r);
    ax = 1 - ax;
    var xs = [ax, bx, cx], ys = [ay, by, cy], mnx = Math.min.apply(null, xs), mxx = Math.max.apply(null, xs), mxy = Math.max.apply(null, ys), s = 180 / Math.max(mxx - mnx, mxy, .2);
    var P = function (x, y) { return (20 + (x - mnx) * s).toFixed(1) + "," + (200 - 14 - y * s).toFixed(1); };
    var lab = function (x, y, t, dy) { var p = P(x, y).split(","); return '<text x="' + p[0] + '" y="' + (+p[1] + dy) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#1E1B4B">' + t + "</text>"; };
    return '<svg class="geo" viewBox="0 0 ' + (40 + (mxx - mnx) * s) + ' 220" role="img" aria-label="Triangle"><polygon points="' + P(ax, ay) + " " + P(bx, by) + " " + P(cx, cy) + '" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2.5"/>' + lab(ax, ay, "A " + fmtN(A) + "°", -6) + lab(bx, by, "B " + fmtN(B) + "°", 16) + lab(cx, cy, "C " + fmtN(C) + "°", 16) + "</svg>";
  }
  function rtSvg(a, b, h) {
    var s = 150 / Math.max(a, b), W = a * s, H = b * s;
    return '<svg class="geo" viewBox="-30 -10 ' + (W + 90) + " " + (H + 40) + '" role="img" aria-label="Right triangle"><polygon points="0,0 0,' + H + " " + W + "," + H + '" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2.5"/><rect x="0" y="' + (H - 12) + '" width="12" height="12" fill="none" stroke="#4F46E5"/><text x="-6" y="' + H / 2 + '" text-anchor="end" font-size="13" font-weight="700" fill="#1E1B4B">' + fmtN(b) + '</text><text x="' + W / 2 + '" y="' + (H + 18) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#1E1B4B">' + fmtN(a) + '</text><text x="' + (W / 2 + 10) + '" y="' + (H / 2 - 6) + '" font-size="13" font-weight="800" fill="#3730A3">' + fmtN(h) + "</text></svg>";
  }
  function circSvg(k, a, b) {
    if (k === "t") { var R = 50, d = R * a / b, t = Math.sqrt(d * d - R * R), ang = Math.asin(R / d), tx = d - (t * Math.cos(ang)) * Math.cos(ang), ty = t * Math.cos(ang) * Math.sin(ang);
      tx = R * R / d; ty = R * Math.sqrt(1 - R * R / (d * d));
      return '<svg class="geo" viewBox="' + (-R - 10) + " " + (-R - 10) + " " + (d + R + 30) + " " + (2 * R + 20) + '" role="img" aria-label="Tangent from a point"><circle r="' + R + '" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2"/><line x1="0" y1="0" x2="' + d + '" y2="0" stroke="#94A3B8" stroke-dasharray="4 3"/><line x1="0" y1="0" x2="' + tx + '" y2="' + (-ty) + '" stroke="#4F46E5" stroke-width="2"/><line x1="' + tx + '" y1="' + (-ty) + '" x2="' + d + '" y2="0" stroke="#F59E0B" stroke-width="3"/><circle cx="' + d + '" cy="0" r="3.5" fill="#1E1B4B"/><circle r="3" fill="#1E1B4B"/></svg>'; }
    var Rr = 60, dd = Rr * b / a, hc = Math.sqrt(Rr * Rr - dd * dd);
    return '<svg class="geo" viewBox="-70 -70 140 140" role="img" aria-label="Chord"><circle r="' + Rr + '" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2"/><line x1="' + (-hc) + '" y1="' + dd + '" x2="' + hc + '" y2="' + dd + '" stroke="#F59E0B" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="' + dd + '" stroke="#94A3B8" stroke-dasharray="4 3"/><line x1="0" y1="0" x2="' + hc + '" y2="' + dd + '" stroke="#4F46E5" stroke-width="2"/><circle r="3" fill="#1E1B4B"/></svg>';
  }
  function polySvg(n) {
    if (n > 24) return "";
    var pts = []; for (var i = 0; i < n; i++) { var t = -Math.PI / 2 + i * 2 * Math.PI / n; pts.push((60 + 50 * Math.cos(t)).toFixed(1) + "," + (60 + 50 * Math.sin(t)).toFixed(1)); }
    return '<svg class="geo sm" viewBox="0 0 120 120" role="img" aria-label="Regular polygon"><polygon points="' + pts.join(" ") + '" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2.5"/></svg>';
  }
  function barsSvg(L, V, cap) {
    var n = V.length, mx = Math.max.apply(null, V) || 1, W = 320, H = 160, bw = W / n * 0.6, g = W / n;
    return '<svg class="dich" viewBox="0 0 ' + W + " " + (H + 34) + '" role="img" aria-label="' + esc(cap || "Bar chart") + '">' + (cap ? '<text x="0" y="12" font-size="11" fill="#6E6C94">' + esc(cap) + "</text>" : "") + V.map(function (v, i) { var h = v / mx * (H - 20), x = i * g + (g - bw) / 2; return '<rect x="' + x + '" y="' + (H + 14 - h) + '" width="' + bw + '" height="' + h + '" rx="4" fill="' + SHC[i % 6] + '"/><text x="' + (x + bw / 2) + '" y="' + (H + 10 - h) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#1E1B4B">' + fmtN(v) + '</text><text x="' + (x + bw / 2) + '" y="' + (H + 30) + '" text-anchor="middle" font-size="11" fill="#4A4878">' + esc(L[i]) + "</text>"; }).join("") + '<line x1="0" y1="' + (H + 14) + '" x2="' + W + '" y2="' + (H + 14) + '" stroke="#C7C9F2"/></svg>';
  }
  function pieSvg(L, P) {
    var a0 = -Math.PI / 2, out = "", tot = P.reduce(function (a, b) { return a + b; }, 0) || 1;
    P.forEach(function (p, i) {
      var a1 = a0 + p / tot * 2 * Math.PI, la = a1 - a0 > Math.PI ? 1 : 0, x0 = 80 + 70 * Math.cos(a0), y0 = 80 + 70 * Math.sin(a0), x1 = 80 + 70 * Math.cos(a1), y1 = 80 + 70 * Math.sin(a1), m = (a0 + a1) / 2;
      out += p >= tot - 1e-9 ? '<circle cx="80" cy="80" r="70" fill="' + SHC[i % 6] + '"/>' : '<path d="M80 80 L' + x0.toFixed(2) + " " + y0.toFixed(2) + " A70 70 0 " + la + " 1 " + x1.toFixed(2) + " " + y1.toFixed(2) + ' Z" fill="' + SHC[i % 6] + '" stroke="#fff" stroke-width="1.5"/>';
      if (p / tot > 0.06) out += '<text x="' + (80 + 45 * Math.cos(m)).toFixed(1) + '" y="' + (84 + 45 * Math.sin(m)).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">' + fmtN(p) + "%</text>";
      a0 = a1;
    });
    return '<svg class="dich pie" viewBox="0 0 160 160" role="img" aria-label="Pie chart">' + out + "</svg>";
  }
  function dotsSvg(x, m, med) {
    var mn = Math.min.apply(null, x), mx = Math.max.apply(null, x), sp = mx - mn || 1, W = 320, cnt = {}, sc = function (v) { return 16 + (v - mn) / sp * (W - 32); }, out = "";
    x.slice().sort(function (a, b) { return a - b; }).forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; out += '<circle cx="' + sc(v).toFixed(1) + '" cy="' + (96 - cnt[v] * 13) + '" r="5.5" fill="#4F46E5"/>'; });
    var mark = function (v, col, lab, y) { return '<line x1="' + sc(v) + '" y1="20" x2="' + sc(v) + '" y2="100" stroke="' + col + '" stroke-width="2" stroke-dasharray="4 3"/><text x="' + sc(v) + '" y="' + y + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + col + '">' + lab + " " + fmtN(v) + "</text>"; };
    return '<svg class="dich" viewBox="0 0 ' + W + ' 130" role="img" aria-label="Dot plot"><line x1="10" y1="100" x2="' + (W - 10) + '" y2="100" stroke="#C7C9F2" stroke-width="2"/>' + out + mark(m, "#F59E0B", "mean", 14) + mark(med, "#10B981", "median", 122) + '<text x="16" y="116" font-size="10" fill="#6E6C94">' + fmtN(mn) + '</text><text x="' + (W - 16) + '" y="116" font-size="10" fill="#6E6C94" text-anchor="end">' + fmtN(mx) + "</text></svg>";
  }
  function altViz(S) {
    return '<div class="altv">' + S.map(function (x, i) { return '<span class="' + (i % 2 ? "e" : "o") + '">' + fmtN(x) + "</span>"; }).join("") + '<span class="q">?</span></div>';
  }
  function alphaViz() {
    var h = '<div class="alv">';
    for (var i = 1; i <= 26; i++) h += '<span class="' + (i % 5 === 0 ? "k" : "") + '"><b>' + String.fromCharCode(64 + i) + "</b>" + i + "</span>";
    return h + "</div>";
  }
  function viz(x) {
    if (!x) return "";
    if (x.type === "share") return shareBar(x.r, x.total);
    if (x.type === "alpha") return alphaViz();
    if (x.type === "alt") return altViz(x.v);
    if (x.type === "dots") { var mm = x.v.reduce(function (a, b) { return a + b; }, 0) / x.v.length, ss = x.v.slice().sort(function (a, b) { return a - b; }), nn = ss.length; return dotsSvg(x.v, mm, nn % 2 ? ss[(nn - 1) / 2] : (ss[nn / 2 - 1] + ss[nn / 2]) / 2); }
    if (x.type === "bars") return barsSvg(x.l, x.v);
    if (x.type === "pie") return '<div class="grid g2" style="align-items:center">' + pieSvg(x.l, x.v) + '<div class="small">' + x.l.map(function (n, i) { return '<div><i class="sw2" style="background:' + SHC[i % 6] + '"></i>' + esc(n) + " " + x.v[i] + "%</div>"; }).join("") + "</div></div>";
    if (x.type === "cone") return '<svg class="geo sm" viewBox="0 0 220 120" role="img" aria-label="Cylinder and cone"><ellipse cx="55" cy="22" rx="40" ry="10" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2"/><path d="M15 22 V98 A40 10 0 0 0 95 98 V22" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2"/><line x1="55" y1="22" x2="95" y2="22" stroke="#F59E0B" stroke-width="2"/><text x="72" y="17" font-size="11" fill="#1E1B4B" font-weight="700">r</text><text x="100" y="62" font-size="11" fill="#1E1B4B" font-weight="700">h</text><path d="M125 98 L165 14 L205 98 A40 10 0 0 1 125 98" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/><line x1="165" y1="14" x2="165" y2="98" stroke="#94A3B8" stroke-dasharray="3 3"/><text x="187" y="50" font-size="11" fill="#1E1B4B" font-weight="700">l</text></svg>';
    if (x.type === "rt") return rtSvg(x.a, x.b, Math.hypot(x.a, x.b));
    if (x.type === "sq") return sqViz(x.a, x.b);
    if (x.type === "units") return unitsViz(x.d);
    if (x.type === "allig") return allig(x.c, x.d, x.m);
    if (x.type === "chainprice") { var mp = x.cp * (1 + x.up / 100), sp = mp * (1 - x.d / 100); return '<div class="chain" style="margin:8px 0"><span class="v">CP ' + fmtN(x.cp) + '</span><span class="op up">+' + x.up + '%</span><span class="v">MP ' + fmtN(mp) + '</span><span class="op dn">−' + x.d + '%</span><span class="v">SP ' + fmtN(sp) + "</span></div>"; }
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
    }    ,
    devavg: {
      title: "Deviation method, visually", html: '<p class="small muted">Enter numbers and a base. Bars show how far each number is from the base; the average is where they balance.</p><div class="grid g2"><div class="field"><label for="dvn">Numbers (comma separated)</label><input type="text" id="dvn" value="72, 75, 78, 81, 74"></div><div class="field"><label for="dvb">Base (assumed average)</label><input type="number" id="dvb" value="75"></div></div><div class="dev" id="dvc"></div><div class="out" id="dvo"></div>',
      init: function (el) {
        function up() {
          var xs = $("#dvn", el).value.split(/[,\s;]+/).filter(Boolean).map(Number).filter(isFinite).slice(0, 20), b = parseFloat($("#dvb", el).value);
          if (xs.length < 2 || !isFinite(b)) { $("#dvc", el).innerHTML = ""; $("#dvo", el).textContent = "Enter at least two numbers and a base"; return; }
          var d = xs.map(function (x) { return x - b; }), s = d.reduce(function (a, c) { return a + c; }, 0), avg = b + s / xs.length, m = Math.max.apply(null, d.map(Math.abs).concat([Math.abs(avg - b), 1]));
          $("#dvc", el).innerHTML = '<div class="dvrow base"><span>base ' + fmtN(b) + '</span><i></i></div>' + xs.map(function (x, i) { var w = Math.abs(d[i]) / m * 50; return '<div class="dvrow"><span>' + fmtN(x) + '</span><i><b class="' + (d[i] >= 0 ? "p" : "n") + '" style="width:' + w + '%;' + (d[i] >= 0 ? "left:50%" : "right:50%") + '"></b><em style="' + (d[i] >= 0 ? "left:calc(50% + " + w + "% + 4px)" : "right:calc(50% + " + w + "% + 4px)") + '">' + (d[i] >= 0 ? "+" : "−") + fmtN(Math.abs(d[i])) + '</em></i></div>'; }).join("") + '<div class="dvrow avg"><span>average</span><i><b style="left:calc(50% + ' + ((avg - b) / m * 50) + '% - 1px)"></b></i></div>';
          $("#dvo", el).innerHTML = "Average = " + fmtN(avg) + "<small>Differences add up to " + (s >= 0 ? "+" : "−") + fmtN(Math.abs(s)) + "; ÷ " + xs.length + " = " + (s >= 0 ? "+" : "−") + fmtN(Math.abs(s / xs.length)) + ". So " + fmtN(b) + (s >= 0 ? " + " : " − ") + fmtN(Math.abs(s / xs.length)) + " = " + fmtN(avg) + ". Check: total " + fmtN(avg * xs.length) + " ÷ " + xs.length + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    joinleave: {
      title: "Join, leave or replace", html: '<div class="field"><label for="jm">What happens?</label><select id="jm"><option value="join">Someone joins the group</option><option value="leave">Someone leaves the group</option><option value="replace">Someone is replaced</option></select></div><div class="grid g4"><div class="field"><label for="jn">People now</label><input type="number" id="jn" value="10"></div><div class="field"><label for="ja">Average now</label><input type="number" id="ja" value="15"></div><div class="field"><label for="jb">New average</label><input type="number" id="jb" value="16"></div><div class="field" id="jow"><label for="jo">Value of the one replaced</label><input type="number" id="jo" value="52"></div></div><div class="out" id="jout"></div>',
      init: function (el) {
        function up() {
          var mo = $("#jm", el).value, n = Math.round(+$("#jn", el).value), a = parseFloat($("#ja", el).value), b = parseFloat($("#jb", el).value), o = parseFloat($("#jo", el).value), out = $("#jout", el);
          $("#jow", el).hidden = mo !== "replace";
          if (!(n >= (mo === "leave" ? 2 : 1)) || !isFinite(a) || !isFinite(b) || (mo === "replace" && !isFinite(o))) { out.textContent = "Fill in all the boxes" + (mo === "leave" ? " (at least 2 people)" : ""); return; }
          var T = n * a, v, how;
          if (mo === "join") { v = b * (n + 1) - T; how = "New total " + fmtN(b) + " × " + (n + 1) + " = " + fmtN(b * (n + 1)) + " minus old total " + fmtN(a) + " × " + n + " = " + fmtN(T) + ". Shortcut: new avg + " + n + " × (" + fmtN(b) + " − " + fmtN(a) + ")."; out.innerHTML = "The person who joined = " + fmtN(v) + "<small>" + how + "</small>"; }
          else if (mo === "leave") { v = T - b * (n - 1); how = "Old total " + fmtN(T) + " minus new total " + fmtN(b) + " × " + (n - 1) + " = " + fmtN(b * (n - 1)) + ". Shortcut: new avg − " + n + " × (" + fmtN(b) + " − " + fmtN(a) + ")."; out.innerHTML = "The person who left = " + fmtN(v) + "<small>" + how + "</small>"; }
          else { v = o + n * (b - a); out.innerHTML = "The new person = " + fmtN(v) + "<small>The count stays " + n + ", so the total changes by " + n + " × (" + fmtN(b) + " − " + fmtN(a) + ") = " + fmtN(n * (b - a)) + ". New person = " + fmtN(o) + (b - a >= 0 ? " + " : " − ") + fmtN(Math.abs(n * (b - a))) + ".</small>"; }
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    combavg: {
      title: "Combined average of groups", html: '<p class="small muted">Add up to four groups. The bigger group pulls the combined average towards its own.</p><table class="pt" id="cgt"><tr><th>Group</th><th>Count</th><th>Average</th></tr>' + [["A", 30, 60], ["B", 20, 70], ["C", "", ""], ["D", "", ""]].map(function (g, i) { return "<tr><td><b>" + g[0] + '</b></td><td><input type="number" class="cgn" data-i="' + i + '" value="' + g[1] + '" style="width:90px"></td><td><input type="number" class="cga" data-i="' + i + '" value="' + g[2] + '" style="width:90px"></td></tr>'; }).join("") + '</table><div class="scale" id="cgs"></div><div class="out" id="cgo"></div>',
      init: function (el) {
        function up() {
          var G = [];
          $$(".cgn", el).forEach(function (inp, i) { var n = parseFloat(inp.value), a = parseFloat($$(".cga", el)[i].value); if (n > 0 && isFinite(a)) G.push({ l: "ABCD"[i], n: n, a: a }); });
          if (!G.length) { $("#cgs", el).innerHTML = ""; $("#cgo", el).textContent = "Enter a count and an average for at least one group"; return; }
          var N = G.reduce(function (s, g) { return s + g.n; }, 0), T = G.reduce(function (s, g) { return s + g.n * g.a; }, 0), c = T / N;
          var lo = Math.min.apply(null, G.map(function (g) { return g.a; }).concat([c])), hi = Math.max.apply(null, G.map(function (g) { return g.a; }).concat([c])), span = hi - lo || 1;
          $("#cgs", el).innerHTML = '<div class="sl"></div>' + G.map(function (g, i) { return '<span class="sw" style="left:' + ((g.a - lo) / span * 90 + 5) + '%;width:' + (14 + 30 * g.n / N) + 'px;height:' + (14 + 30 * g.n / N) + 'px;background:' + SHC[i] + '" title="' + g.l + '">' + g.l + "</span>"; }).join("") + '<span class="sc" style="left:' + ((c - lo) / span * 90 + 5) + '%">▲ ' + fmtN(c) + "</span>";
          $("#cgo", el).innerHTML = "Combined average = " + fmtN(c) + "<small>(" + G.map(function (g) { return fmtN(g.n) + " × " + fmtN(g.a); }).join(" + ") + ") ÷ " + fmtN(N) + " = " + fmtN(T) + " ÷ " + fmtN(N) + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    avgspeed: {
      title: "Average speed trap", html: '<div class="grid g3"><div class="field"><label for="sx">Speed going (km/h)</label><input type="number" id="sx" value="40"></div><div class="field"><label for="sy">Speed returning (km/h)</label><input type="number" id="sy" value="60"></div><div class="field"><label for="sd">One-way distance (km)</label><input type="number" id="sd" value="120"></div></div><div class="bars" id="sbars"></div><div class="out" id="sout2"></div>',
      init: function (el) {
        function up() {
          var x = parseFloat($("#sx", el).value), y = parseFloat($("#sy", el).value), d = parseFloat($("#sd", el).value), o = $("#sout2", el);
          if (!(x > 0 && y > 0 && d > 0)) { o.textContent = "Enter positive speeds and a distance"; $("#sbars", el).innerHTML = ""; return; }
          var t1 = d / x, t2 = d / y, av = 2 * d / (t1 + t2), am = (x + y) / 2, m = Math.max(t1, t2);
          $("#sbars", el).innerHTML = '<div class="b"><b>Going</b><span class="bar" style="width:' + (t1 / m * 100) + '%"></span><span>' + fmtN(t1) + ' h</span></div><div class="b"><b>Return</b><span class="bar n" style="width:' + (t2 / m * 100) + '%"></span><span>' + fmtN(t2) + " h</span></div>";
          o.innerHTML = "Average speed = " + fmtN(av) + " km/h<small>Total distance " + fmtN(2 * d) + " km ÷ total time " + fmtN(t1 + t2) + " h. Formula: 2 × " + fmtN(x) + " × " + fmtN(y) + " ÷ (" + fmtN(x) + " + " + fmtN(y) + ") = " + fmtN(2 * x * y / (x + y)) + ". Adding and halving gives " + fmtN(am) + (Math.abs(am - av) > 1e-9 ? ", which is wrong: you spend longer at the slower speed." : ", correct only because the speeds are equal.") + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    }    ,
    siSolve: {
      title: "Simple interest solver", html: '<div class="field"><label for="sq">Find the…</label><select id="sq"><option value="si">Interest (SI)</option><option value="p">Principal (P)</option><option value="r">Rate (R %)</option><option value="t">Time (T years)</option></select></div><div class="grid g4"><div class="field" data-f="p"><label for="sp2">Principal ₹</label><input type="number" id="sp2" value="5000"></div><div class="field" data-f="r"><label for="sr">Rate % per year</label><input type="number" id="sr" value="8"></div><div class="field" data-f="t"><label for="st">Time (years)</label><input type="number" id="st" value="3"></div><div class="field" data-f="si"><label for="ss">Interest ₹</label><input type="number" id="ss" value="1200"></div></div><div class="yrs" id="syr"></div><div class="out" id="sio"></div>',
      init: function (el) {
        function up() {
          var q = $("#sq", el).value, P = parseFloat($("#sp2", el).value), R = parseFloat($("#sr", el).value), T = parseFloat($("#st", el).value), I = parseFloat($("#ss", el).value), o = $("#sio", el);
          $$("[data-f]", el).forEach(function (f) { f.hidden = f.getAttribute("data-f") === q; });
          var how;
          if (q === "si") { if (!(P > 0 && R > 0 && T > 0)) { o.textContent = "Enter P, R and T"; return; } I = P * R * T / 100; how = fmtN(P) + " × " + fmtN(R) + " × " + fmtN(T) + " ÷ 100"; o.innerHTML = "SI = ₹" + fmtN(I) + "<small>" + how + ". Amount = ₹" + fmtN(P + I) + ".</small>"; }
          else if (q === "p") { if (!(I > 0 && R > 0 && T > 0)) { o.textContent = "Enter SI, R and T"; return; } P = I * 100 / (R * T); o.innerHTML = "Principal = ₹" + fmtN(P) + "<small>P = SI × 100 ÷ (R × T) = " + fmtN(I) + " × 100 ÷ (" + fmtN(R) + " × " + fmtN(T) + ")</small>"; }
          else if (q === "r") { if (!(I > 0 && P > 0 && T > 0)) { o.textContent = "Enter SI, P and T"; return; } R = I * 100 / (P * T); o.innerHTML = "Rate = " + fmtN(R) + "% per year<small>R = SI × 100 ÷ (P × T) = " + fmtN(I) + " × 100 ÷ (" + fmtN(P) + " × " + fmtN(T) + ")</small>"; }
          else { if (!(I > 0 && P > 0 && R > 0)) { o.textContent = "Enter SI, P and R"; return; } T = I * 100 / (P * R); o.innerHTML = "Time = " + fmtN(T) + " years<small>T = SI × 100 ÷ (P × R) = " + fmtN(I) + " × 100 ÷ (" + fmtN(P) + " × " + fmtN(R) + ")</small>"; }
          var n = Math.min(Math.ceil(T), 15), per = P * R / 100, h = "";
          for (var k = 1; k <= n; k++) h += '<span title="Year ' + k + '">Yr ' + k + "<b>₹" + fmtN(per * Math.min(1, T - k + 1)) + "</b></span>";
          $("#syr", el).innerHTML = isFinite(per) && n > 0 ? h : "";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    sivsci: {
      title: "SI vs CI, year by year", html: '<div class="grid g4"><div class="field"><label for="vp">Principal ₹</label><input type="number" id="vp" value="10000"></div><div class="field"><label for="vr">Rate % per year</label><input type="number" id="vr" value="10"></div><div class="field"><label for="vn">Years</label><input type="number" id="vn" value="5" min="1" max="20"></div><div class="field"><label for="vf">Compounded</label><select id="vf"><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option></select></div></div><div class="chart" id="vch"></div><div class="tscroll"><table class="pt" id="vtb"></table></div><div class="out" id="vo"></div>',
      init: function (el) {
        function up() {
          var P = parseFloat($("#vp", el).value), R = parseFloat($("#vr", el).value), N = Math.round(+$("#vn", el).value), f = +$("#vf", el).value, o = $("#vo", el);
          if (!(P > 0 && R > 0 && N >= 1 && N <= 20)) { o.textContent = "Enter P, R and 1–20 years"; $("#vch", el).innerHTML = $("#vtb", el).innerHTML = ""; return; }
          var rows = [], mx = 0;
          for (var y = 1; y <= N; y++) { var si = P * (1 + R * y / 100), ci = P * Math.pow(1 + R / 100 / f, f * y); rows.push([y, si, ci]); mx = Math.max(mx, ci, si); }
          var W = 100 / N;
          $("#vch", el).innerHTML = rows.map(function (r) { return '<div class="col" style="width:' + W + '%"><i class="s" style="height:' + (r[1] / mx * 100) + '%"></i><i class="c" style="height:' + (r[2] / mx * 100) + '%"></i><small>' + r[0] + "</small></div>"; }).join("") + '<div class="lg"><span class="s">SI amount</span><span class="c">CI amount</span></div>';
          $("#vtb", el).innerHTML = "<tr><th>Year</th><th>SI amount</th><th>CI amount</th><th>CI − SI</th></tr>" + rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>₹" + fmtN(r[1]) + "</td><td>₹" + fmtN(r[2]) + "</td><td>₹" + fmtN(r[2] - r[1]) + "</td></tr>"; }).join("");
          var last = rows[N - 1];
          o.innerHTML = "After " + N + " year" + (N > 1 ? "s" : "") + ": SI ₹" + fmtN(last[1] - P) + " · CI ₹" + fmtN(last[2] - P) + "<small>CI: " + fmtN(P) + " × (1 + " + fmtN(R / f) + "/100)^" + f * N + (f > 1 ? " (rate ÷ " + f + ", periods × " + f + ")" : "") + ". The gap grows because CI earns interest on interest.</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    cidiff: {
      title: "CI − SI shortcut", html: '<div class="grid g3"><div class="field"><label for="dp">Principal ₹</label><input type="number" id="dp" value="10000"></div><div class="field"><label for="dr">Rate %</label><input type="number" id="dr" value="10"></div><div class="field"><label for="dn2">Years</label><select id="dn2"><option>2</option><option>3</option></select></div></div><div class="field"><label for="dd">…or enter the difference to find the principal</label><input type="number" id="dd" placeholder="e.g. 25"></div><div class="out" id="do2"></div>',
      init: function (el) {
        function up() {
          var P = parseFloat($("#dp", el).value), R = parseFloat($("#dr", el).value), n = +$("#dn2", el).value, D = parseFloat($("#dd", el).value), o = $("#do2", el), k = R / 100;
          if (!(R > 0)) { o.textContent = "Enter a rate"; return; }
          var fac = n === 2 ? k * k : k * k * (3 + k), fs = n === 2 ? "(" + fmtN(R) + "/100)²" : "(" + fmtN(R) + "/100)² × (3 + " + fmtN(R) + "/100)";
          if (D > 0) { o.innerHTML = "Principal = ₹" + fmtN(D / fac) + "<small>Difference ÷ " + fs + " = " + fmtN(D) + " ÷ " + (+fac.toPrecision(6)) + "</small>"; return; }
          if (!(P > 0)) { o.textContent = "Enter a principal"; return; }
          var ci = P * Math.pow(1 + k, n) - P, si = P * k * n;
          o.innerHTML = "CI − SI = ₹" + fmtN(P * fac) + "<small>Shortcut: " + fmtN(P) + " × " + fs + ". Check: CI ₹" + fmtN(ci) + " − SI ₹" + fmtN(si) + " = ₹" + fmtN(ci - si) + ".</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    multiply: {
      title: "Money multiplier: doubling and n times", html: '<div class="grid g4"><div class="field"><label for="mt">Interest type</label><select id="mt"><option value="si">Simple</option><option value="ci">Compound</option></select></div><div class="field"><label for="mx">Becomes … times</label><input type="number" id="mx" value="2"></div><div class="field"><label for="my">in … years</label><input type="number" id="my" value="8"></div><div class="field"><label for="mz">When will it be … times?</label><input type="number" id="mz" value="3"></div></div><div class="out" id="mo2"></div>',
      init: function (el) {
        function up() {
          var t = $("#mt", el).value, n = parseFloat($("#mx", el).value), T = parseFloat($("#my", el).value), m = parseFloat($("#mz", el).value), o = $("#mo2", el);
          if (!(n > 1 && T > 0 && m > 1)) { o.textContent = "Times must be more than 1 and years more than 0"; return; }
          if (t === "si") { var R = 100 * (n - 1) / T, T2 = 100 * (m - 1) / R; o.innerHTML = "Rate " + fmtN(R) + "% · " + fmtN(m) + " times in " + fmtN(T2) + " years<small>SI: R × T = 100 × (n − 1). R = 100 × " + fmtN(n - 1) + " ÷ " + fmtN(T) + ". For " + fmtN(m) + " times: T = 100 × " + fmtN(m - 1) + " ÷ " + fmtN(R) + ".</small>"; }
          else { var Rc = (Math.pow(n, 1 / T) - 1) * 100, T3 = T * Math.log(m) / Math.log(n), k = Math.log(m) / Math.log(n), whole = Math.abs(k - Math.round(k)) < 1e-9; o.innerHTML = "Rate ≈ " + fmtN(Rc) + "% · " + fmtN(m) + " times in " + fmtN(T3) + " years<small>CI multiplies: " + (whole ? fmtN(m) + " = " + fmtN(n) + "^" + Math.round(k) + ", so " + Math.round(k) + " × " + fmtN(T) + " years. " : "") + "Rate = (" + fmtN(n) + "^(1/" + fmtN(T) + ") − 1) × 100.</small>"; }
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    }    ,
    plcalc: {
      title: "Profit and loss calculator", html: '<div class="field"><label for="pm">I know…</label><select id="pm"><option value="cs">CP and SP</option><option value="cp">CP and profit / loss %</option><option value="sp">SP and profit / loss %</option></select></div><div class="grid g3"><div class="field" data-g="c"><label for="pc2">Cost price ₹</label><input type="number" id="pc2" value="400"></div><div class="field" data-g="s"><label for="ps2">Selling price ₹</label><input type="number" id="ps2" value="500"></div><div class="field" data-g="p"><label for="pp2">Profit % (use − for loss)</label><input type="number" id="pp2" value="15"></div></div><div class="bars" id="pbars"></div><div class="out" id="pout"></div>',
      init: function (el) {
        function up() {
          var m = $("#pm", el).value, c = parseFloat($("#pc2", el).value), s = parseFloat($("#ps2", el).value), p = parseFloat($("#pp2", el).value), o = $("#pout", el), how;
          $$("[data-g]", el).forEach(function (f) { var g = f.getAttribute("data-g"); f.hidden = (m === "cs" && g === "p") || (m === "cp" && g === "s") || (m === "sp" && g === "c"); });
          if (m === "cs") { if (!(c > 0 && s >= 0)) { o.textContent = "Enter CP and SP"; return; } p = (s - c) / c * 100; how = "(" + fmtN(s) + " − " + fmtN(c) + ") ÷ " + fmtN(c) + " × 100"; }
          else if (m === "cp") { if (!(c > 0) || !(p > -100)) { o.textContent = "Enter CP and a % above −100"; return; } s = c * (100 + p) / 100; how = "SP = " + fmtN(c) + " × " + fmtN((100 + p) / 100) + " = ₹" + fmtN(s); }
          else { if (!(s > 0) || !(p > -100)) { o.textContent = "Enter SP and a % above −100"; return; } c = s * 100 / (100 + p); how = "CP = " + fmtN(s) + " ÷ " + fmtN((100 + p) / 100) + " = ₹" + fmtN(c) + " (divide; don't subtract " + fmtN(Math.abs(p)) + "% of the SP)"; }
          var mx = Math.max(c, s) || 1;
          $("#pbars", el).innerHTML = '<div class="b"><b>CP</b><span class="bar" style="width:' + (c / mx * 100) + '%"></span><span>₹' + fmtN(c) + '</span></div><div class="b"><b>SP</b><span class="bar n" style="width:' + (s / mx * 100) + '%"></span><span>₹' + fmtN(s) + "</span></div>";
          o.innerHTML = (Math.abs(s - c) < 1e-9 ? "No profit, no loss" : (s > c ? "Profit ₹" : "Loss ₹") + fmtN(Math.abs(s - c)) + " = " + fmtN(Math.abs(p)) + "%") + "<small>" + how + ". The % is always on the cost price.</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    mpchain: {
      title: "Cost → marked → selling price", html: '<div class="grid g3"><div class="field"><label for="mcp">Cost price ₹</label><input type="number" id="mcp" value="100"></div><div class="field"><label for="mup">Marked up by %</label><input type="number" id="mup" value="40"></div><div class="field"><label for="mds">Discount %</label><input type="number" id="mds" value="25"></div></div><div class="chain" id="mch"></div><div class="out" id="mo3"></div><div class="field" style="margin-top:6px"><label for="mtg">Target profit % (to find the mark-up needed)</label><input type="number" id="mtg" value="20"></div><div class="out" id="mo4"></div>',
      init: function (el) {
        function up() {
          var c = parseFloat($("#mcp", el).value), u = parseFloat($("#mup", el).value), d = parseFloat($("#mds", el).value), tg = parseFloat($("#mtg", el).value);
          if (!(c > 0) || !isFinite(u) || !(d >= 0 && d < 100)) { $("#mch", el).innerHTML = ""; $("#mo3", el).textContent = "Enter CP, mark-up and a discount below 100%"; return; }
          var mp = c * (1 + u / 100), sp = mp * (1 - d / 100), p = (sp - c) / c * 100;
          $("#mch", el).innerHTML = '<span class="v">CP ₹' + fmtN(c) + '</span><span class="op up">+' + fmtN(u) + '%</span><span class="v">MP ₹' + fmtN(mp) + '</span><span class="op dn">−' + fmtN(d) + '%</span><span class="v">SP ₹' + fmtN(sp) + "</span>";
          $("#mo3", el).innerHTML = (p >= 0 ? "Profit " : "Loss ") + fmtN(Math.abs(p)) + "%<small>" + fmtN(1 + u / 100) + " × " + fmtN(1 - d / 100) + " = " + fmtN((1 + u / 100) * (1 - d / 100)) + ". Mark-up is on CP; discount is on MP, so they don't cancel.</small>";
          $("#mo4", el).innerHTML = isFinite(tg) && tg > -100 ? "Mark up by " + fmtN(((100 + tg) / (100 - d) - 1) * 100) + "%<small>For " + fmtN(tg) + "% profit after " + fmtN(d) + "% off: MP ÷ CP = (100 + " + fmtN(tg) + ") ÷ (100 − " + fmtN(d) + ") = " + fmtN((100 + tg) / (100 - d)) + "</small>" : "Enter a target profit %";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    discs: {
      title: "Successive discounts", html: '<div class="grid g2"><div class="field"><label for="dmp">Marked price ₹</label><input type="number" id="dmp" value="5000"></div><div class="field"><label for="dls">Discounts % (comma separated)</label><input type="text" id="dls" value="20, 10"></div></div><div class="chain" id="dch"></div><div class="out" id="dout"></div>',
      init: function (el) {
        function up() {
          var M = parseFloat($("#dmp", el).value), ds = $("#dls", el).value.split(/[,\s;]+/).filter(Boolean).map(Number).filter(function (x) { return x >= 0 && x < 100; }).slice(0, 6), o = $("#dout", el);
          if (!(M > 0) || !ds.length) { $("#dch", el).innerHTML = ""; o.textContent = "Enter a marked price and discounts below 100%"; return; }
          var v = M, h = '<span class="v">₹' + fmtN(M) + "</span>";
          ds.forEach(function (d) { v *= 1 - d / 100; h += '<span class="op dn">−' + fmtN(d) + '%</span><span class="v">₹' + fmtN(v) + "</span>"; });
          $("#dch", el).innerHTML = h;
          var single = (1 - v / M) * 100, sum = ds.reduce(function (a, b) { return a + b; }, 0);
          o.innerHTML = "Single equivalent discount = " + fmtN(single) + "%<small>Selling price ₹" + fmtN(v) + ". Adding them gives " + fmtN(sum) + "%, which is too much: each later discount is on a smaller price." + (ds.length === 2 ? " Formula: " + fmtN(ds[0]) + " + " + fmtN(ds[1]) + " − " + fmtN(ds[0]) + " × " + fmtN(ds[1]) + " ÷ 100." : "") + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    dealer: {
      title: "Dishonest dealer and free offers", html: '<div class="field"><label for="dk">Situation</label><select id="dk"><option value="w">Uses a false weight</option><option value="f">Buy x, get y free</option><option value="a">CP of a items = SP of b items</option></select></div><div class="grid g3"><div class="field"><label for="d1" id="d1l">True weight (g)</label><input type="number" id="d1" value="1000"></div><div class="field"><label for="d2" id="d2l">Weight used (g)</label><input type="number" id="d2" value="900"></div><div class="field" id="d3w"><label for="d3">Also sells above CP by %</label><input type="number" id="d3" value="0"></div></div><div class="out" id="dko"></div>',
      init: function (el) {
        var L = { w: ["True weight (g)", "Weight used (g)"], f: ["Buy (x)", "Get free (y)"], a: ["a (CP side)", "b (SP side)"] }, last = "w";
        function up() {
          var k = $("#dk", el).value, a = parseFloat($("#d1", el).value), b = parseFloat($("#d2", el).value), m = parseFloat($("#d3", el).value) || 0, o = $("#dko", el);
          if (k !== last) { last = k; $("#d1", el).value = k === "w" ? 1000 : k === "f" ? 3 : 12; $("#d2", el).value = k === "w" ? 900 : k === "f" ? 1 : 10; a = +$("#d1", el).value; b = +$("#d2", el).value; }
          $("#d1l", el).textContent = L[k][0]; $("#d2l", el).textContent = L[k][1]; $("#d3w", el).hidden = k !== "w";
          if (!(a > 0 && b > 0)) { o.textContent = "Enter two positive numbers"; return; }
          if (k === "w") { var f = (1 + m / 100) * a / b, p = (f - 1) * 100; o.innerHTML = (p >= 0 ? "Profit " : "Loss ") + fmtN(Math.abs(p)) + "%<small>" + (m ? "(1 + " + fmtN(m) + "/100) × " : "") + fmtN(a) + " ÷ " + fmtN(b) + " = " + (+f.toFixed(4)) + ". He charges for " + fmtN(a) + " g but gives only " + fmtN(b) + " g.</small>"; }
          else if (k === "f") o.innerHTML = "Effective discount = " + fmtN(b / (a + b) * 100) + "%<small>" + fmtN(b) + " free out of " + fmtN(a + b) + " items: " + fmtN(b) + " ÷ " + fmtN(a + b) + ". (Not " + fmtN(b) + " ÷ " + fmtN(a) + ".)</small>";
          else { var q = (a - b) / b * 100; o.innerHTML = (q >= 0 ? "Profit " : "Loss ") + fmtN(Math.abs(q)) + "%<small>(" + fmtN(a) + " − " + fmtN(b) + ") ÷ " + fmtN(b) + " × 100. The money from " + fmtN(b) + " items pays for " + fmtN(a) + ".</small>"; }
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    }    ,
    partsplit: {
      title: "Partnership profit splitter", html: '<p class="small muted">Enter each partner\'s capital and months in the business (leave a row blank to skip it).</p><table class="pt"><tr><th>Partner</th><th>Capital ₹</th><th>Months</th></tr>' + [["A", 50000, 12], ["B", 60000, 8], ["C", "", ""], ["D", "", ""]].map(function (g, i) { return "<tr><td><b>" + g[0] + '</b></td><td><input type="number" class="psc" value="' + g[1] + '" style="width:110px"></td><td><input type="number" class="psm" value="' + g[2] + '" style="width:70px"></td></tr>'; }).join("") + '</table><div class="field"><label for="psp">Total profit ₹</label><input type="number" id="psp" value="18000"></div><div id="psb"></div><div class="out" id="pso"></div>',
      init: function (el) {
        function g(a, b) { a = Math.round(a); b = Math.round(b); while (b) { var t = a % b; a = b; b = t; } return a; }
        function up() {
          var P = parseFloat($("#psp", el).value), rows = [];
          $$(".psc", el).forEach(function (c, i) { var cap = parseFloat(c.value), m = parseFloat($$(".psm", el)[i].value); if (cap > 0 && m > 0) rows.push({ l: "ABCD"[i], u: cap * m, cap: cap, m: m }); });
          if (rows.length < 2 || !(P > 0)) { $("#psb", el).innerHTML = ""; $("#pso", el).textContent = "Enter at least two partners and the profit"; return; }
          var k = rows.reduce(function (a, r) { return g(a, r.u); }, 0) || 1, R = rows.map(function (r) { return r.u / k; }), T = R.reduce(function (a, b) { return a + b; }, 0);
          $("#psb", el).innerHTML = shareBar(R, P, rows.map(function (r) { return r.l; }));
          $("#pso", el).innerHTML = rows.map(function (r, i) { return r.l + " ₹" + fmtN(P * R[i] / T); }).join(" · ") + "<small>Capital × months: " + rows.map(function (r) { return fmtN(r.cap) + " × " + fmtN(r.m); }).join(", ") + " → ratio " + R.map(fmtN).join(" : ") + " (" + fmtN(T) + " parts, 1 part = ₹" + fmtN(P / T) + ").</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    captime: {
      title: "Changing capital timeline", html: '<p class="small muted">Write each partner\'s capital and months in order, e.g. <b>30000x6, 20000x6</b> (invested 30,000 for 6 months, then 20,000 for 6 months).</p><div class="field"><label for="cta">Partner A</label><input type="text" id="cta" value="5000x3, 7000x9"></div><div class="field"><label for="ctb">Partner B</label><input type="text" id="ctb" value="4000x3, 3000x9"></div><div class="tl" id="ctl"></div><div class="out" id="cto"></div>',
      init: function (el) {
        function parse(s) { return s.split(/[,;]+/).map(function (p) { var m = p.replace(/\s/g, "").match(/^([\d.]+)[x×*]([\d.]+)$/i); return m ? { c: +m[1], m: +m[2] } : null; }).filter(Boolean); }
        function up() {
          var A = parse($("#cta", el).value), B = parse($("#ctb", el).value), o = $("#cto", el);
          if (!A.length || !B.length) { $("#ctl", el).innerHTML = ""; o.textContent = "Write blocks like 30000x6, 20000x6"; return; }
          var tot = Math.max(A.reduce(function (s, b) { return s + b.m; }, 0), B.reduce(function (s, b) { return s + b.m; }, 0)), mx = Math.max.apply(null, A.concat(B).map(function (b) { return b.c; }));
          function row(L, bl, col) { return '<div class="tlr"><b>' + L + "</b><div>" + bl.map(function (b) { return '<i style="flex:' + b.m + ';height:' + (12 + 26 * b.c / mx) + 'px;background:' + col + '" title="' + fmtN(b.c) + " × " + fmtN(b.m) + '"><small>' + fmtN(b.c) + " × " + fmtN(b.m) + "</small></i>"; }).join("") + (tot > bl.reduce(function (s, b) { return s + b.m; }, 0) ? '<i style="flex:' + (tot - bl.reduce(function (s, b) { return s + b.m; }, 0)) + ';height:6px;background:#EEEEF3"></i>' : "") + "</div></div>"; }
          $("#ctl", el).innerHTML = row("A", A, SHC[0]) + row("B", B, SHC[1]);
          var ua = A.reduce(function (s, b) { return s + b.c * b.m; }, 0), ub = B.reduce(function (s, b) { return s + b.c * b.m; }, 0), gg = function (a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }, k = gg(Math.round(ua), Math.round(ub)) || 1;
          o.innerHTML = "A : B = " + fmtN(ua / k) + " : " + fmtN(ub / k) + "<small>A = " + A.map(function (b) { return fmtN(b.c) + " × " + fmtN(b.m); }).join(" + ") + " = " + fmtN(ua) + ". B = " + B.map(function (b) { return fmtN(b.c) + " × " + fmtN(b.m); }).join(" + ") + " = " + fmtN(ub) + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    workp: {
      title: "Working partner's share", html: '<div class="grid g2"><div class="field"><label for="wp">Total profit ₹</label><input type="number" id="wp" value="50000"></div><div class="field"><label for="ws">Working partner gets first (% of profit)</label><input type="number" id="ws" value="10"></div><div class="field"><label for="wa">Capital share of A (working partner)</label><input type="number" id="wa" value="3"></div><div class="field"><label for="wb">Capital share of B</label><input type="number" id="wb" value="2"></div></div><div class="out" id="wo"></div>',
      init: function (el) {
        function up() {
          var P = parseFloat($("#wp", el).value), s = parseFloat($("#ws", el).value) || 0, a = parseFloat($("#wa", el).value), b = parseFloat($("#wb", el).value), o = $("#wo", el);
          if (!(P > 0 && a > 0 && b > 0) || s < 0 || s >= 100) { o.textContent = "Enter the profit, a % below 100 and two positive shares"; return; }
          var fee = P * s / 100, rest = P - fee, A = fee + rest * a / (a + b), B = rest * b / (a + b);
          o.innerHTML = "A gets ₹" + fmtN(A) + " · B gets ₹" + fmtN(B) + "<small>First A's " + fmtN(s) + "% = ₹" + fmtN(fee) + ". The remaining ₹" + fmtN(rest) + " is shared " + fmtN(a) + " : " + fmtN(b) + " → A ₹" + fmtN(rest * a / (a + b)) + ", B ₹" + fmtN(B) + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    findmiss: {
      title: "Find the missing months or capital", html: '<div class="field"><label for="fk">Find…</label><select id="fk"><option value="m">B\'s months</option><option value="c">B\'s capital</option></select></div><div class="grid g3"><div class="field"><label for="fa1">A\'s capital ₹</label><input type="number" id="fa1" value="3000"></div><div class="field"><label for="fa2">A\'s months</label><input type="number" id="fa2" value="12"></div><div class="field" id="fbw"><label for="fb" id="fbl">B\'s capital ₹</label><input type="number" id="fb" value="4000"></div><div class="field"><label for="fr1">Profit ratio A</label><input type="number" id="fr1" value="1"></div><div class="field"><label for="fr2">Profit ratio B</label><input type="number" id="fr2" value="1"></div></div><div class="out" id="fmo"></div>',
      init: function (el) {
        var last = "m";
        function up() {
          var k = $("#fk", el).value;
          if (k !== last) { last = k; $("#fb", el).value = k === "m" ? 4000 : 8; }
          $("#fbl", el).textContent = k === "m" ? "B's capital ₹" : "B's months";
          var c = parseFloat($("#fa1", el).value), m = parseFloat($("#fa2", el).value), x = parseFloat($("#fb", el).value), p = parseFloat($("#fr1", el).value), q = parseFloat($("#fr2", el).value), o = $("#fmo", el);
          if (!(c > 0 && m > 0 && x > 0 && p > 0 && q > 0)) { o.textContent = "Fill in all the boxes"; return; }
          var ub = c * m * q / p;
          if (k === "m") { var t = ub / x; o.innerHTML = "B was in for " + fmtN(t) + " months" + (m === 12 && t < 12 ? " (joined after " + fmtN(12 - t) + ")" : "") + "<small>A's capital-months = " + fmtN(c * m) + ". B needs " + fmtN(c * m) + " × " + fmtN(q) + "/" + fmtN(p) + " = " + fmtN(ub) + ", so months = " + fmtN(ub) + " ÷ " + fmtN(x) + ".</small>"; }
          else o.innerHTML = "B's capital = ₹" + fmtN(ub / x) + "<small>B needs " + fmtN(ub) + " capital-months; ÷ " + fmtN(x) + " months = ₹" + fmtN(ub / x) + ".</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    }
    ,
    alligx: {
      title: "Alligation cross", html: '<div class="grid g4"><div class="field"><label for="ac">Cheaper value</label><input type="number" id="ac" value="40"></div><div class="field"><label for="ad">Dearer value</label><input type="number" id="ad" value="60"></div><div class="field"><label for="am">Mean (mixture)</label><input type="number" id="am" value="46"></div><div class="field"><label for="aq">Total quantity (optional)</label><input type="number" id="aq" value="50"></div></div><div id="acx"></div><div class="out" id="aco"></div>',
      init: function (el) {
        function up() {
          var c = parseFloat($("#ac", el).value), d = parseFloat($("#ad", el).value), m = parseFloat($("#am", el).value), q = parseFloat($("#aq", el).value), o = $("#aco", el);
          if (![c, d, m].every(isFinite) || !(c < m && m < d)) { $("#acx", el).innerHTML = ""; o.textContent = "The mean must lie between the cheaper and dearer values"; return; }
          $("#acx", el).innerHTML = allig(c, d, m);
          var a = d - m, b = m - c, s = a + b;
          o.innerHTML = "Cheaper : Dearer = " + fmtN(a) + " : " + fmtN(b) + (q > 0 ? " → " + fmtN(q * a / s) + " and " + fmtN(q * b / s) : "") + "<small>Cheaper gets (dearer − mean) = " + fmtN(d) + " − " + fmtN(m) + "; dearer gets (mean − cheaper) = " + fmtN(m) + " − " + fmtN(c) + ". Check: (" + fmtN(a) + " × " + fmtN(c) + " + " + fmtN(b) + " × " + fmtN(d) + ") ÷ " + fmtN(s) + " = " + fmtN((a * c + b * d) / s) + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    mixpct: {
      title: "Concentration mixer", html: '<p class="small muted">Mix up to three solutions, then see how much pure ingredient or water takes it to a target strength.</p><table class="pt"><tr><th>Solution</th><th>Quantity</th><th>Strength %</th></tr>' + [[1, 20, 20], [2, 10, 50], [3, "", ""]].map(function (r) { return "<tr><td><b>" + r[0] + '</b></td><td><input type="number" class="mq" value="' + r[1] + '" style="width:90px"></td><td><input type="number" class="ms" value="' + r[2] + '" style="width:80px"></td></tr>'; }).join("") + '</table><div class="field"><label for="mt2">Target strength %</label><input type="number" id="mt2" value="40"></div><div class="tank" id="mtk"></div><div class="out" id="mxo"></div>',
      init: function (el) {
        function up() {
          var Q = 0, I = 0, n = 0;
          $$(".mq", el).forEach(function (q, i) { var a = parseFloat(q.value), s = parseFloat($$(".ms", el)[i].value); if (a > 0 && s >= 0 && s <= 100) { Q += a; I += a * s / 100; n++; } });
          var T = parseFloat($("#mt2", el).value), o = $("#mxo", el);
          if (!n) { $("#mtk", el).innerHTML = ""; o.textContent = "Enter at least one quantity and strength"; return; }
          var p = I / Q * 100;
          $("#mtk", el).innerHTML = '<i style="height:' + p + '%"></i><span>' + fmtN(p) + "%</span>";
          var extra = "";
          if (T >= 0 && T <= 100 && Math.abs(T - p) > 1e-9) {
            if (T > p && T < 100) extra = " To reach " + fmtN(T) + "%, add " + fmtN((T * Q / 100 - I) / (1 - T / 100)) + " of pure ingredient (the other part, " + fmtN(Q - I) + ", stays fixed).";
            else if (T < p && T > 0) extra = " To reach " + fmtN(T) + "%, add " + fmtN(I / (T / 100) - Q) + " of water (the ingredient, " + fmtN(I) + ", stays fixed).";
          }
          o.innerHTML = "Mixture strength = " + fmtN(p) + "%<small>Ingredient " + fmtN(I) + " in a total of " + fmtN(Q) + "." + extra + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    replace: {
      title: "Removal and replacement", html: '<div class="grid g3"><div class="field"><label for="rx">Vessel holds (L)</label><input type="number" id="rx" value="40"></div><div class="field"><label for="ry">Taken out and replaced (L)</label><input type="number" id="ry" value="4"></div><div class="field"><label for="rn">Times</label><input type="number" id="rn" value="3" min="1" max="10"></div></div><div class="reps" id="rps"></div><div class="out" id="rpo"></div>',
      init: function (el) {
        function up() {
          var x = parseFloat($("#rx", el).value), y = parseFloat($("#ry", el).value), n = Math.round(+$("#rn", el).value), o = $("#rpo", el);
          if (!(x > 0 && y > 0 && y < x && n >= 1 && n <= 10)) { $("#rps", el).innerHTML = ""; o.textContent = "Amount taken out must be less than the vessel; times 1–10"; return; }
          var f = 1 - y / x, h = "", m = x;
          for (var k = 0; k <= n; k++) { h += '<div class="rep"><div class="jar"><i style="height:' + (m / x * 100) + '%"></i></div><small>' + (k ? "after " + k : "start") + "<br><b>" + fmtN(m) + "</b></small></div>"; m *= f; }
          $("#rps", el).innerHTML = h;
          var left = x * Math.pow(f, n);
          o.innerHTML = "Original liquid left = " + fmtN(left) + " · water = " + fmtN(x - left) + "<small>" + fmtN(x) + " × (1 − " + fmtN(y) + "/" + fmtN(x) + ")^" + n + " = " + fmtN(x) + " × " + fmtN(f) + "^" + n + ". Each time a fixed " + fmtN(y / x * 100) + "% of what is left is removed.</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    mixratio: {
      title: "Mix two mixtures", html: '<div class="grid g3"><div class="field"><label>Vessel A milk : water</label><div class="row"><input type="number" id="ma1" value="3" style="width:70px"><b>:</b><input type="number" id="ma2" value="1" style="width:70px"></div></div><div class="field"><label>Vessel B milk : water</label><div class="row"><input type="number" id="mb1" value="5" style="width:70px"><b>:</b><input type="number" id="mb2" value="3" style="width:70px"></div></div><div class="field"><label>Mix A : B in quantity</label><div class="row"><input type="number" id="mqa" value="1" style="width:70px"><b>:</b><input type="number" id="mqb" value="1" style="width:70px"></div></div></div><div class="out" id="mro"></div>',
      init: function (el) {
        function g(a, b) { a = Math.round(a); b = Math.round(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
        function up() {
          var v = ["#ma1", "#ma2", "#mb1", "#mb2", "#mqa", "#mqb"].map(function (s) { return parseFloat($(s, el).value); }), o = $("#mro", el);
          if (!v.every(function (x) { return x >= 0; }) || !(v[0] + v[1] > 0 && v[2] + v[3] > 0 && v[4] + v[5] > 0)) { o.textContent = "Enter the ratios and quantities"; return; }
          var fa = v[0] / (v[0] + v[1]), fb = v[2] / (v[2] + v[3]), milk = v[4] * fa + v[5] * fb, water = v[4] + v[5] - milk;
          var L = (v[0] + v[1]) * (v[2] + v[3]), M = Math.round(milk * L * 1e6) / 1e6, W = Math.round(water * L * 1e6) / 1e6, isInt = Math.abs(M - Math.round(M)) < 1e-6 && Math.abs(W - Math.round(W)) < 1e-6, k = isInt ? g(M, W) : 1;
          o.innerHTML = "Milk : Water = " + (isInt ? fmtN(M / k) + " : " + fmtN(W / k) : fmtN(milk / water) + " : 1") + "<small>Milk fractions " + fmtN(v[0]) + "/" + fmtN(v[0] + v[1]) + " and " + fmtN(v[2]) + "/" + fmtN(v[2] + v[3]) + ", weighted " + fmtN(v[4]) + " : " + fmtN(v[5]) + " → milk is " + fmtN(milk / (v[4] + v[5]) * 100) + "% of the mix.</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    }
    ,
    together: {
      title: "Working together (LCM method)", html: '<p class="small muted">Enter days for up to three workers. Use a minus sign for someone who undoes work (or a leak).</p><div class="grid g3"><div class="field"><label for="ta">A (days)</label><input type="number" id="ta" value="10"></div><div class="field"><label for="tb">B (days)</label><input type="number" id="tb" value="15"></div><div class="field"><label for="tc">C (days, optional)</label><input type="number" id="tc" value=""></div></div><div id="tu"></div><div class="out" id="tgo"></div>',
      init: function (el) {
        function up() {
          var ds = ["#ta", "#tb", "#tc"].map(function (s) { return parseFloat($(s, el).value); }).filter(function (x) { return isFinite(x) && x !== 0; }), o = $("#tgo", el);
          if (!ds.length || ds.some(function (d) { return Math.abs(d) > 1000 || Math.round(d) !== d; })) { $("#tu", el).innerHTML = ""; o.textContent = "Enter whole numbers of days"; return; }
          $("#tu", el).innerHTML = unitsViz(ds);
          var L = ds.reduce(function (a, d) { return lcm(a, Math.abs(d)); }, 1), r = ds.map(function (d) { return L / d; }), net = r.reduce(function (a, b) { return a + b; }, 0);
          o.innerHTML = (net > 0 ? "Together: " + fmtN(L / net) + " days" : "The job never gets done (net rate ≤ 0)") + "<small>Job = LCM = " + L + " units. Per day: " + ds.map(function (d, i) { return "ABC"[i] + " " + (r[i] > 0 ? "+" : "−") + fmtN(Math.abs(r[i])); }).join(", ") + " → net " + fmtN(net) + " a day." + (net > 0 ? " " + L + " ÷ " + fmtN(net) + " = " + fmtN(L / net) + "." : "") + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    leaves: {
      title: "Someone leaves midway", html: '<div class="grid g4"><div class="field"><label for="la">A (days)</label><input type="number" id="la" value="20"></div><div class="field"><label for="lb">B (days)</label><input type="number" id="lb" value="30"></div><div class="field"><label for="lt">Together for (days)</label><input type="number" id="lt" value="6"></div><div class="field"><label for="lw">Then who leaves?</label><select id="lw"><option value="a">A leaves</option><option value="b">B leaves</option></select></div></div><div class="prog" id="lpg"></div><div class="out" id="lo"></div>',
      init: function (el) {
        function up() {
          var a = Math.round(+$("#la", el).value), b = Math.round(+$("#lb", el).value), t = parseFloat($("#lt", el).value), w = $("#lw", el).value, o = $("#lo", el);
          if (!(a > 0 && b > 0 && t >= 0)) { $("#lpg", el).innerHTML = ""; o.textContent = "Enter positive days"; return; }
          var L = lcm(a, b), ra = L / a, rb = L / b, done = Math.min(L, t * (ra + rb)), left = L - done, rr = w === "a" ? rb : ra, more = left / rr;
          $("#lpg", el).innerHTML = '<i style="width:' + done / L * 100 + '%;background:var(--accent)"></i><i style="width:' + left / L * 100 + '%;background:#F59E0B"></i>';
          o.innerHTML = (left <= 0 ? "Finished while both worked" : (w === "a" ? "B" : "A") + " finishes in " + fmtN(more) + " more days (total " + fmtN(t + more) + ")") + "<small>Job " + L + " units; A " + fmtN(ra) + "/day, B " + fmtN(rb) + "/day. Together " + fmtN(t) + " days → " + fmtN(done) + " units (blue). Left " + fmtN(left) + " (orange) at " + fmtN(rr) + " a day.</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    mandays: {
      title: "Men, days and hours", html: '<p class="small muted">Same job: M₁ × D₁ × H₁ = M₂ × D₂ × H₂. Leave one box on the right empty to find it.</p><div class="grid g2"><div><b>Before</b><div class="grid g3"><div class="field"><label for="m1">Men</label><input type="number" id="m1" value="10"></div><div class="field"><label for="d1">Days</label><input type="number" id="d1" value="12"></div><div class="field"><label for="h1">Hours/day</label><input type="number" id="h1" value="8"></div></div></div><div><b>After</b><div class="grid g3"><div class="field"><label for="m2">Men</label><input type="number" id="m2" value="16"></div><div class="field"><label for="d2">Days</label><input type="number" id="d2" value=""></div><div class="field"><label for="h2">Hours/day</label><input type="number" id="h2" value="6"></div></div></div></div><div class="field"><label for="wr">Second job is … times the first (1 = same job)</label><input type="number" id="wr" value="1"></div><div class="out" id="mdo"></div>',
      init: function (el) {
        function up() {
          var v = ["#m1", "#d1", "#h1", "#m2", "#d2", "#h2"].map(function (s) { return parseFloat($(s, el).value); }), k = parseFloat($("#wr", el).value) || 1, o = $("#mdo", el);
          if (!(v[0] > 0 && v[1] > 0 && v[2] > 0)) { o.textContent = "Fill in all three 'before' boxes"; return; }
          var miss = [3, 4, 5].filter(function (i) { return !(v[i] > 0); });
          if (miss.length !== 1) { o.textContent = "Leave exactly one 'after' box empty"; return; }
          var W = v[0] * v[1] * v[2] * k, i = miss[0], others = [3, 4, 5].filter(function (j) { return j !== i; }), ans = W / (v[others[0]] * v[others[1]]);
          o.innerHTML = ["Men", "Days", "Hours a day"][i - 3] + " needed = " + fmtN(ans) + "<small>" + fmtN(v[0]) + " × " + fmtN(v[1]) + " × " + fmtN(v[2]) + (k !== 1 ? " × " + fmtN(k) : "") + " = " + fmtN(W) + " man-hours ÷ (" + fmtN(v[others[0]]) + " × " + fmtN(v[others[1]]) + ")</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    pipes: {
      title: "Tank filler", html: '<p class="small muted">Hours to fill (+) or empty (−) the full tank for each pipe. Drag the slider to watch the level.</p><div class="grid g3"><div class="field"><label for="pa3">Pipe A (h)</label><input type="number" id="pa3" value="10"></div><div class="field"><label for="pb3">Pipe B (h)</label><input type="number" id="pb3" value="15"></div><div class="field"><label for="pc3">Pipe C (h)</label><input type="number" id="pc3" value="-30"></div></div><div class="grid g2" style="align-items:center"><div class="tank big" id="ptk"><i></i><span></span></div><div class="field"><label for="pt3">After <b id="ptv">0</b> hours</label><input type="range" id="pt3" min="0" max="100" value="50"></div></div><div class="out" id="pto"></div>',
      init: function (el) {
        function up() {
          var hs = ["#pa3", "#pb3", "#pc3"].map(function (s) { return parseFloat($(s, el).value); }).filter(function (x) { return isFinite(x) && x !== 0; }), o = $("#pto", el);
          if (!hs.length) { o.textContent = "Enter at least one pipe"; return; }
          var net = hs.reduce(function (a, h) { return a + 1 / h; }, 0), T = net > 0 ? 1 / net : Infinity, s = +$("#pt3", el).value / 100, tmax = isFinite(T) ? T : 24, t = s * tmax, lvl = Math.max(0, Math.min(1, net * t));
          $("#ptv", el).textContent = fmtN(t);
          $("#ptk i", el).style.height = lvl * 100 + "%"; $("#ptk span", el).textContent = fmtN(lvl * 100) + "% full";
          o.innerHTML = (net > 0 ? "Full in " + fmtN(T) + " hours" : "It never fills: the outlets are faster") + "<small>Net rate = " + hs.map(function (h) { return (h > 0 ? "+" : "−") + "1/" + fmtN(Math.abs(h)); }).join(" ") + " = " + fmtN(net * 100) + "% of the tank per hour.</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    }
    ,
    sdt: {
      title: "Speed, distance, time + unit converter", html: '<div class="grid g2"><div class="field"><label for="kmh">km/h</label><input type="number" id="kmh" value="72"></div><div class="field"><label for="mps">m/s</label><input type="number" id="mps" value="20"></div></div><div class="out" id="cvo"></div><div class="field" style="margin-top:6px"><label for="sk">Find…</label><select id="sk"><option value="d">Distance</option><option value="s">Speed</option><option value="t">Time</option></select></div><div class="grid g3"><div class="field" data-q="s"><label for="sv">Speed (km/h)</label><input type="number" id="sv" value="60"></div><div class="field" data-q="t"><label for="tv">Time (hours)</label><input type="number" id="tv" value="3.5"></div><div class="field" data-q="d"><label for="dv">Distance (km)</label><input type="number" id="dv" value="210"></div></div><div class="out" id="sdo"></div>',
      init: function (el) {
        var lock = false;
        function conv(from) {
          if (lock) return; lock = true;
          var k = parseFloat($("#kmh", el).value), m = parseFloat($("#mps", el).value);
          if (from === "k" && isFinite(k)) $("#mps", el).value = +(k * 5 / 18).toFixed(4);
          if (from === "m" && isFinite(m)) $("#kmh", el).value = +(m * 18 / 5).toFixed(4);
          k = parseFloat($("#kmh", el).value); m = parseFloat($("#mps", el).value);
          $("#cvo", el).innerHTML = isFinite(k) ? fmtN(k) + " km/h = " + fmtN(m) + " m/s<small>" + (from === "m" ? fmtN(m) + " × 18/5" : fmtN(k) + " × 5/18") + "</small>" : "Enter a speed";
          lock = false;
        }
        function up() {
          var q = $("#sk", el).value, s = parseFloat($("#sv", el).value), t = parseFloat($("#tv", el).value), d = parseFloat($("#dv", el).value), o = $("#sdo", el);
          $$("[data-q]", el).forEach(function (f) { f.hidden = f.getAttribute("data-q") === q; });
          if (q === "d") o.innerHTML = s > 0 && t > 0 ? "Distance = " + fmtN(s * t) + " km<small>" + fmtN(s) + " × " + fmtN(t) + "</small>" : "Enter speed and time";
          else if (q === "s") o.innerHTML = d > 0 && t > 0 ? "Speed = " + fmtN(d / t) + " km/h = " + fmtN(d / t * 5 / 18) + " m/s<small>" + fmtN(d) + " ÷ " + fmtN(t) + "</small>" : "Enter distance and time";
          else o.innerHTML = d > 0 && s > 0 ? "Time = " + fmtN(d / s) + " h = " + Math.floor(d / s) + " h " + fmtN((d / s - Math.floor(d / s)) * 60) + " min<small>" + fmtN(d) + " ÷ " + fmtN(s) + "</small>" : "Enter distance and speed";
        }
        $("#kmh", el).oninput = function () { conv("k"); }; $("#mps", el).oninput = function () { conv("m"); };
        $$("#sk,#sv,#tv,#dv", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); conv("k"); up();
      }
    },
    relmeet: {
      title: "Meeting and chasing", html: '<div class="grid g4"><div class="field"><label for="rgap">Gap (km)</label><input type="number" id="rgap" value="300"></div><div class="field"><label for="rs1">Speed 1 (km/h)</label><input type="number" id="rs1" value="40"></div><div class="field"><label for="rs2">Speed 2 (km/h)</label><input type="number" id="rs2" value="60"></div><div class="field"><label for="rdir">Direction</label><select id="rdir"><option value="t">Towards each other</option><option value="s">Same direction (2 chases 1)</option></select></div></div><div class="track" id="rtr"><i class="ca"></i><i class="cb"></i></div><div class="field"><label for="rt">Time: <b id="rtv">0</b> h</label><input type="range" id="rt" min="0" max="100" value="0"></div><div class="out" id="rmo"></div>',
      init: function (el) {
        function up() {
          var g = parseFloat($("#rgap", el).value), a = parseFloat($("#rs1", el).value), b = parseFloat($("#rs2", el).value), dir = $("#rdir", el).value, o = $("#rmo", el);
          if (!(g > 0 && a >= 0 && b >= 0)) { o.textContent = "Enter a gap and speeds"; return; }
          var rel = dir === "t" ? a + b : b - a, T = rel > 0 ? g / rel : Infinity, tm = isFinite(T) ? T : 10, t = +$("#rt", el).value / 100 * tm;
          $("#rtv", el).textContent = fmtN(t);
          var span = dir === "t" ? g : g + a * tm, pA, pB;
          if (dir === "t") { pA = a * t; pB = g - b * t; } else { pA = g + a * t; pB = b * t; }
          $(".ca", el).style.left = Math.max(0, Math.min(100, (dir === "t" ? pA : pA) / span * 100)) + "%";
          $(".cb", el).style.left = Math.max(0, Math.min(100, pB / span * 100)) + "%";
          o.innerHTML = (isFinite(T) ? (dir === "t" ? "They meet after " : "Caught after ") + fmtN(T) + " h" : "Never caught: the chaser is not faster") + "<small>Relative speed = " + (dir === "t" ? fmtN(a) + " + " + fmtN(b) : fmtN(b) + " − " + fmtN(a)) + " → " + fmtN(Math.abs(rel)) + " km/h; " + fmtN(g) + " ÷ " + fmtN(Math.abs(rel)) + ". Drag the slider to move both.</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    trainx: {
      title: "Train crossing calculator", html: '<div class="grid g2"><div class="field"><label for="tl">Train length (m)</label><input type="number" id="tl" value="150"></div><div class="field"><label for="tsp">Train speed (km/h)</label><input type="number" id="tsp" value="54"></div></div><div class="field"><label for="tob">It crosses…</label><select id="tob"><option value="pole">a pole / a standing person</option><option value="plat">a platform / bridge</option><option value="opp">another train, opposite direction</option><option value="same">another train, same direction</option><option value="walk">a person walking the same way</option></select></div><div class="grid g2"><div class="field" id="tow"><label for="tol" id="toll">Its length (m)</label><input type="number" id="tol" value="250"></div><div class="field" id="tsw"><label for="tos">Its speed (km/h)</label><input type="number" id="tos" value="40"></div></div><div class="trn" id="tvz"></div><div class="out" id="tro"></div>',
      init: function (el) {
        function up() {
          var L = parseFloat($("#tl", el).value), S = parseFloat($("#tsp", el).value), k = $("#tob", el).value, l2 = parseFloat($("#tol", el).value) || 0, s2 = parseFloat($("#tos", el).value) || 0, o = $("#tro", el);
          $("#tow", el).hidden = k === "pole" || k === "walk"; $("#tsw", el).hidden = k === "pole" || k === "plat";
          if (!(L > 0 && S > 0)) { o.textContent = "Enter the train's length and speed"; return; }
          var len = L + (k === "plat" || k === "opp" || k === "same" ? l2 : 0), rel = k === "opp" ? S + s2 : k === "same" || k === "walk" ? S - s2 : S;
          $("#tvz", el).innerHTML = '<i class="t1" style="flex:' + L + '">train ' + fmtN(L) + " m</i>" + (len > L ? '<i class="t2" style="flex:' + (len - L) + '">' + (k === "plat" ? "platform" : "other train") + " " + fmtN(len - L) + " m</i>" : "");
          if (!(rel > 0)) { o.textContent = "The train never passes: relative speed is not positive"; return; }
          var ms = rel * 5 / 18;
          o.innerHTML = "Time = " + fmtN(len / ms) + " s<small>Distance " + fmtN(len) + " m ÷ relative speed " + fmtN(rel) + " km/h (" + fmtN(rel) + " × 5/18 = " + fmtN(ms) + " m/s).</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    boats: {
      title: "Boats and streams", html: '<div class="field"><label for="bk">I know…</label><select id="bk"><option value="bs">boat and stream speeds</option><option value="du">downstream and upstream speeds</option></select></div><div class="grid g3"><div class="field"><label for="b1" id="b1l">Boat in still water (km/h)</label><input type="number" id="b1" value="10"></div><div class="field"><label for="b2" id="b2l">Stream (km/h)</label><input type="number" id="b2" value="2"></div><div class="field"><label for="bd">Distance each way (km)</label><input type="number" id="bd" value="48"></div></div><div class="river" id="brv"><span class="dn">→ downstream</span><span class="up">← upstream</span></div><div class="out" id="bo"></div>',
      init: function (el) {
        var last = "bs";
        function up() {
          var k = $("#bk", el).value;
          if (k !== last) { last = k; $("#b1", el).value = k === "bs" ? 10 : 15; $("#b2", el).value = k === "bs" ? 2 : 9; }
          $("#b1l", el).textContent = k === "bs" ? "Boat in still water (km/h)" : "Downstream (km/h)"; $("#b2l", el).textContent = k === "bs" ? "Stream (km/h)" : "Upstream (km/h)";
          var x = parseFloat($("#b1", el).value), y = parseFloat($("#b2", el).value), D = parseFloat($("#bd", el).value), o = $("#bo", el), b, s;
          if (!(x > 0 && y >= 0)) { o.textContent = "Enter two speeds"; return; }
          if (k === "bs") { b = x; s = y; } else { b = (x + y) / 2; s = (x - y) / 2; }
          var dn = b + s, upS = b - s;
          if (!(upS > 0)) { o.textContent = "The boat cannot go upstream: the stream is too fast"; return; }
          $(".dn", el).textContent = "→ downstream " + fmtN(dn) + " km/h"; $(".up", el).textContent = "← upstream " + fmtN(upS) + " km/h";
          o.innerHTML = "Boat " + fmtN(b) + " km/h · stream " + fmtN(s) + " km/h" + (D > 0 ? " · round trip " + fmtN(D / dn + D / upS) + " h" : "") + "<small>" + (k === "bs" ? "Down = b + s, up = b − s." : "b = (" + fmtN(x) + " + " + fmtN(y) + ") ÷ 2, s = (" + fmtN(x) + " − " + fmtN(y) + ") ÷ 2.") + (D > 0 ? " Time = " + fmtN(D) + " ÷ " + fmtN(dn) + " + " + fmtN(D) + " ÷ " + fmtN(upS) + "." : "") + "</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    }
    ,
    identity: {
      title: "Identity explorer", html: '<div class="field"><label for="idk">Identity</label><select id="idk"><option value="sq">(a + b)² = a² + 2ab + b²</option><option value="dsq">(a − b)² = a² − 2ab + b²</option><option value="dos">a² − b² = (a + b)(a − b)</option><option value="cu">(a + b)³ = a³ + b³ + 3ab(a + b)</option><option value="sc">a³ + b³ = (a + b)(a² − ab + b²)</option></select></div><div class="grid g2"><div class="field"><label for="ida">a</label><input type="number" id="ida" value="3"></div><div class="field"><label for="idb">b</label><input type="number" id="idb" value="2"></div></div><div id="idv"></div><div class="out" id="ido"></div>',
      init: function (el) {
        function up() {
          var k = $("#idk", el).value, a = parseFloat($("#ida", el).value), b = parseFloat($("#idb", el).value), o = $("#ido", el), L, R, how;
          if (!isFinite(a) || !isFinite(b)) { o.textContent = "Enter a and b"; return; }
          if (k === "sq") { L = (a + b) * (a + b); R = a * a + 2 * a * b + b * b; how = fmtN(a * a) + " + " + fmtN(2 * a * b) + " + " + fmtN(b * b); }
          else if (k === "dsq") { L = (a - b) * (a - b); R = a * a - 2 * a * b + b * b; how = fmtN(a * a) + " − " + fmtN(2 * a * b) + " + " + fmtN(b * b); }
          else if (k === "dos") { L = a * a - b * b; R = (a + b) * (a - b); how = fmtN(a + b) + " × " + fmtN(a - b); }
          else if (k === "cu") { L = Math.pow(a + b, 3); R = a * a * a + b * b * b + 3 * a * b * (a + b); how = fmtN(a * a * a) + " + " + fmtN(b * b * b) + " + " + fmtN(3 * a * b * (a + b)); }
          else { L = a * a * a + b * b * b; R = (a + b) * (a * a - a * b + b * b); how = fmtN(a + b) + " × " + fmtN(a * a - a * b + b * b); }
          $("#idv", el).innerHTML = k === "sq" && a > 0 && b > 0 ? sqViz(a, b) : "";
          o.innerHTML = "Left " + fmtN(L) + " = Right " + fmtN(R) + "<small>Right side: " + how + ". " + (k === "sq" && a > 0 && b > 0 ? "The square of side a + b splits into a², b² and two ab rectangles." : "Try your own numbers: it always matches.") + "</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    xinv: {
      title: "The x + 1/x ladder", html: '<div class="grid g2"><div class="field"><label for="xk">Given</label><select id="xk"><option value="p">x + 1/x = k</option><option value="m">x − 1/x = k</option></select></div><div class="field"><label for="xv">k</label><input type="number" id="xv" value="3"></div></div><div class="tscroll"><table class="pt" id="xt"></table></div><div class="out" id="xo"></div>',
      init: function (el) {
        function up() {
          var m = $("#xk", el).value, k = parseFloat($("#xv", el).value), o = $("#xo", el);
          if (!isFinite(k)) { $("#xt", el).innerHTML = ""; o.textContent = "Enter k"; return; }
          var rows;
          if (m === "p") { var s2 = k * k - 2, s3 = k * k * k - 3 * k, s4 = s2 * s2 - 2; rows = [["x² + 1/x²", "k² − 2", s2], ["x³ + 1/x³", "k³ − 3k", s3], ["x⁴ + 1/x⁴", "(x² + 1/x²)² − 2", s4]]; }
          else { var d2 = k * k + 2, d3 = k * k * k + 3 * k, d4 = d2 * d2 - 2; rows = [["x² + 1/x²", "k² + 2", d2], ["x³ − 1/x³", "k³ + 3k", d3], ["x⁴ + 1/x⁴", "(x² + 1/x²)² − 2", d4]]; }
          $("#xt", el).innerHTML = "<tr><th>Expression</th><th>Rule</th><th>Value</th></tr>" + rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td><b>" + fmtN(r[2]) + "</b></td></tr>"; }).join("");
          o.innerHTML = rows[0][0] + " = " + fmtN(rows[0][2]) + "<small>" + (m === "p" && Math.abs(k) < 2 ? "Note: for real x, x + 1/x can't be between −2 and 2. " : "") + (m === "p" && k === 2 ? "k = 2 means x = 1, so every row is 2. " : "") + "Square the given value for the 2nd power; cube it for the 3rd.</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    lin2: {
      title: "Two linear equations", html: '<p class="small muted">a₁x + b₁y = c₁ and a₂x + b₂y = c₂</p><div class="grid g3"><div class="field"><label for="la1">a₁</label><input type="number" id="la1" value="2"></div><div class="field"><label for="lb1">b₁</label><input type="number" id="lb1" value="3"></div><div class="field"><label for="lc1">c₁</label><input type="number" id="lc1" value="12"></div><div class="field"><label for="la2">a₂</label><input type="number" id="la2" value="1"></div><div class="field"><label for="lb2">b₂</label><input type="number" id="lb2" value="-1"></div><div class="field"><label for="lc2">c₂</label><input type="number" id="lc2" value="1"></div></div><div id="lgr"></div><div class="out" id="lo2"></div>',
      init: function (el) {
        function up() {
          var v = ["#la1", "#lb1", "#lc1", "#la2", "#lb2", "#lc2"].map(function (s) { return parseFloat($(s, el).value); }), o = $("#lo2", el);
          if (!v.every(isFinite)) { $("#lgr", el).innerHTML = ""; o.textContent = "Fill in all six numbers"; return; }
          var D = v[0] * v[4] - v[1] * v[3];
          if (Math.abs(D) < 1e-12) { $("#lgr", el).innerHTML = ""; o.innerHTML = "No single solution<small>The lines are parallel (no solution) or the same line (infinitely many).</small>"; return; }
          var x = (v[2] * v[4] - v[1] * v[5]) / D, y = (v[0] * v[5] - v[2] * v[3]) / D;
          $("#lgr", el).innerHTML = lineGraph(v, x, y);
          o.innerHTML = "x = " + fmtN(x) + ", y = " + fmtN(y) + "<small>Check: " + fmtN(v[0]) + "(" + fmtN(x) + ") + " + fmtN(v[1]) + "(" + fmtN(y) + ") = " + fmtN(v[0] * x + v[1] * y) + " and " + fmtN(v[3]) + "(" + fmtN(x) + ") + " + fmtN(v[4]) + "(" + fmtN(y) + ") = " + fmtN(v[3] * x + v[4] * y) + ". The lines cross at (" + fmtN(x) + ", " + fmtN(y) + ").</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    quadr: {
      title: "Quadratic roots and remainder theorem", html: '<p class="small muted">ax² + bx + c = 0</p><div class="grid g3"><div class="field"><label for="qa">a</label><input type="number" id="qa" value="1"></div><div class="field"><label for="qb">b</label><input type="number" id="qb" value="-5"></div><div class="field"><label for="qc">c</label><input type="number" id="qc" value="6"></div></div><div class="out" id="qo"></div><p class="small muted" style="margin-top:8px">Remainder theorem: p(x) = coefficients from the highest power, e.g. <b>1, -2, 3, -5</b> for x³ − 2x² + 3x − 5.</p><div class="grid g2"><div class="field"><label for="rp">Coefficients</label><input type="text" id="rp" value="1, -2, 3, -5"></div><div class="field"><label for="ra">Divide by (x − a), a =</label><input type="number" id="ra" value="2"></div></div><div class="out" id="ro2"></div>',
      init: function (el) {
        function up() {
          var a = parseFloat($("#qa", el).value), b = parseFloat($("#qb", el).value), c = parseFloat($("#qc", el).value), o = $("#qo", el);
          if (!(isFinite(a) && a !== 0 && isFinite(b) && isFinite(c))) o.textContent = "a must not be 0";
          else { var D = b * b - 4 * a * c, r = D >= 0 ? [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)] : null; o.innerHTML = (r ? "Roots: " + fmtN(r[0]) + " and " + fmtN(r[1]) : "No real roots") + "<small>Discriminant b² − 4ac = " + fmtN(D) + ". Sum = −b/a = " + fmtN(-b / a) + ", product = c/a = " + fmtN(c / a) + ".</small>"; }
          var cs = $("#rp", el).value.split(/[,\s]+/).filter(Boolean).map(Number), x = parseFloat($("#ra", el).value), o2 = $("#ro2", el);
          if (!cs.length || !cs.every(isFinite) || !isFinite(x)) { o2.textContent = "Enter coefficients and a"; return; }
          var n = cs.length - 1, val = cs.reduce(function (acc, k) { return acc * x + k; }, 0), terms = cs.map(function (k, i) { var p = n - i; return fmtN(k) + (p ? "(" + fmtN(x) + ")" + (p > 1 ? "^" + p : "") : ""); });
          o2.innerHTML = "Remainder = p(" + fmtN(x) + ") = " + fmtN(val) + (Math.abs(val) < 1e-9 ? " → (x − " + fmtN(x) + ") is a factor" : "") + "<small>" + terms.join(" + ").replace(/\+ −/g, "− ") + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    }
    ,
    triang: {
      title: "Triangle angles and centres", html: '<div class="field"><label for="tgk">I know…</label><select id="tgk"><option value="r">the ratio of the angles</option><option value="two">two angles</option></select></div><div class="grid g3"><div class="field"><label for="tg1" id="tg1l">Ratio A</label><input type="number" id="tg1" value="2"></div><div class="field"><label for="tg2" id="tg2l">Ratio B</label><input type="number" id="tg2" value="3"></div><div class="field" id="tg3w"><label for="tg3">Ratio C</label><input type="number" id="tg3" value="4"></div></div><div id="tgv"></div><div class="out" id="tgo2"></div><div class="tscroll"><table class="pt" id="tgc"></table></div>',
      init: function (el) {
        var last = "r";
        function up() {
          var k = $("#tgk", el).value;
          if (k !== last) { last = k; $("#tg1", el).value = k === "r" ? 2 : 70; $("#tg2", el).value = k === "r" ? 3 : 50; }
          $("#tg3w", el).hidden = k !== "r"; $("#tg1l", el).textContent = k === "r" ? "Ratio A" : "Angle A (°)"; $("#tg2l", el).textContent = k === "r" ? "Ratio B" : "Angle B (°)";
          var a = parseFloat($("#tg1", el).value), b = parseFloat($("#tg2", el).value), c = parseFloat($("#tg3", el).value), A, B, C, o = $("#tgo2", el);
          if (k === "r") { if (!(a > 0 && b > 0 && c > 0)) { o.textContent = "Enter three positive ratio terms"; return; } var u = 180 / (a + b + c); A = a * u; B = b * u; C = c * u; }
          else { if (!(a > 0 && b > 0 && a + b < 180)) { o.textContent = "Two angles must add to less than 180°"; return; } A = a; B = b; C = 180 - a - b; }
          $("#tgv", el).innerHTML = triSvg(A, B, C);
          var mx = Math.max(A, B, C), type = Math.abs(mx - 90) < 1e-9 ? "right-angled" : mx > 90 ? "obtuse" : "acute";
          o.innerHTML = "A = " + fmtN(A) + "°, B = " + fmtN(B) + "°, C = " + fmtN(C) + "°<small>" + (type === "acute" ? "An " : "A ") + type + " triangle. Exterior angle at C = A + B = " + fmtN(A + B) + "°.</small>";
          $("#tgc", el).innerHTML = "<tr><th>Centre</th><th>Angle at the centre facing BC</th><th>Value</th></tr><tr><td>Incentre I</td><td>90° + A/2</td><td><b>" + fmtN(90 + A / 2) + "°</b></td></tr><tr><td>Orthocentre H</td><td>180° − A</td><td><b>" + fmtN(180 - A) + "°</b></td></tr><tr><td>Circumcentre O</td><td>2A" + (A > 90 ? " (A obtuse: 360° − 2A)" : "") + "</td><td><b>" + fmtN(A > 90 ? 360 - 2 * A : 2 * A) + "°</b></td></tr><tr><td>Centroid G</td><td>divides medians</td><td><b>2 : 1</b></td></tr>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    pyth: {
      title: "Pythagoras and triplets", html: '<div class="field"><label for="pk2">I know…</label><select id="pk2"><option value="ll">both legs</option><option value="lh">one leg and the hypotenuse</option></select></div><div class="grid g2"><div class="field"><label for="p1" id="p1l">Leg 1</label><input type="number" id="p1" value="9"></div><div class="field"><label for="p2" id="p2l">Leg 2</label><input type="number" id="p2" value="12"></div></div><div id="ptv"></div><div class="out" id="pto2"></div>',
      init: function (el) {
        var TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
        function up() {
          var k = $("#pk2", el).value, x = parseFloat($("#p1", el).value), y = parseFloat($("#p2", el).value), o = $("#pto2", el), a, b, h;
          $("#p1l", el).textContent = "Leg" + (k === "ll" ? " 1" : ""); $("#p2l", el).textContent = k === "ll" ? "Leg 2" : "Hypotenuse";
          if (!(x > 0 && y > 0)) { o.textContent = "Enter two positive lengths"; return; }
          if (k === "ll") { a = x; b = y; h = Math.hypot(x, y); } else { if (!(y > x)) { o.textContent = "The hypotenuse must be the longest side"; return; } a = x; h = y; b = Math.sqrt(y * y - x * x); }
          $("#ptv", el).innerHTML = rtSvg(a, b, h);
          var s = [a, b, h].sort(function (p, q) { return p - q; }), trip = TR.filter(function (t) { var m = s[2] / t[2]; return Math.abs(s[0] - t[0] * m) < 1e-9 && Math.abs(s[1] - t[1] * m) < 1e-9; })[0];
          o.innerHTML = (k === "ll" ? "Hypotenuse = " + fmtN(h) : "Other leg = " + fmtN(b)) + "<small>" + (k === "ll" ? "√(" + fmtN(a) + "² + " + fmtN(b) + "²) = √" + fmtN(a * a + b * b) : "√(" + fmtN(h) + "² − " + fmtN(a) + "²) = √" + fmtN(h * h - a * a)) + ". Area = " + fmtN(a * b / 2) + "." + (trip ? " This is " + fmtN(s[2] / trip[2]) + " × the " + trip.join("-") + " triplet." : "") + "</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    circ: {
      title: "Tangents and chords", html: '<div class="field"><label for="ck">Find…</label><select id="ck"><option value="t">tangent length from a point</option><option value="c">chord length from its distance to the centre</option><option value="x">PD for intersecting chords</option></select></div><div class="grid g3"><div class="field"><label for="c1" id="c1l">Distance from centre d</label><input type="number" id="c1" value="13"></div><div class="field"><label for="c2" id="c2l">Radius r</label><input type="number" id="c2" value="5"></div><div class="field" id="c3w"><label for="c3">PC</label><input type="number" id="c3" value="3"></div></div><div id="cvz"></div><div class="out" id="co3"></div>',
      init: function (el) {
        var L = { t: ["Distance from centre d", "Radius r", 13, 5], c: ["Radius r", "Distance of chord from centre", 10, 6], x: ["PA", "PB", 4, 6] }, last = "t";
        function up() {
          var k = $("#ck", el).value;
          if (k !== last) { last = k; $("#c1", el).value = L[k][2]; $("#c2", el).value = L[k][3]; }
          $("#c1l", el).textContent = L[k][0]; $("#c2l", el).textContent = L[k][1]; $("#c3w", el).hidden = k !== "x";
          var a = parseFloat($("#c1", el).value), b = parseFloat($("#c2", el).value), c = parseFloat($("#c3", el).value), o = $("#co3", el);
          if (!(a > 0 && b > 0) || (k === "x" && !(c > 0))) { $("#cvz", el).innerHTML = ""; o.textContent = "Enter positive lengths"; return; }
          if (k === "t") { if (!(a > b)) { o.textContent = "The point must be outside the circle (d > r)"; return; } $("#cvz", el).innerHTML = circSvg("t", a, b); o.innerHTML = "Tangent = " + fmtN(Math.sqrt(a * a - b * b)) + "<small>√(" + fmtN(a) + "² − " + fmtN(b) + "²). The radius meets the tangent at 90°, so it is a right triangle.</small>"; }
          else if (k === "c") { if (!(b < a)) { o.textContent = "The distance must be less than the radius"; return; } var hc = Math.sqrt(a * a - b * b); $("#cvz", el).innerHTML = circSvg("c", a, b); o.innerHTML = "Chord = " + fmtN(2 * hc) + "<small>Half-chord = √(" + fmtN(a) + "² − " + fmtN(b) + "²) = " + fmtN(hc) + ". The perpendicular from the centre bisects the chord.</small>"; }
          else { $("#cvz", el).innerHTML = ""; o.innerHTML = "PD = " + fmtN(a * b / c) + "<small>PA × PB = PC × PD → " + fmtN(a) + " × " + fmtN(b) + " = " + fmtN(c) + " × PD.</small>"; }
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    poly: {
      title: "Polygon calculator", html: '<div class="field"><label for="pyk">I know…</label><select id="pyk"><option value="n">the number of sides</option><option value="i">each interior angle (regular)</option><option value="e">each exterior angle (regular)</option><option value="s">the sum of interior angles</option></select></div><div class="field"><label for="pyv" id="pyl">Number of sides</label><input type="number" id="pyv" value="6"></div><div id="pyz"></div><div class="out" id="pyo"></div>',
      init: function (el) {
        var L = { n: ["Number of sides", 6], i: ["Interior angle (°)", 140], e: ["Exterior angle (°)", 40], s: ["Sum of interior angles (°)", 1440] }, last = "n";
        function up() {
          var k = $("#pyk", el).value;
          if (k !== last) { last = k; $("#pyv", el).value = L[k][1]; }
          $("#pyl", el).textContent = L[k][0];
          var v = parseFloat($("#pyv", el).value), o = $("#pyo", el), n;
          n = k === "n" ? v : k === "i" ? 360 / (180 - v) : k === "e" ? 360 / v : v / 180 + 2;
          if (!(n >= 3) || Math.abs(n - Math.round(n)) > 1e-9 || n > 200) { $("#pyz", el).innerHTML = ""; o.textContent = "No regular polygon has that value"; return; }
          n = Math.round(n);
          $("#pyz", el).innerHTML = polySvg(n);
          o.innerHTML = n + " sides<small>Interior sum = (" + n + " − 2) × 180 = " + fmtN((n - 2) * 180) + "°. Each interior (regular) = " + fmtN((n - 2) * 180 / n) + "°, each exterior = 360 ÷ " + n + " = " + fmtN(360 / n) + "°. Diagonals = " + n + " × " + (n - 3) + " ÷ 2 = " + n * (n - 3) / 2 + ".</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    }
    ,
    area2d: {
      title: "Area and perimeter (2D)", html: '<div class="field"><label for="ak">Shape</label><select id="ak"><option value="rect">Rectangle</option><option value="tri">Triangle (three sides)</option><option value="eq">Equilateral triangle</option><option value="circ">Circle</option><option value="sec">Sector</option><option value="rho">Rhombus (diagonals)</option><option value="trap">Trapezium</option></select></div><div class="grid g3" id="aflds"></div><label class="small" style="display:flex;gap:6px;align-items:center;margin-top:4px"><input type="checkbox" id="api" style="width:auto"> use π = 3.1416 instead of 22/7</label><div class="out" id="ao"></div>',
      init: function (el) {
        var F = { rect: [["Length", 15], ["Breadth", 8]], tri: [["Side a", 13], ["Side b", 14], ["Side c", 15]], eq: [["Side", 8]], circ: [["Radius", 7]], sec: [["Radius", 14], ["Angle (°)", 90]], rho: [["Diagonal 1", 16], ["Diagonal 2", 12]], trap: [["Parallel side a", 10], ["Parallel side b", 16], ["Height", 6]] }, cur = "";
        function build(k) { $("#aflds", el).innerHTML = F[k].map(function (f, i) { return '<div class="field"><label for="af' + i + '">' + f[0] + '</label><input type="number" id="af' + i + '" value="' + f[1] + '"></div>'; }).join(""); $$("#aflds input", el).forEach(function (i) { i.oninput = up; }); }
        function up() {
          var k = $("#ak", el).value; if (k !== cur) { cur = k; build(k); }
          var v = F[k].map(function (_, i) { return parseFloat($("#af" + i, el).value); }), P = $("#api", el).checked ? 3.1416 : 22 / 7, o = $("#ao", el), A, Pm, how;
          if (!v.every(function (x) { return x > 0; })) { o.textContent = "Enter positive values"; return; }
          if (k === "rect") { A = v[0] * v[1]; Pm = 2 * (v[0] + v[1]); how = "Diagonal = " + fmtN(Math.hypot(v[0], v[1])); }
          else if (k === "tri") { var s = (v[0] + v[1] + v[2]) / 2, q = s * (s - v[0]) * (s - v[1]) * (s - v[2]); if (!(q > 0)) { o.textContent = "These sides cannot form a triangle"; return; } A = Math.sqrt(q); Pm = 2 * s; how = "s = " + fmtN(s) + "; √(" + fmtN(s) + " × " + fmtN(s - v[0]) + " × " + fmtN(s - v[1]) + " × " + fmtN(s - v[2]) + ")"; }
          else if (k === "eq") { A = Math.sqrt(3) / 4 * v[0] * v[0]; Pm = 3 * v[0]; how = "(√3/4) × " + fmtN(v[0]) + "² = " + fmtN(v[0] * v[0] / 4) + "√3; height = " + fmtN(Math.sqrt(3) / 2 * v[0]); }
          else if (k === "circ") { A = P * v[0] * v[0]; Pm = 2 * P * v[0]; how = "πr² and 2πr"; }
          else if (k === "sec") { A = v[1] / 360 * P * v[0] * v[0]; Pm = v[1] / 360 * 2 * P * v[0] + 2 * v[0]; how = "Arc = " + fmtN(v[1] / 360 * 2 * P * v[0]) + "; perimeter = arc + 2r"; }
          else if (k === "rho") { A = v[0] * v[1] / 2; var sd = Math.hypot(v[0] / 2, v[1] / 2); Pm = 4 * sd; how = "Side = √(" + fmtN(v[0] / 2) + "² + " + fmtN(v[1] / 2) + "²) = " + fmtN(sd); }
          else { A = (v[0] + v[1]) / 2 * v[2]; Pm = NaN; how = "½ × (" + fmtN(v[0]) + " + " + fmtN(v[1]) + ") × " + fmtN(v[2]); }
          o.innerHTML = "Area = " + fmtN(A) + (isFinite(Pm) ? " · Perimeter = " + fmtN(Pm) : "") + "<small>" + how + ".</small>";
        }
        $("#ak", el).onchange = up; $("#api", el).onchange = up; up();
      }
    },
    solid3d: {
      title: "Volume and surface area (3D)", html: '<div class="field"><label for="sk3">Solid</label><select id="sk3"><option value="cube">Cube</option><option value="cuboid">Cuboid</option><option value="cyl">Cylinder</option><option value="cone">Cone</option><option value="sph">Sphere</option><option value="hem">Hemisphere</option></select></div><div class="grid g3" id="sflds"></div><div class="out" id="so3"></div>',
      init: function (el) {
        var F = { cube: [["Side", 5]], cuboid: [["Length", 3], ["Breadth", 4], ["Height", 12]], cyl: [["Radius", 7], ["Height", 10]], cone: [["Radius", 7], ["Height", 24]], sph: [["Radius", 7]], hem: [["Radius", 7]] }, cur = "", P = 22 / 7;
        function build(k) { $("#sflds", el).innerHTML = F[k].map(function (f, i) { return '<div class="field"><label for="sf' + i + '">' + f[0] + '</label><input type="number" id="sf' + i + '" value="' + f[1] + '"></div>'; }).join(""); $$("#sflds input", el).forEach(function (i) { i.oninput = up; }); }
        function up() {
          var k = $("#sk3", el).value; if (k !== cur) { cur = k; build(k); }
          var v = F[k].map(function (_, i) { return parseFloat($("#sf" + i, el).value); }), o = $("#so3", el), r = [];
          if (!v.every(function (x) { return x > 0; })) { o.textContent = "Enter positive values"; return; }
          var a = v[0], b = v[1], c = v[2];
          if (k === "cube") r = [["Volume", a * a * a], ["Total surface", 6 * a * a], ["Lateral surface", 4 * a * a], ["Diagonal", a * Math.sqrt(3)]];
          else if (k === "cuboid") r = [["Volume", a * b * c], ["Total surface", 2 * (a * b + b * c + c * a)], ["Four walls", 2 * (a + b) * c], ["Diagonal", Math.sqrt(a * a + b * b + c * c)]];
          else if (k === "cyl") r = [["Volume", P * a * a * b], ["Curved surface", 2 * P * a * b], ["Total surface", 2 * P * a * (a + b)]];
          else if (k === "cone") { var l = Math.hypot(a, b); r = [["Volume", P * a * a * b / 3], ["Slant height", l], ["Curved surface", P * a * l], ["Total surface", P * a * (l + a)]]; }
          else if (k === "sph") r = [["Volume", 4 / 3 * P * a * a * a], ["Surface area", 4 * P * a * a]];
          else r = [["Volume", 2 / 3 * P * a * a * a], ["Curved surface", 2 * P * a * a], ["Total surface", 3 * P * a * a]];
          o.innerHTML = r.map(function (x) { return x[0] + " " + fmtN(x[1]); }).join(" · ") + "<small>Using π = 22/7.</small>";
        }
        $("#sk3", el).onchange = up; up();
      }
    },
    scaling: {
      title: "Scaling: what happens to area and volume?", html: '<div class="field"><label for="scm">Change every length by…</label><select id="scm"><option value="p">a percentage</option><option value="k">a factor (× k)</option></select></div><div class="field"><label for="scv" id="scl">% change (use − for decrease)</label><input type="number" id="scv" value="10"></div><div class="tscroll"><table class="pt" id="sct"></table></div><div class="out" id="sco"></div>',
      init: function (el) {
        function up() {
          var m = $("#scm", el).value, v = parseFloat($("#scv", el).value), o = $("#sco", el);
          $("#scl", el).textContent = m === "p" ? "% change (use − for decrease)" : "Factor k (e.g. 2 for doubling)";
          var k = m === "p" ? 1 + v / 100 : v;
          if (!(k > 0)) { $("#sct", el).innerHTML = ""; o.textContent = "Enter a valid change"; return; }
          var row = function (n, p) { var f = Math.pow(k, p); return "<tr><td>" + n + "</td><td>× " + fmtN(f) + "</td><td>" + (f >= 1 ? "+" : "−") + fmtN(Math.abs(f - 1) * 100) + "%</td></tr>"; };
          $("#sct", el).innerHTML = "<tr><th>Quantity</th><th>Multiplied by</th><th>Change</th></tr>" + row("Length / perimeter", 1) + row("Area / surface area", 2) + row("Volume", 3);
          o.innerHTML = "Area × " + fmtN(k * k) + ", volume × " + fmtN(k * k * k) + "<small>Area uses two lengths (k²) and volume three (k³). " + (m === "p" ? fmtN(v) + "% on each side gives " + fmtN((k * k - 1) * 100) + "% on area, not " + fmtN(2 * v) + "%." : "") + "</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    recast: {
      title: "Melt and recast", html: '<p class="small muted">The volume stays the same. How many small solids can be made from the big one?</p><div class="grid g2"><div class="field"><label for="rbk">Big solid</label><select id="rbk"><option value="sph">Sphere (r)</option><option value="cyl" selected>Cylinder (r, h)</option><option value="cone">Cone (r, h)</option><option value="cube">Cube (side)</option></select></div><div class="field"><label for="rsk">Small solid</label><select id="rsk"><option value="sph">Sphere (r)</option><option value="cyl">Cylinder (r, h)</option><option value="cone" selected>Cone (r, h)</option><option value="cube">Cube (side)</option></select></div><div class="field"><label>Big: r / side, h</label><div class="row"><input type="number" id="rb1" value="3"><input type="number" id="rb2" value="7"></div></div><div class="field"><label>Small: r / side, h</label><div class="row"><input type="number" id="rs1" value="1"><input type="number" id="rs2" value="3"></div></div></div><div class="out" id="rco"></div>',
      init: function (el) {
        function vol(k, a, h) { return k === "sph" ? 4 / 3 * Math.PI * a * a * a : k === "cyl" ? Math.PI * a * a * h : k === "cone" ? Math.PI * a * a * h / 3 : a * a * a; }
        function nm(k) { return { sph: "sphere", cyl: "cylinder", cone: "cone", cube: "cube" }[k]; }
        function up() {
          var bk = $("#rbk", el).value, sk = $("#rsk", el).value, b1 = parseFloat($("#rb1", el).value), b2 = parseFloat($("#rb2", el).value), s1 = parseFloat($("#rs1", el).value), s2 = parseFloat($("#rs2", el).value), o = $("#rco", el);
          $("#rb2", el).hidden = !(bk === "cyl" || bk === "cone"); $("#rs2", el).hidden = !(sk === "cyl" || sk === "cone");
          if (!(b1 > 0 && s1 > 0) || ((bk === "cyl" || bk === "cone") && !(b2 > 0)) || ((sk === "cyl" || sk === "cone") && !(s2 > 0))) { o.textContent = "Enter positive sizes"; return; }
          var VB = vol(bk, b1, b2), VS = vol(sk, s1, s2), n = VB / VS;
          o.innerHTML = fmtN(n) + " small " + nm(sk) + (Math.abs(n - 1) < 1e-9 ? "" : "s") + "<small>Volume of the big " + nm(bk) + " ÷ volume of one small " + nm(sk) + " = " + fmtN(VB / Math.PI) + "π ÷ " + fmtN(VS / Math.PI) + "π" + (bk === "cube" || sk === "cube" ? " (π doesn't cancel with a cube)" : "; π cancels") + ".</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    }
    ,
    ratios6: {
      title: "All six ratios from a triangle", html: '<p class="small muted">Enter the two shorter sides of a right triangle (P opposite θ, B next to θ).</p><div class="grid g2"><div class="field"><label for="rP">Perpendicular P</label><input type="number" id="rP" value="3"></div><div class="field"><label for="rB">Base B</label><input type="number" id="rB" value="4"></div></div><div id="rtz"></div><div class="tscroll"><table class="pt" id="r6"></table></div><div class="out" id="r6o"></div>',
      init: function (el) {
        function fr(a, b) { var g = function (x, y) { x = Math.round(x * 1e6); y = Math.round(y * 1e6); while (y) { var t = x % y; x = y; y = t; } return x; }; if (Math.abs(a - Math.round(a)) < 1e-9 && Math.abs(b - Math.round(b)) < 1e-9) { var k = g(a, b) / 1e6; return b / k === 1 ? fmtN(a / k) : fmtN(a / k) + "/" + fmtN(b / k); } return fmtN(a / b); }
        function up() {
          var P = parseFloat($("#rP", el).value), B = parseFloat($("#rB", el).value), o = $("#r6o", el);
          if (!(P > 0 && B > 0)) { $("#r6", el).innerHTML = ""; o.textContent = "Enter two positive sides"; return; }
          var H = Math.hypot(P, B), Hs = Math.abs(H - Math.round(H)) < 1e-9 ? fmtN(H) : "√" + fmtN(P * P + B * B);
          $("#rtz", el).innerHTML = rtSvg(B, P, H);
          var R = [["sin θ", "P/H", P, H], ["cos θ", "B/H", B, H], ["tan θ", "P/B", P, B], ["cosec θ", "H/P", H, P], ["sec θ", "H/B", H, B], ["cot θ", "B/P", B, P]];
          $("#r6", el).innerHTML = "<tr><th>Ratio</th><th>Rule</th><th>Value</th><th>Decimal</th></tr>" + R.map(function (r) { var exact = Hs.charAt(0) === "√" && (r[2] === H || r[3] === H) ? (r[2] === H ? Hs + (r[3] === 1 ? "" : "/" + fmtN(r[3])) : fmtN(r[2]) + "/" + Hs) : fr(r[2], r[3]); return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td><b>" + exact + "</b></td><td>" + fmtN(r[2] / r[3]) + "</td></tr>"; }).join("");
          var th = Math.atan(P / B) * 180 / Math.PI;
          o.innerHTML = "H = " + Hs + " · θ ≈ " + fmtN(th) + "°<small>Check: sin²θ + cos²θ = " + fmtN(P * P / (H * H)) + " + " + fmtN(B * B / (H * H)) + " = 1.</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    unitc: {
      title: "sin, cos and tan as the angle turns", html: '<div class="field"><label for="ua">Angle θ: <b id="uav">30</b>°</label><input type="range" id="ua" min="0" max="90" value="30"></div><div class="row small"><span class="muted">Jump to:</span>' + [0, 30, 45, 60, 90].map(function (a) { return '<button class="btn btn-sm btn-line" data-a="' + a + '">' + a + "°</button>"; }).join("") + '</div><div id="ucz"></div><div class="out" id="uco"></div>',
      init: function (el) {
        var EX = { 0: ["0", "1", "0"], 30: ["1/2", "√3/2", "1/√3"], 45: ["1/√2", "1/√2", "1"], 60: ["√3/2", "1/2", "√3"], 90: ["1", "0", "not defined"] };
        function up() {
          var a = +$("#ua", el).value, r = a * Math.PI / 180, s = Math.sin(r), c = Math.cos(r);
          $("#uav", el).textContent = a;
          var X = 20 + 150 * c, Y = 170 - 150 * s;
          $("#ucz", el).innerHTML = '<svg class="geo" viewBox="0 0 200 190" role="img" aria-label="Quarter circle"><path d="M20 170 L170 170 A150 150 0 0 0 20 20 Z" fill="#FAFAFF" stroke="#D6D7EE"/><line x1="20" y1="170" x2="' + X + '" y2="' + Y + '" stroke="#1E1B4B" stroke-width="2.5"/><line x1="' + X + '" y1="' + Y + '" x2="' + X + '" y2="170" stroke="#4F46E5" stroke-width="4"/><line x1="20" y1="170" x2="' + X + '" y2="170" stroke="#F59E0B" stroke-width="4"/><circle cx="' + X + '" cy="' + Y + '" r="5" fill="#1E1B4B"/><text x="' + (X + 6) + '" y="' + ((Y + 170) / 2) + '" font-size="12" font-weight="700" fill="#4F46E5">sin</text><text x="' + ((20 + X) / 2) + '" y="185" font-size="12" font-weight="700" fill="#B45309" text-anchor="middle">cos</text></svg>';
          var ex = EX[a];
          $("#uco", el).innerHTML = "sin " + a + "° = " + (ex ? ex[0] : fmtN(s)) + " · cos " + a + "° = " + (ex ? ex[1] : fmtN(c)) + " · tan " + a + "° = " + (ex ? ex[2] : fmtN(s / c)) + "<small>On a circle of radius 1, sin is the height (blue) and cos the base (orange). As θ grows, sin rises and cos falls; sin θ = cos(90° − θ) = cos " + (90 - a) + "°.</small>";
        }
        $("#ua", el).oninput = up;
        $$("[data-a]", el).forEach(function (b) { b.onclick = function () { $("#ua", el).value = b.getAttribute("data-a"); up(); }; });
        up();
      }
    },
    heights: {
      title: "Height and distance", html: '<div class="field"><label for="hk">Find…</label><select id="hk"><option value="h">height (know distance and angle)</option><option value="d">distance (know height and angle)</option><option value="a">angle (know height and distance)</option></select></div><div class="grid g3"><div class="field" data-h="h"><label for="hh">Height</label><input type="number" id="hh" value="100"></div><div class="field" data-h="d"><label for="hd">Distance</label><input type="number" id="hd" value="30"></div><div class="field" data-h="a"><label for="ha">Angle of elevation (°)</label><input type="number" id="ha" value="60"></div></div><div id="hz"></div><div class="out" id="hgo"></div>',
      init: function (el) {
        function rt3(v) { var k = v / Math.sqrt(3); return Math.abs(k - Math.round(k)) < 1e-6 && Math.round(k) ? " (= " + fmtN(Math.round(k)) + "√3)" : ""; }
        function up() {
          var k = $("#hk", el).value, h = parseFloat($("#hh", el).value), d = parseFloat($("#hd", el).value), a = parseFloat($("#ha", el).value), o = $("#hgo", el);
          $$("[data-h]", el).forEach(function (f) { f.hidden = f.getAttribute("data-h") === k; });
          var t = Math.tan(a * Math.PI / 180);
          if (k === "h") { if (!(d > 0 && a > 0 && a < 90)) { o.textContent = "Enter a distance and an angle between 0° and 90°"; return; } h = d * t; o.innerHTML = "Height = " + fmtN(h) + rt3(h) + "<small>distance × tan " + fmtN(a) + "° = " + fmtN(d) + " × " + fmtN(t) + "</small>"; }
          else if (k === "d") { if (!(h > 0 && a > 0 && a < 90)) { o.textContent = "Enter a height and an angle between 0° and 90°"; return; } d = h / t; o.innerHTML = "Distance = " + fmtN(d) + rt3(d) + "<small>height ÷ tan " + fmtN(a) + "° = " + fmtN(h) + " ÷ " + fmtN(t) + ". The angle of depression from the top is also " + fmtN(a) + "°.</small>"; }
          else { if (!(h > 0 && d > 0)) { o.textContent = "Enter a height and a distance"; return; } a = Math.atan(h / d) * 180 / Math.PI; o.innerHTML = "Angle = " + fmtN(a) + "°<small>tan θ = " + fmtN(h) + " ÷ " + fmtN(d) + " = " + fmtN(h / d) + "</small>"; }
          var W = 220, s = 140 / Math.max(h, d), Hs = h * s, Ds = d * s;
          $("#hz", el).innerHTML = '<svg class="geo" viewBox="0 0 ' + (Ds + 60) + " " + (Hs + 40) + '" role="img" aria-label="Tower and observer"><rect x="' + (Ds + 20) + '" y="10" width="14" height="' + Hs + '" fill="#C7C9F2" stroke="#4F46E5"/><line x1="10" y1="' + (Hs + 10) + '" x2="' + (Ds + 50) + '" y2="' + (Hs + 10) + '" stroke="#94A3B8" stroke-width="2"/><line x1="10" y1="' + (Hs + 10) + '" x2="' + (Ds + 27) + '" y2="10" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="10" cy="' + (Hs + 10) + '" r="5" fill="#1E1B4B"/><text x="24" y="' + (Hs + 4) + '" font-size="12" font-weight="700" fill="#B45309">' + fmtN(a) + "°</text></svg>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    twoang: {
      title: "Two angles of elevation", html: '<p class="small muted">Two observers on the same side of a tower see its top at two angles.</p><div class="grid g3"><div class="field"><label for="ta1">Farther point angle (°)</label><input type="number" id="ta1" value="30"></div><div class="field"><label for="ta2">Nearer point angle (°)</label><input type="number" id="ta2" value="60"></div><div class="field"><label for="tgp">Gap between points</label><input type="number" id="tgp" value="40"></div></div><div class="out" id="tao"></div>',
      init: function (el) {
        function up() {
          var a = parseFloat($("#ta1", el).value), b = parseFloat($("#ta2", el).value), g = parseFloat($("#tgp", el).value), o = $("#tao", el);
          if (!(a > 0 && b > a && b < 90 && g > 0)) { o.textContent = "The nearer point must have the bigger angle (both below 90°)"; return; }
          var ca = 1 / Math.tan(a * Math.PI / 180), cb = 1 / Math.tan(b * Math.PI / 180), h = g / (ca - cb), k = h / Math.sqrt(3);
          o.innerHTML = "Height = " + fmtN(h) + (Math.abs(k - Math.round(k)) < 1e-6 ? " (= " + fmtN(Math.round(k)) + "√3)" : "") + "<small>h × cot " + fmtN(a) + "° − h × cot " + fmtN(b) + "° = gap → h = " + fmtN(g) + " ÷ (" + fmtN(ca) + " − " + fmtN(cb) + "). The nearer point is " + fmtN(h * cb) + " from the foot.</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    }
    ,
    ditable: {
      title: "Table to chart, with % change", html: '<p class="small muted">Edit the labels and values. Growth, average and the best year update at once.</p><div class="grid g2"><div class="field"><label for="dtl">Labels (comma separated)</label><input type="text" id="dtl" value="2019, 2020, 2021, 2022, 2023"></div><div class="field"><label for="dtv">Values</label><input type="text" id="dtv" value="120, 150, 135, 180, 216"></div></div><div id="dtc"></div><div class="tscroll"><table class="pt" id="dtt"></table></div><div class="out" id="dto"></div>',
      init: function (el) {
        function up() {
          var L = $("#dtl", el).value.split(",").map(function (s) { return s.trim(); }), V = $("#dtv", el).value.split(/[,\s]+/).filter(Boolean).map(Number), o = $("#dto", el);
          if (V.length < 2 || V.length > 12 || !V.every(function (x) { return x >= 0; })) { $("#dtc", el).innerHTML = $("#dtt", el).innerHTML = ""; o.textContent = "Enter 2 to 12 values"; return; }
          while (L.length < V.length) L.push(String(L.length + 1));
          $("#dtc", el).innerHTML = barsSvg(L.slice(0, V.length), V);
          var g = V.map(function (v, i) { return i && V[i - 1] ? (v - V[i - 1]) / V[i - 1] * 100 : null; }), best = -1;
          g.forEach(function (x, i) { if (x !== null && (best < 0 || x > g[best])) best = i; });
          $("#dtt", el).innerHTML = "<tr><th>" + "Label</th><th>Value</th><th>Change</th><th>% change</th></tr>" + V.map(function (v, i) { return "<tr" + (i === best ? ' class="hl"' : "") + "><td>" + esc(L[i]) + "</td><td>" + fmtN(v) + "</td><td>" + (i ? (v - V[i - 1] >= 0 ? "+" : "") + fmtN(v - V[i - 1]) : "—") + "</td><td>" + (g[i] === null ? "—" : (g[i] >= 0 ? "+" : "") + fmtN(g[i]) + "%") + "</td></tr>"; }).join("");
          var sum = V.reduce(function (a, b) { return a + b; }, 0);
          o.innerHTML = "Average " + fmtN(sum / V.length) + " · total " + fmtN(sum) + "<small>Highest % growth: " + esc(L[best]) + " (" + fmtN(g[best]) + "%). Overall change " + esc(L[0]) + " → " + esc(L[V.length - 1]) + ": " + (V[0] ? fmtN((V[V.length - 1] - V[0]) / V[0] * 100) + "%" : "—") + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    pietool: {
      title: "Pie chart converter", html: '<div class="grid g2"><div class="field"><label for="ptk">Values are in…</label><select id="ptk"><option value="p">percent</option><option value="d">degrees</option><option value="a">amounts</option></select></div><div class="field"><label for="ptt">Total amount (₹ or units)</label><input type="number" id="ptt" value="40000"></div></div><div class="grid g2"><div class="field"><label for="ptl">Categories</label><input type="text" id="ptl" value="Rent, Food, Savings, Education, Transport"></div><div class="field"><label for="ptv">Values</label><input type="text" id="ptv" value="30, 25, 20, 15, 10"></div></div><div id="ptz"></div><div class="tscroll"><table class="pt" id="ptb"></table></div><div class="out" id="pto3"></div>',
      init: function (el) {
        function up() {
          var k = $("#ptk", el).value, T = parseFloat($("#ptt", el).value), L = $("#ptl", el).value.split(",").map(function (s) { return s.trim(); }), V = $("#ptv", el).value.split(/[,\s]+/).filter(Boolean).map(Number), o = $("#pto3", el);
          if (!V.length || V.length > 10 || !V.every(function (x) { return x >= 0; })) { o.textContent = "Enter up to 10 values"; $("#ptz", el).innerHTML = $("#ptb", el).innerHTML = ""; return; }
          while (L.length < V.length) L.push("Item " + (L.length + 1));
          var S = V.reduce(function (a, b) { return a + b; }, 0), pc = V.map(function (v) { return k === "p" ? v : k === "d" ? v / 3.6 : v / S * 100; }), tot = k === "a" ? S : T;
          $("#ptz", el).innerHTML = pieSvg(L.slice(0, V.length), pc);
          $("#ptb", el).innerHTML = "<tr><th>Category</th><th>%</th><th>Degrees</th><th>Amount</th></tr>" + pc.map(function (p, i) { return '<tr><td><i class="sw2" style="background:' + SHC[i % 6] + '"></i>' + esc(L[i]) + "</td><td>" + fmtN(p) + "%</td><td>" + fmtN(p * 3.6) + "°</td><td>" + (tot > 0 ? fmtN(p / 100 * tot) : "—") + "</td></tr>"; }).join("");
          var sp = pc.reduce(function (a, b) { return a + b; }, 0);
          o.innerHTML = "Total " + fmtN(sp) + "% = " + fmtN(sp * 3.6) + "°" + (Math.abs(sp - 100) > 0.01 ? " (should be 100%)" : "") + "<small>% × 3.6 = degrees; degrees ÷ 360 × total = amount.</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    fraccmp: {
      title: "Which fraction is bigger?", html: '<p class="small muted">Compare two ratios without dividing, by cross-multiplying.</p><div class="grid g2"><div class="field"><label>First a / b</label><div class="row"><input type="number" id="fa" value="45"><b>/</b><input type="number" id="fb" value="135"></div></div><div class="field"><label>Second c / d</label><div class="row"><input type="number" id="fc" value="36"><b>/</b><input type="number" id="fd" value="180"></div></div></div><div class="out" id="fco"></div>',
      init: function (el) {
        function up() {
          var a = parseFloat($("#fa", el).value), b = parseFloat($("#fb", el).value), c = parseFloat($("#fc", el).value), d = parseFloat($("#fd", el).value), o = $("#fco", el);
          if (![a, b, c, d].every(isFinite) || !(b > 0 && d > 0)) { o.textContent = "Enter four numbers with positive denominators"; return; }
          var L = a * d, R = b * c;
          o.innerHTML = (Math.abs(L - R) < 1e-9 ? "They are equal" : (L > R ? fmtN(a) + "/" + fmtN(b) : fmtN(c) + "/" + fmtN(d)) + " is bigger") + "<small>a × d = " + fmtN(L) + " and b × c = " + fmtN(R) + ". As decimals: " + fmtN(a / b) + " and " + fmtN(c / d) + " (" + fmtN(a / b * 100) + "% vs " + fmtN(c / d * 100) + "%).</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    didrill: {
      title: "Random DI drill", html: '<p class="small muted">A new made-up chart every round. Read it and answer.</p><div id="ddc"></div><div class="qtext" id="ddq" style="font-weight:700;margin:6px 0"></div><div class="opts" id="ddo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score: <b id="dds">0</b> / <b id="ddn">0</b></span><button class="btn btn-accent btn-sm" id="ddg">Next chart</button></div><div class="why" id="ddw" hidden></div>',
      init: function (el) {
        var sc = 0, n = 0;
        function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
        function round() {
          var names = ["Mon", "Tue", "Wed", "Thu", "Fri"], V = names.map(function () { return rnd(4, 20) * 5; }), i = rnd(0, 3), j = i + 1 + rnd(0, 3 - i), q, ans, why, ops;
          $("#ddc", el).innerHTML = barsSvg(names, V, "Units sold (made-up data)");
          var t = rnd(0, 3);
          if (t === 0) { ans = (V[j] - V[i]) / V[i] * 100; q = "% change from " + names[i] + " to " + names[j] + "?"; why = "(" + V[j] + " − " + V[i] + ") ÷ " + V[i] + " × 100"; ops = [ans, -ans, (V[j] - V[i]) / V[j] * 100, ans + 10]; }
          else if (t === 1) { var s = V.reduce(function (a, b) { return a + b; }, 0); ans = s / 5; q = "Average units per day?"; why = s + " ÷ 5"; ops = [ans, ans + 5, ans - 5, s / 4]; }
          else if (t === 2) { ans = V[i] / V.reduce(function (a, b) { return a + b; }, 0) * 100; q = names[i] + "'s share of the week's total?"; why = V[i] + " ÷ total × 100"; ops = [ans, ans + 5, ans * 1.5, ans / 2]; }
          else { ans = V[i] + V[j]; q = "Total for " + names[i] + " and " + names[j] + "?"; why = V[i] + " + " + V[j]; ops = [ans, ans + 5, ans - 10, Math.abs(V[i] - V[j])]; }
          var seen = {}; ops = ops.map(function (x) { return Math.round(x * 100) / 100; }).filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; });
          var ord = shuffle(ops.length), unit = t === 0 || t === 2 ? "%" : "";
          $("#ddq", el).textContent = q; $("#ddw", el).hidden = true;
          $("#ddo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + fmtN(ops[k]) + unit + "</button>"; }).join("");
          $$("#ddo .opt", el).forEach(function (b) { b.onclick = function () { if ($("#ddo", el).getAttribute("data-done")) return; $("#ddo", el).setAttribute("data-done", 1); n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#ddo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#dds", el).textContent = sc; $("#ddn", el).textContent = n; $("#ddw", el).hidden = false; $("#ddw", el).textContent = "Working: " + why + " = " + fmtN(ans) + unit; }; });
          $("#ddo", el).removeAttribute("data-done");
        }
        $("#ddg", el).onclick = round; round();
      }
    }
    ,
    statsx: {
      title: "Mean, median, mode and SD", html: '<div class="field"><label for="sxd">Data (comma separated)</label><input type="text" id="sxd" value="2, 4, 4, 4, 5, 5, 7, 9"></div><div id="sxz"></div><div class="out" id="sxo"></div>',
      init: function (el) {
        function up() {
          var x = $("#sxd", el).value.split(/[,\s;]+/).filter(Boolean).map(Number).filter(isFinite).slice(0, 60), o = $("#sxo", el);
          if (x.length < 2) { $("#sxz", el).innerHTML = ""; o.textContent = "Enter at least two numbers"; return; }
          var n = x.length, s = x.slice().sort(function (a, b) { return a - b; }), m = x.reduce(function (a, b) { return a + b; }, 0) / n, med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
          var cnt = {}, best = 0; x.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; if (cnt[v] > best) best = cnt[v]; });
          var modes = Object.keys(cnt).filter(function (k) { return cnt[k] === best; }).map(Number), v = x.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / n;
          $("#sxz", el).innerHTML = dotsSvg(x, m, med);
          o.innerHTML = "Mean " + fmtN(m) + " · median " + fmtN(med) + " · mode " + (best === 1 ? "none" : modes.map(fmtN).join(", ")) + " · SD " + fmtN(Math.sqrt(v)) + "<small>Sorted: " + s.map(fmtN).join(", ") + ". Range " + fmtN(s[n - 1] - s[0]) + ". Variance = Σ(x − " + fmtN(m) + ")² ÷ " + n + " = " + fmtN(v) + ".</small>";
        }
        $("#sxd", el).oninput = up; up();
      }
    },
    freqm: {
      title: "Frequency table", html: '<div class="grid g2"><div class="field"><label for="fqx">Values x</label><input type="text" id="fqx" value="1, 2, 3, 4"></div><div class="field"><label for="fqf">Frequencies f</label><input type="text" id="fqf" value="3, 5, 8, 4"></div></div><div class="tscroll"><table class="pt" id="fqt"></table></div><div class="out" id="fqo"></div>',
      init: function (el) {
        function up() {
          var X = $("#fqx", el).value.split(/[,\s]+/).filter(Boolean).map(Number), F = $("#fqf", el).value.split(/[,\s]+/).filter(Boolean).map(Number), o = $("#fqo", el);
          if (!X.length || X.length !== F.length || !F.every(function (f) { return f >= 0; }) || !X.every(isFinite)) { $("#fqt", el).innerHTML = ""; o.textContent = "Give the same number of values and frequencies"; return; }
          var N = F.reduce(function (a, b) { return a + b; }, 0), S = X.reduce(function (a, x, i) { return a + x * F[i]; }, 0), cf = 0, mi = 0;
          if (!N) { o.textContent = "Frequencies add to 0"; return; }
          var idx = X.map(function (_, i) { return i; }).sort(function (a, b) { return X[a] - X[b]; }), med = null, half = N / 2, run = 0;
          idx.forEach(function (i) { run += F[i]; if (med === null && run >= half) med = X[i]; });
          F.forEach(function (f, i) { if (f > F[mi]) mi = i; });
          $("#fqt", el).innerHTML = "<tr><th>x</th><th>f</th><th>f × x</th><th>cum. f</th></tr>" + idx.map(function (i) { cf += F[i]; return "<tr><td>" + fmtN(X[i]) + "</td><td>" + fmtN(F[i]) + "</td><td>" + fmtN(X[i] * F[i]) + "</td><td>" + fmtN(cf) + "</td></tr>"; }).join("") + "<tr><td><b>Σ</b></td><td><b>" + fmtN(N) + "</b></td><td><b>" + fmtN(S) + "</b></td><td></td></tr>";
          o.innerHTML = "Mean = " + fmtN(S / N) + " · median ≈ " + fmtN(med) + " · mode = " + fmtN(X[mi]) + "<small>Σfx ÷ Σf = " + fmtN(S) + " ÷ " + fmtN(N) + ". The median is where the cumulative frequency first reaches " + fmtN(half) + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    dicegrid: {
      title: "Two dice: the 36 outcomes", html: '<div class="grid g2"><div class="field"><label for="dgk">Event</label><select id="dgk"><option value="eq">Sum equals</option><option value="ge">Sum is at least</option><option value="le">Sum is at most</option><option value="dbl">A double</option><option value="six">At least one six</option></select></div><div class="field" id="dgnw"><label for="dgn">Number</label><input type="number" id="dgn" value="7"></div></div><div class="dg" id="dgg"></div><div class="out" id="dgo"></div>',
      init: function (el) {
        function g(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
        function up() {
          var k = $("#dgk", el).value, n = parseFloat($("#dgn", el).value), h = '<i></i>', c = 0;
          $("#dgnw", el).hidden = k === "dbl" || k === "six";
          for (var b = 1; b <= 6; b++) h += "<i class='hd'>" + b + "</i>";
          for (var a = 1; a <= 6; a++) { h += "<i class='hd'>" + a + "</i>"; for (var b2 = 1; b2 <= 6; b2++) { var s = a + b2, ok = k === "eq" ? s === n : k === "ge" ? s >= n : k === "le" ? s <= n : k === "dbl" ? a === b2 : (a === 6 || b2 === 6); if (ok) c++; h += "<i class='" + (ok ? "on" : "") + "'>" + s + "</i>"; } }
          $("#dgg", el).innerHTML = h;
          var d = g(c, 36) || 1;
          $("#dgo", el).innerHTML = "P = " + c + "/36" + (c && d > 1 ? " = " + c / d + "/" + 36 / d : "") + "<small>" + c + " highlighted outcomes out of 36 (rows: first die, columns: second die, cells show the sum).</small>";
        }
        $$("input,select", el).forEach(function (i) { i.oninput = up; i.onchange = up; }); up();
      }
    },
    bagdraw: {
      title: "Drawing balls from a bag", html: '<div class="grid g4"><div class="field"><label for="bgr">Red balls</label><input type="number" id="bgr" value="5"></div><div class="field"><label for="bgb">Blue balls</label><input type="number" id="bgb" value="3"></div><div class="field"><label for="bgn">Balls drawn</label><input type="number" id="bgn" value="2"></div><div class="field"><label for="bgk">How many red wanted</label><input type="number" id="bgk" value="2"></div></div><div class="bag" id="bgv"></div><div class="out" id="bgo"></div>',
      init: function (el) {
        function C(n, r) { if (r < 0 || r > n) return 0; var x = 1; for (var i = 1; i <= r; i++) x = x * (n - r + i) / i; return Math.round(x); }
        function g(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
        function up() {
          var R = Math.round(+$("#bgr", el).value), B = Math.round(+$("#bgb", el).value), n = Math.round(+$("#bgn", el).value), k = Math.round(+$("#bgk", el).value), o = $("#bgo", el);
          if (!(R >= 0 && B >= 0 && R + B >= 1 && R + B <= 40 && n >= 1 && n <= R + B && k >= 0 && k <= n)) { $("#bgv", el).innerHTML = ""; o.textContent = "Check the numbers (up to 40 balls; draw no more than there are)"; return; }
          var h = ""; for (var i = 0; i < R; i++) h += '<i class="r"></i>'; for (var j = 0; j < B; j++) h += '<i class="b"></i>';
          $("#bgv", el).innerHTML = h;
          var fav = C(R, k) * C(B, n - k), tot = C(R + B, n), d = g(fav, tot) || 1;
          o.innerHTML = "P(exactly " + k + " red) = " + (fav ? fav / d + "/" + tot / d : "0") + "<small>(" + R + "C" + k + " × " + B + "C" + (n - k) + ") ÷ " + (R + B) + "C" + n + " = (" + C(R, k) + " × " + C(B, n - k) + ") ÷ " + tot + " = " + fav + "/" + tot + " ≈ " + fmtN(fav / tot) + ".</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    }
    ,
    alpha: {
      title: "Alphabet positions and opposites", html: '<div class="field"><label for="alw">Type a word</label><input type="text" id="alw" value="GOLD"></div><div class="abc" id="alg"></div><div class="tscroll"><table class="pt" id="alt"></table></div><div class="out" id="alo"></div>',
      init: function (el) {
        var g = ""; for (var i = 0; i < 26; i++) g += '<i data-k="' + i + '"><b>' + String.fromCharCode(65 + i) + "</b><small>" + (i + 1) + "</small></i>";
        $("#alg", el).innerHTML = g;
        function up() {
          var w = $("#alw", el).value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 16), o = $("#alo", el);
          $$("#alg i", el).forEach(function (c) { var k = +c.getAttribute("data-k"), L = String.fromCharCode(65 + k); c.className = (w.indexOf(L) >= 0 ? "on " : "") + ([4, 9, 14, 19, 24].indexOf(k) >= 0 ? "ej" : ""); });
          if (!w) { $("#alt", el).innerHTML = ""; o.textContent = "Type a word"; return; }
          var L = w.split(""), pos = L.map(function (c) { return c.charCodeAt(0) - 64; });
          $("#alt", el).innerHTML = "<tr><th>Letter</th>" + L.map(function (c) { return "<td><b>" + c + "</b></td>"; }).join("") + "</tr><tr><th>Position</th>" + pos.map(function (p) { return "<td>" + p + "</td>"; }).join("") + "</tr><tr><th>Opposite</th>" + pos.map(function (p) { return "<td>" + String.fromCharCode(64 + 27 - p) + "</td>"; }).join("") + "</tr><tr><th>From the end</th>" + pos.map(function (p) { return "<td>" + (27 - p) + "</td>"; }).join("") + "</tr>";
          o.innerHTML = "Opposite word: " + pos.map(function (p) { return String.fromCharCode(64 + 27 - p); }).join("") + " · sum of positions " + pos.reduce(function (a, b) { return a + b; }, 0) + "<small>Opposite letters add to 27. E, J, O, T, Y (highlighted) are 5, 10, 15, 20, 25.</small>";
        }
        $("#alw", el).oninput = up; up();
      }
    },
    numrule: {
      title: "Number pair rule finder", html: '<p class="small muted">Give the first pair; the tool tests common rules and applies the ones that fit to your third number.</p><div class="grid g3"><div class="field"><label for="nra">a</label><input type="number" id="nra" value="5"></div><div class="field"><label for="nrb">b</label><input type="number" id="nrb" value="26"></div><div class="field"><label for="nrc">c</label><input type="number" id="nrc" value="7"></div></div><div class="out" id="nro"></div>',
      init: function (el) {
        var R = [["n²", function (n) { return n * n; }], ["n³", function (n) { return n * n * n; }], ["n² + 1", function (n) { return n * n + 1; }], ["n² − 1", function (n) { return n * n - 1; }], ["n³ + 1", function (n) { return n * n * n + 1; }], ["n³ − 1", function (n) { return n * n * n - 1; }], ["n(n + 1)", function (n) { return n * (n + 1); }], ["n(n − 1)", function (n) { return n * (n - 1); }], ["n² + n + 1", function (n) { return n * n + n + 1; }], ["2n + 1", function (n) { return 2 * n + 1; }], ["(n + 1)²", function (n) { return (n + 1) * (n + 1); }]];
        function up() {
          var a = parseFloat($("#nra", el).value), b = parseFloat($("#nrb", el).value), c = parseFloat($("#nrc", el).value), o = $("#nro", el);
          if (![a, b, c].every(isFinite)) { o.textContent = "Enter three numbers"; return; }
          var hits = R.filter(function (r) { return Math.abs(r[1](a) - b) < 1e-9; }).map(function (r) { return r[0] + " → " + fmtN(r[1](c)); });
          if (a && Math.abs(b / a - Math.round(b / a)) < 1e-9) hits.push("× " + fmtN(b / a) + " → " + fmtN(c * b / a));
          hits.push("+ " + fmtN(b - a) + " → " + fmtN(c + b - a));
          o.innerHTML = (hits.length > 1 ? hits[0] : "No special rule; simple difference") + "<small>Rules that fit " + fmtN(a) + " : " + fmtN(b) + ": " + hits.join(" · ") + ". If several fit, check which answer is in the options.</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    letshift: {
      title: "Letter-shift solver", html: '<p class="small muted">Find the shift for each letter in the first pair and apply it to a new word.</p><div class="grid g3"><div class="field"><label for="lsa">First word</label><input type="text" id="lsa" value="CAT"></div><div class="field"><label for="lsb">Becomes</label><input type="text" id="lsb" value="DBU"></div><div class="field"><label for="lsc">New word</label><input type="text" id="lsc" value="DOG"></div></div><div class="tscroll"><table class="pt" id="lst"></table></div><div class="out" id="lso"></div>',
      init: function (el) {
        function cl(s) { return s.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12); }
        function up() {
          var A = cl($("#lsa", el).value), B = cl($("#lsb", el).value), C = cl($("#lsc", el).value), o = $("#lso", el);
          if (!A || A.length !== B.length) { $("#lst", el).innerHTML = ""; o.textContent = "The first two words must have the same length"; return; }
          var sh = A.split("").map(function (c, i) { var d = B.charCodeAt(i) - c.charCodeAt(0); return d > 13 ? d - 26 : d < -13 ? d + 26 : d; }), opp = A.split("").every(function (c, i) { return c.charCodeAt(0) - 64 + B.charCodeAt(i) - 64 === 27; });
          $("#lst", el).innerHTML = "<tr><th></th>" + A.split("").map(function (c) { return "<td><b>" + c + "</b></td>"; }).join("") + "</tr><tr><th>→</th>" + B.split("").map(function (c) { return "<td><b>" + c + "</b></td>"; }).join("") + "</tr><tr><th>Shift</th>" + sh.map(function (d) { return "<td>" + (d >= 0 ? "+" : "") + d + "</td>"; }).join("") + "</tr>";
          if (!C) { o.textContent = "Type a new word"; return; }
          var out = C.split("").map(function (c, i) { var p = c.charCodeAt(0) - 65; if (opp) return String.fromCharCode(90 - p); var d = sh[i % sh.length]; return String.fromCharCode(65 + ((p + d) % 26 + 26) % 26); }).join("");
          o.innerHTML = C + " → " + out + "<small>" + (opp ? "Each letter becomes its opposite (positions add to 27)." : "Shifts " + sh.map(function (d) { return (d >= 0 ? "+" : "") + d; }).join(", ") + (C.length > sh.length ? " (repeated)" : "") + " applied letter by letter.") + "</small>";
        }
        $$("input", el).forEach(function (i) { i.oninput = up; }); up();
      }
    },
    relquiz: {
      title: "Relationship spotter", html: '<p class="small muted">What is the relationship in each pair? Build the habit of naming it.</p><div class="big" id="rqp" style="text-align:center;font-size:24px;font-weight:800">…</div><div class="opts" id="rqo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="rqs">0</b> / <b id="rqn">0</b></span><button class="btn btn-accent btn-sm" id="rqg">Next pair</button></div>',
      init: function (el) {
        var P = [["Pen", "Write", "Tool : use"], ["Saw", "Cut", "Tool : use"], ["Brush", "Paint", "Tool : use"], ["Chef", "Kitchen", "Worker : workplace"], ["Pilot", "Cockpit", "Worker : workplace"], ["Farmer", "Field", "Worker : workplace"], ["Horse", "Foal", "Animal : young one"], ["Cat", "Kitten", "Animal : young one"], ["Lion", "Cub", "Animal : young one"], ["Page", "Book", "Part : whole"], ["Petal", "Flower", "Part : whole"], ["Wheel", "Car", "Part : whole"], ["Ammeter", "Current", "Instrument : measures"], ["Odometer", "Distance", "Instrument : measures"], ["Hygrometer", "Humidity", "Instrument : measures"], ["France", "Paris", "Country : capital"], ["Nepal", "Kathmandu", "Country : capital"], ["Egypt", "Cairo", "Country : capital"], ["Happy", "Sad", "Opposites"], ["Ancient", "Modern", "Opposites"], ["Brave", "Bold", "Same meaning"], ["Begin", "Commence", "Same meaning"]];
        var types = ["Tool : use", "Worker : workplace", "Animal : young one", "Part : whole", "Instrument : measures", "Country : capital", "Opposites", "Same meaning"], sc = 0, n = 0;
        function round() {
          var p = P[Math.floor(Math.random() * P.length)], opts = [p[2]];
          while (opts.length < 4) { var t = types[Math.floor(Math.random() * types.length)]; if (opts.indexOf(t) < 0) opts.push(t); }
          var ord = shuffle(4); $("#rqp", el).textContent = p[0] + " : " + p[1];
          $("#rqo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + opts[k] + "</button>"; }).join("");
          var done = false;
          $$("#rqo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#rqo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#rqs", el).textContent = sc; $("#rqn", el).textContent = n; }; });
        }
        $("#rqg", el).onclick = round; round();
      }
    }
    ,
    numprop: {
      title: "Number property checker", html: '<div class="field"><label for="npl">Numbers (comma separated)</label><input type="text" id="npl" value="17, 23, 29, 33"></div><div class="tscroll"><table class="pt" id="npt"></table></div><div class="out" id="npo"></div>',
      init: function (el) {
        function isP(n) { if (n < 2 || n !== Math.floor(n)) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
        function isSq(n) { var r = Math.round(Math.sqrt(n)); return n >= 0 && r * r === n; }
        function isCu(n) { var r = Math.round(Math.cbrt(n)); return r * r * r === n; }
        function ds(n) { return String(Math.abs(n)).split("").reduce(function (a, b) { return a + (+b || 0); }, 0); }
        function up() {
          var N = $("#npl", el).value.split(/[,\s]+/).filter(Boolean).map(Number).filter(function (x) { return isFinite(x) && x === Math.floor(x); }).slice(0, 8), o = $("#npo", el);
          if (N.length < 3) { $("#npt", el).innerHTML = ""; o.textContent = "Enter at least three whole numbers"; return; }
          var props = [["Prime", isP], ["Square", isSq], ["Cube", isCu], ["Even", function (n) { return n % 2 === 0; }], ["÷ 3", function (n) { return n % 3 === 0; }], ["÷ 7", function (n) { return n % 7 === 0; }], ["÷ 11", function (n) { return n % 11 === 0; }]], found = [], later = [];
          $("#npt", el).innerHTML = "<tr><th>Property</th>" + N.map(function (n) { return "<th>" + fmtN(n) + "</th>"; }).join("") + "</tr>" + props.map(function (p) {
            var r = N.map(p[1]), yes = r.filter(Boolean).length, odd = yes === N.length - 1 ? r.indexOf(false) : yes === 1 ? r.indexOf(true) : -1;
            if (odd >= 0) { var msg = fmtN(N[odd]) + " (" + (yes === 1 ? "only one that is " : "only one that is not ") + p[0].toLowerCase() + ")"; (yes === 1 ? later : found).push(msg); }
            return "<tr><td>" + p[0] + "</td>" + r.map(function (v, i) { return '<td class="' + (i === odd ? "odd" : "") + '">' + (v ? "✓" : "·") + "</td>"; }).join("") + "</tr>";
          }).join("") + (function () { found = found.concat(later); return ""; })() + "<tr><td>Digit sum</td>" + N.map(function (n) { return "<td>" + ds(n) + "</td>"; }).join("") + "</tr>";
          o.innerHTML = (found.length ? "Odd one: " + found[0] : "No single property separates one number") + "<small>" + (found.length > 1 ? "Other candidates: " + found.slice(1).join("; ") + ". Pick the most specific pattern." : "Highlighted cells break the pattern of the rest.") + "</small>";
        }
        $("#npl", el).oninput = up; up();
      }
    },
    lgap: {
      title: "Letter-group gap analyser", html: '<div class="field"><label for="lgl">Letter groups (comma separated)</label><input type="text" id="lgl" value="ACE, GIK, MOQ, RTW"></div><div class="tscroll"><table class="pt" id="lgt"></table></div><div class="out" id="lgo"></div>',
      init: function (el) {
        function up() {
          var G = $("#lgl", el).value.toUpperCase().split(/[,\s]+/).map(function (s) { return s.replace(/[^A-Z]/g, ""); }).filter(Boolean).slice(0, 8), o = $("#lgo", el);
          if (G.length < 3) { $("#lgt", el).innerHTML = ""; o.textContent = "Enter at least three letter groups"; return; }
          var gaps = G.map(function (w) { var a = []; for (var i = 1; i < w.length; i++) a.push(w.charCodeAt(i) - w.charCodeAt(i - 1)); return a.join(","); }), cnt = {};
          gaps.forEach(function (g) { cnt[g] = (cnt[g] || 0) + 1; });
          var odd = gaps.map(function (g) { return cnt[g] === 1 && G.length - 1 === Math.max.apply(null, Object.keys(cnt).map(function (k) { return cnt[k]; })); });
          $("#lgt", el).innerHTML = "<tr><th>Group</th><th>Positions</th><th>Gaps</th><th>Vowels</th></tr>" + G.map(function (w, i) { return "<tr class='" + (odd[i] ? "hl" : "") + "'><td><b>" + w + "</b></td><td>" + w.split("").map(function (c) { return c.charCodeAt(0) - 64; }).join(", ") + "</td><td>" + gaps[i].split(",").map(function (d) { return (d > 0 ? "+" : "") + d; }).join(", ") + "</td><td>" + (w.match(/[AEIOU]/g) || []).length + "</td></tr>"; }).join("");
          var k = odd.indexOf(true);
          o.innerHTML = (k >= 0 ? "Odd one: " + G[k] : "The gaps do not single one out") + "<small>" + (k >= 0 ? "Its gaps are " + gaps[k] + "; the others share " + Object.keys(cnt).filter(function (x) { return cnt[x] > 1; })[0] + "." : "Check vowels or reverse order instead.") + "</small>";
        }
        $("#lgl", el).oninput = up; up();
      }
    },
    pairrule: {
      title: "Odd pair finder", html: '<div class="field"><label for="prl">Pairs like 4-16, 5-25, 6-36, 7-48</label><input type="text" id="prl" value="4-16, 5-25, 6-36, 7-48"></div><div class="out" id="pro"></div>',
      init: function (el) {
        var R = [["n²", function (n) { return n * n; }], ["n³", function (n) { return n * n * n; }], ["n² + 1", function (n) { return n * n + 1; }], ["n² − 1", function (n) { return n * n - 1; }], ["n(n + 1)", function (n) { return n * (n + 1); }], ["n³ + 1", function (n) { return n * n * n + 1; }], ["2n", function (n) { return 2 * n; }], ["3n", function (n) { return 3 * n; }], ["n + 5", function (n) { return n + 5; }]];
        function up() {
          var P = $("#prl", el).value.split(/[,;]+/).map(function (s) { var m = s.match(/(-?\d+(?:\.\d+)?)\s*[-–:]\s*(-?\d+(?:\.\d+)?)/); return m ? [+m[1], +m[2]] : null; }).filter(Boolean), o = $("#pro", el);
          if (P.length < 3) { o.textContent = "Enter at least three pairs"; return; }
          var best = null;
          R.forEach(function (r) { var bad = P.filter(function (p) { return Math.abs(r[1](p[0]) - p[1]) > 1e-9; }); if (bad.length === 1 && !best) best = [r, bad[0]]; });
          o.innerHTML = best ? "Odd pair: " + best[1][0] + "–" + best[1][1] + "<small>The rule is " + best[0][0] + ": " + best[1][0] + " should give " + fmtN(best[0][1](best[1][0])) + ".</small>" : "No common rule found<small>Try other rules such as digit sums or reversed digits.</small>";
        }
        $("#prl", el).oninput = up; up();
      }
    },
    oddgame: {
      title: "Odd-one-out game", html: '<div class="opts" id="ogo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="ogs">0</b> / <b id="ogn">0</b></span><button class="btn btn-accent btn-sm" id="ogg">Next</button></div><div class="why" id="ogw" hidden></div>',
      init: function (el) {
        var S = [[["Mango", "Apple", "Grapes"], "Carrot", "fruits"], [["Delhi", "Paris", "Tokyo"], "Asia", "cities"], [["Copper", "Iron", "Silver"], "Wood", "metals"], [["Rupee", "Dollar", "Yen"], "Bank", "currencies"], [["Hockey", "Cricket", "Football"], "Chess", "outdoor games"], [["Eagle", "Sparrow", "Parrot"], "Bat", "birds"], [["Square", "Triangle", "Hexagon"], "Circle", "polygons with straight sides"], [["Cobra", "Python", "Viper"], "Lizard", "snakes"], [["Monday", "Friday", "Sunday"], "March", "days"], [["Tabla", "Drum", "Dholak"], "Flute", "percussion instruments"], [["Ganga", "Yamuna", "Godavari"], "Himalaya", "rivers"], [["Wheat", "Rice", "Barley"], "Potato", "cereals"]], sc = 0, n = 0;
        function round() {
          var s = S[Math.floor(Math.random() * S.length)], items = s[0].concat([s[1]]), ord = shuffle(4), done = false;
          $("#ogw", el).hidden = true;
          $("#ogo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 3 ? 1 : 0) + '">' + items[k] + "</button>"; }).join("");
          $$("#ogo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#ogo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#ogs", el).textContent = sc; $("#ogn", el).textContent = n; $("#ogw", el).hidden = false; $("#ogw", el).textContent = s[0].join(", ") + " are " + s[2] + "; " + s[1] + " is not."; }; });
        }
        $("#ogg", el).onclick = round; round();
      }
    }
    ,
    sdiff: {
      title: "Difference and ratio table", html: '<div class="field"><label for="sdl">Series (comma separated)</label><input type="text" id="sdl" value="3, 4, 8, 17, 33"></div><div class="tscroll"><table class="pt" id="sdt"></table></div><div class="out" id="sdo"></div>',
      init: function (el) {
        function d(a) { var o = []; for (var i = 1; i < a.length; i++) o.push(a[i] - a[i - 1]); return o; }
        function same(a) { return a.length > 1 && a.every(function (x) { return Math.abs(x - a[0]) < 1e-9; }); }
        function up() {
          var S = $("#sdl", el).value.split(/[,\s]+/).filter(Boolean).map(Number).filter(isFinite).slice(0, 12), o = $("#sdo", el);
          if (S.length < 3) { $("#sdt", el).innerHTML = ""; o.textContent = "Enter at least three terms"; return; }
          var d1 = d(S), d2 = d(d1), d3 = d(d2), r = S.slice(1).map(function (x, i) { return S[i] ? x / S[i] : NaN; }), next = null, why = "";
          if (same(d1)) { next = S[S.length - 1] + d1[0]; why = "constant difference " + fmtN(d1[0]); }
          else if (same(d2)) { next = S[S.length - 1] + d1[d1.length - 1] + d2[0]; why = "differences grow by " + fmtN(d2[0]); }
          else if (same(r) && isFinite(r[0])) { next = S[S.length - 1] * r[0]; why = "constant ratio × " + fmtN(r[0]); }
          else if (same(d3)) { var n2 = d2[d2.length - 1] + d3[0], n1 = d1[d1.length - 1] + n2; next = S[S.length - 1] + n1; why = "third differences are constant"; }
          else if ([2, 3].some(function (e) { var b = S.map(function (x) { return Math.round(Math.pow(Math.abs(x), 1 / e)); }); if (b.every(function (v, i) { return Math.pow(v, e) === Math.abs(S[i]) && (i === 0 || v === b[i - 1] + 1); })) { next = Math.pow(b[b.length - 1] + 1, e); why = (e === 2 ? "squares" : "cubes") + " of consecutive numbers"; return true; } return false; })) { }
          else { var ratios = r.map(function (x) { return Math.round(x * 1e6) / 1e6; }), sq = d1.every(function (x, i) { return Math.round(Math.sqrt(Math.abs(x))) ** 2 === Math.abs(x); }); if (sq) { var k = Math.round(Math.sqrt(Math.abs(d1[d1.length - 1]))) + 1; next = S[S.length - 1] + k * k * Math.sign(d1[0] || 1); why = "differences are squares"; } }
          var row = function (n, a) { return "<tr><th>" + n + "</th>" + a.map(function (x) { return "<td>" + (isFinite(x) ? fmtN(x) : "—") + "</td>"; }).join("") + "</tr>"; };
          $("#sdt", el).innerHTML = row("Terms", S) + row("1st diff", d1) + row("2nd diff", d2) + row("Ratio", r);
          o.innerHTML = next !== null ? "Next term: " + fmtN(next) + "<small>Pattern: " + why + ".</small>" : "No simple pattern found<small>Try splitting into two alternating series, or look for squares, cubes or primes.</small>";
        }
        $("#sdl", el).oninput = up; up();
      }
    },
    lser: {
      title: "Letter series to positions", html: '<div class="field"><label for="lsl">Letters (comma separated)</label><input type="text" id="lsl" value="A, C, F, J, O"></div><div class="tscroll"><table class="pt" id="lst2"></table></div><div class="out" id="lso2"></div>',
      init: function (el) {
        function up() {
          var L = $("#lsl", el).value.toUpperCase().split(/[,\s]+/).map(function (s) { return s.replace(/[^A-Z]/g, ""); }).filter(function (s) { return s.length === 1; }).slice(0, 12), o = $("#lso2", el);
          if (L.length < 3) { $("#lst2", el).innerHTML = ""; o.textContent = "Enter at least three single letters"; return; }
          var P = L.map(function (c) { return c.charCodeAt(0) - 64; }), g = P.slice(1).map(function (x, i) { return x - P[i]; }), g2 = g.slice(1).map(function (x, i) { return x - g[i]; }), nxt = null;
          if (g.every(function (x) { return x === g[0]; })) nxt = P[P.length - 1] + g[0];
          else if (g2.every(function (x) { return x === g2[0]; })) nxt = P[P.length - 1] + g[g.length - 1] + g2[0];
          $("#lst2", el).innerHTML = "<tr><th>Letter</th>" + L.map(function (c) { return "<td><b>" + c + "</b></td>"; }).join("") + "</tr><tr><th>Position</th>" + P.map(function (p) { return "<td>" + p + "</td>"; }).join("") + "</tr><tr><th>Gap</th><td></td>" + g.map(function (x) { return "<td>" + (x > 0 ? "+" : "") + x + "</td>"; }).join("") + "</tr>";
          var wrap = function (p) { return ((p - 1) % 26 + 26) % 26 + 1; };
          o.innerHTML = nxt !== null ? "Next letter: " + String.fromCharCode(64 + wrap(nxt)) + "<small>Position " + wrap(nxt) + (nxt !== wrap(nxt) ? " (wrapped round the alphabet)" : "") + ".</small>" : "No single gap pattern<small>Try splitting into two series, or compare with opposite letters.</small>";
        }
        $("#lsl", el).oninput = up; up();
      }
    },
    altsplit: {
      title: "Alternating series splitter", html: '<div class="field"><label for="asl">Series</label><input type="text" id="asl" value="2, 10, 4, 20, 6, 30"></div><div id="asz"></div><div class="out" id="aso"></div>',
      init: function (el) {
        function nextOf(a) { if (a.length < 2) return null; var d = a.slice(1).map(function (x, i) { return x - a[i]; }); if (d.every(function (x) { return x === d[0]; })) return a[a.length - 1] + d[0]; var r = a.slice(1).map(function (x, i) { return a[i] ? x / a[i] : NaN; }); if (r.every(function (x) { return Math.abs(x - r[0]) < 1e-9; })) return a[a.length - 1] * r[0]; return null; }
        function up() {
          var S = $("#asl", el).value.split(/[,\s]+/).filter(Boolean).map(Number).filter(isFinite).slice(0, 14), o = $("#aso", el);
          if (S.length < 4) { $("#asz", el).innerHTML = ""; o.textContent = "Enter at least four terms"; return; }
          $("#asz", el).innerHTML = altViz(S);
          var odd = S.filter(function (_, i) { return i % 2 === 0; }), even = S.filter(function (_, i) { return i % 2 === 1; }), turn = S.length % 2 === 0 ? odd : even, nx = nextOf(turn);
          o.innerHTML = (nx !== null ? "Next term: " + fmtN(nx) : "The parts have no simple rule") + "<small>Odd positions: " + odd.map(fmtN).join(", ") + ". Even positions: " + even.map(fmtN).join(", ") + ". The next term continues the " + (S.length % 2 === 0 ? "odd" : "even") + "-position series.</small>";
        }
        $("#asl", el).oninput = up; up();
      }
    },
    sergame: {
      title: "Series sprint", html: '<div class="big" id="sgq" style="text-align:center;font-size:22px;font-weight:800">…</div><div class="opts" id="sgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="sgs">0</b> / <b id="sgn">0</b></span><button class="btn btn-accent btn-sm" id="sgg">Next series</button></div><div class="why" id="sgw" hidden></div>',
      init: function (el) {
        var sc = 0, n = 0;
        function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
        function make() {
          var t = rnd(0, 5), a = rnd(1, 9), k = rnd(2, 6), s = [], rule;
          if (t === 0) { for (var i = 0; i < 6; i++) s.push(a + i * k); rule = "+" + k + " each time"; }
          else if (t === 1) { var m = rnd(2, 3); s.push(a); for (var j = 1; j < 6; j++) s.push(s[j - 1] * m); rule = "× " + m; }
          else if (t === 2) { var g = rnd(1, 3); s.push(a); for (var q = 1; q < 6; q++) s.push(s[q - 1] + g + 2 * (q - 1)); rule = "gaps grow by 2"; }
          else if (t === 3) { var b = rnd(1, 4); for (var r = b; r < b + 6; r++) s.push(r * r); rule = "squares"; }
          else if (t === 4) { s.push(a); for (var u = 1; u < 6; u++) s.push(s[u - 1] * 2 + 1); rule = "× 2 + 1"; }
          else { var c = rnd(2, 5), d = rnd(3, 9); for (var v = 0; v < 6; v++) s.push(v % 2 === 0 ? a + (v / 2) * c : d * ((v + 1) / 2)); rule = "two alternating series"; }
          return { shown: s.slice(0, 5), ans: s[5], rule: rule };
        }
        function round() {
          var p = make(), ops = [p.ans, p.ans + rnd(1, 3), p.ans - rnd(1, 4), p.ans + rnd(4, 9)].filter(function (v, i, a) { return a.indexOf(v) === i; }), ord = shuffle(ops.length), done = false;
          $("#sgq", el).textContent = p.shown.join(", ") + ", ?"; $("#sgw", el).hidden = true;
          $("#sgo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + ops[k] + "</button>"; }).join("");
          $$("#sgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#sgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#sgs", el).textContent = sc; $("#sgn", el).textContent = n; $("#sgw", el).hidden = false; $("#sgw", el).textContent = "Rule: " + p.rule + "."; }; });
        }
        $("#sgg", el).onclick = round; round();
      }
    }
    ,
    codeshift: {
      title: "Letter coder", html: '<div class="field"><label for="csw">Word</label><input type="text" id="csw" value="DOG" maxlength="14"></div><div class="field"><label for="csm">Rule</label><select id="csm"><option value="s">Shift each letter by k</option><option value="g">Growing shift (k, k+1, k+2 …)</option><option value="a">Alternating +k, −k</option><option value="o">Opposite letter (A↔Z)</option><option value="r">Reverse the word</option><option value="n">Letter positions</option></select></div><div class="field"><label for="csk">k = <b id="cskv">1</b></label><input type="range" id="csk" min="-5" max="7" value="1"></div><div class="out" id="cso"></div>',
      init: function (el) {
        function w(p) { return String.fromCharCode(65 + ((p - 1) % 26 + 26) % 26); }
        function up() {
          var W = $("#csw", el).value.toUpperCase().replace(/[^A-Z]/g, ""), m = $("#csm", el).value, k = +$("#csk", el).value, P = W.split("").map(function (c) { return c.charCodeAt(0) - 64; }), out;
          $("#cskv", el).textContent = k;
          if (!W) { $("#cso", el).textContent = "Type a word"; return; }
          if (m === "s") out = P.map(function (p) { return w(p + k); }).join("");
          else if (m === "g") out = P.map(function (p, i) { return w(p + k + i); }).join("");
          else if (m === "a") out = P.map(function (p, i) { return w(p + (i % 2 ? -k : k)); }).join("");
          else if (m === "o") out = P.map(function (p) { return w(27 - p); }).join("");
          else if (m === "r") out = W.split("").reverse().join("");
          else out = P.join("-");
          $("#cso", el).innerHTML = W + " → " + out + "<small>Positions: " + P.join(", ") + (m === "n" ? ". Sum = " + P.reduce(function (a, b) { return a + b; }, 0) : "") + ".</small>";
        }
        $$("input,select", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    codefind: {
      title: "Find the rule from an example", html: '<div class="grid2"><div class="field"><label for="cfa">Word</label><input type="text" id="cfa" value="FRIEND"></div><div class="field"><label for="cfb">Code</label><input type="text" id="cfb" value="HUMJTK"></div></div><div class="field"><label for="cfc">New word to code</label><input type="text" id="cfc" value="CANDLE"></div><div class="tscroll"><table class="pt" id="cft"></table></div><div class="out" id="cfo"></div>',
      init: function (el) {
        function w(p) { return String.fromCharCode(65 + ((p - 1) % 26 + 26) % 26); }
        function pos(s) { return s.toUpperCase().replace(/[^A-Z]/g, "").split("").map(function (c) { return c.charCodeAt(0) - 64; }); }
        function md(x) { return ((x % 26) + 39) % 26 - 13; }
        function up() {
          var A = pos($("#cfa", el).value), B = pos($("#cfb", el).value), C = pos($("#cfc", el).value), o = $("#cfo", el), rule = null, f = null;
          if (!A.length || A.length !== B.length) { $("#cft", el).innerHTML = ""; o.textContent = "Word and code must have the same number of letters"; return; }
          var g = A.map(function (a, i) { return md(B[i] - a); });
          $("#cft", el).innerHTML = "<tr><th>Word</th>" + A.map(function (a) { return "<td>" + w(a) + "<br><small>" + a + "</small></td>"; }).join("") + "</tr><tr><th>Code</th>" + B.map(function (b) { return "<td>" + w(b) + "<br><small>" + b + "</small></td>"; }).join("") + "</tr><tr><th>Gap</th>" + g.map(function (x) { return "<td>" + (x > 0 ? "+" : "") + x + "</td>"; }).join("") + "</tr>";
          if (g.every(function (x) { return x === g[0]; })) { rule = "every letter " + (g[0] >= 0 ? "+" : "") + g[0]; f = function (p) { return w(p + g[0]); }; }
          else if (g.every(function (x, i) { return i === 0 || x - g[i - 1] === g[1] - g[0]; })) { rule = "gap changes by " + (g[1] - g[0]) + " each letter"; f = function (p, i) { return w(p + g[0] + i * (g[1] - g[0])); }; }
          else if (A.every(function (a, i) { return a + B[i] === 27; })) { rule = "opposite letters (sum 27)"; f = function (p) { return w(27 - p); }; }
          else if (A.every(function (a, i) { return a === B[B.length - 1 - i]; })) { rule = "word reversed"; f = null; }
          else if (g.every(function (x, i) { return x === (i % 2 ? g[1] : g[0]); })) { rule = "alternating " + g[0] + " and " + g[1]; f = function (p, i) { return w(p + (i % 2 ? g[1] : g[0])); }; }
          if (!rule) { o.innerHTML = "No single rule found<small>Try opposite letters for some positions, or rearranged letters.</small>"; return; }
          var res = !C.length ? "" : rule === "word reversed" ? C.map(w).reverse().join("") : C.map(f).join("");
          o.innerHTML = (res ? C.map(w).join("") + " → " + res : "Rule found") + "<small>Rule: " + rule + ".</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    codelang: {
      title: "Code language solver", html: '<p class="note">Write each sentence as <b>words = codes</b>, one per line.</p><div class="field"><label for="clt">Sentences</label><textarea id="clt" rows="4">sun is hot = mo na ti\nhot and cold = ti ra so\nsun rises = pe na</textarea></div><div class="out" id="clo"></div>',
      init: function (el) {
        function up() {
          var L = $("#clt", el).value.split("\n").map(function (l) { var p = l.split("="); if (p.length !== 2) return null; return { w: p[0].trim().toLowerCase().split(/\s+/).filter(Boolean), c: p[1].trim().toLowerCase().split(/\s+/).filter(Boolean) }; }).filter(Boolean), o = $("#clo", el), found = {};
          if (L.length < 2) { o.textContent = "Enter at least two sentences"; return; }
          for (var it = 0; it < 4; it++) {
            for (var i = 0; i < L.length; i++) for (var j = i + 1; j < L.length; j++) {
              var cw = L[i].w.filter(function (x) { return L[j].w.indexOf(x) >= 0 && !found[x]; }), used = Object.keys(found).map(function (k) { return found[k]; }), cc = L[i].c.filter(function (x) { return L[j].c.indexOf(x) >= 0 && used.indexOf(x) < 0; });
              if (cw.length === 1 && cc.length === 1) found[cw[0]] = cc[0];
            }
            L.forEach(function (s) { var rw = s.w.filter(function (x) { return !found[x]; }), used = Object.keys(found).map(function (k) { return found[k]; }), rc = s.c.filter(function (x) { return used.indexOf(x) < 0; }); if (rw.length === 1 && rc.length === 1) found[rw[0]] = rc[0]; });
          }
          var k = Object.keys(found);
          o.innerHTML = k.length ? k.map(function (x) { return esc(x) + " = " + esc(found[x]); }).join(" · ") + "<small>Found by comparing sentences in pairs. Words that appear only once cannot always be fixed.</small>" : "No word could be fixed<small>Each pair of sentences needs exactly one common word.</small>";
        }
        $("#clt", el).oninput = up; up();
      }
    },
    codegame: {
      title: "Code it fast", html: '<div class="big" id="cgq" style="text-align:center;font-size:20px;font-weight:800">…</div><div class="opts" id="cgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="cgs">0</b> / <b id="cgn">0</b></span><button class="btn btn-accent btn-sm" id="cgg">Next</button></div><div class="why" id="cgw" hidden></div>',
      init: function (el) {
        var W = ["BOOK", "LAMP", "FISH", "COLD", "RAIN", "MILK", "SHIP", "TREE", "BELL", "GOAT", "KITE", "DESK", "WIND", "ROAD", "HILL"], sc = 0, n = 0;
        function w(p) { return String.fromCharCode(65 + ((p - 1) % 26 + 26) % 26); }
        function cd(s, t, k) { var P = s.split("").map(function (c) { return c.charCodeAt(0) - 64; }); if (t === 0) return P.map(function (p) { return w(p + k); }).join(""); if (t === 1) return P.map(function (p) { return w(27 - p); }).join(""); return s.split("").reverse().join(""); }
        function round() {
          var a = W[Math.floor(Math.random() * W.length)], b; do { b = W[Math.floor(Math.random() * W.length)]; } while (b === a);
          var t = Math.floor(Math.random() * 3), k = [1, 2, 3, -1, -2][Math.floor(Math.random() * 5)], ans = cd(b, t, k), ops = [ans, cd(b, 0, k + 1), cd(b, 0, -k), cd(b, 1, 0), cd(b, 2, 0), cd(b, 0, k + 2)].filter(function (v, i, A) { return A.indexOf(v) === i; }).slice(0, 4), ord = shuffle(ops.length), done = false;
          $("#cgq", el).textContent = "If " + a + " = " + cd(a, t, k) + ", then " + b + " = ?"; $("#cgw", el).hidden = true;
          $("#cgo", el).innerHTML = ord.map(function (i) { return '<button class="opt" data-ok="' + (i === 0 ? 1 : 0) + '">' + ops[i] + "</button>"; }).join("");
          $$("#cgo .opt", el).forEach(function (bt) { bt.onclick = function () { if (done) return; done = true; n++; var ok = bt.getAttribute("data-ok") === "1"; if (ok) sc++; bt.classList.add(ok ? "right" : "wrong"); $$("#cgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#cgs", el).textContent = sc; $("#cgn", el).textContent = n; $("#cgw", el).hidden = false; $("#cgw", el).textContent = "Rule: " + (t === 0 ? "each letter " + (k > 0 ? "+" : "") + k : t === 1 ? "opposite letters" : "reversed") + "."; }; });
        }
        $("#cgg", el).onclick = round; round();
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
