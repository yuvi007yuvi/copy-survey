// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    hamburger.addEventListener('click', function() {
        // Toggle hamburger animation
        hamburger.classList.toggle('active');
        
        // Create mobile menu if it doesn't exist
        if (!document.querySelector('.mobile-menu')) {
            const mobileMenu = document.createElement('div');
            mobileMenu.classList.add('mobile-menu');
            
            // Clone nav links
            const navLinksClone = navLinks.cloneNode(true);
            mobileMenu.appendChild(navLinksClone);
            
            // Clone auth buttons if they exist
            if (authButtons) {
                const authButtonsClone = authButtons.cloneNode(true);
                mobileMenu.appendChild(authButtonsClone);
                
                // Style auth buttons in mobile menu
                authButtonsClone.style.display = 'flex';
                authButtonsClone.style.flexDirection = 'column';
                authButtonsClone.style.gap = '10px';
                authButtonsClone.style.width = '100%';
                
                // Style buttons in mobile menu
                const mobileButtons = authButtonsClone.querySelectorAll('button');
                mobileButtons.forEach(button => {
                    button.style.width = '100%';
                    button.style.padding = '10px';
                });
            }
            
            // Add mobile menu to the DOM
            document.body.appendChild(mobileMenu);
            
            // Add styles to mobile menu
            mobileMenu.style.position = 'fixed';
            mobileMenu.style.top = '70px';
            mobileMenu.style.left = '0';
            mobileMenu.style.width = '100%';
            mobileMenu.style.backgroundColor = 'white';
            mobileMenu.style.padding = '20px';
            mobileMenu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            mobileMenu.style.zIndex = '999';
            mobileMenu.style.display = 'none';
            mobileMenu.style.flexDirection = 'column';
            mobileMenu.style.gap = '20px';
            
            // Style nav links in mobile menu
            navLinksClone.style.display = 'flex';
            navLinksClone.style.flexDirection = 'column';
            navLinksClone.style.gap = '15px';
        }
        
        // Toggle mobile menu visibility
        const mobileMenu = document.querySelector('.mobile-menu');
        mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.style.display === 'flex' && !hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.style.display = 'none';
            hamburger.classList.remove('active');
        }
    });
    
    // Close mobile menu when window is resized
    window.addEventListener('resize', function() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && window.innerWidth > 768) {
            mobileMenu.style.display = 'none';
            hamburger.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            const hamburger = document.querySelector('.hamburger');
            if (mobileMenu && mobileMenu.style.display === 'flex') {
                mobileMenu.style.display = 'none';
                hamburger.classList.remove('active');
            }
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                // Scroll to target with offset
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Gallery Carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let startX;
    let currentTranslate = 0;
    let isDragging = false;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Update dots
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to slide
    function goToSlide(index) {
        currentIndex = index;
        currentTranslate = -currentIndex * 100;
        track.style.transform = `translateX(${currentTranslate}%)`;
        updateDots();
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
    }
    
    // Event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Touch events
    let touchStartTime;
    let touchStartX;
    let lastTranslate = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        lastTranslate = currentTranslate;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent scrolling while dragging
        
        const currentX = e.touches[0].clientX;
        const diff = (currentX - touchStartX) / carousel.offsetWidth * 100;
        
        // Limit the drag to prevent overscrolling
        const maxDrag = 100;
        const limitedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
        track.style.transform = `translateX(${lastTranslate + limitedDiff}%)`;
    });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = endX - touchStartX;
        const timeDiff = Date.now() - touchStartTime;
        
        // Handle quick swipes (less than 300ms)
        if (timeDiff < 300) {
            if (Math.abs(diff) > 30) {
                if (diff > 0) prevSlide();
                else nextSlide();
            } else {
                goToSlide(currentIndex);
            }
        } else {
            // Handle normal swipes
            if (Math.abs(diff) > 50) {
                if (diff > 0) prevSlide();
                else nextSlide();
            } else {
                goToSlide(currentIndex);
            }
        }
    });
    
    // Auto slide
    setInterval(nextSlide, 5000);
});

// Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            // Validate name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                return;
            } else {
                removeError(nameInput);
            }
            
            // Validate email
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                return;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                return;
            } else {
                removeError(emailInput);
            }
            
            // Validate subject
            if (subjectInput.value.trim() === '') {
                showError(subjectInput, 'Subject is required');
                return;
            } else {
                removeError(subjectInput);
            }
            
            // Validate message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                return;
            } else {
                removeError(messageInput);
            }
            
            // If all validations pass, show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = 'var(--danger-color)';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        
        input.style.borderColor = 'var(--danger-color)';
    }
    
    function removeError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.style.borderColor = 'var(--border-color)';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showSuccessMessage() {
        // Create success message element if it doesn't exist
        let successMessage = document.querySelector('.success-message');
        
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            contactForm.parentElement.appendChild(successMessage);
        }
        
        // Set success message content and styles
        successMessage.textContent = 'Your message has been sent successfully!';
        successMessage.style.backgroundColor = 'var(--success-color)';
        successMessage.style.color = 'white';
        successMessage.style.padding = '15px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.marginTop = '20px';
        successMessage.style.textAlign = 'center';
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMessage.parentElement) {
                successMessage.parentElement.removeChild(successMessage);
            }
        }, 5000);
    }
});

// Add Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .survey-card, .about-image, .about-text, .contact-form, .contact-info');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for elements to be animated
    const elementsToAnimate = document.querySelectorAll('.feature-card, .survey-card, .about-image, .about-text, .contact-form, .contact-info');
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on page load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});