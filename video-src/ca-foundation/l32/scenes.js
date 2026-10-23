/* Lesson 3.2 — Measures of Central Tendency */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Measures of Central Tendency</b>" };
var CL = ["10–20", "20–30", "30–40", "40–50", "50–60"], F = [4, 6, 10, 7, 3], MID = [15, 25, 35, 45, 55];
var SCENES = [
  introScene("Measures of<br>Central Tendency", "CA Foundation · Quantitative Aptitude · Lesson 3.2", ["Mean", "Median", "Mode", "GM & HM"]),
  { tag: "Averages", draw: function () {
    return T("One value for the whole data") + sp(30) + '<div class="row" style="gap:20px;align-items:stretch">' + cardT("Mean", "the balance point", "uses every value", 0.15, 250, "var(--teal)") + cardT("Median", "the middle", "ignores extremes", 0.3, 250, "var(--orange)") + cardT("Mode", "the most common", "most frequent value", 0.45, 250) + "</div>" + sp(24) + note("The right average depends on the data and the question", 0.65);
  } },
  { tag: "The data", draw: function () {
    return T("30 days of sales at Kiran Traders") + sp(16) + vbars(CL, F, 0.15, { w: 600, h: 290, vals: F, gap: 0.15 }) + SMALL("units sold per day · number of days", 0.3);
  } },
  { tag: "Mean", draw: function () {
    return T("Mean = Σfx ÷ Σf") + sp(8) + table(["Sales", "Mid x", "f", "fx"], CL.map(function (c, i) { return [c, MID[i], F[i], MID[i] * F[i]]; }).concat([["Total", "", "30", "<b class='t'>1,040</b>"]]), 0.05, 0.08, null, 560) + sp(14) + boxed("Mean = 1,040 ÷ 30 ≈ 34.67", 0.7, 32);
  } },
  { tag: "Median", draw: function () {
    return T("Median: the middle value") + sp(36) + chipsRow(["3", "5", "8", "10", "12"], 0.15, 0.04, hl(0.4) ? 2 : undefined) + sp(14) + SMALL("ordered data · middle = (n + 1)/2 th value", 0.3) + sp(30) + note("Grouped data → use a formula", 0.75, true);
  } },
  { tag: "Median", draw: function () {
    return T("Median of grouped data") + sp(10) + side(table(["Sales", "f", "cf"], [["10–20", 4, 4], ["20–30", 6, 10], ["30–40", 10, 20], ["40–50", 7, 27], ["50–60", 3, 30]], 0.04, 0.07, 2, 340),
      '<div style="width:440px">' + note("N/2 = 15 → median class 30–40", 0.3, true) + sp(16) + eq("L + [(N/2 − cf) ÷ f] × h", 0.45, 26, "m") + eq("= 30 + [(15 − 10) ÷ 10] × 10", 0.6, 28) + sp(10) + boxed("Median = 35", 0.82, 30) + "</div>", 360);
  } },
  { tag: "Mode", draw: function () {
    return T("Mode of grouped data") + sp(6) + vbars(CL, F, 0.02, { w: 520, h: 210, vals: F, hl: 2, gap: 0.15 }) + sp(6) + '<div class="row">' + pill("f₀ = 6", 0.3, "l", 22) + pill("f₁ = 10", 0.35, "o", 22) + pill("f₂ = 7", 0.4, "l", 22) + "</div>" + sp(6) +
      eq("Mode = L + [(f₁ − f₀) ÷ (2f₁ − f₀ − f₂)] × h", 0.45, 26, "m") + boxed("= 30 + (4 ÷ 7) × 10 ≈ 35.71", 0.75, 30);
  } },
  { tag: "Empirical relation", draw: function () {
    return T("A quick check") + sp(34) + boxed("Mode ≈ 3 Median − 2 Mean", 0.1, 38) + sp(28) + eq("3 × 35 − 2 × 34.67 ≈ 35.67", 0.45, 38) + sp(16) + note("Formula gave 35.71: very close ✓", 0.8, true);
  } },
  { tag: "Properties of the mean", draw: function () {
    return T("Two useful properties") + sp(28) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("Deviations", "Σ(x − mean) = 0", "always balance out", 0.12, 300, "var(--teal)") + cardT("Combined mean", "(n₁M₁ + n₂M₂) ÷ (n₁ + n₂)", "M = each group&#39;s mean", 0.35, 500, "var(--orange)") + "</div>" + sp(26) +
      eq("(20 × 60 + 30 × 70) ÷ 50 = 3,300 ÷ 50", 0.6, 32) + boxed("Combined mean = 66", 0.82, 30);
  } },
  { tag: "GM and HM", draw: function () {
    return T("Geometric and harmonic means") + sp(24) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("GM", "ⁿ√(x₁x₂…xₙ)", "growth rates, ratios", 0.08, 300, "var(--teal)") + cardT("HM", "n ÷ Σ(1/x)", "average speeds", 0.22, 300, "var(--orange)") + "</div>" + sp(20) +
      eq("40 and 60 km/h: HM = 2 × 40 × 60 ÷ 100 = <b class='t'>48</b>", 0.35, 30) + sp(10) + boxed("AM ≥ GM ≥ HM", 0.82, 32);
  } },
  { tag: "Choosing an average", draw: function () {
    return T("Which average?") + sp(24) + listOf([["Incomes, house prices (skewed)", "median"], ["Most popular shoe size", "mode"], ["Marks of a class", "mean"], ["Average speed, equal distances", "HM"]], 0.12, 0.17, 780, 24);
  } },
  mcqScene("The mean is 40 and the median is 42. Using the empirical relation, the mode is about…", ["46", "44", "38", "41"], 0, "Mode ≈ 3 × 42 − 2 × 40 = 126 − 80 = 46."),
  recapScene([["Mean", "Σfx ÷ Σf"], ["Median (grouped)", "L + [(N/2 − cf)/f]·h"], ["Mode ≈ 3 Median − 2 Mean", "empirical"], ["AM ≥ GM ≥ HM", "HM for speeds"]])
];
