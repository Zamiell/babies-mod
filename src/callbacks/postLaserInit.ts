import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postLaserInitBabyFunctionMap } from "./postLaserInitBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_LASER_INIT, main);
}

function main(laser: EntityLaser) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postLaserInitBabyFunction = postLaserInitBabyFunctionMap.get(babyType);
  if (postLaserInitBabyFunction !== undefined) {
    postLaserInitBabyFunction(laser);
  }
}
