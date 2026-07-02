import { describe, expect, it } from "vitest";
import type { SelfReflectionContent } from "@/components/SelfReflectionEditor";
import {
  applyCtaUrlToJsa,
  applyCtaUrlToSelfReflection,
  applyCtaUrlToSelfStance,
  applyCtaUrlToStartingJobHunting,
  applySharedCtaUrlToAllContents,
  resolveCtaUrl,
  SHARED_CTA_SLUGS,
  type SharedCtaContents,
} from "./shared-lp-cta";
import {
  applyDraftToPreviewStorage,
  readDraftFromPreviewStorage,
} from "./preview-storage";
import { DEFAULT_JSA_CONTENT, mergeJsSelfAnalysisContent } from "@/types/js-self-analysis";
import { DEFAULT_SELF_STANCE_CONTENT, mergeSelfStanceContent } from "@/types/self-stance";
import {
  DEFAULT_STARTING_JOB_HUNTING_CONTENT,
  mergeStartingJobHuntingContent,
} from "@/types/starting-job-hunting";
import srSeed from "../../../public/content/self-reflection.json";

const TEST_URL =
  "https://xp48w7qk.autosns.app/addfriend/s/RYl3Zx8aGP/@779ahmbk?free1=sns_js";

const DEFAULT_SR = srSeed.selfReflection as SelfReflectionContent;

function allFourLoaded(): SharedCtaContents {
  return {
    jsSelfAnalysis: DEFAULT_JSA_CONTENT,
    selfStance: DEFAULT_SELF_STANCE_CONTENT,
    startingJobHunting: DEFAULT_STARTING_JOB_HUNTING_CONTENT,
    selfReflection: DEFAULT_SR,
  };
}

function assertJsaAllCtas(url: string, c: typeof DEFAULT_JSA_CONTENT) {
  expect(c.ctaUrl).toBe(url);
  expect(c.floatingCta.ctaHref).toBe(url);
  expect(c.hero.ctaHref).toBe(url);
  expect(c.empathy.ctaHref).toBe(url);
  expect(c.schedule.ctaHref).toBe(url);
  expect(c.eventInfo.ctaHref).toBe(url);
  expect(c.finalCta.ctaHref).toBe(url);
  expect(resolveCtaUrl(c)).toBe(url);
}

function assertSelfStanceAllCtas(url: string, c: typeof DEFAULT_SELF_STANCE_CONTENT) {
  expect(c.ctaUrl).toBe(url);
  expect(c.header.ctaHref).toBe(url);
  expect(c.stickyCta.ctaHref).toBe(url);
  expect(c.hero.primaryCtaHref).toBe(url);
  expect(c.solution.ctaHref).toBe(url);
  expect(c.detail.ctaHref).toBe(url);
  expect(c.finalCta.ctaHref).toBe(url);
  expect(resolveCtaUrl(c)).toBe(url);
}

function assertSjhAllCtas(url: string, c: typeof DEFAULT_STARTING_JOB_HUNTING_CONTENT) {
  expect(c.ctaUrl).toBe(url);
  expect(c.header.ctaHref).toBe(url);
  expect(c.stickyCta.ctaHref).toBe(url);
  expect(c.hero.primaryCtaHref).toBe(url);
  expect(c.midCta.ctaHref).toBe(url);
  expect(c.info.ctaHref).toBe(url);
  expect(c.finalCta.ctaHref).toBe(url);
  expect(resolveCtaUrl(c)).toBe(url);
}

function assertSrCta(url: string, c: SelfReflectionContent) {
  expect(c.ctaUrl).toBe(url);
  expect(resolveCtaUrl(c)).toBe(url);
}

function assertAllFourLps(url: string, contents: SharedCtaContents) {
  expect(contents.jsSelfAnalysis).not.toBeNull();
  expect(contents.selfStance).not.toBeNull();
  expect(contents.startingJobHunting).not.toBeNull();
  expect(contents.selfReflection).not.toBeNull();
  assertJsaAllCtas(url, contents.jsSelfAnalysis!);
  assertSelfStanceAllCtas(url, contents.selfStance!);
  assertSjhAllCtas(url, contents.startingJobHunting!);
  assertSrCta(url, contents.selfReflection!);
}

/** ContentsManager.buildPayloadForSlug + withSharedCtaUrl と同等の保存用ペイロード生成 */
function buildSavePayload(
  slug: (typeof SHARED_CTA_SLUGS)[number],
  contents: SharedCtaContents,
  sharedCtaUrl: string,
) {
  const url = sharedCtaUrl.trim();
  switch (slug) {
    case "js_self_analysis": {
      const base = contents.jsSelfAnalysis ?? mergeJsSelfAnalysisContent(undefined);
      return { jsSelfAnalysis: applyCtaUrlToJsa(base, url) };
    }
    case "self-stance": {
      const base = contents.selfStance ?? mergeSelfStanceContent(undefined);
      return { selfStance: applyCtaUrlToSelfStance(base, url) };
    }
    case "starting_job_hunting": {
      const base = contents.startingJobHunting ?? mergeStartingJobHuntingContent(undefined);
      return { startingJobHunting: applyCtaUrlToStartingJobHunting(base, url) };
    }
    case "self-reflection": {
      const base = contents.selfReflection ?? DEFAULT_SR;
      return { selfReflection: applyCtaUrlToSelfReflection(base, url) };
    }
  }
}

