document.addEventListener("DOMContentLoaded", () => {
// ======================================================
// PRACTICEGRID SOLUTIONS - GLOBAL JS ARCHITECTURE
// Production Optimized
// ======================================================
  lucide.createIcons();
// ===============================
// HERO
// ===============================

  const nodes = document.querySelectorAll(".node");

  // INITIAL RANDOM POSITIONS
  nodes.forEach(n => {
    n.x = (Math.random() - 0.5) * window.innerWidth;
    n.y = (Math.random() - 0.5) * window.innerHeight;
    n.z = (Math.random() - 0.5) * 800;

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
      if (n.x > 400 || n.x < -400) n.vx *= -1;
      if (n.y > 300 || n.y < -300) n.vy *= -1;
      if (n.z > 400 || n.z < -400) n.vz *= -1;

      // APPLY 3D TRANSFORM
      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();

});
