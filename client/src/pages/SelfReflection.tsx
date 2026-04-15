import { useEffect, useMemo, useState } from "react";
import { fetchContentBySlug } from "@/lib/content-loader";

type SelfReflectionContent = {
  ctaUrl: string;
  floatingCtaLabel: string;
  hero: { titleHtml: string; sub: string; ctaLabel: string; bgImageUrl: string };
  eventInfo: {
    label: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    tags: string[];
  };
  issue: { heading: string; items: string[] };
  cause: { boldLead: string; quoteHtml: string; body: string; subCenter: string; ctaLabel: string };
  concept: { copyHtml: string; tagsHtml: string[] };
  steps: {
    heading: string;
    items: { num: string; min: string; title: string; tagline: string; desc?: string }[];
    images: { url: string; alt: string }[];
    ctaLabel: string;
  };
  voices: {
    heading: string;
    sub: string;
    cards: { change: string; quote: string }[];
  };
  safety: {
    heading: string;
    items: { label: string; desc: string }[];
  };
  advisor: {
    photoUrl: string;
    name: string;
    title: string;
    bio: string[];
    highlight: string;
  };
  faq: { heading: string; items: { q: string; a: string }[] };
  closingCta: { heading: string; sub: string; infoDate: string; infoVenueHtml: string; ctaLabel: string };
  footer: { brand: string; brandSub: string; company: string; copyright: string };
};

const STORAGE_KEY = "self_reflection_content_v1";

/** public に置いた実ファイルは .png のみ。JSON が .jpg のままだと表示されないため正規化する */
const SELF_REFLECTION_IMAGE_ALIASES: Record<string, string> = {
  "/self_reflection/hero.jpg": "/self_reflection/hero.png",
  "/self_reflection/advisor.jpg": "/self_reflection/advisor.png",
};

function normalizeSelfReflectionImages(c: SelfReflectionContent): SelfReflectionContent {
  const bg = SELF_REFLECTION_IMAGE_ALIASES[c.hero.bgImageUrl] ?? c.hero.bgImageUrl;
  const photo = SELF_REFLECTION_IMAGE_ALIASES[c.advisor.photoUrl] ?? c.advisor.photoUrl;
  if (bg === c.hero.bgImageUrl && photo === c.advisor.photoUrl) return c;
  return {
    ...c,
    hero: { ...c.hero, bgImageUrl: bg },
    advisor: { ...c.advisor, photoUrl: photo },
  };
}

