import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postKnifeInitBabyFunctionMap } from "./postKnifeInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_KNIFE_INIT, main);
}

function main(knife: EntityKnife) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postKnifeInitBabyFunction = postKnifeInitBabyFunctionMap.get(babyType);
  if (postKnifeInitBabyFunction !== undefined) {
    postKnifeInitBabyFunction(knife);
  }
}
