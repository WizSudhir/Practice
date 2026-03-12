/* CARD REVEAL */

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

/* FILTER SYSTEM */

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
/* =========================================
ORBIT DATA PARTICLES
========================================= */

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
p.style.transform = `rotate(${Math.random()*360}deg)`;
p.style.zIndex = Math.floor(Math.random()*5);
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

//////////////* DATA FLOW LINES *///////////

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
//////////////////////////////
// 3D PARALLAX HERO EFFECT
//////////////////////////////

const orbitSystem = document.querySelector(".orbit-system");

document.addEventListener("mousemove",(e)=>{

const x = (window.innerWidth/2 - e.clientX)/40;
const y = (window.innerHeight/2 - e.clientY)/40;

orbitSystem.style.transform =
`rotateY(${x}deg) rotateX(${y}deg)`;

});
////////////////////////////////////
// WEBGL HERO PARTICLE UNIVERSE
////////////////////////////////////

const universeContainer = document.getElementById("hero-universe");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({
alpha:true
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

universeContainer.appendChild(renderer.domElement);


/* create particles */

const particleCount = 200;
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


/* animation */

function animate(){

requestAnimationFrame(animate);

particles.rotation.y += 0.0008;
particles.rotation.x += 0.0003;

renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});
