import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postTearInitBabyFunctionMap } from "./postTearInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_TEAR_INIT, main);
}

function main(tear: EntityTear) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postTearInitBabyFunction = postTearInitBabyFunctionMap.get(babyType);
  if (postTearInitBabyFunction !== undefined) {
    postTearInitBabyFunction(tear);
  }
}
