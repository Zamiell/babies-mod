import {
  HeartSubType,
  ModCallback,
  PickupPrice,
} from "isaac-typescript-definitions";
import { Callback, asNumber, isHeart } from "isaacscript-common";
import { PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS } from "../../constants";
import { Baby } from "../Baby";

/** Scared pickups. */
export class RictusBaby extends Baby {
  @Callback(ModCallback.POST_PICKUP_UPDATE)
  postPickupUpdate(pickup: EntityPickup): void {
    const player = Isaac.GetPlayer();

    if (
      !PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS.has(pickup.Variant) &&
      !isScaredHeart(pickup) &&
      pickup.Price === asNumber(PickupPrice.NULL) && // We don't want it to affect shop items.
      pickup.Position.Distance(player.Position) <= 80
    ) {
      pickup.Velocity = pickup.Position.sub(player.Position)
        .Normalized()
        .mul(8);
    }
  }
}

function isScaredHeart(pickup: EntityPickup) {
  return isHeart(pickup) && pickup.SubType === HeartSubType.SCARED;
}
