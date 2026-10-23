/* Lesson 2.4 — Blood Relations */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Blood Relations</b>" };
/* family-tree node: m = male (square), f = female (circle) */
function node(x, y, sex, label, q, hlOn) { var col = hlOn ? "#F28C28" : (sex === "m" ? "#1E2A47" : "#1F9A94"); return '<g opacity="' + q.toFixed(3) + '">' + (sex === "m" ? '<rect x="' + (x - 26) + '" y="' + (y - 26) + '" width="52" height="52" rx="8" fill="' + col + '"/>' : '<circle cx="' + x + '" cy="' + y + '" r="27" fill="' + col + '"/>') + '<text x="' + x + '" y="' + (y + 50) + '" text-anchor="middle" font-size="18" font-weight="700" fill="#1E2A47" font-family="Outfit">' + label + "</text></g>"; }
function link(x1, y1, x2, y2, q, dbl) { return '<g opacity="' + q.toFixed(3) + '">' + (dbl ? '<line x1="' + x1 + '" y1="' + (y1 - 4) + '" x2="' + x2 + '" y2="' + (y2 - 4) + '" stroke="#6B7590" stroke-width="3"/><line x1="' + x1 + '" y1="' + (y1 + 4) + '" x2="' + x2 + '" y2="' + (y2 + 4) + '" stroke="#6B7590" stroke-width="3"/>' : '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#6B7590" stroke-width="3"/>') + "</g>"; }
function svgBox(W, H, s) { return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>"; }
var SCENES = [
  introScene("Blood Relations", "CA Foundation · Quantitative Aptitude · Lesson 2.4", ["Generations", "Key names", "Family trees", "Coded relations"]),
  { tag: "Basics", draw: function () {
    return T("Track two things at every step") + sp(40) + '<div class="row" style="gap:26px;align-items:stretch">' + cardT("Generation", "↑ up · → level · ↓ down", "parents, siblings, children", 0.3, 340, "var(--teal)") + cardT("Gender", "male or female?", "only if it is stated", 0.55, 340, "var(--orange)") + "</div>";
  } },
  { tag: "Generations", draw: function () {
    var rows = [["+2", "Grandparents"], ["+1", "Parents, uncles, aunts"], ["0", "You, siblings, cousins"], ["−1", "Children, nephews, nieces"], ["−2", "Grandchildren"]];
    return T("Think in generations") + sp(18) + '<div style="display:flex;flex-direction:column;gap:10px;width:620px">' + rows.map(function (r, i) { return '<div ' + rv(0.12 + i * 0.15) + ' style="display:flex;align-items:center;gap:16px;background:' + (i === 2 ? "var(--orange-soft)" : "#fff") + ';border-radius:12px;padding:10px 18px;box-shadow:0 4px 14px -10px rgba(30,42,71,.3)"><b style="width:50px;font-size:26px;color:' + (i === 2 ? "var(--orange)" : "var(--teal)") + '">' + r[0] + '</b><span style="font-size:24px;font-weight:600;color:var(--navy)">' + r[1] + "</span></div>"; }).join("") + "</div>";
  } },
  { tag: "Key names", draw: function () {
    return T("Key relation names") + sp(24) + listOf([["Parent's brother / sister", "uncle / aunt"], ["Uncle's or aunt's child", "cousin"], ["Sibling's son / daughter", "nephew / niece"]], 0.12, 0.27, 740, 25);
  } },
  { tag: "In-laws", draw: function () {
    return T("The in-laws") + sp(24) + listOf([["Spouse's parents", "father- / mother-in-law"], ["Spouse's siblings", "brother- / sister-in-law"], ["Siblings' spouses", "brother- / sister-in-law"], ["Child's spouse", "son- / daughter-in-law"]], 0.12, 0.2, 760, 24);
  } },
  { tag: "Worked example", draw: function () {
    return T("Who is the man?") + sp(40) + card('<div style="font-size:30px;font-weight:700;color:var(--navy);line-height:1.4">“He is the son of my <span class="o">grandfather’s only son</span>.”</div><div class="m" style="font-size:20px;font-weight:600;margin-top:8px">— Riya</div>', 0.1, 680);
  } },
  { tag: "Worked example", draw: function () {
    var W = 420, H = 330, s = "";
    s += node(210, 40, "m", "Grandfather", k(0.05)) + link(210, 66, 210, 120, k(0.2)) + node(210, 146, "m", "only son = Father", k(0.2), hl(0.2) && !hl(0.62)) + link(210, 172, 210, 210, k(0.5)) + link(120, 210, 300, 210, k(0.5)) + link(120, 210, 120, 236, k(0.5)) + link(300, 210, 300, 236, k(0.5));
    s += node(120, 262, "f", "Riya", k(0.5)) + node(300, 262, "m", "the man", k(0.62), hl(0.62));
    return side(T2("Work from the speaker outward") + sp(12) + eq("grandfather's only son", 0.1, 24) + eq("= Riya's father", 0.25, 26, "t") + sp(10) + eq("father's son", 0.55, 24) + boxed("= her brother", 0.7, 30), svgBox(W, H, s), 360);
  } },
  { tag: "Family trees", draw: function () {
    var W = 520, H = 290, s = "";
    s += node(170, 46, "m", "Husband", k(0.2)) + link(198, 46, 322, 46, k(0.45), true) + node(350, 46, "f", "Wife", k(0.25)) + link(260, 50, 260, 140, k(0.65)) + link(170, 140, 350, 140, k(0.65)) + link(170, 140, 170, 170, k(0.65)) + link(350, 140, 350, 170, k(0.65)) + node(170, 196, "m", "Son", k(0.68)) + node(350, 196, "f", "Daughter", k(0.72));
    return T("Draw a family tree") + sp(10) + '<div class="row">' + note("□ or + male", 0.15, true) + note("○ or − female", 0.25, true) + note("═ married couple", 0.45, true) + note("│ down to children", 0.65, true) + "</div>" + sp(10) + svgBox(W, H, s);
  } },
  { tag: "Watch out", draw: function () {
    var W = 420, H = 220, s = node(210, 46, "u", "B = father or mother?", k(0.3)).replace(/<circle[^>]*\/>/, '<circle cx="210" cy="46" r="27" fill="#C9D2E0"/><text x="210" y="56" text-anchor="middle" font-size="28" font-weight="800" fill="#fff" font-family="Outfit">?</text>') + link(210, 74, 210, 130, k(0.35)) + node(210, 156, "f", "A (child)", k(0.35));
    return T("Never assume a gender") + sp(16) + card('<div style="font-size:28px;font-weight:700;color:var(--navy)">“A is the child of B”</div>', 0.1, 520) + sp(10) + svgBox(W, H, s);
  } },
  { tag: "Coded relations", draw: function () {
    return T("Coded relations") + sp(26) + '<div class="row" style="gap:20px">' + cardT("P × Q", "P is the brother of Q", "", 0.15, 330, "var(--teal)") + cardT("P + Q", "P is the mother of Q", "", 0.42, 330, "var(--orange)") + "</div>" + sp(30) + boxed("A × B + C = ?", 0.75, 40);
  } },
  { tag: "Coded relations", draw: function () {
    var W = 360, H = 300, s = node(110, 46, "m", "A", k(0.15), hl(0.65)) + link(138, 46, 222, 46, k(0.15)) + '<text x="180" y="36" text-anchor="middle" font-size="16" font-weight="700" fill="#6B7590" font-family="Outfit" opacity="' + k(0.15) + '">siblings</text>' + node(250, 46, "f", "B", k(0.15)) + link(250, 74, 250, 170, k(0.38)) + node(250, 196, "u", "C", k(0.38)).replace('fill="#1F9A94"', 'fill="#C9D2E0"');
    return side(T2("Decode one symbol at a time") + sp(12) + eq("A × B: A is B's brother", 0.12, 24) + eq("B + C: B is C's mother", 0.35, 24) + sp(10) + boxed("A = C's maternal uncle", 0.65, 26), svgBox(W, H, s), 400);
  } },
  mcqScene("A is B's sister. C is B's mother. D is C's father. How is A related to D?", ["Granddaughter", "Daughter", "Grandmother", "Niece"], 0, "A is a child of C, and C is a child of D, so A is D's granddaughter (A is female: a sister)."),
  recapScene([["Generation and gender", "at every link"], ["Work from the speaker", "“only son” pins it down"], ["Draw a family tree", "□ ○ ═ │"], ["Don't assume gender", "unless it is stated"]])
];
