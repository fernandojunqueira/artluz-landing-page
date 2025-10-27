/**
 * ArtLuz Landing Page JavaScript
 * Handles testimonials carousel, smooth scrolling, and interactive elements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTestimonialsCarousel();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScrollEffect();
});

/**
 * Testimonials Carousel Functionality
 * Automatically rotates through testimonials and handles manual navigation
 */
function initTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;

    // Function to show a specific slide
    function showSlide(slideIndex) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current testimonial and activate corresponding indicator
        if (testimonials[slideIndex]) {
            testimonials[slideIndex].classList.add('active');
        }
        if (indicators[slideIndex]) {
            indicators[slideIndex].classList.add('active');
        }
        
        currentSlide = slideIndex;
    }

    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % testimonials.length;
        showSlide(nextIndex);
    }

    // Function to start auto-rotation
    function startCarousel() {
        slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    // Function to stop auto-rotation
    function stopCarousel() {
        clearInterval(slideInterval);
    }

    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            stopCarousel();
            startCarousel(); // Restart auto-rotation
        });
        
        // Add hover effects
        indicator.addEventListener('mouseenter', function() {
            stopCarousel();
        });
        
        indicator.addEventListener('mouseleave', function() {
            startCarousel();
        });
    });

    // Pause carousel when hovering over testimonials
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
    }

    // Start the carousel
    startCarousel();
}

/**
 * Smooth Scrolling for Internal Links
 * Provides smooth scrolling behavior for any internal navigation
 */
function initSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations
 * Adds fade-in animations to elements as they come into view
 */
function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.hero-text, .hero-image, .testimonial, .contact-info, .social-links, .footer-cta');
    
    animatedElements.forEach(element => {
        // Set initial state for animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Start observing
        observer.observe(element);
    });
}

/**
 * Header Scroll Effect
 * Adds a subtle background change when scrolling
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Add/remove shadow based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });
}

/**
 * Utility Functions
 */

// Function to track CTA button clicks (for analytics)
function trackCTAClick(buttonType) {
    // This function can be extended to send analytics data
    console.log(`CTA clicked: ${buttonType}`);
    
    // Example: Send to Google Analytics or other tracking service
    // gtag('event', 'click', {
    //     event_category: 'CTA',
    //     event_label: buttonType
    // });
}

// Add click tracking to all CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const buttonType = this.classList.contains('hero-cta') ? 'Hero CTA' : 
                              this.classList.contains('footer-cta-btn') ? 'Footer CTA' : 
                              'Header CTA';
            trackCTAClick(buttonType);
        });
    });
});

// Function to handle WhatsApp link formatting
function formatWhatsAppLink(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
}

// Function to validate phone number format
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Function to update all WhatsApp links with a new phone number
function updateWhatsAppLinks(phoneNumber) {
    if (!isValidPhoneNumber(phoneNumber)) {
        console.error('Invalid phone number format');
        return;
    }
    
    const whatsappLinks = document.querySelectorAll('a[href*="whatsapp.com"]');
    const message = "Hello! I'd like to request a quote.";
    
    whatsappLinks.forEach(link => {
        link.href = formatWhatsAppLink(phoneNumber, message);
    });
}

// Export functions for external use (if needed)
window.ArtLuz = {
    updateWhatsAppLinks,
    formatWhatsAppLink,
    isValidPhoneNumber
};

/**
 * Performance Optimizations
 */

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

/**
 * Error Handling
 */

// Global error handler for JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});
