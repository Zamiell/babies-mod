import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { getRandomCollectibleTypeFromPool } from "../../utils";
import { Baby } from "../Baby";

const ROOM_TYPE_TO_ITEM_POOL_TYPE_MAP: ReadonlyMap<RoomType, ItemPoolType> =
  new Map([
    [RoomType.SHOP, ItemPoolType.TREASURE], // 2
    [RoomType.TREASURE, ItemPoolType.SHOP], // 4
    [RoomType.DEVIL, ItemPoolType.ANGEL], // 14
    [RoomType.ANGEL, ItemPoolType.DEVIL], // 15
  ]);

/** Swaps item/shop pools + devil/angel pools. */
export class FolderBaby extends Baby {
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(): CollectibleType | undefined {
    const roomType = g.r.GetType();
    const itemPoolType = ROOM_TYPE_TO_ITEM_POOL_TYPE_MAP.get(roomType);
    return itemPoolType === undefined
      ? undefined
      : getRandomCollectibleTypeFromPool(itemPoolType);
  }
}
