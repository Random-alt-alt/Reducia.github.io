/* === Scroll Reveal & Nav Highlight === */
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const scrollRevealItems = document.querySelectorAll('.scroll-reveal-item');

const observer = new IntersectionObserver((entries, observer)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{root:null,rootMargin:'0px',threshold:0.1});

scrollRevealElements.forEach(el=>observer.observe(el));
scrollRevealItems.forEach(el=>observer.observe(el));

const sections=document.querySelectorAll('section');
const navLinks=document.querySelectorAll('nav ul li a');
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(link=>link.classList.remove('active'));
      const activeLink=document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
      if(activeLink) activeLink.classList.add('active');
    }
  });
},{root:null,rootMargin:'-50% 0px -50% 0px',threshold:0});
sections.forEach(section=>navObserver.observe(section));

/* === Contact Form with EmailJS === */
const contactForm=document.getElementById('contactForm');
const confirmation=document.getElementById('formConfirmation');
if(contactForm){
  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const name=document.getElementById('contactName').value.trim();
    const email=document.getElementById('contactEmail').value.trim();
    const message=document.getElementById('contactMessage').value.trim();
    if(!name||!email||!message){alert('Please fill all fields');return;}
    if(!validateEmail(email)){alert('Invalid email');return;}
    const submitBtn=contactForm.querySelector('button');
    submitBtn.classList.add('sending'); submitBtn.textContent='Sending... ✈';
    try{
      await emailjs.sendForm('service_c82e22l','template_iga2c4v',this);
      confirmation.classList.add('show');
      setTimeout(()=>confirmation.classList.remove('show'),4000);
      contactForm.reset();
    }catch(err){console.error(err);alert('Error sending message');}
    finally{
      submitBtn.classList.remove('sending');
      submitBtn.innerHTML='Send Message <span class="plane">✈</span>';
    }
  });
}
function validateEmail(email){
  const re=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

/* === Back to Top Button === */
const backToTop=document.createElement('button');
backToTop.classList.add('back-to-top'); backToTop.textContent='↑';
document.body.appendChild(backToTop);
window.addEventListener('scroll',()=>{
  if(window.scrollY>300){backToTop.style.opacity='1';backToTop.style.transform='translateY(0)';}
  else{backToTop.style.opacity='0';backToTop.style.transform='translateY(100px)';}
});
backToTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});});


