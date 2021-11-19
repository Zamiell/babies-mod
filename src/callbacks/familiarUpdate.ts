import { getCurrentBaby } from "../util";
import familiarUpdateBabyFunctions from "./familiarUpdateBabies";

export function main(familiar: EntityFamiliar): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = familiarUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(familiar);
  }
}
