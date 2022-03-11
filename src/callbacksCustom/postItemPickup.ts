import {
  ModCallbacksCustom,
  ModUpgraded,
  PickingUpItem,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";
import { postItemPickupBabyFunctionMap } from "./postItemPickupBabyFunctionMap";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  checkAddItem(pickingUpItem);

  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
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
    pickingUpItem.itemType === ItemType.ITEM_PASSIVE || // 1
    pickingUpItem.itemType === ItemType.ITEM_FAMILIAR // 4
  ) {
    g.run.passiveCollectibleTypes.push(pickingUpItem.subType);
  }
}
