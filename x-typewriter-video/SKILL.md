---
name: x-typewriter-video
description: X（旧Twitter）の投稿をReactコンポーネントで完全再現し、本文をタイプライター風に1文字ずつ表示する動画パーツを自動生成する。Remotionを使用。「Xタイプライター」「ツイート動画」「タイプライター演出」「X投稿を動画に」等のキーワードで使用。
---

# X タイプライター動画スキル

X（旧Twitter）の投稿UIをReactで丸ごと再現し、本文を1文字ずつ高速タイピング表示する動画パーツを生成する。

> 🔴 **スクショ上書き方式は禁止**。ズレが発生するため、必ずReactでUI全体を描画する。

## トリガー

「Xタイプライター」「ツイート動画」「タイプライター演出」「X投稿を動画に」「ツイートを動画パーツに」等。

## 方式

ツイートUIの**全要素をReactコンポーネントで描画**する（スクショは使わない）：
- アバター画像 → 元スクショからffmpegでクロップして `public/inserts/` に保存
- 名前・ハンドル・認証バッジ → propsで指定
- ツイート本文 → タイプライター表示
- @メンション → **自動で青文字** `#1d9bf0`
- エンゲージメント数 → タイプ完了後フェードイン

## 入力

- Xスクショ画像（アバター画像クロップ用）
- ツイート情報（本文・名前・ハンドル・いいね数等）— スクショから読み取り or 手入力

## 仕様（固定）

| 項目 | 値 |
|------|-----|
| 表示速度 | **1.0文字/フレーム**（30fpsなら1秒30文字） |
| タイピングSE | `typing.mp3` **volume=0.7** ループ再生（タイピング中のみ） |
| カーソル | 青色縦線 `#1d9bf0`（3px幅） — タイピング中は常時表示、完了後は点滅 |
| カード背景 | **ダークモード** `#15202b` + 白カード |
| カード入場 | springアニメーション（damping=20, stiffness=100） |
| テキスト色 | `#0f1419`（X標準の黒） |
| @メンション | **自動青文字** `#1d9bf0` |
| フォントサイズ | 26px |
| エンゲージメント | タイプ完了後 **15フレームでフェードイン** |
| アバター | 52px丸型、元スクショからffmpegクロップ |
| 認証バッジ | ✓マーク（青） |

## 制作フロー

### Step 1: アバター画像のクロップ

Xスクショからアバター画像をffmpegで切り抜きます。

```bash
ffmpeg -y -i "スクショ.png" -vf "crop=70:70:18:14" "public/inserts/avatar_xxx.png"
```

> クロップ座標はスクショの解像度により微調整が必要な場合があります。

### Step 2: ツイート情報の読み取り

スクショからAIが以下の情報を読み取ります（手入力でもOK）：
- 表示名
- ハンドル（@xxx）
- 本文テキスト
- いいね数・リポスト数・表示数
- 認証バッジの有無

### Step 3: Remotionコンポーネント作成

`TypewriterTweet` コンポーネントにpropsで全情報を渡します。

```tsx
// src/components/TypewriterTweet.tsx の使用例
<TypewriterTweet
  displayName="表示名"
  handle="@handle"
  verified={true}
  avatarSrc={staticFile("inserts/avatar_xxx.png")}
  tweetText="ツイート本文をここに入れる"
  likes={1234}
  retweets={567}
  views={89000}
/>
```

### Step 4: レンダリング

```bash
npx remotion render src/index.ts TweetTypewriter out/tweet_output.mp4
```

## Remotionプロジェクト構成

```
x-typewriter-video/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              ← registerRoot
│   ├── Root.tsx               ← Composition定義
│   └── components/
│       └── TypewriterTweet.tsx ← メインコンポーネント
├── public/
│   ├── inserts/               ← アバター画像
│   └── se/
│       └── typing.mp3         ← タイピング効果音
└── out/                       ← 出力動画
```

## 依存パッケージ

```json
{
  "dependencies": {
    "remotion": "latest",
    "@remotion/cli": "latest",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "typescript": "^5",
    "@remotion/bundler": "latest"
  }
}
```

## 注意事項

- 🔴 Remotionの商用利用にはライセンスが必要（個人・少人数は無料）
- 🔴 アバター画像のクロップ座標は、スクショの解像度によって異なる場合があります
- 🔴 タイピングSE（`typing.mp3`）は自分で用意するか、フリー素材を使用してください
