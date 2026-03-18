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
const cards = document.querySelectorAll(".issue-card");
const revenueLayer = document.getElementById("revenueLayer");

// PROBLEM → SOLUTION MAP
const solutions = [
  "✓ Eligibility Verified",
  "✓ Authorization Approved",
  "✓ Coding Optimized",
  "✓ Denial Resolved",
  "✓ AR Follow-Up Completed",
  "✓ Appeal Submitted"
];

// REVENUE VALUES
const revenueValues = ["+$120", "+$340", "+$780", "+$1240", "+$1890"];

// MAIN LOOP
function runStory() {

  // RESET
  revenueLayer.innerHTML = "";

  cards.forEach((card, i) => {
    card.classList.remove("success");
    card.innerText = [
      "⚠ Eligibility Not Verified",
      "⚠ Missing Authorization",
      "⚠ Incorrect CPT Code",
      "⚠ Claim Denied",
      "⚠ No AR Follow-Up",
      "⚠ Appeal Pending"
    ][i];
  });

  // STEP 1 → CHAOS (visible already)

  setTimeout(() => {

    // STEP 2 → FIX
    cards.forEach((card, i) => {
      card.classList.add("success");
      card.innerText = solutions[i];
    });

  }, 2500);

  setTimeout(() => {

    // STEP 3 → REVENUE STACK
    revenueLayer.innerHTML = "";

    revenueValues.forEach((val, i) => {
      const el = document.createElement("div");
      el.classList.add("revenue-item");
      el.innerText = val;
      el.style.animationDelay = i * 0.25 + "s";
      revenueLayer.appendChild(el);
    });

  }, 4500);

}

// LOOP
runStory();
setInterval(runStory, 8000);

}); // DOMContentLoaded close
