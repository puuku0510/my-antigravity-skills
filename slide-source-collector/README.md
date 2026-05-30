# スクショ素材収集スキル (slide-source-collector)

## 概要
YouTube台本から参照すべきWeb・ニュース・X投稿・書籍表紙をバランスよく収集するスキル。

## 50-30-20 ソースバランスルール

| Tier | 割合 | 内容 | 例 |
|------|------|------|-----|
| Tier 1 | 50% | チャート・グラフ・X投稿 | 株価チャート、インフルエンサーツイート |
| Tier 2 | 30% | ニュース記事 | CNBC, Bloomberg, Investopedia |
| Tier 3 | 20% | Wikipedia・場所・書籍 | 人物Wiki, 建物写真, 書籍表紙 |

## ブラウザ安全ルール（厳守）

> ⚠️ **1バッチ最大2枚**のスクリーンショットを撮ったら、ブラウザを閉じて再起動。
> これを破るとフリーズします。

## 使い方
AIに「素材集めて」「スクショ収集して」と依頼するだけ。

## 出力
- 連番リネーム済みPNG: `01_category_description.png`
- メタデータ: `sources.json`

## サンプル
- `examples/buffett-sources.json` — バフェット探求の25枚収集結果

## セットアップ
```powershell
cd "$env:USERPROFILE\.gemini\antigravity\skills"
git clone https://github.com/kei-iwasaki/slide-source-collector.git
```

## ライセンス
Private - Internal Use Only
