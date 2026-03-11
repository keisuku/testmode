---
title: "CoinBattleSaki Knowledge Base"
tags: ["readme", "index", "guide"]
status: "stable"
updated: "2026-03-11"
author: "claude"
related: ["saki-info.md"]
---

# CoinBattleSaki Knowledge Base

仮想通貨先物Botバトル × AI生成キャラクター — Markdownベースのナレッジリポジトリ。

---

## クイックスタート

```bash
# Node.js でビルド
npm install
./build.sh

# Python でビルド
pip install -r requirements.txt
./build.sh --python

# 成果物を確認
open site/index.html
```

---

## フォルダ構造

```
CoinBattleSaki-knowledgebase/
├─ README.md              # このファイル
├─ build.sh               # ビルドスクリプト
├─ package.json           # Node.js 依存
├─ requirements.txt       # Python 依存
├─ tools/
│  ├─ build_node.js       # Node.js ビルダー
│  └─ build_py.py         # Python ビルダー
├─ knowledge/
│  ├─ saki-info.md        # プロジェクト総合情報
│  ├─ world.md            # 世界観設定
│  ├─ characters.md       # キャラクター一覧
│  ├─ systems.md          # システム設計
│  ├─ trading_system.md   # トレーディングシステム
│  ├─ timeline.md         # タイムライン
│  └─ prompts/
│     ├─ claude_update.md # Claude更新テンプレ
│     └─ content_template.md  # コンテンツひな形
├─ docs/
│  ├─ design.md           # 設計ドキュメント
│  ├─ roadmap.md          # ロードマップ
│  └─ deploy.md           # デプロイ手順
├─ web/
│  ├─ index.html          # ビルド成果物（自動生成）
│  ├─ style.css           # Notion風スタイル
│  └─ search.js           # 検索スクリプト
├─ assets/images/         # 画像アセット
└─ site/
   └─ index.html          # 公開用ビルド成果物
```

---

## 設計一枚図

```
[ユーザー] → [claude_update.md テンプレ] → [Claude Code]
                                              │
                                     knowledge/*.md を編集
                                              │
                                     git commit → build.sh
                                              │
                                     site/index.html 生成
                                              │
                                     GitHub Pages等で公開
```

---

## ファイル規約

- Frontmatter 必須: `title, tags, status, updated, author, related`
- 俳句圧縮スタイル: 最短結論 → 見出し → 要点（箇条書き）
- 固有名詞厳守: 高市総理、片山財務大臣、小野田オタク大臣、鉄腕アトムのプルート

---

## Claude に次回やらせるための指示テンプレ（1回コピペ）

以下をコピーして Claude に渡すだけで更新できます:

```
あなたは CoinBattleSaki-knowledgebase の管理AIです。
このリポジトリのルールに従って作業してください:

1. Markdown は必ず YAML frontmatter 付き（title, tags, status, updated, author, related）
2. 俳句圧縮スタイル: 最短結論(1行) → 見出し → 要点(箇条書き)
3. 固有名詞は絶対に変更しない（高市総理、片山財務大臣、小野田オタク大臣、鉄腕アトムのプルート）
4. 編集後は git commit して build.sh を実行

## 今回の依頼:
- 対象ファイル:
- 変更内容:
  1.
  2.
  3.
- 出力形式: (diff / full file)
- コミットメッセージ:
```

---

## ライセンス

MIT
