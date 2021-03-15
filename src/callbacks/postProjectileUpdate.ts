// Note: This callback will fire on frame 1 and onwards

import * as misc from "../misc";
import postProjectileUpdateBabyFunctions from "./postProjectileUpdateBabies";

export function main(projectile: EntityProjectile): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postProjectileUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(projectile);
  }
}
