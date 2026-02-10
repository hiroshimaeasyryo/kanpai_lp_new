/* Wa-Modern Minimalism Design Philosophy
   - 間（Ma）の美学: 余白を積極的に活用し、視覚的な呼吸空間を作る
   - 温かみのある対話性: 手書き風要素とソフトなインタラクション
*/

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { toast } from "sonner";

const ACCESS_CODE = "image-manager";

export default function ImageManager() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [images, setImages] = useState({
    scene1: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-1_1770745912000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTE.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTFfMTc3MDc0NTkxMjAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVEUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=UiC7GFhypowGEYqk8ViycmITdVekZlna6NhuEWuS-Zr33ijLwRFYDC7yAEL~qUeUgcWXYfhai64M-l7-RdP5NeGXfYbQCDyxqWpN5NoToeNhd~MTcSIjuso-AWumWPfF3GAAr1YVZKPeB2Sj1e5zSX3ZY879jCud82GLy-S914OG5PNzweYOz7PpVAhH~GuaVbqK4B-VFjlk3rGOH2vI6a-DfgQTflF-5YLpjj8F2yChsPmCDcHtivM8P-oPC1iNKKIva~3hVzGgAIyosZh6iZs2O0chwKY6Tf7WPSPOOUuq~VKxOpnravxxZlkPUfqPmR~CdxoUF~TsjhBbg7W1Hg__",
    scene2: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-2_1770745912000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTJfMTc3MDc0NTkxMjAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lP1zsaQVot3JZ8j1pmF~ZTduIn4rEbSCnxg5fviHYIMB7ecm2noJEeRqs8RnfQtGeFrNfisNWRxS2NXP6cKYNRTm1GKCiPhAH9uZmejxHHa2sRLjzNPtTkKqzNcLb3adMZF2cNijtcWuu04Up4elWVulYApVZE53c76-8zMGCKDeUFbn~S1DVMkfy-2a5ZvOxwlPDI9NwRiJxZonwhGvWYqkVfJ1uPSUllOTWLklnsJ5M14BPuqrsHcA1z8Hp~gurADg1vOWL5Iyv479l8pVFQeGLmvKubSI5K3ExuXg7neOEm8U7XZSBerh1wpI8EHyLKObaocXTo5hICAVnaPxnQ__",
    scene3: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-3_1770745924000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTM.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTNfMTc3MDc0NTkyNDAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVE0ucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=bdeOa8BDiqVI-G-x3nARsTl0lR2zBr-QQUpAKFvJ7tSJLAdrqyI3rA5pCIM407JnzkWz-EuKoXMEPtNmKrNOmnxmBVO4bZeRNNRqVd2yZnDFRK2lx1HRNMh5p3~amaXZIDzrxjRxA~U70ji23I3iO9AEBMTcAbBfg13~mGwX-WPOBkRMvIJiUYDBs7YHbq4GFVsDZlaciBvg~KkScohdrlCxqvxkkUzTZlMdByMyDq82dWBiCWo9j~7xpbYqejHFFuklq4y7pYVU74X4fisqBL9M0JByOhPny9B2wA-moVnkoGzYHV1fUpvdPn7dzTuHKsstSdqgU1-Ny31Cedp24g__",
    logo: "",
  });

  useEffect(() => {
    // LocalStorageから認証状態と画像を読み込む
    const authToken = localStorage.getItem("kanpai_auth");
    if (authToken === ACCESS_CODE) {
      setIsAuthenticated(true);
    }

    const scene1 = localStorage.getItem("kanpai_scene1");
    const scene2 = localStorage.getItem("kanpai_scene2");
    const scene3 = localStorage.getItem("kanpai_scene3");
    const logo = localStorage.getItem("kanpai_logo");

    if (scene1 || scene2 || scene3 || logo) {
      setImages(prev => ({
        scene1: scene1 || prev.scene1,
        scene2: scene2 || prev.scene2,
        scene3: scene3 || prev.scene3,
        logo: logo || prev.logo,
      }));
    }
  }, []);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === ACCESS_CODE) {
      setIsAuthenticated(true);
      localStorage.setItem("kanpai_auth", ACCESS_CODE);
      toast.success("認証に成功しました");
    } else {
      toast.error("アクセスコードが正しくありません");
      setAccessCode("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("kanpai_auth");
    setAccessCode("");
    toast.success("ログアウトしました");
  };

  const handleImageUpdate = (key: string, url: string) => {
    setImages(prev => ({
      ...prev,
      [key]: url
    }));
    localStorage.setItem(`kanpai_${key}`, url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
        <div className="w-full max-w-md px-6">
          <div className="bg-white rounded-2xl border border-[#ffd7c3] p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <svg className="w-12 h-12 text-[#5C3D2E]" viewBox="0 0 40 40" fill="none">
                <path d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10l4-4m12 4l-4-4" stroke="#D4845A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#5C3D2E] text-center mb-2" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              画像管理
            </h1>
            <p className="text-sm text-[#875a3c] text-center mb-8">
              アクセスコードを入力してください
            </p>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5C3D2E] mb-2">
                  アクセスコード
                </label>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="コードを入力"
                  className="w-full px-4 py-2 border border-[#ffd7c3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4844b] bg-[#fffaf5]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#d4844b] hover:bg-[#c47540] text-white"
              >
                アクセス
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#ffd7c3]">
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
              >
                メインページに戻る
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5]" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#ffd7c3] py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-[#5C3D2E]" viewBox="0 0 40 40" fill="none">
                <path d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10l4-4m12 4l-4-4" stroke="#D4845A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <h1 className="text-xl font-bold text-[#5C3D2E]" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                  画像管理
                </h1>
                <p className="text-xs text-[#875a3c]">KANPAI就活 ランディングページ</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#5C3D2E] mb-2" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              ランディングページの画像を管理
            </h2>
            <p className="text-sm text-[#875a3c]">
              イベント画像とブランドロゴをアップロードして置換できます。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-bold text-[#5C3D2E] mb-4" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                イベント画像
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <ImageUploader
                  label="イベント画像 1"
                  currentImage={images.scene1}
                  onImageUpload={(url) => handleImageUpdate("scene1", url)}
                />
                <ImageUploader
                  label="イベント画像 2"
                  currentImage={images.scene2}
                  onImageUpload={(url) => handleImageUpdate("scene2", url)}
                />
                <ImageUploader
                  label="イベント画像 3"
                  currentImage={images.scene3}
                  onImageUpload={(url) => handleImageUpdate("scene3", url)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#5C3D2E] mb-4" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                ブランドロゴ
              </h3>
              <div className="space-y-4">
                <ImageUploader
                  label="ブランドロゴ（SVG/PNG/JPG）"
                  currentImage={images.logo}
                  onImageUpload={(url) => handleImageUpdate("logo", url)}
                />
                <div className="p-4 bg-white rounded-lg border border-[#ffd7c3]">
                  <p className="text-xs text-[#875a3c] mb-3">
                    <span className="font-medium">現在のロゴプレビュー：</span>
                  </p>
                  {images.logo ? (
                    <div className="w-full h-20 bg-[#f5e6cd] rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={images.logo} alt="ロゴプレビュー" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-[#f5e6cd] rounded-lg flex items-center justify-center text-[#875a3c] text-xs">
                      ロゴがアップロードされていません
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#ffd7c3]">
            <h3 className="text-lg font-bold text-[#5C3D2E] mb-4" style={{ fontFamily: "'Shippori Mincho', serif" }}>
              使い方
            </h3>
            <ul className="space-y-2 text-sm text-[#875a3c]">
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">1.</span>
                <span>各画像カードの「画像を選択」ボタンをクリックして、アップロードしたい画像を選択します。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">2.</span>
                <span>ブランドロゴはSVG、PNG、JPGなど、どの形式でもアップロード可能です。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">3.</span>
                <span>画像は自動的にプレビューされ、ランディングページに反映されます。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">4.</span>
                <span>画像は最大5MBまで、JPG、PNG、GIF、SVG形式に対応しています。</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
