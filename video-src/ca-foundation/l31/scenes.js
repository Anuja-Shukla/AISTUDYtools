/* Lesson 3.1 — Statistical Description of Data and Sampling */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Describing Data &amp; Sampling</b>" };
var CL = ["0–20", "20–40", "40–60", "60–80", "80–100"], FR = [1, 2, 7, 7, 3];
var SCENES = [
  introScene("Describing Data<br>and Sampling", "CA Foundation · Quantitative Aptitude · Lesson 3.1", ["Collecting", "Grouping", "Charting", "Sampling"]),
  { tag: "Collecting data", draw: function () {
    return T("Primary or secondary data?") + sp(40) + '<div class="row" style="gap:26px;align-items:stretch">' + cardT("Primary", "First-hand", "your own survey or interviews", 0.15, 340, "var(--teal)") + cardT("Secondary", "Collected by others", "government reports, company data", 0.55, 340, "var(--orange)") + "</div>";
  } },
  { tag: "Classification", draw: function () {
    return T("Four ways to classify data") + sp(30) + grid([["By time", "Chronological", "sales by month"], ["By place", "Geographical", "sales by city"], ["By attribute", "Qualitative", "gender, grade"], ["By value", "Quantitative", "marks, income"]], 2, 0.1, 0.2, 330);
  } },
  { tag: "Frequency distribution", draw: function () {
    return T("Marks of 20 students") + sp(16) + table(["Marks", "Students (f)"], CL.map(function (c, i) { return [c, FR[i]]; }), 0.08, 0.13, null, 420);
  } },
  { tag: "Frequency distribution", draw: function () {
    return T("Anatomy of a class: 40–60") + sp(30) + grid([["Lower limit", "40"], ["Upper limit", "60"], ["Width", "60 − 40 = 20"], ["Mid-value", "(40 + 60) ÷ 2 = 50"]], 2, 0.1, 0.13, 340) + sp(24) + note("Exclusive classes: 60 goes into 60–80", 0.7);
  } },
  { tag: "Cumulative frequency", draw: function () {
    var cf = [1, 3, 10, 17, 20];
    return T("Cumulative frequency: add as you go") + sp(14) + table(["Marks", "f", "Less-than cf"], CL.map(function (c, i) { return [c, FR[i], '<b class="t">' + cf[i] + "</b>"]; }), 0.05, 0.12, 2, 520) + sp(16) + note("10 students scored less than 60", 0.78);
  } },
  { tag: "Charts", draw: function () {
    return T("Histogram: bars touch") + sp(10) + '<div class="row" style="gap:16px">' + note("Bar / pie: categories", 0.05, true) + note("Histogram: continuous classes", 0.35) + "</div>" + sp(16) + vbars(CL, FR, 0.4, { gap: 0, w: 600, h: 270, vals: FR }) + SMALL("area of each bar ∝ frequency", 0.75);
  } },
  { tag: "Charts", draw: function () {
    var p = PLOT2(), s = "", cum = [0, 1, 3, 10, 17, 20], more = [20, 19, 17, 10, 3, 0], g = grow(0.35, 1.6), g2 = grow(0.55, 1.6);
    function path(arr, gg, col) { var n = Math.max(1, Math.round(gg * 5)), d = ""; for (var i = 0; i <= n; i++) d += (i ? "L" : "M") + p.sx(i * 20) + "," + p.sy(arr[i]); return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linejoin="round"/>'; }
    s += path(cum, g, "#1F9A94") + path(more, g2, "#F28C28");
    if (hl(0.75)) s += '<line x1="' + p.sx(60) + '" y1="' + p.sy(10) + '" x2="' + p.sx(60) + '" y2="' + p.sy(0) + '" stroke="#1E2A47" stroke-width="2" stroke-dasharray="5 4"/><circle cx="' + p.sx(60) + '" cy="' + p.sy(10) + '" r="9" fill="#1E2A47"/><text x="' + (p.sx(60) + 12) + '" y="' + (p.sy(0) - 10) + '" font-size="18" font-weight="800" fill="#1E2A47" font-family="Outfit">median = 60</text>';
    return side(T2("Ogives") + sp(12) + note("Less-than ogive", 0.35, true) + sp(10) + note("More-than ogive", 0.55) + sp(16) + eq("They cross at the median", 0.75, 24, "n"), p.frame(s), 300);
  } },
  { tag: "Sampling", draw: function () {
    return T("Census or sample?") + sp(34) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Census", "Every member", "complete, costly, slow", 0.1, 330, "var(--navy)") + cardT("Sample", "Part of it", "quicker and cheaper", 0.32, 330, "var(--teal)") + "</div>" + sp(28) +
      '<div class="row" style="gap:20px">' + note("Population → parameter", 0.62, true) + note("Sample → statistic", 0.78) + "</div>";
  } },
  { tag: "Sampling", draw: function () {
    return T("Random sampling methods") + sp(24) + listOf([["Simple random", "lottery, random numbers"], ["Stratified", "sample from each group"], ["Systematic", "every kth unit"], ["Cluster", "pick whole groups"]], 0.12, 0.17, 760, 25);
  } },
  { tag: "Sampling", draw: function () {
    var start = 7, sh = Math.min(10, Math.max(0, Math.floor((LT - 0.5 * LD) / 0.4) + 1));
    return T("Systematic sample: 50 from 1,000") + sp(20) + boxed("k = 1,000 ÷ 50 = 20", 0.1, 36) + sp(26) +
      '<div class="row" ' + rv(0.45) + '>' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<span class="chip" style="' + (i < sh ? (i ? "" : "background:var(--orange);color:#fff;border-top-color:var(--orange)") : "opacity:.25") + '">' + (start + 20 * i) + "</span>"; }).join("") + '<b class="m" style="font-size:28px">…</b></div>' + SMALL("random start 7, then every 20th", 0.55);
  } },
  { tag: "Sampling", draw: function () {
    return T("Non-random samples and errors") + sp(24) + '<div class="row">' + note("Purposive", 0.05) + note("Quota", 0.1) + note("Convenience", 0.15) + "</div>" + sp(30) +
      '<div class="row" style="gap:22px;align-items:stretch">' + cardT("Sampling error", "Only part studied", "falls as the sample grows", 0.4, 330, "var(--teal)") + cardT("Non-sampling error", "Bias, wrong answers", "can occur even in a census", 0.65, 330, "var(--orange)") + "</div>";
  } },
  mcqScene("Which chart is best for a continuous frequency distribution?", ["Histogram", "Pie chart", "Bar chart with gaps", "Pictogram"], 0, "A histogram's touching bars show continuous classes; bar area shows frequency."),
  recapScene([["Primary vs secondary", "first-hand or not"], ["Classes and cumulative f", "1, 3, 10, 17, 20"], ["Histogram and ogives", "ogives cross at the median"], ["Random sampling", "k = N ÷ n for systematic"]])
];
function PLOT2() {
  var W = 440, H = 320, P = 46, sx = function (x) { return P + (W - P - 16) * x / 100; }, sy = function (y) { return H - P - (H - P - 16) * y / 20; };
  var ax = '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - 8) + '" y2="' + (H - P) + '" stroke="#1E2A47" stroke-width="2"/><line x1="' + P + '" y1="' + (H - P) + '" x2="' + P + '" y2="10" stroke="#1E2A47" stroke-width="2"/>';
  [0, 20, 40, 60, 80, 100].forEach(function (t) { ax += '<text x="' + sx(t) + '" y="' + (H - P + 22) + '" text-anchor="middle" font-size="15" fill="#6B7590" font-family="Outfit">' + t + "</text>"; });
  [0, 10, 20].forEach(function (t) { ax += '<text x="' + (P - 8) + '" y="' + (sy(t) + 5) + '" text-anchor="end" font-size="15" fill="#6B7590" font-family="Outfit">' + t + "</text>"; });
  return { sx: sx, sy: sy, frame: function (inner) { return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" style="background:#fff;border-radius:16px;box-shadow:0 6px 22px -10px rgba(30,42,71,.25)">' + ax + inner + "</svg>"; } };
}
