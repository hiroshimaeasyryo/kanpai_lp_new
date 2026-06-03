/** KDK モックのゲートURL（末尾スラッシュ付きで統一） */
export const KDK_GATE_PATH = "/kdk/";

const GATE_PATHS = new Set(["/kdk", "/kdk/", "/kdk/index.html"]);

/** 認証後の遷移先（pathname のみ。ネストした next は拒否） */
export function parseKdkMockupNext(
  search: string = typeof window !== "undefined"
    ? window.location.search
    : "",
): string | null {
  try {
    const next = new URLSearchParams(search).get("next");
    if (!next) return null;

    let decoded = decodeURIComponent(next);
    const q = decoded.indexOf("?");
    if (q !== -1) decoded = decoded.slice(0, q);
    const h = decoded.indexOf("#");
    if (h !== -1) decoded = decoded.slice(0, h);

    if (!decoded.startsWith("/kdk/site/")) return null;
    if (GATE_PATHS.has(decoded)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export const KDK_MOCKUP_DEFAULT_PATH = "/kdk/site/index.html";
