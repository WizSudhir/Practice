document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const PADDING = 40;

  let width, height;

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  // ✅ SAFE BOX (TRUE CENTER SYSTEM)
  function getLimits() {
    return {
      left: -width / 2 + PADDING,
      right: width / 2 - PADDING,
      top: -height / 2 + PADDING,
      bottom: height / 2 - PADDING
    };
  }

  // ✅ PERFECT GRID (ALL 8 ALWAYS VISIBLE)
  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const xSpacing = width / (cols + 1);
    const ySpacing = height / (rows + 1);

    n.x = (col + 1) * xSpacing - width / 2;
    n.y = (row + 1) * ySpacing - height / 2;

    n.z = (Math.random() - 0.5) * 200;

    // smoother controlled movement
    n.vx = (Math.random() - 0.5) * 0.5;
    n.vy = (Math.random() - 0.5) * 0.5;
    n.vz = (Math.random() - 0.5) * 0.3;
  });

  function animate() {

    const limits = getLimits();

    nodes.forEach(n => {

      // MOVE
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // ✅ HARD BOUNDS (PREVENT ESCAPE COMPLETELY)
      if (n.x > limits.right) {
        n.x = limits.right;
        n.vx *= -1;
      }

      if (n.x < limits.left) {
        n.x = limits.left;
        n.vx *= -1;
      }

      if (n.y > limits.bottom) {
        n.y = limits.bottom;
        n.vy *= -1;
      }

      if (n.y < limits.top) {
        n.y = limits.top;
        n.vy *= -1;
      }

      // DEPTH CONTROL (NO DISAPPEAR)
      if (n.z > 200) n.z = 200;
      if (n.z < -200) n.z = -200;

      const scale = 1 + n.z / 600; // softer depth

      // ALWAYS VISIBLE
      const opacity = 0.8;

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
