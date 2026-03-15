// ===============================
// Hero Scroll Story
// ===============================
const hero = document.querySelector(".pg-hero");
const stages = document.querySelectorAll(".pg-stage");
function updateHeroStages(){
if(!hero) return;
const heroTop = hero.offsetTop;
const heroHeight = hero.offsetHeight;
const scrollPosition = window.scrollY + window.innerHeight/2;
let progress = (scrollPosition - heroTop) / heroHeight;
progress = Math.max(0, Math.min(1, progress));
const stageIndex = Math.round(progress * (stages.length - 1));
stages.forEach((stage, index)=>{
stage.classList.remove("active");
if(index === stageIndex){
stage.classList.add("active");
// TRIGGER ANIMATIONS WHEN STAGE APPEARS
if(stage.classList.contains("stage-cta")){
startRevenueCounter();
}else{
resetRevenue();
}
}
});
}
//===============================
// ONE Scroll Listener (better)
// ===============================

window.addEventListener("scroll", () => {
updateNav();
updateHeroStages();
});

// ===============================
// ROI Calculator
// ===============================

function calculateRevenue(){
let claims = Number(document.getElementById("claims").value) || 0;
let reimbursement = Number(document.getElementById("reimbursement").value) || 0;
let denial = Number(document.getElementById("denial").value) || 0;
let monthlyRevenue = claims * reimbursement;
let monthlyLoss = monthlyRevenue * (denial / 100);
let yearlyLoss = monthlyLoss * 12;
let dailyLoss = monthlyLoss / 30;
animateValue("roiResult", yearlyLoss);
animateValue("monthlyLoss", monthlyLoss);
animateValue("dailyLoss", dailyLoss);
}

function animateValue(id,value){
let element = document.getElementById(id);
let start = 0;
let duration = 1800;
let step = value / 40;
let interval = setInterval(()=>{
start += step;
if(start >= value){
start = value;
clearInterval(interval);
}
element.innerText = "$" + Math.floor(start).toLocaleString();
element.classList.add("animate");
setTimeout(()=>{
element.classList.remove("animate");
},400);
}, duration/40);
}
// ===============================
// Hero Revenue Counter
// ===============================

function startRevenueCounter(){
if(revenueAnimating) return;
revenueAnimating = true;
const counter = document.getElementById("revenueCounter");
const target = 2450000;
const duration = 2000;
const startTime = performance.now();
function animate(time){
const progress = Math.min((time - startTime) / duration, 1);
const value = Math.floor(progress * target);
counter.innerText = "$" + value.toLocaleString();
if(progress < 1){
requestAnimationFrame(animate);
}else{
revenueAnimating = false;
}
}
requestAnimationFrame(animate);
}
function resetRevenue(){
revenueAnimating = false;
document.getElementById("revenueCounter").innerText = "$0";
}
// ===============================
// Lucide Icons
// ===============================
lucide.createIcons();

// ===============================
// Update Hero Stages
// ===============================

window.addEventListener("load", () => {
updateHeroStages();
});
/* =====================================
STICKY NAV ACTIVE HIGHLIGHT
===================================== */

const sections = document.querySelectorAll(".rcm-phase");
const navLinks = document.querySelectorAll(".services-nav a");
function updateNav(){
let current = "";
sections.forEach(section=>{
const rect = section.getBoundingClientRect();
if(rect.top <= 150 && rect.bottom >= 150){
current = section.id;
}
});
navLinks.forEach(link=>{
link.classList.remove("active");
if(link.getAttribute("href") === "#" + current){
link.classList.add("active");
}
});
}
/* =====================================
PHASE PROGRESS BAR
===================================== */

const progressBar = document.querySelector(".phase-progress");
const servicesSection = document.querySelector(".rcm-services");
window.addEventListener("scroll", () => {
if(!progressBar || !servicesSection) return;
const sectionTop = servicesSection.offsetTop;
const sectionHeight = servicesSection.offsetHeight;
const scroll = window.scrollY - sectionTop;
let progress = (scroll / sectionHeight) * 100;
progress = Math.max(0, Math.min(progress,100));
progressBar.style.height = progress + "%";
});

/* =====================================
SCROLL REVEAL ANIMATION
===================================== */
const revealElements = document.querySelectorAll(".reveal");
function revealOnScroll(){
const trigger = window.innerHeight * 0.85;
revealElements.forEach(el => {
const top = el.getBoundingClientRect().top;
if(top < trigger){
el.classList.add("active");
}
});
}
if(window.innerWidth > 768){
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
}

/* =====================================
Scroll Reveal Animation - Infrastructure
===================================== */
const cards = document.querySelectorAll(".rcm-card");
const observer = new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}else{
setTimeout(()=>{
entry.target.classList.remove("show");
},200);
}
});
},{
threshold:0.35
});
if(window.innerWidth > 768){
cards.forEach(card => observer.observe(card));
}
