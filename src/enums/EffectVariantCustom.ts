import type { EffectVariant } from "isaac-typescript-definitions";

export const EffectVariantCustom = {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  FETUS_BOSS_TARGET: Isaac.GetEntityVariantByName(
    "FetusBossTarget",
  ) as EffectVariant,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  FETUS_BOSS_ROCKET: Isaac.GetEntityVariantByName(
    "FetusBossRocket",
  ) as EffectVariant,
} as const;
