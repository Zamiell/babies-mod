import { getCurrentBaby } from "../utils";
import { postLaserInitBabyFunctionMap } from "./postLaserInitBabyFunctionMap";

export function main(laser: EntityLaser): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postLaserInitBabyFunction = postLaserInitBabyFunctionMap.get(babyType);
  if (postLaserInitBabyFunction !== undefined) {
    postLaserInitBabyFunction(laser);
  }
}
