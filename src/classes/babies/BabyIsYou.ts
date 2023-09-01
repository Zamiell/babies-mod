import { RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Luna. */
export class BabyIsYou extends Baby {
  /** Removing floors with no Secret Rooms. */
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SECRET);
  }
}
