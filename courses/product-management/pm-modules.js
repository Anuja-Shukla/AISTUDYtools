/* Product Management course: module content (static, no external services) */
window.PM = window.PM || {};
PM.modules = [
  {
    n: 1, slug: "foundations", title: "Foundations of Product Management", color: "#0D9488",
    short: "What products and product managers are, how PMs work with other teams, and how to think in problems and outcomes.",
    overview: "Product management sits where customer needs, business goals and technology meet. This module defines what a product is, separates product management from project and program management, and walks through what PMs actually do in a typical week. You will learn the habit of product thinking (start with the problem, measure the outcome) and see how the role changes across B2C apps, B2B/SaaS tools, platforms and physical products.",
    outcomes: [
      "Distinguish product, project and program management, and explain where each adds value",
      "Describe the responsibilities and core competencies of a product manager",
      "Explain how a PM works with engineering, design, marketing, sales and leadership",
      "Apply product thinking by restating a feature request as a customer problem and a measurable outcome",
      "Compare how product work differs for B2C, B2B/SaaS, platform and physical products",
      "Map a product to its life-cycle stage and suggest a suitable portfolio decision"
    ],
    topics: [
      { t: "What is a product?", s: ["Products as solutions to customer problems", "Product vs project vs program management", "Digital, physical and service products"] },
      { t: "The product manager's role", s: ["Responsibilities and decision rights", "Core competencies: customer insight, business sense, technical fluency, communication", "A typical week of a PM"] },
      { t: "Working across functions", s: ["Engineering and design (the product trio)", "Marketing, sales and customer support", "Leadership and stakeholders: influence without authority"] },
      { t: "Product thinking", s: ["Problems before solutions", "Outcomes over outputs", "Asking 'why' and 'for whom'"] },
      { t: "Types of products", s: ["B2C apps", "B2B and SaaS", "Platforms and marketplaces", "Physical and service products"] },
      { t: "Life cycle and portfolio", s: ["Introduction, growth, maturity, decline", "Portfolio decisions: invest, maintain, harvest, retire"] },
      { t: "Careers in product", s: ["APM, PM, Senior PM, Group PM, Director/VP Product", "Paths into PM from engineering, consulting, design and business roles"] }
    ],
    notes: [
      { h: "Product, project and program management", p: "<p>A <b>product</b> is anything offered to customers to solve a problem or meet a need, whether an app, a software platform, a packaged good or a service. <b>Product management</b> decides <i>what</i> to build and <i>why</i>, and stays responsible for the product's results over its whole life. <b>Project management</b> delivers a defined piece of work on time, on budget and to scope, and then ends. <b>Program management</b> coordinates several related projects towards a larger goal.</p><p>A simple test: a project has an end date; a product keeps evolving as long as it has customers.</p>" },
      { h: "What a product manager does", p: "<p>The PM is accountable for the product creating value for customers and for the business. In practice that means understanding customers deeply, choosing which problems to solve, setting goals and metrics, writing clear requirements, prioritising the backlog, aligning stakeholders and judging whether a release worked.</p><p>PMs rarely have formal authority over engineers or designers. They lead through clarity, evidence and trust, which is why communication is as important as analysis.</p><p><b>A typical week</b> might include a sprint planning meeting, two customer calls, a review of last week's metrics, a design critique, a roadmap discussion with leadership and time to write or refine a product brief.</p>" },
      { h: "The product trio and cross-functional work", p: "<p>Many teams work as a <b>product trio</b>: a PM, a designer and an engineering lead who decide together. The PM brings the customer problem and business context, the designer brings usability and the experience, and the engineer brings feasibility and technical options.</p><p>Beyond the trio, PMs work with <b>marketing</b> on positioning and launches, with <b>sales</b> and <b>customer support</b> on customer feedback, with <b>finance</b> on pricing and business cases, and with <b>leadership</b> on strategy and investment. A useful mental model is the PM Venn diagram: the PM operates at the overlap of business, technology and user experience.</p>" },
      { h: "Product thinking: problems and outcomes", p: "<p>Stakeholders often arrive with solutions: 'add a chat button', 'build a dark mode'. Product thinking means asking <b>what problem this solves, for whom, and how we will know it worked</b>.</p><p>An <b>output</b> is something the team ships (a feature, a page). An <b>outcome</b> is a change in customer behaviour or business results (more users completing checkout, fewer support calls). Good teams commit to outcomes and treat features as bets that may or may not move them.</p>" },
      { h: "Types of products", p: "<p><b>B2C</b> products (food delivery, payments, social apps) serve large numbers of individual users; decisions lean on behavioural data and experiments. <b>B2B/SaaS</b> products (accounting, CRM, HR software) serve organisations, where the buyer, the user and the approver may be different people, and sales cycles are longer. <b>Platforms and marketplaces</b> connect two or more sides (buyers and sellers, riders and drivers) and must balance the needs of each side. <b>Physical products</b> have manufacturing lead times, inventory and unit costs, so iteration is slower and mistakes are costlier.</p>" },
      { h: "Product life cycle and portfolio decisions", p: "<p>Products typically move through <b>introduction</b>, <b>growth</b>, <b>maturity</b> and <b>decline</b>. In introduction the focus is learning and product–market fit; in growth, scaling and reliability; in maturity, efficiency, retention and new segments; in decline, harvesting or retiring.</p><p>Companies with several products make <b>portfolio</b> choices: invest in growth bets, maintain cash generators, and sunset products that no longer earn their cost.</p>" },
      { h: "Careers in product management", p: "<p>Common titles are Associate Product Manager (APM), Product Manager, Senior PM, Group PM (managing other PMs) and Director or VP of Product. People move into product from engineering, design, consulting, analytics, marketing and business roles, and MBA programmes are a common route. Strong PMs combine curiosity about customers, comfort with numbers, basic technical fluency and clear writing.</p>" }
    ],
    examples: [
      { t: "Food delivery app (illustrative)", p: "A food delivery app's PM receives a request to add more restaurant filters. Product thinking reframes it: the real problem may be that users struggle to decide quickly. The outcome to move is 'time from opening the app to placing an order', and filters are one of several possible solutions alongside better recommendations or reorder shortcuts." },
      { t: "UPI payments apps", p: "Apps built on India's UPI rails (such as PhonePe, Google Pay and Paytm) all use the same underlying payment network. Their product teams differentiate through the experience: speed, reliability, rewards, bill payments and merchant tools. This shows how product decisions, not just technology, shape which product customers choose." },
      { t: "Physical product: a consumer appliance", p: "For an appliance maker, a 'feature' such as an extra wash cycle involves tooling, supplier changes and inventory. The PM must validate demand before committing, because unlike software it cannot be quietly rolled back after launch." }
    ],
    activity: { t: "Product teardown", steps: ["Pick a familiar Indian or global app (for example a food delivery, payments or ride-hailing app).", "Write the main customer problem it solves in one sentence.", "List its key user groups (for a marketplace, each side).", "Name two outcomes the product is designed to drive (for example repeat orders, successful payments).", "Suggest one feature you would change and the outcome you would expect it to move."], deliverable: "A one-page teardown shared in class (5 minutes per group)." },
    assessment: "Short individual teardown (one page) plus a class discussion on outputs vs outcomes.",
    practical: "Analyse a familiar Indian or global app and identify the customer problem it solves, its users, and the outcomes it is designed to drive.",
    glossary: ["Product manager", "Product thinking", "Outcome vs output", "Product trio", "Product life cycle", "Stakeholder", "B2B / SaaS", "Platform / marketplace"],
    tools: ["problem", "metrics"],
    check: [
      { q: "A sales head asks the PM to 'add an export-to-Excel button'. What is the best first response?", o: ["Ask what the customer is trying to do with the exported data", "Add it to the next sprint because sales asked", "Reject it because it is a solution, not a problem", "Ask engineering for an estimate"], a: 0, e: "Product thinking starts with the underlying problem. The export may be the right answer, but understanding the job behind it may reveal a better solution." },
      { q: "Which is an outcome rather than an output?", o: ["20% more users complete checkout", "A redesigned checkout page", "Three new payment options", "A faster checkout API"], a: 0, e: "An outcome is a change in behaviour or results. The others are things the team ships." },
      { q: "What most clearly distinguishes product management from project management?", o: ["Product management owns what to build and the results over the product's life", "Product managers use Gantt charts", "Project managers talk to customers", "Product management ends at launch"], a: 0, e: "Projects end once delivered; product management stays accountable for whether the product creates value." }
    ]
  },
  {
    n: 2, slug: "discovery", title: "Product Discovery and Customer Insight", color: "#2563EB",
    short: "Find and frame real customer problems, research users, size the market and test ideas cheaply before building.",
    overview: "Most failed products solve a problem nobody has, or solve it in a way customers don't want. Discovery reduces that risk. This module covers framing problem statements, choosing research methods, Jobs-to-be-Done, personas and journey maps, opportunity solution trees, market sizing with TAM, SAM and SOM, competitive analysis and low-cost ways to validate ideas before writing code.",
    outcomes: [
      "Write a clear, testable problem statement for a target customer",
      "Choose a suitable research method (interviews, surveys, observation, usability tests, analytics) for a given question",
      "Express customer needs as Jobs-to-be-Done statements and journey maps",
      "Build an opportunity solution tree and identify the riskiest assumption",
      "Estimate a market using TAM, SAM and SOM with a bottom-up calculation",
      "Design a low-cost validation test such as a fake-door or concierge MVP"
    ],
    topics: [
      { t: "Problem discovery", s: ["Framing problem statements", "Separating symptoms from root causes"] },
      { t: "User research methods", s: ["Interviews and surveys", "Observation and contextual inquiry", "Usability tests", "Product analytics"] },
      { t: "Understanding customers", s: ["Jobs-to-be-Done and pain points", "Personas and empathy maps", "Customer journey maps"] },
      { t: "Opportunities and assumptions", s: ["Opportunity solution trees", "Desirability, viability, feasibility and usability risks", "Assumption testing"] },
      { t: "Market sizing", s: ["TAM, SAM and SOM", "Top-down vs bottom-up estimates"] },
      { t: "Competition and differentiation", s: ["Direct, indirect and substitute competitors", "Finding a point of difference"] },
      { t: "Validating ideas cheaply", s: ["Fake-door tests and landing pages", "Concierge and Wizard-of-Oz MVPs", "Prototypes"] }
    ],
    notes: [
      { h: "Framing the problem", p: "<p>A good problem statement names <b>who</b> has the problem, <b>what</b> they are trying to do, <b>what gets in the way</b>, and <b>why it matters</b>. It does not mention a solution. Example: 'First-time investors in tier-2 cities want to start a small monthly investment but abandon sign-up because KYC steps are confusing, so they delay investing for months.'</p><p>Use the double-diamond model: <b>discover</b> (go wide on the problem space), <b>define</b> (converge on one problem), <b>develop</b> (go wide on solutions), <b>deliver</b> (converge on what to build).</p>" },
      { h: "Choosing research methods", p: "<p><b>Interviews</b> reveal motivations and context (the 'why'); ask about past behaviour, not hypothetical future intentions. <b>Surveys</b> measure how common something is across many people (the 'how many'). <b>Observation</b> shows what people actually do, which often differs from what they say. <b>Usability tests</b> check whether people can complete a task with a design. <b>Analytics</b> show what users do at scale but not why.</p><p>Combine qualitative and quantitative methods: analytics may show where users drop off; interviews explain the reason.</p>" },
      { h: "Jobs-to-be-Done, personas and journeys", p: "<p><b>Jobs-to-be-Done (JTBD)</b> describes the progress a customer wants to make in a situation: 'When I ___, I want to ___, so I can ___.' It focuses on the job, not demographics. <b>Personas</b> are evidence-based profiles of key user types; <b>empathy maps</b> capture what users say, think, do and feel. A <b>customer journey map</b> lays out the stages a customer goes through, their actions, emotions and pain points at each stage, which shows where to intervene.</p>" },
      { h: "Opportunity solution trees and assumptions", p: "<p>An <b>opportunity solution tree</b> starts with a desired <b>outcome</b> at the top, branches into customer <b>opportunities</b> (needs and pain points), then into possible <b>solutions</b>, and finally into <b>experiments</b> that test them. It keeps teams from jumping to the first idea.</p><p>Every solution rests on assumptions about four risks: <b>desirability</b> (do they want it?), <b>viability</b> (does it work for the business?), <b>feasibility</b> (can we build it?) and <b>usability</b> (can they use it?). Test the riskiest assumption first.</p>" },
      { h: "Market sizing: TAM, SAM and SOM", p: "<p><b>TAM</b> (total addressable market) is the total demand if you served everyone who could use the product. <b>SAM</b> (serviceable addressable market) is the part you can realistically reach with your product and channels. <b>SOM</b> (serviceable obtainable market) is the share you can plausibly win in the next few years.</p><p><b>Top-down</b> sizing starts from a large published figure and narrows it. <b>Bottom-up</b> sizing multiplies number of target customers × purchase frequency × price, and is usually more credible because each assumption can be checked. Example (illustrative): 20,000 gyms in target cities × ₹3,000 per month × 12 months = ₹72 crore per year SAM for a gym-management tool.</p>" },
      { h: "Competition and differentiation", p: "<p>Look beyond direct competitors. <b>Indirect</b> competitors solve the same job differently, and <b>substitutes</b> include doing nothing, spreadsheets, WhatsApp groups or hiring someone. A competitive analysis compares target customers, key features, pricing, strengths and weaknesses, and asks where you can be meaningfully different for a specific segment.</p>" },
      { h: "Validating ideas cheaply", p: "<p>Before building, test demand with the cheapest experiment that gives a real signal. A <b>fake-door test</b> shows a button or menu item for a feature that does not exist yet and counts clicks. A <b>landing page</b> describes the offer and measures sign-ups. A <b>concierge MVP</b> delivers the service manually to a few customers. A <b>Wizard-of-Oz MVP</b> looks automated to the user but is run by people behind the scenes. Always be transparent and respectful with users in these tests.</p>" }
    ],
    examples: [
      { t: "Meesho and tier-2 customers", p: "Meesho grew by focusing on small resellers and value-conscious buyers beyond India's largest metros, a segment many e-commerce players under-served at the time. The product lesson: discovery that targets a specific, overlooked customer group can reveal needs (low prices, social selling, vernacular support) that general-purpose products miss." },
      { t: "Concierge MVP (illustrative)", p: "A team exploring a meal-planning service for working parents first creates weekly plans by hand for 15 families over WhatsApp. Within four weeks they learn which recipes families actually cook and whether they would pay, before building any software." }
    ],
    activity: { t: "Interview sprint", steps: ["Pick a target customer and a problem area (for example students managing monthly expenses).", "Write a 6-question interview guide focused on past behaviour.", "Conduct three 15-minute interviews.", "Synthesise insights into one JTBD statement and a 5-stage journey map with pain points.", "Estimate the market bottom-up (number of customers × frequency × price) and state your assumptions."], deliverable: "A one-page insight summary with JTBD, journey map and market estimate." },
    assessment: "Insight report from three interviews, graded on evidence quality and clarity of the JTBD and sizing assumptions.",
    practical: "Conduct three short customer interviews, synthesise the insights into a JTBD statement and a journey map, and estimate the market size bottom-up.",
    glossary: ["Jobs-to-be-Done (JTBD)", "Persona", "Empathy map", "Customer journey map", "Opportunity solution tree", "TAM / SAM / SOM", "Value proposition", "Fake-door test", "Concierge MVP", "Wizard-of-Oz MVP", "Usability testing", "Double diamond"],
    tools: ["problem", "interview", "persona", "jtbd", "lean"],
    check: [
      { q: "You want to know WHY users abandon onboarding at step 3. Which method fits best?", o: ["Interviews or usability tests with users who dropped off", "A large survey about app satisfaction", "Counting downloads", "Competitor pricing analysis"], a: 0, e: "Analytics shows where users drop off; qualitative methods such as interviews and usability tests explain why." },
      { q: "A city has 5,000 coaching centres; you can reach 2,000 of them, each would pay ₹2,000 per month. What is the annual SAM?", o: ["₹4.8 crore", "₹1.2 crore", "₹40 lakh", "₹12 crore"], a: 0, e: "2,000 × ₹2,000 × 12 = ₹4,80,00,000 = ₹4.8 crore. (₹12 crore would use all 5,000 centres, which is closer to TAM.)" },
      { q: "Which is a well-formed Jobs-to-be-Done statement?", o: ["When I travel for work, I want to file expenses in minutes so I can get reimbursed quickly", "Users aged 25–35 who like travel", "Build an expense app with OCR", "Our app has the best UI"], a: 0, e: "A JTBD names the situation, the motivation and the desired outcome, without prescribing a solution." }
    ]
  },
  {
    n: 3, slug: "strategy", title: "Product Strategy, Vision, and Prioritisation", color: "#7C3AED",
    short: "Set a vision and strategy, choose the right metrics, prioritise with frameworks and build roadmaps stakeholders trust.",
    overview: "With many possible problems to solve and limited people, strategy is about choosing. This module covers product vision, mission and strategy, product–market fit, North Star and input metrics, OKRs, prioritisation frameworks (RICE, MoSCoW, Kano, value vs effort, cost of delay), outcome-based roadmaps, stakeholder management and build-buy-partner decisions.",
    outcomes: [
      "Write a product vision and a strategy that states target customers, focus and trade-offs",
      "Identify signals of product–market fit and propose ways to measure it",
      "Define a North Star metric with supporting input metrics and OKRs",
      "Prioritise a backlog using RICE and compare the result with MoSCoW and Kano",
      "Build a Now–Next–Later roadmap and explain it to stakeholders",
      "Evaluate a build, buy or partner decision"
    ],
    topics: [
      { t: "Vision, mission and strategy", s: ["Vision: the future you want to create", "Strategy: where to play and how to win", "Saying what you will not do"] },
      { t: "Product–market fit", s: ["Qualitative and quantitative signals", "Retention as the strongest signal", "The 'very disappointed' survey"] },
      { t: "Metrics and goals", s: ["North Star metric", "Input metrics", "OKRs for product teams"] },
      { t: "Prioritisation frameworks", s: ["RICE", "MoSCoW", "Kano model", "Value vs effort", "Cost of delay"] },
      { t: "Roadmaps", s: ["Outcome-based vs feature-based", "Now–Next–Later", "Communicating uncertainty"] },
      { t: "Stakeholders and trade-offs", s: ["Stakeholder mapping", "Saying no with evidence", "Handling escalations"] },
      { t: "Build, buy or partner", s: ["Core vs context", "Total cost and speed", "Risks of dependency"] }
    ],
    notes: [
      { h: "Vision, mission and strategy", p: "<p>A <b>vision</b> describes the future the product aims to create for customers, usually several years out. A <b>mission</b> describes the purpose of the team today. A <b>strategy</b> is a set of choices about <b>which customers</b> to serve, <b>which problems</b> to focus on, and <b>how</b> the product will win, including what the team will deliberately not do. Without explicit trade-offs, a strategy is just a wish list.</p>" },
      { h: "Product–market fit", p: "<p>Product–market fit (PMF) means a product satisfies a strong demand in a specific market. Signals include users coming back without being pushed (retention curves that flatten rather than fall to zero), organic word of mouth, customers complaining when the product is down, and sales cycles getting shorter. A commonly used survey asks users how they would feel if they could no longer use the product; a high share answering 'very disappointed' suggests strong fit. PMF is found for a segment first, not for everyone at once.</p>" },
      { h: "North Star metric, input metrics and OKRs", p: "<p>A <b>North Star metric</b> captures the core value customers get from the product, and tends to predict long-term business results. For a food delivery app it might be weekly orders delivered on time; for a collaboration tool, weekly active teams. <b>Input metrics</b> are the levers teams can move directly, such as new-user activation, order frequency or delivery time.</p><p><b>OKRs</b> (Objectives and Key Results) turn this into goals: an inspiring objective with 2–4 measurable key results, such as 'Make first orders effortless' with key results 'Raise first-week order rate from 30% to 40%' and 'Cut sign-up time to under 60 seconds'.</p>" },
      { h: "Prioritisation frameworks", p: "<p><b>RICE</b> scores each item as (Reach × Impact × Confidence) ÷ Effort. Reach is how many users it affects in a period, Impact uses a scale (0.25 minimal to 3 massive), Confidence is a percentage reflecting evidence, and Effort is person-months. Higher scores suggest more value per unit of effort.</p><p><b>MoSCoW</b> sorts scope into Must have, Should have, Could have and Won't have (this time); useful for a fixed release. The <b>Kano model</b> classifies features as basic (expected; absence causes dissatisfaction), performance (more is better) and delighters (unexpected; cause delight). <b>Value vs effort</b> plots items on a 2×2 to find quick wins. <b>Cost of delay</b> asks how much value is lost per week of waiting, which helps sequence work.</p><p>Frameworks structure the conversation; they do not replace judgement about strategy, dependencies and risk.</p>" },
      { h: "Roadmaps", p: "<p>A <b>feature-based roadmap</b> lists features with dates, which invites false certainty. An <b>outcome-based roadmap</b> lists problems to solve and outcomes to move, leaving room to discover the best solution. The <b>Now–Next–Later</b> format groups work by time horizon: Now (committed, well understood), Next (likely, being explored), Later (directional). Confidence falls as you move right, and the roadmap is updated as you learn.</p>" },
      { h: "Stakeholders and saying no", p: "<p>Map stakeholders by influence and interest, and involve them early. When saying no, explain the strategy and the evidence, show what would have to be dropped to say yes, and offer an alternative (a smaller version, a later slot, or a workaround). Decisions are easier to accept when the criteria were agreed in advance.</p>" },
      { h: "Build, buy or partner", p: "<p><b>Build</b> when the capability is core to your differentiation and you need control. <b>Buy</b> (use a vendor or tool) when it is standard and speed matters, such as payments, messaging or analytics. <b>Partner</b> when another company already serves the customer need and both sides benefit. Compare total cost of ownership, time to market, quality, data ownership and the risk of depending on a third party.</p>" }
    ],
    examples: [
      { t: "North Star choices (illustrative)", p: "A music streaming product might choose 'time spent listening by active users' as its North Star, while a fintech savings app might choose 'number of users with an active recurring investment'. Both reflect repeated customer value rather than downloads or sign-ups, which can rise without real engagement." },
      { t: "RICE in practice (illustrative)", p: "A learning app compares 'offline downloads' (Reach 8,000, Impact 2, Confidence 80%, Effort 4) with 'leaderboards' (Reach 20,000, Impact 0.5, Confidence 50%, Effort 2). Offline downloads scores 3,200; leaderboards scores 2,500. The team still checks strategy: if the goal this quarter is retention in low-connectivity regions, the ranking makes sense."}
    ],
    activity: { t: "Prioritise and roadmap", steps: ["Use the sample backlog in the Product Toolkit RICE calculator (or ten requests from your own product).", "Agree the scoring scales as a team, then score every item.", "Compare the RICE ranking with your gut ranking and discuss differences.", "Place items into a Now–Next–Later roadmap linked to one outcome each.", "Role-play: defend the roadmap to a sales head who wants a different feature first."], deliverable: "RICE table, Now–Next–Later roadmap and a 3-minute stakeholder pitch." },
    assessment: "Group roadmap presentation, graded on the logic linking strategy, scores and sequencing.",
    practical: "Prioritise a backlog of ten feature requests using RICE (with the portal's calculator), then build a Now–Next–Later roadmap and defend it to stakeholders.",
    glossary: ["Product vision", "Product strategy", "Product–market fit", "North Star metric", "OKR", "Roadmap", "RICE", "MoSCoW", "Kano model", "Cost of delay", "Backlog", "Stakeholder"],
    tools: ["rice", "metrics"],
    check: [
      { q: "Feature A: Reach 1,000, Impact 2, Confidence 50%, Effort 2. What is its RICE score?", o: ["500", "1,000", "2,000", "250"], a: 0, e: "(1,000 × 2 × 0.5) ÷ 2 = 500." },
      { q: "Which is the best North Star metric for a ride-hailing app?", o: ["Completed rides per week", "App downloads", "Number of features shipped", "Marketing spend"], a: 0, e: "Completed rides reflect value delivered to both riders and drivers, and track long-term success better than downloads." },
      { q: "In the Kano model, a hotel room with no clean towels shows a missing…", o: ["Basic (must-be) feature", "Delighter", "Performance feature", "Indifferent feature"], a: 0, e: "Basic features are expected; their absence causes strong dissatisfaction, while their presence is taken for granted." }
    ]
  },
  {
    n: 4, slug: "delivery", title: "Product Design, Development, and Delivery", color: "#EA580C",
    short: "Turn decisions into clear requirements, usable designs and working software with agile teams.",
    overview: "Good ideas still fail if requirements are unclear, designs are hard to use or delivery is chaotic. This module covers PRDs and one-page briefs, user stories and acceptance criteria, MVP and MLP thinking, UX fundamentals, agile ways of working (Scrum and Kanban), collaborating with engineers, quality and accessibility, and the special considerations of building AI-powered features.",
    outcomes: [
      "Write a one-page PRD that states the problem, goals, scope and success metrics",
      "Write user stories with testable acceptance criteria and a definition of done",
      "Scope an MVP or MLP for a feature and plan iterative releases",
      "Apply basic usability principles to critique a wireframe or prototype",
      "Explain how Scrum and Kanban teams plan, deliver and improve",
      "Identify accessibility, technical-debt and AI-specific risks in a feature plan"
    ],
    topics: [
      { t: "Requirements", s: ["Product requirements documents (PRDs)", "One-page product briefs"] },
      { t: "User stories", s: ["Story format", "Acceptance criteria", "Definition of done"] },
      { t: "MVP, MLP and iteration", s: ["Minimum viable product", "Minimum lovable product", "Iterative and incremental releases"] },
      { t: "UX fundamentals", s: ["Usability heuristics", "Information architecture", "Wireframes and prototypes"] },
      { t: "Agile delivery", s: ["Scrum: sprints, planning, stand-ups, reviews, retrospectives", "Kanban: flow and work-in-progress limits", "Backlog refinement"] },
      { t: "Working with engineers", s: ["Estimation", "Technical debt", "APIs at a conceptual level"] },
      { t: "Quality and inclusion", s: ["Testing and quality", "Accessibility and inclusive design"] },
      { t: "AI-powered features", s: ["Data needs", "Evaluating quality", "Managing uncertainty and errors"] }
    ],
    notes: [
      { h: "PRDs and one-page briefs", p: "<p>A <b>product requirements document (PRD)</b> aligns the team on what is being built and why. A good PRD covers: the problem and evidence, target users, goals and success metrics, scope (in and out), user stories or key flows, design links, dependencies, risks and open questions. Many teams prefer a <b>one-page brief</b> early on, expanding detail only as decisions firm up. The PRD explains the 'what' and 'why'; the team decides the 'how' together.</p>" },
      { h: "User stories and acceptance criteria", p: "<p>A <b>user story</b> follows the form: 'As a [type of user], I want [goal] so that [benefit].' Each story needs <b>acceptance criteria</b>, testable conditions that tell the team when the story works, often written as Given / When / Then. Example: 'Given I have items in my cart, when I apply a valid coupon, then the discount appears before payment.' The <b>definition of done</b> is the team-wide checklist every item must meet, such as code reviewed, tested, accessible and released behind a flag.</p>" },
      { h: "MVP, MLP and iterative releases", p: "<p>An <b>MVP</b> (minimum viable product) is the smallest thing that lets you learn whether you are solving the right problem. It is a learning tool, not a low-quality product. An <b>MLP</b> (minimum lovable product) adds enough polish that early users enjoy it, which matters in crowded consumer markets. Release in small slices, ideally each delivering end-to-end value, and use feature flags to roll out gradually and roll back safely.</p>" },
      { h: "UX fundamentals", p: "<p>Usability heuristics include: keep users informed of system status, match the real world in language, give users control and easy undo, be consistent, prevent errors, prefer recognition over recall and keep designs minimal. <b>Information architecture</b> organises content and navigation so users can find things. <b>Wireframes</b> are low-fidelity layouts for structure; <b>prototypes</b> are clickable simulations used to test flows with users before building.</p>" },
      { h: "Agile, Scrum and Kanban", p: "<p><b>Agile</b> is a mindset of delivering in small increments and learning from feedback. <b>Scrum</b> uses fixed-length <b>sprints</b> (often two weeks) with sprint planning, daily stand-ups, a sprint review (demo) and a retrospective (how to improve). The PM, often in a product owner role, keeps the backlog ordered and refined. <b>Kanban</b> visualises work on a board and limits work in progress to improve flow, without fixed sprints; it suits support and operations work.</p>" },
      { h: "Working with engineers", p: "<p>Engineers estimate effort, often in story points or days; estimates are uncertain, so plan with ranges. <b>Technical debt</b> is the future cost of shortcuts taken now; some debt is a sensible trade-off, but it must be repaid or it slows the team. An <b>API</b> is a defined way for software systems to talk to each other; PMs should understand which systems a feature touches and which external services it depends on, without designing them.</p>" },
      { h: "Quality, accessibility and inclusive design", p: "<p>Quality includes reliability, performance and security as well as features. <b>Accessibility</b> means people with disabilities can use the product: sufficient colour contrast, text alternatives for images, keyboard navigation, captions and screen-reader support. <b>Inclusive design</b> also considers low-end phones, patchy connectivity, low digital literacy and regional languages, which matter greatly for products serving India beyond the metros.</p>" },
      { h: "Building AI-powered features", p: "<p>AI features behave probabilistically, so the PM must plan for errors. Key questions: What <b>data</b> trains or grounds the model, and is it representative and lawfully used? How will we <b>evaluate</b> quality (test sets, human review, user feedback)? What happens when the model is wrong, and can users correct it? How do we communicate uncertainty, protect privacy and monitor for bias after launch? Start with narrow, high-value use cases and keep a human in the loop where mistakes are costly.</p>" }
    ],
    examples: [
      { t: "Writing acceptance criteria (illustrative)", p: "Story: 'As a first-time user, I want to log in with my phone number so I don't have to remember a password.' Acceptance criteria: OTP arrives within 30 seconds; user can request a new OTP after 30 seconds; after 5 wrong attempts the account is locked for 15 minutes with a clear message; the flow works on a basic Android phone." },
      { t: "Inclusive design for low connectivity", p: "Several Indian apps offer 'lite' versions or smaller downloads for users with limited storage and data. The product lesson: designing for constraints such as low bandwidth and older devices can widen the market rather than limit the experience." }
    ],
    activity: { t: "One-page PRD and wireframes", steps: ["Choose an MVP feature (for example 'split a bill with friends' in a payments app).", "Write a one-page PRD using the Toolkit template.", "Write five user stories with acceptance criteria.", "Sketch low-fidelity wireframes for the main flow (paper is fine).", "Peer-review another team's PRD against the usability heuristics."], deliverable: "One-page PRD, five user stories and 3–5 wireframe sketches." },
    assessment: "PRD and user-story submission, graded on clarity, testability and scope discipline.",
    practical: "Write a one-page PRD with five user stories and acceptance criteria for an MVP feature, and sketch low-fidelity wireframes.",
    glossary: ["PRD", "User story", "Acceptance criteria", "Definition of done", "MVP", "MLP", "Agile", "Scrum", "Sprint", "Kanban", "Technical debt", "Wireframe", "Prototype", "Accessibility", "Feature flag", "API"],
    tools: ["prd", "story"],
    check: [
      { q: "Which is a testable acceptance criterion?", o: ["Given a valid coupon, when applied, then the discount shows before payment", "The checkout should be user-friendly", "Coupons should work well", "Make the discount clear"], a: 0, e: "Acceptance criteria must be specific and verifiable. 'User-friendly' cannot be tested as written." },
      { q: "What is the main purpose of an MVP?", o: ["To learn whether you are solving the right problem with the least effort", "To launch a cheap, low-quality product", "To include every requested feature", "To avoid talking to customers"], a: 0, e: "An MVP is a learning tool: the smallest thing that tests the riskiest assumptions." },
      { q: "A team keeps skipping tests to hit deadlines and releases now take longer every sprint. This is a sign of…", o: ["Growing technical debt", "Product–market fit", "A good definition of done", "Kanban working well"], a: 0, e: "Shortcuts accumulate as technical debt, which slows future delivery until it is repaid." }
    ]
  },
  {
    n: 5, slug: "growth", title: "Launch, Growth, and Product Analytics", color: "#DB2777",
    short: "Launch products well, price them, measure what matters with analytics and experiments, and grow responsibly.",
    overview: "Shipping is the start, not the end. This module covers go-to-market planning, pricing and packaging, the AARRR funnel, product analytics (DAU/MAU, activation, retention curves, cohorts, churn), A/B testing and its pitfalls, product-led growth and growth loops, managing features through their life cycle, and responsible product management.",
    outcomes: [
      "Build a go-to-market and launch plan for a new feature or product",
      "Compare pricing models (freemium, subscription, tiered, usage-based) for a given product",
      "Diagnose a growth problem using the AARRR funnel",
      "Calculate and interpret activation, retention, churn, conversion and DAU/MAU",
      "Design an A/B test with a hypothesis, primary metric and success criteria, and spot common pitfalls",
      "Identify dark patterns and privacy risks and propose responsible alternatives"
    ],
    topics: [
      { t: "Go-to-market", s: ["Target segment and positioning", "Channels and launch tiers", "Launch checklist"] },
      { t: "Pricing and packaging", s: ["Freemium", "Subscription", "Tiered", "Usage-based"] },
      { t: "The AARRR funnel", s: ["Acquisition, Activation, Retention, Referral, Revenue"] },
      { t: "Product analytics", s: ["DAU/MAU and stickiness", "Activation rate", "Retention curves and cohorts", "Churn"] },
      { t: "Experimentation", s: ["A/B test design", "Statistical significance", "Common pitfalls"] },
      { t: "Product-led growth", s: ["Onboarding", "Growth loops", "Self-serve conversion"] },
      { t: "Life-cycle management", s: ["Iterating", "Sunsetting features"] },
      { t: "Responsible product management", s: ["Privacy and data protection", "Dark patterns", "Ethics and digital inclusion"] }
    ],
    notes: [
      { h: "Go-to-market and launch", p: "<p>A <b>go-to-market (GTM)</b> plan answers: who is the target segment, what is the positioning (why us, versus alternatives), which channels will reach them, how will we price it, and how will sales, support and marketing be ready. Not every release needs a big launch: many teams use <b>launch tiers</b>, from a quiet release behind a feature flag to a full campaign. A launch checklist covers readiness of the product, support, documentation, analytics, legal review and communication.</p>" },
      { h: "Pricing and packaging", p: "<p><b>Freemium</b> offers a free tier and charges for advanced features; it lowers adoption barriers but needs a clear upgrade reason. <b>Subscription</b> charges a recurring fee for ongoing value. <b>Tiered</b> pricing packages features for different segments (basic, pro, enterprise). <b>Usage-based</b> pricing charges by consumption (transactions, messages, storage), aligning cost with value. Packaging decides which features go in which tier. Test willingness to pay with customers rather than guessing.</p>" },
      { h: "The AARRR funnel", p: "<p>The AARRR or 'pirate metrics' funnel breaks growth into stages: <b>Acquisition</b> (users arrive), <b>Activation</b> (they experience the core value for the first time, the 'aha' moment), <b>Retention</b> (they come back), <b>Referral</b> (they bring others) and <b>Revenue</b> (they pay). Measuring conversion between stages shows where the biggest leak is. Fixing activation or retention usually matters more than buying more acquisition.</p>" },
      { h: "Product analytics", p: "<p><b>DAU/MAU</b> (daily active users divided by monthly active users) measures stickiness: 0.5 means the average monthly user is active about half the days. <b>Activation rate</b> = users who reach the aha moment ÷ users who signed up. <b>Retention</b> at day N = users from a cohort active on day N ÷ users in that cohort. A <b>cohort</b> is a group of users who started in the same period; comparing cohorts shows whether changes improved retention. <b>Churn</b> is the share of users or customers who stop in a period. A healthy retention curve flattens; a curve heading to zero signals weak product–market fit.</p>" },
      { h: "A/B testing and its pitfalls", p: "<p>An <b>A/B test</b> randomly splits users between a control (A) and a variant (B) and compares a pre-chosen <b>primary metric</b>. Write a hypothesis first: 'Showing delivery time on the menu will increase order conversion because users worry about late food.' Decide the minimum effect worth detecting, the sample size and the test duration in advance.</p><p><b>Statistical significance</b> indicates the observed difference is unlikely to be due to chance alone. Common pitfalls: stopping the test as soon as results look good ('peeking'), testing too many metrics and picking the winner, too-small samples, novelty effects, and ignoring guardrail metrics such as cancellations or complaints.</p>" },
      { h: "Product-led growth and growth loops", p: "<p><b>Product-led growth (PLG)</b> uses the product itself to acquire, activate and convert users, through free trials, freemium tiers and self-serve upgrades. <b>Onboarding</b> should get new users to value quickly. A <b>growth loop</b> is a cycle where output from one user brings in new users, for example a user shares a document, the recipient signs up to view it, and then shares their own.</p>" },
      { h: "Iteration and sunsetting", p: "<p>After launch, compare results with the success criteria, talk to users and iterate. Features that are rarely used still carry costs: maintenance, complexity and support. <b>Sunsetting</b> a feature requires data on usage, a plan for affected users (alternatives, data export, notice period) and clear communication.</p>" },
      { h: "Responsible product management", p: "<p><b>Dark patterns</b> are designs that trick users into choices they would not otherwise make: hidden costs, pre-ticked consents, 'confirmshaming' and hard-to-cancel subscriptions. India's consumer protection authority has issued guidelines identifying such practices, and the Digital Personal Data Protection Act, 2023 sets rules for processing personal data, including consent. Beyond compliance, trust is a long-term asset: collect only the data you need, explain clearly, make cancellation as easy as sign-up, and design for inclusion across languages, devices and abilities.</p>" }
    ],
    examples: [
      { t: "Freemium productivity tools", p: "Many collaboration and design tools offer a free tier for individuals and charge teams for admin controls, more storage or advanced features. The free tier drives adoption; the paid tier is packaged around what teams need, which is a product decision, not just a pricing one." },
      { t: "Diagnosing a launch (illustrative)", p: "A new 'scheduled orders' feature gets many first-time uses but repeat use falls sharply after week one. Cohort analysis shows the drop-off is concentrated among users whose first scheduled order arrived late. The fix is operational reliability, not more promotion." }
    ],
    activity: { t: "Launch plan and dashboard", steps: ["Pick a new feature (for example 'subscribe and save' for a grocery app).", "Write a GTM summary: segment, positioning, channels, pricing and launch tier.", "Define a metrics dashboard: one North Star, AARRR metrics and guardrails.", "Design one A/B test with hypothesis, primary metric, minimum effect, sample and duration.", "List two dark patterns you will avoid and the alternative you will use."], deliverable: "Launch plan (one page) with dashboard outline and A/B test plan." },
    assessment: "Launch plan and experiment design, graded on metric choice, test rigour and ethical safeguards.",
    practical: "Design a launch plan and a metrics dashboard for a new feature, including one A/B test with a hypothesis, primary metric and success criteria.",
    glossary: ["Go-to-market (GTM)", "Freemium", "Product-led growth (PLG)", "AARRR", "Activation", "Retention", "Churn", "Cohort analysis", "DAU/MAU", "A/B test", "Statistical significance", "Dark pattern", "Growth loop", "Conversion rate"],
    tools: ["ab", "launch", "metrics"],
    check: [
      { q: "1,000 users signed up in January; 250 were still active on day 30. What is the day-30 retention for this cohort?", o: ["25%", "75%", "4%", "250%"], a: 0, e: "250 ÷ 1,000 = 25%. (75% would be the share who were not retained.)" },
      { q: "A team stops its A/B test on day 2 because the variant is ahead. What is the main risk?", o: ["The early lead may be due to chance (peeking)", "The test was too long", "The control group was too small by design", "No risk if the lead is large"], a: 0, e: "Stopping early when results look good inflates false positives. Decide sample size and duration in advance." },
      { q: "Which is a dark pattern?", o: ["A cancel button hidden behind five screens of offers", "A clear price breakdown before payment", "An easy one-click unsubscribe", "Asking for consent with an unticked checkbox"], a: 0, e: "Making cancellation deliberately hard manipulates users; responsible design makes cancellation as easy as sign-up." }
    ]
  }
];
