import { GridRoom } from "isaac-typescript-definitions";
import {
  game,
  getRoomGridIndex,
  getRoomStageID,
  getRoomSubType,
  getRoomType,
  getRoomVariant,
  log,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
}

function main() {
  const gameFrameCount = game.GetFrameCount();
  const level = game.GetLevel();
  const stage = level.GetStage();
  const stageType = level.GetStageType();
  const renderFrameCount = Isaac.GetFrameCount();
  const roomStageID = getRoomStageID();
  const roomType = getRoomType();
  const roomVariant = getRoomVariant();
  const roomSubType = getRoomSubType();
  const roomGridIndex = getRoomGridIndex();
  const roomGridIndexSuffix =
    roomGridIndex >= 0 ? "" : ` (GridRoom.${GridRoom[roomGridIndex]})`;

  log(
    `MC_POST_NEW_ROOM_REORDERED - Room: ${roomType}.${roomVariant}.${roomSubType} - Stage ID: ${roomStageID} - Stage: ${stage}.${stageType} - Grid index: ${roomGridIndex}${roomGridIndexSuffix} - Game frame: ${gameFrameCount} - Render frame: ${renderFrameCount}`,
  );

  // Do nothing if we are not a baby.
  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }

  stopDrawingBabyIntroText();
}

function stopDrawingBabyIntroText() {
  if (g.run.drawIntro) {
    g.run.drawIntro = false;
  }
}
