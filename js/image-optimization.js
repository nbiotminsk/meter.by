/**
 * Image Optimization and Lazy Loading System
 * Implements WebP support with JPEG fallback and lazy loading
 */

class ImageOptimizer {
    constructor() {
        this.supportsWebP = false;
        this.lazyImages = [];
        this.imageObserver = null;
        this.init();
    }

    /**
     * Initialize the image optimization system
     */
    init() {
        this.checkWebPSupport();
        this.setupLazyLoading();
        this.optimizeExistingImages();
    }

    /**
     * Check if browser supports WebP format
     */
    checkWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            this.supportsWebP = (webP.height === 2);
            this.updateImageSources();
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    /**
     * Setup Intersection Observer for lazy loading
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // Fallback for browsers without Intersection Observer
            this.loadAllImages();
        }
    }

    /**
     * Observe all lazy-loadable images
     */
    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    /**
     * Load a single image with optimization
     */
    loadImage(img) {
        // Show loading skeleton
        img.classList.add('loading-skeleton');

        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (src) {
            const optimizedSrc = this.getOptimizedImagePath(src);
            
            // Create a new image to test loading
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                img.src = optimizedSrc;
                img.classList.remove('loading-skeleton');
                img.classList.add('loaded');
                
                // Add fade-in animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 10);
            };
            
            imageLoader.onerror = () => {
                // Fallback to original image
                img.src = src;
                img.classList.remove('loading-skeleton');
                img.classList.add('loaded', 'fallback');
            };
            
            imageLoader.src = optimizedSrc;
        }

        if (srcset) {
            img.srcset = srcset;
        }

        // Remove data attributes
        delete img.dataset.src;
        delete img.dataset.srcset;
    }

    /**
     * Get optimized image path (WebP if supported, otherwise original)
     */
    getOptimizedImagePath(originalPath) {
        if (!this.supportsWebP) {
            return originalPath;
        }

        // Convert JPEG/JPG to WebP
        if (originalPath.match(/\.(jpe?g)$/i)) {
            return originalPath.replace(/\.(jpe?g)$/i, '.webp');
        }

        // Convert PNG to WebP
        if (originalPath.match(/\.png$/i)) {
            return originalPath.replace(/\.png$/i, '.webp');
        }

        return originalPath;
    }

    /**
     * Update existing image sources based on WebP support
     */
    updateImageSources() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (img.src && !img.classList.contains('no-optimize')) {
                const optimizedSrc = this.getOptimizedImagePath(img.src);
                if (optimizedSrc !== img.src) {
                    // Test if WebP version exists
                    const testImg = new Image();
                    testImg.onload = () => {
                        img.src = optimizedSrc;
                        img.classList.add('webp-optimized');
                    };
                    testImg.onerror = () => {
                        // Keep original image
                        img.classList.add('webp-fallback');
                    };
                    testImg.src = optimizedSrc;
                }
            }
        });
    }

    /**
     * Load all images immediately (fallback)
     */
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }

    /**
     * Optimize existing images by adding proper attributes
     */
    optimizeExistingImages() {
        const images = document.querySelectorAll('img');
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
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', this.generateAltText(img));
            }
        });
    }

    /**
     * Generate alt text based on image context
     */
    generateAltText(img) {
        const src = img.src || img.dataset.src || '';
        const className = img.className || '';
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
        if (src.includes('placeholder')) {
            return 'Изображение услуги - подробности в описании';
        }

        return 'Изображение услуги компании по дистанционному съему показаний';
    }

    /**
     * Create responsive image with multiple sources
     */
    createResponsiveImage(basePath, alt, className = '') {
        const picture = document.createElement('picture');
        
        // WebP sources for different screen sizes
        if (this.supportsWebP) {
            const webpSourceLarge = document.createElement('source');
            webpSourceLarge.media = '(min-width: 768px)';
            webpSourceLarge.srcset = `${basePath.replace(/\.(jpe?g|png)$/i, '-large.webp')}`;
            webpSourceLarge.type = 'image/webp';
            picture.appendChild(webpSourceLarge);

            const webpSourceSmall = document.createElement('source');
            webpSourceSmall.media = '(max-width: 767px)';
            webpSourceSmall.srcset = `${basePath.replace(/\.(jpe?g|png)$/i, '-small.webp')}`;
            webpSourceSmall.type = 'image/webp';
            picture.appendChild(webpSourceSmall);
        }

        // Fallback JPEG sources
        const jpegSourceLarge = document.createElement('source');
        jpegSourceLarge.media = '(min-width: 768px)';
        jpegSourceLarge.srcset = `${basePath.replace(/\.(jpe?g|png)$/i, '-large.jpg')}`;
        picture.appendChild(jpegSourceLarge);

        const jpegSourceSmall = document.createElement('source');
        jpegSourceSmall.media = '(max-width: 767px)';
        jpegSourceSmall.srcset = `${basePath.replace(/\.(jpe?g|png)$/i, '-small.jpg')}`;
        picture.appendChild(jpegSourceSmall);

        // Default img element
        const img = document.createElement('img');
        img.src = basePath;
        img.alt = alt;
        img.className = className;
        img.loading = 'lazy';
        img.decoding = 'async';
        picture.appendChild(img);

        return picture;
    }

    /**
     * Add new images to lazy loading observer
     */
    observeNewImages() {
        if (this.imageObserver) {
            const newImages = document.querySelectorAll('img[data-src]:not(.observed)');
            newImages.forEach(img => {
                img.classList.add('observed');
                this.imageObserver.observe(img);
            });
        }
    }

    /**
     * Preload critical images
     */
    preloadCriticalImages(imagePaths) {
        imagePaths.forEach(path => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.getOptimizedImagePath(path);
            document.head.appendChild(link);
        });
    }

    /**
     * Generate placeholder image data URL
     */
    generatePlaceholder(width = 400, height = 300, color = '#f0f0f0') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        // Icon
        ctx.fillStyle = '#ccc';
        ctx.font = `${Math.min(width, height) / 4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📷', width / 2, height / 2);
        
        return canvas.toDataURL('image/png');
    }
}

// Initialize image optimizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageOptimizer = new ImageOptimizer();
    
    // Preload critical images (hero section, above-the-fold content)
    const criticalImages = [
        'images/placeholders/heat-meter.jpg',
        'images/placeholders/water-meter.jpg',
        'images/company-seal.png'
    ];
    
    window.imageOptimizer.preloadCriticalImages(criticalImages);
});

// Re-observe images when new content is added dynamically
document.addEventListener('contentLoaded', () => {
    if (window.imageOptimizer) {
        window.imageOptimizer.observeNewImages();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
}