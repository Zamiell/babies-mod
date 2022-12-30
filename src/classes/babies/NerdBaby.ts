import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { pseudoRoomClearPostUpdate } from "../../pseudoRoomClear";
import { Baby } from "../Baby";

/** Locked doors in uncleared rooms. */
export class NerdBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    pseudoRoomClearPostUpdate(RandomBabyType.NERD);
  }
}
