import g from "../globals";
import { getRandomItemFromPool } from "../misc";

const functionMap = new LuaTable<int, () => number | void>();
export default functionMap;

// Folder Baby
functionMap.set(430, () => {
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
functionMap.set(525, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_CURSE);
});

// Ghost Baby
functionMap.set(528, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_SHOP);
});

// Mongo Baby
functionMap.set(535, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_ANGEL);
});

// Incubus
functionMap.set(536, () => {
  return getRandomItemFromPool(ItemPoolType.POOL_DEVIL);
});
