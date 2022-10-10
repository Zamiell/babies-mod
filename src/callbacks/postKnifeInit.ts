import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postKnifeInitBabyFunctionMap } from "./postKnifeInitBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_KNIFE_INIT, main);
}

function main(knife: EntityKnife) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postKnifeInitBabyFunction = postKnifeInitBabyFunctionMap.get(babyType);
  if (postKnifeInitBabyFunction !== undefined) {
    postKnifeInitBabyFunction(knife);
  }
}
