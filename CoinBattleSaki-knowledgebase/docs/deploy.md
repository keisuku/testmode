---
title: "デプロイ手順"
tags: ["deploy", "hosting", "ci"]
status: "draft"
updated: "2026-03-11"
author: "claude"
related: ["design.md", "roadmap.md"]
---

# デプロイ手順 — 静的サイトの公開方法

## 最短結論

`./build.sh` で `site/` を生成し、GitHub Pages / Netlify / Cloudflare Pages にデプロイする。

---

## ビルド

```bash
# Node.js でビルド
./build.sh

# または Python でビルド
./build.sh --python
```

成果物: `site/index.html`

---

## 環境変数設定

**注意: APIキー等のセンシティブ情報はリポジトリに含めないこと。**

必要に応じて以下の環境変数を設定:

```bash
# .env（.gitignore に含めること）
SITE_TITLE="CoinBattleSaki Knowledge Base"
SITE_URL="https://your-domain.com"
```

---

## デプロイ先オプション

### GitHub Pages

1. リポジトリの Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / フォルダ: `/site`
4. または GitHub Actions で自動ビルド・デプロイ

```yaml
# .github/workflows/deploy.yml の例
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: ./build.sh
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/
```

### Netlify

1. `netlify.toml` を作成:

```toml
[build]
  command = "./build.sh"
  publish = "site/"
```

2. Netlify にリポジトリを接続
3. 自動デプロイが有効化される

### Cloudflare Pages

1. Cloudflare Dashboard → Pages → Create a project
2. Git リポジトリを接続
3. Build command: `./build.sh`
4. Output directory: `site/`

---

## セキュリティチェックリスト

- [ ] `.env` ファイルが `.gitignore` に含まれている
- [ ] APIキーがソースコードに含まれていない
- [ ] 公開ファイルにセンシティブ情報がない
- [ ] HTTPS が有効化されている
