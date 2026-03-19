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
     PARALLAX (SMOOTH + PREMIUM)
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
     SETUP (CHAOS + ORBIT)
  =============================== */
  const total = nodes.length;
  const half = Math.ceil(total / 2);

  nodes.forEach((n, i) => {

    /* ---------- CHAOS GRID ---------- */
    const cols = 4;
    const rows = 2;

    const usableWidth = width - SIDE_PADDING * 2;
    const usableHeight = height - TOP_PADDING - BOTTOM_PADDING;

    const zoneW = usableWidth / cols;
    const zoneH = usableHeight / rows;

    const col = i % cols;
    const row = Math.floor(i / cols);

    n.baseX = -width / 2 + SIDE_PADDING + zoneW * (col + 0.5);
    n.baseY = -height / 2 + TOP_PADDING + zoneH * (row + 0.5);

    n.floatX = Math.max(10, zoneW / 2 - NODE_W / 2 - 6);
    n.floatY = Math.max(10, zoneH / 2 - NODE_H / 2 - 6);

    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.002 + Math.random() * 0.002;

    /* ---------- ORBIT (FIXED DISTRIBUTION) ---------- */
    const ring = i < half ? 0 : 1;
    const ringCount = ring === 0 ? half : total - half;
    const index = ring === 0 ? i : i - half;

    // 🔥 KEY: offset outer ring to prevent stacking
    const offset = ring === 1 ? (Math.PI / ringCount) : 0;

    n.baseAngle = (index / ringCount) * Math.PI * 2 + offset;

    n.baseRadius = ring === 0 ? 170 : 260;

    n.z = ring === 0 ? 25 : 10;

    n.order = i;

    n.x = n.baseX;
    n.y = n.baseY;

    n.resolved = false;
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

    nodes.forEach((n, i) => {

      /* ===============================
         🌀 CHAOS
      =============================== */
      if (t < 2000) {

        n.angle += n.speed;

        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;
      }

      /* ===============================
         ⚡ SNAP TO ORBIT
      =============================== */
      else if (t < 3200) {

        const progress = Math.min(1, (t - 2000) / 1200);

        const targetX = Math.cos(n.baseAngle) * n.baseRadius;
        const targetY = Math.sin(n.baseAngle) * n.baseRadius;

        n.x += (targetX - n.x) * (0.12 + progress * 0.2);
        n.y += (targetY - n.y) * (0.12 + progress * 0.2);
      }

      /* ===============================
         🧠 PERFECT ORBIT
      =============================== */
      else {

        controlled = true;

        const time = (t - 3200) * 0.0006;

        const speedFactor = n.baseRadius === 170 ? 0.8 : 1.2;

        const angle = n.baseAngle + time * speedFactor;

        n.x = Math.cos(angle) * n.baseRadius;
        n.y = Math.sin(angle) * n.baseRadius;

        /* ===== RESOLVE STATE ===== */
        if (!n.resolved) {

          const delay = i * 120;

          if (t > 3400 + delay) {

            n.resolved = true;

            // hide errors
            n.querySelectorAll(".error-label").forEach(el => {
              el.style.opacity = "0";
            });

            // stop leak
            const leak = n.querySelector(".leak");
            if (leak) leak.style.opacity = "0";

            // show resolved
            n.querySelectorAll(".resolved").forEach(el => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            });

            // glow upgrade
            n.querySelector(".node-inner").style.boxShadow =
              `0 0 20px rgba(34,197,94,0.6),
               0 0 40px rgba(59,130,246,0.3)`;
          }
        }
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
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

});
