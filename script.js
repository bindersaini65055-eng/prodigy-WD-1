// ============ JAVASCRIPT CODE ============

document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileMenuBtn = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  // ========== NAV SCROLL ==========
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }

  // ========== SMOOTH SCROLL ==========
  function smoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
    navMenu.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
  }

  // ========== MOBILE MENU ==========
  function toggleMobileMenu() {
    navMenu.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");
  }

  // ========== RIPPLE ==========
  function createRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    ripple.classList.add("ripple");

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // ========== ACTIVE LINK ==========
  function highlightActiveSection() {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          if (link) link.classList.add("active");
        }
      });
    }, { threshold: 0.3 });

    sections.forEach((sec) => observer.observe(sec));
  }

  // ========== PARALLAX ==========
  function parallaxEffect() {
    const hero = document.querySelector(".hero");
    const rate = window.pageYOffset * -0.3;
    if (hero) hero.style.transform = `translateY(${rate}px)`;
  }

  // ========== THROTTLE ==========
  function throttle(fn, limit) {
    let flag = true;
    return function () {
      if (flag) {
        fn();
        flag = false;
        setTimeout(() => (flag = true), limit);
      }
    };
  }

  // ========== EVENT LISTENERS ==========
  window.addEventListener(
    "scroll",
    throttle(function () {
      handleScroll();
      parallaxEffect();
    }, 16)
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", smoothScroll);
    link.addEventListener("click", createRipple);
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  highlightActiveSection();
});


// ================== CANVAS SYSTEM ==================

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.querySelector(".hero").appendChild(canvas);

canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "0";

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = document.querySelector(".hero").offsetHeight;
}
window.addEventListener("resize", resize);
resize();

// 🔵 MAIN BALL
const mainBall = {
  x: w / 2,
  y: h / 2,
  r: 50,
  dx: 4,   // FIXED (17 was too fast)
  dy: 2.5,
};

// ✨ PARTICLES
const particles = [];
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 5, // FIXED (27 was too huge)
    dx: (Math.random() - 0.5) * 1.5,
    dy: (Math.random() - 0.5) * 1.5,
  });
}

function drawMainBall() {
  ctx.beginPath();
  ctx.arc(mainBall.x, mainBall.y, mainBall.r, 0, Math.PI * 2);
  ctx.fillStyle = "#b3f0ee7d";
  ctx.shadowBlur = 30;
  ctx.shadowColor = "#3edae8";
  ctx.fill();
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
  });
}

function moveParticles() {
  particles.forEach((p) => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > w) p.dx *= -1;
    if (p.y < 0 || p.y > h) p.dy *= -1;

    let dist = Math.hypot(mainBall.x - p.x, mainBall.y - p.y);

    if (dist < 150) {
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0,255,255,0.5)";
      ctx.moveTo(mainBall.x, mainBall.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });
}

function updateMainBall() {
  mainBall.x += mainBall.dx;
  mainBall.y += mainBall.dy;

  if (mainBall.x < 0 || mainBall.x > w) mainBall.dx *= -1;
  if (mainBall.y < 0 || mainBall.y > h) mainBall.dy *= -1;
}

// 🔥 IMPORTANT FIX: CONTINUOUS LOOP ADDED
function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, w, h);

  moveParticles();
  updateMainBall();

  drawParticles();
  drawMainBall();
}

animate();