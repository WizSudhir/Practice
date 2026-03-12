const cards = document.querySelectorAll('.org-card, .specialty-card');

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("show");
}

});

},{threshold:0.15});

cards.forEach(card=>{
observer.observe(card);
});
