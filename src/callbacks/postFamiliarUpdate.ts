import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postFamiliarUpdateBabyFunctionMap } from "./postFamiliarUpdateBabyFunctionMap";

export function init(): void {
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
