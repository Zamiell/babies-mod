import {
  BlueFlySubType,
  CacheFlag,
  CollectibleType,
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  removeAllMatchingEntities,
  spawnFamiliar,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Shoots explosive flies + flight. */
export class SickBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    // C Section reduces the tear rate for no additional tears unlike Monstro's lung. So the custom
    // effect with C Section is a straight-up downgrade.
    return !player.HasCollectible(CollectibleType.C_SECTION);
  }

  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY);
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = Math.ceil(player.MaxFireDelay * 3);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.Remove();
    spawnFamiliar(
      FamiliarVariant.BLUE_FLY,
      BlueFlySubType.WRATH,
      tear.Position,
      tear.Velocity,
      tear.SpawnerEntity,
      tear.InitSeed,
    );
  }
}
