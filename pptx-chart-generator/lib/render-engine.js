/**
 * render-engine.js — 汎用 JSON → PPTX スライド生成・描画エンジン
 *
 * スライド構成を定義した JSON (deckDef) を受け取り、PptxGenJS を用いて
 * プレミアムなビジネス用スライド（図解やグラフ入り）を全自動で構築します。
 */

const pptxgen = require("pptxgenjs");
const {
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
} = require("./shared");

// ============================================================
// レイアウトレジストリ
// ============================================================

const layoutRenderers = {};

/**
 * レイアウトレンダラーを登録する
 * @param {string} name - レイアウト識別子
 * @param {function} renderFn - 実際の描画ロジック関数 (pres, slide, content, slideDef)
 */
function registerLayout(name, renderFn) {
    layoutRenderers[name] = renderFn;
}

// ============================================================
// コア API
// ============================================================

/**
 * デッキ定義 (JSON) から PptxGenJS インスタンスを構築する
 * @param {object} deckDef - スライド全体の定義オブジェクト
 * @returns {object} pres - 生成された PptxGenJS インスタンス
 */
function renderDeck(deckDef, opts = {}) {
    const pres = new pptxgen();
    pres.layout = "LAYOUT_16x9";
    pres.author = deckDef.author || "KEI IWASAKI";

    const pg = new PageCounter();

    if (Array.isArray(deckDef.slides)) {
        for (const slideDef of deckDef.slides) {
            renderSlide(pres, slideDef, pg, opts);
        }
    }

    return pres;
}

/**
 * 単一のスライドをレンダリングする
 */
function renderSlide(pres, slideDef, pg, opts = {}) {
    switch (slideDef.type) {
        case "cover":
            return renderCover(pres, slideDef);
        case "section":
            return addSectionSlide(pres, slideDef.title, {
                subtitle: slideDef.subtitle,
            });
        case "content":
            return renderContent(pres, slideDef, pg, opts);
        case "ending":
            return renderEnding(pres, slideDef);
        default:
            return renderContent(pres, slideDef, pg, opts);
    }
}

// ============================================================
// 個別スライドレンダラー
// ============================================================

function renderCover(pres, def) {
    return addCoverSlide(pres, {
        title: def.title,
        subtitle: def.subtitle,
        catchphrase: def.catchphrase,
        version: def.version,
    });
}

function renderContent(pres, def, pg, opts) {
    const slide = addContentSlide(pres, def.sectionName || "", pg.next(), opts);

    if (def.title) {
        slide.addText(def.title, {
            x: 0.3, y: 0.44, w: 9.0, h: 0.5,
            fontSize: 22, fontFace: FONTS.heading,
            color: COLORS.textDark, bold: true, valign: "middle",
        });
    }

    // 登録されたレイアウトレンダラーで図解やグラフを描画
    if (def.layout && layoutRenderers[def.layout]) {
        layoutRenderers[def.layout](pres, slide, def.content || {}, def);
    }

    if (def.source) {
        slide.addText(def.source, {
            x: 0.3, y: 4.95, w: 9.4, h: 0.25,
            fontSize: 8, fontFace: FONTS.caption,
            color: COLORS.textLight, align: "right", valign: "bottom",
        });
    }

    return slide;
}

function renderEnding(pres, def) {
    return addEndingSlide(pres, def);
}

// ============================================================
// 組み込みプレミアムレイアウトレンダラー
// ============================================================

// ─── 1. kpi-three-col (大数字KPI 3カラム並列) ───
registerLayout("kpi-three-col", (pres, slide, content) => {
    const items = content.items || [];
    items.forEach((kpi, i) => {
        if (i >= 3) return;
        const x = LAYOUT.threeCol.colX(i);
        const cardW = LAYOUT.threeCol.colWidth;
        slide.addText(kpi.value, {
            x, y: 1.8, w: cardW, h: 1.0,
            fontSize: 52, fontFace: FONTS.accent,
            color: COLORS.secondary, bold: true,
            align: "center", valign: "middle",
        });
        slide.addText(kpi.label, {
            x, y: 2.8, w: cardW, h: 0.4,
            fontSize: 14, fontFace: FONTS.body,
            color: COLORS.textLight, align: "center",
        });
    });
});

