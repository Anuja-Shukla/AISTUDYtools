/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Number system</b>"};
var SPEC = [
{
"k": "intro",
"title": "Number system",
"sub": "SSC CGL · Quantitative Aptitude · Topic 1",
"pills": [
"Divisibility",
"Factors",
"HCF & LCM",
"Unit digits"
]
},
{
"k": "list",
"t": "Types of numbers",
"items": [
[
"Prime",
"exactly two factors: 2, 3, 5, 7, 11 …"
],
[
"Composite",
"more than two factors: 4, 6, 9 …"
],
[
"Co-prime",
"HCF is 1: 8 and 15"
],
[
"Remember",
"1 is neither; 2 is the only even prime"
]
],
"w": 780
},
{
"k": "table",
"t": "Divisibility rules",
"head": [
"Divisor",
"Rule"
],
"rows": [
[
"3 / 9",
"digit sum divisible by 3 / 9"
],
[
"4 / 8",
"last 2 / last 3 digits"
],
[
"6",
"divisible by 2 and 3"
],
[
"11",
"odd-place sum − even-place sum = 0 or 11k"
]
],
"w": 760
},
{
"k": "eq",
"t": "Number of factors",
"lines": [
"Prime powers p, q, r  →  (p+1)(q+1)(r+1)",
"360 = 2³ × 3² × 5"
],
"box": "4 × 3 × 2 = 24 factors",
"note": "Write the number as prime powers first"
},
{
"k": "two",
"t": "HCF and LCM",
"a": [
"HCF: lowest powers",
"HCF = 6",
"12 = 2² × 3, 18 = 2 × 3² → 2 × 3"
],
"b": [
"LCM: highest powers",
"LCM = 36",
"2² × 3² = 36 · HCF × LCM = 12 × 18"
]
},
{
"k": "list",
"t": "Which one to use?",
"items": [
[
"Least, together again",
"LCM"
],
[
"Greatest, largest",
"HCF"
],
[
"Same remainder r",
"LCM + r"
],
[
"Remainders p, q",
"HCF(x − p, y − q)"
]
],
"w": 760
},
{
"k": "eq",
"t": "Unit digit cycles",
"lines": [
"2 → 2, 4, 8, 6     3 → 3, 9, 7, 1",
"7 → 7, 9, 3, 1     8 → 8, 4, 2, 6"
],
"box": "7³⁵: 35 ÷ 4 leaves 3 → unit digit 3",
"note": "Remainder 0 means take the 4th term"
},
{
"k": "mcq",
"q": "Bells ring every 12, 15 and 18 minutes. They ring together again after…",
"opts": [
"3 hours",
"1 hour",
"90 minutes",
"2 hours"
],
"why": "LCM(12, 15, 18) = 180 minutes = 3 hours"
},
{
"k": "recap",
"items": [
[
"Factors",
"(p+1)(q+1)(r+1)"
],
[
"HCF × LCM",
"product of two numbers"
],
[
"Unit digit",
"divide the power by 4"
],
[
"Zeros in n!",
"count the 5s"
]
]
}
];
function R(s) {
  var T_ = s.t ? (s.t.length > 34 ? T2(s.t) : T(s.t)) : "";
  switch (s.k) {
    case "intro": return null;
    case "list": return T(s.t) + sp(24) + listOf(s.items, 0.1, 0.6 / s.items.length, s.w || 720, s.size || 25) + (s.note ? sp(20) + note(s.note, 0.85, true) : "");
    case "grid": return T(s.t) + sp(26) + grid(s.cards, s.cols || Math.min(3, s.cards.length), 0.1, 0.55 / s.cards.length, s.w || (s.cards.length >= 3 ? 250 : 330)) + (s.note ? sp(20) + note(s.note, 0.85) : "");
    case "table": return T(s.t) + sp(18) + table(s.head, s.rows, 0.06, 0.6 / (s.rows.length + 1), s.hl === undefined ? -1 : s.hl, s.w || 760) + (s.note ? sp(14) + note(s.note, 0.88, true) : "");
    case "eq": var n = s.lines.length, h = T(s.t) + sp(22);
      s.lines.forEach(function (l, i) { h += eq(l, 0.08 + i * (0.5 / Math.max(n, 1)), s.size || 27); });
      if (s.box) h += sp(16) + boxed(s.box, 0.66, 30);
      if (s.note) h += sp(14) + note(s.note, 0.84, true);
      return h;
    case "two": return T(s.t) + sp(30) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT(s.a[0], s.a[1], s.a[2] || "", 0.12, 360, "var(--teal)") + cardT(s.b[0], s.b[1], s.b[2] || "", 0.45, 360, "var(--orange)") + "</div>" + (s.note ? sp(24) + note(s.note, 0.8) : "");
    case "flow": var f = '<div class="row" style="gap:6px;flex-wrap:wrap;justify-content:center">', m = s.steps.length;
      s.steps.forEach(function (x, i) { f += pill(x, 0.08 + i * (0.6 / m), i % 2 ? "n" : ""); if (i < m - 1) f += arrow(0.12 + i * (0.6 / m)); });
      return T(s.t) + sp(34) + f + "</div>" + (s.note ? sp(30) + note(s.note, 0.82) : "");
    case "chips": return T(s.t) + sp(34) + chipsRow(s.items, 0.1, 0.6 / s.items.length) + (s.note ? sp(28) + note(s.note, 0.84, true) : "");
  }
  return T(s.t || "");
}
var SCENES = SPEC.map(function (s) {
  if (s.k === "intro") return introScene(s.title, s.sub, s.pills);
  if (s.k === "mcq") return mcqScene(s.q, s.opts, 0, s.why);
  if (s.k === "recap") return recapScene(s.items, s.last);
  return { tag: s.tag || "Lesson", draw: function () { return R(s); } };
});