describe("4 LP CTA URL 同期", () => {
  it("4 LP すべて読み込み済みのとき、URL変更で全CTAが TEST_URL になる", () => {
    const updated = applySharedCtaUrlToAllContents(allFourLoaded(), TEST_URL);
    assertAllFourLps(TEST_URL, updated);
  });

  it.each(SHARED_CTA_SLUGS)(
    "%s のCTA URLを変更した想定でも、4 LP すべてが TEST_URL になる",
    () => {
      const updated = applySharedCtaUrlToAllContents(allFourLoaded(), TEST_URL);
      assertAllFourLps(TEST_URL, updated);
    },
  );

  it("他LPが未読み込みでも、保存ペイロードは4 LP すべて TEST_URL になる", () => {
    const partial: SharedCtaContents = {
      jsSelfAnalysis: null,
      selfStance: null,
      startingJobHunting: null,
      selfReflection: { ...DEFAULT_SR, ctaUrl: "https://old.example" },
    };
    const sharedCtaUrl = TEST_URL;
    const afterEdit = applySharedCtaUrlToAllContents(partial, sharedCtaUrl);

    for (const slug of SHARED_CTA_SLUGS) {
      const payload = buildSavePayload(slug, afterEdit, sharedCtaUrl);
      if (slug === "js_self_analysis" && payload.jsSelfAnalysis) {
        assertJsaAllCtas(TEST_URL, payload.jsSelfAnalysis);
      }
      if (slug === "self-stance" && payload.selfStance) {
        assertSelfStanceAllCtas(TEST_URL, payload.selfStance);
      }
      if (slug === "starting_job_hunting" && payload.startingJobHunting) {
        assertSjhAllCtas(TEST_URL, payload.startingJobHunting);
      }
      if (slug === "self-reflection" && payload.selfReflection) {
        assertSrCta(TEST_URL, payload.selfReflection);
      }
    }
  });

  it("self-reflection だけ編集したケース: 保存時4ファイルすべて TEST_URL", () => {
    const contents: SharedCtaContents = {
      jsSelfAnalysis: mergeJsSelfAnalysisContent(undefined),
      selfStance: mergeSelfStanceContent(undefined),
      startingJobHunting: mergeStartingJobHuntingContent(undefined),
      selfReflection: applyCtaUrlToSelfReflection(DEFAULT_SR, TEST_URL),
    };
    const synced = applySharedCtaUrlToAllContents(contents, TEST_URL);

    for (const slug of SHARED_CTA_SLUGS) {
      const payload = buildSavePayload(slug, synced, TEST_URL);
      if (payload.jsSelfAnalysis) assertJsaAllCtas(TEST_URL, payload.jsSelfAnalysis);
      if (payload.selfStance) assertSelfStanceAllCtas(TEST_URL, payload.selfStance);
      if (payload.startingJobHunting) assertSjhAllCtas(TEST_URL, payload.startingJobHunting);
      if (payload.selfReflection) assertSrCta(TEST_URL, payload.selfReflection);
    }
  });

  it("CMプレビュー用 localStorage に4 LP すべて TEST_URL が書き込まれる", () => {
    const synced = applySharedCtaUrlToAllContents(allFourLoaded(), TEST_URL);
    for (const slug of SHARED_CTA_SLUGS) {
      applyDraftToPreviewStorage(slug, buildSavePayload(slug, synced, TEST_URL));
    }

    const jsa = readDraftFromPreviewStorage("js_self_analysis")?.jsSelfAnalysis;
    const ss = readDraftFromPreviewStorage("self-stance")?.selfStance;
    const sjh = readDraftFromPreviewStorage("starting_job_hunting")?.startingJobHunting;
    const sr = readDraftFromPreviewStorage("self-reflection")?.selfReflection as
      | SelfReflectionContent
      | undefined;

    expect(jsa).toBeTruthy();
    expect(ss).toBeTruthy();
    expect(sjh).toBeTruthy();
    expect(sr).toBeTruthy();
    assertJsaAllCtas(TEST_URL, jsa!);
    assertSelfStanceAllCtas(TEST_URL, ss!);
    assertSjhAllCtas(TEST_URL, sjh!);
    assertSrCta(TEST_URL, sr!);
  });
});
