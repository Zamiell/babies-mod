import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
} from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";
import { preGetCollectibleBabyFunctionMap } from "./preGetCollectibleBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.PRE_GET_COLLECTIBLE, main);
}

function main(
  _itemPoolType: ItemPoolType,
  _decrease: boolean,
  _seed: int,
): CollectibleType | undefined {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // Racing+ gets collectibles on run start to check for a fully-unlocked save file.
  const gameFrameCount = game.GetFrameCount();
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
