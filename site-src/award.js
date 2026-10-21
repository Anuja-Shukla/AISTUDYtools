/* Faculty Innovation Award: submission form and certificates. No secrets here. */
(function () {
  var EMAIL = "intelliqueresearchschool@gmail.com";
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function niceDate(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ""); if (!m) return d || ""; return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }

  /* ---------- submission form ---------- */
  var form = $("aw_form");
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var st = $("aw_status");
    function fail(t, el) { st.className = "aw-status err"; st.textContent = t; if (el) el.focus(); }
    var f = {}, ids = ["name", "desig", "inst", "subject", "email", "phone", "tool", "title", "link", "summary", "use"];
    ids.forEach(function (k) { f[k] = $("aw_" + k).value.trim(); });
    if (form.querySelector('[name="_honey"]').value) return;
    var need = [["name", "your full name"], ["desig", "your designation"], ["inst", "your institution"], ["subject", "the subject or course"], ["email", "your email"], ["tool", "the tool you used"], ["title", "a title"], ["link", "a link to your entry"], ["summary", "a short description"]];
    for (var i = 0; i < need.length; i++) if (!f[need[i][0]]) return fail("Please enter " + need[i][1] + ".", $("aw_" + need[i][0]));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return fail("Please enter a valid email address.", $("aw_email"));
    if (!/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(f.link)) return fail("Please enter a full link starting with https://", $("aw_link"));
    var words = f.summary.split(/\s+/).filter(Boolean).length;
    if (words < 25 || words > 120) return fail("Please keep the description to about 40–80 words (you have " + words + ").", $("aw_summary"));
    if (!$("aw_c1").checked || !$("aw_c2").checked) return fail("Please tick both declarations to submit.");
    var data = {
      name: f.name, designation: f.desig, institution: f.inst, subject: f.subject, email: f.email, phone: f.phone,
      tool: f.tool, title: f.title, link: f.link, summary: f.summary, classroom_use: f.use,
      declarations: "Own work, no student personal data; consent to publish and feature",
      _subject: "Faculty Innovation Award entry: " + f.title.slice(0, 80), _template: "table", _captcha: "false", _replyto: f.email, page: location.href
    };
    var b = form.querySelector('button[type="submit"]'), label = b.textContent;
    b.disabled = true; b.textContent = "Submitting…"; st.className = "aw-status"; st.textContent = "";
    fetch("https://formsubmit.co/ajax/" + EMAIL, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(); }); })
      .then(function () { form.reset(); st.className = "aw-status ok"; st.textContent = "Thank you! Your entry has been submitted. We will review it within 7 working days and email you when it is published."; })
      .catch(function () { st.className = "aw-status err"; st.textContent = "Sorry, something went wrong. Please email your entry to " + EMAIL + " or WhatsApp +91 73035 59258."; })
      .then(function () { b.disabled = false; b.textContent = label; });
  });

  /* ---------- certificate page ---------- */
  var app = $("aw_certapp");
  if (!app) return;
  var DATA = []; try { DATA = JSON.parse($("aw_data").textContent); } catch (e) {}
  var SIG = ($("aw_sig") && $("aw_sig").innerHTML.trim()) || "";

  function find(id) { id = (id || "").trim().toUpperCase().replace(/-A$/, ""); for (var i = 0; i < DATA.length; i++) if (DATA[i].id.toUpperCase() === id) return DATA[i]; return null; }
  function lookupForm(msg) {
    return '<div class="card" style="max-width:620px;margin:0 auto"><h1 style="font-size:clamp(28px,4vw,38px)">Verify a certificate</h1><p class="muted" style="margin-top:6px">' + (msg || "Enter the certificate ID printed on the certificate (for example FIA-2026-001).") + '</p>' +
      '<div class="row" style="margin-top:14px;gap:10px;flex-wrap:wrap"><input id="aw_q" placeholder="FIA-2026-001" style="flex:1;min-width:200px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><button class="btn btn-accent" id="aw_qgo" type="button">Verify</button></div></div>';
  }
  function render() {
    var h = location.hash.replace(/^#/, ""), wantAward = /-A$/i.test(h), e = find(h);
    if (!h) { app.innerHTML = lookupForm(); return wireLookup(); }
    if (!e) { app.innerHTML = lookupForm("We could not find a certificate with the ID “" + esc(h) + "”. Please check the ID and try again."); return wireLookup(); }
    var award = wantAward && e.award;
    var c = cert(e, award);
    var tabs = e.award ? '<div class="row noprint" style="justify-content:center;gap:8px;margin-bottom:14px;flex-wrap:wrap"><a class="btn btn-sm ' + (award ? "btn-soft" : "btn-ink") + '" href="#' + esc(e.id) + '">Certificate of Publication</a><a class="btn btn-sm ' + (award ? "btn-ink" : "btn-soft") + '" href="#' + esc(e.id) + '-A">Award certificate</a></div>' : "";
    app.innerHTML = tabs + '<div class="aw-cert" id="aw_cert">' +
      '<div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS · FACULTY INNOVATION AWARD</div>' +
      '<h2 style="margin-top:6px">' + esc(c.heading) + '</h2><p class="muted" style="margin-top:12px">This is to certify that</p><div class="nm">' + esc(e.name) + "</div>" +
      '<p class="muted" style="margin-top:6px">' + esc([e.designation, e.institution].filter(Boolean).join(", ")) + "</p>" +
      '<p style="margin-top:12px">' + esc(c.line1) + '</p><div class="ttl">' + esc(e.title) + '</div><p style="margin-top:8px">' + esc(c.line2) + "</p>" +
      '<div class="foot"><div class="small"><b>Date:</b> ' + esc(c.date) + "<br><b>Certificate ID:</b> " + esc(c.id) + '</div><div class="small" style="text-align:right;width:220px;max-width:100%">' + (SIG ? '<div style="width:100%">' + SIG + "</div>" : "") + '<div style="border-top:1px solid #C9CCF7;padding-top:4px;margin-top:2px"><b>Founder</b><br>Intellique Research School</div></div></div></div>' +
      '<div class="row noprint" style="justify-content:center;margin-top:18px;gap:10px;flex-wrap:wrap"><button class="btn btn-accent" id="aw_pdf" type="button">Download certificate (PDF)</button><button class="btn btn-soft" id="aw_print" type="button">Print</button><button class="btn btn-soft" id="aw_copy" type="button">Copy verification link</button></div>' +
      '<p class="small noprint" id="aw_copied" style="text-align:center;color:#15803D;margin-top:6px"></p>' +
      '<div class="card noprint" style="max-width:900px;margin:18px auto 0"><p><b>✓ Verified.</b> This certificate was issued by AIStudyTools, a subsidiary of Intellique Research School Private Limited, for the entry <a href="/faculty-award/#gallery">published in the Faculty Innovation Gallery</a>.</p></div>';
    var svg = app.querySelector("#aw_cert svg"); if (svg) { svg.style.width = "100%"; svg.style.height = "auto"; svg.style.display = "block"; }
    $("aw_print").onclick = function () { window.print(); };
    $("aw_copy").onclick = function () { var u = location.href; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { $("aw_copied").textContent = "Link copied ✓"; }, function () { $("aw_copied").textContent = u; }); };
    $("aw_pdf").onclick = function () { pdf(e, c); };
  }
  function cert(e, award) {
    return award ? {
      heading: "Innovation of the Month", id: e.id + "-A", date: niceDate(e.award_date || e.published),
      line1: "has been selected for the award “" + e.award + "” for the teaching innovation",
      line2: "created with AIStudyTools (" + e.tool + ")" + (e.subject ? " for " + e.subject : "") + ", chosen for its learning value, originality and use of AI."
    } : {
      heading: "Certificate of Publication", id: e.id, date: niceDate(e.published),
      line1: "has created the teaching innovation",
      line2: "using AIStudyTools (" + e.tool + ")" + (e.subject ? " for " + e.subject : "") + ". It has been reviewed and published in the AIStudyTools Faculty Innovation Gallery."
    };
  }
  function wireLookup() {
    var go = $("aw_qgo"), q = $("aw_q");
    function run() { var v = q.value.trim(); if (v) location.hash = v.toUpperCase(); }
    go.onclick = run; q.onkeydown = function (ev) { if (ev.key === "Enter") run(); };
  }
  function sigPng(cb) {
    if (!SIG) return cb(null);
    try {
      var vb = (/viewBox="([\d.\s-]+)"/.exec(SIG) || [])[1], p = vb ? vb.split(/\s+/).map(Number) : [0, 0, 892, 197], ratio = p[3] / p[2];
      var img = new Image();
      img.onload = function () { var cv = document.createElement("canvas"); cv.width = 1200; cv.height = Math.round(1200 * ratio); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); cb(cv.toDataURL("image/png"), ratio); };
      img.onerror = function () { cb(null); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SIG.replace(/style="[^"]*"/, ""));
    } catch (err) { cb(null); }
  }
  function pdf(e, c) {
    if (!window.jspdf || !window.jspdf.jsPDF) { $("aw_copied").textContent = "The PDF tool is still loading. Please try again, or use Print → Save as PDF."; return; }
    var doc = new window.jspdf.jsPDF({ orientation: "landscape", unit: "mm", format: "a4" }), W = 297, H = 210, mid = W / 2;
    var gold = /Innovation of the Month/.test(c.heading);
    doc.setFillColor(250, 250, 255); doc.rect(0, 0, W, H, "F");
    if (gold) doc.setDrawColor(217, 119, 6); else doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(2.2); doc.rect(10, 10, W - 20, H - 20); doc.setLineWidth(0.6); doc.rect(14, 14, W - 28, H - 28);
    doc.setFillColor(79, 70, 229); doc.circle(mid - 4, 28, 5, "F"); doc.setFillColor(251, 191, 36); doc.circle(mid, 24.5, 2, "F");
    doc.setTextColor(110, 108, 148); doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.text("AISTUDYTOOLS  |  FACULTY INNOVATION AWARD", mid, 41, { align: "center" });
    doc.setTextColor(30, 27, 75); doc.setFontSize(28); doc.text(c.heading, mid, 55, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(12.5); doc.setTextColor(74, 72, 120); doc.text("This is to certify that", mid, 68, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(25); doc.setTextColor(55, 48, 163); doc.text(e.name, mid, 82, { align: "center" });
    doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.5); doc.line(mid - 70, 86, mid + 70, 86);
    var y = 94;
    var who = [e.designation, e.institution].filter(Boolean).join(", ");
    if (who) { doc.setFont("helvetica", "normal"); doc.setFontSize(11.5); doc.setTextColor(74, 72, 120); doc.text(doc.splitTextToSize(who, 220), mid, y, { align: "center" }); y += 9; }
    doc.setFont("helvetica", "normal"); doc.setFontSize(12.5); doc.setTextColor(30, 27, 75);
    var l1 = doc.splitTextToSize(c.line1.replace(/[“”]/g, '"'), 230); doc.text(l1, mid, y + 2, { align: "center" }); y += 2 + l1.length * 6;
    doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.setTextColor(55, 48, 163);
    var tt = doc.splitTextToSize(e.title, 220); doc.text(tt, mid, y + 6, { align: "center" }); y += 6 + tt.length * 7.5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11.5); doc.setTextColor(74, 72, 120);
    doc.text(doc.splitTextToSize(c.line2, 230), mid, y + 3, { align: "center" });
    doc.setFontSize(10.5); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 34); doc.text("Certificate ID: " + c.id, 30, H - 28);
    doc.setFontSize(9); doc.setTextColor(120, 118, 160); doc.text("Verify: www.aistudytools.com/faculty-award/certificate/#" + c.id, 30, H - 22);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8); doc.setTextColor(150, 150, 170); doc.text("Issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited.", mid, H - 15, { align: "center" });
    sigPng(function (png, ratio) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 56 * (ratio || 0.2208));
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save("AIStudyTools-" + (gold ? "Award" : "Publication") + "-Certificate-" + e.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  window.addEventListener("hashchange", render);
  render();
})();
