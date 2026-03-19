document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  // ✅ FIXED: correct coordinate system
  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");

  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;
  const TOP_SAFE = 60;
  const BOTTOM_SAFE = 120;

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

    const usableWidth = width - SIDE_PADDING * 2;
    const usableHeight = height - TOP_SAFE - BOTTOM_SAFE;

    const zoneW = usableWidth / cols;
    const zoneH = usableHeight / rows;

    const col = i % cols;
    const row = Math.floor(i / cols);

    n.baseX = -width / 2 + SIDE_PADDING + zoneW * (col + 0.5);
    n.baseY = -height / 2 + TOP_SAFE + zoneH * (row + 0.5);

    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.002 + Math.random() * 0.002;

    n.floatX = zoneW / 2 - NODE_W / 2 - 6;
    n.floatY = zoneH / 2 - NODE_H / 2 - 6;

    n.z = (Math.random() - 0.5) * 50;
  });

  function animate() {

    nodes.forEach(n => {

      n.angle += n.speed;

      let x = n.baseX + Math.cos(n.angle) * n.floatX;
      let y = n.baseY + Math.sin(n.angle) * n.floatY;

      // ✅ TRUE SAFE LIMITS (NOW CORRECT)
      const left = -width / 2 + SIDE_PADDING + NODE_W / 2;
      const right = width / 2 - SIDE_PADDING - NODE_W / 2;

      const top = -height / 2 + TOP_SAFE + NODE_H / 2;
      const bottom = height / 2 - BOTTOM_SAFE - NODE_H / 2;

      x = Math.max(left, Math.min(right, x));
      y = Math.max(top, Math.min(bottom, y));

      n.z += Math.sin(n.angle) * 0.08;
      n.z = Math.max(-40, Math.min(50, n.z));

      const scale = 1 + n.z / 1000;

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
