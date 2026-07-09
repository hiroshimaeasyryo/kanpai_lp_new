/* Wa-Modern Minimalism Design Philosophy
   - 間（Ma）の美学: 余白を積極的に活用し、視覚的な呼吸空間を作る
   - 温かみのある対話性: 手書き風要素とソフトなインタラクション
*/

import { useCallback, useEffect, useMemo, useState } from "react";
import { EditPaletteSheet } from "@/components/contents-manager/EditPaletteSheet";
import { GlobalSettingsPanel } from "@/components/contents-manager/GlobalSettingsPanel";
import type { HomeElementEditorProps } from "@/components/contents-manager/HomeElementEditor";
import { PreviewSection } from "@/components/contents-manager/PreviewSection";
import type { SelfReflectionContent } from "@/components/SelfReflectionEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONTENTS_MANAGER_ACCESS_CODE,
  isContentsManagerUnlocked,
  setContentsManagerUnlocked,
} from "@/const";
import { usePalette } from "@/contexts/PaletteContext";
import type { EventImage, FeatureItem } from "@/lib/content-settings";
import {
  DEFAULT_FEATURES,
  generateImageId,
  getStoredEventImages,
  getStoredFeatures,
  getStoredHeroImage,
  getStoredHeroImageMobile,
  migrateOldImageFormat,
  setStoredEventImages,
  setStoredFeatures,
  setStoredHeroImage,
  setStoredHeroImageMobile,
} from "@/lib/content-settings";
import { applyContentToLocalStorage, fetchContentBySlug, fetchContentManifest } from "@/lib/content-loader";
import { applyDraftToPreviewStorage } from "@/lib/content-manager/preview-storage";
import { fetchRepoConfig, saveContentToGitHub, saveContentViaApi, type RepoConfig } from "@/lib/github-content-api";
import { getContentRepoPathForSlug, TOP_SLUG } from "@/lib/lp-slug";
import type { ContentPayload } from "@/types/content-payload";
import {
  DEFAULT_HOME_COPY,
  getStoredHomeCopy,
  mergeHomeCopy,
  setStoredHomeCopy,
  type HomeCopy,
} from "@/types/home-copy";
import { mergeBtobSeminarContent, type BtobSeminarContent } from "@/types/btob-seminar";
import {
  mergeStartingJobHuntingContent,
  type StartingJobHuntingContent,
} from "@/types/starting-job-hunting";
import { mergeSelfStanceContent, type SelfStanceContent } from "@/types/self-stance";
import {
  mergeJsSelfAnalysisContent,
  type JsSelfAnalysisContent,
} from "@/types/js-self-analysis";
import {
  mergeWorksRecruitingContent,
  type WorksRecruitingContent,
} from "@/types/works-recruiting";
import type { KanpaiEvent } from "@/types/events";
import { getStoredEvents, setStoredEvents } from "@/types/events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContentsManager() {
  const { paletteId, setPaletteId } = usePalette();
  const [unlocked, setUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("kanpai_logo");
    } catch {
      return null;
    }
  });
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(() =>
    typeof window !== "undefined" ? getStoredHeroImage() : null,
  );
  const [heroImageUrlMobile, setHeroImageUrlMobile] = useState<string | null>(() =>
    typeof window !== "undefined" ? getStoredHeroImageMobile() : null,
  );
  const [features, setFeatures] = useState<FeatureItem[]>(() =>
    typeof window !== "undefined" ? getStoredFeatures() : [...DEFAULT_FEATURES],
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
  const [repoConfig, setRepoConfig] = useState<RepoConfig | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [lpSlugs, setLpSlugs] = useState<string[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>(TOP_SLUG);
  const [campaign2603Notice, setCampaign2603Notice] = useState<string>("");
  const [selfReflectionContent, setSelfReflectionContent] = useState<SelfReflectionContent | null>(null);
  const [btobSeminarContent, setBtobSeminarContent] = useState<BtobSeminarContent | null>(null);
  const [startingJobHuntingContent, setStartingJobHuntingContent] =
    useState<StartingJobHuntingContent | null>(null);
  const [selfStanceContent, setSelfStanceContent] = useState<SelfStanceContent | null>(null);
  const [jsSelfAnalysisContent, setJsSelfAnalysisContent] =
    useState<JsSelfAnalysisContent | null>(null);
  const [worksRecruitingContent, setWorksRecruitingContent] =
    useState<WorksRecruitingContent | null>(null);
  const [homeCopy, setHomeCopy] = useState<HomeCopy>(() =>
    typeof window !== "undefined" ? getStoredHomeCopy() : DEFAULT_HOME_COPY,
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementLabel, setSelectedElementLabel] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setUnlocked(isContentsManagerUnlocked());
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    (async () => {
      const [config, manifest] = await Promise.all([fetchRepoConfig(), fetchContentManifest()]);
      setRepoConfig(config);
      const slugs = manifest?.slugs?.length ? manifest.slugs : [TOP_SLUG];
      setLpSlugs(slugs);
      if (!slugs.includes(selectedSlug)) {
        setSelectedSlug(slugs[0] ?? TOP_SLUG);
      }
    })();
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked || !selectedSlug) return;
    setSelectedElementId(null);
    setSelectedElementLabel(null);
    setSheetOpen(false);
    (async () => {
      const payload = await fetchContentBySlug(selectedSlug);
      if (payload) {
        setLogoUrl(payload.logo ?? null);
        setHeroImageUrl(payload.hero ?? null);
        setHeroImageUrlMobile(payload.heroMobile ?? null);
        setFeatures(
          payload.features && payload.features.length >= 3
            ? payload.features.slice(0, 3)
            : [...DEFAULT_FEATURES],
        );
        setEventImages(payload.eventImages && payload.eventImages.length > 0 ? payload.eventImages : []);
        setEvents(
          (payload.events ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        );
        if (payload.paletteId) setPaletteId(payload.paletteId);
        setCampaign2603Notice(payload.campaign2603Notice ?? "");
        setHomeCopy(mergeHomeCopy(payload.copy));
        if (selectedSlug === "self-reflection") {
          setSelfReflectionContent(
            ((payload as ContentPayload).selfReflection ?? null) as SelfReflectionContent | null,
          );
        }
        applyContentToLocalStorage(payload);
      }
      if (selectedSlug === "btob_seminar") {
        setBtobSeminarContent(mergeBtobSeminarContent(payload?.btobSeminar));
      }
      if (selectedSlug === "starting_job_hunting") {
        setStartingJobHuntingContent(mergeStartingJobHuntingContent(payload?.startingJobHunting));
      }
      if (selectedSlug === "self-stance") {
        setSelfStanceContent(mergeSelfStanceContent(payload?.selfStance));
      }
      if (selectedSlug === "js_self_analysis") {
        setJsSelfAnalysisContent(mergeJsSelfAnalysisContent(payload?.jsSelfAnalysis));
      }
      if (selectedSlug === "works_recruiting") {
        setWorksRecruitingContent(mergeWorksRecruitingContent(payload?.worksRecruiting));
      }
    })();
  }, [unlocked, selectedSlug, setPaletteId]);

  const buildPayload = useCallback((): ContentPayload => {
    if (selectedSlug === "self-reflection") {
      return { selfReflection: selfReflectionContent ?? {} };
    }
    if (selectedSlug === "btob_seminar") {
      return { btobSeminar: btobSeminarContent ?? mergeBtobSeminarContent(undefined) };
    }
    if (selectedSlug === "starting_job_hunting") {
      return {
        startingJobHunting:
          startingJobHuntingContent ?? mergeStartingJobHuntingContent(undefined),
      };
    }
    if (selectedSlug === "self-stance") {
      return {
        selfStance: selfStanceContent ?? mergeSelfStanceContent(undefined),
      };
    }
    if (selectedSlug === "js_self_analysis") {
      return {
        jsSelfAnalysis: jsSelfAnalysisContent ?? mergeJsSelfAnalysisContent(undefined),
      };
    }
    if (selectedSlug === "works_recruiting") {
      return {
        worksRecruiting: worksRecruitingContent ?? mergeWorksRecruitingContent(undefined),
      };
    }
    return {
      logo: logoUrl ?? null,
      hero: heroImageUrl ?? null,
      heroMobile: heroImageUrlMobile ?? null,
      eventImages: eventImages.length > 0 ? eventImages : undefined,
      events: events.length > 0 ? events : undefined,
      features: features.slice(0, 3),
      paletteId: paletteId ?? null,
      copy: homeCopy,
      ...(selectedSlug === "campaign2603"
        ? { campaign2603Notice: campaign2603Notice.trim() || null }
        : {}),
    };
  }, [
    selectedSlug,
    selfReflectionContent,
    btobSeminarContent,
    startingJobHuntingContent,
    selfStanceContent,
    jsSelfAnalysisContent,
    worksRecruitingContent,
    logoUrl,
    heroImageUrl,
    heroImageUrlMobile,
    eventImages,
    events,
    features,
    paletteId,
    campaign2603Notice,
    homeCopy,
  ]);

  const previewPayload = useMemo(() => buildPayload(), [buildPayload]);

  useEffect(() => {
    if (!unlocked) return;
    applyDraftToPreviewStorage(selectedSlug, previewPayload);
  }, [unlocked, selectedSlug, previewPayload]);

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

  const persistImages = (next: EventImage[]) => {
    setEventImages(next);
    setStoredEventImages(next);
  };

  const persistFeatures = (next: FeatureItem[]) => {
    setFeatures(next);
    setStoredFeatures(next);
  };

  const handleImageUpdate = (id: string, url: string) => {
    persistImages(eventImages.map((img) => (img.id === id ? { ...img, url } : img)));
  };

  const handleEventFlowLabelUpdate = (id: string, label: string) => {
    persistImages(
      eventImages.map((img) =>
        img.id === id ? { ...img, label: label.trim() || undefined } : img,
      ),
    );
  };

  const handleAddImage = () => {
    if (eventImages.length >= 6) return;
    persistImages([...eventImages, { id: generateImageId(), url: "" }]);
  };

  const handleRemoveImage = (id: string) => {
    if (eventImages.length <= 1) return;
    persistImages(eventImages.filter((img) => img.id !== id));
  };

  const handleLogoUpdate = (url: string) => {
    setLogoUrl(url);
    try {
      localStorage.setItem("kanpai_logo", url);
    } catch {
      /* QuotaExceededError 等 */
    }
  };

  const handleLogoReset = () => {
    setLogoUrl(null);
    try {
      localStorage.removeItem("kanpai_logo");
    } catch {
      /* 同上 */
    }
  };

  const handleHeroImageUpdate = (url: string) => {
    setHeroImageUrl(url);
    setStoredHeroImage(url);
  };

  const handleHeroImageReset = () => {
    setHeroImageUrl(null);
    setStoredHeroImage(null);
  };

  const handleHeroImageMobileUpdate = (url: string) => {
    setHeroImageUrlMobile(url);
    setStoredHeroImageMobile(url);
  };

  const handleHeroImageMobileReset = () => {
    setHeroImageUrlMobile(null);
    setStoredHeroImageMobile(null);
  };

  const handleFeatureUpdate = (index: number, patch: Partial<FeatureItem>) => {
    persistFeatures(features.slice(0, 3).map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const handleDownloadJson = () => {
    const payload = buildPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `content-${selectedSlug}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setSaveError("");
    const repoPath = getContentRepoPathForSlug(selectedSlug);
    setSaveMessage(
      `${a.download} をダウンロードしました。リポジトリの ${repoPath} に置いてコミット・push するとサイトに反映されます。`,
    );
    setTimeout(() => setSaveMessage(""), 6000);
  };

  const useSaveApi = Boolean(
    repoConfig?.saveApiUrl?.trim() && repoConfig?.saveApiSecret?.trim(),
  );

  const handleSaveToGitHub = async () => {
    if (!repoConfig) {
      setSaveError(
        "repo-config.json が未設定です。client/public/repo-config.json に owner / repo を設定してください。",
      );
      return;
    }
    setSaveError("");
    setSaveMessage("保存中…");
    const repoPath = getContentRepoPathForSlug(selectedSlug);
    try {
      if (useSaveApi) {
        await saveContentViaApi(buildPayload(), repoConfig, repoPath);
      } else {
        const token = githubToken.trim();
        if (!token) {
          setSaveError("GitHub トークンを入力してください。");
          setSaveMessage("");
          return;
        }
        await saveContentToGitHub(buildPayload(), token, repoConfig, repoPath);
      }
      setSaveMessage("保存しました。push により数分以内にサイトに反映されます。");
      setTimeout(() => setSaveMessage(""), 6000);
    } catch (e) {
      setSaveMessage("");
      setSaveError(e instanceof Error ? e.message : "保存に失敗しました");
    }
  };

  const handleElementSelect = useCallback((id: string, label?: string) => {
    setSelectedElementId(id);
    setSelectedElementLabel(label ?? null);
    setSheetOpen(true);
  }, []);

  const homeElementEditorProps: HomeElementEditorProps | null = useMemo(
    () => ({
      sectionId: selectedElementId ?? "",
      selectedSlug,
      logoUrl,
      heroImageUrl,
      heroImageUrlMobile,
      features,
      eventImages,
      events,
      campaign2603Notice,
      homeCopy,
      onHomeCopyChange: (next) => {
        setHomeCopy((prev) => {
          const merged = typeof next === "function" ? next(prev) : next;
          setStoredHomeCopy(merged);
          return merged;
        });
      },
      onLogoUpdate: handleLogoUpdate,
      onLogoReset: handleLogoReset,
      onHeroUpdate: handleHeroImageUpdate,
      onHeroReset: handleHeroImageReset,
      onHeroMobileUpdate: handleHeroImageMobileUpdate,
      onHeroMobileReset: handleHeroImageMobileReset,
      onFeatureUpdate: handleFeatureUpdate,
      onFeaturesReset: () => persistFeatures([...DEFAULT_FEATURES]),
      onImageUpdate: handleImageUpdate,
      onEventFlowLabelUpdate: handleEventFlowLabelUpdate,
      onAddImage: handleAddImage,
      onRemoveImage: handleRemoveImage,
      onEventsChange: (next) => {
        setEvents(next);
        setStoredEvents(next);
      },
      onCampaign2603NoticeChange: setCampaign2603Notice,
    }),
    [
      selectedElementId,
      selectedSlug,
      logoUrl,
      heroImageUrl,
      heroImageUrlMobile,
      features,
      eventImages,
      events,
      campaign2603Notice,
      homeCopy,
    ],
  );

  if (!unlocked) {
    return (
      <div
        className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-6"
        style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl border border-[#ffd7c3] shadow-sm">
          <h1
            className="text-xl font-bold text-[#3D281E] mb-2 text-center"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            コンテンツ管理
          </h1>
          <p className="text-sm text-[#5C3E2A] mb-6 text-center">
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
          <h1
            className="text-xl font-bold text-[#3D281E]"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            コンテンツ管理
          </h1>
          <p className="text-xs text-[#5C3E2A]">KANPAI就活 ランディングページ</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8 max-w-5xl">
        {/* 1. 編集する LP */}
        {lpSlugs.length > 0 && (
          <section className="rounded-xl border border-[#ffd7c3] bg-white p-4">
            <Label className="text-[#3D281E] text-sm font-medium block mb-2">編集するLP</Label>
            <Select value={selectedSlug} onValueChange={setSelectedSlug}>
              <SelectTrigger className="max-w-xs border-[#ffd7c3] text-[#3D281E]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lpSlugs.map((slug) => (
                  <SelectItem key={slug} value={slug}>
                    {slug === TOP_SLUG ? "トップ (/)" : `/${slug}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>
        )}

        {/* 2. 保存して反映 */}
        <section className="rounded-xl border border-[#ffd7c3] bg-white p-6">
          <h2
            className="text-lg font-bold text-[#3D281E] mb-2"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            保存して反映
          </h2>
          <p className="text-sm text-[#5C3E2A] mb-4">
            編集内容は{" "}
            <code className="bg-[#fffaf5] px-1.5 py-0.5 rounded">content-{selectedSlug}.json</code>{" "}
            として保存すると、選択中の LP に反映されます。
          </p>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <Button
              type="button"
              variant="outline"
              className="border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
              onClick={handleDownloadJson}
            >
              JSONをダウンロード
            </Button>
          </div>
          {!useSaveApi && (
            <div className="space-y-2 mb-4">
              <Label className="text-[#3D281E] text-sm">GitHub トークン（デプロイ時）</Label>
              <Input
                type="password"
                placeholder="ghp_xxxx..."
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="max-w-md border-[#ffd7c3]"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              type="button"
              className="bg-[#d4844b] hover:bg-[#c47540] text-white"
              onClick={handleSaveToGitHub}
            >
              {useSaveApi ? "保存してデプロイ" : "保存してデプロイ（GitHub）"}
            </Button>
            {saveMessage && <span className="text-sm text-green-700">{saveMessage}</span>}
            {saveError && <span className="text-sm text-red-600">{saveError}</span>}
          </div>
        </section>

        {/* 3. 全体設定 */}
        <section className="rounded-xl border border-[#ffd7c3] bg-white p-6">
          <h2
            className="text-lg font-bold text-[#3D281E] mb-4"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            全体設定
          </h2>
          <GlobalSettingsPanel
            selectedSlug={selectedSlug}
            btobSeminarContent={btobSeminarContent}
            onBtobSeminarChange={setBtobSeminarContent}
            startingJobHuntingContent={startingJobHuntingContent}
            onStartingJobHuntingChange={setStartingJobHuntingContent}
            selfStanceContent={selfStanceContent}
            onSelfStanceChange={setSelfStanceContent}
            jsSelfAnalysisContent={jsSelfAnalysisContent}
            onJsSelfAnalysisChange={setJsSelfAnalysisContent}
            worksRecruitingContent={worksRecruitingContent}
            onWorksRecruitingChange={setWorksRecruitingContent}
          />
        </section>

        {/* 4. プレビュー画面 */}
        <section>
          <h2
            className="text-lg font-bold text-[#3D281E] mb-3"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            プレビュー画面
          </h2>
          <PreviewSection
            selectedSlug={selectedSlug}
            payload={previewPayload}
            onElementSelect={handleElementSelect}
          />
        </section>

        {/* 5. 使い方 */}
        <section className="rounded-xl border border-[#ffd7c3] bg-white p-6">
          <h2
            className="text-lg font-bold text-[#3D281E] mb-4"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            使い方
          </h2>
          <ul className="space-y-2 text-sm text-[#5C3E2A]">
            <li>
              <span className="text-[#d4844b] font-bold">1.</span>{" "}
              プレビュー上の要素をクリックすると、下から編集パレットが開きます。
            </li>
            <li>
              <span className="text-[#d4844b] font-bold">2.</span>{" "}
              編集内容はプレビューに即時反映されます（保存前の確認用）。
            </li>
            <li>
              <span className="text-[#d4844b] font-bold">3.</span>{" "}
              テーマ（Home系）や SEO（特殊LP）は「全体設定」から変更できます。
            </li>
            <li>
              <span className="text-[#d4844b] font-bold">4.</span>{" "}
              確定した内容は「保存してデプロイ」でサイトに反映してください。
            </li>
          </ul>
        </section>
      </main>

      <EditPaletteSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedSlug={selectedSlug}
        elementId={selectedElementId}
        elementLabel={selectedElementLabel}
        homeProps={homeElementEditorProps}
        btobSeminarContent={btobSeminarContent}
        onBtobSeminarChange={setBtobSeminarContent}
        selfReflectionContent={selfReflectionContent}
        onSelfReflectionChange={setSelfReflectionContent}
        startingJobHuntingContent={startingJobHuntingContent}
        onStartingJobHuntingChange={setStartingJobHuntingContent}
        selfStanceContent={selfStanceContent}
        onSelfStanceChange={setSelfStanceContent}
        jsSelfAnalysisContent={jsSelfAnalysisContent}
        onJsSelfAnalysisChange={setJsSelfAnalysisContent}
        worksRecruitingContent={worksRecruitingContent}
        onWorksRecruitingChange={setWorksRecruitingContent}
      />
    </div>
  );
}
