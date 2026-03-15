document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
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
// 2. Mobile navigation bar
// ===============================
// MOBILE MENU TOGGLE LOGIC
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
   navMenu.classList.toggle('active');
   navToggle.classList.toggle('active');
   document.body.classList.toggle("menu-open");
    // Optional: Animate the hamburger spans to an 'X'
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('open'));
  });
}
// Close menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});
// Close menu when clicking outside
document.addEventListener("click",(e)=>{
  if(
    navMenu.classList.contains("active") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ){
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  }
})
// Close menu if screen becomes desktop size
window.addEventListener("resize",()=>{
  if(window.innerWidth > 992){
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  }
})

/* =====================================
3. Stripe-style flowing animation
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
const PARTICLE_COUNT = 250
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
let mouseMoveTimeout;
window.addEventListener("mousemove",(e)=>{
if(mouseMoveTimeout) return;
mouseMoveTimeout = setTimeout(()=>{
const rect = raysCanvas.getBoundingClientRect();
mouse.x = e.clientX - rect.left;
mouse.y = e.clientY - rect.top;
mouseMoveTimeout = null;
},30);
});
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
} 
}); // DOMContentLoaded close
