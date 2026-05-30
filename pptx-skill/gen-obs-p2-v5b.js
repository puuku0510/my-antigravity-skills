/**
 * OBS設定7ステップ — パターン2 v2（修正版10枚）
 * チャンネル: suyaのAI×動画編集教室
 * 修正ルール:
 *   - アスペクト比維持（sizing: contain）
 *   - 最小20pt
 *   - 1スライド4-5+ビジュアル要素
 *   - 3色以上/スライド
 *   - エフェクト多用
 *   - 余白を減らす
 */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { COLORS_CHARACTER: C, FONTS, drawBubble, drawBigText, addChannelRegister, addImageExact } = require("./lib/shared");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

const ASSET = "C:\\KEI IWASAKI\\assets\\suya_ai_movie";
const PPL = path.join(ASSET, "characters");
const EFX = path.join(ASSET, "effects");
function ppl(name) { return path.join(PPL, name); }
function efx(name) { return path.join(EFX, name); }

// アスペクト比100%保証（addImageExact: 実ピクセル寸法から計算）
function img(s, p, x, y, w, h) {
    addImageExact(s, p, x, y, w, h);
}

function ch(s) {
    s.addText("suyaのAI×動画編集教室", {
        x: 7.0, y: 5.0, w: 2.8, h: 0.5,
        fontSize: 12, fontFace: FONTS.heading,
        color: C.textRed, bold: true, align: "right", valign: "middle",
    });
}

// ════════════════════════════════════════
// #01 タイトル — 笑顔＋爆発×2＋キラキラ＋矢印
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_1.png"), -0.3, 0.8, 3.5, 4.0);
    img(s, efx("爆発_1.png"), 6.0, -0.2, 3.5, 3.0);
    img(s, efx("爆発_2.png"), 0.0, -0.3, 2.0, 1.5);
    img(s, efx("キラキラ_1.png"), 8.0, 3.0, 2.0, 2.0);
    img(s, efx("矢印_赤_1.png"), 3.0, 3.5, 2.0, 1.5);
    drawBigText(s, "OBS Studio", 3.0, 0.3, 6.8, 1.5, { fontSize: 48, color: C.textRed });
    drawBigText(s, "完全設定ガイド", 3.0, 1.5, 6.8, 1.2, { fontSize: 40, color: C.textBlue });
    drawBubble(s, pres, "マネするだけ！\n半永久に終わる！", 4.5, 3.0, 4.0, 1.8, { fontSize: 22, tailDir: "bottom-left" });
    drawBigText(s, "7ステップで配信設定", 1.0, 4.5, 8.5, 1.0, { fontSize: 32, color: C.textOrange });
    ch(s);
}

// ════════════════════════════════════════
// #02 トラブル — 困り＋泣き＋爆発＋ビックリ＋バツ
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("困り_1.png"), -0.3, 1.5, 3.0, 3.5);
    img(s, ppl("泣き_2.png"), 7.5, 1.0, 2.8, 3.5);
    img(s, efx("爆発_1.png"), 7.0, -0.3, 3.0, 2.0);
    img(s, efx("ビックリ_1.png"), 2.5, 0.0, 1.5, 1.5);
    img(s, efx("バツ_1.png"), 0.5, 0.0, 1.2, 1.2);
    drawBubble(s, pres, "音が出ない！\n画面が全部映る！", 0.5, 0.2, 3.5, 1.5, { fontSize: 20, tailDir: "bottom-left" });
    drawBubble(s, pres, "ノイズ垂れ流し\n音割れで離脱", 6.0, 0.2, 3.5, 1.5, { fontSize: 20, tailDir: "bottom-right" });
    drawBigText(s, "全部、設定1回で", 1.5, 3.2, 7.0, 1.0, { fontSize: 36, color: C.textRed });
    drawBigText(s, "防げます！！", 2.0, 4.0, 6.0, 1.2, { fontSize: 44, color: C.textOrange });
    img(s, efx("矢印_赤_1.png"), 0.0, 4.0, 2.0, 1.5);
    ch(s);
}

