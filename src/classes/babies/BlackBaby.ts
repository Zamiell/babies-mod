import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import * as pseudoRoomClear from "../../pseudoRoomClear";
import { Baby } from "../Baby";

/** Curse Room doors in uncleared rooms. */
export class BlackBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    pseudoRoomClear.postUpdate(this.babyType);
  }
}
