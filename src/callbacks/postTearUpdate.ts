import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postTearUpdateBabyFunctionMap } from "./postTearUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_TEAR_UPDATE, main);
}

function main(tear: EntityTear) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postTearUpdateBabyFunction =
    postTearUpdateBabyFunctionMap.get(babyType);
  if (postTearUpdateBabyFunction !== undefined) {
    postTearUpdateBabyFunction(tear);
  }
}
