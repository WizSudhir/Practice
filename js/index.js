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

  // ✅ CONTROL STATE
  let controlled = false;

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  // INITIAL SETUP
  nodes.forEach((n, i) => {

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

    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.002 + Math.random() * 0.002;

    n.floatX = Math.max(10, zoneW / 2 - NODE_W / 2 - 6);
    n.floatY = Math.max(10, zoneH / 2 - NODE_H / 2 - 6);

    n.z = (Math.random() - 0.5) * 40;

    n.x = n.baseX;
    n.y = n.baseY;

    n.order = i;
  });

  // 🔥 CONTROL TIMELINE
  setTimeout(() => {
    hero.classList.add("controlled");
    core.style.display = "flex";

    // ✅ CINEMATIC SEQUENTIAL RESOLVE (organic timing)
    nodes.forEach((n, i) => {
      setTimeout(() => {

        // pulse effect
        n.classList.add("resolved-active");

        // 🔥 CORE → NODE ENERGY HIT
        n.querySelector(".node-inner").style.boxShadow = `
          0 0 25px rgba(59,130,246,0.6),
          0 0 50px rgba(59,130,246,0.3)
        `;

        // remove pulse after animation
        setTimeout(() => {
          n.classList.remove("resolved-active");
        }, 400);

      }, i * 180 + Math.random() * 120); // ✅ less robotic
    });

  }, 2000);

  setTimeout(() => {
    controlled = true;
  }, 3500);

  function animate() {

    nodes.forEach(n => {

      if (!controlled) {
        // CHAOS MODE (unchanged)
        n.angle += n.speed;

        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;

      } else {
        // ✅ FIXED: NO COLLAPSE → ONLY INFLUENCE + STABILIZATION

        const coreX = 0;
        const coreY = 0;

        const dx = coreX - n.x;
        const dy = coreY - n.y;

        // subtle gravitational influence
        n.x += dx * 0.015;
        n.y += dy * 0.015;

        // smooth stabilization to grid
        n.x += (n.baseX - n.x) * 0.04;
        n.y += (n.baseY - n.y) * 0.04;
      }

      // SAFE BOUNDS
      const left = -width / 2 + SIDE_PADDING + NODE_W / 2;
      const right = width / 2 - SIDE_PADDING - NODE_W / 2;

      const top = -height / 2 + TOP_PADDING + NODE_H / 2;
      const bottom = height / 2 - BOTTOM_PADDING - NODE_H / 2;

      n.x = Math.max(left, Math.min(right, n.x));
      n.y = Math.max(top, Math.min(bottom, n.y));

      // DEPTH
      if (!controlled) {
        n.z += Math.sin(n.angle) * 0.03;
      }

      n.z = Math.max(0, Math.min(30, n.z));

      const scale = 1 + n.z / 300;

      // GLOW
      const glowStrength = n.z / 40;
      const glow = 10 + glowStrength * 30;
      const opacity = controlled ? 1 : (0.7 + glowStrength * 0.3);

      if (!n.matches(':hover')) {
        n.style.opacity = opacity;
      }

      n.querySelector(".node-inner").style.boxShadow = controlled
        ? `0 0 20px rgba(34,197,94,0.4), 0 0 40px rgba(59,130,246,0.25)`
        : `0 0 ${glow}px rgba(59,130,246,0.25),
           0 0 ${glow * 2}px rgba(139,92,246,0.15)`;

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