// ─── 2. doughnut-three-col (円グラフ 3カラム並列) ───
registerLayout("doughnut-three-col", (pres, slide, content) => {
    const charts = content.charts || [];
    charts.forEach((chart, i) => {
        if (i >= 3) return;
        const x = LAYOUT.threeCol.colX(i);
        const colW = LAYOUT.threeCol.colWidth;

        if (chart.title) {
            slide.addText(chart.title, {
                x, y: 1.3, w: colW, h: 0.4,
                fontSize: 12, fontFace: FONTS.body,
                color: COLORS.textDark, bold: true, align: "center",
            });
        }

        const chartData = [{
            name: chart.title || "",
            labels: chart.labels || [],
            values: chart.values || [],
        }];
        const colorSlice = CHART_COLORS.sequence.slice(0, (chart.labels || []).length);
        slide.addChart(pres.charts.DOUGHNUT, chartData, {
            x: x + (colW - 2.8) / 2, y: 1.8, w: 2.8, h: 2.8,
            holeSize: 55, chartColors: colorSlice,
            showValue: true, valueFontSize: 8,
            valueFontFace: FONTS.body, showLegend: false,
        });
    });
});

// ─── 3. two-col-text-chart (左右2分割 テキスト＋グラフ表示) ───
registerLayout("two-col-text-chart", (pres, slide, content) => {
    const left = content.left || {};
    const right = content.right || {};
    let leftY = 1.2;

    if (left.heading) {
        slide.addText(left.heading, {
            x: 0.5, y: leftY, w: 4.0, h: 0.4,
            fontSize: 16, fontFace: FONTS.heading,
            color: COLORS.textDark, bold: true,
        });
        leftY += 0.5;
    }

    if (left.body) {
        slide.addText(left.body, {
            x: 0.5, y: leftY, w: 4.0, h: 1.5,
            fontSize: 11, fontFace: FONTS.body,
            color: COLORS.textDark, lineSpacingMultiple: 1.4, valign: "top",
        });
        leftY += 1.6;
    }

    if (left.callout) {
        slide.addText(left.callout.value, {
            x: 0.5, y: leftY, w: 3.0, h: 1.0,
            fontSize: 48, fontFace: FONTS.accent,
            color: COLORS.secondary, bold: true, valign: "bottom",
        });
        if (left.callout.unit) {
            slide.addText(left.callout.unit, {
                x: 0.5, y: leftY + 1.0, w: 3.0, h: 0.4,
                fontSize: 14, fontFace: FONTS.body, color: COLORS.textLight,
            });
        }
    }

    if (right.data) {
        const chartData = [{
            name: right.data.name || "",
            labels: right.data.labels || [],
            values: right.data.values || [],
        }];

        if (right.chartType === "doughnut") {
            slide.addChart(pres.charts.DOUGHNUT, chartData,
                defaultDoughnutConfig({
                    x: 4.8, y: 1.0, w: 5.0, h: 4.0,
                    ...(right.config || {}),
                })
            );
        } else {
            slide.addChart(pres.charts.BAR, chartData,
                defaultBarConfig({
                    x: 4.8, y: 1.0, w: 5.0, h: 4.0,
                    ...(right.config || {}),
                })
            );
        }
    }
});

