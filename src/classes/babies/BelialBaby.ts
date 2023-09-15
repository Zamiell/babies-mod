import {
  CollectibleType,
  LaserVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  AZAZEL_DEFAULT_BRIMSTONE_DISTANCE,
  Callback,
  hasCollectible,
} from "isaacscript-common";
import { AZAZEL_ANTI_SYNERGIES } from "../../constants";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Starts with Azazel-style Brimstone + flight. */
export class BelialBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      // A max-charged Chocolate Milk + Brimstone shot will not be `LaserVariant.THICK_RED`, causing
      // the check below to fail.
      !player.HasCollectible(CollectibleType.CHOCOLATE_MILK) &&
      !hasCollectible(player, ...AZAZEL_ANTI_SYNERGIES)
    );
  }

  // 47
  @Callback(ModCallback.POST_LASER_INIT)
  postLaserInit(laser: EntityLaser): void {
    const player = getBabyPlayerFromEntity(laser);
    if (player === undefined) {
      return;
    }

    if (laser.Variant === LaserVariant.THICK_RED) {
      // For simplicity and to make it more difficult, we hard-code the default Azazel distance
      // (instead of dynamically calculating it based on the player's range).
      laser.SetMaxDistance(AZAZEL_DEFAULT_BRIMSTONE_DISTANCE);
    }
  }
}
