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
const svg = document.getElementById("ribbons")

const width = 1600
const height = 600

const ribbons = []
const ribbonCount = 45

function createRibbon(i){

const path = document.createElementNS(
"http://www.w3.org/2000/svg","path"
)

path.setAttribute("class","ribbon-line")

svg.appendChild(path)

return {
path:path,
offset:i * 0.15
}

}

for(let i=0;i<ribbonCount;i++){
ribbons.push(createRibbon(i))
}

let time = 0

function animate(){

time += 0.02

ribbons.forEach((ribbon,index)=>{

const offset = ribbon.offset

const y1 =
height/2 +
Math.sin(time + offset)*80

const y2 =
height/2 +
Math.sin(time + offset + 1)*120

const y3 =
height/2 +
Math.sin(time + offset + 2)*80

const d = `

M 0 ${y1}

C
${width*0.25} ${y2},
${width*0.75} ${y3},
${width} ${y1}

`

ribbon.path.setAttribute("d",d)

})

requestAnimationFrame(animate)

}

animate()
