document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const PADDING = 40;

  let rect;

  function updateBounds() {
    rect = hero.getBoundingClientRect();
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  function getNodeSize(n) {
    return {
      w: n.offsetWidth,
      h: n.offsetHeight
    };
  }

  // ✅ CREATE FIXED ZONES (NO OVERLAP GUARANTEED)
  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const zoneWidth = rect.width / cols;
    const zoneHeight = (rect.height - 140) / rows;

    const centerX = (col + 0.5) * zoneWidth - rect.width / 2;
    const centerY = (row + 0.5) * zoneHeight - rect.height / 2 + 70;

    n.baseX = centerX;
    n.baseY = centerY;

    n.x = centerX;
    n.y = centerY;
    n.z = (Math.random() - 0.5) * 120;

    // smooth floating offsets
    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.005 + Math.random() * 0.005;

    n.floatRadius = 20 + Math.random() * 20;
  });

  function animate() {

    nodes.forEach(n => {

      // ✅ SMOOTH FLOATING MOTION (NO CHAOS)
      n.angle += n.speed;

      const offsetX = Math.cos(n.angle) * n.floatRadius;
      const offsetY = Math.sin(n.angle) * n.floatRadius;

      n.x = n.baseX + offsetX;
      n.y = n.baseY + offsetY;

      // DEPTH (visual only)
      n.z += (Math.sin(n.angle) * 0.3);

      if (n.z > 120) n.z = 120;
      if (n.z < -80) n.z = -80;

      const scale = Math.max(0.95, 1 + n.z / 1000);

      const size = getNodeSize(n);

      // SAFE BOUNDS (never break layout)
      const left = -rect.width / 2 + size.w / 2 + PADDING;
      const right = rect.width / 2 - size.w / 2 - PADDING;

      const top = -rect.height / 2 + 60 + size.h / 2;
      const bottom = rect.height / 2 - 100 - size.h / 2;

      // clamp (safety)
      n.x = Math.max(left, Math.min(right, n.x));
      n.y = Math.max(top, Math.min(bottom, n.y));

      n.style.opacity = 0.95;

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
