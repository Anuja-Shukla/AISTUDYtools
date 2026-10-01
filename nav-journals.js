/* AIStudyTools – adds a "Journal Finder" link next to every "Webinars" menu link (desktop + mobile menus). */
(function () {
  function add() {
    var links = document.querySelectorAll('a[href="/webinars"]');
    for (var i = 0; i < links.length; i++) {
      var w = links[i], parent = w.parentNode;
      if (!parent || parent.querySelector('a[data-jf]')) continue;
      var plain = [].find.call(parent.querySelectorAll("a"), function (x) { return !/font-semibold/.test(x.className); });
      var a = document.createElement("a");
      a.href = "/journals/";
      a.textContent = "Journal Finder";
      a.setAttribute("data-jf", "1");
      a.className = (plain || w).className;
      parent.insertBefore(a, w.nextSibling);
    }
  }
  new MutationObserver(add).observe(document.documentElement, { childList: true, subtree: true });
  add();
})();
