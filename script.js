// Cursor glow
const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", e=>{
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

// Mobile nav
const burger = document.querySelector(".burger");
const navLinks = document.querySelector("nav ul");
burger.addEventListener("click", ()=>navLinks.classList.toggle("active"));

// Hair falling animation
const canvas = document.getElementById("hairCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Hair{
    constructor(){
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*-canvas.height; // start above screen
        this.length = Math.random()*25 + 10;
        this.speedY = Math.random()*2 + 1;
        this.speedX = (Math.random()-0.5)*1;
        this.rotation = Math.random()*Math.PI*2;
        this.thickness = Math.random()*1.2 + 0.5;
        this.color = `rgba(50,30,20,${Math.random()*0.7 + 0.3})`;
    }

    update(){
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += 0.02;
        this.draw();
        if(this.y > canvas.height){
            this.y = Math.random()*-canvas.height; // restart at top
            this.x = Math.random()*canvas.width;
        }
    }

    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.rotation)/2);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.quadraticCurveTo(2*this.speedX,this.length/2,0,this.length);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.stroke();
        ctx.restore();
    }
}

let hairs = [];
for(let i=0;i<400;i++) hairs.push(new Hair());

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    hairs.forEach(h => h.update());
    requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// ===== SAFE MUSEUM SLIDER (only this block needed) =====
const track = document.querySelector(".museum-track");
const wrapper = document.querySelector(".museum-slider");
const cards = document.querySelectorAll(".museum-card");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let index = 0;
let cardWidth = cards[0].offsetWidth + 20; // card width + gap

// Update slider
function updateSliderSafe() {
    cards.forEach(card => card.classList.remove("active"));
    cards[index].classList.add("active");

    const offset = Math.max(0, index * cardWidth - (wrapper.offsetWidth - cardWidth)/2);

    requestAnimationFrame(() => {
        track.style.transform = `translateX(-${offset}px)`;
    });
}

// NEXT / PREV buttons
nextBtn.addEventListener("click", () => {
    index = (index + 1) % cards.length;
    updateSliderSafe();
});

prevBtn.addEventListener("click", () => {
    index = (index - 1 + cards.length) % cards.length;
    updateSliderSafe();
});

// CLICK to select any card
cards.forEach((card, i) => {
    card.addEventListener("click", () => {
        index = i;
        updateSliderSafe();
    });
});

// AUTO-SLIDE using setTimeout (non-blocking)
function autoSlide() {
    index = (index + 1) % cards.length;
    updateSliderSafe();
    setTimeout(autoSlide, 4000); // safe, won’t block hair animation
}
autoSlide();

// Update card width on resize
window.addEventListener("resize", () => {
    cardWidth = cards[0].offsetWidth + 20;
    updateSliderSafe();
});

// Initial call
updateSliderSafe();