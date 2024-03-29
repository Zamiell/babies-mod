import type { CollectibleType } from "isaac-typescript-definitions";
import {
  ItemPoolType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  ReadonlyMap,
  game,
  onStageWithNaturalDevilRoom,
} from "isaacscript-common";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

const ROOM_TYPE_TO_ITEM_POOL_TYPE_MAP = new ReadonlyMap<RoomType, ItemPoolType>(
  [
    [RoomType.SHOP, ItemPoolType.TREASURE], // 2
    [RoomType.TREASURE, ItemPoolType.SHOP], // 4
    [RoomType.DEVIL, ItemPoolType.ANGEL], // 14
    [RoomType.ANGEL, ItemPoolType.DEVIL], // 15
  ],
);

/** Swaps item/shop pools + devil/angel pools. */
export class FolderBaby extends Baby {
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom();
  }

  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(
    _itemPoolType: ItemPoolType,
    _decrease: boolean,
    seed: Seed,
  ): CollectibleType | undefined {
    const room = game.GetRoom();
    const roomType = room.GetType();
    const itemPoolType = ROOM_TYPE_TO_ITEM_POOL_TYPE_MAP.get(roomType);
    return itemPoolType === undefined
      ? undefined
      : getRandomCollectibleTypeFromPool(itemPoolType, seed);
  }
}
