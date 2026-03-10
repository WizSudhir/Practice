// ===============================
// Services Navigation Highlight
// ===============================

const sections = document.querySelectorAll(".rcm-phase");
const navLinks = document.querySelectorAll(".services-nav a");

function updateNav(){

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 200;

if(window.pageYOffset >= sectionTop){
current = section.getAttribute("id");
}

});

navLinks.forEach(link => {

link.classList.remove("active");

if(link.getAttribute("href") === "#" + current){
link.classList.add("active");
}

});

}


// ===============================
// Hero Scroll Story
// ===============================

const hero = document.querySelector(".pg-hero");
const stages = document.querySelectorAll(".pg-stage");

function updateHeroStages(){

if(!hero) return;

const scrollY = window.scrollY;
const heroTop = hero.offsetTop;
const heroHeight = hero.offsetHeight - window.innerHeight;

let progress = (scrollY - heroTop) / heroHeight;

progress = Math.max(0, Math.min(1, progress));

let stageIndex = Math.floor(progress * stages.length);

if(stageIndex >= stages.length){
stageIndex = stages.length - 1;
}

stages.forEach((stage,i)=>{
stage.classList.toggle("active", i === stageIndex);
});

}


// ===============================
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

let revenueStarted = false;

function startRevenueCounter(){

if(revenueStarted) return;

revenueStarted = true;

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

const revenueSection = document.querySelector(".stage-cta");

if(revenueSection){

const revenueObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{
if(entry.isIntersecting){
startRevenueCounter();
}
});

},{threshold:0.6});

revenueObserver.observe(revenueSection);

}


// ===============================
// Dashboard Metrics Animation
// ===============================

let metricsStarted=false;

function animateMetric(id,target,suffix=""){

let el=document.getElementById(id);

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

if(metricsStarted) return;

metricsStarted=true;

animateMetric("metric1",98,"%");
animateMetric("metric2",28);
animateMetric("metric3",30,"%");
animateMetric("metric4",35,"%");

}

const metricsSection=document.querySelector(".stage-dashboard");

if(metricsSection){

const metricsObserver=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{
if(entry.isIntersecting){
startMetrics();
}
});

},{threshold:0.6});

metricsObserver.observe(metricsSection);

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
stages[0].classList.add("active");
});
