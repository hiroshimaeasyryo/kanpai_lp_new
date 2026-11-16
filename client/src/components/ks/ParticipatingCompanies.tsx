import type { ReactNode } from "react";

/**
 * KANPAI就活 LP: 参加企業ブロック（開催情報の直下）
 * 「6業界のラインナップ」で6社を同格に見せ、その下の「参加企業の特徴」で3社を具体的に伝える2段構成。
 * 企業名・ロゴは出さず業界で伝える方針のため、コピーは確定文言をそのまま持つ（CM 編集対象外）。
 */

/** 臙脂。参加企業ブロックは白・黒・臙脂を基調にする指定のため、パレットとは独立させる */
const ENJI = "#8B2500";
/** 罫線。背景色付きカードを並べず、白地に文字と罫線だけで構成するため */
const RULE = "rgba(139, 37, 0, 0.18)";
const MINCHO = { fontFamily: "'Shippori Mincho', serif" } as const;

const HEADING_PARTS = ["東証プライム上場3社を含む、", "大手からベンチャーまで", "6社・6業界が参加。"];

/** 6社を同じ重要度で見せるため、特徴を紹介する3社も他の3社と同じ並びに入れる */
const INDUSTRIES = ["企業支援・BPO", "IT商社", "メーカー", "不動産", "福祉系コンサル", "飲食"];

/** 確定文言 */
const FEATURED_COMPANIES = [
  { industry: "企業支援・BPO", lead: "福利厚生・海外赴任支援など幅広く77社のグループを展開", main: "若手から新規事業にも挑戦できる会社" },
  { industry: "IT商社", lead: "大手×ベンチャーの良いとこどり", main: "日本の中小企業をITの力で強くするIT商社" },
  { industry: "メーカー", lead: "創業60年・フラットな社風", main: "街を守り、未来を塗り替えるペイントメーカー" },
];

/** 読点の後で折り返し、語の途中や1文字だけの改行を防ぐ */
function breakAfterComma(text: string) {
  return text.split(/(?<=、)/).map((part) => (
    <span key={part} className="inline-block">
      {part}
    </span>
  ));
}

type Props = {
  /** ブロック直後の CTA（開催情報・参加企業を見たあとの申し込み導線） */
  cta?: ReactNode;
};

export function ParticipatingCompanies({ cta }: Props) {
  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-xl md:text-3xl font-bold text-lp-text-heading leading-snug text-center mb-8 md:mb-10 opacity-0 animate-fadeUp"
          style={{ ...MINCHO, animationFillMode: "forwards" }}
        >
          {HEADING_PARTS.map((part) => (
            <span key={part} className="inline-block">
              {part}
            </span>
          ))}
        </h2>

        {/* 6業界のラインナップ: 罫線の格子（gap-px の地色）で区切り、6社の文字サイズ・強さ・余白を揃える */}
        <div className="opacity-0 animate-fadeUp" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <ul
            className="grid grid-cols-2 md:grid-cols-3 gap-px border-y"
            style={{ backgroundColor: RULE, borderColor: ENJI }}
          >
            {INDUSTRIES.map((industry) => (
              <li key={industry} className="bg-white flex items-center justify-center text-center px-2 py-5 md:py-7">
                <p className="text-base md:text-xl font-bold text-lp-text-heading leading-snug" style={MINCHO}>
                  {industry}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 参加企業の特徴: カードで囲まず、業界名・補足・メインコピーの文字の強弱と罫線で整理する */}
        <div className="mt-14 md:mt-16 opacity-0 animate-fadeUp" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <h3 className="text-lg md:text-2xl font-bold text-lp-text-heading text-center mb-6 md:mb-8" style={MINCHO}>
            参加企業の特徴
          </h3>
          <ul className="md:grid md:grid-cols-3">
            {FEATURED_COMPANIES.map(({ industry, lead, main }, i) => (
              <li
                key={industry}
                className={`py-6 md:py-2 md:px-6 ${i > 0 ? "border-t md:border-t-0 md:border-l" : ""}`}
                style={{ borderColor: RULE }}
              >
                <p className="text-sm font-bold tracking-wide mb-2" style={{ color: ENJI }}>
                  {industry}
                </p>
                <p className="text-xs md:text-sm text-lp-text-body leading-relaxed mb-2">{lead}</p>
                <p className="text-lg md:text-xl font-bold text-lp-text-heading leading-snug" style={MINCHO}>
                  {breakAfterComma(main)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {cta && <div className="mt-12 md:mt-14">{cta}</div>}
      </div>
    </section>
  );
}
