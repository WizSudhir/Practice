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
  const svg = document.getElementById("connections");
  if (!svg) {
    console.warn("SVG connections not found");
    return;
  }
  const PHASE_DELAY = 3000;
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    try {
      runMobileHero();
    } catch (e) {
    console.error("Mobile hero error:", e);
    }
  }
  if (!hero || !core) {
  console.warn("Hero not found — skipping hero only");
  } else {
  let timelineStarted = false;
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
  }

  function updateBounds() {
    width = hero.clientWidth;
    height = hero.clientHeight;
  }
  updateBounds();
  window.addEventListener("resize", updateBounds);
  // 🔁 FULL RESET FOR LOOP //
  function resetSystem() {
    clearTimeline();
    timelineStarted = false;
    controlled = false;
    frozen = false;
    isRunning = false;
    hero.classList.remove("controlled");
    resetConnections();
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
      n.angle = 0;
    });
  }
  function restartTimeline() {
  if (!isRunning) return; // safety
  resetSystem();
  setTimeout(() => {
    startTimeline();
  }, 300);
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
    if (timelineStarted) return;   // 🔥 HARD LOCK
    timelineStarted = true;
    if (isRunning) return;
    isRunning = true;
    timelineTimeouts.push(setTimeout(() => {

  waitForStabilization(() => {
    setTimeout(() => {
      frozen = true;
    }, 800);

    nodes.forEach(n => {
      n.x = n.baseX;
      n.y = n.baseY;
    });

    timelineTimeouts.push(setTimeout(() => {

      requestAnimationFrame(() => {

        nodes.forEach((n, i) => {

          timelineTimeouts.push(setTimeout(() => {

            requestAnimationFrame(() => {
              const path = drawConnection(n);
              path.getBoundingClientRect();
              path.classList.add("active");
            });

            timelineTimeouts.push(setTimeout(() => {
              n.classList.add("resolved-active");
              n.querySelector(".node-inner").style.boxShadow = `
                0 0 25px rgba(34,197,94,0.7),
                0 0 50px rgba(59,130,246,0.4)
              `;
            }, 840));

          }, i * 600 + Math.random() * 500));

        });

      });

    }, 720));

  });

}, 2000 + PHASE_DELAY));
    timelineTimeouts.push(setTimeout(() => {
      controlled = true;
      hero.classList.add("controlled");
      }, 1000 + PHASE_DELAY));
    timelineTimeouts.push(setTimeout(() => {
    restartTimeline();
    }, 9000 + PHASE_DELAY));
  }
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
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isRunning) {
          resetSystem();
          setTimeout(() => {
            startTimeline();
            }, 300);
        }
      } else {
        setTimeout(() => {
          if (!hero.matches(":hover")) {
            resetSystem();
            }
          }, 300);
            }
          });
        }, { threshold: 0.2 });
  observer.observe(hero);
  // 🔥 TAB VISIBILITY FIX (PREVENT TIMER BURST)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // user switched tab → stop everything
      clearTimeline();
    } else {
      // user came back → clean restart
      resetSystem();
      setTimeout(() => {
        startTimeline();
      }, 300);
    }
  });
    
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
// RULES ENGINE (WITH HOVER INSPECT)
(function(){
  const engine = document.getElementById("rulesEngine");
  if (!engine) return;
  const rules = engine.querySelectorAll(".rule");
  const progress = document.getElementById("flowProgress");
  const output = document.getElementById("rulesOutput");
  const outputs = [
    "Data Verified",
    "Coverage Confirmed",
    "Codes Aligned",
    "Claim Optimized",
    "Revenue Secured"
  ];
  let index = 0;
  let interval;
  let isHovering = false;

  function runSequence(){
    if (!isHovering) {
    flowNodes.forEach((n, j) => {
      n.classList.toggle("active", j <= i);
    });
    }
    rules.forEach(r => r.classList.remove("active"));
    rules[index].classList.add("active");
    const percent = ((index + 1) / rules.length) * 100;
    progress.style.width = percent + "%";
    output.textContent = outputs[index];
    output.classList.remove("inspect");
    output.classList.add("active");
    setTimeout(() => {
      output.classList.remove("active");
    }, 1200);
    index++;
    if (index >= rules.length) {
      setTimeout(() => {
        index = 0;
        progress.style.width = "0%";
      }, 1200);
    }
  }
  // AUTO LOOP
  const observer = new IntersectionObserver(entries => {
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
  observer.observe(engine);

  // HOVER INSPECT MODE
  rules.forEach((rule, i) => {
    rule.addEventListener("mouseenter", () => {
      isHovering = true;
      engine.classList.add("inspecting");
      rules.forEach(r => r.classList.remove("inspect-active"));
      rule.classList.add("inspect-active");
      // freeze progress
      const percent = ((i + 1) / rules.length) * 100;
      progress.style.width = percent + "%";
      // show detailed explanation
      const detail = rule.dataset.detail;
      output.textContent = detail;
      output.classList.add("inspect");
      output.classList.add("active");
    });
    rule.addEventListener("mouseleave", () => {
      isHovering = false;
      engine.classList.remove("inspecting");
      rule.classList.remove("inspect-active");
      output.classList.remove("inspect");
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
cta.style.display = "none";
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
      cta.style.display = "block";
    } else {
      cta.style.display = "none";
    }
}
/* SCROLL-DRIVEN SYSTEM */
gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "+=2600",
    scrub: true,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1
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
    const stepIndex = getStepIndex(p);
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
// Revenue Chart below Sim Result
let revenueChart;
function initRevenueChart(){
  const ctx = document.getElementById("revenueChart");
  if(!ctx || !hasChart) return;
  revenueChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Month 1","Month 2","Month 3","Month 4"],
      datasets: [
        {
          label: "Current Revenue",
          data: [0,0,0,0],
          borderColor: "#ef4444",
          tension: 0.4
        },
        {
          label: "Optimized Revenue",
          data: [0,0,0,0],
          borderColor: "#22c55e",
          tension: 0.4
        }
      ]
    },
    options: {
      plugins: { legend: false },
      scales: { x:{display:false}, y:{display:false} },
      animation: { duration: 800 }
    }
  });
}
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
          <a href="why-us.html" class="btn-outline">
            View Full Case →
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
  },4000);
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
const resultEl = document.getElementById("simResult");
resultEl.innerHTML =
  `Potential Recovery: <strong>$${Math.round(recovery).toLocaleString()}</strong>
   <div style="font-size:12px;color:#94a3b8;margin-top:6px">
     Based on industry benchmarks (18–32% leakage)
   </div>`;
// 🔥 GRAPH UPDATE
if(revenueChart){
  const current = claims * avg * (1 - denial);
  const improved = current + recovery;
  revenueChart.data.datasets[0].data = [
    current*0.9,
    current*0.95,
    current,
    current*1.02
  ];
  revenueChart.data.datasets[1].data = [
    improved*0.9,
    improved*1.0,
    improved*1.1,
    improved*1.2
  ];
  revenueChart.update();
}
// ================= SCROLL TRIGGER =================
const observer = new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting && !hasAnimated){
    animateCounters();
    hasAnimated = true;
  }
},{threshold:0.4});
observer.observe(section);
// ================= INIT =================
renderGrid();
initRevenueChart();
})();
  
