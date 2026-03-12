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
