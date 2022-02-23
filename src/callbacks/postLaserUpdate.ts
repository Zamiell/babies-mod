import { getCurrentBaby } from "../utils";
import { postLaserUpdateBabyFunctionMap } from "./postLaserUpdateBabyFunctionMap";

export function main(laser: EntityLaser): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postLaserUpdateBabyFunction =
    postLaserUpdateBabyFunctionMap.get(babyType);
  if (postLaserUpdateBabyFunction !== undefined) {
    postLaserUpdateBabyFunction(laser);
  }
}
