// --- Smooth Scroll Behavior (CSS handles most of this, but good to have JS fallback/enhancement) ---
// Modern browsers use 'scroll-behavior: smooth' in CSS.
// This JS is primarily for other functionalities.

// --- Scroll Reveal Animations ---
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const scrollRevealItems = document.querySelectorAll('.scroll-reveal-item');

const observerOptions = {
  root: null, // viewport
  rootMargin: '0px',
  threshold: 0.1 // 10% of element visible to trigger
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Stop observing once visible
    }
  });
}, observerOptions);

scrollRevealElements.forEach(el => observer.observe(el));
scrollRevealItems.forEach(el => observer.observe(el));


// --- Active Navigation Link Highlighting ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

const navObserverOptions = {
  root: null,
  rootMargin: '-50% 0px -50% 0px', // Trigger when section is roughly in the middle of the viewport
  threshold: 0 // We just need to know if it intersects
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active class from all links
      navLinks.forEach(link => link.classList.remove('active'));

      // Add active class to the corresponding link
      const targetId = entry.target.id;
      const activeLink = document.querySelector(`nav ul li a[href="#${targetId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, navObserverOptions);

sections.forEach(section => {
  navObserver.observe(section);
});


// --- Client-Side Form Validation and EmailJS Submission ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (name === '' || email === '' || message === '') {
      alert('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // EmailJS specific submission
    try {
      // IMPORTANT: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
      const result = await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this);
      
      console.log('EmailJS Success:', result.status, result.text);
      alert('Thank you for your message! We will get back to you shortly.');
      contactForm.reset(); // Clear the form
    } catch (error) {
      console.error('EmailJS Failed:', error);
      alert('There was an error sending your message. Please try again later.');
    }
  });
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// --- Back to Top Button (Optional, but adds functionality) ---
const backToTopButton = document.createElement('button');
backToTopButton.textContent = '↑';
backToTopButton.classList.add('back-to-top');
document.body.appendChild(backToTopButton);

backToTopButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--primary-color);
  color: var(--text-light);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(100px);
  z-index: 999;
`;

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) { // Show button after scrolling 300px
    backToTopButton.style.opacity = '1';
    backToTopButton.style.transform = 'translateY(0)';
  } else {
    backToTopButton.style.opacity = '0';
    backToTopButton.style.transform = 'translateY(100px)';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});