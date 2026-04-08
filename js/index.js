document.addEventListener("DOMContentLoaded", () => {

  if (window.lucide) {
  lucide.createIcons();
}
// ============================================================================================================================
// 1. DESKTOP HERO
// ============================================================================================================================
  const NAV_HEIGHT = 80;
  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    try {
      runMobileHero();
    } catch (e) {
    console.error("Mobile hero error:", e);
    }
  }
  const svg = document.getElementById("connections");
  if (!svg || !hero || !core) {
    console.warn("Desktop hero skipped");
  } else {
  const PHASE_DELAY = 3000;
  let tl = null;
  function getNodeSize() {
  const w = window.innerWidth;
  if (w < 768) return { w: 0, h: 0 }; // disabled
  if (w < 1200) return { w: 110, h: 80 };
  return { w: 140, h: 100 };
  }
  let { w: NODE_W, h: NODE_H } = getNodeSize();
  window.addEventListener("resize", () => {
  const size = getNodeSize();
  NODE_W = size.w;
  NODE_H = size.h;
  });
  const SIDE_PADDING = 40;
  const TOP_PADDING = 120;
  const BOTTOM_PADDING = 80;
  let width, height;
  let controlled = false;
  let frozen = false;
  let isRunning = false;
  let timelineTimeouts = [];

  function clearTimeline() {
    timelineTimeouts.forEach(t => clearTimeout(t));
    timelineTimeouts = [];
    if (tl) {
      tl.kill();
      tl = null;
    }
  }

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }
  updateBounds();
  window.addEventListener("resize", updateBounds);
  // 🔁 FULL RESET FOR LOOP //
  function resetSystem() {
    resetConnections();
    clearTimeline();
    controlled = false;
    frozen = false;
    isRunning = false;
    hero.classList.remove("controlled");
    // reset nodes
    nodes.forEach(n => {
      n.classList.remove("resolved-active");
      n.style.opacity = "";
      n.querySelector(".node-inner").style.boxShadow = "";
      n.style.transform = `
        translate3d(${n.baseX}px, ${n.baseY}px, 0px)
        translate(-50%, -50%)
        scale(1)
      `;
      n.x = n.baseX;
      n.y = n.baseY;
      n.angle = Math.random() * Math.PI * 2;
      n.speed = 0.002 + Math.random() * 0.003; // 🔥 re-randomize speed
    });
  }
  function restartTimeline() {
    isRunning = false; // 🔥 allow restart
    resetSystem();
    setTimeout(() => {
      isRunning = true;
      animate();
      startTimeline();
    }, 800);
  }
  // POSITION SETUP //
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
  // CONNECTION SYSTEM //
  function drawConnection(node) {
    if (svg.childElementCount > 50) return;
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
    const isTopNode = nodeCenter.y < coreCenter.y;
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
    // 🔥 exact rectangle intersection (no inward shift)
    let tX = halfW / Math.abs(nx);
    let tY = halfH / Math.abs(ny);
    // choose nearest boundary
    let t = Math.min(tX, tY);
    // 🔥 PERFECT EDGE POINT
    const nodeEdge = {
      x: nodeCenter.x - nx * t,
      y: nodeCenter.y - ny * t
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
      svg.innerHTML = ""; // 🔥 hard clear EVERYTHING
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.innerHTML = `
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      `;
      svg.appendChild(defs);
    }
  window.addEventListener("resize", resetConnections);
    
  // STABILITY DETECTION //
  function waitForStabilization(callback) {
    setTimeout(callback, 500); // 🔥 SIMPLE + RELIABLE
  }
  // CONTROL TIMELINE (EXTRACTED) //
function startTimeline() {
  if (typeof gsap === "undefined") return;
  controlled = false;
  frozen = false;
  tl = gsap.timeline({
    defaults: { ease: "power2.out" }
  });
  tl.call(() => {
  controlled = false;
  frozen = false;
  });
  // STEP 1.1 — CHAOS PHASE (FLOATING ACTIVE)
  tl.to({}, {
    duration: 2.5 // 🔥 let chaos breathe
  });
  // STEP 1.2 — CORE APPEARS + SYSTEM CONTROL
  tl.to(hero, {
    duration: 0.6,
    onStart: () => {
      controlled = true;
      hero.classList.add("controlled");
    }
  });
  // STEP 1.3 — STABILIZATION (smooth pull-in)
  tl.to({}, {
    duration: 1.5,
    onStart: () => {
      frozen = true;
    }
  });
  tl.add(() => {}, "+=0.5");
  // STEP 2 — draw connections + resolve nodes
  nodes.forEach((n, i) => {
    tl.add(() => {
      const path = drawConnection(n);
      if (path) {
        path.getBoundingClientRect();
        path.classList.add("active");
      }
    }, `+=${i === 0 ? 0 : 0.6}`);

    tl.to(n, {
      duration: 0.4,
      onStart: () => {
        n.classList.add("resolved-active");
        n.querySelector(".node-inner").style.boxShadow = `
          0 0 25px rgba(34,197,94,0.7),
          0 0 50px rgba(59,130,246,0.4)
        `;
      }
    }, `+=0.2`);
  });

  // LOOP
  tl.call(() => {
    const t = setTimeout(() => restartTimeline(), 2000);
    timelineTimeouts.push(t); // 🔥 track it
  });
}
  // ANIMATION LOOP //
  function animate() {
    if (!isRunning) return; // 🔥 STOP LOOP
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
        // 🔥 keep subtle motion instead of full lock
        n.angle += n.speed * 0.3;
        n.x = n.baseX + Math.cos(n.angle) * 5;
        n.y = n.baseY + Math.sin(n.angle) * 5;
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
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isRunning) {
          resetSystem();
          isRunning = true;
          animate(); // 🔥 restart loop
          setTimeout(() => {
            startTimeline();
          }, PHASE_DELAY);
        }
      } else {
        // 🔥 HARD RESET ALWAYS
        isRunning = false;
        clearTimeline();
        resetSystem();
      }
    });
  }, { threshold: 0.1 });
  heroObserver.observe(hero);
  // 🔥 TAB VISIBILITY FIX (PREVENT TIMER BURST)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // user switched tab → stop everything
      clearTimeline();
    } else {
      // user came back → clean restart
      resetSystem();
      isRunning = true;
      animate(); // 🔥 ADD THIS
      setTimeout(() => {
        startTimeline();
      }, 300);
    }
  });
  animate();
  } //else block closed Desktop hero skipped
  // ============================================================================================================================
  // 2. MOBILE HERO
  // ============================================================================================================================
  function runMobileHero() {
  const node = document.getElementById("mobileNode");
  const core = document.getElementById("mobileCore");
  const revenue = document.querySelector(".mobile-revenue");
  const bars = document.querySelectorAll(".mobile-chart .bar");
  const metrics = document.querySelectorAll(".mobile-metrics .metric");
  const connection = document.querySelector(".mobile-connection");
  if (!node || !core || !revenue) return;
  let timeouts = [];
  let mobileObserver;
  let isRunning = false;   // 🔥 NEW
  function clearAllTimers() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
  }
