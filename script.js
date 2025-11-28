/* ==========================================================================
   script.js — Full enhanced script (EmailJS, scroll-reveal, slash system, UI)
   Copy/paste this entire file to replace your existing script.js
   ========================================================================== */

/* ------------------------
   Utilities
   ------------------------ */
function debounce(fn, wait = 80) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* ------------------------
   Wait for EmailJS SDK (defensive)
   ------------------------ */
function waitForEmailJSSDK(timeout = 8000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      if (window.emailjs && (typeof window.emailjs.sendForm === 'function' || typeof window.emailjs.send === 'function')) {
        return resolve(window.emailjs);
      }
      if (Date.now() - start > timeout) {
        return reject(new Error('EmailJS SDK not found within timeout.'));
      }
      setTimeout(check, 60);
    })();
  });
}

/* Initialize EmailJS when available (public key safe to use in front-end) */
(async function initEmailJS() {
  try {
    await waitForEmailJSSDK(9000);
    // Public key (frontend)
    emailjs.init('D1kAEOFgpeA7mLjQe');
    console.info('[EmailJS] initialized');
  } catch (e) {
    console.warn('[EmailJS] init warning:', e && e.message ? e.message : e);
  }
})();

/* ------------------------
   Page utilities
   ------------------------ */
/* set year */
window.addEventListener('load', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}, { passive: true });

/* ------------------------
   IntersectionObservers: reveal & nav
   ------------------------ */
/* Reveal observer */
const revealObserver = new IntersectionObserver((entries, obs) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  }
}, { root: null, rootMargin: '0px', threshold: 0.12 });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.scroll-reveal-item').forEach(el => revealObserver.observe(el));

/* Active section nav highlighting */
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`nav a[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  }
}, { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 });

document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

/* ------------------------
   Mobile nav toggle
   ------------------------ */
const mobileToggle = document.getElementById('mobileNavToggle');
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    const isVisible = getComputedStyle(nav).display === 'flex';
    nav.style.display = isVisible ? 'none' : 'flex';
  }, { passive: true });
}

/* ------------------------
   Back to top button (rAF-friendly)
   ------------------------ */
const backBtn = document.createElement('button');
backBtn.className = 'back-to-top';
backBtn.setAttribute('aria-label', 'Back to top');
backBtn.innerHTML = '&#8679;';
document.body.appendChild(backBtn);

let lastScrollY = 0;
const onScroll = () => {
  lastScrollY = window.scrollY;
  window.requestAnimationFrame(() => {
    if (lastScrollY > 320) backBtn.classList.add('show'); else backBtn.classList.remove('show');
  });
};
window.addEventListener('scroll', debounce(onScroll, 60), { passive: true });

backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }), { passive: true });

/* ------------------------
   Contact form — robust EmailJS usage (sendForm + fallback send)
   ------------------------ */

/* Helper: form data to object */
function formDataToObject(formEl) {
  const fd = new FormData(formEl);
  const obj = {};
  for (const [k, v] of fd.entries()) obj[k] = v;
  return obj;
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const contactForm = document.getElementById('contactForm');
const confirmation = document.getElementById('formConfirmation');

if (contactForm) {
  contactForm.addEventListener('submit', async function (ev) {
    ev.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');
    const originalBtnText = submitBtn ? (submitBtn.textContent || 'Send Message') : 'Send';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    const name = (document.getElementById('contactName') || {}).value?.trim();
    const email = (document.getElementById('contactEmail') || {}).value?.trim();
    const message = (document.getElementById('contactMessage') || {}).value?.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      return;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      return;
    }

    // Primary attempt — sendForm (uses name attributes)
    try {
      if (!window.emailjs || typeof window.emailjs.sendForm !== 'function') {
        throw new Error('EmailJS sendForm not available yet.');
      }
      const res = await emailjs.sendForm('service_c82e22l', 'template_iga2c4v', this);
      console.info('[EmailJS] sendForm success', res);
      if (confirmation) {
        confirmation.classList.add('show');
        setTimeout(() => confirmation.classList.remove('show'), 4200);
      } else {
        alert('Message sent — we will be in touch!');
      }
      contactForm.reset();
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      return;
    } catch (err) {
      console.error('[EmailJS] sendForm failed:', err);
      // Attempt fallback send using emailjs.send with explicit params
      try {
        if (!window.emailjs || typeof window.emailjs.send !== 'function') {
          throw new Error('EmailJS send fallback not available.');
        }
        const payload = formDataToObject(this);
        const params = {
          from_name: payload.from_name || payload.name || name,
          reply_to: payload.reply_to || payload.email || email,
          message: payload.message || message
        };
        const fallback = await emailjs.send('service_c82e22l', 'template_iga2c4v', params);
        console.info('[EmailJS] fallback send success', fallback);
        if (confirmation) {
          confirmation.classList.add('show');
          setTimeout(() => confirmation.classList.remove('show'), 4200);
        } else {
          alert('Message sent — we will be in touch!');
        }
        contactForm.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
        return;
      } catch (fallbackErr) {
        console.error('[EmailJS] fallback send failed:', fallbackErr);
        alert('Failed to send message. Please try again later. (Check console for details)');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }

        console.warn('DEV HINTS:');
        console.warn('- Confirm EmailJS public key and that emailjs.init ran successfully.');
        console.warn('- Confirm Service ID `service_c82e22l` exists and Template ID `template_iga2c4v` exists.');
        console.warn('- Confirm template variables match: e.g. {{from_name}}, {{reply_to}}, {{message}} (or adjust form names).');
        console.warn('- Check Network tab for failed requests and CORS/4xx/5xx errors.');
        return;
      }
    }
  }, { passive: false });
}

/* ------------------------
   Option 4 — Slash System (combined white streak + ink stroke)
   - lightweight and GPU-accelerated
   - triggers on scroll, hover, and occasional ambient spawns
   ------------------------ */

const slashContainer = (function () {
  let el = document.getElementById('slash-container');
  if (!el) {
    el = document.createElement('div');
    el.id = 'slash-container';
    document.body.prepend(el);
  }
  return el;
})();

function spawnSlash(x, y, opts = {}) {
  // opts: angle, whiteDelay, inkDelay, scale
  const angle = typeof opts.angle === 'number' ? opts.angle : -12;
  const whiteDelay = typeof opts.whiteDelay === 'number' ? opts.whiteDelay : 0;
  const inkDelay = typeof opts.inkDelay === 'number' ? opts.inkDelay : 30;
  const scale = typeof opts.scale === 'number' ? opts.scale : 1;

  const wrap = document.createElement('div');
  wrap.className = 'slash-wrap';
  wrap.style.left = `${x}px`;
  wrap.style.top = `${y}px`;
  wrap.style.position = 'absolute';
  wrap.style.pointerEvents = 'none';
  wrap.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scale(${scale})`;
  wrap.style.zIndex = 9999;

  const ink = document.createElement('div');
  ink.className = 'slash-ink';
  ink.style.opacity = '0';
  ink.style.transform = 'scaleX(0.02)';

  const white = document.createElement('div');
  white.className = 'slash-white';
  white.style.opacity = '0';
  white.style.transform = 'scaleX(0.02)';

  const impact = document.createElement('div');
  impact.className = 'slash-impact';
  impact.style.left = '46%';
  impact.style.top = '36%';
  impact.style.position = 'absolute';
  impact.style.opacity = '0';

  wrap.appendChild(ink);
  wrap.appendChild(white);
  wrap.appendChild(impact);
  slashContainer.appendChild(wrap);

  // Stagger the starting to create layered effect
  setTimeout(() => {
    white.style.opacity = '1';
    white.style.transform = 'scaleX(1.25)';
  }, whiteDelay);

  setTimeout(() => {
    ink.style.opacity = '1';
    ink.style.transform = 'scaleX(0.95)';
  }, inkDelay);

  // show impact shortly after
  setTimeout(() => {
    impact.style.opacity = '1';
    // let css animation (impact pop) handle removal
  }, Math.max(whiteDelay, inkDelay) + 40);

  // Cleanup after animations finish (safe margin)
  setTimeout(() => {
    if (wrap && wrap.parentElement) wrap.remove();
  }, 1000 + Math.max(whiteDelay, inkDelay));
}

