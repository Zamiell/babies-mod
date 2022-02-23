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
    case RoomType.ROOM_SHOP: {
      return getRandomCollectibleTypeFromPool(ItemPoolType.POOL_TREASURE);
    }

    // 4
    case RoomType.ROOM_TREASURE: {
      return getRandomCollectibleTypeFromPool(ItemPoolType.POOL_SHOP);
    }

    // 14
    case RoomType.ROOM_DEVIL: {
      return getRandomCollectibleTypeFromPool(ItemPoolType.POOL_ANGEL);
    }

    // 15
    case RoomType.ROOM_ANGEL: {
      return getRandomCollectibleTypeFromPool(ItemPoolType.POOL_DEVIL);
    }

    default: {
      return undefined;
    }
  }
});

// Little Gish
preGetCollectibleBabyFunctionMap.set(RandomBabyType.LITTLE_GISH, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.POOL_CURSE),
);

// Ghost Baby
preGetCollectibleBabyFunctionMap.set(RandomBabyType.GHOST_BABY, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.POOL_SHOP),
);

// Mongo Baby
preGetCollectibleBabyFunctionMap.set(RandomBabyType.MONGO_BABY, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.POOL_ANGEL),
);

// Incubus
preGetCollectibleBabyFunctionMap.set(RandomBabyType.INCUBUS, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.POOL_DEVIL),
);

// Boiled Baby
preGetCollectibleBabyFunctionMap.set(RandomBabyType.BOILED_BABY, () =>
  getRandomCollectibleTypeFromPool(ItemPoolType.POOL_ULTRA_SECRET),
);
