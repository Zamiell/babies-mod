import { getCurrentBaby } from "../util";
import preTearCollisionBabyFunctions from "./preTearCollisionBabies";

export function main(tear: EntityTear, collider: Entity): boolean | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const babyFunc = preTearCollisionBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(tear, collider);
  }

  return undefined;
}
