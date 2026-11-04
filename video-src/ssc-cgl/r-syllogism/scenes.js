/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 General Intelligence & Reasoning \u00b7 <b>Syllogism</b>"};
var SPEC = [
{
"k": "intro",
"title": "Syllogism",
"sub": "SSC CGL · Reasoning · Topic 9",
"pills": [
"All",
"Some",
"No",
"Either-or"
]
},
{
"k": "eq",
"t": "The golden rule",
"lines": [
"Statements are always true",
"Check every possible diagram"
],
"box": "Follows = true in all of them",
"note": "Ignore real-world knowledge"
},
{
"k": "table",
"t": "Four statement types",
"head": [
"Statement",
"Diagram"
],
"rows": [
[
"All A are B",
"A inside B"
],
[
"Some A are B",
"overlap"
],
[
"No A is B",
"apart"
],
[
"Some A are not B",
"part of A outside"
]
],
"w": 600
},
{
"k": "list",
"t": "Conversions",
"items": [
[
"All A are B",
"Some B are A"
],
[
"Some A are B",
"Some B are A"
],
[
"No A is B",
"No B is A"
]
]
},
{
"k": "table",
"t": "Combining statements",
"head": [
"1",
"2",
"Conclusion"
],
"rows": [
[
"All",
"All",
"All"
],
[
"All",
"No",
"No"
],
[
"Some",
"All",
"Some"
],
[
"Some",
"No",
"Some not"
],
[
"Some",
"Some",
"none"
]
],
"w": 600
},
{
"k": "flow",
"t": "Worked example",
"steps": [
"Roses ⊂ Flowers",
"Flowers apart from Trees"
],
"note": "So no rose is a tree"
},
{
"k": "two",
"t": "Either-or pairs",
"a": [
"Some A are B",
"or",
"No A is B"
],
"b": [
"All A are B",
"or",
"Some A are not B"
]
},
{
"k": "mcq",
"q": "Some boys are tall; some tall are players. I: Some boys are players. II: No boy is a player.",
"opts": [
"Either I or II",
"Only I",
"Neither",
"Both"
],
"why": "Indefinite, but I and II cover every case"
},
{
"k": "recap",
"items": [
[
"Diagram",
"smallest that fits"
],
[
"Break it",
"try a counter-diagram"
],
[
"Convert",
"All → Some, No → No"
],
[
"Either-or",
"Some / No pairs"
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
