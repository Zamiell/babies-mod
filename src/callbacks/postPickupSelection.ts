import * as misc from "../misc";
import postPickupSelectionBabyFunctions from "./postPickupSelectionBabies";

export function main(
  pickup: EntityPickup,
  variant: int,
  subType: int,
): [int, int] | null {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return null;
  }

  const babyFunc = postPickupSelectionBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(pickup, variant, subType);
  }

  return null;
}
