document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg"); // FIXED
  const navbar = document.querySelector(".navbar");

  const nodes = document.querySelectorAll(".node");

  const NODE_WIDTH = 120;
  const NODE_HEIGHT = 80;
  const PADDING = 20;

  let rect = hero.getBoundingClientRect();
  let navHeight = navbar.offsetHeight;

  window.addEventListener("resize", () => {
    rect = hero.getBoundingClientRect();
    navHeight = navbar.offsetHeight;
  });

  // INITIAL POSITIONS (FIXED)
nodes.forEach((n, i) => {
  const cols = 3;
  const spacingX = rect.width / (cols + 1);
  const spacingY = rect.height / 4;
  const col = i % cols;
  const row = Math.floor(i / cols);

  n.x = (col - 1) * spacingX * 0.6;
  n.y = (row - 1.5) * spacingY * 0.5;
  n.z = (Math.random() - 0.5) * 400;

  n.vx = (Math.random() - 0.5) * 0.4;
  n.vy = (Math.random() - 0.5) * 0.4;
  n.vz = (Math.random() - 0.5) * 0.4;
});

  function animate() {

    nodes.forEach(n => {

      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      const scale = 1 + n.z / 800;

      const rectNode = n.getBoundingClientRect();
      const dynamicWidth = rectNode.width * scale;
      const dynamicHeight = rectNode.height * scale;
      const dynamicHeight = NODE_HEIGHT * scale;

      const maxX = rect.width / 2 - dynamicWidth - PADDING;
      const maxY = rect.height / 2 - dynamicHeight - PADDING;

      const topLimit = -rect.height / 2 + navHeight + PADDING;

      // HARD CLAMP
      if (n.x > maxX) n.x = maxX;
      if (n.x < -maxX) n.x = -maxX;

      if (n.y > maxY) n.y = maxY;
      if (n.y < topLimit) n.y = topLimit;

      // BOUNCE
      if (n.x === maxX || n.x === -maxX) n.vx *= -1;
      if (n.y === maxY || n.y === topLimit) n.vy *= -1;
      if (n.z > 400 || n.z < -400) n.vz *= -1;

      const opacity = 0.5 + (n.z + 400) / 800;

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
