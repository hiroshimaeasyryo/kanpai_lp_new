import { describe, expect, it } from "vitest";
import {
  applyCtaUrlToJsa,
  applyCtaUrlToSelfStance,
  applySharedCtaUrlToAllContents,
  extractCtaUrlFromJsa,
  normalizeCtaUrlInJsa,
  resolveCtaUrl,
} from "./shared-lp-cta";
import { DEFAULT_JSA_CONTENT } from "@/types/js-self-analysis";
import { DEFAULT_SELF_STANCE_CONTENT } from "@/types/self-stance";

describe("shared-lp-cta", () => {
  it("resolveCtaUrl returns trimmed ctaUrl", () => {
    expect(resolveCtaUrl({ ctaUrl: " https://example.com " })).toBe("https://example.com");
  });

  it("extractCtaUrlFromJsa falls back to legacy ctaHref fields", () => {
    const content = {
      ...DEFAULT_JSA_CONTENT,
      ctaUrl: undefined,
      floatingCta: { ...DEFAULT_JSA_CONTENT.floatingCta, ctaHref: "" },
      hero: { ...DEFAULT_JSA_CONTENT.hero, ctaHref: "https://legacy.example" },
    };
    expect(extractCtaUrlFromJsa(content)).toBe("https://legacy.example");
  });

  it("applyCtaUrlToJsa syncs all section href fields", () => {
    const next = applyCtaUrlToJsa(DEFAULT_JSA_CONTENT, "https://unified.example");
    expect(next.ctaUrl).toBe("https://unified.example");
    expect(next.hero.ctaHref).toBe("https://unified.example");
    expect(next.floatingCta.ctaHref).toBe("https://unified.example");
    expect(next.finalCta.ctaHref).toBe("https://unified.example");
  });

  it("normalizeCtaUrlInJsa promotes legacy href to ctaUrl", () => {
    const raw = {
      ...DEFAULT_JSA_CONTENT,
      ctaUrl: undefined,
      empathy: { ...DEFAULT_JSA_CONTENT.empathy, ctaHref: "https://from-empathy.example" },
    };
    const normalized = normalizeCtaUrlInJsa(raw);
    expect(normalized.ctaUrl).toBeTruthy();
    expect(normalized.empathy.ctaHref).toBe(normalized.ctaUrl);
  });

  it("applySharedCtaUrlToAllContents updates every loaded LP", () => {
    const updated = applySharedCtaUrlToAllContents(
      {
        jsSelfAnalysis: DEFAULT_JSA_CONTENT,
        selfStance: DEFAULT_SELF_STANCE_CONTENT,
        startingJobHunting: null,
        selfReflection: null,
      },
      "https://shared.example",
    );
    expect(updated.jsSelfAnalysis?.ctaUrl).toBe("https://shared.example");
    expect(updated.selfStance?.ctaUrl).toBe("https://shared.example");
    expect(applyCtaUrlToSelfStance(DEFAULT_SELF_STANCE_CONTENT, "x").header.ctaHref).toBe("x");
  });
});
