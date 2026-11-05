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
  var KIN = { father: ["u", "M"], mother: ["u", "F"], son: ["d", "M"], daughter: ["d", "F"], brother: ["ud", "M"], sister: ["ud", "F"], husband: ["m", "M"], wife: ["m", "F"] };
  function kinName(chain) {
    if (!chain.length) return "";
    var s = chain.map(function (r) { return KIN[r][0]; }).join(""), g = KIN[chain[chain.length - 1]][1], prev;
    do { prev = s; s = s.replace(/udud/g, "ud").replace(/udu/g, "u").replace(/um/g, "u").replace(/mm/g, "").replace(/du/g, "x"); } while (s !== prev);
    if (s.indexOf("x") >= 0 || s === "") return "SELF";
    var m = s.match(/^(m?)(u*)(d*)(m?)$/); if (!m) return null;
    var pre = !!m[1], u = m[2].length, d = m[3].length, post = !!m[4], M = g === "M";
    function pick(a, b) { return M ? a : b; }
    function gp(n, a, b) { return (n > 2 ? "great-".repeat(n - 2) : "") + pick(a, b); }
    var base;
    if (u === 0 && d === 0) base = pick("husband", "wife");
    else if (d === 0) base = u === 1 ? pick("father", "mother") : gp(u, "grandfather", "grandmother");
    else if (u === 0) base = d === 1 ? pick("son", "daughter") : gp(d, "grandson", "granddaughter");
    else if (u === 1 && d === 1) base = pick("brother", "sister");
    else if (u === 2 && d === 1) base = pick("uncle", "aunt");
    else if (u === 1 && d === 2) base = pick("nephew", "niece");
    else if (u >= 2 && d >= 2) base = "cousin";
    else return null;
    if (u === 0 && d === 0) return base;
    if (pre && post) return u === 1 && d === 1 ? pick("brother-in-law", "sister-in-law") : null;
    if (pre) { if (d === 0 || (u === 1 && d === 1)) return base + "-in-law"; if (u === 0) return base; return base + " (by marriage)"; }
    if (post) { if ((u === 0 && d === 1) || (u === 1 && d === 1)) return base + "-in-law"; if (u === 2 && d === 1) return base + " (by marriage)"; return base + "'s spouse"; }
    return base;
  }
  function kinSvg(chain) {
    var lv = 0, xs = 20, pts = [[xs, 0, "You"]];
    chain.forEach(function (r) { var k = KIN[r][0]; for (var i = 0; i < k.length; i++) { if (k[i] === "u") lv--; else if (k[i] === "d") lv++; } xs += 62; pts.push([xs, lv, r]); });
    var mn = Math.min.apply(null, pts.map(function (p) { return p[1]; })), mx = Math.max.apply(null, pts.map(function (p) { return p[1]; })), H = (mx - mn) * 48 + 54, W = xs + 40;
    var y = function (l) { return 22 + (l - mn) * 48; }, h = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" class="kinsvg" role="img" aria-label="Generation path">';
    for (var l = mn; l <= mx; l++) h += '<line x1="0" x2="' + W + '" y1="' + y(l) + '" y2="' + y(l) + '" stroke="var(--border)" stroke-dasharray="3 4"/>';
    for (var i = 1; i < pts.length; i++) h += '<line x1="' + pts[i - 1][0] + '" y1="' + y(pts[i - 1][1]) + '" x2="' + pts[i][0] + '" y2="' + y(pts[i][1]) + '" stroke="var(--accent)" stroke-width="2.5"/>';
    pts.forEach(function (p, i) { var f = i && KIN[p[2]][1] === "F"; h += '<circle cx="' + p[0] + '" cy="' + y(p[1]) + '" r="9" fill="' + (i === 0 ? "var(--ink)" : f ? "#e0679b" : "#3d7ae0") + '"/><text x="' + p[0] + '" y="' + (y(p[1]) + 22) + '" text-anchor="middle" font-size="10" fill="var(--muted)">' + p[2] + "</text>"; });
    return h + "</svg>";
  }
  function pathSvg(P) {
    var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), span = Math.max(x1 - x0, y1 - y0, 1), s = 180 / span, W = (x1 - x0) * s + 60, H = (y1 - y0) * s + 60;
    var X = function (x) { return 30 + (x - x0) * s; }, Y = function (y) { return 30 + (y1 - y) * s; }, last = P[P.length - 1];
    var h = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" class="kinsvg" role="img" aria-label="Path">';
    h += '<text x="' + (W - 14) + '" y="16" font-size="11" font-weight="700" fill="var(--muted)">N↑</text>';
    if (P.length > 1) h += '<polyline points="' + P.map(function (p) { return X(p[0]) + "," + Y(p[1]); }).join(" ") + '" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/>';
    if (last[0] || last[1]) h += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(last[0]) + '" y2="' + Y(last[1]) + '" stroke="#e0679b" stroke-width="2" stroke-dasharray="5 4"/>';
    h += '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="6" fill="var(--ink)"/><circle cx="' + X(last[0]) + '" cy="' + Y(last[1]) + '" r="6" fill="#e0679b"/>';
    return h + "</svg>";
  }
  function compassSvg(a, b) {
    var L = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], h = '<svg viewBox="0 0 200 200" width="200" class="kinsvg" role="img" aria-label="Compass"><circle cx="100" cy="100" r="78" fill="none" stroke="var(--border)" stroke-width="2"/>';
    L.forEach(function (l, i) { var t = i * Math.PI / 4; h += '<text x="' + (100 + 92 * Math.sin(t)) + '" y="' + (104 - 92 * Math.cos(t)) + '" text-anchor="middle" font-size="' + (i % 2 ? 10 : 13) + '" font-weight="700" fill="var(--muted)">' + l + "</text>"; });
    function arr(d, c, w) { var t = d * Math.PI / 180; return '<line x1="100" y1="100" x2="' + (100 + 64 * Math.sin(t)) + '" y2="' + (100 - 64 * Math.cos(t)) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
    if (a !== undefined) h += arr(a, "var(--border)", 4);
    if (b !== undefined) h += arr(b, "var(--accent)", 5);
    return h + '<circle cx="100" cy="100" r="5" fill="var(--ink)"/></svg>';
  }
  function rowViz(n, a, b) {
    var h = '<div class="rowv">';
    for (var i = 1; i <= n; i++) h += '<span class="' + (i === a ? "a" : i === b ? "b" : b && i > Math.min(a, b) && i < Math.max(a, b) ? "m" : "") + '">' + (i === a ? "A" : i === b ? "B" : "") + "</span>";
    return h + "</div>";
  }
  function opEval(s) {
    var j = String(s).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/[\[{]/g, "(").replace(/[\]}]/g, ")").replace(/\s+/g, "");
    if (!j || !/^[\d.+\-*/()]+$/.test(j)) return null;
    try { var v = Function("return (" + j + ")")(); return typeof v === "number" && isFinite(v) ? v : null; } catch (e) { return null; }
  }
  /* Syllogism engine: terms are 0..2; a model is a set of non-empty Venn regions (bit masks 1..7). */
  function sylHolds(st, M) {
    var x = 1 << st[1], y = 1 << st[2], t = st[0];
    if (t === "all") return M.every(function (r) { return !(r & x) || (r & y); });
    if (t === "some") return M.some(function (r) { return (r & x) && (r & y); });
    if (t === "no") return M.every(function (r) { return !((r & x) && (r & y)); });
    return M.some(function (r) { return (r & x) && !(r & y); });
  }
  function sylModels(sts) {
    var out = [];
    for (var m = 1; m < 128; m++) {
      var M = []; for (var r = 1; r < 8; r++) if (m & (1 << (r - 1))) M.push(r);
      var ne = [1, 2, 4].every(function (b) { return M.some(function (r) { return r & b; }); });
      if (ne && sts.every(function (s) { return sylHolds(s, M); })) out.push(M);
    }
    return out;
  }
  function sylFollows(sts, c) { var ms = sylModels(sts); return ms.length > 0 && ms.every(function (M) { return sylHolds(c, M); }); }
  function sylVerdict(sts, c1, c2) {
    var f1 = sylFollows(sts, c1), f2 = sylFollows(sts, c2);
    if (f1 && f2) return "Both follow";
    if (f1) return "Only I follows";
    if (f2) return "Only II follows";
    var comp = c1[1] === c2[1] && c1[2] === c2[2] && ((c1[0] === "some" && c2[0] === "no") || (c1[0] === "no" && c2[0] === "some") || (c1[0] === "all" && c2[0] === "somenot") || (c1[0] === "somenot" && c2[0] === "all"));
    var comp2 = (c1[0] === "some" && c2[0] === "no" || c1[0] === "no" && c2[0] === "some") && c1[1] === c2[2] && c1[2] === c2[1];
    return comp || comp2 ? "Either I or II follows" : "Neither follows";
  }
  function sylText(st, N) { var a = N[st[1]], b = N[st[2]]; return st[0] === "all" ? "All " + a + " are " + b : st[0] === "some" ? "Some " + a + " are " + b : st[0] === "no" ? "No " + a + " are " + b : "Some " + a + " are not " + b; }
  function vennSvg(S, N) {
    var ms = sylModels(S), C = [[105, 90], [165, 90], [135, 142]], R = 54, uid = "v" + Math.floor(Math.random() * 1e6);
    var h = '<svg viewBox="0 0 270 220" width="270" class="kinsvg" role="img" aria-label="Venn diagram"><defs>';
    C.forEach(function (c, i) { h += '<clipPath id="' + uid + "c" + i + '"><circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + R + '"/></clipPath>'; });
    for (var r = 1; r < 8; r++) { h += '<mask id="' + uid + "m" + r + '"><rect width="270" height="220" fill="#fff"/>'; for (var i = 0; i < 3; i++) if (!(r & (1 << i))) h += '<circle cx="' + C[i][0] + '" cy="' + C[i][1] + '" r="' + R + '" fill="#000"/>'; h += "</mask>"; }
    h += "</defs>";
    for (r = 1; r < 8; r++) {
      var empty = ms.length && ms.every(function (M) { return M.indexOf(r) < 0; }), full = ms.length && ms.every(function (M) { return M.indexOf(r) >= 0; });
      var inner = '<rect width="270" height="220" fill="' + (empty ? "#c9ccd6" : "transparent") + '" mask="url(#' + uid + "m" + r + ')"/>';
      for (i = 2; i >= 0; i--) if (r & (1 << i)) inner = '<g clip-path="url(#' + uid + "c" + i + ')">' + inner + "</g>";
      h += inner;
      if (full) { var xs = 0, ys = 0, k = 0; for (i = 0; i < 3; i++) if (r & (1 << i)) { xs += C[i][0]; ys += C[i][1]; k++; } var cx = xs / k, cy = ys / k; if (k === 1) { cx += (C[r === 1 ? 0 : r === 2 ? 1 : 2][0] - 135) * 0.6; cy += (C[r === 1 ? 0 : r === 2 ? 1 : 2][1] - 107) * 0.6; } if (k === 2) { var o3 = C[[0, 1, 2].filter(function (j) { return !(r & (1 << j)); })[0]]; cx += (cx - o3[0]) * 0.5; cy += (cy - o3[1]) * 0.5; } h += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="var(--accent)"/>'; }
    }
    var col = ["#3d7ae0", "#e0679b", "#2aa876"];
    C.forEach(function (c, i) { h += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + R + '" fill="none" stroke="' + col[i] + '" stroke-width="2.5"/>'; });
    h += '<text x="60" y="28" font-size="12" font-weight="800" fill="' + col[0] + '">' + esc(N[0]) + '</text><text x="210" y="28" text-anchor="end" font-size="12" font-weight="800" fill="' + col[1] + '">' + esc(N[1]) + '</text><text x="135" y="214" text-anchor="middle" font-size="12" font-weight="800" fill="' + col[2] + '">' + esc(N[2]) + "</text>";
    return h + "</svg>";
  }
  var VTYPES = [
    ["Three separate circles", [[40, 60, 24], [100, 60, 24], [160, 60, 24]]],
    ["Nested: one inside another inside a third", [[100, 60, 52], [100, 66, 34], [100, 72, 16]]],
    ["Two separate circles inside a third", [[100, 60, 54], [76, 62, 20], [124, 62, 20]]],
    ["Two overlapping circles inside a third", [[100, 60, 54], [84, 62, 24], [116, 62, 24]]],
    ["Three mutually overlapping circles", [[80, 48, 30], [120, 48, 30], [100, 80, 30]]],
    ["Two separate circles, both overlapping a third", [[52, 60, 26], [148, 60, 26], [100, 60, 34]]],
    ["One inside another; third separate", [[66, 60, 40], [66, 66, 20], [156, 60, 26]]],
    ["One inside another; third overlaps both", [[80, 60, 46], [70, 62, 20], [132, 60, 30]]],
    ["Two overlapping circles; third separate", [[50, 60, 28], [92, 60, 28], [164, 60, 24]]]
  ];
  function vtypeSvg(i, labels) {
    var c = VTYPES[i][1], col = ["#3d7ae0", "#e0679b", "#2aa876"], h = '<svg viewBox="0 0 200 120" width="200" class="kinsvg" role="img" aria-label="' + VTYPES[i][0] + '">';
    c.forEach(function (k, j) { h += '<circle cx="' + k[0] + '" cy="' + k[1] + '" r="' + k[2] + '" fill="' + col[j] + '" fill-opacity=".10" stroke="' + col[j] + '" stroke-width="2.2"/>'; });
    if (labels) c.forEach(function (k, j) { h += '<text x="' + k[0] + '" y="' + (k[1] - k[2] + 13) + '" text-anchor="middle" font-size="10" font-weight="800" fill="' + col[j] + '">' + esc(labels[j]) + "</text>"; });
    return h + "</svg>";
  }
  function vgallery() { return '<div class="vgal">' + VTYPES.map(function (t, i) { return "<figure>" + vtypeSvg(i) + "<figcaption>" + (i + 1) + ". " + t[0] + "</figcaption></figure>"; }).join("") + "</div>"; }
  function venn2Svg(a, b, ab, n) {
    var h = '<svg viewBox="0 0 260 150" width="260" class="kinsvg" role="img" aria-label="Two-set Venn diagram"><rect x="4" y="4" width="252" height="142" rx="10" fill="none" stroke="var(--border)"/>';
    h += '<circle cx="100" cy="76" r="52" fill="#3d7ae0" fill-opacity=".12" stroke="#3d7ae0" stroke-width="2.2"/><circle cx="160" cy="76" r="52" fill="#e0679b" fill-opacity=".12" stroke="#e0679b" stroke-width="2.2"/>';
    h += '<text x="78" y="82" text-anchor="middle" font-size="15" font-weight="800">' + a + '</text><text x="130" y="82" text-anchor="middle" font-size="15" font-weight="800">' + ab + '</text><text x="182" y="82" text-anchor="middle" font-size="15" font-weight="800">' + b + "</text>";
    if (n !== null) h += '<text x="244" y="138" text-anchor="end" font-size="12" font-weight="700" fill="var(--muted)">neither ' + n + "</text>";
    return h + "</svg>";
  }
  function clockSvg(h, m, flip, cap) {
    var a = ((h % 12) + m / 60) * 30, b = m * 6, R = function (d, L) { var t = d * Math.PI / 180; return [70 + L * Math.sin(t), 70 - L * Math.cos(t)]; };
    var s = '<svg viewBox="0 0 140 160" width="140" class="kinsvg" role="img" aria-label="' + (cap || "Clock") + '"><g' + (flip ? ' transform="translate(140,0) scale(-1,1)"' : "") + '><circle cx="70" cy="70" r="62" fill="#fff" stroke="var(--ink)" stroke-width="3"/>';
    for (var i = 1; i <= 12; i++) { var p = R(i * 30, 50); s += '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">' + i + "</text>"; }
    var hp = R(a, 32), mp = R(b, 46);
    s += '<line x1="70" y1="70" x2="' + hp[0] + '" y2="' + hp[1] + '" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><line x1="70" y1="70" x2="' + mp[0] + '" y2="' + mp[1] + '" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="70" r="4" fill="var(--ink)"/></g>';
    if (cap) s += '<text x="70" y="152" text-anchor="middle" font-size="12" font-weight="800" fill="var(--muted)">' + cap + "</text>";
    return s + "</svg>";
  }
  function mirrorTime(h, m) { var t = (h % 12) * 60 + m, r = (720 - t) % 720, H = Math.floor(r / 60), M = r % 60; return [H || 12, M]; }
  function hm(h, m) { return h + ":" + (m < 10 ? "0" : "") + m; }
  function mirWord(w) {
    var e = esc(w);
    return '<div class="mirw"><div><span>' + e + "</span><small>Object</small></div><div><span style=\"display:inline-block;transform:scaleX(-1)\">" + e + "</span><small>Mirror image</small></div><div><span style=\"display:inline-block;transform:scaleY(-1)\">" + e + "</span><small>Water image</small></div></div>";
  }
  /* Paper folding on an N×N grid. A fold is "L" (left half over right), "R" (right over left), "T" (top down), "B" (bottom up). */
  function pfState(N, folds) {
    var r = { x0: 0, x1: N, y0: 0, y1: N }, lines = [];
    folds.forEach(function (f) {
      if (f === "L" || f === "R") { var w = r.x1 - r.x0; if (w < 2 || w % 2) return; var m = r.x0 + w / 2; lines.push(["x", m]); if (f === "L") r.x0 = m; else r.x1 = m; }
      else { var h = r.y1 - r.y0; if (h < 2 || h % 2) return; var n = r.y0 + h / 2; lines.push(["y", n]); if (f === "T") r.y0 = n; else r.y1 = n; }
    });
    return { r: r, lines: lines };
  }
  function pfUnfold(st, holes) {
    var S = holes.map(function (h) { return h[0] + "," + h[1]; });
    for (var i = st.lines.length - 1; i >= 0; i--) {
      var L = st.lines[i], add = [];
      S.forEach(function (k) { var p = k.split(",").map(Number); var q = L[0] === "x" ? [2 * L[1] - 1 - p[0], p[1]] : [p[0], 2 * L[1] - 1 - p[1]]; add.push(q[0] + "," + q[1]); });
      add.forEach(function (k) { if (S.indexOf(k) < 0) S.push(k); });
    }
    return S.map(function (k) { return k.split(",").map(Number); });
  }
  function pfGrid(N, cells, rect, cls, small) {
    var c = small ? 11 : 26, h = '<svg viewBox="0 0 ' + (N * c + 2) + " " + (N * c + 2) + '" width="' + (N * c + 2) + '" class="kinsvg ' + (cls || "") + '" role="img" aria-label="Paper grid">';
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var inR = !rect || (x >= rect.x0 && x < rect.x1 && y >= rect.y0 && y < rect.y1), hole = cells.some(function (p) { return p[0] === x && p[1] === y; });
      h += '<rect data-x="' + x + '" data-y="' + y + '" x="' + (1 + x * c) + '" y="' + (1 + y * c) + '" width="' + c + '" height="' + c + '" fill="' + (inR ? "#fffdf5" : "#eef0f5") + '" stroke="var(--border)" stroke-width=".8"/>';
      if (hole) h += '<circle cx="' + (1 + x * c + c / 2) + '" cy="' + (1 + y * c + c / 2) + '" r="' + c * 0.3 + '" fill="var(--ink)"/>';
    }
    if (rect) h += '<rect x="' + (1 + rect.x0 * c) + '" y="' + (1 + rect.y0 * c) + '" width="' + (rect.x1 - rect.x0) * c + '" height="' + (rect.y1 - rect.y0) * c + '" fill="none" stroke="var(--accent)" stroke-width="2.5"/>';
    return h + "</svg>";
  }
  function segSvg(S, n, px, opt) {
    opt = opt || {}; var c = px / n, pad = 6, W = px + 2 * pad, h = '<svg viewBox="0 0 ' + W + " " + W + '" width="' + W + '" class="kinsvg" role="img" aria-label="' + (opt.label || "Figure") + '">';
    if (opt.frame !== false) h += '<rect x="' + pad + '" y="' + pad + '" width="' + px + '" height="' + px + '" fill="#fff" stroke="var(--border)"/>';
    if (opt.box) h += '<rect x="' + (pad + opt.box[0] * c) + '" y="' + (pad + opt.box[1] * c) + '" width="' + (opt.box[2] - opt.box[0]) * c + '" height="' + (opt.box[3] - opt.box[1]) * c + '" fill="#f3f4fa" stroke="var(--accent)" stroke-dasharray="4 3" stroke-width="1.5"/><text x="' + (pad + (opt.box[0] + opt.box[2]) / 2 * c) + '" y="' + (pad + (opt.box[1] + opt.box[3]) / 2 * c + 6) + '" text-anchor="middle" font-size="18" font-weight="800" fill="var(--accent)">?</text>';
    S.forEach(function (s) { h += '<line x1="' + (pad + s[0] * c) + '" y1="' + (pad + s[1] * c) + '" x2="' + (pad + s[2] * c) + '" y2="' + (pad + s[3] * c) + '" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>'; });
    return h + "</svg>";
  }
  function figRow(items) { return '<div class="figrow">' + items.map(function (it) { return "<figure>" + it[0] + "<figcaption>" + it[1] + "</figcaption></figure>"; }).join("") + "</div>"; }
  function embViz(x) {
    var L = x.labels || ["P", "Q", "R", "S"];
    var nn = Math.max(2, Math.max.apply(null, x.x.map(function (s) { return Math.max(s[0], s[1], s[2], s[3]); })));
    return figRow([[segSvg(x.x, nn, 22 * nn, { frame: false }), "Find this shape"]]) + figRow(x.opts.map(function (o, i) { return [segSvg(o, 4, 88), L[i]]; }));
  }
  function compViz(x) {
    var L = x.labels || ["P", "Q", "R", "S"];
    return figRow([[segSvg(x.rest, 4, 120, { box: [2, 2, 4, 4] }), "Complete the figure"]]) + figRow(x.cands.map(function (o, i) { return [segSvg(o, 2, 60), L[i]]; }));
  }
  function cntSvg(S, hl, px) {
    var xs = [], ys = []; S.forEach(function (s) { xs.push(s[0], s[2]); ys.push(s[1], s[3]); });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), sp = Math.max(x1 - x0, y1 - y0, 1), k = (px || 150) / sp, pad = 8, W = (x1 - x0) * k + 2 * pad, H = (y1 - y0) * k + 2 * pad;
    var X = function (x) { return pad + (x - x0) * k; }, Y = function (y) { return pad + (y - y0) * k; }, h = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" class="kinsvg" role="img" aria-label="Figure">';
    if (hl) h += '<polygon points="' + hl.map(function (p) { return X(p[0]) + "," + Y(p[1]); }).join(" ") + '" fill="var(--sun)" fill-opacity=".9"/>';
    S.forEach(function (s) { h += '<line x1="' + X(s[0]) + '" y1="' + Y(s[1]) + '" x2="' + X(s[2]) + '" y2="' + Y(s[3]) + '" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>'; });
    return h + "</svg>";
  }
  function pzEval(c, P) {
    var px = P[c[1]], py = P[c[2]];
    switch (c[0]) {
      case "end": return px === 0 || px === 4;
      case "notend": return px !== 0 && px !== 4;
      case "imr": return px === py + 1;
      case "iml": return px === py - 1;
      case "two": return px === py - 2;
      case "one": return Math.abs(px - py) === 2;
      case "notnext": return Math.abs(px - py) !== 1;
      case "leftof": return px < py;
      case "even": return (px + 1) % 2 === 0;
    }
    return false;
  }
  function pzPerms() {
    var out = [];
    (function rec(arr, rest) { if (!rest.length) { var P = {}; arr.forEach(function (n, i) { P[n] = i; }); out.push(P); return; } rest.forEach(function (n, i) { rec(arr.concat([n]), rest.slice(0, i).concat(rest.slice(i + 1))); }); })([], ["A", "B", "C", "D", "E"]);
    return out;
  }
  function viz(x) {
    if (!x) return "";
    if (x.type === "share") return shareBar(x.r, x.total);
    if (x.type === "cfig") return '<div style="display:flex;justify-content:center">' + cntSvg(x.s) + "</div>";
    if (x.type === "emb") return embViz(x);
    if (x.type === "comp") return compViz(x);
    if (x.type === "pf") { var ps = pfState(8, x.f); return '<div class="row" style="gap:14px;justify-content:center;align-items:flex-start"><div>' + pfGrid(8, x.h, ps.r) + "<small>Folded</small></div><div>" + pfGrid(8, pfUnfold(ps, x.h), null) + "<small>Opened</small></div></div>"; }
    if (x.type === "mirw") return mirWord(x.w);
    if (x.type === "mclock") { var mt = mirrorTime(x.h, x.m); return '<div class="row" style="justify-content:center;gap:12px">' + clockSvg(x.h, x.m, false, "Actual " + hm(x.h, x.m)) + clockSvg(x.h, x.m, true, "Mirror " + hm(mt[0], mt[1])) + "</div>"; }
    if (x.type === "vgal") return vgallery();
    if (x.type === "venn2") return venn2Svg(x.a, x.b, x.ab, null);
    if (x.type === "venn") return vennSvg(x.s, x.n);
    if (x.type === "row") return rowViz(x.n, x.p);
    if (x.type === "compass") return compassSvg();
    if (x.type === "kin") return kinSvg(x.c);
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
    ,
    relchain: {
      title: "Relation chain builder", html: '<p class="note">Build “my ___’s ___’s ___”. Tap relations in order.</p><div class="row" id="rcb" style="flex-wrap:wrap;gap:6px"></div><div class="row" style="gap:6px;margin-top:8px"><button class="btn btn-sm" id="rcu">Undo</button><button class="btn btn-sm" id="rcc">Clear</button></div><div id="rcz" class="tscroll"></div><div class="out" id="rco"></div>',
      init: function (el) {
        var ch = ["father", "sister", "son"];
        $("#rcb", el).innerHTML = Object.keys(KIN).map(function (k) { return '<button class="chip" data-r="' + k + '">' + k + "</button>"; }).join("");
        function up() {
          var o = $("#rco", el);
          $("#rcz", el).innerHTML = ch.length ? kinSvg(ch) : "";
          if (!ch.length) { o.textContent = "Tap a relation to start"; return; }
          var n = kinName(ch), note = ""; if (n === "SELF") n = "self or spouse (check the chain)";
          if (ch.some(function (r, i) { return i && (r === "son" || r === "daughter") && (ch[i - 1] === "father" || ch[i - 1] === "mother"); })) note = " If it says “only son/daughter”, that person may be you or your parent.";
          o.innerHTML = "My " + ch.join("’s ") + " = my " + (n || "distant relative — draw the tree") + "<small>Steps up and down the generations decide the name." + note + "</small>";
        }
        $$("#rcb .chip", el).forEach(function (b) { b.onclick = function () { if (ch.length < 6) ch.push(b.getAttribute("data-r")); up(); }; });
        $("#rcu", el).onclick = function () { ch.pop(); up(); };
        $("#rcc", el).onclick = function () { ch = []; up(); };
        up();
      }
    },
    reltwo: {
      title: "Two-statement solver", html: '<div class="field"><label>Statement 1</label><div class="row" style="gap:6px;flex-wrap:nowrap"><span style="white-space:nowrap">P is the</span><select id="rt1"></select><span style="white-space:nowrap">of Q.</span></div></div><div class="field"><label>Statement 2</label><div class="row" style="gap:6px;flex-wrap:nowrap"><span style="white-space:nowrap">Q is the</span><select id="rt2"></select><span style="white-space:nowrap">of R.</span></div></div><div class="out" id="rto"></div>',
      init: function (el) {
        var opts = Object.keys(KIN).map(function (k) { return "<option>" + k + "</option>"; }).join("");
        $("#rt1", el).innerHTML = opts; $("#rt2", el).innerHTML = opts; $("#rt1", el).value = "son"; $("#rt2", el).value = "wife";
        function up() {
          var a = $("#rt1", el).value, b = $("#rt2", el).value, n = kinName([b, a]); if (n === "SELF") n = "self or spouse — check the statements";
          $("#rto", el).innerHTML = "P is R’s " + (n || "relative — draw the tree") + "<small>From R: R’s " + b + " is Q, and Q’s " + a + " is P. So read it as “R’s " + b + "’s " + a + "”.</small>";
        }
        $("#rt1", el).onchange = up; $("#rt2", el).onchange = up; up();
      }
    },
    relgame: {
      title: "Relation sprint", html: '<div class="big" id="rgq" style="text-align:center;font-size:19px;font-weight:800">…</div><div class="opts" id="rgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="rgs">0</b> / <b id="rgn">0</b></span><button class="btn btn-accent btn-sm" id="rgg">Next</button></div><div class="why" id="rgw" hidden></div>',
      init: function (el) {
        var sc = 0, n = 0, R = ["father", "mother", "brother", "sister", "son", "daughter", "husband", "wife"], POOL = ["uncle", "aunt", "nephew", "niece", "cousin", "grandfather", "grandmother", "grandson", "granddaughter", "father-in-law", "mother-in-law", "brother-in-law", "sister-in-law", "son-in-law", "daughter-in-law", "brother", "sister", "father", "mother"];
        function round() {
          var c, ans, t = 0;
          do { var L = 2 + Math.floor(Math.random() * 2); c = []; for (var i = 0; i < L; i++) c.push(R[Math.floor(Math.random() * R.length)]); ans = kinName(c); t++; } while ((!ans || ans === "SELF" || /\(|spouse|great/.test(ans) || /(father|mother|husband|wife),(husband|wife)/.test(c.join(","))) && t < 200);
          var ops = [ans].concat(shuffle(POOL.length).map(function (i) { return POOL[i]; }).filter(function (x) { return x !== ans; }).slice(0, 3)), ord = shuffle(4), done = false;
          $("#rgq", el).textContent = "My " + c.join("’s ") + " is my …"; $("#rgw", el).hidden = true;
          $("#rgo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + ops[k] + "</button>"; }).join("");
          $$("#rgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#rgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#rgs", el).textContent = sc; $("#rgn", el).textContent = n; $("#rgw", el).hidden = false; $("#rgw", el).innerHTML = kinSvg(c); }; });
        }
        $("#rgg", el).onclick = round; round();
      }
    }
    ,
    dirwalk: {
      title: "Path tracer", html: '<p class="note">Start facing a direction, then add moves.</p><div class="field"><label for="dws">Start facing</label><select id="dws"><option>North</option><option>East</option><option>South</option><option>West</option></select></div><div class="row" style="gap:6px;flex-wrap:wrap"><button class="chip" data-m="F">Walk</button><button class="chip" data-m="R">Turn right</button><button class="chip" data-m="L">Turn left</button><input type="number" id="dwk" value="5" min="1" max="50" style="width:70px" aria-label="Distance"><button class="btn btn-sm" id="dwu">Undo</button><button class="btn btn-sm" id="dwc">Clear</button></div><div id="dwz"></div><div class="out" id="dwo"></div>',
      init: function (el) {
        var mv = [["F", 5], ["R", 0], ["F", 3], ["R", 0], ["F", 5]], N = ["North", "East", "South", "West"];
        function up() {
          var h = N.indexOf($("#dws", el).value), x = 0, y = 0, P = [[0, 0]], txt = [];
          mv.forEach(function (m) { if (m[0] === "R") { h = (h + 1) % 4; txt.push("right"); } else if (m[0] === "L") { h = (h + 3) % 4; txt.push("left"); } else { x += [0, 1, 0, -1][h] * m[1]; y += [1, 0, -1, 0][h] * m[1]; P.push([x, y]); txt.push(m[1] + " " + N[h][0]); } });
          $("#dwz", el).innerHTML = pathSvg(P);
          var d = Math.sqrt(x * x + y * y), dir = (y > 0 ? "north" : y < 0 ? "south" : "") + (x && y ? "-" : "") + (x > 0 ? "east" : x < 0 ? "west" : "");
          $("#dwo", el).innerHTML = (d ? fmtN(Math.round(d * 100) / 100) + " from start, " + dir : "Back at the start") + "<small>Net: " + Math.abs(x) + (x >= 0 ? " east" : " west") + ", " + Math.abs(y) + (y >= 0 ? " north" : " south") + ". Now facing " + N[h] + ". Moves: " + (txt.join(" · ") || "none") + ".</small>";
        }
        $$(".chip", el).forEach(function (b) { b.onclick = function () { if (mv.length < 16) mv.push([b.getAttribute("data-m"), Math.max(1, Math.min(50, +$("#dwk", el).value || 1))]); up(); }; });
        $("#dwu", el).onclick = function () { mv.pop(); up(); };
        $("#dwc", el).onclick = function () { mv = []; up(); };
        $("#dws", el).onchange = up; up();
      }
    },
    dirturn: {
      title: "Turn by angle", html: '<div class="field"><label for="dts">Start facing</label><select id="dts"><option value="0">North</option><option value="45">North-east</option><option value="90">East</option><option value="135">South-east</option><option value="180" selected>South</option><option value="225">South-west</option><option value="270">West</option><option value="315">North-west</option></select></div><div class="field"><label for="dta">Turn <b id="dtav">135</b>°</label><input type="range" id="dta" min="0" max="360" step="45" value="135"></div><div class="field"><label for="dtd">Direction</label><select id="dtd"><option value="1">Clockwise (right)</option><option value="-1">Anticlockwise (left)</option></select></div><div id="dtz"></div><div class="out" id="dto"></div>',
      init: function (el) {
        var NM = ["North", "North-east", "East", "South-east", "South", "South-west", "West", "North-west"];
        function up() {
          var s = +$("#dts", el).value, a = +$("#dta", el).value, d = +$("#dtd", el).value, e = ((s + d * a) % 360 + 360) % 360;
          $("#dtav", el).textContent = a; $("#dtz", el).innerHTML = compassSvg(s, e);
          $("#dto", el).innerHTML = "Now facing " + NM[e / 45] + "<small>" + s + "° " + (d > 0 ? "+" : "−") + " " + a + "° = " + e + "° (measured clockwise from north).</small>";
        }
        $$("select,input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    dirshadow: {
      title: "Shadow direction", html: '<div class="grid2"><div class="field"><label for="dsh">Time</label><select id="dsh"><option value="m">Morning</option><option value="e">Evening</option></select></div><div class="field"><label for="dsf">Shadow falls to my</label><select id="dsf"><option value="r">right</option><option value="l">left</option><option value="b">back</option><option value="f">front</option></select></div></div><div class="out" id="dso"></div>',
      init: function (el) {
        var N = ["North", "East", "South", "West"];
        function up() {
          var sh = $("#dsh", el).value === "m" ? 3 : 1, off = { f: 0, r: 1, b: 2, l: 3 }[$("#dsf", el).value], face = ((sh - off) % 4 + 4) % 4;
          $("#dso", el).innerHTML = "You are facing " + N[face] + "<small>The sun is in the " + ($("#dsh", el).value === "m" ? "east" : "west") + ", so the shadow points " + N[sh] + ". Shadow " + { f: "in front", r: "to your right", b: "behind you", l: "to your left" }[$("#dsf", el).value] + " → you face " + N[face] + ".</small>";
        }
        $$("select", el).forEach(function (x) { x.onchange = up; }); up();
      }
    },
    dirgame: {
      title: "Where do I face?", html: '<div class="big" id="dgq" style="text-align:center;font-size:18px;font-weight:800">…</div><div class="opts" id="dgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="dgs">0</b> / <b id="dgn">0</b></span><button class="btn btn-accent btn-sm" id="dgg">Next</button></div><div class="why" id="dgw" hidden></div>',
      init: function (el) {
        var N = ["North", "East", "South", "West"], sc = 0, n = 0;
        function round() {
          var s = Math.floor(Math.random() * 4), k = 2 + Math.floor(Math.random() * 3), t = [], h = s, done = false;
          for (var i = 0; i < k; i++) { var r = Math.random() < 0.5; t.push(r ? "right" : "left"); h = (h + (r ? 1 : 3)) % 4; }
          var ord = shuffle(4);
          $("#dgq", el).textContent = "Facing " + N[s] + ", turn " + t.join(", ") + ". Now facing?"; $("#dgw", el).hidden = true;
          $("#dgo", el).innerHTML = ord.map(function (j) { return '<button class="opt" data-ok="' + (j === h ? 1 : 0) + '">' + N[j] + "</button>"; }).join("");
          $$("#dgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#dgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#dgs", el).textContent = sc; $("#dgn", el).textContent = n; $("#dgw", el).hidden = false; var hh = s; $("#dgw", el).textContent = N[s] + t.map(function (x) { hh = (hh + (x === "right" ? 1 : 3)) % 4; return " → " + N[hh]; }).join(""); }; });
        }
        $("#dgg", el).onclick = round; round();
      }
    }
    ,
    rankcalc: {
      title: "Left + right − 1", html: '<p class="note">Fill any two boxes; leave the one you want empty.</p><div class="grid3"><div class="field"><label for="rkl">From left / top</label><input type="number" id="rkl" value="7" min="1"></div><div class="field"><label for="rkr">From right / bottom</label><input type="number" id="rkr" value="18" min="1"></div><div class="field"><label for="rkn">Total</label><input type="number" id="rkn" value="" min="1"></div></div><div id="rkz" class="tscroll"></div><div class="out" id="rko"></div>',
      init: function (el) {
        function v(id) { var x = $(id, el).value; return x === "" ? null : Math.round(+x); }
        function up() {
          var L = v("#rkl"), R = v("#rkr"), N = v("#rkn"), o = $("#rko", el), msg;
          var known = [L, R, N].filter(function (x) { return x !== null; }).length;
          if (known < 2) { o.textContent = "Fill two of the three boxes"; $("#rkz", el).innerHTML = ""; return; }
          if (N === null) { N = L + R - 1; msg = "Total = " + L + " + " + R + " − 1 = " + N; }
          else if (R === null) { R = N - L + 1; msg = "From right = " + N + " − " + L + " + 1 = " + R; }
          else if (L === null) { L = N - R + 1; msg = "From left = " + N + " − " + R + " + 1 = " + L; }
          else msg = L + R - 1 === N ? "Consistent: " + L + " + " + R + " − 1 = " + N : "Not consistent: " + L + " + " + R + " − 1 = " + (L + R - 1) + ", not " + N;
          if (L < 1 || R < 1 || N < 1 || L > N) { o.innerHTML = "Not possible<small>Positions must be between 1 and the total.</small>"; $("#rkz", el).innerHTML = ""; return; }
          $("#rkz", el).innerHTML = N <= 40 ? rowViz(N, L) : "";
          o.innerHTML = msg + "<small>The person is counted from both ends, so 1 is subtracted.</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    rankbetween: {
      title: "People between two persons", html: '<div class="field"><label for="rbn">Total in row</label><input type="number" id="rbn" value="30" min="2" max="200"></div><div class="grid2"><div class="field"><label for="rba">A’s position</label><div class="row" style="flex-wrap:nowrap;gap:6px"><input type="number" id="rba" value="10" min="1"><select id="rbae"><option value="L">from left</option><option value="R">from right</option></select></div></div><div class="field"><label for="rbb">B’s position</label><div class="row" style="flex-wrap:nowrap;gap:6px"><input type="number" id="rbb" value="15" min="1"><select id="rbbe"><option value="L">from left</option><option value="R" selected>from right</option></select></div></div></div><div id="rbz" class="tscroll"></div><div class="out" id="rbo"></div>',
      init: function (el) {
        function up() {
          var N = Math.round(+$("#rbn", el).value), a = Math.round(+$("#rba", el).value), b = Math.round(+$("#rbb", el).value), o = $("#rbo", el);
          if (!(N > 1) || a < 1 || b < 1 || a > N || b > N) { o.textContent = "Positions must be between 1 and the total"; $("#rbz", el).innerHTML = ""; return; }
          var A = $("#rbae", el).value === "L" ? a : N - a + 1, B = $("#rbbe", el).value === "L" ? b : N - b + 1, btw = Math.abs(A - B) - 1;
          $("#rbz", el).innerHTML = N <= 40 ? rowViz(N, A, B) : "";
          o.innerHTML = (A === B ? "A and B are the same position" : btw + " between them") + "<small>From the left: A is " + A + ", B is " + B + ". Between = |" + A + " − " + B + "| − 1.</small>";
        }
        $$("input,select", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    rankorder: {
      title: "Comparison chain", html: '<p class="note">Write comparisons like <b>A&gt;B</b> or <b>C&lt;B</b>, separated by commas.</p><div class="field"><label for="rot">Comparisons</label><input type="text" id="rot" value="A>B, C<B, D>A, E<C"></div><div class="out" id="roo"></div>',
      init: function (el) {
        function up() {
          var pairs = [], nodes = {}, o = $("#roo", el);
          $("#rot", el).value.split(/[,;]+/).forEach(function (t) { var m = t.trim().toUpperCase().match(/^([A-Z])\s*([<>])\s*([A-Z])$/); if (m) { var g = m[2] === ">" ? [m[1], m[3]] : [m[3], m[1]]; pairs.push(g); nodes[g[0]] = 1; nodes[g[1]] = 1; } });
          var V = Object.keys(nodes);
          if (!pairs.length) { o.textContent = "Type comparisons like A>B"; return; }
          var indeg = {}; V.forEach(function (x) { indeg[x] = 0; }); pairs.forEach(function (p) { indeg[p[1]]++; });
          var order = [], amb = false, q = V.filter(function (x) { return !indeg[x]; });
          while (q.length) { if (q.length > 1) amb = true; var x = q.shift(); order.push(x); pairs.forEach(function (p) { if (p[0] === x && --indeg[p[1]] === 0) q.push(p[1]); }); }
          if (order.length < V.length) { o.innerHTML = "These comparisons contradict each other<small>Check for a loop such as A>B, B>C, C>A.</small>"; return; }
          o.innerHTML = order.join(" > ") + "<small>" + (amb ? "Some places are not fixed by the given facts; this is one possible order. " : "The order is fully fixed. ") + "Highest: " + order[0] + " · lowest: " + order[order.length - 1] + (order.length % 2 && !amb ? " · middle: " + order[(order.length - 1) / 2] : "") + ".</small>";
        }
        $("#rot", el).oninput = up; up();
      }
    },
    rankgame: {
      title: "Ranking sprint", html: '<div class="big" id="kgq" style="text-align:center;font-size:18px;font-weight:800">…</div><div class="opts" id="kgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="kgs">0</b> / <b id="kgn">0</b></span><button class="btn btn-accent btn-sm" id="kgg">Next</button></div><div class="why" id="kgw" hidden></div>',
      init: function (el) {
        var sc = 0, n = 0;
        function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
        function th(k) { var m = k % 100; return k + (m > 10 && m < 14 ? "th" : ["th", "st", "nd", "rd"][k % 10] || "th"); }
        function round() {
          var t = rnd(0, 2), q, ans, why;
          if (t === 0) { var L = rnd(3, 25), R = rnd(3, 25); q = "Rank " + th(L) + " from the top and " + th(R) + " from the bottom. Total?"; ans = L + R - 1; why = L + " + " + R + " − 1"; }
          else if (t === 1) { var N = rnd(20, 60), p = rnd(2, N - 1); q = "Row of " + N + ", " + th(p) + " from the left. Position from the right?"; ans = N - p + 1; why = N + " − " + p + " + 1"; }
          else { var k = rnd(4, 20); q = th(k) + " from both ends. How many in the row?"; ans = 2 * k - 1; why = "2 × " + k + " − 1"; }
          var ops = [ans, ans + 1, ans - 1, ans + 2], ord = shuffle(4), done = false;
          $("#kgq", el).textContent = q; $("#kgw", el).hidden = true;
          $("#kgo", el).innerHTML = ord.map(function (i) { return '<button class="opt" data-ok="' + (i === 0 ? 1 : 0) + '">' + ops[i] + "</button>"; }).join("");
          $$("#kgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#kgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#kgs", el).textContent = sc; $("#kgn", el).textContent = n; $("#kgw", el).hidden = false; $("#kgw", el).textContent = why + " = " + ans + "."; }; });
        }
        $("#kgg", el).onclick = round; round();
      }
    }
    ,
    opmean: {
      title: "Changed-meaning rewriter", html: '<div class="grid2" id="omm"></div><div class="field"><label for="ome">Expression as given</label><input type="text" id="ome" value="8 + 4 × 6 − 2 ÷ 5"></div><div class="out" id="omo"></div>',
      init: function (el) {
        var S = ["+", "−", "×", "÷"], def = { "+": "×", "−": "÷", "×": "−", "÷": "+" };
        $("#omm", el).innerHTML = S.map(function (s, i) { return '<div class="field"><label for="om' + i + '">“' + s + '” means</label><select id="om' + i + '">' + S.map(function (t) { return "<option" + (def[s] === t ? " selected" : "") + ">" + t + "</option>"; }).join("") + "</select></div>"; }).join("");
        function up() {
          var map = {}; S.forEach(function (s, i) { map[s] = $("#om" + i, el).value; });
          var e = $("#ome", el).value.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−"), o = $("#omo", el);
          var r = e.replace(/[+−×÷]/g, function (c) { return map[c]; }), v = opEval(r);
          o.innerHTML = v === null ? "Check the expression<small>Use numbers, + − × ÷ and brackets.</small>" : r + " = " + fmtN(v) + "<small>Rewritten with the real signs, then solved with BODMAS.</small>";
        }
        $$("select,input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    swapfind: {
      title: "Which signs to interchange?", html: '<div class="grid2"><div class="field"><label for="sfe">Left side</label><input type="text" id="sfe" value="12 ÷ 4 + 3 × 2"></div><div class="field"><label for="sfr">Should equal</label><input type="number" id="sfr" value="11"></div></div><div class="tscroll"><table class="pt" id="sft"></table></div><div class="out" id="sfo"></div>',
      init: function (el) {
        var S = ["+", "−", "×", "÷"];
        function up() {
          var e = $("#sfe", el).value.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−"), R = +$("#sfr", el).value, rows = [], hits = [], now = opEval(e);
          for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) {
            var a = S[i], b = S[j]; if (e.indexOf(a) < 0 && e.indexOf(b) < 0) continue;
            var t = e.replace(/[+−×÷]/g, function (c) { return c === a ? b : c === b ? a : c; }), v = opEval(t), ok = v !== null && Math.abs(v - R) < 1e-9;
            if (ok) hits.push(a + " and " + b);
            rows.push("<tr><td>" + a + " ↔ " + b + "</td><td>" + t + "</td><td>" + (v === null ? "—" : fmtN(Math.round(v * 1000) / 1000)) + (ok ? " ✓" : "") + "</td></tr>");
          }
          $("#sft", el).innerHTML = "<tr><th>Swap</th><th>New expression</th><th>Value</th></tr>" + rows.join("");
          $("#sfo", el).innerHTML = now === null ? "Check the expression" : (hits.length ? "Interchange " + hits.join(" or ") : "No single swap works") + "<small>As written it equals " + fmtN(Math.round(now * 1000) / 1000) + ".</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    rulefind: {
      title: "Hidden rule finder", html: '<p class="note">Enter two solved examples of a * b.</p><div class="grid3"><div class="field"><label for="rf1">a</label><input type="number" id="rf1" value="2"></div><div class="field"><label for="rf2">b</label><input type="number" id="rf2" value="3"></div><div class="field"><label for="rf3">result</label><input type="number" id="rf3" value="13"></div><div class="field"><label for="rf4">a</label><input type="number" id="rf4" value="4"></div><div class="field"><label for="rf5">b</label><input type="number" id="rf5" value="5"></div><div class="field"><label for="rf6">result</label><input type="number" id="rf6" value="41"></div><div class="field"><label for="rf7">New a</label><input type="number" id="rf7" value="3"></div><div class="field"><label for="rf8">New b</label><input type="number" id="rf8" value="4"></div></div><div class="out" id="rfo"></div>',
      init: function (el) {
        var R = [["a² + b²", function (a, b) { return a * a + b * b; }], ["a² − b²", function (a, b) { return a * a - b * b; }], ["(a + b)²", function (a, b) { return (a + b) * (a + b); }], ["(a − b)²", function (a, b) { return (a - b) * (a - b); }], ["a × b + a", function (a, b) { return a * b + a; }], ["a × b + b", function (a, b) { return a * b + b; }], ["a × b − a", function (a, b) { return a * b - a; }], ["a × b + a + b", function (a, b) { return a * b + a + b; }], ["2a + b", function (a, b) { return 2 * a + b; }], ["a + 2b", function (a, b) { return a + 2 * b; }], ["a² ÷ b", function (a, b) { return a * a / b; }], ["a² + b", function (a, b) { return a * a + b; }], ["a + b²", function (a, b) { return a + b * b; }], ["a³ + b³", function (a, b) { return a * a * a + b * b * b; }], ["(a + b) × (a − b) + ab", function (a, b) { return a * a - b * b + a * b; }], ["a × b × 2", function (a, b) { return 2 * a * b; }]];
        function up() {
          var v = [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return +$("#rf" + i, el).value; }), ok = R.filter(function (r) { return Math.abs(r[1](v[0], v[1]) - v[2]) < 1e-9 && Math.abs(r[1](v[3], v[4]) - v[5]) < 1e-9; });
          $("#rfo", el).innerHTML = ok.length ? v[6] + " * " + v[7] + " = " + fmtN(ok[0][1](v[6], v[7])) + "<small>Rule: " + ok.map(function (r) { return r[0]; }).join(" or ") + " (fits both examples).</small>" : "No common rule fits<small>Try digits placed side by side (e.g. 5 * 3 = 82 from 8 and 2), or a rule using a − b.</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    }
    ,
    sylsolve: {
      title: "Two-statement solver", html: '<div class="grid3"><div class="field"><label for="ysn0">Term A</label><input type="text" id="ysn0" value="Roses"></div><div class="field"><label for="ysn1">Term B (middle)</label><input type="text" id="ysn1" value="Flowers"></div><div class="field"><label for="ysn2">Term C</label><input type="text" id="ysn2" value="Trees"></div></div><div class="field"><label for="yst1">Statement 1 (A and B)</label><select id="yst1"><option value="all">All A are B</option><option value="some">Some A are B</option><option value="no">No A is B</option><option value="somenot">Some A are not B</option></select></div><div class="field"><label for="yst2">Statement 2 (B and C)</label><select id="yst2"><option value="all">All B are C</option><option value="some">Some B are C</option><option value="no" selected>No B is C</option><option value="somenot">Some B are not C</option></select></div><div id="ysz"></div><div class="out" id="yso"></div>',
      init: function (el) {
        function up() {
          var N = [0, 1, 2].map(function (i) { return $("#ysn" + i, el).value.trim() || "ABC"[i]; }), S = [[$("#yst1", el).value, 0, 1], [$("#yst2", el).value, 1, 2]], found = [];
          [[0, 2], [2, 0]].forEach(function (p) { ["all", "no", "some", "somenot"].forEach(function (t) { var c = [t, p[0], p[1]]; if (sylFollows(S, c)) found.push(c); }); });
          found = found.filter(function (c) { return !(c[0] === "some" && found.some(function (d) { return d[0] === "all" && d[1] === c[1] && d[2] === c[2]; })) && !(c[0] === "somenot" && found.some(function (d) { return d[0] === "no" && d[1] === c[1] && d[2] === c[2]; })); });
          $("#ysz", el).innerHTML = vennSvg(S, N);
          $("#yso", el).innerHTML = (found.length ? found.map(function (c) { return sylText(c, N); }).join(" · ") : "No definite conclusion between " + N[0] + " and " + N[2]) + "<small>Grey = must be empty; ● = must have members. Conclusions are tested against every diagram that fits both statements.</small>";
        }
        $$("input,select", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    sylcheck: {
      title: "Conclusion checker", html: '<p class="note">Terms are A, B and C. Pick two statements and two conclusions.</p><div id="ycq"></div><div class="out" id="yco"></div>',
      init: function (el) {
        var T = [["all", "All X are Y"], ["some", "Some X are Y"], ["no", "No X is Y"], ["somenot", "Some X are not Y"]], P = [[0, 1], [1, 0], [1, 2], [2, 1], [0, 2], [2, 0]], L = "ABC";
        var opts = []; P.forEach(function (p) { T.forEach(function (t) { opts.push([t[0], p[0], p[1]]); }); });
        function sel(id, v) { return '<select id="' + id + '">' + opts.map(function (o, i) { return '<option value="' + i + '"' + (i === v ? " selected" : "") + ">" + sylText(o, L) + "</option>"; }).join("") + "</select>"; }
        $("#ycq", el).innerHTML = '<div class="grid2"><div class="field"><label>Statement 1</label>' + sel("yc0", 1) + '</div><div class="field"><label>Statement 2</label>' + sel("yc1", 9) + '</div><div class="field"><label>Conclusion I</label>' + sel("yc2", 17) + '</div><div class="field"><label>Conclusion II</label>' + sel("yc3", 18) + "</div></div>";
        function up() {
          var v = [0, 1, 2, 3].map(function (i) { return opts[+$("#yc" + i, el).value]; }), ms = sylModels([v[0], v[1]]);
          if (!ms.length) { $("#yco", el).innerHTML = "The two statements contradict each other<small>No diagram fits both.</small>"; return; }
          var f = [v[2], v[3]].map(function (c) { return sylFollows([v[0], v[1]], c); });
          $("#yco", el).innerHTML = sylVerdict([v[0], v[1]], v[2], v[3]) + "<small>I " + (f[0] ? "is true in every diagram" : "can be false") + "; II " + (f[1] ? "is true in every diagram" : "can be false") + ".</small>";
        }
        $$("select", el).forEach(function (x) { x.onchange = up; }); up();
      }
    },
    sylgame: {
      title: "Follows or not?", html: '<div id="ygq" style="font-weight:700;line-height:1.5">…</div><div class="opts" id="ygo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="ygs">0</b> / <b id="ygn">0</b></span><button class="btn btn-accent btn-sm" id="ygg">Next</button></div><div class="why" id="ygw" hidden></div>',
      init: function (el) {
        var sets = [["cats", "pets", "toys"], ["pens", "books", "bags"], ["doctors", "singers", "dancers"], ["stones", "gems", "metals"], ["trees", "plants", "flowers"], ["boys", "players", "students"]], TT = ["all", "some", "no"], sc = 0, n = 0;
        function rnd(k) { return Math.floor(Math.random() * k); }
        function round() {
          var N = sets[rnd(sets.length)], S = [[TT[rnd(3)], 0, 1], [TT[rnd(3)], 1, 2]], c, t = 0;
          do { c = [["all", "some", "no", "somenot"][rnd(4)]].concat(rnd(2) ? [0, 2] : [2, 0]); t++; } while (t < 20 && Math.random() < 0.4 && !sylFollows(S, c));
          var ok = sylFollows(S, c), done = false;
          $("#ygq", el).innerHTML = "1. " + sylText(S[0], N) + ".<br>2. " + sylText(S[1], N) + ".<br><br>Conclusion: " + sylText(c, N) + ".";
          $("#ygw", el).hidden = true;
          $("#ygo", el).innerHTML = '<button class="opt" data-ok="' + (ok ? 1 : 0) + '">Follows</button><button class="opt" data-ok="' + (ok ? 0 : 1) + '">Does not follow</button>';
          $$("#ygo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var r = b.getAttribute("data-ok") === "1"; if (r) sc++; b.classList.add(r ? "right" : "wrong"); $$("#ygo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#ygs", el).textContent = sc; $("#ygn", el).textContent = n; $("#ygw", el).hidden = false; $("#ygw", el).innerHTML = vennSvg(S, N); }; });
        }
        $("#ygg", el).onclick = round; round();
      }
    }
    ,
    venn2calc: {
      title: "Two-set calculator", html: '<div class="grid2"><div class="field"><label for="v2a">In A (e.g. tea)</label><input type="number" id="v2a" value="30" min="0"></div><div class="field"><label for="v2b">In B (e.g. coffee)</label><input type="number" id="v2b" value="25" min="0"></div><div class="field"><label for="v2c">In both</label><input type="number" id="v2c" value="10" min="0"></div><div class="field"><label for="v2n">Total people (optional)</label><input type="number" id="v2n" value="50" min="0"></div></div><div id="v2z"></div><div class="out" id="v2o"></div>',
      init: function (el) {
        function up() {
          var a = +$("#v2a", el).value || 0, b = +$("#v2b", el).value || 0, c = +$("#v2c", el).value || 0, ns = $("#v2n", el).value, N = ns === "" ? null : +ns, o = $("#v2o", el);
          if (c > a || c > b) { o.innerHTML = "‘Both’ cannot be more than A or B"; $("#v2z", el).innerHTML = ""; return; }
          var u = a + b - c, ne = N === null ? null : N - u;
          if (ne !== null && ne < 0) { o.innerHTML = "The total is too small<small>At least " + u + " people are in A or B.</small>"; $("#v2z", el).innerHTML = ""; return; }
          $("#v2z", el).innerHTML = venn2Svg(a - c, b - c, c, ne);
          o.innerHTML = "At least one: " + u + (ne !== null ? " · neither: " + ne : "") + "<small>" + a + " + " + b + " − " + c + " = " + u + ". Only A: " + (a - c) + ", only B: " + (b - c) + ".</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    venn3calc: {
      title: "Three-set calculator", html: '<p class="note">Enter group totals and overlaps (people in each pair include those in all three).</p><div class="grid3"><div class="field"><label for="v3a">A</label><input type="number" id="v3a" value="40" min="0"></div><div class="field"><label for="v3b">B</label><input type="number" id="v3b" value="35" min="0"></div><div class="field"><label for="v3c">C</label><input type="number" id="v3c" value="30" min="0"></div><div class="field"><label for="v3ab">A and B</label><input type="number" id="v3ab" value="12" min="0"></div><div class="field"><label for="v3bc">B and C</label><input type="number" id="v3bc" value="10" min="0"></div><div class="field"><label for="v3ca">C and A</label><input type="number" id="v3ca" value="8" min="0"></div><div class="field"><label for="v3abc">All three</label><input type="number" id="v3abc" value="5" min="0"></div></div><div class="tscroll"><table class="pt" id="v3t"></table></div><div class="out" id="v3o"></div>',
      init: function (el) {
        function g(id) { return +$("#" + id, el).value || 0; }
        function up() {
          var A = g("v3a"), B = g("v3b"), C = g("v3c"), AB = g("v3ab"), BC = g("v3bc"), CA = g("v3ca"), X = g("v3abc"), o = $("#v3o", el);
          var ab = AB - X, bc = BC - X, ca = CA - X, a = A - ab - ca - X, b = B - ab - bc - X, c = C - bc - ca - X, R = [["Only A", a], ["Only B", b], ["Only C", c], ["A and B only", ab], ["B and C only", bc], ["C and A only", ca], ["All three", X]];
          $("#v3t", el).innerHTML = "<tr><th>Region</th><th>People</th></tr>" + R.map(function (r) { return "<tr><td>" + r[0] + "</td><td" + (r[1] < 0 ? ' style="color:var(--red-fg)"' : "") + ">" + r[1] + "</td></tr>"; }).join("");
          if (R.some(function (r) { return r[1] < 0; })) { o.innerHTML = "These numbers do not fit<small>A region came out negative; check the overlaps.</small>"; return; }
          var u = A + B + C - AB - BC - CA + X;
          o.innerHTML = "At least one: " + u + "<small>" + A + " + " + B + " + " + C + " − " + AB + " − " + BC + " − " + CA + " + " + X + ". Exactly one: " + (a + b + c) + ", exactly two: " + (ab + bc + ca) + ".</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    vtypegame: {
      title: "Pick the diagram", html: '<div class="big" id="vgq" style="text-align:center;font-size:19px;font-weight:800">…</div><div class="vpick" id="vgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="vgs">0</b> / <b id="vgn">0</b></span><button class="btn btn-accent btn-sm" id="vgg">Next</button></div><div class="why" id="vgw" hidden></div>',
      init: function (el) {
        var Q = [["Delhi", "India", "Asia", 1], ["Dogs", "Cats", "Animals", 2], ["Pen", "Book", "Table", 0], ["Teachers", "Singers", "Women", 4], ["Men", "Women", "Doctors", 5], ["Mangoes", "Fruits", "Vegetables", 6], ["Mothers", "Women", "Teachers", 7], ["Elephants", "Wild animals", "Animals", 3], ["Rose", "Lily", "Flower", 2], ["Square", "Rectangle", "Quadrilateral", 1], ["Chair", "Sun", "River", 0], ["Girls", "Students", "Swimmers", 7], ["Cricketers", "Footballers", "Planets", 8], ["Hockey players", "Musicians", "Painters", 4], ["Kolkata", "West Bengal", "Bihar", 6]], sc = 0, n = 0;
        function round() {
          var q = Q[Math.floor(Math.random() * Q.length)], ans = q[3], pool = shuffle(VTYPES.length).filter(function (i) { return i !== ans; }).slice(0, 3).concat([ans]), ord = shuffle(4), done = false;
          $("#vgq", el).textContent = q[0] + ", " + q[1] + ", " + q[2]; $("#vgw", el).hidden = true;
          $("#vgo", el).innerHTML = ord.map(function (k) { var i = pool[k]; return '<button class="opt" data-ok="' + (i === ans ? 1 : 0) + '" aria-label="' + VTYPES[i][0] + '">' + vtypeSvg(i) + "<small>" + VTYPES[i][0] + "</small></button>"; }).join("");
          $$("#vgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#vgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#vgs", el).textContent = sc; $("#vgn", el).textContent = n; $("#vgw", el).hidden = false; $("#vgw", el).innerHTML = "Answer: " + VTYPES[ans][0] + "."; }; });
        }
        $("#vgg", el).onclick = round; round();
      }
    }
    ,
    strongword: {
      title: "Strong-word spotter", html: '<div class="field"><label for="swt">Statement</label><input type="text" id="swt" value="Most students failed the maths test."></div><div class="field"><label for="swc">Conclusion</label><input type="text" id="swc" value="No student passed the test."></div><div class="out" id="swo"></div>',
      init: function (el) {
        var STRONG = ["all", "only", "always", "never", "must", "none", "no one", "every", "everyone", "no", "forever", "definitely", "certainly", "entire", "completely"], SOFT = ["may", "might", "some", "probably", "likely", "can", "could", "most", "many", "few", "sometimes", "possibly"];
        function q(a) { return a.map(function (w) { return "“" + w + "”"; }).join(", "); }
        function hits(s, L) { s = " " + s.toLowerCase().replace(/[^a-z ]/g, " ") + " "; return L.filter(function (w) { return s.indexOf(" " + w + " ") >= 0; }); }
        function up() {
          var t = $("#swt", el).value, c = $("#swc", el).value, cs = hits(c, STRONG), ts = hits(t, STRONG), cf = hits(c, SOFT), o = $("#swo", el);
          var newStrong = cs.filter(function (w) { return ts.indexOf(w) < 0; });
          o.innerHTML = (newStrong.length ? "Careful: the conclusion is stronger than the statement" : cs.length ? "Strong words match the statement" : "No extreme words in the conclusion") + "<small>Strong words in the conclusion: " + (q(cs) || "none") + ". In the statement: " + (q(ts) || "none") + ". Soft words in the conclusion: " + (q(cf) || "none") + ". A conclusion stronger than its statement usually does not follow.</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    coacheck: {
      title: "Course-of-action checklist", html: '<div class="field"><label for="cat">Proposed action</label><input type="text" id="cat" value="Install traffic lights at the crossing."></div><div id="caq"></div><div class="out" id="cao"></div>',
      init: function (el) {
        var Q = ["Is it practical (can it really be done)?", "Does it solve or reduce the problem?", "Is it free of extreme steps (shutting down, banning everything, punishing everyone)?", "Does it deal with this problem, not a different one?"];
        $("#caq", el).innerHTML = Q.map(function (q, i) { return '<label class="row" style="gap:8px;flex-wrap:nowrap;margin:6px 0"><input type="checkbox" id="caq' + i + '" checked> <span>' + q + "</span></label>"; }).join("");
        function up() {
          var n = Q.filter(function (_, i) { return $("#caq" + i, el).checked; }).length, o = $("#cao", el);
          o.innerHTML = (n === Q.length ? "Follows" : "Does not follow") + "<small>The action passes " + n + " of " + Q.length + " checks. A course of action should pass all four.</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; x.onchange = up; }); up();
      }
    },
    stmtgame: {
      title: "Follows or not?", html: '<div id="sgq2" style="font-weight:700;line-height:1.5">…</div><div class="opts" id="sgo2"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="sgs2">0</b> / <b id="sgn2">0</b></span><button class="btn btn-accent btn-sm" id="sgg2">Next</button></div><div class="why" id="sgw2" hidden></div>',
      init: function (el) {
        var P = [
          ["All members get a free cap. Rohit is a member.", "Rohit gets a free cap.", 1, "It follows directly."],
          ["All members get a free cap. Rohit is a member.", "Only members like caps.", 0, "Feelings are not in the statement."],
          ["The museum is closed on Mondays.", "The museum is open on all other days.", 0, "The statement says nothing about other days."],
          ["The museum is closed on Mondays.", "You cannot visit the museum on a Monday.", 1, "It follows directly."],
          ["Most shops in the market sell clothes.", "Some shops in the market sell clothes.", 1, "‘Most’ includes ‘some’."],
          ["Most shops in the market sell clothes.", "All shops in the market sell clothes.", 0, "‘Most’ is weaker than ‘all’."],
          ["Smoking is banned inside the office.", "Smoking is allowed everywhere outside the office.", 0, "Outside is not covered."],
          ["Smoking is banned inside the office.", "A person smoking inside the office breaks the rule.", 1, "It follows directly."],
          ["Some birds cannot fly.", "Every bird can fly.", 0, "It contradicts the statement."],
          ["Prices of vegetables rose after heavy rain.", "The rain may have damaged crops.", 1, "A fair, soft inference."],
          ["Prices of vegetables rose after heavy rain.", "Vegetables will never be cheap again.", 0, "Extreme claim."],
          ["Only students with an ID can use the library.", "Neha used the library, so she has an ID.", 1, "‘Only’ makes the ID necessary."]
        ], sc = 0, n = 0;
        function round() {
          var p = P[Math.floor(Math.random() * P.length)], done = false;
          $("#sgq2", el).innerHTML = "Statement: " + esc(p[0]) + "<br>Conclusion: " + esc(p[1]); $("#sgw2", el).hidden = true;
          $("#sgo2", el).innerHTML = '<button class="opt" data-ok="' + p[2] + '">Follows</button><button class="opt" data-ok="' + (1 - p[2]) + '">Does not follow</button>';
          $$("#sgo2 .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#sgo2 .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#sgs2", el).textContent = sc; $("#sgn2", el).textContent = n; $("#sgw2", el).hidden = false; $("#sgw2", el).textContent = p[3]; }; });
        }
        $("#sgg2", el).onclick = round; round();
      }
    }
    ,
    mclockt: {
      title: "Mirror clock", html: '<div class="grid2"><div class="field"><label for="mch">Hour</label><input type="number" id="mch" value="3" min="1" max="12"></div><div class="field"><label for="mcm">Minutes</label><input type="number" id="mcm" value="40" min="0" max="59"></div></div><div class="row" id="mcz" style="justify-content:center;gap:12px"></div><div class="out" id="mco"></div>',
      init: function (el) {
        function up() {
          var h = Math.round(+$("#mch", el).value), m = Math.round(+$("#mcm", el).value), o = $("#mco", el);
          if (!(h >= 1 && h <= 12) || !(m >= 0 && m <= 59)) { o.textContent = "Hour 1–12, minutes 0–59"; $("#mcz", el).innerHTML = ""; return; }
          var r = mirrorTime(h, m);
          $("#mcz", el).innerHTML = clockSvg(h, m, false, "Actual " + hm(h, m)) + clockSvg(h, m, true, "In the mirror");
          o.innerHTML = "Mirror shows " + hm(r[0], r[1]) + "<small>11:60 − " + hm(h % 12, m) + " = " + hm(r[0] === 12 ? 0 : r[0], r[1]) + (r[0] === 12 ? ", i.e. " + hm(12, r[1]) : "") + ". The flipped clock on the right reads the same.</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    mword: {
      title: "Word reflector", html: '<div class="field"><label for="mwt">Word or letters</label><input type="text" id="mwt" value="CHOICE" maxlength="16"></div><div id="mwz"></div><div class="out" id="mwo"></div>',
      init: function (el) {
        var V = "AHIMOTUVWXY", W = "BCDEHIKOX";
        function up() {
          var w = $("#mwt", el).value.toUpperCase().replace(/[^A-Z0-9 ]/g, ""), L = w.replace(/[^A-Z]/g, ""), o = $("#mwo", el);
          $("#mwz", el).innerHTML = w ? mirWord(w) : "";
          if (!L) { o.textContent = "Type a word"; return; }
          var v = L.split("").filter(function (c) { return V.indexOf(c) >= 0; }).length, wa = L.split("").filter(function (c) { return W.indexOf(c) >= 0; }).length, same = v === L.length && L === L.split("").reverse().join("");
          o.innerHTML = v + " of " + L.length + " letters are mirror-safe · " + wa + " are water-safe<small>" + (same ? "The whole word looks the same in a mirror." : "The word changes in a mirror: the letters reverse order" + (v < L.length ? " and some letters flip." : ".")) + (wa === L.length ? " It looks the same in water." : "") + "</small>";
        }
        $("#mwt", el).oninput = up; up();
      }
    },
    mgame: {
      title: "Mirror clock sprint", html: '<div class="row" id="mgz" style="justify-content:center"></div><div class="opts" id="mgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="mgs">0</b> / <b id="mgn">0</b></span><button class="btn btn-accent btn-sm" id="mgg">Next</button></div><div class="why" id="mgw" hidden></div>',
      init: function (el) {
        var sc = 0, n = 0;
        function round() {
          var h = 1 + Math.floor(Math.random() * 12), m = 5 * Math.floor(Math.random() * 12), r = mirrorTime(h, m), ans = hm(r[0], r[1]), done = false;
          var ops = [ans, hm(h, m), hm(r[0] % 12 + 1, r[1]), hm(r[0], (r[1] + 30) % 60)].filter(function (v, i, a) { return a.indexOf(v) === i; });
          while (ops.length < 4) ops.push(hm(1 + Math.floor(Math.random() * 12), 5 * Math.floor(Math.random() * 12)));
          ops = ops.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 4);
          var ord = shuffle(ops.length);
          $("#mgz", el).innerHTML = clockSvg(h, m, false) + '<p style="width:100%;text-align:center;font-weight:800;margin:4px 0 0">What does the mirror show?</p>'; $("#mgw", el).hidden = true;
          $("#mgo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + ops[k] + "</button>"; }).join("");
          $$("#mgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#mgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#mgs", el).textContent = sc; $("#mgn", el).textContent = n; $("#mgw", el).hidden = false; $("#mgw", el).textContent = "11:60 − " + hm(h % 12, m) + " = " + ans + "."; }; });
        }
        $("#mgg", el).onclick = round; round();
      }
    }
    ,
    foldsim: {
      title: "Fold and punch simulator", html: '<p class="note">Fold the paper, tap squares inside the blue outline to punch, then open it.</p><div class="row" style="gap:6px;flex-wrap:wrap"><button class="chip" data-f="L">Left half over right</button><button class="chip" data-f="R">Right half over left</button><button class="chip" data-f="T">Top half down</button><button class="chip" data-f="B">Bottom half up</button></div><div class="row" style="gap:6px;margin-top:8px"><button class="btn btn-accent btn-sm" id="fso">Open the paper</button><button class="btn btn-sm" id="fsr">Start again</button></div><div class="row" id="fsz" style="gap:14px;align-items:flex-start;margin-top:8px"></div><div class="out" id="fsout"></div>',
      init: function (el) {
        var N = 8, F = ["L", "T"], H = [[6, 5]], open = false;
        function up() {
          var st = pfState(N, F), r = st.r, o = $("#fsout", el);
          H = H.filter(function (h) { return h[0] >= r.x0 && h[0] < r.x1 && h[1] >= r.y0 && h[1] < r.y1; });
          if (!open) {
            $("#fsz", el).innerHTML = '<div class="pfclick">' + pfGrid(N, H, r) + "</div>";
            $$("#fsz rect[data-x]", el).forEach(function (c) { c.style.cursor = "pointer"; c.onclick = function () { var x = +c.getAttribute("data-x"), y = +c.getAttribute("data-y"); if (x < r.x0 || x >= r.x1 || y < r.y0 || y >= r.y1) return; var i = H.findIndex(function (h) { return h[0] === x && h[1] === y; }); if (i >= 0) H.splice(i, 1); else H.push([x, y]); up(); }; });
            o.innerHTML = "Folds: " + (st.lines.length || 0) + " · holes punched: " + H.length + "<small>When opened you will see " + H.length + " × 2^" + st.lines.length + " = " + H.length * Math.pow(2, st.lines.length) + " holes.</small>";
          } else {
            var U = pfUnfold(st, H);
            $("#fsz", el).innerHTML = "<div>" + pfGrid(N, H, r) + "<small>Folded</small></div><div>" + pfGrid(N, U, null) + "<small>Opened</small></div>";
            o.innerHTML = U.length + " holes when opened<small>Each hole is mirrored across every fold line, last fold first.</small>";
          }
        }
        $$("#fsz", el); $$(".chip[data-f]", el).forEach(function (b) { b.onclick = function () { if (F.length < 4) { F.push(b.getAttribute("data-f")); open = false; up(); } }; });
        $("#fso", el).onclick = function () { open = !open; $("#fso", el).textContent = open ? "Fold it back" : "Open the paper"; up(); };
        $("#fsr", el).onclick = function () { F = []; H = []; open = false; $("#fso", el).textContent = "Open the paper"; up(); };
        up();
      }
    },
    holecount: {
      title: "Hole counter", html: '<div class="grid2"><div class="field"><label for="hcf">Number of folds <b id="hcfv">2</b></label><input type="range" id="hcf" min="0" max="5" value="2"></div><div class="field"><label for="hch">Holes punched <b id="hchv">3</b></label><input type="range" id="hch" min="1" max="6" value="3"></div></div><label class="row" style="gap:8px;flex-wrap:nowrap"><input type="checkbox" id="hcl"> <span>One of the holes is exactly on the last fold line</span></label><div class="out" id="hco"></div>',
      init: function (el) {
        function up() {
          var f = +$("#hcf", el).value, h = +$("#hch", el).value, on = $("#hcl", el).checked && f > 0, n = on ? (h - 1) * Math.pow(2, f) + Math.pow(2, f - 1) : h * Math.pow(2, f);
          $("#hcfv", el).textContent = f; $("#hchv", el).textContent = h;
          o = $("#hco", el); o.innerHTML = n + " holes when opened<small>" + (on ? (h - 1) + " × 2^" + f + " + 2^" + (f - 1) + " (the hole on the last fold opens as one, then doubles with the earlier folds)." : h + " × 2^" + f + ".") + "</small>";
        }
        var o; $$("input", el).forEach(function (x) { x.oninput = up; x.onchange = up; }); up();
      }
    },
    foldgame: {
      title: "Which one opens like this?", html: '<div class="row" id="fgq" style="justify-content:center"></div><p id="fgt" style="text-align:center;font-weight:800;margin:4px 0"></p><div class="vpick" id="fgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="fgs">0</b> / <b id="fgn">0</b></span><button class="btn btn-accent btn-sm" id="fgg">Next</button></div><div class="why" id="fgw" hidden></div>',
      init: function (el) {
        var N = 6, sc = 0, n = 0, NM = { L: "left over right", R: "right over left", T: "top down", B: "bottom up" };
        function key(A) { return A.map(function (p) { return p.join(","); }).sort().join("|"); }
        function round() {
          var F = [["L", "R"][Math.floor(Math.random() * 2)]]; if (Math.random() < 0.7) F.push(["T", "B"][Math.floor(Math.random() * 2)]);
          var st = pfState(N, F), r = st.r, H = [[r.x0 + Math.floor(Math.random() * (r.x1 - r.x0)), r.y0 + Math.floor(Math.random() * (r.y1 - r.y0))]], ans = pfUnfold(st, H);
          var wrong = [H, pfUnfold(pfState(N, F.slice(0, 1)), H), ans.map(function (p) { return [N - 1 - p[0], p[1]]; }), ans.map(function (p) { return [p[0], N - 1 - p[1]]; }), pfUnfold(st, [[H[0][0] === r.x0 ? r.x1 - 1 : r.x0, H[0][1]]])];
          var opts = [ans], seen = [key(ans)]; wrong.forEach(function (w) { var k = key(w); if (seen.indexOf(k) < 0 && opts.length < 4) { seen.push(k); opts.push(w); } });
          while (opts.length < 4) { var rnd = [[Math.floor(Math.random() * N), Math.floor(Math.random() * N)]], k2 = key(pfUnfold(st, rnd)); if (seen.indexOf(k2) < 0) { seen.push(k2); opts.push(pfUnfold(st, rnd)); } }
          var ord = shuffle(4), done = false;
          $("#fgq", el).innerHTML = pfGrid(N, H, r); $("#fgt", el).textContent = "Folded " + F.map(function (f) { return NM[f]; }).join(", then ") + ". Opened, it looks like:"; $("#fgw", el).hidden = true;
          $("#fgo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + pfGrid(N, opts[k], null, "", true) + "</button>"; }).join("");
          $$("#fgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#fgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#fgs", el).textContent = sc; $("#fgn", el).textContent = n; $("#fgw", el).hidden = false; $("#fgw", el).textContent = ans.length + " holes: the punch is mirrored across " + (F.length === 2 ? "both fold lines." : "the fold line."); }; });
        }
        $("#fgg", el).onclick = round; round();
      }
    }
    ,
    embgame: {
      title: "Find the hidden shape", html: '<div id="egz"></div><div class="opts" id="ego" style="grid-template-columns:repeat(4,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="egs">0</b> / <b id="egn">0</b></span><button class="btn btn-accent btn-sm" id="egg">Next</button></div><div class="why" id="egw" hidden></div>',
      init: function (el, T) {
        var B = (T.bank && T.bank.emb) || [], sc = 0, n = 0, L = ["P", "Q", "R", "S"];
        function round() {
          var e = B[Math.floor(Math.random() * B.length)], figs = [e.good].concat(e.bad), ord = shuffle(4), ci = ord.indexOf(0), done = false;
          $("#egz", el).innerHTML = embViz({ x: e.x, opts: ord.map(function (k) { return figs[k]; }) }); $("#egw", el).hidden = true;
          $("#ego", el).innerHTML = L.map(function (l, i) { return '<button class="opt" data-ok="' + (i === ci ? 1 : 0) + '">' + l + "</button>"; }).join("");
          $$("#ego .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#ego .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#egs", el).textContent = sc; $("#egn", el).textContent = n; $("#egw", el).hidden = false; $("#egw", el).textContent = "Figure " + L[ci] + " holds the shape exactly as drawn. The others hold it only turned or flipped."; }; });
        }
        $("#egg", el).onclick = round; if (B.length) round();
      }
    },
    compgame: {
      title: "Complete the pattern", html: '<div id="cpz"></div><div class="opts" id="cpo" style="grid-template-columns:repeat(4,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="cps">0</b> / <b id="cpn">0</b></span><button class="btn btn-accent btn-sm" id="cpg">Next</button></div><div class="why" id="cpw" hidden></div>',
      init: function (el, T) {
        var B = (T.bank && T.bank.comp) || [], sc = 0, n = 0, L = ["P", "Q", "R", "S"];
        function round() {
          var c = B[Math.floor(Math.random() * B.length)], ord = shuffle(4), ci = ord.indexOf(0), done = false;
          $("#cpz", el).innerHTML = compViz({ rest: c.rest, cands: ord.map(function (k) { return c.cands[k]; }) }); $("#cpw", el).hidden = true;
          $("#cpo", el).innerHTML = L.map(function (l, i) { return '<button class="opt" data-ok="' + (i === ci ? 1 : 0) + '">' + l + "</button>"; }).join("");
          $$("#cpo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#cpo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#cps", el).textContent = sc; $("#cpn", el).textContent = n; $("#cpw", el).hidden = false; $("#cpw", el).innerHTML = segSvg(c.rest.concat(c.cands[0].map(function (s) { return [s[0] + 2, s[1] + 2, s[2] + 2, s[3] + 2]; })), 4, 110) + "<br>Figure " + L[ci] + " mirrors the bottom-left quarter."; }; });
        }
        $("#cpg", el).onclick = round; if (B.length) round();
      }
    },
    segdraw: {
      title: "Draw and mirror", html: '<p class="note">Tap two dots to draw a line on the left half. The right half fills in as its mirror image.</p><div id="sdz" style="display:flex;justify-content:center"></div><div class="row" style="gap:6px;justify-content:center"><button class="btn btn-sm" id="sdu">Undo</button><button class="btn btn-sm" id="sdc">Clear</button></div><div class="out" id="sdo2"></div>',
      init: function (el) {
        var S = [[0, 0, 2, 2], [0, 4, 1, 2]], pick = null, c = 40, pad = 10;
        function up() {
          var all = S.concat(S.map(function (s) { return [4 - s[0], s[1], 4 - s[2], s[3]]; })), W = 4 * c + 2 * pad, h = '<svg viewBox="0 0 ' + W + " " + W + '" width="' + W + '" class="kinsvg"><rect x="' + pad + '" y="' + pad + '" width="' + 4 * c + '" height="' + 4 * c + '" fill="#fff" stroke="var(--border)"/><line x1="' + (pad + 2 * c) + '" y1="' + pad + '" x2="' + (pad + 2 * c) + '" y2="' + (pad + 4 * c) + '" stroke="var(--accent)" stroke-dasharray="4 4"/>';
          all.forEach(function (s, i) { h += '<line x1="' + (pad + s[0] * c) + '" y1="' + (pad + s[1] * c) + '" x2="' + (pad + s[2] * c) + '" y2="' + (pad + s[3] * c) + '" stroke="' + (i < S.length ? "var(--ink)" : "#e0679b") + '" stroke-width="3" stroke-linecap="round"/>'; });
          for (var x = 0; x <= 2; x++) for (var y = 0; y <= 4; y++) h += '<circle data-p="' + x + "," + y + '" cx="' + (pad + x * c) + '" cy="' + (pad + y * c) + '" r="7" fill="' + (pick && pick[0] === x && pick[1] === y ? "var(--accent)" : "#cfd3e0") + '" style="cursor:pointer"/>';
          $("#sdz", el).innerHTML = h + "</svg>";
          $$("#sdz circle[data-p]", el).forEach(function (d) { d.onclick = function () { var p = d.getAttribute("data-p").split(",").map(Number); if (!pick) pick = p; else { if (pick[0] !== p[0] || pick[1] !== p[1]) S.push([pick[0], pick[1], p[0], p[1]]); pick = null; } up(); }; });
          $("#sdo2", el).innerHTML = S.length + " lines drawn<small>Pink lines are the mirror image across the dashed line. A completion answer must match the pink half exactly.</small>";
        }
        $("#sdu", el).onclick = function () { S.pop(); pick = null; up(); };
        $("#sdc", el).onclick = function () { S = []; pick = null; up(); };
        up();
      }
    }
    ,
    tricount: {
      title: "Triangle spotter", html: '<p class="note">Step through every triangle in the figure, one at a time.</p><div class="field"><label for="tcf">Figure</label><select id="tcf"></select></div><div id="tcz" style="display:flex;justify-content:center"></div><div class="row" style="gap:6px;justify-content:center"><button class="btn btn-sm" id="tcp">◀ Previous</button><button class="btn btn-accent btn-sm" id="tcn">Next triangle ▶</button></div><div class="out" id="tco"></div>',
      init: function (el, T) {
        var B = (T.bank || []), i = -1;
        $("#tcf", el).innerHTML = B.map(function (b, k) { return '<option value="' + k + '">Figure ' + (k + 1) + " (" + b.tri + " triangles)</option>"; }).join("");
        function up() {
          var b = B[+$("#tcf", el).value]; if (!b) return;
          $("#tcz", el).innerHTML = cntSvg(b.s, i >= 0 ? b.tris[i] : null, 170);
          $("#tco", el).innerHTML = (i < 0 ? "Tap “Next triangle” to start" : "Triangle " + (i + 1) + " of " + b.tri) + "<small>Count the smallest pieces first, then the larger ones, so none are missed.</small>";
        }
        $("#tcf", el).onchange = function () { i = -1; up(); };
        $("#tcn", el).onclick = function () { var b = B[+$("#tcf", el).value]; i = Math.min(b.tri - 1, i + 1); up(); };
        $("#tcp", el).onclick = function () { i = Math.max(-1, i - 1); up(); };
        up();
      }
    },
    gridcount: {
      title: "Grid counter", html: '<div class="grid2"><div class="field"><label for="gcr">Rows <b id="gcrv">3</b></label><input type="range" id="gcr" min="1" max="8" value="3"></div><div class="field"><label for="gcc">Columns <b id="gccv">3</b></label><input type="range" id="gcc" min="1" max="8" value="3"></div></div><div id="gcz" style="display:flex;justify-content:center"></div><div class="out" id="gco"></div>',
      init: function (el) {
        function C2(n) { return n * (n - 1) / 2; }
        function up() {
          var r = +$("#gcr", el).value, c = +$("#gcc", el).value, S = [], sq = 0, parts = [];
          $("#gcrv", el).textContent = r; $("#gccv", el).textContent = c;
          for (var j = 0; j <= r; j++) S.push([0, j, c, j]); for (var i = 0; i <= c; i++) S.push([i, 0, i, r]);
          for (var k = 1; k <= Math.min(r, c); k++) { var m = (r - k + 1) * (c - k + 1); sq += m; parts.push(m); }
          $("#gcz", el).innerHTML = cntSvg(S, null, 150);
          $("#gco", el).innerHTML = "Squares " + sq + " · rectangles " + C2(r + 1) * C2(c + 1) + "<small>Squares by size: " + parts.join(" + ") + ". Rectangles: C(" + (r + 1) + ",2) × C(" + (c + 1) + ",2) = " + C2(r + 1) + " × " + C2(c + 1) + ".</small>";
        }
        $$("input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    cntgame: {
      title: "Count the triangles", html: '<div id="cgz" style="display:flex;justify-content:center"></div><div class="opts" id="cgo3" style="grid-template-columns:repeat(4,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="cgs3">0</b> / <b id="cgn3">0</b></span><button class="btn btn-accent btn-sm" id="cgg3">Next</button></div><div class="why" id="cgw3" hidden></div>',
      init: function (el, T) {
        var B = T.bank || [], sc = 0, n = 0;
        function round() {
          var b = B[Math.floor(Math.random() * B.length)], a = b.tri, ops = [a]; [1, -1, 2, -2, 3].forEach(function (d) { if (ops.length < 4 && a + d > 0) ops.push(a + d); });
          var ord = shuffle(4), done = false;
          $("#cgz", el).innerHTML = cntSvg(b.s, null, 150); $("#cgw3", el).hidden = true;
          $("#cgo3", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + ops[k] + "</button>"; }).join("");
          $$("#cgo3 .opt", el).forEach(function (bt) { bt.onclick = function () { if (done) return; done = true; n++; var ok = bt.getAttribute("data-ok") === "1"; if (ok) sc++; bt.classList.add(ok ? "right" : "wrong"); $$("#cgo3 .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#cgs3", el).textContent = sc; $("#cgn3", el).textContent = n; $("#cgw3", el).hidden = false; $("#cgw3", el).textContent = a + " triangles. Use the Triangle spotter to see each one."; }; });
        }
        $("#cgg3", el).onclick = round; if (B.length) round();
      }
    }
    ,
    seatboard: {
      title: "Seat board", html: '<div id="sbq" class="pzq"></div><div id="sbs" class="pzseats"></div><div class="row" style="gap:6px"><button class="btn btn-accent btn-sm" id="sbc">Check my seating</button><button class="btn btn-sm" id="sbn">New puzzle</button></div><ul id="sbl" class="pzclues"></ul><div class="out" id="sbo"></div>',
      init: function (el, T) {
        var B = T.bank || [], p, N = ["A", "B", "C", "D", "E"];
        function load() {
          p = B[Math.floor(Math.random() * B.length)];
          $("#sbq", el).innerHTML = "<b>" + esc(p.intro) + "</b>";
          var lab = p.mode === "row" ? ["Seat 1 (left)", "Seat 2", "Seat 3", "Seat 4", "Seat 5 (right)"] : ["Floor 1 (bottom)", "Floor 2", "Floor 3", "Floor 4", "Floor 5 (top)"];
          $("#sbs", el).className = "pzseats" + (p.mode === "floor" ? " fl" : "");
          $("#sbs", el).innerHTML = lab.map(function (l, i) { return '<div class="field"><label for="sb' + i + '">' + l + '</label><select id="sb' + i + '"><option value="">—</option>' + N.map(function (n) { return "<option>" + n + "</option>"; }).join("") + "</select></div>"; }).join("");
          $("#sbl", el).innerHTML = p.clues.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
          $("#sbo", el).innerHTML = "Fill the seats, then check<small>" + esc(p.q) + "</small>";
        }
        $("#sbc", el).onclick = function () {
          var v = [0, 1, 2, 3, 4].map(function (i) { return $("#sb" + i, el).value; }), o = $("#sbo", el);
          if (v.some(function (x) { return !x; }) || new Set(v).size < 5) { o.innerHTML = "Place all five people, once each"; return; }
          var P = {}; v.forEach(function (n, i) { P[n] = i; });
          var ok = p.cs.map(function (c) { return pzEval(c, P); });
          $$("#sbl li", el).forEach(function (li, i) { li.className = ok[i] ? "ok" : "no"; });
          var all = ok.every(Boolean);
          o.innerHTML = (all ? "All clues satisfied ✓" : ok.filter(function (x) { return !x; }).length + " clue(s) broken") + "<small>" + (all ? esc(p.q) + " Answer: " + p.a + "." : "Red clues are not met yet.") + "</small>";
        };
        $("#sbn", el).onclick = load; if (B.length) load();
      }
    },
    pzshrink: {
      title: "Watch the possibilities shrink", html: '<p class="note">Five people can sit in 120 ways. Each clue removes some of them.</p><div id="psq" class="pzq"></div><div class="tscroll"><table class="pt" id="pst"></table></div><div class="row" style="gap:6px"><button class="btn btn-accent btn-sm" id="psn">Next clue</button><button class="btn btn-sm" id="psr">New puzzle</button></div><div class="out" id="pso"></div>',
      init: function (el, T) {
        var B = T.bank || [], p, k = 0, PER = pzPerms();
        function up() {
          var left = PER, rows = ["<tr><th>Clues used</th><th>Arrangements left</th></tr><tr><td>none</td><td>120</td></tr>"];
          for (var i = 0; i < k; i++) { left = left.filter(function (P) { return pzEval(p.cs[i], P); }); rows.push("<tr><td>" + esc(p.clues[i]) + "</td><td>" + left.length + "</td></tr>"); }
          $("#pst", el).innerHTML = rows.join("");
          var o = $("#pso", el);
          if (left.length === 1) { var ord = Object.keys(left[0]).sort(function (a, b) { return left[0][a] - left[0][b]; }); o.innerHTML = "Solved: " + ord.join(", ") + "<small>" + (p.mode === "row" ? "Left to right." : "Bottom to top.") + "</small>"; }
          else o.innerHTML = left.length + " arrangements still fit<small>" + (k < p.cs.length ? "Add the next clue." : "") + "</small>";
        }
        function load() { p = B[Math.floor(Math.random() * B.length)]; k = 0; $("#psq", el).innerHTML = "<b>" + esc(p.intro) + "</b>"; up(); }
        $("#psn", el).onclick = function () { if (k < p.cs.length) k++; up(); };
        $("#psr", el).onclick = load; if (B.length) load();
      }
    },
    pzgame: {
      title: "Quick puzzle", html: '<div id="pzq" class="pzq"></div><div class="opts" id="pzo" style="grid-template-columns:repeat(4,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="pzs">0</b> / <b id="pzn">0</b></span><button class="btn btn-accent btn-sm" id="pzg">Next</button></div><div class="why" id="pzw" hidden></div>',
      init: function (el, T) {
        var B = T.bank || [], sc = 0, n = 0;
        function round() {
          var p = B[Math.floor(Math.random() * B.length)], ord = shuffle(4), done = false;
          $("#pzq", el).innerHTML = "<b>" + esc(p.intro) + "</b><ul>" + p.clues.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul><b>" + esc(p.q) + "</b>"; $("#pzw", el).hidden = true;
          $("#pzo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + p.o[k] + "</button>"; }).join("");
          $$("#pzo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#pzo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#pzs", el).textContent = sc; $("#pzn", el).textContent = n; $("#pzw", el).hidden = false; $("#pzw", el).textContent = p.why; }; });
        }
        $("#pzg", el).onclick = round; if (B.length) round();
      }
    }
    ,
    eicards: {
      title: "Five components: match the definition", html: '<div class="big" id="ecq" style="text-align:center;font-size:18px;font-weight:800">…</div><div class="opts" id="eco"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="ecs">0</b> / <b id="ecn">0</b></span><button class="btn btn-accent btn-sm" id="ecg">Next</button></div><div class="why" id="ecw" hidden></div>',
      init: function (el) {
        var C = [["Self-awareness", ["Noticing that you feel irritated before you reply", "Knowing which situations make you anxious", "Recognising your strengths and weak spots"]], ["Self-regulation", ["Pausing and breathing instead of snapping back", "Staying calm when a plan fails", "Thinking before acting when angry"]], ["Motivation", ["Working hard on a goal even without a reward", "Bouncing back after a setback to try again", "Enjoying learning for its own sake"]], ["Empathy", ["Sensing that a quiet friend is upset", "Seeing a problem from the customer’s side", "Understanding why a colleague is stressed"]], ["Social skills", ["Resolving a team disagreement", "Building a network of contacts", "Leading a group to agree on a plan"]]], sc = 0, n = 0;
        function round() {
          var i = Math.floor(Math.random() * 5), ex = C[i][1][Math.floor(Math.random() * 3)], ord = shuffle(5), done = false;
          $("#ecq", el).textContent = ex; $("#ecw", el).hidden = true;
          $("#eco", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === i ? 1 : 0) + '">' + C[k][0] + "</button>"; }).join("");
          $$("#eco .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#eco .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#ecs", el).textContent = sc; $("#ecn", el).textContent = n; $("#ecw", el).hidden = false; $("#ecw", el).textContent = "This shows " + C[i][0].toLowerCase() + "."; }; });
        }
        $("#ecg", el).onclick = round; round();
      }
    },
    stylegame: {
      title: "Name the response style", html: '<div class="big" id="ysq" style="text-align:center;font-size:17px;font-weight:700;line-height:1.5">…</div><div class="opts" id="yso2"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="yss">0</b> / <b id="ysn2">0</b></span><button class="btn btn-accent btn-sm" id="ysg">Next</button></div><div class="why" id="ysw" hidden></div>',
      init: function (el) {
        var ST = ["Assertive", "Aggressive", "Passive", "Passive-aggressive"], Q = [
          ["“I’d like to finish my point, then I’m happy to hear yours.”", 0], ["“You never listen. This is useless.”", 1], ["“It’s fine… whatever you want.” (while upset)", 2], ["“Oh, great job — as usual, late.”", 3],
          ["“I can’t take this on today, but I can help on Friday.”", 0], ["“Do it now or you’ll regret it.”", 1], ["Saying nothing when someone takes your seat.", 2], ["Agreeing in the meeting, then quietly not doing the work.", 3],
          ["“When the music is loud at night I can’t sleep. Could you lower it after 10?”", 0], ["Slamming the door after a disagreement.", 1], ["Always letting others choose, then feeling ignored.", 2], ["“No, no, I’m not angry,” followed by the silent treatment.", 3]
        ], sc = 0, n = 0, W = ["Clear, honest and respectful.", "It attacks the other person.", "It hides your own needs.", "The anger comes out indirectly."];
        function round() {
          var q = Q[Math.floor(Math.random() * Q.length)], ord = shuffle(4), done = false;
          $("#ysq", el).textContent = q[0]; $("#ysw", el).hidden = true;
          $("#yso2", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === q[1] ? 1 : 0) + '">' + ST[k] + "</button>"; }).join("");
          $$("#yso2 .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#yso2 .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#yss", el).textContent = sc; $("#ysn2", el).textContent = n; $("#ysw", el).hidden = false; $("#ysw", el).textContent = ST[q[1]] + ": " + W[q[1]]; }; });
        }
        $("#ysg", el).onclick = round; round();
      }
    },
    sjtgame: {
      title: "Best response", html: '<div id="sjq" style="font-weight:700;line-height:1.5">…</div><div class="opts" id="sjo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="sjs">0</b> / <b id="sjn">0</b></span><button class="btn btn-accent btn-sm" id="sjg">Next</button></div><div class="why" id="sjw" hidden></div>',
      init: function (el) {
        var Q = [
          ["Your neighbour’s dog barks every night and you can’t sleep.", ["Talk to the neighbour politely and suggest a solution together", "Shout at the dog from your window", "Complain about them on social media", "Put up with it and stay angry"]],
          ["A teammate is struggling with software you know well.", ["Offer to show them how it works", "Let them struggle so you look better", "Tell the manager they are slow", "Do their whole task without asking"]],
          ["You promised to help a friend move house, but now you have a fever.", ["Call early, explain honestly and suggest another day or help", "Just not turn up", "Go anyway and risk making others ill", "Send a message after the day is over"]],
          ["In a group project, one member does almost no work.", ["Talk to them about sharing tasks and agree on deadlines", "Remove their name without telling them", "Do all the work and complain later", "Insult them in the group chat"]],
          ["A shopkeeper gives you ₹100 extra change by mistake.", ["Return the extra money", "Keep it quietly", "Keep it and tell friends", "Spend it before anyone notices"]],
          ["Your junior makes a small mistake in front of a client.", ["Fix the issue calmly and give feedback to the junior later in private", "Scold the junior in front of the client", "Blame the junior to the client", "Ignore the mistake completely"]]
        ], sc = 0, n = 0;
        function round() {
          var q = Q[Math.floor(Math.random() * Q.length)], ord = shuffle(4), done = false;
          $("#sjq", el).textContent = q[0]; $("#sjw", el).hidden = true;
          $("#sjo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(q[1][k]) + "</button>"; }).join("");
          $$("#sjo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#sjo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#sjs", el).textContent = sc; $("#sjn", el).textContent = n; $("#sjw", el).hidden = false; $("#sjw", el).textContent = "Calm, honest and solves the problem."; }; });
        }
        $("#sjg", el).onclick = round; round();
      }
    }
    ,
    errgame: {
      title: "Tap the error", html: '<p class="note">Tap the part with the mistake, or “No error”.</p><div class="errparts" id="eep"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="ees">0</b> / <b id="een">0</b></span><button class="btn btn-accent btn-sm" id="eeg">Next sentence</button></div><div class="why" id="eew" hidden></div>',
      init: function (el) {
        var Q = [
          [["Everyone in the class", "have done", "the homework."], 1, "Everyone takes a singular verb: has done."],
          [["Mathematics", "are my", "favourite subject."], 1, "Subjects ending in -ics take a singular verb: is."],
          [["He is senior", "than me", "in the office."], 1, "Senior takes “to”: senior to me."],
          [["I have seen", "this film", "yesterday."], 0, "Past time word: I saw."],
          [["She has been working here", "since 2019", "and loves it."], -1, "Correct: since + point of time."],
          [["They reached", "at the station", "on time."], 1, "No “at” after reach."],
          [["An university", "has opened", "in our city."], 0, "‘Yoo’ sound: A university."],
          [["Neither of the two answers", "are", "correct."], 1, "Neither of + singular verb: is."],
          [["The police", "has arrested", "the thief."], 1, "Police is plural: have arrested."],
          [["No sooner had he left", "when", "it started to rain."], 1, "No sooner … than."],
          [["He gave me", "many informations", "about the course."], 1, "Information is uncountable: much information."],
          [["She is", "better than", "her brother at chess."], -1, "Correct."],
          [["The number of students", "are increasing", "every year."], 1, "“The number of” is singular: is increasing."],
          [["Ten kilometres", "is", "a long walk."], -1, "Correct: a distance as one amount takes a singular verb."],
          [["He enjoys", "to swim", "in the sea."], 1, "Enjoy + -ing: enjoys swimming."]
        ], sc = 0, n = 0;
        function round() {
          var q = Q[Math.floor(Math.random() * Q.length)], parts = q[0].concat(["No error"]), right = q[1] < 0 ? 3 : q[1], done = false;
          $("#eep", el).innerHTML = parts.map(function (p, i) { return '<button class="opt" data-i="' + i + '">' + "abcd"[i] + ") " + esc(p) + "</button>"; }).join(""); $("#eew", el).hidden = true;
          $$("#eep .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var i = +b.getAttribute("data-i"), ok = i === right; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#eep .opt", el)[right].classList.add("right"); $("#ees", el).textContent = sc; $("#een", el).textContent = n; $("#eew", el).hidden = false; $("#eew", el).textContent = q[2]; }; });
        }
        $("#eeg", el).onclick = round; round();
      }
    },
    agreeguide: {
      title: "Which verb? Agreement guide", html: '<div class="field"><label for="agk">The subject starts with…</label><select id="agk"></select></div><div class="out" id="ago"></div>',
      init: function (el) {
        var R = [
          ["Each / Every / Everyone / Somebody", "Singular verb", "Each of the players <b>is</b> ready."],
          ["One of + plural noun", "Singular verb, plural noun", "One of my friends <b>lives</b> in Pune."],
          ["Neither … nor / Either … or", "Agrees with the nearer subject", "Neither the manager nor the clerks <b>were</b> late."],
          ["A as well as B / A along with B / A with B", "Agrees with A (the first subject)", "The captain, along with his players, <b>was</b> praised."],
          ["The number of …", "Singular verb", "The number of cars <b>is</b> rising."],
          ["A number of …", "Plural verb", "A number of cars <b>are</b> parked outside."],
          ["News, information, furniture, advice, luggage", "Singular verb; no plural form", "The information <b>is</b> useful."],
          ["Police, people, cattle, children", "Plural verb", "The police <b>have</b> arrived."],
          ["Mathematics, physics, economics (subjects)", "Singular verb", "Physics <b>is</b> interesting."],
          ["Amounts as one quantity (₹500, ten km, five years)", "Singular verb", "Five years <b>is</b> a long time."],
          ["Two subjects joined by “and”", "Plural verb", "Ravi and Sita <b>are</b> friends."],
          ["Bread and butter (one idea)", "Singular verb", "Bread and butter <b>is</b> my breakfast."]
        ];
        $("#agk", el).innerHTML = R.map(function (r, i) { return '<option value="' + i + '">' + r[0] + "</option>"; }).join("");
        function up() { var r = R[+$("#agk", el).value]; $("#ago", el).innerHTML = r[1] + "<small>Example: " + r[2] + "</small>"; }
        $("#agk", el).onchange = up; up();
      }
    },
    compgen: {
      title: "Comparative and superlative maker", html: '<div class="field"><label for="cgw">Adjective</label><input type="text" id="cgw" value="clever"></div><div class="out" id="cgo4"></div>',
      init: function (el) {
        var IRR = { good: ["better", "best"], well: ["better", "best"], bad: ["worse", "worst"], badly: ["worse", "worst"], little: ["less", "least"], much: ["more", "most"], many: ["more", "most"], far: ["farther / further", "farthest / furthest"], old: ["older / elder", "oldest / eldest"] };
        function syl(w) { var m = w.replace(/e$/, "").match(/[aeiouy]+/g); return m ? m.length : 1; }
        function up() {
          var w = $("#cgw", el).value.trim().toLowerCase().replace(/[^a-z]/g, ""), o = $("#cgo4", el), c, s, why;
          if (!w) { o.textContent = "Type an adjective"; return; }
          if (IRR[w]) { c = IRR[w][0]; s = IRR[w][1]; why = "Irregular — learn it by heart."; }
          else if (syl(w) >= 3 || (syl(w) === 2 && !/(y|er|le|ow)$/.test(w))) { c = "more " + w; s = "most " + w; why = "Long adjective: use more / most."; }
          else if (/[^aeiou]y$/.test(w)) { c = w.slice(0, -1) + "ier"; s = w.slice(0, -1) + "iest"; why = "Ends in consonant + y: change y to i."; }
          else if (/e$/.test(w)) { c = w + "r"; s = w + "st"; why = "Ends in e: add r / st."; }
          else if (syl(w) === 1 && /[^aeiou][aeiou][^aeiouwxy]$/.test(w)) { var l = w.slice(-1); c = w + l + "er"; s = w + l + "est"; why = "Short vowel + one consonant: double it."; }
          else { c = w + "er"; s = w + "est"; why = "Short adjective: add -er / -est."; }
          o.innerHTML = w + " → " + c + " → " + s + "<small>" + why + " Never combine both: not “more " + (c.indexOf("more ") === 0 ? w + "er" : c) + "”.</small>";
        }
        $("#cgw", el).oninput = up; up();
      }
    }
    ,
    prepfind: {
      title: "Preposition finder", html: '<div class="field"><label for="pfw">Word</label><input type="text" id="pfw" value="insist" list="pfl"><datalist id="pfl"></datalist></div><div class="out" id="pfo"></div>',
      init: function (el) {
        var P = { accused: ["of", "He was accused of theft."], afraid: ["of", "She is afraid of dogs."], fond: ["of", "He is fond of music."], aware: ["of", "Are you aware of the rule?"], capable: ["of", "She is capable of leading."], consist: ["of", "Water consists of hydrogen and oxygen."], proud: ["of", "We are proud of you."], good: ["at", "He is good at maths."], bad: ["at", "I am bad at drawing."], surprised: ["at / by", "She was surprised at the news."], insist: ["on", "He insisted on paying."], depend: ["on", "It depends on the weather."], congratulate: ["on", "I congratulate you on your success."], rely: ["on", "You can rely on me."], interested: ["in", "She is interested in art."], succeed: ["in", "He succeeded in the test."], believe: ["in", "I believe in hard work."], prefer: ["to", "I prefer tea to coffee."], superior: ["to", "This model is superior to that one."], inferior: ["to", "It is inferior to the original."], senior: ["to", "She is senior to me."], married: ["to", "He is married to a doctor."], listen: ["to", "Listen to the teacher."], belong: ["to", "This bag belongs to me."], angry: ["with (a person) / at (a thing)", "She was angry with him."], deal: ["with", "We must deal with the problem."], comply: ["with", "Comply with the rules."], wait: ["for", "Wait for me."], apologise: ["for (a thing) / to (a person)", "He apologised to her for the delay."], abide: ["by", "Abide by the law."], refrain: ["from", "Refrain from smoking."], prevent: ["from", "Rain prevented us from going."], suffer: ["from", "He suffers from fever."], discuss: ["no preposition", "We discussed the plan."], reach: ["no preposition", "We reached the station."], enter: ["no preposition (for places)", "She entered the room."] };
        $("#pfl", el).innerHTML = Object.keys(P).sort().map(function (k) { return '<option value="' + k + '">'; }).join("");
        function up() { var w = $("#pfw", el).value.trim().toLowerCase(), r = P[w], o = $("#pfo", el); o.innerHTML = r ? w + " → " + r[0] + "<small>Example: " + esc(r[1]) + "</small>" : "Pick a word from the list<small>" + Object.keys(P).length + " common words are included.</small>"; }
        $("#pfw", el).oninput = up; up();
      }
    },
    aanfind: {
      title: "a or an?", html: '<div class="field"><label for="anw">Word or abbreviation</label><input type="text" id="anw" value="SSC"></div><div class="out" id="ano"></div>',
      init: function (el) {
        var VOW = ["hour", "honest", "honour", "honor", "heir", "honorary", "hourly"], CON = ["university", "unique", "uniform", "union", "unit", "use", "useful", "user", "usual", "european", "euro", "one", "once", "ewe", "utensil", "unicorn", "uranium", "eulogy"], VL = "AEFHILMNORSX";
        function up() {
          var w = $("#anw", el).value.trim(), lw = w.toLowerCase(), o = $("#ano", el), a, why;
          if (!w) { o.textContent = "Type a word"; return; }
          if (/^[A-Z]{2,}$/.test(w)) { a = VL.indexOf(w[0]) >= 0 ? "an" : "a"; why = "Abbreviations are read letter by letter; “" + w[0] + "” is said “" + { A: "ay", E: "ee", F: "ef", H: "aitch", I: "eye", L: "el", M: "em", N: "en", O: "oh", R: "ar", S: "es", X: "ex" }[w[0]] + "”." ; if (a === "a") why = "“" + w[0] + "” is said with a consonant sound."; why += " (If it is said as a word, like NASA, go by that sound: a NASA scientist.)"; }
          else if (VOW.some(function (v) { return lw.indexOf(v) === 0; })) { a = "an"; why = "The h is silent, so it starts with a vowel sound."; }
          else if (CON.some(function (v) { return lw.indexOf(v) === 0; })) { a = "a"; why = "It starts with a ‘yoo’ or ‘w’ sound, which is a consonant sound."; }
          else { a = /^[aeiou]/.test(lw) ? "an" : "a"; why = a === "an" ? "It starts with a vowel sound." : "It starts with a consonant sound."; }
          o.innerHTML = a + " " + esc(w) + "<small>" + why + "</small>";
        }
        $("#anw", el).oninput = up; up();
      }
    },
    sincefor: {
      title: "since or for?", html: '<div class="field"><label for="sfw">Time expression</label><input type="text" id="sfw" value="five years"></div><div class="row" style="gap:6px;flex-wrap:wrap" id="sfx"></div><div class="out" id="sfo2"></div>',
      init: function (el) {
        var EX = ["five years", "2019", "Monday", "two hours", "last week", "a long time", "morning", "childhood", "three days", "January"];
        $("#sfx", el).innerHTML = EX.map(function (e) { return '<button class="chip">' + e + "</button>"; }).join("");
        function up() {
          var w = $("#sfw", el).value.trim().toLowerCase(), o = $("#sfo2", el);
          if (!w) { o.textContent = "Type a time expression"; return; }
          var period = /^(a|an|one|two|three|four|five|six|seven|eight|nine|ten|many|several|few|\d+)\s+(second|minute|hour|day|week|month|year|decade|centur)|long time|ages|a while/.test(w);
          o.innerHTML = (period ? "for " : "since ") + esc(w) + "<small>" + (period ? "It is a length of time (a period)." : "It is a point in time (when it started).") + "</small>";
        }
        $$("#sfx .chip", el).forEach(function (b) { b.onclick = function () { $("#sfw", el).value = b.textContent; up(); }; });
        $("#sfw", el).oninput = up; up();
      }
    }
    ,
    vocabcards: {
      title: "Word drill", html: '<div class="row" style="gap:6px;justify-content:center"><button class="chip" data-m="s">Synonyms</button><button class="chip" data-m="a">Antonyms</button><button class="chip" data-m="x">Mixed</button></div><div class="big" id="vcq" style="text-align:center;font-size:20px;font-weight:800;margin:10px 0">…</div><div class="opts" id="vco"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="vcs">0</b> / <b id="vcn">0</b></span><button class="btn btn-accent btn-sm" id="vcg">Next</button></div><div class="why" id="vcw" hidden></div>',
      init: function (el) {
        var W = [["abundant", "plentiful", "scarce"], ["candid", "frank", "secretive"], ["diligent", "hardworking", "lazy"], ["obsolete", "outdated", "modern"], ["benevolent", "kind", "cruel"], ["eloquent", "fluent", "inarticulate"], ["meticulous", "careful", "careless"], ["ferocious", "fierce", "gentle"], ["vivid", "bright", "dull"], ["prudent", "wise", "rash"], ["hostile", "unfriendly", "friendly"], ["timid", "shy", "bold"], ["transparent", "clear", "opaque"], ["humble", "modest", "proud"], ["artificial", "man-made", "natural"], ["generous", "giving", "mean"], ["ancient", "old", "modern"], ["brief", "short", "lengthy"], ["vacant", "empty", "occupied"], ["rigid", "stiff", "flexible"], ["affluent", "rich", "poor"], ["fragile", "delicate", "sturdy"], ["lethargic", "sluggish", "energetic"], ["obstinate", "stubborn", "flexible"], ["tranquil", "calm", "noisy"], ["genuine", "real", "fake"], ["hasty", "hurried", "slow"], ["frugal", "thrifty", "wasteful"], ["vague", "unclear", "precise"], ["ample", "enough", "insufficient"]], mode = "x", sc = 0, n = 0;
        function round() {
          var i = Math.floor(Math.random() * W.length), w = W[i], m = mode === "x" ? (Math.random() < 0.5 ? "s" : "a") : mode, ans = m === "s" ? w[1] : w[2], trap = m === "s" ? w[2] : w[1], pool = [ans, trap], done = false;
          while (pool.length < 4) { var r = W[Math.floor(Math.random() * W.length)][1 + Math.floor(Math.random() * 2)]; if (pool.indexOf(r) < 0) pool.push(r); }
          var ord = shuffle(4);
          $("#vcq", el).innerHTML = (m === "s" ? "Synonym of " : "Antonym of ") + "<u>" + w[0].toUpperCase() + "</u>"; $("#vcw", el).hidden = true;
          $("#vco", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + pool[k] + "</button>"; }).join("");
          $$("#vco .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#vco .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#vcs", el).textContent = sc; $("#vcn", el).textContent = n; $("#vcw", el).hidden = false; $("#vcw", el).textContent = w[0] + ": same as “" + w[1] + "”, opposite of “" + w[2] + "”."; }; });
        }
        $$(".chip[data-m]", el).forEach(function (b) { b.onclick = function () { mode = b.getAttribute("data-m"); round(); }; });
        $("#vcg", el).onclick = round; round();
      }
    },
    prefixopp: {
      title: "Opposite by prefix", html: '<div class="field"><label for="pxw">Word</label><input type="text" id="pxw" value="possible"></div><div class="out" id="pxo"></div>',
      init: function (el) {
        var KNOWN = { possible: "im", mature: "im", patient: "im", polite: "im", balance: "im", perfect: "im", legal: "il", logical: "il", literate: "il", regular: "ir", responsible: "ir", relevant: "ir", honest: "dis", agree: "dis", appear: "dis", like: "dis", obey: "dis", happy: "un", kind: "un", fair: "un", able: "un", usual: "un", correct: "in", complete: "in", visible: "in", direct: "in", formal: "in", sense: "non", violent: "non", understand: "mis", lead: "mis" };
        function up() {
          var w = $("#pxw", el).value.trim().toLowerCase(), o = $("#pxo", el), p = KNOWN[w], why;
          if (!w) { o.textContent = "Type a word"; return; }
          if (!p) { p = /^[bmp]/.test(w) ? "im" : /^l/.test(w) ? "il" : /^r/.test(w) ? "ir" : "un"; why = "Best guess from the first letter — check a dictionary."; }
          else why = { im: "im- before b, m, p.", il: "il- before l.", ir: "ir- before r.", dis: "dis- with many verbs and some adjectives.", un: "un- is the most common.", "in": "in- with many Latin-based words.", non: "non- means simply ‘not’.", mis: "mis- means ‘wrongly’." }[p];
          o.innerHTML = p + w + "<small>" + why + "</small>";
        }
        $("#pxw", el).oninput = up; up();
      }
    },
    rootfind: {
      title: "Word roots", html: '<div class="field"><label for="rtk">Root</label><select id="rtk"></select></div><div class="out" id="rto2"></div>',
      init: function (el) {
        var R = [["bene", "good", "benevolent, benefit, benefactor"], ["mal", "bad", "malice, malfunction, malnutrition"], ["chron", "time", "chronic, chronology, synchronise"], ["loqu / locu", "speak", "eloquent, loquacious, elocution"], ["vid / vis", "see", "vivid, visible, vision"], ["aud", "hear", "audible, audience, audit"], ["port", "carry", "transport, portable, export"], ["scrib / script", "write", "describe, manuscript, inscription"], ["bio", "life", "biology, biography, antibiotic"], ["phil", "love", "philosophy, philanthropy"], ["path", "feeling", "sympathy, apathy, empathy"], ["omni", "all", "omnipresent, omnivore, omnipotent"], ["anti", "against", "antidote, antisocial"], ["ante", "before", "antecedent, anteroom"], ["poly", "many", "polygon, polyglot"], ["mono", "one", "monotonous, monopoly"]];
        $("#rtk", el).innerHTML = R.map(function (r, i) { return '<option value="' + i + '">' + r[0] + "</option>"; }).join("");
        function up() { var r = R[+$("#rtk", el).value]; $("#rto2", el).innerHTML = r[0] + " = " + r[1] + "<small>Words: " + r[2] + ".</small>"; }
        $("#rtk", el).onchange = up; up();
      }
    }
    ,
    owsdrill: {
      title: "One-word drill", html: '<div class="big" id="owq" style="text-align:center;font-size:18px;font-weight:800;margin:6px 0">…</div><div class="opts" id="owo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="ows">0</b> / <b id="own">0</b></span><button class="btn btn-accent btn-sm" id="owg">Next</button></div><div class="why" id="oww" hidden></div>',
      init: function (el) {
        var W = [["killing of one's father", "patricide", "cide"], ["killing of one's mother", "matricide", "cide"], ["killing of one's brother", "fratricide", "cide"], ["killing of a human being", "homicide", "cide"], ["killing of a whole people", "genocide", "cide"], ["fear of heights", "acrophobia", "phobia"], ["fear of water", "hydrophobia", "phobia"], ["fear of closed spaces", "claustrophobia", "phobia"], ["fear of open or crowded places", "agoraphobia", "phobia"], ["rule by the people", "democracy", "cracy"], ["rule by one person with total power", "autocracy", "cracy"], ["rule by the rich", "plutocracy", "cracy"], ["rule by officials", "bureaucracy", "cracy"], ["study of the stars", "astronomy", "logy"], ["study of rocks and the earth", "geology", "logy"], ["study of plants", "botany", "logy"], ["study of birds", "ornithology", "logy"], ["a place where birds are kept", "aviary", "place"], ["a place where bees are kept", "apiary", "place"], ["a place where fish are kept", "aquarium", "place"], ["a place where dogs are kept", "kennel", "place"], ["one who knows many languages", "polyglot", "person"], ["one who walks in sleep", "somnambulist", "person"], ["one who cannot sleep", "insomniac", "person"], ["one who loves mankind", "philanthropist", "person"], ["one who hates mankind", "misanthrope", "person"], ["one who does not believe in God", "atheist", "person"], ["one who is not sure God exists", "agnostic", "person"], ["handwriting that cannot be read", "illegible", "in"], ["that which cannot be erased", "indelible", "in"], ["that which cannot be heard", "inaudible", "in"], ["not qualified to be chosen", "ineligible", "in"]], sc = 0, n = 0;
        function round() {
          var i = Math.floor(Math.random() * W.length), w = W[i], same = W.filter(function (x) { return x[2] === w[2] && x !== w; }), pool = [w[1]], done = false;
          shuffle(same.length).forEach(function (k) { if (pool.length < 4) pool.push(same[k][1]); });
          while (pool.length < 4) { var r = W[Math.floor(Math.random() * W.length)][1]; if (pool.indexOf(r) < 0) pool.push(r); }
          var ord = shuffle(4);
          $("#owq", el).textContent = w[0][0].toUpperCase() + w[0].slice(1) + "?"; $("#oww", el).hidden = true;
          $("#owo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + pool[k] + "</button>"; }).join("");
          $$("#owo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#owo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#ows", el).textContent = sc; $("#own", el).textContent = n; $("#oww", el).hidden = false; $("#oww", el).textContent = w[1] + " — " + w[0] + "."; }; });
        }
        $("#owg", el).onclick = round; round();
      }
    },
    owsparts: {
      title: "Word-part decoder", html: '<div class="field"><label for="opw">Type a word</label><input type="text" id="opw" value="claustrophobia"></div><div class="out" id="opo"></div>',
      init: function (el) {
        var PARTS = [["cide", "killing"], ["phobia", "fear of"], ["cracy", "rule by"], ["crat", "ruler / supporter of a kind of rule"], ["logy", "study of"], ["nomy", "law or study of"], ["ist", "a person who"], ["ian", "a person who"], ["vore", "eater of"], ["graphy", "writing about"], ["phile", "lover of"], ["auto", "self"], ["bio", "life"], ["poly", "many"], ["mono", "one"], ["omni", "all"], ["homo", "same"], ["hetero", "different"], ["patri", "father"], ["matri", "mother"], ["frat", "brother"], ["hydro", "water"], ["acro", "height"], ["claustro", "closed space"], ["agora", "open place"], ["demo", "people"], ["pluto", "wealth"], ["astro", "star"], ["geo", "earth"], ["avi", "bird"], ["api", "bee"], ["herbi", "plant"], ["carni", "flesh"], ["somn", "sleep"], ["ambul", "walk"], ["phil", "love"], ["mis", "hate / wrong"], ["anthrop", "mankind"], ["theo", "God"], ["glot", "tongue / language"]];
        function up() {
          var w = $("#opw", el).value.trim().toLowerCase(), o = $("#opo", el), found = PARTS.filter(function (p) { return w.indexOf(p[0]) >= 0; });
          found = found.filter(function (p) { return !found.some(function (q) { return q !== p && q[0].length > p[0].length && q[0].indexOf(p[0]) >= 0; }); });
          o.innerHTML = found.length ? found.map(function (p) { return p[0] + " = " + p[1]; }).join(" · ") + "<small>Join the parts to guess the meaning.</small>" : "No common parts found<small>Try words like matricide, polyglot, plutocracy or ornithology.</small>";
        }
        $("#opw", el).oninput = up; up();
      }
    },
    owsbuild: {
      title: "Build the word", html: '<div class="grid2"><div class="field"><label for="obf">Who / what</label><select id="obf"><option value="patri">father</option><option value="matri">mother</option><option value="fratri">brother</option><option value="sorori">sister</option><option value="infanti">infant</option><option value="homi">human being</option><option value="regi">king</option><option value="geno">a whole people</option></select></div><div class="field"><label for="obs">Ending</label><select id="obs"><option value="cide">-cide (killing)</option></select></div></div><div class="out" id="obo"></div>',
      init: function (el) {
        function up() { var f = $("#obf", el).value; $("#obo", el).innerHTML = f + "cide<small>Killing of " + $("#obf", el).selectedOptions[0].textContent + (f === "geno" ? "" : "") + ".</small>"; }
        $$("select", el).forEach(function (s) { s.onchange = up; }); up();
      }
    }
    ,
    idiomdrill: {
      title: "Idiom drill", html: '<div class="big" id="idq" style="text-align:center;font-size:20px;font-weight:800;margin:6px 0">…</div><div class="opts" id="ido"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="ids">0</b> / <b id="idn">0</b></span><button class="btn btn-accent btn-sm" id="idg">Next</button></div><div class="why" id="idw" hidden></div>',
      init: function (el, T) {
        var B = T.bank || [], sc = 0, n = 0;
        function round() {
          var i = Math.floor(Math.random() * B.length), w = B[i], pool = [w[1]], done = false;
          while (pool.length < 4) { var r = B[Math.floor(Math.random() * B.length)][1]; if (pool.indexOf(r) < 0) pool.push(r); }
          var ord = shuffle(4);
          $("#idq", el).textContent = "“" + w[0] + "”"; $("#idw", el).hidden = true;
          $("#ido", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(pool[k]) + "</button>"; }).join("");
          $$("#ido .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#ido .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#ids", el).textContent = sc; $("#idn", el).textContent = n; $("#idw", el).hidden = false; $("#idw", el).textContent = "Example: " + w[3]; }; });
        }
        $("#idg", el).onclick = round; if (B.length) round();
      }
    },
    idiomfit: {
      title: "Which idiom fits?", html: '<div id="ifq" style="font-weight:700;line-height:1.5;margin:6px 0">…</div><div class="opts" id="ifo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="ifs">0</b> / <b id="ifn">0</b></span><button class="btn btn-accent btn-sm" id="ifg">Next</button></div><div class="why" id="ifw" hidden></div>',
      init: function (el, T) {
        var B = (T.bank || []).filter(function (b) { return b[3].toLowerCase().indexOf(b[0].split(" ")[0]) >= 0; }), sc = 0, n = 0;
        function blank(b) {
          var words = b[0].replace(/one’s/, "").split(/\s+/).filter(Boolean), s = b[3], lo = s.toLowerCase(), mm = new RegExp("(^|[^a-z])" + words[0].replace(/[^a-z]/g, ""), "i").exec(s), start = mm ? mm.index + mm[1].length : -1, lastW = words[words.length - 1], end = lo.lastIndexOf(lastW); if (end < start) end = -1;
          if (start < 0 || end < 0) return null;
          end += lastW.length; while (end < s.length && /[a-z’]/i.test(s[end])) end++;
          return s.slice(0, start) + "_____" + s.slice(end);
        }
        function round() {
          var b, q, t = 0; do { b = B[Math.floor(Math.random() * B.length)]; q = blank(b); t++; } while (!q && t < 30);
          var pool = [b[0]], done = false; while (pool.length < 4) { var r = B[Math.floor(Math.random() * B.length)][0]; if (pool.indexOf(r) < 0) pool.push(r); }
          var ord = shuffle(4);
          $("#ifq", el).textContent = q; $("#ifw", el).hidden = true;
          $("#ifo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(pool[k]) + "</button>"; }).join("");
          $$("#ifo .opt", el).forEach(function (bt) { bt.onclick = function () { if (done) return; done = true; n++; var ok = bt.getAttribute("data-ok") === "1"; if (ok) sc++; bt.classList.add(ok ? "right" : "wrong"); $$("#ifo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#ifs", el).textContent = sc; $("#ifn", el).textContent = n; $("#ifw", el).hidden = false; $("#ifw", el).textContent = "“" + b[0] + "” = " + b[1] + "."; }; });
        }
        $("#ifg", el).onclick = round; if (B.length) round();
      }
    },
    idiomtheme: {
      title: "Idioms by theme", html: '<div class="row" id="itc" style="gap:6px;flex-wrap:wrap"></div><div class="tscroll"><table class="pt" id="itt"></table></div>',
      init: function (el, T) {
        var B = T.bank || [], th = ["secrets", "talk", "time", "effort", "feelings", "trouble", "money"], cur = "time";
        $("#itc", el).innerHTML = th.map(function (t) { return '<button class="chip" data-t="' + t + '">' + t + "</button>"; }).join("");
        function up() {
          $$("#itc .chip", el).forEach(function (c) { c.style.borderColor = c.getAttribute("data-t") === cur ? "var(--accent)" : ""; });
          $("#itt", el).innerHTML = "<tr><th>Idiom</th><th>Meaning</th></tr>" + B.filter(function (b) { return b[2] === cur; }).map(function (b) { return "<tr><td><b>" + esc(b[0]) + "</b></td><td>" + esc(b[1]) + "</td></tr>"; }).join("");
        }
        $$("#itc .chip", el).forEach(function (c) { c.onclick = function () { cur = c.getAttribute("data-t"); up(); }; });
        up();
      }
    }
    ,
    spelldrill: {
      title: "Spelling drill", html: '<p class="note">Pick the correct spelling.</p><div class="opts" id="spo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="sps">0</b> / <b id="spn">0</b></span><button class="btn btn-accent btn-sm" id="spg">Next</button></div><div class="why" id="spw" hidden></div>',
      init: function (el) {
        var W = [["accommodate", "acommodate", "accomodate"], ["necessary", "neccessary", "necesary"], ["separate", "seperate", "seprate"], ["receive", "recieve", "receeve"], ["embarrass", "embarass", "embaras"], ["definitely", "definately", "definitly"], ["government", "goverment", "governmant"], ["occurrence", "occurence", "ocurrence"], ["beginning", "begining", "beggining"], ["pronunciation", "pronounciation", "pronunsiation"], ["committee", "comittee", "commitee"], ["privilege", "priviledge", "privelege"], ["maintenance", "maintainance", "maintenence"], ["guarantee", "garantee", "guarentee"], ["rhythm", "rythm", "rhythem"], ["entrepreneur", "entrepeneur", "enterpreneur"], ["recommend", "recomend", "reccommend"], ["questionnaire", "questionaire", "questionnare"], ["mischievous", "mischievious", "mischevous"], ["colleague", "collegue", "colleage"], ["conscience", "concience", "conscence"], ["millennium", "millenium", "milennium"], ["liaison", "liasion", "liason"], ["occasion", "occassion", "ocassion"], ["achieve", "acheive", "achive"], ["believe", "beleive", "belive"], ["foreign", "foriegn", "forein"], ["weird", "wierd", "weard"], ["environment", "enviroment", "enviornment"], ["tomorrow", "tommorow", "tomorow"], ["argument", "arguement", "argumant"], ["calendar", "calender", "calandar"], ["cemetery", "cemetary", "cematery"], ["parliament", "parliment", "parlament"], ["restaurant", "restaraunt", "resturant"], ["exaggerate", "exagerate", "exaggarate"], ["harass", "harrass", "haras"], ["independent", "independant", "indipendent"], ["noticeable", "noticable", "noticeble"], ["professor", "proffesor", "proffessor"]], sc = 0, n = 0;
        function round() {
          var w = W[Math.floor(Math.random() * W.length)], ord = shuffle(3), done = false, cap = function (s) { return s[0].toUpperCase() + s.slice(1); };
          $("#spw", el).hidden = true;
          $("#spo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + cap(w[k]) + "</button>"; }).join("");
          $$("#spo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#spo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#sps", el).textContent = sc; $("#spn", el).textContent = n; $("#spw", el).hidden = false; $("#spw", el).textContent = "Correct: " + w[0] + "."; }; });
        }
        $("#spg", el).onclick = round; round();
      }
    },
    ierule: {
      title: "ie or ei?", html: '<div class="field"><label for="iew">Type a word with ie or ei</label><input type="text" id="iew" value="receive"></div><div class="out" id="ieo"></div>',
      init: function (el) {
        var EXC = ["seize", "weird", "protein", "either", "neither", "their", "foreign", "leisure", "height", "weight", "eight", "vein", "reign", "heir", "forfeit", "counterfeit", "caffeine", "science", "species", "sufficient", "efficient", "ancient", "society", "conscience"];
        function up() {
          var w = $("#iew", el).value.trim().toLowerCase(), o = $("#ieo", el), m = w.match(/(.)?(ie|ei)/);
          if (!m) { o.textContent = "Type a word containing ie or ei"; return; }
          if (EXC.indexOf(w) >= 0) { o.innerHTML = w + " — an exception<small>Learn it by heart; it does not follow “i before e except after c”.</small>"; return; }
          var afterC = m[1] === "c", rule = afterC ? "ei" : "ie";
          o.innerHTML = (m[2] === rule ? "Follows the rule ✓" : "Check this spelling") + "<small>" + (afterC ? "After c, write ei (receive, ceiling)." : "Not after c, write ie (believe, piece).") + " Exceptions include seize, weird, either, neither, foreign.</small>";
        }
        $("#iew", el).oninput = up; up();
      }
    },
    suffixjoin: {
      title: "Add an ending", html: '<div class="grid2"><div class="field"><label for="sjw">Word</label><input type="text" id="sjw" value="begin"></div><div class="field"><label for="sjs">Ending</label><select id="sjs"><option>ing</option><option>ed</option><option>er</option><option>able</option><option>ness</option><option>ful</option><option>ment</option><option>ly</option></select></div></div><div class="out" id="sjo"></div>',
      init: function (el) {
        var STRESSED = ["begin", "refer", "occur", "prefer", "admit", "commit", "permit", "forget", "regret", "control", "compel", "excel", "omit", "submit", "transfer", "deter", "equip", "upset", "propel", "rebel"], BR_L = ["travel", "cancel", "label", "level", "model", "quarrel", "signal", "marvel", "fuel", "dial", "jewel", "total", "counsel"];
        function up() {
          var w = $("#sjw", el).value.trim().toLowerCase(), s = $("#sjs", el).value, o = $("#sjo", el), out, why, V = /^[aeiouy]/.test(s);
          if (!/^[a-z]+$/.test(w)) { o.textContent = "Type one word"; return; }
          if (V && /[^aeiou]e$/.test(w) && !/(ce|ge)$/.test(w + "") ) { out = w.slice(0, -1) + s; why = "Drop the silent e before a vowel ending."; }
          else if (V && /(ce|ge)$/.test(w) && /^(able|ous)/.test(s)) { out = w + s; why = "Keep the e after c or g before -able/-ous to keep the soft sound (noticeable)."; }
          else if (V && /(ce|ge)$/.test(w)) { out = w.slice(0, -1) + s; why = "Drop the silent e before a vowel ending."; }
          else if (/[^aeiou]y$/.test(w) && s !== "ing") { out = w.slice(0, -1) + "i" + s; why = "Consonant + y: change y to i (but keep y before -ing)."; }
          else if (V && (BR_L.indexOf(w) >= 0) && s !== "able") { out = w + "l" + s; why = "British spelling doubles the final l (travelled, cancelled)."; }
          else if (V && /[^aeiou][aeiou][^aeiouwxy]$/.test(w) && ((w.match(/[aeiouy]+/g) || []).length === 1 || STRESSED.indexOf(w) >= 0)) { out = w + w.slice(-1) + s; why = "Stressed last syllable ending consonant-vowel-consonant: double the consonant."; }
          else { out = w + s; why = V ? "No change needed." : "Consonant ending: just add it (hope → hopeful)."; }
          o.innerHTML = w + " + " + s + " = " + out + "<small>" + why + "</small>";
        }
        $$("input,select", el).forEach(function (x) { x.oninput = up; }); up();
      }
    }
    ,
    impgame: {
      title: "Improve it", html: '<div id="igq" style="font-weight:700;line-height:1.5;margin:6px 0">…</div><div class="opts" id="igo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="igs">0</b> / <b id="ign">0</b></span><button class="btn btn-accent btn-sm" id="igg">Next</button></div><div class="why" id="igw" hidden></div>',
      init: function (el) {
        var Q = [["She is good “in maths”.", ["at maths", "on maths", "with maths"], "good at."], ["He “enjoys to swim”.", ["enjoys swimming", "enjoy swimming", "enjoys swim"], "enjoy + -ing."], ["“No sooner did he leave when” it rained.", ["No sooner did he leave than", "No sooner he left when", "No sooner had he leave than"], "no sooner … than."], ["The number of cars “are rising”.", ["is rising", "were rising", "have risen"], "The number of: singular."], ["We “reached at” the station late.", ["reached", "reached to", "reached on"], "No preposition after reach."], ["He gave me “many advices”.", ["much advice", "many advice", "much advices"], "Advice is uncountable."], ["“Walk fast lest you will miss” the bus.", ["Walk fast lest you should miss", "Walk fast lest you do not miss", "Walk fast unless you miss"], "lest … should."], ["She “has gone to Delhi last week”.", ["went to Delhi last week", "had gone to Delhi last week", "goes to Delhi last week"], "Past time word: simple past."], ["The book is “lying on the table”.", null, "Correct."], ["“Despite of the rain”, we played.", ["Despite the rain", "In spite the rain", "Despite of rain"], "despite (no ‘of’) or in spite of."]], sc = 0, n = 0;
        function round() {
          var q = Q[Math.floor(Math.random() * Q.length)], opts = q[1] ? q[1].concat(["No improvement"]) : ["No improvement", "lying at the table", "laying on the table", "lain on the table"], ord = shuffle(4), done = false;
          $("#igq", el).textContent = q[0]; $("#igw", el).hidden = true;
          $("#igo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(opts[k]) + "</button>"; }).join("");
          $$("#igo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#igo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#igs", el).textContent = sc; $("#ign", el).textContent = n; $("#igw", el).hidden = false; $("#igw", el).textContent = q[2]; }; });
        }
        $("#igg", el).onclick = round; round();
      }
    },
    pairclash: {
      title: "Clashing-pair detector", html: '<div class="field"><label for="pct">Sentence</label><input type="text" id="pct" value="Although he was tired, but he kept working."></div><div class="out" id="pco"></div>',
      init: function (el) {
        var R = [[/\bunless\b[^.]*\b(not|don’t|don't|doesn’t|doesn't|didn’t|didn't|never)\b/i, "“Unless” already means “if not”; remove the extra negative."], [/\b(although|though)\b[^.]*\bbut\b/i, "Use either “although” or “but”, not both."], [/\btoo\b\s+\w+\s+that\b/i, "Use “so … that” or “too … to”, not “too … that”."], [/\bhardly\b[^.]*\bthan\b/i, "“Hardly” pairs with “when”."], [/\bscarcely\b[^.]*\bthan\b/i, "“Scarcely” pairs with “when”."], [/\bno sooner\b[^.]*\bwhen\b/i, "“No sooner” pairs with “than”."], [/\blest\b[^.]*\bnot\b/i, "“Lest” already means “so that … not”; use “lest … should”."], [/\bdespite of\b/i, "Say “despite” or “in spite of”, not “despite of”."], [/\bboth\b[^.]*\bas well as\b/i, "Use “both … and”."], [/\bneither\b[^.]*\bor\b/i, "“Neither” pairs with “nor”."], [/\beither\b[^.]*\bnor\b/i, "“Either” pairs with “or”."], [/\bnot only\b(?![^.]*\bbut also\b)/i, "“Not only” pairs with “but also”."], [/\breason\b[^.]*\bis because\b/i, "Say “the reason is that”, not “because”."], [/\breturn back\b|\brepeat again\b|\bmore better\b|\bmost best\b/i, "Repeated meaning; drop the extra word."]];
        function up() {
          var s = $("#pct", el).value, hit = R.filter(function (r) { return r[0].test(s); }), o = $("#pco", el);
          o.innerHTML = hit.length ? "Clash found<small>" + hit.map(function (h) { return h[1]; }).join(" ") + "</small>" : "No clashing pair found<small>This checks only fixed pairs; other errors may still exist.</small>";
        }
        $("#pct", el).oninput = up; up();
      }
    },
    tensetime: {
      title: "Time word → tense", html: '<div class="field"><label for="ttw">Time word in the sentence</label><select id="ttw"></select></div><div class="out" id="tto"></div>',
      init: function (el) {
        var R = [["yesterday / last week / ago / in 2015", "Simple past", "I met him yesterday."], ["since / for (still going on)", "Present perfect (continuous)", "She has lived here since 2019."], ["already / just / yet / ever / never", "Present perfect", "He has already left."], ["every day / always / usually / often", "Simple present", "She walks every day."], ["now / at present / look! / listen!", "Present continuous", "Look! It is raining."], ["tomorrow / next week / soon", "Simple future (will)", "We will start tomorrow."], ["by the time + past / before + past", "Past perfect for the earlier action", "The train had left before we arrived."], ["by next year / by 2030", "Future perfect", "By 2030 she will have finished."], ["when / while + past (two actions)", "Past continuous for the longer action", "I was reading when he called."]];
        $("#ttw", el).innerHTML = R.map(function (r, i) { return '<option value="' + i + '">' + r[0] + "</option>"; }).join("");
        function up() { var r = R[+$("#ttw", el).value]; $("#tto", el).innerHTML = r[1] + "<small>Example: " + r[2] + "</small>"; }
        $("#ttw", el).onchange = up; up();
      }
    }
    ,
    voicemaker: {
      title: "Voice converter", html: '<div class="grid2"><div class="field"><label for="vms">Subject (doer)</label><select id="vms"><option>I</option><option>We</option><option>You</option><option>He</option><option selected>She</option><option>They</option><option>Ram</option><option>The teacher</option><option>The workers</option></select></div><div class="field"><label for="vmv">Verb</label><select id="vmv"></select></div><div class="field"><label for="vmo">Object</label><select id="vmo"><option>a letter</option><option>the songs</option><option>the bridge</option><option>me</option><option>him</option><option>her</option><option>them</option><option>us</option><option>the boy</option><option>the apples</option></select></div><div class="field"><label for="vmt">Tense</label><select id="vmt"><option value="sp">Simple present</option><option value="pc">Present continuous</option><option value="pp">Present perfect</option><option value="spa">Simple past</option><option value="pac">Past continuous</option><option value="pap">Past perfect</option><option value="sf">Simple future</option><option value="fp">Future perfect</option></select></div></div><div class="out" id="vmout"></div>',
      init: function (el) {
        var V = { write: ["writes", "wrote", "written", "writing"], sing: ["sings", "sang", "sung", "singing"], build: ["builds", "built", "built", "building"], help: ["helps", "helped", "helped", "helping"], teach: ["teaches", "taught", "taught", "teaching"], catch: ["catches", "caught", "caught", "catching"], eat: ["eats", "ate", "eaten", "eating"], take: ["takes", "took", "taken", "taking"], make: ["makes", "made", "made", "making"], see: ["sees", "saw", "seen", "seeing"], call: ["calls", "called", "called", "calling"], punish: ["punishes", "punished", "punished", "punishing"], read: ["reads", "read", "read", "reading"], give: ["gives", "gave", "given", "giving"], buy: ["buys", "bought", "bought", "buying"] };
        $("#vmv", el).innerHTML = Object.keys(V).map(function (k) { return "<option" + (k === "write" ? " selected" : "") + ">" + k + "</option>"; }).join("");
        var OBJ = { I: "me", We: "us", You: "you", He: "him", She: "her", They: "them" }, SUBJ = { me: "I", us: "we", him: "he", her: "she", them: "they" };
        function person(s) { var l = s.toLowerCase(); if (l === "i") return "1s"; if (l === "we" || l === "you" || l === "they" || /s$/.test(l) && /^the /.test(l) && !/glass$/.test(l)) return "pl"; return "3s"; }
        function be(p, t) { return t === "pres" ? (p === "1s" ? "am" : p === "3s" ? "is" : "are") : (p === "pl" ? "were" : "was"); }
        function has(p) { return p === "3s" ? "has" : "have"; }
        function active(s, v, o, t) {
          var p = person(s), f = V[v];
          return s + " " + ({ sp: p === "3s" ? f[0] : v, pc: be(p, "pres") + " " + f[3], pp: has(p) + " " + f[2], spa: f[1], pac: be(p, "past") + " " + f[3], pap: "had " + f[2], sf: "will " + v, fp: "will have " + f[2] }[t]) + " " + o + ".";
        }
        function passive(s, v, o, t) {
          var ns = SUBJ[o] || o, p = person(ns), f = V[v], agent = OBJ[s] || (s === "Ram" ? s : s.replace(/^The /, "the "));
          var aux = { sp: be(p, "pres"), pc: be(p, "pres") + " being", pp: has(p) + " been", spa: be(p, "past"), pac: be(p, "past") + " being", pap: "had been", sf: "will be", fp: "will have been" }[t];
          ns = ns.charAt(0).toUpperCase() + ns.slice(1);
          return ns + " " + aux + " " + f[2] + " by " + agent + ".";
        }
        var PV = ["help", "teach", "catch", "see", "call", "punish"], THING = ["a letter", "the songs", "the bridge", "the apples"];
        function fitVerbs() {
          var o = $("#vmo", el).value, cur = $("#vmv", el).value, list = THING.indexOf(o) < 0 ? PV : o === "the songs" ? ["sing", "write", "read", "make", "teach"] : o === "the bridge" ? ["build", "make", "see"] : o === "the apples" ? ["eat", "buy", "take", "give", "see"] : ["write", "read", "take", "give", "make", "see"];
          $("#vmv", el).innerHTML = list.map(function (k) { return "<option" + (k === cur ? " selected" : "") + ">" + k + "</option>"; }).join("");
        }
        function up() {
          var s = $("#vms", el).value, v = $("#vmv", el).value, o = $("#vmo", el).value, t = $("#vmt", el).value;
          $("#vmout", el).innerHTML = passive(s, v, o, t) + "<small>Active: " + active(s, v, o, t) + " The tense stays the same; the helping verb agrees with the new subject.</small>";
        }
        $$("select", el).forEach(function (x) { x.onchange = up; }); $("#vmo", el).onchange = function () { fitVerbs(); up(); }; fitVerbs(); up();
      }
    },
    voicetable: {
      title: "Passive helping verbs", html: '<div class="field"><label for="vtt">Tense</label><select id="vtt"><option value="0">Simple present</option><option value="1">Present continuous</option><option value="2">Present perfect</option><option value="3">Simple past</option><option value="4">Past continuous</option><option value="5">Past perfect</option><option value="6">Simple future</option><option value="7">Future perfect</option><option value="8">Modal (can / must / should)</option></select></div><div class="out" id="vto"></div>',
      init: function (el) {
        var R = [["is / am / are + V3", "The work is done."], ["is / am / are being + V3", "The work is being done."], ["has / have been + V3", "The work has been done."], ["was / were + V3", "The work was done."], ["was / were being + V3", "The work was being done."], ["had been + V3", "The work had been done."], ["will be + V3", "The work will be done."], ["will have been + V3", "The work will have been done."], ["modal + be + V3", "The work must be done."]];
        function up() { var r = R[+$("#vtt", el).value]; $("#vto", el).innerHTML = r[0] + "<small>Example: " + r[1] + " (Present perfect continuous and future continuous are not usually changed to passive.)</small>"; }
        $("#vtt", el).onchange = up; up();
      }
    },
    voicegame: {
      title: "Pick the passive", html: '<div id="vgq2" style="font-weight:700;margin:6px 0">…</div><div class="opts" id="vgo2"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="vgs2">0</b> / <b id="vgn2">0</b></span><button class="btn btn-accent btn-sm" id="vgg2">Next</button></div><div class="why" id="vgw2" hidden></div>',
      init: function (el) {
        var Q = [["She bakes cakes.", "Cakes are baked by her.", ["Cakes is baked by her.", "Cakes were baked by her.", "Cakes are being baked by her."]], ["The boys are flying kites.", "Kites are being flown by the boys.", ["Kites are flown by the boys.", "Kites were being flown by the boys.", "Kites are being flew by the boys."]], ["He has broken the window.", "The window has been broken by him.", ["The window had been broken by him.", "The window has been broke by him.", "The window was broken by him."]], ["I drew a picture.", "A picture was drawn by me.", ["A picture is drawn by me.", "A picture was drew by me.", "A picture was drawn by I."]], ["They will announce the result.", "The result will be announced by them.", ["The result would be announced by them.", "The result will announced by them.", "The result will be announce by them."]], ["Open the window.", "Let the window be opened.", ["The window is opened.", "Let open the window.", "The window be opened."]], ["Who broke the glass?", "By whom was the glass broken?", ["Who was the glass broken?", "By whom the glass was broken?", "By whom was the glass broke?"]], ["Mohan had sold the car.", "The car had been sold by Mohan.", ["The car has been sold by Mohan.", "The car was sold by Mohan.", "The car had sold by Mohan."]]], sc = 0, n = 0;
        function round() {
          var q = Q[Math.floor(Math.random() * Q.length)], opts = [q[1]].concat(q[2]), ord = shuffle(4), done = false;
          $("#vgq2", el).textContent = "Passive of: " + q[0]; $("#vgw2", el).hidden = true;
          $("#vgo2", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(opts[k]) + "</button>"; }).join("");
          $$("#vgo2 .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#vgo2 .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#vgs2", el).textContent = sc; $("#vgn2", el).textContent = n; $("#vgw2", el).hidden = false; $("#vgw2", el).textContent = q[1]; }; });
        }
        $("#vgg2", el).onclick = round; round();
      }
    }
    ,
    narrator: {
      title: "Indirect speech maker", html: '<p class="note">For simple sentences. The speaker is a man (he); the listener is “me”.</p><div class="field"><label for="nrt">Type</label><select id="nrt"><option value="s">Statement</option><option value="q">Question</option><option value="c">Command</option><option value="r">Request (please)</option></select></div><div class="field"><label for="nrw">Words spoken (by him, to me)</label><input type="text" id="nrw" value="I will meet you tomorrow."></div><div class="out" id="nro"></div>',
      init: function (el) {
        var IRR = { leave: ["left", "left"], go: ["went", "gone"], come: ["came", "come"], see: ["saw", "seen"], eat: ["ate", "eaten"], write: ["wrote", "written"], take: ["took", "taken"], buy: ["bought", "bought"], do: ["did", "done"], get: ["got", "got"], make: ["made", "made"], say: ["said", "said"], tell: ["told", "told"], give: ["gave", "given"], know: ["knew", "known"], meet: ["met", "met"], find: ["found", "found"], think: ["thought", "thought"], bring: ["brought", "brought"], run: ["ran", "run"], have: ["had", "had"], read: ["read", "read"], sing: ["sang", "sung"], swim: ["swam", "swum"], win: ["won", "won"], lose: ["lost", "lost"], sell: ["sold", "sold"], speak: ["spoke", "spoken"], break: ["broke", "broken"], want: ["wanted", "wanted"] };
        function past(v) { v = v.toLowerCase(); if (IRR[v]) return IRR[v][0]; if (/e$/.test(v)) return v + "d"; if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ied"; return v + "ed"; }
        function pp(v) { v = v.toLowerCase(); return IRR[v] ? IRR[v][1] : past(v); }
        var AUX = { am: "was", is: "was", are: "were", will: "would", shall: "should", can: "could", may: "might", has: "had", have: "had", was: "had been", were: "had been" };
        var TW = { now: "then", today: "that day", tonight: "that night", tomorrow: "the next day", yesterday: "the day before", ago: "before", here: "there", "this": "that", these: "those", "next week": "the following week", "last week": "the previous week" };
        var PR = { i: "he", me: "him", my: "his", mine: "his", myself: "himself", your: "my", yours: "mine", yourself: "myself", we: "they", us: "them", our: "their" };
        function shift(s, subjYou) {
          return s.replace(/\b(next week|last week|am|is|are|will|shall|can|may|has|have|was|were|now|today|tonight|tomorrow|yesterday|ago|here|this|these|I|me|my|mine|myself|you|your|yours|yourself|we|us|our)\b/gi, function (m, w, off) {
            var l = m.toLowerCase();
            if (AUX[l]) return AUX[l];
            if (TW[l]) return TW[l];
            if (l === "you") return off === 0 && subjYou ? "I" : "me";
            return PR[l] || m;
          }).replace(/\bhad (\w+)\b/g, function (m, v) { return /^(been|had)$/.test(v) || /ed$|en$/.test(v) || IRR[v] === undefined && !/^(do|go|eat|see)$/.test(v) ? m : "had " + pp(v); });
        }
        function up() {
          var t = $("#nrt", el).value, w = $("#nrw", el).value.trim().replace(/[“”"]/g, ""), o = $("#nro", el), body = w.replace(/[.?!]+$/, ""), res;
          if (!body) { o.textContent = "Type what was said"; return; }
          if (t === "s") {
            var b2 = body.charAt(0) === "I" && body.charAt(1) === " " ? body : body.charAt(0).toLowerCase() + body.slice(1);
            b2 = b2.replace(/^(I|we|you|he|she|they)\s+(\w+)\b/i, function (m, s, v) { var lv = v.toLowerCase(); if (AUX[lv] || /^(do|does|did)$/.test(lv)) return m; return s + " " + (/ed$/.test(lv) || (Object.keys(IRR).some(function (k) { return IRR[k][0] === lv; })) ? "had " + pp(Object.keys(IRR).filter(function (k) { return IRR[k][0] === lv; })[0] || lv.replace(/ed$/, "")) : past(lv.replace(/s$/, ""))); });
            res = "He told me that " + shift(b2, true) + ".";
          } else if (t === "q") {
            var m = body.match(/^(what|where|when|why|who|how|which)\s+(am|is|are|was|were|will|can|do|does|did|have|has)\s+(\w+)\s*(.*)$/i), y = body.match(/^(am|is|are|was|were|will|can|do|does|did|have|has)\s+(\w+)\s*(.*)$/i), lead, aux, subj, rest;
            if (m) { lead = "He asked me " + m[1].toLowerCase() + " "; aux = m[2].toLowerCase(); subj = m[3]; rest = m[4]; }
            else if (y) { lead = "He asked me if "; aux = y[1].toLowerCase(); subj = y[2]; rest = y[3]; }
            if (lead) {
              var S2 = shift(subj, true), verb = rest.split(/\s+/)[0] || "", after = rest.slice(verb.length);
              if (aux === "do" || aux === "does") res = lead + S2 + " " + past(verb) + shift(after);
              else if (aux === "did") res = lead + S2 + " had " + pp(verb) + shift(after);
              else res = lead + S2 + " " + AUX[aux] + " " + shift(rest);
              res += ".";
            } else res = "He asked me " + shift(body) + ".";
          } else {
            var neg = /^(do not|don't|don’t)\s+/i.test(body), core = body.replace(/^(please,?\s*)/i, "").replace(/^(do not|don't|don’t)\s+/i, "").replace(/,?\s*please$/i, "");
            res = "He " + (t === "r" ? "requested" : "told") + " me " + (neg ? "not " : "") + "to " + shift(core.charAt(0).toLowerCase() + core.slice(1)) + ".";
          }
          res = res.replace(/\s+/g, " ").replace(/ \./, ".").replace(/\b(I|he|she|it) were\b/g, "$1 was");
          o.innerHTML = esc(res) + "<small>A helper for simple sentences — always check the result. Universal truths keep their tense.</small>";
        }
        $$("select,input", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    backshift: {
      title: "Tense backshift", html: '<div class="field"><label for="bst">Tense in the direct speech</label><select id="bst"></select></div><div class="out" id="bso"></div>',
      init: function (el) {
        var R = [["Simple present (I play)", "Simple past (he played)"], ["Present continuous (I am playing)", "Past continuous (he was playing)"], ["Present perfect (I have played)", "Past perfect (he had played)"], ["Present perfect continuous (I have been playing)", "Past perfect continuous (he had been playing)"], ["Simple past (I played)", "Past perfect (he had played)"], ["Past continuous (I was playing)", "Past perfect continuous (he had been playing)"], ["will / shall", "would / should"], ["can / may", "could / might"], ["must", "must or had to"], ["Past perfect (I had played)", "No change"]];
        $("#bst", el).innerHTML = R.map(function (r, i) { return '<option value="' + i + '">' + r[0] + "</option>"; }).join("");
        function up() { var r = R[+$("#bst", el).value]; $("#bso", el).innerHTML = r[1] + "<small>Only when the reporting verb is in the past (said). With “says”, keep the tense.</small>"; }
        $("#bst", el).onchange = up; up();
      }
    },
    timewords: {
      title: "Time and place words", html: '<div class="row" id="twc" style="gap:6px;flex-wrap:wrap"></div><div class="out" id="two"></div>',
      init: function (el) {
        var W = [["now", "then"], ["today", "that day"], ["tonight", "that night"], ["tomorrow", "the next day / the following day"], ["yesterday", "the day before / the previous day"], ["next week", "the following week"], ["last week", "the previous week"], ["ago", "before"], ["here", "there"], ["this", "that"], ["these", "those"], ["come", "go (often)"], ["thus", "so"]];
        $("#twc", el).innerHTML = W.map(function (w, i) { return '<button class="chip" data-i="' + i + '">' + w[0] + "</button>"; }).join("");
        $$("#twc .chip", el).forEach(function (b) { b.onclick = function () { var w = W[+b.getAttribute("data-i")]; $("#two", el).innerHTML = w[0] + " → " + w[1] + "<small>These change because the time and place of reporting differ from when the words were spoken.</small>"; }; });
        $("#two", el).innerHTML = "Tap a word<small>Shows its form in indirect speech.</small>";
      }
    }
    ,
    pjarrange: {
      title: "Arrange the paragraph", html: '<p class="note">Tap the sentences in the right order.</p><div id="pjs" class="errparts"></div><div id="pjo2" class="pjorder"></div><div class="row" style="gap:6px"><button class="btn btn-sm" id="pju">Undo</button><button class="btn btn-sm" id="pjn">New paragraph</button></div><div class="out" id="pjout"></div>',
      init: function (el, T) {
        var B = T.bank || [], p, ord, pick;
        function load() { p = B[Math.floor(Math.random() * B.length)].s; ord = shuffle(4); pick = []; up(); }
        function up() {
          $("#pjs", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-k="' + k + '"' + (pick.indexOf(k) >= 0 ? " disabled style=\"opacity:.35\"" : "") + ">" + esc(p[k]) + "</button>"; }).join("");
          $("#pjo2", el).innerHTML = pick.map(function (k, i) { return "<div>" + (i + 1) + ". " + esc(p[k]) + "</div>"; }).join("");
          $$("#pjs .opt", el).forEach(function (b) { b.onclick = function () { var k = +b.getAttribute("data-k"); if (pick.indexOf(k) < 0) pick.push(k); up(); }; });
          var o = $("#pjout", el);
          if (pick.length < 4) o.innerHTML = (4 - pick.length) + " sentence(s) left<small>Start with the sentence that does not depend on any other.</small>";
          else { var ok = pick.every(function (k, i) { return k === i; }); o.innerHTML = (ok ? "Correct order ✓" : "Not quite") + "<small>" + (ok ? "Every link fits." : "Correct order: " + p.map(esc).join(" ")) + "</small>"; }
        }
        $("#pju", el).onclick = function () { pick.pop(); up(); };
        $("#pjn", el).onclick = load; if (B.length) load();
      }
    },
    pjlinks: {
      title: "Link-word spotter", html: '<div class="field"><label for="plt">Sentence</label><input type="text" id="plt" value="So he joined a class at the local pool."></div><div class="out" id="plo"></div>',
      init: function (el) {
        var R = [[/^(so|therefore|thus|hence|as a result)\b/i, "Shows a result — it comes after the cause."], [/^(however|but|yet|still|on the other hand)\b/i, "Shows a contrast — it comes after the idea it contrasts."], [/^(then|next|after that|later|finally|at last|in the end)\b/i, "Shows time order — it continues a sequence."], [/^(first|firstly|to begin with)\b/i, "Often the start of a sequence."], [/^(he|she|it|they|this|these|that|those|his|her|their|its)\b/i, "Starts with a pronoun — it points back to someone or something already named."], [/\balso\b|\btoo\b|\bmoreover\b|\bfurthermore\b/i, "Adds a point — it comes after a similar point."], [/\bfor example\b|\bfor instance\b/i, "Gives an example — it comes after the general idea."]];
        function up() {
          var s = $("#plt", el).value.trim(), h = R.filter(function (r) { return r[0].test(s); }), o = $("#plo", el);
          o.innerHTML = h.length ? "Not an opener<small>" + h.map(function (x) { return x[1]; }).join(" ") + "</small>" : "Could be an opener<small>No pronoun or link word at the start; check whether it introduces the topic.</small>";
        }
        $("#plt", el).oninput = up; up();
      }
    },
    pjgame: {
      title: "Find the opening sentence", html: '<div class="errparts" id="pgo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="pgs">0</b> / <b id="pgn">0</b></span><button class="btn btn-accent btn-sm" id="pgg">Next</button></div><div class="why" id="pgw" hidden></div>',
      init: function (el, T) {
        var B = T.bank || [], sc = 0, n = 0;
        function round() {
          var p = B[Math.floor(Math.random() * B.length)].s, ord = shuffle(4), done = false;
          $("#pgw", el).hidden = true;
          $("#pgo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(p[k]) + "</button>"; }).join("");
          $$("#pgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#pgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#pgs", el).textContent = sc; $("#pgn", el).textContent = n; $("#pgw", el).hidden = false; $("#pgw", el).textContent = "Full order: " + p.join(" "); }; });
        }
        $("#pgg", el).onclick = round; if (B.length) round();
      }
    }
    ,
    clozepass: {
      title: "Fill the passage", html: '<div class="field"><label for="czp">Passage</label><select id="czp"></select></div><div id="czt" class="cztext"></div><div class="row" style="gap:6px"><button class="btn btn-accent btn-sm" id="czc">Check answers</button></div><div class="out" id="czo"></div>',
      init: function (el, T) {
        var B = T.bank || [];
        $("#czp", el).innerHTML = B.map(function (p, i) { return '<option value="' + i + '">Passage ' + (i + 1) + "</option>"; }).join("");
        function load() {
          var p = B[+$("#czp", el).value], h = esc(p.t);
          p.b.forEach(function (b, k) { var ord = shuffle(4); h = h.replace("(" + (k + 1) + ")", '<select data-k="' + k + '" aria-label="Blank ' + (k + 1) + '"><option value="">(' + (k + 1) + ")</option>" + ord.map(function (j) { return '<option value="' + j + '">' + esc(b[j]) + "</option>"; }).join("") + "</select>"); });
          $("#czt", el).innerHTML = h; $("#czo", el).innerHTML = "Choose a word for each blank<small>Then press Check answers.</small>";
        }
        $("#czc", el).onclick = function () {
          var p = B[+$("#czp", el).value], right = 0, notes = [];
          $$("#czt select", el).forEach(function (s) { var k = +s.getAttribute("data-k"), ok = s.value === "0"; if (ok) right++; s.style.borderColor = s.value === "" ? "" : ok ? "var(--mint-fg)" : "var(--red-fg)"; if (!ok) notes.push("(" + (k + 1) + ") " + p.b[k][0] + " — " + p.b[k][4]); });
          $("#czo", el).innerHTML = right + " of 5 correct<small>" + (notes.length ? notes.map(esc).join(" ") : "All blanks are right.") + "</small>";
        };
        $("#czp", el).onchange = load; if (B.length) load();
      }
    },
    blankpos: {
      title: "What fits this blank?", html: '<div class="field"><label for="bpw">Word just before the blank</label><input type="text" id="bpw" value="has"></div><div class="row" style="gap:6px;flex-wrap:wrap" id="bpx"></div><div class="out" id="bpo"></div>',
      init: function (el) {
        var R = [[/^(a|an|the|this|that|my|your|his|her|their|our|its)$/, "A noun, or an adjective + noun", "a great help · the river"], [/^(very|too|so|quite|more|most|less|rather)$/, "An adjective or adverb", "very patient · so quickly"], [/^(can|could|will|would|shall|should|may|might|must|to|do|does|did)$/, "The base form of a verb", "can send · to start"], [/^(has|have|had)$/, "A past participle (V3)", "has changed · had built"], [/^(is|am|are|was|were|be|been|being)$/, "An adjective, a V3 (passive) or a verb + -ing", "been important · was built · is running"], [/^(stop|stopped|enjoy|enjoys|avoid|avoided|finish|finished|mind|keep|kept|suggest|suggested)$/, "A verb + -ing", "stop dumping · enjoy reading"], [/^(depend|depends|depended|rely|insist)$/, "on", "depend on"], [/^(of|in|on|at|for|with|by|from|about)$/, "A noun or a verb + -ing", "fond of reading · in the morning"]];
        var EX = ["a", "very", "can", "has", "been", "stop", "depend", "of"];
        $("#bpx", el).innerHTML = EX.map(function (e) { return '<button class="chip">' + e + "</button>"; }).join("");
        function up() { var w = $("#bpw", el).value.trim().toLowerCase(), r = R.filter(function (x) { return x[0].test(w); })[0], o = $("#bpo", el); o.innerHTML = r ? r[1] + "<small>Example: " + r[2] + "</small>" : "Read the word after the blank too<small>Try words like a, very, can, has, been, stop, depend, of.</small>"; }
        $$("#bpx .chip", el).forEach(function (b) { b.onclick = function () { $("#bpw", el).value = b.textContent; up(); }; });
        $("#bpw", el).oninput = up; up();
      }
    }
    ,
    rcreader: {
      title: "Passage practice", html: '<div class="field"><label for="rcp">Passage</label><select id="rcp"></select></div><div id="rct" class="rcpass"></div><div id="rcq"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="rcs">0</b> / <b id="rcn">0</b></span><button class="btn btn-accent btn-sm" id="rcg">Next question</button></div><div class="why" id="rcw" hidden></div>',
      init: function (el, T) {
        var B = T.bank || [], i = 0, sc = 0, n = 0;
        $("#rcp", el).innerHTML = B.map(function (p, k) { return '<option value="' + k + '">' + esc(p.title) + "</option>"; }).join("");
        function show() {
          var P = B[+$("#rcp", el).value], q = P.qs[i % P.qs.length], ord = shuffle(4), done = false;
          $("#rct", el).textContent = P.t; $("#rcw", el).hidden = true;
          $("#rcq", el).innerHTML = '<p style="font-weight:700;margin:8px 0"><span class="tag">' + q[0] + "</span> " + esc(q[1]) + '</p><div class="opts">' + ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(q[2][k]) + "</button>"; }).join("") + "</div>";
          $$("#rcq .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#rcq .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#rcs", el).textContent = sc; $("#rcn", el).textContent = n; $("#rcw", el).hidden = false; $("#rcw", el).textContent = q[3]; }; });
        }
        $("#rcg", el).onclick = function () { i++; show(); };
        $("#rcp", el).onchange = function () { i = 0; show(); };
        if (B.length) show();
      }
    },
    keyfind: {
      title: "Keyword finder", html: '<div class="grid2"><div class="field"><label for="kfp">Passage</label><select id="kfp"></select></div><div class="field"><label for="kfw">Keyword from the question</label><input type="text" id="kfw" value="cool"></div></div><div id="kft" class="rcpass"></div><div class="out" id="kfo"></div>',
      init: function (el, T) {
        var B = T.bank || [];
        $("#kfp", el).innerHTML = B.map(function (p, k) { return '<option value="' + k + '">' + esc(p.title) + "</option>"; }).join("");
        function up() {
          var P = B[+$("#kfp", el).value], w = $("#kfw", el).value.trim().toLowerCase(), S = P.t.match(/[^.!?]+[.!?]+/g) || [P.t], hits = 0;
          $("#kft", el).innerHTML = S.map(function (s) { var on = w.length > 2 && s.toLowerCase().indexOf(w) >= 0; if (on) hits++; return on ? "<mark>" + esc(s) + "</mark>" : esc(s); }).join(" ");
          $("#kfo", el).innerHTML = (w.length > 2 ? hits + " sentence(s) contain “" + esc(w) + "”" : "Type at least three letters") + "<small>Read the highlighted lines and the line before and after them.</small>";
        }
        $("#kfp", el).onchange = up; $("#kfw", el).oninput = up; if (B.length) up();
      }
    },
    qtypeguide: {
      title: "Question type guide", html: '<div class="field"><label for="qtg">The question says…</label><select id="qtg"><option value="0">“What is the main idea / best title…?”</option><option value="1">“According to the passage…”</option><option value="2">“It can be inferred / suggests…”</option><option value="3">“The word X means…”</option><option value="4">“The tone / attitude of the writer is…”</option></select></div><div class="out" id="qto"></div>',
      init: function (el) {
        var R = [["Main idea", "Choose the option that covers the whole passage. Reject options that are only one detail, too broad, or the opposite of the writer’s view."], ["Detail", "Find the keyword in the passage and read that sentence. The answer is usually a paraphrase of it."], ["Inference", "The answer is not written directly, but must follow from the text. Reject anything that needs outside facts."], ["Vocabulary in context", "Put each option in place of the word and reread the sentence. Choose the meaning that fits this passage."], ["Tone", "Look at the writer’s word choices: praise (positive), warnings (critical), facts only (neutral)."]];
        function up() { var r = R[+$("#qtg", el).value]; $("#qto", el).innerHTML = r[0] + "<small>" + r[1] + "</small>"; }
        $("#qtg", el).onchange = up; up();
      }
    }
    ,
    histline: {
      title: "Timeline", html: '<div class="row" id="hlc" style="gap:6px;flex-wrap:wrap"><button class="chip" data-r="a">Ancient</button><button class="chip" data-r="m">Medieval</button><button class="chip" data-r="b">British rule</button><button class="chip" data-r="f">Freedom struggle</button></div><div id="hlz" class="tline"></div>',
      init: function (el, T) {
        var B = T.bank || [], R = { a: [-3000, 1199], m: [1200, 1756], b: [1757, 1904], f: [1905, 1950] }, cur = "f";
        function yr(y) { return y < 0 ? -y + " BCE" : y + (y < 1000 ? " CE" : ""); }
        function up() {
          var r = R[cur];
          $$("#hlc .chip", el).forEach(function (c) { c.style.borderColor = c.getAttribute("data-r") === cur ? "var(--accent)" : ""; });
          $("#hlz", el).innerHTML = B.filter(function (b) { return b[1] >= r[0] && b[1] <= r[1]; }).sort(function (a, b) { return a[1] - b[1]; }).map(function (b) { return "<div><b>" + yr(b[1]) + "</b><span>" + esc(b[0]) + "</span></div>"; }).join("");
        }
        $$("#hlc .chip", el).forEach(function (c) { c.onclick = function () { cur = c.getAttribute("data-r"); up(); }; });
        up();
      }
    },
    histfirst: {
      title: "Which came first?", html: '<div class="opts" id="hfo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="hfs">0</b> / <b id="hfn">0</b></span><button class="btn btn-accent btn-sm" id="hfg">Next</button></div><div class="why" id="hfw" hidden></div>',
      init: function (el, T) {
        var B = T.bank || [], sc = 0, n = 0;
        function yr(y) { return y < 0 ? -y + " BCE" : String(y); }
        function round() {
          var a, b; do { a = B[Math.floor(Math.random() * B.length)]; b = B[Math.floor(Math.random() * B.length)]; } while (a === b || a[1] === b[1]);
          var first = a[1] < b[1] ? a : b, pair = shuffle(2).map(function (k) { return [a, b][k]; }), done = false;
          $("#hfw", el).hidden = true;
          $("#hfo", el).innerHTML = pair.map(function (p) { return '<button class="opt" data-ok="' + (p === first ? 1 : 0) + '">' + esc(p[0]) + "</button>"; }).join("");
          $$("#hfo .opt", el).forEach(function (bt) { bt.onclick = function () { if (done) return; done = true; n++; var ok = bt.getAttribute("data-ok") === "1"; if (ok) sc++; bt.classList.add(ok ? "right" : "wrong"); $$("#hfo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#hfs", el).textContent = sc; $("#hfn", el).textContent = n; $("#hfw", el).hidden = false; $("#hfw", el).textContent = a[0] + ": " + yr(a[1]) + " · " + b[0] + ": " + yr(b[1]); }; });
        }
        $("#hfg", el).onclick = round; if (B.length) round();
      }
    },
    histyear: {
      title: "Name the year", html: '<div class="big" id="hyq" style="text-align:center;font-size:18px;font-weight:800;margin:6px 0">…</div><div class="opts" id="hyo" style="grid-template-columns:repeat(4,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="hys">0</b> / <b id="hyn">0</b></span><button class="btn btn-accent btn-sm" id="hyg">Next</button></div>',
      init: function (el, T) {
        var B = (T.bank || []).filter(function (b) { return b[1] > 1000; }), sc = 0, n = 0;
        function round() {
          var e = B[Math.floor(Math.random() * B.length)], ops = [e[1]], done = false;
          while (ops.length < 4) { var r = B[Math.floor(Math.random() * B.length)][1]; if (ops.indexOf(r) < 0) ops.push(r); }
          var ord = shuffle(4);
          $("#hyq", el).textContent = e[0];
          $("#hyo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + ops[k] + "</button>"; }).join("");
          $$("#hyo .opt", el).forEach(function (bt) { bt.onclick = function () { if (done) return; done = true; n++; var ok = bt.getAttribute("data-ok") === "1"; if (ok) sc++; bt.classList.add(ok ? "right" : "wrong"); $$("#hyo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#hys", el).textContent = sc; $("#hyn", el).textContent = n; }; });
        }
        $("#hyg", el).onclick = round; if (B.length) round();
      }
    }
    ,
    artfind: {
      title: "Article finder", html: '<div class="field"><label for="afq">Article number or keyword</label><input type="text" id="afq" value="21"></div><div class="tscroll"><table class="pt" id="aft"></table></div>',
      init: function (el, T) {
        var B = T.bank || [];
        function up() {
          var q = $("#afq", el).value.trim().toLowerCase(), r = B.filter(function (b) { return !q || String(b[0]).toLowerCase() === q || (q.length > 2 && b[1].toLowerCase().indexOf(q) >= 0); });
          $("#aft", el).innerHTML = "<tr><th>Article</th><th>Subject</th></tr>" + (r.length ? r.map(function (b) { return "<tr><td><b>" + b[0] + "</b></td><td>" + esc(b[1]) + "</td></tr>"; }).join("") : '<tr><td colspan="2">Not in this list of common Articles</td></tr>');
        }
        $("#afq", el).oninput = up; up();
      }
    },
    artquiz: {
      title: "Article quiz", html: '<div class="big" id="aqq" style="text-align:center;font-size:17px;font-weight:800;margin:6px 0">…</div><div class="opts" id="aqo" style="grid-template-columns:repeat(4,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="aqs">0</b> / <b id="aqn">0</b></span><button class="btn btn-accent btn-sm" id="aqg">Next</button></div>',
      init: function (el, T) {
        var B = T.bank || [], sc = 0, n = 0;
        function round() {
          var e = B[Math.floor(Math.random() * B.length)], ops = [e[0]], done = false;
          while (ops.length < 4) { var r = B[Math.floor(Math.random() * B.length)][0]; if (ops.indexOf(r) < 0) ops.push(r); }
          var ord = shuffle(4);
          $("#aqq", el).textContent = e[1] + "?";
          $("#aqo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">Art. ' + ops[k] + "</button>"; }).join("");
          $$("#aqo .opt", el).forEach(function (bt) { bt.onclick = function () { if (done) return; done = true; n++; var ok = bt.getAttribute("data-ok") === "1"; if (ok) sc++; bt.classList.add(ok ? "right" : "wrong"); $$("#aqo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#aqs", el).textContent = sc; $("#aqn", el).textContent = n; }; });
        }
        $("#aqg", el).onclick = round; if (B.length) round();
      }
    },
    polnums: {
      title: "Numbers to remember", html: '<div class="tscroll"><table class="pt"><tr><th>Item</th><th>Number</th></tr><tr><td>Minimum age: Lok Sabha member</td><td>25</td></tr><tr><td>Minimum age: Rajya Sabha member</td><td>30</td></tr><tr><td>Minimum age: President / Vice-President</td><td>35</td></tr><tr><td>Lok Sabha term</td><td>5 years</td></tr><tr><td>Rajya Sabha member term</td><td>6 years (one-third retire every 2 years)</td></tr><tr><td>Rajya Sabha maximum members</td><td>250</td></tr><tr><td>Schedules in the Constitution</td><td>12</td></tr><tr><td>Fundamental Duties</td><td>11</td></tr><tr><td>Fundamental Rights (categories)</td><td>6</td></tr><tr><td>Voting age (since 61st Amendment, 1989)</td><td>18</td></tr></table></div>',
      init: function () {}
    }
    ,
    factquiz: {
      title: "Quick quiz", html: '<div class="big" id="fqq" style="text-align:center;font-size:17px;font-weight:800;margin:6px 0">…</div><div class="opts" id="fqo"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="fqs">0</b> / <b id="fqn">0</b></span><button class="btn btn-accent btn-sm" id="fqg">Next</button></div><div class="why" id="fqw" hidden></div>',
      init: function (el, T) {
        var B = T.facts || [], sc = 0, n = 0, last = -1;
        function round() {
          var i; do { i = Math.floor(Math.random() * B.length); } while (B.length > 1 && i === last); last = i;
          var f = B[i], ops = [f[1]].concat(f[2]), ord = shuffle(ops.length), done = false;
          $("#fqq", el).textContent = f[0]; $("#fqw", el).hidden = true;
          $("#fqo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + esc(ops[k]) + "</button>"; }).join("");
          $$("#fqo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#fqo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#fqs", el).textContent = sc; $("#fqn", el).textContent = n; if (f[3]) { $("#fqw", el).hidden = false; $("#fqw", el).textContent = f[3]; } }; });
        }
        $("#fqg", el).onclick = round; if (B.length) round();
      }
    },
    factcards: {
      title: "Flashcards", html: '<div class="fcard" id="fcc" tabindex="0" role="button" aria-label="Flip card"><div id="fcf"></div></div><div class="row" style="gap:6px;justify-content:center"><button class="btn btn-sm" id="fcp">◀</button><span class="tag" id="fci">1 / 1</span><button class="btn btn-sm" id="fcn">▶</button></div>',
      init: function (el, T) {
        var B = T.facts || [], i = 0, back = false;
        function up() { var f = B[i]; $("#fcf", el).innerHTML = back ? "<b>" + esc(f[1]) + "</b>" + (f[3] ? "<small>" + esc(f[3]) + "</small>" : "") : esc(f[0]) + "<small>Tap to see the answer</small>"; $("#fcc", el).classList.toggle("back", back); $("#fci", el).textContent = (i + 1) + " / " + B.length; }
        $("#fcc", el).onclick = function () { back = !back; up(); };
        $("#fcc", el).onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); back = !back; up(); } };
        $("#fcn", el).onclick = function () { i = (i + 1) % B.length; back = false; up(); };
        $("#fcp", el).onclick = function () { i = (i - 1 + B.length) % B.length; back = false; up(); };
        if (B.length) up();
      }
    },
    atmlayers: {
      title: "Layers of the atmosphere", html: '<div class="tscroll"><table class="pt"><tr><th>Layer</th><th>Height (approx.)</th><th>Key fact</th></tr><tr><td>Exosphere</td><td>above ~600 km</td><td>Thinnest; merges into space</td></tr><tr><td>Thermosphere</td><td>~80–600 km</td><td>Includes the ionosphere, which reflects radio waves</td></tr><tr><td>Mesosphere</td><td>~50–80 km</td><td>Coldest layer; meteors burn up</td></tr><tr><td>Stratosphere</td><td>~12–50 km</td><td>Ozone layer; jets fly in its lower part</td></tr><tr><td>Troposphere</td><td>0–~12 km</td><td>All weather happens here</td></tr></table></div>',
      init: function () {}
    }
    ,
    ratelever: {
      title: "What does the RBI lever do?", html: '<div class="grid2"><div class="field"><label for="rll">Lever</label><select id="rll"><option value="repo">Repo rate</option><option value="rrepo">Reverse repo rate</option><option value="crr">CRR</option><option value="slr">SLR</option></select></div><div class="field"><label for="rld">Change</label><select id="rld"><option value="up">Raise</option><option value="down">Cut</option></select></div></div><div class="tscroll"><table class="pt" id="rlt"></table></div><div class="out" id="rlo"></div>',
      init: function (el) {
        var D = { repo: "the rate at which the RBI lends to banks", rrepo: "the rate the RBI pays banks for money parked with it", crr: "the share of deposits banks must keep with the RBI", slr: "the share of deposits banks must keep in liquid assets" };
        function up() {
          var l = $("#rll", el).value, up_ = $("#rld", el).value === "up", tight = up_;
          var rows = [["Money banks can lend", tight ? "falls ↓" : "rises ↑"], ["Interest on loans", tight ? "rises ↑" : "falls ↓"], ["Spending and demand", tight ? "slow down ↓" : "pick up ↑"], ["Inflation", tight ? "eases ↓" : "may rise ↑"]];
          $("#rlt", el).innerHTML = "<tr><th>Effect</th><th>Direction</th></tr>" + rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("");
          $("#rlo", el).innerHTML = (tight ? "Tight money policy" : "Easy money policy") + "<small>" + ({ repo: "Repo", rrepo: "Reverse repo", crr: "CRR", slr: "SLR" }[l]) + " is " + D[l] + ". " + (tight ? "Raising it is used to fight inflation." : "Cutting it is used to boost growth.") + "</small>";
        }
        $$("select", el).forEach(function (s) { s.onchange = up; }); up();
      }
    }
    ,
    unitlook: {
      title: "Units and instruments", html: '<div class="field"><label for="ulq">Search a quantity, unit or instrument</label><input type="text" id="ulq" value=""></div><div class="tscroll"><table class="pt" id="ult"></table></div>',
      init: function (el) {
        var R = [["Force", "newton (N)", "spring balance"], ["Work / energy", "joule (J)", "—"], ["Power", "watt (W)", "wattmeter"], ["Electric current", "ampere (A)", "ammeter"], ["Potential difference", "volt (V)", "voltmeter"], ["Resistance", "ohm (Ω)", "ohmmeter"], ["Charge", "coulomb (C)", "—"], ["Frequency", "hertz (Hz)", "—"], ["Pressure", "pascal (Pa)", "barometer (air), manometer (gas)"], ["Temperature", "kelvin (K)", "thermometer"], ["Humidity", "— (%)", "hygrometer"], ["Density of liquids", "kg/m³", "hydrometer"], ["Purity of milk", "—", "lactometer"], ["Loudness", "decibel (dB)", "sound level meter"], ["Earthquakes", "Richter scale", "seismograph"], ["Distance travelled by a vehicle", "km", "odometer"], ["Magnetic field", "tesla (T)", "magnetometer"], ["Luminous intensity", "candela (cd)", "photometer"]];
        function up() {
          var q = $("#ulq", el).value.trim().toLowerCase(), r = R.filter(function (x) { return !q || x.join(" ").toLowerCase().indexOf(q) >= 0; });
          $("#ult", el).innerHTML = "<tr><th>Quantity</th><th>SI unit</th><th>Instrument</th></tr>" + r.map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + x[1] + "</td><td>" + x[2] + "</td></tr>"; }).join("");
        }
        $("#ulq", el).oninput = up; up();
      }
    }
    ,
    elemfind: {
      title: "Element finder (1–30)", html: '<div class="field"><label for="efq">Name, symbol or atomic number</label><input type="text" id="efq" value="Fe"></div><div class="out" id="efo"></div>',
      init: function (el) {
        var E = ["Hydrogen H", "Helium He", "Lithium Li", "Beryllium Be", "Boron B", "Carbon C", "Nitrogen N", "Oxygen O", "Fluorine F", "Neon Ne", "Sodium Na", "Magnesium Mg", "Aluminium Al", "Silicon Si", "Phosphorus P", "Sulphur S", "Chlorine Cl", "Argon Ar", "Potassium K", "Calcium Ca", "Scandium Sc", "Titanium Ti", "Vanadium V", "Chromium Cr", "Manganese Mn", "Iron Fe", "Cobalt Co", "Nickel Ni", "Copper Cu", "Zinc Zn"].map(function (s, i) { var p = s.split(" "); return [i + 1, p[0], p[1]]; });
        function up() {
          var q = $("#efq", el).value.trim(), o = $("#efo", el), l = q.toLowerCase(), r = E.filter(function (e) { return String(e[0]) === q || e[2].toLowerCase() === l || e[1].toLowerCase() === l; })[0] || (l.length > 2 ? E.filter(function (e) { return e[1].toLowerCase().indexOf(l) === 0; })[0] : null);
          o.innerHTML = r ? r[1] + " · " + r[2] + " · atomic number " + r[0] + "<small>" + (r[0] <= 20 ? "Electrons in shells (K, L, M, N): " + shells(r[0]) + "." : "A transition element (21–30); its electrons fill an inner shell, so it is not a simple 2-8-8 pattern.") + "</small>" : "Not in elements 1–30<small>Try Fe, 6, sodium or Cu.</small>";
        }
        function shells(z) { var s = [], cap = [2, 8, 8, 2]; for (var i = 0; z > 0 && i < cap.length; i++) { var t = Math.min(z, cap[i]); s.push(t); z -= t; } return s.join(", "); }
        $("#efq", el).oninput = up; up();
      }
    },
    phscale: {
      title: "pH scale", html: '<div class="field"><label for="phv">pH = <b id="phn">7</b></label><input type="range" id="phv" min="0" max="14" value="7"></div><div class="phbar"></div><div class="out" id="pho"></div>',
      init: function (el) {
        var EX = { 0: "battery acid", 1: "stomach acid", 2: "lemon juice", 3: "vinegar", 4: "tomato juice", 5: "black coffee", 6: "milk (slightly acidic)", 7: "pure water", 8: "sea water", 9: "baking soda solution", 10: "milk of magnesia", 11: "ammonia solution", 12: "soapy water", 13: "bleach", 14: "caustic soda (NaOH) solution" };
        function up() { var v = +$("#phv", el).value; $("#phn", el).textContent = v; $("#pho", el).innerHTML = (v < 7 ? "Acidic" : v === 7 ? "Neutral" : "Basic") + "<small>Example near pH " + v + ": " + EX[v] + ". " + (v < 7 ? "Turns blue litmus red." : v > 7 ? "Turns red litmus blue." : "No change in litmus.") + " Values are approximate.</small>"; }
        $("#phv", el).oninput = up; up();
      }
    }
    ,
    vitatable: {
      title: "Vitamins at a glance", html: '<div class="tscroll"><table class="pt"><tr><th>Vitamin</th><th>Good sources</th><th>Lack causes</th></tr><tr><td>A</td><td>carrot, milk, green leafy vegetables</td><td>night blindness</td></tr><tr><td>B1 (thiamine)</td><td>whole grains, pulses</td><td>beriberi</td></tr><tr><td>B3 (niacin)</td><td>meat, nuts, grains</td><td>pellagra</td></tr><tr><td>B12</td><td>milk, eggs, meat</td><td>anaemia</td></tr><tr><td>C</td><td>citrus fruits, amla, tomato</td><td>scurvy</td></tr><tr><td>D</td><td>sunlight, fish oil, egg yolk</td><td>rickets (children), osteomalacia (adults)</td></tr><tr><td>E</td><td>nuts, vegetable oils</td><td>weakness, fertility problems</td></tr><tr><td>K</td><td>green leafy vegetables</td><td>poor blood clotting</td></tr></table></div><p class="note">Fat-soluble: A, D, E, K. Water-soluble: B group and C.</p>',
      init: function () {}
    },
    bloodcheck: {
      title: "Blood donor checker", html: '<div class="grid2"><div class="field"><label for="bcd">Donor</label><select id="bcd"></select></div><div class="field"><label for="bcr">Recipient</label><select id="bcr"></select></div></div><div class="out" id="bco"></div>',
      init: function (el) {
        var G = ["O−", "O+", "A−", "A+", "B−", "B+", "AB−", "AB+"];
        $("#bcd", el).innerHTML = G.map(function (g) { return "<option>" + g + "</option>"; }).join(""); $("#bcr", el).innerHTML = $("#bcd", el).innerHTML; $("#bcr", el).value = "AB+";
        function ag(g) { return { A: /A/.test(g.replace("+", "").replace("−", "")) && g.indexOf("A") === 0 || g.indexOf("AB") === 0, B: g.indexOf("B") >= 0, Rh: g.indexOf("+") >= 0 }; }
        function up() {
          var d = $("#bcd", el).value, r = $("#bcr", el).value, D = ag(d), R = ag(r), ok = (!D.A || R.A) && (!D.B || R.B) && (!D.Rh || R.Rh);
          var can = G.filter(function (x) { var X = ag(x); return (!D.A || X.A) && (!D.B || X.B) && (!D.Rh || X.Rh); });
          $("#bco", el).innerHTML = (ok ? "Compatible ✓" : "Not compatible ✗") + "<small>" + d + " red cells can go to: " + can.join(", ") + ". The recipient must not lack any antigen (A, B, Rh) that the donor has.</small>";
        }
        $$("select", el).forEach(function (s) { s.onchange = up; }); up();
      }
    }
    ,
    daycal: {
      title: "Important days by month", html: '<div class="row" id="dcm" style="gap:4px;flex-wrap:wrap"></div><div id="dcz" class="tline"></div>',
      init: function (el, T) {
        var B = T.bank || [], M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], cur = M[new Date().getMonth()];
        $("#dcm", el).innerHTML = M.map(function (m) { return '<button class="chip" data-m="' + m + '">' + m + "</button>"; }).join("");
        function up() {
          $$("#dcm .chip", el).forEach(function (c) { c.style.borderColor = c.getAttribute("data-m") === cur ? "var(--accent)" : ""; });
          var r = B.filter(function (b) { return b[0] === cur; });
          $("#dcz", el).innerHTML = r.length ? r.map(function (b) { return "<div><b>" + b[1] + " " + b[0] + "</b><span>" + esc(b[2]) + "</span></div>"; }).join("") : "<div><span>No days from this list in " + cur + ".</span></div>";
        }
        $$("#dcm .chip", el).forEach(function (c) { c.onclick = function () { cur = c.getAttribute("data-m"); up(); }; });
        up();
      }
    }
    ,
    schemefind: {
      title: "Scheme finder", html: '<div class="field"><label for="sfq">Search by name, year or area</label><input type="text" id="sfq" value=""></div><div class="tscroll"><table class="pt" id="sft2"></table></div><p class="note">Launch years and aims. Check india.gov.in or pib.gov.in for current amounts.</p>',
      init: function (el, T) {
        var B = T.bank || [];
        function up() {
          var q = $("#sfq", el).value.trim().toLowerCase(), r = B.filter(function (b) { return !q || b.join(" ").toLowerCase().indexOf(q) >= 0; }).sort(function (a, b) { return a[1] - b[1]; });
          $("#sft2", el).innerHTML = "<tr><th>Scheme</th><th>Year</th><th>Aim</th></tr>" + r.map(function (b) { return "<tr><td><b>" + esc(b[0]) + "</b></td><td>" + b[1] + "</td><td>" + esc(b[2]) + "</td></tr>"; }).join("");
        }
        $("#sfq", el).oninput = up; up();
      }
    }
    ,
    catracker: {
      title: "My current-affairs notes", html: '<p class="note">Saved only in this browser. Write who, what, where, when.</p><div class="grid2"><div class="field"><label for="cat2">Tag</label><select id="cat2"><option>Appointment</option><option>Award</option><option>Sports</option><option>Index / ranking</option><option>Scheme</option><option>Science & space</option><option>Summit</option><option>Other</option></select></div><div class="field"><label for="cad">Date</label><input type="date" id="cad"></div></div><div class="field"><label for="cax">Fact</label><input type="text" id="cax" maxlength="200" placeholder="e.g. X appointed as head of Y"></div><div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn btn-accent btn-sm" id="caa">Add note</button><select id="caf" aria-label="Filter"><option value="">All tags</option></select><button class="btn btn-sm" id="cac">Copy all</button></div><div class="tscroll"><table class="pt" id="cal"></table></div><div class="out" id="cao2"></div>',
      init: function (el) {
        var tags = $$("#cat2 option", el).map(function (o) { return o.textContent; });
        $("#caf", el).innerHTML += tags.map(function (t) { return "<option>" + t + "</option>"; }).join("");
        try { $("#cad", el).value = new Date().toISOString().slice(0, 10); } catch (e) {}
        function get() { return store.get("current").notes || []; }
        function put(a) { store.set("current", "notes", a); }
        function up() {
          var f = $("#caf", el).value, N = get().filter(function (n) { return !f || n.t === f; });
          $("#cal", el).innerHTML = "<tr><th>Date</th><th>Tag</th><th>Fact</th><th></th></tr>" + (N.length ? N.map(function (n) { return "<tr><td>" + esc(n.d) + "</td><td>" + esc(n.t) + "</td><td>" + esc(n.x) + '</td><td><button class="btn btn-sm" data-id="' + n.id + '" aria-label="Delete">✕</button></td></tr>'; }).join("") : '<tr><td colspan="4">No notes yet</td></tr>');
          $$("#cal button[data-id]", el).forEach(function (b) { b.onclick = function () { put(get().filter(function (n) { return String(n.id) !== b.getAttribute("data-id"); })); up(); }; });
          $("#cao2", el).innerHTML = get().length + " note(s) saved<small>Revise them weekly; make a one-page summary each month.</small>";
        }
        $("#caa", el).onclick = function () { var x = $("#cax", el).value.trim(); if (!x) return; var a = get(); a.unshift({ id: Date.now(), d: $("#cad", el).value || "", t: $("#cat2", el).value, x: x }); put(a.slice(0, 500)); $("#cax", el).value = ""; up(); };
        $("#cac", el).onclick = function () { var txt = get().map(function (n) { return n.d + " [" + n.t + "] " + n.x; }).join("\n"); try { navigator.clipboard.writeText(txt); $("#cao2", el).innerHTML = "Copied<small>Paste into your notes app.</small>"; } catch (e) { $("#cao2", el).innerHTML = "Copy not available<small>Select the table and copy it by hand.</small>"; } };
        $("#caf", el).onchange = up; up();
      }
    }
    ,
    baseconv: {
      title: "Number system converter", html: '<div class="grid2"><div class="field"><label for="bcv">Number</label><input type="text" id="bcv" value="45"></div><div class="field"><label for="bcb">Its base</label><select id="bcb"><option value="10">Decimal (10)</option><option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="16">Hexadecimal (16)</option></select></div></div><div class="tscroll"><table class="pt" id="bct"></table></div><div class="out" id="bco2"></div>',
      init: function (el) {
        function up() {
          var s = $("#bcv", el).value.trim().toUpperCase(), b = +$("#bcb", el).value, o = $("#bco2", el), digits = "0123456789ABCDEF".slice(0, b);
          if (!s || s.split("").some(function (c) { return digits.indexOf(c) < 0; })) { o.innerHTML = "Not a valid base-" + b + " number<small>Allowed digits: " + digits.split("").join(" ") + "</small>"; $("#bct", el).innerHTML = ""; return; }
          var n = parseInt(s, b);
          if (n > 1e9) { o.textContent = "Use a smaller number"; return; }
          var steps = [], m = n; if (m === 0) steps.push("0 ÷ 2 = 0 r 0"); while (m > 0 && steps.length < 32) { steps.push(m + " ÷ 2 = " + Math.floor(m / 2) + " r " + (m % 2)); m = Math.floor(m / 2); }
          $("#bct", el).innerHTML = "<tr><th>Base</th><th>Value</th></tr><tr><td>Decimal</td><td>" + n + "</td></tr><tr><td>Binary</td><td>" + n.toString(2) + "</td></tr><tr><td>Octal</td><td>" + n.toString(8) + "</td></tr><tr><td>Hexadecimal</td><td>" + n.toString(16).toUpperCase() + "</td></tr>";
          o.innerHTML = "Decimal " + n + " = binary " + n.toString(2) + "<small>Divide by 2 and read remainders bottom-up: " + steps.slice(0, 8).join(" · ") + (steps.length > 8 ? " …" : "") + "</small>";
        }
        $$("input,select", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    storeconv: {
      title: "Storage unit converter", html: '<div class="grid2"><div class="field"><label for="scv">Amount</label><input type="number" id="scv" value="2" min="0"></div><div class="field"><label for="scu">Unit</label><select id="scu"><option value="0">bit</option><option value="1">byte</option><option value="2">KB</option><option value="3">MB</option><option value="4" selected>GB</option><option value="5">TB</option></select></div></div><div class="tscroll"><table class="pt" id="sct"></table></div><p class="note">Uses 1 KB = 1024 bytes, as in exam questions.</p>',
      init: function (el) {
        var U = ["bit", "byte", "KB", "MB", "GB", "TB"];
        function bytes(v, u) { return u === 0 ? v / 8 : v * Math.pow(1024, u - 1); }
        function up() {
          var v = +$("#scv", el).value || 0, u = +$("#scu", el).value, B = bytes(v, u);
          $("#sct", el).innerHTML = "<tr><th>Unit</th><th>Value</th></tr>" + U.map(function (n, i) { var x = i === 0 ? B * 8 : B / Math.pow(1024, i - 1); return "<tr><td>" + n + "</td><td>" + (x >= 1e15 ? x.toExponential(3) : x >= 1 || x === 0 ? fmtN(Math.round(x * 1000) / 1000) : x >= 1e-6 ? String(+x.toPrecision(3)) : x.toExponential(3)) + "</td></tr>"; }).join("");
        }
        $$("input,select", el).forEach(function (x) { x.oninput = up; }); up();
      }
    },
    devgame: {
      title: "Input or output?", html: '<div class="big" id="dvq" style="text-align:center;font-size:20px;font-weight:800;margin:6px 0">…</div><div class="opts" id="dvo" style="grid-template-columns:repeat(3,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="dvs">0</b> / <b id="dvn">0</b></span><button class="btn btn-accent btn-sm" id="dvg">Next</button></div><div class="why" id="dvw" hidden></div>',
      init: function (el) {
        var D = [["Keyboard", 0], ["Mouse", 0], ["Scanner", 0], ["Microphone", 0], ["Webcam", 0], ["Joystick", 0], ["Barcode reader", 0], ["Light pen", 0], ["Monitor", 1], ["Printer", 1], ["Speaker", 1], ["Projector", 1], ["Plotter", 1], ["Headphones", 1], ["Touchscreen", 2], ["Modem", 2], ["Hard disk", 3], ["Pen drive", 3], ["RAM", 3]], L = ["Input", "Output", "Both", "Storage"], sc = 0, n = 0;
        $("#dvo", el).style.gridTemplateColumns = "repeat(2,1fr)";
        function round() {
          var d = D[Math.floor(Math.random() * D.length)], done = false;
          $("#dvq", el).textContent = d[0]; $("#dvw", el).hidden = true;
          $("#dvo", el).innerHTML = L.map(function (l, i) { return '<button class="opt" data-ok="' + (i === d[1] ? 1 : 0) + '">' + l + "</button>"; }).join("");
          $$("#dvo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#dvo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#dvs", el).textContent = sc; $("#dvn", el).textContent = n; $("#dvw", el).hidden = false; $("#dvw", el).textContent = d[0] + " is " + L[d[1]].toLowerCase() + (d[1] === 2 ? " (input and output)." : "."); }; });
        }
        $("#dvg", el).onclick = round; round();
      }
    }
    ,
    shortcutdrill: {
      title: "Shortcut drill", html: '<div class="big" id="sdq2" style="text-align:center;font-size:20px;font-weight:800;margin:6px 0">…</div><div class="opts" id="sdo3" style="grid-template-columns:repeat(2,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="sds">0</b> / <b id="sdn">0</b></span><button class="btn btn-accent btn-sm" id="sdg">Next</button></div>',
      init: function (el) {
        var K = [["Ctrl + C", "Copy"], ["Ctrl + X", "Cut"], ["Ctrl + V", "Paste"], ["Ctrl + Z", "Undo"], ["Ctrl + Y", "Redo"], ["Ctrl + A", "Select all"], ["Ctrl + S", "Save"], ["Ctrl + P", "Print"], ["Ctrl + B", "Bold"], ["Ctrl + I", "Italic"], ["Ctrl + U", "Underline"], ["Ctrl + N", "New file"], ["Ctrl + O", "Open"], ["Ctrl + F", "Find"], ["Ctrl + H", "Replace (Word)"], ["F7", "Spelling check (Word)"], ["F5", "Start slide show (PowerPoint)"], ["Alt + F4", "Close the window"], ["Ctrl + Home", "Go to the start of the document"]], sc = 0, n = 0;
        function round() {
          var i = Math.floor(Math.random() * K.length), rev = Math.random() < 0.5, k = K[i], pool = [i], done = false;
          while (pool.length < 4) { var r = Math.floor(Math.random() * K.length); if (pool.indexOf(r) < 0) pool.push(r); }
          var ord = shuffle(4);
          $("#sdq2", el).textContent = rev ? "Shortcut for: " + k[1] + "?" : k[0] + " = ?";
          $("#sdo3", el).innerHTML = ord.map(function (j) { var q = K[pool[j]]; return '<button class="opt" data-ok="' + (j === 0 ? 1 : 0) + '">' + (rev ? q[0] : q[1]) + "</button>"; }).join("");
          $$("#sdo3 .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#sdo3 .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#sds", el).textContent = sc; $("#sdn", el).textContent = n; }; });
        }
        $("#sdg", el).onclick = round; round();
      }
    },
    minisheet: {
      title: "Mini spreadsheet", html: '<p class="note">Edit the numbers, then type a formula such as =SUM(A1:A3), =AVERAGE(B1:B3), =MAX(A1:C3) or =A1+B2*2.</p><div class="tscroll"><table class="pt msheet" id="mst"></table></div><div class="field"><label for="msf">Formula</label><input type="text" id="msf" value="=SUM(A1:A3)"></div><div class="out" id="mso"></div>',
      init: function (el) {
        var V = [[10, 4, 7], [20, 5, 3], [30, 6, 8]], C = "ABC";
        function draw() {
          $("#mst", el).innerHTML = "<tr><th></th>" + C.split("").map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr>" + V.map(function (row, r) { return "<tr><th>" + (r + 1) + "</th>" + row.map(function (v, c) { return '<td><input type="number" data-r="' + r + '" data-c="' + c + '" value="' + v + '" aria-label="' + C[c] + (r + 1) + '"></td>'; }).join("") + "</tr>"; }).join("");
          $$("#mst input", el).forEach(function (i) { i.oninput = function () { V[+i.getAttribute("data-r")][+i.getAttribute("data-c")] = +i.value || 0; calc(); }; });
        }
        function cell(ref) { var m = ref.match(/^([A-C])([1-3])$/); if (!m) throw new Error("Cells A1 to C3 only"); return V[+m[2] - 1][C.indexOf(m[1])]; }
        function range(a, b) { var A = a.match(/^([A-C])([1-3])$/), B = b.match(/^([A-C])([1-3])$/); if (!A || !B) throw new Error("Use cells A1 to C3"); var out = []; for (var r = Math.min(+A[2], +B[2]); r <= Math.max(+A[2], +B[2]); r++) for (var c = Math.min(C.indexOf(A[1]), C.indexOf(B[1])); c <= Math.max(C.indexOf(A[1]), C.indexOf(B[1])); c++) out.push(V[r - 1][c]); return out; }
        function calc() {
          var f = $("#msf", el).value.trim().toUpperCase().replace(/\s+/g, ""), o = $("#mso", el);
          if (f[0] !== "=") { o.innerHTML = "A formula must start with ="; return; }
          try {
            var e = f.slice(1).replace(/(SUM|AVERAGE|MAX|MIN|COUNT)\(([A-C][1-3]):([A-C][1-3])\)/g, function (_, fn, a, b) { var R = range(a, b), s = R.reduce(function (x, y) { return x + y; }, 0); return "(" + ({ SUM: s, AVERAGE: s / R.length, MAX: Math.max.apply(null, R), MIN: Math.min.apply(null, R), COUNT: R.length }[fn]) + ")"; }).replace(/[A-C][1-3]/g, function (m) { return "(" + cell(m) + ")"; });
            if (!/^[\d.+\-*/()]+$/.test(e)) throw new Error("Use SUM, AVERAGE, MAX, MIN, COUNT, cell names and + − × ÷");
            var v = Function("return " + e)();
            o.innerHTML = f + " → " + fmtN(Math.round(v * 1000) / 1000) + "<small>Excel works out the range first, then the arithmetic (BODMAS).</small>";
          } catch (err) { o.innerHTML = "Check the formula<small>" + esc(err.message) + "</small>"; }
        }
        draw(); $("#msf", el).oninput = calc; calc();
      }
    },
    swtype: {
      title: "What kind of software?", html: '<div class="big" id="swq" style="text-align:center;font-size:20px;font-weight:800;margin:6px 0">…</div><div class="opts" id="swo" style="grid-template-columns:repeat(3,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="sws">0</b> / <b id="swn">0</b></span><button class="btn btn-accent btn-sm" id="swg">Next</button></div>',
      init: function (el) {
        var S = [["Windows", 0], ["Linux", 0], ["Android", 0], ["Device driver", 0], ["MS Word", 1], ["Excel", 1], ["Google Chrome", 1], ["Tally", 1], ["Photoshop", 1], ["Antivirus", 2], ["Disk cleanup", 2], ["Backup tool", 2], ["File compressor (zip)", 2]], L = ["System", "Application", "Utility"], sc = 0, n = 0;
        function round() {
          var s = S[Math.floor(Math.random() * S.length)], done = false;
          $("#swq", el).textContent = s[0];
          $("#swo", el).innerHTML = L.map(function (l, i) { return '<button class="opt" data-ok="' + (i === s[1] ? 1 : 0) + '">' + l + "</button>"; }).join("");
          $$("#swo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#swo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#sws", el).textContent = sc; $("#swn", el).textContent = n; }; });
        }
        $("#swg", el).onclick = round; round();
      }
    }
    ,
    urlparts: {
      title: "Break down a web address", html: '<div class="field"><label for="upu">Web address (URL)</label><input type="text" id="upu" value="https://www.example.gov.in/exams/notice.html?year=2026"></div><div class="tscroll"><table class="pt" id="upt"></table></div>',
      init: function (el) {
        var TLD = { gov: "government", edu: "education", org: "organisation", com: "commercial", net: "network", mil: "military", ac: "academic", "in": "India", uk: "United Kingdom", int: "international organisation" };
        function up() {
          var s = $("#upu", el).value.trim(), u, t = $("#upt", el);
          try { u = new URL(/^[a-z]+:\/\//i.test(s) ? s : "http://" + s); } catch (e) { t.innerHTML = "<tr><td>Not a valid web address</td></tr>"; return; }
          var parts = u.hostname.split("."), ends = parts.slice(-2).filter(function (p) { return TLD[p]; }).map(function (p) { return "." + p + " = " + TLD[p]; });
          t.innerHTML = "<tr><th>Part</th><th>Value</th></tr><tr><td>Protocol</td><td>" + esc(u.protocol.replace(":", "")) + (u.protocol === "https:" ? " (secure)" : "") + "</td></tr><tr><td>Domain</td><td>" + esc(u.hostname) + "</td></tr><tr><td>Domain ending</td><td>" + (ends.join(", ") || esc("." + parts[parts.length - 1])) + "</td></tr><tr><td>Path</td><td>" + esc(u.pathname) + "</td></tr><tr><td>Query</td><td>" + (esc(u.search) || "—") + "</td></tr>";
        }
        $("#upu", el).oninput = up; up();
      }
    },
    emailparts: {
      title: "Email address check", html: '<div class="field"><label for="epe">Email address</label><input type="text" id="epe" value="student.name@example.ac.in"></div><div class="out" id="epo"></div>',
      init: function (el) {
        function up() {
          var e = $("#epe", el).value.trim(), o = $("#epo", el), m = e.match(/^([^@\s]+)@([^@\s]+\.[a-z]{2,})$/i);
          o.innerHTML = m ? "Looks valid<small>User name: " + esc(m[1]) + " · domain: " + esc(m[2]) + ". The “@” separates them.</small>" : "Not a valid email address<small>Format: name@domain.ending — exactly one “@” and no spaces.</small>";
        }
        $("#epe", el).oninput = up; up();
      }
    },
    netacro: {
      title: "Full-form quiz", html: '<div class="big" id="naq" style="text-align:center;font-size:22px;font-weight:800;margin:6px 0">…</div><div class="opts" id="nao"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="nas">0</b> / <b id="nan">0</b></span><button class="btn btn-accent btn-sm" id="nag">Next</button></div>',
      init: function (el) {
        var A = [["WWW", "World Wide Web"], ["HTTP", "HyperText Transfer Protocol"], ["HTML", "HyperText Markup Language"], ["URL", "Uniform Resource Locator"], ["DNS", "Domain Name System"], ["ISP", "Internet Service Provider"], ["IP", "Internet Protocol"], ["FTP", "File Transfer Protocol"], ["SMTP", "Simple Mail Transfer Protocol"], ["POP", "Post Office Protocol"], ["IMAP", "Internet Message Access Protocol"], ["LAN", "Local Area Network"], ["WAN", "Wide Area Network"], ["Wi-Fi", "Wireless Fidelity"], ["PDF", "Portable Document Format"], ["USB", "Universal Serial Bus"], ["OTP", "One-Time Password"], ["VPN", "Virtual Private Network"]], sc = 0, n = 0;
        function round() {
          var i = Math.floor(Math.random() * A.length), pool = [i], done = false;
          while (pool.length < 4) { var r = Math.floor(Math.random() * A.length); if (pool.indexOf(r) < 0) pool.push(r); }
          var ord = shuffle(4);
          $("#naq", el).textContent = A[i][0];
          $("#nao", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + A[pool[k]][1] + "</button>"; }).join("");
          $$("#nao .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#nao .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#nas", el).textContent = sc; $("#nan", el).textContent = n; }; });
        }
        $("#nag", el).onclick = round; round();
      }
    }
    ,
    pwcheck: {
      title: "Password strength checker", html: '<p class="note">Runs only in your browser — nothing you type is sent anywhere. Do not type a real password.</p><div class="field"><label for="pwi">Try a sample password</label><input type="text" id="pwi" value="sunshine2026" autocomplete="off"></div><div class="pwbar"><span id="pwb"></span></div><div class="out" id="pwo"></div>',
      init: function (el) {
        var COMMON = ["password", "123456", "12345678", "qwerty", "abc123", "111111", "iloveyou", "admin", "welcome", "india123", "sunshine", "football", "cricket", "monkey", "dragon", "letmein"];
        function up() {
          var p = $("#pwi", el).value, s = 0, tips = [];
          if (p.length >= 8) s++; else tips.push("use at least 8 characters");
          if (p.length >= 12) s++; else if (p.length >= 8) tips.push("12 or more is better");
          if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; else tips.push("mix upper and lower case");
          if (/\d/.test(p)) s++; else tips.push("add numbers");
          if (/[^A-Za-z0-9]/.test(p)) s++; else tips.push("add a symbol");
          if (COMMON.some(function (c) { return p.toLowerCase().indexOf(c) >= 0; }) || /(.)\1\1/.test(p)) { s = Math.min(s, 1); tips.unshift("avoid common words and repeats"); }
          var L = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"][s], c = ["#d62828", "#d62828", "#f77f00", "#fcbf49", "#43aa8b", "#2a9d8f"][s];
          $("#pwb", el).style.width = (s / 5 * 100) + "%"; $("#pwb", el).style.background = c;
          $("#pwo", el).innerHTML = L + "<small>" + (tips.length ? "To improve: " + tips.join("; ") + "." : "Long, varied and unpredictable.") + "</small>";
        }
        $("#pwi", el).oninput = up; up();
      }
    },
    netsize: {
      title: "Network types by size", html: '<div class="netsz"><div style="--w:22%"><b>PAN</b><small>your devices · Bluetooth</small></div><div style="--w:44%"><b>LAN</b><small>home, office, campus</small></div><div style="--w:70%"><b>MAN</b><small>a city</small></div><div style="--w:100%"><b>WAN</b><small>countries · the Internet</small></div></div>',
      init: function () {}
    },
    threatgame: {
      title: "Name the threat", html: '<div class="big" id="tgq" style="text-align:center;font-size:17px;font-weight:700;line-height:1.5;margin:6px 0">…</div><div class="opts" id="tgo" style="grid-template-columns:repeat(2,1fr)"></div><div class="row" style="justify-content:space-between"><span class="tag indigo">Score <b id="tgs">0</b> / <b id="tgn">0</b></span><button class="btn btn-accent btn-sm" id="tgg">Next</button></div>',
      init: function (el) {
        var T = [["An email says your bank account is blocked and asks for your OTP.", "Phishing"], ["Your files are locked and a message demands money to unlock them.", "Ransomware"], ["A free game you installed secretly opens a back door for attackers.", "Trojan horse"], ["A program spreads from computer to computer over the network on its own.", "Worm"], ["Malicious code attached to a document runs when you open the file.", "Virus"], ["Software quietly records the websites you visit and sends them away.", "Spyware"], ["Thousands of unwanted advertising emails fill your inbox.", "Spam"]], L = ["Phishing", "Ransomware", "Trojan horse", "Worm", "Virus", "Spyware", "Spam"], sc = 0, n = 0;
        function round() {
          var t = T[Math.floor(Math.random() * T.length)], pool = [t[1]], done = false;
          while (pool.length < 4) { var r = L[Math.floor(Math.random() * L.length)]; if (pool.indexOf(r) < 0) pool.push(r); }
          var ord = shuffle(4);
          $("#tgq", el).textContent = t[0];
          $("#tgo", el).innerHTML = ord.map(function (k) { return '<button class="opt" data-ok="' + (k === 0 ? 1 : 0) + '">' + pool[k] + "</button>"; }).join("");
          $$("#tgo .opt", el).forEach(function (b) { b.onclick = function () { if (done) return; done = true; n++; var ok = b.getAttribute("data-ok") === "1"; if (ok) sc++; b.classList.add(ok ? "right" : "wrong"); $$("#tgo .opt", el).forEach(function (x) { if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); $("#tgs", el).textContent = sc; $("#tgn", el).textContent = n; }; });
        }
        $("#tgg", el).onclick = round; round();
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
        '<p class="qtext">' + esc(q.q) + '</p>' + (q.viz ? '<div class="qfig">' + viz(q.viz) + "</div>" : "") + '<div class="opts">' + ord.map(function (k, j) { return '<button class="opt" data-k="' + k + '"><span class="k">' + "ABCD"[j] + "</span>" + esc(q.o[k]) + "</button>"; }).join("") + '</div>' +
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
      $("#qa", pane).innerHTML = '<div class="row" style="justify-content:space-between"><span class="tag indigo">Question ' + (cur + 1) + ' of ' + n + '</span>' + (s.mark ? '<span class="tag" style="background:#EDE9FE;color:#5B21B6">Marked for review</span>' : "") + '</div><p class="qtext">' + esc(q.q) + '</p>' + (q.viz ? '<div class="qfig">' + viz(q.viz) + "</div>" : "") +
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