// ============================================================================================================================
// 7. EHR
// ============================================================================================================================
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
  let isHovering = false;

  // =======================
  // INFINITE LOOP FIX
  // =======================
  function loopFix() {
    const maxScroll = wrapper.scrollWidth / 2;

    if (wrapper.scrollLeft >= maxScroll) {
      wrapper.scrollLeft -= maxScroll;
    }
    if (wrapper.scrollLeft <= 0) {
      wrapper.scrollLeft += maxScroll;
    }
  }

  // =======================
  // AUTO SCROLL ENGINE
  // =======================
  function autoScroll() {
    if (!isDown) {
      wrapper.scrollLeft += autoSpeed + velocity;
      velocity *= 0.95;

      if (Math.abs(velocity) < 0.01) velocity = 0;

      loopFix();
    }

    raf = requestAnimationFrame(autoScroll);
  }

  // =======================
  // DRAG START
  // =======================
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('dragging');

    cancelAnimationFrame(raf);

    startX = e.pageX;
    scrollLeft = wrapper.scrollLeft;
    lastX = e.pageX;
    velocity = 0;
  });

  // =======================
  // DRAG MOVE
  // =======================
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    const dx = e.pageX - startX;
    wrapper.scrollLeft = scrollLeft - dx;

    velocity = (lastX - e.pageX) * 0.25;
    lastX = e.pageX;
  });

  // =======================
  // DRAG END
  // =======================
  function stopDrag() {
    if (!isDown) return;

    isDown = false;
    slider.classList.remove('dragging');

    snapToNearest();
    resumeAuto();
  }

  slider.addEventListener('mouseup', stopDrag);
  slider.addEventListener('mouseleave', stopDrag);

  // =======================
  // MAGNETIC SNAP
  // =======================
  function snapToNearest() {
    const logos = track.querySelectorAll('img');
    const current = wrapper.scrollLeft;

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

  // =======================
  // SMOOTH SCROLL
  // =======================
  function smoothScrollTo(target, duration) {
    const start = wrapper.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = 1 - Math.pow(1 - progress, 3);

      wrapper.scrollLeft = start + change * ease;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // =======================
  // RESUME AUTO (VELOCITY BASED)
  // =======================
  function resumeAuto() {
    velocity += velocity * 1.2;
    raf = requestAnimationFrame(autoScroll);
  }

  // =======================
  // HOVER CONTROL
  // =======================
  slider.addEventListener('mouseenter', () => {
    isHovering = true;
    autoSpeed = 0.1;
  });

  slider.addEventListener('mouseleave', () => {
    isHovering = false;
    autoSpeed = 0.35;
  });

  // =======================
  // TOUCH SUPPORT (MOBILE)
  // =======================
  slider.addEventListener('touchstart', (e) => {
    isDown = true;
    cancelAnimationFrame(raf);

    startX = e.touches[0].pageX;
    scrollLeft = wrapper.scrollLeft;
    lastX = startX;
  });

  slider.addEventListener('touchmove', (e) => {
    if (!isDown) return;

    const x = e.touches[0].pageX;
    const dx = x - startX;

    wrapper.scrollLeft = scrollLeft - dx;

    velocity = (lastX - x) * 0.25;
    lastX = x;
  });

  slider.addEventListener('touchend', () => {
    isDown = false;
    snapToNearest();
    resumeAuto();
  });

  // =======================
  // START ENGINE
  // =======================
  autoScroll();
}
// ============================================================================================================================
// 8. ENGAGEMENT MODEL
// ============================================================================================================================
// ==========================
// GSAP ENGAGEMENT SYSTEM (FINAL)
// ==========================
gsap.registerPlugin(ScrollTrigger);

// 🔥 GLOBAL FIX (prevents weird scroll bugs)
ScrollTrigger.config({
  ignoreMobileResize: true
});

const steps = document.querySelectorAll('.eng-step');
const visual = document.getElementById('engVisual');

const revEl = document.getElementById('revValue');
const denialEl = document.getElementById('denialValue');
const statusEl = document.getElementById('engStatus');
const bars = document.querySelectorAll('.eng-bars .bar');

if (steps.length && visual) {

  // ==========================
  // STEP DATA (SYSTEM STATES)
  // ==========================
  const stepData = [
    {
      revenue: 85000,
      denials: 32,
      status: "Scanning system for revenue leakage...",
      bars: ["30%", "45%", "60%", "75%"]
    },
    {
      revenue: 95000,
      denials: 24,
      status: "Integrating workflows & validating data...",
      bars: ["40%", "55%", "70%", "85%"]
    },
    {
      revenue: 115000,
      denials: 12,
      status: "Optimizing claims & reducing denials...",
      bars: ["50%", "65%", "80%", "92%"]
    },
    {
      revenue: 128450,
      denials: 5,
      status: "Revenue system fully optimized...",
      bars: ["60%", "75%", "90%", "100%"]
    }
  ];

  let currentStep = -1;

  // ==========================
  // COUNTER ANIMATION
  // ==========================
  function animateCounter(el, start, end, prefix = "", suffix = "") {
    gsap.killTweensOf(el); // 🔥 prevents stacking

    gsap.to({ val: start }, {
      val: end,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: function () {
        el.textContent =
          prefix +
          Math.floor(this.targets()[0].val).toLocaleString() +
          suffix;
      }
    });
  }

  // ==========================
  // UPDATE VISUAL (RIGHT SIDE)
  // ==========================
  function updateVisual(index) {
    const data = stepData[index];

    // 🔥 kill ALL previous animations (critical)
    gsap.killTweensOf([revEl, denialEl, statusEl, bars]);

    // SAFE current values
    const currentRevenue =
      Number(revEl.textContent.replace(/\D/g, '')) || 0;

    const currentDenials =
      Number(denialEl.textContent.replace(/\D/g, '')) || 0;

    // Animate counters
    animateCounter(revEl, currentRevenue, data.revenue, "$");
    animateCounter(denialEl, currentDenials, data.denials, "", "%");

    // Status text (clean fade)
    gsap.to(statusEl, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        statusEl.textContent = data.status;
        gsap.to(statusEl, { opacity: 1, duration: 0.3 });
      }
    });

    // 🔥 Bars reset + stagger animation (fix sync issue)
    bars.forEach((bar, i) => {
      gsap.set(bar, { height: 0 });

      gsap.to(bar, {
        height: data.bars[i],
        duration: 0.5,
        delay: i * 0.05,
        ease: "power2.out"
      });
    });

    // Pulse effect
    visual.classList.add('active');
    setTimeout(() => visual.classList.remove('active'), 400);
  }

  // ==========================
  // STEP ACTIVATION
  // ==========================
  function activateStep(index) {
    if (index === currentStep) return;

    currentStep = index;

    steps.forEach(s => s.classList.remove('active'));
    steps[index].classList.add('active');

    updateVisual(index);
  }

  // ==========================
  // GSAP SCROLL STORY ENGINE (FIXED)
  // ==========================
  const totalSteps = steps.length;

  gsap.timeline({
    scrollTrigger: {
      trigger: ".engagement-gsap",
      start: `top+=${NAV_HEIGHT} top`,

      // 🔥 responsive scroll distance
      end: "+=" + (window.innerHeight * totalSteps),

      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,

      // 🔥 SNAP = fixes sync issues completely
      snap: {
        snapTo: 1 / (totalSteps - 1),
        duration: 0.3,
        ease: "power1.inOut"
      }
    }
  })
  .to({}, {
    duration: 1,
    onUpdate: function () {

      const progress = this.progress();

      // 🔥 ROUND instead of FLOOR (critical fix)
      let stepIndex = Math.round(progress * (totalSteps - 1));

      if (stepIndex >= totalSteps) {
        stepIndex = totalSteps - 1;
      }

      activateStep(stepIndex);
    }
  });

  // ==========================
  // INITIAL STATE FIX
  // ==========================
  activateStep(0);
}
// ============================================================================================================================
// 9. FINAL CTA
// ============================================================================================================================
// ==========================
// CTA LIVE SYSTEM TEXT
// ==========================
const ctaTexts = [
  "Analyzing revenue systems...",
  "Detecting claim inefficiencies...",
  "Reducing denial patterns...",
  "Optimizing collections flow..."
];

const ctaLiveEl = document.getElementById("ctaLiveText");

if (ctaLiveEl) {
  let index = 0;

  setInterval(() => {
    index = (index + 1) % ctaTexts.length;

    // fade out
    ctaLiveEl.style.opacity = 0;

    setTimeout(() => {
      ctaLiveEl.textContent = ctaTexts[index];
      ctaLiveEl.style.opacity = 1;
    }, 300);

  }, 2500);
}

// ==========================
// CTA ENTRANCE ANIMATION
// ==========================
const ctaSection = document.querySelector('.final-cta-pro');

if (ctaSection) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {

      gsap.from('.cta-content > *', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });

      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(ctaSection);
}

  
}); // DOM Close


