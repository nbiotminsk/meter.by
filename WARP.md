# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository purpose
- Static marketing/informational site for Meter.by (Belarus remote metering services) with a local dev server. No build system, no package manager, no tests.

Common commands
- Start dev server (Python)
  - pwsh/cmd: python server.py
  - Alternate on Windows if python isn’t in PATH: py server.py
- Start dev server (Node.js)
  - pwsh/cmd: node server.js
- Windows helper script
  - Double-click start-server.bat or run: .\start-server.bat
- Open site
  - http://localhost:8000 (index.html and other pages are served statically)

What’s not present
- No package.json, requirements.txt, or build tooling
- No lint/typecheck config
- No tests/test runner

High-level architecture
- Static HTML + CSS + vanilla JS, enhanced via CDNs (Bootstrap 5.3, Bootstrap Icons, Alpine.js, SweetAlert2, VanillaTilt, html2pdf/jsPDF)
- Pages
  - index.html (landing + services, proposal form, Alpine components)
  - prices.html, documents.html, videos.html
  - news/index.html with individual articles under news/articles/
- Local dev servers
  - server.py and server.js serve the repo root with CORS; start-server.bat prefers Python
- Data-driven content (JSON/HTML templates under data/ and news/data/)
  - data/documents.json rendered by an Alpine component on documents.html
  - news/data/articles-metadata.json drives the news listing (cards link to news/articles/*.html)
  - data/proposal-template.html is loaded and populated for proposal preview/print in the proposal generator
- JavaScript modules (js/)
  - main.js: initializes image optimization, theme, navigation tracking; exposes helpers via window.BelarusRemoteMetering (data loading, smooth scroll, date formatting, tilt effects). Also contains pricing/video helpers used on prices.html/videos.html
  - image-optimization.js: ImageOptimizer class (WebP detection, lazy loading, alt text generation, responsive helpers)
  - placeholder-generator.js: SVG placeholders and global window.placeholderGenerator
  - navigation-manager.js: NavigationManager class to highlight the current page links
  - cart-manager.js: simple localStorage-backed cart used by pricing UI
  - pdf-proposal-generator.js: PDFProposalGenerator for building printable/JS PDF proposals (used alongside the inline Alpine proposal flow)
- Styling (css/)
  - style.css as base; dark-theme.css for glassmorphism; responsive.css, mobile-fixes.css, image-optimization.css, plus specialized effects css files
- SEO and discovery
  - robots.txt, sitemap.xml, JSON-LD structured data in page heads; yandex_* verification file

Content management workflow (from README.md)
- Add services/prices: update JSON under data/ (e.g., prices/services where applicable)
- Add news: create a new article file in news/articles/ from _template.html and register it in news/data/articles-metadata.json
- Update documents: edit data/documents.json and place PDFs under documents/

Conventions and constraints
- The design/specs (.kiro/specs/…) emphasize a static stack (no bundlers). Keep changes compatible with vanilla JS and CDN-delivered libraries.
- Alpine.js components are defined inline in pages (not a module bundler setup). Prefer small, page-scoped components and use window.BelarusRemoteMetering helpers.