const DEFAULT_CONTENT: SelfReflectionContent = {
  ctaUrl: "#apply",
  floatingCtaLabel: "自分の言葉を、見つけにいく",
  hero: {
    titleHtml: "面接のたびに、<br>自分を取り繕うことに<br>慣れていませんか。",
    sub: "言葉にならないのは、考えが足りないからじゃない。",
    ctaLabel: "日帰り自己分析合宿に申し込む",
    bgImageUrl: "/self_reflection/hero.png",
  },
  eventInfo: {
    label: "次回開催",
    date: "4月23日（木）",
    time: "14:00 〜 17:00",
    venue: "株式会社ワークアズライフ本社オフィス",
    address: "〒160-0023 東京都新宿区西新宿7丁目16-13 第2手塚ビル4階",
    tags: ["3時間の集中自己分析", "先着3名", "参加費無料"],
  },
  issue: {
    heading: "自己分析の終わりが見えない。",
    items: [
      "何度も自己分析したのに、面接前はいつも不安",
      "面接はそれなりに通るけど、自分らしい自分じゃない気がする",
      "就活の軸を話しても、面接官に刺さっている気がしない",
      "志望動機を書くたびに、作っている感じがしてしまう",
    ],
  },
  cause: {
    boldLead: "自己分析がうまくいかないのは、やり方が悪いからじゃない。",
    quoteHtml:
      "自分にとって自然すぎるものは、自分では問いが立てられない。<br>誰かの問いがあって初めて、自分らしさが言葉になる。",
    body:
      "一人でやり続けると、無意識に「言いやすい答え」に落ち着いてしまう。それは間違いではないけれど、まだ掘れていない層が残っている。",
    subCenter: "誰かと話すと、言葉が見つかる。",
    ctaLabel: "日帰り自己分析合宿に申し込む",
  },
  concept: {
    copyHtml: "もう取り繕わなくていい。<br>自分らしく、しっくりくる言葉を見つける、<br>日帰り自己分析合宿。",
    tagsHtml: [
      "しっかり向き合うために<br>先着3名の少人数制で開催",
      "対話＋ワークショップ形式",
      "3時間の集中自己分析",
      "新宿の（株）ワークアズライフ本社で開催",
      "自然体で話したいので、<br>私服で参加OK",
      "参加費無料",
    ],
  },
  steps: {
    heading: "3時間で、自分の言葉に出会う。",
    items: [
      {
        num: "01",
        min: "10 MIN",
        title: "オリエンテーション",
        tagline: "今日の時間で大切にしてほしいことをお伝えします。",
      },
      {
        num: "02",
        min: "60 MIN",
        title: "棚卸しワークショップ",
        tagline: "過去の経験が、未来と繋がる。",
        desc:
          "これまでの経験・感情を時系列で掘り起こします。「なんでそれを選んだのか」「逆に、やめたことは？」ポジティブもネガティブも、全部が材料になる。",
      },
      {
        num: "03",
        min: "60 MIN",
        title: "言語化を目指す対話",
        tagline: "「なぜそれが大事なのか」を、対話で言葉にしていく。",
        desc:
          "自分では気づいていなかった価値観のパターンが、言葉になっていく。誰かと話すことで初めて出てくる言葉がある。",
      },
      {
        num: "04",
        min: "50 MIN",
        title: "社会との接続",
        tagline: "言語化した軸を、面接で使える言葉に変換する。",
        desc: "腹落ちした言葉は、面接でも自然に出てくる。取り繕わなくても、伝わるようになる。",
      },
    ],
    images: [
      { url: "/self_reflection/image1.png", alt: "対話の様子" },
      { url: "/self_reflection/image2.png", alt: "オフィス空間" },
    ],
    ctaLabel: "日帰り自己分析合宿に申し込む",
  },
  voices: {
    heading: "26卒で参加した人の話。",
    sub: "しっくりくる言葉は、もう自分の中にある。",
    cards: [
      { change: '志望動機が、"企業に合わせて作るもの"から"自然体で語るもの"に変わった。', quote: "「面接で初めて、自分の言葉で話せた気がした。」" },
      { change: "過去の経験に、意味が見つかった。", quote: "「あの経験、就活に関係ないと思ってたけど、全部つながってた。」" },
      { change: "面接で堂々と、自分のことを話せるようになった。", quote: "「うまく話そうとするのをやめたら、逆に伝わるようになった。」" },
      { change: "就活が終わっても、自分の選択に誇りを持てた。", quote: "「内定先を聞かれたとき、なんで選んだのか胸を張って答えられた。」" },
    ],
  },
  safety: {
    heading: "安心して、話せる場所です。",
    items: [
      { label: "一人参加", desc: "友だちと参加していないからこそ、自然体で話せた。初対面だからこそ、先入観なく話せた。参加者のほぼ全員が一人参加です。" },
      { label: "少人数制", desc: "大勢の前で話す必要はありません。隣の人と比べなくていい場所です。先着3名の少人数制。" },
      { label: "雰囲気", desc: "正解を出す場所ではないから、うまく話せなくても大丈夫。私服参加OKです。" },
      { label: "運営への信頼", desc: "マイナビ出資企業が運営。これまで3,000人以上の就活生と伴走してきました。" },
    ],
  },
  advisor: {
    photoUrl: "/self_reflection/advisor.png",
    name: "堺 千菜美",
    title: "株式会社ワークアズライフ｜キャリアアドバイザー",
    bio: [
      "大学3年時に長期インターンとして入社し、文化と人に惹かれてそのまま社員になりました。今年で3年目です。",
      "実は、自分自身の就活は「自分のことがよくわからないまま」1年近く迷い続けました。社会人になってからも、電話営業・マネジメント・教育が重なってキャパオーバーになり、心身ともに疲弊した時期がありました。",
      "それでも今イキイキと働けているのは、「人軸」で選んだ会社と仲間が、くじけた私を見捨てずに支えてくれたからだと思っています。",
      "私とみなさんは他人ですし、誰かの人生を私が決めることはできません。それでも、せっかく関わってくれた人には少しでも良い方向に進んでほしい。そんな思いで、この仕事をしています。",
    ],
    highlight:
      "就活でやっておいた方がいいことは一つだけだと思っています。「自分の火が消えない条件を知ること」。どんな大変さなら乗り越えられるか、どんな環境があれば踏ん張れるか。これを知っておくだけで、社会に出てどんな壁にぶつかっても大丈夫だと思っています。",
  },
  faq: {
    heading: "よくある質問",
    items: [
      { q: "無料なのはなぜですか？", a: "企業への採用サポートで収益を得ているため、学生の皆さんは完全無料で参加できます。" },
      { q: "参加したら必ず企業を紹介されますか？", a: "ありません。合宿はあくまで自己分析の場です。参加後に企業紹介を希望される方にはご相談しますが、それ以上でも以下でもありません。" },
      { q: "参加後、しつこい連絡は来ませんか？", a: "一方的な連絡はしません。次のアクションは必ず皆さんの意思を確認した上で進めます。" },
      { q: "一人で参加しても大丈夫ですか？", a: "参加者のほぼ全員が一人参加です。初対面だからこそ、先入観なく話せる場でもあります。" },
      { q: "自己分析は一度やったことがあります。それでも意味がありますか？", a: "やったことがある方ほど効果を感じています。一人でやると気づけない層が必ずあるからです。" },
      { q: "他の就活サービスと何が違いますか？", a: "企業紹介を前提としたサービスではありません。まず「自分を知る」ことに3時間向き合い、自己理解が深まった状態で就活に臨むことを大切にしています。結果として、自分に合った企業と出会いやすくなります。" },
    ],
  },
  closingCta: {
    heading: "面接のたびに、自分を取り繕うことに慣れていませんか。",
    sub: "しっくりくる言葉は、もう自分の中にある。",
    infoDate: "4月23日（木）14:00 〜 17:00",
    infoVenueHtml:
      "株式会社ワークアズライフ本社オフィス<br>〒160-0023 東京都新宿区西新宿7丁目16-13 第2手塚ビル4階",
    ctaLabel: "日帰り自己分析合宿に申し込む",
  },
  footer: {
    brand: "KANPAIキャリア",
    brandSub: "KANPAI CAREER",
    company: "株式会社ワークアズライフ（マイナビ出資企業）",
    copyright: "© 2026 Work As Life, Inc. All rights reserved.",
  },
};

