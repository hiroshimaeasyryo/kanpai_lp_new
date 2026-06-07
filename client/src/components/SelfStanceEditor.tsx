import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";
import { shouldShowEditorSection } from "@/lib/content-manager/editor-section";
import type {
  FaqItem,
  FlowStep,
  LabelValueRow,
  SelfStanceContent,
  VoiceItem,
} from "@/types/self-stance";

interface Props {
  content: SelfStanceContent;
  onChange: (content: SelfStanceContent) => void;
  sectionId?: string | null;
}

const sectionCls = "mb-8 rounded-xl border border-[#ffd7c3] bg-white p-6";
const headingStyle = { fontFamily: "'Noto Serif JP', serif" } as const;
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold text-[#3D281E] mb-4" style={headingStyle}>
    {children}
  </h3>
);
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-[#3D281E] text-sm font-medium">{children}</Label>
);
const inputCls = "border-[#ffd7c3] text-[#3D281E]";
const textareaCls = "border-[#ffd7c3] text-[#3D281E] min-h-[80px]";

function StringListEditor({
  items,
  onChange,
  addLabel = "行を追加",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Textarea
            className={textareaCls}
            rows={2}
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="shrink-0 border-[#ffd7c3] text-[#d4844b]"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            削除
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="border-[#d4844b] text-[#d4844b]"
        onClick={() => onChange([...items, ""])}
      >
        {addLabel}
      </Button>
    </div>
  );
}

function LabelValueRowsEditor({
  rows,
  onChange,
}: {
  rows: LabelValueRow[];
  onChange: (rows: LabelValueRow[]) => void;
}) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg bg-[#fffaf5] border border-[#ffd7c3]"
        >
          <Input
            className={inputCls}
            placeholder="ラベル"
            value={row.label}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...row, label: e.target.value };
              onChange(next);
            }}
          />
          <div className="flex gap-2">
            <Input
              className={inputCls}
              placeholder="値"
              value={row.value}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, value: e.target.value };
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0 border-[#ffd7c3] text-[#d4844b]"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
            >
              削除
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="border-[#d4844b] text-[#d4844b]"
        onClick={() => onChange([...rows, { label: "", value: "" }])}
      >
        行を追加
      </Button>
    </div>
  );
}

function FlowStepsEditor({
  steps,
  onChange,
}: {
  steps: FlowStep[];
  onChange: (steps: FlowStep[]) => void;
}) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="p-4 rounded-lg border border-[#ffd7c3] bg-[#fffaf5] space-y-2">
          <Input
            className={inputCls}
            placeholder="番号（例: WORK 01）"
            value={step.num}
            onChange={(e) => {
              const next = [...steps];
              next[i] = { ...step, num: e.target.value };
              onChange(next);
            }}
          />
          <Textarea
            className={textareaCls}
            rows={2}
            placeholder="ステップ名（HTML可）"
            value={step.nameHtml}
            onChange={(e) => {
              const next = [...steps];
              next[i] = { ...step, nameHtml: e.target.value };
              onChange(next);
            }}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            placeholder="説明"
            value={step.description}
            onChange={(e) => {
              const next = [...steps];
              next[i] = { ...step, description: e.target.value };
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="border-[#ffd7c3] text-[#d4844b]"
            onClick={() => onChange(steps.filter((_, j) => j !== i))}
          >
            ステップを削除
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="border-[#d4844b] text-[#d4844b]"
        onClick={() =>
          onChange([...steps, { num: "", nameHtml: "", description: "" }])
        }
      >
        ステップを追加
      </Button>
    </div>
  );
}

function VoicesEditor({
  items,
  onChange,
}: {
  items: VoiceItem[];
  onChange: (items: VoiceItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((v, i) => (
        <div key={i} className="p-4 rounded-lg border border-[#ffd7c3] bg-[#fffaf5] space-y-2">
          <Input
            className={inputCls}
            placeholder="所属・学部"
            value={v.who}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...v, who: e.target.value };
              onChange(next);
            }}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            placeholder="コメント"
            value={v.text}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...v, text: e.target.value };
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="border-[#ffd7c3] text-[#d4844b]"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            削除
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="border-[#d4844b] text-[#d4844b]"
        onClick={() => onChange([...items, { who: "", text: "" }])}
      >
        声を追加
      </Button>
    </div>
  );
}

