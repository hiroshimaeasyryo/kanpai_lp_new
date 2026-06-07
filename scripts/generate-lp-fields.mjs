/**
 * LP フィールド定義を生成（pnpm exec node scripts/generate-lp-fields.mjs）
 * 出力: client/src/lib/content-manager/generated/*-lp-fields.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../client/src/lib/content-manager/generated");

function emitFile(name, constName, bodyLines) {
  const content = `/** 自動生成 — scripts/generate-lp-fields.mjs */\nimport {\n  text,\n  image,\n  indexedFields,\n  indexedSimple,\n  type LpFieldDef,\n} from "../lp-field-types";\n\nexport const ${constName}: LpFieldDef[] = [\n${bodyLines.join("\n")}\n];\n`;
  writeFileSync(join(outDir, name), content, "utf8");
}

function t(id, label, path, multiline = false, rows = 4) {
  const opts =
    multiline ? `, { multiline: true, rows: ${rows} }` : "";
  return `  text("${id}", "${label}", "${path}"${opts}),`;
}

function img(id, label, path, def) {
  const d = def ? `, "${def}"` : "";
  return `  image("${id}", "${label}", "${path}"${d}),`;
}

function idxSimple(prefix, label, count, arrayPath) {
  return `  ...indexedSimple("${prefix}", "${label}", ${count}, "${arrayPath}"),`;
}

function idxFields(prefix, label, count, arrayPath, fields) {
  const inner = fields
    .map((f) => {
      const ml = f.multiline ? `, multiline: true, rows: ${f.rows ?? 4}` : "";
      return `{ suffix: "${f.suffix}", label: "${f.label}"${ml} }`;
    })
    .join(", ");
  return `  ...indexedFields("${prefix}", "${label}", ${count}, "${arrayPath}", [${inner}]),`;
}

mkdirSync(outDir, { recursive: true });

// ─── BTOB ───
emitFile("btob-lp-fields.ts", "BTOB_LP_FIELDS", [
  t("btob-header-logo", "ヘッダー · ロゴ", "header.logoHtml", true, 2),
  t("btob-header-badge", "ヘッダー · バッジ", "header.badgeLabel"),
  t("btob-header-cta-label", "ヘッダー · CTA文言", "header.ctaLabel"),
  t("btob-hero-category-pill", "ヒーロー · カテゴリ", "hero.categoryPillHtml", true, 2),
  t("btob-hero-category-meta", "ヒーロー · カテゴリ補足", "hero.categoryMeta"),
  t("btob-hero-seminar-name", "ヒーロー · セミナー名", "hero.seminarName"),
  t("btob-hero-h1", "ヒーロー · 見出し", "hero.h1Html", true, 4),
  t("btob-hero-lead", "ヒーロー · リード", "hero.leadHtml", true, 4),
  ...Array.from({ length: 4 }, (_, i) => [
    t(`btob-hero-info-${i}-label`, `ヒーロー · 情報${i + 1}ラベル`, `hero.info[${i}].label`),
    t(`btob-hero-info-${i}-value`, `ヒーロー · 情報${i + 1}値`, `hero.info[${i}].value`),
  ]).flat(),
  t("btob-hero-primary-cta-label", "ヒーロー · CTA文言", "hero.primaryCtaLabel"),
  t("btob-hero-primary-cta-fine-print", "ヒーロー · CTA注記", "hero.primaryCtaFinePrint"),
  t("btob-empathy-script", "共感 · スクリプト", "empathy.script"),
  t("btob-empathy-title", "共感 · 見出し", "empathy.titleHtml", true, 3),
  t("btob-empathy-lead", "共感 · リード", "empathy.leadHtml", true, 4),
  idxSimple("btob-empathy-checklist", "共感 · チェック", 5, "empathy.checklist"),
  t("btob-empathy-callout", "共感 · コールアウト", "empathy.callout", true, 3),
  t("btob-structure-script", "ループ · スクリプト", "structure.script"),
  t("btob-structure-title", "ループ · 見出し", "structure.titleHtml", true, 3),
  t("btob-structure-sub", "ループ · サブ", "structure.sub"),
  idxFields("btob-structure-step", "ループ", 4, "structure.steps", [
    { suffix: "num", label: "番号" },
    { suffix: "label", label: "ラベル" },
    { suffix: "desc", label: "説明" },
  ]),
  t("btob-structure-note", "ループ · 注記", "structure.noteHtml", true, 3),
  t("btob-speaker-script", "講師 · スクリプト", "speaker.script"),
  t("btob-speaker-title", "講師 · 見出し", "speaker.titleHtml", true, 3),
  img("btob-speaker-avatar-image", "講師 · 写真", "speaker.avatarImageUrl", "/btob_seminar/speaker.webp"),
  t("btob-speaker-avatar-char", "講師 · 写真文字", "speaker.avatarChar"),
  t("btob-speaker-photo-name", "講師 · 写真下名前", "speaker.photoName"),
  t("btob-speaker-photo-role", "講師 · 写真下役職", "speaker.photoRole"),
  t("btob-speaker-meta", "講師 · メタ", "speaker.meta"),
  t("btob-speaker-name", "講師 · 名前", "speaker.name"),
  t("btob-speaker-company", "講師 · 会社", "speaker.company"),
  t("btob-speaker-message", "講師 · メッセージ", "speaker.messageHtml", true, 5),
  t("btob-experience-script", "体験 · スクリプト", "experience.script"),
  t("btob-experience-title", "体験 · 見出し", "experience.titleHtml", true, 3),
  idxFields("btob-experience-item", "体験", 4, "experience.items", [
    { suffix: "num", label: "番号" },
    { suffix: "name", label: "名前" },
    { suffix: "descHtml", label: "説明", multiline: true, rows: 4 },
  ]),
  t("btob-takeaway-script", "持ち帰り · スクリプト", "takeaway.script"),
  t("btob-takeaway-title", "持ち帰り · 見出し", "takeaway.titleHtml", true, 3),
  t("btob-takeaway-sub", "持ち帰り · サブ", "takeaway.sub"),
  idxFields("btob-takeaway-card", "持ち帰り", 3, "takeaway.cards", [
    { suffix: "icon", label: "アイコン" },
    { suffix: "titleHtml", label: "タイトル", multiline: true, rows: 2 },
    { suffix: "desc", label: "説明", multiline: true, rows: 3 },
  ]),
  t("btob-mid-cta-eyebrow", "中段CTA · ラベル", "midCta.eyebrow"),
  t("btob-mid-cta-title", "中段CTA · 見出し", "midCta.title"),
  t("btob-mid-cta-meta", "中段CTA · 補足", "midCta.meta"),
  t("btob-mid-cta-label", "中段CTA · ボタン", "midCta.ctaLabel"),
  t("btob-audience-script", "対象者 · スクリプト", "audience.script"),
  t("btob-audience-title", "対象者 · 見出し", "audience.titleHtml", true, 3),
  idxSimple("btob-audience-item", "対象者", 3, "audience.items"),
  t("btob-audience-note-script", "対象者 · 注記スクリプト", "audience.noteScript"),
  t("btob-audience-note-title", "対象者 · 注記見出し", "audience.noteTitleHtml", true, 2),
  t("btob-audience-note-body", "対象者 · 注記本文", "audience.noteBody", true, 4),
  t("btob-hosts-script", "主催 · スクリプト", "hosts.script"),
  t("btob-hosts-title", "主催 · 見出し", "hosts.titleHtml", true, 3),
  idxFields("btob-hosts-card", "主催", 2, "hosts.cards", [
    { suffix: "role", label: "役割" },
    { suffix: "roleJp", label: "役割（日）" },
    { suffix: "name", label: "名前" },
    { suffix: "desc", label: "説明", multiline: true, rows: 3 },
  ]),
  t("btob-details-script", "概要 · スクリプト", "details.script"),
  t("btob-details-title", "概要 · 見出し", "details.title"),
  idxFields("btob-details-row", "概要", 9, "details.rows", [
    { suffix: "th", label: "項目" },
    { suffix: "tdHtml", label: "内容", multiline: true, rows: 3 },
  ]),
  t("btob-faq-script", "FAQ · スクリプト", "faq.script"),
  t("btob-faq-title", "FAQ · 見出し", "faq.title"),
  idxFields("btob-faq-item", "FAQ", 4, "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ]),
  t("btob-final-cta-h2", "最終CTA · 見出し", "finalCta.h2Html", true, 3),
  t("btob-final-cta-lead", "最終CTA · リード", "finalCta.leadHtml", true, 3),
  t("btob-final-cta-fine-print", "最終CTA · 注記", "finalCta.finePrint"),
  t("btob-final-cta-label", "最終CTA · ボタン", "finalCta.ctaLabel"),
  t("btob-form-title", "フォーム · 見出し", "form.title"),
  t("btob-form-sub", "フォーム · サブ", "form.subHtml", true, 3),
  t("btob-form-fallback-text", "フォーム · 代替テキスト", "form.fallbackText"),
  t("btob-form-fallback-link-label", "フォーム · 代替リンク", "form.fallbackLinkLabel"),
  t("btob-footer-copyright", "フッター · 著作権", "footer.copyright"),
]);

// ─── Self Reflection ───
emitFile("sr-lp-fields.ts", "SR_LP_FIELDS", [
  t("sr-hero-title", "ヒーロー · 見出し", "hero.titleHtml", true, 4),
  t("sr-hero-sub", "ヒーロー · サブ", "hero.sub"),
  t("sr-hero-cta-label", "ヒーロー · CTA", "hero.ctaLabel"),
  img("sr-hero-bg-image", "ヒーロー · 背景画像", "hero.bgImageUrl"),
  t("sr-event-info-label", "イベント · ラベル", "eventInfo.label"),
  t("sr-event-info-date", "イベント · 日付", "eventInfo.date"),
  t("sr-event-info-time", "イベント · 時間", "eventInfo.time"),
  t("sr-event-info-venue", "イベント · 会場", "eventInfo.venue"),
  t("sr-event-info-address", "イベント · 住所", "eventInfo.address"),
  idxSimple("sr-event-info-tag", "イベント · タグ", 3, "eventInfo.tags"),
  t("sr-issue-heading", "課題 · 見出し", "issue.heading"),
  idxSimple("sr-issue-item", "課題", 4, "issue.items"),
  t("sr-cause-bold-lead", "原因 · リード", "cause.boldLead", true, 3),
  t("sr-cause-quote", "原因 · 引用", "cause.quoteHtml", true, 4),
  t("sr-cause-body", "原因 · 本文", "cause.body", true, 5),
  t("sr-cause-sub-center", "原因 · サブ", "cause.subCenter"),
  t("sr-cause-cta-label", "原因 · CTA", "cause.ctaLabel"),
  t("sr-concept-copy", "コンセプト · コピー", "concept.copyHtml", true, 4),
  idxSimple("sr-concept-tag", "コンセプト · タグ", 6, "concept.tagsHtml"),
  t("sr-steps-heading", "ステップ · 見出し", "steps.heading"),
  idxFields("sr-steps-item", "ステップ", 4, "steps.items", [
    { suffix: "num", label: "番号" },
    { suffix: "min", label: "時間" },
    { suffix: "title", label: "タイトル" },
    { suffix: "tagline", label: "タグライン" },
    { suffix: "desc", label: "説明", multiline: true, rows: 4 },
  ]),
  t("sr-steps-cta-label", "ステップ · CTA", "steps.ctaLabel"),
  t("sr-voices-heading", "体験者 · 見出し", "voices.heading"),
  t("sr-voices-sub", "体験者 · サブ", "voices.sub"),
  idxFields("sr-voices-card", "体験者", 4, "voices.cards", [
    { suffix: "change", label: "変化", multiline: true, rows: 2 },
    { suffix: "quote", label: "引用", multiline: true, rows: 4 },
  ]),
  t("sr-safety-heading", "安心 · 見出し", "safety.heading"),
  idxFields("sr-safety-item", "安心", 4, "safety.items", [
    { suffix: "label", label: "ラベル" },
    { suffix: "desc", label: "説明", multiline: true, rows: 3 },
  ]),
  img("sr-advisor-photo", "アドバイザー · 写真", "advisor.photoUrl"),
  t("sr-advisor-name", "アドバイザー · 名前", "advisor.name"),
  t("sr-advisor-title", "アドバイザー · 肩書", "advisor.title"),
  idxSimple("sr-advisor-bio", "アドバイザー · 経歴", 4, "advisor.bio"),
  t("sr-advisor-highlight", "アドバイザー · ハイライト", "advisor.highlight", true, 3),
  t("sr-faq-heading", "FAQ · 見出し", "faq.heading"),
  idxFields("sr-faq-item", "FAQ", 6, "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ]),
  t("sr-closing-cta-heading", "最終CTA · 見出し", "closingCta.heading"),
  t("sr-closing-cta-sub", "最終CTA · サブ", "closingCta.sub"),
  t("sr-closing-cta-info-date", "最終CTA · 日時", "closingCta.infoDate"),
  t("sr-closing-cta-info-venue", "最終CTA · 会場", "closingCta.infoVenueHtml", true, 2),
  t("sr-closing-cta-label", "最終CTA · ボタン", "closingCta.ctaLabel"),
  t("sr-footer-brand", "フッター · ブランド", "footer.brand"),
  t("sr-footer-brand-sub", "フッター · サブ", "footer.brandSub"),
  t("sr-footer-company", "フッター · 会社", "footer.company"),
  t("sr-footer-copyright", "フッター · 著作権", "footer.copyright"),
]);

// ─── Starting Job Hunting ───
emitFile("sjh-lp-fields.ts", "SJH_LP_FIELDS", [
  img("sjh-header-logo", "ヘッダー · ロゴ", "header.logoUrl"),
  t("sjh-header-logo-alt", "ヘッダー · ロゴalt", "header.logoAlt"),
  t("sjh-header-cta-label", "ヘッダー · CTA", "header.ctaLabel"),
  t("sjh-header-cta-label-mobile", "ヘッダー · CTA（SP）", "header.ctaLabelMobile"),
  t("sjh-sticky-cta-label", "固定CTA · 文言", "stickyCta.label"),
  t("sjh-hero-kicker", "FV · キッカー", "hero.kicker"),
  img("sjh-hero-image", "FV · 画像", "hero.heroImageUrl"),
  t("sjh-hero-image-alt", "FV · 画像alt", "hero.heroImageAlt"),
  t("sjh-hero-primary-cta-label", "FV · CTA", "hero.primaryCtaLabel"),
  t("sjh-hero-body", "FV · 本文", "hero.bodyHtml", true, 5),
  t("sjh-event-info-label", "イベント · ラベル", "eventInfo.label"),
  idxFields("sjh-event-info-row", "イベント", 4, "eventInfo.rows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
    { suffix: "sub", label: "補足" },
  ]),
  t("sjh-problem-script", "Problem · スクリプト", "problem.script"),
  t("sjh-problem-reassurance", "Problem · 安心", "problem.reassurance"),
  t("sjh-problem-title", "Problem · 見出し", "problem.titleHtml", true, 3),
  idxSimple("sjh-problem-item", "Problem", 4, "problem.items"),
  t("sjh-insight-script", "Insight · スクリプト", "insight.script"),
  t("sjh-insight-title", "Insight · 見出し", "insight.titleHtml", true, 3),
  idxSimple("sjh-insight-paragraph", "Insight", 3, "insight.paragraphs"),
  t("sjh-insight-key-line", "Insight · キーライン", "insight.keyLine", true, 2),
  t("sjh-solution-script", "Solution · スクリプト", "solution.script"),
  t("sjh-solution-title", "Solution · 見出し", "solution.titleHtml", true, 3),
  t("sjh-solution-lead", "Solution · リード", "solution.lead", true, 4),
  t("sjh-solution-deliverables-heading", "Solution · 小見出し", "solution.deliverablesHeading"),
  idxFields("sjh-solution-deliverable", "Solution", 4, "solution.deliverables", [
    { suffix: "num", label: "番号" },
    { suffix: "text", label: "内容", multiline: true, rows: 3 },
  ]),
  t("sjh-mid-cta-label", "中間CTA · ボタン", "midCta.label"),
  t("sjh-program-title", "Program · 見出し", "program.titleHtml", true, 3),
  idxFields("sjh-program-row", "Program", 5, "program.rows", [
    { suffix: "step", label: "ステップ" },
    { suffix: "content", label: "内容", multiline: true, rows: 3 },
  ]),
  idxSimple("sjh-program-point", "Program · ポイント", 4, "program.points"),
  img("sjh-facilitator-image", "Facilitator · 写真", "facilitator.imageUrl"),
  t("sjh-facilitator-name", "Facilitator · 名前", "facilitator.name"),
  t("sjh-facilitator-role", "Facilitator · 役職", "facilitator.role"),
  idxSimple("sjh-facilitator-bio", "Facilitator · 経歴", 5, "facilitator.bio"),
  t("sjh-facilitator-quote", "Facilitator · 引用", "facilitator.quote", true, 4),
  idxFields("sjh-voices-item", "参加者の声", 3, "voices.items", [
    { suffix: "school", label: "学校" },
    { suffix: "comment", label: "コメント", multiline: true, rows: 4 },
  ]),
  idxFields("sjh-info-row", "開催情報", 6, "info.scheduleRows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
    { suffix: "sub", label: "補足" },
  ]),
  t("sjh-info-cta-label", "開催情報 · CTA", "info.ctaLabel"),
  idxSimple("sjh-recommend-item", "おすすめ", 5, "recommend.items"),
  idxFields("sjh-faq-item", "FAQ", 7, "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ]),
  t("sjh-final-cta-title", "最終CTA · 見出し", "finalCta.titleHtml", true, 3),
  t("sjh-final-cta-sub", "最終CTA · サブ", "finalCta.subHtml", true, 3),
  idxSimple("sjh-final-cta-meta", "最終CTA · メタ", 3, "finalCta.metaItems"),
  t("sjh-final-cta-label", "最終CTA · ボタン", "finalCta.ctaLabel"),
  t("sjh-final-cta-note", "最終CTA · 注記", "finalCta.noteHtml", true, 2),
  idxSimple("sjh-footer-line", "フッター", 2, "footer.lines"),
  t("sjh-footer-copyright", "フッター · 著作権", "footer.copyright"),
]);

// ─── Self Stance ───
emitFile("ss-lp-fields.ts", "SS_LP_FIELDS", [
  img("ss-header-logo", "ヘッダー · ロゴ", "header.logoUrl"),
  t("ss-header-logo-alt", "ヘッダー · ロゴalt", "header.logoAlt"),
  t("ss-header-cta-label", "ヘッダー · CTA", "header.ctaLabel"),
  t("ss-sticky-cta-label", "固定CTA · 文言", "stickyCta.label"),
  t("ss-hero-eyebrow", "FV · ラベル", "hero.eyebrow"),
  img("ss-hero-image", "FV · 画像", "hero.heroImageUrl"),
  t("ss-hero-image-alt", "FV · 画像alt", "hero.heroImageAlt"),
  t("ss-hero-primary-cta-label", "FV · CTA", "hero.primaryCtaLabel"),
  t("ss-hero-body", "FV · 本文", "hero.bodyHtml", true, 5),
  t("ss-event-info-label", "イベント · ラベル", "eventInfo.label"),
  idxFields("ss-event-info-row", "イベント", 4, "eventInfo.rows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
  ]),
  t("ss-problem-label", "悩み · ラベル", "empathy.label"),
  t("ss-problem-title", "悩み · 見出し", "empathy.title"),
  idxSimple("ss-problem-item", "悩み", 3, "empathy.items"),
  t("ss-solution-label", "ソリューション · ラベル", "solution.label"),
  t("ss-solution-title", "ソリューション · 見出し", "solution.titleHtml", true, 3),
  t("ss-solution-subtitle", "ソリューション · サブ", "solution.subtitle"),
  t("ss-solution-body", "ソリューション · 本文", "solution.body", true, 4),
  t("ss-solution-benefits-heading", "ソリューション · 小見出し", "solution.benefitsHeading"),
  idxSimple("ss-solution-benefit", "メリット", 5, "solution.benefits"),
  t("ss-solution-cta-label", "ソリューション · CTA", "solution.ctaLabel"),
  t("ss-program-label", "Program · ラベル", "program.label"),
  t("ss-program-title", "Program · 見出し", "program.titleHtml", true, 3),
  idxFields("ss-program-step", "Program", 5, "program.steps", [
    { suffix: "num", label: "番号" },
    { suffix: "nameHtml", label: "名前", multiline: true, rows: 2 },
    { suffix: "description", label: "説明", multiline: true, rows: 3 },
  ]),
  t("ss-program-points-heading", "Program · ポイント見出し", "program.pointsHeading"),
  idxSimple("ss-program-point", "Program · ポイント", 3, "program.points"),
  t("ss-facilitator-label", "Facilitator · ラベル", "facilitator.label"),
  t("ss-facilitator-title", "Facilitator · 見出し", "facilitator.title"),
  img("ss-facilitator-image", "Facilitator · 写真", "facilitator.imageUrl"),
  t("ss-facilitator-name", "Facilitator · 名前", "facilitator.name"),
  t("ss-facilitator-role", "Facilitator · 役職", "facilitator.role"),
  idxSimple("ss-facilitator-bio", "Facilitator · 経歴", 4, "facilitator.bio"),
  t("ss-facilitator-quote", "Facilitator · 引用", "facilitator.quote", true, 4),
  t("ss-voices-label", "参加者の声 · ラベル", "voices.label"),
  t("ss-voices-title", "参加者の声 · 見出し", "voices.title"),
  idxFields("ss-voices-item", "参加者の声", 3, "voices.items", [
    { suffix: "who", label: "属性" },
    { suffix: "text", label: "コメント", multiline: true, rows: 4 },
  ]),
  t("ss-detail-label", "開催情報 · ラベル", "detail.label"),
  t("ss-detail-title", "開催情報 · 見出し", "detail.title"),
  idxFields("ss-detail-row", "開催情報", 6, "detail.scheduleRows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
  ]),
  t("ss-detail-cta-label", "開催情報 · CTA", "detail.ctaLabel"),
  t("ss-target-label", "おすすめ · ラベル", "target.label"),
  t("ss-target-title", "おすすめ · 見出し", "target.title"),
  idxSimple("ss-target-item", "おすすめ", 5, "target.items"),
  t("ss-faq-label", "FAQ · ラベル", "faq.label"),
  t("ss-faq-title", "FAQ · 見出し", "faq.title"),
  idxFields("ss-faq-item", "FAQ", 6, "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ]),
  t("ss-final-cta-title", "最終CTA · 見出し", "finalCta.titleHtml", true, 3),
  idxSimple("ss-final-cta-paragraph", "最終CTA", 4, "finalCta.paragraphs"),
  t("ss-final-cta-label", "最終CTA · ボタン", "finalCta.ctaLabel"),
  t("ss-final-cta-note", "最終CTA · 注記", "finalCta.note"),
  idxSimple("ss-footer-line", "フッター", 2, "footer.lines"),
  t("ss-footer-copyright", "フッター · 著作権", "footer.copyright"),
]);

console.log("Generated LP field definitions in", outDir);
