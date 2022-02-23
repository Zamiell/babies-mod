import { getCurrentBaby } from "../utils";
import { usePillBabyFunctionMap } from "./usePillBabyFunctionMap";

export function main(_pillEffect: PillEffect, player: EntityPlayer): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const usePillBabyFunction = usePillBabyFunctionMap.get(babyType);
  if (usePillBabyFunction !== undefined) {
    usePillBabyFunction(player);
  }
}
