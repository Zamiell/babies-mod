import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, getEffectiveStage } from "isaacscript-common";
import { getRandomCollectibleTypeFromPool } from "../../../utils";
import { Baby } from "../../Baby";

/** All items from the shop pool. */
export class GhostBaby extends Baby {
  /** On stage 2, they will miss a Devil Deal, which is not fair. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== 2;
  }

  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(): CollectibleType | undefined {
    return getRandomCollectibleTypeFromPool(ItemPoolType.SHOP);
  }
}
