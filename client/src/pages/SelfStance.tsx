import { useEffect, useState } from "react";
import { fetchContentBySlug } from "@/lib/content-loader";
import { useCmPreviewPage } from "@/hooks/useCmPreviewPage";
import { trackMetaPixelLead } from "@/lib/meta-pixel";
import type { ContentPayload } from "@/types/content-payload";
import {
  DEFAULT_SELF_STANCE_CONTENT,
  SELF_STANCE_ASSETS,
  mergeSelfStanceContent,
  type SelfStanceContent,
} from "@/types/self-stance";
import { EventInfoIcon } from "@/components/EventInfoIcon";
import { CmId, CmHtml, FieldStylesProvider } from "@/components/contents-manager/CmId";
import "./self-stance.css";

const STORAGE_KEY = "self_stance_content_v1";
const FAVICON_HREF = SELF_STANCE_ASSETS.favicon;
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap";

function safeParseStored(): SelfStanceContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return mergeSelfStanceContent(parsed);
    return null;
  } catch {
    return null;
  }
}

function safeStore(next: SelfStanceContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* QuotaExceededError 等 */
  }
}

function LineIcon({ className }: { className?: string }) {
  return (
    <img
      src={SELF_STANCE_ASSETS.lineIcon}
      alt=""
      className={className ? `line-icon ${className}` : "line-icon"}
      aria-hidden
    />
  );
}

function CtaButton({
  href,
  label,
  labelCmId,
  className = "btn-line",
  showLineIcon = true,
}: {
  href: string;
  label: string;
  labelCmId?: string;
  className?: string;
  showLineIcon?: boolean;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackMetaPixelLead}
    >
      {showLineIcon && <LineIcon />}
      {labelCmId ? <CmId id={labelCmId}>{label}</CmId> : label}
    </a>
  );
}

