import { Fragment, useEffect, useRef, useState } from "react";
import { fetchContentBySlug } from "@/lib/content-loader";
import { useCmPreviewPage } from "@/hooks/useCmPreviewPage";
import { trackMetaPixelLead } from "@/lib/meta-pixel";
import type { ContentPayload } from "@/types/content-payload";
import {
  DEFAULT_WR_CONTENT,
  WR_ASSETS,
  mergeWorksRecruitingContent,
  type WorksRecruitingContent,
} from "@/types/works-recruiting";
import { CmId, CmHtml, FieldStylesProvider } from "@/components/contents-manager/CmId";
import "./works-recruiting.css";

const STORAGE_KEY = "works_recruiting_content_v1";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Oswald:wght@500;600;700&display=swap";

/** 電話営業 vs 商談の棒グラフ最大値（元HTMLの maxValue=100 に対応） */
const COMPARE_MAX = 100;

function safeParseStored(): WorksRecruitingContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return mergeWorksRecruitingContent(parsed);
    return null;
  } catch {
    return null;
  }
}

function safeStore(next: WorksRecruitingContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* QuotaExceededError 等 */
  }
}

function LineIcon() {
  return <img src={WR_ASSETS.lineIcon} alt="" className="line-icon" aria-hidden />;
}

