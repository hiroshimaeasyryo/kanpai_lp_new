/**
 * KANPAI就活 LP: 参加までの3ステップ（旧「学生の参加審査」ブロックの置き換え）
 * 審査ではなく事前説明として案内する運用に変わったため。コピーは確定文言（CM 編集対象外）。
 */

const MINCHO = { fontFamily: "'Shippori Mincho', serif" } as const;

type Props = {
  /** 運営広告経由（flow=rin）か。STEP 01 の補足を予約導線に合わせて出し分ける */
  isRinFlow: boolean;
};

export function JoinSteps({ isRinFlow }: Props) {
  const steps = [
    {
      title: "事前説明を予約する",
      body: isRinFlow ? "都合の良い日時を選ぶだけでOK！" : "LINEの案内から都合の良い日時を選べます。",
    },
    { title: "15分のオンライン事前説明", body: "当日の流れや、人事と話すコツをご案内します。準備は不要です。" },
    { title: "参加を決めて、イベント当日へ！", body: "説明を聞いてから参加を決めても大丈夫です。" },
  ];

  return (
    <section id="join-steps" className="py-24 px-8 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: "forwards" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={MINCHO}>
            参加までの3ステップ
          </h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="p-5 md:p-6 bg-white border border-lp-border rounded-2xl opacity-0 animate-fadeUp"
              style={{ animationDelay: `${0.12 + i * 0.12}s`, animationFillMode: "forwards", borderWidth: "0.5px" }}
            >
              <p className="text-xs font-medium text-lp-primary tracking-widest mb-2">STEP {String(i + 1).padStart(2, "0")}</p>
              <p className="text-base md:text-lg font-bold text-lp-text-heading leading-snug mb-2" style={MINCHO}>
                {/* 読点の後で折り返し、「へ！」だけが次行に落ちるのを防ぐ */}
                {step.title.split(/(?<=、)/).map((part) => (
                  <span key={part} className="inline-block">
                    {part}
                  </span>
                ))}
              </p>
              <p className="text-sm text-lp-text-heading leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
