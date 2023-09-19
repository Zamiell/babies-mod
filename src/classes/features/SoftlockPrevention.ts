import {
  EntityType,
  GridEntityXMLType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  game,
  isGridEntityXMLType,
  isPoopGridEntityXMLType,
  log,
  openAllDoors,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

const ISLAND_THRESHOLD_GAME_FRAMES = 30 * GAME_FRAMES_PER_SECOND;

const v = {
  room: {
    openedDoors: false,
  },
};

export class SoftlockPrevention extends BabyModFeature {
  v = v;

  /** We remove all fireplaces so that they don't interfere. */
  @Callback(ModCallback.POST_NPC_INIT, EntityType.FIREPLACE)
  postNPCInitFireplace(npc: EntityNPC): void {
    npc.Remove();
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(): void {
    const babyType = getBabyType();
    if (babyType === undefined) {
      return;
    }
    const baby = BABIES[babyType];

    this.checkSoftlockIsland(baby);
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

  /**
   * - Poop entities are killable with directed light teams, while grid entity poops are not.
   * - Movable TNT is killable with directed light teams, while normal TNT is not.
   */
  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(
    entityTypeOrGridEntityXMLType: EntityType | GridEntityXMLType,
    _variant: int,
    _subType: int,
    _gridIndex: int,
    _seed: Seed,
  ): [EntityType | GridEntityXMLType, int, int] | undefined {
    if (!isGridEntityXMLType(entityTypeOrGridEntityXMLType)) {
      return;
    }

    const babyType = getBabyType();
    if (babyType === undefined) {
      return;
    }

    const baby: BabyDescription = BABIES[babyType];
    if (baby.softlockPreventionRemoveFires !== true) {
      return;
    }

    if (entityTypeOrGridEntityXMLType === GridEntityXMLType.TNT) {
      return [EntityType.MOVABLE_TNT, 0, 0];
    }

    if (isPoopGridEntityXMLType(entityTypeOrGridEntityXMLType)) {
      return [EntityType.POOP, 0, 0];
    }

    return undefined;
  }
}
