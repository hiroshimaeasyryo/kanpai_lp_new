/** 次回イベント・イベント概要で表示する1件のイベント情報 */
export interface KanpaiEvent {
  id: string;
  /** 表示用日時（例: 2025年3月15日（土）18:00〜21:00） */
  dateLabel: string;
  /** 時間帯の短い表示（例: 16:00 – 20:00）。イベント概要で使用。未指定なら dateLabel を使用 */
  timeRange?: string;
  /** 時間の補足（例: 夕方〜夜にかけて） */
  timeNote?: string;
  /** 場所 */
  location: string;
  /** 場所の補足（例: ※詳細は参加確定後にご案内） */
  locationNote?: string;
  /** 参加企業数 */
  companiesCount: number;
  /** 募集学生数 */
  studentsCount: number;
  /** 表示順（小さいほど先頭）。次回表示は先頭1件 */
  order: number;
}

const STORAGE_KEY = "kanpai_events";

const defaultEvents: KanpaiEvent[] = [
  {
    id: "default-1",
    dateLabel: "2025年3月15日（土）18:00〜21:00",
    timeRange: "16:00 – 20:00",
    timeNote: "夕方〜夜にかけて",
    location: "東京都内（お申し込み後にご案内）",
    locationNote: "",
    companiesCount: 15,
    studentsCount: 40,
    order: 0,
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

/** localStorage からイベント一覧を取得。先頭1件が「次回のイベント」として表示される */
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

/** 次回表示用のイベント1件を取得（先頭） */
export function getNextEvent(): KanpaiEvent | null {
  const list = getStoredEvents();
  return list.length > 0 ? list[0] : null;
}

export { STORAGE_KEY as EVENTS_STORAGE_KEY, defaultEvents };
