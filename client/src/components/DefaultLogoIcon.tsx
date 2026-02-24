/**
 * ロゴ未設定時に表示するデフォルトアイコン。
 * 変更する場合:
 * 1) 画像で差し替え: client/public/default-logo.png を置く（content-settings の DEFAULT_LOGO_IMAGE_PATH）
 * 2) SVG を変更: このファイル内のインライン SVG の path を編集する
 */

import { useState } from "react";
import { DEFAULT_LOGO_IMAGE_PATH } from "@/lib/content-settings";

export type DefaultLogoIconSize = "sm" | "md";

const sizeClasses: Record<DefaultLogoIconSize, string> = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
};

/** インライン SVG のアイコン（乾杯風）。画像が未配置・失敗したときのフォールバック */
function DefaultLogoSvg({ size }: { size: DefaultLogoIconSize }) {
  const isSm = size === "sm";
  return (
    <svg className={sizeClasses[size]} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M10 30V14c0-2 1-4 3-5l2-1v22m0 0c0 0-1 0-1-1v-2"
        stroke="currentColor"
        strokeWidth={isSm ? 2 : 2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 30V14c0-2-1-4-3-5l-2-1v22m0 0c0 0 1 0 1-1v-2"
        stroke="currentColor"
        strokeWidth={isSm ? 2 : 2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10l4-4m12 4l-4-4"
        stroke="var(--lp-primary)"
        strokeWidth={isSm ? 1.5 : 2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DefaultLogoIcon({ size = "md" }: { size?: DefaultLogoIconSize }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (DEFAULT_LOGO_IMAGE_PATH && !imageFailed) {
    return (
      <img
        src={DEFAULT_LOGO_IMAGE_PATH}
        alt="ロゴ"
        className={`${sizeClasses[size]} object-contain`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return <DefaultLogoSvg size={size} />;
}
