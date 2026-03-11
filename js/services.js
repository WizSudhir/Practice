
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
if(stage.classList.contains("stage-dashboard")){
startMetrics();
}else{
resetMetrics();
}
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
// RCM Score Gauge
// ===============================

function calculateRCMScore(){

let q1 = parseInt(document.getElementById("q1").value);
let q2 = parseInt(document.getElementById("q2").value);
let q3 = parseInt(document.getElementById("q3").value);

let total = q1 + q2 + q3;

let score = Math.round((total / 9) * 100);

document.getElementById("scoreValue").innerText = score;

let label="";

if(score >= 80){
label="Excellent Revenue Cycle Performance";
}
else if(score >= 50){
label="Moderate Optimization Opportunity";
}
else{
label="High Revenue Leakage Risk";
}

document.getElementById("scoreLabel").innerText = label;

/* animate gauge */

let circumference = 251;
let offset = circumference - (score / 100) * circumference;

document.getElementById("gaugeFill")
.style.strokeDashoffset = offset;

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

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 200;

if(scrollY >= sectionTop){
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
