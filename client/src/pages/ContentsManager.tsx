/* Wa-Modern Minimalism Design Philosophy
   - 間（Ma）の美学: 余白を積極的に活用し、視覚的な呼吸空間を作る
   - 温かみのある対話性: 手書き風要素とソフトなインタラクション
*/

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONTENTS_MANAGER_ACCESS_CODE,
  isContentsManagerUnlocked,
  setContentsManagerUnlocked,
} from "@/const";
import { usePalette } from "@/contexts/PaletteContext";
import type { EventImage } from "@/lib/content-settings";
import {
  generateImageId,
  getStoredEventImages,
  migrateOldImageFormat,
  setStoredEventImages,
} from "@/lib/content-settings";
import { COLOR_PALETTES } from "@/lib/theme-palettes";
import type { KanpaiEvent } from "@/types/events";
import {
  defaultEvents,
  getStoredEvents,
  setStoredEvents,
} from "@/types/events";
import { usePreserveQueryNavigate } from "@/hooks/usePreserveQueryNavigate";

const DEFAULT_SCENES = {
  scene1: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-1_1770745912000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTE.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTFfMTc3MDc0NTkxMjAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVEUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=UiC7GFhypowGEYqk8ViycmITdVekZlna6NhuEWuS-Zr33ijLwRFYDC7yAEL~qUeUgcWXYfhai64M-l7-RdP5NeGXfYbQCDyxqWpN5NoToeNhd~MTcSIjuso-AWumWPfF3GAAr1YVZKPeB2Sj1e5zSX3ZY879jCud82GLy-S914OG5PNzweYOz7PpVAhH~GuaVbqK4B-VFjlk3rGOH2vI6a-DfgQTflF-5YLpjj8F2yChsPmCDcHtivM8P-oPC1iNKKIva~3hVzGgAIyosZh6iZs2O0chwKY6Tf7WPSPOOUuq~VKxOpnravxxZlkPUfqPmR~CdxoUF~TsjhBbg7W1Hg__",
  scene2: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-2_1770745912000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTJfMTc3MDc0NTkxMjAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lP1zsaQVot3JZ8j1pmF~ZTduIn4rEbSCnxg5fviHYIMB7ecm2noJEeRqs8RnfQtGeFrNfisNWRxS2NXP6cKYNRTm1GKCiPhAH9uZmejxHHa2sRLjzNPtTkKqzNcLb3adMZF2cNijtcWuu04Up4elWVulYApVZE53c76-8zMGCKDeUFbn~S1DVMkfy-2a5ZvOxwlPDI9NwRiJxZonwhGvWYqkVfJ1uPSUllOTWLklnsJ5M14BPuqrsHcA1z8Hp~gurADg1vOWL5Iyv479l8pVFQeGLmvKubSI5K3ExuXg7neOEm8U7XZSBerh1wpI8EHyLKObaocXTo5hICAVnaPxnQ__",
  scene3: "https://private-us-east-1.manuscdn.com/sessionFile/g4dhaOLxYmmGndbbSn7m7C/sandbox/1OzvILpYvvrz5cl53JFkXJ-img-3_1770745924000_na1fn_a2FucGFpLWV2ZW50LXNjZW5lLTM.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZzRkaGFPTHhZbW1HbmRiYlNuN203Qy9zYW5kYm94LzFPenZJTHBZdnZyejVjbDUzSkZrWEotaW1nLTNfMTc3MDc0NTkyNDAwMF9uYTFmbl9hMkZ1Y0dGcExXVjJaVzUwTFhOalpXNWxMVE0ucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=bdeOa8BDiqVI-G-x3nARsTl0lR2zBr-QQUpAKFvJ7tSJLAdrqyI3rA5pCIM407JnzkWz-EuKoXMEPtNmKrNOmnxmBVO4bZeRNNRqVd2yZnDFRK2lx1HRNMh5p3~amaXZIDzrxjRxA~U70ji23I3iO9AEBMTcAbBfg13~mGwX-WPOBkRMvIJiUYDBs7YHbq4GFVsDZlaciBvg~KkScohdrlCxqvxkkUzTZlMdByMyDq82dWBiCWo9j~7xpbYqejHFFuklq4y7pYVU74X4fisqBL9M0JByOhPny9B2wA-moVnkoGzYHV1fUpvdPn7dzTuHKsstSdqgU1-Ny31Cedp24g__",
};

