document.addEventListener("DOMContentLoaded",()=>{

const toggle=document.querySelector(".nav-toggle");
const menu=document.querySelector(".nav-menu");
toggle?.addEventListener("click",()=>menu.classList.toggle("active"));

const counters=document.querySelectorAll(".stat-number");
const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
let el=entry.target;
let target=+el.dataset.target;
let count=0;
let step=target/100;
let interval=setInterval(()=>{
count+=step;
if(count>=target){el.textContent=target;clearInterval(interval);}
else{el.textContent=Math.floor(count);}
},20);
observer.unobserve(el);
}
});
});
counters.forEach(c=>observer.observe(c));

document.getElementById("contactForm")?.addEventListener("submit",e=>{
if(document.getElementById("captcha").value!=7){
e.preventDefault();
alert("Captcha incorrect");
}
});

});
