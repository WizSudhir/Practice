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
function getNodeSize(n) {
  const r = n.getBoundingClientRect();
  return {
    w: r.width,
    h: r.height
  };
}

  // ✅ INITIAL GRID (ALWAYS VISIBLE)
  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const xSpacing = rect.width / (cols + 1);
    const usableHeight = rect.height - 140; // 🔥 key fix
const ySpacing = usableHeight / (rows + 1);

    n.x = (col + 1) * xSpacing - rect.width / 2;
    n.y = (row + 1) * ySpacing - usableHeight / 2;
    n.z = (Math.random() - 0.5) * 200;

 n.vx = (Math.random() - 0.5) * 0.4;
n.vy = (Math.random() - 0.5) * 0.4;
    n.vz = (Math.random() - 0.5) * 0.3;
  });
// AVOID COLLISION
function handleCollisions(nodes) {

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {

      const a = nodes[i];
      const b = nodes[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      // approximate radius based on size
      const sizeA = a.getBoundingClientRect().width / 2;
      const sizeB = b.getBoundingClientRect().width / 2;

      const minDist = sizeA + sizeB + 10; // spacing buffer

      if (distance < minDist) {

        const angle = Math.atan2(dy, dx);

        const overlap = (minDist - distance) / 2;

        const offsetX = Math.cos(angle) * overlap;
        const offsetY = Math.sin(angle) * overlap;

        // push apart
        a.x -= offsetX;
        a.y -= offsetY;

        b.x += offsetX;
        b.y += offsetY;

        // slight velocity bounce (natural feel)
a.vx += offsetX * 0.02;
a.vy += offsetY * 0.02;
b.vx -= offsetX * 0.02;
b.vy -= offsetY * 0.02;
      }
    }
  }
}

// Animate Function
  function animate() {

    nodes.forEach(n => {
handleCollisions(nodes);
      // MOVE
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // LIMIT DEPTH (NO DISAPPEAR)
      if (n.z > 200) n.z = 200;
      if (n.z < -150) n.z = -150;

      const scale = Math.max(0.9, 1 + n.z / 800);

      const size = getNodeSize(n);

      // ✅ TRUE SAFE BOUNDS (FIXED)
      const left = -rect.width / 2 + size.w / 2 + PADDING;
      const right = rect.width / 2 - size.w / 2 - PADDING;
const top = -rect.height / 2 + 60 + size.h / 2;      // avoid navbar + padding
const bottom = rect.height / 2 - 100 - size.h / 2;  // avoid hero text

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
