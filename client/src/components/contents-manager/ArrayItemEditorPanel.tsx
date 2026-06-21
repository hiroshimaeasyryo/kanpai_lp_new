import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/contents-manager/ConfirmActionDialog";
import {
  getArrayItemLabel,
  type ParsedArrayItem,
} from "@/lib/content-manager/array-item-registry";
import type { ArrayMutationOp } from "@/lib/content-manager/array-item-mutations";

type PendingAction = {
  op: ArrayMutationOp;
  label: string;
  title: string;
  description: string;
};

type Props = {
  parsed: ParsedArrayItem;
  onMutate: (op: ArrayMutationOp) => void;
  canRemove: boolean;
  /** standalone: 余白クリック用 / inline: 文言編集パレット下部に併設 */
  variant?: "standalone" | "inline";
};

export function ArrayItemEditorPanel({
  parsed,
  onMutate,
  canRemove,
  variant = "standalone",
}: Props) {
  const [pending, setPending] = useState<PendingAction | null>(null);
  const itemLabel = getArrayItemLabel(parsed.def, parsed.index);

  const openConfirm = (op: ArrayMutationOp) => {
    if (op === "remove") {
      setPending({
        op,
        label: "削除",
        title: "項目を削除",
        description: `${itemLabel} を削除してよろしいですか？`,
      });
      return;
    }
    const position = op === "insertBefore" ? "前" : "後ろ";
    setPending({
      op,
      label: `${position}に追加`,
      title: `${position}に新しい項目を追加してよろしいですか？`,
      description: "コピー追加されますので、編集した後保存してください。",
    });
  };

  return (
    <div className="space-y-4">
      {variant === "standalone" ? (
        <p className="text-sm text-[#5C3E2A]">
          テキスト部分をクリックすると文言の編集パレットが開きます。このパレットでは項目の追加・削除ができます。
        </p>
      ) : (
        <p className="text-sm font-medium text-[#3D281E]">項目の追加・削除</p>
      )}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="border-[#d4844b] text-[#d4844b] justify-center"
          onClick={() => openConfirm("insertBefore")}
        >
          前に追加する
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-[#d4844b] text-[#d4844b] justify-center"
          onClick={() => openConfirm("insertAfter")}
        >
          後ろに追加する
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-red-300 text-red-600 justify-center"
          disabled={!canRemove}
          onClick={() => openConfirm("remove")}
        >
          項目を削除する
        </Button>
        {!canRemove && (
          <p className="text-xs text-[#5C3E2A]">最低1件は残す必要があります。</p>
        )}
      </div>

      {pending && (
        <ConfirmActionDialog
          open
          onOpenChange={(open) => {
            if (!open) setPending(null);
          }}
          title={pending.title}
          description={pending.description}
          onConfirm={() => onMutate(pending.op)}
        />
      )}
    </div>
  );
}
