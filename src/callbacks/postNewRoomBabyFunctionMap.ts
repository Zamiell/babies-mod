import {
  getCollectibleDevilHeartPrice,
  getDoors,
  getEntities,
  getFamiliars,
  getNPCs,
  getRoomVariant,
  gridToPos,
  log,
  nextSeed,
  openAllDoors,
  removeAllMatchingEntities,
  teleport,
} from "isaacscript-common";
import { KRAMPUS_ROOM_VARIANTS } from "../constants";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/enums";
import { useActiveItem } from "../util";

export const postNewRoomBabyFunctionMap = new Map<int, () => void>();

// This is used for several babies
function noHealth() {
  const roomType = g.r.GetType();
  const roomVariant = getRoomVariant();

  // Get rid of the health UI by using Curse of the Unknown
  // (but not in Devil Rooms or Black Markets)
  if (
    (roomType === RoomType.ROOM_DEVIL || // 14
      roomType === RoomType.ROOM_BLACK_MARKET) && // 22
    !KRAMPUS_ROOM_VARIANTS.has(roomVariant)
  ) {
    g.l.RemoveCurses(LevelCurse.CURSE_OF_THE_UNKNOWN);
  } else {
    g.l.AddCurse(LevelCurse.CURSE_OF_THE_UNKNOWN, false);
  }
}

// Lost Baby
postNewRoomBabyFunctionMap.set(10, noHealth);

// Shadow Baby
postNewRoomBabyFunctionMap.set(13, () => {
  const roomType = g.r.GetType();
  if (
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL // 15
  ) {
    teleport(
      GridRooms.ROOM_BLACK_MARKET_IDX,
      Direction.NO_DIRECTION,
      RoomTransitionAnim.WALK,
    );
  }
});

// Glass Baby
postNewRoomBabyFunctionMap.set(14, () => {
  // Spawn a laser ring around the player
  const laser = g.p.FireTechXLaser(g.p.Position, Vector.Zero, 66).ToLaser();
  // (we copy the radius from Samael's Tech X ability)
  if (laser === undefined) {
    return;
  }
  if (laser.Variant !== 2) {
    laser.Variant = 2;
    laser.SpriteScale = Vector(0.5, 1);
  }
  laser.TearFlags |= TearFlags.TEAR_CONTINUUM;
  laser.CollisionDamage *= 0.66;
  const data = laser.GetData();
  data.ring = true;
});

// Gold Baby
postNewRoomBabyFunctionMap.set(15, () => {
  g.r.TurnGold();
});

// Blue Baby
postNewRoomBabyFunctionMap.set(30, () => {
  // Sprinkler tears
  g.run.babyBool = true;
  useActiveItem(g.p, CollectibleType.COLLECTIBLE_SPRINKLER);
});

// Zombie Baby
postNewRoomBabyFunctionMap.set(61, () => {
  for (const entity of getEntities()) {
    if (entity.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
      if (entity.Type === EntityType.ENTITY_BOIL) {
        // Delete Boils, because they are supposed to be rooted to the spot
        // and will look very buggy if they are moved
        entity.Remove();
      } else {
        // Teleport all friendly entities to where the player is
        entity.Position = g.p.Position;
      }
    }
  }
});

// Nerd Baby
postNewRoomBabyFunctionMap.set(90, () => {
  if (!g.r.IsClear()) {
    return;
  }

  // Locked doors in uncleared rooms
  // If the player leaves and re-enters an uncleared room, a normal door will stay locked
  // So, unlock all normal doors if the room is already clear
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (
      door !== undefined &&
      door.TargetRoomType === RoomType.ROOM_DEFAULT &&
      door.IsLocked()
    ) {
      door.TryUnlock(g.p, true); // This has to be forced
    }
  }
});

// Statue Baby 2
postNewRoomBabyFunctionMap.set(118, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();
  const center = g.r.GetCenterPos();

  if (roomType !== RoomType.ROOM_SECRET || !isFirstVisit) {
    return;
  }

  // Improved Secret Rooms
  for (let i = 0; i < 4; i++) {
    const position = g.r.FindFreePickupSpawnPosition(center, 1, true);
    g.run.randomSeed = nextSeed(g.run.randomSeed);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      position,
      Vector.Zero,
      undefined,
      0,
      g.run.randomSeed,
    );
  }
});