function reset() {
  clearAllTimers();
  isRunning = false;

  if (typeof gsap !== "undefined") {
    gsap.set(node, { opacity: 0 });
    gsap.set(core, { opacity: 0, scale: 0.9 });
    gsap.set(revenue, { opacity: 0 });

    bars.forEach(bar => gsap.set(bar, { height: "5%" }));
    metrics.forEach(m => gsap.set(m, { opacity: 0, y: 10 }));
  }

  if (connection) {
    connection.classList.remove("active");
    void connection.offsetHeight;
  }

  const items = document.querySelectorAll(".mobile-node .item");
  items.forEach(item => {
    const mobileerror = item.querySelector(".mobile-error");
    const mobileresolved = item.querySelector(".mobile-resolved");

    mobileerror.style.opacity = 0;
    mobileerror.classList.remove("active");
    mobileresolved.style.opacity = 0;
  });
}
function runSequence() {
  if (isRunning || typeof gsap === "undefined") return;
  isRunning = true;

  const items = document.querySelectorAll(".mobile-node .item");

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      setTimeout(() => {
        reset();
        runSequence();
      }, 2000);
    }
  });

  // STEP 0 — show node
  tl.to(node, { opacity: 1, duration: 0.5 });

  // STEP 1 — errors appear
  items.forEach((item, i) => {
    const mobileerror = item.querySelector(".mobile-error");

    tl.to(mobileerror, {
      opacity: 1,
      duration: 0.4,
      onStart: () => error.classList.add("active")
    }, i * 0.4 + 0.6);
  });

  // STEP 2 — connection
  tl.to(connection, {
    opacity: 1,
    height: "20px",
    duration: 0.6
  }, "+=0.2");

  // STEP 3 — core
  tl.to(core, {
    opacity: 1,
    scale: 1,
    duration: 0.6
  }, "+=0.3");

  // STEP 4 — revenue
  tl.to(revenue, {
    opacity: 1,
    duration: 0.6
  }, "+=0.3");

  // STEP 5 — resolve + bars
items.forEach((item, i) => {
  const mobileerror = item.querySelector(".mobile-error");
  const mobileresolved = item.querySelector(".mobile-resolved");
  // ERROR DISAPPEARS
  tl.to(mobileerror, {
    opacity: 0,
    duration: 0.3
  });

  // RESOLVED APPEARS
  tl.to(mobileresolved, {
    opacity: 1,
    y: 0,
    duration: 0.4
  });

  // BAR + METRIC SYNC
  if (bars[i]) {
    tl.to(bars[i], {
      height: bars[i].dataset.height,
      duration: 0.5
    }, "<");
  }

  if (metrics[i]) {
    tl.to(metrics[i], {
      opacity: 1,
      y: 0,
      duration: 0.4
    }, "<");
  }
});
}
  // ✅ OBSERVER WITH STATE CONTROL
  mobileObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isRunning) {
          reset();        // 🔥 ensure clean start
          runSequence();
        }
      } else {
        reset();          // 🔥 FULL RESET ON EXIT
      }
    });
  }, { threshold: 0 });
  const target = document.querySelector(".mobile-system");
  if (target) mobileObserver.observe(target);
  // 🔥 FORCE RUN (backup for mobile bugs)
  setTimeout(() => {
  if (!isRunning) {
    reset();
    runSequence();
  }
  }, 800);
}

