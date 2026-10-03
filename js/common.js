/* ======================================================================
   common.js — shared browser helpers (loaded by every page, BEFORE supabase.js)
   • storage fallback (when the browser blocks localStorage/sessionStorage)
   • page navigation   • date / brand helpers
   ====================================================================== */

/* ── storage fallback: never crash when localStorage/sessionStorage is blocked ── */
(function () {
  function ensure(kind) {
    try {
      var s = window[kind], k = '__aci_probe__';
      s.setItem(k, '1'); s.removeItem(k);
    } catch (e) {
      var mem = {};
      var shim = {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; },
        clear: function () { mem = {}; },
        key: function (i) { return Object.keys(mem)[i] || null; },
        get length() { return Object.keys(mem).length; }
      };
      try { Object.defineProperty(window, kind, { value: shim, configurable: true }); } catch (_) {}
    }
  }
  ensure('localStorage');
  ensure('sessionStorage');
})();

/* Short translated prefix for lecture numbers (admin Daily tab + Daily PDF). */
var LEC_PREFIX = { ku: 'وانە', ar: 'درس', en: 'Lec' };

/* Neutral placeholder logo (used until the admin uploads real logos). */
var DEFAULT_LOGO_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='46' fill='%23e5e5ea'/%3E%3Cpath d='M24 62l24-30 24 30z' fill='%23c7c7cc'/%3E%3C/svg%3E";

/* ── page navigation ── */
var PAGES = { login: 'login.html', portal: 'index.html', dashboard: 'absentapi.html' };
var _aciNavigating = false;
function navigateTo(page) {
  if (_aciNavigating) return;
  _aciNavigating = true;
  window.location.replace(PAGES[page] || PAGES.login);
}

/* Display dates as DD/MM/YYYY. Accepts a Date, 'YYYY-MM-DD' or 'M/D/YYYY'. */
function formatDMY(value) {
  if (value === null || value === undefined || value === '') return '';
  var d = null, parts;
  if (Object.prototype.toString.call(value) === '[object Date]') {
    d = value;
  } else {
    var s = String(value).trim();
    if (s.indexOf('-') > 0) {
      parts = s.slice(0, 10).split('-');
      if (parts.length === 3 && parts[0].length === 4) d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    } else if (s.indexOf('/') > 0) {
      parts = s.split('/');
      if (parts.length === 3 && parts[2].length === 4) d = new Date(+parts[2], +parts[0] - 1, +parts[1]);
    }
  }
  if (!d || isNaN(d.getTime())) return String(value);
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

/* Short badge text from the English institute name ("My Computer Institute" -> "MCI"). */
function brandInitials(name) {
  var words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '🎓';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
}
