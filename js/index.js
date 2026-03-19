document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");

  // ✅ NEW: SVG CONNECTIONS
  const svg = document.querySelector(".connections");
  let lines = [];

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

  // ✅ CREATE CONNECTION LINES
  for (let i = 0; i < nodes.length - 1; i++) {

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", 0);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", 0);
    line.setAttribute("y2", 0);

    svg.appendChild(line);

    lines.push({
      el: line,
      a: nodes[i],
      b: nodes[i + 1]
    });
  }

  // 🔥 CONTROL TIMELINE
  setTimeout(() => {
    hero.classList.add("controlled");
    core.style.display = "flex";

    // ✅ NODE RESOLVE
    nodes.forEach((n, i) => {
      setTimeout(() => {

        n.classList.add("resolved-active");

        n.querySelector(".node-inner").style.boxShadow = `
          0 0 25px rgba(59,130,246,0.6),
          0 0 50px rgba(59,130,246,0.3)
        `;

        setTimeout(() => {
          n.classList.remove("resolved-active");
        }, 400);

      }, i * 180 + Math.random() * 120);
    });

    // ✅ ACTIVATE LINES (CINEMATIC SEQUENCE)
    lines.forEach((l, i) => {
      setTimeout(() => {
        l.el.classList.add("active");
      }, i * 220 + 300);
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

        n.x += dx * 0.015;
        n.y += dy * 0.015;

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

      if (!controlled) {
        n.z += Math.sin(n.angle) * 0.03;
      }

      n.z = Math.max(0, Math.min(30, n.z));

      const scale = 1 + n.z / 300;

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

    // ✅ UPDATE LINE POSITIONS
    lines.forEach(l => {

      const rectA = l.a.getBoundingClientRect();
      const rectB = l.b.getBoundingClientRect();
      const parentRect = hero.getBoundingClientRect();

      const x1 = rectA.left + rectA.width / 2 - parentRect.left;
      const y1 = rectA.top + rectA.height / 2 - parentRect.top;

      const x2 = rectB.left + rectB.width / 2 - parentRect.left;
      const y2 = rectB.top + rectB.height / 2 - parentRect.top;

      l.el.setAttribute("x1", x1);
      l.el.setAttribute("y1", y1);
      l.el.setAttribute("x2", x2);
      l.el.setAttribute("y2", y2);
    });

    requestAnimationFrame(animate);
  }

  animate();

});
