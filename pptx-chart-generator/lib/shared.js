/**
 * shared.js — 汎用スライドデザインシステム & 共通ユーティリティ
 *
 * グラフ・図解自動生成エンジン（render-engine.js）で共通使用する配色・フォント・
 * レイアウト定数、および共通の描画ヘルパー関数を定義します。
 */

const path = require("path");
const fs = require("fs");

// ============================================================
// 🎨 カラーパレット（プレミアム・ビジネスブルー系統）
// ============================================================

const COLORS = {
    // 主要テーマカラー
    primary: "0F172A",      // プレミアムダークネイビー（テキスト、ヘッダー背景用）
    secondary: "2563EB",    // ロイヤルビジネスブルー（メインの強調・ブランドカラー）
    accent: "F97316",       // アクティブオレンジ（注意喚起・サブの強調・差し色）
    success: "10B981",      // エメラルドグリーン（ポジティブ値、チェックマーク用）

    // テキストカラー
    textDark: "1E293B",     // メインの本文（濃いグレー）
    textLight: "64748B",    // サブ・注釈（薄いグレー）
    textBlue: "2563EB",     // 青強調テキスト
    white: "FFFFFF",        // 白色

    // 背景カラー
    bgDark: "0F172A",       // ダークネイビー（表紙やセクション区切り用）
    bgLight: "F8FAFC",      // オフホワイト（通常スライドのカード背景用）
    bgWhite: "FFFFFF",      // 純白（スライド背景用）
    bgAlert: "FEF3C7",      // 警告・注意メッセージ背景用（薄い黄色）
    bgSuccess: "D1FAE5",    // ポジティブメッセージ背景用（薄い緑）

    // UI要素・枠線
    border: "E2E8F0",       // 罫線や薄いボーダー用
    tableHeader: "1E293B",  // 表ヘッダー背景色
    tableLabel: "F1F5F9",   // 表のラベル列背景色
};

// ============================================================
// 🔤 フォント設定
// ============================================================

const FONTS = {
    heading: "Noto Sans JP",
    body: "Noto Sans JP",
    accent: "Roboto",
    caption: "Noto Sans JP",
};

// ============================================================
// 📏 レイアウト定数
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
// 📊 チャートカラーパレット
// ============================================================

const CHART_COLORS = {
    sequence: [
        "2563EB", // メインブルー
        "0288D1", // サブブルー
        "00A86B", // グリーン
        "F97316", // オレンジ
        "7B1FA2", // パープル
        "EC4899", // ピンク
        "64748B", // グレー
    ],
};

// ============================================================
// 🛠️ スライド生成共通ヘルパー
// ============================================================

/**
 * 汎用コンテンツスライドのベースを生成
 */
function addContentSlide(pres, sectionName, pageNum, opts = {}) {
    const slide = pres.addSlide();
    slide.background = { color: opts.bgColor || COLORS.bgWhite };

    // フッター（セクション名 + ページ番号）
    if (sectionName) {
        slide.addText(sectionName, {
            x: 0.3, y: 5.2, w: 4.0, h: 0.3,
            fontSize: 8, fontFace: FONTS.caption,
            color: COLORS.textLight, valign: "middle",
        });
    }
    slide.addText(String(pageNum), {
        x: 9.0, y: 5.2, w: 0.7, h: 0.3,
        fontSize: 8, fontFace: FONTS.caption,
        color: COLORS.textLight, align: "right", valign: "middle",
    });

    // トップにプレミアムな細いアクセントラインを配置
    slide.addShape(pres.shapes.RECTANGLE, {
        x: 0, y: 0, w: 10, h: 0.04,
        fill: { color: COLORS.secondary },
    });

    return slide;
}

/**
 * セクション区切りスライド
 */
function addSectionSlide(pres, title, opts = {}) {
    const slide = pres.addSlide();
    slide.background = { color: COLORS.bgDark };

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
            color: "94A3B8", align: "center", valign: "top",
        });
    }

    return slide;
}

