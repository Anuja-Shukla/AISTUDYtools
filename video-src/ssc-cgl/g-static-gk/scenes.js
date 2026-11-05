/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 General Awareness \u00b7 <b>Static GK</b>"};
var SPEC = [
{
"k": "intro",
"title": "Static GK",
"sub": "SSC CGL · General Awareness · Topic 8",
"pills": [
"Days",
"Books",
"Symbols",
"Awards"
]
},
{
"k": "chips",
"t": "Facts that do not change",
"items": [
"Days",
"Books",
"Symbols",
"Awards",
"Sports terms"
]
},
{
"k": "table",
"t": "Important days",
"head": [
"Date",
"Day"
],
"rows": [
[
"28 Feb",
"National Science Day"
],
[
"5 Jun",
"World Environment Day"
],
[
"21 Jun",
"International Yoga Day"
],
[
"29 Aug",
"National Sports Day"
]
],
"w": 600
},
{
"k": "table",
"t": "More days",
"head": [
"Date",
"Day"
],
"rows": [
[
"5 Sep",
"Teachers’ Day"
],
[
"14 Nov",
"Children’s Day"
],
[
"26 Nov",
"Constitution Day"
]
],
"w": 560
},
{
"k": "list",
"t": "Books and authors",
"items": [
[
"Gitanjali",
"Tagore"
],
[
"Godaan",
"Premchand"
],
[
"The Discovery of India",
"Nehru"
],
[
"Wings of Fire",
"Kalam"
]
]
},
{
"k": "chips",
"t": "National symbols",
"items": [
"Tiger",
"Peacock",
"Lotus",
"Ganges river dolphin",
"Banyan"
]
},
{
"k": "two",
"t": "Awards and sports",
"a": [
"Bharat Ratna",
"highest civilian",
"Arjuna: sportspersons"
],
"b": [
"Sports terms",
"checkmate: chess",
"bogey: golf"
]
},
{
"k": "mcq",
"q": "National Science Day is on:",
"opts": [
"28 February",
"5 June",
"29 August",
"14 November"
],
"why": "Raman effect"
},
{
"k": "recap",
"items": [
[
"Days",
"month by month"
],
[
"Books",
"author pairs"
],
[
"Symbols",
"as a list"
],
[
"Winners",
"check yearly"
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
