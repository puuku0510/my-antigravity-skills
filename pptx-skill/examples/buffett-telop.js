/**
 * buffett-telop-v2.js — 画像付きバフェットテロップスライド
 */

const path = require("path");
const pptxgen = require("pptxgenjs");
const { COLORS, FONTS } = require("../lib/shared");

const ASSETS = path.join(__dirname, "..", "assets");

async function main() {
    const pres = new pptxgen();
    pres.layout = "LAYOUT_16x9";
    pres.author = "KEI IWASAKI";

    // ── スライド1：手紙の導入 ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ path: path.join(ASSETS, "slide1.png"), x: 5.0, y: 0.3, w: 4.8, h: 5.0, sizing: { type: "contain" } });
        slide.addText("2025年11月10日", { x: 0.4, y: 0.5, w: 4.5, h: 0.5, fontSize: 14, fontFace: FONTS.body, color: COLORS.textMuted });
        slide.addText("一通の手紙が、\n世界中の投資家の元に届いた。", { x: 0.4, y: 1.2, w: 4.5, h: 1.2, fontSize: 20, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, lineSpacingMultiple: 1.4 });
        slide.addText("差出人は、ウォーレン・バフェット。", { x: 0.4, y: 2.6, w: 4.5, h: 0.5, fontSize: 16, fontFace: FONTS.body, color: COLORS.textBlack });
        slide.addText("95", { x: 0.4, y: 3.3, w: 2.0, h: 1.5, fontSize: 96, fontFace: FONTS.accent, color: COLORS.brandSkyBlue, bold: true });
        slide.addText("歳", { x: 2.4, y: 4.0, w: 1.0, h: 0.6, fontSize: 24, fontFace: FONTS.body, color: COLORS.textMuted });
    }

    // ── スライド2：「静かになる」引用 ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ path: path.join(ASSETS, "slide2.png"), x: 5.5, y: 0.0, w: 4.5, h: 5.625, sizing: { type: "contain" } });
        slide.addText("\u201C", { x: 0.3, y: 0.8, w: 1.0, h: 1.0, fontSize: 80, fontFace: FONTS.heading, color: COLORS.brandSkyBlue, bold: true });
        slide.addText("イギリス風に言えば、\n私は \"静かになる\"\nというわけです", { x: 0.5, y: 1.6, w: 5.0, h: 2.0, fontSize: 22, fontFace: FONTS.body, color: COLORS.textDark, italic: true, lineSpacingMultiple: 1.5 });
        slide.addShape(pres.shapes.LINE, { x: 0.5, y: 3.8, w: 2.5, h: 0, line: { color: COLORS.brandSkyBlue, width: 2 } });
        slide.addText("ウォーレン・バフェット", { x: 0.5, y: 4.0, w: 4.0, h: 0.4, fontSize: 14, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
        slide.addText("64年間、世界の金融市場に君臨した男の最後の言葉", { x: 0.5, y: 4.4, w: 5.0, h: 0.35, fontSize: 11, fontFace: FONTS.body, color: COLORS.textMuted });
    }

    // ── スライド3：10万円→44億円 ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ path: path.join(ASSETS, "slide3.png"), x: 0.0, y: 0.0, w: 10.0, h: 5.625, sizing: { type: "cover" } });
        // 半透明オーバーレイ
        slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "FFFFFF", transparency: 30 } });
        slide.addText("1965年に10万円を預けていたら", { x: 0.5, y: 0.3, w: 9.0, h: 0.6, fontSize: 18, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center" });
        // 左パネル
        slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.2, h: 3.5, fill: { color: COLORS.headerDark, transparency: 10 }, rectRadius: 0.08 });
        slide.addText("10万円", { x: 0.5, y: 1.5, w: 4.2, h: 1.2, fontSize: 48, fontFace: FONTS.accent, color: COLORS.textDark, bold: true, align: "center" });
        slide.addText("1965年\nバークシャー株 19ドル/株", { x: 0.5, y: 2.8, w: 4.2, h: 1.0, fontSize: 14, fontFace: FONTS.body, color: COLORS.textBlack, align: "center", lineSpacingMultiple: 1.4 });
        // 矢印
        slide.addText("\u25B6", { x: 4.7, y: 2.3, w: 0.6, h: 0.6, fontSize: 24, fontFace: FONTS.body, color: COLORS.brandSkyBlue, align: "center", valign: "middle" });
        // 右パネル
        slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.2, w: 4.2, h: 3.5, fill: { color: COLORS.brandSkyBlue, transparency: 15 }, rectRadius: 0.08 });
        slide.addText("44億円", { x: 5.3, y: 1.5, w: 4.2, h: 1.2, fontSize: 48, fontFace: FONTS.accent, color: COLORS.brandBlue, bold: true, align: "center" });
        slide.addText("2024年\n株価 約70万ドル/株\n60年間の複利成長", { x: 5.3, y: 2.8, w: 4.2, h: 1.2, fontSize: 14, fontFace: FONTS.body, color: COLORS.textBlack, align: "center", lineSpacingMultiple: 1.4 });
    }

    // ── スライド4：手紙に書かれなかったもの ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ path: path.join(ASSETS, "slide4.png"), x: 5.5, y: 0.5, w: 4.2, h: 4.5, sizing: { type: "contain" } });
        slide.addText("最後の手紙に\n書かれなかったもの", { x: 0.4, y: 0.3, w: 5.0, h: 0.8, fontSize: 22, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, lineSpacingMultiple: 1.3 });
        const items = [
            { label: "おすすめ銘柄", checked: false },
            { label: "チャートの読み方", checked: false },
            { label: "テクニカル分析", checked: false },
            { label: "おすすめの投資信託", checked: false },
            { label: "人間としての生き方", checked: true },
        ];
        items.forEach((item, i) => {
            const y = 1.4 + i * 0.7;
            const icon = item.checked ? "\u2705" : "\u274C";
            const color = item.checked ? COLORS.brandSkyBlue : COLORS.textMuted;
            slide.addText(icon, { x: 0.5, y, w: 0.5, h: 0.5, fontSize: 20, align: "center", valign: "middle" });
            slide.addText(item.label, { x: 1.1, y, w: 4.0, h: 0.5, fontSize: 18, fontFace: FONTS.body, color, bold: item.checked, valign: "middle" });
        });
    }

    // ── スライド5：偉大さの名言 ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ path: path.join(ASSETS, "slide5.png"), x: 0.0, y: 0.0, w: 10.0, h: 5.625, sizing: { type: "cover" } });
        slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "000000", transparency: 50 } });
        slide.addText("\u201C", { x: 0.5, y: 0.5, w: 1.0, h: 1.0, fontSize: 80, fontFace: FONTS.heading, color: COLORS.brandSkyBlue, bold: true });
        slide.addText("偉大さとは、\n莫大な金を稼ぐことでも、\n有名になることでも、\n政府で大きな権力を持つことでも\nありません", { x: 0.8, y: 1.3, w: 8.0, h: 3.0, fontSize: 24, fontFace: FONTS.body, color: "FFFFFF", lineSpacingMultiple: 1.5 });
        slide.addText("── ウォーレン・バフェット　2024年 株主への手紙", { x: 0.8, y: 4.5, w: 8.0, h: 0.4, fontSize: 12, fontFace: FONTS.body, color: "B0BEC5" });
    }

    // ── スライド6：ノーベルのエピソード ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ path: path.join(ASSETS, "slide6.png"), x: 0.0, y: 0.3, w: 3.5, h: 4.8, sizing: { type: "contain" } });
        slide.addText("アルフレッド・ノーベルの転機", { x: 3.5, y: 0.3, w: 6.2, h: 0.6, fontSize: 22, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
        const steps = [
            { num: "1", label: "兄の死去", desc: "ノーベルの兄が亡くなる" },
            { num: "2", label: "誤報", desc: "新聞社の手違いで自分の死亡記事が掲載される" },
            { num: "3", label: "衝撃", desc: "自分がどう書かれているかに衝撃を受ける" },
            { num: "4", label: "決意", desc: "生き方を改めるべきだと悟り、ノーベル賞を創設" },
        ];
        steps.forEach((step, i) => {
            const y = 1.2 + i * 1.0;
            slide.addShape(pres.shapes.OVAL, { x: 3.7, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: COLORS.brandSkyBlue } });
            slide.addText(step.num, { x: 3.7, y: y + 0.05, w: 0.4, h: 0.4, fontSize: 14, fontFace: FONTS.accent, color: "FFFFFF", bold: true, align: "center", valign: "middle" });
            slide.addText(step.label, { x: 4.3, y, w: 2.0, h: 0.35, fontSize: 16, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
            slide.addText(step.desc, { x: 4.3, y: y + 0.35, w: 5.2, h: 0.4, fontSize: 12, fontFace: FONTS.body, color: COLORS.textMuted });
            if (i < 3) {
                slide.addShape(pres.shapes.LINE, { x: 3.9, y: y + 0.5, w: 0, h: 0.45, line: { color: COLORS.brandSkyBlue, width: 1.5 } });
            }
        });
    }

    // ── スライド7：死亡記事の名言 ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ path: path.join(ASSETS, "slide7.png"), x: 5.5, y: 0.0, w: 4.5, h: 5.625, sizing: { type: "contain" } });
        slide.addText("\u201C", { x: 0.3, y: 0.5, w: 1.0, h: 1.0, fontSize: 80, fontFace: FONTS.heading, color: COLORS.brandSkyBlue, bold: true });
        slide.addText("新聞の間違いを\n待つ必要はない。\n\n自分の死亡記事に\n何と書いてほしいかを考え、\nその内容にふさわしい\n人生を生きることだ。", { x: 0.5, y: 1.3, w: 5.0, h: 3.0, fontSize: 18, fontFace: FONTS.body, color: COLORS.textDark, lineSpacingMultiple: 1.4 });
        slide.addShape(pres.shapes.LINE, { x: 0.5, y: 4.5, w: 2.5, h: 0, line: { color: COLORS.brandSkyBlue, width: 2 } });
        slide.addText("── ウォーレン・バフェット", { x: 0.5, y: 4.7, w: 4.0, h: 0.35, fontSize: 12, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
    }

    // ── スライド8：資産推移（棒グラフ + 背景画像） ──
    {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: COLORS.brandSkyBlue } });
        slide.addText("ウォーレン・バフェットの資産推移（億ドル）", { x: 0.3, y: 0.2, w: 9.4, h: 0.6, fontSize: 22, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
        const chartData = [{
            name: "資産（億ドル）",
            labels: ["1965", "1980", "1990", "2000", "2008", "2015", "2020", "2024"],
            values: [0.25, 6.2, 33, 280, 620, 600, 680, 1300],
        }];
        slide.addChart(pres.charts.BAR, chartData, {
            x: 0.5, y: 1.0, w: 9.0, h: 4.2,
            barDir: "col",
            chartColors: ["29B6F6"],
            showValue: true,
            valueFontSize: 9,
            valueFontFace: "Roboto",
            catAxisLabelFontSize: 11,
            catAxisLabelFontFace: "Noto Sans JP",
            catAxisLabelColor: "333333",
            valAxisLabelFontSize: 8,
            valAxisLabelColor: "7A7A9D",
            catGridLine: { style: "none" },
            valGridLine: { color: "E0E0E0", width: 0.5 },
            showLegend: false,
        });
    }

    // ── 書き出し ──
    const outputPath = path.join(__dirname, "..", "output", "buffett-telop-v2.pptx");
    const outputDir = path.dirname(outputPath);
    const fs = require("fs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    await pres.writeFile({ fileName: outputPath });
    console.log(`\n✅ 画像付きテロップスライド生成完了: ${outputPath}`);
    console.log(`   全${pres.slides.length}枚`);
}

main().catch(console.error);
