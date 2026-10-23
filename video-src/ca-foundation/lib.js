/* Shared scene helpers for the CA Foundation lesson videos (used by every lesson's scenes.js).
   All reveal times `at` are fractions (0–1) of the current narration line. */
function sp(n) { return '<div style="height:' + n + 'px"></div>'; }
function T(title, at) { return '<h2 ' + rv(at || 0) + ">" + title + "</h2>"; }
function arrow(at, label) { return '<div ' + rv(at, 0) + ' class="m" style="font-size:34px;font-weight:700;margin:0 8px;line-height:1">' + (label ? '<div style="font-size:21px;color:var(--orange);margin-bottom:2px">' + label + "</div>" : "") + "→</div>"; }
function down(at, label) { return '<div ' + rv(at, 0) + ' class="m" style="font-size:30px;font-weight:700;line-height:1;margin:4px 0">↓' + (label ? ' <span style="font-size:20px;color:var(--orange)">' + label + "</span>" : "") + "</div>"; }
function eq(html, at, size, cls) { return '<div class="eq ' + (cls || "") + '" ' + rv(at) + (size ? ' style="font-size:' + size + 'px"' : "") + ">" + html + "</div>"; }
function boxed(html, at, size) { return '<div class="box" ' + rvs(at) + (size ? ' style="font-size:' + size + 'px"' : "") + ">" + html + "</div>"; }
function note(html, at, teal) { return '<span class="note" ' + rv(at) + (teal ? ' style="background:var(--teal-soft);color:var(--teal-dk)"' : "") + ">" + html + "</span>"; }
function pill(html, at, cls, size) { return '<span class="pill ' + (cls || "") + '" ' + rvs(at) + (size ? ' style="font-size:' + size + 'px"' : "") + ">" + html + "</span>"; }
function chipsRow(arr, at, step, hlIdx) { return '<div class="row">' + arr.map(function (x, i) { var on = hlIdx !== undefined && (hlIdx === i || (hlIdx instanceof Array && hlIdx.indexOf(i) >= 0)); return '<span class="chip" ' + rvs(at + (step || 0) * i) + (on ? ' style="background:var(--teal);color:#fff;border-top-color:var(--teal)"' : "") + ">" + x + "</span>"; }).join("") + "</div>"; }
function card(inner, at, width, extra) { return '<div class="card" ' + rvs(at) + ' style="' + (width ? "width:" + width + "px;" : "") + (extra || "") + '">' + inner + "</div>"; }
function cardT(label, big, sub, at, width, col) { return card('<div class="m" style="font-size:20px;font-weight:700">' + label + '</div><div class="mid" style="margin:6px 0;font-size:34px;color:' + (col || "var(--navy)") + '">' + big + "</div>" + (sub ? '<div class="m" style="font-size:19px;font-weight:600">' + sub + "</div>" : ""), at, width); }
var COLS = ["#1F9A94", "#F28C28", "#1E2A47", "#1F9A94", "#F28C28", "#1E2A47"];
function listOf(items, at, step, width, size) {
  return '<div class="list" style="width:' + (width || 720) + 'px">' + items.map(function (x, i) {
    return '<div class="li" ' + rv(at + i * step) + '><span class="num" style="background:' + COLS[i % 3] + '">' + (i + 1) + '</span><span style="flex:1;font-size:' + (size || 25) + 'px">' + x[0] + "</span>" + (x[1] ? '<span class="t" style="font-size:21px;font-weight:700">' + x[1] + "</span>" : "") + "</div>";
  }).join("") + "</div>";
}
function grid(cards, cols, at, step, w) {
  return '<div style="display:grid;grid-template-columns:repeat(' + cols + "," + (w || 300) + 'px);gap:18px">' + cards.map(function (c, i) {
    return '<div class="card" ' + rvs(at + i * step) + '><div class="m" style="font-size:19px;font-weight:700">' + c[0] + '</div><div class="mid n" style="margin-top:6px;font-size:' + (c[3] || 30) + 'px">' + c[1] + "</div>" + (c[2] ? '<div style="font-size:18px;color:var(--orange);font-weight:700;margin-top:4px">' + c[2] + "</div>" : "") + "</div>";
  }).join("") + "</div>";
}
/* table whose rows appear one by one; hlRow highlighted */
function table(head, rows, at, step, hlRow, width) {
  return '<div class="card" ' + rv(at) + ' style="padding:10px 16px;' + (width ? "width:" + width + "px" : "") + '"><table style="border-collapse:collapse;width:100%;font-size:23px">' +
    '<tr>' + head.map(function (h) { return '<th style="padding:8px 14px;color:var(--teal-dk);background:var(--teal-soft);font-weight:700">' + h + "</th>"; }).join("") + "</tr>" +
    rows.map(function (r, i) { var on = hlRow === i && hl(at + step * (rows.length + 0.5)); return '<tr ' + rv(at + step * (i + 1), 6) + ' style="' + (on ? "background:var(--orange-soft);" : "") + '">' + r.map(function (c) { return '<td style="padding:8px 14px;border-top:1px solid var(--line);font-weight:600;color:var(--navy)">' + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>";
}
/* horizontal bars: rows = [[label, value, display, color]] */
function hbars(rows, max, at, step, width, valFmt) {
  return '<div style="text-align:left;width:' + ((width || 520) + 260) + 'px;padding-left:40px">' + rows.map(function (r, i) {
    var a = at + i * step, w = (width || 520) * r[1] / max * ease((LT - a * LD) / 0.9);
    return '<div ' + rv(a, 0) + ' style="display:flex;align-items:center;gap:14px;margin:9px 0"><b style="width:' + (r[4] || 90) + 'px;font-size:22px;color:var(--navy);text-align:right">' + r[0] + '</b><div style="height:36px;width:' + w.toFixed(1) + 'px;background:' + (r[3] || "var(--teal)") + ';border-radius:8px"></div><b style="font-size:23px;color:var(--navy);min-width:90px">' + (valFmt ? valFmt(count(0, r[1], a, 0.9)) : r[2]) + "</b></div>";
  }).join("") + "</div>";
}
/* vertical bars (histogram / pmf): vals, labels; gap 0 = touching */
function vbars(labels, vals, at, opts) {
  opts = opts || {}; var W = opts.w || 640, H = opts.h || 240, max = opts.max || Math.max.apply(null, vals), n = vals.length, bw = W / n, gap = opts.gap === undefined ? 0.2 : opts.gap, g = ease((LT - at * LD) / 1.0), s = "";
  vals.forEach(function (v, i) { var h = (H - 30) * v / max * g, x = i * bw + bw * gap / 2; s += '<rect x="' + x + '" y="' + (H - 26 - h) + '" width="' + (bw * (1 - gap)) + '" height="' + h + '" rx="' + (gap ? 5 : 0) + '" fill="' + (opts.hl === i ? "#F28C28" : (opts.col || "#1F9A94")) + '" stroke="#fff" stroke-width="' + (gap ? 0 : 2) + '"/>' + '<text x="' + (i * bw + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="16" font-weight="600" fill="#6B7590" font-family="Outfit">' + labels[i] + "</text>" + (opts.vals ? '<text x="' + (i * bw + bw / 2) + '" y="' + (H - 32 - h) + '" text-anchor="middle" font-size="17" font-weight="700" fill="#1E2A47" font-family="Outfit" opacity="' + g + '">' + opts.vals[i] + "</text>" : ""); });
  return '<svg ' + rv(at, 0) + ' width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '"><line x1="0" x2="' + W + '" y1="' + (H - 26) + '" y2="' + (H - 26) + '" stroke="#1E2A47" stroke-width="2"/>' + s + "</svg>";
}
function introScene(title, sub, pills) {
  return { tag: "Introduction", draw: function () {
    return sp(36) + '<h1 ' + rv(0) + ">" + title + '</h1><div class="sub" ' + rv(0.08) + ">" + sub + "</div>" + sp(44) +
      '<div class="row">' + pills.map(function (x, i) { return '<span class="pill' + (i % 2 ? " n" : "") + '" ' + rvs(0.3 + i * (0.55 / pills.length)) + ">" + x + "</span>"; }).join("") + "</div>";
  } };
}
function recapScene(items, last) {
  return { tag: "Summary", draw: function () {
    return T("Remember") + sp(22) + listOf(items, 0.1, 0.62 / items.length, 780, 24) + sp(22) + pill(last || "Now try the interactive tool below ↓", 0.82);
  } };
}
function mcqScene(q, opts, ans, why) {
  return { tag: "Exam practice", draw: function () {
    var show = hl(0.62);
    return T("Try this exam-style question") + sp(16) + card('<div style="font-size:26px;font-weight:700;color:var(--navy);text-align:left;margin-bottom:12px">' + q + "</div>" +
      opts.map(function (o, i) { var ok = show && i === ans; return '<div ' + rv(0.12 + i * 0.07, 6) + ' style="text-align:left;font-size:24px;font-weight:600;padding:8px 14px;margin:6px 0;border-radius:10px;border:2px solid ' + (ok ? "var(--teal)" : "var(--line)") + ";background:" + (ok ? "var(--teal-soft)" : "#fff") + ';color:var(--navy)"><b style="color:var(--teal-dk)">' + "ABCD"[i] + ".</b> " + o + (ok ? " ✓" : "") + "</div>"; }).join("") +
      (show ? '<div style="text-align:left;font-size:21px;color:#B4570E;font-weight:600;margin-top:10px">' + why + "</div>" : ""), 0.02, 760);
  } };
}
/* text column on the left, picture on the right (never wraps) */
function side(left, right, lw) { return '<div style="display:flex;gap:26px;align-items:center;justify-content:center;flex-wrap:nowrap;margin-top:6px"><div style="width:' + (lw || 330) + 'px;flex:none;display:flex;flex-direction:column;align-items:center">' + left + '</div><div style="flex:none">' + right + "</div></div>"; }
function T2(title, at) { return '<h2 ' + rv(at || 0) + ' style="font-size:32px;line-height:1.15">' + title + "</h2>"; }
