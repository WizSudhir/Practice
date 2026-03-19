document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// Production Optimized
// ======================================================
// ===============================
// NEW HERO
// ===============================
lucide.createIcons();

const nodes = document.querySelectorAll(".node");
const core = document.getElementById("core");
const svg = document.querySelector(".connections");
const revenue = document.getElementById("revenue");

function getCenter(){
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
}

// controlled orbit motion
nodes.forEach((n, i) => {
  const angle = (i / nodes.length) * Math.PI * 2;
  const radius = 250 + Math.random() * 100;
  n.dataset.angle = angle;
  n.dataset.radius = radius;
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
// continuous 3D motion
function animate3D() {
  nodes.forEach(n => {
    let angle = parseFloat(n.dataset.angle);
    const radius = parseFloat(n.dataset.radius);

    angle += 0.002; // slow motion
    n.dataset.angle = angle;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = Math.sin(angle) * 200;

    n.style.transform = `
      translate3d(${x}px, ${y}px, ${z}px)
    `;
  });

  requestAnimationFrame(animate3D);
}
animate3D();

// MAIN STORY
function run(){

  const hero = document.querySelector(".hero-system");

  // CHAOS START
  hero.classList.add("chaos");

  revenue.innerHTML = "";
  svg.querySelectorAll("line").forEach(l => l.remove());
  core.style.opacity = 0;

  nodes.forEach(n=>{
    n.style.color = "#fca5a5";
  });

  // CORE APPEARS
  setTimeout(()=>{
    core.style.opacity = 1;
  },2000);

  // FIX MODE
  setTimeout(()=>{
    hero.classList.remove("chaos");

    nodes.forEach(n=>{
      n.style.color = "#22c55e";
    });

  },5000);

  // REVENUE
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
  const labels = n.querySelectorAll(".error-label");

  labels.forEach(label => {
    label.innerText = issues[n.dataset.type] || "Error";
  });
});
run();
setInterval(run,9000);

  
}); // DOMContentLoaded close
