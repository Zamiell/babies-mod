import { getCurrentBaby } from "../util";
import { postTearInitBabyFunctionMap } from "./postTearInitBabyFunctionMap";

export function main(tear: EntityTear): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postTearInitBabyFunction = postTearInitBabyFunctionMap.get(babyType);
  if (postTearInitBabyFunction !== undefined) {
    postTearInitBabyFunction(tear);
  }
}
