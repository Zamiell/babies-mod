import { ItemPoolType, RoomType } from "isaac-typescript-definitions";
import { RandomBabyType } from "../babies";
import g from "../globals";
import { getRandomCollectibleTypeFromPool } from "../utils";

export const preGetCollectibleBabyFunctionMap = new Map<
  int,
  () => number | void
>();

// Folder Baby
preGetCollectibleBabyFunctionMap.set(430, () => {
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

// Little Gish
preGetCollectibleBabyFunctionMap.set(RandomBabyType.LITTLE_GISH, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.CURSE),
);

// Ghost Baby
preGetCollectibleBabyFunctionMap.set(RandomBabyType.GHOST_BABY, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.SHOP),
);

// Mongo Baby
preGetCollectibleBabyFunctionMap.set(RandomBabyType.MONGO_BABY, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.ANGEL),
);

// Incubus
preGetCollectibleBabyFunctionMap.set(RandomBabyType.INCUBUS, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.DEVIL),
);

// Boiled Baby
preGetCollectibleBabyFunctionMap.set(RandomBabyType.BOILED_BABY, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.ULTRA_SECRET),
);
