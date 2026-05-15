import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";
import type { BtobSeminarContent } from "@/types/btob-seminar";

interface Props {
  content: BtobSeminarContent;
  onChange: (content: BtobSeminarContent) => void;
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

export function BtobSeminarEditor({ content, onChange }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  const isOpen = (key: string) => !collapsed[key];

  const update = <K extends keyof BtobSeminarContent>(key: K, value: BtobSeminarContent[K]) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-2">
      <div className={sectionCls}>
        <SectionHeading>SEO（title / description）</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>ページタイトル（&lt;title&gt;）</FieldLabel>
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
        <SectionHeading>ヘッダー</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>ロゴ行（HTML可）</FieldLabel>
            <Textarea
              className={textareaCls}
              rows={2}
              value={content.header.logoHtml}
              onChange={(e) => update("header", { ...content.header, logoHtml: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>バッジ文言</FieldLabel>
              <Input
                className={inputCls}
                value={content.header.badgeLabel}
                onChange={(e) => update("header", { ...content.header, badgeLabel: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>ヘッダーCTAリンク（#apply 等）</FieldLabel>
              <Input
                className={inputCls}
                value={content.header.ctaHref}
                onChange={(e) => update("header", { ...content.header, ctaHref: e.target.value })}
              />
            </div>
          </div>
          <div>
            <FieldLabel>ヘッダーCTAラベル</FieldLabel>
            <Input
              className={inputCls}
              value={content.header.ctaLabel}
              onChange={(e) => update("header", { ...content.header, ctaLabel: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("hero")}>
          <SectionHeading>ヒーロー</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("hero") ? "▲" : "▼"}</span>
        </button>
        {isOpen("hero") && (
          <div className="space-y-4 mt-2">
            <div>
              <FieldLabel>カテゴリピル（HTML）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={2}
                value={content.hero.categoryPillHtml}
                onChange={(e) => update("hero", { ...content.hero, categoryPillHtml: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>カテゴリ横メタ</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.hero.categoryMeta}
                  onChange={(e) => update("hero", { ...content.hero, categoryMeta: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>セミナー名（1行）</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.hero.seminarName}
                  onChange={(e) => update("hero", { ...content.hero, seminarName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <FieldLabel>メイン見出し（HTML、&lt;br&gt;可）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={5}
                value={content.hero.h1Html}
                onChange={(e) => update("hero", { ...content.hero, h1Html: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>リード文（HTML）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={4}
                value={content.hero.leadHtml}
                onChange={(e) => update("hero", { ...content.hero, leadHtml: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {content.hero.info.slice(0, 4).map((row, i) => (
                <div key={i} className="space-y-2 rounded border border-[#ffd7c3]/60 p-3">
                  <FieldLabel>情報ブロック {i + 1} ラベル</FieldLabel>
                  <Input
                    className={inputCls}
                    value={row.label}
                    onChange={(e) => {
                      const next = content.hero.info.slice();
                      next[i] = { ...next[i], label: e.target.value };
                      update("hero", { ...content.hero, info: next });
                    }}
                  />
                  <FieldLabel>値</FieldLabel>
                  <Input
                    className={inputCls}
                    value={row.value}
                    onChange={(e) => {
                      const next = content.hero.info.slice();
                      next[i] = { ...next[i], value: e.target.value };
                      update("hero", { ...content.hero, info: next });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>メインCTAラベル</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.hero.primaryCtaLabel}
                  onChange={(e) => update("hero", { ...content.hero, primaryCtaLabel: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>メインCTAリンク</FieldLabel>
                <Input
                  className={inputCls}
                  value={content.hero.primaryCtaHref}
                  onChange={(e) => update("hero", { ...content.hero, primaryCtaHref: e.target.value })}
                />
              </div>
            </div>
            <div>
              <FieldLabel>CTA下の注記</FieldLabel>
              <Input
                className={inputCls}
                value={content.hero.primaryCtaFinePrint}
                onChange={(e) => update("hero", { ...content.hero, primaryCtaFinePrint: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("empathy")}>
          <SectionHeading>共感セクション</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("empathy") ? "▲" : "▼"}</span>
        </button>
        {isOpen("empathy") && (
          <div className="space-y-4 mt-2">
            <Input
              className={inputCls}
              value={content.empathy.script}
              onChange={(e) => update("empathy", { ...content.empathy, script: e.target.value })}
            />
            <Textarea
              className={textareaCls}
              placeholder="見出し HTML"
              rows={2}
              value={content.empathy.titleHtml}
              onChange={(e) => update("empathy", { ...content.empathy, titleHtml: e.target.value })}
            />
            <Textarea
              className={textareaCls}
              placeholder="リード HTML"
              rows={4}
              value={content.empathy.leadHtml}
              onChange={(e) => update("empathy", { ...content.empathy, leadHtml: e.target.value })}
            />
            <div>
              <FieldLabel>チェックリスト（1行1項目）</FieldLabel>
              <Textarea
                className={textareaCls}
                rows={6}
                value={content.empathy.checklist.join("\n")}
                onChange={(e) =>
                  update("empathy", {
                    ...content.empathy,
                    checklist: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <Textarea
              className={textareaCls}
              placeholder="コールアウト"
              rows={2}
              value={content.empathy.callout}
              onChange={(e) => update("empathy", { ...content.empathy, callout: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className={sectionCls}>
        <SectionHeading>ループ図（4ステップ）</SectionHeading>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              className={inputCls}
              placeholder="英字スクリプト"
              value={content.structure.script}
              onChange={(e) => update("structure", { ...content.structure, script: e.target.value })}
            />
            <Input
              className={inputCls}
              placeholder="下サブコピー"
              value={content.structure.sub}
              onChange={(e) => update("structure", { ...content.structure, sub: e.target.value })}
            />
          </div>
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.structure.titleHtml}
            onChange={(e) => update("structure", { ...content.structure, titleHtml: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            value={content.structure.noteHtml}
            onChange={(e) => update("structure", { ...content.structure, noteHtml: e.target.value })}
          />
          {content.structure.steps.map((s, i) => (
            <div key={i} className="rounded border border-[#ffd7c3]/60 p-3 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  className={inputCls}
                  value={s.num}
                  onChange={(e) => {
                    const next = content.structure.steps.slice();
                    next[i] = { ...next[i], num: e.target.value };
                    update("structure", { ...content.structure, steps: next });
                  }}
                />
                <Input
                  className={inputCls}
                  placeholder="ラベル"
                  value={s.label}
                  onChange={(e) => {
                    const next = content.structure.steps.slice();
                    next[i] = { ...next[i], label: e.target.value };
                    update("structure", { ...content.structure, steps: next });
                  }}
                />
                <Input
                  className={inputCls}
                  placeholder="説明"
                  value={s.desc}
                  onChange={(e) => {
                    const next = content.structure.steps.slice();
                    next[i] = { ...next[i], desc: e.target.value };
                    update("structure", { ...content.structure, steps: next });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <SectionHeading>講師</SectionHeading>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              className={inputCls}
              value={content.speaker.script}
              onChange={(e) => update("speaker", { ...content.speaker, script: e.target.value })}
            />
            <Input
              className={inputCls}
              value={content.speaker.meta}
              onChange={(e) => update("speaker", { ...content.speaker, meta: e.target.value })}
            />
          </div>
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.speaker.titleHtml}
            onChange={(e) => update("speaker", { ...content.speaker, titleHtml: e.target.value })}
          />
          <div className="max-w-xs">
            <FieldLabel>顔写真（任意・URL）</FieldLabel>
            <ImageUploader
              label="講師アバター画像"
              currentImage={content.speaker.avatarImageUrl ?? undefined}
              onImageUpload={(url) => update("speaker", { ...content.speaker, avatarImageUrl: url })}
            />
            {content.speaker.avatarImageUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 border-[#d4844b] text-[#d4844b]"
                onClick={() => update("speaker", { ...content.speaker, avatarImageUrl: null })}
              >
                画像をやめて文字アバターに戻す
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>文字アバター（1文字程度）</FieldLabel>
              <Input
                className={inputCls}
                value={content.speaker.avatarChar}
                onChange={(e) => update("speaker", { ...content.speaker, avatarChar: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>写真欄 肩書き</FieldLabel>
              <Input
                className={inputCls}
                value={content.speaker.photoRole}
                onChange={(e) => update("speaker", { ...content.speaker, photoRole: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              className={inputCls}
              placeholder="写真欄 氏名"
              value={content.speaker.photoName}
              onChange={(e) => update("speaker", { ...content.speaker, photoName: e.target.value })}
            />
            <Input
              className={inputCls}
              placeholder="本文欄 氏名"
              value={content.speaker.name}
              onChange={(e) => update("speaker", { ...content.speaker, name: e.target.value })}
            />
          </div>
          <Input
            className={inputCls}
            placeholder="会社・役職"
            value={content.speaker.company}
            onChange={(e) => update("speaker", { ...content.speaker, company: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={4}
            value={content.speaker.messageHtml}
            onChange={(e) => update("speaker", { ...content.speaker, messageHtml: e.target.value })}
          />
        </div>
      </div>

      <div className={sectionCls}>
        <SectionHeading>体験4カード / 持ち帰り3カード</SectionHeading>
        <div className="space-y-2 mb-4">
          <FieldLabel>体験ブロック英字</FieldLabel>
          <Input
            className={inputCls}
            value={content.experience.script}
            onChange={(e) => update("experience", { ...content.experience, script: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.experience.titleHtml}
            onChange={(e) => update("experience", { ...content.experience, titleHtml: e.target.value })}
          />
          <FieldLabel>持ち帰り英字 / 見出しHTML / サブ</FieldLabel>
          <Input
            className={inputCls}
            value={content.takeaway.script}
            onChange={(e) => update("takeaway", { ...content.takeaway, script: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.takeaway.titleHtml}
            onChange={(e) => update("takeaway", { ...content.takeaway, titleHtml: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.takeaway.sub}
            onChange={(e) => update("takeaway", { ...content.takeaway, sub: e.target.value })}
          />
        </div>
        <p className="text-xs text-[#5C3E2A] mb-3">各カードの本文は HTML 可（&lt;strong&gt; 等）</p>
        {content.experience.items.map((ex, i) => (
          <div key={i} className="mb-4 rounded border border-[#ffd7c3]/60 p-3 space-y-2">
            <div className="font-medium text-[#3D281E]">体験 {i + 1}</div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                className={inputCls}
                value={ex.num}
                onChange={(e) => {
                  const next = content.experience.items.slice();
                  next[i] = { ...next[i], num: e.target.value };
                  update("experience", { ...content.experience, items: next });
                }}
              />
              <Input
                className={inputCls}
                placeholder="タイトル"
                value={ex.name}
                onChange={(e) => {
                  const next = content.experience.items.slice();
                  next[i] = { ...next[i], name: e.target.value };
                  update("experience", { ...content.experience, items: next });
                }}
              />
            </div>
            <Textarea
              className={textareaCls}
              rows={3}
              value={ex.descHtml}
              onChange={(e) => {
                const next = content.experience.items.slice();
                next[i] = { ...next[i], descHtml: e.target.value };
                update("experience", { ...content.experience, items: next });
              }}
            />
          </div>
        ))}
        {content.takeaway.cards.map((c, i) => (
          <div key={i} className="mb-4 rounded border border-[#ffd7c3]/60 p-3 space-y-2">
            <div className="font-medium text-[#3D281E]">持ち帰り {i + 1}</div>
            <Input
              className={inputCls}
              placeholder="アイコン（① 等）"
              value={c.icon}
              onChange={(e) => {
                const next = content.takeaway.cards.slice();
                next[i] = { ...next[i], icon: e.target.value };
                update("takeaway", { ...content.takeaway, cards: next });
              }}
            />
            <Textarea
              className={textareaCls}
              rows={2}
              value={c.titleHtml}
              onChange={(e) => {
                const next = content.takeaway.cards.slice();
                next[i] = { ...next[i], titleHtml: e.target.value };
                update("takeaway", { ...content.takeaway, cards: next });
              }}
            />
            <Textarea
              className={textareaCls}
              rows={2}
              value={c.desc}
              onChange={(e) => {
                const next = content.takeaway.cards.slice();
                next[i] = { ...next[i], desc: e.target.value };
                update("takeaway", { ...content.takeaway, cards: next });
              }}
            />
          </div>
        ))}
      </div>

      <div className={sectionCls}>
        <SectionHeading>中段CTA / 対象者 / 主催</SectionHeading>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              className={inputCls}
              placeholder="mid eyebrow"
              value={content.midCta.eyebrow}
              onChange={(e) => update("midCta", { ...content.midCta, eyebrow: e.target.value })}
            />
            <Input
              className={inputCls}
              placeholder="mid CTA href"
              value={content.midCta.ctaHref}
              onChange={(e) => update("midCta", { ...content.midCta, ctaHref: e.target.value })}
            />
          </div>
          <Input
            className={inputCls}
            value={content.midCta.title}
            onChange={(e) => update("midCta", { ...content.midCta, title: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.midCta.meta}
            onChange={(e) => update("midCta", { ...content.midCta, meta: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.midCta.ctaLabel}
            onChange={(e) => update("midCta", { ...content.midCta, ctaLabel: e.target.value })}
          />
          <FieldLabel>対象者セクション 英字 / 見出しHTML</FieldLabel>
          <Input
            className={inputCls}
            value={content.audience.script}
            onChange={(e) => update("audience", { ...content.audience, script: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.audience.titleHtml}
            onChange={(e) => update("audience", { ...content.audience, titleHtml: e.target.value })}
          />
          <Input
            className={inputCls}
            placeholder="ノート横の英字（A Note 等）"
            value={content.audience.noteScript}
            onChange={(e) => update("audience", { ...content.audience, noteScript: e.target.value })}
          />
          <FieldLabel>おすすめ対象（1行1項目）</FieldLabel>
          <Textarea
            className={textareaCls}
            rows={4}
            value={content.audience.items.join("\n")}
            onChange={(e) =>
              update("audience", {
                ...content.audience,
                items: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.audience.noteTitleHtml}
            onChange={(e) => update("audience", { ...content.audience, noteTitleHtml: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            value={content.audience.noteBody}
            onChange={(e) => update("audience", { ...content.audience, noteBody: e.target.value })}
          />
          <Input
            className={inputCls}
            placeholder="主催セクション英字"
            value={content.hosts.script}
            onChange={(e) => update("hosts", { ...content.hosts, script: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={2}
            value={content.hosts.titleHtml}
            onChange={(e) => update("hosts", { ...content.hosts, titleHtml: e.target.value })}
          />
          {content.hosts.cards.map((host, i) => (
            <div key={i} className="rounded border border-[#ffd7c3]/60 p-3 space-y-2">
              <div className="text-sm font-bold text-[#3D281E]">主催カード {i + 1}</div>
              <Input
                className={inputCls}
                value={host.role}
                onChange={(e) => {
                  const next = content.hosts.cards.slice();
                  next[i] = { ...next[i], role: e.target.value };
                  update("hosts", { ...content.hosts, cards: next });
                }}
              />
              <Input
                className={inputCls}
                placeholder="roleJp"
                value={host.roleJp}
                onChange={(e) => {
                  const next = content.hosts.cards.slice();
                  next[i] = { ...next[i], roleJp: e.target.value };
                  update("hosts", { ...content.hosts, cards: next });
                }}
              />
              <Input
                className={inputCls}
                value={host.name}
                onChange={(e) => {
                  const next = content.hosts.cards.slice();
                  next[i] = { ...next[i], name: e.target.value };
                  update("hosts", { ...content.hosts, cards: next });
                }}
              />
              <Textarea
                className={textareaCls}
                rows={4}
                value={host.desc}
                onChange={(e) => {
                  const next = content.hosts.cards.slice();
                  next[i] = { ...next[i], desc: e.target.value };
                  update("hosts", { ...content.hosts, cards: next });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <SectionHeading>開催概要テーブル / FAQ</SectionHeading>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Input
            className={inputCls}
            placeholder="Details 英字"
            value={content.details.script}
            onChange={(e) => update("details", { ...content.details, script: e.target.value })}
          />
          <Input
            className={inputCls}
            placeholder="開催概要 見出し"
            value={content.details.title}
            onChange={(e) => update("details", { ...content.details, title: e.target.value })}
          />
          <Input
            className={inputCls}
            placeholder="FAQ 英字"
            value={content.faq.script}
            onChange={(e) => update("faq", { ...content.faq, script: e.target.value })}
          />
          <Input
            className={inputCls}
            placeholder="FAQ 見出し"
            value={content.faq.title}
            onChange={(e) => update("faq", { ...content.faq, title: e.target.value })}
          />
        </div>
        {content.details.rows.map((row, i) => (
          <div key={i} className="mb-3 grid grid-cols-2 gap-2">
            <Input
              className={inputCls}
              value={row.th}
              onChange={(e) => {
                const next = content.details.rows.slice();
                next[i] = { ...next[i], th: e.target.value };
                update("details", { ...content.details, rows: next });
              }}
            />
            <Textarea
              className={textareaCls}
              rows={2}
              value={row.tdHtml}
              onChange={(e) => {
                const next = content.details.rows.slice();
                next[i] = { ...next[i], tdHtml: e.target.value };
                update("details", { ...content.details, rows: next });
              }}
            />
          </div>
        ))}
        {content.faq.items.map((item, i) => (
          <div key={i} className="mb-4 rounded border border-[#ffd7c3]/60 p-3 space-y-2">
            <Input
              className={inputCls}
              value={item.q}
              onChange={(e) => {
                const next = content.faq.items.slice();
                next[i] = { ...next[i], q: e.target.value };
                update("faq", { ...content.faq, items: next });
              }}
            />
            <Textarea
              className={textareaCls}
              rows={3}
              value={item.a}
              onChange={(e) => {
                const next = content.faq.items.slice();
                next[i] = { ...next[i], a: e.target.value };
                update("faq", { ...content.faq, items: next });
              }}
            />
          </div>
        ))}
      </div>

      <div className={sectionCls}>
        <SectionHeading>最終CTA / フォーム / フッター</SectionHeading>
        <div className="space-y-4">
          <Textarea
            className={textareaCls}
            rows={3}
            value={content.finalCta.h2Html}
            onChange={(e) => update("finalCta", { ...content.finalCta, h2Html: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            value={content.finalCta.leadHtml}
            onChange={(e) => update("finalCta", { ...content.finalCta, leadHtml: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.finalCta.finePrint}
            onChange={(e) => update("finalCta", { ...content.finalCta, finePrint: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              className={inputCls}
              value={content.finalCta.ctaLabel}
              onChange={(e) => update("finalCta", { ...content.finalCta, ctaLabel: e.target.value })}
            />
            <Input
              className={inputCls}
              value={content.finalCta.ctaHref}
              onChange={(e) => update("finalCta", { ...content.finalCta, ctaHref: e.target.value })}
            />
          </div>
          <Input
            className={inputCls}
            placeholder="フォーム見出し"
            value={content.form.title}
            onChange={(e) => update("form", { ...content.form, title: e.target.value })}
          />
          <Textarea
            className={textareaCls}
            rows={3}
            value={content.form.subHtml}
            onChange={(e) => update("form", { ...content.form, subHtml: e.target.value })}
          />
          <Input
            className={inputCls}
            placeholder="iframe title（アクセシビリティ）"
            value={content.form.iframeTitle}
            onChange={(e) => update("form", { ...content.form, iframeTitle: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.form.embedUrl}
            onChange={(e) => update("form", { ...content.form, embedUrl: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              className={inputCls}
              placeholder="フォールバック前文"
              value={content.form.fallbackText}
              onChange={(e) => update("form", { ...content.form, fallbackText: e.target.value })}
            />
            <Input
              className={inputCls}
              placeholder="フォールバックリンク文言"
              value={content.form.fallbackLinkLabel}
              onChange={(e) => update("form", { ...content.form, fallbackLinkLabel: e.target.value })}
            />
          </div>
          <Input
            className={inputCls}
            value={content.form.fallbackUrl}
            onChange={(e) => update("form", { ...content.form, fallbackUrl: e.target.value })}
          />
          <Input
            className={inputCls}
            value={content.footer.copyright}
            onChange={(e) => update("footer", { ...content.footer, copyright: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
