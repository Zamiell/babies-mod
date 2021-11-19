import { CollectibleTypeCustom } from "../types/enums";
import { getCurrentBaby } from "../util";
import { postPickupInitBabyFunctionMap } from "./postPickupInitBabyFunctionMap";

export function main(pickup: EntityPickup): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // All baby effects should ignore the Checkpoint
  if (
    pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE &&
    pickup.SubType === CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT
  ) {
    return;
  }

  const postPickupInitBabyFunction =
    postPickupInitBabyFunctionMap.get(babyType);
  if (postPickupInitBabyFunction !== undefined) {
    postPickupInitBabyFunction(pickup);
  }
}
