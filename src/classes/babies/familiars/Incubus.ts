import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getRandomCollectibleTypeFromPool } from "../../../utils";
import { Baby } from "../../Baby";

/** All items from the Devil Room pool. */
export class Incubus extends Baby {
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(
    _itemPoolType: ItemPoolType,
    _decrease: boolean,
    seed: Seed,
  ): CollectibleType | undefined {
    return getRandomCollectibleTypeFromPool(ItemPoolType.DEVIL, seed);
  }
}
