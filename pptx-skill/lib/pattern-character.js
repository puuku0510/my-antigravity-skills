/**
 * pattern-character.js — パターン2: キャラ系テロップ用テンプレート集
 *
 * いらすとや系キャラ＋吹き出し＋太字影テキスト＋コラージュ配置。
 * assets/characters/ フォルダから素材を読み込んで配置する。
 */

const path = require("path");
const fs = require("fs");
const {
    COLORS_CHARACTER: C,
    FONTS,
    drawBubble,
    drawBigText,
    drawArrow,
    addChannelRegister,
} = require("./shared");

// ============================================================
// 素材管理
// ============================================================

const CHARACTERS_DIR = path.join(__dirname, "..", "assets", "characters");
const MANIFEST_PATH = path.join(CHARACTERS_DIR, "manifest.json");

/** マニフェスト読み込み（キャッシュ付き） */
let _manifest = null;
function getManifest() {
    if (_manifest) return _manifest;

    if (fs.existsSync(MANIFEST_PATH)) {
        _manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    } else {
        _manifest = {};
    }
    return _manifest;
}

/**
 * シーンのムードに合ったキャラを選択
 * @param {string} text - 台本テキスト
 * @param {number} count - 必要なキャラ数
 * @returns {Array<{name: string, path: string, position: string}>}
 */
function pickCharacters(text, count = 2) {
    const manifest = getManifest();
    const entries = Object.entries(manifest);

    if (entries.length === 0) {
        // マニフェストがない場合、フォルダ内のPNG/JPGを直接読む
        return pickFromFolder(count);
    }

    // テキストからムードを判定
    const mood = detectMood(text);

    // ムードに合うキャラをフィルタ
    const matching = entries.filter(([name, meta]) =>
        meta.tags && meta.tags.some(t => mood.tags.includes(t))
    );

    // 足りなければ全体からランダム補充
    const pool = matching.length >= count ? matching : entries;
    const selected = shuffle(pool).slice(0, count);

    return selected.map(([name, meta]) => ({
        name,
        path: findCharacterFile(name),
        position: meta.position || "left",
    }));
}

/**
 * フォルダから直接画像を取得（manifest.jsonがない場合）
 */
function pickFromFolder(count) {
    const results = [];
    const subdirs = ["people", "villains"];

    for (const sub of subdirs) {
        const dir = path.join(CHARACTERS_DIR, sub);
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir).filter(f =>
            /\.(png|jpg|jpeg|webp)$/i.test(f)
        );

        for (const f of files) {
            results.push({
                name: path.basename(f, path.extname(f)),
                path: path.join(dir, f),
                position: results.length % 2 === 0 ? "left" : "right",
            });
        }
    }

    return shuffle(results).slice(0, count);
}

/**
 * キャラ名から画像ファイルパスを解決
 */
function findCharacterFile(name) {
    const subdirs = ["people", "villains", "effects", ""];
    const exts = [".png", ".jpg", ".jpeg", ".webp"];

    for (const sub of subdirs) {
        for (const ext of exts) {
            const p = path.join(CHARACTERS_DIR, sub, name + ext);
            if (fs.existsSync(p)) return p;
        }
    }

    return null;
}

// ============================================================
// ムード判定
// ============================================================

const MOOD_KEYWORDS = {
    shock: ["驚", "まじ", "やばい", "えっ", "衝撃", "大変", "危険", "注意", "詐欺", "怖い"],
    anger: ["怒", "許さ", "ひどい", "最悪", "ふざけ", "ムカ"],
    happy: ["嬉", "やった", "最高", "素晴", "おめで", "すごい", "得", "儲"],
    explain: ["つまり", "要するに", "ポイント", "理由", "なぜ", "解説", "方法", "仕組み"],
    fear: ["不安", "心配", "リスク", "損", "失", "被害", "騙"],
    neutral: [],
};

function detectMood(text) {
    const scores = {};
    for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
        scores[mood] = keywords.filter(kw => text.includes(kw)).length;
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];

    if (top[1] === 0) {
        return { mood: "neutral", tags: ["neutral", "explain"] };
    }

    const tagMap = {
        shock: ["shock", "surprise"],
        anger: ["anger", "villain"],
        happy: ["happy", "smile"],
        explain: ["neutral", "explain"],
        fear: ["fear", "shock", "villain"],
        neutral: ["neutral"],
    };

    return { mood: top[0], tags: tagMap[top[0]] || ["neutral"] };
}

// ============================================================
// レイアウトテンプレート
// ============================================================

/** テンプレート: キャラ1体（左）＋吹き出し＋大文字 */
function layoutSingleLeft(slide, pres, text, chars, bigText) {
    // 背景
    slide.background = { color: C.bgWhite };

    // キャラ（左）
    if (chars[0] && chars[0].path) {
        slide.addImage({
            path: chars[0].path,
            x: 0.2, y: 1.5, w: 3.0, h: 3.5,
            sizing: { type: "contain" },
        });
    }

    // 吹き出し（左上）
    if (text) {
        drawBubble(slide, pres, text, 0.5, 0.2, 4.0, 1.5, {
            tailDir: "bottom-left", fontSize: 16,
        });
    }

    // 大文字テキスト（右下）
    if (bigText) {
        drawBigText(slide, bigText, 4.0, 3.0, 5.8, 2.0, {
            fontSize: 36, color: C.textRed,
        });
    }

    addChannelRegister(slide);
}

