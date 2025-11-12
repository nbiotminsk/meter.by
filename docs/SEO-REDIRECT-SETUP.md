# WWW to Non-WWW Redirect Setup

## Overview
This document describes the www to non-www redirect configuration implemented to prevent duplicate content issues.

## Canonical URL
The canonical (preferred) version of the website is: **https://meter.by** (without www)

## Implementation

### 1. Server-Level Redirects (.htaccess)
The `.htaccess` file has been configured with the following rules:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Redirect www to non-www (canonical URL)
RewriteCond %{HTTP_HOST} ^www\.meter\.by$ [NC]
RewriteRule ^(.*)$ https://meter.by/$1 [L,R=301]

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**What this does:**
- Redirects `www.meter.by` → `meter.by` (301 permanent redirect)
- Redirects `http://` → `https://` (forces HTTPS)
- All redirects are 301 (permanent), which passes SEO value

### 2. HTML Canonical Tags
All HTML pages include canonical link tags pointing to the non-www version:

**Main Pages:**
- `index.html` → `<link rel="canonical" href="https://meter.by/">`
- `prices.html` → `<link rel="canonical" href="https://meter.by/prices.html">`
- `documents.html` → `<link rel="canonical" href="https://meter.by/documents.html">`
- `videos.html` → `<link rel="canonical" href="https://meter.by/videos.html">`
- `news/index.html` → `<link rel="canonical" href="https://meter.by/news/index.html">`

**News Articles:**
All news articles include canonical URLs, for example:
- `<link rel="canonical" href="https://meter.by/news/articles/2025-11-12-water-meter-remote-reading-price.html">`

### 3. Robots.txt Configuration
The `robots.txt` file specifies the canonical domain:

```
Host: meter.by
Sitemap: https://meter.by/sitemap.xml
```

### 4. Sitemap.xml
The sitemap uses non-www URLs for all pages:
- All URLs start with `https://meter.by/`
- No www variants are included

## Testing the Redirects

### Test Cases
1. **www to non-www:**
   - Visit: `http://www.meter.by` → Should redirect to `https://meter.by`
   - Visit: `https://www.meter.by` → Should redirect to `https://meter.by`

2. **HTTP to HTTPS:**
   - Visit: `http://meter.by` → Should redirect to `https://meter.by`

3. **Combined:**
   - Visit: `http://www.meter.by/prices.html` → Should redirect to `https://meter.by/prices.html`

### How to Test
1. Open browser in incognito/private mode
2. Enter the URL with www or http
3. Check the final URL in the address bar
4. Use browser developer tools (Network tab) to verify 301 redirects

### Online Testing Tools
- **Redirect Checker:** https://www.redirect-checker.org/
- **HTTP Status Code Checker:** https://httpstatus.io/
- **Google Search Console:** Check URL inspection tool

## SEO Benefits

### Prevents Duplicate Content
- Search engines see only one version of each page
- Avoids splitting SEO value between www and non-www versions
- Prevents duplicate content penalties

### Consolidates Link Equity
- All backlinks (whether to www or non-www) pass value to the canonical version
- 301 redirects pass 90-99% of link equity

### Improves Crawl Efficiency
- Search engine bots don't waste crawl budget on duplicate URLs
- Faster indexing of new content

## Maintenance

### When Adding New Pages
Ensure each new HTML page includes:
1. Canonical link tag with non-www URL
2. Entry in sitemap.xml with non-www URL
3. Open Graph tags with non-www URL

### Monitoring
Regularly check:
- Google Search Console for duplicate content issues
- Server logs for redirect chains
- Sitemap submission status

## Troubleshooting

### If Redirects Don't Work
1. **Check .htaccess is enabled:**
   - Verify Apache has `AllowOverride All` in server config
   - Check if mod_rewrite is enabled

2. **Clear browser cache:**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache completely

3. **Check server configuration:**
   - Ensure .htaccess file is in the root directory
   - Verify file permissions (644 or 755)

4. **Test with curl:**
   ```bash
   curl -I http://www.meter.by
   curl -I https://www.meter.by
   ```

### Common Issues
- **Redirect loops:** Check for conflicting redirect rules
- **Mixed content warnings:** Ensure all resources use HTTPS
- **Slow redirects:** Minimize redirect chains (max 1-2 redirects)

## Additional Recommendations

### 1. Update External Links
When possible, update external links to use the canonical URL:
- Social media profiles
- Business directories
- Partner websites
- Email signatures

### 2. Google Search Console
- Add both www and non-www versions as properties
- Set the preferred domain (non-www) in settings
- Submit sitemap to both properties

### 3. Analytics Configuration
Ensure Google Analytics and other tracking tools:
- Track the canonical domain
- Handle cross-domain tracking if needed
- Filter out internal traffic

### 4. SSL Certificate
Verify SSL certificate covers both:
- meter.by
- www.meter.by

## Status: ✅ Implemented

All redirect rules and canonical URLs are properly configured. The website now has a single canonical version (https://meter.by) which prevents duplicate content issues and consolidates SEO value.

---

**Last Updated:** November 12, 2025
**Implemented By:** Kiro AI Assistant
