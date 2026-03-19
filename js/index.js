document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const PADDING = 30;

  let rect;

  function updateBounds() {
    rect = hero.getBoundingClientRect();
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  // ✅ GET REAL NODE SIZE (CRITICAL FIX)
  function getNodeSize(n, scale) {
    const r = n.getBoundingClientRect();
    return {
      w: r.width * scale,
      h: r.height * scale
    };
  }

  // ✅ INITIAL GRID (ALWAYS VISIBLE)
  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const xSpacing = rect.width / (cols + 1);
    const ySpacing = rect.height / (rows + 1);

    n.x = (col + 1) * xSpacing - rect.width / 2;
    n.y = (row + 1) * ySpacing - rect.height / 2;
    n.z = (Math.random() - 0.5) * 200;

    n.vx = (Math.random() - 0.5) * 0.6;
    n.vy = (Math.random() - 0.5) * 0.6;
    n.vz = (Math.random() - 0.5) * 0.3;
  });

  function animate() {

    nodes.forEach(n => {

      // MOVE
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // LIMIT DEPTH (NO DISAPPEAR)
      if (n.z > 200) n.z = 200;
      if (n.z < -150) n.z = -150;

      const scale = Math.max(0.75, 1 + n.z / 600);

      const size = getNodeSize(n, scale);

      // ✅ TRUE SAFE BOUNDS (FIXED)
      const left = -rect.width / 2 + size.w / 2 + PADDING;
      const right = rect.width / 2 - size.w / 2 - PADDING;
      const top = -rect.height / 2 + size.h / 2 + PADDING;
      const bottom = rect.height / 2 - size.h / 2 - PADDING;

      // HARD CLAMP + BOUNCE
      if (n.x > right) {
        n.x = right;
        n.vx *= -1;
      }
      if (n.x < left) {
        n.x = left;
        n.vx *= -1;
      }

      if (n.y > bottom) {
        n.y = bottom;
        n.vy *= -1;
      }
      if (n.y < top) {
        n.y = top;
        n.vy *= -1;
      }

      if (n.z === 200 || n.z === -150) {
        n.vz *= -1;
      }

      // ALWAYS VISIBLE
      n.style.opacity = 1;

      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
        translate(-50%, -50%)
        scale(${scale})
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();

});
