document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// ======================================================

// ===============================
// 1. HEADER SCROLL EFFECT
// ===============================
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }
});

// ===============================
// 2. Mobile navigation bar
// ===============================
// MOBILE MENU TOGGLE LOGIC
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
   navMenu.classList.toggle('active');
   navToggle.classList.toggle('active');
   document.body.classList.toggle("menu-open");
    // Optional: Animate the hamburger spans to an 'X'
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('open'));
  });
}
// Close menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});
// Close menu when clicking outside
document.addEventListener("click",(e)=>{
  if(
    navMenu.classList.contains("active") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ){
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  }
})
// Close menu if screen becomes desktop size
window.addEventListener("resize",()=>{
  if(window.innerWidth > 992){
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  }
})
}); // DOMContentLoaded close
