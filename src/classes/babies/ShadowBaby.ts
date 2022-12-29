import {
  Direction,
  GridRoom,
  RoomTransitionAnim,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  inRoomType,
  ModCallbackCustom,
  teleport,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Devil Rooms / Angel Rooms go to the Black Market instead. */
export class ShadowBaby extends Baby {
  /**
   * Only valid for floors with Devil Rooms. Not valid for floor 8 just in case the Black Market
   * does not have a beam of light to the Cathedral.
   */
  public override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage >= 2 && effectiveStage <= 7;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  private postNewRoomReordered(): void {
    if (inRoomType(RoomType.DEVIL, RoomType.ANGEL)) {
      teleport(
        GridRoom.BLACK_MARKET,
        Direction.NO_DIRECTION,
        RoomTransitionAnim.WALK,
      );
    }
  }
}
