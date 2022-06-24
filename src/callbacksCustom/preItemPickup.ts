import {
  ModCallbackCustom,
  ModUpgraded,
  PickingUpItem,
} from "isaacscript-common";
import { getCurrentBaby } from "../utils";
import { preItemPickupBabyFunctionMap } from "./preItemPickupBabyFunctionMap";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const preItemPickupBabyFunction = preItemPickupBabyFunctionMap.get(babyType);
  if (preItemPickupBabyFunction !== undefined) {
    preItemPickupBabyFunction(player, pickingUpItem);
  }
}
