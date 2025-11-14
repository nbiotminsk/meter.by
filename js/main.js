// Main JavaScript file for Belarus Remote Metering Site

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image optimization first (critical for performance)
    initializeImageOptimization();
    
    // Initialize VanillaTilt for service cards
    initializeTiltEffects();
    
    // Initialize theme from localStorage
    initializeTheme();
    
    // Initialize messenger buttons
    initializeMessengerButtons();
    
    // Initialize service cards click handlers
    initializeServiceCards();
    
    // Initialize active navigation tracking
    initializeActiveNavigation();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    console.log('Belarus Remote Metering Site initialized with image optimization');
});

// Initialize VanillaTilt effects
function initializeTiltEffects() {
    // Wait a bit for Alpine.js to render the cards
    setTimeout(() => {
        const serviceCards = document.querySelectorAll('.service-card[data-tilt]');
        if (serviceCards.length > 0 && typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(serviceCards, {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.2,
                scale: 1.05,
                perspective: 1000,
                transition: true,
                'reset-to-start': false,
                easing: "cubic-bezier(.03,.98,.52,.99)"
            });
            console.log('VanillaTilt initialized for', serviceCards.length, 'cards');
        } else {
            console.log('No service cards found or VanillaTilt not loaded');
        }
    }, 100);
}

// Initialize theme system
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Add smooth transition class to body
    document.body.classList.add('theme-transition');
    
    // Update theme switcher button if it exists
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        updateThemeSwitcherIcon(savedTheme);
    }
    
    console.log('Theme initialized:', savedTheme);
}

// Update theme switcher icon
function updateThemeSwitcherIcon(theme) {
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        const icon = themeSwitcher.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    }
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class for smooth animation
    document.body.classList.add('theme-transition');
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    updateThemeSwitcherIcon(newTheme);
    
    console.log('Theme switched to:', newTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

// Initialize messenger buttons
function initializeMessengerButtons() {
    // Telegram button
    const telegramBtn = document.querySelector('.telegram-btn');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Open Telegram channel
            window.open('https://t.me/meter_by', '_blank');
        });
    }
    
    // Viber button
    const viberBtn = document.querySelector('.viber-btn');
    if (viberBtn) {
        viberBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Open Viber chat
            window.open('viber://chat?number=+375292524988', '_blank');
        });
    }
}

// Initialize service cards click handlers (fallback for non-Alpine.js cards)
function initializeServiceCards() {
    // This function serves as a fallback for service cards that aren't handled by Alpine.js
    // The main service modal functionality is now handled by the Alpine.js servicesComponent
    // Currently no fallback logic needed - all handled by Alpine.js
}

// Initialize active navigation tracking
function initializeActiveNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id], main section[id]');
    
    // Function to update active nav link
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Add click handlers for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Remove active class from all links
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    // Smooth scroll to target
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link
    updateActiveNavLink();
    
    console.log('Active navigation tracking initialized');
}

// Utility functions for data loading
async function loadJSONData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return null;
    }
}

// Utility function for image loading with fallback
function loadImageWithFallback(img, primarySrc, fallbackSrc) {
    img.onerror = function() {
        if (this.src !== fallbackSrc) {
            this.src = fallbackSrc;
        }
    };
    img.src = primarySrc;
}

// Smooth scroll utility
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Format date utility
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Export functions for use in Alpine.js components
window.BelarusRemoteMetering = {
    loadJSONData,
    loadImageWithFallback,
    smoothScrollTo,
    formatDate,
    initializeTiltEffects
};

