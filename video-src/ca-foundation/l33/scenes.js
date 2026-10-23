/* Lesson 3.3 — Measures of Dispersion */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Measures of Dispersion</b>" };
/* dot plot of a data set on a 0–32 line */
function dots(vals, at, col, label, meanV) {
  var W = 640, H = 92, sx = function (v) { return 30 + (W - 60) * v / 32; }, g = grow(at, 0.8), s = '<line x1="30" y1="60" x2="' + (W - 30) + '" y2="60" stroke="#C9D2E0" stroke-width="3"/>';
  [0, 8, 16, 24, 32].forEach(function (t) { s += '<text x="' + sx(t) + '" y="86" text-anchor="middle" font-size="15" fill="#6B7590" font-family="Outfit">' + t + "</text>"; });
  if (meanV !== undefined) s += '<line x1="' + sx(meanV) + '" y1="22" x2="' + sx(meanV) + '" y2="64" stroke="#1E2A47" stroke-width="2" stroke-dasharray="4 4" opacity="' + g + '"/>';
  vals.forEach(function (v) { s += '<circle cx="' + sx(v) + '" cy="' + (60 - 20 * g) + '" r="13" fill="' + col + '" opacity="' + g + '"/>'; });
  return '<div ' + rv(at, 0) + ' style="display:flex;align-items:center;gap:12px"><b style="width:40px;font-size:28px;color:' + col + '">' + label + '</b><svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg></div>";
}
var SCENES = [
  introScene("Measures of Dispersion", "CA Foundation · Quantitative Aptitude · Lesson 3.3", ["Range", "QD", "Mean deviation", "SD", "CV"]),
  { tag: "Why spread matters", draw: function () {
    return T("Close averages, very different spread") + sp(26) + dots([10, 12, 14, 16, 18], 0.15, "#1F9A94", "A", 14) + sp(10) + dots([5, 10, 20, 25, 30], 0.4, "#F28C28", "B", 18) + sp(16) + note("Weekly sales, ₹ thousand", 0.6, true);
  } },
  { tag: "Two kinds of measure", draw: function () {
    return T("Absolute or relative?") + sp(36) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Absolute", "In data units", "range, QD, MD, SD (₹, kg…)", 0.1, 340, "var(--teal)") + cardT("Relative", "No units", "coefficients: compare data sets", 0.45, 340, "var(--orange)") + "</div>";
  } },
  { tag: "Range", draw: function () {
    return T("Range") + sp(20) + dots([10, 12, 14, 16, 18], 0.05, "#1F9A94", "A") + sp(16) + eq("Range = L − S = 18 − 10 = <b class='t'>8</b>", 0.2, 36) + sp(8) + eq("Coefficient = (L − S) ÷ (L + S)", 0.5, 30, "m") + boxed("8 ÷ 28 ≈ 0.29", 0.72, 32);
  } },
  { tag: "Quartile deviation", draw: function () {
    var W = 640, x = function (v) { return 40 + v * 5.6; }, g = grow(0.2, 1);
    var s = '<rect x="' + x(25) + '" y="30" width="' + (x(75) - x(25)) * g + '" height="44" rx="8" fill="#DDF1EF"/><line x1="40" y1="52" x2="600" y2="52" stroke="#C9D2E0" stroke-width="3"/>' +
      [["Min", 0], ["Q₁", 25], ["Median", 50], ["Q₃", 75], ["Max", 100]].map(function (q) { return '<line x1="' + x(q[1]) + '" y1="30" x2="' + x(q[1]) + '" y2="74" stroke="#1E2A47" stroke-width="3"/><text x="' + x(q[1]) + '" y="100" text-anchor="middle" font-size="18" font-weight="700" fill="#1E2A47" font-family="Outfit">' + q[0] + "</text>"; }).join("") +
      '<text x="' + x(50) + '" y="20" text-anchor="middle" font-size="18" font-weight="800" fill="#17716D" font-family="Outfit" opacity="' + g + '">middle 50%</text>';
    return T("Quartile deviation") + sp(20) + boxed("QD = (Q₃ − Q₁) ÷ 2", 0.1, 36) + sp(26) + '<svg ' + rv(0.2, 0) + ' width="' + W + '" height="110" viewBox="0 0 ' + W + ' 110">' + s + "</svg>" + sp(16) + note("Ignores extreme values", 0.7);
  } },
  { tag: "Mean deviation", draw: function () {
    return T("Mean deviation: average distance") + sp(14) + dots([10, 12, 14, 16, 18], 0.05, "#1F9A94", "A", 14) + sp(6) + chipsRow(["4", "2", "0", "2", "4"], 0.2, 0.05) + SMALL("distances from the mean, 14", 0.25) + sp(12) +
      boxed("MD = 12 ÷ 5 = 2.4", 0.55, 32) + sp(14) + note("Smallest when taken about the median", 0.8, true);
  } },
  { tag: "Standard deviation", draw: function () {
    return T("Standard deviation for A") + sp(8) + table(["x", "x − 14", "(x − 14)²"], [[10, "−4", 16], [12, "−2", 4], [14, 0, 0], [16, 2, 4], [18, 4, 16], ["", "Total", "<b class='t'>40</b>"]], 0.04, 0.06, null, 480) + sp(10) +
      ROWX([eq("variance = 40 ÷ 5 = 8", 0.62, 30), boxed("σ = √8 ≈ 2.83", 0.8, 30)]);
  } },
  { tag: "Standard deviation", draw: function () {
    return T("Standard deviation for B") + sp(20) + dots([5, 10, 20, 25, 30], 0.03, "#F28C28", "B", 18) + sp(10) + chipsRow(["169", "64", "4", "49", "144"], 0.15, 0.05) + SMALL("squared deviations from the mean, 18", 0.2) + sp(14) +
      ROWX([eq("Σ = 430 · variance = 86", 0.4, 30), boxed("σ ≈ 9.27", 0.7, 30)]);
  } },
  { tag: "Coefficient of variation", draw: function () {
    return T("Who is more consistent?") + sp(18) + boxed("CV = σ ÷ mean × 100", 0.05, 34) + sp(18) +
      hbars([["A", 20.2, "20.2%", "var(--teal)"], ["B", 51.5, "51.5%", "var(--orange)"]], 60, 0.3, 0.2, 480) + sp(14) + note("Lower CV = more consistent → A", 0.8, true);
  } },
  { tag: "Origin and scale", draw: function () {
    return T("What changes σ?") + sp(34) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Add a constant", "x + 5 → σ unchanged", "change of origin", 0.12, 360, "var(--teal)") + cardT("Multiply by k", "kx → σ × |k|", "change of scale", 0.5, 360, "var(--orange)") + "</div>";
  } },
  { tag: "A handy result", draw: function () {
    return T("SD of 1, 2, 3, …, n") + sp(30) + boxed("σ = √[(n² − 1) ÷ 12]", 0.08, 38) + sp(28) + chipsRow(["1", "2", "3", "4", "5"], 0.4, 0.04) + sp(16) + eq("√[(25 − 1) ÷ 12] = √2 ≈ <b class='t'>1.414</b>", 0.55, 34);
  } },
  mcqScene("The SD of a data set is 4. Each value is multiplied by 3, then 5 is added. The new SD is…", ["12", "17", "4", "9"], 0, "Multiplying by 3 multiplies σ by 3; adding 5 changes nothing. 3 × 4 = 12."),
  recapScene([["Range, QD", "quick measures"], ["Mean deviation", "average distance"], ["Standard deviation", "√[Σ(x − mean)² ÷ n]"], ["Coefficient of variation", "lower = more consistent"]])
];
function ROWX(parts) { return '<div class="row" style="gap:22px">' + parts.join("") + "</div>"; }
