document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const PADDING = 30;
  const MAX_SPEED = 0.8;

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

  // ✅ INITIAL GRID (ALWAYS VISIBLE)
  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const xSpacing = rect.width / (cols + 1);
    const usableHeight = rect.height - 140;
    const ySpacing = usableHeight / (rows + 1);

    n.x = (col + 1) * xSpacing - rect.width / 2;
    n.y = (row + 1) * ySpacing - rect.height / 2 + 70;
    n.z = (Math.random() - 0.5) * 150;

    n.vx = (Math.random() - 0.5) * 0.3;
    n.vy = (Math.random() - 0.5) * 0.3;
    n.vz = (Math.random() - 0.5) * 0.2;
  });

  // ✅ SOFT COLLISION (NO EXPLOSION)
  function handleCollisions(nodes) {

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {

        const a = nodes[i];
        const b = nodes[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const distance = Math.sqrt(dx * dx + dy * dy) || 0.01;

        const sizeA = a.offsetWidth / 2;
        const sizeB = b.offsetWidth / 2;

        const minDist = sizeA + sizeB + 12;

        if (distance < minDist) {

          const overlap = (minDist - distance);

          const nx = dx / distance;
          const ny = dy / distance;

          // ✅ SOFT PUSH (no spikes)
          const push = overlap * 0.02;

          a.vx -= nx * push;
          a.vy -= ny * push;
          b.vx += nx * push;
          b.vy += ny * push;
        }
      }
    }
  }

  function animate() {

    handleCollisions(nodes);

    nodes.forEach(n => {

      // ✅ CENTER GRAVITY (keeps nodes visible)
      n.vx += (-n.x) * 0.0008;
      n.vy += (-n.y) * 0.0008;

      // MOVE
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // ✅ VELOCITY DAMPING (SMOOTH)
      n.vx *= 0.96;
      n.vy *= 0.96;
      n.vz *= 0.98;

      // ✅ LIMIT SPEED (prevents chaos)
      n.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, n.vx));
      n.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, n.vy));

      // DEPTH
      if (n.z > 150) n.z = 150;
      if (n.z < -100) n.z = -100;

      const scale = Math.max(0.95, 1 + n.z / 1000);

      const size = getNodeSize(n);

      const left = -rect.width / 2 + size.w / 2 + PADDING;
      const right = rect.width / 2 - size.w / 2 - PADDING;

      const top = -rect.height / 2 + 60 + size.h / 2;
      const bottom = rect.height / 2 - 100 - size.h / 2;

      // ✅ HARD CLAMP AFTER ALL FORCES
      n.x = Math.max(left, Math.min(right, n.x));
      n.y = Math.max(top, Math.min(bottom, n.y));

      // slight bounce feel
      if (n.x === left || n.x === right) n.vx *= -0.5;
      if (n.y === top || n.y === bottom) n.vy *= -0.5;

      // VISUALS
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
