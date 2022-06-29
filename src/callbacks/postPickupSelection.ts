import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postPickupSelectionBabyFunctionMap } from "./postPickupSelectionBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_PICKUP_SELECTION, main);
}

function main(
  pickup: EntityPickup,
  variant: PickupVariant,
  subType: int,
): [PickupVariant, int] | undefined {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postPickupSelectionBabyFunction =
    postPickupSelectionBabyFunctionMap.get(babyType);
  if (postPickupSelectionBabyFunction !== undefined) {
    return postPickupSelectionBabyFunction(pickup, variant, subType);
  }

  return undefined;
}
