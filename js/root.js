document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // THEME
  // ===============================
  const toggle = document.getElementById("theme-toggle");
const buttons = toggle.querySelectorAll(".theme-btn");

// Load saved or system preference
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.setAttribute("data-theme", prefersLight ? "light" : "dark");
}

// Set active state
function setActive(theme) {
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

setActive(document.documentElement.getAttribute("data-theme"));

// Click handler
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setActive(theme);
  });
});
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
