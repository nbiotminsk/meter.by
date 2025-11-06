# Requirements Document

## Introduction

This specification outlines comprehensive enhancements to the Meter.by website, focusing on improving the pricing page, implementing PDF proposal generation, restructuring the news section, fixing navigation issues, and enhancing the video gallery functionality. These improvements aim to provide better user experience, streamline the commercial proposal process, and improve content organization.

## Requirements

### Requirement 1: PDF Commercial Proposal Generation

**User Story:** As a potential customer, I want to generate a personalized PDF commercial proposal based on my selected services, so that I can review and share a professional document with stakeholders.

#### Acceptance Criteria

1. WHEN a user selects services in the pricing calculator THEN the system SHALL store the selected services with their quantities and prices
2. WHEN a user clicks "Получить коммерческое предложение" THEN the system SHALL display a form requesting company information (company name, UNP, address, valid until date)
3. WHEN the user submits the company information form THEN the system SHALL generate a PDF document using the template from `data/proposal-template.md`
4. WHEN generating the PDF THEN the system SHALL use proper Russian language encoding (UTF-8) to ensure Cyrillic characters display correctly
5. WHEN generating the PDF THEN the system SHALL replace template variables ({{DATE}}, {{COMPANY_NAME}}, {{UNP}}, {{ADDRESS}}, {{VALID_UNTIL}}) with user-provided values
6. WHEN generating the PDF THEN the system SHALL include all selected services with their quantities and prices in the appropriate table sections
7. WHEN generating the PDF THEN the system SHALL calculate and display the total price correctly
8. WHEN the PDF is generated THEN the system SHALL automatically download the file with a meaningful filename (e.g., "Предложение_CompanyName_Date.pdf")
9. WHEN generating the PDF THEN the system SHALL remove all dollar signs ($) and spaces after them from the template

### Requirement 2: Pricing Page UI Improvements

**User Story:** As a user browsing services, I want a cleaner and more intuitive pricing page interface, so that I can easily understand and select services.

#### Acceptance Criteria

1. WHEN viewing the pricing tables THEN the system SHALL NOT display badge tags like `<small class="badge bg-secondary me-1">Сертификат поверки</small>` in the service descriptions
2. WHEN viewing a service row THEN the system SHALL display a shopping cart icon in the "Услуга" column for each service
3. WHEN viewing the pricing page THEN the packages section (#packages) SHALL be displayed first, before the pricing tables section (#pricing-tables)
4. WHEN viewing package cards THEN they SHALL be styled using the glassmorphism effect from `css/glassmorphism-services.css`
5. WHEN viewing the pricing tables THEN the card header height for the remote reading section SHALL be reduced for better visual balance
6. WHEN scrolling the pricing page THEN a floating shopping cart icon SHALL be visible that allows quick navigation to the calculator section
7. WHEN clicking the floating cart icon THEN the page SHALL smoothly scroll to the pricing calculator section

### Requirement 3: Navigation Menu Fixes

**User Story:** As a user navigating between pages, I want the active menu item to be correctly highlighted, so that I always know which page I'm currently viewing.

#### Acceptance Criteria

1. WHEN viewing index.html THEN the "Главная" navigation link SHALL have the "active" class
2. WHEN viewing prices.html THEN the "Цены" navigation link SHALL have the "active" class
3. WHEN viewing videos.html THEN the "Видео" navigation link SHALL have the "active" class
4. WHEN viewing documents.html THEN the "Документы" navigation link SHALL have the "active" class
5. WHEN viewing the news page THEN the "Новости" navigation link SHALL have the "active" class
6. WHEN viewing any individual news article page THEN the "Новости" navigation link SHALL have the "active" class
7. WHEN navigating between pages THEN only one navigation link SHALL have the "active" class at a time

### Requirement 4: Video Gallery Enhancement

**User Story:** As a user viewing the video gallery, I want videos to be embedded directly from YouTube links, so that I can watch them without relying on API calls.

#### Acceptance Criteria

1. WHEN loading videos.html THEN the system SHALL read video data from `data/videos.json`
2. WHEN displaying a video card THEN the system SHALL use the YouTube video ID to construct the thumbnail URL (https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg)
3. WHEN a user clicks on a video card THEN the system SHALL open a modal with an embedded YouTube iframe using the video ID
4. WHEN the video modal opens THEN the YouTube video SHALL autoplay
5. WHEN displaying videos THEN the system SHALL NOT make API calls to YouTube's API
6. WHEN videos fail to load THEN the system SHALL display a user-friendly error message

### Requirement 5: News Section Restructuring

**User Story:** As a content manager, I want the news section to be a separate page with individual article pages, so that content is better organized and easier to manage.

#### Acceptance Criteria

1. WHEN viewing index.html THEN the news/blog section SHALL NOT be displayed on the homepage
2. WHEN the system starts THEN a new "news.html" page SHALL exist as the main news listing page
3. WHEN viewing news.html THEN the system SHALL display a list of all news articles from individual HTML files
4. WHEN viewing news.html THEN each news article SHALL be stored as a separate HTML file in a "news" or "articles" directory
5. WHEN viewing news.html THEN each article preview SHALL display the title, excerpt, date, and featured image
6. WHEN a user clicks on a news article preview THEN the system SHALL navigate to the individual article page
7. WHEN viewing an individual article page THEN it SHALL display the full article content with proper formatting
8. WHEN viewing an individual article page THEN it SHALL include navigation back to the news listing page
9. WHEN viewing an individual article page THEN it SHALL display related articles or tags at the bottom
10. WHEN the navigation menu is displayed THEN it SHALL include a "Новости" link that points to news.html
11. WHEN generating article pages THEN all dollar signs ($) and spaces after them SHALL be removed from content

### Requirement 6: Currency Symbol Cleanup

**User Story:** As a content editor, I want all dollar signs and spaces after them removed from documents, so that pricing is displayed consistently without currency symbols.

#### Acceptance Criteria

1. WHEN viewing any page THEN no dollar sign ($) followed by a space SHALL be visible in the content
2. WHEN viewing the proposal template THEN all instances of "$ " SHALL be removed
3. WHEN viewing pricing tables THEN prices SHALL be displayed with "BYN" only, without dollar signs
4. WHEN viewing news articles THEN no dollar signs SHALL appear in the content
5. WHEN generating PDFs THEN no dollar signs SHALL appear in the generated documents

## Success Criteria

- Users can generate professional PDF proposals with correct Russian encoding
- The pricing page has a cleaner, more intuitive interface with glassmorphism package cards
- Navigation correctly highlights the active page across all pages
- Videos load and play directly from YouTube without API dependencies
- News content is properly organized with a dedicated listing page and individual article pages
- All currency symbols are consistently removed across the website
- The floating cart icon provides quick access to the calculator
- All functionality works correctly in both light and dark themes
