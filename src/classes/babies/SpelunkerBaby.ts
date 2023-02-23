import {
  Direction,
  GridRoom,
  RoomTransitionAnim,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  teleport,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Stud Finder; Crawlspace --> Black Market. */
export class SpelunkerBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const level = game.GetLevel();
    const previousRoomGridIndex = level.GetPreviousRoomIndex();
    const room = game.GetRoom();
    const roomType = room.GetType();

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
