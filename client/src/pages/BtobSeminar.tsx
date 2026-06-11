import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { CmHtml, CmId, FieldStylesProvider } from "@/components/contents-manager/CmId";
import { fetchContentBySlug } from "@/lib/content-loader";
import { useCmPreviewPage } from "@/hooks/useCmPreviewPage";
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

  const isCmPreview = useCmPreviewPage({
    slug: "btob_seminar",
    onDraft: (payload) => {
      const remote = (payload as ContentPayload | null)?.btobSeminar;
      if (remote) {
        const merged = mergeBtobSeminarContent(remote);
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
    if (isCmPreview) return;
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
  }, [isCmPreview]);

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
    <FieldStylesProvider value={content.fieldStyles}>
    <div id="btob-seminar-page" ref={rootRef}>
      <header className="site-header">
        <div className="container">
          <div className="site-header-inner">
            <CmHtml id="btob-header-logo" html={content.header.logoHtml} as="div" className="site-logo" />
            <div className="header-right">
              <CmId id="btob-header-badge" as="span" className="header-seminar-badge">
                {content.header.badgeLabel}
              </CmId>
              <a href={content.header.ctaHref} className="header-cta" onClick={handleCtaClick}>
                <CmId id="btob-header-cta-label">{content.header.ctaLabel}</CmId>
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-category">
            <CmHtml
              id="btob-hero-category-pill"
              html={content.hero.categoryPillHtml}
              as="span"
              className="hero-category-pill"
            />
            <span className="hero-category-line" />
            <CmId id="btob-hero-category-meta" as="span" className="hero-category-meta">
              {content.hero.categoryMeta}
            </CmId>
          </div>

          <CmId id="btob-hero-seminar-name" as="div" className="hero-seminar-name">
            {content.hero.seminarName}
          </CmId>

          <h1>
            <CmHtml id="btob-hero-h1" html={content.hero.h1Html} as="span" className="block" />
          </h1>

          <p className="hero-lead">
            <CmHtml id="btob-hero-lead" html={content.hero.leadHtml} as="span" />
          </p>

          <div className="hero-info">
            {heroInfo.map((item, i) => (
              <div key={i} className="hero-info-item">
                <CmId id={`btob-hero-info-${i}-label`} as="span" className="hero-info-label">
                  {item.label}
                </CmId>
                <CmId id={`btob-hero-info-${i}-value`} as="span" className="hero-info-value">
                  {item.value}
                </CmId>
              </div>
            ))}
          </div>

          <div className="hero-cta-wrap">
            <a href={content.hero.primaryCtaHref} className="cta-primary" onClick={handleCtaClick}>
              <CmId id="btob-hero-primary-cta-label">{content.hero.primaryCtaLabel}</CmId>
            </a>
            <CmId id="btob-hero-primary-cta-fine-print" as="div" className="cta-fineprint-light">
              {content.hero.primaryCtaFinePrint}
            </CmId>
          </div>
        </div>
      </section>

      <section id="empathy" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-empathy-script" as="div" className="section-script">
              {content.empathy.script}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="btob-empathy-title" html={content.empathy.titleHtml} as="span" />
            </h2>
          </div>

          <div className="empathy-grid reveal">
            <div>
              <p className="empathy-lead">
                <CmHtml id="btob-empathy-lead" html={content.empathy.leadHtml} as="span" />
              </p>
              <div className="empathy-callout">
                <CmId id="btob-empathy-callout" as="div" className="empathy-callout-text">
                  {content.empathy.callout}
                </CmId>
              </div>
            </div>

            <ul className="empathy-checklist">
              {content.empathy.checklist.map((t, i) => (
                <CmId key={i} id={`btob-empathy-checklist-${i}`} as="li">
                  {t}
                </CmId>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="structure">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-structure-script" as="div" className="section-script">
              {content.structure.script}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="btob-structure-title" html={content.structure.titleHtml} as="span" />
            </h2>
            <CmId id="btob-structure-sub" as="p" className="section-sub">
              {content.structure.sub}
            </CmId>
          </div>

          <div className="loop-diagram reveal">
            {content.structure.steps.map((s, i) => (
              <div key={s.num} className="loop-step">
                <CmId id={`btob-structure-step-${i}-num`} as="span" className="loop-step-num">
                  {s.num}
                </CmId>
                <CmId id={`btob-structure-step-${i}-label`} as="div" className="loop-step-label">
                  {s.label}
                </CmId>
                <CmId id={`btob-structure-step-${i}-desc`} as="div" className="loop-step-desc">
                  {s.desc}
                </CmId>
              </div>
            ))}
          </div>

          <p className="loop-note reveal">
            <CmHtml id="btob-structure-note" html={content.structure.noteHtml} as="span" />
          </p>
        </div>
      </section>

      <section id="speaker" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-speaker-script" as="div" className="section-script">
              {content.speaker.script}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="btob-speaker-title" html={content.speaker.titleHtml} as="span" />
            </h2>
          </div>

          <div className="speaker-card reveal">
            <div className="speaker-photo">
              {content.speaker.avatarImageUrl ? (
                <div className="speaker-avatar">
                  <img
                    src={content.speaker.avatarImageUrl}
                    alt={content.speaker.name}
                    data-cm-id="btob-speaker-avatar-image"
                  />
                </div>
              ) : (
                <CmId id="btob-speaker-avatar-char" as="div" className="speaker-avatar">
                  {content.speaker.avatarChar}
                </CmId>
              )}
              <CmId id="btob-speaker-photo-name" as="div" className="speaker-photo-name">
                {content.speaker.photoName}
              </CmId>
              <CmId id="btob-speaker-photo-role" as="div" className="speaker-photo-role">
                {content.speaker.photoRole}
              </CmId>
            </div>
            <div className="speaker-content">
              <CmId id="btob-speaker-meta" as="div" className="speaker-meta">
                {content.speaker.meta}
              </CmId>
              <CmId id="btob-speaker-name" as="div" className="speaker-name-large">
                {content.speaker.name}
              </CmId>
              <CmId id="btob-speaker-company" as="div" className="speaker-company">
                {content.speaker.company}
              </CmId>
              <div className="speaker-message">
                <CmHtml id="btob-speaker-message" html={content.speaker.messageHtml} as="span" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-experience-script" as="div" className="section-script">
              {content.experience.script}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="btob-experience-title" html={content.experience.titleHtml} as="span" />
            </h2>
          </div>

          <div className="experience-grid reveal">
            {content.experience.items.map((ex, i) => (
              <div key={ex.num} className="experience-card">
                <CmId id={`btob-experience-item-${i}-num`} as="span" className="experience-num">
                  {ex.num}
                </CmId>
                <CmId id={`btob-experience-item-${i}-name`} as="div" className="experience-name">
                  {ex.name}
                </CmId>
                <div className="experience-desc">
                  <CmHtml id={`btob-experience-item-${i}-descHtml`} html={ex.descHtml} as="span" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="takeaway" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-takeaway-script" as="div" className="section-script">
              {content.takeaway.script}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="btob-takeaway-title" html={content.takeaway.titleHtml} as="span" />
            </h2>
            <CmId id="btob-takeaway-sub" as="p" className="section-sub">
              {content.takeaway.sub}
            </CmId>
          </div>

          <div className="takeaway-list reveal">
            {content.takeaway.cards.map((c, i) => (
              <div key={i} className="takeaway-card">
                <CmId id={`btob-takeaway-card-${i}-icon`} as="div" className="takeaway-icon">
                  {c.icon}
                </CmId>
                <div className="takeaway-title">
                  <CmHtml id={`btob-takeaway-card-${i}-titleHtml`} html={c.titleHtml} as="span" />
                </div>
                <CmId id={`btob-takeaway-card-${i}-desc`} as="div" className="takeaway-desc">
                  {c.desc}
                </CmId>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mid-cta">
        <div className="container">
          <div className="mid-cta-content">
            <CmId id="btob-mid-cta-eyebrow" as="div" className="mid-cta-eyebrow">
              {content.midCta.eyebrow}
            </CmId>
            <CmId id="btob-mid-cta-title" as="div" className="mid-cta-title">
              {content.midCta.title}
            </CmId>
            <CmId id="btob-mid-cta-meta" as="div" className="mid-cta-meta">
              {content.midCta.meta}
            </CmId>
            <a href={content.midCta.ctaHref} className="cta-light" onClick={handleCtaClick}>
              <CmId id="btob-mid-cta-label">{content.midCta.ctaLabel}</CmId>
            </a>
          </div>
        </div>
      </section>

      <section id="audience">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-audience-script" as="div" className="section-script">
              {content.audience.script}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="btob-audience-title" html={content.audience.titleHtml} as="span" />
            </h2>
          </div>

          <div className="audience-grid reveal">
            <ul className="audience-list">
              {content.audience.items.map((t, i) => (
                <CmId key={i} id={`btob-audience-item-${i}`} as="li">
                  {t}
                </CmId>
              ))}
            </ul>

            <div className="audience-note">
              <CmId id="btob-audience-note-script" as="div" className="audience-note-script">
                {content.audience.noteScript}
              </CmId>
              <div className="audience-note-title">
                <CmHtml id="btob-audience-note-title" html={content.audience.noteTitleHtml} as="span" />
              </div>
              <CmId id="btob-audience-note-body" as="div" className="audience-note-body">
                {content.audience.noteBody}
              </CmId>
            </div>
          </div>
        </div>
      </section>

      <section id="hosts" className="alt-bg">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-hosts-script" as="div" className="section-script">
              {content.hosts.script}
            </CmId>
            <h2 className="section-title">
              <CmHtml id="btob-hosts-title" html={content.hosts.titleHtml} as="span" />
            </h2>
          </div>

          <div className="hosts-grid reveal">
            {content.hosts.cards.map((host, i) => (
              <div key={i} className={`host-card ${i === 0 ? "primary" : "secondary"}`}>
                <CmId id={`btob-hosts-card-${i}-role`} as="div" className="host-role">
                  {host.role}
                </CmId>
                <CmId id={`btob-hosts-card-${i}-roleJp`} as="div" className="host-role-jp">
                  {host.roleJp}
                </CmId>
                <CmId id={`btob-hosts-card-${i}-name`} as="div" className="host-name">
                  {host.name}
                </CmId>
                <CmId id={`btob-hosts-card-${i}-desc`} as="div" className="host-desc">
                  {host.desc}
                </CmId>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="details">
        <div className="container">
          <div className="section-head reveal">
            <CmId id="btob-details-script" as="div" className="section-script">
              {content.details.script}
            </CmId>
            <CmId id="btob-details-title" as="h2" className="section-title">
              {content.details.title}
            </CmId>
          </div>

          <table className="details-table reveal">
            <tbody>
              {content.details.rows.map((row, i) => (
                <tr key={i}>
                  <CmId id={`btob-details-row-${i}-th`} as="th">
                    {row.th}
                  </CmId>
                  <td>
                    <CmHtml id={`btob-details-row-${i}-tdHtml`} html={row.tdHtml} as="span" />
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
            <CmId id="btob-faq-script" as="div" className="section-script">
              {content.faq.script}
            </CmId>
            <CmId id="btob-faq-title" as="h2" className="section-title">
              {content.faq.title}
            </CmId>
          </div>

          <div className="faq-list reveal">
            {content.faq.items.map((item, i) => (
              <div key={i} className="faq-item">
                <span className="faq-marker">Q.</span>
                <div>
                  <CmId id={`btob-faq-item-${i}-q`} as="div" className="faq-q">
                    {item.q}
                  </CmId>
                  <CmId id={`btob-faq-item-${i}-a`} as="div" className="faq-a">
                    {item.a}
                  </CmId>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container reveal">
          <h2>
            <CmHtml id="btob-final-cta-h2" html={content.finalCta.h2Html} as="span" className="block" />
          </h2>
          <p className="final-cta-lead">
            <CmHtml id="btob-final-cta-lead" html={content.finalCta.leadHtml} as="span" />
          </p>
          <a href={content.finalCta.ctaHref} className="cta-light" onClick={handleCtaClick}>
            <CmId id="btob-final-cta-label">{content.finalCta.ctaLabel}</CmId>
          </a>
          <CmId id="btob-final-cta-fine-print" as="p" className="cta-fineprint">
            {content.finalCta.finePrint}
          </CmId>
        </div>
      </section>

      <section id="apply" className="form-section">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-script">{content.form.script}</div>
            <CmId id="btob-form-title" as="h2" className="section-title">
              {content.form.title}
            </CmId>
            <p className="section-sub">
              <CmHtml id="btob-form-sub" html={content.form.subHtml} as="span" />
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
            <CmId id="btob-form-fallback-text">{content.form.fallbackText}</CmId>{" "}
            <a href={content.form.fallbackUrl} target="_blank" rel="noopener noreferrer">
              <CmId id="btob-form-fallback-link-label">{content.form.fallbackLinkLabel}</CmId>
            </a>{" "}
            から直接ご記入ください。
          </p>
        </div>
      </section>

      <footer>
        <div className="container">
          <CmId id="btob-footer-copyright" as="div" className="footer-inner">
            {content.footer.copyright}
          </CmId>
        </div>
      </footer>
    </div>
    </FieldStylesProvider>
  );
}
