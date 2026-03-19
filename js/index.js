document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const PADDING = 30;
  const MAX_SPEED = 0.6;
  const MIN_SPEED = 0.15;

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

  // ✅ PERFECT GRID START (ALL 8 VISIBLE GUARANTEED)
  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const xSpacing = rect.width / (cols + 1);
    const ySpacing = (rect.height - 140) / (rows + 1);

    n.x = (col + 1) * xSpacing - rect.width / 2;
    n.y = (row + 1) * ySpacing - rect.height / 2 + 70;
    n.z = (Math.random() - 0.5) * 120;

    // ✅ consistent initial speed
    const angle = Math.random() * Math.PI * 2;
    n.vx = Math.cos(angle) * MIN_SPEED;
    n.vy = Math.sin(angle) * MIN_SPEED;
    n.vz = (Math.random() - 0.5) * 0.2;
  });

  // ✅ COLLISION = POSITION SEPARATION ONLY (NO VELOCITY CHAOS)
  function handleCollisions(nodes) {

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {

        const a = nodes[i];
        const b = nodes[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;

        const sizeA = a.offsetWidth / 2;
        const sizeB = b.offsetWidth / 2;

        const minDist = sizeA + sizeB + 10;

        if (dist < minDist) {

          const overlap = (minDist - dist) / 2;

          const nx = dx / dist;
          const ny = dy / dist;

          // ✅ ONLY separate position (NO velocity explosion)
          a.x -= nx * overlap;
          a.y -= ny * overlap;

          b.x += nx * overlap;
          b.y += ny * overlap;
        }
      }
    }
  }

  function animate() {

    handleCollisions(nodes);

    nodes.forEach(n => {

      // MOVE
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // ✅ VERY LIGHT CENTER BIAS (NOT GRAVITY)
      n.vx += (-n.x) * 0.0002;
      n.vy += (-n.y) * 0.0002;

      // ✅ DAMPING (smooth)
      n.vx *= 0.985;
      n.vy *= 0.985;

      // ✅ KEEP MINIMUM MOTION (prevents freezing)
      const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);

      if (speed < MIN_SPEED) {
        const angle = Math.random() * Math.PI * 2;
        n.vx = Math.cos(angle) * MIN_SPEED;
        n.vy = Math.sin(angle) * MIN_SPEED;
      }

      // LIMIT SPEED
      n.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, n.vx));
      n.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, n.vy));

      // DEPTH
      if (n.z > 120) n.z = 120;
      if (n.z < -80) n.z = -80;

      const scale = Math.max(0.95, 1 + n.z / 1000);

      const size = getNodeSize(n);

      const left = -rect.width / 2 + size.w / 2 + PADDING;
      const right = rect.width / 2 - size.w / 2 - PADDING;

      const top = -rect.height / 2 + 60 + size.h / 2;
      const bottom = rect.height / 2 - 100 - size.h / 2;

      // HARD CLAMP
      if (n.x < left) { n.x = left; n.vx *= -0.6; }
      if (n.x > right) { n.x = right; n.vx *= -0.6; }

      if (n.y < top) { n.y = top; n.vy *= -0.6; }
      if (n.y > bottom) { n.y = bottom; n.vy *= -0.6; }

      // RENDER
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
