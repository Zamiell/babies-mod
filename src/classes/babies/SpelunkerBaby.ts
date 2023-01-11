import {
  Direction,
  GridRoom,
  RoomTransitionAnim,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  teleport,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Stud Finder; Crawlspace --> Black Market. */
export class SpelunkerBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const previousRoomGridIndex = g.l.GetPreviousRoomIndex();
    const roomType = g.r.GetType();

    if (
      roomType === RoomType.DUNGEON &&
      // We want to be able to backtrack from a Black Market to a Crawlspace.
      previousRoomGridIndex !== (GridRoom.BLACK_MARKET as int)
    ) {
      teleport(
        GridRoom.BLACK_MARKET,
        Direction.NO_DIRECTION,
        RoomTransitionAnim.WALK,
      );
    }
  }
}
