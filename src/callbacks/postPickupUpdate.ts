import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBaby } from "../utils";
import { postPickupUpdateBabyFunctionMap } from "./postPickupUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_PICKUP_UPDATE, main);
}

function main(pickup: EntityPickup) {
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

  const postPickupUpdateBabyFunction =
    postPickupUpdateBabyFunctionMap.get(babyType);
  if (postPickupUpdateBabyFunction !== undefined) {
    postPickupUpdateBabyFunction(pickup);
  }
}
