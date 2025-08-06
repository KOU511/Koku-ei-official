document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);
    
    function initLoader() {
        const loader = document.querySelector('.loader');
        if (!loader) return;
        const text = loader.querySelector('.loader__text');
        
        const tl = gsap.timeline();
        tl.to(text, { opacity: 1, duration: 1, delay: 0.5 })
          .to(loader, { opacity: 0, duration: 1.5, delay: 1, onComplete: () => loader.style.display = 'none' });
    }

    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        ScrollTrigger.create({
            start: 'top -50px',
            onUpdate: self => header.classList.toggle('is-scrolled', self.direction === 1 && self.progress > 0),
            onLeaveBack: () => header.classList.remove('is-scrolled'),
        });
    }

    function initHeroParallax() {
        const hero = document.querySelector('.hero-section');
        const logo = document.querySelector('.hero-section__logo-container');
        if (!hero || !logo) return;
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) - 0.5;
            const y = (clientY / window.innerHeight) - 0.5;
            gsap.to(logo, { rotationY: x * 30, rotationX: -y * 30, transformPerspective: 1000, ease: 'power2.out' });
        });
        hero.addEventListener('mouseleave', () => {
            gsap.to(logo, { rotationY: 0, rotationX: 0, ease: 'power2.out' });
        });
    }

    function initScrollAnimations() {
        if (document.querySelector('.hero-section')) {
            gsap.from('.hero-section__logo-container', { opacity: 0, scale: 0.9, duration: 1.5, delay: 2.5, ease: 'power3.out' });
            gsap.from('.hero-section__content', { opacity: 0, y: 20, duration: 1.5, delay: 2.8, ease: 'power3.out' });
            gsap.from('.scroll-down-indicator', { opacity: 0, duration: 1.5, delay: 3.5, ease: 'power3.out' });
        }
        const targets = ['.section-title', '.card', '.profile-card', '.lore-content', '.news-list li', '.music-links-section'];
        targets.forEach(target => {
            const elements = document.querySelectorAll(target);
            if (elements.length > 0) {
                gsap.to(elements, {
                    opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2,
                    scrollTrigger: { trigger: elements[0].parentNode, start: 'top 85%', once: true, }
                });
            }
        });
        // Add separate animations for social links and music links without scale
        const linkSections = ['.social-links', '.music-links'];
        linkSections.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                gsap.to(elements, {
                    opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: { trigger: elements[0].parentNode, start: 'top 85%', once: true, }
                });
            }
        });
    }
    
    function initBackgroundAnimation() {
        const canvas = document.getElementById('background-animation');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: 0, y: 0, angle: Math.random() * Math.PI * 2,
                radius: 100 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.4),
                speed: 0.001 + Math.random() * 0.005, size: 0.5 + Math.random() * 1.5,
                color: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.5})`
            });
        }
        function animate() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2; const centerY = canvas.height / 2;
            particles.forEach(p => {
                p.angle += p.speed; p.x = centerX + Math.cos(p.angle) * p.radius; p.y = centerY + Math.sin(p.angle) * p.radius;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        if(document.body.classList.contains('work-detail-page') === false) {
            animate();
            ScrollTrigger.create({
                trigger: '.hero-section', start: 'bottom center',
                onEnter: () => document.body.classList.add('is-scrolled-past-hero'),
                onLeaveBack: () => document.body.classList.remove('is-scrolled-past-hero'),
            });
        }
    }
    
    function initDetailPage() {
        const trackItems = document.querySelectorAll('.tracklist__item');
        const mainArtwork = document.getElementById('main-artwork');
        if (trackItems.length === 0 || !mainArtwork) return;
        const defaultArtworkSrc = mainArtwork.src;
        trackItems.forEach(item => {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    trackItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.open = false;
                        }
                    });
                    const newImageSrc = item.dataset.image;
                    if (mainArtwork.src !== newImageSrc) {
                        gsap.to(mainArtwork, {
                            opacity: 0, duration: 0.2, onComplete: () => {
                                mainArtwork.src = newImageSrc;
                                gsap.to(mainArtwork, { opacity: 1, duration: 0.2 });
                            }
                        });
                    }
                } else {
                    const anyItemIsOpen = Array.from(trackItems).some(i => i.open);
                    if (!anyItemIsOpen && mainArtwork.src !== defaultArtworkSrc) {
                        gsap.to(mainArtwork, {
                            opacity: 0, duration: 0.2, onComplete: () => {
                                mainArtwork.src = defaultArtworkSrc;
                                gsap.to(mainArtwork, { opacity: 1, duration: 0.2 });
                            }
                        });
                    }
                }
            });
        });
    }

    initLoader();
    initHeaderScroll();
    initHeroParallax();
    initScrollAnimations();
    initBackgroundAnimation();
    initDetailPage();
});