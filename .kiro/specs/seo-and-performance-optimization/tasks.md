# Implementation Plan

- [ ] 1. Set up build infrastructure and minification tools
  - Create package.json with build scripts for CSS and JS minification
  - Install clean-css-cli and terser as dev dependencies
  - Create npm scripts for minify:css, minify:js, minify:all, and build commands
  - _Requirements: 3.2, 3.3, 4.2, 4.3_

- [ ] 2. Implement CSS minification
  - Run minification on all 7 CSS files (style.css, responsive.css, dark-theme.css, glassmorphism-form.css, glassmorphism-packages.css, glassmorphism-services.css, image-optimization.css)
  - Verify each .min.css file is created and at least 30% smaller than original
  - Update all HTML files to reference .min.css files instead of original CSS files
  - Test all pages to ensure styles render correctly with minified CSS
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 3. Implement JavaScript minification
  - Run minification on all 6 JS files (main.js, cart-manager.js, navigation-manager.js, pdf-proposal-generator.js, placeholder-generator.js, image-optimization.js)
  - Verify each .min.js file is created and at least 40% smaller than original
  - Update all HTML files to reference .min.js files instead of original JS files
  - Test all JavaScript functionality (cart, navigation, PDF generation, placeholders, image optimization)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [ ] 4. Enhance meta tags for videos.html
  - Add unique title tag (50-60 characters) for videos page
  - Add meta description (150-160 characters) describing video content
  - Add Open Graph tags (og:title, og:description, og:image, og:url, og:type)
  - Add Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
  - Add canonical URL and robots meta tag
  - Verify lang="ru" is set in HTML element
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 5. Enhance meta tags for documents.html
  - Add unique title tag (50-60 characters) for documents page
  - Add meta description (150-160 characters) describing available documents
  - Add Open Graph tags (og:title, og:description, og:image, og:url, og:type)
  - Add Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
  - Add canonical URL and robots meta tag
  - Verify lang="ru" is set in HTML element
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 6. Enhance meta tags for news pages
  - Update news/index.html with proper meta tags (title, description, OG tags, Twitter cards, canonical)
  - Update all news article pages in news/articles/ with unique meta tags for each article
  - Ensure each article has unique title and description based on article content
  - Add proper canonical URLs for each article
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 7. Implement Organization and LocalBusiness structured data
  - Add Organization schema JSON-LD to index.html with company name, logo, description, address, and contact info
  - Add LocalBusiness schema JSON-LD to index.html with business details, address, price range, and area served
  - Validate structured data using Google's Rich Results Test
  - _Requirements: 2.1, 2.2, 2.7, 2.8_

- [ ] 8. Implement Service structured data for pricing page
  - Add Service schema JSON-LD to prices.html for each major service category
  - Include service type, provider, area served, and offer details
  - Validate structured data using Google's Rich Results Test
  - _Requirements: 2.3, 2.7, 2.8_

- [ ] 9. Implement VideoObject structured data
  - Read video data from data/videos.json
  - Generate VideoObject schema JSON-LD for each video on videos.html
  - Include name, description, thumbnailUrl, uploadDate, contentUrl, and embedUrl
  - Validate structured data using Google's Rich Results Test
  - _Requirements: 2.5, 2.7, 2.8_

- [ ] 10. Implement Article structured data for news
  - Add Article schema JSON-LD to each news article page
  - Include headline, datePublished, dateModified, author, publisher with logo, image, and description
  - Extract article metadata (title, date, image) from each article HTML
  - Validate structured data using Google's Rich Results Test
  - _Requirements: 2.4, 2.7, 2.8_

- [ ] 11. Optimize images with alt tags and attributes
  - Audit all img tags across all HTML files (index.html, prices.html, videos.html, documents.html, news pages)
  - Add descriptive Russian alt text to all content images
  - Add alt="" to decorative images
  - Add width and height attributes to all images to prevent layout shift
  - Add loading="lazy" to below-the-fold images
  - Keep loading="eager" or no attribute for above-the-fold images
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 12. Update server.js with compression and caching
  - Install compression npm package
  - Add compression middleware to server.js with appropriate configuration
  - Implement Cache-Control headers with different max-age for HTML (1 hour), CSS/JS (1 day), images (7 days), fonts (30 days)
  - Add ETag headers for cache validation
  - Ensure proper MIME types are set in Content-Type headers
  - Test server with compression and verify headers are set correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 13. Update server.py with compression and caching
  - Modify OptimizedHTTPRequestHandler class to add Cache-Control headers based on file type
  - Implement gzip compression for text-based files (HTML, CSS, JS, JSON, XML)
  - Add proper MIME types and cache validation headers
  - Test Python server with compression and verify headers are set correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8_

- [ ] 14. Verify and update sitemap.xml
  - Review current sitemap.xml to ensure all pages are included
  - Verify lastmod dates are accurate for all entries
  - Ensure changefreq and priority values are appropriate
  - Validate sitemap.xml against sitemap protocol
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 15. Verify and update robots.txt
  - Review current robots.txt configuration
  - Verify sitemap location is correctly referenced
  - Ensure crawling rules are appropriate (allow public pages, disallow private directories)
  - _Requirements: 7.4, 7.5, 7.6_

- [ ] 16. Implement Core Web Vitals optimizations
  - Add preload hints for critical CSS and JS files in HTML head
  - Add defer attribute to non-critical JavaScript files
  - Ensure all images have width/height to prevent CLS
  - Verify no layout shifts occur during page load
  - Test that minified assets and compression improve LCP
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 17. Create build documentation
  - Add build instructions to README.md or create BUILD.md
  - Document npm scripts usage (npm run build, npm run minify:css, npm run minify:js)
  - Document when to run minification (after CSS/JS changes)
  - Document server setup for compression and caching
  - _Requirements: All requirements (documentation)_

- [ ]* 18. Perform comprehensive testing and validation
  - Run Lighthouse audits on all pages and verify SEO score 90+, Performance score 85+
  - Validate all structured data using Google's Rich Results Test
  - Test Core Web Vitals metrics (LCP < 2.5s, FID < 100ms, CLS < 0.1)
  - Verify file size reductions (CSS 30%+, JS 40%+)
  - Test all functionality works with minified assets (cart, PDF generation, navigation, videos, dark theme)
  - Cross-browser testing (Chrome, Firefox, Safari, Edge, mobile browsers)
  - Validate HTML using W3C validator
  - Test responsive design on mobile devices
  - Verify all images display with proper alt text
  - Check server response headers for compression and caching
  - _Requirements: All requirements (validation)_
