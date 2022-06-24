import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBaby } from "../utils";
import { postPickupUpdateBabyFunctionMap } from "./postPickupUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_PICKUP_UPDATE, main);
}

function main(pickup: EntityPickup) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // All baby effects should ignore the Checkpoint.
  if (
    pickup.Variant === PickupVariant.COLLECTIBLE &&
    pickup.SubType === (CollectibleTypeCustom.CHECKPOINT as int)
  ) {
    return;
  }

  const postPickupUpdateBabyFunction =
    postPickupUpdateBabyFunctionMap.get(babyType);
  if (postPickupUpdateBabyFunction !== undefined) {
    postPickupUpdateBabyFunction(pickup);
  }
}
