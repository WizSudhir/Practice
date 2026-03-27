document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();
  // ============================================================================================================================
  // 1. DESKTOP HERO
  // ============================================================================================================================
  const hero = document.querySelector(".system-bg");
  const nodes = document.querySelectorAll(".node");
  const core = document.querySelector(".core");
  const svg = document.getElementById("connections");
  const revenue = document.getElementById("revenue");
  const PHASE_DELAY = 3000;
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    try {
      runMobileHero();
    } catch (e) {
    console.error("Mobile hero error:", e);
    }
  }
  if (!hero || !core || !revenue) {
  console.warn("Hero not found — skipping hero only");
  } else {
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
  // 🔁 FULL RESET FOR LOOP //
  function resetSystem() {
    controlled = false;
    frozen = false;
    revenueProgress = 0;
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
  // REVENUE INCREMENT LOGIC //
  function incrementRevenue() {
    const bars = document.querySelectorAll(".revenue .bar");
    const line = document.querySelector(".line-path");
    if (revenueProgress >= bars.length) return;
    const bar = bars[revenueProgress];
    bar.style.height = bar.dataset.height;
    bar.style.transform = "scaleY(1.1)";
    setTimeout(() => {
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
    // 🔥 BACKGROUND GLOW SYNC
    document.documentElement.style.setProperty(
      "--rev-glow",
      revenueProgress
    );
    // 🔁 TRIGGER LOOP AFTER LAST BAR + 2s
    if (revenueProgress === bars.length) {
      setTimeout(() => {
        resetSystem();
      }, 5000);
    }
  }
  // STABILITY DETECTION //
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
        requestAnimationFrame(check);
      }
    }
    check();
  }
  // CONTROL TIMELINE (EXTRACTED) //
  function startTimeline() {
    setTimeout(() => {
      hero.classList.add("controlled");
      core.style.display = "flex";
      revenue.classList.add("active");
      waitForStabilization(() => {
        frozen = true;
        nodes.forEach(n => {
          n.x = n.baseX;
          n.y = n.baseY;
        });
        setTimeout(() => {
          requestAnimationFrame(() => {
            nodes.forEach((n, i) => {
              setTimeout(() => {
                const path = drawConnection(n);
                path.getBoundingClientRect();
                path.classList.add("active");
                setTimeout(() => {
                  incrementRevenue();
                }, 420);
                setTimeout(() => {
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
    setTimeout(() => {
      controlled = true;
    }, 3500 + PHASE_DELAY);
  }
  // ▶️ INITIAL START
  startTimeline();
  // ANIMATION LOOP //
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
  let observer;
  let isRunning = false;   // 🔥 NEW
  function clearAllTimers() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
  }
  function reset() {
  clearAllTimers();
  isRunning = false;
  node.style.opacity = 0;
  core.classList.remove("active");
  revenue.style.opacity = 0;
  // 🔥 FIX: reset connection
  if (connection) {
    connection.classList.remove("active");
    void connection.offsetHeight; // force reflow
  }
  const items = document.querySelectorAll(".mobile-node .item");
  items.forEach(item => {
    const error = item.querySelector(".error");
    const resolved = item.querySelector(".resolved");
    error.style.opacity = 0;
    error.classList.remove("active");
    resolved.style.opacity = 0;
  });
  bars.forEach(bar => bar.style.height = "5%");
  metrics.forEach(m => {
    m.style.opacity = 0;
    m.style.transform = "translateY(10px)";
  });
  }
  function runSequence() {
    if (isRunning) return;   // 🔥 PREVENT DUPLICATE RUNS
    isRunning = true;
    clearAllTimers();
    const items = document.querySelectorAll(".mobile-node .item");
    // STEP 0 — Show chaos card
    timeouts.push(setTimeout(() => {
      node.style.opacity = 1;
    }, 500));
    // STEP 1 — Errors appear
    items.forEach((item, i) => {
      const error = item.querySelector(".error");
      timeouts.push(setTimeout(() => {
        error.style.opacity = 1;
        error.classList.add("active");
      }, 1200 + i * 1000));
    });
    const baseTime = 1200 + items.length * 1000;
    // STEP 1.5 — Draw connection
    timeouts.push(setTimeout(() => {
      if (connection) connection.classList.add("active");
    }, baseTime + 200));
    // STEP 2 — Core
    timeouts.push(setTimeout(() => {
      core.classList.add("active");
    }, baseTime + 1200));
    // STEP 3 — Revenue
    timeouts.push(setTimeout(() => {
      revenue.style.opacity = 1;
    }, baseTime + 2000));
    // STEP 4 — Replace + animate
    items.forEach((item, i) => {
      const error = item.querySelector(".error");
      const resolved = item.querySelector(".resolved");
      timeouts.push(setTimeout(() => {
        error.style.opacity = 0;
        error.classList.remove("active");
        resolved.style.opacity = 1;
        if (bars[i]) {
          bars[i].style.height = bars[i].dataset.height;
        }
        if (metrics[i]) {
          metrics[i].style.opacity = 1;
          metrics[i].style.transform = "translateY(0)";
        }
      }, baseTime + 2600 + i * 1200));
    });
    // 🔥 FIXED LOOP (RESET + RESTART CLEANLY)
    timeouts.push(setTimeout(() => {
      reset();
      runSequence();
    }, baseTime + 2600 + items.length * 1200 + 4000));
  }
  // ✅ OBSERVER WITH STATE CONTROL
  observer = new IntersectionObserver(entries => {
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
  }, { threshold: 0.4 });
  const target = document.querySelector(".mobile-system");
  if (target) observer.observe(target);
}
}
// ============================================================================================================================
// 3. ABOUT
// ============================================================================================================================
const aboutSection = document.querySelector('.about-system');

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
const systemCard = document.getElementById("systemCard");
if (systemCard) {
  systemCard.addEventListener("click", () => {
    systemCard.classList.toggle("active");
  });
}
// ============================================================================================================================
// 4. PROOF SNAPSHOT
// ============================================================================================================================
const proofSection = document.querySelector(".proof-snapshot");
if (proofSection) {
  const metrics = proofSection.querySelectorAll("h3");
  let hasAnimated = false;
  function animateMetrics() {
    metrics.forEach(metric => {
      const target = parseInt(metric.dataset.target);
      let current = 0;
      const increment = target / 40;
      function update() {
        current += increment;
        if (
          (target > 0 && current >= target) ||
          (target < 0 && current <= target)
        ) {
          metric.textContent = target + "%";
          return;
        }
        metric.textContent = Math.round(current) + "%";
        requestAnimationFrame(update);
      }
      update();
    });
  }
  function resetMetrics() {
    metrics.forEach(metric => {
      metric.textContent = "0%";
    });
    hasAnimated = false;
  }
  const proofObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        animateMetrics();
        hasAnimated = true;
      }
      if (!entry.isIntersecting) {
        resetMetrics(); // 🔥 THIS WAS MISSING
      }
    });
  }, { threshold: 0.4 });
  proofObserver.observe(proofSection);
}
  
// ============================================================================================================================
// HOW IT WORKS
// ============================================================================================================================
(function(){
const hiwSection = document.querySelector(".how-it-works");
if (!hiwSection || typeof gsap === "undefined" || typeof Chart === "undefined") return;

gsap.registerPlugin(ScrollTrigger);

/* =========================
   ELEMENTS
========================= */
const section = document.querySelector(".how-it-works");

const revEl = document.getElementById("revCounter");
const denEl = document.getElementById("denialCounter");
const aiEl = document.getElementById("aiText");
const transformEl = document.getElementById("transformBox");

const stepsEls = document.querySelectorAll(".narrative-step");

/* =========================
   INITIAL VALUES
========================= */
const START_REVENUE = 128450;
const END_REVENUE = 260000;

const START_DENIAL = 32;
const END_DENIAL = 5;

/* =========================
   STEP DATA
========================= */
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

/* =========================
   CHART INIT (STRIPE STYLE)
========================= */
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
        pointRadius: 0,
        fill: true,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(34,197,94,0.25)");
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
    animation: false,
    plugins: { legend: { display: false }},
    interaction: { intersect: false },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  }
});
// =========================
// GRAPH DOT TRACKING
// =========================
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

/* =========================
   HELPERS
========================= */
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

/* =========================
   STEP UI UPDATE
========================= */
const cta = document.getElementById("howCta");
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
}

/* =========================
   SCROLL-DRIVEN SYSTEM
========================= */
gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "+=2200",
    scrub: true,
    pin: true,
    anticipatePin: 1
  }
})
.to(state, {
  progress: 1,
  ease: "none",
  onUpdate: () => {

    const p = state.progress;
    // 🔥 CTA EMERGE FROM GRAPH DOT
    if (cta && graphDot) {
      if (p > 0.92 && !cta.classList.contains("active")) {
        cta.classList.add("active");
        const dotRect = graphDot.getBoundingClientRect();
        const ctaRect = cta.getBoundingClientRect();
        const dx = dotRect.left - ctaRect.left;
        const dy = dotRect.top - ctaRect.top;
        gsap.fromTo(cta,
          {
            opacity: 0,
            scale: 0.2,
            x: dx,
            y: dy
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power4.out"
          }
        );
        gsap.fromTo(
          "#howCta .cta-content > *",
          { opacity: 0, y: 10 },
          {
            opacity: 1,
             y: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.2
          }
        );
        // DOT BURST
        gsap.to(graphDot, {
          scale: 6,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      }
      if (p <= 0.92 && cta.classList.contains("active")) {
        cta.classList.remove("active");
        graphDot.style.opacity = 1;
        graphDot.style.transform = "translate(-50%, -50%) scale(1)";
      }
    }
    // smooth curve
    const smoothP = p * p * (3 - 2 * p);

    /* ===== COUNTERS ===== */
    const revenue = lerp(START_REVENUE, END_REVENUE, smoothP);
    const denials = lerp(START_DENIAL, END_DENIAL, smoothP);

    revEl.innerText = "$" + Math.floor(revenue).toLocaleString();
    denEl.innerText = denials.toFixed(1) + "%";

    /* ===== GRAPH ===== */
    chart.data.datasets[0].data = [
      lerp(50, 90, smoothP),
      lerp(55, 120, smoothP),
      lerp(60, 150, smoothP),
      lerp(70, 190, smoothP),
      lerp(80, 240, smoothP)
    ];

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
    const stepIndex = getStepIndex(p);
    updateStepUI(stepIndex);
  }
});

/* =========================
   FLOATING DASHBOARD
========================= */
gsap.to(".hiw-dashboard", {
  y: -8,
  duration: 3,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});

/* =========================
   MICRO LIVE DRIFT
========================= */
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

const nodes = document.querySelectorAll(".flow-node");
const glow = document.getElementById("flowGlow");
const context = document.getElementById("rcmContext");

if (!nodes.length || !glow || !context) return;

function moveGlow(target) {

  const rect = target.getBoundingClientRect();
  const parent = target.parentElement.getBoundingClientRect();

  const x = rect.left - parent.left + rect.width / 2;
  const y = rect.top - parent.top + rect.height / 2;

  // smooth movement (GSAP if available)
  if (typeof gsap !== "undefined") {
    gsap.to(glow, {
      x: x,
      y: y,
      duration: 0.6,
      ease: "power2.out"
    });
  } else {
    glow.style.transform = `translate(${x}px, ${y}px)`;
  }
  glow.style.transition = "all 0.6s cubic-bezier(0.22,1,0.36,1)";
  glow.style.opacity = 1;
}

function activateUpTo(index) {
  nodes.forEach(n => n.classList.remove("active"));
  for (let i = 0; i <= index; i++) {
    nodes[i].classList.add("active");
  }
}

nodes.forEach((node, index) => {

  node.addEventListener("mouseenter", () => {
    activateUpTo(index);
    moveGlow(node);
    context.innerText = node.dataset.info;
    // ✅ ADD THIS EXACTLY HERE
    if (index === nodes.length - 1) {
      document.querySelector(".rcm-system").classList.add("complete");
    } else {
      document.querySelector(".rcm-system").classList.remove("complete");
    }
  });

});

// AUTO FLOW (IDLE ANIMATION)
let current = 0;

const interval = setInterval(() => {

  if (!document.hidden) {

    const index = current % nodes.length;
    const node = nodes[index];
    activateUpTo(index);
    moveGlow(node);
    context.innerText = node.dataset.info;

    if (index === nodes.length - 1) {
      document.querySelector(".rcm-system").classList.add("complete");
    } else {
      document.querySelector(".rcm-system").classList.remove("complete");
    }
    current++;
  }

}, 2200);

// STOP ON USER INTERACTION
nodes.forEach(node => {
  node.addEventListener("mouseenter", () => {
    clearInterval(interval);
  });
});

})();
// ============================================================================================================================
// 7. EHR
// ============================================================================================================================
const ehrSection = document.querySelector('.ehr-premium');

if (ehrSection) {
  const ehrObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      ehrSection.classList.add('active');
    }
  }, { threshold: 0.3 });

  ehrObserver.observe(ehrSection);
}  

// ============================================================================================================================
// 8. EDITORIAL INSIGHTS
// ============================================================================================================================
const insightsSection = document.querySelector('.insights-editorial');

if (insightsSection) {
  const insightsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      insightsSection.classList.add('active');
    }
  }, { threshold: 0.3 });

  insightsObserver.observe(insightsSection);
}
}); // DOM Close


