import { EffectVariant } from "isaac-typescript-definitions";

export const EffectVariantCustom = {
  FETUS_BOSS_TARGET: Isaac.GetEntityVariantByName(
    "FetusBossTarget",
  ) as EffectVariant,
  FETUS_BOSS_ROCKET: Isaac.GetEntityVariantByName(
    "FetusBossRocket",
  ) as EffectVariant,
} as const;
