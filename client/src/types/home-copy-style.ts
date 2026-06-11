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

export function fieldStyleToCss(style?: TextFieldStyle): CSSProperties {
  if (!style) return {};
  const out: CSSProperties = {};
  if (style.fontSize?.trim()) out.fontSize = style.fontSize.trim();
  if (style.color?.trim()) out.color = style.color.trim();
  if (style.fontFamily?.trim()) out.fontFamily = style.fontFamily.trim();
  if (style.backgroundColor?.trim()) out.backgroundColor = style.backgroundColor.trim();
  return out;
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
