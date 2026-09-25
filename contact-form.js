/* AIStudyTools – sends the Contact form to email and links "Book a demo" buttons to it. */
(function () {
  var TO = "intelliqueresearchschool@gmail.com";
  var ENDPOINT = "https://formsubmit.co/ajax/" + TO;

  // 1) "Book a demo" / "Request access" buttons on LearnX -> Contact form
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('#lx-extra a[href^="mailto:"]');
    if (!a) return;
    e.preventDefault();
    var what = /Evaluate/i.test(a.href) ? "LearnX Evaluate" : "LearnX Studio";
    location.href = "/contact?demo=" + encodeURIComponent(what);
  }, true);

  function setVal(el, v) {
    var proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype :
                el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
    el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
  }

  // 2) Prefill the form when arriving from a demo button
  function prefill() {
    if (location.pathname.replace(/\/+$/, "") !== "/contact") return;
    var demo = new URLSearchParams(location.search).get("demo");
    var form = document.querySelector("form");
    if (!demo || !form || form.dataset.lxPrefilled) return;
    form.dataset.lxPrefilled = "1";
    var sel = form.querySelector('[name="product"]');
    if (sel) {
      var opt = [].find.call(sel.options, function (o) { return /LearnX/.test(o.text); });
      if (opt) setVal(sel, opt.value);
    }
    var msg = form.querySelector('[name="message"]');
    if (msg && !msg.value) setVal(msg, "I would like to book a demo of " + demo + ".");
    setTimeout(function () { form.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300);
  }

  // 3) Send the Contact form by email
  document.addEventListener("submit", function (e) {
    if (location.pathname.replace(/\/+$/, "") !== "/contact") return;
    var form = e.target;
    if (!form || form.tagName !== "FORM") return;
    e.preventDefault();
    e.stopImmediatePropagation();

    var get = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; };
    var data = {
      name: get("name"), email: get("email"), organisation: get("org"),
      interested_in: get("product"), message: get("message")
    };
    var status = form.querySelector(".lx-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "lx-status";
      status.style.cssText = "margin:4px 0 0;font-size:14px;font-weight:600";
      form.appendChild(status);
    }
    if (!data.name || !data.email) {
      status.style.color = "#b42318"; status.textContent = "Please enter your name and email.";
      return;
    }
    var btn = form.querySelector('button[type="submit"], button');
    var label = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    status.textContent = "";

    var demo = new URLSearchParams(location.search).get("demo");
    data._subject = (demo ? "Demo request: " + demo : "New enquiry") + " – AIStudyTools website";
    data._template = "table";
    data._captcha = "false";
    data._replyto = data.email;
    data.page = location.href;

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || "Failed"); }); })
      .then(function () {
        form.reset();
        status.style.color = "#067647";
        status.textContent = "Thank you! We have received your request and will get back to you shortly.";
      })
      .catch(function () {
        status.style.color = "#b42318";
        status.textContent = "Sorry, something went wrong. Please email us at " + TO + " or call +91 7303559258.";
      })
      .then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
  }, true);

  new MutationObserver(prefill).observe(document.documentElement, { childList: true, subtree: true });
  prefill();
})();
