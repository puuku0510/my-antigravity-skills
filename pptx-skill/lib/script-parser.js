/**
 * script-parser.js — 台本解析モジュール
 *
 * 台本（CSVまたはmd）を読み込み、スライド構成JSONに変換する。
 * gws sheets経由のスプシデータ、またはローカルCSV/mdファイルに対応。
 *
 * 出力フォーマット:
 * [
 *   {
 *     index: 0,
 *     text: "メインテキスト",
 *     slideNote: "スライドイメージの補足（あれば）",
 *     refUrl: "参考URL（あれば）",
 *     imagePath: "画像パス（あれば）",
 *     slideType: "text" | "table" | "chart" | "quote" | "screenshot" | "pyramid" | "formula" | "cta",
 *     needsSource: true/false,
 *     sourceKeywords: ["企業名", "指標名", ...]
 *   }
 * ]
 */

const fs = require("fs");
const path = require("path");

// ============================================================
// ソース判別キーワード
// ============================================================

const SOURCE_KEYWORDS = {
    // 経済指標・データ系
    financial: [
        "GDP", "インフレ", "デフレ", "利回り", "配当", "株価", "時価総額",
        "PER", "PBR", "ROE", "ROA", "EPS", "BPS", "NISA", "iDeCo",
        "為替", "円安", "円高", "金利", "国債", "社債", "投資信託",
        "S&P500", "日経平均", "ダウ", "TOPIX", "NASDAQ",
        "年収", "平均給与", "手取り", "税金", "所得税", "住民税",
        "複利", "単利", "元本", "運用", "資産",
    ],
    // 企業・組織名パターン
    orgPatterns: [
        /[A-Z]{2,}/,                    // AAPL, MSFT etc
        /[\u4e00-\u9fff]{2,}(株|証券|銀行|保険|ホールディングス)/,  // 日本企業名
        /国税庁|金融庁|日銀|財務省|厚労省|総務省/,
        /Yahoo\s*Finance|EDINET|TDnet|IR/i,
    ],
    // 数値パターン（具体的な数字があるとソースが必要な可能性が高い）
    numberPatterns: [
        /\d+[兆億万]円/,
        /\d+(\.\d+)?%/,
        /\d+倍/,
        /年\d{4}/,
        /\d+年/,
    ],
    // ソース不要シグナル（主観・感想）
    noSourceSignals: [
        "思います", "だと思う", "感じ", "ぶっちゃけ", "正直",
        "個人的に", "おすすめ", "まとめ", "ご視聴", "チャンネル登録",
    ],
};

// ============================================================
// スライドタイプ判別キーワード
// ============================================================

const SLIDE_TYPE_HINTS = {
    table: ["比較", "一覧", "表", "ランキング", "リスト", "メリット", "デメリット", "○", "×", "△"],
    chart: ["グラフ", "推移", "チャート", "棒グラフ", "折れ線", "円グラフ", "増加", "減少", "前年比"],
    quote: ["名言", "格言", "という言葉", "と述べ", "曰く", "によると"],
    screenshot: ["サイト", "ページ", "画面", "スクショ", "引用", "出典", "参照"],
    pyramid: ["ピラミッド", "レベル", "段階", "Lv", "ステップ", "階層"],
    formula: ["計算", "×", "＝", "=", "利回り", "投資額", "税引", "手数料"],
    cta: ["LINE", "登録", "プレゼント", "公式", "概要欄", "リンク", "メルマガ"],
};

// ============================================================
// CSV / TSVパーサー
// ============================================================

/**
 * CSVテキストを行列に分解する（簡易パーサー）
 * ダブルクォート内のカンマ・改行に対応
 */
function parseCSV(text, delimiter = ",") {
    const rows = [];
    let current = "";
    let inQuotes = false;
    const chars = text.replace(/\r\n/g, "\n").split("");

    const row = [];
    for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (ch === '"') {
            if (inQuotes && chars[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === delimiter && !inQuotes) {
            row.push(current.trim());
            current = "";
        } else if (ch === "\n" && !inQuotes) {
            row.push(current.trim());
            rows.push([...row]);
            row.length = 0;
            current = "";
        } else {
            current += ch;
        }
    }
    if (current || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
    }
    return rows;
}

// ============================================================
// ヘッダー列名のマッピング
// ============================================================

const COLUMN_ALIASES = {
    text: ["台本", "テキスト", "セリフ", "ナレーション", "script", "text", "content", "台本テキスト"],
    slideNote: ["スライド", "イメージ", "補足", "説明", "note", "slide", "image", "スライドイメージ", "スライド説明"],
    refUrl: ["URL", "リンク", "参考", "url", "link", "ref", "参考URL", "参考リンク", "ソース"],
    imagePath: ["画像", "image", "img", "画像パス", "imagePath"],
    sectionTitle: ["セクション", "見出し", "section", "title", "タイトル"],
};

/**
 * ヘッダー行から列インデックスを特定する
 */
function detectColumns(headerRow) {
    const mapping = {};
    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
        for (let i = 0; i < headerRow.length; i++) {
            const h = headerRow[i].toLowerCase().replace(/\s/g, "");
            if (aliases.some(a => h.includes(a.toLowerCase()))) {
                mapping[key] = i;
                break;
            }
        }
    }
    return mapping;
}