// Hopeless Baby
postNewRoomBabyFunctionMap.set(125, noHealth);

// Mohawk Baby
postNewRoomBabyFunctionMap.set(138, noHealth);

// Twin Baby
postNewRoomBabyFunctionMap.set(141, () => {
  // We don't want to teleport away from the first room
  // (the starting room does not count for the purposes of this variable)
  if (g.run.level.roomsEntered === 0) {
    return;
  }

  if (g.run.babyBool) {
    // We teleported to this room
    g.run.babyBool = false;
  } else {
    // We are entering a new room
    g.run.babyBool = true;
    useActiveItem(g.p, CollectibleType.COLLECTIBLE_TELEPORT_2);
  }
});

// Butterfly Baby
postNewRoomBabyFunctionMap.set(149, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();
  const center = g.r.GetCenterPos();

  if (roomType !== RoomType.ROOM_SUPERSECRET || !isFirstVisit) {
    return;
  }

  // Improved Super Secret Rooms
  const numSpawnedCollectibles = 5;
  for (let i = 0; i < numSpawnedCollectibles; i++) {
    const position = g.r.FindFreePickupSpawnPosition(center, 1, true);
    g.run.randomSeed = nextSeed(g.run.randomSeed);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      position,
      Vector.Zero,
      undefined,
      0,
      g.run.randomSeed,
    );
  }
});

// Spelunker Baby
postNewRoomBabyFunctionMap.set(181, () => {
  if (
    g.r.GetType() === RoomType.ROOM_DUNGEON &&
    // We want to be able to backtrack from a Black Market to a Crawlspace
    g.l.GetPreviousRoomIndex() !== GridRooms.ROOM_BLACK_MARKET_IDX
  ) {
    teleport(
      GridRooms.ROOM_BLACK_MARKET_IDX,
      Direction.NO_DIRECTION,
      RoomTransitionAnim.WALK,
    );
  }
});

// Fancy Baby
postNewRoomBabyFunctionMap.set(216, () => {
  const currentRoomIndex = g.l.GetCurrentRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();

  if (currentRoomIndex !== startingRoomIndex || !isFirstVisit) {
    return;
  }

  // Can purchase teleports to special rooms
  const positions = [
    [3, 1],
    [9, 1],
    [3, 5],
    [9, 5],
    [1, 1],
    [11, 1],
    [1, 5],
    [11, 5],
  ];
  let positionIndex = 0;

  // Find the special rooms on the floor
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const roomDesc = rooms.Get(i); // This is 0 indexed
    if (roomDesc === undefined) {
      continue;
    }
    const roomData = roomDesc.Data;
    if (roomData === undefined) {
      continue;
    }
    const roomType = roomData.Type;

    let itemID: CollectibleType | CollectibleTypeCustom =
      CollectibleType.COLLECTIBLE_NULL;
    let price = 0;

    switch (roomType) {
      // 2
      case RoomType.ROOM_SHOP: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT;
        price = 10;
        break;
      }

      // 4
      case RoomType.ROOM_TREASURE: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT;
        price = 10;
        break;
      }

      // 6
      case RoomType.ROOM_MINIBOSS: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT;
        price = 10;
        break;
      }

      // 9
      case RoomType.ROOM_ARCADE: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT;
        price = 10;
        break;
      }

      // 10
      case RoomType.ROOM_CURSE: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT;
        price = 10;
        break;
      }

      // 11
      case RoomType.ROOM_CHALLENGE: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT;
        price = 10;
        break;
      }

      // 12
      case RoomType.ROOM_LIBRARY: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT;
        price = 15;
        break;
      }

      // 13
      case RoomType.ROOM_SACRIFICE: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT;
        price = 10;
        break;
      }

      // 18
      case RoomType.ROOM_ISAACS: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT;
        price = 10;
        break;
      }

      // 19
      case RoomType.ROOM_BARREN: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT;
        price = 20;
        break;
      }

      // 20
      case RoomType.ROOM_CHEST: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT;
        price = 15;
        break;
      }

      // 21
      case RoomType.ROOM_DICE: {
        itemID = CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT;
        price = 10;
        break;
      }

      default: {
        break;
      }
    }

    if (itemID !== 0) {
      positionIndex += 1;
      if (positionIndex > positions.length) {
        log("Error: This floor has too many special rooms for Fancy Baby.");
        return;
      }
      const xy = positions[positionIndex];
      const position = gridToPos(xy[0], xy[1]);
      const pedestal = g.g
        .Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          position,
          Vector.Zero,
          undefined,
          itemID,
          g.run.room.seed,
        )
        .ToPickup();
      if (pedestal !== undefined) {
        pedestal.AutoUpdatePrice = false;
        pedestal.Price = price;
      }
    }
  }
});