function safeParseStored(): SelfReflectionContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return normalizeSelfReflectionImages(parsed as SelfReflectionContent);
    return null;
  } catch {
    return null;
  }
}

function safeStore(next: SelfReflectionContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // QuotaExceededError 等は無視（表示は継続）
  }
}

export default function SelfReflection() {
  const [content, setContent] = useState<SelfReflectionContent>(() => {
    if (typeof window === "undefined") return DEFAULT_CONTENT;
    return safeParseStored() ?? DEFAULT_CONTENT;
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const payload = await fetchContentBySlug("self-reflection");
      const remote = (payload as { selfReflection?: SelfReflectionContent } | null)?.selfReflection;
      if (cancelled) return;
      if (remote) {
        const fixed = normalizeSelfReflectionImages(remote);
        setContent(fixed);
        safeStore(fixed);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const css = useMemo(() => {
    return `
:root {
  --brown: #5D4037;
  --brown-light: #8D6E63;
  --brown-dark: #3E2723;
  --brown-pale: #EFEBE9;
  --offwhite: #F5F5F0;
  --white: #FFFFFF;
  --text: #2C1810;
  --text-sub: #6D4C41;
  --border: #D7CCC8;
  --accent: #A1887F;
}
*{ margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
.sr-body {
  background: var(--offwhite);
  color: var(--text);
  font-family: 'Noto Sans JP', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  margin: 0;
  padding: 0;
}
.sr-body img { max-width:100%; display:block; }
.sr-body a { text-decoration:none; color:inherit; }

/* FLOATING CTA */
.float-cta {
  position: fixed; top:20px; right:20px; z-index:999;
  background:var(--brown); color:#fff !important;
  padding:12px 20px; font-size:13px; font-weight:500;
  letter-spacing:0.05em; border:none; cursor:pointer;
  transition:background 0.2s; display:inline-block;
}
.float-cta:visited { color:#fff !important; }
.float-cta:hover { background:var(--brown-dark); }
@media(max-width:768px){
  .float-cta {
    top:auto; right:0; bottom:0; left:0;
    text-align:center; padding:16px;
    font-size:14px;
  }
}

/* HEADER */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 998;
  padding:24px 40px;
  background:var(--offwhite);
  border-bottom:1px solid var(--border);
  text-align:center;
}
.logo-wrap { display:inline-flex; flex-direction:column; align-items:center; gap:4px; }
.logo-main {
  font-family:'Shippori Mincho', serif;
  font-size:22px; font-weight:700;
  color:var(--brown) !important; letter-spacing:0.08em;
}
.logo-sub { font-size:10px; letter-spacing:0.3em; color:var(--brown-light) !important; text-transform:uppercase; }

/* SECTION BASE — .sr-body のみ（Sonner の section などへ漏れないようスコープ） */
.sr-body section { padding:100px 40px; }
.sec-inner { max-width:820px; margin:0 auto; }
.center { text-align:center; }
.left { text-align:left; }

/* HERO */
.hero {
  min-height:100vh;
  background: var(--offwhite);
  display:flex; flex-direction:column; justify-content:center;
  padding:80px 40px;
  padding-top:calc(80px + 86px);
  margin-top:0;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.hero-bg {
  position:absolute; inset:0;
  background:url("${content.hero.bgImageUrl}") center/cover no-repeat;
  opacity:0.18;
}
.hero-inner { position:relative; max-width:760px; margin:0 auto; }
.hero-main-copy {
  font-family:'Shippori Mincho', serif;
  font-size:clamp(24px, 4vw, 42px);
  font-weight:700; line-height:1.6;
  color:var(--text); margin-bottom:32px;
  letter-spacing:0.03em;
}
.hero-sub-copy { font-size:clamp(15px, 2vw, 18px); color:var(--text-sub); margin-bottom:48px; line-height:2; }
.cta-btn {
  display:inline-block;
  background:var(--brown); color:#fff !important;
  padding:18px 40px; font-size:15px; font-weight:500;
  letter-spacing:0.05em; border:none; cursor:pointer;
  transition:background 0.2s; text-align:center;
}
.cta-btn:visited { color:#fff !important; }
.cta-btn:hover { background:var(--brown-dark); }
.cta-btn.large { padding:20px 52px; font-size:16px; }

/* S01-B */
.s01b { background:var(--offwhite); padding:60px 40px; border-top:1px solid var(--border); border-bottom:1px solid var(--border); text-align:center; }
.s01b-inner { max-width:680px; margin:0 auto; border:2px solid var(--brown); padding:48px 40px; }
.s01b-label { font-size:11px; letter-spacing:0.4em; color:var(--brown); text-transform:uppercase; font-weight:700; margin-bottom:32px; }
.s01b-date, .s01b-time { font-family:'Shippori Mincho', serif; font-size:clamp(28px, 5vw, 48px); font-weight:700; color:var(--brown); letter-spacing:0.03em; }
.s01b-date { margin-bottom:8px; }
.s01b-time { margin-bottom:28px; }
.s01b-venue { font-size:14px; color:var(--text-sub); margin-bottom:4px; font-weight:500; }
.s01b-address { font-size:13px; color:var(--text-sub); margin-bottom:28px; }
.s01b-tags { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; }
.s01b-tag { background:var(--brown); color:#fff; padding:8px 20px; font-size:13px; font-weight:500; letter-spacing:0.05em; }

/* Common heading */
.sec-heading {
  font-family:'Shippori Mincho', serif;
  font-size:clamp(22px, 3.5vw, 34px);
  font-weight:700; line-height:1.5;
  margin-bottom:48px; letter-spacing:0.03em;
}

/* S02 */
.s02 { background:var(--white); }
.issue-list { list-style:none; }
.issue-item {
  padding:24px 0; border-bottom:1px solid var(--border);
  display:flex; align-items:flex-start; gap:16px;
  font-size:16px; line-height:1.8; color:var(--text);
}
.issue-item:first-child { border-top:1px solid var(--border); }
.issue-dot { width:8px; height:8px; border-radius:50%; background:var(--brown); margin-top:10px; flex-shrink:0; }

/* S03 */
.s03 { background:var(--offwhite); }
.body-text { font-size:16px; line-height:2; margin-bottom:32px; color:var(--text); }
.body-text.bold { font-weight:700; font-size:17px; }
.blockquote {
  border-left:3px solid var(--brown);
  padding:16px 0 16px 28px;
  margin:32px 0; color:var(--text);
  font-family:'Shippori Mincho', serif;
  font-size:clamp(16px, 2.2vw, 20px);
  font-weight:500; line-height:1.9;
}
.sub-copy-center {
  text-align:center;
  font-family:'Shippori Mincho', serif;
  font-size:clamp(20px, 3vw, 28px);
  font-weight:700; color:var(--text);
  margin:48px 0 40px; letter-spacing:0.03em;
}

/* S04 */
.s04 { background:var(--brown-dark); color:#fff; }
.s04 .sec-heading { color:#fff; text-align:center; }
.concept-copy {
  font-family:'Shippori Mincho', serif;
  font-size:clamp(18px, 2.5vw, 26px);
  font-weight:600; line-height:1.8;
  text-align:center; margin-bottom:56px;
  color:#fff; letter-spacing:0.03em;
}
.tag-grid { display:flex; flex-direction:column; gap:0; max-width:540px; margin:0 auto; }
.concept-tag {
  border-bottom:1px solid rgba(255,255,255,0.2);
  color:#fff; padding:18px 0;
  font-size:15px; line-height:1.6;
  letter-spacing:0.03em; text-align:center;
}
.concept-tag:first-child { border-top:1px solid rgba(255,255,255,0.2); }

/* S05 */
.s05 { background:var(--white); }
.s05 .sec-heading { margin-bottom:12px; }
.step-list { list-style:none; }
.step-item { padding:40px 0; border-bottom:1px solid var(--border); display:grid; grid-template-columns:100px 1fr; gap:24px; }
.step-item:first-child { border-top:1px solid var(--border); }
.step-num-block { display:flex; flex-direction:column; align-items:flex-start; padding-top:4px; }
.step-label { font-size:10px; letter-spacing:0.3em; color:var(--text-sub); text-transform:uppercase; margin-bottom:2px; }
.step-num { font-family:'Shippori Mincho', serif; font-size:48px; font-weight:700; color:var(--brown); line-height:1; margin-bottom:2px; }
.step-min { font-size:11px; letter-spacing:0.1em; color:var(--text-sub); font-weight:500; }
.step-content { padding-top:4px; }
.step-title { font-family:'Shippori Mincho', serif; font-size:clamp(18px, 2.5vw, 22px); font-weight:700; color:var(--text); margin-bottom:8px; }
.step-tagline { font-size:14px; color:var(--text-sub); font-style:italic; margin-bottom:12px; line-height:1.7; }
.step-desc { font-size:15px; line-height:1.9; color:var(--text); }
.step-img-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:40px; margin-bottom:8px; }
.step-img-row img { width:100%; height:280px; object-fit:cover; }
.s05-cta { text-align:center; margin-top:56px; }

/* S06 */
.s06 { background:var(--offwhite); }
.voice-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:8px; }
.voice-card { background:var(--white); padding:32px; border:1px solid var(--border); }
.voice-change { font-family:'Shippori Mincho', serif; font-size:16px; font-weight:700; color:var(--text); margin-bottom:16px; line-height:1.7; }
.voice-quote { font-size:14px; color:var(--text-sub); border-left:2px solid var(--brown-pale); padding-left:14px; line-height:1.8; font-style:italic; }

/* S07 */
.s07 { background:var(--white); }
.safety-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid var(--border); }
.safety-item { padding:32px; border-right:1px solid var(--border); border-bottom:1px solid var(--border); }
.safety-item:nth-child(2n) { border-right:none; }
.safety-item:nth-child(3), .safety-item:nth-child(4) { border-bottom:none; }
.safety-label { font-size:11px; letter-spacing:0.3em; color:var(--brown); text-transform:uppercase; font-weight:700; margin-bottom:12px; }
.safety-desc { font-size:14px; color:var(--text); line-height:1.9; }

/* S08 */
.s08 { background:var(--offwhite); }
.advisor-card { position:relative; overflow:hidden; border-radius:12px; }
.advisor-img-wrap { position:relative; width:100%; }
.advisor-photo { width:100%; display:block; object-fit:contain; background:var(--brown-pale); }
.advisor-overlay { position:absolute; bottom:0; left:0; right:0; padding:40px 48px 36px; background:linear-gradient(to top, rgba(62,39,35,0.92) 0%, rgba(62,39,35,0.78) 60%, rgba(62,39,35,0) 100%); color:#fff; }
.advisor-overlay .advisor-name { font-family:'Shippori Mincho', serif; font-size:clamp(22px, 3vw, 30px); font-weight:700; color:#fff; margin-bottom:4px; }
.advisor-overlay .advisor-title { font-size:13px; color:rgba(255,255,255,0.75); margin-bottom:0; letter-spacing:0.05em; }
.advisor-text { padding:40px 0 0; }
.advisor-bio { font-size:15px; line-height:2; color:var(--text); margin-bottom:20px; }
.advisor-highlight { background:var(--brown-pale); padding:24px 28px; margin:24px 0; font-size:15px; line-height:2; color:var(--text); font-weight:500; border-left:3px solid var(--brown-light); }

/* S09 */
.s09 { background:var(--white); }
.faq-list { list-style:none; }
.faq-item { border-bottom:1px solid var(--border); }
.faq-item:first-child { border-top:1px solid var(--border); }
.faq-q { display:flex; gap:16px; align-items:flex-start; padding:24px 0; cursor:pointer; font-size:15px; font-weight:500; color:var(--text); }
.faq-q-label { color:var(--brown); font-weight:700; flex-shrink:0; }
.faq-q-toggle { margin-left:auto; color:var(--brown-light); font-size:20px; line-height:1; flex-shrink:0; transition:transform 0.2s; }
.faq-item.open .faq-q-toggle { transform:rotate(45deg); }
.faq-a { display:none; padding:0 0 24px 32px; font-size:14px; color:var(--text-sub); line-height:1.9; }
.faq-item.open .faq-a { display:block; }

/* S10 */
.s10 { background:var(--brown-dark); color:#fff; text-align:center; }
.s10 .sec-heading { color:#fff; }
.s10-sub { font-size:18px; color:#A1887F; margin-bottom:40px; font-family:'Shippori Mincho', serif; font-weight:500; }
.s10-info { margin-bottom:48px; }
.s10-date { font-family:'Shippori Mincho', serif; font-size:clamp(22px, 4vw, 36px); font-weight:700; color:#fff; margin-bottom:8px; }
.s10-venue { font-size:14px; color:rgba(255,255,255,0.7); }
.cta-btn.dark-bg { background:#fff; color:var(--brown-dark) !important; font-weight:700; }
.cta-btn.dark-bg:visited { color:var(--brown-dark) !important; }
.cta-btn.dark-bg:hover { background:var(--brown-pale); }

/* Footer */
footer { background:var(--brown-dark); color:rgba(255,255,255,0.6); padding:40px 40px; text-align:center; border-top:1px solid rgba(255,255,255,0.1); }
.footer-logo { font-family:'Shippori Mincho', serif; font-size:18px; font-weight:700; color:#fff; margin-bottom:8px; letter-spacing:0.08em; }
.footer-copy { font-size:12px; letter-spacing:0.05em; }

@media(max-width:768px) {
  .sr-body section { padding:72px 24px; }
  .hero { padding:80px 24px; padding-top:calc(80px + 76px); }
  .s01b { padding:40px 24px; }
  .s01b-inner { padding:32px 24px; }
  .site-header { padding:20px 24px; }
  .voice-grid { grid-template-columns:1fr; }
  .safety-grid { grid-template-columns:1fr; }
  .safety-item:nth-child(2n) { border-right:1px solid var(--border); }
  .safety-item:nth-child(3) { border-bottom:1px solid var(--border); }
  .advisor-overlay { padding:24px 24px 20px; }
  .advisor-text { padding:28px 0 0; }
  .step-item { grid-template-columns:80px 1fr; gap:16px; }
  .step-img-row { grid-template-columns:1fr; }
  .step-img-row img { height:220px; }
  .float-cta { font-size:14px; padding:16px; }
}
`;
  }, [content.hero.bgImageUrl]);

  const faqItems = content.faq.items ?? [];

  return (
    <div className="sr-body">
      <style>{css}</style>

      <a href={content.ctaUrl} className="float-cta">
        {content.floatingCtaLabel}
      </a>

      <header className="site-header">
        <div className="logo-wrap">
          <div className="logo-main">{content.footer.brand}</div>
          <div className="logo-sub">{content.footer.brandSub}</div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-bg" />
        <div className="hero-inner">
          <h1 className="hero-main-copy" dangerouslySetInnerHTML={{ __html: content.hero.titleHtml }} />
          <p className="hero-sub-copy">{content.hero.sub}</p>
          <a href={content.ctaUrl} className="cta-btn large">
            {content.hero.ctaLabel}
          </a>
        </div>
      </section>

      <div className="s01b">
        <div className="s01b-inner">
          <div className="s01b-label">{content.eventInfo.label}</div>
          <div className="s01b-date">{content.eventInfo.date}</div>
          <div className="s01b-time">{content.eventInfo.time}</div>
          <div className="s01b-venue">{content.eventInfo.venue}</div>
          <div className="s01b-address">{content.eventInfo.address}</div>
          <div className="s01b-tags">
            {content.eventInfo.tags.map((t, i) => (
              <span key={`${t}-${i}`} className="s01b-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="s02">
        <div className="sec-inner left">
          <h2 className="sec-heading">{content.issue.heading}</h2>
          <ul className="issue-list">
            {content.issue.items.map((txt, i) => (
              <li key={i} className="issue-item">
                <span className="issue-dot" />
                {txt}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="s03">
        <div className="sec-inner left">
          <p className="body-text bold">{content.cause.boldLead}</p>
          <blockquote className="blockquote" dangerouslySetInnerHTML={{ __html: content.cause.quoteHtml }} />
          <p className="body-text">{content.cause.body}</p>
          <div className="sub-copy-center">{content.cause.subCenter}</div>
          <div style={{ textAlign: "center" }}>
            <a href={content.ctaUrl} className="cta-btn">
              {content.cause.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="s04">
        <div className="sec-inner center">
          <p className="concept-copy" dangerouslySetInnerHTML={{ __html: content.concept.copyHtml }} />
          <div className="tag-grid">
            {content.concept.tagsHtml.map((html, i) => (
              <span key={i} className="concept-tag" dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
        </div>
      </section>

      <section className="s05">
        <div className="sec-inner left">
          <h2 className="sec-heading">{content.steps.heading}</h2>
          <ul className="step-list">
            {content.steps.items.map((s, i) => (
              <li key={i} className="step-item">
                <div className="step-num-block">
                  <span className="step-label">STEP</span>
                  <span className="step-num">{s.num}</span>
                  <span className="step-min">{s.min}</span>
                </div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-tagline">{s.tagline}</div>
                  {s.desc ? <div className="step-desc">{s.desc}</div> : null}
                </div>
              </li>
            ))}
          </ul>
          <div className="step-img-row">
            {content.steps.images.slice(0, 2).map((img, i) => (
              <img key={i} src={img.url} alt={img.alt} loading="lazy" />
            ))}
          </div>
          <div className="s05-cta">
            <a href={content.ctaUrl} className="cta-btn large">
              {content.steps.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="s06">
        <div className="sec-inner center">
          <h2 className="sec-heading">{content.voices.heading}</h2>
          <p
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: "clamp(18px,2.5vw,24px)",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 48,
              letterSpacing: "0.03em",
            }}
          >
            {content.voices.sub}
          </p>
          <div className="voice-grid">
            {content.voices.cards.map((v, i) => (
              <div key={i} className="voice-card">
                <div className="voice-change">{v.change}</div>
                <div className="voice-quote">{v.quote}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s07">
        <div className="sec-inner center">
          <h2 className="sec-heading">{content.safety.heading}</h2>
          <div className="safety-grid">
            {content.safety.items.map((it, i) => (
              <div key={i} className="safety-item">
                <div className="safety-label">{it.label}</div>
                <div className="safety-desc">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s08">
        <div className="sec-inner">
          <div className="advisor-card">
            <div className="advisor-img-wrap">
              <img className="advisor-photo" src={content.advisor.photoUrl} alt={content.advisor.name} loading="lazy" />
              <div className="advisor-overlay">
                <div className="advisor-name">{content.advisor.name}</div>
                <div className="advisor-title">{content.advisor.title}</div>
              </div>
            </div>
          </div>
          <div className="advisor-text">
            {content.advisor.bio.slice(0, 3).map((p, i) => (
              <p key={i} className="advisor-bio">
                {p}
              </p>
            ))}
            <div className="advisor-highlight">{content.advisor.highlight}</div>
            {content.advisor.bio.slice(3).map((p, i) => (
              <p key={`tail-${i}`} className="advisor-bio">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="s09">
        <div className="sec-inner center">
          <h2 className="sec-heading">{content.faq.heading}</h2>
          <ul className="faq-list">
            {faqItems.map((it, i) => {
              const open = openFaqIndex === i;
              return (
                <li key={i} className={`faq-item ${open ? "open" : ""}`}>
                  <div
                    className="faq-q"
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpenFaqIndex(open ? null : i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setOpenFaqIndex(open ? null : i);
                    }}
                    aria-expanded={open}
                  >
                    <span className="faq-q-label">Q</span>
                    {it.q}
                    <span className="faq-q-toggle">+</span>
                  </div>
                  <div className="faq-a">{it.a}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="s10" id="apply">
        <div className="sec-inner center">
          <h2 className="sec-heading" style={{ marginBottom: 16 }}>
            {content.closingCta.heading}
          </h2>
          <p className="s10-sub">{content.closingCta.sub}</p>
          <div className="s10-info">
            <div className="s10-date">{content.closingCta.infoDate}</div>
            <div className="s10-venue" dangerouslySetInnerHTML={{ __html: content.closingCta.infoVenueHtml }} />
          </div>
          <a href={content.ctaUrl} className="cta-btn dark-bg large">
            {content.closingCta.ctaLabel}
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-logo">{content.footer.brand}</div>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
          {content.footer.brandSub}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>{content.footer.company}</div>
        <p className="footer-copy">{content.footer.copyright}</p>
      </footer>
    </div>
  );
}

