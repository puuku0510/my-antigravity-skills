/**
 * shared.js — ブランドルール集 & 共通ユーティリティ
 *
 * render-engine.js から参照される色・フォント・レイアウト定数、
 * およびスライド生成ヘルパー関数をすべてここに集約する。
 */

const path = require("path");
const fs = require("fs");
const sizeOf = require("image-size");

// ============================================================
// ブランドカラー
// ============================================================

const COLORS = {
    // Primary
    brandSkyBlue: "29B6F6",
    brandBlue: "0288D1",
    brandPurple: "7B1FA2",
    brandAccent: "0288D1",

    // Text
    textDark: "1A1A2E",
    textBlack: "333333",
    textBlue: "0277BD",
    textMuted: "7A7A9D",
    white: "FFFFFF",

    // Backgrounds
    headerDark: "1A1A2E",
    offWhite: "F5F7FA",
    lightBlue: "E3F2FD",
    lightGray: "E8E8E8",

    // Table / UI
    divider: "E0E0E0",
    tableLabelGray: "4A4A68",
    greenAccent: "43A047",
};

// ============================================================
// フォント（Google Fonts 対応フォントを選択）
// ============================================================

const FONTS = {
    heading: "Noto Sans JP",
    body: "Noto Sans JP",
    accent: "Roboto",
    caption: "Noto Sans JP",
};

// ============================================================
// レイアウト定数
// ============================================================

const LAYOUT = {
    threeCol: {
        colWidth: 2.9,
        colX: (i) => 0.3 + i * (2.9 + 0.3),
    },
    slideWidth: 10,
    slideHeight: 5.625,
};

// ============================================================
// チャートカラーパレット
// ============================================================

const CHART_COLORS = {
    sequence: [
        "29B6F6", "0288D1", "01579B", "4FC3F7",
        "81D4FA", "B3E5FC", "7B1FA2", "AB47BC",
        "CE93D8", "F48FB1",
    ],
};

// ============================================================
// パターン別カラースキーム
// ============================================================

/** パターン1: 投資系テロップ（赤帯＋白背景） */
const COLORS_SOURCE = {
    headerRed: "CC0000",
    headerRedLight: "E53935",
    bgWhite: "FFFFFF",
    bgLightGray: "F5F5F5",
    bgLight: "F0F0F0",
    highlight: "FFFF00",
    textWhite: "FFFFFF",
    textDark: "333333",
    textRed: "CC0000",
    labelBlue: "2196F3",
    labelRed: "E53935",
    labelGreen: "43A047",
    tableHeaderGreen: "C8E6C9",
    tableHeaderText: "333333",
    captionGray: "999999",
    pyramidColors: [
        "E53935", "FF5722", "FF9800", "FFC107", "FFEB3B",
        "CDDC39", "8BC34A", "4CAF50", "009688", "00BCD4",
    ],
};

/** パターン2: キャラ系テロップ（ポップ＋コラージュ）赤ベース */
const COLORS_CHARACTER = {
    bgWhite: "FFFFFF",
    bgLightGray: "F5F5F5",
    bgDarkGray: "333333",
    bubbleFill: "FFFFFF",
    bubbleBorder: "333333",
    textBlack: "333333",
    textRed: "CC0000",
    textDarkRed: "8B0000",
    textPink: "E91E63",
    textOrange: "E65100",
    textGold: "BF360C",
    textBlue: "1565C0",        // アクセント用（差し色として残す）
    arrowRed: "C62828",
    arrowOrange: "D84315",
    effectYellow: "FFD600",
    channelRegText: "CC0000",
};

// ============================================================
// パターン1用ヘルパー
// ============================================================

/**
 * 赤帯ヘッダースライド（パターン1の共通ヘッダー）
 */
