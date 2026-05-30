const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

// =============================================================
// 共通設定
// =============================================================
pres.layout = "LAYOUT_16x9";
pres.author = "バフェット探求";
pres.title = "投資の神様が最後に遺したのは、株の話じゃなかった。";

const COLORS = {
  headerRed: "CC0000",
  textRed: "CC0000",
  white: "FFFFFF",
  black: "000000",
  darkGray: "333333",
  lightGray: "F2F2F2",
  highlightYellow: "FFD600",
  green: "00AA44",
  blue: "0066CC",
  orange: "FF6600",
  pink: "FF3366",
};
const FONT = "Noto Sans JP";
const FONT_EN = "Roboto";

// =============================================================
// ヘルパー関数
// =============================================================
function addHeader(slide, title) {
  // 赤帯
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 0.7,
    fill: { color: COLORS.headerRed },
  });
  // タイトルテキスト
  slide.addText(title, {
    x: 0.3, y: 0.05, w: 9.4, h: 0.6,
    fontSize: 28, fontFace: FONT, color: COLORS.white,
    bold: true, align: "left",
  });
}

function addSource(slide, text) {
  slide.addText(text, {
    x: 0.3, y: 5.0, w: 9.4, h: 0.3,
    fontSize: 14, fontFace: FONT, color: "888888",
    italic: true, align: "right",
  });
}

// =============================================================
// #01 timeline — バフェットの軌跡
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "バフェットの軌跡 — 64年間の複利人生");

  const events = [
    { year: "1930", label: "オマハに\n誕生" },
    { year: "1941", label: "11歳で\n初の株購入" },
    { year: "1965", label: "BRK取得\n10万円→" },
    { year: "2008", label: "リーマン\nGS $75億投資" },
    { year: "2024", label: "資産\n10兆円超" },
    { year: "2025", label: "引退\n最後の手紙" },
  ];

  // 横線
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8, y: 2.8, w: 8.4, h: 0.06,
    fill: { color: COLORS.headerRed },
  });

  events.forEach((e, i) => {
    const xPos = 0.8 + i * 1.5;
    // 丸ポイント
    slide.addShape(pres.ShapeType.ellipse, {
      x: xPos + 0.15, y: 2.55, w: 0.35, h: 0.35,
      fill: { color: i === events.length - 1 ? COLORS.highlightYellow : COLORS.headerRed },
      line: { color: COLORS.headerRed, width: 2 },
    });
    // 年
    slide.addText(e.year, {
      x: xPos - 0.15, y: 2.0, w: 1.0, h: 0.4,
      fontSize: 18, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center",
    });
    // ラベル
    slide.addText(e.label, {
      x: xPos - 0.2, y: 3.2, w: 1.1, h: 0.8,
      fontSize: 14, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
    });
  });

  // ハイライト
  slide.addText("10万円 → 44億円（4,400,000%）", {
    x: 1.5, y: 4.3, w: 7.0, h: 0.5,
    fontSize: 24, fontFace: FONT, bold: true, color: COLORS.headerRed,
    align: "center",
  });
}