export default function SelfStance() {
  const [content, setContent] = useState<SelfStanceContent>(() => {
    if (typeof window === "undefined") return DEFAULT_SELF_STANCE_CONTENT;
    return safeParseStored() ?? DEFAULT_SELF_STANCE_CONTENT;
  });

  const isCmPreview = useCmPreviewPage({
    slug: "self-stance",
    onDraft: (payload) => {
      const remote = (payload as ContentPayload | null)?.selfStance;
      if (remote) {
        const merged = mergeSelfStanceContent(remote);
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
      const payload = await fetchContentBySlug("self-stance");
      const remote = (payload as ContentPayload | null)?.selfStance;
      if (cancelled) return;
      if (remote) {
        const merged = mergeSelfStanceContent(remote);
        setContent(merged);
        safeStore(merged);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isCmPreview]);

  const c = content;

  return (
    <FieldStylesProvider value={c.fieldStyles}>
    <div id="self-stance-page">
      <div className="sticky">
        <a
          href={c.stickyCta.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackMetaPixelLead}
        >
          <LineIcon />
          <CmId id="ss-sticky-cta-label">{c.stickyCta.label}</CmId>
        </a>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <img
            src={c.header.logoUrl}
            alt={c.header.logoAlt}
            className="logo-img"
            data-cm-id="ss-header-logo"
          />
          <CmId id="ss-header-logo-alt" className="sr-only">
            {c.header.logoAlt}
          </CmId>
          <a
            href={c.header.ctaHref}
            className="header-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMetaPixelLead}
          >
            <CmId id="ss-header-cta-label" as="span">
              {c.header.ctaLabel}
            </CmId>
            <LineIcon />
          </a>
        </div>
      </header>
      <div className="deco-line" />

      <div className="fv">
        <CmId id="ss-hero-eyebrow" className="fv-eyebrow">
          {c.hero.eyebrow}
        </CmId>
        <div className="fv-img-wrap">
          <img
            src={c.hero.heroImageUrl}
            alt={c.hero.heroImageAlt}
            data-cm-id="ss-hero-image"
          />
          <CmId id="ss-hero-image-alt" className="sr-only">
            {c.hero.heroImageAlt}
          </CmId>
        </div>
        <div className="fv-img-cta">
          <div className="inner">
            <CtaButton
              href={c.hero.primaryCtaHref}
              label={c.hero.primaryCtaLabel}
              labelCmId="ss-hero-primary-cta-label"
            />
          </div>
        </div>
        <div className="fv-body-wrap">
          <div className="inner">
            <CmHtml id="ss-hero-body" className="fv-body" html={c.hero.bodyHtml} />
          </div>
        </div>
      </div>

      <div className="info-bar">
        <CmId id="ss-event-info-label" as="p" className="info-bar-label">
          {c.eventInfo.label}
        </CmId>
        <div className="info-grid">
          {c.eventInfo.rows.map((row, i) => (
            <div key={i} className="info-row">
              <div className="info-icon">
                <EventInfoIcon label={row.label} />
              </div>
              <div className="info-text">
                <CmId id={`ss-event-info-row-${i}-label`} as="span" className="ilabel">
                  {row.label}
                </CmId>
                <CmId id={`ss-event-info-row-${i}-value`} as="span" className="ivalue">
                  {row.value}
                </CmId>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="empathy">
        <div className="inner">
          <CmId id="ss-problem-label" as="span" className="sec-label">
            {c.empathy.label}
          </CmId>
          <CmId id="ss-problem-title" as="p" className="emp-title">
            {c.empathy.title}
          </CmId>
          <ul className="emp-list">
            {c.empathy.items.map((item, i) => (
              <li key={i}>
                <CmId id={`ss-problem-item-${i}`}>{item}</CmId>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="solution">
        <div className="inner">
          <CmId id="ss-solution-label" as="span" className="sec-label">
            {c.solution.label}
          </CmId>
          <h2 className="h2-light">
            <CmHtml id="ss-solution-title" html={c.solution.titleHtml} as="span" />
          </h2>
          <CmId id="ss-solution-subtitle" as="p" className="sol-subtitle">
            {c.solution.subtitle}
          </CmId>
          <div className="sol-body">
            <CmId id="ss-solution-body" as="p">
              {c.solution.body}
            </CmId>
          </div>
          <CmId id="ss-solution-benefits-heading" as="p" className="benefit-head">
            {c.solution.benefitsHeading}
          </CmId>
          <ul className="benefit-list">
            {c.solution.benefits.map((b, i) => (
              <li key={i}>
                <CmId id={`ss-solution-benefit-${i}`}>{b}</CmId>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="cta-sol inner">
        <CtaButton
          href={c.solution.ctaHref}
          label={c.solution.ctaLabel}
          labelCmId="ss-solution-cta-label"
        />
      </div>

      <section className="flow">
        <div className="inner">
          <CmId id="ss-program-label" as="span" className="sec-label">
            {c.program.label}
          </CmId>
          <h2 className="h2">
            <CmHtml id="ss-program-title" html={c.program.titleHtml} as="span" />
          </h2>
          <div className="flow-steps">
            {c.program.steps.map((step, i) => (
              <div key={i} className="flow-step">
                <div className="flow-step-left">
                  <CmId id={`ss-program-step-${i}-num`} as="span" className="flow-step-num">
                    {step.num}
                  </CmId>
                  <span className="flow-step-name">
                    <CmHtml
                      id={`ss-program-step-${i}-nameHtml`}
                      html={step.nameHtml}
                      as="span"
                    />
                  </span>
                </div>
                <CmId id={`ss-program-step-${i}-description`} className="flow-step-right">
                  {step.description}
                </CmId>
              </div>
            ))}
          </div>
          <div className="flow-points">
            <CmId id="ss-program-points-heading" as="p">
              {c.program.pointsHeading}
            </CmId>
            <ul>
              {c.program.points.map((p, i) => (
                <li key={i}>
                  <CmId id={`ss-program-point-${i}`}>{p}</CmId>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="faci">
        <div className="inner">
          <CmId id="ss-facilitator-label" as="span" className="sec-label">
            {c.facilitator.label}
          </CmId>
          <CmId id="ss-facilitator-title" as="h2" className="h2">
            {c.facilitator.title}
          </CmId>
          <div className="faci-card">
            <div className="faci-photo">
              <img
                src={c.facilitator.imageUrl}
                alt={c.facilitator.name}
                data-cm-id="ss-facilitator-image"
              />
            </div>
            <div>
              <CmId id="ss-facilitator-name" className="faci-name">
                {c.facilitator.name}
              </CmId>
              <CmId id="ss-facilitator-role" className="faci-role">
                {c.facilitator.role}
              </CmId>
              <ul className="faci-list">
                {c.facilitator.bio.map((line, i) => (
                  <li key={i}>
                    <CmId id={`ss-facilitator-bio-${i}`}>{line}</CmId>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <CmId id="ss-facilitator-quote" className="faci-quote">
            {c.facilitator.quote}
          </CmId>
        </div>
      </section>

      <section className="voices">
        <div className="inner">
          <CmId id="ss-voices-label" as="span" className="sec-label">
            {c.voices.label}
          </CmId>
          <CmId id="ss-voices-title" as="h2" className="h2-light">
            {c.voices.title}
          </CmId>
          <div className="voice-grid">
            {c.voices.items.map((v, i) => (
              <div key={i} className="voice-card">
                <CmId id={`ss-voices-item-${i}-who`} className="voice-who">
                  {v.who}
                </CmId>
                <CmId id={`ss-voices-item-${i}-text`} className="voice-text">
                  {v.text}
                </CmId>
              </div>
            ))}
          </div>
          {c.voices.note ? <p className="voice-note">{c.voices.note}</p> : null}
        </div>
      </section>

      <section className="detail">
        <div className="inner">
          <CmId id="ss-detail-label" as="span" className="sec-label">
            {c.detail.label}
          </CmId>
          <CmId id="ss-detail-title" as="h2" className="h2">
            {c.detail.title}
          </CmId>
          <table className="detail-table">
            <tbody>
              {c.detail.scheduleRows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <CmId id={`ss-detail-row-${i}-label`}>{row.label}</CmId>
                  </td>
                  <td>
                    <CmId id={`ss-detail-row-${i}-value`}>{row.value}</CmId>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {c.detail.mapEmbedUrl ? (
            <div className="map-wrap">
              <iframe
                src={c.detail.mapEmbedUrl}
                title="会場マップ"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : null}
          <CtaButton
            href={c.detail.ctaHref}
            label={c.detail.ctaLabel}
            labelCmId="ss-detail-cta-label"
          />
        </div>
      </section>

      <section className="target">
        <div className="inner">
          <CmId id="ss-target-label" as="span" className="sec-label">
            {c.target.label}
          </CmId>
          <CmId id="ss-target-title" as="h2" className="h2">
            {c.target.title}
          </CmId>
          <ul className="target-list">
            {c.target.items.map((item, i) => (
              <li key={i}>
                <CmId id={`ss-target-item-${i}`}>{item}</CmId>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faq">
        <div className="inner">
          <CmId id="ss-faq-label" as="span" className="sec-label">
            {c.faq.label}
          </CmId>
          <CmId id="ss-faq-title" as="h2" className="h2">
            {c.faq.title}
          </CmId>
          <div className="faq-list">
            {c.faq.items.map((item, i) => (
              <div key={i} className="faq-item">
                <CmId id={`ss-faq-item-${i}-q`} className="faq-q">
                  {item.q}
                </CmId>
                <CmId id={`ss-faq-item-${i}-a`} className="faq-a">
                  {item.a}
                </CmId>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <h2>
          <CmHtml id="ss-final-cta-title" html={c.finalCta.titleHtml} as="span" />
        </h2>
        <div className="final-body">
          {c.finalCta.paragraphs.map((p, i) => (
            <CmId key={i} id={`ss-final-cta-paragraph-${i}`} as="p">
              {p}
            </CmId>
          ))}
        </div>
        <CtaButton
          href={c.finalCta.ctaHref}
          label={c.finalCta.ctaLabel}
          labelCmId="ss-final-cta-label"
          showLineIcon={false}
        />
        <CmId id="ss-final-cta-note" as="p" className="cta-note">
          {c.finalCta.note}
        </CmId>
      </section>

      <footer className="page-footer">
        {c.footer.lines.map((line, i) => (
          <CmId key={i} id={`ss-footer-line-${i}`}>
            {line}
          </CmId>
        ))}
        <CmId id="ss-footer-copyright">{c.footer.copyright}</CmId>
      </footer>
    </div>
    </FieldStylesProvider>
  );
}