// Pricing page specific functionality
const PricingHelpers = {
    // Use existing initializeTiltEffects function
    initializeTiltEffects: initializeTiltEffects,

    // Use existing loadJSONData function (with null return on error)
    loadJSONData: loadJSONData,

    // Format currency for display
    formatCurrency: function(amount) {
        return `${amount} BYN`;
    },

    // Calculate discount percentage
    calculateDiscountPercentage: function(original, discounted) {
        return Math.round(((original - discounted) / original) * 100);
    },

    // Smooth scroll to element with offset support
    scrollToElement: function(elementId, offset = 100) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback to smoothScrollTo if element not found
            smoothScrollTo(elementId);
        }
    },

    // Show loading state
    showLoading: function(element) {
        if (element) {
            element.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Загрузка...</span>
                    </div>
                    <p class="mt-3 text-muted">Загрузка данных...</p>
                </div>
            `;
        }
    },

    // Show error state
    showError: function(element, message = 'Ошибка загрузки данных') {
        if (element) {
            element.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-outline-primary" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i>Попробовать снова
                    </button>
                </div>
            `;
        }
    },

    // Validate form data
    validateFormData: function(data, requiredFields) {
        const errors = [];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`Поле "${field}" обязательно для заполнения`);
            }
        });
        return errors;
    },

    // Generate unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Local storage helpers
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },

        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return null;
            }
        },

        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Error removing from localStorage:', error);
            }
        }
    },

    // Analytics helpers (for future implementation)
    analytics: {
        trackEvent: function(category, action, label = '') {
            console.log('Analytics event:', { category, action, label });
            // Here you could integrate with Google Analytics, Yandex.Metrica, etc.
        },

        trackServiceSelection: function(serviceId, serviceName) {
            this.trackEvent('Pricing', 'Service Selected', `${serviceId}: ${serviceName}`);
        },

        trackPackageSelection: function(packageId, packageName) {
            this.trackEvent('Pricing', 'Package Selected', `${packageId}: ${packageName}`);
        },

        trackProposalGeneration: function(totalPrice, servicesCount) {
            this.trackEvent('Pricing', 'Proposal Generated', `${totalPrice} BYN, ${servicesCount} services`);
        }
    }
};

// Make BelarusRemoteMetering globally available (merge helpers without overwriting)
window.BelarusRemoteMetering = Object.assign(window.BelarusRemoteMetering || {}, PricingHelpers);

// Initialize pricing page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the pricing page
    if (window.location.pathname.includes('prices.html')) {
        console.log('Pricing page detected, initializing pricing-specific functionality');
        
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                window.BelarusRemoteMetering.scrollToElement(targetId);
            });
        });

        // Add keyboard navigation for service selection
        document.addEventListener('keydown', function(e) {
            // Press 'c' to clear calculator
            if (e.key === 'c' && e.ctrlKey) {
                e.preventDefault();
                const calculatorComponent = Alpine.$data(document.querySelector('[x-data="pricingCalculator"]'));
                if (calculatorComponent) {
                    calculatorComponent.resetCalculator();
                    window.BelarusRemoteMetering.analytics.trackEvent('Pricing', 'Calculator Cleared', 'Keyboard Shortcut');
                }
            }
        });

        // Add intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe pricing cards
        setTimeout(() => {
            document.querySelectorAll('.pricing-category-card, .package-card').forEach(card => {
                observer.observe(card);
            });
        }, 500);
    }
});

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .pricing-category-card,
    .package-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .pricing-category-card.animate-in,
    .package-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Video Gallery functionality
