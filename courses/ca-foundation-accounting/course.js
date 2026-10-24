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

  var ICAI_URL = "https://www.icai.org/post/sm-foundation-p1-may2027";
  var CFG = {
    key: "caf_acc_progress_v1", title: "CA Foundation: Accounting", hours: 9, videos: "CAFACC_VIDEOS", paper: "Paper 1 (Accounting)", edition: "May 2027 onwards",
    lead: "From accounting concepts and journal entries to final accounts, partnership and company accounts, explained step by step with tools that check your work.",
    intro: "For CA Foundation students preparing for Paper 1 and anyone who wants a strong base in financial accounting. The course follows the units of the CA Foundation Paper 1 syllabus (May 2027 onwards) in four modules, one lesson per unit. Every lesson has notes, a worked example, an interactive tool and two quick checks, followed by a final test and a certificate.",
    exam: "The exam paper is descriptive (written answers), 100 marks, 3 hours.",
    testNote: "(Paper 1 itself is a written paper; this test checks your concepts)",
    certPrefix: "CAFA", certSub: "Theory · Accounting Process · Final Accounts · Partnership & Company Accounts"
  };
  function acc(rows) { return tbl(["Particulars", "Dr (₹)", "Cr (₹)"], rows.map(function (r) { return [r[0], r[1] === "" ? "" : r[1], r[2] === "" ? "" : r[2]]; })); }
  function je(rows) { return tbl(["Journal entry", "Dr (₹)", "Cr (₹)"], rows); }

  /* Running examples (all fictional): Meera's Stationery Mart (sole trader), Arun & Bina (partners), Sunrise Textiles Ltd (company). */
  var LESSONS = [
    /* ---------------- MODULE 1: THEORETICAL FRAMEWORK (Chapter 1) ---------------- */
    {
      id: "1.1", mod: 1, ch: "Chapter 1, Unit 1", title: "Meaning and Scope of Accounting", time: "14 min", tool: "sort",
      tcfg: { d: "Who uses accounting information? Sort each user as internal (inside the business) or external.", buckets: ["Internal user", "External user"], items: [
        ["The owner deciding whether to open a second shop", "Internal user", "Owners and managers run the business from the inside."], ["A bank considering a loan to the business", "External user", "Lenders judge repayment capacity from outside."],
        ["The store manager setting next month's purchase budget", "Internal user", "Managers plan and control operations."], ["The Income-tax Department", "External user", "Tax authorities assess tax on reported income."],
        ["A supplier deciding how much credit to give", "External user", "Creditors check short-term solvency."], ["Employees negotiating a bonus", "External user", "Employees usually rely on published statements, so they are generally treated as external users."],
        ["A prospective investor", "External user", "Investors compare risk and return from outside the business."]] },
      outcomes: ["Define accounting and its three activities: recording, classifying and summarising", "Distinguish book-keeping, accounting and accountancy", "Identify internal and external users and what each needs", "Explain the objectives, functions and limitations of accounting"],
      notes: `<p><b>Accounting</b> is the process of <b>identifying, measuring, recording, classifying, summarising, analysing, interpreting and communicating</b> financial information about an economic entity to the people who use it to make decisions. Only events that can be measured in money and have a financial effect (<b>transactions</b>) are recorded.</p>
<p style="margin-top:10px"><b>Book-keeping</b> is the recording part: making entries in the journal and posting them to ledger accounts. <b>Accounting</b> goes further, preparing the trial balance and financial statements and interpreting them. <b>Accountancy</b> is the whole body of knowledge (principles, rules and practice) behind both. Book-keeping is clerical; accounting needs judgement.</p>
<p style="margin-top:10px">Accounting has two broad <b>objectives</b>: to keep a systematic record of transactions, and to find the <b>results</b> (profit or loss, through the Profit and Loss Account) and the <b>financial position</b> (assets, liabilities and capital, through the Balance Sheet). Its <b>users</b> are internal (owners, managers) and external (lenders, creditors, investors, government and tax authorities, employees, customers, researchers).</p>
<p style="margin-top:10px">Accounting also has <b>limitations</b>: it records only money-measurable items (staff morale or a manager's skill are ignored), it is usually based on historical cost (so it does not reflect inflation), it involves estimates (useful lives, doubtful debts), and it can be distorted by window dressing.</p>`,
      formula: "Identify → Measure → Record → Classify → Summarise → Interpret → Communicate<small>book-keeping is recording; accounting adds summarising, analysis and interpretation</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Book-keeping vs accounting</h4>" + tbl(["Basis", "Book-keeping", "Accounting"], [["Scope", "Recording transactions", "Recording, summarising, analysing, interpreting"], ["Stage", "First stage", "Starts where book-keeping ends"], ["Judgement", "Routine, clerical", "Needs analysis and judgement"], ["Output", "Journal and ledger", "Financial statements and reports"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera opens Meera's Stationery Mart (fictional). In her first week:</p>" +
          tbl(["Event", "Recorded?", "Why"], [["She invests ₹2,00,000 in the business", "Yes", "A money-measurable transaction"], ["She buys pens worth ₹15,000 on credit", "Yes", "Creates a liability to the supplier"], ["A new employee is very hard-working", "No", "Cannot be measured in money"], ["She signs a contract to buy a shelf next month", "Not yet", "No exchange has happened yet"], ["She sells notebooks for ₹4,000 cash", "Yes", "A money-measurable transaction"]]);
      },
      use: ["Use accounting to know profit, financial position and cash flows, and to meet legal and tax requirements.", "Ask 'who will use this information?' to decide what to report and how.", "Mistake: recording events that have no money value or no financial effect yet.", "Mistake: treating book-keeping and accounting as the same thing."],
      walk: function () { return [
        { t: "What accounting does", c: "It turns transactions into useful financial information.", h: chips(["Identify", "Record", "Classify", "Summarise", "Interpret"], "ac") },
        { t: "Only money-measurable events", c: "A loyal employee matters, but is not recorded.", h: chips(["₹ sale ✓", "₹ purchase ✓", "Morale ✗"], function (x, i) { return i < 2 ? "mi" : "hl"; }) },
        { t: "Three related words", c: "Book-keeping ⊂ accounting ⊂ accountancy.", h: box("Book-keeping: recording\nAccounting: + summarising, analysis\nAccountancy: the body of knowledge", "good") },
        { t: "Who uses it?", c: "Internal users run the business; external users judge it from outside.", h: chips(["Owners", "Managers", "Banks", "Investors", "Government"], function (x, i) { return i < 2 ? "ac" : "hl"; }) },
        { t: "Limitations", c: "Historical cost, estimates and money measurement limit what accounts show.", h: chips(["Historical cost", "Estimates", "Window dressing"], "ac") }]; },
      recap: ["Accounting records, summarises and communicates money-measurable transactions", "Book-keeping is recording; users are internal and external"],
      qc: [{ q: "Which of these is recorded in the books?", o: ["Goods sold for cash ₹5,000", "The manager's excellent leadership", "An order received for next month", "A rise in the owner's personal savings"], a: 0, e: "Only transactions of the business that can be measured in money are recorded." },
        { q: "Which stage comes first?", o: ["Book-keeping (recording)", "Interpreting results", "Preparing the balance sheet", "Analysing ratios"], a: 0, e: "Book-keeping is the first stage; accounting builds on it." }]
    },
    {
      id: "1.2", mod: 1, ch: "Chapter 1, Unit 2", title: "Accounting Concepts, Principles and Conventions", time: "16 min", tool: "cases",
      tcfg: { d: "Which concept or principle explains each treatment?", cases: [
        { q: "Meera pays her own house rent from the shop's cash. It is recorded as her drawings, not a shop expense.", o: ["Business entity concept", "Going concern", "Materiality", "Realisation"], a: 0, e: "The business is separate from its owner, so personal expenses are drawings." },
        { q: "December's electricity bill of ₹3,000, paid in January, is shown as an expense of December.", o: ["Accrual concept", "Money measurement", "Consistency", "Dual aspect"], a: 0, e: "Expenses are recorded when incurred, not when paid." },
        { q: "A machine is shown at cost less depreciation, not at what it would fetch if the shop closed tomorrow.", o: ["Going concern", "Prudence", "Entity", "Periodicity"], a: 0, e: "We assume the business will continue, so assets are not valued at break-up prices." },
        { q: "A possible loss from a lawsuit is provided for, but a possible gain from another lawsuit is not recorded.", o: ["Prudence (conservatism)", "Consistency", "Accrual", "Full disclosure"], a: 0, e: "Anticipate probable losses, do not anticipate gains." },
        { q: "A stapler costing ₹250 is written off as an expense although it will last two years.", o: ["Materiality", "Matching", "Cost concept", "Going concern"], a: 0, e: "Immaterial amounts can be treated in the simplest way." },
        { q: "Every transaction affects at least two accounts: cash ₹50,000 brought in increases both cash and capital.", o: ["Dual aspect", "Money measurement", "Realisation", "Entity"], a: 0, e: "Assets = Liabilities + Capital always holds." },
        { q: "Stock is valued by FIFO every year, not FIFO one year and weighted average the next.", o: ["Consistency", "Materiality", "Prudence", "Realisation"], a: 0, e: "Using the same methods year after year makes results comparable." }] },
      outcomes: ["Explain the fundamental assumptions: going concern, consistency and accrual", "Apply the main concepts: entity, money measurement, periodicity, cost, dual aspect, realisation, matching", "Apply the conventions: prudence, materiality, full disclosure and consistency", "Recognise substance over form and the qualitative characteristics of useful information"],
      notes: `<p>Accounts are comparable and reliable only if everyone follows the same ground rules. The three <b>fundamental accounting assumptions</b> (stated in AS 1) are <b>going concern</b> (the business will continue for the foreseeable future), <b>consistency</b> (the same policies are used from period to period) and <b>accrual</b> (revenues and costs are recognised when earned or incurred, not when cash moves). If any assumption is not followed, that fact must be disclosed.</p>
<p style="margin-top:10px">Key <b>concepts</b>: the <b>business entity</b> concept (the business is separate from its owner); <b>money measurement</b> (only items measurable in money are recorded); <b>periodicity</b> (results are found for fixed periods, usually a year); <b>historical cost</b> (assets are recorded at the price paid); <b>dual aspect</b> (every transaction has two effects, so Assets = Liabilities + Capital); <b>realisation</b> (revenue is recognised when it is earned, usually when goods are delivered or services rendered); and <b>matching</b> (expenses are matched with the revenues of the same period).</p>
<p style="margin-top:10px"><b>Conventions</b> guide judgement: <b>prudence or conservatism</b> (provide for probable losses, do not anticipate gains); <b>materiality</b> (small amounts may be treated simply); <b>full disclosure</b> (show all significant information, often in notes); and <b>consistency</b>. <b>Substance over form</b> means transactions are accounted for by their economic reality, not just their legal form: an asset bought on hire purchase is shown as an asset of the buyer even before ownership passes.</p>
<p style="margin-top:10px">Useful financial information should be <b>understandable, relevant, reliable</b> (faithful, neutral, prudent, complete) and <b>comparable</b>.</p>`,
      formula: "Assets = Liabilities + Capital (dual aspect)<small>fundamental assumptions: going concern · consistency · accrual</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Concepts at a glance</h4>" + tbl(["Concept", "In one line"], [["Business entity", "Owner and business are separate"], ["Going concern", "The business will continue"], ["Accrual", "Record when earned or incurred"], ["Matching", "Expenses against the revenue they earn"], ["Realisation", "Revenue when earned, not when ordered"], ["Prudence", "Provide for losses, not for gains"], ["Materiality", "Small items, simple treatment"], ["Substance over form", "Economic reality over legal form"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera starts with ₹2,00,000 capital. Watch the accounting equation stay balanced.</p>" +
          tbl(["Transaction", "Assets", "Liabilities", "Capital"], [["Brings in cash ₹2,00,000", "Cash +2,00,000", "—", "+2,00,000"], ["Buys stock on credit ₹50,000", "Stock +50,000", "Creditors +50,000", "—"], ["Sells stock costing ₹20,000 for ₹30,000 cash", "Cash +30,000, Stock −20,000", "—", "+10,000 (profit)"], ["Totals", "₹2,60,000", "₹50,000", "₹2,10,000"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">₹2,60,000 = ₹50,000 + ₹2,10,000 ✓. Profit increases capital; drawings and losses reduce it.</p>";
      },
      use: ["Use the concepts to decide how to record unusual items consistently.", "Use the accounting equation to check every transaction.", "Mistake: recording the owner's personal expenses as business expenses (breaks the entity concept).", "Mistake: recording expenses only when paid (breaks the accrual concept)."],
      walk: function () { return [
        { t: "Three fundamental assumptions", c: "If any is not followed, disclose it.", h: chips(["Going concern", "Consistency", "Accrual"], "ac") },
        { t: "The business is separate", c: "Personal spending by the owner is drawings.", h: box("Owner's house rent paid from shop cash\n→ Drawings, not Rent expense", "good") },
        { t: "Dual aspect", c: "Every transaction keeps the equation balanced.", h: '<div class="big">A = L + C</div>' },
        { t: "Prudence", c: "Provide for probable losses; never anticipate gains.", h: chips(["Probable loss → provide", "Possible gain → ignore"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Substance over form", c: "Economic reality decides the treatment.", h: chips(["Hire purchase asset → buyer's asset"], "ac") }]; },
      recap: ["Going concern, consistency and accrual are the fundamental assumptions", "Entity, dual aspect, matching and prudence guide everyday entries"],
      qc: [{ q: "Which is NOT a fundamental accounting assumption under AS 1?", o: ["Money measurement", "Going concern", "Consistency", "Accrual"], a: 0, e: "AS 1 names going concern, consistency and accrual." },
        { q: "Closing stock is valued at cost or net realisable value, whichever is lower. Which convention is this?", o: ["Prudence (conservatism)", "Materiality", "Full disclosure", "Entity"], a: 0, e: "Valuing at the lower figure avoids overstating assets and profit." }]
    },
    {
      id: "1.3", mod: 1, ch: "Chapter 1, Unit 3", title: "Capital and Revenue Expenditures and Receipts", time: "15 min", tool: "sort",
      tcfg: { d: "Sort each item of Meera's Stationery Mart. Then check the explanation.", buckets: ["Capital expenditure", "Revenue expenditure", "Capital receipt", "Revenue receipt"], items: [
        ["Purchase of a delivery van ₹6,00,000", "Capital expenditure", "Acquires a long-term asset."], ["Petrol and repairs for the van", "Revenue expenditure", "Day-to-day running cost; benefit used up in the year."],
        ["Installation charges for a new photocopier", "Capital expenditure", "Costs to bring an asset to working condition are capitalised."], ["Salaries of shop staff", "Revenue expenditure", "A recurring operating cost."],
        ["Sale of old furniture ₹12,000", "Capital receipt", "Comes from selling a fixed asset, not from normal trading."], ["Sale of stationery to customers", "Revenue receipt", "Normal trading income."],
        ["Loan of ₹3,00,000 from a bank", "Capital receipt", "Creates a liability; it is not income."], ["Commission received for selling a supplier's products", "Revenue receipt", "Income earned in the normal course."],
        ["Fresh capital brought in by Meera", "Capital receipt", "Increases capital; not income."], ["Extension of the shop building", "Capital expenditure", "Increases earning capacity for many years."]] },
      outcomes: ["Distinguish capital and revenue expenditure", "Identify deferred revenue expenditure and its treatment", "Distinguish capital and revenue receipts", "Explain how wrong classification misstates profit and assets"],
      notes: `<p>Spending is <b>capital expenditure</b> if it brings a benefit over more than one accounting period: buying or building fixed assets, adding to them, or improving them so that their capacity or life increases. Costs needed to get an asset ready for use (freight, installation, legal fees on purchase) are also capitalised. Capital expenditure is shown as an asset in the Balance Sheet and charged to profit gradually through depreciation.</p>
<p style="margin-top:10px"><b>Revenue expenditure</b> gives a benefit only in the current period: salaries, rent, repairs and maintenance that keep an asset in its existing condition, power, and the cost of goods sold. It is charged in full to the Profit and Loss Account. Large spending whose benefit lasts a few years but which does not create a tangible asset (for example a major advertising campaign) used to be spread over those years as <b>deferred revenue expenditure</b>; under current accounting standards most such costs are expensed when incurred unless they qualify as an asset.</p>
<p style="margin-top:10px">A <b>capital receipt</b> does not arise from normal operations: capital introduced, loans taken, and the sale proceeds of fixed assets. A <b>revenue receipt</b> arises in the normal course of business: sales, commission, interest and rent received. Only the profit or loss on selling a fixed asset (sale price minus book value) goes to the Profit and Loss Account, not the whole proceeds.</p>
<p style="margin-top:10px">Classification matters. Treating capital expenditure as revenue <b>understates</b> profit and assets; treating revenue expenditure as capital <b>overstates</b> them.</p>`,
      formula: "Capital: benefit beyond one year → Balance Sheet · Revenue: benefit this year → P&L<small>profit on sale of an asset = sale price − book value (only this goes to P&L)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Repairs or improvement?</h4>" + tbl(["Spending", "Treatment", "Reason"], [["Repainting the shop", "Revenue", "Maintains existing condition"], ["Adding a new floor", "Capital", "Increases capacity"], ["Replacing a worn tyre", "Revenue", "Routine maintenance"], ["Overhaul that extends machine life by 5 years", "Capital", "Extends useful life"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera sells old furniture for ₹12,000. Its book value is ₹15,000.</p>" +
          steps(["The ₹12,000 received is a capital receipt: it comes from selling a fixed asset.", "Loss on sale = book value − sale price = ₹15,000 − ₹12,000 = ₹3,000.", "Only the ₹3,000 loss is charged to the Profit and Loss Account.", "If she had wrongly recorded the ₹12,000 as sales, both revenue and profit would be overstated by ₹12,000, and assets overstated by ₹15,000."]);
      },
      use: ["Capitalise purchase price plus every cost to get the asset ready for use.", "Expense maintenance; capitalise improvements that add capacity or life.", "Mistake: recording loans or capital introduced as income.", "Mistake: taking the full sale price of an asset to the P&L instead of the profit or loss."],
      walk: function () { return [
        { t: "How long is the benefit?", c: "More than a year → capital; this year only → revenue.", h: chips(["Van → capital", "Petrol → revenue"], function (x, i) { return i ? "hl" : "ac"; }) },
        { t: "Costs to get an asset ready", c: "Freight and installation are part of the asset's cost.", h: box("Machine ₹5,00,000\n+ freight ₹20,000\n+ installation ₹30,000\n= Asset ₹5,50,000", "good") },
        { t: "Receipts", c: "Loans, capital and asset sales are capital receipts.", h: chips(["Loan", "Capital", "Asset sale"], "ac") },
        { t: "Only the profit or loss", c: "Book value ₹15,000, sold for ₹12,000 → loss ₹3,000 to P&L.", h: '<div class="big">Loss ₹3,000</div>' },
        { t: "Why it matters", c: "Wrong classification misstates profit and assets.", h: chips(["Capital as revenue → profit too low", "Revenue as capital → profit too high"], "hl") }]; },
      recap: ["Capital expenditure creates long-term benefit; revenue expenditure benefits one period", "Capital receipts are not income; only gain or loss on asset sale goes to P&L"],
      qc: [{ q: "Wages paid for installing a new machine are…", o: ["Capital expenditure", "Revenue expenditure", "A capital receipt", "Deferred revenue expenditure"], a: 0, e: "Installation costs are part of the cost of the asset." },
        { q: "A loan taken from a bank is a…", o: ["Capital receipt", "Revenue receipt", "Revenue expenditure", "Income"], a: 0, e: "It creates a liability; it is not income." }]
    },
    {
      id: "1.4", mod: 1, ch: "Chapter 1, Unit 4", title: "Contingent Assets and Contingent Liabilities", time: "13 min", tool: "cases",
      tcfg: { d: "Decide how each item should be treated in the accounts of Sunrise Textiles Ltd (fictional).", cases: [
        { q: "A customer has sued the company for ₹5 lakh. Lawyers say the company will probably lose and can estimate the loss reliably.", o: ["Recognise a provision", "Disclose as a contingent liability", "Recognise a contingent asset", "Ignore it"], a: 0, e: "Present obligation, probable outflow and a reliable estimate → recognise a provision." },
        { q: "The company has given a guarantee for a supplier's bank loan. Default is possible but not probable.", o: ["Disclose as a contingent liability", "Recognise a provision", "Recognise an asset", "Ignore it"], a: 0, e: "Possible (not probable) outflow → disclose in the notes." },
        { q: "The company has filed a claim of ₹8 lakh against an insurer. Success is probable but not certain.", o: ["Do not recognise; mention in the Board's report, not the financial statements", "Recognise as income now", "Recognise as an asset", "Disclose as a contingent liability"], a: 0, e: "Contingent assets are not recognised; they are usually disclosed in the approving authority's report when inflow is probable." },
        { q: "A tax demand of ₹2 lakh is disputed; the chance of paying is remote.", o: ["No provision and no disclosure needed", "Recognise a provision", "Disclose as a contingent asset", "Recognise income"], a: 0, e: "When an outflow is remote, no disclosure is required." }] },
      outcomes: ["Define provisions, contingent liabilities and contingent assets", "Apply the recognition conditions for a provision", "Decide when to disclose or ignore a contingent liability", "Explain why contingent assets are not recognised"],
      notes: `<p>A <b>provision</b> is a liability of uncertain amount or timing. It is <b>recognised</b> (recorded in the accounts) when three conditions are met: the entity has a <b>present obligation</b> from a past event, an <b>outflow of resources is probable</b>, and the amount can be <b>estimated reliably</b>. Examples: warranty claims on goods already sold, or a lawsuit the business will probably lose.</p>
<p style="margin-top:10px">A <b>contingent liability</b> is either a <b>possible</b> obligation whose existence will be confirmed only by uncertain future events (a guarantee given for another's loan, a case pending in court), or a present obligation that is not recognised because the outflow is not probable or cannot be measured reliably. It is <b>not recorded</b> but is <b>disclosed in the notes</b> to the accounts, unless the chance of an outflow is <b>remote</b>.</p>
<p style="margin-top:10px">A <b>contingent asset</b> is a possible asset whose existence depends on uncertain future events, such as a claim against an insurer or a lawsuit the business has filed. Because of prudence it is <b>neither recognised nor disclosed</b> in the financial statements; when an inflow is probable it is usually mentioned in the report of the approving authority (for a company, the Board's report). If the inflow becomes <b>virtually certain</b>, it is no longer contingent and the asset is recognised. These rules come from AS 29, <i>Provisions, Contingent Liabilities and Contingent Assets</i>.</p>`,
      formula: "Probable + reliable estimate → provision · Possible → disclose · Remote → ignore<small>contingent asset: not recognised; recognise only when virtually certain</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Decision table</h4>" + tbl(["Likelihood of outflow", "Treatment"], [["Probable, reliable estimate", "Recognise a provision"], ["Possible", "Disclose a contingent liability in notes"], ["Remote", "No provision, no disclosure"], ["Inflow virtually certain", "Recognise the asset"], ["Inflow probable", "Contingent asset: mention in Board's report only"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles Ltd sells fans with a one-year warranty. Past experience: 2% of fans sold need repairs costing ₹500 each. It sold 10,000 fans this year.</p>" +
          steps(["A present obligation exists (the warranty on fans already sold).", "An outflow is probable, and can be estimated: 10,000 × 2% = 200 fans × ₹500 = ₹1,00,000.", "Recognise a provision: Dr Warranty expense ₹1,00,000, Cr Provision for warranty ₹1,00,000.", "A separate lawsuit claiming ₹3 lakh, which lawyers think the company will probably win, is disclosed as a contingent liability (outflow possible but not probable)."]);
      },
      use: ["Provide for warranties, probable lawsuit losses and onerous obligations.", "Disclose guarantees and pending claims in the notes.", "Mistake: recording a contingent asset as income because success looks likely.", "Mistake: disclosing every remote possibility (clutters the accounts)."],
      walk: function () { return [
        { t: "Three conditions for a provision", c: "Present obligation · probable outflow · reliable estimate.", h: chips(["Obligation", "Probable", "Estimate"], "ac") },
        { t: "Possible, not probable", c: "Disclose as a contingent liability.", h: box("Guarantee for a supplier's loan\n→ note to accounts", "good") },
        { t: "Remote", c: "No disclosure is needed.", h: chips(["Remote → ignore"], "hl") },
        { t: "Contingent assets", c: "Not recognised: prudence.", h: chips(["Claim against insurer → not recorded"], "ac") },
        { t: "Virtually certain", c: "Then it is a real asset.", h: '<div class="big">Recognise</div>' }]; },
      recap: ["Provision: present obligation, probable outflow, reliable estimate", "Contingent liability disclosed (unless remote); contingent asset not recognised"],
      qc: [{ q: "A guarantee given for a related firm's loan, with default possible but not probable, is…", o: ["A contingent liability disclosed in notes", "A provision", "A contingent asset", "Ignored always"], a: 0, e: "Possible outflow → disclose." },
        { q: "When should a contingent asset be recognised?", o: ["When the inflow is virtually certain", "When it is possible", "When it is probable", "Never"], a: 0, e: "At virtual certainty it stops being contingent and becomes an asset." }]
    },
    {
      id: "1.5", mod: 1, ch: "Chapter 1, Unit 5", title: "Accounting Policies", time: "12 min", tool: "cases",
      tcfg: { d: "Is each a change in accounting policy, a change in estimate, or neither?", cases: [
        { q: "Sunrise Textiles changes its inventory cost formula from FIFO to weighted average to give a more appropriate presentation.", o: ["Change in accounting policy", "Change in accounting estimate", "Neither", "An error"], a: 0, e: "The method of valuation is a policy; changing it is a policy change and must be disclosed with its effect." },
        { q: "The useful life of a machine is revised from 10 to 8 years.", o: ["Change in accounting estimate", "Change in accounting policy", "Neither", "An error"], a: 0, e: "Useful life is an estimate; revising it is a change in estimate, applied from now on." },
        { q: "A new type of transaction appears for the first time and a policy is adopted for it.", o: ["Not a change in policy: adopting a policy for new events", "Change in accounting policy", "Change in estimate", "An error"], a: 0, e: "Adopting a policy for new transactions is not a change in policy." },
        { q: "The provision for doubtful debts is increased from 3% to 5% because customers are paying late.", o: ["Change in accounting estimate", "Change in accounting policy", "Neither", "An error"], a: 0, e: "The percentage is an estimate based on current conditions." }] },
      outcomes: ["Define accounting policies and why they matter", "List major areas that need policies (valuation of inventories, depreciation, revenue)", "Explain the considerations in choosing policies: prudence, substance over form, materiality", "Explain when a policy may be changed and what must be disclosed"],
      notes: `<p><b>Accounting policies</b> are the specific accounting principles and the methods of applying them that an entity adopts in preparing its financial statements. Many items can be accounted for in more than one acceptable way, so the business must choose: for example the cost formula for inventories (FIFO or weighted average), the method of depreciation (straight line or written down value), and the timing of revenue recognition.</p>
<p style="margin-top:10px">AS 1, <i>Disclosure of Accounting Policies</i>, requires all <b>significant</b> accounting policies to be disclosed in one place, normally as the first note to the financial statements. When choosing a policy, the three main considerations are <b>prudence</b>, <b>substance over form</b> and <b>materiality</b>. Disclosure of a policy cannot correct a wrong treatment in the accounts themselves.</p>
<p style="margin-top:10px">A policy should be <b>changed only</b> if a statute or accounting standard requires it, or if the change gives a more appropriate presentation of the financial statements. Any change with a material effect must be disclosed, along with the amount of the effect if it can be found. A change in policy is different from a <b>change in accounting estimate</b> (such as revising useful life or the doubtful-debts percentage), which reflects new information and is applied prospectively.</p>`,
      formula: "Policy = principle + method of applying it<small>change only if required by law or standard, or for a more appropriate presentation; disclose the effect</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Areas that need policies</h4>" + tbl(["Area", "Choices"], [["Inventories", "FIFO, weighted average"], ["Depreciation", "Straight line, written down value"], ["Revenue", "Point of recognition"], ["Investments", "Classification and valuation"], ["Foreign currency", "Translation method"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles switches from FIFO to weighted average. Closing stock would be ₹4,60,000 under FIFO and ₹4,40,000 under weighted average.</p>" +
          steps(["This is a change in accounting policy, allowed because it gives a more appropriate presentation.", "Profit for the year falls by ₹4,60,000 − ₹4,40,000 = ₹20,000.", "The note discloses the change, the reason and the ₹20,000 effect on profit.", "In later years the company keeps using weighted average (consistency)."]);
      },
      use: ["Read the accounting-policies note first when you analyse any company's accounts.", "Separate policy changes from estimate changes before deciding the treatment.", "Mistake: changing policies year to year to smooth profits.", "Mistake: thinking disclosure makes a wrong treatment acceptable."],
      walk: function () { return [
        { t: "What is a policy?", c: "The principles and methods a business chooses.", h: chips(["FIFO or weighted average", "SLM or WDV"], "ac") },
        { t: "Choose with three tests", c: "Prudence, substance over form, materiality.", h: chips(["Prudence", "Substance", "Materiality"], "hl") },
        { t: "Disclose in one place", c: "Usually the first note to the accounts (AS 1).", h: box("Note 1: Significant accounting policies", "good") },
        { t: "When to change", c: "If law or a standard requires it, or for better presentation.", h: chips(["Statute", "Standard", "Better presentation"], "ac") },
        { t: "Policy vs estimate", c: "Method change = policy; new useful life = estimate.", h: chips(["FIFO → WA: policy", "10 → 8 years: estimate"], function (x, i) { return i ? "hl" : "ac"; }) }]; },
      recap: ["Policies are principles and methods; disclose significant ones in one place", "Change only when required or more appropriate; disclose the effect"],
      qc: [{ q: "Which is a change in accounting policy?", o: ["Changing the depreciation method from SLM to WDV", "Revising useful life from 10 to 8 years", "Increasing the doubtful-debts provision", "Correcting a casting error"], a: 0, e: "The method is a policy; useful life and provisions are estimates." },
        { q: "Which is NOT a major consideration in selecting accounting policies under AS 1?", o: ["Tax saving", "Prudence", "Substance over form", "Materiality"], a: 0, e: "AS 1 names prudence, substance over form and materiality." }]
    },
    {
      id: "1.6", mod: 1, ch: "Chapter 1, Unit 6", title: "Accounting as a Measurement Discipline: Valuation Principles and Estimates", time: "14 min", tool: "measure",
      outcomes: ["Explain measurement: identifying objects, choosing a unit and a scale", "Compare historical cost, current cost, realisable value and present value", "Explain why accounting relies on estimates", "Recognise common accounting estimates and how revisions are treated"],
      notes: `<p>Accounting is a <b>measurement discipline</b>: it assigns money values to the resources, obligations and results of a business. Measurement needs three things: the <b>object</b> to measure (an asset, a liability, income), a <b>unit</b> of measurement (rupees), and a <b>scale</b> or basis of valuation. Money is a convenient unit, but its value changes over time with inflation.</p>
<p style="margin-top:10px">There are four main <b>bases of measurement</b>. <b>Historical cost</b>: the amount paid when the asset was acquired. <b>Current cost</b>: what it would cost to acquire the same asset today. <b>Realisable (settlement) value</b>: what the asset would fetch if sold now, less costs of selling. <b>Present value</b>: the discounted value of the future net cash flows the asset is expected to generate. Most financial statements use historical cost, combined with other bases where standards require (for example, inventories at the lower of cost and net realisable value).</p>
<p style="margin-top:10px">Many figures cannot be measured exactly, so accountants make <b>accounting estimates</b>: the useful life and residual value of assets, provisions for doubtful debts, warranty provisions, and the net realisable value of slow-moving stock. Estimates must be reasonable and based on the latest information. When new information arrives, the estimate is <b>revised</b> and the effect is taken in the current and future periods, not by restating past years.</p>`,
      formula: "Historical cost · Current cost · Realisable value · Present value = Σ CFₜ ÷ (1 + r)ᵗ<small>estimates are revised prospectively when new information arrives</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Four bases for one machine</h4>" + tbl(["Basis", "Question it answers"], [["Historical cost", "What did we pay?"], ["Current cost", "What would it cost today?"], ["Realisable value", "What would we get if we sold it now?"], ["Present value", "What are its future cash flows worth today?"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera bought a photocopier three years ago for ₹1,20,000. A new one costs ₹1,50,000 today. A dealer would pay ₹60,000 for hers, with ₹2,000 selling costs. It will earn net cash of ₹30,000 a year for 3 more years; the discount rate is 10%.</p>" +
          tbl(["Basis", "Value"], [["Historical cost", "₹1,20,000"], ["Current cost", "₹1,50,000"], ["Realisable value", "₹60,000 − ₹2,000 = ₹58,000"], ["Present value", "30,000 × (0.9091 + 0.8264 + 0.7513) ≈ ₹74,606"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Same machine, four different values. The basis chosen changes the Balance Sheet.</p>";
      },
      use: ["Use historical cost as the default, and NRV or present value where a standard requires.", "Revise estimates when you get better information, and explain the change.", "Mistake: restating last year's accounts for a change in estimate.", "Mistake: treating estimates as exact facts."],
      walk: function () { return [
        { t: "Measurement needs three things", c: "Object, unit and scale.", h: chips(["Object", "Unit: ₹", "Scale: basis"], "ac") },
        { t: "Historical cost", c: "What was paid: objective and verifiable.", h: '<div class="big">₹1,20,000</div>' },
        { t: "Current and realisable value", c: "Replacement cost today, or net sale value now.", h: chips(["Current ₹1,50,000", "Realisable ₹58,000"], "hl") },
        { t: "Present value", c: "Discount future cash flows.", h: box("30,000/1.1 + 30,000/1.1² + 30,000/1.1³\n≈ ₹74,606", "good") },
        { t: "Estimates", c: "Useful life, residual value, doubtful debts…", h: chips(["Revise → current & future periods"], "ac") }]; },
      recap: ["Four bases: historical cost, current cost, realisable value, present value", "Estimates are unavoidable and revised prospectively"],
      qc: [{ q: "The amount an asset would fetch on sale now, less selling costs, is its…", o: ["Realisable value", "Historical cost", "Current cost", "Present value"], a: 0, e: "Realisable (net selling) value." },
        { q: "A change in the estimated useful life of a machine is applied…", o: ["In the current and future periods", "By restating all past years", "Only in the year of purchase", "Never"], a: 0, e: "Changes in estimates are prospective." }]
    },
    {
      id: "1.7", mod: 1, ch: "Chapter 1, Unit 7", title: "Accounting Standards", time: "13 min", tool: "cases",
      tcfg: { d: "Which Accounting Standard (AS) mainly deals with each issue?", cases: [
        { q: "How should closing stock of a trader be valued?", o: ["AS 2: Valuation of Inventories", "AS 10: Property, Plant and Equipment", "AS 29: Provisions", "AS 1: Disclosure of Accounting Policies"], a: 0, e: "AS 2 covers inventories: lower of cost and NRV." },
        { q: "Which costs can be included in the cost of a new machine, and how is it depreciated?", o: ["AS 10: Property, Plant and Equipment", "AS 2: Inventories", "AS 9: Revenue Recognition", "AS 29: Provisions"], a: 0, e: "AS 10 covers recognition, cost and depreciation of PPE." },
        { q: "Where should a company state that it uses FIFO and SLM?", o: ["AS 1: Disclosure of Accounting Policies", "AS 2: Inventories", "AS 10: PPE", "AS 9: Revenue"], a: 0, e: "AS 1 requires disclosure of significant accounting policies." },
        { q: "When should revenue from sale of goods be recognised?", o: ["AS 9: Revenue Recognition", "AS 1", "AS 2", "AS 29"], a: 0, e: "AS 9 deals with revenue from sales, services, interest, royalties and dividends." },
        { q: "How should a warranty obligation be treated?", o: ["AS 29: Provisions, Contingent Liabilities and Contingent Assets", "AS 9", "AS 10", "AS 2"], a: 0, e: "AS 29 covers provisions and contingencies." }] },
      outcomes: ["Explain what Accounting Standards are and why they are needed", "Describe how standards are formulated and notified in India", "Distinguish Accounting Standards (AS) and Indian Accounting Standards (Ind AS) at a basic level", "Name the main standards relevant at the Foundation level"],
      notes: `<p><b>Accounting Standards</b> are written policy documents issued by an expert body that set out how particular transactions and events should be <b>recognised, measured, presented and disclosed</b> in financial statements. They reduce the number of acceptable alternatives, make statements of different businesses <b>comparable</b>, improve <b>reliability</b>, and help auditors and regulators. They cannot override the law: if a statute requires a different treatment, the statute prevails.</p>
<p style="margin-top:10px">In India, the <b>Accounting Standards Board (ASB)</b> of the ICAI formulates standards after studying the issue, issuing exposure drafts for public comment and considering the responses. For companies, standards are prescribed by the <b>Central Government</b> under <b>section 133</b> of the Companies Act, 2013, on the recommendation of the ICAI and after examination by the <b>National Financial Reporting Authority (NFRA)</b>. Standards for non-corporate entities are issued by the ICAI.</p>
<p style="margin-top:10px">India now has two sets: <b>Accounting Standards (AS)</b>, applied by smaller and non-corporate entities and companies that are not required to adopt Ind AS, and <b>Indian Accounting Standards (Ind AS)</b>, converged with International Financial Reporting Standards (IFRS) and mandatory for listed companies and large companies above specified net-worth limits. At the Foundation level, focus on the purpose of standards and on AS 1 (accounting policies), AS 2 (inventories), AS 9 (revenue), AS 10 (property, plant and equipment) and AS 29 (provisions and contingencies).</p>`,
      formula: "Standards → recognition · measurement · presentation · disclosure<small>companies: notified by the Central Government under s.133, Companies Act 2013</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Key standards for Paper 1</h4>" + tbl(["Standard", "Subject"], [["AS 1", "Disclosure of Accounting Policies"], ["AS 2", "Valuation of Inventories"], ["AS 9", "Revenue Recognition"], ["AS 10", "Property, Plant and Equipment"], ["AS 29", "Provisions, Contingent Liabilities and Contingent Assets"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Two traders value identical closing stock. One uses cost (₹5,00,000); the other uses expected selling price (₹6,20,000).</p>" +
          steps(["Without a standard, their profits differ by ₹1,20,000 for the same stock.", "AS 2 requires valuation at the lower of cost and net realisable value.", "Both must now show ₹5,00,000 (if NRV is above cost), so their accounts are comparable.", "This is exactly why standards exist: fewer alternatives, more comparability."]);
      },
      use: ["Identify the standard that governs a question before you answer it.", "Remember that law prevails over a standard if they conflict.", "Mistake: assuming all companies use the same set of standards (AS vs Ind AS).", "Mistake: thinking standards are optional guidance."],
      walk: function () { return [
        { t: "Why standards?", c: "Comparability, reliability, fewer alternatives.", h: chips(["Comparable", "Reliable", "Consistent"], "ac") },
        { t: "Who makes them?", c: "ICAI's Accounting Standards Board.", h: box("Study → exposure draft → comments\n→ standard", "good") },
        { t: "For companies", c: "Notified by the Central Government under s.133, after NFRA's review.", h: chips(["ICAI", "NFRA", "Central Government"], "hl") },
        { t: "AS and Ind AS", c: "Ind AS is converged with IFRS for larger companies.", h: chips(["AS", "Ind AS"], "ac") },
        { t: "Foundation focus", c: "AS 1, 2, 9, 10 and 29.", h: chips(["AS 1", "AS 2", "AS 9", "AS 10", "AS 29"], "ac") }]; },
      recap: ["Standards make accounts comparable and reliable; law prevails if they conflict", "For companies, prescribed under s.133 on ICAI's recommendation after NFRA's review"],
      qc: [{ q: "Which body in the ICAI formulates Accounting Standards?", o: ["Accounting Standards Board (ASB)", "Auditing and Assurance Standards Board", "NFRA", "SEBI"], a: 0, e: "The ASB formulates standards; NFRA examines them for companies." },
        { q: "Which AS deals with the valuation of inventories?", o: ["AS 2", "AS 10", "AS 9", "AS 29"], a: 0, e: "AS 2: Valuation of Inventories." }]
    },

    /* ---------------- MODULE 2: ACCOUNTING PROCESS AND SPECIAL TOPICS (Chapters 2–6) ---------------- */
    {
      id: "2.1", mod: 2, ch: "Chapter 2, Unit 1", title: "Basic Accounting Procedures: Journal Entries", time: "16 min", tool: "journal",
      tcfg: { accounts: ["Cash", "Bank", "Capital", "Purchases", "Sales", "Kapoor Paper Co (creditor)", "Sita (debtor)", "Rent", "Drawings", "Furniture"], tx: [
        ["Meera starts the business with cash ₹2,00,000", "Cash", "Capital", "Cash (asset) increases → debit; capital increases → credit."],
        ["Deposits ₹1,20,000 cash into the bank", "Bank", "Cash", "Bank increases (debit); cash decreases (credit). A contra entry."],
        ["Buys goods on credit from Kapoor Paper Co ₹50,000", "Purchases", "Kapoor Paper Co (creditor)", "Purchases (expense) debit; liability to the supplier credit."],
        ["Sells goods to Rahul for cash ₹30,000", "Cash", "Sales", "Cash in (debit); revenue (credit)."],
        ["Sells goods on credit to Sita ₹18,000", "Sita (debtor)", "Sales", "Sita owes us (asset, debit); revenue (credit)."],
        ["Pays rent by cheque ₹8,000", "Rent", "Bank", "Expense (debit); bank decreases (credit)."],
        ["Pays Kapoor Paper Co ₹30,000 by cheque", "Kapoor Paper Co (creditor)", "Bank", "Liability falls (debit); bank falls (credit)."],
        ["Receives ₹10,000 cash from Sita", "Cash", "Sita (debtor)", "Cash in (debit); the debtor's balance falls (credit)."],
        ["Withdraws ₹5,000 cash for personal use", "Drawings", "Cash", "Drawings reduce capital (debit); cash out (credit)."],
        ["Buys furniture for cash ₹12,000", "Furniture", "Cash", "Asset in (debit); cash out (credit)."]] },
      outcomes: ["Explain the double-entry system and the accounting equation", "Classify accounts and apply debit and credit rules", "Write journal entries, including compound entries, with narrations", "Distinguish the traditional (personal, real, nominal) and modern approaches"],
      notes: `<p>Under the <b>double-entry system</b>, every transaction has two equal and opposite effects: one account is <b>debited</b> and another is <b>credited</b> with the same amount. This keeps the accounting equation (<b>Assets = Liabilities + Capital</b>) balanced and lets us check arithmetic accuracy through a trial balance.</p>
<p style="margin-top:10px">The <b>modern (accounting equation) approach</b> classifies accounts into five types. <b>Assets</b> and <b>expenses/losses</b> increase with a debit and decrease with a credit. <b>Liabilities</b>, <b>capital</b> and <b>revenues/gains</b> increase with a credit and decrease with a debit. Drawings reduce capital, so drawings are debited.</p>
<p style="margin-top:10px">The <b>traditional approach</b> gives three golden rules. <b>Personal accounts</b> (people, firms, companies): debit the receiver, credit the giver. <b>Real accounts</b> (assets): debit what comes in, credit what goes out. <b>Nominal accounts</b> (expenses, losses, incomes, gains): debit all expenses and losses, credit all incomes and gains. Both approaches give the same entries.</p>
<p style="margin-top:10px">The <b>journal</b> is the book of original entry: transactions are recorded in date order, with the debit account first, the credit account below it (prefixed "To"), the amounts, and a short <b>narration</b> explaining the entry. A <b>compound entry</b> has more than one debit or credit, for example a cash sale where part is received by cheque.</p>`,
      formula: "Assets & expenses: Dr ↑ Cr ↓ · Liabilities, capital & incomes: Cr ↑ Dr ↓<small>personal: debit the receiver, credit the giver · real: debit what comes in · nominal: debit expenses, credit incomes</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Debit and credit rules (modern approach)</h4>" + tbl(["Type", "Increase", "Decrease"], [["Asset", "Debit", "Credit"], ["Expense / loss", "Debit", "Credit"], ["Liability", "Credit", "Debit"], ["Capital", "Credit", "Debit"], ["Revenue / gain", "Credit", "Debit"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera sells goods for ₹25,000: ₹15,000 in cash and the rest by a cheque deposited at once.</p>" +
          je([["Cash A/c Dr", "15,000", ""], ["Bank A/c Dr", "10,000", ""], ["&nbsp;&nbsp;&nbsp;To Sales A/c", "", "25,000"], ["<i>(Being goods sold for cash and cheque)</i>", "", ""]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">A compound entry: total debits ₹25,000 = total credits ₹25,000. Try the 10 transactions of Meera's first month in the tool below.</p>";
      },
      use: ["Ask two questions for each transaction: which accounts are affected, and does each increase or decrease?", "Always write a narration; it explains the entry to anyone reading the books.", "Mistake: debiting Purchases for buying furniture (furniture is an asset, not goods for resale).", "Mistake: recording the owner's personal withdrawal as an expense."],
      walk: function () { return [
        { t: "Two sides, equal amounts", c: "Every transaction has a debit and a credit.", h: box("Cash A/c Dr 2,00,000\n   To Capital A/c 2,00,000", "good") },
        { t: "Five account types", c: "Assets, expenses, liabilities, capital, revenues.", h: chips(["Assets", "Expenses", "Liabilities", "Capital", "Revenues"], function (x, i) { return i < 2 ? "ac" : "hl"; }) },
        { t: "Debit side grows", c: "Assets and expenses increase with a debit.", h: chips(["Cash ↑ → Dr", "Rent ↑ → Dr"], "ac") },
        { t: "Credit side grows", c: "Liabilities, capital and revenue increase with a credit.", h: chips(["Creditor ↑ → Cr", "Sales ↑ → Cr"], "hl") },
        { t: "Narration", c: "A short line explaining why the entry was made.", h: chips(["(Being goods sold on credit to Sita)"], "ac") }]; },
      recap: ["Double entry: equal debits and credits for every transaction", "Assets & expenses increase with debit; liabilities, capital & incomes with credit"],
      qc: [{ q: "Goods purchased on credit from Ravi. Which account is credited?", o: ["Ravi", "Purchases", "Cash", "Sales"], a: 0, e: "Ravi is the giver (a liability increases), so Ravi is credited." },
        { q: "Rent paid in cash. The correct entry is…", o: ["Rent A/c Dr, To Cash A/c", "Cash A/c Dr, To Rent A/c", "Rent A/c Dr, To Capital A/c", "Capital A/c Dr, To Cash A/c"], a: 0, e: "Expense increases (debit); cash decreases (credit)." }]
    },
    {
      id: "2.2", mod: 2, ch: "Chapter 2, Unit 2", title: "Ledgers", time: "14 min", tool: "ledger",
      outcomes: ["Explain the purpose of the ledger and the format of a ledger account", "Post journal entries to the correct side of each account", "Balance ledger accounts using balance c/d and b/d", "Interpret debit and credit balances"],
      notes: `<p>The journal lists transactions in date order, but it cannot tell you how much cash you have or how much a customer owes. The <b>ledger</b> is the <b>principal book</b> that groups all transactions relating to one account in one place. Each account has a <b>debit side</b> (left) and a <b>credit side</b> (right); the familiar "T-account" is its simplest form.</p>
<p style="margin-top:10px"><b>Posting</b> is transferring entries from the journal to the ledger. For each journal entry, the account debited gets an entry on its debit side, with the name of the account credited written in the particulars column ("To Capital A/c"). The account credited gets an entry on its credit side naming the account debited ("By Cash A/c"). A <b>ledger folio (L.F.)</b> column links the two books.</p>
<p style="margin-top:10px">To <b>balance</b> an account, total both sides, write the difference on the lighter side as <b>"Balance c/d"</b> (carried down), make both totals equal, and bring the balance down on the opposite side at the start of the next period as <b>"Balance b/d"</b>. A <b>debit balance</b> means an asset, an expense or drawings (for example cash, debtors, rent). A <b>credit balance</b> means a liability, capital or income (for example creditors, loans, sales). Nominal accounts are not carried forward; they are closed by transfer to the Trading and Profit and Loss Account.</p>`,
      formula: "Balance = bigger side − smaller side → c/d on the smaller side, b/d on the bigger side<small>debit balance: asset, expense, drawings · credit balance: liability, capital, income</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Cash account of Meera's Stationery Mart</h4>" + tbl(["Dr", "₹", "Cr", "₹"], [["To Capital", "2,00,000", "By Bank", "1,20,000"], ["To Sales", "30,000", "By Drawings", "5,000"], ["To Sita", "10,000", "By Furniture", "12,000"], ["", "", "By Balance c/d", "<b>1,03,000</b>"], ["Total", "2,40,000", "Total", "2,40,000"], ["To Balance b/d", "1,03,000", "", ""]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Posting Meera's journal entry \"Purchases A/c Dr ₹50,000, To Kapoor Paper Co ₹50,000\":</p>" +
          steps(["In the Purchases account, debit side: \"To Kapoor Paper Co ₹50,000\".", "In Kapoor Paper Co's account, credit side: \"By Purchases ₹50,000\".", "Later, \"Kapoor Paper Co A/c Dr ₹30,000, To Bank\" is posted to Kapoor's debit side.", "Kapoor's account: credit ₹50,000 − debit ₹30,000 = credit balance ₹20,000 (Meera still owes him)."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Use the tool to post all ten entries of Meera's first month and balance every account.</p>";
      },
      use: ["Use the ledger to find the balance of any account at any time.", "Check each posting: the name written is always the other account in the entry.", "Mistake: posting to the wrong side (debit entries go to the debit side).", "Mistake: carrying forward nominal accounts like rent or sales to the next year."],
      walk: function () { return [
        { t: "Journal → ledger", c: "Journal is in date order; the ledger groups by account.", h: chips(["Journal", "→", "Ledger"], function (x, i) { return i === 1 ? "" : "ac"; }) },
        { t: "Post to both accounts", c: "Write the other account's name in particulars.", h: box("Purchases A/c: To Kapoor 50,000 (Dr)\nKapoor A/c: By Purchases 50,000 (Cr)", "good") },
        { t: "Balance the account", c: "Difference goes on the lighter side as c/d.", h: chips(["Total Dr", "Total Cr", "Balance c/d"], "ac") },
        { t: "Bring it down", c: "Balance b/d starts next period.", h: '<div class="big">Cash b/d ₹1,03,000</div>' },
        { t: "Read the balance", c: "Debit = asset/expense; credit = liability/capital/income.", h: chips(["Sita Dr ₹8,000", "Kapoor Cr ₹20,000"], function (x, i) { return i ? "hl" : "ac"; }) }]; },
      recap: ["The ledger groups transactions by account; post every entry to two accounts", "Balance c/d on the lighter side; b/d on the opposite side next period"],
      qc: [{ q: "A debit balance in a customer's account means…", o: ["The customer owes the business", "The business owes the customer", "The account is closed", "An income"], a: 0, e: "A debtor is an asset with a debit balance." },
        { q: "In which account is \"By Purchases ₹50,000\" written?", o: ["The supplier's account, credit side", "Purchases account, debit side", "Cash account", "Sales account"], a: 0, e: "The credited account (supplier) records the debited account's name with \"By\"." }]
    },
    {
      id: "2.3", mod: 2, ch: "Chapter 2, Unit 3", title: "Trial Balance", time: "13 min", tool: "tb",
      outcomes: ["Explain the purpose and limitations of a trial balance", "Prepare a trial balance from ledger balances", "Identify which balances are debit and which are credit", "Know which errors a trial balance does and does not reveal"],
      notes: `<p>A <b>trial balance</b> is a statement listing the balances of all ledger accounts on a particular date, debit balances in one column and credit balances in another. Because every debit has an equal credit, the two totals should agree. Its purposes are to <b>check the arithmetical accuracy</b> of postings and balancing, to <b>summarise</b> the ledger, and to serve as the <b>basis for preparing the financial statements</b>.</p>
<p style="margin-top:10px">Debit balances include assets (cash, bank, debtors, furniture, stock), expenses and losses (purchases, wages, rent), drawings and sales returns. Credit balances include capital, liabilities (creditors, loans, bills payable), incomes and gains (sales, commission received) and purchase returns. Opening stock appears in the trial balance; closing stock usually does not, unless it has already been adjusted against purchases.</p>
<p style="margin-top:10px">A trial balance that agrees is <b>not proof</b> that the books are free of errors. It does not reveal <b>errors of omission</b> (a transaction left out completely), <b>errors of commission</b> posted to the wrong account of the same class, <b>errors of principle</b> (furniture debited to purchases), <b>compensating errors</b> that cancel each other, or a wrong amount recorded in the journal itself. It does reveal one-sided postings, wrong totals, posting to the wrong side, and posting a different amount from the journal. If it does not agree and the error cannot be found at once, the difference is put in a <b>Suspense Account</b> so that work can continue.</p>`,
      formula: "Σ Debit balances = Σ Credit balances<small>agreement checks arithmetic only · difference → Suspense A/c until the error is found</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Errors a trial balance will and will not show</h4>" + tbl(["Error", "Shown by trial balance?"], [["Posted to the wrong side", "Yes"], ["Wrong total of an account", "Yes"], ["One side of an entry not posted", "Yes"], ["Transaction omitted completely", "No"], ["Error of principle", "No"], ["Compensating errors", "No"], ["Posted to the wrong person's account, correct side", "No"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera's ledger balances after her first month:</p>" +
          tbl(["Account", "Dr (₹)", "Cr (₹)"], [["Cash", "1,03,000", ""], ["Bank", "82,000", ""], ["Capital", "", "2,00,000"], ["Purchases", "50,000", ""], ["Sales", "", "48,000"], ["Kapoor Paper Co", "", "20,000"], ["Sita", "8,000", ""], ["Rent", "8,000", ""], ["Drawings", "5,000", ""], ["Furniture", "12,000", ""], ["<b>Total</b>", "<b>2,68,000</b>", "<b>2,68,000</b>"]]);
      },
      use: ["Prepare a trial balance before every set of final accounts.", "If it does not agree, check totals, then postings, then balancing, before using a suspense account.", "Mistake: putting drawings or sales returns on the credit side.", "Mistake: assuming an agreed trial balance means there are no errors."],
      walk: function () { return [
        { t: "A list of balances", c: "Every ledger account, on one date.", h: chips(["Debit column", "Credit column"], "ac") },
        { t: "Totals must agree", c: "Double entry guarantees it, if arithmetic is right.", h: '<div class="big">₹2,68,000 = ₹2,68,000</div>' },
        { t: "Which side?", c: "Assets, expenses, drawings: debit. Capital, liabilities, incomes: credit.", h: chips(["Drawings → Dr", "Sales → Cr"], function (x, i) { return i ? "hl" : "ac"; }) },
        { t: "Hidden errors", c: "Omission, principle and compensating errors don't show.", h: chips(["Omission", "Principle", "Compensating"], "hl") },
        { t: "Suspense account", c: "A temporary home for an unexplained difference.", h: box("Dr total 2,68,500\nCr total 2,68,000\n→ Suspense Cr 500", "good") }]; },
      recap: ["A trial balance checks arithmetical accuracy and is the base for final accounts", "Agreement does not prove there are no errors"],
      qc: [{ q: "Which error does a trial balance reveal?", o: ["Wages posted to the credit side of the Wages account", "Furniture purchase debited to Purchases", "A sale left out of the books", "Two equal errors on opposite sides"], a: 0, e: "Posting to the wrong side disturbs the totals." },
        { q: "Drawings appear in the trial balance on the…", o: ["Debit side", "Credit side", "Either side", "Never"], a: 0, e: "Drawings reduce capital, so they have a debit balance." }]
    },
    {
      id: "2.4", mod: 2, ch: "Chapter 2, Unit 4", title: "Subsidiary Books", time: "13 min", tool: "sort",
      tcfg: { d: "In which book of original entry should each transaction of Meera's Stationery Mart be recorded?", buckets: ["Purchases Book", "Sales Book", "Purchase Returns Book", "Sales Returns Book", "Cash Book", "Journal Proper"], items: [
        ["Bought 200 registers on credit from Kapoor Paper Co", "Purchases Book", "Credit purchases of goods only."], ["Sold notebooks on credit to Sita", "Sales Book", "Credit sales of goods only."],
        ["Returned 10 damaged registers to Kapoor Paper Co", "Purchase Returns Book", "Goods returned to a supplier (returns outward)."], ["Sita returned 5 notebooks", "Sales Returns Book", "Goods returned by a customer (returns inward)."],
        ["Paid electricity bill in cash", "Cash Book", "All cash and bank transactions."], ["Bought a computer on credit for office use", "Journal Proper", "Credit purchase of an asset, not goods: Journal Proper."],
        ["Depreciation charged on furniture", "Journal Proper", "Adjustment entries go to the Journal Proper."], ["Sold goods for cash", "Cash Book", "Cash sales are recorded in the Cash Book, not the Sales Book."]] },
      outcomes: ["Explain why the journal is subdivided into subsidiary books", "Record transactions in the purchases, sales and returns books", "Know what goes in the cash book, bills books and journal proper", "Post subsidiary book totals to the ledger"],
      notes: `<p>In a business with many transactions, writing every one in a single journal is slow and makes division of work hard. So the journal is divided into <b>subsidiary books</b> (special journals), each recording one type of repeated transaction. They are still <b>books of original entry</b>.</p>
<p style="margin-top:10px">The <b>Purchases Book</b> records <b>credit purchases of goods</b> (items bought for resale) only; cash purchases and purchases of assets are excluded. The <b>Sales Book</b> records <b>credit sales of goods</b> only. The <b>Purchase Returns (Returns Outward) Book</b> records goods returned to suppliers, usually supported by a <b>debit note</b>; the <b>Sales Returns (Returns Inward) Book</b> records goods returned by customers, supported by a <b>credit note</b>. The <b>Cash Book</b> records all cash and bank receipts and payments, and the <b>Bills Receivable and Bills Payable Books</b> record bills of exchange. Everything else, such as credit purchase of assets, adjustment entries, opening and closing entries and rectification, goes to the <b>Journal Proper</b>.</p>
<p style="margin-top:10px"><b>Posting</b>: each item in the purchases book is credited to the individual supplier's account, and the <b>periodic total</b> is debited to the Purchases account. Each item in the sales book is debited to the customer's account, and the total is credited to the Sales account. Returns books work the other way round. Trade discount is deducted before entry; it is never recorded in the books.</p>`,
      formula: "Credit purchases of goods → Purchases Book · credit sales of goods → Sales Book<small>post individual items to personal accounts; post the periodic total to the nominal account</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Which book?</h4>" + tbl(["Transaction", "Book"], [["Credit purchase of goods", "Purchases Book"], ["Credit sale of goods", "Sales Book"], ["Goods returned to supplier", "Purchase Returns Book"], ["Goods returned by customer", "Sales Returns Book"], ["Cash or bank transaction", "Cash Book"], ["Credit purchase of an asset", "Journal Proper"], ["Adjustments, rectification", "Journal Proper"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera's Sales Book for May (credit sales after 10% trade discount):</p>" +
          tbl(["Date", "Customer", "Details", "₹"], [["May 3", "Sita", "50 notebooks @ ₹80 = 4,000 − 10% TD", "3,600"], ["May 9", "Rao & Co", "200 pens @ ₹25 = 5,000 − 10% TD", "4,500"], ["May 21", "Sita", "30 files @ ₹100 = 3,000 − 10% TD", "2,700"], ["May 31", "", "<b>Total credited to Sales A/c</b>", "<b>10,800</b>"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Sita's account is debited ₹3,600 and ₹2,700; Rao & Co's ₹4,500. The total ₹10,800 is credited to the Sales account once.</p>";
      },
      use: ["Use subsidiary books to divide work and save time posting.", "Record goods net of trade discount; cash discount is recorded in the cash book.", "Mistake: entering cash sales in the Sales Book.", "Mistake: entering the credit purchase of an asset in the Purchases Book."],
      walk: function () { return [
        { t: "Why split the journal?", c: "One book per type of repeated transaction.", h: chips(["Purchases", "Sales", "Returns", "Cash", "Bills", "Journal Proper"], "ac") },
        { t: "Purchases Book", c: "Credit purchases of goods only.", h: chips(["Credit ✓", "Goods ✓", "Cash ✗", "Assets ✗"], function (x, i) { return i < 2 ? "mi" : "hl"; }) },
        { t: "Returns", c: "Debit note to the supplier; credit note to the customer.", h: chips(["Returns outward", "Returns inward"], "ac") },
        { t: "Posting", c: "Items to personal accounts; total to the nominal account.", h: box("Sita Dr 3,600, Dr 2,700\nRao & Co Dr 4,500\nSales A/c Cr 10,800 (total)", "good") },
        { t: "Journal Proper", c: "Anything that fits no other book.", h: chips(["Asset on credit", "Depreciation", "Rectification"], "hl") }]; },
      recap: ["Subsidiary books record repeated types of transaction: they are books of original entry", "Post individual items to personal accounts and periodic totals to nominal accounts"],
      qc: [{ q: "Goods returned by a customer are recorded in the…", o: ["Sales Returns Book", "Purchase Returns Book", "Sales Book", "Cash Book"], a: 0, e: "Returns inward go to the Sales Returns Book." },
        { q: "Credit purchase of furniture for office use is recorded in the…", o: ["Journal Proper", "Purchases Book", "Cash Book", "Sales Book"], a: 0, e: "The Purchases Book is only for goods bought for resale." }]
    },
    {
      id: "2.5", mod: 2, ch: "Chapter 2, Unit 5", title: "Cash Book", time: "15 min", tool: "cashbook",
      outcomes: ["Explain why the cash book is both a journal and a ledger", "Prepare simple, two-column and three-column cash books", "Record contra entries and cash discount correctly", "Prepare a petty cash book on the imprest system"],
      notes: `<p>The <b>Cash Book</b> records all cash and bank receipts on its debit side and all payments on its credit side. It is a book of original entry <b>and</b> a ledger at the same time: because cash transactions are recorded here directly, a separate Cash Account or Bank Account is not needed in the ledger.</p>
<p style="margin-top:10px">A <b>simple cash book</b> has one amount column on each side. A <b>two-column cash book</b> adds a <b>bank</b> column, and a <b>three-column cash book</b> also has a <b>discount</b> column. The cash column can never show a credit balance (you cannot pay more cash than you have), but the bank column can, which means a <b>bank overdraft</b>.</p>
<p style="margin-top:10px">A <b>contra entry</b> affects both cash and bank: depositing cash into the bank is entered on the debit side in the bank column and on the credit side in the cash column, marked "C" in the folio column. Withdrawing cash from the bank for office use is the reverse.</p>
<p style="margin-top:10px">The discount columns record <b>cash discount</b>: discount allowed (to customers who pay promptly) on the debit side, and discount received (from suppliers) on the credit side. These columns are memorandum only; their totals are posted to the Discount Allowed account (debit) and Discount Received account (credit). Small expenses are kept in a <b>petty cash book</b>, usually on the <b>imprest system</b>: the petty cashier gets a fixed float, and at the end of each period is reimbursed exactly what was spent, so the float is restored.</p>`,
      formula: "Debit: receipts (cash, bank, discount allowed) · Credit: payments (cash, bank, discount received)<small>contra entry = cash ↔ bank, marked C · cash balance can never be credit</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Imprest petty cash</h4>" + tbl(["Step", "Amount"], [["Float given on 1 June", "₹5,000"], ["Spent during June (postage, cartage, tea)", "₹3,840"], ["Balance in hand on 30 June", "₹1,160"], ["Reimbursed by main cashier", "₹3,840"], ["Float on 1 July", "₹5,000"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera's June: opening cash ₹20,000 and bank ₹40,000. Cash sales ₹15,000; deposits ₹25,000 into the bank (contra); receives a cheque of ₹9,800 from Sita in full settlement of ₹10,000 (discount ₹200); pays Kapoor ₹14,600 by cheque in settlement of ₹15,000 (discount ₹400); pays wages ₹6,000 in cash.</p>" +
          tbl(["", "Cash", "Bank", "Discount"], [["Opening + receipts (Dr)", "20,000 + 15,000 = 35,000", "40,000 + 25,000 + 9,800 = 74,800", "Allowed 200"], ["Payments (Cr)", "25,000 + 6,000 = 31,000", "14,600", "Received 400"], ["<b>Closing balance</b>", "<b>4,000</b>", "<b>60,200</b>", ""]]);
      },
      use: ["Use a three-column cash book when you allow and receive cash discounts.", "Mark every contra entry with C so it is not posted to the ledger.", "Mistake: posting the discount columns as part of cash or bank.", "Mistake: a credit balance in the cash column (always an error)."],
      walk: function () { return [
        { t: "Journal and ledger in one", c: "No separate Cash or Bank account is needed.", h: chips(["Book of original entry", "Ledger account"], "ac") },
        { t: "Receipts left, payments right", c: "Debit side: money in. Credit side: money out.", h: chips(["Dr: receipts", "Cr: payments"], function (x, i) { return i ? "hl" : "ac"; }) },
        { t: "Contra entries", c: "Cash to bank: bank Dr, cash Cr, marked C.", h: box("Dr  Bank 25,000 (C)\nCr  Cash 25,000 (C)", "good") },
        { t: "Discount columns", c: "Memorandum; totals posted to Discount accounts.", h: chips(["Allowed ₹200", "Received ₹400"], "ac") },
        { t: "Petty cash on imprest", c: "Reimburse exactly what was spent.", h: '<div class="big">Float ₹5,000</div>' }]; },
      recap: ["The cash book is both a journal and a ledger; three columns: cash, bank, discount", "Contra entries move money between cash and bank; cash can never be in credit"],
      qc: [{ q: "Cash withdrawn from the bank for office use is recorded as…", o: ["Cash column Dr, bank column Cr (contra)", "Bank column Dr, cash column Cr", "Drawings", "Only in the bank column"], a: 0, e: "Cash comes in (debit), bank goes down (credit): a contra entry." },
        { q: "The bank column of a cash book shows a credit balance. This means…", o: ["A bank overdraft", "An error", "Cash in hand", "Discount received"], a: 0, e: "Payments from the bank exceeded deposits: an overdraft." }]
    },
    {
      id: "2.6", mod: 2, ch: "Chapter 2, Unit 6", title: "Rectification of Errors", time: "16 min", tool: "cases",
      tcfg: { d: "Choose the correct rectifying entry. Where the trial balance did not agree, the difference was placed in a Suspense Account.", cases: [
        { q: "Furniture bought for ₹8,000 was debited to Purchases account.", o: ["Furniture A/c Dr 8,000, To Purchases A/c 8,000", "Purchases A/c Dr, To Furniture A/c", "Furniture A/c Dr, To Suspense A/c", "No entry needed"], a: 0, e: "An error of principle: cancel the wrong debit and record the asset. No suspense effect." },
        { q: "Sales book was undercast (totalled short) by ₹1,000.", o: ["Suspense A/c Dr 1,000, To Sales A/c 1,000", "Sales A/c Dr, To Suspense A/c", "Debtors A/c Dr, To Sales A/c", "No entry needed"], a: 0, e: "Sales were credited ₹1,000 less: credit Sales and debit Suspense (one-sided error)." },
        { q: "₹2,500 received from Rao & Co was credited to Rao Brothers' account.", o: ["Rao Brothers A/c Dr 2,500, To Rao & Co A/c 2,500", "Rao & Co A/c Dr, To Rao Brothers A/c", "Suspense A/c Dr, To Rao & Co A/c", "Cash A/c Dr, To Rao & Co A/c"], a: 0, e: "An error of commission between two personal accounts; the trial balance still agreed." },
        { q: "Wages of ₹3,000 paid were posted to the credit side of the Wages account.", o: ["Wages A/c Dr 6,000, To Suspense A/c 6,000", "Wages A/c Dr 3,000, To Suspense A/c 3,000", "Suspense A/c Dr 6,000, To Wages A/c 6,000", "Wages A/c Dr 3,000, To Cash A/c 3,000"], a: 0, e: "To reverse ₹3,000 on the wrong side and put ₹3,000 on the right side, debit Wages ₹6,000 (twice the amount)." },
        { q: "A credit sale of ₹4,000 to Sita was not recorded at all.", o: ["Sita A/c Dr 4,000, To Sales A/c 4,000", "Suspense A/c Dr, To Sales A/c", "Sales A/c Dr, To Sita A/c", "No entry needed"], a: 0, e: "An error of omission: record the transaction now. No suspense effect." }] },
      outcomes: ["Classify errors: omission, commission, principle and compensating", "Distinguish errors that affect the trial balance from those that do not", "Pass rectifying entries, using a suspense account where needed", "Find the effect of errors and their rectification on profit"],
      notes: `<p>Errors are classified as: <b>errors of omission</b> (a transaction left out wholly or partly); <b>errors of commission</b> (wrong amount, wrong account of the same class, wrong side, wrong totalling or carrying forward); <b>errors of principle</b> (treating capital items as revenue or vice versa, such as debiting furniture to purchases); and <b>compensating errors</b> (two or more errors that cancel each other's effect).</p>
<p style="margin-top:10px"><b>One-sided errors</b> affect only one account (wrong totalling, posting to only one side, posting to the wrong side, wrong balancing) and make the trial balance disagree. <b>Two-sided errors</b> affect two accounts equally (omission, principle, posting to the wrong account of the correct side) and do not affect agreement.</p>
<p style="margin-top:10px">To <b>rectify</b>: work out what <i>was</i> done and what <i>should have been</i> done, then pass the entry that moves from one to the other. Two-sided errors are corrected by an entry between the two accounts concerned. For one-sided errors found after the difference was placed in a <b>Suspense Account</b>, the other side of the rectifying entry goes to Suspense. When all errors are found, the Suspense Account closes with a nil balance.</p>
<p style="margin-top:10px">Errors in nominal accounts change profit. If found after the final accounts are prepared, the nominal account is replaced by <b>Profit and Loss Adjustment Account</b> (or the opening capital) in the rectifying entry.</p>`,
      formula: "What was done → what should have been done → the difference is the rectifying entry<small>one-sided error → other side to Suspense A/c · wrong side: correct with twice the amount</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Effect on profit (before rectification)</h4>" + tbl(["Error", "Profit is"], [["Furniture ₹8,000 debited to Purchases", "Understated by ₹8,000"], ["Sales book undercast ₹1,000", "Understated by ₹1,000"], ["Wages ₹3,000 posted to the credit side", "Overstated by ₹6,000"], ["Credit sale to Sita omitted", "Understated by ₹4,000"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera's trial balance had a credit shortfall of ₹1,500 (difference put in Suspense on the credit side: Suspense Cr ₹1,500). She then finds two errors: the sales book was undercast by ₹1,000, and the Purchases account was overcast by ₹500.</p>" +
          je([["Suspense A/c Dr", "1,000", ""], ["&nbsp;&nbsp;&nbsp;To Sales A/c", "", "1,000"], ["Suspense A/c Dr", "500", ""], ["&nbsp;&nbsp;&nbsp;To Purchases A/c", "", "500"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Suspense: Cr 1,500 (opening) and Dr 1,000 + 500 = 1,500 → closes at nil ✓. Profit rises by ₹1,500.</p>";
      },
      use: ["Always write 'what was done' and 'what should have been done' before the rectifying entry.", "Use Suspense only for errors that affected the trial balance.", "Mistake: correcting a wrong-side posting with the amount once instead of twice.", "Mistake: using Suspense for errors of principle or omission."],
      walk: function () { return [
        { t: "Four types of error", c: "Omission, commission, principle, compensating.", h: chips(["Omission", "Commission", "Principle", "Compensating"], "ac") },
        { t: "One-sided or two-sided?", c: "One-sided errors upset the trial balance.", h: chips(["One-sided → Suspense", "Two-sided → no Suspense"], function (x, i) { return i ? "hl" : "ac"; }) },
        { t: "The method", c: "Was done → should be done → difference.", h: box("Was: Purchases Dr 8,000\nShould: Furniture Dr 8,000\n→ Furniture Dr, To Purchases", "good") },
        { t: "Wrong side", c: "Correct with twice the amount.", h: '<div class="big">Wages Dr ₹6,000</div>' },
        { t: "Suspense closes", c: "When every error is found, the balance is nil.", h: chips(["Cr 1,500 − Dr 1,500 = 0"], "mi") }]; },
      recap: ["Errors: omission, commission, principle, compensating; one-sided errors affect the trial balance", "Rectify by comparing what was done with what should have been done; Suspense absorbs one-sided errors"],
      qc: [{ q: "Purchase of machinery debited to Purchases account is an error of…", o: ["Principle", "Omission", "Commission", "Compensating"], a: 0, e: "A capital item was treated as revenue." },
        { q: "Which error makes the trial balance disagree?", o: ["Sales book undercast by ₹500", "Credit sale omitted entirely", "Furniture debited to Purchases", "Cash received credited to the wrong customer"], a: 0, e: "Undercasting affects only one account." }]
    },
    {
      id: "2.7", mod: 2, ch: "Chapter 3", title: "Bank Reconciliation Statement", time: "16 min", tool: "brs",
      outcomes: ["Explain why the cash book and pass book balances differ", "Identify timing differences and errors", "Prepare a bank reconciliation statement from either balance", "Handle overdraft balances"],
      notes: `<p>The business records its bank transactions in the bank column of its <b>cash book</b>; the bank records them in its own books and sends a <b>bank statement (pass book)</b>. A deposit increases the balance in the cash book (debit) but appears as a <b>credit</b> in the bank's records, because to the bank the deposit is a liability. On the same date the two balances often differ.</p>
<p style="margin-top:10px">Differences arise from <b>timing</b>: <b>cheques issued but not yet presented</b> for payment (cash book has reduced the balance; bank has not); <b>cheques deposited but not yet credited</b> (cash book has added; bank has not). Others arise from items the bank has recorded but the business does not yet know about: <b>bank charges</b>, <b>interest credited or charged</b>, <b>direct deposits</b> by customers, <b>direct payments</b> by the bank on standing instructions (insurance, EMI), and <b>dishonoured cheques</b>. And some are <b>errors</b> in either book.</p>
<p style="margin-top:10px">A <b>Bank Reconciliation Statement (BRS)</b> starts from one balance and adjusts for every difference to reach the other. Starting from a <b>favourable (debit) cash book balance</b>: <b>add</b> cheques issued but not presented, interest credited and direct deposits; <b>subtract</b> cheques deposited but not credited, bank charges, direct payments and dishonoured cheques. The result is the pass book balance. If you start from an <b>overdraft</b>, treat it as a negative figure and use the same logic. Many businesses first <b>correct the cash book</b> for items the bank has recorded, then reconcile only the timing differences.</p>`,
      formula: "Cash book (Dr) + issued not presented − deposited not credited − charges + interest + direct deposits − direct payments − dishonoured = Pass book (Cr)<small>overdraft: start from a negative balance</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Starting from a favourable cash book balance</h4>" + tbl(["Item", "Add or subtract"], [["Cheques issued, not presented", "Add"], ["Cheques deposited, not credited", "Subtract"], ["Bank charges", "Subtract"], ["Interest credited by bank", "Add"], ["Direct deposit by customer", "Add"], ["Direct payment by bank", "Subtract"], ["Cheque dishonoured", "Subtract"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera's cash book shows a bank balance of ₹45,000 (debit) on 30 June.</p>" +
          tbl(["Item", "₹", "Effect"], [["Balance as per cash book", "45,000", ""], ["Add: cheques issued, not presented", "12,000", "+"], ["Less: cheques deposited, not credited", "8,500", "−"], ["Less: bank charges", "300", "−"], ["Add: interest credited", "1,200", "+"], ["Add: direct deposit by a customer", "5,000", "+"], ["Less: insurance paid by the bank", "2,400", "−"], ["Less: cheque dishonoured", "1,500", "−"], ["<b>Balance as per pass book</b>", "<b>50,500</b>", ""]]);
      },
      use: ["Reconcile every month so errors and frauds are found quickly.", "Correct the cash book for bank-only items before reconciling timing differences.", "Mistake: reversing the logic when starting from the pass book balance.", "Mistake: forgetting that an overdraft is a negative balance."],
      walk: function () { return [
        { t: "Two records of one account", c: "Your cash book and the bank's statement.", h: chips(["Cash book Dr", "Pass book Cr"], "ac") },
        { t: "Timing differences", c: "Cheques in transit cause most differences.", h: chips(["Issued, not presented", "Deposited, not credited"], "hl") },
        { t: "Bank-only items", c: "Charges, interest, direct deposits and payments.", h: chips(["Charges −", "Interest +", "Direct deposit +", "Direct payment −"], "ac") },
        { t: "Build the statement", c: "Start from one balance; adjust for each item.", h: box("45,000 + 12,000 − 8,500 − 300\n+ 1,200 + 5,000 − 2,400 − 1,500\n= 50,500", "good") },
        { t: "Overdraft", c: "Use a negative starting balance.", h: '<div class="big">−₹20,000</div>' }]; },
      recap: ["Differences arise from timing, bank-only entries and errors", "Start from one balance, add or subtract each difference, reach the other"],
      qc: [{ q: "Starting from a favourable cash book balance, cheques issued but not yet presented are…", o: ["Added", "Subtracted", "Ignored", "Added twice"], a: 0, e: "The bank has not yet paid them, so its balance is higher." },
        { q: "Bank charges not yet recorded in the cash book, starting from the cash book balance, are…", o: ["Subtracted", "Added", "Ignored", "Doubled"], a: 0, e: "The bank has reduced its balance already." }]
    },
    {
      id: "2.8", mod: 2, ch: "Chapter 4", title: "Inventories", time: "16 min", tool: "inventory",
      outcomes: ["Define inventories and the components of their cost", "Value inventories at the lower of cost and net realisable value (AS 2)", "Apply FIFO and weighted average cost formulas", "Distinguish periodic and perpetual inventory systems"],
      notes: `<p><b>Inventories</b> are assets held for sale in the ordinary course of business, in the process of production for such sale, or as materials and supplies to be consumed in production. Inventory valuation matters twice: closing stock appears in the Balance Sheet and also reduces the cost of goods sold, so an error changes both assets and profit.</p>
<p style="margin-top:10px">Under <b>AS 2</b>, inventories are valued at the <b>lower of cost and net realisable value (NRV)</b>. <b>Cost</b> includes the purchase price, import duties and non-recoverable taxes, freight inward and other costs of bringing the goods to their present location and condition, less trade discounts and rebates; for manufactured goods, it also includes conversion costs (direct labour and a share of production overheads). It <b>excludes</b> abnormal wastage, storage costs (unless necessary in production), administrative overheads unrelated to production, and selling costs. <b>NRV</b> is the estimated selling price less the estimated costs of completion and costs to sell.</p>
<p style="margin-top:10px">When identical items are bought at different prices, a <b>cost formula</b> is needed. <b>FIFO</b> assumes the earliest units are sold first, so closing stock is at the latest prices. <b>Weighted average</b> divides the total cost by the total units. <b>LIFO is not permitted</b> under AS 2. Specific identification is used for items that are not interchangeable.</p>
<p style="margin-top:10px">In the <b>periodic system</b>, stock is counted at the end of the period and the cost of goods sold is a balancing figure. In the <b>perpetual system</b>, every receipt and issue is recorded continuously, so stock and cost of sales are known at any time.</p>`,
      formula: "Value = lower of Cost and NRV · NRV = selling price − completion cost − selling cost<small>FIFO: earliest out first · weighted average = total cost ÷ total units · LIFO not allowed</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">What goes into cost?</h4>" + tbl(["Item", "Included?"], [["Purchase price less trade discount", "Yes"], ["Freight inward, import duty", "Yes"], ["Recoverable GST", "No"], ["Abnormal wastage", "No"], ["Selling and distribution costs", "No"], ["Storage before further processing (necessary)", "Yes"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera's register stock in July: opening 100 @ ₹20; bought 200 @ ₹22; sold 180; bought 150 @ ₹25; sold 170.</p>" +
          steps(["Units left = 100 + 200 − 180 + 150 − 170 = 100.", "FIFO: the 100 left are from the latest lot @ ₹25 → closing stock ₹2,500.", "Weighted average (periodic): total cost ₹2,000 + ₹4,400 + ₹3,750 = ₹10,150 for 450 units → ₹22.56 each → closing ₹2,256 (approx).", "If each register can now be sold for only ₹24 (no selling cost), NRV = ₹2,400. Under FIFO, cost ₹2,500 > NRV ₹2,400, so stock is valued at ₹2,400."]);
      },
      use: ["Value each item or group at the lower of cost and NRV, not the whole stock in one figure.", "Include costs of bringing goods to their present location and condition.", "Mistake: using LIFO (not allowed under AS 2).", "Mistake: valuing stock at selling price because it is 'sure to sell'."],
      walk: function () { return [
        { t: "Lower of cost and NRV", c: "The core rule of AS 2.", h: '<div class="big">min(Cost, NRV)</div>' },
        { t: "What is cost?", c: "Purchase price + bringing to present condition.", h: chips(["Price", "+ Freight in", "+ Duties", "− Trade discount"], "ac") },
        { t: "FIFO", c: "Closing stock at the latest prices.", h: box("100 left → latest lot @ ₹25\n= ₹2,500", "good") },
        { t: "Weighted average", c: "Total cost ÷ total units.", h: '<div class="big">₹10,150 ÷ 450 ≈ ₹22.56</div>' },
        { t: "NRV check", c: "If the price falls, write the stock down.", h: chips(["Cost ₹2,500", "NRV ₹2,400 → value ₹2,400"], function (x, i) { return i ? "hl" : "ac"; }) }]; },
      recap: ["Inventories at the lower of cost and NRV; cost includes bringing goods to present condition", "FIFO and weighted average are allowed; LIFO is not"],
      qc: [{ q: "Which cost formula is NOT allowed under AS 2?", o: ["LIFO", "FIFO", "Weighted average", "Specific identification"], a: 0, e: "AS 2 does not permit LIFO." },
        { q: "Cost ₹10,000; expected sale price ₹11,000; selling costs ₹1,500. Inventory value?", o: ["₹9,500", "₹10,000", "₹11,000", "₹8,500"], a: 0, e: "NRV = 11,000 − 1,500 = 9,500, lower than cost." }]
    },
    {
      id: "2.9", mod: 2, ch: "Chapter 5", title: "Depreciation and Amortisation", time: "16 min", tool: "dep",
      outcomes: ["Explain depreciation, its causes and why it is charged", "Calculate depreciation by the straight line and written down value methods", "Record depreciation with and without a provision for depreciation account", "Account for the sale of an asset and changes in method or estimate"],
      notes: `<p><b>Depreciation</b> is the systematic allocation of the <b>depreciable amount</b> of an asset (its cost less estimated residual value) over its <b>useful life</b>. It arises from wear and tear, passage of time, obsolescence and depletion. It is charged to match the cost of an asset with the revenues it helps earn (matching concept), to show assets at a fair value in the Balance Sheet, and to retain profits for replacement. For intangible assets such as patents and software, the same idea is called <b>amortisation</b>. Under AS 10, depreciation is charged on property, plant and equipment; land usually has an unlimited life and is not depreciated.</p>
<p style="margin-top:10px">Under the <b>straight line method (SLM)</b>, the same amount is charged every year: (cost − residual value) ÷ useful life. It is simple and suits assets that give equal benefit each year. Under the <b>written down value (WDV)</b> or reducing balance method, a fixed percentage is applied to the opening book value each year, so the charge is higher in early years when repairs are low. The WDV rate that writes an asset down to its residual value over n years is <b>1 − (residual ÷ cost)<sup>1/n</sup></b>.</p>
<p style="margin-top:10px">Depreciation can be credited directly to the asset account, or accumulated in a <b>Provision for Depreciation</b> (accumulated depreciation) account, so the asset stays at original cost. On <b>sale</b>, the asset's book value on the date of sale is compared with the sale price; the difference is a profit or loss. A change in the depreciation method or useful life is a <b>change in accounting estimate</b> under AS 10: the remaining book value is depreciated over the remaining life.</p>`,
      formula: "SLM = (Cost − Residual) ÷ Life · WDV = Rate × Opening book value<small>WDV rate to reach residual in n years = 1 − (Residual ÷ Cost)<sup>1/n</sup></small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">SLM vs WDV</h4>" + tbl(["Basis", "Straight line", "Written down value"], [["Charge each year", "Equal", "Falls every year"], ["Base", "Original cost", "Opening book value"], ["Book value reaches", "Residual value exactly", "Never zero"], ["Suits", "Equal use over life", "Assets with rising repairs"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles buys a machine for ₹5,00,000. Residual value ₹50,000; useful life 5 years.</p>" +
          steps(["SLM: (5,00,000 − 50,000) ÷ 5 = ₹90,000 a year.", "WDV at 20%: year 1 ₹1,00,000; year 2 20% of 4,00,000 = ₹80,000; year 3 20% of 3,20,000 = ₹64,000.", "WDV rate that reaches ₹50,000 in exactly 5 years = 1 − (0.1)<sup>0.2</sup> ≈ 36.9%.", "If the machine is sold at the end of year 2 for ₹3,30,000 (SLM book value 5,00,000 − 1,80,000 = ₹3,20,000), the profit on sale is ₹10,000."]);
      },
      use: ["Use SLM when an asset gives equal benefit each year; WDV when benefit falls and repairs rise.", "Charge depreciation only for the months an asset is used, if the question says so.", "Mistake: depreciating land.", "Mistake: applying the WDV rate to original cost instead of the opening book value."],
      walk: function () { return [
        { t: "What is depreciation?", c: "Spreading an asset's cost over its useful life.", h: chips(["Wear and tear", "Time", "Obsolescence"], "ac") },
        { t: "Straight line", c: "The same amount every year.", h: box("(5,00,000 − 50,000) ÷ 5\n= ₹90,000 a year", "good") },
        { t: "Written down value", c: "A fixed rate on a falling balance.", h: chips(["₹1,00,000", "₹80,000", "₹64,000"], "hl") },
        { t: "Provision account", c: "Keep the asset at cost; accumulate depreciation.", h: chips(["Machine at cost", "Accumulated depreciation"], "ac") },
        { t: "Sale of an asset", c: "Sale price − book value = profit or loss.", h: '<div class="big">Profit ₹10,000</div>' }]; },
      recap: ["SLM charges equal amounts; WDV a fixed rate on the falling balance", "On sale, compare book value with sale price; method changes are changes in estimate"],
      qc: [{ q: "A machine costs ₹2,00,000, residual ₹20,000, life 6 years. SLM depreciation per year?", o: ["₹30,000", "₹33,333", "₹36,667", "₹20,000"], a: 0, e: "(2,00,000 − 20,000) ÷ 6 = ₹30,000." },
        { q: "Under the WDV method, depreciation in later years is…", o: ["Lower than in early years", "Higher than in early years", "The same every year", "Zero"], a: 0, e: "The rate is applied to a falling book value." }]
    },
    {
      id: "2.10", mod: 2, ch: "Chapter 6", title: "Bills of Exchange and Promissory Notes", time: "16 min", tool: "bills",
      outcomes: ["Define a bill of exchange and a promissory note and their parties", "Calculate the due date including days of grace", "Record entries for holding, discounting, endorsing and dishonour of bills", "Account for renewal and retirement of bills"],
      notes: `<p>A <b>bill of exchange</b> is an instrument in writing containing an unconditional <b>order</b>, signed by the maker (the <b>drawer</b>), directing a certain person (the <b>drawee</b>) to pay a certain sum of money only to, or to the order of, a certain person or the bearer (the <b>payee</b>). Once the drawee signs it, he is the <b>acceptor</b>. A <b>promissory note</b> contains an unconditional <b>promise</b> by the maker to pay; it needs no acceptance. Both are governed by the Negotiable Instruments Act, 1881. To the person who will receive the money it is a <b>bill receivable</b>; to the person who will pay, a <b>bill payable</b>.</p>
<p style="margin-top:10px">The <b>due date</b> of a bill payable after a fixed period is found by adding the period to the date of the bill (or the date of acceptance, for bills "after sight") and then adding <b>three days of grace</b>. If the due date falls on a public holiday, the bill is due on the <b>preceding</b> business day. Bills payable on demand or at sight get no days of grace.</p>
<p style="margin-top:10px">The holder of a bill can: <b>hold</b> it till maturity and present it for payment; <b>discount</b> it with a bank before maturity, receiving the amount less a discount (interest for the remaining period); <b>endorse</b> it to a creditor in settlement of a debt; or send it to the bank <b>for collection</b>. If the acceptor fails to pay on the due date, the bill is <b>dishonoured</b>: the holder reverses the entry against the acceptor and adds any <b>noting charges</b> (paid to a notary public to record the dishonour). A bill may be <b>renewed</b> (cancelled and replaced by a new bill, often with interest) or <b>retired</b> (paid before the due date, usually with a rebate).</p>`,
      formula: "Due date = date + term + 3 days of grace (preceding business day if a public holiday)<small>discount = face value × rate × days to maturity ÷ 365</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Entries in the drawer's books (₹60,000 bill)</h4>" + tbl(["Event", "Entry"], [["Bill received", "Bills Receivable Dr, To Acceptor"], ["Discounted with bank", "Bank Dr, Discount Dr, To Bills Receivable"], ["Endorsed to a creditor", "Creditor Dr, To Bills Receivable"], ["Honoured on maturity (held)", "Bank Dr, To Bills Receivable"], ["Dishonoured (held)", "Acceptor Dr, To Bills Receivable (and noting charges)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera draws a bill on Rao & Co for ₹60,000 on 10 January 2027, payable 3 months after date. She discounts it with her bank on 10 February at 12% a year.</p>" +
          steps(["Nominal due date: 10 April 2027. Add 3 days of grace → due date 13 April 2027.", "Days from 10 February to 13 April = 18 (rest of Feb) + 31 (Mar) + 13 (Apr) = 62 days.", "Discount = 60,000 × 12% × 62 ÷ 365 ≈ ₹1,223.", "Entry: Bank A/c Dr ₹58,777; Discount A/c Dr ₹1,223; To Bills Receivable A/c ₹60,000. If Rao & Co later dishonour the bill, Meera debits Rao & Co and credits Bank for ₹60,000 plus any noting charges."]);
      },
      use: ["Use bills to give credit with a legally enforceable, transferable claim.", "Always add three days of grace for time bills, then check for holidays.", "Mistake: moving the due date forward when it falls on a holiday (it moves back).", "Mistake: recording a dishonoured discounted bill against Bills Receivable instead of the Bank."],
      walk: function () { return [
        { t: "Order or promise?", c: "A bill orders; a promissory note promises.", h: chips(["Bill: drawer, drawee, payee", "Note: maker, payee"], "ac") },
        { t: "Due date", c: "Add the term, then three days of grace.", h: box("10 Jan + 3 months = 10 Apr\n+ 3 days grace = 13 Apr", "good") },
        { t: "Holiday rule", c: "If a public holiday, pay on the preceding business day.", h: chips(["← preceding day"], "hl") },
        { t: "Four choices for the holder", c: "Hold, discount, endorse or send for collection.", h: chips(["Hold", "Discount", "Endorse", "Collect"], "ac") },
        { t: "Dishonour", c: "Reverse against the acceptor; add noting charges.", h: '<div class="big">Rao & Co Dr ₹60,000 + noting</div>' }]; },
      recap: ["Due date = date + term + 3 days of grace; preceding business day if a holiday", "Holders may hold, discount, endorse or collect; dishonour reverses the claim to the acceptor"],
      qc: [{ q: "A bill dated 5 March is payable 2 months after date. Its due date is…", o: ["8 May", "5 May", "7 May", "5 June"], a: 0, e: "5 May + 3 days of grace = 8 May." },
        { q: "Who accepts a bill of exchange?", o: ["The drawee", "The drawer", "The payee", "The bank"], a: 0, e: "The drawee accepts it and becomes the acceptor." }]
    },

    /* ---------------- MODULE 3: FINAL ACCOUNTS (Chapters 7–9) ---------------- */
    {
      id: "3.1", mod: 3, ch: "Chapter 7, Unit 1", title: "Final Accounts of Non-Manufacturing Entities", time: "18 min", tool: "final",
      outcomes: ["Prepare a Trading Account and find gross profit", "Prepare a Profit and Loss Account and find net profit", "Prepare a Balance Sheet with assets and liabilities in proper order", "Make common adjustments: closing stock, outstanding and prepaid items, depreciation, provisions"],
      notes: `<p>At the end of the year, a sole trader prepares <b>final accounts</b> from the trial balance and the adjustments. The <b>Trading Account</b> compares net sales with the cost of goods sold to give <b>gross profit</b>. It is debited with opening stock, purchases (less returns) and <b>direct expenses</b> (carriage inward, freight, wages for bringing goods to a saleable condition, import duty), and credited with sales (less returns) and closing stock.</p>
<p style="margin-top:10px">The <b>Profit and Loss Account</b> starts with gross profit, adds other incomes (interest, commission, rent received, discount received) and deducts all <b>indirect expenses</b>: office and administration (salaries, rent, printing), selling and distribution (advertising, carriage outward, salesmen's commission), financial (interest on loans, bank charges), depreciation and losses. The result is <b>net profit</b>, which is added to capital in the Balance Sheet (a net loss is deducted).</p>
<p style="margin-top:10px">The <b>Balance Sheet</b> shows the financial position on the closing date: <b>capital and liabilities</b> (capital + net profit − drawings, long-term loans, current liabilities such as creditors and outstanding expenses) and <b>assets</b> (non-current assets less depreciation, and current assets such as closing stock, debtors less provision, prepaid expenses, bank and cash).</p>
<p style="margin-top:10px">Every <b>adjustment</b> is recorded twice, because of double entry: closing stock appears in the Trading Account (credit) and the Balance Sheet (asset); outstanding expenses are added to the expense and shown as a liability; prepaid expenses are deducted from the expense and shown as an asset; depreciation is charged to P&L and deducted from the asset; a provision for doubtful debts is charged to P&L and deducted from debtors.</p>`,
      formula: "Gross profit = Net sales + Closing stock − (Opening stock + Net purchases + Direct expenses)<small>Net profit = Gross profit + Other incomes − Indirect expenses · every adjustment appears twice</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Each adjustment, twice</h4>" + tbl(["Adjustment", "In Trading / P&L", "In Balance Sheet"], [["Closing stock", "Credit Trading A/c", "Current asset"], ["Outstanding salary", "Add to salary", "Current liability"], ["Prepaid rent", "Deduct from rent", "Current asset"], ["Depreciation", "Debit P&L", "Deduct from asset"], ["Provision for doubtful debts", "Debit P&L", "Deduct from debtors"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meera's Stationery Mart, year ended 31 March (₹): opening stock 40,000; purchases 3,20,000; purchase returns 5,000; sales 5,00,000; sales returns 10,000; carriage inward 6,000; wages 14,000; closing stock 60,000. Salaries 48,000 (₹4,000 outstanding); rent 24,000 (₹2,000 prepaid); advertising 9,000; interest received 3,000; depreciation on furniture ₹6,000; provision for doubtful debts ₹4,000.</p>" +
          steps(["Cost side of Trading: 40,000 + (3,20,000 − 5,000) + 6,000 + 14,000 = ₹3,75,000.", "Credit side: (5,00,000 − 10,000) + 60,000 = ₹5,50,000 → gross profit ₹1,75,000.", "Indirect expenses: salaries 52,000 + rent 22,000 + advertising 9,000 + depreciation 6,000 + provision 4,000 = ₹93,000.", "Net profit = 1,75,000 + 3,000 − 93,000 = ₹85,000. Gross profit ratio = 1,75,000 ÷ 4,90,000 ≈ 35.7%."]);
      },
      use: ["Classify each item as direct (Trading) or indirect (P&L) before you start.", "Tick each adjustment twice as you place it.", "Mistake: putting carriage outward in the Trading Account (it is a selling expense).", "Mistake: showing closing stock in the trial balance and again as an adjustment."],
      walk: function () { return [
        { t: "Three statements", c: "Trading → Profit and Loss → Balance Sheet.", h: chips(["Trading", "P&L", "Balance Sheet"], "ac") },
        { t: "Trading Account", c: "Net sales and closing stock against cost of goods.", h: box("5,50,000 − 3,75,000\n= Gross profit ₹1,75,000", "good") },
        { t: "Profit and Loss", c: "Add other income, deduct indirect expenses.", h: chips(["+ Interest 3,000", "− Expenses 93,000"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Net profit to capital", c: "Capital + profit − drawings.", h: '<div class="big">₹85,000</div>' },
        { t: "Adjustments appear twice", c: "Once in P&L or Trading, once in the Balance Sheet.", h: chips(["Outstanding", "Prepaid", "Depreciation", "Provision"], "ac") }]; },
      recap: ["Trading gives gross profit; P&L gives net profit; Balance Sheet gives position", "Every adjustment is recorded in two places"],
      qc: [{ q: "Carriage outward is shown in the…", o: ["Profit and Loss Account", "Trading Account", "Balance Sheet as an asset", "Capital account"], a: 0, e: "It is a selling and distribution expense." },
        { q: "Outstanding salary of ₹4,000 is…", o: ["Added to salary and shown as a liability", "Deducted from salary and shown as an asset", "Shown only in the Balance Sheet", "Ignored"], a: 0, e: "The expense is incurred but not yet paid." }]
    },
    {
      id: "3.2", mod: 3, ch: "Chapter 7, Unit 2", title: "Final Accounts of Manufacturing Entities", time: "15 min", tool: "mfg",
      outcomes: ["Explain why manufacturers prepare a Manufacturing Account", "Calculate raw materials consumed, prime cost and cost of production", "Adjust for opening and closing work-in-progress and scrap", "Link the Manufacturing Account to the Trading Account"],
      notes: `<p>A manufacturer buys raw materials and converts them into finished goods. Before the Trading Account, it prepares a <b>Manufacturing Account</b> to find the <b>cost of production</b> of finished goods. This shows how much it costs to make goods, which helps in pricing and control.</p>
<p style="margin-top:10px"><b>Raw materials consumed</b> = opening stock of raw materials + purchases (less returns) + carriage on purchases − closing stock of raw materials. Adding <b>direct wages</b> and <b>direct expenses</b> (royalty on production, hire of special equipment) gives <b>prime cost</b>. Then add <b>factory overheads</b>: indirect wages, factory rent, power and fuel, repairs and depreciation of plant, factory insurance and the works manager's salary.</p>
<p style="margin-top:10px"><b>Work-in-progress</b> is partly finished goods. Add opening WIP and deduct closing WIP, and deduct any sale of <b>scrap</b>, to get the <b>cost of production</b> of goods completed. This figure is transferred to the debit side of the Trading Account, where it takes the place of purchases (some firms also buy finished goods, which are added there). Stocks of finished goods appear in the Trading Account; stocks of raw materials and WIP appear in the Manufacturing Account. All three closing stocks are current assets in the Balance Sheet.</p>`,
      formula: "Prime cost = Materials consumed + Direct wages + Direct expenses<small>Cost of production = Prime cost + Factory overheads + Opening WIP − Closing WIP − Scrap sales</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Where does each item go?</h4>" + tbl(["Item", "Account"], [["Raw materials, direct wages", "Manufacturing"], ["Factory rent, power, plant depreciation", "Manufacturing (overheads)"], ["Opening / closing WIP", "Manufacturing"], ["Finished goods stock", "Trading"], ["Office salaries, advertising", "Profit and Loss"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran Furniture Works (fictional, sole proprietor), year's figures (₹): raw materials opening 30,000, purchases 2,00,000, closing 40,000; direct wages 80,000; direct expenses 10,000; factory rent 24,000; power 18,000; depreciation on plant 20,000; WIP opening 15,000, closing 25,000; scrap sold 2,000. Finished goods opening 50,000, closing 60,000; sales 4,50,000.</p>" +
          steps(["Materials consumed = 30,000 + 2,00,000 − 40,000 = ₹1,90,000.", "Prime cost = 1,90,000 + 80,000 + 10,000 = ₹2,80,000. Factory overheads = ₹62,000.", "Cost of production = 2,80,000 + 62,000 + 15,000 − 25,000 − 2,000 = ₹3,30,000.", "Trading: cost of goods sold = 50,000 + 3,30,000 − 60,000 = ₹3,20,000; gross profit = 4,50,000 − 3,20,000 = ₹1,30,000."]);
      },
      use: ["Use the Manufacturing Account to price products and control factory costs.", "Separate factory expenses from office and selling expenses carefully.", "Mistake: putting finished goods stock in the Manufacturing Account.", "Mistake: forgetting to deduct the sale of scrap."],
      walk: function () { return [
        { t: "Materials consumed", c: "Opening + purchases − closing.", h: '<div class="big">₹1,90,000</div>' },
        { t: "Prime cost", c: "Materials + direct wages + direct expenses.", h: chips(["1,90,000", "+80,000", "+10,000", "=2,80,000"], function (x, i) { return i === 3 ? "hl" : "ac"; }) },
        { t: "Factory overheads", c: "Rent, power, plant depreciation…", h: chips(["+62,000"], "ac") },
        { t: "Work-in-progress and scrap", c: "Add opening WIP, deduct closing WIP and scrap.", h: box("2,80,000 + 62,000 + 15,000\n− 25,000 − 2,000\n= ₹3,30,000", "good") },
        { t: "To the Trading Account", c: "Cost of production replaces purchases.", h: chips(["Gross profit ₹1,30,000"], "mi") }]; },
      recap: ["Prime cost = materials consumed + direct wages + direct expenses", "Cost of production goes to the Trading Account; WIP stays in the Manufacturing Account"],
      qc: [{ q: "Depreciation on factory machinery is debited to the…", o: ["Manufacturing Account", "Trading Account", "Profit and Loss Account", "Balance Sheet only"], a: 0, e: "It is a factory overhead." },
        { q: "Raw materials: opening 10,000, purchases 50,000, closing 15,000. Materials consumed?", o: ["₹45,000", "₹55,000", "₹75,000", "₹35,000"], a: 0, e: "10,000 + 50,000 − 15,000 = 45,000." }]
    },
    {
      id: "3.3", mod: 3, ch: "Chapter 8", title: "Financial Statements of Not-for-Profit Organisations", time: "16 min", tool: "subs",
      outcomes: ["Explain the nature of not-for-profit organisations and their accounts", "Distinguish the Receipts and Payments Account from the Income and Expenditure Account", "Treat special items: subscriptions, donations, entrance fees, legacies, life membership", "Prepare the Balance Sheet with the capital (general) fund"],
      notes: `<p><b>Not-for-profit organisations</b> (NPOs) such as clubs, charitable trusts, schools and hospitals exist to serve members or society, not to earn profit. Their capital is called the <b>Capital Fund</b> (or General Fund); an excess of income over expenditure is a <b>surplus</b>, added to the fund, and the reverse is a <b>deficit</b>.</p>
<p style="margin-top:10px">The <b>Receipts and Payments Account</b> is a summary of the cash book: it starts with the opening cash and bank balance, records all receipts (debit) and payments (credit) during the year, whether capital or revenue and whatever period they relate to, and ends with the closing balance. It follows the <b>cash basis</b>. The <b>Income and Expenditure Account</b> is like a Profit and Loss Account: it follows the <b>accrual basis</b>, includes only <b>revenue</b> items <b>of the current year</b> (with outstanding and prepaid adjustments and depreciation), and its balance is a surplus or deficit.</p>
<p style="margin-top:10px">Special items: <b>subscriptions</b> are revenue, adjusted for amounts outstanding and received in advance. <b>Entrance (admission) fees</b> are usually treated as revenue unless the rules say they should be capitalised. <b>Life membership fees</b> are capitalised (or spread over the expected membership period). <b>Legacies</b> (amounts received under a will) and <b>specific donations</b> (for a building, a prize fund) are capital receipts; general donations of small amounts are revenue. Expenses of a specific fund are deducted from that fund, not charged to the Income and Expenditure Account. The sale of an old asset is a capital receipt; only the profit or loss goes to the I&E Account.</p>`,
      formula: "Subscription income = Received + Outstanding (end) − Outstanding (start) + Advance (start) − Advance (end)<small>Capital Fund = Assets − Liabilities · surplus added to the fund</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Receipts & Payments vs Income & Expenditure</h4>" + tbl(["Basis", "Receipts & Payments", "Income & Expenditure"], [["Nature", "Summary of cash book", "Like a P&L Account"], ["Basis", "Cash", "Accrual"], ["Items", "Capital and revenue, all periods", "Revenue items of this year only"], ["Balance", "Cash/bank in hand", "Surplus or deficit"], ["Depreciation", "Not shown", "Shown"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Green Valley Sports Club (fictional). Subscriptions received in cash this year: ₹2,40,000. This includes ₹12,000 outstanding from last year and ₹8,000 received in advance for next year. ₹10,000 is outstanding for this year, and ₹6,000 was received last year in advance for this year.</p>" +
          steps(["Start with cash received: ₹2,40,000.", "Deduct last year's outstanding (₹12,000) and next year's advance (₹8,000).", "Add this year's outstanding (₹10,000) and last year's advance for this year (₹6,000).", "Subscription income for the I&E Account = 2,40,000 − 12,000 − 8,000 + 10,000 + 6,000 = ₹2,36,000."]);
      },
      use: ["Start by separating capital items from revenue items.", "Adjust subscriptions for outstanding and advance amounts at both ends of the year.", "Mistake: taking the cash received for subscriptions straight to the I&E Account.", "Mistake: treating a donation for a new building as income."],
      walk: function () { return [
        { t: "Service, not profit", c: "Capital Fund, surplus and deficit replace capital and profit.", h: chips(["Capital Fund", "Surplus", "Deficit"], "ac") },
        { t: "Receipts and Payments", c: "Cash basis: everything received or paid.", h: chips(["Opening cash", "+ receipts", "− payments", "= closing cash"], "ac") },
        { t: "Income and Expenditure", c: "Accrual basis: this year's revenue items only.", h: chips(["Revenue only", "This year only", "Depreciation ✓"], "hl") },
        { t: "Subscriptions", c: "Adjust for outstanding and advance at both ends.", h: box("2,40,000 − 12,000 − 8,000\n+ 10,000 + 6,000\n= ₹2,36,000", "good") },
        { t: "Capital receipts", c: "Legacies, specific donations, life membership.", h: chips(["Legacy", "Building donation", "Life membership"], "ac") }]; },
      recap: ["Receipts & Payments is cash-based; Income & Expenditure is accrual-based and revenue-only", "Legacies, specific donations and life membership fees are capitalised"],
      qc: [{ q: "A legacy received by a club is generally treated as…", o: ["A capital receipt added to the Capital Fund", "Income in the I&E Account", "A payment", "A liability"], a: 0, e: "Legacies are usually capitalised." },
        { q: "The Receipts and Payments Account follows the…", o: ["Cash basis", "Accrual basis", "Hybrid basis", "Realisation basis"], a: 0, e: "It summarises actual cash receipts and payments." }]
    },
    {
      id: "3.4", mod: 3, ch: "Chapter 9", title: "Accounts from Incomplete Records", time: "16 min", tool: "incomplete",
      outcomes: ["Explain single entry (incomplete records) and its limitations", "Find profit by the statement of affairs (net worth) method", "Use total debtors and total creditors accounts to find missing figures", "Convert incomplete records into final accounts"],
      notes: `<p>Many small traders do not keep a full double-entry system. They keep a cash book and personal accounts of debtors and creditors, but no proper nominal or real accounts. Such records are called <b>incomplete records</b> or <b>single entry</b>. A trial balance cannot be prepared, and profit cannot be verified directly.</p>
<p style="margin-top:10px">The <b>statement of affairs (net worth) method</b> estimates profit from the change in capital. A <b>statement of affairs</b> lists all assets and liabilities on a date; the difference is capital. Profit for the year = <b>closing capital + drawings − fresh capital introduced − opening capital</b>. It is quick, but it shows only the total profit, not how it was earned (no gross profit, no expense details).</p>
<p style="margin-top:10px">The <b>conversion method</b> reconstructs the missing figures so that a proper Trading and Profit and Loss Account can be prepared. A <b>total debtors account</b> finds credit sales: opening debtors + credit sales = cash received + discount allowed + bad debts + sales returns + closing debtors. A <b>total creditors account</b> finds credit purchases the same way. A summary of the cash book finds missing cash figures. Other figures can be worked out from given ratios, such as gross profit as a percentage of sales or of cost.</p>`,
      formula: "Profit = Closing capital + Drawings − Fresh capital − Opening capital<small>Credit sales = Closing debtors + Cash from debtors + Discount + Bad debts + Returns − Opening debtors</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">GP ratio tricks</h4>" + tbl(["Given", "Use"], [["GP 25% on cost", "GP = 20% of sales (25/125)"], ["GP 20% on sales", "Cost of sales = 80% of sales"], ["GP 1/3 on cost", "GP = 1/4 of sales"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Ravi's Gift Shop (fictional) keeps only a cash book. At the start of the year: cash 12,000, debtors 30,000, stock 45,000, furniture 20,000, creditors 22,000. At the end: cash 18,000, debtors 42,000, stock 52,000, furniture 18,000, creditors 25,000. Ravi withdrew ₹2,000 a month and introduced fresh capital of ₹10,000.</p>" +
          steps(["Opening capital = (12,000 + 30,000 + 45,000 + 20,000) − 22,000 = ₹85,000.", "Closing capital = (18,000 + 42,000 + 52,000 + 18,000) − 25,000 = ₹1,05,000.", "Drawings = 12 × 2,000 = ₹24,000.", "Profit = 1,05,000 + 24,000 − 10,000 − 85,000 = ₹34,000."]);
      },
      use: ["Use the statement of affairs method when you only need the total profit.", "Use total debtors and creditors accounts to find credit sales and purchases.", "Mistake: forgetting to add drawings back (they reduce closing capital but are not a loss).", "Mistake: counting fresh capital as profit."],
      walk: function () { return [
        { t: "Incomplete records", c: "Cash book and personal accounts only.", h: chips(["No trial balance", "No full ledger"], "hl") },
        { t: "Statement of affairs", c: "Assets − liabilities = capital.", h: chips(["Opening ₹85,000", "Closing ₹1,05,000"], "ac") },
        { t: "Profit from capital change", c: "Add drawings, deduct fresh capital.", h: box("1,05,000 + 24,000\n− 10,000 − 85,000\n= ₹34,000", "good") },
        { t: "Find missing figures", c: "Total debtors account gives credit sales.", h: chips(["Opening + sales = cash + discount + bad debts + returns + closing"], "ac") },
        { t: "Then prepare final accounts", c: "The conversion method gives full detail.", h: chips(["Trading", "P&L", "Balance Sheet"], "ac") }]; },
      recap: ["Profit = closing capital + drawings − fresh capital − opening capital", "Total debtors and creditors accounts reconstruct credit sales and purchases"],
      qc: [{ q: "Opening capital ₹50,000; closing capital ₹70,000; drawings ₹12,000; fresh capital ₹5,000. Profit?", o: ["₹27,000", "₹20,000", "₹37,000", "₹13,000"], a: 0, e: "70,000 + 12,000 − 5,000 − 50,000 = 27,000." },
        { q: "Opening debtors ₹20,000; cash received ₹90,000; closing debtors ₹25,000; no other items. Credit sales?", o: ["₹95,000", "₹85,000", "₹1,35,000", "₹1,10,000"], a: 0, e: "25,000 + 90,000 − 20,000 = 95,000." }]
    },

    /* ---------------- MODULE 4: PARTNERSHIP, LLP AND COMPANY ACCOUNTS (Chapters 10–11) ---------------- */
    {
      id: "4.1", mod: 4, ch: "Chapter 10, Unit 1", title: "Introduction to Partnership Accounts", time: "17 min", tool: "pshare",
      outcomes: ["Explain the partnership deed and the rules that apply when there is no deed (s.13)", "Prepare a Profit and Loss Appropriation Account", "Maintain fixed and fluctuating capital accounts", "Calculate interest on capital and drawings, and handle guaranteed profits"],
      notes: `<p>A <b>partnership</b> is the relation between persons who have agreed to share the profits of a business carried on by all or any of them acting for all. Partners usually sign a <b>partnership deed</b> covering capital, profit-sharing ratio, interest on capital and drawings, salaries and commission, and what happens on admission, retirement and death. If the deed is silent, <b>section 13 of the Indian Partnership Act, 1932</b> applies: profits are shared <b>equally</b>; <b>no interest on capital</b> and <b>no interest on drawings</b>; <b>no salary or commission</b> to partners; and interest at <b>6% a year</b> on loans given by a partner to the firm.</p>
<p style="margin-top:10px">After the Profit and Loss Account, a <b>Profit and Loss Appropriation Account</b> shows how net profit is divided. It is credited with net profit and interest on drawings, and debited with interest on capital, partners' salaries and commission, transfers to reserve, and finally the balance shared among partners in their profit-sharing ratio. Interest on a partner's loan is a charge against profit, so it goes to the Profit and Loss Account, not the Appropriation Account.</p>
<p style="margin-top:10px">Under the <b>fixed capital method</b>, capital accounts show only capital introduced or withdrawn permanently, and all other items (interest, salary, share of profit, drawings) go to separate <b>current accounts</b>. Under the <b>fluctuating capital method</b>, all of these pass through the capital account. Interest on drawings is often charged for the average period: for equal monthly drawings at the start of each month, 6.5 months; at the end of each month, 5.5 months; in the middle, 6 months. A <b>guarantee of profit</b> to a partner means that if his share falls below the guaranteed amount, the deficiency is borne by the guaranteeing partners in the agreed ratio.</p>`,
      formula: "Divisible profit = Net profit + Interest on drawings − Interest on capital − Salaries − Commission − Reserve<small>no deed (s.13): equal shares · no interest on capital or drawings · no salary · 6% on partner's loan</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Average period for interest on drawings</h4>" + tbl(["Equal monthly drawings made…", "Average period"], [["At the beginning of each month", "6.5 months"], ["In the middle of each month", "6 months"], ["At the end of each month", "5.5 months"], ["Quarterly, at the beginning", "7.5 months"], ["Quarterly, at the end", "4.5 months"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Arun and Bina (fictional) share profits 3 : 2. Capitals: Arun ₹3,00,000, Bina ₹2,00,000. Interest on capital 8%; Bina gets a salary of ₹3,000 a month; interest on drawings: Arun ₹2,000, Bina ₹1,500. Net profit ₹2,00,000.</p>" +
          steps(["Add interest on drawings: 2,00,000 + 3,500 = ₹2,03,500.", "Deduct interest on capital (Arun 24,000, Bina 16,000) and Bina's salary 36,000 → ₹1,27,500 left.", "Share 3 : 2 → Arun ₹76,500, Bina ₹51,000.", "Arun's total = 24,000 + 76,500 = ₹1,00,500; Bina's = 16,000 + 36,000 + 51,000 = ₹1,03,000 (before interest on drawings is charged to their accounts)."]);
      },
      use: ["Read the deed first; apply s.13 only when the deed is silent.", "Put interest on partners' loans in the P&L Account, not the Appropriation Account.", "Mistake: allowing interest on capital when the deed does not provide for it.", "Mistake: charging interest on drawings for 12 months when drawings are spread through the year."],
      walk: function () { return [
        { t: "The deed decides", c: "If silent, section 13 applies.", h: chips(["Equal shares", "No interest on capital", "No salary", "6% on loans"], "ac") },
        { t: "Appropriation Account", c: "Divides the net profit among partners.", h: chips(["+ IOD", "− IOC", "− Salary", "= divisible"], "ac") },
        { t: "Worked example", c: "₹2,03,500 − 40,000 − 36,000 = ₹1,27,500.", h: box("Arun 3/5 = ₹76,500\nBina 2/5 = ₹51,000", "good") },
        { t: "Fixed or fluctuating capital", c: "Fixed: current accounts take the yearly items.", h: chips(["Capital A/c", "Current A/c"], "hl") },
        { t: "Average period", c: "Monthly at the start of each month → 6.5 months.", h: '<div class="big">6.5 months</div>' }]; },
      recap: ["Without a deed: equal profits, no interest on capital or drawings, no salary, 6% on loans", "The Appropriation Account divides profit after interest, salaries and commission"],
      qc: [{ q: "Under s.13, interest on a partner's loan to the firm is allowed at…", o: ["6% a year", "8% a year", "12% a year", "Not allowed"], a: 0, e: "Section 13(d): 6% a year." },
        { q: "Interest on capital is shown in the…", o: ["Profit and Loss Appropriation Account (debit)", "Profit and Loss Account (credit)", "Balance Sheet only", "Trading Account"], a: 0, e: "It is an appropriation of profit." }]
    },
    {
      id: "4.2", mod: 4, ch: "Chapter 10, Unit 2", title: "Treatment of Goodwill in Partnership Accounts", time: "16 min", tool: "goodwill",
      outcomes: ["Explain goodwill and the factors that create it", "Value goodwill by the average profit and super profit methods", "Value goodwill by the capitalisation method", "Explain when goodwill is valued and how it is treated"],
      notes: `<p><b>Goodwill</b> is the value of a firm's reputation, customer base, location and know-how: the ability to earn more than a normal return on the capital employed. It is an <b>intangible asset</b>. Factors that increase it include good location, efficient management, quality products, long establishment, patents, monopoly position and favourable contracts.</p>
<p style="margin-top:10px">Goodwill is valued whenever the profit-sharing ratio changes or ownership changes: on <b>admission</b>, <b>retirement</b> or <b>death</b> of a partner, a change in ratio among existing partners, and sale of the business. Methods: the <b>average profit method</b> (average of normal past profits × agreed number of years' purchase; a <b>weighted average</b> gives more weight to recent years); the <b>super profit method</b> (super profit = average profit − normal profit, where normal profit = capital employed × normal rate of return; goodwill = super profit × years' purchase); and the <b>capitalisation method</b>, either capitalising average profit (average profit × 100 ÷ normal rate, minus capital employed) or capitalising super profit (super profit × 100 ÷ normal rate). The two capitalisation methods give the same answer.</p>
<p style="margin-top:10px">Under AS 26, only <b>purchased goodwill</b> (where consideration has been paid) may be shown in the books. So on a change in the constitution of a firm, goodwill is usually adjusted through the partners' capital accounts (the <b>premium or adjustment method</b>) instead of being raised as an asset, and any existing goodwill in the books is written off among old partners in their old ratio.</p>`,
      formula: "Average profit method: Goodwill = Average profit × Years' purchase<small>Super profit = Average profit − (Capital employed × Normal rate) · Capitalised super profit = Super profit × 100 ÷ Normal rate</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Adjust profits before averaging</h4>" + tbl(["Item", "Adjustment"], [["Abnormal loss (fire)", "Add back"], ["Abnormal gain (sale of an asset)", "Deduct"], ["Under-valued closing stock", "Add the under-valuation"], ["Partner's salary not charged (if a manager would cost this)", "Deduct the fair remuneration"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Arun and Bina's profits for 4 years: ₹80,000; ₹1,00,000; ₹90,000; ₹1,30,000. Capital employed ₹6,00,000; normal rate of return 12%.</p>" +
          steps(["Average profit = 4,00,000 ÷ 4 = ₹1,00,000. At 3 years' purchase, goodwill = ₹3,00,000.", "Normal profit = 6,00,000 × 12% = ₹72,000; super profit = 1,00,000 − 72,000 = ₹28,000. At 3 years' purchase, goodwill = ₹84,000.", "Capitalising super profit: 28,000 × 100 ÷ 12 ≈ ₹2,33,333.", "Capitalising average profit: 1,00,000 × 100 ÷ 12 = ₹8,33,333, minus capital employed ₹6,00,000 = ₹2,33,333 (same answer)."]);
      },
      use: ["Adjust past profits for abnormal items before averaging.", "Use the super profit method when capital employed and a normal return are known.", "Mistake: valuing goodwill on total profit when the question asks for super profit.", "Mistake: raising self-generated goodwill as an asset in the books (not allowed under AS 26)."],
      walk: function () { return [
        { t: "What is goodwill?", c: "The power to earn above-normal profits.", h: chips(["Reputation", "Location", "Customers", "Management"], "ac") },
        { t: "Average profit", c: "Average × years' purchase.", h: '<div class="big">1,00,000 × 3 = ₹3,00,000</div>' },
        { t: "Super profit", c: "Profit above the normal return on capital.", h: box("1,00,000 − (6,00,000 × 12%)\n= ₹28,000 super profit", "good") },
        { t: "Capitalisation", c: "Super profit × 100 ÷ normal rate.", h: chips(["≈ ₹2,33,333"], "hl") },
        { t: "Treatment", c: "Adjust through capital accounts; don't raise it as an asset.", h: chips(["AS 26: purchased goodwill only"], "ac") }]; },
      recap: ["Goodwill = average profit × years' purchase, or super profit × years' purchase", "Capitalisation of super profit = super profit × 100 ÷ normal rate"],
      qc: [{ q: "Average profit ₹60,000; capital employed ₹4,00,000; normal rate 10%. Super profit?", o: ["₹20,000", "₹40,000", "₹60,000", "₹6,000"], a: 0, e: "60,000 − 40,000 = 20,000." },
        { q: "Goodwill is normally valued when…", o: ["A partner is admitted, retires or dies", "Every month", "Only when the firm is dissolved", "Never"], a: 0, e: "Any change in the profit-sharing arrangement calls for valuing goodwill." }]
    },
    {
      id: "4.3", mod: 4, ch: "Chapter 10, Unit 3", title: "Admission of a New Partner", time: "17 min", tool: "admit",
      outcomes: ["Calculate the new profit-sharing ratio and the sacrificing ratio", "Account for goodwill brought in as premium", "Prepare the revaluation account and distribute accumulated profits", "Adjust partners' capitals on the basis of the new partner's capital"],
      notes: `<p>When a new partner is admitted, the old partners give up (<b>sacrifice</b>) part of their share in his favour. The <b>new profit-sharing ratio</b> depends on how the new share is taken: from the old partners in their old ratio (then the sacrificing ratio equals the old ratio), equally, or in a specified way. <b>Sacrificing ratio = old share − new share</b> for each old partner.</p>
<p style="margin-top:10px">The new partner usually brings <b>premium for goodwill</b> to compensate the old partners for the share of goodwill they give up. His share of the firm's goodwill is credited to the old partners <b>in their sacrificing ratio</b>. If he cannot bring it in cash, his current or capital account is debited instead. Any goodwill already in the books is written off among the old partners in their old ratio.</p>
<p style="margin-top:10px">Assets and liabilities are <b>revalued</b> so the new partner neither gains nor loses from changes in value that happened before he joined. Increases in assets and decreases in liabilities are credited, and the opposite debited, to a <b>Revaluation Account</b>; its profit or loss goes to old partners in the <b>old ratio</b>. <b>Accumulated profits and reserves</b> (and accumulated losses) in the books are also distributed among old partners in the old ratio. If the deed says capitals should be in the new ratio, the total capital of the firm is worked out from the new partner's capital and share, and old partners bring in or withdraw cash to adjust.</p>`,
      formula: "Sacrifice = Old share − New share · new partner's premium → old partners in the sacrificing ratio<small>revaluation profit/loss and reserves → old partners in the old ratio</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Three ways to find the new ratio (old 3 : 2, new partner gets 1/5)</h4>" + tbl(["New share taken…", "New ratio", "Sacrificing ratio"], [["From both in old ratio", "12 : 8 : 5", "3 : 2"], ["Equally from both (1/10 each)", "5 : 3 : 2", "1 : 1"], ["Wholly from Arun", "2 : 2 : 1", "Arun only"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Arun and Bina share 3 : 2. They admit Chetan for a 1/5 share, taken from them in their old ratio. The firm's goodwill is valued at ₹3,00,000. Chetan brings ₹2,00,000 capital and his share of goodwill in cash.</p>" +
          steps(["Remaining share for old partners = 4/5. Arun = 3/5 × 4/5 = 12/25; Bina = 2/5 × 4/5 = 8/25; Chetan = 5/25 → new ratio 12 : 8 : 5.", "Sacrifices: Arun 15/25 − 12/25 = 3/25; Bina 10/25 − 8/25 = 2/25 → sacrificing ratio 3 : 2.", "Chetan's premium = 1/5 × 3,00,000 = ₹60,000 → Arun ₹36,000, Bina ₹24,000.", "Entry: Bank A/c Dr 2,60,000, To Chetan's Capital 2,00,000, To Premium for Goodwill 60,000; then Premium for Goodwill Dr 60,000, To Arun's Capital 36,000, To Bina's Capital 24,000."]);
      },
      use: ["Always work out the sacrificing ratio before distributing goodwill.", "Distribute revaluation profit and old reserves in the old ratio, not the new.", "Mistake: crediting the new partner's premium in the new ratio.", "Mistake: giving the new partner a share of reserves built up before he joined."],
      walk: function () { return [
        { t: "Someone must give up a share", c: "Old partners sacrifice for the newcomer.", h: chips(["Old 3 : 2", "Chetan 1/5"], "ac") },
        { t: "New ratio", c: "From both in old ratio → 12 : 8 : 5.", h: box("Arun 3/5 × 4/5 = 12/25\nBina 2/5 × 4/5 = 8/25\nChetan 5/25", "good") },
        { t: "Sacrificing ratio", c: "Old share minus new share.", h: chips(["Arun 3/25", "Bina 2/25", "→ 3 : 2"], "hl") },
        { t: "Premium for goodwill", c: "₹60,000 shared 3 : 2 → ₹36,000 and ₹24,000.", h: '<div class="big">₹60,000</div>' },
        { t: "Revaluation and reserves", c: "Belong to the old partners, old ratio.", h: chips(["Revaluation", "General reserve"], "ac") }]; },
      recap: ["New ratio from the way the share is taken; sacrifice = old − new", "Premium in the sacrificing ratio; revaluation and reserves in the old ratio"],
      qc: [{ q: "X and Y share 3 : 2. Z is admitted for 1/4, taken in the old ratio. New ratio?", o: ["9 : 6 : 5", "3 : 2 : 1", "9 : 6 : 3", "3 : 2 : 4"], a: 0, e: "X = 3/5 × 3/4 = 9/20; Y = 2/5 × 3/4 = 6/20; Z = 5/20." },
        { q: "The new partner's premium for goodwill is credited to old partners in their…", o: ["Sacrificing ratio", "New ratio", "Capital ratio", "Gaining ratio"], a: 0, e: "They are compensated for what they gave up." }]
    },
    {
      id: "4.4", mod: 4, ch: "Chapter 10, Unit 4", title: "Retirement of a Partner", time: "16 min", tool: "retire",
      outcomes: ["Calculate the new ratio and the gaining ratio", "Adjust the retiring partner's share of goodwill through the gaining partners", "Find the amount due to a retiring partner", "Record payment in lump sum or instalments"],
      notes: `<p>When a partner <b>retires</b>, the remaining partners acquire his share. Their new ratio may be given, or they may continue in their old ratio among themselves. The <b>gaining ratio</b> = new share − old share for each continuing partner. If continuing partners keep their old relative ratio, the gaining ratio equals their old ratio.</p>
<p style="margin-top:10px">The retiring partner is entitled to his <b>share of goodwill</b>. Without raising goodwill in the books, the continuing partners' capital accounts are debited in their <b>gaining ratio</b> and the retiring partner's capital account is credited with his share. As on admission, assets and liabilities are <b>revalued</b> and the profit or loss shared among <b>all</b> partners (including the retiring one) in the <b>old ratio</b>; reserves and accumulated profits or losses are also distributed in the old ratio.</p>
<p style="margin-top:10px">The amount due to the retiring partner = his capital and current account balances + share of goodwill + share of revaluation profit and reserves + any share of profit to the date of retirement − drawings and any share of losses. It may be paid at once, or transferred to his <b>loan account</b> and paid in instalments with interest. Under <b>section 37</b> of the Partnership Act, if the amount is not settled, he (or his estate) may claim either interest at <b>6% a year</b> or the share of profits earned with his money, at his option.</p>`,
      formula: "Gain = New share − Old share · retiring partner's goodwill share is borne by gainers in the gaining ratio<small>revaluation and reserves: all partners in the old ratio</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Admission vs retirement</h4>" + tbl(["Basis", "Admission", "Retirement"], [["Ratio that matters", "Sacrificing ratio", "Gaining ratio"], ["Formula", "Old − new", "New − old"], ["Goodwill borne by", "New partner", "Continuing partners"], ["Revaluation shared in", "Old ratio", "Old ratio"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A firm of Arun, Bina and Chetan shares 5 : 3 : 2. Bina retires; Arun and Chetan will share 3 : 2. Goodwill is valued at ₹1,20,000.</p>" +
          steps(["Gains: Arun 3/5 − 5/10 = 6/10 − 5/10 = 1/10; Chetan 2/5 − 2/10 = 4/10 − 2/10 = 2/10 → gaining ratio 1 : 2.", "Bina's share of goodwill = 3/10 × 1,20,000 = ₹36,000.", "Arun bears 1/3 × 36,000 = ₹12,000; Chetan bears 2/3 × 36,000 = ₹24,000.", "Entry: Arun's Capital Dr 12,000, Chetan's Capital Dr 24,000, To Bina's Capital 36,000."]);
      },
      use: ["Always compute the gaining ratio when the new ratio is given; do not assume the old ratio.", "Share revaluation profit and reserves with the retiring partner too.", "Mistake: debiting goodwill to continuing partners in their new ratio.", "Mistake: forgetting the 6% (or profit share) option under s.37 for unpaid dues."],
      walk: function () { return [
        { t: "Someone leaves", c: "Continuing partners take over his share.", h: chips(["Old 5 : 3 : 2", "Bina retires"], "ac") },
        { t: "Gaining ratio", c: "New share − old share.", h: box("Arun 6/10 − 5/10 = 1/10\nChetan 4/10 − 2/10 = 2/10\n→ 1 : 2", "good") },
        { t: "Goodwill", c: "Bina's share ₹36,000, borne 1 : 2.", h: chips(["Arun ₹12,000", "Chetan ₹24,000"], "hl") },
        { t: "Amount due", c: "Capital + goodwill + reserves + revaluation − drawings.", h: chips(["Capital", "+ Goodwill", "+ Reserves", "− Drawings"], "ac") },
        { t: "Paying the retiring partner", c: "Lump sum, or loan account with interest.", h: chips(["s.37: 6% or profit share"], "ac") }]; },
      recap: ["Gaining ratio = new − old; goodwill compensation in the gaining ratio", "Revaluation and reserves are shared by all partners in the old ratio"],
      qc: [{ q: "A, B, C share 4 : 3 : 2. B retires; A and C share 3 : 2 thereafter. Gaining ratio of A and C?", o: ["7 : 8", "3 : 2", "4 : 2", "1 : 1"], a: 0, e: "A: 3/5 − 4/9 = 7/45; C: 2/5 − 2/9 = 8/45." },
        { q: "A retiring partner's share of goodwill is debited to continuing partners in their…", o: ["Gaining ratio", "Old ratio", "Sacrificing ratio", "Capital ratio"], a: 0, e: "Those who gain the share compensate the retiring partner." }]
    },
    {
      id: "4.5", mod: 4, ch: "Chapter 10, Unit 5", title: "Death of a Partner", time: "15 min", tool: "death",
      outcomes: ["Explain how the death of a partner is accounted for", "Calculate the deceased partner's share of profit to the date of death (time and turnover basis)", "Prepare the deceased partner's capital account and the executor's account", "Account for joint life policy proceeds"],
      notes: `<p>The accounting on the <b>death</b> of a partner is like that on retirement (gaining ratio, goodwill, revaluation and reserves), with one extra step. Death usually happens during the year, so the deceased partner is entitled to his <b>share of profit from the start of the year to the date of death</b>. Because final accounts are not ready, this is estimated.</p>
<p style="margin-top:10px">On the <b>time basis</b>, the profit is assumed to accrue evenly: share = last year's (or average) profit × months to death ÷ 12 × his share. On the <b>turnover (sales) basis</b>, profit is assumed to bear the same ratio to sales as last year: profit to death = sales up to death × (last year's profit ÷ last year's sales); then take his share. The entry is <b>Profit and Loss Suspense A/c Dr</b> (or the gaining partners' capital accounts), <b>To Deceased Partner's Capital A/c</b>.</p>
<p style="margin-top:10px">The deceased partner's capital account collects his capital, share of goodwill, revaluation profit, reserves, interest on capital and share of profit, less his drawings and share of losses. The balance is transferred to his <b>Executor's Account</b> (or legal representatives), to be paid in cash or in instalments with interest. Many firms take a <b>joint life policy</b> on the partners' lives; the amount received on death is shared among all partners (including the deceased) in the profit-sharing ratio.</p>`,
      formula: "Time basis: Profit × months ÷ 12 × share · Turnover basis: Sales to death × (Last profit ÷ Last sales) × share<small>balance of deceased's capital → Executor's A/c</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Deceased partner's capital account (summary)</h4>" + tbl(["Credit (amounts due to him)", "Debit (amounts deducted)"], [["Capital balance", "Drawings"], ["Share of goodwill", "Share of revaluation loss"], ["Share of reserves and revaluation profit", "Share of accumulated losses"], ["Interest on capital, share of profit to death", "Balance → Executor's A/c"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Arun, Bina and Chetan share 5 : 3 : 2; the year ends on 31 March. Bina dies on 30 June. Last year's profit was ₹1,80,000 on sales of ₹24,00,000; sales from 1 April to 30 June were ₹5,00,000.</p>" +
          steps(["Time basis: 1,80,000 × 3/12 × 3/10 = ₹13,500.", "Turnover basis: profit rate = 1,80,000 ÷ 24,00,000 = 7.5%; profit to death = 5,00,000 × 7.5% = ₹37,500; Bina's share = 3/10 × 37,500 = ₹11,250.", "Using the time basis, with Bina's capital ₹2,00,000, goodwill share ₹36,000, interest on capital ₹3,000 and drawings ₹10,000:", "Amount due to her executors = 2,00,000 + 36,000 + 13,500 + 3,000 − 10,000 = ₹2,42,500."]);
      },
      use: ["Use the basis stated in the question; if none, the time basis is usual.", "Remember to include interest on capital to the date of death if the deed allows it.", "Mistake: using the deceased partner's full-year profit share.", "Mistake: giving joint life policy proceeds only to the deceased partner."],
      walk: function () { return [
        { t: "Like retirement, plus profit to death", c: "Gaining ratio, goodwill, revaluation, reserves.", h: chips(["Gaining ratio", "Goodwill", "Revaluation", "Reserves"], "ac") },
        { t: "Time basis", c: "Profit accrues evenly through the year.", h: box("1,80,000 × 3/12 × 3/10\n= ₹13,500", "good") },
        { t: "Turnover basis", c: "Same profit-to-sales ratio as last year.", h: chips(["7.5% × 5,00,000 × 3/10 = ₹11,250"], "hl") },
        { t: "Executor's account", c: "The balance due goes to the legal representatives.", h: '<div class="big">₹2,42,500</div>' },
        { t: "Joint life policy", c: "Shared by all partners in the profit ratio.", h: chips(["All partners, old ratio"], "ac") }]; },
      recap: ["Share of profit to death by time or turnover basis", "Deceased partner's balance is transferred to the Executor's Account"],
      qc: [{ q: "Last year's profit ₹1,20,000; a partner with 1/4 share dies 4 months into the year. Time basis share?", o: ["₹10,000", "₹30,000", "₹40,000", "₹7,500"], a: 0, e: "1,20,000 × 4/12 × 1/4 = 10,000." },
        { q: "The amount due to a deceased partner is transferred to his…", o: ["Executor's Account", "Current Account", "Realisation Account", "Revaluation Account"], a: 0, e: "His legal representatives receive it." }]
    },
    {
      id: "4.6", mod: 4, ch: "Chapter 10, Unit 6", title: "Dissolution of Partnership Firms and LLPs", time: "17 min", tool: "realise",
      outcomes: ["Distinguish dissolution of partnership from dissolution of the firm", "Prepare the Realisation Account, partners' capital accounts and cash account", "Settle accounts in the order set by section 48", "Outline the Garner v Murray rule and the winding up of an LLP"],
      notes: `<p><b>Dissolution of partnership</b> means a change in the relationship among partners (admission, retirement, death) while the firm continues. <b>Dissolution of the firm</b> means the business itself is closed: assets are sold, liabilities paid and the partners' accounts settled. A firm may be dissolved by agreement, compulsorily (all partners or all but one insolvent, or the business becomes unlawful), on the happening of certain events, by notice in a partnership at will, or by order of a court.</p>
<p style="margin-top:10px">All assets (except cash, bank and fictitious items) and all outside liabilities are transferred to a <b>Realisation Account</b> at book values: assets on the debit side, liabilities on the credit side. Then the amounts realised from assets are credited, liabilities paid and realisation expenses are debited, and any asset taken over by a partner is credited and charged to his capital. The balance is a profit or loss on realisation, shared among partners in their profit-sharing ratio. Accumulated profits and reserves go to capitals; fictitious assets (accumulated losses) are written off against capitals.</p>
<p style="margin-top:10px">Under <b>section 48</b> of the Partnership Act, amounts realised are applied first to pay <b>outside debts</b>, then <b>partners' loans</b> (advances), then partners' <b>capital</b>, and any surplus is divided in the profit-sharing ratio. If a partner is <b>insolvent</b> and cannot meet his capital deficiency, the <b>Garner v Murray</b> rule (when there is no agreement) makes the solvent partners bear that deficiency in the ratio of their capitals just before dissolution, not their profit-sharing ratio. A <b>limited liability partnership</b> is not dissolved like a firm; it is <b>wound up</b> voluntarily or by the Tribunal under the LLP Act, 2008, and partners' liability is limited to their agreed contribution.</p>`,
      formula: "Realisation profit/loss = (Realised from assets + Liabilities at book value) − (Assets at book value + Liabilities paid + Expenses)<small>s.48 order: outside debts → partners' loans → capital → surplus in profit ratio</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Realisation Account entries</h4>" + tbl(["Event", "Entry"], [["Transfer assets", "Realisation Dr, To Assets"], ["Transfer liabilities", "Liabilities Dr, To Realisation"], ["Assets sold", "Cash Dr, To Realisation"], ["Liabilities paid", "Realisation Dr, To Cash"], ["Partner takes an asset", "Partner's Capital Dr, To Realisation"], ["Expenses paid", "Realisation Dr, To Cash"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Arun and Bina (3 : 2) dissolve their firm. Book values: debtors ₹60,000, stock ₹50,000, furniture ₹40,000; creditors ₹40,000. Realised: debtors ₹55,000, stock ₹45,000, furniture ₹30,000. Creditors are paid ₹38,000 in full settlement. Expenses ₹2,000.</p>" +
          steps(["Debit side: assets ₹1,50,000 + creditors paid ₹38,000 + expenses ₹2,000 = ₹1,90,000.", "Credit side: creditors at book value ₹40,000 + assets realised ₹1,30,000 = ₹1,70,000.", "Loss on realisation = ₹20,000.", "Arun bears 3/5 = ₹12,000; Bina 2/5 = ₹8,000, debited to their capital accounts."]);
      },
      use: ["Transfer every non-cash asset and every outside liability to the Realisation Account first.", "Follow the s.48 order when paying out.", "Mistake: transferring partners' loans or reserves to the Realisation Account.", "Mistake: applying Garner v Murray in the profit-sharing ratio instead of the capital ratio."],
      walk: function () { return [
        { t: "Partnership or firm?", c: "Dissolving the firm closes the business.", h: chips(["Partnership: relationship changes", "Firm: business ends"], "ac") },
        { t: "Realisation Account", c: "Assets debit, liabilities credit, at book value.", h: chips(["Assets ₹1,50,000 Dr", "Creditors ₹40,000 Cr"], "ac") },
        { t: "Sell and pay", c: "Cash from assets credit; payments and expenses debit.", h: box("Cr 40,000 + 1,30,000 = 1,70,000\nDr 1,50,000 + 38,000 + 2,000 = 1,90,000\n→ Loss ₹20,000", "good") },
        { t: "Order of payment", c: "Outsiders, then partners' loans, then capital.", h: chips(["Outside debts", "Partners' loans", "Capital", "Surplus"], "hl") },
        { t: "Insolvent partner", c: "Garner v Murray: capital ratio.", h: chips(["Capital ratio, not profit ratio"], "ac") }]; },
      recap: ["The Realisation Account finds profit or loss on closing the firm", "Pay outside debts, then partners' loans, then capitals (s.48)"],
      qc: [{ q: "On dissolution, a partner's loan to the firm is paid…", o: ["After outside creditors, before capitals", "Before outside creditors", "After capitals", "Never"], a: 0, e: "Section 48 order." },
        { q: "Under Garner v Murray, an insolvent partner's deficiency is borne by solvent partners in the ratio of…", o: ["Their capitals before dissolution", "Their profit-sharing ratio", "Equally", "Their drawings"], a: 0, e: "The capital ratio, unless there is an agreement to the contrary." }]
    },
    {
      id: "4.7", mod: 4, ch: "Chapter 11, Unit 1", title: "Introduction to Company Accounts", time: "15 min", tool: "capital",
      outcomes: ["Describe the features of a company and its types", "Explain the kinds of share capital: authorised, issued, subscribed, called-up, paid-up", "Distinguish equity and preference shares", "Show share capital in the Balance Sheet as per Schedule III"],
      notes: `<p>A <b>company</b> is an artificial person created by law, with a <b>separate legal entity</b>, <b>perpetual succession</b>, a common seal (optional now), <b>limited liability</b> of members (in a company limited by shares) and <b>transferable shares</b>. Companies may be private or public, listed or unlisted, and include one person companies (OPCs). Their accounts follow the Companies Act, 2013 and the format in <b>Schedule III</b>.</p>
<p style="margin-top:10px"><b>Share capital</b> has several layers. <b>Authorised capital</b> is the maximum capital the company may issue, stated in its memorandum. <b>Issued capital</b> is the part offered to the public or others for subscription. <b>Subscribed capital</b> is the part actually taken up. <b>Called-up capital</b> is the part of the face value the company has asked shareholders to pay so far, and <b>paid-up capital</b> is the called-up amount actually received (called-up minus <b>calls in arrears</b>). Uncalled capital may be kept as <b>reserve capital</b>, callable only on winding up.</p>
<p style="margin-top:10px"><b>Equity shares</b> carry voting rights and the residual claim on profits and assets. <b>Preference shares</b> carry a preferential right to a fixed dividend and to repayment of capital on winding up; they may be cumulative or non-cumulative, participating or non-participating, convertible or non-convertible, and redeemable (irredeemable preference shares cannot be issued under the 2013 Act). In the Balance Sheet, share capital is shown under <b>Shareholders' funds</b> with notes disclosing authorised, issued and subscribed capital, distinguishing "fully paid" from "subscribed but not fully paid", and deducting calls in arrears.</p>`,
      formula: "Authorised ≥ Issued ≥ Subscribed ≥ Called-up ≥ Paid-up · Paid-up = Called-up − Calls in arrears<small>shown under Shareholders' funds (Schedule III), with a note on share capital</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Equity vs preference shares</h4>" + tbl(["Basis", "Equity", "Preference"], [["Dividend", "Varies; after preference", "Fixed rate, first"], ["Capital on winding up", "Last", "Before equity"], ["Voting", "Full", "Limited (on matters affecting them)"], ["Redemption", "Not redeemable (except buy-back)", "Must be redeemable"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles Ltd (fictional) has authorised capital of 1,00,000 equity shares of ₹10. It issues 60,000 shares, all subscribed. ₹8 per share has been called up; calls of ₹4,000 are unpaid.</p>" +
          tbl(["Note: Share capital", "₹"], [["Authorised: 1,00,000 equity shares of ₹10", "10,00,000"], ["Issued: 60,000 equity shares of ₹10", "6,00,000"], ["Subscribed but not fully paid: 60,000 shares of ₹10, ₹8 called up", "4,80,000"], ["Less: calls in arrears", "(4,000)"], ["<b>Paid-up capital</b>", "<b>4,76,000</b>"]]);
      },
      use: ["Always show authorised, issued and subscribed capital in the note, even though only paid-up capital is added.", "Deduct calls in arrears from called-up capital.", "Mistake: adding authorised capital to the Balance Sheet total.", "Mistake: describing preference shares as irredeemable under the 2013 Act."],
      walk: function () { return [
        { t: "A separate person", c: "Separate entity, perpetual succession, limited liability.", h: chips(["Separate entity", "Perpetual succession", "Limited liability"], "ac") },
        { t: "Layers of capital", c: "Authorised → issued → subscribed → called-up → paid-up.", h: chips(["10,00,000", "6,00,000", "6,00,000", "4,80,000", "4,76,000"], function (x, i) { return i === 4 ? "hl" : "ac"; }) },
        { t: "Calls in arrears", c: "Called-up but not received: deduct.", h: box("4,80,000 − 4,000\n= Paid-up ₹4,76,000", "good") },
        { t: "Equity and preference", c: "Preference gets fixed dividend and capital first.", h: chips(["Equity: residual", "Preference: first"], "ac") },
        { t: "Schedule III", c: "Share capital under Shareholders' funds, with a note.", h: chips(["Shareholders' funds"], "ac") }]; },
      recap: ["Authorised ≥ issued ≥ subscribed ≥ called-up ≥ paid-up", "Paid-up = called-up − calls in arrears; shown under Shareholders' funds"],
      qc: [{ q: "The maximum capital a company may raise, as stated in its memorandum, is…", o: ["Authorised capital", "Issued capital", "Called-up capital", "Reserve capital"], a: 0, e: "Also called nominal or registered capital." },
        { q: "Called-up capital ₹5,00,000; calls in arrears ₹6,000. Paid-up capital?", o: ["₹4,94,000", "₹5,06,000", "₹5,00,000", "₹6,000"], a: 0, e: "5,00,000 − 6,000." }]
    },
    {
      id: "4.8", mod: 4, ch: "Chapter 11, Unit 2", title: "Issue, Forfeiture and Re-issue of Shares", time: "18 min", tool: "forfeit",
      outcomes: ["Record the issue of shares at par and at a premium, including over- and under-subscription", "Explain the uses of securities premium (s.52) and the ban on issue at a discount (s.53)", "Record forfeiture of shares", "Record re-issue of forfeited shares and transfer the gain to capital reserve"],
      notes: `<p>Shares are usually payable in instalments: <b>application</b>, <b>allotment</b> and one or more <b>calls</b>. Each stage is recorded through a separate account (Share Application, Share Allotment, Share First Call). If the issue is <b>over-subscribed</b>, the company may reject some applications (refund their money), and/or make a <b>pro-rata allotment</b>, using excess application money towards allotment and calls. Shares may be issued at <b>par</b> or at a <b>premium</b>. Premium is credited to the <b>Securities Premium</b> account, which under <b>section 52</b> may be used only for specific purposes: issuing fully paid bonus shares, writing off preliminary expenses, writing off expenses or discount on issue of securities, paying premium on redemption of preference shares or debentures, and buy-back of shares. Under <b>section 53</b>, a company cannot issue shares at a discount, except sweat equity shares under section 54.</p>
<p style="margin-top:10px">If a shareholder fails to pay an allotment or call, the directors may <b>forfeit</b> his shares as per the articles. On forfeiture, Share Capital is debited with the amount <b>called up</b> on those shares, the unpaid amounts are credited to the respective allotment or call accounts (or Calls in Arrears), and the amount actually <b>paid</b> by the shareholder is credited to <b>Share Forfeiture</b> account. If the premium on those shares had not been received, Securities Premium is also debited.</p>
<p style="margin-top:10px">Forfeited shares may be <b>re-issued</b> at any price, but the <b>discount on re-issue cannot exceed the amount forfeited</b> on those shares. The discount is debited to Share Forfeiture. Any balance left in Share Forfeiture on the re-issued shares is a capital profit, transferred to <b>Capital Reserve</b>.</p>`,
      formula: "Forfeiture: Share Capital Dr (called-up) · Unpaid calls Cr · Share Forfeiture Cr (amount paid)<small>re-issue discount ≤ amount forfeited · balance on re-issued shares → Capital Reserve</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Uses of securities premium (s.52)</h4>" + tbl(["Allowed use"], [["Issue of fully paid bonus shares"], ["Writing off preliminary expenses"], ["Writing off expenses, commission or discount on issue of shares or debentures"], ["Premium payable on redemption of preference shares or debentures"], ["Buy-back of its own shares (s.68)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles issues shares of ₹10 at a premium of ₹2: application ₹3, allotment ₹5 (including the premium), final call ₹4. Mr X, holding 100 shares, pays only the application money. His shares are forfeited after the final call and re-issued at ₹8 per share, fully paid.</p>" +
          je([["Share Capital A/c Dr (100 × ₹10)", "1,000", ""], ["Securities Premium A/c Dr (100 × ₹2)", "200", ""], ["&nbsp;&nbsp;&nbsp;To Share Allotment A/c (100 × ₹5)", "", "500"], ["&nbsp;&nbsp;&nbsp;To Share Final Call A/c (100 × ₹4)", "", "400"], ["&nbsp;&nbsp;&nbsp;To Share Forfeiture A/c (100 × ₹3)", "", "300"], ["Bank A/c Dr (100 × ₹8)", "800", ""], ["Share Forfeiture A/c Dr", "200", ""], ["&nbsp;&nbsp;&nbsp;To Share Capital A/c", "", "1,000"], ["Share Forfeiture A/c Dr", "100", ""], ["&nbsp;&nbsp;&nbsp;To Capital Reserve A/c", "", "100"]]);
      },
      use: ["Debit Share Capital with the amount called up on forfeited shares, not the face value.", "Check that the re-issue discount does not exceed the forfeited amount.", "Mistake: debiting Securities Premium on forfeiture when the premium had already been received.", "Mistake: leaving the forfeiture balance on re-issued shares in Share Forfeiture."],
      walk: function () { return [
        { t: "Instalments", c: "Application, allotment, calls.", h: chips(["₹3", "₹5 (incl. ₹2 premium)", "₹4"], "ac") },
        { t: "Premium and discount", c: "Premium allowed (s.52 uses); discount banned (s.53).", h: chips(["Premium ✓", "Discount ✗"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Forfeiture", c: "Reverse what was called; keep what was paid.", h: box("Share Capital Dr 1,000\nSec. Premium Dr 200\n→ calls Cr 900, Forfeiture Cr 300", "good") },
        { t: "Re-issue", c: "Discount up to the forfeited amount.", h: chips(["Re-issued @ ₹8", "Discount ₹200 ≤ ₹300 ✓"], "ac") },
        { t: "Capital reserve", c: "The remaining ₹100 is a capital profit.", h: '<div class="big">₹100</div>' }]; },
      recap: ["Forfeiture: debit capital called up, credit unpaid calls and Share Forfeiture with the amount paid", "Re-issue discount ≤ forfeited amount; balance to Capital Reserve"],
      qc: [{ q: "100 shares of ₹10 (₹8 called up) are forfeited for non-payment of ₹3. Amount credited to Share Forfeiture?", o: ["₹500", "₹300", "₹800", "₹1,000"], a: 0, e: "Paid = ₹8 − ₹3 = ₹5 a share × 100 = ₹500." },
        { q: "Securities premium can be used to…", o: ["Issue fully paid bonus shares", "Pay dividends", "Buy stock-in-trade", "Pay salaries"], a: 0, e: "Section 52 lists the permitted uses." }]
    },
    {
      id: "4.9", mod: 4, ch: "Chapter 11, Unit 3", title: "Issue of Debentures", time: "15 min", tool: "deb",
      outcomes: ["Explain debentures and how they differ from shares", "Record the issue of debentures at par, premium and discount, with redemption at par or premium", "Account for loss on issue of debentures and its write-off", "Record debentures issued as collateral security and interest on debentures"],
      notes: `<p>A <b>debenture</b> is a written acknowledgement of a debt by a company, usually carrying a fixed rate of interest and repayable on a fixed date. Debenture holders are <b>creditors</b>, not owners: they get interest whether or not there is profit, have no voting rights, and are repaid before shareholders. Debentures may be secured or unsecured, redeemable or irredeemable, convertible or non-convertible, and registered or bearer. They are issued under <b>section 71</b> of the Companies Act, 2013.</p>
<p style="margin-top:10px">Unlike shares, debentures <b>may be issued at a discount</b>. Each combination of issue and redemption terms gives a standard entry. If debentures are issued at a discount or are redeemable at a premium, the company bears a cost: <b>Loss on Issue of Debentures</b> (= discount on issue + premium on redemption). The promised premium on redemption is a liability, credited to <b>Premium on Redemption of Debentures</b> account. The loss is written off over the life of the debentures, first against securities premium (if available) and then against the Statement of Profit and Loss.</p>
<p style="margin-top:10px">Debentures may also be issued as <b>collateral security</b> for a loan: the lender holds them and can enforce them only if the loan is not repaid. Such debentures are either not recorded (shown only as a note under the loan) or recorded through a Debentures Suspense account. <b>Interest on debentures</b> is a charge against profit; the company deducts tax at source (TDS) and pays the net amount to holders.</p>`,
      formula: "Loss on issue = Discount on issue + Premium on redemption<small>debentures may be issued at a discount (shares may not) · write off loss over the life of the debentures</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Shares vs debentures</h4>" + tbl(["Basis", "Shares", "Debentures"], [["Status", "Owners", "Creditors"], ["Return", "Dividend from profits", "Interest, even without profit"], ["Voting", "Yes (equity)", "No"], ["Issue at discount", "Not allowed (s.53)", "Allowed"], ["Repayment", "Last on winding up", "Before shareholders"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles issues 5,000 debentures of ₹100 each at a 5% discount, redeemable after 5 years at a 10% premium.</p>" +
          je([["Bank A/c Dr (5,000 × ₹95)", "4,75,000", ""], ["Loss on Issue of Debentures A/c Dr", "75,000", ""], ["&nbsp;&nbsp;&nbsp;To Debentures A/c (5,000 × ₹100)", "", "5,00,000"], ["&nbsp;&nbsp;&nbsp;To Premium on Redemption of Debentures A/c", "", "50,000"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Loss = discount ₹25,000 + premium on redemption ₹50,000 = ₹75,000, written off over 5 years (₹15,000 a year, if equal benefit).</p>";
      },
      use: ["Work out the loss on issue first: discount on issue plus premium on redemption.", "Record the premium on redemption as a liability at the time of issue.", "Mistake: treating debenture interest as an appropriation of profit (it is an expense).", "Mistake: recording collateral debentures as a liability in addition to the loan."],
      walk: function () { return [
        { t: "Creditors, not owners", c: "Fixed interest, repaid before shareholders.", h: chips(["Interest", "No vote", "Priority"], "ac") },
        { t: "Discount allowed", c: "Unlike shares, debentures can be issued below par.", h: chips(["Issue @ ₹95"], "hl") },
        { t: "Loss on issue", c: "Discount + premium on redemption.", h: box("5,000 × (₹5 + ₹10)\n= ₹75,000", "good") },
        { t: "Write it off", c: "Over the life of the debentures.", h: '<div class="big">₹15,000 a year</div>' },
        { t: "Collateral security", c: "Held by the lender; enforced only on default.", h: chips(["Note under the loan"], "ac") }]; },
      recap: ["Debentures are debt; they may be issued at a discount", "Loss on issue = discount + premium on redemption, written off over the life"],
      qc: [{ q: "1,000 debentures of ₹100 issued at ₹98, redeemable at ₹105. Loss on issue?", o: ["₹7,000", "₹2,000", "₹5,000", "₹3,000"], a: 0, e: "(₹2 + ₹5) × 1,000 = ₹7,000." },
        { q: "Interest on debentures is…", o: ["A charge against profit", "An appropriation of profit", "Paid only if there is profit", "Credited to capital reserve"], a: 0, e: "It is payable whether or not there is profit." }]
    },
    {
      id: "4.10", mod: 4, ch: "Chapter 11, Unit 4", title: "Accounting for Bonus Issue and Right Issue", time: "15 min", tool: "bonus",
      outcomes: ["Explain bonus shares and the sources from which they may be issued (s.63)", "Record a bonus issue, including making partly paid shares fully paid", "Explain a rights issue (s.62) and renunciation", "Calculate the ex-rights price and the value of a right"],
      notes: `<p><b>Bonus shares</b> are fully paid shares issued free to existing shareholders in proportion to their holdings, by <b>capitalising</b> accumulated profits and reserves. They do not bring in cash; they convert reserves into share capital. Under <b>section 63</b> of the Companies Act, 2013, bonus shares may be issued only out of <b>free reserves</b>, the <b>securities premium account</b> or the <b>capital redemption reserve</b>, and <b>not</b> out of reserves created by <b>revaluation</b> of assets. The articles must authorise it, it must be approved in general meeting, there must be no default in paying interest or principal on deposits or debt securities or in statutory dues to employees, and bonus shares cannot be issued in lieu of dividend. Bonus may also be applied to make <b>partly paid shares fully paid</b>.</p>
<p style="margin-top:10px">Entry for a bonus issue: <b>Reserve A/c Dr, To Bonus to Shareholders A/c</b>; then <b>Bonus to Shareholders A/c Dr, To Share Capital A/c</b>. The number of shares rises, the share price usually falls in proportion, and total shareholders' funds stay the same.</p>
<p style="margin-top:10px">A <b>rights issue</b> under <b>section 62</b> offers new shares to existing equity shareholders in proportion to their holdings, usually at a price below the market price. Shareholders may accept, <b>renounce</b> (sell) their rights to others, or ignore them. The theoretical <b>ex-rights price</b> = (market value of existing shares + amount paid for new shares) ÷ total shares after the issue. The <b>value of a right</b> per existing share = cum-rights market price − ex-rights price. The rights issue is recorded like any other issue of shares for cash.</p>`,
      formula: "Ex-rights price = (n × Market price + m × Issue price) ÷ (n + m)<small>value of right = Market price − Ex-rights price · bonus (s.63): free reserves, securities premium, CRR, not revaluation reserve</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Bonus vs rights</h4>" + tbl(["Basis", "Bonus issue", "Rights issue"], [["Cash received", "None", "Yes"], ["Price", "Free", "Usually below market"], ["Source", "Reserves capitalised", "Shareholders pay"], ["Section", "63", "62"], ["Can be renounced?", "No", "Yes"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles has 50,000 equity shares of ₹10. (a) It issues bonus shares 1 : 5 out of general reserve. (b) Later it offers rights shares 1 : 4 at ₹15 when the market price is ₹25.</p>" +
          steps(["Bonus shares = 50,000 ÷ 5 = 10,000 → capitalise ₹1,00,000: General Reserve Dr, To Bonus to Shareholders; Bonus to Shareholders Dr, To Equity Share Capital ₹1,00,000.", "After bonus: 60,000 shares. Rights 1 : 4 → 15,000 new shares at ₹15 → ₹2,25,000 received.", "Ex-rights price = (4 × 25 + 1 × 15) ÷ 5 = ₹23.", "Value of a right per existing share = 25 − 23 = ₹2 (or (25 − 15) × 1/5 = ₹2)."]);
      },
      use: ["Check the source of a bonus issue: revaluation reserve is not allowed.", "Use the ex-rights formula to value rights that shareholders want to sell.", "Mistake: recording cash for a bonus issue.", "Mistake: calling a rights issue a bonus issue because the price is low."],
      walk: function () { return [
        { t: "Bonus shares", c: "Reserves turned into capital, free to shareholders.", h: chips(["No cash", "More shares", "Same total funds"], "ac") },
        { t: "Allowed sources (s.63)", c: "Free reserves, securities premium, CRR.", h: chips(["Free reserves ✓", "Securities premium ✓", "CRR ✓", "Revaluation ✗"], function (x, i) { return i === 3 ? "hl" : "mi"; }) },
        { t: "1 : 5 bonus", c: "50,000 shares → 10,000 bonus = ₹1,00,000.", h: box("General Reserve Dr 1,00,000\n→ Equity Share Capital Cr 1,00,000", "good") },
        { t: "Rights issue (s.62)", c: "Existing shareholders first, usually at a discount to market.", h: chips(["Accept", "Renounce", "Ignore"], "ac") },
        { t: "Value of a right", c: "Market price − ex-rights price.", h: '<div class="big">25 − 23 = ₹2</div>' }]; },
      recap: ["Bonus capitalises reserves (s.63), never revaluation reserve; no cash comes in", "Rights (s.62) are offered to existing holders; value of right = market − ex-rights price"],
      qc: [{ q: "Bonus shares cannot be issued out of…", o: ["Revaluation reserve", "Securities premium", "Capital redemption reserve", "Free reserves"], a: 0, e: "Section 63 excludes reserves created by revaluation." },
        { q: "Market price ₹50; rights 1 : 1 at ₹30. Ex-rights price?", o: ["₹40", "₹45", "₹30", "₹35"], a: 0, e: "(50 + 30) ÷ 2 = 40." }]
    },
    {
      id: "4.11", mod: 4, ch: "Chapter 11, Unit 5", title: "Redemption of Preference Shares", time: "16 min", tool: "redeem",
      outcomes: ["State the conditions for redemption of preference shares under section 55", "Calculate the transfer to Capital Redemption Reserve (CRR)", "Calculate the minimum fresh issue needed", "Record the redemption entries, including premium on redemption"],
      notes: `<p>Under <b>section 55</b> of the Companies Act, 2013, a company limited by shares may not issue irredeemable preference shares; preference shares must be <b>redeemed within 20 years</b> of issue (up to 30 years for infrastructure projects, with annual redemption of at least 10% from the 21st year). Shares may be redeemed only if they are <b>fully paid</b>, and only <b>out of profits available for dividend</b> or <b>out of the proceeds of a fresh issue</b> of shares made for the purpose of redemption.</p>
<p style="margin-top:10px">When shares are redeemed out of profits, an amount equal to the <b>nominal value</b> of the shares redeemed out of profits must be transferred to a <b>Capital Redemption Reserve (CRR)</b>. This protects creditors: the company's permanent capital does not fall. The CRR can be used only to issue fully paid bonus shares. Proceeds of a fresh issue of <b>debentures</b> cannot be used, because debentures are not shares. Only the <b>nominal value</b> of a fresh share issue counts towards redemption; any premium on the fresh issue can be used to pay the premium on redemption.</p>
<p style="margin-top:10px">Any <b>premium payable on redemption</b> is provided out of profits or out of the securities premium account (for companies not covered by Ind AS rules that require otherwise). The redemption entries are: Preference Share Capital Dr and Premium on Redemption Dr, To Preference Shareholders; then Preference Shareholders Dr, To Bank. Profits used are transferred: Profit and Loss (or General Reserve) Dr, To CRR.</p>`,
      formula: "CRR = Nominal value redeemed − Nominal value of fresh share issue (for redemption)<small>minimum fresh issue = Nominal value to redeem − Divisible profits available</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Can these be used for redemption?</h4>" + tbl(["Source", "Allowed?"], [["Divisible profits (P&L, general reserve)", "Yes, with transfer to CRR"], ["Nominal value of fresh share issue", "Yes"], ["Premium on fresh share issue", "Only for premium on redemption"], ["Proceeds of a fresh debenture issue", "No"], ["Capital reserve, revaluation reserve", "No"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles redeems 10,000 preference shares of ₹100 at a 5% premium. It issues 4,000 equity shares of ₹100 at par for the purpose. It has a large general reserve and securities premium of ₹80,000.</p>" +
          steps(["Nominal value to redeem = ₹10,00,000; covered by the fresh issue = ₹4,00,000.", "Redeemed out of profits = ₹6,00,000 → transfer ₹6,00,000 from General Reserve to CRR.", "Premium on redemption = ₹50,000, met from Securities Premium.", "If divisible profits were only ₹5,00,000, the minimum fresh issue would be 10,00,000 − 5,00,000 = ₹5,00,000."]);
      },
      use: ["Check that the shares are fully paid before planning redemption.", "Count only the nominal value of the fresh issue; use its premium for the redemption premium.", "Mistake: using proceeds of a debenture issue for redemption.", "Mistake: transferring the premium on redemption to CRR."],
      walk: function () { return [
        { t: "Section 55", c: "Redeemable within 20 years; only fully paid shares.", h: chips(["Fully paid", "≤ 20 years"], "ac") },
        { t: "Two sources", c: "Profits, or a fresh issue of shares.", h: chips(["Profits → CRR", "Fresh shares"], "hl") },
        { t: "CRR transfer", c: "Nominal redeemed out of profits.", h: box("10,00,000 − 4,00,000 (fresh issue)\n= CRR ₹6,00,000", "good") },
        { t: "Premium on redemption", c: "From profits or securities premium.", h: chips(["₹50,000 from securities premium"], "ac") },
        { t: "Minimum fresh issue", c: "Nominal to redeem − divisible profits.", h: '<div class="big">₹5,00,000</div>' }]; },
      recap: ["Redeem only fully paid preference shares, out of profits or a fresh share issue", "Transfer the nominal value redeemed out of profits to CRR"],
      qc: [{ q: "Preference shares of ₹5,00,000 are redeemed; fresh equity of ₹2,00,000 (nominal) is issued for it. CRR transfer?", o: ["₹3,00,000", "₹5,00,000", "₹2,00,000", "Nil"], a: 0, e: "5,00,000 − 2,00,000 = 3,00,000 out of profits." },
        { q: "Which source can NOT be used to redeem preference shares?", o: ["Proceeds of a fresh issue of debentures", "Proceeds of a fresh issue of equity shares", "Profits available for dividend", "General reserve"], a: 0, e: "Section 55 allows only profits or a fresh issue of shares." }]
    },
    {
      id: "4.12", mod: 4, ch: "Chapter 11, Unit 6", title: "Redemption of Debentures", time: "16 min", tool: "drr",
      outcomes: ["Describe the methods of redeeming debentures", "Explain the Debenture Redemption Reserve (DRR) and the investment requirement", "Record redemption by payment in lump sum or by purchase in the open market", "Account for conversion of debentures into shares"],
      notes: `<p>Debentures may be redeemed by <b>payment in a lump sum</b> at maturity, by <b>instalments</b> (drawing lots each year), by <b>purchase in the open market</b> (cancelling them when bought below par is a capital profit), or by <b>conversion</b> into shares or new debentures. Redemption may be out of capital (no transfer from profits) or out of profits (transferring an equal amount to a reserve).</p>
<p style="margin-top:10px">To protect debenture holders, <b>section 71(4)</b> and Rule 18(7) of the Companies (Share Capital and Debentures) Rules, 2014 require many companies to create a <b>Debenture Redemption Reserve (DRR)</b> out of profits available for dividend. Under the rules as amended in 2019, listed companies (other than certain financial institutions), NBFCs and housing finance companies are generally not required to create DRR for public issues, while other <b>unlisted companies</b> must keep a DRR of <b>10% of the value of outstanding debentures</b>. Separately, the companies covered must, on or before <b>30 April</b> each year, <b>invest or deposit at least 15%</b> of the amount of debentures <b>maturing during the year ending on 31 March</b> of the next year in specified securities or deposits; this money can be used only to redeem those debentures. Check the current Rules for exact applicability.</p>
<p style="margin-top:10px">On redemption: Debentures Dr (and Premium on Redemption Dr), To Debenture holders; Debenture holders Dr, To Bank. Once the debentures are redeemed, the DRR is no longer needed and is transferred to <b>General Reserve</b>. When debentures bought in the open market below their nominal value are cancelled, the difference is credited to <b>Profit on Cancellation of Debentures</b> and then to <b>Capital Reserve</b>.</p>`,
      formula: "DRR (unlisted companies) = 10% of outstanding debentures · Investment ≥ 15% of debentures maturing next year<small>after redemption, DRR → General Reserve · own debentures bought below par → Capital Reserve</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Methods of redemption</h4>" + tbl(["Method", "Key point"], [["Lump sum at maturity", "One payment at the end"], ["Instalments (draw of lots)", "Part redeemed each year"], ["Purchase in open market", "Profit on cancellation → Capital Reserve"], ["Conversion", "Into shares or new debentures"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Sunrise Textiles (assume unlisted) has 6,000 debentures of ₹100 (₹6,00,000), redeemable at par on 31 March 2028.</p>" +
          steps(["DRR required = 10% × 6,00,000 = ₹60,000, transferred from profits: Surplus (P&L) Dr, To DRR.", "Investment before 30 April 2027 = 15% × 6,00,000 = ₹90,000 in specified securities.", "On 31 March 2028: realise the investment, then Debentures Dr 6,00,000, To Debenture holders; Debenture holders Dr, To Bank 6,00,000.", "Transfer DRR ₹60,000 to General Reserve. If instead it had bought 1,000 of its own debentures at ₹96 and cancelled them, the profit of ₹4,000 would go to Capital Reserve."]);
      },
      use: ["Check whether DRR applies to the company before calculating it.", "Invest 15% of the debentures maturing next year by 30 April.", "Mistake: keeping DRR after the debentures are fully redeemed (transfer it to General Reserve).", "Mistake: crediting profit on cancellation of own debentures to the Statement of Profit and Loss."],
      walk: function () { return [
        { t: "Four ways to redeem", c: "Lump sum, instalments, open market, conversion.", h: chips(["Lump sum", "Instalments", "Open market", "Conversion"], "ac") },
        { t: "Debenture Redemption Reserve", c: "Out of profits, to protect holders.", h: box("Unlisted company:\nDRR = 10% × 6,00,000 = ₹60,000", "good") },
        { t: "15% investment", c: "Before 30 April, for debentures maturing next year.", h: '<div class="big">₹90,000</div>' },
        { t: "After redemption", c: "DRR moves to General Reserve.", h: chips(["DRR → General Reserve"], "hl") },
        { t: "Open market purchase", c: "Bought below par: profit → Capital Reserve.", h: chips(["1,000 × ₹4 = ₹4,000"], "ac") }]; },
      recap: ["Redeem by lump sum, instalments, open-market purchase or conversion", "DRR and 15% investment protect holders; DRR goes to General Reserve after redemption"],
      qc: [{ q: "Under the Rules, the investment for debentures maturing in the next year must be at least…", o: ["15% of the amount maturing", "10% of outstanding debentures", "25% of outstanding debentures", "50% of the amount maturing"], a: 0, e: "15%, made on or before 30 April." },
        { q: "After all debentures are redeemed, the Debenture Redemption Reserve is transferred to…", o: ["General Reserve", "Capital Reserve", "Securities Premium", "Share Capital"], a: 0, e: "It becomes a free reserve again." }]
    }
  ];

  var MODULES = [
    { n: 1, title: "Theoretical Framework", sub: "Meaning and scope, concepts and conventions, capital and revenue, contingencies, policies, measurement and accounting standards.", tag: "Module 1", short: "Theory", takeaway: "Accounting rests on a few ideas applied consistently: the entity concept, accrual, going concern and prudence decide most treatments, and accounting standards make the results comparable." },
    { n: 2, title: "Accounting Process and Special Topics", sub: "Journal, ledger, trial balance, subsidiary books, cash book, rectification, bank reconciliation, inventories, depreciation and bills.", tag: "Module 2", short: "Accounting process", takeaway: "Every transaction flows journal → ledger → trial balance. Check it with reconciliations, value stock at the lower of cost and NRV, and spread asset costs through depreciation." },
    { n: 3, title: "Final Accounts", sub: "Sole proprietors (trading and manufacturing), not-for-profit organisations and incomplete records.", tag: "Module 3", short: "Final accounts", takeaway: "Final accounts turn the trial balance into results and position: every adjustment appears twice, NPOs work on accrual through the Income and Expenditure Account, and incomplete records are rebuilt from capital changes." },
    { n: 4, title: "Partnership, LLP and Company Accounts", sub: "Partnership fundamentals, goodwill, admission, retirement, death, dissolution, and company shares and debentures.", tag: "Module 4", short: "Partnership & company", takeaway: "In partnerships, ratios decide everything: sacrificing on admission, gaining on retirement, old ratio for revaluation. In companies, the Companies Act sets the rules for premium, forfeiture, bonus, rights and redemption." }
  ];

  /* ================= FINAL TEST (30 questions across the 4 modules) ================= */
  var TEST = [
    { m: 1, q: "Which of these is a fundamental accounting assumption under AS 1?", o: ["Going concern", "Materiality", "Money measurement", "Dual aspect"], a: 0, e: "AS 1: going concern, consistency and accrual." },
    { m: 1, q: "The owner takes goods worth ₹2,000 for personal use. The concept that requires recording this as drawings is…", o: ["Business entity", "Realisation", "Matching", "Periodicity"], a: 0, e: "The business is separate from its owner." },
    { m: 1, q: "Legal fees paid for acquiring a building are…", o: ["Capital expenditure", "Revenue expenditure", "A revenue receipt", "Deferred revenue expenditure"], a: 0, e: "Costs of acquiring an asset are part of its cost." },
    { m: 1, q: "A contingent liability is…", o: ["Disclosed in notes unless remote", "Recognised as a provision", "Ignored always", "Shown as an asset"], a: 0, e: "AS 29: disclose possible obligations unless the outflow is remote." },
    { m: 1, q: "Changing the method of depreciation is treated under AS 10 as a change in…", o: ["Accounting estimate", "Accounting policy that needs restatement", "Error", "Nothing"], a: 0, e: "AS 10 treats it as a change in estimate." },
    { m: 1, q: "The discounted value of an asset's expected future net cash flows is its…", o: ["Present value", "Historical cost", "Current cost", "Realisable value"], a: 0, e: "Present value discounts future cash flows." },
    { m: 1, q: "For companies, accounting standards are prescribed by the Central Government under section…", o: ["133 of the Companies Act, 2013", "52", "63", "71"], a: 0, e: "Section 133, on ICAI's recommendation and after NFRA's examination." },
    { m: 2, q: "Goods sold on credit to Mohan. Which account is debited?", o: ["Mohan", "Sales", "Cash", "Purchases"], a: 0, e: "Mohan becomes a debtor (asset increases)." },
    { m: 2, q: "A credit balance in the cash column of a cash book indicates…", o: ["An error", "A bank overdraft", "Cash in hand", "Discount received"], a: 0, e: "Cash paid cannot exceed cash available." },
    { m: 2, q: "Which error is NOT disclosed by a trial balance?", o: ["Error of principle", "Wrong totalling of an account", "Posting to the wrong side", "One-sided posting"], a: 0, e: "Errors of principle affect two accounts equally." },
    { m: 2, q: "Credit purchase of machinery is recorded in the…", o: ["Journal Proper", "Purchases Book", "Cash Book", "Bills Payable Book"], a: 0, e: "The Purchases Book is only for goods." },
    { m: 2, q: "The Purchases account is overcast by ₹1,000. The rectifying entry (with suspense) is…", o: ["Suspense A/c Dr, To Purchases A/c ₹1,000", "Purchases A/c Dr, To Suspense A/c", "Purchases A/c Dr, To Cash A/c", "No entry needed"], a: 0, e: "Purchases was debited ₹1,000 too much: credit it; Suspense takes the other side." },
    { m: 2, q: "Starting from an overdraft as per cash book, cheques issued but not presented are…", o: ["Deducted from the overdraft", "Added to the overdraft", "Ignored", "Added twice"], a: 0, e: "The bank has not paid them, so its overdraft is smaller." },
    { m: 2, q: "Cost ₹40,000; NRV ₹36,000. Inventory value under AS 2?", o: ["₹36,000", "₹40,000", "₹38,000", "₹76,000"], a: 0, e: "Lower of cost and NRV." },
    { m: 2, q: "Machine ₹1,00,000, WDV 10%. Depreciation in year 2?", o: ["₹9,000", "₹10,000", "₹8,100", "₹19,000"], a: 0, e: "Year 1 ₹10,000; year 2 10% of ₹90,000 = ₹9,000." },
    { m: 2, q: "A 60-day bill is dated 1 June. Its due date is…", o: ["3 August", "31 July", "30 July", "1 August"], a: 0, e: "1 June + 60 days = 31 July; + 3 days of grace = 3 August." },
    { m: 3, q: "Wages paid for bringing goods to a saleable condition are shown in the…", o: ["Trading Account", "Profit and Loss Account", "Balance Sheet", "Appropriation Account"], a: 0, e: "They are direct expenses." },
    { m: 3, q: "Prepaid insurance of ₹1,200 is…", o: ["Deducted from insurance and shown as a current asset", "Added to insurance and shown as a liability", "Shown only in the P&L", "Ignored"], a: 0, e: "Paid in advance: an asset." },
    { m: 3, q: "Prime cost + factory overheads ± work-in-progress − scrap = …", o: ["Cost of production", "Cost of goods sold", "Gross profit", "Materials consumed"], a: 0, e: "That is the Manufacturing Account result." },
    { m: 3, q: "Life membership fees received by a club are usually…", o: ["Capitalised", "Shown as revenue in full", "Ignored", "Shown as a liability to the bank"], a: 0, e: "They relate to many years of membership." },
    { m: 3, q: "Opening capital ₹1,00,000; closing ₹1,30,000; drawings ₹20,000; no fresh capital. Profit?", o: ["₹50,000", "₹30,000", "₹10,000", "₹1,50,000"], a: 0, e: "1,30,000 + 20,000 − 1,00,000." },
    { m: 4, q: "In the absence of a partnership deed, profits are shared…", o: ["Equally", "In the capital ratio", "In the ratio of experience", "As the court decides"], a: 0, e: "Section 13(b)." },
    { m: 4, q: "Average profit ₹90,000; 2 years' purchase. Goodwill?", o: ["₹1,80,000", "₹45,000", "₹90,000", "₹2,70,000"], a: 0, e: "90,000 × 2." },
    { m: 4, q: "A and B share 2 : 1. C is admitted for 1/4, taken equally from A and B (1/8 each). New ratio?", o: ["13 : 5 : 6", "2 : 1 : 1", "6 : 3 : 3", "4 : 2 : 3"], a: 0, e: "A 16/24 − 3/24 = 13/24; B 8/24 − 3/24 = 5/24; C 6/24 → 13 : 5 : 6." },
    { m: 4, q: "On retirement, revaluation profit is shared among…", o: ["All partners in the old ratio", "Continuing partners in the new ratio", "The retiring partner only", "Continuing partners in the gaining ratio"], a: 0, e: "It arose before the change, so the old ratio applies." },
    { m: 4, q: "On dissolution of a firm, which is paid first?", o: ["Outside creditors", "Partners' loans", "Partners' capitals", "Surplus to partners"], a: 0, e: "Section 48." },
    { m: 4, q: "Shares of ₹10 can be re-issued after forfeiture at a maximum discount equal to…", o: ["The amount forfeited on those shares", "₹10", "Any amount", "Nil"], a: 0, e: "Discount on re-issue cannot exceed the forfeited amount." },
    { m: 4, q: "1,000 debentures of ₹100 issued at par, redeemable at 5% premium. Loss on issue?", o: ["₹5,000", "Nil", "₹1,00,000", "₹105"], a: 0, e: "Premium on redemption ₹5 × 1,000." },
    { m: 4, q: "Bonus shares may be issued out of…", o: ["Securities premium", "Revaluation reserve", "Share forfeiture of unissued shares", "Debenture proceeds"], a: 0, e: "Section 63: free reserves, securities premium, CRR." },
    { m: 4, q: "Preference shares are redeemed out of profits. An amount equal to their nominal value is transferred to…", o: ["Capital Redemption Reserve", "Debenture Redemption Reserve", "Capital Reserve", "Securities Premium"], a: 0, e: "Section 55." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Accounting", "Identifying, measuring, recording, classifying, summarising and communicating financial information.", "Preparing Meera's final accounts", "1.1"],
    ["Book-keeping", "The recording stage of accounting.", "Journal and ledger entries", "1.1"],
    ["Business entity concept", "The business is treated as separate from its owner.", "Owner's rent → drawings", "1.2"],
    ["Accrual concept", "Revenue and expenses are recorded when earned or incurred.", "December bill paid in January", "1.2"],
    ["Prudence", "Provide for probable losses; do not anticipate gains.", "Stock at lower of cost and NRV", "1.2"],
    ["Capital expenditure", "Spending that gives benefit over more than one period.", "Buying a delivery van", "1.3"],
    ["Revenue expenditure", "Spending whose benefit is used up in the period.", "Salaries, petrol", "1.3"],
    ["Contingent liability", "A possible obligation depending on uncertain future events; disclosed, not recognised.", "Guarantee for another's loan", "1.4"],
    ["Provision", "A liability of uncertain amount or timing, recognised when probable and measurable.", "Warranty provision", "1.4"],
    ["Accounting policy", "The principles and methods chosen to prepare financial statements.", "FIFO for inventories", "1.5"],
    ["Net realisable value", "Estimated selling price less costs of completion and sale.", "₹11,000 − ₹1,500 = ₹9,500", "1.6"],
    ["Accounting Standard", "An authoritative statement on recognition, measurement, presentation and disclosure.", "AS 2 Inventories", "1.7"],
    ["Journal", "The book of original entry recording transactions in date order.", "Cash A/c Dr, To Capital A/c", "2.1"],
    ["Ledger", "The principal book grouping transactions account by account.", "Cash account", "2.2"],
    ["Trial balance", "A list of ledger balances to check arithmetical accuracy.", "Dr ₹2,68,000 = Cr ₹2,68,000", "2.3"],
    ["Suspense account", "A temporary account for an unexplained trial balance difference.", "Difference of ₹1,500", "2.3"],
    ["Subsidiary books", "Special journals for repeated types of transaction.", "Purchases Book, Sales Book", "2.4"],
    ["Contra entry", "An entry affecting both cash and bank columns.", "Cash deposited into bank", "2.5"],
    ["Imprest system", "Petty cash float restored by reimbursing the amount spent.", "Float ₹5,000", "2.5"],
    ["Error of principle", "Treating a capital item as revenue or vice versa.", "Furniture debited to Purchases", "2.6"],
    ["Bank reconciliation statement", "A statement explaining the difference between cash book and pass book balances.", "Cheques not yet presented", "2.7"],
    ["FIFO", "Cost formula assuming the earliest units are issued first.", "Closing stock at latest prices", "2.8"],
    ["Depreciation", "Systematic allocation of an asset's depreciable amount over its useful life.", "₹90,000 a year (SLM)", "2.9"],
    ["Written down value method", "Depreciation at a fixed rate on the opening book value.", "20% of ₹4,00,000", "2.9"],
    ["Bill of exchange", "A written unconditional order to pay a certain sum.", "Drawer, drawee, payee", "2.10"],
    ["Days of grace", "Three days added to the due date of a time bill.", "10 Apr → 13 Apr", "2.10"],
    ["Gross profit", "Net sales minus cost of goods sold.", "₹1,75,000", "3.1"],
    ["Prime cost", "Materials consumed + direct wages + direct expenses.", "₹2,80,000", "3.2"],
    ["Income and Expenditure Account", "An NPO's accrual-based revenue account; balance is surplus or deficit.", "Subscription income ₹2,36,000", "3.3"],
    ["Statement of affairs", "A list of assets and liabilities used to find capital under single entry.", "Opening capital ₹85,000", "3.4"],
    ["Partnership deed", "The written agreement among partners.", "Ratio, interest, salaries", "4.1"],
    ["Appropriation Account", "Shows how partners divide net profit.", "IOC, salary, share of profit", "4.1"],
    ["Goodwill", "The value of a firm's ability to earn above-normal profits.", "Average profit × years' purchase", "4.2"],
    ["Super profit", "Average profit minus normal profit on capital employed.", "₹28,000", "4.2"],
    ["Sacrificing ratio", "The ratio in which old partners give up share to a new partner.", "Old share − new share", "4.3"],
    ["Revaluation Account", "Records changes in asset and liability values on reconstitution.", "Profit shared in old ratio", "4.3"],
    ["Gaining ratio", "The ratio in which continuing partners gain a retiring partner's share.", "New share − old share", "4.4"],
    ["Executor", "The legal representative who receives a deceased partner's dues.", "Executor's Account", "4.5"],
    ["Realisation Account", "Finds profit or loss on selling assets and paying liabilities on dissolution.", "Loss ₹20,000", "4.6"],
    ["Garner v Murray", "Insolvent partner's deficiency borne by solvent partners in capital ratio.", "Capital ratio, not profit ratio", "4.6"],
    ["Authorised capital", "The maximum share capital a company may issue.", "₹10,00,000", "4.7"],
    ["Calls in arrears", "Called-up amounts not yet paid by shareholders.", "₹4,000", "4.7"],
    ["Securities premium", "Excess of issue price over face value; uses limited by s.52.", "₹2 per share", "4.8"],
    ["Forfeiture", "Cancelling shares of a shareholder who fails to pay calls.", "Share Forfeiture A/c", "4.8"],
    ["Debenture", "A written acknowledgement of debt by a company.", "5,000 debentures of ₹100", "4.9"],
    ["Bonus shares", "Free fully paid shares issued by capitalising reserves (s.63).", "1 : 5 bonus", "4.10"],
    ["Rights issue", "Offer of new shares to existing shareholders (s.62).", "1 : 4 at ₹15", "4.10"],
    ["Capital Redemption Reserve", "Reserve equal to preference shares redeemed out of profits (s.55).", "₹6,00,000", "4.11"],
    ["Debenture Redemption Reserve", "Reserve out of profits for redeeming debentures (s.71).", "10% of outstanding", "4.12"]
  ];

  /* ================= ACCOUNTING TOOLS ================= */
  /* fractions and ratios */
  function Fr(n, d) { if (d === undefined) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(Math.round(n), Math.round(d)) || 1; return { n: Math.round(n) / g, d: Math.round(d) / g }; }
  function fAdd(a, b) { return Fr(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fSub(a, b) { return Fr(a.n * b.d - b.n * a.d, a.d * b.d); }
  function fMul(a, b) { return Fr(a.n * b.n, a.d * b.d); }
  function fVal(a) { return a.n / a.d; }
  function fStr(a) { return a.d === 1 ? String(a.n) : a.n + "/" + a.d; }
  function parseFr(s) { s = String(s).trim(); var m = s.match(/^(-?\d+)\s*\/\s*(\d+)$/); if (m) return +m[2] ? Fr(+m[1], +m[2]) : null; var x = Number(s); if (!isFinite(x) || s === "") return null; var d = 1; while (Math.abs(x * d - Math.round(x * d)) > 1e-9 && d < 1e6) d *= 10; return Fr(x * d, d); }
  function parseRatio(s) { var p = String(s).split(/\s*[:,]\s*/).filter(Boolean).map(Number); return p.length >= 2 && p.every(function (x) { return isFinite(x) && x >= 0; }) && p.some(function (x) { return x > 0; }) ? p : null; }
  function ratioShares(r) { var t = r.reduce(function (s, x) { return s + x; }, 0); return r.map(function (x) { return Fr(x * 1e6, t * 1e6); }); }
  function toRatio(fs) { var l = fs.reduce(function (L, f) { return L / gcd(L, f.d) * f.d; }, 1), ints = fs.map(function (f) { return f.n * (l / f.d); }), g = ints.reduce(function (G, x) { return gcd(G, x); }, 0) || 1; return ints.map(function (x) { return x / g; }).join(" : "); }
  function names(s, k) { var a = String(s).split(/\s*,\s*/).filter(Boolean); while (a.length < k) a.push("Partner " + (a.length + 1)); return a.slice(0, k); }
  function money(x) { return inr(x).replace(".00", ""); }
  function lines(id) { return val(id).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function cells(l) { return l.split(/\s*[|,;\t]\s*/); }

  /* 1.6 measurement bases */
  TOOLS.measure = { d: "Enter the facts about an asset to see its value under the four measurement bases.",
    b: function () { return g3(inp("m_hc", "120000", "Historical cost (₹)"), inp("m_cc", "150000", "Current cost of a new one (₹)"), inp("m_sp", "60000", "Price it would fetch now (₹)")) + g3(inp("m_sc", "2000", "Costs of selling (₹)"), inp("m_cf", "30000", "Net cash flow per year (₹)"), inp("m_y", "3", "Remaining years", "", "numeric")) + inp("m_r", "10", "Discount rate % a year"); },
    run: function () { var hc = n("m_hc"), cc = n("m_cc"), sp = n("m_sp"), sc = n("m_sc"), cf = n("m_cf"), y = n("m_y"), r = n("m_r") / 100;
      if (![hc, cc, sp, sc, cf, y, r].every(fin) || y < 1 || y > 50 || r <= -1) return err("Enter all values (years 1–50).");
      var pv = 0, rows = ""; for (var t = 1; t <= y; t++) { var f = Math.pow(1 + r, -t); pv += cf * f; rows += "<tr><td>" + t + "</td><td>" + money(cf) + "</td><td>" + fmt(f, 4) + "</td><td>" + money(cf * f) + "</td></tr>"; }
      return kv([["Historical cost", money(hc)], ["Current cost", money(cc)], ["Realisable value", money(sp - sc)], ["Present value", money(pv)]]) + '<div class="tscroll"><table><tr><th>Year</th><th>Cash flow</th><th>Discount factor</th><th>Present value</th></tr>' + rows + "</table></div>"; } };

  /* 2.1 journal trainer */
  TOOLS.journal = { d: "For each transaction, choose the account to debit and the account to credit, then check.", b: function () { return ""; },
    wire: function (l, cout) { var c = l.tcfg, k = 0, ans = {};
      function opts(sel) { return '<option value="">Choose…</option>' + c.accounts.map(function (a) { return "<option" + (a === sel ? " selected" : "") + ">" + esc(a) + "</option>"; }).join(""); }
      function draw() { var t = c.tx[k], a = ans[k], right = Object.keys(ans).filter(function (i) { return ans[i].ok; }).length;
        cout.innerHTML = '<div class="row" style="justify-content:space-between"><span class="tag indigo">Transaction ' + (k + 1) + " of " + c.tx.length + '</span><span class="small muted">' + right + " correct</span></div>" +
          '<div class="q" style="margin-top:10px"><b>' + esc(t[0]) + '</b>' + g2('<div class="field"><label for="jr_dr">Debit (Dr)</label><select id="jr_dr">' + opts(a && a.dr) + "</select></div>", '<div class="field"><label for="jr_cr">Credit (Cr)</label><select id="jr_cr">' + opts(a && a.cr) + "</select></div>") +
          '<div class="row" style="margin-top:10px"><button class="btn btn-ink btn-sm" id="jr_chk">Check</button></div>' +
          (a ? '<div class="expl">' + (a.ok ? "✅ Correct: " : "Not quite. The entry is ") + "<b>" + esc(t[1]) + " A/c Dr, To " + esc(t[2]) + " A/c</b>. " + esc(t[3]) + "</div>" : "") + "</div>" +
          '<div class="row" style="justify-content:space-between;margin-top:10px"><button class="btn btn-soft btn-sm" id="jr_prev"' + (k ? "" : " disabled") + '>← Previous</button><button class="btn btn-ink btn-sm" id="jr_next"' + (k < c.tx.length - 1 ? "" : " disabled") + ">Next →</button></div>"; }
      cout.addEventListener("click", function (e) { var id = e.target.id;
        if (id === "jr_chk") { var dr = val("jr_dr"), cr = val("jr_cr"); if (!dr || !cr) return; ans[k] = { dr: dr, cr: cr, ok: dr === c.tx[k][1] && cr === c.tx[k][2] }; draw(); }
        if (id === "jr_prev" && k > 0) { k--; draw(); } if (id === "jr_next" && k < c.tx.length - 1) { k++; draw(); } });
      draw(); } };

  /* 2.2 ledger posting */
  var JE0 = "Cash | Capital | 200000\nBank | Cash | 120000\nPurchases | Kapoor Paper Co | 50000\nCash | Sales | 30000\nSita | Sales | 18000\nRent | Bank | 8000\nKapoor Paper Co | Bank | 30000\nCash | Sita | 10000\nDrawings | Cash | 5000\nFurniture | Cash | 12000";
  function postAll(text) { var acs = {}, order = [], bad = [];
    text.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (ln) { var c = cells(ln), amt = Number(String(c[2] || "").replace(/[₹,\s]/g, ""));
      if (c.length < 3 || !c[0] || !c[1] || !(amt > 0)) { bad.push(ln); return; }
      [c[0], c[1]].forEach(function (a) { if (!acs[a]) { acs[a] = { dr: [], cr: [] }; order.push(a); } });
      acs[c[0]].dr.push(["To " + c[1], amt]); acs[c[1]].cr.push(["By " + c[0], amt]); });
    return { acs: acs, order: order, bad: bad }; }
  TOOLS.ledger = { d: "Enter journal entries, one per line, as: Debit account | Credit account | amount. The tool posts them and balances every account.",
    b: function () { return ta("lg_in", JE0, 8, "Journal entries"); },
    run: function () { var P = postAll(val("lg_in")); if (P.bad.length) return err("I could not read: " + P.bad.map(esc).join("; ") + ". Use: Debit account | Credit account | amount");
      if (!P.order.length) return err("Enter at least one entry."); if (P.order.length > 30) return err("Please keep to 30 accounts or fewer.");
      var h = '<div class="grid g2">', sum = [];
      P.order.forEach(function (a) { var A = P.acs[a], d = A.dr.reduce(function (s, x) { return s + x[1]; }, 0), c = A.cr.reduce(function (s, x) { return s + x[1]; }, 0), bal = d - c, rows = Math.max(A.dr.length, A.cr.length) + 1, t = "";
        var dr = A.dr.slice(), cr = A.cr.slice(); if (bal > 0) cr.push(["By Balance c/d", bal]); else if (bal < 0) dr.push(["To Balance c/d", -bal]);
        rows = Math.max(dr.length, cr.length);
        for (var i = 0; i < rows; i++) t += "<tr><td style=\"text-align:left\">" + (dr[i] ? esc(dr[i][0]) : "") + "</td><td>" + (dr[i] ? money(dr[i][1]) : "") + "</td><td style=\"text-align:left\">" + (cr[i] ? esc(cr[i][0]) : "") + "</td><td>" + (cr[i] ? money(cr[i][1]) : "") + "</td></tr>";
        var tot = Math.max(d, c); t += "<tr style=\"font-weight:700\"><td></td><td>" + money(tot) + "</td><td></td><td>" + money(tot) + "</td></tr>";
        if (bal) t += "<tr><td style=\"text-align:left\">" + (bal > 0 ? "To Balance b/d" : "") + "</td><td>" + (bal > 0 ? money(bal) : "") + "</td><td style=\"text-align:left\">" + (bal < 0 ? "By Balance b/d" : "") + "</td><td>" + (bal < 0 ? money(-bal) : "") + "</td></tr>";
        h += '<div class="card" style="padding:12px"><b>' + esc(a) + ' A/c</b><div class="tscroll"><table><tr><th>Dr</th><th>₹</th><th>Cr</th><th>₹</th></tr>' + t + "</table></div></div>";
        sum.push([a, bal]); });
      var dt = sum.reduce(function (s, x) { return s + Math.max(x[1], 0); }, 0), ct = sum.reduce(function (s, x) { return s + Math.max(-x[1], 0); }, 0);
      return h + "</div>" + sub("Balances") + kv(sum.map(function (x) { return [esc(x[0]), x[1] === 0 ? "nil" : money(Math.abs(x[1])) + (x[1] > 0 ? " Dr" : " Cr")]; })) + kv([["Total debit balances", money(dt)], ["Total credit balances", money(ct)], ["Agree?", Math.abs(dt - ct) < 0.005 ? "Yes ✓" : "No"]]); } };

  /* 2.3 trial balance */
  var TB0 = "Cash | Dr | 103000\nBank | Dr | 82000\nCapital | Cr | 200000\nPurchases | Dr | 50000\nSales | Cr | 48000\nKapoor Paper Co | Cr | 20000\nSita | Dr | 8000\nRent | Dr | 8000\nDrawings | Dr | 5000\nFurniture | Dr | 12000";
  var DR_WORDS = /\b(cash|bank|purchases?|drawings|sales returns|returns inward|rent|wages|salar|carriage|insurance|debtors?|furniture|machinery|plant|building|stock|advertis|electricity|discount allowed|bad debts|bills receivable|prepaid|depreciation|interest paid|printing|postage|repairs)\b/i;
  var CR_WORDS = /\b(capital|sales\b(?! returns)|creditors?|loan|purchase returns|returns outward|commission received|interest received|discount received|bills payable|reserve|outstanding|rent received|provision)\b/i;
  TOOLS.tb = { d: "Enter ledger balances as: Account | Dr or Cr | amount. The tool builds the trial balance, checks agreement and flags balances on an unusual side.",
    b: function () { return ta("tb_in", TB0, 8, "Balances"); },
    run: function () { var rows = [], bad = [], dr = 0, cr = 0, warn = [];
      lines("tb_in").forEach(function (ln) { var c = cells(ln), side = String(c[1] || "").toLowerCase(), amt = Number(String(c[2] || "").replace(/[₹,\s]/g, ""));
        if (c.length < 3 || !(side === "dr" || side === "cr") || !(amt >= 0)) { bad.push(ln); return; }
        rows.push([c[0], side, amt]); if (side === "dr") dr += amt; else cr += amt;
        if (side === "cr" && DR_WORDS.test(c[0]) && !CR_WORDS.test(c[0])) warn.push(c[0] + " usually has a debit balance");
        if (side === "dr" && CR_WORDS.test(c[0]) && !DR_WORDS.test(c[0])) warn.push(c[0] + " usually has a credit balance"); });
      if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Use: Account | Dr | amount");
      var t = rows.map(function (r) { return [esc(r[0]), r[1] === "dr" ? money(r[2]) : "", r[1] === "cr" ? money(r[2]) : ""]; }), diff = dr - cr;
      if (Math.abs(diff) > 0.004) t.push(["<i>Suspense A/c (difference)</i>", diff < 0 ? money(-diff) : "", diff > 0 ? money(diff) : ""]);
      t.push(["<b>Total</b>", "<b>" + money(Math.max(dr, cr)) + "</b>", "<b>" + money(Math.max(dr, cr)) + "</b>"]);
      return tbl(["Account", "Dr (₹)", "Cr (₹)"], t) + kv([["Debit total", money(dr)], ["Credit total", money(cr)], ["Result", Math.abs(diff) < 0.005 ? "Agrees ✓" : "Difference " + money(Math.abs(diff)) + " → Suspense A/c " + (diff > 0 ? "Cr" : "Dr")]]) + (warn.length ? note("Check: " + warn.map(esc).join("; ") + ".") : ""); } };

  /* 2.5 cash book */
  var CB0 = "R | cash | 15000 | 0 | Sales\nP | cash | 25000 | 0 | Bank (C)\nR | bank | 25000 | 0 | Cash (C)\nR | bank | 9800 | 200 | Sita\nP | bank | 14600 | 400 | Kapoor Paper Co\nP | cash | 6000 | 0 | Wages";
  TOOLS.cashbook = { d: "Enter the opening balances and one entry per line as: R (receipt) or P (payment) | cash or bank | amount | discount | particulars. For a contra entry, enter both sides.",
    b: function () { return g2(inp("cb_c", "20000", "Opening cash (₹)"), inp("cb_b", "40000", "Opening bank (₹, negative for overdraft)")) + ta("cb_in", CB0, 7, "Entries"); },
    run: function () { var oc = n("cb_c"), ob = n("cb_b"); if (!fin(oc) || !fin(ob) || oc < 0) return err("Enter opening cash (not negative) and opening bank balances.");
      var R = { cash: 0, bank: 0, disc: 0 }, P = { cash: 0, bank: 0, disc: 0 }, rows = [], bad = [], cash = oc, neg = false;
      lines("cb_in").forEach(function (ln) { var c = cells(ln), t = (c[0] || "").toUpperCase(), col = (c[1] || "").toLowerCase(), amt = Number(String(c[2] || "").replace(/[₹,\s]/g, "")), dc = Number(String(c[3] || "0").replace(/[₹,\s]/g, "")) || 0;
        if (!(t === "R" || t === "P") || !(col === "cash" || col === "bank") || !(amt > 0) || dc < 0) { bad.push(ln); return; }
        var S = t === "R" ? R : P; S[col] += amt; S.disc += dc; if (col === "cash") { cash += t === "R" ? amt : -amt; if (cash < -0.004) neg = true; }
        rows.push([t === "R" ? "Dr" : "Cr", esc(c[4] || ""), col === "cash" ? money(amt) : "", col === "bank" ? money(amt) : "", dc ? money(dc) : ""]); });
      if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Use: R | cash | 15000 | 0 | Sales");
      var cc = oc + R.cash - P.cash, bb = ob + R.bank - P.bank;
      return tbl(["Side", "Particulars", "Cash", "Bank", "Discount"], [["Dr", "Balance b/d", money(oc), money(ob), ""]].concat(rows)) +
        kv([["Cash: receipts / payments", money(oc + R.cash) + " / " + money(P.cash)], ["Bank: receipts / payments", money(Math.max(ob, 0) + R.bank) + " / " + money(P.bank + Math.max(-ob, 0))], ["Closing cash", money(cc)], ["Closing bank", bb < 0 ? money(-bb) + " (overdraft)" : money(bb)], ["Discount allowed (Dr)", money(R.disc)], ["Discount received (Cr)", money(P.disc)]]) +
        (neg || cc < 0 ? err("Cash went below zero: the cash column can never have a credit balance. Check the entries.") : note("Post the discount column totals to Discount Allowed (Dr) and Discount Received (Cr) accounts; contra entries (C) are not posted.")); } };

  /* 2.7 BRS */
  var BRS_ITEMS = [["br_ni", "Cheques issued but not yet presented", 1, "12000"], ["br_nc", "Cheques deposited but not yet credited", -1, "8500"], ["br_ch", "Bank charges not in cash book", -1, "300"], ["br_in", "Interest credited by bank, not in cash book", 1, "1200"], ["br_dd", "Direct deposits by customers, not in cash book", 1, "5000"], ["br_dp", "Direct payments by bank (insurance, EMI), not in cash book", -1, "2400"], ["br_dh", "Cheques deposited and dishonoured, not in cash book", -1, "1500"]];
  TOOLS.brs = { d: "Enter the cash book balance and each difference. The tool prepares the Bank Reconciliation Statement and the pass book balance.",
    b: function () { return g2(inp("br_bal", "45000", "Balance as per cash book (₹)"), sel("br_t", [["fav", "Favourable (debit)"], ["od", "Overdraft (credit)"]], "fav", "Type")) + '<div class="grid g2">' + BRS_ITEMS.map(function (it) { return inp(it[0], it[3], it[1] + " (₹)"); }).join("") + "</div>"; },
    run: function () { var b = n("br_bal"); if (!fin(b) || b < 0) return err("Enter the cash book balance as a positive number and choose its type.");
      var start = val("br_t") === "od" ? -b : b, x = start, rows = [["Balance as per cash book" + (start < 0 ? " (overdraft)" : ""), money(b), ""]];
      for (var i = 0; i < BRS_ITEMS.length; i++) { var v = n(BRS_ITEMS[i][0]); if (!fin(v)) v = 0; if (v < 0) return err("Amounts must not be negative."); if (v) { x += BRS_ITEMS[i][2] * v; rows.push([(BRS_ITEMS[i][2] > 0 ? "Add: " : "Less: ") + BRS_ITEMS[i][1], BRS_ITEMS[i][2] > 0 ? money(v) : "", BRS_ITEMS[i][2] < 0 ? money(v) : ""]); } }
      rows.push(["<b>Balance as per pass book</b>", "<b>" + money(Math.abs(x)) + "</b>", x < 0 ? "<b>overdraft</b>" : "<b>favourable</b>"]);
      return tbl(["Particulars", "+ (₹)", "− (₹)"], rows) + note(start < 0 ? "Starting from an overdraft, the overdraft is treated as a negative balance; adding reduces it." : "Starting from a favourable cash book balance."); } };

  /* 2.8 inventory */
  var INV0 = "opening, 100, 20\npurchase, 200, 22\nissue, 180\npurchase, 150, 25\nissue, 170";
  TOOLS.inventory = { d: "Enter stock movements in order (opening/purchase, quantity, rate; issue, quantity). The tool values closing stock by FIFO and weighted average and applies the lower of cost and NRV.",
    b: function () { return ta("iv_in", INV0, 6, "Movements") + inp("iv_nrv", "24", "NRV per unit of closing stock (₹, optional)"); },
    run: function () { var lots = [], fifoCOGS = 0, totU = 0, totC = 0, issued = 0, bad = [], short = false;
      lines("iv_in").forEach(function (ln) { var c = cells(ln), t = (c[0] || "").toLowerCase(), q = Number(c[1]), r = Number(c[2]);
        if (/^(opening|purchase|receipt)/.test(t) && q > 0 && r >= 0) { lots.push([q, r]); totU += q; totC += q * r; }
        else if (/^(issue|sale|sold)/.test(t) && q > 0) { issued += q; var need = q; while (need > 1e-9 && lots.length) { var L = lots[0], take = Math.min(L[0], need); fifoCOGS += take * L[1]; L[0] -= take; need -= take; if (L[0] <= 1e-9) lots.shift(); } if (need > 1e-9) short = true; }
        else bad.push(ln); });
      if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Use: purchase, 200, 22 or issue, 180");
      if (short) return err("More units were issued than were in stock. Check the quantities.");
      var cu = totU - issued, fifoC = lots.reduce(function (s, L) { return s + L[0] * L[1]; }, 0), avg = totU ? totC / totU : 0, waC = cu * avg, nrv = n("iv_nrv");
      var h = kv([["Units available", fmt(totU, 2)], ["Units issued", fmt(issued, 2)], ["Closing units", fmt(cu, 2)]]) +
        tbl(["", "FIFO", "Weighted average (periodic)"], [["Closing stock at cost", money(fifoC), money(waC) + " (avg " + fmt(avg, 4) + ")"], ["Cost of goods issued", money(fifoCOGS), money(totC - waC)]]);
      if (fin(nrv) && nrv >= 0 && cu > 0) { var N = nrv * cu; h += kv([["NRV of closing stock", money(N)], ["Value (FIFO) = lower of cost and NRV", money(Math.min(fifoC, N))], ["Value (weighted average)", money(Math.min(waC, N))]]); }
      return h + note("LIFO is not permitted under AS 2."); } };

  /* 2.9 depreciation */
  TOOLS.dep = { d: "Enter the asset details to compare straight line and written down value depreciation, year by year.",
    b: function () { return g3(inp("dp_c", "500000", "Cost (₹)"), inp("dp_r", "50000", "Residual value (₹)"), inp("dp_l", "5", "Useful life (years)", "", "numeric")) + g3(inp("dp_w", "20", "WDV rate % (leave blank to use the rate that reaches residual value)"), inp("dp_s", "2", "Sell at the end of year (optional)", "", "numeric"), inp("dp_p", "330000", "Sale price (₹, optional)")); },
    run: function () { var c = n("dp_c"), r = n("dp_r"), L = n("dp_l"), w = val("dp_w").trim() === "" ? NaN : n("dp_w") / 100;
      if (![c, r, L].every(fin) || c <= 0 || r < 0 || r >= c || !(Number.isInteger(L) && L >= 1 && L <= 50)) return err("Enter cost, a residual value below cost and a whole-number life (1–50).");
      var need = 1 - Math.pow(r / c, 1 / L); if (!fin(w)) w = need; if (!(w > 0 && w < 1)) return err("The WDV rate must be between 0% and 100%.");
      var sl = (c - r) / L, bs = c, bw = c, rows = "", bv = { s: [], w: [] };
      for (var y = 1; y <= L; y++) { var dw = bw * w; bs -= sl; bw -= dw; bv.s.push(bs); bv.w.push(bw); rows += "<tr><td>" + y + "</td><td>" + money(sl) + "</td><td>" + money(bs) + "</td><td>" + money(dw) + "</td><td>" + money(bw) + "</td></tr>"; }
      var h = kv([["SLM per year", money(sl)], ["WDV rate used", fmt(w * 100, 2) + "%"], ["WDV rate to reach residual in " + L + " years", fmt(need * 100, 2) + "%"]]) + '<div class="tscroll"><table><tr><th>Year</th><th>SLM charge</th><th>SLM book value</th><th>WDV charge</th><th>WDV book value</th></tr>' + rows + "</table></div>";
      var s = n("dp_s"), p = n("dp_p"); if (Number.isInteger(s) && s >= 1 && s <= L && fin(p)) { var gs = p - bv.s[s - 1], gw = p - bv.w[s - 1]; h += sub("Sale at the end of year " + s + " for " + money(p)) + kv([["SLM: " + (gs >= 0 ? "profit" : "loss"), money(Math.abs(gs))], ["WDV: " + (gw >= 0 ? "profit" : "loss"), money(Math.abs(gw))]]); }
      return h; } };

  /* 2.10 bills */
  function dParse(s) { var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null; }
  function dStr(d) { return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); }
  function addMonths(d, k) { var y = d.getUTCFullYear(), m = d.getUTCMonth() + k, day = d.getUTCDate(), last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); return new Date(Date.UTC(y, m, Math.min(day, last))); }
  TOOLS.bills = { d: "Enter the bill details to find the due date (with days of grace) and, if it is discounted, the discount and proceeds. Sundays count as public holidays; you can add another holiday.",
    b: function () { return g3(inp("bl_d", "2027-01-10", "Date of bill (or acceptance, for 'after sight')", "", "text"), sel("bl_u", [["m", "Months after date/sight"], ["d", "Days after date/sight"], ["s", "On demand / at sight"]], "m", "Term"), inp("bl_t", "3", "Term", "", "numeric")) + g3(inp("bl_h", "", "Another public holiday (YYYY-MM-DD, optional)", "", "text"), inp("bl_f", "60000", "Face value (₹)"), inp("bl_r", "12", "Discount rate % a year")) + inp("bl_x", "2027-02-10", "Date discounted (optional, YYYY-MM-DD)", "", "text"); },
    run: function () { var d = dParse(val("bl_d")), u = val("bl_u"), t = n("bl_t"); if (!d) return err("Enter the date as YYYY-MM-DD.");
      if (u === "s") return kv([["Due date", dStr(d) + " (no days of grace)"]]);
      if (!(Number.isInteger(t) && t > 0 && t < 400)) return err("Enter a whole-number term.");
      var nom = u === "m" ? addMonths(d, t) : new Date(d.getTime() + t * 864e5), due = new Date(nom.getTime() + 3 * 864e5), h2 = dParse(val("bl_h")), moved = [];
      for (var i = 0; i < 10; i++) { var hol = due.getUTCDay() === 0 || (h2 && due.getTime() === h2.getTime()); if (!hol) break; moved.push(dStr(due)); due = new Date(due.getTime() - 864e5); }
      var h = kv([["Nominal due date", dStr(nom)], ["+ 3 days of grace", dStr(new Date(nom.getTime() + 3 * 864e5))], ["Legal due date", "<b>" + dStr(due) + "</b>"]]) + (moved.length ? note("Moved back from " + moved.join(", ") + " (public holiday): due on the preceding business day.") : "");
      var x = dParse(val("bl_x")), f = n("bl_f"), r = n("bl_r");
      if (x && fin(f) && fin(r) && f > 0) { var days = Math.round((due - x) / 864e5); if (days < 0) return h + err("The discount date is after the due date.");
        var disc = f * r / 100 * days / 365; h += sub("Discounting") + kv([["Days to maturity", days], ["Discount = face × rate × days ÷ 365", money(disc)], ["Proceeds", money(f - disc)]]); }
      return h; } };

  /* 3.1 final accounts */
  var FA = [["fa_os", "Opening stock", "40000"], ["fa_pu", "Purchases", "320000"], ["fa_pr", "Purchase returns", "5000"], ["fa_ci", "Carriage inward / direct expenses", "6000"], ["fa_wg", "Wages (direct)", "14000"], ["fa_sa", "Sales", "500000"], ["fa_sr", "Sales returns", "10000"], ["fa_cs", "Closing stock", "60000"], ["fa_sl", "Salaries", "48000"], ["fa_so", "Salaries outstanding", "4000"], ["fa_rn", "Rent", "24000"], ["fa_rp", "Rent prepaid", "2000"], ["fa_ad", "Advertising and other indirect expenses", "9000"], ["fa_dp", "Depreciation", "6000"], ["fa_pd", "Provision for doubtful debts", "4000"], ["fa_oi", "Other incomes (interest, commission)", "3000"]];
  TOOLS.final = { d: "Enter the year-end figures and adjustments. The tool prepares the Trading and Profit and Loss Account.",
    b: function () { return '<div class="grid g3">' + FA.map(function (f) { return inp(f[0], f[2], f[1] + " (₹)"); }).join("") + "</div>"; },
    run: function () { var v = {}; for (var i = 0; i < FA.length; i++) { var x = n(FA[i][0]); if (!fin(x)) x = 0; if (x < 0) return err("Amounts must not be negative."); v[FA[i][0]] = x; }
      var np_ = v.fa_pu - v.fa_pr, ns = v.fa_sa - v.fa_sr, cost = v.fa_os + np_ + v.fa_ci + v.fa_wg, gp = ns + v.fa_cs - cost, sal = v.fa_sl + v.fa_so, rent = v.fa_rn - v.fa_rp, ind = sal + rent + v.fa_ad + v.fa_dp + v.fa_pd, np = gp + v.fa_oi - ind;
      return sub("Trading Account") + tbl(["Dr", "₹", "Cr", "₹"], [["Opening stock", money(v.fa_os), "Sales less returns", money(ns)], ["Purchases less returns", money(np_), "Closing stock", money(v.fa_cs)], ["Direct expenses + wages", money(v.fa_ci + v.fa_wg), "", ""], [gp >= 0 ? "Gross profit c/d" : "", gp >= 0 ? money(gp) : "", gp < 0 ? "Gross loss c/d" : "", gp < 0 ? money(-gp) : ""]]) +
        sub("Profit and Loss Account") + tbl(["Dr", "₹", "Cr", "₹"], [["Salaries + outstanding", money(sal), gp >= 0 ? "Gross profit b/d" : "", gp >= 0 ? money(gp) : ""], ["Rent − prepaid", money(rent), "Other incomes", money(v.fa_oi)], ["Advertising and other", money(v.fa_ad), "", ""], ["Depreciation", money(v.fa_dp), "", ""], ["Provision for doubtful debts", money(v.fa_pd), "", ""], [gp < 0 ? "Gross loss b/d" : "", gp < 0 ? money(-gp) : "", "", ""]]) +
        kv([["Gross profit", money(gp)], ["Net " + (np >= 0 ? "profit" : "loss"), money(Math.abs(np))], ["GP ratio", ns ? fmt(gp / ns * 100, 2) + "%" : "—"], ["NP ratio", ns ? fmt(np / ns * 100, 2) + "%" : "—"]]) + note("Balance Sheet effects: closing stock and prepaid rent are assets; outstanding salary is a liability; depreciation and the provision are deducted from the assets."); } };

  /* 3.2 manufacturing */
  var MF = [["mf_ro", "Raw materials: opening stock", "30000"], ["mf_rp", "Raw materials purchased", "200000"], ["mf_rc", "Raw materials: closing stock", "40000"], ["mf_dw", "Direct wages", "80000"], ["mf_de", "Direct expenses", "10000"], ["mf_fo", "Factory overheads (rent, power, plant depreciation)", "62000"], ["mf_wo", "Opening work-in-progress", "15000"], ["mf_wc", "Closing work-in-progress", "25000"], ["mf_sc", "Sale of scrap", "2000"], ["mf_fgo", "Finished goods: opening stock", "50000"], ["mf_fgc", "Finished goods: closing stock", "60000"], ["mf_sa", "Sales", "450000"]];
  TOOLS.mfg = { d: "Enter the factory figures. The tool finds materials consumed, prime cost, cost of production and gross profit.",
    b: function () { return '<div class="grid g3">' + MF.map(function (f) { return inp(f[0], f[2], f[1] + " (₹)"); }).join("") + "</div>"; },
    run: function () { var v = {}; for (var i = 0; i < MF.length; i++) { var x = n(MF[i][0]); if (!fin(x)) x = 0; if (x < 0) return err("Amounts must not be negative."); v[MF[i][0]] = x; }
      var rm = v.mf_ro + v.mf_rp - v.mf_rc, pc = rm + v.mf_dw + v.mf_de, cop = pc + v.mf_fo + v.mf_wo - v.mf_wc - v.mf_sc, cogs = v.mf_fgo + cop - v.mf_fgc, gp = v.mf_sa - cogs;
      return kv([["Raw materials consumed", money(rm)], ["Prime cost", money(pc)], ["Cost of production", money(cop)], ["Cost of goods sold", money(cogs)], ["Gross " + (gp >= 0 ? "profit" : "loss"), money(Math.abs(gp))]]) + steps(["Materials consumed = " + money(v.mf_ro) + " + " + money(v.mf_rp) + " − " + money(v.mf_rc) + " = " + money(rm), "Prime cost = materials + direct wages + direct expenses = " + money(pc), "Cost of production = prime cost + overheads + opening WIP − closing WIP − scrap = " + money(cop), "Cost of goods sold = opening FG + cost of production − closing FG = " + money(cogs)]); } };

  /* 3.3 subscriptions */
  TOOLS.subs = { d: "Find the subscription income for the Income and Expenditure Account. Enter the totals for each item.",
    b: function () { return g3(inp("sb_r", "240000", "Subscriptions received in cash this year (₹)"), inp("sb_os", "12000", "Outstanding at the start of the year (₹)"), inp("sb_oe", "10000", "Outstanding at the end of the year (₹)")) + g2(inp("sb_as", "6000", "Received in advance at the start, for this year (₹)"), inp("sb_ae", "8000", "Received this year in advance, for next year (₹)")) + g2(inp("sb_m", "", "Number of members (optional)", "", "numeric"), inp("sb_rt", "", "Annual subscription per member (₹, optional)")); },
    run: function () { var r = n("sb_r"), os = n("sb_os"), oe = n("sb_oe"), as = n("sb_as"), ae = n("sb_ae");
      if (![r, os, oe, as, ae].every(function (x) { return fin(x) && x >= 0; })) return err("Enter all five amounts (0 if none).");
      var inc = r + oe - os + as - ae, h = kv([["Subscription income (I&E Account)", money(inc)]]) + steps(["Cash received " + money(r), "+ outstanding at the end " + money(oe) + "; − outstanding at the start " + money(os), "+ advance from last year " + money(as) + "; − advance for next year " + money(ae), "= " + money(inc)]);
      var m = n("sb_m"), rt = n("sb_rt"); if (fin(m) && fin(rt) && m > 0 && rt > 0) h += kv([["Check: members × rate", money(m * rt)], ["Matches?", Math.abs(m * rt - inc) < 0.5 ? "Yes ✓" : "No: look for unrecorded or written-off amounts"]]);
      return h + note("Balance Sheet: outstanding at the end is an asset; advance for next year is a liability."); } };

  /* 3.4 incomplete records */
  TOOLS.incomplete = { d: "Part A finds profit by the statement of affairs method. Part B finds credit sales from a total debtors account.",
    b: function () { return sub("A. Statement of affairs") + g2(inp("ic_oa", "107000", "Opening assets (₹)"), inp("ic_ol", "22000", "Opening liabilities (₹)")) + g2(inp("ic_ca", "130000", "Closing assets (₹)"), inp("ic_cl", "25000", "Closing liabilities (₹)")) + g2(inp("ic_dr", "24000", "Drawings (₹)"), inp("ic_fc", "10000", "Fresh capital introduced (₹)")) +
      sub("B. Total debtors account") + g3(inp("ic_do", "30000", "Opening debtors (₹)"), inp("ic_dc", "120000", "Cash received from debtors (₹)"), inp("ic_dd", "2000", "Discount allowed (₹)")) + g3(inp("ic_db", "1000", "Bad debts (₹)"), inp("ic_dsr", "3000", "Sales returns (₹)"), inp("ic_de", "42000", "Closing debtors (₹)")); },
    run: function () { var oa = n("ic_oa"), ol = n("ic_ol"), ca = n("ic_ca"), cl = n("ic_cl"), dr = n("ic_dr"), fc = n("ic_fc"), h = "";
      if ([oa, ol, ca, cl, dr, fc].every(fin)) { var oc = oa - ol, cc = ca - cl, p = cc + dr - fc - oc; h += kv([["Opening capital", money(oc)], ["Closing capital", money(cc)], [p >= 0 ? "Profit" : "Loss", money(Math.abs(p))]]) + note("Profit = closing capital + drawings − fresh capital − opening capital."); }
      else h += err("Part A: enter all six amounts.");
      var v = ["ic_do", "ic_dc", "ic_dd", "ic_db", "ic_dsr", "ic_de"].map(n);
      if (v.every(fin)) { var cs = v[5] + v[1] + v[2] + v[3] + v[4] - v[0]; h += kv([["Credit sales", money(cs)]]) + note("Credit sales = closing debtors + cash received + discount + bad debts + returns − opening debtors."); }
      return h; } };

  /* 4.1 partnership appropriation */
  var PS0 = "Arun, 300000, 3, 0, 2000\nBina, 200000, 2, 36000, 1500";
  TOOLS.pshare = { d: "Enter the net profit, the interest on capital rate, and each partner as: Name, capital, profit-share ratio, salary, interest on drawings.",
    b: function () { return g2(inp("ps_np", "200000", "Net profit (₹)"), inp("ps_ioc", "8", "Interest on capital % a year")) + ta("ps_in", PS0, 4, "Partners"); },
    run: function () { var np = n("ps_np"), r = n("ps_ioc") / 100, ps = [], bad = [];
      if (!fin(np) || !fin(r) || r < 0) return err("Enter the net profit and a rate (0 if none).");
      lines("ps_in").forEach(function (ln) { var c = cells(ln), v = c.slice(1, 5).map(function (x) { return Number(String(x || "0").replace(/[₹,\s]/g, "")) || 0; }); if (!c[0] || c.length < 3 || v[1] <= 0) bad.push(ln); else ps.push({ nm: c[0], cap: v[0], sh: v[1], sal: v[2], iod: v[3] }); });
      if (bad.length || ps.length < 2) return err("Enter at least two partners as: Name, capital, ratio, salary, interest on drawings.");
      var tsh = ps.reduce(function (s, p) { return s + p.sh; }, 0), iod = ps.reduce(function (s, p) { return s + p.iod; }, 0), ioc = ps.reduce(function (s, p) { return s + p.cap * r; }, 0), sal = ps.reduce(function (s, p) { return s + p.sal; }, 0), div = np + iod - ioc - sal;
      var rows = ps.map(function (p) { var share = div * p.sh / tsh; return [esc(p.nm), money(p.cap * r), money(p.sal), money(share), money(p.cap * r + p.sal + share), money(p.iod)]; });
      return kv([["Net profit + interest on drawings", money(np + iod)], ["− Interest on capital", money(ioc)], ["− Salaries", money(sal)], ["Divisible " + (div >= 0 ? "profit" : "loss"), money(Math.abs(div))]]) + tbl(["Partner", "Interest on capital", "Salary", "Share of profit", "Total credited", "Interest on drawings (debited)"], rows) + (div < 0 ? note("Appropriations exceed the profit; the deed decides how a shortfall is treated (often interest on capital is allowed only out of profits).") : ""); } };

  /* 4.2 goodwill */
  TOOLS.goodwill = { d: "Enter past profits and the details to value goodwill by each method.",
    b: function () { return inp("gw_p", "80000, 100000, 90000, 130000", "Past profits, oldest first (₹)", "", "text") + g3(inp("gw_y", "3", "Years' purchase"), inp("gw_ce", "600000", "Capital employed (₹)"), inp("gw_nr", "12", "Normal rate of return %")) + inp("gw_w", "", "Weights for weighted average, oldest first (optional, e.g. 1,2,3,4)", "", "text"); },
    run: function () { var p = nums(val("gw_p")), y = n("gw_y"), ce = n("gw_ce"), nr = n("gw_nr") / 100;
      if (!p.length || !p.every(fin)) return err("Enter at least one year's profit."); if (!fin(y) || y < 0) return err("Enter years' purchase.");
      var avg = p.reduce(function (s, x) { return s + x; }, 0) / p.length, rows = [["Average profit", money(avg)], ["Average profit method", money(avg * y)]];
      var w = nums(val("gw_w")); if (w.length === p.length && w.every(function (x) { return fin(x) && x > 0; })) { var wa = p.reduce(function (s, x, i) { return s + x * w[i]; }, 0) / w.reduce(function (s, x) { return s + x; }, 0); rows.push(["Weighted average profit", money(wa)], ["Weighted average method", money(wa * y)]); }
      if (fin(ce) && fin(nr) && nr > 0) { var normal = ce * nr, sp = avg - normal; rows.push(["Normal profit", money(normal)], ["Super profit", money(sp)], ["Super profit method", money(Math.max(sp, 0) * y)], ["Capitalisation of super profit", money(Math.max(sp, 0) / nr)], ["Capitalisation of average profit", money(avg / nr - ce)]); }
      return kv(rows) + note("Adjust past profits for abnormal items before averaging. Negative super profit means no goodwill."); } };

  /* 4.3 admission */
  TOOLS.admit = { d: "Enter the old partners, their ratio and the new partner's share. Choose how the share is taken.",
    b: function () { return g3(inp("ad_nm", "Arun, Bina", "Old partners", "", "text"), inp("ad_r", "3:2", "Old ratio", "", "text"), inp("ad_new", "Chetan", "New partner", "", "text")) + g3(inp("ad_s", "1/5", "New partner's share", "", "text"), sel("ad_m", [["old", "From old partners in their old ratio"], ["eq", "Equally from old partners"], ["spec", "Specified sacrifices (enter below)"]], "old", "Taken"), inp("ad_sp", "", "Specified sacrifices, e.g. 1/10, 1/10", "", "text")) + inp("ad_gw", "300000", "Goodwill of the firm (₹, optional)"); },
    run: function () { var r = parseRatio(val("ad_r")), s = parseFr(val("ad_s")), m = val("ad_m"); if (!r) return err("Enter the old ratio like 3:2."); if (!s || fVal(s) <= 0 || fVal(s) >= 1) return err("Enter the new partner's share as a fraction like 1/5.");
      var nm = names(val("ad_nm"), r.length), nw = val("ad_new") || "New partner", old = ratioShares(r), sac;
      if (m === "old") sac = old.map(function (o) { return fMul(o, s); });
      else if (m === "eq") sac = old.map(function () { return fMul(s, Fr(1, r.length)); });
      else { sac = val("ad_sp").split(/\s*,\s*/).filter(Boolean).map(parseFr); if (sac.length !== r.length || sac.some(function (x) { return !x; })) return err("Enter one sacrifice per old partner, e.g. 1/10, 1/10."); var tot = sac.reduce(function (a, b) { return fAdd(a, b); }, Fr(0)); if (Math.abs(fVal(tot) - fVal(s)) > 1e-9) return err("The sacrifices add up to " + fStr(tot) + ", not " + fStr(s) + "."); }
      var nu = old.map(function (o, i) { return fSub(o, sac[i]); }); if (nu.some(function (x) { return fVal(x) < -1e-12; })) return err("A partner cannot sacrifice more than his share.");
      var h = tbl(["Partner", "Old share", "Sacrifice", "New share"], nm.map(function (p, i) { return [esc(p), fStr(old[i]), fStr(sac[i]), fStr(nu[i])]; }).concat([[esc(nw), "—", "—", fStr(s)]])) + kv([["New ratio", toRatio(nu.concat([s]))], ["Sacrificing ratio", toRatio(sac)]]);
      var gw = n("ad_gw"); if (fin(gw) && gw > 0) { var prem = fVal(s) * gw, ts = fVal(s); h += sub("Premium for goodwill") + kv([[esc(nw) + " brings", money(prem)]].concat(nm.map(function (p, i) { return [esc(p) + " is credited", money(prem * fVal(sac[i]) / ts)]; }))); }
      return h; } };

  /* 4.4 retirement */
  TOOLS.retire = { d: "Enter the partners, their old ratio and who retires. Give the new ratio of the continuing partners, or leave it blank to keep their old proportion.",
    b: function () { return g3(inp("rt_nm", "Arun, Bina, Chetan", "Partners", "", "text"), inp("rt_r", "5:3:2", "Old ratio", "", "text"), inp("rt_x", "Bina", "Retiring partner", "", "text")) + g2(inp("rt_nr", "3:2", "New ratio of continuing partners (optional)", "", "text"), inp("rt_gw", "120000", "Goodwill of the firm (₹, optional)")); },
    run: function () { var r = parseRatio(val("rt_r")); if (!r || r.length < 3) return err("Enter at least three partners' old ratio, like 5:3:2.");
      var nm = names(val("rt_nm"), r.length), xi = nm.map(function (x) { return x.toLowerCase(); }).indexOf(val("rt_x").trim().toLowerCase()); if (xi < 0) return err("The retiring partner must be one of the names given.");
      var old = ratioShares(r), cont = nm.filter(function (x, i) { return i !== xi; }), oc = old.filter(function (x, i) { return i !== xi; }), nr = val("rt_nr").trim() ? parseRatio(val("rt_nr")) : null, nu;
      if (val("rt_nr").trim() && (!nr || nr.length !== cont.length)) return err("Give one new-ratio figure for each continuing partner.");
      nu = nr ? ratioShares(nr) : ratioShares(oc.map(function (f) { return fVal(f); }));
      var gain = nu.map(function (x, i) { return fSub(x, oc[i]); });
      var h = tbl(["Partner", "Old share", "New share", "Gain"], cont.map(function (p, i) { return [esc(p), fStr(oc[i]), fStr(nu[i]), fStr(gain[i])]; })) + kv([["Retiring partner's share", fStr(old[xi])], ["New ratio", toRatio(nu)], ["Gaining ratio", gain.some(function (g) { return fVal(g) < 0; }) ? "A partner gains a negative share: check the ratios" : toRatio(gain)]]);
      var gw = n("rt_gw"); if (fin(gw) && gw > 0) { var due = fVal(old[xi]) * gw, tg = gain.reduce(function (s, g) { return s + fVal(g); }, 0); h += sub("Goodwill adjustment") + kv([[esc(nm[xi]) + "'s share of goodwill (credited)", money(due)]].concat(cont.map(function (p, i) { return [esc(p) + " debited", money(due * fVal(gain[i]) / tg)]; }))); }
      return h; } };

  /* 4.5 death */
  TOOLS.death = { d: "Find the deceased partner's share of profit to the date of death and the amount due to the executors.",
    b: function () { return g3(inp("de_p", "180000", "Last year's profit (₹)"), inp("de_s", "2400000", "Last year's sales (₹)"), inp("de_sh", "3/10", "Deceased partner's share", "", "text")) + g2(inp("de_m", "3", "Months from year start to death"), inp("de_sd", "500000", "Sales from year start to death (₹)")) + sub("Amount due (optional)") + g3(inp("de_c", "200000", "Capital balance (₹)"), inp("de_g", "36000", "Share of goodwill (₹)"), inp("de_i", "3000", "Interest on capital (₹)")) + g2(inp("de_d", "10000", "Drawings (₹)"), sel("de_b", [["t", "Time basis"], ["s", "Turnover basis"]], "t", "Use which basis for the amount due?")); },
    run: function () { var p = n("de_p"), s = n("de_s"), sh = parseFr(val("de_sh")), m = n("de_m"), sd = n("de_sd"); if (!fin(p) || !sh || !fin(m) || m < 0 || m > 12) return err("Enter last year's profit, the share (like 3/10) and months (0–12).");
      var tb = p * m / 12 * fVal(sh), rows = [["Time basis", money(tb)]], tu = NaN; if (fin(s) && s > 0 && fin(sd)) { tu = sd * p / s * fVal(sh); rows.push(["Profit rate on sales", fmt(p / s * 100, 4) + "%"], ["Turnover basis", money(tu)]); }
      var h = kv(rows), c = n("de_c"), g = n("de_g"), i = n("de_i"), d = n("de_d");
      if ([c, g, i, d].every(fin)) { var pr = val("de_b") === "s" && fin(tu) ? tu : tb; h += sub("Amount due to the executors") + kv([["Capital + goodwill + interest + profit − drawings", money(c + g + i + pr - d)]]); }
      return h; } };

  /* 4.6 realisation */
  TOOLS.realise = { d: "Enter assets as: name | book value | realised, and liabilities as: name | book value | paid. The tool prepares the Realisation Account result.",
    b: function () { return g2(ta("rl_a", "Debtors | 60000 | 55000\nStock | 50000 | 45000\nFurniture | 40000 | 30000", 4, "Assets"), ta("rl_l", "Creditors | 40000 | 38000", 4, "Outside liabilities")) + g3(inp("rl_e", "2000", "Realisation expenses (₹)"), inp("rl_nm", "Arun, Bina", "Partners", "", "text"), inp("rl_r", "3:2", "Profit-sharing ratio", "", "text")); },
    run: function () { function parse(id) { var out = [], bad = []; lines(id).forEach(function (ln) { var c = cells(ln), a = Number(String(c[1] || "").replace(/[₹,\s]/g, "")), b = Number(String(c[2] || "").replace(/[₹,\s]/g, "")); if (!c[0] || !(a >= 0) || !(b >= 0)) bad.push(ln); else out.push([c[0], a, b]); }); return { out: out, bad: bad }; }
      var A = parse("rl_a"), L = parse("rl_l"), e = n("rl_e") || 0, r = parseRatio(val("rl_r")); if (A.bad.length || L.bad.length) return err("Use: name | book value | amount."); if (!r) return err("Enter the ratio like 3:2.");
      var ab = A.out.reduce(function (s, x) { return s + x[1]; }, 0), ar = A.out.reduce(function (s, x) { return s + x[2]; }, 0), lb = L.out.reduce(function (s, x) { return s + x[1]; }, 0), lp = L.out.reduce(function (s, x) { return s + x[2]; }, 0), dr = ab + lp + e, cr = lb + ar, res = cr - dr, nm = names(val("rl_nm"), r.length), t = r.reduce(function (s, x) { return s + x; }, 0);
      return tbl(["Dr", "₹", "Cr", "₹"], [["Assets (book value)", money(ab), "Liabilities (book value)", money(lb)], ["Liabilities paid", money(lp), "Assets realised", money(ar)], ["Expenses", money(e), "", ""], [res > 0 ? "Profit on realisation" : "", res > 0 ? money(res) : "", res < 0 ? "Loss on realisation" : "", res < 0 ? money(-res) : ""], ["Total", money(Math.max(dr, cr)), "Total", money(Math.max(dr, cr))]]) +
        kv([[res >= 0 ? "Profit" : "Loss", money(Math.abs(res))]].concat(nm.map(function (p, i) { return [esc(p) + (res >= 0 ? " credited" : " debited"), money(Math.abs(res) * r[i] / t)]; }))); } };

  /* 4.7 share capital note */
  TOOLS.capital = { d: "Enter the share details to prepare the share capital note under Schedule III.",
    b: function () { return g3(inp("sc_a", "100000", "Authorised shares", "", "numeric"), inp("sc_f", "10", "Face value per share (₹)"), inp("sc_i", "60000", "Shares issued", "", "numeric")) + g3(inp("sc_s", "60000", "Shares subscribed", "", "numeric"), inp("sc_c", "8", "Called up per share (₹)"), inp("sc_ar", "4000", "Calls in arrears (₹)")); },
    run: function () { var a = n("sc_a"), f = n("sc_f"), i = n("sc_i"), s = n("sc_s"), c = n("sc_c"), ar = n("sc_ar") || 0;
      if (![a, f, i, s, c].every(fin) || f <= 0) return err("Enter all values."); if (!(a >= i && i >= s)) return err("Authorised ≥ issued ≥ subscribed must hold."); if (c > f || c < 0) return err("Called-up per share cannot exceed face value.");
      var called = s * c; if (ar > called) return err("Calls in arrears cannot exceed called-up capital.");
      return tbl(["Share capital", "₹"], [["Authorised: " + a.toLocaleString("en-IN") + " shares of ₹" + fmt(f) + " each", money(a * f)], ["Issued: " + i.toLocaleString("en-IN") + " shares of ₹" + fmt(f) + " each", money(i * f)], ["Subscribed: " + s.toLocaleString("en-IN") + " shares, ₹" + fmt(c) + " called up" + (c === f ? " (fully paid)" : " (not fully paid)"), money(called)], ["Less: calls in arrears", "(" + money(ar) + ")"], ["<b>Paid-up capital</b>", "<b>" + money(called - ar) + "</b>"]]) + kv([["Uncalled capital", money(s * (f - c))], ["Unissued shares", (a - i).toLocaleString("en-IN")]]); } };

  /* 4.8 forfeiture and re-issue */
  TOOLS.forfeit = { d: "Enter the facts of the forfeited shares to get the forfeiture entry, the maximum discount on re-issue and the transfer to capital reserve.",
    b: function () { return g3(inp("ff_n", "100", "Shares forfeited", "", "numeric"), inp("ff_cu", "10", "Called up per share at forfeiture (face value part, ₹)"), inp("ff_pr", "2", "Premium due per share (₹)")) + g3(sel("ff_pk", [["no", "Premium NOT received"], ["yes", "Premium received"]], "no", "Was the premium received?"), inp("ff_pd", "3", "Amount paid per share (₹, incl. any premium paid)"), inp("ff_m", "100", "Shares re-issued", "", "numeric")) + g2(inp("ff_rp", "8", "Re-issue price per share (₹)"), inp("ff_fv", "10", "Face value (re-issued as fully paid, ₹)")); },
    run: function () { var N = n("ff_n"), cu = n("ff_cu"), pr = n("ff_pr") || 0, pk = val("ff_pk") === "yes", pd = n("ff_pd"), m = n("ff_m"), rp = n("ff_rp"), fv = n("ff_fv");
      if (![N, cu, pd].every(fin) || N <= 0) return err("Enter the number of shares, the called-up amount and the amount paid.");
      var forf = pd - (pk ? pr : 0), unpaid = cu + pr - pd; if (forf < 0 || unpaid < 0) return err("Check the amounts: paid cannot exceed called-up plus premium, and must cover the premium if it was received.");
      var rows = [["Share Capital A/c Dr (" + N + " × ₹" + fmt(cu) + ")", money(N * cu), ""]]; if (!pk && pr) rows.push(["Securities Premium A/c Dr (" + N + " × ₹" + fmt(pr) + ")", money(N * pr), ""]);
      rows.push(["&nbsp;&nbsp;&nbsp;To Unpaid calls (allotment/calls)", "", money(N * unpaid)], ["&nbsp;&nbsp;&nbsp;To Share Forfeiture A/c", "", money(N * forf)]);
      var h = sub("Forfeiture entry") + tbl(["Journal entry", "Dr (₹)", "Cr (₹)"], rows) + kv([["Forfeited per share", money(forf)], ["Maximum discount on re-issue per share", money(forf)]]);
      if ([m, rp, fv].every(fin) && m > 0) { if (m > N) return h + err("Cannot re-issue more shares than were forfeited."); var disc = Math.max(fv - rp, 0); if (disc > forf + 1e-9) return h + err("Discount of " + money(disc) + " per share exceeds the forfeited " + money(forf) + ": not allowed.");
        var cr = m * (forf - disc); h += sub("Re-issue of " + m + " shares at " + money(rp)) + tbl(["Journal entry", "Dr (₹)", "Cr (₹)"], [["Bank A/c Dr", money(m * rp), ""], disc ? ["Share Forfeiture A/c Dr", money(m * disc), ""] : null, ["&nbsp;&nbsp;&nbsp;To Share Capital A/c", "", money(m * fv)], rp > fv ? ["&nbsp;&nbsp;&nbsp;To Securities Premium A/c", "", money(m * (rp - fv))] : null].filter(Boolean)) + kv([["Transfer to Capital Reserve", money(cr)], ["Left in Share Forfeiture (shares not re-issued)", money((N - m) * forf)]]); }
      return h; } };

  /* 4.9 debentures */
  TOOLS.deb = { d: "Enter the debenture terms to get the issue entry and the loss on issue to be written off.",
    b: function () { return g3(inp("db_n", "5000", "Number of debentures", "", "numeric"), inp("db_f", "100", "Face value (₹)"), inp("db_i", "95", "Issue price (₹)")) + g2(inp("db_r", "110", "Redemption price (₹)"), inp("db_y", "5", "Life (years)", "", "numeric")); },
    run: function () { var N = n("db_n"), f = n("db_f"), ip = n("db_i"), rp = n("db_r"), y = n("db_y"); if (![N, f, ip, rp].every(fin) || N <= 0 || f <= 0 || ip <= 0) return err("Enter all values.");
      if (rp < f) return err("Redemption below face value is unusual; enter a price at or above face value.");
      var disc = Math.max(f - ip, 0) * N, prem = Math.max(ip - f, 0) * N, rprem = (rp - f) * N, loss = disc + rprem;
      var rows = [["Bank A/c Dr", money(N * ip), ""]]; if (loss) rows.push(["Loss on Issue of Debentures A/c Dr", money(loss), ""]); rows.push(["&nbsp;&nbsp;&nbsp;To Debentures A/c", "", money(N * f)]); if (prem) rows.push(["&nbsp;&nbsp;&nbsp;To Securities Premium A/c", "", money(prem)]); if (rprem) rows.push(["&nbsp;&nbsp;&nbsp;To Premium on Redemption of Debentures A/c", "", money(rprem)]);
      return tbl(["Journal entry", "Dr (₹)", "Cr (₹)"], rows) + kv([["Discount on issue", money(disc)], ["Premium on redemption", money(rprem)], ["Loss on issue", money(loss)], ["Written off per year (equal)", fin(y) && y > 0 ? money(loss / y) : "—"]]); } };

  /* 4.10 bonus and rights */
  TOOLS.bonus = { d: "Part A: a bonus issue. Part B: the value of a right in a rights issue.",
    b: function () { return sub("A. Bonus issue") + g3(inp("bn_s", "50000", "Existing shares", "", "numeric"), inp("bn_f", "10", "Face value (₹)"), inp("bn_r", "1:5", "Bonus ratio (new : existing)", "", "text")) + sel("bn_src", [["fr", "Free reserves (general reserve, P&L surplus)"], ["sp", "Securities premium"], ["crr", "Capital redemption reserve"], ["rv", "Revaluation reserve"]], "fr", "Source") +
      sub("B. Rights issue") + g3(inp("rg_r", "1:4", "Rights ratio (new : existing)", "", "text"), inp("rg_p", "15", "Issue price (₹)"), inp("rg_m", "25", "Market price before the issue (₹)")); },
    run: function () { var h = "", s = n("bn_s"), f = n("bn_f"), br = parseRatio(val("bn_r"));
      if (val("bn_src") === "rv") h += err("Bonus shares cannot be issued out of a revaluation reserve (s.63).");
      else if (fin(s) && fin(f) && br && br.length === 2 && br[1] > 0) { var b = Math.floor(s * br[0] / br[1]); h += kv([["Bonus shares", b.toLocaleString("en-IN")], ["Amount capitalised", money(b * f)], ["Shares after bonus", (s + b).toLocaleString("en-IN")]]); }
      var rr = parseRatio(val("rg_r")), ip = n("rg_p"), mp = n("rg_m");
      if (rr && rr.length === 2 && rr[1] > 0 && fin(ip) && fin(mp)) { var nn = rr[0], ex = rr[1], xr = (ex * mp + nn * ip) / (ex + nn); h += kv([["Ex-rights price", money(xr)], ["Value of a right per existing share", money(mp - xr)], ["Value of each right share", money(xr - ip)]]); }
      return h || err("Enter the details."); } };

  /* 4.11 redemption of preference shares */
  TOOLS.redeem = { d: "Plan the redemption of preference shares: the CRR transfer, the minimum fresh issue and how to meet the premium.",
    b: function () { return g3(inp("rd_n", "1000000", "Nominal value to redeem (₹)"), inp("rd_p", "5", "Premium on redemption %"), inp("rd_fi", "400000", "Nominal value of fresh share issue (₹)")) + g3(inp("rd_fp", "0", "Premium on the fresh issue (₹)"), inp("rd_dp", "1500000", "Divisible profits available (₹)"), inp("rd_sp", "80000", "Existing securities premium (₹)")); },
    run: function () { var N = n("rd_n"), p = n("rd_p") / 100, fi = n("rd_fi") || 0, fp = n("rd_fp") || 0, dp = n("rd_dp") || 0, sp = n("rd_sp") || 0; if (!fin(N) || N <= 0 || !fin(p)) return err("Enter the nominal value and premium %.");
      var fromProfits = Math.max(N - fi, 0), prem = N * p, spAvail = sp + fp, premFromSP = Math.min(prem, spAvail), premFromP = prem - premFromSP, need = fromProfits + premFromP, ok = need <= dp + 1e-6;
      return kv([["Redeemed out of fresh issue", money(Math.min(fi, N))], ["Redeemed out of profits → CRR", money(fromProfits)], ["Premium on redemption", money(prem)], ["Premium met from securities premium", money(premFromSP)], ["Premium met from profits", money(premFromP)], ["Profits needed", money(need)], ["Enough profits?", ok ? "Yes ✓" : "No: short by " + money(need - dp)], ["Minimum fresh issue (nominal)", money(Math.max(N - Math.max(dp - premFromP, 0), 0))]]) + note("Only the nominal value of a fresh share issue counts towards redemption; its premium can meet the premium on redemption. Debenture proceeds cannot be used."); } };

  /* 4.12 DRR */
  TOOLS.drr = { d: "Work out the Debenture Redemption Reserve and the 15% investment. Check the current Rules for which companies are covered.",
    b: function () { return g3(inp("dr_o", "600000", "Debentures outstanding (₹)"), inp("dr_m", "600000", "Amount maturing in the next year (₹)"), sel("dr_t", [["ul", "Unlisted company (not NBFC/HFC)"], ["l", "Listed company"], ["nb", "NBFC / housing finance company"]], "ul", "Company type")) + g2(inp("dr_bp", "100000", "Own debentures bought in the open market: nominal (₹, optional)"), inp("dr_bc", "96000", "Price paid for them (₹, optional)")); },
    run: function () { var o = n("dr_o"), m = n("dr_m"), t = val("dr_t"); if (!fin(o) || o < 0 || !fin(m) || m < 0) return err("Enter the amounts.");
      var drr = t === "ul" ? 0.1 * o : 0, h = kv([["DRR required", t === "ul" ? money(drr) + " (10% of outstanding)" : "Generally not required for public issues (check the Rules)"], ["Invest or deposit by 30 April", money(0.15 * m) + " (15% of amount maturing)"]]);
      var bp = n("dr_bp"), bc = n("dr_bc"); if (fin(bp) && fin(bc) && bp > 0) h += kv([[bc <= bp ? "Profit on cancellation → Capital Reserve" : "Loss on cancellation", money(Math.abs(bp - bc))]]);
      return h + note("After the debentures are redeemed, transfer the DRR to General Reserve."); } };

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
