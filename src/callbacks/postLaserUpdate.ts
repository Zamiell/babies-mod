import { getCurrentBaby } from "../utils";
import { postLaserUpdateBabyFunctionMap } from "./postLaserUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_LASER_UPDATE, main);
}

function main(laser: EntityLaser) {
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
