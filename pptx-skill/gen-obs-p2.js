/**
 * OBS設定7ステップ — パターン2テスト（10枚）
 * チャンネル: suyaのAI×動画編集教室
 * キャラ素材＋エフェクト素材を使用
 */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { COLORS_CHARACTER: C, FONTS, drawBubble, drawBigText, addChannelRegister } = require("./lib/shared");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

const PPL = path.join(__dirname, "assets", "characters", "people");
const EFX = path.join(__dirname, "assets", "characters", "effects");
function ppl(name) { return path.join(PPL, name); }
function efx(name) { return path.join(EFX, name); }

function img(s, p, x, y, w, h) {
    if (fs.existsSync(p)) {
        s.addImage({ path: p, x, y, w, h });
    }
}

// チャンネル登録を「suyaのAI×動画編集教室」に変更
function addChannel(s) {
    s.addText("suyaのAI×\n動画編集教室", {
        x: 7.5, y: 4.9, w: 2.3, h: 0.6,
        fontSize: 10, fontFace: FONTS.heading,
        color: C.textRed, bold: true, align: "right", valign: "middle",
    });
}

// #01 タイトル — 笑顔＋爆発＋キラキラ
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_1.png"), 0.2, 1.2, 2.8, 3.2);
    img(s, efx("爆発_1.png"), 6.5, 0.3, 3.2, 2.5);
    img(s, efx("キラキラ_1.png"), 8.2, 3.5, 1.5, 1.5);
    drawBigText(s, "OBS Studio\n完全設定ガイド", 3.0, 0.3, 6.5, 2.5, { fontSize: 44, color: C.textRed });
    drawBubble(s, pres, "マネするだけ！\n一回設定したら半永久！", 3.0, 3.2, 4.5, 1.5, { fontSize: 20, tailDir: "bottom-left" });
    addChannel(s);
}

// #02 こんなトラブル — 困り＋ビックリ＋爆発
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("困り_1.png"), 0.0, 1.5, 2.8, 3.5);
    img(s, efx("ビックリ_1.png"), 2.5, 0.3, 1.2, 1.2);
    img(s, efx("爆発_2.png"), 7.5, 0.2, 2.2, 1.8);
    drawBubble(s, pres, "🔇 音が出ない\n💻 個人情報が映る\n📢 ノイズ垂れ流し\n💥 音割れで離脱", 3.0, 0.3, 4.2, 2.5, { fontSize: 18, tailDir: "bottom-left" });
    drawBigText(s, "全部、設定1回で防げます！", 2.5, 3.5, 7.0, 1.5, { fontSize: 34, color: C.textRed });
    addChannel(s);
}

// #03 7ステップ一覧 — 解説＋矢印
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("解説_1.png"), 0.0, 0.3, 2.5, 3.5);
    drawBigText(s, "今日の7ステップ", 2.5, 0.1, 7.0, 0.7, { fontSize: 30, color: C.textBlue });
    const steps = [
        "① ダウンロード＆インストール",
        "② 画面の見方",
        "③ 映像設定",
        "④ 音声設定 ← 一番大事！",
        "⑤ YouTube連携",
        "⑥ テスト配信",
        "⑦ 事故防止チェック",
    ];
    steps.forEach((st, i) => {
        const isRed = i === 3 || i === 6;
        s.addText(st, {
            x: 2.8, y: 0.9 + i * 0.55, w: 5.5, h: 0.5,
            fontSize: 20, fontFace: FONTS.heading, bold: true,
            color: isRed ? C.textRed : C.textBlack,
        });
    });
    img(s, efx("矢印_赤_1.png"), 8.0, 1.0, 1.5, 1.2);
    img(s, efx("矢印_赤_1.png"), 8.0, 3.5, 1.5, 1.2);
    drawBubble(s, pres, "配信+録画+音どり\n全部これ1つ！", 5.5, 4.2, 3.5, 1.2, { fontSize: 16, tailDir: "bottom-right" });
    addChannel(s);
}

// #04 マイク選び — 驚き＋バツ＋丸＋ガッツポーズ
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("驚き_2.png"), 0.0, 1.5, 2.5, 3.0);
    drawBigText(s, "マイク選び", 0.5, 0.1, 9.0, 0.7, { fontSize: 30, color: C.textBlue });
    // コンデンサー（バツ）
    drawBubble(s, pres, "コンデンサー\n声質が変わる\n環境音を拾う", 2.5, 0.9, 3.0, 2.0, { fontSize: 16, tailDir: "bottom-left" });
    img(s, efx("バツ_1.png"), 4.8, 0.8, 0.8, 0.8);
    // ダイナミック（マル）
    drawBubble(s, pres, "ダイナミック◎\nナチュラルな声\n1万円前後", 6.0, 0.9, 3.2, 2.0, { fontSize: 16, tailDir: "bottom-right" });
    img(s, efx("丸_1.png"), 5.5, 0.8, 0.8, 0.8);
    img(s, ppl("ガッツポーズ_1.png"), 7.5, 3.0, 2.2, 2.2);
    drawBigText(s, "おすすめ: ゼンハイザー e945", 1.5, 3.8, 6.0, 1.2, { fontSize: 26, color: C.textOrange });
    addChannel(s);
}

