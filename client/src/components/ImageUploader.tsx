/* Wa-Modern Minimalism Design Philosophy
   - 温かみのある対話性: 手書き風要素とソフトなインタラクション
   - 誠実な透明性: 飾らない、正直な表現を視覚的に体現
*/

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label: string;
}

export function ImageUploader({ onImageUpload, currentImage, label }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ファイルサイズは5MB以下にしてください");
      return;
    }

    // ファイルタイプチェック
    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルを選択してください");
      return;
    }

    setIsUploading(true);

    try {
      // プレビュー用のData URLを作成
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreviewUrl(dataUrl);
        onImageUpload(dataUrl);
        toast.success("画像をアップロードしました");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("画像のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 border-[#ffd7c3] bg-white">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-[#5C3D2E] mb-1" style={{ fontFamily: "'Shippori Mincho', serif" }}>
            {label}
          </h3>
          <p className="text-xs text-[#875a3c]">
            JPG, PNG, GIF形式（最大5MB）
          </p>
        </div>

        {previewUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-[#f5e6cd]">
            <img
              src={previewUrl}
              alt="プレビュー"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full bg-[#d4844b] hover:bg-[#c47540] text-white"
        >
          {isUploading ? "アップロード中..." : previewUrl ? "画像を変更" : "画像を選択"}
        </Button>
      </div>
    </Card>
  );
}