// ============================================================
// ソース必要性の判定
// ============================================================

/**
 * テキストからソースが必要かどうかを判定する
 * @returns {{ needsSource: boolean, keywords: string[] }}
 */
function detectSourceNeed(text) {
    if (!text) return { needsSource: false, keywords: [] };

    const keywords = [];
    let score = 0;

    // 金融キーワードチェック
    for (const kw of SOURCE_KEYWORDS.financial) {
        if (text.includes(kw)) {
            keywords.push(kw);
            score += 2;
        }
    }

    // 組織名パターンチェック
    for (const pattern of SOURCE_KEYWORDS.orgPatterns) {
        const match = text.match(pattern);
        if (match) {
            keywords.push(match[0]);
            score += 3;
        }
    }

    // 数値パターンチェック
    for (const pattern of SOURCE_KEYWORDS.numberPatterns) {
        if (pattern.test(text)) {
            score += 1;
        }
    }

    // ソース不要シグナル（減点）
    for (const signal of SOURCE_KEYWORDS.noSourceSignals) {
        if (text.includes(signal)) {
            score -= 2;
        }
    }

    return {
        needsSource: score >= 3,
        keywords: [...new Set(keywords)],
    };
}

// ============================================================
// スライドタイプの判定
// ============================================================

/**
 * テキストとスライドノートからスライドタイプを推定する
 */
function detectSlideType(text, slideNote) {
    const combined = `${text || ""} ${slideNote || ""}`;

    // スライドノートに明示的なヒントがあればそれを優先
    if (slideNote) {
        for (const [type, hints] of Object.entries(SLIDE_TYPE_HINTS)) {
            if (hints.some(h => slideNote.includes(h))) {
                return type;
            }
        }
    }

    // テキストから推定
    const scores = {};
    for (const [type, hints] of Object.entries(SLIDE_TYPE_HINTS)) {
        scores[type] = hints.filter(h => combined.includes(h)).length;
    }

    const maxType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (maxType && maxType[1] >= 2) {
        return maxType[0];
    }

    return "text";
}

// ============================================================
// メインパーサー
// ============================================================

/**
 * CSV/TSVテキストからスライド構成JSONを生成する
 * @param {string} csvText - CSVテキスト
 * @param {string} [pattern="source"] - "source" | "character"
 * @param {object} [opts] - オプション
 * @param {number} [opts.minSlides=30] - 最小スライド数
 * @param {number} [opts.maxSlides=50] - 最大スライド数
 * @returns {Array} スライド構成配列
 */
function parseScript(csvText, pattern = "source", opts = {}) {
    const { minSlides = 10, maxSlides = 50 } = opts;

    // TSVかCSVか自動判定
    const firstLine = csvText.split("\n")[0];
    const delimiter = firstLine.includes("\t") ? "\t" : ",";

    const rows = parseCSV(csvText, delimiter);
    if (rows.length < 2) {
        throw new Error("台本データが不足しています（ヘッダー+1行以上必要）");
    }

    const headerRow = rows[0];
    const colMap = detectColumns(headerRow);

    if (colMap.text === undefined) {
        colMap.text = 0;
    }

    let slides = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const text = (row[colMap.text] || "").trim();
        if (!text) continue;

        const slideNote = colMap.slideNote !== undefined ? (row[colMap.slideNote] || "").trim() : "";
        const refUrl = colMap.refUrl !== undefined ? (row[colMap.refUrl] || "").trim() : "";
        const imagePath = colMap.imagePath !== undefined ? (row[colMap.imagePath] || "").trim() : "";
        const sectionTitle = colMap.sectionTitle !== undefined ? (row[colMap.sectionTitle] || "").trim() : "";

        const slideType = detectSlideType(text, slideNote);
        const { needsSource, keywords } = pattern === "source"
            ? detectSourceNeed(text)
            : { needsSource: false, keywords: [] };

        slides.push({
            index: slides.length,
            text,
            slideNote,
            refUrl,
            imagePath,
            sectionTitle,
            slideType,
            needsSource,
            sourceKeywords: keywords,
        });
    }

    // ────────────────────────────────
    // スライド数の調整（30〜50枚レンジ）
    // ────────────────────────────────

    // 多すぎる場合: 短いスライドを前のスライドに統合
    if (slides.length > maxSlides) {
        slides = mergeShortSlides(slides, maxSlides);
    }

    // 少なすぎる場合: 長いスライドを分割
    if (slides.length < minSlides) {
        slides = splitLongSlides(slides, minSlides);
    }

    // インデックス振り直し
    slides.forEach((s, i) => { s.index = i; });

    return slides;
}

