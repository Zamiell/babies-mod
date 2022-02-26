import {
  getDoors,
  getNPCs,
  isAliveExceptionNPC,
  isAllPressurePlatesPushed,
  log,
} from "isaacscript-common";
import g from "./globals";
import { getCurrentBaby } from "./utils";

// Pseudo room clear should be disabled in certain room types
const ROOM_TYPE_BLACKLIST: ReadonlySet<RoomType> = new Set([
  RoomType.ROOM_BOSS, // 5
  RoomType.ROOM_CHALLENGE, // 11
  RoomType.ROOM_DEVIL, // 14
  RoomType.ROOM_ANGEL, // 15
  RoomType.ROOM_DUNGEON, // 16
  RoomType.ROOM_BOSSRUSH, // 17
  RoomType.ROOM_BLACK_MARKET, // 22
]);

// ModCallbacks.MC_POST_UPDATE (1)
// (only called from certain babies)
export function postUpdate(): void {
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const roomClear = g.r.IsClear();

  if (ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  // We need to wait for the room to initialize before enabling the pseudo clear feature
  if (roomFrameCount < 1) {
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

  const normalLookingDoors = getDoors(
    RoomType.ROOM_DEFAULT, // 0
    RoomType.ROOM_MINIBOSS, // 6
  );
  for (const door of normalLookingDoors) {
    // Keep track of which doors we lock for later
    g.run.room.doorSlotsModified.push(door.Slot);

    // Modify the door
    switch (baby.name) {
      // 27
      case "Black Baby": {
        door.SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_CURSE);
        door.Open();
        break;
      }

      // 90
      case "Nerd Baby": {
        door.SetLocked(true);
        break;
      }

      // 351
      case "Mouse Baby": {
        door.SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_SHOP);
        door.SetLocked(true);
        break;
      }

      default: {
        break;
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
    g.run.room.clearDelayFrame !== null &&
    gameFrameCount >= g.run.room.clearDelayFrame
  ) {
    g.run.room.clearDelayFrame = null;
  }

  if (
    g.run.room.clearDelayFrame === null &&
    !areAnyNPCsAlive() &&
    isAllPressurePlatesPushed()
  ) {
    pseudoClearRoom();
  }
}

function areAnyNPCsAlive() {
  for (const npc of getNPCs()) {
    if (
      npc.CanShutDoors && // This is a battle NPC
      !npc.IsDead() &&
      !isAliveExceptionNPC(npc)
    ) {
      return true;
    }
  }

  return false;
}

// This roughly emulates what happens when you normally clear a room
function pseudoClearRoom() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  g.run.room.pseudoClear = true;
  log("Room is now pseudo-cleared.");

  g.r.TriggerClear();
  // (we already set the clear state of the room to be true)

  // Reset all of the doors that we previously modified
  for (const doorSlot of g.run.room.doorSlotsModified) {
    const door = g.r.GetDoor(doorSlot);
    if (door === undefined) {
      continue;
    }

    switch (baby.name) {
      // 27
      case "Black Baby": {
        door.SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_DEFAULT);
        break;
      }

      // 90
      case "Nerd Baby": {
        door.TryUnlock(g.p, true); // This has to be forced
        break;
      }

      // 351
      case "Mouse Baby": {
        door.TryUnlock(g.p, true); // This has to be forced
        break;
      }

      default: {
        break;
      }
    }
  }
}
