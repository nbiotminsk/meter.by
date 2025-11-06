# Implementation Plan

- [x] 1. Set up PDF generation infrastructure




  - Add jsPDF and jsPDF-AutoTable libraries to prices.html via CDN
  - Add marked.js library for markdown parsing
  - Embed Russian font (PTSans or Roboto) in base64 format for proper Cyrillic rendering
  - _Requirements: 1.4, 1.9_

- [x] 2. Create PDF proposal generator component






  - [x] 2.1 Implement PDFProposalGenerator class with template parsing

    - Create class constructor accepting template, services, and company info
    - Implement parseTemplate() method to read and parse markdown template
    - Implement replaceVariables() method to substitute {{VARIABLE}} placeholders
    - _Requirements: 1.3, 1.5, 1.9_

  - [x] 2.2 Implement PDF generation with Russian font support


    - Configure jsPDF with Russian font
    - Implement generatePDF() method with proper encoding
    - Add company header section with logo placeholder
    - Format document with proper margins and spacing
    - _Requirements: 1.4, 1.8_


  - [x] 2.3 Implement services table generation

    - Create addServicesTable() method using jsPDF-AutoTable
    - Group services by category (verification, installation, PNR, remote, equipment)
    - Include service name, quantity, unit price, and total price columns
    - Apply proper table styling matching proposal template
    - _Requirements: 1.6, 1.7_

  - [x] 2.4 Implement total calculation and download


    - Create calculateTotal() method to sum all service prices with quantities
    - Add totals section to PDF
    - Implement downloadPDF() method with meaningful filename generation
    - Format filename as "Предложение_CompanyName_Date.pdf"
    - _Requirements: 1.7, 1.8_

- [x] 3. Enhance pricing calculator with proposal form




  - [x] 3.1 Create company information form modal


    - Design glassmorphism-styled form using SweetAlert2
    - Add input fields: company name, UNP, address, valid until date
    - Apply glass-input and glass-btn classes from glassmorphism-form.css
    - Add form validation for required fields
    - _Requirements: 1.2, 1.3_

  - [x] 3.2 Integrate PDF generation with calculator


    - Update openProposalForm() method to display company info modal
    - Implement validateCompanyInfo() method with UNP format validation
    - Create generateProposal() method to trigger PDF generation
    - Pass selected services with quantities to PDF generator
    - Handle success/error states with user feedback
    - _Requirements: 1.1, 1.2, 1.3, 1.8_

- [x] 4. Update pricing page UI structure and styling





  - [x] 4.1 Remove badge tags from service descriptions


    - Remove all `<small class="badge bg-secondary">` elements from pricing tables
    - Keep only essential service information in description column
    - _Requirements: 2.1_

  - [x] 4.2 Add shopping cart icons to service rows


    - Add cart icon (`<i class="bi bi-cart3">`) to each service name in "Услуга" column
    - Position icon before service name text
    - Style icon to match existing design
    - _Requirements: 2.2_

  - [x] 4.3 Reorder page sections


    - Move #packages section before #pricing-tables section in HTML
    - Update any section-specific styling to maintain visual consistency
    - Adjust anchor links if necessary
    - _Requirements: 2.3_

  - [x] 4.4 Apply glassmorphism styling to package cards


    - Add "glass-effect" class to all package card elements
    - Ensure glassmorphism-services.css is loaded on prices.html
    - Test glassmorphism effects in both light and dark themes
    - Verify hover effects and animations work correctly
    - _Requirements: 2.4_

  - [x] 4.5 Reduce pricing table header height


    - Target the remote reading section card header specifically
    - Adjust padding and font sizes for better visual balance
    - Ensure text remains readable and properly aligned
    - _Requirements: 2.5_

  - [x] 4.6 Create floating shopping cart button


    - Create HTML structure for floating cart button with cart count badge
    - Implement CSS styling with fixed positioning and smooth animations
    - Add scrollToCalculator() function for smooth scroll to calculator section
    - Show/hide cart count badge based on selected services
    - Position button above existing messenger buttons
    - _Requirements: 2.6, 2.7_

- [x] 5. Fix navigation menu active states




  - [x] 5.1 Create NavigationManager class


    - Implement getCurrentPage() method to detect current page from URL
    - Implement setActiveLink() method to add/remove active classes
    - Handle special case for news article pages
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 5.2 Update navigation HTML on all pages


    - Ensure consistent navigation structure across all pages
    - Remove hardcoded active classes from navigation links
    - Add NavigationManager initialization script to all pages
    - Test navigation highlighting on each page
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 6. Enhance video gallery with direct YouTube embedding




  - [x] 6.1 Update video gallery component


    - Modify getYoutubeThumbnail() to use direct YouTube thumbnail URL
    - Update openVideoModal() to use iframe embed instead of API
    - Set autoplay parameter in YouTube embed URL
    - Remove any YouTube API initialization code
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_


  - [x] 6.2 Add error handling for video loading

    - Implement fallback for missing thumbnails
    - Add error message display for failed video loads
    - Test with invalid YouTube IDs
    - _Requirements: 4.6_

