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
// BLOG SYSTEM + FILTERING
// ===============================
let blogs = [];
let filteredBlogsState = []; // IMPORTANT: global filtered list
const POSTS_PER_PAGE = 6;
let currentPage = 1;
try {
  const res = await fetch("./blogs.json");
  blogs = await res.json();
} catch (err) {
  console.error("Error loading blogs:", err);
  return;
}
if (!blogs.length) return;
const featuredContainer = document.getElementById("featuredPost");
const grid = document.getElementById("blogGrid");
const searchInput = document.getElementById("blogSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
let activeFilter = "all";
// SORT BY LATEST (important)
blogs.sort((a, b) => {
  const d1 = new Date(a.date);
  const d2 = new Date(b.date);
  return d2 - d1;
});
// FEATURED
const featuredPosts = blogs.filter(b => b.featured);
if (featuredContainer) {
let currentFeatured = 0;

featuredContainer.innerHTML = featuredPosts.map((post, index) => `
  <div class="featured-card-new" data-index="${index}">
    
    <img src="${post.image}" alt="${post.title}">

    <div class="featured-overlay">
      
      <div class="featured-top">
        <span class="read-time">⏱ ${post.readTime}</span>
        <span class="tags">${post.category}</span>
      </div>

      <div class="featured-title">${post.title}</div>

    </div>

  </div>
`).join("");
cards = document.querySelectorAll(".featured-card-new");
}
// REMOVE featured from grid
let filteredBlogs = blogs.filter(b => !b.featured);
// ===============================
// RENDER FUNCTION - - FEATURED BLOGS
// ===============================
function renderBlogs(list) {
  if (!grid) return;
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginated = list.slice(start, end);
  if (!paginated.length) {
  grid.innerHTML = `<p style="text-align:center;">No articles found.</p>`;
  return;
  }
  grid.innerHTML = paginated.map(blog => `
    <div class="blog-card">
        <div class="blog-card-img">
          <img src="${blog.image}" alt="${blog.title}">
        </div>
      <div class="blog-content">
        <div class="blog-meta">
          <span>${blog.category}</span>
          <span>${blog.readTime}</span>
        </div>
        <h3>${blog.title}</h3>
        <p>${blog.description}</p>
        <a href="${blog.url}?id=${blog.id}" class="blog-read">Read Article →</a>
      </div>
    </div>
  `).join("");
  renderPagination(list.length);
}
// ===============================
// SLIDER LOGIC - FEATURED SECTION
// ===============================
let currentFeatured = 0;

const track = document.querySelector(".featured-track");
let cards = [];
const desc = document.getElementById("featuredDescription");

function updateFeatured() {

  const total = cards.length;
  const GAP = 16; // px gap between cards
  const containerWidth = track.offsetWidth;
  function px(percent) {
  return (percent / 100) * containerWidth;
  }
  cards.forEach((card, i) => {
    let pos = (i - currentFeatured + total) % total;

    // RESET
    card.style.position = "absolute";
    card.style.top = "0";
    card.style.transition = "all 0.6s cubic-bezier(0.22,1,0.36,1)";
    card.style.transform = `scale(${1 - pos * 0.05})`;
    
    // POSITION SYSTEM (Stripe style)
let left = 0;

for (let j = 0; j < sizes.length; j++) {
  if (pos === j) {
    card.style.left = left + "px";
    card.style.width = px(sizes[j]) + "px";
    break;
  }
  left += px(sizes[j]) + GAP;
}
card.addEventListener("mouseenter", () => {
  if (pos !== 0) {
    card.style.width = (card.offsetWidth + 20) + "px";
  }
});

card.addEventListener("mouseleave", () => {
  updateFeatured();
});
card.addEventListener("click", () => {
  currentFeatured = i;
  updateFeatured();
});
// remaining stacked
if (pos >= sizes.length) {
  card.style.left = left + "px";
  card.style.width = "4px";
}
  });

  // UPDATE DESCRIPTION
desc.innerHTML = `
  <div class="desc-inner">
    <p>${featuredPosts[currentFeatured].description}</p>
    <a href="${featuredPosts[currentFeatured].url}" class="read-more">Read More →</a>
  </div>
`;
}

document.getElementById("featuredNext")?.addEventListener("click", () => {
currentFeatured = (currentFeatured + 1) % cards.length;
updateFeatured();
});

document.getElementById("featuredPrev")?.addEventListener("click", () => {
currentFeatured = (currentFeatured - 1 + cards.length) % cards.length;
updateFeatured();
});
// INIT
setTimeout(updateFeatured, 50);
// ===============================
// PAGINATION LOGIC
// ===============================
function renderPagination(totalPosts) {
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const pagination = document.querySelector(".blog-pagination");

  if (!pagination) return;

  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} id="prevPage">← Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? "disabled" : ""} id="nextPage">Next →</button>
  `;

  document.getElementById("prevPage")?.addEventListener("click", () => {
    currentPage--;
    applyFilters();
  });

  document.getElementById("nextPage")?.addEventListener("click", () => {
    currentPage++;
    applyFilters();
  });
}
// ===============================
// FILTER + SEARCH LOGIC
// ===============================
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();

  let result = blogs.filter(blog => !blog.featured);

  if (activeFilter !== "all") {
    result = result.filter(b => b.category === activeFilter);
  }

  if (searchTerm) {
    result = result.filter(b =>
      b.title.toLowerCase().includes(searchTerm) ||
      b.description.toLowerCase().includes(searchTerm)
    );
  }

  const totalPages = Math.ceil(result.length / POSTS_PER_PAGE);
  if (currentPage > totalPages) currentPage = 1;

  renderBlogs(result);
}

// ===============================
// EVENTS
// ===============================
// Live search
if (searchInput) {
  searchInput.addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});
}
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    currentPage = 1;
    applyFilters();
  }
});
// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeFilter = btn.dataset.filter;
    currentPage = 1;

    applyFilters();
  });
});
// INITIAL RENDER
renderBlogs(filteredBlogs);

}); // DOM Close
