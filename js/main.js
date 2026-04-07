(function () {
  "use strict";

  var SITE_GATE_PASSWORD = "TKAC2026";
  var SITE_GATE_KEY = "tkac_site_unlocked";

  function initSiteGate() {
    var body = document.body;
    var gate = document.getElementById("site-gate");
    var gateForm = document.getElementById("site-gate-form");
    var gateInput = document.getElementById("site-gate-password");
    var gateError = document.getElementById("site-gate-error");
    if (!body || !gate || !gateForm || !gateInput) return;

    function unlock() {
      try {
        sessionStorage.setItem(SITE_GATE_KEY, "1");
      } catch (e) {}
      document.documentElement.classList.add("site-unlocked");
      gate.setAttribute("hidden", "");
      gateInput.value = "";
      if (gateError) {
        gateError.hidden = true;
      }
      var firstFocus = document.querySelector(".skip-link");
      if (firstFocus && typeof firstFocus.focus === "function") {
        firstFocus.focus();
      }
    }

    if (document.documentElement.classList.contains("site-unlocked")) {
      gate.setAttribute("hidden", "");
      return;
    }

    gateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (gateError) gateError.hidden = true;
      if (gateInput.value === SITE_GATE_PASSWORD) {
        unlock();
      } else if (gateError) {
        gateError.hidden = false;
        gateInput.select();
      }
    });
  }

  initSiteGate();

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contact-form");
  var formSuccess = document.getElementById("form-success");
  var formReset = document.getElementById("form-reset");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setNavOpen(open) {
    if (!header || !navToggle) return;
    header.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = !header.classList.contains("nav-open");
      setNavOpen(open);
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
  }

  window.addEventListener("scroll", function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }, { passive: true });

  if (form && formSuccess) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.focus({ preventScroll: true });
    });
  }

  if (formReset && form && formSuccess) {
    formReset.addEventListener("click", function () {
      form.reset();
      formSuccess.hidden = true;
      form.hidden = false;
    });
  }

  /* Certificate lightbox */
  var certModal = document.getElementById("cert-modal");
  if (certModal) {
    var certBackdrop = certModal.querySelector(".cert-modal-backdrop");
    var certClose = certModal.querySelector(".cert-modal-close");
    var certTitle = document.getElementById("cert-modal-title");
    var certImg = document.getElementById("cert-modal-img");
    var certImageWrap = document.getElementById("cert-modal-image-wrap");
    var certZoomToggle = document.getElementById("cert-zoom-toggle");
    var certTriggers = document.querySelectorAll(".js-cert-trigger");
    var certLastFocus = null;
    var certPrevOverflow = "";

    function setCertFitMode() {
      if (!certImageWrap || !certZoomToggle) return;
      certImageWrap.classList.remove("is-zoomed");
      certZoomToggle.setAttribute("aria-pressed", "false");
      certZoomToggle.setAttribute("aria-label", "Zoom in");
      certZoomToggle.setAttribute("title", "Zoom in");
    }

    function setCertZoomMode() {
      if (!certImageWrap || !certZoomToggle) return;
      certImageWrap.classList.add("is-zoomed");
      certImageWrap.scrollTop = 0;
      certImageWrap.scrollLeft = 0;
      certZoomToggle.setAttribute("aria-pressed", "true");
      certZoomToggle.setAttribute("aria-label", "Fit to window");
      certZoomToggle.setAttribute("title", "Fit to window");
    }

    function toggleCertZoom() {
      if (!certImageWrap || !certZoomToggle || certZoomToggle.disabled) return;
      if (certImageWrap.classList.contains("is-zoomed")) {
        setCertFitMode();
      } else {
        setCertZoomMode();
      }
    }

    function enableCertZoomWhenReady() {
      if (!certZoomToggle || !certImg) return;
      function enable() {
        certZoomToggle.disabled = false;
      }
      if (certImg.complete && certImg.naturalWidth > 0) {
        enable();
        return;
      }
      certImg.addEventListener("load", enable, { once: true });
      certImg.addEventListener("error", enable, { once: true });
    }

    function openCertModal(src, alt, title) {
      if (!src || !certImg || !certTitle) return;
      certLastFocus = document.activeElement;
      setCertFitMode();
      if (certZoomToggle) {
        certZoomToggle.disabled = true;
      }
      certImg.src = src;
      certImg.alt = alt || "";
      certTitle.textContent = title || "";
      certModal.hidden = false;
      certPrevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      enableCertZoomWhenReady();
      if (certClose) {
        certClose.focus();
      }
    }

    function closeCertModal() {
      setCertFitMode();
      if (certZoomToggle) {
        certZoomToggle.disabled = true;
      }
      certModal.hidden = true;
      certImg.removeAttribute("src");
      certImg.alt = "";
      certTitle.textContent = "";
      document.body.style.overflow = certPrevOverflow;
      if (certLastFocus && typeof certLastFocus.focus === "function") {
        certLastFocus.focus();
      }
    }

    certTriggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var src = btn.getAttribute("data-cert-src");
        var alt = btn.getAttribute("data-cert-alt") || "";
        var title = btn.getAttribute("data-cert-title") || "";
        openCertModal(src, alt, title);
      });
    });

    if (certClose) {
      certClose.addEventListener("click", closeCertModal);
    }
    if (certBackdrop) {
      certBackdrop.addEventListener("click", closeCertModal);
    }
    if (certZoomToggle) {
      certZoomToggle.addEventListener("click", toggleCertZoom);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || certModal.hidden) return;
      if (certImageWrap && certImageWrap.classList.contains("is-zoomed")) {
        setCertFitMode();
        e.preventDefault();
        return;
      }
      closeCertModal();
    });
  }
})();