// #05 STEP 1-2: DL＋画面の見方 — 笑顔＋吹き出し素材＋疑問
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_2.png"), 0.0, 1.5, 2.5, 3.0);
    drawBigText(s, "STEP①② DL＋画面の見方", 0.3, 0.1, 9.4, 0.7, { fontSize: 28, color: C.textBlue });
    img(s, efx("吹き出し_1.png"), 2.5, 0.9, 3.5, 2.5);
    s.addText("① 「OBS Studio」で検索\n② 公式サイトからDL\n③ 「次へ」で全部OK\n④ 起動できたら完了！", {
        x: 2.8, y: 1.2, w: 2.8, h: 2.0,
        fontSize: 16, fontFace: FONTS.heading, bold: true, color: C.textBlack, lineSpacingMultiple: 1.3,
    });
    img(s, ppl("疑問_1.png"), 7.0, 1.0, 2.5, 2.5);
    drawBubble(s, pres, "覚えることは1つだけ\nレイヤー＝層", 6.2, 3.2, 3.5, 1.5, { fontSize: 16, tailDir: "bottom-right" });
    drawBigText(s, "上にあるものが手前に表示", 1.0, 4.0, 5.5, 1.0, { fontSize: 24, color: C.textRed });
    img(s, efx("上昇_1.png"), 0.0, 3.8, 1.3, 1.3);
    addChannel(s);
}

// #06 STEP 3: 映像設定 — 笑顔＋丸＋キラキラ
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_3.png"), 0.0, 1.0, 2.5, 3.5);
    drawBigText(s, "STEP③ 映像設定", 0.3, 0.1, 9.4, 0.7, { fontSize: 30, color: C.textBlue });
    drawBubble(s, pres, "ベース解像度：1920×1080\n出力解像度：1920×1080\nFPS：30fps", 3.0, 1.0, 4.5, 2.2, { fontSize: 18, tailDir: "bottom-left" });
    img(s, efx("丸_1.png"), 7.5, 1.5, 1.5, 1.5);
    drawBigText(s, "迷ったらこの通りでOK！", 2.5, 3.8, 6.5, 1.2, { fontSize: 28, color: C.textOrange });
    img(s, efx("キラキラ_1.png"), 8.0, 3.5, 1.5, 1.5);
    addChannel(s);
}

// #07 STEP 4: 音声設定（最重要！） — 泣き＋爆発＋ビックリ
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("泣き_1.png"), 0.0, 1.0, 2.8, 3.5);
    img(s, efx("爆発_1.png"), 7.5, 0.0, 2.5, 2.0);
    drawBigText(s, "STEP④ 音声設定", 0.3, 0.0, 5.0, 0.7, { fontSize: 30, color: C.textRed });
    drawBigText(s, "←一番大事！", 5.0, 0.0, 4.5, 0.7, { fontSize: 26, color: C.textOrange });
    drawBubble(s, pres, "デスクトップ音声：既定\nマイク：使うマイクを選択\nノイズ抑制：RNNoise推奨\n音量：-5〜-10dB目安", 2.8, 1.0, 4.5, 2.5, { fontSize: 16, tailDir: "bottom-left" });
    img(s, efx("ビックリ_1.png"), 7.5, 2.5, 1.2, 1.2);
    drawBubble(s, pres, "フィルタはミキサーの\n⚙から追加！", 6.0, 3.5, 3.5, 1.3, { fontSize: 16, tailDir: "bottom-right" });
    addChannel(s);
}

// #08 STEP 5-6: YouTube連携＋テスト — 笑顔＋矢印青＋考え中
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("笑顔_1.png"), 7.0, 0.5, 2.5, 3.0);
    drawBigText(s, "STEP⑤⑥ YouTube連携＋テスト", 0.3, 0.1, 9.4, 0.7, { fontSize: 26, color: C.textBlue });
    drawBubble(s, pres, "① 設定→配信→YouTube\n② アカウント接続\n③ Googleでログイン\n④ 完了！", 0.3, 0.9, 4.0, 2.2, { fontSize: 16, tailDir: "bottom-left" });
    img(s, efx("矢印_青_1.png"), 4.5, 1.5, 1.5, 1.2);
    img(s, ppl("考え中_1.png"), 0.0, 3.0, 2.5, 2.5);
    drawBubble(s, pres, "テスト配信チェック\n🎵バー動く？ 🎤声入る？\n📺正しい画面？ 📊CPU？", 2.5, 3.2, 4.5, 1.8, { fontSize: 16, tailDir: "bottom-right" });
    drawBigText(s, "「限定公開」で安心テスト", 5.0, 4.5, 4.5, 0.8, { fontSize: 22, color: C.textOrange });
    addChannel(s);
}

