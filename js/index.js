document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;
  const TOP_SAFE = 110;
  const BOTTOM_SAFE = 140;

  let rect;

  function updateBounds() {
    rect = hero.getBoundingClientRect();
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const usableWidth = rect.width - SIDE_PADDING * 2;
    const usableHeight = rect.height - TOP_SAFE - BOTTOM_SAFE;

    const zoneW = usableWidth / cols;
    const zoneH = usableHeight / rows;

    const col = i % cols;
    const row = Math.floor(i / cols);

    n.baseX = -rect.width / 2 + SIDE_PADDING + zoneW * (col + 0.5);
    n.baseY = -rect.height / 2 + TOP_SAFE + zoneH * (row + 0.5);

    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.002 + Math.random() * 0.002;

    n.floatX = zoneW / 2 - NODE_W / 2 - 10;
    n.floatY = zoneH / 2 - NODE_H / 2 - 10;

    n.z = (Math.random() - 0.5) * 60;
  });

  function animate() {

    nodes.forEach(n => {

      n.angle += n.speed;

      let x = n.baseX + Math.cos(n.angle) * n.floatX;
      let y = n.baseY + Math.sin(n.angle) * n.floatY;

      const left = -rect.width / 2 + SIDE_PADDING + NODE_W / 2;
      const right = rect.width / 2 - SIDE_PADDING - NODE_W / 2;

      const top = -rect.height / 2 + TOP_SAFE + NODE_H / 2;
      const bottom = rect.height / 2 - BOTTOM_SAFE - NODE_H / 2;

      x = Math.max(left, Math.min(right, x));
      y = Math.max(top, Math.min(bottom, y));

      n.z += Math.sin(n.angle) * 0.1;
      n.z = Math.max(-40, Math.min(60, n.z));

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
