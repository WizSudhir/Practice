document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");

  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;

  // ✅ MATCH YOUR CSS EXACTLY
  const TOP_PADDING = 60;
  const BOTTOM_PADDING = 120;

  let width, height;

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    // ✅ TRUE USABLE AREA (FIX)
    const usableWidth = width - SIDE_PADDING * 2;
    const usableHeight = height - TOP_PADDING - BOTTOM_PADDING;

    const zoneW = usableWidth / cols;
    const zoneH = usableHeight / rows;

    const col = i % cols;
    const row = Math.floor(i / cols);

    // ✅ SHIFT INTO PADDED AREA (FIX)
    n.baseX = -width / 2 + SIDE_PADDING + zoneW * (col + 0.5);
    n.baseY = -height / 2 + TOP_PADDING + zoneH * (row + 0.5);

    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.002 + Math.random() * 0.002;

    // ✅ SAFE FLOAT RANGE
    n.floatX = Math.max(10, zoneW / 2 - NODE_W / 2 - 6);
    n.floatY = Math.max(10, zoneH / 2 - NODE_H / 2 - 6);

    n.z = (Math.random() - 0.5) * 40;
  });

  function animate() {

    nodes.forEach(n => {

      n.angle += n.speed;

      let x = n.baseX + Math.cos(n.angle) * n.floatX;
      let y = n.baseY + Math.sin(n.angle) * n.floatY;

      // ✅ HARD SAFE BOUNDS (FINAL FIX)
      const left = -width / 2 + SIDE_PADDING + NODE_W / 2;
      const right = width / 2 - SIDE_PADDING - NODE_W / 2;

      const top = -height / 2 + TOP_PADDING + NODE_H / 2;
      const bottom = height / 2 - BOTTOM_PADDING - NODE_H / 2;

      x = Math.max(left, Math.min(right, x));
      y = Math.max(top, Math.min(bottom, y));

      n.z += Math.sin(n.angle) * 0.03;
n.z = Math.max(0, Math.min(30, n.z));

      const scale = 1 + n.z / 300;
      const glowStrength = n.z / 40;

const glow = 10 + glowStrength * 30;
const opacity = 0.7 + glowStrength * 0.3;

if (!n.matches(':hover')) {
  n.style.opacity = opacity;
}

n.querySelector(".node-inner").style.boxShadow = `
  0 0 ${glow}px rgba(59,130,246,0.25),
  0 0 ${glow * 2}px rgba(139,92,246,0.15)
`;

      n.style.transform = `
        translate3d(${x}px, ${y}px, ${n.z}px)
        translate(-50%, -50%)
        scale(${scale})
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();

});
