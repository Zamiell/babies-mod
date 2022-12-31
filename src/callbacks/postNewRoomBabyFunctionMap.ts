import {
  BrokenWatchState,
  CollectibleType,
  Direction,
  EntityFlag,
  EntityType,
  FamiliarVariant,
  FireplaceVariant,
  GridEntityType,
  GridRoom,
  ItemPoolType,
  PillColor,
  PillEffect,
  RoomTransitionAnim,
  RoomType,
  StatueVariant,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  changeRoom,
  getCollectibleDevilHeartPrice,
  getDoors,
  getEntities,
  getFamiliars,
  getNPCs,
  getRoomGridIndexesForType,
  gridCoordinatesToWorldPosition,
  inStartingRoom,
  removeAllMatchingEntities,
  repeat,
  spawn,
  spawnGridEntityWithVariant,
  spawnWithSeed,
  teleport,
  useActiveItemTemp,
} from "isaacscript-common";
import { postNewRoomReorderedNoHealthUI } from "../callbacksCustom/postNewRoomReorderedSub";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import {
  getRandomCollectibleTypeFromPool,
  shouldTransformRoomType,
} from "../utils";
import { getCurrentBabyDescription } from "../utilsBaby";

export const postNewRoomBabyFunctionMap = new Map<RandomBabyType, () => void>();

// 61
postNewRoomBabyFunctionMap.set(RandomBabyType.ZOMBIE, () => {
  for (const entity of getEntities()) {
    if (entity.HasEntityFlags(EntityFlag.FRIENDLY)) {
      if (entity.Type === EntityType.BOIL) {
        // Delete Boils, because they are supposed to be rooted to the spot and will look very buggy
        // if they are moved.
        entity.Remove();
      } else {
        // Teleport all friendly entities to where the player is.
        entity.Position = g.p.Position;
      }
    }
  }
});

// 90
postNewRoomBabyFunctionMap.set(RandomBabyType.NERD, () => {
  if (!g.r.IsClear()) {
    return;
  }

  // Locked doors in uncleared rooms. If the player leaves and re-enters an uncleared room, a normal
  // door will stay locked. So, unlock all normal doors if the room is already clear.
  const normalLookingDoors = getDoors(
    RoomType.DEFAULT, // 1
    RoomType.MINI_BOSS, // 6
  );
  const lockedDoors = normalLookingDoors.filter((door) => door.IsLocked());
  for (const door of lockedDoors) {
    door.TryUnlock(g.p, true); // This has to be forced
  }
});

// 118
postNewRoomBabyFunctionMap.set(RandomBabyType.STATUE_2, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();
  const center = g.r.GetCenterPos();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  if (roomType !== RoomType.SECRET || !isFirstVisit) {
    return;
  }

  // Improved Secret Rooms
  repeat(baby.num, () => {
    const position = g.r.FindFreePickupSpawnPosition(center, 1, true);
    mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
  });
});

// 125
postNewRoomBabyFunctionMap.set(
  RandomBabyType.HOPELESS,
  postNewRoomReorderedNoHealthUI,
);

// 138
postNewRoomBabyFunctionMap.set(
  RandomBabyType.MOHAWK,
  postNewRoomReorderedNoHealthUI,
);

// 141
postNewRoomBabyFunctionMap.set(RandomBabyType.TWIN, () => {
  // Uncontrollable Teleport 2.0
  const isFirstVisit = g.r.IsFirstVisit();

  // We don't want to teleport away from the first room.
  if (inStartingRoom() && isFirstVisit) {
    return;
  }

  if (g.run.babyBool) {
    // We teleported to this room.
    g.run.babyBool = false;
  } else {
    // We are entering a new room.
    g.run.babyBool = true;
    useActiveItemTemp(g.p, CollectibleType.TELEPORT_2);
  }
});

// 149
postNewRoomBabyFunctionMap.set(RandomBabyType.BUTTERFLY, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();
  const center = g.r.GetCenterPos();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  if (roomType !== RoomType.SUPER_SECRET || !isFirstVisit) {
    return;
  }

  // Improved Super Secret Rooms.
  repeat(baby.num, () => {
    const position = g.r.FindFreePickupSpawnPosition(center, 1, true);
    mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
  });
});

