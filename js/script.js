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
