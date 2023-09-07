import type { CollectibleType } from "isaac-typescript-definitions";
import {
  ItemPoolType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, onEffectiveStage } from "isaacscript-common";
import { Baby } from "../../Baby";
import { getRandomCollectibleTypeFromPool } from "../../features/GetRandomCollectibleTypeFromPool";

/** All items from the shop pool. */
export class GhostBaby extends Baby {
  /** On stage 2, they will miss a Devil Deal, which is not fair. */
  override isValid(): boolean {
    return !onEffectiveStage(LevelStage.BASEMENT_2);
  }

  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(
    _itemPoolType: ItemPoolType,
    _decrease: boolean,
    seed: Seed,
  ): CollectibleType | undefined {
    return getRandomCollectibleTypeFromPool(ItemPoolType.SHOP, seed);
  }
}
