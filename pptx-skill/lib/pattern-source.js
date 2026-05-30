/**
 * pattern-source.js — パターン1: 投資系テロップ用テンプレート集
 *
 * 赤帯ヘッダー＋白背景のスライドを生成する関数群。
 * 表組み、数式レイアウト、ピラミッド図、スクショ引用、CTA等に対応。
 */

const path = require("path");
const {
    COLORS_SOURCE: C,
    FONTS,
    addRedHeaderSlide,
    addLabelBox,
    addHighlightedText,
    addCitation,
} = require("./shared");

// ============================================================
// テキストスライド（デフォルト）
// ============================================================

function renderTextSlide(pres, slide) {
    const s = addRedHeaderSlide(pres, slide.sectionTitle || "");

    const lines = slide.text.split("\n").filter(l => l.trim());
    const fontSize = lines.length > 4 ? 24 : lines.length > 2 ? 28 : 36;

    s.addText(slide.text, {
        x: 0.5, y: 1.0, w: 9.0, h: 3.8,
        fontSize, fontFace: FONTS.heading,
        color: C.textDark, bold: true,
        lineSpacingMultiple: 1.5,
        valign: "middle",
    });

    return s;
}

// ============================================================
// 表組みスライド
// ============================================================

function renderTableSlide(pres, slide) {
    const s = addRedHeaderSlide(pres, slide.sectionTitle || "");

    const lines = slide.text.split("\n").filter(l => l.trim());
    const tableRows = [];

    for (const line of lines) {
        if (line.includes("|")) {
            const cells = line.split("|").filter(c => c.trim()).map(c => c.trim());
            if (cells.length >= 2 && !line.match(/^[\s\-|]+$/)) {
                tableRows.push(cells);
            }
        } else if (line.includes("\t")) {
            tableRows.push(line.split("\t").map(c => c.trim()));
        }
    }

    if (tableRows.length >= 2) {
        const colCount = Math.max(...tableRows.map(r => r.length));
        const colW = (8.5 / colCount);
        const borderOpts = { pt: 0.5, color: "CCCCCC" };

        const pptxRows = tableRows.map((row, ri) => {
            return row.map(cell => {
                const isHeader = ri === 0;
                return {
                    text: cell,
                    options: {
                        fontSize: 22,
                        fontFace: FONTS.heading,
                        color: isHeader ? C.tableHeaderText : C.textDark,
                        fill: { color: isHeader ? C.tableHeaderGreen : C.bgLightGray },
                        bold: true,
                        align: "center",
                        valign: "middle",
                        border: [borderOpts, borderOpts, borderOpts, borderOpts],
                    },
                };
            });
        });

        s.addTable(pptxRows, {
            x: 0.5, y: 1.0, w: 9.0,
            rowH: 0.5,
            colW: Array(colCount).fill(colW),
        });
    } else {
        s.addText(slide.text, {
            x: 0.5, y: 1.0, w: 9.0, h: 3.8,
            fontSize: 24, fontFace: FONTS.heading,
            color: C.textDark, lineSpacingMultiple: 1.4,
        });
    }

    // 出典
    if (slide.refUrl) {
        addCitation(s, slide.refUrl);
    }

    return s;
}

// ============================================================
// 数式レイアウトスライド
// ============================================================

function renderFormulaSlide(pres, slide) {
    const s = addRedHeaderSlide(pres, slide.sectionTitle || "");

    const text = slide.text;

    // 《参考》等のサブタイトル
    const subMatch = text.match(/[《＜<](.+?)[》＞>]/);
    if (subMatch) {
        s.addText(`《${subMatch[1]}》`, {
            x: 0.3, y: 0.8, w: 9.4, h: 0.5,
            fontSize: 24, fontFace: FONTS.heading,
            color: C.textRed, bold: true,
        });
    }

    s.addText(text.replace(/[《＜<].+?[》＞>]/, "").trim(), {
        x: 0.5, y: 1.5, w: 9.0, h: 3.5,
        fontSize: 28, fontFace: FONTS.heading,
        color: C.textDark, bold: true,
        lineSpacingMultiple: 1.5,
        valign: "middle",
    });

    if (slide.refUrl) {
        addCitation(s, slide.refUrl);
    }

    return s;
}

// ============================================================
// 引用スライド
// ============================================================

function renderQuoteSlide(pres, slide) {
    const s = addRedHeaderSlide(pres, slide.sectionTitle || "");

    // 引用符
    s.addText("\u201C", {
        x: 0.3, y: 0.9, w: 1.0, h: 1.0,
        fontSize: 60, fontFace: FONTS.heading,
        color: C.headerRed, bold: true,
    });

    // 引用テキスト
    s.addText(slide.text, {
        x: 0.8, y: 1.5, w: 8.4, h: 2.5,
        fontSize: 26, fontFace: FONTS.heading,
        color: C.textDark, bold: true, italic: true,
        lineSpacingMultiple: 1.5,
    });

    // 出典（統一書式）
    if (slide.refUrl) {
        addCitation(s, slide.refUrl);
    }

    return s;
}

// ============================================================
// スクショ引用スライド
// ============================================================

