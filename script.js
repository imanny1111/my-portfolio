// ===========================
// FAQ Accordion
// ===========================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current FAQ
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===========================
// Gallery Carousel - Project Images
// ===========================

document.querySelectorAll('.showcase-card').forEach(card => {
    const gallery = card.querySelector('.gallery-carousel');
    const images = card.querySelectorAll('.gallery-image');
    const dots = card.querySelectorAll('.dot');
    let currentImage = 0;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        images[index].classList.add('active');
        dots[index].classList.add('active');
        currentImage = index;
    }

    // Click dots to navigate
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showImage(index));
    });

    // Auto-rotate images on hover
    card.addEventListener('mouseenter', () => {
        if (!card.autoRotateInterval) {
            let rotateIndex = currentImage;
            card.autoRotateInterval = setInterval(() => {
                rotateIndex = (rotateIndex + 1) % images.length;
                showImage(rotateIndex);
            }, 3000);
        }
    });

    card.addEventListener('mouseleave', () => {
        if (card.autoRotateInterval) {
            clearInterval(card.autoRotateInterval);
            card.autoRotateInterval = null;
        }
    });
});

// ===========================
// Projects Carousel (Main)
// ===========================

const carousel = document.querySelector('.projects-carousel');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const indicators = document.querySelectorAll('.indicator');

let currentSlide = 0;
const totalSlides = slides.length;

function updateCarousel() {
    const offset = -currentSlide * 100;
    carousel.style.transform = `translateX(${offset}%)`;

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        currentSlide = parseInt(indicator.dataset.slide);
        updateCarousel();
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (carousel) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    }
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        }
        if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    }
}

// ===========================
// Theme Toggle (Dark/Light Mode)
// ===========================

const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const THEME_KEY = 'theme-preference';

function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
}

function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ===========================
// Mobile Menu Toggle
// ===========================

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (e) => {
    const isMenuOpen = navMenu.classList.contains('active');
    const isClickInside = e.target.closest('.navbar');

    if (isMenuOpen && !isClickInside) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

// ===========================
// Smooth Scroll for Navigation Links
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===========================
// Contact Form Handling
// ===========================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Please fill in all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.disabled = true;

        contactForm.reset();

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);

        console.log('Form Data:', formData);
    });
}

// ===========================
// Active Navigation Link Highlighting
// ===========================

function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===========================
// Intersection Observer for Animations
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .badge, .contact-link').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===========================
// Utility: Prevent Layout Shift
// ===========================

function preventLayoutShift() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

preventLayoutShift();
window.addEventListener('resize', preventLayoutShift);

// ===========================
// Initialize
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    updateActiveLink();
    console.log('Portfolio website initialized successfully!');
});