// #09 STEP 7: 事故防止チェック — ショック＋バツ＋爆発
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("ショック_1.jpg"), 0.0, 0.5, 2.5, 3.0);
    drawBigText(s, "STEP⑦ 事故防止チェック", 0.3, 0.0, 9.4, 0.7, { fontSize: 28, color: C.textRed });
    const items = [
        "□ 通知OFF（メール/LINE/Slack）",
        "□ ブックマークバー非表示",
        "□ 画面キャプチャ: ウィンドウ指定",
        "□ マイク音量テスト",
        "□ ノイズ抑制ON確認",
        "□ 10秒テスト録画で最終確認",
    ];
    items.forEach((it, i) => {
        s.addText(it, {
            x: 2.5, y: 0.8 + i * 0.6, w: 5.5, h: 0.55,
            fontSize: 18, fontFace: FONTS.heading, bold: true,
            color: i >= 3 ? C.textRed : C.textBlack,
        });
    });
    img(s, efx("バツ_1.png"), 7.5, 0.5, 1.2, 1.2);
    img(s, efx("爆発_2.png"), 7.0, 3.5, 2.5, 2.0);
    drawBigText(s, "毎回確認→事故ゼロ！", 2.0, 4.5, 5.5, 0.8, { fontSize: 26, color: C.textRed });
    addChannel(s);
}

// #10 まとめ — ガッツポーズ＋キラキラ×2
{
    const s = pres.addSlide();
    s.background = { color: C.bgWhite };
    img(s, ppl("ガッツポーズ_1.png"), 0.0, 1.0, 3.0, 3.5);
    img(s, efx("キラキラ_1.png"), 7.5, 0.3, 2.0, 2.0);
    img(s, efx("キラキラ_1.png"), 0.3, 0.0, 1.5, 1.5);
    drawBigText(s, "7ステップで\n配信設定\n半永久完了！", 3.0, 0.3, 6.5, 2.5, { fontSize: 42, color: C.textRed });
    drawBubble(s, pres, "ライブ配信＋録画＋音どり\n全部これ1つでOK！", 3.5, 3.2, 4.5, 1.5, { fontSize: 20, tailDir: "bottom-left" });
    drawBigText(s, "大は小を兼ねる 💪", 3.0, 4.8, 6.5, 0.7, { fontSize: 24, color: C.textOrange });
    addChannel(s);
}

const outName = "obs_pattern2_10slides.pptx";
pres.writeFile({ fileName: `output/${outName}` }).then(() => {
    console.log(`PPTX OK: ${outName}`);
    // shared-contextにもコピー
    const srcPath = path.join(__dirname, "output", outName);
    fs.copyFileSync(srcPath, `C:\\KEI IWASAKI\\shared-context\\${outName}`);

    // Discord送信
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1477627818799268044/dw82StS-q_aMdRQtvaLafSIzt80a_PdccJPXLkjHUaI7TJ5_w_wHb6mrKnKG4LETaOlq";
    const fileBuf = fs.readFileSync(srcPath);
    const bnd = "----FB" + Date.now();
    const CR = "\r\n";
    const pj = JSON.stringify({ content: "🎨 **OBS設定 パターン2テスト（10枚）**\nチャンネル: suyaのAI×動画編集教室\n\n✅ キャラ素材使用（笑顔/困り/泣き/驚き/解説/ショック/ガッツポーズ/考え中/疑問）\n✅ エフェクト素材使用（爆発/吹き出し/矢印/キラキラ/丸/バツ/ビックリ/上昇）\n✅ 吹き出し＋太字影テキスト＋コラージュ配置\n\n📌 PDFも後ほど送ります" });
    const pp = Buffer.from("--" + bnd + CR + 'Content-Disposition: form-data; name="payload_json"' + CR + "Content-Type: application/json" + CR + CR + pj + CR, "utf-8");
    const hb = Buffer.from("--" + bnd + CR + `Content-Disposition: form-data; name="files[0]"; filename="${outName}"` + CR + "Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation" + CR + CR, "utf-8");
    const fb = Buffer.from(CR + "--" + bnd + "--" + CR, "utf-8");
    return fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "multipart/form-data; boundary=" + bnd }, body: Buffer.concat([pp, hb, fileBuf, fb]) });
}).then(r => console.log("Discord:", r.status)).catch(e => console.error(e.message));
