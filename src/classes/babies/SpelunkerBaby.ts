import {
  Direction,
  GridRoom,
  RoomTransitionAnim,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  teleport,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Stud Finder; Crawlspace --> Black Market. */
export class SpelunkerBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.DUNGEON)
  postNewRoomReordered(): void {
    const level = game.GetLevel();
    const previousRoomGridIndex = level.GetPreviousRoomIndex();

    // We want to be able to backtrack from a Black Market to a Crawlspace.
    if (previousRoomGridIndex !== (GridRoom.BLACK_MARKET as int)) {
      teleport(
        GridRoom.BLACK_MARKET,
        Direction.NO_DIRECTION,
        RoomTransitionAnim.WALK,
      );
    }
  }
}
