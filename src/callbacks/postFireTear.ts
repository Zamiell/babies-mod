import { getCurrentBaby } from "../utils";
import { postFireTearBabyFunctionMap } from "./postFireTearBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, main);
}

function main(tear: EntityTear) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postFireTearBabyFunction = postFireTearBabyFunctionMap.get(babyType);
  if (postFireTearBabyFunction !== undefined) {
    postFireTearBabyFunction(tear);
  }
}
