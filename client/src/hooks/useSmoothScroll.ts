import { useEffect, type RefObject } from "react";
import { scrollToAnchor, type ScrollToAnchorOptions } from "@/lib/smooth-scroll";

export type UseSmoothScrollOptions = ScrollToAnchorOptions & {
  /** 指定時はこの要素内の # リンクのみ処理 */
  containerRef?: RefObject<HTMLElement | null>;
};

/**
 * ページ内 # リンククリックをインターセプトし、高速イージングスクロールで遷移する。
 */
export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const { containerRef, offset = 0, duration = 600 } = options;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      if (containerRef?.current && !containerRef.current.contains(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      e.preventDefault();
      scrollToAnchor(href, { offset, duration });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [containerRef, offset, duration]);
}
