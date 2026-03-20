document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ICON INIT (FIXED)
  // ===============================
  function initIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  initIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");
  const svg = document.getElementById("connections");
  const revenue = document.getElementById("revenue");

  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;
  const TOP_PADDING = 60;
  const BOTTOM_PADDING = 120;

  let width, height;
  let controlled = false;
  let frozen = false;
  let revenueProgress = 0;
  let isVisible = true;

  // ===============================
  // VIEWPORT OBSERVER (STOP/START)
  // ===============================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible = true;
        requestAnimationFrame(animate);
      } else {
        isVisible = false;
      }
    });
  }, { threshold: 0.2 });

  observer.observe(hero);

  // ===============================
  // BOUNDS
  // ===============================
  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  // ===============================
  // INITIAL NODE SETUP
  // ===============================
  function setupNodes() {

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
  }

  setupNodes();

  // ===============================
  // CONNECTIONS
  // ===============================
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

  function drawConnection(node) {

    const coreRect = core.getBoundingClientRect();
    const nodeRect = node.querySelector(".node-inner").getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const cx = coreRect.left + coreRect.width / 2;
    const cy = coreRect.top + coreRect.height / 2;

    const nx = nodeRect.left + nodeRect.width / 2;
    const ny = nodeRect.top + nodeRect.height / 2;

    const startX = cx - svgRect.left;
    const startY = cy - svgRect.top;
    const endX = nx - svgRect.left;
    const endY = ny - svgRect.top;

    const midX = startX + (endX - startX) * 0.5;

    const d = `
      M ${startX} ${startY}
      L ${midX} ${startY}
      L ${midX} ${endY}
      L ${endX} ${endY}
    `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("d", d);
    path.classList.add("connection-path");

    svg.appendChild(path);

    return path;
  }

  // ===============================
  // REVENUE LOGIC
  // ===============================
  function incrementRevenue() {

    const bars = document.querySelectorAll(".bar");
    const line = document.querySelector(".line-path");

    if (revenueProgress >= bars.length) return;

    const bar = bars[revenueProgress];

    bar.style.height = bar.dataset.height;

    if (line) {
      const totalLength = line.getTotalLength();
      const ratio = (revenueProgress + 1) / bars.length;

      line.style.opacity = 1;
      line.style.strokeDasharray = totalLength;
      line.style.strokeDashoffset = totalLength * (1 - ratio);
    }

    core.style.boxShadow = `
      0 0 ${40 + revenueProgress * 12}px rgba(34,197,94,0.7),
      0 0 ${80 + revenueProgress * 20}px rgba(59,130,246,0.5)
    `;

    revenueProgress++;
  }

  // ===============================
  // RESET SYSTEM
  // ===============================
  function resetSystem() {

    controlled = false;
    frozen = false;
    revenueProgress = 0;

    hero.classList.remove("controlled");
    revenue.classList.remove("active");

    nodes.forEach(n => {
      n.classList.remove("resolved-active");
    });

    resetConnections();

    document.querySelectorAll(".bar").forEach(bar => {
      bar.style.height = "0";
    });

    const line = document.querySelector(".line-path");
    if (line) {
      line.style.strokeDashoffset = 300;
      line.style.opacity = 0;
    }

    core.style.boxShadow = `
      0 0 40px rgba(59,130,246,0.5),
      0 0 80px rgba(139,92,246,0.3)
    `;
  }

  // ===============================
  // STABILITY CHECK
  // ===============================
  function waitForStabilization(callback) {

    let stableFrames = 0;
    let last = new Map();

    function check() {

      let stable = true;

      nodes.forEach(n => {
        const prev = last.get(n) || { x: n.x, y: n.y };

        if (Math.abs(n.x - prev.x) > 0.3 || Math.abs(n.y - prev.y) > 0.3) {
          stable = false;
        }

        last.set(n, { x: n.x, y: n.y });
      });

      if (stable) stableFrames++;
      else stableFrames = 0;

      if (stableFrames > 12) callback();
      else requestAnimationFrame(check);
    }

    check();
  }

  // ===============================
  // MAIN CYCLE
  // ===============================
  function startCycle() {

    setTimeout(() => {

      hero.classList.add("controlled");
      core.style.display = "flex";
      initIcons();

      revenue.classList.add("active");

      waitForStabilization(() => {

        frozen = true;

        nodes.forEach(n => {
          n.x = n.baseX;
          n.y = n.baseY;
        });

        setTimeout(() => {

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

        }, 600);

      });

    }, 2000);
  }

  function loopCycle() {

    startCycle();

    setTimeout(() => {

      resetSystem();

      setTimeout(loopCycle, 1000);

    }, 12000);
  }

  loopCycle();

  // ===============================
  // ANIMATION LOOP
  // ===============================
  function animate() {

    if (!isVisible) return;

    nodes.forEach(n => {

      if (!controlled) {

        n.angle += n.speed;

        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;

      } else if (!frozen) {

        n.x += (-n.x) * 0.015;
        n.y += (-n.y) * 0.015;

        n.x += (n.baseX - n.x) * 0.04;
        n.y += (n.baseY - n.y) * 0.04;

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

  requestAnimationFrame(animate);

});
