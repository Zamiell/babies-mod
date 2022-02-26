import {
  getRoomStageID,
  getRoomVariant,
  log,
  repeat,
} from "isaacscript-common";
import { updateCachedAPIFunctions } from "../cache";
import { NUM_SUCCUBI_IN_FLOCK } from "../constants";
import g from "../globals";
import { GlobalsRunBabyTears } from "../types/GlobalsRunBabyTears";
import { GlobalsRunRoom } from "../types/GlobalsRunRoom";
import { getCurrentBaby } from "../utils";
import { postNewRoomBabyFunctionMap } from "./postNewRoomBabyFunctionMap";

export function main(): void {
  updateCachedAPIFunctions();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();

  log(
    `MC_POST_NEW_ROOM (Babies Mod) - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

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

  repeat(NUM_SUCCUBI_IN_FLOCK, () => {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_SUCCUBUS);
  });
}
