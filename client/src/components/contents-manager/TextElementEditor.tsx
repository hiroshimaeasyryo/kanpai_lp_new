import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldStyleEditor } from "@/components/contents-manager/FieldStyleEditor";
import type { TextFieldStyle } from "@/types/home-copy-style";

const fieldCls = "mt-1 border-[#ffd7c3]";
const labelCls = "text-[#3D281E]";

type Props = {
  text: string;
  onTextChange: (value: string) => void;
  style?: TextFieldStyle;
  onStyleChange: (patch: Partial<TextFieldStyle>) => void;
  multiline?: boolean;
  rows?: number;
  href?: string;
  onHrefChange?: (href: string) => void;
};

export function TextElementEditor({
  text,
  onTextChange,
  style,
  onStyleChange,
  multiline = false,
  rows = 4,
  href,
  onHrefChange,
}: Props) {
  return (
    <div className="w-full space-y-4">
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

      <FieldStyleEditor
        style={style}
        onStyleChange={onStyleChange}
        href={href}
        onHrefChange={onHrefChange}
      />
    </div>
  );
}
