/* SSC CGL · Reasoning · Classification (odd one out). Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["classification"] = {
  id: "classification", subject: "reasoning", num: 2, title: "Classification (odd one out)",
  minutes: 30,
  why: "Classification gives 2–3 Tier 1 reasoning questions: find the word, number, letter group or pair that does not belong with the rest.",
  video: "videos/SSC_R02_Classification.mp4",
  slides: [
    { h: "Why classification matters", body: "<p>Three items share a property; one does not. Your job is to find that property.</p><ul><li>words: category, use, place</li><li>numbers: prime, square, cube, even, divisible by</li><li>letter groups: gaps between letters, vowels</li><li>number pairs: a rule linking each pair</li></ul>" },
    { h: "Word groups", body: "<p>Ask “what are three of these?” before “which is odd?”.</p><ul><li>Apple, Mango, Banana, <b>Potato</b> → three fruits, one vegetable</li><li>Violin, Guitar, Sitar, <b>Flute</b> → three string instruments, one wind</li><li>Mercury, Venus, Mars, <b>Moon</b> → three planets, one satellite</li></ul><p class='warn'>Choose the most specific common property, not a loose one.</p>" },
    { h: "Number properties to test", body: "<p>Check, in this order:</p><ol><li>prime or not</li><li>perfect square or cube</li><li>even or odd</li><li>divisible by 3, 7, 11</li><li>digit sum</li></ol><ul><li>17, 23, 29, <b>33</b> → 33 = 3 × 11 is not prime</li><li>16, 25, 36, <b>50</b> → 50 is not a square</li><li>27, 64, 125, <b>150</b> → 150 is not a cube</li></ul>",
      ask: { q: "Find the odd one: 121, 144, 169, 192.", a: "192: the others are 11², 12², 13²." } },
    { h: "Letter groups", body: "<p>Write the gaps between the letters (use positions).</p><p>ACE (+2, +2), GIK (+2, +2), MOQ (+2, +2), <b>RTW</b> (+2, +3) → RTW is odd.</p><p>BCD, FGH, JKL are consecutive; <b>MOP</b> is not.</p><p>Also check for vowels: groups with a vowel may be the odd one.</p>",
      ask: { q: "Find the odd one: ZYX, WVU, TSR, QPN.", a: "QPN: the others move −1, −1; QPN moves −1, −2." } },
    { h: "Number pairs", body: "<p>Find the rule in most pairs, then the pair that breaks it.</p><p>4–16, 5–25, 6–36, <b>7–48</b> → the rule is n²; 7² = 49.</p><p>3–10, 5–26, 7–50, <b>9–81</b> → the rule is n² + 1; 9² + 1 = 82.</p>" },
    { h: "Exam strategy", body: "<ul><li>Name the group of three first.</li><li>For numbers, test prime → square → cube → divisibility.</li><li>For letters, write the gaps.</li><li>If two answers seem odd, pick the one that breaks the most specific pattern.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["numprop", "lgap", "pairrule", "oddgame"],
  formulas: [
    ["Check order for numbers", "prime → square → cube → even/odd → divisibility → digit sum"],
    ["Squares to remember", "11² = 121 … 20² = 400"],
    ["Cubes to remember", "1, 8, 27, 64, 125, 216, 343, 512, 729, 1000"],
    ["Letter groups", "write the gaps between positions"],
    ["Pairs", "find the rule in three pairs; the fourth breaks it"],
    ["Words", "name the category of three"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "Find the odd one: Apple, Mango, Potato, Banana", o: ["Potato", "Apple", "Mango", "Banana"], why: "Potato is a vegetable; the rest are fruits.", hint: "What are three of them?" },
    { q: "Find the odd one: Violin, Guitar, Sitar, Flute", o: ["Flute", "Violin", "Guitar", "Sitar"], why: "Flute is a wind instrument; the rest have strings.", hint: "How is each played?" },
    { q: "Find the odd one: 17, 23, 29, 33", o: ["33", "17", "23", "29"], why: "33 = 3 × 11 is not prime.", hint: "Prime test." },
    { q: "Find the odd one: 16, 25, 36, 50", o: ["50", "16", "25", "36"], why: "50 is not a perfect square.", hint: "Squares." },
    { q: "Find the odd one: 27, 64, 125, 150", o: ["150", "27", "64", "125"], why: "150 is not a cube.", hint: "Cubes." },
    { q: "Find the odd one: ACE, GIK, MOQ, RTW", o: ["RTW", "ACE", "GIK", "MOQ"], why: "RTW has gaps +2, +3; the others +2, +2.", hint: "Write the gaps." },
    { q: "Find the odd pair: 4–16, 5–25, 6–36, 7–48", o: ["7–48", "4–16", "5–25", "6–36"], why: "Rule n²: 7² = 49.", hint: "Square the first number." },
    { q: "Find the odd one: Mercury, Venus, Moon, Mars", o: ["Moon", "Mercury", "Venus", "Mars"], why: "The Moon is a satellite; the rest are planets.", hint: "Planets." },
    { q: "Find the odd one: 121, 144, 169, 192", o: ["192", "121", "144", "169"], why: "11², 12², 13²; 192 is not a square.", hint: "Squares." },
    { q: "Find the odd one: BCD, FGH, JKL, MOP", o: ["MOP", "BCD", "FGH", "JKL"], why: "MOP is not three consecutive letters.", hint: "Gaps of 1." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "Find the odd one: Lion, Tiger, Leopard, Cow", o: ["Cow", "Lion", "Tiger", "Leopard"], why: "Cow is a herbivore and domestic; the rest are wild big cats." },
      { q: "Find the odd one: Rose, Lotus, Lily, Mango", o: ["Mango", "Rose", "Lotus", "Lily"], why: "Mango is a fruit; the rest are flowers." },
      { q: "Find the odd one: 2, 3, 5, 9", o: ["9", "2", "3", "5"], why: "9 is not prime." },
      { q: "Find the odd one: 13, 17, 23, 27", o: ["27", "13", "17", "23"], why: "27 = 3³ is not prime." },
      { q: "Find the odd one: 8, 27, 64, 100", o: ["100", "8", "27", "64"], why: "100 is not a cube." },
      { q: "Find the odd one: BDF, HJL, NPR, TVY", o: ["TVY", "BDF", "HJL", "NPR"], why: "TVY has gaps +2, +3." },
      { q: "Find the odd pair: 3–10, 5–26, 7–50, 9–81", o: ["9–81", "3–10", "5–26", "7–50"], why: "Rule n² + 1: 9² + 1 = 82." },
      { q: "Find the odd one: Metre, Centimetre, Kilometre, Kilogram", o: ["Kilogram", "Metre", "Centimetre", "Kilometre"], why: "Kilogram measures mass; the rest measure length." },
      { q: "Find the odd one: 11, 22, 33, 45", o: ["45", "11", "22", "33"], why: "45 is not a multiple of 11." },
      { q: "Find the odd one: ZYX, WVU, TSR, QPN", o: ["QPN", "ZYX", "WVU", "TSR"], why: "QPN moves −1, −2; the others −1, −1." }
    ]
  }
};
