/* SSC CGL · English · Spot the error. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["error"] = {
  id: "error", subject: "english", num: 1, title: "Spot the error",
  minutes: 35,
  why: "Spot the error gives 2–3 Tier 1 marks. A sentence is split into parts; find the part with the grammar mistake, or choose “No error”. Most errors come from a short list of rules.",
  video: "videos/SSC_E01_Spot_Error.mp4",
  slides: [
    { h: "How the question works", body: "<p>The sentence is split into three parts plus “No error”. Exactly one part is wrong, or none.</p><p>Read the whole sentence first, then check each part against the common rules below.</p>" },
    { h: "Rule 1: subject–verb agreement", body: "<ul><li><b>Each / every / one of</b> + singular verb: “Each of the boys <b>has</b> finished.”</li><li><b>Neither…nor / either…or</b>: verb agrees with the nearer subject: “Neither the teacher nor the students <b>were</b> present.”</li><li><b>As well as / along with / with</b>: verb agrees with the first subject: “Ram as well as his friends <b>was</b> invited.”</li><li>Uncountable nouns (news, furniture, information) take singular verbs.</li></ul>",
      ask: { q: "“The quality of these apples are not good.” Find the error.", a: "“are” → “is”: the subject is “quality”." } },
    { h: "Rule 2: comparison", body: "<ul><li>No double comparatives: <s>more cleverer</s> → cleverer; <s>most tallest</s> → tallest.</li><li><b>Prefer … to</b>, not “than”: “She prefers tea <b>to</b> coffee.”</li><li>Superior, inferior, senior, junior take <b>to</b>.</li></ul>" },
    { h: "Rule 3: tenses", body: "<ul><li>A past time (yesterday, last week) needs the simple past, not the present perfect: “He <b>returned</b> last week.”</li><li>After <b>did / does / do</b>, use the base verb: “did not <b>go</b>”.</li><li><b>Since</b> + a point of time (2019, Monday); <b>for</b> + a period (five years).</li><li>Unreal “if”: “If I <b>were</b> you…”</li></ul>" },
    { h: "Rule 4: articles and prepositions", body: "<ul><li><b>a</b> before a consonant <i>sound</i>: a useful, a university; <b>an</b> before a vowel sound: an hour, an honest man.</li><li>No preposition after <b>discuss, reach, enter, attack</b>: “discussed the problem”.</li><li>“to buy”, not “for buy”, for purpose.</li></ul>" },
    { h: "Rule 5: nouns and pronouns", body: "<ul><li><b>One of</b> + plural noun: “one of my <b>friends</b>”.</li><li>Collective or plural-only nouns: “The children <b>are</b>”, “The police <b>are</b>”.</li><li>Uncountable nouns have no plural: information, advice, furniture, luggage.</li></ul>" },
    { h: "“No error” is a real answer", body: "<p>About one in five questions has no error. Do not force a mistake.</p><p>“Hardly had I reached the station <b>when</b> the train left.” — correct.</p><p>Pairs to remember: hardly/scarcely…when, no sooner…than.</p>" },
    { h: "Exam strategy", body: "<ul><li>Find the subject and its verb first.</li><li>Then check comparison words, time words and articles.</li><li>Read the part that “sounds” odd twice; check it against a rule.</li><li>Choose “No error” only after checking every part.</li></ul>" }
  ],
  tools: ["errgame", "agreeguide", "compgen"],
  formulas: [
    ["Each / every / one of", "singular verb"],
    ["Neither…nor, either…or", "verb agrees with the nearer subject"],
    ["As well as, along with", "verb agrees with the first subject"],
    ["Since / for", "since + point of time; for + period"],
    ["Past time word", "simple past (not present perfect)"],
    ["Comparatives", "no ‘more + -er’; prefer … to"],
    ["No preposition after", "discuss, reach, enter, attack"]
  ],
  practice: [
    { q: "Each of the boys / have finished / the work. / No error", o: ["have finished", "Each of the boys", "the work.", "No error"], why: "“Each” takes a singular verb: has finished.", hint: "Find the subject." },
    { q: "She is / more cleverer / than her sister. / No error", o: ["more cleverer", "She is", "than her sister.", "No error"], why: "Double comparative; say “cleverer”.", hint: "Comparison." },
    { q: "He has been living / in Delhi / since five years. / No error", o: ["since five years.", "He has been living", "in Delhi", "No error"], why: "Use “for” with a period of time.", hint: "Since or for?" },
    { q: "I am going / to the market / for buy vegetables. / No error", o: ["for buy vegetables.", "I am going", "to the market", "No error"], why: "Purpose: “to buy”.", hint: "Infinitive of purpose." },
    { q: "Neither the teacher / nor the students / was present. / No error", o: ["was present.", "Neither the teacher", "nor the students", "No error"], why: "Agrees with the nearer subject (students): were.", hint: "Nearer subject." },
    { q: "She gave / an useful / suggestion. / No error", o: ["an useful", "She gave", "suggestion.", "No error"], why: "“Useful” begins with a ‘yoo’ sound: a useful.", hint: "Sound, not spelling." },
    { q: "The news / are / very good today. / No error", o: ["are", "The news", "very good today.", "No error"], why: "“News” is singular: is.", hint: "Uncountable noun." },
    { q: "He did not / went to school / yesterday. / No error", o: ["went to school", "He did not", "yesterday.", "No error"], why: "After “did”, use the base verb: go.", hint: "did + base verb." },
    { q: "One of my friend / lives / in Mumbai. / No error", o: ["One of my friend", "lives", "in Mumbai.", "No error"], why: "One of + plural noun: friends.", hint: "One of …" },
    { q: "The book is / on the table / in the room. / No error", o: ["No error", "The book is", "on the table", "in the room."], why: "The sentence is correct.", hint: "Check every part before choosing." }
  ],
  test: {
    minutes: 7, right: 2, wrong: 0.5,
    items: [
      { q: "The quality of these apples / are not / good. / No error", o: ["are not", "The quality of these apples", "good.", "No error"], why: "Subject is “quality”: is not." },
      { q: "Ram as well as his friends / were / invited to the party. / No error", o: ["were", "Ram as well as his friends", "invited to the party.", "No error"], why: "Agrees with the first subject: was." },
      { q: "He is the / most tallest / boy in the class. / No error", o: ["most tallest", "He is the", "boy in the class.", "No error"], why: "Double superlative: tallest." },
      { q: "If I was you, / I would / accept the offer. / No error", o: ["If I was you,", "I would", "accept the offer.", "No error"], why: "Unreal condition: If I were you." },
      { q: "She prefers tea / than / coffee. / No error", o: ["than", "She prefers tea", "coffee.", "No error"], why: "Prefer … to." },
      { q: "We discussed about / the problem / for an hour. / No error", o: ["We discussed about", "the problem", "for an hour.", "No error"], why: "No “about” after discuss." },
      { q: "The furniture / in this house / are expensive. / No error", o: ["are expensive.", "The furniture", "in this house", "No error"], why: "Furniture is uncountable: is." },
      { q: "He has returned / from London / last week. / No error", o: ["He has returned", "from London", "last week.", "No error"], why: "Past time word: He returned." },
      { q: "Hardly had I reached / the station / when the train left. / No error", o: ["No error", "Hardly had I reached", "the station", "when the train left."], why: "Correct: hardly … when." },
      { q: "The children / is playing / in the garden. / No error", o: ["is playing", "The children", "in the garden.", "No error"], why: "Children is plural: are playing." }
    ]
  }
};
