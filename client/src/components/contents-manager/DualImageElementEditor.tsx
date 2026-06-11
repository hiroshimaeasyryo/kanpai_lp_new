import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { toast } from "sonner";

type Props = {
  pcUrl: string | null;
  mobileUrl: string | null;
  onPcUpload: (url: string) => void;
  onMobileUpload: (url: string) => void;
  onPcDelete: () => void;
  onMobileDelete: () => void;
  onResetDefault?: () => void;
  showMobile?: boolean;
  pcLabel?: string;
  mobileLabel?: string;
};

function readImageFile(file: File, onDone: (url: string) => void) {
  if (file.size > 5 * 1024 * 1024) {
    toast.error("ファイルサイズは5MB以下にしてください");
    return;
  }
  if (!file.type.startsWith("image/")) {
    toast.error("画像ファイルを選択してください");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string;
    onDone(dataUrl);
    toast.success("画像をアップロードしました");
  };
  reader.readAsDataURL(file);
}

function ImageSlot({
  label,
  url,
  onUpload,
  onDelete,
  hint,
}: {
  label: string;
  url: string | null;
  onUpload: (url: string) => void;
  onDelete: () => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2 rounded-xl border border-[#ffd7c3] bg-[#fffaf5] p-3">
      <div>
        <Label className="text-[#3D281E] text-sm">{label}</Label>
        {hint && <p className="text-xs text-[#5C3E2A] mt-0.5">{hint}</p>}
      </div>
      {url && (
        <div className="aspect-video rounded-lg overflow-hidden bg-[#f5e6cd]">
          <img src={url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readImageFile(file, onUpload);
          e.target.value = "";
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          className="bg-[#d4844b] hover:bg-[#c47540] text-white"
          onClick={() => inputRef.current?.click()}
        >
          {url ? "画像を変更" : "画像をアップロード"}
        </Button>
        {url && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={onDelete}
          >
            削除
          </Button>
        )}
      </div>
    </div>
  );
}

/** PC / モバイル画像の編集パレット（コンパクト版） */
export function DualImageElementEditor({
  pcUrl,
  mobileUrl,
  onPcUpload,
  onMobileUpload,
  onPcDelete,
  onMobileDelete,
  onResetDefault,
  showMobile = true,
  pcLabel = "PC用画像",
  mobileLabel = "モバイル用画像",
}: Props) {
  const effectiveMobile = mobileUrl?.trim() ? mobileUrl : pcUrl;

  return (
    <div className="w-full space-y-4">
      <ImageSlot label={pcLabel} url={pcUrl} onUpload={onPcUpload} onDelete={onPcDelete} />
      {showMobile && (
        <ImageSlot
          label={mobileLabel}
          url={effectiveMobile}
          onUpload={onMobileUpload}
          onDelete={onMobileDelete}
          hint="未登録の場合はPC用と同じ画像が表示されます"
        />
      )}
      {onResetDefault && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-[#d4844b] text-[#d4844b] hover:bg-[#fffaf5]"
          onClick={onResetDefault}
        >
          デフォルトに戻す
        </Button>
      )}
    </div>
  );
}