// ============================================================================================================================
// 3. ABOUT
// ============================================================================================================================
const aboutSection = document.querySelector('.about-belief');
if (aboutSection) {
  const aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutSection.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  aboutObserver.observe(aboutSection);
}
// RULES ENGINE (WITH HOVER INSPECT)
(function(){
  const engine = document.getElementById("rulesEngine");
  if (!engine) return;

  const rules = engine.querySelectorAll(".rule");
  const progress = document.getElementById("aboutflowProgress");
  const output = document.getElementById("rulesOutput");

  const outputs = [
    "Data Verified",
    "Coverage Confirmed",
    "Codes Aligned",
    "Claim Optimized",
    "Revenue Secured"
  ];

  let index = 0;
  let interval = null;
  let isHovering = false;

  function runSequence(){
    if (isHovering) return;

    rules.forEach(r => r.classList.remove("active"));
    rules[index].classList.add("active");

    progress.style.width = ((index + 1) / rules.length) * 100 + "%";
    output.textContent = outputs[index];

    output.classList.remove("inspect");
    output.classList.add("active");

    setTimeout(() => {
      output.classList.remove("active");
    }, 1200);

    index = (index + 1) % rules.length;
  }

  const rulesObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!interval) {
          runSequence();
          interval = setInterval(runSequence, 1800);
        }
      } else {
        clearInterval(interval);
        interval = null;
      }
    });
  }, { threshold: 0.4 });

  rulesObserver.observe(engine);

  rules.forEach((rule, i) => {
    rule.addEventListener("mouseenter", () => {
      isHovering = true;

      clearInterval(interval);
      interval = null;

      engine.classList.add("inspecting");
      rules.forEach(r => r.classList.remove("inspect-active"));
      rule.classList.add("inspect-active");

      progress.style.width = ((i + 1) / rules.length) * 100 + "%";

      output.textContent = rule.dataset.detail;
      output.classList.add("inspect", "active");
    });

    rule.addEventListener("mouseleave", () => {
      isHovering = false;

      engine.classList.remove("inspecting");
      rule.classList.remove("inspect-active");
      output.classList.remove("inspect");

      if (!interval) {
        interval = setInterval(runSequence, 1800);
      }
    });
  });
})();
// MICRO INTERACTIONS (APPLE LEVEL)
(function(){
  const engine = document.getElementById("rulesEngine");
  if (!engine) return;
  const glow = document.getElementById("cursorGlow");
  const tooltip = document.getElementById("ruleTooltip");
  const core = engine.querySelector(".engine-core");
  const rules = engine.querySelectorAll(".rule");
  // CURSOR GLOW
  engine.addEventListener("mousemove", (e) => {
    const rect = engine.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + "px";
    glow.style.top = (e.clientY - rect.top) + "px";
  });
  // TOOLTIP + PULSE
  rules.forEach(rule => {
    rule.addEventListener("mouseenter", () => {
      tooltip.textContent = rule.dataset.detail;
      tooltip.classList.add("active");
      core.classList.add("pulse");
      setTimeout(() => core.classList.remove("pulse"), 600);
    });
    rule.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 14 + "px";
      tooltip.style.top = e.clientY + 14 + "px";
    });
    rule.addEventListener("mouseleave", () => {
      tooltip.classList.remove("active");
    });
  });
})();
  
// ============================================================================================================================
// 4. PROOF SNAPSHOT
// ============================================================================================================================
const proofSection = document.querySelector(".proof-snapshot");
if (proofSection) {
  const metrics = proofSection.querySelectorAll(".metric h3");
  let isAnimating = false;
  function animateMetrics() {
    metrics.forEach((metric, i) => {
      const target = parseInt(metric.dataset.target);
      const duration = 1600; // 🔥 increase for slower (1200–2000 ideal)
      const start = performance.now();
      setTimeout(() => {
        metric.parentElement.classList.add("visible");
      }, i * 150);
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        // easeOut (smooth finish)
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        metric.textContent = Math.round(value) + "%";
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    });
  }

  function resetMetrics() {
    metrics.forEach(metric => {
      metric.textContent = "0%";
      metric.parentElement.classList.remove("visible");
    });
  }

  const proofObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isAnimating) {
        isAnimating = true;
        animateMetrics();
      } else if (!entry.isIntersecting) {
        isAnimating = false;
        resetMetrics();
      }
    });
  }, { threshold: 0.4 });
  proofObserver.observe(proofSection);
}
  
