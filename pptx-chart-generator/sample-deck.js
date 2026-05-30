/**
 * sample-deck.js — 汎用グラフ・図解スライドデッキ生成サンプル
 *
 * 【使い方】
 * 1. 依存パッケージのインストール: npm install pptxgenjs
 * 2. サンプル実行: node sample-deck.js
 */

const path = require("path");
const fs = require("fs");
const { renderDeck } = require("./lib/render-engine");

const deckDefinition = {
    author: "Slide Generator Student",
    slides: [
        // ── 1. 表紙スライド ──
        {
            type: "cover",
            title: "プレミアム・ビジネス図解 & グラフ集",
            subtitle: "pptx-chart-generator による自動構築サンプル",
            catchphrase: "PPTX自動生成エンジンの全レイアウト実例",
            version: "Ver 1.0 (配布用)",
        },

        // ── 2. セクション区切り ──
        {
            type: "section",
            title: "第1章：グラフ自動生成の実例",
            subtitle: "PptxGenJS を用いた折れ線・円グラフの生成",
        },

        // ── 3. KPI 3カラム ──
        {
            type: "content",
            sectionName: "第1章：グラフ実例",
            title: "主要財務パフォーマンス (KPI)",
            layout: "kpi-three-col",
            content: {
                items: [
                    { value: "+148%", label: "前年同期比売上成長率" },
                    { value: "98.2%", label: "顧客継続サポート率" },
                    { value: "¥4.2B", label: "年間フリーキャッシュフロー" },
                ],
            },
            source: "出典：2026年度 財務報告書より",
        },

        // ── 4. 折れ線グラフ ──
        {
            type: "content",
            sectionName: "第1章：グラフ実例",
            title: "製品売上高の中長期推移",
            layout: "line-chart",
            content: {
                minVal: 0,
                maxVal: 250,
                data: {
                    name: "売上推移 ($)",
                    labels: ["1Q", "2Q", "3Q", "4Q", "1Q(翌)", "2Q(翌)"],
                    values: [38, 75, 120, 110, 165, 210],
                }
            },
            source: "出典：販売管理システムデータ",
        },

        // ── 5. 円グラフ3カラム ──
        {
            type: "content",
            sectionName: "第1章：グラフ実例",
            title: "各セグメント別の市場シェア内訳",
            layout: "doughnut-three-col",
            content: {
                charts: [
                    {
                        title: "国内市場",
                        labels: ["A社", "B社", "自社"],
                        values: [40, 35, 25],
                    },
                    {
                        title: "アジア市場",
                        labels: ["自社", "競合", "その他"],
                        values: [55, 30, 15],
                    },
                    {
                        title: "欧米市場",
                        labels: ["欧米勢", "アジア勢", "自社"],
                        values: [60, 30, 10],
                    }
                ]
            },
        },

        // ── 6. セクション区切り ──
        {
            type: "section",
            title: "第2章：図解・プロセスの自動生成",
            subtitle: "マトリクス、ステップフロー、タイムライン等",
        },

        // ── 7. ステップフロー ──
        {
            type: "content",
            sectionName: "第2章：図解実例",
            title: "新規事業ローンチの5ステッププロセス",
            layout: "step-flow",
            content: {
                steps: [
                    { label: "企画策定", description: "ターゲット市場の分析と要件定義", duration: "1〜2週" },
                    { label: "PoC検証", description: "最小限のモックアップによる顧客受容性調査", duration: "3〜4週" },
                    { label: "開発開始", description: "MVP（実用最小限の製品）の初期構築", duration: "2ヶ月" },
                    { label: "βテスト", description: "コアユーザーによる早期フィードバック収集", duration: "1ヶ月" },
                    { label: "正式公開", description: "ローンチキャンペーンと広域プロモーション", duration: "当月" },
                ],
            },
        },

        // ── 8. Before/After 対比表 ──
        {
            type: "content",
            sectionName: "第2章：図解実例",
            title: "業務自動化による効率化の対比",
            layout: "comparison-table",
            beforeTitle: "導入前の課題 (Before)",
            afterTitle: "導入後の効果 (After)",
            content: {
                rows: [
                    { category: "データ入力", before: "手動転記（ミス多発・時間消費）", after: "自動API連携（ミスゼロ・瞬時完了）" },
                    { category: "レポーティング", before: "毎週金曜に手動集計（2時間）", after: "リアルタイム自動ダッシュボード" },
                    { category: "顧客対応", before: "メール順次返信（24〜48時間）", after: "AIアシスタントの即時自動回答（1分）" },
                ]
            },
        },

        // ── 9. ファンネル図 ──
        {
            type: "content",
            sectionName: "第2章：図解実例",
            title: "Webマーケティングのファネル構造",
            layout: "funnel",
            heading: "顧客獲得ファネルの最適化",
            body: "潜在ユーザーを認知（インプレッション）からエンゲージメント、そして最終的な購入（コンバージョン）までスムーズに誘導するためのコンバージョンファネルの分析結果です。",
            content: {
                steps: [
                    { label: "1. 認知 (10,000人)" },
                    { label: "2. 興味 (5,000人)" },
                    { label: "3. 検討 (2,000人)" },
                    { label: "4. 行動 (800人)" },
                    { label: "5. 購入 (200人)" },
                ]
            },
        },

        // ── 10. マトリクス ──
        {
            type: "content",
            sectionName: "第2章：図解実例",
            title: "市場ポジショニング分析 (2x2 Matrix)",
            layout: "matrix",
            labelX: { min: "低リターン", max: "高リターン" },
            labelY: { title: "リ\nス\nク\n許\n容\n度" },
            content: {
                lt: "⚠️ ハイリスク・ローリターン\n（避けるべき非効率市場）",
                rt: "🚀 ハイリスク・ハイリターン\n（成長・積極的開拓市場）",
                lb: "🐢 ローリスク・ローリターン\n（安定的だが成長鈍化）",
                rb: "💎 ローリスク・ハイリターン\n（参入障壁の高いブルーオーシャン）",
            }
        },

        // ── 11. エンディングスライド ──
        {
            type: "ending",
            title: "スライド生成が完了しました！",
            subtitle: "生成されたPPTXはGoogleスライドやPowerPointで編集可能です。",
            contact: "お問い合わせ：your-school@example.com",
        }
    ]
};

// ─── 実行メインプログラム ───
async function run() {
    console.log("=== 汎用スライド自動生成プログラムを起動 ===");
    
    // output フォルダの準備
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "sample-deck.pptx");
    
    console.log("[1/3] スライド定義データのパースを開始...");
    const pres = renderDeck(deckDefinition);
    
    console.log("[2/3] PPTXファイルの書き出しを実行中...");
    await pres.writeFile({ fileName: outputPath });
    
    console.log(`\n[3/3] 【大成功】スライドが正常に生成されました！`);
    console.log(`📂 出力先: ${outputPath}`);
    console.log(`💡 Googleスライドで開く場合は、Googleドライブにファイルをアップロードしてください。`);
}

run().catch(console.error);
