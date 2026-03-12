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
// Leak → Fix Animation
// ===============================
const leaks = document.querySelectorAll(".leak")
const fixBanner = document.querySelector(".fix-banner")

let fixed = false
const workflow = document.querySelector(".workflow")

window.addEventListener("scroll",()=>{
workflow.style.boxShadow =
"0 0 40px rgba(34,197,94,.4), 0 20px 80px rgba(0,0,0,.45)";
if(window.scrollY > 150 && !fixed){

fixed = true

// stop leak animations
leaks.forEach(leak=>{
leak.style.transition="opacity .8s ease"
leak.style.opacity="0"
})

// increase revenue tokens
let recovered = 0

const recoveredMetric =
document.querySelector(".metric-box.recovered .metric-value")

const leakageMetric =
document.querySelector(".metric-box .metric-value")

const interval = setInterval(()=>{

recovered += 85

recoveredMetric.innerText = "$" + recovered

leakageMetric.innerText =
"$" + Math.max(0,415 - recovered)

if(recovered >= 415){
clearInterval(interval)
}

},400)

// activate revenue stage
document.querySelector(".revenue-stage")
.style.boxShadow="0 0 30px rgba(34,197,94,1)"

// show engine activation
fixBanner.classList.add("active")

}

})
// ===============================
// SaaS Hero Parallax System
// ===============================

const dashboard =
document.querySelector(".workflow-dashboard")

const hero =
document.querySelector(".hero-enterprise")

hero.addEventListener("mousemove",(e)=>{

const x = (window.innerWidth/2 - e.clientX)/40
const y = (window.innerHeight/2 - e.clientY)/40

dashboard.style.transform =
`rotateX(${8+y}deg) rotateY(${-10+x}deg)`

})

hero.addEventListener("mouseleave",()=>{

dashboard.style.transform =
"rotateX(8deg) rotateY(-10deg)"

})
