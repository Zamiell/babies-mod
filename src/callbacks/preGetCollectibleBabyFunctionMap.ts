import {
  CollectibleType,
  ItemPoolType,
  RoomType,
} from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { getRandomCollectibleTypeFromPool } from "../utils";

export const preGetCollectibleBabyFunctionMap = new Map<
  RandomBabyType,
  () => CollectibleType | undefined
>();

// 430
preGetCollectibleBabyFunctionMap.set(RandomBabyType.FOLDER, () => {
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
});

// 562
preGetCollectibleBabyFunctionMap.set(RandomBabyType.LITTLE_GISH, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.CURSE),
);

// 565
preGetCollectibleBabyFunctionMap.set(RandomBabyType.GHOST, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.SHOP),
);

// 572
preGetCollectibleBabyFunctionMap.set(RandomBabyType.MONGO, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.ANGEL),
);

// 573
preGetCollectibleBabyFunctionMap.set(RandomBabyType.INCUBUS, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.DEVIL),
);

// 578
preGetCollectibleBabyFunctionMap.set(RandomBabyType.BOILED, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.ULTRA_SECRET),
);
