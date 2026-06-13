/* =============================================
   CASA MORA ROOFING — SHARED SCRIPT
   Mobile nav · scroll reveal · before/after slider · form
   (Header is always solid black — no scroll toggle.)
============================================= */

/* =============================================
   MOBILE NAV
============================================= */
const ham = document.getElementById('ham');
const mob = document.getElementById('mob');

if (ham && mob) {
  ham.addEventListener('click', () => {
    const isOpen = mob.classList.toggle('open');
    ham.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!ham.contains(e.target) && !mob.contains(e.target)) closeNav();
  });
}

function closeNav() {
  if (!mob || !ham) return;
  mob.classList.remove('open');
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
}

/* =============================================
   SCROLL REVEAL
============================================= */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.classList.add('in');
      revealObs.unobserve(target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* =============================================
   BEFORE / AFTER SLIDERS
   Works for both real images and blank placeholders.
============================================= */
function initSlider(sliderId) {
  const slider   = document.getElementById(sliderId);
  if (!slider) return;
  const clip     = document.getElementById(sliderId + '-clip');
  const afterEl  = document.getElementById(sliderId + '-after');
  const divider  = document.getElementById(sliderId + '-div');
  let dragging   = false;

  function getPercent(clientX) {
    const rect = slider.getBoundingClientRect();
    return Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 3), 97);
  }

  function apply(pct) {
    clip.style.width   = pct + '%';
    divider.style.left = pct + '%';
    // keep the overlay element filling the full slider width so it doesn't squash
    if (afterEl) afterEl.style.width = slider.offsetWidth + 'px';
  }

  // Start at 50%
  apply(50);

  // Mouse
  slider.addEventListener('mousedown', (e) => {
    dragging = true;
    apply(getPercent(e.clientX));
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (dragging) apply(getPercent(e.clientX));
  });
  document.addEventListener('mouseup', () => { dragging = false; });

  // Touch
  slider.addEventListener('touchstart', (e) => {
    dragging = true;
    apply(getPercent(e.touches[0].clientX));
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (dragging) apply(getPercent(e.touches[0].clientX));
  }, { passive: true });
  document.addEventListener('touchend', () => { dragging = false; });

  // Re-sync overlay width on resize
  window.addEventListener('resize', () => {
    const cur = parseFloat(clip.style.width) || 50;
    apply(cur);
  }, { passive: true });
}

['ba1', 'ba2', 'ba3', 'ba4'].forEach(initSlider);

/* =============================================
   FORM SUBMIT (display only)
============================================= */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  if (!btn) return;
  const origHTML = btn.innerHTML;
  btn.innerHTML = 'Request sent! We\'ll call you within 24 hours.';
  btn.style.background = '#2D6A4F';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = origHTML;
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}
