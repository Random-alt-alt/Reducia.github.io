/* ====================
   Enhanced script.js with Option 4 slash system
   ==================== */

/* Small debounce util */
function debounce(fn, wait = 80) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* Init EmailJS on load and update year */
window.addEventListener('load', () => {
  if (window.emailjs) {
    try { emailjs.init('D1kAEOFgpeA7mLjQe'); } catch (e) { console.warn('EmailJS init failed', e); }
  }
  const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* Intersection Observer for reveal */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, { root: null, rootMargin: '0px', threshold: 0.12 });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.scroll-reveal-item').forEach(el => revealObserver.observe(el));

/* Active nav */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`nav a[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

/* Mobile nav toggle */
const mobileToggle = document.getElementById('mobileNavToggle');
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    const nav = document.querySelector('nav ul');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  }, { passive: true });
}

/* Back to top */
const backBtn = document.createElement('button');
backBtn.className = 'back-to-top';
backBtn.innerHTML = '&#8679;';
document.body.appendChild(backBtn);

const onScroll = debounce(() => {
  if (window.scrollY > 320) backBtn.classList.add('show'); else backBtn.classList.remove('show');
}, 60);

window.addEventListener('scroll', onScroll, { passive: true });

backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, { passive: true });

/* Contact form + EmailJS (sendForm) */
const contactForm = document.getElementById('contactForm');
const confirmation = document.getElementById('formConfirmation');

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

if (contactForm) {
  contactForm.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const msg = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !msg) { alert('Please fill in all fields.'); return; }
    if (!validateEmail(email)) { alert('Please enter a valid email address.'); return; }

    const submitBtn = contactForm.querySelector('button');
    const textEl = submitBtn.querySelector('.btn-text') || submitBtn;
    const icoEl = submitBtn.querySelector('.btn-ico');

    submitBtn.classList.add('sending');
    if (textEl) textEl.textContent = 'Sending...';
    if (icoEl) icoEl.style.transform = 'translateX(8px) rotate(12deg)';

    try {
      await emailjs.sendForm('service_c82e22l', 'template_iga2c4v', this);
      confirmation.classList.add('show');
      setTimeout(() => confirmation.classList.remove('show'), 4200);
      contactForm.reset();
    } catch (err) {
      console.error('EmailJS error', err);
      alert('There was an error sending your message. Please try again later.');
    } finally {
      submitBtn.classList.remove('sending');
      if (textEl) textEl.textContent = 'Send Message';
      if (icoEl) icoEl.style.transform = '';
    }
  }, { passive: false });
}

/* =====================
   Option 4 Slash System (combined white streak + ink stroke)
   Lightweight, GPU accelerated
   ===================== */

const slashContainer = document.getElementById('slash-container');

function spawnSlash(x, y, angle = -14, scale = 1, delay = 0) {
  if (!slashContainer) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'slash-wrap';
  wrapper.style.left = `${x}px`;
  wrapper.style.top = `${y}px`;
  wrapper.style.pointerEvents = 'none';
  wrapper.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;

  // white streak (fast)
  const white = document.createElement('div');
  white.className = 'slash-white';
  white.style.transform = `scaleX(${0.02})`;
  white.style.opacity = '0';

  // ink stroke (slower, layered)
  const ink = document.createElement('div');
  ink.className = 'slash-ink';
  ink.style.transform = `scaleX(${0.02})`;
  ink.style.opacity = '0.0';

  // impact dot
  const impact = document.createElement('div');
  impact.className = 'slash-impact';
  impact.style.left = '46%';
  impact.style.top = '36%';

  wrapper.appendChild(ink);
  wrapper.appendChild(white);
  wrapper.appendChild(impact);

  slashContainer.appendChild(wrapper);

  // staggered start for layered effect
  setTimeout(() => {
    white.style.opacity = '1';
    ink.style.opacity = '1';
    // remove after animations
    setTimeout(() => wrapper.remove(), 900);
  }, delay);
}

/* Trigger on scroll (throttled) */
let last = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - last < 300) return;
  last = now;
  const x = 40 + Math.random() * (window.innerWidth - 80);
  const y = (window.scrollY % window.innerHeight) + 60 + Math.random() * 80;
  spawnSlash(x, y, -12 + (Math.random() * -6), 1, Math.random() * 80);
}, { passive: true });

/* Trigger when hovering buttons */
document.querySelectorAll('button, .btn').forEach(btn => {
  btn.addEventListener('mouseenter', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width * 0.6;
    const y = rect.top + rect.height * 0.45;
    spawnSlash(x, y, -12, 1, 0);
  }, { passive: true });
});

/* Ambient slashes for cinematic effect (rare) */
setInterval(() => {
  const x = 80 + Math.random() * (window.innerWidth - 160);
  const y = 80 + Math.random() * (window.innerHeight - 160);
  spawnSlash(x, y, -12 + (Math.random() * -6), 1, Math.random() * 200);
}, 4200);

/* Tiny SVG blob life (low cost) */
(function animateBlobs(){
  const b1 = document.querySelector('.blob-1');
  const b2 = document.querySelector('.blob-2');
  if (!b1 || !b2) return;
  let t = 0;
  function frame(){
    t += 0.0016;
    const s1 = 1 + Math.sin(t * 2.1) * 0.03;
    const r1 = Math.sin(t) * 6;
    const s2 = 1 + Math.cos(t * 1.7) * 0.035;
    const r2 = Math.cos(t * 1.3) * -6;
    b1.style.transform = `translate3d(-6%, ${Math.sin(t)*2}%, 0) rotate(${r1}deg) scale(${s1})`;
    b2.style.transform = `translate3d(6%, ${Math.cos(t)*2}%, 0) rotate(${r2}deg) scale(${s2})`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