/** テンプレート: キャラ2体（左右）＋吹き出し2個 */
function layoutDualConversation(slide, pres, bubbleTexts, chars, bigText) {
    slide.background = { color: C.bgWhite };

    // 左キャラ
    if (chars[0] && chars[0].path) {
        slide.addImage({
            path: chars[0].path,
            x: 0.1, y: 2.0, w: 2.5, h: 3.2,
            sizing: { type: "contain" },
        });
    }

    // 右キャラ
    if (chars[1] && chars[1].path) {
        slide.addImage({
            path: chars[1].path,
            x: 7.5, y: 2.0, w: 2.5, h: 3.2,
            sizing: { type: "contain" },
        });
    }

    // 左吹き出し
    if (bubbleTexts[0]) {
        drawBubble(slide, pres, bubbleTexts[0], 0.3, 0.2, 3.5, 1.3, {
            tailDir: "bottom-left", fontSize: 14,
        });
    }

    // 右吹き出し
    if (bubbleTexts[1]) {
        drawBubble(slide, pres, bubbleTexts[1], 6.2, 0.2, 3.5, 1.3, {
            tailDir: "bottom-right", fontSize: 14,
        });
    }

    // 中央大文字
    if (bigText) {
        drawBigText(slide, bigText, 2.0, 3.5, 6.0, 1.8, {
            fontSize: 32, color: C.textRed,
        });
    }

    addChannelRegister(slide);
}

/** テンプレート: キャラ＋矢印＋スクショ背景 */
function layoutWithBackground(slide, pres, text, chars, bigText, bgImagePath) {
    // 背景画像
    if (bgImagePath && fs.existsSync(bgImagePath)) {
        slide.addImage({
            path: bgImagePath,
            x: 0, y: 0, w: 10, h: 5.625,
            sizing: { type: "cover" },
        });
        // 半透明オーバーレイ
        slide.addShape(pres.shapes.RECTANGLE, {
            x: 0, y: 0, w: 10, h: 5.625,
            fill: { color: "FFFFFF", transparency: 40 },
        });
    } else {
        slide.background = { color: C.bgLightGray };
    }

    // キャラ（左）
    if (chars[0] && chars[0].path) {
        slide.addImage({
            path: chars[0].path,
            x: 0.2, y: 1.8, w: 2.8, h: 3.4,
            sizing: { type: "contain" },
        });
    }

    // 大文字テキスト（下部）
    if (bigText) {
        drawBigText(slide, bigText, 0.5, 3.5, 9.0, 1.8, {
            fontSize: 40, color: C.textRed,
        });
    }

    addChannelRegister(slide);
}

// ============================================================
// レイアウトローテーション
// ============================================================

const LAYOUTS = [layoutSingleLeft, layoutDualConversation, layoutWithBackground];
let layoutIndex = 0;

function getNextLayout() {
    const layout = LAYOUTS[layoutIndex % LAYOUTS.length];
    layoutIndex++;
    return layout;
}

function resetLayoutIndex() {
    layoutIndex = 0;
}

// ============================================================
// テキスト分割（吹き出し用と大文字用）
// ============================================================

/**
 * 台本テキストを吹き出しテキストと大文字テキストに分割
 * 短いフレーズ（10文字以下）は大文字に、長いのは吹き出しに
 */
function splitTextForLayout(text) {
    const lines = text.split("\n").filter(l => l.trim());

    if (lines.length === 1) {
        if (lines[0].length <= 15) {
            return { bubbleText: "", bigText: lines[0] };
        }
        return { bubbleText: lines[0], bigText: "" };
    }

    // 最も短い行を大文字に、残りを吹き出しに
    const sorted = [...lines].sort((a, b) => a.length - b.length);
    const bigText = sorted[0];
    const bubbleText = lines.filter(l => l !== bigText).join("\n");

    return { bubbleText, bigText };
}

// ============================================================
// メインレンダラー
// ============================================================

/**
 * スライド構成JSONからキャラ系テロップを生成する
 */
function renderCharacterSlides(pres, slides) {
    resetLayoutIndex();

    for (const slideData of slides) {
        const slide = pres.addSlide();
        const chars = pickCharacters(slideData.text, 2);
        const { bubbleText, bigText } = splitTextForLayout(slideData.text);
        const layout = getNextLayout();

        if (layout === layoutDualConversation) {
            // 2体用：テキストを2つに分割
            const bubbleTexts = bubbleText
                ? bubbleText.split("\n").reduce((acc, line, i) => {
                    acc[i % 2] = (acc[i % 2] || "") + line + "\n";
                    return acc;
                }, ["", ""])
                : ["", ""];
            layout(slide, pres, bubbleTexts.map(t => t.trim()), chars, bigText);
        } else if (layout === layoutWithBackground) {
            layout(slide, pres, bubbleText, chars, bigText, slideData.imagePath || null);
        } else {
            layout(slide, pres, bubbleText, chars, bigText);
        }
    }
}

// ============================================================
// ユーティリティ
// ============================================================

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ============================================================
// エクスポート
// ============================================================

module.exports = {
    renderCharacterSlides,
    pickCharacters,
    detectMood,
    splitTextForLayout,
    getManifest,
    CHARACTERS_DIR,
    LAYOUTS,
};
