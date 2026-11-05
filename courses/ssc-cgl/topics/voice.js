/* SSC CGL · English · Active & passive voice. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["voice"] = {
  id: "voice", subject: "english", num: 8, title: "Active & passive voice",
  minutes: 30,
  why: "Voice change gives 1–3 marks in Tier 1 and Tier 2. The object becomes the subject, the verb becomes ‘be + past participle’ in the same tense, and the doer moves after ‘by’. Keep the tense exactly the same.",
  video: "videos/SSC_E08_Voice.mp4",
  slides: [
    { h: "The three steps", body: "<ol><li>The <b>object</b> becomes the new subject.</li><li>The verb becomes <b>be (same tense) + past participle</b>.</li><li>The <b>doer</b> goes after <b>by</b> (or is dropped if unknown).</li></ol><p>Ram writes a letter → A letter <b>is written</b> by Ram.</p>" },
    { h: "Tense table", body: "<table class=\"pt\"><tr><th>Tense</th><th>Passive form</th></tr><tr><td>Simple present</td><td>is / am / are + V3</td></tr><tr><td>Present continuous</td><td>is / are being + V3</td></tr><tr><td>Present perfect</td><td>has / have been + V3</td></tr><tr><td>Simple past</td><td>was / were + V3</td></tr><tr><td>Past continuous</td><td>was / were being + V3</td></tr><tr><td>Past perfect</td><td>had been + V3</td></tr><tr><td>Simple future</td><td>will be + V3</td></tr><tr><td>Future perfect</td><td>will have been + V3</td></tr></table>" },
    { h: "Pronoun changes", body: "<table class=\"pt\"><tr><td>I → me</td><td>we → us</td><td>he → him</td></tr><tr><td>she → her</td><td>they → them</td><td>you → you</td></tr></table><p>He will help me → <b>I</b> will be helped by <b>him</b>.</p>",
      ask: { q: "She is cooking dinner. Passive?", a: "Dinner is being cooked by her." } },
    { h: "Commands and questions", body: "<ul><li>Command: Close the door → <b>Let the door be closed</b>.</li><li>Negative command: Do not touch the wire → <b>Let the wire not be touched</b>.</li><li>Yes/no question: Did she write it? → <b>Was it written by her?</b></li><li>Who-question: Who wrote this? → <b>By whom was this written?</b></li></ul>" },
    { h: "Dropping the doer", body: "<p>If the doer is unknown or obvious (someone, people, they in general), drop “by …”.</p><ul><li>Someone has stolen my bag → My bag <b>has been stolen</b>.</li><li>People speak English everywhere → English <b>is spoken</b> everywhere.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Find the tense first; the passive must keep it.</li><li>Check agreement: is / are, was / were match the <b>new</b> subject.</li><li>Use the past participle (V3): written, sung, built, caught.</li><li>Reject options that change the tense.</li></ul>" }
  ],
  tools: ["voicemaker", "voicetable", "voicegame"],
  formulas: [["Rule", "object → subject; be (same tense) + V3; by + doer"], ["Continuous", "being + V3"], ["Perfect", "been + V3"], ["Command", "Let + object + be + V3"], ["Question with who", "By whom … ?"], ["Unknown doer", "drop ‘by …’"]],
  practice: [
    { q: "Change to passive: Ram writes a letter.", o: ["A letter is written by Ram.", "A letter was written by Ram.", "A letter is being written by Ram.", "A letter has been written by Ram."], why: "Simple present: is + V3.", hint: "Keep the tense." },
    { q: "Change to passive: She is cooking dinner.", o: ["Dinner is being cooked by her.", "Dinner is cooked by her.", "Dinner was being cooked by her.", "Dinner has been cooked by her."], why: "Present continuous: is being + V3.", hint: "Continuous → being." },
    { q: "Change to passive: They have finished the work.", o: ["The work has been finished by them.", "The work had been finished by them.", "The work is finished by them.", "The work have been finished by them."], why: "Present perfect: has been + V3.", hint: "Perfect → been." },
    { q: "Change to passive: The teacher punished the boy.", o: ["The boy was punished by the teacher.", "The boy is punished by the teacher.", "The boy had been punished by the teacher.", "The boy was being punished by the teacher."], why: "Simple past: was + V3.", hint: "Simple past." },
    { q: "Change to passive: He will help me.", o: ["I will be helped by him.", "Me will be helped by him.", "I would be helped by him.", "I will help by him."], why: "will be + V3; me → I.", hint: "Pronoun change." },
    { q: "Change to passive: Close the door.", o: ["Let the door be closed.", "The door is closed.", "The door should closed.", "Let close the door."], why: "Command: Let + object + be + V3.", hint: "Command." },
    { q: "Change to passive: Who wrote this book?", o: ["By whom was this book written?", "Who was this book written?", "By whom this book was written?", "Whom wrote this book?"], why: "Who → By whom; question order.", hint: "Who-question." },
    { q: "Change to passive: They were playing cricket.", o: ["Cricket was being played by them.", "Cricket was played by them.", "Cricket is being played by them.", "Cricket were being played by them."], why: "Past continuous: was being + V3.", hint: "Continuous → being." },
    { q: "Change to active: The match was won by India.", o: ["India won the match.", "India wins the match.", "India has won the match.", "India had won the match."], why: "was + V3 → simple past.", hint: "Keep the tense." },
    { q: "Change to passive: Someone has stolen my bag.", o: ["My bag has been stolen.", "My bag has been stolen by someone.", "My bag was stolen.", "My bag is stolen by someone."], why: "Drop the unknown doer.", hint: "Unknown doer." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "Change to passive: The cat killed the rat.", o: ["The rat was killed by the cat.", "The rat is killed by the cat.", "The rat has been killed by the cat.", "The rat killed by the cat."], why: "Simple past." },
      { q: "Change to passive: She sings a song.", o: ["A song is sung by her.", "A song is sang by her.", "A song was sung by her.", "A song is being sung by her."], why: "V3 of sing is sung." },
      { q: "Change to passive: We are watching a film.", o: ["A film is being watched by us.", "A film is watched by us.", "A film was being watched by us.", "A film are being watched by us."], why: "Present continuous." },
      { q: "Change to passive: He had completed the task.", o: ["The task had been completed by him.", "The task has been completed by him.", "The task was completed by him.", "The task had completed by him."], why: "Past perfect: had been + V3." },
      { q: "Change to passive: They will build a bridge.", o: ["A bridge will be built by them.", "A bridge would be built by them.", "A bridge will built by them.", "A bridge will be build by them."], why: "will be + V3 (built)." },
      { q: "Change to passive: Do not touch the wire.", o: ["Let the wire not be touched.", "The wire is not touched.", "Let not touch the wire.", "The wire should not touched."], why: "Negative command." },
      { q: "Change to passive: Did she write the essay?", o: ["Was the essay written by her?", "Did the essay written by her?", "Was the essay wrote by her?", "Is the essay written by her?"], why: "Did → was + V3." },
      { q: "Change to passive: The police caught the thief.", o: ["The thief was caught by the police.", "The thief is caught by the police.", "The thief was catched by the police.", "The thief has been caught by the police."], why: "V3 of catch is caught." },
      { q: "Change to active: The letter was posted by Mohan.", o: ["Mohan posted the letter.", "Mohan posts the letter.", "Mohan has posted the letter.", "Mohan was posting the letter."], why: "Simple past." },
      { q: "Change to passive: People speak English all over the world.", o: ["English is spoken all over the world.", "English is spoken by people all over the world by them.", "English was spoken all over the world.", "English speaks all over the world."], why: "Drop the general doer ‘people’." }
    ]
  }
};
