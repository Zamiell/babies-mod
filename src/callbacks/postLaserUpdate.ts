import { getCurrentBaby } from "../util";
import postLaserUpdateBabyFunctions from "./postLaserUpdateBabies";

export function main(laser: EntityLaser): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postLaserUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(laser);
  }
}
