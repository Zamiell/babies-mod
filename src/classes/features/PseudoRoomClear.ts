import type { DoorSlot } from "isaac-typescript-definitions";
import { ModCallback, RoomType } from "isaac-typescript-definitions";
import {
  Callback,
  ReadonlySet,
  game,
  getDoors,
  getNPCs,
  isAliveExceptionNPC,
  isAllPressurePlatesPushed,
  isBeforeRoomFrame,
  log,
  onOrAfterGameFrame,
  onRoomFrame,
} from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { BabyModFeature } from "../BabyModFeature";

// Pseudo room clear should be disabled in certain room types.
const ROOM_TYPE_BLACKLIST = new ReadonlySet<RoomType>([
  RoomType.BOSS, // 5
  RoomType.CHALLENGE, // 11
  RoomType.DEVIL, // 14
  RoomType.ANGEL, // 15
  RoomType.DUNGEON, // 16
  RoomType.BOSS_RUSH, // 17
  RoomType.BLACK_MARKET, // 22
]);

const NORMAL_LOOKING_DOOR_ROOM_TYPES = [
  RoomType.DEFAULT, // 1
  RoomType.MINI_BOSS, // 6
] as const;

const v = {
  room: {
    pseudoClear: true,
    doorSlotsModified: [] as DoorSlot[],
    clearDelayGameFrame: null as int | null,
  },
};

export class PseudoRoomClear extends BabyModFeature {
  v = v;

  // 58
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    // We only care if an enemy dies.
    const npc = entity.ToNPC();
    if (npc === undefined) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();

    // We don't want to clear the room too fast after an enemy dies.
    v.room.clearDelayGameFrame = gameFrameCount + 1;
  }
}

/**
 * This function is only called from certain babies.
 *
 * If the player leaves and re-enters an uncleared room, a normal door will stay locked. So, we need
 * to unlock all normal doors if the room is already clear.
 */
// ModCallbackCustom.POST_NEW_ROOM_REORDERED
export function pseudoRoomClearPostNewRoomReordered(): void {
  const room = game.GetRoom();
  const roomClear = room.IsClear();
  if (!roomClear) {
    return;
  }

  // We don't want to filter for `PlayerTypeCustom.RANDOM_BABY` because the player could be e.g.
  // Dark Judas.
  const player = Isaac.GetPlayer();

  const normalLookingDoors = getDoors(...NORMAL_LOOKING_DOOR_ROOM_TYPES);
  const lockedDoors = normalLookingDoors.filter((door) => door.IsLocked());
  for (const door of lockedDoors) {
    door.TryUnlock(player, true); // This has to be forced.
  }
}

/** This function is only called from certain babies. */
// ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED
export function pseudoRoomClearPostPEffectUpdateReordered(
  player: EntityPlayer,
  babyType: RandomBabyType,
): void {
  const room = game.GetRoom();
  const roomType = room.GetType();
  const roomClear = room.IsClear();

  if (ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  // We need to wait for the room to initialize before enabling the pseudo clear feature.
  if (isBeforeRoomFrame(1)) {
    return;
  }

  // Customize the doors and initiate the pseudo clear feature. (This does not work in the
  // `POST_NEW_ROOM` callback or on frame 0.)
  if (onRoomFrame(1) && !roomClear) {
    initializeDoors(babyType);
    return;
  }

  checkPseudoClear(player, babyType);
}

function initializeDoors(babyType: RandomBabyType) {
  const room = game.GetRoom();

  room.SetClear(true);
  v.room.pseudoClear = false;

  const normalLookingDoors = getDoors(
    RoomType.DEFAULT, // 0
    RoomType.MINI_BOSS, // 6
  );
  for (const door of normalLookingDoors) {
    // Keep track of which doors we lock for later.
    v.room.doorSlotsModified.push(door.Slot);

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
        door.SetLocked(true); // This has to come before setting the room type.
        door.SetRoomTypes(door.CurrentRoomType, RoomType.SHOP);
        break;
      }

      default: {
        break;
      }
    }
  }
}

function checkPseudoClear(player: EntityPlayer, babyType: RandomBabyType) {
  // Don't do anything if the room is already cleared.
  if (v.room.pseudoClear) {
    return;
  }

  // If a frame has passed since an enemy died, reset the delay counter.
  if (
    v.room.clearDelayGameFrame !== null
    && onOrAfterGameFrame(v.room.clearDelayGameFrame)
  ) {
    v.room.clearDelayGameFrame = null;
  }

  if (
    v.room.clearDelayGameFrame === null
    && !areAnyNPCsAlive()
    && isAllPressurePlatesPushed()
  ) {
    pseudoClearRoom(player, babyType);
  }
}

function areAnyNPCsAlive() {
  const npcs = getNPCs();
  return npcs.some(
    (npc) =>
      npc.CanShutDoors // This is a battle NPC.
      && !npc.IsDead()
      && !isAliveExceptionNPC(npc),
  );
}

/** This roughly emulates what happens when you normally clear a room. */
function pseudoClearRoom(player: EntityPlayer, babyType: RandomBabyType) {
  const room = game.GetRoom();

  v.room.pseudoClear = true;
  log("Room is now pseudo-cleared.");

  room.TriggerClear();
  // (We already set the clear state of the room to be true.)

  // Reset all of the doors that we previously modified.
  for (const doorSlot of v.room.doorSlotsModified) {
    const door = room.GetDoor(doorSlot);
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
        door.TryUnlock(player, true); // This has to be forced.
        break;
      }

      // 351
      case RandomBabyType.MOUSE: {
        door.TryUnlock(player, true); // This has to be forced.
        break;
      }

      default: {
        break;
      }
    }
  }
}
