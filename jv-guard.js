/* =====================================================================
   JSVita ops guard — session-gate for internal ops pages.

   Purpose: these pages currently render their markup before the client
   auth check runs (view-source shows the shell). This script,
   injected first in <head>, hides the document until Firebase Auth
   confirms a signed-in user; otherwise it redirects to /login.html.

   - No design or branding changes: page markup/CSS untouched. The gate
     uses either the page's own dark canvas or a neutral #050505 blank.
   - Restricted flavor (data-jv-owner="1" on the script tag): additionally
     requires the signed-in user to be admin@jsvita.in.
   - Failsafe: if the Firebase SDK is unavailable within 7s, the page is
     denied (never revealed) to avoid showing content unverified.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document;
  var OWNER_EMAIL = "admin@jsvita.in";
  var LOGIN_URL = "/login.html";
  var SDK_TIMEOUT_MS = 7000;

  var script = document.currentScript || (function () {
    var all = doc.getElementsByTagName("script");
    for (var i = 0; i < all.length; i++) if (all[i].src && all[i].src.indexOf("jv-guard.js") !== -1) return all[i];
    return null;
  })();
  var requireOwner = !!(script && script.getAttribute("data-jv-owner"));

  /* --- pre-paint document lock --------------------------------------- */
  var lockStyle = doc.createElement("style");
  lockStyle.setAttribute("data-jv-guard-style", "1");
  lockStyle.textContent =
    "html[data-jv-guard] body{visibility:hidden!important}" +
    "html[data-jv-guard] .jv-guard-void{background:#050505!important;" +
    "color:#8a8f98!important;font:14px/1.4 system-ui,sans-serif!important}";
  var headOrRoot = doc.head || doc.documentElement;
  headOrRoot.appendChild(lockStyle);
  doc.documentElement.setAttribute("data-jv-guard", "1");

  function denied() {
    doc.documentElement.removeAttribute("data-jv-guard");
    var body = doc.body;
    if (body) body.classList.add("jv-guard-void");
    try { location.replace(LOGIN_URL); } catch (e) { location.href = LOGIN_URL; }
  }

  function granted() {
    var st = doc.querySelector('style[data-jv-guard-style="1"]');
    if (st && st.parentNode) st.parentNode.removeChild(st);
    doc.documentElement.removeAttribute("data-jv-guard");
    var body = doc.body;
    if (body) body.classList.remove("jv-guard-void");
  }

  function resolve(u) {
    if (!u) { denied(); return; }
    if (requireOwner) {
      var mail = (u.email || "").toLowerCase();
      if (mail !== OWNER_EMAIL) { denied(); return; }
    }
    granted();
  }

  /* --- wait for the page's own Firebase compat SDK + app init --------- */
  var started = Date.now();
  var fb = null;
  function poll() {
    var fbSlashGuard = window.document.documentElement.hasAttribute("data-jv-guard");
    if (!fbSlashGuard) return; /* already resolved */
    fb = (window.firebase && window.firebase.auth && window.firebase.apps && window.firebase.apps.length) ? window.firebase : null;
    if (fb) {
      try { fb.auth().onAuthStateChanged(resolve, denied); } catch (e) { denied(); }
      return;
    }
    if (Date.now() - started > SDK_TIMEOUT_MS) { denied(); return; }
    setTimeout(poll, 120);
  }
  poll();
})();
