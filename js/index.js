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
const nodes = document.querySelectorAll(".node");
const links = document.querySelectorAll(".link");
const stack = document.getElementById("revenueStack");

const revenueValues = ["+$120", "+$340", "+$780", "+$1240", "+$1890"];

function runStory() {

  // RESET → CHAOS
  nodes.forEach(n => {
    n.style.background = "rgba(239,68,68,0.8)";
    n.style.boxShadow = "0 0 10px rgba(239,68,68,0.7)";
  });

  links.forEach(l => {
    l.style.stroke = "rgba(239,68,68,0.3)";
    l.style.opacity = 0.3;
  });

  stack.innerHTML = "";

  // STEP 2 → CONNECT SYSTEM
  setTimeout(() => {

    nodes.forEach(n => {
      n.style.background = "#22c55e";
      n.style.boxShadow = "0 0 12px rgba(34,197,94,0.8)";
    });

    links.forEach(l => {
      l.style.stroke = "#22c55e";
      l.style.opacity = 0.8;
    });

  }, 2500);

  // STEP 3 → FLOW + STACK
  setTimeout(() => {

    revenueValues.forEach((val, i) => {
      const el = document.createElement("div");
      el.classList.add("revenue-item");
      el.innerText = val;
      el.style.animationDelay = i * 0.2 + "s";
      stack.appendChild(el);
    });

  }, 4500);
}

// LOOP
runStory();
setInterval(runStory, 8000);
}); // DOMContentLoaded close
