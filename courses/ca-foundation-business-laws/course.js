/* AIStudyTools CA Foundation course app (shared kit). Original teaching material; not affiliated with or endorsed by ICAI. */
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

  var ICAI_URL = "https://www.icai.org/post/sm-foundation-p2-may2027";
  var CFG = {
    key: "caf_law_progress_v1", title: "CA Foundation: Business Laws", hours: 8, videos: "CAFLAW_VIDEOS", paper: "Paper 2 (Business Laws)", edition: "May 2027 onwards",
    lead: "The Contract Act, the Sale of Goods Act, partnerships, LLPs, companies and negotiable instruments, explained in plain language with case trainers that test how you apply each rule.",
    intro: "For CA Foundation students preparing for Paper 2 and anyone who wants a clear grounding in Indian business law. The course follows the units of the CA Foundation Paper 2 syllabus (May 2027 onwards) in five modules, one lesson per unit. Every lesson has notes, a worked problem in the exam's answer style, an interactive tool and two quick checks, followed by a final test and a certificate.",
    exam: "The exam paper is descriptive (written answers), 100 marks, 3 hours. Answers are expected to state the provision, apply it to the facts and conclude.",
    testNote: "(Paper 2 itself is a written paper; this test checks your concepts)",
    certPrefix: "CAFL", certSub: "Regulatory Framework · Contract Act · Sale of Goods · Partnership & LLP · Companies & NI Act"
  };
  /* answer in the exam's four-step style: provision, facts, application, conclusion */
  function pfac(p, f, a, c) { return tbl(["Step", "Answer"], [["<b>Provision</b>", p], ["<b>Facts</b>", f], ["<b>Application</b>", a], ["<b>Conclusion</b>", c]]); }

  /* Fictional people and firms used throughout: Ravi, Neha, Kabir, Isha, Dev, Patel Traders, Sharma Electronics, Orbit Motors Ltd, Bluebird Cafe. */
  var LESSONS = [
    /* ---------------- MODULE 1: REGULATORY FRAMEWORK AND CONTRACT FORMATION ---------------- */
    {
      id: "1.1", mod: 1, ch: "Chapter 1", title: "The Indian Regulatory Framework", time: "14 min", tool: "sort",
      tcfg: { d: "Which body mainly regulates each activity? Sort each one.", buckets: ["RBI", "SEBI", "MCA", "IRDAI", "ICAI"], items: [
        ["A bank wants to open a new branch abroad", "RBI", "Banks are licensed and supervised by the Reserve Bank of India."],
        ["A company plans an IPO on the stock exchange", "SEBI", "Public issues of securities and listing are regulated by SEBI."],
        ["A private company files its annual return", "MCA", "Company filings under the Companies Act go to the Registrar, under the Ministry of Corporate Affairs."],
        ["An insurer launches a new health policy", "IRDAI", "Insurance products need clearance from the Insurance Regulatory and Development Authority of India."],
        ["A chartered accountant is accused of professional misconduct", "ICAI", "ICAI regulates the profession of chartered accountancy and its disciplinary process."],
        ["A mutual fund changes its investment objective", "SEBI", "Mutual funds are registered with and regulated by SEBI."],
        ["The repo rate is changed to control inflation", "RBI", "Monetary policy is the RBI's job."],
        ["An LLP is incorporated", "MCA", "LLPs are registered with the Registrar under the Ministry of Corporate Affairs."]] },
      outcomes: ["Explain what law is and why business needs it", "Identify the sources of Indian law: the Constitution, legislation, delegated legislation, precedent and custom", "Describe how a Bill becomes an Act", "Name the main regulators of Indian business and what each oversees"],
      notes: `<p><b>Law</b> is a body of rules, made or recognised by the State and enforced by it, that governs how people and organisations behave. Business law gives commerce predictability: people can make promises, lend money, form firms and companies and settle disputes, knowing that the rules will be applied the same way to everyone.</p>
<p style="margin-top:10px">The main <b>sources</b> of Indian law are: the <b>Constitution of India</b> (the supreme law; every other law must be consistent with it); <b>legislation</b> made by Parliament and the State Legislatures within the subjects given to them in the Union, State and Concurrent Lists; <b>delegated (subordinate) legislation</b>, such as rules, regulations and notifications made by the government or regulators under the power given by an Act; <b>judicial precedent</b>, because the law declared by the Supreme Court binds all courts in India (Article 141) and High Court decisions bind courts below them; and <b>custom</b>, which is recognised where it is ancient, certain, reasonable and not against statute.</p>
<p style="margin-top:10px">A central law starts as a <b>Bill</b> introduced in either House of Parliament (a Money Bill only in the Lok Sabha). It goes through readings, may be examined by a committee, is passed by both Houses and becomes an <b>Act</b> when the President gives assent. The Act often comes into force on a date notified later, and the detail is filled in by <b>rules</b>.</p>
<p style="margin-top:10px">The <b>executive</b> implements laws through ministries and <b>regulators</b>: the <b>RBI</b> (banking, money and foreign exchange), <b>SEBI</b> (securities markets), the <b>Ministry of Corporate Affairs</b> with the Registrar of Companies (companies and LLPs), <b>IRDAI</b> (insurance), <b>PFRDA</b> (pensions) and professional bodies such as <b>ICAI</b>. The <b>judiciary</b> (Supreme Court, High Courts, subordinate courts) and tribunals such as the <b>NCLT</b> and <b>NCLAT</b> settle disputes and interpret the law.</p>`,
      formula: "Constitution → Acts (Parliament / State Legislatures) → Rules and regulations → Precedent and custom<small>no law may conflict with the Constitution</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Three organs of the State</h4>" + tbl(["Organ", "Role in business law", "Examples"], [["Legislature", "Makes laws", "Parliament passes the Companies Act"], ["Executive", "Implements laws; makes rules under them", "MCA notifies company rules; RBI issues directions"], ["Judiciary", "Interprets laws and settles disputes", "Supreme Court, High Courts, NCLT"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Orbit Motors Ltd (fictional) wants to raise money and expand. Which rules apply?</p>" +
          tbl(["Step", "Law or rule", "Regulator"], [["Hold a board meeting and pass resolutions", "Companies Act, 2013 and its Rules", "MCA / Registrar of Companies"], ["Issue shares to the public and list them", "SEBI Act and SEBI regulations", "SEBI"], ["Borrow from a bank and from a foreign lender", "Banking law; FEMA", "RBI"], ["Sign supply contracts with dealers", "Indian Contract Act, 1872; Sale of Goods Act, 1930", "Courts, if there is a dispute"], ["Get its accounts audited", "Companies Act; auditing standards", "ICAI (for the auditor's conduct)"]]);
      },
      use: ["When reading a problem, first ask: which Act applies, and which section?", "Remember that rules and notifications can change thresholds without changing the Act.", "Mistake: treating a regulator's circular as if it could override the Act it is made under.", "Mistake: forgetting that Supreme Court decisions bind every court in India."],
      walk: function () { return [
        { t: "What law does for business", c: "It makes promises enforceable and disputes predictable.", h: chips(["Contracts", "Firms", "Companies", "Payments"], "ac") },
        { t: "Sources of law", c: "The Constitution sits at the top.", h: chips(["Constitution", "Acts", "Rules", "Precedent", "Custom"], function (x, i) { return i ? "hl" : "ac"; }) },
        { t: "Bill to Act", c: "Both Houses pass it; the President assents.", h: box("Bill → Lok Sabha + Rajya Sabha → President's assent → Act → Rules", "good") },
        { t: "Who regulates what", c: "Each regulator has its own field.", h: chips(["RBI: banks", "SEBI: markets", "MCA: companies", "IRDAI: insurance"], "ac") },
        { t: "Courts and tribunals", c: "They interpret and enforce the law.", h: chips(["Supreme Court", "High Courts", "NCLT / NCLAT"], "mi") }]; },
      recap: ["The Constitution is supreme; Acts, rules, precedent and custom follow", "RBI, SEBI, MCA, IRDAI and ICAI regulate different parts of business"],
      qc: [{ q: "Rules made by the government under the powers given by an Act are called…", o: ["Delegated legislation", "Judicial precedent", "Custom", "Ordinances of the court"], a: 0, e: "Parliament delegates the power to make detailed rules to the executive." },
        { q: "Which body regulates the securities market in India?", o: ["SEBI", "RBI", "IRDAI", "MCA"], a: 0, e: "SEBI regulates issues, listing, intermediaries and mutual funds." }]
    },
    {
      id: "1.2", mod: 1, ch: "Chapter 2, Unit 1", title: "Nature of Contracts", time: "18 min", tool: "contract",
      outcomes: ["Define an agreement and a contract under section 2 of the Contract Act", "List the essentials of a valid contract (section 10)", "Apply the rules of offer, acceptance and communication", "Classify contracts as valid, void, voidable, illegal or unenforceable"],
      notes: `<p>The <b>Indian Contract Act, 1872</b> sets out the general principles of contract (sections 1–75) and the rules for special contracts. A <b>proposal (offer)</b> is made when one person signifies to another his willingness to do or not to do something, with a view to obtaining that person's assent (s.2(a)). When the proposal is accepted it becomes a <b>promise</b> (s.2(b)). Every promise and set of promises forming consideration for each other is an <b>agreement</b> (s.2(e)), and an agreement <b>enforceable by law</b> is a <b>contract</b> (s.2(h)). So every contract is an agreement, but not every agreement is a contract.</p>
<p style="margin-top:10px">By <b>section 10</b>, an agreement is a contract if it is made by the <b>free consent</b> of parties <b>competent to contract</b>, for a <b>lawful consideration</b> and with a <b>lawful object</b>, and is not expressly declared <b>void</b>. Courts also require an <b>intention to create legal relations</b> (social and domestic arrangements usually lack it), <b>certainty</b> of terms (s.29), <b>possibility</b> of performance (s.56) and any <b>formalities</b> the law requires (writing, registration, stamping).</p>
<p style="margin-top:10px"><b>Offer</b>: it may be express or implied, specific or general (to the world at large, accepted by anyone who performs the conditions). An <b>invitation to offer</b> (a price list, a catalogue, goods displayed in a shop, an auction call for bids, a tender notice) is not an offer. A <b>counter-offer</b> rejects the original offer. <b>Acceptance</b> must be absolute and unqualified (s.7), expressed in the usual and reasonable manner, communicated by the offeree, and given while the offer is open. Silence is not acceptance.</p>
<p style="margin-top:10px"><b>Communication</b> (s.4): an offer is complete when it comes to the knowledge of the offeree. An acceptance is complete <b>against the offerer</b> when it is put in the course of transmission to him (posted), and <b>against the acceptor</b> when it comes to the offerer's knowledge. So a proposal can be <b>revoked</b> any time before the acceptance is complete against the offerer, and an acceptance can be revoked any time before it is complete against the acceptor (s.5). An offer also lapses by the end of the stated or a reasonable time, the death or insanity of the offerer known to the acceptor, failure of a condition precedent or a counter-offer (s.6).</p>
<p style="margin-top:10px"><b>Classification by validity</b>: a <b>valid</b> contract has all the essentials. A <b>void agreement</b> is not enforceable at all (s.2(g)). A <b>voidable</b> contract is enforceable at the option of one party only, usually the one whose consent was not free (s.2(i)). A contract can be valid when made and <b>become void</b> later (s.2(j)), for example through impossibility. An <b>illegal</b> agreement is void and also taints the agreements collateral to it. An <b>unenforceable</b> contract is valid but cannot be enforced because of a technical defect, such as lack of stamping.</p>`,
      formula: "Contract = Agreement + Enforceability (s.2(h))<small>s.10: free consent · competent parties · lawful consideration · lawful object · not expressly void</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">When is communication complete? (s.4)</h4>" + tbl(["Communication of", "Complete against the offerer", "Complete against the acceptor"], [["Offer", "When it comes to the offeree's knowledge", "—"], ["Acceptance", "When posted / put in transmission", "When it reaches the offerer"], ["Revocation", "When put in transmission by the person revoking", "When it reaches the other party"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Ravi (Delhi) offers by letter on 1 June to sell his used printer to Neha (Pune) for ₹18,000. Neha posts her acceptance on 4 June; it reaches Ravi on 7 June. On 5 June, Ravi sends an email revoking his offer. Is there a contract?</p>" +
          pfac("Under s.4 and s.5, an acceptance is complete against the offerer when it is posted; a proposal may be revoked only before that moment.", "Neha posted her acceptance on 4 June. Ravi tried to revoke on 5 June.", "The acceptance became complete against Ravi on 4 June, so his revocation came too late. (Neha could still revoke her acceptance until 7 June, when it reached Ravi.)", "A binding contract exists; Ravi's revocation has no effect.");
      },
      use: ["In every problem, test the facts against each essential of s.10 in turn.", "Separate an offer from an invitation to offer before applying the rules of acceptance.", "Mistake: calling a conditional or changed acceptance valid; it is a counter-offer.", "Mistake: mixing up 'void' (no contract at all) and 'voidable' (valid until the aggrieved party avoids it)."],
      walk: function () { return [
        { t: "Offer + acceptance = agreement", c: "Agreement + enforceability = contract.", h: box("Proposal → Acceptance → Promise → Agreement → Contract", "good") },
        { t: "The section 10 checklist", c: "Missing any one, the agreement fails.", h: chips(["Free consent", "Competent parties", "Lawful consideration", "Lawful object", "Not void"], "ac") },
        { t: "Not every display is an offer", c: "Shop displays and price lists invite offers.", h: chips(["Price list → invitation", "Reward notice → general offer"], function (x, i) { return i ? "mi" : "hl"; }) },
        { t: "The postal rule", c: "Acceptance binds the offerer once posted.", h: chips(["Posted 4 June: binds offerer", "Reaches 7 June: binds acceptor"], "ac") },
        { t: "Five outcomes", c: "Know each term exactly.", h: chips(["Valid", "Void", "Voidable", "Illegal", "Unenforceable"], function (x, i) { return i ? "hl" : "mi"; }) }]; },
      recap: ["A contract is an agreement enforceable by law, with all the s.10 essentials", "Acceptance must be absolute; posting completes it against the offerer"],
      qc: [{ q: "A replies to an offer: 'I accept if you reduce the price by ₹500.' This is…", o: ["A counter-offer, which rejects the original offer", "A valid acceptance", "An invitation to offer", "A voidable contract"], a: 0, e: "Acceptance must be absolute and unqualified (s.7); a changed term is a counter-offer." },
        { q: "A contract induced by coercion is…", o: ["Voidable at the option of the coerced party", "Void from the start", "Illegal", "Unenforceable for lack of stamping"], a: 0, e: "By s.19, consent caused by coercion, undue influence, fraud or misrepresentation makes the contract voidable." }]
    },
    {
      id: "1.3", mod: 1, ch: "Chapter 2, Unit 2", title: "Consideration", time: "15 min", tool: "cases",
      tcfg: { d: "Is there valid consideration, or does an exception save the agreement?", cases: [
        { q: "Isha promises to pay Dev ₹5,000 because Dev, on his own, helped her move house last month without being asked.", o: ["Enforceable under s.25(2): a promise to compensate a past voluntary service", "Void: the service was not at her desire", "Void: past consideration is never valid", "Only a moral obligation"], a: 0, e: "The service was not done at Isha's desire, so it is not consideration under s.2(d). But s.25(2) makes a promise to compensate a person who has already voluntarily done something for the promisor enforceable, without consideration." },
        { q: "Kabir signs a registered deed promising his brother ₹2 lakh out of natural love and affection.", o: ["Enforceable under s.25(1)", "Void: no consideration", "Voidable", "Illegal"], a: 0, e: "A written, registered promise made out of natural love and affection between near relatives is enforceable without consideration." },
        { q: "A debtor promises in writing, signed by him, to pay a debt that is already time-barred.", o: ["Enforceable under s.25(3)", "Void: past consideration", "Void: the debt is time-barred", "Only a moral obligation"], a: 0, e: "A written, signed promise to pay a time-barred debt is enforceable." },
        { q: "Neha's aunt promises Patel Traders ₹10,000 if they deliver a fridge to Neha. Patel Traders deliver. Can Patel Traders sue the aunt?", o: ["Yes: consideration may move from the promisee or any other person", "No: Patel Traders gave nothing to the aunt", "No: only Neha can sue", "No: a promise to a third party is void"], a: 0, e: "Under s.2(d), consideration can come from the promisee 'or any other person'. Delivery at the aunt's desire is good consideration." },
        { q: "Ravi agrees to sell a car worth ₹6 lakh for ₹1 lakh. His consent was free.", o: ["Valid: inadequacy of consideration does not make it void", "Void: consideration is inadequate", "Voidable for inadequacy", "Illegal"], a: 0, e: "Explanation 2 to s.25: inadequacy of consideration is no ground to refuse enforcement if consent is free, although it may be evidence that consent was not free." }] },
      outcomes: ["Define consideration under s.2(d)", "State the rules: at the desire of the promisor, past/present/future, need not be adequate, must be real and lawful", "Explain privity of contract and privity of consideration", "Apply the exceptions in s.25 and s.185"],
      notes: `<p><b>Consideration</b> is the price for a promise. By <b>s.2(d)</b>, when, <b>at the desire of the promisor</b>, the promisee <b>or any other person</b> has done or abstained from doing, or does or abstains from doing, or promises to do or abstain from doing something, that act, abstinence or promise is consideration for the promise.</p>
<p style="margin-top:10px">The <b>rules</b> follow from the definition: it must move at the <b>desire of the promisor</b> (a voluntary act is not enough); it may move from the promisee <b>or any other person</b> (Indian law accepts a stranger to consideration); it may be <b>past, present or future</b>; it need <b>not be adequate</b>, but must be <b>real</b> and of some value in the eyes of the law (not illusory, impossible or uncertain); doing what one is already <b>legally bound</b> to do is not consideration; and it must be <b>lawful</b> (s.23).</p>
<p style="margin-top:10px"><b>Privity of contract</b>: only a party to the contract can sue on it, even though consideration may have come from a stranger. Recognised exceptions include a beneficiary under a trust or a charge, a marriage settlement or family arrangement, acknowledgement or estoppel by the promisor, an assignment of contractual rights, and covenants running with land.</p>
<p style="margin-top:10px"><b>An agreement without consideration is void (s.25)</b>, except where it is: (1) in writing, registered, and made out of <b>natural love and affection</b> between parties in a near relation; (2) a promise to <b>compensate</b> a person who has <b>already voluntarily done something</b> for the promisor, or something the promisor was legally compellable to do; or (3) a written, signed promise to pay a <b>time-barred debt</b>. Also, a completed <b>gift</b> needs no consideration, and no consideration is needed to create an <b>agency</b> (s.185). A contract of <b>guarantee</b> is supported by anything done for the principal debtor (s.127).</p>`,
      formula: "No consideration → void (s.25)<small>exceptions: love and affection (written, registered) · past voluntary service · time-barred debt · gifts · agency</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Kinds of consideration</h4>" + tbl(["Kind", "Meaning", "Example"], [["Past", "Act done before the promise, at the promisor's desire", "A asks B to repair his roof; next week promises ₹2,000"], ["Present (executed)", "Act done at the same time as the promise", "Cash paid on delivery"], ["Future (executory)", "A promise to act later", "I will pay you next month for goods delivered now"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Bluebird Cafe's owner promised a regular customer, Dev, ₹3,000 because Dev, a plumber, had fixed a burst pipe at the cafe at the owner's request last week. Later the owner refused to pay. Advise Dev.</p>" +
          pfac("By s.2(d), consideration may be past, provided the act was done at the desire of the promisor.", "Dev repaired the pipe at the owner's request; the promise to pay came after.", "Dev's service is past consideration given at the promisor's desire, so it supports the later promise.", "The promise is enforceable; Dev can recover ₹3,000.");
      },
      use: ["Ask three questions: at whose desire? from whom? of what value?", "When there is no consideration, go straight to the s.25 exceptions.", "Mistake: saying a stranger to consideration cannot sue; in India the real bar is privity of contract.", "Mistake: treating inadequate consideration as no consideration."],
      walk: function () { return [
        { t: "The price of a promise", c: "Something done, given up or promised in return.", h: box("Act · Abstinence · Promise\nat the desire of the promisor", "good") },
        { t: "From anyone", c: "The promisee or any other person.", h: chips(["Promisee ✓", "Stranger ✓"], "mi") },
        { t: "Need not be adequate", c: "But it must be real and lawful.", h: chips(["₹1 lakh for a ₹6 lakh car: valid", "Impossible act: not real"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Privity of contract", c: "Only a party can sue, with some exceptions.", h: chips(["Trust", "Family arrangement", "Assignment", "Estoppel"], "ac") },
        { t: "Section 25 exceptions", c: "No consideration, still enforceable.", h: chips(["Love & affection", "Past voluntary service", "Time-barred debt"], "ac") }]; },
      recap: ["Consideration must move at the promisor's desire, from anyone, and be real and lawful", "Without it the agreement is void unless a s.25 exception applies"],
      qc: [{ q: "Under Indian law, consideration may move from…", o: ["The promisee or any other person", "Only the promisee", "Only the promisor", "Only a party to the contract"], a: 0, e: "s.2(d) expressly includes 'or any other person'." },
        { q: "A written, signed promise to pay a time-barred debt is…", o: ["Enforceable under s.25(3)", "Void for want of consideration", "Voidable", "Illegal"], a: 0, e: "It is one of the three exceptions in s.25." }]
    },
    {
      id: "1.4", mod: 1, ch: "Chapter 2, Unit 3", title: "Other Essential Elements of a Contract", time: "20 min", tool: "cases",
      tcfg: { d: "Identify the defect in each agreement and its effect.", cases: [
        { q: "A 16-year-old borrows ₹50,000 from a lender on a promissory note and does not repay.", o: ["Void: a minor's agreement is void from the beginning", "Voidable at the lender's option", "Valid, but the minor's guardian must pay", "Valid, as the minor got a benefit"], a: 0, e: "A minor's agreement is void ab initio and cannot be ratified on attaining majority (Mohori Bibee v Dharmodas Ghose)." },
        { q: "Kabir threatens to burn Isha's shop unless she sells him her van. She agrees.", o: ["Coercion: voidable at Isha's option", "Undue influence: void", "Fraud: void", "Mistake of fact: void"], a: 0, e: "Committing or threatening an act forbidden by the Indian Penal Code (now the Bharatiya Nyaya Sanhita) to obtain consent is coercion (s.15); the contract is voidable (s.19)." },
        { q: "A spiritual adviser persuades an elderly follower to gift him most of her property for 'salvation'.", o: ["Undue influence: voidable", "Coercion: void", "Misrepresentation", "Valid gift"], a: 0, e: "A person in a position to dominate the will of another uses that position to obtain an unfair advantage (s.16); the contract is voidable." },
        { q: "Both buyer and seller believe a horse is alive, but it died the day before the sale.", o: ["Void: bilateral mistake of fact about an essential matter (s.20)", "Voidable for misrepresentation", "Valid: risk passed", "Void: illegal object"], a: 0, e: "Where both parties are under a mistake of fact essential to the agreement, the agreement is void." },
        { q: "Dev sells his flat promising not to reveal that the roof leaks badly, and actively paints over the damp patches.", o: ["Fraud: voidable, and the buyer may also claim damages", "Mistake of law", "Valid: caveat emptor", "Coercion"], a: 0, e: "Active concealment of a fact is fraud (s.17); the contract is voidable and damages may be claimed." },
        { q: "Ravi agrees with Neha that she will not marry anyone for five years in return for ₹2 lakh.", o: ["Void: agreement in restraint of marriage (s.26)", "Valid: she gets consideration", "Voidable at Neha's option", "Illegal and punishable"], a: 0, e: "Every agreement in restraint of the marriage of any person other than a minor is void." },
        { q: "A shopkeeper sells his business and its goodwill and agrees not to open a similar shop in the same town for three years.", o: ["Valid: the exception for sale of goodwill (s.27) if the limits are reasonable", "Void: restraint of trade", "Voidable", "Illegal"], a: 0, e: "The seller of goodwill may agree not to carry on a similar business within specified local limits, if reasonable." }] },
      outcomes: ["Explain who is competent to contract: minors, persons of unsound mind and those disqualified by law", "Define free consent and its five vitiating factors", "Identify unlawful consideration and object (s.23)", "List the agreements expressly declared void (ss.24–30, 56)"],
      notes: `<p><b>Capacity (ss.11–12)</b>: a person is competent to contract if he has attained <b>majority</b> (18 years, or 21 if a guardian of the person or property has been appointed by a court), is of <b>sound mind</b>, and is <b>not disqualified</b> by law (for example, an alien enemy in wartime or an insolvent in some matters). A <b>minor's agreement is void ab initio</b>; it cannot be ratified on majority, and the rule of estoppel does not apply against a minor. But a minor can be a beneficiary (a promisee), his estate (not the minor personally) is liable for necessaries supplied to him (s.68), and he can be admitted to the benefits of a partnership. A person of unsound mind can contract during a lucid interval (s.12).</p>
<p style="margin-top:10px"><b>Consent</b> means agreeing on the same thing in the same sense (s.13). It is <b>free</b> (s.14) when not caused by: <b>coercion</b> (s.15: committing or threatening an act forbidden by the penal law, or unlawfully detaining property); <b>undue influence</b> (s.16: a person in a position to dominate the will of the other uses it for an unfair advantage, as in fiduciary or real authority relationships); <b>fraud</b> (s.17: a deliberate false statement, active concealment, a promise made without intending to perform, or any act fitted to deceive, done to induce the contract; mere silence is not fraud unless there is a duty to speak, or silence is itself equivalent to speech); <b>misrepresentation</b> (s.18: an innocent false statement believed to be true); or <b>mistake</b>. Contracts induced by the first four are <b>voidable</b> (ss.19, 19A). A <b>bilateral mistake of fact</b> essential to the agreement makes it <b>void</b> (s.20), but a mistake of one party alone does not (s.22), and a mistake of <b>Indian law</b> is no excuse (s.21).</p>
<p style="margin-top:10px"><b>Lawful consideration and object (s.23)</b>: they are unlawful if forbidden by law, of a nature that would defeat any law, fraudulent, involving injury to the person or property of another, or immoral or opposed to public policy. Such agreements are void.</p>
<p style="margin-top:10px"><b>Agreements expressly declared void</b>: where consideration or object is unlawful in part (s.24); without consideration (s.25); in <b>restraint of marriage</b> (s.26); in <b>restraint of trade</b> (s.27, except the reasonable restraint on the seller of goodwill); in <b>restraint of legal proceedings</b> (s.28, except arbitration agreements); <b>uncertain</b> agreements (s.29); <b>wagering</b> agreements (s.30); agreements contingent on <b>impossible events</b> (s.36); and agreements to do <b>impossible acts</b> (s.56).</p>`,
      formula: "Coercion · Undue influence · Fraud · Misrepresentation → voidable<small>bilateral mistake of fact → void · minor's agreement → void ab initio</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Fraud vs misrepresentation</h4>" + tbl(["Basis", "Fraud (s.17)", "Misrepresentation (s.18)"], [["Intention", "Deliberate, to deceive", "Innocent, believed to be true"], ["Remedy", "Rescind and claim damages", "Rescind only (or ask to be put in the promised position)"], ["Defence of 'you could have found out'", "Not available for active fraud", "Available if truth was discoverable with ordinary diligence"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sharma Electronics (fictional) supplied a laptop on credit to a 17-year-old college student who said it was for his studies. The student later refused to pay. Can the firm recover?</p>" +
          pfac("A minor's agreement is void ab initio. Under s.68, a person who supplies necessaries suited to the condition in life of a minor can recover their price from the minor's property, but the minor is not personally liable.", "The buyer is 17; he bought a laptop on credit for his studies.", "The sale agreement is void. If the laptop is a necessary suited to his condition in life (a court decides this on the facts), the firm may recover a reasonable price out of the minor's property; it cannot sue him personally or treat the agreement as a contract.", "The firm cannot enforce the contract; at most it can claim reimbursement from the minor's property if the laptop is a necessary.");
      },
      use: ["Test capacity, then consent, then legality, then the void list, in that order.", "Name the exact vitiating factor; each has its own effect and remedy.", "Mistake: saying a minor's contract is voidable; it is void.", "Mistake: calling mere silence fraud without a duty to speak."],
      walk: function () { return [
        { t: "Who can contract?", c: "Major, of sound mind, not disqualified.", h: chips(["18+", "Sound mind", "Not disqualified"], "ac") },
        { t: "Minor's agreement", c: "Void from the start; cannot be ratified.", h: box("Minor → void ab initio\nNecessaries → paid from his property (s.68)", "good") },
        { t: "Five things that spoil consent", c: "Four make it voidable; mistake may make it void.", h: chips(["Coercion", "Undue influence", "Fraud", "Misrepresentation", "Mistake"], function (x, i) { return i === 4 ? "hl" : "ac"; }) },
        { t: "Unlawful object", c: "Forbidden, fraudulent, harmful or against public policy.", h: chips(["Void (s.23)"], "hl") },
        { t: "Expressly void", c: "Learn the list of sections.", h: chips(["Restraint of marriage", "Restraint of trade", "Wagers", "Uncertain"], "hl") }]; },
      recap: ["Parties must be competent and consent must be free", "Agreements with unlawful objects or on the void list are void"],
      qc: [{ q: "An agreement made under a mistake of fact by both parties, about a matter essential to it, is…", o: ["Void (s.20)", "Voidable", "Valid", "Illegal"], a: 0, e: "A bilateral mistake of fact essential to the agreement makes it void." },
        { q: "A wagering agreement in India is…", o: ["Void (s.30)", "Illegal and punishable everywhere", "Valid if in writing", "Voidable"], a: 0, e: "Wagering agreements are void, though not necessarily illegal, so collateral transactions may stand (outside States where betting is unlawful)." }]
    },

    /* ---------------- MODULE 2: PERFORMANCE, BREACH AND SPECIAL CONTRACTS ---------------- */
    {
      id: "2.1", mod: 2, ch: "Chapter 2, Unit 4", title: "Performance of Contract", time: "18 min", tool: "approp",
      outcomes: ["State the duty to perform and the effect of a valid tender (ss.37–38)", "Decide who must perform and who can demand performance, including joint promises", "Apply the rules on time, place, reciprocal promises and impossibility (ss.46–56)", "Apply the rules of appropriation of payments and discharge by agreement (ss.59–67)"],
      notes: `<p>Parties must <b>perform</b> or offer to perform their promises unless performance is dispensed with or excused by law (s.37). The obligation passes to the promisor's <b>legal representatives</b> on his death, unless the contract was personal (to paint a portrait, to sing). An <b>offer to perform (tender)</b> that is unconditional, made at a proper time and place, of the whole obligation, and gives a reasonable opportunity to inspect, discharges the promisor from liability for non-performance if it is refused (s.38); a tender of money must be of the exact amount in legal tender. If a party <b>refuses</b> or disables himself from performing in full, the other may end the contract (s.39, anticipatory breach).</p>
<p style="margin-top:10px"><b>Who must perform</b>: the promisor himself if the contract is personal, otherwise he or his agent; a third person may perform and, if the promisee accepts it, cannot then enforce it against the promisor (s.41). <b>Joint promises</b>: all joint promisors must perform together during their lives, and on death their representatives with the survivors (s.42); the promisee may compel <b>any one</b> of them to perform the whole, and that one may claim equal contribution from the others; if one defaults, the others bear his share equally (s.43). Release of one joint promisor does not release the others (s.44).</p>
<p style="margin-top:10px"><b>Time and place</b>: where no time is fixed, within a reasonable time (s.46). <b>Reciprocal promises</b> are performed in the order the contract fixes or the nature of the transaction requires (s.52); if one party prevents the other from performing, the contract is voidable at the option of the party prevented (s.53). Where <b>time is of the essence</b> and the promisor fails, the contract is voidable at the promisee's option; if not of the essence, he may claim compensation only (s.55). An agreement to do an <b>impossible act</b> is void, and a contract that <b>becomes impossible</b> or unlawful after it is made (destruction of the subject matter, death or incapacity in personal contracts, change of law, war) becomes void (s.56, the doctrine of frustration). Commercial hardship or a rise in cost is not impossibility.</p>
<p style="margin-top:10px"><b>Appropriation of payments</b> (debtor owes several debts to one creditor): first, the <b>debtor</b> may direct, expressly or by implication, which debt the payment is for (s.59); if he does not, the <b>creditor</b> may appropriate it to any lawful debt due, <b>even a time-barred one</b> (s.60); if neither does, it is applied to the debts <b>in order of time, whether or not they are time-barred</b>, and debts of equal standing <b>proportionately</b> (s.61). <b>Discharge by agreement</b>: <b>novation</b> (a new contract replaces the old), <b>rescission</b> or <b>alteration</b> (s.62), and <b>remission</b> (accepting less, or extending time, s.63). Where the promisee neglects to give reasonable facilities, the promisor is excused for the resulting delay (s.67).</p>`,
      formula: "Appropriation: debtor (s.59) → creditor, even a time-barred debt (s.60) → order of time (s.61)<small>time of essence missed → voidable; impossibility after contract → void (s.56)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Ways a contract is discharged</h4>" + tbl(["Way", "Example"], [["Performance or valid tender", "Goods delivered and paid for"], ["Agreement (novation, rescission, alteration, remission, waiver)", "Lender accepts ₹90,000 in full settlement of ₹1,00,000"], ["Impossibility (frustration)", "The hall booked for a wedding burns down"], ["Lapse of time", "Suit not filed within the limitation period"], ["Operation of law", "Death in a personal contract; insolvency; merger"], ["Breach", "One party refuses to perform"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kabir owes Patel Traders three debts: ₹20,000 due in 2021 (now time-barred), ₹30,000 due in March 2026 and ₹50,000 due in August 2026. He pays ₹30,000 without saying which debt it is for.</p>" +
          pfac("s.59: the debtor may appropriate. s.60: if he does not, the creditor may apply the payment to any lawful debt due, including a time-barred one. s.61: if neither appropriates, the payment goes to debts in order of time.", "Kabir paid ₹30,000 and gave no direction.", "Patel Traders may choose, for example ₹20,000 to the time-barred debt and ₹10,000 to the March 2026 debt. If they make no choice either, s.61 applies the money in order of time, whether or not a debt is time-barred: ₹20,000 clears the 2021 debt and ₹10,000 goes to the March 2026 debt.", "The creditor may choose; failing that, the 2021 debt is cleared and ₹20,000 remains due on the March 2026 debt.");
      },
      use: ["For several debts, walk the order: debtor, then creditor, then time.", "When something unexpected happens, ask whether performance is truly impossible or only harder.", "Mistake: treating a rise in price or cost as frustration.", "Mistake: forgetting that any one joint promisor can be made to pay the whole."],
      walk: function () { return [
        { t: "Perform or tender", c: "A valid tender that is refused discharges the promisor.", h: chips(["Unconditional", "Proper time and place", "Whole amount", "Chance to inspect"], "ac") },
        { t: "Joint promisors", c: "Any one can be made to pay all.", h: box("Promisee → any one joint promisor\nThat promisor → equal contribution from others", "good") },
        { t: "Time of essence", c: "Missed → voidable; otherwise → compensation.", h: chips(["Of essence: voidable", "Not of essence: compensation"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Frustration (s.56)", c: "Supervening impossibility makes the contract void.", h: chips(["Destruction", "Death (personal)", "Change of law", "War"], "ac") },
        { t: "Appropriation order", c: "Debtor, then creditor, then time.", h: chips(["s.59 debtor", "s.60 creditor", "s.61 order of time"], "ac") }]; },
      recap: ["A valid tender discharges the promisor; any one joint promisor can be sued for all", "Payments are appropriated by the debtor, then the creditor, then in order of time"],
      qc: [{ q: "If neither the debtor nor the creditor appropriates a payment, it is applied…", o: ["To the debts in order of time (s.61)", "To the largest debt first", "Equally to all debts", "To the latest debt first"], a: 0, e: "Section 61: in order of time, whether or not time-barred; debts of equal standing proportionately." },
        { q: "A contract becomes void because the subject matter is destroyed after it is made. This is…", o: ["Supervening impossibility (s.56)", "Anticipatory breach", "Novation", "Remission"], a: 0, e: "A contract that becomes impossible after it is made becomes void." }]
    },
    {
      id: "2.2", mod: 2, ch: "Chapter 2, Unit 5", title: "Breach of Contract and its Remedies", time: "17 min", tool: "damages",
      outcomes: ["Distinguish actual and anticipatory breach", "Apply s.73: ordinary, special and remote damages and the duty to mitigate", "Apply s.74 to penalties and liquidated damages", "Explain rescission, quantum meruit, specific performance and injunction"],
      notes: `<p>A <b>breach</b> happens when a party fails or refuses to perform his promise. An <b>actual breach</b> happens on or during the time of performance. An <b>anticipatory breach</b> happens before the due date, when a party refuses in advance or disables himself (s.39). The other party may then either treat the contract as ended at once and sue, or keep it alive until the due date; if he keeps it alive, he takes the risk of later events (the contract may be frustrated in the meantime) and damages are measured at the due date.</p>
<p style="margin-top:10px"><b>Damages (s.73)</b>: the injured party is entitled to compensation for loss which <b>naturally arose in the usual course</b> of things from the breach (ordinary damages), or which the parties <b>knew, when they made the contract</b>, to be likely to result from the breach (special damages; this is the rule in <i>Hadley v Baxendale</i>). No compensation is given for <b>remote and indirect</b> loss. The injured party must take reasonable steps to <b>mitigate</b> his loss, and the expense of doing so is recoverable. For non-delivery of goods, ordinary damages are usually the <b>market price minus the contract price</b> on the date of breach; for non-acceptance, the contract price minus the market price. Courts may award <b>nominal</b> damages where a right is breached but no real loss is proved; <b>exemplary</b> damages are rare in contract (for example, a bank wrongfully dishonouring a customer's cheque, or breach of a promise to marry).</p>
<p style="margin-top:10px"><b>Penalty and liquidated damages (s.74)</b>: if the contract names a sum to be paid on breach, or contains a penalty clause, the injured party gets <b>reasonable compensation not exceeding the amount named</b>, whether or not actual loss is proved. Indian law does not distinguish sharply between a genuine pre-estimate and a penalty: either way, the named sum is a ceiling.</p>
<p style="margin-top:10px"><b>Other remedies</b>: <b>rescission</b>, ending the contract and being released from obligations, with restitution of benefits received (ss.64, 65, 75: a party who rightly rescinds can also claim damages); <b>quantum meruit</b> ('as much as earned'), a reasonable payment for work done when the contract is discharged by the other party's breach or turns out to be void; <b>specific performance</b>, a court order to perform, under the Specific Relief Act, 1963 (since the 2018 amendment it is a general rule rather than a discretionary remedy, though not available for some contracts such as those of a personal nature); and an <b>injunction</b>, an order not to do something, often used to enforce a negative promise.</p>`,
      formula: "Damages (s.73) = loss arising naturally + loss both parties foresaw − loss that could have been mitigated<small>remote loss: not recoverable · s.74: reasonable compensation up to the named sum</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Kinds of damages</h4>" + tbl(["Kind", "When given"], [["Ordinary", "Loss arising naturally in the usual course of things"], ["Special", "Loss from special circumstances both parties knew of when contracting"], ["Nominal", "Right breached, no real loss proved"], ["Exemplary (punitive)", "Rare in contract: wrongful dishonour of a cheque, breach of promise to marry"], ["Remote", "Not recoverable"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Bluebird Cafe agrees to buy 200 kg of coffee beans from Patel Traders at ₹800 per kg, for delivery on 1 March. Patel Traders fail to deliver. On 1 March the market price is ₹950 per kg. The cafe also loses an extra ₹40,000 of profit on a large catering order that Patel Traders were never told about.</p>" +
          pfac("s.73: ordinary damages for loss arising naturally; special damages only for loss the parties knew of at the time of the contract.", "Contract price ₹800/kg, market price on breach ₹950/kg, 200 kg. The catering order was not disclosed.", "Ordinary damages = (950 − 800) × 200 = ₹30,000. The lost catering profit is a special loss that Patel Traders could not have foreseen, so it is not recoverable.", "The cafe can recover ₹30,000.");
      },
      use: ["For goods, compare contract and market price on the date of breach.", "Ask whether special circumstances were communicated when the contract was made.", "Mistake: claiming every loss that followed the breach; remote loss is excluded.", "Mistake: thinking a penalty clause lets you recover more than the named sum."],
      walk: function () { return [
        { t: "Two kinds of breach", c: "Actual on the due date; anticipatory before it.", h: chips(["Actual", "Anticipatory (s.39)"], "ac") },
        { t: "Ordinary damages", c: "Loss arising naturally.", h: box("Non-delivery: (market − contract price) × quantity\n(950 − 800) × 200 = ₹30,000", "good") },
        { t: "Special damages", c: "Only if foreseen by both when contracting.", h: chips(["Told: recoverable", "Not told: remote"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Mitigate", c: "Take reasonable steps to reduce the loss.", h: chips(["Buy elsewhere", "Resell"], "ac") },
        { t: "Other remedies", c: "Choose what fits the facts.", h: chips(["Rescission", "Quantum meruit", "Specific performance", "Injunction"], "ac") }]; },
      recap: ["Damages cover natural and foreseen losses, not remote ones; the victim must mitigate", "s.74 caps compensation at the named sum"],
      qc: [{ q: "Under s.74, where a contract names a sum payable on breach, the injured party gets…", o: ["Reasonable compensation not exceeding the named sum", "Always the full named sum", "Only proved actual loss, with no ceiling", "Nothing, as penalties are void"], a: 0, e: "The named sum is a ceiling; the court awards reasonable compensation up to it." },
        { q: "A party claims payment for work done before the other party wrongfully ended the contract. This is a claim on…", o: ["Quantum meruit", "Specific performance", "Injunction", "Nominal damages"], a: 0, e: "Quantum meruit means 'as much as earned'." }]
    },
    {
      id: "2.3", mod: 2, ch: "Chapter 2, Unit 6", title: "Contingent and Quasi Contracts", time: "15 min", tool: "sort",
      tcfg: { d: "Which section applies? Sort each situation.", buckets: ["s.68 Necessaries", "s.69 Interested payer", "s.70 Non-gratuitous act", "s.71 Finder", "s.72 Mistake or coercion", "Contingent contract"], items: [
        ["A grocer supplies food to a person of unsound mind who has no one to look after him", "s.68 Necessaries", "The supplier can be reimbursed from the property of the person incapable of contracting."],
        ["A tenant pays the landlord's overdue municipal tax to stop the auction of the building he lives in", "s.69 Interested payer", "A person interested in the payment who pays what another is bound to pay can recover it."],
        ["A trader leaves goods at Isha's shop by mistake; Isha uses them as her own", "s.70 Non-gratuitous act", "Lawfully delivering something not intended gratuitously, which the other enjoys, gives a right to compensation."],
        ["Dev picks up a wallet on the road and keeps it safe while he looks for the owner", "s.71 Finder", "A finder has the responsibilities of a bailee."],
        ["A customer pays a bill twice by mistake", "s.72 Mistake or coercion", "Money paid by mistake must be repaid."],
        ["An insurer agrees to pay ₹5 lakh if the shop is destroyed by fire", "Contingent contract", "Performance depends on a collateral uncertain future event (s.31)."],
        ["Ravi promises to pay Neha ₹10,000 if a particular ship returns safely", "Contingent contract", "Enforceable only when the event happens (s.32)."]] },
      outcomes: ["Define a contingent contract (s.31) and apply the rules in ss.32–36", "Explain why the law creates quasi contracts", "Apply ss.68–72 to recover money or compensation", "Compare contingent contracts with wagering agreements"],
      notes: `<p>A <b>contingent contract</b> is a contract to do or not to do something <b>if some event, collateral to the contract, does or does not happen</b> (s.31). Contracts of insurance, indemnity and guarantee are common examples. The event must be uncertain, collateral (not part of the consideration), and not at the mere will of the promisor.</p>
<p style="margin-top:10px">The <b>rules</b>: a contract contingent on an event <b>happening</b> cannot be enforced until the event happens, and becomes void if the event becomes impossible (s.32). A contract contingent on an event <b>not happening</b> can be enforced when the event becomes impossible (s.33). If the event is the way a person will act at an unspecified time, it becomes impossible when that person does something that makes it impossible within a definite time (s.34). Contracts contingent on an event happening <b>within a fixed time</b> become void if it does not happen within that time; contracts contingent on an event not happening within a fixed time can be enforced when the time expires without it (s.35). Agreements contingent on <b>impossible events</b> are void (s.36).</p>
<p style="margin-top:10px"><b>Quasi contracts</b> ('certain relations resembling those created by contract') are obligations the law imposes, without any agreement, to prevent <b>unjust enrichment</b>. They are: <b>s.68</b>, a person who supplies <b>necessaries</b> to someone incapable of contracting (or to a person he is legally bound to support) can be reimbursed from that person's property; <b>s.69</b>, a person <b>interested</b> in paying money that another is legally bound to pay, who pays it, can recover it; <b>s.70</b>, a person who lawfully does something for another, or delivers something, <b>not intending to do so gratuitously</b>, and the other enjoys the benefit, must be compensated; <b>s.71</b>, a <b>finder</b> of goods belonging to another who takes them into custody has the responsibility of a <b>bailee</b>; and <b>s.72</b>, money paid or anything delivered <b>by mistake or under coercion</b> must be repaid or returned.</p>`,
      formula: "Contingent: uncertain collateral event (s.31) · Quasi: no agreement, the law prevents unjust enrichment (ss.68–72)<small>a wager is void; a contingent contract is valid</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Contingent contract vs wagering agreement</h4>" + tbl(["Basis", "Contingent contract", "Wagering agreement"], [["Validity", "Valid", "Void (s.30)"], ["Interest in the event", "Parties may have a real interest", "Only the bet itself"], ["Reciprocal promises", "Not necessarily", "Always (each wins or loses)"], ["Example", "Insurance", "A bet on a cricket match"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kabir runs a hardware shop. A delivery van mistakenly unloads 20 bags of cement meant for the shop next door. Kabir knows they are not his, but sells them to his customers. Is he liable to the supplier?</p>" +
          pfac("s.70: where a person lawfully delivers something to another, not intending to do so gratuitously, and the other enjoys the benefit, he must pay compensation or return it.", "The cement was delivered by mistake, not as a gift, and Kabir sold it.", "The delivery was lawful and not gratuitous, and Kabir enjoyed the benefit by selling the bags.", "Kabir must pay the supplier for the cement.");
      },
      use: ["For contingent contracts, ask whether the event must happen or not happen, and within what time.", "For quasi contracts, ask: who got the benefit, and was it meant to be free?", "Mistake: calling a contingent contract a wager.", "Mistake: forgetting that under s.68 the incapable person is not personally liable, only his property."],
      walk: function () { return [
        { t: "Contingent contract", c: "Depends on a collateral uncertain event.", h: chips(["Insurance", "Indemnity", "Guarantee"], "ac") },
        { t: "If it must happen…", c: "Enforce only when it happens; void if impossible.", h: box("s.32: happening\ns.33: not happening\ns.35: within a fixed time", "good") },
        { t: "Quasi contracts", c: "No agreement, but the law prevents unjust enrichment.", h: chips(["s.68", "s.69", "s.70", "s.71", "s.72"], "ac") },
        { t: "The finder", c: "Has the duties and rights of a bailee.", h: chips(["Take care", "Find the owner", "May claim expenses"], "mi") },
        { t: "Paid by mistake", c: "Must be repaid.", h: chips(["Double payment → refund"], "mi") }]; },
      recap: ["A contingent contract depends on an uncertain collateral event and follows ss.32–36", "Quasi contracts (ss.68–72) stop unjust enrichment without any agreement"],
      qc: [{ q: "A contract contingent on an event happening becomes void when…", o: ["The event becomes impossible (s.32)", "The promisor changes his mind", "The event is delayed", "One party dies, in every case"], a: 0, e: "It cannot be enforced until the event happens, and is void once the event becomes impossible." },
        { q: "Money paid by mistake must be repaid under…", o: ["s.72", "s.68", "s.31", "s.56"], a: 0, e: "Section 72 covers money paid or things delivered by mistake or under coercion." }]
    },
    {
      id: "2.4", mod: 2, ch: "Chapter 2, Unit 7", title: "Contract of Indemnity and Guarantee", time: "18 min", tool: "surety",
      outcomes: ["Define indemnity (s.124) and the indemnity-holder's rights (s.125)", "Define a guarantee (s.126) and distinguish it from indemnity", "Explain the nature and extent of the surety's liability, including continuing guarantees", "Apply the rules on discharge of the surety and the rights of the surety and co-sureties"],
      notes: `<p>A <b>contract of indemnity</b> is one by which one party promises to save the other from loss caused to him by the conduct of the promisor himself or of any other person (s.124). There are two parties: the <b>indemnifier</b> and the <b>indemnity-holder</b>. The indemnity-holder, acting within the scope of his authority, can recover all <b>damages</b> he is compelled to pay in a suit, all <b>costs</b> of such a suit, and all <b>sums paid under a compromise</b> of it, if the compromise was prudent or authorised (s.125).</p>
<p style="margin-top:10px">A <b>contract of guarantee</b> is a contract to perform the promise, or discharge the liability, of a third person in case of his default (s.126). There are three parties and three contracts: the <b>creditor</b>, the <b>principal debtor</b> and the <b>surety</b>; the principal debtor owes the main liability, and the surety's liability is secondary. A guarantee may be oral or written. Anything done or promised for the benefit of the principal debtor is enough consideration for the surety (s.127). A guarantee obtained by misrepresentation or concealment by the creditor is invalid (ss.142–143), and so is one given on the understanding that a co-surety would join, if he does not (s.144).</p>
<p style="margin-top:10px">The surety's liability is <b>co-extensive</b> with that of the principal debtor unless the contract provides otherwise (s.128); the creditor can sue the surety without first suing the principal debtor. A <b>continuing guarantee</b> extends to a series of transactions (s.129); it can be revoked by the surety by notice as to future transactions (s.130) and is revoked by his death as to future transactions, unless the contract says otherwise (s.131).</p>
<p style="margin-top:10px">The surety is <b>discharged</b> by: a <b>variance</b> in the terms of the contract between the creditor and the principal debtor made without his consent (s.133); the <b>release</b> or discharge of the principal debtor (s.134); a creditor's <b>composition</b> with, promise to give time to, or promise not to sue the principal debtor (s.135, though not by an agreement with a third person, s.136, nor by mere forbearance to sue, s.137); and any act or omission of the creditor that <b>impairs the surety's eventual remedy</b> (s.139). On paying, the surety gets the creditor's rights against the principal debtor (<b>subrogation</b>, s.140), the benefit of every <b>security</b> the creditor held (s.141), and a right to be <b>indemnified</b> by the principal debtor (s.145). <b>Co-sureties</b> contribute <b>equally</b> (s.146); where they are bound in different sums, they contribute equally <b>up to the limit</b> of each one's obligation (s.147).</p>`,
      formula: "Indemnity: 2 parties, primary liability · Guarantee: 3 parties, secondary liability<small>co-sureties: equal shares, each capped at his own limit (ss.146–147)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Indemnity vs guarantee</h4>" + tbl(["Basis", "Indemnity", "Guarantee"], [["Parties", "Two", "Three"], ["Contracts", "One", "Three"], ["Liability", "Primary", "Secondary (on default)"], ["Purpose", "Save from loss", "Secure a debt or performance"], ["Right to sue third party", "Not in his own name, without an assignment", "Subrogation on payment (s.140)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Neha borrows ₹6 lakh from a bank. Ravi, Kabir and Isha guarantee the loan for ₹1 lakh, ₹2 lakh and ₹4 lakh respectively. Neha defaults on ₹4.5 lakh. How much does each surety pay?</p>" +
          pfac("s.147: co-sureties bound in different sums must contribute equally, as far as the limits of their obligations permit.", "Default ₹4.5 lakh; limits ₹1 lakh, ₹2 lakh, ₹4 lakh.", "Equal share = ₹1.5 lakh each, but Ravi's limit is ₹1 lakh. He pays ₹1 lakh; the remaining ₹3.5 lakh is shared equally by Kabir and Isha (₹1.75 lakh each), within their limits.", "Ravi ₹1,00,000; Kabir ₹1,75,000; Isha ₹1,75,000.");
      },
      use: ["Draw the three parties and arrows before answering a guarantee problem.", "For any change in the loan terms, check s.133: did the surety consent?", "Mistake: thinking the creditor must sue the principal debtor first.", "Mistake: splitting a default in the ratio of the surety limits; the rule is equal shares within limits."],
      walk: function () { return [
        { t: "Indemnity", c: "One promises to save the other from loss.", h: chips(["Indemnifier", "Indemnity-holder"], "ac") },
        { t: "Guarantee: three parties", c: "Creditor, principal debtor, surety.", h: box("Creditor ⇄ Principal debtor\n      ↖ Surety (on default)", "good") },
        { t: "Co-extensive liability", c: "The creditor can sue the surety directly.", h: chips(["s.128"], "mi") },
        { t: "Discharge of surety", c: "Changes made behind his back release him.", h: chips(["Variance", "Release of debtor", "Time given", "Impairing remedy"], "hl") },
        { t: "Co-sureties", c: "Equal shares, within each limit.", h: chips(["₹1L", "₹1.75L", "₹1.75L"], "ac") }]; },
      recap: ["Indemnity saves from loss; a guarantee secures a third person's default", "Sureties are discharged by variance, release, time given or impaired remedies; co-sureties share equally within limits"],
      qc: [{ q: "Without the surety's consent, the creditor gives the principal debtor six extra months to pay. The surety is…", o: ["Discharged (s.135)", "Still fully liable", "Liable for half", "Liable only if the debtor dies"], a: 0, e: "A binding promise to give time to the principal debtor, without the surety's consent, discharges the surety." },
        { q: "The number of parties in a contract of guarantee is…", o: ["Three", "Two", "Four", "One"], a: 0, e: "Creditor, principal debtor and surety." }]
    },
    {
      id: "2.5", mod: 2, ch: "Chapter 2, Unit 8", title: "Bailment and Pledge", time: "17 min", tool: "cases",
      tcfg: { d: "Apply the rules of bailment and pledge to each situation.", cases: [
        { q: "Isha leaves her bike at a repair shop. The repairer fixes it and refuses to return it until his bill of ₹2,500 is paid.", o: ["He can: particular lien for services on the goods (s.170)", "He cannot: lien needs a written agreement", "He can sell the bike at once", "He can keep the bike for other unpaid bills too"], a: 0, e: "A bailee who has rendered services involving skill or labour on the goods has a particular lien on them." },
        { q: "A banker holds a customer's securities for one loan and keeps them for another unpaid loan.", o: ["Allowed: bankers have a general lien (s.171)", "Not allowed: only a particular lien exists", "Allowed only with a court order", "Not allowed: securities cannot be bailed"], a: 0, e: "Bankers, factors, wharfingers, High Court attorneys and policy brokers have a general lien for the general balance of account." },
        { q: "A pawnor fails to repay. The pawnee wants to sell the pledged gold.", o: ["He may sell after giving the pawnor reasonable notice (s.176)", "He may sell without notice", "He can only sue; sale is never allowed", "He becomes the owner automatically"], a: 0, e: "On default, the pawnee may sue on the debt and retain the goods, or sell them after reasonable notice." },
        { q: "A mercantile agent in possession of goods with the owner's consent pledges them to a pawnee acting in good faith.", o: ["Valid pledge (s.178)", "Void: only the owner can pledge", "Voidable at the owner's option against the pawnee", "Illegal"], a: 0, e: "A pledge by a mercantile agent acting in the ordinary course of business is as valid as if authorised by the owner, if the pawnee acts in good faith without notice." },
        { q: "A bailee mixes the bailor's rice with his own, without consent, so that it cannot be separated.", o: ["The bailee must compensate the bailor for the loss (s.157)", "The bailor loses all rights", "They own the mixture in proportion, with no compensation", "The bailee becomes owner of all the rice"], a: 0, e: "If goods are mixed without the bailor's consent and cannot be separated, the bailee must compensate the bailor." }] },
      outcomes: ["Define bailment (s.148) and identify its essentials", "State the duties of the bailor and bailee, including the standard of care (s.151)", "Distinguish particular and general lien (ss.170–171) and explain the finder's position", "Define pledge (s.172) and apply the rights of the pawnee and pledges by non-owners"],
      notes: `<p><b>Bailment</b> is the delivery of goods by one person (the <b>bailor</b>) to another (the <b>bailee</b>) for some purpose, on a contract that when the purpose is achieved they shall be <b>returned</b> or otherwise disposed of according to the bailor's directions (s.148). Its essentials: a contract, <b>delivery of possession</b> (actual or constructive), of <b>movable goods</b> (not money), for a purpose, with the <b>same goods returned</b>. A deposit in a bank savings account is not bailment, because the same notes are not returned. Bailments may be gratuitous or for reward.</p>
<p style="margin-top:10px"><b>Duties of the bailor</b>: disclose known <b>faults</b> in the goods (s.150; in a bailment for hire, he is liable even for faults he did not know of) and bear the necessary <b>expenses</b> of a gratuitous bailment (s.158). <b>Duties of the bailee</b>: take as much <b>care</b> as a man of ordinary prudence would of his own goods of the same kind (s.151); he is not liable for loss despite such care, unless the contract says so (s.152); not make <b>unauthorised use</b> (s.154); not <b>mix</b> the goods with his own without consent (ss.155–157); <b>return</b> the goods on time (s.160), being liable for loss after the time even without negligence (s.161); and return any <b>increase or profit</b> (s.163). A bailee can be paid his expenses and has a <b>particular lien</b> for services involving skill or labour on the goods (s.170). <b>General lien</b> (for the general balance of account) is given to <b>bankers, factors, wharfingers, attorneys of a High Court and policy brokers</b> (s.171).</p>
<p style="margin-top:10px">A <b>finder of goods</b> is in the position of a bailee (s.71). He has no right to sue the owner for compensation for trouble, but he may retain the goods until he is paid his lawful expenses and any reward offered (s.168), and may <b>sell</b> them if the owner cannot be found with reasonable diligence, or refuses to pay, and the goods are perishable or the charges reach two-thirds of their value (s.169).</p>
<p style="margin-top:10px"><b>Pledge</b> is the bailment of goods as <b>security for payment of a debt</b> or performance of a promise (s.172); the bailor is the <b>pawnor</b>, the bailee the <b>pawnee</b>. The pawnee may retain the goods for the debt, interest and expenses (s.173), and for extraordinary expenses he may sue but cannot retain for them (s.175). On the pawnor's default, he may <b>sue</b> on the debt and retain the goods as collateral, or <b>sell</b> them after giving <b>reasonable notice</b>; a shortfall remains due from the pawnor and a surplus is paid to him (s.176). The pawnor may redeem before the actual sale (s.177). A valid pledge can be made by a <b>mercantile agent</b> in possession with the owner's consent (s.178), by a person in possession under a <b>voidable contract</b> not yet rescinded (s.178A), and by one with a <b>limited interest</b>, to the extent of that interest (s.179), if the pawnee acts in good faith.</p>`,
      formula: "Bailment = delivery of goods + purpose + return of the same goods<small>pledge = bailment as security for a debt · care: man of ordinary prudence (s.151)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Bailment vs pledge</h4>" + tbl(["Basis", "Bailment", "Pledge"], [["Purpose", "Any purpose (repair, storage, hire)", "Security for a debt"], ["Right to sell", "Generally no (finder: limited right)", "Yes, after reasonable notice on default"], ["Use of goods", "Only as agreed", "No right to use"], ["Parties", "Bailor and bailee", "Pawnor and pawnee"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Dev hands his camera to a friend, Kabir, to keep safely while he travels for a month (no charge). A burglar breaks into Kabir's locked flat and steals the camera along with Kabir's own valuables. Is Kabir liable?</p>" +
          pfac("s.151: a bailee must take as much care of the goods as a man of ordinary prudence would of his own goods. s.152: he is not liable for loss if he took that care, unless there is a special contract.", "A gratuitous bailment; the camera was kept in a locked flat and stolen in a burglary in which Kabir's own goods were also lost.", "Kabir took the care an ordinary prudent person takes of his own goods. The standard is the same for gratuitous and paid bailments.", "Kabir is not liable for the loss.");
      },
      use: ["Check delivery of possession and the return of the same goods before calling it bailment.", "For a lien, ask whether the bailee is a banker, factor, wharfinger, attorney or policy broker (general), or did work on the goods (particular).", "Mistake: letting a pawnee sell without reasonable notice.", "Mistake: giving a lower standard of care for a gratuitous bailment; the Act sets one standard."],
      walk: function () { return [
        { t: "What is bailment?", c: "Goods delivered for a purpose, to be returned.", h: box("Bailor → goods → Bailee\n…purpose done → same goods returned", "good") },
        { t: "Standard of care", c: "A man of ordinary prudence (s.151).", h: chips(["Locked away ✓", "Left in a car overnight ✗"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Lien", c: "Particular for work done; general for five kinds of bailee.", h: chips(["Bankers", "Factors", "Wharfingers", "Attorneys", "Policy brokers"], "ac") },
        { t: "Pledge", c: "Bailment as security for a debt.", h: chips(["Pawnor", "Pawnee"], "ac") },
        { t: "On default", c: "Sue and retain, or sell after reasonable notice.", h: chips(["Notice first", "Shortfall still due", "Surplus returned"], "mi") }]; },
      recap: ["A bailee must take the care of a man of ordinary prudence and return the same goods", "A pawnee may sell pledged goods on default after reasonable notice"],
      qc: [{ q: "Which of these has a general lien under s.171?", o: ["A banker", "A tailor who stitched a suit", "A car repairer", "A gratuitous bailee"], a: 0, e: "Bankers, factors, wharfingers, High Court attorneys and policy brokers." },
        { q: "Bailment applies to…", o: ["Movable goods (not money)", "Land and buildings", "Money in a savings account", "Services only"], a: 0, e: "Only movable goods can be bailed; the same goods must be returned." }]
    },
    {
      id: "2.6", mod: 2, ch: "Chapter 2, Unit 9", title: "Agency", time: "18 min", tool: "cases",
      tcfg: { d: "Decide the legal position in each agency situation.", cases: [
        { q: "Without authority, Ravi buys goods for Neha. Neha later approves the purchase, knowing all the facts.", o: ["Ratification: the act binds Neha as if authorised from the start (s.196)", "Not binding: agency needs prior consent", "Binding only on Ravi", "Void: no consideration for agency"], a: 0, e: "A principal can ratify an act done on his behalf without authority; it relates back to the date of the act." },
        { q: "A principal gives his agent authority to sell goods and recover the price from the buyer, as security for a loan the agent made to him. The principal then tries to revoke the agency.", o: ["He cannot: agency coupled with interest is irrevocable (s.202)", "He can at any time", "He can if he gives one week's notice", "The agency ends on the principal's insanity"], a: 0, e: "Where the agent himself has an interest in the subject matter, the agency cannot be ended to the prejudice of that interest." },
        { q: "The captain of a ship sells perishable cargo at a port in an emergency, as he cannot contact the owner.", o: ["Agency of necessity", "Agency by estoppel", "Sub-agency", "No agency: the sale is void"], a: 0, e: "In an emergency, where the owner cannot be contacted and the act is in good faith and for the owner's benefit, an agency of necessity arises." },
        { q: "Isha allows her clerk to buy supplies on credit from a stationer for years, paying the bills. She then dismisses him without telling the stationer, and he buys more on credit in her name.", o: ["Isha is liable: agency by holding out / estoppel (s.237)", "Isha is not liable: the clerk was dismissed", "Only the clerk is liable", "The stationer must sue the clerk first"], a: 0, e: "A principal who leads third parties to believe someone is his agent is bound until the third party has notice of the termination." },
        { q: "An agent appoints a sub-agent without authority. The sub-agent's negligence causes loss to a third party.", o: ["The agent is responsible to the principal and third parties for the sub-agent's acts (s.193)", "The principal is directly liable to the sub-agent", "The sub-agent is the principal's agent", "No one is liable"], a: 0, e: "A sub-agent appointed without authority is the agent's responsibility; the principal is not represented by him." }] },
      outcomes: ["Define agent and principal (s.182) and the rules on who may appoint and be an agent", "Explain the ways an agency is created, including ratification and estoppel", "State the duties and rights of an agent and the principal's liability to third parties", "Apply the rules on personal liability of agents and termination of agency"],
      notes: `<p>An <b>agent</b> is a person employed to do any act for another, or to represent another in dealings with third persons; the person he represents is the <b>principal</b> (s.182). Any person of the age of majority and sound mind may appoint an agent (s.183), but anyone, even a minor, may be an agent, though a minor agent is not personally liable to his principal (s.184). <b>No consideration</b> is needed to create an agency (s.185).</p>
<p style="margin-top:10px"><b>Creation of agency</b>: <b>express</b> (oral or written, such as a power of attorney); <b>implied</b> from conduct or the relationship (s.187), including a wife's implied authority for necessaries; <b>by estoppel or holding out</b> (s.237), where the principal by his words or conduct leads third parties to believe that someone is his agent; <b>of necessity</b>, in an emergency where it is impossible to contact the principal and the agent acts in good faith for his benefit (s.189); and <b>by ratification</b> (ss.196–200): an act done without authority may be ratified by the person for whom it was done, if he was in existence and competent at the time, ratifies with knowledge of the facts, ratifies the whole act, within a reasonable time, and if the act was one he could lawfully do. Ratification relates back to the time of the act, but cannot injure a third person (s.200).</p>
<p style="margin-top:10px"><b>Sub-agent and substituted agent</b>: a <b>sub-agent</b> is employed by and acts under the control of the original agent (s.191); if properly appointed, the agent is responsible to the principal for him (s.192). A <b>substituted agent</b> is named by the agent, on the principal's express or implied authority, to act for the principal directly (s.194).</p>
<p style="margin-top:10px">The agent's <b>duties</b> include following the principal's directions or the customs of the trade (s.211), acting with reasonable skill and diligence (s.212), rendering accounts (s.213), not dealing on his own account without consent (ss.215–216) and paying over sums received (s.218). His <b>rights</b> include remuneration (s.219), retention and a lien on the principal's property (ss.217, 221) and indemnity for lawful acts (s.222). The principal is bound by the agent's acts <b>within his authority</b> (s.226), including notice given to the agent (s.229), and is liable for the agent's fraud or misrepresentation in the course of business (s.238). An agent is generally <b>not personally liable</b>, but he is where the contract so provides, where he contracts for a foreign principal, an undisclosed principal or one who cannot be sued (s.230), or where he signs a negotiable instrument without making clear he signs as agent.</p>
<p style="margin-top:10px"><b>Termination</b> (s.201): by revocation by the principal, renunciation by the agent, completion of the business, the death or insanity of either, or the insolvency of the principal. An agency where the agent has an <b>interest in the subject matter</b> is irrevocable to the prejudice of that interest (s.202). Revocation after the authority has been partly exercised cannot affect acts already done (s.204). Termination takes effect for the agent when he knows of it, and for third parties when they know of it (s.208).</p>`,
      formula: "Agency: express · implied · estoppel · necessity · ratification<small>agency coupled with interest → irrevocable (s.202)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Sub-agent vs substituted agent</h4>" + tbl(["Basis", "Sub-agent", "Substituted agent"], [["Works under", "The original agent", "The principal directly"], ["Privity with principal", "No", "Yes"], ["Agent's responsibility", "Agent answerable for him", "Agent answerable only for reasonable care in choosing him (s.195)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Orbit Motors Ltd authorises its dealer, Patel Traders, to sell cars at not less than ₹8 lakh each. Patel Traders sell one car for ₹7.5 lakh to a buyer who knows nothing of the limit. Is Orbit Motors bound?</p>" +
          pfac("A principal is bound by acts within the agent's apparent (ostensible) authority, where the third party does not know of private limits on it (ss.226, 237).", "The dealer had authority to sell cars; the price limit was private, and the buyer did not know of it.", "Selling cars was within the dealer's apparent authority. The buyer acted in good faith without notice of the limit.", "Orbit Motors is bound by the sale. It can claim the ₹50,000 shortfall from Patel Traders for breaching its instructions (s.211).");
      },
      use: ["First identify how the agency was created; then check whether the act was within authority.", "For ratification, run through the conditions one by one.", "Mistake: thinking a minor cannot be an agent.", "Mistake: assuming an agent is never personally liable."],
      walk: function () { return [
        { t: "Principal and agent", c: "The agent brings the principal into contracts with third parties.", h: box("Principal → authority → Agent → contract → Third party\nThird party ⇄ Principal (bound)", "good") },
        { t: "Five ways to create an agency", c: "Express, implied, estoppel, necessity, ratification.", h: chips(["Express", "Implied", "Estoppel", "Necessity", "Ratification"], "ac") },
        { t: "Ratification", c: "Approving afterwards, with full knowledge.", h: chips(["Relates back", "Whole act", "Not to injure third parties"], "mi") },
        { t: "When is an agent personally liable?", c: "Foreign, undisclosed or unsuable principal, or by agreement.", h: chips(["s.230"], "hl") },
        { t: "Termination", c: "But coupled with interest → irrevocable.", h: chips(["Revocation", "Renunciation", "Death", "Insanity", "Insolvency"], "ac") }]; },
      recap: ["Agency arises expressly, by implication, estoppel, necessity or ratification; no consideration is needed", "Principals are bound by acts within the agent's authority; agency coupled with interest cannot be revoked"],
      qc: [{ q: "Who may be an agent?", o: ["Any person, even a minor (though he is not liable to the principal)", "Only a major of sound mind", "Only a registered professional", "Only a partner"], a: 0, e: "s.184: as between principal and third parties, any person may become an agent." },
        { q: "Ratification of an act done without authority takes effect…", o: ["From the date of the act (it relates back)", "From the date of ratification only", "Only after court approval", "Only if the third party agrees"], a: 0, e: "Ratified acts have the same effect as if done with authority originally." }]
    },

    /* ---------------- MODULE 3: THE SALE OF GOODS ACT, 1930 ---------------- */
    {
      id: "3.1", mod: 3, ch: "Chapter 3, Unit 1", title: "Formation of the Contract of Sale", time: "16 min", tool: "sort",
      tcfg: { d: "Is each transaction a sale, an agreement to sell, or not a contract of sale at all?", buckets: ["Sale", "Agreement to sell", "Not a contract of sale"], items: [
        ["Isha buys a specific bicycle in a shop, pays and is told she may collect it tomorrow", "Sale", "Specific goods in a deliverable state: property passes when the contract is made, even though delivery is later (s.20)."],
        ["Patel Traders agree to supply 500 kg of rice from next month's harvest", "Agreement to sell", "Future goods: a contract for them is always an agreement to sell (s.6(3))."],
        ["Ravi exchanges his old phone for Kabir's guitar, with no money involved", "Not a contract of sale", "Price must be in money; a pure exchange is barter."],
        ["Dev agrees to buy a car if his bank approves the loan", "Agreement to sell", "The transfer depends on a condition being fulfilled later."],
        ["Neha gives her necklace to her sister as a birthday present", "Not a contract of sale", "A gift has no price."],
        ["A tailor stitches a suit from the customer's own cloth for ₹3,000", "Not a contract of sale", "This is a contract for work and labour; the main object is the service."],
        ["A dealer sells a specific used scooter, the buyer pays in instalments, and the dealer hands it over at once with no conditions", "Sale", "Property in specific goods passes at once; payment by instalments does not change that."]] },
      outcomes: ["Define a contract of sale (s.4) and its essentials", "Distinguish a sale from an agreement to sell, hire purchase, bailment and barter", "Classify goods as existing, future and contingent, and specific, ascertained or unascertained", "Apply the rules on goods that perish (ss.7–8) and on fixing the price (ss.9–10)"],
      notes: `<p>A <b>contract of sale of goods</b> is a contract by which the seller <b>transfers or agrees to transfer the property</b> (ownership) in goods to the buyer for a <b>price</b> (s.4(1)). Where property passes at once, it is a <b>sale</b>; where it is to pass at a future time or on a condition being met, it is an <b>agreement to sell</b>, which becomes a sale when the time passes or the condition is fulfilled (s.4(3)–(4)). The <b>essentials</b> are: two parties (a part-owner can sell to another part-owner), <b>goods</b>, a <b>price in money</b>, a transfer of property, and all the other essentials of a valid contract.</p>
<p style="margin-top:10px"><b>Goods</b> mean every kind of <b>movable property</b> other than actionable claims and money, and include stocks and shares, growing crops, grass and things attached to or forming part of the land that are agreed to be severed before sale (s.2(7)). Goods may be <b>existing</b> (owned or possessed by the seller), <b>future</b> (to be manufactured, produced or acquired after the contract) or <b>contingent</b> (whose acquisition depends on an uncertain event). Existing goods may be <b>specific</b> (identified and agreed on when the contract is made), <b>ascertained</b> (identified after the contract) or <b>unascertained</b> (described only by kind, such as '100 bags of sugar').</p>
<p style="margin-top:10px">A contract of sale may be made in <b>writing</b>, by <b>word of mouth</b>, partly in each, or be <b>implied from conduct</b> (s.5). If <b>specific goods</b> have <b>perished</b> without the seller's knowledge <b>when the contract is made</b>, the contract is <b>void</b> (s.7). If, in an agreement to sell, they perish later without the fault of either party <b>before the risk passes</b> to the buyer, the agreement is <b>avoided</b> (s.8).</p>
<p style="margin-top:10px">The <b>price</b> may be fixed by the contract, left to be fixed in a manner agreed, or determined by the course of dealing; otherwise the buyer pays a <b>reasonable price</b> (s.9). If it is to be fixed by a <b>third party's valuation</b> and he fails to do so, the agreement is avoided, though a buyer who has received goods must pay a reasonable price (s.10). <b>Time of payment</b> is not of the essence unless the contract shows otherwise (s.11).</p>`,
      formula: "Sale: property passes now · Agreement to sell: property passes later or on a condition<small>goods: movable property except actionable claims and money</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Sale vs agreement to sell</h4>" + tbl(["Basis", "Sale", "Agreement to sell"], [["Ownership", "Passes at once", "Passes later or on a condition"], ["Nature", "Executed contract", "Executory contract"], ["Risk", "With the buyer (risk follows property)", "With the seller"], ["If the buyer does not pay", "Seller can sue for the price", "Seller can sue for damages"], ["Resale by the seller", "Buyer gets an action against the seller and may follow the goods", "Seller can resell; buyer claims damages"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">On 10 May, Sharma Electronics agrees to sell a specific refrigerator in its warehouse to Neha for ₹42,000. Unknown to both, a fire had destroyed the warehouse and the fridge on 9 May. Neha has paid an advance of ₹5,000.</p>" +
          pfac("s.7: where specific goods have perished at the time the contract is made, without the seller's knowledge, the contract is void.", "The contract was made on 10 May for a specific fridge destroyed on 9 May; neither party knew.", "The goods had perished before the contract, so there was nothing to sell. A void agreement gives no right to delivery, and the advance must be returned (s.65 of the Contract Act).", "The contract is void; Neha recovers her ₹5,000.");
      },
      use: ["First ask whether the goods are specific or unascertained, and existing or future.", "Then ask when property is meant to pass: that decides sale or agreement to sell.", "Mistake: calling an exchange of goods a sale; there must be a price in money.", "Mistake: confusing s.7 (perished before the contract: void) with s.8 (perished later, before risk passes: avoided)."],
      walk: function () { return [
        { t: "A contract of sale", c: "Transfer of property in goods for a price.", h: box("Seller → property in goods → Buyer\nBuyer → price (money) → Seller", "good") },
        { t: "Sale or agreement to sell?", c: "When does property pass?", h: chips(["Now → sale", "Later → agreement to sell"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Kinds of goods", c: "Existing, future, contingent.", h: chips(["Specific", "Ascertained", "Unascertained", "Future", "Contingent"], "ac") },
        { t: "Goods that perish", c: "Before the contract → void; later, before risk passes → avoided.", h: chips(["s.7 void", "s.8 avoided"], "hl") },
        { t: "The price", c: "Fixed, agreed manner, dealing, or reasonable.", h: chips(["s.9", "s.10 valuation"], "ac") }]; },
      recap: ["A sale transfers property now; an agreement to sell transfers it later or on a condition", "Specific goods perished before the contract make it void (s.7)"],
      qc: [{ q: "A contract for the sale of future goods is…", o: ["Always an agreement to sell", "Always a sale", "Void", "A contingent contract only"], a: 0, e: "Property cannot pass in goods that do not yet exist (s.6(3))." },
        { q: "Which of these is NOT 'goods' under the Act?", o: ["Money", "Shares", "Growing crops", "Grass"], a: 0, e: "Money and actionable claims are excluded from the definition (s.2(7))." }]
    },
    {
      id: "3.2", mod: 3, ch: "Chapter 3, Unit 2", title: "Conditions and Warranties", time: "17 min", tool: "cases",
      tcfg: { d: "Identify the implied term (or exception) that applies and the buyer's remedy.", cases: [
        { q: "Isha buys a 'Kashmiri wool' shawl from a dealer. It turns out to be a cotton-acrylic blend.", o: ["Breach of the implied condition that goods correspond with the description (s.15): she may reject", "Only a breach of warranty: damages only", "Caveat emptor applies: no remedy", "Breach of quiet possession"], a: 0, e: "Where goods are sold by description, there is an implied condition that they match it." },
        { q: "Kabir tells a hardware dealer he needs paint for an outdoor wall exposed to rain. The dealer recommends one; it washes off in the first monsoon.", o: ["Breach of the implied condition of fitness for purpose (s.16(1))", "Caveat emptor: Kabir chose the paint", "Breach of warranty only", "No term is implied in a dealer's sale"], a: 0, e: "The buyer made the purpose known and relied on the seller's skill and judgement in goods the seller deals in." },
        { q: "Dev buys a used car. Two months later, police seize it because it was stolen before it was sold to him.", o: ["Breach of the implied condition as to title (s.14(a)): he can recover the full price", "Caveat emptor: he should have checked", "Breach of warranty: damages only for two months' use", "No remedy as the seller acted in good faith"], a: 0, e: "There is an implied condition that the seller has the right to sell; the buyer gets the whole price back even after some use." },
        { q: "A buyer examines a sample of rice and orders 50 bags. The bags contain rice with stones, a defect not apparent on reasonable examination of the sample.", o: ["Breach of the condition in a sale by sample (s.17)", "Caveat emptor applies", "Only a warranty is broken", "No remedy: he examined the sample"], a: 0, e: "In a sale by sample, the bulk must match the sample, and the goods must be free from defects not apparent on reasonable examination." },
        { q: "A buyer accepts the goods and uses them, then finds they breach a condition. He wants to reject them.", o: ["He can now only treat it as a breach of warranty and claim damages (s.13(2))", "He can still reject at any time", "He has no remedy at all", "The contract becomes void"], a: 0, e: "Once a buyer has accepted goods under a contract that is not severable, a breach of condition can be treated only as a breach of warranty." }] },
      outcomes: ["Distinguish a condition from a warranty (s.12)", "Explain when a condition is treated as a warranty (s.13)", "Apply the implied conditions and warranties (ss.14–17)", "State the rule of caveat emptor and its exceptions"],
      notes: `<p>A stipulation in a contract of sale may be a <b>condition</b> or a <b>warranty</b> (s.12). A <b>condition</b> is a stipulation <b>essential to the main purpose</b> of the contract; its breach gives the buyer the right to <b>treat the contract as repudiated</b> (reject the goods and recover the price) as well as claim damages. A <b>warranty</b> is a stipulation <b>collateral</b> to the main purpose; its breach gives only a right to <b>damages</b>, not to reject. Whether a stipulation is a condition or a warranty depends on the construction of the contract, not on the label the parties give it.</p>
<p style="margin-top:10px">A buyer may <b>waive</b> a condition or elect to treat its breach as a breach of warranty; and where the contract is not severable and the buyer has <b>accepted</b> the goods or part of them, a breach of condition can be treated only as a breach of warranty, unless the contract provides otherwise (s.13).</p>
<p style="margin-top:10px"><b>Implied conditions</b>: as to <b>title</b>, that the seller has a right to sell (s.14(a)); in a sale <b>by description</b>, that goods correspond with the description (s.15); <b>fitness for purpose</b>, where the buyer makes known the particular purpose so as to show that he relies on the seller's skill or judgement, and the goods are of a kind the seller deals in (s.16(1)); <b>merchantable quality</b>, where goods are bought by description from a seller who deals in them, except for defects that an examination the buyer has made ought to have revealed (s.16(2)); conditions implied by <b>usage of trade</b> (s.16(3)); and in a sale <b>by sample</b>, that the bulk corresponds with the sample, the buyer has a reasonable opportunity to compare them, and the goods are free from hidden defects that would make them unmerchantable (s.17). <b>Wholesomeness</b> is implied for food and drink. <b>Implied warranties</b>: <b>quiet possession</b> (s.14(b)), <b>freedom from encumbrances</b> not known to the buyer (s.14(c)), and disclosure of the <b>dangerous nature</b> of goods.</p>
<p style="margin-top:10px"><b>Caveat emptor</b> ('let the buyer beware'): there is no implied condition as to quality or fitness for any particular purpose (s.16). The buyer must examine the goods and use his own judgement. Its <b>exceptions</b> are the implied conditions above: fitness for a disclosed purpose with reliance on the seller, merchantable quality in a sale by description, usage of trade, sale by sample, and consent obtained by <b>fraud</b> or where the seller actively conceals a defect.</p>`,
      formula: "Condition broken → reject + damages · Warranty broken → damages only<small>caveat emptor, subject to ss.14–17 and fraud</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Condition vs warranty</h4>" + tbl(["Basis", "Condition", "Warranty"], [["Importance", "Essential to the main purpose", "Collateral to the main purpose"], ["Remedy on breach", "Reject the goods and claim damages", "Damages only"], ["Can it become the other?", "Yes, treated as a warranty (s.13)", "No"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Bluebird Cafe buys an espresso machine from Sharma Electronics, telling the salesperson it must make 300 cups a day in a busy cafe. The salesperson recommends a home model, which overheats after 50 cups each day.</p>" +
          pfac("s.16(1): where the buyer makes known the particular purpose so as to show he relies on the seller's skill or judgement, and the seller deals in such goods, there is an implied condition that they are reasonably fit for that purpose.", "The cafe disclosed its purpose (300 cups a day) and relied on the seller's recommendation; the seller deals in such machines.", "The machine is not fit for the disclosed purpose, so the implied condition is broken. Caveat emptor does not apply.", "The cafe may reject the machine, recover the price and claim damages.");
      },
      use: ["Name the implied term with its section, then decide: condition or warranty?", "Check for acceptance; it may turn a condition into a warranty.", "Mistake: applying caveat emptor where the buyer relied on the seller's skill.", "Mistake: assuming the parties' label 'warranty' settles the question."],
      walk: function () { return [
        { t: "Condition or warranty?", c: "How central is the term to the deal?", h: chips(["Condition: reject", "Warranty: damages"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Implied conditions", c: "Read into every sale unless excluded.", h: chips(["Title", "Description", "Fitness", "Merchantable", "Sample"], "ac") },
        { t: "Implied warranties", c: "Collateral promises.", h: chips(["Quiet possession", "No encumbrance", "Dangerous goods"], "ac") },
        { t: "Caveat emptor", c: "The buyer must take care…", h: box("…unless he relied on the seller's skill,\nbought by description or sample,\nor was defrauded", "good") },
        { t: "Accepted goods", c: "A condition may become a warranty (s.13).", h: chips(["Accepted → damages only"], "hl") }]; },
      recap: ["A broken condition allows rejection; a broken warranty only damages", "Caveat emptor yields to the implied conditions of ss.14–17 and to fraud"],
      qc: [{ q: "The breach of a warranty gives the buyer the right to…", o: ["Claim damages only", "Reject the goods", "Treat the contract as void ab initio", "Rescind and claim damages"], a: 0, e: "A warranty is collateral; its breach gives a claim for damages, not rejection." },
        { q: "Which is an implied warranty, not a condition?", o: ["Quiet possession", "Right to sell (title)", "Correspondence with description", "Fitness for a disclosed purpose"], a: 0, e: "s.14(b): the buyer shall have and enjoy quiet possession." }]
    },
    {
      id: "3.3", mod: 3, ch: "Chapter 3, Unit 3", title: "Transfer of Ownership and Delivery of Goods", time: "19 min", tool: "passing",
      outcomes: ["Apply the rules on when property passes (ss.18–25)", "Explain why risk follows property (s.26)", "Apply the rule nemo dat quod non habet and its exceptions (ss.27–30)", "State the rules on delivery, including instalments, wrong quantity and delivery to a carrier (ss.31–44)"],
      notes: `<p>Who owns the goods matters because <b>risk</b> follows ownership: unless otherwise agreed, goods remain at the seller's risk until property passes, and after that at the buyer's risk, whether or not delivery has been made (s.26). If delivery is delayed through the fault of either party, the goods are at the risk of the party at fault.</p>
<p style="margin-top:10px"><b>When does property pass?</b> In <b>unascertained goods</b>, no property passes until they are ascertained (s.18). In <b>specific or ascertained goods</b>, it passes when the parties <b>intend</b> it to pass (s.19). Unless a different intention appears: (1) <b>specific goods in a deliverable state</b>, under an unconditional contract: property passes <b>when the contract is made</b>, even if payment or delivery is postponed (s.20); (2) specific goods to be <b>put into a deliverable state</b>: when that is done and the buyer has <b>notice</b> (s.21); (3) specific goods in a deliverable state that the seller must <b>weigh, measure or test</b> to fix the price: when that is done and the buyer has notice (s.22); (4) <b>unascertained or future goods</b> sold by description: when goods of that description in a deliverable state are <b>unconditionally appropriated</b> to the contract by one party with the assent of the other (delivery to a carrier for the buyer, without reserving the right of disposal, is appropriation) (s.23); (5) goods on <b>approval or sale or return</b>: when the buyer signifies approval or acceptance or does any other act <b>adopting</b> the transaction, or retains the goods beyond the fixed time or, if none, a reasonable time without giving notice of rejection (s.24). The seller may <b>reserve the right of disposal</b> until conditions are met, for example by taking the bill of lading to his own order (s.25).</p>
<p style="margin-top:10px"><b>Transfer of title by a non-owner</b>: as a rule, no one can give a better title than he himself has (<b>nemo dat quod non habet</b>, s.27). The <b>exceptions</b> protect buyers in good faith: sale by a <b>mercantile agent</b> in possession with the owner's consent, in the ordinary course of business (proviso to s.27); <b>estoppel</b>, where the owner by his conduct allows the buyer to believe the seller had authority (s.27); sale by one of several <b>joint owners</b> in sole possession with the others' permission (s.28); sale by a person in possession under a <b>voidable contract</b> not yet rescinded (s.29); a <b>seller in possession after sale</b> who sells again to a buyer in good faith (s.30(1)); a <b>buyer in possession</b> with the seller's consent before property passes, who sells to a third person in good faith (s.30(2)); and sales by a finder, pawnee or unpaid seller in the circumstances the law allows.</p>
<p style="margin-top:10px"><b>Delivery</b> is the voluntary transfer of possession (s.2(2)). It may be <b>actual</b> (physically handing over), <b>symbolic</b> (handing over the key or a document of title) or <b>constructive</b> (by acknowledgement, as when a warehouseman holding the goods agrees to hold them for the buyer). The seller must deliver and the buyer accept and pay, and delivery and payment are <b>concurrent conditions</b> unless otherwise agreed (s.32). Apart from contrary agreement: the buyer must apply for delivery (s.35); the place is where the goods are at the time of sale (s.36); delivery must be at a reasonable hour; expenses of putting goods into a deliverable state fall on the seller (s.36(5)). If the <b>wrong quantity</b> is delivered, the buyer may reject a shortfall, reject the excess or the whole, or accept at the contract rate; goods mixed with other goods may be rejected or the correct goods accepted (s.37). A buyer is not bound to accept delivery by <b>instalments</b> unless agreed (s.38). Delivery to a <b>carrier</b> is prima facie delivery to the buyer (s.39). The buyer has a right to a reasonable opportunity to <b>examine</b> (s.41) and is deemed to <b>accept</b> when he intimates acceptance, acts inconsistently with the seller's ownership, or retains the goods beyond a reasonable time (s.42). He need not return rejected goods; it is enough to tell the seller (s.43).</p>`,
      formula: "Risk follows property (s.26) · Specific, deliverable, unconditional → property passes at contract (s.20)<small>nemo dat quod non habet (s.27), with exceptions for good-faith buyers</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Kinds of delivery</h4>" + tbl(["Kind", "Meaning", "Example"], [["Actual", "Physical handing over", "Handing a laptop to the buyer"], ["Symbolic", "Handing over the means of control", "Giving the keys of a godown or a bill of lading"], ["Constructive", "A third person holding the goods agrees to hold them for the buyer", "A warehouse acknowledges the buyer's ownership"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Ravi agrees to buy 'whatever wheat is in bin no. 4' at Patel Traders' warehouse, at ₹2,800 a quintal. The seller must weigh it to find the price. Before weighing, the warehouse is flooded and the wheat is ruined. Who bears the loss?</p>" +
          pfac("s.22: where specific goods in a deliverable state must be weighed by the seller to ascertain the price, property does not pass until this is done and the buyer has notice. s.26: risk follows property.", "The wheat is specific (bin no. 4), but it had not been weighed when it was destroyed.", "Property had not passed to Ravi, so the risk was still with Patel Traders.", "Patel Traders bear the loss; Ravi need not pay.");
      },
      use: ["First classify the goods (specific or unascertained), then pick the rule from ss.20–24.", "Remember that risk follows property, not possession.", "Mistake: thinking property passes only on payment or delivery.", "Mistake: applying nemo dat without checking the good-faith exceptions."],
      walk: function () { return [
        { t: "Why it matters", c: "Risk follows property.", h: chips(["Owner bears the loss"], "ac") },
        { t: "Specific goods", c: "Deliverable + unconditional → property passes now.", h: box("s.20 now · s.21 after made deliverable + notice\ns.22 after weighing/testing + notice", "good") },
        { t: "Unascertained goods", c: "Passes on unconditional appropriation with assent.", h: chips(["s.18", "s.23"], "ac") },
        { t: "Sale or return", c: "Approval, adoption or keeping too long.", h: chips(["s.24"], "mi") },
        { t: "Nemo dat", c: "No better title than the seller had, with exceptions.", h: chips(["Mercantile agent", "Voidable contract", "Seller in possession", "Buyer in possession"], "ac") }]; },
      recap: ["Property passes by intention, with default rules in ss.20–24; risk follows property", "A non-owner gives no title, except to good-faith buyers in the listed cases"],
      qc: [{ q: "In an unconditional contract for specific goods in a deliverable state, property passes…", o: ["When the contract is made (s.20)", "Only on delivery", "Only on payment", "When the buyer uses the goods"], a: 0, e: "Even if payment or delivery is postponed." },
        { q: "Goods are sent on 'sale or return' with no time fixed. The buyer keeps them for an unreasonably long time. Property…", o: ["Passes to the buyer (s.24)", "Stays with the seller forever", "Passes only if he pays", "Is shared"], a: 0, e: "Retaining goods beyond a reasonable time without notice of rejection passes property." }]
    },
    {
      id: "3.4", mod: 3, ch: "Chapter 3, Unit 4", title: "Unpaid Seller", time: "15 min", tool: "cases",
      tcfg: { d: "What right can the unpaid seller use?", cases: [
        { q: "Sharma Electronics sells a TV on cash terms. The buyer has not paid and the TV is still in the shop.", o: ["Lien: retain the TV until paid (s.47)", "Stoppage in transit", "Resale without notice", "No right: property has passed"], a: 0, e: "A seller in possession can keep the goods until the price is paid or tendered, even if property has passed." },
        { q: "Goods are on a truck to the buyer when the seller learns that the buyer has become insolvent.", o: ["Stoppage in transit (s.50)", "Lien", "No right once the goods leave", "Sue the carrier"], a: 0, e: "The seller can resume possession while the goods are in transit, if the buyer is insolvent." },
        { q: "The seller exercises a lien over 200 kg of fresh vegetables; the buyer does not pay.", o: ["Resell, as the goods are perishable (s.54(2))", "Keep them until the buyer pays, however long", "He must return them", "Only sue for the price"], a: 0, e: "Perishable goods may be resold by an unpaid seller who has exercised a lien or stopped them in transit." },
        { q: "The buyer pays with a cheque that is dishonoured.", o: ["The seller is an unpaid seller (s.45(1)(b))", "The seller is paid: a cheque was given", "The seller can only sue the bank", "The contract is void"], a: 0, e: "A seller is unpaid when a negotiable instrument received as conditional payment is dishonoured." },
        { q: "The seller hands the goods to the buyer's agent, then the buyer fails to pay.", o: ["The lien is lost (s.49); the seller can sue for the price", "The lien continues", "He can stop the goods in transit", "He can take the goods back from the buyer's shop"], a: 0, e: "The lien is lost when the buyer or his agent lawfully obtains possession." }] },
      outcomes: ["Define an unpaid seller (s.45)", "Explain the right of lien, how it is lost, and part delivery (ss.47–49)", "Explain stoppage in transit and when transit ends (ss.50–52)", "State the right of resale (s.54) and the rights against the buyer personally (ss.55–61)"],
      notes: `<p>A seller is an <b>unpaid seller</b> when the <b>whole of the price has not been paid or tendered</b>, or when a <b>bill of exchange or other negotiable instrument</b> received as conditional payment has been <b>dishonoured</b> (s.45). The term includes an agent of the seller, such as one who has paid the price himself.</p>
<p style="margin-top:10px"><b>Rights against the goods</b> (even after property has passed): (1) <b>Lien</b>, the right to retain possession until the price is paid or tendered, where the goods were sold without credit terms, the credit period has expired, or the buyer has become insolvent (s.47). After part delivery, the lien remains on the rest unless the part delivery shows an agreement to give up the lien (s.48). The lien is <b>lost</b> when the seller delivers to a <b>carrier</b> for the buyer without reserving the right of disposal, when the buyer or his agent <b>lawfully obtains possession</b>, or by <b>waiver</b>; it is <b>not</b> lost just because the seller has obtained a decree for the price (s.49). (2) <b>Stoppage in transit</b>, where the buyer has become <b>insolvent</b> and the goods are with a carrier: the seller may resume possession while they are in transit (s.50). Transit ends when the buyer or his agent takes delivery, when the carrier acknowledges holding for the buyer after arrival, or when the carrier wrongfully refuses to deliver to the buyer (s.51). The seller stops by taking possession or giving notice to the carrier, and bears the cost of redelivery (s.52). (3) <b>Resale</b>, after lien or stoppage, where the goods are <b>perishable</b>, where he gives the buyer <b>notice</b> of his intention and the buyer does not pay within a reasonable time, or where the right was <b>expressly reserved</b>; he may recover any loss from the buyer, and a buyer from him gets good title (s.54). If he resells without notice, he cannot claim the loss and must pay the original buyer any profit.</p>
<p style="margin-top:10px"><b>Rights against the buyer personally</b>: a <b>suit for the price</b> where property has passed, or where the price is payable on a fixed day regardless of delivery (s.55); <b>damages for non-acceptance</b> (s.56); a suit before the due date for <b>repudiation</b> (s.60, anticipatory breach); and <b>interest</b> and special damages (s.61). The buyer's own remedies against the seller include damages for non-delivery (s.57), specific performance (s.58) and remedies for breach of warranty (s.59). In an <b>auction</b>, the sale is complete when the hammer falls; the seller may bid or employ a bidder only if he has expressly reserved the right, and a reserve price may be notified (s.64).</p>`,
      formula: "Unpaid seller (s.45): lien · stoppage in transit (buyer insolvent) · resale<small>plus suit for price (s.55) and damages for non-acceptance (s.56)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Lien vs stoppage in transit</h4>" + tbl(["Basis", "Lien", "Stoppage in transit"], [["Possession", "Seller still has the goods", "Goods are with a carrier"], ["When available", "Unpaid price, no credit, credit expired, or insolvency", "Only on the buyer's insolvency"], ["Effect", "Retain possession", "Regain possession"], ["Ends", "When possession is given up", "When transit ends"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Patel Traders sell 100 cartons of biscuits to a retailer, Kabir, on 30 days' credit and dispatch them by a transporter. While the goods are on the road, Kabir is declared insolvent. The price is unpaid.</p>" +
          pfac("s.50: when the buyer becomes insolvent, an unpaid seller who has parted with the goods may stop them in transit and resume possession until paid. s.54: perishable goods may then be resold.", "The price is unpaid, the buyer is insolvent and the goods are still with the carrier.", "Patel Traders can give notice to the transporter and take back the cartons. Biscuits are perishable, so they can then resell them and claim any loss from Kabir's estate.", "They may stop the goods in transit and resell them.");
      },
      use: ["Confirm first that the seller is 'unpaid' under s.45.", "Then ask where the goods are: with the seller (lien), with a carrier (stoppage), or with the buyer (only personal remedies).", "Mistake: allowing stoppage in transit when the buyer is merely late in paying, not insolvent.", "Mistake: thinking a decree for the price ends the lien."],
      walk: function () { return [
        { t: "Who is unpaid?", c: "Whole price not paid, or a cheque dishonoured.", h: chips(["s.45"], "ac") },
        { t: "Goods with the seller", c: "Lien: keep them until paid.", h: chips(["Lien (s.47)"], "mi") },
        { t: "Goods on the road", c: "Stoppage in transit, if the buyer is insolvent.", h: chips(["Stoppage (s.50)"], "mi") },
        { t: "Then resell", c: "Perishable, after notice, or right reserved.", h: chips(["Resale (s.54)"], "mi") },
        { t: "Against the buyer", c: "Personal remedies.", h: chips(["Price (s.55)", "Damages (s.56)", "Interest (s.61)"], "ac") }]; },
      recap: ["An unpaid seller has a lien, a right of stoppage in transit on insolvency, and a right of resale", "He can also sue for the price or for damages for non-acceptance"],
      qc: [{ q: "The right of stoppage in transit is available only when the buyer is…", o: ["Insolvent", "Late in paying", "Abroad", "A minor"], a: 0, e: "s.50 requires the buyer's insolvency." },
        { q: "An unpaid seller's lien is lost when…", o: ["The buyer lawfully obtains possession of the goods", "The seller gets a decree for the price", "The price is partly paid", "The goods are perishable"], a: 0, e: "s.49: delivery to the buyer or his agent ends the lien; a decree for the price does not." }]
    },

    /* ---------------- MODULE 4: PARTNERSHIP AND LLP ---------------- */
    {
      id: "4.1", mod: 4, ch: "Chapter 4, Unit 1", title: "General Nature of a Partnership", time: "16 min", tool: "sort",
      tcfg: { d: "Is there a partnership? Sort each arrangement.", buckets: ["Partnership", "Not a partnership"], items: [
        ["Neha and Isha agree to run a bakery together, share profits equally, and each can bind the other", "Partnership", "Agreement, business, profit-sharing and mutual agency are all present."],
        ["Two brothers jointly inherit a house and share the rent", "Not a partnership", "Co-ownership is not a business arrangement, and sharing gross returns does not make a partnership."],
        ["Members of a Hindu Undivided Family carry on the family business", "Not a partnership", "An HUF arises by status, not by agreement (s.5)."],
        ["A lender is paid interest that varies with the borrower's profits", "Not a partnership", "Sharing profits as a lender does not by itself make him a partner (s.6)."],
        ["Ravi and Dev jointly buy a plot of land to resell it at a profit and share the gain", "Partnership", "A particular partnership for a single venture (s.8)."],
        ["A manager is paid a share of profits as salary", "Not a partnership", "Remuneration by a share of profits does not make an employee a partner."],
        ["Three friends pool money to run a coaching centre and agree to share profits, with any one of them able to sign for the others", "Partnership", "All the essentials of s.4 are met."]] },
      outcomes: ["Define partnership (s.4) and identify its essential elements", "Apply the true test of partnership: mutual agency (s.6)", "Distinguish a partnership from co-ownership, an HUF, a company and a club", "Explain partnership at will, particular partnership, partnership by holding out and the position of a minor"],
      notes: `<p>The <b>Indian Partnership Act, 1932</b> defines <b>partnership</b> as the relation between persons who have <b>agreed</b> to <b>share the profits of a business</b> carried on by <b>all or any of them acting for all</b> (s.4). The persons are individually <b>partners</b> and collectively a <b>firm</b>, and the name under which they carry on business is the <b>firm name</b>. The five <b>essentials</b> are: an <b>association of two or more persons</b>; an <b>agreement</b> (oral or written; a partnership arises from contract, not from status, s.5); a <b>business</b> (any trade, occupation or profession, s.2(b)); <b>sharing of profits</b>; and <b>mutual agency</b>, meaning the business is carried on by all or any of them acting for all.</p>
<p style="margin-top:10px">Mutual agency is the <b>true test</b>: each partner is both an agent of the firm and of the others, and a principal bound by what the others do in the course of business. In deciding whether a partnership exists, regard is had to the <b>real relation</b> between the parties as shown by all the facts (s.6). Sharing profits or gross returns from property owned jointly does not by itself make persons partners, nor does receiving a share of profits as a lender, a servant, the widow or child of a deceased partner, or the seller of goodwill.</p>
<p style="margin-top:10px">A firm is <b>not a separate legal person</b> from its partners. The maximum number of partners is limited to <b>50</b> by the Companies (Miscellaneous) Rules, 2014, made under s.464 of the Companies Act, 2013. A <b>partnership at will</b> has no fixed term and can be dissolved by notice (s.7); a <b>particular partnership</b> is for a single venture or a fixed period (s.8). <b>Partnership by holding out</b> (s.28): a person who by words or conduct represents himself, or knowingly allows himself to be represented, as a partner is liable as a partner to anyone who gave credit to the firm on the faith of that representation.</p>
<p style="margin-top:10px">A <b>minor</b> cannot be a partner but may, with the consent of all partners, be <b>admitted to the benefits</b> of a partnership (s.30). He shares in the property and profits as agreed and may inspect the accounts; his share is liable for the firm's acts, but he is <b>not personally liable</b>. Within <b>six months</b> of attaining majority, or of learning that he was admitted to the benefits, whichever is later, he must give <b>public notice</b> whether he elects to become a partner. If he gives no notice, he becomes a partner on the expiry of the six months, and is then personally liable for all acts of the firm since he was first admitted to the benefits.</p>`,
      formula: "Partnership = agreement + business + profit-sharing + mutual agency<small>mutual agency is the true test (s.6) · maximum 50 partners</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Partnership vs co-ownership vs HUF</h4>" + tbl(["Basis", "Partnership", "Co-ownership", "HUF business"], [["Arises from", "Agreement", "Agreement or operation of law (inheritance)", "Status (birth)"], ["Business needed?", "Yes", "Not necessarily", "Yes"], ["Mutual agency", "Yes", "No", "The Karta manages; no mutual agency"], ["Transfer of interest", "Only with others' consent", "Freely", "Not by members individually"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kabir lends ₹5 lakh to Bluebird Cafe. Instead of fixed interest, he receives 10% of the cafe's annual profit. He has no say in running the cafe. A supplier, unpaid, sues Kabir as a partner.</p>" +
          pfac("s.4 requires mutual agency; s.6 says receiving a share of profits as a lender does not by itself make a person a partner.", "Kabir receives a share of profits in return for a loan; he takes no part in the business and cannot bind it.", "There is profit-sharing but no agreement to carry on business together and no mutual agency. Unless he held himself out as a partner (s.28), he is a lender.", "Kabir is not a partner and is not liable to the supplier.");
      },
      use: ["Tick off the five essentials, then confirm mutual agency.", "For a minor, track the six-month election period carefully.", "Mistake: treating profit-sharing alone as proof of partnership.", "Mistake: calling a firm a legal person separate from its partners."],
      walk: function () { return [
        { t: "The definition", c: "Share the profits of a business carried on by all or any acting for all.", h: chips(["Agreement", "Business", "Profit-sharing", "Mutual agency"], "ac") },
        { t: "The true test", c: "Mutual agency.", h: box("Each partner: agent of the others\nand principal bound by them", "good") },
        { t: "Not partnerships", c: "Profit-sharing alone is not enough.", h: chips(["Co-owners", "HUF", "Lender", "Employee"], "hl") },
        { t: "Holding out", c: "Liable if you let people believe you are a partner.", h: chips(["s.28"], "mi") },
        { t: "A minor", c: "Admitted to benefits; elects within six months of majority.", h: chips(["s.30"], "ac") }]; },
      recap: ["Partnership needs agreement, business, profit-sharing and mutual agency; mutual agency is the true test", "A minor can be admitted to benefits only, and must elect within six months of majority"],
      qc: [{ q: "The true test of a partnership is…", o: ["Mutual agency", "Sharing of profits", "Registration", "Contribution of capital"], a: 0, e: "Profit-sharing alone is not conclusive; mutual agency is the test (s.6)." },
        { q: "A minor admitted to the benefits of partnership who gives no public notice within six months of majority…", o: ["Becomes a partner, liable from the date of his admission to benefits", "Ceases to be connected with the firm", "Becomes a partner only for future acts", "Is liable only to the extent of his share"], a: 0, e: "s.30(5) and (7)(a)." }]
    },
    {
      id: "4.2", mod: 4, ch: "Chapter 4, Unit 2", title: "Relations of Partners", time: "17 min", tool: "cases",
      tcfg: { d: "Apply the Partnership Act to each question between partners or with third parties.", cases: [
        { q: "The deed is silent. Neha contributed ₹4 lakh capital and Isha ₹1 lakh. How are profits shared?", o: ["Equally (s.13(b))", "4 : 1, in the capital ratio", "Only after 6% interest on capital", "As the majority decides"], a: 0, e: "In the absence of agreement, partners share profits and losses equally." },
        { q: "With no agreement on the point, Dev advanced ₹1 lakh to the firm beyond his capital. What interest is he entitled to?", o: ["6% a year (s.13(d))", "None", "12% a year", "The bank rate"], a: 0, e: "A partner is entitled to interest at 6% a year on advances beyond the capital agreed." },
        { q: "Without the others' consent, a partner submits a dispute of the firm to arbitration.", o: ["The firm is not bound: outside implied authority (s.19(2))", "The firm is bound: it is in the ordinary course", "Only he is a partner in the arbitration", "The arbitration is void for all purposes"], a: 0, e: "Implied authority does not extend to submitting disputes to arbitration, unless usage or custom of trade allows." },
        { q: "A partner buys office supplies for the firm on credit, in the usual way of the business. Who is liable?", o: ["All partners, jointly and severally (s.25)", "Only the partner who bought", "Only the firm's assets", "Only if all partners signed"], a: 0, e: "Acts within implied authority bind the firm, and every partner is jointly and severally liable." },
        { q: "A partner secretly earns a commission from a supplier on the firm's purchases.", o: ["He must account for it to the firm (s.16)", "He may keep it", "He must share it only with the supplier", "The purchase contract is void"], a: 0, e: "A partner must account for any profit derived from transactions of the firm or use of its property." },
        { q: "Ravi retires from a firm. He gives no public notice. A customer who dealt with the firm earlier supplies goods after his retirement.", o: ["Ravi remains liable to that customer (s.32(3))", "Ravi is free of all liability", "Only the continuing partners are liable, always", "The firm is dissolved"], a: 0, e: "Until public notice of retirement is given, a retired partner continues to be liable to third parties for acts of the firm." }] },
      outcomes: ["State the general duties of partners and the rights the Act gives in the absence of agreement (ss.9–17)", "Explain a partner's implied authority and its restrictions (ss.18–22)", "Explain the liability of partners to third parties (ss.25–28)", "Apply the rules on incoming, retiring, expelled and deceased partners (ss.31–38)"],
      notes: `<p><b>General duties</b>: partners must carry on the business to the <b>greatest common advantage</b>, be <b>just and faithful</b> to each other, and render true accounts and full information of all things affecting the firm (s.9). A partner must <b>indemnify</b> the firm for loss caused by his <b>fraud</b> (s.10) or <b>wilful neglect</b> (s.13(f)). He must <b>account for personal profits</b> earned from firm transactions, its property or its business connection, and must not carry on a <b>competing business</b>; if he does, he must account for and pay to the firm all profits from it (s.16).</p>
<p style="margin-top:10px">The mutual rights and duties may be fixed by <b>contract</b> (s.11); a partner may agree not to carry on any other business while a partner, which is an exception to s.27 of the Contract Act. <b>Subject to contract</b>: every partner may take part in the business (s.12(a)); ordinary matters are decided by a <b>majority</b>, but no change in the <b>nature of the business</b> without everyone's consent (s.12(c)); every partner may inspect and copy the <b>books</b> (s.12(d)); no partner is entitled to <b>remuneration</b> (s.13(a)); profits and losses are shared <b>equally</b> (s.13(b)); <b>interest on capital</b> is payable only if agreed, and only out of profits (s.13(c)); <b>advances</b> beyond capital earn <b>6% a year</b> (s.13(d)); the firm must <b>indemnify</b> a partner for payments and liabilities incurred in the ordinary and proper conduct of the business or in an emergency (s.13(e)). Property brought in or bought for the firm is <b>firm property</b> and must be used exclusively for the business (ss.14–15).</p>
<p style="margin-top:10px">A partner is the <b>agent of the firm</b> for its business (s.18). His acts done in the usual way of the business bind the firm (<b>implied authority</b>, s.19(1)). But, unless usage or custom of trade allows, implied authority does <b>not</b> extend to: submitting a dispute to <b>arbitration</b>; opening a <b>bank account in his own name</b> on the firm's behalf; <b>compromising or relinquishing</b> a claim of the firm; <b>withdrawing</b> a suit filed by the firm; <b>admitting liability</b> in a suit against the firm; <b>acquiring or transferring immovable property</b> of the firm; or entering into a <b>partnership</b> on its behalf (s.19(2)). The firm is bound by acts in an <b>emergency</b> done as a prudent man would for his own protection (s.21).</p>
<p style="margin-top:10px">Every partner is liable, <b>jointly with all the others and also severally</b>, for all acts of the firm done while he is a partner (s.25), including <b>wrongful acts</b> of a partner in the ordinary course of business (s.26) and misapplication of money received by the firm (s.27). An <b>incoming partner</b> is not liable for acts before he joined (s.31). A <b>retiring partner</b> remains liable for acts before retirement, and for later acts until <b>public notice</b> of retirement is given (s.32). A partner may be <b>expelled</b> only by a majority acting in <b>good faith</b> under a power in the contract (s.33). The estate of a <b>deceased</b> partner is not liable for acts of the firm after his death (s.35). A <b>transferee</b> of a partner's interest gets only his share of profits and, on dissolution, his share of assets; he cannot interfere in the business or inspect the books (s.29).</p>`,
      formula: "Silent deed: equal profits · no salary · no interest on capital · 6% on advances<small>liability to third parties: joint and several (s.25)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Restrictions on implied authority, s.19(2)</h4>" + tbl(["A partner cannot, without express authority…"], [["Submit a firm dispute to arbitration"], ["Open a bank account in his own name for the firm"], ["Compromise or give up a claim of the firm"], ["Withdraw a suit filed by the firm"], ["Admit liability in a suit against the firm"], ["Buy or sell immovable property of the firm"], ["Enter into a partnership on the firm's behalf"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Ravi, Neha and Dev are partners in a furniture business. Their deed is silent on profit-sharing and interest. Capital: Ravi ₹3 lakh, Neha ₹2 lakh, Dev ₹1 lakh. Dev also lent the firm ₹50,000 for a year. Profit before interest is ₹1,23,000. Ravi claims ₹5,000 a month as salary because he works full-time.</p>" +
          pfac("s.13: in the absence of agreement, no remuneration; no interest on capital; 6% a year on advances; profits shared equally.", "The deed is silent. Dev's ₹50,000 is an advance. Ravi claims a salary.", "Interest on Dev's advance = 6% × ₹50,000 = ₹3,000, a charge against profit. Remaining profit ₹1,20,000 is shared equally. Ravi gets no salary and no one gets interest on capital.", "Ravi ₹40,000, Neha ₹40,000, Dev ₹40,000 + ₹3,000 interest.");
      },
      use: ["Read the deed first; apply the Act's default rules only where it is silent.", "Test every disputed act against s.19(2) before saying the firm is bound.", "Mistake: dividing profits in the capital ratio when the deed is silent.", "Mistake: forgetting that a retiring partner stays liable until public notice."],
      walk: function () { return [
        { t: "Good faith", c: "Partners owe each other the utmost good faith.", h: chips(["Just and faithful", "True accounts", "No secret profits"], "ac") },
        { t: "When the deed is silent", c: "The Act fills the gaps.", h: box("Profits: equal · Salary: none\nInterest on capital: none · Advances: 6%", "good") },
        { t: "Implied authority", c: "Acts in the usual way of business bind the firm.", h: chips(["Buy and sell goods", "Receive payments", "Hire staff"], "mi") },
        { t: "But not these", c: "s.19(2) restrictions.", h: chips(["Arbitration", "Own-name bank account", "Immovable property", "Compromise"], "hl") },
        { t: "Changes in the firm", c: "Retiring partners: give public notice.", h: chips(["Incoming s.31", "Retiring s.32", "Expelled s.33", "Deceased s.35"], "ac") }]; },
      recap: ["Without agreement: equal profits, no salary, no interest on capital, 6% on advances", "Partners bind the firm within implied authority; liability is joint and several"],
      qc: [{ q: "Which act is within a partner's implied authority?", o: ["Buying goods on credit in the usual course of business", "Submitting a dispute to arbitration", "Transferring the firm's land", "Admitting liability in a suit"], a: 0, e: "The other three are restricted by s.19(2)." },
        { q: "An expelled partner can challenge the expulsion if…", o: ["It was not in good faith or not under a power in the contract", "He was in a minority", "He had a smaller capital", "It was done by majority"], a: 0, e: "s.33: expulsion needs a contractual power exercised in good faith by a majority." }]
    },
    {
      id: "4.3", mod: 4, ch: "Chapter 4, Unit 3", title: "Registration and Dissolution of a Firm", time: "17 min", tool: "cases",
      tcfg: { d: "Decide the effect of non-registration or the mode of dissolution.", cases: [
        { q: "An unregistered firm sues a customer for ₹2 lakh of unpaid bills.", o: ["The suit fails: an unregistered firm cannot sue a third party on a contract (s.69(2))", "The suit succeeds: registration is optional", "It can sue only in the name of a partner", "It can sue after paying a penalty"], a: 0, e: "Non-registration bars suits by the firm against third parties to enforce a contract." },
        { q: "A customer sues an unregistered firm for a defective product.", o: ["The suit can proceed: third parties can sue an unregistered firm", "The suit fails: the firm is unregistered", "Only the partners can be sued, not the firm", "The customer must register the firm first"], a: 0, e: "Non-registration disables the firm and its partners, not outsiders." },
        { q: "A partner of an unregistered firm sues for dissolution and accounts.", o: ["Allowed: an exception in s.69(3)", "Barred by s.69(1)", "Allowed only if all partners agree", "Barred unless the firm registers"], a: 0, e: "Suits for dissolution, accounts, or realising the property of a dissolved firm are not barred." },
        { q: "Of two partners in a firm, one is adjudged insolvent.", o: ["Compulsory dissolution (s.41(a)): insolvency of all partners but one", "No effect on the firm", "Dissolution only by court order", "The insolvent partner is expelled"], a: 0, e: "A firm is dissolved by the adjudication of all the partners, or all but one, as insolvent." },
        { q: "A firm's business of trading in a product becomes unlawful after a new government ban.", o: ["Compulsory dissolution (s.41(b))", "Dissolution by notice", "No dissolution; the partners pay a fine", "Dissolution only by agreement"], a: 0, e: "An event that makes the business unlawful dissolves the firm." },
        { q: "One partner becomes permanently incapable of performing his duties. The others want the firm dissolved.", o: ["They may sue for dissolution by the court (s.44)", "The firm dissolves automatically", "They must expel him", "Nothing can be done"], a: 0, e: "Permanent incapacity is one of the grounds on which the court may dissolve a firm." }] },
      outcomes: ["Explain how a firm is registered and why (ss.58–59)", "State the effects of non-registration and its exceptions (s.69)", "Distinguish dissolution of a partnership from dissolution of the firm", "Explain the modes of dissolution and the order of settling accounts (ss.39–55)"],
      notes: `<p><b>Registration</b> of a firm is <b>not compulsory</b> under the Act, but non-registration has serious consequences. A firm may be registered at any time by sending to the <b>Registrar of Firms</b> of the area a statement in the prescribed form, with the fee, giving the firm name, place of business, names and addresses of partners, dates of joining and the duration of the firm, signed and verified by all the partners (s.58). When the Registrar is satisfied, he records it in the <b>Register of Firms</b>, and the firm is registered (s.59). Later changes (in the firm name, place of business, partners, or a minor's election) must be notified.</p>
<p style="margin-top:10px"><b>Effects of non-registration (s.69)</b>: (1) a partner cannot sue the firm or any other partner to enforce a right arising from the contract or the Act, unless the firm is registered and he is shown as a partner; (2) the firm cannot sue a <b>third party</b> to enforce a contract; and (3) the firm cannot claim a <b>set-off</b> or other proceeding to enforce such a right. Exceptions: a suit for <b>dissolution</b>, for <b>accounts</b> of a dissolved firm or to <b>realise its property</b>; the powers of an official assignee or receiver of an insolvent partner; firms with no place of business in the areas where the Act applies; and suits or set-offs <b>not exceeding ₹100</b> in value. Third parties can always sue the firm, and a partner can still sue on rights not arising from the contract (such as for infringement of trade mark).</p>
<p style="margin-top:10px"><b>Dissolution of partnership</b> is a change in the relation of the partners (one retires, dies or becomes insolvent) while the firm may continue. <b>Dissolution of the firm</b> ends the relation between <b>all</b> the partners (s.39) and the business is wound up. A firm is dissolved: by <b>agreement</b> (s.40); <b>compulsorily</b>, on the insolvency of all partners or all but one, or when the business becomes <b>unlawful</b> (s.41); on <b>contingencies</b>, subject to contract: the expiry of its <b>fixed term</b>, completion of the <b>venture</b>, the <b>death</b> or <b>insolvency</b> of a partner (s.42); by <b>notice</b> in a partnership at will (s.43); and by the <b>court</b> on a partner's suit, on grounds of a partner's unsoundness of mind, permanent incapacity, misconduct affecting the business, persistent breach of the agreement, transfer of his whole interest, the business being carried on only at a <b>loss</b>, or any other <b>just and equitable</b> ground (s.44).</p>
<p style="margin-top:10px">After dissolution, partners remain liable for acts done before <b>public notice</b> of dissolution (s.45). <b>Settlement of accounts (s.48)</b>, subject to agreement: <b>losses</b>, including deficiencies of capital, are paid first out of profits, then out of capital, and then by partners <b>individually</b> in their profit-sharing ratio. The <b>assets</b>, including sums contributed to make up capital deficiencies, are applied in this order: (i) debts of the firm to <b>third parties</b>; (ii) partners' <b>advances</b> (as distinct from capital), rateably; (iii) partners' <b>capital</b>, rateably; and (iv) any residue to partners in their <b>profit-sharing ratio</b>. Firm debts are paid first from firm property, and a partner's private debts first from his private property (s.49).</p>`,
      formula: "Assets on dissolution: third-party debts → partners' advances → capital → surplus in profit ratio (s.48)<small>unregistered firm: cannot sue third parties or be sued on by its own partners, with exceptions (s.69)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Dissolution of partnership vs dissolution of firm</h4>" + tbl(["Basis", "Dissolution of partnership", "Dissolution of firm"], [["Meaning", "Change in relation among partners", "End of relation among all partners"], ["Business", "May continue", "Comes to an end"], ["Court order", "Not needed", "May be by court (s.44)"], ["Books", "Not closed", "Closed; assets realised"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">On dissolution, a firm's assets realise ₹7,00,000. It owes creditors ₹3,00,000, Isha has made an advance of ₹50,000, and capitals are Isha ₹2,00,000 and Kabir ₹1,00,000. They share profits 3 : 2.</p>" +
          pfac("s.48(b): assets go first to third-party debts, then to partners' advances, then to capital, and any residue in the profit-sharing ratio.", "Assets ₹7,00,000; creditors ₹3,00,000; Isha's advance ₹50,000; capitals ₹3,00,000 in all.", "₹7,00,000 − 3,00,000 (creditors) − 50,000 (advance) − 3,00,000 (capitals) = ₹50,000 surplus, shared 3 : 2 = ₹30,000 and ₹20,000.", "Isha gets ₹50,000 + ₹2,00,000 + ₹30,000 = ₹2,80,000; Kabir gets ₹1,00,000 + ₹20,000 = ₹1,20,000.");
      },
      use: ["For an unregistered firm, first ask who is suing whom and on what right.", "Identify the mode of dissolution and its section before discussing consequences.", "Mistake: saying an unregistered firm cannot be sued; outsiders can sue it.", "Mistake: repaying capital before partners' advances."],
      walk: function () { return [
        { t: "Registration", c: "Optional, but non-registration hurts.", h: chips(["Statement to Registrar", "Signed by all partners"], "ac") },
        { t: "If unregistered (s.69)", c: "The firm and its partners lose rights to sue.", h: chips(["Firm vs third party ✗", "Partner vs firm ✗", "Third party vs firm ✓"], function (x, i) { return i === 2 ? "mi" : "hl"; }) },
        { t: "Modes of dissolution", c: "Agreement, compulsory, contingency, notice, court.", h: chips(["s.40", "s.41", "s.42", "s.43", "s.44"], "ac") },
        { t: "Paying out the assets", c: "In strict order.", h: box("1 Creditors → 2 Advances → 3 Capital → 4 Surplus", "good") },
        { t: "Public notice", c: "Protects partners from later liability.", h: chips(["s.45"], "mi") }]; },
      recap: ["An unregistered firm cannot sue third parties, though they can sue it", "On dissolution, assets pay creditors, then advances, then capital, then surplus in the profit ratio"],
      qc: [{ q: "A firm is compulsorily dissolved when…", o: ["Its business becomes unlawful", "A partner retires", "A new partner joins", "It makes a loss for one year"], a: 0, e: "s.41(b); and on the insolvency of all partners or all but one (s.41(a))." },
        { q: "On dissolution, which is paid first out of the firm's assets?", o: ["Debts to third parties", "Partners' capital", "Partners' advances", "Surplus to partners"], a: 0, e: "s.48(b)(i)." }]
    },
    {
      id: "4.4", mod: 4, ch: "Chapter 5", title: "The Limited Liability Partnership Act, 2008", time: "16 min", tool: "sort",
      tcfg: { d: "Which business form has each feature?", buckets: ["LLP", "Partnership firm", "Both"], items: [
        ["A separate legal entity that can own property and sue in its own name", "LLP", "An LLP is a body corporate (s.3)."],
        ["Each partner is liable without limit for the firm's debts", "Partnership firm", "Partners of a firm are jointly and severally liable without limit."],
        ["Registration with the Registrar is required to come into existence", "LLP", "An LLP is incorporated by filing an incorporation document; a firm may exist without registration."],
        ["At least two partners are needed", "Both", "Both need a minimum of two."],
        ["No maximum number of partners", "LLP", "The LLP Act sets no upper limit; firms are limited to 50."],
        ["Perpetual succession: not affected by partners leaving or dying", "LLP", "A body corporate continues regardless of changes in partners."],
        ["Partners share profits under an agreement", "Both", "Both are governed by an agreement among partners."],
        ["Governed by the Indian Partnership Act, 1932", "Partnership firm", "The 1932 Act does not apply to LLPs (s.4 of the LLP Act)."]] },
      outcomes: ["Explain the nature and key features of an LLP", "State the requirements for partners and designated partners", "Describe incorporation, the LLP agreement and the limits on liability", "Compare an LLP with a partnership firm and a company, and explain conversion and winding up"],
      notes: `<p>The <b>Limited Liability Partnership Act, 2008</b> created a business form that combines the <b>flexibility of a partnership</b> with the <b>limited liability of a company</b>. An <b>LLP</b> is a <b>body corporate</b> with a legal entity <b>separate from its partners</b> and <b>perpetual succession</b>, so changes in partners do not affect its existence, rights or liabilities (s.3). It can own property, sue and be sued in its own name, and have a common seal. The Indian Partnership Act, 1932 does not apply to LLPs (s.4).</p>
<p style="margin-top:10px">An LLP needs at least <b>two partners</b>; there is <b>no maximum</b>. An individual or a body corporate may be a partner, but not an individual of unsound mind, an undischarged insolvent or one who has applied to be adjudged insolvent (s.5). If the number of partners falls below two and the LLP carries on business for more than six months, the remaining partner becomes personally liable for obligations incurred during that period (s.6). Every LLP must have at least <b>two designated partners</b> who are <b>individuals</b>, at least one of whom is <b>resident in India</b> (s.7). Designated partners are responsible for the LLP's compliance with the Act (filing documents, returns and statements) and are liable to penalties for contravention (s.8). They need a Designated Partner Identification Number.</p>
<p style="margin-top:10px">To <b>incorporate</b>, two or more persons associated for carrying on a <b>lawful business with a view to profit</b> file an <b>incorporation document</b> with the Registrar, stating the name, proposed business, registered office, and details of partners and designated partners (s.11). On registration, the Registrar issues a <b>certificate of incorporation</b> (s.12). The name must end with <b>'Limited Liability Partnership'</b> or <b>'LLP'</b> (s.15). The mutual rights and duties of partners, and between the LLP and its partners, are governed by the <b>LLP agreement</b>, or, where it is silent, by the First Schedule to the Act (s.23).</p>
<p style="margin-top:10px">Every partner is an <b>agent of the LLP</b>, but <b>not of the other partners</b> (s.26). The LLP is liable for a partner's wrongful act in the course of its business or with its authority (s.27). An obligation of the LLP is <b>solely its own</b>; a partner is not personally liable for it merely because he is a partner, and is <b>not liable for another partner's wrongful act</b>, though he remains liable for his <b>own</b> wrongful act (s.28). Liability is <b>unlimited</b> for acts done with intent to defraud creditors (s.30). Partners' <b>contribution</b> may be money, property or services (s.32). An LLP must keep proper books, file an <b>annual statement of accounts and solvency</b> and an <b>annual return</b> (ss.34–35). A firm, a private company or an unlisted public company may <b>convert</b> into an LLP under the Second, Third and Fourth Schedules (s.55). An LLP may be <b>wound up</b> voluntarily or by the Tribunal, or struck off.</p>`,
      formula: "LLP = body corporate + separate entity + perpetual succession + limited liability<small>minimum 2 partners · at least 2 designated partners (individuals), 1 resident in India</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">LLP vs partnership firm vs company</h4>" + tbl(["Basis", "LLP", "Partnership firm", "Company"], [["Law", "LLP Act, 2008", "Partnership Act, 1932", "Companies Act, 2013"], ["Separate entity", "Yes", "No", "Yes"], ["Liability", "Limited (except own wrongs, fraud)", "Unlimited, joint and several", "Limited (in a limited company)"], ["Members", "Min 2, no max", "Min 2, max 50", "Private: 2 to 200; public: min 7"], ["Internal rules", "LLP agreement", "Partnership deed", "Memorandum and articles"], ["Management", "Partners directly", "Partners directly", "Board of directors"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Isha and Dev run 'Orbit Design LLP'. Dev, while advising a client, negligently gives wrong structural advice, and the client suffers a loss of ₹15 lakh. The LLP's assets are ₹6 lakh. The client wants to sue Isha personally too.</p>" +
          pfac("s.27: the LLP is liable for a partner's wrongful act in the course of business. s.28: a partner is not personally liable for another partner's wrongful act, but is liable for his own.", "Dev's negligence in the course of the LLP's business caused the loss; Isha was not involved.", "The client can recover from the LLP (up to its assets) and from Dev personally for his own wrongful act. Isha's liability is limited to her contribution to the LLP.", "Isha is not personally liable; the LLP and Dev are.");
      },
      use: ["For any LLP problem, ask: is the obligation the LLP's, or a partner's own wrongful act?", "Check the designated partner requirements whenever the facts mention a change in partners.", "Mistake: applying the Partnership Act, 1932 to an LLP.", "Mistake: treating partners of an LLP as agents of each other."],
      walk: function () { return [
        { t: "What is an LLP?", c: "A body corporate with partners instead of shareholders.", h: chips(["Separate entity", "Perpetual succession", "Limited liability"], "ac") },
        { t: "Who runs it?", c: "Partners, with designated partners for compliance.", h: box("Min 2 partners · no maximum\n2 designated partners (individuals), 1 resident in India", "good") },
        { t: "Incorporation", c: "File the incorporation document; get a certificate.", h: chips(["Name ends 'LLP'", "LLP agreement"], "mi") },
        { t: "Liability", c: "The LLP's debts are its own.", h: chips(["Own wrongful act: liable", "Partner's wrongful act: not liable"], function (x, i) { return i ? "mi" : "hl"; }) },
        { t: "Conversion", c: "From a firm, private company or unlisted public company.", h: chips(["Schedules II–IV"], "ac") }]; },
      recap: ["An LLP is a body corporate with perpetual succession and limited liability", "It needs two partners and two individual designated partners, one resident in India"],
      qc: [{ q: "The maximum number of partners in an LLP is…", o: ["No limit", "50", "100", "200"], a: 0, e: "The LLP Act sets no maximum." },
        { q: "A partner of an LLP is an agent of…", o: ["The LLP, but not of the other partners", "The other partners only", "Both the LLP and the other partners", "No one"], a: 0, e: "s.26." }]
    },

    /* ---------------- MODULE 5: COMPANIES ACT AND NEGOTIABLE INSTRUMENTS ---------------- */
    {
      id: "5.1", mod: 5, ch: "Chapter 6", title: "The Companies Act, 2013", time: "22 min", tool: "cotype",
      outcomes: ["Define a company and explain its features, including separate legal entity and limited liability", "Explain when the corporate veil is lifted", "Classify companies: private, public, one person, small, holding, subsidiary, associate, government, foreign and section 8 companies", "Explain the memorandum and articles, the doctrine of ultra vires, constructive notice and indoor management"],
      notes: `<p>A <b>company</b> means a company incorporated under the <b>Companies Act, 2013</b> or any previous company law (s.2(20)). On incorporation, it becomes a <b>body corporate</b> with these <b>features</b>: a <b>separate legal entity</b>, distinct from its members (<i>Salomon v Salomon &amp; Co Ltd</i>); <b>limited liability</b> of members (in a company limited by shares, to the unpaid amount on their shares); <b>perpetual succession</b> (members may come and go, but the company continues until it is wound up); its own <b>property</b>, which belongs to the company, not to the members; the capacity to <b>sue and be sued</b> in its own name; <b>transferability of shares</b> (restricted in a private company); a <b>common seal</b> (optional since 2015); and management by a <b>board of directors</b>, separate from ownership.</p>
<p style="margin-top:10px"><b>Lifting the corporate veil</b>: the law looks behind the company to the people controlling it when the separate entity is used to commit <b>fraud</b> or improper conduct, to <b>evade taxes</b>, to avoid a legal obligation, where the company is a <b>sham</b> or a mere agent of its controllers, to determine <b>enemy character</b> in wartime (<i>Daimler Co Ltd v Continental Tyre</i>), or in the interest of <b>public policy</b>. The Act itself makes persons personally liable in some cases, such as false statements in a prospectus (ss.34–35), furnishing false information at incorporation (s.7(7)), and fraudulent conduct of business found in winding up (s.339).</p>
<p style="margin-top:10px"><b>Classes of companies</b>: by <b>liability</b>, a company may be limited by <b>shares</b>, limited by <b>guarantee</b>, or <b>unlimited</b>. A <b>private company</b> (s.2(68)) by its articles restricts the right to transfer shares, limits its members to <b>200</b> (excluding present and former employee-members) and prohibits inviting the public to subscribe to its securities; it needs at least <b>2</b> members and <b>2</b> directors. A <b>public company</b> (s.2(71)) is not a private company; it needs at least <b>7</b> members and <b>3</b> directors, and a private company that is a <b>subsidiary of a public company</b> is treated as public. A <b>One Person Company</b> (s.2(62)) has only one member, a natural person who is an Indian citizen and resident in India, who must name a nominee; it cannot be a section 8 company or carry on non-banking financial investment activities. A <b>small company</b> (s.2(85)) is a company, other than a public company, whose paid-up share capital and turnover do not exceed the limits prescribed under the Act; holding and subsidiary companies, section 8 companies and companies governed by special Acts cannot be small companies. A company is a <b>holding company</b> of another (its <b>subsidiary</b>) if it <b>controls the composition of the board</b>, or exercises or controls <b>more than half of the total voting power</b>, itself or with its subsidiaries (s.2(46), s.2(87)). An <b>associate company</b> is one over which another has <b>significant influence</b>, meaning control of at least <b>20% of total voting power</b> or of business decisions under an agreement (s.2(6)). A <b>government company</b> has at least <b>51%</b> of its paid-up share capital held by the Central Government, State Governments, or both (s.2(45)). A <b>foreign company</b> is incorporated outside India but has a place of business in India (s.2(42)). A <b>section 8 company</b> promotes commerce, art, science, sports, education, research, social welfare, religion, charity or the environment, applies its profits to these objects and pays <b>no dividend</b>; it is licensed by the Central Government. A <b>dormant company</b> is one formed for a future project or to hold an asset, without significant accounting transactions, registered as such under s.455.</p>
<p style="margin-top:10px">The <b>Memorandum of Association</b> (s.4) is the company's charter: it states the <b>name</b> (ending in 'Limited' or 'Private Limited', with exceptions), the <b>State</b> of its registered office, its <b>objects</b>, the <b>liability</b> of members and, for a company with share capital, the <b>capital</b> and subscribers' shares. Acts beyond the objects are <b>ultra vires</b> and <b>void</b>; they cannot be ratified even by all the members (<i>Ashbury Railway Carriage Co v Riche</i>). The <b>Articles of Association</b> (s.5) contain the rules for internal management; they are subordinate to the memorandum and the Act, and may contain <b>entrenchment</b> provisions that need more than a special resolution to change. The memorandum and articles, once registered, bind the company and members as if signed by each (s.10). Under the doctrine of <b>constructive notice</b>, anyone dealing with a company is deemed to know the contents of its public documents. The doctrine of <b>indoor management</b> (<i>Royal British Bank v Turquand</i>) protects outsiders: they may assume that internal procedures have been complied with, unless they <b>knew</b> of the irregularity, the act was a <b>forgery</b>, they were <b>negligent</b> or the circumstances were <b>suspicious</b>, or the act was outside the company's or the officer's authority.</p>`,
      formula: "Private: 2–200 members, 2 directors · Public: min 7 members, 3 directors · OPC: 1 member, 1 director<small>holding: controls the board or more than half of the voting power · associate: at least 20% of voting power</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Private vs public company</h4>" + tbl(["Basis", "Private", "Public"], [["Minimum members", "2 (1 for an OPC)", "7"], ["Maximum members", "200 (excluding employee-members)", "No limit"], ["Minimum directors", "2 (1 for an OPC)", "3"], ["Transfer of shares", "Restricted by the articles", "Freely transferable"], ["Invitation to the public", "Prohibited", "Allowed (prospectus)"], ["Name ends with", "'Private Limited'", "'Limited'"]]) + note("Thresholds for a small company are prescribed by rules and have been raised over time (most recently with effect from 1 December 2025, to paid-up capital of up to ₹10 crore and turnover of up to ₹100 crore). Check the limits that apply for your exam attempt."); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Ravi owns 99% of the shares of Bluebird Foods Pvt Ltd. He lends the company ₹20 lakh on a secured debenture. The company fails, owing unsecured creditors ₹35 lakh, with assets of ₹22 lakh. The creditors argue that Ravi and the company are really one person, so he should not be paid first.</p>" +
          pfac("A company is a separate legal person from its members, even where one member holds almost all the shares (Salomon v Salomon & Co Ltd). The veil is lifted only for fraud, sham or the other recognised grounds.", "Ravi holds 99% of the shares and is also a secured creditor; there is no evidence of fraud.", "The company and Ravi are different persons in law. His debenture is a valid secured debt, ranking ahead of unsecured creditors. Nothing suggests the company was a sham or used to defraud.", "Ravi, as secured creditor, is paid first from the ₹22 lakh; the unsecured creditors take what remains.");
      },
      use: ["To classify a company, test each definition separately; one company can be private, small and a subsidiary at once (except that a holding or subsidiary company cannot be small).", "When an outsider dealt with an officer, check constructive notice, then indoor management and its exceptions.", "Mistake: saying a private company can never become public; it can convert, and a subsidiary of a public company is deemed public.", "Mistake: thinking all members can ratify an ultra vires act."],
      walk: function () { return [
        { t: "A company is a person in law", c: "Separate from its members.", h: chips(["Separate entity", "Limited liability", "Perpetual succession"], "ac") },
        { t: "Lifting the veil", c: "Only for fraud, sham, tax evasion, enemy character or statute.", h: chips(["Fraud", "Sham", "Tax evasion", "Enemy character"], "hl") },
        { t: "Classes by members", c: "Private, public, one person.", h: box("Private: 2–200 · Public: 7+ · OPC: 1", "good") },
        { t: "Control", c: "Holding, subsidiary and associate.", h: chips(["> 50% votes or board control → subsidiary", "≥ 20% votes → associate"], "ac") },
        { t: "Memorandum and articles", c: "Charter and internal rules.", h: chips(["Ultra vires → void", "Indoor management"], function (x, i) { return i ? "mi" : "hl"; }) }]; },
      recap: ["A company is a separate legal entity with limited liability and perpetual succession; the veil is lifted only in recognised cases", "Know the tests for private, public, OPC, small, holding, subsidiary, associate and government companies"],
      qc: [{ q: "The maximum number of members of a private company (excluding employee-members) is…", o: ["200", "50", "7", "No limit"], a: 0, e: "s.2(68)." },
        { q: "An act beyond the objects clause of the memorandum is…", o: ["Ultra vires and void; it cannot be ratified even by all members", "Valid if all members ratify it", "Voidable at the company's option", "Valid if the board approves"], a: 0, e: "Ashbury Railway Carriage Co v Riche." }]
    },
    {
      id: "5.2", mod: 5, ch: "Chapter 7", title: "The Negotiable Instruments Act, 1881", time: "22 min", tool: "cheque",
      outcomes: ["Define promissory notes, bills of exchange and cheques (ss.4–6) and their features", "Distinguish a holder from a holder in due course and explain the privileges of a holder in due course", "Explain negotiation, endorsement and crossing of cheques", "Apply the rules on maturity, dishonour and the offence of dishonour of a cheque (s.138)"],
      notes: `<p>A <b>negotiable instrument</b> means a promissory note, bill of exchange or cheque payable either to <b>order</b> or to <b>bearer</b> (s.13). Its features are: it is freely <b>transferable</b> by delivery (bearer) or by endorsement and delivery (order); a <b>holder in due course</b> gets a good title free from defects in the title of earlier parties; he can <b>sue in his own name</b>; and certain <b>presumptions</b> apply, such as that it was made for consideration and that transfer took place before maturity (s.118).</p>
<p style="margin-top:10px">A <b>promissory note</b> is an instrument in writing (not a bank note or currency note) containing an <b>unconditional undertaking</b>, signed by the maker, to pay a certain sum of money only to, or to the order of, a certain person, or to the bearer (s.4). It has two parties, the <b>maker</b> and the <b>payee</b>; a note payable to bearer cannot be made by anyone except the RBI or the Central Government, by s.31 of the RBI Act. A <b>bill of exchange</b> is an instrument in writing containing an <b>unconditional order</b>, signed by the maker, directing a certain person to pay a certain sum of money only to, or to the order of, a certain person, or to the bearer (s.5). It has three parties: the <b>drawer</b>, the <b>drawee</b> (who becomes the acceptor) and the <b>payee</b>. A <b>cheque</b> is a bill of exchange drawn on a <b>specified banker</b> and payable <b>on demand</b>, and includes a cheque in <b>electronic form</b> and a <b>truncated</b> cheque (s.6).</p>
<p style="margin-top:10px">A <b>holder</b> is a person entitled in his own name to possession of the instrument and to recover the amount due (s.8). A <b>holder in due course</b> is one who, for <b>consideration</b>, became the possessor (bearer instrument) or payee or endorsee (order instrument) <b>before maturity</b>, and <b>without sufficient cause to believe</b> that any defect existed in the title of the person from whom he got it (s.9). His <b>privileges</b> include a title free from earlier defects, the right to sue all prior parties, and the rule that once an instrument passes through a holder in due course, every later holder (other than a party to a fraud) gets the same rights (s.53). An <b>inchoate</b> stamped instrument signed in blank gives authority to complete it for any amount the stamp covers (s.20); an <b>ambiguous</b> instrument (which may be treated as a note or a bill) may be treated as either at the holder's option (s.17).</p>
<p style="margin-top:10px"><b>Negotiation</b> transfers an instrument so as to make the transferee the holder (s.14). An <b>endorsement</b> is the signature of the holder on the instrument for the purpose of negotiation (s.15). It may be in <b>blank</b> (signature only, making it payable to bearer), <b>full or special</b> (naming the endorsee), <b>restrictive</b> (prohibiting further negotiation), <b>conditional</b>, <b>sans recours</b> (excluding the endorser's liability) or <b>facultative</b> (waiving a right, such as notice of dishonour). A <b>crossing</b> is a direction to the banker to pay only through a banker: a <b>general crossing</b> has two parallel transverse lines, with or without words such as '&amp; Co.' (s.123); a <b>special crossing</b> names a particular banker (s.124); 'not negotiable' means the transferee gets no better title than the transferor (s.130); and an <b>account payee</b> crossing directs the collecting banker to credit only the payee's account.</p>
<p style="margin-top:10px"><b>Maturity</b> is the date on which the instrument falls due (s.22). An instrument payable otherwise than on demand gets <b>three days of grace</b>. In calculating the date, a month is a calendar month and the day of the date (or of presentment, acceptance or sight) is excluded (ss.23–24). If the maturity date is a <b>public holiday</b>, it is due on the <b>preceding business day</b> (s.25). An instrument is <b>dishonoured</b> by non-acceptance (bills) or non-payment, and notice of dishonour must be given to prior parties to make them liable (ss.91–93); a <b>notary public</b> may <b>note</b> and <b>protest</b> the dishonour (ss.99–100).</p>
<p style="margin-top:10px"><b>Dishonour of a cheque (s.138)</b> is an <b>offence</b> where a cheque drawn for the discharge of a legally enforceable debt or liability is returned unpaid for insufficient funds or because it exceeds the arrangement, provided that: (a) it was presented within <b>three months</b> of its date (or within its period of validity); (b) the payee or holder gives the drawer a <b>written notice</b> demanding payment within <b>30 days</b> of receiving information of the dishonour from the bank; and (c) the drawer fails to pay within <b>15 days</b> of receiving the notice. The complaint must be filed within <b>one month</b> of the date the cause of action arises, that is, after the 15 days expire (s.142); a court may condone delay for sufficient cause. The punishment is imprisonment of up to <b>two years</b>, or a fine of up to <b>twice the amount</b> of the cheque, or both. The court may order <b>interim compensation</b> of up to 20% of the cheque amount (s.143A), and an appellate court may require a deposit of at least 20% of the fine or compensation (s.148).</p>`,
      formula: "Note: maker → payee · Bill: drawer orders drawee → payee · Cheque: bill on a banker, on demand<small>s.138: present within 3 months → notice within 30 days → 15 days to pay → complaint within 1 month</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Promissory note vs bill vs cheque</h4>" + tbl(["Basis", "Promissory note", "Bill of exchange", "Cheque"], [["Nature", "Promise to pay", "Order to pay", "Order to a banker to pay"], ["Parties", "Maker, payee", "Drawer, drawee, payee", "Drawer, banker, payee"], ["Acceptance", "Not needed", "Needed (if not payable on demand)", "Not needed"], ["Days of grace", "Yes, if not on demand", "Yes, if not on demand", "No (always on demand)"], ["Crossing", "Not possible", "Not possible", "Possible"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kabir gives Patel Traders a cheque for ₹80,000, dated 2 March 2027, for goods supplied. They present it on 20 May 2027; it is returned for insufficient funds, and the bank informs them on 22 May. They send a written notice, which Kabir receives on 10 June. Kabir does not pay.</p>" +
          pfac("s.138: presentation within three months of the cheque's date, notice within 30 days of information of dishonour, and failure to pay within 15 days of receiving notice; s.142: complaint within one month of the cause of action.", "Cheque dated 2 March, presented 20 May (within three months). Information on 22 May; notice received 10 June (sent within 30 days). No payment.", "The 15 days for payment end on 25 June 2027, so the cause of action arises on 26 June. A complaint must be filed by 25 July 2027.", "An offence under s.138 is made out if the complaint is filed in time; Kabir may face up to two years' imprisonment, a fine up to ₹1,60,000, or both.");
      },
      use: ["Identify the instrument by its words: promise (note), order (bill), order on a banker on demand (cheque).", "For a dishonoured cheque, build the timeline date by date: validity, notice, 15 days, complaint.", "Mistake: giving days of grace on a cheque or on a bill payable on demand.", "Mistake: counting the 30-day notice period from the date of the cheque instead of from information of the dishonour."],
      walk: function () { return [
        { t: "Three instruments", c: "Promise, order, order on a banker.", h: chips(["Note (s.4)", "Bill (s.5)", "Cheque (s.6)"], "ac") },
        { t: "Holder in due course", c: "For value, before maturity, in good faith.", h: box("Gets a title free from\nearlier defects (s.53)", "good") },
        { t: "Endorsements", c: "Blank, full, restrictive, sans recours…", h: chips(["Blank → bearer", "Full → named", "Restrictive"], "ac") },
        { t: "Crossings", c: "Pay only through a banker.", h: chips(["General", "Special", "Account payee", "Not negotiable"], "mi") },
        { t: "Section 138", c: "Dishonour is an offence if every step is in time.", h: chips(["3 months", "30 days", "15 days", "1 month"], "hl") }]; },
      recap: ["A note is a promise, a bill an order, a cheque an order on a banker on demand; a holder in due course takes free of earlier defects", "Section 138: present in validity, notice within 30 days, 15 days to pay, complain within a month"],
      qc: [{ q: "A cheque crossed with two parallel lines and the name of a bank between them is…", o: ["Specially crossed (s.124)", "Generally crossed", "Not negotiable", "Uncrossed"], a: 0, e: "A special crossing names a particular banker." },
        { q: "Under s.138, the payee must send the drawer a notice demanding payment within…", o: ["30 days of receiving information of the dishonour", "15 days of the cheque's date", "3 months of the dishonour", "7 days of presentation"], a: 0, e: "The drawer then has 15 days from receiving the notice to pay." }]
    }
  ];

  var MODULES = [
    { n: 1, title: "Regulatory Framework and Contract Formation", sub: "The Indian regulatory framework, nature of contracts, offer and acceptance, consideration, capacity, free consent and void agreements.", tag: "Module 1", short: "Formation", takeaway: "A contract is an agreement enforceable by law: test every set of facts against the essentials of s.10, the rules of offer and acceptance, consideration, capacity and free consent." },
    { n: 2, title: "Performance, Breach and Special Contracts", sub: "Performance, breach and remedies, contingent and quasi contracts, indemnity and guarantee, bailment and pledge, and agency.", tag: "Module 2", short: "Special contracts", takeaway: "Contracts end by performance, agreement, impossibility or breach; damages cover natural and foreseen losses. Indemnity, guarantee, bailment, pledge and agency each have their own rights and duties." },
    { n: 3, title: "The Sale of Goods Act, 1930", sub: "Formation of the contract of sale, conditions and warranties, transfer of ownership and delivery, and the unpaid seller.", tag: "Module 3", short: "Sale of goods", takeaway: "Know when property and risk pass, the implied conditions and warranties, the exceptions to nemo dat, and the unpaid seller's rights of lien, stoppage and resale." },
    { n: 4, title: "Partnership and LLP", sub: "Nature of partnership, relations of partners, registration and dissolution of firms, and limited liability partnerships.", tag: "Module 4", short: "Partnership & LLP", takeaway: "A partnership rests on mutual agency and unlimited liability; registration protects the right to sue. An LLP is a body corporate with limited liability and designated partners." },
    { n: 5, title: "Companies Act and Negotiable Instruments", sub: "Companies: features, corporate veil, classes, memorandum and articles. Negotiable instruments: notes, bills, cheques, crossing and dishonour.", tag: "Module 5", short: "Companies & NI Act", takeaway: "A company is a separate legal person, classified by members, liability and control. Negotiable instruments transfer freely, and a dishonoured cheque is an offence if every step is taken in time." }
  ];

  /* ================= FINAL TEST (30 questions across the 5 modules) ================= */
  var TEST = [
    { m: 1, q: "Which is the supreme source of law in India?", o: ["The Constitution of India", "Acts of Parliament", "Judicial precedent", "Custom"], a: 0, e: "Every other law must be consistent with the Constitution." },
    { m: 1, q: "An agreement enforceable by law is…", o: ["A contract", "A promise", "A proposal", "A void agreement"], a: 0, e: "s.2(h)." },
    { m: 1, q: "Goods displayed in a shop window with price tags are…", o: ["An invitation to offer", "An offer", "A general offer", "An acceptance"], a: 0, e: "The customer makes the offer at the counter." },
    { m: 1, q: "An acceptance sent by post is complete against the offerer when…", o: ["It is posted", "It reaches the offerer", "The offerer reads it", "The offeree confirms by phone"], a: 0, e: "s.4: when it is put in the course of transmission to him." },
    { m: 1, q: "An agreement made without consideration is void, EXCEPT when it is…", o: ["Written, registered and made out of natural love and affection between near relatives", "Oral and made between friends", "Made under coercion", "A wager"], a: 0, e: "s.25(1)." },
    { m: 1, q: "Consent obtained by undue influence makes a contract…", o: ["Voidable at the option of the party influenced", "Void", "Illegal", "Valid and binding"], a: 0, e: "s.19A." },
    { m: 2, q: "Where neither party appropriates a payment, it is applied to the debts…", o: ["In order of time, whether or not time-barred", "To the largest first", "To the latest first", "Equally across all"], a: 0, e: "s.61." },
    { m: 2, q: "A contract that becomes impossible to perform after it is made…", o: ["Becomes void (s.56)", "Remains valid", "Becomes voidable", "Becomes illegal"], a: 0, e: "The doctrine of supervening impossibility." },
    { m: 2, q: "Damages for loss that did not arise naturally and was not foreseen by both parties are…", o: ["Not recoverable (remote)", "Ordinary damages", "Special damages", "Liquidated damages"], a: 0, e: "s.73 excludes remote and indirect loss." },
    { m: 2, q: "A finder of goods is in the position of a…", o: ["Bailee", "Owner", "Pledgee", "Agent"], a: 0, e: "s.71." },
    { m: 2, q: "The liability of a surety is…", o: ["Co-extensive with that of the principal debtor", "Only after the creditor sues the debtor", "Twice that of the debtor", "Limited to half the debt"], a: 0, e: "s.128." },
    { m: 2, q: "A variance in the terms of the contract between creditor and principal debtor, without the surety's consent…", o: ["Discharges the surety as to later transactions (s.133)", "Has no effect", "Doubles the surety's liability", "Makes the guarantee void from the start"], a: 0, e: "The surety is discharged as to transactions after the variance." },
    { m: 2, q: "The pawnee may sell the pledged goods on the pawnor's default after…", o: ["Giving reasonable notice", "Obtaining a court order", "Waiting one year", "The pawnor's consent"], a: 0, e: "s.176." },
    { m: 2, q: "An agency in which the agent has an interest in the subject matter is…", o: ["Irrevocable to the prejudice of that interest", "Revocable at will", "Void", "Ended by the principal's death in all cases"], a: 0, e: "s.202." },
    { m: 3, q: "Specific goods that, unknown to the seller, have perished at the time of the contract make it…", o: ["Void (s.7)", "Voidable", "Valid; the buyer bears the loss", "Avoided under s.8"], a: 0, e: "s.8 applies where they perish later, before risk passes." },
    { m: 3, q: "A stipulation essential to the main purpose of a contract of sale is a…", o: ["Condition", "Warranty", "Guarantee", "Representation"], a: 0, e: "s.12(2)." },
    { m: 3, q: "Which is an exception to caveat emptor?", o: ["The buyer made the purpose known and relied on the seller's skill", "The buyer examined the goods and missed an obvious defect", "Goods bought under a trade name with no reliance", "The buyer chose the goods himself from a range"], a: 0, e: "s.16(1)." },
    { m: 3, q: "Unless otherwise agreed, risk passes with…", o: ["Property (ownership)", "Delivery", "Payment", "The contract date always"], a: 0, e: "s.26." },
    { m: 3, q: "A buyer in good faith from a mercantile agent in possession with the owner's consent gets…", o: ["A good title", "No title", "A voidable title", "Title only after paying the owner"], a: 0, e: "An exception to nemo dat (proviso to s.27)." },
    { m: 3, q: "Stoppage in transit is available to an unpaid seller only when the buyer is…", o: ["Insolvent", "Late in paying", "Out of the country", "Disputing quality"], a: 0, e: "s.50." },
    { m: 4, q: "The maximum number of partners in a partnership firm is…", o: ["50", "20", "100", "No limit"], a: 0, e: "Rule 10 of the Companies (Miscellaneous) Rules, 2014." },
    { m: 4, q: "In the absence of agreement, interest on a partner's advance to the firm is…", o: ["6% a year", "Nil", "12% a year", "The bank rate"], a: 0, e: "s.13(d)." },
    { m: 4, q: "Which act is outside a partner's implied authority?", o: ["Transferring immovable property of the firm", "Buying goods for the firm's business", "Receiving payment of the firm's debts", "Engaging an employee"], a: 0, e: "s.19(2)." },
    { m: 4, q: "An unregistered firm…", o: ["Cannot sue a third party to enforce a contract", "Cannot be sued by third parties", "Is illegal", "Must dissolve within six months"], a: 0, e: "s.69(2)." },
    { m: 4, q: "On dissolution, the firm's assets are applied FIRST to…", o: ["Debts to third parties", "Partners' capital", "Partners' advances", "Surplus to partners"], a: 0, e: "s.48(b)." },
    { m: 4, q: "An LLP must have at least…", o: ["Two designated partners who are individuals, one resident in India", "Seven partners", "One designated partner", "Three directors"], a: 0, e: "s.7 of the LLP Act." },
    { m: 5, q: "The minimum number of members of a public company is…", o: ["7", "2", "1", "3"], a: 0, e: "A private company needs 2; an OPC has 1." },
    { m: 5, q: "Company A holds 30% of the voting power of Company B and does not control its board. B is A's…", o: ["Associate company", "Subsidiary", "Holding company", "Government company"], a: 0, e: "At least 20% of voting power gives significant influence (s.2(6))." },
    { m: 5, q: "An outsider may assume that a company's internal procedures have been followed. This is the doctrine of…", o: ["Indoor management", "Ultra vires", "Constructive notice", "Lifting the veil"], a: 0, e: "Royal British Bank v Turquand." },
    { m: 5, q: "Which instrument is always payable on demand and has no days of grace?", o: ["A cheque", "A bill payable three months after date", "A promissory note payable after sight", "A time bill"], a: 0, e: "A cheque is a bill on a banker payable on demand (s.6)." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Delegated legislation", "Rules and regulations made by the executive under powers given by an Act.", "Companies (Incorporation) Rules", "1.1"],
    ["Judicial precedent", "Decisions of higher courts that bind lower courts.", "Supreme Court rulings bind all courts (Art. 141)", "1.1"],
    ["Proposal (offer)", "Signifying willingness to do or not do something, to obtain another's assent.", "Ravi offers his printer for ₹18,000", "1.2"],
    ["Invitation to offer", "An invitation to others to make offers.", "A price list or shop display", "1.2"],
    ["Counter-offer", "A reply that changes the terms; it rejects the original offer.", "'I accept at ₹500 less'", "1.2"],
    ["Void agreement", "An agreement not enforceable by law.", "A wager", "1.2"],
    ["Voidable contract", "Enforceable at the option of one party only.", "A contract induced by coercion", "1.2"],
    ["Consideration", "Something done, given up or promised at the promisor's desire.", "Payment for goods", "1.3"],
    ["Privity of contract", "Only parties to a contract can sue on it.", "A stranger to the contract cannot sue", "1.3"],
    ["Coercion", "Committing or threatening an act forbidden by the penal law to obtain consent.", "Threatening to burn a shop", "1.4"],
    ["Undue influence", "Using a position to dominate another's will for unfair advantage.", "A spiritual adviser and a follower", "1.4"],
    ["Fraud", "A deliberate deception to induce a contract.", "Painting over damp patches", "1.4"],
    ["Misrepresentation", "An innocent false statement believed to be true.", "Wrong mileage stated honestly", "1.4"],
    ["Tender", "An offer to perform made in the proper way.", "Offering the exact sum on the due date", "2.1"],
    ["Novation", "Replacing an existing contract with a new one.", "A new debtor substituted with consent", "2.1"],
    ["Frustration", "A contract becoming void because performance becomes impossible.", "The hall burns down before the event", "2.1"],
    ["Anticipatory breach", "Refusing to perform before the due date.", "A supplier cancels a month early", "2.2"],
    ["Quantum meruit", "Reasonable payment for work done.", "Paid for half the job done", "2.2"],
    ["Liquidated damages", "A sum fixed in the contract as compensation for breach.", "₹1,000 per day of delay", "2.2"],
    ["Contingent contract", "A contract dependent on an uncertain collateral event.", "Insurance", "2.3"],
    ["Quasi contract", "An obligation imposed by law to prevent unjust enrichment.", "Money paid by mistake", "2.3"],
    ["Indemnity", "A promise to save another from loss.", "An insurer's promise", "2.4"],
    ["Guarantee", "A promise to perform a third person's obligation on his default.", "A surety for a bank loan", "2.4"],
    ["Continuing guarantee", "A guarantee extending to a series of transactions.", "Guaranteeing a supplier's monthly credit", "2.4"],
    ["Subrogation", "The surety stepping into the creditor's shoes on paying.", "Surety sues the debtor after paying", "2.4"],
    ["Bailment", "Delivery of goods for a purpose, to be returned.", "Leaving a bike for repair", "2.5"],
    ["Lien", "The right to retain goods until paid.", "A repairer keeps the bike", "2.5"],
    ["Pledge", "Bailment of goods as security for a debt.", "Gold left with a lender", "2.5"],
    ["Ratification", "Approving an act done without authority.", "Neha approves Ravi's purchase", "2.6"],
    ["Agency by estoppel", "Agency arising because the principal led others to believe it existed.", "A dismissed clerk still buying on credit", "2.6"],
    ["Goods", "Movable property other than actionable claims and money.", "Shares, crops, a car", "3.1"],
    ["Agreement to sell", "A contract where property passes later or on a condition.", "Sale of next month's harvest", "3.1"],
    ["Condition", "A stipulation essential to the main purpose of the contract.", "Goods match their description", "3.2"],
    ["Warranty", "A stipulation collateral to the main purpose.", "Quiet possession", "3.2"],
    ["Caveat emptor", "Let the buyer beware.", "The buyer must examine the goods", "3.2"],
    ["Nemo dat quod non habet", "No one can give what he does not have.", "A thief cannot pass title", "3.3"],
    ["Unpaid seller", "A seller not paid the whole price, or whose cheque was dishonoured.", "Cash sale not yet paid", "3.4"],
    ["Stoppage in transit", "Regaining possession of goods with a carrier when the buyer is insolvent.", "Calling back a truck", "3.4"],
    ["Mutual agency", "Each partner is agent and principal of the others: the true test of partnership.", "A partner's purchase binds the firm", "4.1"],
    ["Partnership by holding out", "Liability of a person who represents himself as a partner.", "s.28", "4.1"],
    ["Implied authority", "A partner's power to bind the firm by acts in the usual way of business.", "Buying stock on credit", "4.2"],
    ["Dissolution of firm", "The end of the relation among all the partners.", "Business becomes unlawful", "4.3"],
    ["Designated partner", "An LLP partner responsible for compliance under the Act.", "At least two, one resident in India", "4.4"],
    ["Corporate veil", "The separation between a company and its members.", "Lifted for fraud", "5.1"],
    ["One Person Company", "A company with only one member.", "Needs a nominee", "5.1"],
    ["Indoor management", "Outsiders may assume internal procedures were followed.", "Royal British Bank v Turquand", "5.1"],
    ["Ultra vires", "Beyond the company's objects; void.", "Ashbury Railway case", "5.1"],
    ["Holder in due course", "A holder for value, before maturity, in good faith.", "Takes free from earlier defects", "5.2"],
    ["Crossing", "A direction to pay a cheque only through a banker.", "Account payee", "5.2"],
    ["Days of grace", "Three extra days added to the maturity of time instruments.", "Due 10 April → payable 13 April", "5.2"]
  ];

  /* ================= BUSINESS LAW TOOLS ================= */
  function money(x) { return inr(x).replace(".00", ""); }
  function lines(id) { return val(id).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function cells(l) { return l.split(/\s*[|,;\t]\s*/); }
  function amt(s) { return Number(String(s || "").replace(/[₹,\s]/g, "")); }
  function yn(id, v, label) { return sel(id, [["y", "Yes"], ["n", "No"]], v, label); }
  function verdict(t, kind) { return '<div class="note" style="margin-top:10px;font-size:17px;' + (kind === "bad" ? "background:var(--red);color:var(--red-fg)" : kind === "mid" ? "background:var(--sun);color:var(--sun-fg)" : "background:var(--mint);color:var(--mint-fg)") + '"><b>' + t + "</b></div>"; }
  function dParse(s) { var m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null; }
  function dStr(d) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); }
  function addDays(d, k) { return new Date(d.getTime() + k * 864e5); }
  function addMonths(d, k) { var y = d.getUTCFullYear(), m = d.getUTCMonth() + k, day = d.getUTCDate(), last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); return new Date(Date.UTC(y, m, Math.min(day, last))); }

  /* 1.2 contract validity checker */
  TOOLS.contract = { d: "Describe the agreement. The checker tests it against the essentials of a valid contract and tells you whether it is valid, void, voidable, illegal or unenforceable, with the section.",
    b: function () { return g2(sel("ct_oa", [["y", "Yes: offer accepted absolutely"], ["c", "Acceptance changed the terms"], ["n", "No acceptance (silence only)"]], "y", "Offer and acceptance"), yn("ct_in", "y", "Intention to create legal relations?")) +
      g2(sel("ct_cn", [["y", "Yes, lawful consideration"], ["x", "None, but a s.25 exception applies"], ["n", "None"]], "y", "Consideration"), sel("ct_cp", [["y", "All parties competent"], ["m", "A party is a minor"], ["u", "A party is of unsound mind"], ["d", "A party is disqualified by law"]], "y", "Capacity")) +
      g2(sel("ct_fc", [["y", "Free consent"], ["co", "Coercion (s.15)"], ["ui", "Undue influence (s.16)"], ["fr", "Fraud (s.17)"], ["mr", "Misrepresentation (s.18)"], ["bm", "Mistake of fact by both parties (s.20)"], ["um", "Mistake by one party only (s.22)"], ["ml", "Mistake of Indian law (s.21)"]], "y", "Consent"), sel("ct_ob", [["y", "Lawful object and consideration"], ["n", "Unlawful: forbidden, fraudulent, harmful, immoral or against public policy"]], "y", "Object")) +
      g2(sel("ct_vd", [["n", "None of these"], ["rm", "Restraint of marriage (s.26)"], ["rt", "Restraint of trade (s.27)"], ["rl", "Restraint of legal proceedings (s.28)"], ["un", "Uncertain terms (s.29)"], ["wg", "Wager (s.30)"], ["im", "Impossible act or event (ss.36, 56)"]], "n", "Expressly declared void?"), sel("ct_fm", [["y", "Complete or not required"], ["n", "Required writing, stamping or registration is missing"]], "y", "Formalities")); },
    run: function () { var v = function (id) { return val(id); }, ok = [], why = [];
      function fail(t, kind, sec) { return verdict(t, kind) + steps(ok.concat([sec])); }
      if (v("ct_oa") === "c") return fail("No contract: the reply is a counter-offer", "bad", "Acceptance must be absolute and unqualified (s.7); a changed term rejects the offer.");
      if (v("ct_oa") === "n") return fail("No contract: there is no acceptance", "bad", "Silence is not acceptance; acceptance must be communicated.");
      ok.push("Offer and absolute acceptance ✓");
      if (v("ct_in") === "n") return fail("No contract: no intention to create legal relations", "bad", "Social and domestic arrangements are usually not meant to be legally binding (Balfour v Balfour).");
      ok.push("Intention to create legal relations ✓");
      if (v("ct_cp") === "m") return fail("Void ab initio: a minor's agreement", "bad", "A minor is not competent (s.11); his agreement is void and cannot be ratified (Mohori Bibee v Dharmodas Ghose). Necessaries: reimbursement from his property (s.68).");
      if (v("ct_cp") === "u") return fail("Void: a party of unsound mind", "bad", "Unless made in a lucid interval (s.12), the agreement is void.");
      if (v("ct_cp") === "d") return fail("Void: a party is disqualified from contracting", "bad", "For example an alien enemy in wartime, or a person disqualified by a particular law.");
      ok.push("Parties competent ✓");
      var fc = v("ct_fc");
      if (fc === "bm") return fail("Void: bilateral mistake of fact (s.20)", "bad", "Both parties were mistaken about a matter of fact essential to the agreement.");
      if (v("ct_ob") === "n") return fail("Void (and illegal if forbidden by law): unlawful object or consideration (s.23)", "bad", "Collateral agreements to an illegal agreement are also tainted.");
      ok.push("Lawful object and consideration ✓");
      var vd = { rm: "restraint of marriage (s.26)", rt: "restraint of trade (s.27), unless it is a reasonable restraint on the seller of goodwill", rl: "restraint of legal proceedings (s.28), except arbitration agreements", un: "uncertainty (s.29)", wg: "a wager (s.30)", im: "impossibility (ss.36, 56)" }[v("ct_vd")];
      if (vd) return fail("Void: expressly declared void for " + vd.split(" (")[0], "bad", "The agreement is void for " + vd + ".");
      ok.push("Not expressly declared void ✓");
      if (v("ct_cn") === "n") return fail("Void: no consideration (s.25)", "bad", "An agreement without consideration is void unless one of the s.25 exceptions applies.");
      ok.push(v("ct_cn") === "x" ? "No consideration, but saved by a s.25 exception ✓" : "Consideration ✓");
      if (fc === "co" || fc === "ui" || fc === "fr" || fc === "mr") { var nm = { co: "coercion", ui: "undue influence", fr: "fraud", mr: "misrepresentation" }[fc]; return fail("Voidable at the option of the party whose consent was caused by " + nm, "mid", fc === "ui" ? "s.19A: the contract may be set aside absolutely or on terms." : "s.19: the aggrieved party may avoid it" + (fc === "fr" ? " and claim damages." : fc === "mr" ? " (or insist on being put in the position the statement promised)." : ".")); }
      ok.push(fc === "um" ? "Mistake by one party only does not affect validity (s.22) ✓" : fc === "ml" ? "Mistake of Indian law is no excuse (s.21) ✓" : "Free consent ✓");
      if (v("ct_fm") === "n") return verdict("Valid but unenforceable until the formality is complied with", "mid") + steps(ok.concat(["The contract is valid in substance, but a court will not enforce it until, for example, it is properly stamped or registered."]));
      return verdict("Valid contract: enforceable by law (s.10)", "good") + steps(ok); } };

  /* 2.1 appropriation of payments */
  TOOLS.approp = { d: "Enter each debt as: name | amount | due date (YYYY-MM-DD) | time-barred (yes/no). Then the payment and any appropriation made by the debtor or the creditor.",
    b: function () { return ta("ap_d", "2021 bill | 20000 | 2021-04-10 | yes\nMarch 2026 bill | 30000 | 2026-03-15 | no\nAugust 2026 bill | 50000 | 2026-08-20 | no", 4, "Debts") + g3(inp("ap_p", "30000", "Payment (₹)"), inp("ap_dd", "", "Debtor's direction: debt name (optional)", "", "text"), inp("ap_cc", "", "Creditor's choice: debt name (optional)", "", "text")); },
    run: function () { var ds = [], bad = [];
      lines("ap_d").forEach(function (ln) { var c = cells(ln), a = amt(c[1]), d = dParse(c[2] || ""); if (!c[0] || !(a > 0) || !d) bad.push(ln); else ds.push({ nm: c[0], a: a, d: d, tb: /^y/i.test(c[3] || ""), paid: 0 }); });
      if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Use: name | amount | YYYY-MM-DD | yes/no");
      var p = amt(val("ap_p")); if (!(p > 0)) return err("Enter the payment.");
      function find(nm) { nm = nm.trim().toLowerCase(); if (!nm) return null; for (var i = 0; i < ds.length; i++) if (ds[i].nm.toLowerCase() === nm) return ds[i]; return undefined; }
      var dd = find(val("ap_dd")), cc = find(val("ap_cc")), left = p, rule, log = [];
      if (dd === undefined || cc === undefined) return err("A named debt does not match any debt in the list.");
      function pay(D, why) { var t = Math.min(D.a - D.paid, left); if (t > 0) { D.paid += t; left -= t; log.push(money(t) + " → " + esc(D.nm) + " (" + why + ")"); } }
      if (dd) { if (dd.tb) log.push("Note: a debtor may choose to pay a time-barred debt; that is his right."); pay(dd, "debtor's direction, s.59"); rule = "s.59"; }
      if (left > 0 && cc) { pay(cc, "creditor's choice, s.60" + (cc.tb ? "; allowed even though time-barred" : "")); rule = rule || "s.60"; }
      if (left > 0) { var order = ds.slice().sort(function (x, y) { return x.d - y.d; }), i = 0;
        while (left > 0.004 && i < order.length) { var grp = order.filter(function (x) { return x.d.getTime() === order[i].d.getTime(); }), due = grp.reduce(function (s, x) { return s + x.a - x.paid; }, 0);
          if (due > 0) { var share = Math.min(left, due); grp.forEach(function (x) { var t = share * (x.a - x.paid) / due; if (t > 0) { x.paid += t; log.push(money(t) + " → " + esc(x.nm) + " (order of time, s.61" + (grp.length > 1 ? ", proportionately" : "") + ")"); } }); left -= share; }
          i += grp.length; }
        rule = rule || "s.61"; }
      return steps(log) + tbl(["Debt", "Due", "Time-barred", "Amount", "Paid now", "Still due"], ds.map(function (x) { return [esc(x.nm), dStr(x.d), x.tb ? "Yes" : "No", money(x.a), money(x.paid), money(x.a - x.paid)]; })) + (left > 0.004 ? note("Excess payment of " + money(left) + " is an advance (or refundable).") : "") + note("Order: the debtor appropriates first (s.59); failing him, the creditor may choose any lawful debt, even a time-barred one (s.60); failing both, the payment goes in order of time, whether or not barred (s.61)."); } };

  /* 2.2 damages */
  TOOLS.damages = { d: "Work out damages for breach of a contract for goods under ss.73–74. Special loss counts only if both parties knew of the special circumstances when they contracted.",
    b: function () { return g3(sel("dm_t", [["nd", "Seller failed to deliver"], ["na", "Buyer refused to accept"]], "nd", "Breach"), inp("dm_q", "200", "Quantity"), inp("dm_cp", "800", "Contract price per unit (₹)")) + g3(inp("dm_mp", "950", "Market price per unit on the date of breach (₹)"), inp("dm_sl", "40000", "Other (special) loss claimed (₹)"), yn("dm_k", "n", "Were the special circumstances made known when contracting?")) + g2(inp("dm_mt", "0", "Loss the victim could reasonably have avoided (₹)"), inp("dm_ns", "", "Sum named in the contract for breach (₹, optional)")); },
    run: function () { var t = val("dm_t"), q = n("dm_q"), cp = n("dm_cp"), mp = n("dm_mp"), sl = n("dm_sl") || 0, mt = n("dm_mt") || 0, ns = n("dm_ns");
      if (![q, cp, mp].every(fin) || q <= 0) return err("Enter the quantity and both prices.");
      var diff = t === "nd" ? mp - cp : cp - mp, ord = Math.max(diff, 0) * q, sp = val("dm_k") === "y" ? sl : 0, tot = Math.max(ord + sp - mt, 0), rows = [["Ordinary damages: (" + (t === "nd" ? "market − contract" : "contract − market") + ") × quantity", money(ord)], ["Special loss " + (sp ? "(foreseen: recoverable)" : "(not made known: remote, not recoverable)"), money(sp)], ["Less: avoidable loss (duty to mitigate)", "(" + money(mt) + ")"], ["Damages under s.73", money(tot)]];
      if (fin(ns) && ns > 0) rows.push(["s.74: reasonable compensation, capped at the named sum", money(Math.min(tot, ns))]);
      return kv(rows) + (diff <= 0 ? note("The market moved in the victim's favour, so ordinary damages are nil; nominal damages may still be awarded for the breach of right.") : ""); } };

  /* 2.4 co-sureties */
  TOOLS.surety = { d: "Enter the amount the principal debtor has defaulted on and each co-surety as: Name, limit (leave the limit blank if he guaranteed the whole debt). Sections 146–147 share it equally, within each limit.",
    b: function () { return inp("sr_d", "450000", "Amount of default (₹)") + ta("sr_s", "Ravi, 100000\nKabir, 200000\nIsha, 400000", 4, "Co-sureties"); },
    run: function () { var D = amt(val("sr_d")), ss = [], bad = []; if (!(D > 0)) return err("Enter the amount of default.");
      lines("sr_s").forEach(function (ln) { var c = cells(ln), lim = (c[1] || "").trim() === "" ? Infinity : amt(c[1]); if (!c[0] || !(lim > 0)) bad.push(ln); else ss.push({ nm: c[0], lim: lim, pay: 0 }); });
      if (bad.length || ss.length < 2) return err("Enter at least two co-sureties as: Name, limit.");
      var left = D, open = ss.slice(), log = [];
      while (left > 0.004 && open.length) { var each = left / open.length, capped = open.filter(function (s) { return s.lim - s.pay <= each + 1e-9; });
        if (!capped.length) { open.forEach(function (s) { s.pay += each; }); left = 0; log.push("Each remaining surety pays an equal " + money(each) + "."); break; }
        capped.forEach(function (s) { var t = s.lim - s.pay; s.pay += t; left -= t; log.push(esc(s.nm) + " reaches his limit of " + money(s.lim) + "."); });
        open = open.filter(function (s) { return capped.indexOf(s) < 0; }); }
      return steps(["Equal share at first: " + money(D / ss.length) + " each"].concat(log)) + tbl(["Surety", "Limit", "Pays"], ss.map(function (s) { return [esc(s.nm), s.lim === Infinity ? "Whole debt" : money(s.lim), money(s.pay)]; })) + (left > 0.004 ? err("The sureties' limits together are less than the default; " + money(left) + " can be recovered only from the principal debtor.") : "") + note("Each surety who pays can then recover from the principal debtor (s.145) and gets the creditor's securities (s.141)."); } };

  /* 3.3 passing of property */
  TOOLS.passing = { d: "Choose the kind of goods and what has happened so far. The tool applies ss.18–26 to say whether property has passed and who bears a loss.",
    b: function () { return sel("ps_k", [["s20", "Specific goods in a deliverable state, unconditional contract"], ["s21", "Specific goods the seller must put into a deliverable state"], ["s22", "Specific goods the seller must weigh, measure or test to fix the price"], ["s23", "Unascertained or future goods sold by description"], ["s24", "Goods on approval or 'sale or return'"]], "s22", "Kind of contract") +
      g3(yn("ps_a", "n", "Has the seller done the required act (made deliverable / weighed / appropriated)?"), yn("ps_n", "n", "Has the buyer been notified (or assented)?"), yn("ps_r", "n", "Has the seller reserved the right of disposal (s.25)?")) +
      g3(yn("ps_ap", "n", "Approval: has the buyer approved or adopted the deal?"), yn("ps_kt", "n", "Approval: kept beyond the fixed or a reasonable time without rejecting?"), yn("ps_ls", "y", "Have the goods been damaged or destroyed?")); },
    run: function () { var k = val("ps_k"), a = val("ps_a") === "y", nt = val("ps_n") === "y", r = val("ps_r") === "y", passed, why;
      if (r && k !== "s24") { passed = false; why = "The seller reserved the right of disposal, so property does not pass until his conditions are met (s.25)."; }
      else if (k === "s20") { passed = true; why = "s.20: property passes when the contract is made, even if payment or delivery is postponed."; }
      else if (k === "s21") { passed = a && nt; why = "s.21: property passes only when the goods have been put into a deliverable state and the buyer has notice of it." + (passed ? "" : " One of these is missing."); }
      else if (k === "s22") { passed = a && nt; why = "s.22: property passes only when the weighing, measuring or testing is done and the buyer has notice." + (passed ? "" : " One of these is missing."); }
      else if (k === "s23") { passed = a && nt; why = "s.18 and s.23: no property passes in unascertained goods until goods of the description, in a deliverable state, are unconditionally appropriated to the contract with the other party's assent (delivery to a carrier counts)." + (passed ? "" : " Appropriation or assent is missing."); }
      else { passed = val("ps_ap") === "y" || val("ps_kt") === "y"; why = "s.24: property passes when the buyer approves, adopts the transaction, or keeps the goods beyond the fixed time (or a reasonable time) without rejecting them." + (passed ? "" : " None of these has happened."); }
      var h = verdict(passed ? "Property HAS passed to the buyer" : "Property has NOT passed: the seller still owns the goods", passed ? "good" : "mid") + steps([why, "s.26: unless otherwise agreed, risk follows property, whether or not the goods have been delivered."]);
      if (val("ps_ls") === "y") h += verdict(passed ? "The buyer bears the loss and must still pay the price" : "The seller bears the loss; the buyer need not pay", passed ? "bad" : "mid") + note("If delivery was delayed through the fault of one party, the goods are at that party's risk for any loss that would not otherwise have happened (s.26 proviso).");
      return h; } };

  /* 5.1 company classifier */
  TOOLS.cotype = { d: "Enter a company's details to see how the Companies Act, 2013 classifies it and the minimum members and directors it needs. Small company limits are editable because they are set by rules and change.",
    b: function () { return g3(sel("co_t", [["pv", "Private (articles restrict transfer, no public invitation)"], ["pb", "Public"]], "pv", "Articles"), inp("co_m", "25", "Members (excluding employee-members)", "", "numeric"), inp("co_d", "2", "Directors", "", "numeric")) +
      g3(inp("co_pc", "3", "Paid-up share capital (₹ crore)"), inp("co_to", "60", "Turnover (₹ crore)"), inp("co_g", "0", "Shares held by Central/State Governments (%)")) +
      g3(yn("co_sp", "n", "Is it a subsidiary of a public company?"), yn("co_hs", "n", "Is it a holding or subsidiary company at all?"), yn("co_s8", "n", "Licensed under section 8?")) +
      g3(inp("co_vx", "30", "Its voting power in Company X (%)"), yn("co_bx", "n", "Does it control X's board?"), inp("co_lp", "10", "Small company limit: paid-up (₹ crore)")) + inp("co_lt", "100", "Small company limit: turnover (₹ crore)"); },
    run: function () { var t = val("co_t"), m = n("co_m"), d = n("co_d"), pc = n("co_pc"), to = n("co_to"), g = n("co_g") || 0, vx = n("co_vx") || 0, lp = n("co_lp"), lt = n("co_lt"), out = [], warn = [];
      if (![m, d, pc, to, lp, lt].every(fin) || m < 1 || d < 0) return err("Enter members, directors, capital, turnover and the limits.");
      var sp = val("co_sp") === "y", hs = val("co_hs") === "y" || sp || vx > 50 || val("co_bx") === "y", s8 = val("co_s8") === "y", opc = t === "pv" && m === 1, pub = t === "pb" || sp;
      if (opc) { out.push(["Class by members", "One Person Company (s.2(62)): needs a nominee; min 1 director"]); if (d < 1) warn.push("An OPC needs at least 1 director."); if (s8) warn.push("An OPC cannot be a section 8 company."); }
      else if (t === "pv") { out.push(["Class by members", sp ? "Private by its articles, but deemed PUBLIC as a subsidiary of a public company (proviso to s.2(71))" : "Private company (s.2(68))"]); if (m < 2) warn.push("A private company needs at least 2 members."); if (m > 200) warn.push("A private company cannot have more than 200 members (excluding employee-members)."); if (d < (sp ? 3 : 2)) warn.push("Needs at least " + (sp ? 3 : 2) + " directors."); }
      else { out.push(["Class by members", "Public company (s.2(71))"]); if (m < 7) warn.push("A public company needs at least 7 members."); if (d < 3) warn.push("A public company needs at least 3 directors."); }
      var small = !pub && !hs && !s8 && pc <= lp && to <= lt;
      out.push(["Small company (s.2(85))?", small ? "Yes: paid-up ≤ ₹" + fmt(lp) + " cr and turnover ≤ ₹" + fmt(lt) + " cr" : "No: " + (pub ? "a public company cannot be small" : hs ? "holding and subsidiary companies are excluded" : s8 ? "section 8 companies are excluded" : "it exceeds the paid-up or turnover limit")]);
      if (g >= 51) out.push(["Government company (s.2(45))", "Yes: governments hold " + fmt(g) + "% (at least 51%)"]);
      if (vx > 50 || val("co_bx") === "y") out.push(["Relation with Company X", "Holding company: X is its subsidiary (s.2(87))"]);
      else if (vx >= 20) out.push(["Relation with Company X", "X is its associate company: significant influence, at least 20% of voting power (s.2(6))"]);
      else out.push(["Relation with Company X", "No holding or associate relation on these facts"]);
      if (s8) out.push(["Section 8", "Charitable objects; profits applied to objects; no dividend"]);
      return kv(out) + (warn.length ? err("Check: " + warn.join(" ")) : ""); } };

  /* 5.2 cheque dishonour timeline */
  TOOLS.cheque = { d: "Enter the dates for a dishonoured cheque. The tool builds the s.138 timeline, checks each step and gives the last date for filing the complaint.",
    b: function () { return g3(inp("cq_d", "2027-03-02", "Date of the cheque (YYYY-MM-DD)", "", "text"), inp("cq_p", "2027-05-20", "Presented to the bank on", "", "text"), inp("cq_i", "2027-05-22", "Information of dishonour received on", "", "text")) + g3(inp("cq_ns", "2027-06-05", "Notice sent on", "", "text"), inp("cq_nr", "2027-06-10", "Notice received by the drawer on", "", "text"), inp("cq_a", "80000", "Cheque amount (₹)")); },
    run: function () { var D = dParse(val("cq_d")), P = dParse(val("cq_p")), I = dParse(val("cq_i")), NS = dParse(val("cq_ns")), NR = dParse(val("cq_nr")), A = amt(val("cq_a"));
      if (!D || !P || !I || !NS || !NR) return err("Enter every date as YYYY-MM-DD.");
      if (!(D <= P && P <= I && I <= NS && NS <= NR)) return err("The dates must be in order: cheque ≤ presentation ≤ information ≤ notice sent ≤ notice received.");
      var valid = addDays(addMonths(D, 3), -1), nDl = addDays(I, 30), pay = addDays(NR, 15), cause = addDays(pay, 1), comp = addDays(addMonths(cause, 1), -1), rows = [], okAll = true;
      function chk(lbl, ok, txt) { if (!ok) okAll = false; rows.push([lbl, (ok ? "✅ " : "❌ ") + txt]); }
      chk("Presented within 3 months", P <= valid, "presented " + dStr(P) + "; valid until " + dStr(valid));
      chk("Notice within 30 days of information", NS <= nDl, "sent " + dStr(NS) + "; deadline " + dStr(nDl));
      rows.push(["Drawer's 15 days to pay", "until " + dStr(pay)]);
      rows.push(["Cause of action arises", dStr(cause)]);
      rows.push(["Last date for complaint (s.142)", "<b>" + dStr(comp) + "</b>"]);
      var h = tbl(["Step", "Result"], rows);
      h += okAll ? verdict("If the drawer does not pay by " + dStr(pay) + ", an offence under s.138 is made out", "good") : verdict("A condition of s.138 is not met: no offence on this cheque (a civil suit for the debt may still lie)", "bad");
      if (fin(A) && A > 0) h += kv([["Maximum fine (twice the amount)", money(2 * A)], ["Maximum imprisonment", "2 years"], ["Interim compensation (s.143A), up to", money(0.2 * A)]]);
      return h + note("The court may take a complaint after the one-month period if the complainant shows sufficient cause for the delay (proviso to s.142(b))."); } };

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0, 1, 3]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= GENERIC TOOLS (shared by all CA Foundation papers) =================
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
      '<p class="small muted" style="margin-top:10px">' + CFG.exam + ' Always confirm the current scheme on <a href="https://www.icai.org/" target="_blank" rel="noopener">icai.org</a>.</p>' +
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
    h += '<div class="sec"><div class="note">📗 <b>Official study material:</b> this lesson covers the topics of ' + l.ch + ' of the CA Foundation ' + CFG.paper + ' syllabus (' + CFG.edition + '). For the full official text and more practice questions, read ICAI\'s free study material on <a href="' + ICAI_URL + '" target="_blank" rel="noopener">icai.org</a>.</div></div>';
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
      '<p class="small muted noprint" style="text-align:center;margin-top:10px">This is a certificate of completion issued by AIStudyTools, a subsidiary of Intellique Research School Private Limited. It is not an accredited qualification, and it is not issued by or affiliated with the Institute of Chartered Accountants of India (ICAI).</p>';
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
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited.", W / 2, H - 17, { align: "center" }); doc.text("Not an accredited qualification. Not issued by or affiliated with the Institute of Chartered Accountants of India (ICAI).", W / 2, H - 13, { align: "center" });
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
