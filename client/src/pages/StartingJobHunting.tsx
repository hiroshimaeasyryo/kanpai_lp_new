import { useEffect, useState, type ElementType } from "react";
import { fetchContentBySlug } from "@/lib/content-loader";
import type { ContentPayload } from "@/types/content-payload";
import {
  DEFAULT_STARTING_JOB_HUNTING_CONTENT,
  STARTING_JOB_HUNTING_ASSETS,
  mergeStartingJobHuntingContent,
  type StartingJobHuntingContent,
} from "@/types/starting-job-hunting";

const FAVICON_HREF = STARTING_JOB_HUNTING_ASSETS.favicon;
import "./starting-job-hunting.css";

const STORAGE_KEY = "starting_job_hunting_content_v1";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Shippori+Mincho:wght@400;700&display=swap";

const EVENT_INFO_ICONS: Record<string, string> = {
  日時: "📅",
  会場: "🏢",
  定員: "👥",
  参加費: "💰",
};

function trackCtaClick() {
  if (
    typeof window !== "undefined" &&
    typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === "function"
  ) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "Lead");
  }
}

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
  className,
  dark,
}: {
  href: string;
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      className={className ?? "cta-btn"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackCtaClick}
    >
      {!dark && <LineIcon />}
      {label}
    </a>
  );
}

export default function StartingJobHunting() {
  const [content, setContent] = useState<StartingJobHuntingContent>(() => {
    if (typeof window === "undefined") return DEFAULT_STARTING_JOB_HUNTING_CONTENT;
    return safeParseStored() ?? DEFAULT_STARTING_JOB_HUNTING_CONTENT;
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
  }, []);

  const c = content;

  return (
    <div id="starting-job-hunting-page">
      <header>
        <img src={c.header.logoUrl} alt={c.header.logoAlt} className="logo" />
        <a
          href={c.header.ctaHref}
          className="header-cta"
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackCtaClick}
        >
          <LineIcon className="line-icon--header" />
          <span className="header-cta-label header-cta-label--desktop">{c.header.ctaLabel}</span>
          <span className="header-cta-label header-cta-label--mobile">
            {c.header.ctaLabelMobile?.trim() || c.header.ctaLabel}
          </span>
        </a>
      </header>

      <div className="fv-kicker">{c.hero.kicker}</div>
      <div className="fv-image-wrap">
        <img src={c.hero.heroImageUrl} alt={c.hero.heroImageAlt} />
      </div>
      <div className="fv-cta-bar">
        <CtaButton href={c.hero.primaryCtaHref} label={c.hero.primaryCtaLabel} />
      </div>
      <div className="fv-body">
        <Html html={c.hero.bodyHtml} />
      </div>

      <div className="event-info-section">
        <div className="event-info-inner">
          <div className="event-info-label">{c.eventInfo.label}</div>
          <div className="event-info-rows">
            {c.eventInfo.rows.map((row, i) => (
              <div key={i} className="event-info-row">
                <div className="event-info-icon">{EVENT_INFO_ICONS[row.label] ?? "•"}</div>
                <div className="event-info-content">
                  <div className="ei-label">{row.label}</div>
                  <div className="ei-value">{row.value}</div>
                  {row.sub ? <div className="ei-sub">{row.sub}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <div className="section-label">{c.problem.script}</div>
        <h2>
          <Html html={c.problem.titleHtml} as="span" />
        </h2>
        <ul className="problem-list">
          {c.problem.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        {c.problem.reassurance ? <div className="reassurance">{c.problem.reassurance}</div> : null}
      </section>

      <section>
        <div className="section-label">{c.insight.script}</div>
        <h2>
          <Html html={c.insight.titleHtml} as="span" />
        </h2>
        <div className="bridge-box">
          {c.insight.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: i < c.insight.paragraphs.length - 1 ? "1em" : 0 }}>
              {p}
            </p>
          ))}
          <p style={{ marginTop: "1.25em" }}>
            <span className="key">{c.insight.keyLine}</span>
          </p>
        </div>
      </section>

      <section>
        <div className="section-label">{c.solution.script}</div>
        <h2>
          <Html html={c.solution.titleHtml} as="span" />
        </h2>
        <p style={{ marginBottom: "1.5em", lineHeight: 1.9 }}>{c.solution.lead}</p>
        <p style={{ fontWeight: 700, marginBottom: "1em" }}>{c.solution.deliverablesHeading}</p>
        <div className="deliverables">
          {c.solution.deliverables.map((d) => (
            <div key={d.num} className="deliverable-item">
              <span className="num">{d.num}</span>
              <span>{d.text}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-block">
        <CtaButton href={c.midCta.ctaHref} label={c.midCta.label} />
      </div>

      <section>
        <div className="section-label">{c.program.script}</div>
        <h2>
          <Html html={c.program.titleHtml} as="span" />
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
                  <td>{row.step}</td>
                  <td>{row.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flow-points">
          {c.program.points.map((p, i) => (
            <div key={i} className="flow-point">
              {p}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-label">{c.facilitator.script}</div>
        <h2>
          <Html html={c.facilitator.titleHtml} as="span" />
        </h2>
        <div className="facilitator-card">
          <img src={c.facilitator.imageUrl} alt={c.facilitator.name} />
          <div>
            <div className="facilitator-name">{c.facilitator.name}</div>
            <div className="facilitator-role">{c.facilitator.role}</div>
            <ul className="facilitator-bio">
              {c.facilitator.bio.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <div className="facilitator-quote">{c.facilitator.quote}</div>
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
            <div key={i} className="voice-card">
              <div className="school">{v.school}</div>
              <div className="comment">{v.comment}</div>
            </div>
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
                <td>{row.label}</td>
                <td>{row.value}</td>
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
          <CtaButton href={c.info.ctaHref} label={c.info.ctaLabel} />
        </div>
      </section>

      <section>
        <div className="section-label">{c.recommend.script}</div>
        <h2>
          <Html html={c.recommend.titleHtml} as="span" />
        </h2>
        <ul className="recommend-list">
          {c.recommend.items.map((item, i) => (
            <li key={i}>{item}</li>
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
            <div key={i} className="faq-item">
              <div className="faq-q">{item.q}</div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>
          <Html html={c.finalCta.titleHtml} as="span" />
        </h2>
        <div className="sub">
          <Html html={c.finalCta.subHtml} />
        </div>
        <div className="meta">
          {c.finalCta.metaItems.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
        <CtaButton href={c.finalCta.ctaHref} label={c.finalCta.ctaLabel} dark />
        <div className="note">
          <Html html={c.finalCta.noteHtml} />
        </div>
      </section>

      <footer>
        {c.footer.lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div>{c.footer.copyright}</div>
      </footer>

      <div className="sticky-cta">
        <CtaButton href={c.stickyCta.ctaHref} label={c.stickyCta.label} />
      </div>
    </div>
  );
}
