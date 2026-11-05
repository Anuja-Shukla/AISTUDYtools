/* SSC CGL · Computer Knowledge (Tier 2) · Internet & email. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["internet"] = {
  id: "internet", subject: "computer", num: 3, title: "Internet & email",
  minutes: 25,
  why: "Internet and email questions test full forms (WWW, HTTP, URL, DNS), what each protocol does, parts of a web address and email features like CC and BCC.",
  video: "videos/SSC_C03_Internet_Email.mp4",
  slides: [
    { h: "The web", body: "<ul><li><b>WWW</b> – World Wide Web, invented by <b>Tim Berners-Lee</b>.</li><li>A <b>browser</b> (Chrome, Firefox, Edge) shows web pages; a <b>search engine</b> (Google, Bing) finds them.</li><li>The <b>homepage</b> is the main page of a website.</li><li><b>ISP</b> – Internet Service Provider.</li></ul>" },
    { h: "Protocols", body: "<table class=\"pt\"><tr><th>Protocol</th><th>Job</th></tr><tr><td>HTTP / HTTPS</td><td>web pages (S = secure)</td></tr><tr><td>FTP</td><td>file transfer</td></tr><tr><td>SMTP</td><td>sending email</td></tr><tr><td>POP3 / IMAP</td><td>receiving email</td></tr><tr><td>DNS</td><td>turns domain names into IP addresses</td></tr></table>" },
    { h: "Parts of a URL", body: "<p><b>https://</b>www.<b>example.gov.in</b>/exams/<b>notice.html</b></p><ul><li>Protocol – https</li><li>Domain – example.gov.in (.gov = government, .edu = education, .org = organisation, .in = India)</li><li>Path – /exams/notice.html</li></ul><p>URL = Uniform Resource Locator. An <b>IP address</b> identifies a device on a network.</p>" },
    { h: "Email", body: "<ul><li>user<b>@</b>domain — “@” separates the user name and the domain.</li><li><b>CC</b> – carbon copy (everyone sees it); <b>BCC</b> – blind carbon copy (hidden from others).</li><li><b>Attachment</b> – a file sent with the message. <b>Spam</b> – unwanted bulk email.</li></ul>",
      ask: { q: "Which field hides a recipient from the others?", a: "BCC — blind carbon copy." } },
    { h: "Exam strategy", body: "<ul><li>Learn full forms in a list.</li><li>Pair each protocol with its job: SMTP sends, POP3 receives.</li><li>Practise splitting URLs with the tool below.</li></ul>" }
  ],
  tools: ["urlparts", "emailparts", "netacro"],
  formulas: [["WWW", "World Wide Web (Tim Berners-Lee)"], ["HTTP / HTTPS", "HyperText Transfer Protocol (S = secure)"], ["URL", "Uniform Resource Locator"], ["SMTP / POP3", "send / receive email"], ["DNS", "name → IP address"], ["CC / BCC", "carbon copy / blind carbon copy"]],
  practice: [
    { q: "WWW stands for:", o: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"], why: "World Wide Web.", hint: "World first." },
    { q: "The World Wide Web was invented by:", o: ["Tim Berners-Lee", "Charles Babbage", "Bill Gates", "Vint Cerf"], why: "In 1989 at CERN.", hint: "CERN." },
    { q: "HTTP stands for:", o: ["HyperText Transfer Protocol", "High Text Transfer Protocol", "HyperText Transmission Process", "Hyper Transfer Text Protocol"], why: "HyperText Transfer Protocol.", hint: "Hypertext." },
    { q: "URL stands for:", o: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Record Locator", "Unique Resource Location"], why: "A web address.", hint: "Locator." },
    { q: "In email, “CC” means:", o: ["Carbon copy", "Closed copy", "Copy check", "Central copy"], why: "Visible copy to others.", hint: "Old typewriter term." },
    { q: "BCC in email:", o: ["Hides the recipient from others", "Blocks the email", "Sends it twice", "Adds an attachment"], why: "Blind carbon copy.", hint: "Blind." },
    { q: "Software used to view web pages is a:", o: ["Web browser", "Compiler", "Spreadsheet", "Search engine"], why: "Chrome, Firefox, Edge.", hint: "Chrome is one." },
    { q: "The domain “.gov” is used by:", o: ["Government organisations", "Schools", "Companies", "Charities"], why: ".gov.", hint: "Government." },
    { q: "Which protocol is used to send email?", o: ["SMTP", "POP3", "FTP", "HTTP"], why: "Simple Mail Transfer Protocol.", hint: "Mail Transfer." },
    { q: "Unwanted bulk email is called:", o: ["Spam", "Draft", "Outbox", "Cookie"], why: "Spam.", hint: "Junk." }
  ],
  test: {
    minutes: 5, right: 3, wrong: 1,
    items: [
      { q: "In HTTPS, the “S” stands for:", o: ["Secure", "Server", "System", "Standard"], why: "Encrypted connection." },
      { q: "An IP address identifies:", o: ["A device on a network", "A website’s owner", "An email password", "A file type"], why: "Internet Protocol address." },
      { q: "DNS is used to:", o: ["Convert domain names into IP addresses", "Send email", "Store files", "Block viruses"], why: "Domain Name System." },
      { q: "Which is a search engine?", o: ["Google", "Windows", "MS Excel", "Linux"], why: "Google." },
      { q: "In an email address, “@” separates the:", o: ["User name and domain", "Subject and body", "Sender and receiver", "Password and user name"], why: "user@domain." },
      { q: "Which protocol is used to receive email?", o: ["POP3", "SMTP", "FTP", "HTTP"], why: "POP3 (IMAP too)." },
      { q: "FTP is used for:", o: ["Transferring files", "Sending email", "Browsing", "Chatting"], why: "File Transfer Protocol." },
      { q: "An email attachment is:", o: ["A file sent with the message", "The subject line", "A reply", "A signature"], why: "A file." },
      { q: "ISP stands for:", o: ["Internet Service Provider", "Internal System Program", "Internet Security Protocol", "Indian Service Provider"], why: "Internet Service Provider." },
      { q: "The homepage of a website is its:", o: ["Main or first page", "Last page", "Contact page", "Error page"], why: "Main page." }
    ]
  }
};
