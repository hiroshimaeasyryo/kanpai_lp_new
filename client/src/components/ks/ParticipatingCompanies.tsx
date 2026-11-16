/**
 * KANPAI就活 LP: 参加企業ブロック（開催情報の直下）
 * 企業名・ロゴは出さず業界で伝える方針のため、コピーは確定文言をそのまま持つ（CM 編集対象外）。
 */

/** 臙脂。参加企業ブロックは白・黒・臙脂を基調にする指定のため、パレットとは独立させる */
const ENJI = "#8B2500";
const MINCHO = { fontFamily: "'Shippori Mincho', serif" } as const;

const HEADING_PARTS = ["東証プライム上場3社を含む、", "大手からベンチャーまで", "6社・6業界が参加。"];

/** copy は確定文言。「｜」の前後で改行して見せるが、文字は変えない */
const MAIN_COMPANIES = [
  { industry: "企業支援・BPO", copy: "福利厚生・海外赴任支援など幅広く77社のグループを展開｜若手から新規事業にも挑戦できる会社" },
  { industry: "IT商社", copy: "大手×ベンチャーの良いとこどり｜日本の中小企業をITの力で強くするIT商社" },
  { industry: "メーカー", copy: "創業60年・フラットな社風｜街を守り、未来を塗り替えるペイントメーカー" },
];

/** 「福祉系コンサル」をスマホの3列で語の途中改行させないため、改行位置を明示する */
const OTHER_INDUSTRIES = [["不動産"], ["福祉系", "コンサル"], ["飲食"]];

const CARD_CLASS = "bg-white border border-lp-border rounded-2xl";

export function ParticipatingCompanies() {
  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-xl md:text-3xl font-bold text-lp-text-heading leading-snug text-center mb-10 opacity-0 animate-fadeUp"
          style={{ ...MINCHO, animationFillMode: "forwards" }}
        >
          {HEADING_PARTS.map((part) => (
            <span key={part} className="inline-block">
              {part}
            </span>
          ))}
        </h2>
        <div className="opacity-0 animate-fadeUp" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {MAIN_COMPANIES.map(({ industry, copy }) => {
              const [lead, main] = copy.split("｜");
              return (
                <li key={industry} className={`${CARD_CLASS} p-5 md:p-6`} style={{ borderWidth: "0.5px", borderTop: `3px solid ${ENJI}` }}>
                  <p className="text-base md:text-lg font-bold mb-2" style={{ ...MINCHO, color: ENJI }}>
                    {industry}
                  </p>
                  <p className="text-xs md:text-sm text-lp-text-body leading-relaxed mb-1">{lead}</p>
                  <p className="text-sm md:text-base font-bold text-lp-text-heading leading-relaxed" style={MINCHO}>
                    {main}
                  </p>
                </li>
              );
            })}
          </ul>
          <ul className="grid grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
            {OTHER_INDUSTRIES.map((parts) => (
              <li
                key={parts.join("")}
                className={`${CARD_CLASS} flex items-center justify-center text-center px-2 py-5 md:py-6`}
                style={{ borderWidth: "0.5px", borderTop: `3px solid ${ENJI}` }}
              >
                <p className="text-base md:text-lg font-bold leading-snug" style={{ ...MINCHO, color: ENJI }}>
                  {parts.map((p) => (
                    <span key={p} className="inline-block">
                      {p}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
