/* Lesson 3.7 — Index Numbers */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Index Numbers</b>" };
var B = [["Rice", 40, 10, 50, 8], ["Oil", 120, 5, 150, 5], ["Sugar", 40, 4, 45, 5]];
var SCENES = [
  introScene("Index Numbers", "CA Foundation · Quantitative Aptitude · Lesson 3.7", ["Prices", "Quantities", "Values"]),
  { tag: "What is an index?", draw: function () {
    return T("Base period = 100") + sp(20) + hbars([["Base", 100, "100", "var(--navy)"], ["Now", 123, "123", "var(--teal)"]], 140, 0.08, 0.15, 480) + sp(14) + note("123 → prices up 23% since the base", 0.4, true) + sp(20) + '<div class="row">' + pill("CPI", 0.75, "", 24) + pill("WPI", 0.8, "n", 24) + "</div>";
  } },
  { tag: "The basket", draw: function () {
    return T("A household basket") + sp(14) + table(["Item", "p₀", "q₀", "p₁", "q₁"], B.map(function (r) { return [r[0], "₹" + r[1], r[2], "₹" + r[3], r[4]]; }), 0.15, 0.12, null, 600) + sp(16) + '<div class="row" style="gap:16px">' + note("p₀, q₀: base year", 0.3, true) + note("p₁, q₁: current year", 0.55) + "</div>";
  } },
  { tag: "Simple aggregative", draw: function () {
    return T("Simple aggregative index") + sp(30) + boxed("Σp₁ ÷ Σp₀ × 100", 0.05, 36) + sp(24) + eq("(50 + 150 + 45) ÷ (40 + 120 + 40) × 100", 0.2, 30) + eq("= 245 ÷ 200 × 100 = <b class='t'>122.5</b>", 0.4, 36) + sp(18) + note("Ignores how much of each item is bought", 0.75);
  } },
  { tag: "Laspeyres", draw: function () {
    return T("Laspeyres: base-year weights") + sp(10) + table(["Item", "p₀q₀", "p₁q₀"], [["Rice", 400, 500], ["Oil", 600, 750], ["Sugar", 160, 180], ["Total", "<b>1,160</b>", "<b class='t'>1,430</b>"]], 0.05, 0.08, null, 460) + sp(14) + boxed("Σp₁q₀ ÷ Σp₀q₀ × 100 ≈ 123.28", 0.65, 30);
  } },
  { tag: "Paasche", draw: function () {
    return T("Paasche: current-year weights") + sp(10) + table(["Item", "p₀q₁", "p₁q₁"], [["Rice", 320, 400], ["Oil", 600, 750], ["Sugar", 200, 225], ["Total", "<b>1,120</b>", "<b class='t'>1,375</b>"]], 0.05, 0.08, null, 460) + sp(14) + boxed("Σp₁q₁ ÷ Σp₀q₁ × 100 ≈ 122.77", 0.65, 30);
  } },
  { tag: "Fisher's ideal index", draw: function () {
    return T("Fisher's ideal index") + sp(24) + boxed("Fisher = √(L × P)", 0.05, 38) + sp(18) + eq("√(123.28 × 122.77) ≈ <b class='t'>123.02</b>", 0.2, 36) + sp(18) + '<div class="row" style="gap:18px;align-items:stretch">' + cardT("Bowley", "(L + P) ÷ 2", "arithmetic mean", 0.6, 300, "var(--orange)") + cardT("Marshall–Edgeworth", "weights q₀ + q₁", "", 0.78, 340) + "</div>";
  } },
  { tag: "Tests of a good index", draw: function () {
    return T("Why Fisher is “ideal”") + sp(20) + '<div class="row" style="gap:20px;align-items:stretch">' + cardT("Time reversal", "P₀₁ × P₁₀ = 1", "", 0.15, 340, "var(--teal)") + cardT("Factor reversal", "P₀₁ × Q₀₁ = V₀₁", "price × quantity = value", 0.35, 380, "var(--orange)") + "</div>" + sp(20) +
      table(["Index", "Time reversal", "Factor reversal"], [["Fisher", "✓", "✓"], ["Laspeyres", "✗", "✗"], ["Paasche", "✗", "✗"]], 0.6, 0.07, 0, 600);
  } },
  { tag: "Shifting the base", draw: function () {
    return T("Shifting the base to 2024") + sp(16) + table(["Year", "Old index", "New index (2024 = 100)"], [["2022", "100", "80"], ["2024", "125", "<b class='t'>100</b>"], ["2025", "150", "<b class='o'>120</b>"]], 0.1, 0.12, 2, 640) + sp(16) + eq("New = old ÷ index of new base × 100", 0.5, 28, "m") + eq("150 ÷ 125 × 100 = <b class='o'>120</b>", 0.7, 34);
  } },
  { tag: "Deflating", draw: function () {
    return T("From money to real values") + sp(24) + boxed("Real value = money value ÷ price index × 100", 0.05, 32) + sp(28) + '<div class="row" style="gap:18px">' + cardT("Salary", "₹60,000", "", 0.4, 220, "var(--navy)") + '<b class="m" style="font-size:30px">÷ 150 × 100 =</b>' + cardT("Real salary", "₹40,000", "at base-year prices", 0.6, 260, "var(--teal)") + "</div>";
  } },
  { tag: "Uses", draw: function () {
    return T("Where index numbers are used") + sp(26) + listOf([["Measuring inflation", "CPI, WPI"], ["Adjusting wages", "dearness allowance"], ["Comparing real growth", "deflated values"]], 0.15, 0.25, 760, 25);
  } },
  mcqScene("Laspeyres' index is 125 and Paasche's is 121. Fisher's ideal index is about…", ["122.98", "123.00", "246", "121"], 0, "Fisher = √(125 × 121) = √15,125 ≈ 122.98 (the arithmetic mean, 123, is Bowley's)."),
  recapScene([["Base period", "= 100"], ["Laspeyres / Paasche", "q₀ / q₁ weights"], ["Fisher = √(L × P)", "passes both reversal tests"], ["Deflate", "÷ index × 100"]], "Well done! Now try the interactive tool below ↓")
];
