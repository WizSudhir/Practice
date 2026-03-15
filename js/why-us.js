document.addEventListener("DOMContentLoaded", () => {
// ===============================
// Lucide Icons
// ===============================
  lucide.createIcons();
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
let engineCycle = null
let startDelay = null
const statusText =
document.querySelector(".status-text")
const pipelineText =
document.querySelector(".pipeline-text")
if(statusText){
statusText.innerText="System scanning..."
}
if(workflow && heroSection){
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){
startCycle()
}else{
stopCycle()
resetEngine()
}
})
},{ threshold:0.4 })
observer.observe(heroSection)
function startCycle(){
if(engineCycle) return
// Wait 3 seconds so visitor understands the pipeline
startDelay = setTimeout(()=>{
startScanning()
setTimeout(()=>{
detectLeaks()
setTimeout(()=>{
runEngine()
},2000)
},2000)
engineCycle = setInterval(()=>{
resetEngine()
setTimeout(()=>{
startScanning()
setTimeout(()=>{
detectLeaks()
setTimeout(()=>{
runEngine()
},2000)
},2000)
},2000)
},12000)
},3000)
}
function stopCycle(){
clearTimeout(startDelay)
clearInterval(engineCycle)
engineCycle = null
}
function resetEngine(){
if(pipelineText){
pipelineText.innerText="Analyzing Revenue Cycle"
}
fixed = false
leaks.forEach(leak=>{
leak.style.opacity = "0"
})
workflow.style.borderColor = ""
workflow.classList.remove("pipeline-fixed")
document.querySelector(".metric-box .metric-value").innerText="$8,490"
document.querySelector(".metric-box.recovered .metric-value").innerText="$0"
fixBanner.classList.remove("active")
document.querySelector(".revenue-stage")
.style.boxShadow="0 0 20px rgba(34,197,94,.6)"
const statusText =
document.querySelector(".status-text")
const statusBox =
document.querySelector(".system-status")
statusText.innerText="System scanning..."
statusBox.classList.add("scanning")
}
function detectLeaks(){
const statusText =
document.querySelector(".status-text")
const statusBox =
document.querySelector(".system-status")
statusText.innerText = "Leakage detected"
if(pipelineText){
pipelineText.innerText="Revenue Leakage Detected"
}
statusBox.classList.remove("scanning")
// show leaks
leaks.forEach(leak=>{
leak.style.opacity="1"
})
}
function startScanning(){
if(pipelineText){
pipelineText.innerText="Analyzing Revenue Cycle"
}
const statusText =
document.querySelector(".status-text")
const statusBox =
document.querySelector(".system-status")
statusText.innerText = "System scanning..."
statusBox.classList.add("scanning")
// hide leaks during scanning
leaks.forEach(leak=>{
leak.style.opacity="0"
})
}
function runEngine(){
if(fixed) return
fixed = true
if(pipelineText){
pipelineText.innerText="Revenue Recovery Activated"
}
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
"$" + Math.max(0,8500 - recovered)
if(recovered >= 8500){
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
let ticking = false
document.addEventListener("mousemove",(e)=>{
if(!ticking){
requestAnimationFrame(()=>{
const x = (window.innerWidth/2 - e.clientX)/80
const y = (window.innerHeight/2 - e.clientY)/80
auroras.forEach(a=>{
a.style.transform = `translate(${x}px, ${y}px)`
})
ticking = false
})
ticking = true
}
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
  
// ======================================
// PLATFORM DATA FLOW ANIMATION
// ======================================

document.addEventListener("DOMContentLoaded",()=>{

const sources = document.querySelectorAll(".source-node")
const outcomes = document.querySelectorAll(".outcome-node")

let index = 0

setInterval(()=>{

sources.forEach(s=>s.classList.remove("active"))

outcomes.forEach(o=>o.classList.remove("active"))

sources[index].classList.add("active")

if(outcomes[index % outcomes.length]){
outcomes[index % outcomes.length].classList.add("active")
}

index++

if(index >= sources.length){
index = 0
}

},2000)

})
  
}) // DOM Close
