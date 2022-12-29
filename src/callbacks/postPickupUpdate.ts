import { ModCallback } from "isaac-typescript-definitions";
import { isCollectible } from "isaacscript-common";
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
    isCollectible(pickup) &&
    pickup.SubType === CollectibleTypeCustom.CHECKPOINT
  ) {
    return;
  }

  const postPickupUpdateBabyFunction =
    postPickupUpdateBabyFunctionMap.get(babyType);
  if (postPickupUpdateBabyFunction !== undefined) {
    postPickupUpdateBabyFunction(pickup);
  }
}