// ─── 4. step-flow (横型プロセス・ステップフロー図解) ───
registerLayout("step-flow", (pres, slide, content) => {
    const steps = content.steps || [];
    const count = Math.min(steps.length, 6);
    if (count === 0) return;
    const startX = 0.3; const gap = 0.15; const totalW = 9.4;
    const colW = (totalW - gap * (count - 1)) / count;
    const circleY = 1.15; const circleD = 0.4;
    const labelY = circleY + circleD + 0.12;
    const cardY = labelY + 0.55;
    const cardH = count <= 4 ? 2.6 : 2.2;
    const durationY = cardY + cardH + 0.12;
    const labelFs = count <= 4 ? 14 : 12;
    const descFs = count <= 4 ? 10 : 9;
    const numFs = count <= 4 ? 14 : 12;

    steps.forEach((step, i) => {
        if (i >= count) return;
        const x = startX + i * (colW + gap);
        const centerX = x + colW / 2;
        
        // 丸ポイント描画
        slide.addShape(pres.shapes.OVAL, { x: centerX - circleD / 2, y: circleY, w: circleD, h: circleD, fill: { color: COLORS.secondary } });
        slide.addText(String(i + 1), { x: centerX - circleD / 2, y: circleY, w: circleD, h: circleD, fontSize: numFs, fontFace: FONTS.accent, color: COLORS.white, bold: true, align: "center", valign: "middle" });
        
        // 矢印線
        if (i < count - 1) {
            const lineStartX = centerX + circleD / 2 + 0.02;
            const nextCenterX = startX + (i + 1) * (colW + gap) + colW / 2;
            const lineEndX = nextCenterX - circleD / 2 - 0.02;
            const lineY = circleY + circleD / 2;
            slide.addShape(pres.shapes.LINE, { x: lineStartX, y: lineY, w: lineEndX - lineStartX, h: 0, line: { color: COLORS.secondary, width: 1.5 } });
        }
        
        slide.addText(step.label || "", { x, y: labelY, w: colW, h: 0.45, fontSize: labelFs, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center", valign: "middle" });
        slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cardY, w: colW, h: cardH, fill: { color: COLORS.bgLight }, rectRadius: 0.06 });
        
        if (step.description) {
            slide.addText(step.description, { x: x + 0.1, y: cardY + 0.1, w: colW - 0.2, h: cardH - 0.2, fontSize: descFs, fontFace: FONTS.body, color: COLORS.textDark, lineSpacingMultiple: 1.35, valign: "top", align: "left" });
        }
        
        if (step.duration) {
            const badgeW = Math.min(colW - 0.2, 1.2);
            slide.addText(step.duration, { x: centerX - badgeW / 2, y: durationY, w: badgeW, h: 0.3, fontSize: 9, fontFace: FONTS.body, color: COLORS.secondary, bold: true, align: "center", valign: "middle", border: { type: "solid", color: COLORS.secondary, pt: 0.75 }, rectRadius: 0.04 });
        }
    });
});

// ─── 5. comparison-table (Before/After 対比表) ───
registerLayout("comparison-table", (pres, slide, content) => {
    const rows = content.rows || [];
    const beforeTitle = content.beforeTitle || "現状 (Before)";
    const afterTitle = content.afterTitle || "理想 (After)";
    const headerRow = [
        hCell("カテゴリ", { fill: { color: COLORS.primary } }), 
        hCell(beforeTitle, { fill: { color: COLORS.primary } }), 
        hCell(afterTitle, { fill: { color: COLORS.secondary } })
    ];
    const dataRows = rows.map((row) => [
        lCell(row.category, { align: "left" }), 
        dCell(row.before, { align: "center" }), 
        dCell(row.after, { align: "center", bold: true, color: COLORS.secondary })
    ]);
    slide.addTable([headerRow, ...dataRows], { x: 0.3, y: 1.2, w: 9.4, colW: [2.4, 3.5, 3.5], rowH: 0.45, border: { type: "solid", color: COLORS.border, pt: 0.5 }, margin: [4, 6, 4, 6] });
});