// Beast Baby
postNewRoomBabyFunctionMap.set(242, () => {
  const currentRoomIndex = g.l.GetCurrentRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (currentRoomIndex !== startingRoomIndex) {
    useActiveItem(g.p, CollectibleType.COLLECTIBLE_D10);
  }
});

// Love Eye Baby
postNewRoomBabyFunctionMap.set(249, () => {
  const roomType = g.r.GetType();
  if (
    !g.run.babyBool ||
    roomType === RoomType.ROOM_BOSS ||
    roomType === RoomType.ROOM_DEVIL
  ) {
    // Make an exception for Boss Rooms and Devil Rooms
    return;
  }

  // Replace all of the existing enemies with the stored one
  for (const npc of getNPCs()) {
    // Make an exception for certain NPCs
    if (
      npc.Type === EntityType.ENTITY_SHOPKEEPER || // 17
      npc.Type === EntityType.ENTITY_FIREPLACE // 33
    ) {
      continue;
    }

    g.g.Spawn(
      g.run.babyNPC.type,
      g.run.babyNPC.variant,
      npc.Position,
      npc.Velocity,
      undefined,
      g.run.babyNPC.subType,
      npc.InitSeed,
    );
    npc.Remove();
  }
});

// Viking Baby
postNewRoomBabyFunctionMap.set(261, () => {
  if (g.r.GetType() !== RoomType.ROOM_SECRET) {
    return;
  }

  // Find the grid index of the Super Secret Room
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const roomDesc = rooms.Get(i); // This is 0 indexed
    if (roomDesc === undefined) {
      continue;
    }
    const roomIndex = roomDesc.SafeGridIndex; // This is always the top-left index
    const roomData = roomDesc.Data;
    if (roomData === undefined) {
      continue;
    }
    const roomType = roomData.Type;
    if (roomType === RoomType.ROOM_SUPERSECRET) {
      teleport(roomIndex);
      break;
    }
  }
});

// Ghost Baby 2
postNewRoomBabyFunctionMap.set(282, () => {
  // Constant Maw of the Void effect + flight
  g.p.SpawnMawOfVoid(30 * 60 * 60); // 1 hour
});

// Suit Baby
postNewRoomBabyFunctionMap.set(287, () => {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();

  // Ignore some special rooms
  if (
    !isFirstVisit ||
    roomType === RoomType.ROOM_DEFAULT || // 1
    roomType === RoomType.ROOM_ERROR || // 3
    roomType === RoomType.ROOM_BOSS || // 5
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL || // 15
    roomType === RoomType.ROOM_DUNGEON || // 16
    roomType === RoomType.ROOM_BOSSRUSH || // 17
    roomType === RoomType.ROOM_BLACK_MARKET // 22
  ) {
    return;
  }

  // All special rooms are Devil Rooms
  g.run.room.seed = nextSeed(g.run.room.seed);
  const collectibleType = g.itemPool.GetCollectible(
    ItemPoolType.POOL_DEVIL,
    true,
    g.run.room.seed,
  );
  const position = gridToPos(6, 4);
  const pedestal = g.g
    .Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      position,
      Vector.Zero,
      undefined,
      collectibleType,
      g.run.room.seed,
    )
    .ToPickup();
  if (pedestal !== undefined) {
    pedestal.AutoUpdatePrice = false;
    pedestal.Price = getCollectibleDevilHeartPrice(collectibleType, g.p);
  }

  // Spawn the Devil Statue
  g.r.SpawnGridEntity(52, GridEntityType.GRID_STATUE, 0, 0, 0);

  // Spawn the two fires
  for (let i = 0; i < 2; i++) {
    let pos: Vector;
    if (i === 0) {
      pos = gridToPos(3, 1);
    } else {
      pos = gridToPos(9, 1);
    }
    g.run.room.seed = nextSeed(g.run.room.seed);
    g.g.Spawn(
      EntityType.ENTITY_FIREPLACE,
      0,
      pos,
      Vector.Zero,
      undefined,
      0,
      g.run.room.seed,
    );
  }
});

