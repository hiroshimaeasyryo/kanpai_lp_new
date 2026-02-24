import { useEffect } from "react";

const REDIRECT_URL =
  "https://xp48w7qk.autosns.app/addfriend/s/U2gUDIzwJh/@779ahmbk?free2=sns_ks2027";
const REDIRECT_DELAY_MS = 10; // 0.01秒

/**
 * /thanks_ks クッションページ
 * - Meta Facebook Pixel を head に注入
 * - 0.01秒後に指定URLへリダイレクト
 */
export default function ThanksKs() {
  useEffect(() => {
    // 既に注入済みの場合はスキップ
    if (document.getElementById("fb-pixel-thanks-ks")) return;

    // Facebook Pixel Code
    const script = document.createElement("script");
    script.id = "fb-pixel-thanks-ks";
    script.textContent = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '552186969429990');
fbq('track', 'PageView');
`;
    document.head.appendChild(script);

    // noscript フォールバック（JS無効時用）
    const noscript = document.createElement("noscript");
    const img = document.createElement("img");
    img.setAttribute("height", "1");
    img.setAttribute("width", "1");
    img.setAttribute(
      "src",
      "https://www.facebook.com/tr?id=552186969429990&ev=PageView&noscript=1"
    );
    img.setAttribute("alt", "");
    noscript.appendChild(img);
    document.head.appendChild(noscript);

    // 0.01秒後にリダイレクトする meta refresh（JS無効時もリダイレクト）
    const metaRefresh = document.createElement("meta");
    metaRefresh.setAttribute("http-equiv", "refresh");
    metaRefresh.setAttribute(
      "content",
      `0.01;URL=${REDIRECT_URL}`
    );
    document.head.appendChild(metaRefresh);

    // 0.01秒後にリダイレクト（JSで明示的に遷移）
    const t = setTimeout(() => {
      window.location.replace(REDIRECT_URL);
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-background"
      aria-label="読み込み中"
    >
      {/* 同じ大きさの球が5つ、順番にバウンド */}
      <div className="flex items-end gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block w-8 h-8 rounded-full bg-primary/90 animate-[blob-bounce_0.9s_ease-in-out_infinite]"
            style={{
              transformOrigin: "center bottom",
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes blob-bounce {
          0%, 100% {
            transform: translateY(0) scaleX(1) scaleY(1);
          }
          18% {
            transform: translateY(-32px) scaleX(0.88) scaleY(1.18);
          }
          36% {
            transform: translateY(0) scaleX(1.24) scaleY(0.76);
          }
          54% {
            transform: translateY(-12px) scaleX(0.96) scaleY(1.06);
          }
          72% {
            transform: translateY(0) scaleX(1.08) scaleY(0.92);
          }
        }
      `}</style>
    </div>
  );
}
