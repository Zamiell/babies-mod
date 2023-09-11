import { EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  game,
  getEntities,
  log,
  openAllDoors,
  removeGridEntity,
  spawn,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

const POOP_THRESHOLD_GAME_FRAMES = 15 * GAME_FRAMES_PER_SECOND;

const ISLAND_THRESHOLD_GAME_FRAMES = 30 * GAME_FRAMES_PER_SECOND;

const v = {
  room: {
    destroyedProblematicEntities: false,
    openedDoors: false,
  },
};

export class SoftlockPrevention extends BabyModFeature {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(): void {
    const babyType = getBabyType();
    const baby = babyType === undefined ? undefined : BABIES[babyType];
    if (baby === undefined) {
      return;
    }

    this.checkSoftlockDestroyPoopsTNT(baby);
    this.checkSoftlockIsland(baby);
  }

  /**
   * On certain babies, destroy all poops and TNT barrels after a certain amount of time to prevent
   * softlocks.
   */
  checkSoftlockDestroyPoopsTNT(baby: BabyDescription): void {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();

    if (baby.softlockPreventionDestroyPoops !== true) {
      return;
    }

    // Check to see if we already destroyed the problematic entities in the room.
    if (v.room.destroyedProblematicEntities) {
      return;
    }

    // Check to see if they have been in the room long enough.
    if (roomFrameCount < POOP_THRESHOLD_GAME_FRAMES) {
      return;
    }

    v.room.destroyedProblematicEntities = true;

    // Kill some entities in the room to prevent softlocks in some specific rooms.
    const fireplaces = getEntities(EntityType.FIREPLACE); // 33
    const poops = getEntities(EntityType.POOP); // 245
    const tnts = getEntities(EntityType.MOVABLE_TNT); // 292
    for (const entity of [...fireplaces, ...poops, ...tnts]) {
      entity.Kill();
    }

    log("Destroyed all fireplaces/poops/TNTs to prevent a softlock.");
  }

  /**
   * On certain babies, open the doors after 30 seconds to prevent softlocks with Hosts and island
   * enemies.
   */
  checkSoftlockIsland(baby: BabyDescription): void {
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
    if (roomFrameCount < ISLAND_THRESHOLD_GAME_FRAMES) {
      return;
    }

    v.room.openedDoors = true;
    room.SetClear(true);
    openAllDoors();

    log("Opened all doors to prevent a softlock.");
  }

  /** Poop entities are killable with directed light teams, while grid entity poops are not. */
  @CallbackCustom(ModCallbackCustom.POST_POOP_UPDATE)
  postPoopUpdate(poop: GridEntityPoop): void {
    const babyType = getBabyType();
    const baby: BabyDescription | undefined =
      babyType === undefined ? undefined : BABIES[babyType];
    if (baby !== undefined && baby.softlockPreventionDestroyPoops === true) {
      removeGridEntity(poop, false);
      spawn(EntityType.POOP, 0, 0, poop.Position);
    }
  }

  /** Movable TNT is killable with directed light teams, while normal TNT is not. */
  @CallbackCustom(ModCallbackCustom.POST_TNT_UPDATE)
  postTNTUpdate(tnt: GridEntityTNT): void {
    const babyType = getBabyType();
    const baby: BabyDescription | undefined =
      babyType === undefined ? undefined : BABIES[babyType];
    if (baby !== undefined && baby.softlockPreventionDestroyPoops === true) {
      removeGridEntity(tnt, false);
      spawn(EntityType.MOVABLE_TNT, 0, 0, tnt.Position);
    }
  }
}
