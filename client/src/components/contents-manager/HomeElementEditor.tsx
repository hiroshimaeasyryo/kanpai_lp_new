import { EventForm } from "@/components/contents-manager/EventForm";
import { DualImageElementEditor } from "@/components/contents-manager/DualImageElementEditor";
import { HomeCopyEditorSections } from "@/components/contents-manager/HomeCopyEditorSections";
import { TextElementEditor } from "@/components/contents-manager/TextElementEditor";
import { parseIndexedFieldId } from "@/lib/content-manager/home-copy-field-id";
import { hasHomeCopyEditorSection } from "@/lib/content-manager/home-copy-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EventImage, FeatureItem } from "@/lib/content-settings";
import {
  DEFAULT_EVENT_FLOW_LABELS,
  DEFAULT_FEATURE_IMAGE_PATHS,
  DEFAULT_FEATURES,
  generateImageId,
} from "@/lib/content-settings";
import { ImageUploader } from "@/components/ImageUploader";
import type { HomeCopy } from "@/types/home-copy";
import { patchFieldStyle } from "@/types/home-copy-style";
import type { KanpaiEvent } from "@/types/events";
import { defaultEvents } from "@/types/events";
import { useState } from "react";

export interface HomeElementEditorProps {
  sectionId: string;
  selectedSlug: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  heroImageUrlMobile: string | null;
  features: FeatureItem[];
  eventImages: EventImage[];
  events: KanpaiEvent[];
  campaign2603Notice: string;
  homeCopy: HomeCopy;
  defaultLineHref?: string;
  onHomeCopyChange: (next: HomeCopy | ((prev: HomeCopy) => HomeCopy)) => void;
  onLogoUpdate: (url: string) => void;
  onLogoReset: () => void;
  onHeroUpdate: (url: string) => void;
  onHeroReset: () => void;
  onHeroMobileUpdate: (url: string) => void;
  onHeroMobileReset: () => void;
  onFeatureUpdate: (index: number, patch: Partial<FeatureItem>) => void;
  onFeaturesReset: () => void;
  onImageUpdate: (id: string, url: string) => void;
  onEventFlowLabelUpdate: (id: string, label: string) => void;
  onAddImage: () => void;
  onRemoveImage: (id: string) => void;
  onEventsChange: (events: KanpaiEvent[]) => void;
  onCampaign2603NoticeChange: (value: string) => void;
}

