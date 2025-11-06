# Implementation Plan

- [x] 1. Set up project structure and core files





  - Create directory structure for CSS, JS, data, images, and documents
  - Set up HTML file templates for index, prices, and videos pages
  - Download and configure Bootstrap 5.3, VanillaTilt.js, SweetAlert2.js, Alpine.js, and jsPDF libraries
  - _Requirements: 1.2, 8.3_

- [x] 2. Create main HTML structure and navigation





  - [x] 2.1 Build responsive header with fixed navigation


    - Implement Bootstrap navbar with centered menu layout
    - Add logo placeholder and messenger buttons (Telegram, Viber)
    - Create theme switcher button in header
    - _Requirements: 2.1, 2.2, 10.1, 10.3, 10.5_

  - [x] 2.2 Implement semantic HTML structure


    - Use proper semantic tags (header, nav, main, section, article, footer)
    - Add SEO meta tags and structured data (JSON-LD)
    - Create sitemap.xml file
    - _Requirements: 11.1, 11.2, 11.4, 11.5_

  - [x] 2.3 Create hero section with main heading


    - Add main heading "Подключение к системе дистанционного съема в Республике Беларусь"
    - Implement responsive layout with Bootstrap grid
    - Add call-to-action buttons for messengers
    - _Requirements: 1.1, 1.3_

- [x] 3. Implement services cards with interactive effects





  - [x] 3.1 Create service card components


    - Build Bootstrap card layout with placeholders for images
    - Add service icons and descriptions for all categories (Поверка, Монтаж, ПНР, Дистанционный съем, Продажа)
    - Implement responsive grid layout for cards
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 3.2, 3.3, 9.1_

  - [x] 3.2 Add VanillaTilt.js effects to cards


    - Initialize VanillaTilt on service cards
    - Configure tilt parameters for smooth hover effects
    - _Requirements: 3.1_



  - [x] 3.3 Implement SweetAlert2 modals for service details




    - Create modal functionality for each service card
    - Add detailed service information in modals
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 4. Create JSON data management system





  - [x] 4.1 Create services.json data file


    - Define service data structure with categories and subcategories
    - Add service descriptions, icons, and placeholder images
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 4.2 Create blog.json data file


    - Define blog post structure with title, date, excerpt, content
    - Add sample blog posts with placeholder content
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.3 Create documents.json data file


    - Define document structure with title, type, filename, size
    - Add sample documents list
    - _Requirements: 7.1, 7.2_

- [x] 5. Implement blog functionality with Alpine.js





  - [x] 5.1 Create blog component with Alpine.js


    - Load blog posts from JSON file
    - Display posts with titles, dates, and excerpts
    - _Requirements: 5.1, 5.2, 5.3, 6.1_

  - [x] 5.2 Add blog post modal functionality


    - Implement SweetAlert2 modals for full blog post content
    - Add smooth animations and transitions
    - _Requirements: 5.4, 6.2_

- [x] 6. Create documents section




  - [x] 6.1 Implement documents display


    - Load documents from JSON file
    - Show document names, types, and file sizes
    - Add download links for PDF files
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.2 Create separate documents page


    - Move documents section from index.html to documents.html
    - Add document categories section
    - Include consultation section with messenger buttons
    - Update navigation links to point to documents.html
    - Fix documentsComponent Alpine.js integration
    - Add fallback fetch methods for data loading
    - Add inline documentsComponent with complete document data
    - Implement graceful fallback to embedded data when JSON fails
    - Clean up debug logging and optimize performance
    - Remove document category filtering system (as requested)
    - Clean up related JavaScript components and CSS styles
    - Simplify documents page to focus on document listing only
    - _Requirements: 7.1, 7.2, 7.3, 10.1, 10.3_

- [x] 7. Implement theme switching functionality





  - [x] 7.1 Create theme switcher with Alpine.js


    - Implement theme toggle button in header
    - Save theme preference in localStorage
    - Add smooth theme transition animations
    - _Requirements: 6.1, 6.2_

  - [x] 7.2 Create glassmorphism dark theme styles


    - Implement CSS for dark theme with glassmorphism effects
    - Add backdrop-filter blur effects for cards and navigation
    - Create gradient backgrounds and colored shadows
    - _Requirements: 1.3_

