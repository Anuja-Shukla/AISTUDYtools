/* AIStudyTools – floating WhatsApp chat button (bottom-right, every page). */
(function () {
  if (document.getElementById("wa-float")) return;
  var NUMBER = "917303559258"; // +91 73035 59258
  var MSG = "Hi AIStudyTools, I would like to know more about your services.";
  var css = document.createElement("style");
  css.textContent =
    "#wa-float{position:fixed;right:20px;bottom:20px;z-index:9998;display:flex;align-items:center;gap:10px;text-decoration:none;font-family:Inter,ui-sans-serif,system-ui,sans-serif}" +
    "#wa-float .wa-btn{width:58px;height:58px;border-radius:50%;background:#25D366;display:grid;place-items:center;box-shadow:0 10px 25px -6px rgba(0,0,0,.35);transition:transform .15s}" +
    "#wa-float:hover .wa-btn{transform:scale(1.07)}" +
    "#wa-float .wa-label{background:#fff;color:#111827;font-size:14px;font-weight:600;padding:9px 14px;border-radius:999px;box-shadow:0 8px 22px -8px rgba(0,0,0,.3);white-space:nowrap}" +
    "#wa-float .wa-btn::after{content:'';position:absolute;width:58px;height:58px;border-radius:50%;background:#25D366;opacity:.45;z-index:-1;animation:wa-pulse 2.4s ease-out infinite}" +
    "@keyframes wa-pulse{0%{transform:scale(1);opacity:.45}100%{transform:scale(1.6);opacity:0}}" +
    "@media (max-width:640px){#wa-float{right:14px;bottom:14px}#wa-float .wa-label{display:none}#wa-float .wa-btn{width:54px;height:54px}}" +
    "@media print{#wa-float{display:none}}";
  document.head.appendChild(css);
  var a = document.createElement("a");
  a.id = "wa-float";
  a.href = "https://wa.me/" + NUMBER + "?text=" + encodeURIComponent(MSG);
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with us on WhatsApp");
  a.innerHTML = '<span class="wa-label">Chat on WhatsApp</span><span class="wa-btn">' +
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/><circle cx="8.5" cy="11" r="1.2" fill="#fff" stroke="none"/><circle cx="12" cy="11" r="1.2" fill="#fff" stroke="none"/><circle cx="15.5" cy="11" r="1.2" fill="#fff" stroke="none"/></svg></span>';
  (document.body ? Promise.resolve() : new Promise(function (r) { document.addEventListener("DOMContentLoaded", r); })).then(function () { document.body.appendChild(a); });
})();
