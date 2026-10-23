/* Lesson 2.1 — Number Series, Coding–Decoding and Odd Man Out */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Series, Coding &amp; Odd Man Out</b>" };
function series(nums, at, step, nextAt, nextVal) { return '<div class="row">' + nums.map(function (x, i) { return '<span class="chip" ' + rvs(at + i * step) + ">" + x + "</span>"; }).join("") + '<span class="chip" ' + rvs(nextAt) + ' style="background:var(--teal);color:#fff;border-top-color:var(--teal)">' + (hl(nextAt) ? nextVal : "?") + "</span></div>"; }
function under(labels, at, step) { return '<div class="row" style="gap:46px;margin-top:4px">' + labels.map(function (g, i) { return '<b ' + rv(at + i * step, 0) + ' style="font-size:22px;color:var(--orange)">' + g + "</b>"; }).join("") + "</div>"; }
function letters(word, at, step, sub, subCol) { return '<div class="row" style="gap:10px">' + word.split("").map(function (c, i) { return '<div ' + rvs(at + i * step) + ' style="display:flex;flex-direction:column;align-items:center;gap:4px"><span class="chip">' + c + '</span>' + (sub ? '<b style="font-size:20px;color:' + (subCol || "var(--orange)") + '">' + sub[i] + "</b>" : "") + "</div>"; }).join("") + "</div>"; }
var SCENES = [
  introScene("Number Series, Coding–Decoding<br>&amp; Odd Man Out", "CA Foundation · Quantitative Aptitude · Lesson 2.1", ["Number series", "Letter positions", "Coding", "Odd man out"]),
  { tag: "Number series", draw: function () {
    return T("Test patterns in this order") + sp(24) + listOf([["Differences", "+ constant? rising?"], ["Ratios", "× constant?"], ["Squares and cubes", "n², n³ ± k"], ["Mixed operations", "×2 then −3 …"], ["Alternate terms", "two series woven together"]], 0.2, 0.12, 700, 24);
  } },
  { tag: "Number series", draw: function () {
    return T("1 · Differences") + sp(40) + series([2, 6, 12, 20, 30], 0.08, 0.04, 0.82, 42) + under(["+4", "+6", "+8", "+10", "+12"].map(function (x, i) { return i === 4 ? (hl(0.65) ? x : "") : x; }), 0.3, 0.06) + sp(30) + note("Differences rise by 2 each time", 0.55);
  } },
  { tag: "Number series", draw: function () {
    return T("2 · Ratios") + sp(40) + series([3, 9, 27, 81], 0.1, 0.05, 0.75, 243) + under(["×3", "×3", "×3", "×3"], 0.4, 0.06) + sp(30) + note("Each term is 3 times the one before", 0.5, true);
  } },
  { tag: "Number series", draw: function () {
    return T("3 · Squares and cubes") + sp(30) + series([2, 5, 10, 17, 26], 0.05, 0.04, 0.85, 37) + sp(20) + letters("12345", 0.35, 0.05, ["1²+1", "2²+1", "3²+1", "4²+1", "5²+1"]).replace(/>(\d)</g, function (m, d) { return ">n=" + d + "<"; }) + sp(20) + boxed("Rule: n² + 1 → 6² + 1 = 37", 0.8, 30);
  } },
  { tag: "Number series", draw: function () {
    return T("4 · Alternating operations") + sp(40) + series([5, 10, 7, 14, 11], 0.08, 0.04, 0.82, 22) + under(["×2", "−3", "×2", "−3", "×2"], 0.38, 0.07) + sp(30) + note("Two operations take turns", 0.6, true);
  } },
  { tag: "Letter positions", draw: function () {
    return T("Letters as numbers") + sp(26) + letters("ABCDEFGHIJKLM", 0.05, 0.012, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], "var(--muted)").replace(/class="chip"/g, 'class="chip" style="min-width:48px;height:48px;font-size:22px"') + sp(20) +
      '<div class="row" style="gap:14px">' + ["E 5", "J 10", "O 15", "T 20", "Y 25"].map(function (x, i) { return pill(x, 0.55 + i * 0.06, i % 2 ? "o" : ""); }).join("") + "</div>" + sp(18) + boxed("EJOTY", 0.85, 36);
  } },
  { tag: "Letter positions", draw: function () {
    var pairs = [["A", "Z"], ["B", "Y"], ["C", "X"], ["M", "N"]];
    return T("Opposite letters add to 27") + sp(30) + '<div class="row" style="gap:22px">' + pairs.map(function (p, i) { return card('<div class="mid">' + p[0] + ' ↔ <span class="o">' + p[1] + '</span></div><div class="m" style="font-size:18px;font-weight:600">' + (p[0].charCodeAt(0) - 64) + " + " + (p[1].charCodeAt(0) - 64) + " = 27</div>", 0.25 + i * 0.12, 170); }).join("") + "</div>" + sp(30) + boxed("Reverse position = 27 − position", 0.8, 30);
  } },
  { tag: "Coding–decoding", draw: function () {
    return T("Find the rule, then apply it") + sp(16) + letters("FISH", 0.05, 0.03) + down(0.15, "+1 each") + letters("GJTI", 0.2, 0.03).replace(/class="chip"/g, 'class="chip" style="border-top-color:var(--orange)"') + sp(24) + '<div class="row" style="gap:24px">' + letters("BIRD", 0.55, 0.03) + arrow(0.68, "+1") + letters("CJSE", 0.72, 0.04).replace(/class="chip"/g, 'class="chip" style="background:var(--teal);color:#fff;border-top-color:var(--teal)"') + "</div>";
  } },
  { tag: "Coding–decoding", draw: function () {
    return T("Other common code rules") + sp(24) + '<div class="row" style="gap:20px">' + letters("GOLD", 0.1, 0.03, [7, 15, 12, 4], "var(--muted)") + arrow(0.2, "opposite") + letters("TLOW", 0.25, 0.04, [20, 12, 15, 23]) + "</div>" + sp(30) + '<div class="row">' + note("Backwards: CAT → TAC", 0.6, true) + note("Positions: CAB → 3-1-2", 0.72, true) + "</div>";
  } },
  { tag: "Odd man out", draw: function () {
    var odd = hl(0.62);
    return T("Odd man out") + sp(40) + '<div class="row">' + [["27", "3³"], ["64", "4³"], ["125", "5³"], ["144", "12²"], ["216", "6³"]].map(function (x, i) { var bad = i === 3 && odd; return '<div ' + rvs(0.2 + i * 0.05) + ' style="display:flex;flex-direction:column;align-items:center;gap:6px"><span class="chip" style="' + (bad ? "background:#FDE3E1;border-top-color:#E0483D;color:#B42318" : "") + '">' + x[0] + '</span><b style="font-size:20px;color:' + (bad ? "#E0483D" : "var(--teal)") + '" ' + rv(0.45 + i * 0.03) + ">" + x[1] + "</b></div>"; }).join("") + "</div>" + sp(30) + note("All cubes except 144", 0.7);
  } },
  mcqScene("What comes next: 1, 2, 6, 24, 120, …?", ["720", "240", "600", "144"], 0, "The multipliers are ×2, ×3, ×4, ×5, so next is ×6: 120 × 6 = 720."),
  recapScene([["Write the differences first", "then ratios, powers, alternates"], ["Letters → positions", "EJOTY = 5, 10, 15, 20, 25"], ["Opposites add to 27", "A ↔ Z, M ↔ N"], ["Test the rule on every letter", "and every term"]])
];
