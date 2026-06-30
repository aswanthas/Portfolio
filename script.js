document.addEventListener('DOMContentLoaded', () => {
    // 0. Force scroll to top on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 1. Set Current Year in Footer
    // Wait, let's look for copyright element and update it if exists, but we also have copyright year element or footer.
    // In our index.html, we don't have id="currentYear", we wrote "© 2026 Aswanth K." directly. Let's dynamically find "2026" or put the current year.
    // Actually, in index.html footer we have: <div class="footer-copy">© 2026 Aswanth K. Built with care.</div>
    // Let's dynamically update the year if we want, or keep it simple. Let's write a year setter.
    const footerCopy = document.querySelector('.footer-copy');
    if (footerCopy) {
        const currentYear = new Date().getFullYear();
        footerCopy.textContent = `© ${currentYear} Aswanth K. Built with care.`;
    }

    // 2. Intersection Observer for Scroll Animations (adds 'visible' to '.reveal')
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Parallax Scrolling Effect for Background Blobs
    const parallaxElements = document.querySelectorAll('.parallax');

    const handleParallax = () => {
        const scrolled = window.scrollY;
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.3;
            const yPos = scrolled * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });
    };

    window.addEventListener('scroll', () => {
        if (parallaxElements.length > 0) {
            window.requestAnimationFrame(handleParallax);
        }
    });
});
