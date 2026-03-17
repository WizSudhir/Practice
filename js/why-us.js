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
const leakageMetric = document.querySelector(".metric-box .metric-value")
if(leakageMetric){
leakageMetric.innerText="$8,490"
}
const recoveredMetric = document.querySelector(".metric-box.recovered .metric-value")
if(recoveredMetric){
recoveredMetric.innerText="$0"
}
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
const hero = document.querySelector(".hero-enterprise")
const auroras = document.querySelectorAll(".hero-aurora")
let ticking = false
if(hero){
hero.addEventListener("mousemove",(e)=>{
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
}
// ===============================
// SaaS Hero Parallax System
// ===============================

const dashboard =
document.querySelector(".workflow-dashboard")
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
/* fade all lines */
svg.querySelectorAll("path").forEach(p=>{
p.style.opacity = ".1"
})
/* activate hovered node line */
const index = [...inputs].indexOf(node)
const activeLine = svg.querySelectorAll("path")[index]
if(activeLine){
activeLine.style.opacity="1"
activeLine.style.strokeDasharray="6 10"
activeLine.style.animation="dataFlow 1s linear infinite"
}
/* dashboard metrics */
const type = node.dataset.type
const d = data[type]
if(!d) return
if(engineStatus && d.status){
engineStatus.innerText = d.status
}
if(metric1) animateMetric(metric1,d.m1)
if(metric2) animateMetric(metric2,d.m2)
if(metric3) metric3.innerText = d.m3
if(label1) label1.innerText = d.l1
if(label2) label2.innerText = d.l2
if(label3) label3.innerText = d.l3
})
node.addEventListener("mouseleave",()=>{
/* restore all lines */
svg.querySelectorAll("path").forEach(p=>{
p.style.opacity=".65"
p.style.strokeDasharray="6 10"
p.style.animation="dataFlow 6s linear infinite"
})
if(engineStatus){
engineStatus.innerText =
"Awaiting healthcare data input..."
}
})
})
} 
/* DRAW NETWORK LINES */
function drawLines(){
if(!svg || !engine || inputs.length === 0) return
svg.innerHTML=""
const container = document.querySelector(".architecture-grid")
if(!container) return
const cont = container.getBoundingClientRect()
const engineRect = engine.getBoundingClientRect()
inputs.forEach((input,index)=>{
const rect = input.getBoundingClientRect()
const nodeX = rect.right - cont.left
const nodeY = rect.top + rect.height/2 - cont.top
const coreX = engineRect.left - cont.left
const coreY = engineRect.top + engineRect.height/2 - cont.top
const offset = 60
const elbowX = nodeX + offset
const elbowY = nodeY + (index * 6)   // spreads lines
const endX = coreX + engineRect.width * 0.1
const spread = 70
const endY = coreY - spread/2 + (index * (spread/(inputs.length-1)))
const path = document.createElementNS(
"http://www.w3.org/2000/svg","path"
)
const pathData = `
M ${nodeX} ${nodeY}
L ${elbowX} ${nodeY}
L ${elbowX} ${endY}
L ${endX} ${endY}
`
path.setAttribute("d",pathData)
path.setAttribute("stroke","#60a5fa")
path.setAttribute("stroke-width","2.4")
path.setAttribute("fill","none")
svg.appendChild(path)
})
/* ENGINE → DASHBOARD CONNECTION */
const dashboardCard = document.querySelector(".dashboard-card")
if(dashboardCard){
const dashRect = dashboardCard.getBoundingClientRect()
const startX = engineRect.right - cont.left
const startY = engineRect.top + engineRect.height/2 - cont.top
const endX = dashRect.left - cont.left
const endY = dashRect.top + dashRect.height/2 - cont.top
const offset = 80
const elbowX = startX + offset
const path = document.createElementNS(
"http://www.w3.org/2000/svg","path"
)
const pathData = `
M ${startX} ${startY}
L ${elbowX} ${startY}
L ${elbowX} ${endY}
L ${endX} ${endY}
`
path.setAttribute("d",pathData)
path.setAttribute("stroke","#6366f1")
path.setAttribute("stroke-width","1.6")
path.setAttribute("stroke-dasharray","3 8")
path.setAttribute("fill","none")
svg.appendChild(path)
}
}
window.addEventListener("load", drawLines)
window.addEventListener("resize", drawLines)
drawLines()
function animateMetric(el,value){
let numeric = parseInt(
value.toString().replace(/[^0-9]/g,'')
)
let current = 0
let step = Math.max(1, numeric / 40)
const interval = setInterval(()=>{
current += step
if(current >= numeric){
current = numeric
clearInterval(interval)
}
el.innerText = Math.floor(current)
},20)
}
function sendDataPulse(fromElement){
const pulse = document.createElement("div")
pulse.className = "data-pulse"
const container = document.querySelector(".architecture-grid")
if(!container) return
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
  
// ===============================
// OUTCOMES SCROLL REVEAL
// ===============================
const stories = document.querySelectorAll(".pg-story")
const storyObserver = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("visible")
}else{
entry.target.classList.remove("visible") // RESET
}
})
},{
threshold:0.2
})
stories.forEach(story=>{
storyObserver.observe(story)
})

// ===============================
// ROI ANIMATION
// ===============================

const roiCards = document.querySelectorAll(".animated-roi")

const roiObserver = new IntersectionObserver(entries=>{
entries.forEach(entry=>{

const bars = entry.target.querySelectorAll(".roi-bar")
const valueEl = entry.target.querySelector(".roi-main")
const line = entry.target.querySelector(".line-path")

if(entry.isIntersecting){

// animate bars
bars.forEach(bar=>{
const val = bar.getAttribute("data-value")
bar.style.height = val + "%"
})

// animate line
if(line){
line.style.strokeDashoffset = "0"
}

// animate number
if(valueEl){
const type = valueEl.parentElement.getAttribute("data-type")
const target = parseInt(valueEl.dataset.target)
let current = 0
const interval = setInterval(()=>{
current += Math.ceil(target/40)
if(current >= target){
current = target
clearInterval(interval)
}
// FORMAT BASED ON TYPE
if(type === "currency"){
valueEl.innerText = "$" + current.toLocaleString()
}
else if(type === "percentage"){
valueEl.innerText = current + "%"
}
else if(type === "metric"){
valueEl.innerText = current + "%"
}
},30)
}

}else{

// RESET bars
bars.forEach(bar=> bar.style.height = "0")

// RESET line
if(line){
line.style.strokeDashoffset = "200"
}

// RESET number
const type = valueEl.parentElement.getAttribute("data-type")

if(type === "currency"){
valueEl.innerText = "$0"
}
else if(type === "percentage" || type === "metric"){
valueEl.innerText = "0%"
}

}

})
},{threshold:0.4})

roiCards.forEach(card=>{
roiObserver.observe(card)
})

});   // DOMContentLoaded close
