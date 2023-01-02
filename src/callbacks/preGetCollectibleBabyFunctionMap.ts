import {
  CollectibleType,
  ItemConfigTag,
  ItemPoolType,
  RoomType,
} from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import {
  getRandomCollectibleTypeFromPool,
  getRandomCollectibleTypeWithTag,
} from "../utils";

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

// 559
preGetCollectibleBabyFunctionMap.set(RandomBabyType.BALD, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.BOSS),
);

// 574
preGetCollectibleBabyFunctionMap.set(RandomBabyType.FOOD_REVIEWER, () =>
  getRandomCollectibleTypeWithTag(ItemConfigTag.FOOD),
);

// 582
preGetCollectibleBabyFunctionMap.set(RandomBabyType.GHOST, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.SHOP),
);

// 589
preGetCollectibleBabyFunctionMap.set(RandomBabyType.MONGO, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.ANGEL),
);

// 590
preGetCollectibleBabyFunctionMap.set(RandomBabyType.INCUBUS, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.DEVIL),
);

// 595
preGetCollectibleBabyFunctionMap.set(RandomBabyType.BOILED, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.ULTRA_SECRET),
);
