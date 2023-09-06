import { GridEntityType } from "isaac-typescript-definitions";
import {
  game,
  GAME_FRAMES_PER_SECOND,
  getGridEntities,
  log,
  openAllDoors,
} from "isaacscript-common";
import type { BabyDescription } from "../interfaces/BabyDescription";
import { mod } from "../mod";

const v = {
  room: {
    destroyedGridEntities: false,
    openedDoors: false,
  },
};

export function softlockPreventionInit(): void {
  mod.saveDataManager("softlockPrevention", v);
}

export function softlockPreventionPostPEffectUpdateReordered(
  baby: BabyDescription,
): void {
  checkSoftlockDestroyPoopsTNT(baby);
  checkSoftlockIsland(baby);
}

/**
 * On certain babies, destroy all poops and TNT barrels after a certain amount of time to prevent
 * softlocks.
 */
function checkSoftlockDestroyPoopsTNT(baby: BabyDescription) {
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();

  if (baby.softlockPreventionDestroyPoops !== true) {
    return;
  }

  // Check to see if we already destroyed the grid entities in the room.
  if (v.room.destroyedGridEntities) {
    return;
  }

  // Check to see if they have been in the room long enough.
  const secondsThreshold = 15;
  if (roomFrameCount < secondsThreshold * GAME_FRAMES_PER_SECOND) {
    return;
  }

  v.room.destroyedGridEntities = true;

  // Kill some grid entities in the room to prevent softlocks in some specific rooms. (Fireplaces
  // will not cause softlocks since they are killable with The Candle.)
  const gridEntities = getGridEntities(
    GridEntityType.TNT, // 12
    GridEntityType.POOP, // 14
  );
  for (const gridEntity of gridEntities) {
    gridEntity.Destroy(true);
  }

  log("Destroyed all poops & TNT barrels to prevent a softlock.");
}

/**
 * On certain babies, open the doors after 30 seconds to prevent softlocks with Hosts and island
 * enemies.
 */
function checkSoftlockIsland(baby: BabyDescription) {
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();

  // Check to see if this baby needs the softlock prevention.
  if (baby.softlockPreventionIsland === undefined) {
    return;
  }

  // Check to see if we already opened the doors in the room.
  if (v.room.openedDoors) {
    return;
  }

  // Check to see if they have been in the room long enough.
  const secondsThreshold = 30;
  if (roomFrameCount < secondsThreshold * GAME_FRAMES_PER_SECOND) {
    return;
  }

  v.room.openedDoors = true;
  room.SetClear(true);
  openAllDoors();

  log("Opened all doors to prevent a softlock.");
}
