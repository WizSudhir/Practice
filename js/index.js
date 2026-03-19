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

    // initial dim (for focus effect later)
    n.style.opacity = 0.9;
  });

  // 🔥 CONTROL TIMELINE (INTELLIGENT CORRECTION)
  setTimeout(() => {

    hero.classList.add("controlled");
    core.style.display = "flex";

    nodes.forEach((n, i) => {

      setTimeout(() => {

        // 👉 bring this node into focus
        nodes.forEach(other => {
          if (other !== n) {
            other.style.opacity = 0.25;
          }
        });

        n.style.opacity = 1;

        // subtle focus scale
        n.classList.add("resolving");

        // simulate "analysis"
        setTimeout(() => {

          // resolve
          n.classList.add("resolved-active");

          // green glow
          n.querySelector(".node-inner").style.boxShadow = `
            0 0 20px rgba(34,197,94,0.5),
            0 0 40px rgba(59,130,246,0.25)
          `;

          // remove focus animation
          setTimeout(() => {
            n.classList.remove("resolving");
          }, 300);

          // restore others gradually
          setTimeout(() => {
            nodes.forEach(other => {
              other.style.opacity = 0.9;
            });
          }, 200);

        }, 400);

      }, i * 600); // slower = more premium

    });

  }, 2000);

  setTimeout(() => {
    controlled = true;
  }, 3500);

  function animate() {

    nodes.forEach(n => {

      if (!controlled) {
        n.angle += n.speed;

        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;

      } else {

        const coreX = 0;
        const coreY = 0;

        const dx = coreX - n.x;
        const dy = coreY - n.y;

        // subtle influence only
        n.x += dx * 0.01;
        n.y += dy * 0.01;

        // stabilize
        n.x += (n.baseX - n.x) * 0.05;
        n.y += (n.baseY - n.y) * 0.05;
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

      const glowStrength = n.z / 40;
      const glow = 10 + glowStrength * 30;
      const opacity = controlled ? n.style.opacity : (0.7 + glowStrength * 0.3);

      if (!n.matches(':hover')) {
        n.style.opacity = opacity;
      }

      n.querySelector(".node-inner").style.boxShadow = controlled
        ? n.querySelector(".node-inner").style.boxShadow
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
