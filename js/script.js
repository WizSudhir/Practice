/* =========================================================
   PRACTICEGRID SOLUTIONS
   ENTERPRISE JS ARCHITECTURE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* ===============================
   Header Scroll Window
================================== */
const header = document.querySelector(".navbar");

if (header) {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}
/* ===============================
   GLOBAL SCROLL HANDLER (Optimized)
================================== */

window.addEventListener("scroll", handleScroll);
handleScroll();
   
function handleScroll() {
    revealOnScroll();
    parallaxEffect();
}

/* ===============================
   REVEAL ANIMATION
================================== */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

/* ===============================
   COUNTER ANIMATION (Stable)
================================== */

const counters = document.querySelectorAll(".counter");
let counterStarted = false;

function animateCounter(counter) {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const speed = target / 60;

    const update = () => {
        count += speed;

        if (count < target) {
            counter.innerText = Math.floor(count);
            requestAnimationFrame(update);
        } else {
            counter.innerText = target;
        }
    };

    update();
}

function startCountersIfVisible() {
    if (counterStarted) return;

    const hero = document.querySelector(".hero");
    const rect = hero.getBoundingClientRect();

    if (rect.top < window.innerHeight) {
        counterStarted = true;
        counters.forEach(c => animateCounter(c));
    }
}

// Run once immediately to catch the Hero section
setTimeout(() => {
    counters.forEach(c => animateCounter(c));
    counterStarted = true;
}, 500); // Small delay to let the page settle
   
/* ===============================
   PARTICLE BACKGROUND (Stable Version)
================================== */

const canvas = document.getElementById("particles");

if (canvas) {
    const ctx = canvas.getContext("2d");
    const heroSection = document.querySelector(".hero");
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = heroSection.clientWidth;
        canvas.height = heroSection.clientHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 80; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    // Initialize immediately after DOM ready
    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener("resize", () => {
        resizeCanvas();
        initParticles();
    });
}
/* ===============================
   PARALLAX EFFECT
================================== */

function parallaxEffect() {
    const parallaxElements = document.querySelectorAll(".parallax");

    parallaxElements.forEach(el => {
        const speed = el.getAttribute("data-speed");
        const yPos = -(window.scrollY / speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
}

/* ===============================
   CONTACT STRIP REVEAL (IntersectionObserver)
================================== */

const revealElements = document.querySelectorAll(".reveal-up");

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.2 });

revealElements.forEach(el => revealObserver.observe(el));
});
