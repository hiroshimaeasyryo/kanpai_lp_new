import { TOP_SLUG } from "@/lib/lp-slug";
import type { ContentPayload } from "@/types/content-payload";

export const CM_PREVIEW_QUERY = "cmPreview";

export type LpKind =
  | "home"
  | "btob_seminar"
  | "self_reflection"
  | "starting_job_hunting"
  | "self_stance"
  | "js_self_analysis"
  | "works_recruiting";

const SPECIAL_SLUG_TO_KIND: Record<string, LpKind> = {
  btob_seminar: "btob_seminar",
  "self-reflection": "self_reflection",
  starting_job_hunting: "starting_job_hunting",
  "self-stance": "self_stance",
  js_self_analysis: "js_self_analysis",
  works_recruiting: "works_recruiting",
};

const SPECIAL_SLUG_TO_PATH: Record<string, string> = {
  btob_seminar: "/btob_seminar",
  "self-reflection": "/self-reflection",
  starting_job_hunting: "/starting_job_hunting",
  "self-stance": "/self-stance",
  js_self_analysis: "/js_self_analysis",
  works_recruiting: "/works_recruiting",
};

export function getLpKind(slug: string): LpKind {
  return SPECIAL_SLUG_TO_KIND[slug] ?? "home";
}

export function isHomeLp(slug: string): boolean {
  return getLpKind(slug) === "home";
}

export function getPreviewPath(slug: string): string {
  if (slug === TOP_SLUG) return "/";
  const fixed = SPECIAL_SLUG_TO_PATH[slug];
  if (fixed) return fixed;
  return `/${slug}`;
}

export function buildPreviewUrl(slug: string): string {
  const path = getPreviewPath(slug);
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}${CM_PREVIEW_QUERY}=1`;
}

export function isCmPreviewMode(search?: string): boolean {
  if (typeof window === "undefined") return false;
  const qs = search ?? window.location.search;
  return new URLSearchParams(qs).get(CM_PREVIEW_QUERY) === "1";
}

export type CmPreviewMessage =
  | { type: "cm-ready" }
  | { type: "cm-select"; id: string; label?: string }
  | { type: "cm-draft"; slug: string; payload: ContentPayload }
  | { type: "cm-scroll-to"; id: string };

export const CM_PREVIEW_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

export function postToCmParent(message: CmPreviewMessage): void {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage(message, CM_PREVIEW_ORIGIN);
}

export function isCmPreviewMessage(data: unknown): data is CmPreviewMessage {
  if (!data || typeof data !== "object") return false;
  const t = (data as { type?: unknown }).type;
  return (
    t === "cm-ready" ||
    t === "cm-select" ||
    t === "cm-draft" ||
    t === "cm-scroll-to"
  );
}
