import { EffectVariant } from "isaac-typescript-definitions";
import { setEntityRandomColor } from "isaacscript-common";
import g from "../globals";

export const postEffectInitBabyFunctionMap = new Map<
  int,
  (effect: EntityEffect) => void
>();

// Blue Baby
postEffectInitBabyFunctionMap.set(30, (effect: EntityEffect) => {
  // Get rid of the poof effect that occurs when a Sprinkler is summoned.
  if (effect.Variant === EffectVariant.POOF_1 && g.run.babyBool) {
    g.run.babyBool = false;
    effect.Remove();
  }
});

// Colorful Baby
postEffectInitBabyFunctionMap.set(42, (effect: EntityEffect) => {
  setEntityRandomColor(effect);
});

// Fang Demon Baby
postEffectInitBabyFunctionMap.set(281, (effect: EntityEffect) => {
  // By default, the Marked target spawns at the center of the room, and we want it to be spawned at
  // the player instead. If we change the position here, it won't work, so make the effect invisible
  // in the meantime.
  if (effect.Variant === EffectVariant.TARGET) {
    effect.Visible = false;
  }
});
