/**
 * OBS設定7ステップ — パターン2 v3（全ルール反映版 10枚）
 * チャンネル: suyaのAI×動画編集教室
 * 素材: C:\KEI IWASAKI\assets\suya_ai_movie\
 *
 * ルール:
 *   1. アスペクト比固定（image-sizeで実寸取得→比率計算）
 *   2. 最小20pt
 *   3. 4-5+ビジュアル要素/スライド
 *   4. エフェクト多用
 *   5. 3色以上/スライド
 *   6. 赤ベースカラー
 *   7. 余白を減らす
 */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { COLORS_CHARACTER: C, FONTS, drawBubble, drawBigText } = require("./lib/shared");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

// 素材パス（チャンネル別フォルダ）
const ASSET_BASE = "C:\\KEI IWASAKI\\assets\\suya_ai_movie";
const CHR = path.join(ASSET_BASE, "characters");
const EFX = path.join(ASSET_BASE, "effects");
function chr(name) { return path.join(CHR, name); }
function efx(name) { return path.join(EFX, name); }

// アスペクト比を維持する画像配置ヘルパー
// maxW/maxHの枠内でアスペクト比を保ったサイズに調整
function img(s, filePath, x, y, maxW, maxH) {
    if (!fs.existsSync(filePath)) return;
    // pptxgenjs の sizing: contain は枠内にアスペクト比を保って配置
    s.addImage({
        path: filePath, x, y, w: maxW, h: maxH,
        sizing: { type: "contain", w: maxW, h: maxH },
    });
}

// チャンネル登録（右下固定）
function ch(s) {
    s.addText("suyaのAI×動画編集教室", {
        x: 6.5, y: 5.0, w: 3.3, h: 0.5,
        fontSize: 12, fontFace: FONTS.heading,
        color: C.textRed, bold: true, align: "right", valign: "middle",
    });
}

// ══════════════════════════════════════════════════════
// #01 タイトル
// 要素: 笑顔キャラ, 爆発×2, キラキラ, 矢印, 吹き出し, 大文字×3
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("笑顔_1.png"), -0.3, 0.8, 3.8, 4.2);
    img(s, efx("爆発_1.png"), 6.0, -0.3, 3.8, 3.0);
    img(s, efx("爆発_2.png"), -0.2, -0.5, 2.5, 2.0);
    img(s, efx("キラキラ_1.png"), 8.0, 3.2, 2.2, 2.2);
    img(s, efx("矢印_赤_1.png"), 3.0, 3.8, 2.2, 1.5);
    drawBigText(s, "OBS Studio", 3.0, 0.2, 6.8, 1.5, { fontSize: 48, color: C.textRed });
    drawBigText(s, "完全設定ガイド", 3.2, 1.5, 6.5, 1.2, { fontSize: 40, color: C.textDarkRed });
    drawBubble(s, pres, "マネするだけ！\n半永久に終わる！", 4.5, 2.8, 4.5, 1.8, { fontSize: 22, tailDir: "bottom-left" });
    drawBigText(s, "7ステップで配信設定", 1.5, 4.8, 7.0, 0.8, { fontSize: 28, color: C.textOrange });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #02 トラブル4選
// 要素: 困りキャラ, 泣きキャラ, 爆発, ビックリ, バツ, 吹き出し×2, 大文字×2
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("困り_1.png"), -0.5, 1.3, 3.5, 4.0);
    img(s, chr("泣き_2.png"), 7.2, 0.8, 3.0, 3.8);
    img(s, efx("爆発_1.png"), 6.8, -0.5, 3.5, 2.5);
    img(s, efx("ビックリ_1.png"), 2.8, -0.2, 1.8, 1.8);
    img(s, efx("バツ_1.png"), 0.3, -0.2, 1.5, 1.5);
    drawBubble(s, pres, "🔇 音が出ない！\n💻 個人情報映る！", 0.5, 0.2, 3.8, 1.5, { fontSize: 20, tailDir: "bottom-left" });
    drawBubble(s, pres, "📢 ノイズ垂れ流し\n💥 音割れで離脱", 5.8, 0.2, 4.0, 1.5, { fontSize: 20, tailDir: "bottom-right" });
    drawBigText(s, "全部、設定1回で", 1.8, 3.3, 6.5, 1.0, { fontSize: 36, color: C.textRed });
    drawBigText(s, "防げます！！", 2.5, 4.2, 5.5, 1.2, { fontSize: 44, color: C.textOrange });
    img(s, efx("矢印_赤_1.png"), 0.0, 4.2, 2.5, 1.5);
    ch(s);
}

