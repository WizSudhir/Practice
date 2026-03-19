document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const NODE_WIDTH = 110;
  const NODE_HEIGHT = 80;
  const NAV_HEIGHT = 80;
  const PADDING = 20;

  let rect = hero.getBoundingClientRect();

  window.addEventListener("resize", () => {
    rect = hero.getBoundingClientRect();
  });

  // INITIAL POSITIONS
  nodes.forEach(n => {
    n.x = (Math.random() - 0.5) * rect.width * 0.7;
    n.y = (Math.random() - 0.5) * rect.height * 0.5;
    n.z = (Math.random() - 0.5) * 600;

    n.vx = (Math.random() - 0.5) * 0.5;
    n.vy = (Math.random() - 0.5) * 0.5;
    n.vz = (Math.random() - 0.5) * 0.5;
  });

  function animate() {

    nodes.forEach(n => {

      // MOVE
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // DEPTH SCALE
      const scale = 1 + n.z / 800;

      // DYNAMIC SIZE (important)
      const dynamicWidth = NODE_WIDTH * scale;
      const dynamicHeight = NODE_HEIGHT * scale;

      // BOUNDS
      const maxX = rect.width / 2 - dynamicWidth - PADDING;
      const maxY = rect.height / 2 - dynamicHeight - PADDING;
      const topLimit = -rect.height / 2 + NAV_HEIGHT + PADDING;

      // HARD CLAMP
      if (n.x > maxX) n.x = maxX;
      if (n.x < -maxX) n.x = -maxX;

      if (n.y > maxY) n.y = maxY;
      if (n.y < topLimit) n.y = topLimit;

      // BOUNCE
      if (n.x === maxX || n.x === -maxX) n.vx *= -1;
      if (n.y === maxY || n.y === topLimit) n.vy *= -1;
      if (n.z > 400 || n.z < -400) n.vz *= -1;

      // DEPTH OPACITY
      const opacity = 0.5 + (n.z + 400) / 800;

      // APPLY TRANSFORM
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
