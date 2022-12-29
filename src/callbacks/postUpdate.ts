import {
  CollectibleType,
  GridEntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  GAME_FRAMES_PER_SECOND,
  getGridEntities,
  log,
  openAllDoors,
} from "isaacscript-common";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postUpdateBabyFunctionMap } from "./postUpdateBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // Do custom baby effects.
  const postUpdateBabyFunction = postUpdateBabyFunctionMap.get(babyType);
  if (postUpdateBabyFunction !== undefined) {
    postUpdateBabyFunction();
  }

  checkSoftlockDestroyPoops();
  checkSoftlockIsland();
  checkTrapdoor();
}

// On certain babies, destroy all poops and TNT barrels after a certain amount of time to prevent
// softlocks.
function checkSoftlockDestroyPoops() {
  const roomFrameCount = g.r.GetFrameCount();
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // Check to see if this baby needs the softlock prevention.
  if (baby.softlockPreventionDestroyPoops === undefined) {
    return;
  }

  // Check to see if we already destroyed the grid entities in the room.
  if (g.run.room.softlock) {
    return;
  }

  // Check to see if they have been in the room long enough.
  const secondsThreshold = 15;
  if (roomFrameCount < secondsThreshold * GAME_FRAMES_PER_SECOND) {
    return;
  }

  g.run.room.softlock = true;

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

// On certain babies, open the doors after 30 seconds to prevent softlocks with Hosts and island
// enemies.
function checkSoftlockIsland() {
  const roomFrameCount = g.r.GetFrameCount();
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // Check to see if this baby needs the softlock prevention.
  if (baby.softlockPreventionIsland === undefined) {
    return;
  }

  // Check to see if we already opened the doors in the room.
  if (g.run.room.softlock) {
    return;
  }

  // Check to see if they have been in the room long enough.
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
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // If this baby gives a mapping item, we cannot wait until the next floor to remove it because its
  // effect will have already been applied So, we need to monitor for the trapdoor animation.
  if (
    !playerSprite.IsPlaying("Trapdoor") &&
    !playerSprite.IsPlaying("Trapdoor2") &&
    !playerSprite.IsPlaying("LightTravel")
  ) {
    return;
  }

  // 21
  if (
    baby.item === CollectibleType.COMPASS ||
    baby.item2 === CollectibleType.COMPASS
  ) {
    g.p.RemoveCollectible(CollectibleType.COMPASS);
  }

  // 54
  if (
    baby.item === CollectibleType.TREASURE_MAP ||
    baby.item2 === CollectibleType.TREASURE_MAP
  ) {
    g.p.RemoveCollectible(CollectibleType.TREASURE_MAP);
  }

  // 246
  if (
    baby.item === CollectibleType.BLUE_MAP ||
    baby.item2 === CollectibleType.BLUE_MAP
  ) {
    g.p.RemoveCollectible(CollectibleType.BLUE_MAP);
  }

  // 333
  if (
    baby.item === CollectibleType.MIND ||
    baby.item2 === CollectibleType.MIND
  ) {
    g.p.RemoveCollectible(CollectibleType.MIND);
  }
}
