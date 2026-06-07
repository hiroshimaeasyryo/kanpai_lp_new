interface ReadOnlyElementPanelProps {
  label: string;
}

export function ReadOnlyElementPanel({ label }: ReadOnlyElementPanelProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#5C3E2A] leading-relaxed">
        「{label}」は LP 上に固定表示されているテキストです。管理画面からの編集には現在対応していません。
      </p>
      <p className="text-xs text-[#8B7355]">
        文言の変更が必要な場合は、開発者にコード修正を依頼してください。
      </p>
    </div>
  );
}
