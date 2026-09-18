/* ============================================================
   Dubai Silver Test Lab — Global Interactions
   ============================================================ */

(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.remove("js-hidden");

  /* ---------- Navbar shrink on scroll ---------- */
  var navbar = document.querySelector(".navbar-dg");
  if (navbar) {
    var onScroll = function () {
      if (window.scrollY > 24) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-reverse");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      if (!el.classList.contains("revealed")) io.observe(el);
    });
  } else if (prefersReduced) {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  /* ---------- Animated counters ---------- */
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count") || "0");
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    var step = function (ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    window.requestAnimationFrame(step);
  };

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent =
        parseFloat(el.getAttribute("data-count") || "0").toLocaleString() +
        (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- Contact form (demo submission) ---------- */
  var form = document.getElementById("contactForm");
  var successBox = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Submitting…";

      // Simulate network request — replace with your endpoint.
      window.setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = original;
        form.classList.remove("was-validated");
        form.reset();
        if (successBox) {
          successBox.classList.remove("d-none");
          successBox.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
          window.setTimeout(function () {
            successBox.classList.add("d-none");
          }, 6000);
        }
      }, 1100);
    });
  }

  /* ---------- Back to top ---------- */
  var topBtn = document.getElementById("backToTop");
  if (topBtn) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 500) {
          topBtn.classList.add("show");
        } else {
          topBtn.classList.remove("show");
        }
      },
      { passive: true }
    );
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();