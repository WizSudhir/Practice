document.addEventListener("DOMContentLoaded", () => {

// AI PLATFORM NODE INTERACTION
// ===============================

const modules = document.querySelectorAll(".ai-module")
const brain = document.querySelector(".ai-core")
const metric1 = document.getElementById("metric1")
const metric2 = document.getElementById("metric2")
const metric3 = document.getElementById("metric3")
const label1 = document.getElementById("metricLabel1")
const label2 = document.getElementById("metricLabel2")
const label3 = document.getElementById("metricLabel3")
let currentIndex = 0
let scanInterval
let userHovering = false
function animateMetric(element, value){
let current = 0
const duration = 600
const steps = 30
const increment = value / steps
const interval = setInterval(()=>{
current += increment
if(current >= value){
current = value
clearInterval(interval)
}
element.innerText = Math.floor(current).toLocaleString()
}, duration / steps)
}
// MODULE DATA LOGIC
function activateModule(module){
modules.forEach(m=>m.classList.remove("active"))
module.classList.add("active")
sendAIPulse(module, brain)
document.getElementById("aiStatus").innerText =
module.querySelector("h4").innerText + " processing..."
brain.classList.add("receiving")
const type = module.dataset.node
if(type === "intelligence"){
animateMetric(metric1,3842)
label1.innerText = "Claims Analyzed"
animateMetric(metric2,14)
label2.innerText = "Payer Behavior Alerts"
animateMetric(metric3,12500)
label3.innerText = "Revenue Opportunities"
}
if(type === "denial"){
animateMetric(metric1,126)
label1.innerText = "Coding Issues Detected"
animateMetric(metric2,41)
label2.innerText = "Denial Risks Prevented"
animateMetric(metric3,9200)
label3.innerText = "Revenue Protected"
}
if(type === "workflow"){
animateMetric(metric1,214)
label1.innerText = "Claims Routed"
animateMetric(metric2,36)
label2.innerText = "Workflow Bottlenecks"
animateMetric(metric3,7850)
label3.innerText = "Processing Efficiency"
}
if(type === "recovery"){
animateMetric(metric1,87)
label1.innerText = "Denied Claims Reopened"
animateMetric(metric2,53)
label2.innerText = "Successful Appeals"
animateMetric(metric3,18450)
label3.innerText = "Recovered Revenue"
}
if(type === "performance"){
metric1.innerText = "98%"
label1.innerText = "Clean Claim Rate"
metric2.innerText = "30%"
label2.innerText = "Faster Collections"
metric3.innerText = "$250k+"
label3.innerText = "Revenue Growth Potential"
}
}
// HOVER LINE SYSTEM
const svg = document.querySelector(".ai-network")
function drawNetwork(){
svg.innerHTML = ""
const container = document.querySelector(".ai-system")
const cont = container.getBoundingClientRect()
const core = brain.getBoundingClientRect()
modules.forEach(module=>{
const line = document.createElementNS(
"http://www.w3.org/2000/svg","line")
const mod = module.getBoundingClientRect()
const fromX =
mod.left + mod.width/2 - cont.left
const fromY =
mod.top + mod.height/2 - cont.top
const toX =
core.left + core.width/2 - cont.left
const toY =
core.top + core.height/2 - cont.top
const dx = toX - fromX
const dy = toY - fromY
const dist = Math.sqrt(dx*dx + dy*dy)
const nx = dx/dist
const ny = dy/dist
const moduleRadius = mod.width/2
const coreRadius = core.width/2
line.setAttribute("x1", fromX + nx*moduleRadius)
line.setAttribute("y1", fromY + ny*moduleRadius)
line.setAttribute("x2", toX - nx*coreRadius)
line.setAttribute("y2", toY - ny*coreRadius)
svg.appendChild(line)
})
}
window.addEventListener("load", drawNetwork)
window.addEventListener("resize", drawNetwork)
// AUTO AI SCANNING
function startAIScan(){
scanInterval = setInterval(()=>{
if(userHovering) return
const module = modules[currentIndex]
activateModule(module)
currentIndex++
if(currentIndex >= modules.length){
currentIndex = 0
}
},3500)
}
// USER INTERACTION
modules.forEach((module, index)=>{
module.addEventListener("mouseenter",()=>{
userHovering = true
activateModule(module)
// hide the dashed connection
svg.children[index].style.opacity = 0
})
module.addEventListener("mouseleave",()=>{
userHovering = false
// restore dashed connection
svg.children[index].style.opacity = .4
})

})
// start AI scan
startAIScan()
  
// ========================================
// LIVE CLAIM FLOW DEMO (SaaS PRODUCT FEEL)
// ========================================
const claimPacket = document.getElementById("claimPacket")
function sendAIPulse(fromElement, toElement){
const pulse = document.createElement("div")
pulse.className = "ai-pulse"
const container = document.querySelector(".ai-system")
container.appendChild(pulse)
const fromRect = fromElement.getBoundingClientRect()
const toRect = toElement.getBoundingClientRect()
const containerRect = container.getBoundingClientRect()
const fromX =
fromRect.left + fromRect.width/2 - containerRect.left
const fromY =
fromRect.top + fromRect.height/2 - containerRect.top
const toX =
toRect.left + toRect.width/2 - containerRect.left
const toY =
toRect.top + toRect.height/2 - containerRect.top
const dx = toX - fromX
const dy = toY - fromY
const distance = Math.sqrt(dx*dx + dy*dy)
const nx = dx / distance
const ny = dy / distance
const moduleRadius = fromRect.width/2
const coreRadius = toRect.width/2
const startX = fromX + nx * moduleRadius
const startY = fromY + ny * moduleRadius
const endX = toX - nx * coreRadius
const endY = toY - ny * coreRadius
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
const modulePositions = {
core: document.querySelector(".ai-core"),
intelligence: document.querySelector(".module-intelligence"),
denial: document.querySelector(".module-denial"),
workflow: document.querySelector(".module-workflow"),
recovery: document.querySelector(".module-recovery"),
performance: document.querySelector(".module-performance")
}
function moveClaim(target){
const x = target.offsetLeft + target.offsetWidth/2
const y = target.offsetTop - 40
claimPacket.style.left = x + "px"
claimPacket.style.top = y + "px"
modules.forEach(m => m.classList.remove("module-highlight"))
target.classList.add("module-highlight")
sendAIPulse(target, document.querySelector(".ai-core"))
}
function runClaimDemo(){
setTimeout(()=>{
moveClaim(modulePositions.intelligence)
claimPacket.innerText="Claim Submitted"
},1000)
setTimeout(()=>{
moveClaim(modulePositions.core)
claimPacket.innerText="Processing Claim"
},2500)
setTimeout(()=>{
moveClaim(modulePositions.denial)
claimPacket.innerText="Denial Risk Detected"
},4500)
setTimeout(()=>{
moveClaim(modulePositions.core)
claimPacket.innerText="Routing Claim"
},6500)
setTimeout(()=>{
moveClaim(modulePositions.workflow)
claimPacket.innerText="Claim Routed"
},8500)
setTimeout(()=>{
moveClaim(modulePositions.core)
claimPacket.innerText="Recovery Analysis"
},10500)
setTimeout(()=>{
moveClaim(modulePositions.recovery)
claimPacket.innerText="Appeal Submitted"
},12000)
setTimeout(()=>{
moveClaim(modulePositions.performance)
claimPacket.innerText="Payment Posted"
},14000)
}
// repeat loop
setInterval(runClaimDemo,18000)
runClaimDemo()

/* =========================================
REVENUE FLOW INTERACTION
========================================= */
const steps = document.querySelectorAll(".flow-step")
const observer = new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.style.opacity = 1
entry.target.style.transform = "translateY(0)"
}
})
},{threshold:.3})
steps.forEach(step=>{
step.style.opacity=0
step.style.transform="translateY(40px)"
step.style.transition="all .6s ease"
observer.observe(step)
})


})
