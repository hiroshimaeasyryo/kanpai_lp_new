/** 次回イベントで表示する1件のイベント情報 */
export interface KanpaiEvent {
  id: string;
  /** 回次（表示用・例: 1→「第1回」）。未指定時は表示順で第1回・第2回… */
  eventNumber?: number;
  /** 回の備考（例: 大規模特別回）。未指定時は非表示 */
  eventNote?: string;
  /** 表示用日時（例: 2025年3月15日（土）18:00〜21:00） */
  dateLabel: string;
  /** 時間帯の短い表示（例: 16:00 – 20:00）。未指定なら dateLabel を使用 */
  timeRange?: string;
  /** 時間の補足（例: 夕方〜夜にかけて） */
  timeNote?: string;
  /** 場所 */
  location: string;
  /** 場所の補足（例: ※詳細は参加確定後にご案内） */
  locationNote?: string;
  /** 参加企業数 */
  companiesCount: number;
  /** 参加学生数 */
  studentsCount: number;
  /** 表示順（小さいほど先頭）。次回表示は先頭3件 */
  order: number;
}

const STORAGE_KEY = "kanpai_events";

const defaultEvents: KanpaiEvent[] = [
  {
    id: "default-1",
    eventNumber: 16,
    dateLabel: "2025年3月4日（水）13:00〜17:00",
    timeRange: "13:00 – 17:00",
    timeNote: "昼間〜夜にかけて",
    location: "新宿（お申し込み後にご案内）",
    locationNote: "",
    companiesCount: 4,
    studentsCount: 24,
    order: 0,
  },
  {
    id: "default-2",
    eventNumber: 17,
    eventNote: "大規模特別回",
    dateLabel: "2026年3月18日（水）16:00〜20:00",
    timeRange: "16:00 – 20:00",
    location: "新宿（お申し込み後にご案内）",
    companiesCount: 8,
    studentsCount: 40,
    order: 1,
  },
];

function parseStored(raw: string | null): KanpaiEvent[] {
  if (!raw) return defaultEvents;
  try {
    const parsed = JSON.parse(raw) as KanpaiEvent[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultEvents;
  } catch {
    return defaultEvents;
  }
}

/** localStorage からイベント一覧を取得。先頭から最大3件が「次回のイベント詳細」に表示される */
export function getStoredEvents(): KanpaiEvent[] {
  if (typeof window === "undefined") return defaultEvents;
  const raw = localStorage.getItem(STORAGE_KEY);
  const list = parseStored(raw);
  return [...list].sort((a, b) => a.order - b.order);
}

/** イベント一覧を localStorage に保存 */
export function setStoredEvents(events: KanpaiEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/** 次回表示用のイベントを最大 limit 件取得（先頭から）。回次は表示順で第1回・第2回… */
export function getNextEvents(limit: number = 3): KanpaiEvent[] {
  const list = getStoredEvents();
  return list.slice(0, Math.max(0, limit));
}

export { STORAGE_KEY as EVENTS_STORAGE_KEY, defaultEvents };
