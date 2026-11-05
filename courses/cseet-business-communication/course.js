/* AIStudyTools CSEET course app (shared kit). Original teaching material; not affiliated with or endorsed by ICSI. */
(function () {
  "use strict";

  function fmt(x, d) {
    if (typeof x !== "number" || !isFinite(x)) return String(x);
    var p = Math.pow(10, d === undefined ? 2 : d), r = Math.round(x * p) / p;
    if (Object.is(r, -0)) r = 0;
    return String(r);
  }
  function inr(x) { return "₹" + (Math.round(x * 100) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chips(a, cls) {
    return '<div class="chips">' + a.map(function (x, i) {
      var c = typeof cls === "function" ? cls(x, i) : (cls || "");
      return '<span class="chip ' + c + '">' + esc(x) + "</span>";
    }).join("") + "</div>";
  }
  function list(items) { return '<ul class="clean">' + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>"; }
  function box(text, kind) { return '<div class="pbox ' + (kind || "") + '">' + esc(text) + "</div>"; }
  function tbl(head, rows) { return '<div class="tscroll"><table><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }
  function steps(arr) { return '<ol class="steps">' + arr.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>"; }


  /* ================= TOOL HELPERS ================= */
  function ta(id, v, rows, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" rows="' + (rows || 4) + '">' + esc(v || "") + "</textarea></div>"; }
  function inp(id, v, label, ph, mode) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + esc(v === undefined ? "" : v) + '" placeholder="' + esc(ph || "") + '"' + (mode ? ' inputmode="' + mode + '"' : ' inputmode="decimal"') + "></div>"; }
  function sel(id, opts, v, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></div>"; }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ""; }
  function n(id) { var s = val(id).replace(/[,\s₹%]/g, "").replace(/−/g, "-"); return s === "" ? NaN : Number(s); }
  function nums(s) { return String(s).replace(/−/g, "-").split(/[\s,;]+/).filter(Boolean).map(Number); }
  function err(t) { return '<p class="err">' + t + "</p>"; }
  function kv(pairs) { return '<div class="kv">' + pairs.map(function (p) { return "<span>" + p[0] + ": <b>" + p[1] + "</b></span>"; }).join("") + "</div>"; }
  function g2(a, b) { return '<div class="grid g2">' + a + b + "</div>"; }
  function g3(a, b, c) { return '<div class="grid g3">' + a + b + c + "</div>"; }
  function sub(t) { return '<h4 style="margin:14px 0 2px">' + t + "</h4>"; }
  function note(t) { return '<p class="small muted" style="margin-top:6px">' + t + "</p>"; }
  function fin(x) { return typeof x === "number" && isFinite(x); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  function sup(k) { return String(k).split("").map(function (c) { return SUP[c] || c; }).join(""); }
  function svgWrap(w, h, label, inner) { return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(label) + '">' + inner + "</svg>"; }

  /* bar chart (gap = 0 → histogram) */
  function barsSvg(labels, vals, label, opts) {
    opts = opts || {};
    var W = 560, H = 230, L = 40, B = 34, T = 14, R = 10, max = Math.max.apply(null, vals.concat([0])) || 1;
    var bw = (W - L - R) / vals.length, gap = opts.gap === undefined ? 0.18 : opts.gap, s = "";
    for (var k = 0; k <= 4; k++) { var yv = max * k / 4, y = H - B - (H - B - T) * k / 4; s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--border)"/><text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end" class="ax">' + fmt(yv, opts.dp === undefined ? 2 : opts.dp) + "</text>"; }
    vals.forEach(function (v, i) {
      var h = (H - B - T) * v / max, x = L + i * bw + bw * gap / 2, w = bw * (1 - gap);
      s += '<rect x="' + x + '" y="' + (H - B - h) + '" width="' + Math.max(w, 1) + '" height="' + h + '" style="fill:' + (opts.hl === i ? "var(--sun-strong)" : "var(--accent)") + ';stroke:#fff;stroke-width:' + (gap ? 0 : 1) + '"><title>' + esc(labels[i] + ": " + fmt(v, 4)) + "</title></rect>";
      if (vals.length <= 16 || i % Math.ceil(vals.length / 16) === 0) s += '<text x="' + (L + i * bw + bw / 2) + '" y="' + (H - B + 16) + '" text-anchor="middle" class="ax">' + esc(labels[i]) + "</text>";
    });
    return svgWrap(W, H, label, s);
  }

  var TOOLS = {};

  var ICAI_URL = "https://www.icsi.edu/media/webmodules/student/Paper_1_Business_Communication_CSEET_18122025.pdf";
  var CFG = {
    key: "cseet_bc_progress_v1", title: "CSEET: Business Communication", hours: 6, videos: "CSBC_VIDEOS", paper: "Paper 1 (Business Communication)", edition: "restructured CSEET, June 2026 onwards",
    lead: "Grammar, vocabulary, comprehension, communication skills and business writing, with trainers and builders that let you practise every exam task.",
    intro: "For students preparing for Paper 1 of the CS Executive Entrance Test (CSEET) and anyone who wants to write clear, correct business English. The course follows the four units of the restructured CSEET syllabus in eight lessons. Every lesson has notes, a worked example, an interactive trainer or builder and two quick checks, followed by a final test and a certificate.",
    exam: "Paper 1 is a written paper: 100 marks, 3 hours. It mixes one-mark grammar and vocabulary items with explanations and drafting tasks such as letters, memos, notices, reports, e-mails and minutes.",
    testNote: "(the real paper is written; this test checks your grammar, vocabulary and concepts)",
    certPrefix: "CSBC", certSub: "Good English · Communication · Business Correspondence · Business Terminology",
    body: { name: "ICSI", full: "the Institute of Company Secretaries of India (ICSI)", site: "icsi.edu", home: "https://www.icsi.edu/", exam: "CSEET" }
  };

  /* Fictional organisations used: Nimbus Paper Products Ltd, Saffron Foods Pvt Ltd, Lakeview Co-operative Bank, and people Aarav, Meher, Tanvi, Rohan, Farah. */
  var LESSONS = [
    /* ---------------- MODULE 1: ESSENTIALS OF GOOD ENGLISH ---------------- */
    {
      id: "1.1", mod: 1, ch: "Unit 1 (Grammar and usage)", title: "Grammar and Usage", time: "18 min", tool: "cases",
      tcfg: { d: "Choose the correct option for each sentence.", cases: [
        { q: "The board ___ approved the dividend in yesterday's meeting.", o: ["has", "have", "are", "were"], a: 0, e: "'Board' is a collective noun acting as one body, so it takes a singular verb; 'has approved' also fits a recent completed action." },
        { q: "Change to passive voice: 'The auditor checked the accounts.'", o: ["The accounts were checked by the auditor.", "The accounts are checked by the auditor.", "The auditor was checked by the accounts.", "The accounts had checked the auditor."], a: 0, e: "Object becomes subject; past simple 'checked' becomes 'were checked'." },
        { q: "She is ___ honest employee and ___ asset to the firm.", o: ["an … an", "a … an", "an … a", "a … a"], a: 0, e: "Use 'an' before a vowel sound: 'honest' begins with a vowel sound (silent h); 'asset' begins with a vowel." },
        { q: "Neither the manager nor his assistants ___ present.", o: ["were", "was", "is", "has been"], a: 0, e: "With 'neither … nor', the verb agrees with the nearer subject: 'assistants' (plural)." },
        { q: "Pick the correctly punctuated sentence.", o: ["However, the order was delayed.", "However the order, was delayed.", "However; the order was delayed.", "However the order was, delayed."], a: 0, e: "An introductory word like 'However' is followed by a comma." },
        { q: "By the time the courier arrived, we ___ the parcel twice.", o: ["had tracked", "have tracked", "tracked", "will track"], a: 0, e: "Past perfect shows the earlier of two past actions." }] },
      outcomes: ["Identify the eight parts of speech and their roles", "Use tenses, subject–verb agreement and articles correctly", "Convert sentences between active and passive voice", "Punctuate business sentences correctly and use prefixes and suffixes"],
      notes: `<p>Good business writing starts with correct grammar. The <b>parts of speech</b> are: <b>noun</b> (names a person, place, thing or idea: <i>company, Mumbai, profit</i>), <b>pronoun</b> (stands for a noun: <i>it, they, which</i>), <b>verb</b> (action or state: <i>approve, is</i>), <b>adjective</b> (describes a noun: <i>urgent letter</i>), <b>adverb</b> (describes a verb, adjective or another adverb: <i>replied promptly</i>), <b>preposition</b> (shows relation: <i>in, on, under, with</i>), <b>conjunction</b> (joins: <i>and, but, because, although</i>) and <b>interjection</b> (expresses feeling: <i>alas!</i>).</p>
<p style="margin-top:10px"><b>Tenses</b> place actions in time. Each of the past, present and future has four forms: simple, continuous, perfect and perfect continuous (<i>I write, I am writing, I have written, I have been writing</i>). Use the <b>present perfect</b> for past actions with present relevance (<i>We have received your cheque</i>) and the <b>past perfect</b> for the earlier of two past actions. The <b>verb agrees with its subject</b> in number: <i>The list of items <u>is</u> attached</i> (the subject is 'list'). Collective nouns take a singular verb when the group acts as one. With <i>either … or</i> and <i>neither … nor</i>, the verb agrees with the nearer subject.</p>
<p style="margin-top:10px"><b>Articles</b>: <i>a</i> and <i>an</i> are indefinite (use <i>an</i> before a vowel <b>sound</b>: <i>an hour, an MBA, a university</i>); <i>the</i> is definite, used for something specific or already mentioned. <b>Voice</b>: in the <b>active</b> voice the subject acts (<i>The company issued shares</i>); in the <b>passive</b> the subject receives the action (<i>Shares were issued by the company</i>). Business writing prefers the active voice for clarity, but the passive is useful when the doer is unknown or less important.</p>
<p style="margin-top:10px"><b>Prefixes</b> change meaning at the start of a word (<i>un-, dis-, mis-, re-, pre-</i>), and <b>suffixes</b> change the word class at the end (<i>-tion, -ment, -able, -ly</i>). <b>Punctuation</b> controls meaning: a <b>full stop</b> ends a statement; a <b>comma</b> separates items, introductory words and clauses; a <b>semicolon</b> joins two closely related complete sentences; a <b>colon</b> introduces a list or explanation; an <b>apostrophe</b> shows possession (<i>the company's</i>, <i>the directors'</i>) or contraction; and <b>quotation marks</b> enclose direct speech.</p>`,
      formula: "Subject + verb agree in number · 'an' before a vowel sound · active voice for clarity<small>neither/either … nor/or → verb agrees with the nearer subject</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Active to passive</h4>" + tbl(["Tense", "Active", "Passive"], [["Present simple", "The clerk files the returns.", "The returns are filed by the clerk."], ["Past simple", "The CFO signed the cheque.", "The cheque was signed by the CFO."], ["Present perfect", "We have sent the notice.", "The notice has been sent."], ["Future", "The board will declare a dividend.", "A dividend will be declared by the board."], ["Modal", "You must submit the form.", "The form must be submitted."]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Tanvi drafts a note for Nimbus Paper Products Ltd (fictional). Spot and fix the errors.</p>" +
          tbl(["Draft", "Corrected", "Rule"], [["The list of approved vendors are attached.", "The list of approved vendors is attached.", "Verb agrees with 'list'"], ["Please send a updated invoice.", "Please send an updated invoice.", "'an' before a vowel sound"], ["The meeting was cancelled because the directors was travelling.", "… because the directors were travelling.", "Plural subject, plural verb"], ["Its our policy to reply in two days", "It's our policy to reply within two days.", "It's = it is; full stop; 'within' for a deadline"]]);
      },
      use: ["Read each sentence aloud and find its true subject before choosing the verb.", "Prefer the active voice unless the doer is unknown or unimportant.", "Mistake: using 'a' before words like 'hour' or 'MBA'.", "Mistake: writing 'it's' (it is) for the possessive 'its'."],
      walk: function () { return [
        { t: "Eight parts of speech", c: "Every word plays a role.", h: chips(["Noun", "Pronoun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection"], "ac") },
        { t: "Subject–verb agreement", c: "Find the real subject.", h: box("The list of items IS attached.\nNeither he nor his staff ARE late.", "good") },
        { t: "Articles", c: "Sound, not spelling.", h: chips(["an hour", "an MBA", "a university", "a one-day event"], "mi") },
        { t: "Voice", c: "Active is clearer; passive hides the doer.", h: chips(["The CFO signed the cheque.", "The cheque was signed."], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Punctuation", c: "Small marks, big meaning.", h: chips(["comma", "semicolon", "colon", "apostrophe"], "ac") }]; },
      recap: ["Verbs agree with their true subject; collective nouns usually take singular verbs", "Use 'an' before vowel sounds, prefer active voice, and punctuate carefully"],
      qc: [{ q: "Choose the correct sentence.", o: ["Each of the directors has signed.", "Each of the directors have signed.", "Each of the directors are signing.", "Each of the directors were signed."], a: 0, e: "'Each' is singular, so 'has signed'." },
        { q: "'The report was prepared by the team.' This sentence is in the…", o: ["Passive voice", "Active voice", "Future tense", "Imperative mood"], a: 0, e: "The subject (report) receives the action." }]
    },
    {
      id: "1.2", mod: 1, ch: "Unit 1 (Vocabulary)", title: "Vocabulary for Business", time: "16 min", tool: "cases",
      tcfg: { d: "Test your business vocabulary.", cases: [
        { q: "Choose the synonym of 'expedite'.", o: ["Speed up", "Delay", "Explain", "Export"], a: 0, e: "To expedite is to make something happen faster." },
        { q: "Choose the antonym of 'tangible'.", o: ["Intangible", "Visible", "Concrete", "Solid"], a: 0, e: "Tangible means able to be touched; intangible is its opposite." },
        { q: "'To burn the midnight oil' means…", o: ["To work late into the night", "To waste resources", "To start a fire", "To cut costs"], a: 0, e: "An idiom for studying or working late." },
        { q: "One word for 'a person who is unable to pay debts':", o: ["Insolvent", "Solvent", "Creditor", "Auditor"], a: 0, e: "An insolvent cannot pay debts as they fall due." },
        { q: "Choose the correctly spelt word.", o: ["Accommodation", "Acommodation", "Accomodation", "Acomodation"], a: 0, e: "Double 'c' and double 'm'." },
        { q: "'Their / there / they're' — fill in: '___ submitting the bid tomorrow.'", o: ["They're", "Their", "There", "Theyre"], a: 0, e: "They're = they are." },
        { q: "The phrase 'bona fide' means…", o: ["In good faith; genuine", "With full force", "As a whole", "For the time being"], a: 0, e: "A Latin phrase used often in law and business." }] },
      outcomes: ["Choose synonyms and antonyms that fit the context", "Use common idioms, proverbs and one-word substitutes correctly", "Distinguish homophones and spell commonly misspelt words", "Use foreign phrases and abbreviations common in business"],
      notes: `<p>A strong vocabulary makes writing precise. <b>Synonyms</b> are words with similar meanings (<i>commence, begin, start</i>), but they are not always interchangeable: <i>commence</i> suits formal notices, <i>start</i> suits everyday writing. <b>Antonyms</b> are opposites (<i>profit / loss, surplus / deficit, permanent / temporary</i>). Choose the word that fits the context and the register (formal or informal).</p>
<p style="margin-top:10px"><b>Idioms</b> are phrases whose meaning is not literal: <i>to cut corners</i> (to do something cheaply or carelessly), <i>in the red</i> (making a loss), <i>a ballpark figure</i> (a rough estimate), <i>to get the ball rolling</i> (to start). <b>Proverbs</b> express general truths: <i>a stitch in time saves nine; honesty is the best policy</i>. In formal business writing, use idioms sparingly. <b>One-word substitution</b> replaces a phrase with a single word: <i>unanimous</i> (agreed by all), <i>quorum</i> (minimum number needed for a valid meeting), <i>verbatim</i> (word for word), <i>ex officio</i> (by virtue of office), <i>proxy</i> (a person authorised to act or vote for another).</p>
<p style="margin-top:10px"><b>Homophones</b> sound alike but differ in meaning and spelling: <i>principal / principle, stationary / stationery, complement / compliment, affect / effect, council / counsel, their / there / they're</i>. <b>Commonly misspelt words</b> include <i>accommodation, commitment, liaison, receive, separate, occurrence, guarantee, privilege, questionnaire</i>. <b>Foreign words and phrases</b> are common in law and business: <i>ad hoc</i> (for a particular purpose), <i>bona fide</i> (genuine), <i>pro rata</i> (in proportion), <i>status quo</i> (the existing state), <i>inter alia</i> (among other things), <i>prima facie</i> (at first sight), <i>sine die</i> (without fixing a date), <i>per se</i> (by itself). <b>Abbreviations</b>: <i>AGM</i> (annual general meeting), <i>CIN</i> (Corporate Identity Number), <i>DIN</i> (Director Identification Number), <i>e.g.</i> (for example), <i>i.e.</i> (that is), <i>w.e.f.</i> (with effect from), <i>RSVP</i> (please reply).</p>`,
      formula: "Right word + right register + right spelling<small>principal ≠ principle · stationary ≠ stationery · affect (verb) ≠ effect (noun)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Homophones that trip writers</h4>" + tbl(["Pair", "Use"], [["principal / principle", "principal amount; a matter of principle"], ["stationary / stationery", "a stationary car; office stationery"], ["complement / compliment", "the colours complement each other; thank you for the compliment"], ["affect / effect", "delays affect output; the effect of delays"], ["council / counsel", "the city council; legal counsel"], ["loose / lose", "a loose sheet; do not lose the file"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meher edits a circular at Saffron Foods Pvt Ltd (fictional).</p>" +
          tbl(["Draft", "Better"], [["The meeting was adjourned without fixing any date.", "The meeting was adjourned sine die."], ["All members agreed with no one against.", "The resolution was passed unanimously."], ["We will supply office stationary.", "We will supply office stationery."], ["The new policy will effect all staff.", "The new policy will affect all staff."], ["Please reply if you will attend.", "RSVP by 10 March."]]);
      },
      use: ["Check whether a synonym fits the tone of a formal document before using it.", "Keep a personal list of words you misspell and review it before the exam.", "Mistake: using idioms and slang in formal letters.", "Mistake: confusing 'i.e.' (that is) with 'e.g.' (for example)."],
      walk: function () { return [
        { t: "Synonyms and antonyms", c: "Match the meaning and the register.", h: chips(["commence ≈ begin", "surplus ↔ deficit"], "ac") },
        { t: "Idioms", c: "Not literal; use sparingly in formal writing.", h: chips(["in the red", "ballpark figure", "cut corners"], "mi") },
        { t: "One-word substitutes", c: "Precise and concise.", h: chips(["quorum", "proxy", "unanimous", "verbatim"], "ac") },
        { t: "Homophones", c: "Same sound, different word.", h: chips(["stationary / stationery", "principal / principle"], "hl") },
        { t: "Foreign phrases", c: "Common in law and business.", h: chips(["bona fide", "pro rata", "inter alia", "sine die"], "ac") }]; },
      recap: ["Choose words that fit both meaning and register; know idioms, one-word substitutes and foreign phrases", "Watch homophones and commonly misspelt words"],
      qc: [{ q: "'Pro rata' means…", o: ["In proportion", "For the time being", "In good faith", "By itself"], a: 0, e: "E.g. a pro rata allotment of shares." },
        { q: "Choose the correct word: 'Please order more ___ for the office.'", o: ["stationery", "stationary", "stationaries", "stationeries"], a: 0, e: "Stationery = paper, pens and office supplies." }]
    },
    {
      id: "1.3", mod: 1, ch: "Unit 1 (Sentences and comprehension)", title: "Sentence Skills, Comprehension and Summarising", time: "18 min", tool: "jumble",
      tcfg: { d: "Put the sentences in the right order to make a clear paragraph. Click them in order; click 'Check' to see if you are right.", sets: [
        { title: "A complaint e-mail", s: ["We received 200 cartons of printing paper from you on 4 March.", "On opening them, we found that 30 cartons were damp and unusable.", "We have kept the damaged cartons aside for your inspection.", "Please arrange a replacement by 15 March or issue a credit note."] },
        { title: "A notice of a training session", s: ["The company is introducing a new e-filing system from 1 July.", "To help staff use it, a training session will be held on 25 June.", "The session will run from 10 a.m. to 1 p.m. in the conference room.", "All accounts staff must attend and bring their laptops."] },
        { title: "A short report", s: ["This report reviews customer complaints received in the last quarter.", "Complaints rose by 18%, mainly about late deliveries.", "Most delays occurred because one delivery van was out of service.", "We recommend hiring a backup van during peak months."] }] },
      outcomes: ["Correct errors in sentences and complete sentences meaningfully", "Rearrange jumbled sentences into a logical paragraph", "Read a passage closely and answer comprehension questions", "Write a concise summary (précis) of a passage"],
      notes: `<p><b>Sentence correction</b> questions test grammar, word choice and style together. Check, in order: the <b>subject and verb</b> (agreement and tense), <b>pronouns</b> (clear reference: <i>who / whom, I / me</i>), <b>prepositions</b> (<i>comply <u>with</u>, differ <u>from</u>, superior <u>to</u>, agree <u>to</u> a proposal, agree <u>with</u> a person</i>), <b>redundancy</b> (<i>return back, repeat again, revert back</i> are wrong), and <b>parallel structure</b> (<i>She likes drafting, reviewing and filing</i>, not <i>and to file</i>). <b>Sentence completion</b> asks for the word that fits both grammar and logic; read the whole sentence and look for signal words such as <i>although, because, therefore, however</i>.</p>
<p style="margin-top:10px"><b>Sentence arrangement (para jumbles)</b>: find the <b>opening</b> sentence (it introduces the topic and does not depend on anything before it; it rarely starts with <i>this, these, however, therefore</i>). Then link sentences by <b>pronouns</b> (<i>it, they</i> point back), <b>time order</b> (first, then, finally), <b>cause and effect</b>, and <b>general to specific</b>. The last sentence usually concludes or recommends.</p>
<p style="margin-top:10px"><b>Comprehension</b>: read the questions first, then the passage. Answer from the passage, not from your own opinion. Distinguish questions on <b>facts</b> (stated directly), <b>inference</b> (implied), <b>vocabulary in context</b>, and the <b>main idea</b> or a suitable <b>title</b>. <b>Summarising (précis writing)</b>: keep the main ideas, drop examples, repetitions and illustrations, use your own words, write in the third person and past tense for reported matter, and aim for about one-third of the original length. Give it a short title.</p>`,
      formula: "Para jumble: opening (independent) → links (pronouns, time, cause) → conclusion<small>précis ≈ one-third of the original, own words, with a title</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Common errors to fix</h4>" + tbl(["Wrong", "Right", "Why"], [["Please revert back by Friday.", "Please reply by Friday.", "'revert back' is redundant; 'revert' means return to a state"], ["He is senior than me.", "He is senior to me.", "senior/junior/superior/inferior take 'to'"], ["We discussed about the budget.", "We discussed the budget.", "'discuss' takes a direct object"], ["Each of them have a laptop.", "Each of them has a laptop.", "'each' is singular"], ["She is good in drafting.", "She is good at drafting.", "good at a skill"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A 90-word passage summarised in 30 words.</p>" +
          "<div class=\"card\" style=\"padding:14px;margin-bottom:10px\"><b>Original:</b> Many small firms in India still keep their records on paper. This makes it hard for them to track cash, file returns on time and apply for loans, because banks ask for clear financial statements. Moving to simple accounting software can solve these problems. Such software records each sale and purchase once, produces reports in seconds and reminds owners of due dates. The cost is now low, and many providers offer training in local languages, so even a shop with one employee can make the switch.</div>" +
          "<div class=\"card\" style=\"padding:14px\"><b>Summary — Going digital:</b> Paper records make it hard for small firms to manage cash, meet deadlines and obtain loans. Low-cost accounting software, with local-language training, records transactions once and produces reports quickly.</div>";
      },
      use: ["For jumbles, find the one sentence that can stand alone at the start.", "In comprehension, underline the line that supports each answer.", "Mistake: adding your own opinion to a summary.", "Mistake: copying whole sentences from the passage into a précis."],
      walk: function () { return [
        { t: "Correct the sentence", c: "Subject, verb, pronoun, preposition, redundancy.", h: chips(["revert back ✗", "senior to ✓", "discuss (no 'about') ✓"], function (x, i) { return i ? "mi" : "hl"; }) },
        { t: "Para jumbles", c: "Find the opener, then follow the links.", h: box("Opener → pronoun links → time order → conclusion", "good") },
        { t: "Comprehension", c: "Answer from the passage.", h: chips(["Fact", "Inference", "Vocabulary", "Main idea"], "ac") },
        { t: "Précis", c: "One-third the length, own words, a title.", h: chips(["Keep main ideas", "Drop examples"], "mi") }]; },
      recap: ["Correct sentences by checking agreement, pronouns, prepositions, redundancy and parallelism", "Order jumbles from an independent opener; summarise in your own words at about one-third length"],
      qc: [{ q: "Which sentence is correct?", o: ["Please reply by Monday.", "Please revert back by Monday.", "Please reply back by Monday.", "Please revert back us by Monday."], a: 0, e: "'Revert back' and 'reply back' are redundant." },
        { q: "A good précis is usually about…", o: ["One-third of the original length", "Twice the original length", "The same length", "One-tenth of the length"], a: 0, e: "It keeps the essentials only." }]
    },

    /* ---------------- MODULE 2: COMMUNICATION ---------------- */
    {
      id: "2.1", mod: 2, ch: "Unit 2 (Process, modes and listening)", title: "The Communication Process", time: "17 min", tool: "sort",
      tcfg: { d: "Which barrier to communication does each situation show?", buckets: ["Physical", "Semantic", "Psychological", "Organisational", "Cultural"], items: [
        ["Constant drilling noise outside makes the phone call unclear", "Physical", "Noise and distance are physical barriers."],
        ["The finance team uses 'EBITDA' with new sales trainees who do not know it", "Semantic", "Jargon the receiver does not understand is a semantic barrier."],
        ["An employee ignores feedback because he is upset about his appraisal", "Psychological", "Emotions and attitudes block the message."],
        ["A memo passes through five levels of hierarchy and arrives a week late", "Organisational", "Long chains of command distort and delay messages."],
        ["A thumbs-up gesture is taken as rude by a visiting client", "Cultural", "Gestures carry different meanings across cultures."],
        ["The video call keeps freezing because of a weak internet connection", "Physical", "Technical faults in the channel are physical barriers."],
        ["A manager says 'ASAP' and the team reads it as 'this week', not 'today'", "Semantic", "Vague or ambiguous words cause semantic barriers."]] },
      outcomes: ["Explain the process of communication and its elements", "Compare written, oral, visual and digital modes", "Identify communication networks and barriers", "Explain active listening and how to overcome barriers"],
      notes: `<p><b>Communication</b> is the process of sharing information, ideas and feelings so that they are understood. The <b>process</b> has these elements: the <b>sender</b> has an idea and <b>encodes</b> it into a <b>message</b> (words, numbers, images), sends it through a <b>channel</b> (letter, e-mail, phone, meeting), the <b>receiver</b> <b>decodes</b> it, and sends <b>feedback</b>. Anything that distorts the message along the way is <b>noise</b>. Communication is complete only when the message is understood as intended.</p>
<p style="margin-top:10px"><b>Modes</b>: <b>written</b> (letters, reports, e-mails: a permanent record, can be checked, but slower), <b>oral</b> (meetings, phone calls: fast, allows immediate feedback, but no record), <b>visual</b> (charts, graphs, signs: quick to grasp), and <b>non-verbal</b> (body language, tone, gestures). <b>Digital media</b> such as e-mail, SMS, messaging apps and video conferencing combine speed with records, but bring risks of informality and information overload. Communication may be <b>formal</b> (through official channels) or <b>informal</b> (the 'grapevine'), and it may flow <b>downward</b>, <b>upward</b>, <b>horizontal</b> (between peers) or <b>diagonal</b> (across departments and levels).</p>
<p style="margin-top:10px"><b>Communication networks</b> describe who talks to whom: the <b>chain</b> (messages pass along a line), the <b>wheel</b> (everyone communicates through a central person), the <b>circle</b> (each person talks to two neighbours), and the <b>all-channel</b> or star network (everyone talks to everyone). Centralised networks are fast for simple tasks; all-channel networks suit complex problem-solving.</p>
<p style="margin-top:10px"><b>Barriers</b>: <b>physical</b> (noise, distance, faulty equipment), <b>semantic</b> (jargon, ambiguous words, poor translation), <b>psychological</b> (emotions, prejudice, poor attention, distrust), <b>organisational</b> (rigid hierarchy, too many levels, unclear policies) and <b>cultural</b> (different customs, gestures, values). <b>Listening</b> is not the same as hearing. <b>Active listening</b> means paying full attention, not interrupting, asking questions, paraphrasing to check understanding, and responding. Barriers to listening include distractions, prejudice, daydreaming and planning your reply while the other person speaks.</p>`,
      formula: "Sender → encode → message → channel → decode → receiver → feedback<small>noise can enter at any stage</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Choosing a mode</h4>" + tbl(["Situation", "Best mode", "Why"], [["Confirming a contract's terms", "Written (letter or e-mail)", "Permanent record"], ["A sensitive performance issue", "Oral, face to face", "Tone and immediate feedback"], ["Sales trend over five years", "Visual (chart)", "Quick to grasp"], ["Urgent change of meeting time", "Phone or message, then e-mail", "Speed plus record"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Rohan, a manager at Nimbus Paper Products, tells his team on a call: 'Close the books ASAP.' Two people finish that day, three the next week.</p>" +
          tbl(["Element", "What went wrong", "Fix"], [["Encoding", "'ASAP' is vague", "Give a date and time: 'by 5 p.m. on 31 March'"], ["Channel", "Oral only, no record", "Follow up by e-mail"], ["Feedback", "No one confirmed", "Ask each person to confirm the deadline"], ["Noise", "Poor call quality", "Use a stable line or repeat key points"]]);
      },
      use: ["Choose the channel by urgency, need for a record and sensitivity.", "Close the loop: always seek feedback on important messages.", "Mistake: assuming a message sent is a message understood.", "Mistake: confusing hearing with active listening."],
      walk: function () { return [
        { t: "The process", c: "From idea to feedback.", h: box("Sender → encode → message → channel\n→ decode → receiver → feedback", "good") },
        { t: "Modes", c: "Written, oral, visual, non-verbal, digital.", h: chips(["Written", "Oral", "Visual", "Non-verbal", "Digital"], "ac") },
        { t: "Directions", c: "How messages flow.", h: chips(["Downward", "Upward", "Horizontal", "Diagonal", "Grapevine"], "mi") },
        { t: "Networks", c: "Who talks to whom.", h: chips(["Chain", "Wheel", "Circle", "All-channel"], "ac") },
        { t: "Barriers", c: "Five kinds.", h: chips(["Physical", "Semantic", "Psychological", "Organisational", "Cultural"], "hl") }]; },
      recap: ["Communication is complete only when the receiver understands and gives feedback", "Know the modes, flows, networks and the five kinds of barriers"],
      qc: [{ q: "Using technical jargon with people who do not understand it is a…", o: ["Semantic barrier", "Physical barrier", "Organisational barrier", "Cultural barrier"], a: 0, e: "It concerns the meaning of words." },
        { q: "In a wheel network, communication flows…", o: ["Through one central person", "Along a line", "Between neighbours only", "Freely among everyone"], a: 0, e: "The central person links all others." }]
    },
    {
      id: "2.2", mod: 2, ch: "Unit 2 (Etiquette, PR, digital and legal aspects)", title: "Etiquette, Public Relations and Digital Communication", time: "18 min", tool: "cases",
      tcfg: { d: "What is the best practice in each situation?", cases: [
        { q: "You join a video meeting with clients five minutes late. You should…", o: ["Join on mute, apologise briefly at a suitable moment, and follow on", "Interrupt at once to explain why you were late", "Keep your camera off and say nothing", "Leave and rejoin later"], a: 0, e: "Minimise disruption; a short apology at the right moment is courteous." },
        { q: "A customer posts an angry complaint on your company's social media page. The first step is to…", o: ["Reply politely in public, then move the details to a private channel", "Delete the post", "Argue the facts in the comments", "Ignore it"], a: 0, e: "Acknowledge publicly and resolve privately; deleting or arguing harms reputation." },
        { q: "You want to forward a client's e-mail containing personal data to a vendor. You should…", o: ["Check that sharing is necessary and permitted, and remove unnecessary personal data", "Forward it as it is", "Post it on the team group", "Print it and leave it on the desk"], a: 0, e: "Data privacy law and company policy require care with personal data." },
        { q: "A colleague asks you to write a post saying a competitor's products are 'unsafe', without evidence. This risks…", o: ["Defamation", "Plagiarism", "Breach of contract", "Copyright infringement"], a: 0, e: "A false statement that harms reputation can be defamatory." },
        { q: "Which is the main aim of public relations?", o: ["Building goodwill and trust with the public and stakeholders", "Selling a product at a discount", "Recruiting staff", "Preparing accounts"], a: 0, e: "PR manages reputation; advertising sells products." },
        { q: "You use an AI chatbot to draft a reply to a customer. You should…", o: ["Check facts, tone and confidentiality before sending", "Send whatever it writes", "Paste confidential contract terms into a public tool", "Sign it as the chatbot"], a: 0, e: "You remain responsible for accuracy and confidentiality." }] },
      outcomes: ["Practise social, meeting, telephone, dining and introduction etiquette", "Explain public relations, advertising and the role of social media", "Communicate across cultures", "Recognise legal aspects (data privacy, disclaimers, defamation) and use technology, including AI, responsibly"],
      notes: `<p><b>Etiquette</b> is the code of polite behaviour at work. <b>Meeting etiquette</b>: arrive on time, prepare, keep phones silent, let others finish, stick to the agenda. <b>Telephone etiquette</b>: greet and identify yourself, speak clearly, take notes, confirm action points, and end politely. <b>Introductions</b>: introduce a junior person to a senior person, use full names and roles. <b>Dining etiquette</b>: wait for the host, keep conversation light, and avoid business papers at the table unless invited. <b>Workplace courtesy</b> includes greeting colleagues, saying please and thank you, respecting hierarchy while staying approachable, and dressing in <b>business attire</b> suited to the setting. For <b>virtual meetings</b>: test your connection, use a neutral background, mute when not speaking, and look at the camera.</p>
<p style="margin-top:10px"><b>Public relations (PR)</b> is the planned effort to build and keep goodwill and mutual understanding between an organisation and its publics (customers, investors, employees, government, media). Tools include press releases, events, sponsorships, annual reports and crisis communication. <b>Advertising</b> is paid, non-personal promotion of a product or idea through media; it must be truthful and comply with advertising codes. <b>Social media</b> lets firms talk directly to customers, but posts are public and permanent, so firms need clear social media policies and quick, polite responses to complaints.</p>
<p style="margin-top:10px"><b>Intercultural communication</b> requires sensitivity to differences in language, gestures, time, greetings, food and hierarchy. Avoid slang and idioms, speak clearly, and do not assume your norms are universal. <b>Legal aspects</b>: personal data must be handled under data protection law and company policy (collect only what is needed, use it for the stated purpose, protect it); <b>disclaimers</b> on e-mails and websites limit liability; <b>defamation</b> is a false statement that harms someone's reputation, in writing (libel) or speech (slander). <b>Technology</b>: blogs, chatbots and AI tools can speed up writing and customer service, but humans must check accuracy, tone, bias and confidentiality before anything is sent.</p>`,
      formula: "Etiquette = respect + preparation · PR = goodwill, advertising = paid promotion<small>check facts, tone and confidentiality before anything AI-drafted goes out</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">PR vs advertising</h4>" + tbl(["Basis", "Public relations", "Advertising"], [["Aim", "Goodwill and reputation", "Sell products or ideas"], ["Cost", "Mostly unpaid media coverage", "Paid media space"], ["Control", "Less control over message", "Full control"], ["Credibility", "Higher (third-party)", "Lower (seen as promotion)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A delivery from Saffron Foods (fictional) arrives late and a customer complains on social media.</p>" +
          steps(["Respond within hours in public: 'We are sorry your order arrived late. We've sent you a direct message to fix this.'", "Move to a private channel to collect order details; do not post personal data publicly.", "Resolve: refund the delivery charge or send a voucher; explain what went wrong without blaming staff publicly.", "Follow up: thank the customer and record the issue to prevent repeats."]);
      },
      use: ["Treat every e-mail and post as permanent and public.", "In cross-cultural settings, avoid slang and confirm understanding.", "Mistake: arguing with customers in public comments.", "Mistake: pasting confidential data into public AI tools."],
      walk: function () { return [
        { t: "Workplace etiquette", c: "Respect and preparation.", h: chips(["Meetings", "Telephone", "Introductions", "Dining", "Virtual"], "ac") },
        { t: "PR vs advertising", c: "Goodwill vs paid promotion.", h: chips(["PR: earned trust", "Ads: paid space"], "mi") },
        { t: "Social media", c: "Public and permanent.", h: box("Acknowledge publicly →\nresolve privately", "good") },
        { t: "Legal care", c: "Privacy, disclaimers, defamation.", h: chips(["Data privacy", "Disclaimer", "Libel / slander"], "hl") },
        { t: "AI tools", c: "Helpful, but you are responsible.", h: chips(["Check facts", "Check tone", "Protect data"], "ac") }]; },
      recap: ["Follow etiquette in meetings, calls, introductions and virtual settings; PR builds goodwill", "Handle personal data carefully, avoid defamation, and check AI-drafted content before sending"],
      qc: [{ q: "A false written statement that harms someone's reputation is…", o: ["Libel", "Slander", "A disclaimer", "Advertising"], a: 0, e: "Slander is spoken." },
        { q: "When introducing people, you usually introduce…", o: ["The junior person to the senior person", "The senior person to the junior person", "Only the guest", "No one formally"], a: 0, e: "Present the junior to the senior: 'Ms Rao, this is Rohan, our new analyst.'" }]
    },

    /* ---------------- MODULE 3: BUSINESS CORRESPONDENCE ---------------- */
    {
      id: "3.1", mod: 3, ch: "Unit 3 (Letters, messages and e-mail)", title: "Business Letters and E-mails", time: "20 min", tool: "letter",
      outcomes: ["Lay out a business letter with all its parts", "Choose the right structure for positive, negative and persuasive messages", "Write enquiry, order, complaint and adjustment letters", "Write formal e-mails with correct etiquette"],
      notes: `<p>A <b>business letter</b> has these parts, in order: the <b>letterhead</b> (name, address, contact details, CIN for a company), <b>reference number</b> and <b>date</b>, the <b>inside address</b> (receiver's name, designation, organisation and address), an optional <b>attention line</b>, the <b>salutation</b> (<i>Dear Sir/Madam</i>, or <i>Dear Ms Rao</i>), the <b>subject line</b>, the <b>body</b> (opening, details, closing), the <b>complimentary close</b> (<i>Yours faithfully</i> after Sir/Madam; <i>Yours sincerely</i> after a name), the <b>signature block</b> (signature, name, designation), and <b>enclosures</b> and <b>copy to</b> lines if needed. The <b>full block</b> layout, with everything aligned to the left, is the most common today.</p>
<p style="margin-top:10px">Letters follow the <b>7 Cs</b>: clear, concise, concrete, correct, coherent, complete and courteous. Use a structure that fits the message. <b>Positive or neutral messages</b> (orders, acceptances, good news) use the <b>direct</b> approach: main point first, details next, a friendly close. <b>Negative messages</b> (refusals, bad news) use the <b>indirect</b> approach: a neutral 'buffer', the reasons, the bad news stated clearly but kindly, an alternative if possible, and a goodwill close. <b>Persuasive messages</b> (sales letters, requests) follow <b>AIDA</b>: attract Attention, build Interest, create Desire, and ask for Action.</p>
<p style="margin-top:10px">Common types: <b>enquiry</b> (ask for information, prices, terms), <b>quotation</b> (reply with prices and terms), <b>order</b> (exact items, quantities, prices, delivery, payment), <b>complaint</b> (facts, effect, what you want), <b>adjustment</b> (reply to a complaint, admit or explain, and state the remedy), <b>collection</b> (polite reminders becoming firmer), and letters to banks, government departments and regulators.</p>
<p style="margin-top:10px"><b>E-mail</b> is now the main channel. Write a <b>specific subject line</b>, use a proper greeting and close, keep one topic per e-mail, put the request in the first lines, use short paragraphs and bullet points, and add a professional <b>signature</b>. Use <b>Cc</b> for people who need to know and <b>Bcc</b> to protect a large list of addresses. Avoid capital letters (read as shouting), slang, emojis in formal mail, and 'reply all' unless everyone needs the reply. Check attachments and re-read before sending.</p>`,
      formula: "Letterhead · ref & date · inside address · salutation · subject · body · close · signature · enclosures<small>direct for good news · indirect for bad news · AIDA to persuade</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Salutation and close must match</h4>" + tbl(["Salutation", "Complimentary close"], [["Dear Sir / Dear Madam / Dear Sir or Madam", "Yours faithfully"], ["Dear Ms Rao / Dear Mr Khan", "Yours sincerely"], ["Dear Farah (known contact)", "Best regards / Kind regards"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A letter of complaint (full block layout), from a fictional company.</p>" +
          "<div class=\"card\" style=\"padding:16px;font-size:15px;line-height:1.55\"><b>Nimbus Paper Products Ltd</b><br>14 Industrial Estate, Pune 411 019 · CIN: (company's CIN)<br><br>Ref: NPP/PUR/112 · 6 March 2027<br><br>The Sales Manager<br>Brightline Packaging Co.<br>22 MIDC Road, Nashik 422 010<br><br>Dear Sir or Madam,<br><br><b>Subject: Damaged cartons in our order no. 4471</b><br><br>We received 200 cartons against our order no. 4471 on 4 March 2027. On inspection, 30 cartons were found damp and unusable.<br><br>As this stock was meant for a customer order due on 18 March, we request you to replace the damaged cartons by 15 March 2027, or issue a credit note for ₹27,000.<br><br>We have kept the cartons aside for your representative to inspect. We value our association and look forward to your early response.<br><br>Yours faithfully,<br>For Nimbus Paper Products Ltd<br><br>(Signature)<br>Aarav Mehta, Purchase Manager<br>Encl.: Photographs of damaged cartons; delivery challan</div>";
      },
      use: ["Decide first: is the news good (direct) or bad (indirect), or do I need to persuade (AIDA)?", "Make the subject line say exactly what the letter is about.", "Mistake: 'Dear Sir' with 'Yours sincerely'.", "Mistake: vague requests with no date or amount."],
      walk: function () { return [
        { t: "Parts of a letter", c: "In order, top to bottom.", h: chips(["Letterhead", "Ref & date", "Inside address", "Salutation", "Subject", "Body", "Close", "Signature", "Encl."], "ac") },
        { t: "The 7 Cs", c: "Every message.", h: chips(["Clear", "Concise", "Concrete", "Correct", "Coherent", "Complete", "Courteous"], "mi") },
        { t: "Pick the structure", c: "Good news, bad news, persuasion.", h: box("Good news: direct\nBad news: buffer → reasons → news → goodwill\nPersuade: AIDA", "good") },
        { t: "E-mail", c: "Subject, first lines, one topic.", h: chips(["Clear subject", "Cc / Bcc", "No ALL CAPS", "Check attachments"], "ac") }]; },
      recap: ["A business letter has fixed parts; match the salutation with the close", "Use direct, indirect or AIDA structure as the message requires; write e-mails with clear subjects and one topic"],
      qc: [{ q: "A letter that begins 'Dear Sir or Madam' should end with…", o: ["Yours faithfully", "Yours sincerely", "Cheers", "Lovingly"], a: 0, e: "'Yours sincerely' follows a named salutation." },
        { q: "AIDA is used mainly for…", o: ["Persuasive messages", "Bad-news messages", "Minutes", "Circulars"], a: 0, e: "Attention, Interest, Desire, Action." }]
    },
    {
      id: "3.2", mod: 3, ch: "Unit 3 (Reports, circulars, notices, agenda and minutes)", title: "Reports, Notices, Agenda and Minutes", time: "20 min", tool: "minutes",
      outcomes: ["Write short business reports with a clear structure", "Draft office orders, circulars, memoranda and office notes", "Explain MIS and e-correspondence", "Draft notices, agendas, minutes and action taken reports for meetings"],
      notes: `<p>A <b>business report</b> presents facts and analysis for a decision. A short report has: a <b>title</b>, <b>to / from / date</b>, <b>terms of reference</b> (what was asked), <b>procedure</b> (how information was gathered), <b>findings</b> (facts, often numbered), <b>conclusions</b>, <b>recommendations</b>, and a signature. Write objectively, in the third person, with headings and numbered points.</p>
<p style="margin-top:10px"><b>Internal correspondence</b>: an <b>office order</b> is an instruction from management that staff must follow (transfers, duties, rules); a <b>circular</b> conveys the same information to many people at once (holiday lists, policy changes); a <b>memorandum (memo)</b> is a short internal message between departments or individuals; an <b>office note</b> records a matter for a decision, usually moving up the hierarchy. <b>MIS (management information system)</b> reports give managers regular, summarised information (sales, cash, attendance) for control and decisions. The <b>intranet</b> and <b>e-correspondence</b> carry most of these today.</p>
<p style="margin-top:10px"><b>Meetings</b>: a <b>notice</b> tells members the date, time, place (or video link) and purpose of a meeting, and is sent within the required time (for a board meeting of a company, at least seven days' notice is the general rule under the Companies Act, 2013). The <b>agenda</b> lists the items to be discussed, in order: confirmation of the previous minutes, matters arising, specific business, any other business with the chair's permission, and the date of the next meeting. <b>Minutes</b> are the official record of what was decided. They state the meeting's number, type, date, time and place; who was present and in the chair; the <b>quorum</b>; and, for each item, a brief summary and the <b>resolution</b> passed. Minutes are written in the <b>past tense</b> and <b>third person</b>, and are signed by the chair. An <b>action taken report (ATR)</b> tracks what has been done on each decision before the next meeting.</p>`,
      formula: "Notice → agenda → meeting → minutes → action taken report<small>minutes: past tense, third person, decisions and resolutions, signed by the chair</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Which document?</h4>" + tbl(["Purpose", "Document"], [["Instruct staff to follow a new rule", "Office order"], ["Inform all staff about holidays", "Circular"], ["Ask the IT department for two laptops", "Memorandum"], ["Seek approval for a purchase", "Office note"], ["Record board decisions", "Minutes"], ["Track follow-up of decisions", "Action taken report"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Extract of minutes (fictional company).</p>" +
          "<div class=\"card\" style=\"padding:16px;font-size:15px;line-height:1.55\"><b>Minutes of the 42nd meeting of the Board of Directors of Nimbus Paper Products Ltd held on Monday, 12 April 2027 at 11:00 a.m. at the registered office, Pune</b><br><br><b>Present:</b> Ms Farah Khan (Chairperson), Mr Aarav Mehta, Ms Meher Joshi, Mr Rohan Iyer (Directors). <b>In attendance:</b> Ms Tanvi Rao, Company Secretary.<br><br><b>1. Quorum:</b> The Chairperson noted that the quorum was present and called the meeting to order.<br><b>2. Minutes:</b> The minutes of the 41st meeting held on 10 January 2027 were confirmed.<br><b>3. Purchase of a cutting machine:</b> The Board considered the proposal and quotations placed before it. After discussion, it was RESOLVED THAT the purchase of a cutting machine from the lowest bidder at a cost not exceeding ₹18,50,000 be and is hereby approved, and Mr Aarav Mehta be authorised to sign the purchase order.<br><b>4. Vote of thanks:</b> The meeting ended at 12:40 p.m. with a vote of thanks to the Chair.<br><br>(Signature) Chairperson · Date of signing: 20 April 2027</div>";
      },
      use: ["Use the notice to say what, when and where; use the agenda to say in what order.", "Write minutes as decisions, not as a word-for-word conversation.", "Mistake: writing minutes in the present tense or first person.", "Mistake: confusing an office order (an instruction) with a circular (information)."],
      walk: function () { return [
        { t: "A short report", c: "Facts → conclusions → recommendations.", h: chips(["Terms of reference", "Procedure", "Findings", "Conclusions", "Recommendations"], "ac") },
        { t: "Internal documents", c: "Order, circular, memo, note.", h: chips(["Office order: instruct", "Circular: inform many", "Memo: short internal", "Office note: seek approval"], "mi") },
        { t: "The meeting cycle", c: "From notice to follow-up.", h: box("Notice → Agenda → Meeting → Minutes → ATR", "good") },
        { t: "Minutes", c: "Past tense, third person, signed.", h: chips(["Present", "Quorum", "Resolved that…", "Chair's signature"], "ac") }]; },
      recap: ["Reports present findings, conclusions and recommendations; choose the right internal document", "A notice and agenda come before a meeting; minutes record decisions and an ATR tracks follow-up"],
      qc: [{ q: "Minutes of a meeting are usually written in the…", o: ["Past tense and third person", "Present tense and first person", "Future tense", "Second person"], a: 0, e: "They are a formal record of what happened." },
        { q: "A document that tracks the follow-up of decisions taken at a meeting is the…", o: ["Action taken report", "Agenda", "Notice", "Circular"], a: 0, e: "It is usually placed before the next meeting." }]
    },

    /* ---------------- MODULE 4: COMMON BUSINESS TERMINOLOGIES ---------------- */
    {
      id: "4.1", mod: 4, ch: "Unit 4", title: "Common Business Terminologies", time: "16 min", tool: "cases",
      tcfg: { d: "Match each term with its meaning.", cases: [
        { q: "Quorum", o: ["The minimum number of members needed for a valid meeting", "The chairperson's casting vote", "A list of items for discussion", "A person who votes for another"], a: 0, e: "Without a quorum, decisions are not valid." },
        { q: "Proxy", o: ["A person appointed to attend and vote on behalf of a member", "A temporary director", "An auditor's report", "A share certificate"], a: 0, e: "Proxies are allowed at general meetings, subject to the law." },
        { q: "Dividend", o: ["The part of profit distributed to shareholders", "Interest paid on a loan", "A tax on income", "The price of a share"], a: 0, e: "Declared from profits." },
        { q: "Working capital", o: ["Current assets minus current liabilities", "Total assets", "Share capital", "Fixed assets minus depreciation"], a: 0, e: "It funds day-to-day operations." },
        { q: "Insolvency", o: ["Inability to pay debts as they fall due", "Having surplus cash", "A merger of companies", "Issue of new shares"], a: 0, e: "Dealt with under the Insolvency and Bankruptcy Code, 2016." },
        { q: "Debenture", o: ["A document acknowledging a loan to a company", "A share giving voting rights", "A bank statement", "An invoice"], a: 0, e: "Debenture holders are creditors, not owners." },
        { q: "Due diligence", o: ["A careful investigation before a transaction", "A penalty for late filing", "A type of audit fee", "A legal notice"], a: 0, e: "E.g. before buying a company." },
        { q: "Memorandum of Association", o: ["The charter of a company stating its name, objects and liability", "The internal rules of a company", "Minutes of a board meeting", "A bank loan agreement"], a: 0, e: "The articles contain internal rules." }] },
      outcomes: ["Explain common financial terms used in business and company law", "Explain common non-financial and corporate governance terms", "Use terminology accurately in writing", "Distinguish similar-sounding terms"],
      notes: `<p>Company secretaries must use business terms precisely, because a wrong term can change the legal meaning of a document. Terms come from accounting, finance, company law and governance.</p>
<p style="margin-top:10px"><b>Financial terms</b>: <b>assets</b> (resources owned) and <b>liabilities</b> (amounts owed); <b>capital</b> (owners' funds); <b>working capital</b> (current assets minus current liabilities); <b>revenue</b> (income from operations); <b>profit</b> (revenue minus expenses); <b>depreciation</b> (allocation of an asset's cost over its life); <b>dividend</b> (profit distributed to shareholders); <b>debenture</b> (a document acknowledging a debt of the company); <b>equity</b> and <b>preference shares</b>; <b>liquidity</b> (ability to meet short-term obligations); <b>solvency</b> and <b>insolvency</b>; <b>audit</b> (independent examination of accounts); <b>budget</b> (a plan expressed in numbers); <b>invoice</b> (a bill for goods or services); <b>credit note</b> (a document reducing the amount owed, for returns or allowances).</p>
<p style="margin-top:10px"><b>Corporate and legal terms</b>: <b>Memorandum of Association</b> (a company's charter: name, registered office, objects, liability, capital) and <b>Articles of Association</b> (internal rules); <b>board of directors</b>; <b>independent director</b>; <b>quorum</b>; <b>proxy</b>; <b>resolution</b> (ordinary resolution: simple majority; special resolution: at least three times the votes against); <b>AGM</b> and <b>EGM</b>; <b>Registrar of Companies (ROC)</b>; <b>CIN</b> and <b>DIN</b>; <b>e-voting</b>; <b>compliance</b> (following laws and rules); <b>due diligence</b> (careful investigation before a transaction); <b>merger</b> and <b>acquisition</b>; <b>stakeholder</b> (anyone affected by the company); <b>corporate governance</b> (the system by which companies are directed and controlled); <b>CSR</b> (corporate social responsibility); and <b>ESG</b> (environmental, social and governance factors).</p>`,
      formula: "Use the precise term: a word can change the legal meaning<small>MoA = charter · AoA = internal rules · special resolution ≥ 3 × votes against</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Pairs to keep apart</h4>" + tbl(["Term", "vs", "Term"], [["Share (ownership)", "≠", "Debenture (loan)"], ["Dividend (to shareholders)", "≠", "Interest (to lenders)"], ["Ordinary resolution (simple majority)", "≠", "Special resolution (≥ 3 × against)"], ["Memorandum (charter)", "≠", "Articles (internal rules)"], ["Solvency (long-term)", "≠", "Liquidity (short-term)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Spot the wrong term in each line of a draft.</p>" +
          tbl(["Draft", "Correct"], [["The company paid dividend to its debenture holders.", "The company paid interest to its debenture holders."], ["The meeting could not proceed as there was no proxy.", "… as there was no quorum."], ["The Articles of Association state the company's objects.", "The Memorandum of Association states the company's objects."], ["The company is solvent because it has cash for this week's bills.", "The company is liquid; solvency concerns long-term ability to pay all debts."]]);
      },
      use: ["Keep a glossary of terms you meet in each subject.", "Use defined terms consistently throughout a document.", "Mistake: paying 'dividend' to lenders.", "Mistake: mixing up quorum and proxy."],
      walk: function () { return [
        { t: "Why precision matters", c: "One word can change the meaning.", h: chips(["Dividend ≠ interest", "Quorum ≠ proxy"], "hl") },
        { t: "Financial terms", c: "From accounting and finance.", h: chips(["Working capital", "Depreciation", "Liquidity", "Solvency"], "ac") },
        { t: "Corporate terms", c: "From company law and governance.", h: chips(["MoA", "AoA", "Quorum", "Resolution", "AGM"], "ac") },
        { t: "Modern terms", c: "Governance and sustainability.", h: chips(["Corporate governance", "CSR", "ESG", "Stakeholder"], "mi") }]; },
      recap: ["Use financial and corporate terms precisely; similar terms have different legal meanings", "Know MoA vs AoA, ordinary vs special resolutions, quorum vs proxy, dividend vs interest"],
      qc: [{ q: "Current assets minus current liabilities is…", o: ["Working capital", "Net profit", "Share capital", "Reserves"], a: 0, e: "It measures short-term funds available." },
        { q: "A special resolution needs votes in favour of at least…", o: ["Three times the votes against", "A simple majority", "All members", "Two-thirds of the board"], a: 0, e: "Section 114 of the Companies Act, 2013." }]
    }
  ];

  var MODULES = [
    { n: 1, title: "Essentials of Good English", sub: "Grammar and usage, vocabulary, sentence correction, para jumbles, comprehension and summarising.", tag: "Module 1", short: "Good English", takeaway: "Correct grammar, precise words and well-ordered sentences are the base of every business document. Read actively and summarise in your own words." },
    { n: 2, title: "Communication", sub: "The communication process, modes, networks, barriers and listening; etiquette, PR, social media, legal aspects and AI.", tag: "Module 2", short: "Communication", takeaway: "Communication is complete only when it is understood. Choose the right channel, remove barriers, listen actively, and communicate courteously and lawfully." },
    { n: 3, title: "Business Correspondence", sub: "Business letters, messages and e-mails; reports, office orders, circulars, memos, notices, agenda, minutes and ATRs.", tag: "Module 3", short: "Correspondence", takeaway: "Each document has a purpose and a format. Match the structure to the message and keep meeting records precise." },
    { n: 4, title: "Common Business Terminologies", sub: "Financial, corporate and governance terms used in business and company law.", tag: "Module 4", short: "Terminology", takeaway: "Precise terms make precise documents. Similar-sounding terms often have very different legal meanings." }
  ];

  /* ================= FINAL TEST (30 questions across the 4 modules) ================= */
  var TEST = [
    { m: 1, q: "Choose the correct sentence.", o: ["The committee has submitted its report.", "The committee have submitted it's report.", "The committee has submitted it's report.", "The committee were submitted its report."], a: 0, e: "Collective noun acting as one: 'has'; possessive 'its'." },
    { m: 1, q: "Passive voice of 'The manager will approve the leave':", o: ["The leave will be approved by the manager.", "The leave would be approved by the manager.", "The leave is approved by the manager.", "The manager will be approved by the leave."], a: 0, e: "Future simple → will be + past participle." },
    { m: 1, q: "Fill in: 'It was ___ unique opportunity.'", o: ["a", "an", "the", "no article"], a: 0, e: "'Unique' begins with a 'you' sound, a consonant sound." },
    { m: 1, q: "Synonym of 'meticulous':", o: ["Careful", "Careless", "Quick", "Rude"], a: 0, e: "Meticulous = showing great attention to detail." },
    { m: 1, q: "'To call it a day' means…", o: ["To stop working for the day", "To name a holiday", "To phone someone daily", "To start early"], a: 0, e: "An idiom." },
    { m: 1, q: "One word for 'agreed to by everyone':", o: ["Unanimous", "Majority", "Ambiguous", "Anonymous"], a: 0, e: "A unanimous decision." },
    { m: 1, q: "Which is spelt correctly?", o: ["Liaison", "Liasion", "Liason", "Laison"], a: 0, e: "l-i-a-i-s-o-n." },
    { m: 1, q: "Choose the correct option: 'He is senior ___ me.'", o: ["to", "than", "from", "of"], a: 0, e: "Senior, junior, superior and inferior take 'to'." },
    { m: 1, q: "In a para jumble, the opening sentence usually…", o: ["Introduces the topic and does not depend on another sentence", "Begins with 'However'", "Contains a pronoun like 'this'", "States the conclusion"], a: 0, e: "Linking words point back to earlier sentences." },
    { m: 2, q: "The last stage that completes the communication process is…", o: ["Feedback", "Encoding", "Channel", "Noise"], a: 0, e: "Feedback shows the message was understood." },
    { m: 2, q: "Communication between managers at the same level in different departments is…", o: ["Horizontal", "Downward", "Upward", "Diagonal"], a: 0, e: "Diagonal crosses both levels and departments." },
    { m: 2, q: "Prejudice against the speaker is a…", o: ["Psychological barrier", "Physical barrier", "Semantic barrier", "Organisational barrier"], a: 0, e: "It concerns attitudes and emotions." },
    { m: 2, q: "Active listening includes…", o: ["Paraphrasing to check understanding", "Planning your reply while the speaker talks", "Interrupting to save time", "Looking at your phone"], a: 0, e: "Confirm what you heard." },
    { m: 2, q: "Spoken defamation is called…", o: ["Slander", "Libel", "Plagiarism", "Perjury"], a: 0, e: "Libel is written." },
    { m: 2, q: "The main aim of public relations is to…", o: ["Build goodwill and trust", "Sell at a discount", "Prepare budgets", "Hire staff"], a: 0, e: "Advertising is paid promotion." },
    { m: 2, q: "Before sending a reply drafted by an AI tool, you should…", o: ["Check accuracy, tone and confidentiality", "Send it unchanged", "Add a disclaimer that you did not read it", "Ask the tool to sign it"], a: 0, e: "The sender is responsible." },
    { m: 2, q: "In a virtual meeting, good etiquette includes…", o: ["Muting when not speaking", "Eating on camera", "Joining from a noisy street", "Talking over others"], a: 0, e: "Reduce noise and distraction." },
    { m: 3, q: "'Dear Ms Iyer' should end with…", o: ["Yours sincerely", "Yours faithfully", "Yours truly obliged", "Cheers"], a: 0, e: "Named salutation → sincerely." },
    { m: 3, q: "A letter refusing a request should usually follow the…", o: ["Indirect approach", "Direct approach", "AIDA approach", "Telegraphic style"], a: 0, e: "Buffer, reasons, bad news, goodwill close." },
    { m: 3, q: "The 'A' that comes last in AIDA stands for…", o: ["Action", "Attention", "Agreement", "Analysis"], a: 0, e: "Attention, Interest, Desire, Action." },
    { m: 3, q: "To send an e-mail to many clients without revealing their addresses, use…", o: ["Bcc", "Cc", "Reply all", "Forward"], a: 0, e: "Blind carbon copy hides addresses." },
    { m: 3, q: "A document that instructs staff to follow a new rule is an…", o: ["Office order", "Circular", "Office note", "Agenda"], a: 0, e: "A circular informs." },
    { m: 3, q: "The list of items to be discussed at a meeting is the…", o: ["Agenda", "Minutes", "Notice", "Proxy"], a: 0, e: "It is usually sent with the notice." },
    { m: 3, q: "Minutes of a meeting are signed by the…", o: ["Chairperson", "Youngest member", "Auditor", "Receptionist"], a: 0, e: "The chair authenticates them." },
    { m: 3, q: "In a short report, 'terms of reference' state…", o: ["What the writer was asked to investigate", "The final recommendations", "The list of people present", "The budget"], a: 0, e: "They define the scope." },
    { m: 4, q: "The minimum number of members needed for a valid meeting is the…", o: ["Quorum", "Proxy", "Majority", "Agenda"], a: 0, e: "No quorum, no valid business." },
    { m: 4, q: "Interest is paid to…", o: ["Debenture holders", "Equity shareholders", "Directors", "Auditors"], a: 0, e: "Dividend goes to shareholders." },
    { m: 4, q: "A company's objects are stated in its…", o: ["Memorandum of Association", "Articles of Association", "Minutes book", "Annual return"], a: 0, e: "The articles hold internal rules." },
    { m: 4, q: "ESG stands for…", o: ["Environmental, Social and Governance", "Equity, Shares and Gains", "External Statutory Guidelines", "Earnings, Sales and Growth"], a: 0, e: "Factors used to assess responsible business." },
    { m: 4, q: "Inability to pay debts as they fall due is…", o: ["Insolvency", "Liquidity", "Solvency", "Dividend"], a: 0, e: "Governed by the IBC, 2016." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Subject–verb agreement", "The verb matches its subject in number.", "The list IS attached", "1.1"],
    ["Active voice", "The subject performs the action.", "The CFO signed the cheque", "1.1"],
    ["Passive voice", "The subject receives the action.", "The cheque was signed", "1.1"],
    ["Article", "a, an (indefinite) or the (definite).", "an hour, a university", "1.1"],
    ["Synonym", "A word with a similar meaning.", "commence / begin", "1.2"],
    ["Antonym", "A word with the opposite meaning.", "surplus / deficit", "1.2"],
    ["Idiom", "A phrase whose meaning is not literal.", "in the red", "1.2"],
    ["Homophones", "Words that sound alike but differ in meaning.", "stationary / stationery", "1.2"],
    ["Bona fide", "Genuine; in good faith.", "a bona fide purchaser", "1.2"],
    ["Pro rata", "In proportion.", "pro rata allotment", "1.2"],
    ["Sine die", "Without fixing a date.", "adjourned sine die", "1.2"],
    ["Para jumble", "Sentences to be arranged into a logical paragraph.", "Opener → links → conclusion", "1.3"],
    ["Précis", "A concise summary in your own words.", "≈ one-third length", "1.3"],
    ["Redundancy", "Using words that repeat meaning.", "return back", "1.3"],
    ["Encoding", "Turning an idea into a message.", "Choosing words for an e-mail", "2.1"],
    ["Feedback", "The receiver's response that completes communication.", "Confirming a deadline", "2.1"],
    ["Noise", "Anything that distorts a message.", "A bad phone line", "2.1"],
    ["Grapevine", "Informal communication network.", "Office rumours", "2.1"],
    ["Semantic barrier", "A barrier caused by words and meaning.", "Jargon", "2.1"],
    ["Active listening", "Attentive listening with questions and paraphrasing.", "'So you need it by Friday?'", "2.1"],
    ["Etiquette", "The code of polite behaviour.", "Muting on calls", "2.2"],
    ["Public relations", "Building goodwill with the public and stakeholders.", "Press releases", "2.2"],
    ["Defamation", "A false statement that harms reputation.", "Libel (written), slander (spoken)", "2.2"],
    ["Disclaimer", "A statement limiting responsibility.", "E-mail footer", "2.2"],
    ["Salutation", "The greeting in a letter.", "Dear Sir or Madam", "3.1"],
    ["Complimentary close", "The polite ending before the signature.", "Yours faithfully", "3.1"],
    ["AIDA", "Attention, Interest, Desire, Action: a persuasive structure.", "Sales letters", "3.1"],
    ["Bcc", "Blind carbon copy; hides recipients.", "Mailing a client list", "3.1"],
    ["Office order", "An instruction from management.", "Transfer of duties", "3.2"],
    ["Circular", "Information sent to many people.", "Holiday list", "3.2"],
    ["Memorandum (memo)", "A short internal message.", "Request for laptops", "3.2"],
    ["Agenda", "The list of items for a meeting.", "Sent with the notice", "3.2"],
    ["Minutes", "The official record of a meeting's decisions.", "Signed by the chair", "3.2"],
    ["Action taken report", "A report on follow-up of decisions.", "ATR", "3.2"],
    ["MIS", "Management information system reports.", "Weekly sales summary", "3.2"],
    ["Quorum", "Minimum members for a valid meeting.", "Board quorum", "4.1"],
    ["Proxy", "A person who attends and votes for a member.", "At a general meeting", "4.1"],
    ["Working capital", "Current assets minus current liabilities.", "Funds day-to-day operations", "4.1"],
    ["Debenture", "A document acknowledging a company's debt.", "Lender, not owner", "4.1"],
    ["Special resolution", "Needs votes in favour ≥ three times votes against.", "Altering articles", "4.1"],
    ["Due diligence", "A careful investigation before a transaction.", "Before an acquisition", "4.1"],
    ["Corporate governance", "How companies are directed and controlled.", "Board independence", "4.1"]
  ];

  /* ================= BUSINESS COMMUNICATION TOOLS =================
     jumble:  l.tcfg = { d, sets: [{ title, s: [sentences in the right order] }] }   — para-jumble trainer
     letter:  builder for business letters and e-mails, with a 7 Cs check
     minutes: builder for a notice, agenda, minutes and action taken report        */
  function dstr(s) { var d = new Date(s + "T00:00:00"); return isNaN(d) ? "" : d.getDate() + " " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] + " " + d.getFullYear(); }
  function dayDiff(a, b) { var x = new Date(a + "T00:00:00"), y = new Date(b + "T00:00:00"); return (isNaN(x) || isNaN(y)) ? NaN : Math.round((y - x) / 86400000); }
  function plines(id) { return val(id).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function doc(html) { return '<div class="card" style="padding:18px 20px;font-family:Georgia,serif;line-height:1.6;white-space:normal;overflow-wrap:anywhere">' + html + "</div>"; }
  function checks(rows) {
    return '<div class="stack" style="margin-top:12px">' + rows.map(function (r) { return '<div class="small">' + (r[0] ? "✅ " : "⚠️ ") + r[1] + "</div>"; }).join("") + "</div>";
  }

  /* ---------- para-jumble trainer ---------- */
  TOOLS.jumble = {
    d: function (l) { return l.tcfg.d; },
    b: function () { return ""; },
    wire: function (l, cout) {
      var sets = l.tcfg.sets, k = 0, order, pick, checked;
      var LET = "PQRSTU";
      function start() {
        var s = sets[k].s, idx = s.map(function (_, i) { return i; });
        do { idx = shuffleCopy(idx); } while (idx.every(function (v, i) { return v === i; }));
        order = idx; pick = []; checked = false; draw();
      }
      function draw() {
        var s = sets[k].s, right = checked && pick.every(function (v, i) { return v === i; });
        var h = '<div class="row" style="justify-content:space-between"><span class="tag indigo">Set ' + (k + 1) + " of " + sets.length + ": " + esc(sets[k].title) + "</span></div>";
        h += '<div class="stack" style="margin-top:10px">' + order.map(function (si, j) {
          var used = pick.indexOf(si) >= 0;
          return '<button class="opt' + (used ? " ok" : "") + '" data-s="' + si + '"' + (used || checked ? " disabled" : "") + '><span class="k">' + LET[j] + ".</span><span>" + esc(s[si]) + "</span></button>";
        }).join("") + "</div>";
        h += '<p class="small" style="margin-top:10px"><b>Your order:</b> ' + (pick.length ? pick.map(function (si) { return LET[order.indexOf(si)]; }).join(" → ") : "click the sentences in order") + "</p>";
        if (checked) {
          h += '<div class="expl">' + (right ? "✅ Correct. " : "Not quite. The right order is <b>" + s.map(function (_, i) { return LET[order.indexOf(i)]; }).join(" → ") + "</b>. ") +
            "The opener <i>“" + esc(s[0]) + "”</i> introduces the topic and does not depend on anything before it; each later sentence follows from the one before it.</div>" +
            '<div class="card" style="padding:12px 14px;margin-top:8px">' + esc(s.join(" ")) + "</div>";
        }
        h += '<div class="row" style="gap:8px;margin-top:10px">' +
          '<button class="btn btn-ink btn-sm" id="jb_check"' + (pick.length === s.length && !checked ? "" : " disabled") + ">Check</button>" +
          '<button class="btn btn-soft btn-sm" id="jb_undo"' + (pick.length && !checked ? "" : " disabled") + ">Undo</button>" +
          '<button class="btn btn-soft btn-sm" id="jb_reset">Shuffle again</button>' +
          '<button class="btn btn-soft btn-sm" id="jb_next">' + (k < sets.length - 1 ? "Next set →" : "Back to set 1") + "</button></div>";
        cout.innerHTML = h;
      }
      cout.addEventListener("click", function (e) {
        var b = e.target.closest("[data-s]");
        if (b && !b.disabled) { pick.push(+b.getAttribute("data-s")); draw(); return; }
        if (e.target.id === "jb_check") { checked = true; draw(); }
        if (e.target.id === "jb_undo") { pick.pop(); draw(); }
        if (e.target.id === "jb_reset") start();
        if (e.target.id === "jb_next") { k = (k + 1) % sets.length; start(); }
      });
      start();
    }
  };

  /* ---------- letter and e-mail builder ---------- */
  var LTYPES = {
    enquiry: { enc: "", n: "Enquiry", app: "direct", subj: "Enquiry about printing paper prices", open: "We are a stationery wholesaler in Pune and would like to know your prices and terms for the items below.", facts: "A4 copier paper, 75 gsm: about 500 reams a month\nA3 copier paper, 80 gsm: about 100 reams a month", close: "We would be grateful for your quotation, with delivery period and payment terms, by 20 March." },
    order: { enc: "Copy of your quotation of 12 March", n: "Order", app: "direct", subj: "Order No. NP/245 for copier paper", open: "Thank you for your quotation of 12 March. We are pleased to place the following order.", facts: "500 reams of A4 copier paper, 75 gsm, at ₹240 per ream\n100 reams of A3 copier paper, 80 gsm, at ₹470 per ream\nDelivery: our Pune warehouse, by 5 April\nPayment: within 30 days of invoice", close: "Please confirm the order and the dispatch date." },
    complaint: { enc: "Copy of Invoice No. 1187; photographs of damaged cartons", n: "Complaint", app: "direct", subj: "Damaged consignment against Invoice No. 1187", open: "We received 200 cartons of printing paper from you on 4 March against Invoice No. 1187.", facts: "On opening, 30 cartons were found damp and unusable\nThe damaged cartons have been kept aside for your inspection\nWe have had to delay two customer orders", close: "Please arrange a replacement of the 30 cartons by 15 March, or issue a credit note for their value." },
    adjustment: { enc: "Copy of the dispatch note", n: "Adjustment (reply to a complaint)", app: "direct", subj: "Your letter of 6 March: replacement of damaged cartons", open: "Thank you for telling us about the 30 damp cartons in the consignment of 4 March. We are sorry for the trouble this has caused.", facts: "Our transporter's truck was caught in unseasonal rain on the way\nThirty replacement cartons were dispatched today by express service\nOur driver will collect the damaged cartons when he delivers", close: "We have also tightened our packing for the monsoon. We value your business and look forward to serving you." },
    refusal: { enc: "", n: "Refusal (bad news)", app: "indirect", subj: "Your request for 60 days' credit", open: "Thank you for your order of 10 March and for your interest in a longer credit period.", facts: "Our credit terms are set by our bank and apply equally to all dealers\nWe are therefore unable to extend the period from 30 to 60 days\nWe can, however, offer a 2% cash discount for payment within 10 days", close: "We hope this option helps you, and we look forward to your continued orders." }
  };
  var WEAK = [[/revert back/i, "'revert back' is redundant; write 'reply'"], [/do the needful/i, "'do the needful' is vague; say exactly what you want done"], [/please find attached herewith|attached herewith/i, "'attached herewith' is wordy; write 'I attach' or 'Attached is'"], [/discuss about/i, "'discuss about' is wrong; write 'discuss'"], [/at the earliest/i, "'at the earliest' is vague; give a date"], [/!{1,}/, "avoid exclamation marks in a formal message"], [/\b[A-Z]{6,}\b/, "a word in capital letters reads as shouting"], [/\bu\b|\bpls\b|\bthx\b/i, "avoid text-message short forms"]];
  TOOLS.letter = {
    d: "Choose a letter type and edit the details. The builder lays out a complete business letter (or a formal e-mail), picks the complimentary close that matches the salutation, and checks your text against the 7 Cs. Sample details are filled in; replace them with your own.",
    b: function () {
      return g2(sel("lt_type", Object.keys(LTYPES).map(function (k) { return [k, LTYPES[k].n]; }), "complaint", "Letter type"), sel("lt_fmt", [["letter", "Printed letter"], ["email", "E-mail"]], "letter", "Format")) +
        g2(inp("lt_from", "Nimbus Paper Products Ltd, 14 MIDC Road, Pune 411 019", "Sender (organisation and address)"), inp("lt_ref", "NPP/PUR/2026/31", "Reference number")) +
        g3(inp("lt_to", "Ms Meher Rao", "Receiver's name (leave blank for Sir/Madam)"), inp("lt_desig", "Sales Manager", "Designation"), inp("lt_org", "Saffron Paper Mills Pvt Ltd, Nashik", "Organisation and city")) +
        g2(inp("lt_date", "2026-03-06", "Date (YYYY-MM-DD)"), inp("lt_signer", "Aarav Mehta, Purchase Manager", "Signed by (name, designation)")) +
        inp("lt_subj", LTYPES.complaint.subj, "Subject") +
        ta("lt_open", LTYPES.complaint.open, 2, "Opening paragraph") +
        ta("lt_facts", LTYPES.complaint.facts, 4, "Details (one point per line)") +
        ta("lt_close", LTYPES.complaint.close, 2, "Closing (what you want, by when)") +
        inp("lt_enc", "Copy of Invoice No. 1187; photographs of damaged cartons", "Enclosures (optional, separate with ;)");
    },
    wire: function (l, cout) {
      var card = cout.parentElement;
      function fill() {
        var t = LTYPES[val("lt_type")];
        document.getElementById("lt_subj").value = t.subj; document.getElementById("lt_open").value = t.open;
        document.getElementById("lt_facts").value = t.facts; document.getElementById("lt_close").value = t.close; document.getElementById("lt_enc").value = t.enc;
      }
      function run() {
        var t = LTYPES[val("lt_type")], em = val("lt_fmt") === "email", to = val("lt_to").trim(), facts = plines("lt_facts");
        var tm2 = to.match(/^(Mr|Ms|Mrs|Dr|Prof)\.?\s+(.+)$/i), sname = tm2 ? tm2[1] + " " + tm2[2].split(/\s+/).pop() : to;
        var sal = to ? "Dear " + sname : "Dear Sir or Madam", cls = to ? "Yours sincerely" : "Yours faithfully";
        if (em) cls = "Regards";
        var signer = val("lt_signer").split(","), enc = val("lt_enc").split(";").map(function (x) { return x.trim(); }).filter(Boolean);
        var subj = val("lt_subj").trim(), body = [val("lt_open").trim()];
        var detail = facts.length > 1 ? "<ul style=\"margin:6px 0 6px 20px\">" + facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" : (facts[0] ? "<p>" + esc(facts[0]) + "</p>" : "");
        var h;
        if (em) {
          h = "<p><b>To:</b> " + esc(to ? to.replace(/^(Mr|Ms|Mrs|Dr)\.?\s+/i, "").toLowerCase().replace(/\s+/g, ".") + "@example.com" : "sales@example.com") + "<br><b>Subject:</b> " + esc(subj) + "</p>" +
            "<p>" + esc(sal) + ",</p><p>" + esc(body[0]) + "</p>" + detail + "<p>" + esc(val("lt_close").trim()) + "</p>" +
            "<p>" + cls + ",<br>" + esc((signer[0] || "").trim()) + "<br>" + esc(signer.slice(1).join(",").trim()) + "<br>" + esc(val("lt_from").split(",")[0]) + "</p>" +
            (enc.length ? '<p class="small"><b>Attachments:</b> ' + enc.map(esc).join("; ") + "</p>" : "");
        } else {
          var from = val("lt_from").split(",");
          h = '<div style="text-align:center;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:10px"><b style="font-size:18px">' + esc(from[0]) + '</b><br><span class="small">' + esc(from.slice(1).join(",").trim()) + "</span></div>" +
            '<p>Ref.: ' + esc(val("lt_ref")) + '<span style="float:right">' + esc(dstr(val("lt_date")) || val("lt_date")) + "</span></p>" +
            "<p>" + (to ? esc(to) + "<br>" : "") + esc(val("lt_desig")) + "<br>" + esc(val("lt_org")).replace(/,\s*/g, "<br>") + "</p>" +
            "<p>" + esc(sal) + ",</p><p><b>Subject: " + esc(subj) + "</b></p><p>" + esc(body[0]) + "</p>" + detail + "<p>" + esc(val("lt_close").trim()) + "</p>" +
            "<p>" + cls + ",<br>for " + esc(from[0]) + "<br><br>" + esc((signer[0] || "").trim()) + "<br>" + esc(signer.slice(1).join(",").trim()) + "</p>" +
            (enc.length ? '<p class="small">Encl.: ' + enc.map(function (x, i) { return (i + 1) + ". " + esc(x); }).join(" ") + "</p>" : "");
        }
        var all = [subj, body[0], facts.join(" "), val("lt_close")].join(" "), words = all.split(/\s+/).filter(Boolean).length;
        var c = [
          [subj.length >= 12 && subj.length <= 80, subj.length < 12 ? "Concrete: make the subject line specific (an order or invoice number, a date)." : subj.length > 80 ? "Concise: shorten the subject line." : "Concrete: the subject line is specific."],
          [true, "Correct: '" + sal + "' is matched with '" + cls + "'" + (em ? " (e-mail)." : to ? " (named person)." : " (Sir or Madam).")],
          [/\d/.test(val("lt_close")) || t.app === "indirect" || val("lt_type") === "adjustment", /\d/.test(val("lt_close")) || t.app === "indirect" || val("lt_type") === "adjustment" ? "Complete: the closing tells the reader what happens next." : "Complete: add what you want the reader to do, and by when (a date)."],
          [words <= 180, words <= 180 ? "Concise: " + words + " words in the body." : "Concise: " + words + " words; try to keep a routine letter under about 180 words."],
          [t.app === "direct" || !/unable|cannot|regret/i.test(val("lt_open")), t.app === "direct" ? "Structure: direct approach (main point first) suits a " + t.n.toLowerCase() + " message." : (!/unable|cannot|regret/i.test(val("lt_open")) ? "Structure: indirect approach. The opening is a neutral buffer, and the bad news comes after the reasons." : "Structure: for bad news, do not refuse in the first paragraph; open with a neutral buffer.")]
        ];
        WEAK.forEach(function (w) { if (w[0].test(all)) c.push([false, "Courteous and correct: " + w[1] + "."]); });
        cout.innerHTML = doc(h) + checks(c) + note("Names and organisations are fictional. In the exam, set out the letter in this order: letterhead, reference and date, inside address, salutation, subject, body, close, signature, enclosures.");
      }
      card.addEventListener("change", function (e) { if (e.target.id === "lt_type") fill(); run(); });
      var tm = null; card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; clearTimeout(tm); tm = setTimeout(run, 180); });
      run();
    }
  };

  /* ---------- notice, agenda, minutes and action taken report builder ---------- */
  var MTYPES = { board: { n: "Board meeting", days: 7, law: "at least 7 days' notice in writing to every director (s.173(3) of the Companies Act, 2013); shorter notice is allowed for urgent business if at least one independent director, where there is one, is present", who: "directors" },
    agm: { n: "Annual general meeting", days: 21, law: "at least 21 clear days' notice (s.101 of the Companies Act, 2013); 'clear days' exclude the day the notice is served and the day of the meeting", who: "members" },
    committee: { n: "Committee meeting", days: 0, law: "the notice period set by the committee's terms of reference or the company's rules", who: "committee members" } };
  TOOLS.minutes = {
    d: "Enter the meeting details and the items once. The builder drafts the notice, the agenda, the minutes and the action taken report, and checks the notice period. Sample details are filled in; replace them with your own.",
    b: function () {
      return g2(sel("mt_doc", [["notice", "Notice"], ["agenda", "Agenda"], ["minutes", "Minutes"], ["atr", "Action taken report"]], "minutes", "Document to show"), sel("mt_type", [["board", "Board meeting"], ["agm", "Annual general meeting"], ["committee", "Committee meeting"]], "board", "Kind of meeting")) +
        g2(inp("mt_co", "Nimbus Paper Products Ltd", "Company"), inp("mt_no", "4th meeting of 2026–27", "Meeting number")) +
        g3(inp("mt_nd", "2026-07-08", "Notice sent on (YYYY-MM-DD)"), inp("mt_md", "2026-07-20", "Meeting date (YYYY-MM-DD)"), inp("mt_time", "11:00 a.m.", "Time")) +
        g2(inp("mt_venue", "Board Room, 14 MIDC Road, Pune 411 019 (video link available)", "Venue"), inp("mt_chair", "Mr Rohan Iyer", "Chairperson")) +
        g2(ta("mt_present", "Ms Tanvi Shah, Director\nMs Farah Khan, Independent Director\nMr Aarav Mehta, Director", 3, "Present (one per line, besides the chair)"), inp("mt_cs", "Ms Meher Rao, Company Secretary", "Notice and minutes signed by / recorded by")) +
        ta("mt_items", "Approval of the audited accounts for 2025–26 | Approved | Company Secretary | 2026-07-27\nAppointment of a statutory auditor | Recommended to the AGM | Company Secretary | 2026-08-30\nPurchase of a new delivery van | Approved up to ₹18 lakh | Ms Tanvi Shah | 2026-08-15", 4, "Business items: item | decision | responsible | due date (one per line)");
    },
    wire: function (l, cout) {
      var card = cout.parentElement;
      function run() {
        var ty = MTYPES[val("mt_type")], docT = val("mt_doc"), co = esc(val("mt_co")), md = val("mt_md"), nd = val("mt_nd");
        var items = plines("mt_items").map(function (x) { var p = x.split("|").map(function (y) { return y.trim(); }); return { t: p[0] || "", d: p[1] || "", w: p[2] || "", due: p[3] || "" }; });
        var present = plines("mt_present"), chair = esc(val("mt_chair")), cs = val("mt_cs").split(","), when = esc(dstr(md) || md) + " at " + esc(val("mt_time"));
        var agenda = ["Leave of absence, if any", "Confirmation of the minutes of the previous meeting", "Matters arising from the previous minutes"].concat(items.map(function (x) { return x.t; })).concat(["Any other business with the permission of the Chair", "Date of the next meeting"]);
        var h;
        if (docT === "notice") {
          h = '<p style="text-align:center"><b>' + co + "</b></p><p><b>NOTICE OF THE " + esc(val("mt_no")).toUpperCase() + " (" + esc(ty.n).toUpperCase() + ")</b></p>" +
            "<p>Date: " + esc(dstr(nd) || nd) + "</p><p>Notice is hereby given that the " + esc(val("mt_no")) + " (" + esc(ty.n.toLowerCase()) + ") of " + co + " will be held on " + when + " at " + esc(val("mt_venue")) + ", to transact the business set out in the attached agenda.</p>" +
            "<p>" + esc(ty.who.charAt(0).toUpperCase() + ty.who.slice(1)) + " are requested to attend.</p><p>By order of the Board<br><br>" + esc((cs[0] || "").trim()) + "<br>" + esc(cs.slice(1).join(",").trim()) + "</p>";
        } else if (docT === "agenda") {
          h = '<p style="text-align:center"><b>' + co + "</b><br>Agenda for the " + esc(val("mt_no")) + " (" + esc(ty.n.toLowerCase()) + ")<br>" + when + ", " + esc(val("mt_venue")) + "</p><ol style=\"margin-left:20px\">" + agenda.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ol>";
        } else if (docT === "minutes") {
          var n0 = 3;
          h = '<p style="text-align:center"><b>' + co + "</b><br>Minutes of the " + esc(val("mt_no")) + " (" + esc(ty.n.toLowerCase()) + ") held on " + when + " at " + esc(val("mt_venue")) + "</p>" +
            "<p><b>Present:</b> " + chair + " (Chair)" + (present.length ? "; " + present.map(esc).join("; ") : "") + "<br><b>In attendance:</b> " + esc(val("mt_cs")) + "</p>" +
            "<p><b>1. Leave of absence.</b> No leave of absence was sought.</p><p><b>2. Minutes of the previous meeting.</b> The minutes of the previous meeting, circulated in advance, were confirmed and signed by the Chair.</p>" +
            "<p><b>3. Matters arising.</b> There were no matters arising.</p>" +
            items.map(function (x, i) { return "<p><b>" + (n0 + i + 1) + ". " + esc(x.t) + ".</b> The " + esc(ty.who) + " discussed the matter. It was <b>resolved</b> that the item be " + esc(x.d ? x.d.charAt(0).toLowerCase() + x.d.slice(1) : "noted") + "." + (x.w ? " " + esc(x.w) + " was authorised to take the necessary steps" + (x.due ? " by " + esc(dstr(x.due) || x.due) : "") + "." : "") + "</p>"; }).join("") +
            "<p><b>" + (n0 + items.length + 1) + ". Any other business.</b> None.</p><p>The meeting ended with a vote of thanks to the Chair.</p>" +
            "<p>Date of signing: ________<br>Place: ________<br><br>Chairperson</p>";
        } else {
          h = '<p style="text-align:center"><b>' + co + "</b><br>Action taken report on the decisions of the " + esc(val("mt_no")) + " held on " + esc(dstr(md) || md) + "</p>" +
            tbl(["No.", "Decision", "Responsible", "Due by", "Status"], items.map(function (x, i) { return [String(i + 1), esc(x.t) + ": " + esc(x.d), esc(x.w), esc(dstr(x.due) || x.due), "To be updated"]; }));
        }
        var gap = dayDiff(nd, md), c = [];
        if (!isFinite(gap)) c.push([false, "Enter both dates as YYYY-MM-DD to check the notice period."]);
        else if (gap <= 0) c.push([false, "The notice date must be before the meeting date."]);
        else {
          var clear = gap - 1, need = ty.days, got = val("mt_type") === "agm" ? clear : gap;
          c.push([got >= need, ty.n + ": " + (val("mt_type") === "agm" ? clear + " clear days" : gap + " days") + " between notice and meeting; the rule is " + ty.law + "."]);
        }
        c.push([items.length > 0, items.length ? items.length + " business item(s) carried into every document." : "Add at least one business item."]);
        if (docT === "minutes") c.push([true, "Minutes are in the past tense and third person, record decisions as resolutions, and are signed by the Chair."]);
        cout.innerHTML = doc(h) + checks(c) + note("Names and the company are fictional. The legal rules shown are the general rules; always check the current Act, the Secretarial Standards (SS-1 for board meetings, SS-2 for general meetings) and the company's articles.");
      }
      var tm = null; card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; clearTimeout(tm); tm = setTimeout(run, 180); });
      card.addEventListener("change", function (e) { if (e.target.tagName === "SELECT") run(); });
      run();
    }
  };

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0, 1, 3]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= GENERIC TOOLS (shared by all papers) =================
     sort:  l.tcfg = { d, buckets: [..], items: [[text, bucket, why], ..] }  — classify each item
     cases: l.tcfg = { d, cases: [{ q, o: [..], a, e }, ..] }                  — scenario trainer   */
  function shuffleCopy(a) { var b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  TOOLS.sort = {
    d: function (l) { return l.tcfg.d || "Decide where each item belongs. Click a button for each item to check your answer."; },
    b: function () { return ""; },
    wire: function (l, cout) {
      var c = l.tcfg, items = c.items.map(function (x, i) { return { t: x[0], b: x[1], e: x[2] || "", i: i }; }), ans = {};
      function draw() {
        var done = Object.keys(ans).length, right = items.filter(function (x) { return ans[x.i] === x.b; }).length;
        cout.innerHTML = '<div class="stack">' + items.map(function (x) {
          var a = ans[x.i], ok = a === x.b;
          return '<div class="q" style="padding:12px 14px"><b style="margin-bottom:8px">' + x.t + '</b><div class="row" style="gap:8px">' + c.buckets.map(function (bk) {
            var cls = a === undefined ? "" : (bk === x.b ? "ok" : (bk === a ? "bad" : ""));
            return '<button class="opt ' + cls + '" style="padding:7px 12px;font-size:15px" data-i="' + x.i + '" data-b="' + esc(bk) + '"' + (a !== undefined ? " disabled" : "") + ">" + esc(bk) + "</button>";
          }).join("") + "</div>" + (a !== undefined ? '<div class="expl">' + (ok ? "✅ Correct. " : "Not quite: it is <b>" + esc(x.b) + "</b>. ") + x.e + "</div>" : "") + "</div>";
        }).join("") + "</div>" + kv([["Answered", done + " of " + items.length], ["Correct", right]]) +
          (done ? '<div class="row" style="margin-top:6px"><button class="btn btn-soft btn-sm" id="srt_reset">Try again</button></div>' : "");
      }
      cout.addEventListener("click", function (e) {
        var b = e.target.closest("[data-i]"); if (b && !b.disabled) { ans[+b.getAttribute("data-i")] = b.getAttribute("data-b"); draw(); return; }
        if (e.target.id === "srt_reset") { ans = {}; items = shuffleCopy(items); draw(); }
      });
      items = shuffleCopy(items); draw();
    }
  };
  TOOLS.cases = {
    d: function (l) { return l.tcfg.d || "Work through each case. Choose an answer to see the explanation, then move to the next case."; },
    b: function () { return ""; },
    wire: function (l, cout) {
      var cs = l.tcfg.cases, k = 0, ans = {};
      function draw() {
        var c = cs[k], a = ans[k], right = Object.keys(ans).filter(function (i) { return ans[i] === cs[i].a; }).length;
        cout.innerHTML = '<div class="row" style="justify-content:space-between"><span class="tag indigo">Case ' + (k + 1) + " of " + cs.length + '</span><span class="small muted">' + right + " correct so far</span></div>" +
          '<div class="q" style="margin-top:10px"><b>' + c.q + '</b><div class="opts">' + c.o.map(function (o, i) {
            var cls = a === undefined ? "" : (i === c.a ? "ok" : (i === a ? "bad" : ""));
            return '<button class="opt ' + cls + '" data-o="' + i + '"' + (a !== undefined ? " disabled" : "") + '><span class="k">' + "ABCD"[i] + ".</span><span>" + o + "</span></button>";
          }).join("") + "</div>" + (a !== undefined ? '<div class="expl">' + (a === c.a ? "✅ Correct. " : "Not quite. ") + c.e + "</div>" : "") + "</div>" +
          '<div class="row" style="justify-content:space-between;margin-top:10px"><button class="btn btn-soft btn-sm" id="cs_prev"' + (k ? "" : " disabled") + '>← Previous case</button><button class="btn btn-ink btn-sm" id="cs_next"' + (k < cs.length - 1 ? "" : " disabled") + ">Next case →</button></div>";
      }
      cout.addEventListener("click", function (e) {
        var b = e.target.closest("[data-o]"); if (b && !b.disabled) { ans[k] = +b.getAttribute("data-o"); draw(); return; }
        if (e.target.id === "cs_prev" && k > 0) { k--; draw(); }
        if (e.target.id === "cs_next" && k < cs.length - 1) { k++; draw(); }
      });
      draw();
    }
  };

  function toolBlock(l) {
    var t = TOOLS[l.tool], d = typeof t.d === "function" ? t.d(l) : t.d;
    return '<div class="card calc"><p class="muted small" style="margin-bottom:12px">' + d + "</p>" + t.b(l) + '<div id="cout" class="res" aria-live="polite"></div></div>';
  }
  function toolWire(l) {
    var cout = document.getElementById("cout"), t = TOOLS[l.tool];
    if (t.wire) { t.wire(l, cout); return; }
    function run() { try { cout.innerHTML = t.run(l); } catch (e) { cout.innerHTML = err("Something went wrong with that input. Please check the values."); } }
    var card = cout.parentElement, timerT = null;
    card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; clearTimeout(timerT); timerT = setTimeout(run, 180); });
    card.addEventListener("change", function (e) { if (e.target.closest("#cout") || e.target.tagName !== "SELECT") return; run(); });
    card.addEventListener("click", function (e) { if (e.target.closest("[data-run]")) run(); });
    run();
  }
  var BODY = CFG.body || { name: "ICAI", full: "the Institute of Chartered Accountants of India (ICAI)", site: "icai.org", home: "https://www.icai.org/", exam: "CA Foundation" };
  /* ================= STATE ================= */
  var KEY = CFG.key;
  var st;
  function load() { try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { st = {}; } st.done = st.done || {}; st.watch = st.watch || {}; st.qc = st.qc || {}; st.test = st.test || null; st.cert = st.cert || null; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  load();
  function idx(id) { for (var i = 0; i < LESSONS.length; i++) if (LESSONS[i].id === id) return i; return -1; }
  function unlocked(id) { var i = idx(id); return i === 0 || (i > 0 && !!st.done[LESSONS[i - 1].id]); }
  function doneCount() { return LESSONS.filter(function (l) { return st.done[l.id]; }).length; }
  function allDone() { return doneCount() === LESSONS.length; }
  function passed() { return !!(st.test && st.test.passed); }
  function nextLesson() { for (var i = 0; i < LESSONS.length; i++) if (!st.done[LESSONS[i].id]) return LESSONS[i]; return null; }

  var app = document.getElementById("app");
  var timer = null;
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  /* ================= VIEWS ================= */
  function lessonList(m) {
    return '<ul class="lessons">' + LESSONS.filter(function (l) { return l.mod === m; }).map(function (l) {
      var d = st.done[l.id], u = unlocked(l.id);
      var badge = '<span class="st ' + (d ? "done" : (u ? "" : "lock")) + '">' + (d ? "✓" : (u ? l.id : "🔒")) + "</span>";
      if (!u) return '<li><span class="lk" title="Complete the previous lesson to unlock">' + badge + "Lesson " + l.id + " · " + l.title + "<em>Locked</em></span></li>";
      return '<li><a href="#/lesson/' + l.id + '">' + badge + "Lesson " + l.id + " · " + l.title + "<em>" + (d ? "Completed" : l.time) + "</em></a></li>";
    }).join("") + "</ul>";
  }
  function progressRing() {
    var steps = LESSONS.length + 2, got = doneCount() + (passed() ? 1 : 0) + (st.cert ? 1 : 0);
    var p = Math.round(got / steps * 100);
    return '<div class="ring" style="--p:' + p + '%"><span>' + p + "%<small>complete</small></span></div>";
  }
  function viewHome() {
    var nl = nextLesson();
    var cta = nl ? '<a class="btn btn-accent" href="#/lesson/' + nl.id + '">' + (doneCount() ? "Continue: Lesson " + nl.id : "Start the course") + "</a>" :
      (passed() ? '<a class="btn btn-accent" href="#/certificate">Get your certificate</a>' : '<a class="btn btn-accent" href="#/test">Take the final test</a>');
    var h = '<section class="hero"><div><span class="tag">Free course · about ' + CFG.hours + ' hours · ' + LESSONS.length + ' lessons</span><h1 style="margin-top:14px">' + CFG.title + '</h1>' +
      '<p class="lead">' + CFG.lead + '</p>' +
      '<p class="muted" style="margin-top:12px">' + CFG.intro + '</p>' +
      '<p class="small muted" style="margin-top:10px">' + CFG.exam + ' Always confirm the current scheme on <a href="' + BODY.home + '" target="_blank" rel="noopener">' + BODY.site + '</a>.</p>' +
      '<div class="row" style="margin-top:18px">' + cta + '<a class="btn btn-soft" href="#/path">See the course path</a></div></div>' +
      '<div class="card" style="text-align:center">' + progressRing() + '<div class="stack small" style="margin-top:14px;text-align:left">' +
      "<div>📘 Lessons completed: <b>" + doneCount() + " of " + LESSONS.length + "</b></div>" +
      "<div>📝 Final test: <b>" + (st.test ? (st.test.passed ? "Passed (" + st.test.best + "%)" : "Best score " + st.test.best + "%") : (allDone() ? "Unlocked" : "Locked")) + "</b></div>" +
      "<div>🏅 Certificate: <b>" + (st.cert ? "Issued" : (passed() ? "Ready to claim" : "Pass the test to unlock")) + "</b></div></div></div></section>";
    h += '<div class="stack">' + MODULES.map(function (m) {
      var ls = LESSONS.filter(function (l) { return l.mod === m.n; }), d = ls.filter(function (l) { return st.done[l.id]; }).length;
      return '<div class="card mod"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + '</h3><p class="muted small">' + m.sub + '</p><div class="bar" style="margin-top:12px"><i style="width:' + (d / ls.length * 100) + '%"></i></div><p class="small muted" style="margin-top:6px">' + d + " of " + ls.length + " lessons completed</p>" + lessonList(m.n) + "</div>";
    }).join("") + "</div>";
    h += '<div class="card" style="margin-top:18px"><h3>How the course works</h3><div class="grid g3" style="margin-top:12px">' +
      ["<b>1. Learn, one lesson at a time</b><br><span class=\"muted small\">Watch the walkthrough, read the notes and try the interactive tool. Lessons unlock in order.</span>",
        "<b>2. Check yourself</b><br><span class=\"muted small\">Answer two quick questions in each lesson, then mark it complete.</span>",
        "<b>3. Test and certificate</b><br><span class=\"muted small\">Score 70% or more in the " + TEST.length + "-question final test to download your certificate.</span>"].map(function (t) { return "<div>" + t + "</div>"; }).join("") + "</div></div>";
    return h;
  }
  function viewPath() {
    var h = '<h1 style="font-size:clamp(30px,4vw,42px)">Course path</h1><p class="muted" style="margin:8px 0 22px">Lessons unlock one by one. The final test unlocks after all ' + LESSONS.length + ' lessons.</p>';
    MODULES.forEach(function (m) {
      h += '<div class="card mod" style="margin-bottom:16px"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + "</h3>" + lessonList(m.n) +
        (LESSONS.filter(function (l) { return l.mod === m.n; }).every(function (l) { return st.done[l.id]; }) ? '<p style="margin-top:12px"><a href="#/recap/' + m.n + '">Module ' + m.n + " recap →</a></p>" : "") + "</div>";
    });
    h += '<div class="card"><h3>Final test and certificate</h3><p class="muted small" style="margin:6px 0 12px">' + TEST.length + ' questions · pass mark 70%</p>' +
      (allDone() ? '<a class="btn btn-accent" href="#/test">Take the final test</a>' : '<span class="tag grey">🔒 Complete all ' + LESSONS.length + ' lessons to unlock</span>') +
      '</div><p style="margin-top:22px"><button class="btn btn-soft btn-sm" id="reset">Reset my progress</button></p>';
    return h;
  }
  function videoEmbed(url) {
    var yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
    if (yt) return '<div class="vid"><iframe src="https://www.youtube.com/embed/' + yt[1] + '?rel=0" title="Lesson video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    var vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return '<div class="vid"><iframe src="https://player.vimeo.com/video/' + vm[1] + '" title="Lesson video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
    return '<div class="vid"><video id="lvid" controls playsinline preload="metadata" src="' + esc(url) + '"></video></div>';
  }
  function quizBlock(qs, lid) {
    return qs.map(function (q, qi) {
      var ans = st.qc[lid + ":" + qi];
      return '<div class="q" data-q="' + qi + '"><b>' + (qi + 1) + ". " + q.q + '</b><div class="opts">' + q.o.map(function (o, oi) {
        var cls = ans === undefined ? "" : (oi === q.a ? "ok" : (oi === ans ? "bad" : ""));
        return '<button class="opt ' + cls + '" data-o="' + oi + '"' + (ans !== undefined ? " disabled" : "") + '><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + "</span></button>";
      }).join("") + "</div>" + (ans !== undefined ? '<div class="expl">' + (ans === q.a ? "✅ Correct. " : "Not quite. ") + q.e + "</div>" : "") + "</div>";
    }).join("");
  }
  function viewLesson(id) {
    var i = idx(id);
    if (i < 0) return viewNotFound();
    var l = LESSONS[i];
    if (!unlocked(id)) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>Lesson ' + id + " is locked</h2><p class=\"muted\" style=\"margin:10px 0 18px\">Complete Lesson " + LESSONS[i - 1].id + " (" + LESSONS[i - 1].title + ") to unlock it.</p><a class=\"btn btn-accent\" href=\"#/lesson/" + LESSONS[i - 1].id + "\">Go to Lesson " + LESSONS[i - 1].id + "</a></div>";
    var mod = MODULES[l.mod - 1], url = (window[CFG.videos] && window[CFG.videos][id]) || "";
    var h = '<div class="crumb"><a href="#/">Course home</a> › ' + mod.tag + ": " + mod.title + "</div>" +
      '<div class="lhead"><div><span class="tag indigo">Lesson ' + id + " of " + LESSONS.length + " · " + l.time + "</span><h1 style=\"font-size:clamp(30px,4.4vw,46px);margin-top:10px\">" + l.title + "</h1></div>" +
      (st.done[id] ? '<span class="tag mint">✓ Completed</span>' : "") + "</div>";
    h += '<div class="sec"><h3>Teaching video</h3>' +
      (url ? '<div id="vpane">' + videoEmbed(url) + '<p style="margin-top:10px"><label class="small"><input type="checkbox" id="watched"' + (st.watch[id] ? " checked" : "") + "> I have watched this video</label></p></div></div>" +
        '<div class="sec"><h3>Self-paced learning</h3><p class="muted small" style="margin:-4px 0 10px">Go through the steps at your own pace with the arrows below.</p>' : "") +
      '<div id="wpane"><div class="wt" aria-label="Animated walkthrough"><div class="wt-stage" id="wst"></div><div class="wt-cap" id="wcap"></div><div class="wt-ctl"><button id="wprev" aria-label="Previous step">‹</button><button id="wplay" aria-label="Play or pause">❚❚</button><div class="dots" id="wdots"></div><button id="wnext" aria-label="Next step">›</button></div></div></div></div>';
    h += '<div class="sec"><h3>Learning outcomes</h3>' + list(l.outcomes) + "</div>";
    h += '<div class="sec"><h3>Concept notes</h3><div class="stack">' + l.notes + '<div class="formula">' + l.formula + "</div></div></div>";
    h += '<div class="sec"><h3>Worked example</h3><div class="card">' + l.example() + "</div></div>";
    h += '<div class="sec"><div class="card">' + l.extra() + "</div></div>";
    h += '<div class="sec"><h3>Try it yourself</h3>' + toolBlock(l) + "</div>";
    h += '<div class="sec"><h3>When to use it · common mistakes</h3>' + list(l.use) + "</div>";
    h += '<div class="sec"><div class="note">📗 <b>Official study material:</b> this lesson covers the topics of ' + l.ch + ' of the ' + BODY.exam + ' ' + CFG.paper + ' syllabus (' + CFG.edition + '). For the full official text and more practice questions, read ' + BODY.name + '\'s study material on <a href="' + ICAI_URL + '" target="_blank" rel="noopener">' + BODY.site + '</a>.</div></div>';
    h += '<div class="sec"><h3>Quick check</h3><div class="stack" id="qc">' + quizBlock(l.qc, id) + "</div></div>";
    var next = LESSONS[i + 1];
    h += '<div class="sec card" id="donebox"></div>';
    return { html: h, after: function () { lessonWire(l, url, next); } };
  }
  function lessonWire(l, url, next) {
    var id = l.id;
    /* walkthrough */
    var slides = l.walk(), k = 0, playing = !url;
    var stg = document.getElementById("wst"), cap = document.getElementById("wcap"), dots = document.getElementById("wdots"), pb = document.getElementById("wplay");
    function show() {
      stg.innerHTML = '<div class="fade" style="display:grid;gap:14px;justify-items:center;width:100%"><div class="wt-title">' + slides[k].t + "</div>" + slides[k].h + "</div>";
      cap.textContent = slides[k].c;
      dots.innerHTML = slides.map(function (s, j) { return '<i class="' + (j <= k ? "on" : "") + '"></i>'; }).join("");
      if (k === slides.length - 1 && !st.watch[id]) { st.watch[id] = true; save(); updateDone(); }
    }
    function tick() { if (k < slides.length - 1) { k++; show(); } else { setPlay(false); } }
    function setPlay(p) { playing = p; pb.textContent = p ? "❚❚" : "▶"; stopTimer(); if (p) timer = setInterval(tick, 5200); }
    document.getElementById("wprev").onclick = function () { if (k > 0) { k--; show(); } setPlay(false); };
    document.getElementById("wnext").onclick = function () { if (k < slides.length - 1) { k++; show(); } setPlay(false); };
    pb.onclick = function () { if (!playing && k === slides.length - 1) { k = 0; show(); } setPlay(!playing); };
    show(); setPlay(playing);
    /* tabs + video */
    document.querySelectorAll("[data-tab]").forEach(function (b) {
      b.onclick = function () {
        document.querySelectorAll("[data-tab]").forEach(function (x) { x.classList.toggle("on", x === b); });
        var v = b.getAttribute("data-tab") === "v";
        document.getElementById("vpane").style.display = v ? "" : "none";
        document.getElementById("wpane").style.display = v ? "none" : "";
        if (v) setPlay(false); else { k = 0; show(); setPlay(true); }
      };
    });
    var cb = document.getElementById("watched");
    if (cb) cb.onchange = function () { st.watch[id] = cb.checked || st.watch[id]; save(); updateDone(); };
    var lv = document.getElementById("lvid");
    if (lv) lv.addEventListener("ended", function () { st.watch[id] = true; if (cb) cb.checked = true; save(); updateDone(); });
    /* interactive tool */
    toolWire(l);
    /* quick check */
    document.getElementById("qc").addEventListener("click", function (e) {
      var b = e.target.closest(".opt"); if (!b || b.disabled) return;
      var qi = +b.closest(".q").getAttribute("data-q"), oi = +b.getAttribute("data-o");
      st.qc[id + ":" + qi] = oi; save();
      document.getElementById("qc").innerHTML = quizBlock(l.qc, id); updateDone();
    });
    function updateDone() {
      var w = !!st.watch[id], q = l.qc.every(function (q, qi) { return st.qc[id + ":" + qi] !== undefined; });
      var box = document.getElementById("donebox"); if (!box) return;
      var nextHref = next ? (next.mod !== l.mod ? "#/recap/" + l.mod : "#/lesson/" + next.id) : "#/recap/" + MODULES.length;
      var nextLabel = next ? (next.mod !== l.mod ? "Module " + l.mod + " recap →" : "Next: Lesson " + next.id + " →") : "Module " + MODULES.length + " recap →";
      if (st.done[id]) { box.innerHTML = '<div class="row" style="justify-content:space-between"><div><b>✓ Lesson complete.</b> <span class="muted small">Great work.</span></div><a class="btn btn-accent" href="' + nextHref + '">' + nextLabel + "</a></div>"; return; }
      box.innerHTML = "<h3>Finish this lesson</h3><ul class=\"clean\" style=\"margin:8px 0 14px;list-style:none;padding:0\"><li>" + (w ? "✅" : "⬜") + " " + (url ? "Watch the video (or finish the self-paced steps)" : "Finish the animated walkthrough") + "</li><li>" + (q ? "✅" : "⬜") + " Answer both quick-check questions</li></ul>" +
        '<button class="btn btn-accent" id="mark"' + (w && q ? "" : " disabled") + ">Mark lesson complete</button>";
      var mk = document.getElementById("mark");
      if (mk) mk.onclick = function () { st.done[id] = true; save(); updateDone(); };
    }
    updateDone();
  }
  function viewRecap(m) {
    var ls = LESSONS.filter(function (l) { return l.mod === m; }), mod = MODULES[m - 1];
    if (!ls.every(function (l) { return st.done[l.id]; })) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>Finish Module ' + m + ' first</h2><p style="margin-top:14px"><a class="btn btn-accent" href="#/path">Go to the course path</a></p></div>';
    var t = '<table><tr><th>Lesson</th><th>Key idea</th><th>Remember</th></tr>' + ls.map(function (l) { return "<tr><td><b>" + l.id + " " + l.title + "</b></td><td>" + l.recap[0] + "</td><td>" + l.recap[1] + "</td></tr>"; }).join("") + "</table>";
    var nextMod = MODULES[m];
    return '<span class="tag indigo">Module ' + m + ' recap</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + mod.title + '</h1><p class="muted" style="margin:8px 0 18px">The main ideas from each lesson, on one page.</p>' +
      '<div class="card tscroll">' + t + "</div>" +
      '<div class="card" style="margin-top:16px"><h3>Key takeaway</h3><p class="muted" style="margin-top:6px">' + mod.takeaway + "</p></div>" +
      '<p style="margin-top:20px">' + (nextMod ? '<a class="btn btn-accent" href="#/lesson/' + LESSONS.filter(function (l) { return l.mod === nextMod.n; })[0].id + '">Start Module ' + nextMod.n + ": " + nextMod.title + " →</a>" : '<a class="btn btn-sun" href="#/test">Take the final test →</a>') + "</p>";
  }
  /* ---- final test ---- */
  var T = null; /* active attempt */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newAttempt() {
    var order = shuffle(TEST.map(function (q, i) { return i; }));
    T = { qs: order.map(function (qi) { var q = TEST[qi]; var perm = shuffle([0, 1, 2, 3]); return { m: q.m, q: q.q, e: q.e, o: perm.map(function (p) { return q.o[p]; }), a: perm.indexOf(q.a) }; }), ans: {}, cur: 0, done: false };
  }
  function viewTest() {
    if (!allDone()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>The final test is locked</h2><p class="muted" style="margin:10px 0 18px">Complete all ' + LESSONS.length + ' lessons first (' + doneCount() + ' of ' + LESSONS.length + ' done).</p><a class="btn btn-accent" href="#/path">Go to the course path</a></div>';
    if (!T) {
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + CFG.title + ', final test</h1>' +
        '<ul class="clean" style="margin:14px 0 18px"><li>' + TEST.length + ' multiple-choice questions in random order, covering every module ' + CFG.testNote + '</li><li>Answers are revealed only after you submit</li><li>Pass mark: 70% (' + Math.ceil(TEST.length * PASS) + ' of ' + TEST.length + ')</li><li>No negative marking here, unlike the real exam</li><li>You can review your answers and retake the test</li></ul>' +
        (st.test ? '<p class="small muted" style="margin-bottom:14px">Previous best: ' + st.test.best + "% · attempts: " + st.test.attempts + (st.test.passed ? " · passed ✓" : "") + "</p>" : "") +
        '<button class="btn btn-accent" id="tstart">Start the test</button></div>';
    }
    if (T.done) return testResults();
    var q = T.qs[T.cur], answered = Object.keys(T.ans).length;
    return '<div style="max-width:760px;margin:0 auto"><div class="row" style="justify-content:space-between"><span class="tag indigo">Question ' + (T.cur + 1) + " of " + T.qs.length + " · Module " + q.m + '</span><span class="small muted">' + answered + " answered</span></div>" +
      '<div class="bar" style="margin:12px 0 18px"><i style="width:' + ((T.cur + 1) / T.qs.length * 100) + '%"></i></div>' +
      '<div class="q"><b style="font-size:19px">' + q.q + '</b><div class="opts" id="topts">' + q.o.map(function (o, oi) { return '<button class="opt ' + (T.ans[T.cur] === oi ? "sel" : "") + '" data-o="' + oi + '"><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + "</span></button>"; }).join("") + "</div></div>" +
      '<div class="row" style="justify-content:space-between;margin-top:16px"><button class="btn btn-soft" id="tprev"' + (T.cur === 0 ? " disabled" : "") + '>← Previous</button>' +
      (T.cur < T.qs.length - 1 ? '<button class="btn btn-ink" id="tnext">Next →</button>' : '<button class="btn btn-accent" id="tsubmit">Submit test</button>') + "</div>" +
      '<p id="terr" class="err" style="margin-top:10px"></p></div>';
  }
  function testResults() {
    var c = 0, mc = {}, mt = {}; MODULES.forEach(function (m) { mc[m.n] = 0; mt[m.n] = 0; });
    T.qs.forEach(function (q, i) { mt[q.m]++; if (T.ans[i] === q.a) { c++; mc[q.m]++; } });
    var pct = Math.round(c / T.qs.length * 100), ok = c / T.qs.length >= PASS;
    var h = '<div style="max-width:820px;margin:0 auto"><div class="card" style="text-align:center"><div style="font-size:48px">' + (ok ? "🎉" : "📘") + "</div><h1 style=\"font-size:clamp(30px,4vw,42px)\">" + (ok ? "You passed!" : "Not quite yet") + "</h1>" +
      '<p style="font-size:22px;font-weight:800;margin-top:8px">' + c + " / " + T.qs.length + " · " + pct + "%</p>" +
      '<div class="kv" style="justify-content:center;margin-top:10px">' + MODULES.map(function (m) { return "<span>" + m.short + ": " + mc[m.n] + " / " + mt[m.n] + "</span>"; }).join("") + "</div>" +
      '<p class="muted" style="margin-top:10px">' + (ok ? "Excellent work. Your certificate is ready." : "You need 70% to pass. Review the lessons for the module where you scored lower, then try again.") + "</p>" +
      '<div class="row" style="justify-content:center;margin-top:16px">' + (ok ? '<a class="btn btn-sun" href="#/certificate">Get your certificate</a>' : "") + '<button class="btn btn-soft" id="tretake">Retake the test</button></div></div>' +
      '<h2 style="margin:28px 0 12px">Review your answers</h2><div class="stack">' + T.qs.map(function (q, i) {
        return '<div class="q"><b>' + (i + 1) + ". " + q.q + '</b><div class="opts">' + q.o.map(function (o, oi) { var cls = oi === q.a ? "ok" : (T.ans[i] === oi ? "bad" : ""); return '<div class="opt ' + cls + '"><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + (oi === q.a ? " ✓" : (T.ans[i] === oi ? " (your answer)" : "")) + "</span></div>"; }).join("") + '</div><div class="expl">' + q.e + "</div></div>";
      }).join("") + "</div></div>";
    return h;
  }
  function testWire() {
    var s = document.getElementById("tstart"); if (s) s.onclick = function () { newAttempt(); render(); };
    var r = document.getElementById("tretake"); if (r) r.onclick = function () { newAttempt(); render(); };
    var o = document.getElementById("topts");
    if (o) o.onclick = function (e) { var b = e.target.closest(".opt"); if (!b) return; T.ans[T.cur] = +b.getAttribute("data-o"); render(); };
    var p = document.getElementById("tprev"); if (p) p.onclick = function () { T.cur--; render(); };
    var n = document.getElementById("tnext"); if (n) n.onclick = function () { T.cur++; render(); };
    var sb = document.getElementById("tsubmit");
    if (sb) sb.onclick = function () {
      var miss = []; T.qs.forEach(function (q, i) { if (T.ans[i] === undefined) miss.push(i + 1); });
      if (miss.length) { document.getElementById("terr").textContent = "Please answer question" + (miss.length > 1 ? "s " : " ") + miss.join(", ") + " before submitting."; return; }
      T.done = true;
      var c = T.qs.filter(function (q, i) { return T.ans[i] === q.a; }).length, pct = Math.round(c / T.qs.length * 100);
      var prev = st.test || { best: 0, attempts: 0, passed: false };
      st.test = { best: Math.max(prev.best, pct), attempts: prev.attempts + 1, passed: prev.passed || c / T.qs.length >= PASS, last: pct };
      if (c / T.qs.length >= PASS && (!st.test.passScore || pct > st.test.passScore)) st.test.passScore = pct;
      if (prev.passScore && (!st.test.passScore || prev.passScore > st.test.passScore)) st.test.passScore = prev.passScore;
      save(); render(); window.scrollTo(0, 0);
    };
  }
  /* ---- certificate ---- */
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return CFG.certPrefix + "-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all ' + LESSONS.length + ' lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">' + CFG.title + '</h3>' +
      '<p class="muted small" style="margin-top:6px">' + CFG.certSub + '</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
      '<div class="row" style="justify-content:space-between;margin-top:26px;text-align:left"><div class="small"><b>Date:</b> ' + esc(c.date) + "<br><b>Certificate ID:</b> " + esc(c.id) + '</div><div class="small" style="text-align:right;width:220px;max-width:100%">' + SIG_SVG + '<div style="border-top:1px solid #C9CCF7;padding-top:4px;margin-top:2px"><b>Founder</b><br>Intellique Research School</div></div></div></div>' +
      '<div class="row noprint" style="justify-content:center;margin-top:18px"><button class="btn btn-accent" id="cpdf">Download certificate (PDF)</button><button class="btn btn-soft" id="cprint">Print</button></div>' +
      '<p class="small muted noprint" style="text-align:center;margin-top:10px">This is a certificate of completion issued by AIStudyTools, a subsidiary of Intellique Research School Private Limited. It is not an accredited qualification, and it is not issued by or affiliated with ' + BODY.full + '.</p>';
  }
  function certWire() {
    var g = document.getElementById("cgo2");
    if (g) g.onclick = function () {
      var nm = document.getElementById("cn").value.trim().replace(/\s+/g, " "), ins = document.getElementById("ci").value.trim();
      if (nm.length < 2) { document.getElementById("cerr").textContent = "Please enter your full name."; return; }
      var d = new Date();
      st.cert = { name: nm, inst: ins, id: certId(), date: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), score: st.test.passScore || st.test.best };
      save(); render();
    };
    var p = document.getElementById("cprint"); if (p) p.onclick = function () { window.print(); };
    var pdf = document.getElementById("cpdf"); if (pdf) pdf.onclick = makePdf;
  }
var SIG_SVG = '<svg style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 891.858594 196.918767"><g transform="translate(-4.000000,200.919555) scale(0.100000,-0.100000)" fill="#1E3A8A"><path d="M5095 1986 c-367 -97 -821 -442 -791 -600 11 -60 82 -109 252 -176 168 -67 314 -158 314 -196 0 -5 -39 -20 -87 -33 -334 -91 -725 -331 -794 -487 -72 -161 169 -163 496 -4 260 127 445 317 445 457 0 45 -3 43 88 56 7 1 12 7 10 12 -2 6 -27 9 -58 7 -51 -3 -57 -2 -70 23 -32 59 -140 127 -320 201 -196 80 -230 103 -230 157 0 196 743 636 943 558 73 -28 -13 -186 -133 -244 -66 -31 -200 -151 -200 -178 0 -40 40 -23 155 66 334 260 323 472 -20 381z m-213 -1074 c-26 -97 -112 -193 -268 -297 -247 -166 -594 -265 -594 -169 0 135 470 434 820 522 48 13 57 1 42 -56z M7305 2003 c-141 -18 -465 -102 -702 -182 -29 -10 -53 -17 -53 -16 0 2 7 16 15 31 38 73 -2 73 -43 1 -29 -52 -33 -55 -119 -87 -367 -136 -652 -288 -669 -356 -12 -46 19 -63 147 -85 63 -11 121 -22 131 -25 23 -7 32 13 10 25 -10 5 -58 17 -108 26 -152 27 -165 42 -86 100 86 63 613 308 629 292 1 -1 -53 -111 -120 -244 l-121 -241 -56 -17 c-121 -38 -250 -89 -254 -102 -11 -26 24 -24 106 6 110 41 109 41 124 5 12 -29 8 -41 -92 -260 -203 -444 -222 -494 -190 -494 9 0 20 10 25 23 19 50 366 805 373 812 17 18 416 128 439 122 27 -7 57 18 42 34 -16 16 -136 -7 -300 -57 -65 -20 -126 -39 -136 -41 -22 -7 9 61 139 311 l89 170 85 28 c370 125 781 216 805 178 9 -14 35 0 35 20 0 29 -46 36 -145 23z m-1122 -830 c-11 -33 -16 -37 -23 -17 -9 23 -4 34 15 34 9 0 12 -6 8 -17z M2646 1896 c-282 -102 -687 -484 -828 -781 -45 -95 -32 -165 30 -165 30 0 28 18 -4 30 -24 9 -26 14 -21 46 43 264 689 854 936 854 112 0 76 -183 -119 -600 l-72 -155 -116 -58 c-396 -195 -792 -657 -792 -922 0 -53 40 -105 82 -105 175 0 541 441 829 1000 33 63 36 65 94 83 33 11 66 21 74 23 39 12 -9 24 -54 14 -26 -6 -49 -9 -51 -7 -2 2 22 60 55 129 129 272 189 458 177 541 -14 92 -94 118 -220 73z m-175 -955 c-203 -373 -461 -706 -635 -822 -149 -100 -180 9 -67 236 122 244 413 535 677 677 49 26 90 45 92 43 3 -2 -28 -63 -67 -134z M3300 1673 c-77 -86 -175 -240 -252 -394 -69 -140 -129 -213 -206 -253 -38 -20 -42 -20 -42 -1 0 47 -73 34 -102 -18 -7 -13 -28 -46 -46 -73 -24 -36 -32 -58 -30 -84 7 -79 96 -32 153 80 18 35 33 52 51 56 14 4 46 22 71 41 32 25 44 30 38 17 -42 -100 -86 -227 -81 -239 10 -27 23 -17 106 81 45 52 84 94 85 92 2 -2 0 -21 -5 -43 -19 -84 15 -114 80 -71 49 32 48 33 46 -6 -2 -53 38 -50 102 7 l51 46 3 -28 c5 -42 37 -41 87 2 53 43 55 43 34 0 -13 -26 -14 -38 -5 -47 8 -8 29 6 84 57 l73 68 3 -39 c5 -63 34 -74 93 -33 l25 18 -4 -30 c-6 -42 11 -37 81 26 69 63 74 65 83 30 13 -54 70 -68 146 -38 51 20 175 91 184 104 18 31 -20 22 -111 -26 -136 -71 -185 -72 -185 -3 0 53 -43 45 -113 -21 l-28 -26 16 37 c26 65 11 66 -55 4 -25 -24 -57 -49 -69 -56 l-24 -12 7 56 c10 79 -21 77 -113 -8 l-33 -31 21 42 c11 23 21 49 21 58 0 22 -27 19 -40 -5 -15 -28 -133 -125 -137 -113 -2 6 5 34 17 62 24 63 24 61 1 61 -10 0 -24 7 -31 15 -21 25 -38 18 -105 -45 -78 -72 -155 -124 -168 -111 -5 5 0 38 11 79 34 120 -12 115 -123 -12 l-45 -51 41 100 c59 142 76 173 131 235 110 123 293 426 286 474 -5 35 -25 27 -78 -31z m-36 -134 c-47 -81 -153 -239 -160 -239 -8 0 41 83 119 202 77 118 100 138 41 37z m29 -601 c-21 -22 -51 -49 -67 -61 l-29 -21 24 43 c31 57 102 120 107 96 2 -10 -13 -35 -35 -57z m-548 2 c-18 -35 -83 -105 -91 -98 -7 8 20 72 46 108 29 40 67 32 45 -10z M885 1655 c-227 -42 -506 -196 -696 -385 -97 -95 -149 -174 -149 -223 0 -27 28 -57 53 -57 21 0 22 19 2 26 -48 19 5 114 133 236 237 225 615 397 809 369 l43 -6 -116 -220 c-64 -121 -142 -271 -173 -333 l-57 -112 -121 -60 c-310 -152 -496 -328 -439 -414 113 -173 854 183 1102 528 37 52 42 55 82 56 23 0 42 5 42 10 0 6 -9 10 -19 10 -32 0 -52 11 -43 24 25 31 54 136 55 196 2 118 -87 253 -208 316 -29 16 -52 32 -49 35 7 12 -17 22 -28 11 -6 -6 -24 -6 -46 -1 -49 11 -92 10 -177 -6z m296 -83 c161 -103 210 -267 128 -430 l-34 -66 -64 -3 c-75 -4 -211 -34 -330 -74 -46 -16 -86 -27 -88 -25 -2 2 44 93 102 202 58 110 131 250 163 312 31 61 61 112 67 112 6 0 31 -13 56 -28z m41 -569 c-170 -203 -464 -397 -739 -489 -264 -89 -359 -35 -199 113 88 81 378 263 420 263 3 0 -4 -21 -15 -46 -20 -43 -20 -74 -1 -74 5 0 22 32 37 71 16 38 36 74 45 79 41 22 297 101 367 114 132 24 131 24 85 -31z M7514 1215 c-3 -8 -3 -19 1 -25 9 -14 35 6 35 26 0 19 -29 18 -36 -1z M7609 1141 c-16 -17 -29 -40 -29 -54 0 -24 -54 -78 -107 -105 -35 -19 -36 -15 -9 35 19 33 23 49 16 57 -8 8 -15 6 -25 -7 -16 -22 -164 -117 -181 -117 -20 0 -5 36 32 77 19 21 31 31 28 22 -9 -28 14 -31 31 -5 43 65 -8 84 -68 26 -51 -51 -127 -105 -127 -91 0 6 9 33 20 61 31 77 5 79 -72 4 -51 -50 -58 -54 -44 -27 16 32 21 63 10 63 -3 0 -36 -27 -72 -60 -90 -81 -92 -80 -48 23 18 41 14 60 -9 50 -8 -3 -15 0 -15 6 0 26 -45 8 -93 -37 -60 -56 -224 -182 -237 -182 -18 0 12 58 65 125 76 97 79 104 59 112 -9 3 -36 -1 -60 -10 -44 -16 -55 -12 -32 11 9 9 9 15 1 23 -18 18 -62 -15 -69 -51 -4 -19 -64 -90 -180 -214 -96 -102 -174 -188 -174 -191 0 -29 107 70 268 247 93 103 119 126 152 135 l41 10 -26 -31 c-68 -84 -105 -167 -85 -191 20 -24 41 -18 110 34 61 47 65 48 70 28 9 -34 42 -31 91 7 37 30 45 33 48 18 8 -39 40 -33 94 16 30 28 33 26 15 -13 -9 -20 -9 -28 0 -37 9 -9 27 3 77 52 67 67 72 69 55 26 -20 -55 9 -70 66 -35 l34 21 0 -26 c0 -50 47 -42 153 28 l27 18 0 -25 c0 -52 35 -47 116 19 64 53 62 52 69 11 6 -30 1 -38 -75 -114 -90 -90 -103 -125 -47 -131 59 -7 153 82 164 155 7 46 14 56 58 82 l33 19 -5 -33 c-4 -26 -1 -35 15 -44 25 -13 38 -9 122 42 36 22 68 41 72 43 3 2 1 -10 -5 -26 -13 -34 -2 -63 26 -68 18 -4 113 80 122 107 6 19 356 83 558 101 125 12 265 0 283 -25 6 -8 19 -15 28 -15 25 0 16 29 -17 54 -51 38 -335 29 -599 -17 -243 -43 -225 -42 -233 -18 -12 40 -89 29 -105 -14 -8 -22 -191 -135 -218 -135 -18 0 -14 24 11 60 25 38 47 50 47 26 0 -26 18 -18 35 15 37 71 4 96 -56 42 -23 -21 -69 -54 -103 -75 l-61 -37 -14 30 c-14 28 -13 31 16 62 66 69 29 125 -38 58z m29 -31 c-7 -11 -17 -20 -22 -20 -5 0 -1 9 9 20 10 11 20 20 22 20 2 0 -2 -9 -9 -20z m-783 -128 c-71 -66 -82 -60 -25 13 50 65 73 82 79 57 2 -10 -19 -37 -54 -70z m1179 69 c17 -6 14 -12 -24 -52 -49 -50 -63 -40 -29 21 24 43 24 43 53 31z m-460 -192 c-30 -42 -94 -90 -94 -70 0 17 108 126 117 118 3 -4 -7 -26 -23 -48z M1451 1089 c-11 -18 -17 -37 -15 -43 2 -6 -34 -60 -81 -120 -70 -91 -90 -126 -71 -126 2 0 43 50 91 110 49 61 91 110 94 110 3 0 17 3 30 7 21 5 20 2 -14 -46 -99 -137 -61 -218 54 -115 69 62 67 87 -2 34 -92 -69 -94 -43 -8 79 25 36 50 71 54 78 15 25 -3 32 -45 17 -51 -18 -49 -18 -38 10 17 47 -22 50 -49 5z M5106 1026 c-130 -130 -128 -258 2 -141 l52 47 0 -30 c0 -54 26 -52 97 5 l43 34 -6 -29 c-10 -51 13 -46 83 17 73 67 83 72 83 38 0 -35 35 -62 78 -61 62 2 252 105 252 137 0 15 -16 9 -94 -33 -143 -77 -196 -86 -196 -34 0 14 -5 34 -10 45 -12 22 -42 12 -99 -37 -35 -29 -38 -26 -15 17 28 54 9 67 -34 23 -53 -55 -131 -118 -138 -111 -3 3 6 31 20 62 26 57 26 81 1 71 -7 -2 -16 2 -19 10 -11 28 -55 15 -100 -30z m74 -7 c0 -20 -83 -109 -121 -130 -33 -17 2 42 60 102 53 55 61 58 61 28z M1625 850 c-4 -7 -3 -16 3 -22 14 -14 45 -2 40 15 -6 16 -34 21 -43 7z"/></g></svg>';
  function sigPng(cb) { try { var img = new Image(); img.onload = function () { var cv = document.createElement("canvas"); cv.width = 1200; cv.height = Math.round(1200 * 196.92 / 891.86); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); cb(cv.toDataURL("image/png")); }; img.onerror = function () { cb(null); }; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SIG_SVG); } catch (e) { cb(null); } }
  function makePdf() {
    var c = st.cert;
    if (!window.jspdf || !window.jspdf.jsPDF) { alertBox("The PDF tool is still loading or blocked. Please use Print → Save as PDF instead."); return; }
    var doc = new window.jspdf.jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    var W = 297, H = 210;
    doc.setFillColor(250, 250, 255); doc.rect(0, 0, W, H, "F");
    doc.setDrawColor(79, 70, 229); doc.setLineWidth(2.2); doc.rect(10, 10, W - 20, H - 20);
    doc.setLineWidth(0.6); doc.rect(14, 14, W - 28, H - 28);
    doc.setFillColor(79, 70, 229); doc.circle(W / 2 - 4, 30, 5, "F"); doc.setFillColor(251, 191, 36); doc.circle(W / 2, 26.5, 2, "F");
    doc.setTextColor(110, 108, 148); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("AISTUDYTOOLS", W / 2, 44, { align: "center" });
    doc.setTextColor(30, 27, 75); doc.setFontSize(30); doc.text("Certificate of Completion", W / 2, 60, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(74, 72, 120); doc.text("This is to certify that", W / 2, 76, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(28); doc.setTextColor(55, 48, 163); doc.text(c.name, W / 2, 93, { align: "center" });
    doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.5); doc.line(W / 2 - 70, 97, W / 2 + 70, 97);
    var y = 106;
    if (c.inst) { doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(74, 72, 120); doc.text(c.inst, W / 2, y, { align: "center" }); y += 9; }
    doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("has successfully completed the course", W / 2, y + 2, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text(CFG.title, W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text(CFG.certSub.replace(/ · /g, "  |  "), W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited.", W / 2, H - 17, { align: "center" }); doc.text("Not an accredited qualification. Not issued by or affiliated with " + BODY.full + ".", W / 2, H - 13, { align: "center" });
    sigPng(function (png) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 12.4);
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save(CFG.title.replace(/[^A-Za-z0-9]+/g, "-") + "-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="max-width:100%;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option>' + MODULES.map(function (m) { return '<option value="' + m.n + '">Module ' + m.n + ": " + m.title + "</option>"; }).join("") + '</select></div><div class="grid g2" id="gl"></div>';
  }
  function glossWire() {
    var q = document.getElementById("gq"), m = document.getElementById("gm"), out = document.getElementById("gl");
    function draw() {
      var t = q.value.trim().toLowerCase(), mv = m.value;
      var items = GLOSSARY.slice().sort(function (a, b) { return a[0].localeCompare(b[0]); }).filter(function (g) { return (!mv || g[3].charAt(0) === mv) && (!t || (g[0] + " " + g[1]).toLowerCase().indexOf(t) >= 0); });
      out.innerHTML = items.length ? items.map(function (g) {
        var l = LESSONS[idx(g[3])];
        return '<div class="gl-item"><b>' + g[0] + '</b><p class="muted small" style="margin-top:4px">' + g[1] + '</p><p class="small" style="margin-top:6px"><i>Example:</i> ' + g[2] + '</p><p class="small" style="margin-top:6px">Lesson ' + (unlocked(l.id) ? '<a href="#/lesson/' + l.id + '">' + l.id + " · " + l.title + "</a>" : l.id + " · " + l.title + " 🔒") + "</p></div>";
      }).join("") : '<p class="muted">No terms match your search. Try a different word.</p>';
    }
    q.oninput = draw; m.onchange = draw; draw();
  }
  function viewNotFound() { return '<div class="card" style="text-align:center;max-width:600px;margin:30px auto"><h2>Page not found</h2><p style="margin-top:14px"><a class="btn btn-accent" href="#/">Go to course home</a></p></div>'; }

  /* ================= ROUTER ================= */
  function render() {
    stopTimer();
    var hsh = location.hash.replace(/^#\/?/, ""), parts = hsh.split("/"), r = parts[0] || "home", out, after = null;
    if (r === "home") out = viewHome();
    else if (r === "path") out = viewPath();
    else if (r === "lesson") out = viewLesson(parts[1]);
    else if (r === "recap") out = viewRecap(Math.min(Math.max(parseInt(parts[1], 10) || 1, 1), MODULES.length));
    else if (r === "test") { out = viewTest(); after = testWire; }
    else if (r === "certificate") { out = viewCert(); after = certWire; }
    else if (r === "glossary") { out = viewGlossary(); after = glossWire; }
    else out = viewNotFound();
    if (out && typeof out === "object") { after = out.after; out = out.html; }
    app.innerHTML = out;
    if (r === "path") { var rs = document.getElementById("reset"); if (rs) rs.onclick = function () { if (confirm("Reset all your progress, test results and certificate in this browser?")) { localStorage.removeItem(KEY); load(); T = null; render(); } }; }
    if (after) after();
    document.querySelectorAll(".tnav a[data-r]").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-r") === r || (r === "lesson" && a.getAttribute("data-r") === "path")); });
    var titles = { home: CFG.title, path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || CFG.title) + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();
