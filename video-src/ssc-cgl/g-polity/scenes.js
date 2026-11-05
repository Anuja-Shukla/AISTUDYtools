/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 General Awareness \u00b7 <b>Indian polity</b>"};
var SPEC = [
{
"k": "intro",
"title": "Indian Polity",
"sub": "SSC CGL · General Awareness · Topic 2",
"pills": [
"Constitution",
"Rights",
"Parliament",
"Emergency"
]
},
{
"k": "two",
"t": "Key dates",
"a": [
"Adopted",
"26 November 1949",
"Constitution Day"
],
"b": [
"In force",
"26 January 1950",
"Republic Day"
]
},
{
"k": "table",
"t": "Key parts",
"head": [
"Part",
"Subject"
],
"rows": [
[
"III",
"Fundamental Rights"
],
[
"IV",
"Directive Principles"
],
[
"IV-A",
"Fundamental Duties"
]
],
"w": 520
},
{
"k": "table",
"t": "Key rights",
"head": [
"Article",
"Right"
],
"rows": [
[
"14",
"equality before law"
],
[
"17",
"abolition of untouchability"
],
[
"21",
"life and personal liberty"
],
[
"32",
"constitutional remedies"
]
],
"w": 600
},
{
"k": "eq",
"t": "Fundamental Duties",
"lines": [
"Added by the 42nd Amendment (1976)",
"11th added in 2002"
],
"box": "11 duties",
"note": "Article 51A"
},
{
"k": "chips",
"t": "Minimum ages",
"items": [
"Lok Sabha 25",
"Rajya Sabha 30",
"President 35"
]
},
{
"k": "list",
"t": "Emergency articles",
"items": [
[
"352",
"national emergency"
],
[
"356",
"President’s Rule"
],
[
"360",
"financial emergency"
],
[
"368",
"amendment"
]
]
},
{
"k": "mcq",
"q": "Article 21 deals with:",
"opts": [
"Protection of life and personal liberty",
"Right to equality",
"Abolition of untouchability",
"Right to education"
],
"why": "Article 21"
},
{
"k": "recap",
"items": [
[
"Dates",
"1949 and 1950"
],
[
"Parts",
"III, IV, IV-A"
],
[
"Articles",
"14, 17, 21, 32"
],
[
"Ages",
"25, 30, 35"
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
