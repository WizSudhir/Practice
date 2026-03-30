document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
       }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => {
    observer.observe(section);
  });
  // ===============================
  // LIGHT/DARK THEME
  // ===============================  
  window.toggleTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "light") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
};
// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
}
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
