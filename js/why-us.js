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
// ===============================
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

// MODULE DATA LOGIC

function activateModule(module){

modules.forEach(m=>m.classList.remove("active"))

module.classList.add("active")
brain.classList.add("receiving")

const type = module.dataset.node

if(type === "intelligence"){

metric1.innerText = "3,842"
label1.innerText = "Claims Analyzed"

metric2.innerText = "14"
label2.innerText = "Payer Behavior Alerts"

metric3.innerText = "$12,500"
label3.innerText = "Revenue Opportunities"

}

if(type === "denial"){

metric1.innerText = "126"
label1.innerText = "Coding Issues Detected"

metric2.innerText = "41"
label2.innerText = "Denial Risks Prevented"

metric3.innerText = "$9,200"
label3.innerText = "Revenue Protected"

}

if(type === "workflow"){

metric1.innerText = "214"
label1.innerText = "Claims Routed"

metric2.innerText = "36"
label2.innerText = "Workflow Bottlenecks"

metric3.innerText = "$7,850"
label3.innerText = "Processing Efficiency"

}

if(type === "recovery"){

metric1.innerText = "87"
label1.innerText = "Denied Claims Reopened"

metric2.innerText = "53"
label2.innerText = "Successful Appeals"

metric3.innerText = "$18,450"
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

},3000)

}


// USER INTERACTION

modules.forEach((module)=>{

module.addEventListener("mouseenter",()=>{

userHovering = true

activateModule(module)

})

module.addEventListener("mouseleave",()=>{

userHovering = false

})

})


// start AI scan
startAIScan()
// ========================================
// LIVE CLAIM FLOW DEMO (SaaS PRODUCT FEEL)
// ========================================

const claimPacket = document.getElementById("claimPacket")

const modulePositions = {
intelligence: document.querySelector(".module-intelligence"),
denial: document.querySelector(".module-denial"),
workflow: document.querySelector(".module-workflow"),
recovery: document.querySelector(".module-recovery"),
performance: document.querySelector(".module-performance")
}

function moveClaim(target){

const rect = target.getBoundingClientRect()
const parent = document.querySelector(".ai-system").getBoundingClientRect()

const x = rect.left - parent.left + rect.width/2
const y = rect.top - parent.top + rect.height/2

claimPacket.style.left = x + "px"
claimPacket.style.top = y + "px"

modules.forEach(m => m.classList.remove("module-highlight"))

target.classList.add("module-highlight")

}

function runClaimDemo(){

setTimeout(()=>{
moveClaim(modulePositions.intelligence)
claimPacket.innerText="Claim Submitted"
},1000)

setTimeout(()=>{
moveClaim(modulePositions.denial)
claimPacket.innerText="Denial Risk Detected"
},4000)

setTimeout(()=>{
moveClaim(modulePositions.workflow)
claimPacket.innerText="Claim Routed"
},7000)

setTimeout(()=>{
moveClaim(modulePositions.recovery)
claimPacket.innerText="Appeal Submitted"
},10000)

setTimeout(()=>{
moveClaim(modulePositions.performance)
claimPacket.innerText="Payment Posted"
},13000)

}

// repeat loop
setInterval(runClaimDemo,15000)

runClaimDemo()
}) // increase revenue tokenslfklsejlkdsjlkjdslkjslkjsldkjdslkjflksdlkdsfjlksjdlfjlskdjflksjlfksdjlksdjlkdsjlkdsjflkjsdlkfjsdlkdfjlksjdlkflksf
