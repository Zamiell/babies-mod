import { PickingUpItem } from "isaacscript-common";
import { getCurrentBaby } from "../util";
import { preItemPickupBabyFunctionMap } from "./preItemPickupBabyFunctionMap";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const preItemPickupBabyFunction = preItemPickupBabyFunctionMap.get(babyType);
  if (preItemPickupBabyFunction !== undefined) {
    preItemPickupBabyFunction(player, pickingUpItem);
  }
}
