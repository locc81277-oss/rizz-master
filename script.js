// ==========================================
// RIZZ MASTER – LANDING PAGE ENGINE
// ==========================================

// ===== 1. CURSOR GLOW EFFECT =====
const cursorGlow = document.getElementById('cursorGlow');
let glowTimeout;

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.classList.add('active');

    clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => {
        cursorGlow.classList.remove('active');
    }, 3000);
});

// ===== 2. FLOATING PARTICLES SYSTEM =====
const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');
let particlesArray = [];

function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.opacityDirection = Math.random() > 0.5 ? 1 : -1;

        const colors = [
            'rgba(168, 85, 247,',   // purple
            'rgba(236, 72, 153,',   // pink
            'rgba(192, 132, 252,',  // light purple
            'rgba(244, 114, 182,',  // light pink
            'rgba(255, 255, 255,',  // white
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Twinkle effect
        this.opacity += this.opacityDirection * 0.003;
        if (this.opacity >= 0.6) this.opacityDirection = -1;
        if (this.opacity <= 0.05) this.opacityDirection = 1;

        // Wrap around
        if (this.x < -10) this.x = particleCanvas.width + 10;
        if (this.x > particleCanvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = particleCanvas.height + 10;
        if (this.y > particleCanvas.height + 10) this.y = -10;
    }

    draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = this.color + this.opacity + ')';
        pCtx.fill();
    }
}

// Create particles
const particleCount = Math.min(80, Math.floor(window.innerWidth / 18));
for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
}

function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let p of particlesArray) {
        p.update();
        p.draw();
    }

    // Draw connections between nearby particles
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
                const lineOpacity = (1 - dist / 130) * 0.12;
                pCtx.beginPath();
                pCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
                pCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
                pCtx.strokeStyle = `rgba(168, 85, 247, ${lineOpacity})`;
                pCtx.lineWidth = 0.5;
                pCtx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== 3. NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== 4. MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ===== 5. ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== 6. SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// ===== 7. ANIMATED STAT COUNTERS =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => {
    statsObserver.observe(el);
});

function animateCounters() {
    statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: ease-out-expo
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// ===== 8. SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== 9. FORM SUBMIT HANDLER =====
function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const success = document.getElementById('ctaSuccess');

    form.style.display = 'none';
    success.classList.add('active');

    // Confetti burst effect!
    createConfetti();
}

// ===== 10. CONFETTI EFFECT ON SIGNUP =====
function createConfetti() {
    const colors = ['#a855f7', '#ec4899', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#e879f9'];
    const container = document.querySelector('.cta-section');

    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${50 + (Math.random() - 0.5) * 40}%;
            top: 50%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 100;
            opacity: 1;
            animation: confetti-fall ${Math.random() * 2 + 1.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            --tx: ${(Math.random() - 0.5) * 400}px;
            --ty: ${Math.random() * -500 - 100}px;
            --rot: ${Math.random() * 720 - 360}deg;
        `;
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3500);
    }

    // Inject the animation if not already present
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== 11. TILT EFFECT ON RULE CARDS (DESKTOP) =====
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.rule-card, .quote-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===== 12. PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
