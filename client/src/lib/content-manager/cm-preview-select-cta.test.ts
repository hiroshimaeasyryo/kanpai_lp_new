import { afterEach, describe, expect, it } from "vitest";
import {
  getSelectableId,
  getSelectableKind,
  isAutoSelectableId,
  normalizeClickStart,
  resolveClickTarget,
} from "./cm-preview-select";

type CtaFixture = {
  lp: string;
  fieldId: string;
  html: string;
};

/** 各 LP の CTA ボタン DOM（実装に沿った最小構造） */
const CTA_FIXTURES: CtaFixture[] = [
  // Home LP — data-cm-id は a 自体
  {
    lp: "home",
    fieldId: "nav-header-cta",
    html: `<a href="https://line.me" data-cm-id="nav-header-cta" class="header-cta">LINEで相談する</a>`,
  },
  {
    lp: "home",
    fieldId: "hero-sticky-cta",
    html: `<a href="https://line.me" data-cm-id="hero-sticky-cta" class="sticky-cta">無料相談はこちら</a>`,
  },
  {
    lp: "home",
    fieldId: "hero-cta",
    html: `<a href="https://line.me" data-cm-id="hero-cta" class="cta-btn">エントリーする</a>`,
  },
  {
    lp: "home",
    fieldId: "about-cta",
    html: `<a href="https://line.me" data-cm-id="about-cta" class="about-cta">詳しく見る</a>`,
  },
  // Starting Job Hunting
  {
    lp: "starting_job_hunting",
    fieldId: "sjh-header-cta-label",
    html: `<a href="https://line.me" class="header-cta">
      <svg class="line-icon" aria-hidden="true"><circle cx="8" cy="8" r="8"/></svg>
      <span data-cm-id="sjh-header-cta-label" class="header-cta-label header-cta-label--desktop">Desktop CTA</span>
      <span data-cm-id="sjh-header-cta-label-mobile" class="header-cta-label header-cta-label--mobile" style="display:none">Mobile CTA</span>
    </a>`,
  },
  {
    lp: "starting_job_hunting",
    fieldId: "sjh-hero-primary-cta-label",
    html: `<a href="https://line.me" class="cta-btn">
      <svg class="line-icon"><circle cx="8" cy="8" r="8"/></svg>
      <span data-cm-id="sjh-hero-primary-cta-label">FV CTA</span>
    </a>`,
  },
  {
    lp: "starting_job_hunting",
    fieldId: "sjh-mid-cta-label",
    html: `<a href="https://line.me" class="cta-btn"><span data-cm-id="sjh-mid-cta-label">中間CTA</span></a>`,
  },
  {
    lp: "starting_job_hunting",
    fieldId: "sjh-sticky-cta-label",
    html: `<a href="https://line.me" class="cta-btn"><span data-cm-id="sjh-sticky-cta-label">固定CTA</span></a>`,
  },
  // Self Stance
  {
    lp: "self_stance",
    fieldId: "ss-sticky-cta-label",
    html: `<div data-cm-id="ss-sticky-cta-bar" class="sticky">
      <a href="https://line.me">
        <svg class="line-icon"><circle cx="8" cy="8" r="8"/></svg>
        <span data-cm-id="ss-sticky-cta-label">固定CTA</span>
      </a>
    </div>`,
  },
  {
    lp: "self_stance",
    fieldId: "ss-header-cta-label",
    html: `<a href="https://line.me" class="header-btn">
      <span data-cm-id="ss-header-cta-label">ヘッダーCTA</span>
      <svg class="line-icon"><circle cx="8" cy="8" r="8"/></svg>
    </a>`,
  },
  {
    lp: "self_stance",
    fieldId: "ss-hero-primary-cta-label",
    html: `<a href="https://line.me" class="btn-line">
      <svg><circle cx="8" cy="8" r="8"/></svg>
      <span data-cm-id="ss-hero-primary-cta-label">FV CTA</span>
    </a>`,
  },
  // JS Self Analysis
  {
    lp: "js_self_analysis",
    fieldId: "jsa-floating-cta-label",
    html: `<a href="https://line.me">
      <svg><circle cx="8" cy="8" r="8"/></svg>
      <span data-cm-id="jsa-floating-cta-label">固定CTA</span>
    </a>`,
  },
  {
    lp: "js_self_analysis",
    fieldId: "jsa-hero-cta-label",
    html: `<a href="https://line.me" class="hero-cta">
      <svg><circle cx="8" cy="8" r="8"/></svg>
      <span data-cm-id="jsa-hero-cta-label">FV CTA</span>
    </a>`,
  },
  {
    lp: "js_self_analysis",
    fieldId: "jsa-final-cta-cta-label",
    html: `<a href="https://line.me" class="btn-line"><span data-cm-id="jsa-final-cta-cta-label">最終CTA</span></a>`,
  },
  // Self Reflection
  {
    lp: "self_reflection",
    fieldId: "sr-hero-cta-label",
    html: `<a href="https://line.me" class="cta-btn large"><span data-cm-id="sr-hero-cta-label">ヒーローCTA</span></a>`,
  },
  {
    lp: "self_reflection",
    fieldId: "sr-cause-cta-label",
    html: `<a href="https://line.me" class="cta-btn"><span data-cm-id="sr-cause-cta-label">原因CTA</span></a>`,
  },
  {
    lp: "self_reflection",
    fieldId: "sr-closing-cta-label",
    html: `<a href="https://line.me" class="cta-btn dark-bg large"><span data-cm-id="sr-closing-cta-label">最終CTA</span></a>`,
  },
  // BTOB Seminar
  {
    lp: "btob_seminar",
    fieldId: "btob-header-cta-label",
    html: `<a href="https://example.com" class="header-cta"><span data-cm-id="btob-header-cta-label">ヘッダーCTA</span></a>`,
  },
  {
    lp: "btob_seminar",
    fieldId: "btob-hero-primary-cta-label",
    html: `<a href="https://example.com" class="cta-primary"><span data-cm-id="btob-hero-primary-cta-label">ヒーローCTA</span></a>`,
  },
  {
    lp: "btob_seminar",
    fieldId: "btob-mid-cta-label",
    html: `<a href="https://example.com" class="cta-light"><span data-cm-id="btob-mid-cta-label">中段CTA</span></a>`,
  },
  {
    lp: "btob_seminar",
    fieldId: "btob-final-cta-label",
    html: `<a href="https://example.com" class="cta-light"><span data-cm-id="btob-final-cta-label">最終CTA</span></a>`,
  },
];

