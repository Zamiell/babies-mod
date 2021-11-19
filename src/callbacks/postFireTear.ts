import { getCurrentBaby } from "../util";
import { postFireTearBabyFunctionMap } from "./postFireTearBabyFunctionMap";

export function main(tear: EntityTear): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postFireTearBabyFunction = postFireTearBabyFunctionMap.get(babyType);
  if (postFireTearBabyFunction !== undefined) {
    postFireTearBabyFunction(tear);
  }
}
