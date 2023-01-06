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

/** Swaps item/shop pools + devil/angel pools. */
export class FolderBaby extends Baby {
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(): CollectibleType | undefined {
    const roomType = g.r.GetType();

    switch (roomType) {
      // 2
      case RoomType.SHOP: {
        return getRandomCollectibleTypeFromPool(ItemPoolType.TREASURE);
      }

      // 4
      case RoomType.TREASURE: {
        return getRandomCollectibleTypeFromPool(ItemPoolType.SHOP);
      }

      // 14
      case RoomType.DEVIL: {
        return getRandomCollectibleTypeFromPool(ItemPoolType.ANGEL);
      }

      // 15
      case RoomType.ANGEL: {
        return getRandomCollectibleTypeFromPool(ItemPoolType.DEVIL);
      }

      default: {
        return undefined;
      }
    }
  }
}
