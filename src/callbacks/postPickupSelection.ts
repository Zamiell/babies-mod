import { getCurrentBaby } from "../util";
import postPickupSelectionBabyFunctions from "./postPickupSelectionBabies";

export function main(
  pickup: EntityPickup,
  variant: int,
  subType: int,
): [int, int] | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const babyFunc = postPickupSelectionBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(pickup, variant, subType);
  }

  return undefined;
}
