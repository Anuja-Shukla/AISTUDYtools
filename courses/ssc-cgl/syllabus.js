/* SSC CGL course map. status: "live" = built, "soon" = planned. Original course structure by AIStudyTools; not affiliated with the Staff Selection Commission. */
window.SSC = {
  exam: "SSC CGL",
  updated: "November 2026",
  tier1: {
    rows: [
      ["General Intelligence & Reasoning", 25, 50],
      ["General Awareness", 25, 50],
      ["Quantitative Aptitude", 25, 50],
      ["English Comprehension", 25, 50]
    ],
    time: "60 minutes (80 minutes for scribe-eligible candidates)",
    neg: "0.50 mark deducted for each wrong answer"
  },
  tier2: {
    rows: [
      ["Paper I · Section I", "Mathematical Abilities (30) + Reasoning & General Intelligence (30)", 60, 180, "1 hour"],
      ["Paper I · Section II", "English Language & Comprehension (45) + General Awareness (25)", 70, 210, "1 hour"],
      ["Paper I · Section III", "Computer Knowledge (20)", 20, 60, "15 minutes"],
      ["Paper I · Session II", "Data Entry Speed Test (typing)", "—", "Qualifying", "15 minutes"],
      ["Paper II", "Statistics (only for JSO posts)", 100, 200, "2 hours"],
      ["Paper III", "General Studies: Finance & Economics (only for AAO posts)", 100, 200, "2 hours"]
    ],
    neg: "1 mark per wrong answer in Paper I (Sections I, II and Computer); 0.50 mark in Papers II and III"
  },
  subjects: [
    {
      id: "quant", name: "Quantitative Aptitude", short: "Quant", color: "#4F46E5", soft: "#EEF0FF", t1: 25, t2: 30,
      blurb: "Arithmetic, algebra, geometry, mensuration, trigonometry and data interpretation.",
      units: [
        ["number-system", "Number system", "live"],
        ["simplification", "Simplification & BODMAS", "live"],
        ["percentages", "Percentages", "live"],
        ["ratio", "Ratio & proportion", "live"],
        ["averages", "Averages", "live"],
        ["interest", "Simple & compound interest", "live"],
        ["profit-loss", "Profit, loss & discount", "live"],
        ["partnership", "Partnership", "live"],
        ["mixtures", "Mixtures & alligation", "live"],
        ["time-work", "Time & work, pipes & cisterns", "live"],
        ["tsd", "Time, speed & distance", "live"],
        ["algebra", "Algebra", "live"],
        ["geometry", "Geometry", "live"],
        ["mensuration", "Mensuration", "live"],
        ["trigonometry", "Trigonometry, heights & distances", "live"],
        ["di", "Data interpretation", "live"],
        ["stats-prob", "Statistics & probability (Tier 2)", "soon"]
      ]
    },
    {
      id: "reasoning", name: "General Intelligence & Reasoning", short: "Reasoning", color: "#0F766E", soft: "#CCFBF1", t1: 25, t2: 30,
      blurb: "Verbal and non-verbal reasoning: series, coding, relations, puzzles and figures.",
      units: [
        ["analogy", "Analogy", "soon"], ["classification", "Classification (odd one out)", "soon"],
        ["series", "Number, letter & figure series", "soon"], ["coding", "Coding-decoding", "soon"],
        ["blood-relations", "Blood relations", "soon"], ["direction", "Direction sense", "soon"],
        ["ranking", "Order & ranking", "soon"], ["math-ops", "Mathematical operations", "soon"],
        ["syllogism", "Syllogism", "soon"], ["venn", "Venn diagrams", "soon"],
        ["statement", "Statement & conclusion", "soon"], ["mirror", "Mirror & water images", "soon"],
        ["paper-folding", "Paper folding & cutting", "soon"], ["embedded", "Embedded figures & figure completion", "soon"],
        ["counting", "Counting figures", "soon"], ["puzzles", "Seating & puzzles", "soon"],
        ["esi", "Emotional & social intelligence (Tier 2)", "soon"]
      ]
    },
    {
      id: "english", name: "English Language & Comprehension", short: "English", color: "#B45309", soft: "#FEF3C7", t1: 25, t2: 45,
      blurb: "Grammar, vocabulary, sentence skills and reading comprehension.",
      units: [
        ["error", "Spot the error", "soon"], ["blanks", "Fill in the blanks", "soon"],
        ["syn-ant", "Synonyms & antonyms", "soon"], ["one-word", "One-word substitution", "soon"],
        ["idioms", "Idioms & phrases", "soon"], ["spelling", "Spelling", "soon"],
        ["improvement", "Sentence improvement", "soon"], ["voice", "Active & passive voice", "soon"],
        ["narration", "Direct & indirect speech", "soon"], ["para-jumbles", "Sentence rearrangement", "soon"],
        ["cloze", "Cloze test", "soon"], ["rc", "Reading comprehension", "soon"]
      ]
    },
    {
      id: "ga", name: "General Awareness", short: "GA", color: "#BE185D", soft: "#FCE7F3", t1: 25, t2: 25,
      blurb: "History, polity, geography, economy, science, static GK and current affairs.",
      units: [
        ["history", "History & culture", "soon"], ["polity", "Indian polity", "soon"],
        ["geography", "Geography", "soon"], ["economy", "Indian economy", "soon"],
        ["physics", "Physics", "soon"], ["chemistry", "Chemistry", "soon"], ["biology", "Biology", "soon"],
        ["static-gk", "Static GK: books, days, awards, sports", "soon"], ["schemes", "Government schemes", "soon"],
        ["current", "Current affairs (monthly)", "soon"]
      ]
    },
    {
      id: "computer", name: "Computer Knowledge", short: "Computer", color: "#0369A1", soft: "#E0F2FE", t1: 0, t2: 20,
      blurb: "Tier 2 only: computer basics, MS Office, internet, networking, cyber security and typing.",
      units: [
        ["basics", "Computer basics", "soon"], ["software", "Software & MS Office", "soon"],
        ["internet", "Internet & email", "soon"], ["networking", "Networking & cyber security", "soon"],
        ["typing", "Data entry speed test practice", "soon"]
      ]
    }
  ],
  mocks: [
    ["Topic mini-tests", "10 questions after every topic, timed, with negative marking", "live"],
    ["Sectional tests", "25-question tests for each Tier 1 subject, after the subject is complete", "soon"],
    ["Tier 1 full mocks", "100 questions, 60 minutes, real exam screen", "soon"],
    ["Tier 2 Paper I mocks", "Sections I, II and III with section timers", "soon"]
  ]
};
window.SSC_TOPICS = window.SSC_TOPICS || {};
