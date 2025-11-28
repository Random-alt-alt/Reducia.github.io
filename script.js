// ---------- EMAILJS SETUP ----------
emailjs.init('D1kAEOFgpeA7mLjQe');

const contactForm = document.getElementById('contactForm');
const formConfirmation = document.getElementById('formConfirmation');

contactForm.addEventListener('submit', async function(event){
    event.preventDefault();

    if(!window.emailjs || typeof emailjs.sendForm!=='function'){
        alert('Email service is not ready yet. Please try again.');
        return;
    }

    try{
        await emailjs.sendForm('service_c82e22l','template_iga2c4v',this);
        formConfirmation.classList.add('show');
        setTimeout(()=> formConfirmation.classList.remove('show'),4000);
        this.reset();
    }catch(err){
        console.error('FAILED', err);
        alert('Error sending message. Check console.');
    }
});

// ---------- SCROLL REVEAL ----------
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

// ---------- ACTIVE NAV ----------
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

// ---------- BACK TO TOP ----------
const backToTopButton = document.createElement('button');
backToTopButton.textContent='↑';
backToTopButton.classList.add('back-to-top');
document.body.appendChild(backToTopButton);
Object.assign(backToTopButton.style,{
    position:'fixed', bottom:'20px', right:'20px', background:'#3f51b5', color:'#f4f4f4',
    border:'none', borderRadius:'50%', width:'50px', height:'50px', fontSize:'1.5rem',
    cursor:'pointer', boxShadow:'0 2px 10px rgba(0,0,0,0.2)', opacity:0, transform:'translateY(100px)', transition:'0.3s', zIndex:999
});
window.addEventListener('scroll',()=>{
    if(window.scrollY>300){ backToTopButton.style.opacity='1'; backToTopButton.style.transform='translateY(0)';}
    else{ backToTopButton.style.opacity='0'; backToTopButton.style.transform='translateY(100px)'; }
});
backToTopButton.addEventListener('click',()=> window.scrollTo({top:0, behavior:'smooth'}));

// ---------- SLASH ANIMATIONS ----------
const slashContainer = document.getElementById('slash-container');
function createSlash(){
    const slash = document.createElement('div');
    slash.classList.add('slash');
    slash.style.left = Math.random()*window.innerWidth+'px';
    slashContainer.appendChild(slash);
    setTimeout(()=> slash.remove(),700);
}
setInterval(createSlash,1000); // One slash every second

// ---------- UPDATE YEAR ----------
document.getElementById('year').textContent = new Date().getFullYear();
