/* AIStudyTools – shared site behaviour */
(function () {
  var EMAIL = "intelliqueresearchschool@gmail.com";
  var WA = "917303559258";
  var WA_MSG = "Hi AIStudyTools, I would like to know more about your services.";

  // Header: shadow on scroll + mobile menu
  var hdr = document.querySelector(".hdr");
  function onScroll() { if (hdr) hdr.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var btn = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
  if (btn && nav) btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Reveal on scroll
  var els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add("in"); });

  // WhatsApp floating button
  var wa = document.createElement("a");
  wa.className = "wa"; wa.target = "_blank"; wa.rel = "noopener";
  wa.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(WA_MSG);
  wa.setAttribute("aria-label", "Chat with us on WhatsApp");
  wa.innerHTML = '<span class="wa-label">Chat on WhatsApp</span><span class="wa-btn"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/><circle cx="8.5" cy="11" r="1.2" fill="#fff" stroke="none"/><circle cx="12" cy="11" r="1.2" fill="#fff" stroke="none"/><circle cx="15.5" cy="11" r="1.2" fill="#fff" stroke="none"/></svg></span>';
  document.body.appendChild(wa);

  // Video modal (LearnX Evaluate demo)
  document.querySelectorAll("[data-video]").forEach(function (el) {
    el.addEventListener("click", function () {
      var m = document.getElementById("modal");
      if (!m) {
        m = document.createElement("div"); m.id = "modal"; m.className = "modal";
        m.innerHTML = '<button type="button" aria-label="Close video">×</button><video controls playsinline></video>';
        document.body.appendChild(m);
        var close = function () { m.classList.remove("on"); m.querySelector("video").pause(); };
        m.addEventListener("click", function (e) { if (e.target === m || e.target.tagName === "BUTTON") close(); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      }
      var v = m.querySelector("video");
      if (v.getAttribute("src") !== el.getAttribute("data-video")) v.src = el.getAttribute("data-video");
      m.classList.add("on"); v.currentTime = 0; v.play().catch(function () {});
    });
  });

  // Shared: send a form to the AIStudyTools inbox (FormSubmit)
  function sendForm(form, subject) {
    var st = form.querySelector(".status");
    var get = function (n) { var x = form.querySelector('[name="' + n + '"]'); return x ? x.value.trim() : ""; };
    var data = { name: get("name"), email: get("email"), phone: get("phone"), organisation: get("org"), interested_in: get("product"), message: get("message") };
    if (!data.name || !data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { st.className = "status err"; st.textContent = "Please enter your name and a valid email."; return; }
    var b = form.querySelector('button[type="submit"]'), label = b.textContent;
    b.disabled = true; b.textContent = "Sending…"; st.textContent = "";
    data._subject = subject + " – AIStudyTools website";
    data._template = "table"; data._captcha = "false"; data._replyto = data.email; data.page = location.href;
    fetch("https://formsubmit.co/ajax/" + EMAIL, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(); }); })
      .then(function () { form.reset(); st.className = "status ok"; st.textContent = "Thank you! We have received your request and will get back to you shortly."; })
      .catch(function () { st.className = "status err"; st.textContent = "Sorry, something went wrong. Please email " + EMAIL + " or WhatsApp +91 73035 59258."; })
      .then(function () { b.disabled = false; b.textContent = label; });
  }
  function pickProduct(sel, name) {
    if (!sel || !name) return;
    var key = /HealthX/i.test(name) ? "HealthX" : /SkillX/i.test(name) ? "SkillX" : /Webinar/i.test(name) ? "Webinars" : "LearnX";
    [].forEach.call(sel.options, function (o) { if (o.text.indexOf(key) === 0) sel.value = o.value; });
  }
  var OPTIONS = '<option>LearnX — Learning &amp; Research</option><option>HealthX — Healthcare Insights</option><option>SkillX — Training &amp; Simulations</option><option>All of the above</option><option>Webinars</option>';

  // Contact page form (consultations): prefill from ?demo=
  var form = document.getElementById("contact-form");
  if (form) {
    var demo = new URLSearchParams(location.search).get("demo");
    if (demo) {
      pickProduct(form.querySelector('[name="product"]'), demo);
      var msg = form.querySelector('[name="message"]');
      if (!msg.value) msg.value = "I would like to book a demo of " + demo + ".";
      var h = document.getElementById("form-title"); if (h) h.textContent = "Book a demo of " + demo;
    }
    form.addEventListener("submit", function (e) { e.preventDefault(); sendForm(form, demo ? "Demo request: " + demo : "Consultation request"); });
  }

  // Side tab: "Get a free demo" opens a short form
  var tab = document.createElement("button");
  tab.type = "button"; tab.className = "demo-tab"; tab.setAttribute("aria-haspopup", "dialog");
  tab.innerHTML = '<span class="dot" aria-hidden="true"></span>Get a free demo';
  document.body.appendChild(tab);
  var dm = document.createElement("div");
  dm.className = "dmodal"; dm.setAttribute("role", "dialog"); dm.setAttribute("aria-modal", "true"); dm.setAttribute("aria-labelledby", "dm-title");
  dm.innerHTML = '<div class="panel"><button type="button" class="x" aria-label="Close">×</button>' +
    '<span class="tag">Free · No obligation</span><h2 id="dm-title" style="margin-top:12px">Get a free demo</h2>' +
    '<p class="sub">Tell us a little about you. We will show you your own content as a video, mind map and game.</p>' +
    '<form class="form" id="demo-form" novalidate>' +
    '<div class="row2"><div class="field"><label for="d-name">Full name</label><input id="d-name" name="name" autocomplete="name" required></div>' +
    '<div class="field"><label for="d-email">Email</label><input id="d-email" name="email" type="email" autocomplete="email" required></div></div>' +
    '<div class="row2"><div class="field"><label for="d-phone">Phone / WhatsApp</label><input id="d-phone" name="phone" type="tel" autocomplete="tel"></div>' +
    '<div class="field"><label for="d-org">Organisation</label><input id="d-org" name="org" autocomplete="organization"></div></div>' +
    '<div class="field"><label for="d-product">Interested in</label><select id="d-product" name="product">' + OPTIONS + '</select></div>' +
    '<div class="field"><label for="d-msg">Anything we should know? (optional)</label><textarea id="d-msg" name="message" style="min-height:90px"></textarea></div>' +
    '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><button class="btn btn-accent" type="submit">Request my free demo</button><p class="status" role="status" aria-live="polite"></p></div>' +
    '</form></div>';
  document.body.appendChild(dm);
  var dform = dm.querySelector("form"), dprod = "";
  function openDemo(product) {
    dprod = product || "";
    var path = location.pathname;
    pickProduct(dform.querySelector('[name="product"]'), dprod || (/healthx/.test(path) ? "HealthX" : /skillx/.test(path) ? "SkillX" : /webinars/.test(path) ? "Webinars" : "LearnX"));
    dform.querySelector(".status").textContent = "";
    dm.classList.add("on"); setTimeout(function () { dform.querySelector('[name="name"]').focus(); }, 50);
  }
  function closeDemo() { dm.classList.remove("on"); tab.focus(); }
  tab.addEventListener("click", function () { openDemo(""); });
  dm.addEventListener("click", function (e) { if (e.target === dm || e.target.classList.contains("x")) closeDemo(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && dm.classList.contains("on")) closeDemo(); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#demo"]'); if (!a) return;
    e.preventDefault(); openDemo(decodeURIComponent(a.getAttribute("href").slice(6)));
  });
  dform.addEventListener("submit", function (e) {
    e.preventDefault();
    var p = dform.querySelector('[name="product"]').value.split(" ")[0];
    sendForm(dform, "Free demo request: " + (dprod || p));
  });

  // LearnX hook video: sound toggle, hide if the file is missing
  var hv = document.getElementById("hook-video"), hs = document.getElementById("hook-sound");
  if (hv) {
    hv.addEventListener("error", function () { var sec = document.getElementById("hook"); if (sec) sec.style.display = "none"; });
    fetch(hv.getAttribute("src"), { method: "HEAD" }).then(function (r) { if (!r.ok) hv.dispatchEvent(new Event("error")); }).catch(function () {});
    if (hs) hs.addEventListener("click", function () { hv.muted = false; hv.loop = false; hv.currentTime = 0; hv.controls = true; hv.play().catch(function () {}); hs.hidden = true; });
  }

  // Mind map: draw curved links from the centre to each bubble
  function drawMaps() {
    document.querySelectorAll(".mindmap").forEach(function (m) {
      var g = m.querySelector("svg g"), c = m.querySelector(".center"); if (!g || !c) return;
      var R = m.getBoundingClientRect(), cr = c.getBoundingClientRect();
      var cx = cr.left + cr.width / 2 - R.left, cy = cr.top + cr.height / 2 - R.top, d = "";
      m.querySelectorAll(".chip").forEach(function (ch) {
        var r = ch.getBoundingClientRect(), x = r.left + r.width / 2 - R.left, y = r.top + r.height / 2 - R.top;
        var mx = (cx + x) / 2, my = (cy + y) / 2;
        d += '<path d="M' + cx + " " + cy + " Q " + (mx + (y - cy) * 0.15) + " " + (my - (x - cx) * 0.15) + " " + x + " " + y + '"/>';
      });
      g.innerHTML = d;
    });
  }
  drawMaps(); window.addEventListener("resize", drawMaps);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawMaps);

  var yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();
})();
