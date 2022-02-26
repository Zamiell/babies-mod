import {
  GAME_FRAMES_PER_SECOND,
  getGridEntities,
  log,
  openAllDoors,
} from "isaacscript-common";
import g from "../globals";
import { roomClearedBabyFunctionMap } from "../roomClearedBabyFunctionMap";
import { getCurrentBaby } from "../utils";
import { postUpdateBabyFunctionMap } from "./postUpdateBabyFunctionMap";

export function main(): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  checkRoomCleared();

  // Do custom baby effects
  const postUpdateBabyFunction = postUpdateBabyFunctionMap.get(babyType);
  if (postUpdateBabyFunction !== undefined) {
    postUpdateBabyFunction();
  }

  checkSoftlockDestroyPoops();
  checkSoftlockIsland();
  checkTrapdoor();
}

// Certain babies do things if the room is cleared
function checkRoomCleared() {
  const roomClear = g.r.IsClear();

  // Check the clear status of the room and compare it to what it was a frame ago
  if (roomClear === g.run.room.clearState) {
    return;
  }

  g.run.room.clearState = roomClear;

  if (!roomClear) {
    return;
  }

  roomCleared();
}

function roomCleared() {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const roomClearedBabyFunction = roomClearedBabyFunctionMap.get(babyType);
  if (roomClearedBabyFunction !== undefined) {
    roomClearedBabyFunction();
  }
}

// On certain babies, destroy all poops and TNT barrels after a certain amount of time to prevent
// softlocks
function checkSoftlockDestroyPoops() {
  const roomFrameCount = g.r.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Check to see if this baby needs the softlock prevention
  if (baby.softlockPreventionDestroyPoops === undefined) {
    return;
  }

  // Check to see if we already destroyed the grid entities in the room
  if (g.run.room.softlock) {
    return;
  }

  // Check to see if they have been in the room long enough
  const secondsThreshold = 15;
  if (roomFrameCount < secondsThreshold * GAME_FRAMES_PER_SECOND) {
    return;
  }

  g.run.room.softlock = true;

  // Kill some grid entities in the room to prevent softlocks in some specific rooms
  // (fireplaces will not cause softlocks since they are killable with The Candle)
  const gridEntities = getGridEntities(
    GridEntityType.GRID_TNT, // 12
    GridEntityType.GRID_POOP, // 14
  );
  for (const gridEntity of gridEntities) {
    gridEntity.Destroy(true);
  }

  log("Destroyed all poops & TNT barrels to prevent a softlock.");
}

// On certain babies, open the doors after 30 seconds to prevent softlocks with Hosts and island
// enemies
function checkSoftlockIsland() {
  const roomFrameCount = g.r.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Check to see if this baby needs the softlock prevention
  if (baby.softlockPreventionIsland === undefined) {
    return;
  }

  // Check to see if we already opened the doors in the room
  if (g.run.room.softlock) {
    return;
  }

  // Check to see if they have been in the room long enough
  const secondsThreshold = 30;
  if (roomFrameCount < secondsThreshold * GAME_FRAMES_PER_SECOND) {
    return;
  }

  g.run.room.softlock = true;
  g.r.SetClear(true);
  openAllDoors();
}

function checkTrapdoor() {
  const playerSprite = g.p.GetSprite();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // If this baby gives a mapping item, we cannot wait until the next floor to remove it because its
  // effect will have already been applied
  // So, we need to monitor for the trapdoor animation
  if (
    !playerSprite.IsPlaying("Trapdoor") &&
    !playerSprite.IsPlaying("Trapdoor2") &&
    !playerSprite.IsPlaying("LightTravel")
  ) {
    return;
  }

  // 21
  if (
    baby.item === CollectibleType.COLLECTIBLE_COMPASS ||
    baby.item2 === CollectibleType.COLLECTIBLE_COMPASS
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_COMPASS);
  }

  // 54
  if (
    baby.item === CollectibleType.COLLECTIBLE_TREASURE_MAP ||
    baby.item2 === CollectibleType.COLLECTIBLE_TREASURE_MAP
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP);
  }

  // 246
  if (
    baby.item === CollectibleType.COLLECTIBLE_BLUE_MAP ||
    baby.item2 === CollectibleType.COLLECTIBLE_BLUE_MAP
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_BLUE_MAP);
  }

  // 333
  if (
    baby.item === CollectibleType.COLLECTIBLE_MIND ||
    baby.item2 === CollectibleType.COLLECTIBLE_MIND
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_MIND);
  }
}