/**
 * 表紙スライド
 */
function addCoverSlide(pres, opts = {}) {
    const slide = pres.addSlide();
    slide.background = { color: COLORS.bgDark };

    // キャッチフレーズ
    if (opts.catchphrase) {
        slide.addText(opts.catchphrase, {
            x: 0.5, y: 1.2, w: 9.0, h: 0.5,
            fontSize: 14, fontFace: FONTS.body,
            color: "94A3B8", align: "left",
        });
    }

    // タイトル
    slide.addText(opts.title || "スライドタイトル", {
        x: 0.5, y: 1.8, w: 9.0, h: 1.5,
        fontSize: 36, fontFace: FONTS.heading,
        color: COLORS.white, bold: true,
        lineSpacingMultiple: 1.2,
    });

    // サブタイトル
    if (opts.subtitle) {
        slide.addText(opts.subtitle, {
            x: 0.5, y: 3.5, w: 9.0, h: 0.6,
            fontSize: 16, fontFace: FONTS.body,
            color: "94A3B8",
        });
    }

    // バージョン・日付
    if (opts.version) {
        slide.addText(opts.version, {
            x: 0.5, y: 4.8, w: 9.0, h: 0.4,
            fontSize: 10, fontFace: FONTS.caption,
            color: "64748B",
        });
    }

    return slide;
}

/**
 * エンディングスライド
 */
function addEndingSlide(pres, opts = {}) {
    const slide = pres.addSlide();
    slide.background = { color: COLORS.bgDark };

    slide.addText(opts.title || "ご清聴ありがとうございました", {
        x: 0.5, y: 1.5, w: 9.0, h: 1.5,
        fontSize: 42, fontFace: FONTS.heading,
        color: COLORS.white, bold: true,
        align: "center", valign: "middle",
    });

    if (opts.subtitle) {
        slide.addText(opts.subtitle, {
            x: 0.5, y: 3.2, w: 9.0, h: 0.6,
            fontSize: 16, fontFace: FONTS.body,
            color: "94A3B8", align: "center",
        });
    }

    if (opts.contact) {
        slide.addText(opts.contact, {
            x: 0.5, y: 4.0, w: 9.0, h: 0.5,
            fontSize: 12, fontFace: FONTS.body,
            color: "64748B", align: "center",
        });
    }

    return slide;
}

// ============================================================
// 📊 テーブルセルヘルパー
// ============================================================

/** ヘッダーセル */
function hCell(text, overrides = {}) {
    return {
        text,
        options: {
            bold: true,
            fontSize: 10,
            fontFace: FONTS.body,
            color: COLORS.white,
            fill: { color: COLORS.tableHeader },
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
            fill: { color: COLORS.tableLabel },
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
            color: COLORS.textDark,
            valign: "middle",
            ...overrides,
        },
    };
}

// ============================================================
// 📈 チャートデフォルト設定
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
        catAxisLabelColor: COLORS.textDark,
        valAxisLabelFontSize: 8,
        valAxisLabelColor: COLORS.textLight,
        catGridLine: { style: "none" },
        valGridLine: { color: COLORS.border, width: 0.5 },
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
// 🃏 カードヘルパー
// ============================================================

function topBorderCard(slide, pres, opts = {}) {
    const { x, y, w, h, borderColor } = opts;

    // カード背景
    slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: COLORS.bgLight },
        rectRadius: 0.06,
    });

    // 上部アクセントボーダー
    slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h: 0.06,
        fill: { color: borderColor || COLORS.secondary },
        rectRadius: 0.03,
    });
}

// ============================================================
// 🔢 ページカウンター
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
// エクスポート
// ============================================================

module.exports = {
    COLORS,
    FONTS,
    LAYOUT,
    CHART_COLORS,
    PageCounter,
    addContentSlide,
    addSectionSlide,
    addCoverSlide,
    addEndingSlide,
    hCell,
    lCell,
    dCell,
    defaultBarConfig,
    defaultDoughnutConfig,
    topBorderCard,
};
