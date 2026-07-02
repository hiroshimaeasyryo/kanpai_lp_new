import { useEffect, useState } from "react";
import { resolveCtaUrl } from "@/lib/content-manager/shared-lp-cta";
import { fetchContentBySlug } from "@/lib/content-loader";
import { useCmPreviewPage } from "@/hooks/useCmPreviewPage";
import { trackMetaPixelLead } from "@/lib/meta-pixel";
import type { ContentPayload } from "@/types/content-payload";
import {
  DEFAULT_JSA_CONTENT,
  JSA_ASSETS,
  mergeJsSelfAnalysisContent,
  type JsSelfAnalysisContent,
} from "@/types/js-self-analysis";
import { CmArrayItem, CmId, CmHtml, FieldStylesProvider } from "@/components/contents-manager/CmId";
import "./js-self-analysis.css";

const STORAGE_KEY = "js_self_analysis_content_v1";
const FAVICON_HREF = JSA_ASSETS.favicon;
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap";

function safeParseStored(): JsSelfAnalysisContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return mergeJsSelfAnalysisContent(parsed);
    return null;
  } catch {
    return null;
  }
}

function safeStore(next: JsSelfAnalysisContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* QuotaExceededError 等 */
  }
}

function LineIcon() {
  return <img src={JSA_ASSETS.lineIcon} alt="" className="line-icon-img" aria-hidden />;
}

function CtaButton({
  href,
  label,
  labelCmId,
  className = "btn-line",
}: {
  href: string;
  label: string;
  labelCmId: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackMetaPixelLead}
    >
      <LineIcon />
      <CmId id={labelCmId} as="span">
        {label}
      </CmId>
    </a>
  );
}

const HERO_ICONS = [
  // 日時: カレンダー
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="16" height="13" rx="2" stroke="var(--brown-pale)" strokeWidth="1.5" />
    <path d="M1 7h16" stroke="var(--brown-pale)" strokeWidth="1.5" />
    <path d="M5 1v4M13 1v4" stroke="var(--brown-pale)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // 会場: ピン
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 1C6.239 1 4 3.239 4 6c0 3.75 5 11 5 11s5-7.25 5-11c0-2.761-2.239-5-5-5z"
      stroke="var(--brown-pale)"
      strokeWidth="1.5"
    />
    <circle cx="9" cy="6" r="1.5" stroke="var(--brown-pale)" strokeWidth="1.5" />
  </svg>,
  // 定員: 円＋プラス
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8" stroke="var(--brown-pale)" strokeWidth="1.5" />
    <path d="M6 9h6M9 6v6" stroke="var(--brown-pale)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // 参加費: チケット
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="5" width="16" height="10" rx="2" stroke="var(--brown-pale)" strokeWidth="1.5" />
    <path d="M1 8h16" stroke="var(--brown-pale)" strokeWidth="1.5" />
    <circle cx="5" cy="11.5" r="1" fill="rgba(245,245,240,0.5)" />
  </svg>,
];

