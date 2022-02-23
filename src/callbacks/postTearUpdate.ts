import { getCurrentBaby } from "../utils";
import { postTearUpdateBabyFunctionMap } from "./postTearUpdateBabyFunctionMap";

export function main(tear: EntityTear): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postTearUpdateBabyFunction =
    postTearUpdateBabyFunctionMap.get(babyType);
  if (postTearUpdateBabyFunction !== undefined) {
    postTearUpdateBabyFunction(tear);
  }
}
