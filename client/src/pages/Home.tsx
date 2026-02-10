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

export default function Home() {
  useSmoothScroll();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [images, setImages] = useState({
    scene1: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-1_1770745912000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTE.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTFfMTc3MDc0NTkxMjAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVEUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=UiC7GFhypowGEYqk8ViycmITdVekZlna6NhuEWuS-Zr33ijLwRFYDC7yAEL~qUeUgcWXYfhai64M-l7-RdP5NeGXfYbQCDyxqWpN5NoToeNhd~MTcSIjuso-AWumWPfF3GAAr1YVZKPeB2Sj1e5zSX3ZY879jCud82GLy-S914OG5PNzweYOz7PpVAhH~GuaVbqK4B-VFjlk3rGOH2vI6a-DfgQTflF-5YLpjj8F2yChsPmCDcHtivM8P-oPC1iNKKIva~3hVzGgAIyosZh6iZs2O0chwKY6Tf7WPSPOOUuq~VKxOpnravxxZlkPUfqPmR~CdxoUF~TsjhBbg7W1Hg__",
    scene2: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-2_1770745912000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTJfMTc3MDc0NTkxMjAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lP1zsaQVot3JZ8j1pmF~ZTduIn4rEbSCnxg5fviHYIMB7ecm2noJEeRqs8RnfQtGeFrNfisNWRxS2NXP6cKYNRTm1GKCiPhAH9uZmejxHHa2sRLjzNPtTkKqzNcLb3adMZF2cNijtcWuu04Up4elWVulYApVZE53c76-8zMGCKDeUFbn~S1DVMkfy-2a5ZvOxwlPDI9NwRiJxZonwhGvWYqkVfJ1uPSUllOTWLklnsJ5M14BPuqrsHcA1z8Hp~gurADg1vOWL5Iyv479l8pVFQeGLmvKubSI5K3ExuXg7neOEm8U7XZSBerh1wpI8EHyLKObaocXTo5hICAVnaPxnQ__",
    scene3: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-3_1770745924000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTM.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTNfMTc3MDc0NTkyNDAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVE0ucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=bdeOa8BDiqVI-G-x3nARsTl0lR2zBr-QQUpAKFvJ7tSJLAdrqyI3rA5pCIM407JnzkWz-EuKoXMEPtNmKrNOmnxmBVO4bZeRNNRqVd2yZnDFRK2lx1HRNMh5p3~amaXZIDzrxjRxA~U70ji23I3iO9AEBMTcAbBfg13~mGwX-WPOBkRMvIJiUYDBs7YHbq4GFVsDZlaciBvg~KkScohdrlCxqvxkkUzTZlMdByMyDq82dWBiCWo9j~7xpbYqejHFFuklq4y7pYVU74X4fisqBL9M0JByOhPny9B2wA-moVnkoGzYHV1fUpvdPn7dzTuHKsstSdqgU1-Ny31Cedp24g__",
  });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    
    // LocalStorageから画像を読み込む
    const scene1 = localStorage.getItem("kanpai_scene1");
    const scene2 = localStorage.getItem("kanpai_scene2");
    const scene3 = localStorage.getItem("kanpai_scene3");
    const logo = localStorage.getItem("kanpai_logo");
    
    if (scene1 || scene2 || scene3) {
      setImages(prev => ({
        scene1: scene1 || prev.scene1,
        scene2: scene2 || prev.scene2,
        scene3: scene3 || prev.scene3,
      }));
    }

    if (logo) {
      setLogoUrl(logo);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-transparent transition-all duration-300" id="nav">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-[#5C3D2E] no-underline">
            {logoUrl ? (
              <img src={logoUrl} alt="KANPAI就活ロゴ" className="h-6 w-auto object-contain" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                <path d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10l4-4m12 4l-4-4" stroke="#D4845A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            <span className="font-bold text-sm tracking-wide">KANPAI就活</span>
          </a>
          <a href="#apply" className="px-5 py-2 bg-[#d4844b] text-white text-xs font-medium rounded-full transition-colors hover:bg-[#c47540]">
            イベントに参加する
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-14 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="opacity-0 animate-fadeUp" style={{ animationDelay: '0.08s', animationFillMode: 'forwards' }}>
            <svg className="w-12 h-12 mx-auto mb-8 text-[#d4844b]" viewBox="0 0 40 40" fill="none">
              <path d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 10l4-4m12 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#5C3D2E] mb-6 opacity-0 animate-fadeUp" style={{ fontFamily: "'Shippori Mincho', serif", animationDelay: '0.12s', animationFillMode: 'forwards' }}>
            見えないものに、<br/>触れる。
          </h1>
          <p className="text-sm md:text-base text-[#5C3D2E] leading-loose text-center mb-11 opacity-0 animate-fadeUp" style={{ fontFamily: "'Shippori Mincho', serif", animationDelay: '0.16s', animationFillMode: 'forwards' }}>
            普段見えない、企業の素と、自分の本音。<br/><br/>昼が飾らず語らう中で<br/>あなたなりの正解の手がかりが、見つかる場所。<br/><br/>就活サイトでは見えないもの、<br/>説明会では聞けないもの——<br/>その先にある本質に、触れる時間です。
          </p>
          <a href="#apply" className="inline-block px-8 py-3 bg-[#d4844b] text-white font-medium rounded-full hover:bg-[#c47540] transition-colors opacity-0 animate-fadeUp" style={{ animationDelay: '0.20s', animationFillMode: 'forwards' }}>
            次回のイベントを見る →
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-[#fffaf5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#5C3D2E] mb-4" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              KANPAI就活とは
            </h2>
            <p className="text-sm md:text-base text-[#5C3D2E] leading-loose text-center mb-11" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              お酒を交えた対話の中で、企業と学生が飾らず語り合う、対面イベント。<br/><br/>最初に会社名は伝えません。<br/>肩書きではなく「人」として出会い、<br/>条件ではなく「価値観」で語り合う。<br/><br/>就活サイトでは見えないもの、<br/>説明会では聞けないもの——<br/>その先にある本質に、触れる時間です。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 opacity-0 animate-fadeUp" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }}>
            <div className="aspect-video bg-[#f5e6cd] rounded-lg overflow-hidden">
              <img src={images.scene1} alt="KANPAI就活イベントの様子1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video bg-[#f5e6cd] rounded-lg overflow-hidden">
              <img src={images.scene2} alt="KANPAI就活イベントの様子2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video bg-[#f5e6cd] rounded-lg overflow-hidden">
              <img src={images.scene3} alt="KANPAI就活イベントの様子3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3D2E] text-center mb-16" style={{ fontFamily: "'Shippori Mincho', serif" }}>
            3つの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center opacity-0 animate-fadeUp" style={{ animationDelay: '0.28s', animationFillMode: 'forwards' }}>
              <div className="w-16 h-16 bg-[#f5e6cd] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#d4844b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3D2E] mb-3" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                飾らない対話
              </h3>
              <p className="text-sm text-[#875a3c] leading-relaxed">
                企業の肩書きを隠し、人と人として本音で語り合える環境を作ります。
              </p>
            </div>
            <div className="text-center opacity-0 animate-fadeUp" style={{ animationDelay: '0.32s', animationFillMode: 'forwards' }}>
              <div className="w-16 h-16 bg-[#f5e6cd] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#d4844b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3D2E] mb-3" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                価値観の共鳴
              </h3>
              <p className="text-sm text-[#875a3c] leading-relaxed">
                条件ではなく、価値観で企業と学生がつながる新しい就活の形です。
              </p>
            </div>
            <div className="text-center opacity-0 animate-fadeUp" style={{ animationDelay: '0.36s', animationFillMode: 'forwards' }}>
              <div className="w-16 h-16 bg-[#f5e6cd] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#d4844b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.36 4.24l-.707-.707M9 12a3 3 0 11 6 0 3 3 0 01-6 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3D2E] mb-3" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                本質との出会い
              </h3>
              <p className="text-sm text-[#875a3c] leading-relaxed">
                就活サイトや説明会では見えない、企業と自分の本質に触れられます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="apply" className="py-20 md:py-32 bg-[#fffaf5]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3D2E] mb-6" style={{ fontFamily: "'Shippori Mincho', serif" }}>
            次回のイベント
          </h2>
          <p className="text-sm md:text-base text-[#875a3c] mb-8 leading-relaxed">
            KANPAI就活は定期的に開催されています。<br/>あなたの本音と向き合える場所で、企業との新しい出会いを。
          </p>
          <button className="px-8 py-3 bg-[#d4844b] text-white font-medium rounded-full hover:bg-[#c47540] transition-colors">
            詳細を見る
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5C3D2E] text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-8">
            {logoUrl ? (
              <img src={logoUrl} alt="KANPAI就活ロゴ" className="h-6 w-auto object-contain brightness-0 invert" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                <path d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10l4-4m12 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            <span className="font-bold">KANPAI就活</span>
          </div>
          <p className="text-sm text-gray-300 mb-6">
            見えないものに、触れる。
          </p>
          <div className="border-t border-white/20 pt-6">
            <p className="text-xs text-gray-400">
              © {currentYear} KANPAI就活. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
