import { describe, expect, it } from "vitest";
import { LINE_KS_SIGNUP_URL } from "@/constants/line-ks-signup";
import { AITEMASU_KS_DIRECT_URL, resolveKsCtaHref } from "./cta-flow";

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
