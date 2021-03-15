import g from "../globals";
import * as misc from "../misc";

const functionMap = new Map<int, () => number | null>();
export default functionMap;

// Folder Baby
functionMap.set(430, () => {
  const roomType = g.r.GetType();

  switch (roomType) {
    // 2
    case RoomType.ROOM_SHOP: {
      return misc.getRandomItemFromPool(ItemPoolType.POOL_TREASURE);
    }

    // 4
    case RoomType.ROOM_TREASURE: {
      return misc.getRandomItemFromPool(ItemPoolType.POOL_SHOP);
    }

    // 14
    case RoomType.ROOM_DEVIL: {
      return misc.getRandomItemFromPool(ItemPoolType.POOL_ANGEL);
    }

    // 15
    case RoomType.ROOM_ANGEL: {
      return misc.getRandomItemFromPool(ItemPoolType.POOL_DEVIL);
    }

    default: {
      return null;
    }
  }
});

// Little Gish
functionMap.set(525, () => {
  return misc.getRandomItemFromPool(ItemPoolType.POOL_CURSE);
});

// Ghost Baby
functionMap.set(528, () => {
  return misc.getRandomItemFromPool(ItemPoolType.POOL_SHOP);
});

// Mongo Baby
functionMap.set(535, () => {
  return misc.getRandomItemFromPool(ItemPoolType.POOL_ANGEL);
});

// Incubus
functionMap.set(536, () => {
  return misc.getRandomItemFromPool(ItemPoolType.POOL_DEVIL);
});
