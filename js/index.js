document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");
  const svg = document.getElementById("connections");

  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;
  const TOP_PADDING = 60;
  const BOTTOM_PADDING = 120;

  let width, height;
  let controlled = false;
  let frozen = false;

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", () => {
    updateBounds();
    resetConnections();
  });

  // ===============================
  // POSITION SETUP
  // ===============================
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
  });

  // ===============================
  // CONNECTION SYSTEM
  // ===============================
  function drawConnection(node) {

    const coreRect = core.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const coreCenter = {
      x: coreRect.left + coreRect.width / 2,
      y: coreRect.top + coreRect.height / 2
    };

    const nodeCenter = {
      x: nodeRect.left + nodeRect.width / 2,
      y: nodeRect.top + nodeRect.height / 2
    };

    const dx = nodeCenter.x - coreCenter.x;
    const dy = nodeCenter.y - coreCenter.y;

    const dist = Math.hypot(dx, dy);

    const nx = dx / dist;
    const ny = dy / dist;

    // CORE EDGE
    const coreRadius = coreRect.width / 2;

    const coreEdge = {
      x: coreCenter.x + nx * coreRadius,
      y: coreCenter.y + ny * coreRadius
    };

    // NODE EDGE (accurate box intersection)
    const halfW = nodeRect.width / 2;
    const halfH = nodeRect.height / 2;

    const absNx = Math.abs(nx);
    const absNy = Math.abs(ny);

    let t;

    if (absNx * halfH > absNy * halfW) {
      t = halfW / absNx;
    } else {
      t = halfH / absNy;
    }

    const EDGE_OFFSET = 1.5;

    const nodeEdge = {
      x: nodeCenter.x - nx * (t - EDGE_OFFSET),
      y: nodeCenter.y - ny * (t - EDGE_OFFSET)
    };

    // PIXEL SNAP
    const start = {
      x: Math.floor(coreEdge.x - svgRect.left) + 0.5,
      y: Math.floor(coreEdge.y - svgRect.top) + 0.5
    };

    const end = {
      x: Math.floor(nodeEdge.x - svgRect.left) + 0.5,
      y: Math.floor(nodeEdge.y - svgRect.top) + 0.5
    };

    const midX = Math.floor(start.x + (end.x - start.x) * 0.5) + 0.5;

    const d = `
      M ${start.x} ${start.y}
      L ${midX} ${start.y}
      L ${midX} ${end.y}
      L ${end.x} ${end.y}
    `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("d", d);
    path.setAttribute("vector-effect", "non-scaling-stroke");
    path.classList.add("connection-path");

    svg.appendChild(path);

    return path;
  }

  function resetConnections() {
    svg.innerHTML = `
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
    `;
  }

  // ===============================
  // CONTROL TIMELINE
  // ===============================
  setTimeout(() => {

    hero.classList.add("controlled");

    // show core WITHOUT layout shift
    core.style.visibility = "visible";

    // 🔒 FREEZE SYSTEM
    frozen = true;

    // disable transitions (CRITICAL)
    nodes.forEach(n => {
      n.style.transition = "none";
    });

    // set FINAL positions
    nodes.forEach(n => {
      n.x = n.baseX;
      n.y = n.baseY;

      n.style.transform = `
        translate3d(${n.baseX}px, ${n.baseY}px, 0)
        translate(-50%, -50%)
        scale(1)
      `;
    });

    // 🔥 FORCE LAYOUT COMMIT
    document.body.offsetHeight;

    // ✅ DOUBLE RAF (guaranteed paint)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        nodes.forEach((n, i) => {

          setTimeout(() => {

            const path = drawConnection(n);

            path.getBoundingClientRect();
            path.classList.add("active");

            setTimeout(() => {
              n.classList.add("resolved-active");

              n.querySelector(".node-inner").style.boxShadow = `
                0 0 25px rgba(34,197,94,0.7),
                0 0 50px rgba(59,130,246,0.4)
              `;
            }, 700);

          }, i * 450);
        });

      });
    });

  }, 2000);

  setTimeout(() => {
    controlled = true;
  }, 3500);

  // ===============================
  // ANIMATION LOOP
  // ===============================
  function animate() {

    if (frozen) return; // ✅ HARD STOP (CRITICAL)

    nodes.forEach(n => {

      if (!controlled) {

        n.angle += n.speed;

        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;

      } else {

        const dx = -n.x;
        const dy = -n.y;

        n.x += dx * 0.015;
        n.y += dy * 0.015;

        n.x += (n.baseX - n.x) * 0.04;
        n.y += (n.baseY - n.y) * 0.04;
      }

      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
        translate(-50%, -50%)
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();

});