function FaqEditor({ items, onChange }: { items: FaqItem[]; onChange: (items: FaqItem[]) => void }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-lg border border-[#ffd7c3] bg-[#fffaf5] space-y-2">
          <Input
            className={inputCls}
            placeholder="質問"
            value={item.q}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, q: e.target.value };
              onChange(next);
            }}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            placeholder="回答"
            value={item.a}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, a: e.target.value };
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="border-[#ffd7c3] text-[#d4844b]"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            削除
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="border-[#d4844b] text-[#d4844b]"
        onClick={() => onChange([...items, { q: "", a: "" }])}
      >
        FAQを追加
      </Button>
    </div>
  );
}

function CtaFields({
  label,
  href,
  onLabel,
  onHref,
}: {
  label: string;
  href: string;
  onLabel: (v: string) => void;
  onHref: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div>
        <FieldLabel>CTAラベル</FieldLabel>
        <Input className={inputCls} value={label} onChange={(e) => onLabel(e.target.value)} />
      </div>
      <div>
        <FieldLabel>CTA URL</FieldLabel>
        <Input className={inputCls} value={href} onChange={(e) => onHref(e.target.value)} />
      </div>
    </div>
  );
}

export function SelfStanceEditor({ content, onChange, sectionId }: Props) {
  const update = <K extends keyof SelfStanceContent>(key: K, value: SelfStanceContent[K]) => {
    onChange({ ...content, [key]: value });
  };
  const show = (key: string) => shouldShowEditorSection(sectionId, key);

  return (
    <div className="space-y-2">
      {!sectionId && (
      <div className={sectionCls}>
        <SectionHeading>SEO</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>ページタイトル</FieldLabel>
            <Input
              className={inputCls}
              value={content.seo.title}
              onChange={(e) => update("seo", { ...content.seo, title: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>メタ description</FieldLabel>
            <Textarea
              className={textareaCls}
              rows={3}
              value={content.seo.description}
              onChange={(e) => update("seo", { ...content.seo, description: e.target.value })}
            />
          </div>
        </div>
      </div>
      )}

      {show("header-sticky") && (
      <div className={sectionCls}>
        <SectionHeading>ヘッダー・固定CTA</SectionHeading>
        <div className="space-y-4">
          <ImageUploader
            label="ヘッダーロゴ"
            currentImage={content.header.logoUrl}
            onImageUpload={(url) => update("header", { ...content.header, logoUrl: url })}
          />
          <div>
            <FieldLabel>ロゴ alt</FieldLabel>
            <Input
              className={inputCls}
              value={content.header.logoAlt}
              onChange={(e) => update("header", { ...content.header, logoAlt: e.target.value })}
            />
          </div>
          <CtaFields
            label={content.header.ctaLabel}
            href={content.header.ctaHref}
            onLabel={(v) => update("header", { ...content.header, ctaLabel: v })}
            onHref={(v) => update("header", { ...content.header, ctaHref: v })}
          />
          <div>
            <FieldLabel>画面下部固定CTA</FieldLabel>
            <CtaFields
              label={content.stickyCta.label}
              href={content.stickyCta.ctaHref}
              onLabel={(v) => update("stickyCta", { ...content.stickyCta, label: v })}
              onHref={(v) => update("stickyCta", { ...content.stickyCta, ctaHref: v })}
            />
          </div>
        </div>
      </div>
      )}

      {show("hero") && (
      <div className={sectionCls}>
        <SectionHeading>ファーストビュー</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>アイブロウ（帯文言）</FieldLabel>
            <Input
              className={inputCls}
              value={content.hero.eyebrow}
              onChange={(e) => update("hero", { ...content.hero, eyebrow: e.target.value })}
            />
          </div>
          <ImageUploader
            label="ヒーロー画像"
            currentImage={content.hero.heroImageUrl}
            onImageUpload={(url) => update("hero", { ...content.hero, heroImageUrl: url })}
          />
          <div>
            <FieldLabel>ヒーロー画像 alt</FieldLabel>
            <Input
              className={inputCls}
              value={content.hero.heroImageAlt}
              onChange={(e) => update("hero", { ...content.hero, heroImageAlt: e.target.value })}
            />
          </div>
          <CtaFields
            label={content.hero.primaryCtaLabel}
            href={content.hero.primaryCtaHref}
            onLabel={(v) => update("hero", { ...content.hero, primaryCtaLabel: v })}
            onHref={(v) => update("hero", { ...content.hero, primaryCtaHref: v })}
          />
          <div>
            <FieldLabel>本文（HTML可）</FieldLabel>
            <Textarea
              className={textareaCls}
              rows={4}
              value={content.hero.bodyHtml}
              onChange={(e) => update("hero", { ...content.hero, bodyHtml: e.target.value })}
            />
          </div>
        </div>
      </div>
      )}

      {show("eventInfo") && (
      <div className={sectionCls}>
        <SectionHeading>イベント情報（上部）</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>セクションラベル</FieldLabel>
            <Input
              className={inputCls}
              value={content.eventInfo.label}
              onChange={(e) => update("eventInfo", { ...content.eventInfo, label: e.target.value })}
            />
          </div>
          <LabelValueRowsEditor
            rows={content.eventInfo.rows}
            onChange={(rows) => update("eventInfo", { ...content.eventInfo, rows })}
          />
        </div>
      </div>
      )}

      {show("problem") && (
      <div className={sectionCls}>
        <SectionHeading>悩み（PROBLEM）</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            placeholder="セクションラベル"
            value={content.empathy.label}
            onChange={(e) => update("empathy", { ...content.empathy, label: e.target.value })}
          />
          <Input
            className={inputCls}
            placeholder="見出し"
            value={content.empathy.title}
            onChange={(e) => update("empathy", { ...content.empathy, title: e.target.value })}
          />
          <StringListEditor
            items={content.empathy.items}
            onChange={(items) => update("empathy", { ...content.empathy, items })}
          />
        </div>
      </div>
      )}

      {show("solution") && (
      <div className={sectionCls}>
        <SectionHeading>ソリューション</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            value={content.solution.label}
            onChange={(e) => update("solution", { ...content.solution, label: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={2}
            placeholder="見出し（HTML可）"
            value={content.solution.titleHtml}
            onChange={(e) => update("solution", { ...content.solution, titleHtml: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.solution.subtitle}
            onChange={(e) => update("solution", { ...content.solution, subtitle: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            value={content.solution.body}
            onChange={(e) => update("solution", { ...content.solution, body: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.solution.benefitsHeading}
            onChange={(e) =>
              update("solution", { ...content.solution, benefitsHeading: e.target.value })
            }
          />
          <StringListEditor
            items={content.solution.benefits}
            onChange={(benefits) => update("solution", { ...content.solution, benefits })}
          />
          <CtaFields
            label={content.solution.ctaLabel}
            href={content.solution.ctaHref}
            onLabel={(v) => update("solution", { ...content.solution, ctaLabel: v })}
            onHref={(v) => update("solution", { ...content.solution, ctaHref: v })}
          />
        </div>
      </div>
      )}

      {show("program") && (
      <div className={sectionCls}>
        <SectionHeading>プログラム</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            value={content.program.label}
            onChange={(e) => update("program", { ...content.program, label: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.program.titleHtml}
            onChange={(e) => update("program", { ...content.program, titleHtml: e.target.value })}
          />
          <FlowStepsEditor
            steps={content.program.steps}
            onChange={(steps) => update("program", { ...content.program, steps })}
          />
          <Input
            className={inputCls}
            value={content.program.pointsHeading}
            onChange={(e) =>
              update("program", { ...content.program, pointsHeading: e.target.value })
            }
          />
          <StringListEditor
            items={content.program.points}
            onChange={(points) => update("program", { ...content.program, points })}
          />
        </div>
      </div>
      )}

      {show("facilitator") && (
      <div className={sectionCls}>
        <SectionHeading>ファシリテーター</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            value={content.facilitator.label}
            onChange={(e) => update("facilitator", { ...content.facilitator, label: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.facilitator.title}
            onChange={(e) => update("facilitator", { ...content.facilitator, title: e.target.value })}
          />
          <ImageUploader
            label="写真"
            currentImage={content.facilitator.imageUrl}
            onImageUpload={(url) =>
              update("facilitator", { ...content.facilitator, imageUrl: url })
            }
          />
          <Input
            className={inputCls}
            value={content.facilitator.name}
            onChange={(e) => update("facilitator", { ...content.facilitator, name: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.facilitator.role}
            onChange={(e) => update("facilitator", { ...content.facilitator, role: e.target.value })}
          />
          <StringListEditor
            items={content.facilitator.bio}
            onChange={(bio) => update("facilitator", { ...content.facilitator, bio })}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            value={content.facilitator.quote}
            onChange={(e) => update("facilitator", { ...content.facilitator, quote: e.target.value })}
          />
        </div>
      </div>
      )}

      {show("voices") && (
      <div className={sectionCls}>
        <SectionHeading>参加者の声</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            value={content.voices.label}
            onChange={(e) => update("voices", { ...content.voices, label: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.voices.title}
            onChange={(e) => update("voices", { ...content.voices, title: e.target.value })}
          />
          <VoicesEditor
            items={content.voices.items}
            onChange={(items) => update("voices", { ...content.voices, items })}
          />
        </div>
      </div>
      )}

      {show("info") && (
      <div className={sectionCls}>
        <SectionHeading>開催情報（詳細）</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            value={content.detail.label}
            onChange={(e) => update("detail", { ...content.detail, label: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.detail.title}
            onChange={(e) => update("detail", { ...content.detail, title: e.target.value })}
          />
          <LabelValueRowsEditor
            rows={content.detail.scheduleRows}
            onChange={(scheduleRows) => update("detail", { ...content.detail, scheduleRows })}
          />
          <div>
            <FieldLabel>Google Maps 埋め込み URL</FieldLabel>
            <Textarea
              className={textareaCls}
              rows={2}
              value={content.detail.mapEmbedUrl}
              onChange={(e) =>
                update("detail", { ...content.detail, mapEmbedUrl: e.target.value })
              }
            />
          </div>
          <CtaFields
            label={content.detail.ctaLabel}
            href={content.detail.ctaHref}
            onLabel={(v) => update("detail", { ...content.detail, ctaLabel: v })}
            onHref={(v) => update("detail", { ...content.detail, ctaHref: v })}
          />
        </div>
      </div>
      )}

      {show("target") && (
      <div className={sectionCls}>
        <SectionHeading>おすすめ対象</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            value={content.target.label}
            onChange={(e) => update("target", { ...content.target, label: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.target.title}
            onChange={(e) => update("target", { ...content.target, title: e.target.value })}
          />
          <StringListEditor
            items={content.target.items}
            onChange={(items) => update("target", { ...content.target, items })}
          />
        </div>
      </div>
      )}

      {show("faq") && (
      <div className={sectionCls}>
        <SectionHeading>FAQ</SectionHeading>
        <div className="space-y-4">
          <Input
            className={inputCls}
            value={content.faq.label}
            onChange={(e) => update("faq", { ...content.faq, label: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.faq.title}
            onChange={(e) => update("faq", { ...content.faq, title: e.target.value })}
          />
          <FaqEditor
            items={content.faq.items}
            onChange={(items) => update("faq", { ...content.faq, items })}
          />
        </div>
      </div>
      )}

      {show("final-footer") && (
      <div className={sectionCls}>
        <SectionHeading>最終CTA・フッター</SectionHeading>
        <div className="space-y-4">
          <Textarea
            className={textareaCls}
            rows={2}
            placeholder="見出し（HTML可）"
            value={content.finalCta.titleHtml}
            onChange={(e) => update("finalCta", { ...content.finalCta, titleHtml: e.target.value })}
          />
          <StringListEditor
            items={content.finalCta.paragraphs}
            onChange={(paragraphs) => update("finalCta", { ...content.finalCta, paragraphs })}
          />
          <CtaFields
            label={content.finalCta.ctaLabel}
            href={content.finalCta.ctaHref}
            onLabel={(v) => update("finalCta", { ...content.finalCta, ctaLabel: v })}
            onHref={(v) => update("finalCta", { ...content.finalCta, ctaHref: v })}
          />
          <Input
            className={inputCls}
            value={content.finalCta.note}
            onChange={(e) => update("finalCta", { ...content.finalCta, note: e.target.value })}
          />
          <StringListEditor
            items={content.footer.lines}
            onChange={(lines) => update("footer", { ...content.footer, lines })}
            addLabel="フッター行を追加"
          />
          <Input
            className={inputCls}
            value={content.footer.copyright}
            onChange={(e) => update("footer", { ...content.footer, copyright: e.target.value })}
          />
        </div>
      </div>
      )}
    </div>
  );
}
