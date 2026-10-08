/* ============================================================
   jv-logo.js — THE single global source of the official JSVita logo.
   Used by: Header, Hero, Footer, Mobile Menu, Contact section,
   Login pages, Loading/gate screens, and every future page.

   Usage in any page:
     <script src="/jv-logo.js"></script>          <!-- once, before use -->
     el.innerHTML = window.JVLogo.mark.replace(/__W__/g, "38");
     // or: window.JVLogo.mount(document.getElementById("brandLogo"), 34);

   Fallback guarantees:
     1. This module injects the official gradient defs itself if the
        page doesn't define them, so the mark can never render blank.
     2. Any <img data-jv-logo ...> that fails to load is automatically
        replaced by the inline official SVG (works offline / blocked CDN).
     3. window.JVLogo.fallback(imgOrEl) can be called manually.
   ============================================================ */
(function () {
  "use strict";
  if (window.JVLogo) return;

  /* THE official JSVita mark — black hexagon, platinum-gold monogram. */
  var MARK =
    '<svg width="__W__" height="__W__" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JSVita logo">' +
    '<g transform="translate(120,120)">' +
    '<polygon points="0,-105 91,-52 91,52 0,105 -91,52 -91,-52" fill="#0A0A0C" stroke="url(#jvOffGrad)" stroke-width="4"/>' +
    '<polygon points="0,-95 83,-46 83,46 0,95 -83,46 -83,-46" fill="none" stroke="url(#jvOffGrad)" stroke-width="1.4" opacity="0.55"/>' +
    '<path d="M -15,-45 L -15,25 C -15,45 0,55 25,45 C 40,38 48,22 48,22" fill="none" stroke="url(#jvOffGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M 28,-38 C 15,-48 -15,-42 -22,-25 C -28,-10 18,-2 12,20 C 6,38 -22,42 -35,30" fill="none" stroke="url(#jvOffGrad)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M -50,-20 L 0,65 L 50,-20" fill="none" stroke="url(#jvOffLin)" stroke-width="3" opacity="0.4"/>' +
    "</g></svg>";

  var DEFS =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    '<linearGradient id="jvOffGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#F3E5AB"/><stop offset="35%" stop-color="#D4AF37"/>' +
    '<stop offset="70%" stop-color="#AA771C"/><stop offset="100%" stop-color="#F3E5AB"/>' +
    "</linearGradient>" +
    '<linearGradient id="jvOffLin" x1="0%" y1="0%" x2="100%" y2="0%">' +
    '<stop offset="0%" stop-color="#C5A059"/><stop offset="50%" stop-color="#FDF0CD"/>' +
    '<stop offset="100%" stop-color="#C5A059"/></linearGradient>' +
    "</defs></svg>";

  function ensureDefs() {
    try {
      if (!document.getElementById("jvOffGrad")) {
        var host = document.body || document.documentElement;
        host.insertAdjacentHTML("afterbegin", DEFS);
      }
    } catch (e) { /* defs already provided by the page */ }
  }
  ensureDefs();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureDefs);
  }

  function fallback(el) {
    try {
      var svg = MARK.replace(/__W__/g, "38");
      if (el && el.parentNode) {
        var size = Math.round(el.getBoundingClientRect().width) || 38;
        if (size > 8 && size < 400) svg = MARK.replace(/__W__/g, String(size));
        var cls = el.className && typeof el.className === "string" ? el.className : "";
        svg = svg.replace('role="img"', 'role="img" class="' + cls + '"');
        el.parentNode.replaceChild(Object.assign(document.createElement("span"), { innerHTML: svg }).firstChild, el);
      }
    } catch (e) { /* never break the host page */ }
  }

  /* Auto-fallback: any <img data-jv-logo> that errors becomes the inline mark. */
  function bindFallbacks(root) {
    try {
      Array.prototype.forEach.call((root || document).querySelectorAll("img[data-jv-logo]"), function (img) {
        if (img.__jvBound) return;
        img.__jvBound = true;
        img.addEventListener("error", function () { fallback(img); });
        if (img.complete && img.naturalWidth === 0) fallback(img);
      });
    } catch (e) { /* ignore */ }
  }
  bindFallbacks();

  window.JVLogo = {
    mark: MARK,
    mount: function (el, size) {
      if (!el) return;
      el.innerHTML = MARK.replace(/__W__/g, String(size || 38));
    },
    fallback: fallback,
    refresh: function () { bindFallbacks(); }
  };
})();
