import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postFamiliarInitBabyFunctionMap } from "./postFamiliarInitBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_FAMILIAR_INIT, main);
}

function main(familiar: EntityFamiliar) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postFamiliarInitBabyFunction =
    postFamiliarInitBabyFunctionMap.get(babyType);
  if (postFamiliarInitBabyFunction !== undefined) {
    postFamiliarInitBabyFunction(familiar);
  }
}
