import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postLaserUpdateBabyFunctionMap } from "./postLaserUpdateBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_LASER_UPDATE, main);
}

function main(laser: EntityLaser) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postLaserUpdateBabyFunction =
    postLaserUpdateBabyFunctionMap.get(babyType);
  if (postLaserUpdateBabyFunction !== undefined) {
    postLaserUpdateBabyFunction(laser);
  }
}
