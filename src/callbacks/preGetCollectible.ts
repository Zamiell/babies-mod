import { ItemPoolType, ModCallback } from "isaac-typescript-definitions";
import g from "../globals";
import { getCurrentBaby } from "../utils";
import { preGetCollectibleBabyFunctionMap } from "./preGetCollectibleBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.PRE_GET_COLLECTIBLE, main);
}

function main(
  _itemPoolType: ItemPoolType,
  _decrease: boolean,
  _seed: int,
): number | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // Racing+ gets collectibles on run start to check for a fully-unlocked save file.
  const gameFrameCount = g.g.GetFrameCount();
  if (gameFrameCount < 1) {
    return undefined;
  }

  // Later on, we might need to call the `ItemPool.GetCollectible` method, which will cause this
  // callback to be re-entered. `babyBool` will be set if this is the case.
  if (g.run.babyBool) {
    return undefined;
  }

  const preGetCollectibleBabyFunction =
    preGetCollectibleBabyFunctionMap.get(babyType);
  if (preGetCollectibleBabyFunction !== undefined) {
    return preGetCollectibleBabyFunction();
  }

  return undefined;
}
