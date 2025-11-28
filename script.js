(function(){emailjs.init('D1kAEOFgpeA7mLjQe');})();

const scrollRevealElements=document.querySelectorAll('.scroll-reveal');
const scrollRevealItems=document.querySelectorAll('.scroll-reveal-item');
const observerOptions={root:null,rootMargin:'0px',threshold:0.1};
const observer=new IntersectionObserver((entries,obs)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}})},observerOptions);
scrollRevealElements.forEach(el=>observer.observe(el));
scrollRevealItems.forEach(el=>observer.observe(el));

const sections=document.querySelectorAll('section');
const navLinks=document.querySelectorAll('nav ul li a');
const navObserverOptions={root:null,rootMargin:'-50% 0px -50% 0px',threshold:0};
const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.remove('active')); const activeLink=document.querySelector(`nav ul li a[href="#${entry.target.id}"]`); if(activeLink) activeLink.classList.add('active');}})},navObserverOptions);
sections.forEach(section=>navObserver.observe(section));

const backToTop=document.createElement('button');
backToTop.textContent='↑';
backToTop.classList.add('back-to-top');
document.body.appendChild(backToTop);
window.addEventListener('scroll',()=>{if(window.scrollY>300){backToTop.style.opacity='1'; backToTop.style.transform='translateY(0)';}else{backToTop.style.opacity='0'; backToTop.style.transform='translateY(100px)';}});
backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const contactForm=document.getElementById('contactForm');
const formStatus=document.getElementById('formStatus');
contactForm.addEventListener('submit',async e=>{e.preventDefault();
const name=document.getElementById('contactName').value.trim();
const email=document.getElementById('contactEmail').value.trim();
const message=document.getElementById('contactMessage').value.trim();
if(!name||!email||!message){formStatus.textContent='Please fill all fields.'; formStatus.style.color='red'; return;}
if(!validateEmail(email)){formStatus.textContent='Please enter a valid email.'; formStatus.style.color='red'; return;}
formStatus.textContent='Sending...'; formStatus.style.color='#00796b';
try{await emailjs.sendForm('service_c82e22l','template_iga2c4v',contactForm); formStatus.textContent='Message sent! We will contact you soon.'; formStatus.style.color='green'; contactForm.reset();}catch(err){formStatus.textContent='Error sending message. Please try again later.'; formStatus.style.color='red'; console.error(err);}});
function validateEmail(email){const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/; return re.test(email.toLowerCase());}