// ════════════════════════════════════════
// #03 7ステップ一覧 — 解説＋矢印×3＋キラキラ＋ガッツポーズ
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("解説_1.png"), -0.3, 0.3, 3.0, 3.5);
    img(s, ppl("ガッツポーズ_1.png"), 7.5, 2.5, 2.8, 3.0);
    img(s, efx("矢印_赤_1.png"), 2.5, 0.0, 1.5, 1.0);
    img(s, efx("矢印_青_1.png"), 8.5, 0.5, 1.5, 1.0);
    img(s, efx("キラキラ_1.png"), 8.0, 0.0, 1.5, 1.5);
    drawBigText(s, "今日の7ステップ", 2.5, 0.0, 5.5, 0.8, { fontSize: 30, color: C.textBlue });
    const steps = [
        { t: "① DL＆インストール", c: C.textBlack },
        { t: "② 画面の見方", c: C.textBlack },
        { t: "③ 映像設定", c: C.textBlack },
        { t: "④ 音声設定 ←最重要！", c: C.textRed },
        { t: "⑤ YouTube連携", c: C.textBlack },
        { t: "⑥ テスト配信", c: C.textBlack },
        { t: "⑦ 事故防止チェック", c: C.textRed },
    ];
    steps.forEach((st, i) => {
        s.addText(st.t, {
            x: 2.8, y: 0.9 + i * 0.55, w: 5.0, h: 0.5,
            fontSize: 22, fontFace: FONTS.heading, bold: true, color: st.c,
        });
    });
    drawBubble(s, pres, "全部これ1つ！", 5.0, 4.3, 3.0, 1.0, { fontSize: 22, tailDir: "bottom-right" });
    ch(s);
}

// ════════════════════════════════════════
// #04 マイク — 驚き＋バツ＋丸＋ガッツ＋吹き出し素材＋矢印
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("驚き_2.png"), -0.3, 0.8, 3.0, 3.5);
    img(s, ppl("ガッツポーズ_1.png"), 7.5, 2.5, 2.8, 3.0);
    img(s, efx("バツ_1.png"), 2.5, 0.5, 1.2, 1.2);
    img(s, efx("丸_1.png"), 6.5, 0.5, 1.2, 1.2);
    img(s, efx("矢印_赤_1.png"), 4.2, 1.5, 1.8, 1.2);
    img(s, efx("吹き出し_2.png"), 2.5, 0.0, 3.0, 2.5);
    s.addText("コンデンサー\n声が変わる\n環境音拾う", {
        x: 2.7, y: 0.3, w: 2.5, h: 2.0,
        fontSize: 20, fontFace: FONTS.heading, bold: true, color: C.textRed,
        align: "center", valign: "middle",
    });
    img(s, efx("吹き出し_3.png"), 5.8, 0.0, 3.5, 2.5);
    s.addText("ダイナミック◎\nナチュラル\n1万円〜", {
        x: 6.0, y: 0.3, w: 3.0, h: 2.0,
        fontSize: 20, fontFace: FONTS.heading, bold: true, color: C.textBlue,
        align: "center", valign: "middle",
    });
    drawBigText(s, "おすすめ：ゼンハイザー e945", 0.5, 3.8, 7.5, 1.0, { fontSize: 28, color: C.textOrange });
    drawBigText(s, "声がキャラクター！", 1.0, 4.5, 6.0, 0.8, { fontSize: 24, color: C.textPink });
    ch(s);
}

// ════════════════════════════════════════
// #05 STEP①② DL＋画面 — 笑顔＋疑問＋吹き出し＋キラキラ＋上昇
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_2.png"), -0.3, 1.0, 3.0, 3.5);
    img(s, ppl("疑問_1.png"), 7.0, 0.3, 3.0, 3.0);
    img(s, efx("キラキラ_1.png"), 8.0, 3.0, 2.0, 2.0);
    img(s, efx("上昇_1.png"), 0.0, 0.0, 1.5, 1.5);
    drawBigText(s, "STEP①② DL ＋ 画面の見方", 1.5, 0.0, 7.0, 0.8, { fontSize: 28, color: C.textBlue });
    drawBubble(s, pres, "検索→公式サイト→DL\n「次へ」で全部OK！", 2.5, 1.0, 4.5, 1.5, { fontSize: 20, tailDir: "bottom-left" });
    drawBigText(s, "シーン＝スライド", 2.5, 2.8, 4.5, 0.8, { fontSize: 28, color: C.textRed });
    drawBigText(s, "ソース＝素材", 2.5, 3.5, 4.5, 0.8, { fontSize: 28, color: C.textOrange });
    drawBubble(s, pres, "上にあるものが\n手前に表示される！", 4.5, 4.0, 4.0, 1.3, { fontSize: 20, tailDir: "bottom-right" });
    ch(s);
}

