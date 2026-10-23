/* AIStudyTools: "Find a tutor for this course" box on course pages.
   Fills <section id="tutor-box" data-course="slug"> from /instructors/instructors.json. Shows a congratulations line on the certificate screen. */
(function () {
  var box = document.getElementById("tutor-box");
  if (!box) return;
  var slug = box.getAttribute("data-course") || "", DATA = null;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function initials(n) { var p = String(n).replace(/\./g, " ").split(/\s+/).filter(function (w) { return w && !/^(dr|prof|mr|ms|mrs)$/i.test(w); }); return ((p[0] || "?")[0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase(); }
  var css = '<style>#tutor-box{max-width:1080px;margin:10px auto 40px;padding:0 20px}#tutor-box .tb{background:#fff;border:2px solid #E4E5F5;border-radius:20px;padding:22px}' +
    '#tutor-box h2{font-size:clamp(22px,3vw,28px);margin:0}#tutor-box .tb-sub{color:#4A4878;margin-top:6px;font-size:16px}' +
    '#tutor-box .tb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:16px}' +
    '#tutor-box .tb-c{border:2px solid #E4E5F5;border-radius:16px;padding:14px;display:flex;gap:12px;align-items:flex-start}' +
    '#tutor-box .tb-av{width:48px;height:48px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;background:linear-gradient(135deg,#4F46E5,#14B8A6);overflow:hidden}' +
    '#tutor-box .tb-av img{width:100%;height:100%;object-fit:cover}#tutor-box .tb-m{font-size:14px;color:#6E6C94}' +
    '#tutor-box .tb-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}#tutor-box .tb-btn{display:inline-flex;align-items:center;padding:10px 18px;border-radius:12px;font-weight:700;text-decoration:none;font-size:15px}' +
    '#tutor-box .tb-p{background:#4F46E5;color:#fff}#tutor-box .tb-s{background:#EEF0FF;color:#3730A3}#tutor-box .tb-congrats{background:#FEF3C7;color:#854D0E;border-radius:12px;padding:10px 14px;font-weight:700;margin-bottom:12px}' +
    '@media print{#tutor-box{display:none}}</style>';
  function render() {
    var list = DATA ? DATA.instructors.filter(function (e) { return (e.courses || []).indexOf(slug) >= 0; }) : [];
    var title = DATA && DATA.courses[slug] ? DATA.courses[slug] : "this course";
    var cert = /^#\/certificate/.test(location.hash);
    var req = "/instructors/?course=" + encodeURIComponent(slug) + "#request";
    var h = css + '<div class="tb">' + (cert ? '<div class="tb-congrats">🎉 Congratulations on finishing the course! Want to go further with one-to-one guidance?</div>' : "") +
      "<h2>" + (list.length ? "Learn with a tutor" : "Want a tutor for " + esc(title) + "?") + "</h2>" +
      '<p class="tb-sub">' + (list.length ? "These approved instructors teach " + esc(title) + ". Send a request and we will introduce you." : "Request a tutor and we will match you with an approved instructor for " + esc(title) + ".") + "</p>";
    if (list.length) h += '<div class="tb-grid">' + list.slice(0, 6).map(function (e) {
      return '<div class="tb-c"><div class="tb-av">' + (e.photo ? '<img src="' + esc(e.photo) + '" alt="" loading="lazy">' : esc(initials(e.name))) + '</div><div><b>' + esc(e.name) + '</b><div class="tb-m">' + esc([e.title, e.city, e.mode].filter(Boolean).join(" · ")) + '</div><a class="tb-m" style="color:#4F46E5;font-weight:700" href="/instructors/?course=' + encodeURIComponent(slug) + '#directory">View profile →</a></div></div>';
    }).join("") + "</div>";
    h += '<div class="tb-row"><a class="tb-btn tb-p" href="' + req + '">Request a tutor</a>' + (list.length ? '<a class="tb-btn tb-s" href="/instructors/?course=' + encodeURIComponent(slug) + '#directory">See all instructors</a>' : "") + '<a class="tb-btn tb-s" href="/instructors/join/">Teach this course</a></div></div>';
    box.innerHTML = h;
  }
  render();
  fetch("/instructors/instructors.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (d) { DATA = d; render(); }).catch(function () {});
  window.addEventListener("hashchange", render);
})();
