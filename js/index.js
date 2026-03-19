document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// Production Optimized
// ======================================================
lucide.createIcons();
// ===============================
// HERO
// ===============================
const hero = document.querySelector(".hero-system");
const nodes = document.querySelectorAll(".node");
// INITIAL RANDOM POSITIONS
nodes.forEach(n => {
const rect = hero.getBoundingClientRect();
n.x = (Math.random() - 0.5) * rect.width * 0.8;
n.y = (Math.random() - 0.5) * rect.height * 0.6;
n.z = (Math.random() - 0.5) * 600;

n.vx = (Math.random() - 0.5) * 0.6;
n.vy = (Math.random() - 0.5) * 0.6;
n.vz = (Math.random() - 0.5) * 0.6;
});
function animate() {
nodes.forEach(n => {
// MOVE
n.x += n.vx;
n.y += n.vy;
n.z += n.vz;
// BOUNDARY RESET (chaotic bounce feel)
const maxX = rect.width / 2 - 80;
const maxY = rect.height / 2 - 120;
if (n.x > maxX || n.x < -maxX) n.vx *= -1;
if (n.y > maxY || n.y < -maxY) n.vy *= -1;
if (n.z > 400 || n.z < -400) n.vz *= -1;

const NAV_HEIGHT = 80;
if (n.y < -maxY + NAV_HEIGHT) {
  n.vy = Math.abs(n.vy);
}
// APPLY 3D TRANSFORM
const scale = 1 + n.z / 800;   // depth scaling
const opacity = 0.5 + (n.z + 400) / 800; // depth fade
const centerX = rect.width / 2;
const centerY = rect.height / 2;
n.style.transform = `
  translate3d(${n.x}px, ${n.y}px, ${n.z}px)
  translate(-50%, -50%)
  scale(${scale})
`;
n.style.opacity = opacity;
});
requestAnimationFrame(animate);
}
animate();
});
