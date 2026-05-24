/** Meta Pixel: コンバージョン（CTAクリック）送信（index.html で fbq が初期化済み） */
export function trackMetaPixelLead() {
  if (
    typeof window !== "undefined" &&
    typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === "function"
  ) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "Lead");
  }
}
