/**
 * sample-deck.js — 全スライド種別を含むサンプルデッキ
 *
 * 使い方: node examples/sample-deck.js
 */

const path = require("path");
const { renderDeck } = require("../lib/render-engine");
const { validateDeck, printValidation } = require("../lib/validate-slide");

const deckDef = {
    author: "KEI IWASAKI",
    slides: [
        // ── 表紙 ──
        {
            type: "cover",
            title: "投資の基本戦略",
            subtitle: "長期・分散・積立の3原則",
            catchphrase: "初心者から上級者まで使える完全ガイド",
            version: "2026年3月版",
        },

        // ── セクション区切り ──
        {
            type: "section",
            title: "第1章：なぜ投資が必要なのか",
            subtitle: "インフレと資産防衛",
        },

        // ── KPI 3カラム ──
        {
            type: "content",
            sectionName: "第1章",
            title: "日本の資産構成（2024年）",
            layout: "kpi-three-col",
            content: {
                items: [
                    { value: "54%", label: "現金・預金" },
                    { value: "15%", label: "株式・投信" },
                    { value: "31%", label: "その他" },
                ],
            },
        },

        // ── ステップフロー ──
        {
            type: "content",
            sectionName: "第1章",
            title: "資産形成の5ステップ",
            layout: "step-flow",
            content: {
                steps: [
                    { label: "支出を把握", description: "家計簿アプリで3ヶ月記録する", duration: "1ヶ月" },
                    { label: "生活防衛資金", description: "生活費6ヶ月分を確保する", duration: "3ヶ月" },
                    { label: "投資開始", description: "つみたてNISAから始める", duration: "初年度" },
                    { label: "リバランス", description: "年1回ポートフォリオを見直す", duration: "毎年" },
                ],
            },
        },

        // ── 引用 ──
        {
            type: "content",
            sectionName: "第1章",
            title: "",
            layout: "quote",
            content: {
                text: "人生は雪だるまと同じだ。大事なのは、十分に湿った雪と、長い坂道を見つけることだ。",
                author: "ウォーレン・バフェット",
                role: "バークシャー・ハサウェイ CEO",
                company: "",
            },
        },

        // ── Before / After ──
        {
            type: "content",
            sectionName: "第2章",
            title: "投資する人 vs しない人",
            layout: "before-after-split",
            content: {
                before: {
                    title: "投資しない場合",
                    points: [
                        "預金金利 0.001% で30年",
                        "1,000万円 → 1,000万3,000円",
                        "インフレで実質目減り",
                    ],
                },
                after: {
                    title: "年利5%で投資した場合",
                    points: [
                        "S&P 500 の過去平均リターン",
                        "1,000万円 → 4,321万円",
                        "複利の力で資産が4倍以上に",
                    ],
                },
            },
        },

        // ── 3カラム ──
        {
            type: "content",
            sectionName: "第2章",
            title: "3つの投資原則",
            layout: "three-column",
            content: {
                columns: [
                    { heading: "長期", body: "最低10年以上のスパンで考える。短期の値動きに一喜一憂しない。" },
                    { heading: "分散", body: "1つの銘柄に集中しない。国・業種・資産クラスを分散する。" },
                    { heading: "積立", body: "毎月一定額を自動で投資。ドルコスト平均法でリスクを平準化。" },
                ],
            },
        },

        // ── タイムライン ──
        {
            type: "content",
            sectionName: "第3章",
            title: "バフェットの投資人生",
            layout: "timeline",
            content: {
                items: [
                    { date: "1941", title: "初の株式購入", description: "11歳でシティーズ・サービス株を購入" },
                    { date: "1965", title: "バークシャー取得", description: "繊維会社を買収し、投資会社へ転換" },
                    { date: "2008", title: "リーマンショック", description: "ゴールドマンに7,500億円投資" },
                    { date: "2025", title: "引退表明", description: "最後の株主への手紙を公開" },
                ],
            },
        },

        // ── エンディング ──
        {
            type: "ending",
            title: "ご清聴ありがとうございました",
            subtitle: "詳しくは概要欄のリンクからどうぞ",
            contact: "kei@example.com",
        },
    ],
};

// ── 実行 ──
async function main() {
    // 1. バリデーション
    const warnings = validateDeck(deckDef);
    printValidation(warnings);

    // 2. PPTX生成
    const pres = renderDeck(deckDef);

    // 3. 書き出し
    const outputPath = path.join(__dirname, "..", "output", "sample-deck.pptx");
    const outputDir = path.dirname(outputPath);

    // output ディレクトリがなければ作成
    const fs = require("fs");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    await pres.writeFile({ fileName: outputPath });
    console.log(`\n✅ スライド生成完了: ${outputPath}`);
    console.log(`   Googleスライドで開くには、Google Driveにアップロードしてください。`);
}

main().catch(console.error);
