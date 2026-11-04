/* SSC CGL · Reasoning · Mirror & water images. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["mirror"] = {
  id: "mirror", subject: "reasoning", num: 12, title: "Mirror & water images",
  minutes: 25,
  why: "Mirror and water images give 1–2 Tier 1 marks: reflected words, letters, numbers, figures and clocks. A mirror flips left and right; water flips top and bottom. Clock questions use one subtraction.",
  video: "videos/SSC_R12_Mirror.mp4",
  slides: [
    { h: "Mirror vs water", body: "<ul><li><b>Mirror image</b> (mirror at the side): left ↔ right. Top stays top.</li><li><b>Water image</b> (water below): top ↔ bottom. Left stays left.</li></ul>", viz: { type: "mirw", w: "RAIN" } },
    { h: "Letters that do not change", body: "<p>In a mirror (vertical line of symmetry):</p><p><b>A H I M O T U V W X Y</b></p><p>In water (horizontal line of symmetry):</p><p><b>B C D E H I K O X</b></p><p>H, I, O and X stay the same in both.</p>" },
    { h: "Words in a mirror", body: "<p>A mirror reverses the order of letters <i>and</i> flips each letter.</p><p>A word looks the same only if it reads the same backwards and uses only mirror-safe letters: <b>MOM</b>, <b>WOW</b>.</p><p>BOB reads the same backwards, but B flips, so it changes.</p>",
      ask: { q: "Which looks the same in a mirror: MOM, DAD, NUN, POP?", a: "MOM — only M and O are mirror-safe." } },
    { h: "Mirror clocks", body: "<p>Mirror time = <b>11:60 − actual time</b> (use 23:60 − time for times after 12).</p><p>3:40 → 11:60 − 3:40 = <b>8:20</b>.</p><p>It works both ways: the mirror of 8:20 is 3:40.</p>", viz: { type: "mclock", h: 3, m: 40 } },
    { h: "Special cases", body: "<ul><li>12:00 and 6:00 look the same in a mirror.</li><li>For times like 12:20, use 12:20 as 0:20: 11:60 − 0:20 = 11:40.</li><li>Times that add up to 11:60 are mirror pairs: 4:25 ↔ 7:35.</li></ul>",
      ask: { q: "A clock in a mirror shows 9:10. What is the real time?", a: "11:60 − 9:10 = 2:50." } },
    { h: "Figures and numbers", body: "<ul><li>In a mirror, a figure’s left part moves to the right. Arrows pointing right now point left.</li><li>Digits 0, 1 and 8 look the same in a mirror.</li><li>Look at one small detail (a dot, a corner) and track where it goes.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Decide: mirror (side) or water (below)?</li><li>For words, reverse the order and flip each letter.</li><li>For clocks, subtract from 11:60.</li><li>For figures, follow one corner or dot.</li></ul>" }
  ],
  tools: ["mclockt", "mword", "mgame"],
  formulas: [
    ["Mirror clock", "11:60 − time"],
    ["Mirror-safe letters", "A H I M O T U V W X Y"],
    ["Water-safe letters", "B C D E H I K O X"],
    ["Mirror", "left ↔ right; order of letters reverses"],
    ["Water", "top ↔ bottom; order stays"]
  ],
  practice: [
    { q: "What does a mirror show when the clock reads 3:40?", o: ["8:20", "9:20", "8:40", "9:40"], why: "11:60 − 3:40.", hint: "Subtract from 11:60." },
    { q: "Mirror image of 10:15 on a clock is:", o: ["1:45", "2:45", "1:15", "2:15"], why: "11:60 − 10:15.", hint: "11:60 − time." },
    { q: "Mirror image of 7:30 is:", o: ["4:30", "5:30", "4:00", "5:00"], why: "11:60 − 7:30.", hint: "11:60 − time." },
    { q: "Which word looks the same in a mirror placed beside it?", o: ["MOM", "DAD", "NUN", "POP"], why: "Palindrome made only of mirror-safe letters.", hint: "D, N and P flip." },
    { q: "Which letter looks the same in a water image?", o: ["B", "A", "M", "T"], why: "B has a horizontal line of symmetry.", hint: "Top ↔ bottom." },
    { q: "Which letter does not change in a mirror?", o: ["A", "B", "C", "D"], why: "A has a vertical line of symmetry.", hint: "Left ↔ right." },
    { q: "Mirror image of 12:20 is:", o: ["11:40", "12:40", "11:20", "12:20"], why: "Treat 12:20 as 0:20; 11:60 − 0:20.", hint: "12 counts as 0." },
    { q: "How many letters of CHOICE look the same in a water image?", o: ["6", "5", "4", "3"], why: "C, H, O, I, C, E are all water-safe.", hint: "B C D E H I K O X." },
    { q: "A clock seen in a mirror shows 9:10. What is the real time?", o: ["2:50", "3:50", "2:10", "3:10"], why: "11:60 − 9:10.", hint: "The rule works both ways." },
    { q: "How many letters of TAXI look the same in a mirror?", o: ["4", "3", "2", "1"], why: "T, A, X and I are all mirror-safe.", hint: "A H I M O T U V W X Y." }
  ],
  test: {
    minutes: 5, right: 2, wrong: 0.5,
    items: [
      { q: "Mirror image of 4:25 is:", o: ["7:35", "8:35", "7:25", "8:25"], why: "11:60 − 4:25." },
      { q: "Mirror image of 6:00 is:", o: ["6:00", "12:00", "3:00", "9:00"], why: "11:60 − 6:00 = 5:60 = 6:00." },
      { q: "A mirror shows 2:15. The real time is:", o: ["9:45", "10:45", "9:15", "10:15"], why: "11:60 − 2:15." },
      { q: "Which word looks the same in a mirror?", o: ["WOW", "NOON", "BOB", "KICK"], why: "Only W and O are mirror-safe and it is a palindrome." },
      { q: "Which letter looks the same in a water image?", o: ["E", "F", "G", "J"], why: "E has a horizontal line of symmetry." },
      { q: "How many letters of HAWK look the same in a mirror?", o: ["3", "4", "2", "1"], why: "H, A, W yes; K no." },
      { q: "Mirror image of 1:50 is:", o: ["10:10", "11:10", "10:50", "11:50"], why: "11:60 − 1:50." },
      { q: "Which digit looks the same in a mirror?", o: ["8", "2", "4", "7"], why: "8 is symmetric left to right." },
      { q: "How many letters of DECODE look the same in a water image?", o: ["6", "4", "5", "3"], why: "D, E, C, O are all water-safe." },
      { q: "Mirror image of 11:05 is:", o: ["12:55", "1:55", "12:05", "11:55"], why: "11:60 − 11:05 = 0:55 → 12:55." }
    ]
  }
};
