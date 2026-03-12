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
p.style.transform = `rotate(${Math.random()*360}deg)`;
}
