import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postFamiliarInitBabyFunctionMap } from "./postFamiliarInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_FAMILIAR_INIT, main);
}

function main(familiar: EntityFamiliar) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postFamiliarInitBabyFunction =
    postFamiliarInitBabyFunctionMap.get(babyType);
  if (postFamiliarInitBabyFunction !== undefined) {
    postFamiliarInitBabyFunction(familiar);
  }
}
