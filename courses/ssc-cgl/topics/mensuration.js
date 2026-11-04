/* SSC CGL · Quant · Mensuration. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["mensuration"] = {
  id: "mensuration", subject: "quant", num: 14, title: "Mensuration",
  minutes: 55,
  why: "Mensuration gives 2–3 Tier 1 questions and more in Tier 2: areas of plane figures, and volumes and surface areas of solids. It is a formula topic.",
  video: "videos/SSC_Q14_Mensuration.mp4",
  slides: [
    { h: "Why mensuration matters", body: "<p>Two kinds of questions:</p><ul><li><b>2D</b>: area and perimeter of triangles, quadrilaterals and circles</li><li><b>3D</b>: volume and surface area of cubes, cuboids, cylinders, cones and spheres</li></ul><p>Plus a few patterns: % change in area, melting and recasting, and wheels.</p><p>Use π = 22/7 when the radius is a multiple of 7.</p>" },
    { h: "Triangles", body: "<p class='f'>Area = ½ × base × height</p><p class='f'>Heron: √[s(s − a)(s − b)(s − c)], s = (a + b + c) ÷ 2</p><p class='f'>Equilateral: (√3/4) × a²</p><p>Sides 13, 14, 15 → s = 21 → √(21 × 8 × 7 × 6) = <b>84</b>.</p>",
      ask: { q: "Find the area of an equilateral triangle of side 8.", a: "(√3/4) × 64 = 16√3." } },
    { h: "Quadrilaterals", body: "<ul><li>Rectangle: lb, perimeter 2(l + b), diagonal √(l² + b²)</li><li>Square: a², diagonal a√2</li><li>Parallelogram: base × height</li><li>Rhombus: ½ × d₁ × d₂ (diagonals bisect at right angles)</li><li>Trapezium: ½ × (sum of parallel sides) × height</li></ul><p>Rhombus with diagonals 16 and 12 → area <b>96</b>, side √(8² + 6²) = 10.</p>",
      ask: { q: "A rectangle has perimeter 46 m and area 120 m². Find its diagonal.", a: "l + b = 23, lb = 120 → 15 and 8 → diagonal 17 m." } },
    { h: "Circles and sectors", body: "<p class='f'>Area = πr² &nbsp;&nbsp; Circumference = 2πr</p><p class='f'>Sector = (θ/360) × πr² &nbsp;&nbsp; Arc = (θ/360) × 2πr</p><p>r = 7 → area 154, circumference 44.</p><p>A wheel of radius 35 cm moves 2π × 35 = 220 cm per turn, so 1.1 km takes 110,000 ÷ 220 = <b>500</b> turns.</p>",
      ask: { q: "Find the area of a sector of radius 14 and angle 90°.", a: "¼ × 22/7 × 196 = 154." } },
    { h: "% change in area", body: "<p>Area uses two lengths, so changes combine like successive percentages.</p><ul><li>Each side +10% → area +21% (10 + 10 + 1).</li><li>Length +20%, breadth −20% → area −4%.</li><li>Radius doubled → area × 4.</li></ul>" },
    { h: "Cube and cuboid", body: "<p class='f'>Cuboid: V = lbh, TSA = 2(lb + bh + hl), diagonal = √(l² + b² + h²)</p><p class='f'>Cube: V = a³, TSA = 6a², diagonal = a√3</p><p>Cuboid 3 × 4 × 12 → diagonal √(9 + 16 + 144) = <b>13</b>.</p><p>Area of four walls of a room = 2(l + b) × h.</p>",
      ask: { q: "A cube has surface area 150. Find its volume.", a: "6a² = 150 → a = 5 → volume 125." } },
    { h: "Cylinder and cone", body: "<p class='f'>Cylinder: V = πr²h, CSA = 2πrh, TSA = 2πr(r + h)</p><p class='f'>Cone: V = ⅓πr²h, slant l = √(r² + h²), CSA = πrl</p><p>Cylinder r 7, h 10 → V = 22/7 × 49 × 10 = <b>1,540</b>.</p><p>Cone r 7, h 24 → l = 25 → CSA = 22/7 × 7 × 25 = <b>550</b>.</p>", viz: { type: "cone" } },
    { h: "Sphere and hemisphere", body: "<p class='f'>Sphere: V = (4/3)πr³, SA = 4πr²</p><p class='f'>Hemisphere: V = (2/3)πr³, CSA = 2πr², TSA = 3πr²</p><p>Radius doubled → volume × 8 (a 700% increase), surface area × 4.</p>",
      ask: { q: "Find the total surface area of a solid hemisphere of radius 7 cm.", a: "3 × 22/7 × 49 = 462 cm²." } },
    { h: "Melting and recasting", body: "<p>When a solid is melted and made into other shapes, the <b>volume stays the same</b>.</p><p>A sphere of radius 6 is melted into spheres of radius 2: (6/2)³ = <b>27</b> small spheres.</p><p>A cylinder (r 3, h 7) into cones (r 1, h 3): 63π ÷ π = <b>63</b> cones.</p>" },
    { h: "Exam strategy", body: "<ul><li>Write the formula first, then substitute.</li><li>Use π = 22/7 with multiples of 7; π often cancels in ratio questions.</li><li>Scaling: lengths × k → area × k², volume × k³.</li><li>Melting: equate volumes.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["area2d", "solid3d", "scaling", "recast"],
  formulas: [
    ["Triangle", "½bh; Heron √[s(s − a)(s − b)(s − c)]; equilateral (√3/4)a²"],
    ["Rectangle / square", "lb, 2(l + b), √(l² + b²) / a², a√2"],
    ["Rhombus / trapezium", "½d₁d₂ / ½(a + b)h"],
    ["Circle", "πr², 2πr"],
    ["Sector / arc", "(θ/360)πr² / (θ/360)2πr"],
    ["Cuboid", "lbh; 2(lb + bh + hl); √(l² + b² + h²)"],
    ["Cube", "a³; 6a²; a√3"],
    ["Cylinder", "πr²h; 2πrh; 2πr(r + h)"],
    ["Cone", "⅓πr²h; l = √(r² + h²); πrl; πr(l + r)"],
    ["Sphere / hemisphere", "(4/3)πr³, 4πr² / (2/3)πr³, 3πr²"],
    ["Scaling by k", "area × k², volume × k³"],
    ["Melting", "volume before = volume after"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "The area of a triangle with sides 13, 14 and 15 is…", o: ["84", "91", "72", "105"], why: "s = 21; √(21 × 8 × 7 × 6) = 84.", hint: "Heron's formula." },
    { q: "The area of a circle of radius 7 cm is…", o: ["154 cm²", "44 cm²", "148 cm²", "308 cm²"], why: "22/7 × 49 = 154.", hint: "πr² with π = 22/7." },
    { q: "A rhombus has diagonals 16 and 12. Its area is…", o: ["96", "192", "48", "100"], why: "½ × 16 × 12 = 96.", hint: "Half the product of the diagonals." },
    { q: "Each side of a square is increased by 10%. Its area increases by…", o: ["21%", "20%", "10%", "11%"], why: "1.1² = 1.21.", hint: "Successive percentages." },
    { q: "A cuboid measures 3 × 4 × 12. Its diagonal is…", o: ["13", "19", "12", "15"], why: "√(9 + 16 + 144) = 13.", hint: "√(l² + b² + h²)." },
    { q: "A cylinder has radius 7 cm and height 10 cm. Its volume is…", o: ["1,540 cm³", "440 cm³", "770 cm³", "3,080 cm³"], why: "22/7 × 49 × 10 = 1,540.", hint: "πr²h." },
    { q: "A cone has radius 7 cm and height 24 cm. Its curved surface area is…", o: ["550 cm²", "528 cm²", "704 cm²", "1,232 cm²"], why: "l = 25; 22/7 × 7 × 25 = 550.", hint: "Find the slant height first." },
    { q: "A sphere of radius 6 cm is melted into spheres of radius 2 cm. How many?", o: ["27", "9", "3", "8"], why: "(6/2)³ = 27.", hint: "Volumes are equal." },
    { q: "The area of an equilateral triangle of side 8 is…", o: ["16√3", "32√3", "8√3", "64"], why: "(√3/4) × 64 = 16√3.", hint: "(√3/4)a²." },
    { q: "A sector of radius 14 has an angle of 90°. Its area is…", o: ["154", "616", "44", "308"], why: "¼ × 22/7 × 196 = 154.", hint: "θ/360 of the circle." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "A rectangle has perimeter 46 m and area 120 m². Its diagonal is…", o: ["17 m", "23 m", "13 m", "15 m"], why: "l + b = 23, lb = 120 → 15 and 8 → √(225 + 64) = 17." },
      { q: "A wheel of radius 35 cm covers 1.1 km. How many revolutions does it make?", o: ["500", "250", "1000", "400"], why: "Circumference 220 cm; 110,000 ÷ 220 = 500." },
      { q: "A trapezium has parallel sides 10 and 16 and height 6. Its area is…", o: ["78", "96", "156", "60"], why: "½ × 26 × 6 = 78." },
      { q: "A cube has a total surface area of 150 cm². Its volume is…", o: ["125 cm³", "150 cm³", "216 cm³", "64 cm³"], why: "6a² = 150 → a = 5 → 125." },
      { q: "The total surface area of a solid hemisphere of radius 7 cm is…", o: ["462 cm²", "308 cm²", "616 cm²", "154 cm²"], why: "3πr² = 3 × 22/7 × 49 = 462." },
      { q: "If the radius of a sphere is doubled, its volume increases by…", o: ["700%", "800%", "300%", "100%"], why: "Volume × 8, an increase of 7 times = 700%." },
      { q: "A cylinder of radius 3 cm and height 7 cm is melted into cones of radius 1 cm and height 3 cm. How many cones?", o: ["63", "21", "189", "9"], why: "π × 9 × 7 ÷ (⅓π × 1 × 3) = 63." },
      { q: "A room is 10 m × 8 m × 4 m. The area of its four walls is…", o: ["144 m²", "320 m²", "224 m²", "80 m²"], why: "2(10 + 8) × 4 = 144." },
      { q: "A circle has area 616 cm². Its circumference is…", o: ["88 cm", "44 cm", "176 cm", "154 cm"], why: "r² = 196 → r = 14 → 2 × 22/7 × 14 = 88." },
      { q: "A rectangle's length is increased by 20% and its breadth decreased by 20%. Its area…", o: ["decreases by 4%", "does not change", "increases by 4%", "decreases by 2%"], why: "1.2 × 0.8 = 0.96." }
    ]
  }
};