// =============================================================
// #02 table — 最後の手紙に書かれていたもの / いなかったもの
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "最後の手紙の中身 — 株の話は一切なかった");

  const rows = [
    [
      { text: "", options: { fill: COLORS.headerRed } },
      { text: "✅ 書かれていた", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
      { text: "❌ 書かれていなかった", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
    ],
    [
      { text: "1", options: { fill: COLORS.lightGray, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
      { text: "死亡記事の教訓\n（ふさわしい人生を生きろ）", options: { fontSize: 18, fontFace: FONT, align: "center" } },
      { text: "銘柄名", options: { fontSize: 18, fontFace: FONT, align: "center" } },
    ],
    [
      { text: "2", options: { fill: COLORS.lightGray, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
      { text: "清掃員も会長と同じ人間\n（優しさはコストゼロ）", options: { fontSize: 18, fontFace: FONT, align: "center" } },
      { text: "チャートの読み方", options: { fontSize: 18, fontFace: FONT, align: "center" } },
    ],
    [
      { text: "3", options: { fill: COLORS.lightGray, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
      { text: "信頼と人間性\n（グレッグへの信頼）", options: { fontSize: 18, fontFace: FONT, align: "center" } },
      { text: "テクニカル分析", options: { fontSize: 18, fontFace: FONT, align: "center" } },
    ],
    [
      { text: "4", options: { fill: COLORS.lightGray, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
      { text: "嫉妬と強欲への警告", options: { fontSize: 18, fontFace: FONT, align: "center" } },
      { text: "おすすめ投資信託", options: { fontSize: 18, fontFace: FONT, align: "center" } },
    ],
  ];

  slide.addTable(rows, {
    x: 0.5, y: 1.0, w: 9.0,
    border: { type: "solid", pt: 1, color: "CCCCCC" },
    rowH: [0.5, 0.7, 0.7, 0.7, 0.7],
    colW: [0.8, 4.1, 4.1],
  });

  addSource(slide, "出典：バフェット最後の年次書簡 (2025/11)");
}

// =============================================================
// #03 comparison — 10兆円の朝食 vs 一般的な富裕層
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "10兆円の男の生活 vs 一般的な富裕層イメージ");

  // 左側ボックス
  slide.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 1.0, w: 4.3, h: 3.8,
    fill: { color: "F0FFF0" },
    line: { color: COLORS.green, width: 2 },
    rectRadius: 0.1,
  });
  slide.addText("バフェット（現実）", {
    x: 0.3, y: 1.0, w: 4.3, h: 0.5,
    fontSize: 22, fontFace: FONT, bold: true, color: COLORS.green, align: "center",
  });
  slide.addText(
    "🍔 朝食: マクドナルド $3.17\n🏠 自宅: 1958年購入 $31,500\n👔 服装: 地味なスーツ\n🚗 車: 自分で運転\n💰 哲学: 質素＝戦略",
    {
      x: 0.5, y: 1.6, w: 3.9, h: 3.0,
      fontSize: 20, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "left",
      lineSpacingMultiple: 1.8,
    }
  );

  // VS
  slide.addText("VS", {
    x: 4.3, y: 2.5, w: 1.4, h: 0.6,
    fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.headerRed, align: "center",
  });

  // 右側ボックス
  slide.addShape(pres.ShapeType.rect, {
    x: 5.4, y: 1.0, w: 4.3, h: 3.8,
    fill: { color: "FFF0F0" },
    line: { color: COLORS.headerRed, width: 2 },
    rectRadius: 0.1,
  });
  slide.addText("一般的な金持ちイメージ", {
    x: 5.4, y: 1.0, w: 4.3, h: 0.5,
    fontSize: 22, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
  slide.addText(
    "🍽️ 食事: ミシュラン三つ星\n🏰 自宅: 豪邸・タワマン\n👑 服装: ブランド品\n🏎️ 車: フェラーリ\n💸 哲学: 見栄＝ステータス",
    {
      x: 5.6, y: 1.6, w: 3.9, h: 3.0,
      fontSize: 20, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "left",
      lineSpacingMultiple: 1.8,
    }
  );
}

// =============================================================
// #04 stats — CEO報酬エスカレーション
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "CEO報酬エスカレーション — 嫉妬が生んだ暴走");

  slide.addText("1,460%", {
    x: 0.5, y: 1.2, w: 4.5, h: 1.5,
    fontSize: 72, fontFace: FONT_EN, bold: true, color: COLORS.headerRed, align: "center",
  });
  slide.addText("CEO報酬の増加率\n（1978年〜2024年）", {
    x: 0.5, y: 2.6, w: 4.5, h: 0.8,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });

  slide.addText("24%", {
    x: 5.0, y: 1.2, w: 4.5, h: 1.5,
    fontSize: 72, fontFace: FONT_EN, bold: true, color: "888888", align: "center",
  });
  slide.addText("中位労働者の\n賃金増加率（同期間）", {
    x: 5.0, y: 2.6, w: 4.5, h: 0.8,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });

  // 格差ハイライト
  slide.addShape(pres.ShapeType.rect, {
    x: 1.0, y: 3.7, w: 8.0, h: 0.8,
    fill: { color: COLORS.highlightYellow },
    rectRadius: 0.1,
  });
  slide.addText("「嫉妬と強欲は、常に手を取り合って歩くのです」— バフェット", {
    x: 1.0, y: 3.7, w: 8.0, h: 0.8,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });

  addSource(slide, "出典：Economic Policy Institute (2024)");
}

// =============================================================
// #05 checklist — バフェットの投資適性チェック
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "バフェットの投資適性チェック — 株を買うな条件");

  const checks = [
    { icon: "✗", text: "長期保有する気がない", note: "→ 短期売買は投機であり投資ではない" },
    { icon: "✗", text: "経済的・精神的準備ができていない", note: "→ 余剰資金でなければ恐怖に負ける" },
    { icon: "✗", text: "50%下落に耐えられない", note: "→ BRK株は60年で3度50%下落した" },
  ];

  checks.forEach((c, i) => {
    const yPos = 1.2 + i * 1.2;
    // アイコン
    slide.addShape(pres.ShapeType.ellipse, {
      x: 0.5, y: yPos, w: 0.6, h: 0.6,
      fill: { color: COLORS.headerRed },
    });
    slide.addText(c.icon, {
      x: 0.5, y: yPos, w: 0.6, h: 0.6,
      fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.white, align: "center",
    });
    // テキスト
    slide.addText(c.text, {
      x: 1.3, y: yPos - 0.05, w: 5.5, h: 0.5,
      fontSize: 24, fontFace: FONT, bold: true, color: COLORS.darkGray,
    });
    // 補足
    slide.addText(c.note, {
      x: 1.3, y: yPos + 0.45, w: 7.0, h: 0.4,
      fontSize: 16, fontFace: FONT, color: "666666", italic: true,
    });
  });

  // 結論
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.3, w: 9.0, h: 0.6,
    fill: { color: COLORS.headerRed },
    rectRadius: 0.1,
  });
  slide.addText("一つでも当てはまるなら「株を買うな」— これが神様の本音", {
    x: 0.5, y: 4.3, w: 9.0, h: 0.6,
    fontSize: 22, fontFace: FONT, bold: true, color: COLORS.white, align: "center",
  });
}

// =============================================================
// #06 diagram — 節約 vs 倹約戦略
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "節約（我慢ベース） vs バフェット式 倹約戦略");

  // 上段: 節約ルート
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.2, w: 2.0, h: 0.8,
    fill: { color: "FFE0E0" }, line: { color: COLORS.headerRed, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("節約\n（我慢ベース）", {
    x: 0.5, y: 1.2, w: 2.0, h: 0.8,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
  slide.addText("→", { x: 2.5, y: 1.3, w: 0.5, h: 0.6, fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center" });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 3.0, y: 1.2, w: 2.0, h: 0.8,
    fill: { color: "FFE0E0" }, line: { color: COLORS.headerRed, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("300万で\n停滞", {
    x: 3.0, y: 1.2, w: 2.0, h: 0.8,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
  slide.addText("→", { x: 5.0, y: 1.3, w: 0.5, h: 0.6, fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center" });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.5, y: 1.2, w: 2.0, h: 0.8,
    fill: { color: "FFE0E0" }, line: { color: COLORS.headerRed, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("リバウンド\n（反動消費）", {
    x: 5.5, y: 1.2, w: 2.0, h: 0.8,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
  slide.addText("→", { x: 7.5, y: 1.3, w: 0.5, h: 0.6, fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center" });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 8.0, y: 1.2, w: 1.5, h: 0.8,
    fill: { color: "FFE0E0" }, line: { color: COLORS.headerRed, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("振り出し", {
    x: 8.0, y: 1.2, w: 1.5, h: 0.8,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });

  // 下段: バフェット式
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 3.0, w: 2.0, h: 0.8,
    fill: { color: "E0FFE0" }, line: { color: COLORS.green, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("バフェット式\n（自然な選択）", {
    x: 0.5, y: 3.0, w: 2.0, h: 0.8,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.green, align: "center",
  });
  slide.addText("→", { x: 2.5, y: 3.1, w: 0.5, h: 0.6, fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center" });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 3.0, y: 3.0, w: 2.0, h: 0.8,
    fill: { color: "E0FFE0" }, line: { color: COLORS.green, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("使わない＝\n回すため", {
    x: 3.0, y: 3.0, w: 2.0, h: 0.8,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.green, align: "center",
  });
  slide.addText("→", { x: 5.0, y: 3.1, w: 0.5, h: 0.6, fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center" });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.5, y: 3.0, w: 2.0, h: 0.8,
    fill: { color: "E0FFE0" }, line: { color: COLORS.green, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("64年間\n継続", {
    x: 5.5, y: 3.0, w: 2.0, h: 0.8,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.green, align: "center",
  });
  slide.addText("→", { x: 7.5, y: 3.1, w: 0.5, h: 0.6, fontSize: 28, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center" });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 8.0, y: 3.0, w: 1.5, h: 0.8,
    fill: { color: COLORS.green }, rectRadius: 0.1,
  });
  slide.addText("10兆円", {
    x: 8.0, y: 3.0, w: 1.5, h: 0.8,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.white, align: "center",
  });

  slide.addText("「質素に生きることは修行ではなく、戦略だ」", {
    x: 1.0, y: 4.3, w: 8.0, h: 0.5,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });
}

// =============================================================
// #07 diagram — ピンボール複利チェーン
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "ピンボール複利チェーン — 14歳から始まった「回す」習慣");

  const steps = [
    { label: "新聞配達", sub: "種銭" },
    { label: "ピンボール\n1台", sub: "理髪店設置" },
    { label: "2台→3台\n→4台", sub: "利益を再投資" },
    { label: "売却\n$1,200", sub: "事業EXIT" },
    { label: "農場\n40エーカー", sub: "不動産投資" },
    { label: "株式投資", sub: "バリュー投資" },
    { label: "企業買収\nBRK", sub: "10兆円" },
  ];

  steps.forEach((s, i) => {
    const xPos = 0.3 + i * 1.35;
    const color = i === steps.length - 1 ? COLORS.headerRed : COLORS.blue;

    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos, y: 1.5, w: 1.2, h: 1.2,
      fill: { color: i === steps.length - 1 ? COLORS.headerRed : "E8F0FE" },
      line: { color: color, width: 2 }, rectRadius: 0.1,
    });
    slide.addText(s.label, {
      x: xPos, y: 1.5, w: 1.2, h: 0.8,
      fontSize: 13, fontFace: FONT, bold: true,
      color: i === steps.length - 1 ? COLORS.white : COLORS.blue, align: "center",
    });
    slide.addText(s.sub, {
      x: xPos, y: 2.3, w: 1.2, h: 0.4,
      fontSize: 11, fontFace: FONT, color: i === steps.length - 1 ? COLORS.white : "666666", align: "center",
    });

    if (i < steps.length - 1) {
      slide.addText("→", {
        x: xPos + 1.15, y: 1.8, w: 0.3, h: 0.5,
        fontSize: 22, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center",
      });
    }
  });

  // コカ・コーラ補足
  slide.addShape(pres.ShapeType.roundRect, {
    x: 1.0, y: 3.3, w: 8.0, h: 0.7,
    fill: { color: COLORS.lightGray }, rectRadius: 0.1,
  });
  slide.addText("💡 小学生時代：コカ・コーラ6本パックを仕入値で買い、1本ずつ利益を乗せて販売", {
    x: 1.0, y: 3.3, w: 8.0, h: 0.7,
    fontSize: 18, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });

  slide.addText("「複利は世界第8の不思議だ」— バフェット", {
    x: 1.0, y: 4.3, w: 8.0, h: 0.5,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
}

// =============================================================
// #08 comparison — 「使う」vs「回す」分岐点
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "「使う」vs 「回す」— 人生を決める分岐点");

  // 左: 使うループ
  slide.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 1.0, w: 4.3, h: 3.8,
    fill: { color: "FFF5F5" }, line: { color: COLORS.headerRed, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("❌ 使うループ", {
    x: 0.3, y: 1.0, w: 4.3, h: 0.5,
    fontSize: 22, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
  slide.addText(
    "利益が出る\n  ↓\n消費する（旅行・車・ブランド）\n  ↓\nゼロに戻る\n  ↓\nまた稼ぐ → 繰り返し",
    {
      x: 0.5, y: 1.6, w: 3.9, h: 3.0,
      fontSize: 18, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
      lineSpacingMultiple: 1.5,
    }
  );

  // 右: 回す螺旋  
  slide.addShape(pres.ShapeType.rect, {
    x: 5.4, y: 1.0, w: 4.3, h: 3.8,
    fill: { color: "F0FFF0" }, line: { color: COLORS.green, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("✅ 回す螺旋", {
    x: 5.4, y: 1.0, w: 4.3, h: 0.5,
    fontSize: 22, fontFace: FONT, bold: true, color: COLORS.green, align: "center",
  });
  slide.addText(
    "利益が出る\n  ↓\n再投資する\n  ↓\nさらに利益が出る\n  ↓\nさらに再投資 → 螺旋上昇 🚀",
    {
      x: 5.6, y: 1.6, w: 3.9, h: 3.0,
      fontSize: 18, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
      lineSpacingMultiple: 1.5,
    }
  );
}

// =============================================================
// #09 formula — 複利の錯覚と現実
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "複利の「錯覚」と「現実」");

  // シミュレーション
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.2, w: 4.2, h: 2.5,
    fill: { color: "FFF8E1" }, line: { color: COLORS.orange, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("📊 よくあるシミュレーション", {
    x: 0.5, y: 1.2, w: 4.2, h: 0.5,
    fontSize: 18, fontFace: FONT, bold: true, color: COLORS.orange, align: "center",
  });
  slide.addText("1,000万 × (1.05)³⁰\n= 4,322万円", {
    x: 0.7, y: 1.8, w: 3.8, h: 1.0,
    fontSize: 28, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });
  slide.addText("年利5%で30年\n→ 自動的に4.3倍", {
    x: 0.7, y: 2.8, w: 3.8, h: 0.7,
    fontSize: 16, fontFace: FONT, color: "888888", align: "center",
  });

  // 現実
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.3, y: 1.2, w: 4.2, h: 2.5,
    fill: { color: "E8F5E9" }, line: { color: COLORS.green, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("🔥 バフェットが証明した複利", {
    x: 5.3, y: 1.2, w: 4.2, h: 0.5,
    fontSize: 18, fontFace: FONT, bold: true, color: COLORS.green, align: "center",
  });
  slide.addText("「回す」習慣\n= 資産の\nマッスルメモリー", {
    x: 5.5, y: 1.8, w: 3.8, h: 1.0,
    fontSize: 26, fontFace: FONT, bold: true, color: COLORS.green, align: "center",
  });
  slide.addText("一度身についたら\n失っても戻せる", {
    x: 5.5, y: 2.8, w: 3.8, h: 0.7,
    fontSize: 16, fontFace: FONT, color: "888888", align: "center",
  });

  // 結論
  slide.addShape(pres.ShapeType.rect, {
    x: 1.0, y: 4.0, w: 8.0, h: 0.7,
    fill: { color: COLORS.highlightYellow }, rectRadius: 0.1,
  });
  slide.addText("電卓の魔法ではない。「回す」という習慣が骨になった人間のマッスルメモリー", {
    x: 1.0, y: 4.0, w: 8.0, h: 0.7,
    fontSize: 18, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });
}

// =============================================================
// #10 chart — 11歳の失敗 シティーズ・サービス
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "11歳の失敗 — シティーズ・サービス株の教訓");

  // チャートデータ
  slide.addChart(pres.charts.LINE, [
    {
      name: "株価 ($)",
      labels: ["購入", "1週後", "2週後", "底値", "回復", "売却!", "その後", "最終"],
      values: [38, 35, 32, 27, 33, 40, 100, 200],
    },
  ], {
    x: 0.5, y: 1.0, w: 6.5, h: 3.5,
    showTitle: false,
    lineDataSymbol: "circle",
    lineDataSymbolSize: 8,
    chartColors: [COLORS.headerRed],
    valAxisMinVal: 0,
    valAxisMaxVal: 220,
    catAxisOrientation: "minMax",
    showLegend: false,
    gridLineColor: "EEEEEE",
  });

  // 注釈
  slide.addShape(pres.ShapeType.roundRect, {
    x: 7.2, y: 1.2, w: 2.5, h: 1.2,
    fill: { color: COLORS.headerRed }, rectRadius: 0.1,
  });
  slide.addText("売却\n$40\n(+$5の利益)", {
    x: 7.2, y: 1.2, w: 2.5, h: 1.2,
    fontSize: 18, fontFace: FONT, bold: true, color: COLORS.white, align: "center",
  });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 7.2, y: 2.6, w: 2.5, h: 1.2,
    fill: { color: COLORS.green }, rectRadius: 0.1,
  });
  slide.addText("もし持っていたら\n$200\n(+$162の利益)", {
    x: 7.2, y: 2.6, w: 2.5, h: 1.2,
    fontSize: 18, fontFace: FONT, bold: true, color: COLORS.white, align: "center",
  });

  slide.addText("「焦りは、敵だ」— 11歳のバフェットが学んだ最初の教訓", {
    x: 0.5, y: 4.5, w: 9.0, h: 0.4,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
}

// =============================================================
// #11 stats — 「ゆっくり金持ちになる方法」
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "「ゆっくり金持ちになる方法」— 誰もそれを好まない");

  slide.addText("64", {
    x: 1.0, y: 1.2, w: 3.5, h: 2.0,
    fontSize: 120, fontFace: FONT_EN, bold: true, color: COLORS.headerRed, align: "center",
  });
  slide.addText("年間", {
    x: 4.3, y: 1.8, w: 1.5, h: 1.0,
    fontSize: 36, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "left",
  });

  // バフェット名言
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 3.2, w: 4.3, h: 1.2,
    fill: { color: "FFF8E1" }, line: { color: COLORS.orange, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("🧓 バフェット\n「私のやり方は、ゆっくり金持ちに\nなる方法だ。誰もそれを好まない」", {
    x: 0.5, y: 3.2, w: 4.3, h: 1.2,
    fontSize: 15, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });

  // ベゾス名言
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.2, y: 3.2, w: 4.3, h: 1.2,
    fill: { color: "E8F0FE" }, line: { color: COLORS.blue, width: 2 }, rectRadius: 0.1,
  });
  slide.addText("💼 ベゾス\n「3年ではなく7年で考えられれば\n競争で大きな優位に立てる」", {
    x: 5.2, y: 3.2, w: 4.3, h: 1.2,
    fontSize: 15, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });

  slide.addText("世界で最も金持ちになった2人が口を揃えて言う → 「ゆっくりやれ」", {
    x: 0.5, y: 4.6, w: 9.0, h: 0.4,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
}

// =============================================================
// #12 table — 暴落時の行動比較
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "暴落時 バフェット vs 一般投資家");

  const rows = [
    [
      { text: "危機", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 18, fontFace: FONT, align: "center" } },
      { text: "バフェットの行動", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 18, fontFace: FONT, align: "center" } },
      { text: "一般投資家", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 18, fontFace: FONT, align: "center" } },
    ],
    [
      { text: "2000年\nITバブル", options: { fill: COLORS.lightGray, bold: true, fontSize: 16, fontFace: FONT, align: "center" } },
      { text: "動かない\n「理解できないものには\n投資しない」→ 無傷", options: { fontSize: 16, fontFace: FONT, align: "center", color: COLORS.green } },
      { text: "ドットコム株に\n全力投球\n→ 大暴落で全損", options: { fontSize: 16, fontFace: FONT, align: "center", color: COLORS.headerRed } },
    ],
    [
      { text: "2008年\nリーマン", options: { fill: COLORS.lightGray, bold: true, fontSize: 16, fontFace: FONT, align: "center" } },
      { text: "ゴールドマン・サックスに\n$75億投資\n→ 巨額のリターン", options: { fontSize: 16, fontFace: FONT, align: "center", color: COLORS.green } },
      { text: "パニック売り\n→ 底値で損切り\n→ 回復に乗れず", options: { fontSize: 16, fontFace: FONT, align: "center", color: COLORS.headerRed } },
    ],
    [
      { text: "結論", options: { fill: COLORS.highlightYellow, bold: true, fontSize: 16, fontFace: FONT, align: "center" } },
      { text: "「他人が恐怖の時に\n貪欲であれ」を実行", options: { fontSize: 16, fontFace: FONT, align: "center", bold: true, color: COLORS.green } },
      { text: "感情に支配され\n合理的判断ができない", options: { fontSize: 16, fontFace: FONT, align: "center", bold: true, color: COLORS.headerRed } },
    ],
  ];

  slide.addTable(rows, {
    x: 0.3, y: 1.0, w: 9.4,
    border: { type: "solid", pt: 1, color: "CCCCCC" },
    rowH: [0.5, 1.0, 1.0, 0.8],
    colW: [1.8, 3.8, 3.8],
  });
}

// =============================================================
// #13 matrix — 暴落耐性の決定要因
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "暴落耐性 = 資産額 × リテラシー × 性格");

  // 軸ラベル
  slide.addText("← 忍耐なし　　　　　　　　忍耐あり →", {
    x: 1.5, y: 4.5, w: 7.0, h: 0.4,
    fontSize: 16, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });
  slide.addText("高", { x: 1.0, y: 1.0, w: 0.5, h: 0.4, fontSize: 14, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center" });
  slide.addText("低", { x: 1.0, y: 3.5, w: 0.5, h: 0.4, fontSize: 14, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center" });
  slide.addText("金\n融\nリ\nテ\nラ\nシ\n｜", {
    x: 0.3, y: 1.2, w: 0.5, h: 3.0,
    fontSize: 12, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
  });

  // 4セル  
  // 左上
  slide.addShape(pres.ShapeType.rect, { x: 1.5, y: 1.0, w: 3.5, h: 1.7, fill: { color: "FFF3E0" }, line: { color: COLORS.orange, width: 2 } });
  slide.addText("😐 知識はあるが\n感情に弱い\n（理論倒れ型）", { x: 1.5, y: 1.0, w: 3.5, h: 1.7, fontSize: 16, fontFace: FONT, bold: true, color: COLORS.orange, align: "center" });

  // 右上
  slide.addShape(pres.ShapeType.rect, { x: 5.0, y: 1.0, w: 4.5, h: 1.7, fill: { color: "E8F5E9" }, line: { color: COLORS.green, width: 2 } });
  slide.addText("🏆 バフェット型\nリテラシー高 × 忍耐あり\n= 最強の投資家", { x: 5.0, y: 1.0, w: 4.5, h: 1.7, fontSize: 18, fontFace: FONT, bold: true, color: COLORS.green, align: "center" });

  // 左下
  slide.addShape(pres.ShapeType.rect, { x: 1.5, y: 2.7, w: 3.5, h: 1.7, fill: { color: "FFEBEE" }, line: { color: COLORS.headerRed, width: 2 } });
  slide.addText("💀 最弱パターン\n知識なし × 感情投資\n（パニック売り確定）", { x: 1.5, y: 2.7, w: 3.5, h: 1.7, fontSize: 16, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center" });

  // 右下
  slide.addShape(pres.ShapeType.rect, { x: 5.0, y: 2.7, w: 4.5, h: 1.7, fill: { color: "E3F2FD" }, line: { color: COLORS.blue, width: 2 } });
  slide.addText("🐢 のんびり成長型\n知識は足りないが\n忍耐で乗り切る", { x: 5.0, y: 2.7, w: 4.5, h: 1.7, fontSize: 16, fontFace: FONT, bold: true, color: COLORS.blue, align: "center" });

  addSource(slide, "出典：楽天証券×広島大学 共同調査より着想");
}

// =============================================================
// #14 timeline — ソロモン・ブラザーズ危機
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "ソロモン・ブラザーズ危機 — 信頼を守った男");

  const events = [
    { year: "1987", label: "ホワイトナイト\n$7億投資" },
    { year: "1991", label: "国債入札\n不正発覚" },
    { year: "1991", label: "暫定CEO\n就任" },
    { year: "1991", label: "ボーナス\n$1.1億削減" },
  ];

  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 2.3, w: 9.0, h: 0.06,
    fill: { color: COLORS.headerRed },
  });

  events.forEach((e, i) => {
    const xPos = 0.8 + i * 2.3;
    slide.addShape(pres.ShapeType.ellipse, {
      x: xPos + 0.25, y: 2.1, w: 0.35, h: 0.35,
      fill: { color: i === events.length - 1 ? COLORS.highlightYellow : COLORS.headerRed },
    });
    slide.addText(e.year, {
      x: xPos - 0.1, y: 1.5, w: 1.0, h: 0.4,
      fontSize: 18, fontFace: FONT_EN, bold: true, color: COLORS.darkGray, align: "center",
    });
    slide.addText(e.label, {
      x: xPos - 0.2, y: 2.7, w: 1.3, h: 0.8,
      fontSize: 15, fontFace: FONT, bold: true, color: COLORS.darkGray, align: "center",
    });
  });

  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.8, w: 9.0, h: 0.9,
    fill: { color: COLORS.headerRed }, rectRadius: 0.1,
  });
  slide.addText("「会社の評判を少しでも失ったら、私は容赦しません」\n— バフェット（ソロモン全社員への宣言）", {
    x: 0.5, y: 3.8, w: 9.0, h: 0.9,
    fontSize: 20, fontFace: FONT, bold: true, color: COLORS.white, align: "center",
  });
}

// =============================================================
// #15 table — 金持ちで「あり続ける」4つの性格
// =============================================================
{
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };
  addHeader(slide, "金持ちで「あり続ける」ための4つの性格");

  const rows = [
    [
      { text: "#", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 18, fontFace: FONT, align: "center" } },
      { text: "性格", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
      { text: "キーワード", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
      { text: "バフェットの言葉", options: { fill: COLORS.headerRed, color: COLORS.white, bold: true, fontSize: 20, fontFace: FONT, align: "center" } },
    ],
    [
      { text: "1", options: { fill: COLORS.lightGray, bold: true, fontSize: 22, fontFace: FONT, align: "center" } },
      { text: "欲望のコントロール", options: { fontSize: 18, fontFace: FONT, bold: true, align: "center" } },
      { text: "見栄を捨てる\n$3.17の朝食", options: { fontSize: 14, fontFace: FONT, align: "center" } },
      { text: "「質素は修行ではなく\n戦略だ」", options: { fontSize: 14, fontFace: FONT, align: "center", italic: true } },
    ],
    [
      { text: "2", options: { fill: COLORS.lightGray, bold: true, fontSize: 22, fontFace: FONT, align: "center" } },
      { text: "複利的思考", options: { fontSize: 18, fontFace: FONT, bold: true, align: "center" } },
      { text: "利益を回す\nマッスルメモリー", options: { fontSize: 14, fontFace: FONT, align: "center" } },
      { text: "「複利は世界第8の\n不思議だ」", options: { fontSize: 14, fontFace: FONT, align: "center", italic: true } },
    ],
    [
      { text: "3", options: { fill: COLORS.lightGray, bold: true, fontSize: 22, fontFace: FONT, align: "center" } },
      { text: "忍耐力", options: { fontSize: 18, fontFace: FONT, bold: true, align: "center" } },
      { text: "退屈・暴落・焦り\nに耐える", options: { fontSize: 14, fontFace: FONT, align: "center" } },
      { text: "「ゆっくり金持ちになる\n方法を誰も好まない」", options: { fontSize: 14, fontFace: FONT, align: "center", italic: true } },
    ],
    [
      { text: "4", options: { fill: COLORS.lightGray, bold: true, fontSize: 22, fontFace: FONT, align: "center" } },
      { text: "信頼", options: { fontSize: 18, fontFace: FONT, bold: true, align: "center" } },
      { text: "金より重い\n無形の資産", options: { fontSize: 14, fontFace: FONT, align: "center" } },
      { text: "「評判を失ったら\n容赦しない」", options: { fontSize: 14, fontFace: FONT, align: "center", italic: true } },
    ],
  ];

  slide.addTable(rows, {
    x: 0.3, y: 1.0, w: 9.4,
    border: { type: "solid", pt: 1, color: "CCCCCC" },
    rowH: [0.5, 0.8, 0.8, 0.8, 0.8],
    colW: [0.6, 2.3, 3.0, 3.5],
  });

  slide.addText('「改善するのに、"遅すぎる" ということはありません」— ウォーレン・バフェット', {
    x: 0.3, y: 4.6, w: 9.4, h: 0.4,
    fontSize: 18, fontFace: FONT, bold: true, color: COLORS.headerRed, align: "center",
  });
}

// =============================================================
// 出力
// =============================================================
pres.writeFile({ fileName: "C:/Users/keima/openclaw/slide-work/output/slides.pptx" })
  .then(() => {
    console.log("✅ PPTX generated: C:/Users/keima/openclaw/slide-work/output/slides.pptx");
    console.log("Total slides: " + pres.slides.length);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
