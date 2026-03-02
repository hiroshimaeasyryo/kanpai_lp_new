/**
 * 洗練されたバウンスするローディングドット（5つの球が順番に跳ね、伸縮は控えめ＋フェードで統一）
 * @param variant - 'page': 画面全体の中央に表示（ThanksKs用） / 'overlay': ドットのみ（親でオーバーレイに配置）
 * @param dotColor - ドットの色（例: '#e61874'）。未指定時はデフォルトのブラウン系
 */
export function LoadingDots({
  variant = "page",
  dotColor,
}: { variant?: "page" | "overlay"; dotColor?: string }) {
  const gradient = dotColor
    ? `radial-gradient(circle at 50% 50%, ${dotColor}f2 0%, ${dotColor}80 60%, ${dotColor}33 100%)`
    : `radial-gradient(circle at 50% 50%, rgb(212 132 75 / 0.95) 0%, rgb(212 132 75 / 0.5) 60%, rgb(212 132 75 / 0.2) 100%)`;
  const shadow = dotColor
    ? `0 0 12px ${dotColor}40`
    : "0 0 12px rgb(212 132 75 / 0.25)";

  const dots = (
    <>
      <div className="flex items-end gap-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="loading-dot block w-4 h-4 rounded-full animate-[loading-dot-bounce_1.2s_ease-in-out_infinite]"
            style={{
              transformOrigin: "center bottom",
              animationDelay: `${i * 0.14}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        .loading-dot {
          background: ${gradient};
          box-shadow: ${shadow};
        }
        @keyframes loading-dot-bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          16% {
            transform: translateY(-20px) scale(1.03);
            opacity: 1;
          }
          32% {
            transform: translateY(0) scale(0.98);
            opacity: 0.65;
          }
          48% {
            transform: translateY(-8px) scale(1.01);
            opacity: 0.9;
          }
          64% {
            transform: translateY(0) scale(0.99);
            opacity: 0.7;
          }
          80% {
            transform: translateY(-2px) scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );

  if (variant === "overlay") {
    return <div aria-label="読み込み中">{dots}</div>;
  }
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-background"
      aria-label="読み込み中"
    >
      {dots}
    </div>
  );
}
