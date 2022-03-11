import { getCurrentBaby } from "../utils";
import { postLaserInitBabyFunctionMap } from "./postLaserInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_LASER_INIT, main);
}

function main(laser: EntityLaser) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postLaserInitBabyFunction = postLaserInitBabyFunctionMap.get(babyType);
  if (postLaserInitBabyFunction !== undefined) {
    postLaserInitBabyFunction(laser);
  }
}