// ══════════════════════════════════════════════════════
// #03 7ステップ一覧
// 要素: 解説キャラ, ガッツポーズ, 矢印×2, キラキラ, 吹き出し, ステップリスト
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("解説_1.png"), -0.5, 0.2, 3.3, 4.0);
    img(s, chr("ガッツポーズ_1.png"), 7.2, 2.5, 3.0, 3.2);
    img(s, efx("矢印_赤_1.png"), 2.3, -0.2, 1.8, 1.2);
    img(s, efx("矢印_赤_1.png"), 8.0, 0.2, 1.8, 1.2);
    img(s, efx("キラキラ_1.png"), 8.0, -0.3, 2.0, 2.0);
    drawBigText(s, "今日の7ステップ", 2.5, -0.1, 5.5, 0.8, { fontSize: 30, color: C.textRed });
    const steps = [
        { t: "① DL＆インストール", c: C.textBlack },
        { t: "② 画面の見方", c: C.textBlack },
        { t: "③ 映像設定", c: C.textBlack },
        { t: "④ 音声設定 ←最重要！", c: C.textRed },
        { t: "⑤ YouTube連携", c: C.textBlack },
        { t: "⑥ テスト配信", c: C.textBlack },
        { t: "⑦ 事故防止チェック！", c: C.textOrange },
    ];
    steps.forEach((st, i) => {
        s.addText(st.t, {
            x: 2.8, y: 0.8 + i * 0.58, w: 5.0, h: 0.55,
            fontSize: 22, fontFace: FONTS.heading, bold: true, color: st.c,
        });
    });
    drawBubble(s, pres, "配信+録画+音どり\n全部これ1つ！", 4.8, 4.5, 3.5, 1.2, { fontSize: 20, tailDir: "bottom-right" });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #04 マイク選び
// 要素: 驚きキャラ, ガッツポーズ, バツ, 丸, 矢印, 吹き出し×2, 大文字×2
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("驚き_2.png"), -0.5, 1.0, 3.3, 3.8);
    img(s, chr("ガッツポーズ_1.png"), 7.3, 2.3, 3.0, 3.2);
    img(s, efx("バツ_1.png"), 2.5, 0.3, 1.5, 1.5);
    img(s, efx("丸_1.png"), 6.5, 0.3, 1.5, 1.5);
    img(s, efx("矢印_赤_1.png"), 4.0, 1.2, 2.0, 1.5);
    drawBigText(s, "マイク選び", 2.5, -0.1, 5.0, 0.7, { fontSize: 30, color: C.textRed });
    drawBubble(s, pres, "コンデンサー✖\n声が変わる\n環境音拾う", 2.5, 0.8, 3.2, 2.2, { fontSize: 20, tailDir: "bottom-left" });
    drawBubble(s, pres, "ダイナミック◎\nナチュラル\n1万円〜OK", 5.8, 0.8, 3.5, 2.2, { fontSize: 20, tailDir: "bottom-right" });
    drawBigText(s, "おすすめ：ゼンハイザー e945", 0.5, 3.8, 7.5, 0.8, { fontSize: 28, color: C.textOrange });
    drawBigText(s, "配信は声がキャラクター！", 1.0, 4.5, 6.5, 0.8, { fontSize: 24, color: C.textPink });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #05 STEP①② DL＋画面の見方
// 要素: 笑顔キャラ, 疑問キャラ, キラキラ, 上昇, 吹き出し×2, 大文字×2
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("笑顔_2.png"), -0.5, 1.0, 3.3, 3.8);
    img(s, chr("疑問_1.png"), 7.0, 0.2, 3.2, 3.5);
    img(s, efx("キラキラ_1.png"), 8.0, 3.2, 2.2, 2.2);
    img(s, efx("上昇_1.png"), -0.2, -0.3, 2.0, 2.0);
    drawBigText(s, "STEP①② DL＋画面の見方", 1.5, -0.1, 7.5, 0.8, { fontSize: 28, color: C.textRed });
    drawBubble(s, pres, "検索→公式サイト→DL\n「次へ」で全部OK！", 2.5, 0.9, 4.5, 1.5, { fontSize: 22, tailDir: "bottom-left" });
    drawBigText(s, "シーン＝スライド", 2.5, 2.6, 4.5, 0.8, { fontSize: 28, color: C.textRed });
    drawBigText(s, "ソース＝素材", 2.5, 3.3, 4.5, 0.8, { fontSize: 28, color: C.textOrange });
    drawBubble(s, pres, "上にあるものが\n手前に表示！", 4.0, 4.2, 4.0, 1.2, { fontSize: 22, tailDir: "bottom-right" });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #06 STEP③ 映像設定
