import { RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Luna. */
export class BabyIsYou extends Baby {
  /** Should only be valid on a floor with a Secret Room. */
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SECRET);
  }
}
