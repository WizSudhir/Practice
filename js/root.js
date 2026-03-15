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
const canvas = document.getElementById("cta-rays")
if(!canvas){
  console.warn("CTA rays canvas not found");
} else {
const ctx = canvas.getContext("2d")
let w,h
let particles=[]
let originX
let originY
function resize(){
w = canvas.width = canvas.offsetWidth
h = canvas.height = canvas.offsetHeight
originX = w/2
originY = h
}
window.addEventListener("resize",resize)
resize()
const PARTICLE_COUNT = 280
resize()
class Particle{
constructor(){
this.angle = Math.random()*Math.PI
this.radius = Math.random()*350 + 50
this.baseRadius = this.radius
this.speed = 0.002 + Math.random()*0.003
this.x = originX
this.y = originY
this.size = Math.random()*2+1
}
update(time){
this.angle += this.speed
this.x =
originX +
Math.cos(this.angle)*this.radius
this.y =
originY -
Math.sin(this.angle)*this.radius
}
draw(){
ctx.beginPath()
ctx.moveTo(originX,originY)
ctx.lineTo(this.x,this.y)
const grad = ctx.createLinearGradient(
originX,originY,
this.x,this.y
)
grad.addColorStop(0,"#ffba27")
grad.addColorStop(.4,"#ff7ac8")
grad.addColorStop(.8,"#a855f7")
grad.addColorStop(1,"#6366f1")
ctx.globalAlpha = 0.8
ctx.strokeStyle = grad
ctx.lineWidth = .7
ctx.stroke()
ctx.beginPath()
ctx.arc(this.x,this.y,this.size,0,Math.PI*2)
ctx.fillStyle="#4f7cff"
ctx.fill()
}
}
for(let i=0;i<PARTICLE_COUNT;i++){
particles.push(new Particle())
}
let mouse={x:-1000,y:-1000}
ctaSection.addEventListener("mousemove",e=>{
const rect = canvas.getBoundingClientRect()
mouse.x = e.clientX - rect.left
mouse.y = e.clientY - rect.top
})
function animate(time){
ctx.clearRect(0,0,w,h)
particles.forEach(p=>{
const dx = p.x - mouse.x
const dy = p.y - mouse.y
const dist = Math.sqrt(dx*dx + dy*dy)
if(dist < 120){
p.radius += (160 - dist) * 0.02
p.radius = Math.min(p.radius, p.baseRadius + 80)
}else{
p.radius += (p.baseRadius - p.radius) * 0.02
}
p.update(time)
p.draw()
})
requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
}

}); // DOMContentLoaded close