function addRedHeaderSlide(pres, title, opts = {}) {
    const slide = pres.addSlide();
    slide.background = { color: opts.bgColor || COLORS_SOURCE.bgWhite };

    // 赤帯ヘッダー
    slide.addShape(pres.shapes.RECTANGLE, {
        x: 0, y: 0, w: 10, h: 0.7,
        fill: { color: COLORS_SOURCE.headerRed },
    });

    // タイトル
    slide.addText(title, {
        x: 0.3, y: 0.05, w: 9.4, h: 0.6,
        fontSize: 28, fontFace: FONTS.heading,
        color: COLORS_SOURCE.textWhite, bold: true,
        valign: "middle",
    });

    return slide;
}

/**
 * 出典テキスト（統一書式）
 * フォーマット: 出典：Yahoo Finance (2026/03/07)
 * @param {object} slide
 * @param {string} sourceName - 出典元名
 * @param {string} [date] - 日付（省略時は今日）
 */
function addCitation(slide, sourceName, date, x, y, w) {
    const d = date || new Date().toISOString().split("T")[0].replace(/-/g, "/");
    slide.addText(`出典：${sourceName} (${d})`, {
        x: x || 0.3, y: y || 5.1, w: w || 9.4, h: 0.3,
        fontSize: 20, fontFace: FONTS.heading,
        color: COLORS_SOURCE.captionGray,
        align: "right",
    });
}

/**
 * ラベルボックス（青or赤の角丸矩形＋白テキスト）
 */
function addLabelBox(slide, pres, text, x, y, w, h, color) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w, h,
        fill: { color: color || COLORS_SOURCE.labelBlue },
        rectRadius: 0.06,
    });
    slide.addText(text, {
        x, y, w, h,
        fontSize: 22, fontFace: FONTS.heading,
        color: COLORS_SOURCE.textWhite, bold: true,
        align: "center", valign: "middle",
    });
}

/**
 * 黄色ハイライト付きテキスト
 */
function addHighlightedText(slide, text, x, y, w, h, opts = {}) {
    slide.addText(text, {
        x, y, w, h,
        fontSize: opts.fontSize || 18,
        fontFace: FONTS.body,
        color: opts.color || COLORS_SOURCE.textDark,
        bold: opts.bold || false,
        highlight: opts.highlightColor || COLORS_SOURCE.highlight,
        lineSpacingMultiple: opts.lineSpacing || 1.4,
    });
}

// ============================================================
// パターン2用ヘルパー
// ============================================================

/**
 * 楕円吹き出し（OVALシェイプ＋三角形で尻尾を疑似表現）
 */
function drawBubble(slide, pres, text, x, y, w, h, opts = {}) {
    const tailDir = opts.tailDir || "bottom-left"; // bottom-left | bottom-right

    // 楕円本体
    slide.addShape(pres.shapes.OVAL, {
        x, y, w, h,
        fill: { color: COLORS_CHARACTER.bubbleFill },
        line: { color: COLORS_CHARACTER.bubbleBorder, width: 2.5 },
    });

    // 吹き出し尻尾（三角形）
    const tailX = tailDir.includes("left") ? x + w * 0.25 : x + w * 0.65;
    const tailY = y + h - 0.05;
    slide.addShape(pres.shapes.ISOSCELES_TRIANGLE, {
        x: tailX, y: tailY, w: 0.4, h: 0.3,
        fill: { color: COLORS_CHARACTER.bubbleFill },
        line: { color: COLORS_CHARACTER.bubbleBorder, width: 2.5 },
        rotate: tailDir.includes("left") ? 15 : -15,
    });

    // 尻尾の根元を隠す白矩形
    slide.addShape(pres.shapes.OVAL, {
        x: tailX - 0.05, y: tailY - 0.15, w: 0.5, h: 0.25,
        fill: { color: COLORS_CHARACTER.bubbleFill },
        line: { style: "none" },
    });

    // テキスト
    slide.addText(text, {
        x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
        fontSize: opts.fontSize || 18,
        fontFace: FONTS.heading,
        color: COLORS_CHARACTER.textBlack,
        bold: true, align: "center", valign: "middle",
        lineSpacingMultiple: 1.3,
    });
}

