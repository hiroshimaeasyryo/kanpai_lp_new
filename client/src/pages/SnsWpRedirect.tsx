import { useEffect, useState } from "react";
import { LoadingDots } from "@/components/LoadingDots";
import { trackMetaPixelLead } from "@/lib/meta-pixel";

const BASE_URL =
  "https://xp48w7qk.autosns.app/addfriend/s/dgdI2EMpA8/@779ahmbk";
const FREE1_PREFIX = "sns_wp";
const REDIRECT_DELAY_MS = 1500;
const FALLBACK_BUTTON_DELAY_MS = 5000;

const ACCENT = "#5D4037";

function KanpaiCareerLogo() {
  return (
    <div className="flex flex-col items-center gap-1 select-none opacity-15">
      <p
        className="text-5xl font-bold tracking-widest leading-tight"
        style={{ color: "#5a3a28" }}
      >
        KANPAI
      </p>
      <div className="w-48 h-0.5" style={{ backgroundColor: "#5a3a28" }} />
      <p
        className="text-5xl font-bold tracking-widest leading-tight"
        style={{ color: "#5a3a28" }}
      >
        CAREER
      </p>
      <p
        className="text-sm tracking-wider mt-1"
        style={{ color: "#5a3a28" }}
      >
        自分を知れば、自然とつながる。
      </p>
    </div>
  );
}

export default function SnsWpRedirect() {
  const pathSegment = window.location.pathname.replace(/^\//, "");
  const free1 = pathSegment || FREE1_PREFIX;
  const redirectUrl = `${BASE_URL}?free1=${free1}`;

  const [showFallbackButton, setShowFallbackButton] = useState(false);

  useEffect(() => {
    trackMetaPixelLead();
    const t = setTimeout(() => {
      window.location.replace(redirectUrl);
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [redirectUrl]);

  useEffect(() => {
    const t = setTimeout(
      () => setShowFallbackButton(true),
      FALLBACK_BUTTON_DELAY_MS,
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-[#f5f3ef]">
      <KanpaiCareerLogo />
      <LoadingDots variant="overlay" dotColor={ACCENT} />
      {showFallbackButton && (
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium py-2.5 px-5 rounded-full border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            color: ACCENT,
            borderColor: ACCENT,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = ACCENT;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = ACCENT;
          }}
        >
          5秒待っても切り替わらない場合はこちら
        </a>
      )}
    </div>
  );
}
