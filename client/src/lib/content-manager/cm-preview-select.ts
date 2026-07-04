/** プレビュー画面でクリック選択可能な要素のセレクタ */
export const CM_PREVIEW_SELECTABLE_SELECTOR = [
  "[data-cm-id]",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "a[href]",
  "button",
  "summary",
  "details",
  "img",
  "section",
  "header",
  "footer",
  "nav",
  "article",
  "blockquote",
  "li",
  "figure",
  "figcaption",
  "label",
  "table",
  "tr",
  "td",
  "th",
].join(", ");

const SKIP_ANCESTOR_SELECTOR = "svg, script, style, noscript, [aria-hidden='true']";

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

function buildElementPath(el: HTMLElement): string {
  const parts: string[] = [];
  let node: HTMLElement | null = el;

  while (node && node !== document.body) {
    const cmId = node.getAttribute("data-cm-id");
    if (cmId) {
      parts.unshift(cmId);
      break;
    }
    if (node.id) {
      parts.unshift(`#${node.id}`);
      break;
    }
    const tag = node.tagName.toLowerCase();
    const parentEl: HTMLElement | null = node.parentElement;
    let index = 0;
    if (parentEl) {
      const siblings = Array.from(parentEl.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement && child.tagName === node!.tagName,
      );
      index = siblings.indexOf(node);
    }
    parts.unshift(`${tag}:${index}`);
    node = parentEl;
  }

  return parts.join("/");
}

/** CTAボタン内ラベル（親 a と一体で編集する span） */
export const CM_CTA_BUTTON_LABEL_SELECTOR =
  '[data-cm-id$="-cta-label"], [data-cm-id$="-cta-label-mobile"]';

/** 内側ラベルを持つ CTA ボタン（編集プレビューで親 a を選択単位とする） */
export const CM_CTA_BUTTON_ANCHOR_SELECTOR = `a[href]:has(${CM_CTA_BUTTON_LABEL_SELECTOR})`;

/** プレビューで要素選択の対象外（UI 操作用） */
export const CM_PREVIEW_IGNORE_SELECT_SELECTOR = "[data-faq-toggle], [data-cm-no-select]";

function isCtaButtonLabelId(id: string): boolean {
  return /-cta-label(?:-mobile)?$/.test(id);
}

function isCtaButtonLabelElement(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  const id = el.getAttribute("data-cm-id");
  return id != null && isCtaButtonLabelId(id);
}

function getCtaButtonLabelElements(anchor: HTMLAnchorElement): HTMLElement[] {
  return [...anchor.querySelectorAll("[data-cm-id]")].filter(isCtaButtonLabelElement);
}

function resolveCtaButtonAnchor(start: HTMLElement): HTMLAnchorElement | null {
  const anchor = start.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (!anchor.contains(start)) return null;
  return getCtaButtonLabelElements(anchor).length > 0 ? anchor : null;
}

function resolveCtaButtonFieldId(anchor: HTMLAnchorElement, start: HTMLElement): string {
  const labels = getCtaButtonLabelElements(anchor);
  for (const label of labels) {
    if (label === start || label.contains(start)) {
      return label.getAttribute("data-cm-id")!;
    }
  }
  if (labels.length === 1) {
    return labels[0].getAttribute("data-cm-id")!;
  }
  const visible = labels.find((el) => {
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
  return (visible ?? labels[0]).getAttribute("data-cm-id")!;
}

export function normalizeClickStart(raw: EventTarget | null): HTMLElement | null {
  if (!(raw instanceof Element)) return null;
  if (raw.closest(CM_PREVIEW_IGNORE_SELECT_SELECTOR)) return null;

  let start: Element | null = raw;
  if (start instanceof SVGElement || start.closest(SKIP_ANCESTOR_SELECTOR) === start) {
    start =
      start.closest("button, a[href], [data-cm-id], [data-cm-array-id], summary, label") ??
      start.parentElement;
  }

  return start instanceof HTMLElement ? start : null;
}

/** プレビューで開閉トグルとして扱う（選択ハンドラを通さない） */
export function isAccordionToggleTarget(raw: EventTarget | null): boolean {
  if (!(raw instanceof Element)) return false;
  return raw.closest(CM_PREVIEW_IGNORE_SELECT_SELECTOR) != null;
}

/** 折りたたみ内の要素へスクロールする前に親を開く */
export function openAccordionHostForElement(el: Element): void {
  const details = el.closest("details");
  if (details instanceof HTMLDetailsElement) {
    details.open = true;
  }
}

export function resolveClickTarget(raw: EventTarget | null): HTMLElement | null {
  const start = normalizeClickStart(raw);
  if (!start) return null;

  // CTAボタン: 内側 span ではなく親 a を編集単位とする
  const ctaAnchor = resolveCtaButtonAnchor(start);
  if (ctaAnchor) return ctaAnchor;

  // 文言フィールド（data-cm-id）を最優先
  let el: HTMLElement | null = start;
  while (el && el !== document.documentElement) {
    if (el.hasAttribute("data-cm-id")) return el;
    el = el.parentElement;
  }

  // 配列項目全体（data-cm-array-id）
  el = start;
  while (el && el !== document.documentElement) {
    if (el.hasAttribute("data-cm-array-id")) return el;
    el = el.parentElement;
  }

  // 未タグ付けの要素はセマンティックタグで選択
  el = start;
  while (el && el !== document.documentElement) {
    if (el.matches(CM_PREVIEW_SELECTABLE_SELECTOR)) return el;
    el = el.parentElement;
  }

  return null;
}

export function getSelectableKind(
  el: HTMLElement,
  clickStart?: HTMLElement | null,
): "field" | "array" | "auto" {
  if (el.hasAttribute("data-cm-array-id")) return "array";
  if (el.hasAttribute("data-cm-id")) return "field";
  if (el instanceof HTMLAnchorElement && clickStart && getCtaButtonLabelElements(el).length > 0) {
    return "field";
  }
  return "auto";
}

export function getSelectableId(el: HTMLElement, clickStart?: HTMLElement | null): string {
  if (el.hasAttribute("data-cm-array-id")) {
    return el.getAttribute("data-cm-array-id")!;
  }
  if (el instanceof HTMLAnchorElement && clickStart) {
    const labels = getCtaButtonLabelElements(el);
    if (labels.length > 0) {
      return resolveCtaButtonFieldId(el, clickStart);
    }
  }
  const cmId = el.getAttribute("data-cm-id");
  if (cmId) return cmId;
  return `auto:${buildElementPath(el)}`;
}

export function getSelectableLabel(el: HTMLElement): string {
  const arrayLabel = el.getAttribute("data-cm-array-label");
  if (arrayLabel?.trim()) return arrayLabel.trim();

  const explicit = el.getAttribute("data-cm-label");
  if (explicit?.trim()) return explicit.trim();

  const text = el.innerText?.replace(/\s+/g, " ").trim();
  if (text) return truncate(text, 48);

  const tag = el.tagName.toLowerCase();
  if (tag === "img") return "画像";
  return tag.toUpperCase();
}

export function isAutoSelectableId(id: string): boolean {
  return id.startsWith("auto:");
}
