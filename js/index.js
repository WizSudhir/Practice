document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  // ✅ FIXED: correct container
  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const NODE_WIDTH = 160;
  const NODE_HEIGHT = 110;
  const PADDING = 20;

  let rect = {
    width: hero.offsetWidth,
    height: hero.offsetHeight
  };

  window.addEventListener("resize", () => {
    rect = {
      width: hero.offsetWidth,
      height: hero.offsetHeight
    };
  });

  // ✅ BETTER DISTRIBUTION (8 nodes balanced)
  nodes.forEach((n, i) => {

    const cols = 4;
    const spacingX = rect.width / (cols + 1);
    const spacingY = rect.height / 3;

    const col = i % cols;
    const row = Math.floor(i / cols);

    n.x = (col - 1.5) * spacingX * 0.7;
    n.y = (row - 0.8) * spacingY * 0.6;
    n.z = (Math.random() - 0.5) * 400;

    // ✅ faster, smoother motion
    n.vx = (Math.random() - 0.5) * 0.8;
    n.vy = (Math.random() - 0.5) * 0.8;
    n.vz = (Math.random() - 0.5) * 0.6;
  });

  function animate() {

    nodes.forEach(n => {

      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      const scale = 1 + n.z / 800;

      const dynamicWidth = NODE_WIDTH * scale;
      const dynamicHeight = NODE_HEIGHT * scale;

      const maxX = rect.width / 2 - dynamicWidth - PADDING;
      const maxY = rect.height / 2 - dynamicHeight - PADDING;
      const topLimit = -rect.height / 2 + PADDING;

      // ✅ bounce (no clamp = smooth motion)
      if (n.x > maxX || n.x < -maxX) n.vx *= -1;
      if (n.y > maxY || n.y < topLimit) n.vy *= -1;
      if (n.z > 400 || n.z < -400) n.vz *= -1;

      // ✅ FIX: prevent disappearing
      const opacityRaw = 0.5 + (n.z + 400) / 800;
      const opacity = Math.max(0.2, Math.min(1, opacityRaw));

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