/**
 * 太字＋影＋カラーの大文字テキスト（案2: 縁取り代替）
 */
function drawBigText(slide, text, x, y, w, h, opts = {}) {
    slide.addText(text, {
        x, y, w, h,
        fontSize: opts.fontSize || 36,
        fontFace: FONTS.heading,
        color: opts.color || COLORS_CHARACTER.textRed,
        bold: true,
        align: opts.align || "center",
        valign: opts.valign || "middle",
        lineSpacingMultiple: 1.2,
        shadow: {
            type: "outer",
            color: "000000",
            blur: 4,
            offset: 2,
            angle: 45,
            opacity: 0.6,
        },
    });
}

/**
 * 矢印エフェクト配置
 */
function drawArrow(slide, pres, x, y, w, h, opts = {}) {
    const color = opts.color || COLORS_CHARACTER.arrowRed;
    const rotate = opts.rotate || 0;
    slide.addShape(pres.shapes.RIGHT_ARROW, {
        x, y, w, h,
        fill: { color },
        rotate,
    });
}

/**
 * チャンネル登録テキスト（右下固定）
 */
function addChannelRegister(slide) {
    slide.addText("チャンネル\n登録", {
        x: 9.0, y: 4.8, w: 0.9, h: 0.7,
        fontSize: 10, fontFace: FONTS.heading,
        color: COLORS_CHARACTER.channelRegText,
        bold: true, align: "center", valign: "middle",
        lineSpacingMultiple: 1.1,
    });
}

/**
 * アスペクト比100%保証の画像配置
 * image-sizeで実ピクセル寸法を取得し、maxW×maxH枠内に
 * アスペクト比を維持したまま最大サイズで配置する。
 * @param {object} slide - pptxgenjs slide
 * @param {string} filePath - 画像ファイルパス
 * @param {number} x - 左端（インチ）
 * @param {number} y - 上端（インチ）
 * @param {number} maxW - 最大幅（インチ）
 * @param {number} maxH - 最大高さ（インチ）
 */
function addImageExact(slide, filePath, x, y, maxW, maxH) {
    if (!fs.existsSync(filePath)) return;
    try {
        const dims = sizeOf(filePath);
        const imgRatio = dims.width / dims.height;
        const boxRatio = maxW / maxH;
        let w, h;
        if (imgRatio > boxRatio) {
            // 画像が横長 → 幅に合わせる
            w = maxW;
            h = maxW / imgRatio;
        } else {
            // 画像が縦長 → 高さに合わせる
            h = maxH;
            w = maxH * imgRatio;
        }
        slide.addImage({ path: filePath, x, y, w, h });
    } catch (e) {
        // フォールバック: sizing: contain
        slide.addImage({
            path: filePath, x, y, w: maxW, h: maxH,
            sizing: { type: "contain", w: maxW, h: maxH }
        });
    }
}

// ============================================================
// ページカウンター
// ============================================================

class PageCounter {
    constructor(start = 0) {
        this._count = start;
    }
    next() {
        return ++this._count;
    }
    current() {
        return this._count;
    }
}

// ============================================================
// アセットパスヘルパー
// ============================================================

const ASSETS_DIR = path.join(__dirname, "..", "assets");

function assetPath(filename) {
    return path.join(ASSETS_DIR, filename);
}

function assetPathIfExists(filename) {
    const p = path.join(ASSETS_DIR, filename);
    return fs.existsSync(p) ? p : null;
}

// ============================================================
// スライド生成ヘルパー
// ============================================================

/**
 * コンテンツスライドのベースを生成
 */
