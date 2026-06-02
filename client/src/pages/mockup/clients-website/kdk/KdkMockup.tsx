import AccessKeyGate from "@/components/AccessKeyGate";
import {
  isKdkMockupUnlocked,
  KDK_MOCKUP_ACCESS_KEY,
  setKdkMockupUnlocked,
} from "@/const";
import { useNoIndex } from "@/hooks/useNoIndex";

function getNextFromQuery(): string | null {
  const url = new URL(window.location.href);
  const next = url.searchParams.get("next");
  if (!next) return null;
  try {
    const decoded = decodeURIComponent(next);
    if (!decoded.startsWith("/kdk")) return null;
    return decoded;
  } catch {
    return null;
  }
}

export default function KdkMockup() {
  useNoIndex(true);

  return (
    <AccessKeyGate
      title="KDK モック（閲覧キー）"
      description="これは一般公開用ではありません。アクセスキーを入力してください。"
      expectedKey={KDK_MOCKUP_ACCESS_KEY}
      isUnlocked={isKdkMockupUnlocked}
      onUnlock={() => {
        setKdkMockupUnlocked();
        const next = getNextFromQuery();
        window.location.assign(next ?? "/kdk/index.html");
      }}
    >
      {/* ここに来た時点で onUnlock でリダイレクト済みの想定 */}
      <div className="min-h-dvh bg-background text-foreground" />
    </AccessKeyGate>
  );
}