// ============================================================================================================================
// 5. HOW IT WORKS
// ============================================================================================================================
(function(){
const hiwSection = document.querySelector(".how-it-works");
if (!hiwSection || typeof gsap === "undefined" || typeof Chart === "undefined") return;
gsap.registerPlugin(ScrollTrigger);

/* ELEMENTS */
const section = document.querySelector(".how-it-works");
const revEl = document.getElementById("revCounter");
const denEl = document.getElementById("denialCounter");
const aiEl = document.getElementById("aiText");
const transformEl = document.getElementById("transformBox");
const stepsEls = document.querySelectorAll(".narrative-step");
/* INITIAL VALUES */
const START_REVENUE = 128450;
const END_REVENUE = 260000;
const START_DENIAL = 32;
const END_DENIAL = 5;
/* STEP DATA */
const steps = [
  {
    ai: "42% intake errors eliminated before claim creation",
    transform: "Intake Errors → Clean Data"
  },
  {
    ai: "Eligibility verification reduced denials by 28%",
    transform: "Eligibility Issues → Verified Coverage"
  },
  {
    ai: "Claim validation increased acceptance to 96%",
    transform: "Coding Errors → Validated Claims"
  },
  {
    ai: "Denial recovery increased collections by 30%",
    transform: "Denials → Payments Collected"
  },
  {
    ai: "Fully optimized revenue cycle delivering predictable growth",
    transform: "System Optimized → Predictable Revenue"
  }
];
/* CHART INIT */
const ctx = document.getElementById("revChart");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["","","","",""],
    datasets: [
      {
       label: "Revenue",
        data: [50, 55, 60, 70, 80],
        borderColor: "#22c55e",
        borderWidth: 3,
        tension: 0.45,
        /* ✅ END POINT GLOW DOT */
        pointRadius: (ctx) => ctx.dataIndex === 4 ? 5 : 0,
        pointBackgroundColor: "#22c55e",
        pointHoverRadius: 6,
        fill: true,
        /* ✅ STRONGER GRADIENT */
        backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(34,197,94,0.45)");
        gradient.addColorStop(0.6, "rgba(34,197,94,0.15)");
        gradient.addColorStop(1, "rgba(34,197,94,0)");
        return gradient;
        }
      },
      {
        label: "Denials",
        data: [40, 38, 35, 30, 25],
        borderColor: "#ef4444",
        borderWidth: 2,
        tension: 0.45,
        pointRadius: 0
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: false }},
    interaction: { intersect: false },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  }
});
  gsap.to(".metric", {
  opacity: 1,
  y: 0,
  duration: 0.6,
  stagger: 0.2,
  ease: "power2.out"
});
  gsap.to(".graph-container canvas", {
  filter: "drop-shadow(0 0 18px rgba(34,197,94,0.35))",
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});
// GRAPH DOT TRACKING
const graphDot = document.getElementById("graphDot");

function updateGraphDot() {
  if (!chart || !graphDot) return;
  const meta = chart.getDatasetMeta(0);
  const point = meta.data[meta.data.length - 1];
  if (!point) return;
  const canvasRect = chart.canvas.getBoundingClientRect();
  const parentRect = chart.canvas.parentElement.getBoundingClientRect();
  const x = canvasRect.left - parentRect.left + point.x;
  const y = canvasRect.top - parentRect.top + point.y;
  graphDot.style.left = x + "px";
  graphDot.style.top = y + "px";
  if (state.progress > 0.15) {
    graphDot.style.opacity = 1;
  } else {
    graphDot.style.opacity = 0;
  }
}
/* HELPERS */
function lerp(a, b, t) {
  return a + (b - a) * t;
}
let state = { progress: 0 };
let currentStep = -1;
function getStepIndex(p) {
  if (p < 0.2) return 0;
  if (p < 0.4) return 1;
  if (p < 0.6) return 2;
  if (p < 0.8) return 3;
  return 4;
}
/* STEP UI UPDATE*/
const cta = document.getElementById("howCta");
cta.classList.remove("visible");
function updateStepUI(index) {
  if (currentStep === index) return;
  currentStep = index;
  const step = steps[index];
  // LEFT ACTIVE
  stepsEls.forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });
  // AI TEXT
  gsap.to(aiEl, {
    opacity: 0,
    y: 10,
    duration: 0.2,
    onComplete: () => {
      aiEl.innerText = step.ai;
      gsap.to(aiEl, { opacity: 1, y: 0, duration: 0.4 });
    }
  });
  transformEl.innerText = step.transform;
    if (index === 4) {
      cta.classList.add("visible");
    } else {
      cta.classList.remove("visible");
    }
}
/* SCROLL-DRIVEN SYSTEM */
const isMobile = window.innerWidth <= 768;
gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: isMobile ? "+=2400" : "+=3600",
    scrub: true,
    pin: true,
    snap: isMobile ? {
      snapTo: 1 / 4,
      duration: 0.3,
      ease: "power1.inOut"
    } : false
  }
})
.to(state, {
  progress: 1,
  ease: "none",
  onUpdate: () => {
    const p = state.progress;
    // smooth curve
    const smoothP = p * p * (3 - 2 * p);
    const easeOutExpo = (t) => 1 - Math.pow(2, -10 * t);
    const curve = Math.pow(smoothP, 1.8);
    /* ===== COUNTERS ===== */
    const revenue = lerp(START_REVENUE, END_REVENUE, smoothP);
    const denials = lerp(START_DENIAL, END_DENIAL, smoothP);
    revEl.innerText = "$" + Math.floor(revenue).toLocaleString();
    denEl.innerText = denials.toFixed(1) + "%";
    /* ===== GRAPH ===== */
    chart.data.datasets[0].data = [
      lerp(50, 70, curve),
      lerp(55, 95, curve),
      lerp(60, 140, curve),
      lerp(70, 200, curve),
      lerp(80, 260, curve)
    ];
    const boost = Math.pow(smoothP, 4) * 40;
    chart.data.datasets[0].data[4] += boost;
    
    chart.data.datasets[1].data = [
      lerp(40, 25, smoothP),
      lerp(38, 20, smoothP),
      lerp(35, 15, smoothP),
      lerp(30, 10, smoothP),
      lerp(25, 6, smoothP)
    ];
    chart.update("none");
    updateGraphDot();
    /* ===== STEP SYNC ===== */
    const stepIndex = Math.min(
      steps.length - 1,
      Math.floor(p * steps.length)
    );
    updateStepUI(stepIndex);
  }
});
/* FLOATING DASHBOARD */
gsap.to(".hiw-dashboard", {
  y: -8,
  duration: 3,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});