const VideoGalleryHelpers = {
    // Get YouTube thumbnail URL
    getYoutubeThumbnail: function(youtubeId, quality = 'maxresdefault') {
        return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
    },

    // Get YouTube embed URL
    getYoutubeEmbedUrl: function(youtubeId, autoplay = false) {
        const params = new URLSearchParams({
            rel: '0',
            modestbranding: '1',
            showinfo: '0'
        });
        
        if (autoplay) {
            params.set('autoplay', '1');
        }
        
        return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
    },

    // Format video duration
    formatDuration: function(duration) {
        if (!duration) return '';
        
        // If duration is already formatted (e.g., "8:45"), return as is
        if (typeof duration === 'string' && duration.includes(':')) {
            return duration;
        }
        
        // If duration is in seconds, convert to MM:SS format
        if (typeof duration === 'number') {
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        return duration;
    },

    // Create video modal HTML
    createVideoModalHTML: function(youtubeId, title) {
        return `
            <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
                <iframe 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"
                    src="${this.getYoutubeEmbedUrl(youtubeId, true)}" 
                    frameborder="0" 
                    allowfullscreen
                    allow="autoplay; encrypted-media">
                </iframe>
            </div>
        `;
    },

    // Show video modal using SweetAlert2
    showVideoModal: function(youtubeId, title) {
        if (typeof Swal === 'undefined') {
            console.error('SweetAlert2 is not loaded');
            // Fallback: open video in new tab
            window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
            return;
        }

        Swal.fire({
            title: title,
            html: this.createVideoModalHTML(youtubeId, title),
            width: '90%',
            maxWidth: '800px',
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: 'video-modal'
            },
            didOpen: () => {
                // Add custom styles for video modal
                const popup = Swal.getPopup();
                if (popup) {
                    popup.style.padding = '20px';
                    popup.style.borderRadius = '16px';
                }
            },
            willClose: () => {
                // Analytics tracking
                if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.analytics) {
                    window.BelarusRemoteMetering.analytics.trackEvent('Video', 'Modal Closed', title);
                }
            }
        });

        // Analytics tracking
        if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.analytics) {
            window.BelarusRemoteMetering.analytics.trackEvent('Video', 'Modal Opened', title);
        }
    },

    // Filter videos by category
    filterVideosByCategory: function(videos, categoryId) {
        if (!videos || !Array.isArray(videos)) return [];
        if (categoryId === 'all') return videos;
        return videos.filter(video => video.category === categoryId);
    },

    // Get category name by ID
    getCategoryName: function(categories, categoryId) {
        if (!categories || !Array.isArray(categories)) return 'Общее';
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Общее';
    },

    // Sort videos (featured first, then by date)
    sortVideos: function(videos) {
        if (!videos || !Array.isArray(videos)) return [];
        
        return videos.sort((a, b) => {
            // Featured videos first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // Then by upload date (newest first)
            const dateA = new Date(a.uploadDate);
            const dateB = new Date(b.uploadDate);
            return dateB - dateA;
        });
    },

    // Initialize video gallery page
    initializeVideoGallery: function() {
        // Check if we're on the video gallery page
        if (window.location.pathname.includes('videos.html')) {
            console.log('Video gallery page detected');
            
            // Add intersection observer for video card animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('video-card-animate');
                    }
                });
            }, observerOptions);

            // Observe video cards after they're rendered
            setTimeout(() => {
                document.querySelectorAll('.video-card').forEach(card => {
                    observer.observe(card);
                });
            }, 500);

            // Add keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Press 'Escape' to close video modal
                if (e.key === 'Escape' && Swal.isVisible()) {
                    Swal.close();
                }
                
                // Press numbers 1-6 to filter by category
                const categoryKeys = ['1', '2', '3', '4', '5', '6'];
                if (categoryKeys.includes(e.key)) {
                    const categoryIndex = parseInt(e.key) - 1;
                    const videoGalleryComponent = Alpine.$data(document.querySelector('[x-data="videoGallery"]'));
                    if (videoGalleryComponent && videoGalleryComponent.categories[categoryIndex]) {
                        const categoryId = categoryIndex === 0 ? 'all' : videoGalleryComponent.categories[categoryIndex - 1].id;
                        videoGalleryComponent.selectedCategory = categoryId;
                        
                        // Analytics tracking
                        if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.analytics) {
                            window.BelarusRemoteMetering.analytics.trackEvent('Video', 'Category Filter', `Keyboard: ${categoryId}`);
                        }
                    }
                }
            });
        }
    }
};

// Merge video gallery helpers with existing BelarusRemoteMetering object
window.BelarusRemoteMetering = Object.assign(window.BelarusRemoteMetering || {}, VideoGalleryHelpers);

// Initialize video gallery functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.BelarusRemoteMetering.initializeVideoGallery();
});

// Add CSS animations for video cards
const videoGalleryStyle = document.createElement('style');
videoGalleryStyle.textContent = `
    .video-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .video-card-animate {
        opacity: 1;
        transform: translateY(0);
        animation: videoCardSlideIn 0.6s ease-out forwards;
    }

    @keyframes videoCardSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .video-thumbnail {
        transition: transform 0.3s ease, filter 0.3s ease;
    }

    .video-card:hover .video-thumbnail {
        transform: scale(1.05);
        filter: brightness(1.1);
    }

    .play-overlay {
        transition: all 0.3s ease;
        opacity: 0.8;
    }

    .video-card:hover .play-overlay {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
        text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8);
    }

    .category-filter-btn {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .category-filter-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }

    .category-filter-btn:hover::before {
        left: 100%;
    }

    /* Dark theme video modal */
    [data-theme="dark"] .swal2-popup.video-modal {
        background: rgba(26, 26, 46, 0.95) !important;
        backdrop-filter: blur(25px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    [data-theme="dark"] .swal2-popup.video-modal .swal2-title {
        color: var(--text-color) !important;
    }

    /* Video modal responsive */
    @media (max-width: 768px) {
        .swal2-popup.video-modal {
            width: 95% !important;
            margin: 10px !important;
        }
        
        .video-container {
            border-radius: 8px !important;
        }
        
        .video-container iframe {
            border-radius: 8px !important;
        }
    }
`;
document.head.appendChild(videoGalleryStyle);