// ─── 6. timeline (横型タイムライン・経緯図) ───
registerLayout("timeline", (pres, slide, content) => {
    const items = content.items || []; const count = Math.min(items.length, 6); if (count === 0) return;
    const startX = 0.5; const endX = 9.5; const lineY = 3.0; const totalW = endX - startX;
    const spacing = count > 1 ? totalW / (count - 1) : 0;
    
    slide.addShape(pres.shapes.LINE, { x: startX, y: lineY, w: totalW, h: 0, line: { color: COLORS.secondary, width: 2 } });
    
    items.forEach((item, i) => {
        if (i >= count) return;
        const cx = count > 1 ? startX + i * spacing : startX + totalW / 2;
        slide.addShape(pres.shapes.OVAL, { x: cx - 0.12, y: lineY - 0.12, w: 0.24, h: 0.24, fill: { color: COLORS.secondary } });
        slide.addText(item.date, { x: cx - 0.8, y: lineY - 0.85, w: 1.6, h: 0.6, fontSize: 10, fontFace: FONTS.accent, color: COLORS.secondary, bold: true, align: "center", valign: "bottom" });
        slide.addText(item.title, { x: cx - 0.8, y: lineY + 0.25, w: 1.6, h: 0.4, fontSize: 11, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center", valign: "top" });
        if (item.description) {
            slide.addText(item.description, { x: cx - 0.8, y: lineY + 0.65, w: 1.6, h: 0.8, fontSize: 9, fontFace: FONTS.body, color: COLORS.textLight, align: "center", valign: "top", lineSpacingMultiple: 1.2 });
        }
    });
});

// ─── 7. quote (メッセージ・引用) ───
registerLayout("quote", (pres, slide, content) => {
    slide.addText("\u201C", { x: 0.8, y: 1.2, w: 1.0, h: 1.0, fontSize: 80, fontFace: FONTS.heading, color: COLORS.secondary, bold: true, valign: "top" });
    slide.addText(content.text || "", { x: 1.2, y: 1.8, w: 7.6, h: 1.8, fontSize: 18, fontFace: FONTS.body, color: COLORS.textDark, italic: true, lineSpacingMultiple: 1.5, valign: "top" });
    slide.addShape(pres.shapes.LINE, { x: 1.2, y: 3.8, w: 2.5, h: 0, line: { color: COLORS.secondary, width: 2 } });
    
    let roleCompany = "";
    if (content.role) roleCompany += content.role;
    if (content.company) roleCompany += roleCompany ? ` / ${content.company}` : content.company;
    
    slide.addText(content.author || "", { x: 1.2, y: 4.0, w: 7.6, h: 0.4, fontSize: 14, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
    if (roleCompany) {
        slide.addText(roleCompany, { x: 1.2, y: 4.4, w: 7.6, h: 0.35, fontSize: 12, fontFace: FONTS.body, color: COLORS.textLight });
    }
});

// ─── 8. before-after-split (Before/After 左右分割カード) ───
registerLayout("before-after-split", (pres, slide, content) => {
    const before = content.before || {}; const after = content.after || {};
    const panelY = 1.2; const panelH = 3.8; const panelW = 4.6; const leftX = 0.3; const rightX = 5.1;
    
    slide.addShape(pres.shapes.RECTANGLE, { x: leftX, y: panelY, w: panelW, h: panelH, fill: { color: COLORS.primary }, rectRadius: 0.08 });
    slide.addText(before.title || "現状の問題点", { x: leftX + 0.3, y: panelY + 0.2, w: panelW - 0.6, h: 0.45, fontSize: 16, fontFace: FONTS.heading, color: COLORS.white, bold: true });
    if (Array.isArray(before.points)) {
        const bulletText = before.points.map((p) => `\u2022  ${p}`).join("\n");
        slide.addText(bulletText, { x: leftX + 0.3, y: panelY + 0.8, w: panelW - 0.6, h: panelH - 1.1, fontSize: 11, fontFace: FONTS.body, color: COLORS.white, lineSpacingMultiple: 1.5, valign: "top" });
    }
    
    slide.addShape(pres.shapes.RECTANGLE, { x: rightX, y: panelY, w: panelW, h: panelH, fill: { color: COLORS.bgLight }, rectRadius: 0.08 });
    slide.addText(after.title || "解決後の効果", { x: rightX + 0.3, y: panelY + 0.2, w: panelW - 0.6, h: 0.45, fontSize: 16, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
    if (Array.isArray(after.points)) {
        const bulletText = after.points.map((p) => `\u2022  ${p}`).join("\n");
        slide.addText(bulletText, { x: rightX + 0.3, y: panelY + 0.8, w: panelW - 0.6, h: panelH - 1.1, fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark, lineSpacingMultiple: 1.5, valign: "top" });
    }
});

// ─── 9. three-column (3カラム解説カード) ───
registerLayout("three-column", (pres, slide, content) => {
    const columns = content.columns || []; const count = Math.min(columns.length, 3);
    const colW = 2.9; const startX = 0.3; const gap = 0.3;
    columns.forEach((col, i) => {
        if (i >= count) return;
        const x = startX + i * (colW + gap);
        slide.addText(col.heading || "", { x, y: 1.2, w: colW, h: 0.45, fontSize: 16, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center" });
        slide.addShape(pres.shapes.LINE, { x: x + 0.3, y: 1.7, w: colW - 0.6, h: 0, line: { color: COLORS.secondary, width: 2 } });
        slide.addText(col.body || "", { x, y: 1.85, w: colW, h: 2.8, fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark, lineSpacingMultiple: 1.4, valign: "top", align: "center" });
    });
});

// ─── 10. funnel (逆コーン型 5段階ファンネル図解) ───
registerLayout("funnel", (pres, slide, content) => {
    const steps = content.steps || []; const count = Math.min(steps.length, 5);
    const funnelColors = ["3B82F6", "2563EB", "1D4ED8", "1E40AF", "1E3A8A"];
    
    if (content.heading) { slide.addText(content.heading, { x: 0.5, y: 1.0, w: 4.0, h: 0.5, fontSize: 18, fontFace: FONTS.heading, color: COLORS.textDark, bold: true }); }
    if (content.body) { slide.addText(content.body, { x: 0.5, y: 1.6, w: 4.0, h: 3.0, fontSize: 12, fontFace: FONTS.body, color: COLORS.textDark, lineSpacingMultiple: 1.4, valign: "top" }); }
    
    const cx = 7.2; const funnelStartY = 1.0; const stepH = count > 0 ? 3.6 / count : 0.8;
    steps.forEach((step, i) => {
        if (i >= count) return;
        const maxW = 4.5; const w = maxW - i * (maxW / (count + 1)); const y = funnelStartY + i * stepH;
        slide.addShape(pres.shapes.RECTANGLE, { x: cx - w / 2, y, w, h: stepH * 0.85, fill: { color: funnelColors[i % funnelColors.length] } });
        slide.addText(step.label || "", { x: cx - w / 2, y, w, h: stepH * 0.85, fontSize: 12, fontFace: FONTS.heading, color: COLORS.white, bold: true, align: "center", valign: "middle" });
    });
});

// ─── 11. matrix (2×2 マトリクス分類図解) ───
registerLayout("matrix", (pres, slide, content) => {
    const labelX = content.labelX || "X軸ラベル";
    const labelY = content.labelY || "Y軸ラベル";
    
    // 軸ラベル
    slide.addText(`← ${labelX.min}　　　　　　　　${labelX.max} →`, {
        x: 1.5, y: 4.5, w: 7.0, h: 0.4,
        fontSize: 16, fontFace: FONTS.heading, bold: true, color: COLORS.textDark, align: "center",
    });
    slide.addText("高", { x: 1.0, y: 1.0, w: 0.5, h: 0.4, fontSize: 14, fontFace: FONTS.heading, bold: true, color: COLORS.textDark, align: "center" });
    slide.addText("低", { x: 1.0, y: 3.5, w: 0.5, h: 0.4, fontSize: 14, fontFace: FONTS.heading, bold: true, color: COLORS.textDark, align: "center" });
    
    slide.addText(labelY.title || "Y軸", {
        x: 0.3, y: 1.2, w: 0.5, h: 3.0,
        fontSize: 12, fontFace: FONTS.heading, bold: true, color: COLORS.textDark, align: "center",
    });

    // 4セル
    // 左上
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 1.0, w: 3.5, h: 1.7, fill: { color: "FFE8E8" }, line: { color: COLORS.accent, width: 2 } });
    slide.addText(content.lt || "左上領域", { x: 1.5, y: 1.0, w: 3.5, h: 1.7, fontSize: 16, fontFace: FONTS.heading, bold: true, color: COLORS.accent, align: "center" });

    // 右上 (主目的・成功領域)
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.0, w: 4.5, h: 1.7, fill: { color: "E8F5E9" }, line: { color: COLORS.success, width: 2 } });
    slide.addText(content.rt || "右上領域\n(理想・最大効果)", { x: 5.0, y: 1.0, w: 4.5, h: 1.7, fontSize: 18, fontFace: FONTS.heading, bold: true, color: COLORS.success, align: "center" });

    // 左下
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 2.7, w: 3.5, h: 1.7, fill: { color: "F1F5F9" }, line: { color: COLORS.textLight, width: 2 } });
    slide.addText(content.lb || "左下領域", { x: 1.5, y: 2.7, w: 3.5, h: 1.7, fontSize: 16, fontFace: FONTS.heading, bold: true, color: COLORS.textLight, align: "center" });

    // 右下
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 2.7, w: 4.5, h: 1.7, fill: { color: "E3F2FD" }, line: { color: COLORS.secondary, width: 2 } });
    slide.addText(content.rb || "右下領域", { x: 5.0, y: 2.7, w: 4.5, h: 1.7, fontSize: 16, fontFace: FONTS.heading, bold: true, color: COLORS.secondary, align: "center" });
});

