import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { Callback, spawnPickupWithSeed } from "isaacscript-common";
import { Baby } from "../../Baby";

/** Chest per enemy killed. */
export class RainbowBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    spawnPickupWithSeed(
      PickupVariant.CHEST,
      0,
      entity.Position,
      entity.InitSeed,
    );
  }
}
