import { ItemType } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  ModUpgraded,
  PickingUpItem,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";
import { postItemPickupBabyFunctionMap } from "./postItemPickupBabyFunctionMap";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  checkAddItem(pickingUpItem);

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

function checkAddItem(pickingUpItem: PickingUpItem) {
  if (
    pickingUpItem.itemType === ItemType.PASSIVE || // 1
    pickingUpItem.itemType === ItemType.FAMILIAR // 4
  ) {
    g.run.passiveCollectibleTypes.push(pickingUpItem.subType);
  }
}
