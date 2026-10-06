/* ============================================================
   JSVita — shared runtime for static pages (founder, service pages)
   Phase 7 · Authority & Conversion
   ------------------------------------------------------------
   1. jvTrack        — one event fanned out to GTM / GA4 / Meta Pixel
   2. GA4 / GTM      — set GA4_ID / GTM_ID below; loaders are ID-gated
                       (use GA4_ID alone, or GTM alone, or GTM with a
                       GA4 tag inside it — not GA4+GTM on one property)
   3. Clarity        — set CLARITY_ID below to switch on heatmaps,
                       session recordings and scroll tracking
   4. Calendly modal — set CALENDLY_URL below to embed your booking
                       page in a premium modal; while it is empty the
                       modal shows a graceful fallback (WhatsApp +
                       contact form) so the CTA still converts
   5. Lead forms     — every form[data-jv-lead-form] posts its fields
                       to LEAD_EMAIL. Set window.JSVITA_LEAD_ENDPOINT
                       before this script to use your own backend.
   ------------------------------------------------------------
   No libraries. No layout shift. Everything is lazy: Clarity loads
   only when CLARITY_ID is set, Calendly's iframe only when opened.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- EDIT THESE VALUES ---------- */
  var CALENDLY_URL = ""; /* e.g. "https://calendly.com/jsvita/consultation" */
  var CLARITY_ID = "XXXXXXXX";   /* Microsoft Clarity project ID */
  var GA4_ID = "G-XXXXXXXXXX";       /* Google Analytics 4 measurement ID */
  var GTM_ID = "GTM-XXXXXXX";        /* Google Tag Manager container ID */
  var LEAD_EMAIL = "support@jsvita.in"; /* every lead form delivers here */
  /* --------------------------------------- */
  /* Placeholder guard — these example IDs load nothing until replaced with
     the real values from the GA4 / GTM / Clarity dashboards. */
  function realId(id, pattern) { return !!id && new RegExp(pattern).test(id); }

  /* ---- 1 · conversion tracking ---- */
  function jvTrack(event, params) {
    try {
      params = params || {};
      window.dataLayer = window.dataLayer || [];
      var payload = { event: event };
      for (var k in params) { if (Object.prototype.hasOwnProperty.call(params, k)) payload[k] = params[k]; }
      window.dataLayer.push(payload);
      if (typeof window.gtag === "function") window.gtag("event", event, params);
      if (typeof window.fbq === "function") window.fbq("trackCustom", event, params);
    } catch (e) {}
  }

  /* ---- 1b · GA4 — Google Analytics 4 (ID-gated, no layout impact) ---- */
  function initGA4() {
    if (!realId(GA4_ID, "^G-[A-Z0-9]{4,}$") || GA4_ID.indexOf("XXXX") !== -1) return;
    try {
      if (!document.querySelector("script[src*='googletagmanager.com/gtag/js']")) {
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
        document.head.appendChild(s);
      }
      window.dataLayer = window.dataLayer || [];
      if (!window.__jvGtagInit) {
        window.__jvGtagInit = true;
        if (typeof window.gtag !== "function") window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", GA4_ID, { send_page_view: true });
      }
    } catch (e) {}
  }

  /* ---- 1c · GTM — Google Tag Manager (ID-gated, async, render-blocking-free) ---- */
  function initGTM() {
    if (!realId(GTM_ID, "^GTM-[A-Z0-9]+$") || GTM_ID.indexOf("XXXX") !== -1) return;
    try {
      if (document.querySelector("script[src*='googletagmanager.com/gtm.js']")) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
      document.head.appendChild(s);
    } catch (e) {}
  }

  /* ---- 2 · Microsoft Clarity (heatmaps · recordings · scroll depth) ---- */
  function initClarity() {
    if (!realId(CLARITY_ID, "^[a-z0-9]{6,}$") || CLARITY_ID.indexOf("XXXX") !== -1) return;
    try {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", CLARITY_ID);
    } catch (e) {}
  }

  /* ---- 3 · premium Calendly modal ---- */
  var modalBuilt = false;
  var overlay = null;

  function injectModalCss() {
    if (document.getElementById("jvCalCss")) return;
    var css = document.createElement("style");
    css.id = "jvCalCss";
    css.textContent =
      ".jv-cal-ov{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(8,6,4,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}" +
      ".jv-cal-ov.jv-open{display:flex;animation:jvCalFade .25s ease}" +
      "@keyframes jvCalFade{from{opacity:0}to{opacity:1}}" +
      ".jv-cal-panel{position:relative;width:100%;max-width:760px;max-height:88vh;display:flex;flex-direction:column;border-radius:22px;border:1px solid rgba(212,175,55,.45);background:linear-gradient(165deg,#241C15,#17110C);box-shadow:0 40px 90px -30px rgba(0,0,0,.85),0 0 60px -18px rgba(212,175,55,.35);overflow:hidden;animation:jvCalRise .3s cubic-bezier(.22,.61,.36,1)}" +
      "@keyframes jvCalRise{from{transform:translateY(22px);opacity:0}to{transform:translateY(0);opacity:1}}" +
      ".jv-cal-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 20px;border-bottom:1px solid rgba(212,175,55,.2)}" +
      ".jv-cal-head h3{margin:0;font:700 17px 'Playfair Display',Georgia,serif;color:#F7D774;letter-spacing:.01em}" +
      ".jv-cal-head p{margin:2px 0 0;font:600 10.5px/1.4 'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase;color:#8D8275}" +
      ".jv-cal-x{flex:0 0 auto;width:36px;height:36px;border-radius:50%;border:1px solid rgba(212,175,55,.35);background:rgba(212,175,55,.06);color:#F7D774;font-size:17px;line-height:1;cursor:pointer;transition:transform .2s,border-color .2s}" +
      ".jv-cal-x:hover{transform:rotate(90deg);border-color:#F7D774}" +
      ".jv-cal-body{padding:0;flex:1;min-height:340px;display:flex;flex-direction:column}" +
      ".jv-cal-body iframe{flex:1;width:100%;min-height:520px;border:0;background:#fff}" +
      ".jv-cal-fallback{padding:34px 26px 30px;text-align:center}" +
      ".jv-cal-fallback h4{margin:0;font:700 20px 'Playfair Display',Georgia,serif;color:#FAF6F0}" +
      ".jv-cal-fallback p{margin:12px auto 0;max-width:420px;color:#B9AC9E;font-size:14.5px;line-height:1.7}" +
      ".jv-cal-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:24px}" +
      ".jv-cal-btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:999px;font:700 14px 'DM Sans',system-ui,sans-serif;text-decoration:none;transition:transform .2s,filter .2s}" +
      ".jv-cal-btn:hover{transform:translateY(-2px)}" +
      ".jv-cal-gold{color:#17110C;background:linear-gradient(120deg,#F3E5AB,#D4AF37 55%,#F7D774);box-shadow:0 14px 40px -14px rgba(212,175,55,.6)}" +
      ".jv-cal-ghost{color:#F7D774;border:1px solid rgba(212,175,55,.45);background:rgba(212,175,55,.07)}" +
      ".jv-cal-note{margin-top:18px;font:500 11.5px/1.6 'JetBrains Mono',monospace;letter-spacing:.05em;color:#8D8275}" +
      "body.jv-cal-lock{overflow:hidden}" +
      "html:not(.dark) .jv-cal-panel{background:linear-gradient(165deg,#FFFAF0,#F6EEDD)}" +
      "html:not(.dark) .jv-cal-head{border-color:rgba(176,132,38,.3)}" +
      "html:not(.dark) .jv-cal-head h3{color:#7C5A12}" +
      "html:not(.dark) .jv-cal-fallback h4{color:#241C15}" +
      "html:not(.dark) .jv-cal-fallback p{color:#5C5244}" +
      "@media (max-width:720px){.jv-cal-panel{max-height:92vh}.jv-cal-body iframe{min-height:460px}}";
    document.head.appendChild(css);
  }

  function buildModal() {
    if (modalBuilt) return;
    modalBuilt = true;
    injectModalCss();
    overlay = document.createElement("div");
    overlay.className = "jv-cal-ov";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Book a free consultation");
    overlay.innerHTML =
      '<div class="jv-cal-panel">' +
        '<div class="jv-cal-head"><div><h3>Book a Free Consultation</h3><p>JSVita · 30 minutes · No obligation</p></div>' +
        '<button class="jv-cal-x" type="button" aria-label="Close booking dialog">\u2715</button></div>' +
        '<div class="jv-cal-body"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    overlay.querySelector(".jv-cal-x").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  function renderBody() {
    var body = overlay.querySelector(".jv-cal-body");
    if (CALENDLY_URL) {
      if (!body.querySelector("iframe")) {
        var f = document.createElement("iframe");
        f.src = CALENDLY_URL;
        f.title = "Calendly — book a free consultation with JSVita";
        f.setAttribute("loading", "lazy");
        body.appendChild(f);
      }
    } else if (!body.querySelector(".jv-cal-fallback")) {
      body.innerHTML =
        '<div class="jv-cal-fallback">' +
          '<h4>Choose the channel that suits you</h4>' +
          '<p>Calendar booking is being connected. Meanwhile you can reach the founder directly — every enquiry gets a reply within 24 hours.</p>' +
          '<div class="jv-cal-actions">' +
            '<a class="jv-cal-btn jv-cal-gold" data-jv-track="consultation_request" data-jv-info="modal-whatsapp" target="_blank" rel="noopener" href="https://wa.me/916361792699?text=' + encodeURIComponent("Hi JSVita — I'd like to book a free consultation.") + '">Chat on WhatsApp</a>' +
            '<a class="jv-cal-btn jv-cal-ghost" data-jv-track="consultation_request" data-jv-info="modal-contact" href="/#contact">Send a message</a>' +
          '</div>' +
          '<p class="jv-cal-note">Free discovery call \u00b7 Project roadmap \u00b7 Transparent proposal</p>' +
        '</div>';
    }
  }

  function open() {
    buildModal();
    renderBody();
    overlay.classList.add("jv-open");
    document.body.classList.add("jv-cal-lock");
    jvTrack("calendly_open", { calendly_configured: !!CALENDLY_URL });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("jv-open");
    document.body.classList.remove("jv-cal-lock");
  }

  /* ---- 5 · lead capture — posts every form[data-jv-lead-form] to LEAD_EMAIL ----
     Delivery: window.JSVITA_LEAD_ENDPOINT if set, else FormSubmit AJAX
     (first ever submission emails LEAD_EMAIL a one-time activation link —
     confirm it once and every lead after that lands in the inbox).
     Success → data-jv-lead-redirect (premium Thank You page) or inline state.
     Failure → inline recovery copy with the direct support email. */
  function initLeadForm() {
    var forms = document.querySelectorAll("form[data-jv-lead-form]");
    if (!forms.length) return;
    Array.prototype.forEach.call(forms, function (form) {
      if (form.__jvLead) return;
      form.__jvLead = true;
      var FORM_EMAIL = form.getAttribute("data-jv-lead-email") || LEAD_EMAIL;
      var ENDPOINT = window.JSVITA_LEAD_ENDPOINT || ("https://formsubmit.co/ajax/" + FORM_EMAIL);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector("[type=submit]");
        var btnTxt = btn ? btn.innerHTML : "";
        var data = {};
        try {
          new FormData(form).forEach(function (v, k) { if (k.charAt(0) !== "_") data[k] = v; });
        } catch (er) {}
        var hp = form.querySelector('input[name="_honey"]');
        if (hp && hp.value) return; /* bot — silently drop */
        data._subject = form.getAttribute("data-jv-lead-subject") || ("New lead — " + (data.Name || data.name || "jsvita.in"));
        data._template = "table";
        data._captcha = "false";
        /* admin.jsvita.in lead record — canonical CRM schema:
           Name · Phone · Email · Company · Service Interested · Source · Status · Created Date · Notes
           (+ Timestamp, Source Page, Budget, Details, Project Timeline, Preferred Contact Method) */
        var formId = form.getAttribute("data-jv-lead-form") || "lead";
        data["Submission Date"] = new Date().toISOString();
        data["Created Date"] = new Date().toISOString();
        data["Lead Status"] = "New Lead";
        data["Source"] = formId;
        data["Timestamp"] = new Date().toISOString();
        data["Source Page"] = location.href;
        data["Service Interested"] = data["Service"] || data["service"] || "";
        data["Company"] = data["Business Name"] || data["business"] || data["Company"] || "";
        data["Phone"] = data["Phone"] || data["phone"] || "";
        data["Notes"] = ""; /* filled by JSVita during follow-up */
        /* Phase 2 ops — optional direct CRM hook: set window.JSVITA_CRM_ENDPOINT (e.g. a
           Firebase Function / Apps Script webhook) and every lead is mirrored there in the
           same schema. Fire-and-forget: never blocks or breaks the email delivery path. */
        if (window.JSVITA_CRM_ENDPOINT) {
          try {
            fetch(window.JSVITA_CRM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(function () {});
          } catch (cr) {}
        }
        function lock(txt) { if (btn) { btn.disabled = true; if (txt) btn.innerHTML = txt; } }
        function unlock() { if (btn) { btn.disabled = false; btn.innerHTML = btnTxt; } }
        function finishOk() {
          var redirect = form.getAttribute("data-jv-lead-redirect");
          if (redirect) { window.location.assign(redirect); return; }
          lock("Request received \u2713");
        }
        function finishFail() {
          unlock();
          var note = form.querySelector(".jv-lead-error");
          if (!note) {
            note = document.createElement("p");
            note.className = "jv-lead-error";
            note.setAttribute("role", "alert");
            form.appendChild(note);
          }
          note.innerHTML = 'Delivery hiccup \u2014 please email <a href="mailto:' + FORM_EMAIL + '">' + FORM_EMAIL + '</a> directly and we\u2019ll reply within 24 hours.';
        }
        lock("Sending\u2026");
        jvTrack("lead_form_submit", { form: formId });
        var ctrl = ("AbortController" in window) ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 12000) : null;
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
          signal: ctrl ? ctrl.signal : undefined
        }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
          .then(function () { if (timer) clearTimeout(timer); jvTrack("lead_delivered", { form: formId }); finishOk(); })
          .catch(function (err) { if (timer) clearTimeout(timer); jvTrack("lead_delivery_failed", { form: formId, error: String((err && err.message) || err) }); finishFail(); });
      });
    });
  }

  /* ---- delegation: [data-jv-calendly] opens · [data-jv-track] tracked · mailto counted ---- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var mail = t.closest('a[href^="mailto:"]');
    if (mail) jvTrack("email_click", { to: (mail.getAttribute("href") || "").replace(/^mailto:/, "").split("?")[0] });
    var cal = t.closest("[data-jv-calendly]");
    if (cal) {
      e.preventDefault();
      if (cal.getAttribute("data-jv-track")) jvTrack(cal.getAttribute("data-jv-track"), { info: cal.getAttribute("data-jv-info") || "" });
      open();
      return;
    }
    var trk = t.closest("[data-jv-track]");
    if (trk) jvTrack(trk.getAttribute("data-jv-track"), { info: trk.getAttribute("data-jv-info") || "" });
  }, true);

  /* ---- Phase 2 · floating conversion CTAs on every page — WhatsApp + Get Free Consultation.
     The homepage hero script injects its own .jv-wa-fab; this adds one only when absent
     (generated pages), plus a desktop "Get Free Consultation" pill wired to the Calendly modal. */
  function initFloatingCtas() {
    if (!document.body) return;
    if (/(^|\/)(admin|dashboard|login)\.html$/.test(location.pathname)) return; /* internal tools */
    if (!document.querySelector(".jv-wa-fab")) {
      var wa = document.createElement("a");
      wa.className = "jv-wa-fab jv-wa-common";
      wa.href = "https://wa.me/916361792699?text=" + encodeURIComponent("Hi JSVita \u2014 I\u2019d like to start a project.");
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.setAttribute("aria-label", "Chat with JSVita on WhatsApp");
      wa.setAttribute("data-jv-track", "whatsapp_click");
      wa.setAttribute("data-jv-info", "common-fab");
      wa.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';
      document.body.appendChild(wa);
    }
    if (!document.querySelector(".jv-consult-fab")) {
      var c = document.createElement("a");
      c.className = "jv-consult-fab";
      c.href = "#";
      c.setAttribute("data-jv-calendly", "");
      c.setAttribute("data-jv-track", "consultation_request");
      c.setAttribute("data-jv-info", "common-fab");
      c.textContent = "Get Free Consultation";
      document.body.appendChild(c);
    }
    if (!document.getElementById("jvCommonFabCss")) {
      var st = document.createElement("style");
      st.id = "jvCommonFabCss";
      st.textContent = '.jv-wa-common{position:fixed;right:22px;bottom:22px;z-index:90;display:grid;place-items:center;width:58px;height:58px;border-radius:50%;text-decoration:none;background:linear-gradient(145deg,#128C4B,#0E6B39);border:1px solid rgba(212,175,55,.55);box-shadow:0 16px 40px -12px rgba(0,0,0,.7),0 0 30px -8px rgba(37,211,102,.45)}.jv-wa-common svg{width:28px;height:28px}.jv-consult-fab{position:fixed;left:22px;bottom:22px;z-index:90;display:inline-flex;align-items:center;padding:12px 20px;border-radius:999px;background:linear-gradient(120deg,#F3E5AB,#D4AF37);color:#17110C;font:700 13px "DM Sans",system-ui,sans-serif;text-decoration:none;box-shadow:0 14px 34px -14px rgba(212,175,55,.55);transition:transform .2s}.jv-consult-fab:hover{transform:translateY(-2px)}@media(max-width:767px){.jv-consult-fab{display:none}.jv-wa-common{right:14px;bottom:14px;width:54px;height:54px}.jv-wa-common svg{width:26px;height:26px}}@media(prefers-reduced-motion:reduce){.jv-consult-fab{transition:none}}';
      document.head.appendChild(st);
    }
  }

  window.jsvCommon = { track: jvTrack, openCalendly: open, closeCalendly: close, wireLeadForms: initLeadForm };

  /* boot — analytics layers + lead forms */
  function boot() {
    initGA4();
    initGTM();
    initClarity();
    initLeadForm();
    initFloatingCtas();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