// Image Optimization Functions
function initializeImageOptimization() {
    console.log('Initializing image optimization system...');
    
    // Set up image error handling
    setupImageErrorHandling();
    
    // Initialize lazy loading for images with data-src
    initializeLazyLoading();
    
    // Optimize existing images
    optimizeExistingImages();
    
    // Set up responsive image loading
    setupResponsiveImages();
    
    console.log('Image optimization system initialized');
}

function setupImageErrorHandling() {
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            const originalSrc = img.src;
            
            // Don't replace if already using placeholder
            if (originalSrc.startsWith('data:image/svg+xml') || img.classList.contains('placeholder-image')) {
                return;
            }
            
            console.log('Image failed to load:', originalSrc);
            
            // Create SVG placeholder
            const placeholder = createImagePlaceholder(img);
            img.src = placeholder;
            img.classList.add('placeholder-image');
            
            // Add title for accessibility
            if (!img.title) {
                img.title = 'Изображение временно недоступно';
            }
        }
    }, true);
}

function createImagePlaceholder(img) {
    const width = img.width || 400;
    const height = img.height || 300;
    const src = img.src || img.dataset.src || '';
    
    // Check for data attributes first (for custom placeholders)
    const placeholderType = img.dataset.placeholderType;
    const placeholderTitle = img.dataset.placeholderTitle;
    
    // Determine service type from image path or data attributes
    let type = 'default';
    let title = placeholderTitle || 'Изображение услуги';
    let color = '#e0e0e0';
    let icon = '📷';
    
    if (placeholderType === 'comprehensive' || src.includes('comprehensive')) {
        type = 'comprehensive';
        title = placeholderTitle || 'Комплексные услуги';
        color = '#0066cc';
        icon = '⚙️';
    } else if (src.includes('heat-meter')) {
        type = 'heat-meter';
        title = 'Счетчик тепла';
        color = '#ff6b6b';
        icon = '🌡️';
    } else if (src.includes('water-meter')) {
        type = 'water-meter';
        title = 'Счетчик воды';
        color = '#4ecdc4';
        icon = '💧';
    } else if (src.includes('verification')) {
        type = 'verification';
        title = 'Поверка приборов';
        color = '#45b7d1';
        icon = '✅';
    } else if (src.includes('installation')) {
        type = 'installation';
        title = 'Монтаж счетчиков';
        color = '#96ceb4';
        icon = '🔧';
    } else if (src.includes('remote')) {
        type = 'remote';
        title = 'Дистанционный съем';
        color = '#feca57';
        icon = '📡';
    } else if (src.includes('vega')) {
        type = 'vega';
        title = 'Вега NB-11';
        color = '#6c5ce7';
        icon = '📊';
    } else if (src.includes('balancing')) {
        type = 'balancing';
        title = 'Балансировка';
        color = '#fd79a8';
        icon = '⚖️';
    } else if (src.includes('startup')) {
        type = 'startup';
        title = 'Запуск системы';
        color = '#fdcb6e';
        icon = '▶️';
    }
    
    // For comprehensive services, add subtitle
    const subtitle = (type === 'comprehensive' && !placeholderTitle) ? 'Обслуживание систем учета и автоматики' : '';
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad-${type})" rx="8"/>
            <text x="50%" y="35%" text-anchor="middle" font-family="Arial, sans-serif" 
                  font-size="${Math.min(width, height) / 8}" fill="white" opacity="0.9">
                ${icon}
            </text>
            <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" 
                  font-size="${Math.min(width, height) / 20}" fill="white" font-weight="bold" opacity="0.9">
                ${title}
            </text>
            ${subtitle ? `<text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" 
                  font-size="${Math.min(width, height) / 25}" fill="white" opacity="0.8">
                ${subtitle}
            </text>` : ''}
        </svg>
    `)}`;
}

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImageWithOptimization(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        console.log('Lazy loading initialized with Intersection Observer');
    } else {
        // Fallback for browsers without Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            loadImageWithOptimization(img);
        });
        console.log('Lazy loading fallback initialized');
    }
}