// ════════════════════════════════════════
// #06 STEP③ 映像設定 — 笑顔＋丸＋キラキラ＋吹き出し
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_3.png"), -0.3, 0.5, 3.0, 4.0);
    img(s, efx("丸_1.png"), 7.5, 0.0, 1.5, 1.5);
    img(s, efx("キラキラ_1.png"), 8.0, 3.5, 2.0, 2.0);
    img(s, efx("吹き出し_1.png"), 2.5, 0.3, 4.0, 3.0);
    s.addText("ベース解像度\n1920×1080\n\n出力解像度\n1920×1080\n\nFPS: 30fps", {
        x: 2.8, y: 0.6, w: 3.5, h: 2.5,
        fontSize: 20, fontFace: FONTS.heading, bold: true, color: C.textBlack,
        align: "center", valign: "middle", lineSpacingMultiple: 1.1,
    });
    drawBigText(s, "STEP③ 映像設定", 2.5, -0.1, 5.0, 0.7, { fontSize: 30, color: C.textBlue });
    img(s, efx("矢印_青_1.png"), 6.5, 1.5, 2.0, 1.5);
    drawBigText(s, "迷ったらこれでOK！", 2.0, 3.8, 6.0, 1.0, { fontSize: 32, color: C.textOrange });
    drawBigText(s, "配信なら30fpsで十分", 2.0, 4.5, 6.0, 0.8, { fontSize: 24, color: C.textRed });
    ch(s);
}

// ════════════════════════════════════════
// #07 STEP④ 音声設定 — 泣き＋驚き＋爆発×2＋ビックリ
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("泣き_1.png"), -0.3, 0.8, 3.0, 3.5);
    img(s, ppl("驚き_1.jpg"), 7.0, 1.5, 3.0, 3.0);
    img(s, efx("爆発_1.png"), 7.0, -0.3, 3.0, 2.0);
    img(s, efx("爆発_2.png"), 0.0, -0.3, 2.5, 1.5);
    img(s, efx("ビックリ_1.png"), 2.5, 0.0, 1.5, 1.5);
    drawBigText(s, "STEP④ 音声設定", 2.5, -0.1, 5.0, 0.7, { fontSize: 30, color: C.textRed });
    drawBigText(s, "← 一番大事！！", 5.5, -0.1, 4.0, 0.7, { fontSize: 26, color: C.textOrange });
    drawBubble(s, pres, "デスクトップ音声：既定\nマイク：選択する\nノイズ抑制：RNNoise\n音量：-5〜-10dB", 2.8, 1.2, 4.5, 2.5, { fontSize: 20, tailDir: "bottom-left" });
    drawBigText(s, "フィルタは⚙から追加！", 1.5, 4.0, 6.5, 1.0, { fontSize: 30, color: C.textRed });
    img(s, efx("矢印_赤_1.png"), 0.0, 4.0, 2.0, 1.5);
    ch(s);
}

