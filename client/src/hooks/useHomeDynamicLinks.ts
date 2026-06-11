import { useLayoutEffect, type RefObject } from "react";
import type { HomeCopy } from "@/types/home-copy";

/**
 * fieldStyles.href が設定された Home LP 要素のテキストをクリック可能にする。
 * プレビュー編集モードでは要素選択を優先するため無効。
 */
export function useHomeDynamicLinks(
  rootRef: RefObject<HTMLElement | null>,
  copy: HomeCopy,
  disabled: boolean,
): void {
  useLayoutEffect(() => {
    if (disabled) return;
    const root = rootRef.current;
    if (!root) return;

    const linked: { host: HTMLElement; anchor: HTMLAnchorElement }[] = [];

    for (const [id, style] of Object.entries(copy.fieldStyles ?? {})) {
      const href = style.href?.trim();
      if (!href) continue;

      root.querySelectorAll(`[data-cm-id="${CSS.escape(id)}"]`).forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "A") return;
        if (node.querySelector(":scope > a[data-cm-dynamic-link]")) return;

        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.dataset.cmDynamicLink = "1";
        while (node.firstChild) anchor.appendChild(node.firstChild);
        node.appendChild(anchor);
        linked.push({ host: node, anchor });
      });
    }

    return () => {
      for (const { host, anchor } of linked) {
        while (anchor.firstChild) host.insertBefore(anchor.firstChild, anchor);
        anchor.remove();
      }
    };
  }, [copy.fieldStyles, disabled, rootRef]);
}
