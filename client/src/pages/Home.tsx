/* Wa-Modern Minimalism Design Philosophy
   - 間（Ma）の美学: 余白を積極的に活用し、視覚的な呼吸空間を作る
   - 温かみのある対話性: 手書き風要素とソフトなインタラクション
   - 誠実な透明性: 飾らない、正直な表現を視覚的に体現
   - 静かな力強さ: 控えめながら印象的なビジュアル階層
   - カラー: アンバー/ブラウン (#d4844b, #5C3D2E) + クリーム/ベージュ (#fffaf5, #f5e6cd)
   - タイポグラフィ: Shippori Mincho (見出し) + Zen Kaku Gothic New (本文)
*/

import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { getStoredEventImages, migrateOldImageFormat } from "@/lib/content-settings";
import type { KanpaiEvent } from "@/types/events";
import { getNextEvent } from "@/types/events";

export default function Home() {
  useSmoothScroll();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [nextEvent, setNextEvent] = useState<KanpaiEvent | null>(null);
  const [eventImages, setEventImages] = useState<string[]>([]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setNextEvent(getNextEvent());

    // イベント画像を読み込む（新形式 → 旧形式 → デフォルト）
    const stored = getStoredEventImages();
    if (stored && stored.length > 0) {
      setEventImages(stored.map((img) => img.url));
    } else {
      const migrated = migrateOldImageFormat();
      if (migrated && migrated.length > 0) {
        setEventImages(migrated.map((img) => img.url));
      }
      // デフォルト画像は空配列のまま（fallback は非表示）
    }

    // ロゴ: 管理画面で設定されていればそれを使用、なければ public/logo.png を参照
    const logo = localStorage.getItem("kanpai_logo");
    setLogoUrl(logo || "/logo.png");
  }, []);

  // /logo.png が存在しない場合（404）はデフォルトの SVG に切り替え
  const handleLogoError = () => setLogoUrl(null);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-transparent transition-all duration-300" id="nav">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-lp-text-heading no-underline">
            {logoUrl ? (
              <img src={logoUrl} alt="KANPAI就活ロゴ" className="h-6 w-auto object-contain" onError={handleLogoError} />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                <path d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10l4-4m12 4l-4-4" stroke="var(--lp-primary)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            <span className="font-bold text-sm tracking-wide">KANPAI就活</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="#apply" className="px-5 py-2 bg-lp-primary text-white text-xs font-medium rounded-full transition-colors hover:bg-lp-primary-hover">
              イベントに参加する
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-14 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-10 -right-8 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-accent-light) 20%, transparent) 0%, transparent 70%)' }}></div>
          <div className="absolute w-64 h-64 -bottom-5 -left-5 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-primary) 10%, transparent) 0%, transparent 70%)' }}></div>
          <div className="absolute w-48 h-48 top-20 left-10 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-bg-card) 35%, transparent) 0%, transparent 70%)' }}></div>
        </div>
        <div className="relative z-10 text-center max-w-2xl px-6">
          {logoUrl ? (
            <img src={logoUrl} alt="KANPAI就活ロゴ" className="w-12 h-12 mx-auto mb-9 opacity-0 animate-fadeUp object-contain" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }} onError={handleLogoError} />
          ) : (
            <svg className="w-12 h-12 mx-auto mb-9 opacity-0 animate-fadeUp" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }} viewBox="0 0 52 52" fill="none">
              <path d="M12 38V16c0-3 2-5 4-6l3-2v30m0 0c0 0-2 0-2-2v-2" stroke="var(--lp-text-heading)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40 38V16c0-3-2-5-4-6l-3-2v30m0 0c0 0 2 0 2-2v-2" stroke="var(--lp-text-heading)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 10l4-5m14 5l-4-5" stroke="var(--lp-primary)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          <h1 className="text-5xl md:text-6xl font-bold text-lp-text-heading mb-8 leading-tight opacity-0 animate-fadeUp" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', fontFamily: "'Shippori Mincho', serif" }}>
            <span className="whitespace-nowrap">見えないものに、</span> <span className="whitespace-nowrap">触れる。</span>
          </h1>
          <p className="text-base md:text-lg text-lp-text-body mb-11 leading-loose opacity-0 animate-fadeUp" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', fontFamily: "'Shippori Mincho', serif" }}>
            普段見えない、企業の素と、自分の本音。<br/>互いが飾らず語らう中で<br/>あなたなりの正解の手がかりが、見つかる場所。
          </p>
          <a href="#apply" className="inline-flex items-center gap-2 px-10 py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5 opacity-0 animate-fadeUp" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            次回のイベントを見る
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10m-4-4l4 4-4 4"/>
            </svg>
          </a>
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 opacity-0 animate-fadeIn" style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}>
          <div className="w-0.5 h-9 bg-lp-primary mx-auto opacity-50 animate-float"></div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
            <p className="text-lg md:text-2xl text-lp-text-heading leading-relaxed" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              どこを選べばいいのか、<em className="font-bold bg-gradient-to-r from-transparent via-[#ffd7c3] to-transparent bg-no-repeat bg-[length:100%_60%] bg-[position:0_60%]" style={{ fontStyle: 'normal' }}>「正解」がわからない。</em>
            </p>
          </div>
          <div className="w-12 h-0.5 bg-lp-primary rounded mx-auto my-9 opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}></div>
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }}>
            <p className="text-sm md:text-base text-lp-text-body leading-loose max-w-xl mx-auto" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              説明会やサイトで企業を見ても、<br/>そこで語られるのは、給料、年間休日、福利厚生のような「条件」や企業の良い面だけ。<br/><br/>企業で働く人の、等身大の声や葛藤は包み隠されたまま。<br/>それでは、自分に合うかどうか、確信が持てない。
            </p>
          </div>
          <div className="w-12 h-0.5 bg-lp-primary rounded mx-auto my-9 opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}></div>
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.36s', animationFillMode: 'forwards' }}>
            <p className="text-sm md:text-base text-lp-text-body leading-loose max-w-xl mx-auto" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              自己分析もやった。就活軸も整理した。<br/>周りには「いいんじゃない？」と言われる。選考も通る。<br/>でも、なんかしっくりこない。<br/><br/><em className="font-bold" style={{ fontStyle: 'normal' }}>まだ自分が気づいていない、大事にしている何かがある気がする。</em>
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-lp-bg-warm">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">About</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              KANPAI就活は、<br/>「見えないもの」に触れる場所。
            </h2>
          </div>
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
            <p className="text-sm md:text-base text-lp-text-heading leading-loose text-center mb-11" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              お酒を交えた対話の中で、企業と学生が飾らず語り合う、対面イベント。<br/><br/>最初に会社名は伝えません。<br/>肩書きではなく「人」として出会い、<br/>条件ではなく「価値観」で語り合う。<br/><br/>就活サイトでは見えないもの、<br/>説明会では聞けないもの——<br/>その先にある本質に、触れる時間です。
            </p>
          </div>
          {eventImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 opacity-0 animate-fadeUp" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }}>
              {eventImages.map((url, i) => (
                <div key={i} className="aspect-video bg-lp-bg-card rounded-lg overflow-hidden">
                  <img src={url} alt={`KANPAI就活イベントの様子${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              ここで触れられる、3つのこと。
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                label: "企業の「素」",
                title: "採用サイトには、載っていないこと。",
                body: "会社が今、何に課題を感じていて、どう乗り越えようとしているのか。働く人は、何に葛藤し、何に誇りを持っているのか。\n\nコンプライアンスが厳しいこの時代に、生々しい言葉で語られる、ここだけの話。その「素」を知ることが、入社後のギャップをなくす一番の近道です。",
              },
              {
                num: "02",
                label: "自分の「本音」",
                title: "しっくりこない就活軸の、その先へ。",
                body: "さまざまな社会人の「やりがい」や「こだわり」に触れる中で、自分が共感する部分、違和感を覚える部分が見えてくる。\n\n誰かに整理してもらうのではなく、対話を通じて、自分の中から見つかる。それが、KANPAI就活で起きている自己発見です。",
                note: "対話の中で見つかった気づきは、メッセージカードとして形に残ります。",
              },
              {
                num: "03",
                label: "信頼できる人事",
                title: "厳しい参加要件を満たした、信頼して話せる人事との出会い。",
                body: "KANPAI就活に参加できる企業には、厳格な基準があります。\n\n学生を対等に見てくれるか。一人ひとりの声に耳を傾けられるか。自社の課題も含め、等身大の姿を見せられるか。温かみのある関係性を大切にしているか。\n\nこの基準を満たした人事だけが、この場にいます。だから、安心して本音で話せる。尊敬できる社会人の先輩との出会いは、就活のその先まで続く財産になるはずです。",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-lp-border rounded-3xl p-10 hover:shadow-lg hover:-translate-y-0.5 transition-all opacity-0 animate-fadeUp" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                <div className="flex gap-6 mb-6">
                  <div className="text-4xl font-bold text-[#ffd7c3]" style={{ fontFamily: "'Shippori Mincho', serif" }}>{item.num}</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-1">{item.label}</p>
                    <h3 className="text-xl font-bold text-lp-text-heading leading-tight mb-3" style={{ fontFamily: "'Shippori Mincho', serif" }}>{item.title}</h3>
                    <p className="text-sm text-lp-text-heading leading-relaxed whitespace-pre-line">{item.body}</p>
                    {item.note && (
                      <div className="mt-4 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--lp-accent-light) 10%, transparent) 0%, color-mix(in srgb, var(--lp-bg-card) 20%, transparent) 100%)', borderLeft: '4px solid var(--lp-accent-light)' }}>
                        <p className="text-sm text-lp-text-heading">{item.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Flow Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">Event Flow</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              当日の過ごし方
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-lp-primary to-lp-accent-light"></div>
            {[
              { num: "01", title: "オリエンテーション", time: "10分", desc: "今日の時間で大切にしてほしいことをお伝えします。" },
              { num: "02", title: "KANPAI", time: "35分 × 4回", desc: "最初は会社名を伝えず、価値観ゲームからスタート。その後、お酒を交えたフリートーク。「説明」ではなく「対話」。肩書きではなく「人」として語り合う時間。" },
              { num: "03", title: "メッセージ交換", time: "10分 × 4回", desc: "各KANPAIの最後に、企業と学生が手書きのメッセージを交換。対話の余韻を、形に残す時間。" },
              { num: "04", title: "エンディング", time: "5分", desc: "気になった企業とはLINE交換もOK。次につながる出会いを、あなたのペースで。" },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 mb-8 opacity-0 animate-fadeUp" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'forwards' }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-lp-primary flex items-center justify-center font-bold text-lp-text-heading relative z-10" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                  {item.num}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-lp-text-heading mb-1" style={{ fontFamily: "'Shippori Mincho', serif" }}>{item.title}</h3>
                  <p className="text-xs text-lp-primary font-medium mb-1">{item.time}</p>
                  <p className="text-sm text-lp-text-body leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">Unique Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              他の就活イベントにはない、<br/>3つの特徴。
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "ありきたりでちょっと退屈な開始直後の「企業紹介タイム」なし",
                body: "多くの就活イベントにある、10分弱の企業プレゼン。正直、採用サイトに書いてあることとほとんど同じで、あまり記憶に残らない。\n\nKANPAI就活では、その時間をすべて対話に充てています。会社名すら最初は伝えない。先入観なく「人」として出会うところから始まります。",
              },
              {
                num: "02",
                title: "最初はカジュアルに、話しやすく。就活版 ito",
                body: "いきなり「自己紹介どうぞ」は、誰だって緊張する。\n\nKANPAI就活では、人気カードゲーム「ito」の就活版をアイスブレイクに導入。お互いの価値観や考え方が自然と見えてくるゲームで、発言のハードルを下げ、心理的安全性を高めた状態でフリートークに入れます。",
              },
              {
                num: "03",
                title: "対話の余韻を、形に残す。メッセージカードの交換",
                body: "各KANPAIの最後に、企業の人事と学生が手書きのメッセージを交換します。\n\n対話の中で感じた「あなたの良さ」や「気づき」が、言葉として手元に残る。良い時間の余韻を壊さず、温かみのある形で次の出会いにつながっていきます。",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-lp-border rounded-3xl p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all opacity-0 animate-fadeUp" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-hover flex items-center justify-center text-white font-bold text-sm mb-4 shadow-md" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                  {item.num}
                </div>
                <h3 className="text-lg font-bold text-lp-text-heading leading-tight mb-3" style={{ fontFamily: "'Shippori Mincho', serif" }}>{item.title}</h3>
                <p className="text-sm text-lp-text-heading leading-relaxed whitespace-pre-line">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voices Section */}
      <section className="py-24 px-6 bg-lp-bg-warm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">Voices</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              参加した人の、リアルな声。
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "自分が気づいていなかった価値観に気づけた。人事の方の「仕事への葛藤」を聞いて、自分が本当に大事にしたいことが少し見えた気がします。",
              "説明会では絶対聞けない話が聞けた。会社の良い面だけでなく、今の課題を正直に話してくれたことに信頼を感じました。",
              "人事の方が本当に一人ひとりを見てくれていた。メッセージカードに書かれた言葉を読んで、思わず泣きそうになりました。",
              "就活イベントのイメージが変わった。「使われている感」がゼロ。対等に話してくれる空気感が心地よかったです。",
              "知らなかったけど「いい会社」に出会えた。就活サイトでは絶対見つけられない企業を、人を通じて知れるのが良かった。",
              "もらったメッセージカードを、今でも手帳に挟んでいます。就活で初めて「温かい」と思えた経験でした。",
            ].map((quote, i) => (
              <div key={i} className="bg-white border border-lp-border rounded-2xl p-6 opacity-0 animate-fadeUp" style={{ animationDelay: `${(i % 3) * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                <p className="text-sm text-lp-text-muted leading-relaxed mb-4 border-l-3 border-lp-primary pl-4" style={{ fontFamily: "'Shippori Mincho', serif" }}>{quote}</p>
                <p className="text-xs text-lp-text-body font-medium">
                  {["早稲田大学 社会科学部 3年", "明治大学 商学部 3年", "青山学院大学 経営学部 3年", "法政大学 社会学部 3年", "慶應義塾大学 経済学部 3年", "立教大学 文学部 3年"][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screening Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">Screening</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              すべての企業に、<br/>私たちの基準があります。
            </h2>
          </div>
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
            <p className="text-sm md:text-base text-lp-text-heading leading-loose text-center mb-9">
              KANPAI就活は、どんな企業でも参加できるわけではありません。<br/>私たちが大切にしている価値観に共感し、<br/>学生一人ひとりと誠実に向き合える企業だけをお迎えしています。
            </p>
          </div>
          <div className="space-y-3 mb-9">
            {[
              "学生を対等な存在として向き合える",
              "一人ひとりの声に、丁寧に耳を傾けられる",
              "自社の課題も含め、等身大の姿を見せられる",
              "温かみのある関係性を大切にしている",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white border border-lp-border rounded-2xl opacity-0 animate-fadeUp" style={{ animationDelay: `${0.12 + i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-lp-bg-warm flex items-center justify-center text-lp-primary mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 4L6 11L3 8"/>
                  </svg>
                </div>
                <p className="text-sm text-lp-text-heading pt-0.5">{item}</p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-lp-bg-warm rounded-2xl text-center opacity-0 animate-fadeUp" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <p className="text-sm text-lp-text-heading">
              運営元は、マイナビ出資企業である<strong>株式会社ワークアズライフ</strong>。<br/>マイナビが実現できない深い部分にこだわった就活支援を行っています。<br/>上場企業も参加する、信頼のあるイベントです。
            </p>
          </div>
        </div>
      </section>

      {/* Event Overview Section */}
      <section className="py-24 px-6 bg-lp-bg-warm">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">Event Overview</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              イベント概要
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-9">
            {(
              nextEvent
                ? [
                    { label: "参加学生", value: `先着${nextEvent.studentsCount}名` },
                    { label: "参加企業数", value: `${nextEvent.companiesCount}社` },
                    { label: "場所", value: nextEvent.location, note: nextEvent.locationNote ?? undefined },
                    { label: "時間", value: nextEvent.timeRange || nextEvent.dateLabel, note: nextEvent.timeNote ?? undefined },
                  ]
                : [
                    { label: "参加学生", value: "先着20名" },
                    { label: "参加企業数", value: "4社" },
                    { label: "場所", value: "新宿近辺の居酒屋", note: "※詳細は参加確定後にご案内" },
                    { label: "時間", value: "16:00 – 20:00", note: "夕方〜夜にかけて" },
                  ]
            ).map((item, i) => (
              <div key={i} className="p-5 bg-white border border-lp-border rounded-2xl text-center opacity-0 animate-fadeUp" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                <p className="text-xs text-lp-primary font-medium uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-xl font-bold text-lp-text-heading" style={{ fontFamily: "'Shippori Mincho', serif" }}>{item.value}</p>
                {item.note && <p className="text-xs text-lp-primary mt-1">{item.note}</p>}
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-bold text-lp-text-heading text-center mb-2" style={{ fontFamily: "'Shippori Mincho', serif" }}>安全開催のための取り組み</h3>
            <p className="text-xs text-lp-primary text-center mb-5">安心して参加いただくために、以下のルールを設けています。</p>
            <div className="space-y-3">
              {[
                { icon: "bottle", title: "飲み物は缶で提供", desc: "すべてのドリンクを缶のままお渡しします。開封済みの飲料は使用せず、混入のリスクをゼロにしています。" },
                { icon: "ban", title: "人事と学生の二次会禁止", desc: "イベント終了後、人事と学生での二次会は禁止としています。安全で健全な関係性を守ります。" },
                { icon: "shield", title: "不適切な参加者への対応", desc: "参加にそぐわない目的の方には、運営より退出をお願いする場合があります。全員が安心できる場を守ります。" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white border border-lp-border rounded-2xl opacity-0 animate-fadeUp" style={{ animationDelay: `${0.6 + i * 0.12}s`, animationFillMode: 'forwards', borderWidth: '0.5px' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-lp-bg-warm flex items-center justify-center text-lp-primary">
                    {item.icon === "bottle" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 2h6v4l2 2v14H7V8l2-2V2z"/>
                      </svg>
                    )}
                    {item.icon === "ban" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                      </svg>
                    )}
                    {item.icon === "shield" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-lp-text-heading mb-0.5">{item.title}</p>
                    <p className="text-xs text-lp-text-body leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              よくあるご質問
            </h2>
          </div>
          <div className="space-y-0 opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
            {[
              { q: "お酒が飲めなくても参加できますか？", a: "はい、もちろん参加いただけます。ソフトドリンクもご用意しています。お酒はあくまで「飾らない対話」のきっかけです。" },
              { q: "志望業界が決まっていなくても大丈夫ですか？", a: "むしろ、まだ決まっていない方にこそおすすめです。さまざまな業界の社会人と対話する中で、新しい気づきが得られます。" },
              { q: "どんな企業が参加していますか？", a: "大手からベンチャーまで、運営の厳格な基準を通過した企業のみが参加しています。業界は幅広く、毎回異なります。" },
              { q: "当日エントリーや選考を強要されませんか？", a: "一切ありません。対話を楽しんでいただくことが目的です。気になる企業があれば、その後のつながり方はあなた次第です。" },
              { q: "服装はスーツですか？", a: "私服でお越しください。飾らない、自然体の場です。" },
              { q: "参加費はかかりますか？", a: "参加費は無料です。飲食も企業様のご提供でご用意しています。" },
              { q: "一人で参加しても大丈夫ですか？", a: "多くの方がお一人で参加されています。アイスブレイクから始まるので、自然に打ち解けられます。" },
            ].map((item, i) => (
              <details key={i} className="border-b border-lp-border group">
                <summary className="py-5 cursor-pointer flex items-center justify-between text-lp-text-heading font-medium text-sm hover:text-lp-primary transition-colors">
                  {item.q}
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-lp-bg-warm flex items-center justify-center group-open:bg-lp-border transition-colors">
                    <svg className="w-4 h-4 text-lp-primary group-open:rotate-45 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3v10M3 8h10"/>
                    </svg>
                  </span>
                </summary>
                <div className="pb-5 text-sm text-lp-text-body leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="apply" className="py-28 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--lp-cta-start) 0%, var(--lp-cta-mid) 50%, var(--lp-cta-end) 100%)' }}>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-lp-text-heading mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              <span className="whitespace-nowrap">見えないものに、</span> <span className="whitespace-nowrap">触れてみよう。</span>
            </h2>
          </div>
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
            <p className="text-sm md:text-base text-lp-text-body mb-9 leading-loose" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              この時間、この出会いだけで「正解」はわからないかもしれない。<br/>でも、あなたなりの正解の手がかりは、きっと見つかる。
            </p>
          </div>
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }}>
            <a href="#apply" className="inline-flex items-center gap-2 px-12 py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5 mb-4">
              次回のイベントに参加する
              <svg className="w-4 h-4" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9h10m-4-4l4 4-4 4"/>
              </svg>
            </a>
            <p className="text-xs text-lp-primary font-medium tracking-wide">
              <span>参加費無料</span>
              <span className="mx-1">・</span>
              <span>私服OK</span>
              <span className="mx-1">・</span>
              <span>1人参加歓迎</span>
            </p>
          </div>
        </div>
      </section>

      {/* 次回イベント詳細 */}
      <section id="event-detail" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-72 h-72 -top-20 -right-20 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-border) 35%, transparent) 0%, transparent 70%)' }} />
          <div className="absolute w-48 h-48 -bottom-10 -left-10 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--lp-primary) 10%, transparent) 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12 opacity-0 animate-fadeUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs font-medium text-lp-primary uppercase tracking-widest mb-2">Next Event</p>
            <h2 className="text-3xl md:text-4xl font-bold text-lp-text-heading leading-tight" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              次回のイベント詳細
            </h2>
          </div>
          <div className="rounded-2xl border border-lp-border bg-lp-bg-warm/60 backdrop-blur-sm overflow-hidden opacity-0 animate-fadeUp" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-lp-border/60 flex items-center justify-center text-lp-primary">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-lp-primary uppercase tracking-wide mb-0.5">日時</p>
                  <p className="text-lp-text-heading font-medium" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                    {nextEvent?.dateLabel ?? "2025年3月15日（土）18:00〜21:00"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-lp-border/60 flex items-center justify-center text-lp-primary">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-lp-primary uppercase tracking-wide mb-0.5">場所</p>
                  <p className="text-lp-text-heading font-medium" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                    {nextEvent?.location ?? "東京都内（お申し込み後にご案内）"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-lp-border/60">
                  <span className="text-2xl font-bold text-lp-primary tabular-nums" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                    {nextEvent?.companiesCount ?? 15}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-lp-text-body">参加企業数</p>
                    <p className="text-sm text-lp-text-heading font-medium">社</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-lp-border/60">
                  <span className="text-2xl font-bold text-lp-primary tabular-nums" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                    {nextEvent?.studentsCount ?? 40}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-lp-text-body">募集学生数</p>
                    <p className="text-sm text-lp-text-heading font-medium">名</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
              <a href="#apply" className="block w-full text-center py-4 bg-lp-primary text-white rounded-full font-medium transition-all hover:bg-lp-primary-hover hover:shadow-lg hover:-translate-y-0.5">
                参加申し込みをする
                <svg className="inline-block w-4 h-4 ml-2 align-middle" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9h10m-4-4l4 4-4 4"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-11 px-6 border-t border-lp-border bg-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-lp-text-heading">
            {logoUrl ? (
              <img src={logoUrl} alt="KANPAI就活ロゴ" className="h-5 w-auto object-contain" onError={handleLogoError} />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                <path d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10l4-4m12 4l-4-4" stroke="var(--lp-primary)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            <span className="font-bold text-sm tracking-wide">KANPAI就活</span>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-lp-text-heading">
              <a href="https://workaslife-inc.com/" target="_blank" rel="noopener noreferrer" className="text-lp-text-heading hover:text-lp-primary transition-colors underline">株式会社ワークアズライフ</a>（マイナビ出資企業）
            </p>
            <p className="text-xs text-lp-text-body mt-0.5">深い部分にこだわった就活支援</p>
          </div>
          <div className="flex gap-5 flex-wrap justify-center">
            {[
              { label: "プライバシーポリシー", href: "#" },
              { label: "利用規約", href: "#" },
              { label: "お問い合わせ", href: "#" },
              { label: "Instagram", href: "https://www.instagram.com/kanpai_hutte_career/" },
            ].map((item, i) => (
              <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-xs text-lp-text-body hover:text-lp-primary transition-colors">
                {item.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-lp-text-body opacity-50">
            &copy; {currentYear} Work As Life, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
