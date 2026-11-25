import { describe, expect, it } from "vitest";
import { LINE_KS_SIGNUP_URL } from "@/constants/line-ks-signup";
import {
  AITEMASU_KS_DIRECT_URL,
  PROLINE_KS_SIGNUP_URL,
  isKsBookingStyle,
  resolveKsCtaHref,
  resolveKsCtaLabel,
  type KsCtaSlot,
} from "./cta-flow";

const RIN_SEARCHES = ["?flow=rin", "flow=rin", "?flow=rin&utm_source=meta", "?utm_source=meta&fbclid=IwAR0abc&flow=rin"];
const OTHER_SEARCHES = ["", "?flow=pteam", "?flow=RIN", "?flow=rin2", "?flow="];

describe("現在の設定（flow=rin はプロライン）", () => {
  it.each(RIN_SEARCHES)("%s はプロライン・LINE 版の表示", (search) => {
    expect(resolveKsCtaHref(search)).toBe(PROLINE_KS_SIGNUP_URL);
    expect(isKsBookingStyle(search)).toBe(false);
  });

  it.each(OTHER_SEARCHES)("%s は公式 LINE", (search) => {
    expect(resolveKsCtaHref(search)).toBe(LINE_KS_SIGNUP_URL);
    expect(isKsBookingStyle(search)).toBe(false);
  });

  it("flow=rin の文言は通常表示と全箇所で同じ", () => {
    const slots: KsCtaSlot[] = ["header", "sticky", "fv", "afterCompanies", "afterSteps", "final", "eventDetail"];
    for (const slot of slots) expect(resolveKsCtaLabel("?flow=rin", slot)).toBe(resolveKsCtaLabel("", slot));
  });
});

describe("行き先の切り替え", () => {
  it.each([
    ["proline", PROLINE_KS_SIGNUP_URL, false],
    ["aitemasu", AITEMASU_KS_DIRECT_URL, true],
    ["line", LINE_KS_SIGNUP_URL, false],
  ] as const)("%s", (destination, href, booking) => {
    expect(resolveKsCtaHref("?flow=rin", destination)).toBe(href);
    expect(isKsBookingStyle("?flow=rin", destination)).toBe(booking);
    expect(resolveKsCtaHref("", destination)).toBe(LINE_KS_SIGNUP_URL);
    expect(isKsBookingStyle("", destination)).toBe(false);
  });

  it.each([
    ["header", "LINEで案内を受け取る", "事前説明を予約"],
    ["sticky", "LINEで事前説明の案内を受け取る", "15分の説明を予約"],
    ["fv", "LINEで案内を受け取る", "事前説明を予約する"],
    ["afterCompanies", "LINEで参加案内を受け取る", "事前説明を予約する"],
    ["afterSteps", "LINEで日程案内を受け取る", "日程を選んで予約する"],
    ["final", "LINEで案内を受け取る", "事前説明を予約する"],
    ["eventDetail", "LINEで参加案内を受け取る", "日程を選んで予約する"],
  ] as const)("%s の文言", (slot, line, booking) => {
    expect(resolveKsCtaLabel("?flow=rin", slot, "proline")).toBe(line);
    expect(resolveKsCtaLabel("?flow=rin", slot, "line")).toBe(line);
    expect(resolveKsCtaLabel("?flow=rin", slot, "aitemasu")).toBe(booking);
    expect(resolveKsCtaLabel("", slot, "aitemasu")).toBe(line);
  });
});
