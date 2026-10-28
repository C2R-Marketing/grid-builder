/* Grid tracking — $0, no backend, no cookies.
   Views + clicks per box live in this browser's localStorage.
   Outbound links also carry UTM tags (utm_source=grid) for cross-device
   counts in the destination's own analytics.
   Exposes window.GridStats for testing: recordView, recordClick, readAll, resetAll. */
(function () {
  var PREFIX = "gridstats:";
  function store() { try { return window.localStorage; } catch (e) { return null; } }
  function getNum(s, k) { var v = parseInt(s.getItem(k) || "0", 10); return isNaN(v) ? 0 : v; }
  function recordView(grid) {
    var s = store(); if (!s || !grid) return;
    s.setItem(PREFIX + grid + ":views", String(getNum(s, PREFIX + grid + ":views") + 1));
    s.setItem(PREFIX + grid + ":lastView", new Date().toISOString());
  }
  function recordClick(grid, box) {
    var s = store(); if (!s || !grid || !box) return;
    var k = PREFIX + grid + ":clicks:" + box;
    s.setItem(k, String(getNum(s, k) + 1));
    s.setItem(k + ":last", new Date().toISOString());
  }
  function readAll() {
    var s = store(); var out = {};
    if (!s) return out;
    for (var i = 0; i < s.length; i++) {
      var k = s.key(i);
      if (!k || k.indexOf(PREFIX) !== 0) continue;
      var rest = k.slice(PREFIX.length);
      var parts = rest.split(":");
      var grid = parts[0];
      if (!out[grid]) out[grid] = { views: 0, boxes: {} };
      if (parts[1] === "views") out[grid].views = getNum(s, k);
      if (parts[1] === "clicks" && parts[2] && !parts[3]) {
        out[grid].boxes[parts[2]] = getNum(s, k);
      }
    }
    Object.keys(out).forEach(function (g) {
      out[g].boxes = Object.keys(out[g].boxes).sort(function (a, b) {
        return out[g].boxes[b] - out[g].boxes[a];
      }).map(function (b) { return { box: b, clicks: out[g].boxes[b] }; });
    });
    return out;
  }
  function resetAll() {
    var s = store(); if (!s) return;
    var drop = [];
    for (var i = 0; i < s.length; i++) { var k = s.key(i); if (k && k.indexOf(PREFIX) === 0) drop.push(k); }
    drop.forEach(function (k) { s.removeItem(k); });
  }
  function markMostPicked(grid) {
    var data = readAll()[grid];
    if (!data || !data.boxes.length || !data.boxes[0].clicks) return;
    var top = data.boxes[0].box;
    document.querySelectorAll('[data-grid="' + grid + '"][data-box="' + top + '"]').forEach(function (el) {
      if (el.querySelector(".most-picked")) return;
      var badge = document.createElement("span");
      badge.className = "most-picked";
      badge.textContent = "Most picked";
      el.appendChild(badge);
    });
  }
  window.GridStats = { recordView: recordView, recordClick: recordClick, readAll: readAll, resetAll: resetAll };
  document.addEventListener("DOMContentLoaded", function () {
    var page = document.querySelector("[data-grid-page]");
    if (page) {
      var grid = page.getAttribute("data-grid-page");
      recordView(grid);
      markMostPicked(grid);
    }
    document.querySelectorAll("[data-box]").forEach(function (el) {
      el.addEventListener("click", function () {
        recordClick(el.getAttribute("data-grid"), el.getAttribute("data-box"));
      });
    });
  });
})();
