import { PickingUpItem } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";
import { postItemPickupBabyFunctionMap } from "./postItemPickupBabyFunctionMap";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
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
    pickingUpItem.type === ItemType.ITEM_PASSIVE || // 1
    pickingUpItem.type === ItemType.ITEM_FAMILIAR // 4
  ) {
    g.run.passiveCollectibles.push(pickingUpItem.id);
  }
}
