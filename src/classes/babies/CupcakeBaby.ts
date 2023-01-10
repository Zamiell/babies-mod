import {
  CacheFlag,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** High shot speed. */
export class CupcakeBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.EPIC_FETUS);
  }

  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SHOT_SPEED)
  evaluateCacheShotSpeed(player: EntityPlayer): void {
    player.ShotSpeed = 4;
  }
}