/**
 * 短いスライドを前のスライドに統合してスライド数を減らす
 */
function mergeShortSlides(slides, target) {
    // テキストが短い順にソートして統合候補を決める
    const shortThreshold = 20; // 20文字以下は統合候補
    let result = [...slides];

    while (result.length > target) {
        // 最短のスライドを見つける（CTA/tableは統合しない）
        let shortestIdx = -1;
        let shortestLen = Infinity;

        for (let i = 1; i < result.length; i++) {
            const s = result[i];
            if (s.slideType !== "cta" && s.slideType !== "table" && s.slideType !== "pyramid") {
                if (s.text.length < shortestLen && s.text.length <= shortThreshold) {
                    shortestLen = s.text.length;
                    shortestIdx = i;
                }
            }
        }

        if (shortestIdx === -1) break; // 統合できるものがない

        // 前のスライドに統合
        const prev = result[shortestIdx - 1];
        const curr = result[shortestIdx];
        prev.text = prev.text + "\n" + curr.text;
        result.splice(shortestIdx, 1);
    }

    return result;
}

/**
 * 長いスライドを分割してスライド数を増やす
 */
function splitLongSlides(slides, target) {
    let result = [...slides];

    while (result.length < target) {
        // 最長のテキストスライドを見つける
        let longestIdx = -1;
        let longestLen = 0;

        for (let i = 0; i < result.length; i++) {
            if (result[i].text.length > longestLen && result[i].slideType === "text") {
                longestLen = result[i].text.length;
                longestIdx = i;
            }
        }

        if (longestIdx === -1 || longestLen < 40) break; // これ以上分割できない

        // 文の区切りで分割
        const s = result[longestIdx];
        const text = s.text;
        const midPoint = Math.floor(text.length / 2);

        // 中間点から最も近い句点・改行を探す
        let splitAt = -1;
        const breakChars = ["。", "\n", "！", "？", "、"];
        for (let range = 0; range < midPoint; range++) {
            for (const ch of breakChars) {
                if (text[midPoint + range] === ch) { splitAt = midPoint + range + 1; break; }
                if (midPoint - range >= 0 && text[midPoint - range] === ch) { splitAt = midPoint - range + 1; break; }
            }
            if (splitAt !== -1) break;
        }

        if (splitAt === -1) splitAt = midPoint;

        const newSlide = {
            ...s,
            text: text.substring(splitAt).trim(),
            index: 0,
        };
        s.text = text.substring(0, splitAt).trim();

        result.splice(longestIdx + 1, 0, newSlide);
    }

    return result;
}

/**
 * Markdownファイルの台本を解析する
 * 見出し（### や ## ）でセクション分割、段落でスライド分割
 */
function parseMarkdownScript(mdText, pattern = "source") {
    const lines = mdText.split("\n");
    const slides = [];
    let currentSection = "";
    let buffer = [];

    function flushBuffer() {
        const text = buffer.join("\n").trim();
        if (!text) return;

        const slideType = detectSlideType(text, "");
        const { needsSource, keywords } = pattern === "source"
            ? detectSourceNeed(text)
            : { needsSource: false, keywords: [] };

        slides.push({
            index: slides.length,
            text,
            slideNote: "",
            refUrl: "",
            imagePath: "",
            sectionTitle: currentSection,
            slideType,
            needsSource,
            sourceKeywords: keywords,
        });

        buffer = [];
    }

    for (const line of lines) {
        const headingMatch = line.match(/^#{1,3}\s+(.+)/);
        if (headingMatch) {
            flushBuffer();
            currentSection = headingMatch[1].trim();
            continue;
        }

        // 空行でスライド区切り
        if (line.trim() === "" && buffer.length > 0) {
            flushBuffer();
            continue;
        }

        // コメント行やメタデータ行はスキップ
        if (line.startsWith("---") || line.startsWith("<!--")) continue;

        buffer.push(line);
    }

    flushBuffer();
    return slides;
}

/**
 * ファイルパスから台本を読み込んで解析する
 */
function parseFromFile(filePath, pattern = "source") {
    const ext = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, "utf8");

    if (ext === ".csv" || ext === ".tsv") {
        return parseScript(content, pattern);
    } else if (ext === ".md" || ext === ".txt") {
        return parseMarkdownScript(content, pattern);
    } else {
        throw new Error(`未対応のファイル形式: ${ext}`);
    }
}

// ============================================================
// エクスポート
// ============================================================

module.exports = {
    parseScript,
    parseMarkdownScript,
    parseFromFile,
    parseCSV,
    detectSourceNeed,
    detectSlideType,
    detectColumns,
    SOURCE_KEYWORDS,
    SLIDE_TYPE_HINTS,
    COLUMN_ALIASES,
};