export function HomeElementEditor(props: HomeElementEditorProps) {
  const { sectionId } = props;

  if (hasHomeCopyEditorSection(sectionId)) {
    return (
      <HomeCopyEditorSections
        copy={props.homeCopy}
        onChange={props.onHomeCopyChange}
        sectionId={sectionId}
        defaultLineHref={props.defaultLineHref}
      />
    );
  }

  if (sectionId === "brand-logo") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#5C3E2A]">
          ヘッダー・フッターに表示されるロゴです。未設定の場合はデフォルトのアイコンが表示されます。
        </p>
        <DualImageElementEditor
          pcUrl={props.logoUrl}
          mobileUrl={null}
          showMobile={false}
          pcLabel="ロゴ画像"
          onPcUpload={props.onLogoUpdate}
          onMobileUpload={() => {}}
          onPcDelete={props.onLogoReset}
          onMobileDelete={() => {}}
          onResetDefault={props.onLogoReset}
        />
      </div>
    );
  }

  if (sectionId === "hero-image") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#5C3E2A]">
          PC用とモバイル用を分けると、スマホでは軽い画像だけ読み込まれて表示が速くなります。
        </p>
        <DualImageElementEditor
          pcUrl={props.heroImageUrl}
          mobileUrl={props.heroImageUrlMobile}
          onPcUpload={props.onHeroUpdate}
          onMobileUpload={props.onHeroMobileUpdate}
          onPcDelete={props.onHeroReset}
          onMobileDelete={props.onHeroMobileReset}
          onResetDefault={() => {
            props.onHeroReset();
            props.onHeroMobileReset();
          }}
        />
      </div>
    );
  }

  {
    const parsed = parseIndexedFieldId(sectionId, "feature");
    if (parsed) {
      const { index, field } = parsed;
      const item = props.features[index] ?? DEFAULT_FEATURES[index];
      const defaultImagePath = DEFAULT_FEATURE_IMAGE_PATHS[index];

      if (field === "title") {
        return (
          <TextElementEditor
            text={item.title}
            onTextChange={(v) => props.onFeatureUpdate(index, { title: v })}
            style={props.homeCopy.fieldStyles?.[sectionId]}
            onStyleChange={(partial) =>
              props.onHomeCopyChange((prev) => ({
                ...prev,
                fieldStyles: patchFieldStyle(prev.fieldStyles, sectionId, partial),
              }))
            }
          />
        );
      }
      if (field === "body") {
        return (
          <TextElementEditor
            text={item.body}
            onTextChange={(v) => props.onFeatureUpdate(index, { body: v })}
            style={props.homeCopy.fieldStyles?.[sectionId]}
            onStyleChange={(partial) =>
              props.onHomeCopyChange((prev) => ({
                ...prev,
                fieldStyles: patchFieldStyle(prev.fieldStyles, sectionId, partial),
              }))
            }
            multiline
            rows={5}
          />
        );
      }
      if (field === "image") {
        return (
          <div className="space-y-4">
            <DualImageElementEditor
              pcUrl={item.imageUrl?.trim() ? item.imageUrl : null}
              mobileUrl={null}
              showMobile={false}
              pcLabel={`特徴 ${index + 1} の画像`}
              onPcUpload={(url) => props.onFeatureUpdate(index, { imageUrl: url })}
              onMobileUpload={() => {}}
              onPcDelete={() => props.onFeatureUpdate(index, { imageUrl: null })}
              onMobileDelete={() => {}}
              onResetDefault={() => props.onFeatureUpdate(index, { imageUrl: defaultImagePath })}
            />
            <Button type="button" variant="ghost" size="sm" onClick={props.onFeaturesReset}>
              3つの特徴をすべてデフォルトに戻す
            </Button>
          </div>
        );
      }
    }
  }

  if (sectionId === "event-flow-images") {
    const images = props.eventImages.slice(0, 3);
    return (
      <div className="space-y-6">
        <p className="text-sm text-[#5C3E2A]">
          1〜3枚目は「当日の過ごし方」のカルーセルに使われます（イベント画像の先頭3枚と連動）。
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {images.map((img, i) => (
            <div key={img.id} className="space-y-2">
              <ImageUploader
                label={`カルーセル画像 ${i + 1}`}
                currentImage={img.url || undefined}
                onImageUpload={(url) => props.onImageUpdate(img.id, url)}
              />
              <div>
                <Label className="text-xs text-[#3D281E]">表示ラベル</Label>
                <Input
                  value={img.label ?? ""}
                  onChange={(e) => props.onEventFlowLabelUpdate(img.id, e.target.value)}
                  placeholder={DEFAULT_EVENT_FLOW_LABELS[i]}
                  className="mt-1 border-[#ffd7c3] text-sm"
                />
              </div>
              {img.url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-red-300 text-red-600"
                  onClick={() => props.onImageUpdate(img.id, "")}
                >
                  画像を削除
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionId === "about-images") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-[#5C3E2A]">Aboutセクションに表示されるイベント画像です（最大6枚）。</p>
        <div className="grid md:grid-cols-2 gap-4">
          {props.eventImages.map((img, i) => (
            <div key={img.id} className="space-y-2">
              <ImageUploader
                label={`イベント画像 ${i + 1}`}
                currentImage={img.url || undefined}
                onImageUpload={(url) => props.onImageUpdate(img.id, url)}
              />
              {img.url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-red-300 text-red-600"
                  onClick={() => props.onImageUpdate(img.id, "")}
                >
                  画像を削除
                </Button>
              )}
              {props.eventImages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-500"
                  onClick={() => props.onRemoveImage(img.id)}
                >
                  この画像を削除
                </Button>
              )}
            </div>
          ))}
        </div>
        {props.eventImages.length < 6 && (
          <Button
            type="button"
            variant="outline"
            className="border-[#d4844b] text-[#d4844b]"
            onClick={props.onAddImage}
          >
            画像を追加
          </Button>
        )}
      </div>
    );
  }

  if (sectionId === "event-list" || sectionId === "event-detail") {
    return (
      <EventListEditor
        events={props.events}
        onEventsChange={props.onEventsChange}
      />
    );
  }

  if (sectionId === "campaign2603-notice") {
    return (
      <div className="w-full space-y-4">
        <p className="text-sm text-[#5C3E2A] mb-2">
          イベント詳細「場所」の下に表示するテキストです。改行はLP上でも反映されます。
        </p>
        <div>
          <Label className="text-[#3D281E]">テキスト</Label>
          <Textarea
            value={props.campaign2603Notice}
            onChange={(e) => props.onCampaign2603NoticeChange(e.target.value)}
            className="mt-1 min-h-[180px] border-[#ffd7c3]"
            rows={8}
          />
        </div>
      </div>
    );
  }

  return <p className="text-sm text-[#5C3E2A]">この要素のエディタは未設定です。</p>;
}

function EventListEditor({
  events,
  onEventsChange,
}: {
  events: KanpaiEvent[];
  onEventsChange: (events: KanpaiEvent[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newEventForm, setNewEventForm] = useState<KanpaiEvent>(() => ({
    id: generateImageId(),
    dateLabel: "",
    timeRange: "",
    timeNote: "",
    location: "",
    locationNote: "",
    companiesCount: 4,
    studentsCount: 20,
    order: events.length,
  }));

  const handleSave = (updated: KanpaiEvent) => {
    onEventsChange(events.map((e) => (e.id === updated.id ? updated : e)));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onEventsChange(
      events.filter((e) => e.id !== id).map((e, i) => ({ ...e, order: i })),
    );
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newEventForm.dateLabel.trim() || !newEventForm.location.trim()) return;
    onEventsChange([...events, { ...newEventForm, order: events.length }]);
    setAddingNew(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#5C3E2A]">
        一覧の先頭から最大3件がLPの「次回のイベント詳細」に表示されます。
      </p>
      {events.map((ev) => (
        <div key={ev.id} className="p-4 bg-[#fffaf5] border border-[#ffd7c3] rounded-xl">
          {editingId === ev.id ? (
            <EventForm
              event={ev}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDelete(ev.id)}
            />
          ) : (
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium text-[#3D281E]">{ev.dateLabel || "（日時未設定）"}</p>
                <p className="text-sm text-[#5C3E2A]">{ev.location}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-[#d4844b] text-[#d4844b]"
                onClick={() => setEditingId(ev.id)}
              >
                編集
              </Button>
            </div>
          )}
        </div>
      ))}
      {addingNew ? (
        <div className="p-4 border border-dashed border-[#ffd7c3] rounded-xl">
          <EventForm
            event={newEventForm}
            isNew
            onChange={setNewEventForm}
            onCancel={() => setAddingNew(false)}
          />
          <Button type="button" className="mt-3 bg-[#d4844b] text-white" onClick={handleAdd}>
            追加する
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="border-[#d4844b] text-[#d4844b]"
          onClick={() => setAddingNew(true)}
        >
          ＋ イベントを追加
        </Button>
      )}
      <Button type="button" variant="ghost" size="sm" onClick={() => onEventsChange(defaultEvents)}>
        イベントをデフォルトに戻す
      </Button>
    </div>
  );
}