/* MICRO LIVE DRIFT */
setInterval(() => {
  if (state.progress < 0.95) return;
  const currentRev = parseFloat(revEl.innerText.replace(/[^0-9]/g, ""));
  const newRev = currentRev + Math.floor(Math.random() * 50);

  revEl.innerText = "$" + newRev.toLocaleString();

}, 3000);
})();
  
// ============================================================================================================================
// 6. SERVICES
// ============================================================================================================================
(function(){
  const flow = document.getElementById("rcmFlow");
  if (!flow || typeof gsap === "undefined") return;
  const flowNodes = flow.querySelectorAll(".flow-node");
  const flowLines = flow.querySelectorAll(".flow-line");
  const context = document.getElementById("rcmContext");
  if (!flowNodes.length) return;
  let tl;
  let hasPlayed = false;
  let isHovering = false;
  // INIT
  gsap.set(flowNodes, { opacity: 0, y: 20, scale: 0.95 });
  gsap.set(flowLines, {
    opacity: 0,
    scaleX: 0,
    transformOrigin: "left center"
  });
  function createTimeline() {
    tl = gsap.timeline({ paused: true });
    flowNodes.forEach((node, i) => {
      const line = flowLines[i];
      tl.to(node, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        onStart: () => {
          if (!isHovering) {
            flowNodes.forEach((n, j) => {
              n.classList.toggle("active", j <= i);
            });
          }
          if (context) {
            context.textContent = node.dataset.info || "";
          }
        }
      }, i * 0.35);
      if (line) {
        tl.to(line, {
          opacity: 1,
          scaleX: 1,
          duration: 0.4,
          ease: "power2.out"
        }, i * 0.35);
      }
    });
    tl.eventCallback("onComplete", () => {
      gsap.set(flowNodes, { opacity: 1 });
    });
  }
  createTimeline();
  // SCROLL
  const flowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasPlayed) {
        tl.restart();
        hasPlayed = true;
      } else if (!entry.isIntersecting) {
        hasPlayed = false;
      }
    });
  }, { threshold: 0.2 });
  flowObserver.observe(flow);
  // HOVER
  flowNodes.forEach((node, index) => {
    node.addEventListener("mouseenter", () => {
      isHovering = true;
      tl.pause();
      flowNodes.forEach((n, i) => {
        n.classList.toggle("active", i <= index);
      });
      if (context) {
        context.textContent = node.dataset.info || "";
      }
      gsap.to(node, { scale: 1.08, duration: 0.2 });
    });
    node.addEventListener("mouseleave", () => {
      isHovering = false;
      tl.resume();
      gsap.to(node, { scale: 1, duration: 0.2 });
    });
  });
})();

