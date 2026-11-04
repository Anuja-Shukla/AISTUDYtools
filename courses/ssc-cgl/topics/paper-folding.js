/* SSC CGL · Reasoning · Paper folding & cutting. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["paper-folding"] = {
  id: "paper-folding", subject: "reasoning", num: 13, title: "Paper folding & cutting",
  minutes: 25,
  why: "Paper folding and cutting gives 1–2 Tier 1 marks. A paper is folded, punched or cut, and you pick how it looks when opened. Unfold one step at a time, mirroring every hole across each fold line.",
  video: "videos/SSC_R13_Paper_Folding.mp4",
  slides: [
    { h: "The one idea", body: "<p>When you unfold, every hole is <b>mirrored across the fold line</b>.</p><ul><li>Unfold in the <b>reverse order</b> of folding.</li><li>Each unfold doubles the holes.</li></ul>", viz: { type: "pf", f: ["L"], h: [[5, 2]] } },
    { h: "Counting holes", body: "<p>Holes after opening = holes punched × 2<sup>number of folds</sup>.</p><ul><li>1 fold, 1 hole → 2</li><li>2 folds, 1 hole → 4</li><li>3 folds, 2 holes → 2 × 8 = 16</li></ul><p>Exception: a hole punched exactly on a fold line opens as one hole on that line.</p>",
      ask: { q: "Folded in half twice, 3 holes punched. How many holes when opened?", a: "3 × 4 = 12." } },
    { h: "Positions: mirror across each line", body: "<p>Folded left over right, then top down; one hole near the bottom-right:</p><p>Unfold the top fold → a second hole mirrored upwards. Unfold the side fold → both mirrored to the left. Four holes in a rectangle pattern.</p>", viz: { type: "pf", f: ["L", "T"], h: [[6, 5]] } },
    { h: "Diagonal folds", body: "<p>Fold a square along a diagonal: holes are mirrored across that diagonal.</p><p>A hole near one corner of the triangle appears again on the other side of the diagonal, at the same distance from it.</p>" },
    { h: "Cuts on the fold", body: "<ul><li>Half a circle cut on the fold → one <b>full circle</b> when opened.</li><li>A V-notch on the fold → a <b>diamond</b>.</li><li>A half-square notch on the fold → one <b>square</b>.</li><li>Quarter-circle at the corner where two folds meet → one circle in the <b>centre</b>.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Count first: holes × 2<sup>folds</sup> rules out most options.</li><li>Then check symmetry: every hole must have a mirror partner across each fold line.</li><li>Unfold in reverse order, one step at a time.</li></ul>" }
  ],
  tools: ["foldsim", "holecount", "foldgame"],
  formulas: [
    ["Holes when opened", "holes punched × 2^(folds)"],
    ["Hole on a fold line", "opens as one hole on that line"],
    ["Unfold order", "reverse of the folding order"],
    ["Cut on the fold", "half shape → whole symmetric shape"]
  ],
  practice: [
    { q: "A square paper is folded in half once and one hole is punched through both layers. How many holes appear when it is opened?", o: ["2", "1", "4", "3"], why: "1 × 2¹.", hint: "Each fold doubles." },
    { q: "A paper is folded in half twice and one hole is punched. How many holes when opened?", o: ["4", "2", "8", "6"], why: "1 × 2².", hint: "Two folds." },
    { q: "A paper is folded three times and one hole is punched. How many holes when opened?", o: ["8", "6", "4", "16"], why: "1 × 2³.", hint: "Three folds." },
    { q: "A paper is folded in half twice and two holes are punched. How many holes when opened?", o: ["8", "4", "6", "16"], why: "2 × 2².", hint: "Holes × 2^folds." },
    { q: "A paper is folded in half along a vertical line and a hole is punched near the open edge. When opened, the holes are:", o: ["Two holes, mirror images across the fold line", "One hole on the fold line", "Two holes one above the other", "Four holes in a square"], why: "One fold → one mirror partner across the line.", hint: "Mirror across the fold." },
    { q: "A square is folded along a diagonal and one hole is punched. When opened, the holes are:", o: ["Two holes, symmetric about the diagonal", "One hole at the centre", "Four holes at the corners", "Two holes on the same side of the diagonal"], why: "The diagonal is the mirror line.", hint: "Which line is the fold?" },
    { q: "A paper is folded in half and a semicircle is cut along the fold. When opened, it shows:", o: ["One full circle", "Two semicircles", "Two circles", "One semicircle"], why: "The half shape on the fold becomes whole.", hint: "Cut on the fold." },
    { q: "A paper is folded in half twice and a quarter circle is cut at the corner where both folds meet. When opened, it shows:", o: ["One circle in the centre", "Four circles at the corners", "Two semicircles", "Four quarter circles at the edges"], why: "That corner is the centre of the sheet.", hint: "Where is that corner on the open sheet?" },
    { q: "A paper is folded in half and a V-shaped notch is cut on the fold. When opened, the hole is:", o: ["A diamond", "A triangle", "Two triangles", "A square"], why: "Two mirror triangles join on the fold line.", hint: "Mirror the V across the fold." },
    { q: "A paper is folded in half four times and one hole is punched. How many holes when opened?", o: ["16", "8", "12", "32"], why: "1 × 2⁴.", hint: "Holes × 2^folds." }
  ],
  test: {
    minutes: 5, right: 2, wrong: 0.5,
    items: [
      { q: "Folded in half twice, one hole punched. Holes when opened?", o: ["4", "2", "8", "3"], why: "2²." },
      { q: "Folded in half once, three holes punched. Holes when opened?", o: ["6", "3", "9", "12"], why: "3 × 2." },
      { q: "Folded three times, two holes punched. Holes when opened?", o: ["16", "8", "12", "6"], why: "2 × 2³." },
      { q: "Folded in half; a semicircle is cut on the fold. Opened, it shows:", o: ["One full circle", "Two semicircles", "Two circles", "A ring"], why: "Half shape on the fold becomes whole." },
      { q: "Folded in half once; a hole is punched exactly on the fold line. Holes when opened?", o: ["1", "2", "4", "0"], why: "A hole on the fold opens as one hole." },
      { q: "A square is folded along one diagonal and one hole is punched. Opened, it shows:", o: ["Two holes symmetric about the diagonal", "One hole", "Four holes", "Two holes in one corner"], why: "Mirror across the diagonal." },
      { q: "Folded in half twice; a quarter circle is cut at the corner where the folds meet. Opened, it shows:", o: ["One circle in the centre", "Four circles", "A semicircle at one edge", "Two circles"], why: "That corner is the sheet’s centre." },
      { q: "Folded in half; a half-square notch is cut on the fold. Opened, the hole is:", o: ["A square", "A rectangle split in two", "Two squares", "A triangle"], why: "The two halves join on the fold." },
      { q: "Folded in half twice, three holes punched. Holes when opened?", o: ["12", "6", "9", "24"], why: "3 × 2²." },
      { q: "Folded in half; a V-notch is cut on the fold. Opened, the hole is:", o: ["A diamond", "Two triangles", "A triangle", "A circle"], why: "Two mirrored triangles join on the fold." }
    ]
  }
};
