import { LINE_KS_SIGNUP_URL } from "@/constants/line-ks-signup";

/** 運営広告（Meta 広告の URL に flow=rin を付与）からの流入時の CTA 遷移先: アイテマス予約ページ */
export const AITEMASU_KS_DIRECT_URL = "https://app.aitemasu.me/u/rinsakitani/kslpdirect";

const FLOW_PARAM = "flow";
const FLOW_RIN = "rin";

/** 運営広告経由（flow=rin の完全一致）か。pteam・未指定・不明値はすべて false */
export function isRinFlow(search: string): boolean {
  return new URLSearchParams(search).get(FLOW_PARAM) === FLOW_RIN;
}

/**
 * KANPAI就活 LP の LINE 追加 CTA の遷移先を、URL クエリの flow で切り替える。
 * 運営広告経由は面談予約へ直接誘導したいため flow=rin の完全一致時のみアイテマスにし、
 * それ以外（pteam・未指定・不明値）は既存の公式 LINE に倒す。
 */
export function resolveKsCtaHref(search: string): string {
  return isRinFlow(search) ? AITEMASU_KS_DIRECT_URL : LINE_KS_SIGNUP_URL;
}

/**
 * CTA の置き場所。直前のブロックの訴求とクリック後の行動を揃えるため、場所ごとに文言を変える。
 * header=上部固定、sticky=下部追従（どちらも幅が狭いので短い文言）
 */
export type KsCtaSlot = "header" | "sticky" | "fv" | "afterCompanies" | "afterSteps" | "final" | "eventDetail";

const KS_CTA_LABELS: Record<KsCtaSlot, { rin: string; line: string }> = {
  header: { rin: "事前説明を予約", line: "LINEで案内を受け取る" },
  sticky: { rin: "15分の説明を予約", line: "LINEで事前説明の案内を受け取る" },
  fv: { rin: "事前説明を予約する", line: "LINEで案内を受け取る" },
  afterCompanies: { rin: "事前説明を予約する", line: "LINEで参加案内を受け取る" },
  afterSteps: { rin: "日程を選んで予約する", line: "LINEで日程案内を受け取る" },
  final: { rin: "事前説明を予約する", line: "LINEで案内を受け取る" },
  /** 最下部の開催情報の直後。最終 CTA と同時に見えるため、rin は最終 CTA と同じ文言を避けて日程の行動に寄せる */
  eventDetail: { rin: "日程を選んで予約する", line: "LINEで参加案内を受け取る" },
};

/** 遷移先に合わせて CTA の文言も出し分ける（予約ページに LINE の文言を出さないため） */
export function resolveKsCtaLabel(search: string, slot: KsCtaSlot = "fv"): string {
  const labels = KS_CTA_LABELS[slot];
  return isRinFlow(search) ? labels.rin : labels.line;
}
