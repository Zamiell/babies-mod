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
  LaserVariant,
  LevelCurse,
  MinibossID,
  PillColor,
  PillEffect,
  RoomTransitionAnim,
  RoomType,
  StatueVariant,
  TearFlag,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  addFlag,
  bitFlags,
  changeRoom,
  getCollectibleDevilHeartPrice,
  getDoors,
  getEntities,
  getFamiliars,
  getNPCs,
  getRoomGridIndexesForType,
  getRooms,
  gridCoordinatesToWorldPosition,
  inMinibossRoomOf,
  inStartingRoom,
  isEven,
  log,
  removeAllMatchingEntities,
  repeat,
  spawn,
  spawnCollectible,
  spawnGridWithVariant,
  spawnWithSeed,
  teleport,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { TELEPORT_ROOM_TYPE_TO_ITEM_AND_PRICE_MAP } from "../maps/teleportRoomTypeToItemAndPriceMap";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBabyDescription, shouldTransformRoomType } from "../utils";

const FANCY_BABY_COLLECTIBLE_POSITIONS: ReadonlyArray<[x: int, y: int]> = [
  [3, 1],
  [9, 1],
  [3, 5],
  [9, 5],
  [1, 1],
  [11, 1],
  [1, 5],
  [11, 5],
];

export const postNewRoomBabyFunctionMap = new Map<RandomBabyType, () => void>();

// This is used for several babies.
function noHealth() {
  const roomType = g.r.GetType();
  const inKrampusRoom = inMinibossRoomOf(MinibossID.KRAMPUS);

  // Get rid of the health UI by using Curse of the Unknown (but not in Devil Rooms or Black
  // Markets).
  if (
    (roomType === RoomType.DEVIL || // 14
      roomType === RoomType.BLACK_MARKET) && // 22
    !inKrampusRoom
  ) {
    g.l.RemoveCurses(LevelCurse.UNKNOWN);
  } else {
    g.l.AddCurse(LevelCurse.UNKNOWN, false);
  }
}

// 10
postNewRoomBabyFunctionMap.set(RandomBabyType.LOST, noHealth);

// 13
postNewRoomBabyFunctionMap.set(RandomBabyType.SHADOW, () => {
  const roomType = g.r.GetType();
  if (
    roomType === RoomType.DEVIL || // 14
    roomType === RoomType.ANGEL // 15
  ) {
    teleport(
      GridRoom.BLACK_MARKET,
      Direction.NO_DIRECTION,
      RoomTransitionAnim.WALK,
    );
  }
});

// 14
postNewRoomBabyFunctionMap.set(RandomBabyType.GLASS, () => {
  // Spawn a laser ring around the player.
  const laser = g.p.FireTechXLaser(g.p.Position, VectorZero, 66).ToLaser();
  // (We copy the radius from Samael's Tech X ability.)
  if (laser === undefined) {
    return;
  }
  if (laser.Variant !== LaserVariant.THIN_RED) {
    laser.Variant = LaserVariant.THIN_RED;
    laser.SpriteScale = Vector(0.5, 1);
  }
  laser.TearFlags = addFlag(laser.TearFlags, TearFlag.CONTINUUM);
  laser.CollisionDamage *= 0.66;
  const data = laser.GetData();
  data["ring"] = true;
});

// 15
postNewRoomBabyFunctionMap.set(RandomBabyType.GOLD, () => {
  g.r.TurnGold();
});

// 30
postNewRoomBabyFunctionMap.set(RandomBabyType.BLUE, () => {
  // Sprinkler tears
  g.run.babyBool = true;
  useActiveItemTemp(g.p, CollectibleType.SPRINKLER);
});

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
    spawnCollectible(CollectibleType.NULL, position, g.run.rng);
  });
});

// 125
postNewRoomBabyFunctionMap.set(RandomBabyType.HOPELESS, noHealth);

