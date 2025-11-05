/**
 * NavigationManager - Manages active navigation link highlighting
 * Automatically detects current page and highlights the appropriate nav link
 */
class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    /**
     * Detect current page from URL
     * @returns {string} Current page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        // Remove .html extension for comparison
        const pageName = page.replace('.html', '');
        
        // Handle empty or root path
        if (!pageName || pageName === '') {
            return 'index';
        }
        
        // Special handling for news articles
        if (path.includes('/news/articles/') || path.includes('\\news\\articles\\')) {
            return 'news';
        }
        
        return pageName;
    }

    /**
     * Initialize navigation manager
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setActiveLink());
        } else {
            this.setActiveLink();
        }
    }

    /**
     * Set active class on the appropriate navigation link
     */
    setActiveLink() {
        // Remove all active classes from nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Determine which link should be active
        let activeLink = null;

        switch (this.currentPage) {
            case 'index':
                // For index page, highlight the home icon
                // Try both index.html and #home links
                activeLink = document.querySelector('.nav-link[href="index.html"]') || 
                            document.querySelector('.nav-link[href="#home"]');
                break;
            case 'prices':
                activeLink = document.querySelector('.nav-link[href="prices.html"]');
                break;
            case 'videos':
                activeLink = document.querySelector('.nav-link[href="videos.html"]');
                break;
            case 'documents':
                activeLink = document.querySelector('.nav-link[href="documents.html"]');
                break;
            case 'news':
                // For news listing or individual articles
                activeLink = document.querySelector('.nav-link[href="news.html"]') ||
                            document.querySelector('.nav-link[href*="news"]');
                break;
            default:
                // Try to find a link that matches the current page
                activeLink = document.querySelector(`.nav-link[href="${this.currentPage}.html"]`);
        }

        // Apply active class to the matching link
        if (activeLink) {
            activeLink.classList.add('active');
            console.log('NavigationManager: Active link set for page:', this.currentPage);
        } else {
            console.warn('NavigationManager: No matching link found for page:', this.currentPage);
        }
    }

    /**
     * Manually set active link (useful for dynamic navigation)
     * @param {string} pageName - Name of the page to set as active
     */
    setActivePage(pageName) {
        this.currentPage = pageName;
        this.setActiveLink();
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    window.NavigationManager = NavigationManager;
    
    // Create global instance
    window.navigationManager = new NavigationManager();
}
