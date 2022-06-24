import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postLaserUpdateBabyFunctionMap } from "./postLaserUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_LASER_UPDATE, main);
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
