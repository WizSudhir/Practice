document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

// ===============================
// MOBILE NAV
// ===============================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Create overlay dynamically
const overlay = document.createElement("div");
overlay.classList.add("nav-overlay");
document.body.appendChild(overlay);

// 🔥 SET INITIAL ARIA STATE
navToggle?.setAttribute("aria-expanded", "false");
navMenu?.setAttribute("aria-hidden", "true");

function openMenu() {
  navMenu.classList.add("active");
  navToggle.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("menu-open");

  // 🔥 ARIA OPEN STATE
  navToggle.setAttribute("aria-expanded", "true");
  navMenu.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("menu-open");

  // 🔥 ARIA CLOSED STATE
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.setAttribute("aria-hidden", "true");
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