function loadImageWithOptimization(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    // Show loading skeleton
    img.classList.add('loading-skeleton');
    
    // Try to load WebP version first if supported
    const webpSrc = getWebPVersion(src);
    
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
        img.src = webpSrc;
        img.classList.remove('loading-skeleton');
        img.classList.add('loaded', 'webp-optimized');
        
        // Add fade-in animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 10);
        
        // Remove data-src attribute
        delete img.dataset.src;
    };
    
    imageLoader.onerror = () => {
        // Fallback to original image
        const fallbackLoader = new Image();
        
        fallbackLoader.onload = () => {
            img.src = src;
            img.classList.remove('loading-skeleton');
            img.classList.add('loaded', 'webp-fallback');
            
            // Add fade-in animation
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 10);
            
            delete img.dataset.src;
        };
        
        fallbackLoader.onerror = () => {
            // Use placeholder if both fail
            img.src = createImagePlaceholder(img);
            img.classList.remove('loading-skeleton');
            img.classList.add('placeholder-image');
            delete img.dataset.src;
        };
        
        fallbackLoader.src = src;
    };
    
    imageLoader.src = webpSrc;
}

function getWebPVersion(imagePath) {
    // Check if browser supports WebP
    if (!supportsWebP()) {
        return imagePath;
    }
    
    // Convert JPEG/JPG to WebP
    if (imagePath.match(/\.(jpe?g)$/i)) {
        return imagePath.replace(/\.(jpe?g)$/i, '.webp');
    }
    
    // Convert PNG to WebP
    if (imagePath.match(/\.png$/i)) {
        return imagePath.replace(/\.png$/i, '.webp');
    }
    
    return imagePath;
}

function supportsWebP() {
    // Check if WebP support has been cached
    if (window.webpSupported !== undefined) {
        return window.webpSupported;
    }
    
    // Create a small WebP image to test support
    const webP = new Image();
    webP.onload = webP.onerror = () => {
        window.webpSupported = (webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    
    // Return false initially, will be updated when test completes
    return false;
}

function optimizeExistingImages() {
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
        // Add loading attribute for native lazy loading
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding attribute for better performance
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
        
        // Ensure alt attribute exists
        if (!img.hasAttribute('alt') || img.alt === '') {
            img.setAttribute('alt', generateAltText(img));
        }
        
        // Add responsive classes if not present
        if (!img.classList.contains('img-responsive') && !img.classList.contains('no-responsive')) {
            img.classList.add('img-responsive');
        }
    });
    
    console.log(`Optimized ${images.length} existing images`);
}

function generateAltText(img) {
    const src = img.src || img.dataset.src || '';
    const parentText = img.closest('.card')?.querySelector('.card-title')?.textContent || '';
    
    // Generate meaningful alt text based on context
    if (src.includes('heat-meter')) {
        return 'Счетчик тепла - прибор учета тепловой энергии';
    }
    if (src.includes('water-meter')) {
        return 'Счетчик воды - прибор учета холодной и горячей воды';
    }
    if (src.includes('verification')) {
        return 'Поверка приборов учета - проверка точности показаний';
    }
    if (src.includes('installation')) {
        return 'Монтаж счетчиков - профессиональная установка приборов учета';
    }
    if (src.includes('remote')) {
        return 'Дистанционный съем показаний - автоматическая передача данных';
    }
    if (src.includes('vega')) {
        return 'Вега NB-11 - современный прибор учета с дистанционным съемом';
    }
    if (src.includes('balancing')) {
        return 'Балансировка системы отопления - настройка равномерного распределения тепла';
    }
    if (src.includes('startup')) {
        return 'Запуск системы отопления - пуско-наладочные работы';
    }
    if (parentText) {
        return `Изображение для услуги: ${parentText}`;
    }
    if (src.includes('company-seal')) {
        return 'Печать компании';
    }
    
    return 'Изображение услуги компании по дистанционному съему показаний';
}

