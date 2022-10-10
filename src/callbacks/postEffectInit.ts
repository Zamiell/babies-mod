import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postEffectInitBabyFunctionMap } from "./postEffectInitBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_EFFECT_INIT, main);
}

function main(effect: EntityEffect) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postEffectInitBabyFunction =
    postEffectInitBabyFunctionMap.get(babyType);
  if (postEffectInitBabyFunction !== undefined) {
    postEffectInitBabyFunction(effect);
  }
}
