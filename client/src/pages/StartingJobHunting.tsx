import { useEffect, useState, type ElementType } from "react";
import { fetchContentBySlug } from "@/lib/content-loader";
import { useCmPreviewPage } from "@/hooks/useCmPreviewPage";
import { trackMetaPixelLead } from "@/lib/meta-pixel";
import { mergeLpFieldStylesFromRaw } from "@/types/home-copy-style";
import type { ContentPayload } from "@/types/content-payload";
import {
  DEFAULT_STARTING_JOB_HUNTING_CONTENT,
  STARTING_JOB_HUNTING_ASSETS,
  mergeStartingJobHuntingContent,
  type StartingJobHuntingContent,
} from "@/types/starting-job-hunting";
import { EventInfoIcon } from "@/components/EventInfoIcon";
import { CmArrayItem, CmId, CmHtml, FieldStylesProvider } from "@/components/contents-manager/CmId";
import "./starting-job-hunting.css";

const STORAGE_KEY = "starting_job_hunting_content_v1";
const FAVICON_HREF = STARTING_JOB_HUNTING_ASSETS.favicon;
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@400;600;700&family=Shippori+Mincho:wght@400;700&display=swap";

function safeParseStored(): StartingJobHuntingContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return mergeStartingJobHuntingContent(parsed);
    return null;
  } catch {
    return null;
  }
}

function safeStore(next: StartingJobHuntingContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* QuotaExceededError 等 */
  }
}

