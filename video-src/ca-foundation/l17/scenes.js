/* Lesson 1.7 — Sets, Relations, Functions, Limits and Continuity */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Sets, Functions &amp; Limits</b>" };
/* Venn: mode = "union" | "inter" | "diff" | "comp" | null; nums = [onlyA, both, onlyB, outside] */
function venn(mode, q, nums, labels) {
  var W = 420, H = 260, s = '<defs><clipPath id="ca"><circle cx="160" cy="135" r="90"/></clipPath><clipPath id="cb"><circle cx="260" cy="135" r="90"/></clipPath><mask id="notA"><rect width="' + W + '" height="' + H + '" fill="#fff"/><circle cx="160" cy="135" r="90" fill="#000"/></mask><mask id="notB"><rect width="' + W + '" height="' + H + '" fill="#fff"/><circle cx="260" cy="135" r="90" fill="#000"/></mask></defs>';
  s += '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="14" fill="' + (mode === "comp" ? "rgba(242,140,40," + (0.3 * q) + ")" : "#fff") + '" stroke="#C9D2E0" stroke-width="2"/><text x="18" y="30" font-size="18" font-weight="700" fill="#6B7590" font-family="Outfit">U</text>';
  var o = (0.45 * q).toFixed(3);
  if (mode === "union") s += '<circle cx="160" cy="135" r="90" fill="#F28C28" opacity="' + o + '"/><circle cx="260" cy="135" r="90" fill="#F28C28" opacity="' + o + '" mask="url(#notA)"/>';
  if (mode === "inter") s += '<circle cx="260" cy="135" r="90" fill="#F28C28" opacity="' + o + '" clip-path="url(#ca)"/>';
  if (mode === "diff") s += '<circle cx="160" cy="135" r="90" fill="#F28C28" opacity="' + o + '" mask="url(#notB)"/>';
  if (mode === "comp") s += '<circle cx="160" cy="135" r="90" fill="#fff"/>';
  s += '<circle cx="160" cy="135" r="90" fill="none" stroke="#1F9A94" stroke-width="3"/><circle cx="260" cy="135" r="90" fill="none" stroke="#1E2A47" stroke-width="3"/>';
  s += '<text x="44" y="56" font-size="20" font-weight="800" fill="#1F9A94" font-family="Outfit">' + ((labels && labels[0]) || "A") + '</text><text x="376" y="56" text-anchor="end" font-size="20" font-weight="800" fill="#1E2A47" font-family="Outfit">' + ((labels && labels[1]) || "B") + "</text>";
  if (mode === "comp") s += '<circle cx="160" cy="135" r="90" fill="none" stroke="#1F9A94" stroke-width="3"/>';
  if (nums) [[118, nums[0]], [210, nums[1]], [302, nums[2]]].forEach(function (p, i) { s += '<text x="' + p[0] + '" y="146" text-anchor="middle" font-size="32" font-weight="800" fill="#1E2A47" font-family="Outfit" opacity="' + k(0.15 + i * 0.12) + '">' + p[1] + "</text>"; });
  if (nums && nums[3] !== undefined) s += '<text x="' + (W - 22) + '" y="' + (H - 18) + '" text-anchor="end" font-size="22" font-weight="800" fill="#F28C28" font-family="Outfit" opacity="' + k(0.75) + '">neither: ' + nums[3] + "</text>";
  return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
}
function mapping(at) {
  var s = '<rect x="10" y="10" width="110" height="200" rx="40" fill="#E3F2F1" stroke="#1F9A94" stroke-width="2"/><rect x="260" y="10" width="110" height="200" rx="40" fill="#FDEBD8" stroke="#F28C28" stroke-width="2"/>';
  var A = [1, 2, 3], B = [5, 7, 9], ys = [55, 110, 165];
  A.forEach(function (v, i) { s += '<text x="65" y="' + (ys[i] + 7) + '" text-anchor="middle" font-size="24" font-weight="800" fill="#1E2A47" font-family="Outfit">' + v + '</text><text x="315" y="' + (ys[i] + 7) + '" text-anchor="middle" font-size="24" font-weight="800" fill="#1E2A47" font-family="Outfit">' + B[i] + "</text>"; var q = k(at + i * 0.08); s += '<line x1="88" y1="' + ys[i] + '" x2="' + (88 + 190 * q) + '" y2="' + ys[i] + '" stroke="#1E2A47" stroke-width="3" marker-end="url(#ah)"/>'; });
  return '<svg width="380" height="220" viewBox="0 0 380 220"><defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1E2A47"/></marker></defs>' + s + '<text x="65" y="0" font-size="1">.</text></svg>';
}
var SCENES = [
  introScene("Sets, Relations, Functions,<br>Limits &amp; Continuity", "CA Foundation · Quantitative Aptitude · Lesson 1.7", ["Sets", "Relations", "Functions", "Limits"]),
  { tag: "Sets", draw: function () {
    return T("What is a set?") + sp(36) + '<div class="row" style="gap:22px;align-items:stretch">' + cardT("Roster form", "{a, e, i, o, u}", "list the elements", 0.2, 330, "var(--teal)") + cardT("Set-builder form", "{x : x is a vowel}", "describe by a rule", 0.6, 330, "var(--orange)") + "</div>";
  } },
  { tag: "Sets", draw: function () {
    var subs = ["∅", "{1}", "{2}", "{3}", "{1,2}", "{1,3}", "{2,3}", "{1,2,3}"];
    return T("Power set: all the subsets") + sp(20) + '<div class="row">' + note("Empty set ∅", 0.05, true) + note("Subset A ⊆ B", 0.1, true) + note("Universal set U", 0.15, true) + "</div>" + sp(22) + chipsRow(subs, 0.5, 0.03) + sp(22) + boxed("n elements → 2ⁿ subsets: 2³ = 8", 0.8, 30);
  } },
  { tag: "Set operations", draw: function () {
    var m = LT < LD * 0.3 ? "union" : LT < LD * 0.5 ? "inter" : LT < LD * 0.72 ? "diff" : "comp", lab = { union: "A ∪ B: in either", inter: "A ∩ B: in both", diff: "A − B: in A, not B", comp: "A′: outside A" }[m];
    var st = { union: 0.05, inter: 0.3, diff: 0.5, comp: 0.72 }[m];
    return T("Four set operations") + sp(16) + venn(m, k(st)) + sp(14) + boxed(lab, st, 30);
  } },
  { tag: "Counting", draw: function () {
    return T("Counting a union") + sp(40) + boxed("n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", 0.2, 36) + sp(30) + note("The overlap is counted in both n(A) and n(B), so subtract it once", 0.55);
  } },
  { tag: "Worked example", draw: function () {
    return side(T2("100 students") + sp(10) + eq("60 + 50 − 20", 0.3, 32) + eq("= <span class='t'>90</span> like at least one", 0.45, 28) + sp(10) + boxed("Neither = 10", 0.75, 28) + sp(10) + '<div class="m" style="font-size:18px;font-weight:600" ' + rv(0.5) + '>Only Accounts 40 · Both 20 · Only Economics 30</div>', venn(null, 0, [40, 20, 30, 10], ["Accounts", "Economics"]), 340);
  } },
  { tag: "Set operations", draw: function () {
    return T("De Morgan's laws") + sp(40) + card(eq("(A ∪ B)′ = A′ ∩ B′", 0.15, 44), 0.12, 560) + sp(20) + card(eq("(A ∩ B)′ = A′ ∪ B′", 0.6, 44), 0.58, 560);
  } },
  { tag: "Relations", draw: function () {
    return T("Cartesian product and relations") + sp(14) + eq("A = {1, 2}, B = {a, b, c}", 0.05, 30) + eq("A × B = {(1,a), (1,b), (1,c), (2,a), (2,b), (2,c)}", 0.12, 26, "t") + sp(6) + note("n(A × B) = 2 × 3 = 6 · a relation is any subset", 0.3) + sp(20) +
      '<div class="row" style="gap:14px">' + pill("Reflexive", 0.62, "") + pill("Symmetric", 0.67, "o") + pill("Transitive", 0.72, "n") + "</div>" + sp(16) + boxed("All three → equivalence relation", 0.82, 28);
  } },
  { tag: "Functions", draw: function () {
    return side(T2("Function: one output per input") + sp(14) + note("One-one: different inputs → different outputs", 0.4, true) + sp(8) + note("Onto: every value is reached", 0.6, true) + sp(8) + note("Both → inverse exists", 0.8), mapping(0.1), 400);
  } },
  { tag: "Functions", draw: function () {
    return T("Example: f(x) = 2x + 3") + sp(28) + eq("f(4) = 2(4) + 3 = <span class='t'>11</span>", 0.08, 40) + sp(16) + eq("y = 2x + 3 &nbsp;⟹&nbsp; x = (y − 3) ÷ 2", 0.4, 36) + sp(14) + boxed("f⁻¹(x) = (x − 3) ÷ 2", 0.7);
  } },
  { tag: "Limits", draw: function () {
    return T("Limits: simplify 0/0 first") + sp(20) + eq("lim<sub>x→2</sub> (x² − 4) ÷ (x − 2)", 0.12, 38) + note("Substituting gives 0/0", 0.3) + sp(10) + eq("= lim<sub>x→2</sub> (x − 2)(x + 2) ÷ (x − 2)", 0.5, 34) + eq("= lim<sub>x→2</sub> (x + 2)", 0.62, 34) + sp(8) + boxed("= 4", 0.8);
  } },
  { tag: "Limits", draw: function () {
    return T("Two standard limits") + sp(30) + card(eq("lim<sub>x→a</sub> (xⁿ − aⁿ) ÷ (x − a) = n·aⁿ⁻¹", 0.1, 36) + '<div class="m" style="font-size:20px;font-weight:600">e.g. lim<sub>x→1</sub> (x⁵ − 1)/(x − 1) = 5</div>', 0.05, 720) + sp(20) + card(eq("(1 + 1/n)ⁿ → e ≈ 2.718", 0.6, 36), 0.58, 720);
  } },
  { tag: "Continuity", draw: function () {
    var W = 560, H = 220, s = '<line x1="20" y1="190" x2="' + (W - 20) + '" y2="190" stroke="#1E2A47" stroke-width="2"/>', g = ease((LT - 0.1 * LD) / 1.5);
    var path = ""; for (var x = 0; x <= 1.0001; x += 0.02) { if (x > g) break; var px = 30 + x * (W - 60), py = 170 - 120 * (0.5 + 0.4 * Math.sin(x * 5)); path += (path ? "L" : "M") + px + "," + py; }
    s += '<path d="' + path + '" fill="none" stroke="#1F9A94" stroke-width="5" stroke-linecap="round"/>';
    return T("Continuity: no break in the graph") + sp(14) + '<div class="row">' + note("f(a) exists", 0.3, true) + note("the limit exists", 0.45, true) + note("they are equal", 0.6, true) + "</div>" + sp(16) + '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
  } },
  mcqScene("n(A) = 3 and n(B) = 4. How many relations are there from A to B?", ["4,096", "12", "81", "64"], 0, "A × B has 3 × 4 = 12 pairs; every subset is a relation: 2¹² = 4,096."),
  recapScene([["Count the overlap once", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)"], ["Power set", "2ⁿ subsets"], ["Function", "one output per input"], ["Limits", "simplify 0/0 first"]])
];
