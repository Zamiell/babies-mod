import {
  Direction,
  GridRoom,
  LevelStage,
  RoomTransitionAnim,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  inRoomType,
  onStage,
  onStageWithNaturalDevilRoom,
  teleport,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Devil Rooms / Angel Rooms go to the Black Market instead. */
export class ShadowBaby extends Baby {
  /**
   * Not valid for floor 8 just in case the Black Market does not have a beam of light to the
   * Cathedral.
   */
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom() && !onStage(LevelStage.WOMB_2);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (inRoomType(RoomType.DEVIL, RoomType.ANGEL)) {
      teleport(
        GridRoom.BLACK_MARKET,
        Direction.NO_DIRECTION,
        RoomTransitionAnim.WALK,
      );
    }
  }
}
