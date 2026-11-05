/* SSC CGL · English · Direct & indirect speech. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["narration"] = {
  id: "narration", subject: "english", num: 9, title: "Direct & indirect speech",
  minutes: 30,
  why: "Narration gives 1–3 marks in Tier 1 and Tier 2. When the reporting verb is in the past (said), the tense moves one step back, pronouns change to fit the speaker, and words like now and tomorrow change. Questions and commands get new reporting verbs.",
  video: "videos/SSC_E09_Narration.mp4",
  slides: [
    { h: "Four changes", body: "<ol><li><b>Reporting verb</b>: said → said / told / asked / requested</li><li><b>Tense</b>: one step back (if the reporting verb is past)</li><li><b>Pronouns</b>: match the original speaker and listener</li><li><b>Time and place words</b>: now → then, here → there</li></ol>" },
    { h: "Tense goes one step back", body: "<table class=\"pt\"><tr><th>Direct</th><th>Indirect</th></tr><tr><td>am / is</td><td>was</td></tr><tr><td>are</td><td>were</td></tr><tr><td>simple present (play)</td><td>simple past (played)</td></tr><tr><td>has / have</td><td>had</td></tr><tr><td>simple past (bought)</td><td>past perfect (had bought)</td></tr><tr><td>will / can / may</td><td>would / could / might</td></tr></table>" },
    { h: "Words that change", body: "<table class=\"pt\"><tr><td>now → then</td><td>today → that day</td></tr><tr><td>tomorrow → the next day</td><td>yesterday → the day before</td></tr><tr><td>here → there</td><td>this → that · these → those</td></tr><tr><td>ago → before</td><td>last week → the previous week</td></tr></table>" },
    { h: "Questions", body: "<ul><li>Reporting verb: <b>asked</b>.</li><li>Yes/no question: add <b>if</b> or <b>whether</b>.</li><li>Wh-question: keep the wh-word.</li><li>Use statement word order and no question mark.</li></ul><p>“Where are you going?” → He asked me where <b>I was going</b>.</p>",
      ask: { q: "She said to him, “Are you coming?”", a: "She asked him if he was coming." } },
    { h: "Commands and requests", body: "<ul><li>Command: <b>told / ordered + to</b>: He told me to close the window.</li><li>Negative command: <b>not to</b>: Mother told me not to play in the sun.</li><li>Request (please): <b>requested + to</b>: He requested her to sit down.</li></ul>" },
    { h: "When the tense does not change", body: "<ul><li>Universal truths: “The earth moves round the sun.” → said that the earth <b>moves</b> round the sun.</li><li>Reporting verb in the present: He <b>says</b>, “I am tired.” → He says that he is tired.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Decide the type: statement, question, command, request or exclamation.</li><li>Pick the reporting verb.</li><li>Shift tense, pronouns and time words.</li><li>Check word order in questions.</li></ul>" }
  ],
  tools: ["narrator", "backshift", "timewords"],
  formulas: [["Statement", "said that / told + listener + that"], ["Question", "asked + if/whether or wh-word; statement order"], ["Command", "told / ordered + (not) to"], ["Request", "requested + to"], ["Tense", "one step back if the reporting verb is past"], ["Universal truth", "tense does not change"]],
  practice: [
    { q: "He said, “I am tired.”", o: ["He said that he was tired.", "He said that I was tired.", "He said that he is tired.", "He said that he had tired."], why: "am → was; I → he.", hint: "One step back." },
    { q: "She said, “I will come tomorrow.”", o: ["She said that she would come the next day.", "She said that she will come tomorrow.", "She said that she would come tomorrow.", "She said that she will come the next day."], why: "will → would; tomorrow → the next day.", hint: "Two changes." },
    { q: "Ram said to me, “Where are you going?”", o: ["Ram asked me where I was going.", "Ram asked me where was I going.", "Ram told me where I am going.", "Ram asked me where you were going."], why: "asked; statement order; you → I.", hint: "Question word order." },
    { q: "The teacher said, “The earth moves round the sun.”", o: ["The teacher said that the earth moves round the sun.", "The teacher said that the earth moved round the sun.", "The teacher said that the earth had moved round the sun.", "The teacher told that the earth moves round the sun."], why: "Universal truth: no tense change.", hint: "Is it always true?" },
    { q: "He said to her, “Please sit down.”", o: ["He requested her to sit down.", "He told her that please sit down.", "He ordered her to sit down.", "He requested her that she sit down."], why: "Please → requested + to.", hint: "Request." },
    { q: "She said, “I have finished my work.”", o: ["She said that she had finished her work.", "She said that she has finished her work.", "She said that I had finished my work.", "She said that she finished my work."], why: "have → had; my → her.", hint: "Perfect tense." },
    { q: "Mother said to me, “Do not play in the sun.”", o: ["Mother told me not to play in the sun.", "Mother told me do not play in the sun.", "Mother asked me to not playing in the sun.", "Mother said me not to play in the sun."], why: "Negative command: told + not to.", hint: "Command." },
    { q: "He said, “I bought a car yesterday.”", o: ["He said that he had bought a car the day before.", "He said that he bought a car yesterday.", "He said that he has bought a car the day before.", "He said that he had bought a car yesterday."], why: "Past → past perfect; yesterday → the day before.", hint: "Two changes." },
    { q: "She said to him, “Are you coming?”", o: ["She asked him if he was coming.", "She asked him was he coming.", "She told him if he is coming.", "She asked him that he was coming."], why: "Yes/no question: asked + if.", hint: "if / whether." },
    { q: "He said, “What a beautiful day!”", o: ["He exclaimed that it was a very beautiful day.", "He said what a beautiful day it is.", "He asked what a beautiful day it was.", "He exclaimed that what a beautiful day."], why: "Exclamation: exclaimed that + very.", hint: "Exclamation." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "She said, “I am reading a book.”", o: ["She said that she was reading a book.", "She said that she is reading a book.", "She said that she had read a book.", "She said that I was reading a book."], why: "am reading → was reading." },
      { q: "He said, “I can swim.”", o: ["He said that he could swim.", "He said that he can swim.", "He said that he could swam.", "He said that I could swim."], why: "can → could." },
      { q: "They said, “We are going home now.”", o: ["They said that they were going home then.", "They said that we were going home now.", "They said that they are going home then.", "They said that they were going home now."], why: "are → were; now → then." },
      { q: "He said to me, “Close the window.”", o: ["He told me to close the window.", "He told me close the window.", "He said me to close the window.", "He asked that I close the window."], why: "Command: told + to." },
      { q: "She said to me, “Do you like tea?”", o: ["She asked me if I liked tea.", "She asked me do I like tea.", "She asked me if you liked tea.", "She told me if I liked tea."], why: "asked + if; like → liked; you → I." },
      { q: "He said, “I was ill.”", o: ["He said that he had been ill.", "He said that he was ill.", "He said that he has been ill.", "He said that I had been ill."], why: "was → had been." },
      { q: "The boy said, “I will win.”", o: ["The boy said that he would win.", "The boy said that he will win.", "The boy said that I would win.", "The boy said that he would won."], why: "will → would." },
      { q: "She said, “Two and two make four.”", o: ["She said that two and two make four.", "She said that two and two made four.", "She said that two and two had made four.", "She told that two and two make four."], why: "Universal truth." },
      { q: "He said to me, “Why are you late?”", o: ["He asked me why I was late.", "He asked me why was I late.", "He asked me why you were late.", "He told me why I was late."], why: "Wh-question: statement order." },
      { q: "She said, “This is my house.”", o: ["She said that that was her house.", "She said that this is my house.", "She said that this was her house.", "She said that that is her house."], why: "this → that; is → was; my → her." }
    ]
  }
};