// Woodsman Baby
postNewRoomBabyFunctionMap.set(297, () => {
  const currentRoomIndex = g.l.GetCurrentRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (currentRoomIndex === startingRoomIndex) {
    return;
  }

  openAllDoors();
});

// Twotone Baby
postNewRoomBabyFunctionMap.set(346, () => {
  useActiveItem(g.p, CollectibleType.COLLECTIBLE_DATAMINER);
});

// Mouse Baby
postNewRoomBabyFunctionMap.set(351, () => {
  const roomClear = g.r.IsClear();

  if (!roomClear) {
    return;
  }

  // Coin doors in uncleared rooms
  // If the player leaves and re-enters an uncleared room, a normal door will stay locked
  // So, unlock all normal doors if the room is already clear
  for (const door of getDoors()) {
    if (door.TargetRoomType === RoomType.ROOM_DEFAULT && door.IsLocked()) {
      door.TryUnlock(g.p, true); // This has to be forced
    }
  }
});

// Driver Baby
postNewRoomBabyFunctionMap.set(431, () => {
  // Slippery movement
  // Prevent softlocks from Gaping Maws and cheap damage by Broken Gaping Maws
  removeAllMatchingEntities(EntityType.ENTITY_GAPING_MAW);
  removeAllMatchingEntities(EntityType.ENTITY_BROKEN_GAPING_MAW);
});

// Gamer Baby
postNewRoomBabyFunctionMap.set(492, () => {
  const currentRoomIndex = g.l.GetCurrentRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  // Checking for starting room index can prevent crashes when reseeding happens
  if (currentRoomIndex !== startingRoomIndex) {
    g.p.UsePill(PillEffect.PILLEFFECT_RETRO_VISION, PillColor.PILL_NULL);
    // If we try to cancel the animation now, it will bug out the player such that they will not be
    // able to take pocket items or pedestal items
    // This still happens even if we cancel the animation in the PostUpdate callback,
    // so don't bother canceling it
  }
});

// Psychic Baby
postNewRoomBabyFunctionMap.set(504, () => {
  // Disable the vanilla shooting behavior
  const abels = getFamiliars(FamiliarVariant.ABEL);
  for (const abel of abels) {
    abel.FireCooldown = 1000000;
  }
});

// Silly Baby
postNewRoomBabyFunctionMap.set(516, () => {
  const currentRoomIndex = g.l.GetCurrentRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  // Checking for starting room index can prevent crashes when reseeding happens
  if (currentRoomIndex !== startingRoomIndex) {
    g.p.UsePill(PillEffect.PILLEFFECT_IM_EXCITED, PillColor.PILL_NULL);
    // If we try to cancel the animation now, it will bug out the player such that they will not be
    // able to take pocket items or pedestal items
    // This still happens even if we cancel the animation in the PostUpdate callback,
    // so don't bother canceling it
  }
});

// Brother Bobby
postNewRoomBabyFunctionMap.set(522, () => {
  const godheadTear = g.p.FireTear(
    g.p.Position,
    Vector.Zero,
    false,
    true,
    false,
  );
  godheadTear.TearFlags = TearFlags.TEAR_GLOW;
  godheadTear.SubType = 1;
  const sprite = godheadTear.GetSprite();
  sprite.Load("gfx/tear_blank.anm2", true);
  sprite.Play("RegularTear6", false);
});