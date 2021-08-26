import g from "./globals";
import log from "./log";
import { getCurrentBaby, getItemMaxCharges } from "./misc";

export function postUpdate(): void {
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const roomClear = g.r.IsClear();

  // Pseudo room clear should only work in certain room types
  if (
    roomType === RoomType.ROOM_BOSS || // 5
    roomType === RoomType.ROOM_CHALLENGE || // 11
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL || // 15
    roomType === RoomType.ROOM_DUNGEON || // 16
    roomType === RoomType.ROOM_BOSSRUSH || // 17
    roomType === RoomType.ROOM_BLACK_MARKET // 22
  ) {
    return;
  }

  // We need to wait for the room to initialize before enabling the pseudo clear feature
  if (roomFrameCount === 0) {
    return;
  }

  // Customize the doors and initiate the pseudo clear feature
  // (this does not work in the PostNewRoom callback or on frame 0)
  if (roomFrameCount === 1 && !roomClear) {
    initializeDoors();
    return;
  }

  checkPseudoClear();
}

function initializeDoors() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  g.r.SetClear(true);
  g.run.room.pseudoClear = false;
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (
      door !== null &&
      (door.TargetRoomType === RoomType.ROOM_DEFAULT || // 0
        door.TargetRoomType === RoomType.ROOM_MINIBOSS || // 6
        door.TargetRoomType === RoomType.ROOM_SACRIFICE) // 13
    ) {
      // Keep track of which doors we lock for later
      g.run.room.doorsModified.push(i);

      // Modify the door
      if (baby.name === "Black Baby") {
        // 27
        door.SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_CURSE);
        door.Open();
      } else if (baby.name === "Nerd Baby") {
        // 90
        door.SetLocked(true);
      } else if (baby.name === "Mouse Baby") {
        // 351
        door.SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_SHOP);
        door.SetLocked(true);
      }
    }
  }
}

function checkPseudoClear() {
  const gameFrameCount = g.g.GetFrameCount();

  // Don't do anything if the room is already cleared
  if (g.run.room.pseudoClear) {
    return;
  }

  // If a frame has passed since an enemy died, reset the delay counter
  if (
    g.run.room.clearDelayFrame !== 0 &&
    gameFrameCount >= g.run.room.clearDelayFrame
  ) {
    g.run.room.clearDelayFrame = 0;
  }

  if (
    getNumAliveNPCs() === 0 &&
    g.run.room.clearDelayFrame === 0 &&
    checkAllPressurePlatesPushed() &&
    gameFrameCount > 1 // To prevent miscellaneous bugs
  ) {
    clearRoom();
  }
}

function getNumAliveNPCs() {
  let numAliveEnemies = 0;
  for (const entity of Isaac.GetRoomEntities()) {
    const npc = entity.ToNPC();
    if (
      npc !== null &&
      npc.CanShutDoors && // This is a battle NPC
      !npc.IsDead() &&
      (npc.Type !== EntityType.ENTITY_RAGLING ||
        npc.Variant !== 1 ||
        npc.State !== NpcState.STATE_UNIQUE_DEATH) && // Rag Man Raglings don't actually die
      !isAttachedNPC(npc)
    ) {
      numAliveEnemies += 1;
    }
  }

  return numAliveEnemies;
}

