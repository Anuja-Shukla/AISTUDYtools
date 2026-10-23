/* Lesson 1.3 — Linear Inequalities and Linear Programming */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Linear Inequalities &amp; LP</b>" };
/* graph helper: x 0..44, y 0..34 */
function G(opts) {
  var W = 440, H = 320, P = 40, X = 44, Y = 34, sx = function (x) { return P + (W - P - 12) * x / X; }, sy = function (y) { return H - P - (H - P - 12) * y / Y; }, s = "";
  s += '<line x1="' + P + '" y1="' + sy(0) + '" x2="' + (W - 6) + '" y2="' + sy(0) + '" stroke="#1E2A47" stroke-width="2"/><line x1="' + P + '" y1="' + sy(0) + '" x2="' + P + '" y2="8" stroke="#1E2A47" stroke-width="2"/>';
  [10, 20, 30, 40].forEach(function (v) { s += '<text x="' + sx(v) + '" y="' + (sy(0) + 22) + '" text-anchor="middle" font-size="15" fill="#6B7590" font-family="Outfit" font-weight="600">' + v + "</text>"; if (v <= 30) s += '<text x="' + (P - 8) + '" y="' + (sy(v) + 5) + '" text-anchor="end" font-size="15" fill="#6B7590" font-family="Outfit" font-weight="600">' + v + "</text>"; });
  s += '<text x="' + (W - 8) + '" y="' + (sy(0) - 14) + '" text-anchor="end" font-size="17" font-weight="700" fill="#1E2A47" font-family="Outfit">x (chairs)</text><text x="' + (P + 8) + '" y="20" font-size="17" font-weight="700" fill="#1E2A47" font-family="Outfit">y (tables)</text>';
  if (opts.shadeHalf) s += '<polygon points="' + [[0, 0], [40, 0], [0, 20]].map(function (p) { return sx(p[0]) + "," + sy(p[1]); }).join(" ") + '" fill="#1F9A94" opacity="' + (0.22 * opts.shadeHalf).toFixed(3) + '"/>';
  if (opts.region) s += '<polygon points="' + [[0, 0], [20, 0], [10, 15], [0, 20]].map(function (p) { return sx(p[0]) + "," + sy(p[1]); }).join(" ") + '" fill="#1F9A94" opacity="' + (0.25 * opts.region).toFixed(3) + '"/>';
  function line(x1, y1, x2, y2, col, prog, lbl, lx, ly) { var xe = x1 + (x2 - x1) * prog, ye = y1 + (y2 - y1) * prog; return '<line x1="' + sx(x1) + '" y1="' + sy(y1) + '" x2="' + sx(xe) + '" y2="' + sy(ye) + '" stroke="' + col + '" stroke-width="3.5" stroke-linecap="round"/>' + (prog > 0.95 && lbl ? '<text x="' + sx(lx) + '" y="' + sy(ly) + '" font-size="17" font-weight="700" fill="' + col + '" font-family="Outfit">' + lbl + "</text>" : ""); }
  if (opts.l1) s += line(0, 20, 40, 0, "#1F9A94", opts.l1, "x + 2y = 40", 26, 9.6);
  if (opts.l2) s += line(0, 30, 20, 0, "#F28C28", opts.l2, "3x + 2y = 60", 4.2, 27.5);
  if (opts.test) s += '<circle cx="' + sx(0) + '" cy="' + sy(0) + '" r="9" fill="#F28C28" opacity="' + opts.test + '"/><text x="' + (sx(0) + 14) + '" y="' + (sy(0) - 12) + '" font-size="17" font-weight="700" fill="#F28C28" font-family="Outfit" opacity="' + opts.test + '">(0, 0)</text>';
  (opts.corners || []).forEach(function (c) { if (c[2] > 0.02) s += '<circle cx="' + sx(c[0]) + '" cy="' + sy(c[1]) + '" r="' + (c[3] ? 11 : 8) + '" fill="' + (c[3] ? "#F28C28" : "#1E2A47") + '" stroke="#fff" stroke-width="2.5" opacity="' + c[2].toFixed(3) + '"/>' + (c[4] ? '<text x="' + (sx(c[0]) + c[5]) + '" y="' + (sy(c[1]) + c[6]) + '" font-size="17" font-weight="700" fill="#1E2A47" font-family="Outfit" opacity="' + c[2].toFixed(3) + '">' + c[4] + "</text>" : ""); });
  return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
}
var CORN = function (a, hlBest) { return [[0, 0, k(a), false, "(0, 0)", 10, -10], [20, 0, k(a + 0.08), false, "(20, 0)", -10, -14], [0, 20, k(a + 0.16), false, "(0, 20)", 12, -8], [10, 15, k(a + 0.24), hlBest, "(10, 15)", 14, -10]]; };
var SCENES = [
  introScene("Linear Inequalities &amp;<br>Linear Programming", "CA Foundation · Quantitative Aptitude · Lesson 1.3", ["Inequalities", "Half-planes", "Feasible region", "Corner points"]),
  { tag: "Inequalities", draw: function () {
    return T("Four inequality signs") + sp(40) + '<div class="row" style="gap:22px">' + [["&lt;", "less than"], ["&gt;", "greater than"], ["≤", "at most"], ["≥", "at least"]].map(function (x, i) { return card('<div class="big t" style="font-size:60px;line-height:1">' + x[0] + '</div><div class="m" style="font-size:19px;font-weight:700;margin-top:6px">' + x[1] + "</div>", 0.12 + i * 0.1, 170); }).join("") + "</div>" + sp(40) + note("Solve like an equation… with one key rule", 0.7);
  } },
  { tag: "Inequalities", draw: function () {
    var f = hl(0.55);
    return T("The key rule: flip for negatives") + sp(30) + eq("−2x &gt; 6", 0.25, 50) + down(0.4, "÷ (−2)") + eq('x <span style="color:' + (f ? "var(--orange)" : "inherit") + ';' + (f ? "background:var(--orange-soft);border-radius:10px;padding:0 10px" : "") + '">' + (f ? "&lt;" : "&gt;") + "</span> −3", 0.45, 50) + sp(24) + note("Multiply or divide by a negative → reverse the sign", 0.62);
  } },
  { tag: "Inequalities", draw: function () {
    var W = 720, sx = function (v) { return 40 + (v + 7) * (W - 80) / 10; }, g = ease((LT - 0.25 * LD) / 1.2), s = '<line x1="20" y1="70" x2="' + (W - 20) + '" y2="70" stroke="#1E2A47" stroke-width="3"/>';
    for (var v = -7; v <= 3; v++) s += '<line x1="' + sx(v) + '" y1="62" x2="' + sx(v) + '" y2="78" stroke="#1E2A47" stroke-width="2"/><text x="' + sx(v) + '" y="104" text-anchor="middle" font-size="19" font-weight="600" fill="#6B7590" font-family="Outfit">' + v + "</text>";
    s += '<line x1="' + sx(-3) + '" y1="70" x2="' + (sx(-3) - (sx(-3) - 24) * g) + '" y2="70" stroke="#1F9A94" stroke-width="9" stroke-linecap="round"/><circle cx="' + sx(-3) + '" cy="70" r="11" fill="#fff" stroke="#F28C28" stroke-width="4" opacity="' + k(0.6) + '"/>';
    return T("x &lt; −3 on a number line") + sp(60) + '<svg width="' + W + '" height="120" viewBox="0 0 ' + W + ' 120">' + s + "</svg>" + sp(30) + '<div class="row">' + note("Open circle: −3 not included", 0.62) + note("Closed circle: included (≤ or ≥)", 0.8, true) + "</div>";
  } },
  { tag: "Half-planes", draw: function () {
    return side(T2("A line splits the plane") + sp(20) + eq("x + 2y ≤ 40", 0.12, 38) + sp(8) + note("Draw x + 2y = 40", 0.35, true) + sp(10) + note("Test the point (0, 0)", 0.7) , G({ l1: ease((LT - 0.3 * LD) / 1.4), test: k(0.7) }));
  } },
  { tag: "Half-planes", draw: function () {
    return side(T2("Shade the true side") + sp(20) + eq("0 + 2(0) = 0 ≤ 40", 0.08, 34) + eq('<span class="t">True ✓</span>', 0.3, 34) + sp(8) + note("(0, 0) is on the feasible side", 0.5, true) , G({ l1: 1, test: 1, shadeHalf: k(0.45) }));
  } },
  { tag: "Linear programming", draw: function () {
    return T("Planning production at Kiran Traders") + sp(36) + '<div class="row" style="gap:26px">' + cardT("Chairs", "x", "₹30 profit each", 0.12, 260, "var(--teal)") + cardT("Tables", "y", "₹50 profit each", 0.45, 260, "var(--orange)") + "</div>" + sp(36) + boxed("Maximise Z = 30x + 50y", 0.6);
  } },
  { tag: "Linear programming", draw: function () {
    return T("The constraints") + sp(26) + listOf([["Carpentry", "x + 2y ≤ 40"], ["Polishing", "3x + 2y ≤ 60"], ["No negative output", "x ≥ 0, y ≥ 0"]], 0.05, 0.3, 640, 26);
  } },
  { tag: "Linear programming", draw: function () {
    return side(T2("The feasible region") + sp(20) + note("Satisfies every constraint", 0.4, true) + sp(12) + note("Every point is a possible plan", 0.7) , G({ l1: 1, l2: ease((LT - 0.05 * LD) / 1.2), region: k(0.35) }));
  } },
  { tag: "Linear programming", draw: function () {
    return side(T2("Corner-point theorem") + sp(20) + card('<div style="font-size:24px;font-weight:700;color:var(--navy);line-height:1.35">The best value of Z is at a <span class="o">corner</span> of the feasible region</div>', 0.3, 330) , G({ l1: 1, l2: 1, region: 1, corners: CORN(0.55, false) }));
  } },
  { tag: "Linear programming", draw: function () {
    return side(T2("Find the corners") + sp(16) + eq("x + 2y = 40", 0.5, 28) + eq("3x + 2y = 60", 0.52, 28) + eq('Subtract: 2x = 20', 0.62, 28) + boxed("x = 10, y = 15", 0.78, 28) , G({ l1: 1, l2: 1, region: 1, corners: CORN(0.05, false) }));
  } },
  { tag: "Linear programming", draw: function () {
    return side(T2("Evaluate Z = 30x + 50y") + sp(10) + table(["Corner", "Z"], [["(0, 0)", "0"], ["(20, 0)", "600"], ["(0, 20)", "1,000"], ["(10, 15)", "<b class='o'>1,050</b>"]], 0.05, 0.11, 3, 300) + sp(16) + boxed("Max profit ₹1,050", 0.7, 30) , G({ l1: 1, l2: 1, region: 1, corners: CORN(-1, hl(0.55)) }));
  } },
  mcqScene("Solve −3x ≥ 12.", ["x ≤ −4", "x ≥ −4", "x ≥ 4", "x ≤ 4"], 0, "Dividing by −3 reverses the sign: x ≤ −4."),
  recapScene([["Negative multiplier → flip the sign", "−2x > 6 ⟹ x < −3"], ["Each inequality is a half-plane", "test (0, 0)"], ["Feasible region", "all constraints together"], ["Best value at a corner", "evaluate Z at each"]])
];
