document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // SCROLL ANIMATION
  // ===============================
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));

  // ===============================
  // NAV ELEMENTS
  // ===============================
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navClose = document.querySelector(".nav-close");

  if (!navToggle || !navMenu) return;

  // ===============================
  // INITIAL ARIA
  // ===============================
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.setAttribute("aria-hidden", "true");

  // ===============================
  // FUNCTIONS
  // ===============================
  function openMenu() {
    navMenu.classList.add("active");
    document.body.classList.add("menu-open");

    navToggle.setAttribute("aria-expanded", "true");
    navMenu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");

    navToggle.setAttribute("aria-expanded", "false");
    navMenu.setAttribute("aria-hidden", "true");
  }

  // ===============================
  // EVENTS
  // ===============================
  navToggle.addEventListener("click", openMenu);

  if (navClose) {
    navClose.addEventListener("click", closeMenu);
  }

  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeMenu();
  });

});
