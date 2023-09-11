import {
  EntityCollisionClass,
  ModCallback,
  PickupPrice,
} from "isaac-typescript-definitions";
import { Callback, asNumber } from "isaacscript-common";
import { PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS } from "../../constants";
import { Baby } from "../Baby";

/** Pickups are bouncy. */
export class NoArmsBaby extends Baby {
  @Callback(ModCallback.POST_PICKUP_UPDATE)
  postPickupUpdate(pickup: EntityPickup): void {
    const player = Isaac.GetPlayer();

    if (
      !PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS.has(pickup.Variant) &&
      pickup.Price === asNumber(PickupPrice.NULL) // We don't want it to affect shop items.
    ) {
      // Make it impossible for the player to pick up this pickup.
      if (pickup.EntityCollisionClass !== EntityCollisionClass.NONE) {
        pickup.EntityCollisionClass = EntityCollisionClass.NONE;
      }

      // Make it bounce off the player if they get too close.
      if (player.Position.Distance(pickup.Position) <= 25) {
        const x = pickup.Position.X - player.Position.X;
        const y = pickup.Position.Y - player.Position.Y;
        pickup.Velocity = Vector(x / 2, y / 2);
      }
    }
  }
}
