import {
  GridEntityType,
  LevelCurse,
  LevelStage,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  changeRoom,
  getEffectiveStage,
  getRoomGridIndexesForType,
  hasFlag,
  inStartingRoom,
  ModCallbackCustom,
  onRepentanceStage,
  removeGridEntity,
  spawnGridEntity,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Floors are reversed. */
export class EyebatBaby extends Baby {
  /**
   * - We don't want this on the first floor since it interferes with resetting.
   * - We don't want to have this on any end floors so that we can simply the logic and always spawn
   *   a trapdoor.
   */
  override isValid(): boolean {
    const curses = g.l.GetCurses();
    const effectiveStage = getEffectiveStage();

    return (
      !hasFlag(curses, LevelCurse.LABYRINTH) &&
      effectiveStage !== LevelStage.BASEMENT_1 &&
      effectiveStage !== LevelStage.DEPTHS_2 &&
      effectiveStage < LevelStage.WOMB_2 &&
      !onRepentanceStage()
    );
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    GridEntityType.TRAPDOOR,
  )
  postGridEntityInitTrapdoor(gridEntity: GridEntity): void {
    const roomType = g.r.GetType();
    if (roomType === RoomType.BOSS) {
      removeGridEntity(gridEntity, false);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!inStartingRoom()) {
      return;
    }

    const isFirstVisit = g.r.IsFirstVisit();

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
      const centerPos = g.r.GetCenterPos();
      spawnGridEntity(GridEntityType.TRAPDOOR, centerPos);
    }
  }
}
