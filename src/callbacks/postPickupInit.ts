import { ModCallback } from "isaac-typescript-definitions";
import { isCollectible } from "isaacscript-common";
import { mod } from "../mod";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBaby } from "../utilsBaby";
import { postPickupInitBabyFunctionMap } from "./postPickupInitBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_PICKUP_INIT, main);
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

  const postPickupInitBabyFunction =
    postPickupInitBabyFunctionMap.get(babyType);
  if (postPickupInitBabyFunction !== undefined) {
    postPickupInitBabyFunction(pickup);
  }
}
