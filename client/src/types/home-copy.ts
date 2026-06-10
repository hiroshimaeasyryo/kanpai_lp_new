export interface HomeValueItem {
  label: string;
  title: string;
  body: string;
  note?: string;
}

export interface HomeEventFlowStep {
  title: string;
  time: string;
  description: string;
}

export interface HomeVoiceItem {
  quote: string;
  attribution: string;
}

export interface HomeSafetyItem {
  title: string;
  description: string;
}

export interface HomeFaqItem {
  question: string;
  answer: string;
}

import { mergeFieldStylesFromRaw, type HomeCopyFieldStyles } from "@/types/home-copy-style";

export interface HomeCopy {
  hero: {
    titleLine1: string;
    titleLine2: string;
    subcopy: string;
  };
  nav: {
    headerCta: string;
  };
  cta: {
    primaryLabel: string;
    stickyLabel: string;
    footerNote: string;
  };
  nextEvent: {
    eyebrow: string;
    heading: string;
  };
  problem: {
    lead: string;
    paragraph1: string;
    paragraph2: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  values: {
    eyebrow: string;
    heading: string;
    items: HomeValueItem[];
  };
  eventFlow: {
    eyebrow: string;
    heading: string;
    steps: HomeEventFlowStep[];
  };
  voices: {
    eyebrow: string;
    heading: string;
    items: HomeVoiceItem[];
  };
  screening: {
    eyebrow: string;
    heading: string;
    intro: string;
    criteria: string[];
    trustNote: string;
  };
  safety: {
    heading: string;
    subheading: string;
    items: HomeSafetyItem[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: HomeFaqItem[];
  };
  finalCta: {
    headingLine1: string;
    headingLine2: string;
    body: string;
  };
  featuresIntro: {
    eyebrow: string;
    heading: string;
  };
  footer: {
    companyNote: string;
  };
  /** data-cm-id ごとのテキストサイズ・色・フォント・URL */
  fieldStyles?: HomeCopyFieldStyles;
}

export const DEFAULT_HOME_COPY: HomeCopy = {
  hero: {
    titleLine1: "見えないものに、",
    titleLine2: "触れる。",
    subcopy:
      "普段見えない、企業の素と、自分の本音。\n互いが飾らず語らう中で\nあなたなりの正解の手がかりが、見つかる場所。",
  },
  nav: {
    headerCta: "イベントに参加する",
  },
  cta: {
    primaryLabel: "参加申し込みをする",
    stickyLabel: "参加申し込みをする",
    footerNote: "参加費無料 ・ 私服OK ・ 1人参加歓迎",
  },
  nextEvent: {
    eyebrow: "Next Event",
    heading: "次回のイベント詳細",
  },
  problem: {
    lead: "どこを選べばいいのか、「正解」がわからない。",
    paragraph1:
      "説明会やサイトで企業を見ても、\nそこで語られるのは、給料、年間休日、福利厚生のような「条件」や企業の良い面だけ。\n\n企業で働く人の、等身大の声や葛藤は包み隠されたまま。\nそれでは、自分に合うかどうか、確信が持てない。",
    paragraph2:
      "自己分析もやった。就活軸も整理した。\n周りには「いいんじゃない？」と言われる。選考も通る。\nでも、なんかしっくりこない。\n\nまだ自分が気づいていない、大事にしている何かがある気がする。",
  },
  about: {
    eyebrow: "About",
    heading: "KANPAI就活は、\n「見えないもの」に触れる場所。",
    body:
      "お酒を交えた対話の中で、企業と学生が飾らず語り合う、対面イベント。\n\n最初に会社名は伝えません。\n肩書きではなく「人」として出会い、\n条件ではなく「価値観」で語り合う。\n\n就活サイトでは見えないもの、\n説明会では聞けないもの——\nその先にある本質に、触れる時間です。",
  },
  values: {
    eyebrow: "Values",
    heading: "ここで触れられる、3つのこと。",
    items: [
      {
        label: "企業の「素」",
        title: "採用サイトには、載っていないこと。",
        body:
          "会社が今、何に課題を感じていて、どう乗り越えようとしているのか。働く人は、何に葛藤し、何に誇りを持っているのか。\n\nコンプライアンスが厳しいこの時代に、生々しい言葉で語られる、ここだけの話。その「素」を知ることが、入社後のギャップをなくす一番の近道です。",
      },
      {
        label: "自分の「本音」",
        title: "しっくりこない就活軸の、その先へ。",
        body:
          "さまざまな社会人の「やりがい」や「こだわり」に触れる中で、自分が共感する部分、違和感を覚える部分が見えてくる。\n\n誰かに評価されるためではなく、対話を通じて、見つかる本音。それが「人」として出会うからこそ出会い直せる自分です。",
        note: "対話の中で見つかった気づきは、メッセージカードとして持ち帰ることができます。",
      },
      {
        label: "信頼できる人事",
        title: "厳しい参加要件を満たした、信頼して話せる人事との出会い。",
        body:
          "KANPAI就活に参加できる企業には、厳格な基準があります。\n\n学生を対等に見てくれるか。一人ひとりの声に耳を傾けられるか。自社の課題も含め、等身大の姿を見せられるか。温かみのある関係性を大切にしているか。リスペクトのあるフィードバックを学生にできるか。\n\nこの基準を満たした人事だけが、この場にいます。尊敬できる社会人の先輩との出会いは、就活のその先まで続く財産になるはずです。",
      },
    ],
  },
  eventFlow: {
    eyebrow: "Event Flow",
    heading: "当日の過ごし方",
    steps: [
      {
        title: "オリエンテーション",
        time: "10分",
        description: "今日の時間で大切にしてほしいことをお伝えします。",
      },
      {
        title: "KANPAI",
        time: "35分 × 4回",
        description:
          "最初は会社名を伝えず、価値観ゲームからスタート。その後、お酒を交えたフリートーク。「説明」ではなく「対話」。肩書きではなく「人」として語り合う時間。",
      },
      {
        title: "メッセージ交換",
        time: "10分 × 4回",
        description: "各KANPAIの最後に、企業と学生が手書きのメッセージを交換。対話の余韻を、形に残す時間。",
      },
      {
        title: "エンディング",
        time: "5分",
        description: "気になった企業とはLINE交換もOK。次につながる出会いを、あなたのペースで。",
      },
    ],
  },
  voices: {
    eyebrow: "Voices",
    heading: "参加した人の、リアルな声。",
    items: [
      {
        quote:
          "自分が気づいていなかった価値観に気づけた。人事の方の「仕事への葛藤」を聞いて、自分が本当に大事にしたいことが少し見えた気がします。",
        attribution: "早稲田大学 社会科学部 3年",
      },
      {
        quote:
          "説明会では教えてくれない生々しい話が聞けました。会社の課題や、会社の理念に対して、社員が実際にどう感じているのか聞けて興味を持った。",
        attribution: "明治大学 商学部 3年",
      },
      {
        quote:
          "人事の方が本当に一人ひとりを見てくれた。「途中参加でも、積極的に会話に入っていった姿を見て、会社で活躍している姿が浮かんだ」とメッセージカードをもらい、「こんな感じでいいんだ」と思えた。",
        attribution: "順天堂大学大学院 スポーツ健康科学研究科",
      },
      {
        quote:
          "知らなかったけど「いい会社」に出会えた。就活サイトでは見落としていた企業だが、「こんな風に仕事をしたい」と思えた。",
        attribution: "國學院大学 経済学部 3年",
      },
      {
        quote:
          "人事の人に「ito」のルールを教えるところからフリートークが始まって、その後も一緒にほろ酔いになって打ち解けられたので、面接でまた人事の人と話せるのが楽しみになりました。",
        attribution: "日本大学 法学部 3年",
      },
    ],
  },
  screening: {
    eyebrow: "Screening",
    heading: "すべての企業に、\n私たちの基準があります。",
    intro:
      "KANPAI就活は、どんな企業でも参加できるわけではありません。\n私たちが大切にしている価値観に共感し、\n学生一人ひとりと誠実に向き合える企業だけをお迎えしています。",
    criteria: [
      "学生を対等な存在として向き合える",
      "一人ひとりの声に、丁寧に耳を傾けられる",
      "自社の課題も含め、等身大の姿を見せられる",
      "温かみのある関係性を大切にしている",
      "リスペクトのあるフィードバックを学生にできる",
    ],
    trustNote:
      "運営元は、マイナビ出資企業である株式会社ワークアズライフ。\nマイナビが実現できない深い部分にこだわった就活支援を行っています。\n上場企業も参加する、信頼のあるイベントです。",
  },
  safety: {
    heading: "安全開催のための取り組み",
    subheading: "安心して参加いただくために、以下のルールを設けています。",
    items: [
      {
        title: "飲み物は缶で提供",
        description:
          "すべてのドリンクを缶のままお渡しします。開封済みの飲料は使用せず、混入のリスクをゼロにしています。",
      },
      {
        title: "人事と学生の二次会禁止",
        description: "イベント終了後、人事と学生での二次会は禁止としています。安全で健全な関係性を守ります。",
      },
      {
        title: "不適切な参加者への対応",
        description:
          "参加にそぐわない目的の方には、運営より退出をお願いする場合があります。全員が安心できる場を守ります。",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    heading: "よくあるご質問",
    items: [
      {
        question: "お酒が飲めなくても参加できますか？",
        answer:
          "はい、もちろん参加いただけます。ソフトドリンクもご用意しています。お酒はあくまで「飾らない対話」のきっかけです。",
      },
      {
        question: "志望業界が決まっていなくても大丈夫ですか？",
        answer:
          "むしろ、まだ決まっていない方にこそおすすめです。さまざまな業界の社会人と対話する中で、新しい気づきが得られます。",
      },
      {
        question: "どんな企業が参加していますか？",
        answer:
          "大手からベンチャーまで、運営の厳格な基準を通過した企業のみが参加しています。業界は幅広く、毎回異なります。",
      },
      {
        question: "当日エントリーや選考を強要されませんか？",
        answer:
          "一切ありません。対話を楽しんでいただくことが目的です。気になる企業があれば、その後のつながり方はあなた次第です。",
      },
      {
        question: "服装はスーツですか？",
        answer: "私服でお越しください。飾らない、自然体の場です。",
      },
      {
        question: "参加費はかかりますか？",
        answer: "参加費は無料です。飲食も企業様のご提供でご用意しています。",
      },
      {
        question: "交通費はどうやって支払われますか？",
        answer:
          "後日振り込みを予定しています。詳細は予約いただいた方に、運営から2〜3分ほどお電話でお伝えいたします。",
      },
      {
        question: "一人で参加しても大丈夫ですか？",
        answer: "多くの方がお一人で参加されています。アイスブレイクから始まるので、自然に打ち解けられます。",
      },
    ],
  },
  finalCta: {
    headingLine1: "見えないものに、",
    headingLine2: "触れてみよう。",
    body:
      "この時間、この出会いだけで「正解」はわからないかもしれない。\nでも、あなたなりの正解の手がかりは、きっと見つかる。",
  },
  featuresIntro: {
    eyebrow: "Unique Features",
    heading: "他の就活イベントにはない、\n3つの特徴。",
  },
  footer: {
    companyNote: "株式会社ワークアズライフ （マイナビ出資企業）",
  },
};

const HOME_COPY_KEY = "kanpai_home_copy";

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* QuotaExceededError 等 */
  }
}

function mergeString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function mergeItems<T>(
  value: unknown,
  fallback: T[],
  mergeOne: (item: unknown, fb: T) => T,
): T[] {
  if (!Array.isArray(value)) return fallback;
  return fallback.map((fb, i) => mergeOne(value[i], fb));
}

export function mergeHomeCopy(raw: unknown): HomeCopy {
  const base = DEFAULT_HOME_COPY;
  if (!raw || typeof raw !== "object") return base;
  const c = raw as Record<string, unknown>;

  const hero = (c.hero && typeof c.hero === "object" ? c.hero : {}) as Record<string, unknown>;
  const nav = (c.nav && typeof c.nav === "object" ? c.nav : {}) as Record<string, unknown>;
  const cta = (c.cta && typeof c.cta === "object" ? c.cta : {}) as Record<string, unknown>;
  const nextEvent = (c.nextEvent && typeof c.nextEvent === "object" ? c.nextEvent : {}) as Record<string, unknown>;
  const problem = (c.problem && typeof c.problem === "object" ? c.problem : {}) as Record<string, unknown>;
  const about = (c.about && typeof c.about === "object" ? c.about : {}) as Record<string, unknown>;
  const values = (c.values && typeof c.values === "object" ? c.values : {}) as Record<string, unknown>;
  const eventFlow = (c.eventFlow && typeof c.eventFlow === "object" ? c.eventFlow : {}) as Record<string, unknown>;
  const voices = (c.voices && typeof c.voices === "object" ? c.voices : {}) as Record<string, unknown>;
  const screening = (c.screening && typeof c.screening === "object" ? c.screening : {}) as Record<string, unknown>;
  const safety = (c.safety && typeof c.safety === "object" ? c.safety : {}) as Record<string, unknown>;
  const faq = (c.faq && typeof c.faq === "object" ? c.faq : {}) as Record<string, unknown>;
  const finalCta = (c.finalCta && typeof c.finalCta === "object" ? c.finalCta : {}) as Record<string, unknown>;
  const featuresIntro = (c.featuresIntro && typeof c.featuresIntro === "object" ? c.featuresIntro : {}) as Record<string, unknown>;
  const footer = (c.footer && typeof c.footer === "object" ? c.footer : {}) as Record<string, unknown>;

  return {
    hero: {
      titleLine1: mergeString(hero.titleLine1, base.hero.titleLine1),
      titleLine2: mergeString(hero.titleLine2, base.hero.titleLine2),
      subcopy: mergeString(hero.subcopy, base.hero.subcopy),
    },
    nav: {
      headerCta: mergeString(nav.headerCta, base.nav.headerCta),
    },
    cta: {
      primaryLabel: mergeString(cta.primaryLabel, base.cta.primaryLabel),
      stickyLabel: mergeString(cta.stickyLabel, base.cta.stickyLabel),
      footerNote: mergeString(cta.footerNote, base.cta.footerNote),
    },
    nextEvent: {
      eyebrow: mergeString(nextEvent.eyebrow, base.nextEvent.eyebrow),
      heading: mergeString(nextEvent.heading, base.nextEvent.heading),
    },
    problem: {
      lead: mergeString(problem.lead, base.problem.lead),
      paragraph1: mergeString(problem.paragraph1, base.problem.paragraph1),
      paragraph2: mergeString(problem.paragraph2, base.problem.paragraph2),
    },
    about: {
      eyebrow: mergeString(about.eyebrow, base.about.eyebrow),
      heading: mergeString(about.heading, base.about.heading),
      body: mergeString(about.body, base.about.body),
    },
    values: {
      eyebrow: mergeString(values.eyebrow, base.values.eyebrow),
      heading: mergeString(values.heading, base.values.heading),
      items: mergeItems(values.items, base.values.items, (item, fb) => {
        const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          label: mergeString(o.label, fb.label),
          title: mergeString(o.title, fb.title),
          body: mergeString(o.body, fb.body),
          note: o.note === undefined ? fb.note : mergeString(o.note, fb.note ?? ""),
        };
      }),
    },
    eventFlow: {
      eyebrow: mergeString(eventFlow.eyebrow, base.eventFlow.eyebrow),
      heading: mergeString(eventFlow.heading, base.eventFlow.heading),
      steps: mergeItems(eventFlow.steps, base.eventFlow.steps, (item, fb) => {
        const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          title: mergeString(o.title, fb.title),
          time: mergeString(o.time, fb.time),
          description: mergeString(o.description, fb.description),
        };
      }),
    },
    voices: {
      eyebrow: mergeString(voices.eyebrow, base.voices.eyebrow),
      heading: mergeString(voices.heading, base.voices.heading),
      items: mergeItems(voices.items, base.voices.items, (item, fb) => {
        const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          quote: mergeString(o.quote, fb.quote),
          attribution: mergeString(o.attribution, fb.attribution),
        };
      }),
    },
    screening: {
      eyebrow: mergeString(screening.eyebrow, base.screening.eyebrow),
      heading: mergeString(screening.heading, base.screening.heading),
      intro: mergeString(screening.intro, base.screening.intro),
      criteria: mergeItems(screening.criteria, base.screening.criteria, (item, fb) =>
        mergeString(item, fb),
      ),
      trustNote: mergeString(screening.trustNote, base.screening.trustNote),
    },
    safety: {
      heading: mergeString(safety.heading, base.safety.heading),
      subheading: mergeString(safety.subheading, base.safety.subheading),
      items: mergeItems(safety.items, base.safety.items, (item, fb) => {
        const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          title: mergeString(o.title, fb.title),
          description: mergeString(o.description, fb.description),
        };
      }),
    },
    faq: {
      eyebrow: mergeString(faq.eyebrow, base.faq.eyebrow),
      heading: mergeString(faq.heading, base.faq.heading),
      items: Array.isArray(faq.items) && faq.items.length > 0
        ? faq.items.map((item, i) => {
            const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            const fb = base.faq.items[i] ?? { question: "", answer: "" };
            return {
              question: mergeString(o.question, fb.question),
              answer: mergeString(o.answer, fb.answer),
            };
          })
        : base.faq.items,
    },
    finalCta: {
      headingLine1: mergeString(finalCta.headingLine1, base.finalCta.headingLine1),
      headingLine2: mergeString(finalCta.headingLine2, base.finalCta.headingLine2),
      body: mergeString(finalCta.body, base.finalCta.body),
    },
    featuresIntro: {
      eyebrow: mergeString(featuresIntro.eyebrow, base.featuresIntro.eyebrow),
      heading: mergeString(featuresIntro.heading, base.featuresIntro.heading),
    },
    footer: {
      companyNote: mergeString(footer.companyNote, base.footer.companyNote),
    },
    fieldStyles: mergeFieldStylesFromRaw(c.fieldStyles, base.fieldStyles),
  };
}

export function getStoredHomeCopy(): HomeCopy {
  if (typeof window === "undefined") return DEFAULT_HOME_COPY;
  const stored = safeGetItem(HOME_COPY_KEY);
  if (!stored) return DEFAULT_HOME_COPY;
  try {
    return mergeHomeCopy(JSON.parse(stored));
  } catch {
    return DEFAULT_HOME_COPY;
  }
}

export function setStoredHomeCopy(copy: HomeCopy): void {
  if (typeof window === "undefined") return;
  safeSetItem(HOME_COPY_KEY, JSON.stringify(copy));
}

/** campaign2603 向けデフォルト CTA 文言 */
export const CAMPAIGN2603_HOME_CTA = {
  primaryLabel: "地方からの参加もお気軽に",
  stickyLabel: "キャンペーンで申し込み",
};

/** FAQ の交通費項目 ID（campaign2603 のみ表示） */
export const CAMPAIGN2603_FAQ_QUESTION = "交通費はどうやって支払われますか？";