/* Scroll-triggered slashes (throttled) */
let lastSlash = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - lastSlash < 300) return;
  lastSlash = now;
  const x = 60 + Math.random() * (window.innerWidth - 120);
  const y = (window.scrollY % window.innerHeight) + 60 + Math.random() * 80;
  spawnSlash(x, y, { angle: -12 + (Math.random() * -6), whiteDelay: 0, inkDelay: 40 });
}, { passive: true });

/* button hover slashes */
document.querySelectorAll('button, .btn').forEach(btn => {
  btn.addEventListener('mouseenter', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width * 0.6;
    const y = rect.top + rect.height * 0.45 + window.scrollY;
    spawnSlash(x, y, { angle: -12, whiteDelay: 0, inkDelay: 30, scale: 0.9 });
  }, { passive: true });
});

/* Ambient cinematic slashes (rare) */
const ambientInterval = 4200;
let ambientTimer = setInterval(() => {
  const x = 80 + Math.random() * (window.innerWidth - 160);
  const y = 80 + Math.random() * (window.innerHeight - 160) + window.scrollY;
  spawnSlash(x, y, { angle: -12 + (Math.random() * -6), whiteDelay: 0, inkDelay: 40, scale: 1 + Math.random() * 0.2 });
}, ambientInterval);

/* Optionally reduce on small screens */
function adaptSlashForMobile() {
  if (window.innerWidth < 540) {
    clearInterval(ambientTimer);
    ambientTimer = setInterval(() => {
      // less frequent ambient
    }, 12000);
  }
}
window.addEventListener('resize', debounce(adaptSlashForMobile, 200), { passive: true });
adaptSlashForMobile();

/* ------------------------
   Decorative blob micro-animation (low cost)
   ------------------------ */
(function animateBlobs() {
  const b1 = document.querySelector('.blob-1');
  const b2 = document.querySelector('.blob-2');
  if (!b1 || !b2) return;
  let t = 0;
  function frame() {
    t += 0.0016;
    const s1 = 1 + Math.sin(t * 2.1) * 0.03;
    const r1 = Math.sin(t) * 6;
    const s2 = 1 + Math.cos(t * 1.7) * 0.035;
    const r2 = Math.cos(t * 1.3) * -6;
    b1.style.transform = `translate3d(-6%, ${Math.sin(t) * 2}%, 0) rotate(${r1}deg) scale(${s1})`;
    b2.style.transform = `translate3d(6%, ${Math.cos(t) * 2}%, 0) rotate(${r2}deg) scale(${s2})`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ------------------------
   End of script.js
   ------------------------ */
