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

/** 遷移先に合わせて CTA の文言も出し分ける（予約ページに LINE の文言・アイコンを出さないため） */
export function resolveKsCtaLabel(search: string): string {
  return isRinFlow(search) ? "事前説明を予約する" : "LINEで案内を受け取る";
}
