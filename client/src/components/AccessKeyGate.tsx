import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  title: string;
  description?: string;
  expectedKey: string;
  isUnlocked: () => boolean;
  onUnlock: () => void;
  children: React.ReactNode;
};

export default function AccessKeyGate({
  title,
  description,
  expectedKey,
  isUnlocked,
  onUnlock,
  children,
}: Props) {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const unlocked = useMemo(() => isUnlocked(), [isUnlocked]);
  if (unlocked) return <>{children}</>;

  function submit() {
    if (key.trim() !== expectedKey) {
      setError("アクセスキーが一致しません。");
      return;
    }
    setError(null);
    onUnlock();
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-10">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="アクセスキー"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
          <Button onClick={submit}>入室</Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

