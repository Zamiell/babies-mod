import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";
import { postFireTearBabyFunctionMap } from "./postFireTearBabyFunctionMap";

export function init(): void {
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
