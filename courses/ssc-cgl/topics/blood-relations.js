/* SSC CGL · Reasoning · Blood relations. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["blood-relations"] = {
  id: "blood-relations", subject: "reasoning", num: 5, title: "Blood relations",
  minutes: 40,
  why: "Blood relations gives 1–2 Tier 1 marks. The questions are chains (‘my father’s sister’s son’), pointing puzzles or coded symbols. Drawing a small family tree solves all three.",
  video: "videos/SSC_R05_Blood_Relations.mp4",
  slides: [
    { h: "Three question types", body: "<ul><li><b>Chains</b>: “A is B’s brother; B is C’s mother”</li><li><b>Pointing</b>: “Pointing to a man, Riya says …”</li><li><b>Coded</b>: “A + B means A is the son of B”</li></ul><p>For each one, draw a family tree. Never solve in your head.</p>" },
    { h: "Draw the tree", body: "<ul><li>Same generation on one row; parents above, children below.</li><li>Mark gender: <b>□ or +</b> male, <b>○ or −</b> female.</li><li>Use = for a married couple and a vertical line for parent → child.</li><li>Mark gender only when the question tells you.</li></ul>", viz: { type: "kin", c: ["father", "sister", "son"] } },
    { h: "Generations decide the name", body: "<table class=\"pt\"><tr><th>Path</th><th>Name</th></tr><tr><td>1 up</td><td>father / mother</td></tr><tr><td>2 up</td><td>grandfather / grandmother</td></tr><tr><td>same row</td><td>brother / sister</td></tr><tr><td>up 2, down 1</td><td>uncle / aunt</td></tr><tr><td>up 1, down 2</td><td>nephew / niece</td></tr><tr><td>up 2, down 2</td><td>cousin</td></tr></table>" },
    { h: "Chains: read from the end", body: "<p>“A is B’s brother. B is C’s mother. How is A related to C?”</p><p>C → mother (B) → her brother (A). So A is C’s <b>maternal uncle</b>.</p>",
      ask: { q: "M is N’s sister. N is O’s father. How is M related to O?", a: "O’s father’s sister → aunt." } },
    { h: "Pointing puzzles", body: "<p>Start from the speaker and break the sentence from “my”.</p><p>Riya: “He is the son of my father’s only son.”</p><ul><li>my father’s only son = Riya’s brother</li><li>his son = Riya’s <b>nephew</b></li></ul><p>“My father’s father’s only son” is your own <b>father</b>.</p>" },
    { h: "In-laws", body: "<ul><li>Son’s wife → daughter-in-law</li><li>Wife’s mother → mother-in-law</li><li>Husband’s sister / brother’s wife → sister-in-law</li></ul>",
      ask: { q: "P is Q’s husband. R is P’s mother. R is Q’s:", a: "Husband’s mother → mother-in-law." } },
    { h: "Coded relations", body: "<p>A + B: A is the son of B. A − B: A is the wife of B.</p><p>P + Q − R → P is the son of Q, and Q is the wife of R. So P is the <b>son</b> of R.</p><p>Decode one symbol at a time and draw as you go.</p>" },
    { h: "Exam strategy", body: "<ul><li>Draw the tree; mark generations and gender.</li><li>“Only son/daughter” often points back to you or your parent.</li><li>If gender is not given, the answer may be “cannot be determined” or “son or daughter”.</li><li>Read the question’s direction: “A is related to C” means A’s relation from C’s side.</li></ul>" }
  ],
  tools: ["relchain", "reltwo", "relgame"],
  formulas: [
    ["One up", "father / mother"],
    ["Same row", "brother / sister"],
    ["Up 2, down 1", "uncle / aunt"],
    ["Up 1, down 2", "nephew / niece"],
    ["Up 2, down 2", "cousin"],
    ["Spouse’s parent", "father-in-law / mother-in-law"]
  ],
  practice: [
    { q: "A is B’s brother. B is C’s mother. How is A related to C?", o: ["Maternal uncle", "Father", "Brother", "Grandfather"], why: "C’s mother’s brother.", hint: "Start from C." },
    { q: "Pointing to a man, Riya says, “He is the son of my father’s only son.” The man is Riya’s:", o: ["Nephew", "Son", "Brother", "Cousin"], why: "Father’s only son = Riya’s brother; his son = nephew.", hint: "Riya is a girl, so the only son is her brother." },
    { q: "X is the wife of Y. Y is the son of Z. How is X related to Z?", o: ["Daughter-in-law", "Daughter", "Sister-in-law", "Wife"], why: "Z’s son’s wife.", hint: "Son’s wife." },
    { q: "A girl says of a boy, “His mother is the only daughter of my mother.” The boy is the girl’s:", o: ["Son", "Brother", "Nephew", "Cousin"], why: "Only daughter of her mother = the girl herself.", hint: "Who is her mother’s only daughter?" },
    { q: "A’s father is B’s son. B is a woman. How is B related to A?", o: ["Grandmother", "Mother", "Aunt", "Sister"], why: "A’s father’s mother.", hint: "Two generations up." },
    { q: "M is N’s sister. N is O’s father. O is P’s brother. How is M related to P?", o: ["Aunt", "Mother", "Sister", "Grandmother"], why: "P’s father is N; N’s sister is P’s aunt.", hint: "O and P are siblings." },
    { q: "A man points to a photo: “He is my father’s father’s only son.” The man in the photo is his:", o: ["Father", "Uncle", "Grandfather", "Brother"], why: "Grandfather’s only son is the speaker’s father.", hint: "Who is your grandfather’s only son?" },
    { q: "A + B means A is the son of B; A − B means A is the wife of B. If P + Q − R, P is R’s:", o: ["Son", "Nephew", "Brother", "Father"], why: "P is Q’s son; Q is R’s wife.", hint: "Decode one symbol at a time." },
    { q: "D is E’s daughter. E is F’s son. How is D related to F?", o: ["Granddaughter", "Daughter", "Niece", "Sister"], why: "F’s son’s daughter.", hint: "Two generations down." },
    { q: "Q’s husband is R’s only brother. R is a woman. How is R related to Q?", o: ["Sister-in-law", "Sister", "Mother-in-law", "Cousin"], why: "Husband’s sister.", hint: "R is the sister of Q’s husband." }
  ],
  test: {
    minutes: 7, right: 2, wrong: 0.5,
    items: [
      { q: "A is the father of B. B is the sister of C. How is C related to A?", o: ["Son or daughter", "Son", "Daughter", "Nephew"], why: "C is A’s child; C’s gender is not given." },
      { q: "Pointing to a girl, Amit said, “She is the daughter of my grandfather’s only son.” She is Amit’s:", o: ["Sister", "Cousin", "Niece", "Daughter"], why: "Grandfather’s only son = Amit’s father; his daughter = Amit’s sister." },
      { q: "P is Q’s husband. R is P’s mother. How is R related to Q?", o: ["Mother-in-law", "Mother", "Aunt", "Sister-in-law"], why: "Husband’s mother." },
      { q: "A × B means A is the brother of B; A ÷ B means A is the mother of B. If X ÷ Y × Z, X is Z’s:", o: ["Mother", "Aunt", "Sister", "Grandmother"], why: "X is Y’s mother; Y is Z’s brother." },
      { q: "S is T’s son. U is T’s father. V is U’s wife. How is S related to V?", o: ["Grandson", "Son", "Nephew", "Great-grandson"], why: "V is T’s mother; S is T’s son." },
      { q: "My father’s sister’s son is my:", o: ["Cousin", "Nephew", "Brother", "Uncle"], why: "Up 2, down 2." },
      { q: "A man says, “This woman is the wife of my father’s only son.” She is his:", o: ["Wife", "Mother", "Sister-in-law", "Sister"], why: "His father’s only son is the man himself." },
      { q: "G is H’s brother. H is I’s daughter. J is I’s husband. How is G related to J?", o: ["Son", "Brother", "Nephew", "Son-in-law"], why: "G is I’s son, and J is I’s husband." },
      { q: "B is the son of A’s only sister. A is a man. How is A related to B?", o: ["Maternal uncle", "Father", "Brother", "Cousin"], why: "B’s mother’s brother." },
      { q: "P is R’s grandfather. Q, R’s mother, is P’s only child. How is Q related to P?", o: ["Daughter", "Daughter-in-law", "Sister", "Niece"], why: "P’s only child is Q, a woman." }
    ]
  }
};
