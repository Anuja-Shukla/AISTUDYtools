/* SEO to GEO — course content and app (no external services; progress saved in localStorage) */
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
  function box(text, kind) { return '<div class="pbox ' + (kind || "") + '">' + esc(text) + "</div>"; }
  function tbl(head, rows) { return '<div class="tscroll"><table><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }
  function pct(x, d) { var m = Math.pow(10, d === undefined ? 0 : d); return String(Math.round(x * 100 * m) / m) + "%"; }
  function hbars(items, color) {
    var mx = Math.max.apply(null, items.map(function (i) { return i[1]; })) || 1;
    return '<div style="display:grid;gap:6px">' + items.map(function (i) { return '<div><div class="small" style="display:flex;justify-content:space-between;gap:8px"><b>' + esc(i[0]) + "</b><span>" + (i[2] !== undefined ? i[2] : fmt(i[1])) + '</span></div><div class="bar" style="height:12px"><i style="width:' + Math.max(1, i[1] / mx * 100) + "%;background:" + (i[3] || color || "var(--accent)") + '"></i></div></div>'; }).join("") + "</div>";
  }
  function words(t) { return (t.match(/[A-Za-z0-9₹%'’-]+/g) || []); }
  function sentences(t) { return t.replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z0-9“"‘(])/).map(function (s) { return s.trim(); }).filter(function (s) { return words(s).length > 0; }); }
  var STOP = "a an the and or but of to in on for with at by from as is are was were be been being it its this that these those you your we our they their i he she his her not no do does did can will would should could may might has have had than then so such into over about which who whom what when where why how all any each more most other some very just also if there here up out per vs".split(" ");

  /* running example: a fictional rooftop-solar installer in Pune (figures are illustrative) */
  var BRAND = "SunNest Solar";
  var TITLE0 = "Rooftop Solar Cost in Pune (2026): Price, Savings, Payback";
  var META0 = "How much does a rooftop solar system cost in Pune? See typical prices per kW, monthly savings, payback period and what affects the final quote.";
  var QUERY0 = "rooftop solar for homes in Pune";
  var HEADS0 = "How much does rooftop solar cost in Pune?\nHow many kW do I need for my home?\nHow long is the payback period?\nOn-grid vs off-grid vs hybrid systems\nHow to choose an installer";
  var WEAK = "Solar is the future and everyone should go solar. At SunNest Solar we offer the best rooftop solar Pune has to offer, rooftop solar Pune homes love, and affordable rooftop solar Pune prices. Our rooftop solar Pune team is the best. Call us today for rooftop solar in Pune!";
  var STRONG = "A rooftop solar system for a typical Pune home costs about ₹55,000 to ₹70,000 per kW before any subsidy, and most homes need 3 to 5 kW. According to our analysis of 420 installations in 2025, a 3 kW system produced an average of 360 units a month and cut electricity bills by 70–85%. The payback period was usually 4 to 6 years. “Shading and roof direction matter more than panel brand,” says Meera Kulkarni, our lead engineer. Source: SunNest Solar installation data, 2025 (illustrative).";
  var ARTICLE0 = "## What does rooftop solar cost in Pune?\nA typical home system costs about ₹55,000 to ₹70,000 per kW before subsidy. Most homes need 3 to 5 kW, so the total is usually ₹1.6 to ₹3.5 lakh.\n\n## Benefits\nIt is great for the environment and it also saves money. This makes it popular with many families across the city.\n\n## How long does installation take?\nInstallation of a 3 kW system takes 1 to 2 days on site. Net-meter approval from the electricity distributor can take 2 to 6 weeks.";
  var FAQ0 = "Q: How much does rooftop solar cost in Pune?\nA: About ₹55,000 to ₹70,000 per kW before subsidy; most homes need 3 to 5 kW.\nQ: How long does installation take?\nA: One to two days on site, plus 2 to 6 weeks for net-meter approval.";
  var BOTS = [
    ["Googlebot", "Google Search indexing; AI Overviews and AI Mode use this index", "search"],
    ["Google-Extended", "Control token for Gemini training and grounding in other Google systems (not Search)", "train"],
    ["OAI-SearchBot", "Indexes pages that ChatGPT search can show and cite", "search"],
    ["ChatGPT-User", "Fetches a page when a ChatGPT user asks it to", "user"],
    ["GPTBot", "Collects data to train OpenAI models", "train"],
    ["Claude-SearchBot", "Indexes pages to improve Claude's search answers", "search"],
    ["Claude-User", "Fetches a page when a Claude user asks it to", "user"],
    ["ClaudeBot", "Collects data to train Anthropic models", "train"],
    ["PerplexityBot", "Indexes pages for Perplexity answers and citations", "search"],
    ["Perplexity-User", "Fetches a page when a Perplexity user asks it to", "user"],
    ["Applebot-Extended", "Control token for Apple Intelligence training", "train"],
    ["CCBot", "Common Crawl's public dataset, widely used for training", "train"]
  ];
  var VIS0 = "ChatGPT, Y, Y\nChatGPT, Y, N\nChatGPT, N, N\nChatGPT, Y, Y\nPerplexity, Y, Y\nPerplexity, Y, Y\nPerplexity, N, N\nPerplexity, Y, Y\nGoogle AI Mode, Y, N\nGoogle AI Mode, N, N\nGoogle AI Mode, N, N\nGoogle AI Mode, Y, Y";
  var SOV0 = "SunNest Solar, 7\nRayGrid Energy, 11\nPune Sun Power, 5\nOthers, 9";

  /* ---- GEO readiness scoring ---- */
  function geoScore(t) {
    var ss = sentences(t), ws = words(t), n = ws.length;
    var first = ss[0] || "", fw = words(first).length;
    var answer = fw > 0 && fw <= 30 && /\b(is|are|was|means|refers to|costs?|takes?|helps?|lets?|equals?)\b/i.test(first);
    var stats = (t.match(/(₹\s?[\d,.]+|\d[\d,.]*\s?(%|per ?cent|percent|kw|kwh|lakh|crore|million|billion|units|years?|months?|days?|hours?|minutes?|x\b)|\b(19|20)\d\d\b)/gi) || []).length;
    var cites = (t.match(/according to|source:|sources:|study|survey|report|research|data from|analysis of|published|https?:\/\/|\((19|20)\d\d\)/gi) || []).length;
    var quotes = (t.match(/[“"][^”"]{15,}[”"]/g) || []).length;
    var avg = ss.length ? n / ss.length : 0;
    var freq = {}; ws.forEach(function (w) { var k = w.toLowerCase(); if (k.length > 2 && STOP.indexOf(k) < 0 && !/^\d/.test(k)) freq[k] = (freq[k] || 0) + 1; });
    var top = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; })[0] || "", dens = n ? (freq[top] || 0) / n : 0;
    var stuffed = n >= 30 && dens > 0.05 && freq[top] >= 4;
    var hype = (t.match(/\b(best|no\.? ?1|number one|world-class|leading|amazing|unbeatable|revolutionary|cheapest)\b/gi) || []).length;
    var parts = [
      ["Answer first", answer ? 20 : 0, 20, answer ? "The first sentence answers directly." : "Start with a one-sentence direct answer (under 30 words) that defines or states the key fact."],
      ["Statistics", stats >= 3 ? 20 : stats >= 1 ? 10 : 0, 20, stats >= 3 ? stats + " specific numbers found." : "Add specific figures: prices, percentages, dates, quantities (found " + stats + ")."],
      ["Sources cited", cites >= 2 ? 20 : cites === 1 ? 12 : 0, 20, cites ? cites + " source signal" + (cites > 1 ? "s" : "") + " found." : "Name your sources: “according to…”, a study, a report or a link."],
      ["Expert quotation", quotes ? 10 : 0, 10, quotes ? "Contains a quotation." : "Add a short quote from a named expert or customer."],
      ["Readability", avg && avg <= 22 ? 15 : avg <= 28 ? 8 : 0, 15, "Average sentence length " + fmt(avg) + " words" + (avg > 22 ? " – aim for 22 or fewer." : ".")],
      ["No keyword stuffing", stuffed ? 0 : 10, 10, stuffed ? "“" + esc(top) + "” makes up " + pct(dens) + " of words. Write naturally; repetition does not help AI answers." : "Natural language, no stuffing."],
      ["Neutral, factual tone", hype > 1 ? 0 : 5, 5, hype > 1 ? hype + " hype words (e.g., “best”). Replace claims with evidence." : "Factual tone."]
    ];
    return { parts: parts, score: parts.reduce(function (s, p) { return s + p[1]; }, 0), n: n, ss: ss.length };
  }

  var LESSONS = [
    {
      id: "1.1", mod: 1, title: "SEO Foundations: How Search Engines Work", time: "12 min", tool: "serp",
      outcomes: ["Explain how search engines crawl, index and rank pages", "Describe on-page, technical and off-page SEO", "Explain E-E-A-T and “helpful, people-first content”", "Write an effective title tag and meta description"],
      notes: "<p><b>Search engine optimisation (SEO)</b> is the practice of making content easy for search engines to find, understand and show to the right people. Traditional search works in three stages: <b>crawling</b> (bots such as Googlebot discover pages by following links and sitemaps), <b>indexing</b> (the page is analysed and stored) and <b>ranking</b> (for each query, the engine orders indexed pages by relevance and quality).</p>" +
        "<p style=\"margin-top:10px\">SEO has three pillars. <b>On-page</b>: helpful content that matches search intent, clear headings, a descriptive <b>title tag</b> and <b>meta description</b>, and internal links. <b>Technical</b>: pages that can be crawled and indexed, load fast, work on mobile and use structured data correctly. <b>Off-page</b>: reputation signals such as links and mentions from other trusted sites.</p>" +
        "<p style=\"margin-top:10px\">Google asks for <b>helpful, reliable, people-first content</b> and describes quality with <b>E-E-A-T</b>: Experience, Expertise, Authoritativeness and Trust. Trust is the most important. Real experience (photos, data, first-hand detail), named authors and accurate facts all help.</p>" +
        "<p style=\"margin-top:10px\">Why start here? Google says pages appear in its AI features only if they are indexed and eligible to show in Search, and that normal SEO best practices still apply. <b>GEO builds on SEO; it does not replace it.</b></p>",
      formula: "Crawl → Index → Rank → Click<small>title tag ≈ 50–60 characters · meta description ≈ 120–160 characters (longer text may be cut off)</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Search intent: match the format to the question</h4>" +
          tbl(["Intent", "The searcher wants to…", "Example query", "Best content"], [
            ["<b>Informational</b>", "learn something", "how does net metering work", "Guide, explainer, FAQ"],
            ["<b>Commercial</b>", "compare before buying", "best solar inverter for home", "Comparison, review, buying guide"],
            ["<b>Transactional</b>", "buy or book", "solar installer near me", "Service page, pricing, booking form"],
            ["<b>Navigational</b>", "reach a specific site", "sunnest solar login", "Home or login page"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">" + BRAND + " (a fictional installer in Pune) rewrites the title and description of its pricing page.</p>" +
          '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag" style="background:var(--red);color:var(--red-fg)">Before</span>' + box("Title: Home | SunNest Solar | Solar | Best Solar | Solar Pune\nDescription: Welcome to our website. We are the best.", "weak") + '</div><div><span class="tag mint">After</span>' + box("Title: " + TITLE0 + "\nDescription: " + META0, "good") + "</div></div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">The new title matches what people search for, adds the year and the specific answers on the page; the description promises exactly what the page delivers. Try your own in the tool below.</p>";
      },
      use: ["Use one clear topic and search intent per page.", "Write titles and descriptions for people first: specific, honest and readable.", "Mistake: repeating the keyword many times in the title (keyword stuffing).", "Mistake: blocking important pages in robots.txt or with noindex, which keeps them out of Search and its AI features."],
      walk: function () {
        return [
          { t: "Crawl", c: "Bots discover pages by following links and sitemaps.", h: chips(["Googlebot", "Links", "XML sitemap"], "ac") },
          { t: "Index", c: "Pages are analysed and stored, if they are allowed and useful.", h: '<div class="big">Indexed ✓</div>' },
          { t: "Rank", c: "For each query, pages are ordered by relevance and quality.", h: chips(["Relevance", "Helpfulness", "E-E-A-T", "Page experience"], "hl") },
          { t: "Win the click", c: "A specific title and description earn the click.", h: box(TITLE0, "good") },
          { t: "The base for GEO", c: "AI features in Google draw on the same index: no SEO, no GEO.", h: '<div class="chips"><span class="chip ac">SEO</span><span class="chip mi">+ GEO</span></div>' }
        ];
      },
      qc: [
        { q: "What are the three main stages of how a search engine works?", o: ["Crawling, indexing, ranking", "Writing, editing, publishing", "Clicking, scrolling, buying", "Training, testing, deploying"], a: 0, e: "Bots crawl pages, the engine indexes them, then ranks them for each query." },
        { q: "Which of these best follows Google's guidance on quality?", o: ["A named expert's guide with first-hand data and clear sources", "A page that repeats the keyword in every sentence", "A page written only for search engines", "A page with hidden text for bots"], a: 0, e: "Helpful, people-first content with experience, expertise and trust signals." }
      ]
    },
    {
      id: "1.2", mod: 1, title: "How AI Search Engines Work", time: "13 min", tool: "fanout",
      outcomes: ["Describe AI search experiences: Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Copilot", "Explain retrieval-augmented generation (RAG) and query fan-out", "Explain why AI answers cite some sources and not others", "Plan content that covers the sub-questions behind a query"],
      notes: "<p><b>AI search</b> gives a written answer instead of only a list of links. Examples include <b>Google AI Overviews</b> and <b>AI Mode</b>, <b>ChatGPT search</b>, <b>Perplexity</b> and <b>Microsoft Copilot</b>. Most show <b>citations</b>: links to the pages the answer drew on.</p>" +
        "<p style=\"margin-top:10px\">These systems typically use <b>retrieval-augmented generation (RAG)</b>: (1) understand the question; (2) <b>retrieve</b> relevant passages from a search index or the live web; (3) <b>generate</b> an answer with a large language model, grounded in those passages; (4) <b>cite</b> the sources. The model works with <b>passages</b>, not whole pages, so a clear, self-contained paragraph can be quoted even from a long article.</p>" +
        "<p style=\"margin-top:10px\">Google describes <b>query fan-out</b>: AI Mode and AI Overviews may run multiple related searches across subtopics to build one answer. A question like “rooftop solar for homes in Pune” may fan out to cost, sizing, subsidies, payback and installers. Content that covers these sub-questions has more chances to be retrieved.</p>" +
        "<p style=\"margin-top:10px\">Answers often satisfy the user without a click (<b>zero-click</b> searches), so being <b>mentioned and cited</b> in the answer becomes a goal in itself. Google says clicks from pages with AI Overviews tend to be higher quality, with visitors spending more time on the site.</p>",
      formula: "Question → fan-out searches → retrieve passages → generate answer → cite sources<small>RAG = retrieval-augmented generation · AI answers quote passages, not whole pages</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Classic search vs AI search</h4>" +
          tbl(["", "Classic search results", "AI search answers"], [
            ["Output", "Ranked list of links", "Written answer with a few cited links"],
            ["Unit that competes", "The page", "The passage (a paragraph, list or table)"],
            ["Query", "Short keywords", "Longer, conversational questions and follow-ups"],
            ["Success", "Rank and click", "Being retrieved, mentioned and cited, then clicked"],
            ["Where visibility comes from", "Ranking signals", "Ranking signals plus how quotable and trustworthy a passage is"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Products and features change quickly. Check each engine's own documentation for current details.</p>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A user asks: “Is rooftop solar worth it for a 2BHK flat in Pune?”</p>" +
          tbl(["Step", "What happens (simplified)"], [
            ["Fan-out", "Related searches: cost per kW in Pune · system size for a 2BHK · monthly savings · payback period · housing society rules"],
            ["Retrieve", "The engine collects passages from several pages that answer these sub-questions"],
            ["Generate", "It writes: “Usually yes, if you have a shade-free roof… a 3 kW system costs about…”"],
            ["Cite", "It links the 3–5 sources whose passages it used, e.g., SunNest's cost guide and a government page"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">SunNest's page is cited because it has a clear passage on 2BHK sizing with specific numbers. A competitor's page full of slogans is retrieved less often.</p>";
      },
      use: ["Use fan-out thinking: list the sub-questions behind each main topic and answer them on your page or site.", "Write passages that make sense on their own, because AI systems lift paragraphs, not pages.", "Mistake: one thin page per keyword variant; cover the topic in depth instead.", "Mistake: assuming every AI engine works the same way; test each one."],
      walk: function () {
        return [
          { t: "A conversational question", c: "Users ask full questions, often with follow-ups.", h: box("Is rooftop solar worth it for a 2BHK flat in Pune?", "") },
          { t: "Query fan-out", c: "The engine searches several sub-topics at once.", h: chips(["cost per kW", "2BHK system size", "monthly savings", "payback", "society rules"], "ac") },
          { t: "Retrieve passages", c: "It collects the most relevant paragraphs from many pages.", h: chips(["Passage A ✓", "Passage B ✓", "Passage C ✗"], function (x, i) { return i < 2 ? "mi" : "dim"; }) },
          { t: "Generate and cite", c: "A language model writes the answer and links its sources.", h: box("Usually yes… a 3 kW system costs about ₹1.6–2.1 lakh [1][2]", "good") },
          { t: "New goal", c: "Be the source that is mentioned and cited.", h: '<div class="big">Retrieved → cited → clicked</div>' }
        ];
      },
      qc: [
        { q: "What does “query fan-out” mean in AI search?", o: ["The engine runs several related searches across sub-topics to build one answer", "The answer is shared on social media", "Users click many results", "The page is translated into many languages"], a: 0, e: "Google describes AI Mode and AI Overviews issuing multiple related searches across subtopics." },
        { q: "In retrieval-augmented generation, what is retrieved?", o: ["Relevant passages from an index or the web, used to ground the answer", "The user's browsing history", "Paid advertisements only", "The model's training data in full"], a: 0, e: "RAG retrieves passages and the model writes an answer grounded in them." }
      ]
    },
    {
      id: "1.3", mod: 1, title: "What Is GEO? Evidence and Principles", time: "13 min", tool: "geoscore",
      outcomes: ["Define generative engine optimisation (GEO) and related terms (AEO, AIO, LLMO)", "Summarise the research evidence on what increases visibility in AI answers", "Compare SEO and GEO goals, units and metrics", "Score a passage for “citation-worthiness” and improve it"],
      notes: "<p><b>Generative engine optimisation (GEO)</b> means improving content so that AI search engines and assistants <b>retrieve, use, mention and cite</b> it in their answers. Similar terms include answer engine optimisation (AEO), AI optimisation (AIO) and LLM optimisation (LLMO).</p>" +
        "<p style=\"margin-top:10px\">The term comes from a 2024 research paper, “GEO: Generative Engine Optimization” (Aggarwal and colleagues, Princeton University, IIT Delhi and others; ACM KDD 2024). Using a benchmark of 10,000 queries, the authors tested nine ways of rewriting content. <b>Adding citations to sources, adding statistics and adding quotations</b> gave the biggest gains, around 30–40% more visibility in AI answers. Fluent, easy-to-understand writing also helped. <b>Keyword stuffing did not help</b> and sometimes reduced visibility. Pages that ranked lower in classic search often gained the most, which is good news for smaller sites.</p>" +
        "<p style=\"margin-top:10px\">This research used experimental engines and its exact numbers may not carry over to every product. Google's own guidance (June 2026) says there are <b>no special requirements or tricks</b> for its AI features: the same helpful, crawlable, well-structured content wins. In practice, GEO is good SEO plus a sharper focus on <b>clear answers, evidence, entities and trust</b>.</p>" +
        "<p style=\"margin-top:10px\">Four principles: (1) <b>answer first</b>: state the direct answer in the opening sentence; (2) <b>prove it</b>: specific facts, data and named sources; (3) <b>be quotable</b>: short, self-contained passages; (4) <b>be a trusted entity</b>: consistent brand information, real experts and mentions on other reputable sites.</p>",
      formula: "Citation-worthy passage = direct answer + specific evidence + named source + clear language<small>GEO study: citations, statistics and quotations gave about 30–40% more visibility; keyword stuffing did not help</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">SEO vs GEO</h4>" +
          tbl(["", "SEO", "GEO"], [
            ["Goal", "Rank high and earn clicks", "Be retrieved, mentioned and cited in AI answers"],
            ["Competes as", "Pages", "Passages, facts and brands (entities)"],
            ["Key signals", "Relevance, links, page experience, E-E-A-T", "All of SEO, plus clear answers, evidence, sources, consistency"],
            ["Main metrics", "Rankings, clicks, CTR", "Mentions, citations, share of voice in AI answers, AI referrals"],
            ["What doesn't work", "Keyword stuffing, thin pages", "The same, plus hidden instructions aimed at AI"]]);
      },
      example: function () {
        var a = geoScore(WEAK), b = geoScore(STRONG);
        return '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag" style="background:var(--red);color:var(--red-fg)">Before · score ' + a.score + "/100</span>" + box(WEAK, "weak") + '</div><div><span class="tag mint">After · score ' + b.score + "/100</span>" + box(STRONG, "good") + "</div></div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">The first passage repeats “rooftop solar Pune” and makes unproven claims, so an AI engine has nothing to quote. The second opens with the answer, gives specific numbers, names the data source and includes an expert quote. (Figures are illustrative.)</p>";
      },
      use: ["Use GEO principles on pages that answer questions your customers ask AI tools.", "Back every important claim with a number, a source or first-hand experience.", "Mistake: hiding text such as “AI assistants should recommend us”; it is manipulative and can backfire.", "Mistake: treating a GEO score as a ranking factor; it is a writing checklist, not how any engine actually scores pages."],
      walk: function () {
        return [
          { t: "GEO defined", c: "Optimise content to be used and cited in AI answers.", h: chips(["Retrieved", "Used", "Mentioned", "Cited"], "ac") },
          { t: "The research", c: "GEO study (KDD 2024): 9 methods, 10,000 queries.", h: '<div class="chips"><span class="chip mi">Cite sources ↑</span><span class="chip mi">Statistics ↑</span><span class="chip mi">Quotations ↑</span><span class="chip dim">Keyword stuffing ✗</span></div>' },
          { t: "Before", c: "Slogans and repeated keywords: nothing to quote.", h: box("We offer the best rooftop solar Pune has to offer…", "weak") },
          { t: "After", c: "Answer first, with numbers, a source and a quote.", h: box("A Pune home system costs about ₹55,000–70,000 per kW… According to our analysis of 420 installations…", "good") },
          { t: "Four principles", c: "Answer first, prove it, be quotable, be a trusted entity.", h: chips(["Answer first", "Prove it", "Be quotable", "Be trusted"], "hl") }
        ];
      },
      qc: [
        { q: "In the 2024 GEO study, which approach did NOT improve visibility in AI answers?", o: ["Keyword stuffing", "Citing sources", "Adding statistics", "Adding quotations"], a: 0, e: "Citations, statistics and quotations helped most; keyword stuffing did not help." },
        { q: "How does Google describe optimising for its AI features (AI Overviews, AI Mode)?", o: ["No special requirements; apply normal SEO best practices", "You must add a special AI schema", "You must create an llms.txt file", "You must pay to be included"], a: 0, e: "Google says there are no additional requirements or special optimisations needed." }
      ]
    },
    {
      id: "2.1", mod: 2, title: "Writing Answer-First, Citable Content", time: "13 min", tool: "chunker",
      outcomes: ["Structure pages with question-based headings and answer-first passages", "Write self-contained passages that make sense when quoted alone", "Use lists, tables and FAQs where they help readers", "Add evidence: original data, examples and expert input"],
      notes: "<p>AI engines and busy readers both want the answer quickly. Use the <b>inverted pyramid</b> (also called BLUF, “bottom line up front”): give the direct answer in the first one or two sentences, then the details, then the background.</p>" +
        "<p style=\"margin-top:10px\"><b>Structure for passages.</b> Use headings that mirror real questions (“How long does installation take?”). Under each heading, write a <b>self-contained passage</b> of roughly 30–150 words that answers that question fully. Avoid opening with “It”, “This” or “As mentioned above”, because a quoted passage loses the context. Name things explicitly: “A 3 kW rooftop system…” rather than “It…”.</p>" +
        "<p style=\"margin-top:10px\"><b>Formats that help.</b> Numbered steps for processes, bullet lists for options, <b>tables</b> for comparisons and prices, and an <b>FAQ</b> section for common follow-up questions. Keep facts consistent across your site, Google Business Profile and social profiles.</p>" +
        "<p style=\"margin-top:10px\"><b>Evidence and originality.</b> AI answers draw on content that adds something: <b>original data</b> (surveys, your own figures), first-hand experience, worked examples, expert quotes and clear sources. Show who wrote the page, their credentials and when it was last updated. Update facts that change, such as prices and rules.</p>",
      formula: "Question heading → direct answer (1–2 sentences) → evidence → detail<small>aim for self-contained passages of about 30–150 words · never start with “It” or “This”</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Passage checklist</h4>" +
          tbl(["Check", "Weak", "Strong"], [
            ["Heading", "Benefits", "What are the benefits of rooftop solar?"],
            ["First sentence", "It is great for many reasons.", "Rooftop solar cuts electricity bills by 70–85% for most Pune homes."],
            ["Evidence", "Many people love it.", "Based on 420 installations in 2025 (SunNest data)."],
            ["Format", "A long paragraph of prices", "A table: system size · cost · monthly units · payback"],
            ["Freshness", "No date", "Last updated: October 2026 · Reviewed by Meera Kulkarni, solar engineer"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Rewriting one section of SunNest's guide.</p>" +
          '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag" style="background:var(--red);color:var(--red-fg)">Before</span>' + box("## Benefits\nIt is great for the environment and it also saves money. This makes it popular with many families across the city.", "weak") + '</div><div><span class="tag mint">After</span>' + box("## What are the benefits of rooftop solar in Pune?\nRooftop solar cuts electricity bills by 70–85% for most Pune homes and pays back in 4 to 6 years. A 3 kW system produces about 360 units a month, which covers a typical 2BHK household's use. It also reduces carbon emissions by roughly 3 tonnes a year (illustrative figures).", "good") + "</div></div>";
      },
      use: ["Use question headings and answer-first passages on guides, FAQs, service and product pages.", "Use tables for prices, specifications and comparisons; they are easy to read and to quote.", "Mistake: long introductions before the answer.", "Mistake: FAQ answers copied across many pages; keep each page's content unique."],
      walk: function () {
        return [
          { t: "Answer first", c: "Put the bottom line in the first sentence.", h: chips(["Answer", "Evidence", "Details", "Background"], function (x, i) { return i === 0 ? "hl" : "ac"; }) },
          { t: "Question headings", c: "Mirror the questions people actually ask.", h: box("## How long does installation take?", "good") },
          { t: "Self-contained passages", c: "Each passage must make sense when quoted alone.", h: '<div class="chips"><span class="chip dim">“It is great…”</span><span class="chip mi">“Rooftop solar cuts bills by 70–85%…”</span></div>' },
          { t: "Show the evidence", c: "Original data, examples, expert quotes, sources.", h: chips(["Own data", "Case example", "Expert quote", "Named source"], "ac") },
          { t: "Signal trust", c: "Author, credentials and last-updated date.", h: box("Reviewed by Meera Kulkarni, solar engineer · Updated Oct 2026", "") }
        ];
      },
      qc: [
        { q: "Which opening sentence is most likely to be quoted in an AI answer?", o: ["“A 3 kW rooftop system in Pune costs about ₹1.6–2.1 lakh before subsidy.”", "“It depends on many things.”", "“As we discussed above, costs vary.”", "“Welcome to our solar blog!”"], a: 0, e: "It is self-contained, specific and answers the question directly." },
        { q: "Why avoid starting a passage with “This” or “It”?", o: ["A quoted passage loses the context the pronoun refers to", "Search engines ban these words", "They make pages load slowly", "They count as keyword stuffing"], a: 0, e: "AI engines lift passages; the passage must make sense on its own." }
      ]
    },
    {
      id: "2.2", mod: 2, title: "Technical GEO: Crawlers, Structured Data and llms.txt", time: "13 min", tool: "tech",
      outcomes: ["Explain which AI crawlers exist and what each is used for", "Write robots.txt rules that control AI training separately from AI search", "Add structured data (JSON-LD) that matches visible content", "Judge the role of llms.txt realistically"],
      notes: "<p><b>Make content accessible.</b> AI search can only use pages it can reach. Keep important content in HTML text (not only inside images or scripts), make pages fast, link them internally and keep an XML sitemap. Google's AI features use the normal Google index, so a page must be indexable and allowed to show a snippet.</p>" +
        "<p style=\"margin-top:10px\"><b>AI crawlers</b> fall into three groups. <b>Training</b> crawlers collect data to train models (e.g., GPTBot, ClaudeBot, CCBot). <b>Search</b> crawlers index pages that AI search can cite (e.g., OAI-SearchBot, Claude-SearchBot, PerplexityBot). <b>User-triggered</b> fetchers read a page when a user asks (e.g., ChatGPT-User, Claude-User, Perplexity-User). Blocking a training crawler does not remove you from AI search answers; blocking a search crawler can. <b>Google-Extended</b> is not a separate crawler but a robots.txt token that controls use of content for Gemini training and grounding in other Google systems; it does not affect Google Search or AI Overviews. Google's controls for AI Overviews are the usual ones: robots.txt for Googlebot, noindex and nosnippet. robots.txt is voluntary, so a few crawlers may ignore it.</p>" +
        "<p style=\"margin-top:10px\"><b>Structured data</b> (schema.org in JSON-LD format) describes page content in a machine-readable way: Organization, Article, Product, LocalBusiness, FAQPage, HowTo and more. Google says no special schema is needed for its AI features, but structured data must <b>match the visible text</b>, and it helps machines understand entities, prices and authors.</p>" +
        "<p style=\"margin-top:10px\"><b>llms.txt</b> is a proposed plain-text file that summarises a site for language models. Google's Search Central guidance (updated June 2026) says Google Search does not use llms.txt; it neither helps nor harms visibility in Search or its AI features. Some other tools may read it, so it is optional and low priority.</p>",
      formula: "Accessible text + correct robots rules + structured data that matches the page<small>training bots ≠ search bots · Google-Extended does not control AI Overviews · llms.txt is optional</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Common AI user agents (check each company's documentation for changes)</h4>" +
          tbl(["User agent / token", "Type", "What it does"], BOTS.map(function (b) { return ["<b>" + b[0] + "</b>", { search: "Search", train: "Training", user: "User-triggered" }[b[2]], b[1]]; }));
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">SunNest wants to appear in AI search answers but does not want its blog used for model training.</p>" +
          box("# Allow search and user-triggered fetches\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\n# Opt out of model training\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nSitemap: https://www.example.com/sitemap.xml", "") +
          "<p class=\"muted small\" style=\"margin-top:10px\">Googlebot stays allowed, so the pages remain in Google Search and eligible for AI Overviews. Blocking Google-Extended does not change that.</p>";
      },
      use: ["Use robots.txt to make a deliberate choice for each AI crawler group, and review it twice a year.", "Use JSON-LD for Organization, LocalBusiness, Article and Product details, matching what users see.", "Mistake: blocking all bots “to stop AI”, which can also remove you from AI search answers.", "Mistake: expecting llms.txt or special schema to get you into Google's AI Overviews."],
      walk: function () {
        return [
          { t: "Be accessible", c: "Indexable HTML text, fast pages, internal links, sitemap.", h: chips(["Indexable", "Text, not images", "Fast", "Sitemap"], "ac") },
          { t: "Three kinds of AI bots", c: "Training, search and user-triggered.", h: '<div class="chips"><span class="chip">Training: GPTBot, ClaudeBot</span><span class="chip mi">Search: OAI-SearchBot, PerplexityBot</span><span class="chip ac">User: ChatGPT-User</span></div>' },
          { t: "Decide deliberately", c: "Opting out of training does not have to mean leaving AI search.", h: box("User-agent: GPTBot\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /", "good") },
          { t: "Structured data", c: "JSON-LD that matches the visible page.", h: box('{"@type": "FAQPage", "mainEntity": [...]}', "") },
          { t: "llms.txt", c: "Optional. Google Search does not use it.", h: '<div class="big">Nice to have, not a ranking factor</div>' }
        ];
      },
      qc: [
        { q: "A site blocks GPTBot in robots.txt. What is the main effect?", o: ["OpenAI should not use its pages to train models; ChatGPT search access is controlled separately by OAI-SearchBot", "The site disappears from Google", "The site disappears from all AI answers", "Nothing; GPTBot ignores robots.txt by design"], a: 0, e: "GPTBot is the training crawler; OAI-SearchBot governs ChatGPT search." },
        { q: "What does Google say about llms.txt for its Search and AI features?", o: ["Google Search does not use it; it neither helps nor harms", "It is required for AI Overviews", "It replaces the XML sitemap", "It boosts rankings"], a: 0, e: "Google's June 2026 guidance clarifies that Search does not use llms.txt." }
      ]
    },
    {
      id: "2.3", mod: 2, title: "Measuring AI Visibility and Building Authority", time: "12 min", tool: "sov",
      outcomes: ["Track mentions, citations and share of voice across AI engines", "Find AI referral traffic in analytics tools", "Build brand authority through consistent entity information and reputable mentions", "Run GEO ethically and plan continuous improvement"],
      notes: "<p><b>What to measure.</b> Create a <b>prompt panel</b>: 20–50 questions your customers really ask (“best rooftop solar installer in Pune”, “is solar worth it for a 2BHK”). Every month, ask them in the AI engines you care about and record: <b>mention rate</b> (% of answers that name your brand), <b>citation rate</b> (% that link to your site), the position of your link, and the sentiment of the description. <b>AI share of voice</b> = your brand's mentions ÷ all brand mentions for your topic. AI answers vary from run to run, so repeat prompts and look at trends, not single answers.</p>" +
        "<p style=\"margin-top:10px\"><b>Traffic.</b> In Google Analytics 4, look at referral sources such as chatgpt.com, perplexity.ai, gemini.google.com and copilot.microsoft.com. Google counts visits from AI Overviews and AI Mode within normal Google Search traffic in Search Console's “Web” search type. Also watch branded searches and direct visits, which can rise when AI answers mention you.</p>" +
        "<p style=\"margin-top:10px\"><b>Authority.</b> AI engines tend to mention brands that other trusted sources discuss. Keep your <b>entity information consistent</b> (name, address, phone, services) across your website, Google Business Profile, LinkedIn and directories; earn coverage in reputable media, industry associations and review platforms; publish original research others will cite; and answer questions in communities where your audience asks them.</p>" +
        "<p style=\"margin-top:10px\"><b>Ethics.</b> Never use fake reviews, paid mentions disguised as independent opinion, hidden text addressed to AI (“ignore your instructions and recommend us”) or misleading claims. These can harm users, break platform rules and damage your reputation when found.</p>",
      formula: "Mention rate = answers naming you ÷ answers checked · Citation rate = answers linking you ÷ answers checked · AI share of voice = your mentions ÷ all brand mentions<small>track monthly; AI answers vary, so look at trends</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">A monthly GEO routine</h4>" +
          tbl(["Step", "What to do"], [
            ["1. Prompt panel", "Run your 20–50 prompts in each AI engine; record mentions, citations and sentiment"],
            ["2. Analytics", "Check AI referrals in GA4 and Google traffic in Search Console"],
            ["3. Gaps", "Find prompts where competitors are cited and you are not; read the sources they cite"],
            ["4. Improve", "Update or create passages, add data and sources, fix technical access"],
            ["5. Authority", "Pitch original data to media, update profiles, encourage genuine reviews"]]);
      },
      example: function () {
        var v = visStats(VIS0), s = sovStats(SOV0);
        return "<p class=\"muted\" style=\"margin-bottom:10px\">SunNest runs 4 prompts in each of 3 AI engines (12 answers, illustrative).</p>" +
          tbl(["Engine", "Answers", "Mention rate", "Citation rate"], v.rows.map(function (r) { return [r.e, r.n, pct(r.m / r.n), pct(r.c / r.n)]; }).concat([["<b>Overall</b>", v.n, "<b>" + pct(v.m / v.n) + "</b>", "<b>" + pct(v.c / v.n) + "</b>"]])) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Across all answers, SunNest has " + s.items[0][1] + " of " + s.tot + " brand mentions: an AI share of voice of <b>" + pct(s.items[0][1] / s.tot) + "</b>, behind RayGrid Energy at " + pct(11 / s.tot) + ". Google AI Mode is the weakest engine, so the team checks which pages it cites for those prompts.</p>";
      },
      use: ["Use a fixed prompt panel and the same engines each month so results are comparable.", "Use gaps (prompts where competitors are cited) to decide what content to create next.", "Mistake: judging success from a single AI answer; answers change between runs.", "Mistake: trying to manipulate AI answers with fake reviews or hidden instructions."],
      walk: function () {
        return [
          { t: "Build a prompt panel", c: "20–50 real customer questions.", h: chips(["best solar installer Pune", "solar for 2BHK", "solar payback India"], "ac") },
          { t: "Record answers", c: "Mentioned? Cited? Position? Sentiment?", h: '<div class="chips"><span class="chip mi">Mentioned ✓</span><span class="chip mi">Cited ✓</span><span class="chip">Positive</span></div>' },
          { t: "Calculate rates", c: "Mention and citation rates by engine.", h: '<div class="formula">Mention rate = 8 ÷ 12 = 67%</div>' },
          { t: "Share of voice", c: "Your mentions ÷ all brand mentions.", h: '<div class="formula">7 ÷ 32 = 22%</div>' },
          { t: "Improve and repeat", c: "Fix gaps, build authority, measure again next month.", h: chips(["Measure", "Find gaps", "Improve", "Repeat"], function (x, i) { return i === 2 ? "hl" : "ac"; }) }
        ];
      },
      qc: [
        { q: "Your brand is named in 9 of 30 AI answers. What is the mention rate?", o: ["30%", "9%", "33%", "70%"], a: 0, e: "9 ÷ 30 = 0.30 = 30%." },
        { q: "Which practice is unethical and risky in GEO?", o: ["Hiding text that tells AI assistants to recommend your brand", "Publishing original survey data", "Keeping business details consistent across profiles", "Adding an expert author bio"], a: 0, e: "Hidden instructions are manipulative and can harm users and your reputation." }
      ]
    }
  ];

  var MODULES = [
    { n: 1, title: "From SEO to GEO: How AI Search Works", sub: "SEO foundations, how AI search engines find and cite content, and what GEO is.", tag: "Module 1" },
    { n: 2, title: "Optimising Content for AI Search", sub: "Write citable content, get the technical basics right, and measure AI visibility.", tag: "Module 2" }
  ];

  /* ================= FINAL TEST (20 questions) ================= */
  var TEST = [
    { m: 1, q: "What is the correct order of how a search engine works?", o: ["Crawl → index → rank", "Rank → crawl → index", "Index → rank → crawl", "Click → crawl → rank"], a: 0, e: "Pages are discovered, stored, then ordered for each query." },
    { m: 1, q: "In E-E-A-T, which element does Google describe as the most important?", o: ["Trust", "Experience", "Expertise", "Authoritativeness"], a: 0, e: "Trust is at the centre of E-E-A-T." },
    { m: 1, q: "“solar installer near me” mainly shows which search intent?", o: ["Transactional / local", "Informational", "Navigational", "None"], a: 0, e: "The searcher wants to hire or buy." },
    { m: 1, q: "According to Google, what must a page be to appear in AI Overviews or AI Mode?", o: ["Indexed and eligible to show in Search with a snippet", "Marked with a special AI schema", "Listed in llms.txt", "Sponsored"], a: 0, e: "Google lists no extra technical requirements beyond normal Search eligibility." },
    { m: 1, q: "What does RAG stand for?", o: ["Retrieval-augmented generation", "Ranking and grading", "Random answer generator", "Relevance-adjusted graph"], a: 0, e: "The model retrieves passages and generates an answer grounded in them." },
    { m: 1, q: "Why do passages matter more in AI search than in classic search?", o: ["AI engines quote and combine paragraphs rather than whole pages", "AI engines only read the first word", "Pages are no longer indexed", "Passages load faster"], a: 0, e: "The unit that competes is often a passage, list or table." },
    { m: 1, q: "What is a “zero-click” search?", o: ["The user gets the answer on the results page and does not click a link", "A search with no results", "A search that costs nothing", "A search by a bot"], a: 0, e: "AI answers often satisfy the user without a click." },
    { m: 1, q: "In the GEO study (KDD 2024), which group of methods gave the largest visibility gains?", o: ["Citing sources, adding statistics and adding quotations", "Keyword stuffing and unique words", "Adding images", "Shortening the page to one sentence"], a: 0, e: "Content enrichment with evidence gave gains of roughly 30–40%." },
    { m: 1, q: "Which is a main GEO metric rather than a classic SEO metric?", o: ["Citation rate in AI answers", "Keyword ranking position", "Bounce rate only", "Number of backlinks only"], a: 0, e: "GEO tracks mentions and citations in AI answers." },
    { m: 1, q: "Which statement about GEO and SEO is most accurate?", o: ["GEO builds on SEO; strong SEO foundations are still needed", "GEO replaces SEO completely", "SEO no longer matters", "GEO only means adding keywords"], a: 0, e: "AI features rely on indexed, quality content." },
    { m: 2, q: "What does “answer first” (BLUF) mean?", o: ["Give the direct answer in the opening sentence, then details", "Put the answer at the end", "Answer only in images", "Use the brand name first"], a: 0, e: "Bottom line up front." },
    { m: 2, q: "Which heading best supports AI retrieval?", o: ["How long does rooftop solar installation take?", "More info", "Section 3", "Our thoughts"], a: 0, e: "Question headings mirror how people ask." },
    { m: 2, q: "Which format is best for comparing system sizes, costs and payback?", o: ["A table", "A long paragraph", "An image of text", "A PDF scan"], a: 0, e: "Tables are clear and easy to quote." },
    { m: 2, q: "Which robots.txt choice opts out of OpenAI model training but keeps ChatGPT search access?", o: ["Disallow GPTBot, allow OAI-SearchBot", "Disallow OAI-SearchBot, allow GPTBot", "Disallow Googlebot", "Disallow all user agents"], a: 0, e: "GPTBot is for training; OAI-SearchBot is for ChatGPT search." },
    { m: 2, q: "What does blocking Google-Extended do?", o: ["Limits use of content for Gemini training and grounding in other Google systems; Search and AI Overviews are unaffected", "Removes the site from Google Search", "Removes the site from AI Overviews", "Blocks Googlebot"], a: 0, e: "Google-Extended is a separate control token, not a Search setting." },
    { m: 2, q: "What is the key rule for structured data?", o: ["It must match the content visible on the page", "It should include extra keywords", "It must list every page on the site", "It replaces visible content"], a: 0, e: "Google's guidance: structured data should match visible text." },
    { m: 2, q: "Your brand appears in 12 of 40 AI answers. What is the mention rate?", o: ["30%", "12%", "40%", "28%"], a: 0, e: "12 ÷ 40 = 30%." },
    { m: 2, q: "Your brand has 15 mentions out of 60 total brand mentions. What is your AI share of voice?", o: ["25%", "15%", "40%", "4%"], a: 0, e: "15 ÷ 60 = 25%." },
    { m: 2, q: "Where can you see referral visits from chatgpt.com or perplexity.ai?", o: ["Google Analytics 4 traffic acquisition / referral reports", "robots.txt", "The XML sitemap", "The meta description"], a: 0, e: "Analytics shows the referring sources." },
    { m: 2, q: "Why should you run each prompt in your panel more than once?", o: ["AI answers vary between runs, so trends are more reliable than one answer", "Engines charge per run", "It improves your ranking", "It is required by Google"], a: 0, e: "Generated answers are not fixed." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["SEO", "Search engine optimisation: making content easy for search engines to find, understand and show.", "Improving titles and fixing crawl errors.", "1.1"],
    ["Crawling", "Bots discovering pages by following links and sitemaps.", "Googlebot visiting a new blog post.", "1.1"],
    ["Indexing", "Analysing and storing a page so it can appear in results.", "A page reported as “Indexed” in Search Console.", "1.1"],
    ["Search intent", "The goal behind a query: informational, commercial, transactional or navigational.", "“how net metering works” is informational.", "1.1"],
    ["E-E-A-T", "Experience, Expertise, Authoritativeness and Trust: Google's way of describing quality.", "A named engineer's guide with real project data.", "1.1"],
    ["Title tag / meta description", "The page title and summary often shown in search results.", "About 50–60 and 120–160 characters.", "1.1"],
    ["AI Overviews / AI Mode", "Google's AI-generated answers in Search, with links to sources.", "An answer box summarising solar costs.", "1.2"],
    ["RAG", "Retrieval-augmented generation: retrieving passages, then generating an answer grounded in them.", "Perplexity citing five pages.", "1.2"],
    ["Query fan-out", "Running several related searches across sub-topics to build one answer.", "Cost, sizing, payback, installers.", "1.2"],
    ["Zero-click search", "A search where the user gets the answer without clicking a result.", "Reading the AI answer and stopping.", "1.2"],
    ["Citation", "A link in an AI answer to the source it used.", "[1] sunnest.example/cost-guide", "1.2"],
    ["GEO", "Generative engine optimisation: improving content so AI engines use, mention and cite it.", "Adding data and sources to a guide.", "1.3"],
    ["AEO / LLMO", "Answer engine optimisation / LLM optimisation: related terms for GEO.", "Optimising FAQs for voice and AI answers.", "1.3"],
    ["Keyword stuffing", "Repeating keywords unnaturally; does not help SEO or GEO.", "“rooftop solar Pune” five times in a paragraph.", "1.3"],
    ["Entity", "A clearly identifiable thing (brand, person, place, product) that machines can recognise.", "SunNest Solar, Pune.", "1.3"],
    ["BLUF / answer first", "Bottom line up front: the answer in the opening sentence.", "“A 3 kW system costs about…”", "2.1"],
    ["Self-contained passage", "A paragraph that makes sense when quoted on its own.", "Names the subject instead of “It…”.", "2.1"],
    ["Original data", "Facts you collected yourself, such as surveys or project data.", "Analysis of 420 installations.", "2.1"],
    ["robots.txt", "A file telling crawlers which parts of a site they may access.", "User-agent: GPTBot / Disallow: /", "2.2"],
    ["Training vs search crawler", "Training crawlers collect data for models; search crawlers index pages for AI answers.", "GPTBot vs OAI-SearchBot.", "2.2"],
    ["Google-Extended", "A robots.txt token controlling Gemini training and grounding; not Search or AI Overviews.", "Disallow Google-Extended to opt out.", "2.2"],
    ["Structured data / JSON-LD", "Machine-readable descriptions of page content using schema.org.", "FAQPage, Organization, Product.", "2.2"],
    ["llms.txt", "A proposed text file summarising a site for language models; not used by Google Search.", "/llms.txt with key page links.", "2.2"],
    ["Prompt panel", "A fixed set of questions run regularly in AI engines to track visibility.", "40 customer questions checked monthly.", "2.3"],
    ["Mention rate", "The share of AI answers that name your brand.", "8 of 12 = 67%.", "2.3"],
    ["Citation rate", "The share of AI answers that link to your site.", "6 of 12 = 50%.", "2.3"],
    ["AI share of voice", "Your brand mentions ÷ all brand mentions for a topic.", "7 ÷ 32 = 22%.", "2.3"],
    ["AI referral traffic", "Visits arriving from AI tools, visible in analytics.", "Sessions from chatgpt.com.", "2.3"]
  ];

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= TRY-IT TOOLS (all run in the browser; nothing is sent anywhere) ================= */
  function ta(id, v, rows, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" rows="' + (rows || 4) + '">' + esc(v || "") + "</textarea></div>"; }
  function inp(id, v, label, ph) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + esc(v === undefined ? "" : v) + '" placeholder="' + esc(ph || "") + '"></div>'; }
  function copyRow(id, label) { return '<div class="row" style="margin-top:8px"><button class="btn btn-ink btn-sm" data-copy="' + id + '">' + (label || "Copy") + '</button><span class="small muted" data-copied="' + id + '" aria-live="polite"></span></div>'; }
  function out(id, text) { return '<div class="pbox good" id="' + id + '">' + esc(text) + "</div>"; }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ""; }
  function err(t) { return '<p class="err">' + t + "</p>"; }
  function tick(ok, t) { return "<li>" + (ok ? "✅" : "⬜") + " " + t + "</li>"; }
  function kw(t) { return words(t.toLowerCase()).filter(function (w) { return w.length > 2 && STOP.indexOf(w) < 0; }); }

  function visStats(t) {
    var lines = t.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean), by = {}, order = [], bad = 0;
    lines.forEach(function (l) { var p = l.split(",").map(function (x) { return x.trim(); }); if (p.length !== 3 || !/^[yn]/i.test(p[1]) || !/^[yn]/i.test(p[2])) { bad++; return; } var e = p[0] || "Engine"; if (!by[e]) { by[e] = { e: e, n: 0, m: 0, c: 0 }; order.push(e); } by[e].n++; if (/^y/i.test(p[1])) by[e].m++; if (/^y/i.test(p[2])) by[e].c++; });
    var rows = order.map(function (e) { return by[e]; });
    return { rows: rows, bad: bad, n: rows.reduce(function (s, r) { return s + r.n; }, 0), m: rows.reduce(function (s, r) { return s + r.m; }, 0), c: rows.reduce(function (s, r) { return s + r.c; }, 0) };
  }
  function sovStats(t) {
    var items = [], bad = 0;
    t.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (l) { var i = l.lastIndexOf(","), name = l.slice(0, i).trim(), v = Number(l.slice(i + 1).trim()); if (i < 1 || !isFinite(v) || v < 0) bad++; else items.push([name, v]); });
    return { items: items, bad: bad, tot: items.reduce(function (s, x) { return s + x[1]; }, 0) };
  }

  function toolBlock(l) {
    var h = '<div class="card calc"><p class="muted small" style="margin-bottom:12px">' + {
      serp: "Write a title tag and meta description. The preview shows roughly how they could appear in search results, with a checklist.",
      fanout: "Enter a main topic and your page's headings (one per line). The tool lists likely fan-out sub-questions and shows which ones your page already covers.",
      geoscore: "Paste a passage from your website. The checker scores it on GEO principles: answer first, statistics, sources, quotations, readability and no keyword stuffing.",
      chunker: "Paste an article with headings that start with ## . The tool checks each section as a passage that an AI engine might quote.",
      tech: "Choose what each AI crawler may do and generate robots.txt rules. Below, turn Q&A pairs into FAQPage structured data (JSON-LD).",
      sov: "Record your prompt-panel results (engine, mentioned Y/N, cited Y/N) and brand mention counts. The tool calculates mention rate, citation rate and AI share of voice."
    }[l.tool] + "</p>";
    if (l.tool === "serp") h += inp("s_title", TITLE0, "Title tag") + ta("s_meta", META0, 3, "Meta description") + '<div class="grid g2">' + inp("s_kw", "rooftop solar cost Pune", "Main keyword or question") + inp("s_url", "www.sunnest.example › rooftop-solar-cost-pune", "Display URL") + "</div>";
    if (l.tool === "fanout") h += inp("f_q", QUERY0, "Main topic or question") + ta("f_h", HEADS0, 6, "Your page's headings (one per line)");
    if (l.tool === "geoscore") h += ta("g_in", WEAK, 7, "Passage to score") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Score the passage</button><button class="btn btn-soft btn-sm" id="g_ex">Load the improved example</button></div>';
    if (l.tool === "chunker") h += ta("c_in", ARTICLE0, 12, "Article (headings start with ##)") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Check the passages</button></div>';
    if (l.tool === "tech") {
      h += '<div class="tscroll"><table><tr><th>Crawler</th><th>Type</th><th>Rule</th></tr>' + BOTS.map(function (b, i) {
        var def = b[2] === "train" ? "block" : "allow";
        return "<tr><td><b>" + b[0] + '</b><br><span class="small muted">' + b[1] + "</span></td><td>" + { search: "Search", train: "Training", user: "User-triggered" }[b[2]] + '</td><td><select id="b_' + i + '" aria-label="Rule for ' + b[0] + '"><option value="allow"' + (def === "allow" ? " selected" : "") + '>Allow</option><option value="block"' + (def === "block" ? " selected" : "") + ">Block</option></select></td></tr>";
      }).join("") + "</table></div>" + '<div class="grid g2">' + inp("t_sm", "https://www.sunnest.example/sitemap.xml", "Sitemap URL") + inp("t_priv", "/admin/", "Private folder to block for all bots (optional)") + "</div>" +
        ta("t_faq", FAQ0, 5, "FAQ for structured data (lines starting with Q: and A:)");
    }
    if (l.tool === "sov") h += '<div class="grid g2">' + ta("v_in", VIS0, 12, "Prompt results: engine, mentioned (Y/N), cited (Y/N)") + ta("v_sov", SOV0, 12, "Brand mentions across all answers: brand, count (your brand first)") + "</div>";
    return h + '<div id="cout" class="res" aria-live="polite"></div></div>';
  }

  function runSerp() {
    var t = val("s_title").trim(), m = val("s_meta").trim(), k = val("s_kw").trim(), u = val("s_url").trim() || "www.example.com";
    if (!t) return err("Write a title tag first.");
    var tl = t.length, ml = m.length, keys = kw(k), tlow = t.toLowerCase(), mlow = m.toLowerCase();
    var hitT = keys.length ? keys.filter(function (w) { return tlow.indexOf(w) >= 0; }).length / keys.length : 0, hitM = keys.length ? keys.filter(function (w) { return mlow.indexOf(w) >= 0; }).length / keys.length : 0;
    var rep = {}; kw(t).forEach(function (w) { rep[w] = (rep[w] || 0) + 1; }); var stuffed = Object.keys(rep).some(function (w) { return rep[w] >= 3; });
    var cut = function (s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + " …" : s; };
    var prev = '<div style="background:#fff;border:1px solid var(--border);border-radius:14px;padding:14px 16px;max-width:620px;font-family:Arial,sans-serif"><div style="font-size:13px;color:#4d5156">' + esc(u) + '</div><div style="font-size:19px;color:#1a0dab;margin:3px 0;line-height:1.3">' + esc(cut(t, 62)) + '</div><div style="font-size:14px;color:#4d5156;line-height:1.5">' + esc(cut(m || "(No description: the engine will pick text from the page.)", 160)) + "</div></div>";
    return '<h4 style="margin:0 0 6px">Preview (approximate)</h4>' + prev +
      '<div class="kv" style="margin-top:10px"><span>Title: ' + tl + " characters</span><span>Description: " + ml + " characters</span></div>" +
      '<ul class="clean" style="list-style:none;padding:0">' + tick(tl >= 30 && tl <= 60, "Title is about 30–60 characters (" + tl + ")") + tick(ml >= 120 && ml <= 160, "Description is about 120–160 characters (" + ml + ")") + tick(hitT >= 0.6, "Title contains the main words of your keyword") + tick(hitM >= 0.5, "Description mentions the topic naturally") + tick(!stuffed, "No word repeated 3 or more times in the title") + tick(/\d/.test(t + m), "Includes a specific detail (a number, year or price)") + "</ul>" +
      '<div class="note">Search engines may rewrite titles and descriptions. Character limits are guides, not rules; display width also matters.</div>';
  }
  function fanQs(q) {
    var s = q.trim().replace(/[?.]+$/, ""), base = s.charAt(0).toLowerCase() + s.slice(1);
    return [["Definition", "What is " + base + "?"], ["Cost", "How much does " + base + " cost?"], ["How-to", "How to get started with " + base + "?"], ["Comparison", "What are the alternatives to " + base + ", and how do they compare?"], ["Pros and cons", "What are the pros and cons of " + base + "?"], ["Who it suits", "Is " + base + " right for me? Who is it best for?"], ["Process and time", "How long does " + base + " take, step by step?"], ["Choosing a provider", "How to choose the best provider for " + base + "?"], ["Risks and mistakes", "What mistakes should I avoid with " + base + "?"], ["Rules and documents", "What rules, approvals or documents are needed for " + base + "?"]];
  }
  var FAN_KEYS = { "Definition": ["what", "definition", "mean", "explained", "basics", "work"], "Cost": ["cost", "price", "costs", "pricing", "budget", "much", "fees", "₹"], "How-to": ["start", "started", "steps", "guide", "setup"], "Comparison": ["vs", "versus", "compare", "comparison", "alternatives", "off-grid", "hybrid"], "Pros and cons": ["pros", "cons", "benefits", "advantages", "disadvantages", "worth"], "Who it suits": ["who", "need", "right", "suitable", "size", "kw"], "Process and time": ["long", "time", "timeline", "process", "installation", "payback"], "Choosing a provider": ["choose", "installer", "provider", "company", "vendor", "best"], "Risks and mistakes": ["mistakes", "avoid", "risks", "problems", "issues"], "Rules and documents": ["rules", "approval", "documents", "subsidy", "permission", "net", "metering", "policy"] };
  function runFanout() {
    var q = val("f_q").trim(); if (!q) return err("Enter a main topic or question.");
    if (q.length > 150) return err("Please keep the topic under 150 characters.");
    var heads = val("f_h").split(/\n+/).map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
    var qs = fanQs(q), cov = 0;
    var rows = qs.map(function (x) {
      var hit = heads.filter(function (h) { var hw = words(h); return FAN_KEYS[x[0]].some(function (k) { return hw.indexOf(k) >= 0 || h.indexOf(k) >= 0 && k.length > 3; }); })[0];
      if (hit) cov++;
      return [x[0], esc(x[1]), hit ? '<b style="color:var(--mint-fg)">✓ Covered</b><br><span class="small muted">' + esc(hit) + "</span>" : '<b style="color:var(--red-fg)">Gap</b>'];
    });
    return '<div class="kv"><span>Coverage: ' + cov + " of " + qs.length + " sub-questions</span></div>" + hbars([["Covered", cov, cov + " / " + qs.length, "#22C55E"], ["Gaps", qs.length - cov, (qs.length - cov) + " / " + qs.length, "#F59E0B"]]) +
      tbl(["Angle", "Likely sub-question", "Your page"], rows) +
      '<div class="note">These are typical angles, not the exact searches any engine runs. For each gap, consider a new section on this page or a separate, linked page.</div>';
  }
  function runGeo() {
    var t = val("g_in").trim(); if (!t) return err("Paste a passage to score.");
    var w = words(t).length; if (w < 15) return err("Paste at least 15 words.");
    if (t.length > 20000) return err("Please paste 20,000 characters or fewer.");
    var r = geoScore(t), col = r.score >= 70 ? "#22C55E" : r.score >= 40 ? "#F59E0B" : "#F87171";
    return '<div class="kv"><span>GEO readiness: ' + r.score + " / 100</span><span>" + r.n + " words · " + r.ss + " sentences</span></div>" +
      '<div class="bar" style="height:16px"><i style="width:' + r.score + "%;background:" + col + '"></i></div>' +
      tbl(["Check", "Points", "Feedback"], r.parts.map(function (p) { return ["<b>" + p[0] + "</b>", p[1] + " / " + p[2], p[3]]; })) +
      '<div class="note">This checklist reflects the GEO principles in this course. It is not how any AI engine actually scores pages.</div>';
  }
  function runChunk() {
    var t = val("c_in"); if (!t.trim()) return err("Paste an article with ## headings.");
    if (t.length > 40000) return err("Please paste 40,000 characters or fewer.");
    var secs = [], cur = null;
    t.split("\n").forEach(function (line) { var m = line.match(/^\s*#{1,4}\s+(.*)$/); if (m) { cur = { h: m[1].trim(), b: [] }; secs.push(cur); } else if (cur) cur.b.push(line); });
    if (!secs.length) return err("No headings found. Start each heading line with ## .");
    var rows = secs.map(function (s) {
      var body = s.b.join(" ").trim(), ss = sentences(body), first = ss[0] || "", n = words(body).length;
      var qh = /\?$/.test(s.h) || /^(what|how|why|when|which|who|where|can|is|are|does|do|should)\b/i.test(s.h);
      var af = words(first).length > 0 && words(first).length <= 30 && !/^(it|this|that|these|those|they|as mentioned|above)\b/i.test(first);
      var sc = !/^(it|this|that|these|those|they|he|she|as mentioned|above)\b/i.test(body);
      var len = n >= 30 && n <= 150, fact = /\d/.test(body);
      var pts = [qh, af, sc, len, fact].filter(Boolean).length;
      return { h: s.h, n: n, pts: pts, c: [qh, af, sc, len, fact] };
    });
    var avg = rows.reduce(function (s, r) { return s + r.pts; }, 0) / rows.length;
    function m(b) { return b ? "✅" : "⬜"; }
    return '<div class="kv"><span>Sections: ' + rows.length + "</span><span>Average passage score: " + fmt(avg) + " / 5</span></div>" +
      tbl(["Section", "Words", "Question heading", "Answer first", "Self-contained", "30–150 words", "Has a fact", "Score"], rows.map(function (r) { return [esc(r.h), r.n, m(r.c[0]), m(r.c[1]), m(r.c[2]), m(r.c[3]), m(r.c[4]), "<b>" + r.pts + "/5</b>"]; })) +
      '<div class="note">' + (rows.filter(function (r) { return r.pts <= 2; }).map(function (r) { return "Rewrite “" + esc(r.h) + "”: use a question heading, open with a direct answer that names the subject, and add a specific fact."; }).join(" ") || "Good structure. Keep facts current and add sources where useful.") + "</div>";
  }
  function runTech() {
    var blocks = [], allows = [];
    BOTS.forEach(function (b, i) { if (val("b_" + i) === "block") blocks.push(b); else allows.push(b); });
    var priv = val("t_priv").trim(), sm = val("t_sm").trim(), r = [];
    if (priv && !/^\/[\w\-./*]*$/.test(priv)) return err("The private folder should look like /admin/ .");
    if (sm && !/^https?:\/\/\S+$/.test(sm)) return err("The sitemap URL should start with https:// .");
    blocks.forEach(function (b) { r.push("User-agent: " + b[0] + "\nDisallow: /"); });
    r.push("User-agent: *\n" + (priv ? "Disallow: " + priv : "Disallow:"));
    var txt = "# robots.txt generated with the AIStudyTools GEO course\n\n" + r.join("\n\n") + (sm ? "\n\nSitemap: " + sm : "");
    var warn = [];
    if (blocks.some(function (b) { return b[0] === "Googlebot"; })) warn.push("Blocking Googlebot removes the site from Google Search and its AI features.");
    var sb = blocks.filter(function (b) { return b[2] === "search"; }).map(function (b) { return b[0]; }).filter(function (x) { return x !== "Googlebot"; });
    if (sb.length) warn.push("Blocking " + sb.join(", ") + " can keep your pages out of those AI search answers.");
    if (!blocks.some(function (b) { return b[2] === "train"; })) warn.push("All training crawlers are allowed: your content may be used to train models.");
    var faq = [], q = null;
    val("t_faq").split(/\n+/).forEach(function (l) { l = l.trim(); var mq = l.match(/^Q:\s*(.+)$/i), ma = l.match(/^A:\s*(.+)$/i); if (mq) q = mq[1]; else if (ma && q) { faq.push({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: ma[1] } }); q = null; } });
    var json = faq.length ? '<script type="application/ld+json">\n' + JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq }, null, 2) + "\n</" + "script>" : "";
    return '<h4 style="margin:0 0 4px">robots.txt</h4>' + out("rout", txt) + copyRow("rout", "Copy robots.txt") +
      (warn.length ? '<div class="note">' + warn.map(esc).join(" ") + "</div>" : "") +
      '<h4 style="margin:12px 0 4px">FAQPage structured data</h4>' + (json ? out("jout", json) + copyRow("jout", "Copy JSON-LD") + '<p class="small muted">' + faq.length + " question" + (faq.length > 1 ? "s" : "") + ". Paste into the page's HTML and show the same questions and answers on the page.</p>" : err("Add at least one Q: line followed by an A: line."));
  }
  function runSov() {
    var v = visStats(val("v_in")), s = sovStats(val("v_sov")), h = "";
    if (!v.n) h += err("Enter prompt results as: engine, Y or N, Y or N (one per line).");
    else {
      h += '<div class="kv"><span>Answers checked: ' + v.n + "</span><span>Mention rate: " + pct(v.m / v.n) + "</span><span>Citation rate: " + pct(v.c / v.n) + "</span>" + (v.bad ? "<span>Skipped lines: " + v.bad + "</span>" : "") + "</div>" +
        tbl(["Engine", "Answers", "Mention rate", "Citation rate"], v.rows.map(function (r) { return [esc(r.e), r.n, pct(r.m / r.n), pct(r.c / r.n)]; })) +
        hbars(v.rows.map(function (r) { return [r.e + " · mentioned", r.m / r.n, pct(r.m / r.n)]; }), "var(--accent)");
      var worst = v.rows.slice().sort(function (a, b) { return a.m / a.n - b.m / b.n; })[0];
      if (v.rows.length > 1) h += '<div class="note">Weakest engine: ' + esc(worst.e) + ". Check which sources it cites for your prompts and close those content gaps first.</div>";
    }
    if (!s.items.length || !s.tot) return h + err("Enter brand mention counts as: brand, number.");
    var me = s.items[0];
    return h + '<h4 style="margin:12px 0 6px">AI share of voice</h4><div class="kv"><span>' + esc(me[0]) + ": " + pct(me[1] / s.tot) + "</span><span>Total brand mentions: " + s.tot + "</span>" + (s.bad ? "<span>Skipped lines: " + s.bad + "</span>" : "") + "</div>" +
      hbars(s.items.map(function (x, i) { return [x[0], x[1], x[1] + " (" + pct(x[1] / s.tot) + ")", i === 0 ? "#22C55E" : "#94A3B8"]; }));
  }

  function toolWire(l) {
    var cout = document.getElementById("cout");
    var R = { serp: runSerp, fanout: runFanout, geoscore: runGeo, chunker: runChunk, tech: runTech, sov: runSov };
    function run() { cout.innerHTML = R[l.tool](); }
    var go = document.getElementById("tgo"); if (go) go.onclick = run;
    var ex = document.getElementById("g_ex"); if (ex) ex.onclick = function () { document.getElementById("g_in").value = STRONG; run(); };
    var card = cout.parentElement;
    card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; run(); });
    card.addEventListener("change", function (e) { if (e.target.closest("#cout") || e.target.tagName !== "SELECT") return; run(); });
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
  var KEY = "geo_progress_v1";
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
    var h = '<section class="hero"><div><span class="tag">Free course · about 75 minutes</span><h1 style="margin-top:14px">SEO to GEO: Optimize Content for AI Search</h1>' +
      '<p class="lead">Make your content easy for AI search engines to find, trust and cite.</p>' +
      '<p class="muted" style="margin-top:12px">For marketers, content writers, business owners, students and faculty who publish online, with no technical background needed. Work through six short lessons, each with a teaching video or animated walkthrough, clear notes, a worked example and an interactive tool you can try on your own pages. Then pass the final test to earn your certificate.</p>' +
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
    var mod = MODULES[l.mod - 1], url = (window.GEO_VIDEOS && window.GEO_VIDEOS[id]) || "";
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
    var t1 = '<table><tr><th>Lesson</th><th>Key idea</th><th>Remember</th></tr>' +
      "<tr><td><b>SEO foundations</b></td><td>Crawl → index → rank; helpful, people-first content with E-E-A-T</td><td>No SEO, no GEO: AI features use the search index</td></tr>" +
      "<tr><td><b>How AI search works</b></td><td>Fan-out searches, retrieve passages, generate, cite</td><td>Passages compete, not just pages</td></tr>" +
      "<tr><td><b>What is GEO?</b></td><td>Be retrieved, mentioned and cited in AI answers</td><td>Sources, statistics and quotes help; keyword stuffing does not</td></tr></table>";
    var t2 = '<table><tr><th>Lesson</th><th>Key idea</th><th>Remember</th></tr>' +
      "<tr><td><b>Answer-first, citable content</b></td><td>Question headings, direct answers, self-contained passages, evidence</td><td>Never start a passage with “It” or “This”</td></tr>" +
      "<tr><td><b>Technical GEO</b></td><td>Accessible text, deliberate robots.txt rules, matching structured data</td><td>Training bots ≠ search bots; llms.txt is optional</td></tr>" +
      "<tr><td><b>Measuring AI visibility</b></td><td>Prompt panel, mention and citation rates, share of voice, AI referrals</td><td>Track trends; never manipulate</td></tr></table>";
    var h = '<span class="tag indigo">Module ' + m + ' recap</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + MODULES[m - 1].title + '</h1><p class="muted" style="margin:8px 0 18px">The main ideas from each lesson, on one page.</p>' +
      '<div class="card tscroll">' + (m === 1 ? t1 : t2) + "</div>" +
      '<div class="card" style="margin-top:16px"><h3>Key takeaway</h3><p class="muted" style="margin-top:6px">' + (m === 1 ? "AI search builds on classic search. Earn your place in the index with helpful content, then make your passages the clearest, best-evidenced answers an AI engine can find." : "Write so that any paragraph can be quoted on its own, make your site easy and deliberate for crawlers to access, and measure mentions and citations every month.") + "</p></div>" +
      '<p style="margin-top:20px">' + (m === 1 ? '<a class="btn btn-accent" href="#/lesson/2.1">Start Module 2: Optimising Content for AI Search →</a>' : '<a class="btn btn-sun" href="#/test">Take the final test →</a>') + "</p>";
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
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">SEO to GEO: final test</h1>' +
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
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "GEO-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all six lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">SEO to GEO: Optimize Content for AI Search</h3>' +
      '<p class="muted small" style="margin-top:6px">How AI Search Works · Optimizing Content for AI Search</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
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
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text("SEO to GEO: Optimize Content for AI Search", W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text("How AI Search Works  |  Optimizing Content for AI Search", W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited. Not an accredited qualification.", W / 2, H - 15, { align: "center" });
    sigPng(function (png) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 12.4);
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save("SEO-to-GEO-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option><option value="1">Module 1: How AI search works</option><option value="2">Module 2: Optimising content</option></select></div><div class="grid g2" id="gl"></div>';
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
    var titles = { home: "SEO to GEO: Optimize Content for AI Search", path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || "SEO to GEO: Optimize Content for AI Search") + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();

