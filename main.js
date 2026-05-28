/* =========================================================
   MERIDIAN ROOFING CO. — main.js
   ========================================================= */

// ─── Scroll Reveal ────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Nav Scroll State ─────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── Mobile Menu ──────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── Smooth Scroll for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('nav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Before / After Slider ────────────────────────────────
function initBeforeAfterSlider(imagesEl) {
  const beforeImg = imagesEl.querySelector('.ba-img--before');
  const handle    = imagesEl.querySelector('.ba-handle');
  let dragging    = false;
  let startX, startY;

  function apply(p) {
    p = Math.max(0.02, Math.min(0.98, p));
    beforeImg.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
    handle.style.left = `${p * 100}%`;
  }

  function posFromClient(clientX) {
    const rect = imagesEl.getBoundingClientRect();
    return (clientX - rect.left) / rect.width;
  }

  imagesEl.addEventListener('mousedown', (e) => {
    dragging = true;
    apply(posFromClient(e.clientX));
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (dragging) apply(posFromClient(e.clientX));
  });

  window.addEventListener('mouseup', () => { dragging = false; });

  imagesEl.addEventListener('touchstart', (e) => {
    startX   = e.touches[0].clientX;
    startY   = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  imagesEl.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const dx = Math.abs(e.touches[0].clientX - startX);
    const dy = Math.abs(e.touches[0].clientY - startY);
    if (dx > dy) {
      e.preventDefault();
      apply(posFromClient(e.touches[0].clientX));
    }
  }, { passive: false });

  window.addEventListener('touchend', () => { dragging = false; });

  apply(0.5);
}

document.querySelectorAll('.ba-images').forEach(initBeforeAfterSlider);

// ─── Before / After Tab Switching ────────────────────────
const baTabs    = document.querySelectorAll('.ba-tab');
const baSliders = document.querySelectorAll('.ba-slider');

baTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    baTabs.forEach(t => t.classList.remove('is-active'));
    baSliders.forEach(s => s.classList.remove('is-active'));
    tab.classList.add('is-active');
    document.querySelector(`.ba-slider[data-index="${target}"]`).classList.add('is-active');
  });
});

// ─── Stat Count-up ────────────────────────────────────────
(function () {
  function formatStatValue(val, suffix, isDecimal) {
    if (isDecimal) return val.toFixed(1) + suffix;
    const n = Math.round(val);
    return (n >= 1000 ? n.toLocaleString('en-US') : String(n)) + suffix;
  }

  function runCountUp(el, delay) {
    const target    = parseFloat(el.dataset.count);
    const suffix    = el.dataset.suffix || '';
    const isDecimal = String(el.dataset.count).includes('.');
    const duration  = 2000;

    setTimeout(() => {
      let startTime = null;

      function step(ts) {
        if (startTime === null) startTime = ts;
        const elapsed  = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        el.textContent = formatStatValue(target * eased, suffix, isDecimal);
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }, delay);
  }

  const staggerBase    = 400;
  const staggerOffsets = [0, 150, 300, 450];

  document.querySelectorAll('.hero__stat-num[data-count]').forEach((el, i) => {
    runCountUp(el, staggerBase + (staggerOffsets[i] ?? 0));
  });
}());

// ─── Contact Form ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = 'Request Sent';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    btn.style.opacity = '';
    contactForm.reset();
  }, 3000);
});
