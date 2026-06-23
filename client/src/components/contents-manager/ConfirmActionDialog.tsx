import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

/** キャンセル（左）・続ける（右）の確認ダイアログ */
export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "続ける",
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogTitle className="text-[#3D281E]">{title}</DialogTitle>
        <DialogDescription className="text-[#5C3E2A]">{description}</DialogDescription>
        <div className="flex flex-row items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="border-[#ffd7c3] text-[#5C3E2A]"
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            className="bg-[#d4844b] hover:bg-[#c47540] text-white"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