// ─── 12. pyramid (3段階〜ピラミッド積層階層図) ───
registerLayout("pyramid", (pres, slide, content) => {
    const lines = content.text ? content.text.split("\n").filter(l => l.trim()) : [];
    const levels = [];

    lines.forEach((line) => {
        const match = line.match(/(?:Lv|レベル|STEP|ステップ)\s*(\d+)[\s:：]*(.+)/i);
        if (match) {
            levels.push({ num: parseInt(match[1]), label: match[2].trim() });
        }
    });

    if (levels.length > 0) {
        levels.sort((a, b) => a.num - b.num);
        const count = levels.length;
        const colors = ["2563EB", "3B82F6", "60A5FA", "93C5FD", "BFDBFE"];
        const maxW = 5.0;
        const minW = 1.0;
        const layerH = Math.min(0.45, 3.5 / count);
        const startY = 1.0;

        levels.reverse().forEach((lv, i) => {
            const w = minW + (maxW - minW) * (i / Math.max(count - 1, 1));
            const x = 0.5 + (maxW - w) / 2;
            const y = startY + i * layerH;
            const color = colors[i % colors.length];

            slide.addShape(pres.shapes.RECTANGLE, {
                x, y, w, h: layerH - 0.03,
                fill: { color },
            });

            slide.addText(`${lv.label}`, {
                x, y, w, h: layerH - 0.03,
                fontSize: 20, fontFace: FONTS.heading,
                color: COLORS.white, bold: true,
                align: "center", valign: "middle",
            });
        });
    }
});

