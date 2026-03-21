document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// ======================================================

// ===============================
// MOBILE NAV
// ===============================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Create overlay dynamically
const overlay = document.createElement("div");
overlay.classList.add("nav-overlay");
document.body.appendChild(overlay);

function openMenu() {
  navMenu.classList.add("active");
  navToggle.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("menu-open");
}

navToggle?.addEventListener("click", () => {
  navMenu.classList.contains("active") ? closeMenu() : openMenu();
});

// Close on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on overlay click
overlay.addEventListener("click", closeMenu);

// Resize fix
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) closeMenu();
});

}); // DOMContentLoaded close
