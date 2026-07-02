import type { SelfReflectionContent } from "@/components/SelfReflectionEditor";
import type { JsSelfAnalysisContent } from "@/types/js-self-analysis";
import type { SelfStanceContent } from "@/types/self-stance";
import type { StartingJobHuntingContent } from "@/types/starting-job-hunting";

/** CTA URL を共有する4 LP */
export const SHARED_CTA_SLUGS = [
  "js_self_analysis",
  "self-stance",
  "starting_job_hunting",
  "self-reflection",
] as const;

export type SharedCtaSlug = (typeof SHARED_CTA_SLUGS)[number];

/** 全 CTA ボタンが参照するコンテンツ上のパス */
export const SHARED_CTA_HREF_PATH = "ctaUrl";

export function isSharedCtaSlug(slug: string): slug is SharedCtaSlug {
  return (SHARED_CTA_SLUGS as readonly string[]).includes(slug);
}

export function isSharedCtaHrefPath(hrefPath?: string): boolean {
  return hrefPath === SHARED_CTA_HREF_PATH;
}

export function resolveCtaUrl(content: { ctaUrl?: string }): string {
  return content.ctaUrl?.trim() ?? "";
}

function firstNonEmpty(...values: Array<string | undefined>): string {
  for (const v of values) {
    const t = v?.trim();
    if (t) return t;
  }
  return "";
}

export function extractCtaUrlFromJsa(content: JsSelfAnalysisContent): string {
  return firstNonEmpty(
    content.ctaUrl,
    content.floatingCta?.ctaHref,
    content.hero?.ctaHref,
    content.empathy?.ctaHref,
    content.schedule?.ctaHref,
    content.eventInfo?.ctaHref,
    content.finalCta?.ctaHref,
  );
}

export function extractCtaUrlFromSelfStance(content: SelfStanceContent): string {
  return firstNonEmpty(
    content.ctaUrl,
    content.header?.ctaHref,
    content.stickyCta?.ctaHref,
    content.hero?.primaryCtaHref,
    content.solution?.ctaHref,
    content.detail?.ctaHref,
    content.finalCta?.ctaHref,
  );
}

export function extractCtaUrlFromStartingJobHunting(content: StartingJobHuntingContent): string {
  return firstNonEmpty(
    content.ctaUrl,
    content.header?.ctaHref,
    content.stickyCta?.ctaHref,
    content.hero?.primaryCtaHref,
    content.midCta?.ctaHref,
    content.info?.ctaHref,
    content.finalCta?.ctaHref,
  );
}

export function extractCtaUrlFromSelfReflection(content: SelfReflectionContent): string {
  return content.ctaUrl?.trim() ?? "";
}

export function applyCtaUrlToJsa(content: JsSelfAnalysisContent, url: string): JsSelfAnalysisContent {
  return {
    ...content,
    ctaUrl: url,
    floatingCta: { ...content.floatingCta, ctaHref: url },
    hero: { ...content.hero, ctaHref: url },
    empathy: { ...content.empathy, ctaHref: url },
    schedule: { ...content.schedule, ctaHref: url },
    eventInfo: { ...content.eventInfo, ctaHref: url },
    finalCta: { ...content.finalCta, ctaHref: url },
  };
}

export function applyCtaUrlToSelfStance(content: SelfStanceContent, url: string): SelfStanceContent {
  return {
    ...content,
    ctaUrl: url,
    header: { ...content.header, ctaHref: url },
    stickyCta: { ...content.stickyCta, ctaHref: url },
    hero: { ...content.hero, primaryCtaHref: url },
    solution: { ...content.solution, ctaHref: url },
    detail: { ...content.detail, ctaHref: url },
    finalCta: { ...content.finalCta, ctaHref: url },
  };
}

export function applyCtaUrlToStartingJobHunting(
  content: StartingJobHuntingContent,
  url: string,
): StartingJobHuntingContent {
  return {
    ...content,
    ctaUrl: url,
    header: { ...content.header, ctaHref: url },
    stickyCta: { ...content.stickyCta, ctaHref: url },
    hero: { ...content.hero, primaryCtaHref: url },
    midCta: { ...content.midCta, ctaHref: url },
    info: { ...content.info, ctaHref: url },
    finalCta: { ...content.finalCta, ctaHref: url },
  };
}