// 158
postNewRoomBabyFunctionMap.set(RandomBabyType.PRETTY, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();

  // Ignore some special rooms.
  if (!isFirstVisit || !shouldTransformRoomType(roomType)) {
    return;
  }

  // All special rooms are Angel Shops.
  const collectibleType = getRandomCollectibleTypeFromPool(ItemPoolType.ANGEL);
  const position = gridCoordinatesToWorldPosition(6, 4);
  const collectible = mod.spawnCollectible(
    collectibleType,
    position,
    g.run.room.rng,
  );
  collectible.AutoUpdatePrice = false;
  collectible.Price = 15;

  // Spawn the Angel Statue.
  const oneTileAboveCenterGridIndex = 52;
  spawnGridEntityWithVariant(
    GridEntityType.STATUE,
    StatueVariant.ANGEL,
    oneTileAboveCenterGridIndex,
  );

  // Spawn the two fires.
  const firePositions = [
    gridCoordinatesToWorldPosition(3, 1),
    gridCoordinatesToWorldPosition(9, 1),
  ];
  for (const firePosition of firePositions) {
    spawnWithSeed(
      EntityType.FIREPLACE,
      FireplaceVariant.BLUE,
      0,
      firePosition,
      g.run.room.rng,
    );
  }
});

// 181
postNewRoomBabyFunctionMap.set(RandomBabyType.SPELUNKER, () => {
  const previousRoomGridIndex = g.l.GetPreviousRoomIndex();
  const roomType = g.r.GetType();

  if (
    roomType === RoomType.DUNGEON &&
    // We want to be able to backtrack from a Black Market to a Crawlspace.
    previousRoomGridIndex !== (GridRoom.BLACK_MARKET as int)
  ) {
    teleport(
      GridRoom.BLACK_MARKET,
      Direction.NO_DIRECTION,
      RoomTransitionAnim.WALK,
    );
  }
});

// 242
postNewRoomBabyFunctionMap.set(RandomBabyType.BEAST, () => {
  // Random enemies
  if (!inStartingRoom()) {
    useActiveItemTemp(g.p, CollectibleType.D10);
  }
});

// 249
postNewRoomBabyFunctionMap.set(RandomBabyType.LOVE_EYE, () => {
  // Make an exception for Boss Rooms and Devil Rooms.
  const roomType = g.r.GetType();
  if (
    !g.run.babyBool ||
    roomType === RoomType.BOSS ||
    roomType === RoomType.DEVIL
  ) {
    return;
  }

  // Replace all of the existing enemies with the stored one.
  for (const npc of getNPCs()) {
    // Make an exception for certain NPCs.
    if (
      npc.Type === EntityType.SHOPKEEPER || // 17
      npc.Type === EntityType.FIREPLACE // 33
    ) {
      continue;
    }

    spawn(
      g.run.babyNPC.entityType,
      g.run.babyNPC.variant,
      g.run.babyNPC.subType,
      npc.Position,
      npc.Velocity,
      undefined,
      npc.InitSeed,
    );
    npc.Remove();
  }
});

// 261
postNewRoomBabyFunctionMap.set(RandomBabyType.VIKING, () => {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.SECRET) {
    return;
  }

  const superSecretRoomIndexes = getRoomGridIndexesForType(
    RoomType.SUPER_SECRET,
  );
  if (superSecretRoomIndexes.length === 0) {
    return;
  }
  const firstSuperSecretRoomIndex = superSecretRoomIndexes[0];
  if (firstSuperSecretRoomIndex !== undefined) {
    teleport(firstSuperSecretRoomIndex);
  }
});

// 282
postNewRoomBabyFunctionMap.set(RandomBabyType.GHOST_2, () => {
  // Constant Maw of the Void effect + flight.
  g.p.SpawnMawOfVoid(30 * 60 * 60); // 1 hour
});

