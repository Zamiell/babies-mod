import { RoomType } from "isaac-typescript-definitions";
import {
  game,
  getDoors,
  getNPCs,
  isAliveExceptionNPC,
  isAllPressurePlatesPushed,
  log,
} from "isaacscript-common";
import { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import { getCurrentBaby } from "./utilsBaby";

// Pseudo room clear should be disabled in certain room types.
const ROOM_TYPE_BLACKLIST: ReadonlySet<RoomType> = new Set([
  RoomType.BOSS, // 5
  RoomType.CHALLENGE, // 11
  RoomType.DEVIL, // 14
  RoomType.ANGEL, // 15
  RoomType.DUNGEON, // 16
  RoomType.BOSS_RUSH, // 17
  RoomType.BLACK_MARKET, // 22
]);

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  // This function is only called from certain babies.
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const roomClear = g.r.IsClear();

  if (ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  // We need to wait for the room to initialize before enabling the pseudo clear feature.
  if (roomFrameCount < 1) {
    return;
  }

  // Customize the doors and initiate the pseudo clear feature. (This does not work in the
  // `POST_NEW_ROOM` callback or on frame 0.)
  if (roomFrameCount === 1 && !roomClear) {
    initializeDoors();
    return;
  }

  checkPseudoClear();
}

function initializeDoors() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  g.r.SetClear(true);
  g.run.room.pseudoClear = false;

  const normalLookingDoors = getDoors(
    RoomType.DEFAULT, // 0
    RoomType.MINI_BOSS, // 6
  );
  for (const door of normalLookingDoors) {
    // Keep track of which doors we lock for later.
    g.run.room.doorSlotsModified.push(door.Slot);

    // Modify the door.
    switch (babyType) {
      // 27
      case RandomBabyType.BLACK: {
        door.SetRoomTypes(door.CurrentRoomType, RoomType.CURSE);
        door.Open();
        break;
      }

      // 90
      case RandomBabyType.NERD: {
        door.SetLocked(true);
        break;
      }

      // 351
      case RandomBabyType.MOUSE: {
        door.SetRoomTypes(door.CurrentRoomType, RoomType.SHOP);
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
  const gameFrameCount = game.GetFrameCount();

  // Don't do anything if the room is already cleared.
  if (g.run.room.pseudoClear) {
    return;
  }

  // If a frame has passed since an enemy died, reset the delay counter.
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

// This roughly emulates what happens when you normally clear a room.
function pseudoClearRoom() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  g.run.room.pseudoClear = true;
  log("Room is now pseudo-cleared.");

  g.r.TriggerClear();
  // (We already set the clear state of the room to be true.)

  // Reset all of the doors that we previously modified.
  for (const doorSlot of g.run.room.doorSlotsModified) {
    const door = g.r.GetDoor(doorSlot);
    if (door === undefined) {
      continue;
    }

    switch (babyType) {
      // 27
      case RandomBabyType.BLACK: {
        door.SetRoomTypes(door.CurrentRoomType, RoomType.DEFAULT);
        break;
      }

      // 90
      case RandomBabyType.NERD: {
        door.TryUnlock(g.p, true); // This has to be forced
        break;
      }

      // 351
      case RandomBabyType.MOUSE: {
        door.TryUnlock(g.p, true); // This has to be forced
        break;
      }

      default: {
        break;
      }
    }
  }
}
