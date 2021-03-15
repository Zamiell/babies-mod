import * as misc from "../misc";
import postTearInitBabyFunctions from "./postTearInitBabies";

export function main(tear: EntityTear): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postTearInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(tear);
  }
}
