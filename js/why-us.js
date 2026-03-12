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

if(window.scrollY > 150 && !fixed){

fixed = true

// stop leak animations
leaks.forEach(leak=>{
leak.style.opacity="0"
})

// increase revenue tokens
document.querySelectorAll(".revenue-token")
.forEach(token=>{
token.innerText = "$" + (Math.floor(Math.random()*400)+200)
})

// activate revenue stage
document.querySelector(".revenue-stage")
.style.boxShadow="0 0 30px rgba(34,197,94,1)"

// show engine activation
fixBanner.classList.add("active")

}

})
