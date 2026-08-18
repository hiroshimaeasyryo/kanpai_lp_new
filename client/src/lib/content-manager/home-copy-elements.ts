import type { ElementDefinition } from "@/lib/content-manager/content-element-registry";



function def(id: string, label: string, tall = false, editorSection?: string): ElementDefinition {

  return { id, label, editorSection: editorSection ?? id, tall };

}



function indexedFields(

  prefix: string,

  labelPrefix: string,

  count: number,

  fields: { suffix: string; label: string }[],

): ElementDefinition[] {

  const out: ElementDefinition[] = [];

  for (let i = 0; i < count; i++) {

    for (const f of fields) {

      out.push(def(`${prefix}-${i}-${f.suffix}`, `${labelPrefix} ${i + 1} · ${f.label}`));

    }

  }

  return out;

}



function indexedSimple(prefix: string, labelPrefix: string, count: number): ElementDefinition[] {

  return Array.from({ length: count }, (_, i) => def(`${prefix}-${i}`, `${labelPrefix} ${i + 1}`));

}



/** Home LP の文言・画像要素（プレビュー個別選択用） */
export const HOME_COPY_ELEMENTS: ElementDefinition[] = [

  def("brand-logo", "ブランドロゴ"),

  def("nav-header-cta", "ヘッダーCTA"),

  def("hero-image", "ヒーロー画像"),

  def("hero-title-line1", "ヒーロー見出し（1行目）"),

  def("hero-title-line2", "ヒーロー見出し（2行目）"),

  def("hero-subcopy", "ヒーローサブコピー"),

  def("hero-cta", "ヒーローCTAボタン"),

  def("hero-sticky-cta", "モバイル固定CTA"),

  def("next-event-eyebrow", "次回イベント（上部）ラベル"),

  def("next-event-heading", "次回イベント（上部）見出し"),

  def("problem-lead", "Problem リード文"),

  def("problem-p1", "Problem 本文1"),

  def("problem-p2", "Problem 本文2"),

  def("about-eyebrow", "About ラベル"),

  def("about-heading", "About 見出し"),

  def("about-body", "About 本文"),

  def("about-cta", "About CTAボタン"),

  def("about-images", "イベント画像（About）"),

  def("values-eyebrow", "Values ラベル"),

  def("values-heading", "Values 見出し"),

  ...indexedFields("values-card", "Values", 3, [

    { suffix: "label", label: "ラベル" },

    { suffix: "title", label: "見出し" },

    { suffix: "body", label: "本文" },

    { suffix: "note", label: "補足" },

  ]),

  def("event-flow-eyebrow", "イベントフロー ラベル"),

  def("event-flow-heading", "イベントフロー 見出し"),

  ...indexedFields("event-flow-step", "フロー", 4, [

    { suffix: "title", label: "タイトル" },

    { suffix: "time", label: "時間" },

    { suffix: "description", label: "説明" },

  ]),

  def("event-flow-images", "イベントフロー 画像", true),

  def("features-intro-eyebrow", "特徴セクション ラベル"),

  def("features-intro-heading", "特徴セクション 見出し"),

  ...indexedFields("feature", "特徴", 3, [

    { suffix: "title", label: "見出し" },

    { suffix: "body", label: "本文" },

    { suffix: "image", label: "画像" },

  ]),

  def("voices-eyebrow", "参加者の声 ラベル"),

  def("voices-heading", "参加者の声 見出し"),

  ...indexedFields("voices-card", "声", 5, [

    { suffix: "quote", label: "引用" },

    { suffix: "attribution", label: "属性" },

  ]),

  def("screening-eyebrow", "Screening ラベル"),

  def("screening-heading", "Screening 見出し"),

  def("screening-intro", "Screening リード文"),

  ...indexedSimple("screening-criterion", "Screening 基準", 5),

  def("screening-trust", "Screening 運営元テキスト"),

  def("student-screening-eyebrow", "学生参加審査 ラベル"),

  def("student-screening-heading", "学生参加審査 見出し"),

  def("student-screening-intro", "学生参加審査 リード文"),

  ...indexedSimple("student-screening-criterion", "学生参加審査 基準", 3),

  def("student-screening-note", "学生参加審査 補足テキスト"),

  def("safety-heading", "安全開催 見出し"),

  def("safety-subheading", "安全開催 サブ見出し"),

  ...indexedFields("safety-item", "安全", 3, [

    { suffix: "title", label: "タイトル" },

    { suffix: "description", label: "説明" },

  ]),

  def("faq-eyebrow", "FAQ ラベル"),

  def("faq-heading", "FAQ 見出し"),

  ...indexedFields("faq-item", "FAQ", 9, [

    { suffix: "question", label: "質問" },

    { suffix: "answer", label: "回答" },

  ]),

  def("final-cta-line1", "最終CTA 見出し（1行目）"),

  def("final-cta-line2", "最終CTA 見出し（2行目）"),

  def("final-cta-body", "最終CTA 本文"),

  def("final-cta-note", "最終CTA 注記"),

  def("event-detail", "イベント管理", true, "event-list"),

  def("footer-company", "フッター会社名"),

  def("campaign2603-notice", "キャンペーン文言"),

];



const HOME_COPY_ID_SET = new Set(HOME_COPY_ELEMENTS.map((e) => e.id));



/** プレビュー上の登録済み要素か（選択・ラベル用） */

export function isRegisteredHomeElement(id: string): boolean {

  return HOME_COPY_ID_SET.has(id);

}



const HOME_COPY_FIELD_PATTERNS: RegExp[] = [

  /^values-card-\d+-(label|title|body|note)$/,

  /^event-flow-step-\d+-(title|time|description)$/,

  /^feature-\d+-(title|body|image)$/,

  /^voices-card-\d+-(quote|attribution)$/,

  /^safety-item-\d+-(title|description)$/,

  /^faq-item-\d+-(question|answer)$/,

  /^screening-criterion-\d+$/,

  /^student-screening-criterion-\d+$/,

];



/** HomeCopyEditorSections で実際に編集できる sectionId か（文言のみ） */

export function hasHomeCopyEditorSection(sectionId: string): boolean {

  if (HOME_COPY_ID_SET.has(sectionId)) {

    const assetOnly = new Set([

      "brand-logo",

      "hero-image",

      "about-images",

      "event-flow-images",

      "event-detail",

      "campaign2603-notice",

    ]);

    if (assetOnly.has(sectionId)) return false;

    if (/^feature-\d+-(title|body|image)$/.test(sectionId)) return false;

    return true;

  }

  return HOME_COPY_FIELD_PATTERNS.some((re) => re.test(sectionId));

}



/** @deprecated 文言・画像の区別なく true になる。編集ルーティングには hasHomeCopyEditorSection を使う */

export function isHomeCopyEditorSection(sectionId: string): boolean {

  return HOME_COPY_ID_SET.has(sectionId);

}