function setupResponsiveImages() {
    // Create responsive image sources for different screen sizes
    const images = document.querySelectorAll('img.img-responsive');
    
    images.forEach(img => {
        // Skip if already processed
        if (img.dataset.responsiveProcessed) return;
        
        const src = img.src || img.dataset.src;
        if (!src) return;
        
        // Create picture element for responsive images
        const picture = document.createElement('picture');
        
        // Add WebP sources for different screen sizes
        if (supportsWebP()) {
            // Large screens (desktop)
            const webpSourceLarge = document.createElement('source');
            webpSourceLarge.media = '(min-width: 992px)';
            webpSourceLarge.srcset = getResponsiveImagePath(src, 'large', 'webp');
            webpSourceLarge.type = 'image/webp';
            picture.appendChild(webpSourceLarge);
            
            // Medium screens (tablet)
            const webpSourceMedium = document.createElement('source');
            webpSourceMedium.media = '(min-width: 768px)';
            webpSourceMedium.srcset = getResponsiveImagePath(src, 'medium', 'webp');
            webpSourceMedium.type = 'image/webp';
            picture.appendChild(webpSourceMedium);
            
            // Small screens (mobile)
            const webpSourceSmall = document.createElement('source');
            webpSourceSmall.media = '(max-width: 767px)';
            webpSourceSmall.srcset = getResponsiveImagePath(src, 'small', 'webp');
            webpSourceSmall.type = 'image/webp';
            picture.appendChild(webpSourceSmall);
        }
        
        // Add JPEG fallback sources
        const jpegSourceLarge = document.createElement('source');
        jpegSourceLarge.media = '(min-width: 992px)';
        jpegSourceLarge.srcset = getResponsiveImagePath(src, 'large', 'jpg');
        picture.appendChild(jpegSourceLarge);
        
        const jpegSourceMedium = document.createElement('source');
        jpegSourceMedium.media = '(min-width: 768px)';
        jpegSourceMedium.srcset = getResponsiveImagePath(src, 'medium', 'jpg');
        picture.appendChild(jpegSourceMedium);
        
        const jpegSourceSmall = document.createElement('source');
        jpegSourceSmall.media = '(max-width: 767px)';
        jpegSourceSmall.srcset = getResponsiveImagePath(src, 'small', 'jpg');
        picture.appendChild(jpegSourceSmall);
        
        // Clone the original img element
        const newImg = img.cloneNode(true);
        newImg.dataset.responsiveProcessed = 'true';
        picture.appendChild(newImg);
        
        // Replace original img with picture element
        img.parentNode.replaceChild(picture, img);
    });
}

function getResponsiveImagePath(originalPath, size, format) {
    // For now, return original path since we don't have multiple sizes
    // In a real implementation, you would have different sized images
    // TODO: Implement responsive image paths when multiple sizes are available
    // const extension = format === 'webp' ? '.webp' : '.jpg';
    // const basePath = originalPath.replace(/\.(jpe?g|png|webp)$/i, '');
    // const responsivePath = `${basePath}-${size}${extension}`;
    // return responsivePath;
    return originalPath;
}

function initializeScrollAnimations() {
    // Initialize scroll-based animations for images and cards
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation delays for multiple elements
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements that should animate on scroll
        document.querySelectorAll('.service-card, .card, .fade-in-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
        
        console.log('Scroll animations initialized');
    }
}

// Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'images/placeholders/heat-meter.jpg',
        'images/placeholders/water-meter.jpg',
        'images/company-seal.png'
    ];
    
    criticalImages.forEach(imagePath => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = getWebPVersion(imagePath);
        document.head.appendChild(link);
    });
    
    console.log(`Preloaded ${criticalImages.length} critical images`);
}

// Initialize critical image preloading immediately
preloadCriticalImages();

// Add image optimization utilities to global object
window.BelarusRemoteMetering = Object.assign(window.BelarusRemoteMetering || {}, {
    createImagePlaceholder,
    loadImageWithOptimization,
    generateAltText,
    supportsWebP,
    getWebPVersion,
    preloadCriticalImages
});

