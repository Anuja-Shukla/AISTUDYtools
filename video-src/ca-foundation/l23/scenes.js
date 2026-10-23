/* Lesson 2.3 — Seating Arrangements */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Seating Arrangements</b>" };
/* seats: array of labels ("" = empty); hlIdx highlighted; numbers under seats */
function seatRow(seats, at, hlIdx, nums) {
  return '<div class="row" style="gap:14px">' + seats.map(function (s, i) {
    var on = hlIdx !== undefined && (hlIdx === i || (hlIdx instanceof Array && hlIdx.indexOf(i) >= 0));
    return '<div ' + rvs(at + i * 0.03) + ' style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:78px;height:78px;border-radius:16px;display:grid;place-items:center;font-size:34px;font-weight:800;' +
      (s ? (on ? "background:var(--orange);color:#fff" : "background:var(--teal);color:#fff") : "background:#fff;border:3px dashed #C9D2E0;color:#C9D2E0") + '">' + (s || "?") + "</div>" + (nums ? '<b style="font-size:18px;color:var(--muted)">seat ' + (i + 1) + "</b>" : "") + "</div>";
  }).join("") + "</div>";
}
function person(face, label) { /* face: "N" faces up (back to viewer), "S" faces viewer */
  var s = '<svg width="120" height="150" viewBox="0 0 120 150"><circle cx="60" cy="40" r="24" fill="' + (face === "S" ? "#CB8D63" : "#26170F") + '"/>' + (face === "S" ? '<circle cx="51" cy="38" r="3" fill="#1B110C"/><circle cx="69" cy="38" r="3" fill="#1B110C"/><path d="M52 50 Q60 55 68 50" stroke="#9C3F4B" stroke-width="2.5" fill="none"/>' : "") +
    '<path d="M24 140 Q26 76 60 72 Q94 76 96 140 Z" fill="#1F9A94"/></svg>';
  return '<div style="display:flex;flex-direction:column;align-items:center">' + s + '<b style="font-size:20px;color:var(--navy)">' + label + "</b></div>";
}
function table6(names, at, opp, arrowDir) {
  var W = 300, c = 150, R = 100, s = '<circle cx="' + c + '" cy="' + c + '" r="64" fill="#EEF2F7" stroke="#C9D2E0" stroke-width="2"/>';
  names.forEach(function (nm, i) { var a = -Math.PI / 2 + 2 * Math.PI * i / names.length, x = c + R * Math.cos(a), y = c + R * Math.sin(a), q = k(at + i * 0.04), on = opp && (i === opp[0] || i === opp[1]); s += '<circle cx="' + x + '" cy="' + y + '" r="27" fill="' + (on ? "#F28C28" : "#1F9A94") + '" opacity="' + q + '"/><text x="' + x + '" y="' + (y + 8) + '" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="Outfit" opacity="' + q + '">' + nm + "</text>"; });
  if (opp && hl(0.4)) { var a1 = -Math.PI / 2 + 2 * Math.PI * opp[0] / names.length, a2 = -Math.PI / 2 + 2 * Math.PI * opp[1] / names.length; s += '<line x1="' + (c + 70 * Math.cos(a1)) + '" y1="' + (c + 70 * Math.sin(a1)) + '" x2="' + (c + 70 * Math.cos(a2)) + '" y2="' + (c + 70 * Math.sin(a2)) + '" stroke="#F28C28" stroke-width="4" stroke-dasharray="8 6"/>'; }
  if (arrowDir) s += '<path d="M' + (c + 40) + ',' + (c - 30) + ' A 50 50 0 0 1 ' + (c + 30) + ',' + (c + 40) + '" fill="none" stroke="#F28C28" stroke-width="5" marker-end="url(#ar)" opacity="' + k(0.25) + '"/><text x="' + c + '" y="' + (c + 8) + '" text-anchor="middle" font-size="18" font-weight="800" fill="#F28C28" font-family="Outfit" opacity="' + k(0.25) + '">left ↻</text>';
  return '<svg width="' + W + '" height="' + W + '" viewBox="0 0 ' + W + " " + W + '"><defs><marker id="ar" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#F28C28"/></marker></defs>' + s + "</svg>";
}
var SCENES = [
  introScene("Seating Arrangements", "CA Foundation · Quantitative Aptitude · Lesson 2.3", ["Rows", "Facing direction", "Round tables", "Method"]),
  { tag: "Rows", draw: function () {
    return T("Which way are they facing?") + sp(22) + '<div class="row" style="gap:60px;align-items:flex-start">' +
      '<div ' + rv(0.15) + '>' + person("N", "Facing North (away from you)") + sp(10) + note("Their left = your left", 0.3, true) + "</div>" +
      '<div ' + rv(0.55) + '>' + person("S", "Facing South (towards you)") + sp(10) + note("Their left = your right", 0.7) + "</div></div>";
  } },
  { tag: "Key words", draw: function () {
    return T("Read the words carefully") + sp(24) + listOf([["“Immediately left of B”", "the very next seat"], ["“Left of B”", "anywhere on that side"], ["“Second to the left of B”", "one person in between"]], 0.1, 0.27, 720, 25);
  } },
  { tag: "Positions", draw: function () {
    return T("From the left ↔ from the right") + sp(24) + boxed("kth from left = (n − k + 1)th from right", 0.1, 32) + sp(26) + seatRow(["", "", "★", "", "", "", ""], 0.45, 2).replace("★", "X") + sp(14) + eq("n = 7, k = 3 → 7 − 3 + 1 = <span class='t'>5th from the right</span>", 0.62, 30);
  } },
  { tag: "Worked example", draw: function () {
    return T("Five friends in a row, facing North") + sp(18) + listOf([["C is in the middle", "definite"], ["B sits at the right end", "definite"], ["A is immediately left of C", "neighbour"], ["E is not at either end", "negative"]], 0.25, 0.15, 640, 24);
  } },
  { tag: "Worked example", draw: function () {
    var seats = ["", "", hl(0.25) ? "C" : "", "", hl(0.62) ? "B" : ""];
    return T("Step 1 · Definite clues first") + sp(40) + seatRow(seats, 0.05, [2, 4].filter(function (i) { return seats[i]; }), true) + sp(30) + '<div class="row">' + note("C in the middle → seat 3", 0.25, true) + note("B at the right end → seat 5", 0.62, true) + "</div>";
  } },
  { tag: "Worked example", draw: function () {
    return T("Step 2 · Neighbour clues") + sp(40) + seatRow(["", hl(0.45) ? "A" : "", "C", "", "B"], -1, hl(0.45) ? 1 : undefined, true) + sp(30) + note("A is immediately left of C → seat 2", 0.45, true);
  } },
  { tag: "Worked example", draw: function () {
    var e = hl(0.32), d = hl(0.5);
    return T("Step 3 · Use the negative clue") + sp(40) + seatRow([d ? "D" : "", "A", "C", e ? "E" : "", "B"], -1, [0, 3].filter(function (i) { return i === 0 ? d : e; }), true) + sp(30) + note("E is not at an end → seat 4, so D → seat 1", 0.3) + sp(16) + boxed("Order: D A C E B", 0.75, 32);
  } },
  { tag: "Round tables", draw: function () {
    return side(T2("Round a table") + sp(12) + note("Facing the centre:", 0.05, true) + sp(8) + eq("left = clockwise ↻", 0.2, 28, "o") + eq("right = anticlockwise ↺", 0.4, 28) + sp(10) + note("Facing outward: it reverses", 0.72), table6(["P", "Q", "R", "S", "T", "U"], 0.05, null, true), 360);
  } },
  { tag: "Round tables", draw: function () {
    return side(T2("Sitting opposite") + sp(12) + boxed("n/2 seats away", 0.15, 30) + sp(12) + eq("6 people → 3 seats", 0.55, 28) + sp(8) + note("P is opposite S", 0.7, true), table6(["P", "Q", "R", "S", "T", "U"], -1, [0, 3]), 340);
  } },
  { tag: "Method", draw: function () {
    return T("When a clue allows two positions") + sp(24) + '<div class="row" style="gap:24px">' + card('<div class="m" style="font-size:20px;font-weight:700">Case 1</div>' + seatRow(["X", "Y", "", ""], 0.1).replace(/width:78px;height:78px/g, "width:56px;height:56px"), 0.08, 320) + card('<div class="m" style="font-size:20px;font-weight:700">Case 2</div>' + seatRow(["", "", "Y", "X"], 0.2).replace(/width:78px;height:78px/g, "width:56px;height:56px"), 0.18, 320) + "</div>" + sp(24) +
      '<div class="row">' + note("Use other clues to rule one out", 0.45) + note("Re-check every clue", 0.8, true) + "</div>";
  } },
  mcqScene("Row facing North: D A C E B. Who sits second to the right of A?", ["E", "C", "B", "D"], 0, "Facing North, right is your right: from A skip C (1st), and E is 2nd to the right."),
  recapScene([["Check the facing direction", "South or centre flips sides"], ["Definite clues first", "middle, ends, seat numbers"], ["Then neighbours", "“immediately” clues"], ["Eliminate with negatives", "and re-check every clue"]])
];
