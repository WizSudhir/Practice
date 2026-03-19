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
svg.querySelectorAll("line").forEach(l => l.remove());
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
const currentLeft = n.offsetLeft;
const currentTop = n.offsetTop;

const dx = (center.x - currentLeft) * 0.2;
const dy = (center.y - currentTop) * 0.2;

n.style.transform = `translate(${dx}px, ${dy}px)`;

const parentRect = svg.getBoundingClientRect();

const x1 = rect.left - parentRect.left + rect.width / 2;
const y1 = rect.top - parentRect.top + rect.height / 2;

drawLine(x1, y1, center.x, center.y);
    });
  },3500);
// CONNECT NODES TO EACH OTHER
for(let i=0;i<nodes.length;i++){
  for(let j=i+1;j<nodes.length;j++){
    const a = nodes[i].getBoundingClientRect();
    const b = nodes[j].getBoundingClientRect();

    const parentRect = svg.getBoundingClientRect();

    const x1 = a.left - parentRect.left + a.width/2;
    const y1 = a.top - parentRect.top + a.height/2;
    const x2 = b.left - parentRect.left + b.width/2;
    const y2 = b.top - parentRect.top + b.height/2;

    drawLine(x1,y1,x2,y2);
  }
}
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
const issues = {
  eligibility: "Not Verified",
  authorization: "Auth Missing",
  coding: "Incorrect CPT",
  claims: "Rejected",
  ar: "No Follow-Up",
  payment: "Underpaid"
};

nodes.forEach(n => {
  const label = n.querySelector(".error-label");
  if(label){
    label.innerText = issues[n.dataset.type];
  }
});
n.querySelector(".error-label").innerText = "Resolved ✓";
run();
setInterval(run,9000);

  
}); // DOMContentLoaded close
