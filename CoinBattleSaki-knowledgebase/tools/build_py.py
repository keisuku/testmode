#!/usr/bin/env python3
"""
CoinBattleSaki Knowledge Base - Python Builder
knowledge/*.md → site/index.html (Notion風UI)
"""

import os
import re
import json
import sys

try:
    import markdown
except ImportError:
    print("❌ 'markdown' package not found. Install: pip install markdown")
    sys.exit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KNOWLEDGE_DIR = os.path.join(ROOT, "knowledge")
DOCS_DIR = os.path.join(ROOT, "docs")
WEB_DIR = os.path.join(ROOT, "web")
SITE_DIR = os.path.join(ROOT, "site")
REPO_ROOT = os.path.dirname(ROOT)


def parse_frontmatter(content):
    """Parse YAML frontmatter from markdown content."""
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    if not match:
        return {}, content
    meta = {}
    for line in match.group(1).split("\n"):
        m = re.match(r"^(\w+):\s*(.+)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            if val.startswith("["):
                try:
                    val = json.loads(val)
                except json.JSONDecodeError:
                    pass
            if isinstance(val, str) and val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            meta[key] = val
    return meta, match.group(2)


def collect_md(directory, base_path=""):
    """Recursively collect markdown files."""
    files = []
    if not os.path.isdir(directory):
        return files
    for entry in sorted(os.listdir(directory)):
        full = os.path.join(directory, entry)
        rel = os.path.join(base_path, entry) if base_path else entry
        if os.path.isdir(full):
            files.extend(collect_md(full, rel))
        elif entry.endswith(".md"):
            files.append({"abs": full, "rel": rel})
    return files


def build():
    """Build site/index.html from markdown files."""
    os.makedirs(SITE_DIR, exist_ok=True)

    md_converter = markdown.Markdown(extensions=["tables", "fenced_code", "toc"])

    knowledge_files = collect_md(KNOWLEDGE_DIR, "knowledge")
    docs_files = collect_md(DOCS_DIR, "docs")
    all_files = knowledge_files + docs_files

    pages = []
    for f in all_files:
        with open(f["abs"], "r", encoding="utf-8") as fh:
            raw = fh.read()
        meta, body = parse_frontmatter(raw)
        md_converter.reset()
        html = md_converter.convert(body)
        slug = f["rel"].replace(".md", "").replace("/", "-").replace("\\", "-")
        pages.append({**f, "meta": meta, "html": html, "slug": slug})

    # Read web assets
    style_path = os.path.join(WEB_DIR, "style.css")
    style_css = open(style_path, "r", encoding="utf-8").read() if os.path.exists(style_path) else ""

    search_path = os.path.join(WEB_DIR, "search.js")
    search_js = open(search_path, "r", encoding="utf-8").read() if os.path.exists(search_path) else ""

    # Default page: saki-info
    default_slug = ""
    for p in pages:
        if "saki-info" in p["slug"]:
            default_slug = p["slug"]
            break
    if not default_slug and pages:
        default_slug = pages[0]["slug"]

    # Build sidebar
    sidebar_items = []
    for p in pages:
        tags = p["meta"].get("tags", [])
        tag_html = ""
        if isinstance(tags, list):
            tag_html = "".join(f'<span class="tag">{t}</span>' for t in tags)
        title = p["meta"].get("title", p["rel"])
        active_class = "sidebar-link active" if p["slug"] == default_slug else "sidebar-link"
        sidebar_items.append(
            f'<li><a href="#" data-page="{p["slug"]}" class="{active_class}">{title}</a>'
            f'<span class="tag-list">{tag_html}</span></li>'
        )

    # Build page sections (default page visible, others hidden)
    page_sections = []
    for p in pages:
        display = "display:block;" if p["slug"] == default_slug else "display:none;"
        status = p["meta"].get("status", "draft")
        updated = p["meta"].get("updated", "N/A")
        author = p["meta"].get("author", "unknown")
        page_sections.append(
            f'<section id="page-{p["slug"]}" class="page-content" style="{display}">'
            f'<div class="page-meta">'
            f'<span class="status status-{status}">{status}</span>'
            f'<span class="updated">Updated: {updated}</span>'
            f'<span class="author">Author: {author}</span>'
            f'</div>'
            f'{p["html"]}'
            f'</section>'
        )

    # Search data
    search_data = json.dumps([{
        "slug": p["slug"],
        "title": p["meta"].get("title", p["rel"]),
        "tags": p["meta"].get("tags", []),
        "text": re.sub(r"<[^>]+>", " ", p["html"])[:2000]
    } for p in pages], ensure_ascii=False)

    # Assemble HTML
    index_html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CoinBattleSaki Knowledge Base</title>
  <style>{style_css}</style>
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
          {''.join(sidebar_items)}
        </ul>
      </nav>
    </aside>
    <main class="main-content" id="main-content">
      <div class="welcome" id="welcome" style="display:none;">
        <h1>CoinBattleSaki Knowledge Base</h1>
        <p>左のサイドバーからページを選択してください。</p>
      </div>
      {''.join(page_sections)}
    </main>
  </div>
  <script>
    const SEARCH_DATA = {search_data};
    {search_js}
  </script>
</body>
</html>"""

    with open(os.path.join(SITE_DIR, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(index_html)

    with open(os.path.join(WEB_DIR, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(index_html)

    # Also write to repo root index.html (for GitHub Pages)
    with open(os.path.join(REPO_ROOT, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(index_html)

    print(f"✅ Built {len(pages)} pages → site/index.html + repo root index.html")
    for p in pages:
        print(f"  - {p['rel']} → #page-{p['slug']}")


if __name__ == "__main__":
    build()
