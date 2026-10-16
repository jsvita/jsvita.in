/* ============================================================================
   jsv-nav.js — progressive enhancement for the jsvita.in navbar
   Works with both nav shapes: header.top .topnav (33 marketing pages) and
   header.sticky nav (index.html React capture). No dependencies, ES5-safe,
   passive listeners + rAF throttling only. Tracking attributes
   (data-jv-track) survive because clicks are handled by document-level
   delegation in jsv-common.js.
   ========================================================================== */
(function () {
  "use strict";

  function init() {
    var header =
      document.querySelector("header.top") ||
      document.querySelector("header.sticky");
    if (!header) return;
    var nav =
      header.querySelector(".topnav") ||
      header.querySelector("nav");
    if (!nav) return;
    var mq = window.matchMedia("(max-width: 860px)");

    document.body.classList.add("jv-nav-enhanced");

    /* ---------- sliding gold indicator (desktop) ---------- */
    var ind = document.createElement("span");
    ind.className = "jv-ind";
    ind.setAttribute("aria-hidden", "true");
    nav.appendChild(ind);
    var IND_BASE = 100; /* transform-only technique: translateX * scaleX */
    function moveTo(link) {
      if (!link || mq.matches) {
        ind.classList.remove("jv-on");
        return;
      }
      var w = link.offsetWidth || 100;
      var x = link.offsetLeft || 0;
      if (getComputedStyle(nav).display === "none") {
        ind.classList.remove("jv-on");
        return;
      }
      ind.style.transform =
        "translateX(" + x + "px) scaleX(" + (w / IND_BASE).toFixed(3) + ")";
      ind.classList.add("jv-on");
    }
    nav.addEventListener("mouseenter", function () {
      var cur = nav.querySelector(".topnav a:not(.pill):hover") ||
        nav.querySelector("a:hover") || nav.querySelector(".jv-active");
      moveTo(cur);
    });
    nav.addEventListener("mouseleave", function () {
      moveTo(nav.querySelector(".jv-active"));
    });
    nav.addEventListener("focusin", function (e) {
      moveTo(e.target);
    });

    /* ---------- active state: path match + in-page scrollspy ---------- */
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var activeEl = null;
    var mclones = []; /* original → mobile clone */
    function setActive(el) {
      if (activeEl === el) return;
      if (activeEl) activeEl.classList.remove("jv-active");
      activeEl = el;
      if (el) {
        el.classList.add("jv-active");
        if (!mq.matches) moveTo(el);
      }
      mclones.forEach(function (pair) {
        pair.clone.classList.toggle("jv-active", pair.orig === el);
      });
    }
    var curPath = (location.pathname || "/").replace(/\.html$/, "").replace(/\/$/, "") || "/";
    links.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return;
      var p = href.split("#")[0].replace(/\.html$/, "").replace(/\/$/, "") || "/";
      if (p === curPath) setActive(a);
    });
    /* in-page anchors (e.g. homepage #services / #contact) get scrollspy */
    var spyTargets = [];
    links.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) === "#") {
        var el = document.getElementById(href.slice(1));
        if (el) spyTargets.push({ link: a, sec: el });
      } else if (href.indexOf("#") > 0 && href.split("#")[0] === curPath) {
        var id = href.split("#")[1];
        var sec = document.getElementById(id);
        if (sec) spyTargets.push({ link: a, sec: sec });
      }
    });
    if (spyTargets.length && "IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var hit = spyTargets.filter(function (t) { return t.sec === en.target; })[0];
            if (hit) setActive(hit.link);
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });
      spyTargets.forEach(function (t) { spy.observe(t.sec); });
    }

    /* ---------- scrolled glass state (rAF-throttled, passive) ---------- */
    var lastStuck = false;
    function onScroll() {
      var stuck = (window.scrollY || 0) > 8;
      if (stuck !== lastStuck) {
        lastStuck = stuck;
        document.body.classList.toggle("jv-nav-stuck", stuck);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- mobile menu: animated toggle + accessible slide-in ----------
       index.html (React capture) ships its own verified mobile menu
       (window.__jsvMnav). Building a second one here would duplicate the
       toggle + panel, so we defer entirely to that implementation. */
    var hasOwnMenu = window.__jsvMnav === true || !!document.querySelector(".jv-mnav-btn");
    if (!hasOwnMenu) {
    var mqLate = window.matchMedia("(max-width: 860px)");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "jv-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "jv-mnav");
    btn.setAttribute("aria-label", "Open menu");
    var s1 = document.createElement("span");
    var s2 = document.createElement("span");
    btn.appendChild(s1);
    btn.appendChild(s2);
    var bar = header.querySelector(".bar") || header.firstElementChild;
    if (bar) bar.appendChild(btn);

    var panel = document.createElement("div");
    panel.className = "jv-mnav";
    panel.id = "jv-mnav";
    var head = document.createElement("div");
    head.className = "jv-mhead";
    head.textContent = "JSVita";
    var mlinks = document.createElement("div");
    mlinks.className = "jv-mlinks";
    var pillHref = null;
    links.forEach(function (a) {
      var c = a.cloneNode(true); /* data-jv-track preserved; delegation tracks */
      if (a.classList.contains("pill")) {
        pillHref = c;
        c.className = "jv-mcta";
        return;
      }
      c.classList.remove("jv-active");
      c.addEventListener("click", function () { close(); });
      mclones.push({ orig: a, clone: c });
      mlinks.appendChild(c);
    });
    var cta = document.createElement("a");
    cta.className = "jv-mcta";
    cta.setAttribute("href", (pillHref && pillHref.getAttribute("href")) || "/#contact");
    cta.textContent = (pillHref && pillHref.textContent) || "Start a Project";
    /* persist attrs for analytics on the CTA too */
    if (pillHref) {
      var attrs = ["data-jv-track", "data-jv-info"];
      for (var i = 0; i < attrs.length; i++) {
        var v = pillHref.getAttribute(attrs[i]);
        if (v) cta.setAttribute(attrs[i], v);
      }
    }
    var foot = document.createElement("div");
    foot.className = "jv-mfoot";
    foot.textContent = "Bangalore, Karnataka · India";
    mlinks.appendChild(cta);
    panel.appendChild(head);
    panel.appendChild(mlinks);
    panel.appendChild(foot);
    document.body.appendChild(panel);

    var back = document.createElement("div");
    back.className = "jv-mback";
    back.setAttribute("aria-hidden", "true");
    document.body.appendChild(back);
    back.addEventListener("click", close);
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); btn.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("jv-open")) { close(); btn.focus(); }
    });

    function open() {
      panel.classList.add("jv-open");
      back.classList.add("jv-show");
      document.documentElement.classList.add("jv-menu-open");
      document.body.style.overflow = "hidden";
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close menu");
      var first = mlinks.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    }
    function close() {
      panel.classList.remove("jv-open");
      back.classList.remove("jv-show");
      document.documentElement.classList.remove("jv-menu-open");
      document.body.style.overflow = "";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
    }
    btn.addEventListener("click", function () {
      if (!mq.matches) return; /* toggle is CSP-hidden on desktop; ignore stray events */
      if (panel.classList.contains("jv-open")) close();
      else open();
    });
    function onMqChange(ev) {
      if (!ev.matches) close();
      ind.classList.remove("jv-on");
    }
    (mqLate.addEventListener ? mqLate.addEventListener("change", onMqChange) : mqLate.addListener(onMqChange));
    onMqChange({ matches: mqLate.matches });
    } /* end if (!hasOwnMenu) */
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(init);
})();
