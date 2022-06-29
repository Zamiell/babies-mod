import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postFamiliarUpdateBabyFunctionMap } from "./postFamiliarUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_FAMILIAR_UPDATE, main);
}

function main(familiar: EntityFamiliar) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postFamiliarUpdateBabyFunction =
    postFamiliarUpdateBabyFunctionMap.get(babyType);
  if (postFamiliarUpdateBabyFunction !== undefined) {
    postFamiliarUpdateBabyFunction(familiar);
  }
}
