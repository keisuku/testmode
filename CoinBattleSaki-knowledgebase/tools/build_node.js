#!/usr/bin/env node
/**
 * CoinBattleSaki Knowledge Base - Node.js Builder
 * knowledge/*.md → site/index.html (Notion風UI)
 */

const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

const ROOT = path.resolve(__dirname, '..');
const KNOWLEDGE_DIR = path.join(ROOT, 'knowledge');
const DOCS_DIR = path.join(ROOT, 'docs');
const WEB_DIR = path.join(ROOT, 'web');
const SITE_DIR = path.join(ROOT, 'site');

const md = markdownIt({ html: true, linkify: true, typographer: true });

// --- Frontmatter parser ---
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let val = m[2].trim();
      if (val.startsWith('[')) {
        try { val = JSON.parse(val); } catch (_) { /* keep string */ }
      }
      if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      meta[m[1]] = val;
    }
  });
  return { meta, body: match[2] };
}

// --- Collect markdown files recursively ---
function collectMd(dir, basePath = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(basePath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMd(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.md')) {
      files.push({ abs: path.join(dir, entry.name), rel });
    }
  }
  return files;
}

// --- Build ---
function build() {
  // Ensure site dir
  if (!fs.existsSync(SITE_DIR)) fs.mkdirSync(SITE_DIR, { recursive: true });

  // Collect all md files
  const knowledgeFiles = collectMd(KNOWLEDGE_DIR, 'knowledge');
  const docsFiles = collectMd(DOCS_DIR, 'docs');
  const allFiles = [...knowledgeFiles, ...docsFiles];

  // Parse
  const pages = allFiles.map(f => {
    const raw = fs.readFileSync(f.abs, 'utf-8');
    const { meta, body } = parseFrontmatter(raw);
    const html = md.render(body);
    const slug = f.rel.replace(/\.md$/, '').replace(/\//g, '-');
    return { ...f, meta, html, slug };
  });

  // Read web template files
  const styleCSS = fs.existsSync(path.join(WEB_DIR, 'style.css'))
    ? fs.readFileSync(path.join(WEB_DIR, 'style.css'), 'utf-8')
    : '';
  const searchJS = fs.existsSync(path.join(WEB_DIR, 'search.js'))
    ? fs.readFileSync(path.join(WEB_DIR, 'search.js'), 'utf-8')
    : '';

  // Build sidebar items
  const sidebarItems = pages.map(p =>
    `<li><a href="#" data-page="${p.slug}" class="sidebar-link">${p.meta.title || p.rel}</a>
     <span class="tag-list">${Array.isArray(p.meta.tags) ? p.meta.tags.map(t => `<span class="tag">${t}</span>`).join('') : ''}</span></li>`
  ).join('\n');

  // Build page sections
  const pageSections = pages.map(p =>
    `<section id="page-${p.slug}" class="page-content" style="display:none;">
      <div class="page-meta">
        <span class="status status-${p.meta.status || 'draft'}">${p.meta.status || 'draft'}</span>
        <span class="updated">Updated: ${p.meta.updated || 'N/A'}</span>
        <span class="author">Author: ${p.meta.author || 'unknown'}</span>
      </div>
      ${p.html}
    </section>`
  ).join('\n');

  // Search data (JSON)
  const searchData = JSON.stringify(pages.map(p => ({
    slug: p.slug,
    title: p.meta.title || p.rel,
    tags: p.meta.tags || [],
    text: p.html.replace(/<[^>]+>/g, ' ').substring(0, 2000)
  })));

  // Assemble HTML
  const indexHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CoinBattleSaki Knowledge Base</title>
  <style>${styleCSS}</style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <h1 class="logo">CoinBattleSaki</h1>
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Search..." />
      </div>
      <nav>
        <ul id="sidebar-list">
          ${sidebarItems}
        </ul>
      </nav>
    </aside>
    <main class="main-content" id="main-content">
      <div class="welcome" id="welcome">
        <h1>CoinBattleSaki Knowledge Base</h1>
        <p>左のサイドバーからページを選択してください。</p>
      </div>
      ${pageSections}
    </main>
  </div>
  <script>
    const SEARCH_DATA = ${searchData};
    ${searchJS}
  </script>
</body>
</html>`;

  // Write output
  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), indexHTML, 'utf-8');

  // Also copy to web/index.html
  fs.writeFileSync(path.join(WEB_DIR, 'index.html'), indexHTML, 'utf-8');

  console.log(`✅ Built ${pages.length} pages → site/index.html`);
  console.log('Pages:');
  pages.forEach(p => console.log(`  - ${p.rel} → #page-${p.slug}`));
}

build();
