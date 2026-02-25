const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
});

// COUNTER ANIMATION
const counters = document.querySelectorAll(".counter");

const startCounter = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute("data-target");
            const count = +counter.innerText;

            const increment = target / 100;

            if(count < target){
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
};

let counterStarted = false;

window.addEventListener("scroll", () => {
    const statsSection = document.querySelector(".stats");
    const sectionTop = statsSection.getBoundingClientRect().top;

    if(sectionTop < window.innerHeight && !counterStarted){
        startCounter();
        counterStarted = true;
    }
});
// PARTICLE BACKGROUND
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x < 0 || this.x > canvas.width){
            this.speedX *= -1;
        }
        if(this.y < 0 || this.y > canvas.height){
            this.speedY *= -1;
        }
    }

    draw(){
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

function init(){
    for(let i=0;i<80;i++){
        particlesArray.push(new Particle());
    }
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particlesArray.forEach(p=>{
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();
// PAGE LOADER
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

// PARALLAX EFFECT
document.addEventListener("scroll", function() {
    const parallaxElements = document.querySelectorAll(".parallax");

    parallaxElements.forEach(el => {
        const speed = el.getAttribute("data-speed");
        const yPos = -(window.scrollY / speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// ACCORDION
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("active");
    });
});
