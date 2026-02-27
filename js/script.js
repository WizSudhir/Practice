/* =========================================================
   PRACTICEGRID SOLUTIONS
   ENTERPRISE JS ARCHITECTURE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* ===============================
   Header Scroll Window
================================== */
   const header = document.querySelector(".navbar");

if (window.scrollY > 50) {
    header.classList.add("scrolled");
} else {
    header.classList.remove("scrolled");
}
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
   
/* ===============================
   GLOBAL SCROLL HANDLER (Optimized)
================================== */

let counterStarted = false;

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
   COUNTER ANIMATION (Improved)
================================== */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

function animateCounter(counter) {
    const target = +counter.getAttribute("data-target");
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        counter.innerText = Math.floor(progress * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.innerText = target;
        }
    }

    requestAnimationFrame(update);
}

/* ===============================
   PARTICLE BACKGROUND
================================== */

const canvas = document.getElementById("particles");

if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    function resizeCanvas() {
    const heroSection = document.querySelector(".hero");

    canvas.width = heroSection.clientWidth;
    canvas.height = heroSection.clientHeight;
}

    window.addEventListener("load", resizeCanvas);
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
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
            ctx.fillStyle = "rgba(255,255,255,0.4)";
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

    initParticles();
    animateParticles();
}

/* ===============================
   PAGE LOADER
================================== */

window.addEventListener("load", () => {
    document.body.classList.remove("loading");
});

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
