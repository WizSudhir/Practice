document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");
  const svg = document.getElementById("connections");
  const revenue = document.getElementById("revenue");

  const PHASE_DELAY = 2000;
  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;
  const TOP_PADDING = 60;
  const BOTTOM_PADDING = 120;

  let width, height;
  let controlled = false;
  let frozen = false;
  let revenueProgress = 0;

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

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
    const nodeInner = node.querySelector(".node-inner");
    const nodeRect = nodeInner.getBoundingClientRect();
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

    const coreRadius = coreRect.width / 2;

    const coreEdge = {
      x: coreCenter.x + nx * (coreRadius + 1),
      y: coreCenter.y + ny * (coreRadius + 1)
    };

    const halfW = nodeRect.width / 2;
    const halfH = nodeRect.height / 2;

    let tx = Infinity;
    let ty = Infinity;

    if (nx !== 0) tx = halfW / Math.abs(nx);
    if (ny !== 0) ty = halfH / Math.abs(ny);

    const t = Math.min(tx, ty);

    const nodeEdge = {
      x: nodeCenter.x - nx * (t + 1),
      y: nodeCenter.y - ny * (t + 1)
    };

    const start = {
      x: Math.round(coreEdge.x - svgRect.left),
      y: Math.round(coreEdge.y - svgRect.top)
    };

    const end = {
      x: Math.round(nodeEdge.x - svgRect.left),
      y: Math.round(nodeEdge.y - svgRect.top)
    };

    const midX = Math.round(start.x + (end.x - start.x) * 0.5);

    const d = `
      M ${start.x} ${start.y}
      L ${midX} ${start.y}
      L ${midX} ${end.y}
      L ${end.x} ${end.y}
    `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("d", d);
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
  // RESET EVERYTHING (KEY PART)
  // ===============================
  function resetAnimation() {

    controlled = false;
    frozen = false;
    revenueProgress = 0;

    hero.classList.remove("controlled");
    revenue.classList.remove("active");

    core.style.boxShadow = "";
    core.style.display = "none";

    resetConnections();

    document.querySelectorAll(".bar").forEach(bar => {
      bar.style.height = "0";
      bar.style.transform = "";
    });

    const line = document.querySelector(".line-path");
    if (line) {
      line.style.strokeDashoffset = "";
    }

    nodes.forEach(n => {
      n.classList.remove("resolved-active");
      n.querySelector(".node-inner").style.boxShadow = "";
    });
  }

  // ===============================
  // REVENUE
  // ===============================
  function incrementRevenue() {

    const bars = document.querySelectorAll(".bar");
    const line = document.querySelector(".line-path");

    if (revenueProgress >= bars.length) return;

    const bar = bars[revenueProgress];
    bar.style.height = bar.dataset.height;

    if (line) {
      const totalLength = line.getTotalLength();
      const progressRatio = (revenueProgress + 1) / bars.length;

      line.style.strokeDasharray = totalLength;
      line.style.strokeDashoffset = totalLength * (1 - progressRatio);
    }

    core.style.boxShadow = `
      0 0 ${40 + revenueProgress * 12}px rgba(34,197,94,0.7),
      0 0 ${80 + revenueProgress * 20}px rgba(59,130,246,0.5)
    `;

    revenueProgress++;
  }

  // ===============================
  // MAIN TIMELINE (LOOPABLE)
  // ===============================
  function runAnimation() {

    resetAnimation();

    setTimeout(() => {

      hero.classList.add("controlled");
      core.style.display = "flex";
      revenue.classList.add("active");

      frozen = true;

      nodes.forEach(n => {
        n.x = n.baseX;
        n.y = n.baseY;
      });

      nodes.forEach((n, i) => {

        setTimeout(() => {

          const path = drawConnection(n);
          path.getBoundingClientRect();
          path.classList.add("active");

          setTimeout(incrementRevenue, 300);

          setTimeout(() => {
            n.classList.add("resolved-active");
          }, 700);

        }, i * 450);
      });

      // 🔁 RESTART AFTER FULL ANIMATION
      const totalDuration = nodes.length * 450 + 3000;

      setTimeout(runAnimation, totalDuration);

    }, 2000 + PHASE_DELAY);

    setTimeout(() => {
      controlled = true;
    }, 3500 + PHASE_DELAY);
  }

  // ===============================
  // ANIMATION LOOP
  // ===============================
  function animate() {

    nodes.forEach(n => {

      if (!controlled) {
        n.angle += n.speed;
        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;
      } else if (!frozen) {
        n.x += (-n.x) * 0.015;
        n.y += (-n.y) * 0.015;
      } else {
        n.x = n.baseX;
        n.y = n.baseY;
      }

      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
        translate(-50%, -50%)
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();
  runAnimation(); // 🔥 START LOOP

});