// ════════════════════════════════════════
// #08 STEP⑤⑥ YouTube＋テスト — 笑顔＋考え中＋矢印＋キラキラ
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_4.jpg"), 7.0, 0.3, 3.0, 3.5);
    img(s, ppl("考え中_1.png"), -0.3, 1.5, 3.0, 3.5);
    img(s, efx("矢印_青_1.png"), 4.5, 0.5, 2.0, 1.5);
    img(s, efx("キラキラ_1.png"), 8.5, 3.5, 1.5, 1.5);
    img(s, efx("丸_1.png"), 0.0, 0.0, 1.5, 1.5);
    drawBigText(s, "STEP⑤⑥", 2.0, 0.0, 3.0, 0.7, { fontSize: 30, color: C.textBlue });
    drawBubble(s, pres, "YouTube連携\n設定→配信→アカウント\n接続→ログイン→完了！", 2.5, 0.8, 4.5, 2.0, { fontSize: 20, tailDir: "bottom-left" });
    drawBubble(s, pres, "テスト配信チェック\n🎵バー動く？🎤声入る？\n📺正しい画面？📊CPU？", 2.5, 3.0, 5.0, 2.0, { fontSize: 20, tailDir: "bottom-right" });
    drawBigText(s, "「限定公開」で安心", 0.5, 4.8, 5.0, 0.7, { fontSize: 24, color: C.textOrange });
    ch(s);
}

// ════════════════════════════════════════
// #09 STEP⑦ 事故防止 — ショック＋怒り＋爆発＋バツ＋下降
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("ショック_1.jpg"), -0.3, 0.3, 3.0, 3.5);
    img(s, ppl("怒り_1.png"), 7.5, 0.3, 2.5, 3.0);
    img(s, efx("爆発_2.png"), 7.0, -0.3, 3.0, 2.0);
    img(s, efx("バツ_1.png"), 2.5, 0.0, 1.2, 1.2);
    img(s, efx("下降_1.png"), 0.0, 0.0, 1.5, 1.5);
    drawBigText(s, "STEP⑦ 事故防止チェック", 2.0, 0.0, 6.0, 0.7, { fontSize: 28, color: C.textRed });
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
            x: 2.5, y: 0.8 + i * 0.6, w: 5.0, h: 0.55,
            fontSize: 22, fontFace: FONTS.heading, bold: true, color: it.c,
        });
    });
    drawBigText(s, "毎回確認→事故ゼロ！！", 1.0, 4.3, 8.0, 1.0, { fontSize: 36, color: C.textRed });
    img(s, efx("矢印_赤_1.png"), 0.0, 4.0, 2.0, 1.5);
    ch(s);
}

// ════════════════════════════════════════
// #10 まとめ — ガッツポーズ＋笑顔＋キラキラ×2＋爆発＋矢印
// ════════════════════════════════════════
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("ガッツポーズ_1.png"), -0.3, 0.8, 3.5, 4.0);
    img(s, ppl("笑顔_1.png"), 7.0, 1.5, 3.0, 3.5);
    img(s, efx("キラキラ_1.png"), 7.5, 0.0, 2.5, 2.0);
    img(s, efx("キラキラ_1.png"), 0.0, -0.3, 2.0, 1.5);
    img(s, efx("爆発_1.png"), 4.5, -0.3, 2.5, 2.0);
    img(s, efx("矢印_赤_1.png"), 3.0, 3.5, 2.0, 1.5);
    drawBigText(s, "7ステップで", 2.5, 0.3, 5.0, 0.8, { fontSize: 32, color: C.textBlue });
    drawBigText(s, "配信設定", 2.5, 1.0, 5.0, 1.0, { fontSize: 44, color: C.textRed });
    drawBigText(s, "半永久完了！！", 2.0, 2.0, 6.0, 1.0, { fontSize: 40, color: C.textOrange });
    drawBubble(s, pres, "ライブ配信＋録画＋音どり\n全部これ1つでOK！", 3.0, 3.2, 4.5, 1.5, { fontSize: 22, tailDir: "bottom-left" });
    drawBigText(s, "大は小を兼ねる💪", 2.5, 4.8, 5.0, 0.7, { fontSize: 24, color: C.textPink });
    ch(s);
}

const outName = "obs_pattern2_v5b_10slides.pptx";
const outPath = path.join(__dirname, "output", outName);
const sharedPath = `C:\\KEI IWASAKI\\shared-context\\${outName}`;
pres.writeFile({ fileName: `output/${outName}` }).then(() => {
    console.log(`PPTX OK: ${outName}`);
    fs.copyFileSync(outPath, sharedPath);
    console.log("Copied to shared-context");
}).catch(e => console.error(e.message));
