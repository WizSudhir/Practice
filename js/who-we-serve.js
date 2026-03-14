// 1. CARD REVEAL //

const revealCards = document.querySelectorAll(
".org-card, .specialty-card"
);
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
},{threshold:.15});
revealCards.forEach(card=>observer.observe(card));

// 2. FILTER SYSTEM //

const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".specialty-card");
filterBtns.forEach(btn=>{
btn.addEventListener("click",()=>{
filterBtns.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
const filter = btn.dataset.filter;
cards.forEach(card=>{
if(filter==="all" || card.dataset.category===filter){
card.style.display="block";
}else{
card.style.display="none";
}
});
});
});

// 3. ORBIT DATA PARTICLES //

const container = document.querySelector(".particle-system");
const orbitRadii = [110,160,210]; // orbit1 orbit2 orbit3
function createParticle(){
const p = document.createElement("div");
p.classList.add("data-particle");
/* choose random orbit */
const orbit = orbitRadii[Math.floor(Math.random()*orbitRadii.length)];
p.style.setProperty("--orbit-radius", orbit + "px");
/* random speed */
const speed = Math.random()*12 + 10;
p.style.animationDuration = speed + "s";
/* random delay */
p.style.animationDelay = Math.random()*6 + "s";
/* start position */
p.style.top="50%";
p.style.left="50%";
p.style.zIndex = Math.floor(Math.random()*5);
const startAngle = Math.random()*360;
p.style.transform = `rotate(${startAngle}deg)`;
/* random color */
const colors = ["#6366f1","#3b82f6","#22c55e","#a78bfa"];
const color = colors[Math.floor(Math.random()*colors.length)];
p.style.background = color;
p.style.boxShadow = `
0 0 6px ${color},
0 0 12px ${color},
0 0 18px ${color}
`;
container.appendChild(p);
}
/* create many */
for(let i=0;i<25;i++){
createParticle();
}

// 4. DATA FLOW LINES //

const svg = document.querySelector(".data-lines");
const center = {x:210,y:210};
const nodes = [
{x:210,y:0},
{x:420,y:210},
{x:210,y:420},
{x:0,y:210},
{x:320,y:70},
{x:90,y:330}
];
nodes.forEach(n=>{
const line=document.createElementNS(
"http://www.w3.org/2000/svg",
"line"
);
line.setAttribute("x1",n.x);
line.setAttribute("y1",n.y);
line.setAttribute("x2",center.x);
line.setAttribute("y2",center.y);
svg.appendChild(line);

});

// 5. 3D PARALLAX HERO EFFECT //

const orbitSystem = document.querySelector(".orbit-system");
if(orbitSystem){
document.addEventListener("mousemove",(e)=>{
const x = (window.innerWidth/2 - e.clientX)/40;
const y = (window.innerHeight/2 - e.clientY)/40;
orbitSystem.style.transform =
`rotateY(${x}deg) rotateX(${y}deg)`;
});
}
// 6. WEBGL HERO PARTICLE UNIVERSE //

const universeContainer = document.getElementById("hero-universe");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,
window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z = 6;
const renderer = new THREE.WebGLRenderer({
alpha:true
});
renderer.setSize(
universeContainer.clientWidth,
universeContainer.clientHeight
);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
universeContainer.appendChild(renderer.domElement);
/* create particles */
const particleCount = window.innerWidth < 768 ? 120 : 220;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount*3);
for(let i=0;i<particleCount;i++){
positions[i*3] = (Math.random()-0.5)*20;
positions[i*3+1] = (Math.random()-0.5)*12;
positions[i*3+2] = (Math.random()-0.5)*10;
}
geometry.setAttribute(
"position",
new THREE.BufferAttribute(positions,3)
);
const material = new THREE.PointsMaterial({
color:0x6366f1,
size:.03,
transparent:true,
opacity:.8
});
const particles = new THREE.Points(geometry,material);
scene.add(particles);
const engine = document.querySelector(".orbit-core") || {getBoundingClientRect:()=>({left:0,top:0,width:0,height:0})};
// MOUSE GRAVITY TRACKING ///
let mouseX = 0;
let mouseY = 0;
let engineDistance = 999;
document.addEventListener("mousemove",(e)=>{
mouseX = (e.clientX/window.innerWidth - 0.5)*2;
mouseY = (e.clientY/window.innerHeight - 0.5)*2;
/* distance from engine */
const rect = engine.getBoundingClientRect();
const engineX = rect.left + rect.width/2;
const engineY = rect.top + rect.height/2;
const dx = e.clientX - engineX;
const dy = e.clientY - engineY;
engineDistance = Math.sqrt(dx*dx + dy*dy);
});
/* animation */
function animate(){
requestAnimationFrame(animate);
if(!universeContainer.offsetParent) return;
/* universe rotation */
particles.rotation.y += 0.0008;
particles.rotation.x += 0.0003;
/* cursor gravity */
particles.rotation.y += mouseX*0.0005;
particles.rotation.x += mouseY*0.0005;
/* engine gravity glow */
let glowStrength = Math.max(0, 1 - engineDistance/400);
material.opacity = 0.6 + glowStrength*0.8;
material.size = 0.03 + glowStrength*0.05;
material.color.setHSL(0.65,1,0.5 + glowStrength*0.3);
renderer.render(scene,camera);
}
animate();
window.addEventListener("resize",()=>{
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(
universeContainer.clientWidth,
universeContainer.clientHeight
);
});

// 7. LUCIDE ICONS //
lucide.createIcons();

// 8. ECOSYSTEM SCROLL ANIMATION //
const ecoSection = document.querySelector(".ecosystem-section");
const ecoNodes = document.querySelectorAll(".eco-node");
const ecoLines = document.querySelectorAll(".eco-lines line");
const ecoCore = document.querySelector(".eco-core");
let ecoTimers = [];
const ecoObserver = new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
activateEcosystem();
}else{
resetEcosystem();
}
});
},{threshold:0.25});
function resetEcosystem(){
ecoTimers.forEach(timer=>{
clearTimeout(timer);
clearInterval(timer);
});
ecoTimers=[];
ecoNodes.forEach(node=>{
node.classList.remove("active");
});
ecoLines.forEach(line=>{
line.classList.remove("active");
});
ecoCore.classList.remove("active");
}
if(ecoSection){
ecoObserver.observe(ecoSection);
}
function activateEcosystem(){
ecoNodes.forEach((node,index)=>{
const timer = setTimeout(()=>{
node.classList.add("active");
// create continuous stream
const interval = setInterval(()=>{
createDataFlow(node);
}, 400 + Math.random()*600);
ecoTimers.push(interval);
}, index*700);
ecoTimers.push(timer);
});
setTimeout(()=>{
ecoCore.classList.add("active");
}, ecoNodes.length*700);
}

