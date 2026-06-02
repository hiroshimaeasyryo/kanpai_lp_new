import { useEffect } from "react";

/**
 * ページ単位で noindex を付与する（クライアントサイド）。
 * NOTE: これは「検索エンジンへの指示」であり、秘匿や認可の代替にはならない。
 */
export function useNoIndex(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const metaName = "robots";
    const existing = document.querySelector<HTMLMetaElement>(
      `meta[name="${metaName}"]`,
    );
    const meta = existing ?? document.createElement("meta");
    meta.setAttribute("name", metaName);

    const content = "noindex, nofollow, noarchive";
    meta.setAttribute("content", content);

    if (!existing) {
      document.head.appendChild(meta);
    }
  }, [enabled]);
}

