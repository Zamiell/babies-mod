import type { CollectibleType } from "isaac-typescript-definitions";
import {
  ItemPoolType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, onEffectiveStage } from "isaacscript-common";
import { Baby } from "../../Baby";
import { getRandomCollectibleTypeFromPool } from "../../features/GetRandomCollectibleTypeFromPool";

/** All items from the Curse Room pool. */
export class LittleGish extends Baby {
  /**
   * We don't want this to affect the player's first devil deal. Additionally, we do not want the
   * mechanic to affect resetting for a starting item.
   */
  override isValid(): boolean {
    return (
      !onEffectiveStage(LevelStage.BASEMENT_1) &&
      !onEffectiveStage(LevelStage.BASEMENT_2)
    );
  }

  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(
    _itemPoolType: ItemPoolType,
    _decrease: boolean,
    seed: Seed,
  ): CollectibleType | undefined {
    return getRandomCollectibleTypeFromPool(ItemPoolType.CURSE, seed);
  }
}
