document.addEventListener("DOMContentLoaded", async () => {

  // ===============================
  // HERO PARTICLES
  // ===============================
  const canvas = document.getElementById("blog-particles");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;

    function resize() {
      const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        initParticles();
      }, 150);
    });

    resize();

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.4;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,255,${this.opacity})`;
        ctx.shadowColor = "rgba(99,102,241,0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (dx * dx + dy * dy < 12000) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(140,160,255,0.18)";
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }

    initParticles();
    requestAnimationFrame(animate);
  }

  // ===============================
  // BLOG SYSTEM
  // ===============================
  let blogs = [];

  try {
    const res = await fetch("blogs.json");
    blogs = await res.json();
  } catch (err) {
    console.error(err);
    return;
  }

  if (!blogs.length) return;

  const featuredContainer = document.getElementById("featuredPost");
  const grid = document.getElementById("blogGrid");

  const featured = blogs.find(b => b.featured) || blogs[0];
  const remainingBlogs = blogs.filter(b => b !== featured);

  if (featuredContainer) {
    featuredContainer.innerHTML = `
      <img src="${featured.image}" alt="${featured.title}">
      <div class="blog-content">
        <div class="blog-meta">
          <span>${featured.category}</span>
          <span>${featured.readTime}</span>
        </div>
        <h3>${featured.title}</h3>
        <p>${featured.description}</p>
        <a href="${featured.url}" class="blog-read">Read Article →</a>
      </div>
    `;
  }

  if (grid) {
    grid.innerHTML = remainingBlogs.map(blog => `
      <div class="blog-card">
        <img src="${blog.image}" alt="${blog.title}">
        <div class="blog-content">
          <div class="blog-meta">
            <span>${blog.category}</span>
            <span>${blog.readTime}</span>
          </div>
          <h3>${blog.title}</h3>
          <p>${blog.description}</p>
          <a href="${blog.url}" class="blog-read">Read Article →</a>
        </div>
      </div>
    `).join("");
  }

}); // DOM Close
