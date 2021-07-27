import g from "../globals";
import log, { crashLog } from "../log";
import { getCurrentBaby, getRoomIndex } from "../misc";
import GlobalsRunBabyTears from "../types/GlobalsRunBabyTears";
import GlobalsRunRoom from "../types/GlobalsRunRoom";
import postNewRoomBabyFunctions from "./postNewRoomBabies";
import * as postRender from "./postRender";

export function main(): void {
  crashLog("MC_POST_NEW_ROOM", true);

  // Update some cached API functions to avoid crashing
  g.l = g.g.GetLevel();
  g.r = g.g.GetRoom();
  const player = Isaac.GetPlayer();
  if (player !== null) {
    g.p = player;
  }
  g.seeds = g.g.GetSeeds();
  g.itemPool = g.g.GetItemPool();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;

  log(
    `MC_POST_NEW_ROOM - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

  // Make sure the callbacks run in the right order
  // (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if (
    gameFrameCount === 0 ||
    g.run.level.stage !== stage ||
    g.run.level.stageType !== stageType
  ) {
    crashLog("MC_POST_NEW_ROOM", false);
    return;
  }

  newRoom();

  crashLog("MC_POST_NEW_ROOM", false);
}

export function newRoom(): void {
  crashLog("MC_POST_NEW_ROOM2", true);

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const roomIndex = getRoomIndex();

  log(
    `MC_POST_NEW_ROOM_2 - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

  // Increment level variables
  g.run.level.roomsEntered += 1;
  if (roomIndex === startingRoomIndex && g.run.level.roomsEntered === 1) {
    // We don't want the starting room of the floor to count towards the rooms entered
    g.run.level.roomsEntered = 0;
  }

  // Reset room-related variables
  g.run.room = new GlobalsRunRoom(roomIndex, roomClear, roomSeed);

  // Reset baby-specific variables
  g.run.babyCountersRoom = 0;
  g.run.babyTears = new GlobalsRunBabyTears();

  // Do nothing if we are not a baby
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    crashLog("MC_POST_NEW_ROOM2", false);
    return;
  }

  // Reset the player's sprite, just in case it got messed up
  postRender.setPlayerSprite();

  stopDrawingBabyIntroText();
  applyTemporaryEffects(babyType);

  crashLog("MC_POST_NEW_ROOM2", false);
}

function stopDrawingBabyIntroText() {
  if (g.run.drawIntro) {
    g.run.drawIntro = false;
  }
}

function applyTemporaryEffects(babyType: int) {
  // Apply baby-specific temporary effects
  const babyFunc = postNewRoomBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc();
  }
}
