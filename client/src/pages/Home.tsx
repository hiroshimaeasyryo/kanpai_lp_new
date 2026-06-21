/* Wa-Modern Minimalism Design Philosophy
   - 間（Ma）の美学: 余白を積極的に活用し、視覚的な呼吸空間を作る
   - 温かみのある対話性: 手書き風要素とソフトなインタラクション
   - 誠実な透明性: 飾らない、正直な表現を視覚的に体現
   - 静かな力強さ: 控えめながら印象的なビジュアル階層
   - カラー: アンバー/ブラウン (#d4844b, #5C3D2E) + クリーム/ベージュ (#fffaf5, #f5e6cd)
   - タイポグラフィ: Shippori Mincho (見出し) + Zen Kaku Gothic New (本文)
*/

import { useEffect, useRef, useState, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useCmPreviewPage } from "@/hooks/useCmPreviewPage";
import { CmArrayItem } from "@/components/contents-manager/CmId";
import { useHomeDynamicLinks } from "@/hooks/useHomeDynamicLinks";
import {
  DEFAULT_EVENT_FLOW_IMAGE_PATHS,
  DEFAULT_EVENT_FLOW_LABELS,
  DEFAULT_HERO_IMAGE_PATH,
  DEFAULT_HERO_IMAGE_PATH_MOBILE,
  DEFAULT_HERO_IMAGE_PATH_MOBILE_WEBP,
  DEFAULT_HERO_IMAGE_PATH_WEBP,
  getDefaultFeatureWebpPath,
  getDefaultHeroWebpPath,
  getStoredCampaign2603Notice,
  getStoredEventImages,
  getStoredFeatures,
  getStoredHeroImage,
  migrateOldImageFormat,
} from "@/lib/content-settings";
import type { ContentPayload } from "@/types/content-payload";
import {
  CAMPAIGN2603_FAQ_QUESTION,
  getStoredHomeCopy,
  mergeHomeCopy,
  type HomeCopy,
} from "@/types/home-copy";
import { buildFieldStylesStylesheet } from "@/types/home-copy-style";
import { applyContentToLocalStorage, fetchContent, fetchContentBySlug, getContentFromLocalStorage } from "@/lib/content-loader";
import { TOP_SLUG } from "@/lib/lp-slug";
import { DefaultLogoIcon } from "@/components/DefaultLogoIcon";
import { usePalette } from "@/contexts/PaletteContext";
import type { KanpaiEvent } from "@/types/events";
import { defaultEvents, getNextEvents } from "@/types/events";
import { LINE_CAMPAIGN2603_SIGNUP_URL, LINE_KS_SIGNUP_URL } from "@/constants/line-ks-signup";
import { HomeCm } from "@/components/contents-manager/HomeCm";
import {
  createHomeCopyStyleHelpers,
  MINCHO_STYLE,
} from "@/lib/content-manager/home-copy-preview-styles";
import { trackMetaPixelLead } from "@/lib/meta-pixel";

/** campaign2603用: キャンペーン文言のデフォルト（未設定時表示） */
const DEFAULT_CAMPAIGN2603_NOTICE =
  "※地方学生限定キャンペーン実施中です※\n\nKANPAI就活は27卒向けラスト2回。\n「行きたいけど遠い」という方へ、今回限り交通費サポートを用意しました。\n先着5名・上限あり。\n詳細はご予約後に運営よりご案内します。";

/** キャンペーン文言を1行目（タイトル）と本文に分けて表示用に返す */
function splitCampaign2603Notice(raw: string): { title: string; body: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { title: "", body: "" };
  const firstNewline = trimmed.indexOf("\n");
  const title = firstNewline >= 0 ? trimmed.slice(0, firstNewline).trim() : trimmed;
  const body = firstNewline >= 0 ? trimmed.slice(firstNewline + 1).trim() : "";
  return { title, body };
}

export interface HomeProps {
  /** 複数LP運用: このLPのスラグ。未指定時はトップ（root） */
  lpSlug?: string;
}

