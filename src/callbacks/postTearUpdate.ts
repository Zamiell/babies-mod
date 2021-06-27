import { getCurrentBaby } from "../misc";
import postTearUpdateBabyFunctions from "./postTearUpdateBabies";

export function main(tear: EntityTear): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postTearUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(tear);
  }
}