- [x] 8. Build commercial proposal generator





  - [x] 8.1 Create proposal form component


    - Build form with fields for company name, УНП, and address
    - Add form validation with Alpine.js
    - _Requirements: 6.1_

  - [x] 8.2 Implement PDF generation with jsPDF


    - Create proposal template in Markdown format
    - Implement PDF generation logic with client data insertion
    - Add company seal image to generated PDFs
    - _Requirements: 6.1_

  - [x] 8.3 Create proposal template file


    - Write Markdown template with placeholder variables
    - Include all service categories with pricing
    - Add company information and validity period
    - _Requirements: 11.7_

- [x] 9. Create pricing page





  - [x] 9.1 Build pricing page HTML structure


    - Create separate prices.html page
    - Implement responsive pricing tables with Bootstrap
    - Add service categories and package deals
    - _Requirements: 8.1_

  - [x] 9.2 Create prices.json data file


    - Define pricing structure with categories and services
    - Add package deals with discount pricing
    - Include service features and descriptions
    - _Requirements: 11.7_

  - [x] 9.3 Implement pricing calculator with Alpine.js


    - Create interactive service selection
    - Add real-time price calculation
    - Implement integration with proposal generator
    - _Requirements: 6.1, 6.2_

- [x] 10. Create video gallery page




  - [x] 10.1 Build video gallery HTML structure


    - Create separate videos.html page
    - Implement responsive video card layout
    - Add category filtering interface
    - _Requirements: 8.1_

  - [x] 10.2 Create videos.json data file


    - Define video structure with YouTube IDs
    - Add video categories and metadata
    - Include video descriptions and thumbnails
    - _Requirements: 6.1_

  - [x] 10.3 Implement video gallery with Alpine.js


    - Create video filtering by categories
    - Implement YouTube thumbnail loading
    - Add SweetAlert2 modals for video playback
    - _Requirements: 6.1, 6.2_

- [ ] 11. Add messenger integration
  - [ ] 11.1 Implement Telegram button functionality
    - Add Telegram icon and link to channel
    - Position button in header and as floating action
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 11.2 Implement Viber button functionality
    - Add Viber icon and phone number link
    - Create proper Viber chat URL format
    - _Requirements: 10.3, 10.4, 10.5_

  - [ ] 11.3 Make messenger buttons visible on all pages
    - Add floating action buttons for mobile
    - Ensure consistent placement across pages
    - _Requirements: 10.6_

- [x] 12. Implement responsive design and mobile optimization




  - [x] 12.1 Create responsive CSS styles


    - Implement mobile-first responsive design
    - Add custom CSS for enhanced Bootstrap styling
    - Create smooth animations and transitions
    - _Requirements: 8.1, 8.2, 6.2_

  - [x] 12.2 Add image optimization and lazy loading


    - Implement placeholder images for all services
    - Add alt attributes for accessibility
    - Create WebP format with JPEG fallback
    - _Requirements: 3.3, 11.3_

- [ ] 13. Implement SEO optimization
  - [ ] 13.1 Add comprehensive meta tags
    - Create unique meta descriptions for each page
    - Add Open Graph tags for social sharing
    - Include relevant keywords for Belarus market
    - _Requirements: 11.1, 11.7, 11.8_

  - [ ] 13.2 Optimize for search engines
    - Minify CSS and JavaScript files
    - Optimize images for fast loading
    - Create proper URL structure
    - _Requirements: 11.6, 8.3_

- [ ]* 14. Testing and quality assurance
  - [ ]* 14.1 Cross-browser testing
    - Test functionality in Chrome, Firefox, Safari, Edge
    - Verify responsive design on different screen sizes
    - Test all interactive elements and animations
    - _Requirements: 8.2_

  - [ ]* 14.2 Performance testing
    - Test page loading speeds
    - Verify image optimization effectiveness
    - Check JavaScript performance on mobile devices
    - _Requirements: 8.3, 11.6_

  - [ ]* 14.3 Accessibility testing
    - Verify keyboard navigation functionality
    - Test screen reader compatibility
    - Check color contrast ratios
    - _Requirements: 11.3_