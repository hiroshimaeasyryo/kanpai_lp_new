import type { CSSProperties } from "react";
import type { HomeCopy } from "@/types/home-copy";
import { fieldStyleToCss } from "@/types/home-copy-style";

export const MINCHO_STYLE: CSSProperties = {
  fontFamily: "'Shippori Mincho', serif",
};

export function createHomeCopyStyleHelpers(copy: HomeCopy, defaultLineHref: string) {
  const cms = (id: string, base?: CSSProperties): CSSProperties => ({
    ...base,
    ...fieldStyleToCss(copy.fieldStyles?.[id]),
  });
  const cmh = (id: string, fallback = defaultLineHref) =>
    copy.fieldStyles?.[id]?.href?.trim() || fallback;
  return { cms, cmh };
}
