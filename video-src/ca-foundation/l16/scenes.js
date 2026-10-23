/* Lesson 1.6 — Sequences and Series: AP and GP */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Sequences &amp; Series</b>" };
function gaps(labels, at, step, col) { return '<div class="row" style="gap:52px;margin-top:-6px">' + labels.map(function (g, i) { return '<b ' + rv(at + i * step, 0) + ' style="font-size:22px;color:' + (col || "var(--orange)") + '">' + g + "</b>"; }).join("") + "</div>"; }
var SCENES = [
  introScene("Sequences &amp; Series", "CA Foundation · Quantitative Aptitude · Lesson 1.6", ["AP", "GP", "Means", "Standard sums"]),
  { tag: "Introduction", draw: function () {
    return T("Sequence and series") + sp(30) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Sequence", "2, 4, 6, 8", "an ordered list", 0.05, 300, "var(--teal)") + cardT("Series", "2 + 4 + 6 + 8", "the sum", 0.2, 300, "var(--orange)") + "</div>" + sp(30) +
      '<div class="row">' + pill("Add the same amount → AP", 0.55) + pill("Multiply by the same ratio → GP", 0.75, "o") + "</div>";
  } },
  { tag: "Arithmetic progression", draw: function () {
    return T("Arithmetic progression (AP)") + sp(40) + chipsRow(["4", "7", "10", "13"], 0.35, 0.06) + gaps(["+3", "+3", "+3"], 0.62, 0.06) + sp(36) + boxed("Common difference d = 3", 0.75);
  } },
  { tag: "Arithmetic progression", draw: function () {
    return T("AP formulas") + sp(34) + card('<div class="m" style="font-size:20px;font-weight:700">nth term</div><div class="eq" style="font-size:40px">tₙ = a + (n − 1)d</div>', 0.08, 600) + sp(18) + card('<div class="m" style="font-size:20px;font-weight:700">Sum of n terms</div><div class="eq" style="font-size:40px">Sₙ = n/2 × [2a + (n − 1)d]</div>', 0.45, 600);
  } },
  { tag: "Worked example", draw: function () {
    return T("Riya's monthly savings") + sp(12) + chipsRow(["500", "600", "700", "…", "1,600"], 0.05, 0.05, [4]) + sp(16) + '<div class="row">' + pill("a = 500", 0.12, "l") + pill("d = 100", 0.16, "l") + pill("n = 12", 0.2, "l") + "</div>" + sp(16) +
      eq("t₁₂ = 500 + 11 × 100 = <span class='t'>₹1,600</span>", 0.28, 34) + eq("S₁₂ = 12/2 × [1,000 + 1,100]", 0.58, 34) + sp(8) + boxed("Year's savings = ₹12,600", 0.8, 32);
  } },
  { tag: "Geometric progression", draw: function () {
    return T("Geometric progression (GP)") + sp(40) + chipsRow(["3", "6", "12", "24"], 0.35, 0.06) + gaps(["×2", "×2", "×2"], 0.62, 0.06) + sp(36) + boxed("Common ratio r = 2", 0.75);
  } },
  { tag: "Geometric progression", draw: function () {
    return T("GP formulas") + sp(20) + '<div class="row" style="gap:20px;align-items:stretch">' + cardT("nth term", "tₙ = arⁿ⁻¹", "", 0.05, 300, "var(--teal)") + cardT("Sum of n terms", "a(rⁿ − 1)/(r − 1)", "", 0.2, 340, "var(--orange)") + "</div>" + sp(24) +
      eq("t₈ = 3 × 2⁷ = <span class='t'>384</span>", 0.55, 38) + eq("S₈ = 3(2⁸ − 1) = 3 × 255 = <span class='t'>765</span>", 0.75, 38);
  } },
  { tag: "Geometric progression", draw: function () {
    var W = 640, terms = [1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625], s = '<rect x="0" y="20" width="' + W + '" height="56" rx="10" fill="#E3E7EF"/>', x = 0;
    terms.forEach(function (t, i) { var w = W / 2 * t, q = k(0.35 + i * 0.06); s += '<rect x="' + x + '" y="20" width="' + (w * q) + '" height="56" fill="' + (i % 2 ? "#F28C28" : "#1F9A94") + '" stroke="#fff" stroke-width="2"/>' + (i < 4 && q > 0.5 ? '<text x="' + (x + w / 2) + '" y="56" text-anchor="middle" font-size="20" font-weight="800" fill="#fff" font-family="Outfit">' + ["1", "½", "¼", "⅛"][i] + "</text>" : ""); x += w; });
    s += '<text x="' + W + '" y="102" text-anchor="end" font-size="20" font-weight="700" fill="#1E2A47" font-family="Outfit">2</text><text x="0" y="102" font-size="20" font-weight="700" fill="#1E2A47" font-family="Outfit">0</text>';
    return T("Sum to infinity (when −1 &lt; r &lt; 1)") + sp(24) + boxed("S∞ = a ÷ (1 − r)", 0.12, 38) + sp(30) + '<svg width="' + W + '" height="110" viewBox="0 0 ' + W + ' 110">' + s + "</svg>" + sp(14) + eq("1 ÷ (1 − ½) = <span class='t'>2</span>", 0.8, 36);
  } },
  { tag: "Means", draw: function () {
    return T("Arithmetic and geometric means") + sp(30) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("AM of a, b", "(a + b) ÷ 2", "4 and 16 → 10", 0.15, 300, "var(--teal)") + cardT("GM of a, b", "√(ab)", "4 and 16 → 8", 0.4, 300, "var(--orange)") + "</div>" + sp(30) + boxed("AM ≥ GM (positive numbers)", 0.78);
  } },
  { tag: "Standard sums", draw: function () {
    return T("Three standard sums") + sp(20) + listOf([["1 + 2 + … + n", "n(n + 1)/2"], ["1² + 2² + … + n²", "n(n + 1)(2n + 1)/6"], ["1³ + 2³ + … + n³", "[n(n + 1)/2]²"]], 0.08, 0.2, 720, 27) + sp(20) + eq("1 + 2 + … + 100 = 100 × 101 ÷ 2 = <span class='t'>5,050</span>", 0.75, 32);
  } },
  { tag: "In business", draw: function () {
    return T("Where they appear in business") + sp(34) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("AP: fixed increments", "+ ₹d each time", "salary rises, instalments", 0.12, 340, "var(--teal)") + cardT("GP: percentage change", "× r each time", "compounding, depreciation", 0.55, 340, "var(--orange)") + "</div>";
  } },
  mcqScene("The sum of the first 20 terms of 3, 7, 11, … is…", ["820", "800", "840", "780"], 0, "a = 3, d = 4: S₂₀ = 20/2 × [6 + 19 × 4] = 10 × 82 = 820."),
  recapScene([["AP adds d", "tₙ = a + (n − 1)d"], ["GP multiplies by r", "tₙ = arⁿ⁻¹"], ["Sum to infinity", "a/(1 − r), |r| < 1"], ["Means", "AM ≥ GM"]])
];
