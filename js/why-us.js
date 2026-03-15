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

const inputs = document.querySelectorAll(".input-node")

const metric1 = document.getElementById("metric1")
const metric2 = document.getElementById("metric2")
const metric3 = document.getElementById("metric3")

const label1 = document.getElementById("label1")
const label2 = document.getElementById("label2")
const label3 = document.getElementById("label3")

const engine = document.querySelector(".engine-circle")
const svg = document.querySelector(".network-lines")
/* ENGINE STATUS */
const engineStatus = document.getElementById("engineStatus")  
/* DATA */

const data = {

claims:{
m1:3842,
l1:"Claims Analyzed",
m2:14,
l2:"Denial Risks",
m3:"$12,500",
l3:"Revenue Opportunity",
status:"Analyzing claim submissions..."
},

eligibility:{
m1:1280,
l1:"Eligibility Checks",
m2:6,
l2:"Coverage Errors",
m3:"$3,800",
l3:"Prevented Denials",
status:"Verifying insurance eligibility..."
},

coding:{
m1:126,
l1:"Coding Issues",
m2:41,
l2:"Denial Risks",
m3:"$9,200",
l3:"Revenue Protected",
status:"Checking coding accuracy..."
},

payer:{
m1:48,
l1:"Payer Alerts",
m2:11,
l2:"Policy Changes",
m3:"$5,400",
l3:"Billing Adjustments",
status:"Analyzing payer rules..."
},

documentation:{
m1:87,
l1:"Docs Reviewed",
m2:9,
l2:"Missing Items",
m3:"$6,700",
l3:"Recovered Revenue",
status:"Validating documentation..."
}

}


/* HOVER EVENTS */
if(inputs.length > 0){
inputs.forEach(node=>{

node.addEventListener("mouseenter",()=>{

const type = node.dataset.type
const d = data[type]

sendDataPulse(node)

if(engineStatus && d.status){
engineStatus.innerText = d.status
}

animateMetric(metric1,d.m1)
animateMetric(metric2,d.m2)
metric3.innerText = d.m3

label1.innerText = d.l1
label2.innerText = d.l2
label3.innerText = d.l3

})

})
}
node.addEventListener("mouseleave",()=>{
if(engineStatus){
engineStatus.innerText = "Awaiting healthcare data input..."
}
})
/* DRAW NETWORK LINES */

function drawLines(){

svg.innerHTML=""

const container = document.querySelector(".architecture-grid")
const cont = container.getBoundingClientRect()

const engineRect = engine.getBoundingClientRect()

inputs.forEach(input=>{

const line = document.createElementNS(
"http://www.w3.org/2000/svg","line")

const rect = input.getBoundingClientRect()

line.setAttribute(
"x1", rect.right - cont.left)

line.setAttribute(
"y1", rect.top + rect.height/2 - cont.top)

line.setAttribute(
"x2", engineRect.left - cont.left)

line.setAttribute(
"y2", engineRect.top + engineRect.height/2 - cont.top)

svg.appendChild(line)

})
/* ENGINE → DASHBOARD CONNECTION */

const dashboard = document.querySelector(".dashboard-card")

if(dashboard){

const dashRect = dashboard.getBoundingClientRect()

const line = document.createElementNS(
"http://www.w3.org/2000/svg","line")

line.setAttribute(
"x1", engineRect.right - cont.left)

line.setAttribute(
"y1", engineRect.top + engineRect.height/2 - cont.top)

line.setAttribute(
"x2", dashRect.left - cont.left)

line.setAttribute(
"y2", dashRect.top + dashRect.height/2 - cont.top)

svg.appendChild(line)

}
}

window.addEventListener("load",drawLines)
window.addEventListener("resize",drawLines)

const line = document.createElementNS(
"http://www.w3.org/2000/svg","line")

line.setAttribute(
"x1", engineRect.right - cont.left)

line.setAttribute(
"y1", engineRect.top + engineRect.height/2 - cont.top)

line.setAttribute(
"x2", dashRect.left - cont.left)

line.setAttribute(
"y2", dashRect.top + dashRect.height/2 - cont.top)

svg.appendChild(line)
})
function animateMetric(el,value){

let current = 0
let target = parseInt(value)

const step = target / 30

const interval = setInterval(()=>{

current += step

if(current >= target){
current = target
clearInterval(interval)
}

el.innerText = Math.floor(current)

},20)

}
 // ======================================
// PLATFORM DATA FLOW PULSE
// ====================================== 
function sendDataPulse(fromElement){

const engine = document.querySelector(".engine-circle")

if(!engine) return

const pulse = document.createElement("div")
pulse.className = "data-pulse"

const container = document.querySelector(".architecture-grid")
container.appendChild(pulse)

const from = fromElement.getBoundingClientRect()
const to = engine.getBoundingClientRect()
const cont = container.getBoundingClientRect()

const startX = from.right - cont.left
const startY = from.top + from.height/2 - cont.top

const endX = to.left - cont.left + to.width/2
const endY = to.top - cont.top + to.height/2

pulse.style.left = startX + "px"
pulse.style.top = startY + "px"

requestAnimationFrame(()=>{
pulse.style.transform =
`translate(${endX-startX}px,${endY-startY}px)`
})

setTimeout(()=>{
pulse.remove()
},900)

}
}) // DOM Close
