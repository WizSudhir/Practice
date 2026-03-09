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
// 13. Hero (Services Page)
// ===============================

const counter = document.getElementById("revenueCounter");

let value = 0;

const target = 2450000;

const interval = setInterval(() => {

value += 25000;

counter.innerText = "$" + value.toLocaleString();

if(value >= target){
clearInterval(interval);
}

},40);

// ===============================
// 13. Hero Stages Effect (Services Page)
// ===============================
const stages = document.querySelectorAll(".pg-stage");

window.addEventListener("scroll", () => {

let scrollPosition = window.scrollY + window.innerHeight * 0.6;

stages.forEach(stage => {

let stageTop = stage.offsetTop;

if(scrollPosition > stageTop){

stage.style.opacity = "1";
stage.style.transform = "translateY(0)";

}

});

});

// ===============================
// 13. Hero Stages Effect (Services Page)
// ===============================
const stages = document.querySelectorAll(".pg-stage");

window.addEventListener("scroll", () => {

let scrollPosition = window.scrollY + window.innerHeight * 0.6;

stages.forEach(stage => {

let stageTop = stage.offsetTop;

if(scrollPosition > stageTop){

stage.style.opacity = "1";
stage.style.transform = "translateY(0)";

}

});

});

// ===============================
// 13. Hero Metrices count number (Services Page)
// ===============================
function animateMetric(id,target,suffix=""){

let el=document.getElementById(id);
let value=0;

let interval=setInterval(()=>{

value+=Math.ceil(target/30);

if(value>=target){
value=target;
clearInterval(interval);
}

el.innerText=value+suffix;

},40);

}

animateMetric("metric1",98,"%");
animateMetric("metric2",28);
animateMetric("metric3",30,"%");
animateMetric("metric4",35,"%");
