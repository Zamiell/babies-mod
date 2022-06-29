import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postEffectUpdateBabyFunctionMap } from "./postEffectUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_EFFECT_UPDATE, main);
}

function main(effect: EntityEffect) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postEffectUpdateBabyFunction =
    postEffectUpdateBabyFunctionMap.get(babyType);
  if (postEffectUpdateBabyFunction !== undefined) {
    postEffectUpdateBabyFunction(effect);
  }
}
