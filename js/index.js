document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// Production Optimized
// ======================================================

// ===============================
// 2. REVEAL ANIMATION
// ===============================
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => revealObserver.observe(el));

// ===============================
// 3. COUNTER ANIMATION
// ===============================
const counters = document.querySelectorAll(".counter");
function runCounters() {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const duration = 1500;
    const startTime = performance.now();
    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      counter.innerText = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    }
    requestAnimationFrame(updateCounter);
  });
}
if (counters.length > 0) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runCounters();
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });
  counterObserver.observe(document.querySelector(".stats"));
}

// ===============================
// 6. CONTACT STRIP REVEAL
// ===============================
const contactStrip = document.querySelector(".contact-strip");
if (contactStrip) {
  const contactObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      contactStrip.classList.add("visible");
    }
  }, { threshold: 0.3 });
  contactObserver.observe(contactStrip);
}

// ===============================
// 10. SERVICE CARD EXPAND
// ===============================
document.querySelectorAll(".toggle-btn").forEach(button => {
button.addEventListener("click", function(){
const card = this.closest(".service-card");
card.classList.toggle("expanded");
if(card.classList.contains("expanded")){
this.innerText = "Read Less ↑";
}
else{
this.innerText = "Read More →";
}
});
});
  
// ===============================
// NEW HERO
// ===============================
lucide.createIcons();

const nodes = document.querySelectorAll(".node");
const core = document.getElementById("core");
const svg = document.querySelector(".connections");
const revenue = document.getElementById("revenue");

const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// RANDOM START POSITIONS
nodes.forEach(n => {
  n.style.left = Math.random() * 80 + "%";
  n.style.top = Math.random() * 70 + "%";
});
nodes.forEach(n => {
  const depth = Math.ceil(Math.random() * 3);
  n.setAttribute("data-depth", depth);
});
function drawLine(x1,y1,x2,y2){
  const line = document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",x1);
  line.setAttribute("y1",y1);
  line.setAttribute("x2",x2);
  line.setAttribute("y2",y2);
  line.setAttribute("stroke","url(#lineGradient)");
  line.setAttribute("stroke-width","1.5");
  line.style.opacity = 0;
  svg.appendChild(line);
  setTimeout(()=> line.style.opacity = 1,100);
}
for(let i=0;i<nodes.length-1;i++){
  const a = nodes[i].getBoundingClientRect();
  const b = nodes[i+1].getBoundingClientRect();

  drawLine(a.left,a.top,b.left,b.top);
}
// MAIN STORY
function run(){

  // RESET
  revenue.innerHTML = "";
  svg.innerHTML = "";
  core.style.opacity = 0;

  nodes.forEach(n=>{
    n.style.color = "#fca5a5";
    n.querySelector(".leak").style.display = "block";
  });

  // PHASE 2 → CORE APPEARS
  setTimeout(()=>{
    core.style.opacity = 1;
  },2000);

  // PHASE 3 → ATTRACT + CONNECT
  setTimeout(()=>{
    nodes.forEach(n=>{
      const rect = n.getBoundingClientRect();
      n.style.transition = "all 1.5s ease";
      n.style.left = "50%";
      n.style.top = "50%";
      n.style.transform = "translate(-50%,-50%)";

      drawLine(rect.left, rect.top, center.x, center.y);
    });
  },3500);

  // PHASE 4 → FIX
  setTimeout(()=>{
    nodes.forEach(n=>{
      n.style.color = "#22c55e";
      n.querySelector(".leak").style.display = "none";
    });
  },5000);

  // PHASE 5 → REVENUE
  setTimeout(()=>{
    ["+$120","+ $340","+ $780","+ $1240"].forEach((v,i)=>{
      const el = document.createElement("div");
      el.className = "rev";
      el.innerText = v;
      el.style.animationDelay = i*0.2+"s";
      revenue.appendChild(el);
    });
  },6500);

}

run();
setInterval(run,9000);

  
}); // DOMContentLoaded close
