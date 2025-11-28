// Initialize EmailJS
emailjs.init('D1kAEOFgpeA7mLjQe');

const contactForm = document.getElementById('contactForm');
const formConfirmation = document.getElementById('formConfirmation');

contactForm.addEventListener('submit', async function(e){
    e.preventDefault();
    try{
        await emailjs.sendForm('service_c82e22l','template_iga2c4v',this);
        formConfirmation.classList.add('show');
        setTimeout(()=> formConfirmation.classList.remove('show'),4000);
        this.reset();
    }catch(err){
        console.error(err);
        alert('Error sending message.');
    }
});

// Scroll reveal
const scrollElements = document.querySelectorAll('.scroll-reveal');
const scrollItems = document.querySelectorAll('.scroll-reveal-item');
const observer = new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold:0.1 });
scrollElements.forEach(el=>observer.observe(el));
scrollItems.forEach(el=>observer.observe(el));

// Active nav
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
const navObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            navLinks.forEach(link=>link.classList.remove('active'));
            const activeLink = document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
            if(activeLink) activeLink.classList.add('active');
        }
    });
}, { root:null, rootMargin:'-50% 0px -50% 0px', threshold:0 });
sections.forEach(sec=>navObserver.observe(sec));

// Back to top button
const backToTopButton = document.createElement('button');
backToTopButton.textContent='↑';
backToTopButton.style.cssText='position:fixed;bottom:20px;right:20px;background:#3f51b5;color:#f4f4f4;border:none;border-radius:50%;width:50px;height:50px;font-size:1.5rem;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.2);opacity:0;transform:translateY(100px);transition:0.3s;z-index:999;';
document.body.appendChild(backToTopButton);
window.addEventListener('scroll',()=>{
    if(window.scrollY>300){backToTopButton.style.opacity='1';backToTopButton.style.transform='translateY(0)';}
    else{backToTopButton.style.opacity='0';backToTopButton.style.transform='translateY(100px)';}
});
backToTopButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Update footer year
document.getElementById('year').textContent = new Date().getFullYear();