export default function JsSelfAnalysis() {
  const [content, setContent] = useState<JsSelfAnalysisContent>(() => {
    if (typeof window === "undefined") return DEFAULT_JSA_CONTENT;
    return safeParseStored() ?? DEFAULT_JSA_CONTENT;
  });

  const isCmPreview = useCmPreviewPage({
    slug: "js_self_analysis",
    onDraft: (payload) => {
      const remote = (payload as ContentPayload | null)?.jsSelfAnalysis;
      if (remote) {
        const merged = mergeJsSelfAnalysisContent(remote);
        setContent(merged);
        safeStore(merged);
      }
    },
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDescContent = prevDesc?.getAttribute("content") ?? null;

    document.title = content.seo.title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content.seo.description);

    const iconEl =
      (document.querySelector("link[rel~='icon']") as HTMLLinkElement | null) ??
      (document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement | null);

    if (!iconEl) {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = FAVICON_HREF;
      document.head.appendChild(link);
      return () => {
        document.title = prevTitle;
        if (prevDescContent !== null && meta) meta.setAttribute("content", prevDescContent);
        link.remove();
      };
    }

    const prevHref = iconEl.href;
    const prevType = iconEl.type;
    iconEl.href = FAVICON_HREF;
    iconEl.type = "image/png";

    return () => {
      document.title = prevTitle;
      if (prevDescContent !== null && meta) meta.setAttribute("content", prevDescContent);
      iconEl.href = prevHref;
      iconEl.type = prevType;
    };
  }, [content.seo.description, content.seo.title]);

  useEffect(() => {
    if (isCmPreview) return;
    let cancelled = false;
    (async () => {
      const payload = await fetchContentBySlug("js_self_analysis");
      const remote = (payload as ContentPayload | null)?.jsSelfAnalysis;
      if (cancelled) return;
      if (remote) {
        const merged = mergeJsSelfAnalysisContent(remote);
        setContent(merged);
        safeStore(merged);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isCmPreview]);

  const c = content;
  const ctaUrl = resolveCtaUrl(c);

  return (
    <FieldStylesProvider value={c.fieldStyles}>
      <div id="js-self-analysis-page">
        <div className="floating-cta">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMetaPixelLead}
          >
            <LineIcon />
            <CmId id="jsa-floating-cta-label" as="span">
              {c.floatingCta.label}
            </CmId>
          </a>
        </div>

        <header>
          <img
            src={c.header.logoUrl}
            alt={c.header.logoAlt}
            data-cm-id="jsa-header-logo"
            style={{ height: 32, width: "auto", display: "block" }}
          />
          <CmId id="jsa-header-logo-alt" className="sr-only">
            {c.header.logoAlt}
          </CmId>
        </header>

        <section className="hero-shell">
          <div className="hero-img-wrap">
            <img src={c.hero.imageUrl} alt={c.hero.imageAlt} data-cm-id="jsa-hero-image" />
            <CmId id="jsa-hero-image-alt" className="sr-only">
              {c.hero.imageAlt}
            </CmId>
          </div>
          <div className="hero-body">
            <div className="hero-inner">
              <div className="hero-info-card">
                {c.hero.infoRows.map((row, i) => (
                  <CmArrayItem key={i} id={`jsa-hero-info-row-${i}`} className="hero-info-row">
                    {HERO_ICONS[i] ?? HERO_ICONS[0]}
                    <div>
                      <CmId id={`jsa-hero-info-row-${i}-label`} className="hero-info-label">
                        {row.label}
                      </CmId>
                      <CmId id={`jsa-hero-info-row-${i}-value`} className="hero-info-value">
                        {row.value}
                      </CmId>
                    </div>
                  </CmArrayItem>
                ))}
              </div>
              <div className="hero-cta-wrap">
                <CtaButton
                  href={ctaUrl}
                  label={c.hero.ctaLabel}
                  labelCmId="jsa-hero-cta-label"
                  className="hero-cta"
                />
                <CmId id="jsa-hero-micro" as="p" className="hero-micro">
                  {c.hero.micro}
                </CmId>
              </div>
            </div>
          </div>
        </section>

        <section className="empathy">
          <div className="container">
            <CmId id="jsa-empathy-label" className="section-label">
              {c.empathy.label}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="jsa-empathy-title" html={c.empathy.titleHtml} as="span" />
            </h2>
            <ul className="pain-list">
              {c.empathy.items.map((item, i) => (
                <CmArrayItem key={i} id={`jsa-empathy-item-${i}`} className="pain-item">
                  <div className="pain-dot" />
                  <CmId id={`jsa-empathy-item-${i}`} as="p" className="pain-text">
                    {item}
                  </CmId>
                </CmArrayItem>
              ))}
            </ul>
            <CmHtml id="jsa-empathy-close" className="empathy-close" html={c.empathy.closeHtml} as="p" />
            <div className="empathy-cta-wrap">
              <CtaButton
                href={ctaUrl}
                label={c.empathy.ctaLabel}
                labelCmId="jsa-empathy-cta-label"
              />
            </div>
          </div>
        </section>

        <section className="problem">
          <div className="container">
            <CmId id="jsa-problem-label" className="section-label">
              {c.problem.label}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="jsa-problem-title" html={c.problem.titleHtml} as="span" />
            </h2>
            <CmHtml id="jsa-problem-body" className="problem-body" html={c.problem.bodyHtml} as="p" />
            <CmHtml id="jsa-problem-close" className="problem-close" html={c.problem.closeHtml} as="p" />
          </div>
        </section>

        <section className="solution">
          <div className="container">
            <CmId id="jsa-solution-label" className="section-label">
              {c.solution.label}
            </CmId>
            <CmId id="jsa-solution-title" as="h2" className="section-title">
              {c.solution.title}
            </CmId>
            <CmHtml id="jsa-solution-body" className="solution-body" html={c.solution.bodyHtml} as="p" />
            <CmId id="jsa-solution-outcome-title" as="p" className="outcome-title">
              {c.solution.outcomeTitle}
            </CmId>
            <ul className="outcome-list">
              {c.solution.outcomes.map((o, i) => (
                <CmArrayItem key={i} id={`jsa-solution-outcome-${i}`} className="outcome-item">
                  <div className="outcome-check" />
                  <CmId id={`jsa-solution-outcome-${i}`} as="span" className="outcome-text">
                    {o}
                  </CmId>
                </CmArrayItem>
              ))}
            </ul>
          </div>
        </section>

        <section className="schedule">
          <div className="container">
            <CmId id="jsa-schedule-label" className="section-label">
              {c.schedule.label}
            </CmId>
            <CmId id="jsa-schedule-title" as="h2" className="section-title">
              {c.schedule.title}
            </CmId>
            <div className="timeline">
              {c.schedule.steps.map((step, i) => (
                <CmArrayItem key={i} id={`jsa-schedule-step-${i}`} className="timeline-item">
                  <div className="timeline-dot" />
                  <CmId id={`jsa-schedule-step-${i}-label`} className="timeline-label">
                    {step.label}
                  </CmId>
                  <CmId id={`jsa-schedule-step-${i}-title`} className="timeline-title">
                    {step.title}
                  </CmId>
                  <CmId id={`jsa-schedule-step-${i}-desc`} className="timeline-desc">
                    {step.desc}
                  </CmId>
                </CmArrayItem>
              ))}
            </div>
            <div className="schedule-notes">
              {c.schedule.notes.map((note, i) => (
                <CmArrayItem key={i} id={`jsa-schedule-note-${i}`} className="schedule-note">
                  <div className="note-icon" />
                  <CmId id={`jsa-schedule-note-${i}`} as="span">
                    {note}
                  </CmId>
                </CmArrayItem>
              ))}
            </div>
            <div className="schedule-cta-wrap">
              <CtaButton
                href={ctaUrl}
                label={c.schedule.ctaLabel}
                labelCmId="jsa-schedule-cta-label"
              />
              <CmId id="jsa-schedule-micro" as="p" className="schedule-micro">
                {c.schedule.micro}
              </CmId>
            </div>
          </div>
        </section>

        <section className="facilitator">
          <div className="container">
            <CmId id="jsa-facilitator-label" className="section-label">
              {c.facilitator.label}
            </CmId>
            <CmId id="jsa-facilitator-title" as="h2" className="section-title">
              {c.facilitator.title}
            </CmId>
            <div className="faci-card">
              <img
                className="faci-photo"
                src={c.facilitator.imageUrl}
                alt={c.facilitator.name}
                data-cm-id="jsa-facilitator-image"
              />
              <div>
                <CmId id="jsa-facilitator-name" className="faci-name">
                  {c.facilitator.name}
                </CmId>
                <CmId id="jsa-facilitator-role" className="faci-role">
                  {c.facilitator.role}
                </CmId>
                <CmId id="jsa-facilitator-tag" as="span" className="faci-tag">
                  {c.facilitator.tag}
                </CmId>
              </div>
            </div>
            <ul className="faci-bio">
              {c.facilitator.bio.map((line, i) => (
                <li key={i}>
                  <CmArrayItem id={`jsa-facilitator-bio-${i}`} style={{ display: "contents" }}>
                    <span className="bio-dot" />
                    <CmId id={`jsa-facilitator-bio-${i}`} as="span">
                      {line}
                    </CmId>
                  </CmArrayItem>
                </li>
              ))}
            </ul>
            <CmId id="jsa-facilitator-quote" as="div" className="faci-quote">
              {c.facilitator.quote}
            </CmId>
          </div>
        </section>

        <section className="voices">
          <div className="container">
            <CmId id="jsa-voices-label" className="section-label">
              {c.voices.label}
            </CmId>
            <CmId id="jsa-voices-title" as="h2" className="section-title">
              {c.voices.title}
            </CmId>
            <div className="voice-list">
              {c.voices.items.map((v, i) => (
                <CmArrayItem key={i} id={`jsa-voices-item-${i}`} className="voice-card">
                  <div className="voice-head">
                    <div className="voice-mark">&ldquo;</div>
                    <CmId id={`jsa-voices-item-${i}-who`} as="span" className="voice-who">
                      {v.who}
                    </CmId>
                  </div>
                  <CmId id={`jsa-voices-item-${i}-text`} as="p" className="voice-text">
                    {v.text}
                  </CmId>
                </CmArrayItem>
              ))}
            </div>
          </div>
        </section>

        <section className="event-info">
          <div className="container">
            <CmId id="jsa-event-info-label" className="section-label">
              {c.eventInfo.label}
            </CmId>
            <CmId id="jsa-event-info-title" as="h2" className="section-title">
              {c.eventInfo.title}
            </CmId>
            <table className="info-table">
              <tbody>
                {c.eventInfo.rows.map((row, i) => (
                  <tr key={i}>
                    <CmArrayItem id={`jsa-event-info-row-${i}`} style={{ display: "contents" }}>
                      <td>
                        <CmId id={`jsa-event-info-row-${i}-label`} as="span">
                          {row.label}
                        </CmId>
                      </td>
                      <td>
                        <CmId id={`jsa-event-info-row-${i}-value`} as="span">
                          {row.value}
                        </CmId>
                      </td>
                    </CmArrayItem>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="info-cta-wrap">
              <CtaButton
                href={ctaUrl}
                label={c.eventInfo.ctaLabel}
                labelCmId="jsa-event-info-cta-label"
                className="btn-line-lg"
              />
            </div>
          </div>
        </section>

        <section className="for-who">
          <div className="container">
            <CmId id="jsa-forwho-label" className="section-label">
              {c.forWho.label}
            </CmId>
            <CmId id="jsa-forwho-title" as="h2" className="section-title">
              {c.forWho.title}
            </CmId>
            <div className="who-list">
              {c.forWho.items.map((item, i) => (
                <CmArrayItem key={i} id={`jsa-forwho-item-${i}`} className="who-item">
                  <div className="who-num">{i + 1}</div>
                  <CmId id={`jsa-forwho-item-${i}`} as="span" className="who-text">
                    {item}
                  </CmId>
                </CmArrayItem>
              ))}
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <CmId id="jsa-faq-label" className="section-label">
              {c.faq.label}
            </CmId>
            <CmId id="jsa-faq-title" as="h2" className="section-title">
              {c.faq.title}
            </CmId>
            <div className="faq-list">
              {c.faq.items.map((item, i) => (
                <CmArrayItem key={i} id={`jsa-faq-item-${i}`} className="faq-item">
                  <div className="faq-q">
                    <span className="faq-q-icon">Q</span>
                    <CmId id={`jsa-faq-item-${i}-q`} as="span">
                      {item.q}
                    </CmId>
                  </div>
                  <CmId id={`jsa-faq-item-${i}-a`} className="faq-a">
                    {item.a}
                  </CmId>
                </CmArrayItem>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container">
            <CmId id="jsa-final-cta-eyebrow" className="section-label">
              {c.finalCta.label}
            </CmId>
            <CmId id="jsa-final-cta-title" as="h2" className="final-title">
              {c.finalCta.title}
            </CmId>
            <CmHtml id="jsa-final-cta-body" className="final-body" html={c.finalCta.bodyHtml} as="p" />
            <div>
              <CtaButton
                href={ctaUrl}
                label={c.finalCta.ctaLabel}
                labelCmId="jsa-final-cta-cta-label"
                className="btn-line-final"
              />
              <CmId id="jsa-final-cta-note" as="p" className="final-note">
                {c.finalCta.note}
              </CmId>
            </div>
          </div>
        </section>

        <footer>
          <CmId id="jsa-footer-copyright" as="p">
            {c.footer.copyright}
          </CmId>
        </footer>
      </div>
    </FieldStylesProvider>
  );
}
