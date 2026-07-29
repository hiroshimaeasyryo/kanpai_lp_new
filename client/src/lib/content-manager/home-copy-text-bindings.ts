import { parseIndexedFieldId, parseIndexedId } from "@/lib/content-manager/home-copy-field-id";
import type { HomeCopy } from "@/types/home-copy";

export type HomeTextBinding = {
  text: string;
  multiline: boolean;
  rows: number;
  applyText: (prev: HomeCopy, value: string) => HomeCopy;
};

export function resolveHomeTextBinding(sectionId: string, copy: HomeCopy): HomeTextBinding | null {
  if (sectionId === "hero-title-line1") {
    return {
      text: copy.hero.titleLine1,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, hero: { ...p.hero, titleLine1: v } }),
    };
  }
  if (sectionId === "hero-title-line2") {
    return {
      text: copy.hero.titleLine2,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, hero: { ...p.hero, titleLine2: v } }),
    };
  }
  if (sectionId === "hero-subcopy") {
    return { text: copy.hero.subcopy, multiline: true, rows: 4, applyText: (p, v) => ({ ...p, hero: { ...p.hero, subcopy: v } }) };
  }
  if (sectionId === "hero-cta" || sectionId === "about-cta") {
    return {
      text: copy.cta.primaryLabel,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, cta: { ...p.cta, primaryLabel: v } }),
    };
  }
  if (sectionId === "hero-sticky-cta") {
    return {
      text: copy.cta.stickyLabel,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, cta: { ...p.cta, stickyLabel: v } }),
    };
  }
  if (sectionId === "nav-header-cta") {
    return {
      text: copy.nav.headerCta,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, nav: { ...p.nav, headerCta: v } }),
    };
  }
  if (sectionId === "next-event-eyebrow") {
    return {
      text: copy.nextEvent.eyebrow,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, nextEvent: { ...p.nextEvent, eyebrow: v } }),
    };
  }
  if (sectionId === "next-event-heading") {
    return {
      text: copy.nextEvent.heading,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, nextEvent: { ...p.nextEvent, heading: v } }),
    };
  }
  if (sectionId === "problem-lead") {
    return { text: copy.problem.lead, multiline: true, rows: 2, applyText: (p, v) => ({ ...p, problem: { ...p.problem, lead: v } }) };
  }
  if (sectionId === "problem-p1") {
    return {
      text: copy.problem.paragraph1,
      multiline: true,
      rows: 5,
      applyText: (p, v) => ({ ...p, problem: { ...p.problem, paragraph1: v } }),
    };
  }
  if (sectionId === "problem-p2") {
    return {
      text: copy.problem.paragraph2,
      multiline: true,
      rows: 5,
      applyText: (p, v) => ({ ...p, problem: { ...p.problem, paragraph2: v } }),
    };
  }
  if (sectionId === "about-eyebrow") {
    return { text: copy.about.eyebrow, multiline: false, rows: 1, applyText: (p, v) => ({ ...p, about: { ...p.about, eyebrow: v } }) };
  }
  if (sectionId === "about-heading") {
    return { text: copy.about.heading, multiline: true, rows: 3, applyText: (p, v) => ({ ...p, about: { ...p.about, heading: v } }) };
  }
  if (sectionId === "about-body") {
    return { text: copy.about.body, multiline: true, rows: 8, applyText: (p, v) => ({ ...p, about: { ...p.about, body: v } }) };
  }
  if (sectionId === "values-eyebrow") {
    return {
      text: copy.values.eyebrow,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, values: { ...p.values, eyebrow: v } }),
    };
  }
  if (sectionId === "values-heading") {
    return {
      text: copy.values.heading,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, values: { ...p.values, heading: v } }),
    };
  }

  const valuesCard = parseIndexedFieldId(sectionId, "values-card");
  if (valuesCard && copy.values.items[valuesCard.index]) {
    const { index: i, field } = valuesCard;
    const item = copy.values.items[i];
    if (field === "label") {
      return {
        text: item.label,
        multiline: false,
        rows: 1,
        applyText: (p, v) => {
          const items = [...p.values.items];
          items[i] = { ...items[i], label: v };
          return { ...p, values: { ...p.values, items } };
        },
      };
    }
    if (field === "title") {
      return {
        text: item.title,
        multiline: false,
        rows: 1,
        applyText: (p, v) => {
          const items = [...p.values.items];
          items[i] = { ...items[i], title: v };
          return { ...p, values: { ...p.values, items } };
        },
      };
    }
    if (field === "body") {
      return {
        text: item.body,
        multiline: true,
        rows: 5,
        applyText: (p, v) => {
          const items = [...p.values.items];
          items[i] = { ...items[i], body: v };
          return { ...p, values: { ...p.values, items } };
        },
      };
    }
    if (field === "note") {
      return {
        text: item.note ?? "",
        multiline: true,
        rows: 2,
        applyText: (p, v) => {
          const items = [...p.values.items];
          items[i] = { ...items[i], note: v };
          return { ...p, values: { ...p.values, items } };
        },
      };
    }
  }

  if (sectionId === "event-flow-eyebrow") {
    return {
      text: copy.eventFlow.eyebrow,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, eventFlow: { ...p.eventFlow, eyebrow: v } }),
    };
  }
  if (sectionId === "event-flow-heading") {
    return {
      text: copy.eventFlow.heading,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, eventFlow: { ...p.eventFlow, heading: v } }),
    };
  }

  const flowStep = parseIndexedFieldId(sectionId, "event-flow-step");
  if (flowStep && copy.eventFlow.steps[flowStep.index]) {
    const { index: i, field } = flowStep;
    const step = copy.eventFlow.steps[i];
    if (field === "title") {
      return {
        text: step.title,
        multiline: false,
        rows: 1,
        applyText: (p, v) => {
          const steps = [...p.eventFlow.steps];
          steps[i] = { ...steps[i], title: v };
          return { ...p, eventFlow: { ...p.eventFlow, steps } };
        },
      };
    }
    if (field === "time") {
      return {
        text: step.time,
        multiline: false,
        rows: 1,
        applyText: (p, v) => {
          const steps = [...p.eventFlow.steps];
          steps[i] = { ...steps[i], time: v };
          return { ...p, eventFlow: { ...p.eventFlow, steps } };
        },
      };
    }
    if (field === "description") {
      return {
        text: step.description,
        multiline: true,
        rows: 3,
        applyText: (p, v) => {
          const steps = [...p.eventFlow.steps];
          steps[i] = { ...steps[i], description: v };
          return { ...p, eventFlow: { ...p.eventFlow, steps } };
        },
      };
    }
  }

  if (sectionId === "features-intro-eyebrow") {
    return {
      text: copy.featuresIntro.eyebrow,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, featuresIntro: { ...p.featuresIntro, eyebrow: v } }),
    };
  }
  if (sectionId === "features-intro-heading") {
    return {
      text: copy.featuresIntro.heading,
      multiline: true,
      rows: 2,
      applyText: (p, v) => ({ ...p, featuresIntro: { ...p.featuresIntro, heading: v } }),
    };
  }
  if (sectionId === "voices-eyebrow") {
    return {
      text: copy.voices.eyebrow,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, voices: { ...p.voices, eyebrow: v } }),
    };
  }
  if (sectionId === "voices-heading") {
    return {
      text: copy.voices.heading,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, voices: { ...p.voices, heading: v } }),
    };
  }

  const voicesCard = parseIndexedFieldId(sectionId, "voices-card");
  if (voicesCard && copy.voices.items[voicesCard.index]) {
    const { index: i, field } = voicesCard;
    const item = copy.voices.items[i];
    if (field === "quote") {
      return {
        text: item.quote,
        multiline: true,
        rows: 4,
        applyText: (p, v) => {
          const items = [...p.voices.items];
          items[i] = { ...items[i], quote: v };
          return { ...p, voices: { ...p.voices, items } };
        },
      };
    }
    if (field === "attribution") {
      return {
        text: item.attribution,
        multiline: false,
        rows: 1,
        applyText: (p, v) => {
          const items = [...p.voices.items];
          items[i] = { ...items[i], attribution: v };
          return { ...p, voices: { ...p.voices, items } };
        },
      };
    }
  }

  if (sectionId === "screening-eyebrow") {
    return {
      text: copy.screening.eyebrow,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, screening: { ...p.screening, eyebrow: v } }),
    };
  }
  if (sectionId === "screening-heading") {
    return {
      text: copy.screening.heading,
      multiline: true,
      rows: 2,
      applyText: (p, v) => ({ ...p, screening: { ...p.screening, heading: v } }),
    };
  }
  if (sectionId === "screening-intro") {
    return {
      text: copy.screening.intro,
      multiline: true,
      rows: 4,
      applyText: (p, v) => ({ ...p, screening: { ...p.screening, intro: v } }),
    };
  }
  if (sectionId === "screening-trust") {
    return {
      text: copy.screening.trustNote,
      multiline: true,
      rows: 4,
      applyText: (p, v) => ({ ...p, screening: { ...p.screening, trustNote: v } }),
    };
  }

  const criterionIdx = parseIndexedId(sectionId, "screening-criterion");
  if (criterionIdx !== null && copy.screening.criteria[criterionIdx] !== undefined) {
    const i = criterionIdx;
    return {
      text: copy.screening.criteria[i],
      multiline: false,
      rows: 2,
      applyText: (p, v) => {
        const criteria = [...p.screening.criteria];
        criteria[i] = v;
        return { ...p, screening: { ...p.screening, criteria } };
      },
    };
  }

  if (sectionId === "student-screening-eyebrow") {
    return {
      text: copy.studentScreening.eyebrow,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, studentScreening: { ...p.studentScreening, eyebrow: v } }),
    };
  }
  if (sectionId === "student-screening-heading") {
    return {
      text: copy.studentScreening.heading,
      multiline: true,
      rows: 2,
      applyText: (p, v) => ({ ...p, studentScreening: { ...p.studentScreening, heading: v } }),
    };
  }
  if (sectionId === "student-screening-intro") {
    return {
      text: copy.studentScreening.intro,
      multiline: true,
      rows: 6,
      applyText: (p, v) => ({ ...p, studentScreening: { ...p.studentScreening, intro: v } }),
    };
  }
  if (sectionId === "student-screening-note") {
    return {
      text: copy.studentScreening.note,
      multiline: true,
      rows: 4,
      applyText: (p, v) => ({ ...p, studentScreening: { ...p.studentScreening, note: v } }),
    };
  }

  const studentCriterionIdx = parseIndexedId(sectionId, "student-screening-criterion");
  if (studentCriterionIdx !== null && copy.studentScreening.criteria[studentCriterionIdx] !== undefined) {
    const i = studentCriterionIdx;
    return {
      text: copy.studentScreening.criteria[i],
      multiline: false,
      rows: 2,
      applyText: (p, v) => {
        const criteria = [...p.studentScreening.criteria];
        criteria[i] = v;
        return { ...p, studentScreening: { ...p.studentScreening, criteria } };
      },
    };
  }

  if (sectionId === "safety-heading") {
    return {
      text: copy.safety.heading,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, safety: { ...p.safety, heading: v } }),
    };
  }
  if (sectionId === "safety-subheading") {
    return {
      text: copy.safety.subheading,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, safety: { ...p.safety, subheading: v } }),
    };
  }

  const safetyItem = parseIndexedFieldId(sectionId, "safety-item");
  if (safetyItem && copy.safety.items[safetyItem.index]) {
    const { index: i, field } = safetyItem;
    const item = copy.safety.items[i];
    if (field === "title") {
      return {
        text: item.title,
        multiline: false,
        rows: 1,
        applyText: (p, v) => {
          const items = [...p.safety.items];
          items[i] = { ...items[i], title: v };
          return { ...p, safety: { ...p.safety, items } };
        },
      };
    }
    if (field === "description") {
      return {
        text: item.description,
        multiline: true,
        rows: 3,
        applyText: (p, v) => {
          const items = [...p.safety.items];
          items[i] = { ...items[i], description: v };
          return { ...p, safety: { ...p.safety, items } };
        },
      };
    }
  }

  if (sectionId === "faq-eyebrow") {
    return { text: copy.faq.eyebrow, multiline: false, rows: 1, applyText: (p, v) => ({ ...p, faq: { ...p.faq, eyebrow: v } }) };
  }
  if (sectionId === "faq-heading") {
    return {
      text: copy.faq.heading,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, faq: { ...p.faq, heading: v } }),
    };
  }

  const faqItem = parseIndexedFieldId(sectionId, "faq-item");
  if (faqItem && copy.faq.items[faqItem.index]) {
    const { index: i, field } = faqItem;
    const item = copy.faq.items[i];
    if (field === "question") {
      return {
        text: item.question,
        multiline: false,
        rows: 2,
        applyText: (p, v) => {
          const items = [...p.faq.items];
          items[i] = { ...items[i], question: v };
          return { ...p, faq: { ...p.faq, items } };
        },
      };
    }
    if (field === "answer") {
      return {
        text: item.answer,
        multiline: true,
        rows: 3,
        applyText: (p, v) => {
          const items = [...p.faq.items];
          items[i] = { ...items[i], answer: v };
          return { ...p, faq: { ...p.faq, items } };
        },
      };
    }
  }

  if (sectionId === "final-cta-line1") {
    return {
      text: copy.finalCta.headingLine1,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, finalCta: { ...p.finalCta, headingLine1: v } }),
    };
  }
  if (sectionId === "final-cta-line2") {
    return {
      text: copy.finalCta.headingLine2,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, finalCta: { ...p.finalCta, headingLine2: v } }),
    };
  }
  if (sectionId === "final-cta-body") {
    return {
      text: copy.finalCta.body,
      multiline: true,
      rows: 4,
      applyText: (p, v) => ({ ...p, finalCta: { ...p.finalCta, body: v } }),
    };
  }
  if (sectionId === "final-cta-note") {
    return {
      text: copy.cta.footerNote,
      multiline: false,
      rows: 1,
      applyText: (p, v) => ({ ...p, cta: { ...p.cta, footerNote: v } }),
    };
  }
  if (sectionId === "footer-company") {
    return {
      text: copy.footer.companyNote,
      multiline: true,
      rows: 2,
      applyText: (p, v) => ({ ...p, footer: { ...p.footer, companyNote: v } }),
    };
  }

  return null;
}
