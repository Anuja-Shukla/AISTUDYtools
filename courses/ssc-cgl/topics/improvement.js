/* SSC CGL · English · Sentence improvement. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["improvement"] = {
  id: "improvement", subject: "english", num: 7, title: "Sentence improvement",
  minutes: 30,
  why: "Sentence improvement gives 2–3 Tier 1 marks. One part of a sentence is underlined; choose the option that corrects it, or “No improvement”. It uses the same rules as spot the error, plus clashing word pairs.",
  video: "videos/SSC_E07_Improvement.mp4",
  slides: [
    { h: "How the question works", body: "<p>A part of the sentence is marked. You choose the best replacement, or “No improvement” if it is already correct.</p><p>Here the marked part is shown in <b>“quotes”</b>.</p>" },
    { h: "Clashing pairs", body: "<p>Some words already carry a meaning; do not repeat it.</p><ul><li><b>Unless</b> already means “if not”: <s>Unless you do not work</s> → Unless you work.</li><li><b>Although … but</b>: use only one.</li><li><b>too … to</b> but <b>so … that</b>: <s>too weak that</s> → so weak that.</li><li><b>hardly … when</b>, <b>no sooner … than</b>.</li></ul>",
      ask: { q: "“Although he was ill, but he went to work.” Fix it.", a: "Drop “but”: Although he was ill, he went to work." } },
    { h: "Verb forms", body: "<ul><li>did / does / do + base verb: did not <b>come</b></li><li>Unreal “if”: If I <b>were</b> a bird…</li><li>Past time word: I <b>saw</b> him yesterday.</li><li>since + point, for + period.</li></ul>" },
    { h: "Word patterns", body: "<ul><li>insist <b>on going</b> · prefer A <b>to</b> B · senior <b>to</b></li><li>purpose: <b>to buy</b>, not for buying</li><li>discuss / reach / enter: no preposition</li></ul>" },
    { h: "Agreement and comparison", body: "<ul><li>Each / neither / one of → singular verb and plural noun after “one of”.</li><li>Police, people → plural verb.</li><li>No double comparatives: taller, not more taller.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Read the full sentence; find why the marked part is wrong.</li><li>Put each option back into the sentence and read it again.</li><li>Choose “No improvement” only if the marked part breaks no rule.</li></ul>" }
  ],
  tools: ["impgame", "pairclash", "tensetime"],
  formulas: [["unless", "already means ‘if not’"], ["although / though", "no ‘but’ after it"], ["too … to / so … that", "never ‘too … that’"], ["hardly … when / no sooner … than", "fixed pairs"], ["insist on + -ing", "prefer … to"], ["did + base verb", "did not come"]],
  practice: [
    { q: "He is “senior than” me.", o: ["senior to", "more senior than", "seniors to", "No improvement"], why: "senior to.", hint: "Latin comparatives take ‘to’." },
    { q: "I am going to the market “for buying” vegetables.", o: ["to buy", "for buy", "to buying", "No improvement"], why: "Purpose: to buy.", hint: "Infinitive of purpose." },
    { q: "She “did not came” yesterday.", o: ["did not come", "does not came", "did not comes", "No improvement"], why: "did + base verb.", hint: "After did." },
    { q: "“If I was” a bird, I would fly.", o: ["If I were", "If I am", "If I had", "No improvement"], why: "Unreal condition: were.", hint: "Imaginary situation." },
    { q: "He has been working here “since three years”.", o: ["for three years", "from three years", "since three year", "No improvement"], why: "Period: for.", hint: "since or for?" },
    { q: "Each of the students “have a book”.", o: ["has a book", "have books", "having a book", "No improvement"], why: "Each: singular.", hint: "Subject is ‘each’." },
    { q: "He “insisted to go”.", o: ["insisted on going", "insisted for going", "insisted going", "No improvement"], why: "insist on + -ing.", hint: "Fixed preposition." },
    { q: "“Unless you do not work hard”, you will fail.", o: ["Unless you work hard", "Unless you will work hard", "If you work hard", "No improvement"], why: "Unless already means ‘if not’.", hint: "Double negative." },
    { q: "Hardly had he arrived “than the phone rang”.", o: ["when the phone rang", "then the phone rang", "that the phone rang", "No improvement"], why: "hardly … when.", hint: "Fixed pair." },
    { q: "She “sings very well”.", o: ["No improvement", "sing very well", "sings very good", "is singing very good"], why: "Correct as written.", hint: "Check before changing." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "Neither of the boys “were present”.", o: ["was present", "are present", "were presents", "No improvement"], why: "Neither of: singular." },
      { q: "He prefers coffee “than tea”.", o: ["to tea", "over than tea", "rather tea", "No improvement"], why: "prefer … to." },
      { q: "“One of my friend” is a doctor.", o: ["One of my friends", "One of my friend’s", "One my friend", "No improvement"], why: "One of + plural noun." },
      { q: "She is “more taller than” her sister.", o: ["taller than", "most taller than", "more tall than", "No improvement"], why: "No double comparative." },
      { q: "“I have seen him” yesterday.", o: ["I saw him", "I had seen him", "I see him", "No improvement"], why: "Past time word: simple past." },
      { q: "Although he was ill, “but he went” to work.", o: ["he went", "yet he goes", "and he went", "No improvement"], why: "No ‘but’ after although." },
      { q: "He is “too weak that” he cannot walk.", o: ["so weak that", "very weak that", "too weak to that", "No improvement"], why: "so … that." },
      { q: "The police “has caught” the thief.", o: ["have caught", "has catched", "is caught", "No improvement"], why: "Police: plural." },
      { q: "We “discussed about the plan”.", o: ["discussed the plan", "discussed on the plan", "discussed over the plan", "No improvement"], why: "No preposition after discuss." },
      { q: "The sun “rises in the east”.", o: ["No improvement", "rises from the east", "rose in the east", "is rising from east"], why: "Correct: rises in the east." }
    ]
  }
};
