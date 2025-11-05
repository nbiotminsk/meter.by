/**
 * Placeholder Image Generator
 * Creates SVG placeholders for missing images
 */

class PlaceholderGenerator {
    constructor() {
        this.defaultColors = {
            'heat-meter': '#ff6b6b',
            'water-meter': '#4ecdc4',
            'verification': '#45b7d1',
            'installation': '#96ceb4',
            'remote': '#feca57',
            'vega': '#6c5ce7',
            'balancing': '#fd79a8',
            'startup': '#fdcb6e'
        };
        this.init();
    }

    init() {
        this.createMissingPlaceholders();
        this.setupImageErrorHandling();
    }

    /**
     * Create SVG placeholder for a specific service type
     */
    createSVGPlaceholder(width = 400, height = 300, type = 'default', title = 'Изображение услуги') {
        const color = this.defaultColors[type] || '#e0e0e0';
        const icon = this.getIconForType(type);
        
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad-${type})"/>
                <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" 
                      font-size="${Math.min(width, height) / 8}" fill="white" opacity="0.9">
                    ${icon}
                </text>
                <text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" 
                      font-size="${Math.min(width, height) / 20}" fill="white" opacity="0.8">
                    ${title}
                </text>
            </svg>
        `)}`;
    }

    /**
     * Get appropriate icon for service type
     */
    getIconForType(type) {
        const icons = {
            'heat-meter': '🌡️',
            'water-meter': '💧',
            'verification': '✅',
            'installation': '🔧',
            'remote': '📡',
            'vega': '📊',
            'balancing': '⚖️',
            'startup': '▶️',
            'default': '📷'
        };
        return icons[type] || icons.default;
    }

    /**
     * Create all missing placeholder images
     */
    createMissingPlaceholders() {
        const placeholders = {
            'images/placeholders/heat-meter-verification.jpg': {
                type: 'verification',
                title: 'Поверка счетчиков тепла'
            },
            'images/placeholders/water-meter-verification.jpg': {
                type: 'verification',
                title: 'Поверка счетчиков воды'
            },
            'images/placeholders/heat-meter-installation.jpg': {
                type: 'installation',
                title: 'Монтаж счетчиков тепла'
            },
            'images/placeholders/water-meter-installation.jpg': {
                type: 'installation',
                title: 'Монтаж счетчиков воды'
            },
            'images/placeholders/heating-balancing.jpg': {
                type: 'balancing',
                title: 'Балансировка отопления'
            },
            'images/placeholders/heating-startup.jpg': {
                type: 'startup',
                title: 'Запуск системы отопления'
            },
            'images/placeholders/remote-heat-reading.jpg': {
                type: 'remote',
                title: 'Дистанционный съем тепла'
            },
            'images/placeholders/remote-water-reading.jpg': {
                type: 'remote',
                title: 'Дистанционный съем воды'
            },
            'images/placeholders/vega-nb11.jpg': {
                type: 'vega',
                title: 'Вега NB-11'
            }
        };

        // Store placeholders for use by image optimizer
        this.placeholders = placeholders;
    }

    /**
     * Get placeholder for a specific image path
     */
    getPlaceholder(imagePath, width = 400, height = 300) {
        const placeholder = this.placeholders[imagePath];
        if (placeholder) {
            return this.createSVGPlaceholder(width, height, placeholder.type, placeholder.title);
        }
        
        // Extract type from filename
        const filename = imagePath.split('/').pop().toLowerCase();
        let type = 'default';
        
        if (filename.includes('heat')) type = 'heat-meter';
        else if (filename.includes('water')) type = 'water-meter';
        else if (filename.includes('verification')) type = 'verification';
        else if (filename.includes('installation')) type = 'installation';
        else if (filename.includes('remote')) type = 'remote';
        else if (filename.includes('vega')) type = 'vega';
        else if (filename.includes('balancing')) type = 'balancing';
        else if (filename.includes('startup')) type = 'startup';
        
        return this.createSVGPlaceholder(width, height, type, 'Изображение услуги');
    }

    /**
     * Setup error handling for missing images
     */
    setupImageErrorHandling() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                const img = e.target;
                const originalSrc = img.src;
                
                // Don't replace if already using placeholder
                if (originalSrc.startsWith('data:image/svg+xml')) {
                    return;
                }
                
                // Create appropriate placeholder
                const placeholder = this.getPlaceholder(originalSrc);
                img.src = placeholder;
                img.classList.add('placeholder-image');
                
                // Add title for accessibility
                if (!img.title) {
                    img.title = 'Изображение временно недоступно';
                }
            }
        }, true);
    }

    /**
     * Replace all images with placeholders (for development)
     */
    replaceAllWithPlaceholders() {
        const images = document.querySelectorAll('img[src*="placeholders"]');
        images.forEach(img => {
            const placeholder = this.getPlaceholder(img.src);
            img.src = placeholder;
            img.classList.add('placeholder-image');
        });
    }

    /**
     * Create responsive placeholder with multiple sizes
     */
    createResponsivePlaceholder(basePath, type, title) {
        const sizes = [
            { width: 400, height: 300, suffix: '-small' },
            { width: 800, height: 600, suffix: '-large' },
            { width: 1200, height: 900, suffix: '-xl' }
        ];

        const placeholders = {};
        sizes.forEach(size => {
            const path = basePath.replace('.jpg', `${size.suffix}.jpg`);
            placeholders[path] = this.createSVGPlaceholder(size.width, size.height, type, title);
        });

        return placeholders;
    }
}

// Initialize placeholder generator
document.addEventListener('DOMContentLoaded', () => {
    window.placeholderGenerator = new PlaceholderGenerator();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlaceholderGenerator;
}