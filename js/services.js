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
// ===============================
// 12. Interactive ROI Calculator (Services Page)
// ===============================
function calculateRevenue(){

let claims = document.getElementById("claims").value;
let reimbursement = document.getElementById("reimbursement").value;
let denial = document.getElementById("denial").value;

let monthlyRevenue = claims * reimbursement;
let lostRevenue = monthlyRevenue * (denial / 100);

let yearlyLoss = lostRevenue * 12;

document.getElementById("roiResult").innerText =
"$" + yearlyLoss.toLocaleString();

}

// ===============================
// 13. RCM Maturity Score Gauge (Services Page)
// ===============================
function calculateRCMScore(){

let q1 = parseInt(document.getElementById("q1").value);
let q2 = parseInt(document.getElementById("q2").value);
let q3 = parseInt(document.getElementById("q3").value);

let total = q1 + q2 + q3;

let score = Math.round((total / 9) * 100);

document.getElementById("scoreValue").innerText = score;


let label = "";

if(score >= 80){

label = "Excellent Revenue Cycle Performance";

}

else if(score >= 50){

label = "Moderate Optimization Opportunity";

}

else{

label = "High Revenue Leakage Risk";

}

document.getElementById("scoreLabel").innerText = label;


/* animate gauge */

let circumference = 251;

let offset = circumference - (score / 100) * circumference;

document.getElementById("gaugeFill")
.style.strokeDashoffset = offset;

}
// ===============================
// 13. Hero Revenue Counter
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

const revenueObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

startRevenueCounter();

}

});

},{threshold:0.6});

revenueObserver.observe(document.querySelector(".stage-cta"));
// ===============================
// Hero Stages Effect (Services Page)
// ===============================

const hero = document.querySelector(".pg-hero");
const stages = document.querySelectorAll(".pg-stage");

window.addEventListener("scroll", ()=>{

let rect = hero.getBoundingClientRect();

let progress = -rect.top / (hero.offsetHeight - window.innerHeight);

progress = Math.max(0, Math.min(1, progress));

let stageIndex = Math.floor(progress * stages.length);

stages.forEach((stage,i)=>{

stage.style.opacity = (i === stageIndex) ? "1" : "0";

});

});
// ===============================
// 13. Hero Metrices count number (Services Page)
// ===============================
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

animateMetric("metric1",98,"%");
animateMetric("metric2",28);
animateMetric("metric3",30,"%");
animateMetric("metric4",35,"%");

}

const metricsObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

startMetrics();

}

});

},{threshold:0.6});

metricsObserver.observe(document.querySelector(".stage-dashboard"));

// ===============================
// LUCID icons activate
// ===============================
lucide.createIcons();
