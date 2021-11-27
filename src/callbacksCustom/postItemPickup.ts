import { PickingUpItem } from "isaacscript-common";
import g from "../globals";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  checkAddItem(pickingUpItem);
}

function checkAddItem(pickingUpItem: PickingUpItem) {
  if (
    pickingUpItem.type === ItemType.ITEM_PASSIVE || // 1
    pickingUpItem.type === ItemType.ITEM_FAMILIAR // 4
  ) {
    g.run.passiveCollectibles.push(pickingUpItem.id);
  }
}
