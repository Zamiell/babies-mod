import { getCurrentBaby } from "../util";
import postLaserInitBabyFunctions from "./postLaserInitBabies";

export function main(laser: EntityLaser): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postLaserInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(laser);
  }
}
