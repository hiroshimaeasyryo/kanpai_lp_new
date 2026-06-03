import { useEffect } from "react";
import {
  KDK_GATE_PATH,
  KDK_MOCKUP_DEFAULT_PATH,
  parseKdkMockupNext,
} from "@/lib/kdk-mockup-auth";

/**
 * SPA 側の /kdk は静的ゲート（/kdk/）へ委譲する。
 * GitHub Pages では /kdk と /kdk/ の扱いが異なるため、ゲートは常に /kdk/ に統一する。
 */
export default function KdkMockup() {
  useEffect(() => {
    const next = parseKdkMockupNext();
    const target = new URL(KDK_GATE_PATH, window.location.origin);
    if (next) target.searchParams.set("next", next);
    window.location.replace(target.toString());
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <p className="p-4 text-sm text-muted-foreground">
        リダイレクト中…（
        <a href={KDK_MOCKUP_DEFAULT_PATH}>KDK モック</a>）
      </p>
    </div>
  );
}
