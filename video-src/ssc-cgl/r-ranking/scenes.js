/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 General Intelligence & Reasoning \u00b7 <b>Order & ranking</b>"};
var SPEC = [
{
"k": "intro",
"title": "Order & Ranking",
"sub": "SSC CGL · Reasoning · Topic 7",
"pills": [
"Rows",
"Ranks",
"Swaps",
"Comparisons"
]
},
{
"k": "eq",
"t": "The one formula",
"lines": [
"left + right − 1 = total",
"counted from both ends"
],
"box": "7 + 18 − 1 = 24",
"note": "7th from top, 18th from bottom"
},
{
"k": "eq",
"t": "Other end",
"lines": [
"total − position + 1",
"Row of 40, 15th from left"
],
"box": "26th from right",
"note": "40 − 15 + 1"
},
{
"k": "flow",
"t": "People between",
"steps": [
"Same end",
"Difference",
"Subtract 1"
],
"note": "10th and 16th from left → 5 between"
},
{
"k": "two",
"t": "Interchange",
"a": [
"Before",
"Riya 12th from left",
"Meena 8th from right"
],
"b": [
"After the swap",
"Riya 18th from left",
"total = 18 + 8 − 1 = 25"
]
},
{
"k": "chips",
"t": "Comparison chain",
"items": [
"D",
">",
"A",
">",
"B",
">",
"C",
">",
"E"
]
},
{
"k": "table",
"t": "Quick results",
"head": [
"Situation",
"Formula"
],
"rows": [
[
"k-th from both ends",
"2k − 1"
],
[
"Ahead of X by n",
"X − n"
],
[
"Behind X by n",
"X + n"
]
],
"w": 560
},
{
"k": "mcq",
"q": "13th from both ends. How many in the row?",
"opts": [
"25",
"26",
"24",
"27"
],
"why": "2 × 13 − 1"
},
{
"k": "recap",
"items": [
[
"Total",
"L + R − 1"
],
[
"Other end",
"N − p + 1"
],
[
"Swap",
"take the other's place"
],
[
"Compare",
"write one chain"
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
