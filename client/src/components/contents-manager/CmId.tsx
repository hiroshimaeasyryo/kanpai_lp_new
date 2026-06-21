import {
  createContext,
  useContext,
  useLayoutEffect,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import {
  buildFieldStylesStylesheet,
  fieldStyleToCss,
  type HomeCopyFieldStyles,
} from "@/types/home-copy-style";

/**
 * data-cm-id ごとの装飾（fieldStyles）をページ全体に供給するコンテキスト。
 * LP/構造化ページ側で <FieldStylesProvider value={content.fieldStyles}> で包むと、
 * 配下の CmId / CmHtml が対応する装飾を自動適用する。
 * Provider 外（管理画面のエディタ等）では既定の空マップとなり、従来挙動を維持する。
 */
const FieldStylesContext = createContext<HomeCopyFieldStyles | undefined>(undefined);

export function FieldStylesProvider({
  value,
  scopeSelector,
  children,
}: {
  value?: HomeCopyFieldStyles;
  /** LP ルート ID（例: #self-stance-page）で CSS 詳細度を上げる */
  scopeSelector?: string;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    const sheet = buildFieldStylesStylesheet(value, scopeSelector);
    let el = document.head.querySelector<HTMLStyleElement>("style[data-cm-field-styles]");
    if (!sheet) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement("style");
      el.setAttribute("data-cm-field-styles", "");
      document.head.appendChild(el);
    }
    el.textContent = sheet;
    return () => {
      el?.remove();
    };
  }, [value, scopeSelector]);

  return <FieldStylesContext.Provider value={value}>{children}</FieldStylesContext.Provider>;
}

function useFieldStyles(): HomeCopyFieldStyles | undefined {
  return useContext(FieldStylesContext);
}

/** レイアウト用 style をベースに、編集パレット由来の装飾で上書き */
function useCmStyle(id: string, style?: CSSProperties): CSSProperties | undefined {
  const fieldStyles = useFieldStyles();
  const fromField = fieldStyleToCss(fieldStyles?.[id]);
  if (Object.keys(fromField).length === 0) return style;
  return { ...style, ...fromField };
}

/** fieldStyles の href または props の href を解決（props 優先） */
function resolveCmHref(
  id: string,
  fieldStyles: HomeCopyFieldStyles | undefined,
  propHref?: string,
): string | undefined {
  const explicit = propHref?.trim();
  if (explicit) return explicit;
  return fieldStyles?.[id]?.href?.trim() || undefined;
}

const CM_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;

type CmIdProps<T extends ElementType = "span"> = {
  id: string;
  as?: T;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "id" | "as" | "style" | "className" | "children">;

/** プレビュー選択用 data-cm-id ラッパー */
export function CmId<T extends ElementType = "span">({
  id,
  as,
  className,
  style,
  children,
  href: propHref,
  ...rest
}: CmIdProps<T>) {
  const fieldStyles = useFieldStyles();
  const linkHref = resolveCmHref(id, fieldStyles, typeof propHref === "string" ? propHref : undefined);
  const requestedAs = as ?? "span";
  const Tag = (linkHref ? "a" : requestedAs) as ElementType;
  const merged = useCmStyle(id, style);
  return (
    <Tag
      data-cm-id={id}
      className={className}
      style={merged}
      {...(linkHref ? { href: linkHref, ...CM_LINK_PROPS } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CmHtml({
  id,
  html,
  as: Tag = "span",
  className,
  style,
  href: propHref,
}: {
  id: string;
  html: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  href?: string;
}) {
  const fieldStyles = useFieldStyles();
  const linkHref = resolveCmHref(id, fieldStyles, propHref);
  const merged = useCmStyle(id, style);
  const ActualTag = (linkHref ? "a" : Tag) as ElementType;
  return (
    <ActualTag
      data-cm-id={id}
      className={className}
      style={merged}
      {...(linkHref ? { href: linkHref, ...CM_LINK_PROPS } : {})}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
