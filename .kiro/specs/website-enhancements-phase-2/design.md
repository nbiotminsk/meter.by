# Design Document

## Overview

This design document outlines the technical architecture and implementation approach for enhancing the Meter.by website with PDF proposal generation, improved pricing page UI, navigation fixes, video gallery enhancements, and news section restructuring. The solution leverages client-side JavaScript libraries for PDF generation, maintains the existing Bootstrap/Alpine.js architecture, and introduces a file-based news management system.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  index.html  │  │ prices.html  │  │  news.html   │      │
│  │              │  │              │  │              │      │
│  │  - Services  │  │  - Packages  │  │  - Articles  │      │
│  │  - Documents │  │  - Calculator│  │  - Listing   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ videos.html  │  │documents.html│  │news/[id].html│      │
│  │              │  │              │  │              │      │
│  │  - Gallery   │  │  - PDF List  │  │  - Article   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           JavaScript Components                        │  │
│  │  - PricingCalculator (Enhanced)                       │  │
│  │  - PDFGenerator (New)                                 │  │
│  │  - VideoGallery (Enhanced)                            │  │
│  │  - NewsManager (New)                                  │  │
│  │  - NavigationManager (New)                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           External Libraries                           │  │
│  │  - jsPDF (PDF generation)                             │  │
│  │  - jsPDF-AutoTable (Table formatting)                 │  │
│  │  - marked.js (Markdown parsing)                       │  │
│  │  - Bootstrap 5.3                                      │  │
│  │  - Alpine.js 3.x                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Static Files   │
                    │                  │
                    │  - videos.json   │
                    │  - proposal-     │
                    │    template.md   │
                    │  - news/*.html   │
                    └──────────────────┘
```

## Components and Interfaces

### 1. PDF Generator Component

**Purpose:** Generate professional PDF commercial proposals from selected services and user input.

**Key Classes/Functions:**

```javascript
class PDFProposalGenerator {
  constructor(template, services, companyInfo)
  
  // Parse markdown template
  parseTemplate()
  
  // Replace template variables
  replaceVariables(companyInfo)
  
  // Generate PDF with Russian font support
  generatePDF()
  
  // Add services table to PDF
  addServicesTable(services)
  
  // Calculate totals
  calculateTotal(services)
  
  // Download PDF file
  downloadPDF(filename)
}
```

**Dependencies:**
- jsPDF library for PDF generation
- jsPDF-AutoTable for table formatting
- Custom Russian font (e.g., PTSans, Roboto) embedded in base64
- marked.js for markdown parsing

**Integration Points:**
- Triggered from pricing calculator when user clicks "Получить коммерческое предложение"
- Receives selected services array from PricingCalculator
- Displays SweetAlert2 modal for company information input
- Generates and downloads PDF on form submission

### 2. Enhanced Pricing Calculator Component

**Purpose:** Manage service selection, quantity adjustments, and trigger proposal generation.

**Key Enhancements:**

```javascript
class PricingCalculator {
  // Existing functionality...
  
  // New: Open proposal form with glassmorphism styling
  openProposalForm()
  
  // New: Validate company information
  validateCompanyInfo(info)
  
  // New: Trigger PDF generation
  generateProposal(companyInfo)
  
  // New: Scroll to calculator on floating cart click
  scrollToCalculator()
}
```

**UI Changes:**
- Remove badge tags from service descriptions
- Add cart icon to service name column
- Reorder sections: packages first, then pricing tables
- Apply glassmorphism styling to package cards
- Add floating cart button with smooth scroll

### 3. Video Gallery Component

**Purpose:** Display and play YouTube videos without API dependencies.

**Key Changes:**

```javascript
// Alpine.js component
Alpine.data('videoGallery', () => ({
  videos: [],
  
  // Load videos from JSON
  async init() {
    const data = await fetch('data/videos.json').then(r => r.json());
    this.videos = data.videos;
  },
  
  // Construct YouTube thumbnail URL
  getYoutubeThumbnail(youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  },
  
  // Open video modal with embedded iframe
  openVideoModal(youtubeId, title) {
    // Use SweetAlert2 with iframe embed
    // URL: https://www.youtube.com/embed/${youtubeId}?autoplay=1
  }
}));
```

**Data Structure (videos.json):**
```json
{
  "videos": [
    {
      "id": "unique-id",
      "title": "Video Title",
      "youtubeId": "dQw4w9WgXcQ",
      "category": "verification",
      "duration": "8:45",
      "uploadDate": "2024-01-15"
    }
  ]
}
```

### 4. News Management System

**Purpose:** Organize news articles as separate HTML files with a listing page.

**File Structure:**
```
news/
├── index.html (listing page)
├── articles/
│   ├── 2024-01-15-new-verification-requirements.html
│   ├── 2024-01-10-remote-reading-advantages.html
│   └── ...
└── data/
    └── articles-metadata.json
```

**Metadata Structure:**
```json
{
  "articles": [
    {
      "id": "new-verification-requirements",
      "title": "Новые требования к поверке счетчиков в 2024 году",
      "slug": "2024-01-15-new-verification-requirements",
      "date": "2024-01-15",
      "excerpt": "Изменения в законодательстве...",
      "image": "images/placeholders/blog-verification-2024.jpg",
      "tags": ["поверка", "законодательство", "2024"]
    }
  ]
}
```

**News Listing Component:**
```javascript
Alpine.data('newsListing', () => ({
  articles: [],
  
  async init() {
    const data = await fetch('news/data/articles-metadata.json').then(r => r.json());
    this.articles = data.articles;
  },
  
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}));
```

### 5. Navigation Manager

**Purpose:** Automatically highlight active navigation links based on current page.

**Implementation:**

```javascript
class NavigationManager {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.init();
  }
  
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
  }
  
  init() {
    this.setActiveLink();
  }
  
  setActiveLink() {
    // Remove all active classes
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`a[href*="${this.currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    // Special handling for news articles
    if (window.location.pathname.includes('/news/articles/')) {
      const newsLink = document.querySelector('a[href*="news"]');
      if (newsLink) newsLink.classList.add('active');
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new NavigationManager();
});
```

## Data Models

### Service Selection Model

```javascript
{
  id: string,              // Unique service identifier
  name: string,            // Service name
  price: number,           // Price per unit in BYN
  quantity: number,        // Selected quantity (default: 1)
  isPackage: boolean,      // Whether this is a package deal
  category: string         // Service category
}
```

### Company Information Model

```javascript
{
  companyName: string,     // Company name
  unp: string,             // УНП (tax ID)
  address: string,         // Company address
  validUntil: string,      // Proposal validity date (YYYY-MM-DD)
  date: string             // Current date (auto-generated)
}
```

### Video Model

```javascript
{
  id: string,              // Unique video identifier
  title: string,           // Video title
  description: string,     // Video description
  youtubeId: string,       // YouTube video ID
  category: string,        // Video category
  duration: string,        // Video duration (MM:SS)
  uploadDate: string,      // Upload date (YYYY-MM-DD)
  featured: boolean        // Whether video is featured
}
```

### News Article Model

```javascript
{
  id: string,              // Unique article identifier
  title: string,           // Article title
  slug: string,            // URL-friendly slug
  date: string,            // Publication date (YYYY-MM-DD)
  excerpt: string,         // Short excerpt
  content: string,         // Full article content (HTML)
  image: string,           // Featured image path
  tags: string[]           // Article tags
}
```

## Error Handling

### PDF Generation Errors

1. **Missing Template Error**
   - Scenario: Template file not found
   - Handling: Display error message, log to console, prevent PDF generation
   - User Message: "Ошибка: шаблон предложения не найден"

2. **Invalid Company Information**
   - Scenario: Required fields empty or invalid
   - Handling: Validate before PDF generation, highlight invalid fields
   - User Message: "Пожалуйста, заполните все обязательные поля"

3. **Font Loading Error**
   - Scenario: Russian font fails to load
   - Handling: Fallback to default font with warning
   - User Message: "Предупреждение: используется стандартный шрифт"

4. **PDF Generation Failure**
   - Scenario: jsPDF throws error during generation
   - Handling: Catch error, log details, show user-friendly message
   - User Message: "Ошибка при создании PDF. Попробуйте снова."

### Video Loading Errors

1. **JSON Parse Error**
   - Scenario: videos.json is malformed
   - Handling: Display error message, show empty state
   - User Message: "Ошибка загрузки видео. Попробуйте обновить страницу."

2. **YouTube Embed Error**
   - Scenario: Video ID is invalid or video unavailable
   - Handling: Show placeholder thumbnail, disable play button
   - User Message: "Видео временно недоступно"

### News Loading Errors

1. **Metadata Loading Error**
   - Scenario: articles-metadata.json fails to load
   - Handling: Display error message, show empty state
   - User Message: "Ошибка загрузки новостей"

2. **Article Not Found**
   - Scenario: User navigates to non-existent article
   - Handling: Show 404 page with link back to news listing
   - User Message: "Статья не найдена"

## Testing Strategy

### Unit Testing

**PDF Generator Tests:**
- Test template variable replacement
- Test service table generation
- Test total calculation
- Test Russian character encoding
- Test filename generation

**Pricing Calculator Tests:**
- Test service selection/deselection
- Test quantity adjustments
- Test total price calculation
- Test package selection
- Test cart reset functionality

**Video Gallery Tests:**
- Test video data loading
- Test thumbnail URL generation
- Test category filtering
- Test modal opening

**News Manager Tests:**
- Test article metadata loading
- Test article listing display
- Test date formatting
- Test tag filtering

### Integration Testing

**PDF Generation Flow:**
1. Select multiple services with different quantities
2. Click "Получить коммерческое предложение"
3. Fill in company information form
4. Verify PDF downloads with correct data
5. Verify Russian characters display correctly
6. Verify all dollar signs are removed

**Navigation Flow:**
1. Navigate to each page (index, prices, videos, documents, news)
2. Verify correct navigation link is highlighted
3. Navigate to individual news article
4. Verify "Новости" link remains highlighted

**Video Playback Flow:**
1. Load videos.html
2. Verify videos load from JSON
3. Click on video card
4. Verify modal opens with embedded YouTube player
5. Verify video autoplays

**News Management Flow:**
1. Navigate to news listing page
2. Verify all articles display correctly
3. Click on article
4. Verify article page loads with full content
5. Verify back navigation works

### Browser Compatibility Testing

**Target Browsers:**
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Test Cases:**
- PDF generation and download
- Glassmorphism effects rendering
- Video modal functionality
- Smooth scrolling
- Theme switching
- Responsive layout

### Performance Testing

**Metrics to Monitor:**
- PDF generation time (target: < 2 seconds)
- Page load time (target: < 3 seconds)
- Video thumbnail loading (lazy loading)
- News listing load time
- Smooth scroll performance (60fps)

## Implementation Notes

### PDF Generation Library Selection

**Chosen: jsPDF + jsPDF-AutoTable**

Rationale:
- Mature, well-maintained library
- Good Russian font support via custom fonts
- AutoTable plugin for easy table generation
- No server-side dependencies
- Good documentation and community support

Alternative considered: pdfmake (more complex setup)

### Russian Font Embedding

Use PTSans or Roboto font in base64 format:
```javascript
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

// Add Russian font
doc.addFileToVFS('PTSans-Regular.ttf', base64Font);
doc.addFont('PTSans-Regular.ttf', 'PTSans', 'normal');
doc.setFont('PTSans');
```

### Glassmorphism Styling

Apply existing `css/glassmorphism-services.css` to package cards:
```html
<div class="card package-card glass-effect h-100">
  <!-- Package content -->
</div>
```

### Floating Cart Button

```html
<button class="floating-cart-btn" onclick="scrollToCalculator()">
  <i class="bi bi-cart3"></i>
  <span class="cart-count" x-show="selectedServices.length > 0" 
        x-text="selectedServices.length"></span>
</button>
```

```css
.floating-cart-btn {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 999;
  cursor: pointer;
  transition: all 0.3s ease;
}

.floating-cart-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
```

### News Article Template

```html
<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ARTICLE_TITLE}} - Meter.by</title>
    <!-- Include all standard CSS/JS -->
</head>
<body>
    <!-- Navigation (same as other pages) -->
    
    <main class="article-page">
        <article class="container py-5 mt-5">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <header class="article-header mb-4">
                        <h1 class="display-4">{{ARTICLE_TITLE}}</h1>
                        <div class="article-meta">
                            <span class="date">{{ARTICLE_DATE}}</span>
                            <span class="tags">{{ARTICLE_TAGS}}</span>
                        </div>
                    </header>
                    
                    <img src="{{ARTICLE_IMAGE}}" alt="{{ARTICLE_TITLE}}" 
                         class="img-fluid rounded mb-4">
                    
                    <div class="article-content">
                        {{ARTICLE_CONTENT}}
                    </div>
                    
                    <footer class="article-footer mt-5">
                        <a href="../index.html" class="btn btn-outline-primary">
                            <i class="bi bi-arrow-left me-2"></i>
                            Вернуться к новостям
                        </a>
                    </footer>
                </div>
            </div>
        </article>
    </main>
    
    <!-- Footer (same as other pages) -->
</body>
</html>
```

## Security Considerations

1. **Input Validation**
   - Sanitize all user inputs in company information form
   - Validate UNP format (9 digits)
   - Validate date formats
   - Prevent XSS in article content

2. **File Access**
   - Ensure news article files are served from designated directory only
   - Prevent directory traversal attacks
   - Validate file extensions

3. **External Resources**
   - Use HTTPS for all external libraries (CDN)
   - Implement Content Security Policy headers
   - Validate YouTube video IDs format

## Accessibility Considerations

1. **PDF Generation**
   - Ensure sufficient color contrast in PDF
   - Use semantic structure in PDF content
   - Include alt text for images in PDF

2. **Navigation**
   - Maintain keyboard navigation support
   - Ensure active link is visually distinct
   - Provide skip links

3. **Video Gallery**
   - Provide keyboard controls for video cards
   - Include video transcripts where possible
   - Ensure modal is keyboard accessible

4. **News Articles**
   - Use semantic HTML5 elements
   - Provide proper heading hierarchy
   - Ensure readable font sizes and line heights
