import {
  HeartSubType,
  ModCallback,
  PickupPrice,
} from "isaac-typescript-definitions";
import { Callback, isHeart } from "isaacscript-common";
import { PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS } from "../../constants";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Scared pickups. */
export class RictusBaby extends Baby {
  @Callback(ModCallback.POST_PICKUP_UPDATE)
  postPickupUpdate(pickup: EntityPickup): void {
    if (
      !PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS.has(pickup.Variant) &&
      !isScaredHeart(pickup) &&
      pickup.Price === (PickupPrice.NULL as int) && // We don't want it to affect shop items.
      pickup.Position.Distance(g.p.Position) <= 80
    ) {
      pickup.Velocity = pickup.Position.sub(g.p.Position).Normalized().mul(8);
    }
  }
}

function isScaredHeart(pickup: EntityPickup) {
  return isHeart(pickup) && pickup.SubType === HeartSubType.SCARED;
}
