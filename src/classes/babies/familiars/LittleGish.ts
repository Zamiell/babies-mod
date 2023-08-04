import type { CollectibleType } from "isaac-typescript-definitions";
import { ItemPoolType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getRandomCollectibleTypeFromPool } from "../../../utils";
import { Baby } from "../../Baby";

/** All items from the Curse Room pool. */
export class LittleGish extends Baby {
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(
    _itemPoolType: ItemPoolType,
    _decrease: boolean,
    seed: Seed,
  ): CollectibleType | undefined {
    return getRandomCollectibleTypeFromPool(ItemPoolType.CURSE, seed);
  }
}
