import * as misc from "../misc";
import postFireTearBabyFunctions from "./postFireTearBabies";

export function main(tear: EntityTear): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postFireTearBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(tear);
  }
}
