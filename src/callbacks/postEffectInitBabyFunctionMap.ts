import { EffectVariant } from "isaac-typescript-definitions";
import { setEntityRandomColor } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postEffectInitBabyFunctionMap = new Map<
  RandomBabyType,
  (effect: EntityEffect) => void
>();

// 30
postEffectInitBabyFunctionMap.set(
  RandomBabyType.BLUE,
  (effect: EntityEffect) => {
    // Get rid of the poof effect that occurs when a Sprinkler is summoned.
    if (effect.Variant === EffectVariant.POOF_1 && g.run.babyBool) {
      g.run.babyBool = false;
      effect.Remove();
    }
  },
);

// 42
postEffectInitBabyFunctionMap.set(
  RandomBabyType.COLORFUL,
  (effect: EntityEffect) => {
    setEntityRandomColor(effect);
  },
);

// 281
postEffectInitBabyFunctionMap.set(
  RandomBabyType.FANG_DEMON,
  (effect: EntityEffect) => {
    // By default, the Marked target spawns at the center of the room, and we want it to be spawned
    // at the player instead. If we change the position here, it won't work, so make the effect
    // invisible in the meantime.
    if (effect.Variant === EffectVariant.TARGET) {
      effect.Visible = false;
    }
  },
);
