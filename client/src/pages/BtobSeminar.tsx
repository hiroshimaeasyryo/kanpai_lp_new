import { useCallback, useEffect, useRef, useState, type ElementType, type MouseEvent } from "react";
import { fetchContentBySlug } from "@/lib/content-loader";
import { scrollToAnchor } from "@/lib/smooth-scroll";
import type { ContentPayload } from "@/types/content-payload";
import {
  BTOB_SEMINAR_ASSETS,
  DEFAULT_BTOB_SEMINAR_CONTENT,
  mergeBtobSeminarContent,
  type BtobSeminarContent,
} from "@/types/btob-seminar";
import "./btob-seminar.css";

const STORAGE_KEY = "btob_seminar_content_v1";
/** CTA → #apply 用スクロール: 短めの duration で「高速」感 */
const ANCHOR_SCROLL_DURATION_MS = 650;
const ANCHOR_SCROLL_OFFSET_PX = 20;
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap";

function trackBtobCtaClick() {
  if (typeof window !== "undefined" && typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === "function") {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "Lead");
  }
}

function safeParseStored(): BtobSeminarContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return mergeBtobSeminarContent(parsed);
    return null;
  } catch {
    return null;
  }
}

function safeStore(next: BtobSeminarContent) {
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

export default function BtobSeminar() {
  const [content, setContent] = useState<BtobSeminarContent>(() => {
    if (typeof window === "undefined") return DEFAULT_BTOB_SEMINAR_CONTENT;
    return safeParseStored() ?? DEFAULT_BTOB_SEMINAR_CONTENT;
  });
  const rootRef = useRef<HTMLDivElement>(null);

  const handleCtaClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    trackBtobCtaClick();
    const href = e.currentTarget.getAttribute("href");
    if (href?.startsWith("#") && href !== "#") {
      e.preventDefault();
      scrollToAnchor(href, {
        offset: ANCHOR_SCROLL_OFFSET_PX,
        duration: ANCHOR_SCROLL_DURATION_MS,
      });
    }
  }, []);

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

    const faviconHref = BTOB_SEMINAR_ASSETS.favicon;
    const iconEl =
      (document.querySelector("link[rel~='icon']") as HTMLLinkElement | null) ??
      (document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement | null);

    if (!iconEl) {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/webp";
      link.href = faviconHref;
      document.head.appendChild(link);
      return () => {
        document.title = prevTitle;
        if (prevDescContent !== null && meta) meta.setAttribute("content", prevDescContent);
        link.remove();
      };
    }

    const prevHref = iconEl.href;
    const prevType = iconEl.type;
    iconEl.href = faviconHref;
    iconEl.type = "image/webp";

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
      const payload = await fetchContentBySlug("btob_seminar");
      const remote = (payload as ContentPayload | null)?.btobSeminar;
      if (cancelled) return;
      if (remote) {
        const merged = mergeBtobSeminarContent(remote);
        setContent(merged);
        safeStore(merged);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reveals = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [content]);

  const h = content.hero;
  const heroInfo = (() => {
    const padded = [...h.info];
    while (padded.length < 4) padded.push({ label: "", value: "" });
    return padded.slice(0, 4);
  })();

  return (
    <div id="btob-seminar-page" ref={rootRef}>
      <header className="site-header">
        <div className="container">
          <div className="site-header-inner">
            <div className="site-logo" dangerouslySetInnerHTML={{ __html: content.header.logoHtml }} />
            <div className="header-right">
              <span className="header-seminar-badge">{content.header.badgeLabel}</span>
              <a href={content.header.ctaHref} className="header-cta" onClick={handleCtaClick}>
                {content.header.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-category">
            <span className="hero-category-pill" dangerouslySetInnerHTML={{ __html: content.hero.categoryPillHtml }} />
            <span className="hero-category-line" />
            <span className="hero-category-meta">{content.hero.categoryMeta}</span>
          </div>

          <div className="hero-seminar-name">{content.hero.seminarName}</div>

          <h1>
            <Html html={content.hero.h1Html} as="span" className="block" />
          </h1>

          <p className="hero-lead">
            <Html html={content.hero.leadHtml} as="span" />
          </p>

          <div className="hero-info">
            {heroInfo.map((item, i) => (
              <div key={i} className="hero-info-item">
                <span className="hero-info-label">{item.label}</span>
                <span className="hero-info-value">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="hero-cta-wrap">
            <a href={content.hero.primaryCtaHref} className="cta-primary" onClick={handleCtaClick}>
              {content.hero.primaryCtaLabel}
            </a>
            <div className="cta-fineprint-light">{content.hero.primaryCtaFinePrint}</div>
          </div>
        </div>
      </section>

      <section id="empathy" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.empathy.script}</div>
            <h2 className="section-title">
              <Html html={content.empathy.titleHtml} as="span" />
            </h2>
          </div>

          <div className="empathy-grid reveal">
            <div>
              <p className="empathy-lead">
                <Html html={content.empathy.leadHtml} as="span" />
              </p>
              <div className="empathy-callout">
                <div className="empathy-callout-text">{content.empathy.callout}</div>
              </div>
            </div>

            <ul className="empathy-checklist">
              {content.empathy.checklist.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="structure">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.structure.script}</div>
            <h2 className="section-title">
              <Html html={content.structure.titleHtml} as="span" />
            </h2>
            <p className="section-sub">{content.structure.sub}</p>
          </div>

          <div className="loop-diagram reveal">
            {content.structure.steps.map((s) => (
              <div key={s.num} className="loop-step">
                <span className="loop-step-num">{s.num}</span>
                <div className="loop-step-label">{s.label}</div>
                <div className="loop-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          <p className="loop-note reveal">
            <Html html={content.structure.noteHtml} as="span" />
          </p>
        </div>
      </section>

      <section id="speaker" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.speaker.script}</div>
            <h2 className="section-title">
              <Html html={content.speaker.titleHtml} as="span" />
            </h2>
          </div>

          <div className="speaker-card reveal">
            <div className="speaker-photo">
              {content.speaker.avatarImageUrl ? (
                <div className="speaker-avatar">
                  <img src={content.speaker.avatarImageUrl} alt={content.speaker.name} />
                </div>
              ) : (
                <div className="speaker-avatar">{content.speaker.avatarChar}</div>
              )}
              <div className="speaker-photo-name">{content.speaker.photoName}</div>
              <div className="speaker-photo-role">{content.speaker.photoRole}</div>
            </div>
            <div className="speaker-content">
              <div className="speaker-meta">{content.speaker.meta}</div>
              <div className="speaker-name-large">{content.speaker.name}</div>
              <div className="speaker-company">{content.speaker.company}</div>
              <div className="speaker-message">
                <Html html={content.speaker.messageHtml} as="span" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.experience.script}</div>
            <h2 className="section-title">
              <Html html={content.experience.titleHtml} as="span" />
            </h2>
          </div>

          <div className="experience-grid reveal">
            {content.experience.items.map((ex) => (
              <div key={ex.num} className="experience-card">
                <span className="experience-num">{ex.num}</span>
                <div className="experience-name">{ex.name}</div>
                <div className="experience-desc">
                  <Html html={ex.descHtml} as="span" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="takeaway" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.takeaway.script}</div>
            <h2 className="section-title">
              <Html html={content.takeaway.titleHtml} as="span" />
            </h2>
            <p className="section-sub">{content.takeaway.sub}</p>
          </div>

          <div className="takeaway-list reveal">
            {content.takeaway.cards.map((c, i) => (
              <div key={i} className="takeaway-card">
                <div className="takeaway-icon">{c.icon}</div>
                <div className="takeaway-title">
                  <Html html={c.titleHtml} as="span" />
                </div>
                <div className="takeaway-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mid-cta">
        <div className="container">
          <div className="mid-cta-content">
            <div className="mid-cta-eyebrow">{content.midCta.eyebrow}</div>
            <div className="mid-cta-title">{content.midCta.title}</div>
            <div className="mid-cta-meta">{content.midCta.meta}</div>
            <a href={content.midCta.ctaHref} className="cta-light" onClick={handleCtaClick}>
              {content.midCta.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <section id="audience">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.audience.script}</div>
            <h2 className="section-title">
              <Html html={content.audience.titleHtml} as="span" />
            </h2>
          </div>

          <div className="audience-grid reveal">
            <ul className="audience-list">
              {content.audience.items.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            <div className="audience-note">
              <div className="audience-note-script">{content.audience.noteScript}</div>
              <div className="audience-note-title">
                <Html html={content.audience.noteTitleHtml} as="span" />
              </div>
              <div className="audience-note-body">{content.audience.noteBody}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="hosts" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.hosts.script}</div>
            <h2 className="section-title">
              <Html html={content.hosts.titleHtml} as="span" />
            </h2>
          </div>

          <div className="hosts-grid reveal">
            {content.hosts.cards.map((host, i) => (
              <div key={i} className={`host-card ${i === 0 ? "primary" : "secondary"}`}>
                <div className="host-role">{host.role}</div>
                <div className="host-role-jp">{host.roleJp}</div>
                <div className="host-name">{host.name}</div>
                <div className="host-desc">{host.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="details">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.details.script}</div>
            <h2 className="section-title">{content.details.title}</h2>
          </div>

          <table className="details-table reveal">
            <tbody>
              {content.details.rows.map((row, i) => (
                <tr key={i}>
                  <th>{row.th}</th>
                  <td>
                    <Html html={row.tdHtml} as="span" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="faq" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.faq.script}</div>
            <h2 className="section-title">{content.faq.title}</h2>
          </div>

          <div className="faq-list reveal">
            {content.faq.items.map((item, i) => (
              <div key={i} className="faq-item">
                <span className="faq-marker">Q.</span>
                <div>
                  <div className="faq-q">{item.q}</div>
                  <div className="faq-a">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container reveal">
          <h2>
            <Html html={content.finalCta.h2Html} as="span" className="block" />
          </h2>
          <p className="final-cta-lead">
            <Html html={content.finalCta.leadHtml} as="span" />
          </p>
          <a href={content.finalCta.ctaHref} className="cta-light" onClick={handleCtaClick}>
            {content.finalCta.ctaLabel}
          </a>
          <p className="cta-fineprint">{content.finalCta.finePrint}</p>
        </div>
      </section>

      <section id="apply" className="form-section">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.form.script}</div>
            <h2 className="section-title">{content.form.title}</h2>
            <p className="section-sub">
              <Html html={content.form.subHtml} as="span" />
            </p>
          </div>

          <div className="form-embed-wrap reveal">
            <iframe
              title={content.form.iframeTitle}
              src={content.form.embedUrl}
              width="100%"
              height={2400}
              style={{ border: 0 }}
            />
          </div>

          <p className="form-fallback reveal">
            {content.form.fallbackText}{" "}
            <a href={content.form.fallbackUrl} target="_blank" rel="noopener noreferrer">
              {content.form.fallbackLinkLabel}
            </a>{" "}
            から直接ご記入ください。
          </p>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-inner">{content.footer.copyright}</div>
        </div>
      </footer>
    </div>
  );
}
