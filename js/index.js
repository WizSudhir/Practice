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
const chaosContainer = document.querySelector(".chaos-container");
const gridContainer = document.querySelector(".grid-container");
const stackContainer = document.querySelector(".revenue-stack");

// CREATE CHAOS DOTS
for (let i = 0; i < 25; i++) {
  let dot = document.createElement("div");
  dot.classList.add("chaos-dot");
  dot.style.top = Math.random() * 100 + "%";
  dot.style.left = Math.random() * 100 + "%";
  chaosContainer.appendChild(dot);
}

// CREATE GRID
for (let i = 0; i < 40; i++) {
  let cell = document.createElement("div");
  cell.classList.add("grid-cell");
  gridContainer.appendChild(cell);
}

// REVENUE STACK VALUES
const values = ["+$120", "+$340", "+$560", "+$890", "+$1240"];

// LOOP SYSTEM
function runCycle() {

  // PHASE 1: CHAOS
  chaosContainer.style.opacity = 1;
  gridContainer.style.opacity = 0;
  stackContainer.innerHTML = "";

  setTimeout(() => {

    // PHASE 2: CONTROL
    chaosContainer.style.opacity = 0.2;
    gridContainer.style.opacity = 1;

  }, 2500);

  setTimeout(() => {

    // PHASE 3: STACKING
    stackContainer.innerHTML = "";

    values.forEach((val, i) => {
      let item = document.createElement("div");
      item.classList.add("stack-item");
      item.innerText = val;
      item.style.animationDelay = i * 0.3 + "s";
      stackContainer.appendChild(item);
    });

  }, 4500);

}

// LOOP EVERY 8s
runCycle();
setInterval(runCycle, 8000);

}); // DOMContentLoaded close
