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
    // The custom effect with C Section is a downgrade. (But Monstro's Lung is okay.)
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
