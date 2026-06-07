import { Button } from "@/components/ui/button";
import { buildPreviewUrl, getPreviewPath, isCmPreviewMessage } from "@/lib/content-manager/cm-preview";
import type { ContentPayload } from "@/types/content-payload";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTH: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

interface PreviewSectionProps {
  selectedSlug: string;
  payload: ContentPayload;
  onElementSelect: (id: string, label?: string) => void;
}

export function PreviewSection({ selectedSlug, payload, onElementSelect }: PreviewSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const previewPath = getPreviewPath(selectedSlug);
  const previewUrl = buildPreviewUrl(selectedSlug);

  const sendDraft = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: "cm-draft", slug: selectedSlug, payload }, window.location.origin);
  }, [selectedSlug, payload]);

  useEffect(() => {
    sendDraft();
  }, [sendDraft, iframeKey]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isCmPreviewMessage(event.data)) return;
      if (event.data.type === "cm-ready") {
        sendDraft();
      }
      if (event.data.type === "cm-select") {
        onElementSelect(event.data.id, event.data.label);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onElementSelect, sendDraft]);

  useEffect(() => {
    setIframeKey((k) => k + 1);
  }, [selectedSlug]);

  return (
    <div className="rounded-xl border border-[#ffd7c3] bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#ffd7c3] bg-[#fffaf5]">
        <div className="flex gap-2">
          {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
            <Button
              key={v}
              type="button"
              size="sm"
              variant={viewport === v ? "default" : "outline"}
              className={
                viewport === v
                  ? "bg-[#d4844b] hover:bg-[#c47540] text-white"
                  : "border-[#ffd7c3] text-[#5C3E2A]"
              }
              onClick={() => setViewport(v)}
            >
              {v === "desktop" ? "PC" : v === "tablet" ? "Tablet" : "Mobile"}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#5C3E2A]">
          <code className="bg-white px-2 py-0.5 rounded border border-[#ffd7c3] text-xs">
            {previewPath}
          </code>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setIframeKey((k) => k + 1)}
            title="プレビューを再読み込み"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => window.open(previewUrl, "_blank")}
            title="新しいタブで開く"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center bg-[#f5f0eb] p-4 min-h-[480px]">
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={previewUrl}
          title="LPプレビュー"
          className="bg-white border border-[#e8ddd4] rounded-lg shadow-sm transition-all duration-200"
          style={{
            width: VIEWPORT_WIDTH[viewport],
            maxWidth: "100%",
            height: "min(72vh, 900px)",
          }}
        />
      </div>
      <p className="px-4 py-3 text-xs text-[#5C3E2A] border-t border-[#ffd7c3]">
        プレビュー上の要素をクリックすると、下から編集パレットが開きます。
      </p>
    </div>
  );
}