export function applyCtaUrlToSelfReflection(
  content: SelfReflectionContent,
  url: string,
): SelfReflectionContent {
  return { ...content, ctaUrl: url };
}

export function normalizeCtaUrlInJsa(content: JsSelfAnalysisContent): JsSelfAnalysisContent {
  const url = extractCtaUrlFromJsa(content);
  return url ? applyCtaUrlToJsa(content, url) : content;
}

export function normalizeCtaUrlInSelfStance(content: SelfStanceContent): SelfStanceContent {
  const url = extractCtaUrlFromSelfStance(content);
  return url ? applyCtaUrlToSelfStance(content, url) : content;
}

export function normalizeCtaUrlInStartingJobHunting(
  content: StartingJobHuntingContent,
): StartingJobHuntingContent {
  const url = extractCtaUrlFromStartingJobHunting(content);
  return url ? applyCtaUrlToStartingJobHunting(content, url) : content;
}

export function normalizeCtaUrlInSelfReflection(
  content: SelfReflectionContent,
): SelfReflectionContent {
  const url = extractCtaUrlFromSelfReflection(content);
  return url ? applyCtaUrlToSelfReflection(content, url) : content;
}

export type SharedCtaContents = {
  jsSelfAnalysis: JsSelfAnalysisContent | null;
  selfStance: SelfStanceContent | null;
  startingJobHunting: StartingJobHuntingContent | null;
  selfReflection: SelfReflectionContent | null;
};

export type SharedCtaSetters = {
  setJsSelfAnalysis: (next: JsSelfAnalysisContent) => void;
  setSelfStance: (next: SelfStanceContent) => void;
  setStartingJobHunting: (next: StartingJobHuntingContent) => void;
  setSelfReflection: (next: SelfReflectionContent) => void;
};

export function pickSharedCtaUrl(contents: SharedCtaContents): string {
  return firstNonEmpty(
    contents.selfReflection?.ctaUrl,
    contents.jsSelfAnalysis?.ctaUrl,
    contents.selfStance?.ctaUrl,
    contents.startingJobHunting?.ctaUrl,
    contents.jsSelfAnalysis ? extractCtaUrlFromJsa(contents.jsSelfAnalysis) : undefined,
    contents.selfStance ? extractCtaUrlFromSelfStance(contents.selfStance) : undefined,
    contents.startingJobHunting
      ? extractCtaUrlFromStartingJobHunting(contents.startingJobHunting)
      : undefined,
    contents.selfReflection ? extractCtaUrlFromSelfReflection(contents.selfReflection) : undefined,
  );
}

/** 4 LP すべてに同じ CTA URL を適用した新しいコンテンツセットを返す */
export function applySharedCtaUrlToAllContents(
  contents: SharedCtaContents,
  url: string,
): SharedCtaContents {
  return {
    jsSelfAnalysis: contents.jsSelfAnalysis
      ? applyCtaUrlToJsa(contents.jsSelfAnalysis, url)
      : null,
    selfStance: contents.selfStance
      ? applyCtaUrlToSelfStance(contents.selfStance, url)
      : null,
    startingJobHunting: contents.startingJobHunting
      ? applyCtaUrlToStartingJobHunting(contents.startingJobHunting, url)
      : null,
    selfReflection: contents.selfReflection
      ? applyCtaUrlToSelfReflection(contents.selfReflection, url)
      : null,
  };
}

/** 4 LP すべてに同じ CTA URL を適用する */
export function applySharedCtaUrlToAll(
  contents: SharedCtaContents,
  url: string,
  setters: SharedCtaSetters,
): void {
  if (contents.jsSelfAnalysis) {
    setters.setJsSelfAnalysis(applyCtaUrlToJsa(contents.jsSelfAnalysis, url));
  }
  if (contents.selfStance) {
    setters.setSelfStance(applyCtaUrlToSelfStance(contents.selfStance, url));
  }
  if (contents.startingJobHunting) {
    setters.setStartingJobHunting(applyCtaUrlToStartingJobHunting(contents.startingJobHunting, url));
  }
  if (contents.selfReflection) {
    setters.setSelfReflection(applyCtaUrlToSelfReflection(contents.selfReflection, url));
  }
}
