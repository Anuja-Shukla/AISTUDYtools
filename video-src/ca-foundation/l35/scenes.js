/* Lesson 3.5 — Theoretical Distributions */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Theoretical Distributions</b>" };
function bell(at, shadeFrom, shadeTo, labels) {
  var W = 640, H = 260, g = grow(at, 1.4), xs = function (z) { return 30 + (W - 60) * (z + 3.6) / 7.2; }, ys = function (v) { return H - 40 - (H - 60) * v / 0.4; }, d = "", a = "";
  var zEnd = -3.6 + 7.2 * g;
  for (var z = -3.6; z <= zEnd + 1e-9; z += 0.05) d += (z === -3.6 ? "M" : "L") + xs(z).toFixed(1) + "," + ys(Math.exp(-z * z / 2) / 2.5066).toFixed(1);
  if (shadeFrom !== undefined && hl(shadeFrom[1])) {
    var lo = shadeFrom[0], hi = shadeTo; a = "M" + xs(lo) + "," + ys(0);
    for (z = lo; z <= hi + 1e-9; z += 0.05) a += "L" + xs(z).toFixed(1) + "," + ys(Math.exp(-z * z / 2) / 2.5066).toFixed(1);
    a += "L" + xs(hi) + "," + ys(0) + "Z";
  }
  var s = '<path d="' + a + '" fill="#F28C28" opacity=".45"/><path d="' + d + '" fill="none" stroke="#1F9A94" stroke-width="4"/><line x1="20" x2="' + (W - 20) + '" y1="' + ys(0) + '" y2="' + ys(0) + '" stroke="#1E2A47" stroke-width="2"/>';
  (labels || []).forEach(function (l) { s += '<text x="' + xs(l[0]) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="17" font-weight="700" fill="#6B7590" font-family="Outfit">' + l[1] + "</text>"; });
  return '<svg ' + rv(at, 0) + ' width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
}
var SCENES = [
  introScene("Theoretical Distributions", "CA Foundation · Quantitative Aptitude · Lesson 3.5", ["Binomial", "Poisson", "Normal"]),
  { tag: "Overview", draw: function () {
    return T("Three models of chance") + sp(30) + '<div class="row" style="gap:20px;align-items:stretch">' + cardT("Binomial", "Discrete", "successes in n trials", 0.3, 250, "var(--teal)") + cardT("Poisson", "Discrete", "rare events per interval", 0.38, 250, "var(--orange)") + cardT("Normal", "Continuous", "measurements", 0.7, 250) + "</div>";
  } },
  { tag: "Binomial", draw: function () {
    return T("When to use the binomial") + sp(24) + listOf([["A fixed number of trials", "n"], ["Two outcomes each time", "success / failure"], ["Same success probability", "p (and q = 1 − p)"], ["Trials are independent", ""]], 0.12, 0.18, 760, 25);
  } },
  { tag: "Binomial", draw: function () {
    var P = [0.59049, 0.32805, 0.0729, 0.0081, 0.00045, 0.00001];
    return T("10% defective, sample of 5") + sp(8) + boxed("P(x) = ⁿCₓ pˣ qⁿ⁻ˣ", 0.05, 32) + sp(10) + vbars(["0", "1", "2", "3", "4", "5"], P, 0.3, { w: 560, h: 230, hl: 1, vals: ["0.590", "0.328", "0.073", "0.008", "0.000", "0.000"] }) + SMALL("number of defective items", 0.35) + sp(4) + eq("P(1) = 5 × 0.1 × 0.9⁴ ≈ <b class='o'>0.328</b>", 0.6, 30);
  } },
  { tag: "Binomial", draw: function () {
    return T("Mean and variance of the binomial") + sp(30) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("Mean", "np", "5 × 0.1 = 0.5", 0.08, 300, "var(--teal)") + cardT("Variance", "npq", "5 × 0.1 × 0.9 = 0.45", 0.25, 300, "var(--orange)") + "</div>" + sp(28) + '<div class="row" style="gap:18px">' + note("Variance &lt; mean", 0.55, true) + note("Symmetric when p = 0.5", 0.78) + "</div>";
  } },
  { tag: "Poisson", draw: function () {
    var P = [0.1353, 0.2707, 0.2707, 0.1804, 0.0902, 0.0361, 0.012];
    return T("Poisson: rare events") + sp(8) + boxed("P(x) = e⁻ᵐ mˣ ÷ x!", 0.1, 32) + sp(10) + vbars(["0", "1", "2", "3", "4", "5", "6"], P, 0.4, { w: 560, h: 230, hl: 0, vals: ["0.135", "0.271", "0.271", "0.180", "0.090", "0.036", "0.012"] }) + SMALL("typing errors per page, m = 2", 0.45);
  } },
  { tag: "Poisson", draw: function () {
    return T("Two facts about the Poisson") + sp(30) + boxed("Mean = Variance = m", 0.05, 38) + sp(30) + card('<div class="m" style="font-size:20px;font-weight:700">Approximates the binomial when n is large and p is small</div><div class="eq" style="font-size:34px;margin-top:6px">n = 200, p = 0.01 → m = np = <b class="t">2</b></div>', 0.45, 760);
  } },
  { tag: "Normal", draw: function () {
    return T("The normal curve") + sp(16) + bell(0.05, undefined, undefined, [[0, "mean = median = mode"]]) + sp(10) + '<div class="row" style="gap:16px">' + note("Bell-shaped", 0.2, true) + note("Symmetric", 0.3, true) + note("Total area = 1", 0.75) + "</div>";
  } },
  { tag: "Normal", draw: function () {
    return T("Standardise: z = (x − μ) ÷ σ") + sp(16) + bell(0.0, undefined, undefined, [[-2, "40"], [-1, "50"], [0, "60"], [1, "70"], [2, "80"]]) + sp(10) + eq("μ = 60, σ = 10: &nbsp; z = (80 − 60) ÷ 10 = <b class='t'>2</b>", 0.55, 32);
  } },
  { tag: "Normal", draw: function () {
    var step = LT < 0.4 * LD ? 1 : (LT < 0.65 * LD ? 2 : 3), pct = ["", "68.27%", "95.45%", "99.73%"][step];
    return T("The 68 – 95 – 99.7 rule") + sp(12) + bell(0.0, [-step, 0.15], step, [[-3, "μ−3σ"], [-2, "μ−2σ"], [-1, "μ−σ"], [0, "μ"], [1, "μ+σ"], [2, "μ+2σ"], [3, "μ+3σ"]]) + sp(10) + boxed("Within " + step + "σ: " + pct, 0.15, 34);
  } },
  { tag: "Normal", draw: function () {
    return T("What share scores above 80?") + sp(12) + bell(0.0, [2, 0.1], 3.6, [[0, "60"], [2, "80"]]) + sp(10) + eq("(1 − 0.9545) ÷ 2 ≈ 0.023", 0.35, 34) + boxed("about 2.3% of students", 0.7, 30);
  } },
  mcqScene("A binomial distribution has mean 4 and variance 3. What are n and p?", ["n = 16, p = 1/4", "n = 12, p = 1/3", "n = 8, p = 1/2", "n = 16, p = 3/4"], 0, "npq ÷ np = q = 3/4, so p = 1/4 and n = 4 ÷ (1/4) = 16."),
  recapScene([["Binomial", "mean np, variance npq"], ["Poisson", "mean = variance = m"], ["Normal", "z = (x − μ) ÷ σ"], ["68 – 95 – 99.7", "within 1, 2, 3 σ"]])
];
