import { CollectibleType, GridEntityType } from "isaac-typescript-definitions";
import {
  GAME_FRAMES_PER_SECOND,
  getGridEntities,
  log,
  ModCallbackCustom,
  openAllDoors,
} from "isaacscript-common";
import { g } from "../globals";
import { mod } from "../mod";
import { BabyDescription } from "../types/BabyDescription";
import { isValidRandomBabyPlayer } from "../utils";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED, main);
}

function main(player: EntityPlayer) {
  if (!isValidRandomBabyPlayer(player)) {
    return;
  }

  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  checkSoftlockDestroyPoopsTNT(baby);
  checkSoftlockIsland(baby);
  checkTrapdoor(player, baby);
}

/**
 * On certain babies, destroy all poops and TNT barrels after a certain amount of time to prevent
 * softlocks.
 */
function checkSoftlockDestroyPoopsTNT(baby: BabyDescription) {
  const roomFrameCount = g.r.GetFrameCount();

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

/**
 * On certain babies, open the doors after 30 seconds to prevent softlocks with Hosts and island
 * enemies.
 */
function checkSoftlockIsland(baby: BabyDescription) {
  const roomFrameCount = g.r.GetFrameCount();

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

  log("Opened all doors to prevent a softlock.");
}

/**
 * If this baby gives a mapping item, we cannot wait until the next floor to remove it because its
 * effect will have already been applied So, we need to monitor for the trapdoor animation.
 */
function checkTrapdoor(player: EntityPlayer, baby: BabyDescription) {
  const playerSprite = player.GetSprite();

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
    player.RemoveCollectible(CollectibleType.COMPASS);
  }

  // 54
  if (
    baby.item === CollectibleType.TREASURE_MAP ||
    baby.item2 === CollectibleType.TREASURE_MAP
  ) {
    player.RemoveCollectible(CollectibleType.TREASURE_MAP);
  }

  // 246
  if (
    baby.item === CollectibleType.BLUE_MAP ||
    baby.item2 === CollectibleType.BLUE_MAP
  ) {
    player.RemoveCollectible(CollectibleType.BLUE_MAP);
  }

  // 333
  if (
    baby.item === CollectibleType.MIND ||
    baby.item2 === CollectibleType.MIND
  ) {
    player.RemoveCollectible(CollectibleType.MIND);
  }
}
