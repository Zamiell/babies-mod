import g from "../globals";
import { getRandomItemFromPool } from "../util";

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
      return getRandomItemFromPool(ItemPoolType.POOL_TREASURE);
    }

    // 4
    case RoomType.ROOM_TREASURE: {
      return getRandomItemFromPool(ItemPoolType.POOL_SHOP);
    }

    // 14
    case RoomType.ROOM_DEVIL: {
      return getRandomItemFromPool(ItemPoolType.POOL_ANGEL);
    }

    // 15
    case RoomType.ROOM_ANGEL: {
      return getRandomItemFromPool(ItemPoolType.POOL_DEVIL);
    }

    default: {
      return undefined;
    }
  }
});

// Little Gish
preGetCollectibleBabyFunctionMap.set(525, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_CURSE);
});

// Ghost Baby
preGetCollectibleBabyFunctionMap.set(528, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_SHOP);
});

// Mongo Baby
preGetCollectibleBabyFunctionMap.set(535, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_ANGEL);
});

// Incubus
preGetCollectibleBabyFunctionMap.set(536, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_DEVIL);
});
