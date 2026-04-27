document.addEventListener('DOMContentLoaded', () => {
    // 0. Force scroll to top on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 1. Set Current Year in Footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 3. Scroll Progress Indicator
    const scrollProgress = document.getElementById('scrollProgress');

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercentage}%`;
        }
    };

    window.addEventListener('scroll', updateScrollProgress);

    // 4. Navbar Sticky State & Active Link Update
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = () => {
        // Sticky Navbar styling
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active Link Highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    // 5. Intersection Observer for Scroll Animations (Fade-in, Slide-up, etc.)
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Apply animation class when intersecting, remove it when not
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            } else {
                entry.target.classList.remove('appear');
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // 6. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 7. Contact Form Handling (Styling Only)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin ml-2"></i>';
            btn.disabled = true;
        });
    }

    // 8. Parallax Scrolling Effect
    const parallaxElements = document.querySelectorAll('.parallax');

    const handleParallax = () => {
        const scrolled = window.scrollY;
        
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.5;
            // Calculate translateY offset. Using requestAnimationFrame for performance.
            const yPos = scrolled * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });
    };

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(handleParallax);
    });

    // 9. Horizontal Parallax for Projects Carousel
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');

    if (projectsGrid) {
        const handleHorizontalParallax = () => {
            projectCards.forEach(card => {
                const img = card.querySelector('.project-image');
                if (img && !img.classList.contains('app-icon')) {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + (rect.width / 2);
                    const windowCenter = window.innerWidth / 2;
                    const distance = cardCenter - windowCenter;
                    
                    const shift = distance * 0.15;
                    img.style.transform = `translateX(${shift}px)`;
                }
            });
        };

        projectsGrid.addEventListener('scroll', () => {
            window.requestAnimationFrame(handleHorizontalParallax);
        });

        // Drag to Scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        projectsGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - projectsGrid.offsetLeft;
            scrollLeft = projectsGrid.scrollLeft;
            projectsGrid.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
        });

        projectsGrid.addEventListener('mouseleave', () => {
            isDown = false;
        });

        projectsGrid.addEventListener('mouseup', () => {
            isDown = false;
            projectsGrid.style.scrollBehavior = 'smooth'; // Re-enable smooth scroll
        });

        projectsGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - projectsGrid.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            projectsGrid.scrollLeft = scrollLeft - walk;
        });
        
        // Initial setup
        handleHorizontalParallax();
    }
});
