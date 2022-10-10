import { ModCallbackCustom, PickingUpItem } from "isaacscript-common";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { preItemPickupBabyFunctionMap } from "./preItemPickupBabyFunctionMap";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const preItemPickupBabyFunction = preItemPickupBabyFunctionMap.get(babyType);
  if (preItemPickupBabyFunction !== undefined) {
    preItemPickupBabyFunction(player, pickingUpItem);
  }
}
