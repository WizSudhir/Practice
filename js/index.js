document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");

  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;
  const TOP_PADDING = 60;
  const BOTTOM_PADDING = 120;

  let width, height;
  let controlled = false;
  let startTime = performance.now();

  /* ===============================
     PARALLAX (APPLE-LIKE)
  =============================== */
  let mouse = { x: 0, y: 0 };
  let parallax = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();

    mouse.x = (e.clientX - rect.left) / rect.width - 0.5;
    mouse.y = (e.clientY - rect.top) / rect.height - 0.5;
  });

  /* ===============================
     LAYOUT
  =============================== */
  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  /* ===============================
     CHAOS GRID + ORBIT SETUP
  =============================== */
  nodes.forEach((n, i) => {

    const cols = 4;
    const rows = 2;

    const usableWidth = width - SIDE_PADDING * 2;
    const usableHeight = height - TOP_PADDING - BOTTOM_PADDING;

    const zoneW = usableWidth / cols;
    const zoneH = usableHeight / rows;

    const col = i % cols;
    const row = Math.floor(i / cols);

    // CHAOS BASE
    n.baseX = -width / 2 + SIDE_PADDING + zoneW * (col + 0.5);
    n.baseY = -height / 2 + TOP_PADDING + zoneH * (row + 0.5);

    n.floatX = Math.max(10, zoneW / 2 - NODE_W / 2 - 6);
    n.floatY = Math.max(10, zoneH / 2 - NODE_H / 2 - 6);

    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.002 + Math.random() * 0.002;

    // ORBIT SETUP
    const total = nodes.length;
    const ring = i < total / 2 ? 0 : 1;
    const ringCount = total / 2;
    const index = i % ringCount;

    n.baseAngle = (index / ringCount) * Math.PI * 2;
    n.baseRadius = ring === 0 ? 170 : 260;

    n.z = ring === 0 ? 25 : 10;

    n.order = i;

    n.x = n.baseX;
    n.y = n.baseY;
  });

  function getTime() {
    return performance.now() - startTime;
  }

  /* ===============================
     ANIMATION LOOP
  =============================== */
  function animate(now) {

    const t = getTime();

    /* ===== PARALLAX ===== */
    parallax.x += (mouse.x - parallax.x) * 0.05;
    parallax.y += (mouse.y - parallax.y) * 0.05;

    hero.style.transform = `
      rotateX(${parallax.y * 6}deg)
      rotateY(${parallax.x * 8}deg)
      scale(1.02)
    `;

    nodes.forEach(n => {

      /* ===============================
         🌀 CHAOS (0–2s) — RESTORED
      =============================== */
      if (t < 2000) {

        n.angle += n.speed;

        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;
      }

      /* ===============================
         ⚡ SNAP TO ORBIT (2s–3.2s)
      =============================== */
      else if (t < 3200) {

        const progress = Math.min(1, (t - 2000) / 1200);

        const targetX = Math.cos(n.baseAngle) * n.baseRadius;
        const targetY = Math.sin(n.baseAngle) * n.baseRadius;

        // STRONG SNAP (no softness)
        n.x += (targetX - n.x) * (0.12 + progress * 0.2);
        n.y += (targetY - n.y) * (0.12 + progress * 0.2);
      }

      /* ===============================
         🧠 PERFECT ORBIT (3.2s+)
      =============================== */
      else {

        controlled = true;

        const time = (t - 3200) * 0.0006;

        // PERFECT CIRCLE (no drift)
        const angle = n.baseAngle + time;

        n.x = Math.cos(angle) * n.baseRadius;
        n.y = Math.sin(angle) * n.baseRadius;
      }

      /* ===============================
         CORE APPEAR
      =============================== */
      if (t > 2000) {
        core.style.display = "flex";
        core.style.opacity = Math.min(1, (t - 2000) / 400);
      }

      /* ===============================
         TRANSFORM
      =============================== */
      const scale = 1 + n.z / 300;

      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
        translate(-50%, -50%)
        scale(${scale})
      `;

      const inner = n.querySelector(".node-inner");

      if (controlled) {
        inner.style.boxShadow =
          `0 0 20px rgba(34,197,94,0.5),
           0 0 40px rgba(59,130,246,0.3)`;
      }
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

});