// 138
postNewRoomBabyFunctionMap.set(RandomBabyType.MOHAWK, noHealth);

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
    spawnCollectible(CollectibleType.NULL, position, g.run.rng);
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
  const angelSeed = g.run.room.rng.Next();
  const collectibleType = g.itemPool.GetCollectible(
    ItemPoolType.ANGEL,
    true,
    angelSeed,
  );
  const position = gridCoordinatesToWorldPosition(6, 4);
  const collectible = spawnCollectible(
    collectibleType,
    position,
    g.run.room.rng,
  );
  collectible.AutoUpdatePrice = false;
  collectible.Price = 15;

  // Spawn the Angel Statue.
  const oneTileAboveCenterGridIndex = 52;
  spawnGridWithVariant(
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
    const fireplaceSeed = g.run.room.rng.Next();
    spawnWithSeed(
      EntityType.FIREPLACE,
      FireplaceVariant.BLUE,
      0,
      firePosition,
      fireplaceSeed,
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

// 216
postNewRoomBabyFunctionMap.set(RandomBabyType.FANCY, () => {
  const stage = g.l.GetStage();
  const isFirstVisit = g.r.IsFirstVisit();

  if (!inStartingRoom() || !isFirstVisit) {
    return;
  }

  // Can purchase teleports to special rooms.
  let positionIndex = -1;

  // Find the special rooms on the floor.
  for (const roomDescriptor of getRooms()) {
    const roomData = roomDescriptor.Data;
    if (roomData === undefined) {
      continue;
    }

    const roomType = roomData.Type;
    const itemAndPrice = TELEPORT_ROOM_TYPE_TO_ITEM_AND_PRICE_MAP.get(roomType);
    if (itemAndPrice === undefined) {
      // This is not a special room.
      continue;
    }

    let collectibleType = itemAndPrice[0];
    const price = itemAndPrice[1];

    if (
      collectibleType === CollectibleTypeCustom.CHALLENGE_ROOM_TELEPORT &&
      isEven(stage)
    ) {
      collectibleType = CollectibleTypeCustom.BOSS_CHALLENGE_ROOM_TELEPORT;
    }

    positionIndex += 1;
    if (positionIndex > FANCY_BABY_COLLECTIBLE_POSITIONS.length) {
      log("Error: This floor has too many special rooms for Fancy Baby.");
      return;
    }
    const xy = FANCY_BABY_COLLECTIBLE_POSITIONS[positionIndex];
    if (xy === undefined) {
      error(`Failed to get the floor position for index: ${positionIndex}`);
    }
    const [x, y] = xy;
    const position = gridCoordinatesToWorldPosition(x, y);
    const collectible = spawnCollectible(
      collectibleType,
      position,
      g.run.room.rng,
    );
    collectible.AutoUpdatePrice = false;
    collectible.Price = price;
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
  const devilSeed = g.run.room.rng.Next();
  const collectibleType = g.itemPool.GetCollectible(
    ItemPoolType.DEVIL,
    true,
    devilSeed,
  );
  const position = gridCoordinatesToWorldPosition(6, 4);
  const collectible = spawnCollectible(
    collectibleType,
    position,
    g.run.room.rng,
  );
  collectible.AutoUpdatePrice = false;
  collectible.Price = getCollectibleDevilHeartPrice(collectibleType, g.p);

  // Spawn the Devil Statue.
  const oneTileAboveCenterGridIndex = 52;
  spawnGridWithVariant(
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
    const fireplaceSeed = g.run.room.rng.Next();
    spawnWithSeed(
      EntityType.FIREPLACE,
      FireplaceVariant.NORMAL,
      0,
      firePosition,
      fireplaceSeed,
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
    spawnCollectible(CollectibleType.NULL, position, g.run.rng);
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
    // animation in the PostUpdate callback, so don't bother canceling it.
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

// 559
postNewRoomBabyFunctionMap.set(RandomBabyType.BROTHER_BOBBY, () => {
  const godheadTear = g.p.FireTear(
    g.p.Position,
    VectorZero,
    false,
    true,
    false,
  );
  godheadTear.TearFlags = bitFlags(TearFlag.GLOW);
  godheadTear.SubType = 1;
  const sprite = godheadTear.GetSprite();
  sprite.Load("gfx/tear_blank.anm2", true);
  sprite.Play("RegularTear6", false);

  const data = godheadTear.GetData();
  data["godHeadTear"] = true;
});
