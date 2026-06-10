import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { fieldStyleToCss, type HomeCopyFieldStyles } from "@/types/home-copy-style";

/**
 * data-cm-id ごとの装飾（fieldStyles）をページ全体に供給するコンテキスト。
 * LP/構造化ページ側で <FieldStylesProvider value={content.fieldStyles}> で包むと、
 * 配下の CmId / CmHtml が対応する装飾を自動適用する。
 * Provider 外（管理画面のエディタ等）では既定の空マップとなり、従来挙動を維持する。
 */
const FieldStylesContext = createContext<HomeCopyFieldStyles | undefined>(undefined);

export function FieldStylesProvider({
  value,
  children,
}: {
  value?: HomeCopyFieldStyles;
  children: ReactNode;
}) {
  return <FieldStylesContext.Provider value={value}>{children}</FieldStylesContext.Provider>;
}

/** コンテキストの fieldStyles と明示 style をマージ（明示 style を優先） */
function useCmStyle(id: string, style?: CSSProperties): CSSProperties | undefined {
  const fieldStyles = useContext(FieldStylesContext);
  const fromField = fieldStyleToCss(fieldStyles?.[id]);
  if (Object.keys(fromField).length === 0) return style;
  return { ...fromField, ...style };
}

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
  ...rest
}: CmIdProps<T>) {
  const Tag = (as ?? "span") as ElementType;
  const merged = useCmStyle(id, style);
  return (
    <Tag data-cm-id={id} className={className} style={merged} {...rest}>
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
}: {
  id: string;
  html: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const merged = useCmStyle(id, style);
  return (
    <Tag
      data-cm-id={id}
      className={className}
      style={merged}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
