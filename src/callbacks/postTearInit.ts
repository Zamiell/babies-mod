import { getCurrentBaby } from "../utils";
import { postTearInitBabyFunctionMap } from "./postTearInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_TEAR_INIT, main);
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