// 287
postNewRoomBabyFunctionMap.set(RandomBabyType.SUIT, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();

  // Ignore some special rooms.
  if (!isFirstVisit || !shouldTransformRoomType(roomType)) {
    return;
  }

  // All special rooms are Devil Rooms.
  const collectibleType = getRandomCollectibleTypeFromPool(ItemPoolType.DEVIL);
  const position = gridCoordinatesToWorldPosition(6, 4);
  const collectible = mod.spawnCollectible(
    collectibleType,
    position,
    g.run.room.rng,
  );
  collectible.AutoUpdatePrice = false;
  collectible.Price = getCollectibleDevilHeartPrice(collectibleType, g.p);

  // Spawn the Devil Statue.
  const oneTileAboveCenterGridIndex = 52;
  spawnGridEntityWithVariant(
    GridEntityType.STATUE,
    StatueVariant.DEVIL,
    oneTileAboveCenterGridIndex,
  );

  // Spawn the two fires.
  const firePositions = [
    gridCoordinatesToWorldPosition(3, 1),
    gridCoordinatesToWorldPosition(9, 1),
  ];
  for (const firePosition of firePositions) {
    spawnWithSeed(
      EntityType.FIREPLACE,
      FireplaceVariant.NORMAL,
      0,
      firePosition,
      g.run.room.rng,
    );
  }
});

// 297
postNewRoomBabyFunctionMap.set(RandomBabyType.WOODSMAN, () => {
  const roomClear = g.r.IsClear();

  if (!roomClear) {
    useActiveItemTemp(g.p, CollectibleType.MEAT_CLEAVER);
  }
});

// 301
postNewRoomBabyFunctionMap.set(RandomBabyType.BLOODIED, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();
  const center = g.r.GetCenterPos();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  if (roomType !== RoomType.ULTRA_SECRET || !isFirstVisit) {
    return;
  }

  // Improved Ultra Secret Rooms.
  repeat(baby.num, () => {
    const position = g.r.FindFreePickupSpawnPosition(center, 1, true);
    mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
  });
});

// 346
postNewRoomBabyFunctionMap.set(RandomBabyType.TWOTONE, () => {
  useActiveItemTemp(g.p, CollectibleType.DATAMINER);
});

// 351
postNewRoomBabyFunctionMap.set(RandomBabyType.MOUSE, () => {
  const roomClear = g.r.IsClear();

  if (!roomClear) {
    return;
  }

  // Coin doors in uncleared rooms. If the player leaves and re-enters an uncleared room, a normal
  // door will stay locked. So, unlock all normal doors if the room is already clear.
  for (const door of getDoors()) {
    if (door.TargetRoomType === RoomType.DEFAULT && door.IsLocked()) {
      door.TryUnlock(g.p, true); // This has to be forced
    }
  }
});

// 431
postNewRoomBabyFunctionMap.set(RandomBabyType.DRIVER, () => {
  // Slippery movement. Prevent softlocks from Gaping Maws and cheap damage by Broken Gaping Maws.
  removeAllMatchingEntities(EntityType.GAPING_MAW);
  removeAllMatchingEntities(EntityType.BROKEN_GAPING_MAW);
});

// 437
postNewRoomBabyFunctionMap.set(RandomBabyType.BREADMEAT_HOODIEBREAD, () => {
  // Everything is sped up.
  g.r.SetBrokenWatchState(BrokenWatchState.FAST);
});

// 504
postNewRoomBabyFunctionMap.set(RandomBabyType.PSYCHIC, () => {
  // Disable the vanilla shooting behavior.
  const abels = getFamiliars(FamiliarVariant.ABEL);
  for (const abel of abels) {
    abel.FireCooldown = 1000000;
  }
});

// 516
postNewRoomBabyFunctionMap.set(RandomBabyType.SILLY, () => {
  // Checking for the starting room can prevent crashes when reseeding happens.
  if (!inStartingRoom()) {
    g.p.UsePill(PillEffect.IM_EXCITED, PillColor.NULL);
    // If we try to cancel the animation now, it will bug out the player such that they will not be
    // able to take pocket items or pedestal items. This still happens even if we cancel the
    // animation in the `POST_UPDATE` callback, so don't bother canceling it.
  }
});

// 535
postNewRoomBabyFunctionMap.set(RandomBabyType.EYEBAT, () => {
  // Floors are reversed
  if (!inStartingRoom()) {
    return;
  }

  const isFirstVisit = g.r.IsFirstVisit();

  if (isFirstVisit) {
    const bossRoomIndexes = getRoomGridIndexesForType(RoomType.BOSS);
    if (bossRoomIndexes.length === 0) {
      return;
    }
    const bossRoomIndex = bossRoomIndexes[0];
    if (bossRoomIndex !== undefined) {
      changeRoom(bossRoomIndex);
    }
  } else {
    const centerPos = g.r.GetCenterPos();
    Isaac.GridSpawn(GridEntityType.TRAPDOOR, TrapdoorVariant.NORMAL, centerPos);
  }
});
