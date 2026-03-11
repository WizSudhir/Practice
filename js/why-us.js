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
// • Flowing revenue particles
// ===============================
const canvas = document.getElementById("revenueFlow");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = 200;

let particles = [];

class Particle{

constructor(){

this.x = Math.random()*canvas.width;
this.y = Math.random()*canvas.height;

this.speed = 1 + Math.random()*2;

this.radius = 3;

}

update(){

this.x += this.speed;

if(this.x > canvas.width){

this.x = 0;

}

}

draw(){

ctx.beginPath();
ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);

ctx.fillStyle = "#22c55e";

ctx.fill();

}

}

for(let i=0;i<80;i++){

particles.push(new Particle());

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{

p.update();
p.draw();

});

requestAnimationFrame(animate);

}

animate();
// ===============================
// Leak Effect
// ===============================
const leaks = document.querySelectorAll(".leak");

let leaking = true;

function leakAnimation(){

if(!leaking) return;

leaks.forEach(leak=>{

const drop = document.createElement("div");

drop.className = "money-drop";

leak.appendChild(drop);

setTimeout(()=>{

drop.remove();

},2000);

});

}

setInterval(leakAnimation,500);
// ===============================
// PracticeGrid Fixing the Leaks
// ===============================
window.addEventListener("scroll",()=>{

const scroll = window.scrollY;

if(scroll > 200){

leaking = false;

document.querySelector(".fix-banner").classList.add("active");

}

});
