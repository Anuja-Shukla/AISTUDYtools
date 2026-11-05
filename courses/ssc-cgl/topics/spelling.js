/* SSC CGL · English · Spelling. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["spelling"] = {
  id: "spelling", subject: "english", num: 6, title: "Spelling",
  minutes: 20,
  why: "Spelling questions give 1–2 Tier 1 marks: pick the correctly (or wrongly) spelt word. A few rules and a list of commonly misspelt words cover most questions. Indian exams follow British spelling (colour, travelled).",
  video: "videos/SSC_E06_Spelling.mp4",
  slides: [
    { h: "Double letters people miss", body: "<ul><li>a<b>cc</b>o<b>mm</b>odate · e<b>mb</b>a<b>rr</b>a<b>ss</b> · co<b>mm</b>i<b>tt</b>ee</li><li>o<b>cc</b>u<b>rr</b>ence · reco<b>mm</b>end (one c, two m) · mi<b>ll</b>e<b>nn</b>ium</li><li>ne<b>c</b>e<b>ss</b>ary (one c, two s) · que<b>st</b>io<b>nn</b>aire</li></ul>" },
    { h: "i before e", body: "<p><b>i before e, except after c</b> (when the sound is ‘ee’):</p><ul><li>believe, achieve, piece, field</li><li>receive, ceiling, deceive, conceive</li></ul><p>Exceptions to learn: seize, weird, protein, either, neither, their, foreign.</p>",
      ask: { q: "receive or recieve?", a: "receive — after c, e comes before i." } },
    { h: "Adding endings", body: "<ul><li>Drop a silent <b>e</b> before a vowel ending: hope → hoping; keep it before a consonant: hopeful.</li><li><b>y → i</b> after a consonant: happy → happiness; but play → playing.</li><li>Double the last consonant when the last syllable is stressed and ends consonant-vowel-consonant: run → running, begin → beginning, refer → referred.</li><li>British spelling doubles l: travel → travelled, cancel → cancelled.</li></ul>" },
    { h: "Commonly misspelt words", body: "<table class=\"pt\"><tr><td>separate</td><td>definitely</td><td>privilege</td></tr><tr><td>conscience</td><td>maintenance</td><td>guarantee</td></tr><tr><td>entrepreneur</td><td>rhythm</td><td>bureaucracy</td></tr><tr><td>colleague</td><td>liaison</td><td>mischievous</td></tr><tr><td>pronunciation</td><td>government</td><td>occasion</td></tr></table>" },
    { h: "Memory tricks", body: "<ul><li>sep<b>a</b>rate has <b>a rat</b> in it.</li><li>defin<b>ite</b>ly: think of <b>finite</b>.</li><li>gover<b>n</b>ment: the government <b>govern</b>s.</li><li>pronunciation has no ‘noun’ (pronounce → pronunciation).</li><li>maint<b>e</b>nance: “main ten ance”.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Look at the tricky part first: double letters, ie/ei, -ance/-ence.</li><li>Cover the options and write the word yourself, then compare.</li><li>Read the instruction: correctly or <b>wrongly</b> spelt?</li></ul>" }
  ],
  tools: ["spelldrill", "ierule", "suffixjoin"],
  formulas: [["i before e", "except after c (ee sound); learn seize, weird, either, neither"], ["Silent e", "drop before vowel endings, keep before consonant endings"], ["y → i", "after a consonant: happy → happiness"], ["Doubling", "stressed final CVC: begin → beginning"], ["British spelling", "travelled, colour, centre, programme"]],
  practice: [
    { q: "Choose the correctly spelt word.", o: ["Accommodate", "Acommodate", "Accomodate", "Acomodate"], why: "Double c, double m.", hint: "Two pairs of doubles." },
    { q: "Choose the correctly spelt word.", o: ["Necessary", "Neccessary", "Necesary", "Neccesary"], why: "One c, two s.", hint: "One collar, two sleeves." },
    { q: "Choose the correctly spelt word.", o: ["Separate", "Seperate", "Separete", "Seprate"], why: "There is ‘a rat’ in separate.", hint: "a rat." },
    { q: "Choose the correctly spelt word.", o: ["Receive", "Recieve", "Receeve", "Riceive"], why: "e before i after c.", hint: "i before e except after c." },
    { q: "Choose the correctly spelt word.", o: ["Embarrass", "Embarass", "Embarras", "Embaress"], why: "Double r, double s.", hint: "Two doubles." },
    { q: "Choose the correctly spelt word.", o: ["Definitely", "Definately", "Defenitely", "Definitly"], why: "Think of ‘finite’.", hint: "finite." },
    { q: "Choose the correctly spelt word.", o: ["Government", "Goverment", "Govermant", "Governmant"], why: "The government governs.", hint: "govern + ment." },
    { q: "Choose the correctly spelt word.", o: ["Occurrence", "Occurence", "Ocurrence", "Occurrance"], why: "Double c, double r, -ence.", hint: "occur → occurred." },
    { q: "Choose the wrongly spelt word.", o: ["Begining", "Believe", "Achieve", "Committee"], why: "Beginning has double n.", hint: "Wrongly spelt." },
    { q: "Choose the correctly spelt word.", o: ["Pronunciation", "Pronounciation", "Pronunsiation", "Pronounsation"], why: "No ‘noun’ inside it.", hint: "pronun-." }
  ],
  test: {
    minutes: 4, right: 2, wrong: 0.5,
    items: [
      { q: "Choose the correctly spelt word.", o: ["Committee", "Comittee", "Commitee", "Comitee"], why: "Double m, double t, double e." },
      { q: "Choose the correctly spelt word.", o: ["Privilege", "Priviledge", "Privelege", "Privilage"], why: "No d; -ilege." },
      { q: "Choose the correctly spelt word.", o: ["Maintenance", "Maintainance", "Maintenence", "Mantenance"], why: "main-ten-ance." },
      { q: "Choose the correctly spelt word.", o: ["Guarantee", "Garantee", "Guarentee", "Guaranty"], why: "gua-ran-tee." },
      { q: "Choose the correctly spelt word.", o: ["Rhythm", "Rythm", "Rhythem", "Rhytm"], why: "r-h-y-t-h-m." },
      { q: "Choose the correctly spelt word.", o: ["Entrepreneur", "Entrepeneur", "Enterpreneur", "Entreprenuer"], why: "entre-pre-neur." },
      { q: "Choose the wrongly spelt word.", o: ["Recomend", "Colleague", "Conscience", "Millennium"], why: "Recommend: one c, two m." },
      { q: "Choose the correctly spelt word.", o: ["Questionnaire", "Questionaire", "Questionnare", "Questionair"], why: "Double n." },
      { q: "Choose the correctly spelt word.", o: ["Mischievous", "Mischievious", "Mischevous", "Mischivous"], why: "Three syllables: mis-chie-vous." },
      { q: "Choose the correctly spelt word (British spelling).", o: ["Travelled", "Traveled", "Travveled", "Travelld"], why: "British spelling doubles the l." }
    ]
  }
};
