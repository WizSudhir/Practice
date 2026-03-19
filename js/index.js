document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".hero-system");
  const nodes = document.querySelectorAll(".node");

  const SIDE_PADDING = 40;
  const TOP_SAFE = 100;     // navbar + breathing space
  const BOTTOM_SAFE = 140;  // hero text area

  let rect;

  function updateBounds() {
    rect = hero.getBoundingClientRect();
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  // ✅ WAIT FOR LAYOUT TO STABILIZE (CRITICAL)
  requestAnimationFrame(() => {
    requestAnimationFrame(init);
  });

  function init() {

    nodes.forEach((n, i) => {

      const size = {
        w: n.offsetWidth,
        h: n.offsetHeight
      };

      const cols = 4;
      const rows = 2;

      const usableWidth = rect.width - SIDE_PADDING * 2;
      const usableHeight = rect.height - TOP_SAFE - BOTTOM_SAFE;

      const zoneW = usableWidth / cols;
      const zoneH = usableHeight / rows;

      const col = i % cols;
      const row = Math.floor(i / cols);

      // ✅ CENTER INSIDE SAFE ZONE
      const baseX =
        -rect.width / 2 +
        SIDE_PADDING +
        zoneW * (col + 0.5);

      const baseY =
        -rect.height / 2 +
        TOP_SAFE +
        zoneH * (row + 0.5);

      n.baseX = baseX;
      n.baseY = baseY;

      n.x = baseX;
      n.y = baseY;
      n.z = (Math.random() - 0.5) * 100;

      // smooth float
      n.angle = Math.random() * Math.PI * 2;
      n.speed = 0.004 + Math.random() * 0.004;

      // ✅ radius LIMITED BY ZONE SIZE (KEY FIX)
      n.floatRadiusX = Math.max(10, zoneW / 2 - size.w / 2 - 10);
      n.floatRadiusY = Math.max(10, zoneH / 2 - size.h / 2 - 10);
    });

    animate();
  }

  function animate() {

    nodes.forEach(n => {

      n.angle += n.speed;

      // ✅ ELLIPTICAL FLOAT (BETTER CONTROL)
      const offsetX = Math.cos(n.angle) * n.floatRadiusX;
      const offsetY = Math.sin(n.angle) * n.floatRadiusY;

      n.x = n.baseX + offsetX;
      n.y = n.baseY + offsetY;

      // depth
      n.z += Math.sin(n.angle) * 0.2;
      n.z = Math.max(-60, Math.min(100, n.z));

      const scale = 1 + n.z / 1000;

      n.style.opacity = 0.95;

      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
        translate(-50%, -50%)
        scale(${scale})
      `;
    });

    requestAnimationFrame(animate);
  }

});
