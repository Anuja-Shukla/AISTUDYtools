/* SSC CGL · Quant · Geometry. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["geometry"] = {
  id: "geometry", subject: "quant", num: 13, title: "Geometry",
  minutes: 60,
  why: "Geometry gives 3–4 Tier 1 questions and is one of the biggest areas in Tier 2. A short list of angle, triangle and circle facts covers most of them.",
  video: "videos/SSC_Q13_Geometry.mp4",
  slides: [
    { h: "Why geometry matters", body: "<p>SSC geometry questions test facts, not long proofs:</p><ul><li>lines, angles and parallel lines</li><li>triangle angles, Pythagoras and similar triangles</li><li>the four triangle centres</li><li>circles: angles, tangents and chords</li><li>polygons</li></ul><p>Draw a quick figure and mark what you know before you calculate.</p>" },
    { h: "Lines and parallel lines", body: "<ul><li>Angles on a straight line add to 180°; around a point, 360°.</li><li>Vertically opposite angles are equal.</li><li>A transversal across parallel lines: <b>corresponding</b> and <b>alternate</b> angles are equal; <b>co-interior</b> angles add to 180°.</li></ul>",
      ask: { q: "Co-interior angles are (2x + 10)° and (3x − 5)°. Find the smaller angle.", a: "5x + 5 = 180 → x = 35. Angles 80° and 100°: the smaller is 80°." } },
    { h: "Triangle angles", body: "<p class='f'>A + B + C = 180°</p><p class='f'>Exterior angle = sum of the two opposite interior angles</p><p>Angles in the ratio 2 : 3 : 4 → 40°, 60°, 80°.</p><p>An exterior angle of 110° with one opposite angle 45° → the other is 65°.</p>" },
    { h: "Pythagoras and triplets", body: "<p class='f'>Hypotenuse² = base² + height²</p><p>Learn the common triplets: <b>3-4-5, 5-12-13, 8-15-17, 7-24-25</b> and their multiples (6-8-10, 9-12-15).</p><p>Legs 9 and 12 → 3 × (3-4-5) → hypotenuse <b>15</b>.</p>", viz: { type: "rt", a: 3, b: 4 },
      ask: { q: "A right triangle has hypotenuse 25 and one side 7. Find its area.", a: "Other side 24 (7-24-25). Area = ½ × 7 × 24 = 84." } },
    { h: "Similar triangles", body: "<p>Similar triangles have equal angles and sides in the same ratio.</p><p class='f'>Sides in ratio k → areas in ratio k²</p><p>If DE ∥ BC in triangle ABC, then ADE ~ ABC. AD : DB = 2 : 3 means AD : AB = 2 : 5, so the areas are <b>4 : 25</b>.</p>",
      ask: { q: "Two similar triangles have sides in the ratio 2 : 3. Ratio of their areas?", a: "2² : 3² = 4 : 9." } },
    { h: "The four centres", body: "<ul><li><b>Centroid</b> (medians meet): divides each median 2 : 1 from the vertex.</li><li><b>Incentre</b> (angle bisectors): ∠BIC = 90° + A/2.</li><li><b>Orthocentre</b> (altitudes): ∠BHC = 180° − A.</li><li><b>Circumcentre</b> (perpendicular bisectors): ∠BOC = 2A.</li></ul><p>A = 70° → ∠BIC = 125°, ∠BHC = 110°, ∠BOC = 140°.</p>",
      ask: { q: "Median AD is 12 cm and G is the centroid. Find AG.", a: "2/3 × 12 = 8 cm." } },
    { h: "Angles in a circle", body: "<ul><li>Angle at the centre = 2 × angle at the circumference on the same arc.</li><li>Angle in a semicircle = 90°.</li><li>Angles in the same segment are equal.</li><li>Cyclic quadrilateral: opposite angles add to 180°.</li></ul><p>Inscribed angle 35° → central angle <b>70°</b>.</p>",
      ask: { q: "ABCD is a cyclic quadrilateral with ∠A = 75°. Find ∠C.", a: "180 − 75 = 105°." } },
    { h: "Tangents", body: "<ul><li>A tangent is perpendicular to the radius at the point of contact.</li><li>Two tangents from an outside point are equal in length.</li><li>Tangent length = √(d² − r²), where d is the distance from the centre.</li><li>If the tangents meet at P, ∠APB + ∠AOB = 180°.</li></ul><p>d = 13, r = 5 → tangent = √(169 − 25) = <b>12</b>.</p>" },
    { h: "Chords", body: "<ul><li>The perpendicular from the centre bisects a chord: half-chord = √(r² − d²).</li><li>Equal chords are equidistant from the centre.</li><li>Two chords AB and CD meeting at P: PA × PB = PC × PD.</li></ul><p>r = 10, distance 6 → half-chord 8 → chord <b>16</b>.</p>",
      ask: { q: "Chords AB and CD meet at P with PA = 4, PB = 6 and PC = 3. Find PD.", a: "4 × 6 = 3 × PD → PD = 8." } },
    { h: "Polygons", body: "<p class='f'>Sum of interior angles = (n − 2) × 180°</p><p class='f'>Each exterior angle (regular) = 360° ÷ n &nbsp;&nbsp; Diagonals = n(n − 3) ÷ 2</p><p>Each interior angle 140° → exterior 40° → n = 360 ÷ 40 = <b>9</b> sides.</p>",
      ask: { q: "The interior angles of a polygon add to 1,440°. How many sides?", a: "(n − 2) × 180 = 1,440 → n = 10." } },
    { h: "Exam strategy", body: "<ul><li>Sketch and mark every given angle and length.</li><li>Look for a right angle: Pythagoras or a triplet usually follows.</li><li>Circle questions: centre angle = 2 × circumference angle.</li><li>Learn the four centre formulas; they appear often.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["triang", "pyth", "circ", "poly"],
  formulas: [
    ["Triangle", "A + B + C = 180°; exterior = sum of opposite interiors"],
    ["Parallel lines", "corresponding = alternate; co-interior add to 180°"],
    ["Pythagoras", "h² = b² + p²; triplets 3-4-5, 5-12-13, 8-15-17, 7-24-25"],
    ["Similar triangles", "areas in the ratio of the squares of the sides"],
    ["Centroid", "divides each median 2 : 1"],
    ["Incentre", "∠BIC = 90° + A/2"],
    ["Orthocentre", "∠BHC = 180° − A"],
    ["Circumcentre", "∠BOC = 2A"],
    ["Circle angles", "centre = 2 × circumference; semicircle = 90°; cyclic quad opposite = 180°"],
    ["Tangent length", "√(d² − r²)"],
    ["Chord", "half-chord = √(r² − d²); PA × PB = PC × PD"],
    ["Polygon", "interior sum (n − 2)180°; exterior 360°/n; diagonals n(n − 3)/2"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "The angles of a triangle are in the ratio 2 : 3 : 4. The largest angle is…", o: ["80°", "60°", "90°", "100°"], why: "180 ÷ 9 = 20; 4 × 20 = 80°.", hint: "Angles add to 180°." },
    { q: "An exterior angle of a triangle is 110° and one opposite interior angle is 45°. The other is…", o: ["65°", "70°", "55°", "135°"], why: "110 − 45 = 65°.", hint: "Exterior = sum of opposite interiors." },
    { q: "The legs of a right triangle are 9 and 12. The hypotenuse is…", o: ["15", "21", "13", "17"], why: "3 × (3-4-5) = 9-12-15.", hint: "Look for a triplet." },
    { q: "Two similar triangles have sides in the ratio 2 : 3. Their areas are in the ratio…", o: ["4 : 9", "2 : 3", "8 : 27", "3 : 2"], why: "Square the ratio.", hint: "Areas go with squares." },
    { q: "In triangle ABC, ∠A = 70° and I is the incentre. ∠BIC = ?", o: ["125°", "110°", "140°", "35°"], why: "90 + 70/2 = 125°.", hint: "90° + A/2." },
    { q: "An angle at the circumference is 35°. The angle at the centre on the same arc is…", o: ["70°", "35°", "17.5°", "145°"], why: "Centre = 2 × circumference.", hint: "Double it." },
    { q: "A point is 13 cm from the centre of a circle of radius 5 cm. The tangent from it is…", o: ["12 cm", "8 cm", "18 cm", "13 cm"], why: "√(169 − 25) = 12.", hint: "The tangent meets the radius at 90°." },
    { q: "A chord is 6 cm from the centre of a circle of radius 10 cm. Its length is…", o: ["16 cm", "8 cm", "12 cm", "20 cm"], why: "Half-chord = √(100 − 36) = 8; chord = 16.", hint: "Find the half-chord first." },
    { q: "Each interior angle of a regular polygon is 140°. Number of sides?", o: ["9", "8", "10", "7"], why: "Exterior 40° → 360 ÷ 40 = 9.", hint: "Use the exterior angle." },
    { q: "How many diagonals does a hexagon have?", o: ["9", "6", "12", "15"], why: "6 × 3 ÷ 2 = 9.", hint: "n(n − 3) ÷ 2." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "Co-interior angles between two parallel lines are (2x + 10)° and (3x − 5)°. The smaller angle is…", o: ["80°", "100°", "35°", "70°"], why: "5x + 5 = 180 → x = 35 → 80° and 100°." },
      { q: "In triangle ABC, ∠A = 50° and H is the orthocentre. ∠BHC = ?", o: ["130°", "100°", "115°", "50°"], why: "180 − 50 = 130°." },
      { q: "In triangle ABC, ∠A = 50° and O is the circumcentre. ∠BOC = ?", o: ["100°", "130°", "115°", "25°"], why: "2 × 50 = 100°." },
      { q: "G is the centroid of triangle ABC and median AD = 12 cm. AG = ?", o: ["8 cm", "6 cm", "4 cm", "9 cm"], why: "AG = 2/3 of AD." },
      { q: "ABCD is a cyclic quadrilateral with ∠A = 75°. ∠C = ?", o: ["105°", "75°", "90°", "115°"], why: "Opposite angles add to 180°." },
      { q: "Tangents PA and PB are drawn to a circle with centre O, and ∠APB = 70°. ∠AOB = ?", o: ["110°", "70°", "140°", "35°"], why: "OAPB has two right angles, so ∠AOB = 180 − 70 = 110°." },
      { q: "Chords AB and CD meet at P. PA = 4, PB = 6 and PC = 3. PD = ?", o: ["8", "4.5", "2", "12"], why: "PA × PB = PC × PD → 24 = 3 × PD." },
      { q: "A right triangle has hypotenuse 25 cm and one side 7 cm. Its area is…", o: ["84 cm²", "87.5 cm²", "168 cm²", "175 cm²"], why: "Other side 24; area = ½ × 7 × 24 = 84." },
      { q: "The interior angles of a polygon add to 1,440°. It has…", o: ["10 sides", "8 sides", "12 sides", "9 sides"], why: "(n − 2) × 180 = 1,440 → n = 10." },
      { q: "In triangle ABC, DE ∥ BC with AD : DB = 2 : 3. Area of ADE : area of ABC = ?", o: ["4 : 25", "2 : 5", "4 : 9", "2 : 3"], why: "AD : AB = 2 : 5, so areas are 4 : 25." }
    ]
  }
};
