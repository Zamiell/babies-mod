import {
  BlueFlySubType,
  CacheFlag,
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
  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY);
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 3);
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
