// --- Scroll Reveal Animations ---
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const scrollRevealItems = document.querySelectorAll('.scroll-reveal-item');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
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
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(link => link.classList.remove('active'));
      const targetId = entry.target.id;
      const activeLink = document.querySelector(`nav ul li a[href="#${targetId}"]`);
      if(activeLink) activeLink.classList.add('active');
    }
  });
}, navObserverOptions);

sections.forEach(section => navObserver.observe(section));

// --- Back to Top Button ---
const backToTopButton = document.createElement('button');
backToTopButton.textContent = '↑';
backToTopButton.classList.add('back-to-top');
document.body.appendChild(backToTopButton);

backToTopButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--primary-color);
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
  if(window.scrollY > 300){
    backToTopButton.style.opacity = '1';
    backToTopButton.style.transform = 'translateY(0)';
  } else {
    backToTopButton.style.opacity = '0';
    backToTopButton.style.transform = 'translateY(100px)';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top:0, behavior:'smooth' });
});

// --- EmailJS Contact Form ---
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function validateEmail(email){
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

if(contactForm){
  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if(!name || !email || !message){
      alert('Please fill in all fields.');
      return;
    }

    if(!validateEmail(email)){
      alert('Please enter a valid email.');
      return;
    }

    // Show sending status
    formStatus.textContent = 'Sending...';
    formStatus.style.color = 'var(--primary-color)';

    try {
      await emailjs.sendForm('service_c82e22l','template_iga2c4v', this,'D1kAEOFgpeA7mLjQe');
      formStatus.textContent = 'Message sent successfully!';
      formStatus.style.color = 'green';
      contactForm.reset();
    } catch(error){
      console.error('EmailJS Error:', error);
      formStatus.textContent = 'Error sending message. Please try again later.';
      formStatus.style.color = 'red';
    }
  });
}
