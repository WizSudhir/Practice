document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");
  const svg = document.getElementById("connections");

  let width, height;
  let controlled = false;
  let frozen = false;

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

    const usableWidth = width - 80;
    const usableHeight = height - 180;

    const zoneW = usableWidth / cols;
    const zoneH = usableHeight / rows;

    const col = i % cols;
    const row = Math.floor(i / cols);

    n.baseX = -width / 2 + 40 + zoneW * (col + 0.5);
    n.baseY = -height / 2 + 60 + zoneH * (row + 0.5);

    n.angle = Math.random() * Math.PI * 2;
    n.speed = 0.002 + Math.random() * 0.002;

    n.floatX = Math.max(10, zoneW / 2 - 70);
    n.floatY = Math.max(10, zoneH / 2 - 50);

    n.z = (Math.random() - 0.5) * 40;

    n.x = n.baseX;
    n.y = n.baseY;
  });

  // ===============================
  // 🔥 ANCHOR POSITIONING
  // ===============================
  function positionAnchors() {
    nodes.forEach(node => {
      const inner = node.querySelector(".node-inner");
      const anchor = node.querySelector(".anchor");

      const rect = inner.getBoundingClientRect();
      const parentRect = node.getBoundingClientRect();

      anchor.style.left = (rect.width / 2) + "px";
      anchor.style.top = (rect.height / 2) + "px";
    });
  }

  // ===============================
  // CONNECTION SYSTEM (ANCHOR BASED)
  // ===============================
  function drawConnection(node) {

    const anchor = node.querySelector(".anchor");

    const coreRect = core.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const start = {
      x: Math.round(coreRect.left + coreRect.width / 2 - svgRect.left),
      y: Math.round(coreRect.top + coreRect.height / 2 - svgRect.top)
    };

    const end = {
      x: Math.round(anchorRect.left - svgRect.left),
      y: Math.round(anchorRect.top - svgRect.top)
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
        <linearGradient id="lineGradient">
          <stop offset="0%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
    `;
  }

  window.addEventListener("resize", resetConnections);

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

        if (Math.abs(n.x - prev.x) > 0.3 || Math.abs(n.y - prev.y) > 0.3) {
          isStable = false;
        }

        lastPositions.set(n, { x: n.x, y: n.y });
      });

      if (isStable) stableFrames++;
      else stableFrames = 0;

      if (stableFrames > 12) callback();
      else requestAnimationFrame(check);
    }

    check();
  }

  // ===============================
  // CONTROL TIMELINE
  // ===============================
  setTimeout(() => {

    hero.classList.add("controlled");
    core.style.display = "flex";

    waitForStabilization(() => {

      frozen = true;

      nodes.forEach(n => {
        n.x = n.baseX;
        n.y = n.baseY;
      });

      // 🔥 POSITION ANCHORS AFTER FREEZE
      positionAnchors();

      setTimeout(() => {

        requestAnimationFrame(() => {

          nodes.forEach((n, i) => {

            setTimeout(() => {

              const path = drawConnection(n);

              path.getBoundingClientRect();
              path.classList.add("active");

              setTimeout(() => {
                n.classList.add("resolved-active");
              }, 700);

            }, i * 450 + Math.random() * 150);

          });

        });

      }, 600);

    });

  }, 2000);

  setTimeout(() => {
    controlled = true;
  }, 3500);

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

      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
        translate(-50%, -50%)
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();

});
