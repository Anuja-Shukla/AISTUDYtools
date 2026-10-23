/* Lesson 1.8 — Calculus in Business */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Calculus in Business</b>" };
/* plot f on [x0,x1] with y range [y0,y1]; extra(sx,sy) adds SVG */
function plot(f, x0, x1, y0, y1, prog, col, extra, W, H) {
  W = W || 440; H = H || 300; var P = 36, sx = function (x) { return P + (W - P - 10) * (x - x0) / (x1 - x0); }, sy = function (y) { return H - P - (H - P - 10) * (y - y0) / (y1 - y0); };
  var d = "", n = 80; for (var i = 0; i <= n * prog; i++) { var x = x0 + (x1 - x0) * i / n; d += (i ? "L" : "M") + sx(x).toFixed(1) + "," + sy(f(x)).toFixed(1); }
  var s = '<line x1="' + P + '" y1="' + sy(y0) + '" x2="' + (W - 6) + '" y2="' + sy(y0) + '" stroke="#1E2A47" stroke-width="2"/><line x1="' + P + '" y1="' + sy(y0) + '" x2="' + P + '" y2="6" stroke="#1E2A47" stroke-width="2"/>';
  s += '<path d="' + d + '" fill="none" stroke="' + (col || "#1F9A94") + '" stroke-width="4" stroke-linecap="round"/>' + (extra ? extra(sx, sy) : "");
  return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
}
var SCENES = [
  introScene("Calculus in Business", "CA Foundation · Quantitative Aptitude · Lesson 1.8", ["Derivatives", "Marginal cost", "Maxima &amp; minima", "Integration"]),
  { tag: "Derivatives", draw: function () {
    var f = function (x) { return 0.08 * x * x + 1; }, xt = 2 + 6 * clamp(LT / LD);
    return side(T2("The derivative = slope") + sp(16) + boxed("dy/dx", 0.1, 40) + sp(14) + note("How fast y changes as x changes", 0.3, true) + sp(10) + eq("slope at x = " + xt.toFixed(1) + ": <span class='t'>" + (0.16 * xt).toFixed(2) + "</span>", 0.55, 26),
      plot(f, 0, 10, 0, 9.5, 1, "#1F9A94", function (sx, sy) { var m = 0.16 * xt, y = f(xt); return '<line x1="' + sx(xt - 2) + '" y1="' + sy(y - 2 * m) + '" x2="' + sx(xt + 2) + '" y2="' + sy(y + 2 * m) + '" stroke="#F28C28" stroke-width="3.5"/><circle cx="' + sx(xt) + '" cy="' + sy(y) + '" r="7" fill="#F28C28"/>'; }), 360);
  } },
  { tag: "Derivatives", draw: function () {
    return T("The power rule") + sp(24) + boxed("d/dx (xⁿ) = n·xⁿ⁻¹", 0.08, 42) + sp(20) + '<div class="row">' + note("d/dx (constant) = 0", 0.35, true) + note("term by term for sums", 0.45, true) + "</div>" + sp(22) + eq("d/dx (5x³ + 2x − 7) = <span class='t'>15x² + 2</span>", 0.72, 38);
  } },
  { tag: "Derivatives", draw: function () {
    return T("More standard results") + sp(26) + '<div class="row" style="gap:20px">' + cardT("Exponential", "d/dx eˣ = eˣ", "", 0.08, 300, "var(--teal)") + cardT("Logarithm", "d/dx log x = 1/x", "", 0.25, 300, "var(--orange)") + "</div>" + sp(26) +
      listOf([["Product rule", "(uv)′ = uv′ + vu′"], ["Quotient rule", "(u/v)′ = (vu′ − uv′)/v²"], ["Chain rule", "dy/dx = dy/du · du/dx"]], 0.5, 0.12, 700, 24);
  } },
  { tag: "Marginal cost", draw: function () {
    return T("Marginal cost = dC/dx") + sp(30) + eq("C(x) = 2x² + 20x + 800", 0.45, 42) + down(0.6, "d/dx") + boxed("MC = 4x + 20", 0.68, 40) + sp(20) + note("≈ the cost of one more unit", 0.3);
  } },
  { tag: "Marginal cost", draw: function () {
    var AC = function (x) { return 2 * x + 20 + 800 / x; }, MC = function (x) { return 4 * x + 20; };
    return side(T2("Minimum average cost") + sp(12) + eq("AC = 2x + 20 + 800/x", 0.08, 26) + eq("AC′ = 2 − 800/x² = 0", 0.3, 26) + eq("x = 20", 0.5, 30, "t") + sp(8) + boxed("AC = MC = 100", 0.75, 28),
      plot(AC, 5, 40, 40, 200, ease((LT - 0.05 * LD) / 1.2), "#1F9A94", function (sx, sy) { var d = ""; for (var x = 5; x <= 40; x += 0.5) d += (x === 5 ? "M" : "L") + sx(x) + "," + sy(MC(x)); return '<path d="' + d + '" fill="none" stroke="#F28C28" stroke-width="4" opacity="' + k(0.35) + '"/><circle cx="' + sx(20) + '" cy="' + sy(100) + '" r="8" fill="#1E2A47" opacity="' + k(0.75) + '"/><text x="' + (sx(40) - 4) + '" y="' + (sy(MC(40)) + 22) + '" text-anchor="end" font-size="17" font-weight="700" fill="#F28C28" font-family="Outfit" opacity="' + k(0.35) + '">MC</text><text x="' + sx(6) + '" y="' + (sy(AC(6)) - 6) + '" font-size="17" font-weight="700" fill="#1F9A94" font-family="Outfit">AC</text>'; }), 340);
  } },
  { tag: "Maxima and minima", draw: function () {
    return T("Finding a maximum or minimum") + sp(26) + boxed("Step 1: set f′(x) = 0", 0.08, 34) + sp(24) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("f″(x) &lt; 0", "Maximum ∩", "", 0.45, 280, "var(--teal)") + cardT("f″(x) &gt; 0", "Minimum ∪", "", 0.72, 280, "var(--orange)") + "</div>";
  } },
  { tag: "Worked example", draw: function () {
    var P = function (x) { return -3 * x * x + 180 * x - 800; };
    return side(T2("Maximum profit") + sp(10) + eq("P = −3x² + 180x − 800", 0.05, 24) + eq("P′ = −6x + 180 = 0", 0.32, 26) + eq("x = 30, P″ = −6 &lt; 0", 0.55, 26, "t") + sp(8) + boxed("Max profit = 1,900", 0.78, 28),
      plot(P, 0, 60, -900, 2500, ease((LT - 0.1 * LD) / 1.3), "#1F9A94", function (sx, sy) { return '<line x1="' + sx(30) + '" y1="' + sy(-900) + '" x2="' + sx(30) + '" y2="' + sy(1900) + '" stroke="#F28C28" stroke-width="2" stroke-dasharray="6 5" opacity="' + k(0.55) + '"/><circle cx="' + sx(30) + '" cy="' + sy(1900) + '" r="9" fill="#F28C28" opacity="' + k(0.6) + '"/><text x="' + (sx(30) + 14) + '" y="' + (sy(1900) + 6) + '" font-size="18" font-weight="800" fill="#F28C28" font-family="Outfit" opacity="' + k(0.6) + '">(30, 1,900)</text>'; }), 360);
  } },
  { tag: "Integration", draw: function () {
    return T("Integration reverses differentiation") + sp(24) + boxed("∫ xⁿ dx = xⁿ⁺¹ ÷ (n + 1) + C", 0.1, 38) + sp(24) + '<div class="row" style="gap:20px">' + cardT("Reciprocal", "∫ (1/x) dx = log x + C", "", 0.62, 340, "var(--teal)") + cardT("Exponential", "∫ eˣ dx = eˣ + C", "", 0.78, 300, "var(--orange)") + "</div>";
  } },
  { tag: "Integration", draw: function () {
    return T("From marginal cost to total cost") + sp(26) + eq("MC = 4x + 20", 0.05, 40) + down(0.15, "∫ dx") + eq("C = 2x² + 20x + K", 0.2, 40) + sp(10) + note("K = fixed cost = 800", 0.5) + sp(16) + boxed("C(x) = 2x² + 20x + 800", 0.72);
  } },
  { tag: "Integration", draw: function () {
    var f = function (x) { return 3 * x * x; }, g = k(0.5);
    return side(T2("Definite integral") + sp(12) + boxed("∫ₐᵇ f(x) dx = F(b) − F(a)", 0.05, 26) + sp(14) + eq("∫₀² 3x² dx = [x³]₀²", 0.45, 28) + eq("= 8 − 0 = <span class='t'>8</span>", 0.7, 30),
      plot(f, 0, 2.6, 0, 20, 1, "#1E2A47", function (sx, sy) { var d = "M" + sx(0) + "," + sy(0); for (var x = 0; x <= 2.0001; x += 0.05) d += "L" + sx(x) + "," + sy(f(x)); d += "L" + sx(2) + "," + sy(0) + "Z"; return '<path d="' + d + '" fill="#1F9A94" opacity="' + (0.4 * g) + '"/><text x="' + sx(1.3) + '" y="' + sy(1.5) + '" text-anchor="middle" font-size="22" font-weight="800" fill="#1E2A47" font-family="Outfit" opacity="' + k(0.7) + '">area = 8</text>'; }), 360);
  } },
  mcqScene("C(x) = x³ − 6x² + 15x. What is the marginal cost at x = 3?", ["6", "18", "15", "12"], 0, "MC = 3x² − 12x + 15 = 27 − 36 + 15 = 6."),
  recapScene([["Power rule", "d/dx xⁿ = nxⁿ⁻¹"], ["Marginal cost", "MC = dC/dx"], ["f′ = 0, then check f″", "f″ < 0 max · f″ > 0 min"], ["Integrate MC", "constant = fixed cost"]])
];