// ─── 13. line-chart (折れ線グラフ) ───
registerLayout("line-chart", (pres, slide, content) => {
    if (content.data) {
        const chartData = [{
            name: content.data.name || "推移",
            labels: content.data.labels || [],
            values: content.data.values || [],
        }];
        slide.addChart(pres.charts.LINE, chartData, {
            x: 0.5, y: 1.0, w: 9.0, h: 3.8,
            showTitle: false,
            lineDataSymbol: "circle",
            lineDataSymbolSize: 8,
            chartColors: [COLORS.secondary],
            valAxisMinVal: content.minVal || 0,
            valAxisMaxVal: content.maxVal || undefined,
            catAxisOrientation: "minMax",
            showLegend: false,
            gridLineColor: COLORS.border,
        });
    }
});

// ─── 14. numbered-feature-cards (アクセント付き解説カード 3カラム) ───
registerLayout("numbered-feature-cards", (pres, slide, content) => {
    const items = content.items || [];
    const count = Math.min(items.length, 3);
    const colW = 2.9; const startX = 0.3; const gap = 0.3;
    const cardY = 1.1; const cardH = 3.8;
    
    items.forEach((item, i) => {
        if (i >= count) return;
        const x = startX + i * (colW + gap);
        const num = String(i + 1).padStart(2, "0");
        
        topBorderCard(slide, pres, { x, y: cardY, w: colW, h: cardH, borderColor: COLORS.secondary });
        slide.addText(num, { x, y: cardY + 0.15, w: colW, h: 0.65, fontSize: 32, fontFace: FONTS.accent, color: COLORS.secondary, bold: true, align: "center", valign: "middle" });
        slide.addText(item.title || "", { x: x + 0.15, y: cardY + 0.9, w: colW - 0.3, h: 0.5, fontSize: 14, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center", valign: "middle" });
        slide.addText(item.description || "", { x: x + 0.15, y: cardY + 1.5, w: colW - 0.3, h: cardH - 1.8, fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark, lineSpacingMultiple: 1.4, valign: "top", align: "left" });
    });
});

// ============================================================
// エクスポート
// ============================================================

module.exports = {
    renderDeck,
    renderSlide,
    registerLayout,
};