function createEmptyEvent(order: number): KanpaiEvent {
  return {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    dateLabel: "",
    timeRange: "",
    timeNote: "",
    location: "",
    locationNote: "",
    companiesCount: 4,
    studentsCount: 20,
    order,
  };
}

export default function ContentsManager() {
  const navigate = usePreserveQueryNavigate();
  const { paletteId, setPaletteId } = usePalette();
  const [unlocked, setUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("kanpai_logo") : null
  );
  const [eventImages, setEventImages] = useState<EventImage[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = getStoredEventImages();
    if (stored) return stored;
    const migrated = migrateOldImageFormat();
    if (migrated) return migrated;
    return [];
  });
  const [events, setEvents] = useState<KanpaiEvent[]>(() => getStoredEvents());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newEventForm, setNewEventForm] = useState<KanpaiEvent>(() =>
    createEmptyEvent(events.length)
  );

  useEffect(() => {
    setUnlocked(isContentsManagerUnlocked());
  }, []);

  const persistEvents = (next: KanpaiEvent[]) => {
    setEvents(next);
    setStoredEvents(next);
  };

  const persistImages = (next: EventImage[]) => {
    setEventImages(next);
    setStoredEventImages(next);
  };

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (accessCode.trim() === CONTENTS_MANAGER_ACCESS_CODE) {
      setContentsManagerUnlocked();
      setUnlocked(true);
    } else {
      setError("アクセスコードが正しくありません");
    }
  };

  const handleImageUpdate = (id: string, url: string) => {
    const next = eventImages.map((img) =>
      img.id === id ? { ...img, url } : img,
    );
    persistImages(next);
  };

  const handleAddImage = () => {
    if (eventImages.length >= 6) return;
    const next = [...eventImages, { id: generateImageId(), url: "" }];
    persistImages(next);
  };

  const handleRemoveImage = (id: string) => {
    if (eventImages.length <= 1) return;
    const next = eventImages.filter((img) => img.id !== id);
    persistImages(next);
  };

  const handleLogoUpdate = (url: string) => {
    setLogoUrl(url);
    localStorage.setItem("kanpai_logo", url);
  };

  const handleLogoReset = () => {
    setLogoUrl(null);
    localStorage.removeItem("kanpai_logo");
  };

  const handleSaveEvent = (updated: KanpaiEvent) => {
    const next = events.map((e) => (e.id === updated.id ? updated : e));
    persistEvents(next);
    setEditingId(null);
  };

  const handleDeleteEvent = (id: string) => {
    const next = events.filter((e) => e.id !== id).map((e, i) => ({ ...e, order: i }));
    persistEvents(next);
    setEditingId(null);
  };

  const handleAddEvent = () => {
    const ev = { ...newEventForm, order: events.length };
    if (!ev.dateLabel.trim() || !ev.location.trim()) return;
    persistEvents([...events, ev]);
    setNewEventForm(createEmptyEvent(events.length + 1));
    setAddingNew(false);
  };

  const handleResetEventsToDefault = () => {
    persistEvents(defaultEvents);
    setEditingId(null);
    setAddingNew(false);
  };

  if (!unlocked) {
    return (
      <div
        className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-6"
        style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl border border-[#ffd7c3] shadow-sm">
          <h1
            className="text-xl font-bold text-[#5C3D2E] mb-2 text-center"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            コンテンツ管理
          </h1>
          <p className="text-sm text-[#875a3c] mb-6 text-center">
            アクセスコードを入力してください
          </p>
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <Input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="アクセスコード"
              className="border-[#ffd7c3] focus-visible:ring-[#d4844b]"
              autoFocus
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#d4844b] hover:bg-[#c47540] text-white"
            >
              入室する
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#fffaf5]"
      style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
    >
      <header className="bg-white border-b border-[#ffd7c3] py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-[#5C3D2E]"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10l4-4m12 4l-4-4"
                  stroke="#D4845A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <h1
                  className="text-xl font-bold text-[#5C3D2E]"
                  style={{ fontFamily: "'Shippori Mincho', serif" }}
                >
                  コンテンツ管理
                </h1>
                <p className="text-xs text-[#875a3c]">
                  KANPAI就活 ランディングページ
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
            >
              プレビューを見る
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* ブランドロゴ */}
          <div className="mb-10">
            <h2
              className="text-2xl font-bold text-[#5C3D2E] mb-2"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              ブランドロゴ
            </h2>
            <p className="text-sm text-[#875a3c] mb-4">
              ヘッダー・ヒーロー・フッターに表示されるロゴです。未設定の場合はデフォルトのアイコンが表示されます。
            </p>
            <div className="max-w-xs">
              <ImageUploader
                label="ブランドロゴ"
                currentImage={logoUrl ?? undefined}
                onImageUpload={handleLogoUpdate}
              />
              {logoUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
                  onClick={handleLogoReset}
                >
                  デフォルトのロゴに戻す
                </Button>
              )}
            </div>
          </div>

          {/* イベント画像 */}
          <div className="mb-10">
            <h2
              className="text-2xl font-bold text-[#5C3D2E] mb-2"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              イベント画像の管理
            </h2>
            <p className="text-sm text-[#875a3c] mb-4">
              Aboutセクションに表示されるイベント画像をアップロードできます。画像の追加・削除も可能です（最大6枚）。
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {eventImages.map((img, i) => (
                <div key={img.id} className="relative">
                  <ImageUploader
                    label={`イベント画像 ${i + 1}`}
                    currentImage={img.url || undefined}
                    onImageUpload={(url) => handleImageUpdate(img.id, url)}
                  />
                  {eventImages.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveImage(img.id)}
                    >
                      この画像を削除
                    </Button>
                  )}
                </div>
              ))}
              {eventImages.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="border-2 border-dashed border-[#ffd7c3] rounded-xl flex flex-col items-center justify-center min-h-[200px] hover:border-[#d4844b] transition-colors gap-2"
                >
                  <svg className="w-8 h-8 text-[#d4844b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  <span className="text-sm text-[#d4844b] font-medium">画像を追加</span>
                </button>
              )}
            </div>
          </div>

          {/* テーマ（カラーパレット） */}
          <div className="mb-10">
            <h2
              className="text-2xl font-bold text-[#5C3D2E] mb-2"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              テーマ（カラーパレット）
            </h2>
            <p className="text-sm text-[#875a3c] mb-4">
              LP全体の配色を切り替えることができます。選択するとプレビューに即時反映されます。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setPaletteId(palette.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    paletteId === palette.id
                      ? "border-[#d4844b] shadow-md ring-1 ring-[#d4844b]/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex gap-1.5 mb-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ background: palette.colors.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ background: palette.colors.textHeading }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ background: palette.colors.bgWarm }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ background: palette.colors.border }}
                    />
                  </div>
                  <p className="text-xs font-medium text-[#5C3D2E]">
                    {palette.nameJa}
                  </p>
                  <p className="text-[10px] text-[#875a3c]">{palette.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* イベント管理 */}
          <div className="mb-10">
            <h2
              className="text-2xl font-bold text-[#5C3D2E] mb-2"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              イベント管理
            </h2>
            <p className="text-sm text-[#875a3c] mb-4">
              「イベント概要」「次回のイベント詳細」に表示する内容を編集できます。一覧の先頭のイベントが次回イベントとして表示されます。
            </p>

            <div className="space-y-4 mb-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-5 bg-white border border-[#ffd7c3] rounded-2xl"
                >
                  {editingId === ev.id ? (
                    <EventForm
                      event={ev}
                      onSave={handleSaveEvent}
                      onCancel={() => setEditingId(null)}
                      onDelete={() => handleDeleteEvent(ev.id)}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-[#5C3D2E]">
                          {ev.dateLabel || "（日時未設定）"}
                        </p>
                        <p className="text-sm text-[#875a3c]">
                          {ev.location}
                          {ev.locationNote ? ` ${ev.locationNote}` : ""}
                        </p>
                        <p className="text-xs text-[#875a3c] mt-1">
                          参加企業 {ev.companiesCount}社 / 募集学生 {ev.studentsCount}名
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
                        onClick={() => setEditingId(ev.id)}
                      >
                        編集
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {addingNew ? (
              <div className="p-5 bg-white border border-[#ffd7c3] rounded-2xl border-dashed">
                <EventForm
                  event={newEventForm}
                  onCancel={() => setAddingNew(false)}
                  isNew
                  onChange={setNewEventForm}
                />
                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    className="bg-[#d4844b] hover:bg-[#c47540] text-white"
                    onClick={handleAddEvent}
                  >
                    追加する
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddingNew(false)}
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
                onClick={() => {
                  setNewEventForm(createEmptyEvent(events.length));
                  setAddingNew(true);
                }}
              >
                ＋ イベントを追加
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-4 text-[#875a3c] hover:text-[#5C3D2E]"
              onClick={handleResetEventsToDefault}
            >
              イベントをデフォルトに戻す
            </Button>
          </div>

          <div className="mt-12 p-6 bg-white rounded-2xl border border-[#ffd7c3]">
            <h3
              className="text-lg font-bold text-[#5C3D2E] mb-4"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              使い方
            </h3>
            <ul className="space-y-2 text-sm text-[#875a3c]">
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">1.</span>
                <span>
                  ブランドロゴ・イベント画像はLP全体に反映されます。「プレビューを見る」で確認できます。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">2.</span>
                <span>
                  イベント画像は追加・削除が可能です（最大6枚）。ファイル名はプログラムが自動で管理するため、好きな画像を選ぶだけでOKです。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">3.</span>
                <span>
                  テーマ（カラーパレット）を選択すると、LP全体の配色が即座に切り替わります。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">4.</span>
                <span>
                  イベントは複数登録できます。一覧の先頭が「次回のイベント」として表示されます。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4844b] font-bold">5.</span>
                <span>
                  日時・場所・参加企業数・募集学生数を変更すると、イベント概要と次回イベント詳細の両方に反映されます。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function EventForm({
  event,
  onSave,
  onCancel,
  onDelete,
  isNew,
  onChange,
}: {
  event: KanpaiEvent;
  onSave?: (e: KanpaiEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
  onChange?: (e: KanpaiEvent) => void;
}) {
  const [form, setForm] = useState<KanpaiEvent>(event);

  const update = (patch: Partial<KanpaiEvent>) => {
    const next = { ...form, ...patch };
    setForm(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-[#5C3D2E]">日時（表示用）</Label>
        <Input
          value={form.dateLabel}
          onChange={(e) => update({ dateLabel: e.target.value })}
          placeholder="例: 2025年3月15日（土）18:00〜21:00"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[#5C3D2E]">時間帯（概要用）</Label>
          <Input
            value={form.timeRange ?? ""}
            onChange={(e) => update({ timeRange: e.target.value })}
            placeholder="例: 16:00 – 20:00"
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
        <div>
          <Label className="text-[#5C3D2E]">時間の補足</Label>
          <Input
            value={form.timeNote ?? ""}
            onChange={(e) => update({ timeNote: e.target.value })}
            placeholder="例: 夕方〜夜にかけて"
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
      </div>
      <div>
        <Label className="text-[#5C3D2E]">場所</Label>
        <Input
          value={form.location}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="例: 東京都内（お申し込み後にご案内）"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div>
        <Label className="text-[#5C3D2E]">場所の補足</Label>
        <Input
          value={form.locationNote ?? ""}
          onChange={(e) => update({ locationNote: e.target.value })}
          placeholder="例: ※詳細は参加確定後にご案内"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[#5C3D2E]">参加企業数（社）</Label>
          <Input
            type="number"
            min={1}
            value={form.companiesCount}
            onChange={(e) =>
              update({ companiesCount: parseInt(e.target.value, 10) || 0 })
            }
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
        <div>
          <Label className="text-[#5C3D2E]">募集学生数（名）</Label>
          <Input
            type="number"
            min={1}
            value={form.studentsCount}
            onChange={(e) =>
              update({ studentsCount: parseInt(e.target.value, 10) || 0 })
            }
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
      </div>
      {!isNew && (
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            className="bg-[#d4844b] hover:bg-[#c47540] text-white"
            onClick={() => onSave?.(form)}
          >
            保存
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            キャンセル
          </Button>
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              削除
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
