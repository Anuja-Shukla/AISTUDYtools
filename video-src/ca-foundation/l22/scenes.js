/* Lesson 2.2 — Direction Sense */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Direction Sense</b>" };
function compass(at, rot, hlDir) {
  var W = 300, c = 150, s = '<circle cx="' + c + '" cy="' + c + '" r="118" fill="#fff" stroke="#C9D2E0" stroke-width="3"/>';
  var D = [["N", 0], ["NE", 45], ["E", 90], ["SE", 135], ["S", 180], ["SW", 225], ["W", 270], ["NW", 315]];
  D.forEach(function (d, i) { var a = (d[1] - 90) * Math.PI / 180, main = i % 2 === 0, r = main ? 96 : 92, q = k(at + i * 0.04); s += '<line x1="' + c + '" y1="' + c + '" x2="' + (c + (r - 26) * Math.cos(a)) + '" y2="' + (c + (r - 26) * Math.sin(a)) + '" stroke="' + (main ? "#1E2A47" : "#C9D2E0") + '" stroke-width="' + (main ? 3 : 2) + '" opacity="' + q + '"/><text x="' + (c + r * Math.cos(a)) + '" y="' + (c + r * Math.sin(a) + 8) + '" text-anchor="middle" font-size="' + (main ? 24 : 17) + '" font-weight="800" fill="' + (hlDir === d[0] ? "#F28C28" : (main ? "#1E2A47" : "#1F9A94")) + '" font-family="Outfit" opacity="' + q + '">' + d[0] + "</text>"; });
  if (rot !== undefined) { var a2 = (rot - 90) * Math.PI / 180; s += '<line x1="' + c + '" y1="' + c + '" x2="' + (c + 56 * Math.cos(a2)) + '" y2="' + (c + 56 * Math.sin(a2)) + '" stroke="#F28C28" stroke-width="8" stroke-linecap="round"/><circle cx="' + c + '" cy="' + c + '" r="9" fill="#F28C28"/>'; }
  return '<svg width="' + W + '" height="' + W + '" viewBox="0 0 ' + W + " " + W + '">' + s + "</svg>";
}
/* Riya's route on a grid; prog 0..3 segments drawn */
function route(prog, showLine, labels) {
  var W = 360, H = 330, u = 30, ox = 120, oy = 190, sx = function (x) { return ox + x * u; }, sy = function (y) { return oy - y * u; }, s = "";
  for (var x = -3; x <= 7; x++) s += '<line x1="' + sx(x) + '" y1="20" x2="' + sx(x) + '" y2="' + (H - 10) + '" stroke="#E3E7EF"/>';
  for (var y = -4; y <= 6; y++) s += '<line x1="10" y1="' + sy(y) + '" x2="' + (W - 10) + '" y2="' + sy(y) + '" stroke="#E3E7EF"/>';
  s += '<text x="' + sx(0) + '" y="16" text-anchor="middle" font-size="16" font-weight="800" fill="#1E2A47" font-family="Outfit">N ↑</text>';
  var pts = [[0, 0], [0, 5], [3, 5], [3, -4]], d = "M" + sx(0) + "," + sy(0);
  for (var i = 1; i <= 3; i++) { var f = clamp(prog - (i - 1)); if (f <= 0) break; var px = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, py = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f; d += "L" + sx(px) + "," + sy(py); }
  s += '<path d="' + d + '" fill="none" stroke="#1F9A94" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
  if (showLine) s += '<line x1="' + sx(0) + '" y1="' + sy(0) + '" x2="' + sx(3 * showLine) + '" y2="' + sy(-4 * showLine) + '" stroke="#F28C28" stroke-width="5" stroke-dasharray="9 7"/>';
  s += '<circle cx="' + sx(0) + '" cy="' + sy(0) + '" r="9" fill="#1E2A47"/><text x="' + (sx(0) - 12) + '" y="' + (sy(0) + 6) + '" text-anchor="end" font-size="17" font-weight="700" fill="#1E2A47" font-family="Outfit">Start</text>';
  if (labels) [["(0, 5)", 0, 5, -10, -10, "end"], ["(3, 5)", 3, 5, 10, -10, "start"], ["(3, −4)", 3, -4, 12, 6, "start"]].forEach(function (l, i) { if (prog > i + 0.95) s += '<text x="' + (sx(l[1]) + l[3]) + '" y="' + (sy(l[2]) + l[4]) + '" text-anchor="' + l[5] + '" font-size="18" font-weight="800" fill="#F28C28" font-family="Outfit">' + l[0] + "</text>"; });
  return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
}
var SCENES = [
  introScene("Direction Sense", "CA Foundation · Quantitative Aptitude · Lesson 2.2", ["Directions", "Turns", "Distance", "Shadows"]),
  { tag: "Directions", draw: function () {
    return side(T2("Eight directions") + sp(14) + note("Main: N, E, S, W", 0.1, true) + sp(10) + note("In between: NE, SE, SW, NW", 0.45) + sp(10) + note("North at the top", 0.8, true), compass(0.05), 330);
  } },
  { tag: "Turns", draw: function () {
    var rot = LT < LD * 0.3 ? 0 : LT < LD * 0.55 ? 90 * ease((LT - LD * 0.3) / 0.8) : LT < LD * 0.8 ? 90 - 90 * ease((LT - LD * 0.55) / 0.8) : 180 * ease((LT - LD * 0.8) / 0.8);
    return side(T2("Turns are relative") + sp(14) + note("Right = ¼ turn clockwise ↻", 0.2, true) + sp(10) + note("Left = ¼ turn anticlockwise ↺", 0.5) + sp(10) + note("About-turn = ½ turn", 0.78, true), compass(-1, rot), 340);
  } },
  { tag: "Turns", draw: function () {
    return T("Right does not always mean East") + sp(20) + table(["Facing", "After a right turn", "After a left turn"], [["North", "East", "West"], ["East", "South", "North"], ["South", "<b class='o'>West</b>", "East"], ["West", "North", "South"]], 0.08, 0.12, 2, 640);
  } },
  { tag: "Worked example", draw: function () {
    return T("Riya's walk") + sp(26) + listOf([["Walk North", "5 km"], ["Turn right, walk", "3 km"], ["Turn right again, walk", "9 km"]], 0.1, 0.2, 560, 26) + sp(26) + note("How far, and in which direction, from the start?", 0.78);
  } },
  { tag: "Worked example", draw: function () {
    var prog = clamp((LT - 0.1 * LD) / (0.85 * LD)) * 3;
    return side(T2("Track it on a grid") + sp(12) + eq("N 5 → (0, 5)", 0.12, 26) + eq("Right = E: 3 → (3, 5)", 0.38, 26) + eq("Right = S: 9 → (3, −4)", 0.65, 26), route(prog, 0, true), 360);
  } },
  { tag: "Worked example", draw: function () {
    return side(T2("Straight-line distance") + sp(12) + eq("√(3² + 4²) = √25", 0.15, 30) + eq("= <span class='t'>5 km</span>", 0.35, 34) + sp(10) + boxed("5 km South-East", 0.75, 30), route(3, k(0.1), true), 360);
  } },
  { tag: "Watch out", draw: function () {
    return T("Total walked vs. distance from start") + sp(36) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Total distance walked", "5 + 3 + 9 = 17 km", "", 0.12, 330, "var(--muted)") + cardT("Straight-line distance", "5 km", "what is usually asked", 0.45, 330, "var(--teal)") + "</div>";
  } },
  { tag: "Shadows", draw: function () {
    var W = 640, H = 230, s = '<line x1="20" y1="190" x2="' + (W - 20) + '" y2="190" stroke="#1E2A47" stroke-width="3"/><text x="30" y="220" font-size="18" font-weight="800" fill="#1E2A47" font-family="Outfit">West</text><text x="' + (W - 30) + '" y="220" text-anchor="end" font-size="18" font-weight="800" fill="#1E2A47" font-family="Outfit">East</text>';
    var morning = LT < LD * 0.62, q = k(morning ? 0.25 : 0.65), sunX = morning ? W - 80 : 80, sh = morning ? -1 : 1;
    s += '<circle cx="' + sunX + '" cy="105" r="30" fill="#FBBF24" opacity="' + q + '"/><rect x="' + (W / 2 - 6) + '" y="110" width="12" height="80" rx="5" fill="#1E2A47"/><circle cx="' + (W / 2) + '" cy="98" r="14" fill="#1E2A47"/>';
    s += '<path d="M' + (W / 2 - 6) + ',190 L' + (W / 2 + 6) + ',190 L' + (W / 2 + sh * 190 * q) + ',190 L' + (W / 2 + sh * 190 * q) + ',176 Z" fill="#1E2A47" opacity="0.55"/>';
    s += '<text x="' + (W / 2) + '" y="40" text-anchor="middle" font-size="22" font-weight="800" fill="' + (morning ? "#F28C28" : "#1F9A94") + '" font-family="Outfit">' + (morning ? "Morning: sun in the East → shadow points West" : "Evening: sun in the West → shadow points East") + "</text>";
    return T("Shadows point away from the sun") + sp(26) + '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
  } },
  { tag: "Shadows", draw: function () {
    return side(T2("Morning shadow on your right?") + sp(12) + eq("Shadow points West", 0.35, 26) + eq("West is on your right…", 0.55, 26) + sp(10) + boxed("…only when facing South", 0.75, 26), compass(-1, 180, hl(0.4) ? "W" : undefined), 360);
  } },
  mcqScene("Facing West, Asha turns left, then left again. Which way is she facing now?", ["East", "West", "North", "South"], 0, "West → left → South → left → East."),
  recapScene([["Turn from the current facing", "right = ↻, left = ↺"], ["Draw every move", "East +x, North +y"], ["Straight-line distance", "√(x² + y²)"], ["Shadows", "morning → West, evening → East"]])
];
