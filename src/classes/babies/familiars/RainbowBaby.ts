import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { Callback, hasTrinket, spawnPickupWithSeed } from "isaacscript-common";
import { CHEST_ANTI_SYNERGY_TRINKET_TYPES } from "../../../constantsTrinketTypes";
import { Baby } from "../../Baby";

/** Chest per enemy killed. */
export class RainbowBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasTrinket(player, ...CHEST_ANTI_SYNERGY_TRINKET_TYPES);
  }

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
