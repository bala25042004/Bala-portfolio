/* ═══════════════════════════════════════════════════════════
   2026 PREMIUM PORTFOLIO — JavaScript Engine
   Intro → Reveal → Interactions → Animations
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Lucide icons ── */
    document.addEventListener('DOMContentLoaded', () => {
        if (window.lucide) lucide.createIcons();
    });

    /* ═══════════════════════════════════
       1. INTRO → MAIN REVEAL
       Apple-style 2s intro, then blur-to-clear
     ═══════════════════════════════════ */
    const intro = document.getElementById('intro');
    const main = document.getElementById('main');

    function dismissIntro() {
        if (intro.classList.contains('done')) return;
        intro.classList.add('done');
        main.classList.add('revealed');
        setTimeout(() => { intro.style.display = 'none'; }, 1000);
    }

    // Schedule intro dismiss — works whether load already fired or not
    function scheduleIntro() { setTimeout(dismissIntro, 2200); }
    if (document.readyState === 'complete') {
        scheduleIntro();
    } else {
        window.addEventListener('load', scheduleIntro);
    }
    // Ultimate fallback: always dismiss within 3.5s
    setTimeout(dismissIntro, 3500);

    /* ═══════════════════════════════════
       2. SCROLL PROGRESS BAR
     ═══════════════════════════════════ */
    const scrollBar = document.getElementById('scroll-bar');

    function updateProgress() {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (h <= 0) return;
        const pct = (window.scrollY / h) * 100;
        scrollBar.style.width = pct + '%';
    }

    /* ═══════════════════════════════════
       3. NAVBAR — Pin + Active link
     ═══════════════════════════════════ */
    const nav = document.getElementById('nav');
    const sections = document.querySelectorAll('.sec');
    const navLinks = document.querySelectorAll('.nav-a:not(.nav-a--cta)');

    function onScroll() {
        updateProgress();

        // Sticky background
        nav.classList.toggle('pinned', window.scrollY > 50);

        // Active section
        let cur = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 150) cur = s.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ═══════════════════════════════════
       4. MOBILE NAV
     ═══════════════════════════════════ */
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-a').forEach(l =>
        l.addEventListener('click', () => {
            burger.classList.remove('open');
            navMenu.classList.remove('open');
        })
    );

    /* ═══════════════════════════════════
       5. SMOOTH ANCHOR SCROLL
     ═══════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) {
                window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ═══════════════════════════════════
       6. SCROLL REVEAL (IntersectionObserver)
     ═══════════════════════════════════ */
    const reveals = document.querySelectorAll('.rv');

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const parent = entry.target.parentElement;
                const siblings = parent ? [...parent.querySelectorAll(':scope > .rv')] : [];
                const idx = siblings.indexOf(entry.target);
                const delay = Math.max(idx, 0) * 110;
                setTimeout(() => entry.target.classList.add('vis'), delay);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(el => revealObs.observe(el));

    /* ═══════════════════════════════════
       7. TYPING EFFECT
     ═══════════════════════════════════ */
    const typedEl = document.getElementById('typed');
    const roles = [
        'Embedded Systems',
        'IoT Solutions',
        'AI Applications',
        'Full Stack Apps',
        'Smart Hardware'
    ];
    let rI = 0, cI = 0, del = false;

    function typeLoop() {
        const word = roles[rI];
        if (!del) {
            typedEl.textContent = word.substring(0, cI + 1);
            cI++;
            if (cI === word.length) { del = true; return setTimeout(typeLoop, 2200); }
        } else {
            typedEl.textContent = word.substring(0, cI - 1);
            cI--;
            if (cI === 0) { del = false; rI = (rI + 1) % roles.length; }
        }
        setTimeout(typeLoop, del ? 30 : 70);
    }
    typeLoop();

    /* ═══════════════════════════════════
       8. COUNTER ANIMATION
     ═══════════════════════════════════ */
    const statEls = document.querySelectorAll('.stat-v[data-to]');

    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.dataset.to;
                let cur = 0;
                const step = Math.max(Math.floor(1100 / target), 70);
                const timer = setInterval(() => {
                    cur++;
                    entry.target.textContent = cur;
                    if (cur >= target) clearInterval(timer);
                }, step);
                countObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statEls.forEach(el => countObs.observe(el));

    /* ═══════════════════════════════════
       9. SKILL PROGRESS BARS
     ═══════════════════════════════════ */
    const barFills = document.querySelectorAll('.bar-fill[data-w]');

    const barObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.width = entry.target.dataset.w + '%';
                }, 200);
                barObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    barFills.forEach(el => barObs.observe(el));

    /* ═══════════════════════════════════
       10. 3D TILT ON CARDS (subtle)
     ═══════════════════════════════════ */
    const tiltCards = document.querySelectorAll('.card-tilt[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const cx = r.width / 2;
            const cy = r.height / 2;
            const rx = ((y - cy) / cy) * -5;  // subtle 5deg max
            const ry = ((x - cx) / cx) * 5;
            card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* ═══════════════════════════════════
       11. MAGNETIC BUTTONS
     ═══════════════════════════════════ */
    const magBtns = document.querySelectorAll('.mag');

    magBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const dx = e.clientX - r.left - r.width / 2;
            const dy = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    /* ═══════════════════════════════════
       12. TIMELINE NODE GLOW ON SCROLL
     ═══════════════════════════════════ */
    const tlItems = document.querySelectorAll('.tl-item');

    const tlObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('vis', entry.isIntersecting);
        });
    }, { threshold: 0.35 });

    tlItems.forEach(el => tlObs.observe(el));

    /* ═══════════════════════════════════
       13. CONTACT FORM
     ═══════════════════════════════════ */
    const form = document.getElementById('cform');
    const fstatus = document.getElementById('fstatus');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fn').value.trim();
        const email = document.getElementById('fe').value.trim();
        const msg = document.getElementById('fm').value.trim();

        if (!name || !email || !msg) {
            fstatus.textContent = 'Please fill in all fields.';
            fstatus.style.color = '#ef4444';
            return;
        }

        fstatus.textContent = 'Sending...';
        fstatus.style.color = 'var(--ac)';

        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                fstatus.textContent = '\u2713 Message sent! I will get back to you soon.';
                fstatus.style.color = '#22c55e';
                form.reset();
                setTimeout(() => { fstatus.textContent = ''; }, 5000);
            } else {
                fstatus.textContent = 'Oops! There was a problem submitting your form.';
                fstatus.style.color = '#ef4444';
            }
        }).catch(error => {
            fstatus.textContent = 'Oops! There was a problem submitting your form.';
            fstatus.style.color = '#ef4444';
        });
    });

    /* ═══════════════════════════════════
       14. PARALLAX ON HERO AVATAR
     ═══════════════════════════════════ */
    const avatar = document.querySelector('.hv-avatar');
    const rings = document.querySelectorAll('.hv-ring');

    document.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;

        if (avatar) {
            avatar.style.transform = `translate(${nx * 8}px, ${ny * 8}px)`;
        }
        rings.forEach((ring, i) => {
            const f = (i + 1) * 5;
            ring.style.transform = `translate(${nx * f}px, ${ny * f}px)`;
        });
    }, { passive: true });

    /* ═══════════════════════════════════
       15. LIVE ANIMATED CANVAS BACKGROUND
       Particles + Connections + Nebula + Waves
     ═══════════════════════════════════ */
    const cvs = document.getElementById('live-bg');
    if (cvs) {
        const ctx = cvs.getContext('2d');
        let W, H;
        let mouseX = -1000, mouseY = -1000;

        function resize() {
            W = cvs.width = window.innerWidth;
            H = cvs.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        // ── Particles ──
        const PARTICLE_COUNT = 100;
        const CONNECTION_DIST = 140;
        const particles = [];

        const colors = [
            'rgba(45,212,191,', // teal
            'rgba(6,182,212,',  // cyan
            'rgba(245,158,11,', // amber
            'rgba(244,114,182,', // pink
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * 2000,
                y: Math.random() * 2000,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                r: Math.random() * 2.2 + 0.8,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.15,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.015 + 0.005
            });
        }

        // ── Nebula blobs ──
        const nebulae = [
            { x: 0.2, y: 0.25, r: 280, color: '45,212,191', speed: 0.0004, phase: 0 },
            { x: 0.75, y: 0.6, r: 220, color: '245,158,11', speed: 0.0003, phase: 2 },
            { x: 0.5, y: 0.8, r: 250, color: '244,114,182', speed: 0.00035, phase: 4 },
            { x: 0.85, y: 0.2, r: 200, color: '6,182,212', speed: 0.00045, phase: 1 },
        ];

        let t = 0;

        function animate() {
            requestAnimationFrame(animate);
            t++;
            ctx.clearRect(0, 0, W, H);

            // ── Draw nebula glow blobs ──
            nebulae.forEach(n => {
                const nx = (n.x + Math.sin(t * n.speed + n.phase) * 0.08) * W;
                const ny = (n.y + Math.cos(t * n.speed * 0.7 + n.phase) * 0.06) * H;
                const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
                grad.addColorStop(0, 'rgba(' + n.color + ',0.06)');
                grad.addColorStop(0.5, 'rgba(' + n.color + ',0.025)');
                grad.addColorStop(1, 'rgba(' + n.color + ',0)');
                ctx.fillStyle = grad;
                ctx.fillRect(nx - n.r, ny - n.r, n.r * 2, n.r * 2);
            });

            // ── Update & draw particles ──
            particles.forEach(p => {
                // Mouse repulsion
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    const force = (150 - dist) / 150;
                    p.vx += (dx / dist) * force * 0.3;
                    p.vy += (dy / dist) * force * 0.3;
                }

                // Damping
                p.vx *= 0.992;
                p.vy *= 0.992;

                p.x += p.vx;
                p.y += p.vy;

                // Wrap
                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10;
                if (p.y > H + 10) p.y = -10;

                // Pulse
                p.pulse += p.pulseSpeed;
                const a = p.alpha + Math.sin(p.pulse) * 0.12;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + a.toFixed(2) + ')';
                ctx.fill();
            });

            // ── Draw connections ──
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < CONNECTION_DIST) {
                        const alpha = (1 - d / CONNECTION_DIST) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(45,212,191,' + alpha.toFixed(3) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            // ── Flowing wave at bottom ──
            ctx.beginPath();
            ctx.moveTo(0, H);
            for (let x = 0; x <= W; x += 8) {
                const y = H - 40
                    + Math.sin(x * 0.006 + t * 0.015) * 18
                    + Math.sin(x * 0.012 + t * 0.008) * 8;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(W, H);
            ctx.closePath();
            const waveGrad = ctx.createLinearGradient(0, H - 60, 0, H);
            waveGrad.addColorStop(0, 'rgba(45,212,191,0.03)');
            waveGrad.addColorStop(1, 'rgba(45,212,191,0)');
            ctx.fillStyle = waveGrad;
            ctx.fill();

            // ── Second wave (amber) ──
            ctx.beginPath();
            ctx.moveTo(0, H);
            for (let x = 0; x <= W; x += 8) {
                const y = H - 25
                    + Math.sin(x * 0.008 + t * 0.01 + 2) * 12
                    + Math.cos(x * 0.015 + t * 0.006) * 6;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(W, H);
            ctx.closePath();
            const waveGrad2 = ctx.createLinearGradient(0, H - 40, 0, H);
            waveGrad2.addColorStop(0, 'rgba(245,158,11,0.02)');
            waveGrad2.addColorStop(1, 'rgba(245,158,11,0)');
            ctx.fillStyle = waveGrad2;
            ctx.fill();
        }

        animate();
    }

})();
