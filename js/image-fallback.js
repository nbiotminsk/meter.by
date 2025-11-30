/**
 * Universal Image Fallback System
 * Automatically checks all images and replaces missing ones with SVG placeholders
 */

class ImageFallback {
    constructor() {
        this.checkedImages = new Set();
        this.observer = null;
        this.init();
    }

    init() {
        // Check all existing images on page load
        this.checkAllImages();
        
        // Setup error handler for failed image loads
        this.setupErrorHandler();
        
        // Watch for dynamically added images (Alpine.js, etc.)
        this.setupMutationObserver();
        
        // Also check images after a delay (for Alpine.js content)
        setTimeout(() => this.checkAllImages(), 1000);
        setTimeout(() => this.checkAllImages(), 3000);
    }

    /**
     * Check all images on the page and verify they exist
     */
    checkAllImages() {
        const images = document.querySelectorAll('img:not([data-fallback-checked])');
        
        images.forEach(img => {
            // Skip if already checked or is a placeholder
            if (img.classList.contains('placeholder-image') || 
                img.src.startsWith('data:image/svg+xml')) {
                return;
            }

            // Mark as checked
            img.setAttribute('data-fallback-checked', 'true');
            
            // Check if image exists
            this.verifyImageExists(img);
        });
    }

    /**
     * Verify if an image file exists by trying to load it
     */
    verifyImageExists(img) {
        const originalSrc = img.src || img.dataset.src || img.getAttribute('src');
        
        if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
            return;
        }

        // Create a test image to check if file exists
        const testImg = new Image();
        
        testImg.onload = () => {
            // Image exists, do nothing
            img.classList.remove('image-loading');
        };
        
        testImg.onerror = () => {
            // Image doesn't exist, replace with placeholder
            this.replaceWithPlaceholder(img, originalSrc);
        };
        
        // Add loading class
        img.classList.add('image-loading');
        
