import type { CollectibleType } from "isaac-typescript-definitions";
import { ItemPoolType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

/** All items from the Boss Room pool. */
export class BaldBaby extends Baby {
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(
    _itemPoolType: ItemPoolType,
    _decrease: boolean,
    seed: Seed,
  ): CollectibleType | undefined {
    return getRandomCollectibleTypeFromPool(ItemPoolType.BOSS, seed);
  }
}
