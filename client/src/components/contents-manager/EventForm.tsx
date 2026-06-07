import type { KanpaiEvent } from "@/types/events";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EventForm({
  event,
  onSave,
  onCancel,
  onDelete,
  isNew,
  onChange,
}: {
  event: KanpaiEvent;
  onSave?: (e: KanpaiEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
  onChange?: (e: KanpaiEvent) => void;
}) {
  const [form, setForm] = useState<KanpaiEvent>(event);

  const update = (patch: Partial<KanpaiEvent>) => {
    const next = { ...form, ...patch };
    setForm(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-[#3D281E]">回次（表示用）</Label>
        <Input
          type="number"
          min={1}
          value={form.eventNumber ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            update({ eventNumber: v === "" ? undefined : Math.max(1, parseInt(v, 10) || 1) });
          }}
          placeholder="例: 1（未入力時は表示順で第1回・第2回…）"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div>
        <Label className="text-[#3D281E]">回の備考（任意）</Label>
        <Input
          value={form.eventNote ?? ""}
          onChange={(e) => update({ eventNote: e.target.value || undefined })}
          placeholder="例: 大規模特別回（未入力時はLPに表示しません）"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div>
        <Label className="text-[#3D281E]">日時（表示用）</Label>
        <Input
          value={form.dateLabel}
          onChange={(e) => update({ dateLabel: e.target.value })}
          placeholder="例: 2025年3月15日（土）18:00〜21:00"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[#3D281E]">時間帯（概要用）</Label>
          <Input
            value={form.timeRange ?? ""}
            onChange={(e) => update({ timeRange: e.target.value })}
            placeholder="例: 16:00 – 20:00"
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
        <div>
          <Label className="text-[#3D281E]">時間の補足</Label>
          <Input
            value={form.timeNote ?? ""}
            onChange={(e) => update({ timeNote: e.target.value })}
            placeholder="例: 夕方〜夜にかけて"
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
      </div>
      <div>
        <Label className="text-[#3D281E]">場所</Label>
        <Input
          value={form.location}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="例: 東京都内（お申し込み後にご案内）"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div>
        <Label className="text-[#3D281E]">場所の補足</Label>
        <Input
          value={form.locationNote ?? ""}
          onChange={(e) => update({ locationNote: e.target.value })}
          placeholder="例: 詳細はお申し込み後にご案内"
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[#3D281E]">参加企業数</Label>
          <Input
            type="number"
            min={0}
            value={form.companiesCount}
            onChange={(e) => update({ companiesCount: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
        <div>
          <Label className="text-[#3D281E]">参加学生数</Label>
          <Input
            type="number"
            min={0}
            value={form.studentsCount}
            onChange={(e) => update({ studentsCount: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            className="mt-1 border-[#ffd7c3]"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {!isNew && onSave && (
          <Button
            type="button"
            className="bg-[#d4844b] hover:bg-[#c47540] text-white"
            onClick={() => onSave(form)}
          >
            保存
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        {!isNew && onDelete && (
          <Button
            type="button"
            variant="ghost"
            className="text-red-500 hover:text-red-700"
            onClick={onDelete}
          >
            削除
          </Button>
        )}
      </div>
    </div>
  );
}
