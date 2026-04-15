import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";

/** SelfReflection コンテンツの型（SelfReflection.tsx と同一） */
export type SelfReflectionContent = {
  ctaUrl: string;
  floatingCtaLabel: string;
  hero: { titleHtml: string; sub: string; ctaLabel: string; bgImageUrl: string };
  eventInfo: {
    label: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    tags: string[];
  };
  issue: { heading: string; items: string[] };
  cause: { boldLead: string; quoteHtml: string; body: string; subCenter: string; ctaLabel: string };
  concept: { copyHtml: string; tagsHtml: string[] };
  steps: {
    heading: string;
    items: { num: string; min: string; title: string; tagline: string; desc?: string }[];
    images: { url: string; alt: string }[];
    ctaLabel: string;
  };
  voices: {
    heading: string;
    sub: string;
    cards: { change: string; quote: string }[];
  };
  safety: {
    heading: string;
    items: { label: string; desc: string }[];
  };
  advisor: {
    photoUrl: string;
    name: string;
    title: string;
    bio: string[];
    highlight: string;
  };
  faq: { heading: string; items: { q: string; a: string }[] };
  closingCta: { heading: string; sub: string; infoDate: string; infoVenueHtml: string; ctaLabel: string };
  footer: { brand: string; brandSub: string; company: string; copyright: string };
};

interface Props {
  content: SelfReflectionContent;
  onChange: (content: SelfReflectionContent) => void;
}

/* ---- style helpers ---- */
const sectionCls = "mb-8 rounded-xl border border-[#ffd7c3] bg-white p-6";
const headingStyle = { fontFamily: "'Shippori Mincho', serif" } as const;
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold text-[#3D281E] mb-4" style={headingStyle}>{children}</h3>
);
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-[#3D281E] text-sm font-medium">{children}</Label>
);
const inputCls = "border-[#ffd7c3] text-[#3D281E]";
const textareaCls = "border-[#ffd7c3] text-[#3D281E] min-h-[80px]";
const addBtnCls = "border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]";
const removeBtnCls = "text-red-500 hover:text-red-700 text-xs px-2 py-1";

