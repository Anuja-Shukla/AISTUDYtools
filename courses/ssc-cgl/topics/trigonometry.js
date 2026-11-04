/* SSC CGL · Quant · Trigonometry, heights & distances. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["trigonometry"] = {
  id: "trigonometry", subject: "quant", num: 15, title: "Trigonometry, heights & distances",
  minutes: 55,
  why: "Trigonometry gives 2–3 Tier 1 questions and many in Tier 2. Six ratios, one table of values and three identities cover almost all of them.",
  video: "videos/SSC_Q15_Trigonometry.mp4",
  slides: [
    { h: "Why trigonometry matters", body: "<p>SSC trigonometry asks four kinds of questions:</p><ul><li>finding ratios from one given ratio</li><li>standard values (0°, 30°, 45°, 60°, 90°)</li><li>identities and complementary angles</li><li>heights and distances with angles of elevation and depression</li></ul>" },
    { h: "The six ratios", body: "<p>In a right triangle, for angle θ: P = side opposite θ, B = side next to θ, H = hypotenuse.</p><p class='f'>sin = P/H &nbsp; cos = B/H &nbsp; tan = P/B</p><p class='f'>cosec = 1/sin &nbsp; sec = 1/cos &nbsp; cot = 1/tan</p><p>3-4-5 triangle: sin θ = 3/5, cos θ = 4/5, tan θ = 3/4.</p>", viz: { type: "rt", a: 4, b: 3 },
      ask: { q: "cos θ = 5/13. Find sin θ and tan θ.", a: "P = 12 (5-12-13): sin θ = 12/13, tan θ = 12/5." } },
    { h: "Standard values", body: "<table class='pt'><tr><th>θ</th><th>0°</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th></tr><tr><td>sin</td><td>0</td><td>1/2</td><td>1/√2</td><td>√3/2</td><td>1</td></tr><tr><td>cos</td><td>1</td><td>√3/2</td><td>1/√2</td><td>1/2</td><td>0</td></tr><tr><td>tan</td><td>0</td><td>1/√3</td><td>1</td><td>√3</td><td>—</td></tr></table><p>Trick: sin goes √0/2, √1/2, √2/2, √3/2, √4/2. cos is the same list backwards.</p>",
      ask: { q: "Find sin 30° + cos 60° and tan 45° + sin 90°.", a: "1/2 + 1/2 = 1; 1 + 1 = 2." } },
    { h: "The three identities", body: "<p class='f'>sin²θ + cos²θ = 1</p><p class='f'>1 + tan²θ = sec²θ &nbsp;&nbsp; 1 + cot²θ = cosec²θ</p><p>So (1 − cos²θ) sec²θ = sin²θ ÷ cos²θ = <b>tan²θ</b>.</p><p>If sec θ + tan θ = k, then sec θ − tan θ = 1/k (because sec² − tan² = 1).</p>",
      ask: { q: "sec θ + tan θ = 2. Find sec θ − tan θ.", a: "1/2." } },
    { h: "Complementary angles", body: "<p class='f'>sin(90° − θ) = cos θ &nbsp; tan(90° − θ) = cot θ &nbsp; sec(90° − θ) = cosec θ</p><ul><li>sin 37° ÷ cos 53° = 1</li><li>sin² 25° + sin² 65° = sin² 25° + cos² 25° = 1</li><li>tan 10° tan 20° tan 70° tan 80° = 1 (pairs make tan × cot)</li></ul>" },
    { h: "Maximum and minimum", body: "<p class='f'>a sin θ + b cos θ lies between −√(a² + b²) and +√(a² + b²)</p><p>3 sin θ + 4 cos θ has maximum <b>5</b>.</p><p>For a sin²θ + b cos²θ, the value lies between a and b: 9 sin²θ + 16 cos²θ has minimum 9 and maximum 16.</p>" },
    { h: "Heights and distances", body: "<p>Angle of <b>elevation</b>: looking up. Angle of <b>depression</b>: looking down (equal to the elevation from the other end).</p><p class='f'>tan θ = height ÷ horizontal distance</p><p>A tower seen from 30 m at 60° → height = 30 × √3 = <b>30√3 m</b>.</p><p>If a pole's shadow equals its height, the sun's elevation is 45°.</p>",
      ask: { q: "A 20 m ladder makes 60° with the ground. How far is its foot from the wall?", a: "20 × cos 60° = 10 m." } },
    { h: "Two angles of elevation", body: "<p>From two points on the same side of a tower, the elevations are 30° and 60°, and the points are 40 m apart.</p><p>h cot 30° − h cot 60° = 40 → h(√3 − 1/√3) = 40 → h × 2/√3 = 40 → <b>h = 20√3 m</b>.</p><p>Draw the figure and use tan on each right triangle.</p>" },
    { h: "Exam strategy", body: "<ul><li>Sketch a right triangle for any ratio question and use a triplet.</li><li>Learn the value table by heart.</li><li>Pair complementary angles (37° and 53°, 10° and 80°).</li><li>Heights: tan θ = opposite ÷ adjacent; 30°, 45° and 60° give √3 and 1.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["ratios6", "unitc", "heights", "twoang"],
  formulas: [
    ["sin, cos, tan", "P/H, B/H, P/B"],
    ["cosec, sec, cot", "1/sin, 1/cos, 1/tan"],
    ["sin 0°, 30°, 45°, 60°, 90°", "0, 1/2, 1/√2, √3/2, 1"],
    ["tan 0°, 30°, 45°, 60°", "0, 1/√3, 1, √3"],
    ["Identities", "sin² + cos² = 1; 1 + tan² = sec²; 1 + cot² = cosec²"],
    ["Complementary", "sin(90° − θ) = cos θ; tan(90° − θ) = cot θ"],
    ["sec θ + tan θ = k", "sec θ − tan θ = 1/k"],
    ["a sin θ + b cos θ", "between −√(a² + b²) and √(a² + b²)"],
    ["a sin²θ + b cos²θ", "between a and b"],
    ["Heights", "tan θ = height ÷ distance"],
    ["Two elevations α, β (same side, gap d)", "h = d ÷ (cot α − cot β)"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "If sin θ = 3/5, then tan θ = ?", o: ["3/4", "4/3", "4/5", "5/3"], why: "3-4-5 triangle: P = 3, B = 4.", hint: "Draw the triangle." },
    { q: "sin 30° + cos 60° = ?", o: ["1", "1/2", "√3", "0"], why: "1/2 + 1/2 = 1.", hint: "Use the value table." },
    { q: "tan 45° + sin 90° = ?", o: ["2", "1", "0", "√2"], why: "1 + 1 = 2.", hint: "Both are 1." },
    { q: "sin² 25° + sin² 65° = ?", o: ["1", "0", "2", "1/2"], why: "sin 65° = cos 25°, so it is sin² + cos² = 1.", hint: "65 = 90 − 25." },
    { q: "sin 37° ÷ cos 53° = ?", o: ["1", "0", "2", "1/√2"], why: "cos 53° = sin 37°.", hint: "37 + 53 = 90." },
    { q: "If sec θ + tan θ = 2, then sec θ − tan θ = ?", o: ["1/2", "2", "1", "1/4"], why: "(sec + tan)(sec − tan) = 1.", hint: "sec² − tan² = 1." },
    { q: "The maximum value of 3 sin θ + 4 cos θ is…", o: ["5", "7", "4", "1"], why: "√(9 + 16) = 5.", hint: "√(a² + b²)." },
    { q: "A tower is seen at 60° elevation from 30 m away. Its height is…", o: ["30√3 m", "10√3 m", "30 m", "60 m"], why: "30 × tan 60° = 30√3.", hint: "tan = height ÷ distance." },
    { q: "A pole's shadow equals its height. The sun's elevation is…", o: ["45°", "30°", "60°", "90°"], why: "tan θ = 1.", hint: "Height ÷ shadow = 1." },
    { q: "(1 − cos²θ) × sec²θ = ?", o: ["tan²θ", "sin²θ", "1", "cot²θ"], why: "sin²θ ÷ cos²θ = tan²θ.", hint: "1 − cos² = sin²." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "If cos θ = 5/13, then sin θ + tan θ = ?", o: ["216/65", "17/13", "12/5", "156/65"], why: "sin = 12/13, tan = 12/5; 60/65 + 156/65 = 216/65." },
      { q: "tan 10° × tan 20° × tan 70° × tan 80° = ?", o: ["1", "0", "√3", "2"], why: "tan 80° = cot 10° and tan 70° = cot 20°, so each pair is 1." },
      { q: "If sin θ + cos θ = √2 (θ acute), then θ = ?", o: ["45°", "30°", "60°", "0°"], why: "1/√2 + 1/√2 = √2." },
      { q: "(sin θ + cosec θ)² + (cos θ + sec θ)² − (tan²θ + cot²θ) = ?", o: ["7", "5", "9", "1"], why: "1 + 4 + (cosec² − cot²) + (sec² − tan²) = 1 + 4 + 1 + 1 = 7." },
      { q: "If 2 sin θ = 1 (θ acute), then cos 2θ = ?", o: ["1/2", "√3/2", "0", "1"], why: "θ = 30°, so cos 60° = 1/2." },
      { q: "A 20 m ladder leans on a wall at 60° to the ground. Its foot is how far from the wall?", o: ["10 m", "10√3 m", "20 m", "5 m"], why: "20 × cos 60° = 10." },
      { q: "From the top of a 100 m tower, a car is seen at a depression of 30°. Its distance from the foot is…", o: ["100√3 m", "100 m", "100/√3 m", "200 m"], why: "100 ÷ tan 30° = 100√3." },
      { q: "From two points 40 m apart on the same side, a tower's elevations are 30° and 60°. Its height is…", o: ["20√3 m", "40√3 m", "20 m", "40 m"], why: "h(√3 − 1/√3) = 40 → h = 20√3." },
      { q: "The minimum value of 9 sin²θ + 16 cos²θ is…", o: ["9", "16", "25", "0"], why: "9 + 7 cos²θ is least when cos θ = 0." },
      { q: "If tan θ = 1, then sec²θ + cosec²θ = ?", o: ["4", "2", "1", "3"], why: "θ = 45°: 2 + 2 = 4." }
    ]
  }
};
