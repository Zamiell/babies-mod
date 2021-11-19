import { getCurrentBaby } from "../util";
import familiarInitBabyFunctions from "./familiarInitBabies";

export function main(familiar: EntityFamiliar): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = familiarInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(familiar);
  }
}
