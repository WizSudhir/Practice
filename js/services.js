// ===============================
// Hero Scroll Story
// ===============================
const hero = document.querySelector(".pg-hero");
const stages = document.querySelectorAll(".pg-stage");
function updateHeroStages(){
if(!hero) return;

const heroTop = hero.offsetTop;
const heroHeight = hero.offsetHeight;
const scrollPosition = window.scrollY + window.innerHeight/2;

let progress = (scrollPosition - heroTop) / heroHeight;
progress = Math.max(0, Math.min(1, progress));

const stageIndex = Math.floor(progress * stages.length);
stages.forEach((stage, index)=>{
stage.classList.remove("active");

if(index === stageIndex){
stage.classList.add("active");

// TRIGGER ANIMATIONS WHEN STAGE APPEARS
if(stage.classList.contains("stage-cta")){
startRevenueCounter();
}else{
resetRevenue();
}
}
});
}
//===============================
// ONE Scroll Listener (better)
// ===============================

window.addEventListener("scroll", () => {
updateNav();
updateHeroStages();
});

// ===============================
// ROI Calculator
// ===============================

function calculateRevenue(){

let claims = document.getElementById("claims").value || 0;
let reimbursement = document.getElementById("reimbursement").value || 0;
let denial = document.getElementById("denial").value || 0;

let monthlyRevenue = claims * reimbursement;
let lostRevenue = monthlyRevenue * (denial / 100);
let yearlyLoss = lostRevenue * 12;

document.getElementById("roiResult").innerText =
"$" + yearlyLoss.toLocaleString();
}

// ===============================
// Hero Revenue Counter
// ===============================

function startRevenueCounter(){

let counter=document.getElementById("revenueCounter");
let value=0;
let target=2450000;

counter.innerText="$0";
let interval=setInterval(()=>{
value+=25000;

if(value>=target){
value=target;
clearInterval(interval);
}

counter.innerText="$"+value.toLocaleString();
},30);

}
function resetRevenue(){
document.getElementById("revenueCounter").innerText="$0";
}

// ===============================
// Dashboard Metrics Animation
// ===============================

function animateMetric(id,target,suffix=""){

let el=document.getElementById(id);
el.innerText="0";
let value=0;

let step=target/40;
let interval=setInterval(()=>{
value+=step;
if(value>=target){
value=target;
clearInterval(interval);
}
el.innerText=Math.floor(value)+suffix;
},30);
}

function startMetrics(){
animateMetric("metric1",98,"%");
animateMetric("metric2",28);
animateMetric("metric3",30,"%");
animateMetric("metric4",35,"%");
}
function resetMetrics(){
document.getElementById("metric1").innerText="0";
document.getElementById("metric2").innerText="0";
document.getElementById("metric3").innerText="0";
document.getElementById("metric4").innerText="0";
}
// ===============================
// Lucide Icons
// ===============================
lucide.createIcons();

// ===============================
// Update Hero Stages
// ===============================

window.addEventListener("load", () => {
updateHeroStages();
});
/* ===============================
RCM Circular SYSTEM ANIMATION
=============================== */

const rcmNodes = document.querySelectorAll(".rcm-node");
if(rcmNodes.length){
let rcmIndex = 0;

function animateRCM(){
rcmNodes.forEach(node => node.classList.remove("active"));
rcmNodes[rcmIndex].classList.add("active");
rcmIndex++;

if(rcmIndex >= rcmNodes.length){
rcmIndex = 0;
}
}

setInterval(animateRCM,1200);
}

/* =====================================
STICKY NAV ACTIVE HIGHLIGHT
===================================== */

const sections = document.querySelectorAll(".rcm-phase");
const navLinks = document.querySelectorAll(".services-nav a");

function updateNav(){
let current = "";
sections.forEach(section=>{

const rect = section.getBoundingClientRect();
if(rect.top <= 150 && rect.bottom >= 150){
current = section.id;
}
});

navLinks.forEach(link=>{
link.classList.remove("active");
if(link.getAttribute("href") === "#" + current){
link.classList.add("active");
}
});

}
/* =====================================
PHASE PROGRESS BAR
===================================== */

const progressBar = document.querySelector(".phase-progress");
const servicesSection = document.querySelector(".rcm-services");

window.addEventListener("scroll", () => {
if(!progressBar || !servicesSection) return;

const sectionTop = servicesSection.offsetTop;
const sectionHeight = servicesSection.offsetHeight;
const scroll = window.scrollY - sectionTop;

let progress = (scroll / sectionHeight) * 100;
progress = Math.max(0, Math.min(progress,100));
progressBar.style.height = progress + "%";

});
/* =====================================
SCROLL REVEAL ANIMATION
===================================== */

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){
const trigger = window.innerHeight * 0.85;
revealElements.forEach(el => {

const top = el.getBoundingClientRect().top;
if(top < trigger){
el.classList.add("active");
}
});
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* =====================================
Stripe-style flowing animation
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
