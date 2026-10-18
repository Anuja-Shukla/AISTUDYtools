/* Coding for Non-Coders — course content and app (no external services; progress saved in localStorage) */
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
  function code(text) { return '<div class="pbox" style="background:#1E1B4B;color:#E0E7FF;border-color:#1E1B4B">' + esc(text) + "</div>"; }
  function tbl(head, rows) { return '<div class="tscroll"><table><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }

  /* running example: Prof. Mehta's class marks (fictional) */
  var MARKS = "Aarav, 78\nDiya, 64\nKabir, 39\nMeera, 91\nRohan, 55\nSana, 47";
  var STEPS0 = "Open the marks spreadsheet\nRead each student's name and marks\nIf marks are 40 or more, label the student Pass\nOtherwise label the student Fail\nCount how many students passed\nEmail the summary to the course coordinator";
  var CSV0 = "name,marks,section\nAarav,78,A\nDiya,64,B\nKabir,39,A\nMeera,91,B";
  var SPEC0 = { what: "a Google Sheets script that emails each student their marks", platform: "apps", inputs: "A sheet named Marks with columns Name, Email, Marks", outputs: "One email per student with the subject \"Your marks\" and their score", rules: "Skip rows with an empty email. Do not send more than 100 emails a day. Add comments explaining each step.", example: "Row: Diya, diya@example.com, 64 → email to diya@example.com: \"Dear Diya, your marks are 64.\"" };
  var ERR0 = "Traceback (most recent call last):\n  File \"grades.py\", line 7, in <module>\n    total = total + row[\"Marks\"]\nTypeError: unsupported operand type(s) for +: 'int' and 'str'";
  var QUIZ0 = "What does a loop do? | Repeats steps | Stores one value | Deletes a file\nWhich symbol often means \"is equal to\" in code? | == | => | ><\nWhat is a variable? | A named box that stores a value | A type of error | A web browser";

  function grade(m, pass, dist) { return m >= dist ? "Distinction" : m >= pass ? "Pass" : "Fail"; }
  function parseMarks(t) {
    var rows = [], bad = 0;
    t.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (l) { var i = l.lastIndexOf(","), nm = l.slice(0, i).trim(), v = Number(l.slice(i + 1).trim()); if (i < 1 || !isFinite(v)) bad++; else rows.push([nm, v]); });
    return { rows: rows, bad: bad };
  }

  var LESSONS = [
    {
      id: "1.1", mod: 1, title: "What Is Code? Thinking in Steps", time: "12 min", tool: "steps",
      outcomes: ["Explain what code is: precise instructions a computer follows", "Describe a program as input → process → output", "Break a task into clear, ordered steps (an algorithm)", "Explain how AI assistants now write code from plain-English requests"],
      notes: "<p><b>Code</b> is a set of precise instructions that a computer follows. Computers are fast but literal: they do exactly what they are told, in order, and cannot guess what you meant. Programming is mostly the skill of <b>breaking a task into small, unambiguous steps</b>, called an <b>algorithm</b>.</p>" +
        "<p style=\"margin-top:10px\">Almost every program follows the same pattern: <b>input → process → output</b>. A grade calculator takes marks (input), applies rules such as “40 or more is a pass” (process) and shows results (output). Spreadsheets already work this way: a formula like <code>=IF(B2>=40,\"Pass\",\"Fail\")</code> is a small piece of code.</p>" +
        "<p style=\"margin-top:10px\">Code is written in <b>programming languages</b>. <b>Python</b> is popular for data and automation, <b>JavaScript</b> runs in every web browser, <b>HTML and CSS</b> describe web pages, and <b>Google Apps Script</b> automates Google Sheets, Docs and Gmail. You do not need to memorise any of them to start.</p>" +
        "<p style=\"margin-top:10px\">Today, <b>AI assistants</b> such as ChatGPT, Claude, Gemini and GitHub Copilot can write code from a plain-English description. Building software this way, by describing what you want and refining the result, is sometimes called <b>“vibe coding”</b>. Your job shifts from typing code to <b>describing the task clearly, checking the result and fixing problems</b>, which is exactly what this course teaches.</p>",
      formula: "Program = input → process (steps and rules) → output<small>an algorithm is a clear, ordered list of steps that always ends</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">You already “code” more than you think</h4>" +
          tbl(["Everyday task", "Input", "Process", "Output"], [
            ["Spreadsheet formula", "Marks in column B", "=IF(B2>=40,\"Pass\",\"Fail\")", "Pass or Fail"],
            ["Recipe", "Ingredients", "Ordered steps with quantities and times", "A dish"],
            ["Email filter rule", "Incoming emails", "If the sender is the registrar, move to “Admin”", "Sorted inbox"],
            ["Google Form + Sheet", "Form responses", "Totals and charts update automatically", "Live summary"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Prof. Mehta (fictional) wants to automate a weekly task: label each student Pass or Fail and email the coordinator a summary.</p>" +
          '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag" style="background:var(--red);color:var(--red-fg)">Vague</span>' + box("Sort out the marks and tell the coordinator.", "weak") + '</div><div><span class="tag mint">Algorithm</span>' + box(STEPS0.split("\n").map(function (s, i) { return (i + 1) + ". " + s; }).join("\n"), "good") + "</div></div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">The second version is something a computer, or an AI writing code for you, can follow: each step is one action, the rule has a number (40) and the order is clear.</p>";
      },
      use: ["Write the steps in plain English before you ask an AI to write any code.", "Use input → process → output to check that nothing is missing.", "Mistake: vague steps like “sort it out” or “handle the data”.", "Mistake: forgetting edge cases, such as a student with no marks entered."],
      walk: function () {
        return [
          { t: "Computers are literal", c: "They follow instructions exactly, in order.", h: box("“Make tea” ✗   →   “Boil 200 ml water for 3 minutes” ✓", "") },
          { t: "Input → process → output", c: "The pattern behind almost every program.", h: chips(["Marks", "Rule: 40 or more = Pass", "Pass / Fail list"], function (x, i) { return ["ac", "hl", "mi"][i]; }) },
          { t: "Break it into steps", c: "One clear action per step.", h: chips(["Open sheet", "Read marks", "Apply rule", "Count passes", "Email summary"], "ac") },
          { t: "Languages", c: "Python, JavaScript, HTML and Apps Script are common choices.", h: chips(["Python", "JavaScript", "HTML/CSS", "Apps Script"], "ac") },
          { t: "AI writes, you direct", c: "Describe clearly, check the result, fix problems.", h: '<div class="big">You = the designer and tester</div>' }
        ];
      },
      qc: [
        { q: "In a grade calculator, which part is the “process”?", o: ["The rule that 40 or more is a pass", "The list of marks", "The printed result list", "The computer screen"], a: 0, e: "Marks are input, the rule is the process, and the result list is the output." },
        { q: "Which instruction is clearest for a computer?", o: ["If marks are 40 or more, write Pass; otherwise write Fail", "Mark the good students", "Handle the marks properly", "Do the usual"], a: 0, e: "It is specific, has a number and covers both cases." }
      ]
    },
    {
      id: "1.2", mod: 1, title: "Variables, Conditions and Loops", time: "13 min", tool: "logic",
      outcomes: ["Explain variables as named boxes that store values", "Use conditions (if/else) to make decisions", "Use loops to repeat steps for every item in a list", "Read short Python code that combines all three"],
      notes: "<p>Three building blocks appear in almost every program.</p>" +
        "<p style=\"margin-top:10px\"><b>Variables</b> are named boxes that store a value: <code>pass_mark = 40</code> or <code>name = \"Diya\"</code>. Values have <b>types</b>: numbers, text (called <b>strings</b>, written in quotes), true/false values (<b>booleans</b>) and <b>lists</b> of several values. Mixing types by mistake (adding the text \"64\" to the number 10) is one of the most common errors.</p>" +
        "<p style=\"margin-top:10px\"><b>Conditions</b> make decisions: <code>if marks >= 40:</code> do one thing, <code>else:</code> do another. They use comparisons: <code>==</code> (equal to), <code>!=</code> (not equal), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, combined with <code>and</code>, <code>or</code> and <code>not</code>.</p>" +
        "<p style=\"margin-top:10px\"><b>Loops</b> repeat steps: <code>for student in students:</code> runs the same steps for every student, whether there are 6 or 6,000. This is where code saves the most time compared with doing things by hand.</p>" +
        "<p style=\"margin-top:10px\">In Python, <b>indentation</b> (the spaces at the start of a line) shows which lines belong inside an <code>if</code> or a loop. Other languages use curly brackets <code>{ }</code> instead. You will see these patterns in every piece of code an AI writes for you.</p>",
      formula: "variable = value · if condition: … else: … · for item in list: …<small>== means “is equal to”; a single = stores a value</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">The same idea in a spreadsheet, Python and JavaScript</h4>" +
          tbl(["Idea", "Spreadsheet", "Python", "JavaScript"], [
            ["Variable", "A named cell, e.g. PassMark", "pass_mark = 40", "let passMark = 40;"],
            ["Condition", "=IF(B2>=40,\"Pass\",\"Fail\")", "if marks >= 40: …", "if (marks >= 40) { … }"],
            ["Loop", "Fill the formula down the column", "for s in students: …", "for (const s of students) { … }"],
            ["Count", "=COUNTIF(C:C,\"Pass\")", "passed = passed + 1", "passed++"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A short Python program for Prof. Mehta's class. Read it line by line; the comments after # explain each step.</p>" +
          code("students = [(\"Aarav\", 78), (\"Diya\", 64), (\"Kabir\", 39)]   # a list\npass_mark = 40                                         # a variable\npassed = 0\n\nfor name, marks in students:                           # a loop\n    if marks >= pass_mark:                             # a condition\n        print(name, \"Pass\")\n        passed = passed + 1\n    else:\n        print(name, \"Fail\")\n\nprint(\"Passed:\", passed, \"of\", len(students))") +
          "<p class=\"muted small\" style=\"margin-top:10px\">Output: Aarav Pass · Diya Pass · Kabir Fail · Passed: 2 of 3. Try your own list and rules in the tool below.</p>";
      },
      use: ["Use clear variable names (pass_mark, not x) so you and others can read the code.", "Use loops whenever you would otherwise repeat the same step by hand.", "Mistake: using = (store) when you mean == (compare).", "Mistake: wrong indentation in Python, which changes what runs inside the loop."],
      walk: function () {
        return [
          { t: "Variables", c: "Named boxes that store values.", h: chips(["pass_mark = 40", "name = \"Diya\"", "marks = 64"], "ac") },
          { t: "Conditions", c: "If marks are 40 or more → Pass, else → Fail.", h: '<div class="chips"><span class="chip mi">64 ≥ 40 → Pass</span><span class="chip hl">39 ≥ 40? No → Fail</span></div>' },
          { t: "Loops", c: "Repeat the same steps for every student.", h: chips(["Aarav", "Diya", "Kabir", "Meera", "…"], "ac") },
          { t: "Together", c: "Loop through the list, apply the condition, update a counter.", h: code("for name, marks in students:\n    if marks >= 40: passed += 1") },
          { t: "Read, don't memorise", c: "You will recognise these patterns in any AI-written code.", h: '<div class="big">Variable · Condition · Loop</div>' }
        ];
      },
      qc: [
        { q: "In most programming languages, what does == mean?", o: ["Is equal to (a comparison)", "Store this value", "Add these numbers", "End of the line"], a: 0, e: "A single = stores a value; == compares two values." },
        { q: "You need to apply the same rule to 500 students. Which building block helps most?", o: ["A loop", "A single variable", "A comment", "A font"], a: 0, e: "A loop repeats the steps for every item in a list." }
      ]
    },
    {
      id: "1.3", mod: 1, title: "Working with Data: Tables, CSV and JSON", time: "12 min", tool: "json",
      outcomes: ["Describe how code stores data in lists and tables", "Read CSV and JSON, the two most common data formats", "Convert between a table and JSON", "Recognise libraries such as pandas that make data work easier"],
      notes: "<p>Most useful programs read, change and save <b>data</b>. Code stores it in <b>lists</b> (ordered items), <b>dictionaries or objects</b> (named fields, like <code>{\"name\": \"Diya\", \"marks\": 64}</code>) and <b>tables</b> (rows and columns, just like a spreadsheet).</p>" +
        "<p style=\"margin-top:10px\"><b>CSV</b> (comma-separated values) is a plain-text table: one row per line, values separated by commas, with column names in the first row. Every spreadsheet can save as CSV. <b>JSON</b> (JavaScript Object Notation) stores data as named fields inside curly brackets and lists inside square brackets. Websites and apps use JSON to send data to each other through <b>APIs</b> (application programming interfaces).</p>" +
        "<p style=\"margin-top:10px\">You rarely write data code from scratch. <b>Libraries</b> are ready-made code you can reuse. In Python, <b>pandas</b> reads a CSV into a table in one line (<code>pd.read_csv(\"marks.csv\")</code>) and can filter, sort, group and summarise it, much like a spreadsheet but repeatable on thousands of files.</p>" +
        "<p style=\"margin-top:10px\"><b>Clean data</b> matters: consistent column names, one value per cell, no merged cells, and the same format for dates and numbers. Messy data is the most common reason code “doesn't work”.</p>",
      formula: "CSV: name,marks → Diya,64 · JSON: {\"name\": \"Diya\", \"marks\": 64}<small>a list of JSON objects = a table; each object is a row</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Spreadsheet, CSV and JSON side by side</h4>" +
          tbl(["Spreadsheet", "CSV", "JSON"], [
            ["Header row: name | marks", "name,marks", "[ { \"name\": …, \"marks\": … }, … ]"],
            ["Row: Diya | 64", "Diya,64", "{ \"name\": \"Diya\", \"marks\": 64 }"],
            ["Good for people to edit", "Good for simple data exchange", "Good for apps, APIs and nested data"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Prof. Mehta exports marks as CSV and asks an AI for a pandas script to find the class average and the top student.</p>" +
          code("import pandas as pd\n\ndf = pd.read_csv(\"marks.csv\")          # read the table\nprint(df[\"marks\"].mean())              # class average\nprint(df.sort_values(\"marks\").tail(1)) # top student\ndf[df[\"marks\"] < 40].to_csv(\"support.csv\", index=False)  # students needing support") +
          "<p class=\"muted small\" style=\"margin-top:10px\">Four lines replace several minutes of manual work, and the same script works next term on a new file.</p>";
      },
      use: ["Use CSV to move tables between spreadsheets and code; use JSON for apps and APIs.", "Keep data clean: one header row, one value per cell, consistent formats.", "Mistake: numbers stored as text (e.g., \"64 \" with a space), which breaks calculations.", "Mistake: sharing files with personal data; remove or mask names and contact details."],
      walk: function () {
        return [
          { t: "Data as a table", c: "Rows and columns, like a spreadsheet.", h: chips(["name", "marks", "section"], "ac") + chips(["Diya", "64", "B"]) },
          { t: "CSV", c: "Plain text, commas between values.", h: code("name,marks,section\nDiya,64,B") },
          { t: "JSON", c: "Named fields in curly brackets; a list in square brackets.", h: code("[{\"name\": \"Diya\", \"marks\": 64, \"section\": \"B\"}]") },
          { t: "Libraries", c: "pandas reads a CSV in one line.", h: code("df = pd.read_csv(\"marks.csv\")") },
          { t: "Clean data first", c: "Most “broken code” is really messy data.", h: '<div class="big">One header · one value per cell</div>' }
        ];
      },
      qc: [
        { q: "What does each line of a CSV file usually represent?", o: ["One row of the table", "One column", "One chart", "One error"], a: 0, e: "The first line holds column names; each later line is a row." },
        { q: "Which is valid JSON for one student?", o: ["{\"name\": \"Diya\", \"marks\": 64}", "name = Diya; marks = 64", "<name>Diya</name>", "Diya | 64"], a: 0, e: "JSON uses curly brackets, quoted field names and colons." }
      ]
    },
    {
      id: "2.1", mod: 2, title: "Prompting AI to Write Code", time: "13 min", tool: "spec",
      outcomes: ["Write a clear code request: goal, platform, inputs, outputs, rules, example", "Choose a suitable platform: Python, Google Apps Script, a spreadsheet formula or a web page", "Iterate: ask for changes, explanations and tests", "Use AI coding tools safely"],
      notes: "<p>AI assistants write good code when you give them a good <b>specification</b> (spec): what to build, <b>where it will run</b>, the <b>inputs</b>, the <b>outputs</b>, the <b>rules and limits</b>, and an <b>example</b> of the expected result. This is the same thinking as an algorithm, written as a request.</p>" +
        "<p style=\"margin-top:10px\"><b>Choose the platform.</b> A <b>spreadsheet formula</b> for one calculation; <b>Google Apps Script</b> to automate Sheets, Docs, Forms and Gmail; <b>Python</b> for data analysis and file processing (it runs free in Google Colab, in the browser); an <b>HTML page</b> for a simple tool or quiz that anyone can open. Asking for the wrong platform is a common reason AI code “doesn't work”.</p>" +
        "<p style=\"margin-top:10px\"><b>Iterate.</b> Ask the AI to explain the code line by line, add comments, handle errors (empty cells, wrong formats), and give you test examples. Change one thing at a time. AI coding tools include chat assistants (ChatGPT, Claude, Gemini), assistants inside code editors (such as GitHub Copilot) and app builders that create and host a whole app from a description. Features change often; the skill of writing a clear spec does not.</p>" +
        "<p style=\"margin-top:10px\"><b>Safety.</b> Never paste passwords, API keys or students' personal data into prompts. Test on a copy of your data first. If you do not understand what a script does, ask before running it, especially anything that deletes, emails or pays.</p>",
      formula: "Code request = goal + platform + inputs + outputs + rules + example<small>then iterate: explain → test → improve, one change at a time</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Which platform for which job?</h4>" +
          tbl(["Job", "Good platform", "Where it runs"], [
            ["One calculation in a sheet", "Spreadsheet formula", "Excel or Google Sheets"],
            ["Email marks from a sheet, auto-fill Docs", "Google Apps Script", "Extensions → Apps Script in Google Sheets"],
            ["Clean and analyse many CSV files", "Python (pandas)", "Google Colab in the browser, or your computer"],
            ["A quiz or calculator anyone can open", "HTML + JavaScript page", "Any browser; host free on GitHub Pages"],
            ["Repeat clicks across office apps", "Power Automate or Zapier", "Cloud automation services"]]);
      },
      example: function () {
        return '<div class="grid g2" style="width:100%;text-align:left"><div><span class="tag" style="background:var(--red);color:var(--red-fg)">Weak request</span>' + box("Write code to email marks.", "weak") + '</div><div><span class="tag mint">Clear spec</span>' + box("Write a Google Apps Script for Google Sheets that emails each student their marks.\nInput: a sheet named Marks with columns Name, Email, Marks.\nOutput: one email per student, subject \"Your marks\".\nRules: skip rows with an empty email; no more than 100 emails a day; add comments.\nExample: Diya, diya@example.com, 64 → \"Dear Diya, your marks are 64.\"\nAlso tell me how to install and test it on a copy of the sheet.", "good") + "</div></div>";
      },
      use: ["Use a clear spec every time; save good prompts as templates.", "Ask for comments, error handling and test steps, not just the code.", "Mistake: not saying where the code will run.", "Mistake: pasting real personal data or API keys into an AI chat."],
      walk: function () {
        return [
          { t: "Start with a spec", c: "Goal, platform, inputs, outputs, rules, example.", h: chips(["Goal", "Platform", "Inputs", "Outputs", "Rules", "Example"], "ac") },
          { t: "Pick the platform", c: "Formula, Apps Script, Python or an HTML page.", h: chips(["Sheets formula", "Apps Script", "Python", "HTML page"], "mi") },
          { t: "Ask for explanations", c: "Line-by-line comments help you check the logic.", h: box("Explain this code line by line for a non-programmer.", "good") },
          { t: "Test on a copy", c: "Run on sample data before the real thing.", h: '<div class="big">Copy → test → check → use</div>' },
          { t: "Stay safe", c: "No passwords, keys or personal data in prompts.", h: chips(["No API keys", "No passwords", "Masked data"], "hl") }
        ];
      },
      qc: [
        { q: "Which detail most often makes AI-written code fail for non-coders when it is missing?", o: ["Where the code will run (the platform)", "The colour of the screen", "The author's name", "The number of lines"], a: 0, e: "Code for Python will not run in Google Sheets, and vice versa." },
        { q: "What should you do before running an AI-written script that sends emails?", o: ["Understand it and test it on a copy with sample data", "Run it on the real list immediately", "Paste your password into the code", "Delete the comments"], a: 0, e: "Test safely first, especially for actions that cannot be undone." }
      ]
    },
    {
      id: "2.2", mod: 2, title: "Reading Errors and Debugging", time: "13 min", tool: "debug",
      outcomes: ["Read an error message: type, line number and description", "Recognise the most common errors in Python, JavaScript and spreadsheets", "Debug step by step: reproduce, isolate, fix, retest", "Ask an AI for help with the error, the code and the context"],
      notes: "<p>Errors are normal: professional programmers see them all day. An error message is a <b>clue</b>, not a failure. Most messages tell you three things: the <b>type</b> of error (e.g., TypeError), <b>where</b> it happened (file and line number) and a short <b>description</b>. In Python, read the <b>last line</b> of the “traceback” first.</p>" +
        "<p style=\"margin-top:10px\"><b>Common errors.</b> <b>SyntaxError</b>: the code is not written correctly (a missing bracket, quote or colon). <b>IndentationError</b>: spaces at the start of lines are wrong. <b>NameError</b> or <b>ReferenceError</b>: a variable or function name is misspelled or not defined yet. <b>TypeError</b>: mixing types, such as adding text to a number. <b>KeyError</b>: a column or field name does not exist (often a spelling or space difference). <b>FileNotFoundError</b>: wrong file name or folder. In spreadsheets: <b>#VALUE!</b>, <b>#REF!</b>, <b>#N/A</b> and <b>#DIV/0!</b>.</p>" +
        "<p style=\"margin-top:10px\"><b>Debugging steps.</b> (1) <b>Reproduce</b> the error with the smallest example. (2) <b>Read</b> the message and go to the line. (3) <b>Isolate</b>: print or check values just before that line. (4) <b>Fix one thing</b> at a time. (5) <b>Retest</b> with normal and unusual data.</p>" +
        "<p style=\"margin-top:10px\"><b>Asking AI for help.</b> Paste the full error, the relevant code, what you expected and what happened, and a sample of the data (without personal details). Ask it to explain the cause before giving the fix, so you learn the pattern.</p>",
      formula: "Debug = reproduce → read the error → isolate → fix one thing → retest<small>Python: read the last line of the traceback first</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Common errors in plain English</h4>" +
          tbl(["Error", "What it usually means", "Typical fix"], DEBUG_DB.slice(0, 10).map(function (d) { return ["<b>" + esc(d[1]) + "</b>", esc(d[2]), esc(d[3])]; }));
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Prof. Mehta's script stops with this message:</p>" + code(ERR0) +
          tbl(["Clue", "Meaning"], [["Last line: TypeError", "Two different types were combined"], ["'int' and 'str'", "A number (int) was added to text (str)"], ["line 7: total = total + row[\"Marks\"]", "The marks were read from the CSV as text"], ["Fix", "Convert to a number first: total = total + int(row[\"Marks\"])"]]);
      },
      use: ["Use the error type and line number as your starting point.", "Use small test data so you can predict the correct output.", "Mistake: changing many things at once, so you do not know what fixed it.", "Mistake: asking an AI to “fix it” without pasting the error and the code."],
      walk: function () {
        return [
          { t: "Errors are clues", c: "Type, location and description.", h: chips(["TypeError", "line 7", "'int' + 'str'"], "ac") },
          { t: "Read the last line", c: "In Python, the last line of the traceback names the error.", h: code("TypeError: unsupported operand type(s) for +: 'int' and 'str'") },
          { t: "Isolate", c: "Check the value just before the failing line.", h: code("print(type(row[\"Marks\"]))   # <class 'str'>") },
          { t: "Fix one thing", c: "Convert text to a number.", h: code("total = total + int(row[\"Marks\"])") },
          { t: "Retest", c: "Normal data, empty cells and odd values.", h: chips(["64", "\"\" (empty)", "\"absent\""], function (x, i) { return i ? "hl" : "mi"; }) }
        ];
      },
      qc: [
        { q: "Python shows: NameError: name 'pass_mrk' is not defined. What is the most likely cause?", o: ["A misspelled variable name", "The computer is too slow", "The file is too large", "The internet is down"], a: 0, e: "The variable was probably defined as pass_mark; the spelling does not match." },
        { q: "What is the best first step when code fails?", o: ["Read the error message and find the line it points to", "Delete all the code", "Rewrite it in another language", "Ignore it and run again"], a: 0, e: "The message usually tells you the type and location of the problem." }
      ]
    },
    {
      id: "2.3", mod: 2, title: "Build and Share Your First Mini App", time: "14 min", tool: "app",
      outcomes: ["Build a working single-page web app (HTML, CSS and JavaScript)", "Preview, download and share it", "Host a page for free and use version control at a basic level", "Apply simple security and privacy rules"],
      notes: "<p>A <b>web page</b> is made of three layers: <b>HTML</b> (the content and structure: headings, buttons, text boxes), <b>CSS</b> (the style: colours, fonts, layout) and <b>JavaScript</b> (the behaviour: what happens when you click). A single HTML file can contain all three, so a small tool such as a quiz, a calculator or a checklist can live in one file that opens in any browser.</p>" +
        "<p style=\"margin-top:10px\"><b>Build with AI, step by step.</b> Start with a spec (lesson 2.1), ask for “a single self-contained HTML file”, open it in your browser, test it, then ask for one improvement at a time: “make the buttons larger”, “show the score at the end”, “make it work on phones”.</p>" +
        "<p style=\"margin-top:10px\"><b>Share it.</b> Email the file, or host it free so anyone can open a link: <b>GitHub Pages</b>, Netlify or Google Sites (embedded). <b>Version control</b> with Git and GitHub keeps a history of every change, so you can undo mistakes. For Google Workspace automations, Apps Script projects are shared with the Sheet or Doc they belong to.</p>" +
        "<p style=\"margin-top:10px\"><b>Security and privacy.</b> Never put passwords or API keys in a web page: anyone can read its code. Do not collect personal data you do not need. A static page stores nothing unless you add a database or form service. Test on phones and with unusual inputs, and keep a backup of every working version.</p>",
      formula: "Web app = HTML (content) + CSS (style) + JavaScript (behaviour)<small>build in small steps: spec → first version → test → one improvement at a time → share</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Mini app ideas for faculty and students</h4>" +
          tbl(["App", "What it does", "Skills used"], [
            ["Revision quiz", "Multiple-choice questions with instant score", "Lists, loops, conditions"],
            ["GST or EMI calculator", "Enter values, see the result", "Variables, formulas, input boxes"],
            ["Attendance helper", "Paste a list, see who is below 75%", "CSV, loops, conditions"],
            ["Random group maker", "Shuffle names into teams", "Lists, randomness"],
            ["Reading-time estimator", "Paste text, get word count and reading time", "Text processing"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">The tool below turns a list of questions into a complete quiz page. This is the core of the code it generates:</p>" +
          code("questions.forEach(function (q, i) {          // loop over questions\n  // show the question and shuffled options as buttons\n});\nbutton.onclick = function () {\n  if (chosen === q.correct) { score++; }     // condition\n  show(\"Score: \" + score + \"/\" + questions.length);\n};") +
          "<p class=\"muted small\" style=\"margin-top:10px\">Variables, a loop and a condition: the same three building blocks from lesson 1.2, now inside a real app.</p>";
      },
      use: ["Use single-file HTML apps for small classroom tools that anyone can open.", "Use GitHub Pages (free) to share a link, and keep each working version.", "Mistake: putting an API key or password in a page's code.", "Mistake: asking for a big app in one prompt; build and test in small steps."],
      walk: function () {
        return [
          { t: "Three layers", c: "HTML for content, CSS for style, JavaScript for behaviour.", h: chips(["HTML", "CSS", "JavaScript"], function (x, i) { return ["ac", "hl", "mi"][i]; }) },
          { t: "Start small", c: "Ask for one self-contained HTML file.", h: box("Create a single HTML file: a 3-question quiz that shows the score at the end.", "good") },
          { t: "Test and improve", c: "One change at a time.", h: chips(["Bigger buttons", "Show score", "Works on phones"], "ac") },
          { t: "Share", c: "Email the file or host it free on GitHub Pages.", h: '<div class="big">your-name.github.io/quiz</div>' },
          { t: "Stay safe", c: "No keys or passwords in pages; collect no extra data.", h: chips(["No API keys", "No passwords", "Minimal data"], "hl") }
        ];
      },
      qc: [
        { q: "Which part of a web page controls what happens when a button is clicked?", o: ["JavaScript", "CSS", "The page title", "The file name"], a: 0, e: "HTML is content, CSS is style, JavaScript is behaviour." },
        { q: "Why should you never put an API key in a web page's code?", o: ["Anyone can view a page's code and copy the key", "It makes the page slower", "Browsers delete it", "It changes the colours"], a: 0, e: "Page source is visible to every visitor." }
      ]
    }
  ];

  var MODULES = [
    { n: 1, title: "Thinking Like a Programmer", sub: "Steps, variables, conditions, loops and data: the ideas behind all code.", tag: "Module 1" },
    { n: 2, title: "Building with AI", sub: "Ask AI for code, fix errors with confidence, and build and share a working mini app.", tag: "Module 2" }
  ];

  /* ================= FINAL TEST (20 questions) ================= */
  var TEST = [
    { m: 1, q: "What is an algorithm?", o: ["A clear, ordered set of steps to solve a task", "A type of computer", "A programming language", "A website"], a: 0, e: "Algorithms are the step-by-step logic behind code." },
    { m: 1, q: "In “input → process → output”, which is the output of a payroll program?", o: ["Payslips", "Hours worked", "Tax rules", "Employee names"], a: 0, e: "Hours and names are inputs, rules are the process, payslips are output." },
    { m: 1, q: "Which language runs inside every web browser?", o: ["JavaScript", "Python", "Excel", "SQL only"], a: 0, e: "Browsers run JavaScript; Python usually runs on a computer or in tools like Colab." },
    { m: 1, q: "What is a variable?", o: ["A named box that stores a value", "An error message", "A loop", "A web page"], a: 0, e: "e.g., pass_mark = 40." },
    { m: 1, q: "marks = 38. What does this code print?  if marks >= 40: print(\"Pass\")  else: print(\"Fail\")", o: ["Fail", "Pass", "38", "Nothing"], a: 0, e: "38 is not 40 or more, so the else branch runs." },
    { m: 1, q: "Which building block repeats steps for every item in a list?", o: ["A loop", "A variable", "A comment", "A string"], a: 0, e: "for item in list: … repeats the steps." },
    { m: 1, q: "What does the comparison != mean?", o: ["Not equal to", "Equal to", "Greater than", "Store a value"], a: 0, e: "!= checks that two values are different." },
    { m: 1, q: "\"64\" (in quotes) is which type of value?", o: ["Text (a string)", "A number", "A boolean", "A list"], a: 0, e: "Quotes make it text, which cannot be added to numbers directly." },
    { m: 1, q: "Which is a correct CSV row for a student named Diya with 64 marks?", o: ["Diya,64", "{Diya: 64}", "<Diya>64", "Diya = 64;"], a: 0, e: "CSV separates values with commas." },
    { m: 1, q: "What is pandas in Python?", o: ["A library for working with tables of data", "An error type", "A web browser", "A spreadsheet formula"], a: 0, e: "pandas reads, filters and summarises tables, e.g. pd.read_csv()." },
    { m: 2, q: "Which request is most likely to produce working code?", o: ["A spec with goal, platform, inputs, outputs, rules and an example", "“Write some code”", "“Make it work”", "“Fix my computer”"], a: 0, e: "Clear specs lead to code that fits the task." },
    { m: 2, q: "You want to email each row of a Google Sheet automatically. Which platform fits best?", o: ["Google Apps Script", "A CSS file", "A JSON file", "A PDF"], a: 0, e: "Apps Script automates Sheets, Docs and Gmail." },
    { m: 2, q: "Which is safe to paste into an AI chat when asking for coding help?", o: ["The error message and code with sample (fake) data", "Your email password", "An API key", "Students' phone numbers"], a: 0, e: "Share the error and code, never secrets or personal data." },
    { m: 2, q: "In a Python traceback, which line should you usually read first?", o: ["The last line", "The first line", "A random line", "None; just rerun"], a: 0, e: "The last line names the error type and description." },
    { m: 2, q: "KeyError: 'Marks' when reading a CSV most likely means…", o: ["The column name is different, e.g. 'marks' or 'Marks '", "The computer has no memory", "The file is a PDF", "The internet is slow"], a: 0, e: "Column names must match exactly, including case and spaces." },
    { m: 2, q: "A spreadsheet shows #DIV/0!. What happened?", o: ["A formula divided by zero or an empty cell", "The file is too big", "The formula is in bold", "Macros are disabled"], a: 0, e: "Check the divisor; use IFERROR or a condition to handle zero." },
    { m: 2, q: "What is the best debugging approach?", o: ["Reproduce, read the error, isolate, fix one thing, retest", "Change everything at once", "Delete the file and start again each time", "Only test with perfect data"], a: 0, e: "Small, single changes show what actually fixed the problem." },
    { m: 2, q: "Which layer of a web page sets colours, fonts and layout?", o: ["CSS", "HTML", "JavaScript", "JSON"], a: 0, e: "CSS controls style." },
    { m: 2, q: "Which service can host a static HTML page for free?", o: ["GitHub Pages", "A spreadsheet cell", "A PDF reader", "An email signature"], a: 0, e: "GitHub Pages (and services like Netlify) host static sites." },
    { m: 2, q: "What does version control (e.g., Git) give you?", o: ["A history of changes, so you can undo mistakes", "Faster internet", "Automatic translation", "Free API keys"], a: 0, e: "Each saved version can be compared or restored." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Code", "Precise instructions a computer follows.", "=IF(B2>=40,\"Pass\",\"Fail\")", "1.1"],
    ["Algorithm", "A clear, ordered list of steps that solves a task.", "Read marks → apply rule → count passes.", "1.1"],
    ["Input / process / output", "The data in, the rules applied, and the result out.", "Marks → rule → Pass list.", "1.1"],
    ["Programming language", "A formal language for writing code.", "Python, JavaScript, Apps Script.", "1.1"],
    ["Vibe coding", "Building software by describing it to an AI and refining the result.", "“Make me a quiz page…”", "1.1"],
    ["Variable", "A named box that stores a value.", "pass_mark = 40", "1.2"],
    ["Data type", "The kind of value: number, text (string), boolean, list.", "64 vs \"64\"", "1.2"],
    ["String", "A text value, written in quotes.", "\"Diya\"", "1.2"],
    ["Condition (if/else)", "Code that makes a decision.", "if marks >= 40: …", "1.2"],
    ["Loop", "Code that repeats steps for each item.", "for s in students: …", "1.2"],
    ["Indentation", "Spaces at the start of a line; in Python they define blocks.", "Four spaces inside a loop.", "1.2"],
    ["List", "An ordered collection of values.", "[78, 64, 39]", "1.3"],
    ["CSV", "Comma-separated values: a plain-text table.", "name,marks / Diya,64", "1.3"],
    ["JSON", "A text format for named fields and lists, used by apps and APIs.", "{\"name\": \"Diya\"}", "1.3"],
    ["API", "A way for programs to request data or actions from another service.", "A weather API returns JSON.", "1.3"],
    ["Library", "Ready-made code you can reuse.", "pandas for tables.", "1.3"],
    ["Spec (specification)", "A clear description of what code should do.", "Goal, platform, inputs, outputs, rules, example.", "2.1"],
    ["Google Apps Script", "JavaScript-based code that automates Google Workspace.", "Email marks from a Sheet.", "2.1"],
    ["Google Colab", "A free, browser-based place to run Python.", "Run pandas without installing anything.", "2.1"],
    ["Comment", "A note in code that the computer ignores.", "# count passes", "2.1"],
    ["Error message", "The computer's description of what went wrong and where.", "TypeError on line 7.", "2.2"],
    ["Traceback", "Python's list of steps leading to an error; read the last line first.", "… TypeError: …", "2.2"],
    ["Debugging", "Finding and fixing errors step by step.", "Reproduce, isolate, fix, retest.", "2.2"],
    ["Syntax error", "Code that breaks the language's writing rules.", "A missing bracket or colon.", "2.2"],
    ["HTML", "The content and structure of a web page.", "<h1>Quiz</h1>", "2.3"],
    ["CSS", "The style of a web page.", "color: navy;", "2.3"],
    ["JavaScript", "The language that adds behaviour to web pages.", "button.onclick = …", "2.3"],
    ["Hosting", "Putting a site online so others can open it.", "GitHub Pages.", "2.3"],
    ["Version control (Git)", "A history of changes to code, so you can undo mistakes.", "Commits on GitHub.", "2.3"]
  ];

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= TRY-IT TOOLS (all run in the browser; nothing is sent anywhere) ================= */
  function ta(id, v, rows, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" rows="' + (rows || 4) + '">' + esc(v || "") + "</textarea></div>"; }
  function inp(id, v, label, ph, mode) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + esc(v === undefined ? "" : v) + '" placeholder="' + esc(ph || "") + '"' + (mode ? ' inputmode="' + mode + '"' : "") + "></div>"; }
  function sel(id, opts, v, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></div>"; }
  function copyRow(id, label) { return '<div class="row" style="margin-top:8px"><button class="btn btn-ink btn-sm" data-copy="' + id + '">' + (label || "Copy") + '</button><span class="small muted" data-copied="' + id + '" aria-live="polite"></span></div>'; }
  function out(id, text) { return '<div class="pbox good" id="' + id + '">' + esc(text) + "</div>"; }
  function outCode(id, text) { return '<div class="pbox" id="' + id + '" style="background:#1E1B4B;color:#E0E7FF;border-color:#1E1B4B">' + esc(text) + "</div>"; }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ""; }
  function n(id) { var s = val(id).replace(/[,\s]/g, ""); return s === "" ? NaN : Number(s); }
  function err(t) { return '<p class="err">' + t + "</p>"; }
  function tick(ok, t) { return "<li>" + (ok ? "✅" : "⬜") + " " + t + "</li>"; }

  var VERBS = /^(open|read|get|take|load|check|if|otherwise|else|for|repeat|count|add|subtract|multiply|divide|calculate|compute|sort|filter|find|search|save|write|send|email|print|show|display|label|mark|set|create|make|copy|move|delete|remove|update|ask|enter|select|compare|convert|round|list|loop|stop|return|download|upload|format|highlight|group|split|join|merge|clean|go|wait|start|end|when|while|until|apply|fill|record|log|notify|post|generate|draw|plot|summarise|summarize)\b/i;
  var VAGUE = /\b(some|stuff|things|etc|properly|appropriately|somehow|handle|deal with|sort out|as needed|whatever|usual)\b/i;
  var DEBUG_DB = [
    [/SyntaxError|Unexpected token|invalid syntax|missing \)|unexpected EOF/i, "SyntaxError", "The code breaks the language's writing rules: a missing bracket, quote, colon or comma.", "Check the line shown and the line before it for unclosed brackets or quotes, and a colon at the end of if/for lines in Python."],
    [/IndentationError|unexpected indent|expected an indented block/i, "IndentationError", "The spaces at the start of lines are wrong (Python).", "Use 4 spaces for each level inside if, for and def blocks; do not mix tabs and spaces."],
    [/NameError|ReferenceError|is not defined/i, "NameError / ReferenceError", "A variable or function name is misspelled, or used before it is created.", "Check the spelling and capitalisation, and make sure the name is defined above where it is used."],
    [/TypeError.*(str|string).*(int|float)|TypeError.*(int|float).*(str|string)|can only concatenate|unsupported operand/i, "TypeError (text vs number)", "Text and numbers were combined, often because data from a CSV or form was read as text.", "Convert first: int(x) or float(x) in Python, Number(x) in JavaScript."],
    [/Cannot read propert|undefined is not|of undefined|of null|null is not/i, "TypeError: undefined or null (JavaScript)", "The code used something that does not exist yet, e.g. an element ID that is wrong or data that has not loaded.", "Check the ID or field name, and that the data exists before using it."],
    [/KeyError/i, "KeyError", "A column or field name does not exist in the data.", "Print the column names (df.columns) and match spelling, capitals and spaces exactly."],
    [/IndexError|out of range|list index/i, "IndexError", "The code asked for an item position that does not exist, e.g. the 10th item of a 5-item list.", "Check the list length and remember counting starts at 0."],
    [/ZeroDivisionError|#DIV\/0/i, "ZeroDivisionError / #DIV/0!", "A number was divided by zero or by an empty cell.", "Check the divisor; skip or handle zero values (IFERROR in sheets)."],
    [/FileNotFoundError|No such file|ENOENT/i, "FileNotFoundError", "The file name or folder is wrong, or the file was not uploaded.", "Check the exact file name and location; in Colab, upload the file first."],
    [/ModuleNotFoundError|No module named|ImportError/i, "ModuleNotFoundError", "A library is not installed.", "Install it (e.g., pip install pandas) or use Google Colab, which has common libraries."],
    [/ValueError|invalid literal/i, "ValueError", "A value has the right type but a wrong form, e.g. int(\"absent\").", "Clean the data or skip values that are not numbers."],
    [/#VALUE!/i, "#VALUE! (spreadsheet)", "A formula received the wrong type, such as text in a calculation.", "Check the cells referenced for text, spaces or symbols."],
    [/#REF!/i, "#REF! (spreadsheet)", "A formula points to a cell or range that was deleted.", "Re-select the correct cells in the formula."],
    [/#N\/A/i, "#N/A (spreadsheet)", "A lookup could not find the value.", "Check spelling and spaces in the lookup value; use IFNA to show a message."],
    [/#NAME\?/i, "#NAME? (spreadsheet)", "The formula name is misspelled or text is missing quotes.", "Check the function name and put text inside quotes."],
    [/Exception: .*(permission|authori[sz])|You do not have permission|Authorization is required/i, "Permission error (Apps Script)", "The script has not been authorised, or the account cannot access the file.", "Run it once from the editor and approve the permissions; check sharing settings."]
  ];

  function toolBlock(l) {
    var h = '<div class="card calc"><p class="muted small" style="margin-bottom:12px">' + {
      steps: "Write the steps of a task you want to automate, one per line. The tool turns them into a flowchart and checks that each step is clear enough for code.",
      logic: "Enter students and marks (name, marks) and set the rules. The tool runs a loop with conditions, shows the results, and writes the matching Python code.",
      json: "Paste a small CSV table (first row = column names). The tool shows it as a table, converts it to JSON and writes pandas code to load it.",
      spec: "Fill in your code request. The tool assembles a clear prompt for an AI assistant, with a checklist of what is missing.",
      debug: "Paste an error message (and the code if you like). The tool explains it in plain English and builds a debugging prompt for an AI assistant.",
      app: "Write quiz questions, one per line as: question | correct answer | wrong answer | wrong answer. The tool builds a complete quiz web page you can preview and download."
    }[l.tool] + "</p>";
    if (l.tool === "steps") h += ta("s_in", STEPS0, 7, "Steps (one per line)");
    if (l.tool === "logic") h += '<div class="grid g2">' + ta("g_in", MARKS, 7, "Students: name, marks") + '<div>' + inp("g_pass", "40", "Pass mark (marks ≥ this = Pass)", "", "numeric") + inp("g_dist", "75", "Distinction mark (marks ≥ this = Distinction)", "", "numeric") + "</div></div>";
    if (l.tool === "json") h += ta("j_in", CSV0, 6, "CSV data");
    if (l.tool === "spec") h += inp("p_what", SPEC0.what, "What should the code do?") + sel("p_plat", [["apps", "Google Apps Script (Sheets, Docs, Gmail)"], ["python", "Python (Google Colab)"], ["sheet", "Spreadsheet formula"], ["html", "Single HTML page (web app)"], ["vba", "Excel VBA macro"]], SPEC0.platform, "Where will it run?") + inp("p_in", SPEC0.inputs, "Inputs (what data it starts with)") + inp("p_out", SPEC0.outputs, "Outputs (what it should produce)") + ta("p_rules", SPEC0.rules, 2, "Rules and limits") + ta("p_ex", SPEC0.example, 2, "Example (input → expected output)");
    if (l.tool === "debug") h += ta("d_err", ERR0, 6, "Error message") + ta("d_code", "for row in rows:\n    total = total + row[\"Marks\"]", 4, "Relevant code (optional, remove personal data)") + inp("d_expect", "The total of all marks", "What did you expect to happen? (optional)");
    if (l.tool === "app") h += inp("a_title", "Coding basics quiz", "Quiz title") + ta("a_qs", QUIZ0, 5, "Questions (question | correct | wrong | wrong)") + '<div class="row" style="margin-top:10px"><button class="btn btn-ink" id="tgo">Build my app</button></div>';
    return h + '<div id="cout" class="res" aria-live="polite"></div></div>';
  }

  function runSteps() {
    var lines = val("s_in").split(/\n+/).map(function (x) { return x.replace(/^\s*(\d+[.)]|[-•*])\s*/, "").trim(); }).filter(Boolean);
    if (!lines.length) return err("Write at least one step.");
    if (lines.length > 40) return err("Please keep it to 40 steps or fewer.");
    var rows = lines.map(function (s) {
      var isIf = /^(if|when|while|until)\b/i.test(s), isElse = /^(otherwise|else)\b/i.test(s), isLoop = /\b(each|every|for all|repeat|loop)\b/i.test(s);
      var verb = VERBS.test(s), vague = s.match(VAGUE);
      return { s: s, kind: isIf ? "Decision" : isElse ? "Else" : isLoop ? "Loop" : "Action", verb: verb, vague: vague ? vague[0] : "" };
    });
    var colors = { Decision: ["#FEF3C7", "#854D0E"], Else: ["#FEF3C7", "#854D0E"], Loop: ["#E0F2FE", "#075985"], Action: ["#EEF0FF", "#3730A3"] };
    var flow = '<div style="display:grid;gap:4px;justify-items:start">' + rows.map(function (r, i) { var c = colors[r.kind]; return (i ? '<div aria-hidden="true" style="margin-left:22px;color:var(--faint)">↓</div>' : "") + '<div style="display:flex;gap:10px;align-items:center;border:2px solid var(--border);border-radius:' + (r.kind === "Decision" ? "6px" : "14px") + ';padding:8px 12px;background:#fff;max-width:100%"><span style="background:' + c[0] + ";color:" + c[1] + ';border-radius:8px;padding:2px 8px;font-weight:800;font-size:13px;white-space:nowrap">' + (i + 1) + " · " + r.kind + '</span><span style="font-size:15px">' + esc(r.s) + "</span></div>"; }).join("") + "</div>";
    var noVerb = rows.filter(function (r) { return !r.verb; }), vague = rows.filter(function (r) { return r.vague; });
    var hasIf = rows.some(function (r) { return r.kind === "Decision"; }), hasElse = rows.some(function (r) { return r.kind === "Else"; }), hasLoop = rows.some(function (r) { return r.kind === "Loop"; });
    var nums = rows.some(function (r) { return /\d/.test(r.s); });
    return flow + '<ul class="clean" style="list-style:none;padding:0;margin-top:10px">' +
      tick(!noVerb.length, "Every step starts with an action word" + (noVerb.length ? " (check steps " + noVerb.map(function (r) { return rows.indexOf(r) + 1; }).join(", ") + ")" : "")) +
      tick(!vague.length, "No vague words" + (vague.length ? " (found “" + vague.map(function (r) { return esc(r.vague); }).join("”, “") + "”)" : "")) +
      tick(!hasIf || hasElse, hasIf ? "Every decision says what happens otherwise" : "No decisions needed (or add one with “If…”)") +
      tick(hasLoop, "Repetition is explicit (e.g., “for each student”)") +
      tick(nums, "Rules include specific values (numbers, names, limits)") + "</ul>" +
      '<div class="note">When the checklist is green, paste these steps into your AI request (lesson 2.1) and ask for code.</div>';
  }
  function runLogic() {
    var p = parseMarks(val("g_in")), pass = n("g_pass"), dist = n("g_dist");
    if (!p.rows.length) return err("Enter at least one line as: name, marks.");
    if (p.rows.length > 300) return err("Please enter 300 students or fewer.");
    if (!isFinite(pass) || !isFinite(dist)) return err("Enter numbers for the pass and distinction marks.");
    if (dist < pass) return err("The distinction mark should be at least the pass mark.");
    var counts = { Distinction: 0, Pass: 0, Fail: 0 };
    var rows = p.rows.map(function (r) { var g = grade(r[1], pass, dist); counts[g]++; return [esc(r[0]), r[1], '<b style="color:' + (g === "Fail" ? "var(--red-fg)" : "var(--mint-fg)") + '">' + g + "</b>"]; });
    var py = "students = [" + p.rows.slice(0, 6).map(function (r) { return "(" + JSON.stringify(r[0]) + ", " + r[1] + ")"; }).join(", ") + (p.rows.length > 6 ? ", ..." : "") + "]\npass_mark = " + pass + "\ndistinction_mark = " + dist + "\npassed = 0\n\nfor name, marks in students:\n    if marks >= distinction_mark:\n        result = \"Distinction\"\n    elif marks >= pass_mark:\n        result = \"Pass\"\n    else:\n        result = \"Fail\"\n    if result != \"Fail\":\n        passed = passed + 1\n    print(name, marks, result)\n\nprint(\"Passed:\", passed, \"of\", len(students))";
    return tbl(["Name", "Marks", "Result"], rows) + '<div class="kv"><span>Distinction: ' + counts.Distinction + "</span><span>Pass: " + counts.Pass + "</span><span>Fail: " + counts.Fail + "</span><span>Passed: " + (counts.Pass + counts.Distinction) + " of " + p.rows.length + "</span>" + (p.bad ? "<span>Skipped lines: " + p.bad + "</span>" : "") + "</div>" +
      '<h4 style="margin:10px 0 4px">The same logic in Python</h4>' + outCode("gout", py) + copyRow("gout", "Copy Python") +
      '<div class="note">Spot the building blocks: variables (pass_mark), a loop (for … in students), conditions (if / elif / else) and a counter (passed). Paste the code into Google Colab to run it.</div>';
  }
  function parseCsv(t) {
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < t.length; i++) { var c = t[i]; if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; } else if (c === '"') q = true; else if (c === ",") { row.push(cur); cur = ""; } else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; } else if (c !== "\r") cur += c; }
    row.push(cur); rows.push(row);
    return rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ""; }); });
  }
  function runJson() {
    var rows = parseCsv(val("j_in"));
    if (rows.length < 2) return err("Enter a header row and at least one data row.");
    if (rows.length > 501) return err("Please paste 500 rows or fewer.");
    var head = rows[0].map(function (h) { return h.trim(); }), data = rows.slice(1);
    if (head.some(function (h) { return !h; })) return err("Every column needs a name in the first row.");
    var bad = data.filter(function (r) { return r.length !== head.length; }).length;
    var objs = data.map(function (r) { var o = {}; head.forEach(function (h, j) { var v = (r[j] || "").trim(); o[h] = v !== "" && isFinite(Number(v)) ? Number(v) : v; }); return o; });
    var types = head.map(function (h) { var vs = objs.map(function (o) { return o[h]; }).filter(function (v) { return v !== ""; }); return vs.length && vs.every(function (v) { return typeof v === "number"; }) ? "number" : "text"; });
    var first = head[0], numCol = head[types.indexOf("number")];
    var py = "import pandas as pd\n\ndf = pd.read_csv(\"data.csv\")\nprint(df.head())             # first rows\nprint(df.columns.tolist())   # column names" + (numCol ? "\nprint(df[" + JSON.stringify(numCol) + "].mean())   # average " + numCol : "") + (numCol ? "\nprint(df.sort_values(" + JSON.stringify(numCol) + ", ascending=False).head(3))" : "");
    return tbl(head.map(function (h, j) { return esc(h) + ' <span class="small muted">(' + types[j] + ")</span>"; }), data.slice(0, 20).map(function (r) { return head.map(function (h, j) { return esc(r[j] || ""); }); })) +
      '<div class="kv"><span>Rows: ' + data.length + "</span><span>Columns: " + head.length + "</span>" + (bad ? "<span>Rows with missing or extra values: " + bad + "</span>" : "") + "</div>" +
      '<h4 style="margin:10px 0 4px">As JSON</h4>' + outCode("jout", JSON.stringify(objs, null, 2)) + copyRow("jout", "Copy JSON") +
      '<h4 style="margin:10px 0 4px">Load it with pandas (Python)</h4>' + outCode("pout", py) + copyRow("pout", "Copy Python") +
      '<div class="note">Numbers are stored without quotes in JSON; text is in quotes. The first column (“' + esc(first) + '”) usually identifies each row.</div>';
  }
  var PLAT = { apps: "Google Apps Script for Google Sheets", python: "Python that runs in Google Colab", sheet: "a Google Sheets / Excel formula", html: "a single self-contained HTML file with CSS and JavaScript included", vba: "an Excel VBA macro" };
  function runSpec() {
    var f = { what: val("p_what").trim(), plat: val("p_plat"), inp: val("p_in").trim(), out: val("p_out").trim(), rules: val("p_rules").trim(), ex: val("p_ex").trim() };
    if (!f.what) return err("Describe what the code should do.");
    var lines = ["Write " + PLAT[f.plat] + " that does the following: " + f.what + "."];
    if (f.inp) lines.push("Input: " + f.inp + ".");
    if (f.out) lines.push("Output: " + f.out + ".");
    if (f.rules) lines.push("Rules and limits: " + f.rules);
    if (f.ex) lines.push("Example: " + f.ex);
    lines.push("", "I am not a programmer, so please:", "1. Add a short comment explaining each step.", "2. Handle common problems (empty cells, wrong formats) without crashing.", "3. Tell me exactly where to paste the code and how to run it, step by step.", "4. Give me 2 or 3 test cases with the expected result, and tell me how to test on a copy of my data first.", "5. Do not include any passwords or API keys in the code.");
    var txt = lines.join("\n").replace(/\.\./g, ".");
    var vague = (f.what + " " + f.rules).match(VAGUE);
    return '<h4 style="margin:0 0 4px">Your prompt</h4>' + out("sout", txt) + copyRow("sout", "Copy prompt") +
      '<ul class="clean" style="list-style:none;padding:0">' + tick(f.what.split(/\s+/).length >= 6, "The goal is specific (6+ words)") + tick(!!f.plat, "The platform is stated") + tick(!!f.inp, "Inputs are described") + tick(!!f.out, "Outputs are described") + tick(!!f.rules, "Rules or limits are given") + tick(!!f.ex, "An example is included") + tick(!vague, "No vague words" + (vague ? " (found “" + esc(vague[0]) + "”)" : "")) + "</ul>";
  }
  function runDebug() {
    var e = val("d_err").trim(), c = val("d_code").trim(), x = val("d_expect").trim();
    if (!e) return err("Paste an error message.");
    if (e.length + c.length > 20000) return err("Please paste 20,000 characters or fewer.");
    var hits = DEBUG_DB.filter(function (d) { return d[0].test(e); });
    var lineM = e.match(/line (\d+)/i) || e.match(/:(\d+):\d+/), lines = e.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean), last = lines[lines.length - 1];
    var h = '<div class="kv"><span>Key line: ' + esc(last.length > 120 ? last.slice(0, 117) + "…" : last) + "</span>" + (lineM ? "<span>Look at line " + lineM[1] + "</span>" : "") + "</div>";
    h += hits.length ? tbl(["Error", "What it means", "How to fix it"], hits.slice(0, 3).map(function (d) { return ["<b>" + esc(d[1]) + "</b>", esc(d[2]), esc(d[3])]; })) : '<div class="note">This error is not in our list of common errors. Search the exact message online, or use the prompt below.</div>';
    var prompt = "I am not a programmer. My code shows this error:\n<<<\n" + e + "\n>>>\n" + (c ? "\nHere is the relevant code:\n<<<\n" + c + "\n>>>\n" : "") + (x ? "\nI expected: " + x + "\n" : "") + "\nPlease (1) explain in plain English what the error means and why it happened, (2) show the corrected code with the change highlighted in a comment, and (3) tell me how to test that it is fixed.";
    return h + '<h4 style="margin:10px 0 4px">Debugging prompt for an AI assistant</h4>' + out("dout", prompt) + copyRow("dout", "Copy prompt") + '<div class="note">Remove names, emails and any passwords or keys from the code before sharing it.</div>';
  }
  function buildQuiz(title, qs) {
    var data = JSON.stringify(qs).replace(/</g, "\\u003c");
    return "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>" + esc(title) + "</title>\n<style>\n  body { font-family: system-ui, sans-serif; background: #FAFAFF; color: #1E1B4B; margin: 0; padding: 24px; }\n  .box { max-width: 640px; margin: 0 auto; background: #fff; border: 2px solid #E4E5F5; border-radius: 18px; padding: 22px; }\n  h1 { font-size: 26px; margin: 0 0 12px; }\n  button { display: block; width: 100%; text-align: left; font: inherit; font-size: 17px; padding: 12px 14px; margin: 8px 0; border: 2px solid #E4E5F5; border-radius: 12px; background: #fff; cursor: pointer; }\n  button:hover { border-color: #4F46E5; }\n  .ok { background: #DCFCE7; border-color: #22C55E; }\n  .bad { background: #FEE2E2; border-color: #F87171; }\n  .score { font-size: 22px; font-weight: 800; margin-top: 12px; }\n</style>\n</head>\n<body>\n<div class=\"box\">\n  <h1>" + esc(title) + "</h1>\n  <div id=\"quiz\"></div>\n  <div class=\"score\" id=\"score\"></div>\n</div>\n<script>\n  // The questions (a list of objects)\n  var questions = " + data + ";\n  var score = 0, answered = 0;\n  var quiz = document.getElementById(\"quiz\");\n\n  // Loop over the questions and show each one\n  questions.forEach(function (q, i) {\n    var div = document.createElement(\"div\");\n    div.innerHTML = \"<p><b>\" + (i + 1) + \". </b></p>\";\n    div.querySelector(\"b\").appendChild(document.createTextNode(q.q));\n    var options = [q.correct].concat(q.wrong).sort(function () { return Math.random() - 0.5; });\n    options.forEach(function (opt) {\n      var b = document.createElement(\"button\");\n      b.textContent = opt;\n      b.onclick = function () {\n        if (div.dataset.done) return;          // answer each question once\n        div.dataset.done = \"1\";\n        answered = answered + 1;\n        if (opt === q.correct) {               // condition: right or wrong?\n          score = score + 1;\n          b.className = \"ok\";\n        } else {\n          b.className = \"bad\";\n        }\n        if (answered === questions.length) {\n          document.getElementById(\"score\").textContent = \"Score: \" + score + \" / \" + questions.length;\n        }\n      };\n      div.appendChild(b);\n    });\n    quiz.appendChild(div);\n  });\n</" + "script>\n</body>\n</html>\n";
  }
  var lastApp = "";
  function runApp() {
    var title = val("a_title").trim() || "My quiz", lines = val("a_qs").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean), qs = [];
    if (!lines.length) return err("Write at least one question.");
    if (lines.length > 50) return err("Please write 50 questions or fewer.");
    for (var i = 0; i < lines.length; i++) {
      var p = lines[i].split("|").map(function (x) { return x.trim(); }).filter(Boolean);
      if (p.length < 3) return err("Question " + (i + 1) + " needs at least: question | correct answer | one wrong answer.");
      qs.push({ q: p[0], correct: p[1], wrong: p.slice(2) });
    }
    lastApp = buildQuiz(title, qs);
    return '<div class="kv"><span>Questions: ' + qs.length + "</span><span>File size: " + Math.round(lastApp.length / 1024 * 10) / 10 + " KB</span></div>" +
      '<h4 style="margin:6px 0 4px">Live preview</h4><iframe id="apreview" title="Quiz preview" sandbox="allow-scripts" style="width:100%;height:420px;border:2px solid var(--border);border-radius:14px;background:#fff"></iframe>' +
      '<div class="row" style="margin-top:10px"><button class="btn btn-accent btn-sm" id="adl">Download quiz.html</button><button class="btn btn-soft btn-sm" data-copy="acode">Copy the code</button><span class="small muted" data-copied="acode" aria-live="polite"></span></div>' +
      '<details style="margin-top:10px"><summary style="cursor:pointer;font-weight:700">See the code (HTML, CSS and JavaScript)</summary>' + outCode("acode", lastApp) + "</details>" +
      '<div class="note">Open the downloaded file in any browser. To share a link, upload it to GitHub Pages. Look for the loop (questions.forEach) and the condition (if opt === q.correct) in the code.</div>';
  }

  function toolWire(l) {
    var cout = document.getElementById("cout");
    var R = { steps: runSteps, logic: runLogic, json: runJson, spec: runSpec, debug: runDebug, app: runApp };
    function run() {
      cout.innerHTML = R[l.tool]();
      var fr = document.getElementById("apreview"); if (fr && lastApp) fr.srcdoc = lastApp;
      var dl = document.getElementById("adl");
      if (dl) dl.onclick = function () { var b = new Blob([lastApp], { type: "text/html" }), u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = "quiz.html"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000); };
    }
    var go = document.getElementById("tgo"); if (go) go.onclick = run;
    var card = cout.parentElement;
    if (l.tool !== "app") card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; run(); });
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
  var KEY = "cnc_progress_v1";
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
    var h = '<section class="hero"><div><span class="tag">Free course · about 75 minutes</span><h1 style="margin-top:14px">Coding for Non-Coders</h1>' +
      '<p class="lead">Think like a programmer and build real tools with AI, no experience needed.</p>' +
      '<p class="muted" style="margin-top:12px">For students, faculty, managers and professionals who have never written code and want to automate tasks, work with data and build small apps with AI help. Work through six short lessons, each with a teaching video or animated walkthrough, clear notes, a worked example and an interactive tool you can use on your own tasks. Then pass the final test to earn your certificate.</p>' +
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
    var mod = MODULES[l.mod - 1], url = (window.CNC_VIDEOS && window.CNC_VIDEOS[id]) || "";
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
      "<tr><td><b>What is code?</b></td><td>Code is a precise list of steps: input → process → output</td><td>One clear action per step; no vague words</td></tr>" +
      "<tr><td><b>Variables, conditions and loops</b></td><td>Store values, make decisions with if/else, repeat with loops</td><td>Check the order of conditions: most specific first</td></tr>" +
      "<tr><td><b>Working with data</b></td><td>Tables, CSV and JSON hold the same data in different shapes</td><td>One row per record, one column per field, clean headers</td></tr></table>";
    var t2 = '<table><tr><th>Lesson</th><th>Key idea</th><th>Remember</th></tr>' +
      "<tr><td><b>Prompting AI to write code</b></td><td>Say the platform, input, output, rules, edge cases and limits</td><td>Ask for comments and a test example</td></tr>" +
      "<tr><td><b>Reading errors and debugging</b></td><td>Read the last line, find the line number, change one thing at a time</td><td>Give AI the code, the full error and what you expected</td></tr>" +
      "<tr><td><b>Build and share a mini app</b></td><td>Small, working, tested, then shared</td><td>Never put passwords, keys or private data in code</td></tr></table>";
    var h = '<span class="tag indigo">Module ' + m + ' recap</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + MODULES[m - 1].title + '</h1><p class="muted" style="margin:8px 0 18px">The main ideas from each lesson, on one page.</p>' +
      '<div class="card tscroll">' + (m === 1 ? t1 : t2) + "</div>" +
      '<div class="card" style="margin-top:16px"><h3>Key takeaway</h3><p class="muted" style="margin-top:6px">' + (m === 1 ? "Every program is steps, stored values, decisions and repetition applied to data. If you can describe a task that precisely, you can get it coded." : "AI writes the code, you stay in charge: give a precise request, read errors calmly, test with real examples and share only what is safe.") + "</p></div>" +
      '<p style="margin-top:20px">' + (m === 1 ? '<a class="btn btn-accent" href="#/lesson/2.1">Start Module 2: Building with AI →</a>' : '<a class="btn btn-sun" href="#/test">Take the final test →</a>') + "</p>";
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
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">Coding for Non-Coders: final test</h1>' +
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
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "CNC-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all six lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">Coding for Non-Coders</h3>' +
      '<p class="muted small" style="margin-top:6px">Thinking Like a Programmer · Building with AI</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
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
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text("Coding for Non-Coders", W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text("Thinking Like a Programmer  |  Building with AI", W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited. Not an accredited qualification.", W / 2, H - 15, { align: "center" });
    sigPng(function (png) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 12.4);
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save("Coding-for-Non-Coders-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option><option value="1">Module 1: Thinking like a programmer</option><option value="2">Module 2: Building with AI</option></select></div><div class="grid g2" id="gl"></div>';
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
    var titles = { home: "Coding for Non-Coders", path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || "Coding for Non-Coders") + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();

