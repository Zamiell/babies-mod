import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postPickupSelectionBabyFunctionMap } from "./postPickupSelectionBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_PICKUP_SELECTION, main);
}

function main(
  pickup: EntityPickup,
  variant: int,
  subType: int,
): [PickupVariant, int] | undefined {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const postPickupSelectionBabyFunction =
    postPickupSelectionBabyFunctionMap.get(babyType);
  if (postPickupSelectionBabyFunction !== undefined) {
    return postPickupSelectionBabyFunction(pickup, variant, subType);
  }

  return undefined;
}
