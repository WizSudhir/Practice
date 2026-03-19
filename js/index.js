document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");

  const NODE_W = 140;
  const NODE_H = 100;

  let width, height;

  /* ===============================
     SYSTEM STATE
  =============================== */
  let controlled = false;
  let startTime = performance.now();

  /* ===============================
     PARALLAX (APPLE LEVEL)
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
     ORBITAL BASE POSITIONS
  =============================== */
  function setupOrbit() {

    const total = nodes.length;

    nodes.forEach((n, i) => {

      const ring = i < total / 2 ? 0 : 1;
      const ringCount = total / 2;
      const index = i % ringCount;

      const angle = (index / ringCount) * Math.PI * 2;

      const radius = ring === 0 ? 160 : 260;

      n.baseRadius = radius;
      n.baseAngle = angle;
      n.orbitAngle = angle;

      n.x = Math.cos(angle) * radius;
      n.y = Math.sin(angle) * radius;

      n.z = ring === 0 ? 25 : 10;

      // chaos motion
      n.floatX = 40 + Math.random() * 20;
      n.floatY = 30 + Math.random() * 20;
      n.angle = Math.random() * Math.PI * 2;
      n.speed = 0.002 + Math.random() * 0.002;

      n.locked = false;
      n.resolved = false;
      n.order = i;
    });
  }

  setupOrbit();

  /* ===============================
     TIMELINE
  =============================== */
  function getTime() {
    return performance.now() - startTime;
  }

  /* ===============================
     ANIMATION LOOP
  =============================== */
  function animate(now) {

    const t = getTime();

    /* ===============================
       PARALLAX SMOOTHING
    =============================== */
    parallax.x += (mouse.x - parallax.x) * 0.05;
    parallax.y += (mouse.y - parallax.y) * 0.05;

    hero.style.transform = `
      rotateX(${parallax.y * 6}deg)
      rotateY(${parallax.x * 8}deg)
      scale(1.02)
    `;

    /* ===============================
       CORE TIMELINE
    =============================== */

    // CHAOS → 0–2s
    if (t < 2000) {
      nodes.forEach(n => {

        n.angle += n.speed;

        n.x = Math.cos(n.angle) * n.floatX + n.baseRadius * 0.2;
        n.y = Math.sin(n.angle) * n.floatY + n.baseRadius * 0.2;
      });
    }

    // CORE APPEAR → 2s
    if (t > 2000) {
      core.style.display = "flex";
      core.style.opacity = Math.min(1, (t - 2000) / 400);
      core.style.transform =
        `translate(-50%, -50%) scale(${0.7 + (t - 2000) / 2000})`;
    }

    // LOCK-IN → 2.4s–3.5s
    if (t > 2400 && !controlled) {

      nodes.forEach((n, i) => {

        const delay = i * 120;

        if (t > 2400 + delay) {

          const progress = Math.min(1, (t - 2400 - delay) / 600);

          // magnetic snap
          const targetX = Math.cos(n.baseAngle) * n.baseRadius;
          const targetY = Math.sin(n.baseAngle) * n.baseRadius;

          n.x += (targetX - n.x) * (0.08 + progress * 0.12);
          n.y += (targetY - n.y) * (0.08 + progress * 0.12);

          // depth punch
          if (progress < 0.3) {
            n.z += 1.5;
          }

          if (progress > 0.95) {
            n.locked = true;
          }
        }
      });
    }

    // CONTROLLED STATE → after 3.5s
    if (t > 3500) {
      controlled = true;
      hero.classList.add("controlled");
    }

    /* ===============================
       CONTROLLED ORBIT SYSTEM
    =============================== */
    if (controlled) {

      nodes.forEach(n => {

        // smooth orbit motion
        n.orbitAngle += 0.0012;

        const radius = n.baseRadius;

        const targetX = Math.cos(n.orbitAngle) * radius;
        const targetY = Math.sin(n.orbitAngle) * radius;

        // smooth follow (no jitter)
        n.x += (targetX - n.x) * 0.08;
        n.y += (targetY - n.y) * 0.08;

        // subtle breathing from core
        const pulse = Math.sin(now * 0.002 + n.order) * 2;

        n.x += (n.x / radius) * pulse;
        n.y += (n.y / radius) * pulse;

        // resolve visual
        if (!n.resolved) {
          n.resolved = true;
          n.classList.add("resolved-active");
        }
      });
    }

    /* ===============================
       APPLY TRANSFORMS
    =============================== */
    nodes.forEach(n => {

      const scale = 1 + n.z / 300;

      n.style.transform = `
        translate3d(${n.x}px, ${n.y}px, ${n.z}px)
        translate(-50%, -50%)
        scale(${scale})
      `;

      const inner = n.querySelector(".node-inner");

      if (controlled) {
        inner.style.boxShadow =
          `0 0 20px rgba(34,197,94,0.5),
           0 0 40px rgba(59,130,246,0.3)`;
      }
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

});
