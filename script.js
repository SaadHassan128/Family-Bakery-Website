// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ===================================
// LOADING SPINNER
// ===================================
window.addEventListener('load', () => {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    setTimeout(() => {
      spinner.classList.add('hidden');
      setTimeout(() => {
        spinner.style.display = 'none';
      }, 300);
    }, 500);
  }
});

// ===================================
// SCROLL PROGRESS BAR
// ===================================
const updateScrollProgress = () => {
  const scrollProgress = document.getElementById('scroll-progress');
  if (!scrollProgress) return;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / documentHeight) * 100;

  scrollProgress.style.width = `${Math.min(progress, 100)}%`;
};

// ===================================
// STICKY NAVBAR WITH HIDE/SHOW
// ===================================
let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');

const handleNavbar = () => {
  const currentScrollY = window.scrollY;

  if (!navbar) return;

  // Add scrolled class when not at top
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Hide navbar on scroll down, show on scroll up
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }

  lastScrollY = currentScrollY;
};

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

const toggleMobileMenu = () => {
  if (!menuToggle || !navMenu) return;

  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');

  // Update aria-expanded for accessibility
  const isExpanded = menuToggle.classList.contains('active');
  menuToggle.setAttribute('aria-expanded', isExpanded);

  // Prevent body scroll when menu is open
  if (isExpanded) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu && navMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navMenu &&
    navMenu.classList.contains('active') &&
    !navMenu.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    toggleMobileMenu();
  }
});

// ===================================
// SMOOTH SCROLL FOR NAVIGATION
// ===================================
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');

    if (targetId && targetId.startsWith('#')) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Update URL without triggering scroll
        history.pushState(null, '', targetId);
      }
    }
  });
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const animateOnScroll = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optionally unobserve after animation
      // observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe all elements with animate-on-scroll class
const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach((el) => observer.observe(el));

// ===================================
// ANIMATED COUNTER
// ===================================
const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
};

// Observe stat numbers for counter animation
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        animateCounter(entry.target, target);
        entry.target.classList.add('counted');
      }
    });
  },
  { threshold: 0.5 }
);

const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach((stat) => statObserver.observe(stat));

// ===================================
// BACK TO TOP BUTTON
// ===================================
const backToTopBtn = document.getElementById('back-to-top');

const toggleBackToTop = () => {
  if (!backToTopBtn) return;

  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
};

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// ===================================
// CONTACT FORM VALIDATION
// ===================================
const contactForm = document.getElementById('contact-form');

const showError = (input, message) => {
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.form-error');

  input.classList.add('error');
  if (errorElement) {
    errorElement.textContent = message;
  }
};

const clearError = (input) => {
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.form-error');

  input.classList.remove('error');
  if (errorElement) {
    errorElement.textContent = '';
  }
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const validateForm = () => {
  let isValid = true;

  // Name validation
  const nameInput = document.getElementById('name');
  if (nameInput) {
    const nameValue = nameInput.value.trim();
    if (nameValue === '') {
      showError(nameInput, 'Name is required');
      isValid = false;
    } else if (nameValue.length < 2) {
      showError(nameInput, 'Name must be at least 2 characters');
      isValid = false;
    } else {
      clearError(nameInput);
    }
  }

  // Email validation
  const emailInput = document.getElementById('email');
  if (emailInput) {
    const emailValue = emailInput.value.trim();
    if (emailValue === '') {
      showError(emailInput, 'Email is required');
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }
  }

  // Phone validation (optional)
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    const phoneValue = phoneInput.value.trim();
    if (phoneValue && !validatePhone(phoneValue)) {
      showError(phoneInput, 'Please enter a valid phone number');
      isValid = false;
    } else {
      clearError(phoneInput);
    }
  }

  // Message validation
  const messageInput = document.getElementById('message');
  if (messageInput) {
    const messageValue = messageInput.value.trim();
    if (messageValue === '') {
      showError(messageInput, 'Message is required');
      isValid = false;
    } else if (messageValue.length < 10) {
      showError(messageInput, 'Message must be at least 10 characters');
      isValid = false;
    } else {
      clearError(messageInput);
    }
  }

  return isValid;
};

