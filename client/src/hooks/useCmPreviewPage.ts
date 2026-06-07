import { useEffect, useRef } from "react";
import {
  isCmPreviewMessage,
  isCmPreviewMode,
  postToCmParent,
  type CmPreviewMessage,
} from "@/lib/content-manager/cm-preview";
import {
  CM_PREVIEW_SELECTABLE_SELECTOR,
  getSelectableId,
  getSelectableLabel,
  isAccordionToggleTarget,
  openAccordionHostForElement,
  resolveClickTarget,
} from "@/lib/content-manager/cm-preview-select";
import type { ContentPayload } from "@/types/content-payload";

type Options = {
  slug: string;
  onDraft?: (payload: ContentPayload) => void;
  /** cm-scroll-to 受信時（FAQ 開閉などページ側の同期用） */
  onScrollToId?: (id: string) => void;
};

/** LP ページ側: cmPreview=1 時の要素選択・draft 受信 */
export function useCmPreviewPage({ slug, onDraft, onScrollToId }: Options): boolean {
  const isPreview = isCmPreviewMode();
  const onDraftRef = useRef(onDraft);
  onDraftRef.current = onDraft;
  const onScrollToIdRef = useRef(onScrollToId);
  onScrollToIdRef.current = onScrollToId;

  useEffect(() => {
    if (!isPreview) return;

    const style = document.createElement("style");
    style.setAttribute("data-cm-preview", "1");
    style.textContent = `
      ${CM_PREVIEW_SELECTABLE_SELECTOR} {
        cursor: pointer !important;
        outline: 2px solid transparent;
        outline-offset: 2px;
        transition: outline-color 0.15s ease;
      }
      ${CM_PREVIEW_SELECTABLE_SELECTOR}:hover {
        outline-color: rgba(212, 132, 75, 0.55) !important;
      }
      [data-cm-active="1"] {
        outline-color: #d4844b !important;
        outline-width: 2px !important;
      }
      [data-faq-toggle], [data-cm-no-select] {
        cursor: pointer !important;
        outline: none !important;
      }
    `;
    document.head.appendChild(style);

    const handleClick = (e: MouseEvent) => {
      // FAQ 開閉ボタンなど UI 操作は選択処理を通さない（React onClick を妨げない）
      if (isAccordionToggleTarget(e.target)) return;

      const target = resolveClickTarget(e.target);
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const id = getSelectableId(target);
      const label = getSelectableLabel(target);
      document.querySelectorAll("[data-cm-active]").forEach((el) => {
        el.removeAttribute("data-cm-active");
      });
      target.setAttribute("data-cm-active", "1");
      postToCmParent({ type: "cm-select", id, label });
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isCmPreviewMessage(event.data)) return;
      const msg = event.data as CmPreviewMessage;
      if (msg.type === "cm-draft" && msg.slug === slug) {
        onDraftRef.current?.(msg.payload);
      }
      if (msg.type === "cm-scroll-to") {
        onScrollToIdRef.current?.(msg.id);
        const el = document.querySelector(`[data-cm-id="${msg.id}"]`);
        if (el) {
          openAccordionHostForElement(el);
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("message", handleMessage);
    postToCmParent({ type: "cm-ready" });

    return () => {
      style.remove();
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("message", handleMessage);
    };
  }, [isPreview, slug]);

  return isPreview;
}
