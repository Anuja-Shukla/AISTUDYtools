/* Instructors: application form, tutor-request form and directory filters. Sends by email through FormSubmit (no secrets here). */
(function () {
  var EMAIL = "intelliqueresearchschool@gmail.com";
  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? e.value.trim() : ""; }
  function okEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); }
  function send(form, st, data, okText) {
    var b = form.querySelector('button[type="submit"]'), label = b.textContent;
    b.disabled = true; b.textContent = "Sending…"; st.className = "in-status"; st.textContent = "";
    data._template = "table"; data._captcha = "false"; data.page = location.href;
    fetch("https://formsubmit.co/ajax/" + EMAIL, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(); }); })
      .then(function () { form.reset(); st.className = "in-status ok"; st.textContent = okText; try { if (window.gtag) window.gtag("event", data._event || "generate_lead", { form: data._event }); } catch (e) {} })
      .catch(function () { st.className = "in-status err"; st.textContent = "Sorry, something went wrong. Please email " + EMAIL + " or WhatsApp +91 73035 59258."; })
      .then(function () { b.disabled = false; b.textContent = label; });
  }

  /* ---------- instructor application ---------- */
  var jf = $("jn_form");
  if (jf) jf.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var st = $("jn_status");
    function fail(t, id) { st.className = "in-status err"; st.textContent = t; if (id && $(id)) $(id).focus(); }
    if (jf.querySelector('[name="_honey"]').value) return;
    var need = [["jn_name", "your full name"], ["jn_title", "your designation"], ["jn_city", "your city"], ["jn_email", "your email"], ["jn_phone", "your mobile number"], ["jn_mode", "how you teach"], ["jn_lang", "the languages you teach in"], ["jn_exp", "your teaching experience"], ["jn_qual", "your highest qualification"], ["jn_bio", "a short profile"]];
    for (var i = 0; i < need.length; i++) if (!val(need[i][0])) return fail("Please enter " + need[i][1] + ".", need[i][0]);
    if (!okEmail(val("jn_email"))) return fail("Please enter a valid email address.", "jn_email");
    if (val("jn_phone").replace(/\D/g, "").length < 10) return fail("Please enter a valid mobile number.", "jn_phone");
    var courses = [].map.call(jf.querySelectorAll('input[name="courses"]:checked'), function (c) { return c.parentNode.textContent.trim() + " [" + c.value + "]"; });
    if (!courses.length && !val("jn_new")) return fail("Please choose at least one course, or name a new course you'd like to teach.");
    var words = val("jn_bio").split(/\s+/).filter(Boolean).length;
    if (words < 25 || words > 120) return fail("Please keep your profile to about 40–80 words (you have " + words + ").", "jn_bio");
    for (var u = 0, urls = ["jn_link", "jn_photo"]; u < urls.length; u++) if (val(urls[u]) && !/^https?:\/\/\S+\.\S+/i.test(val(urls[u]))) return fail("Please enter a full link starting with https://", urls[u]);
    if (!$("jn_c1").checked || !$("jn_c2").checked) return fail("Please tick both declarations to apply.");
    send(jf, st, {
      _subject: "Instructor application: " + val("jn_name").slice(0, 60), _replyto: val("jn_email"), _event: "instructor_application",
      name: val("jn_name"), designation: val("jn_title"), institution: val("jn_inst"), city: val("jn_city"), email: val("jn_email"), phone: val("jn_phone"),
      mode: val("jn_mode"), languages: val("jn_lang"), experience: val("jn_exp"), qualification: val("jn_qual"),
      courses: courses.join("; ") || "(none selected)", new_course_interest: val("jn_new") || "(none)", profile: val("jn_bio"),
      profile_link: val("jn_link"), photo_link: val("jn_photo"), availability: val("jn_avail"), indicative_fee_private: val("jn_fee"),
      declarations: "Information accurate; consent to publish profile (contact details private)"
    }, "Thank you! Your application has been sent. We review applications within 7 working days and will email you the result.");
  });

  /* ---------- tutor request ---------- */
  var rf = $("rq_form");
  function setTutor(id, name, course) {
    if (!rf) return;
    $("rq_tutor_id").value = id || ""; $("rq_tutor").value = name || "Any suitable instructor (please match me)";
    if (course && $("rq_course").querySelector('option[value="' + course + '"]')) $("rq_course").value = course;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-tutor]"); if (!a) return;
    setTutor(a.getAttribute("data-tutor"), a.getAttribute("data-tutor-name"), $("in_course") ? $("in_course").value : "");
  });
  if (rf) {
    var q = new URLSearchParams(location.search);
    if (q.get("course")) setTutor("", "", q.get("course"));
    rf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var st = $("rq_status");
      function fail(t, id) { st.className = "in-status err"; st.textContent = t; if (id && $(id)) $(id).focus(); }
      if (rf.querySelector('[name="_honey"]').value) return;
      if (!val("rq_name")) return fail("Please enter your name.", "rq_name");
      if (!okEmail(val("rq_email"))) return fail("Please enter a valid email address.", "rq_email");
      if (!val("rq_course")) return fail("Please choose a course.", "rq_course");
      if (!val("rq_msg")) return fail("Please tell us what you would like help with.", "rq_msg");
      if (!$("rq_c1").checked) return fail("Please tick the consent box so we can introduce you.");
      var sel = $("rq_course"), courseName = sel.options[sel.selectedIndex].text;
      send(rf, st, {
        _subject: "Tutor request: " + courseName.slice(0, 50) + " – " + (val("rq_tutor_id") ? val("rq_tutor") : "match me"), _replyto: val("rq_email"), _event: "tutor_request",
        instructor: val("rq_tutor") + (val("rq_tutor_id") ? " (" + val("rq_tutor_id") + ")" : ""), learner_name: val("rq_name"), email: val("rq_email"), phone: val("rq_phone"),
        course: courseName, mode: val("rq_mode"), city: val("rq_city"), message: val("rq_msg"), consent: "Learner agreed to share request and contact details with the instructor"
      }, "Thank you! Your request has been sent. We will reply within 2 working days with an introduction.");
    });
  }

  /* ---------- directory filters ---------- */
  var grid = $("in_grid");
  if (grid && $("in_q")) {
    var cards = [].slice.call(grid.querySelectorAll(".in-card"));
    function apply() {
      var t = val("in_q").toLowerCase(), c = $("in_course").value, m = $("in_mode").value, shown = 0;
      cards.forEach(function (el) {
        var ok = (!t || el.getAttribute("data-text").indexOf(t) >= 0) && (!c || (" " + el.getAttribute("data-courses") + " ").indexOf(" " + c + " ") >= 0) &&
          (!m || el.getAttribute("data-mode") === m || el.getAttribute("data-mode") === "Online and in person");
        el.style.display = ok ? "" : "none"; if (ok) shown++;
      });
      $("in_none").style.display = shown ? "none" : "";
    }
    $("in_q").addEventListener("input", apply); $("in_course").addEventListener("change", apply); $("in_mode").addEventListener("change", apply);
    var qc = new URLSearchParams(location.search).get("course"); if (qc && $("in_course").querySelector('option[value="' + qc + '"]')) $("in_course").value = qc;
    apply();
  }
})();
