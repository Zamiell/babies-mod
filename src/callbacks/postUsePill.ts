import { ModCallback, PillEffect } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";
import { usePillBabyFunctionMap } from "./usePillBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_USE_PILL, main);
}

function main(_pillEffect: PillEffect, player: EntityPlayer) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  const usePillBabyFunction = usePillBabyFunctionMap.get(babyType);
  if (usePillBabyFunction !== undefined) {
    usePillBabyFunction(player);
  }

  return undefined;
}
