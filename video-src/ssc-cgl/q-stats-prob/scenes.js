/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Statistics & probability</b>"};
var SPEC = [
{
"k": "intro",
"title": "Statistics & probability",
"sub": "SSC CGL · Quantitative Aptitude · Tier 2",
"pills": [
"Mean",
"Median & mode",
"Spread",
"Probability"
]
},
{
"k": "eq",
"t": "Mean",
"lines": [
"Mean = Σx ÷ n",
"With frequencies: Σfx ÷ Σf"
],
"box": "4, 8, 6, 10, 12 → 8",
"note": "x 1–4, f 3, 5, 8, 4 → 53 ÷ 20 = 2.65"
},
{
"k": "two",
"t": "Median and mode",
"a": [
"Median",
"middle after sorting",
"3, 5, 7, 9, 11, 13 → 8"
],
"b": [
"Mode",
"most frequent",
"2, 3, 3, 5, 5, 5, 7 → 5"
]
},
{
"k": "eq",
"t": "Empirical relation",
"lines": [
"Mode = 3 Median − 2 Mean",
"Mean 20, median 22"
],
"box": "Mode = 66 − 40 = 26",
"note": "Use it when two of the three are given"
},
{
"k": "list",
"t": "Spread",
"items": [
[
"Range",
"largest − smallest"
],
[
"Variance",
"Σ(x − mean)² ÷ n"
],
[
"Add c to all",
"SD unchanged"
],
[
"Multiply by k",
"SD × k, variance × k²"
]
],
"w": 720
},
{
"k": "eq",
"t": "Probability",
"lines": [
"P = favourable ÷ total",
"P(not A) = 1 − P(A)"
],
"box": "Two coins: P(at least one head) = 3/4",
"note": "0 ≤ P ≤ 1"
},
{
"k": "chips",
"t": "Two dice: 36 outcomes",
"items": [
"Sum 7 → 6/36 = 1/6",
"Sum 10 → 3/36 = 1/12",
"Double → 6/36",
"At least one 6 → 11/36"
],
"note": "List the pairs when unsure"
},
{
"k": "mcq",
"q": "A card is drawn from a pack of 52. P(king) = ?",
"opts": [
"1/13",
"1/52",
"4/13",
"1/4"
],
"why": "4 kings ÷ 52 cards = 1/13"
},
{
"k": "recap",
"items": [
[
"Median",
"sort first"
],
[
"Mode",
"3 Median − 2 Mean"
],
[
"SD",
"shift-proof"
],
[
"Probability",
"favourable ÷ total"
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