- [x] 7. Restructure news section






  - [x] 7.1 Remove news section from index.html

    - Remove #blog section from index.html
    - Remove blog-related JavaScript code from index.html
    - Update navigation to remove blog anchor link
    - _Requirements: 5.1_


  - [x] 7.2 Create news listing page structure

    - Create news/index.html with proper page structure
    - Include standard navigation, header, and footer
    - Create container for article listing
    - Add "Новости" link to navigation menu on all pages
    - _Requirements: 5.2, 5.10_


  - [x] 7.3 Create news metadata system

    - Create news/data/articles-metadata.json file
    - Convert existing blog.json data to new metadata format
    - Include id, title, slug, date, excerpt, image, and tags for each article
    - _Requirements: 5.3, 5.4_


  - [x] 7.4 Implement news listing component

    - Create Alpine.js newsListing component
    - Implement article loading from metadata JSON
    - Create article card template with image, title, excerpt, date
    - Implement formatDate() method for Russian date formatting
    - Add click handlers to navigate to individual articles
    - _Requirements: 5.3, 5.4, 5.5_


  - [x] 7.5 Create individual article page template

    - Create news/articles/ directory structure
    - Design article page HTML template with semantic markup
    - Include article header with title, date, and tags
    - Add featured image section
    - Create article content area with proper typography
    - Add back navigation button to news listing
    - _Requirements: 5.6, 5.7, 5.8_



  - [x] 7.6 Generate individual article HTML files

    - Convert each article from blog.json to separate HTML file
    - Use article template and populate with content
    - Name files using slug format (YYYY-MM-DD-title-slug.html)
    - Ensure proper HTML structure and encoding
    - Remove all dollar signs and spaces after them from content
    - _Requirements: 5.6, 5.7, 5.9, 5.11_



  - [ ] 7.7 Add related articles section
    - Implement related articles logic based on tags
    - Display 2-3 related articles at bottom of each article page
    - Include article thumbnails and titles
    - _Requirements: 5.9_

- [x] 8. Remove currency symbols from all documents






  - [x] 8.1 Clean proposal template

    - Open data/proposal-template.md
    - Find and remove all instances of "$ " (dollar sign followed by space)
    - Verify BYN currency labels remain intact
    - _Requirements: 1.9, 6.2_


  - [x] 8.2 Clean pricing page

    - Review prices.html for any dollar signs
    - Ensure all prices display only "BYN" without dollar signs
    - _Requirements: 6.3_


  - [x] 8.3 Clean news articles

    - Review all generated news article HTML files
    - Remove any dollar signs from article content
    - _Requirements: 6.4_


  - [x] 8.4 Verify PDF generation output

    - Generate test PDF and verify no dollar signs appear
    - Check all sections of generated PDF
    - _Requirements: 6.5_

- [ ] 9. Testing and quality assurance
  - [ ] 9.1 Test PDF generation functionality
    - Test with various service combinations
    - Test with different quantities
    - Verify Russian characters display correctly in PDF
    - Test filename generation
    - Verify all template variables are replaced
    - Test with empty/invalid company information
    - _Requirements: 1.1-1.9_

  - [ ] 9.2 Test pricing page UI improvements
    - Verify badges are removed from all service descriptions
    - Verify cart icons appear in service name column
    - Verify sections are in correct order (packages first)
    - Test glassmorphism effects on package cards
    - Test floating cart button functionality and smooth scroll
    - Test in both light and dark themes
    - _Requirements: 2.1-2.7_

  - [ ] 9.3 Test navigation across all pages
    - Navigate to each page and verify correct active link
    - Test navigation from news listing to articles and back
    - Verify active state persists correctly
    - _Requirements: 3.1-3.7_

  - [ ] 9.4 Test video gallery functionality
    - Test video loading from JSON
    - Test thumbnail display
    - Test video modal opening and autoplay
    - Test with various video IDs
    - Test error handling for invalid videos
    - _Requirements: 4.1-4.6_

  - [ ] 9.5 Test news section functionality
    - Verify news section removed from index.html
    - Test news listing page loads correctly
    - Test article metadata loads properly
    - Click through to individual articles
    - Test back navigation from articles
    - Verify related articles display
    - _Requirements: 5.1-5.11_

  - [ ] 9.6 Verify currency symbol removal
    - Search all pages for dollar signs
    - Generate PDF and verify no dollar signs
    - Check all news articles
    - _Requirements: 6.1-6.5_

  - [ ] 9.7 Cross-browser testing
    - Test all functionality in Chrome, Firefox, Safari
    - Test on mobile devices (iOS and Android)
    - Verify responsive design works correctly
    - Test PDF download on different browsers

  - [ ] 9.8 Performance testing
    - Measure PDF generation time (should be < 2 seconds)
    - Check page load times
    - Verify smooth scrolling performance
    - Test with large number of selected services

- [ ] 10. Documentation and deployment
  - [ ] 10.1 Update README or documentation
    - Document PDF generation feature
    - Document news management system
    - Add instructions for adding new articles
    - Document video gallery usage

  - [ ] 10.2 Create deployment checklist
    - Verify all CDN links are HTTPS
    - Check all file paths are correct
    - Verify all images load properly
    - Test all external links

  - [ ] 10.3 Final review and cleanup
    - Remove any console.log statements
    - Clean up commented code
    - Verify code formatting is consistent
    - Run final tests on all features