// This code is copied from Racing+
function isAttachedNPC(npc: EntityNPC) {
  // These are NPCs that have "CanShutDoors" equal to true naturally by the game,
  // but shouldn't actually keep the doors closed
  return (
    // My Shadow (23.0.1)
    // These are the black worms generated by My Shadow; they are similar to charmed enemies,
    // but do not actually have the "charmed" flag set,
    // so we don't want to add them to the "aliveEnemies" table
    (npc.Type === EntityType.ENTITY_CHARGER &&
      npc.Variant === 0 &&
      npc.SubType === 1) ||
    // Chubber Projectile (39.22)
    // (needed because Fistuloids spawn them on death)
    (npc.Type === EntityType.ENTITY_VIS && npc.Variant === 22) ||
    // Death Scythe (66.10)
    (npc.Type === EntityType.ENTITY_DEATH && npc.Variant === 10) ||
    // Peep Eye (68.10)
    (npc.Type === EntityType.ENTITY_PEEP && npc.Variant === 10) ||
    // Bloat Eye (68.11)
    (npc.Type === EntityType.ENTITY_PEEP && npc.Variant === 11) ||
    // Begotten Chain (251.10)
    (npc.Type === EntityType.ENTITY_BEGOTTEN && npc.Variant === 10) ||
    // Mama Gurdy Left Hand (266.1)
    (npc.Type === EntityType.ENTITY_MAMA_GURDY && npc.Variant === 1) ||
    // Mama Gurdy Right Hand (266.2)
    (npc.Type === EntityType.ENTITY_MAMA_GURDY && npc.Variant === 2) ||
    // Small Hole (411.1)
    (npc.Type === EntityType.ENTITY_BIG_HORN && npc.Variant === 1) ||
    // Big Hole (411.2)
    (npc.Type === EntityType.ENTITY_BIG_HORN && npc.Variant === 2)
  );
}

function checkAllPressurePlatesPushed() {
  // If we are in a puzzle room, check to see if all of the plates have been pressed
  if (!g.r.HasTriggerPressurePlates() || g.run.room.buttonsPushed) {
    return true;
  }

  // Check all the grid entities in the room
  const gridSize = g.r.GetGridSize();
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (
        saveState.Type === GridEntityType.GRID_PRESSURE_PLATE &&
        saveState.State !== 3
      ) {
        return false;
      }
    }
  }

  g.run.room.buttonsPushed = true;
  return true;
}

// This roughly emulates what happens when you normally clear a room
function clearRoom() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }
  const player0 = Isaac.GetPlayer();

  g.run.room.pseudoClear = true;
  log("Room is now pseudo-cleared.");

  // This takes into account their luck and so forth
  g.r.SpawnClearAward();

  // Reset all of the doors that we previously modified
  for (const doorNum of g.run.room.doorsModified) {
    const door = g.r.GetDoor(doorNum);
    if (door === null) {
      continue;
    }

    if (baby.name === "Black Baby") {
      // 27
      door.SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_DEFAULT);
    } else if (baby.name === "Nerd Baby") {
      // 90
      door.TryUnlock(player0, true); // This has to be forced
    } else if (baby.name === "Mouse Baby") {
      // 351
      door.TryUnlock(player0, true); // This has to be forced
    }
  }

  // Give a charge to the player's active item
  // (and handle co-op players, if present)
  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player === null) {
      continue;
    }
    const activeItem = player.GetActiveItem();
    const activeCharge = player.GetActiveCharge();
    const batteryCharge = player.GetBatteryCharge();
    const activeItemMaxCharges = getItemMaxCharges(activeItem);

    if (player.NeedsCharge()) {
      // Find out if we are in a 2x2 or L room
      let chargesToAdd = 1;
      const shape = g.r.GetRoomShape();
      if (shape >= 8) {
        // L rooms and 2x2 rooms should grant 2 charges
        chargesToAdd = 2;
      } else if (
        player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
        activeCharge === activeItemMaxCharges - 2
      ) {
        // The AAA Battery grants an extra charge when the active item is one away from being fully
        // charged
        chargesToAdd = 2;
      } else if (
        player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
        activeCharge === activeItemMaxCharges &&
        player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) &&
        batteryCharge === activeItemMaxCharges - 2
      ) {
        // The AAA Battery should grant an extra charge when the active item is one away from being
        // fully charged
        // with The Battery (this is bugged in vanilla for The Battery)
        chargesToAdd = 2;
      }

      // Add the correct amount of charges
      const currentCharge = player.GetActiveCharge();
      player.SetActiveCharge(currentCharge + chargesToAdd);
    }
  }

  // Play the sound effect for the doors opening
  // (but there are no doors in a crawlspace)
  if (g.r.GetType() !== RoomType.ROOM_DUNGEON) {
    g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN, 1, 0);
  }
}