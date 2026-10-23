/* Lesson 1.5 — Permutations and Combinations */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Permutations &amp; Combinations</b>" };
function shirt(c) { return '<svg width="46" height="46" viewBox="0 0 46 46"><path d="M14 6 L5 13 L10 21 L14 18 L14 40 L32 40 L32 18 L36 21 L41 13 L32 6 Q23 12 14 6 Z" fill="' + c + '"/></svg>'; }
function trouser(c) { return '<svg width="40" height="46" viewBox="0 0 40 46"><path d="M8 4 H32 L34 42 H24 L20 16 L16 42 H6 Z" fill="' + c + '"/></svg>'; }
var SC = ["#1F9A94", "#F28C28", "#1E2A47"], TC = ["#6B7590", "#2F6FB0", "#A0522D", "#7A4FA0"];
var SCENES = [
  introScene("Permutations &amp; Combinations", "CA Foundation · Quantitative Aptitude · Lesson 1.5", ["Counting principles", "Permutations", "Circular", "Combinations"]),
  { tag: "Counting principles", draw: function () {
    var cells = ""; for (var i = 0; i < 3; i++) for (var j = 0; j < 4; j++) { var at = 0.55 + (i * 4 + j) * 0.025; cells += '<div ' + rvs(at) + ' style="display:flex;gap:2px;background:#fff;border-radius:10px;padding:4px 6px;box-shadow:0 3px 10px -6px rgba(30,42,71,.4)">' + shirt(SC[i]).replace('width="46" height="46"', 'width="30" height="30"') + trouser(TC[j]).replace('width="40" height="46"', 'width="26" height="30"') + "</div>"; }
    return T("Multiplication principle: “and”") + sp(18) + '<div class="row" style="gap:40px"><div ' + rv(0.3) + '>' + SC.map(shirt).join("") + '</div><b class="m" style="font-size:36px" ' + rv(0.4) + '>×</b><div ' + rv(0.45) + '>' + TC.map(trouser).join("") + '</div></div>' + sp(14) +
      '<div style="display:grid;grid-template-columns:repeat(4,auto);gap:10px">' + cells + "</div>" + sp(12) + boxed("3 × 4 = 12 outfits", 0.85, 30);
  } },
  { tag: "Counting principles", draw: function () {
    return T("Addition principle: “or”") + sp(40) + '<div class="row" style="gap:24px">' + cardT("Buses", "3 ways", "", 0.45, 220, "var(--teal)") + '<b class="m" style="font-size:40px" ' + rv(0.55) + ">+</b>" + cardT("Trains", "2 ways", "", 0.6, 220, "var(--orange)") + '<b class="m" style="font-size:40px" ' + rv(0.7) + ">=</b>" + boxed("5 ways", 0.75) + "</div>" + sp(30) + note("Either one OR the other, not both", 0.3);
  } },
  { tag: "Factorials", draw: function () {
    return T("Factorial: n!") + sp(30) + eq("n! = n × (n − 1) × … × 2 × 1", 0.08, 40) + sp(18) + eq("5! = 5 × 4 × 3 × 2 × 1 = <span class='t'>120</span>", 0.4, 40) + sp(18) + boxed("0! = 1", 0.78);
  } },
  { tag: "Permutations", draw: function () {
    var places = [["1st · Gold", 8], ["2nd · Silver", 7], ["3rd · Bronze", 6]];
    return T("Permutation = arrangement (order matters)") + sp(26) + '<div class="row" style="gap:16px">' + places.map(function (p, i) { return cardT(p[0], p[1] + " choices", "", 0.2 + i * 0.12, 210, COLS[i]); }).join("") + "</div>" + sp(20) + eq("8 × 7 × 6 = <span class='t'>336</span>", 0.55, 42) + sp(12) + boxed("ⁿPᵣ = n! ÷ (n − r)! &nbsp;→&nbsp; ⁸P₃ = 336", 0.75, 30);
  } },
  { tag: "Permutations", draw: function () {
    return T("With repetition: nʳ") + sp(40) + '<div class="row" ' + rv(0.25) + ">" + [0, 1, 2, 3].map(function (i) { return '<span class="chip" style="min-width:90px;height:90px;font-size:22px;flex-direction:column;line-height:1.1">0–9<small style="font-size:15px;color:var(--orange)">10 ways</small></span>'; }).join("") + "</div>" + sp(30) + boxed("10 × 10 × 10 × 10 = 10⁴ = 10,000", 0.65, 32);
  } },
  { tag: "Permutations", draw: function () {
    return T("Identical items: divide by their factorials") + sp(30) + chipsRow("ACCOUNT".split(""), 0.15, 0.03, [1, 2]) + sp(20) + note("C appears twice", 0.42) + sp(24) + boxed("7! ÷ 2! = 5,040 ÷ 2 = 2,520", 0.7, 34);
  } },
  { tag: "Circular arrangements", draw: function () {
    var W = 300, c = 150, R = 95, n = 6, s = '<circle cx="' + c + '" cy="' + c + '" r="62" fill="#EEF2F7" stroke="#C9D2E0" stroke-width="2"/>';
    for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + 2 * Math.PI * i / n, x = c + R * Math.cos(a), y = c + R * Math.sin(a), q = k(0.12 + i * 0.05); s += '<circle cx="' + x + '" cy="' + y + '" r="26" fill="' + (i === 0 ? "#F28C28" : "#1F9A94") + '" opacity="' + q + '"/><text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#fff" font-family="Outfit" opacity="' + q + '">' + "ABCDEF"[i] + "</text>"; }
    return T("Round a table: (n − 1)!") + sp(14) + side('<div style="text-align:center">' + note("Fix A, arrange the other 5", 0.35) + sp(16) + boxed("5! = 120", 0.55) + sp(16) + note("Necklace: (n − 1)! ÷ 2", 0.82, true) + "</div>", '<svg width="' + W + '" height="' + W + '" viewBox="0 0 ' + W + " " + W + '">' + s + "</svg>", 360);
  } },
  { tag: "Combinations", draw: function () {
    return T("Combination = selection (order doesn't matter)") + sp(30) + eq("Arrangements of 3 from 8 = 336", 0.12, 36) + down(0.3, "÷ 3! (the 6 orders of the same 3)") + eq("Selections = 336 ÷ 6", 0.4, 36) + sp(14) + boxed("ⁿCᵣ = n! ÷ [r!(n − r)!] &nbsp;→&nbsp; ⁸C₃ = 56", 0.65, 30);
  } },
  { tag: "Combinations", draw: function () {
    return T("Two useful facts") + sp(30) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("Complementary", "ⁿCᵣ = ⁿCₙ₋ᵣ", "¹⁰C₈ = ¹⁰C₂ = 45", 0.08, 330, "var(--teal)") + cardT("At least one of n", "2ⁿ − 1", "4 items → 15 ways", 0.55, 330, "var(--orange)") + "</div>";
  } },
  { tag: "Worked example", draw: function () {
    return T("At least one woman") + sp(10) + '<div class="row">' + pill("5 men", 0.05, "n") + pill("4 women", 0.08, "o") + pill("choose 3", 0.11, "l") + "</div>" + sp(20) +
      '<div class="row" style="gap:18px;align-items:stretch">' + cardT("All committees", "⁹C₃ = 84", "", 0.3, 240) + '<b class="m" style="font-size:40px;align-self:center" ' + rv(0.5) + ">−</b>" + cardT("No woman (all men)", "⁵C₃ = 10", "", 0.52, 260, "var(--orange)") + "</div>" + sp(20) + boxed("At least one woman = 74", 0.8);
  } },
  { tag: "Key question", draw: function () {
    return T("First ask: does order matter?") + sp(40) + '<div class="row" style="gap:26px;align-items:stretch">' + cardT("Yes: arranging", "Permutation ⁿPᵣ", "seats, ranks, codes, words", 0.35, 330, "var(--teal)") + cardT("No: choosing", "Combination ⁿCᵣ", "teams, committees, samples", 0.62, 330, "var(--orange)") + "</div>";
  } },
  mcqScene("In how many ways can 4 books be chosen from 7?", ["35", "210", "28", "840"], 0, "Order does not matter: ⁷C₄ = ⁷C₃ = (7 × 6 × 5) ÷ 6 = 35."),
  recapScene([["Multiply for “and”, add for “or”", "3 × 4 = 12"], ["Arrangements", "ⁿPᵣ = n!/(n − r)!"], ["Round a table", "(n − 1)!"], ["Selections", "ⁿCᵣ = n!/[r!(n − r)!]"]])
];
