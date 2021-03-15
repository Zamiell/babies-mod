import * as misc from "../misc";
import familiarInitBabyFunctions from "./familiarInitBabies";

export function main(familiar: EntityFamiliar): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = familiarInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(familiar);
  }
}
