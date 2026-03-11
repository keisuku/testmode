---
title: "コンテンツテンプレート"
tags: ["template", "format", "guide"]
status: "stable"
updated: "2026-03-11"
author: "claude"
related: ["claude_update.md"]
---

# コンテンツテンプレート — 新規Markdownファイルのひな形

## 最短結論

新しいナレッジファイルを作成する際はこのテンプレートに従う。俳句圧縮スタイルを厳守。

---

## テンプレート

```markdown
---
title: "タイトル"
tags: ["tag1", "tag2"]
status: "draft"
updated: "YYYY-MM-DD"
author: "claude"
related: ["related-file.md"]
---

# タイトル — サブタイトル（1行で内容を要約）

## 最短結論

（1〜2文で結論を述べる。これだけ読めば要点が分かるように。）

---

## 大見出し1

### 中見出し

- 要点1
- 要点2
- 要点3

## 大見出し2

### 中見出し

- 要点
```

---

## フォーマットルール

### 俳句圧縮スタイル

1. **最短結論**（1行）を冒頭に置く
2. **大見出し** → **中見出し** → **要点（箇条書き）** の階層
3. 冗長な説明は避け、要点を箇条書きで圧縮
4. 表は情報の比較・一覧に積極的に使う

### Frontmatter 必須フィールド

| フィールド | 説明 | 例 |
|-----------|------|-----|
| title | ファイルのタイトル | "世界観設定" |
| tags | タグ配列 | ["world", "setting"] |
| status | draft / wip / stable | "wip" |
| updated | 最終更新日 | "2026-03-11" |
| author | 著者 | "claude" |
| related | 関連ファイル | ["saki-info.md"] |

### 固有名詞ルール

以下は**絶対に変更しない**:

- 高市総理
- 片山財務大臣
- 小野田オタク大臣
- 鉄腕アトムのプルート
