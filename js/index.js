document.addEventListener("DOMContentLoaded", () => {
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
   navToggle.classList.toggle('active');
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
/* =====================================
Stripe-style flowing animation
===================================== */
const ctaSection = document.querySelector(".cta-stripe")
const raysCanvas = document.getElementById("cta-rays")
if(!raysCanvas){
  console.warn("CTA rays canvas not found");
} else {
const raysCtx = raysCanvas.getContext("2d")
let w,h
let particles=[]
let originX
let originY
function resize(){
w = raysCanvas.width = raysCanvas.offsetWidth
h = raysCanvas.height = raysCanvas.offsetHeight
originX = w/2
originY = h
}
window.addEventListener("resize",resize)
resize()
const PARTICLE_COUNT = 420
class Particle{
constructor(){
this.angle = Math.random()*Math.PI*2
this.radius = Math.random()*400 + 80
this.baseRadius = this.radius
this.speed = 0.0002 + Math.random()*0.0003
this.x = originX
this.y = originY
this.size = Math.random()*2+1
}
update(){
this.angle += this.speed
this.x =
originX +
Math.cos(this.angle)*this.radius
this.y =
originY -
Math.sin(this.angle)*this.radius
}
draw(){
raysCtx.beginPath()
raysCtx.moveTo(originX,originY)
raysCtx.lineTo(this.x,this.y)
const grad = raysCtx.createLinearGradient(
originX,originY,
this.x,this.y
)
grad.addColorStop(0,"rgba(255,255,255,0)")
grad.addColorStop(.2,"rgba(147,197,253,0.35)")
grad.addColorStop(.5,"rgba(99,102,241,0.65)")
grad.addColorStop(.8,"rgba(139,92,246,0.45)")
grad.addColorStop(1,"rgba(255,255,255,0)")
raysCtx.globalAlpha = 0.6
raysCtx.strokeStyle = grad
raysCtx.lineWidth = 1.6
raysCtx.shadowColor = "rgba(99,102,241,0.4)"
raysCtx.shadowBlur = 8
raysCtx.stroke()
raysCtx.shadowBlur = 0
raysCtx.beginPath()
raysCtx.arc(this.x,this.y,this.size,0,Math.PI*2)
raysCtx.fillStyle="rgba(255,255,255,0.8)"
raysCtx.shadowBlur=6
raysCtx.fill()
raysCtx.shadowBlur=0
}
}
for(let i=0;i<PARTICLE_COUNT;i++){
let p = new Particle()
p.angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random()*0.05)
particles.push(p)
}
let mouse={x:-1000,y:-1000}
if(ctaSection){
window.addEventListener("mousemove",e=>{
const rect = raysCanvas.getBoundingClientRect()
mouse.x = e.clientX - rect.left
mouse.y = e.clientY - rect.top
})
function animate(){
raysCtx.clearRect(0,0,w,h)
particles.forEach(p=>{
const dx = p.x - mouse.x
const dy = p.y - mouse.y
const dist = Math.sqrt(dx*dx + dy*dy)
if(dist < 280){
p.radius += (280 - dist) * 0.06
p.radius = Math.min(p.radius, p.baseRadius + 260)
}else{
p.radius += (p.baseRadius - p.radius) * 0.05
}
p.update()
p.draw()
})
requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
}

}   // closes else (IMPORTANT)

}); // DOMContentLoaded close
