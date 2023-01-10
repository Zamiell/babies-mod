import {
  CollectibleType,
  EntityType,
  LaserVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  AZAZEL_DEFAULT_BRIMSTONE_DISTANCE,
  Callback,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Azazel-style Brimstone + flight. */
export class BelialBaby extends Baby {
  /** The method to shorten the laser also affects Mega Blast. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.MEGA_BLAST);
  }

  // 47
  @Callback(ModCallback.POST_LASER_INIT)
  postLaserInit(laser: EntityLaser): void {
    if (
      laser.SpawnerType === EntityType.PLAYER &&
      laser.Variant === LaserVariant.THICK_RED
    ) {
      // For simplicity and to make it more difficult, we hard-code the default Azazel distance
      // (instead of dynamically calculating it based on the player's range).
      laser.SetMaxDistance(AZAZEL_DEFAULT_BRIMSTONE_DISTANCE);
    }
  }
}
