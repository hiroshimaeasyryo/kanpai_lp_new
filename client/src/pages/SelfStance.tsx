import { useEffect, useState, type ElementType } from "react";
import { fetchContentBySlug } from "@/lib/content-loader";
import type { ContentPayload } from "@/types/content-payload";
import {
  DEFAULT_SELF_STANCE_CONTENT,
  SELF_STANCE_ASSETS,
  mergeSelfStanceContent,
  type SelfStanceContent,
} from "@/types/self-stance";
import "./self-stance.css";

const STORAGE_KEY = "self_stance_content_v1";
const FAVICON_HREF = SELF_STANCE_ASSETS.favicon;
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap";

const EVENT_INFO_ICONS: Record<string, string> = {
  日時: "📅",
  会場: "📍",
  定員: "👥",
  参加費: "🎁",
  持ち物: "✏️",
  運営会社: "🏢",
};

function trackCtaClick() {
  if (
    typeof window !== "undefined" &&
    typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === "function"
  ) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "Lead");
  }
}

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

function Html({ html, as, className }: { html: string; as?: ElementType; className?: string }) {
  const Tag = as ?? "div";
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
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
  className = "btn-line",
  showLineIcon = true,
}: {
  href: string;
  label: string;
  className?: string;
  showLineIcon?: boolean;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackCtaClick}
    >
      {showLineIcon && <LineIcon />}
      {label}
    </a>
  );
}

export default function SelfStance() {
  const [content, setContent] = useState<SelfStanceContent>(() => {
    if (typeof window === "undefined") return DEFAULT_SELF_STANCE_CONTENT;
    return safeParseStored() ?? DEFAULT_SELF_STANCE_CONTENT;
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
  }, []);

  const c = content;

  return (
    <div id="self-stance-page">
      <div className="sticky">
        <a
          href={c.stickyCta.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackCtaClick}
        >
          <LineIcon />
          {c.stickyCta.label}
        </a>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <img src={c.header.logoUrl} alt={c.header.logoAlt} className="logo-img" />
          <a
            href={c.header.ctaHref}
            className="header-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackCtaClick}
          >
            <span>{c.header.ctaLabel}</span>
            <LineIcon />
          </a>
        </div>
      </header>
      <div className="deco-line" />

      <div className="fv">
        <div className="fv-eyebrow">{c.hero.eyebrow}</div>
        <div className="fv-img-wrap">
          <img src={c.hero.heroImageUrl} alt={c.hero.heroImageAlt} />
        </div>
        <div className="fv-img-cta">
          <div className="inner">
            <CtaButton href={c.hero.primaryCtaHref} label={c.hero.primaryCtaLabel} />
          </div>
        </div>
        <div className="fv-body-wrap">
          <div className="inner">
            <Html className="fv-body" html={c.hero.bodyHtml} />
          </div>
        </div>
      </div>

      <div className="info-bar">
        <p className="info-bar-label">{c.eventInfo.label}</p>
        <div className="info-grid">
          {c.eventInfo.rows.map((row, i) => (
            <div key={i} className="info-row">
              <div className="info-icon">{EVENT_INFO_ICONS[row.label] ?? "•"}</div>
              <div className="info-text">
                <span className="ilabel">{row.label}</span>
                <span className="ivalue">{row.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="empathy">
        <div className="inner">
          <span className="sec-label">{c.empathy.label}</span>
          <p className="emp-title">{c.empathy.title}</p>
          <ul className="emp-list">
            {c.empathy.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="solution">
        <div className="inner">
          <span className="sec-label">{c.solution.label}</span>
          <h2 className="h2-light">
            <Html html={c.solution.titleHtml} as="span" />
          </h2>
          <p className="sol-subtitle">{c.solution.subtitle}</p>
          <div className="sol-body">
            <p>{c.solution.body}</p>
          </div>
          <p className="benefit-head">{c.solution.benefitsHeading}</p>
          <ul className="benefit-list">
            {c.solution.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </section>
      <div className="cta-sol inner">
        <CtaButton href={c.solution.ctaHref} label={c.solution.ctaLabel} />
      </div>

      <section className="flow">
        <div className="inner">
          <span className="sec-label">{c.program.label}</span>
          <h2 className="h2">
            <Html html={c.program.titleHtml} as="span" />
          </h2>
          <div className="flow-steps">
            {c.program.steps.map((step, i) => (
              <div key={i} className="flow-step">
                <div className="flow-step-left">
                  <span className="flow-step-num">{step.num}</span>
                  <span className="flow-step-name">
                    <Html html={step.nameHtml} as="span" />
                  </span>
                </div>
                <div className="flow-step-right">{step.description}</div>
              </div>
            ))}
          </div>
          <div className="flow-points">
            <p>{c.program.pointsHeading}</p>
            <ul>
              {c.program.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="faci">
        <div className="inner">
          <span className="sec-label">{c.facilitator.label}</span>
          <h2 className="h2">{c.facilitator.title}</h2>
          <div className="faci-card">
            <div className="faci-photo">
              <img src={c.facilitator.imageUrl} alt={c.facilitator.name} />
            </div>
            <div>
              <div className="faci-name">{c.facilitator.name}</div>
              <div className="faci-role">{c.facilitator.role}</div>
              <ul className="faci-list">
                {c.facilitator.bio.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="faci-quote">{c.facilitator.quote}</div>
        </div>
      </section>

      <section className="voices">
        <div className="inner">
          <span className="sec-label">{c.voices.label}</span>
          <h2 className="h2-light">{c.voices.title}</h2>
          <div className="voice-grid">
            {c.voices.items.map((v, i) => (
              <div key={i} className="voice-card">
                <div className="voice-who">{v.who}</div>
                <div className="voice-text">{v.text}</div>
              </div>
            ))}
          </div>
          {c.voices.note ? <p className="voice-note">{c.voices.note}</p> : null}
        </div>
      </section>

      <section className="detail">
        <div className="inner">
          <span className="sec-label">{c.detail.label}</span>
          <h2 className="h2">{c.detail.title}</h2>
          <table className="detail-table">
            <tbody>
              {c.detail.scheduleRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
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
          <CtaButton href={c.detail.ctaHref} label={c.detail.ctaLabel} />
        </div>
      </section>

      <section className="target">
        <div className="inner">
          <span className="sec-label">{c.target.label}</span>
          <h2 className="h2">{c.target.title}</h2>
          <ul className="target-list">
            {c.target.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faq">
        <div className="inner">
          <span className="sec-label">{c.faq.label}</span>
          <h2 className="h2">{c.faq.title}</h2>
          <div className="faq-list">
            {c.faq.items.map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <h2>
          <Html html={c.finalCta.titleHtml} as="span" />
        </h2>
        <div className="final-body">
          {c.finalCta.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <CtaButton
          href={c.finalCta.ctaHref}
          label={c.finalCta.ctaLabel}
          showLineIcon={false}
        />
        <p className="cta-note">{c.finalCta.note}</p>
      </section>

      <footer className="page-footer">
        {c.footer.lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div>{c.footer.copyright}</div>
      </footer>
    </div>
  );
}
