import { LINE_KS_SIGNUP_URL } from "@/constants/line-ks-signup";

/** アイテマス予約ページ（事前説明の直予約） */
export const AITEMASU_KS_DIRECT_URL = "https://app.aitemasu.me/u/rinsakitani/kslpdirect";
/** プロライン経由の LINE 友だち追加 */
export const PROLINE_KS_SIGNUP_URL =
  "https://xp48w7qk.autosns.app/addfriend/s/U2gUDIzwJh/@779ahmbk?free1=sns_ks2028";

/** style は文言・アイコン・STEP 01 の補足文の系統。line=通常表示と同じ LINE 版、booking=直予約版 */
const KS_CTA_DESTINATIONS = {
  proline: { href: PROLINE_KS_SIGNUP_URL, style: "line" },
  aitemasu: { href: AITEMASU_KS_DIRECT_URL, style: "booking" },
  line: { href: LINE_KS_SIGNUP_URL, style: "line" },
} as const;

export type KsCtaDestination = keyof typeof KS_CTA_DESTINATIONS;

/**
 * 運営広告（Meta 広告の URL に flow=rin を付与）の CTA の行き先。切り替えはここ1か所だけ変える。
 * proline=プロライン / aitemasu=アイテマス / line=公式 LINE（lin.ee）
 */
export const RIN_FLOW_DESTINATION: KsCtaDestination = "proline";

const FLOW_PARAM = "flow";
const FLOW_RIN = "rin";

/** 運営広告経由（flow=rin の完全一致）か。pteam・未指定・不明値はすべて false */
export function isRinFlow(search: string): boolean {
  return new URLSearchParams(search).get(FLOW_PARAM) === FLOW_RIN;
}

/** flow=rin の完全一致時のみ設定した行き先にし、それ以外（pteam・未指定・不明値）は公式 LINE に倒す */
function resolveDestination(search: string, rinDestination: KsCtaDestination) {
  return KS_CTA_DESTINATIONS[isRinFlow(search) ? rinDestination : "line"];
}

/** KANPAI就活 LP の CTA の遷移先 */
export function resolveKsCtaHref(
  search: string,
  rinDestination: KsCtaDestination = RIN_FLOW_DESTINATION,
): string {
  return resolveDestination(search, rinDestination).href;
}

/** 直予約版の文言・アイコン・補足文を出すか（予約ページに LINE の表示を、LINE 追加に予約の表示を出さないため） */
export function isKsBookingStyle(
  search: string,
  rinDestination: KsCtaDestination = RIN_FLOW_DESTINATION,
): boolean {
  return resolveDestination(search, rinDestination).style === "booking";
}

/**
 * CTA の置き場所。直前のブロックの訴求とクリック後の行動を揃えるため、場所ごとに文言を変える。
 * header=上部固定（ロゴと並ぶので短い文言）、sticky=下部追従
 */
export type KsCtaSlot = "header" | "sticky" | "fv" | "afterCompanies" | "afterSteps" | "final" | "eventDetail";

const KS_CTA_LABELS: Record<KsCtaSlot, { booking: string; line: string }> = {
  header: { booking: "事前説明を予約", line: "LINEで案内を受け取る" },
  sticky: { booking: "15分の説明を予約", line: "LINEで事前説明の案内を受け取る" },
  fv: { booking: "事前説明を予約する", line: "LINEで案内を受け取る" },
  afterCompanies: { booking: "事前説明を予約する", line: "LINEで参加案内を受け取る" },
  afterSteps: { booking: "日程を選んで予約する", line: "LINEで日程案内を受け取る" },
  final: { booking: "事前説明を予約する", line: "LINEで案内を受け取る" },
  /** 最下部の開催情報の直後。最終 CTA と同時に見えるため、booking は最終 CTA と同じ文言を避けて日程の行動に寄せる */
  eventDetail: { booking: "日程を選んで予約する", line: "LINEで参加案内を受け取る" },
};

/** 遷移先に合わせて CTA の文言も出し分ける（予約ページに LINE の文言を出さないため） */
export function resolveKsCtaLabel(
  search: string,
  slot: KsCtaSlot = "fv",
  rinDestination: KsCtaDestination = RIN_FLOW_DESTINATION,
): string {
  const labels = KS_CTA_LABELS[slot];
  return isKsBookingStyle(search, rinDestination) ? labels.booking : labels.line;
}
