import type { CSSProperties } from "react";

/** 要素ID（data-cm-id）ごとの装飾（テキスト・背景など） */
export type TextFieldStyle = {
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  /** リンク要素向け。空ならLP既定の遷移先を使用 */
  href?: string;
  /** 背景色。空ならLP既定のCSSを使用 */
  backgroundColor?: string;
};

export type HomeCopyFieldStyles = Record<string, TextFieldStyle>;

export const FONT_FAMILY_OPTIONS = [
  { value: "", label: "デフォルト（LP設定）" },
  { value: "'Shippori Mincho', serif", label: "しっぽり明朝" },
  { value: "'Zen Kaku Gothic New', sans-serif", label: "ゼン角ゴシック New" },
] as const;

export const TEXT_SIZE_MIN_PX = 5;
export const TEXT_SIZE_MAX_PX = 50;
/** 未設定時のスライダー表示位置（LP既定サイズはそのまま） */
export const TEXT_SIZE_SLIDER_DEFAULT_PX = 16;

export function parseFontSizePx(fontSize?: string): number | null {
  if (!fontSize?.trim()) return null;
  const match = fontSize.trim().match(/^(\d+(?:\.\d+)?)\s*px$/i);
  if (!match) return null;
  const n = Math.round(Number(match[1]));
  if (!Number.isFinite(n)) return null;
  return Math.min(TEXT_SIZE_MAX_PX, Math.max(TEXT_SIZE_MIN_PX, n));
}

export function formatFontSizePx(px: number): string {
  const clamped = Math.min(TEXT_SIZE_MAX_PX, Math.max(TEXT_SIZE_MIN_PX, Math.round(px)));
  return `${clamped}px`;
}

function cssImportant(value: string): string {
  return value.includes("!important") ? value : `${value} !important`;
}

function escapeCssIdent(id: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(id);
  }
  return id.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** インライン style 用（React は !important 非対応のためプレーン値のみ） */
export function fieldStyleToCss(style?: TextFieldStyle): CSSProperties {
  if (!style) return {};
  const out: CSSProperties = {};
  if (style.fontSize?.trim()) out.fontSize = style.fontSize.trim();
  if (style.color?.trim()) out.color = style.color.trim();
  if (style.fontFamily?.trim()) out.fontFamily = style.fontFamily.trim();
  if (style.backgroundColor?.trim()) {
    const bg = style.backgroundColor.trim();
    out.background = bg;
    out.backgroundColor = bg;
    out.backgroundImage = "none";
  }
  return out;
}

/**
 * fieldStyles を [data-cm-id] 向け CSS に変換。
 * LP 専用 CSS（#page .class 等）より確実に優先するため !important を付与する。
 * scopeSelector に `#self-stance-page` 等を渡すと詳細度を上げられる。
 */
export function buildFieldStylesStylesheet(
  fieldStyles?: HomeCopyFieldStyles,
  scopeSelector?: string,
): string {
  if (!fieldStyles) return "";
  const prefix = scopeSelector?.trim() ? `${scopeSelector.trim()} ` : "";
  const rules: string[] = [];
  for (const [id, style] of Object.entries(fieldStyles)) {
    const decls: string[] = [];
    const inheritDecls: string[] = [];
    if (style.fontSize?.trim()) {
      const v = cssImportant(style.fontSize.trim());
      decls.push(`font-size: ${v}`);
      inheritDecls.push("font-size: inherit !important");
    }
    if (style.color?.trim()) {
      const v = cssImportant(style.color.trim());
      decls.push(`color: ${v}`);
      inheritDecls.push("color: inherit !important");
    }
    if (style.fontFamily?.trim()) {
      const v = cssImportant(style.fontFamily.trim());
      decls.push(`font-family: ${v}`);
      inheritDecls.push("font-family: inherit !important");
    }
    if (style.backgroundColor?.trim()) {
      const bg = cssImportant(style.backgroundColor.trim());
      decls.push(`background: ${bg}`);
      decls.push(`background-color: ${bg}`);
      decls.push("background-image: none !important");
    }
    if (decls.length === 0) continue;
    const sel = `${prefix}[data-cm-id="${escapeCssIdent(id)}"]`;
    rules.push(`${sel}{${decls.join(";")}}`);
    if (inheritDecls.length > 0) {
      rules.push(`${sel} *{${inheritDecls.join(";")}}`);
    }
  }
  return rules.join("\n");
}

export function mergeFieldStyles(
  base?: HomeCopyFieldStyles,
  patch?: HomeCopyFieldStyles,
): HomeCopyFieldStyles {
  if (!patch) return base ?? {};
  const next = { ...(base ?? {}) };
  for (const [id, partial] of Object.entries(patch)) {
    next[id] = { ...next[id], ...partial };
  }
  return next;
}

export function patchFieldStyle(
  styles: HomeCopyFieldStyles | undefined,
  sectionId: string,
  partial: Partial<TextFieldStyle>,
): HomeCopyFieldStyles {
  return {
    ...(styles ?? {}),
    [sectionId]: { ...(styles?.[sectionId] ?? {}), ...partial },
  };
}

/**
 * LP 共通: fieldStyles をマージする。
 * mergeDeep はデフォルト seed に無いキーを破棄するため、動的マップは個別に扱う。
 */
export function mergeLpFieldStylesFromRaw(
  raw: unknown,
  base?: HomeCopyFieldStyles,
): HomeCopyFieldStyles | undefined {
  if (!raw || typeof raw !== "object") return base;
  const out: HomeCopyFieldStyles = { ...(base ?? {}) };
  for (const [id, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!val || typeof val !== "object") continue;
    const o = val as Record<string, unknown>;
    const prev: TextFieldStyle = out[id] ?? {};
    out[id] = {
      fontSize: typeof o.fontSize === "string" ? o.fontSize : prev.fontSize,
      color: typeof o.color === "string" ? o.color : prev.color,
      fontFamily: typeof o.fontFamily === "string" ? o.fontFamily : prev.fontFamily,
      href: typeof o.href === "string" ? o.href : prev.href,
      backgroundColor:
        typeof o.backgroundColor === "string" ? o.backgroundColor : prev.backgroundColor,
    };
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
