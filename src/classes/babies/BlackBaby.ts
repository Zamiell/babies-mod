import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { pseudoRoomClearPostUpdate } from "../../pseudoRoomClear";
import { Baby } from "../Baby";

/** Curse Room doors in uncleared rooms. */
export class BlackBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    pseudoRoomClearPostUpdate(this.babyType);
  }
}
