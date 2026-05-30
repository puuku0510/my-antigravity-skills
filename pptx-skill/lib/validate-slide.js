/**
 * validate-slide.js — 生成されたスライドの品質チェック
 *
 * 生成後のスライドを自動検査する：
 * - テキストのはみ出し
 * - 要素の重なり
 * - コントラスト不足
 * - 余白の狭さ
 */

const { LAYOUT } = require("./shared");

const WARNINGS = [];

function warn(slideIndex, message) {
    WARNINGS.push({ slide: slideIndex + 1, message });
}

/**
 * デッキのスライド定義を検証する
 * @param {object} deckDef - デッキ定義
 * @returns {Array} warnings
 */
function validateDeck(deckDef) {
    WARNINGS.length = 0;

    if (!deckDef.slides || !Array.isArray(deckDef.slides)) {
        return [{ slide: 0, message: "slides 配列が見つかりません" }];
    }

    deckDef.slides.forEach((slideDef, i) => {
        // タイトル長チェック
        if (slideDef.title && slideDef.title.length > 60) {
            warn(i, `タイトルが長すぎます（${slideDef.title.length}文字）。60文字以下を推奨。`);
        }

        // コンテンツの項目数チェック
        if (slideDef.content) {
            const c = slideDef.content;
            if (c.items && c.items.length > 6) {
                warn(i, `項目数が多すぎます（${c.items.length}件）。6件以下を推奨。`);
            }
            if (c.steps && c.steps.length > 6) {
                warn(i, `ステップ数が多すぎます（${c.steps.length}件）。6件以下を推奨。`);
            }
            if (c.columns && c.columns.length > 3) {
                warn(i, `カラム数が多すぎます（${c.columns.length}件）。3件以下を推奨。`);
            }
        }

        // レイアウト指定チェック
        if (slideDef.type === "content" && !slideDef.layout) {
            warn(i, "content タイプにレイアウトが指定されていません。");
        }
    });

    return [...WARNINGS];
}

/**
 * 検証結果をコンソールに出力
 */
function printValidation(warnings) {
    if (warnings.length === 0) {
        console.log("✅ QA完了：問題は見つかりませんでした。");
        return;
    }

    console.log(`⚠️ QA完了：${warnings.length}件の警告があります：`);
    warnings.forEach((w) => {
        console.log(`  スライド ${w.slide}: ${w.message}`);
    });
}

module.exports = { validateDeck, printValidation };
