import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";
import type { HomeCopy } from "@/types/home-copy";

type HomeCmProps<T extends ElementType = "span"> = {
  id: string;
  copy: HomeCopy;
  as?: T;
  cms: (id: string, base?: CSSProperties) => CSSProperties;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "id" | "as" | "style" | "className" | "children">;

/** Home LP 用 data-cm-id ラッパー（fieldStyles.href があればリンク化） */
export function HomeCm<T extends ElementType = "span">({
  id,
  copy,
  as,
  cms,
  className,
  style,
  children,
  ...rest
}: HomeCmProps<T>) {
  const href = copy.fieldStyles?.[id]?.href?.trim();
  const requestedAs = (as ?? "span") as ElementType;
  const Tag = (href ? "a" : requestedAs) as ElementType;

  return (
    <Tag
      data-cm-id={id}
      className={className}
      style={cms(id, style)}
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}