        // Try to load the image
        testImg.src = originalSrc;
    }

    /**
     * Replace missing image with SVG placeholder
     */
    replaceWithPlaceholder(img, originalSrc) {
        // Don't replace if already using placeholder
        if (img.src.startsWith('data:image/svg+xml') || 
            img.classList.contains('placeholder-image')) {
            return;
        }

        const width = img.width || img.offsetWidth || 400;
        const height = img.height || img.offsetHeight || 300;
        
        // Get placeholder based on image path or context
        const placeholder = this.createPlaceholder(originalSrc, width, height, img);
        
        // Replace image source
        img.src = placeholder;
        img.classList.add('placeholder-image');
        img.classList.remove('image-loading');
        
        // Add title for accessibility
        if (!img.title && !img.alt) {
            img.title = 'Изображение временно недоступно';
        }
        
        // Store original source for potential retry
        img.dataset.originalSrc = originalSrc;
    }

    /**
     * Create SVG placeholder based on image context
     */
    createPlaceholder(originalSrc, width = 400, height = 300, imgElement = null) {
        // Get type and title from various sources
        let type = 'default';
        let title = 'Изображение услуги';
        let color = '#e0e0e0';
        let icon = '📷';
        
        // Check data attributes first
        if (imgElement) {
            const dataType = imgElement.dataset.placeholderType;
            const dataTitle = imgElement.dataset.placeholderTitle;
            
            if (dataType) type = dataType;
            if (dataTitle) title = dataTitle;
        }
        
        // Determine type from image path
        const srcLower = originalSrc.toLowerCase();
        
        if (srcLower.includes('heat-meter') || srcLower.includes('теплосчетчик')) {
            type = 'heat-meter';
            title = 'Счетчик тепла';
            color = '#ff6b6b';
            icon = '🌡️';
        } else if (srcLower.includes('water-meter') || srcLower.includes('водосчетчик')) {
            type = 'water-meter';
            title = 'Счетчик воды';
            color = '#4ecdc4';
            icon = '💧';
        } else if (srcLower.includes('verification') || srcLower.includes('поверка')) {
            type = 'verification';
            title = 'Поверка приборов';
            color = '#45b7d1';
            icon = '✅';
        } else if (srcLower.includes('installation') || srcLower.includes('монтаж') || srcLower.includes('установка')) {
            type = 'installation';
            title = 'Монтаж счетчиков';
            color = '#96ceb4';
            icon = '🔧';
        } else if (srcLower.includes('remote') || srcLower.includes('дистанционн') || srcLower.includes('диспетчеризац')) {
            type = 'remote';
            title = 'Дистанционный съем';
            color = '#feca57';
            icon = '📡';
        } else if (srcLower.includes('vega') || srcLower.includes('nb-11')) {
            type = 'vega';
            title = 'Вега NB-11';
            color = '#6c5ce7';
            icon = '📊';
        } else if (srcLower.includes('balancing') || srcLower.includes('балансировк')) {
            type = 'balancing';
            title = 'Балансировка';
            color = '#fd79a8';
            icon = '⚖️';
        } else if (srcLower.includes('startup') || srcLower.includes('запуск')) {
            type = 'startup';
            title = 'Запуск системы';
            color = '#fdcb6e';
            icon = '▶️';
        } else if (srcLower.includes('comprehensive') || srcLower.includes('комплексн')) {
            type = 'comprehensive';
            title = 'Комплексные услуги';
            color = '#0066cc';
            icon = '⚙️';
        } else if (srcLower.includes('lorawan') || srcLower.includes('nb-iot')) {
            type = 'technology';
            title = 'Технологии IoT';
            color = '#9b59b6';
            icon = '📶';
        } else if (srcLower.includes('engineer') || srcLower.includes('инженер')) {
            type = 'engineer';
            title = 'Профессиональные услуги';
            color = '#3498db';
            icon = '👷';
        }
        
        // Get title from alt attribute if available
        if (imgElement && imgElement.alt && !imgElement.dataset.placeholderTitle) {
            title = imgElement.alt;
        }
        
        // Calculate font sizes
        const iconSize = Math.min(width, height) / 6;
        const titleSize = Math.min(width, height) / 18;
        
        // Create SVG placeholder
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad-${type}-${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad-${type}-${Date.now()})" rx="8"/>
                <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" 
                      font-size="${iconSize}" fill="white" opacity="0.9" dominant-baseline="middle">
                    ${icon}
                </text>
                <text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" 
                      font-size="${titleSize}" fill="white" font-weight="bold" opacity="0.9" dominant-baseline="middle">
                    ${title}
                </text>
            </svg>
        `)}`;
    }

    /**
     * Setup error event handler for images
     */
    setupErrorHandler() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                const img = e.target;
                const originalSrc = img.src;
                
                // Don't replace if already using placeholder
                if (originalSrc.startsWith('data:image/svg+xml') || 
                    img.classList.contains('placeholder-image')) {
                    return;
                }
                
                // Replace with placeholder
                this.replaceWithPlaceholder(img, originalSrc);
            }
        }, true);
    }

    /**
     * Watch for dynamically added images (Alpine.js, AJAX, etc.)
     */
    setupMutationObserver() {
        if (typeof MutationObserver !== 'undefined') {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if node is an image
                            if (node.tagName === 'IMG') {
                                this.verifyImageExists(node);
                            }
                            
                            // Check for images inside the node
                            const images = node.querySelectorAll && node.querySelectorAll('img');
                            if (images) {
                                images.forEach(img => {
                                    if (!img.hasAttribute('data-fallback-checked')) {
                                        this.verifyImageExists(img);
                                    }
                                });
                            }
                        }
                    });
                });
            });
            
            // Start observing
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Re-check all images (useful after dynamic content load)
     */
    recheckImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.removeAttribute('data-fallback-checked');
        });
        this.checkAllImages();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageFallback = new ImageFallback();
    });
} else {
    window.imageFallback = new ImageFallback();
}

// Also initialize after Alpine.js loads (if present)
if (typeof Alpine !== 'undefined') {
    document.addEventListener('alpine:init', () => {
        if (window.imageFallback) {
            setTimeout(() => window.imageFallback.recheckImages(), 500);
        }
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageFallback;
}

