/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Ratio & proportion</b>"};
var SPEC = [
{
"k": "intro",
"title": "Ratio & proportion",
"sub": "SSC CGL · Quantitative Aptitude · Topic 4",
"pills": [
"Parts",
"Sharing",
"Joining ratios",
"Proportion"
]
},
{
"k": "eq",
"t": "A ratio compares like with like",
"lines": [
"45 minutes : 2 hours",
"= 45 : 120"
],
"box": "= 3 : 8",
"note": "Same units first, then divide by the HCF"
},
{
"k": "chips",
"t": "Share ₹1,800 in 2 : 3 : 4",
"items": [
"9 parts",
"1 part = ₹200",
"₹400",
"₹600",
"₹800"
],
"note": "Add the parts → find one part → multiply"
},
{
"k": "eq",
"t": "Joining two ratios",
"lines": [
"A : B = 2 : 3   (× 4)",
"B : C = 4 : 5   (× 3)"
],
"box": "A : B : C = 8 : 12 : 15",
"note": "Make the common term B equal: LCM of 3 and 4 is 12"
},
{
"k": "list",
"t": "Proportion a : b :: c : d",
"items": [
[
"Rule",
"a × d = b × c"
],
[
"Fourth proportional",
"bc ÷ a"
],
[
"Third proportional",
"b² ÷ a"
],
[
"Mean proportional",
"√(ab)"
]
],
"w": 760
},
{
"k": "eq",
"t": "Add x to change a ratio",
"lines": [
"(7 + x) : (11 + x) = 3 : 4",
"4(7 + x) = 3(11 + x)"
],
"box": "x = 5  →  12 : 16 = 3 : 4",
"note": "In the exam, test the options"
},
{
"k": "two",
"t": "Direct and inverse",
"a": [
"Direct",
"8 pens ₹96 → 14 pens ₹168",
"both rise together"
],
"b": [
"Inverse",
"12 men 10 days → 15 men 8 days",
"men × days stays the same"
]
},
{
"k": "mcq",
"q": "Two numbers are in the ratio 5 : 7 and add up to 96. The larger is…",
"opts": [
"56",
"40",
"48",
"64"
],
"why": "12 parts = 96, 1 part = 8, 7 parts = 56"
},
{
"k": "recap",
"items": [
[
"Units",
"same units, then simplify"
],
[
"Share",
"find one part"
],
[
"Join",
"make the common term equal"
],
[
"Proportion",
"ad = bc"
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
