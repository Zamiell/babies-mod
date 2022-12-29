import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";
import { postEffectUpdateBabyFunctionMap } from "./postEffectUpdateBabyFunctionMap";

export function init(): void {
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
