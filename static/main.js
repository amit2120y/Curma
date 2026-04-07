/**
 * Onam Fest 2026 - Interactive Scripts
 * Designed for a premium, festive feel with smooth animations
 */

// ========== SLIDER FUNCTIONALITY ==========
let currentSlide = 0;
let slides;
let totalSlides;
let sliderInterval;

function showSlide(n) {
    console.log('showSlide called with n =', n);
    console.log('totalSlides =', totalSlides);

    if (!slides || slides.length === 0) {
        console.error('No slides found!');
        return;
    }

    // Remove active class from all slides and dots
    slides.forEach((slide, index) => {
        slide.classList.remove('slide-active');
        console.log('Removed slide-active from slide', index);
    });

    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        console.log('Removed active from dot', index);
    });

    // Add active class to current slide and dot
    if (n >= 0 && n < totalSlides) {
        console.log('Adding slide-active to slide', n);
        slides[n].classList.add('slide-active');

        if (dots[n]) {
            console.log('Adding active to dot', n);
            dots[n].classList.add('active');
        }
    } else {
        console.error('Invalid slide index:', n);
    }
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    console.log('nextSlide: currentSlide is now', currentSlide);
    showSlide(currentSlide);
    resetSliderInterval();
}

function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    console.log('prevSlide: currentSlide is now', currentSlide);
    showSlide(currentSlide);
    resetSliderInterval();
}

function goToSlide(n) {
    currentSlide = n;
    console.log('goToSlide: currentSlide is now', currentSlide);
    showSlide(currentSlide);
    resetSliderInterval();
}

function autoSlide() {
    currentSlide++;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    console.log('autoSlide: currentSlide is now', currentSlide);
    showSlide(currentSlide);
}

function resetSliderInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(autoSlide, 4000); // Change slide every 4 seconds
}

function initSlider() {
    // Get slides after DOM is loaded
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;

    console.log('Initializing slider...');
    console.log('Found', totalSlides, 'slides');
    console.log('Slides:', slides);

    // Initialize first slide
    if (slides.length > 0) {
        currentSlide = 0;
        showSlide(currentSlide);
        resetSliderInterval();
        console.log('Slider initialized successfully');
    } else {
        console.error('No slides found!');
    }
}

// ========== COUNTDOWN TIMER ==========
function initCountdownTimer() {
    const timerElement = document.getElementById('onam-timer');
    if (!timerElement) return;

    function updateTimer() {
        // Set Onam date to October 15, 2026 (Thiruvonam)
        const onamDate = new Date(2026, 9, 15, 0, 0, 0).getTime();
        const now = new Date().getTime();
        const distance = onamDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timerElement.innerHTML = `
                <div class="text-2xl font-bold text-gradient">
                    🎉 Onam in ${days}d ${hours}h ${minutes}m ${seconds}s 🎉
                </div>
            `;
        } else {
            timerElement.innerHTML = '<div class="text-2xl font-bold text-white">ONAM IS HERE! 🎊</div>';
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// ========== PETAL ANIMATION ==========
function initPetalAnimation() {
    const createPetal = () => {
        const petal = document.createElement('div');
        const icons = ['<i class="fas fa-flower"></i>', '<i class="fas fa-leaf"></i>', '<i class="fas fa-fan"></i>'];

        petal.innerHTML = icons[Math.floor(Math.random() * icons.length)];
        petal.style.position = 'fixed';
        petal.style.top = '-50px';
        petal.style.left = Math.random() * window.innerWidth + 'px';
        petal.style.fontSize = '20px';
        petal.style.color = ['#f59e0b', '#fbbf24', '#f87171', '#fb7185'][Math.floor(Math.random() * 4)];

        document.body.appendChild(petal);

        const duration = Math.random() * 4000 + 6000;
        const xOffset = (Math.random() - 0.5) * 200;

        const animation = petal.animate([
            {
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: petal.style.opacity
            },
            {
                transform: `translateY(${window.innerHeight + 20}px) translateX(${xOffset}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-in'
        });

        animation.onfinish = () => petal.remove();
    };

    // Create petals periodically (reduced frequency for better performance)
    if (window.location.pathname === '/') {
        setInterval(createPetal, 2000);
    }
}

// ========== SMOOTH SCROLL ANCHOR LINKS ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ========== NAVBAR SCROLL INDICATOR & BLUR EFFECT ==========
function initNavbarScrollIndicator() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('nav');

    window.addEventListener('scroll', throttle(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        // Update active link
        navLinks.forEach(link => {
            link.classList.remove('text-orange-600', 'active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-orange-600', 'active');
            }
        });

        // Add blur effect when scrolling
        if (window.scrollY > 30) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }, 50));
}

// ========== PARALLAX EFFECT ==========
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            element.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    });
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initSlider();
    initCountdownTimer();
    initPetalAnimation();
    initSmoothScroll();
    initIntersectionObserver();
    initNavbarScrollIndicator();
    initParallax();

    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: false,
            mirror: true
        });
    }
});

// ========== UTILITY FUNCTIONS ==========

// Debounce function for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 3. Admin Dashboard Confirmation
const deleteButtons = document.querySelectorAll('.btn-delete');
deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!confirm('Are you sure you want to remove this event from the schedule?')) {
            e.preventDefault();
        }
    });
});

// 4. Smooth Scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 5. Dynamic Navbar Background on Scroll
const nav = document.querySelector('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-md');
        } else {
            nav.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-md');
        }
    });
}
});

// 6. Simple Countdown to Onam 2026 (August 25, 2026)
const countdown = () => {
    const countDate = new Date('August 25, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

    if (gap > 0) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);

        const timerDisplay = document.getElementById('onam-timer');
        if (timerDisplay) {
            timerDisplay.innerText = `${d} Days : ${h}h : ${m}m to Thiruvonam`;
        }
    }
};

setInterval(countdown, 60000); // Update every minute
countdown();