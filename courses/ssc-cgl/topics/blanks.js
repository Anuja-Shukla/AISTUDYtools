/* SSC CGL · English · Fill in the blanks. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["blanks"] = {
  id: "blanks", subject: "english", num: 2, title: "Fill in the blanks",
  minutes: 30,
  why: "Fill in the blanks gives 2–3 Tier 1 marks. The blank tests a preposition, an article, a conjunction, a tense or a word that fits the meaning. Read the whole sentence, find the clue word, then test each option.",
  video: "videos/SSC_E02_Blanks.mp4",
  slides: [
    { h: "Find the clue", body: "<p>Every blank has a clue somewhere in the sentence:</p><ul><li>a word that takes a fixed <b>preposition</b> (good <b>at</b>, fond <b>of</b>)</li><li>a <b>time</b> word (since, for, already)</li><li>a <b>contrast</b> or <b>cause</b> word (despite, because)</li><li>a fixed pair (neither … <b>nor</b>, so … <b>that</b>)</li></ul>" },
    { h: "Fixed prepositions", body: "<table class=\"pt\"><tr><td>good at</td><td>fond of</td><td>insist on</td></tr><tr><td>accused of</td><td>interested in</td><td>depend on</td></tr><tr><td>prefer … to</td><td>superior to</td><td>angry with (a person)</td></tr><tr><td>afraid of</td><td>married to</td><td>congratulate on</td></tr></table>",
      ask: { q: "He insisted ___ paying the bill.", a: "on — insist on." } },
    { h: "Articles by sound", body: "<ul><li><b>a</b> + consonant sound: a university, a one-day match, a European</li><li><b>an</b> + vowel sound: an hour, an honest man, an SSC exam (‘es’)</li><li><b>the</b> for something specific or unique: the sun, the Ganga</li></ul>" },
    { h: "Time words", body: "<ul><li><b>since</b> + point of time: since Monday, since 2019</li><li><b>for</b> + period: for ten years</li><li><b>already</b> in positive sentences; <b>yet</b> in questions and negatives</li><li><b>before / after / as soon as</b> link two events</li></ul>" },
    { h: "Pairs and connectors", body: "<ul><li>neither … nor · either … or · not only … but also</li><li>so … that · such … that · hardly … when · no sooner … than</li><li><b>Despite / in spite of</b> + noun; <b>although</b> + clause</li></ul>",
      ask: { q: "She was so tired ___ she slept early.", a: "that — so … that." } },
    { h: "Meaning words", body: "<p>When all options fit the grammar, use the meaning.</p><ul><li>“Despite his hard work, he <b>failed</b>” — despite signals a contrast.</li><li><b>affect</b> (verb) vs <b>effect</b> (noun): “an immediate effect”, “will affect everyone”.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Read the whole sentence before looking at options.</li><li>Find the clue word; test each option in the blank.</li><li>Eliminate options that break grammar first, then decide on meaning.</li></ul>" }
  ],
  tools: ["prepfind", "aanfind", "sincefor"],
  formulas: [
    ["Fixed prepositions", "good at, fond of, insist on, accused of, prefer to"],
    ["a / an", "decided by sound, not spelling"],
    ["since / for", "point of time / period"],
    ["Pairs", "neither…nor, so…that, no sooner…than"],
    ["despite vs although", "despite + noun; although + clause"],
    ["affect / effect", "verb / noun"]
  ],
  practice: [
    { q: "He is good ___ mathematics.", o: ["at", "in", "on", "with"], why: "good at.", hint: "Fixed preposition." },
    { q: "She has been waiting ___ morning.", o: ["since", "for", "from", "by"], why: "Morning is a point of time.", hint: "Point or period?" },
    { q: "I have lived here ___ ten years.", o: ["for", "since", "from", "till"], why: "Ten years is a period.", hint: "Point or period?" },
    { q: "He is ___ honest man.", o: ["an", "a", "the", "no article"], why: "“Honest” starts with a vowel sound (silent h).", hint: "Sound, not spelling." },
    { q: "Neither Ram ___ Shyam came to the party.", o: ["nor", "or", "and", "but"], why: "neither … nor.", hint: "Fixed pair." },
    { q: "The train had left ___ we reached the station.", o: ["before", "after", "until", "since"], why: "Past perfect shows the earlier action: it left before we reached.", hint: "Which happened first?" },
    { q: "She was so tired ___ she slept early.", o: ["that", "than", "then", "as"], why: "so … that.", hint: "Fixed pair." },
    { q: "He insisted ___ paying the bill.", o: ["on", "in", "at", "for"], why: "insist on.", hint: "Fixed preposition." },
    { q: "Despite his hard work, he ___ the exam.", o: ["failed", "passed", "cleared", "topped"], why: "“Despite” signals a contrast with hard work.", hint: "Contrast word." },
    { q: "The medicine had an immediate ___ on the patient.", o: ["effect", "affect", "effort", "affection"], why: "After “an immediate”, a noun is needed: effect.", hint: "Noun or verb?" }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "He was accused ___ theft.", o: ["of", "for", "with", "on"], why: "accused of." },
      { q: "She is fond ___ music.", o: ["of", "for", "with", "in"], why: "fond of." },
      { q: "We will start ___ it stops raining.", o: ["as soon as", "although", "unless", "because"], why: "Time link: as soon as." },
      { q: "He is the ___ of the two brothers.", o: ["elder", "eldest", "older than", "oldest"], why: "Of two people within a family: elder." },
      { q: "I prefer walking ___ driving.", o: ["to", "than", "over", "from"], why: "prefer … to." },
      { q: "He has ___ finished his work.", o: ["already", "yet", "still", "since"], why: "Positive sentence: already." },
      { q: "The thief was caught ___ the police.", o: ["by", "from", "with", "of"], why: "Passive agent: by." },
      { q: "The new rule will ___ all employees.", o: ["affect", "effect", "infect", "effort"], why: "A verb is needed: affect." },
      { q: "She sings ___ than her sister.", o: ["better", "more good", "best", "more better"], why: "Comparative of good/well: better." },
      { q: "He took ___ MBA from Delhi University.", o: ["an", "a", "the", "no article"], why: "M is pronounced ‘em’ — a vowel sound." }
    ]
  }
};