export function SelfReflectionEditor({ content, onChange }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const update = <K extends keyof SelfReflectionContent>(
    key: K,
    value: SelfReflectionContent[K],
  ) => {
    onChange({ ...content, [key]: value });
  };

  const isOpen = (key: string) => !collapsed[key];

  return (
    <div className="space-y-2">
      {/* ---- CTA URL / フローティングボタン ---- */}
      <div className={sectionCls}>
        <SectionHeading>基本設定</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>CTA リンク先 URL</FieldLabel>
            <Input
              className={inputCls}
              value={content.ctaUrl}
              onChange={(e) => update("ctaUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <FieldLabel>フローティングボタン テキスト</FieldLabel>
            <Input
              className={inputCls}
              value={content.floatingCtaLabel}
              onChange={(e) => update("floatingCtaLabel", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ---- ヒーロー ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("hero")}>
          <SectionHeading>ヒーローセクション</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("hero") ? "▲" : "▼"}</span>
        </button>
        {isOpen("hero") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>タイトル（HTML可: &lt;br&gt;で改行）</FieldLabel>
              <Textarea
                className={textareaCls}
                value={content.hero.titleHtml}
                onChange={(e) => update("hero", { ...content.hero, titleHtml: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <FieldLabel>サブコピー</FieldLabel>
              <Input
                className={inputCls}
                value={content.hero.sub}
                onChange={(e) => update("hero", { ...content.hero, sub: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>CTAボタン テキスト</FieldLabel>
              <Input
                className={inputCls}
                value={content.hero.ctaLabel}
                onChange={(e) => update("hero", { ...content.hero, ctaLabel: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>背景画像 URL</FieldLabel>
              <Input
                className={inputCls}
                value={content.hero.bgImageUrl}
                onChange={(e) => update("hero", { ...content.hero, bgImageUrl: e.target.value })}
                placeholder="/self_reflection/hero.png"
              />
            </div>
          </div>
        )}
      </div>

      {/* ---- イベント情報 ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("eventInfo")}>
          <SectionHeading>イベント情報</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("eventInfo") ? "▲" : "▼"}</span>
        </button>
        {isOpen("eventInfo") && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>ラベル</FieldLabel>
                <Input className={inputCls} value={content.eventInfo.label} onChange={(e) => update("eventInfo", { ...content.eventInfo, label: e.target.value })} />
              </div>
              <div>
                <FieldLabel>日付</FieldLabel>
                <Input className={inputCls} value={content.eventInfo.date} onChange={(e) => update("eventInfo", { ...content.eventInfo, date: e.target.value })} placeholder="4月23日（木）" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>時間</FieldLabel>
                <Input className={inputCls} value={content.eventInfo.time} onChange={(e) => update("eventInfo", { ...content.eventInfo, time: e.target.value })} placeholder="14:00 〜 17:00" />
              </div>
              <div>
                <FieldLabel>会場名</FieldLabel>
                <Input className={inputCls} value={content.eventInfo.venue} onChange={(e) => update("eventInfo", { ...content.eventInfo, venue: e.target.value })} />
              </div>
            </div>
            <div>
              <FieldLabel>住所</FieldLabel>
              <Input className={inputCls} value={content.eventInfo.address} onChange={(e) => update("eventInfo", { ...content.eventInfo, address: e.target.value })} />
            </div>
            <div>
              <FieldLabel>タグ（1行に1つ）</FieldLabel>
              <Textarea
                className={textareaCls}
                value={content.eventInfo.tags.join("\n")}
                onChange={(e) => update("eventInfo", { ...content.eventInfo, tags: e.target.value.split("\n").filter((t) => t.trim()) })}
                rows={3}
                placeholder={"3時間の集中自己分析\n先着3名\n参加費無料"}
              />
            </div>
          </div>
        )}
      </div>

      {/* ---- 課題提起 ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("issue")}>
          <SectionHeading>課題提起セクション</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("issue") ? "▲" : "▼"}</span>
        </button>
        {isOpen("issue") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>見出し</FieldLabel>
              <Input className={inputCls} value={content.issue.heading} onChange={(e) => update("issue", { ...content.issue, heading: e.target.value })} />
            </div>
            <div>
              <FieldLabel>項目（1行に1つ）</FieldLabel>
              <Textarea
                className={textareaCls}
                value={content.issue.items.join("\n")}
                onChange={(e) => update("issue", { ...content.issue, items: e.target.value.split("\n").filter((t) => t.trim()) })}
                rows={5}
              />
            </div>
          </div>
        )}
      </div>

      {/* ---- 原因・引用 ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("cause")}>
          <SectionHeading>原因・メッセージ</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("cause") ? "▲" : "▼"}</span>
        </button>
        {isOpen("cause") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>太字リード文</FieldLabel>
              <Textarea className={textareaCls} value={content.cause.boldLead} onChange={(e) => update("cause", { ...content.cause, boldLead: e.target.value })} rows={2} />
            </div>
            <div>
              <FieldLabel>引用（HTML可: &lt;br&gt;で改行）</FieldLabel>
              <Textarea className={textareaCls} value={content.cause.quoteHtml} onChange={(e) => update("cause", { ...content.cause, quoteHtml: e.target.value })} rows={3} />
            </div>
            <div>
              <FieldLabel>本文</FieldLabel>
              <Textarea className={textareaCls} value={content.cause.body} onChange={(e) => update("cause", { ...content.cause, body: e.target.value })} rows={3} />
            </div>
            <div>
              <FieldLabel>中央コピー</FieldLabel>
              <Input className={inputCls} value={content.cause.subCenter} onChange={(e) => update("cause", { ...content.cause, subCenter: e.target.value })} />
            </div>
            <div>
              <FieldLabel>CTAボタン テキスト</FieldLabel>
              <Input className={inputCls} value={content.cause.ctaLabel} onChange={(e) => update("cause", { ...content.cause, ctaLabel: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* ---- コンセプト ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("concept")}>
          <SectionHeading>コンセプト</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("concept") ? "▲" : "▼"}</span>
        </button>
        {isOpen("concept") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>コピー（HTML可: &lt;br&gt;で改行）</FieldLabel>
              <Textarea className={textareaCls} value={content.concept.copyHtml} onChange={(e) => update("concept", { ...content.concept, copyHtml: e.target.value })} rows={3} />
            </div>
            <div>
              <FieldLabel>タグ（1行に1つ、&lt;br&gt;で改行可）</FieldLabel>
              <Textarea
                className={textareaCls}
                value={content.concept.tagsHtml.join("\n")}
                onChange={(e) => update("concept", { ...content.concept, tagsHtml: e.target.value.split("\n").filter((t) => t.trim()) })}
                rows={6}
              />
            </div>
          </div>
        )}
      </div>

      {/* ---- ステップ ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("steps")}>
          <SectionHeading>ステップ</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("steps") ? "▲" : "▼"}</span>
        </button>
        {isOpen("steps") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>見出し</FieldLabel>
              <Input className={inputCls} value={content.steps.heading} onChange={(e) => update("steps", { ...content.steps, heading: e.target.value })} />
            </div>
            {content.steps.items.map((step, i) => (
              <div key={i} className="p-4 bg-[#fffaf5] rounded-lg border border-[#ffd7c3] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#3D281E]">STEP {step.num}</span>
                  {content.steps.items.length > 1 && (
                    <button
                      type="button"
                      className={removeBtnCls}
                      onClick={() => {
                        const next = content.steps.items.filter((_, j) => j !== i);
                        update("steps", { ...content.steps, items: next });
                      }}
                    >
                      削除
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>番号</FieldLabel>
                    <Input className={inputCls} value={step.num} onChange={(e) => { const next = [...content.steps.items]; next[i] = { ...step, num: e.target.value }; update("steps", { ...content.steps, items: next }); }} />
                  </div>
                  <div>
                    <FieldLabel>所要時間</FieldLabel>
                    <Input className={inputCls} value={step.min} onChange={(e) => { const next = [...content.steps.items]; next[i] = { ...step, min: e.target.value }; update("steps", { ...content.steps, items: next }); }} placeholder="60 MIN" />
                  </div>
                </div>
                <div>
                  <FieldLabel>タイトル</FieldLabel>
                  <Input className={inputCls} value={step.title} onChange={(e) => { const next = [...content.steps.items]; next[i] = { ...step, title: e.target.value }; update("steps", { ...content.steps, items: next }); }} />
                </div>
                <div>
                  <FieldLabel>キャッチコピー</FieldLabel>
                  <Input className={inputCls} value={step.tagline} onChange={(e) => { const next = [...content.steps.items]; next[i] = { ...step, tagline: e.target.value }; update("steps", { ...content.steps, items: next }); }} />
                </div>
                <div>
                  <FieldLabel>説明文（任意）</FieldLabel>
                  <Textarea className={textareaCls} value={step.desc ?? ""} onChange={(e) => { const next = [...content.steps.items]; next[i] = { ...step, desc: e.target.value || undefined }; update("steps", { ...content.steps, items: next }); }} rows={2} />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className={addBtnCls}
              onClick={() => {
                const num = String(content.steps.items.length + 1).padStart(2, "0");
                update("steps", { ...content.steps, items: [...content.steps.items, { num, min: "", title: "", tagline: "" }] });
              }}
            >
              ステップを追加
            </Button>
            <div>
              <FieldLabel>CTAボタン テキスト</FieldLabel>
              <Input className={inputCls} value={content.steps.ctaLabel} onChange={(e) => update("steps", { ...content.steps, ctaLabel: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* ---- 体験者の声 ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("voices")}>
          <SectionHeading>体験者の声</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("voices") ? "▲" : "▼"}</span>
        </button>
        {isOpen("voices") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>見出し</FieldLabel>
              <Input className={inputCls} value={content.voices.heading} onChange={(e) => update("voices", { ...content.voices, heading: e.target.value })} />
            </div>
            <div>
              <FieldLabel>サブテキスト</FieldLabel>
              <Input className={inputCls} value={content.voices.sub} onChange={(e) => update("voices", { ...content.voices, sub: e.target.value })} />
            </div>
            {content.voices.cards.map((card, i) => (
              <div key={i} className="p-4 bg-[#fffaf5] rounded-lg border border-[#ffd7c3] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#3D281E]">声 {i + 1}</span>
                  {content.voices.cards.length > 1 && (
                    <button type="button" className={removeBtnCls} onClick={() => {
                      update("voices", { ...content.voices, cards: content.voices.cards.filter((_, j) => j !== i) });
                    }}>削除</button>
                  )}
                </div>
                <div>
                  <FieldLabel>変化</FieldLabel>
                  <Textarea className={textareaCls} value={card.change} onChange={(e) => { const next = [...content.voices.cards]; next[i] = { ...card, change: e.target.value }; update("voices", { ...content.voices, cards: next }); }} rows={2} />
                </div>
                <div>
                  <FieldLabel>引用</FieldLabel>
                  <Textarea className={textareaCls} value={card.quote} onChange={(e) => { const next = [...content.voices.cards]; next[i] = { ...card, quote: e.target.value }; update("voices", { ...content.voices, cards: next }); }} rows={2} />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className={addBtnCls} onClick={() => {
              update("voices", { ...content.voices, cards: [...content.voices.cards, { change: "", quote: "" }] });
            }}>声を追加</Button>
          </div>
        )}
      </div>

      {/* ---- 安心ポイント ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("safety")}>
          <SectionHeading>安心ポイント</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("safety") ? "▲" : "▼"}</span>
        </button>
        {isOpen("safety") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>見出し</FieldLabel>
              <Input className={inputCls} value={content.safety.heading} onChange={(e) => update("safety", { ...content.safety, heading: e.target.value })} />
            </div>
            {content.safety.items.map((item, i) => (
              <div key={i} className="p-4 bg-[#fffaf5] rounded-lg border border-[#ffd7c3] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#3D281E]">項目 {i + 1}</span>
                  {content.safety.items.length > 1 && (
                    <button type="button" className={removeBtnCls} onClick={() => {
                      update("safety", { ...content.safety, items: content.safety.items.filter((_, j) => j !== i) });
                    }}>削除</button>
                  )}
                </div>
                <div>
                  <FieldLabel>ラベル</FieldLabel>
                  <Input className={inputCls} value={item.label} onChange={(e) => { const next = [...content.safety.items]; next[i] = { ...item, label: e.target.value }; update("safety", { ...content.safety, items: next }); }} />
                </div>
                <div>
                  <FieldLabel>説明</FieldLabel>
                  <Textarea className={textareaCls} value={item.desc} onChange={(e) => { const next = [...content.safety.items]; next[i] = { ...item, desc: e.target.value }; update("safety", { ...content.safety, items: next }); }} rows={3} />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className={addBtnCls} onClick={() => {
              update("safety", { ...content.safety, items: [...content.safety.items, { label: "", desc: "" }] });
            }}>項目を追加</Button>
          </div>
        )}
      </div>

      {/* ---- アドバイザー ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("advisor")}>
          <SectionHeading>アドバイザー</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("advisor") ? "▲" : "▼"}</span>
        </button>
        {isOpen("advisor") && (
          <div className="space-y-4">
            <div className="max-w-xs">
              <ImageUploader
                label="アドバイザー写真"
                currentImage={content.advisor.photoUrl}
                onImageUpload={(url) => update("advisor", { ...content.advisor, photoUrl: url })}
              />
            </div>
            <div>
              <FieldLabel>写真 URL（直接指定する場合）</FieldLabel>
              <Input className={inputCls} value={content.advisor.photoUrl} onChange={(e) => update("advisor", { ...content.advisor, photoUrl: e.target.value })} placeholder="/self_reflection/advisor.png" />
              <p className="text-xs text-[#5C3E2A] mt-1">上の画像アップロードか、URL直接入力のどちらかで指定してください。</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>名前</FieldLabel>
                <Input className={inputCls} value={content.advisor.name} onChange={(e) => update("advisor", { ...content.advisor, name: e.target.value })} />
              </div>
              <div>
                <FieldLabel>肩書き</FieldLabel>
                <Input className={inputCls} value={content.advisor.title} onChange={(e) => update("advisor", { ...content.advisor, title: e.target.value })} />
              </div>
            </div>
            <div>
              <FieldLabel>経歴（1段落ごとに1行）</FieldLabel>
              <Textarea
                className={textareaCls + " min-h-[160px]"}
                value={content.advisor.bio.join("\n\n")}
                onChange={(e) => update("advisor", { ...content.advisor, bio: e.target.value.split("\n\n").filter((p) => p.trim()) })}
                rows={8}
              />
              <p className="text-xs text-[#5C3E2A] mt-1">段落の区切りは空行（Enterを2回）で分けてください。</p>
            </div>
            <div>
              <FieldLabel>ハイライト文</FieldLabel>
              <Textarea className={textareaCls} value={content.advisor.highlight} onChange={(e) => update("advisor", { ...content.advisor, highlight: e.target.value })} rows={3} />
            </div>
          </div>
        )}
      </div>

      {/* ---- FAQ ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("faq")}>
          <SectionHeading>よくある質問（FAQ）</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("faq") ? "▲" : "▼"}</span>
        </button>
        {isOpen("faq") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>見出し</FieldLabel>
              <Input className={inputCls} value={content.faq.heading} onChange={(e) => update("faq", { ...content.faq, heading: e.target.value })} />
            </div>
            {content.faq.items.map((item, i) => (
              <div key={i} className="p-4 bg-[#fffaf5] rounded-lg border border-[#ffd7c3] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#3D281E]">Q{i + 1}</span>
                  {content.faq.items.length > 1 && (
                    <button type="button" className={removeBtnCls} onClick={() => {
                      update("faq", { ...content.faq, items: content.faq.items.filter((_, j) => j !== i) });
                    }}>削除</button>
                  )}
                </div>
                <div>
                  <FieldLabel>質問</FieldLabel>
                  <Input className={inputCls} value={item.q} onChange={(e) => { const next = [...content.faq.items]; next[i] = { ...item, q: e.target.value }; update("faq", { ...content.faq, items: next }); }} />
                </div>
                <div>
                  <FieldLabel>回答</FieldLabel>
                  <Textarea className={textareaCls} value={item.a} onChange={(e) => { const next = [...content.faq.items]; next[i] = { ...item, a: e.target.value }; update("faq", { ...content.faq, items: next }); }} rows={3} />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className={addBtnCls} onClick={() => {
              update("faq", { ...content.faq, items: [...content.faq.items, { q: "", a: "" }] });
            }}>質問を追加</Button>
          </div>
        )}
      </div>

      {/* ---- 最終CTA ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("closingCta")}>
          <SectionHeading>最終CTA</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("closingCta") ? "▲" : "▼"}</span>
        </button>
        {isOpen("closingCta") && (
          <div className="space-y-4">
            <div>
              <FieldLabel>見出し</FieldLabel>
              <Input className={inputCls} value={content.closingCta.heading} onChange={(e) => update("closingCta", { ...content.closingCta, heading: e.target.value })} />
            </div>
            <div>
              <FieldLabel>サブテキスト</FieldLabel>
              <Input className={inputCls} value={content.closingCta.sub} onChange={(e) => update("closingCta", { ...content.closingCta, sub: e.target.value })} />
            </div>
            <div>
              <FieldLabel>日付情報</FieldLabel>
              <Input className={inputCls} value={content.closingCta.infoDate} onChange={(e) => update("closingCta", { ...content.closingCta, infoDate: e.target.value })} placeholder="4月23日（木）14:00〜17:00" />
            </div>
            <div>
              <FieldLabel>会場情報（HTML可）</FieldLabel>
              <Input className={inputCls} value={content.closingCta.infoVenueHtml} onChange={(e) => update("closingCta", { ...content.closingCta, infoVenueHtml: e.target.value })} />
            </div>
            <div>
              <FieldLabel>CTAボタン テキスト</FieldLabel>
              <Input className={inputCls} value={content.closingCta.ctaLabel} onChange={(e) => update("closingCta", { ...content.closingCta, ctaLabel: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* ---- フッター ---- */}
      <div className={sectionCls}>
        <button type="button" className="w-full flex justify-between items-center" onClick={() => toggle("footer")}>
          <SectionHeading>フッター</SectionHeading>
          <span className="text-[#d4844b]">{isOpen("footer") ? "▲" : "▼"}</span>
        </button>
        {isOpen("footer") && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>ブランド名</FieldLabel>
                <Input className={inputCls} value={content.footer.brand} onChange={(e) => update("footer", { ...content.footer, brand: e.target.value })} />
              </div>
              <div>
                <FieldLabel>ブランドサブ</FieldLabel>
                <Input className={inputCls} value={content.footer.brandSub} onChange={(e) => update("footer", { ...content.footer, brandSub: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>会社名</FieldLabel>
                <Input className={inputCls} value={content.footer.company} onChange={(e) => update("footer", { ...content.footer, company: e.target.value })} />
              </div>
              <div>
                <FieldLabel>コピーライト</FieldLabel>
                <Input className={inputCls} value={content.footer.copyright} onChange={(e) => update("footer", { ...content.footer, copyright: e.target.value })} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
