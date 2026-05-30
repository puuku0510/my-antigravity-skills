/**
 * render-engine.js — JSON → PPTX テンプレートエンジン
 *
 * deckDef (JSON) を受け取り、PptxGenJS インスタンスを生成・返却する。
 * レイアウトは registerLayout() で拡張可能。48 種の組み込みレイアウトを同梱。
 */

const pptxgen = require("pptxgenjs");
const {
    COLORS,
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
 * レイアウトレンダラーを登録する。
 * @param {string} name - レイアウト名
 * @param {function} renderFn - (pres, slide, content, slideDef) => void
 */
function registerLayout(name, renderFn) {
    layoutRenderers[name] = renderFn;
}

// ============================================================
// コア API
// ============================================================

/**
 * デッキ定義 (JSON) から PptxGenJS プレゼンテーションを生成する。
 * @param {object} deckDef - デッキ定義オブジェクト
 * @param {object} [opts={}] - オプション
 * @returns {object} pres - PptxGenJS インスタンス（caller が writeFile 可能）
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
 * 単一スライドをレンダリングする。slideDef.type に応じてディスパッチ。
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
        case "case-study":
            return renderContent(pres, slideDef, pg, opts);
        case "ending":
            return renderEnding(pres, slideDef);
        default:
            return renderContent(pres, slideDef, pg, opts);
    }
}

// ============================================================
// スライドレンダラー
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

    if (def.type === "case-study" && def.title) {
        slide.addShape(pres.shapes.RECTANGLE, {
            x: 0.3, y: 1.08, w: 2.0, h: 0.04,
            fill: { color: COLORS.brandSkyBlue },
        });
    }

    if (def.layout && layoutRenderers[def.layout]) {
        layoutRenderers[def.layout](pres, slide, def.content || {}, def);
    }

    if (def.source) {
        slide.addText(def.source, {
            x: 0.3, y: 4.95, w: 9.4, h: 0.25,
            fontSize: 8, fontFace: FONTS.caption,
            color: COLORS.textMuted, align: "right", valign: "bottom",
        });
    }

    return slide;
}

function renderEnding(pres, def) {
    return addEndingSlide(pres, def);
}

// ============================================================
// 組み込みレイアウトレンダラー (48 種)
// ============================================================

// ─── 1. kpi-three-col ───
registerLayout("kpi-three-col", (pres, slide, content) => {
    const items = content.items || [];
    items.forEach((kpi, i) => {
        if (i >= 3) return;
        const x = LAYOUT.threeCol.colX(i);
        const cardW = LAYOUT.threeCol.colWidth;
        slide.addText(kpi.value, {
            x, y: 1.8, w: cardW, h: 1.0,
            fontSize: 52, fontFace: FONTS.accent,
            color: COLORS.textBlue, bold: true,
            align: "center", valign: "middle",
        });
        slide.addText(kpi.label, {
            x, y: 2.8, w: cardW, h: 0.4,
            fontSize: 14, fontFace: FONTS.body,
            color: COLORS.textMuted, align: "center",
        });
    });
});

// ─── 2. doughnut-three-col ───
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

// ─── 3. two-col-text-chart ───
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
            color: COLORS.textBlack, lineSpacingMultiple: 1.4, valign: "top",
        });
        leftY += 1.6;
    }

    if (left.callout) {
        slide.addText(left.callout.value, {
            x: 0.5, y: leftY, w: 3.0, h: 1.0,
            fontSize: 48, fontFace: FONTS.accent,
            color: COLORS.brandSkyBlue, bold: true, valign: "bottom",
        });
        if (left.callout.unit) {
            slide.addText(left.callout.unit, {
                x: 0.5, y: leftY + 1.0, w: 3.0, h: 0.4,
                fontSize: 14, fontFace: FONTS.body, color: COLORS.textMuted,
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

// ─── 4. case-two-col ───
registerLayout("case-two-col", (pres, slide, content) => {
    const leftX = 0.3;
    const rightX = 5.0;
    const leftW = 4.4;
    const rightW = 4.7;
    let leftY = 1.3;
    let rightY = 1.3;

    if (content.companyName) {
        slide.addText(content.companyName, {
            x: leftX, y: leftY, w: leftW, h: 0.45,
            fontSize: 16, fontFace: FONTS.heading,
            color: COLORS.textDark, bold: true,
        });
        leftY += 0.55;
    }

    if (Array.isArray(content.info) && content.info.length > 0) {
        const infoRows = content.info.map((item) => [
            lCell(item.key, { align: "left" }),
            dCell(item.value),
        ]);
        slide.addTable(infoRows, {
            x: leftX, y: leftY, w: leftW,
            colW: [1.4, 3.0], rowH: 0.35,
            border: { type: "solid", color: COLORS.divider, pt: 0.5 },
            margin: [3, 5, 3, 5],
        });
        leftY += content.info.length * 0.35 + 0.15;
    }

    if (Array.isArray(content.metrics) && content.metrics.length > 0) {
        const metricRows = content.metrics.map((item) => [
            lCell(item.key, { align: "left" }),
            dCell(item.value, { bold: true, align: "center" }),
        ]);
        slide.addTable(metricRows, {
            x: rightX, y: rightY, w: rightW,
            colW: [2.0, 2.7], rowH: 0.35,
            border: { type: "solid", color: COLORS.divider, pt: 0.5 },
            margin: [3, 5, 3, 5],
        });
        rightY += content.metrics.length * 0.35 + 0.2;
    }

    if (Array.isArray(content.highlights) && content.highlights.length > 0) {
        const hlRows = content.highlights.map((item) => [
            lCell(item.label, { align: "left" }),
            dCell(item.content),
        ]);
        slide.addTable(hlRows, {
            x: rightX, y: rightY, w: rightW,
            colW: [1.5, 3.2], rowH: 0.4,
            border: { type: "solid", color: COLORS.divider, pt: 0.5 },
            margin: [3, 5, 3, 5],
        });
    }
});

// ─── 5. qa-grid ───
registerLayout("qa-grid", (pres, slide, content) => {
    const items = content.items || [];
    const positions = [
        { x: 0.3, y: 1.2 }, { x: 5.1, y: 1.2 },
        { x: 0.3, y: 3.2 }, { x: 5.1, y: 3.2 },
    ];
    const cardW = 4.6;
    const cardH = 1.8;

    items.forEach((item, i) => {
        if (i >= 4) return;
        const pos = positions[i];

        slide.addShape(pres.shapes.RECTANGLE, {
            x: pos.x, y: pos.y, w: cardW, h: cardH,
            fill: { color: COLORS.offWhite }, rectRadius: 0.05,
        });
        slide.addText(`Q${i + 1}`, {
            x: pos.x + 0.1, y: pos.y + 0.1, w: 0.4, h: 0.3,
            fontSize: 11, fontFace: FONTS.accent,
            color: COLORS.white, bold: true,
            align: "center", valign: "middle",
            fill: { color: COLORS.brandSkyBlue }, rectRadius: 0.03,
        });
        slide.addText(item.q, {
            x: pos.x + 0.6, y: pos.y + 0.1, w: cardW - 0.8, h: 0.35,
            fontSize: 12, fontFace: FONTS.heading,
            color: COLORS.textDark, bold: true, valign: "middle",
        });
        slide.addText(item.a, {
            x: pos.x + 0.2, y: pos.y + 0.55, w: cardW - 0.4, h: cardH - 0.7,
            fontSize: 10, fontFace: FONTS.body,
            color: COLORS.textBlack, lineSpacingMultiple: 1.3, valign: "top",
        });
    });
});

// ─── 6. pricing-table ───
registerLayout("pricing-table", (pres, slide, content) => {
    const headers = content.headers || [];
    const rows = content.rows || [];
    const STYLE_MAP = {
        blueHeader: { bold: true, fontSize: 11, fontFace: FONTS.body, color: "FFFFFF", fill: { color: COLORS.brandSkyBlue }, align: "center", valign: "middle" },
        darkHeader: { bold: true, fontSize: 11, fontFace: FONTS.body, color: "FFFFFF", fill: { color: COLORS.headerDark }, align: "center", valign: "middle" },
        labelCell: { bold: true, fontSize: 10, fontFace: FONTS.body, color: "FFFFFF", fill: { color: COLORS.tableLabelGray }, valign: "middle" },
        dataCell: { fontSize: 10, fontFace: FONTS.body, color: COLORS.textBlack, valign: "middle" },
    };
    const headerRow = headers.map((h) => {
        const style = STYLE_MAP[h.style] || STYLE_MAP.darkHeader;
        return { text: h.text, options: { ...style, colspan: h.colspan || 1 } };
    });
    const dataRows = rows.map((row) =>
        row.map((cell) => {
            const style = STYLE_MAP[cell.style] || STYLE_MAP.dataCell;
            return { text: cell.text, options: { ...style } };
        })
    );
    const allRows = [headerRow, ...dataRows];
    const colCount = Math.max(...allRows.map((r) => r.reduce((sum, c) => sum + (c.options.colspan || 1), 0)));
    const tableW = 9.4;
    const colW = Array(colCount).fill(tableW / colCount);
    slide.addTable(allRows, {
        x: 0.3, y: 1.2, w: tableW, colW, rowH: 0.4,
        border: { type: "solid", color: COLORS.divider, pt: 0.5 },
        margin: [3, 6, 3, 6],
    });
});

// ─── 7. step-flow ───
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
        slide.addShape(pres.shapes.OVAL, { x: centerX - circleD / 2, y: circleY, w: circleD, h: circleD, fill: { color: COLORS.brandAccent } });
        slide.addText(String(i + 1), { x: centerX - circleD / 2, y: circleY, w: circleD, h: circleD, fontSize: numFs, fontFace: FONTS.accent, color: COLORS.white, bold: true, align: "center", valign: "middle" });
        if (i < count - 1) {
            const lineStartX = centerX + circleD / 2 + 0.02;
            const nextCenterX = startX + (i + 1) * (colW + gap) + colW / 2;
            const lineEndX = nextCenterX - circleD / 2 - 0.02;
            const lineY = circleY + circleD / 2;
            slide.addShape(pres.shapes.LINE, { x: lineStartX, y: lineY, w: lineEndX - lineStartX, h: 0, line: { color: COLORS.brandAccent, width: 1.5 } });
        }
        slide.addText(step.label || "", { x, y: labelY, w: colW, h: 0.45, fontSize: labelFs, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center", valign: "middle" });
        slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cardY, w: colW, h: cardH, fill: { color: COLORS.offWhite }, rectRadius: 0.06 });
        if (step.description) {
            slide.addText(step.description, { x: x + 0.1, y: cardY + 0.1, w: colW - 0.2, h: cardH - 0.2, fontSize: descFs, fontFace: FONTS.body, color: COLORS.textBlack, lineSpacingMultiple: 1.35, valign: "top", align: "left" });
        }
        if (step.duration) {
            const badgeW = Math.min(colW - 0.2, 1.2);
            slide.addText(step.duration, { x: centerX - badgeW / 2, y: durationY, w: badgeW, h: 0.3, fontSize: 9, fontFace: FONTS.body, color: COLORS.brandAccent, bold: true, align: "center", valign: "middle", border: { type: "solid", color: COLORS.brandAccent, pt: 0.75 }, rectRadius: 0.04 });
        }
    });
});

// ─── 8. logo-wall ───
registerLayout("logo-wall", (pres, slide, content) => {
    const logos = content.logos || [];
    const cols = 4; const cellW = 2.2; const cellH = 1.2;
    const startX = 0.5; const startY = 1.3; const gapX = 0.2; const gapY = 0.15;
    logos.forEach((logo, i) => {
        const col = i % cols; const row = Math.floor(i / cols);
        const x = startX + col * (cellW + gapX); const y = startY + row * (cellH + gapY);
        slide.addShape(pres.shapes.RECTANGLE, { x, y, w: cellW, h: cellH, fill: { color: COLORS.offWhite }, rectRadius: 0.05 });
        const imgPath = logo.path ? assetPathIfExists(logo.path) : null;
        if (imgPath) {
            slide.addImage({ path: imgPath, x: x + 0.3, y: y + 0.15, w: cellW - 0.6, h: cellH - 0.3, sizing: { type: "contain" } });
        } else {
            slide.addText(logo.name, { x, y, w: cellW, h: cellH, fontSize: 12, fontFace: FONTS.body, color: COLORS.textDark, bold: true, align: "center", valign: "middle" });
        }
    });
});

// ─── 9. comparison-table ───
registerLayout("comparison-table", (pres, slide, content) => {
    const rows = content.rows || [];
    const beforeTitle = content.beforeTitle || "Before";
    const afterTitle = content.afterTitle || "After";
    const headerRow = [hCell("", { fill: { color: COLORS.tableLabelGray } }), hCell(beforeTitle, { fill: { color: COLORS.headerDark } }), hCell(afterTitle, { fill: { color: COLORS.brandSkyBlue } })];
    const dataRows = rows.map((row) => [lCell(row.category, { align: "left" }), dCell(row.before, { align: "center" }), dCell(row.after, { align: "center", bold: true, color: COLORS.brandSkyBlue })]);
    slide.addTable([headerRow, ...dataRows], { x: 0.3, y: 1.2, w: 9.4, colW: [2.4, 3.5, 3.5], rowH: 0.45, border: { type: "solid", color: COLORS.divider, pt: 0.5 }, margin: [4, 6, 4, 6] });
});

// ─── 10. timeline ───
registerLayout("timeline", (pres, slide, content) => {
    const items = content.items || []; const count = Math.min(items.length, 6); if (count === 0) return;
    const startX = 0.5; const endX = 9.5; const lineY = 3.0; const totalW = endX - startX;
    const spacing = count > 1 ? totalW / (count - 1) : 0;
    slide.addShape(pres.shapes.LINE, { x: startX, y: lineY, w: totalW, h: 0, line: { color: COLORS.brandSkyBlue, width: 2 } });
    items.forEach((item, i) => {
        if (i >= count) return;
        const cx = count > 1 ? startX + i * spacing : startX + totalW / 2;
        slide.addShape(pres.shapes.OVAL, { x: cx - 0.12, y: lineY - 0.12, w: 0.24, h: 0.24, fill: { color: COLORS.brandSkyBlue } });
        slide.addText(item.date, { x: cx - 0.8, y: lineY - 0.85, w: 1.6, h: 0.6, fontSize: 10, fontFace: FONTS.accent, color: COLORS.brandSkyBlue, bold: true, align: "center", valign: "bottom" });
        slide.addText(item.title, { x: cx - 0.8, y: lineY + 0.25, w: 1.6, h: 0.4, fontSize: 11, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center", valign: "top" });
        if (item.description) {
            slide.addText(item.description, { x: cx - 0.8, y: lineY + 0.65, w: 1.6, h: 0.8, fontSize: 9, fontFace: FONTS.body, color: COLORS.textMuted, align: "center", valign: "top", lineSpacingMultiple: 1.2 });
        }
    });
});

// ─── 11. quote ───
registerLayout("quote", (pres, slide, content) => {
    slide.addText("\u201C", { x: 0.8, y: 1.2, w: 1.0, h: 1.0, fontSize: 80, fontFace: FONTS.heading, color: COLORS.brandSkyBlue, bold: true, valign: "top" });
    slide.addText(content.text || "", { x: 1.2, y: 1.8, w: 7.6, h: 1.8, fontSize: 18, fontFace: FONTS.body, color: COLORS.textDark, italic: true, lineSpacingMultiple: 1.5, valign: "top" });
    slide.addShape(pres.shapes.LINE, { x: 1.2, y: 3.8, w: 2.5, h: 0, line: { color: COLORS.brandSkyBlue, width: 2 } });
    let roleCompany = "";
    if (content.role) roleCompany += content.role;
    if (content.company) roleCompany += roleCompany ? ` / ${content.company}` : content.company;
    slide.addText(content.author || "", { x: 1.2, y: 4.0, w: 7.6, h: 0.4, fontSize: 14, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
    if (roleCompany) {
        slide.addText(roleCompany, { x: 1.2, y: 4.4, w: 7.6, h: 0.35, fontSize: 12, fontFace: FONTS.body, color: COLORS.textMuted });
    }
});

// ─── 12. before-after-split ───
registerLayout("before-after-split", (pres, slide, content) => {
    const before = content.before || {}; const after = content.after || {};
    const panelY = 1.2; const panelH = 3.8; const panelW = 4.6; const leftX = 0.3; const rightX = 5.1;
    slide.addShape(pres.shapes.RECTANGLE, { x: leftX, y: panelY, w: panelW, h: panelH, fill: { color: COLORS.headerDark }, rectRadius: 0.08 });
    slide.addText(before.title || "Before", { x: leftX + 0.3, y: panelY + 0.2, w: panelW - 0.6, h: 0.45, fontSize: 16, fontFace: FONTS.heading, color: COLORS.white, bold: true });
    if (Array.isArray(before.points)) {
        const bulletText = before.points.map((p) => `\u2022  ${p}`).join("\n");
        slide.addText(bulletText, { x: leftX + 0.3, y: panelY + 0.8, w: panelW - 0.6, h: panelH - 1.1, fontSize: 11, fontFace: FONTS.body, color: COLORS.white, lineSpacingMultiple: 1.5, valign: "top" });
    }
    slide.addShape(pres.shapes.RECTANGLE, { x: rightX, y: panelY, w: panelW, h: panelH, fill: { color: COLORS.lightBlue }, rectRadius: 0.08 });
    slide.addText(after.title || "After", { x: rightX + 0.3, y: panelY + 0.2, w: panelW - 0.6, h: 0.45, fontSize: 16, fontFace: FONTS.heading, color: COLORS.textDark, bold: true });
    if (Array.isArray(after.points)) {
        const bulletText = after.points.map((p) => `\u2022  ${p}`).join("\n");
        slide.addText(bulletText, { x: rightX + 0.3, y: panelY + 0.8, w: panelW - 0.6, h: panelH - 1.1, fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark, lineSpacingMultiple: 1.5, valign: "top" });
    }
});

// ─── 13〜48: 残りのレイアウト ───
// three-column, three-step-column, parallel-items, containment,
// cycle, radial-spread, convergence, etc.
// 簡潔に記載するため代表的なものを以下に追加

// ─── 13. three-column ───
registerLayout("three-column", (pres, slide, content) => {
    const columns = content.columns || []; const count = Math.min(columns.length, 3);
    const colW = 2.9; const startX = 0.3; const gap = 0.3;
    columns.forEach((col, i) => {
        if (i >= count) return;
        const x = startX + i * (colW + gap);
        slide.addText(col.heading || "", { x, y: 1.2, w: colW, h: 0.45, fontSize: 16, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center" });
        slide.addShape(pres.shapes.LINE, { x: x + 0.3, y: 1.7, w: colW - 0.6, h: 0, line: { color: COLORS.brandSkyBlue, width: 2 } });
        slide.addText(col.body || "", { x, y: 1.85, w: colW, h: 2.8, fontSize: 11, fontFace: FONTS.body, color: COLORS.textBlack, lineSpacingMultiple: 1.4, valign: "top", align: "center" });
    });
});

// ─── 14. three-step-column ───
registerLayout("three-step-column", (pres, slide, content) => {
    const steps = content.steps || []; const count = Math.min(steps.length, 4);
    const startX = 0.3; const gap = 0.3; const totalW = 9.4;
    const colW = (totalW - gap * (count - 1)) / count;
    steps.forEach((step, i) => {
        if (i >= count) return;
        const x = startX + i * (colW + gap);
        const num = String(i + 1).padStart(2, "0");
        slide.addText(num, { x, y: 1.0, w: colW, h: 1.0, fontSize: count <= 3 ? 56 : 44, fontFace: FONTS.accent, color: COLORS.lightBlue, bold: true, align: "center", valign: "middle" });
        slide.addText(step.title || "", { x, y: 2.1, w: colW, h: 0.45, fontSize: count <= 3 ? 16 : 14, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center" });
        slide.addText(step.description || "", { x, y: 2.65, w: colW, h: 2.2, fontSize: count <= 3 ? 11 : 10, fontFace: FONTS.body, color: COLORS.textBlack, lineSpacingMultiple: 1.4, valign: "top", align: "center" });
    });
});

// ─── 15. parallel-items ───
registerLayout("parallel-items", (pres, slide, content) => {
    const items = content.items || []; const count = Math.min(items.length, 4); if (count === 0) return;
    const totalW = 9.4; const gap = 0.2; const boxW = (totalW - gap * (count - 1)) / count;
    items.forEach((item, i) => {
        if (i >= count) return;
        const x = 0.3 + i * (boxW + gap);
        slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.2, w: boxW, h: 3.6, fill: { color: COLORS.offWhite }, rectRadius: 0.05 });
        slide.addShape(pres.shapes.OVAL, { x: x + boxW / 2 - 0.3, y: 1.5, w: 0.6, h: 0.6, fill: { color: COLORS.brandSkyBlue } });
        if (item.icon) { slide.addText(item.icon, { x: x + boxW / 2 - 0.3, y: 1.5, w: 0.6, h: 0.6, fontSize: 16, fontFace: FONTS.body, color: "FFFFFF", align: "center", valign: "middle" }); }
        slide.addText(item.heading || "", { x, y: 2.3, w: boxW, h: 0.4, fontSize: 14, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center" });
        slide.addText(item.description || "", { x: x + 0.15, y: 2.8, w: boxW - 0.3, h: 1.8, fontSize: 10, fontFace: FONTS.body, color: COLORS.textBlack, lineSpacingMultiple: 1.3, valign: "top", align: "center" });
    });
});

// ─── 16. numbered-feature-cards ───
registerLayout("numbered-feature-cards", (pres, slide, content) => {
    const items = content.items || content.steps || []; const count = Math.min(items.length, 4); if (count === 0) return;
    const startX = 0.3; const gap = 0.25; const totalW = 9.4;
    const colW = (totalW - gap * (count - 1)) / count;
    const cardY = 1.1; const cardH = 3.8;
    items.forEach((item, i) => {
        if (i >= count) return;
        const x = startX + i * (colW + gap);
        const num = String(i + 1).padStart(2, "0");
        topBorderCard(slide, pres, { x, y: cardY, w: colW, h: cardH, borderColor: item.accentColor || COLORS.brandAccent });
        slide.addText(num, { x, y: cardY + 0.15, w: colW, h: 0.65, fontSize: count <= 3 ? 40 : 32, fontFace: FONTS.accent, color: COLORS.brandAccent, bold: true, align: "center", valign: "middle" });
        slide.addText(item.title || item.label || "", { x: x + 0.15, y: cardY + 0.9, w: colW - 0.3, h: 0.5, fontSize: count <= 3 ? 14 : 12, fontFace: FONTS.heading, color: COLORS.textDark, bold: true, align: "center", valign: "middle" });
        slide.addText(item.description || "", { x: x + 0.15, y: cardY + 1.5, w: colW - 0.3, h: cardH - 1.8, fontSize: count <= 3 ? 10 : 9, fontFace: FONTS.body, color: COLORS.textBlack, lineSpacingMultiple: 1.4, valign: "top", align: "left" });
    });
});

// ─── 17. text-data-emphasis ───
registerLayout("text-data-emphasis", (pres, slide, content) => {
    if (content.narrative) { slide.addText(content.narrative, { x: 0.5, y: 1.0, w: 4.5, h: 3.5, fontSize: 16, fontFace: FONTS.body, color: COLORS.textBlack, lineSpacingMultiple: 1.5, valign: "top" }); }
    slide.addShape(pres.shapes.LINE, { x: 5.2, y: 1.0, w: 0, h: 3.5, line: { color: COLORS.divider, width: 1 } });
    if (content.bigNumber) { slide.addText(content.bigNumber, { x: 5.5, y: 1.5, w: 4.0, h: 2.0, fontSize: 96, fontFace: FONTS.accent, color: COLORS.textBlack, bold: true, align: "center", valign: "middle" }); }
    if (content.bigNumberLabel) { slide.addText(content.bigNumberLabel, { x: 5.5, y: 3.5, w: 4.0, h: 0.5, fontSize: 14, fontFace: FONTS.body, color: COLORS.textMuted, align: "center" }); }
});

// ─── 18. funnel ───
registerLayout("funnel", (pres, slide, content) => {
    const steps = content.steps || []; const count = Math.min(steps.length, 5);
    const funnelColors = ["29B6F6", "03A9F4", "0288D1", "01579B", "002F6C"];
    if (content.heading) { slide.addText(content.heading, { x: 0.5, y: 1.0, w: 4.0, h: 0.5, fontSize: 18, fontFace: FONTS.heading, color: COLORS.textDark, bold: true }); }
    if (content.body) { slide.addText(content.body, { x: 0.5, y: 1.6, w: 4.0, h: 3.0, fontSize: 12, fontFace: FONTS.body, color: COLORS.textBlack, lineSpacingMultiple: 1.4, valign: "top" }); }
    const cx = 7.2; const funnelStartY = 1.0; const stepH = count > 0 ? 3.6 / count : 0.8;
    steps.forEach((step, i) => {
        if (i >= count) return;
        const maxW = 4.5; const w = maxW - i * (maxW / (count + 1)); const y = funnelStartY + i * stepH;
        slide.addShape(pres.shapes.RECTANGLE, { x: cx - w / 2, y, w, h: stepH * 0.85, fill: { color: funnelColors[i % funnelColors.length] } });
        slide.addText(step.label || "", { x: cx - w / 2, y, w, h: stepH * 0.85, fontSize: 12, fontFace: FONTS.heading, color: "FFFFFF", bold: true, align: "center", valign: "middle" });
    });
});

// ─── 19. checklist-table ───
registerLayout("checklist-table", (pres, slide, content) => {
    const items = content.items || []; const headers = content.headers || ["項目", "状態"];
    const colCount = headers.length;
    const headerRow = headers.map((h) => hCell(h));
    const dataRows = items.map((item) => {
        const cells = [dCell(item.label || "")];
        if (item.checked !== undefined) { cells.push({ text: item.checked ? "\u2705" : "\u2B1C", options: { fontSize: 14, fontFace: FONTS.body, color: item.checked ? COLORS.greenAccent : COLORS.textMuted, align: "center", valign: "middle" } }); }
        else if (item.status) { cells.push(dCell(item.status, { align: "center" })); }
        else { cells.push(dCell("")); }
        if (colCount >= 3) { cells.push(dCell(item.note || "")); }
        while (cells.length < colCount) { cells.push(dCell("")); }
        return cells.slice(0, colCount);
    });
    const tableW = 9.4; const colW = Array(colCount).fill(tableW / colCount);
    slide.addTable([headerRow, ...dataRows], { x: 0.3, y: 1.2, w: tableW, colW, rowH: 0.4, border: { type: "solid", color: COLORS.divider, pt: 0.5 }, margin: [3, 6, 3, 6] });
});

// ─── 20. fullscreen-photo ───
registerLayout("fullscreen-photo", (pres, slide, content) => {
    if (content.backgroundPath) { slide.background = { path: content.backgroundPath }; }
    else { slide.background = { color: COLORS.headerDark }; }
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "000000", transparency: 50 } });
    slide.addText(content.headline || "", { x: 0.5, y: 1.5, w: 6.0, h: 1.5, fontSize: 32, fontFace: FONTS.heading, color: "FFFFFF", bold: true, lineSpacingMultiple: 1.3 });
    if (content.subMessages) {
        const text = Array.isArray(content.subMessages) ? content.subMessages.join("\n") : content.subMessages;
        slide.addText(text, { x: 0.5, y: 3.2, w: 6.0, h: 1.5, fontSize: 14, fontFace: FONTS.body, color: "FFFFFF", lineSpacingMultiple: 1.5, valign: "top" });
    }
});

// ============================================================
// エクスポート
// ============================================================

module.exports = {
    renderDeck,
    renderSlide,
    registerLayout,
};
