---
title: "システム設計"
tags: ["system", "architecture", "automation"]
status: "wip"
updated: "2026-03-11"
author: "claude"
related: ["saki-info.md", "trading_system.md"]
---

# システム設計 — AI自動化とMarkdownベースのナレッジ管理

## 最短結論

GitHub + Claude Code + AI生成を軸にした自動化ワークフロー。Markdownベースで速度と安定性を優先する。

---

## アーキテクチャ概要

### コア構成

```
[仮想通貨先物データ] → [Bot エンジン] → [バトルロジック]
                                              ↓
[AI画像生成] → [演出レイヤー] → [フロントエンド表示]
                                              ↓
[Claude Code] → [ナレッジ更新] → [GitHub 自動コミット]
```

### 技術スタック

| レイヤー | 技術 |
|---------|------|
| データ取得 | 仮想通貨先物API（リアルタイム） |
| Bot ロジック | 戦略エンジン（HFT重視） |
| AI生成 | 画像生成AI / 動画生成AI |
| ナレッジ | Markdown + Git |
| 自動化 | Claude Code / MCP接続 |
| 公開 | 静的サイト（GitHub Pages等） |

---

## ナレッジ管理システム

### 方針

- **Notion は使わない** — Markdown/HTML Knowledge Base を Claude が直接編集
- 速度・安定性重視
- Git によるファイル差分管理

### 更新フロー

1. ユーザーが `prompts/claude_update.md` のテンプレに要望を記入
2. Claude がナレッジファイルを更新
3. Git でコミット・差分管理
4. `build.sh` で静的サイトを再生成

---

## MCP接続（実験段階）

- MCP ターミナル接続を実験中
- 完全ではないが、将来的に自動化パイプラインの一部として活用予定
- Claude Code との連携を強化する方向

---

## セキュリティ方針

- APIキー等のセンシティブ情報はファイルに書かない
- 環境変数で管理（`docs/deploy.md` 参照）
- `.gitignore` で秘密情報を除外
