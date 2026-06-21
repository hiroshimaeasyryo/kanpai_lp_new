import type { SelfReflectionContent } from "@/components/SelfReflectionEditor";
import type { FeatureItem } from "@/lib/content-settings";
import type { ArrayItemStorage } from "@/lib/content-manager/array-item-registry";
import {
  getStoragePath,
  mutateArrayItem,
  readArrayAtPath,
  type ArrayMutationOp,
} from "@/lib/content-manager/array-item-mutations";
import type { ParsedArrayItem } from "@/lib/content-manager/array-item-registry";
import type { BtobSeminarContent } from "@/types/btob-seminar";
import type { HomeCopy } from "@/types/home-copy";
import type { JsSelfAnalysisContent } from "@/types/js-self-analysis";
import type { SelfStanceContent } from "@/types/self-stance";
import type { StartingJobHuntingContent } from "@/types/starting-job-hunting";
import { setStoredHomeCopy } from "@/types/home-copy";
import { setStoredFeatures } from "@/lib/content-settings";

export type ArrayMutationContext = {
  homeCopy: HomeCopy;
  onHomeCopyChange: (next: HomeCopy) => void;
  features: FeatureItem[];
  onFeaturesChange: (next: FeatureItem[]) => void;
  btobSeminarContent: BtobSeminarContent | null;
  onBtobSeminarChange: (next: BtobSeminarContent) => void;
  selfReflectionContent: SelfReflectionContent | null;
  onSelfReflectionChange: (next: SelfReflectionContent) => void;
  startingJobHuntingContent: StartingJobHuntingContent | null;
  onStartingJobHuntingChange: (next: StartingJobHuntingContent) => void;
  selfStanceContent: SelfStanceContent | null;
  onSelfStanceChange: (next: SelfStanceContent) => void;
  jsSelfAnalysisContent: JsSelfAnalysisContent | null;
  onJsSelfAnalysisChange: (next: JsSelfAnalysisContent) => void;
};

function resolveRoot(ctx: ArrayMutationContext, storage: ArrayItemStorage): unknown {
  switch (storage.bucket) {
    case "homeCopy":
      return ctx.homeCopy;
    case "features":
      return { items: ctx.features };
    case "btobSeminar":
      return ctx.btobSeminarContent;
    case "selfReflection":
      return ctx.selfReflectionContent;
    case "startingJobHunting":
      return ctx.startingJobHuntingContent;
    case "selfStance":
      return ctx.selfStanceContent;
    case "jsSelfAnalysis":
      return ctx.jsSelfAnalysisContent;
    default:
      return null;
  }
}

export function getArrayLength(ctx: ArrayMutationContext, parsed: ParsedArrayItem): number {
  const root = resolveRoot(ctx, parsed.def.storage);
  if (!root) return 0;
  const path = parsed.def.storage.bucket === "features" ? "items" : parsed.def.storage.path;
  return readArrayAtPath(root, path).length;
}

export function applyArrayMutation(
  ctx: ArrayMutationContext,
  parsed: ParsedArrayItem,
  op: ArrayMutationOp,
): void {
  const { def } = parsed;
  const minItems = def.minItems ?? 1;
  const defaultItem = def.createDefault();
  const isFeatures = def.storage.bucket === "features";
  const path = isFeatures ? "items" : def.storage.path;
  const root = resolveRoot(ctx, def.storage);
  if (!root || typeof root !== "object") return;

  const next = mutateArrayItem(
    root as object,
    path,
    parsed.index,
    op,
    defaultItem,
    minItems,
  );

  switch (def.storage.bucket) {
    case "homeCopy":
      ctx.onHomeCopyChange(next as HomeCopy);
      setStoredHomeCopy(next as HomeCopy);
      break;
    case "features": {
      const items = readArrayAtPath(next, "items") as FeatureItem[];
      ctx.onFeaturesChange(items);
      setStoredFeatures(items);
      break;
    }
    case "btobSeminar":
      ctx.onBtobSeminarChange(next as BtobSeminarContent);
      break;
    case "selfReflection":
      ctx.onSelfReflectionChange(next as SelfReflectionContent);
      break;
    case "startingJobHunting":
      ctx.onStartingJobHuntingChange(next as StartingJobHuntingContent);
      break;
    case "selfStance":
      ctx.onSelfStanceChange(next as SelfStanceContent);
      break;
    case "jsSelfAnalysis":
      ctx.onJsSelfAnalysisChange(next as JsSelfAnalysisContent);
      break;
    default:
      break;
  }
}

export { getStoragePath };