function mount(html: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

function getAnchor(container: HTMLElement): HTMLAnchorElement {
  const anchor = container.querySelector("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) {
    throw new Error("CTA anchor not found");
  }
  return anchor;
}

function getLabel(container: HTMLElement): HTMLElement {
  const label = container.querySelector("[data-cm-id$='-cta-label'], [data-cm-id$='-cta-label-mobile'], a[data-cm-id]");
  if (!(label instanceof HTMLElement)) {
    throw new Error("CTA label not found");
  }
  return label;
}

function getIcon(container: HTMLElement): SVGElement | null {
  const svg = container.querySelector("svg");
  return svg instanceof SVGElement ? svg : null;
}

function assertEditable(clickTarget: EventTarget | null, expectedFieldId: string): void {
  const start = normalizeClickStart(clickTarget);
  const target = resolveClickTarget(clickTarget);
  expect(target, `resolveClickTarget returned null for field ${expectedFieldId}`).not.toBeNull();

  const id = getSelectableId(target!, start);
  const kind = getSelectableKind(target!, start);

  expect(kind, `expected field kind for ${expectedFieldId}, got ${kind} (id=${id})`).toBe("field");
  expect(isAutoSelectableId(id), `auto-selectable id for ${expectedFieldId}: ${id}`).toBe(false);
  expect(id).toBe(expectedFieldId);
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("cm-preview-select CTA buttons (all LPs)", () => {
  for (const fixture of CTA_FIXTURES) {
    describe(`${fixture.lp} · ${fixture.fieldId}`, () => {
      it("ラベル文字クリックで field として選択できる", () => {
        const container = mount(fixture.html);
        const label = getLabel(container);
        assertEditable(label, fixture.fieldId);
      });

      it("a 要素の余白クリックで field として選択できる", () => {
        const container = mount(fixture.html);
        const anchor = getAnchor(container);
        assertEditable(anchor, fixture.fieldId);
      });

      it("アイコン（SVG）クリックで field として選択できる", () => {
        const container = mount(fixture.html);
        const icon = getIcon(container);
        if (!icon) return;
        assertEditable(icon, fixture.fieldId);
      });

      it("内側 span を直接選択単位にしない（親 a を返す）", () => {
        const container = mount(fixture.html);
        const label = getLabel(container);
        if (label.tagName === "A") return;
        const target = resolveClickTarget(label);
        expect(target?.tagName).toBe("A");
        expect(target).not.toBe(label);
      });
    });
  }

  it("SJH ヘッダー: mobile ラベルクリックで mobile フィールド ID を返す", () => {
    const container = mount(`
      <a href="https://line.me" class="header-cta">
        <span data-cm-id="sjh-header-cta-label" class="header-cta-label--desktop" style="display:none">Desktop</span>
        <span data-cm-id="sjh-header-cta-label-mobile" class="header-cta-label--mobile">Mobile</span>
      </a>
    `);
    const mobile = container.querySelector("[data-cm-id='sjh-header-cta-label-mobile']")!;
    assertEditable(mobile, "sjh-header-cta-label-mobile");
  });
});
