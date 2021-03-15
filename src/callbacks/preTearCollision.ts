// Note: This callback fires when a tear hits an enemy

import * as misc from "../misc";
import preTearCollisionBabyFunctions from "./preTearCollisionBabies";

export function main(tear: EntityTear, collider: Entity): null | boolean {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return null;
  }

  const babyFunc = preTearCollisionBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(tear, collider);
  }

  return null;
}
