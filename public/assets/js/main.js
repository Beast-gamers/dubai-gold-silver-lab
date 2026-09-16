/* ==========================================================================
   SAIM GOLD — main.js
   Scroll reveal, sticky nav, counters, forms, carousel accessibility,
   back-to-top. Respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------
     1. Sticky nav shadow + active link highlight
  ---------------------------------------------------------------- */
  const nav = document.getElementById('siteNav');
  const backTop = document.getElementById('backTop');
  const sections = document.querySelectorAll('section[id], .purity-section');

  function onScroll() {
    if (!prefersReducedMotion) {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    if (window.scrollY > 600) backTop.classList.add('show');
    else backTop.classList.remove('show');

    // Highlight active nav link based on scroll position
    const scrollPos = window.scrollY + 120;
    let currentId = 'home';
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute('id') || 'home';
      }
    });
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
      const isActive = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('active', isActive);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------
     2. Scroll reveal
  ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // No IO or reduced motion: show everything immediately, no animation.
    revealEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ----------------------------------------------------------------
     3. Animated counters
  ---------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo for a luxurious deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = Math.round(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const counterIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterIo.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString();
    });
  }

  /* ----------------------------------------------------------------
     4. Consultation form
  ---------------------------------------------------------------- */
  const form = document.getElementById('consultationForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const valid = form.checkValidity();
      form.classList.add('was-validated');

      if (valid) {
        const name = form.querySelector('#name').value.trim().split(' ')[0];
        const interest = form.querySelector('#interest').value;
        formNote.textContent =
          'Thank you, ' + name + '! Our team will call you within 2 hours to confirm your ' + interest + ' consultation.';
        form.reset();
        form.classList.remove('was-validated');
      }
    });
  }

  /* ----------------------------------------------------------------
     5. Newsletter form
  ---------------------------------------------------------------- */
  const nlForm = document.getElementById('newsletterForm');
  const nlNote = document.getElementById('newsletterNote');

  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = nlForm.querySelector('#nlEmail');
      if (email.checkValidity()) {
        nlNote.textContent = 'Welcome to the circle! Previews and exclusive invites are on their way to ' + email.value + '.';
        nlForm.reset();
      } else {
        email.classList.add('is-invalid');
        nlNote.textContent = 'Please enter a valid email address.';
      }
    });
  }

  /* ----------------------------------------------------------------
     6. Testimonial carousel — pause on hover/focus per a11y best practice
  ---------------------------------------------------------------- */
  const tCarouselEl = document.getElementById('testimonialCarousel');
  if (tCarouselEl && typeof bootstrap !== 'undefined') {
    const tCarousel = bootstrap.Carousel.getOrCreateInstance(tCarouselEl, {
      interval: 6000,
      pause: 'hover'
    });

    ['mouseenter', 'focusin'].forEach(function (evt) {
      tCarouselEl.addEventListener(evt, function () { tCarousel.pause(); });
    });
    ['mouseleave', 'focusout'].forEach(function (evt) {
      tCarouselEl.addEventListener(evt, function () { tCarousel.cycle(); });
    });
  }

  /* ----------------------------------------------------------------
     7. Auto-set footer year
  ---------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();