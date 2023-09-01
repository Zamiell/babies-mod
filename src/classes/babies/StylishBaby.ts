import { RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Store Credit. */
export class StylishBaby extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SHOP);
  }
}
