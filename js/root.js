document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ELEMENTS
  // ===============================
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!navToggle || !navMenu) return;

  // ===============================
  // OVERLAY
  // ===============================
  const overlay = document.createElement("div");
  overlay.classList.add("nav-overlay");
  document.body.appendChild(overlay);

  // ===============================
  // INITIAL ARIA STATE
  // ===============================
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.setAttribute("aria-hidden", "true");

  // ===============================
  // FUNCTIONS
  // ===============================
  function openMenu() {
    navMenu.classList.add("active");
    navToggle.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");

    navToggle.setAttribute("aria-expanded", "true");
    navMenu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");

    navToggle.setAttribute("aria-expanded", "false");
    navMenu.setAttribute("aria-hidden", "true");
  }

  // ===============================
  // EVENTS
  // ===============================
  navToggle.addEventListener("click", () => {
    navMenu.classList.contains("active") ? closeMenu() : openMenu();
  });

  // Close on link click
  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Close on overlay click
  overlay.addEventListener("click", closeMenu);

  // Close on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeMenu();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

});
