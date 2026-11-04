/* SSC CGL · Reasoning · Syllogism. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["syllogism"] = {
  id: "syllogism", subject: "reasoning", num: 9, title: "Syllogism",
  minutes: 40,
  why: "Syllogism gives 1–2 Tier 1 marks. You get two statements (assumed true) and two conclusions, and decide which follow. A quick Venn sketch and a few rules settle every question.",
  video: "videos/SSC_R09_Syllogism.mp4",
  slides: [
    { h: "How to read the question", body: "<ul><li>Treat the statements as true, even if they sound silly (“All cats are dogs”).</li><li>A conclusion <b>follows</b> only if it is true in <b>every</b> possible diagram.</li><li>Answers: only I, only II, both, neither, or either I or II.</li></ul>" },
    { h: "Four statement types", body: "<table class=\"pt\"><tr><th>Type</th><th>Diagram</th></tr><tr><td>All A are B</td><td>A inside B</td></tr><tr><td>Some A are B</td><td>A and B overlap</td></tr><tr><td>No A is B</td><td>A and B apart</td></tr><tr><td>Some A are not B</td><td>part of A outside B</td></tr></table>" },
    { h: "Conversions", body: "<ul><li>All A are B → <b>Some B are A</b> (not “All B are A”)</li><li>Some A are B → <b>Some B are A</b></li><li>No A is B → <b>No B is A</b></li><li>Some A are not B → no conversion</li></ul>",
      ask: { q: "“No man is a bird.” What follows?", a: "No bird is a man." } },
    { h: "Combining two statements", body: "<table class=\"pt\"><tr><th>Statement 1</th><th>Statement 2</th><th>Conclusion</th></tr><tr><td>All A–B</td><td>All B–C</td><td>All A are C</td></tr><tr><td>All A–B</td><td>No B–C</td><td>No A is C</td></tr><tr><td>Some A–B</td><td>All B–C</td><td>Some A are C</td></tr><tr><td>Some A–B</td><td>No B–C</td><td>Some A are not C</td></tr><tr><td>No A–B</td><td>All B–C</td><td>Some C are not A</td></tr><tr><td>All / Some</td><td>Some</td><td>no definite link</td></tr></table>" },
    { h: "Worked example", body: "<p>All roses are flowers. No flower is a tree.</p><p>Roses sit inside flowers, and flowers are apart from trees. So <b>No rose is a tree</b> ✓.</p><p>“Some trees are roses” ✗: it is impossible.</p>", viz: { type: "venn", s: [["all", 0, 1], ["no", 1, 2]], n: ["Roses", "Flowers", "Trees"] } },
    { h: "Either I or II", body: "<p>If neither conclusion is definite, but together they cover every case, the answer is <b>either I or II</b>.</p><p>Pairs that cover every case (same two terms):</p><ul><li>Some A are B / No A is B</li><li>All A are B / Some A are not B</li></ul><p>Some boys are tall; some tall are players → some boys are players <i>or</i> no boy is a player.</p>" },
    { h: "Common traps", body: "<ul><li>All A are B does <b>not</b> give All B are A.</li><li>All A are B + Some B are C → nothing definite between A and C.</li><li>Some + Some → nothing definite.</li><li>Do not use real-world knowledge.</li></ul>",
      ask: { q: "All teachers are graduates. Some graduates are doctors. Do some teachers have to be doctors?", a: "No — the doctors may be graduates who are not teachers." } },
    { h: "Exam strategy", body: "<ul><li>Draw the smallest diagram that fits the statements.</li><li>Try to break the conclusion with another diagram; if you can, it does not follow.</li><li>Check conversions of each statement as well.</li><li>Look for an either-or pair only when neither follows.</li></ul>" }
  ],
  tools: ["sylsolve", "sylcheck", "sylgame"],
  formulas: [
    ["All + All", "All A are C"],
    ["All + No", "No A is C"],
    ["Some + All", "Some A are C"],
    ["Some + No", "Some A are not C"],
    ["No + All", "Some C are not A"],
    ["Conversions", "All A–B → Some B–A; Some ↔ Some; No ↔ No"],
    ["Either-or pairs", "Some / No; All / Some not (same terms)"]
  ],
  practice: [
    { q: "Statements: All cats are dogs. All dogs are birds. Conclusions: I. All cats are birds. II. Some birds are cats.", o: ["Both follow", "Only I follows", "Only II follows", "Neither follows"], why: "All + All gives I; II is its conversion.", hint: "Draw nested circles." },
    { q: "Statements: Some pens are books. All books are bags. Conclusions: I. Some pens are bags. II. All bags are pens.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "Some + All gives Some.", hint: "The overlap of pens and books sits inside bags." },
    { q: "Statements: All roses are flowers. No flower is a tree. Conclusions: I. No rose is a tree. II. Some trees are roses.", o: ["Only I follows", "Only II follows", "Both follow", "Either I or II follows"], why: "All + No gives No.", hint: "Roses are inside flowers." },
    { q: "Statements: Some boys are tall. Some tall people are players. Conclusions: I. Some boys are players. II. No boy is a player.", o: ["Either I or II follows", "Only I follows", "Neither follows", "Both follow"], why: "Some + Some gives nothing definite; I and II cover every case.", hint: "Some / No pair." },
    { q: "Statements: No apple is a mango. All mangoes are fruits. Conclusions: I. Some fruits are not apples. II. No fruit is an apple.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "No + All gives Some C are not A.", hint: "The mango part of fruits has no apples." },
    { q: "Statements: All teachers are graduates. Some graduates are doctors. Conclusions: I. Some teachers are doctors. II. Some doctors are graduates.", o: ["Only II follows", "Only I follows", "Both follow", "Either I or II follows"], why: "All + Some gives nothing for I; II is a conversion.", hint: "Convert statement 2." },
    { q: "Statements: All pens are pencils. Some pencils are erasers. Conclusions: I. Some pens are erasers. II. All erasers are pencils.", o: ["Neither follows", "Only I follows", "Only II follows", "Either I or II follows"], why: "All + Some is indefinite; I and II are not an either-or pair.", hint: "Try a diagram that breaks each." },
    { q: "Statements: Some cars are red. No red thing is blue. Conclusions: I. Some cars are not blue. II. All cars are blue.", o: ["Only I follows", "Only II follows", "Either I or II follows", "Neither follows"], why: "Some + No gives Some not.", hint: "The red cars are not blue." },
    { q: "Statement: No man is a bird. Which conclusion follows?", o: ["No bird is a man", "Some birds are men", "All birds are men", "Some men are birds"], why: "No converts to No.", hint: "Conversion." },
    { q: "Statements: All A are B. All B are C. All C are D. Conclusions: I. All A are D. II. Some D are B.", o: ["Both follow", "Only I follows", "Only II follows", "Neither follows"], why: "A ⊂ B ⊂ C ⊂ D, so both are true.", hint: "Nested circles." }
  ],
  test: {
    minutes: 7, right: 2, wrong: 0.5,
    items: [
      { q: "Statements: All chairs are tables. All tables are desks. Conclusions: I. All chairs are desks. II. All desks are chairs.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "All + All; II reverses it wrongly." },
      { q: "Statements: Some fruits are sweet. All sweet things are tasty. Conclusions: I. Some fruits are tasty. II. Some tasty things are fruits.", o: ["Both follow", "Only I follows", "Only II follows", "Neither follows"], why: "Some + All gives I; II converts I." },
      { q: "Statements: All books are pages. No page is a pen. Conclusions: I. No book is a pen. II. No pen is a book.", o: ["Both follow", "Only I follows", "Only II follows", "Either I or II follows"], why: "All + No gives I; II converts I." },
      { q: "Statements: Some doctors are singers. Some singers are dancers. Conclusions: I. Some doctors are dancers. II. No dancer is a doctor.", o: ["Either I or II follows", "Neither follows", "Only I follows", "Both follow"], why: "Indefinite, but I and II cover every case." },
      { q: "Statements: All birds are animals. Some animals are cats. Conclusions: I. Some birds are cats. II. Some cats are animals.", o: ["Only II follows", "Only I follows", "Both follow", "Neither follows"], why: "II converts statement 2." },
      { q: "Statements: No stone is a gem. All gems are costly. Conclusions: I. Some costly things are not stones. II. No costly thing is a stone.", o: ["Only I follows", "Only II follows", "Both follow", "Either I or II follows"], why: "No + All gives Some C are not A." },
      { q: "Statements: All lions are tigers. Some lions are fast. Conclusions: I. Some tigers are fast. II. All fast animals are lions.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "The fast lions are tigers." },
      { q: "Statements: Some pens are blue. All blue things are cheap. Conclusions: I. All pens are cheap. II. Some cheap things are pens.", o: ["Only II follows", "Only I follows", "Both follow", "Neither follows"], why: "Some + All gives Some, not All." },
      { q: "Statement: Some teachers are poets. Which conclusion follows?", o: ["Some poets are teachers", "All poets are teachers", "No poet is a teacher", "All teachers are poets"], why: "Some converts to Some." },
      { q: "Statements: All mangoes are yellow. No yellow thing is sour. Conclusions: I. Some mangoes are sour. II. No mango is sour.", o: ["Only II follows", "Only I follows", "Either I or II follows", "Neither follows"], why: "All + No gives No." }
    ]
  }
};
