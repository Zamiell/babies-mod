import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBaby } from "../utils";
import { postPickupUpdateBabyFunctionMap } from "./postPickupUpdateBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_PICKUP_UPDATE, main);
}

function main(pickup: EntityPickup) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
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
