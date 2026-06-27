import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getLpKind } from "@/lib/content-manager/cm-preview";
import { getElementRegistry } from "@/lib/content-manager/content-element-registry";
import { hasHomeCopyEditorSection } from "@/lib/content-manager/home-copy-elements";
import { findLpField } from "@/lib/content-manager/lp-field-registry";
import { FONT_FAMILY_OPTIONS, NOTO_SERIF_JP_FONT_LABEL, NOTO_SERIF_JP_FONT_VALUE } from "@/types/home-copy-style";

const manifestPath = resolve(import.meta.dirname, "../../../public/content/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as { slugs: string[] };

/** 編集パレットでテキストフォント選択 UI が表示される要素か */
function usesTextFontSelector(slug: string, sectionId: string): boolean {
  if (getLpKind(slug) === "home") {
    return hasHomeCopyEditorSection(sectionId);
  }
  const field = findLpField(slug, sectionId);
  if (!field) return false;
  if (field.kind === "text") return true;
  if (field.kind === "style") return !field.containerOnly;
  return false;
}

function findTextFontSectionId(slug: string): string | undefined {
  const elements = getElementRegistry(slug);
  return elements.find((el) => usesTextFontSelector(slug, el.editorSection))?.editorSection;
}

describe("FONT_FAMILY_OPTIONS", () => {
  it("Noto Serif JP を選択肢に含む", () => {
    const option = FONT_FAMILY_OPTIONS.find((opt) => opt.label === NOTO_SERIF_JP_FONT_LABEL);
    expect(option).toBeDefined();
    expect(option?.value).toBe(NOTO_SERIF_JP_FONT_VALUE);
  });
});

describe.each(manifest.slugs)("LP %s の編集パレット", (slug) => {
  it("テキストフォント選択可能な要素が存在する", () => {
    const sectionId = findTextFontSectionId(slug);
    expect(
      sectionId,
      `${slug} にテキストフォント編集可能な要素が見つかりません`,
    ).toBeDefined();
  });

  it("共有 FONT_FAMILY_OPTIONS に Noto Serif JP が含まれる", () => {
    expect(
      FONT_FAMILY_OPTIONS.some(
        (opt) => opt.label === NOTO_SERIF_JP_FONT_LABEL && opt.value === NOTO_SERIF_JP_FONT_VALUE,
      ),
    ).toBe(true);
  });
});
