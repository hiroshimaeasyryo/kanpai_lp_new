import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FONT_FAMILY_OPTIONS,
  formatFontSizePx,
  parseFontSizePx,
  TEXT_SIZE_MAX_PX,
  TEXT_SIZE_MIN_PX,
  TEXT_SIZE_SLIDER_DEFAULT_PX,
  type TextFieldStyle,
} from "@/types/home-copy-style";
import * as SliderPrimitive from "@radix-ui/react-slider";

const fieldCls = "mt-1 border-[#ffd7c3]";
const labelCls = "text-[#3D281E]";

type Props = {
  text: string;
  onTextChange: (value: string) => void;
  style?: TextFieldStyle;
  onStyleChange: (patch: Partial<TextFieldStyle>) => void;
  multiline?: boolean;
  rows?: number;
};

function TextSizeSlider({
  fontSize,
  onFontSizeChange,
}: {
  fontSize?: string;
  onFontSizeChange: (px: number) => void;
}) {
  const savedPx = parseFontSizePx(fontSize);
  const sliderPx = savedPx ?? TEXT_SIZE_SLIDER_DEFAULT_PX;
  const thumbLabel = savedPx != null ? `${savedPx}px` : `${TEXT_SIZE_SLIDER_DEFAULT_PX}px`;

  return (
    <div className="mt-2 space-y-1">
      <SliderPrimitive.Root
        className="relative flex w-full touch-none items-center select-none py-2"
        min={TEXT_SIZE_MIN_PX}
        max={TEXT_SIZE_MAX_PX}
        step={1}
        value={[sliderPx]}
        onValueChange={([v]) => onFontSizeChange(v)}
        aria-label="テキストサイズ"
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#f5e6cd]">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-[#d4844b]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "flex h-7 min-w-[3.25rem] shrink-0 items-center justify-center rounded-full border-2 border-[#d4844b] bg-white px-2",
            "text-xs font-semibold tabular-nums text-[#3D281E] shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4844b]/40",
          )}
        >
          {thumbLabel}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      <div className="flex justify-between text-[10px] text-[#5C3E2A]">
        <span>{TEXT_SIZE_MIN_PX}px</span>
        <span>{TEXT_SIZE_MAX_PX}px</span>
      </div>
    </div>
  );
}

export function TextElementEditor({
  text,
  onTextChange,
  style,
  onStyleChange,
  multiline = false,
  rows = 4,
}: Props) {
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <Label className={labelCls}>テキスト</Label>
        {multiline ? (
          <Textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className={`${fieldCls} min-h-[80px]`}
            rows={rows}
          />
        ) : (
          <Input
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className={fieldCls}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label className={labelCls}>テキストサイズ</Label>
          <TextSizeSlider
            fontSize={style?.fontSize}
            onFontSizeChange={(px) => onStyleChange({ fontSize: formatFontSizePx(px) })}
          />
        </div>

        <div>
          <Label className={labelCls}>テキストカラー</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={style?.color?.startsWith("#") ? style.color : "#3D281E"}
              onChange={(e) => onStyleChange({ color: e.target.value })}
              className="h-10 w-12 p-1 border-[#ffd7c3] cursor-pointer"
            />
            <Input
              value={style?.color ?? ""}
              onChange={(e) => onStyleChange({ color: e.target.value })}
              placeholder="#3D281E"
              className={`${fieldCls} flex-1`}
            />
          </div>
        </div>

        <div>
          <Label className={labelCls}>テキストフォント</Label>
          <Select
            value={style?.fontFamily ?? ""}
            onValueChange={(v) => onStyleChange({ fontFamily: v === "__default__" ? "" : v })}
          >
            <SelectTrigger className={fieldCls}>
              <SelectValue placeholder="デフォルト" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value || "__default__"} value={opt.value || "__default__"}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label className={labelCls}>埋め込みURL</Label>
          <Input
            value={style?.href ?? ""}
            onChange={(e) => onStyleChange({ href: e.target.value })}
            placeholder="https://..."
            className={fieldCls}
          />
        </div>
      </div>
    </div>
  );
}
