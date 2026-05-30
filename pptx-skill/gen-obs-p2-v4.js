/**
 * OBS設定7ステップ — パターン2 v4（addImageExact版 10枚）
 * チャンネル: suyaのAI×動画編集教室
 * 素材: C:\KEI IWASAKI\assets\suya_ai_movie\
 * 歪み100%解消: addImageExact（実ピクセルからアスペクト比計算）
 */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { COLORS_CHARACTER: C, FONTS, drawBubble, drawBigText, addImageExact } = require("./lib/shared");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

const ASSET = "C:\\KEI IWASAKI\\assets\\suya_ai_movie";
const CHR = path.join(ASSET, "characters");
const EFX = path.join(ASSET, "effects");
const chr = n => path.join(CHR, n);
const efx = n => path.join(EFX, n);
const img = (s, p, x, y, w, h) => addImageExact(s, p, x, y, w, h);

function ch(s) {
    s.addText("suyaのAI×動画編集教室", {
        x: 6.5, y: 5.0, w: 3.3, h: 0.5,
        fontSize: 12, fontFace: FONTS.heading,
        color: C.textRed, bold: true, align: "right", valign: "middle",
    });
}

// #01 タイトル（6要素 + テキスト4箇所）
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

// #02 トラブル4選（6要素 + テキスト4箇所）
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("困り_1.png"), -0.5, 1.3, 3.5, 4.0);
    img(s, chr("泣き_2.png"), 7.2, 0.8, 3.0, 3.8);
    img(s, efx("爆発_1.png"), 6.8, -0.5, 3.5, 2.5);
    img(s, efx("ビックリ_1.png"), 2.8, -0.2, 1.8, 1.8);
    img(s, efx("バツ_1.png"), 0.3, -0.2, 1.5, 1.5);
    img(s, efx("矢印_赤_1.png"), 0.0, 4.2, 2.5, 1.5);
    drawBubble(s, pres, "🔇 音が出ない！\n💻 個人情報映る！", 0.5, 0.2, 3.8, 1.5, { fontSize: 20, tailDir: "bottom-left" });
    drawBubble(s, pres, "📢 ノイズ垂れ流し\n💥 音割れで離脱", 5.8, 0.2, 4.0, 1.5, { fontSize: 20, tailDir: "bottom-right" });
    drawBigText(s, "全部、設定1回で", 1.8, 3.3, 6.5, 1.0, { fontSize: 36, color: C.textRed });
    drawBigText(s, "防げます！！", 2.5, 4.2, 5.5, 1.2, { fontSize: 44, color: C.textOrange });
    ch(s);
}

// #03 7ステップ一覧（5要素 + ステップリスト + 吹き出し）
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("解説_1.png"), -0.5, 0.2, 3.3, 4.0);
    img(s, chr("ガッツポーズ_1.png"), 7.2, 2.5, 3.0, 3.2);
    img(s, efx("矢印_赤_1.png"), 2.3, -0.2, 1.8, 1.2);
    img(s, efx("矢印_赤_1.png"), 8.0, 0.2, 1.8, 1.2);
    img(s, efx("キラキラ_1.png"), 8.0, -0.3, 2.0, 2.0);
    drawBigText(s, "今日の7ステップ", 2.5, -0.1, 5.5, 0.8, { fontSize: 30, color: C.textRed });
    [
        { t: "① DL＆インストール", c: C.textBlack },
        { t: "② 画面の見方", c: C.textBlack },
        { t: "③ 映像設定", c: C.textBlack },
        { t: "④ 音声設定 ←最重要！", c: C.textRed },
        { t: "⑤ YouTube連携", c: C.textBlack },
        { t: "⑥ テスト配信", c: C.textBlack },
        { t: "⑦ 事故防止チェック！", c: C.textOrange },
    ].forEach((st, i) => {
        s.addText(st.t, {
            x: 2.8, y: 0.8 + i * 0.58, w: 5.0, h: 0.55,
            fontSize: 22, fontFace: FONTS.heading, bold: true, color: st.c
        });
    });
    drawBubble(s, pres, "配信+録画+音どり\n全部これ1つ！", 4.8, 4.5, 3.5, 1.2, { fontSize: 20, tailDir: "bottom-right" });
    ch(s);
}

// #04 マイク選び（5要素 + 吹き出し2 + テキスト2）
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

// #05 STEP①② DL＋画面の見方（4要素 + 吹き出し2 + テキスト2）
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

// #06 STEP③ 映像設定（4要素 + 吹き出し + テキスト3）
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

// #07 STEP④ 音声設定（6要素 + 吹き出し + テキスト3）
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

// #08 STEP⑤⑥ YouTube連携＋テスト（5要素 + 吹き出し2 + テキスト2）
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

// #09 STEP⑦ 事故防止チェック（6要素 + チェックリスト + テキスト1）
{
    const s = pres.addSlide(); s.background = { color: C.bgWhite };
    img(s, chr("ショック_1.jpg"), -0.5, 0.2, 3.3, 3.8);
    img(s, chr("怒り_1.png"), 7.3, 0.2, 3.0, 3.5);
    img(s, efx("爆発_2.png"), 6.8, -0.5, 3.5, 2.5);
    img(s, efx("バツ_1.png"), 2.5, -0.3, 1.8, 1.8);
    img(s, efx("下降_1.png"), -0.2, -0.3, 2.0, 2.0);
    img(s, efx("矢印_赤_1.png"), 0.0, 4.5, 2.5, 1.2);
    drawBigText(s, "STEP⑦ 事故防止チェック", 2.0, -0.2, 6.5, 0.7, { fontSize: 28, color: C.textRed });
    [
        { t: "□ 通知OFF！", c: C.textBlack },
        { t: "□ ブクマバー非表示！", c: C.textBlack },
        { t: "□ ウィンドウ指定！", c: C.textRed },
        { t: "□ マイク音量テスト！", c: C.textRed },
        { t: "□ ノイズ抑制ON！", c: C.textOrange },
        { t: "□ 10秒テスト録画！", c: C.textOrange },
    ].forEach((it, i) => {
        s.addText(it.t, {
            x: 2.5, y: 0.6 + i * 0.58, w: 5.5, h: 0.55,
            fontSize: 22, fontFace: FONTS.heading, bold: true, color: it.c
        });
    });
    drawBigText(s, "毎回確認→事故ゼロ！！", 1.0, 4.3, 8.0, 1.0, { fontSize: 36, color: C.textRed });
    ch(s);
}

// #10 まとめ（6要素 + 吹き出し + テキスト4）
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

const outName = "obs_pattern2_v4_10slides.pptx";
const outPath = path.join(__dirname, "output", outName);
const sharedPath = path.join("C:\\KEI IWASAKI\\shared-context", outName);
pres.writeFile({ fileName: `output/${outName}` }).then(() => {
    console.log(`PPTX OK: ${outName}`);
    fs.copyFileSync(outPath, sharedPath);
    console.log("Copied to shared-context");
}).catch(e => console.error(e.message));
