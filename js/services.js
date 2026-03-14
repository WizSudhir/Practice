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
const svgBack = document.getElementById("ribbons-back")
const svgFront = document.getElementById("ribbons-front")

const width = 1600
const height = 600

const ribbonsBack = []
const ribbonsFront = []
const ribbonCount = 40

function createRibbon(container,i){

const path = document.createElementNS(
"http://www.w3.org/2000/svg","path"
)

path.setAttribute("class","ribbon-line")

path.style.opacity = 0.3 + Math.random()*0.5
path.style.strokeWidth = 1 + Math.random()*1.5

container.appendChild(path)

return {
path:path,
offset:i * 0.2 + Math.random()
}

}

for(let i=0;i<ribbonCount;i++){
ribbonsBack.push(createRibbon(svgBack,i))
}

for(let i=0;i<ribbonCount;i++){
ribbonsFront.push(createRibbon(svgFront,i))
}

let time = 0

function animateLayer(ribbons){

ribbons.forEach((ribbon,index)=>{

const offset = ribbon.offset
const base = height/2
const amplitude = 50 + index*1.4
const wind = Math.sin(time*0.15) * 60
const turbulence = Math.sin(time*0.9 + index)*8

const y1 =
base +
Math.sin(time*0.5 + offset) * amplitude

const y2 =
base +
Math.sin(time*0.8 + offset + index*0.05) * amplitude*1.2

const y3 =
base +
Math.sin(time*0.3 + offset + index*0.1) * amplitude*0.7

const d = `
M 0 ${y1}
C
${width*0.35 + wind} ${y2 + turbulence},
${width*0.65 + wind} ${y3 - turbulence},
${width} ${y3}
`

ribbon.path.setAttribute("d",d)

})

}

function animate(){

time += 0.004

animateLayer(ribbonsBack)
animateLayer(ribbonsFront)

requestAnimationFrame(animate)

}

animate()
