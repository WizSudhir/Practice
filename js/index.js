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

  /* ===============================
     TIMELINE ENGINE
  =============================== */
  class Timeline {
    constructor() {
      this.events = [];
    }

    add(start, duration, update) {
      this.events.push({ start, end: start + duration, update });
    }

    update(time) {
      this.events.forEach(e => {
        if (time >= e.start && time <= e.end) {
          const raw = (time - e.start) / (e.end - e.start);
          const p = easeOut(raw);
          e.update(p, time);
        }
      });
    }
  }

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const timeline = new Timeline();
  let startTime = performance.now();

  /* ===============================
     LAYOUT INIT
  =============================== */
  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }

  updateBounds();
  window.addEventListener("resize", updateBounds);

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

    // STATES
    n.lockProgress = 0;
    n.purged = false;
    n.resolved = false;
    n.stable = false;
  });

  /* ===============================
     🎬 TIMELINE PHASES
  =============================== */

  // 1. CHAOS (0 → 2s)
  timeline.add(0, 2000, () => {});

  // 2. CORE IGNITION (2s → 2.6s)
  timeline.add(2000, 600, (p) => {
    core.style.display = "flex";
    core.style.opacity = p;
    core.style.transform =
      `translate(-50%, -50%) scale(${0.6 + p * 0.4})`;
  });

  // 3. SYSTEM LOCK WAVE (2.6s → 3.2s)
  timeline.add(2600, 600, (p) => {

    core.classList.add("lock");

    nodes.forEach(n => {

      const dx = n.x;
      const dy = n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const delay = dist * 0.25;
      const local = Math.max(0, Math.min(1, (p * 600 - delay) / 300));

      if (local > 0) {
        n.lockProgress = local;
      }
    });
  });

  // 4. ERROR PURGE (3.2s → 4.2s)
  timeline.add(3200, 1000, (p) => {

    nodes.forEach((n, i) => {
      if (!n.purged && p > i * 0.08) {

        n.purged = true;

        n.querySelectorAll(".error-label").forEach(el => {
          el.classList.add("purge");
        });

        const leak = n.querySelector(".leak");
        if (leak) leak.style.opacity = 0;
      }
    });
  });

  // 5. RESOLVE (4.2s → 5.5s)
  timeline.add(4200, 1300, (p) => {

    nodes.forEach((n, i) => {
      if (!n.resolved && p > i * 0.08) {

        n.resolved = true;
        n.classList.add("resolved-active");
      }
    });
  });

  // 6. STABILIZE (5.5s+)
  timeline.add(5500, 2000, () => {

    hero.classList.add("controlled");

    nodes.forEach(n => {
      n.stable = true;
    });
  });

  /* ===============================
     🎥 ANIMATION LOOP
  =============================== */

  function animate(now) {

    const t = now - startTime;
    timeline.update(t);

    nodes.forEach(n => {

      // 🌀 CHAOS
      if (!n.lockProgress) {

        n.angle += n.speed;

        n.x = n.baseX + Math.cos(n.angle) * n.floatX;
        n.y = n.baseY + Math.sin(n.angle) * n.floatY;
      }

      // ⚡ LOCK-IN SNAP
      if (n.lockProgress) {

        const lp = n.lockProgress;

        n.x += (n.baseX - n.x) * (0.2 + lp * 0.3);
        n.y += (n.baseY - n.y) * (0.2 + lp * 0.3);

        if (lp < 0.3) {
          n.z += 2;
        }
      }

      // 🧠 STABLE MICRO MOTION
      if (n.stable) {

        const tt = now * 0.001;

        n.x += Math.sin(tt + n.order) * 0.05;
        n.y += Math.cos(tt + n.order) * 0.05;
      }

      // SAFE BOUNDS
      const left = -width / 2 + SIDE_PADDING + NODE_W / 2;
      const right = width / 2 - SIDE_PADDING - NODE_W / 2;

      const top = -height / 2 + TOP_PADDING + NODE_H / 2;
      const bottom = height / 2 - BOTTOM_PADDING - NODE_H / 2;

      n.x = Math.max(left, Math.min(right, n.x));
      n.y = Math.max(top, Math.min(bottom, n.y));

      // DEPTH
      n.z = Math.max(0, Math.min(30, n.z));
      const scale = 1 + n.z / 300;

      // GLOW
      const inner = n.querySelector(".node-inner");

      if (n.resolved) {
        inner.style.boxShadow =
          `0 0 20px rgba(34,197,94,0.5),
           0 0 40px rgba(59,130,246,0.3)`;
      } else {
        const glow = 10 + n.z;
        inner.style.boxShadow =
          `0 0 ${glow}px rgba(59,130,246,0.25),
           0 0 ${glow * 2}px rgba(139,92,246,0.15)`;
      }

      // TRANSFORM
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
