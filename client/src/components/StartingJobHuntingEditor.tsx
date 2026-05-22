import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";
import type {
  DeliverableItem,
  FaqItem,
  LabelValueRow,
  ProgramRow,
  StartingJobHuntingContent,
  VoiceItem,
} from "@/types/starting-job-hunting";

interface Props {
  content: StartingJobHuntingContent;
  onChange: (content: StartingJobHuntingContent) => void;
}

const sectionCls = "mb-8 rounded-xl border border-[#ffd7c3] bg-white p-6";
const headingStyle = { fontFamily: "'Shippori Mincho', serif" } as const;
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
        <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-[#fffaf5] border border-[#ffd7c3]">
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
          <div className="flex gap-2">
            <Input
              className={inputCls}
              placeholder="補足（任意）"
              value={row.sub ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, sub: e.target.value || undefined };
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

export function StartingJobHuntingEditor({ content, onChange }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  const isOpen = (key: string) => !collapsed[key];

  const update = <K extends keyof StartingJobHuntingContent>(
    key: K,
    value: StartingJobHuntingContent[K],
  ) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-2">
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

      <div className={sectionCls}>
        <SectionHeading>ヘッダー・固定CTA</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>ロゴ画像</FieldLabel>
            <ImageUploader
              label="ロゴ画像"
              currentImage={content.header.logoUrl}
              onImageUpload={(url) => update("header", { ...content.header, logoUrl: url })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>ロゴ alt</FieldLabel>
              <Input
                className={inputCls}
                value={content.header.logoAlt}
                onChange={(e) => update("header", { ...content.header, logoAlt: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>ヘッダーCTA URL</FieldLabel>
              <Input
                className={inputCls}
                value={content.header.ctaHref}
                onChange={(e) => update("header", { ...content.header, ctaHref: e.target.value })}
              />
            </div>
          </div>
          <div>
            <FieldLabel>ヘッダーCTAラベル（PC）</FieldLabel>
            <Input
              className={inputCls}
              value={content.header.ctaLabel}
              onChange={(e) => update("header", { ...content.header, ctaLabel: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>ヘッダーCTAラベル（モバイル・短め）</FieldLabel>
            <Input
              className={inputCls}
              value={content.header.ctaLabelMobile ?? ""}
              placeholder="公式LINEを追加"
              onChange={(e) =>
                update("header", {
                  ...content.header,
                  ctaLabelMobile: e.target.value || undefined,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#ffd7c3]">
            <div>
              <FieldLabel>下部固定CTAラベル</FieldLabel>
              <Input
                className={inputCls}
                value={content.stickyCta.label}
                onChange={(e) => update("stickyCta", { ...content.stickyCta, label: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>下部固定CTA URL</FieldLabel>
              <Input
                className={inputCls}
                value={content.stickyCta.ctaHref}
                onChange={(e) => update("stickyCta", { ...content.stickyCta, ctaHref: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("hero")}>
          <SectionHeading>ファーストビュー</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("hero") ? "▲" : "▼"}</span>
        </button>
        {isOpen("hero") && (
          <div className="space-y-4 mt-2">
            <div>
              <FieldLabel>キッカー（上部帯）</FieldLabel>
              <Input
                className={inputCls}
                value={content.hero.kicker}
                onChange={(e) => update("hero", { ...content.hero, kicker: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>ヒーロー画像</FieldLabel>
              <ImageUploader
                label="ヒーロー画像"
                currentImage={content.hero.heroImageUrl}
                onImageUpload={(url) => update("hero", { ...content.hero, heroImageUrl: url })}
              />
            </div>
            <div>
              <FieldLabel>ヒーロー画像 alt</FieldLabel>
              <Input
                className={inputCls}
                value={content.hero.heroImageAlt}
                onChange={(e) => update("hero", { ...content.hero, heroImageAlt: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>メインCTAラベル</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.hero.primaryCtaLabel}
                  onChange={(e) =>
                    update("hero", { ...content.hero, primaryCtaLabel: e.target.value })
                  }
                />
              </div>
              <div>
                <FieldLabel>メインCTA URL</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.hero.primaryCtaHref}
                  onChange={(e) =>
                    update("hero", { ...content.hero, primaryCtaHref: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <FieldLabel>リード文（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={5}
                value={content.hero.bodyHtml}
                onChange={(e) => update("hero", { ...content.hero, bodyHtml: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button
          type="button"
          className="w-full flex justify-between items-center"
          onClick={() => toggle("eventInfo")}
        >
          <SectionHeading>イベント概要（FV下）</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("eventInfo") ? "▲" : "▼"}</span>
        </button>
        {isOpen("eventInfo") && (
          <div className="space-y-4 mt-2">
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
        )}
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("problem")}>
          <SectionHeading>Problem</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("problem") ? "▲" : "▼"}</span>
        </button>
        {isOpen("problem") && (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>スクリプトラベル</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.problem.script}
                  onChange={(e) => update("problem", { ...content.problem, script: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>締めの一言（任意）</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.problem.reassurance ?? ""}
                  onChange={(e) =>
                    update("problem", {
                      ...content.problem,
                      reassurance: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <FieldLabel>見出し（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.problem.titleHtml}
                onChange={(e) => update("problem", { ...content.problem, titleHtml: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>悩みリスト</FieldLabel>
              <StringListEditor
                items={content.problem.items}
                onChange={(items) => update("problem", { ...content.problem, items })}
              />
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("insight")}>
          <SectionHeading>Insight</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("insight") ? "▲" : "▼"}</span>
        </button>
        {isOpen("insight") && (
          <div className="space-y-4 mt-2">
            <div>
              <FieldLabel>スクリプトラベル</FieldLabel>
              <Input
                className={inputCls}
                value={content.insight.script}
                onChange={(e) => update("insight", { ...content.insight, script: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>見出し（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.insight.titleHtml}
                onChange={(e) => update("insight", { ...content.insight, titleHtml: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>本文段落</FieldLabel>
              <StringListEditor
                items={content.insight.paragraphs}
                onChange={(paragraphs) => update("insight", { ...content.insight, paragraphs })}
                addLabel="段落を追加"
              />
            </div>
            <div>
              <FieldLabel>キーメッセージ</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.insight.keyLine}
                onChange={(e) => update("insight", { ...content.insight, keyLine: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("solution")}>
          <SectionHeading>Solution</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("solution") ? "▲" : "▼"}</span>
        </button>
        {isOpen("solution") && (
          <div className="space-y-4 mt-2">
            <div>
              <FieldLabel>スクリプトラベル</FieldLabel>
              <Input
                className={inputCls}
                value={content.solution.script}
                onChange={(e) => update("solution", { ...content.solution, script: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>見出し（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.solution.titleHtml}
                onChange={(e) => update("solution", { ...content.solution, titleHtml: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>リード文</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={3}
                value={content.solution.lead}
                onChange={(e) => update("solution", { ...content.solution, lead: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>成果物見出し</FieldLabel>
              <Input
                className={inputCls}
                value={content.solution.deliverablesHeading}
                onChange={(e) =>
                  update("solution", { ...content.solution, deliverablesHeading: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>成果物リスト</FieldLabel>
              {content.solution.deliverables.map((d: DeliverableItem, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    className={`${inputCls} w-20`}
                    value={d.num}
                    onChange={(e) => {
                      const next = [...content.solution.deliverables];
                      next[i] = { ...d, num: e.target.value };
                      update("solution", { ...content.solution, deliverables: next });
                    }}
                  />
                  <Textarea
                    className={textareaCls}
                    rows={2}
                    value={d.text}
                    onChange={(e) => {
                      const next = [...content.solution.deliverables];
                      next[i] = { ...d, text: e.target.value };
                      update("solution", { ...content.solution, deliverables: next });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 border-[#ffd7c3] text-[#d4844b]"
                    onClick={() =>
                      update("solution", {
                        ...content.solution,
                        deliverables: content.solution.deliverables.filter((_, j) => j !== i),
                      })
                    }
                  >
                    削除
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="border-[#d4844b] text-[#d4844b]"
                onClick={() =>
                  update("solution", {
                    ...content.solution,
                    deliverables: [
                      ...content.solution.deliverables,
                      { num: String(content.solution.deliverables.length + 1).padStart(2, "0"), text: "" },
                    ],
                  })
                }
              >
                成果物を追加
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <SectionHeading>中間CTA</SectionHeading>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>ラベル</FieldLabel>
            <Input
              className={inputCls}
              value={content.midCta.label}
              onChange={(e) => update("midCta", { ...content.midCta, label: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>URL</FieldLabel>
            <Input
              className={inputCls}
              value={content.midCta.ctaHref}
              onChange={(e) => update("midCta", { ...content.midCta, ctaHref: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("program")}>
          <SectionHeading>Program</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("program") ? "▲" : "▼"}</span>
        </button>
        {isOpen("program") && (
          <div className="space-y-4 mt-2">
            <div>
              <FieldLabel>見出し（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.program.titleHtml}
                onChange={(e) => update("program", { ...content.program, titleHtml: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>当日の流れ</FieldLabel>
              {content.program.rows.map((row: ProgramRow, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    className={`${inputCls} w-36`}
                    placeholder="ステップ"
                    value={row.step}
                    onChange={(e) => {
                      const next = [...content.program.rows];
                      next[i] = { ...row, step: e.target.value };
                      update("program", { ...content.program, rows: next });
                    }}
                  />
                  <Textarea
                    className={textareaCls}
                    rows={2}
                    value={row.content}
                    onChange={(e) => {
                      const next = [...content.program.rows];
                      next[i] = { ...row, content: e.target.value };
                      update("program", { ...content.program, rows: next });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 border-[#ffd7c3] text-[#d4844b]"
                    onClick={() =>
                      update("program", {
                        ...content.program,
                        rows: content.program.rows.filter((_, j) => j !== i),
                      })
                    }
                  >
                    削除
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="border-[#d4844b] text-[#d4844b]"
                onClick={() =>
                  update("program", {
                    ...content.program,
                    rows: [...content.program.rows, { step: "", content: "" }],
                  })
                }
              >
                行を追加
              </Button>
            </div>
            <div>
              <FieldLabel>補足ポイント</FieldLabel>
              <StringListEditor
                items={content.program.points}
                onChange={(points) => update("program", { ...content.program, points })}
              />
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button
          type="button"
          className="w-full flex justify-between items-center"
          onClick={() => toggle("facilitator")}
        >
          <SectionHeading>Facilitator</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("facilitator") ? "▲" : "▼"}</span>
        </button>
        {isOpen("facilitator") && (
          <div className="space-y-4 mt-2">
            <div>
              <FieldLabel>写真</FieldLabel>
              <ImageUploader
                label="ファシリテーター写真"
                currentImage={content.facilitator.imageUrl}
                onImageUpload={(url) =>
                  update("facilitator", { ...content.facilitator, imageUrl: url })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>氏名</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.facilitator.name}
                  onChange={(e) => update("facilitator", { ...content.facilitator, name: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>役職</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.facilitator.role}
                  onChange={(e) => update("facilitator", { ...content.facilitator, role: e.target.value })}
                />
              </div>
            </div>
            <div>
              <FieldLabel>経歴</FieldLabel>
              <StringListEditor
                items={content.facilitator.bio}
                onChange={(bio) => update("facilitator", { ...content.facilitator, bio })}
              />
            </div>
            <div>
              <FieldLabel>メッセージ</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={4}
                value={content.facilitator.quote}
                onChange={(e) => update("facilitator", { ...content.facilitator, quote: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("voices")}>
          <SectionHeading>参加者の声</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("voices") ? "▲" : "▼"}</span>
        </button>
        {isOpen("voices") && (
          <div className="space-y-3 mt-2">
            {content.voices.items.map((v: VoiceItem, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#fffaf5] border border-[#ffd7c3] space-y-2">
                <Input
                  className={inputCls}
                  placeholder="学校・学部"
                  value={v.school}
                  onChange={(e) => {
                    const next = [...content.voices.items];
                    next[i] = { ...v, school: e.target.value };
                    update("voices", { ...content.voices, items: next });
                  }}
                />
                <Textarea
                  className={textareaCls}
                  rows={3}
                  value={v.comment}
                  onChange={(e) => {
                    const next = [...content.voices.items];
                    next[i] = { ...v, comment: e.target.value };
                    update("voices", { ...content.voices, items: next });
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#ffd7c3] text-[#d4844b]"
                  onClick={() =>
                    update("voices", {
                      ...content.voices,
                      items: content.voices.items.filter((_, j) => j !== i),
                    })
                  }
                >
                  削除
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="border-[#d4844b] text-[#d4844b]"
              onClick={() =>
                update("voices", {
                  ...content.voices,
                  items: [...content.voices.items, { school: "", comment: "" }],
                })
              }
            >
              声を追加
            </Button>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("info")}>
          <SectionHeading>開催情報・地図</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("info") ? "▲" : "▼"}</span>
        </button>
        {isOpen("info") && (
          <div className="space-y-4 mt-2">
            <LabelValueRowsEditor
              rows={content.info.scheduleRows}
              onChange={(scheduleRows) => update("info", { ...content.info, scheduleRows })}
            />
            <div>
              <FieldLabel>Google Maps 埋め込み URL</FieldLabel>
              <Input
                className={inputCls}
                value={content.info.mapEmbedUrl}
                onChange={(e) => update("info", { ...content.info, mapEmbedUrl: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>CTAラベル</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.info.ctaLabel}
                  onChange={(e) => update("info", { ...content.info, ctaLabel: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>CTA URL</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.info.ctaHref}
                  onChange={(e) => update("info", { ...content.info, ctaHref: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button
          type="button"
          className="w-full flex justify-between items-center"
          onClick={() => toggle("recommend")}
        >
          <SectionHeading>おすすめの方</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("recommend") ? "▲" : "▼"}</span>
        </button>
        {isOpen("recommend") && (
          <div className="mt-2">
            <StringListEditor
              items={content.recommend.items}
              onChange={(items) => update("recommend", { ...content.recommend, items })}
            />
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("faq")}>
          <SectionHeading>FAQ</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("faq") ? "▲" : "▼"}</span>
        </button>
        {isOpen("faq") && (
          <div className="space-y-3 mt-2">
            {content.faq.items.map((item: FaqItem, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#fffaf5] border border-[#ffd7c3] space-y-2">
                <Input
                  className={inputCls}
                  placeholder="質問"
                  value={item.q}
                  onChange={(e) => {
                    const next = [...content.faq.items];
                    next[i] = { ...item, q: e.target.value };
                    update("faq", { ...content.faq, items: next });
                  }}
                />
                <Textarea
                  className={textareaCls}
                  rows={3}
                  value={item.a}
                  onChange={(e) => {
                    const next = [...content.faq.items];
                    next[i] = { ...item, a: e.target.value };
                    update("faq", { ...content.faq, items: next });
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#ffd7c3] text-[#d4844b]"
                  onClick={() =>
                    update("faq", {
                      ...content.faq,
                      items: content.faq.items.filter((_, j) => j !== i),
                    })
                  }
                >
                  削除
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="border-[#d4844b] text-[#d4844b]"
              onClick={() =>
                update("faq", {
                  ...content.faq,
                  items: [...content.faq.items, { q: "", a: "" }],
                })
              }
            >
              FAQを追加
            </Button>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button
          type="button"
          className="w-full flex justify-between items-center"
          onClick={() => toggle("finalCta")}
        >
          <SectionHeading>最終CTA・フッター</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("finalCta") ? "▲" : "▼"}</span>
        </button>
        {isOpen("finalCta") && (
          <div className="space-y-4 mt-2">
            <div>
              <FieldLabel>見出し（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.finalCta.titleHtml}
                onChange={(e) => update("finalCta", { ...content.finalCta, titleHtml: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>リード（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={3}
                value={content.finalCta.subHtml}
                onChange={(e) => update("finalCta", { ...content.finalCta, subHtml: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>メタ項目（✓ 付き）</FieldLabel>
              <StringListEditor
                items={content.finalCta.metaItems}
                onChange={(metaItems) => update("finalCta", { ...content.finalCta, metaItems })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>CTAラベル</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.finalCta.ctaLabel}
                  onChange={(e) => update("finalCta", { ...content.finalCta, ctaLabel: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>CTA URL</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.finalCta.ctaHref}
                  onChange={(e) => update("finalCta", { ...content.finalCta, ctaHref: e.target.value })}
                />
              </div>
            </div>
            <div>
              <FieldLabel>注記（HTML可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.finalCta.noteHtml}
                onChange={(e) => update("finalCta", { ...content.finalCta, noteHtml: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>フッター行</FieldLabel>
              <StringListEditor
                items={content.footer.lines}
                onChange={(lines) => update("footer", { ...content.footer, lines })}
              />
            </div>
            <div>
              <FieldLabel>コピーライト</FieldLabel>
              <Input
                className={inputCls}
                value={content.footer.copyright}
                onChange={(e) => update("footer", { ...content.footer, copyright: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
