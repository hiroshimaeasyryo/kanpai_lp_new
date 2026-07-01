import { useEffect, useState } from "react";
import { LoadingDots } from "@/components/LoadingDots";
import { LINE_WP_SIGNUP_URL } from "@/constants/line-ks-signup";

const REDIRECT_DELAY_MS = 1500;
const FALLBACK_BUTTON_DELAY_MS = 6000;

const COLOR = "#06c755"; // LINE green

export default function WpRedirect() {
  const [showFallbackButton, setShowFallbackButton] = useState(false);

  useEffect(() => {
    const metaRefresh = document.createElement("meta");
    metaRefresh.setAttribute("http-equiv", "refresh");
    metaRefresh.setAttribute("content", `1.5;URL=${LINE_WP_SIGNUP_URL}`);
    document.head.appendChild(metaRefresh);

    const t = setTimeout(() => {
      window.location.replace(LINE_WP_SIGNUP_URL);
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowFallbackButton(true), FALLBACK_BUTTON_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-white">
      <LoadingDots variant="overlay" dotColor={COLOR} />
      {showFallbackButton && (
        <a
          href={LINE_WP_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium py-2.5 px-5 rounded-full border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ color: COLOR, borderColor: COLOR }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLOR;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = COLOR;
          }}
        >
          数秒待っても遷移しない場合はこちら
        </a>
      )}
    </div>
  );
}
