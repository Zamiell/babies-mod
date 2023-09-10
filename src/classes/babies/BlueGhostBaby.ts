import {
  CacheFlag,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Max tear rate. */
export class BlueGhostBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      !player.HasCollectible(CollectibleType.MOMS_KNIFE) &&
      !player.HasCollectible(CollectibleType.EPIC_FETUS) &&
      !player.HasCollectible(CollectibleType.SPIRIT_SWORD)
    );
  }

  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = 1;
  }
}
