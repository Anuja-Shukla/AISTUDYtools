/* SSC CGL · Reasoning · Venn diagrams. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["venn"] = {
  id: "venn", subject: "reasoning", num: 10, title: "Venn diagrams",
  minutes: 30,
  why: "Venn diagrams give 1–2 Tier 1 marks: pick the diagram that shows how three groups are related, or count people in overlapping groups. Ask two questions for each pair: is one inside the other, do they overlap, or are they apart?",
  video: "videos/SSC_R10_Venn.mp4",
  slides: [
    { h: "Two kinds of question", body: "<ul><li><b>Pick the diagram</b>: which picture shows Delhi, India and Asia?</li><li><b>Count</b>: 30 like tea, 25 like coffee, 10 like both. How many like at least one?</li></ul>" },
    { h: "Three relations for any pair", body: "<ul><li><b>Inside</b>: every A is a B (Delhi is in India)</li><li><b>Overlap</b>: some A are B (women and doctors)</li><li><b>Apart</b>: no A is B (men and women)</li></ul><p>Decide this for all three pairs, then choose the picture.</p>" },
    { h: "The standard pictures", body: "<p>Most answers are one of these:</p>", viz: { type: "vgal" } },
    { h: "Worked examples", body: "<ul><li>Delhi, India, Asia → <b>nested</b></li><li>Dogs, Cats, Animals → <b>two separate inside a third</b></li><li>Men, Women, Doctors → <b>two separate, both overlapping a third</b></li><li>Teachers, Singers, Women → <b>three mutually overlapping</b></li><li>Mangoes, Fruits, Vegetables → <b>one inside another; third separate</b></li></ul>",
      ask: { q: "Women, Mothers, Teachers?", a: "Mothers inside women; teachers overlap both → one inside another, third overlaps both." } },
    { h: "Counting with two sets", body: "<p>At least one = A + B − both.</p><p>Tea 30, coffee 25, both 10 → 30 + 25 − 10 = <b>45</b>.</p><p>Only tea = 30 − 10 = 20. Neither = total − at least one.</p>", viz: { type: "venn2", a: 20, b: 15, ab: 10 } },
    { h: "Counting with three sets", body: "<p>At least one = A + B + C − (AB + BC + CA) + ABC.</p><p>Fill the diagram from the middle outwards: first all three, then each pair, then each “only”.</p><p>Three overlapping circles have <b>7</b> regions inside.</p>" },
    { h: "Exam strategy", body: "<ul><li>For each pair ask: inside, overlap or apart?</li><li>Start with the biggest group as the outer circle.</li><li>For counting, always start from the centre.</li><li>Do not double-count the people in “both”.</li></ul>" }
  ],
  tools: ["venn2calc", "venn3calc", "vtypegame"],
  formulas: [
    ["Two sets", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)"],
    ["Only A", "n(A) − n(A ∩ B)"],
    ["Neither", "total − n(A ∪ B)"],
    ["Three sets", "A + B + C − AB − BC − CA + ABC"],
    ["Regions", "2 circles: 3 inside · 3 circles: 7 inside"]
  ],
  practice: [
    { q: "Which diagram best shows Delhi, India, Asia?", o: ["Nested: one inside another inside a third", "Three separate circles", "Two separate circles inside a third", "Three mutually overlapping circles"], why: "Delhi ⊂ India ⊂ Asia.", hint: "Each is inside the next." },
    { q: "Which diagram best shows Men, Women, Doctors?", o: ["Two separate circles, both overlapping a third", "Two separate circles inside a third", "Three mutually overlapping circles", "Nested: one inside another inside a third"], why: "Men and women are apart; some of each are doctors.", hint: "Men and women do not overlap." },
    { q: "Which diagram best shows Dogs, Cats, Animals?", o: ["Two separate circles inside a third", "Two overlapping circles inside a third", "Three separate circles", "Nested: one inside another inside a third"], why: "Dogs and cats are apart, both are animals.", hint: "Animals is the outer circle." },
    { q: "Which diagram best shows Pen, Book, Table?", o: ["Three separate circles", "Three mutually overlapping circles", "Two separate circles inside a third", "Two overlapping circles; third separate"], why: "No pen is a book or a table.", hint: "Unrelated objects." },
    { q: "Which diagram best shows Teachers, Singers, Women?", o: ["Three mutually overlapping circles", "Two separate circles, both overlapping a third", "Three separate circles", "Nested: one inside another inside a third"], why: "Each pair can overlap: a woman singer who teaches exists.", hint: "Every pair overlaps." },
    { q: "Which diagram best shows Mangoes, Fruits, Vegetables?", o: ["One inside another; third separate", "Two separate circles inside a third", "Nested: one inside another inside a third", "Three separate circles"], why: "Mangoes ⊂ fruits; vegetables apart.", hint: "Vegetables are not fruits." },
    { q: "30 people like tea, 25 like coffee and 10 like both. How many like at least one?", o: ["45", "55", "65", "35"], why: "30 + 25 − 10.", hint: "Do not count ‘both’ twice." },
    { q: "In a class of 50, 30 play cricket, 25 play football and 10 play both. How many play neither?", o: ["5", "15", "10", "0"], why: "50 − (30 + 25 − 10).", hint: "Find ‘at least one’ first." },
    { q: "How many regions lie inside three mutually overlapping circles?", o: ["7", "8", "6", "3"], why: "3 only + 3 pairs + 1 centre.", hint: "Count from the centre out." },
    { q: "Which diagram best shows Elephants, Wild animals, Animals?", o: ["Two overlapping circles inside a third", "Two separate circles inside a third", "Nested: one inside another inside a third", "Three mutually overlapping circles"], why: "Some elephants are wild; both groups are animals.", hint: "Elephants and wild animals overlap." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "Which diagram best shows Rose, Lily, Flower?", o: ["Two separate circles inside a third", "Two overlapping circles inside a third", "Three separate circles", "Nested: one inside another inside a third"], why: "Rose and lily are apart; both are flowers." },
      { q: "Which diagram best shows Earth, Solar system, Universe?", o: ["Nested: one inside another inside a third", "Two separate circles inside a third", "Three separate circles", "One inside another; third separate"], why: "Earth ⊂ solar system ⊂ universe." },
      { q: "Which diagram best shows Chair, Sun, River?", o: ["Three separate circles", "Three mutually overlapping circles", "Two overlapping circles; third separate", "Two separate circles inside a third"], why: "Unrelated." },
      { q: "Which diagram best shows Women, Mothers, Teachers?", o: ["One inside another; third overlaps both", "Three mutually overlapping circles", "Two separate circles, both overlapping a third", "Nested: one inside another inside a third"], why: "Mothers ⊂ women; teachers overlap both." },
      { q: "Which diagram best shows Square, Rectangle, Quadrilateral?", o: ["Nested: one inside another inside a third", "Two separate circles inside a third", "Two overlapping circles inside a third", "Three mutually overlapping circles"], why: "Every square is a rectangle; every rectangle is a quadrilateral." },
      { q: "40 people read paper A, 35 read paper B and 15 read both. How many read at least one?", o: ["60", "75", "90", "50"], why: "40 + 35 − 15." },
      { q: "Of 100 people, 60 speak Hindi, 50 speak English and 20 speak both. How many speak neither?", o: ["10", "20", "30", "0"], why: "100 − (60 + 50 − 20)." },
      { q: "20 drink only tea, 15 drink only coffee and 10 drink both. How many drink tea?", o: ["30", "20", "45", "35"], why: "Only tea + both = 20 + 10." },
      { q: "How many regions lie inside two overlapping circles?", o: ["3", "4", "2", "7"], why: "Only A, only B, both." },
      { q: "Which diagram best shows Students, Girls, Swimmers? (Assume all girls here are students.)", o: ["One inside another; third overlaps both", "Nested: one inside another inside a third", "Two separate circles inside a third", "Three separate circles"], why: "Girls ⊂ students; swimmers overlap both." }
    ]
  }
};
