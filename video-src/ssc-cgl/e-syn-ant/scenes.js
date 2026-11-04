/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 English Language \u00b7 <b>Synonyms & antonyms</b>"};
var SPEC = [
{
"k": "intro",
"title": "Synonyms & Antonyms",
"sub": "SSC CGL · English · Topic 3",
"pills": [
"Same",
"Opposite",
"Roots",
"Prefixes"
]
},
{
"k": "two",
"t": "Read the instruction",
"a": [
"Synonym",
"same meaning",
"big → large"
],
"b": [
"Antonym",
"opposite meaning",
"big → small"
]
},
{
"k": "table",
"t": "Learn in groups",
"head": [
"Idea",
"Words"
],
"rows": [
[
"plenty",
"abundant, ample"
],
[
"honest",
"candid, frank"
],
[
"hardworking",
"diligent"
],
[
"kind",
"benevolent"
]
],
"w": 600
},
{
"k": "list",
"t": "Roots",
"items": [
[
"bene",
"good"
],
[
"mal",
"bad"
],
[
"loqu",
"speak"
],
[
"chron",
"time"
]
]
},
{
"k": "chips",
"t": "Prefixes for opposites",
"chips": [
"un-",
"dis-",
"in-",
"im- (b, m, p)",
"il- (l)",
"ir- (r)"
]
},
{
"k": "table",
"t": "Antonym pairs",
"head": [
"Word",
"Opposite"
],
"rows": [
[
"ancient",
"modern"
],
[
"hostile",
"friendly"
],
[
"expand",
"contract"
],
[
"transparent",
"opaque"
]
],
"w": 560
},
{
"k": "eq",
"t": "Unsure?",
"lines": [
"Make a short sentence",
"with the word"
],
"box": "Feel the meaning",
"note": "Then eliminate"
},
{
"k": "mcq",
"q": "Choose the antonym of TIMID.",
"opts": [
"Bold",
"Shy",
"Nervous",
"Quiet"
],
"why": "Timid = shy"
},
{
"k": "recap",
"items": [
[
"Instruction",
"same or opposite"
],
[
"Groups",
"learn together"
],
[
"Roots",
"guess unknowns"
],
[
"Prefixes",
"im, il, ir"
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
