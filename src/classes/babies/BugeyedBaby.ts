import { ModCallback, PickupPrice } from "isaac-typescript-definitions";
import { Callback, asNumber, repeat } from "isaacscript-common";
import { PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS } from "../../constants";
import { Baby } from "../Baby";

/** Pickups turn into Blue Spiders. */
export class BugeyedBaby extends Baby {
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    const player = Isaac.GetPlayer();

    if (
      !PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS.has(pickup.Variant)
      && pickup.Price === asNumber(PickupPrice.NULL) // We don't want it to affect shop items.
    ) {
      pickup.Remove();

      repeat(3, (i) => {
        // Space out the spiders so that the player can see each individual one.
        const spacing = 15 * i;
        const spacingVector = Vector(spacing, spacing);
        const position = pickup.Position.add(spacingVector);
        player.ThrowBlueSpider(position, player.Position);
      });
    }
  }
}
