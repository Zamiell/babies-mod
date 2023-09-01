import { RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType } from "isaacscript-common";
import { Baby } from "../../Baby";

/** Starts with Devil's Crown. */
export class LilAbaddon extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.TREASURE);
  }
}
