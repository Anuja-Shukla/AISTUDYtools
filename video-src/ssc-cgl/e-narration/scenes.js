/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 English Language \u00b7 <b>Direct & indirect speech</b>"};
var SPEC = [
{
"k": "intro",
"title": "Direct & Indirect Speech",
"sub": "SSC CGL · English · Topic 9",
"pills": [
"Tense",
"Pronouns",
"Questions",
"Commands"
]
},
{
"k": "chips",
"t": "Four changes",
"items": [
"Reporting verb",
"Tense",
"Pronouns",
"Time words"
]
},
{
"k": "table",
"t": "One step back",
"head": [
"Direct",
"Indirect"
],
"rows": [
[
"am / is",
"was"
],
[
"are",
"were"
],
[
"has / have",
"had"
],
[
"will / can",
"would / could"
]
],
"w": 540
},
{
"k": "table",
"t": "Time and place",
"head": [
"Direct",
"Indirect"
],
"rows": [
[
"now",
"then"
],
[
"tomorrow",
"the next day"
],
[
"yesterday",
"the day before"
],
[
"here / this",
"there / that"
]
],
"w": 560
},
{
"k": "eq",
"t": "Questions",
"lines": [
"“Where are you going?”",
"asked + wh-word + statement order"
],
"box": "He asked me where I was going",
"note": "Yes/no → if or whether"
},
{
"k": "two",
"t": "Commands and requests",
"a": [
"Command",
"told me to …",
"not to …"
],
"b": [
"Request",
"requested me to …",
"for “please”"
]
},
{
"k": "eq",
"t": "No change",
"lines": [
"Universal truth",
"The earth moves round the sun"
],
"box": "Tense stays the same",
"note": "Also when the reporting verb is present"
},
{
"k": "mcq",
"q": "She said, “I will come tomorrow.”",
"opts": [
"She said that she would come the next day.",
"She said that she will come tomorrow.",
"She said that she would come tomorrow.",
"She said that she will come the next day."
],
"why": "will → would; tomorrow → the next day"
},
{
"k": "recap",
"items": [
[
"Verb",
"said, told, asked, requested"
],
[
"Tense",
"one step back"
],
[
"Words",
"now → then"
],
[
"Questions",
"statement order"
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
