/**
 * LP カラーパレット定義
 * 10 パターン（デフォルト Amber + 9 バリエーション）
 * 各パレットはトーンを統一しながらバリエーション豊かに設計。
 */

export interface ColorPalette {
  id: string;
  name: string;
  nameJa: string;
  colors: {
    primary: string;
    primaryHover: string;
    textHeading: string;
    textBody: string;
    textMuted: string;
    bgWarm: string;
    bgCard: string;
    border: string;
    accentLight: string;
    highlight: string;
    ctaStart: string;
    ctaMid: string;
    ctaEnd: string;
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
  /* ── 1. Amber ─ 温かみのあるアンバー（デフォルト） ── */
  {
    id: "amber",
    name: "Amber",
    nameJa: "アンバー",
    colors: {
      primary: "#d4844b",
      primaryHover: "#c47540",
      textHeading: "#5C3D2E",
      textBody: "#875a3c",
      textMuted: "#736964",
      bgWarm: "#fffaf5",
      bgCard: "#f5e6cd",
      border: "#ffd7c3",
      accentLight: "#E8A87C",
      highlight: "#ffd7c3",
      ctaStart: "#FFFBF7",
      ctaMid: "#FFF3E8",
      ctaEnd: "#FFF5ED",
    },
  },
  /* ── 2. Forest ─ 深い森・苔の静けさ ── */
  {
    id: "forest",
    name: "Forest",
    nameJa: "フォレスト",
    colors: {
      primary: "#5A8A6A",
      primaryHover: "#4D7A5D",
      textHeading: "#2E4A38",
      textBody: "#4A6B55",
      textMuted: "#647A6C",
      bgWarm: "#f5faf7",
      bgCard: "#d5e8dc",
      border: "#c3e0ce",
      accentLight: "#8ABF9C",
      highlight: "#c3e0ce",
      ctaStart: "#F7FBF8",
      ctaMid: "#EBF5EE",
      ctaEnd: "#EFF7F2",
    },
  },
  /* ── 3. Ocean ─ 海・爽やかなブルー ── */
  {
    id: "ocean",
    name: "Ocean",
    nameJa: "オーシャン",
    colors: {
      primary: "#4A7FA0",
      primaryHover: "#3D6F8E",
      textHeading: "#2E3D50",
      textBody: "#4A6578",
      textMuted: "#647580",
      bgWarm: "#f5f8fb",
      bgCard: "#d1e2ed",
      border: "#c3d8e8",
      accentLight: "#7EB4D0",
      highlight: "#c3d8e8",
      ctaStart: "#F7FAFB",
      ctaMid: "#E8F0F5",
      ctaEnd: "#EDF4F8",
    },
  },
  /* ── 4. Sakura ─ 桜・柔らかな華やかさ ── */
  {
    id: "sakura",
    name: "Sakura",
    nameJa: "サクラ",
    colors: {
      primary: "#C4708A",
      primaryHover: "#B4607A",
      textHeading: "#4E2E3A",
      textBody: "#7A5060",
      textMuted: "#806A72",
      bgWarm: "#FEF5F8",
      bgCard: "#F0D5DE",
      border: "#F0C3D2",
      accentLight: "#E0A0B5",
      highlight: "#F0C3D2",
      ctaStart: "#FEF8FA",
      ctaMid: "#FAE8EE",
      ctaEnd: "#FBEDF2",
    },
  },
  /* ── 5. Wisteria ─ 藤・優雅なパープル ── */
  {
    id: "wisteria",
    name: "Wisteria",
    nameJa: "ウィステリア",
    colors: {
      primary: "#8A6BA0",
      primaryHover: "#7A5B90",
      textHeading: "#3D2E50",
      textBody: "#60507A",
      textMuted: "#756880",
      bgWarm: "#F9F5FE",
      bgCard: "#E0D1F0",
      border: "#D5C3E8",
      accentLight: "#B09ACF",
      highlight: "#D5C3E8",
      ctaStart: "#FAF7FD",
      ctaMid: "#F0E8F8",
      ctaEnd: "#F2ECF9",
    },
  },
  /* ── 6. Indigo ─ 藍・日本の伝統色 ── */
  {
    id: "indigo",
    name: "Indigo",
    nameJa: "インディゴ",
    colors: {
      primary: "#506BA0",
      primaryHover: "#445D90",
      textHeading: "#2E3550",
      textBody: "#4A5578",
      textMuted: "#646D80",
      bgWarm: "#F5F6FA",
      bgCard: "#D1D8ED",
      border: "#C3CCE0",
      accentLight: "#8095C8",
      highlight: "#C3CCE0",
      ctaStart: "#F7F8FB",
      ctaMid: "#E8ECF5",
      ctaEnd: "#ECF0F6",
    },
  },
  /* ── 7. Sunset ─ 夕焼け・赤みの情熱 ── */
  {
    id: "sunset",
    name: "Sunset",
    nameJa: "サンセット",
    colors: {
      primary: "#D06050",
      primaryHover: "#C05040",
      textHeading: "#4E2E2A",
      textBody: "#8A5548",
      textMuted: "#807064",
      bgWarm: "#FEF6F5",
      bgCard: "#F0D5CF",
      border: "#F0C8C0",
      accentLight: "#E09888",
      highlight: "#F0C8C0",
      ctaStart: "#FEF8F7",
      ctaMid: "#FAE8E4",
      ctaEnd: "#FBECEB",
    },
  },
  /* ── 8. Matcha ─ 抹茶・静かな緑 ── */
  {
    id: "matcha",
    name: "Matcha",
    nameJa: "マッチャ",
    colors: {
      primary: "#7A9A60",
      primaryHover: "#6A8A50",
      textHeading: "#3A4A2E",
      textBody: "#5A6F48",
      textMuted: "#6E7C64",
      bgWarm: "#F7FAF5",
      bgCard: "#D8E8CC",
      border: "#C8DEB8",
      accentLight: "#A0C088",
      highlight: "#C8DEB8",
      ctaStart: "#F8FBF6",
      ctaMid: "#ECF5E6",
      ctaEnd: "#EFF7EB",
    },
  },
  /* ── 9. Slate ─ 石板・洗練されたクール ── */
  {
    id: "slate",
    name: "Slate",
    nameJa: "スレート",
    colors: {
      primary: "#6A7A8A",
      primaryHover: "#5A6A7A",
      textHeading: "#2E3840",
      textBody: "#4A5A68",
      textMuted: "#6A7580",
      bgWarm: "#F5F7F9",
      bgCard: "#D5DCE2",
      border: "#C8D0D8",
      accentLight: "#95A5B5",
      highlight: "#C8D0D8",
      ctaStart: "#F7F9FA",
      ctaMid: "#E8EDF0",
      ctaEnd: "#ECF0F3",
    },
  },
  /* ── 10. Wine ─ 葡萄酒・上品なバーガンディ ── */
  {
    id: "wine",
    name: "Wine",
    nameJa: "ワイン",
    colors: {
      primary: "#8A4A65",
      primaryHover: "#7A3A55",
      textHeading: "#3D2E35",
      textBody: "#6A4555",
      textMuted: "#7A6870",
      bgWarm: "#FAF5F7",
      bgCard: "#E8D1DA",
      border: "#E0C0CC",
      accentLight: "#C08AA0",
      highlight: "#E0C0CC",
      ctaStart: "#FBF7F9",
      ctaMid: "#F5E8EE",
      ctaEnd: "#F7ECF0",
    },
  },
];

/** パレットを ID で取得。見つからない場合はデフォルト (amber) を返す */
export function getPalette(id: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === id) ?? COLOR_PALETTES[0];
}

/** camelCase を kebab-case に変換 */
function toKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** 指定パレットの CSS カスタムプロパティを :root に適用 */
export function applyPalette(paletteId: string): void {
  const palette = getPalette(paletteId);
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette.colors)) {
    root.style.setProperty(`--lp-${toKebab(key)}`, value);
  }
}

const STORAGE_KEY = "kanpai_theme";

/** localStorage からパレット ID を取得 */
export function getStoredPaletteId(): string {
  if (typeof window === "undefined") return "amber";
  return localStorage.getItem(STORAGE_KEY) ?? "amber";
}

/** localStorage にパレット ID を保存 */
export function setStoredPaletteId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, id);
}
