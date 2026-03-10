import { useEffect, useState } from "react";
import { LoadingDots } from "@/components/LoadingDots";
import { LINE_KS_SIGNUP_URL } from "@/constants/line-ks-signup";

const REDIRECT_DELAY_MS = 300;
const FALLBACK_BUTTON_DELAY_MS = 5000;

/**
 * /thanks_ks
 * 旧クッションページ（Pixel は index.html で全域設置済みのため、ここではリダイレクトのみ）。
 * ブックマーク・外部リンク互換のためルートは残す。
 */
export default function ThanksKs() {
  const [showFallbackButton, setShowFallbackButton] = useState(false);

  useEffect(() => {
    const metaRefresh = document.createElement("meta");
    metaRefresh.setAttribute("http-equiv", "refresh");
    metaRefresh.setAttribute("content", `0.01;URL=${LINE_KS_SIGNUP_URL}`);
    document.head.appendChild(metaRefresh);

    const t = setTimeout(() => {
      window.location.replace(LINE_KS_SIGNUP_URL);
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowFallbackButton(true), FALLBACK_BUTTON_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-white">
      <LoadingDots />
      {showFallbackButton && (
        <a
          href={LINE_KS_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-lp-primary underline hover:text-lp-primary-hover transition-colors"
        >
          数秒待っても遷移しない場合はこちら
        </a>
      )}
    </div>
  );
}