function addContentSlide(pres, sectionName, pageNum, opts = {}) {
    const slide = pres.addSlide();
    slide.background = { color: COLORS.white };

    // ───── フッター（セクション名 + ページ番号）─────
    if (sectionName) {
        slide.addText(sectionName, {
            x: 0.3, y: 5.2, w: 4.0, h: 0.3,
            fontSize: 8, fontFace: FONTS.caption,
            color: COLORS.textMuted, valign: "middle",
        });
    }
    slide.addText(String(pageNum), {
        x: 9.0, y: 5.2, w: 0.7, h: 0.3,
        fontSize: 8, fontFace: FONTS.caption,
        color: COLORS.textMuted, align: "right", valign: "middle",
    });

    // ───── トップアクセントライン ─────
    slide.addShape(pres.shapes.RECTANGLE, {
        x: 0, y: 0, w: 10, h: 0.04,
        fill: { color: COLORS.brandSkyBlue },
    });

    return slide;
}

/**
 * セクション区切りスライド
 */
function addSectionSlide(pres, title, opts = {}) {
    const slide = pres.addSlide();

    const bgPath = assetPathIfExists("bg-gradient-section.png");
    if (bgPath) {
        slide.background = { path: bgPath };
    } else {
        slide.background = { color: COLORS.headerDark };
    }

    slide.addText(title, {
        x: 0.5, y: 1.8, w: 9.0, h: 1.2,
        fontSize: 36, fontFace: FONTS.heading,
        color: COLORS.white, bold: true,
        align: "center", valign: "middle",
    });

    if (opts.subtitle) {
        slide.addText(opts.subtitle, {
            x: 0.5, y: 3.2, w: 9.0, h: 0.6,
            fontSize: 16, fontFace: FONTS.body,
            color: "B0BEC5", align: "center", valign: "top",
        });
    }

    return slide;
}

/**
 * 表紙スライド
 */
function addCoverSlide(pres, opts = {}) {
    const slide = pres.addSlide();

    const bgPath = assetPathIfExists("bg-gradient-cover.png");
    if (bgPath) {
        slide.background = { path: bgPath };
    } else {
        slide.background = { color: COLORS.headerDark };
    }

    // ロゴ
    const logoPath = assetPathIfExists("logo-white.png");
    if (logoPath) {
        slide.addImage({
            path: logoPath,
            x: 0.4, y: 0.3, w: 1.8, h: 0.5,
            sizing: { type: "contain" },
        });
    }

    // キャッチフレーズ（サブタイトル上）
    if (opts.catchphrase) {
        slide.addText(opts.catchphrase, {
            x: 0.5, y: 1.2, w: 9.0, h: 0.5,
            fontSize: 14, fontFace: FONTS.body,
            color: "B0BEC5", align: "left",
        });
    }

    // タイトル
    slide.addText(opts.title || "Untitled", {
        x: 0.5, y: 1.8, w: 9.0, h: 1.5,
        fontSize: 36, fontFace: FONTS.heading,
        color: COLORS.white, bold: true,
        lineSpacingMultiple: 1.2,
    });

    // サブタイトル
    if (opts.subtitle) {
        slide.addText(opts.subtitle, {
            x: 0.5, y: 3.5, w: 9.0, h: 0.6,
            fontSize: 16, fontFace: FONTS.body, color: "B0BEC5",
        });
    }

    // バージョン / 日付
    if (opts.version) {
        slide.addText(opts.version, {
            x: 0.5, y: 4.8, w: 9.0, h: 0.4,
            fontSize: 10, fontFace: FONTS.caption, color: "78909C",
        });
    }

    return slide;
}

/**
 * エンディングスライド
 */
function addEndingSlide(pres, opts = {}) {
    const slide = pres.addSlide();

    const bgPath = assetPathIfExists("bg-gradient-ending.png");
    if (bgPath) {
        slide.background = { path: bgPath };
    } else {
        slide.background = { color: COLORS.headerDark };
    }

    slide.addText(opts.title || "Thank You", {
        x: 0.5, y: 1.5, w: 9.0, h: 1.5,
        fontSize: 42, fontFace: FONTS.heading,
        color: COLORS.white, bold: true,
        align: "center", valign: "middle",
    });

    if (opts.subtitle) {
        slide.addText(opts.subtitle, {
            x: 0.5, y: 3.2, w: 9.0, h: 0.6,
            fontSize: 16, fontFace: FONTS.body, color: "B0BEC5",
            align: "center",
        });
    }

    if (opts.contact) {
        slide.addText(opts.contact, {
            x: 0.5, y: 4.0, w: 9.0, h: 0.5,
            fontSize: 12, fontFace: FONTS.body, color: "78909C",
            align: "center",
        });
    }

    // ロゴ
    const logoPath = assetPathIfExists("logo-white.png");
    if (logoPath) {
        slide.addImage({
            path: logoPath,
            x: 4.1, y: 4.6, w: 1.8, h: 0.5,
            sizing: { type: "contain" },
        });
    }

    return slide;
}