export default function Home({ lpSlug }: HomeProps) {
  const contentSlug = lpSlug ?? TOP_SLUG;
  const { setPaletteId } = usePalette();
  useSmoothScroll({ offset: 56 });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroImageMobileUrl, setHeroImageMobileUrl] = useState<string | null>(null);
  const [heroImageLoadError, setHeroImageLoadError] = useState(false);
  const [nextEvents, setNextEvents] = useState<KanpaiEvent[]>([]);
  const [eventImages, setEventImages] = useState<string[]>([]);
  /** EVENT FLOW カルーセル用（1〜3枚目、ラベル付き）。管理画面 or デフォルトパスから構築 */
  const [eventFlowItems, setEventFlowItems] = useState<{ url: string; label: string }[]>([]);
  /** Unique Features の3件（見出し・本文・画像）。管理画面 or デフォルトから構築 */
  const [features, setFeatures] = useState<{ title: string; body: string; imageUrl?: string | null }[]>(() => getStoredFeatures());
  /** 特徴画像の読み込み失敗したインデックス。失敗したら画像ブロックごと非表示 */
  const [featureImageErrors, setFeatureImageErrors] = useState<Set<number>>(new Set());
  /** ヒーロー直下の「NEXT EVENT」カルーセルで表示中のインデックス（0〜2） */
  const [nextEventCarouselIndex, setNextEventCarouselIndex] = useState(0);
  const nextEventCarouselTouchStartX = useRef<number | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  /** ヒーロー画像の img onLoad が発火したか（スケルトン非表示の目安） */
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  /** モバイル用: 少しスクロールしたら下部固定CTAを表示するか */
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [homeCopy, setHomeCopy] = useState<HomeCopy>(() => getStoredHomeCopy());
  const [campaign2603Notice, setCampaign2603Notice] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_CAMPAIGN2603_NOTICE;
    return getStoredCampaign2603Notice() ?? DEFAULT_CAMPAIGN2603_NOTICE;
  });
  /** コンテンツ管理プレビュー: FAQ の開閉状態 */
  const [previewOpenFaq, setPreviewOpenFaq] = useState<Set<number>>(() => new Set());

  const lineCtaLabel = homeCopy.cta.primaryLabel;
  const lineSignupLabel = homeCopy.cta.stickyLabel;
  const defaultLineHref =
    contentSlug === "campaign2603" ? LINE_CAMPAIGN2603_SIGNUP_URL : LINE_KS_SIGNUP_URL;
  const { cms, cmh } = createHomeCopyStyleHelpers(homeCopy, defaultLineHref);
  const homeRootRef = useRef<HTMLDivElement>(null);

  const applyPayloadToState = useCallback((payload: ContentPayload) => {
    try {
      applyContentToLocalStorage(payload);
    } catch {
      /* Safari 等でストレージ上限 */
    }
    const events = (payload.events ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setNextEvents(events.slice(0, 3));
    const list = payload.eventImages ?? [];
    if (list.length > 0) {
      setEventImages(list.map((img) => img.url));
    }
    const flowItems: { url: string; label: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const item = list[i];
      flowItems.push({
        url: item?.url || DEFAULT_EVENT_FLOW_IMAGE_PATHS[i],
        label: (item?.label?.trim() || DEFAULT_EVENT_FLOW_LABELS[i]) ?? DEFAULT_EVENT_FLOW_LABELS[i],
      });
    }
    setEventFlowItems(flowItems);
    setLogoUrl(payload.logo || "/logo.png");
    setHeroImageUrl(payload.hero ?? DEFAULT_HERO_IMAGE_PATH);
    setHeroImageMobileUrl(payload.heroMobile || null);
    setHeroImageLoadError(false);
    setFeatures(
      payload.features && payload.features.length > 0 ? payload.features : getStoredFeatures(),
    );
    setFeatureImageErrors(new Set());
    if (payload.paletteId) setPaletteId(payload.paletteId);
    setHomeCopy(mergeHomeCopy(payload.copy));
    if (payload.campaign2603Notice !== undefined) {
      setCampaign2603Notice(payload.campaign2603Notice ?? DEFAULT_CAMPAIGN2603_NOTICE);
    }
  }, [setPaletteId]);

  const togglePreviewFaq = useCallback((index: number) => {
    setPreviewOpenFaq((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const isCmPreview = useCmPreviewPage({
    slug: contentSlug,
    onDraft: applyPayloadToState,
    onScrollToId: (id) => {
      const m = /^faq-item-(\d+)-/.exec(id);
      if (m) {
        const index = Number(m[1]);
        setPreviewOpenFaq((prev) => new Set(prev).add(index));
      }
    },
  });

  useHomeDynamicLinks(homeRootRef, homeCopy, isCmPreview);

  // モバイル: スクロール量に応じて下部固定CTAの表示を切り替え（閾値: 200px）
  useEffect(() => {
    const threshold = 200;
    const onScroll = () => setShowStickyCta(window.scrollY > threshold);
    onScroll(); // 初期状態
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    if (isCmPreview) return;

    let cancelled = false;

    (async () => {
      const payload = contentSlug === TOP_SLUG
        ? await fetchContent()
        : await fetchContentBySlug(contentSlug);
      if (cancelled) return;

      if (payload) {
        applyPayloadToState(payload);
        return;
      }

      // フォールバック: localStorage（従来どおり）
      setNextEvents(getNextEvents(3));
      const stored = getStoredEventImages();
      const list = stored && stored.length > 0 ? stored : migrateOldImageFormat() || [];
      if (list.length > 0) {
        setEventImages(list.map((img) => img.url));
      }
      const flowItems: { url: string; label: string }[] = [];
      for (let i = 0; i < 3; i++) {
        const item = list[i];
        flowItems.push({
          url: item?.url || DEFAULT_EVENT_FLOW_IMAGE_PATHS[i],
          label: (item?.label?.trim() || DEFAULT_EVENT_FLOW_LABELS[i]) as string,
        });
      }
      setEventFlowItems(flowItems);
      const local = getContentFromLocalStorage();
      setLogoUrl(local.logo || "/logo.png");
      setHeroImageUrl(local.hero ?? DEFAULT_HERO_IMAGE_PATH);
      setHeroImageMobileUrl(local.heroMobile || null);
      setHeroImageLoadError(false);
      setFeatures(local.features && local.features.length > 0 ? local.features : getStoredFeatures());
      setFeatureImageErrors(new Set());
      setHomeCopy(getStoredHomeCopy());
    })();

    return () => {
      cancelled = true;
    };
  }, [contentSlug, isCmPreview, applyPayloadToState]);


  // /logo.png が存在しない場合（404）はデフォルトの SVG に切り替え
  const handleLogoError = () => setLogoUrl(null);

  // ヒーロー画像の読み込み失敗時: デフォルトのPNGの場合はWebPにフォールバック、それ以外は背景を外す
  const handleHeroImageError = () => {
    if (heroImageUrl === DEFAULT_HERO_IMAGE_PATH) {
      setHeroImageUrl(DEFAULT_HERO_IMAGE_PATH_WEBP);
      setHeroImageLoadError(false);
      return;
    }
    if (heroImageUrl === DEFAULT_HERO_IMAGE_PATH_WEBP) {
      setHeroImageLoadError(true);
      return;
    }
    if (heroImageMobileUrl === DEFAULT_HERO_IMAGE_PATH_MOBILE) {
      setHeroImageMobileUrl(DEFAULT_HERO_IMAGE_PATH_MOBILE_WEBP);
      setHeroImageLoadError(false);
      return;
    }
    if (heroImageMobileUrl === DEFAULT_HERO_IMAGE_PATH_MOBILE_WEBP) {
      setHeroImageLoadError(true);
      return;
    }
    setHeroImageLoadError(true);
  };

  // ヒーロー画像の preload: PC・モバイル共通1枚のため1リンクで LCP 短縮
  useEffect(() => {
    if (!heroImageUrl) return;
    const url = heroImageUrl ?? DEFAULT_HERO_IMAGE_PATH;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
    return () => link.remove();
  }, [heroImageUrl]);

  return (
    <div ref={homeRootRef} className="min-h-screen bg-white" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
      {homeCopy.fieldStyles && Object.keys(homeCopy.fieldStyles).length > 0 ? (
        <style
          data-cm-field-styles=""
          dangerouslySetInnerHTML={{ __html: buildFieldStylesStylesheet(homeCopy.fieldStyles) }}
        />
      ) : null}
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-transparent transition-all duration-300 pt-[env(safe-area-inset-top)]" id="nav">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center text-lp-text-heading no-underline" data-cm-id="brand-logo">
            {logoUrl ? (
              <img src={logoUrl} alt="ロゴ" className="h-6 w-auto object-contain" onError={handleLogoError} />
            ) : (
              <DefaultLogoIcon size="md" />
            )}
          </a>
          <div className="flex items-center gap-3">
            <a
              href={cmh("nav-header-cta")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackMetaPixelLead}
              data-cm-id="nav-header-cta"
              style={cms("nav-header-cta")}
              className="inline-flex items-center gap-1.5 px-5 h-10 bg-lp-primary text-white text-xs sm:text-sm font-medium rounded-full transition-colors hover:bg-lp-primary-hover whitespace-nowrap"
            >
              {homeCopy.nav.headerCta}
            </a>
          </div>
        </div>
      </nav>

      {/* モバイル用: スクロール時に表示する下部固定LINE登録CTA（CVR改善） */}
      <div
        className={`fixed left-0 right-0 z-40 md:hidden transition-all duration-300 ease-out ${
          showStickyCta ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ bottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="px-4 pt-3 pb-1">
          <a
            href={cmh("hero-sticky-cta")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMetaPixelLead}
            data-cm-id="hero-sticky-cta"
            style={cms("hero-sticky-cta")}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-lp-primary text-white rounded-full font-medium text-sm transition-all active:bg-lp-primary-hover shadow-[0_-2px_12px_rgba(92,61,46,0.15),0_4px_24px_rgba(0,0,0,0.12)]"
          >
            {lineSignupLabel}
            <img src="/line-logo.png" alt="" className="w-8 h-8 object-contain" loading="lazy" />
          </a>
        </div>
      </div>

      {/* Hero Section: モバイル=画像をアスペクト比ブロックにしテキストを常に画像上に。PC=従来の全面配置 */}
      <section ref={heroSectionRef} className="md:min-h-screen md:flex md:items-center md:justify-center relative overflow-hidden">
        {/* 背景レイヤー1: ベースのグラデーション（全画面・全デバイス） */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(160deg, color-mix(in srgb, var(--lp-bg-warm) 70%, white) 0%, color-mix(in srgb, var(--lp-accent-light) 25%, transparent) 40%, color-mix(in srgb, var(--lp-primary) 12%, var(--lp-bg-warm)) 85%, var(--lp-bg-warm) 100%)',
          }}
        />
        {/* ヒーロー画像ブロック: 固定アスペクトで CLS 防止。スケルトンで読み込み中を表示 */}
        <div className="relative w-full flex-shrink-0 aspect-[3/4] md:absolute md:inset-0 md:aspect-auto z-0" data-cm-id="hero-image">
          {/* スケルトン: 画像読み込み中は同じ領域を確保しレイアウトを安定させる */}
          {!heroImageLoaded && !heroImageLoadError && (
            <div
              className="absolute inset-0 z-0 bg-[color-mix(in_srgb,var(--lp-primary)_8%,var(--lp-bg-warm))] animate-pulse"
              aria-hidden
            />
          )}
          {/* 背景レイヤー2: ヒーロー画像（モバイル=ブロック内で object-cover / PC=全面） */}
          {heroImageUrl && !heroImageLoadError && (() => {
            const pcUrl = heroImageUrl ?? DEFAULT_HERO_IMAGE_PATH;
            const mobileUrl = heroImageMobileUrl || pcUrl;
            const pcWebp = getDefaultHeroWebpPath(pcUrl);
            const preferPng = pcUrl === DEFAULT_HERO_IMAGE_PATH || pcUrl === DEFAULT_HERO_IMAGE_PATH_MOBILE;
            return (
              <div className="absolute inset-0">
                <picture className="absolute inset-0 block w-full h-full">
                  <source media="(max-width: 768px)" srcSet={mobileUrl} />
                  {pcWebp && !preferPng && <source media="(min-width: 769px)" type="image/webp" srcSet={pcWebp} />}
                  <source media="(min-width: 769px)" srcSet={pcUrl} />
                  <img
                    src={pcUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-top md:object-center"
                    fetchPriority="high"
                    onError={handleHeroImageError}
                    onLoad={() => setHeroImageLoaded(true)}
                  />
                </picture>
              </div>
            );
          })()}
          {/* オーバーレイ: モバイル=テキスト用の暗さ＋下端グラデ / PC=従来 */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none md:[background:none]"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.1) 55%, transparent 55%, transparent 70%, rgba(255,255,255,0.4) 85%, white 100%)',
            }}
          />
          <div
            className="absolute inset-0 z-[1] pointer-events-none hidden md:block"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.1) 55%, color-mix(in srgb, var(--lp-bg-warm) 88%, transparent) 88%, var(--lp-bg-warm) 100%)',
            }}
          />
          {/* コンテンツ: 画像表示エリアの縦横中央に配置（モバイル・PC共通） */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-4 md:px-6">
            <div className="w-full max-w-2xl text-center">
              <h1
                className="lp-hero-title font-bold leading-[1.25] opacity-0 animate-fadeUp md:whitespace-nowrap text-[var(--lp-bg-warm)] [text-shadow:0_1px_3px_rgba(92,61,46,.6),0_2px_10px_rgba(0,0,0,.45),0_4px_20px_rgba(0,0,0,.35),0_6px_28px_rgba(0,0,0,.25)] mb-3 md:mb-8"
                style={{
                  animationDelay: '0.2s',
                  animationFillMode: 'forwards',
                  fontFamily: "'Shippori Mincho', serif",
                  fontSize: 'clamp(1.75rem, 8vw, 3.75rem)',
                }}
              >
                <HomeCm id="hero-title-line1" as="span" copy={homeCopy} cms={cms} className="inline min-[400px]:block md:inline">{homeCopy.hero.titleLine1}</HomeCm>
                <HomeCm id="hero-title-line2" as="span" copy={homeCopy} cms={cms}>{homeCopy.hero.titleLine2}</HomeCm>
              </h1>
              <HomeCm
                id="hero-subcopy"
                as="p"
                copy={homeCopy}
                cms={cms}
                className="text-sm md:text-lg leading-relaxed md:leading-loose opacity-0 animate-fadeUp text-[var(--lp-bg-warm)] whitespace-pre-line [text-shadow:0_1px_3px_rgba(92,61,46,.55),0_2px_8px_rgba(0,0,0,.4),0_18px_18px_rgba(0,0,0,.6)]"
                style={{
                  animationDelay: '0.4s',
                  animationFillMode: 'forwards',
                  ...MINCHO_STYLE,
                }}
              >
                {homeCopy.hero.subcopy}
              </HomeCm>
              <div className="mt-6 md:mt-8 opacity-0 animate-fadeUp w-full max-w-sm mx-auto" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                <a
                  href={cmh("hero-cta")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackMetaPixelLead}
                  data-cm-id="hero-cta"
                  style={cms("hero-cta")}
                  className="block w-full text-center py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5"
                >
                  {lineCtaLabel}
                  <img src="/line-logo.png" alt="LINE" className="inline-block w-9 h-9 ml-2 align-middle object-contain" loading="lazy" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-fadeIn hidden md:block" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="w-0.5 h-9 bg-lp-primary mx-auto opacity-50 animate-float"></div>
        </div>
      </section>

      {/* NEXT EVENT 次回のイベント詳細（ヒーロー直下・直近3イベントの手動カルーセル） */}
      <section id="next-event" className="py-16 px-4 md:px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-72 h-72 -top-20 -right-20 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-border) 35%, transparent) 0%, transparent 70%)' }} />
          <div className="absolute w-48 h-48 -bottom-10 -left-10 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-primary) 10%, transparent) 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-10 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <HomeCm id="next-event-eyebrow" as="p" copy={homeCopy} cms={cms} className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">{homeCopy.nextEvent.eyebrow}</HomeCm>
            <HomeCm id="next-event-heading" as="h2" copy={homeCopy} cms={cms} className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={MINCHO_STYLE}>
              {homeCopy.nextEvent.heading}
            </HomeCm>
          </div>
          {/* 直近3イベントの手動カルーセル（ボタン・ドット・横スワイプ対応）※モバイルはカード幅優先でボタンは重ねて表示 */}
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="relative px-2 md:px-14">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out touch-pan-y"
                  style={{ transform: `translateX(-${nextEventCarouselIndex * 100}%)` }}
                  onTouchStart={(e) => { nextEventCarouselTouchStartX.current = e.targetTouches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const start = nextEventCarouselTouchStartX.current;
                    if (start == null) return;
                    const end = e.changedTouches[0].clientX;
                    const diff = start - end;
                    const list = nextEvents.length > 0 ? nextEvents : [defaultEvents[0]];
                    if (list.length <= 1) return;
                    if (diff > 40) setNextEventCarouselIndex((i) => (i >= list.length - 1 ? 0 : i + 1));
                    else if (diff < -40) setNextEventCarouselIndex((i) => (i <= 0 ? list.length - 1 : i - 1));
                    nextEventCarouselTouchStartX.current = null;
                  }}
                >
                  {(nextEvents.length > 0 ? nextEvents : [defaultEvents[0]]).map((ev, idx) => (
                    <div key={ev.id || `carousel-${idx}`} className="flex-shrink-0 w-full min-w-0 px-1">
                    <div className="rounded-2xl border border-lp-border bg-lp-bg-warm/60 backdrop-blur-sm overflow-hidden">
                      <div className="p-6 md:p-8 space-y-6">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-lp-primary/15 text-lp-primary" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                            第{ev.eventNumber ?? idx + 1}回
                          </span>
                          {ev.eventNote?.trim() && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lp-border/40 text-lp-text-heading">
                              {ev.eventNote.trim()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-lp-border/60 flex items-center justify-center text-lp-primary">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          </span>
                          <div>
                            <p className="text-xs font-medium text-lp-primary uppercase tracking-wide mb-0.5">日時</p>
                            <p className="text-lp-text-heading font-medium" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                              {ev.dateLabel}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-lp-border/60 flex items-center justify-center text-lp-primary">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          </span>
                          <div>
                            <p className="text-xs font-medium text-lp-primary uppercase tracking-wide mb-0.5">場所</p>
                            <p className="text-lp-text-heading font-medium" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                              {ev.location}
                            </p>
                          </div>
                        </div>
                        {contentSlug === "campaign2603" && (() => {
                          const { title, body } = splitCampaign2603Notice(campaign2603Notice);
                          if (!title && !body) return null;
                          return (
                            <div className="rounded-xl bg-lp-primary/10 border border-lp-primary/30 p-4 text-sm text-lp-text-body leading-relaxed space-y-2">
                              {title && <p className="font-medium text-lp-primary">{title}</p>}
                              {body && (
                                <p className="whitespace-pre-line" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                                  {body}
                                </p>
                              )}
                            </div>
                          );
                        })()}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-lp-border/60">
                            <span className="text-2xl font-bold text-lp-primary tabular-nums" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                              {ev.companiesCount}
                            </span>
                            <div>
                              <p className="text-xs font-medium text-lp-text-body">参加企業数</p>
                              <p className="text-sm text-lp-text-heading font-medium">社</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-lp-border/60">
                            <span className="text-2xl font-bold text-lp-primary tabular-nums" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                              {ev.studentsCount}
                            </span>
                            <div>
                              <p className="text-xs font-medium text-lp-text-body">参加学生数</p>
                              <p className="text-sm text-lp-text-heading font-medium">名</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
              {/* 前へ・次へボタン（overflow-hidden の外に配置して見切れ防止） */}
              {(nextEvents.length > 0 ? nextEvents : [defaultEvents[0]]).length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setNextEventCarouselIndex((i) => (i <= 0 ? (nextEvents.length || 1) - 1 : i - 1))}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-11 h-11 rounded-full bg-white/95 border border-lp-border shadow-md flex items-center justify-center text-lp-primary hover:bg-lp-bg-warm transition-colors z-10"
                    aria-label="前のイベント"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNextEventCarouselIndex((i) => (i >= (nextEvents.length || 1) - 1 ? 0 : i + 1))}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-11 h-11 rounded-full bg-white/95 border border-lp-border shadow-md flex items-center justify-center text-lp-primary hover:bg-lp-bg-warm transition-colors z-10"
                    aria-label="次のイベント"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </>
              )}
            </div>
            {/* インジケーター（ドット） */}
              {(nextEvents.length > 0 ? nextEvents : [defaultEvents[0]]).length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {(nextEvents.length > 0 ? nextEvents : [defaultEvents[0]]).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNextEventCarouselIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${nextEventCarouselIndex === i ? 'bg-lp-primary' : 'bg-lp-border hover:bg-lp-primary/60'}`}
                      aria-label={`イベント${i + 1}を表示`}
                      aria-current={nextEventCarouselIndex === i ? 'true' : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-8 md:px-6">
        <div className="max-w-2xl mx-auto text-left md:text-center">
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
            <p className="text-lg md:text-2xl text-lp-text-heading leading-relaxed text-center whitespace-pre-line" style={cms("problem-lead", MINCHO_STYLE)} data-cm-id="problem-lead">
              {homeCopy.problem.lead}
            </p>
          </div>
          <div className="w-12 h-0.5 bg-lp-primary rounded mx-0 md:mx-auto my-9 opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}></div>
          <div className="mx-6 md:mx-0">
            <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }}>
              <p className="text-sm md:text-base text-lp-text-heading leading-loose max-w-xl mx-0 md:mx-auto whitespace-pre-line" style={cms("problem-p1", MINCHO_STYLE)} data-cm-id="problem-p1">
                {homeCopy.problem.paragraph1}
              </p>
            </div>
            <div className="w-12 h-0.5 bg-lp-primary rounded mx-0 md:mx-auto my-9 opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}></div>
            <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.36s', animationFillMode: 'forwards' }}>
              <p className="text-sm md:text-base text-lp-text-heading leading-loose max-w-xl mx-0 md:mx-auto whitespace-pre-line" style={cms("problem-p2", MINCHO_STYLE)} data-cm-id="problem-p2">
                {homeCopy.problem.paragraph2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-8 md:px-6 bg-lp-bg-warm">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2" data-cm-id="about-eyebrow" style={cms("about-eyebrow")}>{homeCopy.about.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight whitespace-pre-line" style={cms("about-heading", MINCHO_STYLE)} data-cm-id="about-heading">
              {homeCopy.about.heading}
            </h2>
          </div>
          <div className="mx-6 md:mx-0">
            <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
              <p className="text-sm md:text-base text-lp-text-heading leading-loose text-center mb-11 whitespace-pre-line" style={cms("about-body", MINCHO_STYLE)} data-cm-id="about-body">
                {homeCopy.about.body}
              </p>
            </div>
            <div className="mt-6 md:mt-8 w-full max-w-sm mx-auto hidden md:block">
              <a
                href={cmh("about-cta")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackMetaPixelLead}
                data-cm-id="about-cta"
                style={cms("about-cta")}
                className="block w-full text-center py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5"
              >
                {lineCtaLabel}
                <img src="/line-logo.png" alt="LINE" className="inline-block w-9 h-9 ml-2 align-middle object-contain" loading="lazy" />
              </a>
            </div>
            {eventImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 opacity-0 animate-fadeUp" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }} data-cm-id="about-images">
                {eventImages.map((url, i) => (
                  <div key={i} className="aspect-video bg-lp-bg-card rounded-lg overflow-hidden">
                    <img src={url} alt={`KANPAI就活イベントの様子${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-8 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2" data-cm-id="values-eyebrow" style={cms("values-eyebrow")}>{homeCopy.values.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={cms("values-heading", MINCHO_STYLE)} data-cm-id="values-heading">
              {homeCopy.values.heading}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {homeCopy.values.items.map((item, i) => (
              <CmArrayItem
                key={i}
                id={`values-card-${i}`}
                className="bg-white border border-lp-border rounded-3xl p-10 hover:shadow-lg hover:-translate-y-0.5 transition-all opacity-0 animate-fadeUp"
                style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}
              >
                <div className="flex flex-wrap gap-6">
                  <div className="text-4xl font-bold text-[#ffd7c3] shrink-0" style={{ fontFamily: "'Shippori Mincho', serif" }}>{String(i + 1).padStart(2, "0")}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-1" data-cm-id={`values-card-${i}-label`} style={cms(`values-card-${i}-label`)}>{item.label}</p>
                    <h3 className="text-xl font-bold text-lp-text-heading leading-tight md:mb-3" style={cms(`values-card-${i}-title`, MINCHO_STYLE)} data-cm-id={`values-card-${i}-title`}>{item.title}</h3>
                  </div>
                  <div className="w-full" data-cm-id={`values-card-${i}-body`}>
                    <p className="text-sm text-lp-text-heading leading-relaxed whitespace-pre-line hidden md:block" style={cms(`values-card-${i}-body`)}>{item.body}</p>
                    <p className="text-sm text-lp-text-heading leading-relaxed whitespace-pre-line md:hidden" style={cms(`values-card-${i}-body`)}>{item.body}</p>
                  </div>
                  {item.note ? (
                    <div
                      className="w-full mt-4 p-4 rounded-2xl"
                      data-cm-id={`values-card-${i}-note`}
                      style={cms(`values-card-${i}-note`, { background: 'linear-gradient(135deg, color-mix(in srgb, var(--lp-accent-light) 10%, transparent) 0%, color-mix(in srgb, var(--lp-bg-card) 20%, transparent) 100%)', borderLeft: '4px solid var(--lp-accent-light)' })}
                    >
                      <p className="text-sm text-lp-text-heading hidden md:block">{item.note}</p>
                      <p className="text-sm text-lp-text-heading md:hidden">{item.note}</p>
                    </div>
                  ) : null}
                </div>
              </CmArrayItem>
            ))}
          </div>
        </div>
      </section>

      {/* Event Flow Section */}
      <section className="py-24 px-8 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2" data-cm-id="event-flow-eyebrow" style={cms("event-flow-eyebrow")}>{homeCopy.eventFlow.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={cms("event-flow-heading", MINCHO_STYLE)} data-cm-id="event-flow-heading">
              {homeCopy.eventFlow.heading}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-lp-primary to-lp-accent-light"></div>
            {homeCopy.eventFlow.steps.map((item, i) => (
              <CmArrayItem
                key={i}
                id={`event-flow-step-${i}`}
                className="flex gap-6 mb-8 opacity-0 animate-fadeUp"
                style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-lp-primary flex items-center justify-center font-bold text-lp-text-heading relative z-10" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-lp-text-heading mb-1" style={cms(`event-flow-step-${i}-title`, MINCHO_STYLE)} data-cm-id={`event-flow-step-${i}-title`}>{item.title}</h3>
                  <p className="text-xs text-lp-primary font-medium mb-1" data-cm-id={`event-flow-step-${i}-time`} style={cms(`event-flow-step-${i}-time`)}>{item.time}</p>
                  <p className="text-sm text-lp-text-body leading-relaxed" data-cm-id={`event-flow-step-${i}-description`} style={cms(`event-flow-step-${i}-description`)}>{item.description}</p>
                </div>
              </CmArrayItem>
            ))}
          </div>

          {/* 当日の過ごし方イメージ（第1回・第7回・第13回）カルーセル：モバイルは全幅、PCはmax-w-6xl */}
          {eventFlowItems.length > 0 && (
            <div
              data-cm-id="event-flow-images"
              className="mt-14 overflow-hidden opacity-0 animate-fadeUp w-[100vw] max-w-[100vw] relative left-1/2 -translate-x-1/2 md:w-full md:max-w-none md:left-auto md:translate-x-0"
              style={{ animationDelay: '0.08s', animationFillMode: 'forwards' }}
            >
              <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                <div className="event-flow-track flex h-full absolute inset-0" style={{ width: '600%' }}>
                  {[...eventFlowItems, ...eventFlowItems].map((item, i) => (
                    <div
                      key={`${i}-${item.url}`}
                      className="flex-shrink-0 h-full flex flex-col"
                      style={{ width: '16.666%' }}
                    >
                      <div className="relative w-full h-full overflow-hidden bg-lp-bg-card" style={{ borderWidth: 0 }}>
                        <img
                          src={item.url}
                          alt={`KANPAI就活の様子 ${item.label}`}
                          className="event-flow-img-pan block w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 py-2 px-3 flex justify-end"
                          style={{
                            background: 'linear-gradient(to top, rgba(92,61,46,0.75) 0%, transparent 100%)',
                          }}
                        >
                          <span
                            className="text-xs font-medium text-white/95 tracking-wider"
                            style={{ fontFamily: "'Shippori Mincho', serif" }}
                          >
                            {item.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-10 w-full max-w-sm mx-auto hidden md:block">
            <a
              href={cmh("hero-cta")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackMetaPixelLead}
              className="block w-full text-center py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5"
            >
              {lineCtaLabel}
              <img src="/line-logo.png" alt="LINE" className="inline-block w-9 h-9 ml-2 align-middle object-contain" loading="lazy" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2" data-cm-id="features-intro-eyebrow" style={cms("features-intro-eyebrow")}>{homeCopy.featuresIntro.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight whitespace-pre-line" style={cms("features-intro-heading", MINCHO_STYLE)} data-cm-id="features-intro-heading">
              {homeCopy.featuresIntro.heading}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.length === 0 ? null : features.map((item, i) => {
              const hasImage = item.imageUrl != null && item.imageUrl.trim() !== "" && !featureImageErrors.has(i);
              return (
              <CmArrayItem key={i} id={`feature-${i}`} className="bg-white border border-lp-border rounded-3xl p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all opacity-0 animate-fadeUp overflow-hidden" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                {hasImage && (
                  <div className="-mx-8 -mt-8 mb-6 h-[180px] overflow-hidden bg-lp-bg-warm shadow-lg ring-1 ring-black/5 relative" data-cm-id={`feature-${i}-image`}>
                    <picture className="absolute inset-0 block w-full h-full">
                      {getDefaultFeatureWebpPath(item.imageUrl!) && (
                        <source type="image/webp" srcSet={getDefaultFeatureWebpPath(item.imageUrl!)!} />
                      )}
                      <img
                        src={item.imageUrl!}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={() => setFeatureImageErrors((prev) => new Set(prev).add(i))}
                      />
                    </picture>
                    {/* 画像下部をカードに自然になじむグラデーション */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(to bottom, transparent 30%, rgba(255,250,245,0.4) 70%, color-mix(in srgb, var(--lp-bg-warm) 85%, transparent) 100%)",
                      }}
                    />
                  </div>
                )}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-hover flex items-center justify-center text-white font-bold text-sm mb-4 shadow-md" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold text-lp-text-heading leading-tight mb-3" style={cms(`feature-${i}-title`, MINCHO_STYLE)} data-cm-id={`feature-${i}-title`}>{item.title}</h3>
                <p className="text-sm text-lp-text-heading leading-relaxed whitespace-pre-line" data-cm-id={`feature-${i}-body`} style={cms(`feature-${i}-body`)}>{item.body}</p>
              </CmArrayItem>
            );})}
          </div>
        </div>
      </section>

      {/* Voices Section */}
      <section className="py-24 px-6 bg-lp-bg-warm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2" data-cm-id="voices-eyebrow" style={cms("voices-eyebrow")}>{homeCopy.voices.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={cms("voices-heading", MINCHO_STYLE)} data-cm-id="voices-heading">
              {homeCopy.voices.heading}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {homeCopy.voices.items.map((item, i) => (
              <CmArrayItem key={i} id={`voices-card-${i}`} className="bg-white border border-lp-border rounded-2xl p-6 opacity-0 animate-fadeUp" style={{ animationDelay: `${(i % 3) * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                <p className="text-sm text-lp-text-muted leading-relaxed mb-4 border-l-3 border-lp-primary pl-4" style={cms(`voices-card-${i}-quote`, MINCHO_STYLE)} data-cm-id={`voices-card-${i}-quote`}>{item.quote}</p>
                <p className="text-xs text-lp-text-body font-medium" data-cm-id={`voices-card-${i}-attribution`} style={cms(`voices-card-${i}-attribution`)}>
                  {item.attribution}
                </p>
              </CmArrayItem>
            ))}
          </div>
          <div className="mt-10 w-full max-w-sm mx-auto hidden md:block">
            <a
              href={cmh("hero-cta")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackMetaPixelLead}
              className="block w-full text-center py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5"
            >
              {lineCtaLabel}
              <img src="/line-logo.png" alt="LINE" className="inline-block w-9 h-9 ml-2 align-middle object-contain" loading="lazy" />
            </a>
          </div>
        </div>
      </section>

      {/* Screening Section */}
      <section className="py-24 px-8 md:px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2" data-cm-id="screening-eyebrow" style={cms("screening-eyebrow")}>{homeCopy.screening.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight whitespace-pre-line" style={cms("screening-heading", MINCHO_STYLE)} data-cm-id="screening-heading">
              {homeCopy.screening.heading}
            </h2>
          </div>
          <div className="mx-6 md:mx-0">
            <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
              <p className="text-sm md:text-base text-lp-text-heading leading-loose text-left md:text-center mb-9 whitespace-pre-line" data-cm-id="screening-intro" style={cms("screening-intro")}>
                {homeCopy.screening.intro}
              </p>
            </div>
            <div className="space-y-3 mb-9">
            {homeCopy.screening.criteria.map((item, i) => (
              <CmArrayItem key={i} id={`screening-criterion-${i}`} className="flex items-start gap-3 p-4 bg-white border border-lp-border rounded-2xl opacity-0 animate-fadeUp" style={{ animationDelay: `${0.12 + i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-lp-bg-warm flex items-center justify-center text-lp-primary mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 4L6 11L3 8"/>
                  </svg>
                </div>
                <p className="text-sm text-lp-text-heading pt-0.5" data-cm-id={`screening-criterion-${i}`} style={cms(`screening-criterion-${i}`)}>{item}</p>
              </CmArrayItem>
            ))}
            </div>
            <div className="p-6 bg-lp-bg-warm rounded-2xl text-center opacity-0 animate-fadeUp" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }} data-cm-id="screening-trust">
              <p className="text-sm text-lp-text-heading whitespace-pre-line" style={cms("screening-trust")}>
                {homeCopy.screening.trustNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Overview Section */}
      <section className="py-24 px-6 bg-lp-bg-warm">
        <div className="max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold text-lp-text-heading text-center mb-2" style={cms("safety-heading", MINCHO_STYLE)} data-cm-id="safety-heading">{homeCopy.safety.heading}</h3>
            <p className="text-xs text-lp-primary text-center mb-5" data-cm-id="safety-subheading" style={cms("safety-subheading")}>{homeCopy.safety.subheading}</p>
            <div className="space-y-3">
              {homeCopy.safety.items.map((item, i) => (
                <CmArrayItem key={i} id={`safety-item-${i}`} className="flex gap-3 p-4 bg-white border border-lp-border rounded-2xl opacity-0 animate-fadeUp" style={{ animationDelay: `${0.6 + i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-lp-bg-warm flex items-center justify-center text-lp-primary">
                    {i === 0 && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 2h6v4l2 2v14H7V8l2-2V2z"/>
                      </svg>
                    )}
                    {i === 1 && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                      </svg>
                    )}
                    {i === 2 && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-lp-text-heading mb-0.5" data-cm-id={`safety-item-${i}-title`} style={cms(`safety-item-${i}-title`)}>{item.title}</p>
                    <p className="text-xs text-lp-text-body leading-relaxed" data-cm-id={`safety-item-${i}-description`} style={cms(`safety-item-${i}-description`)}>{item.description}</p>
                  </div>
                </CmArrayItem>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2" data-cm-id="faq-eyebrow" style={cms("faq-eyebrow")}>{homeCopy.faq.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={cms("faq-heading", MINCHO_STYLE)} data-cm-id="faq-heading">
              {homeCopy.faq.heading}
            </h2>
          </div>
          <div className="space-y-0 opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
            {homeCopy.faq.items.map((item, i) => {
              if (contentSlug !== "campaign2603" && item.question === CAMPAIGN2603_FAQ_QUESTION) {
                return null;
              }
              const faqOpen = previewOpenFaq.has(i);
              const faqToggleBtn = (
                <button
                  type="button"
                  data-faq-toggle
                  aria-expanded={faqOpen}
                  aria-label={faqOpen ? "回答を閉じる" : "回答を開く"}
                  onClick={() => togglePreviewFaq(i)}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-lp-bg-warm flex items-center justify-center transition-colors cursor-pointer hover:bg-lp-border"
                >
                  <svg
                    className={`w-4 h-4 text-lp-primary transition-transform ${faqOpen ? "rotate-45" : ""}`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3v10M3 8h10"/>
                  </svg>
                </button>
              );

              if (isCmPreview) {
                return (
                  <CmArrayItem key={i} id={`faq-item-${i}`} className="border-b border-lp-border">
                    <div className="flex items-center justify-between gap-3 py-5">
                      <span
                        className="flex-1 min-w-0 text-left text-lp-text-heading font-medium text-sm"
                        data-cm-id={`faq-item-${i}-question`}
                        style={cms(`faq-item-${i}-question`)}
                      >
                        {item.question}
                      </span>
                      {faqToggleBtn}
                    </div>
                    {faqOpen && (
                      <div
                        className="pb-5 text-sm text-lp-text-body leading-relaxed"
                        data-cm-id={`faq-item-${i}-answer`}
                        style={cms(`faq-item-${i}-answer`)}
                      >
                        {item.answer}
                      </div>
                    )}
                  </CmArrayItem>
                );
              }

              return (
              <CmArrayItem key={i} id={`faq-item-${i}`} className="border-b border-lp-border">
              <details className="group">
                <summary className="py-5 cursor-pointer flex items-center justify-between gap-3 text-lp-text-heading font-medium text-sm hover:text-lp-primary transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-lp-bg-warm flex items-center justify-center group-open:bg-lp-border transition-colors pointer-events-none">
                    <svg
                      className="w-4 h-4 text-lp-primary group-open:rotate-45 transition-transform"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 3v10M3 8h10"/>
                    </svg>
                  </span>
                </summary>
                <div
                  className="pb-5 text-sm text-lp-text-body leading-relaxed"
                  data-cm-id={`faq-item-${i}-answer`}
                  style={cms(`faq-item-${i}-answer`)}
                >
                  {item.answer}
                </div>
              </details>
              </CmArrayItem>
            );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="apply" className="py-28 px-8 md:px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--lp-cta-start) 0%, var(--lp-cta-mid) 50%, var(--lp-cta-end) 100%)' }}>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="mx-6 md:mx-0">
            <div className="opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
              <h2 className="text-4xl md:text-5xl font-bold text-lp-text-heading mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                <span className="whitespace-nowrap" data-cm-id="final-cta-line1" style={cms("final-cta-line1")}>{homeCopy.finalCta.headingLine1}</span>{" "}
                <span className="whitespace-nowrap" data-cm-id="final-cta-line2" style={cms("final-cta-line2")}>{homeCopy.finalCta.headingLine2}</span>
              </h2>
            </div>
            <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }} data-cm-id="final-cta-body">
              <p className="text-sm md:text-base text-lp-text-body mb-9 leading-loose text-left md:text-center whitespace-pre-line" style={cms("final-cta-body", MINCHO_STYLE)}>
                {homeCopy.finalCta.body}
              </p>
            </div>
            <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }}>
              <a
                href={cmh("hero-cta")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackMetaPixelLead}
                data-cm-id="hero-cta"
                style={cms("hero-cta")}
                className="inline-flex items-center justify-center gap-2 px-12 py-4 bg-lp-primary text-white rounded-full font-medium text-xs sm:text-sm md:text-base whitespace-nowrap transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5 mb-4"
              >
                {lineCtaLabel}
                <img src="/line-logo.png" alt="LINE" className="w-7 h-7 object-contain" loading="lazy" />
              </a>
              <p className="text-xs text-lp-primary font-medium tracking-wide" data-cm-id="final-cta-note" style={cms("final-cta-note")}>
                {homeCopy.cta.footerNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 次回イベント詳細 */}
      <section id="event-detail" className="py-24 px-6 bg-white relative overflow-hidden" data-cm-id="event-detail">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-72 h-72 -top-20 -right-20 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-border) 35%, transparent) 0%, transparent 70%)' }} />
          <div className="absolute w-48 h-48 -bottom-10 -left-10 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-primary) 10%, transparent) 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">{homeCopy.nextEvent.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              {homeCopy.nextEvent.heading}
            </h2>
          </div>
          <div className="space-y-6 opacity-0 animate-fadeUp" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            {(nextEvents.length > 0 ? nextEvents : [defaultEvents[0]]).map((ev, idx) => (
              <div key={ev.id || `default-${idx}`} className="rounded-2xl border border-lp-border bg-lp-bg-warm/60 backdrop-blur-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-lp-primary/15 text-lp-primary" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                      第{ev.eventNumber ?? idx + 1}回
                    </span>
                    {ev.eventNote?.trim() && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lp-border/40 text-lp-text-heading">
                        {ev.eventNote.trim()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-lp-border/60 flex items-center justify-center text-lp-primary">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </span>
                    <div>
                      <p className="text-xs font-medium text-lp-primary uppercase tracking-wide mb-0.5">日時</p>
                      <p className="text-lp-text-heading font-medium" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                        {ev.dateLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-lp-border/60 flex items-center justify-center text-lp-primary">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                    <div>
                      <p className="text-xs font-medium text-lp-primary uppercase tracking-wide mb-0.5">場所</p>
                      <p className="text-lp-text-heading font-medium" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                        {ev.location}
                      </p>
                    </div>
                  </div>
                  {contentSlug === "campaign2603" && (() => {
                    const { title, body } = splitCampaign2603Notice(campaign2603Notice);
                    if (!title && !body) return null;
                    return (
                      <div className="rounded-xl bg-lp-primary/10 border border-lp-primary/30 p-4 text-sm text-lp-text-body leading-relaxed space-y-2" data-cm-id="campaign2603-notice">
                        {title && <p className="font-medium text-lp-primary">{title}</p>}
                        {body && (
                          <p className="whitespace-pre-line" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                            {body}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-lp-border/60">
                      <span className="text-2xl font-bold text-lp-primary tabular-nums" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                        {ev.companiesCount}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-lp-text-body">参加企業数</p>
                        <p className="text-sm text-lp-text-heading font-medium">社</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-lp-border/60">
                      <span className="text-2xl font-bold text-lp-primary tabular-nums" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                        {ev.studentsCount}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-lp-text-body">参加学生数</p>
                        <p className="text-sm text-lp-text-heading font-medium">名</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <a
                href={cmh("hero-sticky-cta")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackMetaPixelLead}
                className="block w-full text-center py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5"
              >
                {lineSignupLabel}
                <img src="/line-logo.png" alt="LINE" className="inline-block w-9 h-9 ml-2 align-middle object-contain" loading="lazy" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-11 px-6 border-t border-lp-border bg-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center text-lp-text-heading" data-cm-id="brand-logo">
            {logoUrl ? (
              <img src={logoUrl} alt="ロゴ" className="h-5 w-auto object-contain" loading="lazy" onError={handleLogoError} />
            ) : (
              <DefaultLogoIcon size="sm" />
            )}
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-lp-text-heading whitespace-pre-line" data-cm-id="footer-company" style={cms("footer-company")}>
              {homeCopy.footer.companyNote}
            </p>
          </div>
          <p className="text-xs text-lp-text-body opacity-50">
            &copy; {currentYear} Work As Life, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
