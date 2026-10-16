/* Product Management — course content and app (no external services; progress saved in localStorage) */
(function () {
  "use strict";

  function fmt(x) {
    if (typeof x !== "number" || !isFinite(x)) return String(x);
    var r = Math.round(x * 100) / 100;
    if (Object.is(r, -0)) r = 0;
    return String(r);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chips(a, cls) {
    return '<div class="chips">' + a.map(function (x, i) {
      var c = typeof cls === "function" ? cls(x, i) : (cls || "");
      return '<span class="chip ' + c + '">' + esc(x) + "</span>";
    }).join("") + "</div>";
  }
  function list(items) { return '<ul class="clean">' + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>"; }

  /* ================= LESSON CONTENT ================= */
  function inr(x) { return "₹" + Math.round(x).toLocaleString("en-IN"); }
  function crore(x) { var c = x / 1e7; return "₹" + (c >= 100 ? Math.round(c).toLocaleString("en-IN") : fmt(c)) + " crore"; }
  function num(x) { return Math.round(x).toLocaleString("en-IN"); }
  function box(text, kind) { return '<div class="pbox ' + (kind || "") + '">' + esc(text) + "</div>"; }
  function tbl(head, rows) { return '<div class="tscroll"><table><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }

  /* running examples */
  var MKT = { people: 600000, price: 10000, sam: 40, som: 5 }; /* online prep for MBA entrance aspirants (illustrative) */
  var FEAT = [ /* name, reach per quarter, impact, confidence %, effort person-months */
    ["Saved payment methods", 4000, 2, 80, 2], ["Dark mode", 6000, 0.5, 100, 1], ["Referral programme", 1500, 3, 50, 3], ["Support chatbot", 2500, 1, 80, 4]
  ];
  function rice(f) { return f[1] * f[2] * (f[3] / 100) / f[4]; }
  var COHORT = [1000, 550, 420, 380, 360, 350, 348]; /* active users of a January sign-up cohort, months 0 to 6 */
  var FUNNEL = [["Visited product page", 10000], ["Signed up", 2500], ["Added to cart", 1000], ["Purchased", 400]];
  var AB = { na: 10000, ca: 400, nb: 10000, cb: 460 };

  function normCdf(z) { /* Abramowitz–Stegun approximation */
    var t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2);
    var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }
  function abStats(na, ca, nb, cb) {
    var pa = ca / na, pb = cb / nb, p = (ca + cb) / (na + nb), se = Math.sqrt(p * (1 - p) * (1 / na + 1 / nb));
    var z = se > 0 ? (pb - pa) / se : 0, pv = 2 * (1 - normCdf(Math.abs(z)));
    return { pa: pa, pb: pb, lift: pa > 0 ? (pb - pa) / pa : NaN, z: z, p: pv };
  }
  var ABR = abStats(AB.na, AB.ca, AB.nb, AB.cb);
  function pct(x, d) { var m = Math.pow(10, d === undefined ? 1 : d); return String(Math.round(x * 100 * m) / m) + "%"; }

  var LESSONS = [
    {
      id: "1.1", mod: 1, title: "Product Thinking and the PM Role", time: "12 min", tool: "problem",
      outcomes: ["Explain what a product manager does and how the role differs from a project manager", "Describe the three overlapping areas a PM balances: users, business and technology", "Write a clear problem statement that does not jump to a solution", "Separate outputs (features shipped) from outcomes (change in user behaviour)"],
      notes: "<p>A <b>product manager (PM)</b> decides <b>what</b> a team should build and <b>why</b>, so that customers get real value and the business benefits. The PM does not usually manage people or write code. Instead, the PM brings together <b>users</b> (what problem do they have?), <b>business</b> (will this help us grow or earn?) and <b>technology</b> (can we build it well?).</p>" +
        "<p style=\"margin-top:10px\">A <b>project manager</b> makes sure agreed work is delivered on time and on budget. A product manager is responsible for whether the work was worth doing at all. In small companies one person may do both.</p>" +
        "<p style=\"margin-top:10px\"><b>Product thinking</b> starts with the problem, not the solution. Good PMs ask: Who exactly has this problem? How often? What do they do today instead? How will we know it is solved? They judge success by <b>outcomes</b> (more users completing a booking, fewer support calls) rather than <b>outputs</b> (the number of features shipped).</p>",
      formula: "Problem statement = who + struggles to + because + impact + how we will measure success<small>describe the problem; leave the solution open</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Product manager vs project manager</h4>" +
          tbl(["", "Product manager", "Project manager"], [
            ["Main question", "Are we building the right thing?", "Are we building the thing right, on time?"],
            ["Success measure", "Outcomes: adoption, retention, revenue", "Delivery: scope, schedule, budget"],
            ["Typical outputs", "Problem statements, roadmap, priorities, metrics", "Plans, timelines, risk logs, status reports"],
            ["Works most with", "Customers, design, engineering, business teams", "Delivery teams, vendors, stakeholders"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Titles vary between companies. In many Indian start-ups the PM also handles parts of project management, analytics and go-to-market.</p>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A food-delivery company sees many orders cancelled after payment.</p>" +
          '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag" style="background:var(--red);color:var(--red-fg)">Solution-first</span>' + box("We need to build an AI chatbot for the app.", "weak") + '</div><div><span class="tag mint">Problem-first</span>' + box("Office workers ordering lunch in Pune struggle to know when their food will arrive, because the app shows only a fixed 30-minute estimate. 18% of them cancel after paying, which costs us refunds and repeat orders. We will know we have solved it when cancellations fall below 8%.", "good") + "</div></div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">The second version names the user, the struggle, the cause, the business impact and a measurable goal. Better delivery-time estimates, live tracking or an SMS update could all be tested against it; a chatbot is only one possible idea.</p>";
      },
      use: ["Write the problem statement before discussing features, and share it with the team.", "Use outcomes such as conversion, retention or time saved as the measure of success.", "Mistake: describing a solution (“build an app”) and calling it a problem.", "Mistake: writing for “all users”. A specific user makes the problem testable."],
      walk: function () {
        return [
          { t: "The PM sits in the middle", c: "A PM balances what users need, what the business needs and what technology can do.", h: '<div class="chips"><span class="chip ac">Users</span><span class="chip hl">Business</span><span class="chip mi">Technology</span></div><div class="big">PM = the overlap</div>' },
          { t: "A request arrives", c: "Stakeholders often arrive with a solution already in mind.", h: box("“Can we add a chatbot to the app?”", "weak") },
          { t: "Ask about the problem", c: "Who has the problem, how often, and what do they do today?", h: chips(["Who?", "How often?", "What do they do today?", "Why does it matter?"], "ac") },
          { t: "Write the problem statement", c: "Name the user, the struggle, the cause and the impact, with a measurable goal.", h: box("Office workers ordering lunch struggle to know when food will arrive … 18% cancel after paying … goal: below 8%.", "good") },
          { t: "Judge by outcomes", c: "Success is a change in behaviour (fewer cancellations), not a feature shipped.", h: '<div class="chips"><span class="chip dim">Output: chatbot shipped</span><span class="chip mi">Outcome: cancellations 18% → 8%</span></div>' }
        ];
      },
      qc: [
        { q: "Which statement best describes a product manager's main responsibility?", o: ["Deciding what to build and why, so that it creates value for users and the business", "Writing the code for new features", "Managing the team's attendance and leave", "Making sure every project finishes on the original date"], a: 0, e: "A PM owns the “what” and “why”. Delivery on schedule is mainly a project-management concern." },
        { q: "Which of these is an outcome rather than an output?", o: ["Repeat orders rise from 30% to 38%", "Five new features shipped this quarter", "A new home-screen design released", "The team finished 40 user stories"], a: 0, e: "An outcome is a change in user or business behaviour. Features, designs and stories completed are outputs." }
      ]
    },
    {
      id: "1.2", mod: 1, title: "Customer Discovery and Jobs to Be Done", time: "12 min", tool: "jtbd",
      outcomes: ["Plan a short customer discovery interview", "Ask open questions about past behaviour instead of leading or hypothetical questions", "Write a job story in the “When…, I want to…, so I can…” format", "Turn interview notes into a persona and key insights"],
      notes: "<p><b>Customer discovery</b> is the work of learning about customers' problems before deciding what to build. The main tool is the <b>interview</b>: a 20–30 minute conversation with someone who has the problem.</p>" +
        "<p style=\"margin-top:10px\">Ask about <b>what people actually did</b>, not what they think they would do. “Tell me about the last time you booked a train ticket” gives real stories. “Would you use an app that…?” invites polite yeses. Avoid <b>leading questions</b> (“Don't you find it frustrating…?”) and talk less than the customer.</p>" +
        "<p style=\"margin-top:10px\"><b>Jobs to be done (JTBD)</b> says that customers “hire” a product to make progress in a situation. A <b>job story</b> captures this: <i>When [situation], I want to [motivation], so I can [expected outcome].</i> Jobs stay stable even when products change: people have always wanted to “reach the office on time”, whether by bus, metro or ride-hailing app.</p>" +
        "<p style=\"margin-top:10px\">After 5 to 8 interviews, look for patterns: repeated struggles, workarounds and emotions. Summarise them as <b>insights</b> and, if useful, a <b>persona</b>: a short profile of a typical user based on real evidence.</p>",
      formula: "When [situation], I want to [motivation], so I can [expected outcome]<small>a job story focuses on the situation and the progress, not on who the user is</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Better interview questions</h4>" +
          tbl(["Avoid", "Ask instead", "Why"], [
            ["Would you pay for an app that tracks expenses?", "Tell me about the last time you tracked a shared expense.", "Past behaviour is more reliable than predictions"],
            ["Don't you find splitting bills annoying?", "How do you split bills with flatmates today?", "Leading questions push the answer you want"],
            ["Do you like our idea?", "What was the hardest part of that? What did you try?", "Yes/no questions end the story"],
            ["What features do you want?", "What happened next? Why did that matter?", "Customers describe problems well, solutions less well"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Record exact quotes. One strong quote often persuades stakeholders more than a slide of opinions.</p>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Interviews with 6 MBA students who share a flat revealed the same story: they track shared groceries and rent in a WhatsApp group and argue at the end of the month.</p>" +
          '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag indigo">Job story</span>' + box("When the month ends and I have paid for shared groceries, I want to see who owes what without going through chat messages, so I can settle up quickly without awkward arguments.", "good") + '</div><div><span class="tag indigo">Insights</span>' + box("• All 6 use WhatsApp + mental maths today\n• 4 of 6 said settling up causes friction\n• Speed matters more than detailed reports\n• Quote: “I'd rather lose ₹200 than start the argument.”", "") + "</div></div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">The job is not “use an expense app”. It is “settle up fairly without conflict”. That opens solutions such as a monthly summary message, not only a full app.</p>";
      },
      use: ["Use interviews early, before design or development starts, and keep talking to customers afterwards.", "Use job stories to keep the team focused on the situation and the progress the customer wants.", "Mistake: asking “Would you use…?” and treating polite yeses as demand.", "Mistake: interviewing only friends or people who already love the idea."],
      walk: function () {
        return [
          { t: "Find people with the problem", c: "Recruit 5 to 8 people who have faced the situation recently.", h: chips(["Flatmate 1", "Flatmate 2", "Flatmate 3", "Flatmate 4", "Flatmate 5", "Flatmate 6"], "ac") },
          { t: "Ask about the past", c: "Ask for real stories, not opinions about your idea.", h: '<div class="grid g2" style="width:100%">' + box("Would you use an app for this?", "weak") + box("Tell me about the last time you split rent.", "good") + "</div>" },
          { t: "Listen for struggles", c: "Note workarounds, emotions and exact quotes.", h: chips(["WhatsApp group", "Mental maths", "End-of-month argument", "“I'd rather lose ₹200”"], function (x, i) { return i === 3 ? "hl" : ""; }) },
          { t: "Write the job story", c: "When…, I want to…, so I can…", h: box("When the month ends, I want to see who owes what, so I can settle up without arguments.", "good") },
          { t: "Share insights", c: "Patterns across interviews become insights that guide the product.", h: '<div class="big">4 of 6 · friction when settling up</div>' }
        ];
      },
      qc: [
        { q: "Which is the best customer interview question?", o: ["“Tell me about the last time you split a bill with friends.”", "“Would you use an app that splits bills?”", "“Don't you hate splitting bills?”", "“How much would you pay for our app?”"], a: 0, e: "It asks about real past behaviour. The others are hypothetical, leading or about the solution." },
        { q: "In a job story, what follows “so I can…”?", o: ["The outcome or progress the customer wants", "The name of the product feature", "The customer's age and job title", "The price the customer will pay"], a: 0, e: "When [situation], I want to [motivation], so I can [expected outcome]." }
      ]
    },
    {
      id: "1.3", mod: 1, title: "Market Sizing: TAM, SAM and SOM", time: "12 min", tool: "market",
      outcomes: ["Define TAM, SAM and SOM", "Estimate a market size from customers × price", "Compare top-down and bottom-up estimates", "State your assumptions so others can challenge them"],
      notes: "<p>Before investing in a product, a company wants to know: <b>how big could this be?</b> Market sizing gives an estimate in three layers.</p>" +
        "<p style=\"margin-top:10px\"><b>TAM (total addressable market)</b> is the total yearly revenue if every possible customer bought your type of product. <b>SAM (serviceable available market)</b> is the part your product can actually serve, given your channel, geography, language or price point. <b>SOM (serviceable obtainable market)</b> is the share of the SAM you can realistically win in the next few years, given competition and your sales capacity.</p>" +
        "<p style=\"margin-top:10px\">A <b>top-down</b> estimate starts from a big published number (e.g. all MBA aspirants) and narrows it with percentages. A <b>bottom-up</b> estimate starts from your own unit numbers (e.g. 40 coaching centres × 150 students each). Doing both and comparing them is a good sense check. The numbers are only as good as the assumptions, so always <b>write the assumptions down</b>.</p>",
      formula: "TAM = potential customers × price per year · SAM = TAM × % serviceable · SOM = SAM × % obtainable<small>1 crore = 100 lakh = 1,00,00,000</small>",
      extra: function () {
        var bu = 40 * 150 * MKT.price;
        return "<h4 style=\"margin:4px 0 8px\">Bottom-up sense check</h4><p class=\"muted small\">Suppose the start-up can partner with <b>40 coaching centres</b> in the first three years, each bringing about <b>150 students</b> at " + inr(MKT.price) + " per year.</p>" +
          '<div class="formula" style="font-size:18px;margin-top:10px">40 × 150 × ' + inr(MKT.price) + " = " + crore(bu) + " per year</div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">That is half of the top-down SOM of " + crore(MKT.people * MKT.price * MKT.sam / 100 * MKT.som / 100) + ". The gap tells the team to either find more channels or treat the top-down SOM as optimistic.</p>";
      },
      example: function () {
        var tam = MKT.people * MKT.price, sam = tam * MKT.sam / 100, som = sam * MKT.som / 100;
        return "<p class=\"muted\" style=\"margin-bottom:10px\">An online test-prep start-up for MBA entrance exams (illustrative figures).</p>" +
          tbl(["Layer", "Assumption", "Customers", "Revenue per year"], [
            ["<b>TAM</b>", num(MKT.people) + " aspirants a year × " + inr(MKT.price), num(MKT.people), crore(tam)],
            ["<b>SAM</b>", MKT.sam + "% prefer online, paid preparation", num(MKT.people * MKT.sam / 100), crore(sam)],
            ["<b>SOM</b>", MKT.som + "% of SAM is realistic in 3 years", num(MKT.people * MKT.sam / 100 * MKT.som / 100), crore(som)]]) +
          '<div class="formula" style="margin-top:12px">SOM = ' + crore(tam) + " × " + MKT.sam + "% × " + MKT.som + "% = " + crore(som) + "</div>";
      },
      use: ["Use market sizing to compare opportunities and to explain a business case to leaders or investors.", "Use the SOM, not the TAM, when planning targets.", "Mistake: “If we get just 1% of India…”. Show how you would win those customers.", "Mistake: hiding assumptions. A clear assumption can be checked and improved."],
      walk: function () {
        var tam = MKT.people * MKT.price, sam = tam * MKT.sam / 100, som = sam * MKT.som / 100;
        return [
          { t: "Start with the customers", c: "How many people could ever need this? Here: MBA entrance aspirants each year.", h: '<div class="big">' + num(MKT.people) + " aspirants</div>" },
          { t: "TAM", c: "Multiply by the price per customer per year.", h: '<div class="formula">' + num(MKT.people) + " × " + inr(MKT.price) + " = " + crore(tam) + "</div>" },
          { t: "SAM", c: "Keep only the part you can serve: those who prefer paid online preparation.", h: '<div class="formula">' + crore(tam) + " × " + MKT.sam + "% = " + crore(sam) + "</div>" },
          { t: "SOM", c: "Keep the share you can realistically win in three years.", h: '<div class="formula">' + crore(sam) + " × " + MKT.som + "% = " + crore(som) + "</div>" },
          { t: "Nested markets", c: "Each layer sits inside the one before. Plan with the SOM.", h: '<div class="chips"><span class="chip ac">TAM ' + crore(tam) + '</span><span class="chip hl">SAM ' + crore(sam) + '</span><span class="chip mi">SOM ' + crore(som) + "</span></div>" }
        ];
      },
      qc: [
        { q: "A market has 2,00,000 potential customers paying ₹5,000 a year. What is the TAM?", o: ["₹100 crore", "₹10 crore", "₹1,000 crore", "₹50 crore"], a: 0, e: "2,00,000 × ₹5,000 = ₹1,00,00,00,000 = ₹100 crore." },
        { q: "Which layer should a team use when setting realistic revenue targets?", o: ["SOM", "TAM", "SAM", "Any of them, they are the same"], a: 0, e: "The SOM is the share you can realistically win, so it is the basis for targets." }
      ]
    },
    {
      id: "2.1", mod: 2, title: "Prioritisation with RICE", time: "12 min", tool: "rice",
      outcomes: ["Explain why prioritisation is needed", "Calculate a RICE score", "Rank a backlog and explain the result", "Recognise the limits of any scoring model"],
      notes: "<p>Teams always have more ideas than time. <b>Prioritisation</b> means choosing what to do first, and just as importantly, what <b>not</b> to do now. Without a method, the loudest voice or the most senior person usually wins.</p>" +
        "<p style=\"margin-top:10px\"><b>RICE</b> is a simple scoring model. <b>Reach</b>: how many users the idea affects in a period (e.g. per quarter). <b>Impact</b>: how much it moves the goal for each user, on a scale of 3 (massive), 2 (high), 1 (medium), 0.5 (low), 0.25 (minimal). <b>Confidence</b>: how sure you are about the estimates: 100% (high), 80% (medium), 50% (low). <b>Effort</b>: the work needed, in person-months.</p>" +
        "<p style=\"margin-top:10px\">The score rewards ideas that reach many people with high impact and good evidence, at low effort. It is a <b>conversation tool</b>, not a machine that decides for you: strategic bets, legal requirements and dependencies may still change the order. Other common methods include <b>MoSCoW</b> (Must, Should, Could, Won't) and the <b>Kano model</b> (basic, performance and delight features).</p>",
      formula: "RICE score = (Reach × Impact × Confidence) ÷ Effort<small>Impact: 3, 2, 1, 0.5 or 0.25 · Confidence: 100%, 80% or 50% · Effort in person-months</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Other prioritisation methods</h4>" +
          tbl(["Method", "How it works", "Good for"], [
            ["<b>MoSCoW</b>", "Sort items into Must have, Should have, Could have, Won't have (this time)", "Agreeing the scope of a release"],
            ["<b>Kano model</b>", "Basic needs (expected), performance features (more is better), delighters (unexpected joy)", "Balancing hygiene work with differentiation"],
            ["<b>Value vs effort</b>", "Plot ideas on a 2 × 2 grid; do high-value, low-effort “quick wins” first", "A fast workshop with stakeholders"]]);
      },
      example: function () {
        var rows = FEAT.slice().sort(function (a, b) { return rice(b) - rice(a); });
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A shopping app's team scores four ideas for next quarter.</p>" +
          tbl(["Idea", "Reach", "Impact", "Confidence", "Effort", "RICE score"], rows.map(function (f, i) { return [(i === 0 ? "<b>" + f[0] + "</b>" : f[0]), num(f[1]), f[2], f[3] + "%", f[4], "<b>" + num(rice(f)) + "</b>"]; })) +
          '<div class="formula" style="margin-top:12px">Saved payment methods = (4,000 × 2 × 0.8) ÷ 2 = ' + num(rice(FEAT[0])) + "</div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">Dark mode reaches more people but has low impact. The referral programme has high impact but low confidence and high effort, so a small experiment to raise confidence may come first.</p>";
      },
      use: ["Use RICE to compare ideas aimed at the same goal, using the same time period for reach.", "Write down the evidence behind each estimate, and lower confidence when evidence is thin.", "Mistake: giving every idea impact 3 and confidence 100%. The scores stop meaning anything.", "Mistake: treating the score as final. Discuss the ranking and adjust for strategy and dependencies."],
      walk: function () {
        var f = FEAT[0];
        return [
          { t: "Too many ideas", c: "Four ideas, one team, one quarter. Which first?", h: chips(FEAT.map(function (x) { return x[0]; }), "ac") },
          { t: "Reach × Impact", c: "Saved payment methods: 4,000 users a quarter × impact 2.", h: '<div class="formula">4,000 × 2 = 8,000</div>' },
          { t: "× Confidence", c: "We are fairly sure (80%), so keep 80% of that.", h: '<div class="formula">8,000 × 0.8 = 6,400</div>' },
          { t: "÷ Effort", c: "It needs 2 person-months.", h: '<div class="formula">6,400 ÷ 2 = ' + num(rice(f)) + "</div>" },
          { t: "Rank and discuss", c: "Sort by score, then sense-check the order with the team.", h: chips(FEAT.slice().sort(function (a, b) { return rice(b) - rice(a); }).map(function (x) { return x[0] + " · " + num(rice(x)); }), function (x, i) { return i === 0 ? "hl" : ""; }) }
        ];
      },
      qc: [
        { q: "Reach 1,000, impact 2, confidence 50%, effort 2. What is the RICE score?", o: ["500", "1,000", "2,000", "250"], a: 0, e: "(1,000 × 2 × 0.5) ÷ 2 = 1,000 ÷ 2 = 500." },
        { q: "Two ideas have the same reach, impact and confidence. Idea X needs 1 person-month and idea Y needs 4. Which scores higher?", o: ["X, four times higher", "Y, four times higher", "They score the same", "It depends on the price"], a: 0, e: "Effort is the divisor, so the idea that needs a quarter of the effort scores four times higher." }
      ]
    },
    {
      id: "2.2", mod: 2, title: "MVP, Product–Market Fit and Retention", time: "13 min", tool: "retention",
      outcomes: ["Explain what a minimum viable product (MVP) is for", "Describe signs of product–market fit", "Read a cohort retention curve and spot flattening", "Calculate retention and churn rates"],
      notes: "<p>A <b>minimum viable product (MVP)</b> is the smallest version of a product that lets you <b>learn</b> whether customers value it. It is an experiment, not a cheap version 1. An MVP can be a landing page with a sign-up button, a WhatsApp-based service run by hand (a “concierge” MVP) or a simple app with one core feature.</p>" +
        "<p style=\"margin-top:10px\"><b>Product–market fit (PMF)</b> means a product satisfies a strong market need: customers keep using it, recommend it and would be upset to lose it. Two common signals: (1) <b>retention curves that flatten</b>: after the early drop, a stable group keeps using the product; (2) the <b>Sean Ellis test</b>: if at least 40% of active users say they would be “very disappointed” without the product, that is a positive sign.</p>" +
        "<p style=\"margin-top:10px\">A <b>cohort</b> is a group of users who started in the same period (e.g. everyone who signed up in January). <b>Retention</b> in month n = users still active in month n ÷ users who started. <b>Churn</b> is the share who stop. If a curve keeps falling towards zero, the product leaks users and more marketing will not fix it.</p>",
      formula: "Retention (month n) = active users in month n ÷ users in the cohort at start · Churn = 1 − retention<small>month-on-month churn = (active last month − active this month) ÷ active last month</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Kinds of MVP</h4>" +
          tbl(["MVP type", "Example", "What you learn"], [
            ["<b>Landing page</b>", "A page describing a flatmate expense tool with a “Join the waitlist” button", "Whether people care enough to sign up"],
            ["<b>Concierge</b>", "The team settles flat expenses by hand over WhatsApp for 20 flats", "What the job really involves; willingness to pay"],
            ["<b>Wizard of Oz</b>", "The app looks automated, but a person does the work behind it", "Whether users value the result before building the technology"],
            ["<b>Single-feature</b>", "An app that does only “who owes whom” and nothing else", "Whether the core value keeps people coming back"]]);
      },
      example: function () {
        var rows = COHORT.map(function (v, i) { return ["Month " + i, num(v), pct(v / COHORT[0]), i ? pct((COHORT[i - 1] - v) / COHORT[i - 1]) : "–"]; });
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A January cohort of " + num(COHORT[0]) + " users of a flatmate expense app.</p>" +
          tbl(["Month", "Active users", "Retention", "Month-on-month churn"], rows) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Retention drops sharply in month 1 (55%) but almost stops falling after month 4 (36% → 35% → 34.8%). The curve <b>flattens</b>: about a third of users stay. That is an encouraging sign of product–market fit for this group.</p>";
      },
      use: ["Use an MVP to test the riskiest assumption first, with the least effort.", "Use cohort retention, not total sign-ups, to judge whether the product is working.", "Mistake: building a full product for months before any customer uses it.", "Mistake: celebrating sign-ups while retention falls towards zero."],
      walk: function () {
        return [
          { t: "Build to learn", c: "An MVP tests the riskiest assumption with the least effort.", h: chips(["Landing page", "Concierge", "Wizard of Oz", "Single feature"], "ac") },
          { t: "Follow a cohort", c: "Track the " + num(COHORT[0]) + " users who joined in January.", h: chips(COHORT.map(num), function (x, i) { return i === 0 ? "hl" : ""; }) },
          { t: "Calculate retention", c: "Divide each month's active users by the starting " + num(COHORT[0]) + ".", h: chips(COHORT.map(function (v) { return pct(v / COHORT[0]); }), "ac") },
          { t: "Look for flattening", c: "After month 4 the curve barely falls: a loyal group has formed.", h: chips(COHORT.map(function (v) { return pct(v / COHORT[0]); }), function (x, i) { return i >= 4 ? "hl" : "dim"; }) + '<div class="big">≈ 35% stay</div>' },
          { t: "Ask the 40% question", c: "“How would you feel if you could no longer use this product?” 40% or more “very disappointed” is a good sign.", h: '<div class="big">Very disappointed ≥ 40%</div>' }
        ];
      },
      qc: [
        { q: "A cohort starts with 500 users and 150 are active in month 3. What is month-3 retention?", o: ["30%", "70%", "15%", "35%"], a: 0, e: "150 ÷ 500 = 0.30 = 30%. (70% is the share who have churned.)" },
        { q: "Which retention curve is the best sign of product–market fit?", o: ["One that drops early and then flattens", "One that keeps falling towards zero", "One with a high number of sign-ups in month 0", "One that drops to 5% in month 1"], a: 0, e: "A curve that flattens shows a group of users who keep getting value." }
      ]
    },
    {
      id: "2.3", mod: 2, title: "Funnel Metrics and A/B Testing", time: "14 min", tool: "abtest",
      outcomes: ["Calculate step and overall conversion rates in a funnel", "Find the biggest drop-off and decide where to focus", "Set up an A/B test with a clear hypothesis and metric", "Interpret lift and statistical significance"],
      notes: "<p>A <b>funnel</b> shows the steps users take towards a goal, such as visit → sign up → add to cart → purchase. At each step some users drop off. The <b>step conversion rate</b> = users at this step ÷ users at the previous step. The <b>overall conversion rate</b> = users at the last step ÷ users at the first step. The step with the biggest drop is often the best place to improve.</p>" +
        "<p style=\"margin-top:10px\">An <b>A/B test</b> checks whether a change really improves a metric. Users are split at random: group A sees the current version (control) and group B the new version (variant). Write a <b>hypothesis</b> first: “Showing delivery time on the product page will raise purchase conversion, because users worry about late delivery.” Choose one <b>primary metric</b> and decide the sample size before starting.</p>" +
        "<p style=\"margin-top:10px\"><b>Lift</b> = (rate B − rate A) ÷ rate A. Because results vary by chance, we check <b>statistical significance</b>: a two-proportion z-test gives a <b>p-value</b>. If p &lt; 0.05, a difference this large would be unlikely if the change had no real effect, so we treat the result as significant at the 95% level. Do not stop a test early just because it looks good on day two.</p>",
      formula: "Conversion = conversions ÷ visitors · Lift = (B − A) ÷ A · z = (p_B − p_A) ÷ √[p(1 − p)(1/n_A + 1/n_B)]<small>p = pooled conversion rate · significant at 95% when p-value &lt; 0.05 (|z| &gt; 1.96)</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">A/B testing checklist</h4>" +
          tbl(["Step", "What to do"], [
            ["1. Hypothesis", "We believe [change] will improve [metric] for [users] because [evidence]"],
            ["2. Metric", "One primary metric (e.g. purchase conversion) plus guardrails (e.g. refunds, page speed)"],
            ["3. Sample size", "Decide in advance how many users each group needs; small changes need large samples"],
            ["4. Run", "Split users at random; run for full weeks to cover weekday and weekend behaviour"],
            ["5. Decide", "Check significance and practical size of the lift; ship, iterate or drop"]]);
      },
      example: function () {
        var rows = FUNNEL.map(function (s, i) { return [s[0], num(s[1]), i ? pct(s[1] / FUNNEL[i - 1][1]) : "–", pct(s[1] / FUNNEL[0][1])]; });
        return "<p class=\"muted\" style=\"margin-bottom:10px\"><b>Funnel.</b> An online store's week of traffic.</p>" +
          tbl(["Step", "Users", "Step conversion", "From start"], rows) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Overall conversion is 400 ÷ 10,000 = 4%. The biggest drop is visit → sign-up (only 25% continue), so the team tests showing the delivery date before sign-up.</p>" +
          "<p class=\"muted\" style=\"margin:14px 0 10px\"><b>A/B test.</b> A: " + num(AB.na) + " visitors, " + num(AB.ca) + " purchases. B: " + num(AB.nb) + " visitors, " + num(AB.cb) + " purchases.</p>" +
          '<div class="kv"><span>A = ' + pct(ABR.pa) + "</span><span>B = " + pct(ABR.pb) + "</span><span>Lift = " + pct(ABR.lift, 0) + "</span><span>z = " + fmt(ABR.z) + "</span><span>p-value = " + fmt(ABR.p) + "</span></div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">p ≈ " + fmt(ABR.p) + " is below 0.05, so the 15% lift is statistically significant at the 95% level.</p>";
      },
      use: ["Use funnels to find where users drop off, then use interviews to learn why.", "Use A/B tests when you have enough traffic and a clear, single metric.", "Mistake: checking results every day and stopping as soon as p dips below 0.05.", "Mistake: testing many changes at once, so you cannot tell which one worked."],
      walk: function () {
        return [
          { t: "Map the funnel", c: "List each step users take towards the goal.", h: chips(FUNNEL.map(function (s) { return s[0] + " · " + num(s[1]); }), "ac") },
          { t: "Step conversion", c: "Divide each step by the step before it.", h: chips(FUNNEL.slice(1).map(function (s, i) { return pct(s[1] / FUNNEL[i][1]); }), function (x, i) { return i === 0 ? "hl" : ""; }) + '<div class="big">Biggest drop: visit → sign-up</div>' },
          { t: "Form a hypothesis", c: "Change one thing and predict its effect on one metric.", h: box("Showing the delivery date before sign-up will raise purchase conversion, because users worry about late delivery.", "good") },
          { t: "Split and measure", c: "Half the visitors see A, half see B.", h: '<div class="chips"><span class="chip">A: ' + pct(ABR.pa) + '</span><span class="chip mi">B: ' + pct(ABR.pb) + '</span></div><div class="big">Lift = ' + pct(ABR.lift, 0) + "</div>" },
          { t: "Check significance", c: "Is the difference bigger than chance? Here p ≈ " + fmt(ABR.p) + ", below 0.05.", h: '<div class="formula">z = ' + fmt(ABR.z) + " · p = " + fmt(ABR.p) + " → significant</div>" }
        ];
      },
      qc: [
        { q: "2,000 users visit and 500 sign up. Of those, 100 buy. What is the overall conversion rate?", o: ["5%", "20%", "25%", "10%"], a: 0, e: "100 ÷ 2,000 = 5%. (20% is the sign-up → buy step; 25% is the visit → sign-up step.)" },
        { q: "Version A converts at 5.0% and B at 6.0%. What is the relative lift of B?", o: ["20%", "1%", "6%", "16.7%"], a: 0, e: "(6.0 − 5.0) ÷ 5.0 = 0.20 = 20%. The absolute difference is 1 percentage point." }
      ]
    }
  ];

  var MODULES = [
    { n: 1, title: "Discovery and Strategy", sub: "Understand the PM role, learn from customers and size the opportunity.", tag: "Module 1" },
    { n: 2, title: "Delivery and Growth", sub: "Prioritise, test with an MVP and measure what works.", tag: "Module 2" }
  ];

  /* ================= FINAL TEST (20 questions) ================= */
  var TEST = [
    { m: 1, q: "Which question is mainly a product manager's concern rather than a project manager's?", o: ["Are we building the right thing for users and the business?", "Will the release finish by 30 June?", "Is the project within budget?", "Who is on leave next week?"], a: 0, e: "PMs own what to build and why; schedule, budget and resourcing are mainly project-management concerns." },
    { m: 1, q: "Which is the best problem statement?", o: ["Students preparing for placements struggle to find practice case interviews, because seniors are busy; 60% of them practise fewer than 3 cases.", "We need a mobile app for placement preparation.", "Students want AI.", "Build a case-interview chatbot by March."], a: 0, e: "It names the user, the struggle, the cause and evidence, without fixing the solution." },
    { m: 1, q: "Which is an outcome?", o: ["Weekly active users rise from 12,000 to 15,000", "A new onboarding screen is released", "Three sprints are completed", "A dashboard is built"], a: 0, e: "Outcomes are changes in user or business behaviour; the rest are outputs." },
    { m: 1, q: "Which interview question is most likely to give reliable information?", o: ["“Walk me through the last time you booked a bus ticket.”", "“Would you use an app that books bus tickets faster?”", "“Don't you think booking tickets is painful?”", "“Which features should our app have?”"], a: 0, e: "Questions about specific past behaviour give real stories rather than predictions or polite agreement." },
    { m: 1, q: "Which is written as a job story?", o: ["When I land late at night, I want to book a safe cab quickly, so I can get home without worry.", "As a user, I want a login button.", "Rahul, 24, lives in Mumbai and likes cricket.", "The app must load in 2 seconds."], a: 0, e: "A job story follows When [situation], I want to [motivation], so I can [outcome]. The others are a user story, a persona and a requirement." },
    { m: 1, q: "What is a persona?", o: ["A short profile of a typical user, based on research evidence", "A list of product features", "A competitor's brand", "A marketing slogan"], a: 0, e: "Personas summarise real research about a type of user." },
    { m: 1, q: "3,00,000 potential customers × ₹4,000 per year. What is the TAM?", o: ["₹120 crore", "₹12 crore", "₹1,200 crore", "₹30 crore"], a: 0, e: "3,00,000 × 4,000 = 1,20,00,00,000 = ₹120 crore." },
    { m: 1, q: "TAM is ₹500 crore, 30% is serviceable, and you can win 4% of that. What is the SOM?", o: ["₹6 crore", "₹150 crore", "₹20 crore", "₹15 crore"], a: 0, e: "SAM = 500 × 30% = ₹150 crore; SOM = 150 × 4% = ₹6 crore." },
    { m: 1, q: "What is a bottom-up market estimate?", o: ["Building the estimate from your own unit numbers, such as outlets × customers × price", "Starting from a national total and applying percentages", "Using only the competitor's revenue", "Guessing the final number and working backwards"], a: 0, e: "Bottom-up builds from units you can reach; top-down narrows a large published figure." },
    { m: 1, q: "A founder says, “If we get just 1% of India's population, we will be huge.” What is the main weakness?", o: ["It skips who can actually be served and how the customers will be won", "1% is too small to matter", "India's population is unknown", "It uses SOM instead of TAM"], a: 0, e: "A realistic plan narrows to SAM and SOM with stated assumptions about channels and competition." },
    { m: 2, q: "Reach 2,000, impact 1, confidence 80%, effort 4. What is the RICE score?", o: ["400", "1,600", "8,000", "500"], a: 0, e: "(2,000 × 1 × 0.8) ÷ 4 = 1,600 ÷ 4 = 400." },
    { m: 2, q: "Which RICE input should fall when the team has little evidence for its estimates?", o: ["Confidence", "Reach", "Effort", "Impact must be set to 3"], a: 0, e: "Confidence reflects how sure you are about reach and impact; thin evidence means lower confidence." },
    { m: 2, q: "In MoSCoW prioritisation, what does the W stand for?", o: ["Won't have (this time)", "Wish list", "Weekly", "Worth it"], a: 0, e: "Must, Should, Could, Won't have this time." },
    { m: 2, q: "In the Kano model, a hotel room's clean bed sheets are an example of a…", o: ["Basic need: expected, and causes anger if missing", "Delighter", "Performance feature", "Indifferent feature"], a: 0, e: "Basic needs are taken for granted; their absence causes dissatisfaction." },
    { m: 2, q: "What is the main purpose of an MVP?", o: ["To learn whether customers value the product with the least effort", "To launch a cheap, low-quality version 1", "To impress investors with many features", "To finish development faster"], a: 0, e: "An MVP is an experiment to test the riskiest assumption." },
    { m: 2, q: "A cohort of 800 users has 200 still active in month 6. What is month-6 retention?", o: ["25%", "75%", "20%", "40%"], a: 0, e: "200 ÷ 800 = 25%." },
    { m: 2, q: "Active users go from 400 in month 2 to 340 in month 3. What is the month-on-month churn?", o: ["15%", "60%", "85%", "17.6%"], a: 0, e: "(400 − 340) ÷ 400 = 60 ÷ 400 = 15%. (85% is the share retained.)" },
    { m: 2, q: "In the Sean Ellis test, what share of users saying “very disappointed” is often taken as a sign of product–market fit?", o: ["40% or more", "5% or more", "100%", "Fewer than 10%"], a: 0, e: "The common benchmark is at least 40% “very disappointed”." },
    { m: 2, q: "Visits 5,000 → add to cart 1,000 → purchase 250. What is the add-to-cart → purchase conversion?", o: ["25%", "5%", "20%", "50%"], a: 0, e: "250 ÷ 1,000 = 25%. Overall conversion is 250 ÷ 5,000 = 5%; visit → cart is 20%." },
    { m: 2, q: "An A/B test gives B a 12% lift with a p-value of 0.30. What should the team conclude?", o: ["The difference could easily be due to chance; it is not significant at the 95% level", "B is proven better and should ship immediately", "A is better", "The p-value shows a 30% lift"], a: 0, e: "p = 0.30 is well above 0.05, so the result is not statistically significant." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Product manager (PM)", "The person responsible for deciding what to build and why, to create value for users and the business.", "Deciding whether to fix checkout or add a wishlist this quarter.", "1.1"],
    ["Product thinking", "Starting from the user's problem and the desired outcome before choosing a solution.", "Asking why orders are cancelled before proposing a chatbot.", "1.1"],
    ["Problem statement", "A short description of who has a problem, why it happens, its impact and how success will be measured.", "“Office workers cancel 18% of lunch orders after paying…”", "1.1"],
    ["Outcome", "A change in user or business behaviour that the team aims for.", "Cancellations fall from 18% to 8%.", "1.1"],
    ["Output", "Something the team produces, such as a feature or design.", "A live-tracking screen shipped.", "1.1"],
    ["Stakeholder", "Anyone with an interest in or influence over the product.", "Sales head, finance, customer support.", "1.1"],
    ["Customer discovery", "Learning about customers' problems before deciding what to build.", "Interviewing 8 flatmates about shared expenses.", "1.2"],
    ["Leading question", "A question that suggests the answer you want.", "“Don't you hate splitting bills?”", "1.2"],
    ["Jobs to be done (JTBD)", "The idea that customers “hire” products to make progress in a situation.", "Hiring a ride app to reach the office on time.", "1.2"],
    ["Job story", "When [situation], I want to [motivation], so I can [outcome].", "When the month ends, I want to see who owes what…", "1.2"],
    ["Persona", "A short profile of a typical user based on research.", "Priya, a first-year MBA student sharing a flat.", "1.2"],
    ["Insight", "A pattern from research that explains behaviour and suggests an opportunity.", "Settling up causes more friction than tracking.", "1.2"],
    ["TAM", "Total addressable market: yearly revenue if every possible customer bought.", "6,00,000 aspirants × ₹10,000 = ₹600 crore.", "1.3"],
    ["SAM", "Serviceable available market: the part of the TAM your product can serve.", "Aspirants who prefer paid online prep.", "1.3"],
    ["SOM", "Serviceable obtainable market: the share of the SAM you can realistically win.", "5% of SAM in three years.", "1.3"],
    ["Top-down vs bottom-up", "Narrowing a big published number vs building up from your own unit numbers.", "National aspirants × % vs centres × students × price.", "1.3"],
    ["Backlog", "The ordered list of work the team may do.", "Bugs, features and experiments waiting to be picked up.", "2.1"],
    ["RICE", "Prioritisation score: Reach × Impact × Confidence ÷ Effort.", "(4,000 × 2 × 0.8) ÷ 2 = 3,200.", "2.1"],
    ["MoSCoW", "Must, Should, Could, Won't have (this time).", "Agreeing the scope of a release.", "2.1"],
    ["Kano model", "Classifies features as basic needs, performance features or delighters.", "Clean sheets (basic) vs a free upgrade (delighter).", "2.1"],
    ["Roadmap", "A plan of the problems and outcomes the team will work on over time.", "Now, Next, Later columns.", "2.1"],
    ["MVP", "Minimum viable product: the smallest thing that lets you learn whether customers value the idea.", "A landing page with a waitlist button.", "2.2"],
    ["Product–market fit (PMF)", "When a product satisfies a strong market need and users keep coming back.", "Retention flattens at about 35%.", "2.2"],
    ["Cohort", "A group of users who started in the same period.", "Everyone who signed up in January.", "2.2"],
    ["Retention", "The share of a cohort still active after a period.", "348 of 1,000 active in month 6 = 34.8%.", "2.2"],
    ["Churn", "The share of users who stop using the product in a period.", "400 → 340 users = 15% monthly churn.", "2.2"],
    ["Funnel", "The sequence of steps users take towards a goal.", "Visit → sign up → cart → purchase.", "2.3"],
    ["Conversion rate", "The share of users who complete a step or goal.", "400 purchases from 10,000 visits = 4%.", "2.3"],
    ["A/B test", "An experiment comparing a control (A) with a variant (B) on randomly split users.", "Showing delivery date to half the visitors.", "2.3"],
    ["Lift", "The relative change in a metric: (B − A) ÷ A.", "4.0% → 4.6% is a 15% lift.", "2.3"],
    ["Statistical significance", "Evidence that a difference is unlikely to be due to chance alone (usually p < 0.05).", "p = 0.04 → significant at 95%.", "2.3"],
    ["North star metric", "The single metric that best captures the value customers get from the product.", "Orders delivered on time per week.", "2.3"]
  ];

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= TRY-IT TOOLS (all run in the browser; nothing is sent anywhere) ================= */
  function ta(id, v, rows, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" rows="' + (rows || 4) + '">' + esc(v || "") + "</textarea></div>"; }
  function inp(id, v, label, ph, mode) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + esc(v === undefined ? "" : v) + '" placeholder="' + esc(ph || "") + '"' + (mode ? ' inputmode="' + mode + '"' : "") + "></div>"; }
  function copyRow(id) { return '<div class="row" style="margin-top:8px"><button class="btn btn-ink btn-sm" data-copy="' + id + '">Copy</button><span class="small muted" data-copied="' + id + '" aria-live="polite"></span></div>'; }
  function out(id, text) { return '<div class="pbox good" id="' + id + '">' + esc(text) + "</div>"; }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ""; }
  function n(id) { var s = val(id).replace(/[,\s₹%]/g, ""); return s === "" ? NaN : Number(s); }
  function err(t) { return '<p class="err">' + t + "</p>"; }
  function tick(ok, t) { return "<li>" + (ok ? "✅" : "⬜") + " " + t + "</li>"; }

  function toolBlock(l) {
    var h = '<div class="card calc"><p class="muted small" style="margin-bottom:12px">' + {
      problem: "Fill in the parts of a problem statement. It is assembled as you type, with a checklist that flags solution words and missing evidence.",
      jtbd: "Write a job story from your own idea, then paste your interview questions. The checker flags leading, hypothetical and yes/no questions.",
      market: "Enter your own assumptions. The calculator works out TAM, SAM and SOM and shows how the markets nest.",
      rice: "List ideas one per line as: name, reach, impact, confidence %, effort. The calculator scores and ranks them.",
      retention: "Enter the active users of one cohort for each period, starting with the cohort size. The tool calculates retention and churn and checks whether the curve flattens.",
      abtest: "Enter visitors and conversions for versions A and B. The tool calculates conversion, lift, the z-score and the p-value. Below it, you can analyse a funnel."
    }[l.tool] + "</p>";
    if (l.tool === "problem") h += '<div class="grid g2">' + inp("p_who", "First-year MBA students living in hostels", "Who has the problem?", "a specific group of users") + inp("p_need", "find reliable practice partners for case interviews", "What do they struggle to do?", "describe the struggle, not a feature") + inp("p_why", "seniors are busy during placement season", "Why does it happen?", "the cause") + inp("p_impact", "most practise fewer than 3 cases before interviews", "What is the impact? (add evidence)", "numbers, quotes, costs") + "</div>" + inp("p_metric", "students complete at least 8 practice cases before placements", "We will know it is solved when…", "a measurable result");
    if (l.tool === "jtbd") h += '<div class="grid g2">' + inp("j_sit", "I have a case interview in two days", "When… (situation)", "") + inp("j_mot", "practise with someone who can give honest feedback", "I want to… (motivation)", "") + "</div>" + inp("j_out", "walk into the interview confident", "So I can… (expected outcome)", "") +
      ta("j_qs", "Tell me about the last time you prepared for a case interview.\nWould you use an app that matches you with practice partners?\nDon't you find it hard to get feedback?\nDo you practise with friends?\nWhat was the hardest part of preparing?", 6, "Your interview questions (one per line)");
    if (l.tool === "market") h += '<div class="grid g2">' + inp("m_people", MKT.people, "Potential customers per year", "", "numeric") + inp("m_price", MKT.price, "Price per customer per year (₹)", "", "numeric") + inp("m_sam", MKT.sam, "Serviceable share (%)", "", "decimal") + inp("m_som", MKT.som, "Obtainable share of SAM (%)", "", "decimal") + "</div>";
    if (l.tool === "rice") h += ta("r_in", FEAT.map(function (f) { return f.join(", "); }).join("\n"), 6, "Ideas: name, reach, impact (3/2/1/0.5/0.25), confidence %, effort (person-months)") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Score and rank</button></div>';
    if (l.tool === "retention") h += inp("t_in", COHORT.join(", "), "Active users per period, starting with the cohort size", "e.g. 1000, 550, 420, 380", "decimal") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Analyse retention</button></div>';
    if (l.tool === "abtest") h += '<div class="grid g2">' + inp("a_na", AB.na, "A (control): visitors", "", "numeric") + inp("a_ca", AB.ca, "A: conversions", "", "numeric") + inp("a_nb", AB.nb, "B (variant): visitors", "", "numeric") + inp("a_cb", AB.cb, "B: conversions", "", "numeric") + "</div>" +
      ta("f_in", FUNNEL.map(function (s) { return s[0] + ", " + s[1]; }).join("\n"), 4, "Funnel (optional): one step per line as name, users");
    return h + '<div id="cout" class="res" aria-live="polite"></div></div>';
  }

  var SOLUTION_WORDS = /\b(app|apps|feature|features|button|chatbot|bot|ai|dashboard|platform|website|portal|build|launch|add|integrate|software)\b/i;
  function runProblem() {
    var who = val("p_who").trim(), need = val("p_need").trim(), why = val("p_why").trim(), imp = val("p_impact").trim(), met = val("p_metric").trim();
    if (!who || !need) return err("Fill in at least who has the problem and what they struggle to do.");
    var s = who + " struggle to " + need + (why ? ", because " + why : "") + "." + (imp ? " As a result, " + imp + "." : "") + (met ? " We will know we have solved it when " + met + "." : "");
    var vague = /^(all |every|everyone|users?$|people$|customers?$)/i.test(who) || who.split(/\s+/).length < 2;
    var sol = need.match(SOLUTION_WORDS) || why.match(SOLUTION_WORDS);
    var evid = /\d|“|"|%/.test(imp), measurable = /\d/.test(met);
    var score = [!vague, !sol, !!why, evid, measurable].filter(Boolean).length;
    return '<h4 style="margin:0 0 4px">Your problem statement</h4>' + out("pout", s) + copyRow("pout") +
      '<div class="kv"><span>Strength: ' + score + " of 5</span></div>" +
      '<ul class="clean" style="list-style:none;padding:0">' + tick(!vague, "A specific user group (not “everyone” or “users”)") + tick(!sol, "Describes a struggle, not a solution" + (sol ? ' (found “' + esc(sol[0]) + '”)' : "")) + tick(!!why, "States a cause") + tick(evid, "Gives evidence of impact (a number or a quote)") + tick(measurable, "Success can be measured (includes a number)") + "</ul>";
  }
  function classifyQ(q) {
    var t = q.trim().toLowerCase();
    if (/\b(don'?t you|wouldn'?t you|isn'?t it|aren'?t you|do you agree|would you agree|don’t you|wouldn’t you|isn’t it)\b/.test(t)) return ["Leading", "bad", "Remove the hint. Ask “How do you feel about…?” or “Tell me about…”."];
    if (/^(would|will) you\b|\bif (we|there was|you had)\b|\bhow much would you pay\b/.test(t)) return ["Hypothetical", "bad", "Ask about the past: “Tell me about the last time you…”."];
    if (/^(tell me about|walk me through|describe|how|what|why|when|where|which|who)\b/.test(t)) return ["Open", "ok", "Good: invites a story."];
    if (/^(do|does|did|is|are|was|were|can|could|have|has|should)\b/.test(t)) return ["Yes/no", "warn", "Turn it into an open question: start with “How…”, “What…” or “Tell me about…”."];
    return ["Check", "warn", "Make sure it asks about real past behaviour."];
  }
  function runJtbd() {
    var s = val("j_sit").trim(), m = val("j_mot").trim(), o = val("j_out").trim();
    var h = "";
    if (s && m && o) h += '<h4 style="margin:0 0 4px">Your job story</h4>' + out("jout", "When " + s + ", I want to " + m + ", so I can " + o + ".") + copyRow("jout") +
      ((m + " " + o).match(SOLUTION_WORDS) ? '<div class="note">Your job story mentions a solution (“' + esc((m + " " + o).match(SOLUTION_WORDS)[0]) + '”). Jobs describe progress, not products.</div>' : "");
    else h += err("Fill in all three parts to build a job story.");
    var qs = val("j_qs").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (qs.length) {
      var c = qs.map(classifyQ), good = c.filter(function (x) { return x[1] === "ok"; }).length;
      h += '<h4 style="margin:12px 0 4px">Interview question check</h4><div class="kv"><span>' + good + " of " + qs.length + " questions are open</span></div>" +
        tbl(["Question", "Type", "Suggestion"], qs.map(function (q, i) { var col = c[i][1] === "ok" ? "var(--mint-fg)" : (c[i][1] === "bad" ? "var(--red-fg)" : "var(--sun-fg)"); return [esc(q), '<b style="color:' + col + '">' + c[i][0] + "</b>", c[i][2]]; }));
    }
    return h;
  }
  function runMarket() {
    var p = n("m_people"), pr = n("m_price"), sa = n("m_sam"), so = n("m_som");
    if (![p, pr, sa, so].every(isFinite)) return err("Enter a number in every box.");
    if (p <= 0 || pr <= 0) return err("Customers and price must be greater than zero.");
    if (sa < 0 || sa > 100 || so < 0 || so > 100) return err("Percentages must be between 0 and 100.");
    var tam = p * pr, sam = tam * sa / 100, som = sam * so / 100;
    function bar(label, v, c, w) { return '<div style="margin:6px 0"><div class="small" style="font-weight:700">' + label + " · " + crore(v) + ' <span class="muted">(' + inr(v) + ')</span></div><div class="bar" style="height:16px"><i style="width:' + Math.max(w, 0.6) + "%;background:" + c + '"></i></div></div>'; }
    return '<div class="kv"><span>TAM = ' + crore(tam) + "</span><span>SAM = " + crore(sam) + "</span><span>SOM = " + crore(som) + "</span><span>SOM customers ≈ " + num(p * sa / 100 * so / 100) + "</span></div>" +
      bar("TAM", tam, "var(--accent)", 100) + bar("SAM", sam, "var(--sun-strong)", sa) + bar("SOM", som, "#22C55E", sa * so / 100) +
      '<div class="formula" style="font-size:17px">' + num(p) + " × " + inr(pr) + " × " + fmt(sa) + "% × " + fmt(so) + "% = " + crore(som) + "</div>";
  }
  function runRice() {
    var lines = val("r_in").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean), rows = [];
    if (!lines.length) return err("Enter at least one idea.");
    if (lines.length > 50) return err("Please enter 50 ideas or fewer.");
    for (var i = 0; i < lines.length; i++) {
      var p = lines[i].split(",").map(function (x) { return x.trim(); });
      if (p.length !== 5) return err("Line " + (i + 1) + " needs 5 parts: name, reach, impact, confidence %, effort.");
      var v = p.slice(1).map(function (x) { return Number(x.replace(/[%\s]/g, "")); });
      if (!v.every(isFinite)) return err("Line " + (i + 1) + ": reach, impact, confidence and effort must be numbers.");
      if (v[3] <= 0) return err("Line " + (i + 1) + ": effort must be greater than zero.");
      if (v[2] < 0 || v[2] > 100) return err("Line " + (i + 1) + ": confidence must be between 0 and 100%.");
      rows.push([p[0] || "Idea " + (i + 1), v[0], v[1], v[2], v[3]]);
    }
    var warn = rows.filter(function (r) { return [3, 2, 1, 0.5, 0.25].indexOf(r[2]) < 0; }).length;
    rows.sort(function (a, b) { return rice(b) - rice(a); });
    return tbl(["Rank", "Idea", "Reach", "Impact", "Confidence", "Effort", "RICE score"], rows.map(function (r, i) { return [i + 1, (i === 0 ? "<b>" + esc(r[0]) + "</b>" : esc(r[0])), num(r[1]), r[2], r[3] + "%", r[4], "<b>" + fmt(rice(r)) + "</b>"]; })) +
      '<div class="kv"><span>Top priority: ' + esc(rows[0][0]) + "</span></div>" + (warn ? '<div class="note">' + warn + " idea" + (warn > 1 ? "s use" : " uses") + " an impact outside the usual scale (3, 2, 1, 0.5, 0.25). That is allowed, but keep the scale consistent across ideas.</div>" : "");
  }
  function retChart(r) {
    var W = 560, H = 200, L = 40, B = 170, T = 14, w = (W - L - 16) / Math.max(1, r.length - 1);
    var pts = r.map(function (v, i) { return [L + i * w, B - v * (B - T)]; });
    var g = '<svg class="bp" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Retention curve">';
    [0, 0.5, 1].forEach(function (y) { var yy = B - y * (B - T); g += '<line x1="' + L + '" y1="' + yy + '" x2="' + (W - 10) + '" y2="' + yy + '" stroke="#E4E5F5"/><text x="' + (L - 6) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" fill="#6E6C94" font-family="Outfit,sans-serif">' + y * 100 + "%</text>"; });
    g += '<polyline fill="none" stroke="#4F46E5" stroke-width="3" points="' + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"/>';
    pts.forEach(function (p, i) { g += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="#F59E0B"/>'; if (r.length <= 13) g += '<text x="' + p[0].toFixed(1) + '" y="' + (B + 18) + '" text-anchor="middle" font-size="11" fill="#6E6C94" font-family="Outfit,sans-serif">' + i + "</text>"; });
    return g + "</svg>";
  }
  function runRetention() {
    var parts = val("t_in").split(/[\s,;]+/).filter(Boolean), a = [];
    for (var i = 0; i < parts.length; i++) { var v = Number(parts[i]); if (!isFinite(v) || v < 0) return err("“" + esc(parts[i]) + "” is not a valid number of users."); a.push(v); }
    if (a.length < 3) return err("Enter at least 3 periods (the cohort size and two later periods).");
    if (a.length > 37) return err("Please enter 37 periods or fewer.");
    if (a[0] <= 0) return err("The first number (cohort size) must be greater than zero.");
    var r = a.map(function (v) { return v / a[0]; });
    var drops = r.slice(1).map(function (v, i) { return (r[i] - v) * 100; });
    var last2 = drops.slice(-2), flat = r[r.length - 1] > 0.02 && last2.every(function (d) { return d < 2; });
    var rows = a.map(function (v, i) { return ["Period " + i, num(v), pct(r[i]), i ? (a[i - 1] > 0 ? pct((a[i - 1] - v) / a[i - 1]) : "–") : "–"]; });
    return '<div class="kv"><span>Final retention = ' + pct(r[r.length - 1]) + "</span><span>Biggest drop: period " + (drops.indexOf(Math.max.apply(null, drops)) + 1) + " (" + fmt(Math.max.apply(null, drops)) + " pts)</span><span>" + (flat ? "✅ Curve is flattening" : "⚠️ Still falling") + "</span></div>" +
      retChart(r) + tbl(["Period", "Active users", "Retention", "Period-on-period churn"], rows) +
      '<div class="note">' + (flat ? "Retention fell by less than 2 percentage points in each of the last two periods, so a stable group of users is forming. That is a positive product–market fit signal for this cohort." : "Retention is still falling noticeably in the latest periods. Look at why users leave (interviews, funnel data) before spending more on acquisition.") + " This is a rule of thumb, not a formal test.</div>";
  }
  function runAb() {
    var na = n("a_na"), ca = n("a_ca"), nb = n("a_nb"), cb = n("a_cb"), h = "";
    if (![na, ca, nb, cb].every(isFinite)) h += err("Enter a number in each A/B box.");
    else if (na <= 0 || nb <= 0 || ca < 0 || cb < 0) h += err("Visitors must be above zero and conversions cannot be negative.");
    else if (ca > na || cb > nb) h += err("Conversions cannot be more than visitors.");
    else {
      var r = abStats(na, ca, nb, cb), sig = r.p < 0.05;
      h += '<div class="kv"><span>A = ' + pct(r.pa, 2) + "</span><span>B = " + pct(r.pb, 2) + "</span><span>Lift = " + (isFinite(r.lift) ? pct(r.lift) : "n/a") + "</span><span>z = " + fmt(r.z) + "</span><span>p-value = " + (r.p < 0.001 ? "&lt; 0.001" : fmt(Math.round(r.p * 1000) / 1000)) + "</span></div>" +
        '<div class="note">' + (ca + cb === 0 ? "No conversions yet, so there is nothing to compare." : (sig ? "Significant at the 95% level: a difference this large would be unlikely if the change had no real effect. " + (r.pb > r.pa ? "B performs better." : "B performs worse than A.") : "Not significant at the 95% level: the difference could be due to chance. Keep the test running to the planned sample size, or treat the change as having no clear effect.")) + "</div>";
    }
    var lines = val("f_in").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (lines.length) {
      var st2 = [];
      for (var i = 0; i < lines.length; i++) { var m = lines[i].match(/^(.*?)[,\t]\s*([\d,]+)\s*$/); if (!m) { h += err("Funnel line " + (i + 1) + " should look like: step name, users"); return h; } st2.push([m[1].trim() || "Step " + (i + 1), Number(m[2].replace(/,/g, ""))]); }
      if (st2.length < 2) return h + err("Enter at least two funnel steps.");
      if (st2[0][1] <= 0) return h + err("The first funnel step must have more than zero users.");
      var worst = 1, wr = 2;
      st2.forEach(function (s, i) { if (i && st2[i - 1][1] > 0) { var c = s[1] / st2[i - 1][1]; if (c < wr) { wr = c; worst = i; } } });
      h += '<h4 style="margin:12px 0 4px">Funnel</h4>' + tbl(["Step", "Users", "Step conversion", "From start"], st2.map(function (s, i) { return [(i === worst ? "<b>" + esc(s[0]) + "</b>" : esc(s[0])), num(s[1]), i ? (st2[i - 1][1] > 0 ? pct(s[1] / st2[i - 1][1]) : "–") : "–", pct(s[1] / st2[0][1])]; })) +
        '<div class="kv"><span>Overall conversion = ' + pct(st2[st2.length - 1][1] / st2[0][1], 2) + "</span><span>Biggest drop: " + esc(st2[worst - 1][0]) + " → " + esc(st2[worst][0]) + "</span></div>";
    }
    return h;
  }

  function toolWire(l) {
    var cout = document.getElementById("cout");
    var R = { problem: runProblem, jtbd: runJtbd, market: runMarket, rice: runRice, retention: runRetention, abtest: runAb };
    function run() { cout.innerHTML = R[l.tool](); }
    var go = document.getElementById("tgo"); if (go) go.onclick = run;
    var card = cout.parentElement;
    card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; run(); });
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.tagName === "INPUT") run(); });
    cout.addEventListener("click", function (e) {
      var b = e.target.closest("[data-copy]"); if (!b) return;
      var id = b.getAttribute("data-copy"), el = document.getElementById(id), msg = cout.querySelector('[data-copied="' + id + '"]');
      var done = function (ok) { if (msg) msg.textContent = ok ? "Copied ✓" : "Select the text and press Ctrl+C (Cmd+C on Mac)"; };
      try { navigator.clipboard.writeText(el.textContent).then(function () { done(true); }, function () { selectEl(el); done(false); }); } catch (err2) { selectEl(el); done(false); }
    });
    run();
  }
  function selectEl(el) { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }


  /* ================= STATE ================= */
  var KEY = "pmc_progress_v1";
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
    var h = '<section class="hero"><div><span class="tag">Free course · about 75 minutes</span><h1 style="margin-top:14px">Product Management</h1>' +
      '<p class="lead">Learn how good products are discovered, prioritised, tested and grown.</p>' +
      '<p class="muted" style="margin-top:12px">For MBA/PGDM students, early-career professionals and anyone curious about product roles, with no prior experience needed. Work through six short lessons, each with a teaching video or animated walkthrough, clear notes, a worked example and an interactive tool you can try with your own ideas and numbers. Then pass the final test to earn your certificate.</p>' +
      '<div class="row" style="margin-top:18px">' + cta + '<a class="btn btn-soft" href="#/path">See the course path</a></div></div>' +
      '<div class="card" style="text-align:center">' + progressRing() + '<div class="stack small" style="margin-top:14px;text-align:left">' +
      "<div>📘 Lessons completed: <b>" + doneCount() + " of " + LESSONS.length + "</b></div>" +
      "<div>📝 Final test: <b>" + (st.test ? (st.test.passed ? "Passed (" + st.test.best + "%)" : "Best score " + st.test.best + "%") : (allDone() ? "Unlocked" : "Locked")) + "</b></div>" +
      "<div>🏅 Certificate: <b>" + (st.cert ? "Issued" : (passed() ? "Ready to claim" : "Pass the test to unlock")) + "</b></div></div></div></section>";
    h += '<div class="grid g2">' + MODULES.map(function (m) {
      var ls = LESSONS.filter(function (l) { return l.mod === m.n; }), d = ls.filter(function (l) { return st.done[l.id]; }).length;
      return '<div class="card mod"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + '</h3><p class="muted small">' + m.sub + '</p><div class="bar" style="margin-top:12px"><i style="width:' + (d / ls.length * 100) + '%"></i></div><p class="small muted" style="margin-top:6px">' + d + " of " + ls.length + " lessons completed</p>" + lessonList(m.n) + "</div>";
    }).join("") + "</div>";
    h += '<div class="card" style="margin-top:18px"><h3>How the course works</h3><div class="grid g3" style="margin-top:12px">' +
      ["<b>1. Learn, one lesson at a time</b><br><span class=\"muted small\">Watch the walkthrough, read the notes and try the interactive tool. Lessons unlock in order.</span>",
        "<b>2. Check yourself</b><br><span class=\"muted small\">Answer two quick questions in each lesson, then mark it complete.</span>",
        "<b>3. Test and certificate</b><br><span class=\"muted small\">Score 70% or more in the 20-question final test to download your certificate.</span>"].map(function (t) { return "<div>" + t + "</div>"; }).join("") + "</div></div>";
    return h;
  }
  function viewPath() {
    var h = '<h1 style="font-size:clamp(30px,4vw,42px)">Course path</h1><p class="muted" style="margin:8px 0 22px">Lessons unlock one by one. The final test unlocks after all six lessons.</p>';
    MODULES.forEach(function (m) {
      h += '<div class="card mod" style="margin-bottom:16px"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + "</h3>" + lessonList(m.n) +
        (LESSONS.filter(function (l) { return l.mod === m.n; }).every(function (l) { return st.done[l.id]; }) ? '<p style="margin-top:12px"><a href="#/recap/' + m.n + '">Module ' + m.n + " recap →</a></p>" : "") + "</div>";
    });
    h += '<div class="card"><h3>Final test and certificate</h3><p class="muted small" style="margin:6px 0 12px">20 questions · pass mark 70%</p>' +
      (allDone() ? '<a class="btn btn-accent" href="#/test">Take the final test</a>' : '<span class="tag grey">🔒 Complete all six lessons to unlock</span>') +
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
    var mod = MODULES[l.mod - 1], url = (window.PMC_VIDEOS && window.PMC_VIDEOS[id]) || "";
    var h = '<div class="crumb"><a href="#/">Course home</a> › ' + mod.tag + ": " + mod.title + "</div>" +
      '<div class="lhead"><div><span class="tag indigo">Lesson ' + id + " of 6 · " + l.time + "</span><h1 style=\"font-size:clamp(30px,4.4vw,46px);margin-top:10px\">" + l.title + "</h1></div>" +
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
      var nextHref = next ? (next.mod !== l.mod ? "#/recap/" + l.mod : "#/lesson/" + next.id) : "#/recap/2";
      var nextLabel = next ? (next.mod !== l.mod ? "Module " + l.mod + " recap →" : "Next: Lesson " + next.id + " →") : "Module 2 recap →";
      if (st.done[id]) { box.innerHTML = '<div class="row" style="justify-content:space-between"><div><b>✓ Lesson complete.</b> <span class="muted small">Great work.</span></div><a class="btn btn-accent" href="' + nextHref + '">' + nextLabel + "</a></div>"; return; }
      box.innerHTML = "<h3>Finish this lesson</h3><ul class=\"clean\" style=\"margin:8px 0 14px;list-style:none;padding:0\"><li>" + (w ? "✅" : "⬜") + " " + (url ? "Watch the video (or finish the self-paced steps)" : "Finish the animated walkthrough") + "</li><li>" + (q ? "✅" : "⬜") + " Answer both quick-check questions</li></ul>" +
        '<button class="btn btn-accent" id="mark"' + (w && q ? "" : " disabled") + ">Mark lesson complete</button>";
      var mk = document.getElementById("mark");
      if (mk) mk.onclick = function () { st.done[id] = true; save(); updateDone(); };
    }
    updateDone();
  }
  function viewRecap(m) {
    var ls = LESSONS.filter(function (l) { return l.mod === m; });
    if (!ls.every(function (l) { return st.done[l.id]; })) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>Finish Module ' + m + ' first</h2><p style="margin-top:14px"><a class="btn btn-accent" href="#/path">Go to the course path</a></p></div>';
    var t1 = '<table><tr><th>Lesson</th><th>Key idea</th><th>Tool or formula</th></tr>' +
      "<tr><td><b>Product thinking and the PM role</b></td><td>Start from the problem; judge success by outcomes, not outputs</td><td>Who + struggles to + because + impact + success measure</td></tr>" +
      "<tr><td><b>Customer discovery and JTBD</b></td><td>Ask about past behaviour; customers hire products to make progress</td><td>When…, I want to…, so I can…</td></tr>" +
      "<tr><td><b>Market sizing</b></td><td>TAM ⊃ SAM ⊃ SOM; plan with the SOM and state assumptions</td><td>Customers × price × % serviceable × % obtainable</td></tr></table>";
    var t2 = '<table><tr><th>Lesson</th><th>Key idea</th><th>Tool or formula</th></tr>' +
      "<tr><td><b>Prioritisation with RICE</b></td><td>Score ideas consistently, then discuss the ranking</td><td>(Reach × Impact × Confidence) ÷ Effort</td></tr>" +
      "<tr><td><b>MVP, PMF and retention</b></td><td>Build to learn; a flattening retention curve signals fit</td><td>Retention = active in period n ÷ cohort size</td></tr>" +
      "<tr><td><b>Funnels and A/B testing</b></td><td>Fix the biggest drop-off; test one change against one metric</td><td>Lift = (B − A) ÷ A · significant when p &lt; 0.05</td></tr></table>";
    var h = '<span class="tag indigo">Module ' + m + ' recap</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + MODULES[m - 1].title + '</h1><p class="muted" style="margin:8px 0 18px">The main ideas from each lesson, on one page.</p>' +
      '<div class="card tscroll">' + (m === 1 ? t1 : t2) + "</div>" +
      '<div class="card" style="margin-top:16px"><h3>Key takeaway</h3><p class="muted" style="margin-top:6px">' + (m === 1 ? "Fall in love with the problem, not the solution. Talk to customers about what they actually do, and check that the opportunity is big enough before you build." : "Choose work with evidence, release the smallest thing that teaches you something, and let retention, funnels and experiments tell you what is working.") + "</p></div>" +
      '<p style="margin-top:20px">' + (m === 1 ? '<a class="btn btn-accent" href="#/lesson/2.1">Start Module 2: Delivery and Growth →</a>' : '<a class="btn btn-sun" href="#/test">Take the final test →</a>') + "</p>";
    return h;
  }
  /* ---- final test ---- */
  var T = null; /* active attempt */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newAttempt() {
    var order = shuffle(TEST.map(function (q, i) { return i; }));
    T = { qs: order.map(function (qi) { var q = TEST[qi]; var perm = shuffle([0, 1, 2, 3]); return { m: q.m, q: q.q, e: q.e, o: perm.map(function (p) { return q.o[p]; }), a: perm.indexOf(q.a) }; }), ans: {}, cur: 0, done: false };
  }
  function viewTest() {
    if (!allDone()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>The final test is locked</h2><p class="muted" style="margin:10px 0 18px">Complete all six lessons first (' + doneCount() + ' of 6 done).</p><a class="btn btn-accent" href="#/path">Go to the course path</a></div>';
    if (!T) {
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">Product Management: final test</h1>' +
        '<ul class="clean" style="margin:14px 0 18px"><li>20 multiple-choice questions (10 per module), in random order</li><li>Answers are revealed only after you submit</li><li>Pass mark: 70% (14 of 20)</li><li>You can review your answers and retake the test</li></ul>' +
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
    var c = 0, mc = { 1: 0, 2: 0 }, mt = { 1: 0, 2: 0 };
    T.qs.forEach(function (q, i) { mt[q.m]++; if (T.ans[i] === q.a) { c++; mc[q.m]++; } });
    var pct = Math.round(c / T.qs.length * 100), ok = c / T.qs.length >= PASS;
    var h = '<div style="max-width:820px;margin:0 auto"><div class="card" style="text-align:center"><div style="font-size:48px">' + (ok ? "🎉" : "📘") + "</div><h1 style=\"font-size:clamp(30px,4vw,42px)\">" + (ok ? "You passed!" : "Not quite yet") + "</h1>" +
      '<p style="font-size:22px;font-weight:800;margin-top:8px">' + c + " / " + T.qs.length + " · " + pct + "%</p>" +
      '<div class="kv" style="justify-content:center;margin-top:10px"><span>Module 1: ' + mc[1] + " / " + mt[1] + "</span><span>Module 2: " + mc[2] + " / " + mt[2] + "</span></div>" +
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
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "PMC-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all six lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">Product Management</h3>' +
      '<p class="muted small" style="margin-top:6px">Discovery and Strategy · Delivery and Growth</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
      '<div class="row" style="justify-content:space-between;margin-top:26px;text-align:left"><div class="small"><b>Date:</b> ' + esc(c.date) + "<br><b>Certificate ID:</b> " + esc(c.id) + '</div><div class="small" style="text-align:right;width:220px;max-width:100%">' + SIG_SVG + '<div style="border-top:1px solid #C9CCF7;padding-top:4px;margin-top:2px"><b>Founder</b><br>Intellique Research School</div></div></div></div>' +
      '<div class="row noprint" style="justify-content:center;margin-top:18px"><button class="btn btn-accent" id="cpdf">Download certificate (PDF)</button><button class="btn btn-soft" id="cprint">Print</button></div>' +
      '<p class="small muted noprint" style="text-align:center;margin-top:10px">This is a certificate of completion issued by AIStudyTools, a subsidiary of Intellique Research School Private Limited. It is not an accredited qualification.</p>';
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
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text("Product Management", W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text("Discovery and Strategy  |  Delivery and Growth", W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited. Not an accredited qualification.", W / 2, H - 15, { align: "center" });
    sigPng(function (png) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 12.4);
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save("Product-Management-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option><option value="1">Module 1: Discovery and strategy</option><option value="2">Module 2: Delivery and growth</option></select></div><div class="grid g2" id="gl"></div>';
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
    else if (r === "recap") out = viewRecap(+parts[1] === 2 ? 2 : 1);
    else if (r === "test") { out = viewTest(); after = testWire; }
    else if (r === "certificate") { out = viewCert(); after = certWire; }
    else if (r === "glossary") { out = viewGlossary(); after = glossWire; }
    else out = viewNotFound();
    if (out && typeof out === "object") { after = out.after; out = out.html; }
    app.innerHTML = out;
    if (r === "path") { var rs = document.getElementById("reset"); if (rs) rs.onclick = function () { if (confirm("Reset all your progress, test results and certificate in this browser?")) { localStorage.removeItem(KEY); load(); T = null; render(); } }; }
    if (after) after();
    document.querySelectorAll(".tnav a[data-r]").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-r") === r || (r === "lesson" && a.getAttribute("data-r") === "path")); });
    var titles = { home: "Product Management", path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || "Product Management") + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();

