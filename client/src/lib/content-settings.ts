/**
 * コンテンツ設定の localStorage 管理
 * 画像配列の保存・読み込み・旧フォーマットからの移行を提供
 */

export interface EventImage {
  id: string;
  url: string;
  /** EVENT FLOW カルーセル用の表示ラベル（例: 第1回）。未設定時はデフォルト 第1回/第7回/第13回 を使用 */
  label?: string;
}

const EVENT_IMAGES_KEY = "kanpai_event_images";

/** localStorage からイベント画像配列を取得 */
export function getStoredEventImages(): EventImage[] | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(EVENT_IMAGES_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/** イベント画像配列を localStorage に保存 */
export function setStoredEventImages(images: EventImage[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENT_IMAGES_KEY, JSON.stringify(images));
}

/**
 * 旧フォーマット (kanpai_scene1/2/3) からの移行を試みる。
 * 見つかれば EventImage[] を返し、なければ null。
 */
export function migrateOldImageFormat(): EventImage[] | null {
  if (typeof window === "undefined") return null;
  const s1 = localStorage.getItem("kanpai_scene1");
  const s2 = localStorage.getItem("kanpai_scene2");
  const s3 = localStorage.getItem("kanpai_scene3");
  if (!s1 && !s2 && !s3) return null;

  const images: EventImage[] = [];
  if (s1) images.push({ id: "migrated-0", url: s1 });
  if (s2) images.push({ id: "migrated-1", url: s2 });
  if (s3) images.push({ id: "migrated-2", url: s3 });
  return images;
}

/** 画像の一意 ID を生成 */
export function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const HERO_IMAGE_KEY = "kanpai_hero_image";

/**
 * エンジニアがローカルでデフォルトのヒーロー画像を設定する場合のパス。
 * client/public/hero.png にファイルを置くと、/contents-manager で未設定のときに使用される。
 * 詳細は client/public/README_hero.md を参照。
 */
export const DEFAULT_HERO_IMAGE_PATH = "/hero.png";

/**
 * EVENT FLOW カルーセル用デフォルト画像パス（1〜3枚目）。
 * client/public/event-flow-1.png, event-flow-2.png, event-flow-3.png にファイルを置くと、
 * /contents-manager で未設定のときに使用される。詳細は docs/README_event_flow.md を参照。
 */
export const DEFAULT_EVENT_FLOW_IMAGE_PATHS = ["/event-flow-1.png", "/event-flow-2.png", "/event-flow-3.png"] as const;

/** EVENT FLOW の1〜3枚目でラベル未設定時に使う表示文言 */
export const DEFAULT_EVENT_FLOW_LABELS = ["第1回", "第7回", "第13回"] as const;

/** localStorage からヒーロー画像 URL を取得 */
export function getStoredHeroImage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(HERO_IMAGE_KEY);
}

/** ヒーロー画像 URL を localStorage に保存 */
export function setStoredHeroImage(url: string | null): void {
  if (typeof window === "undefined") return;
  if (url) {
    localStorage.setItem(HERO_IMAGE_KEY, url);
  } else {
    localStorage.removeItem(HERO_IMAGE_KEY);
  }
}

/**
 * Unique Features セクションの1件分（見出し・本文・任意の画像）
 * 管理画面から3件まとめて編集可能。画像は client/public/feature-1.png など未設定時に使用。
 */
export interface FeatureItem {
  title: string;
  body: string;
  /** 未設定時はデフォルトパス（/feature-1.png 等）も使わず表示しない。空文字は未設定扱い */
  imageUrl?: string | null;
}

const FEATURES_KEY = "kanpai_features";

/** デフォルトの特徴画像パス（1〜3）。client/public/feature-1.png 等に置くと未設定時に使われる */
export const DEFAULT_FEATURE_IMAGE_PATHS = ["/feature-1.png", "/feature-2.png", "/feature-3.png"] as const;

/** デフォルトの3つの特徴（見出し・本文・画像URL）。画像は2・3枚目のみデフォルトパスあり */
export const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: "ありきたりでちょっと退屈な「企業紹介タイム」なし",
    body: "多くの就活イベントにある、10分弱の企業プレゼン。正直、採用サイトに書いてあることとほとんど同じで、あまり記憶に残らない。\n\nKANPAI就活では、その時間をすべて対話に充てています。会社名すら最初は伝えない。先入観なく「人」として出会うところから始まります。",
    imageUrl: null,
  },
  {
    title: "最初はカジュアルに、話しやすく。就活版 ito",
    body: "いきなり「自己紹介どうぞ」は、誰だって緊張する。\n\nKANPAI就活では、企業研修でも使われているカードゲーム「ito」の就活版をアイスブレイクに導入。一人ひとりの価値観や考え方が自然と見えてくるゲームをすることで、肩肘張らずに、価値観や素に触れる対話ができるようになりました。",
    imageUrl: DEFAULT_FEATURE_IMAGE_PATHS[1],
  },
  {
    title: "対話の余韻を、形に残す。メッセージカードの交換",
    body: "各KANPAIの最後に、企業の人事と学生が手書きのメッセージを交換します。\n\n対話の中で感じた「あなたの良さ」や「気づき」が、言葉として手元に残る。良い時間の余韻を壊さず、温かみのある形で次の出会いにつながっていきます。",
    imageUrl: DEFAULT_FEATURE_IMAGE_PATHS[2],
  },
];

/** localStorage から特徴3件を取得。未保存時は旧キー(ito/messageCard)を移行してからデフォルトを返す */
export function getStoredFeatures(): FeatureItem[] {
  if (typeof window === "undefined") return [...DEFAULT_FEATURES];
  const stored = localStorage.getItem(FEATURES_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed.slice(0, 3).map((item: unknown, i: number) => {
          const o = item && typeof item === "object" ? item as Record<string, unknown> : {};
          return {
            title: typeof o.title === "string" ? o.title : DEFAULT_FEATURES[i].title,
            body: typeof o.body === "string" ? o.body : DEFAULT_FEATURES[i].body,
            imageUrl: o.imageUrl === null || (typeof o.imageUrl === "string" && o.imageUrl.trim() !== "") ? (o.imageUrl as string | null) ?? null : (DEFAULT_FEATURES[i].imageUrl ?? null),
          };
        });
      }
    } catch {
      /* fallback to default */
    }
  }
  // 旧キーから画像だけ移行
  const ito = localStorage.getItem("kanpai_ito_image");
  const msg = localStorage.getItem("kanpai_message_card_image");
  const base = [...DEFAULT_FEATURES];
  if (ito) base[1] = { ...base[1], imageUrl: ito };
  if (msg) base[2] = { ...base[2], imageUrl: msg };
  return base;
}

/** 特徴3件を localStorage に保存 */
export function setStoredFeatures(features: FeatureItem[]): void {
  if (typeof window === "undefined") return;
  const payload = features.slice(0, 3).map((f) => ({
    title: f.title,
    body: f.body,
    imageUrl: f.imageUrl ?? null,
  }));
  localStorage.setItem(FEATURES_KEY, JSON.stringify(payload));
}