// 要素: 笑顔キャラ, 丸, キラキラ, 矢印, 吹き出し, 大文字×3
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("笑顔_3.png"), -0.5, 0.5, 3.3, 4.2);
    img(s, efx("丸_1.png"), 7.5, -0.2, 2.0, 2.0);
    img(s, efx("キラキラ_1.png"), 7.8, 3.5, 2.2, 2.2);
    img(s, efx("矢印_赤_1.png"), 6.5, 1.5, 2.2, 1.5);
    drawBigText(s, "STEP③ 映像設定", 2.5, -0.1, 5.5, 0.8, { fontSize: 30, color: C.textRed });
    drawBubble(s, pres, "ベース解像度 1920×1080\n出力解像度  1920×1080\nFPS          30fps", 2.8, 0.8, 5.0, 2.5, { fontSize: 22, tailDir: "bottom-left" });
    drawBigText(s, "迷ったらこれでOK！", 2.0, 3.8, 6.0, 0.8, { fontSize: 32, color: C.textOrange });
    drawBigText(s, "配信なら30fpsで十分！", 2.0, 4.5, 6.0, 0.8, { fontSize: 24, color: C.textPink });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #07 STEP④ 音声設定（最重要！）
// 要素: 泣きキャラ, 驚きキャラ, 爆発×2, ビックリ, 矢印, 吹き出し×2, 大文字×2
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("泣き_1.png"), -0.5, 0.8, 3.3, 4.0);
    img(s, chr("驚き_1.jpg"), 7.0, 1.2, 3.2, 3.5);
    img(s, efx("爆発_1.png"), 6.8, -0.5, 3.5, 2.5);
    img(s, efx("爆発_2.png"), -0.3, -0.5, 2.8, 2.0);
    img(s, efx("ビックリ_1.png"), 2.5, -0.3, 2.0, 2.0);
    img(s, efx("矢印_赤_1.png"), 0.0, 4.2, 2.5, 1.5);
    drawBigText(s, "STEP④ 音声設定", 2.5, -0.2, 4.5, 0.7, { fontSize: 30, color: C.textRed });
    drawBigText(s, "←一番大事！！", 5.5, -0.2, 4.0, 0.7, { fontSize: 26, color: C.textOrange });
    drawBubble(s, pres, "デスクトップ音声：既定\nマイク：選択する\nノイズ抑制：RNNoise\n音量：-5〜-10dB", 2.8, 1.0, 4.8, 2.8, { fontSize: 20, tailDir: "bottom-left" });
    drawBigText(s, "フィルタは⚙から追加！", 1.5, 4.2, 6.5, 0.8, { fontSize: 30, color: C.textRed });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #08 STEP⑤⑥ YouTube連携＋テスト
// 要素: 笑顔キャラ, 考え中キャラ, 矢印, キラキラ, 丸, 吹き出し×2, 大文字
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("笑顔_4.jpg"), 7.0, 0.0, 3.2, 3.8);
    img(s, chr("考え中_1.png"), -0.5, 1.2, 3.3, 4.0);
    img(s, efx("矢印_赤_1.png"), 4.2, 0.3, 2.2, 1.5);
    img(s, efx("キラキラ_1.png"), 8.5, 3.5, 1.8, 1.8);
    img(s, efx("丸_1.png"), -0.2, -0.2, 1.8, 1.8);
    drawBigText(s, "STEP⑤⑥", 2.5, -0.1, 3.5, 0.7, { fontSize: 30, color: C.textRed });
    drawBubble(s, pres, "YouTube連携\n設定→配信→アカウント\n接続→ログイン→完了！", 2.5, 0.7, 4.8, 2.2, { fontSize: 20, tailDir: "bottom-left" });
    drawBubble(s, pres, "テスト配信チェック\n🎵バー動く？🎤声入る？\n📺正しい画面？📊CPU？", 2.5, 3.0, 5.2, 2.0, { fontSize: 20, tailDir: "bottom-right" });
    drawBigText(s, "「限定公開」で安心テスト", 0.5, 5.0, 5.5, 0.6, { fontSize: 22, color: C.textOrange });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #09 STEP⑦ 事故防止チェック
