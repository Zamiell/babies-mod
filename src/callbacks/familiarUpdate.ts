import * as misc from "../misc";
import familiarUpdateBabyFunctions from "./familiarUpdateBabies";

export function main(familiar: EntityFamiliar): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = familiarUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(familiar);
  }
}
