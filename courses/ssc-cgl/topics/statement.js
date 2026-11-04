/* SSC CGL · Reasoning · Statement & conclusion. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["statement"] = {
  id: "statement", subject: "reasoning", num: 11, title: "Statement & conclusion",
  minutes: 30,
  why: "Statement-based questions (conclusions, assumptions, courses of action) give 1–2 Tier 1 marks. Stay inside the statement: accept only what it says or clearly means, and reject anything extreme or new.",
  video: "videos/SSC_R11_Statement.mp4",
  slides: [
    { h: "Three kinds", body: "<ul><li><b>Conclusion</b>: what must be true if the statement is true?</li><li><b>Assumption</b>: what does the speaker take for granted?</li><li><b>Course of action</b>: what is a sensible step to deal with the problem?</li></ul><p>Answers: only I, only II, both, neither, or either.</p>" },
    { h: "Conclusions: stay inside", body: "<p>“All students who scored above 90% get a scholarship. Riya scored 95%.”</p><ul><li>I. Riya will get a scholarship ✓ (follows directly)</li><li>II. Only Riya will get one ✗ (new claim)</li></ul><p>Do not add outside facts or guesses.</p>" },
    { h: "Watch the strong words", body: "<p>Words like <b>all, only, always, never, must, none</b> make a conclusion extreme. It follows only if the statement is just as strong.</p><p>Soft words like <b>may, some, probably</b> are easier to accept when the statement supports them.</p>",
      ask: { q: "“Most students failed the test.” Does “No student passed” follow?", a: "No — “most” means some passed." } },
    { h: "Assumptions", body: "<p>An assumption is the unstated belief behind the statement.</p><p>“Please use the stairs; the lift is under repair.”</p><ul><li>I. People can use the stairs ✓ (otherwise the advice is pointless)</li><li>II. The lift will never work again ✗</li></ul><p>Test: if the assumption were false, would the statement still make sense?</p>" },
    { h: "Advertisements and notices", body: "<p>Every notice assumes it will be read and that it can have an effect.</p><p>“Buy one, get one free.” → offers attract customers ✓.</p><p>“Keep valuables in the locker.” → guests have valuables ✓ and rooms may not be safe ✓.</p>" },
    { h: "Courses of action", body: "<p>Accept a course of action if it is:</p><ul><li><b>practical</b> (can be done),</li><li><b>helpful</b> (solves or reduces the problem),</li><li><b>not extreme</b> (no shutting down a whole town).</li></ul><p>Water is making people ill → test the supply ✓; make everyone leave ✗.</p>" },
    { h: "Either I or II", body: "<p>If the two conclusions are opposite and together cover every case, the answer is <b>either</b>.</p><p>“Some guests are vegetarians.” I. Some guests are not vegetarians. II. All guests are vegetarians. → <b>either I or II</b>.</p>" },
    { h: "Exam strategy", body: "<ul><li>Read the statement twice; underline its key words.</li><li>Reject anything that needs outside knowledge.</li><li>Reject extreme words unless the statement is just as strong.</li><li>For actions, ask: practical, helpful, not extreme?</li></ul>" }
  ],
  tools: ["strongword", "coacheck", "stmtgame"],
  formulas: [
    ["Conclusion", "must be true from the statement alone"],
    ["Assumption", "taken for granted; the statement fails without it"],
    ["Course of action", "practical + helpful + not extreme"],
    ["Strong words", "all, only, always, never, must, none"],
    ["Either", "two opposite conclusions that cover every case"]
  ],
  practice: [
    { q: "All students who scored above 90% will get a scholarship. Riya scored 95%. I. Riya will get a scholarship. II. Only Riya will get a scholarship.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "I follows directly; II is a new claim.", hint: "Check the word ‘only’." },
    { q: "The government has made helmets compulsory for two-wheeler riders. I. The government wants to improve road safety. II. Helmets will become cheaper.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "I is the clear purpose; II is unrelated.", hint: "Why make such a rule?" },
    { q: "Notice: “Please use the stairs; the lift is under repair.” Assumptions: I. People can use the stairs. II. The lift will never work again.", o: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], why: "‘Under repair’ means it will work again.", hint: "Would the notice make sense without I?" },
    { q: "Advertisement: “Join our coaching for success in SSC CGL.” Assumptions: I. People want success in SSC CGL. II. Everyone who joins will pass.", o: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], why: "The ad needs I; II is too strong.", hint: "Strong word ‘everyone’." },
    { q: "Many people in a town fell ill after drinking tap water. Courses of action: I. Test the water supply at once. II. All residents should leave the town.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "I is practical; II is extreme.", hint: "Practical and not extreme." },
    { q: "The school bell rings at 8 am. Ravi reached school at 8:15 am. I. Ravi was late. II. Ravi missed the first period.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "We do not know when the first period starts or ends.", hint: "Stay inside the statement." },
    { q: "Some of the guests are vegetarians. I. Some guests are not vegetarians. II. All guests are vegetarians.", o: ["Either I or II follows", "Only I follows", "Only II follows", "Neither follows"], why: "Opposite conclusions that cover every case.", hint: "Either-or pair." },
    { q: "A teacher says, “Read this book to improve your English.” Assumptions: I. The book can improve English. II. Students want to improve their English.", o: ["Both are implicit", "Only I is implicit", "Only II is implicit", "Neither is implicit"], why: "The advice needs both.", hint: "Why give the advice?" },
    { q: "Road accidents at a crossing have risen sharply. Courses of action: I. Install traffic lights at the crossing. II. Close the crossing forever.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "II is extreme.", hint: "Not extreme." },
    { q: "No one can enter the hall without a pass. Mohan entered the hall. I. Mohan had a pass. II. Mohan is an official.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "I follows; II is new.", hint: "What does the rule tell us?" }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "All employees must wear ID cards. Seema is an employee. I. Seema must wear an ID card. II. Seema likes ID cards.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "II is about feelings, not in the statement." },
      { q: "A shop notice: “Buy one, get one free.” Assumptions: I. Offers attract customers. II. The shop is closing down.", o: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], why: "II is a guess." },
      { q: "Heavy rain is expected tomorrow. Courses of action: I. Schools may announce a holiday. II. People should carry umbrellas.", o: ["Both follow", "Only I follows", "Only II follows", "Neither follows"], why: "Both are practical and mild." },
      { q: "Only passengers with tickets may board. Anil boarded the train. I. Anil had a ticket. II. Anil travels daily.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "I follows; II is new." },
      { q: "Some fruits in the basket are ripe. I. Some fruits in the basket are not ripe. II. All fruits in the basket are ripe.", o: ["Either I or II follows", "Only I follows", "Both follow", "Neither follows"], why: "Opposite pair covering every case." },
      { q: "A company’s sales fell by 30% this year. Courses of action: I. Study why sales fell. II. Shut the company down at once.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "II is extreme." },
      { q: "Hotel notice: “Keep your valuables in the locker.” Assumptions: I. Guests have valuables. II. Valuables left in rooms may be at risk.", o: ["Both are implicit", "Only I is implicit", "Only II is implicit", "Neither is implicit"], why: "The notice needs both." },
      { q: "Every child in the class has a pencil. Neha is in the class. I. Neha has a pencil. II. Neha has a pen.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "Pens are not mentioned." },
      { q: "“Free medical camp on Sunday for all citizens.” Assumptions: I. People will come to the camp. II. Doctors will be paid double.", o: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], why: "II is unrelated." },
      { q: "Most students failed the maths test. I. The test may have been difficult. II. No student passed.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], why: "‘Most’ means some passed; I is a fair, soft inference." }
    ]
  }
};
