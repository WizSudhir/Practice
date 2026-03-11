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
const pipeline = document.querySelector(".pipeline")

window.addEventListener("scroll",()=>{

if(window.scrollY > 150 && !fixed){

fixed = true

pipeline.classList.add("fixed")

leaks.forEach(leak=>{
leak.style.opacity = "0"
})

fixBanner.classList.add("active")

}

})
