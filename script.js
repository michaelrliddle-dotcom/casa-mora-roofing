/* =============================================
   CASA MORA ROOFING — SHARED SCRIPT
   Mobile nav · services dropdown · scroll reveal
   (Header is always solid — no scroll toggle.
    Desktop Services dropdown opens on hover via CSS.)
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
  // also collapse any open mobile submenu
  document.querySelectorAll('.mobile-nav__group.open').forEach(g => {
    g.classList.remove('open');
    const t = g.querySelector('.mobile-nav__toggle');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
}

/* =============================================
   MOBILE SERVICES SUBMENU (tap to open/close)
============================================= */
document.querySelectorAll('.mobile-nav__toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('.mobile-nav__group');
    const open = group.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
});

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