export default function WorksRecruiting() {
  const [content, setContent] = useState<WorksRecruitingContent>(() => {
    if (typeof window === "undefined") return DEFAULT_WR_CONTENT;
    return safeParseStored() ?? DEFAULT_WR_CONTENT;
  });
  const rootRef = useRef<HTMLDivElement>(null);

  const isCmPreview = useCmPreviewPage({
    slug: "works_recruiting",
    onDraft: (payload) => {
      const remote = (payload as ContentPayload | null)?.worksRecruiting;
      if (remote) {
        const merged = mergeWorksRecruitingContent(remote);
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

    return () => {
      document.title = prevTitle;
      if (prevDescContent !== null && meta) meta.setAttribute("content", prevDescContent);
    };
  }, [content.seo.description, content.seo.title]);

  useEffect(() => {
    if (isCmPreview) return;
    let cancelled = false;
    (async () => {
      const payload = await fetchContentBySlug("works_recruiting");
      const remote = (payload as ContentPayload | null)?.worksRecruiting;
      if (cancelled) return;
      if (remote) {
        const merged = mergeWorksRecruitingContent(remote);
        setContent(merged);
        safeStore(merged);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isCmPreview]);

  // スクロール演出・棒グラフ・カウントアップ・追尾CTA（元HTMLの script を移植）
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observers: IntersectionObserver[] = [];

    // reveal
    const revealEls = root.querySelectorAll<HTMLElement>(".reveal");
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      revealEls.forEach((el) => revealObs.observe(el));
      observers.push(revealObs);
    }

    // compare bar chart
    const compareEls = root.querySelectorAll<HTMLElement>(".compare-fill");
    const compareObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseFloat(el.dataset.target ?? "0");
            el.style.width = `${(target / COMPARE_MAX) * 100}%`;
            compareObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    compareEls.forEach((el) => compareObs.observe(el));
    observers.push(compareObs);

    // count-up
    const countEls = root.querySelectorAll<HTMLElement>("[data-count]");
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.count ?? "0", 10);
          if (reduceMotion) {
            el.textContent = String(target);
          } else {
            const duration = 900;
            const startTime = performance.now();
            const step = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              el.textContent = String(Math.floor(progress * target));
              if (progress < 1) requestAnimationFrame(step);
              else el.textContent = String(target);
            };
            requestAnimationFrame(step);
          }
          countObs.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    countEls.forEach((el) => countObs.observe(el));
    observers.push(countObs);

    // sticky CTA
    const hero = root.querySelector<HTMLElement>(".hero");
    const stickyCta = root.querySelector<HTMLElement>(".sticky-cta");
    if (hero && stickyCta) {
      const heroObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              stickyCta.classList.remove("is-visible");
            } else if (entry.boundingClientRect.top < 0) {
              stickyCta.classList.add("is-visible");
            }
          });
        },
        { threshold: 0 },
      );
      heroObs.observe(hero);
      observers.push(heroObs);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [content]);

  const c = content;

  return (
    <FieldStylesProvider value={c.fieldStyles}>
      <div id="works-recruiting-page" ref={rootRef}>
        {/* HERO */}
        <header className="hero">
          <img src={c.hero.imageUrl} alt={c.hero.imageAlt} data-cm-id="wr-hero-image" loading="eager" />
          <CmId id="wr-hero-image-alt" className="sr-only">
            {c.hero.imageAlt}
          </CmId>
          <svg className="wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,32 C240,60 480,4 720,28 C960,52 1200,10 1440,30 L1440,60 L0,60 Z" fill="#F5F5F0" />
          </svg>
        </header>

        {/* BLOCK1 共感 */}
        <section className="block1">
          <div className="wrap reveal">
            <CmId id="wr-empathy-eyebrow" as="p" className="eyebrow eyebrow--dark">
              {c.empathy.eyebrow}
            </CmId>
            <CmId id="wr-empathy-title" as="h2" className="section-title">
              {c.empathy.title}
            </CmId>
            <div className="empathy-list">
              {c.empathy.items.map((item, i) => (
                <div key={i} className="empathy-item">
                  <span className="empathy-item__mark">―</span>
                  <CmId id={`wr-empathy-item-${i}`} as="p">
                    {item}
                  </CmId>
                </div>
              ))}
            </div>
            <CmHtml id="wr-empathy-close" className="empathy-close" html={c.empathy.closeHtml} as="p" />
          </div>
        </section>

        {/* BLOCK2 解決策 */}
        <section className="block2">
          <div className="wrap reveal">
            <CmId id="wr-reason-eyebrow" as="p" className="eyebrow eyebrow--dark">
              {c.reason.eyebrow}
            </CmId>
            <CmId id="wr-reason-title" as="h2" className="section-title">
              {c.reason.title}
            </CmId>
            <CmId id="wr-reason-lead" as="p" className="lead">
              {c.reason.lead}
            </CmId>
            <div className="judge-list">
              {c.reason.items.map((item, i) => (
                <div key={i} className={`judge-item ${item.type === "yes" ? "is-yes" : "is-no"}`}>
                  <span className="judge-mark">
                    <img
                      className="mark-glyph-img"
                      src={item.type === "yes" ? WR_ASSETS.markO : WR_ASSETS.markX}
                      alt={item.type === "yes" ? "○" : "✕"}
                    />
                  </span>
                  <div className="judge-body">
                    <CmId id={`wr-reason-item-${i}-text`} as="p" className="judge-text">
                      {item.text}
                    </CmId>
                    {item.note ? (
                      <CmId id={`wr-reason-item-${i}-note`} as="p" className="judge-note">
                        {item.note}
                      </CmId>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 中間CTA */}
        <div className="mid-cta">
          <div className="wrap" style={{ textAlign: "center" }}>
            <a
              href={c.midCta.ctaHref}
              className="cta-button"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackMetaPixelLead}
            >
              <CmId id="wr-midcta-label" as="span">
                {c.midCta.label}
              </CmId>
              <LineIcon />
            </a>
          </div>
        </div>

        {/* PHOTO: クリアソン */}
        <div className="photo-band">
          <img
            src={c.photoBand1.imageUrl}
            alt={c.photoBand1.imageAlt}
            data-cm-id="wr-photoband1-image"
            loading="lazy"
          />
          <CmId id="wr-photoband1-image-alt" className="sr-only">
            {c.photoBand1.imageAlt}
          </CmId>
        </div>

        {/* パートナー企業 */}
        <div className="partner-note">
          <div className="wrap">
            <CmId id="wr-partner-text" as="p" className="partner-note__text">
              {c.partner.text}
            </CmId>
            <div className="partner-note__logos">
              <img src={c.partner.logoLeftUrl} alt={c.partner.logoLeftAlt} data-cm-id="wr-partner-logo-left" />
              <span className="partner-note__x">×</span>
              <img
                src={c.partner.logoRightUrl}
                alt={c.partner.logoRightAlt}
                data-cm-id="wr-partner-logo-right"
              />
            </div>
          </div>
        </div>

        {/* BLOCK3 STEP */}
        <section className="block3">
          <div className="wrap reveal">
            <CmId id="wr-steps-eyebrow" as="p" className="eyebrow eyebrow--dark">
              {c.steps.eyebrow}
            </CmId>
            <CmId id="wr-steps-title" as="h2" className="section-title">
              {c.steps.title}
            </CmId>
            <div className="step-block-list">
              {c.steps.items.map((step, i) => (
                <div key={i} className="step-block">
                  <div className="step-block__head">
                    <CmId id={`wr-steps-item-${i}-num`} className="step-num">
                      {step.num}
                    </CmId>
                    <div>
                      <CmId id={`wr-steps-item-${i}-label`} as="p" className="step-label">
                        {step.label}
                      </CmId>
                      <CmId id={`wr-steps-item-${i}-title`} as="h3">
                        {step.title}
                      </CmId>
                    </div>
                  </div>
                  <div className="step-block__image">
                    <img
                      src={step.imageUrl}
                      alt={step.imageAlt}
                      data-cm-id={`wr-steps-item-${i}-image`}
                      loading="lazy"
                    />
                  </div>
                  <CmId id={`wr-steps-item-${i}-text`} as="p" className="step-block__text">
                    {step.text}
                  </CmId>
                </div>
              ))}
            </div>

            {/* STEP1 補足 */}
            <div className="step1-detail">
              <CmId id="wr-steps-detail-title" as="h4">
                {c.steps.detail.title}
              </CmId>
              {c.steps.detail.compareRows.map((row, i) => (
                <div key={i} className="compare-row">
                  <div className="compare-label">
                    <CmId id={`wr-steps-detail-compare-${i}-label`} as="span">
                      {row.label}
                    </CmId>
                    <CmId id={`wr-steps-detail-compare-${i}-num`} as="span" className="num">
                      {row.num}
                    </CmId>
                  </div>
                  <div className="compare-track">
                    <div className={`compare-fill fill-${row.fill}`} data-target={row.target} />
                  </div>
                </div>
              ))}
              <CmId id="wr-steps-detail-caption" as="p" className="compare-caption">
                {c.steps.detail.caption}
              </CmId>
              <div className="step-notes">
                {c.steps.detail.notes.map((note, i) => (
                  <CmId key={i} id={`wr-steps-detail-note-${i}`} as="p">
                    {note}
                  </CmId>
                ))}
              </div>
              <div className="stat-chip-row">
                {c.steps.detail.statChips.map((chip, i) => (
                  <div key={i} className="stat-chip">
                    {chip.countUp ? (
                      <span className="num" data-count={chip.value}>
                        0
                      </span>
                    ) : (
                      <CmId
                        id={`wr-steps-detail-stat-${i}-value`}
                        className="num"
                        style={{ fontFamily: "'Oswald',sans-serif" }}
                      >
                        {chip.value}
                      </CmId>
                    )}
                    <CmId id={`wr-steps-detail-stat-${i}-label`} className="label">
                      {chip.label}
                    </CmId>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BLOCK4 カルチャー */}
        <section className="block4">
          <div className="wrap reveal">
            <CmId id="wr-culture-eyebrow" as="p" className="eyebrow eyebrow--dark">
              {c.culture.eyebrow}
            </CmId>
            <CmId id="wr-culture-title" as="h2" className="section-title">
              {c.culture.title}
            </CmId>
            <CmId id="wr-culture-lead" as="p" className="lead">
              {c.culture.lead}
            </CmId>
            <div className="compare-table">
              <div className="compare-table-row head">
                <span>項目</span>
                <span>一般的なインターン</span>
                <span>KANPAI Hütte</span>
              </div>
              {c.culture.rows.map((row, i) => (
                <div key={i} className="compare-table-row">
                  <CmId id={`wr-culture-row-${i}-label`} as="span" className="ct-label">
                    {row.label}
                  </CmId>
                  <CmId id={`wr-culture-row-${i}-general`} as="span" className="ct-general">
                    {row.general}
                  </CmId>
                  <CmId id={`wr-culture-row-${i}-here`} as="span" className="ct-here">
                    {row.here}
                  </CmId>
                </div>
              ))}
            </div>
            <a
              href={c.culture.pullQuote.ctaHref}
              className="pull-quote-cta"
              onClick={trackMetaPixelLead}
            >
              <CmHtml
                id="wr-culture-pullquote-text"
                className="pull-quote-cta__text"
                html={c.culture.pullQuote.textHtml}
                as="p"
              />
              <span className="pull-quote-cta__arrow">
                <CmId id="wr-culture-pullquote-arrow" as="span">
                  {c.culture.pullQuote.arrowLabel}
                </CmId>
                →
                <LineIcon />
              </span>
            </a>
          </div>
        </section>

        <div className="photo-band">
          <img
            src={c.photoBand2.imageUrl}
            alt={c.photoBand2.imageAlt}
            data-cm-id="wr-photoband2-image"
            loading="lazy"
          />
          <CmId id="wr-photoband2-image-alt" className="sr-only">
            {c.photoBand2.imageAlt}
          </CmId>
        </div>

        {/* BLOCK5 実績 */}
        <section className="block5">
          <div className="wrap reveal">
            <CmId id="wr-proof-eyebrow" as="p" className="eyebrow eyebrow--dark">
              {c.proof.eyebrow}
            </CmId>
            <CmId id="wr-proof-title" as="h2" className="section-title">
              {c.proof.title}
            </CmId>

            <div className="proof-section">
              <CmId id="wr-proof-universities-title" as="p" className="proof-section-title">
                {c.proof.universitiesTitle}
              </CmId>
              <div className="proof-image-card">
                <img
                  src={c.proof.universitiesImageUrl}
                  alt={c.proof.universitiesImageAlt}
                  data-cm-id="wr-proof-universities-image"
                />
              </div>
            </div>

            <div className="proof-section">
              <CmId id="wr-proof-offers-title" as="p" className="proof-section-title">
                {c.proof.offersTitle}
              </CmId>
              <div className="proof-image-card">
                <img
                  src={c.proof.offersImageUrl}
                  alt={c.proof.offersImageAlt}
                  data-cm-id="wr-proof-offers-image"
                />
              </div>
            </div>

            <div className="proof-section">
              <CmId id="wr-proof-voices-title" as="p" className="proof-section-title">
                {c.proof.voicesTitle}
              </CmId>
              <div className="testimonial-grid">
                {c.proof.testimonials.map((t, i) => (
                  <div key={i} className="testimonial-card">
                    <div className="testimonial-card__photo">
                      <img
                        src={t.imageUrl}
                        alt={t.imageAlt}
                        data-cm-id={`wr-proof-testimonial-${i}-image`}
                      />
                    </div>
                    <div className="testimonial-card__body">
                      <div className="testimonial-card__head">
                        <CmId id={`wr-proof-testimonial-${i}-name`} as="p" className="testimonial-card__name">
                          {t.name}
                        </CmId>
                        <CmId id={`wr-proof-testimonial-${i}-uni`} as="p" className="testimonial-card__uni">
                          {t.uni}
                        </CmId>
                      </div>
                      <div className="testimonial-card__quote">
                        {t.quotes.map((q, j) => (
                          <CmId key={j} id={`wr-proof-testimonial-${i}-quote-${j}`} as="p">
                            {q}
                          </CmId>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-block" id="cta">
          <div className="wrap reveal">
            <CmId id="wr-cta-eyebrow" as="p" className="eyebrow eyebrow--dark">
              {c.cta.eyebrow}
            </CmId>
            <CmId id="wr-cta-title" as="h2" className="section-title">
              {c.cta.title}
            </CmId>
            <a
              href={c.cta.ctaHref}
              className="cta-button"
              aria-label="選考説明会に応募する（LINE）"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackMetaPixelLead}
            >
              <LineIcon />
              <CmId id="wr-cta-label" as="span">
                {c.cta.ctaLabel}
              </CmId>
            </a>
            <div className="flow">
              {c.cta.flow.map((step, i) => (
                <Fragment key={i}>
                  {i > 0 ? <div className="flow-arrow">→</div> : null}
                  <div className="flow-step">
                    <CmId id={`wr-cta-flow-${i}-num`} as="p" className="fs-num">
                      {step.num}
                    </CmId>
                    <CmId id={`wr-cta-flow-${i}-title`} as="h5">
                      {step.title}
                    </CmId>
                    <CmId id={`wr-cta-flow-${i}-desc`} as="p">
                      {step.desc}
                    </CmId>
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="info-strip">
              {c.cta.infoStrip.map((info, i) => (
                <div key={i}>
                  <CmId id={`wr-cta-info-${i}-label`} as="p" className="label">
                    {info.label}
                  </CmId>
                  <CmId id={`wr-cta-info-${i}-value`} as="p" className="val">
                    {info.value}
                  </CmId>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer>
          <CmHtml id="wr-footer-text" html={c.footer.textHtml} as="span" />
        </footer>

        {/* 追尾型CTA */}
        <div className="sticky-cta">
          <a
            href={c.stickyCta.ctaHref}
            className="sticky-cta__btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMetaPixelLead}
          >
            <LineIcon />
            <CmId id="wr-stickycta-label" as="span">
              {c.stickyCta.label}
            </CmId>
          </a>
        </div>
      </div>
    </FieldStylesProvider>
  );
}
