import {
  CollectibleType,
  EntityType,
  LaserVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  AZAZEL_DEFAULT_BRIMSTONE_DISTANCE,
  Callback,
  hasCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

const AZAZEL_ANTI_SYNERGIES = [
  CollectibleType.DR_FETUS, // 52
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.GODHEAD, // 331
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.HAEMOLACRIA, // 531
  CollectibleType.TRISAGION, // 533
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.NEPTUNUS, // 597
] as const;

/** Starts with Azazel-style Brimstone + flight. */
export class BelialBaby extends Baby {
  /** The method to shorten the laser also affects Mega Blast. */
  override isValid(player: EntityPlayer): boolean {
    return (
      !player.HasCollectible(CollectibleType.MEGA_BLAST) &&
      !hasCollectible(player, ...AZAZEL_ANTI_SYNERGIES)
    );
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
