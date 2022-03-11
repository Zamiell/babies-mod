import { getCurrentBaby } from "../utils";
import { usePillBabyFunctionMap } from "./usePillBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_USE_PILL, main);
}

function main(_pillEffect: PillEffect, player: EntityPlayer) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const usePillBabyFunction = usePillBabyFunctionMap.get(babyType);
  if (usePillBabyFunction !== undefined) {
    usePillBabyFunction(player);
  }
}
