import type { CSSProperties, ElementType, ReactNode } from "react";

/** プレビュー選択用 data-cm-id ラッパー */
export function CmId({
  id,
  as: Tag = "span",
  className,
  style,
  children,
}: {
  id: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <Tag data-cm-id={id} className={className} style={style}>
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
  return (
    <Tag
      data-cm-id={id}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
