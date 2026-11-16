/**
 * KANPAI就活 LP: 参加企業ブロック（開催情報の直下）
 * 企業名・ロゴは出さず業界で伝える方針のため、コピーは確定文言をそのまま持つ（CM 編集対象外）。
 */

/** 臙脂。参加企業ブロックは白・黒・臙脂を基調にする指定のため、パレットとは独立させる */
const ENJI = "#8B2500";
/** 枠線だけだと情報の強弱が出ないため、臙脂をごく薄く敷いた面でカードを作る */
const ENJI_TINT = "rgba(139, 37, 0, 0.05)";
const MINCHO = { fontFamily: "'Shippori Mincho', serif" } as const;

const HEADING_PARTS = ["東証プライム上場3社を含む、", "大手からベンチャーまで", "6社・6業界が参加。"];

/** 確定文言（旧「補足文｜メインコピー」を補足文とメインコピーに分けて持つ） */
const MAIN_COMPANIES = [
  { industry: "企業支援・BPO", lead: "福利厚生・海外赴任支援など幅広く77社のグループを展開", main: "若手から新規事業にも挑戦できる会社" },
  { industry: "IT商社", lead: "大手×ベンチャーの良いとこどり", main: "日本の中小企業をITの力で強くするIT商社" },
  { industry: "メーカー", lead: "創業60年・フラットな社風", main: "街を守り、未来を塗り替えるペイントメーカー" },
];

const OTHER_INDUSTRIES = ["不動産", "福祉系コンサル", "飲食"];

/** 上3社と下3業界で業界名の見た目を揃え、6社が同じ並びに見えるようにする */
const INDUSTRY_CLASS = "text-base md:text-lg font-bold leading-snug";

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
            {MAIN_COMPANIES.map(({ industry, lead, main }) => (
              <li key={industry} className="rounded-2xl px-5 py-6 md:px-6 md:py-7" style={{ backgroundColor: ENJI_TINT }}>
                <p className={`${INDUSTRY_CLASS} mb-3`} style={{ color: ENJI }}>
                  {industry}
                </p>
                <p className="text-xs md:text-sm text-lp-text-body leading-relaxed mb-1.5">{lead}</p>
                <p className="text-base md:text-xl font-bold text-lp-text-heading leading-snug" style={MINCHO}>
                  {/* 読点の後で折り返し、語の途中や1文字だけの改行を防ぐ */}
                  {main.split(/(?<=、)/).map((part) => (
                    <span key={part} className="inline-block">
                      {part}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
            {OTHER_INDUSTRIES.map((industry) => (
              <li
                key={industry}
                className="rounded-2xl px-5 py-4 md:px-6 md:py-5 md:text-center"
                style={{ backgroundColor: ENJI_TINT }}
              >
                <p className={INDUSTRY_CLASS} style={{ color: ENJI }}>
                  {industry}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
