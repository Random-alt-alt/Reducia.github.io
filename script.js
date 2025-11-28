// ---------------- Scroll Reveal ----------------
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const scrollRevealItems = document.querySelectorAll('.scroll-reveal-item');

const observerOptions = { root:null, rootMargin:'0px', threshold:0.1 };
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

scrollRevealElements.forEach(el=>observer.observe(el));
scrollRevealItems.forEach(el=>observer.observe(el));

// ---------------- Navigation Highlight ----------------
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
const navObserverOptions = { root:null, rootMargin:'-50% 0px -50% 0px', threshold:0 };

const navObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(link=>link.classList.remove('active'));
      const targetId = entry.target.id;
      const activeLink = document.querySelector(`nav ul li a[href="#${targetId}"]`);
      if(activeLink){ activeLink.classList.add('active'); }
    }
  });
}, navObserverOptions);
sections.forEach(section=>navObserver.observe(section));

// ---------------- Back to Top ----------------
const backToTopButton = document.createElement('button');
backToTopButton.textContent='↑';
backToTopButton.classList.add('back-to-top');
document.body.appendChild(backToTopButton);

window.addEventListener('scroll',()=>{
  if(window.scrollY>300){ backToTopButton.classList.add('show'); }
  else{ backToTopButton.classList.remove('show'); }
});

backToTopButton.addEventListener('click',()=>{ window.scrollTo({ top:0, behavior:'smooth' }); });

// ---------------- EmailJS Contact Form ----------------
emailjs.init("D1kAEOFgpeA7mLjQe"); // your public key
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  formStatus.textContent='Sending...';
  formStatus.style.opacity='1';

  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if(!name || !email || !message){
    alert('Please fill in all fields.');
    formStatus.style.opacity='0';
    return;
  }

  if(!validateEmail(email)){
    alert('Please enter a valid email.');
    formStatus.style.opacity='0';
    return;
  }

  try {
    await emailjs.send("service_c82e22l","template_iga2c4v",{name,email,message});
    formStatus.textContent='Message Sent!';
    setTimeout(()=>{ formStatus.style.opacity='0'; }, 2500);
    contactForm.reset();
  } catch(err){
    console.error(err);
    formStatus.textContent='Error sending message.';
    setTimeout(()=>{ formStatus.style.opacity='0'; }, 2500);
  }
});

function validateEmail(email){
  const re=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