/** sjh-lp-fields に未登録の HTML 用（編集対象外） */
function Html({ html, as, className }: { html: string; as?: ElementType; className?: string }) {
  const Tag = as ?? "div";
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function LineIcon({ className }: { className?: string }) {
  return (
    <img
      src={STARTING_JOB_HUNTING_ASSETS.lineIcon}
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
  className,
  dark,
}: {
  href: string;
  label: string;
  labelCmId?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      className={className ?? "cta-btn"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackMetaPixelLead}
    >
      {!dark && <LineIcon />}
      {labelCmId ? <CmId id={labelCmId}>{label}</CmId> : label}
    </a>
  );
}

export default function StartingJobHunting() {
  const [content, setContent] = useState<StartingJobHuntingContent>(() => {
    if (typeof window === "undefined") return DEFAULT_STARTING_JOB_HUNTING_CONTENT;
    return safeParseStored() ?? DEFAULT_STARTING_JOB_HUNTING_CONTENT;
  });

  const isCmPreview = useCmPreviewPage({
    slug: "starting_job_hunting",
    onDraft: (payload) => {
      const remote = (payload as ContentPayload | null)?.startingJobHunting;
      if (!remote) return;
      const merged = mergeStartingJobHuntingContent(remote);
      if (remote.fieldStyles) {
        merged.fieldStyles = mergeLpFieldStylesFromRaw(remote.fieldStyles, merged.fieldStyles);
      }
      setContent(merged);
      safeStore(merged);
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
      const payload = await fetchContentBySlug("starting_job_hunting");
      const remote = (payload as ContentPayload | null)?.startingJobHunting;
      if (cancelled) return;
      if (remote) {
        const merged = mergeStartingJobHuntingContent(remote);
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
    <FieldStylesProvider value={c.fieldStyles} scopeSelector="#starting-job-hunting-page">
    <div id="starting-job-hunting-page">
      <header>
        <img
          src={c.header.logoUrl}
          alt={c.header.logoAlt}
          className="logo"
          data-cm-id="sjh-header-logo"
        />
        <a
          href={c.header.ctaHref}
          className="header-cta"
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackMetaPixelLead}
        >
          <LineIcon className="line-icon--header" />
          <CmId id="sjh-header-cta-label" className="header-cta-label header-cta-label--desktop">
            {c.header.ctaLabel}
          </CmId>
          <CmId id="sjh-header-cta-label-mobile" className="header-cta-label header-cta-label--mobile">
            {c.header.ctaLabelMobile?.trim() || c.header.ctaLabel}
          </CmId>
        </a>
      </header>

      <div>
        <CmId id="sjh-hero-kicker" className="fv-kicker">
          {c.hero.kicker}
        </CmId>
        <div className="fv-image-wrap">
          <img src={c.hero.heroImageUrl} alt={c.hero.heroImageAlt} data-cm-id="sjh-hero-image" />
        </div>
        <div className="fv-cta-bar">
          <CtaButton
            href={c.hero.primaryCtaHref}
            label={c.hero.primaryCtaLabel}
            labelCmId="sjh-hero-primary-cta-label"
          />
        </div>
        <div className="fv-body">
          <CmHtml id="sjh-hero-body" html={c.hero.bodyHtml} />
        </div>
      </div>

      <div className="event-info-section">
        <div className="event-info-inner">
          <CmId id="sjh-event-info-label" className="event-info-label">
            {c.eventInfo.label}
          </CmId>
          <div className="event-info-rows">
            {c.eventInfo.rows.map((row, i) => (
              <CmArrayItem key={i} id={`sjh-event-info-row-${i}`} className="event-info-row">
                <div className="event-info-icon">
                  <EventInfoIcon label={row.label} />
                </div>
                <div className="event-info-content">
                  <CmId id={`sjh-event-info-row-${i}-label`} className="ei-label">
                    {row.label}
                  </CmId>
                  <CmId id={`sjh-event-info-row-${i}-value`} className="ei-value">
                    {row.value}
                  </CmId>
                  {row.sub ? (
                    <CmId id={`sjh-event-info-row-${i}-sub`} className="ei-sub">
                      {row.sub}
                    </CmId>
                  ) : null}
                </div>
              </CmArrayItem>
            ))}
          </div>
        </div>
      </div>

      <section>
        <CmId id="sjh-problem-script" className="section-label">
          {c.problem.script}
        </CmId>
        <h2>
          <CmHtml id="sjh-problem-title" html={c.problem.titleHtml} as="span" />
        </h2>
        <ul className="problem-list">
          {c.problem.items.map((item, i) => (
            <li key={i}>
              <CmArrayItem id={`sjh-problem-item-${i}`}>
                <CmId id={`sjh-problem-item-${i}`}>{item}</CmId>
              </CmArrayItem>
            </li>
          ))}
        </ul>
        {c.problem.reassurance ? (
          <CmId id="sjh-problem-reassurance" className="reassurance">
            {c.problem.reassurance}
          </CmId>
        ) : null}
      </section>

      <section>
        <CmId id="sjh-insight-script" className="section-label">
          {c.insight.script}
        </CmId>
        <h2>
          <CmHtml id="sjh-insight-title" html={c.insight.titleHtml} as="span" />
        </h2>
        <div className="bridge-box">
          {c.insight.paragraphs.map((p, i) => (
            <CmArrayItem
              key={i}
              id={`sjh-insight-paragraph-${i}`}
              style={{ marginBottom: i < c.insight.paragraphs.length - 1 ? "1em" : 0 }}
            >
              <CmId id={`sjh-insight-paragraph-${i}`}>{p}</CmId>
            </CmArrayItem>
          ))}
          <p style={{ marginTop: "1.25em" }}>
            <CmId id="sjh-insight-key-line" className="key">
              {c.insight.keyLine}
            </CmId>
          </p>
        </div>
      </section>

      <section>
        <CmId id="sjh-solution-script" className="section-label">
          {c.solution.script}
        </CmId>
        <h2>
          <CmHtml id="sjh-solution-title" html={c.solution.titleHtml} as="span" />
        </h2>
        <CmId id="sjh-solution-lead" as="p" style={{ marginBottom: "1.5em", lineHeight: 1.9 }}>
          {c.solution.lead}
        </CmId>
        <CmId id="sjh-solution-deliverables-heading" as="p" style={{ fontWeight: 700, marginBottom: "1em" }}>
          {c.solution.deliverablesHeading}
        </CmId>
        <div className="deliverables">
          {c.solution.deliverables.map((d, i) => (
            <CmArrayItem key={d.num} id={`sjh-solution-deliverable-${i}`} className="deliverable-item">
              <CmId id={`sjh-solution-deliverable-${i}-num`} className="num">
                {d.num}
              </CmId>
              <CmId id={`sjh-solution-deliverable-${i}-text`}>{d.text}</CmId>
            </CmArrayItem>
          ))}
        </div>
      </section>

      <div className="cta-block">
        <CtaButton href={c.midCta.ctaHref} label={c.midCta.label} labelCmId="sjh-mid-cta-label" />
      </div>

      <section>
        <div className="section-label">{c.program.script}</div>
        <h2>
          <CmHtml id="sjh-program-title" html={c.program.titleHtml} as="span" />
        </h2>
        <div className="program-table-wrap">
          <table className="flow-table">
            <thead>
              <tr>
                <th>{c.program.tableHeaders.step}</th>
                <th>{c.program.tableHeaders.content}</th>
              </tr>
            </thead>
            <tbody>
              {c.program.rows.map((row, i) => (
                <tr key={i}>
                  <CmArrayItem id={`sjh-program-row-${i}`} style={{ display: "contents" }}>
                    <td>
                      <CmId id={`sjh-program-row-${i}-step`}>{row.step}</CmId>
                    </td>
                    <td>
                      <CmId id={`sjh-program-row-${i}-content`}>{row.content}</CmId>
                    </td>
                  </CmArrayItem>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flow-points">
          {c.program.points.map((p, i) => (
            <CmArrayItem key={i} id={`sjh-program-point-${i}`} className="flow-point">
              <CmId id={`sjh-program-point-${i}`}>{p}</CmId>
            </CmArrayItem>
          ))}
        </div>
      </section>

      <section>
        <div className="section-label">{c.facilitator.script}</div>
        <h2>
          <Html html={c.facilitator.titleHtml} as="span" />
        </h2>
        <div className="facilitator-card">
          <img src={c.facilitator.imageUrl} alt={c.facilitator.name} data-cm-id="sjh-facilitator-image" />
          <div>
            <CmId id="sjh-facilitator-name" className="facilitator-name">
              {c.facilitator.name}
            </CmId>
            <CmId id="sjh-facilitator-role" className="facilitator-role">
              {c.facilitator.role}
            </CmId>
            <ul className="facilitator-bio">
              {c.facilitator.bio.map((line, i) => (
                <li key={i}>
                  <CmArrayItem id={`sjh-facilitator-bio-${i}`}>
                    <CmId id={`sjh-facilitator-bio-${i}`}>{line}</CmId>
                  </CmArrayItem>
                </li>
              ))}
            </ul>
            <CmId id="sjh-facilitator-quote" className="facilitator-quote">
              {c.facilitator.quote}
            </CmId>
          </div>
        </div>
      </section>

      <section>
        <div className="section-label">{c.voices.script}</div>
        <h2>
          <Html html={c.voices.titleHtml} as="span" />
        </h2>
        <div className="voices">
          {c.voices.items.map((v, i) => (
            <CmArrayItem key={i} id={`sjh-voices-item-${i}`} className="voice-card">
              <CmId id={`sjh-voices-item-${i}-school`} className="school">
                {v.school}
              </CmId>
              <CmId id={`sjh-voices-item-${i}-comment`} className="comment">
                {v.comment}
              </CmId>
            </CmArrayItem>
          ))}
        </div>
      </section>

      <section>
        <div className="section-label">{c.info.script}</div>
        <h2>{c.info.title}</h2>
        <table className="schedule-table">
          <tbody>
            {c.info.scheduleRows.map((row, i) => (
              <tr key={i}>
                <CmArrayItem id={`sjh-info-row-${i}`} style={{ display: "contents" }}>
                  <td>
                    <CmId id={`sjh-info-row-${i}-label`}>{row.label}</CmId>
                  </td>
                  <td>
                    <CmId id={`sjh-info-row-${i}-value`}>{row.value}</CmId>
                  </td>
                </CmArrayItem>
              </tr>
            ))}
          </tbody>
        </table>
        {c.info.mapEmbedUrl ? (
          <div className="map-wrap">
            <iframe
              src={c.info.mapEmbedUrl}
              title="会場マップ"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}
        <div className="cta-block" style={{ borderTop: "none", paddingTop: 32 }}>
          <CtaButton href={c.info.ctaHref} label={c.info.ctaLabel} labelCmId="sjh-info-cta-label" />
        </div>
      </section>

      <section>
        <div className="section-label">{c.recommend.script}</div>
        <h2>
          <Html html={c.recommend.titleHtml} as="span" />
        </h2>
        <ul className="recommend-list">
          {c.recommend.items.map((item, i) => (
            <li key={i}>
              <CmArrayItem id={`sjh-recommend-item-${i}`}>
                <CmId id={`sjh-recommend-item-${i}`}>{item}</CmId>
              </CmArrayItem>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="section-label">{c.faq.script}</div>
        <h2>
          <Html html={c.faq.titleHtml} as="span" />
        </h2>
        <div className="faq">
          {c.faq.items.map((item, i) => (
            <CmArrayItem key={i} id={`sjh-faq-item-${i}`} className="faq-item">
              <CmId id={`sjh-faq-item-${i}-q`} className="faq-q">
                {item.q}
              </CmId>
              <CmId id={`sjh-faq-item-${i}-a`} className="faq-a">
                {item.a}
              </CmId>
            </CmArrayItem>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>
          <CmHtml id="sjh-final-cta-title" html={c.finalCta.titleHtml} as="span" />
        </h2>
        <div className="sub">
          <CmHtml id="sjh-final-cta-sub" html={c.finalCta.subHtml} />
        </div>
        <div className="meta">
          {c.finalCta.metaItems.map((m, i) => (
            <CmArrayItem key={i} id={`sjh-final-cta-meta-${i}`}>
              <CmId id={`sjh-final-cta-meta-${i}`}>{m}</CmId>
            </CmArrayItem>
          ))}
        </div>
        <CtaButton
          href={c.finalCta.ctaHref}
          label={c.finalCta.ctaLabel}
          labelCmId="sjh-final-cta-label"
          dark
        />
        <div className="note">
          <CmHtml id="sjh-final-cta-note" html={c.finalCta.noteHtml} />
        </div>
      </section>

      <footer>
        {c.footer.lines.map((line, i) => (
          <CmArrayItem key={i} id={`sjh-footer-line-${i}`}>
            <CmId id={`sjh-footer-line-${i}`}>{line}</CmId>
          </CmArrayItem>
        ))}
        <CmId id="sjh-footer-copyright">{c.footer.copyright}</CmId>
      </footer>

      <div className="sticky-cta">
        <CtaButton href={c.stickyCta.ctaHref} label={c.stickyCta.label} labelCmId="sjh-sticky-cta-label" />
      </div>
    </div>
    </FieldStylesProvider>
  );
}
