/* Lesson 3.4 — Probability */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Probability</b>" };
/* 6x6 grid of two-dice outcomes, sums of 7 highlighted */
function diceGrid(at, hlAt) {
  var s = "", c = 44, g = k(at), on = hl(hlAt);
  for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) { var seven = a + b === 7; s += '<rect x="' + (40 + (b - 1) * c) + '" y="' + (34 + (a - 1) * c) + '" width="' + (c - 6) + '" height="' + (c - 6) + '" rx="7" fill="' + (seven && on ? "#F28C28" : "#fff") + '" stroke="#E3E7EF" stroke-width="2" opacity="' + g + '"/><text x="' + (40 + (b - 1) * c + (c - 6) / 2) + '" y="' + (34 + (a - 1) * c + 26) + '" text-anchor="middle" font-size="17" font-weight="700" fill="' + (seven && on ? "#fff" : "#1E2A47") + '" font-family="Outfit" opacity="' + g + '">' + (a + b) + "</text>"; }
  for (var i = 1; i <= 6; i++) s += '<text x="' + (40 + (i - 1) * c + 19) + '" y="24" text-anchor="middle" font-size="16" font-weight="800" fill="#17716D" font-family="Outfit">' + i + '</text><text x="22" y="' + (34 + (i - 1) * c + 26) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#17716D" font-family="Outfit">' + i + "</text>";
  return '<svg width="310" height="300" viewBox="0 0 310 300">' + s + "</svg>";
}
function venn(at, mode) {
  var g = k(at), s = '<rect x="4" y="4" width="352" height="212" rx="14" fill="#fff" stroke="#E3E7EF" stroke-width="2"/>';
  s += '<circle cx="140" cy="112" r="78" fill="#1F9A94" fill-opacity="' + (0.22 * g) + '" stroke="#1F9A94" stroke-width="3" opacity="' + g + '"/>';
  s += '<circle cx="' + (mode === "me" ? 286 : 222) + '" cy="112" r="' + (mode === "me" ? 56 : 78) + '" fill="#F28C28" fill-opacity="' + (0.22 * g) + '" stroke="#F28C28" stroke-width="3" opacity="' + g + '"/>';
  s += '<text x="' + (mode === "me" ? 140 : 110) + '" y="120" text-anchor="middle" font-size="26" font-weight="800" fill="#17716D" font-family="Outfit">A</text><text x="' + (mode === "me" ? 286 : 252) + '" y="120" text-anchor="middle" font-size="26" font-weight="800" fill="#B4570E" font-family="Outfit">B</text>';
  return '<svg width="360" height="220" viewBox="0 0 360 220">' + s + "</svg>";
}
var SCENES = [
  introScene("Probability", "CA Foundation · Quantitative Aptitude · Lesson 3.4", ["Sample space", "Addition", "Multiplication", "Expected value"]),
  { tag: "Sample space", draw: function () {
    return T("How many outcomes?") + sp(30) + grid([["A coin", "2", "H, T"], ["A die", "6", "1 to 6"], ["Two dice", "36", "6 × 6"], ["A pack of cards", "52", "4 suits × 13"]], 4, 0.3, 0.12, 200);
  } },
  { tag: "Classical probability", draw: function () {
    return T("Favourable ÷ total") + sp(36) + boxed("P(A) = favourable outcomes ÷ total outcomes", 0.1, 34) + sp(30) + '<div class="row" style="gap:20px">' + note("0 ≤ P(A) ≤ 1", 0.5, true) + note("P(not A) = 1 − P(A)", 0.7) + "</div>";
  } },
  { tag: "Two dice", draw: function () {
    return side(T2("Sum of 7 with two dice") + sp(14) + eq("6 favourable outcomes", 0.35, 26) + eq("out of 36", 0.4, 26, "m") + sp(10) + boxed("P = 6/36 = 1/6", 0.55, 30) + sp(14) + note("7 is the most likely total", 0.8, true), diceGrid(0.05, 0.3), 360);
  } },
  { tag: "Odds", draw: function () {
    return T("Odds and probability") + sp(36) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("Odds in favour a : b", "a ÷ (a + b)", "", 0.15, 340, "var(--teal)") + cardT("Odds against a : b", "b ÷ (a + b)", "", 0.3, 340, "var(--orange)") + "</div>" + sp(30) + boxed("Odds 3 : 5 in favour → P = 3/8", 0.7, 32);
  } },
  { tag: "Key ideas", draw: function () {
    return T("Exclusive or independent?") + sp(20) + '<div class="row" style="gap:30px;align-items:flex-start"><div style="display:flex;flex-direction:column;align-items:center">' + venn(0.15, "me") + eq("Mutually exclusive", 0.15, 26, "n") + SMALL("cannot happen together", 0.2) + '</div><div style="display:flex;flex-direction:column;align-items:center">' + venn(0.5, "ind") + eq("Independent", 0.5, 26, "n") + SMALL("one doesn't change the other", 0.55) + "</div></div>";
  } },
  { tag: "Addition theorem", draw: function () {
    return T("“Or”: the addition theorem") + sp(20) + boxed("P(A ∪ B) = P(A) + P(B) − P(A ∩ B)", 0.05, 32) + sp(26) + '<div class="row" style="gap:14px">' + pill("King: 4/52", 0.4, "", 24) + pill("+ Heart: 13/52", 0.5, "o", 24) + pill("− King of hearts: 1/52", 0.6, "n", 24) + "</div>" + sp(24) + eq("= 16/52 = <b class='t'>4/13</b>", 0.78, 40);
  } },
  { tag: "Multiplication theorem", draw: function () {
    return T("“And”: the multiplication theorem") + sp(20) + boxed("P(A ∩ B) = P(A) × P(B | A)", 0.05, 34) + sp(26) + '<div class="row" style="gap:18px">' + cardT("1st ace", "4/52", "", 0.5, 180, "var(--teal)") + '<b class="m" style="font-size:34px">×</b>' + cardT("2nd ace", "3/51", "one ace gone", 0.6, 200, "var(--orange)") + '<b class="m" style="font-size:34px">=</b>' + cardT("Both aces", "1/221", "", 0.8, 180) + "</div>";
  } },
  { tag: "Independent events", draw: function () {
    return T("Independent events: just multiply") + sp(40) + boxed("P(A ∩ B) = P(A) × P(B)", 0.05, 36) + sp(30) + eq("0.5 × 0.4 = <b class='t'>0.2</b>", 0.6, 46);
  } },
  { tag: "Expected value", draw: function () {
    return T("Expected value E(X) = Σx·p") + sp(10) + table(["Prize x", "p", "x · p"], [["₹100", "0.2", "₹20"], ["₹20", "0.5", "₹10"], ["₹0", "0.3", "₹0"]], 0.25, 0.1, null, 480) + sp(16) + boxed("E(X) = ₹30", 0.85, 34);
  } },
  { tag: "Expected value", draw: function () {
    return T("Using the expected value") + sp(30) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("Cost to play ₹35", "−₹5 per game", "on average, in the long run", 0.05, 360, "var(--orange)") + cardT("Variance", "E(X²) − [E(X)]²", "2,200 − 900 = 1,300", 0.45, 360, "var(--teal)") + "</div>";
  } },
  mcqScene("P(A) = 0.6, P(B) = 0.5 and P(A ∩ B) = 0.3. What is P(A ∪ B)?", ["0.8", "1.1", "0.3", "0.9"], 0, "0.6 + 0.5 − 0.3 = 0.8. Subtract the overlap once."),
  recapScene([["Classical probability", "favourable ÷ total"], ["“Or”", "P(A) + P(B) − P(A ∩ B)"], ["“And”", "P(A) × P(B | A)"], ["Expected value", "E(X) = Σx·p"]])
];
