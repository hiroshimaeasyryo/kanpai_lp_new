import { describe, expect, it } from "vitest";
import { LINE_KS_SIGNUP_URL } from "@/constants/line-ks-signup";
import { AITEMASU_KS_DIRECT_URL, resolveKsCtaHref, resolveKsCtaLabel } from "./cta-flow";

describe("resolveKsCtaHref", () => {
  it.each([
    ["", LINE_KS_SIGNUP_URL],
    ["?flow=pteam", LINE_KS_SIGNUP_URL],
    ["?flow=rin", AITEMASU_KS_DIRECT_URL],
    ["?flow=rin&utm_source=meta", AITEMASU_KS_DIRECT_URL],
    ["flow=rin", AITEMASU_KS_DIRECT_URL],
    ["?utm_source=meta&fbclid=IwAR0abc&flow=rin", AITEMASU_KS_DIRECT_URL],
    ["?flow=RIN", LINE_KS_SIGNUP_URL],
    ["?flow=rin2", LINE_KS_SIGNUP_URL],
    ["?flow=", LINE_KS_SIGNUP_URL],
  ])("search=%s", (search, expected) => {
    expect(resolveKsCtaHref(search)).toBe(expected);
  });
});

describe("resolveKsCtaLabel", () => {
  it.each([
    ["", "LINEで案内を受け取る"],
    ["?flow=pteam", "LINEで案内を受け取る"],
    ["?flow=rin", "事前説明を予約する"],
    ["?flow=rin&utm_source=meta&fbclid=IwAR0abc", "事前説明を予約する"],
    ["?flow=RIN", "LINEで案内を受け取る"],
  ])("search=%s", (search, expected) => {
    expect(resolveKsCtaLabel(search)).toBe(expected);
  });
});
