import { ModCallbackCustom, PickingUpItem } from "isaacscript-common";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";
import { postItemPickupBabyFunctionMap } from "./postItemPickupBabyFunctionMap";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postItemPickupBabyFunction =
    postItemPickupBabyFunctionMap.get(babyType);
  if (postItemPickupBabyFunction !== undefined) {
    postItemPickupBabyFunction(player, pickingUpItem);
  }
}
