/**
 * 流入経路分析用: ナビゲーション時に URL クエリ（?from=free 等）を保持するフック。
 * 要件 F-12 / F-13: 同一コンテンツでクエリのみ変えた URL を配布し、リダイレクトでクエリを失わない。
 */
import { useLocation, useSearch } from "wouter";

type NavigateOptions = { replace?: boolean };

export function usePreserveQueryNavigate(): (path: string, options?: NavigateOptions) => void {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchPart = search ? `?${search}` : "";

  return (path: string, options?: NavigateOptions) => {
    const fullPath = path + searchPart;
    setLocation(fullPath, options ?? {});
  };
}
