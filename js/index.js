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
const stages = document.querySelectorAll(".stage");
const statusText = document.querySelector(".pipeline-status");

let step = 0;

function simulatePipeline() {

  stages.forEach(s => s.classList.remove("active"));

  let current = stages[step];
  current.classList.add("active");

  // Update header status
  statusText.innerText = "Analyzing " + current.dataset.stage + "...";

  // Denial logic
  if (current.dataset.stage === "denial") {

    current.querySelector(".status").innerText = "Issue Detected ⚠";
    current.querySelector(".meta").innerText = "Missing modifier";

    setTimeout(() => {
      current.classList.remove("warning");

      current.querySelector(".status").innerText = "Resolved ✓";
      current.querySelector(".status").className = "status success";
      current.querySelector(".meta").innerText = "Resubmitted successfully";

    }, 1500);
  }

  // Payment logic
  if (current.dataset.stage === "payment") {
    current.querySelector(".status").innerText = "Payment Released 💰";
    current.querySelector(".status").className = "status success";
    current.querySelector(".meta").innerText = "Revenue collected";
  }

  step = (step + 1) % stages.length;
}

// Run simulation
setInterval(simulatePipeline, 2000);

}); // DOMContentLoaded close
