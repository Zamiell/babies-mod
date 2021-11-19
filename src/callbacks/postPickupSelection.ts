import { getCurrentBaby } from "../util";
import { postPickupSelectionBabyFunctionMap } from "./postPickupSelectionBabyFunctionMap";

export function main(
  pickup: EntityPickup,
  variant: int,
  subType: int,
): [int, int] | void {
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
