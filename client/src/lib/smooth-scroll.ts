/** easeOutCubic: 終わりに減速する自然なスクロール */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export type ScrollToAnchorOptions = {
  /** 画面上端からの余白（固定ヘッダー分など） */
  offset?: number;
  /** アニメーション時間（ms）。短いほど「高速」 */
  duration?: number;
};

/**
 * 指定 Y 座標へイージング付きでスクロールする。
 */
export function animateScrollTo(top: number, duration = 600): void {
  const startY = window.scrollY;
  const distance = top - startY;
  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/**
 * ページ内アンカー（#id）へスムーズスクロール。成功時 true。
 */
export function scrollToAnchor(href: string, options: ScrollToAnchorOptions = {}): boolean {
  if (!href.startsWith("#") || href === "#") return false;

  const el = document.querySelector(href);
  if (!el) return false;

  const offset = options.offset ?? 0;
  const duration = options.duration ?? 600;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  animateScrollTo(top, duration);
  return true;
}
