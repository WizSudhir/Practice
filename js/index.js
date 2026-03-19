document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const navbar = document.querySelector(".navbar");
  const nodes = document.querySelectorAll(".node");

  const NODE_WIDTH = 150;
  const NODE_HEIGHT = 100;

  const PADDING = 30;

  let rect, navHeight;

  function updateBounds() {
    rect = {
      width: hero.offsetWidth,
      height: hero.offsetHeight
    };
    navHeight = navbar.offsetHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  // ✅ SAFE ZONE (THIS IS THE KEY FIX)
  function getLimits(scale) {
    const w = NODE_WIDTH * scale;
    const h = NODE_HEIGHT * scale;

    return {
      left: -rect.width / 2 + w / 2 + PADDING,
      right: rect.width / 2 - w / 2 - PADDING,
      top: -rect.height / 2 + navHeight + h / 2 + PADDING,
      bottom: rect.height / 2 - h / 2 - PADDING
    };
  }

  // ✅ INITIAL POSITIONS (ALL VISIBLE GUARANTEED)
  nodes.forEach((n, i) => {

    const cols = 4;
    const spacingX = rect.width / (cols + 1);
    const spacingY = rect.height / 3;

    const col = i % cols;
    const row = Math.floor(i / cols);

    n.x = (col - 1.5) * spacingX * 0.6;
    n.y = (row - 0.5) * spacingY * 0.5;
    n.z = (Math.random() - 0.5) * 300;

    n.vx = (Math.random() - 0.5) * 0.6;
    n.vy = (Math.random() - 0.5) * 0.6;
    n.vz = (Math.random() - 0.5) * 0.4;
  });

  function animate() {

    nodes.forEach(n => {

      // MOVE
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // ✅ CLAMP DEPTH (PREVENT DISAPPEAR)
      if (n.z > 300) n.z = 300;
      if (n.z < -300) n.z = -300;

      const scale = Math.max(0.6, 1 + n.z / 800);

      const limits = getLimits(scale);

      // ✅ HARD POSITION CLAMP (NOT JUST BOUNCE)
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

      // DEPTH BOUNCE
      if (n.z === 300 || n.z === -300) {
        n.vz *= -1;
      }

      // ✅ SAFE OPACITY
      const opacity = Math.max(0.4, Math.min(1, 0.6 + (n.z + 300) / 600));

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
