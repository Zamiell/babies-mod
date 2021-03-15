import * as misc from "../misc";
import postLaserUpdateBabyFunctions from "./postLaserUpdateBabies";

export function main(laser: EntityLaser): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postLaserUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(laser);
  }
}
