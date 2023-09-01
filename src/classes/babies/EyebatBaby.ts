import {
  GridEntityType,
  LevelCurse,
  LevelStage,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  changeRoom,
  game,
  getRoomGridIndexesForType,
  hasFlag,
  inRoomType,
  inStartingRoom,
  isGreedMode,
  onAscent,
  onFirstFloor,
  onRepentanceStage,
  onStage,
  onStageOrLower,
  removeGridEntity,
  spawnGridEntity,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Floors are reversed. */
export class EyebatBaby extends Baby {
  /**
   * - We don't want this on the first floor since it interferes with resetting.
   * - We don't want this on Depths 2 because of the special Boss Room mechanic.
   * - We don't want to have this on any end floors so that we can simply the logic and always spawn
   *   a trapdoor.
   * - Floors are already reversed in Ascent.
   * - Does not work in Greed Mode, Blue Womb, and Home.
   */
  override isValid(): boolean {
    const level = game.GetLevel();
    const curses = level.GetCurses();

    return (
      !hasFlag(curses, LevelCurse.LABYRINTH) &&
      !onFirstFloor() &&
      !onStage(LevelStage.DEPTHS_2) &&
      onStageOrLower(LevelStage.WOMB_1) &&
      !onRepentanceStage() &&
      !onAscent() &&
      !isGreedMode() &&
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.HOME, // 13
      )
    );
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    GridEntityType.TRAPDOOR,
  )
  postGridEntityInitTrapdoor(gridEntity: GridEntity): void {
    if (inRoomType(RoomType.BOSS)) {
      removeGridEntity(gridEntity, false);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!inStartingRoom()) {
      return;
    }

    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();

    if (isFirstVisit) {
      const bossRoomIndexes = getRoomGridIndexesForType(RoomType.BOSS);
      if (bossRoomIndexes.length === 0) {
        return;
      }
      const bossRoomIndex = bossRoomIndexes[0];
      if (bossRoomIndex !== undefined) {
        changeRoom(bossRoomIndex);
      }
    } else {
      const centerPos = room.GetCenterPos();
      spawnGridEntity(GridEntityType.TRAPDOOR, centerPos);
    }
  }
}