// ===================================
// TOAST NOTIFICATIONS
// ===================================
const showToast = (message, type = 'success') => {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
};

// Form submission handler
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      showToast('Thank you! Your message has been sent successfully.', 'success');
      contactForm.reset();

      // Clear all errors
      const inputs = contactForm.querySelectorAll('.form-input');
      inputs.forEach((input) => clearError(input));
    } catch (error) {
      showToast('Oops! Something went wrong. Please try again.', 'error');
    } finally {
      // Reset button state
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });

  // Real-time validation
  const formInputs = contactForm.querySelectorAll('.form-input');
  formInputs.forEach((input) => {
    input.addEventListener('blur', () => {
      // Validate on blur
      if (input.hasAttribute('required')) {
        const value = input.value.trim();
        if (value === '') {
          showError(input, `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`);
        } else {
          if (input.type === 'email' && !validateEmail(value)) {
            showError(input, 'Please enter a valid email address');
          } else if (input.type === 'tel' && !validatePhone(value)) {
            showError(input, 'Please enter a valid phone number');
          } else {
            clearError(input);
          }
        }
      }
    });

    input.addEventListener('input', () => {
      // Clear error on input
      if (input.classList.contains('error')) {
        clearError(input);
      }
    });
  });
}

// ===================================
// GALLERY CARD VIEW MORE BUTTONS
// ===================================
const viewBtns = document.querySelectorAll('.view-btn');
viewBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const cardTitle = btn.closest('.gallery-card').querySelector('.card-title').textContent;
    showToast(`Viewing details for: ${cardTitle}`, 'success');
  });
});

// ===================================
// EVENT LISTENERS
// ===================================

// Throttled scroll event
window.addEventListener(
  'scroll',
  throttle(() => {
    updateScrollProgress();
    handleNavbar();
    toggleBackToTop();
  }, 100)
);

// Debounced resize event
window.addEventListener(
  'resize',
  debounce(() => {
    // Handle any resize-specific logic here
    if (window.innerWidth > 767 && navMenu && navMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  }, 250)
);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // ESC key to close mobile menu
  if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
    toggleMobileMenu();
  }

  // Keyboard shortcut for back to top (Home key)
  if (e.key === 'Home' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Handle hash links on page load
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  }

  // Initial calls
  updateScrollProgress();
  toggleBackToTop();
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Lazy loading for images (native lazy loading is already in HTML)
// This is a fallback for browsers that don't support native lazy loading
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  console.log('Native lazy loading supported');
} else {
  // Fallback for browsers without native lazy loading support
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src; // Trigger load
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
}

// ===================================
// ERROR HANDLING
// ===================================

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Optionally show user-friendly error message
  // showToast('An error occurred. Please refresh the page.', 'error');
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // Optionally show user-friendly error message
});

// ===================================
// ANALYTICS (Optional)
// ===================================

// Track page views and interactions
const trackEvent = (category, action, label) => {
  // Replace with your analytics implementation
  console.log('Event tracked:', { category, action, label });

  // Example for Google Analytics 4
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', action, {
  //     event_category: category,
  //     event_label: label
  //   });
  // }
};

// Track button clicks
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const btnText = e.target.textContent.trim();
    trackEvent('Button', 'Click', btnText);
  });
});

// Track navigation link clicks
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const linkText = link.textContent.trim();
    trackEvent('Navigation', 'Click', linkText);
  });
});

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================
console.log(
  '%c👋 Welcome to Family Bakery!',
  'color: #e63946; font-size: 20px; font-weight: bold;'
);
console.log(
  '%c🍞 Built with modern web technologies',
  'color: #f4a261; font-size: 14px;'
);
console.log('%cEnjoy your visit! 🎉', 'color: #2a9d8f; font-size: 14px;');
