// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// Production Optimized
// ======================================================


// ===============================
// 1. HEADER SCROLL EFFECT
// ===============================
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }
});

// ===============================
// 2. REVEAL ANIMATION
// ===============================
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => revealObserver.observe(el));

// ===============================
// 3. COUNTER ANIMATION
// ===============================
const counters = document.querySelectorAll(".counter");
function runCounters() {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const duration = 1500;
    const startTime = performance.now();
    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      counter.innerText = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    }
    requestAnimationFrame(updateCounter);
  });
}
if (counters.length > 0) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runCounters();
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });
  counterObserver.observe(document.querySelector(".stats"));
}

// ===============================
// 4. OPTIMIZED PARTICLE SYSTEM
// ===============================
const canvas = document.getElementById("particles");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  // High-performance check: If screen is small, we show fewer, slower dots.
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 15 : 60; 
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasSize();
  class Particle {
    constructor() {
      this.init();
    }
    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 2;
      // Much slower speeds = smoother look on mobile
      this.speedX = Math.random() * 0.2 - 0.1;
      this.speedY = Math.random() * 0.2 - 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.init();
      }
    }
    draw() {
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; 
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }
  }
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }
  initParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    setCanvasSize();
    initParticles();
  });
}
// ===============================
// 5. PARALLAX (Disabled for Mobile Speed)
// ===============================
const parallaxElements = document.querySelectorAll(".parallax");
window.addEventListener("scroll", () => {
  if (window.innerWidth < 992) return; // This stops the heavy "jumping" effect on phones
  const scrollY = window.scrollY;
  parallaxElements.forEach(el => {
    const speed = el.getAttribute("data-speed") || 0.3;
    el.style.transform = `translateY(${scrollY * (speed * 0.1)}px)`;
  });
});
// ===============================
// 6. CONTACT STRIP REVEAL
// ===============================
const contactStrip = document.querySelector(".contact-strip");
if (contactStrip) {
  const contactObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      contactStrip.classList.add("visible");
    }
  }, { threshold: 0.3 });
  contactObserver.observe(contactStrip);
}
// ===============================
// 7. Mobile navigation bar
// ===============================
// MOBILE MENU TOGGLE LOGIC
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Optional: Animate the hamburger spans to an 'X'
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('open'));
  });
}
// Close menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// ===============================
// 8. BLOG SEARCH
// ===============================
function searchBlogs(){
let input = document.getElementById("blogSearch").value.toLowerCase();
let cards = document.querySelectorAll(".blog-card");
cards.forEach(card => {
let title = card.querySelector("h3").innerText.toLowerCase();
card.style.display = title.includes(input) ? "block" : "none";
});
}

// ===============================
// 9. BLOG FILTER
// ===============================
document.addEventListener("click", function(e){
if(e.target.classList.contains("filter-btn")){
let filter = e.target.getAttribute("data-filter");
let cards = document.querySelectorAll(".blog-card");
cards.forEach(card=>{
if(filter==="all"){
card.style.display="block";
}
else if(card.dataset.category===filter){
card.style.display="block";
}
else{
card.style.display="none";
}
});
}
});
// ===============================
// 10. SERVICE CARD EXPAND
// ===============================
document.querySelectorAll(".toggle-btn").forEach(button => {
button.addEventListener("click", function(){
const card = this.closest(".service-card");
card.classList.toggle("expanded");
if(card.classList.contains("expanded")){
this.innerText = "Read Less ↑";
}
else{
this.innerText = "Read More →";
}
});
});

// ===============================
// 11. LOAD BLOG POSTS AUTOMATICALLY
// ===============================
const blogGrid = document.getElementById("blogGrid");
if (blogGrid) {
fetch("posts/posts.json")
.then(response => {
if(!response.ok){
throw new Error("JSON not found");
}
return response.json();
})
.then(posts => {
blogGrid.innerHTML = "";
posts.forEach(post => {
const card = `
<div class="blog-card reveal" data-category="${post.category}">
<img src="${post.image}" alt="${post.title}">
<div class="blog-content">
<div class="blog-meta">
<span>${post.category}</span>
<span>${post.date} • ${post.readTime}</span>
</div>
<h3>${post.title}</h3>
<p>${post.description}</p>
<a href="${post.url}" class="blog-read">
Read Article →
</a>
</div>
</div>
`;
blogGrid.innerHTML += card;
});
// re-enable reveal animation
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
});
}

// ===============================
// 12. Activated Service Navigation (Services Page)
// ===============================
const sections = document.querySelectorAll(".rcm-phase");
const navLinks = document.querySelectorAll(".services-nav a");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 200;
const sectionHeight = section.clientHeight;

if(pageYOffset >= sectionTop){
current = section.getAttribute("id");
}

});

navLinks.forEach(link => {
link.classList.remove("active");

if(link.getAttribute("href") === "#" + current){
link.classList.add("active");
}

});

});
