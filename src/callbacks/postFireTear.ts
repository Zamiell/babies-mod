import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postFireTearBabyFunctionMap } from "./postFireTearBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_FIRE_TEAR, main);
}

function main(tear: EntityTear) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postFireTearBabyFunction = postFireTearBabyFunctionMap.get(babyType);
  if (postFireTearBabyFunction !== undefined) {
    postFireTearBabyFunction(tear);
  }
}