// ============================================================================================================================
// 7. OUTCOMES
// ============================================================================================================================
(function(){
const section = document.querySelector(".pg-outcomes-pro");
if(!section) return;
const hasGSAP = typeof gsap !== "undefined";
const hasChart = typeof Chart !== "undefined";
// ================= DATA =================
const data = [
  {
    specialty:"podiatry",
    title:"Podiatry Surgical Group",
    metric:28,
    label:"Increase in Surgical Collections",
    sub:"5 Locations • 90 Days",
    icon:"trending-up",
    graph:"growth"
  },
  {
    specialty:"dme",
    title:"DME Supplier",
    metric:40,
    label:"Reduction in Claim Rejections",
    sub:"Faster reimbursements",
    icon:"shield-check",
    graph:"decline"
  },
  {
    specialty:"mental",
    title:"Behavioral Health",
    metric:97,
    label:"Clean Claim Rate",
    sub:"Multi-payer optimization",
    icon:"badge-check",
    graph:"radial"
  },
  {
    specialty:"all",
    title:"Multi-Specialty Claims",
    metric:92,
    label:"First Pass Acceptance",
    sub:"System-wide improvement",
    icon:"zap",
    graph:"stability"
  }
];
// ================= ELEMENTS =================
const grid = document.getElementById("gridView");
const slider = document.getElementById("pgSlider");
const toggleBtns = section.querySelectorAll(".toggle-btn");
const explanation = section.querySelector(".pg-explanation");
let hasAnimated = false;
// ================= RENDER GRID =================
function renderGrid(){
  grid.innerHTML = `<div class="pg-outcomes-grid"></div>`;
  const container = grid.querySelector(".pg-outcomes-grid");
  data.forEach((d,i) => {
    const card = document.createElement("div");
    card.className = "pg-card";
    card.innerHTML = `
      <div class="pg-card-top">
        <div class="pg-icon-box">
          <i data-lucide="${d.icon}"></i>
        </div>
        <div class="pg-metric-wrap">
          <h3 class="pg-metric" data-target="${d.metric}">0%</h3>
          <h4>${d.label}</h4>
        </div>
      </div>
      <p>${d.title}</p>
      <span>${d.sub}</span>
      <p class="pg-graph-label">${getGraphLabel(d.graph)}</p>
      <canvas class="chart"></canvas>
    `;
    function getGraphLabel(type){
      if(type === "growth") return "Collections Growth Trend";
      if(type === "decline") return "Rejection Rate Reduction";
      if(type === "radial") return "Clean Claims Ratio";
      if(type === "stability") return "Acceptance Stability";
      return "";
    }
    container.appendChild(card);
    const canvas = card.querySelector("canvas");
    drawGraph(canvas, d.graph);
    // ================= GRAPH HOVER ANIMATION =================
        card.addEventListener("mouseenter", () => {
      if(canvas.chart){
        const target = d.metric;
        let baseData;
        if(d.graph === "growth"){
          baseData = [10, 20, 40, target];
        }
        else if(d.graph === "decline"){
          baseData = [target*2, target*1.5, target*1.2, target];
        }
        else if(d.graph === "stability"){
          baseData = [target-5, target-2, target-3, target];
        }
        else {
          baseData = [target, 100-target];
        }
        // reset to zero
        canvas.chart.data.datasets[0].data = baseData.map(()=>0);
        canvas.chart.update();
        // animate to real values
        setTimeout(()=>{
          canvas.chart.data.datasets[0].data = baseData;
          canvas.chart.update();
        }, 150);
      }
      // ================= DYNAMIC EXPLANATION =================
      if(explanation){
        explanation.classList.add("active");
        const titleEl = explanation.querySelector("h3");
        const descEl = explanation.querySelector("p");
        if(titleEl) titleEl.textContent = d.title;
        if(descEl) descEl.textContent =
          "AI-driven validation and denial intelligence optimized this workflow stage, improving revenue performance significantly.";
      }
    });
    card.addEventListener("mouseleave", () => {
      if(canvas.chart){
        canvas.chart.update();
      }
    });
  });
  lucide.createIcons();
}
// ================= GRAPH SYSTEM (ENHANCED) =================
function drawGraph(canvas,type){
  if(!hasChart) return;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0,0,0,100);
  gradient.addColorStop(0,"#6366f1");
  gradient.addColorStop(1,"#3b82f6");
  let config;
  if(type==="decline"){
    config={
      type:"line",
      data:{labels:["","","",""],datasets:[{
        data:[80,60,40,20],
        borderColor:"#ef4444",
        borderWidth:2,
        tension:0.5,
        fill:false,
        pointRadius:0
      }]},
      options:{animation:{duration:1200},plugins:{legend:false},scales:{x:{display:false},y:{display:false}}}
    };
  }
  else if(type==="radial"){
    config={
      type:"doughnut",
      data:{datasets:[{
        data:[97,3],
        backgroundColor:["#22c55e","#1e293b"]
      }]},
      options:{cutout:"70%",plugins:{legend:false},animation:{duration:1200}}
    };
  }
  else if(type==="stability"){
    config={
      type:"line",
      data:{labels:["","","",""],datasets:[{
        data:[60,65,63,68],
        borderColor:gradient,
        borderWidth:2,
        tension:0.4,
        pointRadius:0
      }]},
      options:{animation:{duration:1200},plugins:{legend:false},scales:{x:{display:false},y:{display:false}}}
    };
  }
  else {
    config={
      type:"line",
      data:{labels:["","","",""],datasets:[{
        data:[20,40,65,90],
        borderColor:gradient,
        borderWidth:3,
        tension:0.5,
        fill:false,
        pointRadius:0
      }]},
      options:{animation:{duration:1200},plugins:{legend:false},scales:{x:{display:false},y:{display:false}}}
    };
  }
  const chart = new Chart(canvas,config);
  canvas.chart = chart; // IMPORTANT (for hover interaction)
}
// ================= COUNTER ANIMATION =================
function animateCounters(){
  document.querySelectorAll(".pg-metric").forEach(el => {
    const target = parseInt(el.dataset.target);
    if(!hasGSAP){
      el.textContent = target + "%";
      return;
    }
    gsap.fromTo(el,
      {innerText:0},
      {
        innerText:target,
        duration:1.2,
        snap:{innerText:1},
        onUpdate:function(){
          el.textContent = Math.floor(el.innerText) + "%";
        }
      }
    );
  });
}
// ================= CAROUSEL =================
function renderSlides(){
  slider.innerHTML = "";
  const stories = [
    {
      title: "Podiatry Surgical Group",
      badge: "Podiatry • 5 Locations",
      problem: "High denial rates for surgical procedures and orthotics due to inconsistent coding.",
      solution: "Implemented structured coding validation and pre-submission claim intelligence.",
      result: "28% increase in surgical collections within 90 days with 92% first-pass acceptance."
    },
    {
      title: "DME Supplier",
      badge: "Durable Medical Equipment",
      problem: "Strict payer documentation caused frequent claim rejections and delayed payments.",
      solution: "Deployed payer-specific workflows and automated eligibility verification.",
      result: "40% reduction in claim rejections and significantly faster reimbursement cycles."
    },
    {
      title: "Behavioral Health Group",
      badge: "Mental Health • Multi-Payer",
      problem: "Authorization gaps and inconsistent follow-ups led to delayed reimbursements.",
      solution: "Optimized authorization workflows with real-time payer tracking.",
      result: "97% clean claim rate and 32% faster reimbursement cycles."
    },
    {
    title: "Internal Medicine Practice",
    badge: "Internal Medicine • Multi-location",
    problem: "Chronic undercoding and missed preventive billing opportunities.",
    solution: "AI-driven coding validation and preventive care optimization workflows.",
    result: "22% increase in average reimbursement per visit within 60 days."
  },
  {
    title: "Pediatrics Group",
    badge: "Pediatrics • High Volume",
    problem: "High claim denials due to eligibility and authorization gaps.",
    solution: "Real-time eligibility checks and pediatric-specific payer rules.",
    result: "35% reduction in denials and faster payment cycles."
  },
  {
    title: "Cardiology Center",
    badge: "Cardiology • Specialty Care",
    problem: "Complex procedure billing errors causing delayed reimbursements.",
    solution: "Procedure-level validation and denial prediction engine.",
    result: "30% faster reimbursements and improved first-pass acceptance."
  }
  ];
  stories.forEach((s,i)=>{
    const slide=document.createElement("div");
    slide.className="pg-slide"+(i===0?" active":"");
    slide.innerHTML=`
      <div class="pg-story-card">
        <span class="pg-badge">${s.badge}</span>
        <h3>${s.title}</h3>
        <div class="pg-story-block">
          <strong>Problem</strong>
          <p>${s.problem}</p>
        </div>
        <div class="pg-story-block">
          <strong>Solution</strong>
          <p>${s.solution}</p>
        </div>
        <div class="pg-story-block result">
          <strong>Outcome</strong>
          <p>${s.result}</p>
        </div>
        <div class="pg-story-cta">
          <a href="why-us.html" class="btn-primary btn-arrow">
            View Full Case
            <span class="icon-arrow"></span>
          </a>
        </div>
      </div>
    `;
    slider.appendChild(slide);
  });
}
let index=0;
let interval;
function startCarousel(){
  interval = setInterval(()=>{
    const slides=slider.querySelectorAll(".pg-slide");
    slides.forEach(s=>s.classList.remove("active"));
    index=(index+1)%slides.length;
    const active = slides[index];
    active.classList.add("active");
    if(hasGSAP){
      // kill previous animations (important for smoothness)
      gsap.killTweensOf(active);
      gsap.fromTo(
        active,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        active.querySelectorAll(".pg-story-block, h3, .pg-badge"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.08, delay: 0.1 }
      );
    }
  },8000);
}
// pause on hover
slider.addEventListener("mouseenter",()=>clearInterval(interval));
slider.addEventListener("mouseleave",startCarousel);
// ================= TOGGLE =================
let slidesRendered = false;
toggleBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    toggleBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".pg-view").forEach(v=>v.classList.remove("active"));
    const activeView = document.querySelector(".pg-"+btn.dataset.view);
    activeView.classList.add("active");
    // ✅ ONLY LOAD CASE STUDIES WHEN NEEDED
    if(btn.dataset.view === "stories"){
      if(!slidesRendered){
        renderSlides();
        slidesRendered = true;
      }
      startCarousel();
    } else {
      clearInterval(interval);
    }
  });
});
// ================= SIMULATOR (FIXED REAL INPUTS) =================
document.getElementById("simulateBtn").addEventListener("click",()=>{
  const claims = parseFloat(document.getElementById("claimsInput")?.value || 0);
  const avg = parseFloat(document.getElementById("avgInput")?.value || 0);
  const denial = (parseFloat(document.getElementById("denialInput")?.value || 0)) / 100;
  const recovery = claims * avg * denial * 0.25;
  document.getElementById("simResult").innerHTML =
    `Potential Recovery: <strong>$${Math.round(recovery).toLocaleString()}</strong>
     <div style="font-size:12px;color:#94a3b8;margin-top:6px">
       Based on industry benchmarks (18–32% leakage)
     </div>`;
});
// ================= SCROLL TRIGGER =================
const outcomesObserver = new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting && !hasAnimated){
    animateCounters();
    hasAnimated = true;
  }
},{threshold:0.4});
outcomesObserver.observe(section);
// ================= INIT =================
renderGrid();
})();
  
