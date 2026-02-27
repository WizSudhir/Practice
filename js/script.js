/* =========================================================
   PRACTICEGRID SOLUTIONS
   ENTERPRISE JS ARCHITECTURE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. NAVBAR SCROLL EFFECT
  ===================================================== */

  const navbar = document.querySelector(".navbar");

  const handleNavbarScroll = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleNavbarScroll);



  /* =====================================================
     2. SCROLL REVEAL (Intersection Observer)
  ===================================================== */

  const revealElements = document.querySelectorAll(".reveal-up");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => revealObserver.observe(el));



  /* =====================================================
     3. STATS COUNTER ANIMATION
  ===================================================== */

  const counters = document.querySelectorAll(".stat-number");

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          const counter = entry.target;
          const target = +counter.dataset.target;
          const duration = 2000;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = value.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));



  /* =====================================================
     4. MOBILE NAV TOGGLE (Optional but Recommended)
  ===================================================== */

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }



  /* =====================================================
     5. SMOOTH ANCHOR SCROLL
  ===================================================== */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetID = this.getAttribute("href");

      if (targetID.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetID);

        targetElement?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        // Close mobile nav if open
        navMenu?.classList.remove("active");
      }
    });
  });



});
