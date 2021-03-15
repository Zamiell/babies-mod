import * as misc from "../misc";
import postTearUpdateBabyFunctions from "./postTearUpdateBabies";

export function main(tear: EntityTear): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postTearUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(tear);
  }
}
