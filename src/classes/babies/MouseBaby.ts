import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { pseudoRoomClearPostUpdate } from "../../pseudoRoomClear";
import { Baby } from "../Baby";

/** Coin doors in uncleared rooms. */
export class MouseBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    pseudoRoomClearPostUpdate(RandomBabyType.MOUSE);
  }
}
