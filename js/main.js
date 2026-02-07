// ============================================
// AMOUDI & ASSOCIATES CPAs - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll(
    '.section-header, .service-card, .why-item, .testimonial-card, ' +
    '.trust-item, .benefit-card, .process-step, .service-item, ' +
    '.industry-item, .faq-item, .service-card-large, .why-card-inline, ' +
    '.service-detail-card, .value-item, .trust-badge, .contact-form, ' +
    '.contact-info-card, .contact-map'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 80px 0px'
    });

    revealElements.forEach((el, i) => {
      // Cancel the CSS fallback animation since JS is active
      el.style.animation = 'none';
      el.classList.add('reveal');
      // Stagger siblings within the same parent
      const siblings = el.parentElement.querySelectorAll(':scope > .reveal');
      const index = Array.from(siblings).indexOf(el);
      if (index > 0 && index < 6) {
        el.classList.add('reveal-delay-' + index);
      }
      observer.observe(el);
    });

    // Safety fallback: reveal everything after 4 seconds
    setTimeout(() => {
      revealElements.forEach(el => {
        if (!el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });
    }, 4000);
  }

  // --- Animated Number Counters ---
  const counters = document.querySelectorAll('.why-number');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = match[2]; // e.g., '%', '+', 'hr'
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active');
      });
    }
  });

  // --- Form submission ---
  const contactForm = document.querySelector('.contact-form form, .landing-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#16a34a';
        this.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});

// --- Phone click tracking ---
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', function() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        'event_category': 'Contact',
        'event_label': 'Phone Call',
        'value': this.href
      });
    }
  });
});
