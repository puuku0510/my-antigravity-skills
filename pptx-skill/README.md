# PPTX スライド自動生成スキル & スクショ収集スキル

## 概要

YouTube動画のスライドを**台本から自動生成**する2つのスキルセットです。

| スキル | 役割 |
|--------|------|
| `pptx-skill` | 台本 → PPTX自動生成（パターン1: 図解特化 / パターン2: キャラ系テロップ） |
| `slide-source-collector` | 台本 → スクリーンショット・引用画像の自動収集（50-30-20バランスルール） |

## セットアップ

### 1. 旧スキルの削除（重要！）

> ⚠️ 以前のバージョンの `pptx-skill` を使用していた場合、**旧スキルを必ず削除**してください。
> 同じ機能のスキルが2つあると、AIが混乱して間違ったスキルを使う場合があります。

```powershell
# 旧スキルの削除（存在する場合のみ）
Remove-Item -Recurse -Force "$env:USERPROFILE\.gemini\antigravity\skills\pptx-skill" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gemini\antigravity\skills\slide-source-collector" -ErrorAction SilentlyContinue
```

### 2. 新スキルのインストール

```powershell
# スキルフォルダに移動
cd "$env:USERPROFILE\.gemini\antigravity\skills"

# pptx-skill（スライド生成）
git clone https://github.com/kei-iwasaki/pptx-skill.git

# slide-source-collector（スクショ収集）
git clone https://github.com/kei-iwasaki/slide-source-collector.git
```

### 3. 依存パッケージのインストール

```powershell
cd pptx-skill
npm install
```

## 使い方

### スライド生成（pptx-skill）
AIに「スライド作って」「パワポ作って」と依頼するだけ。
AIが以下のフローで進めます：

1. **ヒアリング** — 台本・パターン・枚数を確認
2. **構成案提示** — 1行1スライドのリストを提示
3. **承認** — OKまたは修正指示
4. **制作** — PPTX + PDF を自動生成

### スクショ収集（slide-source-collector）
AIに「素材集めて」「スクショ収集して」と依頼するだけ。
50-30-20バランスルール（Tier 1: 50%, Tier 2: 30%, Tier 3: 20%）でバランスよく収集します。

## サンプル

### pptx-skill/examples/
- `buffett-source-slides.js` — パターン1（source）の生成コード例（15枚・バフェット探求）
- `buffett-source-sample.pptx` — 上記コードで生成されたPPTX

### slide-source-collector/examples/
- `buffett-sources.json` — 25枚のスクショ収集結果（sources.json形式）

## チャンネルプロファイル

| チャンネル名 | ジャンル | デフォルトパターン |
|-------------|---------|------------------|
| 投資犬 | 投資・お金の解説 | `source` |
| gon実写 | 投資・お金の解説 | `source` |
| gon(ニュース、本要約) | 投資・お金の解説 | `source` |
| バフェット探求 | バフェット手法 | `source` |
| suyaのAI×動画編集教室 | AI・動画編集 | `character` |

## ライセンス
Private - Internal Use Only