function renderScreenshotSlide(pres, slide) {
    const s = addRedHeaderSlide(pres, slide.sectionTitle || "");

    // 説明テキスト（左側）
    s.addText(slide.text, {
        x: 0.3, y: 0.9, w: 4.5, h: 4.0,
        fontSize: 22, fontFace: FONTS.heading,
        color: C.textDark, bold: true,
        lineSpacingMultiple: 1.4,
    });

    // スクショ画像エリア（右側）
    if (slide.imagePath) {
        s.addImage({
            path: slide.imagePath,
            x: 5.2, y: 0.9, w: 4.5, h: 3.8,
            sizing: { type: "contain" },
        });
        s.addShape(pres.shapes.RECTANGLE, {
            x: 5.15, y: 0.85, w: 4.6, h: 3.9,
            line: { color: "000000", width: 2 },
            fill: { type: "none" },
        });
    } else {
        s.addShape(pres.shapes.RECTANGLE, {
            x: 5.2, y: 0.9, w: 4.5, h: 3.8,
            fill: { color: C.bgLightGray },
            line: { color: "CCCCCC", width: 1.5 },
        });
        s.addText("\uD83D\uDCF7 参考画像", {
            x: 5.2, y: 2.2, w: 4.5, h: 1.0,
            fontSize: 20, fontFace: FONTS.heading,
            color: C.captionGray, align: "center",
        });
    }

    // 出典（統一書式）
    if (slide.refUrl) {
        addCitation(s, slide.refUrl);
    }

    return s;
}

// ============================================================
// ピラミッド図スライド
// ============================================================

function renderPyramidSlide(pres, slide) {
    const s = addRedHeaderSlide(pres, slide.sectionTitle || "");

    const lines = slide.text.split("\n").filter(l => l.trim());
    const levels = [];

    for (const line of lines) {
        const match = line.match(/(?:Lv|レベル|STEP|ステップ)\s*(\d+)[\s:：]*(.+)/i);
        if (match) {
            levels.push({ num: parseInt(match[1]), label: match[2].trim() });
        }
    }

    if (levels.length > 0) {
        levels.sort((a, b) => a.num - b.num);
        const count = levels.length;
        const colors = C.pyramidColors;
        const maxW = 5.0;
        const minW = 1.0;
        const layerH = Math.min(0.45, 3.5 / count);
        const startY = 1.0;

        levels.reverse().forEach((lv, i) => {
            const w = minW + (maxW - minW) * (i / Math.max(count - 1, 1));
            const x = 0.5 + (maxW - w) / 2;
            const y = startY + i * layerH;
            const color = colors[i % colors.length];

            s.addShape(pres.shapes.RECTANGLE, {
                x, y, w, h: layerH - 0.03,
                fill: { color },
            });

            s.addText(`${lv.label}`, {
                x, y, w, h: layerH - 0.03,
                fontSize: 20, fontFace: FONTS.heading,
                color: "FFFFFF", bold: true,
                align: "center", valign: "middle",
            });
        });
    } else {
        s.addText(slide.text, {
            x: 0.5, y: 1.0, w: 9.0, h: 3.8,
            fontSize: 18, fontFace: FONTS.body,
            color: C.textDark, lineSpacingMultiple: 1.4,
        });
    }

    return s;
}

// ============================================================
// CTAスライド（LINE登録誘導等）
// ============================================================

function renderCTASlide(pres, slide) {
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };

    // 赤帯ヘッダー
    s.addShape(pres.shapes.RECTANGLE, {
        x: 0, y: 0, w: 10, h: 0.7,
        fill: { color: C.headerRed },
    });
    s.addText("\u30C1\u30E3\u30F3\u30CD\u30EB\u767B\u9332\u30FB\u9AD8\u8A55\u4FA1\u30FB\u30B3\u30E1\u30F3\u30C8\u306E\u304A\u9858\u3044\u3057\u307E\u3059\uFF01", {
        x: 0.3, y: 0.05, w: 9.4, h: 0.6,
        fontSize: 22, fontFace: FONTS.heading,
        color: C.textWhite, bold: true,
        valign: "middle",
    });

    s.addText(slide.text, {
        x: 0.5, y: 1.2, w: 5.0, h: 3.5,
        fontSize: 26, fontFace: FONTS.heading,
        color: C.textDark, bold: true,
        lineSpacingMultiple: 1.5,
    });

    return s;
}

// ============================================================
// チャートスライド（棒グラフ等）
// ============================================================

function renderChartSlide(pres, slide) {
    const s = addRedHeaderSlide(pres, slide.sectionTitle || "");

    s.addText(slide.text, {
        x: 0.5, y: 1.0, w: 9.0, h: 3.8,
        fontSize: 26, fontFace: FONTS.heading,
        color: C.textDark, bold: true,
        lineSpacingMultiple: 1.4,
        valign: "middle",
    });

    if (slide.refUrl) {
        addCitation(s, slide.refUrl);
    }

    return s;
}

// ============================================================
// メインレンダラー
// ============================================================

const RENDERERS = {
    text: renderTextSlide,
    table: renderTableSlide,
    formula: renderFormulaSlide,
    quote: renderQuoteSlide,
    screenshot: renderScreenshotSlide,
    pyramid: renderPyramidSlide,
    cta: renderCTASlide,
    chart: renderChartSlide,
};

/**
 * スライド構成JSONからPPTXスライドを生成する
 * @param {object} pres - PptxGenJS presentation
 * @param {Array} slides - parseScript()の出力
 */
function renderSourceSlides(pres, slides) {
    for (const slide of slides) {
        const renderer = RENDERERS[slide.slideType] || RENDERERS.text;
        renderer(pres, slide);
    }
}

module.exports = {
    renderSourceSlides,
    renderTextSlide,
    renderTableSlide,
    renderFormulaSlide,
    renderQuoteSlide,
    renderScreenshotSlide,
    renderPyramidSlide,
    renderCTASlide,
    renderChartSlide,
    RENDERERS,
};