// ============================================================================================================================
// 7. EHR
// ============================================================================================================================
(function(){
const slider = document.querySelector('.ehr-slider');
const wrapper = document.querySelector('.ehr-track-wrapper');
const track = document.querySelector('.ehr-track');

if (slider && wrapper && track) {
  slider.classList.add('js-active');
  let isDown = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let lastX = 0;
  let raf;
  let autoSpeed = 0.35;
  function updateSpeed() {
    autoSpeed = window.innerWidth <= 768 ? 0.35 : 0.35;
  }
  updateSpeed();
  window.addEventListener('resize', updateSpeed);
  let isHovering = false;
  // INFINITE LOOP FIX
  function loopFix() {
    const maxScroll = slider.scrollWidth / 2;
    if (slider.scrollLeft >= maxScroll) {
      slider.scrollLeft -= maxScroll;
    }
    if (slider.scrollLeft <= 0) {
      slider.scrollLeft += maxScroll;
    }
  }
  // AUTO SCROLL ENGINE
  function autoScroll() {
    if (!isDown) {
      slider.scrollLeft += autoSpeed + velocity;
      velocity *= 0.95;
      if (Math.abs(velocity) < 0.01) velocity = 0;
      loopFix();
    }
    raf = requestAnimationFrame(autoScroll);
  }
  // DRAG START
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('dragging');
    cancelAnimationFrame(raf);
    startX = e.pageX;
    scrollLeft = slider.scrollLeft;
    lastX = e.pageX;
    velocity = 0;
  });
  // DRAG MOVE
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    slider.scrollLeft = scrollLeft - dx;
    velocity = (lastX - e.pageX) * 0.25;
    lastX = e.pageX;
  });
  // DRAG END
  function stopDrag() {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('dragging');
    snapToNearest();
    resumeAuto();
  }
  slider.addEventListener('mouseup', stopDrag);
  slider.addEventListener('mouseleave', stopDrag);
  // MAGNETIC SNAP
  function snapToNearest() {
    const logos = track.querySelectorAll('img');
    const current = slider.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    logos.forEach((logo) => {
      const offset = logo.offsetLeft;
      const dist = Math.abs(offset - current);
      if (dist < minDist) {
        minDist = dist;
        closest = offset;
      }
    });
    smoothScrollTo(closest, 400);
  }
  // SMOOTH SCROLL
  function smoothScrollTo(target, duration) {
    const start = slider.scrollLeft;
    const change = target - start;
    const startTime = performance.now();
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      slider.scrollLeft = start + change * ease;
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }
  // RESUME AUTO (VELOCITY BASED)
  function resumeAuto() {
    velocity += velocity * 1.2;
    raf = requestAnimationFrame(autoScroll);
  }
  // HOVER CONTROL
  slider.addEventListener('mouseenter', () => {
    isHovering = true;
    autoSpeed = 0.1;
  });
  slider.addEventListener('mouseleave', () => {
    isHovering = false;
    autoSpeed = 0.35;
  });
  // TOUCH SUPPORT (MOBILE)
  slider.addEventListener('touchstart', (e) => {
    isDown = true;
    cancelAnimationFrame(raf);
    startX = e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
    lastX = startX;
  });
  slider.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    e.preventDefault();   // 🔥 IMPORTANT
    const x = e.touches[0].pageX;
    const dx = x - startX;
    slider.scrollLeft = scrollLeft - dx;
    velocity = (lastX - x) * 0.25;
    lastX = x;
    }, { passive: false });
  slider.addEventListener('touchend', () => {
    isDown = false;
    snapToNearest();
    cancelAnimationFrame(raf);
    // 🔥 ensure restart ALWAYS
    setTimeout(() => {
      raf = requestAnimationFrame(autoScroll);
    }, 50);
  });
  slider.addEventListener('touchcancel', () => {
    isDown = false;
    raf = requestAnimationFrame(autoScroll);
  });
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(autoScroll);
      }
    });
  }, { threshold: 0.2 });
  observer.observe(slider); 
  // START ENGINE
  raf = requestAnimationFrame(autoScroll);
  }
})();
// ============================================================================================================================
// 8. ENGAGEMENT MODEL
// ============================================================================================================================
(function () {
  const section = document.querySelector(".engagement-model");
  if (!section || !window.gsap) return;
  const steps = section.querySelectorAll(".eng-step");
  const cards = section.querySelectorAll(".eng-proof-card");
  const tension = section.querySelector(".eng-tension");
  const bridge = section.querySelector(".eng-bridge");
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
    }
  });
  // STEP TIMELINE (staggered)
  tl.to(steps, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power3.out"
  });
  // PROOF CARDS
  tl.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power3.out"
  }, "-=0.3");
  // TENSION LINE
  tl.to(tension, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.2");
  // BRIDGE
  tl.to(bridge, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.3");
})();
// ============================================================================================================================
// 9. FINAL CTA
// ============================================================================================================================
// ================= FINAL CTA (LIGHT SYSTEM) =================

(function () {

  // TEXT ROTATION
  const texts = [
    "Analyzing revenue systems...",
    "Detecting claim inefficiencies...",
    "Reducing denial patterns...",
    "Optimizing collections flow..."
  ];

  const el = document.getElementById("finalctaLiveText");

  if (el) {
    let i = 0;

    setInterval(() => {
      i = (i + 1) % texts.length;

      el.style.opacity = 0;

      setTimeout(() => {
        el.textContent = texts[i];
        el.style.opacity = 1;
      }, 300);

    }, 2500);
  }

})();
  
}); // DOM Close


