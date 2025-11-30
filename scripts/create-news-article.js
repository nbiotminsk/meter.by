#!/usr/bin/env node

/**
 * Utility to scaffold a new news article, update metadata and refresh sitemap.xml.
 * Usage:
 *   node scripts/create-news-article.js --title "..." --excerpt "..." --slug "my-article" --tags "tag1,tag2"
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const NEWS_DIR = path.join(ROOT_DIR, 'news');
const ARTICLES_DIR = path.join(NEWS_DIR, 'articles');
const TEMPLATE_PATH = path.join(ARTICLES_DIR, '_template.html');
const METADATA_PATH = path.join(NEWS_DIR, 'data', 'articles-metadata.json');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

const options = parseArgs(process.argv.slice(2));

if (options.help || options.h) {
  printUsage();
  process.exit(0);
}

try {
  main(options);
} catch (error) {
  console.error(`\n[create-news-article] ${error.message}`);
  process.exit(1);
}

function main(opts) {
  ensureRequiredFiles();

  const title = requireOption(opts, 'title');
  const excerpt = requireOption(opts, 'excerpt');
  const slugBase = normalizeSlugBase(requireOption(opts, 'slug'));
  const tags = parseTags(opts.tags);
  const date = normalizeDate(opts.date);
  const slug = `${date}-${slugBase}`;
  const image = opts.image || 'images/placeholders/min/remote-water-reading.webp';
  const content = resolveContent(opts.content);
  const articleId = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const tagMeta = tags.join(', ');
  const tagArrayLiteral = tags.length ? JSON.stringify(tags) : '[]';
  const tagHtml = buildTagsHtml(tags);
  const formattedDate = formatDateHuman(date);

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const articleHtml = applyTemplate(template, {
    ARTICLE_TITLE: title,
    ARTICLE_EXCERPT: excerpt,
    ARTICLE_TAGS: tagMeta,
    ARTICLE_TAGS_HTML: tagHtml,
    ARTICLE_TAGS_ARRAY: tagArrayLiteral,
    ARTICLE_SLUG: slug,
    ARTICLE_IMAGE: image,
    ARTICLE_DATE: date,
    ARTICLE_DATE_FORMATTED: formattedDate,
    ARTICLE_CONTENT: content
  });

  const articlePath = path.join(ARTICLES_DIR, `${slug}.html`);
  if (fs.existsSync(articlePath)) {
    throw new Error(`Article file already exists: ${articlePath}`);
  }
  fs.writeFileSync(articlePath, `${articleHtml}\n`, 'utf8');

  const metadata = loadMetadata();
  const nextArticles = metadata.articles.filter((article) => article.slug !== slug);
  nextArticles.push({
    id: articleId,
    title,
    slug,
    date,
    excerpt,
    image,
    tags
  });
  nextArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  saveMetadata(nextArticles);

  updateSitemap(nextArticles);

  console.log('-----------------------------------------------');
  console.log('New article scaffolded successfully!');
  console.log(`File:       ${path.relative(ROOT_DIR, articlePath)}`);
  console.log(`Metadata:   ${path.relative(ROOT_DIR, METADATA_PATH)}`);
  console.log(`Sitemap:    ${path.relative(ROOT_DIR, SITEMAP_PATH)}`);
  console.log('Next steps: fill the article content and run your deployment pipeline.');
  console.log('-----------------------------------------------');
}

function ensureRequiredFiles() {
  const missing = [TEMPLATE_PATH, METADATA_PATH, SITEMAP_PATH].filter(
    (target) => !fs.existsSync(target)
  );
  if (missing.length > 0) {
    throw new Error(`Cannot find required files:\n- ${missing.join('\n- ')}`);
  }
}

function parseArgs(rawArgs) {
  return rawArgs.reduce((acc, arg, index) => {
    if (!arg.startsWith('--')) {
      return acc;
    }
    const eqIndex = arg.indexOf('=');
    if (eqIndex > -1) {
      const key = arg.slice(2, eqIndex);
      const value = arg.slice(eqIndex + 1);
      acc[key] = value;
      return acc;
    }
    const key = arg.slice(2);
    const nextValue = rawArgs[index + 1];
    if (nextValue && !nextValue.startsWith('--')) {
      acc[key] = nextValue;
    } else {
      acc[key] = true;
    }
    return acc;
  }, {});
}

function printUsage() {
  console.log(`
Usage:
  node scripts/create-news-article.js --title "..." --excerpt "..." --slug "my-article" [options]

Required options:
  --title       Article title (used in HTML head and page body)
  --excerpt     Short summary for metadata and intro block
  --slug        Kebab-case slug without the date prefix (example: remote-metering-case)

Optional options:
  --date        Publication date in YYYY-MM-DD (defaults to today)
  --tags        Comma-separated tags (example: "IoT, дистанционный съем")
  --image       Relative path to hero image (defaults to images/placeholders/min/remote-water-reading.webp)
  --content     Path to an HTML snippet that will replace the placeholder content
  --help        Show this message
`);
}

function requireOption(opts, key) {
  const value = opts[key];
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`Missing required option "--${key}"`);
  }
  return value.trim();
}

function normalizeSlugBase(input) {
  const sanitized = input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!sanitized) {
    throw new Error('Slug is empty after normalization. Use ASCII characters.');
  }
  return sanitized;
}

function parseTags(raw) {
  if (!raw) {
    return [];
  }
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeDate(input) {
  if (!input) {
    return formatDateValue(new Date());
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    throw new Error('Date must follow YYYY-MM-DD format.');
  }
  return input;
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function resolveContent(contentPath) {
  if (!contentPath) {
    return [
      '<h2>Заголовок секции</h2>',
      '<p>Добавьте основной текст статьи в этом блоке. Вы можете заменить HTML целиком после генерации файла.</p>',
      '<ul>',
      '    <li>Преимущество или факт №1</li>',
      '    <li>Преимущество или факт №2</li>',
      '    <li>Преимущество или факт №3</li>',
      '</ul>',
      '<p>Завершите статью призывом к действию или ссылкой на услуги.</p>'
    ].join('\n                            ');
  }
  const resolved = path.resolve(process.cwd(), contentPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Content file not found: ${resolved}`);
  }
  return fs.readFileSync(resolved, 'utf8').trim();
}

function buildTagsHtml(tags) {
  if (!tags.length) {
    return '';
  }
  const indent = '                                ';
  return tags
    .map((tag) => `${indent}<span class="badge bg-light text-dark me-2">${tag}</span>`)
    .join('\n');
}

function formatDateHuman(dateString) {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ];
  const [year, month, day] = dateString.split('-').map((item) => parseInt(item, 10));
  const monthName = months[month - 1] || '';
  return `${day} ${monthName} ${year}`;
}

function applyTemplate(template, replacements) {
  return Object.entries(replacements).reduce((acc, [key, value]) => {
    const pattern = new RegExp(`{{${key}}}`, 'g');
    return acc.replace(pattern, value);
  }, template);
}

function loadMetadata() {
  const raw = fs.readFileSync(METADATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveMetadata(articles) {
  const payload = {
    articles
  };
  fs.writeFileSync(METADATA_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function updateSitemap(articles) {
  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const pattern = /(<!-- Статьи новостей -->)([\s\S]*?)(<\/urlset>)/;
  const match = sitemap.match(pattern);
  if (!match) {
    throw new Error('Cannot locate news section in sitemap.xml');
  }
  const articleBlocks = articles
    .map((article, index) => buildUrlEntry(article, index))
    .join('\n');
  const updated = sitemap.replace(
    pattern,
    `${match[1]}\n${articleBlocks}\n${match[3]}`
  );
  fs.writeFileSync(SITEMAP_PATH, updated, 'utf8');
}

function buildUrlEntry(article, index) {
  const priority = priorityForIndex(index);
  return [
    '    <url>',
    `        <loc>https://meter.by/news/articles/${article.slug}.html</loc>`,
    `        <lastmod>${article.date}</lastmod>`,
    '        <changefreq>monthly</changefreq>',
    `        <priority>${priority}</priority>`,
    '    </url>'
  ].join('\n');
}

function priorityForIndex(index) {
  if (index < 3) {
    return '1.0';
  }
  if (index < 7) {
    return '0.9';
  }
  if (index < 11) {
    return '0.8';
  }
  if (index < 15) {
    return '0.7';
  }
  return '0.6';
}

