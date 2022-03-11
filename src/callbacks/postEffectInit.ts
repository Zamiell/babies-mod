import { getCurrentBaby } from "../utils";
import { postEffectInitBabyFunctionMap } from "./postEffectInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, main);
}

function main(effect: EntityEffect) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postEffectInitBabyFunction =
    postEffectInitBabyFunctionMap.get(babyType);
  if (postEffectInitBabyFunction !== undefined) {
    postEffectInitBabyFunction(effect);
  }
}
