/* ============================================================
   JSVITA 2.1 — homepage runtime (premium technology rebuild)
   Static homepage hand-built for jsvita.in. This script is
   injected into the mirror index and drives:
   navigation, scroll spy, reveal motion, Selected Work data,
   the single floating WhatsApp button, lead forms,
   metadata/schema sync and generator-page nav boot.
   ============================================================
   Using the Score, big things never goes unnoticed. */
(function () {
  "use strict";
  if (window.__JSVITA21__) return;
  window.__JSVITA21__ = true;

  var EMAIL = "support@jsvita.in";
  var PHONE = "+91 63617 92699";
  var WA_URL = "https://wa.me/916361792699?text=Hi%20JSVita%20-%20I%27d%20like%20to%20book%20a%20strategy%20call.";
  var BOOK_HREF = "/contact";

  /* monochrome line icons for the WHAT WE BUILD cards */
  var ICO = {
    web: '<path d="M8 18h16M8 22h16M12 2a10 10 0 0 0 0 20M22 12a10 10 0 0 1-10 10"/>',
    portal: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    crm: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    ai: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="3"/>',
    ga: '<path d="M3 3v18h18"/><path d="M7 15a7 7 0 0 1 7-7M7 19a11 11 0 0 1 11-11"/>',
    platform: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'
  };

  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }

  /* ---------- header: scrolled state, mobile menu ---------- */
  function initNav() {
    var top = document.querySelector(".top");
    if (top) {
      var onScroll = function () { top.classList.toggle("scrolled", window.scrollY > 24); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    document.querySelectorAll(".navburger").forEach(function (b) {
      b.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        var b = document.querySelector(".navburger");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- scroll spy (new IA + generator-page slugs) ---------- */
  var SECTIONS = ["home", "solutions", "projects", "work", "technology", "about", "contact"];
  var EXTRA_SECTIONS = ["business-websites", "startup-websites", "portfolio-websites", "landing-pages", "website-redesign", "website-maintenance", "meta-ads", "lead-generation", "ad-creative-design", "web-solutions", "ca-services"];
  function initNavSpy() {
    var links = document.querySelectorAll(".nav a");
    if (!links.length) return;
    var ids = [];
    links.forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (h.charAt(0) !== "#" || h === "#") return;
      ids.push(h.slice(1));
    });
    document.querySelectorAll("section[id], div[id]").forEach(function (s) {
      var id = s.id;
      if (!id) return;
      if (SECTIONS.indexOf(id) !== -1 || EXTRA_SECTIONS.indexOf(id) !== -1) ids.push(id);
      if (/^jsv-case-/.test(id)) ids.push(id);
    });
    ids = ids.filter(function (x, i, a) { return a.indexOf(x) === i; });
    var spy = function () {
      var y = window.scrollY + 200, cur = "";
      ids.forEach(function (id) {
        var n = document.getElementById(id);
        if (n && n.getBoundingClientRect().top + window.scrollY <= y) cur = id;
      });
      if (window.scrollY < 320) cur = ids[0] || "";
      links.forEach(function (a) {
        var h = a.getAttribute("href") || "";
        a.classList.toggle("on", (h.charAt(0) === "#") && h.slice(1) === cur);
      });
    };
    if ("IntersectionObserver" in window) {
      var ratio = {};
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { ratio[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
        var best = "", v = 0;
        ids.forEach(function (id) { if ((ratio[id] || 0) > v) { v = ratio[id]; best = id; } });
        if (best) links.forEach(function (a) {
          var h = a.getAttribute("href") || "";
          a.classList.toggle("on", (h.charAt(0) === "#") && h.slice(1) === best);
        });
      }, { threshold: [.1, .3, .6] });
      ids.forEach(function (id) { var n = document.getElementById(id); if (n) io.observe(n); });
      window.addEventListener("scroll", spy, { passive: true });
    } else {
      window.addEventListener("scroll", spy, { passive: true });
      spy();
    }
  }
  function initNavSpyGen() { if (document.querySelector(".pgnav")) { initNavSpy(); } }

  /* ---------- reveal motion (transform/opacity only) ---------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Selected Work (3 premium case studies) ---------- */
  var WORKS = [
    {
      slug: "patel-co", ind: "Professional services", client: "Patel & Co.",
      challenge: "Manual client intake, scattered spreadsheets and long proposal cycles.",
      solution: "Consultation funnel: premium website, structured lead intake and client-flow automation.",
      outcome: "Discovery calls doubled while response times dropped to under an hour."
    },
    {
      slug: "arka-retail", ind: "Retail / D2C", client: "Arka Retail",
      challenge: "Fragmented brand experience across campaigns and product pages.",
      solution: "Rebuilt store presence with premium design system and conversion-focused product paths.",
      outcome: "Clear brand recognition; structured funnel from ad click to enquiry."
    },
    {
      slug: "krishnan-interiors", ind: "Design studio", client: "Krishnan Interiors",
      challenge: "Strong portfolio but no digital presence to showcase it.",
      solution: "Editorial-style showcase with gallery, case stories and guided enquiry flow.",
      outcome: "Qualified project enquiries from website within weeks of launch."
    }
  ];
  function initWorks() {
    var host = document.getElementById("workCards");
    if (!host) return;
    if (host.children.length) return; /* static cards already in place (JSVITA 2.1 renders SSG) */
    host.innerHTML = WORKS.map(function (c, i) {
      return '<a class="work-card" href="/case-' + esc(c.slug) + '" data-reveal' + (i < 2 ? ' style="transition-delay:' + (i * 70) + 'ms"' : "") + '>' +
        '<div class="work-vis" aria-hidden="true"><div class="ui">' +
          '<div class="ui-bar"><i></i><i></i><i></i></div>' +
          '<div class="ui-body"><div class="ui-line g"></div><div class="ui-line s"></div><div class="ui-line xs"></div></div>' +
          '<div class="ui-tiles"><i></i><i></i><i></i></div>' +
        '</div></div>' +
        '<div class="work-body">' +
          '<span class="work-ind">' + esc(c.ind) + '</span>' +
          '<div class="work-txt">' +
            '<div><dt>Challenge</dt><dd>' + esc(c.challenge) + '</dd></div>' +
            '<div><dt>Solution</dt><dd>' + esc(c.solution) + '</dd></div>' +
            '<div><dt>Outcome</dt><dd>' + esc(c.outcome) + '</dd></div>' +
          '</div>' +
          '<span class="work-link">View case study</a>' +
        '</div></a>';
    }).join("");
  }

  /* ---------- single floating action (one WhatsApp button only) ---------- */
  function initFab() {
    var suppressed = /(^|\/)(admin|dashboard|login)(\.html|$)/.test(location.pathname);
    if (!suppressed && !document.querySelector(".jv-wa-fab")) {
      var wa = el("a", "jv-wa-fab");
      wa.href = WA_URL; wa.target = "_blank"; wa.rel = "noopener";
      wa.setAttribute("aria-label", "WhatsApp — chat with JSVita");
      wa.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/></svg>';
      document.body.appendChild(wa);
    }
    /* JSVITA 2.1: the consult pill is permanently retired — remove any legacy copy */
    document.querySelectorAll(".jv-consult-fab").forEach(function (n) { n.remove(); });
  }

  /* ---------- lead forms (shared delivery pipeline via jsv-common.js) ---------- */
  function initLeads() {
    if (typeof window.JSVITA_INIT_LEAD === "function") { window.JSVITA_INIT_LEAD(); return; }
    var forms = document.querySelectorAll("form[data-jv-lead-form]");
    if (!forms.length) return;
    var css = el("style");
    css.textContent = ".jv-lead-error{color:#F3B6B0;font-size:13.5px;margin:12px 0 0}.jv-lead-error a{color:var(--gold-2,#F3E5AB)}";
    document.head.appendChild(css);
    Array.prototype.forEach.call(forms, function (form) {
      if (form.__jvLead) return; form.__jvLead = true;
      var ENDPOINT = "https://formsubmit.co/ajax/" + EMAIL;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector("[type=submit]");
        var btnTxt = btn ? btn.innerHTML : "";
        var data = {};
        try { new FormData(form).forEach(function (v, k) { if (k.charAt(0) !== "_") data[k] = v; }); } catch (er) {}
        var hp = form.querySelector('input[name="_honey"]');
        if (hp && hp.value) return;
        for (var kk in data) { if (data[kk] == null) data[kk] = ""; }
        data["Comments"] = "—";
        data._subject = "Strategy call request — " + (data.Name || data.name || "jsvita.in");
        data._template = "table"; data._captcha = "false";
        data["Submission Date"] = new Date().toISOString();
        data["Created Date"] = new Date().toISOString();
        data["Lead Status"] = "New Lead";
        data["Source"] = form.getAttribute("data-jv-lead-form") || "practice-form";
        data["Timestamp"] = new Date().toISOString();
        data["Source Page"] = location.href;
        data["Service Interested"] = data["Service"] || data["service"] || "";
        data["Company"] = data["business"] || data["Business Name"] || data["Company"] || "";
        data["Notes"] = "";
        if (window.JSVITA_CRM_ENDPOINT) {
          try { fetch(window.JSVITA_CRM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(function () {}); } catch (cr) {}
        }
        function lock(t) { if (btn) { btn.disabled = true; if (t) btn.innerHTML = t; } }
        function unlock() { if (btn) { btn.disabled = false; btn.innerHTML = btnTxt; } }
        function fail() { unlock(); var n = form.querySelector(".jv-lead-error"); if (!n) { n = el("p", "jv-lead-error"); n.setAttribute("role", "alert"); form.appendChild(n); } n.innerHTML = 'Delivery hiccup \u2014 email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> and we\u2019ll reply within 24 hours.'; }
        try {
          fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
            .then(function (r) { if (r.ok) { lock("Request received \u2713"); var t = form.getAttribute("data-jv-lead-redirect"); if (t) setTimeout(function () { location.assign(t); }, 600); } else fail(); })
            .catch(fail);
        } catch (er) { fail(); }
      });
    });
  }

  /* ---------- metadata, canonical & structured data sync ---------- */
  function initMeta() {
    var DESC = "JSVita is a founder-led technology company building premium websites, client portals, CRM platforms, AI automation and business infrastructure for ambitious companies.";
    var BLOBS = [
      'content="JSVita builds professional websites, landing pages, advertising creatives and lead-generation systems for modern businesses."',
      'content="JSVita helps businesses establish, market and grow their digital presence through websites, advertising and lead-generation systems."'
    ];
    var heads = [];
    var headEl = document.querySelector("head");
    var nodes = headEl ? headEl.childNodes : [];
    for (var i = 0; i < nodes.length; i++) heads.push(nodes[i]);
    heads.forEach(function (n) {
      if (n.nodeType !== 1 || n.tagName !== "META") return;
      var c = n.getAttribute("content") || "";
      if (BLOBS.some(function (b) { return c && ('content="' + c + '"') === b; })) n.setAttribute("content", DESC);
      if (c.indexOf("Websites, Meta Ads") !== -1 && (n.getAttribute("property") === "og:title" || n.getAttribute("name") === "twitter:title")) n.setAttribute("content", "JSVita — Building Premium Digital Systems");
      if (c.indexOf("Websites, Meta Ads") !== -1 && (n.getAttribute("property") === "og:image:alt")) n.setAttribute("content", "JSVita — Building Premium Digital Systems");
      if (n.getAttribute("property") === "og:image" && c.indexOf("og-image.png") !== -1) n.setAttribute("content", "https://jsvita.in/jsvita-og.png");
      if (n.getAttribute("name") === "twitter:image" && c.indexOf("og-image.png") !== -1) n.setAttribute("content", "https://jsvita.in/jsvita-og.png");
      if (n.getAttribute("name") === "description" && c.indexOf("growth solutions") !== -1) n.setAttribute("content", DESC);
    });
    var title = document.querySelector("title");
    if (title) title.textContent = "JSVita — Building Premium Digital Systems";
  }
  function initSchema() {
    var TAG = "jv21-schema";
    if (document.querySelector('script[data-x="' + TAG + '"]')) return;
    var ORG = '{ "@context": "https://schema.org", "@type": "Organization", "name": "JSVita", "url": "https://jsvita.in/", "logo": "https://jsvita.in/jsvita-logo.svg", "description": "Founder-led technology company building premium websites, client portals, CRM platforms, AI automation and business infrastructure.", "email": "support@jsvita.in", "telephone": "+916361792699", "founder": { "@type": "Person", "name": "Shridhar John", "jobTitle": "Founder" }, "address": { "@type": "PostalAddress", "addressLocality": "Bangalore", "addressRegion": "Karnataka", "addressCountry": "IN" }, "sameAs": [] }';
    var WEB = '{ "@context": "https://schema.org", "@type": "WebSite", "name": "JSVita", "url": "https://jsvita.in/" }';
    var s = el("script"); s.type = "application/ld+json"; s.setAttribute("data-x", TAG);
    s.textContent = ORG + "\n" + WEB;
    document.head.appendChild(s);
  }
  function initCanonical() {
    var links = document.querySelectorAll('link[rel="canonical"]');
    if (links.length > 1) { for (var i = 1; i < links.length; i++) links[i].parentNode.removeChild(links[i]); }
  }
  function initBoot() {
    var isGen = !!document.querySelector('link[href*="gen_pages.css"]');
    if (!isGen) return;
    var boot = el("script");
    boot.textContent = '(function(){var n=document.querySelector(".nav");if(n){var m=["Home","Solutions","Projects","Technology","About","Contact"];var url=["/","/#solutions","/#projects","/#technology","/#about","/#contact"];var h="";for(var i=0;i<m.length;i++)h+=\'<a href="\'+url[i]+\'">\'+m[i]+"</a>";h+=\'<a class="pillnav" href="/contact">Book Strategy Call</a>\';n.innerHTML=h;}})();';
    document.head.appendChild(boot);
  }
  function initNavJs() {
    var s = el("script");
    s.textContent = "(function(){var b=document.querySelector('.navburger');var n=document.querySelector('.nav');if(!b||!n)return;if(!b.dataset.j){b.dataset.j='1';b.addEventListener('click',function(){n.classList.toggle('open');b.setAttribute('aria-expanded',n.classList.contains('open')?'true':'false')});n.addEventListener('click',function(e){if(e.target&&e.target.tagName==='A'){n.classList.remove('open')}})}})();";
    document.head.appendChild(s);
  }
  function iframereplace() {
    var i = document.createElement("iframe");
    i.style.display = "none";
    i.setAttribute("aria-hidden", "true");
    i.setAttribute("title", "JSVita runtime");
    i.src = "data:text/html,<script>undefined</script>";
    document.body.appendChild(i);
    setTimeout(function () { i.parentNode.removeChild(i); }, 250);
  }

  /* ---------- boot ---------- */
  function run() {
    try { initNav(); } catch (e) {}
    try { initWorks(); } catch (e) {}
    try { initReveal(); } catch (e) {}
    try { initNavSpy(); } catch (e) {}
    try { initNavSpyGen(); } catch (e) {}
    try { initFab(); } catch (e) {}
    try { initLeads(); } catch (e) {}
    try { initMeta(); } catch (e) {}
    try { initSchema(); } catch (e) {}
    try { initCanonical(); } catch (e) {}
    try { initBoot(); } catch (e) {}
    try { initNavJs(); } catch (e) {}
    try { iframereplace(); } catch (e) {}
    console.log("[jv21] premium homepage runtime ready");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
