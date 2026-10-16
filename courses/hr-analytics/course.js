/* HR Analytics — course content and app (no external services; progress saved in localStorage) */
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
  function num(x) { return Math.round(x).toLocaleString("en-IN"); }
  function box(text, kind) { return '<div class="pbox ' + (kind || "") + '">' + esc(text) + "</div>"; }
  function tbl(head, rows) { return '<div class="tscroll"><table><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }
  function pct(x, d) { var m = Math.pow(10, d === undefined ? 1 : d); return String(Math.round(x * 100 * m) / m) + "%"; }
  function hbars(items, color) { /* items: [label, value, display] */
    var mx = Math.max.apply(null, items.map(function (i) { return i[1]; })) || 1;
    return '<div style="display:grid;gap:6px">' + items.map(function (i) { return '<div><div class="small" style="display:flex;justify-content:space-between;gap:8px"><b>' + esc(i[0]) + "</b><span>" + (i[2] !== undefined ? i[2] : fmt(i[1])) + '</span></div><div class="bar" style="height:12px"><i style="width:' + Math.max(1, i[1] / mx * 100) + "%;background:" + (color || "var(--accent)") + '"></i></div></div>'; }).join("") + "</div>";
  }

  /* ---- basic statistics ---- */
  var S = {
    sum: function (a) { return a.reduce(function (s, x) { return s + x; }, 0); },
    mean: function (a) { return S.sum(a) / a.length; },
    sorted: function (a) { return a.slice().sort(function (x, y) { return x - y; }); },
    median: function (a) { var s = S.sorted(a), n = s.length, m = Math.floor(n / 2); return n % 2 ? s[m] : (s[m - 1] + s[m]) / 2; },
    modes: function (a) { var c = {}, mx = 0; a.forEach(function (x) { c[x] = (c[x] || 0) + 1; if (c[x] > mx) mx = c[x]; }); if (mx === 1) return []; return Object.keys(c).filter(function (k) { return c[k] === mx; }).map(Number).sort(function (x, y) { return x - y; }); },
    sd: function (a) { var m = S.mean(a); return Math.sqrt(S.sum(a.map(function (x) { return (x - m) * (x - m); })) / a.length); },
    fit: function (y) { /* least-squares line y = a + b·t with t = 1..n */
      var n = y.length, tx = 0, ty = 0, txy = 0, tt = 0;
      y.forEach(function (v, i) { var t = i + 1; tx += t; ty += v; txy += t * v; tt += t * t; });
      var b = (n * txy - tx * ty) / (n * tt - tx * tx), a = (ty - b * tx) / n; return { a: a, b: b };
    }
  };

  /* ---- running examples ---- */
  var SAL = [42, 45, 45, 48, 50, 52, 55, 58, 60, 120]; /* monthly salary, ₹ thousand, 10 sales executives */
  var ATTR = [1.2, 1.4, 1.3, 1.6, 1.5, 1.8, 1.7, 1.9, 2.0, 2.1, 2.0, 2.3]; /* monthly attrition %, Apr–Mar */
  var MET = { hs: 480, he: 520, sep: 60, hires: 100, rcost: 1500000, days: 38, offers: 120, acc: 100, tcost: 1200000, trained: 300, tben: 3000000, meets: 410, rev: 2500000000 };
  var SURV = { N: 1200, conf: 95, moe: 5, pro: 120, pas: 90, det: 60 };
  var CSV = "EmpID,Name,Department,Gender,Salary,JoinDate,Status\nE01,Asha,Sales,F,52000,2021-04-12,Active\nE02,Rohit,sales ,M,48000,2022-01-03,Left\nE03,Meera,HR,F,,2020-07-19,Active\nE04,Karan,Finance,M,61000,2019-11-25,Active\nE04,Karan,Finance,M,61000,2019-11-25,Active\nE05,Neha,Hr,F,45000,2023-02-14,Left\nE06,Vikram,Sales,M,55000,2021-09-30,Active\nE07,Simran,Finance,F,58000,,Active\nE08,Arjun,IT,M,72000,2018-05-07,Left\nE09,Pooja,IT,F,70000,2022-08-22,Active";
  var WFP = { hc: 500, attr: 12, ret: 10, growth: 15, prod: 0, years: 3 };
  var NINE = "Asha, 3, 3\nRohit, 3, 2\nMeera, 2, 3\nKaran, 2, 2\nNeha, 3, 1\nVikram, 1, 2\nSimran, 1, 3\nArjun, 1, 1\nPooja, 2, 2";

  function wfpPlan(p) {
    var rows = [], hc = p.hc, dem = p.hc;
    for (var y = 1; y <= p.years; y++) {
      dem = dem * (1 + p.growth / 100) / (1 + p.prod / 100);
      var sup = Math.max(0, hc * (1 - p.attr / 100) - p.ret), gap = dem - sup;
      rows.push({ y: y, start: hc, leave: hc - sup, sup: sup, dem: dem, gap: gap });
      hc = Math.max(dem, sup);
    }
    return rows;
  }
  var NB = { /* key: potential + "" + performance */
    "33": ["Star", "Future leader: stretch roles, succession slate, retain actively"], "32": ["High potential", "Coach to lift performance; give stretch projects"], "31": ["Rough diamond", "Find the cause of low performance: role fit, manager, onboarding"],
    "23": ["High performer", "Reward and recognise; build next-level skills"], "22": ["Core player", "Develop in role; the backbone of the team"], "21": ["Inconsistent player", "Clear goals and regular feedback; review role fit"],
    "13": ["Trusted professional", "Retain as expert; mentor others"], "12": ["Effective contributor", "Keep engaged; targeted skill training"], "11": ["Underperformer", "Performance improvement plan or move to a better-fitting role"]
  };

  var LESSONS = [
    {
      id: "1.1", mod: 1, title: "Fundamentals of HR Analytics", time: "14 min", tool: "stats",
      outcomes: ["Explain HR analytics and the strategic role of HR in business decisions", "Calculate and interpret the mean, median, mode, range and standard deviation of HR data", "Follow the problem-solving cycle: define the problem, form hypotheses, collect data, build the model, act", "Write a clear, measurable HR analytics problem statement"],
      notes: "<p><b>HR analytics</b> (also called people analytics or workforce analytics) is the use of employee data and analysis to make better decisions about people and the organisation. It moves HR from opinion (“we think pay is the reason people leave”) to evidence (“exit data show 62% of leavers cite manager issues”).</p>" +
        "<p style=\"margin-top:10px\"><b>Strategic role of HR.</b> HR is no longer only an administrative function. As a <b>strategic partner</b> it links people decisions to business goals: having the right people, with the right skills, in the right roles, at the right cost. Analytics gives HR the evidence to influence leaders, for example by showing that a 5-point rise in engagement is linked to higher store sales.</p>" +
        "<p style=\"margin-top:10px\"><b>Basic statistics</b> describe HR data. The <b>mean</b> is the average; the <b>median</b> is the middle value of sorted data and is better for skewed data such as salaries; the <b>mode</b> is the most common value; the <b>range</b> and <b>standard deviation</b> describe how spread out the values are. (Our free <a href=\"/courses/basics-of-statistics/\">Basics of Statistics</a> course covers these in depth.)</p>" +
        "<p style=\"margin-top:10px\"><b>Problem solving.</b> Good analytics starts with a well-defined business problem, not with data. Follow the cycle: <b>define the problem</b> → form <b>hypotheses</b> → <b>collect data</b> → <b>build the model</b> (from a simple comparison to a regression) → <b>interpret</b> → <b>act and measure</b>.</p>",
      formula: "Mean = Σx ÷ n · Median = middle value of sorted data · SD = √[Σ(x − x̄)² ÷ n]<small>problem → hypotheses → data → model → insight → action</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">From traditional HR to strategic HR</h4>" +
          tbl(["", "Traditional HR", "Strategic, analytics-driven HR"], [
            ["Main focus", "Administration: payroll, records, compliance", "Business outcomes: productivity, retention, growth"],
            ["Decisions based on", "Experience and intuition", "Data, evidence and experiments"],
            ["Typical question", "How many people left last year?", "Who is likely to leave next quarter, and why?"],
            ["Role with leaders", "Service provider", "Strategic partner at the decision table"]]) +
          "<h4 style=\"margin:16px 0 8px\">The problem-solving cycle</h4>" + chips(["1. Define the problem", "2. Hypotheses", "3. Collect data", "4. Build the model", "5. Interpret", "6. Act and measure"], "ac");
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\"><b>Defining the problem.</b> A retail chain says “attrition is high”.</p>" +
          '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag" style="background:var(--red);color:var(--red-fg)">Vague</span>' + box("Attrition is too high. We need to fix it.", "weak") + '</div><div><span class="tag mint">Analytics-ready</span>' + box("Annual attrition among store sales staff with under 1 year of service is 38%, against 15% for the company. Each exit costs about ₹60,000 to replace. Goal: reduce first-year attrition to 25% within 12 months.", "good") + "</div></div>" +
          "<p class=\"muted\" style=\"margin:14px 0 10px\"><b>Describing the data.</b> Monthly salaries of 10 sales executives (₹ thousand): " + SAL.join(", ") + "</p>" +
          '<div class="kv"><span>Mean = ' + fmt(S.mean(SAL)) + "</span><span>Median = " + fmt(S.median(SAL)) + "</span><span>Mode = " + S.modes(SAL).join(", ") + "</span><span>Range = " + fmt(S.sorted(SAL)[9] - S.sorted(SAL)[0]) + "</span><span>SD = " + fmt(S.sd(SAL)) + "</span></div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">One senior executive earns ₹120 thousand, which pulls the mean (57.5) well above the median (51). For pay reports, the median describes a typical employee better.</p>";
      },
      use: ["Use the median for pay and tenure, which are usually skewed; use the mean for symmetric data such as test scores.", "Start every analysis with a problem statement agreed with the business leader.", "Mistake: collecting every possible data point first and looking for a question later.", "Mistake: reporting an average without a measure of spread or the number of employees."],
      walk: function () {
        return [
          { t: "HR as a strategic partner", c: "HR analytics links people decisions to business results.", h: '<div class="chips"><span class="chip">People data</span><span class="chip ac">Analysis</span><span class="chip hl">Business decision</span></div>' },
          { t: "Define the problem", c: "Make it specific, measurable and tied to a business cost.", h: box("First-year attrition of store sales staff is 38% vs 15% overall; goal: 25% in 12 months.", "good") },
          { t: "Describe the data", c: "Salaries of 10 sales executives (₹ thousand).", h: chips(SAL, function (x) { return x === 120 ? "hl" : ""; }) },
          { t: "Mean vs median", c: "The one high salary pulls the mean up; the median stays typical.", h: '<div class="chips"><span class="chip ac">Mean ' + fmt(S.mean(SAL)) + '</span><span class="chip mi">Median ' + fmt(S.median(SAL)) + "</span></div>" },
          { t: "Build the model, then act", c: "Test hypotheses with data, then turn insights into actions and measure the result.", h: chips(["Hypotheses", "Data", "Model", "Insight", "Action"], "ac") }
        ];
      },
      qc: [
        { q: "Salaries in a team are 30, 32, 35, 36 and 150 (₹ thousand). Which average best describes a typical salary?", o: ["The median (35)", "The mean (56.6)", "The range (120)", "The maximum (150)"], a: 0, e: "One very high salary pulls the mean up. The median, the middle value, is not affected by it." },
        { q: "What is the first step in the HR analytics problem-solving cycle?", o: ["Define the business problem clearly", "Build a predictive model", "Buy an analytics tool", "Collect all available HR data"], a: 0, e: "A clear, measurable problem tells you which data and model you need." }
      ]
    },
    {
      id: "1.2", mod: 1, title: "Theoretical Frameworks for HR Analytics", time: "12 min", tool: "lamp",
      outcomes: ["Explain the LAMP framework: Logic, Analytics, Measures, Process", "Describe the HR value chain from HR activities to financial results", "Explain the HR Scorecard idea of linking HR to strategy", "Use a framework to plan an HR analytics project"],
      notes: "<p>Frameworks stop analytics from becoming a pile of reports. They make sure each analysis answers a business question and leads to a decision.</p>" +
        "<p style=\"margin-top:10px\"><b>The LAMP framework</b> (Boudreau and Ramstad) says measurement creates value only when four elements work together. <b>Logic</b>: the cause-and-effect story that links people to business results (“better onboarding → faster productivity → higher sales”). <b>Measures</b>: accurate, consistent data and metrics. <b>Analytics</b>: the methods that turn data into insight, from comparisons to regression. <b>Process</b>: how insights are communicated and turned into decisions and change.</p>" +
        "<p style=\"margin-top:10px\"><b>The HR value chain</b> shows how value flows: <b>HR investments</b> (budget, programmes) → <b>HR activities</b> (hiring, training, rewards) → <b>employee outcomes</b> (skills, engagement, retention) → <b>organisational outcomes</b> (productivity, quality, customer satisfaction) → <b>financial outcomes</b> (revenue, profit). Analytics tests each link.</p>" +
        "<p style=\"margin-top:10px\">The <b>HR Scorecard</b> (Becker, Huselid and Ulrich) builds on the balanced scorecard: choose a few HR measures that clearly drive the business strategy, and report them alongside financial measures.</p>",
      formula: "LAMP = Logic + Analytics + Measures + Process<small>HR investments → HR activities → employee outcomes → organisational outcomes → financial outcomes</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">LAMP applied: graduate trainee retention</h4>" +
          tbl(["Element", "Question it answers", "Example"], [
            ["<b>Logic</b>", "Why should this matter to the business?", "Structured mentoring → faster confidence → lower first-year exits → lower hiring cost"],
            ["<b>Measures</b>", "What will we count, and is the data reliable?", "12-month retention, time to productivity, mentor meetings held"],
            ["<b>Analytics</b>", "How will we test the logic?", "Compare mentored vs non-mentored cohorts; control for location and role"],
            ["<b>Process</b>", "Who decides, and how will we drive change?", "Present to the CHRO and business heads; scale mentoring if retention rises by 10 points"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A bank wants to know whether its ₹2 crore sales training programme pays off. The HR value chain makes each link testable:</p>" +
          tbl(["Link", "Measure"], [["HR investment", "₹2 crore training budget"], ["HR activity", "1,200 relationship managers trained"], ["Employee outcome", "Product-knowledge score up from 62% to 78%"], ["Organisational outcome", "Cross-sell ratio up from 1.4 to 1.7 products per customer"], ["Financial outcome", "₹9 crore extra fee income in a year"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">If the chain breaks at one link (e.g., scores rise but cross-selling does not), the analysis shows where to look: perhaps targets or incentives, not training, are the problem.</p>";
      },
      use: ["Use LAMP at the start of a project to make sure the logic, data, method and decision-maker are all clear.", "Use the value chain to explain HR's impact to finance and business leaders.", "Mistake: starting with measures (dashboards) and no logic; you get many numbers and no decisions.", "Mistake: ignoring process; a correct insight that nobody acts on creates no value."],
      walk: function () {
        return [
          { t: "Why frameworks?", c: "They connect each analysis to a business question and a decision.", h: chips(["Question", "Analysis", "Decision"], "ac") },
          { t: "L · Logic", c: "The cause-and-effect story between people and results.", h: box("Mentoring → confidence → fewer first-year exits → lower hiring cost", "good") },
          { t: "A · M", c: "Measures give reliable data; analytics tests the logic.", h: '<div class="chips"><span class="chip ac">Measures: retention, time to productivity</span><span class="chip mi">Analytics: compare cohorts</span></div>' },
          { t: "P · Process", c: "Insights must reach decision-makers and lead to action.", h: '<div class="big">Insight → decision → change</div>' },
          { t: "The HR value chain", c: "Follow value from HR spending to financial results.", h: chips(["HR investment", "HR activity", "Employee outcome", "Org outcome", "Financial outcome"], function (x, i) { return i === 4 ? "hl" : "ac"; }) }
        ];
      },
      qc: [
        { q: "In the LAMP framework, what does “Logic” refer to?", o: ["The cause-and-effect link between people practices and business results", "The software used for analysis", "The accuracy of HR data", "The approval process for budgets"], a: 0, e: "Logic is the story of how a people factor drives a business outcome; Measures cover data accuracy." },
        { q: "In the HR value chain, which is an employee outcome?", o: ["Higher engagement scores", "Training budget", "Revenue growth", "Number of training sessions run"], a: 0, e: "Budget is an investment, sessions are an activity, revenue is a financial outcome; engagement is an employee outcome." }
      ]
    },
    {
      id: "1.3", mod: 1, title: "Types of HR Analytics", time: "13 min", tool: "trend",
      outcomes: ["Distinguish descriptive, diagnostic, predictive and prescriptive analytics", "Match HR questions to the right type of analytics", "Fit a simple trend line and forecast an HR metric", "Turn a forecast into a recommended action"],
      notes: "<p>HR analytics matures through four types, each answering a harder question.</p>" +
        "<p style=\"margin-top:10px\"><b>Descriptive</b>: <i>What happened?</i> Headcount, attrition rate, average time to hire, shown in reports and dashboards. <b>Diagnostic</b>: <i>Why did it happen?</i> Drilling down by department, manager or tenure, comparing groups, and using correlation to find drivers. <b>Predictive</b>: <i>What is likely to happen?</i> Forecasting attrition or hiring demand, and models such as regression that estimate which employees are at risk of leaving. <b>Prescriptive</b>: <i>What should we do?</i> Recommending actions, for example which retention offer gives the best return, or how many people to hire each month.</p>" +
        "<p style=\"margin-top:10px\">Most organisations are strong in descriptive analytics and are building diagnostic and predictive skills. Value and difficulty both rise as you move from descriptive to prescriptive. Predictions are probabilities, not certainties, and must be used fairly: a “flight-risk” score should start a supportive conversation, not a penalty.</p>",
      formula: "Trend line: ŷ = a + b·t<small>b = (nΣty − ΣtΣy) ÷ (nΣt² − (Σt)²) · a = (Σy − bΣt) ÷ n · forecast by putting the next t into the line</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">The four types in HR</h4>" +
          tbl(["Type", "Question", "HR example", "Typical methods"], [
            ["<b>Descriptive</b>", "What happened?", "Attrition was 18% last year", "Counts, rates, averages, dashboards"],
            ["<b>Diagnostic</b>", "Why did it happen?", "Attrition is highest under 3 managers with low engagement scores", "Drill-down, comparisons, correlation"],
            ["<b>Predictive</b>", "What will happen?", "42 sales staff are at high risk of leaving next quarter", "Trend forecasting, regression, machine learning"],
            ["<b>Prescriptive</b>", "What should we do?", "Offer flexible shifts to high-risk staff in 5 stores", "Optimisation, simulation, scenario planning"]]);
      },
      example: function () {
        var f = S.fit(ATTR), next = [13, 14, 15].map(function (t) { return f.a + f.b * t; });
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Monthly attrition (%) of an IT services firm, April to March: " + ATTR.join(", ") + "</p>" +
          tbl(["Type", "Finding"], [
            ["Descriptive", "Average monthly attrition = " + fmt(S.mean(ATTR)) + "%; it rose from 1.2% to 2.3%."],
            ["Diagnostic", "Exit interviews show most leavers are developers with 1–3 years' service citing pay below market."],
            ["Predictive", "Trend line ŷ = " + fmt(f.a) + " + " + fmt(f.b) + "t forecasts " + next.map(function (x) { return fmt(x) + "%"; }).join(", ") + " for the next three months."],
            ["Prescriptive", "The forecast is above the 1.5% target, so review developer pay bands and launch stay interviews."]]);
      },
      use: ["Use descriptive analytics for regular reporting; move to diagnostic when a number changes unexpectedly.", "Use simple trend forecasts for short-term planning, and update them every month.", "Mistake: treating a forecast as certain; always show it as an estimate.", "Mistake: using predictive scores to penalise individuals; use them to target support."],
      walk: function () {
        var f = S.fit(ATTR);
        return [
          { t: "Descriptive: what happened?", c: "Monthly attrition rose over the year.", h: chips(ATTR.map(function (x) { return x + "%"; }), function (x, i) { return i === 11 ? "hl" : ""; }) },
          { t: "Diagnostic: why?", c: "Drill down: developers with 1–3 years' service, pay below market.", h: chips(["Role: developer", "Tenure: 1–3 yrs", "Reason: pay"], "ac") },
          { t: "Predictive: what next?", c: "Fit a trend line and extend it three months.", h: '<div class="formula">ŷ = ' + fmt(f.a) + " + " + fmt(f.b) + "t → month 13 ≈ " + fmt(f.a + f.b * 13) + "%</div>" },
          { t: "Prescriptive: what to do?", c: "The forecast is above target, so act on the cause.", h: box("Review developer pay bands; hold stay interviews with high performers.", "good") },
          { t: "Value rises with difficulty", c: "Each type builds on the one before.", h: chips(["Descriptive", "Diagnostic", "Predictive", "Prescriptive"], function (x, i) { return i === 3 ? "hl" : "ac"; }) }
        ];
      },
      qc: [
        { q: "“Which employees are likely to leave in the next six months?” is which type of analytics?", o: ["Predictive", "Descriptive", "Diagnostic", "Prescriptive"], a: 0, e: "It asks what is likely to happen, so it is predictive." },
        { q: "A dashboard shows last quarter's headcount and hiring by department. Which type is this?", o: ["Descriptive", "Predictive", "Prescriptive", "Diagnostic"], a: 0, e: "It reports what happened." }
      ]
    },
    {
      id: "1.4", mod: 1, title: "HR Metrics and Types of HR Data", time: "15 min", tool: "metrics",
      outcomes: ["Calculate key recruitment metrics: time to hire, cost per hire, offer acceptance rate", "Calculate training metrics including cost per employee and training ROI", "Use performance and KPI metrics such as attrition rate and revenue per employee", "Classify HR data as nominal, ordinal, interval or ratio"],
      notes: "<p>A <b>metric</b> is a number that tracks an HR process; a <b>KPI</b> (key performance indicator) is a metric tied to a target that matters to strategy. Good metrics are clearly defined, calculated the same way every time and compared over time or against benchmarks.</p>" +
        "<p style=\"margin-top:10px\"><b>Recruitment metrics.</b> <b>Time to hire</b>: days from requisition (or first contact) to offer acceptance. <b>Cost per hire</b> = total recruitment cost ÷ number of hires. <b>Offer acceptance rate</b> = offers accepted ÷ offers made. <b>Quality of hire</b>: for example, the performance rating or first-year retention of new hires.</p>" +
        "<p style=\"margin-top:10px\"><b>Training metrics.</b> Training hours and cost per employee, and the <b>Kirkpatrick levels</b>: reaction, learning, behaviour, results. <b>Training ROI</b> = (benefits − costs) ÷ costs × 100.</p>" +
        "<p style=\"margin-top:10px\"><b>Performance and KPI metrics.</b> <b>Attrition rate</b> = separations ÷ average headcount × 100, where average headcount = (start + end) ÷ 2. Others include absenteeism rate, % of employees meeting targets, and <b>revenue per employee</b> = revenue ÷ average headcount.</p>" +
        "<p style=\"margin-top:10px\"><b>Types of data.</b> <b>Nominal</b>: categories with no order (department, gender). <b>Ordinal</b>: ordered categories (performance rating 1–5, satisfaction scale). <b>Interval</b>: equal gaps but no true zero (engagement index, temperature). <b>Ratio</b>: equal gaps and a true zero (salary, tenure, days absent). Data can also be <b>structured</b> (HRIS tables) or <b>unstructured</b> (exit-interview comments, CVs).</p>",
      formula: "Attrition % = separations ÷ [(start + end) ÷ 2] × 100 · Cost per hire = recruitment cost ÷ hires · Training ROI % = (benefit − cost) ÷ cost × 100<small>offer acceptance = accepted ÷ offers · revenue per employee = revenue ÷ average headcount</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Types of HR data</h4>" +
          tbl(["Type", "Meaning", "HR examples", "Valid summaries"], [
            ["<b>Nominal</b>", "Named categories, no order", "Department, gender, location", "Counts, %, mode"],
            ["<b>Ordinal</b>", "Ordered categories, unequal gaps", "Rating 1–5, grade level, Likert answers", "Median, mode, %"],
            ["<b>Interval</b>", "Equal gaps, no true zero", "Engagement index, psychometric scores", "Mean, SD"],
            ["<b>Ratio</b>", "Equal gaps and a true zero", "Salary, age, tenure, days absent", "All, including ratios"]]);
      },
      example: function () {
        var avg = (MET.hs + MET.he) / 2;
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A mid-size firm's annual figures.</p>" +
          tbl(["Metric", "Calculation", "Result"], [
            ["Average headcount", "(" + MET.hs + " + " + MET.he + ") ÷ 2", num(avg)],
            ["Attrition rate", MET.sep + " ÷ " + num(avg) + " × 100", pct(MET.sep / avg)],
            ["Cost per hire", inr(MET.rcost) + " ÷ " + MET.hires, inr(MET.rcost / MET.hires)],
            ["Offer acceptance rate", MET.acc + " ÷ " + MET.offers, pct(MET.acc / MET.offers)],
            ["Training cost per employee", inr(MET.tcost) + " ÷ " + MET.trained, inr(MET.tcost / MET.trained)],
            ["Training ROI", "(" + inr(MET.tben) + " − " + inr(MET.tcost) + ") ÷ " + inr(MET.tcost), pct((MET.tben - MET.tcost) / MET.tcost, 0)]]);
      },
      use: ["Use a written “metric dictionary” so every report defines and calculates metrics the same way.", "Compare metrics over time and against benchmarks; a single number says little.", "Mistake: dividing separations by year-end headcount only; use average headcount.", "Mistake: calculating a mean of nominal data (e.g., averaging department codes)."],
      walk: function () {
        var avg = (MET.hs + MET.he) / 2;
        return [
          { t: "Metric vs KPI", c: "A KPI is a metric with a target linked to strategy.", h: '<div class="chips"><span class="chip">Metric: attrition 12%</span><span class="chip hl">KPI: attrition below 10% by March</span></div>' },
          { t: "Recruitment", c: "Cost per hire and offer acceptance.", h: '<div class="formula">' + inr(MET.rcost) + " ÷ " + MET.hires + " = " + inr(MET.rcost / MET.hires) + " · " + MET.acc + "/" + MET.offers + " = " + pct(MET.acc / MET.offers) + "</div>" },
          { t: "Training", c: "Return on a ₹12 lakh programme that created ₹30 lakh of benefit.", h: '<div class="formula">ROI = (30 − 12) ÷ 12 = 150%</div>' },
          { t: "Performance KPI", c: "Attrition uses average headcount.", h: '<div class="formula">' + MET.sep + " ÷ " + num(avg) + " = " + pct(MET.sep / avg) + "</div>" },
          { t: "Know your data type", c: "The type decides which summaries make sense.", h: chips(["Nominal: department", "Ordinal: rating", "Interval: engagement index", "Ratio: salary"], "ac") }
        ];
      },
      qc: [
        { q: "Headcount was 200 at the start and 240 at the end of the year, with 33 separations. What is the attrition rate?", o: ["15%", "13.75%", "16.5%", "11%"], a: 0, e: "Average headcount = (200 + 240) ÷ 2 = 220; 33 ÷ 220 = 15%." },
        { q: "A performance rating on a 1–5 scale is which type of data?", o: ["Ordinal", "Nominal", "Ratio", "Interval with a true zero"], a: 0, e: "The categories are ordered, but the gaps between ratings are not guaranteed to be equal." }
      ]
    },
    {
      id: "2.1", mod: 2, title: "Capturing HR Data: Primary and Secondary", time: "12 min", tool: "survey",
      outcomes: ["Distinguish primary and secondary HR data", "Choose suitable collection methods: surveys, interviews, focus groups, observation", "Calculate the sample size needed for an employee survey", "Calculate and interpret an employee Net Promoter Score (eNPS)"],
      notes: "<p><b>Primary data</b> is collected first-hand for a specific purpose. Methods include <b>surveys</b> (engagement, pulse, exit surveys), <b>interviews</b> (stay and exit interviews), <b>focus groups</b>, <b>observation</b> and <b>experiments</b> (piloting a new policy in some branches). It fits your question exactly but costs time and money.</p>" +
        "<p style=\"margin-top:10px\"><b>Secondary data</b> already exists, collected for another purpose. Internal sources: the <b>HRIS</b> (employee master data), payroll, attendance systems, the applicant tracking system, the learning management system and performance records. External sources: salary benchmarking surveys, industry reports, labour statistics (e.g., the Periodic Labour Force Survey) and job-portal data. It is quick and cheap but may not match your exact question.</p>" +
        "<p style=\"margin-top:10px\">For surveys, a well-chosen <b>random sample</b> can represent the whole workforce. The needed size depends on the confidence level, the margin of error and the population size. Protect <b>privacy</b>: collect only what you need, keep responses confidential, report groups of at least 5 to 10 people, and follow the Digital Personal Data Protection Act, 2023.</p>" +
        "<p style=\"margin-top:10px\">The <b>employee Net Promoter Score (eNPS)</b> asks: “How likely are you to recommend this organisation as a place to work?” (0–10). Promoters score 9–10, passives 7–8, detractors 0–6.</p>",
      formula: "n₀ = z² × p(1 − p) ÷ e² · n = n₀ ÷ [1 + (n₀ − 1) ÷ N] · eNPS = (% promoters − % detractors)<small>z = 1.645 (90%), 1.96 (95%), 2.576 (99%) · p = 0.5 when unknown · e = margin of error</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Primary vs secondary data</h4>" +
          tbl(["", "Primary data", "Secondary data"], [
            ["Collected", "First-hand, for this question", "Already exists, for another purpose"],
            ["HR examples", "Engagement survey, stay interviews, focus groups", "HRIS, payroll, attendance, ATS, salary benchmarks"],
            ["Strengths", "Fits the question; current", "Fast, cheap, often large and historical"],
            ["Watch out for", "Cost, time, response bias, low response rates", "Missing fields, different definitions, outdated data"]]);
      },
      example: function () {
        var n0 = 1.96 * 1.96 * 0.25 / 0.0025, n = n0 / (1 + (n0 - 1) / SURV.N), tot = SURV.pro + SURV.pas + SURV.det;
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A manufacturing company with " + num(SURV.N) + " employees plans an engagement survey at 95% confidence and a ±5% margin of error.</p>" +
          '<div class="formula" style="font-size:17px">n₀ = 1.96² × 0.5 × 0.5 ÷ 0.05² = ' + fmt(n0) + " · n = " + fmt(n0) + " ÷ [1 + " + fmt(n0 - 1) + " ÷ 1,200] = " + fmt(n) + " → " + Math.ceil(n) + " responses</div>" +
          "<p class=\"muted\" style=\"margin:14px 0 10px\">In the survey, " + tot + " employees answered the eNPS question: " + SURV.pro + " promoters, " + SURV.pas + " passives and " + SURV.det + " detractors.</p>" +
          '<div class="formula" style="font-size:17px">eNPS = ' + pct(SURV.pro / tot) + " − " + pct(SURV.det / tot) + " = " + fmt((SURV.pro - SURV.det) / tot * 100) + "</div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">eNPS ranges from −100 to +100. A positive score means more promoters than detractors; track it over time and by team.</p>";
      },
      use: ["Use secondary HRIS data first; collect primary data when you need opinions, reasons or information that systems do not hold.", "Use random or stratified sampling so each department is fairly represented.", "Mistake: long surveys with leading questions, which lower response rates and bias answers.", "Mistake: reporting results for very small groups, which can identify individuals."],
      walk: function () {
        return [
          { t: "Two sources of data", c: "Primary is collected for your question; secondary already exists.", h: '<div class="chips"><span class="chip ac">Primary: surveys, interviews</span><span class="chip mi">Secondary: HRIS, payroll, reports</span></div>' },
          { t: "Choose the method", c: "Match the method to what you need to learn.", h: chips(["Survey: views at scale", "Interview: reasons", "Focus group: ideas", "HRIS: facts"], "ac") },
          { t: "How many responses?", c: "1,200 employees, 95% confidence, ±5% margin.", h: '<div class="big">n ≈ 292</div>' },
          { t: "eNPS", c: "Promoters (9–10) minus detractors (0–6).", h: '<div class="formula">44.4% − 22.2% = 22.2</div>' },
          { t: "Protect privacy", c: "Collect only what you need; report groups, not individuals.", h: box("Minimum reporting group: 5–10 people · DPDP Act, 2023", "good") }
        ];
      },
      qc: [
        { q: "Which of these is secondary data for an HR analyst?", o: ["Attendance records from the HRIS", "A new pulse survey of employees", "Focus groups with new joiners", "Stay interviews with top performers"], a: 0, e: "Attendance records already exist for another purpose; the others are collected first-hand." },
        { q: "In an eNPS survey of 200 staff, 80 are promoters, 70 passives and 50 detractors. What is the eNPS?", o: ["15", "40", "30", "−15"], a: 0, e: "Promoters 40% − detractors 25% = 15." }
      ]
    },
    {
      id: "2.2", mod: 2, title: "Analysing HR Data with Power BI", time: "16 min", tool: "clean",
      outcomes: ["Load HR data into Power BI from Excel or CSV", "Clean data in Power Query: remove duplicates, fix text, handle missing values, set data types", "Create measures with DAX, such as headcount and attrition rate", "Design a clear HR dashboard with KPIs, charts and slicers"],
      notes: "<p><b>Power BI</b> is Microsoft's business-intelligence tool. Power BI Desktop is free for Windows; reports can be shared through the Power BI service. A typical HR analysis follows four steps.</p>" +
        "<p style=\"margin-top:10px\"><b>1. Upload data.</b> Home → <b>Get data</b> → Excel workbook or Text/CSV. Select the employee table and click <b>Transform data</b> to open Power Query (rather than Load, so you can clean first).</p>" +
        "<p style=\"margin-top:10px\"><b>2. Clean data</b> in <b>Power Query</b>. <b>Remove duplicates</b> on the employee ID column. <b>Trim</b> and <b>Capitalise each word</b> to fix entries like “sales ” and “Sales”. <b>Replace values</b> for spelling variants (“Hr” → “HR”). Handle <b>missing values</b>: filter them out, fill them, or keep and flag them. Set the right <b>data types</b> (date, whole number, text). Each step is recorded and re-runs automatically when new data arrives.</p>" +
        "<p style=\"margin-top:10px\"><b>3. Analyse</b> with <b>DAX</b> measures, for example <i>Headcount = COUNTROWS(Employees)</i>, <i>Leavers = CALCULATE(COUNTROWS(Employees), Employees[Status] = \"Left\")</i>, <i>Attrition % = DIVIDE([Leavers], [Headcount])</i> and <i>Avg Salary = AVERAGE(Employees[Salary])</i>. Create relationships between tables (employees, departments, dates) in the Model view.</p>" +
        "<p style=\"margin-top:10px\"><b>4. Build the dashboard.</b> Put <b>KPI cards</b> at the top (headcount, attrition %, average salary), then charts: a bar chart of headcount by department, a line chart of monthly attrition, a donut for gender mix. Add <b>slicers</b> for department, location and year. Keep it to one screen, one message per visual.</p>",
      formula: "Attrition % = DIVIDE([Leavers], [Headcount])<small>Power Query: Remove duplicates · Trim · Capitalize Each Word · Replace values · Change type</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Common data problems and Power Query fixes</h4>" +
          tbl(["Problem", "Example", "Power Query fix"], [
            ["Duplicate rows", "E04 appears twice", "Home → Remove rows → Remove duplicates"],
            ["Extra spaces / case", "“sales ” vs “Sales”", "Transform → Format → Trim, Capitalize Each Word"],
            ["Spelling variants", "“Hr” vs “HR”", "Transform → Replace values"],
            ["Missing values", "Blank salary", "Filter out, fill, or keep and flag"],
            ["Wrong data type", "Dates stored as text", "Transform → Data type → Date"]]) +
          "<h4 style=\"margin:16px 0 8px\">A good HR dashboard</h4>" + chips(["KPI cards on top", "Headcount by department", "Monthly attrition trend", "Gender and age mix", "Slicers: department, location, year"], "ac");
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A raw export of 10 employee rows has problems that would give wrong results if loaded as it is.</p>" + box(CSV, "") +
          "<p class=\"muted small\" style=\"margin-top:10px\">Before cleaning, Power BI would count 10 employees and 6 departments (“Sales”, “sales ”, “HR”, “Hr”, “Finance”, “IT”). After removing the duplicate E04 and fixing the text, there are <b>9 employees in 4 departments</b>, and the attrition rate is 3 ÷ 9 = <b>33.3%</b>, not 3 ÷ 10 = 30%. Try it in the tool below.</p>";
      },
      use: ["Use Power Query for every cleaning step so it repeats automatically when you refresh the data.", "Use measures (DAX) rather than calculated columns for rates, so they respond correctly to slicers.", "Mistake: cleaning data by hand in Excel each month; mistakes creep in and steps are lost.", "Mistake: cluttered dashboards with many colours and 3D charts; keep a few clear visuals."],
      walk: function () {
        return [
          { t: "1. Get data", c: "Home → Get data → Excel or CSV → Transform data.", h: chips(["Excel", "CSV", "HRIS export"], "ac") },
          { t: "2. Clean in Power Query", c: "Remove duplicates, trim text, fix spellings, set types.", h: '<div class="chips"><span class="chip dim">sales␣</span><span class="chip dim">Hr</span><span class="chip mi">Sales</span><span class="chip mi">HR</span></div>' },
          { t: "3. Write measures", c: "DAX measures calculate KPIs that respond to filters.", h: box("Attrition % = DIVIDE([Leavers], [Headcount])", "good") },
          { t: "4. Build the dashboard", c: "KPI cards, a few charts and slicers.", h: '<div class="chips"><span class="chip hl">Headcount 9</span><span class="chip hl">Attrition 33.3%</span><span class="chip hl">Avg salary ₹57.6k</span></div>' },
          { t: "Refresh and share", c: "Cleaning steps re-run on new data; publish to the Power BI service.", h: '<div class="big">Clean once, refresh every month</div>' }
        ];
      },
      qc: [
        { q: "In Power BI, where do you remove duplicates and trim text before analysis?", o: ["Power Query Editor (Transform data)", "The report canvas", "The DAX formula bar only", "The Publish dialog"], a: 0, e: "Power Query is the data-preparation tool; its steps re-run on every refresh." },
        { q: "Why should attrition % be a DAX measure rather than a fixed number typed into a card?", o: ["So it recalculates correctly when users filter by department or year", "Because cards cannot show numbers", "Because measures are always faster to type", "So the data does not need cleaning"], a: 0, e: "Measures are evaluated in the current filter context, so slicers change the result correctly." }
      ]
    },
    {
      id: "2.3", mod: 2, title: "HR Analytics in Workforce Planning", time: "13 min", tool: "wfp",
      outcomes: ["Explain the workforce planning process: supply, demand, gap, action", "Forecast workforce demand from business growth and productivity", "Forecast internal supply using attrition and retirements", "Calculate hiring needs and choose actions to close gaps"],
      notes: "<p><b>Workforce planning</b> makes sure the organisation has the right number of people with the right skills, in the right place, at the right time and cost. It follows four steps: analyse <b>current supply</b>, forecast <b>demand</b>, identify the <b>gap</b>, and plan <b>actions</b>.</p>" +
        "<p style=\"margin-top:10px\"><b>Demand forecasting</b> estimates how many people the business will need. Methods: <b>ratio analysis</b> (e.g., one nurse per four beds), <b>trend analysis</b> (extending past growth), <b>productivity-based</b> planning (workload ÷ output per employee) and expert judgement (e.g., the Delphi technique). Productivity gains reduce the number of people needed for the same output.</p>" +
        "<p style=\"margin-top:10px\"><b>Supply forecasting</b> estimates how many of today's employees will still be there: current headcount minus expected attrition and retirements, plus internal moves. A <b>Markov analysis</b> uses historical movement probabilities between grades to project internal supply. A <b>skills inventory</b> shows what skills you have.</p>" +
        "<p style=\"margin-top:10px\">The <b>gap</b> = demand − supply. A positive gap means hiring, internal mobility, upskilling or contractors; a negative gap (surplus) means redeployment, hiring freezes or reskilling. Scenario planning (best, expected, worst case) makes the plan robust.</p>",
      formula: "Demand (next year) = current demand × (1 + growth) ÷ (1 + productivity gain) · Supply = headcount × (1 − attrition) − retirements · Gap = demand − supply<small>a positive gap means people to hire or develop</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Closing the gap</h4>" +
          tbl(["Situation", "Possible actions"], [
            ["Shortage (demand > supply)", "External hiring, internal promotion and transfers, upskilling, contract or gig workers, overtime, automation"],
            ["Surplus (supply > demand)", "Hiring freeze, redeployment to growing teams, reskilling, voluntary retirement schemes, reduced hours"],
            ["Skills mismatch", "Targeted training, career paths, hiring for critical skills, succession planning"]]);
      },
      example: function () {
        var r = wfpPlan(WFP);
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A logistics company has " + WFP.hc + " delivery staff, expects " + WFP.growth + "% business growth a year, " + WFP.attr + "% annual attrition and " + WFP.ret + " retirements a year.</p>" +
          tbl(["Year", "Start headcount", "Leaving", "Supply", "Demand", "Hires needed"], r.map(function (x) { return [x.y, num(x.start), num(x.leave), num(x.sup), num(x.dem), "<b>" + num(x.gap) + "</b>"]; })) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Year 1: demand = 500 × 1.15 = 575; supply = 500 × 0.88 − 10 = 430; the company must hire 145 people, more than its 70 leavers alone would suggest, because growth adds 75 roles.</p>";
      },
      use: ["Use workforce planning before budgeting, so hiring plans match business plans.", "Use scenarios (low, expected, high growth) rather than a single forecast.", "Mistake: forecasting demand but ignoring attrition, which underestimates hiring needs.", "Mistake: planning headcount only; plan the critical skills too."],
      walk: function () {
        var r = wfpPlan(WFP)[0];
        return [
          { t: "Four steps", c: "Supply, demand, gap, action.", h: chips(["Current supply", "Future demand", "Gap", "Action plan"], "ac") },
          { t: "Forecast demand", c: "500 staff and 15% growth.", h: '<div class="formula">500 × 1.15 = ' + num(r.dem) + "</div>" },
          { t: "Forecast supply", c: "12% attrition and 10 retirements.", h: '<div class="formula">500 × 0.88 − 10 = ' + num(r.sup) + "</div>" },
          { t: "Find the gap", c: "Demand minus supply.", h: '<div class="big">' + num(r.dem) + " − " + num(r.sup) + " = " + num(r.gap) + " hires</div>" },
          { t: "Plan actions", c: "Mix hiring, internal moves, training and retention.", h: chips(["Hire", "Promote", "Upskill", "Retain"], function (x, i) { return i === 3 ? "hl" : "mi"; }) }
        ];
      },
      qc: [
        { q: "Headcount is 200, expected attrition is 10% and there are 5 retirements. Demand next year is 230. How many people must be hired?", o: ["55", "30", "25", "50"], a: 0, e: "Supply = 200 × 0.9 − 5 = 175; gap = 230 − 175 = 55." },
        { q: "Which method uses historical probabilities of employees moving between grades to forecast internal supply?", o: ["Markov analysis", "Delphi technique", "Ratio analysis", "eNPS"], a: 0, e: "A Markov (transition probability) matrix projects internal movements, exits and promotions." }
      ]
    },
    {
      id: "2.4", mod: 2, title: "HR Analytics in Talent Management", time: "14 min", tool: "ninebox",
      outcomes: ["Describe the talent management cycle: attract, develop, deploy, retain", "Place employees on a 9-box grid using performance and potential", "Use analytics for succession planning and identifying flight risk", "Recommend development and retention actions by talent segment"],
      notes: "<p><b>Talent management</b> covers how an organisation attracts, develops, deploys and retains people, especially those in critical roles. Analytics supports each stage: sourcing-channel analysis for <b>attracting</b>, learning analytics for <b>developing</b>, skills matching for <b>deploying</b> and attrition-risk models for <b>retaining</b>.</p>" +
        "<p style=\"margin-top:10px\">The <b>9-box grid</b> is a widely used talent review tool. Each employee is rated on <b>performance</b> (results now, from appraisals) and <b>potential</b> (ability to grow into bigger roles, from assessments and manager judgement), each as low, medium or high. The nine boxes suggest different actions, from fast-tracking “stars” to performance plans for underperformers.</p>" +
        "<p style=\"margin-top:10px\"><b>Succession planning</b> identifies ready-now and ready-later successors for critical roles; the high-potential boxes form the talent pool. <b>Flight-risk analysis</b> combines factors such as time since last promotion, pay versus market, engagement score and manager change to flag valued employees who may leave, so managers can act early.</p>" +
        "<p style=\"margin-top:10px\">Ratings must be calibrated across managers to reduce bias, and potential should be judged on evidence, not on similarity to the manager. Share results carefully and use them for development, not labels.</p>",
      formula: "9-box position = performance (low, medium, high) × potential (low, medium, high)<small>succession pool = high potential with medium or high performance, plus high performers with medium potential</small>",
      extra: function () {
        var g = '<div class="tscroll"><table><tr><th>Potential ↓ / Performance →</th><th>Low</th><th>Medium</th><th>High</th></tr>';
        [3, 2, 1].forEach(function (p) { g += "<tr><th>" + ["", "Low", "Medium", "High"][p] + "</th>" + [1, 2, 3].map(function (f) { var b = NB[p + "" + f]; return "<td><b>" + b[0] + '</b><br><span class="small muted">' + b[1] + "</span></td>"; }).join("") + "</tr>"; });
        return "<h4 style=\"margin:4px 0 8px\">The 9-box grid and suggested actions</h4>" + g + "</table></div>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A retail company reviews its 9 store managers (performance, potential on a 1–3 scale).</p>" +
          tbl(["Manager", "Performance", "Potential", "Box", "Action"], NINE.split("\n").map(function (l) { var p = l.split(",").map(function (x) { return x.trim(); }), b = NB[p[2] + p[1]]; return [p[0], p[1], p[2], "<b>" + b[0] + "</b>", b[1]]; })) +
          "<p class=\"muted small\" style=\"margin-top:10px\">The succession pool for area-manager roles is Asha (star), Meera (high potential) and Rohit (high performer). Simran's high potential but low performance calls for a conversation about role fit and support.</p>";
      },
      use: ["Use the 9-box in calibrated talent reviews, with evidence for each rating.", "Use flight-risk insights to prompt stay conversations and career moves for key people.", "Mistake: treating potential as a permanent label; review it at least once a year.", "Mistake: rating potential by likeability or similarity, which introduces bias."],
      walk: function () {
        return [
          { t: "The talent cycle", c: "Attract, develop, deploy, retain.", h: chips(["Attract", "Develop", "Deploy", "Retain"], "ac") },
          { t: "Two ratings", c: "Performance shows results now; potential shows capacity to grow.", h: '<div class="chips"><span class="chip ac">Performance: 1–3</span><span class="chip mi">Potential: 1–3</span></div>' },
          { t: "Place on the grid", c: "Asha: performance 3, potential 3.", h: '<div class="big">Star ⭐</div>' },
          { t: "Act by segment", c: "Different boxes need different actions.", h: chips(["Stars: stretch roles", "Core players: develop", "Underperformers: support plan"], function (x, i) { return i === 0 ? "hl" : ""; }) },
          { t: "Plan succession", c: "High potentials form the pipeline for critical roles.", h: chips(["Asha", "Meera", "Rohit"], "hl") }
        ];
      },
      qc: [
        { q: "An employee has high potential but low current performance. Which 9-box label fits?", o: ["Rough diamond (enigma)", "Star", "Trusted professional", "Core player"], a: 0, e: "High potential, low performance: find out what is holding them back." },
        { q: "Which data would be most useful in a flight-risk model?", o: ["Time since last promotion, pay versus market and engagement score", "Employee's favourite colour", "Office floor number", "Company logo colour"], a: 0, e: "These factors are commonly linked to voluntary exits." }
      ]
    }
  ];

  var MODULES = [
    { n: 1, title: "Foundations of HR Analytics", sub: "The strategic role of HR, frameworks, types of analytics and key HR metrics.", tag: "Module 1" },
    { n: 2, title: "HR Data, Tools and Applications", sub: "Capture and analyse HR data in Power BI, then apply it to workforce planning and talent management.", tag: "Module 2" }
  ];

  /* ================= FINAL TEST (20 questions) ================= */
  var TEST = [
    { m: 1, q: "What best describes HR analytics?", o: ["Using employee data and analysis to make better people and business decisions", "Storing employee records in a database", "Running payroll on time", "Writing HR policies"], a: 0, e: "HR analytics turns people data into evidence for decisions." },
    { m: 1, q: "Tenure (years) of 7 employees: 1, 2, 2, 3, 4, 5, 18. Which is the median?", o: ["3", "5", "2", "18"], a: 0, e: "Sorted, the middle (4th) value is 3. The mean (5) is pulled up by 18; 2 is the mode." },
    { m: 1, q: "Which problem statement is most analytics-ready?", o: ["First-year attrition of call-centre agents is 45% vs 18% overall; reduce it to 30% in a year", "Employees are unhappy", "We need an HR dashboard", "HR should be more strategic"], a: 0, e: "It is specific, measurable and has a target." },
    { m: 1, q: "In the LAMP framework, what does “Process” mean?", o: ["Communicating insights and turning them into decisions and change", "Cleaning the data", "The statistical method", "The payroll process"], a: 0, e: "Process covers how findings reach decision-makers and drive action." },
    { m: 1, q: "In the HR value chain, “training sessions delivered” is a…", o: ["HR activity", "Financial outcome", "Employee outcome", "Organisational outcome"], a: 0, e: "Sessions delivered are something HR does: an activity." },
    { m: 1, q: "“Why is attrition highest in the Pune branch?” is which type of analytics?", o: ["Diagnostic", "Descriptive", "Predictive", "Prescriptive"], a: 0, e: "It asks why something happened." },
    { m: 1, q: "“Which retention offer gives the best return for each at-risk group?” is which type of analytics?", o: ["Prescriptive", "Predictive", "Descriptive", "Diagnostic"], a: 0, e: "It recommends an action." },
    { m: 1, q: "Recruitment cost was ₹24 lakh for 80 hires. What is the cost per hire?", o: ["₹30,000", "₹3,000", "₹19,200", "₹3,00,000"], a: 0, e: "₹24,00,000 ÷ 80 = ₹30,000." },
    { m: 1, q: "A training programme cost ₹10 lakh and produced ₹25 lakh of benefit. What is the ROI?", o: ["150%", "250%", "40%", "15%"], a: 0, e: "(25 − 10) ÷ 10 = 1.5 = 150%." },
    { m: 1, q: "Department name is which type of data?", o: ["Nominal", "Ordinal", "Interval", "Ratio"], a: 0, e: "Named categories with no order are nominal." },
    { m: 2, q: "Which is primary data?", o: ["Responses to a new engagement survey", "Payroll records", "A published salary benchmarking report", "Attendance logs in the HRIS"], a: 0, e: "Primary data is collected first-hand for the current purpose." },
    { m: 2, q: "Why do survey sample-size formulas often use p = 0.5?", o: ["It gives the largest (safest) sample when the true proportion is unknown", "Half the employees always respond", "It halves the sample", "It is required by law"], a: 0, e: "p(1 − p) is largest at 0.5, so the sample is big enough whatever the true value." },
    { m: 2, q: "An eNPS survey has 50% promoters, 30% passives and 20% detractors. What is the eNPS?", o: ["30", "50", "70", "20"], a: 0, e: "50 − 20 = 30." },
    { m: 2, q: "In Power BI, which step should come first?", o: ["Get data and clean it in Power Query", "Format the dashboard colours", "Publish the report", "Add slicers"], a: 0, e: "Load and clean data before building measures and visuals." },
    { m: 2, q: "A raw file has “Sales”, “sales ” and “SALES”. Which Power Query steps fix this?", o: ["Trim and Capitalize Each Word", "Remove columns", "Change type to Date", "Sort descending"], a: 0, e: "Trim removes spaces; consistent capitalisation merges the variants." },
    { m: 2, q: "Which DAX expression gives the attrition rate safely, avoiding errors when headcount is zero?", o: ["DIVIDE([Leavers], [Headcount])", "[Leavers] + [Headcount]", "SUM(Employees[Name])", "COUNTROWS([Leavers])"], a: 0, e: "DIVIDE handles division by zero and returns a blank instead of an error." },
    { m: 2, q: "Headcount 400, attrition 15%, 10 retirements, demand next year 420. How many hires are needed?", o: ["90", "20", "70", "80"], a: 0, e: "Supply = 400 × 0.85 − 10 = 330; gap = 420 − 330 = 90." },
    { m: 2, q: "What does a negative workforce gap (supply greater than demand) suggest?", o: ["A surplus: consider redeployment, a hiring freeze or reskilling", "Urgent external hiring", "Higher training ROI", "Higher eNPS"], a: 0, e: "More people than needed calls for surplus-management actions." },
    { m: 2, q: "On a 9-box grid, high performance and high potential is usually called…", o: ["Star (future leader)", "Rough diamond", "Core player", "Underperformer"], a: 0, e: "The top-right box holds the stars." },
    { m: 2, q: "What is the best use of a flight-risk score for a valued employee?", o: ["Start a supportive stay conversation and address the drivers", "Exclude them from promotions", "Share it with the whole team", "Reduce their pay rise"], a: 0, e: "Predictions should guide support, not penalties." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["HR analytics", "Using employee data and analysis to improve people and business decisions. Also called people analytics.", "Analysing exit data to reduce attrition.", "1.1"],
    ["Strategic HR", "HR that links people decisions to business goals as a partner to leadership.", "HR shows how engagement drives store sales.", "1.1"],
    ["Mean", "The sum of values divided by their number.", "Mean tenure of 2, 4, 6 years is 4.", "1.1"],
    ["Median", "The middle value of sorted data; better for skewed data.", "Median salary of a team.", "1.1"],
    ["Standard deviation", "The typical distance of values from the mean.", "Pay varies by ₹21 thousand around the mean.", "1.1"],
    ["Problem statement", "A specific, measurable description of the business problem to solve.", "First-year attrition 38% vs 15%; target 25%.", "1.1"],
    ["LAMP framework", "Logic, Analytics, Measures, Process: what makes HR measurement create value.", "Planning a mentoring evaluation.", "1.2"],
    ["HR value chain", "The links from HR investment to activities, employee, organisational and financial outcomes.", "Training → skills → cross-sell → revenue.", "1.2"],
    ["HR Scorecard", "A small set of HR measures linked to business strategy and reported with financial results.", "Quality of hire on the leadership scorecard.", "1.2"],
    ["Descriptive analytics", "What happened? Reports, counts and rates.", "Attrition was 18% last year.", "1.3"],
    ["Diagnostic analytics", "Why did it happen? Drill-down and comparisons.", "Attrition is highest under three managers.", "1.3"],
    ["Predictive analytics", "What is likely to happen? Forecasts and risk models.", "42 staff at high risk of leaving.", "1.3"],
    ["Prescriptive analytics", "What should we do? Recommendations and optimisation.", "Offer flexible shifts in five stores.", "1.3"],
    ["Trend line", "A straight line fitted to data over time, used to forecast.", "ŷ = 1.14 + 0.09t.", "1.3"],
    ["KPI", "Key performance indicator: a metric with a target linked to strategy.", "Attrition below 10% by March.", "1.4"],
    ["Attrition rate", "Separations ÷ average headcount × 100.", "60 ÷ 500 = 12%.", "1.4"],
    ["Cost per hire", "Total recruitment cost ÷ number of hires.", "₹15 lakh ÷ 100 = ₹15,000.", "1.4"],
    ["Time to hire", "Days from requisition or first contact to offer acceptance.", "38 days on average.", "1.4"],
    ["Training ROI", "(Benefit − cost) ÷ cost × 100.", "(30 − 12) ÷ 12 = 150%.", "1.4"],
    ["Nominal / ordinal / interval / ratio", "The four levels of measurement for data.", "Department / rating / engagement index / salary.", "1.4"],
    ["Primary data", "Data collected first-hand for the current question.", "A pulse survey.", "2.1"],
    ["Secondary data", "Data that already exists, collected for another purpose.", "HRIS records, salary benchmarks.", "2.1"],
    ["HRIS", "Human resource information system: the main database of employee records.", "SAP SuccessFactors, Workday, Darwinbox.", "2.1"],
    ["eNPS", "Employee Net Promoter Score: % promoters − % detractors.", "44% − 22% = 22.", "2.1"],
    ["Sample size", "The number of responses needed for reliable survey results.", "≈ 292 for 1,200 staff at 95% ± 5%.", "2.1"],
    ["Power Query", "Power BI's data-preparation tool for cleaning and shaping data.", "Remove duplicates, trim text.", "2.2"],
    ["DAX", "Data Analysis Expressions: Power BI's formula language for measures.", "Attrition % = DIVIDE([Leavers], [Headcount]).", "2.2"],
    ["Dashboard", "A one-screen visual summary of key metrics, often interactive.", "KPI cards, charts and slicers.", "2.2"],
    ["Slicer", "An on-report filter users click to slice the data.", "Filter by department or year.", "2.2"],
    ["Workforce planning", "Matching future workforce supply to demand in numbers and skills.", "Plan 145 hires next year.", "2.3"],
    ["Markov analysis", "Uses historical movement probabilities between grades to forecast internal supply.", "70% of analysts stay analysts each year.", "2.3"],
    ["Workforce gap", "Demand − supply; positive means a shortage, negative a surplus.", "575 − 430 = 145.", "2.3"],
    ["9-box grid", "A talent review grid of performance × potential.", "Stars in the top-right box.", "2.4"],
    ["Succession planning", "Identifying and developing successors for critical roles.", "Two ready-now successors for each area manager.", "2.4"],
    ["Flight risk", "The likelihood that a valued employee will leave.", "No promotion in 3 years and pay below market.", "2.4"]
  ];

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0, 1, 3, 0, 2]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= TRY-IT TOOLS (all run in the browser; nothing is sent anywhere) ================= */
  function ta(id, v, rows, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" rows="' + (rows || 4) + '">' + esc(v || "") + "</textarea></div>"; }
  function inp(id, v, label, ph, mode) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + esc(v === undefined ? "" : v) + '" placeholder="' + esc(ph || "") + '"' + (mode ? ' inputmode="' + mode + '"' : "") + "></div>"; }
  function sel(id, opts, v, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></div>"; }
  function copyRow(id) { return '<div class="row" style="margin-top:8px"><button class="btn btn-ink btn-sm" data-copy="' + id + '">Copy</button><span class="small muted" data-copied="' + id + '" aria-live="polite"></span></div>'; }
  function out(id, text) { return '<div class="pbox good" id="' + id + '">' + esc(text) + "</div>"; }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ""; }
  function n(id) { var s = val(id).replace(/[,\s₹%]/g, ""); return s === "" ? NaN : Number(s); }
  function err(t) { return '<p class="err">' + t + "</p>"; }
  function tick(ok, t) { return "<li>" + (ok ? "✅" : "⬜") + " " + t + "</li>"; }
  function nums(raw, max) {
    var parts = raw.split(/[\s,;]+/).filter(Boolean), a = [];
    for (var i = 0; i < parts.length; i++) { var v = Number(parts[i]); if (!isFinite(v)) return { e: "“" + esc(parts[i]) + "” is not a number. Use digits separated by commas or spaces." }; a.push(v); }
    if (a.length > (max || 500)) return { e: "Please enter " + (max || 500) + " numbers or fewer." };
    return { a: a };
  }

  function toolBlock(l) {
    var h = '<div class="card calc"><p class="muted small" style="margin-bottom:12px">' + {
      stats: "Paste any HR numbers (salaries, tenure, training hours, days absent). The tool describes them and warns when outliers pull the mean away from the median.",
      lamp: "Plan an HR analytics project with the LAMP framework. Your one-page plan is assembled as you type, with a checklist.",
      trend: "Enter a monthly HR metric (e.g., attrition %). The tool describes it, fits a trend line, forecasts the next three months and compares the forecast with your target.",
      metrics: "Enter your organisation's figures. The calculator works out recruitment, training and performance metrics.",
      survey: "Plan an employee survey: how many responses you need, and the eNPS from your results.",
      clean: "Paste employee data as CSV (first row = column names). The tool profiles the data, cleans it like Power Query and builds a mini HR dashboard.",
      wfp: "Enter your workforce assumptions. The planner forecasts supply, demand and hiring needs year by year.",
      ninebox: "List employees one per line as: name, performance (1–3), potential (1–3). The tool places them on the 9-box grid and suggests actions."
    }[l.tool] + "</p>";
    if (l.tool === "stats") h += inp("s_in", SAL.join(", "), "Values (separated by commas or spaces)", "e.g. 42, 45, 48", "decimal") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Describe the data</button></div>';
    if (l.tool === "lamp") h += inp("l_prob", "First-year attrition of graduate trainees is 32% vs 14% overall", "Business problem", "") + inp("l_logic", "Structured mentoring builds confidence faster, which leads to fewer first-year exits and lower hiring costs", "Logic: the cause-and-effect story", "") +
      inp("l_meas", "12-month retention rate, time to productivity, number of mentor meetings", "Measures (separate with commas)", "") + sel("l_ana", [["Compare groups (e.g., mentored vs not)", "Compare groups (e.g., mentored vs not)"], ["Trend analysis over time", "Trend analysis over time"], ["Correlation / regression", "Correlation / regression"], ["Predictive model", "Predictive model"], ["Survey analysis", "Survey analysis"]], "Compare groups (e.g., mentored vs not)", "Analytics: how will you test the logic?") +
      inp("l_proc", "Present to the CHRO in the quarterly review; scale mentoring if retention improves by 10 points", "Process: who decides, and what action follows?", "");
    if (l.tool === "trend") h += '<div class="grid g2">' + inp("t_in", ATTR.join(", "), "Monthly values (oldest first)", "", "decimal") + inp("t_tgt", "1.5", "Target (same unit)", "", "decimal") + "</div>" + sel("t_dir", [["low", "Lower is better (e.g., attrition)"], ["high", "Higher is better (e.g., engagement)"]], "low", "Direction");
    if (l.tool === "metrics") h += '<div class="grid g2">' + inp("m_hs", MET.hs, "Headcount at start of year", "", "numeric") + inp("m_he", MET.he, "Headcount at end of year", "", "numeric") + inp("m_sep", MET.sep, "Separations (leavers)", "", "numeric") + inp("m_hires", MET.hires, "Hires", "", "numeric") +
      inp("m_rcost", MET.rcost, "Total recruitment cost (₹)", "", "numeric") + inp("m_days", MET.days, "Average days to hire", "", "decimal") + inp("m_offers", MET.offers, "Offers made", "", "numeric") + inp("m_acc", MET.acc, "Offers accepted", "", "numeric") +
      inp("m_tcost", MET.tcost, "Training cost (₹)", "", "numeric") + inp("m_trained", MET.trained, "Employees trained", "", "numeric") + inp("m_tben", MET.tben, "Estimated training benefit (₹)", "", "numeric") + inp("m_meets", MET.meets, "Employees meeting or exceeding targets", "", "numeric") + "</div>" + inp("m_rev", MET.rev, "Annual revenue (₹)", "", "numeric");
    if (l.tool === "survey") h += '<h4 style="margin:0 0 8px">Sample size</h4><div class="grid g2">' + inp("v_N", SURV.N, "Number of employees (population)", "", "numeric") + sel("v_conf", [["90", "90%"], ["95", "95%"], ["99", "99%"]], SURV.conf, "Confidence level") + inp("v_moe", SURV.moe, "Margin of error (± %)", "", "decimal") + inp("v_rr", "60", "Expected response rate (%)", "", "decimal") + "</div>" +
      '<h4 style="margin:14px 0 8px">eNPS</h4><div class="grid g3">' + inp("v_pro", SURV.pro, "Promoters (9–10)", "", "numeric") + inp("v_pas", SURV.pas, "Passives (7–8)", "", "numeric") + inp("v_det", SURV.det, "Detractors (0–6)", "", "numeric") + "</div>";
    if (l.tool === "clean") h += ta("c_in", CSV, 11, "Employee data (CSV)") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Clean and build dashboard</button></div>';
    if (l.tool === "wfp") h += '<div class="grid g3">' + inp("w_hc", WFP.hc, "Current headcount", "", "numeric") + inp("w_attr", WFP.attr, "Annual attrition (%)", "", "decimal") + inp("w_ret", WFP.ret, "Retirements per year", "", "numeric") + inp("w_growth", WFP.growth, "Business growth per year (%)", "", "decimal") + inp("w_prod", WFP.prod, "Productivity gain per year (%)", "", "decimal") + inp("w_years", WFP.years, "Years to plan (1–10)", "", "numeric") + "</div>";
    if (l.tool === "ninebox") h += ta("n_in", NINE, 9, "Employees: name, performance (1–3), potential (1–3)") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Place on the grid</button></div>';
    return h + '<div id="cout" class="res" aria-live="polite"></div></div>';
  }

  function runStats() {
    var r = nums(val("s_in")); if (r.e) return err(r.e);
    var a = r.a; if (!a.length) return err("Please enter at least one number.");
    var s = S.sorted(a), m = S.mean(a), md = S.median(a), mo = S.modes(a), sd = S.sd(a), gap = md !== 0 ? Math.abs(m - md) / Math.abs(md) : 0;
    var q1 = S.median(s.slice(0, Math.floor(s.length / 2))), q3 = S.median(s.slice(Math.ceil(s.length / 2))), iqr = q3 - q1;
    var outl = s.length >= 4 ? s.filter(function (x) { return x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr; }) : [];
    return "<div><b>Sorted:</b></div>" + chips(s.map(fmt), function (x, i) { return outl.indexOf(s[i]) >= 0 ? "hl" : ""; }) +
      '<div class="kv"><span>n = ' + a.length + "</span><span>Mean = " + fmt(m) + "</span><span>Median = " + fmt(md) + "</span><span>Mode = " + (mo.length ? mo.map(fmt).join(", ") : "none") + "</span><span>Range = " + fmt(s[s.length - 1] - s[0]) + "</span><span>SD = " + fmt(sd) + "</span><span>Outliers: " + (outl.length ? outl.map(fmt).join(", ") : "none") + "</span></div>" +
      '<div class="note">' + (gap > 0.1 ? "The mean and median differ by more than 10%, so the data are skewed" + (outl.length ? " (see the highlighted outliers)" : "") + ". Report the median as the typical value." : "The mean and median are close, so the mean is a fair summary of a typical value.") + "</div>";
  }
  function runLamp() {
    var p = val("l_prob").trim(), lg = val("l_logic").trim(), ms = val("l_meas").split(",").map(function (x) { return x.trim(); }).filter(Boolean), an = val("l_ana"), pr = val("l_proc").trim();
    if (!p) return err("Describe the business problem first.");
    var plan = "HR ANALYTICS PLAN\nProblem: " + p + "\nLogic: " + (lg || "–") + "\nMeasures: " + (ms.join("; ") || "–") + "\nAnalytics: " + an + "\nProcess: " + (pr || "–");
    var causal = /because|leads? to|→|->|so that|which|results? in|drives?|causes?/i.test(lg), meas = ms.length >= 2, numb = /\d/.test(p), proc = /(chro|head|manager|director|leader|ceo|committee|board|review)/i.test(pr), act = /(if|scale|launch|change|stop|invest|roll)/i.test(pr);
    return '<h4 style="margin:0 0 4px">Your one-page plan</h4>' + out("lout", plan) + copyRow("lout") +
      '<ul class="clean" style="list-style:none;padding:0">' + tick(numb, "Problem is measurable (includes a number)") + tick(causal, "Logic states a cause-and-effect chain (e.g., “leads to”, “because”)") + tick(meas, "At least two measures") + tick(proc, "Process names a decision-maker or forum") + tick(act, "Process states the action that will follow") + "</ul>";
  }
  function trendChart(y, f, k) {
    var W = 560, H = 210, L = 40, B = 176, T = 14, all = y.concat([1, 2, 3].map(function (i) { return f.a + f.b * (y.length + i); })), n = all.length;
    var mn = Math.min.apply(null, all), mx = Math.max.apply(null, all); if (mx === mn) { mx += 1; mn -= 1; } var pad = (mx - mn) * 0.1; mn -= pad; mx += pad;
    function X(i) { return L + i * (W - L - 16) / (n - 1); } function Y(v) { return B - (v - mn) / (mx - mn) * (B - T); }
    var g = '<svg class="bp" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Trend and forecast">';
    [mn + pad, (mn + mx) / 2, mx - pad].forEach(function (v) { g += '<line x1="' + L + '" y1="' + Y(v).toFixed(1) + '" x2="' + (W - 10) + '" y2="' + Y(v).toFixed(1) + '" stroke="#E4E5F5"/><text x="' + (L - 6) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#6E6C94" font-family="Outfit,sans-serif">' + fmt(v) + "</text>"; });
    if (isFinite(k)) g += '<line x1="' + L + '" y1="' + Y(k).toFixed(1) + '" x2="' + (W - 10) + '" y2="' + Y(k).toFixed(1) + '" stroke="#22C55E" stroke-dasharray="6 4" stroke-width="2"/>';
    g += '<line x1="' + X(0) + '" y1="' + Y(f.a + f.b).toFixed(1) + '" x2="' + X(n - 1) + '" y2="' + Y(f.a + f.b * n).toFixed(1) + '" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4 3"/>';
    g += '<polyline fill="none" stroke="#4F46E5" stroke-width="3" points="' + y.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ") + '"/>';
    all.forEach(function (v, i) { g += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4" fill="' + (i < y.length ? "#4F46E5" : "#F59E0B") + '"/>'; });
    return g + "</svg>" + '<p class="small muted">Blue: actual · Orange: trend line and 3-month forecast · Green dashed: target</p>';
  }
  function runTrend() {
    var r = nums(val("t_in"), 120); if (r.e) return err(r.e);
    var y = r.a; if (y.length < 3) return err("Enter at least 3 monthly values.");
    var k = n("t_tgt"), dir = val("t_dir"), f = S.fit(y), fc = [1, 2, 3].map(function (i) { return f.a + f.b * (y.length + i); });
    var ch = y.slice(1).map(function (v, i) { return v - y[i]; }), big = 0; ch.forEach(function (c, i) { if (Math.abs(c) > Math.abs(ch[big])) big = i; });
    var bad = isFinite(k) && (dir === "low" ? fc[2] > k : fc[2] < k);
    var trendWord = Math.abs(f.b) < 1e-9 ? "flat" : (f.b > 0 ? "rising" : "falling");
    return trendChart(y, f, k) + tbl(["Type", "Result"], [
      ["Descriptive", "Average = " + fmt(S.mean(y)) + ", from " + fmt(y[0]) + " to " + fmt(y[y.length - 1]) + " (min " + fmt(Math.min.apply(null, y)) + ", max " + fmt(Math.max.apply(null, y)) + ")"],
      ["Diagnostic", "Largest month-to-month change: " + (ch[big] >= 0 ? "+" : "") + fmt(ch[big]) + " in period " + (big + 2) + ". Investigate what happened then."],
      ["Predictive", "Trend ŷ = " + fmt(f.a) + (f.b < 0 ? " − " : " + ") + fmt(Math.abs(f.b)) + "t (" + trendWord + "). Next 3 periods: " + fc.map(fmt).join(", ")],
      ["Prescriptive", !isFinite(k) ? "Enter a target to get a recommendation." : (bad ? "⚠️ The forecast misses the target of " + fmt(k) + ". Find the drivers (diagnostic) and act now, e.g., stay interviews, pay review, manager coaching." : "✅ The forecast meets the target of " + fmt(k) + ". Keep monitoring monthly.")]]) +
      '<div class="note">A straight-line trend is a simple forecast. Seasonality, policy changes or one-off events can make reality differ.</div>';
  }
  function runMetrics() {
    var f = ["hs", "he", "sep", "hires", "rcost", "days", "offers", "acc", "tcost", "trained", "tben", "meets", "rev"], v = {};
    for (var i = 0; i < f.length; i++) { v[f[i]] = n("m_" + f[i]); if (!isFinite(v[f[i]]) || v[f[i]] < 0) return err("Enter a number of zero or more in every box."); }
    var avg = (v.hs + v.he) / 2; if (avg <= 0) return err("Headcount must be greater than zero.");
    if (v.acc > v.offers) return err("Offers accepted cannot be more than offers made.");
    function d(a, b, fn) { return b > 0 ? fn(a / b) : "n/a"; }
    var rows = [
      ["Recruitment", "Cost per hire", d(v.rcost, v.hires, inr)], ["Recruitment", "Average time to hire", fmt(v.days) + " days"], ["Recruitment", "Offer acceptance rate", d(v.acc, v.offers, pct)], ["Recruitment", "Hiring rate", pct(v.hires / avg)],
      ["Training", "Training cost per employee trained", d(v.tcost, v.trained, inr)], ["Training", "Training coverage", pct(Math.min(v.trained, avg) / avg)], ["Training", "Training ROI", v.tcost > 0 ? pct((v.tben - v.tcost) / v.tcost, 0) : "n/a"],
      ["Performance", "Average headcount", num(avg)], ["Performance", "Attrition rate", pct(v.sep / avg)], ["Performance", "Employees meeting targets", pct(v.meets / avg)], ["Performance", "Revenue per employee", inr(v.rev / avg)], ["Performance", "Net headcount growth", pct((v.he - v.hs) / Math.max(1, v.hs))]];
    return tbl(["Area", "Metric", "Value"], rows.map(function (r) { return [r[0], r[1], "<b>" + r[2] + "</b>"]; })) +
      '<div class="note">Compare these with last year and with industry benchmarks. A metric becomes a KPI when you set a target for it.</div>';
  }
  function runSurvey() {
    var N = n("v_N"), z = { "90": 1.645, "95": 1.96, "99": 2.576 }[val("v_conf")], e = n("v_moe") / 100, rr = n("v_rr"), h = "";
    if (!(N > 0) || !(e > 0 && e < 1)) h += err("Enter a population above zero and a margin of error between 0 and 100%.");
    else {
      var n0 = z * z * 0.25 / (e * e), ns = Math.ceil(n0 / (1 + (n0 - 1) / N));
      h += '<div class="kv"><span>Without population correction: ' + Math.ceil(n0) + "</span><span>Responses needed: " + ns + "</span><span>" + pct(ns / N) + " of employees</span>" + (rr > 0 && rr <= 100 ? "<span>Invite at least " + Math.min(N, Math.ceil(ns / (rr / 100))) + " (at " + fmt(rr) + "% response)</span>" : "") + "</div>" +
        (rr > 0 && ns / (rr / 100) > N ? '<div class="note">At this response rate you cannot reach the target by sampling: survey everyone and work to raise the response rate.</div>' : "");
    }
    var p = n("v_pro"), q = n("v_pas"), d = n("v_det");
    if (![p, q, d].every(function (x) { return isFinite(x) && x >= 0; })) return h + err("Enter promoters, passives and detractors as counts of zero or more.");
    var t = p + q + d; if (!t) return h + err("Enter at least one eNPS response.");
    var e2 = (p - d) / t * 100;
    return h + '<div class="kv"><span>Responses: ' + t + "</span><span>Promoters: " + pct(p / t) + "</span><span>Detractors: " + pct(d / t) + "</span><span>eNPS = " + fmt(e2) + "</span></div>" +
      hbars([["Promoters", p, pct(p / t)], ["Passives", q, pct(q / t)], ["Detractors", d, pct(d / t)]], "var(--accent)") +
      '<div class="note">' + (e2 > 30 ? "Strong: clearly more promoters than detractors." : e2 > 0 ? "Positive: more promoters than detractors. Look at what detractors say to improve further." : "Negative or zero: detractors match or outnumber promoters. Follow up with focus groups to find the causes.") + "</div>";
  }
  function parseCsv(t) {
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
      else if (c === '"') q = true; else if (c === ",") { row.push(cur); cur = ""; } else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; } else if (c !== "\r") cur += c;
    }
    row.push(cur); rows.push(row);
    return rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ""; }); });
  }
  function runClean() {
    var raw = val("c_in"); if (!raw.trim()) return err("Paste CSV data with a header row.");
    var rows = parseCsv(raw); if (rows.length < 2) return err("Enter a header row and at least one data row.");
    if (rows.length > 5001) return err("Please paste 5,000 rows or fewer.");
    var head = rows[0].map(function (x) { return x.trim(); }), data = rows.slice(1), nc = head.length;
    var bad = data.filter(function (r) { return r.length !== nc; }).length;
    data = data.map(function (r) { var o = r.slice(0, nc); while (o.length < nc) o.push(""); return o; });
    /* profile */
    var seen = {}, dupes = 0, uniq = [];
    data.forEach(function (r) { var k = r.map(function (x) { return x.trim().toLowerCase(); }).join("\u0001"); if (seen[k]) dupes++; else { seen[k] = 1; uniq.push(r); } });
    var miss = head.map(function (h, j) { return uniq.filter(function (r) { return r[j].trim() === ""; }).length; });
    var fixes = [], numCols = [];
    var clean = uniq.map(function (r) { return r.map(function (x) { return x.trim(); }); });
    head.forEach(function (h, j) {
      var vals = clean.map(function (r) { return r[j]; }).filter(function (x) { return x !== ""; });
      if (vals.length && vals.every(function (x) { return isFinite(Number(x.replace(/,/g, ""))); })) { numCols.push(j); return; }
      var groups = {};
      vals.forEach(function (x) { var k = x.toLowerCase(); (groups[k] = groups[k] || {})[x] = ((groups[k] || {})[x] || 0) + 1; });
      var canon = {};
      Object.keys(groups).forEach(function (k) { var vs = groups[k], best = Object.keys(vs).sort(function (a, b) { return vs[b] - vs[a] || (b === b.toUpperCase()) - (a === a.toUpperCase()); })[0]; canon[k] = best; if (Object.keys(vs).length > 1) fixes.push(esc(h) + ": " + Object.keys(vs).map(function (x) { return "“" + esc(x) + "”"; }).join(", ") + " → “" + esc(best) + "”"); });
      clean.forEach(function (r) { if (r[j] !== "") r[j] = canon[r[j].toLowerCase()]; });
    });
    var trimmed = uniq.reduce(function (s, r) { return s + r.filter(function (x) { return x !== x.trim(); }).length; }, 0);
    function col(re) { for (var j = 0; j < nc; j++) if (re.test(head[j])) return j; return -1; }
    var dj = col(/^(dept|department|function|division|team)$/i), sj = col(/^(status|employment ?status|active)$/i), pj = col(/^(salary|ctc|pay|monthly ?salary|annual ?salary)$/i), gj = col(/^(gender|sex)$/i), ij = col(/^(emp ?id|employee ?id|id)$/i);
    var idDup = 0; if (ij >= 0) { var ids = {}; clean.forEach(function (r) { if (r[ij]) { if (ids[r[ij]]) idDup++; ids[r[ij]] = 1; } }); }
    var h = "<h4 style=\"margin:0 0 6px\">1 · Data profile</h4>" + '<div class="kv"><span>Rows: ' + data.length + "</span><span>Columns: " + nc + "</span><span>Exact duplicate rows: " + dupes + "</span><span>Cells with extra spaces: " + trimmed + "</span>" + (bad ? "<span>Rows with wrong number of fields: " + bad + "</span>" : "") + "</div>" +
      tbl(["Column", "Missing", "Type"], head.map(function (hh, j) { return [esc(hh), miss[j] ? '<b style="color:var(--red-fg)">' + miss[j] + "</b>" : "0", numCols.indexOf(j) >= 0 ? "Number" : "Text"]; }));
    h += "<h4 style=\"margin:12px 0 6px\">2 · Cleaning steps applied</h4><ul class=\"clean\">" +
      "<li>Removed " + dupes + " duplicate row" + (dupes === 1 ? "" : "s") + " (Power Query: Remove duplicates)</li><li>Trimmed spaces in " + trimmed + " cell" + (trimmed === 1 ? "" : "s") + " (Transform → Format → Trim)</li>" +
      (fixes.length ? fixes.map(function (f) { return "<li>Standardised " + f + " (Replace values)</li>"; }).join("") : "<li>No inconsistent spellings found</li>") +
      "<li>Missing values kept and flagged; they are left out of averages</li>" + (idDup ? '<li><b>Warning:</b> ' + idDup + " employee ID" + (idDup > 1 ? "s appear" : " appears") + " more than once with different details. Check these by hand.</li>" : "") + "</ul>";
    var N = clean.length, cards = ['<span>Headcount: ' + N + "</span>"];
    var leftRe = /^(left|exited|resigned|terminated|inactive|separated|no|0)$/i, left = sj >= 0 ? clean.filter(function (r) { return leftRe.test(r[sj]); }).length : 0;
    if (sj >= 0) cards.push("<span>Leavers: " + left + "</span><span>Attrition: " + pct(left / N) + "</span>");
    var pays = pj >= 0 ? clean.map(function (r) { return Number(r[pj].replace(/,/g, "")); }).filter(function (x, i) { return clean[i][pj] !== "" && isFinite(x); }) : [];
    if (pays.length) cards.push("<span>Average salary: " + inr(S.mean(pays)) + "</span><span>Median salary: " + inr(S.median(pays)) + "</span>");
    h += "<h4 style=\"margin:12px 0 6px\">3 · Dashboard</h4>" + '<div class="kv">' + cards.join("") + "</div>";
    var grid = [];
    if (dj >= 0) {
      var by = {}; clean.forEach(function (r) { var k = r[dj] || "(blank)"; by[k] = by[k] || { n: 0, l: 0, p: [] }; by[k].n++; if (sj >= 0 && leftRe.test(r[sj])) by[k].l++; if (pj >= 0 && r[pj] !== "" && isFinite(Number(r[pj].replace(/,/g, "")))) by[k].p.push(Number(r[pj].replace(/,/g, ""))); });
      var ks = Object.keys(by).sort(function (a, b) { return by[b].n - by[a].n; }).slice(0, 15);
      grid.push('<div class="card"><b>Headcount by ' + esc(head[dj].toLowerCase()) + "</b>" + hbars(ks.map(function (k) { return [k, by[k].n]; })) + "</div>");
      if (sj >= 0) grid.push('<div class="card"><b>Attrition by ' + esc(head[dj].toLowerCase()) + "</b>" + hbars(ks.map(function (k) { return [k, by[k].l / by[k].n, pct(by[k].l / by[k].n)]; }), "#F59E0B") + "</div>");
      if (pays.length) grid.push('<div class="card"><b>Average salary by ' + esc(head[dj].toLowerCase()) + "</b>" + hbars(ks.filter(function (k) { return by[k].p.length; }).map(function (k) { return [k, S.mean(by[k].p), inr(S.mean(by[k].p))]; }), "#22C55E") + "</div>");
    }
    if (gj >= 0) { var gg = {}; clean.forEach(function (r) { var k = r[gj] || "(blank)"; gg[k] = (gg[k] || 0) + 1; }); grid.push('<div class="card"><b>' + esc(head[gj]) + " mix</b>" + hbars(Object.keys(gg).map(function (k) { return [k, gg[k], gg[k] + " (" + pct(gg[k] / N) + ")"]; }), "#0EA5E9") + "</div>"); }
    if (grid.length) h += '<div class="grid g2" style="margin-top:8px">' + grid.join("") + "</div>";
    else h += '<p class="muted small">Add columns named Department, Status, Salary or Gender to see charts.</p>';
    return h;
  }
  function runWfp() {
    var p = { hc: n("w_hc"), attr: n("w_attr"), ret: n("w_ret"), growth: n("w_growth"), prod: n("w_prod"), years: n("w_years") };
    if (!Object.keys(p).every(function (k) { return isFinite(p[k]); })) return err("Enter a number in every box.");
    if (p.hc <= 0) return err("Current headcount must be greater than zero.");
    if (p.attr < 0 || p.attr > 100 || p.ret < 0 || p.prod <= -100 || p.growth <= -100) return err("Check the values: attrition must be 0–100%, retirements 0 or more, and growth or productivity above −100%.");
    p.years = Math.round(p.years); if (p.years < 1 || p.years > 10) return err("Plan for 1 to 10 years.");
    var r = wfpPlan(p), tot = r.reduce(function (s, x) { return s + Math.max(0, x.gap); }, 0);
    return tbl(["Year", "Start headcount", "Expected to leave", "Supply", "Demand", "Gap"], r.map(function (x) { return [x.y, num(x.start), num(x.leave), num(x.sup), num(x.dem), "<b>" + (x.gap >= 0 ? num(x.gap) + " to hire" : num(-x.gap) + " surplus") + "</b>"]; })) +
      '<div class="kv"><span>Total hiring over ' + p.years + " year" + (p.years > 1 ? "s" : "") + ": " + num(tot) + "</span><span>Of which to replace leavers: " + num(r.reduce(function (s, x) { return s + Math.min(Math.max(0, x.gap), x.leave); }, 0)) + "</span></div>" +
      hbars(r.map(function (x) { return ["Year " + x.y + " hires", Math.max(0, x.gap), num(Math.max(0, x.gap))]; })) +
      '<div class="note">' + (r.some(function (x) { return x.gap < 0; }) ? "Some years show a surplus: plan redeployment, reskilling or a hiring freeze." : "Close the gap with a mix of external hiring, internal moves, upskilling and retention; cutting attrition by a few points reduces hiring needs sharply.") + "</div>";
  }
  function runNine() {
    var lines = val("n_in").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean), emps = [];
    if (!lines.length) return err("Enter at least one employee.");
    if (lines.length > 200) return err("Please enter 200 employees or fewer.");
    for (var i = 0; i < lines.length; i++) {
      var p = lines[i].split(",").map(function (x) { return x.trim(); });
      if (p.length !== 3) return err("Line " + (i + 1) + " needs 3 parts: name, performance, potential.");
      var f = Number(p[1]), q = Number(p[2]);
      if ([1, 2, 3].indexOf(f) < 0 || [1, 2, 3].indexOf(q) < 0) return err("Line " + (i + 1) + ": performance and potential must each be 1, 2 or 3.");
      emps.push({ n: p[0] || "Employee " + (i + 1), f: f, q: q });
    }
    var g = '<div class="tscroll"><table><tr><th>Potential ↓ / Performance →</th><th>Low (1)</th><th>Medium (2)</th><th>High (3)</th></tr>';
    [3, 2, 1].forEach(function (q) {
      g += "<tr><th>" + ["", "Low (1)", "Medium (2)", "High (3)"][q] + "</th>" + [1, 2, 3].map(function (f) {
        var b = NB[q + "" + f], who = emps.filter(function (e) { return e.f === f && e.q === q; }).map(function (e) { return esc(e.n); });
        var bg = q + f >= 5 ? "#ECFDF5" : (q + f <= 3 ? "#FFF5F5" : "#fff");
        return '<td style="background:' + bg + ';vertical-align:top;min-width:130px"><b>' + b[0] + '</b><div class="small" style="margin-top:4px">' + (who.length ? who.join(", ") : '<span class="muted">–</span>') + "</div></td>";
      }).join("") + "</tr>";
    });
    g += "</table></div>";
    var pool = emps.filter(function (e) { return (e.q === 3 && e.f >= 2) || (e.q === 2 && e.f === 3); }), risk = emps.filter(function (e) { return e.f === 1; });
    return g + '<div class="kv"><span>Employees: ' + emps.length + "</span><span>Succession pool: " + pool.length + " (" + pct(pool.length / emps.length, 0) + ")</span><span>Need performance support: " + risk.length + "</span></div>" +
      tbl(["Employee", "Box", "Suggested action"], emps.map(function (e) { var b = NB[e.q + "" + e.f]; return [esc(e.n), "<b>" + b[0] + "</b>", b[1]]; })) +
      '<div class="note">Calibrate ratings across managers before acting, and use the grid for development conversations, not labels.</div>';
  }

  function toolWire(l) {
    var cout = document.getElementById("cout");
    var R = { stats: runStats, lamp: runLamp, trend: runTrend, metrics: runMetrics, survey: runSurvey, clean: runClean, wfp: runWfp, ninebox: runNine };
    function run() { cout.innerHTML = R[l.tool](); }
    var go = document.getElementById("tgo"); if (go) go.onclick = run;
    var card = cout.parentElement;
    card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; run(); });
    card.addEventListener("change", function (e) { if (e.target.closest("#cout") || e.target.tagName !== "SELECT") return; run(); });
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
  var KEY = "hra_progress_v1";
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
    var h = '<section class="hero"><div><span class="tag">Free course · about 110 minutes</span><h1 style="margin-top:14px">HR Analytics</h1>' +
      '<p class="lead">Use people data to make better HR and business decisions.</p>' +
      '<p class="muted" style="margin-top:12px">For MBA/PGDM students, HR professionals and managers, with no prior analytics background needed. Work through eight short lessons, each with a teaching video or animated walkthrough, clear notes, a worked example and an interactive HR analytics tool you can try with your own data. Then pass the final test to earn your certificate.</p>' +
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
    var h = '<h1 style="font-size:clamp(30px,4vw,42px)">Course path</h1><p class="muted" style="margin:8px 0 22px">Lessons unlock one by one. The final test unlocks after all eight lessons.</p>';
    MODULES.forEach(function (m) {
      h += '<div class="card mod" style="margin-bottom:16px"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + "</h3>" + lessonList(m.n) +
        (LESSONS.filter(function (l) { return l.mod === m.n; }).every(function (l) { return st.done[l.id]; }) ? '<p style="margin-top:12px"><a href="#/recap/' + m.n + '">Module ' + m.n + " recap →</a></p>" : "") + "</div>";
    });
    h += '<div class="card"><h3>Final test and certificate</h3><p class="muted small" style="margin:6px 0 12px">20 questions · pass mark 70%</p>' +
      (allDone() ? '<a class="btn btn-accent" href="#/test">Take the final test</a>' : '<span class="tag grey">🔒 Complete all eight lessons to unlock</span>') +
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
    var mod = MODULES[l.mod - 1], url = (window.HRA_VIDEOS && window.HRA_VIDEOS[id]) || "";
    var h = '<div class="crumb"><a href="#/">Course home</a> › ' + mod.tag + ": " + mod.title + "</div>" +
      '<div class="lhead"><div><span class="tag indigo">Lesson ' + id + " of 8 · " + l.time + "</span><h1 style=\"font-size:clamp(30px,4.4vw,46px);margin-top:10px\">" + l.title + "</h1></div>" +
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
      "<tr><td><b>Fundamentals of HR analytics</b></td><td>HR as a strategic partner; start from a measurable business problem</td><td>Problem → hypotheses → data → model → action; median for skewed pay</td></tr>" +
      "<tr><td><b>Theoretical frameworks</b></td><td>LAMP and the HR value chain link people to business results</td><td>Logic + Analytics + Measures + Process</td></tr>" +
      "<tr><td><b>Types of HR analytics</b></td><td>Descriptive → diagnostic → predictive → prescriptive</td><td>Trend line ŷ = a + b·t</td></tr>" +
      "<tr><td><b>HR metrics and data types</b></td><td>Define metrics consistently; know nominal, ordinal, interval, ratio</td><td>Attrition = separations ÷ average headcount</td></tr></table>";
    var t2 = '<table><tr><th>Lesson</th><th>Key idea</th><th>Tool or formula</th></tr>' +
      "<tr><td><b>Capturing HR data</b></td><td>Primary (surveys, interviews) vs secondary (HRIS, payroll, reports)</td><td>Sample size n₀ = z²p(1 − p) ÷ e² · eNPS</td></tr>" +
      "<tr><td><b>Power BI</b></td><td>Get data → clean in Power Query → DAX measures → dashboard</td><td>Attrition % = DIVIDE([Leavers], [Headcount])</td></tr>" +
      "<tr><td><b>Workforce planning</b></td><td>Forecast demand and supply, close the gap</td><td>Gap = demand − [headcount × (1 − attrition) − retirements]</td></tr>" +
      "<tr><td><b>Talent management</b></td><td>Segment talent and plan succession and retention</td><td>9-box: performance × potential</td></tr></table>";
    var h = '<span class="tag indigo">Module ' + m + ' recap</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + MODULES[m - 1].title + '</h1><p class="muted" style="margin:8px 0 18px">The main ideas from each lesson, on one page.</p>' +
      '<div class="card tscroll">' + (m === 1 ? t1 : t2) + "</div>" +
      '<div class="card" style="margin-top:16px"><h3>Key takeaway</h3><p class="muted" style="margin-top:6px">' + (m === 1 ? "Start with a business problem and a clear logic, measure it consistently, and move step by step from describing what happened to recommending what to do." : "Good decisions need good data: collect it carefully, clean it before analysing it, and use it to plan the workforce and grow talent, fairly and transparently.") + "</p></div>" +
      '<p style="margin-top:20px">' + (m === 1 ? '<a class="btn btn-accent" href="#/lesson/2.1">Start Module 2: HR Data, Tools and Applications →</a>' : '<a class="btn btn-sun" href="#/test">Take the final test →</a>') + "</p>";
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
    if (!allDone()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>The final test is locked</h2><p class="muted" style="margin:10px 0 18px">Complete all eight lessons first (' + doneCount() + ' of 8 done).</p><a class="btn btn-accent" href="#/path">Go to the course path</a></div>';
    if (!T) {
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">HR Analytics: final test</h1>' +
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
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "HRA-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all eight lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">HR Analytics</h3>' +
      '<p class="muted small" style="margin-top:6px">Foundations of HR Analytics · HR Data, Tools and Applications</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
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
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text("HR Analytics", W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text("Foundations of HR Analytics  |  HR Data, Tools and Applications", W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited. Not an accredited qualification.", W / 2, H - 15, { align: "center" });
    sigPng(function (png) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 12.4);
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save("HR-Analytics-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option><option value="1">Module 1: Foundations</option><option value="2">Module 2: Data, tools and applications</option></select></div><div class="grid g2" id="gl"></div>';
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
    var titles = { home: "HR Analytics", path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || "HR Analytics") + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();

