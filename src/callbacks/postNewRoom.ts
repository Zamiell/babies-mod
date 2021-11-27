import {
  getRoomIndex,
  getRoomStageID,
  getRoomVariant,
  log,
} from "isaacscript-common";
import { updateCachedAPIFunctions } from "../cache";
import { NUM_SUCCUBI_IN_FLOCK } from "../constants";
import g from "../globals";
import { GlobalsRunBabyTears } from "../types/GlobalsRunBabyTears";
import { GlobalsRunRoom } from "../types/GlobalsRunRoom";
import { getCurrentBaby } from "../util";
import { postNewRoomBabyFunctionMap } from "./postNewRoomBabyFunctionMap";
import * as postRender from "./postRender";

export function main(): void {
  updateCachedAPIFunctions();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const roomIndex = getRoomIndex();

  log(
    `MC_POST_NEW_ROOM (Babies Mod) - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

  // Increment level variables
  g.run.level.roomsEntered += 1;
  if (roomIndex === startingRoomIndex && g.run.level.roomsEntered === 1) {
    // We don't want the starting room of the floor to count towards the rooms entered
    g.run.level.roomsEntered = 0;
  }

  // Reset room-related variables
  g.run.room = new GlobalsRunRoom(roomClear, roomSeed);

  // Reset baby-specific variables
  g.run.babyCountersRoom = 0;
  g.run.babyTears = new GlobalsRunBabyTears();

  // Handle items that are not tied to specific babies
  resetFlockOfSuccubi();

  // Do nothing if we are not a baby
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Reset the player's sprite, just in case it got messed up
  postRender.setPlayerSprite();

  stopDrawingBabyIntroText();
  applyBabyTemporaryEffects(babyType);
}

function stopDrawingBabyIntroText() {
  if (g.run.drawIntro) {
    g.run.drawIntro = false;
  }
}

function applyBabyTemporaryEffects(babyType: int) {
  const postNewRoomBabyFunction = postNewRoomBabyFunctionMap.get(babyType);
  if (postNewRoomBabyFunction !== undefined) {
    postNewRoomBabyFunction();
  }
}

function resetFlockOfSuccubi() {
  if (!g.run.flockOfSuccubi) {
    return;
  }

  g.run.flockOfSuccubi = false;
  for (let i = 0; i < NUM_SUCCUBI_IN_FLOCK; i++) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_SUCCUBUS);
  }
}
