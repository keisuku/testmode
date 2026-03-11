---
title: "Claude 更新テンプレート"
tags: ["prompt", "template", "automation"]
status: "stable"
updated: "2026-03-11"
author: "claude"
related: ["content_template.md", "saki-info.md"]
---

# Claude 更新テンプレート — 1回コピペで更新を依頼する

## 最短結論

以下のテンプレをコピペして Claude に渡すだけで、ナレッジベースを更新できる。

---

## 更新テンプレート（コピペ用）

```
## ナレッジ更新依頼

### 1. 要請（1行）
（例: world.md を最新の価格データで更新して）

### 2. 対象ファイル
（例: knowledge/world.md）

### 3. 変更内容（要点3つ）
1.
2.
3.

### 4. 出力形式
（ diff / full file / 該当セクションのみ ）

### 5. コミットメッセージ
（例: "Update world.md: add new stage Shanghai"）
```

---

## 使い方

1. 上のテンプレをコピー
2. 各項目を埋める
3. Claude に渡す
4. Claude が対象ファイルを更新し、Git コミットまで行う

---

## 応用例

### キャラクター追加

```
## ナレッジ更新依頼

### 1. 要請
characters.md に新キャラ「白狐（Byakko）」を追加して

### 2. 対象ファイル
knowledge/characters.md

### 3. 変更内容
1. 白狐のメタデータ（性別:女性、時間軸:15分、ロール:中期トレンドフォロワー）
2. キャラ説明文（俳句圧縮スタイル）
3. related ファイルの更新

### 4. 出力形式
full file

### 5. コミットメッセージ
"Add character: Byakko (白狐) - mid-term trend follower"
```

### ステージ追加

```
## ナレッジ更新依頼

### 1. 要請
world.md に上海ステージを追加して

### 2. 対象ファイル
knowledge/world.md

### 3. 変更内容
1. 上海ステージの設定（テーマ・雰囲気・時間軸）
2. ステージ例セクションに追加
3. 演出の特殊要素

### 4. 出力形式
diff

### 5. コミットメッセージ
"Add stage: Shanghai financial district"
```
