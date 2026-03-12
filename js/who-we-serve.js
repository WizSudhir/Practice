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

const particleContainer = document.querySelector(".particle-system");

function createParticle(){

const particle = document.createElement("div");
particle.classList.add("data-particle");

/* random orbit size */

const orbit = Math.random()*120 + 120;

/* random speed */

const speed = Math.random()*10 + 8;

particle.style.animationDuration = speed + "s";

/* random delay */

particle.style.animationDelay = Math.random()*5 + "s";

/* random position */

particle.style.top = "50%";
particle.style.left = "50%";

particle.style.transform =
`rotate(${Math.random()*360}deg) translateX(${orbit}px)`;

particleContainer.appendChild(particle);

}

/* create many particles */

for(let i=0;i<20;i++){
createParticle();
}
