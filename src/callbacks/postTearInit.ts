import { getCurrentBaby } from "../util";
import postTearInitBabyFunctions from "./postTearInitBabies";

export function main(tear: EntityTear): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postTearInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(tear);
  }
}