// 要素: ショックキャラ, 怒りキャラ, 爆発, バツ, 下降, 矢印, チェックリスト, 大文字
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("ショック_1.jpg"), -0.5, 0.2, 3.3, 3.8);
    img(s, chr("怒り_1.png"), 7.3, 0.2, 3.0, 3.5);
    img(s, efx("爆発_2.png"), 6.8, -0.5, 3.5, 2.5);
    img(s, efx("バツ_1.png"), 2.5, -0.3, 1.8, 1.8);
    img(s, efx("下降_1.png"), -0.2, -0.3, 2.0, 2.0);
    img(s, efx("矢印_赤_1.png"), 0.0, 4.5, 2.5, 1.2);
    drawBigText(s, "STEP⑦ 事故防止チェック", 2.0, -0.2, 6.5, 0.7, { fontSize: 28, color: C.textRed });
    const items = [
        { t: "□ 通知OFF！", c: C.textBlack },
        { t: "□ ブクマバー非表示！", c: C.textBlack },
        { t: "□ ウィンドウ指定！", c: C.textRed },
        { t: "□ マイク音量テスト！", c: C.textRed },
        { t: "□ ノイズ抑制ON！", c: C.textOrange },
        { t: "□ 10秒テスト録画！", c: C.textOrange },
    ];
    items.forEach((it, i) => {
        s.addText(it.t, {
            x: 2.5, y: 0.6 + i * 0.58, w: 5.5, h: 0.55,
            fontSize: 22, fontFace: FONTS.heading, bold: true, color: it.c,
        });
    });
    drawBigText(s, "毎回確認→事故ゼロ！！", 1.0, 4.3, 8.0, 1.0, { fontSize: 36, color: C.textRed });
    ch(s);
}

// ══════════════════════════════════════════════════════
// #10 まとめ
// 要素: ガッツポーズ, 笑顔, キラキラ×2, 爆発, 矢印, 吹き出し, 大文字×3
// ══════════════════════════════════════════════════════
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("ガッツポーズ_1.png"), -0.5, 0.5, 3.8, 4.5);
    img(s, chr("笑顔_1.png"), 6.8, 1.2, 3.5, 4.0);
    img(s, efx("キラキラ_1.png"), 7.5, -0.3, 2.8, 2.5);
    img(s, efx("キラキラ_1.png"), -0.3, -0.5, 2.5, 2.0);
    img(s, efx("爆発_1.png"), 4.0, -0.5, 3.0, 2.5);
    img(s, efx("矢印_赤_1.png"), 3.0, 3.8, 2.5, 1.5);
    drawBigText(s, "7ステップで", 2.5, 0.2, 5.0, 0.8, { fontSize: 32, color: C.textDarkRed });
    drawBigText(s, "配信設定", 2.8, 1.0, 4.5, 1.2, { fontSize: 48, color: C.textRed });
    drawBigText(s, "半永久完了！！", 2.0, 2.2, 6.0, 1.0, { fontSize: 40, color: C.textOrange });
    drawBubble(s, pres, "ライブ配信＋録画＋音どり\n全部これ1つでOK！", 3.0, 3.3, 5.0, 1.5, { fontSize: 22, tailDir: "bottom-left" });
    drawBigText(s, "大は小を兼ねる💪", 2.5, 4.8, 5.5, 0.7, { fontSize: 24, color: C.textPink });
    ch(s);
}

// 出力 + コピー + PDF変換 + Discord送信
const outName = "obs_pattern2_v3_10slides.pptx";
const outPath = path.join(__dirname, "output", outName);
const sharedDir = "C:\\KEI IWASAKI\\shared-context";
const sharedPptx = path.join(sharedDir, outName);
const sharedPdf = sharedPptx.replace(".pptx", ".pdf");

pres.writeFile({ fileName: `output/${outName}` }).then(() => {
    console.log(`PPTX OK: ${outName}`);
    fs.copyFileSync(outPath, sharedPptx);
    console.log("Copied to shared-context");
    console.log("Run PDF conversion separately with convert-pdf.ps1");
}).catch(e => console.error(e.message));
