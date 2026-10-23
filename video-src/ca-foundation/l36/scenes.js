/* Lesson 3.6 — Correlation and Regression */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Correlation &amp; Regression</b>" };
var X = [2, 3, 5, 6, 9], Y = [5, 7, 8, 10, 15];
function scatter(at, opts) {
  opts = opts || {};
  var W = opts.w || 460, H = opts.h || 330, P = 46, sx = function (x) { return P + (W - P - 16) * x / 10; }, sy = function (y) { return H - P - (H - P - 16) * y / 16; }, s = "";
  s += '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - 8) + '" y2="' + (H - P) + '" stroke="#1E2A47" stroke-width="2"/><line x1="' + P + '" y1="' + (H - P) + '" x2="' + P + '" y2="10" stroke="#1E2A47" stroke-width="2"/>';
  [0, 2, 4, 6, 8, 10].forEach(function (t) { s += '<text x="' + sx(t) + '" y="' + (H - P + 22) + '" text-anchor="middle" font-size="15" fill="#6B7590" font-family="Outfit">' + t + "</text>"; });
  [0, 4, 8, 12, 16].forEach(function (t) { s += '<text x="' + (P - 8) + '" y="' + (sy(t) + 5) + '" text-anchor="end" font-size="15" fill="#6B7590" font-family="Outfit">' + t + "</text>"; });
  s += '<text x="' + (W - 10) + '" y="' + (H - P - 8) + '" text-anchor="end" font-size="16" font-weight="700" fill="#6B7590" font-family="Outfit">ads x</text><text x="' + (P + 8) + '" y="22" font-size="16" font-weight="700" fill="#6B7590" font-family="Outfit">sales y</text>';
  if (opts.line) { var g = grow(opts.line, 1.2), x2 = 0.5 + 9.5 * g, f = function (x) { return 9 + 41 / 30 * (x - 5); }; s += '<line x1="' + sx(0.5) + '" y1="' + sy(f(0.5)) + '" x2="' + sx(x2) + '" y2="' + sy(f(x2)) + '" stroke="#F28C28" stroke-width="4"/>'; }
  if (opts.means && hl(opts.means)) s += '<line x1="' + sx(5) + '" y1="' + sy(0) + '" x2="' + sx(5) + '" y2="' + sy(16) + '" stroke="#1E2A47" stroke-dasharray="5 5" stroke-width="2"/><line x1="' + sx(0) + '" y1="' + sy(9) + '" x2="' + sx(10) + '" y2="' + sy(9) + '" stroke="#1E2A47" stroke-dasharray="5 5" stroke-width="2"/><circle cx="' + sx(5) + '" cy="' + sy(9) + '" r="9" fill="#1E2A47"/><text x="' + (sx(5) + 12) + '" y="' + (sy(9) + 26) + '" font-size="17" font-weight="800" fill="#1E2A47" font-family="Outfit">(5, 9)</text>';
  if (opts.est && hl(opts.est)) s += '<line x1="' + sx(7) + '" y1="' + sy(0) + '" x2="' + sx(7) + '" y2="' + sy(11.73) + '" stroke="#17716D" stroke-dasharray="5 5" stroke-width="2"/><line x1="' + sx(0) + '" y1="' + sy(11.73) + '" x2="' + sx(7) + '" y2="' + sy(11.73) + '" stroke="#17716D" stroke-dasharray="5 5" stroke-width="2"/><circle cx="' + sx(7) + '" cy="' + sy(11.73) + '" r="9" fill="#17716D"/>';
  X.forEach(function (x, i) { var q = k((opts.dots || 0) + i * 0.05); s += '<circle cx="' + sx(x) + '" cy="' + sy(Y[i]) + '" r="10" fill="#1F9A94" stroke="#fff" stroke-width="2" opacity="' + q + '"/>'; });
  return '<div ' + rvs(at) + '><svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" style="background:#fff;border-radius:16px;box-shadow:0 6px 22px -10px rgba(30,42,71,.25)">' + s + "</svg></div>";
}
function mini(kind, at, label) {
  var pts = { pos: [[1, 1], [2, 2.2], [3, 2.6], [4, 3.8], [5, 4.6], [6, 5.1]], neg: [[1, 5.1], [2, 4.4], [3, 3.9], [4, 2.7], [5, 2.1], [6, 1]], none: [[1, 3], [2, 1.2], [3, 4.6], [4, 2.2], [5, 4.1], [6, 1.8]] }[kind], s = "";
  pts.forEach(function (p) { s += '<circle cx="' + (p[0] * 30) + '" cy="' + (170 - p[1] * 28) + '" r="8" fill="#1F9A94"/>'; });
  return '<div ' + rvs(at) + ' style="display:flex;flex-direction:column;align-items:center"><svg width="210" height="180" viewBox="0 0 210 180" style="background:#fff;border-radius:14px;box-shadow:0 4px 16px -10px rgba(30,42,71,.3)"><line x1="14" y1="166" x2="200" y2="166" stroke="#C9D2E0" stroke-width="2"/><line x1="14" y1="166" x2="14" y2="10" stroke="#C9D2E0" stroke-width="2"/>' + s + '</svg><b style="font-size:22px;color:var(--navy);margin-top:8px">' + label + "</b></div>";
}
var SCENES = [
  introScene("Correlation and Regression", "CA Foundation · Quantitative Aptitude · Lesson 3.6", ["Scatter", "Pearson's r", "Spearman's R", "Regression lines"]),
  { tag: "Scatter diagrams", draw: function () {
    return T("Read the scatter diagram") + sp(30) + '<div class="row" style="gap:24px">' + mini("pos", 0.1, "Positive") + mini("neg", 0.35, "Negative") + mini("none", 0.65, "Little or none") + "</div>";
  } },
  { tag: "The data", draw: function () {
    return side(T2("Advertising and sales") + sp(12) + table(["x (₹ th)", "y (₹ lakh)"], X.map(function (x, i) { return [x, Y[i]]; }), 0.1, 0.07, null, 300), scatter(0.05, { dots: 0.5 }), 330);
  } },
  { tag: "Karl Pearson's r", draw: function () {
    return T("Karl Pearson's coefficient") + sp(14) + boxed("r = Σdxdy ÷ √(Σdx² × Σdy²)", 0.05, 34) + sp(14) + '<div class="row">' + pill("mean x = 5", 0.3, "l", 22) + pill("mean y = 9", 0.35, "l", 22) + "</div>" + sp(10) +
      table(["dx", "−3", "−2", "0", "1", "4"], [["dy", "−4", "−2", "−1", "1", "6"], ["dx·dy", "12", "4", "0", "1", "16"]], 0.45, 0.08, null, 640) + sp(10) + '<div class="row">' + pill("Σdxdy = 41", 0.7, "", 22) + pill("Σdx² = 30", 0.78, "o", 22) + pill("Σdy² = 58", 0.86, "n", 22) + "</div>";
  } },
  { tag: "Karl Pearson's r", draw: function () {
    return T("Calculate r") + sp(36) + eq("r = 41 ÷ √(30 × 58)", 0.05, 42) + eq("= 41 ÷ √1,740 = 41 ÷ 41.71", 0.3, 40) + sp(16) + boxed("r ≈ 0.983", 0.55, 40) + sp(18) + note("Very strong positive correlation", 0.75, true);
  } },
  { tag: "Reading r", draw: function () {
    var W = 680, x = function (v) { return 40 + (v + 1) * 300; }, g = k(0.05);
    var s = '<rect x="40" y="40" width="600" height="18" rx="9" fill="url(#gr)"/><defs><linearGradient id="gr"><stop offset="0" stop-color="#F28C28"/><stop offset=".5" stop-color="#E3E7EF"/><stop offset="1" stop-color="#1F9A94"/></linearGradient></defs>' +
      [[-1, "−1"], [0, "0"], [1, "+1"]].map(function (t) { return '<text x="' + x(t[0]) + '" y="90" text-anchor="middle" font-size="20" font-weight="800" fill="#1E2A47" font-family="Outfit">' + t[1] + "</text>"; }).join("") +
      '<polygon points="' + (x(0.983) - 10) + ',30 ' + (x(0.983) + 10) + ',30 ' + x(0.983) + ',44" fill="#1E2A47" opacity="' + g + '"/><text x="' + x(0.983) + '" y="22" text-anchor="end" font-size="18" font-weight="800" fill="#1E2A47" font-family="Outfit" opacity="' + g + '">r = 0.983</text>';
    return T("Reading r") + sp(26) + '<svg ' + rv(0.02, 0) + ' width="' + W + '" height="100" viewBox="0 0 ' + W + ' 100">' + s + "</svg>" + sp(20) +
      '<div class="row" style="gap:22px;align-items:stretch">' + cardT("r² ≈ 0.966", "about 97%", "of the variation moves together", 0.3, 340, "var(--teal)") + cardT("But remember", "correlation ≠ causation", "a high r is not proof", 0.7, 360, "var(--orange)") + "</div>";
  } },
  { tag: "Spearman's rank correlation", draw: function () {
    return T("Spearman's R for ranks") + sp(12) + boxed("R = 1 − 6Σd² ÷ [n(n² − 1)]", 0.05, 32) + sp(12) + table(["Trainee", "P", "Q", "R", "S", "T"], [["Judge 1", "1", "2", "3", "4", "5"], ["Judge 2", "2", "1", "3", "5", "4"], ["d²", "1", "1", "0", "1", "1"]], 0.3, 0.06, null, 640) + sp(10) + eq("Σd² = 4 → R = 1 − (6 × 4) ÷ (5 × 24) = 1 − 24 ÷ 120 = <b class='t'>0.8</b>", 0.65, 26);
  } },
  { tag: "Regression", draw: function () {
    return side(T2("Line of y on x") + sp(12) + eq("y − 9 = bᵧₓ(x − 5)", 0.15, 26) + sp(6) + eq("bᵧₓ = Σdxdy ÷ Σdx²", 0.35, 24, "m") + boxed("= 41 ÷ 30 ≈ 1.367", 0.55, 26), scatter(0.0, { line: 0.1 }), 360);
  } },
  { tag: "Regression", draw: function () {
    return side(T2("Estimate sales for x = 7") + sp(12) + eq("y = 9 + 1.367 × (7 − 5)", 0.15, 26) + boxed("y ≈ 11.73", 0.5, 30) + SMALL("about ₹11.7 lakh", 0.6), scatter(0.0, { line: -1, est: 0.35 }), 360);
  } },
  { tag: "Regression", draw: function () {
    return side(T2("Line of x on y") + sp(12) + eq("bₓᵧ = Σdxdy ÷ Σdy²", 0.08, 24, "m") + boxed("= 41 ÷ 58 ≈ 0.707", 0.25, 28) + sp(16) + note("Both lines pass through (5, 9)", 0.6, true), scatter(0.0, { line: -1, means: 0.6 }), 360);
  } },
  { tag: "Linking r and b", draw: function () {
    return T("r from the regression coefficients") + sp(34) + boxed("r = ±√(bᵧₓ × bₓᵧ)", 0.05, 38) + sp(24) + eq("√(1.367 × 0.707) ≈ <b class='t'>0.983</b> ✓", 0.3, 38) + sp(22) + '<div class="row" style="gap:18px">' + note("Same sign as the coefficients", 0.6, true) + note("bᵧₓ × bₓᵧ ≤ 1", 0.8) + "</div>";
  } },
  mcqScene("If bᵧₓ = −0.5 and bₓᵧ = −0.8, what is r?", ["−0.63", "0.63", "−0.40", "0.40"], 0, "r = −√(0.5 × 0.8) = −√0.4 ≈ −0.63: negative, like both coefficients."),
  recapScene([["Karl Pearson's r", "between −1 and +1"], ["Spearman's R", "1 − 6Σd² ÷ n(n² − 1)"], ["Estimate y from x", "line of y on x"], ["Link", "r = ±√(bᵧₓ × bₓᵧ)"]])
];
