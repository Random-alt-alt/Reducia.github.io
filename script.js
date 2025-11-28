/* === Scroll Reveal & Active Nav === */
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const scrollRevealItems = document.querySelectorAll('.scroll-reveal-item');

const observerOptions = { root:null, rootMargin:'0px', threshold:0.1 };
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target);}
  });
}, observerOptions);
scrollRevealElements.forEach(el=>observer.observe(el));
scrollRevealItems.forEach(el=>observer.observe(el));

const sections=document.querySelectorAll('section');
const navLinks=document.querySelectorAll('nav ul li a');
const navObserverOptions={root:null, rootMargin:'-50% 0px -50% 0px', threshold:0};
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(link=>link.classList.remove('active'));
      const activeLink=document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
      if(activeLink) activeLink.classList.add('active');
    }
  });
}, navObserverOptions);
sections.forEach(section=>navObserver.observe(section));

/* === Contact Form === */
const contactForm=document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', async function(event){
    event.preventDefault();
    const name=document.getElementById('contactName').value.trim();
    const email=document.getElementById('contactEmail').value.trim();
    const message=document.getElementById('contactMessage').value.trim();
    if(name===''||email===''||message===''){ alert('Please fill in all fields.'); return;}
    if(!validateEmail(email)){ alert('Please enter a valid email address.'); return; }

    const submitBtn = contactForm.querySelector('button');
    submitBtn.classList.add('sending');
    submitBtn.textContent = 'Sending... ✈';

    try{
      await emailjs.sendForm('service_c82e22l','template_iga2c4v',this);
      const confirmation=document.getElementById('formConfirmation');
      confirmation.classList.add('show');
      setTimeout(()=>confirmation.classList.remove('show'),4000);
      contactForm.reset();
    }catch(error){
      console.error('EmailJS Failed:',error);
      alert('There was an error sending your message. Please try again later.');
    }finally{
      submitBtn.classList.remove('sending');
      submitBtn.innerHTML = 'Send Message <span class="plane">✈</span>';
    }
  });
}
function validateEmail(email){ const re=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; return re.test(String(email).toLowerCase()); }

/* === Back to Top Button === */
const backToTopButton=document.createElement('button');
backToTopButton.textContent='↑'; backToTopButton.classList.add('back-to-top');
document.body.appendChild(backToTopButton);
backToTopButton.style.cssText=`position:fixed; bottom:20px; right:20px; background-color:var(--primary-color); color:var(--text-light); border:none; border-radius:50%; width:50px; height:50px; font-size:1.5rem; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.2); transition: opacity 0.3s ease, transform 0.3s ease; opacity:0; transform:translateY(100px); z-index:999;`;
window.addEventListener('scroll',()=>{
  if(window.scrollY>300){ backToTopButton.style.opacity='1'; backToTopButton.style.transform='translateY(0)'; } else { backToTopButton.style.opacity='0'; backToTopButton.style.transform='translateY(100px)'; }
});
backToTopButton.addEventListener('click',()=>{ window.scrollTo({ top:0, behavior:'smooth'}); });

