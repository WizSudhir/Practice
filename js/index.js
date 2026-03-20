document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  
  const hero = document.querySelector(".system-bg");
  let animationRunning = false;
  let activeTimeouts = [];
  let timelineStarted = false;
  let isVisible = true;
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
  
      if (isVisible) {
        activeTimeouts.forEach(clearTimeout);
        activeTimeouts = [];
        resetSystem(); // 🔥 clean restart (best UX)
        if (!animationRunning) {
        animate();
        }
        } else {
        activeTimeouts.forEach(clearTimeout);
        activeTimeouts = [];
        }
     },
    { threshold: 0.2 }
  );
  if (hero && isVisible) {
  animate();
  }
observer.observe(hero);
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");
  const svg = document.getElementById("connections");
  const revenue = document.getElementById("revenue");
  const PHASE_DELAY = 3000;
  const NODE_W = 140;
  const NODE_H = 100;

  const SIDE_PADDING = 40;
  const TOP_PADDING = 60;
  const BOTTOM_PADDING = 120;

  let width, height;
  let controlled = false;
  let frozen = false;

  // 🔥 REVENUE STATE
  let revenueProgress = 0;

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

  // ===============================
  // 🔁 FULL RESET FOR LOOP
  // ===============================
  function resetSystem() {

    controlled = false;
    frozen = false;
    revenueProgress = 0;
    timelineStarted = false;

    hero.classList.remove("controlled");
    core.style.display = "none";
    revenue.classList.remove("active");

    resetConnections();

    // reset bars
    document.querySelectorAll(".bar").forEach(bar => {
      bar.style.height = "0px";
      bar.style.transform = "scaleY(1)";
    });

    // reset line
    const line = document.querySelector(".line-path");
    if (line) {
      line.style.strokeDasharray = "0";
      line.style.strokeDashoffset = "0";
    }

    // reset nodes
    nodes.forEach(n => {
      n.classList.remove("resolved-active");
      n.style.opacity = "";
      n.querySelector(".node-inner").style.boxShadow = "";

      n.x = n.baseX;
      n.y = n.baseY;
      n.angle = 0;
    });

    // restart timeline
    startTimeline();
  }

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

  window.addEventListener("resize", resetConnections);

  // ===============================
  // REVENUE INCREMENT LOGIC
  // ===============================
  function incrementRevenue() {

    const bars = document.querySelectorAll(".bar");
    const line = document.querySelector(".line-path");

    if (revenueProgress >= bars.length) return;

    const bar = bars[revenueProgress];

    bar.style.height = bar.dataset.height;

    bar.style.transform = "scaleY(1.1)";
    activeTimeouts.push(setTimeout(() => {
      bar.style.transform = "scaleY(1)";
    }, 200);

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

    // 🔁 TRIGGER LOOP AFTER LAST BAR + 2s
    if (revenueProgress === bars.length) {
      activeTimeouts.push(setTimeout(() => {
        if (!isVisible) return;
        resetSystem();
      }, 5000);
    }
  }

  // ===============================
  // STABILITY DETECTION
  // ===============================
  function waitForStabilization(callback) {

    let stableFrames = 0;
    let lastPositions = new Map();

    function check() {

      let isStable = true;

      nodes.forEach(n => {
        const prev = lastPositions.get(n) || { x: n.x, y: n.y };

        const dx = Math.abs(n.x - prev.x);
        const dy = Math.abs(n.y - prev.y);

        if (dx > 0.3 || dy > 0.3) {
          isStable = false;
        }

        lastPositions.set(n, { x: n.x, y: n.y });
      });

      if (isStable) stableFrames++;
      else stableFrames = 0;

      if (stableFrames > 12) {
        callback();
      } else {
        if (isVisible) {
          requestAnimationFrame(check);
        }
      }
    }

    check();
  }

  // ===============================
  // CONTROL TIMELINE (EXTRACTED)
  // ===============================
  function startTimeline() {
    if (!isVisible || timelineStarted) return;
    timelineStarted = true;
    activeTimeouts.push(setTimeout(() => {

      hero.classList.add("controlled");
      core.style.display = "flex";

      revenue.classList.add("active");

      waitForStabilization(() => {

        frozen = true;

        nodes.forEach(n => {
          n.x = n.baseX;
          n.y = n.baseY;
        });

        activeTimeouts.push(setTimeout(() => {

          requestAnimationFrame(() => {

            nodes.forEach((n, i) => {

              activeTimeouts.push(setTimeout(() => {

                const path = drawConnection(n);

                path.getBoundingClientRect();
                path.classList.add("active");

                activeTimeouts.push(setTimeout(() => {
                  incrementRevenue();
                }, 420);

                activeTimeouts.push(setTimeout(() => {

                  n.classList.add("resolved-active");

                  n.querySelector(".node-inner").style.boxShadow = `
                    0 0 25px rgba(34,197,94,0.7),
                    0 0 50px rgba(59,130,246,0.4)
                  `;

                }, 840);

              }, i * 600 + Math.random() * 500);

            });

          });

        }, 720);

      });

    }, 2000 + PHASE_DELAY);

    activeTimeouts.push(setTimeout(() => {
      controlled = true;
    }, 3500 + PHASE_DELAY);
  }

  // ▶️ INITIAL START
  startTimeline();

  // ===============================
  // ANIMATION LOOP
  // ===============================
function animate() {

  if (!isVisible) {
    animationRunning = false;
    return;
  }

  animationRunning = true;

  nodes.forEach(n => {

    if (!controlled) {

      n.angle += n.speed;

      n.x = n.baseX + Math.cos(n.angle) * n.floatX;
      n.y = n.baseY + Math.sin(n.angle) * n.floatY;

    } else if (!frozen) {

      const dx = -n.x;
      const dy = -n.y;

      n.x += dx * 0.015;
      n.y += dy * 0.015;

      n.x += (n.baseX - n.x) * 0.04;
      n.y += (n.baseY - n.y) * 0.04;

    } else {

      n.x = n.baseX;
      n.y = n.baseY;
    }

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

  requestAnimationFrame(animate);
  }
  animate();

}); //DOM Close
