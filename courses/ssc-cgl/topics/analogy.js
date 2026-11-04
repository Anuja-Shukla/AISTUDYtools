/* SSC CGL · Reasoning · Analogy. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["analogy"] = {
  id: "analogy", subject: "reasoning", num: 1, title: "Analogy",
  minutes: 35,
  why: "Analogy gives 2–3 Tier 1 reasoning questions: word, number and letter pairs. Find the rule in the first pair and apply it to the second.",
  video: "videos/SSC_R01_Analogy.mp4",
  slides: [
    { h: "Why analogy matters", body: "<p>An analogy question reads <b>A : B :: C : ?</b> — “A is to B as C is to ?”.</p><ul><li><b>word</b> analogies: meaning and relationships</li><li><b>number</b> analogies: an arithmetic rule</li><li><b>letter</b> analogies: alphabet positions and shifts</li></ul><p>The method is always the same: put the first relationship into a short sentence, then test it on the options.</p>" },
    { h: "Common word relationships", body: "<ul><li><b>Tool : use</b> — Pen : Write, Knife : Cut</li><li><b>Worker : workplace</b> — Doctor : Hospital, Teacher : School</li><li><b>Animal : young one</b> — Cow : Calf, Dog : Puppy</li><li><b>Part : whole / group</b> — Flower : Bouquet, Soldier : Army</li><li><b>Instrument : measures</b> — Thermometer : Temperature</li><li><b>Country : capital</b> — Japan : Tokyo</li></ul>",
      ask: { q: "Book : Library :: Painting : ?", a: "Gallery (where it is kept and shown)." } },
    { h: "Make a sentence, then test", body: "<p>Say the relationship aloud: “A <b>pen</b> is used to <b>write</b>.”</p><p>Now try each option in the same sentence: “A knife is used to … <b>cut</b>.” ✓ “A knife is used to … steel.” ✗</p><p class='warn'>If two options fit, make the sentence more specific.</p>" },
    { h: "Number analogies", body: "<p>Look for a rule that turns the first number into the second:</p><ul><li>3 : 27 :: 4 : 64 → <b>cube</b></li><li>11 : 121 :: 15 : 225 → <b>square</b></li><li>5 : 26 :: 7 : 50 → <b>n² + 1</b></li><li>6 : 35 :: 8 : 63 → <b>n² − 1</b></li><li>7 : 56 :: 9 : 90 → <b>n(n + 1)</b></li></ul>",
      ask: { q: "2 : 9 :: 3 : ?", a: "n³ + 1: 27 + 1 = 28." } },
    { h: "Letter positions", body: "<p>Know the alphabet positions: A = 1 … Z = 26. Memory aid <b>EJOTY</b> = 5, 10, 15, 20, 25.</p><p>ACE : BDF → each letter moves <b>+1</b>. So GIK : HJL.</p><p>BDF : GIK → each letter moves <b>+5</b>. So LNP : QSU.</p>",
      ask: { q: "CAT : DBU :: DOG : ?", a: "Each letter +1: EPH." } },
    { h: "Opposite letters", body: "<p>Opposite pairs add to 27: A–Z, B–Y, C–X, … M–N.</p><p>ABC : ZYX → each letter is replaced by its opposite. So DEF : <b>WVU</b>.</p><p>GOLD → TLOW (G↔T, O↔L, L↔O, D↔W).</p>",
      ask: { q: "Using opposites, write SILVER.", a: "S↔H, I↔R, L↔O, V↔E, E↔V, R↔I → HROEVI." } },
    { h: "Exam strategy", body: "<ul><li>Word pairs: say the relationship in one sentence.</li><li>Numbers: try squares, cubes, ±1 and n(n + 1) first.</li><li>Letters: write positions under the letters and find the shift.</li><li>Always check your rule on both pairs.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["alpha", "numrule", "letshift", "relquiz"],
  formulas: [
    ["Letter positions", "A = 1 … Z = 26; EJOTY = 5, 10, 15, 20, 25"],
    ["Opposite letters", "positions add to 27 (A–Z, M–N)"],
    ["Reverse position", "27 − position (A = 26 from the end)"],
    ["Common number rules", "n², n³, n² ± 1, n³ ± 1, n(n + 1), ×k, +k"],
    ["Word relationships", "tool–use, worker–place, young one, part–whole, measures, capital"],
    ["Method", "make a sentence for pair 1, test it on the options"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "Pen : Write :: Knife : ?", o: ["Cut", "Sharp", "Steel", "Kitchen"], why: "A pen is used to write; a knife is used to cut.", hint: "Tool : what it does." },
    { q: "Doctor : Hospital :: Teacher : ?", o: ["School", "Student", "Book", "Class"], why: "Worker : workplace.", hint: "Where do they work?" },
    { q: "Cow : Calf :: Dog : ?", o: ["Puppy", "Kitten", "Cub", "Foal"], why: "Animal : its young one.", hint: "Young of a dog." },
    { q: "3 : 27 :: 4 : ?", o: ["64", "16", "48", "81"], why: "Cube: 4³ = 64.", hint: "3 × 3 × 3 = 27." },
    { q: "5 : 26 :: 7 : ?", o: ["50", "49", "48", "56"], why: "n² + 1: 49 + 1.", hint: "25 + 1 = 26." },
    { q: "ACE : BDF :: GIK : ?", o: ["HJL", "HIJ", "IKM", "GHI"], why: "Each letter +1.", hint: "Compare A→B, C→D." },
    { q: "CAT : DBU :: DOG : ?", o: ["EPH", "EPG", "FQI", "CNF"], why: "Each letter +1.", hint: "C→D, A→B." },
    { q: "ABC : ZYX :: DEF : ?", o: ["WVU", "UVW", "XWV", "VUT"], why: "Opposite letters: D↔W, E↔V, F↔U.", hint: "Positions add to 27." },
    { q: "6 : 35 :: 8 : ?", o: ["63", "64", "48", "65"], why: "n² − 1: 64 − 1.", hint: "36 − 1 = 35." },
    { q: "Book : Library :: Painting : ?", o: ["Gallery", "Artist", "Canvas", "Brush"], why: "Where it is kept and displayed.", hint: "A place." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "Hand : Glove :: Foot : ?", o: ["Sock", "Toe", "Leg", "Ankle"], why: "Body part : what covers it." },
      { q: "India : New Delhi :: Japan : ?", o: ["Tokyo", "Osaka", "Kyoto", "Yen"], why: "Country : capital." },
      { q: "2 : 9 :: 3 : ?", o: ["28", "27", "10", "26"], why: "n³ + 1: 27 + 1 = 28." },
      { q: "11 : 121 :: 15 : ?", o: ["225", "215", "195", "256"], why: "Square." },
      { q: "BDF : GIK :: LNP : ?", o: ["QSU", "PRT", "RTV", "QRS"], why: "Each letter +5." },
      { q: "If GOLD is written as TLOW, how is SILVER written?", o: ["HROEVI", "HRPEVI", "TJMWFS", "HROFVI"], why: "Each letter is replaced by its opposite (positions add to 27)." },
      { q: "7 : 56 :: 9 : ?", o: ["90", "81", "72", "99"], why: "n(n + 1): 9 × 10." },
      { q: "Flower : Bouquet :: Soldier : ?", o: ["Army", "Gun", "War", "Uniform"], why: "One member : the group." },
      { q: "12 : 144 :: 13 : ?", o: ["169", "156", "144", "196"], why: "Square." },
      { q: "Thermometer : Temperature :: Barometer : ?", o: ["Pressure", "Rain", "Height", "Speed"], why: "Instrument : what it measures." }
    ]
  }
};
