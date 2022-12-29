import {
  CollectibleType,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  addRoomClearCharge,
  repeat,
  spawnPickup,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBabyDescription } from "../utils";

export const preSpawnClearAwardBabyFunctionMap = new Map<
  RandomBabyType,
  () => void
>();

// 88
preSpawnClearAwardBabyFunctionMap.set(RandomBabyType.BANDAID, () => {
  const roomType = g.r.GetType();
  const roomSeed = g.r.GetSpawnSeed();

  if (roomType === RoomType.BOSS) {
    return;
  }

  // Random collectible
  const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 1, true);
  mod.spawnCollectible(CollectibleType.NULL, position, roomSeed);
});

// 192
preSpawnClearAwardBabyFunctionMap.set(RandomBabyType.JAMMIES, () => {
  // Extra charge per room cleared.
  addRoomClearCharge(g.p);
});

// 347
preSpawnClearAwardBabyFunctionMap.set(RandomBabyType.N_2600, () => {
  useActiveItemTemp(g.p, CollectibleType.FRIEND_FINDER);
});

// 384
preSpawnClearAwardBabyFunctionMap.set(RandomBabyType.FISHMAN, () => {
  const roomSeed = g.r.GetSpawnSeed();

  // Random Bomb
  spawnPickup(PickupVariant.BOMB, 0, g.p.Position, VectorZero, g.p, roomSeed);
});

// 546
preSpawnClearAwardBabyFunctionMap.set(RandomBabyType.HIVE_KING, () => {
  let gaveGiantCell = false;
  if (g.p.HasCollectible(CollectibleType.GIANT_CELL)) {
    g.p.AddCollectible(CollectibleType.GIANT_CELL, 0, false);
    gaveGiantCell = true;
  }

  useActiveItemTemp(g.p, CollectibleType.DULL_RAZOR);

  if (gaveGiantCell) {
    g.p.RemoveCollectible(CollectibleType.GIANT_CELL);
  }
});

// 542
preSpawnClearAwardBabyFunctionMap.set(RandomBabyType.PEGASUS, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  repeat(baby.num, () => {
    useActiveItemTemp(g.p, CollectibleType.KEEPERS_BOX);
  });
});
