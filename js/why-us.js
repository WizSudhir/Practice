document.addEventListener("DOMContentLoaded", () => {

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

// animate gauge
let circumference = 251;
let offset = circumference - (score / 100) * circumference;

document.getElementById("gaugeFill")
.style.strokeDashoffset = offset;

}

window.calculateRCMScore = calculateRCMScore;


// ===============================
// Leak → Fix Animation
// ===============================

const leaks = document.querySelectorAll(".leak")
const fixBanner = document.querySelector(".fix-banner")
const workflow = document.querySelector(".workflow")
const heroSection = document.querySelector(".hero-enterprise")

let fixed = false

if(workflow && heroSection){

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

startEngine()

}else{

resetEngine()

}

})

},{ threshold:0.4 })

observer.observe(heroSection)

function resetEngine(){

fixed = false

leaks.forEach(leak=>{
leak.style.opacity = "1"
})
workflow.style.borderColor = ""
workflow.classList.remove("pipeline-fixed")
document.querySelector(".metric-box .metric-value").innerText="$8,490"
document.querySelector(".metric-box.recovered .metric-value").innerText="$0"

fixBanner.classList.remove("active")

}
function startEngine(){

if(fixed) return

fixed = true
document.querySelector(".workflow").style.borderColor="#22c55e"
workflow.classList.add("pipeline-fixed")
let recovered = 0

const recoveredMetric =
document.querySelector(".metric-box.recovered .metric-value")

const leakageMetric =
document.querySelector(".metric-box .metric-value")

leaks.forEach(leak=>{
leak.style.transition="opacity .8s ease"
leak.style.opacity="0"
})

const interval = setInterval(()=>{

recovered += 850

recoveredMetric.innerText = "$" + recovered

leakageMetric.innerText =
"$" + Math.max(0,8490 - recovered)

if(recovered >= 8490){
clearInterval(interval)
}

},400)

document.querySelector(".revenue-stage")
.style.boxShadow="0 0 30px rgba(34,197,94,1)"

fixBanner.classList.add("active")

}

}
// ===============================
// Aurora Background Interaction
// ===============================

const auroras = document.querySelectorAll(".hero-aurora")

document.addEventListener("mousemove",(e)=>{

const x = (window.innerWidth/2 - e.clientX)/80
const y = (window.innerHeight/2 - e.clientY)/80

auroras.forEach(a=>{
a.style.transform = `translate(${x}px, ${y}px)`
})

})


// ===============================
// SaaS Hero Parallax System
// ===============================

const dashboard =
document.querySelector(".workflow-dashboard")

const hero =
document.querySelector(".hero-enterprise")

if(hero && dashboard){

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

}

}) // increase revenue tokenslfklsejlkdsjlkjdslkjslkjsldkjdslkjflksdlkdsfjlksjdlfjlskdjflksjlfksdjlksdjlkdsjlkdsjflkjsdlkfjsdlkdfjlksjdlkflksf