// Alpine.js Components
document.addEventListener('alpine:init', () => {
    // Documents Component
    Alpine.data('documentsComponent', () => ({
        documents: [],
        displayedDocuments: [],
        showAll: false,
        loading: true,

        async init() {
            await this.loadDocuments();
        },

        async loadDocuments() {
            try {
                this.loading = true;
                
                // Direct fetch if BelarusRemoteMetering is not available
                let data;
                if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.loadJSONData) {
                    data = await window.BelarusRemoteMetering.loadJSONData('data/documents.json');
                } else {
                    const response = await fetch('data/documents.json');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    data = await response.json();
                }
                
                if (data && data.documents) {
                    this.documents = data.documents;
                    this.updateDisplayedDocuments();
                    console.log('Documents loaded:', this.documents.length);
                } else {
                    console.error('No documents data found');
                    this.documents = [];
                }
            } catch (error) {
                console.error('Error loading documents:', error);
                this.documents = [];
            } finally {
                this.loading = false;
            }
        },

        updateDisplayedDocuments() {
            if (this.showAll) {
                this.displayedDocuments = this.documents;
            } else {
                this.displayedDocuments = this.documents.slice(0, 6);
            }
        },

        toggleShowAll() {
            this.showAll = !this.showAll;
            this.updateDisplayedDocuments();
            
            // Analytics tracking
            if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.analytics) {
                window.BelarusRemoteMetering.analytics.trackEvent('Documents', 'Toggle Show All', this.showAll ? 'Show All' : 'Show Less');
            }
        },

        getDocumentIcon(type) {
            const iconMap = {
                'certificate': 'bi bi-award',
                'specification': 'bi bi-file-earmark-text',
                'manual': 'bi bi-book',
                'price-list': 'bi bi-currency-dollar',
                'contract': 'bi bi-file-earmark-check',
                'default': 'bi bi-file-earmark'
            };
            return iconMap[type] || iconMap['default'];
        },

        downloadDocument(document) {
            // Analytics tracking
            if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.analytics) {
                window.BelarusRemoteMetering.analytics.trackEvent('Documents', 'Download', document.title);
            }
            
            console.log('Downloading document:', document.title);
        }
    }));

    // Services Component
    Alpine.data('servicesComponent', () => ({
        services: [],
        displayedServices: [],
        showAllServices: false,
        loading: true,

        async init() {
            await this.loadServices();
        },

        async loadServices() {
            try {
                this.loading = true;
                
                // Direct fetch if BelarusRemoteMetering is not available
                let data;
                if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.loadJSONData) {
                    data = await window.BelarusRemoteMetering.loadJSONData('data/services.json');
                } else {
                    const response = await fetch('data/services.json');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    data = await response.json();
                }
                
                if (data && data.services) {
                    this.services = data.services;
                    this.updateDisplayedServices();
                    console.log('Services loaded:', this.services.length);
                } else {
                    console.error('No services data found');
                    this.services = [];
                }
            } catch (error) {
                console.error('Error loading services:', error);
                this.services = [];
            } finally {
                this.loading = false;
            }
        },

        updateDisplayedServices() {
            if (this.showAllServices) {
                this.displayedServices = this.services;
            } else {
                this.displayedServices = this.services.slice(0, 6);
            }
        },

        toggleShowAllServices() {
            this.showAllServices = !this.showAllServices;
            this.updateDisplayedServices();
            
            // Re-initialize tilt effects for new cards
            setTimeout(() => {
                if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.initializeTiltEffects) {
                    window.BelarusRemoteMetering.initializeTiltEffects();
                } else {
                    initializeTiltEffects();
                }
            }, 100);
        },

        getCategoryName(category) {
            const categoryMap = {
                'verification': 'Поверка',
                'installation': 'Монтаж',
                'pnr': 'ПНР',
                'remote': 'Дистанционный съем',
                'equipment': 'Оборудование'
            };
            return categoryMap[category] || category;
        },

        openServiceModal(service) {
            if (typeof Swal === 'undefined') {
                console.error('SweetAlert2 is not loaded');
                return;
            }

            Swal.fire({
                title: service.title,
                html: `
                    <div class="text-start">
                        <img src="${service.image}" alt="${service.title}" class="img-fluid rounded mb-3" style="max-height: 200px; width: 100%; object-fit: cover;">
                        <p class="mb-3">${service.detailedInfo || service.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">${this.getCategoryName(service.category)}</span>
                            <small class="text-muted">${service.subcategory || ''}</small>
                        </div>
                    </div>
                `,
                width: '600px',
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    popup: 'service-modal'
                }
            });

            // Analytics tracking
            if (window.BelarusRemoteMetering && window.BelarusRemoteMetering.analytics) {
                window.BelarusRemoteMetering.analytics.trackEvent('Services', 'Modal Opened', service.title);
            }
        }
    }));
    // Theme Switcher Component
    Alpine.data('themeSwitch', () => ({
        isDark: localStorage.getItem('theme') === 'dark',

        toggle() {
            this.isDark = !this.isDark;

            // Add transition class for smooth animation
            document.body.classList.add('theme-transition');

            // Update theme
            const newTheme = this.isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);

            console.log('Theme switched to:', newTheme);

            // Remove transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        },

        init() {
            // Initialize theme from localStorage
            const savedTheme = this.isDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);

            // Add transition class for smooth animations
            document.body.classList.add('theme-transition');

            console.log('Theme switcher initialized:', savedTheme);
        }
    }));
});