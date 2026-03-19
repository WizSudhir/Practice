document.addEventListener("DOMContentLoaded", () => {
lucide.createIcons();
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// Production Optimized
// ======================================================

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  let rect = hero.getBoundingClientRect();

  window.addEventListener("resize", () => {
    rect = hero.getBoundingClientRect();
  });

  // INITIAL POSITIONS
  nodes.forEach(n => {
    n.x = (Math.random() - 0.5) * rect.width * 0.8;
    n.y = (Math.random() - 0.5) * rect.height * 0.6;
    n.z = (Math.random() - 0.5) * 600;

    n.vx = (Math.random() - 0.5) * 0.6;
    n.vy = (Math.random() - 0.5) * 0.6;
    n.vz = (Math.random() - 0.5) * 0.6;
  });

  function animate() {

    const maxX = rect.width / 2 - 80;
    const maxY = rect.height / 2 - 120;
    const NAV_HEIGHT = 80;

    nodes.forEach(n => {

      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      if (n.x > maxX || n.x < -maxX) n.vx *= -1;
      if (n.y > maxY || n.y < -maxY) n.vy *= -1;
      if (n.z > 400 || n.z < -400) n.vz *= -1;

// prevent navbar overlap
const topLimit = -rect.height / 2 + NAV_HEIGHT;

if (n.y < topLimit) {
  n.y = topLimit;
  n.vy *= -1;
}

      const scale = 1 + n.z / 800;
      const opacity = 0.5 + (n.z + 400) / 800;

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
