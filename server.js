#!/usr/bin/env node
/**
 * Simple HTTP server for local development
 * Serves the current directory on http://localhost:8000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const PORT = 8000;

// MIME types for common file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer(async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle API endpoints
    if (req.url === '/api/create-article' && req.method === 'POST') {
        await handleCreateArticle(req, res);
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 - File Not Found</h1>
                    <p>The requested file <code>${req.url}</code> was not found.</p>
                    <p><a href="/">Go to homepage</a></p>
                `, 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

/**
 * Handle article creation API request
 */
async function handleCreateArticle(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const { title, excerpt, slug, date, image, tags, content } = data;
            
            // Validate required fields
            if (!title || !excerpt || !slug) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required fields: title, excerpt, slug' }));
                return;
            }
            
            // Create temporary content file
            const tempContentPath = path.join(__dirname, 'temp-article-content.html');
            fs.writeFileSync(tempContentPath, content, 'utf8');
            
            // Build command to call create-news-article.js
            const scriptPath = path.join(__dirname, 'scripts', 'create-news-article.js');
            const dateValue = date || new Date().toISOString().split('T')[0];
            const imageValue = image || 'images/placeholders/min/remote-water-reading.webp';
            
            // Escape arguments for Windows
            const escapeArg = (arg) => {
                if (process.platform === 'win32') {
                    return `"${arg.replace(/"/g, '\\"')}"`;
                }
                return `"${arg.replace(/"/g, '\\"')}"`;
            };
            
            const cmd = [
                'node',
                escapeArg(scriptPath),
                '--title', escapeArg(title),
                '--excerpt', escapeArg(excerpt),
                '--slug', escapeArg(slug),
                '--date', escapeArg(dateValue),
                '--image', escapeArg(imageValue),
                '--tags', escapeArg(tags || ''),
                '--content', escapeArg(tempContentPath)
            ].join(' ');
            
            // Execute script
            const { stdout, stderr } = await execAsync(cmd);
            
            // Clean up temp file
            try {
                fs.unlinkSync(tempContentPath);
            } catch (e) {
                // Ignore cleanup errors
            }
            
            // Extract file path from output
            const fileMatch = stdout.match(/File:\s+([^\n]+)/);
            const filePath = fileMatch ? fileMatch[1] : null;
            
            if (stderr && !filePath) {
                throw new Error(stderr || 'Failed to create article');
            }
            
            // Update the created article file with actual content
            if (filePath) {
                // Normalize path separators
                const normalizedPath = filePath.replace(/\\/g, '/');
                const articlePath = path.join(__dirname, normalizedPath);
                
                if (fs.existsSync(articlePath)) {
                    let articleHtml = fs.readFileSync(articlePath, 'utf8');
                    // Replace placeholder content with actual content
                    // Escape content for HTML insertion
                    const escapedContent = content
                        .replace(/\$/g, '$$$$') // Escape $ for replacement
                        .replace(/\n/g, '\n                            '); // Preserve indentation
                    
                    articleHtml = articleHtml.replace(
                        /(<div class="article-content"[^>]*>)([\s\S]*?)(<\/div>)/,
                        `$1\n                            ${escapedContent}\n                        $3`
                    );
                    fs.writeFileSync(articlePath, articleHtml, 'utf8');
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                file: filePath,
                message: 'Article created successfully'
            }));
            
        } catch (error) {
            console.error('Article creation error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: error.message || 'Failed to create article'
            }));
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Open http://localhost:${PORT}/index.html in your browser`);
    console.log('Press Ctrl+C to stop the server');
    
    // Try to open browser automatically
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${start} http://localhost:${PORT}/index.html`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Try a different port or stop the existing server.`);
    } else {
        console.log('Server error:', err);
    }
});