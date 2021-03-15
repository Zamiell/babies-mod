// Note: Position, SpawnerType, SpawnerVariant, and MaxDistance are not initialized yet in this
// callback

import * as misc from "../misc";
import postLaserInitBabyFunctions from "./postLaserInitBabies";

export function main(laser: EntityLaser): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postLaserInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(laser);
  }
}