// ============================================================
// テーブルセルヘルパー
// ============================================================

/** ヘッダーセル */
function hCell(text, overrides = {}) {
    return {
        text,
        options: {
            bold: true,
            fontSize: 10,
            fontFace: FONTS.body,
            color: "FFFFFF",
            fill: { color: COLORS.headerDark },
            align: "center",
            valign: "middle",
            ...overrides,
        },
    };
}

/** ラベルセル（左列など） */
function lCell(text, overrides = {}) {
    return {
        text,
        options: {
            bold: true,
            fontSize: 10,
            fontFace: FONTS.body,
            color: COLORS.textDark,
            fill: { color: COLORS.offWhite },
            valign: "middle",
            ...overrides,
        },
    };
}

/** データセル */
function dCell(text, overrides = {}) {
    return {
        text,
        options: {
            fontSize: 10,
            fontFace: FONTS.body,
            color: COLORS.textBlack,
            valign: "middle",
            ...overrides,
        },
    };
}

// ============================================================
// チャートデフォルト設定
// ============================================================

function defaultBarConfig(overrides = {}) {
    return {
        barDir: "col",
        chartColors: CHART_COLORS.sequence,
        showValue: true,
        valueFontSize: 8,
        valueFontFace: FONTS.body,
        catAxisLabelFontSize: 9,
        catAxisLabelFontFace: FONTS.body,
        catAxisLabelColor: COLORS.textBlack,
        valAxisLabelFontSize: 8,
        valAxisLabelColor: COLORS.textMuted,
        catGridLine: { style: "none" },
        valGridLine: { color: COLORS.divider, width: 0.5 },
        showLegend: true,
        legendFontSize: 9,
        legendFontFace: FONTS.body,
        legendPos: "b",
        ...overrides,
    };
}

function defaultDoughnutConfig(overrides = {}) {
    return {
        holeSize: 55,
        chartColors: CHART_COLORS.sequence,
        showValue: true,
        valueFontSize: 8,
        valueFontFace: FONTS.body,
        showLegend: false,
        ...overrides,
    };
}

// ============================================================
// カードヘルパー
// ============================================================

function topBorderCard(slide, pres, opts = {}) {
    const { x, y, w, h, borderColor } = opts;

    // カード背景
    slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: COLORS.offWhite },
        rectRadius: 0.06,
    });

    // 上部アクセントボーダー
    slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h: 0.06,
        fill: { color: borderColor || COLORS.brandAccent },
        rectRadius: 0.03,
    });
}

// ============================================================
// エクスポート
// ============================================================

module.exports = {
    COLORS,
    COLORS_SOURCE,
    COLORS_CHARACTER,
    FONTS,
    LAYOUT,
    CHART_COLORS,
    PageCounter,
    assetPath,
    assetPathIfExists,
    addContentSlide,
    addSectionSlide,
    addCoverSlide,
    addEndingSlide,
    // パターン1用
    addRedHeaderSlide,
    addLabelBox,
    addHighlightedText,
    addCitation,
    // パターン2用
    drawBubble,
    drawBigText,
    drawArrow,
    addChannelRegister,
    addImageExact,
    // テーブル
    hCell,
    lCell,
    dCell,
    defaultBarConfig,
    defaultDoughnutConfig,
    topBorderCard,
};
